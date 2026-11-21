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
  sliders: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
  maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3"/>',
  clipboard: '<path d="M9 4h6a2 2 0 0 1 2 2v1h3v14H4V7h3V6a2 2 0 0 1 2-2Z"/><path d="M9 4v3h6V4M8 12h8M8 16h8"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.6-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18m-11 0v2h4v-2"/>',
  arrowUpRight: '<path d="M7 17 17 7M7 7h10v10"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  wrench: '<path d="m14.7 6.3 3 3M4 20l6.5-6.5m-1.2-1.2 4.8-4.8a4 4 0 0 0 5.3-5.3l-2.2 2.2-2.8-.7-.7-2.8L16 0.7a4 4 0 0 0-5.3 5.3L5.9 10.8a2.8 2.8 0 0 0 0 4L9.2 18a2.8 2.8 0 0 0 4 0l1.1-1.1"/>',
  flag: '<path d="M4 21V5"/><path d="M4 5c5-4 8 4 16 0v10c-8 4-11-4-16 0"/>',
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
  jobs: [],
  jobsRequestId: 0,
  activeJobCategory: 'all',
  activeJobSubcategory: 'all',
  jobsSort: 'newest',
  socialPosts: [],
  socialStories: [],
  socialStoryPreviewUrl: null,
  socialStoryViewerIndex: 0,
  socialCommentsOpen: new Set(),
  socialCommentsCache: new Map(),
  socialUploadPreviewUrl: null,
  savedIds: new Set(),
  favoritePending: new Set(),
  activeCategory: 'all',
  activeListingType: 'all',
  activePropertyType: 'all',
  activeCondition: 'all',
  marketplaceSort: 'newest',
  searchTerm: '',
  currentProduct: null,
  currentVendor: null,
  currentVariantId: null,
  activeSpecFilters: {},
  activeSubcategory: 'all',
  activeDetailType: 'all',
  specPriceMin: '',
  specPriceMax: '',
  currentMarketplaceListing: null,
  productGalleryIndex: 0,
  productGalleryVideoActive: false,
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
  currentStoreSkeletonVisible: false,
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
  myPosts: [],
  myPostEditing: null,

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
  sitePresenceStarted: false,
  homeVendorMediaTimer: null,
  sitePresenceTimer: null,
  sitePresenceVisitorId: '',
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
  chatDraftProduct: null,
  chatConversation: null
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

const renderTelegramDiagnostics = (payload) => {
  const data = payload && typeof payload === 'object' ? payload : {};
  const readPath = (source, path) => path.split('.').reduce((value, key) => value && typeof value === 'object' ? value[key] : undefined, source);
  const findValue = (paths) => {
    for (const path of paths) {
      const value = readPath(data, path);
      if (value !== undefined && value !== null) return value;
    }
    return undefined;
  };
  const statusInfo = (value) => {
    if (typeof value === 'boolean') return { ok: value, text: value ? 'ភ្ជាប់រួចរាល់' : 'មិនទាន់ភ្ជាប់' };
    if (typeof value === 'string') {
      const normalized = value.toLowerCase();
      const ok = /^(ok|success|connected|active|ready|available|running|healthy|true)$/i.test(value) || /connected|ready|active|success|running|ដំណើរការ|រួចរាល់/.test(normalized);
      const failed = /^(error|failed|disconnected|inactive|false|unavailable)$/i.test(value) || /error|fail|disconnect|inactive|unavailable|មិនដំណើរការ|បរាជ័យ/.test(normalized);
      return { ok: failed ? false : ok ? true : null, text: value };
    }
    if (value && typeof value === 'object') {
      const flag = value.ok ?? value.success ?? value.connected ?? value.available ?? value.active ?? value.running;
      const detail = value.status ?? value.message ?? value.name ?? value.title;
      if (typeof flag === 'boolean') return { ok: flag, text: detail ? String(detail) : flag ? 'ភ្ជាប់រួចរាល់' : 'មិនទាន់ភ្ជាប់' };
      if (typeof detail === 'string') return statusInfo(detail);
    }
    return { ok: null, text: 'មិនមានព័ត៌មាន' };
  };
  const rows = [
    { label: 'Bot Status', value: findValue(['bot.status','botStatus','bot_status','bot_connected','botConnected','bot']) },
    { label: 'Channel', value: findValue(['channel.status','channelStatus','channel_status','channel_accessible','channelAccessible','channel']) },
    { label: 'សិទ្ធិផ្ញើរូបភាព', value: findValue(['photoUpload','photo_upload','canSendPhotos','can_send_photos','permissions.can_send_photos','permissions.photos']) }
  ];
  const availableRows = rows.map((row) => ({ ...row, status: statusInfo(row.value) }));
  const details = findValue(['message','detail','description']);
  return '<div class="admin-telegram-diagnostics-list">' +
    availableRows.map((row) => {
      const status = row.status;
      const icon = status.ok === true ? '✓' : status.ok === false ? '✕' : '•';
      const stateClass = status.ok === true ? 'is-success' : status.ok === false ? 'is-error' : 'is-neutral';
      return '<div class="admin-telegram-diagnostics-row ' + stateClass + '"><span class="admin-telegram-diagnostics-label">' + esc(row.label) + '</span><strong><span class="admin-telegram-diagnostics-icon" aria-hidden="true">' + icon + '</span>' + esc(status.text) + '</strong></div>';
    }).join('') +
    (details ? '<p class="admin-telegram-diagnostics-note">' + esc(details) + '</p>' : '') +
    '</div>';
};

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

function appDialog({ mode = 'confirm', title = 'បញ្ជាក់សកម្មភាព', message = '', placeholder = 'សរសេរមូលហេតុនៅទីនេះ...', confirmLabel, danger = false } = {}) {
  return new Promise(resolve => {
    const id = 'appDialogModal';
    const previous = $(id);
    if (previous) previous.remove();
    const wrap = document.createElement('div');
    wrap.id = id;
    wrap.className = 'modal app-dialog-modal';
    wrap.setAttribute('aria-hidden', 'true');
    const isPrompt = mode === 'prompt';
    const field = isPrompt
      ? `<label class="app-dialog-field"><span>មូលហេតុ</span><textarea id="appDialogInput" class="field" rows="4" maxlength="1200" placeholder="${esc(placeholder)}"></textarea></label>`
      : '';
    wrap.innerHTML = `<section class="modal-box app-dialog-box" role="dialog" aria-modal="true" aria-labelledby="appDialogTitle" aria-describedby="appDialogMessage">
      <div class="app-dialog-heading"><span class="app-dialog-icon">${ic(isPrompt ? 'flag' : 'alert', 19)}</span><div><h2 id="appDialogTitle">${esc(title)}</h2><p id="appDialogMessage">${esc(message)}</p></div></div>
      <form id="appDialogForm" class="app-dialog-form" novalidate>${field}
        <div class="app-dialog-actions">
          <button type="button" class="app-dialog-cancel" id="appDialogCancel">បោះបង់</button>
          <button type="submit" class="app-dialog-submit ${danger ? 'is-danger' : ''}">${esc(confirmLabel || (isPrompt ? 'ផ្ញើរបាយការណ៍' : 'យល់ព្រម'))}</button>
        </div>
      </form>
    </section>`;
    document.body.appendChild(wrap);
    let settled = false;
    const finish = value => {
      if (settled) return;
      settled = true;
      closeModal(id);
      wrap.remove();
      document.removeEventListener('keydown', onKeyDown);
      resolve(value);
    };
    const onKeyDown = event => {
      if (event.key === 'Escape') finish(isPrompt ? null : false);
    };
    $('appDialogCancel').addEventListener('click', () => finish(isPrompt ? null : false));
    $('appDialogForm').addEventListener('submit', event => {
      event.preventDefault();
      const value = isPrompt ? $('appDialogInput').value.trim() : true;
      if (isPrompt && value.length < 3) { $('appDialogInput').setAttribute('aria-invalid','true'); $('appDialogInput').focus(); return; }
      finish(value);
    });
    wrap.addEventListener('click', event => {
      if (event.target === wrap) finish(isPrompt ? null : false);
    });
    document.addEventListener('keydown', onKeyDown);
    openModal(id);
    if (isPrompt) $('appDialogInput')?.focus();
  });
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

async function apiUploadWithProgress(path, formData, onProgress, allowRefresh = true) {
  const send = () => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', path, true);
    if (state.session?.access_token) xhr.setRequestHeader('Authorization', 'Bearer ' + state.session.access_token);
    xhr.upload.addEventListener('progress', event => { if (event.lengthComputable && typeof onProgress === 'function') onProgress(Math.min(100, Math.round(event.loaded / event.total * 100))); });
    xhr.onload = () => { let payload = {}; try { payload = JSON.parse(xhr.responseText || '{}'); } catch {} resolve({ status: xhr.status, payload }); };
    xhr.onerror = () => reject(new Error('ការតភ្ជាប់ Upload ត្រូវបានផ្អាក។'));
    xhr.onabort = () => reject(new Error('ការបញ្ចូលរូបភាពត្រូវបានបោះបង់។'));
    xhr.send(formData);
  });
  let response = await send();
  if (response.status === 401 && allowRefresh && state.session?.refresh_token && state.supabase) {
    try { const { data, error } = await state.supabase.auth.refreshSession(); if (!error && data.session?.access_token) { state.session = data.session; response = await send(); } }
    catch (error) { console.warn('Upload session refresh failed:', error.message); }
  }
  if (response.status < 200 || response.status >= 300) throw new Error(response.payload.error || `Upload មិនជោគជ័យ (${response.status})`);
  return response.payload;
}

