create table if not exists public.product_gift_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  gift_key text not null,
  gift_name text not null,
  file_id text not null,
  telegram_message_id text not null,
  mime_type text not null default 'image/jpeg',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_gift_images_product_key_unique unique (product_id, gift_key)
);
create index if not exists product_gift_images_product_id_idx on public.product_gift_images (product_id);
alter table public.product_gift_images enable row level security;
