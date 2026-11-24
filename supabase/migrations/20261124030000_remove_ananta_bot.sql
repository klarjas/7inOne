-- Remove the ANANTA Telegram AI bot and its dedicated learning data.
-- Keep the shared 7inOne primary knowledge space and its data intact.
drop table if exists public.assistant_telegram_sessions;
drop table if exists public.assistant_training_jobs;

delete from public.assistant_knowledge_spaces
where space_code = 'ananta';
