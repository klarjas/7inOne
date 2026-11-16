-- Product listing lifecycle: seven days public, seven more days for seller renewal.
alter table public.products
  add column if not exists renewed_at timestamptz;

-- Backfill existing listings without changing their current listing age.
update public.products
set renewed_at = coalesce(renewed_at, updated_at, created_at, now())
where renewed_at is null;

create index if not exists products_renewed_at_status_idx
  on public.products (status, renewed_at);
