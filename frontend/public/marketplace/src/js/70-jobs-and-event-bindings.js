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

