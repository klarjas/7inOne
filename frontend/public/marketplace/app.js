// ==========================================================================
// 7inOne Production Frontend (Supabase Auth + Authenticated Server API)
// Cleaned, modularized, and formatted for maintainability
// ==========================================================================

'use strict';

/* --------------------------------------------------------------------------
   1. Constants & Icons
   -------------------------------------------------------------------------- */
const ICON_PATHS = {
  bag: '<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  chev: '<path d="m7 10 5 5 5-5"/>',
  x: '<path d="m18 6-12 12M6 6l12 12"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
  bookmark: '<path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4V4.5Z"/>',
  pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  chat: '<path d="M21 11.5a8.5 8.5 0 0 1-9 8.5 9.7 9.7 0 0 1-4-.8L3 21l1.8-4.5A8.2 8.2 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1"/>',
  arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
  car: '<path d="m5 17-1 2v2h2v-2h12v2h2v-2l-1-2"/><path d="m4 17 1.5-6h13L20 17M7 11l1.5-4h7L17 11M7 17h.01M17 17h.01"/>',
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1Z"/>',
  shirt: '<path d="m16 4 5 3-3 4-2-1v10H8V10l-2 1-3-4 5-3 2 2h4z"/>',
  sofa: '<path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M3 12a2 2 0 0 1 4 0v3h10v-3a2 2 0 0 1 4 0v5H3zM5 17v3m14-3v3"/>',
  user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',
  camera: '<path d="M14 5 12.5 3h-5L6 5H3v14h18V5z"/><circle cx="12" cy="12" r="3.5"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  store: '<path d="M3 10h18l-1 11H4L3 10Z"/><path d="m3 10 2-7h14l2 7M8 10v3m8-3v3"/>',
  wallet: '<path d="M4 6h15a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"/><path d="M21 11h-5a2 2 0 0 0 0 4h5"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6m4 4v7m6-7v7"/>',
  edit: '<path d="m16 4 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z"/>',
  checkcircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
  logout: '<path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',
  spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2Z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  refresh: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',
  package: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5"/>',
  truck: '<path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z"/><circle cx="7.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',
  play: '<path d="m8 5 11 7-11 7z"/>',
  volume: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13"/>',
  volumeOff: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6m0-6-5 6"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/>'
};

const CATEGORIES = {
  phones: 'ទូរស័ព្ទ & អេឡិចត្រូនិក',
  vehicles: 'រថយន្ត & ម៉ូតូ',
  property: 'អចលនទ្រព្យ',
  fashion: 'សម្លៀកបំពាក់',
  furniture: 'គ្រឿងសង្ហារិម'
};

const DEFAULT_MAINTENANCE_MSG = 'ប្រព័ន្ធកំពុងធ្វើការអភិវឌ្ឍន៍ និងបន្ថែមមុខងារថ្មីៗ សូមអធ្យាស្រ័យចំពោះការរំខាន!';
const PRODUCT_DESC_SEPARATOR = '\n<!--7INONE:MORE-->\n';

/* --------------------------------------------------------------------------
   2. Application State
   -------------------------------------------------------------------------- */
const state = {
  supabase: null,
  session: null,
  sessionRefreshPromise: null,
  authRevision: 0,
  me: null,
  routeAccessReady: false,
  routeSyncGuardKey: '',
  routeSyncGuardTimer: null,
  routeSyncNavigationId: 0,
  scrollSaveTimer: null,

  // Marketplace
  products: [],
  productsRequestId: 0,
  savedIds: new Set(),
  favoritePending: new Set(),
  activeCategory: 'all',
  activeCondition: 'all',
  searchTerm: '',
  currentProduct: null,
  currentVendor: null,
  productGalleryIndex: 0,
  productLightboxOpen: false,
  productLightboxZoom: 1,

  // Storefront
  currentStoreId: null,
  currentStoreData: null,
  currentStoreProducts: [],
  currentStoreCategory: 'all',
  currentStoreSearch: '',
  currentStorePage: 1,
  currentStoreLimit: 50,
  currentStoreTotal: 0,
  currentStoreLoading: false,
  currentStoreLoadError: false,
  currentStoreMoreLoading: false,
  currentStoreMoreError: false,

  // Profile & Auth
  profileTab: 'saved',
  authMode: 'login',
  pendingPhone: null,
  telegramBotUsername: '',
  telegramLoginWidgetMounted: false,
  telegramProfileWidgetMounted: false,
  telegramAuthPending: false,
  myOrders: [],

  // Seller
  sellerProductCache: [],
  sellerActiveFilter: 'all',
  sellerActiveTab: 'products',
  currentOfferProduct: null,
  selectedProductImages: [],
  sellerDocPreviewUrl: null,

  // Branding & Maintenance
  maintenanceMode: false,
  maintenanceMessage: DEFAULT_MAINTENANCE_MSG,
  faviconUrl: '',
  siteBranding: {
    siteTitle: '7inOne',
    siteSubtitle: 'ផ្សារទិញលក់កម្ពុជា',
    heroBadge: 'ផ្សារអនឡាញសម្រាប់អ្នកទាំងអស់គ្នា',
    heroTitle: 'ទិញលក់ងាយៗ នៅជិតអ្នក',
    heroSubtitle: 'ស្វែងរកទំនិញដែលអ្នកស្រឡាញ់ ឬដាក់លក់របស់ដែលអ្នកមិនប្រើ។ ភ្ជាប់អ្នកទិញ និងអ្នកលក់នៅទូទាំងប្រទេសកម្ពុជា។',
    siteLogoUrl: '',
    faviconUrl: '',
    heroImages: []
  },
  brandingLogoPreviewUrl: null,
  brandingFaviconPreviewUrl: null,
  brandingHeroPreviewUrls: [],
  siteBrandingRefreshTimer: null,

  // Presence & Realtime
  vendorPresenceIds: new Set(),
  vendorPresenceAnnouncedId: null,
  vendorPresencePollTimer: null,
  vendorPresenceHeartbeatTimer: null,
  vendorPresenceStarted: false,
  vendorPresenceTabId: (() => {
    try { return crypto.randomUUID(); }
    catch { return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2); }
  })(),
  productRealtimeChannel: null,
  productRealtimeRefreshTimer: null,
  productRealtimeFallbackTimer: null,
  productRealtimePendingRefresh: false,

  // Unified Chat
  chatChannel: null,
  chatPollTimer: null,
  chatInboxPollTimer: null,
  sellerInboxPollTimer: null,
  chatConversationId: null,
  chatMode: 'buyer',
  chatInbox: [],
  chatMuted: false,
  chatLastMessageId: null,
  chatInboxUnreadSnapshot: {},
  chatInboxInitialized: false,
  chatInboxUserId: null,
  chatLoadedMessages: [],
  chatPendingMedia: [],
  chatDraftProduct: null
};

/* --------------------------------------------------------------------------
   3. DOM & Formatting Utilities
   -------------------------------------------------------------------------- */
const $ = (id) => document.getElementById(id);

const ic = (name, size = 17, extra = '') =>
  `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="${extra}">${ICON_PATHS[name] || ICON_PATHS.spark}</svg>`;

const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

const money = (v) => '$' + Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const fmtDate = (v) => v ? new Date(v).toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

function timeAgoKm(dateStr) {
  if (!dateStr) return 'ថ្មីៗ';
  const timestamp = new Date(dateStr).getTime();
  if (!Number.isFinite(timestamp)) return 'ថ្មីៗ';
  const diff = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
  if (diff < 60) return `${diff} នាទីមុន`;
  const hrs = Math.floor(diff / 60);
  if (hrs < 24) return `${hrs} ម៉ោងមុន`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} ថ្ងៃមុន`;
  return `${Math.floor(days / 7)} សប្តាហ៍មុន`;
}

function formatViews(value) {
  const num = Number(value || 0);
  return num >= 1000 ? (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : String(num);
}

function toast(message, type = 'success') {
  const area = $('toastArea');
  if (!area) return;
  area.innerHTML = '';
  const el = document.createElement('div');
  const styleClass = type === 'error'
    ? 'border-rose-200 bg-rose-50 text-rose-700'
    : type === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-800'
      : 'border-slate-800 bg-slate-900 text-white';

  el.className = `toast pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 text-[11px] font-semibold ${styleClass}`;
  el.innerHTML = `<span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/10">${ic(type === 'error' ? 'x' : 'check', 15)}</span><span class="flex-1">${esc(message)}</span><button aria-label="បិទ">${ic('x', 14)}</button>`;
  el.querySelector('button').onclick = () => el.remove();
  area.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function openModal(id) {
  closeDropdowns();
  const modal = $(id);
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  if (id !== 'sellerChatModal') document.body.classList.add('overflow-hidden');
  if (id === 'sellerChatModal') $('supportChatLauncher')?.classList.remove('hidden');
}

function closeModal(id) {
  const el = $(id);
  if (!el) return;
  el.classList.remove('open');
  el.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal.open')) document.body.classList.remove('overflow-hidden');
}

function closeDropdowns() {
  document.querySelectorAll('.dropdown').forEach((x) => x.classList.remove('open'));
}

function toggleDrop(id) {
  const el = $(id);
  if (!el) return;
  const open = el.classList.contains('open');
  closeDropdowns();
  if (!open) el.classList.add('open');
}

/* --------------------------------------------------------------------------
   4. API & Authentication Helpers
   -------------------------------------------------------------------------- */
