-- Assistant knowledge system: isolated tables, no changes to existing marketplace or support-chat tables.
-- Workspace identity is stable; display website branding remains configurable in site_settings.site_branding.
create table if not exists public.assistant_knowledge_spaces (
  id uuid primary key default gen_random_uuid(),
  space_code text not null unique check (space_code = lower(space_code) and space_code ~ '^[a-z0-9_-]{2,64}$'),
  assistant_name text not null default 'ជំនួយការ 7inOne',
  welcome_message text not null default '',
  telegram_chat_id bigint,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assistant_knowledge_entries (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.assistant_knowledge_spaces(id) on delete cascade,
  title text not null,
  content text not null,
  category text not null default 'general',
  entry_type text not null default 'lesson'
    check (entry_type in ('lesson', 'faq', 'rule', 'procedure', 'policy')),
  keywords text[] not null default '{}',
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'archived')),
  source_chat_id bigint,
  source_message_id bigint,
  source_message_date timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint assistant_knowledge_entries_source_pair
    check ((source_chat_id is null and source_message_id is null)
        or (source_chat_id is not null and source_message_id is not null))
);

create unique index if not exists assistant_knowledge_entries_telegram_source_uidx
  on public.assistant_knowledge_entries (source_chat_id, source_message_id)
  where source_chat_id is not null and source_message_id is not null;

create index if not exists assistant_knowledge_entries_lookup_idx
  on public.assistant_knowledge_entries (space_id, status, category, entry_type);

create table if not exists public.assistant_learning_queue (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.assistant_knowledge_spaces(id) on delete cascade,
  question text not null,
  context jsonb not null default '{}'::jsonb,
  source_user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'reviewing', 'converted', 'dismissed')),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assistant_learning_queue_review_idx
  on public.assistant_learning_queue (space_id, status, created_at desc);

alter table public.assistant_knowledge_spaces enable row level security;
alter table public.assistant_knowledge_entries enable row level security;
alter table public.assistant_learning_queue enable row level security;

revoke all on public.assistant_knowledge_spaces from public, anon, authenticated;
revoke all on public.assistant_knowledge_entries from public, anon, authenticated;
revoke all on public.assistant_learning_queue from public, anon, authenticated;

grant all on public.assistant_knowledge_spaces to service_role;
grant all on public.assistant_knowledge_entries to service_role;
grant all on public.assistant_learning_queue to service_role;

insert into public.assistant_knowledge_spaces (space_code, assistant_name)
values ('primary', 'ជំនួយការ 7inOne')
on conflict (space_code) do nothing;