const isAdmin = () => Boolean(state.me?.isAdmin);
const isSellerAccount = () => Boolean(state.me?.vendor && state.me.vendor.status !== 'blocked');
const isVerifiedSeller = () => state.me?.vendor?.status === 'approved';
const isInternalAuthEmail = (email) => /@auth\.7inone\.invalid$/i.test(String(email || '').trim());
const profileName = () => state.me?.profile?.display_name || state.session?.user?.user_metadata?.display_name || (isInternalAuthEmail(state.session?.user?.email) ? '' : state.session?.user?.email?.split('@')[0]) || 'គណនីអ្នកប្រើប្រាស់';

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
              || (isInternalAuthEmail(sessionSnapshot.user?.email) ? '' : sessionSnapshot.user?.email?.split('@')[0])
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
    ? (state.currentProduct?.listing_type && ['job', 'real_estate'].includes(state.currentProduct.listing_type)
      ? 'product/' + encodeURIComponent(state.currentProduct.listing_type) + '/' + encodeURIComponent(state.currentProduct.id)
      : (state.currentProduct?.id ? 'product/' + encodeURIComponent(state.currentProduct.id) : (options.optimistic ? String(window.location.hash || '#product').replace(/^#/, '') : 'product')))
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

const DEFAULT_FAVICON_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232B74B8'/%3E%3Ctext x='32' y='47' font-family='Arial,sans-serif' font-size='44' font-weight='700' text-anchor='middle' fill='%23fff'%3E7%3C/text%3E%3C/svg%3E";

function applyFavicon(url) {
  let link = document.querySelector('link[data-site-favicon]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.dataset.siteFavicon = 'true';
    document.head.appendChild(link);
  }

  // Keep an immediate local fallback while the Admin-configured icon loads.
  if (!url) {
    link.type = 'image/svg+xml';
    link.href = DEFAULT_FAVICON_URL;
    return;
  }

  state.faviconUrl = url;
  link.onerror = () => {
    if (link.href !== DEFAULT_FAVICON_URL) {
      link.type = 'image/svg+xml';
      link.href = DEFAULT_FAVICON_URL;
    }
  };
  link.removeAttribute('type');
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
  const rail = $('homeJobsRail');
  const target = rail?.querySelector('[data-promo-slot="tall"]');
  if (!target) return;

  const item = state.siteBranding.sidePosters?.tall;
  if (!item?.url || item.enabled === false) {
    target.hidden = true;
    target.replaceChildren();
    return;
  }

  const content = `<img src="${esc(item.url)}" alt="${esc(item.alt || '7inOne promotion')}" loading="lazy" />`;
  target.innerHTML = item.link
    ? `<a href="${esc(item.link)}" target="_blank" rel="noopener noreferrer">${content}</a>`
    : content;
  target.hidden = false;
  target.querySelector('img')?.addEventListener('error', () => {
    target.hidden = true;
  }, { once: true });
}

/* --------------------------------------------------------------------------
   7. Marketplace & Product Cards
   -------------------------------------------------------------------------- */
function productImage(p) {
  return (p.product_images || []).slice().sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)).find((x) => x.image_url)?.image_url || '';
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

function normalizedProductSpecs(product = {}) {
  const specs = { ...(product.specifications && typeof product.specifications === 'object' ? product.specifications : {}) };
  const detailType = String(product.detail_type || product.listing_details?.detail_type || '');
  const legacyKeys = detailType === 'Laptop'
    ? { cpu_model:'spec_0', ram_type_capacity:'spec_1', gpu_model_vram:'spec_2', storage_type_capacity:'spec_3', screen_size:'spec_4', battery_health:'spec_5' }
    : detailType === 'Desktop PC'
      ? { cpu_model:'spec_0', ram_type_capacity:'spec_1', gpu_model_vram:'spec_2', storage_type_capacity:'spec_3' }
      : {};
  for (const [key, legacy] of Object.entries(legacyKeys)) if (specs[key] == null && specs[legacy] != null) specs[key] = specs[legacy];
  return specs;
}
function productCardSpecs(product = {}) {
  const specs = normalizedProductSpecs(product);
  const normalized = Object.fromEntries(Object.entries(specs).map(([key, value]) => [String(key).toLowerCase().replace(/[^a-z0-9]/g, ''), value]));
  const find = keys => {
    for (const key of keys) {
      const value = normalized[key.replace(/[^a-z0-9]/gi, '').toLowerCase()];
      if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
    }
    return '';
  };
  const values = [
    ['CPU', find(['cpu','processor','cpu_model','processor_model'])],
    ['RAM', find(['ram','memory','memory_ram','ram_type_capacity'])],
    ['Display', find(['display','display_size','screen','screen_size'])],
    ['GPU', find(['gpu','graphics','graphics_card','graphics_processor','gpu_model_vram'])]
  ];
  return values.every(([, value]) => value) ? values : [];
}
function specFilterValue(product, keys) {
  const specs = normalizedProductSpecs(product);
  const normalized = Object.fromEntries(Object.entries(specs).map(([key, value]) => [String(key).toLowerCase().replace(/[^a-z0-9]/g, ''), value]));
  for (const key of keys) {
    const value = normalized[key.replace(/[^a-z0-9]/gi, '').toLowerCase()];
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return '';
}
function renderCategorySpecFilters() {
  const root = $('specificationFilters');
  const group = $('specificationFilterGroup');
  if (!root || !group) return;
  const definitions = [
    ['brand','ម៉ាក',['brand','manufacturer']],['cpu','CPU',['cpu','processor','cpu_model','processor_model']],
    ['ram','RAM',['ram','memory','memory_ram','ram_type_capacity']],['storage','Storage',['storage','ssd','hard_drive','capacity','storage_type_capacity']],
    ['display','Display Size',['display','display_size','screen','screen_size']],['gpu','GPU',['gpu','graphics','graphics_card','graphics_processor','gpu_model_vram']],
    ['color','Color',['color','colour']],['resolution','Resolution',['resolution','display_resolution']],['os','Operating System',['operating_system','os']]
  ];
  const products = state.products.filter(item => item.listing_type === 'product');
  const subcategories = [...new Set(products.map(item => String(item.subcategory || '').trim()).filter(Boolean))].sort((a,b) => a.localeCompare(b));
  const subcategoryProducts = state.activeSubcategory === 'all' ? products : products.filter(item => String(item.subcategory || '') === state.activeSubcategory);
  const detailTypes = [...new Set(subcategoryProducts.map(item => String(item.detail_type || '').trim()).filter(Boolean))].sort((a,b) => a.localeCompare(b));
  const scopedProducts = state.activeDetailType === 'all' ? subcategoryProducts : subcategoryProducts.filter(item => String(item.detail_type || '') === state.activeDetailType);
  const sections = definitions.map(([key,label,aliases]) => {
    const values = [...new Set(scopedProducts.map(item => specFilterValue(item,aliases)).filter(Boolean))].sort((a,b) => a.localeCompare(b));
    if (!values.length) return '';
    const selected = new Set(state.activeSpecFilters[key] || []);
    return `<div class="spec-filter-field"><b>${label}</b><div>${values.map(value => `<label><input type="checkbox" data-spec-filter="${key}" value="${esc(value)}" ${selected.has(value) ? 'checked' : ''}><span>${esc(value)}</span></label>`).join('')}</div></div>`;
  }).join('');
  const hasPrice = scopedProducts.some(item => Number.isFinite(Number(item.display_price ?? item.price)) && Number(item.display_price ?? item.price) > 0);
  const subcategorySelect = subcategories.length ? '<div class="spec-filter-field"><b>ផ្នែករង / Subcategory</b><div><select data-subcategory-filter><option value="all">ទាំងអស់</option>' + subcategories.map(value => '<option value="' + esc(value) + '"' + (state.activeSubcategory === value ? ' selected' : '') + '>' + esc(value) + '</option>').join('') + '</select></div></div>' : '';
  const detailTypeSelect = detailTypes.length ? '<div class="spec-filter-field"><b>ប្រភេទលម្អិត / Detailed Type</b><div><select data-detail-type-filter><option value="all">ទាំងអស់</option>' + detailTypes.map(value => '<option value="' + esc(value) + '"' + (state.activeDetailType === value ? ' selected' : '') + '>' + esc(value) + '</option>').join('') + '</select></div></div>' : '';
  group.hidden = !sections && !hasPrice && !subcategorySelect && !detailTypeSelect;
  root.innerHTML = subcategorySelect + detailTypeSelect + (sections || '') + (hasPrice ? '<div class="spec-filter-field spec-price-filter"><b>Price Range ($)</b><div><input type="number" min="0" step="1" data-price-filter="min" placeholder="Min" value="' + esc(state.specPriceMin) + '"><input type="number" min="0" step="1" data-price-filter="max" placeholder="Max" value="' + esc(state.specPriceMax) + '"></div></div>' : '');
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

function displayProductCode(product = {}) {
  const savedCode=String(product.product_code||'').trim();
  if(savedCode)return savedCode;
  const compact=String(product.id||'').replace(/-/g,'').toUpperCase();
  return compact ? 'P-'+compact.slice(0,12) : 'P-UNKNOWN';
}
async function copyProductCode(button) {
  const code=String(button?.dataset.copyProductCode||'').trim();
  if(!code)return;
  try{
    if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(code);
    else{
      const field=document.createElement('textarea');field.value=code;field.style.position='fixed';field.style.opacity='0';document.body.appendChild(field);field.select();
      const copied=document.execCommand('copy');field.remove();if(!copied)throw new Error('Copy unavailable');
    }
    const original=button.innerHTML;button.innerHTML=ic('check',12)+' បានចម្លង';button.classList.add('is-copied');
    setTimeout(()=>{button.innerHTML=original;button.classList.remove('is-copied')},1300);
  }catch{toast('មិនអាចចម្លង Product ID បានទេ។','error')}
}

// Handle marketplace card image states without inline HTML event attributes.
document.addEventListener('load', (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.matches('.cd-main, .cd-secondary')) return;
  image.parentElement?.classList.add('is-loaded');
}, true);

document.addEventListener('error', (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.matches('.cd-main, .cd-secondary')) return;
  if (image.dataset.retryAttempted !== '1') {
    image.dataset.retryAttempted = '1';
    setTimeout(() => {
      if (!image.isConnected) return;
      image.src = image.src + (image.src.includes('?') ? '&r=1' : '?r=1');
    }, 1500);
    return;
  }
  image.parentElement?.classList.add('is-failed', 'image-failed');
  image.style.display = 'none';
}, true);

function productCard(p, index) {
  const images = (p.product_images || []).filter((item) => item.image_url).sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
  const image = images[0]?.image_url || '';
  const secondImage = images[1]?.image_url || '';
  const saved = state.savedIds.has(p.id);
  const vendorName = p.vendors?.store_name || 'ហាងអ្នកលក់';
  const vendorLogo = p.vendors?.store_logo_url || '';
  const verified = p.vendors?.status === 'approved';
  const description = productDescriptionParts(p).short;
  const cardSpecs = productCardSpecs(p);
  const cardPrice = p.display_price ?? p.price;

  const location = p.location || 'ភ្នំពេញ';
  return `
  <article class="cd" style="animation-delay:${Math.min(index, 12) * 30}ms">
    <div class="ph im">
      <button class="absolute inset-0 z-[1] h-full w-full" type="button" data-action="view" data-id="${esc(p.id)}" aria-label="មើល ${esc(p.title)}"></button>
      ${image
        ? `<span class="img-scan-wrap shimmer-scan cd-image-wrap cd-main-wrap"><img src="${esc(image)}" alt="${esc(p.title)}" loading="lazy" decoding="async" class="cd-main"></span>${secondImage ? `<span class="img-scan-wrap shimmer-scan cd-image-wrap cd-secondary-wrap"><img src="${esc(secondImage)}" alt="" loading="lazy" decoding="async" class="cd-secondary"></span>` : ''}`
        : ic('image', 36)}
      <button class="hv heart ${saved ? 'saved' : ''}" type="button" data-action="save" data-id="${esc(p.id)}" aria-label="រក្សាទុក" aria-pressed="${saved ? 'true' : 'false'}">
        ${ic('bookmark', 17)}
      </button>
    </div>
    <div class="cb">
      <h3 class="cursor-pointer hover:text-emerald-800" data-action="view" data-id="${esc(p.id)}">${esc(p.title)}</h3>
      <p class="pr"><span>${money(cardPrice)}</span></p>
      ${cardSpecs.length ? `<div class="cd-key-specs">${cardSpecs.map(([label,value]) => `<span><b>${label}:</b> ${esc(value)}</span>`).join('')}</div>` : (description ? `<p class="cd-description">${esc(description)}</p>` : '')}
      <div class="sh">
        <span class="sp" role="img" aria-label="រូប Logo ហាង">
          <span class="sp-fallback">${ic('user', 15)}</span>
          ${vendorLogo ? `<img src="${esc(vendorLogo)}" alt="${esc(vendorName)}" loading="lazy" decoding="async">` : ''}
        </span>
        <button type="button" class="sn text-left hover:underline" data-action="store" data-vendor-id="${esc(p.vendor_id)}">${esc(vendorName)}</button>
        ${verified ? verifiedStoreBadge(p.vendor_id) : ''}
      </div>
      <p class="mt">
        <span class="cd-time-meta">${timeAgoKm(p.created_at)}</span>
        <span class="cd-location-meta">${ic('pin', 11)}<span>${esc(location)}</span></span>
        <span class="vw" title="ចំនួនអ្នកមើល">${ic('eye', 13)}${formatViews(p.view_count)}</span>
      </p>
    </div>
  </article>`;
}


// --------------------------------------------------------------------------
// 7.1 Community photo feed
// --------------------------------------------------------------------------
function socialProfileMarkup(profile = {}) {
  const name = profile.display_name || 'អ្នកប្រើប្រាស់';
  const avatar = profile.avatar_url || '';
  return `<span class="social-avatar">${avatar ? `<img src="${esc(avatar)}" alt="">` : esc(Array.from(name)[0] || '7')}</span>`;
}
function syncSocialComposerIdentity() {
  const profile = state.me?.profile || state.me || {};
  const name = profile.display_name || state.me?.user?.user_metadata?.display_name || state.me?.email?.split('@')[0] || 'អ្នកប្រើប្រាស់';
  const avatar = profile.avatar_url || '';
  const target = $('socialComposerAvatar');
  if ($('socialComposerName')) $('socialComposerName').textContent = name;
  if (target) target.innerHTML = avatar ? `<img src="${esc(avatar)}" alt="">` : esc(Array.from(name)[0] || '7');
}
function renderSocialStories() {
  const target = $('socialStoriesList');
  if (!target) return;
  const createCard = '<label class="social-story-create" for="socialStoryImage"><span class="social-story-create-icon">＋</span><b>បង្កើត Story</b></label>';
  target.innerHTML = createCard + state.socialStories.map((story, index) => {
    const profile = story.profile || {};
    return `<button type="button" class="social-story-card" data-social-story-view="${index}" aria-label="មើល Story របស់ ${esc(profile.display_name || 'អ្នកប្រើប្រាស់')}">
      <img class="social-story-photo" src="${esc(story.image_url)}" alt="" loading="lazy">
      <span class="social-story-avatar">${socialProfileMarkup(profile)}</span>
      <b>${esc(profile.display_name || 'អ្នកប្រើប្រាស់')}</b>
    </button>`;
  }).join('');
}
function renderSocialStoriesSkeleton() {
  const target = $('socialStoriesList');
  if (!target) return;
  const bar = (width, height, extra = '') => `<span class="skeleton social-sk-bar ${extra}" style="width:${width};height:${height}px" aria-hidden="true"></span>`;
  target.innerHTML = '<label class="social-story-create" for="socialStoryImage"><span class="social-story-create-icon">＋</span><b>បង្កើត Story</b></label>' +
    Array.from({ length: 5 }, () => `<div class="social-story-card social-story-skeleton" aria-hidden="true"><span class="skeleton social-story-sk-photo"></span><span class="skeleton social-story-sk-avatar"></span>${bar('64%',7,'social-story-sk-name')}</div>`).join('');
}
async function loadSocialStories() {
  const target = $('socialStoriesList');
  if (!target) return;
  const cancelSkeleton = !state.socialStories.length ? scheduleSkeleton(renderSocialStoriesSkeleton) : () => {};
  try {
    const result = await api('/api/social/stories');
    cancelSkeleton();
    state.socialStories = Array.isArray(result.data) ? result.data : [];
    renderSocialStories();
  } catch (error) {
    cancelSkeleton();
    target.innerHTML = '<div class="social-feed-empty">មិនអាចផ្ទុក Stories បានទេ.</div><label class="social-story-create" for="socialStoryImage"><span class="social-story-create-icon">＋</span><b>បង្កើត Story</b></label>';
  }
}
function clearSocialStoryImage() {
  const input = $('socialStoryImage');
  if (input) input.value = '';
  if (state.socialStoryPreviewUrl) URL.revokeObjectURL(state.socialStoryPreviewUrl);
  state.socialStoryPreviewUrl = null;
  $('socialStoryPreview')?.classList.add('hidden');
  $('socialStoryPreviewImage')?.removeAttribute('src');
}
async function publishSocialStory() {
  if (!requireLogin()) return;
  const file = $('socialStoryImage')?.files?.[0];
  if (!file) { toast('សូមជ្រើសរើសរូបភាព Story។', 'error'); return; }
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) {
    toast('សូមប្រើរូប JPG, PNG ឬ WEBP ដែលមានទំហំមិនលើស 8MB។', 'error'); return;
  }
  const button = $('socialStoryPublishBtn');
  if (button) { button.disabled = true; button.textContent = 'កំពុងផុស...'; }
  const form = new FormData();
  form.append('image', file);
  try {
    await api('/api/social/stories', { method: 'POST', body: form });
    clearSocialStoryImage();
    await loadSocialStories();
    toast('បានផុស Story ជោគជ័យ! Story នឹងបាត់ក្រោយ 24 ម៉ោង។');
  } catch (error) { toast(error.message || 'មិនអាចផុស Story បានទេ។', 'error'); }
  finally { if (button) { button.disabled = false; button.textContent = 'ផុស Story'; } }
}
function showSocialStory(index) {
  if (!state.socialStories.length) return;
  state.socialStoryViewerIndex = (index + state.socialStories.length) % state.socialStories.length;
  const story = state.socialStories[state.socialStoryViewerIndex];
  const profile = story.profile || {};
  $('socialStoryViewerImage').src = story.image_url;
  $('socialStoryViewerAuthor').innerHTML = socialProfileMarkup(profile) + '<b>' + esc(profile.display_name || 'អ្នកប្រើប្រាស់') + '</b>';
  $('socialStoryViewerProgress').style.width = ((state.socialStoryViewerIndex + 1) / state.socialStories.length * 100) + '%';
  $('socialStoryViewer').classList.remove('hidden');
}
function closeSocialStoryViewer() {
  $('socialStoryViewer')?.classList.add('hidden');
  $('socialStoryViewerImage')?.removeAttribute('src');
}
function renderSocialPosts() {
  const target = $('socialFeedList');
  if (!target) return;
  if (!state.socialPosts.length) { target.innerHTML = '<div class="social-feed-empty">មិនទាន់មានការផុសទេ។ ចាប់ផ្ដើមចែករំលែកមុនគេ!</div>'; return; }
  target.innerHTML = state.socialPosts.map(post => {
    const author = post.profile || {};
    const liked = Boolean(post.liked_by_me);
    const comments = state.socialCommentsCache.get(post.id) || [];
    const opened = state.socialCommentsOpen.has(post.id);
    return `<article class="social-feed-card" data-social-post="${esc(post.id)}">
      <div class="social-post-author">${socialProfileMarkup(author)}<div style="min-width:0;flex:1"><b>${esc(author.display_name || 'អ្នកប្រើប្រាស់')}</b><small>${timeAgoKm(post.created_at)}</small></div></div>
      ${post.caption ? `<p class="social-post-caption">${esc(post.caption)}</p>` : ''}
      <img class="social-post-image" src="${esc(post.image_url)}" alt="រូបភាពដែលបានផុស" loading="lazy">
      <div class="social-post-actions">
        <button type="button" data-social-like="${esc(post.id)}" class="${liked ? 'is-liked' : ''}" aria-pressed="${liked}">♡ ${Number(post.like_count || 0)} Like</button>
        <button type="button" data-social-comments="${esc(post.id)}">💬 ${Number(post.comment_count || 0)} Comment</button>
      </div>
      ${opened ? `<div class="social-comment-panel"><div class="social-comment-list">${comments.map(comment => `<div class="social-comment"><b>${esc(comment.display_name || 'អ្នកប្រើប្រាស់')}</b>${esc(comment.body)}</div>`).join('') || '<small style="color:#8F98A0">មិនទាន់មានមតិយោបល់</small>'}</div><form class="social-comment-form" data-social-comment-form="${esc(post.id)}"><input name="comment" maxlength="500" placeholder="សរសេរមតិយោបល់..." required><button type="submit">ផ្ញើ</button></form></div>` : ''}
    </article>`;
  }).join('');
}
function renderSocialPostsSkeleton() {
  const target = $('socialFeedList');
  if (!target) return;
  const bar = (width, height) => `<span class="skeleton social-feed-sk-bar" style="width:${width};height:${height}px" aria-hidden="true"></span>`;
  target.innerHTML = Array.from({ length: 2 }, (_, index) => `
    <article class="social-feed-card social-feed-skeleton" aria-hidden="true">
      <div class="social-post-author"><span class="skeleton social-feed-sk-avatar"></span><div class="social-feed-sk-author-lines">${bar('112px',8)}${bar('68px',6)}</div></div>
      <div class="social-feed-sk-caption">${bar(index ? '76%' : '92%',8)}${bar('54%',8)}</div>
      <span class="skeleton social-feed-sk-image"></span>
      <div class="social-feed-sk-actions">${bar('70px',8)}${bar('88px',8)}</div>
    </article>`).join('');
}
async function loadSocialPosts() {
  const target = $('socialFeedList');
  if (!target) return;
  const cancelSkeleton = !state.socialPosts.length ? scheduleSkeleton(renderSocialPostsSkeleton) : () => {};
  try {
    const result = await api('/api/social/posts');
    cancelSkeleton();
    state.socialPosts = Array.isArray(result.data) ? result.data : [];
    renderSocialPosts();
    syncSocialComposerIdentity();
  } catch (error) {
    cancelSkeleton();
    target.innerHTML = '<div class="social-feed-empty">មិនអាចផ្ទុកការផុសបានទេ.</div>';
  }
}
function clearSocialImage() {
  const input = $('socialPostImage');
  if (input) input.value = '';
  if (state.socialUploadPreviewUrl) URL.revokeObjectURL(state.socialUploadPreviewUrl);
  state.socialUploadPreviewUrl = null;
  $('socialUploadPreview')?.classList.add('hidden');
  $('socialUploadPreviewImage')?.removeAttribute('src');
}
async function publishSocialPost() {
  if (!requireLogin()) return;
  const file = $('socialPostImage')?.files?.[0];
  const caption = $('socialPostCaption')?.value.trim() || '';
  if (!file) { toast('សូមជ្រើសរើសរូបភាពជាមុនសិន។', 'error'); return; }
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) {
    toast('សូមប្រើរូប JPG, PNG ឬ WEBP ដែលមានទំហំមិនលើស 8MB។', 'error'); return;
  }
  const button = $('socialPublishBtn');
  if (button) { button.disabled = true; button.textContent = 'កំពុងផុស...'; }
  const form = new FormData();
  form.append('image', file);
  form.append('caption', caption);
  try {
    await api('/api/social/posts', { method: 'POST', body: form });
    $('socialPostCaption').value = '';
    clearSocialImage();
    await loadSocialPosts();
    toast('បានផុសរូបភាពជោគជ័យ!');
  } catch (error) { toast(error.message || 'មិនអាចផុសរូបភាពបានទេ។', 'error'); }
  finally { if (button) { button.disabled = false; button.textContent = 'ផុសរូបភាព'; } }
}
async function toggleSocialLike(postId) {
  if (!requireLogin()) return;
  try {
    const result = await api(`/api/social/posts/${encodeURIComponent(postId)}/like`, { method: 'POST', body: JSON.stringify({}) });
    const post = state.socialPosts.find(item => String(item.id) === String(postId));
    if (post) { post.liked_by_me = result.liked; post.like_count = result.like_count; renderSocialPosts(); }
  } catch (error) { toast(error.message || 'មិនអាច Like បានទេ។', 'error'); }
}
async function toggleSocialComments(postId) {
  if (!state.socialCommentsOpen.has(postId)) {
    state.socialCommentsOpen.add(postId);
    try {
      const result = await api(`/api/social/posts/${encodeURIComponent(postId)}/comments`);
      state.socialCommentsCache.set(postId, result.data || []);
    } catch (error) { toast(error.message || 'មិនអាចផ្ទុកមតិយោបល់បានទេ។', 'error'); }
  } else state.socialCommentsOpen.delete(postId);
  renderSocialPosts();
}
async function submitSocialComment(form) {
  if (!requireLogin()) return;
  const postId = form.dataset.socialCommentForm;
  const input = form.elements.comment;
  const body = input?.value.trim() || '';
  if (!body) return;
  try {
    await api(`/api/social/posts/${encodeURIComponent(postId)}/comments`, { method: 'POST', body: JSON.stringify({ body }) });
    const result = await api(`/api/social/posts/${encodeURIComponent(postId)}/comments`);
    state.socialCommentsCache.set(postId, result.data || []);
    const post = state.socialPosts.find(item => String(item.id) === String(postId));
    if (post) post.comment_count = result.data.length;
    renderSocialPosts();
  } catch (error) { toast(error.message || 'មិនអាចផ្ញើមតិយោបល់បានទេ។', 'error'); }
}

function marketplaceCard(item, index) {
  if (item.listing_type === 'product') return productCard(item, index);
  const labels = { job: 'ការងារ', real_estate: 'អចលនទ្រព្យ' };
  const image = item.image_url || '';
  const period = item.listing_type === 'job'
    ? ({hourly:' / ម៉ោង',daily:' / ថ្ងៃ',monthly:' / ខែ',negotiable:''}[item.salary_period] || '')
    : item.real_estate_type?.endsWith('_rent')
      ? ({daily:' / ថ្ងៃ',monthly:' / ខែ',yearly:' / ឆ្នាំ'}[item.rent_period] || '') : '';
  const price = item.listing_type === 'job'
    ? (item.price_label === 'ចរចា' ? 'ចរចាប្រាក់ខែ' : '$' + String(item.price_label).replace(' - ', ' - $') + period)
    : item.listing_type === 'real_estate' && item.price_label == null ? 'ទាក់ទងសួរតម្លៃ' : money(item.price_label) + period;
  const description = String(item.short_description || item.description || '').trim().split(/\s+/).slice(0, 28).join(' ');
  return `
  <article class="cd marketplace-extra-card" style="animation-delay:${Math.min(index, 12) * 30}ms">
    <div class="ph im">
      <button class="absolute inset-0 z-[1] h-full w-full" type="button" data-action="view-listing" data-id="${esc(item.id)}" data-type="${esc(item.listing_type)}" aria-label="មើល ${esc(item.title)}"></button>
      ${image ? `<span class="img-scan-wrap shimmer-scan cd-image-wrap cd-main-wrap"><img src="${esc(image)}" alt="${esc(item.title)}" loading="lazy" decoding="async" class="cd-main"></span>` : ic('image', 36)}
      <span class="marketplace-type-badge">${labels[item.listing_type] || 'ផ្សារ'}</span>
    </div>
    <div class="cb">
      <h3 class="cursor-pointer hover:text-emerald-800" data-action="view-listing" data-id="${esc(item.id)}" data-type="${esc(item.listing_type)}">${esc(item.title)}</h3>
      <p class="pr"><span>${esc(price)}</span></p>
      ${description ? `<p class="cd-description">${esc(description)}</p>` : ''}
      <div class="sh listing-poster-row">
        <span class="listing-poster-avatar">${item.poster?.avatar_url ? `<img src="${esc(item.poster.avatar_url)}" alt="">` : esc(Array.from(item.poster?.display_name || '7')[0])}</span>
        <span class="listing-poster-name">${esc(item.poster?.display_name || 'អ្នកប្រើប្រាស់')}</span>
        <span class="listing-poster-kind">${esc(item.listing_subtitle || labels[item.listing_type] || '7inOne')}</span>
      </div>
      <p class="mt"><span class="cd-time-meta">${timeAgoKm(item.created_at)}</span><span class="cd-location-meta">${ic('pin', 11)}<span>${esc(item.location || 'កម្ពុជា')}</span></span></p>
    </div>
  </article>`;
}

function renderProducts() {
  const list = state.products.filter((item) => {
    if (item.listing_type === 'product' && state.activeCondition !== 'all') {
      const condition = String(item.condition || '').toLowerCase();
      const isNew = condition.includes('new') || condition.includes('ថ្មី');
      const isUsed = condition.includes('used') || condition.includes('second') || condition.includes('មួយទឹក') || condition.includes('ប្រើរួច');
      if (!(state.activeCondition === 'new' ? isNew : isUsed)) return false;
    }
    if (item.listing_type === 'product') {
      if (state.activeSubcategory !== 'all' && String(item.subcategory || '') !== state.activeSubcategory) return false;
      if (state.activeDetailType !== 'all' && String(item.detail_type || '') !== state.activeDetailType) return false;
      for (const [key, selected] of Object.entries(state.activeSpecFilters || {})) {
        if (!selected?.length) continue;
        const aliases = {
          brand:['brand','manufacturer'],cpu:['cpu','processor','cpu_model','processor_model'],
          ram:['ram','memory','memory_ram'],storage:['storage','ssd','hard_drive','capacity'],
          display:['display','display_size','screen','screen_size'],gpu:['gpu','graphics','graphics_card','graphics_processor'],
          color:['color','colour'],resolution:['resolution','display_resolution'],os:['operating_system','os']
        }[key] || [key];
        if (!selected.includes(specFilterValue(item,aliases))) return false;
      }
      const price = Number(item.display_price ?? item.price);
      if (state.specPriceMin !== '' && price < Number(state.specPriceMin)) return false;
      if (state.specPriceMax !== '' && price > Number(state.specPriceMax)) return false;
    }
    return true;
  });
  const getSortPrice = (item) => {
    const rawPrice = item.price_label ?? item.display_price ?? item.price ?? '';
    const match = String(rawPrice).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
  };
  list.sort((a, b) => {
    if (state.marketplaceSort === 'low' || state.marketplaceSort === 'high') {
      const priceA = getSortPrice(a);
      const priceB = getSortPrice(b);
      const hasPriceA = Number.isFinite(priceA);
      const hasPriceB = Number.isFinite(priceB);
      if (hasPriceA !== hasPriceB) return hasPriceA ? -1 : 1;
      if (!hasPriceA) return 0;
      return state.marketplaceSort === 'low' ? priceA - priceB : priceB - priceA;
    }
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });
  $('productGrid').innerHTML = list.map(marketplaceCard).join('');
  renderCategorySpecFilters();
  const resultCount = $('resultCount');
  if (resultCount) resultCount.textContent = `${list.length} ប្រកាស`;
  const typeTitles = { all: 'ប្រកាសថ្មីៗទាំងអស់', product: 'ផលិតផល', job: 'ការងារ', real_estate: 'អចលនទ្រព្យ' };
  const listingTitle = $('listingTitle');
  if (listingTitle) listingTitle.textContent = typeTitles[state.activeListingType] || typeTitles.all;
  const listingSub = $('listingSub');
  if (listingSub) listingSub.textContent = state.searchTerm ? `លទ្ធផលស្វែងរកសម្រាប់ «${esc(state.searchTerm)}»` : 'ផលិតផល ការងារ ផ្ទះជួល និងដីលក់ បង្ហាញតាមពេលបង្ហោះថ្មីបំផុត';
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

  // Load verified-seller Shorts independently of marketplace listing/banner loading.
  

  const params = new URLSearchParams({ limit: '50', type: state.activeListingType || 'all' });
  if (state.searchTerm) params.set('q', state.searchTerm);
  if (state.activeListingType === 'product' && state.activeCategory !== 'all') params.set('category', state.activeCategory);
  if (state.activeListingType === 'real_estate') params.set('property_type', state.activePropertyType || 'all');

  try {
    const res = await api('/api/marketplace/listings?' + params.toString());
    if (requestId !== state.productsRequestId) return;
    state.products = Array.isArray(res.data) ? res.data : [];
    renderProducts();
    syncHomeHeroImagesFromProducts();
  } catch (error) {
    if (requestId !== state.productsRequestId) return;
    renderProducts();
    toast('មិនអាចទាញយកប្រកាសបានទេ៖ ' + error.message, 'error');
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

function updateMarketplaceCategoryHeading() {
  const titles = {
    all: 'ប្រភេទទាំងអស់',
    product: 'ប្រភេទផលិតផល',
    job: 'ប្រភេទការងារ',
    real_estate: 'ប្រភេទអចលនទ្រព្យ'
  };
  const heading = $('marketplaceCategoryHeading');
  if (heading) heading.textContent = titles[state.activeListingType] || titles.all;
  document.querySelectorAll('[data-marketplace-category-group]').forEach((group) => {
    group.hidden = state.activeListingType === 'all' || group.dataset.marketplaceCategoryGroup !== state.activeListingType;
  });
}

function setCategory(category) {
  state.activeSpecFilters = {};
  state.activeSubcategory = 'all';
  state.activeDetailType = 'all';
  state.specPriceMin = '';
  state.specPriceMax = '';
  state.activeCategory = category;
  if (category !== 'all') state.activeListingType = 'product';
  updateMarketplaceCategoryHeading();
  $('searchCategory').value = category;
  document.querySelectorAll('[data-category]').forEach((b) => b.classList.toggle('active', b.dataset.category === category));
  document.querySelectorAll('[data-listing-type]').forEach((b) => b.classList.toggle('active', b.dataset.listingType === state.activeListingType));
  void loadProducts();
}

function setListingType(type) {
  state.activeSpecFilters = {};
  state.activeSubcategory = 'all';
  state.activeDetailType = 'all';
  state.specPriceMin = '';
  state.specPriceMax = '';
  state.activeListingType = ['all','product','job','real_estate'].includes(type) ? type : 'all';
  state.activeCategory = 'all';
  state.activePropertyType = 'all';
  updateMarketplaceCategoryHeading();
  $('searchCategory').value = 'all';
  document.querySelectorAll('[data-category]').forEach((b) => b.classList.toggle('active', b.dataset.category === 'all'));
  document.querySelectorAll('[data-listing-type]').forEach((b) => b.classList.toggle('active', b.dataset.listingType === state.activeListingType));
  document.querySelectorAll('[data-property-type]').forEach((b) => b.classList.toggle('active', b.dataset.propertyType === state.activePropertyType));
  void loadProducts();
}

function setPropertyType(type) {
  state.activePropertyType = ['all','house_sale','house_rent','condo_sale','apartment_rent','land','land_rent','commercial_sale','commercial_rent','room_rent','properties_wanted','agent_services','others_properties'].includes(type) ? type : 'all';
  document.querySelectorAll('[data-property-type]').forEach((b) => b.classList.toggle('active', b.dataset.propertyType === state.activePropertyType));
  void loadProducts();
}

function renderProductDetailSkeleton() {
  const root = $('productDetail');
  if (!root) return;
  const bar = (className = '') => `<div class="skeleton ${className}"></div>`;
  root.innerHTML = `
    <div class="product-detail-page product-detail-skeleton-page" aria-busy="true" aria-label="កំពុងផ្ទុកព័ត៌មានលម្អិត">
      <section class="product-hero-grid product-detail-skeleton-hero">
        <div class="product-detail-gallery product-detail-skeleton-gallery">
          <div class="product-gallery-thumbs product-detail-skeleton-thumbs">
            ${Array.from({ length: 4 }, () => bar('sk-thumb')).join('')}
          </div>
          <div class="product-gallery-stage skeleton sk-main-image"></div>
        </div>
        <div class="product-detail-info product-detail-skeleton-info">
          <div class="product-top-meta">${bar('sk-meta')} ${bar('sk-meta short')}</div>
          <div class="product-heading-block">
            ${bar('sk-title')}${bar('sk-title medium')}
            <div class="product-price-stock-row">${bar('sk-price')} ${bar('sk-stock')}</div>
            ${bar('sk-summary')}${bar('sk-summary short')}
          </div>
          <div class="product-detail-skeleton-actions">${bar('sk-action')}${bar('sk-action secondary')}</div>
          <div class="product-detail-skeleton-seller">
            ${bar('sk-avatar')}
            <div class="sk-seller-copy">${bar('sk-line')}${bar('sk-line short')}</div>
            ${bar('sk-store-button')}
          </div>
          <section class="product-detail-skeleton-panel">
            ${bar('sk-section-title')}
            <div class="sk-spec-grid">${Array.from({ length: 6 }, () => `<div>${bar('sk-line short')}${bar('sk-line')}</div>`).join('')}</div>
          </section>
          <section class="product-detail-skeleton-panel">
            ${bar('sk-section-title')}${bar('sk-paragraph')}${bar('sk-paragraph')}${bar('sk-paragraph short')}
          </section>
        </div>
      </section>
      <section class="product-trust-reviews-grid product-detail-skeleton-lower">
        <div class="product-detail-skeleton-panel">
          ${bar('sk-section-title')}
          <div class="sk-review-layout">${bar('sk-rating')}${bar('sk-review-lines')}</div>
        </div>
        <div class="product-detail-skeleton-panel">
          ${bar('sk-section-title')}${bar('sk-paragraph')}${bar('sk-paragraph')}${bar('sk-paragraph')}
        </div>
      </section>
      <section class="product-detail-skeleton-related">
        ${bar('sk-section-title')}
        <div class="sk-related-grid">${Array.from({ length: 4 }, () => `<div>${bar('sk-related-image')}${bar('sk-line')}${bar('sk-line short')}</div>`).join('')}</div>
      </section>
    </div>`;
}

async function openMarketplaceListing(type, id, options = {}) {
  if (!id || !['job', 'real_estate'].includes(type)) return false;
  const isCurrent = () => options.routeSyncNavigationId == null || options.routeSyncNavigationId === state.routeSyncNavigationId;
  state.currentProduct = { id: String(id), listing_type: type };
  await showView('product', { preserveScroll: Boolean(options.preserveScroll), deferLoad: true });
  if (!isCurrent()) return false;
  renderProductDetailSkeleton();

  try {
    let item = state.products.find(row => row.listing_type === type && String(row.id) === String(id))
      || state.jobs.find(row => row.listing_type === type && String(row.id) === String(id));
    if (!item) {
      const result = await api('/api/marketplace/listings?limit=100&type=' + encodeURIComponent(type));
      if (!isCurrent()) return false;
      item = (result.data || []).find(row => String(row.id) === String(id));
    }
    if (!item) throw new Error('មិនមានព័ត៌មានប្រកាសនេះទេ។');
    // Keep the listing type explicit so showView builds the shared detail route
    // as product/job/<id> instead of treating a job ID as a product ID.
    item = { ...item, listing_type: type };
    state.currentMarketplaceListing = item;
    state.currentProduct = item;
    state.currentVendor = null;
    state.productGalleryIndex = 0;
    state.productGalleryVideoActive = false;
    try {
      sessionStorage.setItem('ecomstore.activeView', 'product');
      sessionStorage.setItem('ecomstore.currentProductId', String(id));
      sessionStorage.setItem('ecomstore.currentListingType', type);
      sessionStorage.setItem('ecomstore.currentListingId', String(id));
    } catch {}
    await showView('product', { preserveScroll: Boolean(options.preserveScroll) });
    return true;
  } catch (error) {
    if (!isCurrent()) return false;
    toast(error.message || 'មិនអាចបើកព័ត៌មានប្រកាសបានទេ។', 'error');
    void showView('home');
    return false;
  }
}

async function openProduct(id, options = {}) {
  if (!id) { toast('មិនមានលេខសម្គាល់ទំនិញទេ។', 'warning'); return false; }
  const productId = String(id);
  const isCurrent = () => options.routeSyncNavigationId == null || options.routeSyncNavigationId === state.routeSyncNavigationId;

  state.currentProduct = { id: productId };
  await showView('product', { preserveScroll: Boolean(options.preserveScroll), deferLoad: true });
  if (!isCurrent()) return false;
  renderProductDetailSkeleton();

  try {
    try {
      sessionStorage.setItem('ecomstore.currentProductId', productId);
      sessionStorage.setItem('ecomstore.activeView', 'product');
    } catch {}

    const [result] = await Promise.all([
      api('/api/products/' + encodeURIComponent(productId)),
      state.session ? loadOrders().catch(() => {}) : Promise.resolve()
    ]);
    if (!isCurrent()) return false;

    const product = result.data;
    if (!product) throw new Error('មិនមានព័ត៌មានទំនិញនេះទេ។');
    product.poster = state.products.find(row => row.listing_type === 'product' && String(row.id) === productId)?.poster || product.poster || null;

    const trust = await api('/api/vendors/' + encodeURIComponent(product.vendor_id) + '/ratings');
    if (!isCurrent()) return false;

    state.currentProduct = product;
    state.currentVendor = trust.data;
    state.currentVariantId = product.variants?.[0]?.id || null;
    state.productGalleryIndex = 0;
    state.productGalleryVideoActive = false;
    renderProductDetail();
    return true;
  } catch (error) {
    if (!isCurrent()) return false;
    toast(error.message, 'error');
    void showView('home');
    return false;
  }
}

function extractGoogleMapEmbedUrl(rawUrl, fallbackLocation = '') {
  const raw = String(rawUrl || '').trim();
  const fallback = String(fallbackLocation || '').trim();
  let query = fallback;
  if (raw) {
    try {
      const url = new URL(raw);
      const host = url.hostname.toLowerCase();
      if (!['google.com','www.google.com','maps.google.com','maps.app.goo.gl','goo.gl'].includes(host) &&
          !host.endsWith('.google.com')) return '';
      const coordinateMatch = url.href.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
      if (coordinateMatch) query = coordinateMatch[1] + ',' + coordinateMatch[2];
      else {
        const placeMatch = url.pathname.match(/\/place\/([^/]+)/i);
        const q = url.searchParams.get('q') || url.searchParams.get('query');
        if (q) query = q;
        else if (placeMatch) query = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
        else if (!/maps\.app\.goo\.gl|goo\.gl/.test(host)) query = url.pathname.replace(/^\/(maps\/)?/,'').replace(/\//g,' ').trim() || fallback;
      }
    } catch { return ''; }
  }
  if (!query) return '';
  return 'https://maps.google.com/maps?q=' + encodeURIComponent(query) + '&z=16&output=embed';
}
function renderDetailMapSection(item) {
  const specs = item.specifications && typeof item.specifications === 'object' ? item.specifications : {};
  const rawUrl = specs.google_map_url || item.google_map_url || '';
  const location = [item.location, item.address].filter(Boolean).join(' · ');
  if (!rawUrl) return location ? `<div class="detail-location"><div class="detail-location-heading">${ic('pin',17)} <b>ទីតាំង</b></div><p>${esc(item.location || 'កម្ពុជា')}</p>${item.address ? `<small>${esc(item.address)}</small>` : ''}</div>` : '';
  const embedUrl = extractGoogleMapEmbedUrl(rawUrl, location || 'Cambodia');
  return `<section class="detail-map-section"><div class="detail-location-heading">${ic('pin',17)} <b>ទីតាំង</b></div><p>${esc(item.location || 'កម្ពុជា')}</p>${item.address ? `<small>${esc(item.address)}</small>` : ''}<div class="detail-map-frame">${embedUrl ? `<iframe src="${esc(embedUrl)}" title="Google Maps location" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen style="background:#16202D"></iframe>` : ''}<button type="button" class="detail-map-open" data-detail-action="map" data-map-url="${esc(rawUrl)}">បង្ហាញទីតាំងនៅលើផែនទី</button></div></section>`;
}
function renderProductDetailLocation(item) {
  const specs = item.specifications && typeof item.specifications === 'object' ? item.specifications : {};
  const rawUrl = specs.google_map_url || item.google_map_url || '';
  const location = [item.location, item.address].filter(Boolean).join(' · ');
  if (!location && !rawUrl) return '';
  const embedUrl = extractGoogleMapEmbedUrl(rawUrl, location || 'Cambodia');
  return `<section class="detail-location-layout">
    <div class="detail-location-copy">
      <div class="detail-location-heading">${ic('pin',17)} <b>ទីតាំង</b></div>
      <p>${esc(item.location || 'កម្ពុជា')}</p>
      ${item.address ? `<small>${esc(item.address)}</small>` : ''}
    </div>
    <div class="detail-map-frame">
      ${embedUrl ? `<iframe src="${esc(embedUrl)}" title="ផែនទីទីតាំងផលិតផល" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen style="background:#16202D"></iframe>` : ''}
      ${embedUrl ? `<button type="button" class="detail-map-open" data-detail-action="map" data-map-url="${esc(embedUrl)}">មើលផែនទី</button>` : ''}
    </div>
  </section>`;
}
function bindListingDetailActions(root, item) {
  root.querySelectorAll('[data-detail-action]').forEach(button => button.addEventListener('click', async () => {
    const action = button.dataset.detailAction;
    if (action === 'map') {
      const url = button.dataset.mapUrl || '';
      try { const parsed = new URL(url); if (parsed.protocol === 'https:' && (parsed.hostname.endsWith('google.com') || parsed.hostname.endsWith('goo.gl'))) window.open(url, '_blank', 'noopener,noreferrer'); else toast('Google Maps Link មិនត្រឹមត្រូវ។','warning'); } catch { toast('Google Maps Link មិនត្រឹមត្រូវ។','warning'); }
      return;
    }
    if (action === 'share') {
      const route = item.listing_type === 'product' ? '#product/' + encodeURIComponent(item.id) : '#product/' + encodeURIComponent(item.listing_type) + '/' + encodeURIComponent(item.id);
      try { await navigator.clipboard.writeText(location.origin + location.pathname + route); toast('បានចម្លង Link រួចរាល់!'); }
      catch { toast('មិនអាចចម្លង Link បានទេ។','error'); }
      return;
    }
    if (!requireLogin()) return;
    if (action === 'save') {
      button.disabled = true;
      try {
        const result = await api('/api/listing-saves', {method:'POST',body:JSON.stringify({listing_type:item.listing_type,id:item.id})});
        if (result.data?.saved) { button.classList.add('is-saved'); button.querySelector('span').textContent='បានរក្សាទុក'; toast('បានរក្សាទុកប្រកាស!'); }
      } catch (error) { toast(error.message || 'មិនអាចរក្សាទុកបានទេ។','error'); }
      finally { button.disabled = false; }
      return;
    }
    if (action === 'report') {
      const reason = await appDialog({ mode:'prompt', title:'រាយការណ៍ប្រកាស', message:'សូមបញ្ជាក់មូលហេតុដែលអ្នកចង់រាយការណ៍ ដើម្បីឱ្យ Admin អាចពិនិត្យបានត្រឹមត្រូវ។', placeholder:'ឧ. ព័ត៌មានមិនត្រឹមត្រូវ ឬសង្ស័យថាបោកប្រាស់...' });
      if (!reason || !reason.trim()) return;
      button.disabled = true;
      try { await api('/api/listing-reports',{method:'POST',body:JSON.stringify({listing_type:item.listing_type,id:item.id,reason:reason.trim()})}); toast('បានផ្ញើរបាយការណ៍ទៅ Admin រួចរាល់។'); }
      catch(error){ toast(error.message || 'មិនអាចរាយការណ៍បានទេ។','error'); }
      finally { button.disabled = false; }
    }
  }));
}
function detailBottomActions(item) {
  return `<div class="detail-bottom-actions"><button type="button" data-detail-action="save">${ic('bookmark',16)} <span>រក្សាទុក</span></button><button type="button" data-detail-action="report">${ic('flag',16)} <span>រាយការណ៍</span></button><button type="button" data-detail-action="share">${ic('share',16)} <span>ចែករំលែក</span></button></div>`;
}

function renderMarketplaceListingInProductDetail(item) {
  const root = $('productDetail');
  if (!root) return;
  const type = item.listing_type;
  const isJob = type === 'job';
  const label = isJob ? 'ការងារ' : 'អចលនទ្រព្យ';
  const gallery = Array.isArray(item.image_urls) && item.image_urls.length
    ? item.image_urls.filter(Boolean)
    : (item.image_url ? [item.image_url] : []);
  const price = isJob
    ? (item.price_label === 'ចរចា' ? 'ចរចាប្រាក់ខែ' : (item.price_label ? '$' + String(item.price_label).replace(' - ', ' - $') : 'ទាក់ទងសួរប្រាក់ខែ') + ({hourly:' / ម៉ោង',daily:' / ថ្ងៃ',monthly:' / ខែ',negotiable:''}[item.salary_period] || ''))
    : (item.price_label == null ? 'ទាក់ទងសួរតម្លៃ' : money(item.price_label) + (item.real_estate_type?.endsWith('_rent') ? ({daily:' / ថ្ងៃ',monthly:' / ខែ',yearly:' / ឆ្នាំ'}[item.rent_period] || '') : ''));
  const displayJobValue = (key, value) => {
    if (value === null || value === undefined || String(value).trim() === '') return '';
    const raw = String(value).trim();
    const maps = {
      employment_type: { full_time: 'ពេញម៉ោង', part_time: 'ក្រៅម៉ោង', contract: 'តាមកិច្ចសន្យា', internship: 'កម្មសិក្សា', temporary: 'បណ្តោះអាសន្ន', freelance: 'ឯករាជ្យ' },
      salary_period: { hourly: 'តាមម៉ោង', daily: 'តាមថ្ងៃ', monthly: 'ប្រចាំខែ', yearly: 'ប្រចាំឆ្នាំ', negotiable: 'ចរចា' },
      work_schedule: { day: 'វេនថ្ងៃ', night: 'វេនយប់', rotating: 'ប្តូរវេន', flexible: 'បត់បែន' },
      education: { none: 'មិនទាមទារ', primary: 'បឋមសិក្សា', secondary: 'មធ្យមសិក្សា', high_school: 'វិទ្យាល័យ', bachelor: 'បរិញ្ញាបត្រ', master: 'អនុបណ្ឌិត', phd: 'បណ្ឌិត' },
      experience: { none: 'មិនទាមទារ', entry: 'មិនទាមទារបទពិសោធន៍', junior: 'កម្រិតដំបូង', mid: 'មធ្យម', senior: 'ជាន់ខ្ពស់' }
    };
    if (maps[key]?.[raw]) return maps[key][raw];
    if (key === 'experience' && /^\\d+$/.test(raw)) return Number(raw) === 0 ? 'មិនទាមទារបទពិសោធន៍' : raw + ' ឆ្នាំ';
    if (key === 'education' && /^\\d+$/.test(raw)) return 'ថ្នាក់ទី' + raw;
    if (key === 'vacancies' && /^\\d+$/.test(raw)) return raw + ' នាក់';
    return raw.replace(/_/g, ' ');
  };
  const specs = item.specifications && typeof item.specifications === 'object' ? item.specifications : {};
  const facts = isJob
    ? [['ក្រុមហ៊ុន',item.company_name],['ប្រភេទការងារ',displayJobValue('employment_type',item.employment_type)],['ប្រភេទរង',item.subcategory],['ចំនួនបុគ្គលិក',displayJobValue('vacancies',item.vacancies)],['បទពិសោធន៍',displayJobValue('experience',item.experience)],['ការអប់រំ',displayJobValue('education',item.education)],['ម៉ោងធ្វើការ',displayJobValue('work_schedule',item.work_schedule)],['ប្រភេទប្រាក់ខែ',displayJobValue('salary_period',item.salary_period)],...Object.entries(specs).filter(([key,value])=>key!=='google_map_url'&&value!=null&&String(value).trim()!=='').map(([key,value])=>[key.replace(/_/g,' '),value])]
    : [['ប្រភេទអចលនទ្រព្យ',item.property_type || item.real_estate_type],['ប្រភេទរង',item.subcategory],['បន្ទប់គេង',item.bedrooms],['បន្ទប់ទឹក',item.bathrooms],['ទំហំ',item.area_sqm ? item.area_sqm + ' m²' : ''],['ប្រភេទដី',item.land_type],['ប្លង់',item.title_deed],['ផ្លូវចូល',item.road_access],['អាសយដ្ឋាន',item.address],...Object.entries(specs).filter(([key,value])=>key!=='google_map_url'&&value!=null&&String(value).trim()!=='').map(([key,value])=>[key.replace(/_/g,' '),value])];
  const imageHtml = gallery.length
    ? `<div class="product-gallery-stage"><img class="product-listing-main-image" src="${esc(gallery[0])}" alt="${esc(item.title)}"></div>${gallery.length > 1 ? `<div class="product-gallery-thumbs">${gallery.map((url,index)=>`<button type="button" class="product-gallery-thumb ${index===0?'active':''}" data-shared-listing-image="${index}"><img src="${esc(url)}" alt="រូបភាព ${index+1}" loading="lazy"></button>`).join('')}</div>` : ''}`
    : `<div class="product-gallery-stage">${ic('image',48)}</div>`;
  root.innerHTML = `
    <div class="product-detail-page">
      <section class="product-hero-grid">
        <div class="product-detail-gallery">${imageHtml}${listingVideoButton(item)}</div>
        <div class="product-detail-info">
          <div class="product-top-meta">
            <span class="product-category-badge">${label}</span>
            <span class="product-meta-item">${ic('clock',14)} ${item.created_at ? timeAgoKm(item.created_at) : ''}</span>
          </div>
          <ul class="product-facts-list">
            <li><span>ចំណងជើង</span><h1 class="product-detail-title">${esc(item.title || label)}</h1></li>
            <li><span>${isJob ? 'ប្រាក់ខែ' : 'តម្លៃ'}</span><strong class="product-facts-price">${esc(price)}</strong></li>
            <li><span>ទីតាំង</span><strong>${ic('pin',14)} ${esc(item.location || 'កម្ពុជា')}</strong></li>
          </ul>
          <section class="listing-poster-detail">
            <div class="listing-poster-detail-avatar">${item.poster?.avatar_url ? `<img src="${esc(item.poster.avatar_url)}" alt="">` : esc(Array.from(item.poster?.display_name || '7')[0])}</div>
            <div class="listing-poster-detail-copy"><small>អ្នកផុសប្រកាសនេះ</small><b>${esc(item.poster?.display_name || 'អ្នកប្រើប្រាស់')}</b><time>${item.created_at ? timeAgoKm(item.created_at) : ''}</time></div>
            <button type="button" class="listing-poster-chat" data-listing-chat>${ic('chat',16)} ឆាតជាមួយអ្នកផុស</button>
          </section>
          <section class="product-detail-description">
            <h2>${ic('file',18)} ការពិពណ៌នា</h2>
            <div class="product-spec-grid detail-spec-grid">${facts.filter(([,value])=>value!==null&&value!==undefined&&String(value).trim()!=='').map(([key,value])=>`<div><small>${esc(key)}</small><b>${esc(value)}</b></div>`).join('')}</div>
            <p class="product-full-description">${esc(item.description || item.short_description || 'មិនទាន់មានការពិពណ៌នាលម្អិតទេ។')}</p>
            ${renderDetailMapSection(item)}
          </section>
          ${detailBottomActions(item)}
          <p class="product-meta-item">${esc(item.contact_phone || item.phone || '')}</p>
        </div>
      </section>
    </div>`;
  bindListingDetailActions(root, item);
  root.querySelector('[data-listing-chat]')?.addEventListener('click', () => { void startListingPosterChat(item); });
  root.querySelectorAll('[data-shared-listing-image]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.sharedListingImage);
    if (!gallery[index]) return;
    const main = root.querySelector('.product-listing-main-image');
    if (main) main.src = gallery[index];
    root.querySelectorAll('[data-shared-listing-image]').forEach(node => node.classList.toggle('active', node === button));
  }));
}

function renderProductDetail() {
  const p = state.currentProduct;
  const v = state.currentVendor;
  if (!p) return;
  if (p.listing_type === 'job' || p.listing_type === 'real_estate') {
    renderMarketplaceListingInProductDetail(p);
    return;
  }
  if (!v) return;

  const descriptions = productDescriptionParts(p);
  const images = (p.product_images || []).filter((i) => i.image_url);
  const videoId = youtubeVideoId(p.youtube_video_url);
  const hasVideo = Boolean(videoId);
  const galleryCount = images.length + (hasVideo ? 1 : 0);
  if (!images.length && hasVideo) state.productGalleryVideoActive = true;
  const activeImage = images[state.productGalleryIndex] || images[0];
  const saved = state.savedIds.has(p.id);
  const selectedVariant = (p.variants || []).find(item => String(item.id) === String(state.currentVariantId)) || (p.variants || [])[0] || null;
  if (selectedVariant && !state.currentVariantId) state.currentVariantId = selectedVariant.id;
  const effectivePrice = selectedVariant ? Number(selectedVariant.price) : Number(p.price);
  const effectiveStock = selectedVariant ? Number(selectedVariant.stock) : Number(p.stock || 0);
  const stockKnown = selectedVariant ? selectedVariant.stock !== undefined && selectedVariant.stock !== null : p.stock !== undefined && p.stock !== null;
  const stockLabel = stockKnown ? (effectiveStock > 0 ? 'មានទំនិញក្នុងស្តុក' : 'អស់ពីស្តុក') : 'អាចសាកសួរបាន';
  const related = state.products.filter((item) => String(item.id) !== String(p.id) && (item.category === p.category || String(item.vendor_id) === String(p.vendor_id))).slice(0, 6);

  const galleryHtml = galleryCount
    ? `<div class="product-gallery-stage ${state.productGalleryVideoActive && hasVideo ? 'is-video' : ''}">${activeImage ? `<img id="productMainImage" src="${esc(activeImage.image_url)}" alt="${esc(p.title)}" data-gallery-zoom>` : ic('image', 48)}<span class="product-gallery-condition">${esc(p.condition || 'មិនបានបញ្ជាក់')}</span><button type="button" class="product-gallery-save" data-product-action="save" aria-label="រក្សាទុករូបភាព" title="រក្សាទុក" aria-pressed="${saved}">${ic('bookmark', 18)}</button><button type="button" class="product-gallery-zoom" data-gallery-zoom-button aria-label="ពង្រីករូបភាព" title="ពង្រីករូបភាព">${ic('maximize', 17)}</button>${galleryCount > 1 ? `<button type="button" class="product-gallery-arrow prev" data-gallery-step="-1">${ic('arrow', 17)}</button><button type="button" class="product-gallery-arrow next" data-gallery-step="1">${ic('arrow', 17)}</button>` : ''}<span class="product-gallery-counter">${state.productGalleryVideoActive && hasVideo ? galleryCount : state.productGalleryIndex + 1} / ${galleryCount}</span></div><div class="product-gallery-thumbs" id="productGalleryThumbs">${images.map((im, i) => `<button type="button" class="product-gallery-thumb ${!state.productGalleryVideoActive && i === state.productGalleryIndex ? 'active' : ''}" data-image="${i}"><img src="${esc(im.image_url)}" alt=""></button>`).join('')}${hasVideo ? `<button type="button" class="product-gallery-thumb product-gallery-video-thumb ${state.productGalleryVideoActive ? 'active' : ''}" data-gallery-video aria-label="មើលវីដេអូ YouTube"><img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="YouTube video"><span>${ic('play',18)}</span></button>` : ''}</div>`
    : `<div class="product-gallery-stage">${ic('image', 48)}</div>`;

  const reviewItems = (v.reviews || []).slice(0, 5);
  const reviewTotal = Number(v.review_count || reviewItems.length || 0);
  const average = Number(v.rating || 0);
  const reviewedOrderIds = new Set((v.reviews || []).map(review => String(review.order_id || '')));
  const eligibleReviewOrders = state.session
    ? (state.myOrders || []).filter(order =>
        order.status === 'completed' &&
        !reviewedOrderIds.has(String(order.id)) &&
        (order.order_items || []).some(item => String(item.vendor_id) === String(v.id) && item.fulfillment_status === 'completed')
      )
    : [];
  const reviewFormHtml = !state.session
    ? `<div class="product-review-gate"><p>ចូលគណនី និងទិញទំនិញពីហាងនេះ ដើម្បីអាចវាយតម្លៃអ្នកលក់បាន។</p><button type="button" data-review-login>ចូលគណនី</button></div>`
    : eligibleReviewOrders.length
      ? `<form id="productReviewForm" class="product-review-form" data-rating="5">
          <h3>ចែករំលែកបទពិសោធន៍ទិញទំនិញ</h3>
          <p>ជ្រើសរើសផ្កាយ ១ ដល់ ៥ និងសរសេរមតិយោបល់របស់អ្នក។</p>
          <div class="product-review-star-picker" role="group" aria-label="ការវាយតម្លៃផ្កាយ">
            ${[1,2,3,4,5].map(value => `<button type="button" class="${value <= 5 ? 'active' : ''}" data-review-rating="${value}" aria-label="${value} ផ្កាយ" aria-pressed="${value === 5}">★</button>`).join('')}
          </div>
          <label><span>ការបញ្ជាទិញដែលបានបញ្ចប់</span><select name="order_id" class="field" required>${eligibleReviewOrders.map(order => `<option value="${esc(order.id)}">#${esc(String(order.id).slice(0,8))} · ${fmtDate(order.created_at)}</option>`).join('')}</select></label>
          <label><span>មតិយោបល់ (មិនចាំបាច់)</span><textarea name="comment" class="field" rows="3" maxlength="1200" placeholder="សរសេរអំពីគុណភាពទំនិញ និងសេវាកម្មរបស់ហាង..."></textarea></label>
          <button type="submit" class="product-review-submit">ផ្ញើការវាយតម្លៃ</button>
        </form>`
      : `<div class="product-review-gate"><p>${reviewedOrderIds.size ? 'អ្នកបានវាយតម្លៃការបញ្ជាទិញដែលមានរួចហើយ។' : 'អាចវាយតម្លៃបានក្រោយពេលការបញ្ជាទិញពីហាងនេះត្រូវបានបញ្ចប់។'}</p></div>`;

  $('productDetail').innerHTML = `
  <div class="product-detail-page">
    <section class="product-hero-grid">
      <div class="product-detail-gallery">${galleryHtml}</div>
      <div class="product-detail-info">
        <div class="product-top-meta">
          <span class="product-category-badge">${esc(CATEGORIES[p.category] || p.category || 'ទំនិញ')}</span>
          <span class="product-meta-item">${ic('clock', 14)} ${fmtDate(p.created_at)}</span>
          <span class="product-meta-item">${ic('eye', 14)} ${Number(p.view_count || 0).toLocaleString()} Views</span>
          <span class="product-meta-item product-detail-id"><span>Product ID</span><code>${esc(selectedVariant?.sku || displayProductCode(p))}</code><button type="button" data-copy-product-code="${esc(selectedVariant?.sku || displayProductCode(p))}" aria-label="ចម្លង Product ID" title="ចម្លង Product ID">${ic('clipboard', 12)}</button></span>
        </div>

        <div class="product-heading-block">
          <h1 class="product-detail-title">${esc(p.title)}</h1>
          <div class="product-price-stock-row">
            <strong class="product-facts-price">${money(effectivePrice)}</strong>
            <span class="product-stock-badge ${stockKnown && effectiveStock <= 0 ? 'is-out' : ''}">${ic(stockKnown && effectiveStock <= 0 ? 'x' : 'checkcircle', 14)} ${stockLabel}</span>
          </div>
          ${p.variants?.length ? `<section class="product-variant-picker"><b>ជ្រើសរើសជម្រើស</b><div class="product-variant-options">${p.variants.map(variant => `<button type="button" data-product-variant="${esc(variant.id)}" class="${String(selectedVariant?.id) === String(variant.id) ? 'is-selected' : ''}" aria-pressed="${String(selectedVariant?.id) === String(variant.id)}" ${Number(variant.stock) <= 0 ? 'disabled' : ''}><span>${esc(variant.option_value)}</span><small>${money(variant.price)}${Number(variant.stock) <= 0 ? ' · អស់ស្តុក' : ''}</small></button>`).join('')}</div>${selectedVariant?.sku ? `<small class="product-variant-sku">Product Code: ${esc(selectedVariant.sku)}</small>` : ''}</section>` : ''}
          ${descriptions.short ? `<p class="product-short-summary-text">${esc(descriptions.short)}</p>` : ''}
        </div>

        <div>
          <div class="product-primary-actions">
            <button type="button" class="product-buy-primary" data-product-action="buy">${ic('bag', 18)} ទិញឥឡូវនេះ</button>
            <button type="button" class="product-save-primary" data-product-action="save" aria-pressed="${saved}">${ic('bookmark', 16)} <span>${saved ? 'បានរក្សាទុក' : 'រក្សាទុក'}</span></button>
          </div>
          <div class="product-utility-actions">
            <button type="button" class="product-chat-primary" data-product-action="chat">${ic('chat', 18)} ឆាតជាមួយអ្នកលក់</button>
            <button type="button" data-product-action="offer">${ic('tag', 16)} តថ្លៃទំនិញ</button>
          </div>
        </div>

        <section class="product-seller-card">
          <div class="product-seller-heading">
            <div class="product-seller-logo">${p.poster?.avatar_url ? `<img src="${esc(p.poster.avatar_url)}" alt="">` : (v.store_logo_url ? `<img src="${esc(v.store_logo_url)}" alt="">` : avatarFallbackMarkup(v.store_name))}</div>
            <div class="product-seller-identity">
              <b>${esc(p.poster?.display_name || v.store_name || 'អ្នកលក់')}</b>
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
          <section class="product-spec-section">
            <h2>${ic('sliders', 18)} លក្ខណៈបច្ចេកទេស</h2>
            <div class="product-spec-grid detail-spec-grid">
              ${[['ប្រភេទ',CATEGORIES[p.category] || p.category],['ស្ថានភាព',p.condition],['កាលបរិច្ឆេទបង្ហោះ',p.created_at ? fmtDate(p.created_at) : ''],['ម៉ាក / ព័ត៌មានបន្ថែម',p.brand || p.specifications?.brand || p.specifications?.model || 'មិនបានបញ្ជាក់'],...Object.entries(p.specifications || {}).filter(([key,value])=>key!=='google_map_url'&&key!=='brand'&&key!=='model'&&value!=null&&String(value).trim()!=='').map(([key,value])=>[key.replace(/_/g,' '),value])].filter(([,value])=>value!=null&&String(value).trim()!=='').map(([key,value])=>`<div><small>${esc(key)}</small><b>${esc(value)}</b></div>`).join('')}
            </div>
          </section>
          <section class="product-description-copy">
            <h2>${ic('file', 18)} ការពិពណ៌នា</h2>
            <p class="product-full-description">${esc(descriptions.full || descriptions.short || 'មិនទាន់មានការពិពណ៌នាលម្អិតទេ។')}</p>
          </section>
          ${renderProductDetailLocation(p)}
          ${detailBottomActions({...p,listing_type:'product'})}
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
      ${reviewFormHtml}
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

  $('productDetail').querySelectorAll('[data-product-variant]').forEach(button => button.addEventListener('click', () => {
    const variant = (p.variants || []).find(item => String(item.id) === String(button.dataset.productVariant));
    if (!variant) return;
    state.currentVariantId = variant.id;
    renderProductDetail();
  }));
  bindListingDetailActions($('productDetail'), {...p,listing_type:'product'});
  $('productDetail').querySelector('[data-review-login]')?.addEventListener('click', () => openAuth('login'));
  const reviewForm = $('productReviewForm');
  if (reviewForm) {
    reviewForm.querySelectorAll('[data-review-rating]').forEach(star => star.addEventListener('click', () => {
      const rating = Number(star.dataset.reviewRating);
      reviewForm.dataset.rating = String(rating);
      reviewForm.querySelectorAll('[data-review-rating]').forEach(option => {
        const active = Number(option.dataset.reviewRating) <= rating;
        option.classList.toggle('active', active);
        option.setAttribute('aria-pressed', String(Number(option.dataset.reviewRating) === rating));
      });
    }));
    reviewForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!requireLogin()) return;
      const submit = reviewForm.querySelector('[type="submit"]');
      submit.disabled = true;
      try {
        await api('/api/vendors/' + encodeURIComponent(v.id) + '/reviews', {
          method:'POST',
          body:JSON.stringify({
            order_id:new FormData(reviewForm).get('order_id'),
            rating:Number(reviewForm.dataset.rating || 5),
            comment:new FormData(reviewForm).get('comment') || ''
          })
        });
        const refreshed = await api('/api/vendors/' + encodeURIComponent(v.id) + '/ratings');
        state.currentVendor = refreshed.data;
        renderProductDetail();
        toast('បានផ្ញើការវាយតម្លៃរួចរាល់។');
      } catch (error) {
        toast(error.message || 'មិនអាចផ្ញើការវាយតម្លៃបានទេ។','error');
        submit.disabled = false;
      }
    });
  }
  const updateGallery = (idx) => {
    if (!galleryCount) return;
    const nextIndex = (idx + galleryCount) % galleryCount;
    state.productGalleryVideoActive = Boolean(hasVideo && nextIndex === images.length);
    if (!state.productGalleryVideoActive) state.productGalleryIndex = nextIndex;
    const stage = $('productDetail').querySelector('.product-gallery-stage');
    stage?.classList.remove('is-video');
    const currentFrame = stage?.querySelector('[data-product-gallery-video]');
    const currentImage = stage?.querySelector('#productMainImage');
    if (currentFrame) {
      if (images[state.productGalleryIndex]) {
        const image = document.createElement('img');
        image.id = 'productMainImage';
        image.src = images[state.productGalleryIndex].image_url;
        image.alt = p.title || 'រូបភាពផលិតផល';
        image.dataset.galleryZoom = '';
        currentFrame.replaceWith(image);
      } else {
        currentFrame.remove();
      }
    } else if (!state.productGalleryVideoActive && currentImage) {
      currentImage.src = images[state.productGalleryIndex].image_url;
    }
    if (state.productGalleryVideoActive) {
      const popupVendor = p.vendors || p.vendor || {};
      openListingVideoPopup(p.youtube_video_url, p.title, {
        storeName: popupVendor.store_name || p.store_name || 'ហាងអ្នកលក់',
        storeAvatar: popupVendor.store_logo_url || popupVendor.logo_url || p.store_logo_url || '',
        listingId: p.id || '',
        vendorId: p.vendor_id || popupVendor.id || '',
        category: p.category || '',
        source: 'product-gallery',
        storeVerified: popupVendor.status === 'approved',
        productTitle: p.title || '',
        productPrice: p.price_label != null ? p.price_label : p.price,
        productImage: productImage(p) || (Array.isArray(p.image_urls) ? p.image_urls[0] : '') || p.image_url || p.cover_url || ''
      });
    }
    else closeListingVideoPopup();
    $('productGalleryThumbs')?.querySelectorAll('[data-image]').forEach((b) => b.classList.toggle('active', !state.productGalleryVideoActive && Number(b.dataset.image) === state.productGalleryIndex));
    $('productGalleryThumbs')?.querySelector('[data-gallery-video]')?.classList.toggle('active', state.productGalleryVideoActive);
    const counter = $('productDetail').querySelector('.product-gallery-counter');
    if (counter) counter.textContent = `${state.productGalleryVideoActive ? galleryCount : state.productGalleryIndex + 1} / ${galleryCount}`;
    const zoomImage = $('productDetail').querySelector('[data-gallery-zoom]');
    if (zoomImage) zoomImage.onclick = openProductLightbox;
    if (state.productLightboxOpen && !state.productGalleryVideoActive) updateProductLightbox();
    if (state.productGalleryVideoActive && state.productLightboxOpen) closeProductLightbox();
  };

  $('productDetail').querySelectorAll('[data-image]').forEach((b) => b.addEventListener('click', () => updateGallery(Number(b.dataset.image))));
  $('productDetail').querySelector('[data-gallery-video]')?.addEventListener('click', () => updateGallery(images.length));
  $('productDetail').querySelectorAll('[data-gallery-step]').forEach((b) => b.addEventListener('click', () => {
    const current = state.productGalleryVideoActive ? images.length : state.productGalleryIndex;
    updateGallery(current + Number(b.dataset.galleryStep));
  }));
  const initialZoomImage = $('productDetail').querySelector('[data-gallery-zoom]');
  if (initialZoomImage) initialZoomImage.onclick = openProductLightbox;
  $('productDetail').querySelector('[data-gallery-zoom-button]')?.addEventListener('click', openProductLightbox);

  $('productDetail').querySelectorAll('[data-product-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.productAction;
      if (kind === 'store') void openStorefront(v.id);
      if (kind === 'buy') openCheckout(p);
      if (kind === 'save') saveAction(p.id, btn);
      if (kind === 'offer') {
        if (!requireLogin()) return;
        state.currentOfferProduct = {...p, price: effectivePrice, variant_id: selectedVariant?.id || null};
        $('offerProductName').textContent = `${p.title} · ${money(effectivePrice)}`;
        $('offerAmount').value = effectivePrice;
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
    currentStoreTotal: 0, currentStoreLoading: true, currentStoreSkeletonVisible: false, currentStoreLoadError: false,
    currentStoreMoreLoading: false, currentStoreMoreError: false
  });
  try {
    sessionStorage.setItem('ecomstore.currentStoreId', storeId);
    sessionStorage.setItem('ecomstore.activeView', 'store');
    await showView('store', { preserveScroll: Boolean(options.preserveScroll) });
    if (!isCurrent()) return false;
    const cancelSkeleton = scheduleSkeleton(() => {
      if (!isCurrent() || !state.currentStoreLoading) return;
      state.currentStoreSkeletonVisible = true;
      renderStorefront();
    });
    const [result, catalogue] = await Promise.all([
      api('/api/vendors/' + encodeURIComponent(storeId) + '/ratings'),
      api('/api/products?page=1&limit=' + state.currentStoreLimit + '&vendor_id=' + encodeURIComponent(storeId))
    ]);
    if (!isCurrent()) { cancelSkeleton(); return false; }
    cancelSkeleton();
    state.currentStoreSkeletonVisible = false;
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
    state.currentStoreSkeletonVisible = false;
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
  if (state.currentStoreLoading && !state.currentStoreSkeletonVisible) return;
  if (state.currentStoreLoading) {
    const bar = (width, height, extra = '') => `<span class="skeleton store-sk-bar ${extra}" style="width:${width};height:${height}px" aria-hidden="true"></span>`;
    root.innerHTML = `<div class="storefront-skeleton" role="status" aria-label="កំពុងផ្ទុកព័ត៌មានហាង">
      <section class="storefront-public store-sk-shell">
        <div class="skeleton store-sk-cover"></div>
        <div class="store-sk-profile"><span class="skeleton store-sk-avatar"></span><div class="store-sk-identity">
          ${bar('42%',18)}${bar('64%',8)}${bar('82%',8)}
        </div></div>
        <div class="store-sk-stats">${Array.from({length:4},()=>`<div>${bar('48%',15)}${bar('72%',7)}</div>`).join('')}</div>
      </section>
      <div class="store-sk-toolbar">${bar('32%',34)}${bar('44%',30)}${bar('14%',10)}</div>
      <section class="storefront-products-section"><div class="storefront-section-heading"><h2>ទំនិញក្នុងហាង</h2></div>
        <div class="storefront-skeleton-grid">${Array.from({length:8},()=>`<div class="storefront-skeleton-card"><span class="skeleton"></span>${bar('82%',10)}${bar('48%',9)}${bar('36%',8)}</div>`).join('')}</div>
      </section>
      <section class="storefront-reviews"><div class="storefront-section-heading"><h2>មតិយោបល់ពីអ្នកទិញ</h2></div>
        <div class="store-sk-review-list">${Array.from({length:2},()=>`<div>${bar('26%',9)}${bar('18%',8)}${bar('84%',8)}${bar('62%',8)}</div>`).join('')}</div>
      </section>
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
          <div class="storefront-title-line"><h1>${esc(data.store_name || 'ហាងអ្នកលក់')}</h1>${data.verified ? verifiedStoreBadge(data.id, true) : ''}<button type="button" class="storefront-chat-button" data-store-chat>${ic('chat', 15)}<span>ឆាតជាមួយហាង</span></button></div>
          <p class="storefront-meta"><span>${esc(data.store_location || 'កម្ពុជា')}</span>
            <span>${Number(data.active_listings || 0)} មុខទំនិញ</span>
            <span>${rating ? '★ ' + esc(ratingLabel) : 'មិនទាន់មានពិន្ទុ'} (${reviewCount} ពិនិត្យ)</span>
          </p>
          <p class="storefront-shop-id"><span>Shop ID</span> <code>${esc(data.public_shop_id || '—')}</code></p>
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
      <span class="storefront-result-count" id="storeResultCount">${visible.length} / ${state.currentStoreTotal} មុខទំនិញ</span>
    </section>
    <section class="storefront-products-section">
      <div class="storefront-section-heading"><h2>ទំនិញក្នុងហាង</h2><span id="storeProductCount">${visible.length} មុខ</span></div>
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
    updateStorefrontProductResults();
  });
  $('storeCategoryFilters')?.addEventListener('click', event => {
    const button = event.target.closest('[data-store-category]');
    if (button) { state.currentStoreCategory = button.dataset.storeCategory; renderStorefront(); }
  });
}

function updateStorefrontProductResults() {
  const root = $('storefrontContent');
  const section = root?.querySelector('.storefront-products-section');
  if (!section) return;
  const query = state.currentStoreSearch.trim().toLowerCase();
  const visible = state.currentStoreProducts.filter(product =>
    (state.currentStoreCategory === 'all' || product.category === state.currentStoreCategory) &&
    (!query || (String(product.title || '') + ' ' + String(product.description || '')).toLowerCase().includes(query))
  );
  const current = section.querySelector('#storeProductGrid, .storefront-empty');
  if (visible.length) {
    const markup = '<div id="storeProductGrid">' + visible.map(productCard).join('') + '</div>';
    if (current?.id === 'storeProductGrid') current.innerHTML = visible.map(productCard).join('');
    else if (current) current.outerHTML = markup;
    else section.insertAdjacentHTML('beforeend', markup);
  } else {
    const markup = '<div class="storefront-empty"><span>' + ic('package', 30) + '</span><strong>មិនមានទំនិញដែលត្រូវនឹងការស្វែងរកទេ</strong><p>សូមសាកល្បងពាក្យស្វែងរក ឬប្រភេទទំនិញផ្សេងទៀត។</p></div>';
    if (current) current.outerHTML = markup;
    else section.insertAdjacentHTML('beforeend', markup);
  }
  const resultCount = $('storeResultCount');
  const productCount = $('storeProductCount');
  if (resultCount) resultCount.textContent = visible.length + ' / ' + state.currentStoreTotal + ' មុខទំនិញ';
  if (productCount) productCount.textContent = visible.length + ' មុខ';
}

function handleStorefrontAction(event) {
  if (event.target.closest('[data-store-retry]')) {
    void openStorefront(state.currentStoreId, { preserveScroll: true });
    return;
  }
  if (event.target.closest('[data-store-load-more]')) { void loadMoreStoreProducts(); return; }
  if (event.target.closest('[data-store-chat]')) { void startStoreChat(state.currentStoreId); return; }
  const heart = event.target.closest('[data-action="save"]');
  if (heart) { event.preventDefault(); event.stopPropagation(); saveAction(heart.dataset.id, heart); return; }
  const view = event.target.closest('[data-action="view"]');
  if (view) void openProduct(view.dataset.id);
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
  $('profileHeadingMeta').textContent = state.session.user.phone || (isInternalAuthEmail(state.session.user.email) ? '' : state.session.user.email) || 'សមាជិក 7inOne';

  const badges = [];
  if (isAdmin()) badges.push(`<span class="account-role-chip bg-violet-50 text-violet-700">${ic('shield', 12)} អ្នកគ្រប់គ្រង</span>`);
  if (isVerifiedSeller()) badges.push(`<span class="account-role-chip bg-sky-50 text-sky-700">${ic('checkcircle', 12)} អ្នកលក់បានផ្ទៀងផ្ទាត់</span>`);
  else if (isSellerAccount()) badges.push(`<span class="account-role-chip bg-amber-50 text-amber-700">${ic('store', 12)} អ្នកលក់ទូទៅ</span>`);
  $('profileSellerBadge').innerHTML = badges.join('');

  const cover = $('view-profile').querySelector('.cover');
  setProfileCover(cover, p.cover_url || '');
  $('profileApplyTop').textContent = state.me.vendor ? 'មើលស្ថានភាពហាង' : 'បើកហាងលក់នៅ 7inOne';
  await renderProfileTab();
}

function renderProfileTabSkeleton() {
  const root = $('profileTabContent');
  if (!root) return;
  const bar = (width, height) => `<span class="skeleton profile-sk-bar" style="width:${width};height:${height}px" aria-hidden="true"></span>`;
  root.innerHTML = `<div class="profile-sk-list" role="status" aria-label="កំពុងផ្ទុកព័ត៌មាន">
    ${Array.from({length:3},()=>`<div class="profile-sk-card"><span class="skeleton profile-sk-thumb"></span><div>${bar('76%',10)}${bar('54%',8)}${bar('38%',8)}</div></div>`).join('')}
  </div>`;
}
async function renderProfileTab() {
  if (!state.session) return;
  const cancelSkeleton = scheduleSkeleton(renderProfileTabSkeleton);
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
    } else if (state.profileTab === 'my-posts') {
      await renderMyPosts();
    } else {
      const v = state.me.vendor;
      $('profileTabContent').innerHTML = v
        ? `<div class="rounded-2xl border border-slate-100 p-4"><b class="text-sm">${esc(v.store_name)}</b><p class="mt-1 text-xs text-slate-500">${esc(v.description || '')}<br>${esc(v.contact_phone || '')} · ${esc(v.address || '')}</p></div>`
        : `<div class="rounded-2xl bg-emerald-50 p-4"><b class="text-xs">ចុះឈ្មោះក្លាយជាអ្នកលក់</b><p class="mt-1 text-[11px] text-slate-600">បញ្ចូលព័ត៌មានហាង ដើម្បីចាប់ផ្តើមដាក់លក់។</p><button id="applySellerFromTab" class="mt-3 rounded-full brand-gradient px-5 py-2 text-[11px] font-bold text-white">ចុះឈ្មោះអ្នកលក់</button></div>`;
      $('applySellerFromTab')?.addEventListener('click', openSellerModal);
    }
  } catch (e) {
    $('profileTabContent').innerHTML = `<p class="text-xs text-rose-600">${esc(e.message)}</p>`;
  } finally {
    cancelSkeleton();
  }
}


async function renderMyPosts() {
  const result = await api('/api/my-posts');
  state.myPosts = result.data || [];
  state.myPostEditing = null;
  $('profileActivityCount').textContent = `${state.myPosts.length} ប្រកាស`;
  $('profileTabContent').innerHTML = `
    <div class="space-y-3">
      <div class="flex flex-wrap gap-2">
        <input id="myPostsSearch" class="field min-w-[180px] flex-1" type="search" placeholder="ស្វែងរកប្រកាស..." />
        <select id="myPostsFilter" class="field w-auto min-w-[145px]">
          <option value="all">គ្រប់ប្រភេទ</option>
          <option value="product">ផលិតផល</option>
          <option value="job">ការងារ</option>
          <option value="property">អចលនទ្រព្យ</option>
          <option value="rental">ផ្ទះ/បន្ទប់ជួល</option>
          <option value="land">ដី</option>
          <option value="house_sale">ផ្ទះលក់</option>
          <option value="social_post">Community Post</option>
          <option value="story">Story</option>
        </select>
      </div>
      <div id="myPostsList" class="space-y-3"></div>
    </div>`;
  $('myPostsSearch')?.addEventListener('input', renderMyPostsList);
  $('myPostsFilter')?.addEventListener('change', renderMyPostsList);
  renderMyPostsList();
}

function renderMyPostSimpleEditForm(post) {
  return `
    <form data-my-post-edit-form data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="mt-3 grid gap-2 rounded-xl bg-slate-50 p-3">
      ${post.type === 'social_post'
        ? `<label class="text-[10px] font-semibold">Caption<textarea name="caption" class="field mt-1" maxlength="500" rows="3">${esc(post.caption || '')}</textarea></label>`
        : `<label class="text-[10px] font-semibold">ចំណងជើង<input name="title" class="field mt-1" maxlength="160" required value="${esc(post.title || '')}"></label>
           <label class="text-[10px] font-semibold">ពិពណ៌នា<textarea name="description" class="field mt-1" rows="3" maxlength="5000">${esc(post.description || '')}</textarea></label>
           <label class="text-[10px] font-semibold">ទីតាំង<input name="location" class="field mt-1" maxlength="300" value="${esc(post.location || '')}"></label>
           <label class="text-[10px] font-semibold">YouTube Video Link<input name="youtube_video_url" class="field mt-1" type="url" maxlength="1000" value="${esc(post.youtube_video_url || '')}"></label>
           ${post.type === 'job'
             ? `<div class="grid grid-cols-2 gap-2"><label class="text-[10px]">ប្រាក់ខែចាប់ពី<input name="salary_min" class="field mt-1" type="number" min="0" step="any" value="${esc(post.salary_min ?? '')}"></label><label class="text-[10px]">ប្រាក់ខែដល់<input name="salary_max" class="field mt-1" type="number" min="0" step="any" value="${esc(post.salary_max ?? '')}"></label></div>`
             : post.type === 'product'
               ? `<div class="grid grid-cols-2 gap-2"><label class="text-[10px]">តម្លៃ<input name="price" class="field mt-1" type="number" min="0" step="any" value="${esc(post.price ?? 0)}"></label><label class="text-[10px]">ស្តុក<input name="stock" class="field mt-1" type="number" min="0" step="1" value="${esc(post.stock ?? 0)}"></label></div>`
               : `<label class="text-[10px]">តម្លៃ<input name="price" class="field mt-1" type="number" min="0" step="any" value="${esc(post.price ?? post.rent_amount ?? '')}"></label>`}`}
      <div class="flex justify-end gap-2"><button type="button" data-my-post-action="cancel" data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="rounded-full border border-slate-200 px-4 py-2 text-[10px] font-bold">បោះបង់</button><button type="submit" class="brand-gradient rounded-full px-4 py-2 text-[10px] font-bold text-white">រក្សាទុក</button></div>
    </form>`;
}

function renderMyPostFullEditForm(post) {
  const isJob = post.type === 'job';
  const categories = Object.entries(isJob ? LISTING_TAXONOMY.jobs : LISTING_TAXONOMY.properties);
  const hasCurrentCategory = categories.some(([key]) => key === String(post.category || ''));
  const currentCategoryOption = post.category && !hasCurrentCategory ? `<option value="${esc(post.category)}" selected>${esc(post.category)}</option>` : '';
  const categoryOptions = currentCategoryOption + categories.map(([key, item]) => `<option value="${esc(key)}" ${post.category === key ? 'selected' : ''}>${esc(item.label || item.name || key)}</option>`).join('');
  const images = Array.isArray(post.image_items) ? post.image_items : [];
  const specs = post.specifications && typeof post.specifications === 'object' ? { ...post.specifications } : {};
  const googleMapUrl = specs.google_map_url || '';
  delete specs.google_map_url;
  const imageMarkup = images.map((image, index) => `<label class="my-post-image-choice"><img src="${esc(image.image_url)}" alt="រូបភាព ${index + 1}" loading="lazy"><span><input type="checkbox" data-keep-listing-image value="${esc(image.key)}" checked> រក្សារូបនេះ</span></label>`).join('');
  return `
    <form data-my-post-edit-form data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="my-post-full-edit-form mt-3 grid gap-3 rounded-xl p-3">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="sm:col-span-2"><span class="label">${isJob ? 'មុខតំណែង / Job Title' : 'ចំណងជើងអចលនទ្រព្យ'} *</span><input name="title" class="field mt-1" maxlength="160" required value="${esc(post.title || '')}"></label>
        <label><span class="label">${isJob ? 'ប្រភេទការងារ' : 'ប្រភេទអចលនទ្រព្យ'} *</span><select name="category" class="field mt-1" required>${categoryOptions}</select></label>
        ${isJob ? `<label><span class="label">ក្រុមហ៊ុន / អ្នកជ្រើសរើស</span><input name="company_name" class="field mt-1" maxlength="160" value="${esc(post.company_name || '')}"></label>` : ''}
        <label><span class="label">ផ្នែករង</span><input name="subcategory" class="field mt-1" maxlength="120" value="${esc(post.subcategory || '')}"></label>
        <label><span class="label">ប្រភេទលម្អិត</span><input name="detail_type" class="field mt-1" maxlength="120" value="${esc(post.detail_type || '')}"></label>
        <label class="sm:col-span-2"><span class="label">ទីតាំង</span><input name="location" class="field mt-1" maxlength="120" value="${esc(post.location || '')}"></label>
        ${isJob
          ? `<label><span class="label">ចំនួនត្រូវជ្រើសរើស</span><input name="vacancies" class="field mt-1" type="number" min="1" max="999" value="${esc(post.vacancies ?? 1)}"></label>
             <label><span class="label">ប្រភេទការងារ</span><select name="employment_type" class="field mt-1"><option value="full_time" ${post.employment_type === 'full_time' ? 'selected' : ''}>ពេញម៉ោង</option><option value="part_time" ${post.employment_type === 'part_time' ? 'selected' : ''}>ក្រៅម៉ោង</option><option value="contract" ${post.employment_type === 'contract' ? 'selected' : ''}>កិច្ចសន្យា</option><option value="internship" ${post.employment_type === 'internship' ? 'selected' : ''}>ហាត់ការ</option><option value="freelance" ${post.employment_type === 'freelance' ? 'selected' : ''}>Freelance</option></select></label>
             <label><span class="label">ប្រាក់ខែចាប់ពី (USD)</span><input name="salary_min" class="field mt-1" type="number" min="0" step="any" value="${esc(post.salary_min ?? '')}"></label>
             <label><span class="label">ប្រាក់ខែដល់ (USD)</span><input name="salary_max" class="field mt-1" type="number" min="0" step="any" value="${esc(post.salary_max ?? '')}"></label>
             <label><span class="label">របៀបបង្ហាញប្រាក់ខែ</span><select name="salary_period" class="field mt-1"><option value="monthly" ${post.salary_period === 'monthly' ? 'selected' : ''}>ប្រចាំខែ</option><option value="daily" ${post.salary_period === 'daily' ? 'selected' : ''}>ប្រចាំថ្ងៃ</option><option value="hourly" ${post.salary_period === 'hourly' ? 'selected' : ''}>ប្រចាំម៉ោង</option><option value="negotiable" ${post.salary_period === 'negotiable' ? 'selected' : ''}>ចរចា</option></select></label>
             <label><span class="label">ម៉ោងធ្វើការ</span><input name="work_schedule" class="field mt-1" value="${esc(post.work_schedule || '')}"></label>
             <label><span class="label">ថ្ងៃឈប់សម្រាក</span><input name="days_off" class="field mt-1" value="${esc(post.days_off || '')}"></label>
             <label><span class="label">បទពិសោធន៍</span><input name="experience" class="field mt-1" value="${esc(post.experience || '')}"></label>
             <label><span class="label">កម្រិតសិក្សា</span><input name="education" class="field mt-1" value="${esc(post.education || '')}"></label>
             <label class="sm:col-span-2"><span class="label">ជំនាញ (បំបែកដោយក្បៀស)</span><input name="skills_text" class="field mt-1" value="${esc(Array.isArray(post.skills) ? post.skills.join(', ') : '')}"></label>
             <label class="sm:col-span-2"><span class="label">ភាសា (បំបែកដោយក្បៀស)</span><input name="languages_text" class="field mt-1" value="${esc(Array.isArray(post.languages) ? post.languages.join(', ') : '')}"></label>
             <label class="sm:col-span-2"><span class="label">អត្ថប្រយោជន៍ (បំបែកដោយក្បៀស)</span><input name="benefits_text" class="field mt-1" value="${esc(Array.isArray(post.benefits) ? post.benefits.join(', ') : '')}"></label>`
          : `<label><span class="label">តម្លៃ (USD)</span><input name="price" class="field mt-1" type="number" min="0" step="any" value="${esc(post.price ?? '')}"></label>
             <label><span class="label">របៀបកំណត់តម្លៃ</span><select name="price_period" class="field mt-1"><option value="total" ${post.price_period === 'total' ? 'selected' : ''}>តម្លៃសរុប</option><option value="monthly" ${post.price_period === 'monthly' ? 'selected' : ''}>ប្រចាំខែ</option><option value="daily" ${post.price_period === 'daily' ? 'selected' : ''}>ប្រចាំថ្ងៃ</option><option value="yearly" ${post.price_period === 'yearly' ? 'selected' : ''}>ប្រចាំឆ្នាំ</option><option value="negotiable" ${post.price_period === 'negotiable' ? 'selected' : ''}>ចរចា</option></select></label>
             <label><span class="label">ទំហំ (m²)</span><input name="area_sqm" class="field mt-1" type="number" min="0" step="any" value="${esc(post.area_sqm ?? '')}"></label>
             <label><span class="label">បន្ទប់គេង</span><input name="bedrooms" class="field mt-1" type="number" min="0" step="1" value="${esc(post.bedrooms ?? '')}"></label>
             <label><span class="label">បន្ទប់ទឹក</span><input name="bathrooms" class="field mt-1" type="number" min="0" step="1" value="${esc(post.bathrooms ?? '')}"></label>
             <label><span class="label">អាសយដ្ឋានលម្អិត</span><input name="address" class="field mt-1" maxlength="300" value="${esc(post.address || '')}"></label>`}
        <label class="sm:col-span-2"><span class="label">YouTube Video Link</span><input name="youtube_video_url" class="field mt-1" type="url" maxlength="1000" value="${esc(post.youtube_video_url || '')}"></label>
        <label class="sm:col-span-2"><span class="label">Google Maps Link</span><input name="google_map_url" class="field mt-1" type="url" maxlength="1000" value="${esc(googleMapUrl)}"></label>
        <label class="sm:col-span-2"><span class="label">ការពិពណ៌នាសង្ខេប</span><textarea name="short_description" class="field mt-1" rows="2" maxlength="300">${esc(post.short_description || '')}</textarea></label>
        <label class="sm:col-span-2"><span class="label">ការពិពណ៌នាលម្អិត *</span><textarea name="description" class="field mt-1" rows="5" maxlength="5000" required>${esc(post.description || '')}</textarea></label>
        <input type="hidden" name="specifications" value="${esc(JSON.stringify(specs))}">
        <input type="hidden" name="keep_image_message_ids" value="[]">
      </div>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <label><span class="label">Province Code</span><input name="province_code" class="field mt-1" maxlength="2" value="${esc(post.province_code || '')}"></label>
        <label><span class="label">District Code</span><input name="district_code" class="field mt-1" maxlength="4" value="${esc(post.district_code || '')}"></label>
        <label><span class="label">Commune Code</span><input name="commune_code" class="field mt-1" maxlength="6" value="${esc(post.commune_code || '')}"></label>
        <label><span class="label">Village Code</span><input name="village_code" class="field mt-1" maxlength="8" value="${esc(post.village_code || '')}"></label>
      </div>
      <div class="grid gap-2">
        <span class="label">រូបភាពបច្ចុប្បន្ន · ដោះធីករូបដែលចង់លុប</span>
        <div class="my-post-image-grid">${imageMarkup || '<span class="text-[10px] text-slate-400">មិនទាន់មានរូបភាព</span>'}</div>
        <label><span class="label">បន្ថែមរូបភាព (JPG / PNG / WEBP · 8MB/រូប · អតិបរមា ១០ រូបសរុប)</span><input class="field mt-1" type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple></label>
      </div>
      <div class="flex justify-end gap-2"><button type="button" data-my-post-action="cancel" data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="rounded-full border border-slate-200 px-4 py-2 text-[10px] font-bold">បោះបង់</button><button type="submit" class="brand-gradient rounded-full px-4 py-2 text-[10px] font-bold text-white">រក្សាទុកព័ត៌មានទាំងអស់</button></div>
    </form>`;
}

function renderMyPostLegacyRealEstateEditForm(post) {
  const categories = Object.entries(LISTING_TAXONOMY.properties);
  const hasCurrentCategory = categories.some(([key]) => key === String(post.category || ''));
  const currentCategoryOption = post.category && !hasCurrentCategory ? `<option value="${esc(post.category)}" selected>${esc(post.category)}</option>` : '';
  const categoryOptions = currentCategoryOption + categories.map(([key, item]) => `<option value="${esc(key)}" ${post.category === key ? 'selected' : ''}>${esc(item.label || item.name || key)}</option>`).join('');
  const image = (post.image_items || [])[0];
  const isRental = post.type === 'rental';
  const isLand = post.type === 'land';
  return `
    <form data-my-post-edit-form data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="my-post-full-edit-form mt-3 grid gap-3 rounded-xl p-3">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="sm:col-span-2"><span class="label">ចំណងជើងប្រកាស *</span><input name="title" class="field mt-1" maxlength="160" required value="${esc(post.title || '')}"></label>
        <label><span class="label">ប្រភេទអចលនទ្រព្យ</span><select name="category" class="field mt-1">${categoryOptions}</select></label>
        <label><span class="label">ទីតាំង</span><input name="location" class="field mt-1" maxlength="120" value="${esc(post.location || '')}"></label>
        <label class="sm:col-span-2"><span class="label">អាសយដ្ឋានលម្អិត</span><input name="address" class="field mt-1" maxlength="300" value="${esc(post.address || '')}"></label>
        <label><span class="label">តម្លៃ (USD)</span><input name="price" class="field mt-1" type="number" min="0" step="any" value="${esc(post.price ?? post.rent_amount ?? '')}"></label>
        ${isRental ? `<label><span class="label">រយៈពេលជួល</span><select name="rent_period" class="field mt-1"><option value="monthly" ${post.rent_period === 'monthly' ? 'selected' : ''}>ប្រចាំខែ</option><option value="daily" ${post.rent_period === 'daily' ? 'selected' : ''}>ប្រចាំថ្ងៃ</option><option value="yearly" ${post.rent_period === 'yearly' ? 'selected' : ''}>ប្រចាំឆ្នាំ</option></select></label>` : ''}
        ${!isLand ? `<label><span class="label">ប្រភេទអចលនទ្រព្យលម្អិត</span><input name="property_type" class="field mt-1" value="${esc(post.property_type || '')}"></label>` : `<label><span class="label">ប្រភេទដី</span><input name="land_type" class="field mt-1" value="${esc(post.land_type || '')}"></label>`}
        <label><span class="label">ទំហំ (m²)</span><input name="area_sqm" class="field mt-1" type="number" min="0" step="any" value="${esc(post.area_sqm ?? '')}"></label>
        ${!isLand ? `<label><span class="label">បន្ទប់គេង</span><input name="bedrooms" class="field mt-1" type="number" min="0" step="1" value="${esc(post.bedrooms ?? '')}"></label><label><span class="label">បន្ទប់ទឹក</span><input name="bathrooms" class="field mt-1" type="number" min="0" step="1" value="${esc(post.bathrooms ?? '')}"></label><label><span class="label">គ្រឿងសង្ហារិម</span><input name="furnished" class="field mt-1" value="${esc(post.furnished || '')}"></label>` : `<label><span class="label">ប្លង់កម្មសិទ្ធិ</span><input name="title_deed" class="field mt-1" value="${esc(post.title_deed || '')}"></label><label><span class="label">ផ្លូវចូល</span><input name="road_access" class="field mt-1" value="${esc(post.road_access || '')}"></label>`}
        ${!isLand && !isRental ? `<label><span class="label">ប្លង់កម្មសិទ្ធិ</span><input name="title_deed" class="field mt-1" value="${esc(post.title_deed || '')}"></label>` : ''}
        <label class="sm:col-span-2"><span class="label">YouTube Video Link</span><input name="youtube_video_url" class="field mt-1" type="url" maxlength="1000" value="${esc(post.youtube_video_url || '')}"></label>
        <label class="sm:col-span-2"><span class="label">ការពិពណ៌នាលម្អិត *</span><textarea name="description" class="field mt-1" rows="5" maxlength="5000" required>${esc(post.description || '')}</textarea></label>
        <input type="hidden" name="keep_image_message_ids" value="[]">
      </div>
      <div class="grid gap-2">
        <span class="label">រូបភាពបច្ចុប្បន្ន · ដោះធីកដើម្បីលុប</span>
        <div class="my-post-image-grid">${image ? `<label class="my-post-image-choice"><img src="${esc(image.image_url)}" alt="រូបភាពបច្ចុប្បន្ន"><span><input type="checkbox" data-keep-listing-image value="${esc(image.key)}" checked> រក្សារូបនេះ</span></label>` : '<span class="text-[10px] text-slate-400">មិនទាន់មានរូបភាព</span>'}</div>
        <label><span class="label">ជ្រើសរើសរូបថ្មី (JPG / PNG / WEBP · 8MB)</span><input class="field mt-1" type="file" name="image" accept="image/jpeg,image/png,image/webp"></label>
      </div>
      <div class="flex justify-end gap-2"><button type="button" data-my-post-action="cancel" data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="rounded-full border border-slate-200 px-4 py-2 text-[10px] font-bold">បោះបង់</button><button type="submit" class="brand-gradient rounded-full px-4 py-2 text-[10px] font-bold text-white">រក្សាទុកព័ត៌មានទាំងអស់</button></div>
    </form>`;
}

function renderMyPostsList() {
  const target = $('myPostsList');
  if (!target) return;
  const term = String($('myPostsSearch')?.value || '').trim().toLowerCase();
  const filter = $('myPostsFilter')?.value || 'all';
  const rows = state.myPosts.filter(post =>
    (filter === 'all' || post.type === filter) &&
    (!term || String(post.title || post.caption || '').toLowerCase().includes(term) ||
      String(post.description || '').toLowerCase().includes(term))
  );
  target.innerHTML = rows.map(post => {
    const key = post.type + ':' + post.id;
    const editing = state.myPostEditing === key;
    const status = post.status === 'active' ? 'កំពុងផ្សាយ'
      : ['expired','archived'].includes(post.status) ? 'ផុតសុពលភាព'
      : post.status === 'sold' ? 'លក់រួច' : post.status === 'rented' ? 'ជួលរួច'
      : post.status === 'closed' ? 'បានបិទ' : post.status;
    const amount = post.price ?? post.rent_amount ?? post.salary_min;
    const image = post.image_url ? `<img src="${esc(post.image_url)}" alt="" class="h-16 w-16 shrink-0 rounded-xl object-cover">` : `<div class="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-400">${ic('image',20)}</div>`;
    const editForm = editing ? (['job','property'].includes(post.type) ? renderMyPostFullEditForm(post) : ['rental','land','house_sale'].includes(post.type) ? renderMyPostLegacyRealEstateEditForm(post) : renderMyPostSimpleEditForm(post)) : '';
    return `
      <article class="rounded-2xl border border-slate-100 bg-white p-3" data-my-post-card="${esc(key)}">
        <div class="flex items-start gap-3">
          ${image}
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2"><span class="text-[9px] font-bold text-slate-500">${esc(post.type_label || post.type)}</span><span class="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-600">${esc(status)}</span></div>
            <b class="mt-1 block truncate text-xs">${esc(post.title || post.caption || 'Story')}</b>
            <p class="mt-1 line-clamp-2 text-[10px] text-slate-500">${esc(post.description || post.caption || '')}</p>
            <div class="mt-1 text-[9px] text-slate-400">${post.created_at ? fmtDate(post.created_at) : ''}${amount != null ? ' · ' + money(amount) : ''}</div>
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          ${post.editable ? `<button type="button" data-my-post-action="edit" data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="rounded-full border border-slate-200 px-3 py-2 text-[9px] font-bold text-slate-700">កែប្រែ</button>` : ''}
          ${post.renewable ? `<button type="button" data-my-post-action="renew" data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="rounded-full bg-emerald-50 px-3 py-2 text-[9px] font-bold text-emerald-700">Renew</button>` : ''}
          ${post.type !== 'social_post' && post.status === 'active' ? `<button type="button" data-my-post-action="expire" data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="rounded-full bg-amber-50 px-3 py-2 text-[9px] font-bold text-amber-700">Expire</button>` : ''}
          <button type="button" data-my-post-action="delete" data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="rounded-full bg-rose-50 px-3 py-2 text-[9px] font-bold text-rose-700">លុប</button>
        </div>
        ${editForm}
      </article>`;
  }).join('') || '<div class="py-10 text-center text-xs text-slate-400">មិនទាន់មានប្រកាសក្នុងប្រភេទនេះទេ។</div>';
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

function revokeProductImagePreviews() {
  (state.selectedProductImages || []).forEach((item) => {
    if (item.kind === 'new' && item.previewUrl) URL.revokeObjectURL(item.previewUrl);
  });
}
function syncProductImageFileInput() {
  const input = $('productImage');
  if (!input) return;
  const transfer = new DataTransfer();
  (state.selectedProductImages || []).filter((item) => item.kind === 'new').forEach((item) => transfer.items.add(item.file));
  input.files = transfer.files;
}
function updateProductYoutubePreview() {
  const input = $('productYoutubeVideoUrl');
  const preview = $('productYoutubePreview');
  if (!input || !preview) return;
  const value = input.value.trim();
  const videoId = youtubeVideoId(value);
  if (!value) {
    preview.classList.add('hidden');
    preview.innerHTML = '';
    return;
  }
  preview.classList.remove('hidden');
  preview.innerHTML = videoId
    ? `<div class="product-youtube-preview-head"><span>${ic('play',15)} YouTube Preview</span><small>បង្ហាញជាមួយ Gallery ផលិតផល</small></div><div class="product-youtube-preview-frame">${productGalleryVideoFrameMarkup(videoId, $('productTitle')?.value || 'Product video', false)}</div>`
    : '<p class="product-youtube-preview-invalid">សូមបញ្ចូល YouTube Link ដែលមានទម្រង់ត្រឹមត្រូវ។</p>';
}

function renderProductImageAlbum() {
  const album = $('productImageAlbum');
  const images = state.selectedProductImages || [];
  if (!album) return;
  $('productImageName').textContent = images.length ? (images.length + ' / ១០ រូបបានជ្រើសរើស') : 'ជ្រើសរើសរូបភាពផលិតផល';
  album.innerHTML = images.length ? images.map((item, index) => {
    const src = item.kind === 'new' ? item.previewUrl : item.image_url;
    const main = index === 0;
    return '<div class="product-album-item ' + (main ? 'is-main' : '') + '">' +
      '<img src="' + esc(src) + '" alt="រូបភាពផលិតផល ' + (index + 1) + '">' +
      (main ? '<span class="product-album-main-badge">រូបមេ</span>' : '') +
      '<span class="product-album-index">' + (index + 1) + '</span>' +
      (main ? '<span class="product-album-main-label">រូបមេដែលបានជ្រើស</span>' : '<button type="button" class="product-album-set-main" data-product-image-main="' + index + '">កំណត់ជារូបមេ</button>') +
      '<button type="button" class="product-album-remove" data-product-image-remove="' + index + '" aria-label="លុបរូបភាព">' + ic('x', 14) + '</button></div>';
  }).join('') : '<div class="product-album-empty"><span>' + ic('images', 25) + '</span><b>មិនទាន់មានរូបភាពទេ</b><small>ជ្រើសរើសរូបភាពរហូតដល់ ១០ រូប</small></div>';
  document.querySelector('.product-album-picker')?.classList.toggle('is-full', images.length >= 10);
  $('productImage').disabled = images.length >= 10;
}

const listingImageAlbums = new WeakMap();
function listingAlbumRoot(kind) { return document.querySelector('[data-listing-image-album="'+kind+'"]'); }
function revokeListingAlbum(kind) {
  const root=listingAlbumRoot(kind); const items=root?listingImageAlbums.get(root)||[]:[];
  items.forEach(item=>{if(item.previewUrl)URL.revokeObjectURL(item.previewUrl);});
  if(root){listingImageAlbums.set(root,[]);renderListingAlbum(root);}
}
function renderListingAlbum(root) {
  if(!root)return;
  const items=listingImageAlbums.get(root)||[];
  const count=root.querySelector('[data-listing-image-count]');
  const grid=root.querySelector('[data-listing-image-grid]');
  const input=root.querySelector('[data-listing-image-input]');
  if(count)count.textContent=items.length+' / ១០ រូបបានជ្រើសរើស';
  if(grid)grid.innerHTML=items.length?items.map((item,index)=>'<div class="product-album-item '+(index===0?'is-main':'')+'"><img src="'+esc(item.previewUrl)+'" alt="រូបភាព '+(index+1)+'">'+(index===0?'<span class="product-album-main-badge">រូបមេ</span>':'<button type="button" class="product-album-set-main" data-listing-image-main="'+index+'">កំណត់ជារូបមេ</button>')+'<span class="product-album-index">'+(index+1)+'</span><button type="button" class="product-album-remove" data-listing-image-remove="'+index+'" aria-label="លុបរូបភាព">'+ic('x',14)+'</button></div>').join(''):'<div class="product-album-empty"><span>▧</span><b>មិនទាន់មានរូបភាពទេ</b><small>ជ្រើសរើសរូបភាពរហូតដល់ ១០ រូប</small></div>';
  root.querySelector('[data-listing-image-picker]')?.classList.toggle('is-full',items.length>=10);
  if(input)input.disabled=items.length>=10;
}
function bindListingImageAlbums() {
  document.querySelectorAll('[data-listing-image-album]').forEach(root=>{
    if(root.dataset.albumBound==='true')return;
    listingImageAlbums.set(root,[]);
    const input=root.querySelector('[data-listing-image-input]');
    input?.addEventListener('change',()=>{
      const items=listingImageAlbums.get(root)||[];
      const allowed=new Set(['image/jpeg','image/png','image/webp']);
      for(const file of Array.from(input.files||[])){
        if(!allowed.has(file.type)){toast('សូមប្រើ JPG, PNG ឬ WEBP ប៉ុណ្ណោះ។','error');continue;}
        if(file.size>8*1024*1024){toast('រូបភាពនីមួយៗមិនអាចធំជាង 8MB បានទេ។','error');continue;}
        if(items.length>=10){toast('អាចដាក់រូបភាពបានអតិបរមា ១០ រូប។','error');break;}
        items.push({file,previewUrl:URL.createObjectURL(file)});
      }
      listingImageAlbums.set(root,items);renderListingAlbum(root);input.value='';
    });
    root.querySelector('[data-listing-image-grid]')?.addEventListener('click',event=>{
      const main=event.target.closest('[data-listing-image-main]');
      const remove=event.target.closest('[data-listing-image-remove]');
      const items=listingImageAlbums.get(root)||[];
      if(main){const index=Number(main.dataset.listingImageMain);if(items[index])items.unshift(items.splice(index,1)[0]);}
      if(remove){const index=Number(remove.dataset.listingImageRemove);const item=items[index];if(item?.previewUrl)URL.revokeObjectURL(item.previewUrl);items.splice(index,1);}
      listingImageAlbums.set(root,items);renderListingAlbum(root);
    });
    root.dataset.albumBound='true';renderListingAlbum(root);
  });
}

/* --------------------------------------------------------------------------
   Unified listing creation: jobs and real estate are isolated from products.
   Extend this registry as new marketplace categories are introduced.
   -------------------------------------------------------------------------- */

const PRODUCT_TAXONOMY = {
  phones: {
    subs: ['ស្មាតហ្វូន','Tablet & iPad','កុំព្យូទ័រ និង Laptop','Computer Hardware','គ្រឿងបន្លាស់ទូរស័ព្ទ','កាមេរ៉ា','សំឡេង និង Audio','Gaming','Network & Internet','Printer & Scanner','Software & License','ឧបករណ៍អេឡិចត្រូនិកផ្សេងៗ'],
    details: ['iPhone','Samsung Galaxy','Xiaomi / Redmi','OPPO','Vivo','Huawei','iPad','Android Tablet','Laptop','Desktop PC','CPU','RAM','GPU / VGA','Motherboard','HDD','SATA SSD','NVMe / M.2 SSD','External SSD','USB Flash Drive','Power Supply','Monitor','Keyboard','Mouse','Webcam','Router','Switch','Printer','Scanner','Headphones','Speaker','Camera Lens','Gaming Console','Software License']
  },
  vehicles: {
    subs: ['រថយន្ត','ម៉ូតូ','ម៉ូតូកង់បី','រថយន្តដឹកទំនិញ','កង់','គ្រឿងបន្លាស់ និង Accessories'],
    details: ['Sedan','SUV','Crossover','Pickup','Van','Luxury Car','Electric Car','Hybrid Car','Sport Motorcycle','Scooter','Underbone','Tuk Tuk','Truck','Bus','Bicycle','Engine Parts','Tires & Wheels','Battery','Accessories']
  },
  property: {
    subs: ['ផ្ទះ','ដី','ខុនដូ','អាផាតមិន','អគារពាណិជ្ជកម្ម'],
    details: ['ផ្ទះលក់','ផ្ទះជួល','ដីលក់','ដីជួល','ខុនដូលក់','អាផាតមិនជួល','ហាង','ការិយាល័យ','ឃ្លាំង']
  },
  fashion: {
    subs: ['សម្លៀកបំពាក់បុរស','សម្លៀកបំពាក់នារី','សម្លៀកបំពាក់កុមារ','ស្បែកជើង','កាបូប','នាឡិកា និងគ្រឿងអលង្ការ'],
    details: ['អាវ','ខោ','រ៉ូប','សំពត់','អាវក្រៅ','ស្បែកជើងកីឡា','ស្បែកជើងផ្លូវការ','កាបូបដៃ','កាបូបស្ពាយ','នាឡិកា','វ៉ែនតា','គ្រឿងអលង្ការ']
  },
  furniture: {
    subs: ['បន្ទប់គេង','បន្ទប់ទទួលភ្ញៀវ','ផ្ទះបាយ','ការិយាល័យ','គ្រឿងតុបតែងផ្ទះ'],
    details: ['គ្រែ','ពូក','ទូខោអាវ','សាឡុង','តុ','កៅអី','ទូដាក់ឥវ៉ាន់','តុបាយ','ទូរទស្សន៍','ភ្លើងបំភ្លឺ','វាំងនន','គ្រឿងតុបតែង']
  }
};
const PRODUCT_SPEC_FIELDS = {
  phones: ['ម៉ាក / Brand','ម៉ូដែល / Model','ទំហំ / Capacity','RAM','Storage','ពណ៌','ស្ថានភាពធានា'],
  vehicles: ['ម៉ាក / Brand','ម៉ូដែល / Model','ឆ្នាំផលិត','ចំណុះម៉ាស៊ីន (cc)','ប្រអប់លេខ','ប្រភេទប្រេង','ចម្ងាយបើកបរ (km)','ពណ៌','ឯកសារពន្ធ'],
  property: ['ទីតាំងលម្អិត','ទំហំដី (m²)','ទំហំសំណង់ (m²)','បន្ទប់គេង','បន្ទប់ទឹក','ប្រភេទប្លង់'],
  fashion: ['ម៉ាក / Brand','ទំហំ / Size','ពណ៌','សម្ភារៈ','សម្រាប់ភេទ / Gender'],
  furniture: ['ម៉ាក / Brand','សម្ភារៈ','ទំហំ (បណ្តោយ × ទទឹង × កម្ពស់)','ពណ៌','ស្ថានភាព']
};
const PRODUCT_DETAIL_SPEC_FIELDS = {
  'CPU': ['CPU Brand (Intel / AMD)','CPU Series & Model','Generation','Socket','Cores / Threads','Base / Boost Clock (GHz)'],
  'RAM': ['RAM Type (DDR3 / DDR4 / DDR5)','Capacity (4 / 8 / 16 / 32 / 64GB)','Form Factor (Desktop DIMM / Laptop SO-DIMM)','Speed (MHz)','Brand'],
  'GPU / VGA': ['GPU Brand (NVIDIA / AMD / Intel)','GPU Model (RTX / GTX / Radeon)','VRAM (4 / 6 / 8 / 12 / 16GB)','Memory Type (GDDR6 / GDDR6X)','Condition'],
  'HDD': ['Capacity (GB / TB)','RPM (5400 / 7200)','Interface (SATA / USB)','Form Factor (2.5 / 3.5 inch)'],
  'SATA SSD': ['Capacity (128 / 256 / 512GB / 1TB / 2TB)','Interface (SATA III)','Form Factor (2.5 inch / M.2 SATA)','Read / Write Speed'],
  'NVMe / M.2 SSD': ['Capacity (256 / 512GB / 1TB / 2TB)','Interface (NVMe PCIe 3.0 / 4.0 / 5.0)','Form Factor (M.2 2230 / 2242 / 2280)','Read / Write Speed'],
  'External SSD': ['Capacity (256 / 512GB / 1TB / 2TB)','Connection (USB-C / USB 3.0 / Thunderbolt)','Read / Write Speed'],
  'USB Flash Drive': ['Capacity (16 / 32 / 64 / 128 / 256GB)','USB Version (2.0 / 3.0 / 3.2 / Type-C)'],
  'Motherboard': ['Brand & Model','CPU Socket','Chipset','Form Factor (ATX / mATX / ITX)','RAM Type & Slots','M.2 / SATA Slots'],
  'Power Supply': ['Wattage (W)','80 PLUS Rating','Modular Type (Full / Semi / Non)','Connector Support'],
  'Monitor': ['Screen Size (inch)','Resolution (FHD / QHD / 4K)','Refresh Rate (Hz)','Panel (IPS / VA / OLED)','Ports (HDMI / DP / USB-C)'],
  'Laptop': ['Brand','CPU Model','RAM Type & Capacity','GPU Model & VRAM','Storage Type & Capacity','Screen Size','Resolution','Operating System','Color','Weight','Battery Health'],
  'Desktop PC': ['CPU Model','RAM Type & Capacity','GPU Model & VRAM','Storage Type & Capacity','Motherboard','Power Supply Wattage']
};
function renderProductTaxonomy(category) {
  const entry = PRODUCT_TAXONOMY[category];
  const setOptions = (select, placeholder, values) => {
    select.innerHTML = '<option value="">' + placeholder + '</option>' + (values || []).map(value => '<option value="' + esc(value) + '">' + esc(value) + '</option>').join('');
  };
  setOptions($('productSubcategory'), 'ជ្រើសរើសផ្នែករង', entry?.subs || []);
  setOptions($('productDetailType'), 'ជ្រើសរើសប្រភេទលម្អិត', entry?.details || []);
  renderProductSpecFields(category);
}
function renderProductSpecFields(category) {
  const detail = $('productDetailType')?.value || '';
  const fields = PRODUCT_DETAIL_SPEC_FIELDS[detail] || PRODUCT_SPEC_FIELDS[category] || [];
  const stableKeys = {
    'Brand':'brand','CPU Model':'cpu_model','RAM Type & Capacity':'ram_type_capacity',
    'GPU Model & VRAM':'gpu_model_vram','Storage Type & Capacity':'storage_type_capacity',
    'Screen Size':'screen_size','Resolution':'resolution','Operating System':'operating_system','Color':'color','Weight':'weight','Battery Health':'battery_health'
  };
  $('productSpecificationFields').innerHTML = fields.length
    ? '<h3 class="sm:col-span-2 text-xs font-bold text-slate-300">លក្ខណៈសម្បត្តិផលិតផល</h3>' + fields.map((label,index) =>
      '<label><span class="label">' + esc(label) + '</span><input class="field" data-listing-spec="' + esc(stableKeys[label] || 'spec_' + index) + '" placeholder="' + esc(label) + '"></label>'
    ).join('')
    : '';
}

const LISTING_TAXONOMY = {
  jobs: {
    it: { subs: ['Software & Development','IT Support & Networking','Design & Multimedia','Data & AI','Cybersecurity'], details: ['Frontend Developer','Backend Developer','Full Stack Developer','Mobile App Developer','UI/UX Designer','Graphic Designer','IT Support','Network Engineer','System Administrator','Data Analyst','AI Engineer','QA Tester','Cybersecurity Specialist'] },
    office: { subs: ['រដ្ឋបាល','គណនេយ្យ និងហិរញ្ញវត្ថុ','ធនធានមនុស្ស','សេវាអតិថិជន'], details: ['Admin Officer','Receptionist','Accountant','Cashier','HR Officer','Data Entry','Customer Service'] },
    sales: { subs: ['លក់រាយ','លក់ដុំ','ទីផ្សារឌីជីថល','អភិវឌ្ឍន៍អាជីវកម្ម'], details: ['Sales Representative','Sales Manager','Marketing Officer','Digital Marketing','Telemarketing','Business Development'] },
    transport: { subs: ['ដឹកជញ្ជូន','បើកបរ','ឃ្លាំង និងភស្តុភារ'], details: ['Delivery Rider','Driver','Truck Driver','Logistics Officer','Warehouse Staff'] },
    hospitality: { subs: ['ភោជនីយដ្ឋាន','សណ្ឋាគារ','ទេសចរណ៍'], details: ['Waiter / Waitress','Chef','Cook','Barista','Hotel Receptionist','Housekeeping','Tour Guide'] },
    construction: { subs: ['សំណង់','វិស្វកម្ម','ស្ថាបត្យកម្ម'], details: ['Civil Engineer','Site Supervisor','Architect','Electrician','Plumber','Construction Worker'] },
    education: { subs: ['បង្រៀន','គ្រប់គ្រងសាលា','បណ្តុះបណ្តាល'], details: ['English Teacher','Khmer Teacher','Math Teacher','School Administrator','Trainer'] },
    healthcare: { subs: ['ពេទ្យ','គិលានុបដ្ឋាក','ឱសថស្ថាន'], details: ['Doctor','Nurse','Pharmacist','Medical Assistant','Lab Technician'] },
    factory: { subs: ['ផលិតកម្ម','ត្រួតពិនិត្យគុណភាព','ថែទាំម៉ាស៊ីន'], details: ['Production Worker','Quality Control','Machine Operator','Factory Supervisor'] },
    agriculture: { subs: ['កសិកម្ម','ចិញ្ចឹមសត្វ','កែច្នៃផលិតផល'], details: ['Farm Worker','Agronomist','Livestock Technician','Agriculture Supervisor'] },
    services: { subs: ['សម្រស់','សម្អាត និងថែទាំ','សេវាកម្មទូទៅ'], details: ['Hair Stylist','Beautician','Nail Technician','Cleaner','Security Guard','Technician'] },
    other: { subs: ['ការងារផ្សេងៗ'], details: ['General Worker','Other Position'] }
  },
  properties: {
    house_sale: { subs: ['ផ្ទះល្វែង','ផ្ទះអាជីវកម្ម','វីឡា','ផ្ទះអាជីវកម្មលាយលំនៅដ្ឋាន'], details: ['ផ្ទះល្វែង','ផ្ទះអាជីវកម្ម','វីឡាកូនកាត់','វីឡាភ្លោះ','វីឡាទោល'] },
    house_rent: { subs: ['ផ្ទះល្វែង','វីឡា','ផ្ទះអាជីវកម្ម'], details: ['ផ្ទះល្វែង','វីឡា','ផ្ទះអាជីវកម្ម'] },
    condo_sale: { subs: ['Studio','1 Bedroom','2 Bedrooms','3+ Bedrooms'], details: ['Condo Studio','Condo 1BR','Condo 2BR','Condo 3BR+','Penthouse'] },
    apartment_rent: { subs: ['Studio','1 Bedroom','2 Bedrooms','3+ Bedrooms'], details: ['Apartment Studio','Apartment 1BR','Apartment 2BR','Apartment 3BR+'] },
    land: { subs: ['ដីលំនៅដ្ឋាន','ដីកសិកម្ម','ដីពាណិជ្ជកម្ម','ដីឧស្សាហកម្ម'], details: ['ដីក្នុងក្រុង','ដីជាយក្រុង','ដីចម្ការ','ដីផ្លូវធំ'] },
    land_rent: { subs: ['ដីកសិកម្ម','ដីពាណិជ្ជកម្ម','ដីឧស្សាហកម្ម'], details: ['ដីចម្ការ','ដីឃ្លាំង','ដីពាណិជ្ជកម្ម'] },
    commercial_sale: { subs: ['អគារការិយាល័យ','ហាង','ឃ្លាំង','ដីពាណិជ្ជកម្ម'], details: ['Office Building','Shop House','Warehouse','Commercial Building'] },
    commercial_rent: { subs: ['ការិយាល័យ','ហាង','ឃ្លាំង','ទីតាំងអាជីវកម្ម'], details: ['Office Space','Retail Shop','Warehouse','Commercial Space'] },
    room_rent: { subs: ['បន្ទប់ធម្មតា','បន្ទប់មានម៉ាស៊ីនត្រជាក់','បន្ទប់ស្ទូឌីយោ'], details: ['Single Room','Double Room','Studio Room','Shared Room'] },
    properties_wanted: { subs: ['ចង់ទិញ','ចង់ជួល','ដី','ផ្ទះ','ខុនដូ'], details: ['Buyer Request','Tenant Request','Land Wanted','House Wanted','Condo Wanted'] },
    agent_services: { subs: ['ភ្នាក់ងារលក់','ភ្នាក់ងារជួល','គ្រប់គ្រងអចលនទ្រព្យ'], details: ['Sales Agent','Rental Agent','Property Management'] },
    others_properties: { subs: ['អចលនទ្រព្យផ្សេងៗ'], details: ['Other Property'] }
  }
};

const LISTING_SPEC_FIELDS = {
  jobs: {
    it: ['ជំនាញបច្ចេកទេស','ភាសាកម្មវិធី','កម្រិតជំនាញ','Remote / On-site'],
    office: ['កម្មវិធីដែលប្រើ','ជំនាញការិយាល័យ','ភាសា','បទពិសោធន៍'],
    sales: ['ផលិតផល / សេវាកម្ម','គោលដៅលក់','ភាសា','បទពិសោធន៍'],
    transport: ['ប្រភេទបណ្ណបើកបរ','ប្រភេទយានយន្ត','តំបន់ដឹកជញ្ជូន','បទពិសោធន៍'],
    hospitality: ['ជំនាញ','ភាសា','វេនការងារ','បទពិសោធន៍'],
    construction: ['ជំនាញបច្ចេកទេស','វិញ្ញាបនបត្រ','គម្រោងធ្លាប់ធ្វើ','បទពិសោធន៍'],
    education: ['មុខវិជ្ជាបង្រៀន','កម្រិតសិក្សា','ភាសាបង្រៀន','វិញ្ញាបនបត្រ'],
    healthcare: ['ជំនាញឯកទេស','អាជ្ញាបណ្ណ','បទពិសោធន៍','វេនការងារ'],
    factory: ['ជំនាញម៉ាស៊ីន','វេនការងារ','បទពិសោធន៍','សុវត្ថិភាពការងារ'],
    agriculture: ['ប្រភេទដំណាំ / សត្វ','ជំនាញបច្ចេកទេស','ទីតាំងការងារ','បទពិសោធន៍'],
    services: ['ជំនាញសេវាកម្ម','ឧបករណ៍ប្រើប្រាស់','បទពិសោធន៍','ម៉ោងធ្វើការ'],
    other: ['ជំនាញដែលត្រូវការ','លក្ខខណ្ឌបន្ថែម']
  },
  properties: {
    house_sale: ['ប្រភេទផ្ទះ','ចំនួនជាន់','ទំហំដី (m²)','ទំហំសំណង់ (m²)','ប្លង់កម្មសិទ្ធិ','ចំណតរថយន្ត'],
    house_rent: ['ប្រភេទផ្ទះ','ចំនួនជាន់','គ្រឿងសង្ហារិម','ចំណតរថយន្ត','ប្រាក់កក់'],
    condo_sale: ['ជាន់ទី','ទំហំយូនីត (m²)','គ្រឿងសង្ហារិម','អគាររួមមាន','ប្លង់កម្មសិទ្ធិ'],
    apartment_rent: ['ជាន់ទី','ទំហំបន្ទប់ (m²)','គ្រឿងសង្ហារិម','សេវារួមមាន','ប្រាក់កក់'],
    land: ['ទំហំមុខដី','ទំហំបណ្តោយ','ប្រភេទប្លង់','ផ្លូវចូល','ប្រភេទដី'],
    land_rent: ['ទំហំមុខដី','ទំហំបណ្តោយ','ផ្លូវចូល','គោលបំណងជួល'],
    commercial_sale: ['ប្រភេទអាជីវកម្ម','ទំហំសំណង់','ចំនួនជាន់','ចំណត','ប្លង់កម្មសិទ្ធិ'],
    commercial_rent: ['ប្រភេទអាជីវកម្ម','ទំហំសំណង់','ចំនួនជាន់','ចំណត','ប្រាក់កក់'],
    room_rent: ['ទំហំបន្ទប់','ជាន់ទី','គ្រឿងសង្ហារិម','បន្ទប់ទឹកផ្ទាល់ខ្លួន','ច្បាប់ស្នាក់នៅ'],
    properties_wanted: ['ថវិកាអតិបរមា','តំបន់ដែលចង់បាន','ប្រភេទដែលត្រូវការ','ពេលវេលាត្រូវការ'],
    agent_services: ['ប្រភេទសេវាកម្ម','តំបន់បម្រើសេវា','កម្រៃជើងសារ','បទពិសោធន៍'],
    others_properties: ['ប្រភេទអចលនទ្រព្យ','ទំហំ','លក្ខណៈពិសេស']
  }
};
function renderListingSpecFields(kind, category) {
  const target = $(kind === 'job' ? 'jobSpecificationFields' : 'propertySpecificationFields');
  const fields = LISTING_SPEC_FIELDS[kind === 'job' ? 'jobs' : 'properties'][category] || [];
  target.innerHTML = fields.length
    ? '<h3 class="sm:col-span-2 text-xs font-bold text-slate-300">លក្ខណៈសម្បត្តិលម្អិត</h3>' + fields.map((label, index) =>
        '<label><span class="label">' + esc(label) + '</span><input class="field" data-listing-spec="' + esc('spec_' + index) + '" placeholder="' + esc(label) + '"></label>'
      ).join('')
    : '';
}

function fillTaxonomySelect(categorySelect, subSelect, detailSelect, registry) {
  const entry = registry[categorySelect.value];
  const setOptions = (select, placeholder, values) => {
    select.innerHTML = '<option value="">' + placeholder + '</option>' + (values || []).map(value => '<option value="' + esc(value) + '">' + esc(value) + '</option>').join('');
  };
  setOptions(subSelect, 'ជ្រើសរើសផ្នែករង', entry?.subs || []);
  setOptions(detailSelect, 'ជ្រើសរើសប្រភេទលម្អិត', entry?.details || []);
}
// Official Cambodia administrative geography (MEF DataEF / MLMUPC, 2025).
let cambodiaGeoPromise = null;
function extractCambodiaGeoRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  for (const key of ['data','records','results','items','rows','content']) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      const nested = extractCambodiaGeoRows(value);
      if (nested.length) return nested;
    }
  }
  return [];
}
async function loadCambodiaGeo() {
  if (!cambodiaGeoPromise) cambodiaGeoPromise = (async () => {
    const response = await fetch('/api/locations/cambodia', { headers: { Accept: 'application/json' } });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error || payload?.message || 'មិនអាចទាញយកបញ្ជីទីតាំងពី Telegram បានទេ។ សូមព្យាយាមម្ដងទៀត។');
    const rows = extractCambodiaGeoRows(payload?.data || payload);
    const normalized = rows.map(row => ({
      province_code: String(row.province_code || ''),
      province_kh: String(row.province_kh || '').trim(),
      province_en: String(row.province_en || '').trim(),
      district_code: String(row.district_code || ''),
      district_kh: String(row.district_kh || '').trim(),
      district_en: String(row.district_en || '').trim(),
      commune_code: String(row.commune_code || ''),
      commune_kh: String(row.commune_kh || '').trim(),
      commune_en: String(row.commune_en || '').trim(),
      village_code: String(row.village_code || ''),
      village_kh: String(row.village_kh || '').trim(),
      village_en: String(row.village_en || '').trim()
    })).filter(row => row.province_code && row.village_code && row.village_kh);
    if (!normalized.length) throw new Error('ទិន្នន័យទីតាំងទទេ ឬមានទម្រង់មិនត្រឹមត្រូវ។');
    return normalized;
  })().catch(error => { cambodiaGeoPromise = null; throw error; });
  return cambodiaGeoPromise;
}
function locationOptionLabel(kh, en) { return kh + (en ? ' · ' + en : ''); }
async function initCambodiaLocationPicker(root, legacyLocation = '') {
  if (!root) return;
  const levels = ['province','district','commune','village'];
  const selects = Object.fromEntries(levels.map(level => [level, root.querySelector('[data-location-level="' + level + '"]')]));
  const locationInput = root.querySelector('[data-location-value]') || root.querySelector('#productLocation');
  const codeInputs = Object.fromEntries(levels.map(level => [level, root.querySelector('[data-location-code="' + level + '"]') || root.querySelector('#product' + level[0].toUpperCase() + level.slice(1) + 'Code')]));
  const summary = root.querySelector('[data-location-summary]');
  const defaultCheckbox = root.querySelector('[data-location-default]');
  if (legacyLocation && locationInput && !locationInput.value) locationInput.value = legacyLocation;
  for (const select of Object.values(selects)) if (select) select.disabled = true;
  try {
    const rows = await loadCambodiaGeo();
    const unique = (items, codeKey, khKey, enKey) => {
      const map = new Map();
      items.forEach(row => { if (row[codeKey] && !map.has(row[codeKey])) map.set(row[codeKey], { code: row[codeKey], kh: row[khKey], en: row[enKey] }); });
      return [...map.values()].sort((a,b) => a.kh.localeCompare(b.kh, 'km'));
    };
    const fill = (select, label, items) => {
      if (!select) return;
      select.innerHTML = '<option value="">' + label + '</option>' + items.map(item => '<option value="' + esc(item.code) + '">' + esc(locationOptionLabel(item.kh,item.en)) + '</option>').join('');
      select.disabled = false;
    };
    const provinceItems = unique(rows,'province_code','province_kh','province_en');
    fill(selects.province, 'ជ្រើសរើសរាជធានី/ខេត្ត', provinceItems);
    const getSavedLocation = () => state.me?.profile?.default_location || null;
    const selectedRows = () => Object.fromEntries(levels.map(level => [
      level, rows.find(row => row[level + '_code'] === (selects[level]?.value || '')) || null
    ]));
    const updateLocation = () => {
      const selected = selectedRows();
      levels.forEach(level => {
        if (codeInputs[level]) codeInputs[level].value = selects[level]?.value || '';
      });
      if (selected.village && selected.commune && selected.district && selected.province) {
        const names = [selected.province.province_kh, selected.district.district_kh, selected.commune.commune_kh, selected.village.village_kh];
        if (locationInput) locationInput.value = names.join(' · ');
        if (summary) summary.textContent = 'ខេត្ត/ក្រុង៖ ' + selected.province.province_kh + ' · ស្រុក/ខណ្ឌ៖ ' + selected.district.district_kh + ' · ឃុំ/សង្កាត់៖ ' + selected.commune.commune_kh + ' · ភូមិ៖ ' + selected.village.village_kh + '  |  កូដភូមិ៖ ' + selected.village.village_code;
      } else {
        if (locationInput) locationInput.value = '';
        if (summary) summary.textContent = 'សូមជ្រើសរើសរាជធានី/ខេត្ត → ស្រុក/ខណ្ឌ → ឃុំ/សង្កាត់ → ភូមិ';
      }
      if (defaultCheckbox) {
        const savedLocation = getSavedLocation();
        defaultCheckbox.checked = Boolean(savedLocation && levels.every(level =>
          String(savedLocation[level + '_code'] || '') === String(selects[level]?.value || '')
        ) && levels.every(level => Boolean(selects[level]?.value)));
      }
    };
    const applySavedLocation = (saved) => {
      if (!saved || !levels.every(level => saved[level + '_code'])) return false;
      if (!provinceItems.some(item => item.code === String(saved.province_code))) return false;
      selects.province.value = String(saved.province_code);
      fill(selects.district, 'ជ្រើសរើសស្រុក/ខណ្ឌ', unique(rows.filter(r => r.province_code === selects.province.value),'district_code','district_kh','district_en'));
      if (!Array.from(selects.district.options).some(option => option.value === String(saved.district_code))) return false;
      selects.district.value = String(saved.district_code);
      fill(selects.commune, 'ជ្រើសរើសឃុំ/សង្កាត់', unique(rows.filter(r => r.district_code === selects.district.value),'commune_code','commune_kh','commune_en'));
      if (!Array.from(selects.commune.options).some(option => option.value === String(saved.commune_code))) return false;
      selects.commune.value = String(saved.commune_code);
      fill(selects.village, 'ជ្រើសរើសភូមិ', unique(rows.filter(r => r.commune_code === selects.commune.value),'village_code','village_kh','village_en'));
      if (!Array.from(selects.village.options).some(option => option.value === String(saved.village_code))) return false;
      selects.village.value = String(saved.village_code);
      updateLocation();
      return true;
    };
    if (root.dataset.locationBound !== 'true') {
      selects.province?.addEventListener('change', () => {
        fill(selects.district, 'ជ្រើសរើសស្រុក/ខណ្ឌ', unique(rows.filter(r => r.province_code === selects.province.value),'district_code','district_kh','district_en'));
        selects.commune.innerHTML = '<option value="">ជ្រើសរើសឃុំ/សង្កាត់</option>'; selects.commune.disabled = true;
        selects.village.innerHTML = '<option value="">ជ្រើសរើសភូមិ</option>'; selects.village.disabled = true; updateLocation();
      });
      selects.district?.addEventListener('change', () => {
        fill(selects.commune, 'ជ្រើសរើសឃុំ/សង្កាត់', unique(rows.filter(r => r.district_code === selects.district.value),'commune_code','commune_kh','commune_en'));
        selects.village.innerHTML = '<option value="">ជ្រើសរើសភូមិ</option>'; selects.village.disabled = true; updateLocation();
      });
      selects.commune?.addEventListener('change', () => {
        fill(selects.village, 'ជ្រើសរើសភូមិ', unique(rows.filter(r => r.commune_code === selects.commune.value),'village_code','village_kh','village_en'));
        updateLocation();
      });
      selects.village?.addEventListener('change', updateLocation);
      defaultCheckbox?.addEventListener('change', async () => {
        if (!defaultCheckbox.checked) {
          if (!state.session) return;
          try {
            await api('/api/me/default-location', { method: 'PATCH', body: JSON.stringify({ default_location: null }) });
            if (state.me) state.me.profile = { ...(state.me.profile || {}), default_location: null };
            toast('បានដកទីតាំងលំនាំដើមចេញ។');
          } catch (error) {
            defaultCheckbox.checked = true;
            toast(error.message || 'មិនអាចដកទីតាំងលំនាំដើមបានទេ។', 'error');
          }
          return;
        }
        if (!requireLogin()) { defaultCheckbox.checked = false; return; }
        const selected = selectedRows();
        if (!selected.village || !selected.commune || !selected.district || !selected.province) {
          defaultCheckbox.checked = false;
          toast('សូមជ្រើសរើសទីតាំងដល់កម្រិតភូមិជាមុនសិន។', 'error');
          return;
        }
        const nextDefault = {
          province_code: selects.province.value,
          district_code: selects.district.value,
          commune_code: selects.commune.value,
          village_code: selects.village.value,
          location: locationInput?.value || ''
        };
        try {
          await api('/api/me/default-location', { method: 'PATCH', body: JSON.stringify({ default_location: nextDefault }) });
          if (state.me) state.me.profile = { ...(state.me.profile || {}), default_location: nextDefault };
          defaultCheckbox.checked = true;
          toast('បានរក្សាទុកទីតាំងលំនាំដើមជោគជ័យ!');
        } catch (error) {
          defaultCheckbox.checked = false;
          toast(error.message || 'មិនអាចរក្សាទុកទីតាំងលំនាំដើមបានទេ។', 'error');
        }
      });
      root.dataset.locationBound = 'true';
    }
    if (!legacyLocation && !locationInput?.value) {
      if (!applySavedLocation(getSavedLocation())) updateLocation();
    } else if (!legacyLocation) {
      updateLocation();
    }
    root.dataset.locationReady = 'true';
  } catch (error) {
    if (summary) summary.textContent = error.message || 'មិនអាចផ្ទុកទីតាំងបានទេ។';
    toast(error.message || 'មិនអាចផ្ទុកទីតាំងកម្ពុជាបានទេ។', 'error');
  }
}
function openListingTypeChooser() { openModal('listingTypeModal'); }
function openJobListingForm() {
  revokeListingAlbum('job');
  $('jobListingForm').reset();
  fillTaxonomySelect($('jobCategory'), $('jobSubcategory'), $('jobDetailType'), LISTING_TAXONOMY.jobs);
  void initCambodiaLocationPicker($('jobListingForm').querySelector('[data-location-picker]'));
  $('jobSpecificationFields').innerHTML = '';
  openModal('jobFormModal');
}
function openPropertyListingForm() {
  revokeListingAlbum('property');
  $('propertyListingForm').reset();
  fillTaxonomySelect($('propertyCategory'), $('propertySubcategory'), $('propertyDetailType'), LISTING_TAXONOMY.properties);
  void initCambodiaLocationPicker($('propertyListingForm').querySelector('[data-location-picker]'));
  $('propertySpecificationFields').innerHTML = '';
  openModal('propertyFormModal');
}
function collectListingSpecs(form, extraFields) {
  const specs = {};
  for (const input of form.querySelectorAll('[data-listing-spec]')) {
    const value = String(input.value || '').trim();
    if (value) specs[input.dataset.listingSpec] = value;
  }
  return specs;
}
async function submitNewListing(form, endpoint, kind) {
  const submit = form.querySelector('button[type="submit"]');
  if (submit?.disabled) return;
  const original = submit?.textContent || '';
  const data = new FormData(form);
  const albumRoot = listingAlbumRoot(kind);
  const albumItems = albumRoot ? (listingImageAlbums.get(albumRoot) || []) : [];
  if (albumItems.length > 10) { toast('អាចដាក់រូបភាពបានអតិបរមា ១០ រូប។', 'error'); return; }
  albumItems.forEach(item => data.append('images', item.file));
  if (!String(data.get('location') || '').trim() || !String(data.get('village_code') || '').trim()) {
    toast('សូមជ្រើសរើសទីតាំងរហូតដល់កម្រិតភូមិ។', 'error');
    return;
  }
  const skills = String(data.get('skills_text') || '').split(',').map(v => v.trim()).filter(Boolean);
  const benefits = String(data.get('benefits_text') || '').split(',').map(v => v.trim()).filter(Boolean);
  data.delete('skills_text'); data.delete('benefits_text');
  const listingSpecifications = collectListingSpecs(form);
  const mapUrl = String(data.get('google_map_url') || '').trim();
  if (mapUrl) listingSpecifications.google_map_url = mapUrl;
  else delete listingSpecifications.google_map_url;
  data.delete('google_map_url');
  data.set('specifications', JSON.stringify(listingSpecifications));
  if (kind === 'job') {
    data.set('skills', JSON.stringify(skills));
    data.set('benefits', JSON.stringify(benefits));
  }
  if (kind === 'property' && ['properties_wanted','agent_services','others_properties'].includes(String(data.get('category')))) {
    if (!data.get('price')) data.set('price', '');
  }
  if (submit) { submit.disabled = true; submit.textContent = 'កំពុងបង្ហោះ...'; }
  try {
    const result = await api(endpoint, { method: 'POST', body: data });
    revokeListingAlbum(kind);
    closeModal(kind === 'job' ? 'jobFormModal' : 'propertyFormModal');
    toast(kind === 'job' ? 'បានបង្ហោះប្រកាសការងារជោគជ័យ!' : 'បានបង្ហោះអចលនទ្រព្យជោគជ័យ!');
    state.activeListingType = kind === 'job' ? 'job' : 'real_estate';
    state.activeCategory = 'all'; state.activePropertyType = 'all';
    updateMarketplaceCategoryHeading();
    document.querySelectorAll('[data-listing-type]').forEach((button) => button.classList.toggle('active', button.dataset.listingType === state.activeListingType));
    document.querySelectorAll('[data-property-type]').forEach((button) => button.classList.toggle('active', button.dataset.propertyType === 'all'));
    await loadProducts();
  } catch (error) {
    toast(error.message || 'មិនអាចបង្ហោះប្រកាសបានទេ។', 'error');
  } finally {
    if (submit) { submit.disabled = false; submit.textContent = original; }
  }
}

function renderProductForm(product = null) {
  if (!isSellerAccount()) { openSellerModal(); return; }
  revokeProductImagePreviews();
  state.selectedProductImages = [];
  $('productForm').reset();
  $('productLocation').value = '';
  ['Province','District','Commune','Village'].forEach(level => { const field = $('product' + level + 'Code'); if (field) field.value = ''; });
  $('productSubcategory').innerHTML = '<option value="">ជ្រើសរើសផ្នែករង</option>';
  $('productDetailType').innerHTML = '<option value="">ជ្រើសរើសប្រភេទលម្អិត</option>';
  $('productSpecificationFields').innerHTML = '';
  $('editProductId').value = product?.id || '';
  $('productFormTitle').textContent = product ? 'កែប្រែព័ត៌មានទំនិញ' : 'បន្ថែមទំនិញថ្មី';
  $('productImageThumb').innerHTML = ic('image', 21);
  if (product) {
    $('productTitle').value = product.title;
    $('productPrice').value = product.price;
    $('productCategory').value = product.category;
    $('productLocation').value = product.location || 'ភ្នំពេញ';
    $('productCondition').value = product.condition || 'ប្រើរួចស្អាត';
    $('productYoutubeVideoUrl').value = product.youtube_video_url || '';
    const mapField = $('productForm').elements.google_map_url;
    if (mapField) mapField.value = product.specifications?.google_map_url || '';
    const desc = productDescriptionParts(product);
    $('productShortDesc').value = desc.short;
    $('productDescription').value = desc.full;
    state.selectedProductImages = (product.product_images || []).filter((item) => item.image_url)
      .slice().sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
      .map((item) => ({ kind: 'existing', id: item.id, image_url: item.image_url }));
  }
  renderProductTaxonomy($('productCategory').value);
  void initCambodiaLocationPicker($('productForm').querySelector('[data-location-picker]'), product?.location || '');
  renderProductImageAlbum();
  updateShortDescriptionCounter();
  updateProductYoutubePreview();
  openModal('productFormModal');
}

function shortDescriptionLineMaxWidth() {
  const cards = Array.from(document.querySelectorAll('.cd'));
  const card = cards.find((item) => item.getClientRects().length);
  if (card) {
    const body = card.querySelector('.cb');
    const description = card.querySelector('.cd-description');
    if (description?.clientWidth) return description.clientWidth;
    if (body?.clientWidth) {
      const style = getComputedStyle(body);
      return Math.max(80, body.clientWidth - parseFloat(style.paddingLeft || 0) - parseFloat(style.paddingRight || 0));
    }
  }
  // Fallback to the minimum desktop product-card width minus its content padding.
  return 150;
}

function shortDescriptionGraphemes(value) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter('km', { granularity: 'grapheme' }).segment(value), (part) => part.segment);
  }
  return Array.from(value);
}

function fitShortDescriptionLines(value, maxWidth) {
  const field = $('productShortDesc');
  const style = field ? getComputedStyle(field) : null;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const cardDescription = document.querySelector('.cd .cd-description');
  const cardStyle = cardDescription ? getComputedStyle(cardDescription) : null;
  context.font = cardStyle?.font || '11px "Kantumruy Pro", sans-serif';
  const lines = String(value || '').replace(/\r/g, '').split('\n').slice(0, 3);
  return lines.map((line) => {
    const parts = shortDescriptionGraphemes(line);
    let result = '';
    for (const part of parts) {
      if (context.measureText(result + part).width > maxWidth) break;
      result += part;
    }
    return result;
  }).join('\n');
}

function updateShortDescriptionCounter() {
  const field = $('productShortDesc');
  const counter = $('productShortDescCount');
  if (!field || !counter) return;
  const previous = field.value;
  const caret = field.selectionStart ?? previous.length;
  const fitted = fitShortDescriptionLines(previous, shortDescriptionLineMaxWidth());
  if (fitted !== previous) {
    field.value = fitted;
    const nextCaret = Math.min(caret, fitted.length);
    field.setSelectionRange(nextCaret, nextCaret);
  }
  const lines = field.value.split('\n');
  const graphemeCounts = lines.map((line) => shortDescriptionGraphemes(line).length);
  counter.textContent = `៣ បន្ទាត់ · ${graphemeCounts.map((count, index) => `បន្ទាត់ ${index + 1}: ${count}`).join(' / ')} · កំណត់តាមទំហំកាត`;
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

async function renderAdminSupplierProducts() {
  const target = $('adminSupplierProductsList');
  if (!target || !isAdmin()) return;
  target.innerHTML = '<p class="py-6 text-center text-xs text-slate-400">កំពុងផ្ទុក...</p>';
  try {
    const result = await api('/api/admin/supplier-products');
    state.adminSupplierProducts = result.data || [];
    const term = String($('adminSupplierSearch')?.value || '').trim().toLowerCase();
    const products = state.adminSupplierProducts.filter(p => !term || [p.title,p.category,p.supplier_source?.supplier_name].some(v => String(v || '').toLowerCase().includes(term)));
    target.innerHTML = products.map(p => {
      const source=p.supplier_source||{}, variants=p.product_variants||[], image=productImage(p);
      return `<article class="rounded-2xl border border-slate-200 p-4" data-admin-supplier-product="${esc(p.id)}">
        <div class="flex flex-wrap items-start gap-3"><div class="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">${image ? `<img class="h-full w-full object-cover" src="${esc(image)}" alt="">` : ''}</div>
        <div class="min-w-0 flex-1"><b class="block text-sm">${esc(p.title)}</b><p class="mt-1 text-[10px] text-slate-500">${esc(p.category||'General')} · ${esc(p.status||'')}</p><p class="mt-1 text-[11px] font-bold">តម្លៃចម្បង៖ ${money(p.price)} · ស្តុក៖ ${Number(p.stock||0)}</p></div></div>
        <form class="admin-supplier-product-edit-form mt-3 grid gap-2 rounded-xl border border-slate-100 p-3 sm:grid-cols-2" data-product-id="${esc(p.id)}">
          <b class="text-[11px] sm:col-span-2">ព័ត៌មានផលិតផល</b>
          <label><span class="label">ឈ្មោះផលិតផល</span><input class="field" name="title" value="${esc(p.title||'')}" required></label>
          <label><span class="label">Category</span><input class="field" name="category" value="${esc(p.category||'')}" required></label>
          <label><span class="label">តម្លៃមេ ($)</span><input class="field" name="price" type="number" min="0" step="0.01" value="${Number(p.price||0)}" required></label>
          <label><span class="label">ស្តុកមេ</span><input class="field" name="stock" type="number" min="0" step="1" value="${Number(p.stock||0)}"></label>
          <label class="sm:col-span-2"><span class="label">ពិពណ៌នា</span><textarea class="field" name="description" rows="2">${esc(p.description||'')}</textarea></label>
          <label><span class="label">ស្ថានភាពបង្ហាញ</span><select class="field" name="status"><option value="active" ${p.status==='active'?'selected':''}>Active / បង្ហាញ</option><option value="pending" ${p.status==='pending'?'selected':''}>Pending</option><option value="rejected" ${p.status==='rejected'?'selected':''}>Rejected</option><option value="archived" ${p.status==='archived'?'selected':''}>Archived / លាក់</option><option value="sold" ${p.status==='sold'?'selected':''}>Sold</option></select></label>
          <div class="flex flex-wrap items-center justify-between gap-2 sm:col-span-2"><button class="rounded-full bg-slate-900 px-4 py-2 text-[10px] font-bold text-white" type="submit">រក្សាទុកការកែប្រែ</button><button class="rounded-full bg-rose-50 px-4 py-2 text-[10px] font-bold text-rose-600" type="button" data-admin-supplier-delete="${esc(p.id)}">លុប / Archive</button></div>
        </form>
        <form class="admin-supplier-source-form mt-4 grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-2" data-product-id="${esc(p.id)}"><b class="text-[11px] sm:col-span-2">ព័ត៌មាន Supplier (Admin only)</b>
          <label><span class="label">Supplier</span><input class="field bg-white" name="supplier_name" value="${esc(source.supplier_name||'')}"></label>
          <label><span class="label">Supplier URL</span><input class="field bg-white" name="supplier_url" type="url" value="${esc(source.supplier_url||'')}"></label>
          <label><span class="label">Supplier Price ($)</span><input class="field bg-white" name="supplier_price" type="number" min="0" step="0.01" value="${Number(source.supplier_price||0)}"></label>
          <label><span class="label">Supplier Product Code</span><input class="field bg-white" name="supplier_product_code" value="${esc(source.supplier_product_code||'')}"></label>
          <div class="sm:col-span-2"><button class="rounded-full border border-slate-300 bg-white px-4 py-2 text-[10px] font-bold" type="submit">រក្សាទុក Supplier Info</button></div>
        </form>
        <div class="mt-4"><b class="mb-2 block text-[11px]">Storage Variants (${variants.length})</b>
          ${variants.map(v=>{const vs=v.supplier_source||{};return `<form class="admin-supplier-variant-form mb-2 grid gap-2 rounded-xl border border-slate-100 p-3 sm:grid-cols-6" data-product-id="${esc(p.id)}" data-variant-id="${esc(v.id)}">
            <label><span class="label">Storage</span><input class="field" name="option_value" value="${esc(v.option_value||'')}" required></label>
            <label><span class="label">Retail Price ($)</span><input class="field" name="price" type="number" min="0" step="0.01" value="${Number(v.price||0)}" required></label>
            <label><span class="label">Stock</span><input class="field" name="stock" type="number" min="0" step="1" value="${Number(v.stock||0)}"></label>
            <label><span class="label">Supplier Cost ($)</span><input class="field" name="supplier_price" type="number" min="0" step="0.01" value="${Number(vs.supplier_price||0)}"></label>
            <label><span class="label">Supplier Code</span><input class="field" name="supplier_product_code" value="${esc(vs.supplier_product_code||v.sku||'')}"></label>
            <div class="flex items-end gap-1"><button class="rounded-full bg-slate-900 px-3 py-2 text-[10px] font-bold text-white" type="submit">រក្សាទុក</button><button class="rounded-full bg-rose-50 px-3 py-2 text-[10px] font-bold text-rose-600" type="button" data-admin-variant-delete="${esc(v.id)}">លុប</button></div>
            <label class="sm:col-span-6"><span class="label">Supplier URL</span><input class="field" name="supplier_url" type="url" value="${esc(vs.supplier_url||source.supplier_url||'')}"></label></form>`;}).join('')||'<p class="rounded-xl bg-slate-50 p-3 text-[10px] text-slate-400">មិនទាន់មាន Variant ទេ។</p>'}
          <form class="admin-supplier-add-variant-form mt-3 grid gap-2 rounded-xl border border-dashed border-slate-300 p-3 sm:grid-cols-3" data-product-id="${esc(p.id)}"><b class="text-[11px] sm:col-span-3">បន្ថែម Storage Variant</b>
            <label><span class="label">Storage / Option</span><input class="field" name="option_value" placeholder="512GB SSD" required></label>
            <label><span class="label">Retail Price ($)</span><input class="field" name="price" type="number" min="0" step="0.01" required></label>
            <label><span class="label">Stock</span><input class="field" name="stock" type="number" min="0" step="1" value="0"></label>
            <label><span class="label">Supplier Cost ($)</span><input class="field" name="supplier_price" type="number" min="0" step="0.01" value="0"></label>
            <label><span class="label">Supplier Code</span><input class="field" name="supplier_product_code"></label>
            <label><span class="label">Supplier URL</span><input class="field" name="supplier_url" type="url"></label>
            <div class="sm:col-span-3"><button class="brand-gradient rounded-full px-4 py-2 text-[10px] font-bold text-white" type="submit">បន្ថែម Variant</button><small class="ml-2 text-[9px] text-slate-400">អាចកំណត់តម្លៃលក់ដោយដៃ ឬគណនា Supplier Cost + $5។</small></div></form>
        </div></article>`;
    }).join('')||'<p class="py-8 text-center text-xs text-slate-400">មិនទាន់មានផលិតផល Supplier ទេ។</p>';
  } catch(error){target.innerHTML='<p class="py-6 text-center text-xs text-rose-500">មិនអាចផ្ទុក Supplier Products បានទេ។</p>';toast(error.message||'មិនអាចផ្ទុកផលិតផល Supplier បានទេ។','error');}
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
    await renderAdminSupplierProducts();
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
    const senderIsShop = msg.sender_role === 'seller';
    const participant = state.chatConversation || {};
    const senderName = senderIsShop
      ? (participant.vendor?.store_name || 'ហាងអ្នកលក់')
      : (participant.buyer?.display_name || 'អ្នកទិញ');
    const senderAvatar = senderIsShop ? participant.vendor?.store_logo_url : participant.buyer?.avatar_url;
    const avatar = senderAvatar
      ? `<img class="seller-chat-message-avatar" src="${esc(senderAvatar)}" alt="${esc(senderName)}">`
      : `<span class="seller-chat-message-avatar seller-chat-message-avatar-fallback">${ic(senderIsShop ? 'store' : 'user', 15)}</span>`;
    let content = '';
    if (msg.message_type === 'product') {
      const prod = msg.product || null;
      const img = prod?.image_url
        ? `<img src="${esc(prod.image_url)}" alt="${esc(prod.title || 'ផលិតផល')}" loading="lazy">`
        : `<span class="seller-chat-product-placeholder">${ic('bag', 24)}</span>`;
      content = `<article class="seller-chat-product-card" ${prod?.id ? `data-chat-product-id="${esc(prod.id)}"` : ''}>${img}<div class="seller-chat-product-info"><small>ផលិតផលដែលបានសួរ</small><b>${esc(prod?.title || msg.body || 'ផលិតផល')}</b>${prod ? `<strong>${money(prod.price)}</strong>` : '<span class="seller-chat-product-unavailable">ព័ត៌មានផលិតផលមិនទាន់មាន</span>'}</div></article>`;
    } else if (msg.message_type === 'image' && (msg.media_url || msg.local_image_url)) {
      const src = msg.local_image_url || msg.media_url;
      content = `<img class="seller-chat-image" src="${esc(src)}" alt="រូបភាពក្នុងសារ" loading="lazy" role="button" tabindex="0" aria-label="មើលរូបភាពធំ">`;
    } else {
      content = `<p>${esc(msg.body || '').replace(/\n/g, '<br>')}</p>`;
    }
    const time = esc(new Date(msg.created_at).toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' }));
    return `<div class="seller-chat-message-row ${own ? 'own' : 'other'}">${own ? '' : avatar}<div class="seller-chat-bubble ${own ? 'own' : 'other'}">${content}<small>${time}</small></div>${own ? avatar : ''}</div>`;
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
    // Show the other participant: shop identity to buyers, personal identity to shop owners.
    const otherIsShop = String(chat.other_role || '').toLowerCase() === 'seller';
    const displayName = otherIsShop
      ? (chat.vendor?.store_name || 'ហាងអ្នកលក់')
      : (chat.buyer?.display_name || chat.other_name || 'អ្នកប្រើប្រាស់');
    const avatarUrl = otherIsShop ? chat.vendor?.store_logo_url : chat.buyer?.avatar_url;
    const img = avatarUrl
      ? `<img src="${esc(avatarUrl)}" alt="${esc(displayName)}" class="h-11 w-11 shrink-0 rounded-full object-cover">`
      : `<span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400">${ic(otherIsShop ? 'store' : 'user', 20)}</span>`;
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

  // current_role identifies the viewer; display the opposite participant's identity.
  state.chatConversation = conv;
  const currentRole = String(conv.current_role || state.chatMode || 'buyer').toLowerCase();
  state.chatMode = currentRole === 'seller' ? 'seller' : 'buyer';
  const otherIsShop = state.chatMode === 'buyer';
  const otherName = otherIsShop
    ? (conv.vendor?.store_name || 'ហាងអ្នកលក់')
    : (conv.buyer?.display_name || 'អ្នកទិញ');
  const otherAvatar = otherIsShop ? conv.vendor?.store_logo_url : conv.buyer?.avatar_url;
  $('sellerChatTitle').textContent = otherName;
  $('sellerChatSubtitle').textContent = '';
  $('sellerChatHeaderTitle').textContent = otherName;
  $('sellerChatHeaderSubtitle').classList.add('hidden');
  $('sellerChatHeaderIdentity').classList.remove('hidden');
  $('sellerChatHeaderDefault').classList.add('hidden');
  $('sellerChatHeaderAvatar').innerHTML = otherAvatar
    ? `<img src="${esc(otherAvatar)}" alt="${esc(otherName)}" class="h-full w-full rounded-full object-cover">`
    : `<span class="grid h-full w-full place-items-center text-slate-400">${ic(otherIsShop ? 'store' : 'user', 18)}</span>`;
  $('sellerChatProductImage').innerHTML = otherAvatar
    ? `<img src="${esc(otherAvatar)}" alt="${esc(otherName)}" class="h-full w-full object-cover">`
    : `<span class="grid h-full w-full place-items-center text-slate-400">${ic(otherIsShop ? 'store' : 'user', 18)}</span>`;

  state.chatLoadedMessages = messages;
  const pending = state.chatPendingMedia.filter((m) => m.conversation_id === state.chatConversationId);
  renderSellerChatMessages([...messages, ...pending], scrollToBottom);

  $('sellerChatInboxPane').classList.add('mobile-hidden');
  $('sellerChatBack').classList.remove('hidden');
  $('sellerChatHeaderBack').classList.remove('hidden');
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
  $('sellerChatHeaderBack').classList.add('hidden');
  $('sellerChatHeaderIdentity').classList.add('hidden');
  $('sellerChatHeaderDefault').classList.remove('hidden');
  $('sellerChatHeaderSubtitle').classList.remove('hidden');
  $('sellerChatTitle').textContent = 'ជ្រើសរើសសន្ទនា';
  $('sellerChatSubtitle').textContent = 'ព័ត៌មានផលិតផលនឹងបង្ហាញនៅទីនេះ';
  openModal('sellerChatModal');
  await loadUnifiedSellerChatInbox();
}

async function startListingPosterChat(item) {
  if (!requireLogin()) return;
  if (!item?.id || !['job','real_estate'].includes(item.listing_type)) return;
  try {
    const result = await api('/api/seller-chat/listing-conversations', {
      method: 'POST',
      body: JSON.stringify({ listing_type: item.listing_type, listing_id: item.id })
    });
    if (!result.data?.id) throw new Error('មិនអាចបើកសន្ទនាបានទេ។');
    await openSellerChat(result.data.id, 'buyer', null);
  } catch (error) {
    toast(error.message || 'មិនអាចឆាតជាមួយអ្នកផុសបានទេ។', 'error');
  }
}

async function startStoreChat(vendorId) {
  if (!requireLogin()) return;
  const storeId = String(vendorId || '').trim();
  if (!storeId) { toast('មិនមានព័ត៌មានហាងនេះទេ។', 'warning'); return; }
  try {
    await loadUnifiedSellerChatInbox();
    const existing = state.chatInbox.find(conversation => String(conversation.vendor_id || conversation.vendor?.id || '') === storeId);
    if (existing?.id) { await openSellerChat(existing.id, 'buyer', null); return; }
    const result = await api('/api/seller-chat/store-conversations', { method: 'POST', body: JSON.stringify({ vendor_id: storeId }) });
    if (!result.data?.id) throw new Error('មិនអាចបើកសន្ទនាជាមួយហាងបានទេ។');
    await openSellerChat(result.data.id, 'buyer', null);
  } catch (error) { toast(error.message || 'មិនអាចឆាតជាមួយហាងបានទេ។', 'error'); }
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
  const selectedVariant = (p?.variants || []).find(item => String(item.id) === String(state.currentVariantId)) || (p?.variants || [])[0] || null;
  const checkoutPrice = selectedVariant ? Number(selectedVariant.price) : Number(p?.price || 0);
  const checkoutStock = selectedVariant ? Number(selectedVariant.stock) : Number(p?.stock || 0);
  if (!p || checkoutStock <= 0) { toast('ទំនិញនេះអស់ស្តុកហើយ។', 'warning'); return; }
  if (!$('checkoutModal')) {
    const wrap = document.createElement('div');
    wrap.id = 'checkoutModal';
    wrap.className = 'modal';
    wrap.innerHTML = `<section class="modal-box app-checkout-box max-w-[520px] p-6">
      <div class="mb-4 flex items-center justify-between"><h2 class="text-lg font-bold">ព័ត៌មានដឹកជញ្ជូន និងទូទាត់</h2><button type="button" class="close-btn" data-close="checkoutModal">${ic('x', 16)}</button></div>
      <form id="checkoutForm" class="space-y-3">
        <input id="checkoutName" required class="field" placeholder="ឈ្មោះអ្នកទទួល">
        <input id="checkoutPhone" required class="field" placeholder="លេខទូរស័ព្ទ">
        <textarea id="checkoutAddress" required class="field min-h-20" placeholder="អាសយដ្ឋានដឹកជញ្ជូន"></textarea>
        <fieldset class="checkout-payment-options">
          <legend>ជ្រើសរើសវិធីទូទាត់</legend>
          <label><input type="radio" name="payment_method" value="cash_on_delivery" checked><span><b>${ic('truck',15)} ទូទាត់ពេលទទួលទំនិញ</b><small>Cash on Delivery</small></span></label>
          <label><input type="radio" name="payment_method" value="bank_transfer"><span><b>${ic('wallet',15)} KHQR / ផ្ទេរប្រាក់តាមធនាគារ</b><small>Bank Transfer · រង់ចាំការផ្ទៀងផ្ទាត់</small></span></label>
        </fieldset>
        <p id="checkoutPaymentNote" class="checkout-payment-note" hidden>ការបញ្ជាទិញនឹងរង់ចាំការផ្ទៀងផ្ទាត់។ ប្រព័ន្ធមិនទាន់មាន QR Code របស់អ្នកលក់ក្នុងព័ត៌មានហាងទេ។ សូមទាក់ទងអ្នកលក់ដើម្បីទទួល KHQR ឬព័ត៌មានគណនីផ្ទេរប្រាក់។</p>
        <div class="flex justify-between pt-2 font-bold"><span>សរុប</span><span id="checkoutTotal"></span></div>
        <button id="checkoutSubmit" class="brand-gradient w-full rounded-full py-3 text-xs font-bold text-white">បញ្ជាក់ការបញ្ជាទិញ</button>
      </form>
    </section>`;
    document.body.appendChild(wrap);
    wrap.querySelector('[data-close]').onclick = () => closeModal('checkoutModal');
    $('checkoutForm').querySelectorAll('[name="payment_method"]').forEach(input => input.addEventListener('change', () => {
      $('checkoutPaymentNote').hidden = input.value !== 'bank_transfer' || !input.checked;
    }));
    $('checkoutForm').onsubmit = async e => {
      e.preventDefault();
      const submit = $('checkoutSubmit');
      const original = submit.innerHTML;
      submit.disabled = true;
      submit.textContent = 'កំពុងបញ្ជាទិញ...';
      try {
        const paymentMethod = new FormData($('checkoutForm')).get('payment_method') || 'cash_on_delivery';
        const checkoutProduct = state.currentProduct;
        const checkoutVariant = (checkoutProduct?.variants || []).find(item => String(item.id) === String(state.currentVariantId)) || (checkoutProduct?.variants || [])[0] || null;
        await api('/api/orders', {
          method: 'POST',
          body: JSON.stringify({
            customer_name: $('checkoutName').value.trim(),
            customer_phone: $('checkoutPhone').value.trim(),
            delivery_address: $('checkoutAddress').value.trim(),
            payment_method: paymentMethod,
            items: [{ product_id: checkoutProduct.id, variant_id: checkoutVariant?.id || null, quantity: 1 }]
          })
        });
        closeModal('checkoutModal');
        toast(paymentMethod === 'bank_transfer' ? 'បានទទួលការបញ្ជាទិញ។ ស្ថានភាពទូទាត់កំពុងរង់ចាំការផ្ទៀងផ្ទាត់។' : 'បានបញ្ជាទិញជោគជ័យ!');
        await Promise.all([loadOrders(), loadProducts()]);
      } catch (err) {
        toast(err.message, 'error');
      } finally {
        submit.disabled = false;
        submit.innerHTML = original;
      }
    };
  }
  $('checkoutTotal').textContent = money(checkoutPrice);
  $('checkoutName').value = profileName();
  $('checkoutPhone').value = state.me?.profile?.phone || '';
  $('checkoutForm').querySelector('[name="payment_method"][value="cash_on_delivery"]').checked = true;
  $('checkoutPaymentNote').hidden = true;
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

function createProductGalleryVideoFrame(videoId, title = 'Product video', autoplay = true) {
  const frame = document.createElement('iframe');
  frame.className = 'product-gallery-video-frame';
  frame.dataset.productGalleryVideo = 'true';
  frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId) + '?autoplay=' + (autoplay ? '1' : '0') + '&controls=1&rel=0&playsinline=1';
  frame.title = title || 'Product video';
  frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  return frame;
}
function productGalleryVideoFrameMarkup(videoId, title = 'Product video', autoplay = false) {
  return '<iframe class="product-gallery-video-frame" data-product-gallery-video="true" src="https://www.youtube-nocookie.com/embed/' +
    encodeURIComponent(videoId) + '?autoplay=' + (autoplay ? '1' : '0') +
    '&controls=1&rel=0&playsinline=1" title="' + esc(title || 'Product video') +
    '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
}

function youtubeVideoId(value) {
  try {
    const url = new URL(String(value || '').trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0]?.match(/^[A-Za-z0-9_-]{11}$/)?.[0] || '';
    if (!['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host)) return '';
    const id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|live|shorts)\/([A-Za-z0-9_-]{11})\/?$/)?.[1] || '';
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : '';
  } catch { return ''; }
}
let listingVideoPlayer = null;
let listingVideoProgressTimer = null;
let listingVideoSession = 0;
let listingProductAutoSlideTimer = null;

function startListingProductAutoSlide(metaHost) {
  if (listingProductAutoSlideTimer) clearInterval(listingProductAutoSlideTimer);
  listingProductAutoSlideTimer = null;
  const rail = metaHost?.querySelector('.is-similar-products .home-shorts-related-list');
  if (!rail) return;
  const originals = Array.from(rail.children);
  if (originals.length < 2) return;
  const originalWidth = rail.scrollWidth;
  originals.forEach(item => rail.appendChild(item.cloneNode(true)));
  let paused = false;
  rail.addEventListener('mouseenter', () => { paused = true; });
  rail.addEventListener('mouseleave', () => { paused = false; });
  rail.addEventListener('pointerdown', () => { paused = true; });
  rail.addEventListener('pointerup', () => { paused = false; });
  rail.addEventListener('pointercancel', () => { paused = false; });
  listingProductAutoSlideTimer = setInterval(() => {
    if (paused || !rail.isConnected || document.hidden) return;
    rail.scrollLeft += 0.7;
    if (rail.scrollLeft >= originalWidth) rail.scrollLeft -= originalWidth;
  }, 25);
}
let listingVideoApiPromise = null;

function loadYouTubeIframeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (listingVideoApiPromise) return listingVideoApiPromise;
  listingVideoApiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      try { if (typeof previousReady === 'function') previousReady(); } catch {}
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error('YouTube Player API មិនអាចដំណើរការបានទេ។'));
    };
    let script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => reject(new Error('មិនអាចផ្ទុក YouTube Player API បានទេ។'));
      document.head.appendChild(script);
    }
  });
  return listingVideoApiPromise;
}

