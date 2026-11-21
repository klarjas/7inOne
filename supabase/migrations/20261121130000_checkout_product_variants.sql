-- Make checkout validate and reserve the selected product variant server-side.
-- Prices, SKU and stock are read from the database; client-submitted prices are never trusted.

create or replace function public.place_marketplace_order(
  p_customer_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_delivery_address text,
  p_delivery_note text,
  p_payment_method text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_order_id uuid;
  v_total numeric(12,2) := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_variant public.product_variants%rowtype;
  v_variant_id uuid;
  v_qty integer;
  v_unit_price numeric(14,2);
  v_variant_label text;
  v_variant_sku text;
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

  -- Validate every product and selected variant before creating the order.
  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::integer;
    if v_qty < 1 or v_qty > 99 then raise exception 'Invalid quantity'; end if;
    select p.* into v_product
    from public.products p
    join public.vendors v on v.id = p.vendor_id
    where p.id = (v_item->>'product_id')::uuid
      and p.status = 'active'
      and v.status in ('approved','pending','rejected')
      and v.user_id <> p_customer_id
      and p.renewed_at >= now() - interval '7 days'
    for update of p;
    if not found then raise exception 'A product is no longer available or cannot be purchased by its owner'; end if;
    if v_product.stock < v_qty then raise exception 'Insufficient stock for %', v_product.title; end if;

    v_variant_id := nullif(v_item->>'variant_id','')::uuid;
    if v_variant_id is not null then
      select * into v_variant
      from public.product_variants
      where id = v_variant_id and product_id = v_product.id and is_active = true
      for update;
      if not found then raise exception 'The selected product option is no longer available'; end if;
      if v_variant.stock < v_qty then raise exception 'Insufficient stock for selected option %', v_variant.option_value; end if;
      v_unit_price := v_variant.price;
    else
      v_unit_price := v_product.price;
    end if;
    v_total := v_total + (v_unit_price * v_qty);
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
    v_variant_id := nullif(v_item->>'variant_id','')::uuid;
    select p.* into v_product from public.products p
    where p.id = (v_item->>'product_id')::uuid for update;

    v_variant_label := null;
    v_variant_sku := null;
    if v_variant_id is not null then
      select * into v_variant from public.product_variants
      where id = v_variant_id and product_id = v_product.id and is_active = true
      for update;
      if not found or v_variant.stock < v_qty then raise exception 'Selected option stock changed; please try again'; end if;
      v_unit_price := v_variant.price;
      v_variant_label := concat_ws(': ', nullif(v_variant.option_name,''), v_variant.option_value);
      v_variant_sku := nullif(v_variant.sku,'');
      update public.product_variants
      set stock = stock - v_qty, updated_at = now()
      where id = v_variant_id;
    else
      v_unit_price := v_product.price;
    end if;

    update public.products set stock = stock - v_qty, updated_at = now() where id = v_product.id;
    insert into public.order_items(order_id, product_id, vendor_id, quantity, unit_price, variant_id, variant_label, variant_sku)
    values(v_order_id, v_product.id, v_product.vendor_id, v_qty, v_unit_price, v_variant_id, v_variant_label, v_variant_sku);
  end loop;
  return v_order_id;
end;
$function$;