async function api(path, options = {}) {
  const { authToken, ...fetchOptions } = options;
  const sessionAtRequest = state.session;
  const headers = new Headers(fetchOptions.headers || {});
  const requestToken = authToken !== undefined ? authToken : sessionAtRequest?.access_token;
  if (requestToken) headers.set('Authorization', 'Bearer ' + requestToken);
  else headers.delete('Authorization');

  if (fetchOptions.body && !(fetchOptions.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const requestOptions = { ...fetchOptions, headers, cache: 'no-store' };
  let response = await fetch(path, requestOptions);
  let payload = {};
  try { payload = await response.json(); } catch {}

  if (response.status === 401 && sessionAtRequest?.refresh_token && state.supabase &&
      state.session?.user?.id === sessionAtRequest.user?.id &&
      (authToken === undefined || authToken === sessionAtRequest.access_token)) {
    try {
      if (!state.sessionRefreshPromise) {
        state.sessionRefreshPromise = state.supabase.auth.refreshSession()
          .then(({ data, error }) => {
            if (error) throw error;
            if (!data.session?.access_token) throw new Error('Invalid refreshed session');
            state.session = data.session;
            return state.session;
          })
          .finally(() => { state.sessionRefreshPromise = null; });
      }
      const refreshed = await state.sessionRefreshPromise;
      headers.set('Authorization', 'Bearer ' + refreshed.access_token);
      response = await fetch(path, requestOptions);
      payload = {};
      try { payload = await response.json(); } catch {}
    } catch (err) {
      console.warn('Session refresh failed:', err.message);
    }
  }

  if (!response.ok) throw new Error(payload.error || `សំណើមិនជោគជ័យ (${response.status})`);
  return payload;
}

const isAdmin = () => Boolean(state.me?.isAdmin);
const isSellerAccount = () => Boolean(state.me?.vendor && state.me.vendor.status !== 'blocked');
const isVerifiedSeller = () => state.me?.vendor?.status === 'approved';
const profileName = () => state.me?.profile?.display_name || state.session?.user?.user_metadata?.display_name || state.session?.user?.email?.split('@')[0] || 'គណនីអ្នកប្រើប្រាស់';

function requireLogin() {
  if (state.session) return true;
  openAuth();
  return false;
}

async function loadIdentity(sessionSnapshot = state.session, revision = state.authRevision) {
  if (!sessionSnapshot?.access_token) {
    if (revision === state.authRevision) state.me = null;
    return null;
  }

  const res = await api('/api/me', { authToken: sessionSnapshot.access_token });
  // Ignore a delayed profile response after the user switches accounts or signs out.
  if (revision !== state.authRevision ||
      state.session?.user?.id !== sessionSnapshot.user?.id) return null;

  state.me = res.data;
  return res.data;
}

async function refreshSession() {
  if (!state.supabase) {
    state.session = null;
    state.me = null;
    syncHeader();
    applyMaintenanceUI();
    return false;
  }

  try {
    const { data, error } = await state.supabase.auth.getSession();
    if (error) throw error;
    state.session = data.session || null;
  } catch (error) {
    console.warn('Could not restore Supabase session:', error.message);
    state.session = null;
  }

  const revision = ++state.authRevision;
  const sessionSnapshot = state.session;

  if (sessionSnapshot) {
    try {
      await loadIdentity(sessionSnapshot, revision);
    } catch (error) {
      // A profile/API hiccup must not invalidate a valid Supabase login or block the storefront.
      if (revision === state.authRevision &&
          state.session?.user?.id === sessionSnapshot.user?.id) {
        console.warn('Could not load account profile:', error.message);
        state.me = {
          user: {
            id: sessionSnapshot.user?.id,
            email: sessionSnapshot.user?.email || null,
            phone: sessionSnapshot.user?.phone || null
          },
          profile: {
            display_name: sessionSnapshot.user?.user_metadata?.display_name
              || sessionSnapshot.user?.email?.split('@')[0]
              || 'គណនីអ្នកប្រើប្រាស់'
          },
          vendor: null,
          isAdmin: false
        };
      }
    }
  } else {
    state.me = null;
  }

  syncHeader();
  applyMaintenanceUI();
  if (state.session) void syncVendorPresence();
  return Boolean(state.session);
}

/* --------------------------------------------------------------------------
   5. Navigation & Routing
   -------------------------------------------------------------------------- */
function showView(name, options = {}) {
  const allowed = ['home', 'profile', 'seller', 'admin', 'product', 'store'];
  if (!allowed.includes(name)) name = 'home';

  if (!options.optimistic) {
    if (['profile', 'seller'].includes(name) && !state.session) {
      openAuth();
      return Promise.resolve(false);
    }
    if (name === 'admin' && !isAdmin()) {
      if (options.fromHistory) name = 'home';
      else { toast('មុខងារនេះសម្រាប់ Admin ប៉ុណ្ណោះ។', 'error'); return Promise.resolve(false); }
    }
    if (name === 'seller' && !isSellerAccount()) {
      if (options.fromHistory) name = 'home';
      else {
        toast(state.me?.vendor?.status === 'blocked' ? 'ហាងនេះត្រូវបានបិទដោយ Admin។' : 'សូមចុះឈ្មោះបង្កើតហាងជាមុនសិន។', 'warning');
        if (!state.me?.vendor) openSellerModal();
        return Promise.resolve(false);
      }
    }
  }

  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  $('view-' + name)?.classList.add('active');
  document.querySelectorAll('#mobileMarketNav [data-view]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === name);
  });

  document.documentElement.dataset.initialView = name;
  const routeHash = name === 'product'
    ? (state.currentProduct?.id ? 'product/' + encodeURIComponent(state.currentProduct.id) : (options.optimistic ? String(window.location.hash || '#product').replace(/^#/, '') : 'product'))
    : name === 'store'
      ? (state.currentStoreId ? 'store/' + encodeURIComponent(state.currentStoreId) : (options.optimistic ? String(window.location.hash || '#store').replace(/^#/, '') : 'store'))
      : name;

  try {
    sessionStorage.setItem('ecomstore.activeView', name);
    if (name === 'product' && state.currentProduct?.id) sessionStorage.setItem('ecomstore.currentProductId', String(state.currentProduct.id));
    if (name === 'store' && state.currentStoreId) sessionStorage.setItem('ecomstore.currentStoreId', String(state.currentStoreId));
  } catch {}

  if (!options.fromHistory && window.location.hash !== '#' + routeHash) {
    try { window.location.hash = '#' + routeHash; } catch {}
  }

  closeDropdowns();
  if (!options.preserveScroll) window.scrollTo({ top: 0, behavior: 'smooth' });

  const tasks = [];
  if (!options.deferLoad) {
    if (name === 'profile') tasks.push(renderProfile());
    if (name === 'seller') tasks.push(renderSeller());
    if (name === 'admin') tasks.push(renderAdmin());
    if (name === 'product') tasks.push(Promise.resolve().then(() => renderProductDetail()));
    if (name === 'store') tasks.push(Promise.resolve().then(() => renderStorefront()));
  }
  return Promise.all(tasks).then(() => true);
}

/* --------------------------------------------------------------------------
   6. Header, Branding & Maintenance UI
   -------------------------------------------------------------------------- */
function avatarFallbackMarkup(name = '') {
  const initial = Array.from(String(name || '').trim())[0] || '7';
  return `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="emeraldAvatarGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#064E3B"/><stop offset="1" stop-color="#10B981"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="url(#emeraldAvatarGradient)"/><circle cx="50" cy="36" r="17" fill="#D1FAE5"/><path d="M16 94c3-21 16-32 34-32s31 11 34 32" fill="#A7F3D0"/><text x="50" y="91" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#FFFFFF">${esc(initial)}</text></svg>`;
}

function setAvatar(target, url, name = '') {
  if (!target) return;
  const fallback = () => {
    target.classList.remove('shimmer-scan', 'is-loaded');
    target.classList.add('is-failed');
    target.innerHTML = avatarFallbackMarkup(name);
  };
  if (!url) { fallback(); return; }
  target.classList.add('img-scan-wrap', 'shimmer-scan');
  target.classList.remove('is-loaded', 'is-failed');
  target.innerHTML = `<img src="${esc(url)}" alt="" class="h-full w-full object-cover">`;
  const img = target.querySelector('img');
  if (img) {
    img.addEventListener('load', () => {
      target.classList.remove('shimmer-scan');
      target.classList.add('is-loaded');
    }, { once: true });
    img.addEventListener('error', fallback, { once: true });
    if (img.complete && img.naturalWidth > 0) {
      target.classList.remove('shimmer-scan');
      target.classList.add('is-loaded');
    }
  }
}

function setProfileCover(target, url = '') {
  if (!target) return;
  const current = target.querySelector(':scope > .profile-cover-image');
  if (!url) {
    current?.remove();
    target.style.backgroundImage = '';
    target.style.backgroundSize = '';
    target.style.backgroundPosition = '';
    target.style.backgroundRepeat = '';
    target.classList.remove('has-profile-cover');
    return;
  }
  target.style.backgroundImage = 'none';
  target.classList.add('has-profile-cover');
  const img = document.createElement('img');
  img.className = 'profile-cover-image';
  img.alt = 'Cover របស់គណនី';
  img.decoding = 'async';
  img.loading = 'eager';
  img.src = String(url);
  img.addEventListener('load', () => target.classList.add('has-profile-cover'), { once: true });
  img.addEventListener('error', () => {
    img.remove();
    target.style.backgroundImage = '';
    target.classList.remove('has-profile-cover');
    console.warn('Profile cover image failed to load:', String(url).slice(0, 180));
  }, { once: true });
  if (current) current.replaceWith(img);
  else target.insertBefore(img, target.firstChild);
}

function syncHeader() {
  const logged = Boolean(state.session);
  const seller = isSellerAccount();
  const verified = isVerifiedSeller();
  const admin = isAdmin();

  $('supportChatLauncher')?.classList.toggle('hidden', !logged);
  $('navName').textContent = logged ? profileName() : 'ភ្ញៀវ';
  $('menuUserName').textContent = logged ? profileName() : 'សួស្តី!';
  $('menuUserStatus').textContent = admin ? 'អ្នកគ្រប់គ្រង' : verified ? 'អ្នកលក់ផ្ទៀងផ្ទាត់' : seller ? 'អ្នកលក់ទូទៅ · អាចផ្ទៀងផ្ទាត់ដោយស្ម័គ្រចិត្ត' : logged ? 'អ្នកទិញ' : 'មិនទាន់ចូលគណនី';
  $('navRole').textContent = admin ? 'Admin' : seller ? 'Seller' : logged ? 'Buyer' : 'Guest';
  setAvatar($('navAvatar'), state.me?.profile?.avatar_url, profileName());

  $('postAdBtn').classList.toggle('hidden', !logged);
  $('mobilePostBtn').classList.toggle('hidden', !logged);

  const menu = $('profileMenu');
  menu.querySelector('[data-action="seller-dashboard"]').classList.toggle('hidden', !seller);
  menu.querySelector('[data-action="admin"]').classList.toggle('hidden', !admin);
  menu.querySelector('[data-action="profile"]').classList.toggle('hidden', !logged);
  menu.querySelector('[data-action="saved"]').classList.toggle('hidden', !logged);

  const accountAction = menu.querySelector('[data-action="login"],[data-action="logout"]');
  if (accountAction) {
    accountAction.textContent = logged ? 'ចាកចេញ' : 'ចូលគណនី';
    accountAction.dataset.action = logged ? 'logout' : 'login';
  }
}

function applyMaintenanceUI() {
  const adminPreview = state.maintenanceMode && isAdmin();
  const blocked = state.maintenanceMode && !isAdmin();
  document.body.classList.toggle('maintenance-active', blocked);
  $('maintenanceOverlay').classList.toggle('hidden', !blocked);
  $('maintenanceOverlay').setAttribute('aria-hidden', String(!blocked));
  $('maintenanceOverlayMessage').textContent = state.maintenanceMessage;
  $('maintenanceAdminPill').classList.toggle('hidden', !adminPreview);
  document.body.classList.add('maintenance-ready');
}

function applyFavicon(url) {
  if (!url) return;
  state.faviconUrl = url;
  let link = document.querySelector('link[data-site-favicon]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.dataset.siteFavicon = 'true';
    document.head.appendChild(link);
  }
  link.href = url;
}

function applySiteBranding(data = {}) {
  state.siteBranding = { ...state.siteBranding, ...data };
  const b = state.siteBranding;
  const title = String(b.siteTitle || '7inOne');
  const subtitle = String(b.siteSubtitle || 'ផ្សារទិញលក់កម្ពុជា');

  document.title = `${title} · ${subtitle}`;
  if ($('siteTitle')) $('siteTitle').textContent = title;
  if ($('siteSubtitle')) $('siteSubtitle').textContent = subtitle;
  if ($('footerSiteTitle')) $('footerSiteTitle').textContent = title;
  if ($('footerSiteSubtitle')) $('footerSiteSubtitle').textContent = subtitle;

  const mark = $('siteLogoMark');
  if (mark) {
    if (b.siteLogoUrl) {
      mark.innerHTML = `<img src="${esc(b.siteLogoUrl)}" alt="" class="h-full w-full object-contain bg-white p-1">`;
      mark.querySelector('img')?.addEventListener('error', () => { mark.innerHTML = ic('bag', 20); }, { once: true });
    } else {
      mark.innerHTML = ic('bag', 20);
    }
  }

  const footerMark = $('footerLogoMark');
  if (footerMark) {
    footerMark.innerHTML = b.siteLogoUrl ? `<img src="${esc(b.siteLogoUrl)}" alt="" class="h-full w-full object-contain rounded-lg bg-white p-1">` : '7';
  }

  if (b.faviconUrl) applyFavicon(b.faviconUrl);
  if ($('heroBadge')) $('heroBadge').textContent = String(b.heroBadge || '');
  if ($('heroTitle')) $('heroTitle').textContent = String(b.heroTitle || '');
  if ($('heroSubtitle')) $('heroSubtitle').textContent = String(b.heroSubtitle || '');

  renderHomeSidePosters();

  const images = Array.isArray(b.heroImages) ? b.heroImages.slice(0, 3) : [];
  for (let i = 1; i <= 3; i++) {
    const target = $('heroImage' + i);
    const item = images[i - 1];
    const url = item?.url || item?.image_url || item?.imageUrl || '';
    if (!target) continue;
    if (url) {
      target.parentElement?.querySelector('.hero-placeholder')?.classList.add('hidden');
      target.src = url;
      target.classList.remove('hidden');
      target.onerror = () => {
        target.classList.add('hidden');
        target.parentElement?.querySelector('.hero-placeholder')?.classList.remove('hidden');
      };
    } else {
      target.removeAttribute('src');
      target.classList.add('hidden');
      target.parentElement?.querySelector('.hero-placeholder')?.classList.remove('hidden');
    }
  }
}

function renderHomeSidePosters() {
  const rail = $('homePromoRail');
  if (!rail) return;
  const posters = state.siteBranding.sidePosters || {};
  const defaults = {
    top: ['Free Delivery', 'ដឹកជញ្ជូនងាយស្រួល'],
    middle: ['Secure Payment', 'ការទូទាត់មានសុវត្ថិភាព'],
    tall: ['7inOne Promotion', 'ការផ្តល់ជូនពិសេស']
  };

  for (const slot of ['top', 'middle', 'tall']) {
    const item = posters[slot];
    const target = rail.querySelector(`[data-promo-slot="${slot}"]`);
    if (!target) continue;
    if (item?.url && item.enabled !== false) {
      const content = `<img src="${esc(item.url)}" alt="${esc(item.alt || '7inOne promotion')}" loading="lazy" />`;
      target.innerHTML = item.link ? `<a href="${esc(item.link)}" target="_blank" rel="noopener noreferrer">${content}</a>` : content;
    } else {
      target.innerHTML = `<div class="home-promo-placeholder"><b>${defaults[slot][0]}</b><span>${defaults[slot][1]}</span></div>`;
    }
  }
}

/* --------------------------------------------------------------------------
   7. Marketplace & Product Cards
   -------------------------------------------------------------------------- */
function productImage(p) {
  return p.product_images?.find((x) => x.image_url)?.image_url || '';
}

function productDescriptionParts(product = {}) {
  const raw = String(product.description || '');
  if (raw.includes(PRODUCT_DESC_SEPARATOR)) {
    const idx = raw.indexOf(PRODUCT_DESC_SEPARATOR);
    return {
      short: String(product.short_description || raw.slice(0, idx)).trim(),
      full: raw.slice(idx + PRODUCT_DESC_SEPARATOR.length).trim()
    };
  }
  const legacyMarker = '\n<!--MORE-->\n';
  if (raw.includes(legacyMarker)) {
    const idx = raw.indexOf(legacyMarker);
    return {
      short: String(product.short_description || raw.slice(0, idx)).trim(),
      full: raw.slice(idx + legacyMarker.length).trim()
    };
  }
  const legacyShort = String(product.short_description || raw.split(/\r?\n/).slice(0, 3).join('\n')).trim();
  return { short: Array.from(legacyShort).slice(0, 140).join(''), full: raw };
}

function verifiedStoreBadge(vendorId, showKhmerLabel = false) {
  const id = String(vendorId || '');
  const onlineClass = id && state.vendorPresenceIds.has(id) ? ' is-online' : '';
  const label = showKhmerLabel ? '<span class="verified-store-label">បានផ្ទៀងផ្ទាត់</span>' : '';
  const points = Array.from({ length: 24 }, (_, idx) => {
    const angle = (-90 + idx * 15) * Math.PI / 180;
    const radius = idx % 2 === 0 ? 10.7 : 9.45;
    return `${idx === 0 ? 'M' : 'L'}${(12 + Math.cos(angle) * radius).toFixed(2)} ${(12 + Math.sin(angle) * radius).toFixed(2)}`;
  }).join(' ') + ' Z';

  return `<span class="verified-store-badge${onlineClass}" data-vendor-id="${esc(id)}"><span class="badge-container" tabindex="0" aria-label="បានផ្ទៀងផ្ទាត់"><svg class="verified-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${points}" fill="currentColor" stroke="currentColor" stroke-width=".45" stroke-linejoin="round"/><path d="m7.8 12.2 2.7 2.7 5.8-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="badge-tooltip" role="tooltip">បានផ្ទៀងផ្ទាត់</span></span></span>${label}`;
}

function productCard(p, index) {
  const images = (p.product_images || []).filter((item) => item.image_url);
  const image = images[0]?.image_url || '';
  const secondImage = images[1]?.image_url || '';
  const saved = state.savedIds.has(p.id);
  const vendorName = p.vendors?.store_name || 'ហាងអ្នកលក់';
  const vendorLogo = p.vendors?.store_logo_url || '';
  const verified = p.vendors?.status === 'approved';
  const description = productDescriptionParts(p).short;

  const location = p.location || 'ភ្នំពេញ';
  return `
  <article class="cd" style="animation-delay:${Math.min(index, 12) * 30}ms">
    <div class="ph im">
      <button class="absolute inset-0 z-[1] h-full w-full" type="button" data-action="view" data-id="${esc(p.id)}" aria-label="មើល ${esc(p.title)}"></button>
      ${image
        ? `<span class="img-scan-wrap shimmer-scan cd-image-wrap cd-main-wrap"><img src="${esc(image)}" alt="${esc(p.title)}" loading="lazy" decoding="async" class="cd-main" onload="this.parentElement.classList.add(&#39;is-loaded&#39;)" onerror="if(this.dataset.retryAttempted!==&#39;1&#39;){this.dataset.retryAttempted=&#39;1&#39;;const image=this;setTimeout(()=>{image.src=image.src+(image.src.includes(&#39;?&#39;)?&#39;&amp;r=1&#39;:&#39;?r=1&#39;)},1500)}else{this.parentElement.classList.add(&#39;is-failed&#39;,&#39;image-failed&#39;);this.style.display=&#39;none&#39;}"></span>${secondImage ? `<span class="img-scan-wrap shimmer-scan cd-image-wrap cd-secondary-wrap"><img src="${esc(secondImage)}" alt="" loading="lazy" decoding="async" class="cd-secondary" onload="this.parentElement.classList.add(&#39;is-loaded&#39;)" onerror="if(this.dataset.retryAttempted!==&#39;1&#39;){this.dataset.retryAttempted=&#39;1&#39;;const image=this;setTimeout(()=>{image.src=image.src+(image.src.includes(&#39;?&#39;)?&#39;&amp;r=1&#39;:&#39;?r=1&#39;)},1500)}else{this.parentElement.classList.add(&#39;is-failed&#39;,&#39;image-failed&#39;);this.style.display=&#39;none&#39;}"></span>` : ''}`
        : ic('image', 36)}
      <button class="hv heart ${saved ? 'saved' : ''}" type="button" data-action="save" data-id="${esc(p.id)}" aria-label="រក្សាទុក" aria-pressed="${saved ? 'true' : 'false'}">
        ${ic('bookmark', 17)}
      </button>
    </div>
    <div class="cb">
      <h3 class="cursor-pointer hover:text-emerald-800" data-action="view" data-id="${esc(p.id)}">${esc(p.title)}</h3>
      <p class="pr"><span>${money(p.price)}</span></p>
      <div class="cd-condition-row">
        <span class="cd-location-meta">${esc(location)}</span>
      </div>
      ${description ? `<p class="cd-description">${esc(description)}</p>` : ''}
      <div class="sh">
        <span class="sp" role="img" aria-label="រូប Profile ហាង">
          <span class="sp-fallback">${ic('user', 15)}</span>
          ${vendorLogo ? `<img src="${esc(vendorLogo)}" alt="${esc(vendorName)}" loading="lazy" decoding="async">` : ''}
        </span>
        <button type="button" class="sn text-left hover:underline" data-action="store" data-vendor-id="${esc(p.vendor_id)}">${esc(vendorName)}</button>
        ${verified ? verifiedStoreBadge(p.vendor_id) : ''}
      </div>
      <p class="mt">
        <span>${timeAgoKm(p.created_at)}</span>
        <span class="vw" title="ចំនួនអ្នកមើល">${ic('eye', 13)}${formatViews(p.view_count)}</span>
      </p>
    </div>
  </article>`;
}

function renderProducts() {
  const list = state.products.filter((product) => {
    if (state.activeCondition === 'all') return true;
    const condition = String(product.condition || '').toLowerCase();
    const isNew = condition.includes('new') || condition.includes('ថ្មី');
    const isUsed = condition.includes('used') || condition.includes('second') || condition.includes('មួយទឹក') || condition.includes('ប្រើរួច');
    return state.activeCondition === 'new' ? isNew : isUsed;
  });
  $('productGrid').innerHTML = list.map(productCard).join('');
  $('resultCount').textContent = `${list.length} មុខ`;
  $('listingTitle').textContent = state.activeCategory === 'all' ? 'ទំនិញដែលគួរឱ្យចាប់អារម្មណ៍' : CATEGORIES[state.activeCategory] || 'ទំនិញ';
  $('listingSub').textContent = state.searchTerm ? `លទ្ធផលស្វែងរកសម្រាប់ «${esc(state.searchTerm)}»` : 'ទំនិញពិតពីហាងដែលបានចុះឈ្មោះនៅលើ 7inOne';
  $('emptyHome').classList.toggle('hidden', list.length > 0);
  $('productGrid').classList.toggle('hidden', list.length === 0);
  $('skeletonGrid').classList.add('hidden');
}

async function loadProducts() {
  const requestId = ++state.productsRequestId;
  const grid = $('productGrid');
  grid.setAttribute('aria-busy', 'true');
  grid.classList.add('hidden');
  $('emptyHome').classList.add('hidden');
  $('skeletonGrid').classList.remove('hidden');

  const params = new URLSearchParams({ page: '1', limit: '50' });
  if (state.searchTerm) params.set('q', state.searchTerm);
  if (state.activeCategory !== 'all') params.set('category', state.activeCategory);

  try {
    const res = await api('/api/products?' + params.toString());
    if (requestId !== state.productsRequestId) return;
    state.products = Array.isArray(res.data) ? res.data : [];
    renderProducts();
    syncHomeHeroImagesFromProducts();
    void loadHomeVendorMedia();
  } catch (error) {
    // Keep the last successful catalogue visible during a temporary API/network failure.
    if (requestId !== state.productsRequestId) return;
    renderProducts();
    toast('មិនអាចទាញយកទំនិញបានទេ៖ ' + error.message, 'error');
  } finally {
    if (requestId === state.productsRequestId) {
      $('skeletonGrid').classList.add('hidden');
      grid.classList.toggle('hidden', state.products.length === 0);
      grid.setAttribute('aria-busy', 'false');
    }
  }
}

function syncHomeHeroImagesFromProducts() {
  const configured = Array.isArray(state.siteBranding.heroImages) && state.siteBranding.heroImages.some((item) => item?.url || item?.image_url);
  if (configured) return;
  const candidates = state.products.filter((p) => p.product_images?.some((img) => img.image_url)).slice(0, 3);
  for (let i = 1; i <= 3; i++) {
    const target = $('heroImage' + i);
    const placeholder = target?.parentElement?.querySelector('.hero-placeholder');
    const product = candidates[i - 1];
    const image = product?.product_images?.find((item) => item.image_url);
    if (!target) continue;
    if (!image) {
      target.removeAttribute('src');
      target.classList.add('hidden');
      placeholder?.classList.remove('hidden');
      continue;
    }
    target.src = image.image_url;
    target.classList.remove('hidden');
    placeholder?.classList.add('hidden');
  }
}

function setCategory(category) {
  state.activeCategory = category;
  $('searchCategory').value = category;
  document.querySelectorAll('[data-category]').forEach((b) => b.classList.toggle('active', b.dataset.category === category));
  void loadProducts();
}

function saveAction(productId, button = null) {
  if (!requireLogin()) return;
  const id = String(productId);
  if (state.favoritePending.has(id)) return;
  const saved = state.savedIds.has(id);
  state.favoritePending.add(id);

  if (saved) {
    state.savedIds.delete(id);
    if (button) button.classList.remove('saved');
    void api('/api/saved/' + encodeURIComponent(id), { method: 'DELETE' })
      .then(() => {
        if (button?.hasAttribute('data-remove-saved')) {
          button.closest('[data-saved-card]')?.remove();
          const remaining = $('profileTabContent')?.querySelectorAll('[data-saved-card]').length || 0;
          $('profileActivityCount').textContent = `${remaining} មុខ`;
        }
      })
      .catch(() => { state.savedIds.add(id); if (button) button.classList.add('saved'); })
      .finally(() => state.favoritePending.delete(id));
    return;
  }

  state.savedIds.add(id);
  if (button) button.classList.add('saved');
  void api('/api/saved/' + encodeURIComponent(id), { method: 'POST' })
    .catch(() => { state.savedIds.delete(id); if (button) button.classList.remove('saved'); })
    .finally(() => state.favoritePending.delete(id));
}

/* --------------------------------------------------------------------------
   8. Product Detail & Lightbox
   -------------------------------------------------------------------------- */
async function openProduct(id, options = {}) {
  if (!id) { toast('មិនមានលេខសម្គាល់ទំនិញទេ។', 'warning'); return false; }
  const productId = String(id);
  const isCurrent = () => options.routeSyncNavigationId == null || options.routeSyncNavigationId === state.routeSyncNavigationId;

  try {
    if (state.session) { try { await loadOrders(); } catch {} }
    if (!isCurrent()) return false;

    try {
      sessionStorage.setItem('ecomstore.currentProductId', productId);
      sessionStorage.setItem('ecomstore.activeView', 'product');
    } catch {}

    const result = await api('/api/products/' + encodeURIComponent(productId));
    if (!isCurrent()) return false;
    const product = result.data;
    if (!product) throw new Error('មិនមានព័ត៌មានទំនិញនេះទេ។');

    const trust = await api('/api/vendors/' + encodeURIComponent(product.vendor_id) + '/ratings');
    if (!isCurrent()) return false;

    state.currentProduct = product;
    state.currentVendor = trust.data;
    state.productGalleryIndex = 0;

    await showView('product', { preserveScroll: Boolean(options.preserveScroll) });
    return true;
  } catch (error) {
    if (!isCurrent()) return false;
    toast(error.message, 'error');
    return false;
  }
}

function renderProductDetail() {
  const p = state.currentProduct;
  const v = state.currentVendor;
  if (!p || !v) return;

  const descriptions = productDescriptionParts(p);
  const images = (p.product_images || []).filter((i) => i.image_url);
  const activeImage = images[state.productGalleryIndex] || images[0];
  const saved = state.savedIds.has(p.id);
  const stockKnown = p.stock !== undefined && p.stock !== null;
  const stockLabel = stockKnown ? (Number(p.stock) > 0 ? 'មានទំនិញ' : 'អស់ពីស្តុក') : 'អាចសាកសួរបាន';
  const related = state.products.filter((item) => String(item.id) !== String(p.id) && (item.category === p.category || String(item.vendor_id) === String(p.vendor_id))).slice(0, 6);

  const galleryHtml = images.length
    ? `<div class="product-gallery-stage"><img id="productMainImage" src="${esc(activeImage.image_url)}" alt="${esc(p.title)}" data-gallery-zoom><span class="product-gallery-condition">${esc(p.condition || 'មិនបានបញ្ជាក់')}</span><button type="button" class="product-gallery-save" data-product-action="save" aria-pressed="${saved}">${ic('bookmark', 18)}</button>${images.length > 1 ? `<button type="button" class="product-gallery-arrow prev" data-gallery-step="-1">${ic('arrow', 17)}</button><button type="button" class="product-gallery-arrow next" data-gallery-step="1">${ic('arrow', 17)}</button>` : ''}<span class="product-gallery-counter">${state.productGalleryIndex + 1} / ${images.length}</span></div><div class="product-gallery-thumbs" id="productGalleryThumbs">${images.map((im, i) => `<button type="button" class="product-gallery-thumb ${i === state.productGalleryIndex ? 'active' : ''}" data-image="${i}"><img src="${esc(im.image_url)}" alt=""></button>`).join('')}</div>`
    : `<div class="product-gallery-stage">${ic('image', 48)}</div>`;

  const reviewItems = (v.reviews || []).slice(0, 5);
  const reviewTotal = Number(v.review_count || reviewItems.length || 0);
  const average = Number(v.rating || 0);

  $('productDetail').innerHTML = `
  <div class="product-detail-page">
    <section class="product-hero-grid">
      <div class="product-detail-gallery">${galleryHtml}</div>
      <div class="product-detail-info">
        <div class="product-top-meta">
          <span class="product-category-badge">${esc(CATEGORIES[p.category] || p.category || 'ទំនិញ')}</span>
          <span class="product-meta-item">${ic('clock', 14)} ${fmtDate(p.created_at)}</span>
          <span class="product-meta-item">${ic('eye', 14)} ${Number(p.view_count || 0).toLocaleString()} Views</span>
        </div>

        <ul class="product-facts-list">
          <li><span>ឈ្មោះផលិតផល</span><h1 class="product-detail-title">${esc(p.title)}</h1></li>
          <li><span>តម្លៃ</span><strong class="product-facts-price">${money(p.price)}</strong></li>
          <li><span>ស្តុក</span><strong class="product-facts-stock ${stockKnown && Number(p.stock) <= 0 ? 'is-out' : ''}">${ic(stockKnown && Number(p.stock) <= 0 ? 'x' : 'checkcircle', 14)} ${stockLabel}</strong></li>
          ${descriptions.short ? `<li><span>ព័ត៌មានខ្លី</span><p class="text-xs leading-6 text-slate-600">${esc(descriptions.short)}</p></li>` : ''}
        </ul>

        <div>
          <div class="product-primary-actions">
            <button type="button" class="product-buy-primary" data-product-action="buy">${ic('bag', 18)} ទិញឥឡូវនេះ</button>
            <button type="button" class="product-chat-primary" data-product-action="chat">${ic('chat', 18)} ឆាតជាមួយអ្នកលក់</button>
          </div>
          <div class="product-utility-actions">
            <button type="button" data-product-action="offer">${ic('tag', 16)} តថ្លៃទំនិញ</button>
            <button type="button" data-product-action="save" aria-pressed="${saved}">${ic('bookmark', 16)} ${saved ? 'បានរក្សាទុក' : 'រក្សាទុក'}</button>
          </div>
        </div>

        <section class="product-seller-card">
          <div class="product-seller-heading">
            <div class="product-seller-logo">${v.store_logo_url ? `<img src="${esc(v.store_logo_url)}" alt="">` : avatarFallbackMarkup(v.store_name)}</div>
            <div class="product-seller-identity">
              <b>${esc(v.store_name || 'ហាងអ្នកលក់')}</b>
              <span class="product-seller-verified">${v.status === 'approved' ? ic('checkcircle', 13) + ' អ្នកលក់បានផ្ទៀងផ្ទាត់' : 'អ្នកលក់'}</span>
            </div>
            <button type="button" class="product-store-button" data-product-action="store">${ic('store', 15)} មើលហាង</button>
          </div>
          <div class="product-seller-metrics">
            <div><b>${Number(v.active_listings || 0)}</b><small>ទំនិញលក់</small></div>
            <div><b>${Number(v.total_views || 0).toLocaleString()}</b><small>អ្នកមើល</small></div>
            <div><b>${reviewTotal}</b><small>ការវាយតម្លៃ</small></div>
          </div>
        </section>

        <article class="product-detail-description">
          <h2>${ic('file', 18)} ព័ត៌មានលម្អិតអំពីទំនិញ</h2>
          <p class="product-full-description">${esc(descriptions.full || descriptions.short || 'មិនទាន់មានការពិពណ៌នាលម្អិតទេ។')}</p>
          <div class="product-spec-grid">
            <div><small>ប្រភេទ</small><b>${esc(CATEGORIES[p.category] || p.category || 'មិនបានបញ្ជាក់')}</b></div>
            <div><small>ស្ថានភាព</small><b>${esc(p.condition || 'មិនបានបញ្ជាក់')}</b></div>
            <div><small>ទីតាំង</small><b>${ic('pin', 13)} ${esc(p.location || 'មិនបានបញ្ជាក់')}</b></div>
            <div><small>កាលបរិច្ឆេទបង្ហោះ</small><b>${fmtDate(p.created_at)}</b></div>
          </div>
        </article>
      </div>
    </section>

    <div class="product-trust-reviews-grid">
      <section class="product-reviews">
      <div class="flex items-center justify-between">
        <h2>${ic('star', 18)} ការវាយតម្លៃពីអ្នកទិញ</h2>
        <span class="text-xs text-slate-500">${reviewTotal} Reviews</span>
      </div>
      <div class="product-reviews-layout">
        <div class="product-rating-summary">
          <strong>${average ? average.toFixed(1) : '—'}</strong>
          <p class="mt-1 text-xs text-slate-500">ផ្អែកលើ ${reviewTotal} នាក់</p>
        </div>
        <div>
          ${reviewItems.map((r) => `<article class="product-review"><div class="product-review-heading"><b>${esc(r.buyer_name || 'អ្នកទិញ')}</b><span class="text-amber-500">${'★'.repeat(Number(r.rating || 5))}</span></div><p class="mt-1 text-xs text-slate-600">${esc(r.comment || '')}</p><small class="text-[10px] text-slate-400">${fmtDate(r.created_at)}</small></article>`).join('') || '<p class="text-xs text-slate-400">មិនទាន់មានការវាយតម្លៃទេ។</p>'}
        </div>
      </div>
      </section>

      <aside class="product-safety-note">
        <h2>${ic('shield', 18)} ការណែនាំសុវត្ថិភាពអ្នកទិញ</h2>
        <ul>
          <li>${ic('checkcircle', 15)}<span>ពិនិត្យទំនិញដោយផ្ទាល់ មុនពេលទូទាត់ប្រាក់</span></li>
          <li>${ic('checkcircle', 15)}<span>ស្នើសុំរូបភាព ឬព័ត៌មានបន្ថែម ប្រសិនបើមិនច្បាស់</span></li>
          <li>${ic('checkcircle', 15)}<span>កុំផ្ញើប្រាក់ជាមុន ទៅគណនីដែលមិនអាចផ្ទៀងផ្ទាត់បាន</span></li>
        </ul>
      </aside>
    </div>

    ${related.length ? `<section class="product-related-section"><h2>ទំនិញស្រដៀងគ្នា</h2><div class="product-related-grid">${related.map(productCard).join('')}</div></section>` : ''}

    <div class="product-mobile-actions">
      <button type="button" data-product-action="chat">${ic('chat', 16)}<span>ឆាត</span></button>
      <button type="button" data-product-action="offer">${ic('tag', 16)}<span>តថ្លៃ</span></button>
      <button type="button" class="brand-gradient" data-product-action="buy">${ic('bag', 16)}<span>ទិញឥឡូវនេះ</span></button>
    </div>
  </div>`;

  const updateGallery = (idx) => {
    if (!images.length) return;
    state.productGalleryIndex = (idx + images.length) % images.length;
    const main = $('productMainImage');
    if (main) main.src = images[state.productGalleryIndex].image_url;
    $('productGalleryThumbs')?.querySelectorAll('[data-image]').forEach((b) => b.classList.toggle('active', Number(b.dataset.image) === state.productGalleryIndex));
    const counter = $('productDetail').querySelector('.product-gallery-counter');
    if (counter) counter.textContent = `${state.productGalleryIndex + 1} / ${images.length}`;
    if (state.productLightboxOpen) updateProductLightbox();
  };

  $('productDetail').querySelectorAll('[data-image]').forEach((b) => b.addEventListener('click', () => updateGallery(Number(b.dataset.image))));
  $('productDetail').querySelectorAll('[data-gallery-step]').forEach((b) => b.addEventListener('click', () => updateGallery(state.productGalleryIndex + Number(b.dataset.galleryStep))));
  $('productDetail').querySelector('[data-gallery-zoom]')?.addEventListener('click', openProductLightbox);

  $('productDetail').querySelectorAll('[data-product-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.productAction;
      if (kind === 'store') void openStorefront(v.id);
      if (kind === 'buy') openCheckout(p);
      if (kind === 'save') saveAction(p.id, btn);
      if (kind === 'offer') {
        if (!requireLogin()) return;
        state.currentOfferProduct = p;
        $('offerProductName').textContent = `${p.title} · ${money(p.price)}`;
        $('offerAmount').value = p.price;
        openModal('offerModal');
      }
      if (kind === 'chat') void startBuyerSellerChat(p.id);
    });
  });

  $('productDetail').querySelector('.product-related-grid')?.addEventListener('click', (e) => {
    const save = e.target.closest('[data-action="save"]');
    if (save) { e.preventDefault(); e.stopPropagation(); saveAction(save.dataset.id, save); return; }
    const view = e.target.closest('[data-action="view"]');
    if (view) { void openProduct(view.dataset.id); return; }
    const store = e.target.closest('[data-action="store"]');
    if (store) void openStorefront(store.dataset.vendorId);
  });
}

function updateProductLightbox() {
  const images = (state.currentProduct?.product_images || []).filter((item) => item.image_url);
  const image = images[state.productGalleryIndex];
  if (!image) return;
  $('productLightboxImage').src = image.image_url;
  $('productLightboxCount').textContent = `${state.productGalleryIndex + 1} / ${images.length}`;
  state.productLightboxZoom = 1;
  $('productLightboxImage').style.transform = 'scale(1)';
}

function openProductLightbox() {
  if (!(state.currentProduct?.product_images || []).some((item) => item.image_url)) return;
  state.productLightboxOpen = true;
  updateProductLightbox();
  $('productLightbox').classList.add('open');
  $('productLightbox').setAttribute('aria-hidden', 'false');
}

function closeProductLightbox() {
  state.productLightboxOpen = false;
  $('productLightbox').classList.remove('open');
  $('productLightbox').setAttribute('aria-hidden', 'true');
}

/* --------------------------------------------------------------------------
   9. Storefront View
   -------------------------------------------------------------------------- */
async function openStorefront(vendorId, options = {}) {
  if (!vendorId) { toast('មិនមានព័ត៌មានហាងនេះទេ។', 'warning'); return false; }
  const storeId = String(vendorId);
  const isCurrent = () => options.routeSyncNavigationId == null || options.routeSyncNavigationId === state.routeSyncNavigationId;
  Object.assign(state, {
    currentStoreId: storeId, currentStoreCategory: 'all', currentStoreSearch: '',
    currentStoreProducts: [], currentStorePage: 1, currentStoreLimit: 50,
    currentStoreTotal: 0, currentStoreLoading: true, currentStoreLoadError: false,
    currentStoreMoreLoading: false, currentStoreMoreError: false
  });
  try {
    sessionStorage.setItem('ecomstore.currentStoreId', storeId);
    sessionStorage.setItem('ecomstore.activeView', 'store');
    await showView('store', { preserveScroll: Boolean(options.preserveScroll) });
    if (!isCurrent()) return false;
    renderStorefront();
    const [result, catalogue] = await Promise.all([
      api('/api/vendors/' + encodeURIComponent(storeId) + '/ratings'),
      api('/api/products?page=1&limit=' + state.currentStoreLimit + '&vendor_id=' + encodeURIComponent(storeId))
    ]);
    if (!isCurrent()) return false;
    state.currentStoreData = result.data || null;
    state.currentStoreProducts = catalogue.data || [];
    state.currentStorePage = Number(catalogue.page || 1);
    state.currentStoreTotal = Number(catalogue.total || 0);
    state.currentStoreLoading = false;
    state.currentStoreLoadError = false;
    renderStorefront();
    return true;
  } catch (error) {
    if (!isCurrent()) return false;
    state.currentStoreLoading = false;
    state.currentStoreLoadError = true;
    renderStorefront();
    console.warn('Could not load storefront:', error.message);
    return false;
  }
}

async function loadMoreStoreProducts() {
  if (!state.currentStoreId || state.currentStoreMoreLoading ||
      state.currentStorePage * state.currentStoreLimit >= state.currentStoreTotal) return;
  state.currentStoreMoreLoading = true;
  state.currentStoreMoreError = false;
  renderStorefront();
  const nextPage = state.currentStorePage + 1;
  try {
    const result = await api('/api/products?page=' + nextPage + '&limit=' +
      state.currentStoreLimit + '&vendor_id=' + encodeURIComponent(state.currentStoreId));
    const existing = new Set(state.currentStoreProducts.map(product => String(product.id)));
    state.currentStoreProducts = state.currentStoreProducts.concat(
      (result.data || []).filter(product => !existing.has(String(product.id)))
    );
    state.currentStorePage = Number(result.page || nextPage);
    state.currentStoreTotal = Number(result.total ?? state.currentStoreTotal);
  } catch (error) {
    state.currentStoreMoreError = true;
    console.warn('Could not load more store products:', error.message);
  } finally {
    state.currentStoreMoreLoading = false;
    renderStorefront();
  }
}

function renderStorefront() {
  const root = $('storefrontContent');
  if (!root) return;
  root.onclick = handleStorefrontAction;
  if (state.currentStoreLoading) {
    root.innerHTML = `<div class="global-loading" role="status" aria-label="កំពុងផ្ទុកព័ត៌មានហាង">
      <div class="loader" aria-hidden="true"></div>
      <span>កំពុងផ្ទុកព័ត៌មានហាង...</span>
    </div>`;
    return;
  }
  if (state.currentStoreLoadError || !state.currentStoreData) {
    root.innerHTML = `<div class="storefront-error"><span>${ic('alert', 28)}</span>
      <h2>មិនអាចផ្ទុកព័ត៌មានហាងបានទេ</h2>
      <p>សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត ហើយព្យាយាមម្តងទៀត។</p>
      <button type="button" class="storefront-retry" data-store-retry>ព្យាយាមម្តងទៀត</button>
    </div>`;
    return;
  }

  const data = state.currentStoreData;
  const query = state.currentStoreSearch.trim().toLowerCase();
  const visible = state.currentStoreProducts.filter(product =>
    (state.currentStoreCategory === 'all' || product.category === state.currentStoreCategory) &&
    (!query || `${product.title || ''} ${product.description || ''}`.toLowerCase().includes(query))
  );
  const rating = Number(data.rating || 0);
  const ratingLabel = rating ? rating.toFixed(1) : '—';
  const reviewCount = Number(data.review_count || 0);
  const memberSince = data.created_at
    ? new Date(data.created_at).toLocaleDateString('km-KH', { year: 'numeric', month: 'short' }) : '—';
  const categories = [['all', 'ទាំងអស់'], ...Object.entries(CATEGORIES)];
  const hasMore = state.currentStorePage * state.currentStoreLimit < state.currentStoreTotal;
  const reviews = Array.isArray(data.reviews) ? data.reviews : [];

  root.innerHTML = `
    <section class="storefront-public">
      <div class="storefront-cover">${data.store_cover_url ? `<img src="${esc(data.store_cover_url)}" alt="" onerror="this.remove()">` : ''}</div>
      <div class="storefront-profile">
        <div class="storefront-avatar"><div class="storefront-avatar-ring">
          ${data.store_logo_url
            ? `<img src="${esc(data.store_logo_url)}" alt="${esc(data.store_name || 'ហាងអ្នកលក់')}" loading="lazy" onerror="this.remove()">`
            : avatarFallbackMarkup(data.store_name || 'ហាងអ្នកលក់')}
        </div></div>
        <div class="storefront-identity">
          <div class="storefront-title-line"><h1>${esc(data.store_name || 'ហាងអ្នកលក់')}</h1>${data.verified ? verifiedStoreBadge(data.id, true) : ''}</div>
          <p class="storefront-meta"><span>${esc(data.store_location || 'កម្ពុជា')}</span>
            <span>${Number(data.active_listings || 0)} មុខទំនិញ</span>
            <span>${rating ? '★ ' + esc(ratingLabel) : 'មិនទាន់មានពិន្ទុ'} (${reviewCount} ពិនិត្យ)</span>
          </p>
          ${data.description ? `<div class="storefront-bio"><span class="storefront-bio-label">Bio ហាង</span><p class="storefront-description">${esc(data.description)}</p></div>` : ''}
        </div>
      </div>
      <div class="storefront-stats">
        <div><strong>${rating ? esc(ratingLabel) : '—'}</strong><span>ការវាយតម្លៃ</span></div>
        <div><strong>${reviewCount}</strong><span>ការពិនិត្យ</span></div>
        <div><strong>${Number(data.total_views || 0).toLocaleString('km-KH')}</strong><span>ចំនួនមើល</span></div>
        <div><strong>${esc(memberSince)}</strong><span>សមាជិកតាំងពី</span></div>
      </div>
    </section>
    <section class="storefront-toolbar" aria-label="ស្វែងរកទំនិញក្នុងហាង">
      <input id="storeSearchInput" type="search" placeholder="ស្វែងរកក្នុងហាងនេះ..." value="${esc(state.currentStoreSearch)}" class="field">
      <div class="storefront-toolbar-chips" id="storeCategoryFilters">
        ${categories.map(([key, label]) => `<button type="button" data-store-category="${esc(key)}" class="store-filter ${state.currentStoreCategory === key ? 'active' : ''}">${esc(label)}</button>`).join('')}
      </div>
      <span class="storefront-result-count">${visible.length} / ${state.currentStoreTotal} មុខទំនិញ</span>
    </section>
    <section class="storefront-products-section">
      <div class="storefront-section-heading"><h2>ទំនិញក្នុងហាង</h2><span>${visible.length} មុខ</span></div>
      ${visible.length
        ? `<div id="storeProductGrid">${visible.map(productCard).join('')}</div>`
        : `<div class="storefront-empty"><span>${ic('package', 30)}</span><strong>មិនមានទំនិញដែលត្រូវនឹងការស្វែងរកទេ</strong><p>សូមសាកល្បងពាក្យស្វែងរក ឬប្រភេទទំនិញផ្សេងទៀត។</p></div>`}
      ${state.currentStoreMoreError ? '<div class="storefront-more-error">មិនអាចផ្ទុកទំនិញបន្ថែមបានទេ។ សូមព្យាយាមម្តងទៀត។</div>' : ''}
      ${hasMore ? `<div class="storefront-load-more-wrap"><button type="button" class="storefront-load-more" data-store-load-more ${state.currentStoreMoreLoading ? 'disabled' : ''}>${state.currentStoreMoreLoading ? '<span class="loader" aria-hidden="true"></span>' : 'បង្ហាញបន្ថែម'}</button></div>` : ''}
    </section>
    ${reviews.length ? `
      <section class="storefront-reviews">
        <div class="storefront-section-heading"><h2>មតិយោបល់ពីអ្នកទិញ</h2><span>${reviewCount} ការពិនិត្យ</span></div>
        <div class="storefront-review-list">
          ${reviews.map(review => {
            const stars = Math.max(0, Math.min(5, Number(review.rating) || 0));
            const reviewDate = review.created_at ? new Date(review.created_at).toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
            return `<article class="storefront-review">
              <div class="storefront-review-top"><strong>${esc(review.buyer_name || 'អ្នកទិញ')}</strong><time>${esc(reviewDate)}</time></div>
              <div class="storefront-review-stars" aria-label="${stars} ក្នុង 5 ផ្កាយ">${'★'.repeat(stars)}<span>${'★'.repeat(5-stars)}</span></div>
              ${review.comment ? `<p>${esc(review.comment)}</p>` : ''}
            </article>`;
          }).join('')}
        </div>
      </section>` : ''}
  `;

  $('storeSearchInput')?.addEventListener('input', event => {
    state.currentStoreSearch = event.target.value;
    const cursor = event.target.selectionStart;
    renderStorefront();
    const input = $('storeSearchInput');
    input?.focus();
    if (typeof cursor === 'number') input?.setSelectionRange(cursor, cursor);
  });
  $('storeCategoryFilters')?.addEventListener('click', event => {
    const button = event.target.closest('[data-store-category]');
    if (button) { state.currentStoreCategory = button.dataset.storeCategory; renderStorefront(); }
  });
  $('storeProductGrid')?.addEventListener('click', event => {
    const heart = event.target.closest('[data-action="save"]');
    if (heart) { event.preventDefault(); event.stopPropagation(); saveAction(heart.dataset.id, heart); return; }
    const view = event.target.closest('[data-action="view"]');
    if (view) void openProduct(view.dataset.id);
  });
}

function handleStorefrontAction(event) {
  if (event.target.closest('[data-store-retry]')) {
    void openStorefront(state.currentStoreId, { preserveScroll: true });
    return;
  }
  if (event.target.closest('[data-store-load-more]')) void loadMoreStoreProducts();
}

/* --------------------------------------------------------------------------
   10. Profile, Orders & Saved Items
   -------------------------------------------------------------------------- */
async function loadSaved() {
  const r = await api('/api/saved');
  state.savedIds = new Set((r.data || []).map((x) => x.products?.id).filter(Boolean));
  return r.data || [];
}

async function loadOrders() {
  const r = await api('/api/orders');
  state.myOrders = r.data || [];
  return state.myOrders;
}

async function loadOffers() {
  const r = await api('/api/offers');
  return r.data || [];
}

async function renderProfile() {
  if (!requireLogin()) return;
  await refreshSession();
  await renderTelegramSecurity();

  const p = state.me.profile || {};
  $('profileName').value = p.display_name || '';
  $('profilePhone').value = p.phone || state.session.user.phone || '';
  $('profileLocation').value = p.province || 'ភ្នំពេញ';
  $('profileBio').value = p.bio || '';
  setAvatar($('profileAvatar'), p.avatar_url, profileName());
  $('profileHeadingName').textContent = profileName();
  $('profileHeadingMeta').textContent = state.session.user.phone || state.session.user.email || 'សមាជិក 7inOne';

  const badges = [];
  if (isAdmin()) badges.push(`<span class="account-role-chip bg-violet-50 text-violet-700">${ic('shield', 12)} អ្នកគ្រប់គ្រង</span>`);
  if (isVerifiedSeller()) badges.push(`<span class="account-role-chip bg-emerald-50 text-emerald-700">${ic('checkcircle', 12)} អ្នកលក់បានផ្ទៀងផ្ទាត់</span>`);
  else if (isSellerAccount()) badges.push(`<span class="account-role-chip bg-amber-50 text-amber-700">${ic('store', 12)} អ្នកលក់ទូទៅ</span>`);
  $('profileSellerBadge').innerHTML = badges.join('');

  const cover = $('view-profile').querySelector('.cover');
  setProfileCover(cover, p.cover_url || '');
  $('profileApplyTop').textContent = state.me.vendor ? 'មើលស្ថានភាពហាង' : 'បើកហាងលក់នៅ 7inOne';
  await renderProfileTab();
}

async function renderProfileTab() {
  if (!state.session) return;
  try {
    if (state.profileTab === 'saved') {
      const saved = await loadSaved();
      $('profileActivityCount').textContent = `${saved.length} មុខ`;
      $('profileTabContent').innerHTML = saved.length
        ? `<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">${saved.map((row) => savedCard(row.products)).join('')}</div>`
        : '<div class="py-10 text-center text-xs text-slate-400">អ្នកមិនទាន់រក្សាទុកទំនិញណាមួយទេ។</div>';
    } else if (state.profileTab === 'history') {
      const [orders, offers] = await Promise.all([loadOrders(), loadOffers()]);
      $('profileActivityCount').textContent = `${orders.length} ការបញ្ជាទិញ · ${offers.length} សំណើ`;
      const orderHtml = orders.map((o) => `<div class="rounded-2xl border border-slate-100 p-3"><div class="flex justify-between"><b class="text-xs">Order #${esc(o.id.slice(0, 8))}</b><span class="text-[10px] font-bold text-emerald-700">${esc(o.status)}</span></div><p class="mt-1 text-[10px] text-slate-500">${fmtDate(o.created_at)} · ${money(o.total)}</p></div>`).join('');
      const offerHtml = offers.map((o) => `<div class="rounded-2xl border border-slate-100 p-3"><div class="flex justify-between"><b class="text-xs">${esc(o.products?.title || 'ទំនិញ')}</b><span class="text-[10px] font-bold text-amber-600">${esc(o.status)}</span></div><p class="mt-1 text-[10px] text-slate-500">ស្នើ ${money(o.offer_price)} · ${fmtDate(o.created_at)}</p></div>`).join('');
      $('profileTabContent').innerHTML = `<div class="space-y-3"><h4 class="text-xs font-bold">ប្រវត្តិការបញ្ជាទិញ</h4>${orderHtml || '<p class="text-[10px] text-slate-400">មិនទាន់មានការបញ្ជាទិញ។</p>'}<h4 class="pt-2 text-xs font-bold">ប្រវត្តិសំណើតថ្លៃ</h4>${offerHtml || '<p class="text-[10px] text-slate-400">មិនទាន់មានសំណើតម្លៃ។</p>'}</div>`;
    } else {
      const v = state.me.vendor;
      $('profileTabContent').innerHTML = v
        ? `<div class="rounded-2xl border border-slate-100 p-4"><b class="text-sm">${esc(v.store_name)}</b><p class="mt-1 text-xs text-slate-500">${esc(v.description || '')}<br>${esc(v.contact_phone || '')} · ${esc(v.address || '')}</p></div>`
        : `<div class="rounded-2xl bg-emerald-50 p-4"><b class="text-xs">ចុះឈ្មោះក្លាយជាអ្នកលក់</b><p class="mt-1 text-[11px] text-slate-600">បញ្ចូលព័ត៌មានហាង ដើម្បីចាប់ផ្តើមដាក់លក់។</p><button id="applySellerFromTab" class="mt-3 rounded-full brand-gradient px-5 py-2 text-[11px] font-bold text-white">ចុះឈ្មោះអ្នកលក់</button></div>`;
      $('applySellerFromTab')?.addEventListener('click', openSellerModal);
    }
  } catch (e) {
    $('profileTabContent').innerHTML = `<p class="text-xs text-rose-600">${esc(e.message)}</p>`;
  }
}

function savedCard(p) {
  if (!p) return '';
  return `<div data-saved-card="${esc(p.id)}" class="flex gap-3 rounded-2xl border border-slate-100 bg-white p-2.5">${productImage(p) ? `<img class="h-20 w-20 shrink-0 rounded-xl object-cover" src="${esc(productImage(p))}">` : `<div class="grid h-20 w-20 place-items-center rounded-xl bg-slate-100">${ic('image', 20)}</div>`}<div class="min-w-0 flex-1"><b class="block truncate text-xs">${esc(p.title)}</b><b class="mt-1 block text-sm text-emerald-700">${money(p.price)}</b><div class="mt-2 flex gap-3"><button data-open-product="${esc(p.id)}" class="text-[10px] font-bold text-emerald-700">មើលទំនិញ</button><button data-remove-saved="${esc(p.id)}" class="text-[10px] font-bold text-rose-600">ដកចេញ</button></div></div></div>`;
}

/* --------------------------------------------------------------------------
   11. Seller Center & Admin Panel
   -------------------------------------------------------------------------- */
function openSellerModal() {
  if (!requireLogin()) return;
  const vendor = state.me?.vendor;
  if (vendor?.status === 'approved') { toast('ហាងរបស់អ្នកបានផ្ទៀងផ្ទាត់រួចហើយ។'); return; }
  if (vendor?.status === 'blocked') { toast('ហាងនេះត្រូវបានបិទដោយ Admin។', 'error'); return; }
  $('sellerApplyForm').reset();
  $('shopName').value = vendor?.store_name || '';
  $('shopContact').value = vendor?.contact_phone || '';
  $('shopAddress').value = vendor?.address || '';
  $('sellerDocThumb').innerHTML = ic('file', 22);
  $('sellerDocPreview').classList.add('hidden');
  openModal('sellerModal');
}

function renderProductForm(product = null) {
  if (!isSellerAccount()) { openSellerModal(); return; }
  state.selectedProductImages = [];
  $('productForm').reset();
  $('editProductId').value = product?.id || '';
  $('productFormTitle').textContent = product ? 'កែប្រែព័ត៌មានទំនិញ' : 'បន្ថែមទំនិញថ្មី';
  $('productImageThumb').innerHTML = ic('image', 20);

  if (product) {
    $('productTitle').value = product.title;
    $('productPrice').value = product.price;
    $('productCategory').value = product.category;
    $('productLocation').value = product.location || 'ភ្នំពេញ';
    $('productCondition').value = product.condition || 'ប្រើរួចស្អាត';
    const desc = productDescriptionParts(product);
    $('productShortDesc').value = desc.short;
    $('productDescription').value = desc.full;
  }
  updateShortDescriptionCounter();
  openModal('productFormModal');
}

function updateShortDescriptionCounter() {
  const field = $('productShortDesc');
  const counter = $('productShortDescCount');
  if (!field || !counter) return;
  const lines = String(field.value || '').replace(/\r/g, '').split('\n').slice(0, 3);
  field.value = Array.from(lines.join('\n')).slice(0, 140).join('');
  counter.textContent = `${field.value.length}/140 · ${Math.max(1, field.value.split('\n').length)}/3 ជួរ`;
}

async function renderSeller() {
  const v = state.me?.vendor;
  if (!v || v.status === 'blocked') {
    $('sellerGate').classList.remove('hidden');
    $('sellerDashboardContent').classList.add('hidden');
    return;
  }
  $('sellerGate').classList.add('hidden');
  $('sellerDashboardContent').classList.remove('hidden');
  $('sellerVerificationNotice').classList.toggle('hidden', isVerifiedSeller());
  $('sellerVerificationNotice').classList.toggle('flex', !isVerifiedSeller());

  try {
    const [stats, productsRes, offers, ordersRes] = await Promise.all([
      api('/api/vendor/overview'),
      api('/api/vendor/products'),
      loadOffers(),
      api('/api/vendor/orders')
    ]);
    $('kpiListings').textContent = stats.data.activeListings;
    $('kpiViews').textContent = Number(stats.data.totalViews).toLocaleString();
    $('kpiRating').textContent = stats.data.averageRating ?? '—';
    $('kpiSales').textContent = stats.data.completedSales;

    state.sellerProductCache = productsRes.data || [];
    $('sellerProductsCount').textContent = String(state.sellerProductCache.length);
    const received = (offers || []).filter((o) => o.vendor_id === v.id);
    const sellerOrders = ordersRes.data || [];
    $('sellerOffersCount').textContent = String(received.length);
    $('sellerOrdersCount').textContent = String(sellerOrders.length);

    renderSellerProductList();
    renderSellerShopProfile(productsRes.vendor || v);

    $('sellerOffers').innerHTML = received.map((o) => `
      <article class="seller-transaction-row">
        <div><b>${esc(o.products?.title || 'ទំនិញ')}</b><small class="block text-slate-400">${esc(o.message || 'សំណើតថ្លៃ')}</small></div>
        <div class="text-xs text-slate-600">${esc(o.buyer_name || 'អ្នកទិញ')} · ${esc(o.buyer_phone || '')}</div>
        <div class="font-bold text-emerald-700">${money(o.offer_price)}</div>
        <div class="seller-transaction-actions">
          ${o.status === 'pending' ? `<button type="button" data-offer-action="accepted" data-id="${esc(o.id)}" class="seller-action-button is-complete">ទទួលយក</button><button type="button" data-offer-action="rejected" data-id="${esc(o.id)}" class="seller-action-button is-delete">បដិសេធ</button>` : `<span class="text-xs text-slate-500">${esc(o.status)}</span>`}
        </div>
      </article>`).join('') || '<div class="seller-empty-state">មិនទាន់មានសំណើតថ្លៃទេ</div>';

    $('sellerOrders').innerHTML = sellerOrders.map((row) => {
      const order = row.orders || {};
      const st = row.fulfillment_status || 'pending';
      return `<article class="seller-transaction-row">
        <div><b>${esc(row.products?.title || 'ទំនិញ')} × ${Number(row.quantity || 1)}</b><small class="block text-slate-400">Order #${esc(String(row.order_id || '').slice(0, 8))}</small></div>
        <div class="text-xs text-slate-600">${esc(order.customer_name || 'អ្នកទិញ')} · ${esc(order.customer_phone || '')}</div>
        <div class="font-bold text-emerald-700">${money(Number(row.unit_price || 0) * Number(row.quantity || 0))}</div>
        <div class="seller-transaction-actions">
          ${st === 'pending' ? `<button type="button" data-order-status="processing" data-order-id="${esc(row.order_id)}" class="seller-action-button is-complete">ទទួលយក</button>` : ''}
          ${st === 'processing' ? `<button type="button" data-order-status="shipped" data-order-id="${esc(row.order_id)}" class="seller-action-button is-renew">ដឹកជញ្ជូន</button>` : ''}
          ${st === 'shipped' ? `<button type="button" data-order-status="completed" data-order-id="${esc(row.order_id)}" class="seller-action-button is-complete">បញ្ចប់</button>` : ''}
        </div>
      </article>`;
    }).join('') || '<div class="seller-empty-state">មិនទាន់មានការបញ្ជាទិញទេ</div>';
  } catch (e) {
    toast('មិនអាចផ្ទុក Dashboard៖ ' + e.message, 'error');
  }
}

function renderSellerProductList() {
  const target = $('sellerProducts');
  if (!target) return;
  const term = String($('sellerProductSearch')?.value || '').trim().toLowerCase();
  const filtered = state.sellerProductCache.filter((p) => {
    const matchesTerm = !term || String(p.title || '').toLowerCase().includes(term);
    const matchesFilter = state.sellerActiveFilter === 'all' || p.status === state.sellerActiveFilter;
    return matchesTerm && matchesFilter;
  });

  target.innerHTML = filtered.map((p) => `
    <article class="seller-product-row">
      <div class="seller-product-main">
        <div class="seller-product-thumb">${productImage(p) ? `<img src="${esc(productImage(p))}" alt="">` : ic('image', 20)}</div>
        <div class="seller-product-copy"><b>${esc(p.title)}</b><small>${esc(p.category || 'ទូទៅ')}</small></div>
      </div>
      <div class="seller-product-price">${money(p.price)}</div>
      <div class="seller-product-metrics"><span>${Number(p.stock || 0)} ស្តុក</span><span>${Number(p.view_count || 0)} Views</span></div>
      <div class="seller-product-validity"><span class="seller-status-badge is-active">${esc(p.status)}</span></div>
      <div class="seller-product-actions">
        <button type="button" data-seller-action="edit" data-id="${esc(p.id)}" class="seller-action-button">${ic('edit', 13)} កែប្រែ</button>
        <button type="button" data-seller-action="delete" data-id="${esc(p.id)}" class="seller-action-button is-delete">${ic('trash', 13)} លុប</button>
      </div>
    </article>`).join('') || '<div class="seller-empty-state">មិនមានទំនិញក្នុងបញ្ជីនេះទេ</div>';
}

function renderSellerShopProfile(vendor) {
  if (!vendor) return;
  $('sellerShopName').value = vendor.store_name || '';
  $('sellerShopLocation').value = vendor.store_location || vendor.address || '';
  $('sellerShopDescription').value = vendor.description || '';
  $('sellerShopLogoPreview').innerHTML = vendor.store_logo_url ? `<img src="${esc(vendor.store_logo_url)}">` : ic('store', 24);
  $('sellerShopCoverPreview').innerHTML = vendor.store_cover_url ? `<img src="${esc(vendor.store_cover_url)}">` : '<span>រូប Cover ហាង</span>';
}

async function renderAdmin() {
  if (!isAdmin()) return;
  const b = state.siteBranding;
  $('brandTitleInput').value = b.siteTitle || '7inOne';
  $('brandSubtitleInput').value = b.siteSubtitle || '';
  $('heroBadgeInput').value = b.heroBadge || '';
  $('heroTitleInput').value = b.heroTitle || '';
  $('heroSubtitleInput').value = b.heroSubtitle || '';
  $('maintenanceToggle').checked = state.maintenanceMode;
  $('maintenanceMessageInput').value = state.maintenanceMessage;

  try {
    const res = await api('/api/admin/vendors');
    const vendors = res.data || [];
    $('adminPendingCount').textContent = vendors.filter((v) => v.status === 'pending' && v.document_url).length;
    $('adminApprovedCount').textContent = vendors.filter((v) => v.status === 'approved').length;
    $('adminRejectedCount').textContent = vendors.filter((v) => ['rejected', 'blocked'].includes(v.status)).length;
    $('adminApplications').innerHTML = vendors.map((v) => `
      <div class="rounded-2xl border border-slate-100 p-4 flex flex-wrap items-center justify-between gap-3">
        <div><b class="text-xs">${esc(v.store_name)}</b><p class="text-[10px] text-slate-500">${esc(v.contact_phone || '')} · ${esc(v.status)}</p></div>
        <div class="flex gap-2">
          ${v.status === 'pending' && v.document_url ? `<button data-admin-review="approved" data-id="${esc(v.id)}" class="rounded-full bg-emerald-600 px-4 py-1.5 text-[10px] font-bold text-white">អនុម័ត</button><button data-admin-review="rejected" data-id="${esc(v.id)}" class="rounded-full bg-rose-50 px-4 py-1.5 text-[10px] font-bold text-rose-600">បដិសេធ</button>` : ''}
        </div>
      </div>`).join('') || '<p class="py-6 text-center text-xs text-slate-400">មិនទាន់មានពាក្យស្នើសុំអ្នកលក់។</p>';
  } catch (e) {
    toast('មិនអាចផ្ទុក Admin៖ ' + e.message, 'error');
  }
}

/* --------------------------------------------------------------------------
   12. Unified Buyer / Seller Chat System
   -------------------------------------------------------------------------- */
function scrollSellerChatToBottom() {
  const target = $('sellerChatMessages');
  if (!target) return;
  const apply = () => { target.scrollTop = target.scrollHeight; };
  apply();
  requestAnimationFrame(() => { apply(); setTimeout(apply, 60); });
}

function renderSellerChatDraftProduct() {
  const banner = $('sellerChatProductBanner');
  if (!banner) return;
  const p = state.chatDraftProduct;
  if (!p) {
    banner.classList.add('hidden');
    banner.classList.remove('is-closing');
    banner.innerHTML = '';
    return;
  }
  const img = productImage(p);
  banner.classList.remove('hidden', 'is-closing');
  banner.innerHTML = `
    <div class="seller-chat-draft-thumb">${img ? `<img src="${esc(img)}" alt="">` : ic('bag', 20)}</div>
    <div class="seller-chat-draft-meta"><small>សួរអំពីផលិតផលនេះ</small><b>${esc(p.title || 'ផលិតផល')}</b><strong>${money(p.price)}</strong></div>
    <button type="button" class="seller-chat-draft-close" data-dismiss-draft-product aria-label="ដកផលិតផលចេញ">${ic('x', 14)}</button>`;
}

function dismissSellerChatDraftProduct() {
  const banner = $('sellerChatProductBanner');
  if (!banner || banner.classList.contains('hidden')) { state.chatDraftProduct = null; return; }
  banner.classList.add('is-closing');
  setTimeout(() => { state.chatDraftProduct = null; renderSellerChatDraftProduct(); }, 230);
}

function renderSellerChatMessages(messages, forceScroll = false) {
  const target = $('sellerChatMessages');
  if (!target) return;
  const wasNearBottom = forceScroll || (target.scrollHeight - target.scrollTop - target.clientHeight < 110);

  target.innerHTML = (messages || []).map((msg) => {
    const own = msg.sender_role === state.chatMode;
    let content = '';
    if (msg.message_type === 'product') {
      const prod = msg.product || null;
      const img = prod?.image_url ? `<img src="${esc(prod.image_url)}" alt="">` : `<span class="seller-chat-product-placeholder">${ic('bag', 24)}</span>`;
      content = `<article class="seller-chat-product-card" ${prod?.id ? `data-chat-product-id="${esc(prod.id)}"` : ''}>${img}<div class="seller-chat-product-info"><small>ផលិតផលដែលបានសួរ</small><b>${esc(prod?.title || msg.body || 'ផលិតផល')}</b>${prod ? `<strong>${money(prod.price)}</strong>` : ''}</div></article>`;
    } else if (msg.message_type === 'image' && (msg.telegram_file_id || msg.local_image_url)) {
      const src = msg.local_image_url || `/api/media/telegram/${encodeURIComponent(msg.telegram_file_id)}?mime=${encodeURIComponent(msg.mime_type || 'image/jpeg')}`;
      content = `<a href="${esc(src)}" target="_blank" rel="noopener noreferrer"><img class="seller-chat-image" src="${esc(src)}" alt=""></a>`;
    } else {
      content = `<p>${esc(msg.body || '').replace(/\n/g, '<br>')}</p>`;
    }
    return `<div class="flex ${own ? 'justify-end' : 'justify-start'}"><div class="seller-chat-bubble ${own ? 'own' : 'other'}">${content}<small>${esc(new Date(msg.created_at).toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' }))}</small></div></div>`;
  }).join('') || '<p class="py-8 text-center text-xs text-slate-400">មិនទាន់មានសារទេ។ សូមចាប់ផ្ដើមសន្ទនា។</p>';

  if (wasNearBottom) scrollSellerChatToBottom();
}

function renderSellerChatInbox() {
  const target = $('sellerChatInboxList');
  if (!target) return;
  const total = state.chatInbox.reduce((sum, row) => sum + Number(row.unread_count || 0), 0);
  const badge = $('sellerChatUnreadBadge');
  badge.textContent = total > 99 ? '99+' : String(total);
  badge.classList.toggle('hidden', !total);

  target.innerHTML = state.chatInbox.map((chat) => {
    const isShop = chat.other_role === 'seller';
    const displayName = isShop ? (chat.vendor?.store_name || 'ហាងអ្នកលក់') : (chat.buyer?.display_name || chat.other_name || 'អ្នកប្រើប្រាស់');
    const avatarUrl = isShop ? chat.vendor?.store_logo_url : chat.buyer?.avatar_url;
    const img = avatarUrl
      ? `<img src="${esc(avatarUrl)}" alt="${esc(displayName)}" class="h-11 w-11 shrink-0 rounded-full object-cover">`
      : `<span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400">${ic(isShop ? 'store' : 'user', 20)}</span>`;
    return `<button type="button" data-unified-chat="${esc(chat.id)}" class="seller-chat-inbox-item ${Number(chat.unread_count) > 0 ? 'unread' : ''}">${img}<span class="min-w-0 flex-1"><b class="block truncate">${esc(displayName)}</b><small class="block truncate text-slate-400">${esc(chat.last_message_preview || 'ចុចដើម្បីបើកសន្ទនា')}</small></span>${Number(chat.unread_count) > 0 ? `<span class="rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white">${Number(chat.unread_count)}</span>` : ''}</button>`;
  }).join('') || '<p class="py-8 text-center text-xs text-slate-400">មិនទាន់មានសន្ទនាទេ។</p>';
}

async function loadUnifiedSellerChatInbox() {
  if (!state.session) return;
  try {
    const res = await api('/api/seller-chat/inbox');
    state.chatInbox = res.data || [];
    renderSellerChatInbox();
  } catch (err) {
    console.warn('Chat inbox load failed:', err.message);
  }
}

async function loadSellerChatConversation(scrollToBottom = false) {
  if (!state.chatConversationId || !state.session) return;
  const res = await api('/api/seller-chat/conversations/' + encodeURIComponent(state.chatConversationId));
  const data = res.data || {};
  const conv = data.conversation || {};
  const messages = data.messages || [];

  state.chatMode = conv.current_role === 'seller' ? 'seller' : 'buyer';
  const isShop = state.chatMode !== 'seller';
  const otherName = isShop ? (conv.vendor?.store_name || 'ហាងអ្នកលក់') : (conv.buyer?.display_name || 'អ្នកទិញ');
  $('sellerChatTitle').textContent = otherName;
  $('sellerChatSubtitle').textContent = isShop ? 'គណនីហាង · សន្ទនាផ្ទាល់' : 'សន្ទនាជាមួយអ្នកទិញ';

  const otherAvatar = isShop ? conv.vendor?.store_logo_url : conv.buyer?.avatar_url;
  $('sellerChatProductImage').innerHTML = otherAvatar
    ? `<img src="${esc(otherAvatar)}" alt="${esc(otherName)}" class="h-full w-full object-cover">`
    : `<span class="grid h-full w-full place-items-center text-slate-400">${ic(isShop ? 'store' : 'user', 18)}</span>`;

  state.chatLoadedMessages = messages;
  const pending = state.chatPendingMedia.filter((m) => m.conversation_id === state.chatConversationId);
  renderSellerChatMessages([...messages, ...pending], scrollToBottom);

  $('sellerChatInboxPane').classList.add('mobile-hidden');
  $('sellerChatBack').classList.remove('hidden');
  $('sellerChatThread').classList.add('mobile-active');
}

async function openSellerChat(conversationId, mode, draftProduct = null) {
  state.chatConversationId = conversationId;
  state.chatDraftProduct = draftProduct || null;
  renderSellerChatDraftProduct();
  if (mode) state.chatMode = mode;

  openModal('sellerChatModal');
  $('sellerChatMessages').innerHTML = '<div class="global-loading" role="status" aria-label="កំពុងផ្ទុកសន្ទនា"><div class="loader" aria-hidden="true"></div><span>កំពុងផ្ទុកសន្ទនា...</span></div>';
  await loadSellerChatConversation(true);
  await loadUnifiedSellerChatInbox();
  scrollSellerChatToBottom();
  setTimeout(() => $('sellerChatInput')?.focus(), 80);
}

async function openSellerChatInbox() {
  if (!requireLogin()) return;
  state.chatConversationId = null;
  state.chatDraftProduct = null;
  renderSellerChatDraftProduct();
  $('sellerChatInboxPane').classList.remove('mobile-hidden');
  $('sellerChatThread').classList.remove('mobile-active');
  $('sellerChatBack').classList.add('hidden');
  openModal('sellerChatModal');
  await loadUnifiedSellerChatInbox();
}

async function startBuyerSellerChat(productId) {
  if (!requireLogin()) return;
  const targetProduct = (state.currentProduct && String(state.currentProduct.id) === String(productId))
    ? state.currentProduct
    : state.products.find((x) => String(x.id) === String(productId));

  try {
    await loadUnifiedSellerChatInbox();
    let existingId = null;
    if (targetProduct?.vendor_id) {
      const match = state.chatInbox.find((c) => String(c.vendor_id || c.vendor?.id) === String(targetProduct.vendor_id));
      if (match) existingId = match.id;
    }
    if (existingId) {
      await openSellerChat(existingId, 'buyer', targetProduct || null);
      return;
    }
    const res = await api('/api/seller-chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, attach_product: false })
    });
    if (!res.data?.id) throw new Error('មិនអាចបើកសន្ទនាបានទេ។');
    await openSellerChat(res.data.id, 'buyer', targetProduct || null);
  } catch (error) {
    toast(error.message, 'error');
  }
}

function minimizeSellerChatPanel() {
  closeModal('sellerChatModal');
  $('supportChatLauncher')?.classList.remove('hidden');
}

function toggleSellerChatPanel() {
  const modal = $('sellerChatModal');
  if (modal.classList.contains('open')) { minimizeSellerChatPanel(); return; }
  if (state.chatConversationId) { openModal('sellerChatModal'); scrollSellerChatToBottom(); return; }
  void openSellerChatInbox();
}

function syncSellerChatComposer() {
  const input = $('sellerChatInput');
  const send = $('sellerChatSend');
  if (!input || !send) return;
  send.disabled = input.disabled || (!input.value.trim() && !state.chatDraftProduct);
  input.style.height = 'auto';
  input.style.height = Math.min(100, Math.max(40, input.scrollHeight)) + 'px';
}

/* --------------------------------------------------------------------------
   13. Checkout, Telegram & Presence Helpers
   -------------------------------------------------------------------------- */
function openCheckout(p) {
  if (!requireLogin()) return;
  if (!p || Number(p.stock) <= 0) { toast('ទំនិញនេះអស់ស្តុកហើយ។', 'warning'); return; }
  if (!$('checkoutModal')) {
    const wrap = document.createElement('div');
    wrap.id = 'checkoutModal';
    wrap.className = 'modal';
    wrap.innerHTML = `<section class="modal-box max-w-[520px] p-6"><div class="mb-4 flex items-center justify-between"><h2 class="text-lg font-bold">ព័ត៌មានដឹកជញ្ជូន និងទូទាត់</h2><button type="button" class="close-btn" data-close="checkoutModal">${ic('x', 16)}</button></div><form id="checkoutForm" class="space-y-3"><input id="checkoutName" required class="field" placeholder="ឈ្មោះអ្នកទទួល"><input id="checkoutPhone" required class="field" placeholder="លេខទូរស័ព្ទ"><textarea id="checkoutAddress" required class="field min-h-20" placeholder="អាសយដ្ឋានដឹកជញ្ជូន"></textarea><div class="flex justify-between pt-2 font-bold"><span>សរុប</span><span id="checkoutTotal" class="text-emerald-700"></span></div><button id="checkoutSubmit" class="brand-gradient w-full rounded-full py-3 text-xs font-bold text-white">បញ្ជាក់ការបញ្ជាទិញ</button></form></section>`;
    document.body.appendChild(wrap);
    wrap.querySelector('[data-close]').onclick = () => closeModal('checkoutModal');
    $('checkoutForm').onsubmit = async (e) => {
      e.preventDefault();
      try {
        await api('/api/orders', {
          method: 'POST',
          body: JSON.stringify({
            customer_name: $('checkoutName').value.trim(),
            customer_phone: $('checkoutPhone').value.trim(),
            delivery_address: $('checkoutAddress').value.trim(),
            payment_method: 'cash_on_delivery',
            items: [{ product_id: state.currentProduct.id, quantity: 1 }]
          })
        });
        closeModal('checkoutModal');
        toast('បានបញ្ជាទិញជោគជ័យ!');
        await Promise.all([loadOrders(), loadProducts()]);
      } catch (err) { toast(err.message, 'error'); }
    };
  }
  $('checkoutTotal').textContent = money(p.price);
  $('checkoutName').value = profileName();
  $('checkoutPhone').value = state.me?.profile?.phone || '';
  openModal('checkoutModal');
}

function openAuth(mode = 'login') {
  setAuthMode(mode);
  openModal('authModal');
  mountTelegramLoginWidget();
}

function mountTelegramLoginWidget() {
  return mountTelegramWidget('telegramLoginWidget', 'on7inOneTelegramLogin', 'telegramLoginWidgetMounted');
}

function mountTelegramWidget(containerId, callbackName, mountedKey) {
  const container = $(containerId);
  const username = String(state.telegramBotUsername || '').replace(/^@/, '').trim();
  if (!container || !/^[A-Za-z0-9_]{5,32}$/.test(username)) return false;
  if (state[mountedKey]) return true;

  container.replaceChildren();
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://telegram.org/js/telegram-widget.js?22';
  script.dataset.telegramLogin = username;
  script.dataset.size = 'large';
  script.dataset.userpic = 'false';
  script.dataset.onauth = callbackName + '(user)';
  container.appendChild(script);
  state[mountedKey] = true;
  return true;
}

async function completeTelegramLogin(identity) {
  if (state.telegramAuthPending) return;
  state.telegramAuthPending = true;
  try {
    if (!state.supabase) throw new Error('ប្រព័ន្ធ Supabase មិនទាន់ភ្ជាប់ទេ។');
    const response = await fetch('/api/auth/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(identity),
      cache: 'no-store'
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'មិនអាចចូលតាម Telegram បានទេ។');

    const session = payload.data?.session;
    if (!session?.access_token || !session?.refresh_token) {
      throw new Error('Telegram មិនបានផ្ដល់ Session ត្រឹមត្រូវទេ។');
    }

    const { data, error } = await state.supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token
    });
    if (error) throw error;
    state.session = data.session || session;
    await refreshSession();
    if (!state.session) throw new Error('មិនអាចរក្សាទុក Session របស់ Telegram បានទេ។');

    syncHeader();
    closeModal('authModal');
    toast(payload.data?.isNewUser
      ? 'បានបង្កើតគណនី និងចូលតាម Telegram ជោគជ័យ!'
      : 'បានចូលគណនីតាម Telegram ជោគជ័យ!');
    void Promise.all([loadSaved(), loadOrders(), loadUnifiedSellerChatInbox()])
      .catch(error => console.warn('Could not load Telegram account data:', error.message));
  } catch (error) {
    toast(error.message || 'មិនអាចចូលតាម Telegram បានទេ។', 'error');
  } finally {
    state.telegramAuthPending = false;
  }
}

async function completeTelegramLink(identity) {
  if (state.telegramAuthPending) return;
  if (!state.session) {
    toast('សូមចូលគណនី 7inOne ជាមុនសិន។', 'warning');
    return;
  }
  state.telegramAuthPending = true;
  try {
    await api('/api/me/telegram', {
      method: 'POST',
      body: JSON.stringify(identity)
    });
    state.telegramProfileWidgetMounted = false;
    $('telegramProfileWidget')?.replaceChildren();
    await renderTelegramSecurity();
    toast('បានភ្ជាប់ Telegram Login ជាមួយគណនីនេះរួចរាល់។');
  } catch (error) {
    toast(error.message || 'មិនអាចភ្ជាប់ Telegram បានទេ។', 'error');
  } finally {
    state.telegramAuthPending = false;
  }
}

window.on7inOneTelegramLogin = identity => { void completeTelegramLogin(identity); };
window.on7inOneTelegramLink = identity => { void completeTelegramLink(identity); }

function setAuthMode(mode) {
  state.authMode = mode;
  const reg = mode === 'register';
  $('authNameWrap').classList.toggle('hidden', !reg);
  $('authName').required = reg;
  $('authTitle').textContent = reg ? 'បង្កើតគណនី 7inOne' : 'សូមស្វាគមន៍មកកាន់ 7inOne';
  $('authSubmit').textContent = reg ? 'បង្កើតគណនី' : 'ចូលគណនី';
  document.querySelectorAll('[data-auth-mode]').forEach((b) => {
    const active = b.dataset.authMode === mode;
    b.classList.toggle('bg-white', active);
    b.classList.toggle('shadow-sm', active);
  });
}

async function renderTelegramSecurity() {
  if (!state.session) return;
  mountTelegramWidget('telegramProfileWidget', 'on7inOneTelegramLink', 'telegramProfileWidgetMounted');
  try {
    const res = await api('/api/me/telegram');
    const connected = Boolean(res.data?.connected);
    $('telegramAccountStatus').textContent = connected ? 'Telegram Bot Chat បានភ្ជាប់រួចរាល់ ✓' : 'Telegram Bot Chat មិនទាន់ភ្ជាប់';
    $('sendTelegramOtpBtn').disabled = !connected;
    $('changeTelegramPasswordBtn').disabled = !connected;
  } catch {}
}

async function loadHomeVendorMedia() {
  const section = $('homeVendorMediaSection');
  const target = $('homeVendorMediaList');
  if (!section || !target) return;
  try {
    const res = await api('/api/vendor-media');
    const rows = res.data || [];
    if (!rows.length) { section.classList.add('hidden'); return; }
    target.innerHTML = rows.map((row) => `<a class="home-vendor-media-card" href="${esc(row.media_url)}" target="_blank" rel="noopener noreferrer"><div class="home-vendor-media-cover"><span class="home-vendor-media-play">${ic('play', 16)}</span><span class="home-vendor-media-kind ${row.media_type === 'live' ? 'is-live' : ''}">${row.media_type === 'live' ? 'LIVE' : 'VIDEO'}</span></div><div class="home-vendor-media-store"><span>${esc(String(row.store_name || 'ហ').slice(0, 1))}</span><span>${esc(row.store_name)}</span></div></a>`).join('');
    section.classList.remove('hidden');
  } catch { section.classList.add('hidden'); }
}

async function syncVendorPresence() {
  const nextId = state.session && !document.hidden && state.me?.vendor?.status === 'approved' ? String(state.me.vendor.id || '') : '';
  if (nextId) {
    try { await fetch('/api/vendor/presence?tab_id=' + encodeURIComponent(state.vendorPresenceTabId), { method: 'POST', headers: { Authorization: 'Bearer ' + state.session.access_token } }); } catch {}
  }
}

/* --------------------------------------------------------------------------
   14. Event Bindings & Bootstrapping
   -------------------------------------------------------------------------- */
function initIcons() {
  $('logoIcon').innerHTML = ic('bag', 20);
  $('searchIcon').innerHTML = ic('search', 17);
  $('searchBtn').innerHTML = ic('search', 16);
  $('postIcon').innerHTML = ic('plus', 16);
  $('mobilePostBtn').innerHTML = ic('plus', 18);
  $('bellIcon').innerHTML = ic('bell', 18);
  $('chevronIcon').innerHTML = ic('chev', 13);
  $('menuUserIcon').innerHTML = ic('user', 15);
  $('menuStoreIcon').innerHTML = ic('store', 15);
  $('menuAdminIcon').innerHTML = ic('shield', 15);
  $('menuSaveIcon').innerHTML = ic('bookmark', 15);
  $('menuLoginIcon').innerHTML = ic('logout', 15);
  $('heroShield').innerHTML = ic('shield', 15);
  $('heroUsers').innerHTML = ic('users', 15);
  $('catAll').innerHTML = ic('grid', 22);
  $('catPhone').innerHTML = ic('phone', 22);
  $('catCar').innerHTML = ic('car', 22);
  $('catHome').innerHTML = ic('home', 22);
  $('catFashion').innerHTML = ic('shirt', 22);
  $('catFurniture').innerHTML = ic('sofa', 22);
  $('emptyIcon').innerHTML = ic('search', 24);
  $('coverCam').innerHTML = ic('camera', 14);
  $('avatarCam').insertAdjacentHTML('afterbegin', ic('camera', 13));
  $('sellerGateIcon').innerHTML = ic('shield', 22);
  $('kpiListingsIcon').innerHTML = ic('grid', 17);
  $('kpiViewsIcon').innerHTML = ic('eye', 17);
  $('kpiRatingIcon').innerHTML = ic('star', 17);
  $('kpiSalesIcon').innerHTML = ic('wallet', 17);
  $('addProductIcon').innerHTML = ic('plus', 15);
  $('sellerDocThumb').innerHTML = ic('file', 22);
  $('year').textContent = new Date().getFullYear();

  document.querySelectorAll('[data-seller-icon]').forEach((node) => { node.innerHTML = ic(node.dataset.sellerIcon, 16); });
  document.querySelectorAll('[data-nav-icon]').forEach((node) => { node.innerHTML = ic(node.dataset.navIcon, node.dataset.navIcon === 'chat' ? 22 : 19); });
  document.querySelectorAll('.close-btn').forEach((b) => { b.innerHTML = ic('x', 16); });
}

function bindEvents() {
  // Search & Category Filters
  $('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    state.searchTerm = $('searchInput').value.trim();
    state.activeCategory = $('searchCategory').value;
    void loadProducts();
  });
  $('searchInput').addEventListener('input', (e) => {
    state.searchTerm = e.target.value.trim();
    clearTimeout(window.searchWait);
    window.searchWait = setTimeout(() => void loadProducts(), 350);
  });
  $('searchCategory').addEventListener('change', (e) => setCategory(e.target.value));
  document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-category]');
  if (b) setCategory(b.dataset.category);
});
  document.querySelectorAll('[data-tag]').forEach((b) => b.addEventListener('click', () => {
    state.searchTerm = b.dataset.tag;
    $('searchInput').value = state.searchTerm;
    void loadProducts();
  }));
  $('clearFilters').addEventListener('click', () => {
    state.searchTerm = '';
    state.activeCondition = 'all';
    document.querySelector('[data-condition-filter][value="all"]')?.click();
    $('searchInput').value = '';
    setCategory('all');
  });

  // Product Grid Delegation
  document.querySelectorAll('[data-condition-filter]').forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) return;
      state.activeCondition = input.value || 'all';
      renderProducts();
    });
  });
  $('productGrid').addEventListener('click', (e) => {
    const heart = e.target.closest('[data-action="save"]');
    if (heart) { e.preventDefault(); e.stopPropagation(); saveAction(heart.dataset.id, heart); return; }
    const store = e.target.closest('[data-action="store"]');
    if (store) { e.preventDefault(); e.stopPropagation(); void openStorefront(store.dataset.vendorId); return; }
    const view = e.target.closest('[data-action="view"]');
    if (view) void openProduct(view.dataset.id);
  });

  // Keep the visible view in sync with browser Back / Forward navigation.
  window.addEventListener('hashchange', () => {
    const routeParts = String(window.location.hash || '#home')
      .replace(/^#/, '')
      .split('/')
      .filter(Boolean);
    const routeName = routeParts[0] || 'home';
    let routeId = '';
    try { routeId = routeParts[1] ? decodeURIComponent(routeParts[1]) : ''; } catch {}

    const activeView = document.querySelector('.view.active')?.id?.replace(/^view-/, '') || '';
    if (routeName === 'product' && routeId) {
      if (activeView === 'product' && String(state.currentProduct?.id || '') === routeId) return;
      const navigationId = ++state.routeSyncNavigationId;
      void openProduct(routeId, { preserveScroll: true, routeSyncNavigationId: navigationId });
      return;
    }
    if (routeName === 'store' && routeId) {
      if (activeView === 'store' && String(state.currentStoreId || '') === routeId) return;
      const navigationId = ++state.routeSyncNavigationId;
      void openStorefront(routeId, { preserveScroll: true, routeSyncNavigationId: navigationId });
      return;
    }

    const allowedRoutes = ['home', 'profile', 'seller', 'admin'];
    const nextView = allowedRoutes.includes(routeName) ? routeName : 'home';
    if (activeView === nextView) return;
    ++state.routeSyncNavigationId;
    void showView(nextView, { fromHistory: true, preserveScroll: true });
  });

  // Header & Navigation
  $('postAdBtn').addEventListener('click', () => { if (requireLogin()) isSellerAccount() ? renderProductForm() : openSellerModal(); });
  $('mobilePostBtn').addEventListener('click', () => $('postAdBtn').click());
  $('mobileMarketPost')?.addEventListener('click', () => $('postAdBtn').click());
  $('heroPostBtn').addEventListener('click', () => $('postAdBtn').click());
  $('notificationBtn').addEventListener('click', (e) => { e.stopPropagation(); toggleDrop('notificationMenu'); });
  $('profileMenuBtn').addEventListener('click', (e) => { e.stopPropagation(); toggleDrop('profileMenu'); });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#profileMenu,#profileMenuBtn,#notificationMenu,#notificationBtn')) closeDropdowns();
  });

  document.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => showView(b.dataset.view)));
  document.querySelectorAll('[data-action]').forEach((b) => b.addEventListener('click', () => {
    const a = b.dataset.action;
    if (a === 'profile') showView('profile');
    if (a === 'seller-dashboard') showView('seller');
    if (a === 'admin') showView('admin');
    if (a === 'saved') { showView('profile'); state.profileTab = 'saved'; void renderProfileTab(); }
    if (a === 'open-chat') void openSellerChatInbox();
    if (a === 'login') openAuth();
    if (a === 'logout') void (async () => {
      await state.supabase.auth.signOut();
      state.session = null;
      state.me = null;
      state.savedIds.clear();
      syncHeader();
      showView('home');
      toast('បានចាកចេញពីគណនីរួចរាល់។');
    })();
  }));

  // Auth Form
  document.querySelectorAll('[data-auth-mode]').forEach((b) => b.addEventListener('click', () => setAuthMode(b.dataset.authMode)));
  $('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const identity = $('authIdentity').value.trim();
    const password = $('authPassword').value;
    const isEmail = identity.includes('@');
    $('authSubmit').disabled = true;
    try {
      if (!state.supabase) {
        throw new Error('ប្រព័ន្ធ Login មិនទាន់ភ្ជាប់ Supabase ទេ។ សូមទាក់ទង Admin។');
      }

      const isRegister = state.authMode === 'register';
      const res = isRegister
        ? await state.supabase.auth.signUp(isEmail
            ? { email: identity, password, options: { data: { display_name: $('authName').value.trim() } } }
            : { phone: identity, password })
        : await state.supabase.auth.signInWithPassword(isEmail
            ? { email: identity, password }
            : { phone: identity, password });

      if (res.error) throw res.error;

      state.session = res.data.session || null;
      const authRevision = ++state.authRevision;
      if (!state.session) {
        if (isRegister) {
          toast('បានបង្កើតគណនី។ សូមពិនិត្យ Email ឬ SMS ដើម្បីផ្ទៀងផ្ទាត់ មុនចូលប្រើ។');
          return;
        }
        throw new Error('ការផ្ទៀងផ្ទាត់មិនបានបង្កើត Session ទេ។ សូមពិនិត្យគណនី ឬការកំណត់ Supabase។');
      }

      let profileLoaded = true;
      try {
        await loadIdentity(state.session, authRevision);
      } catch (profileError) {
        // Authentication already succeeded; keep the valid session and let profile data retry later.
        profileLoaded = false;
        console.warn('Login succeeded but profile loading failed:', profileError.message);
        state.me = {
          user: {
            id: state.session.user?.id,
            email: state.session.user?.email || null,
            phone: state.session.user?.phone || null
          },
          profile: {
            display_name: state.session.user?.user_metadata?.display_name
              || state.session.user?.email?.split('@')[0]
              || 'គណនីអ្នកប្រើប្រាស់'
          },
          vendor: null,
          isAdmin: false
        };
      }

      syncHeader();
      closeModal('authModal');
      if (profileLoaded) toast('បានចូលគណនីជោគជ័យ!');
      else toast('បានចូលគណនី ប៉ុន្តែព័ត៌មាន Profile មិនទាន់អាចទាញបានទេ។', 'warning');
      void syncVendorPresence();
    } catch (err) {
      toast(err.message || 'មិនអាចចូលគណនីបានទេ។', 'error');
    } finally {
      $('authSubmit').disabled = false;
    }
  });

  // Seller Dashboard & Forms
  $('addProductBtn').addEventListener('click', () => renderProductForm());
  $('sellerGateApply').addEventListener('click', openSellerModal);
  $('sellerVerifyNow').addEventListener('click', openSellerModal);
  $('productShortDesc')?.addEventListener('input', updateShortDescriptionCounter);

  $('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('editProductId').value;
    const files = Array.from($('productImage').files || []);
    const existingProduct = id
      ? state.sellerProductCache.find((product) => String(product.id) === String(id))
      : null;
    const existingImageCount = existingProduct?.product_images?.length || 0;

    if (existingImageCount + files.length > 5) {
      toast(`អាចបញ្ចូលរូបភាពបានអតិបរមា ៥ រូបក្នុងទំនិញមួយ។ ទំនិញនេះមានរូបភាពរួចហើយ ${existingImageCount} រូប។`, 'error');
      return;
    }
    const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
    if (files.some((file) => !allowedImageTypes.has(file.type))) {
      toast('ប្រភេទរូបភាពមិនត្រឹមត្រូវទេ។ សូមប្រើ JPG, PNG ឬ WEBP ប៉ុណ្ណោះ។', 'error');
      return;
    }
    if (files.some((file) => file.size > 8 * 1024 * 1024)) {
      toast('រូបភាពនីមួយៗមិនអាចធំជាង ៨MB បានទេ។ សូមជ្រើសរើសរូបភាពតូចជាងនេះ។', 'error');
      return;
    }

    const shortDesc = $('productShortDesc').value.trim();
    const fullDesc = $('productDescription').value.trim();
    const payload = {
      title: $('productTitle').value.trim(),
      price: Number($('productPrice').value),
      category: $('productCategory').value,
      location: $('productLocation').value,
      condition: $('productCondition').value,
      short_description: shortDesc,
      description: shortDesc + PRODUCT_DESC_SEPARATOR + fullDesc,
      stock: 1
    };
    try {
      const r = id
        ? await api('/api/products/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify(payload) })
        : await api('/api/products', { method: 'POST', body: JSON.stringify(payload) });
      if (files.length) {
        const form = new FormData();
        files.forEach((f) => form.append('images', f));
        try {
          await api(`/api/products/${r.data.id}/images`, { method: 'POST', body: form });
        } catch (uploadError) {
          if (!id) {
            $('editProductId').value = r.data.id;
            $('productFormTitle').textContent = 'កែប្រែព័ត៌មានទំនិញ';
            toast(`ទំនិញត្រូវបានរក្សាទុកហើយ ប៉ុន្តែរូបភាព upload មិនបានទេ៖ ${uploadError.message || 'មិនស្គាល់មូលហេតុ'}។ សូមព្យាយាមម្តងទៀត។`, 'error');
            await Promise.allSettled([renderSeller(), loadProducts()]);
            return;
          }
          throw uploadError;
        }
      }
      closeModal('productFormModal');
      toast('បានរក្សាទុកទំនិញជោគជ័យ!');
      await Promise.all([renderSeller(), loadProducts()]);
    } catch (err) { toast(err.message, 'error'); }
  });

  $('sellerDashboardContent').addEventListener('click', async (e) => {
    const tab = e.target.closest('[data-seller-tab]');
    if (tab) {
      state.sellerActiveTab = tab.dataset.sellerTab;
      document.querySelectorAll('[data-seller-tab]').forEach((b) => b.classList.toggle('is-active', b === tab));
      document.querySelectorAll('[data-seller-panel]').forEach((p) => { p.hidden = p.dataset.sellerPanel !== state.sellerActiveTab; });
      return;
    }
    const actionBtn = e.target.closest('[data-seller-action]');
    if (actionBtn) {
      const id = actionBtn.dataset.id;
      if (actionBtn.dataset.sellerAction === 'edit') {
        const prod = state.sellerProductCache.find((x) => String(x.id) === String(id));
        if (prod) renderProductForm(prod);
      } else if (actionBtn.dataset.sellerAction === 'delete' && confirm('លុបទំនិញនេះមែនទេ?')) {
        await api('/api/products/' + id, { method: 'DELETE' });
        toast('បានលុបទំនិញរួចរាល់។');
        await Promise.all([renderSeller(), loadProducts()]);
      }
    }
  });

  // Unified Chat Events
  $('supportChatLauncher').addEventListener('click', toggleSellerChatPanel);
  $('sellerChatClose').addEventListener('click', minimizeSellerChatPanel);
  $('sellerChatInboxRefresh').addEventListener('click', () => void loadUnifiedSellerChatInbox());
  $('sellerChatInboxList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-unified-chat]');
    if (btn) void openSellerChat(btn.dataset.unifiedChat);
  });
  $('sellerChatBack').addEventListener('click', () => {
    $('sellerChatInboxPane').classList.remove('mobile-hidden');
    $('sellerChatThread').classList.remove('mobile-active');
    state.chatConversationId = null;
    state.chatDraftProduct = null;
    renderSellerChatDraftProduct();
  });
  $('sellerChatProductBanner')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-dismiss-draft-product]')) {
      dismissSellerChatDraftProduct();
      syncSellerChatComposer();
    }
  });
  $('sellerChatInput').addEventListener('input', syncSellerChatComposer);
  $('sellerChatInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('sellerChatForm').requestSubmit(); }
  });
  $('sellerChatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = $('sellerChatInput');
    const body = input.value.trim();
    if ((!body && !state.chatDraftProduct) || !state.chatConversationId) return;

    const draft = state.chatDraftProduct;
    try {
      if (draft) {
        await api(`/api/seller-chat/conversations/${encodeURIComponent(state.chatConversationId)}/messages`, {
          method: 'POST',
          body: JSON.stringify({ product_id: draft.id, message_type: 'product', body: draft.title || '' })
        }).catch(() => null);
        state.chatDraftProduct = null;
        renderSellerChatDraftProduct();
      }
      if (body) {
        await api(`/api/seller-chat/conversations/${encodeURIComponent(state.chatConversationId)}/messages`, {
          method: 'POST',
          body: JSON.stringify({ body })
        });
      }
      input.value = '';
      syncSellerChatComposer();
      await loadSellerChatConversation(true);
      await loadUnifiedSellerChatInbox();
    } catch (err) { toast(err.message, 'error'); }
  });

  // Modals & Lightbox Close
  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => closeModal(b.dataset.close)));
  document.querySelectorAll('.modal').forEach((m) => m.addEventListener('mousedown', (e) => { if (e.target === m) closeModal(m.id); }));
  $('productLightboxClose')?.addEventListener('click', closeProductLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach((m) => closeModal(m.id));
      closeDropdowns();
      if (state.productLightboxOpen) closeProductLightbox();
    }
  });

  // Home sidebar navigation
  document.querySelectorAll('[data-home-side]').forEach((button) => button.addEventListener('click', () => {
    const action = button.dataset.homeSide;
    if (action === 'home') { state.searchTerm = ''; if ($('searchInput')) $('searchInput').value = ''; setCategory('all'); void showView('home'); }
    else if (action === 'live') void showView('home').then(() => $('homeVendorMediaSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    else if (action === 'saved' || action === 'orders') { if (!requireLogin()) return; state.profileTab = action === 'saved' ? 'saved' : 'history'; void showView('profile').then(() => renderProfileTab()); }
  }));
  const moveProductGallery = (direction) => { const images = (state.currentProduct?.product_images || []).filter((item) => item?.image_url); if (!images.length) return; state.productGalleryIndex = (state.productGalleryIndex + direction + images.length) % images.length; updateProductLightbox(); };
  $('productLightboxPrev')?.addEventListener('click', () => moveProductGallery(-1));
  $('productLightboxNext')?.addEventListener('click', () => moveProductGallery(1));

  $('offerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); if (!requireLogin()) return;
    const product = state.currentOfferProduct || state.currentProduct;
    if (!product?.id) { toast('មិនអាចកំណត់ទំនិញសម្រាប់សំណើតម្លៃបានទេ។', 'error'); return; }
    try { await api('/api/offers', { method: 'POST', body: JSON.stringify({ product_id: product.id, offer_price: Number($('offerAmount')?.value || 0), message: $('offerMessage')?.value?.trim() || '' }) }); closeModal('offerModal'); $('offerForm').reset(); toast('បានផ្ញើសំណើតម្លៃជោគជ័យ!'); }
    catch (err) { toast(err.message || 'មិនអាចផ្ញើសំណើតម្លៃបានទេ។', 'error'); }
  });

  $('sellerDocument')?.addEventListener('change', () => {
    const file = $('sellerDocument').files?.[0], preview = $('sellerDocPreview');
    if (!preview) return; preview.innerHTML = '';
    if (!file) { preview.classList.add('hidden'); return; }
    if (!file.type.startsWith('image/')) { toast('សូមជ្រើសរើសឯកសាររូបភាព។', 'error'); return; }
    const img = document.createElement('img'); img.src = URL.createObjectURL(file); img.alt = 'Document preview'; img.className = 'max-h-48 w-full object-contain'; preview.appendChild(img); preview.classList.remove('hidden');
  });
  $('sellerApplyForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); if (!requireLogin()) return;
    const form = new FormData(); form.append('store_name', $('shopName')?.value.trim() || ''); form.append('contact_phone', $('shopContact')?.value.trim() || ''); form.append('address', $('shopAddress')?.value.trim() || '');
    const file = $('sellerDocument')?.files?.[0]; if (file) form.append('document', file);
    try { await api('/api/vendors/register', { method: 'POST', body: form }); closeModal('sellerModal'); $('sellerApplyForm').reset(); await refreshSession(); toast('បានដាក់ពាក្យស្នើសុំអ្នកលក់ជោគជ័យ!'); await showView('seller'); }
    catch (err) { toast(err.message || 'មិនអាចដាក់ពាក្យបានទេ។', 'error'); }
  });

  const selectProfileTab = (tab) => { if (!['saved', 'history', 'seller'].includes(tab) || !requireLogin()) return; state.profileTab = tab; document.querySelectorAll('[data-profile-tab]').forEach((b) => { const active = b.dataset.profileTab === tab; b.classList.toggle('is-active', active); b.classList.toggle('active', active); }); void renderProfileTab(); };
  document.querySelectorAll('[data-profile-tab]').forEach((b) => b.addEventListener('click', () => selectProfileTab(b.dataset.profileTab)));
  document.querySelectorAll('[data-profile-jump]').forEach((b) => b.addEventListener('click', () => selectProfileTab(b.dataset.profileJump)));
  $('profileApplyTop')?.addEventListener('click', () => state.me?.vendor ? showView('seller') : openSellerModal());
  $('profileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); if (!requireLogin()) return;
    try { await api('/api/me/profile', { method: 'PATCH', body: JSON.stringify({ display_name: $('profileName')?.value.trim() || '', phone: $('profilePhone')?.value.trim() || '', province: $('profileLocation')?.value || '', bio: $('profileBio')?.value.trim() || '' }) }); await refreshSession(); toast('បានរក្សាទុកព័ត៌មាន Profile ជោគជ័យ!'); await renderProfileTab(); }
    catch (err) { toast(err.message || 'មិនអាចរក្សាទុក Profile បានទេ។', 'error'); }
  });
  const uploadProfileImage = async (inputId, type) => {
    const file = $(inputId)?.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === 'avatar') {
      setAvatar($('profileAvatar'), previewUrl, profileName());
    } else {
      setProfileCover($('view-profile')?.querySelector('.cover'), previewUrl);
    }

    const form = new FormData();
    form.append('file', file);
    form.append('type', type);
    try {
      const uploadResult = await api('/api/me/media', { method: 'POST', body: form });
      await refreshSession();

      const savedUrl = uploadResult?.data?.[type === 'avatar' ? 'avatar_url' : 'cover_url']
        || state.me?.profile?.[type === 'avatar' ? 'avatar_url' : 'cover_url'];
      if (savedUrl) {
        if (type === 'avatar') setAvatar($('profileAvatar'), savedUrl, profileName());
        else setProfileCover($('view-profile')?.querySelector('.cover'), savedUrl);
      }

      await renderProfileTab();
      toast('បានប្ដូររូបភាព Profile ជោគជ័យ!');
    } catch (err) {
      toast(err.message || 'មិនអាច Upload រូបភាពបានទេ។', 'error');
      setProfileCover($('view-profile')?.querySelector('.cover'), state.me?.profile?.cover_url || '');
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };
  $('avatarUpload')?.addEventListener('change', () => void uploadProfileImage('avatarUpload', 'avatar'));
  $('coverUpload')?.addEventListener('change', () => void uploadProfileImage('coverUpload', 'cover'));
  $('profileTabContent')?.addEventListener('click', (e) => { const open = e.target.closest('[data-open-product]'); if (open) { void openProduct(open.dataset.openProduct); return; } const remove = e.target.closest('[data-remove-saved]'); if (remove) saveAction(remove.dataset.removeSaved, remove); });

  $('connectTelegramBtn')?.addEventListener('click', async () => { try { const res = await api('/api/me/telegram/connect', { method: 'POST', body: JSON.stringify({}) }); const url = res.data?.url || res.data?.link || res.data?.telegram_url; if (url && $('telegramConnectLink')) { $('telegramConnectLink').href = url; $('telegramConnectLink').classList.remove('hidden'); } $('refreshTelegramStatusBtn')?.classList.remove('hidden'); toast('បានបង្កើតតំណភ្ជាប់ Telegram។'); } catch (err) { toast(err.message || 'មិនអាចភ្ជាប់ Telegram បានទេ។', 'error'); } });
  $('refreshTelegramStatusBtn')?.addEventListener('click', () => void renderTelegramSecurity());
  $('sendTelegramOtpBtn')?.addEventListener('click', async () => { try { await api('/api/me/telegram/otp', { method: 'POST', body: JSON.stringify({}) }); toast('បានផ្ញើ OTP តាម Telegram។'); } catch (err) { toast(err.message || 'មិនអាចផ្ញើ OTP បានទេ។', 'error'); } });
  $('telegramPasswordForm')?.addEventListener('submit', async (e) => { e.preventDefault(); try { await api('/api/me/telegram/password', { method: 'POST', body: JSON.stringify({ otp: $('telegramPasswordOtp')?.value.trim() || '', new_password: $('telegramNewPassword')?.value || '' }) }); $('telegramPasswordForm').reset(); toast('បានប្ដូរ Password ជោគជ័យ!'); } catch (err) { toast(err.message || 'មិនអាចប្ដូរ Password បានទេ។', 'error'); } });
  $('forgotPasswordBtn')?.addEventListener('click', () => { $('authForm')?.classList.add('hidden'); $('telegramRecoveryForm')?.classList.remove('hidden'); $('forgotPasswordBtn')?.classList.add('hidden'); });
  $('backToLoginBtn')?.addEventListener('click', () => { $('telegramRecoveryForm')?.classList.add('hidden'); $('authForm')?.classList.remove('hidden'); $('forgotPasswordBtn')?.classList.remove('hidden'); });
  $('requestRecoveryOtpBtn')?.addEventListener('click', async () => { try { await api('/api/auth/telegram-recovery/otp', { method: 'POST', body: JSON.stringify({ email: $('recoveryEmail')?.value.trim() || '' }) }); toast('បានស្នើសុំ OTP សង្គ្រោះតាម Telegram។'); } catch (err) { toast(err.message || 'មិនអាចស្នើសុំ OTP បានទេ។', 'error'); } });
  $('telegramRecoveryForm')?.addEventListener('submit', async (e) => { e.preventDefault(); try { await api('/api/auth/telegram-recovery/reset', { method: 'POST', body: JSON.stringify({ email: $('recoveryEmail')?.value.trim() || '', otp: $('recoveryOtp')?.value.trim() || '', new_password: $('recoveryNewPassword')?.value || '' }) }); $('telegramRecoveryForm').reset(); $('backToLoginBtn')?.click(); toast('បានសង្គ្រោះ Password ជោគជ័យ។ សូមចូលគណនីម្ដងទៀត។'); } catch (err) { toast(err.message || 'មិនអាចសង្គ្រោះ Password បានទេ។', 'error'); } });

  $('sellerProductSearch')?.addEventListener('input', () => renderSellerProductList());
  document.querySelectorAll('[data-seller-filter]').forEach((b) => b.addEventListener('click', () => { state.sellerActiveFilter = b.dataset.sellerFilter; document.querySelectorAll('[data-seller-filter]').forEach((x) => x.classList.toggle('is-active', x === b)); renderSellerProductList(); }));
  $('sellerOffers')?.addEventListener('click', async (e) => { const b = e.target.closest('[data-offer-action]'); if (!b) return; try { await api('/api/offers/' + encodeURIComponent(b.dataset.id), { method: 'PATCH', body: JSON.stringify({ status: b.dataset.offerAction }) }); await renderSeller(); toast('បានធ្វើបច្ចុប្បន្នភាពសំណើតម្លៃ។'); } catch (err) { toast(err.message || 'មិនអាចកែស្ថានភាពសំណើបានទេ។', 'error'); } });
  $('sellerOrders')?.addEventListener('click', async (e) => { const b = e.target.closest('[data-order-status]'); if (!b) return; try { await api('/api/vendor/orders/' + encodeURIComponent(b.dataset.orderId), { method: 'PATCH', body: JSON.stringify({ status: b.dataset.orderStatus }) }); await renderSeller(); toast('បានធ្វើបច្ចុប្បន្នភាពការបញ្ជាទិញ។'); } catch (err) { toast(err.message || 'មិនអាចកែស្ថានភាពការបញ្ជាទិញបានទេ។', 'error'); } });
  $('sellerShopProfileForm')?.addEventListener('submit', async (e) => { e.preventDefault(); const form = new FormData(); form.append('store_name', $('sellerShopName')?.value.trim() || ''); form.append('store_location', $('sellerShopLocation')?.value.trim() || ''); form.append('description', $('sellerShopDescription')?.value.trim() || ''); const logo = $('sellerShopLogo')?.files?.[0], cover = $('sellerShopCover')?.files?.[0]; if (logo) form.append('logo', logo); if (cover) form.append('cover', cover); try { await api('/api/vendor/profile', { method: 'PATCH', body: form }); await refreshSession(); await renderSeller(); toast('បានរក្សាទុកព័ត៌មានហាង។'); } catch (err) { toast(err.message || 'មិនអាចរក្សាទុកព័ត៌មានហាងបានទេ។', 'error'); } });
  $('sellerMediaForm')?.addEventListener('submit', async (e) => { e.preventDefault(); try { await api('/api/vendor/media', { method: 'POST', body: JSON.stringify({ media_type: $('sellerMediaType')?.value || 'video', media_url: $('sellerMediaUrl')?.value.trim() || '' }) }); await loadHomeVendorMedia(); if ($('sellerMediaStatus')) $('sellerMediaStatus').textContent = 'បានរក្សាទុក Link'; toast('បានរក្សាទុក Live / Video ជោគជ័យ!'); } catch (err) { toast(err.message || 'មិនអាចរក្សាទុកមាតិកាបានទេ។', 'error'); } });
  $('sellerMediaClose')?.addEventListener('click', async () => { try { await api('/api/vendor/media', { method: 'DELETE' }); await loadHomeVendorMedia(); if ($('sellerMediaStatus')) $('sellerMediaStatus').textContent = 'មិនទាន់មាន Link'; toast('បានបិទ Live និងលុប Link។'); } catch (err) { toast(err.message || 'មិនអាចលុប Link បានទេ។', 'error'); } });

  $('maintenanceAdminLogin')?.addEventListener('click', () => openAuth());
  $('saveMaintenanceSettings')?.addEventListener('click', async () => { try { const payload = { maintenanceMode: Boolean($('maintenanceToggle')?.checked), maintenanceMessage: $('maintenanceMessageInput')?.value || '' }; const res = await api('/api/admin/maintenance', { method: 'POST', body: JSON.stringify(payload) }); state.maintenanceMode = payload.maintenanceMode; state.maintenanceMessage = payload.maintenanceMessage; applyMaintenanceUI(); if ($('maintenanceStatusHint')) $('maintenanceStatusHint').textContent = state.maintenanceMode ? 'ស្ថានភាពបច្ចុប្បន្ន៖ Maintenance' : 'ស្ថានភាពបច្ចុប្បន្ន៖ កំពុងដំណើរការ'; toast(res.message || 'បានរក្សាទុក Maintenance Settings។'); } catch (err) { toast(err.message || 'មិនអាចរក្សាទុក Maintenance Settings បានទេ។', 'error'); } });
  $('saveBrandingBtn')?.addEventListener('click', async () => { const form = new FormData(); form.append('siteTitle', $('brandTitleInput')?.value || ''); form.append('siteSubtitle', $('brandSubtitleInput')?.value || ''); form.append('heroBadge', $('heroBadgeInput')?.value || ''); form.append('heroTitle', $('heroTitleInput')?.value || ''); form.append('heroSubtitle', $('heroSubtitleInput')?.value || ''); form.append('clearHeroImages', String(Boolean($('clearHeroImages')?.checked))); const logo = $('brandingLogoUpload')?.files?.[0], favicon = $('brandingFaviconUpload')?.files?.[0]; if (logo) form.append('logo', logo); if (favicon) form.append('favicon', favicon); Array.from($('brandingHeroUpload')?.files || []).slice(0, 3).forEach((f) => form.append('heroImages', f)); try { const res = await api('/api/admin/branding', { method: 'PATCH', body: form }); applySiteBranding(res.data || {}); if ($('brandingStatus')) $('brandingStatus').textContent = 'បានរក្សាទុក Brand និង Banner ជោគជ័យ'; toast('បានរក្សាទុក Brand ជោគជ័យ!'); } catch (err) { toast(err.message || 'មិនអាចរក្សាទុក Brand បានទេ។', 'error'); } });
  $('telegramDiagnosticsBtn')?.addEventListener('click', async () => { const target = $('telegramDiagnosticsResult'); try { const res = await api('/api/admin/telegram/diagnostics'); if (target) target.textContent = JSON.stringify(res.data ?? res, null, 2); } catch (err) { if (target) target.textContent = JSON.stringify({ error: err.message }, null, 2); } });
  $('adminApplications')?.addEventListener('click', async (e) => { const b = e.target.closest('[data-admin-review]'); if (!b) return; try { await api('/api/admin/vendors/' + encodeURIComponent(b.dataset.id), { method: 'PATCH', body: JSON.stringify({ status: b.dataset.adminReview }) }); await renderAdmin(); toast('បានធ្វើបច្ចុប្បន្នភាពពាក្យស្នើសុំ។'); } catch (err) { toast(err.message || 'មិនអាចពិនិត្យពាក្យស្នើសុំបានទេ។', 'error'); } });

  $('sellerChatChooseImage')?.addEventListener('click', () => $('sellerChatImageInput')?.click());
  $('sellerChatImageInput')?.addEventListener('change', async () => { const file = $('sellerChatImageInput').files?.[0]; if (!file || !state.chatConversationId) return; const form = new FormData(); form.append('image', file); try { await api('/api/seller-chat/conversations/' + encodeURIComponent(state.chatConversationId) + '/image', { method: 'POST', body: form }); $('sellerChatImageInput').value = ''; await loadSellerChatConversation(true); await loadUnifiedSellerChatInbox(); } catch (err) { toast(err.message || 'មិនអាចផ្ញើរូបភាពបានទេ។', 'error'); } });
  $('sellerChatMute')?.addEventListener('click', () => { state.chatMuted = !state.chatMuted; const b = $('sellerChatMute'); b.setAttribute('aria-pressed', String(state.chatMuted)); b.textContent = state.chatMuted ? 'បើកសំឡេង' : 'បិទសំឡេង'; b.title = state.chatMuted ? 'បើកសំឡេង' : 'បិទសំឡេង'; });

}

