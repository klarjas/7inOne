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
