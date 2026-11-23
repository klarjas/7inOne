-- Remove the retired Community Social Feed schema.
-- Its API routes have been removed from backend/server.js.
-- Drop dependent child tables first; no CASCADE is used intentionally.
drop table if exists public.social_post_comments;
drop table if exists public.social_post_likes;
drop table if exists public.social_posts;
