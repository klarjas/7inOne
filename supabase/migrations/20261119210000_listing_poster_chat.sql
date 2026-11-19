-- Allow the existing seller chat to include conversations with any marketplace listing poster.
alter table public.seller_conversations
  alter column vendor_id drop not null;

alter table public.seller_conversations
  add column if not exists recipient_id uuid references public.profiles(id) on delete cascade,
  add column if not exists listing_type text,
  add column if not exists listing_id uuid;

create unique index if not exists seller_conversations_recipient_buyer_unique
  on public.seller_conversations(recipient_id, buyer_id)
  where recipient_id is not null;

drop policy if exists seller_conversations_participant_read on public.seller_conversations;
create policy seller_conversations_participant_read
  on public.seller_conversations for select to authenticated
  using (
    buyer_id = (select auth.uid())
    or recipient_id = (select auth.uid())
    or exists (
      select 1 from public.vendors v
      where v.id = seller_conversations.vendor_id
        and v.user_id = (select auth.uid())
    )
  );

drop policy if exists seller_messages_participant_read on public.seller_messages;
create policy seller_messages_participant_read
  on public.seller_messages for select to authenticated
  using (
    exists (
      select 1
      from public.seller_conversations c
      left join public.vendors v on v.id = c.vendor_id
      where c.id = seller_messages.conversation_id
        and (
          c.buyer_id = (select auth.uid())
          or c.recipient_id = (select auth.uid())
          or v.user_id = (select auth.uid())
        )
    )
  );
