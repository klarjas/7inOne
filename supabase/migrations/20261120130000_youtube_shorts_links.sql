-- Five YouTube Shorts per verified seller per Cambodia-local calendar day.
-- Advisory transaction locking prevents concurrent requests exceeding the cap.
create or replace function public.create_vendor_youtube_short(p_vendor_id uuid,p_media_url text)
returns setof public.vendor_media_links
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
 v_day date := (now() at time zone 'Asia/Phnom_Penh')::date;
 v_start timestamptz := (((now() at time zone 'Asia/Phnom_Penh')::date)::timestamp at time zone 'Asia/Phnom_Penh');
 v_end timestamptz := ((((now() at time zone 'Asia/Phnom_Penh')::date + 1)::timestamp) at time zone 'Asia/Phnom_Penh');
 v_status text; v_count integer; v_row public.vendor_media_links;
begin
 if p_media_url !~ '^https://www\.youtube\.com/shorts/[A-Za-z0-9_-]{11}$' then
  raise exception 'Invalid YouTube Shorts URL' using errcode='22023';
 end if;
 perform pg_advisory_xact_lock(hashtextextended(p_vendor_id::text || ':' || v_day::text,0));
 select status into v_status from public.vendors where id=p_vendor_id for update;
 if v_status is distinct from 'approved' then
  raise exception 'Only verified sellers can publish Shorts' using errcode='42501';
 end if;
 select count(*) into v_count from public.vendor_media_links
 where vendor_id=p_vendor_id and media_type='video'
  and media_url ~ '^https://www\.youtube\.com/shorts/[A-Za-z0-9_-]{11}$'
  and created_at>=v_start and created_at<v_end;
 if v_count>=5 then raise exception 'Daily Shorts limit reached' using errcode='23514'; end if;
 insert into public.vendor_media_links(vendor_id,media_url,media_type,is_active)
 values(p_vendor_id,p_media_url,'video',true) returning * into v_row;
 return next v_row;
end;
$$;
revoke all on function public.create_vendor_youtube_short(uuid,text) from public,anon,authenticated;
grant execute on function public.create_vendor_youtube_short(uuid,text) to service_role;
