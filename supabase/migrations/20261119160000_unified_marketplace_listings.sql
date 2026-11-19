-- Unified marketplace listing sources for 7inOne.
-- Products remain in public.products. Jobs, rentals and land listings are independent tables.
-- The existing product Telegram image-upload flow and product endpoints are intentionally untouched.

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 2 and 160),
  company_name text not null default '',
  description text not null default '',
  short_description text not null default '',
  category text not null default 'other',
  subcategory text not null default '',
  location text not null default '',
  vacancies integer not null default 1 check (vacancies > 0),
  salary_min numeric(12,2),
  salary_max numeric(12,2),
  salary_period text not null default 'monthly' check (salary_period in ('hourly','daily','monthly','negotiable')),
  employment_type text not null default 'full_time',
  work_schedule text not null default '',
  days_off text not null default '',
  experience text not null default '',
  education text not null default '',
  skills text[] not null default '{}',
  languages text[] not null default '{}',
  benefits text[] not null default '{}',
  image_file_id text,
  image_message_id text,
  image_mime_type text,
  status text not null default 'active' check (status in ('active','closed','archived')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint jobs_salary_range_check check (salary_min is null or salary_max is null or salary_max >= salary_min)
);

create table if not exists public.rentals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 2 and 160),
  description text not null default '',
  short_description text not null default '',
  category text not null default 'house',
  property_type text not null default 'house',
  location text not null default '',
  address text not null default '',
  rent_amount numeric(12,2) not null check (rent_amount >= 0),
  rent_period text not null default 'monthly' check (rent_period in ('daily','monthly','yearly')),
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  bathrooms integer check (bathrooms is null or bathrooms >= 0),
  area_sqm numeric(12,2) check (area_sqm is null or area_sqm >= 0),
  furnished boolean,
  image_file_id text,
  image_message_id text,
  image_mime_type text,
  status text not null default 'active' check (status in ('active','rented','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.land_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 2 and 160),
  description text not null default '',
  short_description text not null default '',
  category text not null default 'land',
  location text not null default '',
  address text not null default '',
  price numeric(14,2) not null check (price >= 0),
  area_sqm numeric(14,2) check (area_sqm is null or area_sqm >= 0),
  land_type text not null default '',
  title_deed text not null default '',
  road_access text not null default '',
  image_file_id text,
  image_message_id text,
  image_mime_type text,
  status text not null default 'active' check (status in ('active','sold','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists jobs_public_feed_idx on public.jobs(status, created_at desc);
create index if not exists jobs_owner_feed_idx on public.jobs(user_id, created_at desc);
create index if not exists rentals_public_feed_idx on public.rentals(status, created_at desc);
create index if not exists rentals_owner_feed_idx on public.rentals(user_id, created_at desc);
create index if not exists land_listings_public_feed_idx on public.land_listings(status, created_at desc);
create index if not exists land_listings_owner_feed_idx on public.land_listings(user_id, created_at desc);

alter table public.jobs enable row level security;
alter table public.rentals enable row level security;
alter table public.land_listings enable row level security;

drop policy if exists jobs_public_read_active on public.jobs;
create policy jobs_public_read_active on public.jobs
  for select using (status = 'active' and (expires_at is null or expires_at > now()));
drop policy if exists jobs_owner_read_all on public.jobs;
create policy jobs_owner_read_all on public.jobs
  for select using (auth.uid() = user_id);
drop policy if exists jobs_owner_insert on public.jobs;
create policy jobs_owner_insert on public.jobs
  for insert with check (auth.uid() = user_id);
drop policy if exists jobs_owner_update on public.jobs;
create policy jobs_owner_update on public.jobs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists jobs_owner_delete on public.jobs;
create policy jobs_owner_delete on public.jobs
  for delete using (auth.uid() = user_id);

drop policy if exists rentals_public_read_active on public.rentals;
create policy rentals_public_read_active on public.rentals
  for select using (status = 'active');
drop policy if exists rentals_owner_read_all on public.rentals;
create policy rentals_owner_read_all on public.rentals
  for select using (auth.uid() = user_id);
drop policy if exists rentals_owner_insert on public.rentals;
create policy rentals_owner_insert on public.rentals
  for insert with check (auth.uid() = user_id);
drop policy if exists rentals_owner_update on public.rentals;
create policy rentals_owner_update on public.rentals
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists rentals_owner_delete on public.rentals;
create policy rentals_owner_delete on public.rentals
  for delete using (auth.uid() = user_id);

drop policy if exists land_public_read_active on public.land_listings;
create policy land_public_read_active on public.land_listings
  for select using (status = 'active');
drop policy if exists land_owner_read_all on public.land_listings;
create policy land_owner_read_all on public.land_listings
  for select using (auth.uid() = user_id);
drop policy if exists land_owner_insert on public.land_listings;
create policy land_owner_insert on public.land_listings
  for insert with check (auth.uid() = user_id);
drop policy if exists land_owner_update on public.land_listings;
create policy land_owner_update on public.land_listings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists land_owner_delete on public.land_listings;
create policy land_owner_delete on public.land_listings
  for delete using (auth.uid() = user_id);
