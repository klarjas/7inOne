-- 7inOne Telegram Login Widget profile linking and replay protection
-- Safe to run more than once. Run in the 7inOne Supabase SQL Editor.

begin;

alter table public.profiles
  add column if not exists telegram_id bigint,
  add column if not exists telegram_username text;

-- A Telegram account can belong to only one 7inOne profile.
create unique index if not exists profiles_telegram_id_uidx
  on public.profiles (telegram_id)
  where telegram_id is not null;

-- Preserve existing Bot-based links so older Admin/Vendor accounts can sign in
-- with the same Telegram account without creating a second 7inOne identity.
do $$
begin
  if to_regclass('public.telegram_account_links') is not null then
    execute $backfill$
      update public.profiles p
      set telegram_id = l.telegram_user_id,
          telegram_username = coalesce(p.telegram_username, l.username)
      from public.telegram_account_links l
      where l.user_id = p.id
        and p.telegram_id is null
    $backfill$;
  end if;
end
$$;

-- Single-use proof records prevent replaying a copied Telegram Widget payload.
create table if not exists public.telegram_widget_auth_events (
  auth_hash text primary key,
  telegram_id bigint not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists telegram_widget_auth_events_expiry_idx
  on public.telegram_widget_auth_events (expires_at);

alter table public.telegram_widget_auth_events enable row level security;
revoke all on public.telegram_widget_auth_events from anon, authenticated;
grant all on public.telegram_widget_auth_events to service_role;

commit;
