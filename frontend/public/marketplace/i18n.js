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
    return template.replace(/\\{([a-zA-Z0-9_]+)\\}/g, (match, name) =>
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
