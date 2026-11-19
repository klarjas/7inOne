-- Save each signed-in user's preferred Cambodia listing location.
alter table public.profiles
  add column if not exists default_location jsonb;

comment on column public.profiles.default_location is
  'User-selected default Cambodia province, district, commune and village for listing forms.';
