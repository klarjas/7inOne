-- Security hardening for marketplace checkout, order cancellation and Telegram OTP.
-- Apply this migration after 20261117130000_optional_seller_verification.sql.

-- Prevent a buyer from checking out products owned by their own seller account.
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
      and p.status = 'active'
      and v.status in ('approved','pending','rejected')
      and v.user_id <> p_customer_id
      and p.renewed_at >= now() - interval '7 days'
    for update of p;
    if not found then raise exception 'A product is no longer available or cannot be purchased by its owner'; end if;
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
$$;

revoke all on function public.place_marketplace_order(uuid,text,text,text,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.place_marketplace_order(uuid,text,text,text,text,text,jsonb) to service_role;

-- Keep mixed completed/cancelled orders from remaining pending. Restock only
-- items transitioning into cancelled, inside the same database transaction.
create or replace function public.update_vendor_order_fulfillment(
  p_order_id uuid,
  p_vendor_id uuid,
  p_status text
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item record;
  v_aggregate text;
begin
  if p_status not in ('processing','shipped','completed','cancelled') then
    raise exception 'Invalid order status';
  end if;

  perform 1 from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if not exists (select 1 from public.order_items where order_id = p_order_id and vendor_id = p_vendor_id) then
    raise exception 'Order not found for this store';
  end if;

  for v_item in
    select id, product_id, quantity, fulfillment_status
    from public.order_items
    where order_id = p_order_id and vendor_id = p_vendor_id
    for update
  loop
    if v_item.fulfillment_status = 'cancelled' and p_status <> 'cancelled' then
      raise exception 'A cancelled item cannot be reopened';
    end if;
    if p_status = 'cancelled' and v_item.fulfillment_status in ('shipped','completed') then
      raise exception 'Shipped or completed items cannot be cancelled';
    end if;
    if p_status = 'cancelled' and v_item.fulfillment_status <> 'cancelled' then
      update public.products
      set stock = stock + v_item.quantity, updated_at = now()
      where id = v_item.product_id;
    end if;
    update public.order_items
    set fulfillment_status = p_status
    where id = v_item.id;
  end loop;

  select case
    when count(*) > 0 and bool_and(fulfillment_status = 'cancelled') then 'cancelled'
    when count(*) > 0
      and bool_and(fulfillment_status in ('completed','cancelled'))
      and bool_or(fulfillment_status = 'completed') then 'completed'
    when bool_or(fulfillment_status = 'shipped') then 'shipped'
    when bool_or(fulfillment_status = 'processing') then 'processing'
    else 'pending'
  end into v_aggregate
  from public.order_items
  where order_id = p_order_id;

  update public.orders
  set status = v_aggregate, updated_at = now()
  where id = p_order_id;
  return v_aggregate;
end;
$$;

revoke all on function public.update_vendor_order_fulfillment(uuid,uuid,text) from public, anon, authenticated;
grant execute on function public.update_vendor_order_fulfillment(uuid,uuid,text) to service_role;

-- Admin cancellation returns stock only for items that have not shipped or
-- completed. Repeated cancellation is idempotent and cannot restock twice.
create or replace function public.admin_cancel_marketplace_order(
  p_order_id uuid,
  p_payment_status text default null
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item record;
begin
  if p_payment_status is not null
    and p_payment_status not in ('unpaid','pending_verification','paid','refunded') then
    raise exception 'Invalid payment status';
  end if;

  perform 1 from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;

  for v_item in
    select id, product_id, quantity, fulfillment_status
    from public.order_items
    where order_id = p_order_id
    for update
  loop
    if v_item.fulfillment_status not in ('cancelled','shipped','completed') then
      update public.products
      set stock = stock + v_item.quantity, updated_at = now()
      where id = v_item.product_id;
      update public.order_items
      set fulfillment_status = 'cancelled'
      where id = v_item.id;
    end if;
  end loop;

  update public.orders
  set status = 'cancelled',
      payment_status = coalesce(p_payment_status, payment_status),
      updated_at = now()
  where id = p_order_id;
  return true;
end;
$$;

revoke all on function public.admin_cancel_marketplace_order(uuid,text) from public, anon, authenticated;
grant execute on function public.admin_cancel_marketplace_order(uuid,text) to service_role;

-- OTP attempts are incremented atomically and lock the account for 15 minutes
-- after five incorrect submissions. New codes cannot clear an active lock.
alter table public.telegram_password_otps
  add column if not exists locked_until timestamptz;

-- Serialize OTP issuance for each account so simultaneous requests cannot
-- replace each other's codes or reset the attempt counter.
create or replace function public.issue_telegram_password_otp(
  p_user_id uuid,
  p_otp_hash text,
  p_expires_at timestamptz,
  p_created_at timestamptz
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing public.telegram_password_otps%rowtype;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));

  select * into v_existing
  from public.telegram_password_otps
  where user_id = p_user_id
  for update;

  if found then
    if v_existing.locked_until is not null and v_existing.locked_until > now() then
      return false;
    end if;
    if coalesce(v_existing.attempts, 0) >= 5 and v_existing.locked_until is null then
      update public.telegram_password_otps
      set locked_until = now() + interval '15 minutes'
      where user_id = p_user_id;
      return false;
    end if;
    if v_existing.expires_at > now() then
      return false;
    end if;
  end if;

  insert into public.telegram_password_otps(user_id, otp_hash, expires_at, attempts, locked_until, created_at)
  values(p_user_id, p_otp_hash, p_expires_at, 0, null, p_created_at)
  on conflict (user_id) do update
    set otp_hash = excluded.otp_hash,
        expires_at = excluded.expires_at,
        attempts = 0,
        locked_until = null,
        created_at = excluded.created_at;

  return true;
end;
$$;

revoke all on function public.issue_telegram_password_otp(uuid,text,timestamptz,timestamptz) from public, anon, authenticated;
grant execute on function public.issue_telegram_password_otp(uuid,text,timestamptz,timestamptz) to service_role;

create or replace function public.record_telegram_password_otp_failure(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempts integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));

  update public.telegram_password_otps
  set attempts = coalesce(attempts, 0) + 1,
      locked_until = case
        when coalesce(attempts, 0) + 1 >= 5 then now() + interval '15 minutes'
        else locked_until
      end
  where user_id = p_user_id
  returning attempts into v_attempts;

  if v_attempts is null then
    raise exception 'OTP record not found';
  end if;
  return v_attempts;
end;
$$;

revoke all on function public.record_telegram_password_otp_failure(uuid) from public, anon, authenticated;
grant execute on function public.record_telegram_password_otp_failure(uuid) to service_role;
