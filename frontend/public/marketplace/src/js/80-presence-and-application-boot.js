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
