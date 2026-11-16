-- 7inOne Telegram account linking and password verification
-- Run once in Supabase SQL Editor for the 7inOne project.

create table if not exists public.telegram_account_links (
  user_id uuid primary key references auth.users(id) on delete cascade,
  account_email text,
  telegram_user_id bigint not null unique,
  username text,
  first_name text,
  linked_at timestamptz not null default now()
);

create unique index if not exists telegram_account_links_email_idx
  on public.telegram_account_links(lower(account_email)) where account_email is not null;

create table if not exists public.telegram_link_tokens (
  token_hash text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists telegram_link_tokens_user_idx
  on public.telegram_link_tokens(user_id, created_at desc);

create table if not exists public.telegram_password_otps (
  user_id uuid primary key references auth.users(id) on delete cascade,
  otp_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0 check (attempts >= 0 and attempts <= 5),
  created_at timestamptz not null default now()
);

-- These tables are accessed only by the backend service-role client.
alter table public.telegram_account_links enable row level security;
alter table public.telegram_link_tokens enable row level security;
alter table public.telegram_password_otps enable row level security;

revoke all on public.telegram_account_links from anon, authenticated;
revoke all on public.telegram_link_tokens from anon, authenticated;
revoke all on public.telegram_password_otps from anon, authenticated;

grant all on public.telegram_account_links to service_role;
grant all on public.telegram_link_tokens to service_role;
grant all on public.telegram_password_otps to service_role;
