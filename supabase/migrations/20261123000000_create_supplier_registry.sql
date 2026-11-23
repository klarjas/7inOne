-- Admin-managed supplier registry for private supplier catalog sources.
-- Supplier URLs and domains are private operational metadata; only the backend service role may access this table.

create table if not exists public.supplier_registry (
  id uuid primary key default gen_random_uuid(),
  supplier_key text not null unique,
  supplier_name text not null,
  base_url text not null,
  allowed_domains text[] not null default '{}',
  parser_key text not null,
  is_verified boolean not null default false,
  is_active boolean not null default false,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint supplier_registry_key_format check (supplier_key ~ '^[a-z0-9][a-z0-9_-]{1,63}$'),
  constraint supplier_registry_https_url check (base_url ~ '^https://'),
  constraint supplier_registry_domains_nonempty check (cardinality(allowed_domains) > 0)
);

create index if not exists supplier_registry_active_idx
  on public.supplier_registry (is_active, is_verified);

alter table public.supplier_registry enable row level security;
revoke all on table public.supplier_registry from anon, authenticated;
grant all on table public.supplier_registry to service_role;

comment on table public.supplier_registry is
  'Private Admin-managed supplier website registry. Accessed only by the trusted backend service role; never expose supplier metadata publicly.';
comment on column public.supplier_registry.allowed_domains is
  'Exact hostnames permitted for supplier page crawling and image retrieval; do not use wildcard suffix matching.';
comment on column public.supplier_registry.parser_key is
  'Selects a supplier-specific catalog adapter; each adapter must validate its own host and extraction rules.';

insert into public.supplier_registry
  (supplier_key, supplier_name, base_url, allowed_domains, parser_key, is_verified, is_active, notes)
values
  ('cc_computer', 'CC COMPUTER', 'https://cccomputerkh.com/', array['cccomputerkh.com'], 'cc_computer', true, true,
   'Existing verified supplier. Preserve the current CC COMPUTER catalog parser and auto-sync behavior.'),
  ('gold_one', 'Gold One Computer', 'https://www.goldonecomputer.com/', array['goldonecomputer.com'], 'opencart', true, false,
   'Official HTTPS domain reviewed. Keep disabled for scanning until the OpenCart adapter passes parser and safety checks.')
on conflict (supplier_key) do update set
  supplier_name = excluded.supplier_name,
  base_url = excluded.base_url,
  allowed_domains = excluded.allowed_domains,
  parser_key = excluded.parser_key,
  is_verified = excluded.is_verified,
  notes = excluded.notes,
  updated_at = now();