function stopListingVideoProgress() {
  if (listingVideoProgressTimer) {
    window.clearInterval(listingVideoProgressTimer);
    listingVideoProgressTimer = null;
  }
}

function closeListingVideoPopup() {
  listingVideoSession += 1;
  if (listingProductAutoSlideTimer) clearInterval(listingProductAutoSlideTimer);
  listingProductAutoSlideTimer = null;
  stopListingVideoProgress();
  if (listingVideoPlayer) {
    try { listingVideoPlayer.stopVideo(); } catch {}
    try { listingVideoPlayer.destroy(); } catch {}
    listingVideoPlayer = null;
  }
  const popup = $('homeShortsPopup');
  const stage = $('homeShortsPopupStage');
  if (stage) stage.replaceChildren();
  if (popup?.open) popup.close();
}

function openListingVideoPopup(url, title = 'វីដេអូ', meta = {}) {
  const videoId = youtubeVideoId(url);
  const popup = $('homeShortsPopup');
  const stage = $('homeShortsPopupStage');
  if (!videoId || !popup || !stage) {
    toast('YouTube Video Link មិនត្រឹមត្រូវទេ។', 'error');
    return;
  }

  closeListingVideoPopup();
  const session = listingVideoSession;
  const isProductGalleryPopup = meta.source === 'product-gallery';
  popup.classList.toggle('is-product-gallery-popup', isProductGalleryPopup);
  $('homeShortsPopupTitle').textContent = title || 'វីដេអូប្រកាស';
  const metaHost = $('homeShortsPopupMeta');
  if (metaHost) {
    const shopName = meta.storeName || 'ហាងអ្នកលក់';
    const shopAvatar = meta.storeAvatar || '';
    const currentId = String(meta.listingId || '');
    const vendorId = String(meta.vendorId || '');
    const category = String(meta.category || '');
    const renderShopMeta = () =>
      '<div class="home-shorts-shop-meta">' +
        (shopAvatar ? '<img src="' + esc(shopAvatar) + '" alt="' + esc(shopName) + '">' : '<span class="home-shorts-shop-fallback">' + esc(Array.from(shopName)[0] || 'S') + '</span>') +
        '<span class="home-shorts-shop-name">' + esc(shopName) + '</span>' +
        (meta.storeVerified ? verifiedStoreBadge(vendorId) : '') +
      '</div>';
    const renderCurrentProduct = () => {
      const image = meta.productImage || '';
      const price = meta.productPrice != null && meta.productPrice !== '' ? money(meta.productPrice) : '';
      return '<button type="button" class="home-shorts-current-product" data-related-product-id="' + esc(currentId) + '">' +
        (image ? '<img src="' + esc(image) + '" alt="" loading="lazy">' : '<span class="home-shorts-related-placeholder">' + ic('image',16) + '</span>') +
        '<span class="home-shorts-current-product-info"><strong>' + esc(meta.productTitle || title || 'ផលិតផល') + '</strong>' +
        (price ? '<span>' + esc(price) + '</span>' : '') + '</span></button>';
    };
    const renderProductSection = (sectionTitle, products, isSimilar = false) => {
      if (!products.length && !isSimilar) return '';
      const rows = products.map(product => {
        const productImage = (Array.isArray(product.product_images) ? product.product_images.slice().sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)).find(image => image?.image_url)?.image_url : '') ||
          (Array.isArray(product.images) ? product.images.map(image => typeof image === 'string' ? image : (image?.image_url || image?.url || '')).find(Boolean) : '') ||
          (Array.isArray(product.image_urls) ? product.image_urls.find(Boolean) : '') ||
          product.primary_image_url || product.image_url || product.cover_url || product.thumbnail_url || product.photo_url || '';
        const productPrice = product.price_label != null ? money(product.price_label) :
          product.price != null ? money(product.price) : '';
        return '<div class="home-shorts-related-row">' +
          '<button type="button" class="home-shorts-related-open" data-related-product-id="' + esc(product.id) + '">' +
            (productImage ? '<img src="' + esc(productImage) + '" alt="" loading="lazy">' : '<span class="home-shorts-related-placeholder">' + ic('image',16) + '</span>') +
            '<span class="home-shorts-related-title">' + esc(product.title || 'ផលិតផល') + '</span>' +
            (productPrice ? '<strong>' + esc(productPrice) + '</strong>' : '') +
          '</button>' +
        '</div>';
      }).join('');
      const content = rows || '<div class="home-shorts-related-empty">មិនទាន់មានផលិតផលស្រដៀងទេ</div>';
      return '<section class="home-shorts-product-section' + (isSimilar ? ' is-similar-products' : '') + '">' +
        (isSimilar
          ? '<div class="home-shorts-related-heading"><h4>' + esc(sectionTitle) + '</h4><div class="home-shorts-related-controls">' +
              '<button type="button" class="home-shorts-gallery-close" aria-label="បិទវីដេអូ">×</button>' +
            '</div></div>'
          : '<h4>' + esc(sectionTitle) + '</h4>') +
        '<div class="home-shorts-related-list">' + content + '</div></section>';
    };
    const renderContext = (shopProducts = [], similarProducts = []) => isProductGalleryPopup
      ? '<div class="home-shorts-popup-context">' + renderShopMeta() + renderCurrentProduct() +
        renderProductSection('ផលិតផលស្រដៀង', similarProducts, true) + '</div>'
      : renderShopMeta() + renderProductSection('ផលិតផលរបស់ហាង', shopProducts) + renderProductSection('ផលិតផលស្រដៀង', similarProducts);
    metaHost.innerHTML = renderContext();
    metaHost.hidden = false;
    {
      const loadRelatedProducts = async () => {
        const requests = [];
        if (vendorId) {
          const params = new URLSearchParams({ vendor_id: vendorId, limit: '50' });
          requests.push(api('/api/products?' + params.toString()).then(result => ({
            type: 'shop', products: Array.isArray(result.data) ? result.data : []
          })));
        }
        {
          const params = new URLSearchParams({ limit: '100' });
          if (category) params.set('category', category);
          requests.push(api('/api/products?' + params.toString()).then(result => ({
            type: 'similar', products: Array.isArray(result.data) ? result.data : []
          })));
        }
        const results = await Promise.allSettled(requests);
        if (session !== listingVideoSession || !metaHost.isConnected) return;
        let shopProducts = [], similarProducts = [];
        results.forEach(result => {
          if (result.status !== 'fulfilled') {
            console.warn('Could not load popup related products:', result.reason);
            return;
          }
          if (result.value.type === 'shop') {
            shopProducts = result.value.products.filter(product => product && String(product.id) !== currentId &&
              String(product.vendor_id || '') === vendorId).slice(0, 4);
          } else {
            similarProducts = result.value.products.filter(product => product && String(product.id) !== currentId &&
              (!category || String(product.category || '') === category)).slice(0, 12);
          }
        });
        metaHost.innerHTML = renderContext(shopProducts, similarProducts);
        if (isProductGalleryPopup) startListingProductAutoSlide(metaHost);
      };
      void loadRelatedProducts().catch(error => console.warn('Could not load popup related products:', error));
    }
    metaHost.onclick = event => {
      if (event.target.closest('.home-shorts-gallery-close')) {
        event.preventDefault();
        closeListingVideoPopup();
        return;
      }
      const scrollButton = event.target.closest('[data-related-scroll]');
      if (scrollButton) {
        event.preventDefault();
        const rail = metaHost.querySelector('.is-similar-products .home-shorts-related-list');
        if (rail) rail.scrollBy({ left: (scrollButton.dataset.relatedScroll === 'right' ? 1 : -1) * Math.max(160, rail.clientWidth * 0.75), behavior: 'smooth' });
        return;
      }
      const productButton = event.target.closest('[data-related-product-id]');
      if (productButton) {
        event.preventDefault();
        const productId = productButton.dataset.relatedProductId;
        closeListingVideoPopup();
        void openProduct(productId);
      }
    };
  }

  const playerShell = document.createElement('div');
  playerShell.className = 'custom-youtube-player';
  playerShell.innerHTML =
    '<div class="custom-youtube-screen">' +
      '<div class="custom-youtube-frame" id="customYoutubeFrame"></div>' +
      '<button type="button" class="custom-youtube-center-play" data-video-action="toggle" aria-label="ចាក់វីដេអូ"><span data-video-play-icon></span></button>' +
      '<div class="custom-youtube-loading">កំពុងផ្ទុកវីដេអូ...</div>' +
      '<div class="custom-youtube-controls">' +
      '<div class="custom-youtube-progress-row"><span class="custom-youtube-current">0:00</span><input class="custom-youtube-seek" data-video-seek type="range" min="0" max="1000" value="0" step="1" aria-label="ទីតាំងវីដេអូ"><span class="custom-youtube-duration">0:00</span></div>' +
      '<div class="custom-youtube-control-row">' +
        '<button type="button" data-video-action="toggle" aria-label="ចាក់ / ផ្អាក"><span data-video-play-icon>▶</span></button>' +
        '<button type="button" data-video-action="back" aria-label="ថយក្រោយ 10 វិនាទី">−10</button>' +
        '<button type="button" data-video-action="forward" aria-label="ទៅមុខ 10 វិនាទី">+10</button>' +
        '<button type="button" data-video-action="captions" aria-label="បើក/បិទ Caption" aria-pressed="false" title="បើក/បិទ Caption">CC</button>' +
        '<button type="button" data-video-action="mute" aria-label="បិទសំឡេង"><span data-video-volume-icon>🔊</span></button>' +
        '<input class="custom-youtube-volume" data-video-volume type="range" min="0" max="100" value="85" aria-label="កម្រិតសំឡេង">' +
        '<span class="custom-youtube-spacer"></span>' +
        '<button type="button" data-video-action="settings" aria-label="ការកំណត់">⚙</button>' +
        '<button type="button" data-video-action="fullscreen" aria-label="ពេញអេក្រង់">⛶</button>' +
      '</div>' +
      '<div class="custom-youtube-settings" hidden><label>ល្បឿនចាក់<select data-video-speed aria-label="ល្បឿនចាក់"><option value="0.5">0.5×</option><option value="0.75">0.75×</option><option value="1" selected>ធម្មតា 1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="1.75">1.75×</option><option value="2">2×</option></select></label></div>' +
      '</div>' +
    '</div>' +
    '';

  stage.replaceChildren(playerShell);

  // Drag the floating popup directly from the video surface with the left mouse button.
  // Keep custom controls interactive while making the YouTube iframe click-through.
  const videoScreen = playerShell.querySelector('.custom-youtube-screen');
  if (videoScreen && !videoScreen.dataset.popupDragBound) {
    videoScreen.dataset.popupDragBound = '1';
    let videoDrag = null;
    videoScreen.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('.custom-youtube-controls, button, input, select, a')) return;
      const rect = popup.getBoundingClientRect();
      videoDrag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: rect.left, top: rect.top };
      try { videoScreen.setPointerCapture(event.pointerId); } catch {}
      popup.style.position = 'fixed';
      popup.style.margin = '0';
      popup.style.transform = 'none';
      popup.style.left = rect.left + 'px';
      popup.style.top = rect.top + 'px';
      event.preventDefault();
    });
    videoScreen.addEventListener('pointermove', event => {
      if (!videoDrag || event.pointerId !== videoDrag.pointerId) return;
      const left = Math.max(8, Math.min(window.innerWidth - popup.offsetWidth - 8, videoDrag.left + event.clientX - videoDrag.startX));
      const top = Math.max(8, Math.min(window.innerHeight - popup.offsetHeight - 8, videoDrag.top + event.clientY - videoDrag.startY));
      popup.style.left = left + 'px';
      popup.style.top = top + 'px';
    });
    const stopVideoDrag = event => {
      if (videoDrag && event.pointerId === videoDrag.pointerId) videoDrag = null;
    };
    videoScreen.addEventListener('pointerup', stopVideoDrag);
    videoScreen.addEventListener('pointercancel', stopVideoDrag);
  }
  // Non-modal floating player: keep the marketplace interactive behind it.
  if (!popup.open) popup.show();

  const frameHost = playerShell.querySelector('#customYoutubeFrame');
  const seek = playerShell.querySelector('[data-video-seek]');
  const volume = playerShell.querySelector('[data-video-volume]');
  const settings = playerShell.querySelector('.custom-youtube-settings');
  const loading = playerShell.querySelector('.custom-youtube-loading');

  const formatTime = seconds => {
    const value = Math.max(0, Math.floor(Number(seconds) || 0));
    return Math.floor(value / 60) + ':' + String(value % 60).padStart(2, '0');
  };
  const setPlayingUi = playing => {
    const playSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13l10-6.5-10-6.5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
    const pauseSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8.5 5.5v13M15.5 5.5v13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    playerShell.querySelectorAll('[data-video-play-icon]').forEach(node => {
      node.innerHTML = playing ? pauseSvg : playSvg;
    });
    const centerPlay = playerShell.querySelector('.custom-youtube-center-play');
    if (centerPlay) {
      centerPlay.classList.toggle('is-playing', playing);
      centerPlay.setAttribute('aria-label', playing ? 'ផ្អាកវីដេអូ' : 'ចាក់វីដេអូ');
    }
  };
  const updateProgress = () => {
    if (!listingVideoPlayer || session !== listingVideoSession) return;
    try {
      const duration = listingVideoPlayer.getDuration() || 0;
      const current = listingVideoPlayer.getCurrentTime() || 0;
      seek.value = duration ? String(Math.round(current / duration * 1000)) : '0';
      playerShell.querySelector('.custom-youtube-current').textContent = formatTime(current);
      playerShell.querySelector('.custom-youtube-duration').textContent = formatTime(duration);
    } catch {}
  };

  let captionsEnabled = false;
  const captionsButton = playerShell.querySelector('[data-video-action="captions"]');
  playerShell.addEventListener('click', event => {
    const button = event.target.closest('[data-video-action]');
    if (!button || !listingVideoPlayer) return;
    const action = button.dataset.videoAction;
    try {
      if (action === 'toggle') {
        if (listingVideoPlayer.getPlayerState() === 1) listingVideoPlayer.pauseVideo();
        else listingVideoPlayer.playVideo();
      } else if (action === 'back') {
        listingVideoPlayer.seekTo(Math.max(0, listingVideoPlayer.getCurrentTime() - 10), true);
      } else if (action === 'forward') {
        listingVideoPlayer.seekTo(Math.min(listingVideoPlayer.getDuration() || Infinity, listingVideoPlayer.getCurrentTime() + 10), true);
      } else if (action === 'captions') {
        captionsEnabled = !captionsEnabled;
        if (captionsEnabled) listingVideoPlayer.loadModule('captions');
        else listingVideoPlayer.unloadModule('captions');
        captionsButton?.setAttribute('aria-pressed', String(captionsEnabled));
        captionsButton?.classList.toggle('is-active', captionsEnabled);
      } else if (action === 'mute') {
        if (listingVideoPlayer.isMuted()) listingVideoPlayer.unMute();
        else listingVideoPlayer.mute();
        playerShell.querySelector('[data-video-volume-icon]').textContent = listingVideoPlayer.isMuted() ? '🔇' : '🔊';
      } else if (action === 'settings') {
        settings.hidden = !settings.hidden;
      } else if (action === 'fullscreen') {
        if (document.fullscreenElement) document.exitFullscreen?.();
        else playerShell.requestFullscreen?.();
      }
    } catch {}
  });

  let seekCommitFrame = 0;
  const commitSeek = () => {
    if (!listingVideoPlayer || session !== listingVideoSession) return;
    const duration = listingVideoPlayer.getDuration() || 0;
    if (!duration) return;
    const targetTime = Math.max(0, Math.min(duration, Number(seek.value) / 1000 * duration));
    playerShell.querySelector('.custom-youtube-current').textContent = formatTime(targetTime);
    try { listingVideoPlayer.seekTo(targetTime, true); } catch {}
  };
  seek.addEventListener('input', () => {
    if (!listingVideoPlayer) return;
    const duration = listingVideoPlayer.getDuration() || 0;
    if (!duration) return;
    const targetTime = Math.max(0, Math.min(duration, Number(seek.value) / 1000 * duration));
    playerShell.querySelector('.custom-youtube-current').textContent = formatTime(targetTime);
    if (seekCommitFrame) cancelAnimationFrame(seekCommitFrame);
    seekCommitFrame = requestAnimationFrame(commitSeek);
  });
  seek.addEventListener('change', commitSeek);
  seek.addEventListener('pointerup', commitSeek);
  seek.addEventListener('keyup', event => { if (event.key.startsWith('Arrow') || event.key === 'Home' || event.key === 'End') commitSeek(); });
  volume.addEventListener('input', () => {
    if (!listingVideoPlayer) return;
    const level = Number(volume.value);
    listingVideoPlayer.setVolume(level);
    if (level > 0 && listingVideoPlayer.isMuted()) listingVideoPlayer.unMute();
    playerShell.querySelector('[data-video-volume-icon]').textContent = level === 0 ? '🔇' : '🔊';
  });
  playerShell.querySelector('[data-video-speed]').addEventListener('change', event => {
    try { listingVideoPlayer?.setPlaybackRate(Number(event.target.value)); } catch {}
  });

  loadYouTubeIframeApi().then(YT => {
    if (session !== listingVideoSession || !frameHost.isConnected) return;
    listingVideoPlayer = new YT.Player(frameHost, {
      width: '100%',
      height: '100%',
      videoId,
      playerVars: { autoplay: 1, cc_load_policy: 0, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, playsinline: 1, rel: 0, enablejsapi: 1, origin: window.location.origin },
      events: {
        onReady: event => {
          if (session !== listingVideoSession) {
            try { event.target.destroy(); } catch {}
            return;
          }
          loading.hidden = true;
          // Start with captions disabled; viewers can enable them with the CC control.
          captionsEnabled = false;
          captionsButton?.setAttribute('aria-pressed', 'false');
          captionsButton?.classList.remove('is-active');
          try { event.target.unloadModule('captions'); } catch {}
          try { event.target.setOption('captions', 'track', {}); } catch {}
          event.target.setVolume(Number(volume.value));
          event.target.playVideo();
          stopListingVideoProgress();
          listingVideoProgressTimer = window.setInterval(updateProgress, 250);
        },
        onStateChange: event => {
          if (session !== listingVideoSession) return;
          setPlayingUi(event.data === YT.PlayerState.PLAYING);
          if (!captionsEnabled) {
            try { listingVideoPlayer?.unloadModule('captions'); } catch {}
            try { listingVideoPlayer?.setOption('captions', 'track', {}); } catch {}
          }
          if (event.data === YT.PlayerState.ENDED) {
            updateProgress();
            stopListingVideoProgress();
          } else if (event.data === YT.PlayerState.PLAYING && !listingVideoProgressTimer) {
            listingVideoProgressTimer = window.setInterval(updateProgress, 250);
          }
        },
        onError: () => {
          if (session !== listingVideoSession) return;
          loading.textContent = 'មិនអាចចាក់វីដេអូនេះបានទេ។ សូមពិនិត្យ Link YouTube។';
          loading.hidden = false;
        }
      }
    });
  }).catch(error => {
    if (session !== listingVideoSession) return;
    loading.textContent = error.message || 'មិនអាចផ្ទុក YouTube Player បានទេ។';
    loading.hidden = false;
  });
}
function listingVideoButton(item) {
  if (!item?.youtube_video_url || !youtubeVideoId(item.youtube_video_url)) return '';
  const store = item.vendors || item.vendor || {};
  const poster = item.poster || {};
  const image = (Array.isArray(item.image_urls) ? item.image_urls[0] : '') || item.image_url || item.cover_url || '';
  const price = item.price_label == null ? '' : money(item.price_label);
  const meta = {
    storeName: store.store_name || item.store_name || 'ហាងអ្នកលក់',
    storeAvatar: store.store_logo_url || store.logo_url || '',
    listingId: item.id || '',
    vendorId: item.vendor_id || store.id || '',
    category: item.category || ''
  };
  return '<button type="button" class="listing-video-open" data-listing-video="' + esc(item.youtube_video_url) + '" data-listing-video-title="' + esc(item.title || 'វីដេអូប្រកាស') + '" data-video-store-name="' + esc(meta.storeName) + '" data-video-store-avatar="' + esc(meta.storeAvatar) + '" data-video-listing-id="' + esc(meta.listingId) + '" data-video-vendor-id="' + esc(meta.vendorId) + '" data-video-category="' + esc(meta.category) + '">' + ic('play',17) + '<span>មើលវីដេអូ YouTube</span></button>';
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
  if ($('heroShield')) $('heroShield').innerHTML = ic('shield', 15);
  if ($('heroUsers')) $('heroUsers').innerHTML = ic('users', 15);
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

  document.querySelectorAll('[data-icon]').forEach((node) => { node.innerHTML = ic(node.dataset.icon, Number(node.dataset.iconSize) || 18); });
  document.querySelectorAll('[data-seller-icon]').forEach((node) => { node.innerHTML = ic(node.dataset.sellerIcon, 16); });
  document.querySelectorAll('[data-nav-icon]').forEach((node) => { node.innerHTML = ic(node.dataset.navIcon, node.dataset.navIcon === 'chat' ? 22 : 19); });
  document.querySelectorAll('.close-btn').forEach((b) => { b.innerHTML = ic('x', 16); });
}

