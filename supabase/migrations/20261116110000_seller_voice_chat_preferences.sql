alter table public.seller_messages
  add column if not exists message_type text not null default 'text',
  add column if not exists telegram_file_id text,
  add column if not exists telegram_message_id bigint,
  add column if not exists mime_type text,
  add column if not exists duration_seconds integer;

alter table public.seller_messages
  drop constraint if exists seller_messages_message_type_check;
alter table public.seller_messages
  add constraint seller_messages_message_type_check
  check (message_type in ('text','voice'));

alter table public.seller_messages
  drop constraint if exists seller_messages_voice_metadata_check;
alter table public.seller_messages
  add constraint seller_messages_voice_metadata_check
  check (
    (message_type = 'text' and telegram_file_id is null and duration_seconds is null)
    or
    (message_type = 'voice' and telegram_file_id is not null and duration_seconds between 1 and 180)
  );

create table if not exists public.seller_chat_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  muted boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.seller_chat_preferences enable row level security;
drop policy if exists "Users can read own seller chat preferences" on public.seller_chat_preferences;
create policy "Users can read own seller chat preferences"
  on public.seller_chat_preferences for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert own seller chat preferences" on public.seller_chat_preferences;
create policy "Users can insert own seller chat preferences"
  on public.seller_chat_preferences for insert to authenticated
  with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update own seller chat preferences" on public.seller_chat_preferences;
create policy "Users can update own seller chat preferences"
  on public.seller_chat_preferences for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
grant select, insert, update on public.seller_chat_preferences to authenticated;