async function boot() {
  initIcons();
  bindEvents();

  const initialView = document.documentElement.dataset.initialView || 'home';
  const initialProductId = document.documentElement.dataset.initialProductId || '';
  const initialStoreId = document.documentElement.dataset.initialStoreId || '';

  void showView(initialView, { optimistic: true, deferLoad: true, preserveScroll: true });

  try {
    let cfg = {};
    try {
      const configResponse = await fetch('/api/config', { cache: 'no-store' });
      if (!configResponse.ok) throw new Error(`Config request failed (${configResponse.status})`);
      cfg = await configResponse.json();
      state.maintenanceMode = cfg.maintenanceMode === true;
      state.maintenanceMessage = String(cfg.maintenanceMessage || DEFAULT_MAINTENANCE_MSG);
      state.telegramBotUsername = String(cfg.telegramBotUsername || '').replace(/^@/, '').trim();
      applySiteBranding(cfg);
      mountTelegramLoginWidget();
    } catch (configError) {
      console.error('Could not load marketplace config:', configError);
      toast('មិនអាចទាញការកំណត់ប្រព័ន្ធបានទេ៖ ' + configError.message, 'warning');
    }

    if (cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase?.createClient) {
      state.supabase = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
      state.supabase.auth.onAuthStateChange((event, session) => {
        const revision = ++state.authRevision;
        const sessionSnapshot = session || null;
        state.session = sessionSnapshot;

        if (!sessionSnapshot) {
          state.me = null;
          syncHeader();
          return;
        }

        // Supabase invokes this for initial restore, account switches and token refresh.
        // Defer API work until the callback returns; discard stale account responses.
        Promise.resolve().then(async () => {
          if (revision !== state.authRevision) return;
          try {
            await loadIdentity(sessionSnapshot, revision);
          } catch (error) {
            if (revision === state.authRevision) {
              console.warn('Auth state changed but profile could not be loaded:', error.message);
            }
          }
          if (revision !== state.authRevision) return;
          syncHeader();
          void syncVendorPresence();
        });
      });
    } else {
      console.warn('Supabase public configuration is missing; account login is unavailable.');
    }

    await refreshSession();
    state.routeAccessReady = true;

    // Always load the public storefront even if session restoration or profile lookup fails.
    const tasks = [loadProducts()];
    if (initialView === 'product' && initialProductId) tasks.push(openProduct(initialProductId, { preserveScroll: true }));
    else if (initialView === 'store' && initialStoreId) tasks.push(openStorefront(initialStoreId, { preserveScroll: true }));
    else tasks.push(showView(initialView, { preserveScroll: true }));

    if (state.session) {
      tasks.push(Promise.all([loadSaved(), loadOrders(), loadUnifiedSellerChatInbox()]).catch((error) => {
        console.warn('Could not restore some account data:', error.message);
      }));
    }

    await Promise.allSettled(tasks);
    document.documentElement.classList.remove('route-restoring');
  } catch (err) {
    console.error('Boot error:', err);
    document.documentElement.classList.remove('route-restoring');
    applyMaintenanceUI();
    toast('មិនអាចភ្ជាប់ប្រព័ន្ធបានទេ៖ ' + err.message, 'error');
    // Last-resort public product load: do not leave the homepage empty after a session error.
    void loadProducts();
  }
}

void boot();
