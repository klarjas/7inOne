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