function jobsSalaryValue(job) {
  const min = Number(job.salary_min);
  const max = Number(job.salary_max);
  if (Number.isFinite(min) && job.salary_min !== null && job.salary_min !== '') return min;
  if (Number.isFinite(max) && job.salary_max !== null && job.salary_max !== '') return max;
  return null;
}

function renderJobs() {
  const root = $('jobsList');
  if (!root) return;
  const query = $('jobsSearchInput')?.value?.trim() || '';
  const category = state.activeJobCategory || 'all';
  const subcategory = state.activeJobSubcategory || 'all';
  const sort = state.jobsSort || 'newest';
  let jobs = (state.jobs || []).filter(job => subcategory === 'all' || String(job.subcategory || '') === subcategory);
  if (sort === 'salary_asc' || sort === 'salary_desc') {
    jobs.sort((a,b) => {
      const av = jobsSalaryValue(a), bv = jobsSalaryValue(b);
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return sort === 'salary_asc' ? av - bv : bv - av;
    });
  } else {
    jobs.sort((a,b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }
  const heading = document.querySelector('.jobs-results-heading b');
  if (heading) {
    const active = $('jobsCategoryList')?.querySelector('[data-job-category].is-active');
    heading.textContent = category === 'all' ? 'ការងារទាំងអស់' : (active?.textContent?.trim() || 'ការងារ');
  }
  const count = $('jobsResultCount');
  if (count) count.textContent = jobs.length + ' ការងារ';
  if (!jobs.length) {
    root.innerHTML = `<div class="jobs-empty-state"><span aria-hidden="true">▤</span><b>មិនមានការងារត្រូវនឹងលក្ខខណ្ឌទេ</b><p>${query ? 'សូមសាកល្បងពាក្យស្វែងរកផ្សេង។' : 'ការងារថ្មីៗនឹងបង្ហាញនៅទីនេះ នៅពេលមានការប្រកាស។'}</p></div>`;
    return;
  }
  root.innerHTML = jobs.map(job => {
    const image = job.image_url || job.image_urls?.[0] || '';
    const salary = job.price_label === 'ចរចា' ? 'ចរចាប្រាក់ខែ' : (job.price_label ? '$' + String(job.price_label).replace(' - ', ' - $') : 'ទាក់ទងសួរប្រាក់ខែ');
    return `<button type="button" class="jobs-result-card" data-job-open="${esc(job.id)}">
      <span class="jobs-result-image">${image ? `<img src="${esc(image)}" alt="" loading="lazy">` : ic('briefcase',22)}</span>
      <span class="jobs-result-content">
        <span class="jobs-result-poster"><span class="listing-poster-avatar">${job.poster?.avatar_url ? `<img src="${esc(job.poster.avatar_url)}" alt="">` : esc(Array.from(job.poster?.display_name || '7')[0])}</span><b>${esc(job.poster?.display_name || job.company_name || 'អ្នកប្រើប្រាស់')}</b><time>${timeAgoKm(job.created_at)}</time></span>
        <b>${esc(job.title || 'ការងារ')}</b>
        <small>${esc(job.company_name || 'និយោជក')} · ${esc(job.location || 'កម្ពុជា')}</small>
        <strong>${esc(salary)}${({hourly:' / ម៉ោង',daily:' / ថ្ងៃ',monthly:' / ខែ'}[job.salary_period] || '')}</strong>
      </span>
      <span class="jobs-result-arrow" aria-hidden="true">›</span>
    </button>`;
  }).join('');
}

function scheduleSkeleton(render, delay = 160) {
  let timer = setTimeout(render, delay);
  return () => { if (timer) { clearTimeout(timer); timer = null; } };
}

function renderJobsSkeleton() {
  const root = $('jobsList');
  if (!root) return;
  const bar = (className = '') => `<span class="skeleton jobs-skeleton-block ${className}" aria-hidden="true"></span>`;
  root.innerHTML = Array.from({ length: 5 }, (_, index) => `
    <div class="jobs-result-card jobs-skeleton-card" aria-hidden="true">
      <span class="jobs-result-image jobs-skeleton-image">${bar('jobs-sk-image')}</span>
      <span class="jobs-result-content jobs-skeleton-content">
        <span class="jobs-result-poster jobs-skeleton-poster">
          ${bar('jobs-sk-avatar')}${bar('jobs-sk-poster-name')}${bar('jobs-sk-time')}
        </span>
        ${bar('jobs-sk-title ' + (index % 2 ? 'is-short' : ''))}
        ${bar('jobs-sk-company')}
        ${bar('jobs-sk-salary')}
      </span>
      <span class="jobs-result-arrow" aria-hidden="true">${bar('jobs-sk-arrow')}</span>
    </div>`).join('');
}

async function loadJobs() {
  const requestId = ++state.jobsRequestId;
  const params = new URLSearchParams({ limit: '50', type: 'job' });
  const query = $('jobsSearchInput')?.value?.trim() || '';
  if (query) params.set('q', query);
  if (state.activeJobCategory && state.activeJobCategory !== 'all') params.set('category', state.activeJobCategory);
  const root = $('jobsList');
  if (root) root.setAttribute('aria-busy','true');
  const cancelSkeleton = root ? scheduleSkeleton(renderJobsSkeleton) : () => {};
  try {
    const result = await api('/api/marketplace/listings?' + params.toString());
    if (requestId !== state.jobsRequestId) return;
    cancelSkeleton();
    state.jobs = Array.isArray(result.data) ? result.data : [];
    renderJobs();
  } catch (error) {
    if (requestId !== state.jobsRequestId) return;
    cancelSkeleton();
    state.jobs = [];
    renderJobs();
    toast('មិនអាចទាញយកការងារបានទេ៖ ' + error.message, 'error');
  } finally {
    cancelSkeleton();
    if (requestId === state.jobsRequestId && root) root.setAttribute('aria-busy','false');
  }
}

function renderJobSubcategories() {
  const root = $('jobsSubcategoryList');
  if (!root) return;
  const category = state.activeJobCategory;
  const subs = category === 'all' ? [] : (LISTING_TAXONOMY.jobs[category]?.subs || []);
  if (!subs.length) {
    root.hidden = true;
    root.innerHTML = '';
    state.activeJobSubcategory = 'all';
    return;
  }
  root.hidden = false;
  root.innerHTML = ['all', ...subs].map((value,index) => {
    const label = index === 0 ? 'ទាំងអស់' : value;
    const selected = state.activeJobSubcategory === value;
    return `<button type="button" data-job-subcategory="${esc(value)}" class="${selected ? 'is-active' : ''}">${esc(label)}</button>`;
  }).join('');
}

function bindEvents() {
  // Jobs category, subcategory, keyword and salary sorting filters.
  const jobsSearch = $('jobsSearchInput');
  const jobsCategories = $('jobsCategoryList');
  jobsCategories?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-job-category]');
    if (!button) return;
    state.activeJobCategory = button.dataset.jobCategory || 'all';
    state.activeJobSubcategory = 'all';
    jobsCategories.querySelectorAll('[data-job-category]').forEach(item => item.classList.toggle('is-active', item === button));
    renderJobSubcategories();
    void loadJobs();
  });
  $('jobsSubcategoryList')?.addEventListener('click', event => {
    const button = event.target.closest('[data-job-subcategory]');
    if (!button) return;
    state.activeJobSubcategory = button.dataset.jobSubcategory || 'all';
    $('jobsSubcategoryList').querySelectorAll('[data-job-subcategory]').forEach(item => item.classList.toggle('is-active', item === button));
    renderJobs();
  });
  $('jobsSortSelect')?.addEventListener('change', event => {
    state.jobsSort = event.target.value || 'newest';
    renderJobs();
  });
  jobsSearch?.addEventListener('input', () => {
    clearTimeout(window.jobsSearchWait);
    window.jobsSearchWait = setTimeout(() => void loadJobs(), 300);
  });
  $('jobsList')?.addEventListener('click', event => {
    const card = event.target.closest('[data-job-open]');
    if (!card) return;
    void openMarketplaceListing('job', card.dataset.jobOpen);
  });

  // Search & Category Filters
  document.querySelectorAll('[data-property-type]').forEach((button) => {
    button.addEventListener('click', () => setPropertyType(button.dataset.propertyType));
  });
  document.querySelectorAll('[data-listing-type]').forEach((button) => {
    button.addEventListener('click', () => setListingType(button.dataset.listingType));
  });
  $('homeShortsPopupClose')?.addEventListener('click', closeListingVideoPopup);
  (() => {
    const dialog = $('homeShortsPopup');
    if (!dialog || dialog.dataset.popupControlsBound) return;
    dialog.dataset.popupControlsBound = '1';

    // Keep dragging optional: the old metadata/header strip is intentionally removed.
    const handle = dialog.querySelector('#homeShortsPopupMeta') || dialog.querySelector('.home-shorts-popup-head');
    if (handle) {
      let dragState = null;
      handle.dataset.dragBound = '1';
      handle.style.cursor = 'move';
      handle.style.touchAction = 'none';
      handle.addEventListener('pointerdown', event => {
        if (event.target.closest('button, a, input, select, textarea, [data-related-product-id]')) return;
        const rect = dialog.getBoundingClientRect();
        dragState = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
        try { handle.setPointerCapture(event.pointerId); } catch {}
        dialog.style.position = 'fixed';
        dialog.style.margin = '0';
        dialog.style.transform = 'none';
        dialog.style.left = rect.left + 'px';
        dialog.style.top = rect.top + 'px';
        event.preventDefault();
      });
      dialog.addEventListener('pointermove', event => {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        const left = Math.max(8, Math.min(window.innerWidth - dialog.offsetWidth - 8, dragState.left + event.clientX - dragState.x));
        const top = Math.max(8, Math.min(window.innerHeight - dialog.offsetHeight - 8, dragState.top + event.clientY - dragState.y));
        dialog.style.left = left + 'px';
        dialog.style.top = top + 'px';
      });
      const stopDrag = event => { if (dragState && event.pointerId === dragState.pointerId) dragState = null; };
      dialog.addEventListener('pointerup', stopDrag);
      dialog.addEventListener('pointercancel', stopDrag);
    }

    // Resize handles must be installed even when the popup header is absent.
    ['n','s','e','w','ne','nw','se','sw'].forEach(edge => {
      const grip = document.createElement('span');
      grip.className = 'home-shorts-resize-handle';
      grip.dataset.edge = edge;
      grip.setAttribute('aria-hidden', 'true');
      dialog.appendChild(grip);
      let resize = null;
      grip.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        const rect = dialog.getBoundingClientRect();
        resize = { id: event.pointerId, edge, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, width: rect.width };
        grip.setPointerCapture(event.pointerId);
        dialog.style.position = 'fixed';
        dialog.style.margin = '0';
        dialog.style.transform = 'none';
        dialog.style.left = rect.left + 'px';
        dialog.style.top = rect.top + 'px';
        event.preventDefault();
        event.stopPropagation();
      });
      grip.addEventListener('pointermove', event => {
        if (!resize || event.pointerId !== resize.id) return;
        const dx = event.clientX - resize.x;
        const dy = event.clientY - resize.y;
        const e = resize.edge;
        const horizontal = e.includes('e') ? dx : e.includes('w') ? -dx : 0;
        const vertical = e.includes('s') ? dy : e.includes('n') ? -dy : 0;
        const delta = horizontal || (vertical ? vertical * 16 / 9 : 0);
        const maxWidth = Math.max(650, window.innerWidth - 16);
        const width = Math.max(650, Math.min(maxWidth, resize.width + delta));
        dialog.style.width = width + 'px';
        if (e.includes('w')) dialog.style.left = (resize.left + resize.width - width) + 'px';
        if (e.includes('n')) dialog.style.top = Math.max(8, resize.top + (resize.width - width) * 9 / 16) + 'px';
      });
      const stop = event => { if (resize && event.pointerId === resize.id) resize = null; };
      grip.addEventListener('pointerup', stop);
      grip.addEventListener('pointercancel', stop);
    });

    dialog.addEventListener('close', () => {
      dialog.style.left = '';
      dialog.style.top = '';
      dialog.style.position = '';
      dialog.style.margin = '';
      dialog.style.transform = '';
      dialog.style.width = '';
      dialog.style.height = '';
    });
  })();
  $('homeShortsPopup')?.addEventListener('close', closeListingVideoPopup);
  document.addEventListener('click', event => {
    const videoButton = event.target.closest('[data-listing-video]');
    if (videoButton) openListingVideoPopup(videoButton.dataset.listingVideo, videoButton.dataset.listingVideoTitle || 'វីដេអូប្រកាស', {
      storeName: videoButton.dataset.videoStoreName,
      storeAvatar: videoButton.dataset.videoStoreAvatar,
      listingId: videoButton.dataset.videoListingId,
      vendorId: videoButton.dataset.videoVendorId,
      category: videoButton.dataset.videoCategory
    });
  });
  $('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    state.searchTerm = $('searchInput').value.trim();
    state.activeCategory = $('searchCategory').value;
    if (state.activeCategory !== 'all') state.activeListingType = 'product';
    updateMarketplaceCategoryHeading();
    document.querySelectorAll('[data-listing-type]').forEach((b) => b.classList.toggle('active', b.dataset.listingType === state.activeListingType));
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
    state.activeSpecFilters = {};
    state.activeSubcategory = 'all';
    state.activeDetailType = 'all';
    state.specPriceMin = '';
    state.specPriceMax = '';
    document.querySelectorAll('[data-spec-filter]').forEach(input => { input.checked = false; });
    document.querySelectorAll('[data-price-filter]').forEach(input => { input.value = ''; });
    document.querySelector('[data-condition-filter][value="all"]')?.click();
    $('searchInput').value = '';
    setCategory('all');
  });

  // Marketplace sort controls
  const sortButtons = document.querySelectorAll('[data-sort-value]');
  const syncMarketplaceSortState = () => {
    sortButtons.forEach((button) => {
      const active = button.dataset.sortValue === state.marketplaceSort;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  syncMarketplaceSortState();
  $('specificationFilters')?.addEventListener('change', event => {
    const subcategoryInput = event.target.closest('[data-subcategory-filter]');
    if (subcategoryInput) {
      state.activeSubcategory = subcategoryInput.value || 'all';
      state.activeDetailType = 'all';
      state.activeSpecFilters = {};
      renderProducts();
      return;
    }
    const detailTypeInput = event.target.closest('[data-detail-type-filter]');
    if (detailTypeInput) {
      state.activeDetailType = detailTypeInput.value || 'all';
      state.activeSpecFilters = {};
      renderProducts();
      return;
    }
    const input = event.target.closest('[data-spec-filter]');
    if (input) {
      const key = input.dataset.specFilter;
      const selected = new Set(state.activeSpecFilters[key] || []);
      if (input.checked) selected.add(input.value); else selected.delete(input.value);
      state.activeSpecFilters[key] = [...selected];
      renderProducts();
      return;
    }
    const priceInput = event.target.closest('[data-price-filter]');
    if (priceInput) {
      state.specPriceMin = $('specificationFilters').querySelector('[data-price-filter="min"]')?.value || '';
      state.specPriceMax = $('specificationFilters').querySelector('[data-price-filter="max"]')?.value || '';
      renderProducts();
    }
  });

  document.querySelector('.amazon-filter-sidebar')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-sort-value]');
    if (!button) return;
    const sortValue = button.dataset.sortValue;
    if (!['low', 'high', 'newest'].includes(sortValue)) return;
    state.marketplaceSort = sortValue;
    syncMarketplaceSortState();
    renderProducts();
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
    const copyId=e.target.closest('[data-copy-product-code]');
    if(copyId){e.preventDefault();e.stopPropagation();void copyProductCode(copyId);return;}
    const otherListing = e.target.closest('[data-action="view-listing"]');
    if (otherListing) { openMarketplaceListing(otherListing.dataset.type, otherListing.dataset.id); return; }
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
    if (routeName === 'product' && ['job', 'real_estate'].includes(routeParts[1]) && routeParts[2]) {
      let listingId = '';
      try { listingId = decodeURIComponent(routeParts[2]); } catch {}
      if (activeView === 'product' && String(state.currentProduct?.id || '') === listingId && state.currentProduct?.listing_type === routeParts[1]) return;
      const navigationId = ++state.routeSyncNavigationId;
      void openMarketplaceListing(routeParts[1], listingId, { preserveScroll: true, routeSyncNavigationId: navigationId });
      return;
    }
    if (routeName === 'product' && routeId) {
      if (activeView === 'product' && String(state.currentProduct?.id || '') === routeId && !state.currentProduct?.listing_type) return;
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

  $('postAdBtn').addEventListener('click', () => { if (requireLogin()) openListingTypeChooser(); });
  $('mobilePostBtn').addEventListener('click', () => $('postAdBtn').click());
  $('mobileMarketPost')?.addEventListener('click', () => $('postAdBtn').click());
  $('heroPostBtn')?.addEventListener('click', () => $('postAdBtn')?.click());
  document.querySelectorAll('[data-create-kind]').forEach((button) => button.addEventListener('click', () => {
    const kind = button.dataset.createKind;
    closeModal('listingTypeModal');
    if (kind === 'product') {
      if (isSellerAccount()) renderProductForm();
      else openSellerModal();
    } else if (kind === 'job') openJobListingForm();
    else if (kind === 'real_estate') openPropertyListingForm();
  }));
  $('productCategory').addEventListener('change', () => renderProductTaxonomy($('productCategory').value));
  $('productDetailType').addEventListener('change', () => renderProductSpecFields($('productCategory').value));
  $('jobCategory').addEventListener('change', () => { fillTaxonomySelect($('jobCategory'), $('jobSubcategory'), $('jobDetailType'), LISTING_TAXONOMY.jobs); renderListingSpecFields('job', $('jobCategory').value); });
  $('propertyCategory').addEventListener('change', () => { fillTaxonomySelect($('propertyCategory'), $('propertySubcategory'), $('propertyDetailType'), LISTING_TAXONOMY.properties); renderListingSpecFields('property', $('propertyCategory').value); });
  bindListingImageAlbums();
  $('jobListingForm').addEventListener('submit', (event) => { event.preventDefault(); void submitNewListing(event.currentTarget, '/api/jobs', 'job'); });
  $('propertyListingForm').addEventListener('submit', (event) => { event.preventDefault(); void submitNewListing(event.currentTarget, '/api/real-estate', 'property'); });
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
  $('productYoutubeVideoUrl')?.addEventListener('input', updateProductYoutubePreview);
  $('productImage')?.addEventListener('change', (event) => {
    const selected = Array.from(event.currentTarget.files || []);
    const current = state.selectedProductImages || [];
    const accepted = [];
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
    for (const file of selected) {
      if (!allowed.has(file.type)) { toast('សូមប្រើ JPG, PNG ឬ WEBP ប៉ុណ្ណោះ។', 'error'); continue; }
      if (file.size > 20 * 1024 * 1024) { toast('រូបភាពនីមួយៗមិនអាចធំជាង ២០MB បានទេ។', 'error'); continue; }
      if (current.length + accepted.length >= 10) { toast('អាចដាក់រូបភាពបានអតិបរមា ១០ រូបប៉ុណ្ណោះ។', 'error'); break; }
      accepted.push({ kind: 'new', file: file, previewUrl: URL.createObjectURL(file) });
    }
    state.selectedProductImages = current.concat(accepted);
    syncProductImageFileInput();
    renderProductImageAlbum();
    event.currentTarget.value = '';
  });
  $('productImageAlbum')?.addEventListener('click', (event) => {
    const mainButton = event.target.closest('[data-product-image-main]');
    const removeButton = event.target.closest('[data-product-image-remove]');
    const images = state.selectedProductImages || [];
    if (mainButton) {
      const index = Number(mainButton.dataset.productImageMain);
      if (index > 0 && images[index]) { images.unshift(images.splice(index, 1)[0]); renderProductImageAlbum(); }
      return;
    }
    if (removeButton) {
      const index = Number(removeButton.dataset.productImageRemove);
      const removed = images[index];
      if (!removed) return;
      if (removed.kind === 'new' && removed.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      images.splice(index, 1);
      syncProductImageFileInput();
      renderProductImageAlbum();
    }
  });

  $('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveButton = $('productSaveButton');
    if (saveButton?.disabled) return;
    const id = $('editProductId').value;
    const selectedImages = (state.selectedProductImages || []).slice();
    const newImages = selectedImages.filter((item) => item.kind === 'new');
    const existingImages = selectedImages.filter((item) => item.kind === 'existing');
    if (selectedImages.length > 10) { toast('អាចដាក់រូបភាពបានអតិបរមា ១០ រូប។', 'error'); return; }
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
    if (newImages.some((item) => !allowed.has(item.file.type) || item.file.size > 20 * 1024 * 1024)) {
      toast('សូមប្រើ JPG / PNG / WEBP ហើយរូបនីមួយៗមិនលើស ២០MB។', 'error'); return;
    }
    const shortDesc = $('productShortDesc').value.trim();
    const fullDesc = $('productDescription').value.trim();
    if (!$('productLocation').value.trim()) { toast('សូមជ្រើសរើសទីតាំងដល់កម្រិតភូមិ។', 'error'); return; }
    const payload = {
      title: $('productTitle').value.trim(), price: Number($('productPrice').value),
      category: $('productCategory').value, location: $('productLocation').value,
      condition: $('productCondition').value, short_description: shortDesc,
      description: shortDesc + PRODUCT_DESC_SEPARATOR + fullDesc, stock: 1,
      youtube_video_url: $('productYoutubeVideoUrl').value.trim()
    };
    const originalSaveButtonHTML = saveButton?.innerHTML || '';
    if (saveButton) {
      saveButton.disabled = true;
      saveButton.setAttribute('aria-busy', 'true');
      saveButton.innerHTML = '<span class="product-save-spinner" aria-hidden="true"></span><span>កំពុងរក្សាទុក...</span>';
    }
    try {
      const r = id
        ? await api('/api/products/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify(payload) })
        : await api('/api/products', { method: 'POST', body: JSON.stringify(payload) });
      const productId = r.data.id;
      const existingProduct = id ? state.sellerProductCache.find((item) => String(item.id) === String(id)) : null;
      const keepIds = new Set(existingImages.map((item) => String(item.id)));
      for (const oldImage of (existingProduct?.product_images || [])) {
        if (oldImage.id && !keepIds.has(String(oldImage.id))) {
          await api('/api/products/' + encodeURIComponent(productId) + '/images/' + encodeURIComponent(oldImage.id), { method: 'DELETE' });
        }
      }
      let uploadedImages = [];
      const uploadStatus = $('productUploadStatus');
      const uploadLabel = $('productUploadLabel');
      const uploadProgress = $('productUploadProgressBar');
      if (uploadStatus) uploadStatus.hidden = newImages.length === 0;
      if (uploadProgress) uploadProgress.style.width = '0%';
      if (newImages.length) {
        const form = new FormData();
        newImages.forEach(item => form.append('images', item.file));
        if (uploadLabel) uploadLabel.textContent = 'កំពុង Upload រូបភាព ' + newImages.length + ' រូប · 0%';
        const uploaded = await apiUploadWithProgress(
          '/api/products/' + encodeURIComponent(productId) + '/images',
          form,
          percent => {
            if (uploadLabel) uploadLabel.textContent = 'កំពុង Upload រូបភាព ' + newImages.length + ' រូប · ' + percent + '%';
            if (uploadProgress) uploadProgress.style.width = percent + '%';
          }
        );
        uploadedImages = uploaded.data || [];
      }
      if (uploadStatus) uploadStatus.hidden = true;
      const uploadedByFile = new Map(newImages.map((item, index) => [item, uploadedImages[index]]));
      const orderedIds = selectedImages.map((item) => item.kind === 'existing' ? item.id : uploadedByFile.get(item)?.id).filter(Boolean);
      if (orderedIds.length) {
        await api('/api/products/' + encodeURIComponent(productId) + '/images/order', {
          method: 'PATCH', body: JSON.stringify({ image_ids: orderedIds })
        });
      }
      try {
        await api('/api/products/' + encodeURIComponent(productId) + '/listing-details', {
          method: 'PUT',
          body: JSON.stringify({
            category: payload.category,
            subcategory: $('productSubcategory').value,
            detail_type: $('productDetailType').value,
            specifications: {...collectListingSpecs($('productForm')), ...($('productForm').elements.google_map_url?.value.trim() ? {google_map_url:$('productForm').elements.google_map_url.value.trim()} : {})},
            province_code: $('productProvinceCode').value,
            district_code: $('productDistrictCode').value,
            commune_code: $('productCommuneCode').value,
            village_code: $('productVillageCode').value
          })
        });
      } catch (detailsError) {
        console.warn('Product taxonomy details were not saved:', detailsError.message);
      }
      revokeProductImagePreviews();
      closeModal('productFormModal');
      toast('បានរក្សាទុកទំនិញជោគជ័យ!');
      await Promise.all([renderSeller(), loadProducts()]);
    } catch (err) {
      toast(err.message || 'មិនអាចរក្សាទុកទំនិញបានទេ។', 'error');
    } finally {
      if ($('productUploadStatus')) $('productUploadStatus').hidden = true;
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.removeAttribute('aria-busy');
        saveButton.innerHTML = originalSaveButtonHTML;
      }
    }
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
      } else if (actionBtn.dataset.sellerAction === 'delete') {
        if (!(await appDialog({ title:'លុបទំនិញ', message:'តើអ្នកពិតជាចង់លុបទំនិញនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានទេ។', confirmLabel:'លុបទំនិញ', danger:true }))) return;
        await api('/api/products/' + id, { method: 'DELETE' });
        toast('បានលុបទំនិញរួចរាល់។');
        await Promise.all([renderSeller(), loadProducts()]);
      }
    }
  });

  // Unified Chat Events
  $('supportChatLauncher').addEventListener('click', toggleSellerChatPanel);
  $('sellerChatClose').addEventListener('click', minimizeSellerChatPanel);
  $('sellerChatHeaderBack').addEventListener('click', () => void openSellerChatInbox());
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
        });
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
      document.querySelector('.seller-chat-image-preview')?.remove();
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

  // Shared image preview for image upload controls across the marketplace.
  // Product album and existing profile/document previews keep their dedicated flows.
  const uploadPreviewUrls = new WeakMap();
  const uploadPreviewNodes = new WeakMap();
  const posterPreviewTargets = {
    posterUploadTop: 'posterPreviewTop',
    posterUploadMiddle: 'posterPreviewMiddle',
    posterUploadTall: 'posterPreviewTall'
  };
  document.addEventListener('change', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== 'file') return;
    if (!String(input.accept || '').toLowerCase().includes('image')) return;
    if (['productImage', 'avatarUpload', 'coverUpload', 'sellerDocument'].includes(input.id)) return;

    const files = Array.from(input.files || []).filter(file => file.type.startsWith('image/'));
    const previousUrls = uploadPreviewUrls.get(input) || [];
    previousUrls.forEach(url => URL.revokeObjectURL(url));
    uploadPreviewUrls.set(input, []);

    const targetId = posterPreviewTargets[input.id];
    const existingTarget = targetId ? $(targetId) : null;
    let preview = existingTarget || uploadPreviewNodes.get(input);
    if (!preview) {
      preview = document.createElement('div');
      preview.className = 'global-image-upload-preview';
      const anchor = input.closest('label') || input;
      anchor.insertAdjacentElement('afterend', preview);
      uploadPreviewNodes.set(input, preview);
    }
    preview.replaceChildren();
    if (!files.length) {
      if (targetId) preview.textContent = 'Preview';
      else { preview.remove(); uploadPreviewNodes.delete(input); }
      return;
    }

    const urls = files.map(file => URL.createObjectURL(file));
    uploadPreviewUrls.set(input, urls);
    const grid = document.createElement('div');
    grid.className = 'global-image-upload-grid';
    files.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'global-image-upload-item';
      const image = document.createElement('img');
      image.src = urls[index];
      image.alt = file.name || 'Image preview';
      image.loading = 'lazy';
      item.appendChild(image);
      if (files.length > 1) {
        const name = document.createElement('span');
        name.textContent = file.name;
        item.appendChild(name);
      }
      grid.appendChild(item);
    });
    preview.appendChild(grid);
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

  const selectProfileTab = (tab) => { if (!['saved', 'history', 'my-posts', 'seller'].includes(tab) || !requireLogin()) return; state.profileTab = tab; document.querySelectorAll('[data-profile-tab]').forEach((b) => { const active = b.dataset.profileTab === tab; b.classList.toggle('is-active', active); b.classList.toggle('active', active); }); void renderProfileTab(); };
  document.querySelectorAll('[data-profile-tab]').forEach((b) => b.addEventListener('click', () => selectProfileTab(b.dataset.profileTab)));
  document.querySelectorAll('[data-profile-jump]').forEach((b) => b.addEventListener('click', () => selectProfileTab(b.dataset.profileJump)));
  $('profileApplyTop')?.addEventListener('click', () => state.me?.vendor ? showView('seller') : openSellerModal());
  $('profileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); if (!requireLogin()) return;
    try { await api('/api/me', { method: 'PATCH', body: JSON.stringify({ display_name: $('profileName')?.value.trim() || '', phone: $('profilePhone')?.value.trim() || '', province: $('profileLocation')?.value || '', bio: $('profileBio')?.value.trim() || '' }) }); await refreshSession(); toast('បានរក្សាទុកព័ត៌មាន Profile ជោគជ័យ!'); await renderProfileTab(); }
    catch (err) { toast(err.message || 'មិនអាចរក្សាទុក Profile បានទេ។', 'error'); }
  });
  // Profile settings dialogs (forms and Telegram widget IDs remain unchanged).
  document.querySelectorAll('[data-open-profile-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      const dialog = $(button.dataset.openProfileModal);
      if (dialog && !dialog.open) dialog.showModal();
    });
  });
  document.querySelectorAll('[data-close-profile-modal]').forEach((button) => {
    button.addEventListener('click', () => $(button.dataset.closeProfileModal)?.close());
  });
  ['profileInfoModal', 'telegramSecurityModal'].forEach((id) => {
    const dialog = $(id);
    dialog?.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
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
  $('profileTabContent')?.addEventListener('click', async (e) => {
    const action = e.target.closest('[data-my-post-action]');
    if (action) {
      const { type, id } = action.dataset;
      if (action.dataset.myPostAction === 'edit') {
        state.myPostEditing = type + ':' + id;
        renderMyPostsList();
        return;
      }
      if (action.dataset.myPostAction === 'cancel') {
        state.myPostEditing = null;
        renderMyPostsList();
        return;
      }
      const labels = { renew:'Renew ប្រកាសនេះ?', expire:'បញ្ចប់សុពលភាពប្រកាសនេះ?', delete:'លុបប្រកាសនេះមែនទេ?' };
      const verb = action.dataset.myPostAction;
      if (!(await appDialog({ title:verb === 'delete' ? 'លុបប្រកាស' : verb === 'renew' ? 'បន្តសុពលភាពប្រកាស' : 'បញ្ចប់សុពលភាពប្រកាស', message:labels[verb] || 'តើអ្នកចង់បន្តសកម្មភាពនេះមែនទេ?', confirmLabel:verb === 'delete' ? 'លុបប្រកាស' : 'បញ្ជាក់', danger:verb === 'delete' }))) return;
      try {
        let response;
        if (verb === 'delete') response = await api('/api/my-posts/' + encodeURIComponent(type) + '/' + encodeURIComponent(id), { method:'DELETE' });
        else response = await api('/api/my-posts/' + encodeURIComponent(type) + '/' + encodeURIComponent(id), { method:'PATCH', body:JSON.stringify({ action:verb }) });
        toast(verb === 'delete' && response?.archived ? 'ប្រកាសនេះមានប្រវត្តិលក់ ដូច្នេះបានដាក់ Archive។' : verb === 'delete' ? 'បានលុបប្រកាសរួចរាល់។' : verb === 'renew' ? 'បាន Renew ប្រកាសជោគជ័យ។' : 'បានបញ្ចប់សុពលភាពប្រកាស។');
        await renderMyPosts();
      } catch (err) { toast(err.message || 'មិនអាចធ្វើសកម្មភាពបានទេ។', 'error'); }
      return;
    }
    const open = e.target.closest('[data-open-product]');
    if (open) { void openProduct(open.dataset.openProduct); return; }
    const remove = e.target.closest('[data-remove-saved]');
    if (remove) saveAction(remove.dataset.removeSaved, remove);
  });
  $('profileTabContent')?.addEventListener('submit', async (e) => {
    const form = e.target.closest('[data-my-post-edit-form]');
    if (!form) return;
    e.preventDefault();
    const type = form.dataset.type, id = form.dataset.id, values = new FormData(form);
    const payload = { action:'edit' };
    let requestBody = null;
    if (['job','property','rental','land','house_sale'].includes(type)) {
      const get = name => String(values.get(name) ?? '');
      payload.title = get('title');
      payload.description = get('description');
      payload.short_description = get('short_description');
      payload.category = get('category');
      payload.subcategory = get('subcategory');
      payload.detail_type = get('detail_type');
      payload.location = get('location');
      payload.youtube_video_url = get('youtube_video_url');
      payload.province_code = get('province_code');
      payload.district_code = get('district_code');
      payload.commune_code = get('commune_code');
      payload.village_code = get('village_code');
      const specsField = get('specifications');
      let specifications = {};
      try { specifications = JSON.parse(specsField || '{}'); } catch { toast('ព័ត៌មានបន្ថែមមិនត្រឹមត្រូវទេ។', 'error'); return; }
      const googleMapUrl = get('google_map_url');
      if (googleMapUrl) specifications.google_map_url = googleMapUrl;
      else delete specifications.google_map_url;
      payload.specifications = specifications;
      if (type === 'job') {
        payload.company_name = get('company_name');
        payload.vacancies = get('vacancies');
        payload.salary_min = get('salary_min');
        payload.salary_max = get('salary_max');
        payload.salary_period = get('salary_period');
        payload.employment_type = get('employment_type');
        payload.work_schedule = get('work_schedule');
        payload.days_off = get('days_off');
        payload.experience = get('experience');
        payload.education = get('education');
        payload.skills = get('skills_text').split(',').map(value => value.trim()).filter(Boolean);
        payload.languages = get('languages_text').split(',').map(value => value.trim()).filter(Boolean);
        payload.benefits = get('benefits_text').split(',').map(value => value.trim()).filter(Boolean);
      } else if (type === 'property') {
        payload.address = get('address');
        payload.price = get('price');
        payload.price_period = get('price_period');
        payload.area_sqm = get('area_sqm');
        payload.bedrooms = get('bedrooms');
        payload.bathrooms = get('bathrooms');
      } else {
        payload.address = get('address');
        payload.price = get('price');
        payload.area_sqm = get('area_sqm');
        if (type === 'rental') {
          payload.rent_period = get('rent_period');
          payload.property_type = get('property_type');
          payload.bedrooms = get('bedrooms');
          payload.bathrooms = get('bathrooms');
          payload.furnished = get('furnished');
        } else if (type === 'land') {
          payload.land_type = get('land_type');
          payload.title_deed = get('title_deed');
          payload.road_access = get('road_access');
        } else {
          payload.property_type = get('property_type');
          payload.bedrooms = get('bedrooms');
          payload.bathrooms = get('bathrooms');
          payload.furnished = get('furnished');
          payload.title_deed = get('title_deed');
        }
      }
      const keepImageIds = Array.from(form.querySelectorAll('[data-keep-listing-image]:checked')).map(input => input.value);
      values.set('keep_image_message_ids', JSON.stringify(keepImageIds));
      values.set('payload', JSON.stringify(payload));
      requestBody = values;
    } else {
      if (type === 'social_post') payload.caption = values.get('caption') || '';
      else {
        payload.title = values.get('title') || '';
        payload.description = values.get('description') || '';
        payload.location = values.get('location') || '';
        if (type === 'job') {
          payload.salary_min = values.get('salary_min');
          payload.salary_max = values.get('salary_max');
        } else if (type === 'product') {
          payload.price = values.get('price');
          payload.stock = values.get('stock');
        } else payload.price = values.get('price');
      }
      requestBody = JSON.stringify(payload);
    }
    try {
      await api('/api/my-posts/' + encodeURIComponent(type) + '/' + encodeURIComponent(id), { method:'PATCH', body:requestBody });
      state.myPostEditing = null;
      toast('បានកែប្រែប្រកាសជោគជ័យ។');
      await renderMyPosts();
    } catch (err) { toast(err.message || 'មិនអាចកែប្រែប្រកាសបានទេ។', 'error'); }
  });

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
  $('maintenanceAdminLogin')?.addEventListener('click', () => openAuth());
  $('saveMaintenanceSettings')?.addEventListener('click', async () => { try { const payload = { maintenanceMode: Boolean($('maintenanceToggle')?.checked), maintenanceMessage: $('maintenanceMessageInput')?.value || '' }; const res = await api('/api/admin/maintenance', { method: 'POST', body: JSON.stringify(payload) }); state.maintenanceMode = payload.maintenanceMode; state.maintenanceMessage = payload.maintenanceMessage; applyMaintenanceUI(); if ($('maintenanceStatusHint')) $('maintenanceStatusHint').textContent = state.maintenanceMode ? 'ស្ថានភាពបច្ចុប្បន្ន៖ Maintenance' : 'ស្ថានភាពបច្ចុប្បន្ន៖ កំពុងដំណើរការ'; toast(res.message || 'បានរក្សាទុក Maintenance Settings។'); } catch (err) { toast(err.message || 'មិនអាចរក្សាទុក Maintenance Settings បានទេ។', 'error'); } });
  $('saveBrandingBtn')?.addEventListener('click', async () => { const form = new FormData(); form.append('siteTitle', $('brandTitleInput')?.value || ''); form.append('siteSubtitle', $('brandSubtitleInput')?.value || ''); form.append('heroBadge', $('heroBadgeInput')?.value || ''); form.append('heroTitle', $('heroTitleInput')?.value || ''); form.append('heroSubtitle', $('heroSubtitleInput')?.value || ''); form.append('clearHeroImages', String(Boolean($('clearHeroImages')?.checked))); const logo = $('brandingLogoUpload')?.files?.[0], favicon = $('brandingFaviconUpload')?.files?.[0]; if (logo) form.append('logo', logo); if (favicon) form.append('favicon', favicon); Array.from($('brandingHeroUpload')?.files || []).slice(0, 3).forEach((f) => form.append('heroImages', f)); try { const res = await api('/api/admin/branding', { method: 'PATCH', body: form }); applySiteBranding(res.data || {}); if ($('brandingStatus')) $('brandingStatus').textContent = 'បានរក្សាទុក Brand និង Banner ជោគជ័យ'; toast('បានរក្សាទុក Brand ជោគជ័យ!'); } catch (err) { toast(err.message || 'មិនអាចរក្សាទុក Brand បានទេ។', 'error'); } });
  $('telegramDiagnosticsBtn')?.addEventListener('click', async () => {
    const target = $('telegramDiagnosticsResult');
    const button = $('telegramDiagnosticsBtn');
    if (button) { button.disabled = true; button.textContent = 'កំពុងពិនិត្យ…'; }
    if (target) target.innerHTML = '<div class="admin-telegram-diagnostics-loading">កំពុងពិនិត្យការភ្ជាប់ Telegram…</div>';
    try {
      const res = await api('/api/admin/telegram/diagnostics');
      if (target) target.innerHTML = renderTelegramDiagnostics(res.data ?? res);
    } catch (err) {
      if (target) target.innerHTML = '<div class="admin-telegram-diagnostics-row is-error"><span class="admin-telegram-diagnostics-label">ស្ថានភាពពិនិត្យ</span><strong>' + esc(err.message || 'មិនអាចពិនិត្យស្ថានភាព Telegram បានទេ។') + '</strong></div>';
    } finally {
      if (button) { button.disabled = false; button.textContent = 'ពិនិត្យស្ថានភាព'; }
    }
  });
  $('adminSupplierRefresh')?.addEventListener('click',()=>void renderAdminSupplierProducts());
  $('adminSupplierSearch')?.addEventListener('input',()=>void renderAdminSupplierProducts());
  $('adminSupplierCreateForm')?.addEventListener('submit',async event=>{
    event.preventDefault();const form=event.currentTarget,data=Object.fromEntries(new FormData(form).entries());
    try{const created=await api('/api/products',{method:'POST',body:JSON.stringify({title:data.title,category:data.category,description:data.description||'',price:Number(data.price),stock:Number(data.stock||0),location:'Cambodia',condition:'ថ្មី'})});const id=created.data?.id;if(!id)throw new Error('មិនទទួលបាន Product ID');
      await api('/api/admin/supplier-products/'+encodeURIComponent(id)+'/source',{method:'PUT',body:JSON.stringify({supplier_name:data.supplier_name||'',supplier_url:data.supplier_url||'',supplier_price:Number(data.supplier_price||0),supplier_product_code:data.supplier_product_code||''})});
      form.reset();toast('បានបង្កើតផលិតផល Supplier ជោគជ័យ។');await renderAdminSupplierProducts();
    }catch(error){toast(error.message||'មិនអាចបង្កើតផលិតផលបានទេ។','error');}
  });
  $('adminSupplierProductsList')?.addEventListener('input',event=>{
    const form=event.target.closest('.admin-supplier-add-variant-form,.admin-supplier-variant-form');
    if(!form)return;
    const priceInput=form.querySelector('[name="price"]');
    if(event.target.matches('[name="price"]')){priceInput.dataset.manualPrice='true';return;}
    if(event.target.matches('[name="supplier_price"]') && priceInput?.dataset.manualPrice!=='true'){
      const cost=Number(event.target.value);
      if(Number.isFinite(cost)&&cost>=0)priceInput.value=(cost+5).toFixed(2);
    }
  });
  $('adminSupplierProductsList')?.addEventListener('submit',async event=>{
    const form=event.target.closest('form');if(!form)return;const data=Object.fromEntries(new FormData(form).entries());
    try{
      if(form.matches('.admin-supplier-product-edit-form')){event.preventDefault();await api('/api/products/'+encodeURIComponent(form.dataset.productId),{method:'PATCH',body:JSON.stringify({title:data.title,category:data.category,description:data.description||'',price:Number(data.price),stock:Number(data.stock||0)})});await api('/api/admin/products/'+encodeURIComponent(form.dataset.productId),{method:'PATCH',body:JSON.stringify({status:data.status})});toast('បានកែប្រែព័ត៌មានផលិតផល។');}
      else if(form.matches('.admin-supplier-source-form')){event.preventDefault();await api('/api/admin/supplier-products/'+encodeURIComponent(form.dataset.productId)+'/source',{method:'PUT',body:JSON.stringify({...data,supplier_price:Number(data.supplier_price||0)})});toast('បានរក្សាទុក Supplier Info។');}
      else if(form.matches('.admin-supplier-variant-form')){event.preventDefault();const base='/api/admin/supplier-products/'+encodeURIComponent(form.dataset.productId)+'/variants/'+encodeURIComponent(form.dataset.variantId);
        await api(base,{method:'PATCH',body:JSON.stringify({option_value:data.option_value,price:Number(data.price),stock:Number(data.stock||0)})});
        await api(base+'/source',{method:'PUT',body:JSON.stringify({supplier_price:Number(data.supplier_price||0),supplier_product_code:data.supplier_product_code||'',supplier_url:data.supplier_url||''})});toast('បានរក្សាទុក Variant។');}
      else if(form.matches('.admin-supplier-add-variant-form')){event.preventDefault();const base='/api/admin/supplier-products/'+encodeURIComponent(form.dataset.productId)+'/variants';
        const result=await api(base,{method:'POST',body:JSON.stringify({option_name:'Storage',option_value:data.option_value,price:Number(data.price),stock:Number(data.stock||0),sku:data.supplier_product_code||''})});const id=result.data?.id;if(!id)throw new Error('មិនទទួលបាន Variant ID');
        await api(base+'/'+encodeURIComponent(id)+'/source',{method:'PUT',body:JSON.stringify({supplier_price:Number(data.supplier_price||0),supplier_product_code:data.supplier_product_code||'',supplier_url:data.supplier_url||''})});toast('បានបន្ថែម Storage Variant។');}
      else return;await renderAdminSupplierProducts();
    }catch(error){toast(error.message||'មិនអាចរក្សាទុកទិន្នន័យបានទេ។','error');}
  });
  $('adminSupplierProductsList')?.addEventListener('click',async event=>{
    const deleteProduct=event.target.closest('[data-admin-supplier-delete]');
    if(deleteProduct){
      if(!window.confirm('លុបផលិតផលនេះ? ប្រសិនបើមានប្រវត្តិបញ្ជាទិញ វានឹងត្រូវ Archive ជំនួសការលុប។'))return;
      try{await api('/api/products/'+encodeURIComponent(deleteProduct.dataset.adminSupplierDelete),{method:'DELETE'});toast('បានលុប ឬ Archive ផលិតផល។');await renderAdminSupplierProducts();}
      catch(error){toast(error.message||'មិនអាចលុបផលិតផលបានទេ។','error');}return;
    }
    const button=event.target.closest('[data-admin-variant-delete]');if(!button)return;if(!window.confirm('តើអ្នកចង់លុប Variant នេះមែនទេ?'))return;
    const article=button.closest('[data-admin-supplier-product]');
    try{await api('/api/admin/supplier-products/'+encodeURIComponent(article.dataset.adminSupplierProduct)+'/variants/'+encodeURIComponent(button.dataset.adminVariantDelete),{method:'DELETE'});toast('បានលុប Variant។');await renderAdminSupplierProducts();}
    catch(error){toast(error.message||'មិនអាចលុប Variant បានទេ។','error');}
  });
  $('adminApplications')?.addEventListener('click', async (e) => { const b = e.target.closest('[data-admin-review]'); if (!b) return; try { await api('/api/admin/vendors/' + encodeURIComponent(b.dataset.id), { method: 'PATCH', body: JSON.stringify({ status: b.dataset.adminReview }) }); await renderAdmin(); toast('បានធ្វើបច្ចុប្បន្នភាពពាក្យស្នើសុំ។'); } catch (err) { toast(err.message || 'មិនអាចពិនិត្យពាក្យស្នើសុំបានទេ។', 'error'); } });

  // Open chat images in an in-page lightbox; never navigate to a new tab.
  $('sellerChatMessages')?.addEventListener('click', (e) => {
    const productCard = e.target.closest('.seller-chat-product-card[data-chat-product-id]');
    if (productCard) { e.preventDefault(); void openProduct(productCard.dataset.chatProductId); return; }
    const image = e.target.closest('.seller-chat-image');
    if (!image) return;
    e.preventDefault();
    document.querySelector('.seller-chat-image-preview')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'seller-chat-image-preview';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'មើលរូបភាព');
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'seller-chat-image-preview-close';
    close.setAttribute('aria-label', 'បិទ');
    close.textContent = '×';
    const fullImage = document.createElement('img');
    fullImage.src = image.currentSrc || image.src;
    fullImage.alt = image.alt || 'រូបភាពក្នុងសារ';
    overlay.append(close, fullImage);
    overlay.addEventListener('click', (event) => { if (event.target === overlay || event.target === close) overlay.remove(); });
    document.body.appendChild(overlay);
  });
  $('sellerChatMessages')?.addEventListener('keydown', (e) => {
    const productCard = e.target.closest('.seller-chat-product-card[data-chat-product-id]');
    if (productCard && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); void openProduct(productCard.dataset.chatProductId); return; }
    const image = e.target.closest('.seller-chat-image');
    if (image && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      image.click();
    }
  });
  $('sellerChatChooseImage')?.addEventListener('click', () => $('sellerChatImageInput')?.click());
  $('sellerChatImageInput')?.addEventListener('change', async () => { const file = $('sellerChatImageInput').files?.[0]; if (!file || !state.chatConversationId) return; const form = new FormData(); form.append('image', file); try { await api('/api/seller-chat/conversations/' + encodeURIComponent(state.chatConversationId) + '/image', { method: 'POST', body: form }); $('sellerChatImageInput').value = ''; await loadSellerChatConversation(true); await loadUnifiedSellerChatInbox(); } catch (err) { toast(err.message || 'មិនអាចផ្ញើរូបភាពបានទេ។', 'error'); } });
  $('sellerChatMute')?.addEventListener('click', () => {
    state.chatMuted = !state.chatMuted;
    const b = $('sellerChatMute');
    const label = state.chatMuted ? 'បើកសំឡេង' : 'បិទសំឡេង';
    b.setAttribute('aria-pressed', String(state.chatMuted)); b.setAttribute('aria-label', label); b.title = label;
    b.innerHTML = state.chatMuted
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6m0-6-5 6"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>';
  });

}

