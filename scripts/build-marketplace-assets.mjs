import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const marketplaceDir = fileURLToPath(new URL('../frontend/public/marketplace/', import.meta.url));
const sourceDir = path.join(marketplaceDir, 'src');

const builds = [
  {
    output: 'index.html',
    parts: [
      'html/00-document-shell.html',
      'html/10-home.html',
      'html/20-product.html',
      'html/30-store.html',
      'html/40-profile.html',
      'html/50-seller.html',
      'html/60-admin.html',
      'html/70-overlays-and-scripts.html'
    ]
  },
  {
    output: 'style.css',
    parts: [
      'css/00-foundation-and-overlays.css',
      'css/10-chat-and-shared-components.css',
      'css/20-product-detail-and-ui-fixes.css',
      'css/30-marketplace-and-product-layout.css',
      'css/40-apple-layout-system.css',
      'css/50-storefront-and-marketplace-layout.css',
      'css/60-product-cards-and-dark-surfaces.css',
      'css/70-global-dark-theme-and-account.css',
      'css/80-community-and-social-feed.css',
      'css/90-listings-media-and-final-overrides.css'
    ]
  },
  {
    output: 'app.js',
    parts: [
      'js/00-core-state-routing-and-auth.js',
      'js/10-community-and-product-cards.js',
      'js/20-marketplace-home-and-filters.js',
      'js/30-product-detail-and-gallery.js',
      'js/40-storefront-and-profile.js',
      'js/50-listings-seller-and-admin.js',
      'js/60-chat-checkout-auth-and-media.js',
      'js/70-jobs-and-event-bindings.js',
      'js/80-presence-and-application-boot.js'
    ]
  }
];

for (const build of builds) {
  const chunks = await Promise.all(build.parts.map(part =>
    fs.readFile(path.join(sourceDir, part), 'utf8')
  ));
  await fs.writeFile(path.join(marketplaceDir, build.output), chunks.join(''), 'utf8');
  console.log('Built marketplace/' + build.output + ' from ' + build.parts.length + ' source modules');
}
