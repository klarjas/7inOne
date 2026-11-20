-- Optional standard YouTube video URL for marketplace listings.
-- Existing Telegram image columns and upload workflow are intentionally untouched.
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS youtube_video_url text;
ALTER TABLE IF EXISTS public.jobs ADD COLUMN IF NOT EXISTS youtube_video_url text;
ALTER TABLE IF EXISTS public.property_listings ADD COLUMN IF NOT EXISTS youtube_video_url text;
ALTER TABLE IF EXISTS public.rentals ADD COLUMN IF NOT EXISTS youtube_video_url text;
ALTER TABLE IF EXISTS public.land_listings ADD COLUMN IF NOT EXISTS youtube_video_url text;
ALTER TABLE IF EXISTS public.house_sale_listings ADD COLUMN IF NOT EXISTS youtube_video_url text;
