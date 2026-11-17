-- One public Live / Video link per seller. Backend writes through the service role.
create table if not exists public.vendor_media_links (
 id uuid primary key default gen_random_uuid(),
 vendor_id uuid not null unique references public.vendors(id) on delete cascade,
 media_url text not null check (char_length(media_url) between 12 and 1000),
 media_type text not null check (media_type in ('live','video')),
 is_active boolean not null default true,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists vendor_media_links_active_updated_idx on public.vendor_media_links(is_active,updated_at desc);
alter table public.vendor_media_links enable row level security;
