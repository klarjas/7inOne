create index if not exists seller_messages_sender_created_idx on public.seller_messages(sender_id, created_at desc);
