-- Product variants for 7inOne marketplace.
-- Additive only: existing products, product_images and Telegram upload flows are unchanged.

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null default '',
  option_name text not null default 'ជម្រើស',
  option_value text not null,
  price numeric(14,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  attributes jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_variants_option_value_nonempty check (char_length(trim(option_value)) > 0)
);

create index if not exists product_variants_product_active_sort_idx
  on public.product_variants(product_id, is_active, sort_order, price);

create unique index if not exists product_variants_product_sku_unique
  on public.product_variants(product_id, sku)
  where sku <> '';

alter table public.product_variants enable row level security;

drop policy if exists product_variants_public_read_active on public.product_variants;
create policy product_variants_public_read_active
  on public.product_variants for select
  using (
    is_active = true and exists (
      select 1 from public.products p
      where p.id = product_variants.product_id and p.status = 'active'
    )
  );

drop policy if exists product_variants_owner_manage on public.product_variants;
create policy product_variants_owner_manage
  on public.product_variants for all
  using (
    exists (
      select 1 from public.products p
      join public.vendors v on v.id = p.vendor_id
      where p.id = product_variants.product_id and v.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.products p
      join public.vendors v on v.id = p.vendor_id
      where p.id = product_variants.product_id and v.user_id = auth.uid()
    )
  );

alter table public.order_items
  add column if not exists variant_id uuid references public.product_variants(id) on delete set null,
  add column if not exists variant_label text,
  add column if not exists variant_sku text;

create index if not exists order_items_variant_id_idx
  on public.order_items(variant_id)
  where variant_id is not null;
