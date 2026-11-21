# 7inOne Marketplace dependency map

This document records the compatibility boundaries for the first structural extraction.

## Runtime architecture

The browser still receives exactly three legacy entry assets:

- `index.html` — document shell, six views, shared overlays, and script entrypoint.
- `style.css` — the existing ordered CSS cascade.
- `app.js` — one classic script, preserving the shared top-level lexical scope.

The `src/` fragments are build-time source only. Do not add them as individual browser script or stylesheet tags.

## HTML view ownership

| Source | DOM root | Responsibility |
|---|---|---|
| `html/00-document-shell.html` | document/header | Head, font/style links, route restoration, header, search, shared top shell |
| `html/10-home.html` | `#view-home` | Marketplace home, filters, product feed and home content |
| `html/20-product.html` | `#view-product` | Product detail view |
| `html/30-store.html` | `#view-store` | Storefront view |
| `html/40-profile.html` | `#view-profile` | Account/profile view |
| `html/50-seller.html` | `#view-seller` | Seller dashboard and listing management |
| `html/60-admin.html` | `#view-admin` | Admin dashboard |
| `html/70-overlays-and-scripts.html` | shared overlays | Footer, mobile navigation, auth/chat/checkout dialogs, lightbox, toast, maintenance overlay, vendor and app script tags |

The current HTML has 306 unique IDs and no duplicate IDs. Preserve these IDs until all JavaScript and CSS references are migrated together.

## JavaScript feature ownership

The nine fragments are concatenated in numeric order into one classic script. Their current function ownership is:

| Source | Current line range in original `app.js` | Primary responsibility |
|---|---:|---|
| `js/00-core-state-routing-and-auth.js` | 1–798 | Shared state, constants, identity/session, API helpers, route/view switching, global branding and shell helpers |
| `js/10-community-and-product-cards.js` | 799–1150 | Social stories/posts, shared product-card markup and helpers |
| `js/20-marketplace-home-and-filters.js` | 1151–1320 | Marketplace feed, product loading, categories and filters |
| `js/30-product-detail-and-gallery.js` | 1321–1930 | Listing detail, detail actions, map, image gallery and lightbox |
| `js/40-storefront-and-profile.js` | 1931–2434 | Storefront, saved items, orders, offers, profile and My Posts |
| `js/50-listings-seller-and-admin.js` | 2435–3159 | Seller forms, listing media/taxonomy/location, seller dashboard and admin dashboard |
| `js/60-chat-checkout-auth-and-media.js` | 3160–4105 | Seller/buyer chat, checkout, auth/Telegram login, YouTube media and vendor presence |
| `js/70-jobs-and-event-bindings.js` | 4106–5198 | Jobs UI, shared event delegation and event bindings |
| `js/80-presence-and-application-boot.js` | 5199–end | Site presence and application boot |

### Shared runtime dependencies

These are cross-feature contracts and must remain in the shared/core layer when true ES modules are introduced:

- API/session identity and login guards: `api`, `apiUploadWithProgress`, `requireLogin`, `loadIdentity`, `refreshSession`.
- Navigation and global shell: `showView`, `syncHeader`, branding and maintenance helpers.
- Shared presentation: `toast`, `openModal`, `closeModal`, `appDialog`, avatar helpers, icon initialization, product-card markup.
- Shared state and DOM IDs: all feature modules currently read/write common application state and query elements by stable IDs.
- Global callbacks required by external SDKs: `window.on7inOneTelegramLogin`, `window.on7inOneTelegramLink`, `window.onYouTubeIframeAPIReady`.

## CSS isolation audit

The current stylesheet contains 3,316 selector groups and includes global selectors such as `html`, `body`, `button`, form controls, footer rules, and state selectors such as `body:has(#view-product.active)`. These are intentional cross-page contracts until proven otherwise.

Do not mechanically prefix every selector with a view ID. First classify rules as:

1. Global foundation/reset and typography.
2. Shared shell, navigation, dialogs, toasts, chat and loader.
3. Home-only selectors.
4. Product-detail-only selectors.
5. Storefront-only selectors.
6. Profile-only selectors.
7. Seller-only selectors.
8. Admin-only selectors.
9. Cross-view state and responsive overrides.

Move a rule to a page scope only after checking every matching element and any dynamically rendered markup. Keep the one existing global Loader definition as the single source of truth.

## Safe next steps

1. Add automated source-build integrity checks and keep generated output deterministic.
2. Inventory CSS selectors by the view DOM IDs/classes they actually match.
3. Identify JavaScript cross-module calls and shared mutable state before changing any declaration to `export`/ `import`.
4. Move one isolated CSS group or JavaScript feature at a time, with build and behavior checks after each move.

## Protected scope

No backend, database, Supabase schema, Telegram image-upload implementation, API endpoints, or storage logic is part of this frontend refactor.
