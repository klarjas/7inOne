-- Admin-reviewed external image candidates for Smart Product Gallery.
-- Approved images are copied into Telegram through the existing upload pipeline.
create table if not exists public.product_gallery_candidates (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  source_url text not null,
  source_title text not null default '',
  match_score integer not null default 0 check (match_score between 0 and 100),
  match_evidence jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','approved','rejected','failed')),
  telegram_message_id text,
  telegram_file_id text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(product_id, image_url)
);
create index if not exists product_gallery_candidates_status_created_idx
  on public.product_gallery_candidates(status, created_at desc);
create index if not exists product_gallery_candidates_product_idx
  on public.product_gallery_candidates(product_id, status);
alter table public.product_gallery_candidates enable row level security;
revoke all on table public.product_gallery_candidates from anon, authenticated;
grant all privileges on table public.product_gallery_candidates to service_role;
