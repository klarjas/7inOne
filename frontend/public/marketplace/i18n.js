/* ==========================================================================
   7inOne Site Internationalization Foundation
   - Supported locales: Khmer, Simplified Chinese, English
   - Language switching is blocked until the target catalog covers every
     registered UI key. This prevents partially translated mixed-language UI.
   - This module intentionally exposes no language picker by itself.
   ========================================================================== */
(function (global) {
  'use strict';

  const STORAGE_KEY = '7inone:locale';
  const DEFAULT_LOCALE = 'km';
  const LOCALES = Object.freeze({
    km: Object.freeze({ nativeName: 'ខ្មែរ', direction: 'ltr' }),
    'zh-CN': Object.freeze({ nativeName: '简体中文', direction: 'ltr' }),
    en: Object.freeze({ nativeName: 'English', direction: 'ltr' })
  });

  const catalogs = Object.create(null);
  const requiredKeys = new Set();
  let currentLocale = DEFAULT_LOCALE;

  function normalizeLocale(locale) {
    const value = String(locale || '').trim();
    if (value === 'zh' || value.toLowerCase() === 'zh-cn') return 'zh-CN';
    if (value.toLowerCase().startsWith('km')) return 'km';
    if (value.toLowerCase().startsWith('en')) return 'en';
    return Object.prototype.hasOwnProperty.call(LOCALES, value) ? value : null;
  }

  function getSavedLocale() {
    try {
      return normalizeLocale(global.localStorage.getItem(STORAGE_KEY)) || DEFAULT_LOCALE;
    } catch (_) {
      return DEFAULT_LOCALE;
    }
  }

  function registerCatalog(locale, catalog) {
    const normalized = normalizeLocale(locale);
    if (!normalized) throw new Error('Unsupported 7inOne locale.');
    if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog)) {
      throw new TypeError('A locale catalog must be a plain object.');
    }
    catalogs[normalized] = Object.freeze({ ...catalog });
    return getCatalogStatus(normalized);
  }

  function registerRequiredKeys(keys) {
    if (!Array.isArray(keys)) throw new TypeError('Required translation keys must be an array.');
    keys.forEach((key) => {
      if (typeof key === 'string' && key.trim()) requiredKeys.add(key.trim());
    });
    return requiredKeys.size;
  }

  function getCatalogStatus(locale) {
    const normalized = normalizeLocale(locale);
    if (!normalized) return { locale: null, ready: false, missing: [] };
    const catalog = catalogs[normalized] || {};
    const missing = Array.from(requiredKeys).filter((key) =>
      typeof catalog[key] !== 'string' || !catalog[key].trim()
    );
    return { locale: normalized, ready: requiredKeys.size > 0 && Object.keys(catalog).length > 0 && missing.length === 0, missing };
  }

  function t(key, values) {
    const catalog = catalogs[currentLocale] || {};
    const template = catalog[key];
    if (typeof template !== 'string' || !template.trim()) {
      throw new Error('Missing translation "' + key + '" for locale "' + currentLocale + '".');
    }
    if (!values || typeof values !== 'object') return template;
    return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, name) =>
      Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match
    );
  }

  function apply(root) {
    const scope = root && typeof root.querySelectorAll === 'function' ? root : global.document;
    if (!scope) return;
    const nodes = [];
    if (scope.nodeType === 1 && scope.matches && scope.matches('[data-i18n]')) nodes.push(scope);
    nodes.push(...scope.querySelectorAll('[data-i18n]'));
    nodes.forEach((node) => {
      const key = node.getAttribute('data-i18n');
      if (key) node.textContent = t(key);
    });
    const attrNodes = scope.querySelectorAll('[data-i18n-attr]');
    attrNodes.forEach((node) => {
      const entries = (node.getAttribute('data-i18n-attr') || '').split(';');
      entries.forEach((entry) => {
        const separator = entry.indexOf(':');
        if (separator < 1) return;
        const attribute = entry.slice(0, separator).trim();
        const key = entry.slice(separator + 1).trim();
        if (attribute && key) node.setAttribute(attribute, t(key));
      });
    });
    if (global.document && global.document.documentElement) {
      global.document.documentElement.lang = currentLocale;
      global.document.documentElement.dir = LOCALES[currentLocale].direction;
    }
  }

  function setLanguage(locale) {
    const normalized = normalizeLocale(locale);
    if (!normalized) throw new Error('Unsupported 7inOne locale.');
    const status = getCatalogStatus(normalized);
    if (!status.ready) {
      const sample = status.missing.slice(0, 5).join(', ');
      throw new Error(
        'Language switch blocked: ' + normalized + ' catalog is incomplete (' +
        status.missing.length + ' missing keys' + (sample ? ': ' + sample : '') + ').'
      );
    }
    currentLocale = normalized;
    try { global.localStorage.setItem(STORAGE_KEY, normalized); } catch (_) {}
    apply();
    global.dispatchEvent(new CustomEvent('7inone:locale-change', {
      detail: { locale: currentLocale }
    }));
    return currentLocale;
  }


  const marketplaceCatalogs = {
    km: {
    "ផ្សារទិញលក់កម្ពុជា": "ផ្សារទិញលក់កម្ពុជា",
    "ទីតាំងរបស់អ្នក": "ទីតាំងរបស់អ្នក",
    "ប្រទេសកម្ពុជា": "ប្រទេសកម្ពុជា",
    "អ្នកតាមដាន": "អ្នកតាមដាន",
    "នាក់ Online": "នាក់ Online",
    "គ្រប់ប្រភេទ": "គ្រប់ប្រភេទ",
    "ស្វែងរកទំនិញដែលអ្នកចង់បាន...": "ស្វែងរកទំនិញដែលអ្នកចង់បាន...",
    "ស្វែងរក": "ស្វែងរក",
    "ប្រកាស": "ប្រកាស",
    "រក្សាទុក": "រក្សាទុក",
    "ការបញ្ជាទិញ": "ការបញ្ជាទិញ",
    "ការជូនដំណឹង": "ការជូនដំណឹង",
    "ភ្ញៀវ": "ភ្ញៀវ",
    "មិនទាន់ចូលគណនី": "មិនទាន់ចូលគណនី",
    "សួស្តី!": "សួស្តី!",
    "សូមស្វាគមន៍មកកាន់ 7inOne": "សូមស្វាគមន៍មកកាន់ 7inOne",
    "គណនីរបស់ខ្ញុំ": "គណនីរបស់ខ្ញុំ",
    "គ្រប់គ្រងហាង": "គ្រប់គ្រងហាង",
    "ផ្ទាំង Admin": "ផ្ទាំង Admin",
    "ចូល / ប្តូរគណនី": "ចូល / ប្តូរគណនី",
    "ប្រភេទប្រកាស": "ប្រភេទប្រកាស",
    "ទាំងអស់": "ទាំងអស់",
    "ផលិតផល": "ផលិតផល",
    "ការងារ": "ការងារ",
    "អចលនទ្រព្យ": "អចលនទ្រព្យ",
    "ប្រភេទទាំងអស់": "ប្រភេទទាំងអស់",
    "ប្រកាសទាំងអស់": "ប្រកាសទាំងអស់",
    "ប្រភេទផលិតផល": "ប្រភេទផលិតផល",
    "ទំនិញទាំងអស់": "ទំនិញទាំងអស់",
    "កំពុងផ្ទុកទំនិញ...": "កំពុងផ្ទុកទំនិញ...",
    "រកមិនឃើញទំនិញទេ": "រកមិនឃើញទំនិញទេ",
    "សាកល្បងពាក្យស្វែងរក ឬប្រភេទផ្សេងទៀត។": "សាកល្បងពាក្យស្វែងរក ឬប្រភេទផ្សេងទៀត។",
    },
    'zh-CN': {
    "ផ្សារទិញលក់កម្ពុជា": "柬埔寨线上交易市场",
    "ទីតាំងរបស់អ្នក": "您的位置",
    "ប្រទេសកម្ពុជា": "柬埔寨",
    "អ្នកតាមដាន": "关注者",
    "នាក់ Online": "人在线",
    "គ្រប់ប្រភេទ": "所有类别",
    "ស្វែងរកទំនិញដែលអ្នកចង់បាន...": "搜索您想要的商品...",
    "ស្វែងរក": "搜索",
    "ប្រកាស": "发布",
    "រក្សាទុក": "收藏",
    "ការបញ្ជាទិញ": "订单",
    "ការជូនដំណឹង": "通知",
    "ភ្ញៀវ": "访客",
    "មិនទាន់ចូលគណនី": "尚未登录",
    "សួស្តី!": "您好！",
    "សូមស្វាគមន៍មកកាន់ 7inOne": "欢迎来到 7inOne",
    "គណនីរបស់ខ្ញុំ": "我的账户",
    "គ្រប់គ្រងហាង": "管理店铺",
    "ផ្ទាំង Admin": "管理后台",
    "ចូល / ប្តូរគណនី": "登录 / 切换账户",
    "ប្រភេទប្រកាស": "发布类别",
    "ទាំងអស់": "全部",
    "ផលិតផល": "商品",
    "ការងារ": "工作",
    "អចលនទ្រព្យ": "房地产",
    "ប្រភេទទាំងអស់": "所有类别",
    "ប្រកាសទាំងអស់": "所有发布",
    "ប្រភេទផលិតផល": "商品类别",
    "ទំនិញទាំងអស់": "所有商品",
    "កំពុងផ្ទុកទំនិញ...": "正在加载商品...",
    "រកមិនឃើញទំនិញទេ": "未找到商品",
    "សាកល្បងពាក្យស្វែងរក ឬប្រភេទផ្សេងទៀត។": "请尝试其他搜索词或类别。",
    },
    en: {
    "ផ្សារទិញលក់កម្ពុជា": "Cambodia Marketplace",
    "ទីតាំងរបស់អ្នក": "Your location",
    "ប្រទេសកម្ពុជា": "Cambodia",
    "អ្នកតាមដាន": "Followers",
    "នាក់ Online": "online",
    "គ្រប់ប្រភេទ": "All categories",
    "ស្វែងរកទំនិញដែលអ្នកចង់បាន...": "Search for products...",
    "ស្វែងរក": "Search",
    "ប្រកាស": "Post",
    "រក្សាទុក": "Saved",
    "ការបញ្ជាទិញ": "Orders",
    "ការជូនដំណឹង": "Notifications",
    "ភ្ញៀវ": "Guest",
    "មិនទាន់ចូលគណនី": "Not signed in",
    "សួស្តី!": "Hello!",
    "សូមស្វាគមន៍មកកាន់ 7inOne": "Welcome to 7inOne",
    "គណនីរបស់ខ្ញុំ": "My account",
    "គ្រប់គ្រងហាង": "Manage shop",
    "ផ្ទាំង Admin": "Admin dashboard",
    "ចូល / ប្តូរគណនី": "Sign in / Switch account",
    "ប្រភេទប្រកាស": "Listing types",
    "ទាំងអស់": "All",
    "ផលិតផល": "Products",
    "ការងារ": "Jobs",
    "អចលនទ្រព្យ": "Real estate",
    "ប្រភេទទាំងអស់": "All categories",
    "ប្រកាសទាំងអស់": "All listings",
    "ប្រភេទផលិតផល": "Product categories",
    "ទំនិញទាំងអស់": "All products",
    "កំពុងផ្ទុកទំនិញ...": "Loading products...",
    "រកមិនឃើញទំនិញទេ": "No products found",
    "សាកល្បងពាក្យស្វែងរក ឬប្រភេទផ្សេងទៀត។": "Try another search term or category.",
    }
  };
  const marketplaceKeys = ["ផ្សារទិញលក់កម្ពុជា","ទីតាំងរបស់អ្នក","ប្រទេសកម្ពុជា","អ្នកតាមដាន","នាក់ Online","គ្រប់ប្រភេទ","ស្វែងរកទំនិញដែលអ្នកចង់បាន...","ស្វែងរក","ប្រកាស","រក្សាទុក","ការបញ្ជាទិញ","ការជូនដំណឹង","ភ្ញៀវ","មិនទាន់ចូលគណនី","សួស្តី!","សូមស្វាគមន៍មកកាន់ 7inOne","គណនីរបស់ខ្ញុំ","គ្រប់គ្រងហាង","ផ្ទាំង Admin","ចូល / ប្តូរគណនី","ប្រភេទប្រកាស","ទាំងអស់","ផលិតផល","ការងារ","អចលនទ្រព្យ","ប្រភេទទាំងអស់","ប្រកាសទាំងអស់","ប្រភេទផលិតផល","ទំនិញទាំងអស់","កំពុងផ្ទុកទំនិញ...","រកមិនឃើញទំនិញទេ","សាកល្បងពាក្យស្វែងរក ឬប្រភេទផ្សេងទៀត។"];
  registerRequiredKeys(marketplaceKeys);
  Object.keys(marketplaceCatalogs).forEach((locale) => registerCatalog(locale, marketplaceCatalogs[locale]));

  // Keep the selected locale synchronized when another tab changes it.
  global.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    const nextLocale = normalizeLocale(event.newValue) || DEFAULT_LOCALE;
    if (nextLocale !== DEFAULT_LOCALE && !getCatalogStatus(nextLocale).ready) return;
    currentLocale = nextLocale;
    apply();
    global.dispatchEvent(new CustomEvent('7inone:locale-change', {
      detail: { locale: currentLocale }
    }));
  });

  const savedLocale = getSavedLocale();
  if (savedLocale === DEFAULT_LOCALE || getCatalogStatus(savedLocale).ready) {
    currentLocale = savedLocale;
  }

  global.SiteI18n = Object.freeze({
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    get locale() { return currentLocale; },
    t,
    apply,
    setLanguage,
    registerCatalog,
    registerRequiredKeys,
    getCatalogStatus
  });
})(window);
