-- Add seller-written one-line captions to YouTube Shorts and expose shop identity.
alter table public.vendor_media_links
  add column if not exists caption varchar(160) not null default '';

-- Preserve the existing daily quota, seller verification and Cambodia-local date rules.
create or replace function public.create_vendor_youtube_short(
  p_vendor_id uuid,
  p_media_url text,
  p_caption text default ''
)
returns setof public.vendor_media_links
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
 v_day date := (now() at time zone 'Asia/Phnom_Penh')::date;
 v_status text; v_count integer; v_row public.vendor_media_links;
begin
 if p_media_url !~ '^https://www\\.youtube\\.com/shorts/[A-Za-z0-9_-]{11}$' then
  raise exception 'Invalid YouTube Shorts URL' using errcode='22023';
 end if;
 perform pg_advisory_xact_lock(hashtextextended(p_vendor_id::text || ':' || v_day::text,0));
 select status into v_status from public.vendors where id=p_vendor_id for update;
 if v_status is distinct from 'approved' then
  raise exception 'Only verified sellers can publish Shorts' using errcode='42501';
 end if;
 insert into public.vendor_youtube_shorts_daily_usage(vendor_id,cambodia_date,posts_count)
 values(p_vendor_id,v_day,1)
 on conflict(vendor_id,cambodia_date) do update
   set posts_count=public.vendor_youtube_shorts_daily_usage.posts_count+1
   where public.vendor_youtube_shorts_daily_usage.posts_count<5
 returning posts_count into v_count;
 if not found then raise exception 'Daily Shorts limit reached' using errcode='23514'; end if;
 insert into public.vendor_media_links(vendor_id,media_url,media_type,is_active,caption)
 values(p_vendor_id,p_media_url,'video',true,left(coalesce(p_caption,''),160)) returning * into v_row;
 return next v_row;
end;
$$;
revoke all on function public.create_vendor_youtube_short(uuid,text,text) from public,anon,authenticated;
grant execute on function public.create_vendor_youtube_short(uuid,text,text) to service_role;
notify pgrst, 'reload schema';
