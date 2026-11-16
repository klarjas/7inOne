create table if not exists public.seller_conversations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'open' check (status in ('open','closed')),
  last_message_at timestamptz not null default now(),
  last_message_preview text not null default '',
  unread_seller_count integer not null default 0 check (unread_seller_count >= 0),
  unread_buyer_count integer not null default 0 check (unread_buyer_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seller_conversations_product_buyer_unique unique (product_id, buyer_id)
);
create table if not exists public.seller_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.seller_conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  sender_role text not null check (sender_role in ('buyer','seller')),
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index if not exists seller_conversations_vendor_last_message_idx on public.seller_conversations(vendor_id, last_message_at desc);
create index if not exists seller_conversations_buyer_last_message_idx on public.seller_conversations(buyer_id, last_message_at desc);
create index if not exists seller_messages_conversation_created_idx on public.seller_messages(conversation_id, created_at);
alter table public.seller_conversations enable row level security;
alter table public.seller_messages enable row level security;
drop policy if exists seller_conversations_participant_read on public.seller_conversations;
create policy seller_conversations_participant_read on public.seller_conversations for select to authenticated
using (buyer_id = (select auth.uid()) or exists (select 1 from public.vendors v where v.id = seller_conversations.vendor_id and v.user_id = (select auth.uid())));
drop policy if exists seller_messages_participant_read on public.seller_messages;
create policy seller_messages_participant_read on public.seller_messages for select to authenticated
using (exists (select 1 from public.seller_conversations c left join public.vendors v on v.id = c.vendor_id where c.id = seller_messages.conversation_id and (c.buyer_id = (select auth.uid()) or v.user_id = (select auth.uid()))));
grant select on public.seller_conversations, public.seller_messages to authenticated;
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then execute 'create publication supabase_realtime'; end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'products') then execute 'alter publication supabase_realtime add table public.products'; end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'product_images') then execute 'alter publication supabase_realtime add table public.product_images'; end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'seller_conversations') then execute 'alter publication supabase_realtime add table public.seller_conversations'; end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'seller_messages') then execute 'alter publication supabase_realtime add table public.seller_messages'; end if;
end $$;
