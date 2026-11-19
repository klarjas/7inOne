-- 7inOne photo Stories: visible for 24 hours, media stored in Telegram.
create table if not exists public.social_stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  image_file_id text not null,
  image_message_id text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours'),
  constraint social_stories_expiry_after_creation check (expires_at > created_at)
);
create index if not exists social_stories_active_idx
  on public.social_stories(expires_at desc, created_at desc);
create index if not exists social_stories_user_idx
  on public.social_stories(user_id, created_at desc);

alter table public.social_stories enable row level security;
revoke all on public.social_stories from anon, authenticated;
grant all on public.social_stories to service_role;
