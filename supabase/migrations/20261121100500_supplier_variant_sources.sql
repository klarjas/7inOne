-- Per-variant supplier costs and supplier SKUs stay outside public variant rows.
create table if not exists public.product_supplier_variant_sources (
  variant_id uuid primary key references public.product_variants(id) on delete cascade,
  supplier_price numeric(14,2) not null default 0 check (supplier_price >= 0),
  supplier_product_code text not null default '',
  supplier_url text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.product_supplier_variant_sources enable row level security;
revoke all on table public.product_supplier_variant_sources from anon, authenticated;
