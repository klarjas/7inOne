# ANANTA Telegram control

The existing 7inOne Telegram webhook accepts private-chat commands beginning with `/ananta`.
Commands are restricted to Telegram accounts linked to a 7inOne profile whose role is `admin`.

## Commands

- `/ananta help` — show available commands.
- `/ananta status` — show ANANTA's level, approved lesson count, test totals, and latest training-job state.
- `/ananta lessons` — list the latest ten approved lessons.
- `/ananta train` — enqueue one `scratch_train` job. A second active job for the same space is rejected.

## Required setup

1. Apply `supabase/migrations/20261124010000_ananta_training_jobs.sql`.
2. Ensure the ANANTA knowledge space exists with `space_code = 'ananta'`.
3. The Admin must link their Telegram account to their 7inOne Admin profile.
4. Ensure the existing Telegram webhook and bot environment variables are already configured.

## Important: enqueue is not training

The Telegram command only creates a durable job in `assistant_training_jobs`. It does not claim that model training has started. A separate ANANTA scratch-training worker must poll/claim queued jobs, train the locally initialized model, save checkpoints, run independent Khmer/English benchmarks, and mark each job completed or failed. No external AI API is called by these Telegram commands.
