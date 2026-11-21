-- Stable, short public-facing shop IDs. Internal vendor UUIDs remain unchanged.
alter table public.vendors add column if not exists public_shop_id text;

create sequence if not exists public.vendor_shop_id_seq;

with numbered as (
  select id,
         upper(left(coalesce(nullif(btrim(store_name), ''), 'S'), 1))
           || lpad(row_number() over (order by created_at asc, id asc)::text, 3, '0') as shop_code
  from public.vendors
  where public_shop_id is null
)
update public.vendors v
set public_shop_id = numbered.shop_code
from numbered
where v.id = numbered.id;

create unique index if not exists vendors_public_shop_id_uidx
  on public.vendors (public_shop_id);

select setval(
  'public.vendor_shop_id_seq',
  coalesce(max(substring(public_shop_id from '[0-9]+$')::bigint), 1),
  count(*) > 0
)
from public.vendors;

create or replace function public.assign_public_shop_id()
returns trigger
language plpgsql
as $$
begin
  if new.public_shop_id is null or btrim(new.public_shop_id) = '' then
    new.public_shop_id :=
      upper(left(coalesce(nullif(btrim(new.store_name), ''), 'S'), 1))
      || lpad(nextval('public.vendor_shop_id_seq')::text, 3, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_assign_public_shop_id on public.vendors;
create trigger trg_assign_public_shop_id
before insert on public.vendors
for each row
execute function public.assign_public_shop_id();

grant usage, select on sequence public.vendor_shop_id_seq to service_role;
