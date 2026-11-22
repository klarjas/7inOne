'use client';

import { useEffect, useState } from 'react';

export const SITE_LOCALE_STORAGE_KEY = '7inone:locale';
export type SiteLocale = 'km' | 'zh-CN' | 'en';

const SUPPORTED_LOCALES: readonly SiteLocale[] = ['km', 'zh-CN', 'en'];

function normalizeSiteLocale(value: string | null): SiteLocale {
  if (value === 'zh' || value?.toLowerCase() === 'zh-cn') return 'zh-CN';
  if (value?.toLowerCase().startsWith('en')) return 'en';
  if (value?.toLowerCase().startsWith('km')) return 'km';
  return 'km';
}

function readSiteLocale(): SiteLocale {
  try {
    const saved = window.localStorage.getItem(SITE_LOCALE_STORAGE_KEY);
    const locale = normalizeSiteLocale(saved);
    return SUPPORTED_LOCALES.includes(locale) ? locale : 'km';
  } catch {
    return 'km';
  }
}

/** Synchronizes Next.js pages with the shared Marketplace locale preference.
 * It deliberately does not expose a picker: the site-wide picker stays gated
 * until all Marketplace and Dashboard translation catalogs pass coverage.
 */
export function useSiteLocale(): SiteLocale {
  const [locale, setLocale] = useState<SiteLocale>('km');

  useEffect(() => {
    const syncLocale = () => {
      const next = readSiteLocale();
      setLocale(next);
      document.documentElement.lang = next;
      document.documentElement.dir = 'ltr';
    };

    syncLocale();
    window.addEventListener('storage', syncLocale);
    window.addEventListener('7inone:locale-change', syncLocale);
    return () => {
      window.removeEventListener('storage', syncLocale);
      window.removeEventListener('7inone:locale-change', syncLocale);
    };
  }, []);

  return locale;
}
