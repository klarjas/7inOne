-- Allow each verified seller to publish multiple Live / Video links.
-- Existing rows are preserved; only the one-row-per-vendor uniqueness is removed.
alter table public.vendor_media_links
  drop constraint if exists vendor_media_links_vendor_id_key;

drop index if exists public.vendor_media_links_vendor_id_key;

create index if not exists vendor_media_links_vendor_id_idx
  on public.vendor_media_links(vendor_id);

create index if not exists vendor_media_links_vendor_created_idx
  on public.vendor_media_links(vendor_id, created_at desc);
