-- Add reusable Telegram-backed image galleries to job and real-estate listings.
-- Existing single-image columns remain intact for backward compatibility.
alter table if exists public.jobs
  add column if not exists image_gallery jsonb not null default '[]'::jsonb;

alter table if exists public.property_listings
  add column if not exists image_gallery jsonb not null default '[]'::jsonb;

