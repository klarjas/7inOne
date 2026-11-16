-- Extend buyer/seller chat message types for image and Google Maps location sharing.
-- Existing text, voice, and product messages remain valid; no rows are deleted or rewritten.

alter table public.seller_messages
  drop constraint if exists seller_messages_message_type_check;
alter table public.seller_messages
  add constraint seller_messages_message_type_check
  check (message_type in ('text','voice','product','image','location'));

alter table public.seller_messages
  drop constraint if exists seller_messages_voice_metadata_check;
alter table public.seller_messages
  add constraint seller_messages_voice_metadata_check
  check (
    (message_type = 'text'
      and telegram_file_id is null
      and duration_seconds is null
      and product_id is null)
    or
    (message_type = 'voice'
      and telegram_file_id is not null
      and duration_seconds between 1 and 180
      and product_id is null)
    or
    (message_type = 'product'
      and telegram_file_id is null
      and duration_seconds is null)
    or
    (message_type = 'image'
      and telegram_file_id is not null
      and duration_seconds is null
      and product_id is null
      and mime_type in ('image/jpeg','image/png','image/webp'))
    or
    (message_type = 'location'
      and telegram_file_id is null
      and duration_seconds is null
      and product_id is null
      and mime_type is null)
  );
