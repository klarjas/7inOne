-- 7inOne community photo feed.
-- Apply this migration in Supabase SQL Editor before using the social feed.
create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  caption text not null default '' check (char_length(caption) <= 500),
  image_file_id text not null,
  image_message_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists social_posts_created_at_idx on public.social_posts(created_at desc);

create table if not exists public.social_post_likes (
  post_id uuid not null references public.social_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create index if not exists social_post_likes_user_idx on public.social_post_likes(user_id);

create table if not exists public.social_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.social_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);
create index if not exists social_post_comments_post_created_idx on public.social_post_comments(post_id, created_at);

alter table public.social_posts enable row level security;
alter table public.social_post_likes enable row level security;
alter table public.social_post_comments enable row level security;

revoke all on public.social_posts, public.social_post_likes, public.social_post_comments from anon, authenticated;
grant all on public.social_posts, public.social_post_likes, public.social_post_comments to service_role;
