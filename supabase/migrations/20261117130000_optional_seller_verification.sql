-- approved = verified; pending/rejected = active unverified; blocked = disabled.
-- Keep vendor verification documents private: the public products policy checks
-- seller eligibility through a private SECURITY DEFINER helper instead of
-- broadening the public vendors row policy.
create schema if not exists private;
create or replace function private.is_marketplace_vendor_active(p_vendor_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1 from public.vendors v
    where v.id = p_vendor_id
      and v.status in ('approved','pending','rejected')
  );
$function$;
revoke all on function private.is_marketplace_vendor_active(uuid) from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_marketplace_vendor_active(uuid) to anon, authenticated;

drop policy if exists "products_read_active" on public.products;
create policy "products_read_active" on public.products for select using (
  status = 'active'
  and renewed_at >= now() - interval '7 days'
  and (select private.is_marketplace_vendor_active(vendor_id))
);

drop policy if exists "product_images_read_public" on public.product_images;
create policy "product_images_read_public" on public.product_images for select using (
  exists (
    select 1 from public.products p
    where p.id = product_id
      and p.status = 'active'
      and p.renewed_at >= now() - interval '7 days'
      and (select private.is_marketplace_vendor_active(p.vendor_id))
  )
);

-- Keep the checkout's atomic stock validation while allowing unverified sellers.
create or replace function public.place_marketplace_order(
  p_customer_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_delivery_address text,
  p_delivery_note text,
  p_payment_method text,
  p_items jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_total numeric(12,2) := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty integer;
begin
  if coalesce(auth.jwt()->>'role', '') <> 'service_role'
    and (auth.uid() is null or auth.uid() <> p_customer_id) then
    raise exception 'Authentication required';
  end if;
  if length(trim(coalesce(p_customer_name,''))) < 2 then raise exception 'Customer name is required'; end if;
  if length(trim(coalesce(p_customer_phone,''))) < 6 then raise exception 'Valid phone number is required'; end if;
  if length(trim(coalesce(p_delivery_address,''))) < 5 then raise exception 'Delivery address is required'; end if;
  if p_payment_method not in ('cash_on_delivery','bank_transfer') then raise exception 'Invalid payment method'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 50 then
    raise exception 'Cart is empty or too large';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::integer;
    if v_qty < 1 or v_qty > 99 then raise exception 'Invalid quantity'; end if;
    select p.* into v_product
    from public.products p
    join public.vendors v on v.id = p.vendor_id
    where p.id = (v_item->>'product_id')::uuid
      and p.status = 'active' and v.status in ('approved','pending','rejected')
      and p.renewed_at >= now() - interval '7 days'
    for update of p;
    if not found then raise exception 'A product is no longer available'; end if;
    if v_product.stock < v_qty then raise exception 'Insufficient stock for %', v_product.title; end if;
    v_total := v_total + (v_product.price * v_qty);
  end loop;

  insert into public.orders(customer_id, customer_name, customer_phone, delivery_address,
    delivery_note, payment_method, payment_status, total)
  values(p_customer_id, trim(p_customer_name), trim(p_customer_phone), trim(p_delivery_address),
    nullif(trim(coalesce(p_delivery_note,'')),''), p_payment_method,
    case when p_payment_method = 'bank_transfer' then 'pending_verification' else 'unpaid' end,
    v_total)
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::integer;
    select p.* into v_product from public.products p
    where p.id = (v_item->>'product_id')::uuid for update;
    update public.products set stock = stock - v_qty, updated_at = now() where id = v_product.id;
    insert into public.order_items(order_id, product_id, vendor_id, quantity, unit_price)
    values(v_order_id, v_product.id, v_product.vendor_id, v_qty, v_product.price);
  end loop;
  return v_order_id;
end;
$;

-- Only signed-in customers (for their own user ID) and the trusted server role may execute checkout.
revoke all on function public.place_marketplace_order(uuid,text,text,text,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.place_marketplace_order(uuid,text,text,text,text,text,jsonb) to service_role;
