-- Stable, human-readable product lookup code for every product.
alter table public.products
  add column if not exists product_code text generated always as
  ('P-' || upper(substr(replace(id::text,'-',''),1,12))) stored;
create unique index if not exists products_product_code_uidx on public.products(product_code);

-- Unlimited product associations per YouTube Short. The backend enforces seller ownership.
create table if not exists public.vendor_media_products (
 id uuid primary key default gen_random_uuid(),
 media_link_id uuid not null references public.vendor_media_links(id) on delete cascade,
 product_id uuid not null references public.products(id) on delete cascade,
 vendor_id uuid not null references public.vendors(id) on delete cascade,
 sort_order integer not null default 0,
 created_at timestamptz not null default now(),
 unique(media_link_id,product_id)
);
create index if not exists vendor_media_products_media_sort_idx
 on public.vendor_media_products(media_link_id,sort_order,created_at);
create index if not exists vendor_media_products_vendor_idx
 on public.vendor_media_products(vendor_id,product_id);
alter table public.vendor_media_products enable row level security;
