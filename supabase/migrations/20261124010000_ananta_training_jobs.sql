-- ANANTA Telegram-triggered scratch-training queue.
-- The Telegram bot can enqueue jobs; a separate local/hosted worker must claim and execute them.
create table if not exists public.assistant_training_jobs (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.assistant_knowledge_spaces(id) on delete cascade,
  job_type text not null default 'scratch_train'
    check (job_type in ('scratch_train')),
  status text not null default 'queued'
    check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  requested_by_telegram_id text,
  payload jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  error_message text,
  claimed_by text,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists assistant_training_jobs_space_recent_idx
  on public.assistant_training_jobs (space_id, created_at desc);

create index if not exists assistant_training_jobs_queue_idx
  on public.assistant_training_jobs (status, created_at)
  where status = 'queued';

-- Prevent duplicate active training requests for the same ANANTA space.
create unique index if not exists assistant_training_jobs_one_active_per_space_uidx
  on public.assistant_training_jobs (space_id)
  where status in ('queued', 'running');

alter table public.assistant_training_jobs enable row level security;
revoke all on public.assistant_training_jobs from public, anon, authenticated;
grant all on public.assistant_training_jobs to service_role;
