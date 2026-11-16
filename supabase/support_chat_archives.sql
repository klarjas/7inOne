-- 7inOne website support chat + Telegram TXT.GZ archives
-- All writes are performed by the trusted backend using the service-role client.
-- Browser users can only SELECT their own conversations, messages, and archive metadata.

create table if not exists public.support_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'open' check (status in ('open','closed')),
  last_message_at timestamptz not null default now(),
  last_message_preview text not null default '',
  unread_admin_count integer not null default 0 check (unread_admin_count >= 0),
  unread_user_count integer not null default 0 check (unread_user_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_conversations_user_last_idx
  on public.support_conversations(user_id, last_message_at desc);
create index if not exists support_conversations_admin_last_idx
  on public.support_conversations(status, last_message_at desc);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.support_conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  sender_role text not null check (sender_role in ('user','admin')),
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists support_messages_conversation_created_idx
  on public.support_messages(conversation_id, created_at desc);

create table if not exists public.support_chat_archives (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.support_conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  telegram_file_id text not null,
  telegram_message_id bigint not null,
  file_name text not null,
  message_count integer not null check (message_count > 0),
  archived_from timestamptz not null,
  archived_to timestamptz not null,
  format_version integer not null default 1,
  created_at timestamptz not null default now(),
  constraint support_chat_archives_telegram_file_unique unique (telegram_file_id)
);

create index if not exists support_chat_archives_user_created_idx
  on public.support_chat_archives(user_id, created_at desc);
create index if not exists support_chat_archives_conversation_idx
  on public.support_chat_archives(conversation_id, archived_from);

alter table public.support_conversations enable row level security;
alter table public.support_messages enable row level security;
alter table public.support_chat_archives enable row level security;

drop policy if exists "Users and admins read support conversations" on public.support_conversations;
create policy "Users and admins read support conversations"
  on public.support_conversations for select to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

drop policy if exists "Users and admins read support messages" on public.support_messages;
create policy "Users and admins read support messages"
  on public.support_messages for select to authenticated
  using (
    exists (
      select 1 from public.support_conversations c
      where c.id = support_messages.conversation_id
        and (
          c.user_id = (select auth.uid())
          or exists (
            select 1 from public.profiles p
            where p.id = (select auth.uid()) and p.role = 'admin'
          )
        )
    )
  );

drop policy if exists "Users and admins read support archives" on public.support_chat_archives;
create policy "Users and admins read support archives"
  on public.support_chat_archives for select to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

grant select on public.support_conversations, public.support_messages, public.support_chat_archives to authenticated;
