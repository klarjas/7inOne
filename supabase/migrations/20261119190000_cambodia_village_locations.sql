-- Store official Cambodia administrative location codes (2025) for marketplace listings.
-- Location labels remain in the existing location columns for backward compatibility.
alter table public.jobs
  add column if not exists province_code text not null default '',
  add column if not exists district_code text not null default '',
  add column if not exists commune_code text not null default '',
  add column if not exists village_code text not null default '';

alter table public.property_listings
  add column if not exists province_code text not null default '',
  add column if not exists district_code text not null default '',
  add column if not exists commune_code text not null default '',
  add column if not exists village_code text not null default '';

alter table public.product_listing_details
  add column if not exists province_code text not null default '',
  add column if not exists district_code text not null default '',
  add column if not exists commune_code text not null default '',
  add column if not exists village_code text not null default '';

create index if not exists jobs_village_code_idx
  on public.jobs(village_code) where village_code <> '';
create index if not exists property_listings_village_code_idx
  on public.property_listings(village_code) where village_code <> '';
create index if not exists product_listing_details_village_code_idx
  on public.product_listing_details(village_code) where village_code <> '';

comment on column public.jobs.village_code is 'Official Cambodia village code from Cambodia Geographical List 2025 (MLMUPC / Data EF).';
comment on column public.property_listings.village_code is 'Official Cambodia village code from Cambodia Geographical List 2025 (MLMUPC / Data EF).';
comment on column public.product_listing_details.village_code is 'Official Cambodia village code from Cambodia Geographical List 2025 (MLMUPC / Data EF).';
