-- Admin-only supplier metadata for marketplace products.
-- Public product and variant tables remain unchanged; supplier data is stored separately.

create table if not exists public.product_supplier_sources (
  product_id uuid primary key references public.products(id) on delete cascade,
  supplier_name text not null default '',
  supplier_url text not null default '',
  supplier_price numeric(14,2) not null default 0 check (supplier_price >= 0),
  supplier_product_code text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_supplier_sources_supplier_name_idx
  on public.product_supplier_sources(supplier_name);

alter table public.product_supplier_sources enable row level security;

-- Intentionally no anon/authenticated policies. Access is through backend routes
-- protected by authenticate + requireAdmin and the server-side service-role client.
revoke all on table public.product_supplier_sources from anon, authenticated;

-- Backend accesses this table with the Supabase service-role client.
grant all privileges on table public.product_supplier_sources to service_role;
