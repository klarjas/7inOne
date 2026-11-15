# EcomStore

Full-stack marketplace for Cambodia and international customers. One Render Web Service runs the Next.js storefront and Express API; Supabase provides Auth/Postgres and a Telegram channel stores product images.

## Features

- Customer email registration, sign-in and sign-out with Supabase Auth.
- Product catalogue, search, product details and responsive shopping cart.
- Checkout with delivery contact/address, cash on delivery or bank-transfer record (manual verification).
- Atomic server-side checkout: current prices and stock are checked in PostgreSQL; inventory is decremented in the same transaction as the order.
- Customer order history.
- Vendor application and approval workflow.
- Vendor dashboard: create products, upload up to five images per product to Telegram, manage stock and view orders.
- Admin dashboard: marketplace metrics, approve/reject/block vendors, approve/reject products and update order/payment statuses.
- Telegram image proxy; Telegram bot token is never sent to the browser.
- Role escalation protection: customer accounts cannot update their own profile role; Admin role is read from the protected database profile.
- Public product views, persistent wishlists, buyer-to-seller offers, and reviews restricted to buyers with a completed order.
- Private seller verification documents are delivered to Admins as short-lived signed URLs; they are not exposed through public product or profile responses.
- Products with order history are archived instead of physically deleted.

## Stack

- Next.js 15 / React 19 / TypeScript / Tailwind CSS 4
- Express 5 (ES modules)
- Supabase Auth + PostgreSQL
- Telegram Bot API for product image storage (server-side uploads and image proxy)
- Supabase Storage: public `profile-media` bucket for avatars/covers; private `seller-verification` bucket for ID/business documents

## Supabase setup

1. Open the Supabase SQL Editor for the EcomStore project.
2. Run the complete `supabase/schema.sql` file from this repository.
3. Run `supabase/p2p_marketplace_migration.sql` after the base schema. This adds profile media, private seller-document storage, saved items, real seller ratings, offers, listing locations/conditions, and listing view counts.
4. Create a customer account through the storefront.
5. To make your own account the first administrator, replace the email below with the exact email used for that account and run this SQL in the SQL Editor:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users
  where email = 'YOUR_ADMIN_EMAIL'
);
```

The profile row is created automatically the first time the signed-in account calls the API. Do not set the role using the public browser client. Pending seller applications remain customer accounts; the backend grants the `vendor` role only after an administrator approves the application.

## Render: one Web Service

- Root Directory: leave blank.
- Build Command: `yarn install && yarn build`
- Start Command: `npm start`
- Health Check Path: `/health` (if you use a health-check field).

Set these environment variables in Render. Never commit real secrets to GitHub.

| Variable | Where it is used |
|---|---|
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | Backend Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend only; keep secret |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser publishable/anon key |
| `TELEGRAM_BOT_TOKEN` | Backend only; keep secret |
| `TELEGRAM_CHANNEL_ID` | Private image-storage channel ID |
| `AUTO_APPROVE_PRODUCTS` | Keep `false` so admins review new products |

Render supplies `PORT` automatically. `FRONTEND_ORIGIN` is optional because the app and API share the same origin.

## Payment notes

Checkout currently supports cash on delivery and a bank-transfer option that records the order for manual verification. It does **not** connect to ABA PayWay, KHQR, Stripe, or another payment processor. An administrator must verify a bank transfer and update the payment status in the dashboard. Do not describe an order as paid until payment has actually been confirmed.

## API overview

- `GET /health`
- `GET /api/products`, `GET /api/products/:id`, `GET /api/categories`
- `GET /api/config` (public Supabase URL + anon key only)
- `GET /api/me`, `PATCH /api/me`, `POST /api/me/media`
- `POST /api/vendors/register` (multipart upload to private document storage)
- `GET /api/vendors/:id/ratings`, `POST /api/vendors/:id/reviews`
- `GET /api/saved`, `POST/DELETE /api/saved/:productId`
- `GET /api/offers`, `POST /api/products/:id/offers`, `PATCH /api/offers/:id`
- `GET /api/vendor/overview`
- `GET /api/vendor/products`, `POST /api/products`, `PATCH/DELETE /api/products/:id`
- `POST/DELETE /api/products/:id/images...`
- `POST /api/orders`, `GET /api/orders`
- `GET /api/vendor/orders`, `PATCH /api/vendor/orders/:orderId`
- `GET /api/admin/overview`, `GET /api/admin/vendors`, `PATCH /api/admin/vendors/:id`
- `GET /api/admin/products`, `PATCH /api/admin/products/:id`
- `GET /api/admin/orders`, `PATCH /api/admin/orders/:id`

## Storage and authentication

- Product photos continue to use the configured private Telegram channel and are served through the backend image proxy.
- Avatar and cover uploads use the public Supabase `profile-media` bucket. Seller ID/business documents use the private `seller-verification` bucket.
- Email/password sign-in uses Supabase Auth. Phone/password sign-in and phone registration require the phone provider and SMS delivery to be enabled in Supabase Auth settings; email sign-up may require email confirmation depending on your Supabase settings.
- The marketplace frontend no longer includes a demo role switcher or localStorage-based mock seller/admin approvals. The role shown in the UI is read from `/api/me` and privileged actions are checked again by the backend.

## Important

This is the functional marketplace foundation. Real online payment gateway integration, shipping carrier integration, email/SMS notifications, refunds, tax rules, and full accounting are not configured. Configure and test those integrations before accepting live paid orders. Keep the Supabase service-role key and Telegram token only in Render's secret environment variables.
