alter table public.seller_conversations alter column product_id drop not null;
alter table public.seller_conversations drop constraint if exists seller_conversations_product_id_fkey;
alter table public.seller_conversations add constraint seller_conversations_product_id_fkey foreign key(product_id) references public.products(id) on delete set null;
