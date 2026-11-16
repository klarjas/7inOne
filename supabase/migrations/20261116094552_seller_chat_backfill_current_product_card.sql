insert into public.seller_messages(conversation_id,sender_id,sender_role,body,message_type,product_id,created_at)
select c.id,c.buyer_id,'buyer','📦 បានសួរអំពីផលិតផល៖ '||p.title,'product',p.id,c.last_message_at
from public.seller_conversations c
join public.products p on p.id=c.product_id
where not exists (
  select 1 from public.seller_messages m
  where m.conversation_id=c.id and m.message_type='product' and m.product_id=p.id
);
create index if not exists seller_conversations_product_id_idx
  on public.seller_conversations(product_id) where product_id is not null;
