-- EcomStore P2P production features. Safe to run more than once.
-- Run after supabase/schema.sql in the Supabase SQL Editor.

alter table public.profiles
  add column if not exists province text,
  add column if not exists bio text,
  add column if not exists avatar_path text,
  add column if not exists cover_path text;

alter table public.vendors
  add column if not exists contact_phone text,
  add column if not exists address text,
  add column if not exists document_path text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists review_note text;

alter table public.products
  add column if not exists location text,
  add column if not exists condition text not null default 'ប្រើរួចស្អាត',
  add column if not exists view_count bigint not null default 0,
  add column if not exists sold_at timestamptz;

alter table public.products drop constraint if exists products_status_check;
alter table public.products add constraint products_status_check
  check (status in ('pending','active','rejected','archived','sold'));

create index if not exists products_vendor_status_idx on public.products(vendor_id,status);
create index if not exists products_public_views_idx on public.products(view_count desc) where status='active';

create table if not exists public.seller_reviews (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now(),
  unique (vendor_id,buyer_id,order_id)
);
create index if not exists seller_reviews_vendor_created_idx
  on public.seller_reviews(vendor_id,created_at desc);

create table if not exists public.saved_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id,product_id)
);
create index if not exists saved_products_user_created_idx
  on public.saved_products(user_id,created_at desc);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  offer_price numeric(12,2) not null check (offer_price > 0),
  message text not null default '',
  status text not null default 'pending' check (status in ('pending','accepted','rejected','withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists offers_buyer_created_idx on public.offers(buyer_id,created_at desc);
create index if not exists offers_vendor_created_idx on public.offers(vendor_id,created_at desc);

alter table public.seller_reviews enable row level security;
alter table public.saved_products enable row level security;
alter table public.offers enable row level security;

drop policy if exists seller_reviews_public_read on public.seller_reviews;
create policy seller_reviews_public_read on public.seller_reviews
  for select using (true);

drop policy if exists saved_products_own_read on public.saved_products;
create policy saved_products_own_read on public.saved_products
  for select using (auth.uid() = user_id);

drop policy if exists offers_participant_read on public.offers;
create policy offers_participant_read on public.offers
  for select using (
    auth.uid() = buyer_id or exists (
      select 1 from public.vendors v where v.id = vendor_id and v.user_id = auth.uid()
    )
  );

-- Profile photos are intentionally public; identity/business documents remain private.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values
  ('profile-media','profile-media',true,5242880,array['image/jpeg','image/png','image/webp']),
  ('seller-verification','seller-verification',false,5242880,array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage writes are performed only through the server-side service-role API.
-- Do not add public upload/read policies to seller-verification.


-- Telegram-backed media metadata. URLs are stable backend proxy routes; Telegram
-- file_path values are never persisted because Telegram download paths expire.
alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists cover_url text,
  add column if not exists avatar_file_id text,
  add column if not exists avatar_message_id text,
  add column if not exists cover_file_id text,
  add column if not exists cover_message_id text;

alter table public.product_images
  add column if not exists image_url text;

alter table public.vendors
  add column if not exists document_url text,
  add column if not exists document_file_id text,
  add column if not exists document_message_id text,
  add column if not exists document_mime_type text;
