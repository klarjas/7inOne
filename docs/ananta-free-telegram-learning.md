# ANANTA — Telegram-only free learning mode

ANANTA is operated through the existing 7inOne private Telegram bot. Commands are restricted to Telegram users linked to an Admin 7inOne profile.

## Commands
- `/ananta help` — list commands.
- `/ananta status` or `/ananta report` — progress, recent scores and approved lesson count.
- `/ananta lessons` — list approved lessons.
- `/ananta learn` — read the latest approved lesson.
- `/ananta test` — start the Beginner AI Fundamentals quiz.
- `/ananta answer A` — answer the current multiple-choice question (A-D).
- `/ananta train` — guided practice and quiz in free mode.

## Free-mode scope and limitations
- Lesson content, quiz state, attempts and progress are stored in Supabase.
- Quiz grading is deterministic and does not call a paid AI API.
- This mode does not fine-tune weights, train a neural network, or claim ANANTA is a new foundation model.
- No always-on worker is required. Telegram webhook requests perform the work on demand.
- The existing backend must be deployed for these changes to become available in Telegram.

## Setup
Apply migration `20261124020000_ananta_telegram_sessions.sql`. Ensure the existing Telegram webhook is configured and the Admin Telegram account is linked to an Admin 7inOne profile.
