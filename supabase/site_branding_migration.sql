-- 7inOne Dynamic Site Branding & Hero Banner
-- All writes are performed by the authenticated backend using the Supabase service role.
-- Public/anon clients must never be allowed to write site configuration directly.

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
revoke all privileges on table public.site_settings from public, anon, authenticated;
grant all privileges on table public.site_settings to service_role;

insert into public.site_settings (key, value, updated_at)
values (
  'site_branding',
  jsonb_build_object(
    'siteTitle', '7inOne',
    'siteSubtitle', 'ផ្សារទិញលក់កម្ពុជា',
    'heroBadge', 'ផ្សារអនឡាញសម្រាប់អ្នកទាំងអស់គ្នា',
    'heroTitle', 'ទិញលក់ងាយៗ នៅជិតអ្នក',
    'heroSubtitle', 'ស្វែងរកទំនិញដែលអ្នកស្រឡាញ់ ឬដាក់លក់របស់ដែលអ្នកមិនប្រើ។ ភ្ជាប់អ្នកទិញ និងអ្នកលក់នៅទូទាំងប្រទេសកម្ពុជា។',
    'siteLogoUrl', '',
    'heroImages', '[]'::jsonb
  ),
  now()
)
on conflict (key) do update
set value = public.site_settings.value || jsonb_build_object(
  'siteTitle', coalesce(nullif(public.site_settings.value->>'siteTitle', ''), '7inOne'),
  'siteSubtitle', coalesce(nullif(public.site_settings.value->>'siteSubtitle', ''), 'ផ្សារទិញលក់កម្ពុជា'),
  'heroBadge', coalesce(nullif(public.site_settings.value->>'heroBadge', ''), 'ផ្សារអនឡាញសម្រាប់អ្នកទាំងអស់គ្នា'),
  'heroTitle', coalesce(nullif(public.site_settings.value->>'heroTitle', ''), 'ទិញលក់ងាយៗ នៅជិតអ្នក'),
  'heroSubtitle', coalesce(nullif(public.site_settings.value->>'heroSubtitle', ''), 'ស្វែងរកទំនិញដែលអ្នកស្រឡាញ់ ឬដាក់លក់របស់ដែលអ្នកមិនប្រើ។ ភ្ជាប់អ្នកទិញ និងអ្នកលក់នៅទូទាំងប្រទេសកម្ពុជា។'),
  'siteLogoUrl', coalesce(nullif(public.site_settings.value->>'siteLogoUrl', ''), nullif(public.site_settings.value->>'faviconUrl', ''), ''),
  'heroImages', coalesce(public.site_settings.value->'heroImages', '[]'::jsonb)
),
updated_at = now();
