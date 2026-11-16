create temporary table _seller_conversation_merge on commit drop as
select id old_id,first_value(id) over(partition by vendor_id,buyer_id order by last_message_at desc,created_at desc,id) keep_id
from public.seller_conversations;
with rollup as (
 select vendor_id,buyer_id,sum(unread_seller_count)::integer unread_seller_count,sum(unread_buyer_count)::integer unread_buyer_count,
 max(last_message_at) last_message_at,(array_agg(last_message_preview order by last_message_at desc,created_at desc))[1] last_message_preview,
 (array_agg(product_id order by last_message_at desc,created_at desc))[1] product_id,
 case when bool_or(status='open') then 'open' else 'closed' end status
 from public.seller_conversations group by vendor_id,buyer_id
)
update public.seller_conversations keeper set product_id=r.product_id,last_message_at=r.last_message_at,last_message_preview=r.last_message_preview,
 unread_seller_count=r.unread_seller_count,unread_buyer_count=r.unread_buyer_count,status=r.status,updated_at=now()
from rollup r where keeper.vendor_id=r.vendor_id and keeper.buyer_id=r.buyer_id
and keeper.id=(select m.keep_id from _seller_conversation_merge m where m.old_id=keeper.id limit 1);
update public.seller_messages sm set conversation_id=m.keep_id from _seller_conversation_merge m where sm.conversation_id=m.old_id and m.old_id<>m.keep_id;
delete from public.seller_conversations sc using _seller_conversation_merge m where sc.id=m.old_id and m.old_id<>m.keep_id;
alter table public.seller_conversations drop constraint if exists seller_conversations_product_buyer_unique;
create unique index if not exists seller_conversations_vendor_buyer_unique_idx on public.seller_conversations(vendor_id,buyer_id);
alter table public.seller_messages add column if not exists product_id uuid references public.products(id) on delete set null;
alter table public.seller_messages drop constraint if exists seller_messages_message_type_check;
alter table public.seller_messages add constraint seller_messages_message_type_check check(message_type in('text','voice','product'));
alter table public.seller_messages drop constraint if exists seller_messages_voice_metadata_check;
alter table public.seller_messages add constraint seller_messages_voice_metadata_check check(
 (message_type='text' and telegram_file_id is null and duration_seconds is null and product_id is null)
 or (message_type='voice' and telegram_file_id is not null and duration_seconds between 1 and 180 and product_id is null)
 or (message_type='product' and telegram_file_id is null and duration_seconds is null));
create index if not exists seller_messages_product_id_idx on public.seller_messages(product_id) where product_id is not null;