function updateSiteOnlineCount(count) {
  const target = $('siteOnlineCount');
  if (!target) return;
  const value = Number(count);
  target.textContent = Number.isFinite(value) && value >= 0
    ? new Intl.NumberFormat('en').format(Math.floor(value))
    : '—';
}

async function sendSitePresence(leave = false) {
  if (!state.sitePresenceVisitorId) return;
  try {
    const response = await fetch('/api/site/presence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitor_id: state.sitePresenceVisitorId, leave }),
      cache: 'no-store',
      keepalive: leave
    });
    if (!response.ok) throw new Error(`Presence request failed (${response.status})`);
    const result = await response.json();
    if (!leave) updateSiteOnlineCount(result?.data?.count);
  } catch (error) {
    if (leave) return;
    try {
      const response = await fetch('/api/site/online', { cache: 'no-store' });
      if (!response.ok) return;
      const result = await response.json();
      updateSiteOnlineCount(result?.data?.count);
    } catch (readError) {
      console.warn('Could not refresh website online count:', readError.message);
    }
  }
}

function startSitePresence() {
  if (state.sitePresenceStarted) return;
  state.sitePresenceStarted = true;
  try {
    state.sitePresenceVisitorId = crypto.randomUUID();
  } catch {
    state.sitePresenceVisitorId = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  }
  void sendSitePresence();
  state.sitePresenceTimer = window.setInterval(() => void sendSitePresence(), 25_000);
  window.addEventListener('pagehide', () => {
    if (state.sitePresenceTimer) window.clearInterval(state.sitePresenceTimer);
    void sendSitePresence(true);
  }, { once: true });
}

async function boot() {
  initIcons();
  bindEvents();
  startSitePresence();

  const initialView = document.documentElement.dataset.initialView || 'home';
  const initialProductId = document.documentElement.dataset.initialProductId || '';
  const initialListingType = document.documentElement.dataset.initialListingType || '';
  const initialListingId = document.documentElement.dataset.initialListingId || '';
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
    const tasks = [loadProducts(), loadJobs()];
    if (initialView === 'product' && initialListingType && initialListingId) {
      tasks.push(openMarketplaceListing(initialListingType, initialListingId, { preserveScroll: true }));
    } else if (initialView === 'product' && initialProductId) {
      tasks.push(openProduct(initialProductId, { preserveScroll: true }));
    } else if (initialView === 'store' && initialStoreId) {
      tasks.push(openStorefront(initialStoreId, { preserveScroll: true }));
    } else {
      tasks.push(showView(initialView, { preserveScroll: true }));
    }

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
