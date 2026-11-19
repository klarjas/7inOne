-- Detailed category metadata for unified 7inOne marketplace listings.
-- Existing products, product images and Telegram upload records remain untouched.

alter table public.jobs
  add column if not exists detail_type text not null default '',
  add column if not exists specifications jsonb not null default '{}'::jsonb;

create table if not exists public.property_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 2 and 160),
  description text not null default '',
  short_description text not null default '',
  category text not null check (category in (
    'house_sale','house_rent','condo_sale','apartment_rent','land','land_rent',
    'commercial_sale','commercial_rent','room_rent','properties_wanted',
    'agent_services','others_properties'
  )),
  subcategory text not null default '',
  detail_type text not null default '',
  location text not null default '',
  address text not null default '',
  price numeric(14,2) check (price is null or price >= 0),
  price_period text not null default 'total' check (price_period in ('daily','monthly','yearly','total','negotiable')),
  area_sqm numeric(14,2) check (area_sqm is null or area_sqm >= 0),
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  bathrooms integer check (bathrooms is null or bathrooms >= 0),
  specifications jsonb not null default '{}'::jsonb,
  image_file_id text,
  image_message_id text,
  image_mime_type text,
  status text not null default 'active' check (status in ('active','closed','sold','rented','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists property_listings_public_feed_idx
  on public.property_listings(status, category, created_at desc);
create index if not exists property_listings_owner_feed_idx
  on public.property_listings(user_id, created_at desc);

alter table public.property_listings enable row level security;
drop policy if exists property_listings_public_read_active on public.property_listings;
create policy property_listings_public_read_active on public.property_listings
  for select using (status = 'active');
drop policy if exists property_listings_owner_read_all on public.property_listings;
create policy property_listings_owner_read_all on public.property_listings
  for select using (auth.uid() = user_id);
drop policy if exists property_listings_owner_insert on public.property_listings;
create policy property_listings_owner_insert on public.property_listings
  for insert with check (auth.uid() = user_id);
drop policy if exists property_listings_owner_update on public.property_listings;
create policy property_listings_owner_update on public.property_listings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists property_listings_owner_delete on public.property_listings;
create policy property_listings_owner_delete on public.property_listings
  for delete using (auth.uid() = user_id);

-- Detailed product taxonomy is stored separately so the existing products table
-- and its image upload / ordering lifecycle are not changed.
create table if not exists public.product_listing_details (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  category text not null default '',
  subcategory text not null default '',
  detail_type text not null default '',
  specifications jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_listing_details enable row level security;
drop policy if exists product_listing_details_public_read on public.product_listing_details;
create policy product_listing_details_public_read on public.product_listing_details
  for select using (true);
drop policy if exists product_listing_details_owner_manage on public.product_listing_details;
create policy product_listing_details_owner_manage on public.product_listing_details
  for all using (
    exists (
      select 1 from public.products p
      join public.vendors v on v.id = p.vendor_id
      where p.id = product_listing_details.product_id and v.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.products p
      join public.vendors v on v.id = p.vendor_id
      where p.id = product_listing_details.product_id and v.user_id = auth.uid()
    )
  );
