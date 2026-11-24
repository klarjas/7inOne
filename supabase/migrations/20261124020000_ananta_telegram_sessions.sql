-- ANANTA Telegram-only learning sessions (free mode; no model-training worker).
create table if not exists public.assistant_telegram_sessions (
  telegram_user_id text primary key,
  space_id uuid not null references public.assistant_knowledge_spaces(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create index if not exists assistant_telegram_sessions_space_idx
  on public.assistant_telegram_sessions (space_id, updated_at desc);
alter table public.assistant_telegram_sessions enable row level security;
revoke all on public.assistant_telegram_sessions from public, anon, authenticated;
grant all on public.assistant_telegram_sessions to service_role;
