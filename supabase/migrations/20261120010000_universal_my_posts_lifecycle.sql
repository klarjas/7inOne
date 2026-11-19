-- Universal My Posts lifecycle fields for non-product marketplace listings.
-- Existing rows remain visible: NULL expires_at means no expiry was previously assigned.
alter table public.jobs add column if not exists expires_at timestamptz;
alter table public.property_listings add column if not exists expires_at timestamptz;
alter table public.rentals add column if not exists expires_at timestamptz;
alter table public.land_listings add column if not exists expires_at timestamptz;
alter table public.house_sale_listings add column if not exists expires_at timestamptz;

create index if not exists property_listings_owner_expiry_idx on public.property_listings(user_id, expires_at);
create index if not exists rentals_owner_expiry_idx on public.rentals(user_id, expires_at);
create index if not exists land_listings_owner_expiry_idx on public.land_listings(user_id, expires_at);
create index if not exists house_sale_listings_owner_expiry_idx on public.house_sale_listings(user_id, expires_at);

-- Service-role API also checks expiry; these policies keep direct authenticated reads consistent.
drop policy if exists rentals_public_read_active on public.rentals;
create policy rentals_public_read_active on public.rentals
  for select using (status = 'active' and (expires_at is null or expires_at > now()));

drop policy if exists land_listings_public_read_active on public.land_listings;
create policy land_listings_public_read_active on public.land_listings
  for select using (status = 'active' and (expires_at is null or expires_at > now()));

drop policy if exists house_sale_public_read_active on public.house_sale_listings;
create policy house_sale_public_read_active on public.house_sale_listings
  for select using (status = 'active' and (expires_at is null or expires_at > now()));

drop policy if exists property_listings_public_read_active on public.property_listings;
create policy property_listings_public_read_active on public.property_listings
  for select using (status = 'active' and (expires_at is null or expires_at > now()));
