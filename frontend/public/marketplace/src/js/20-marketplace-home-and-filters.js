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
    if (item.listing_type !== 'product' || state.activeCondition === 'all') return true;
    const condition = String(item.condition || '').toLowerCase();
    const isNew = condition.includes('new') || condition.includes('ថ្មី');
    const isUsed = condition.includes('used') || condition.includes('second') || condition.includes('មួយទឹក') || condition.includes('ប្រើរួច');
    return state.activeCondition === 'new' ? isNew : isUsed;
  });
  const getSortPrice = (item) => {
    const rawPrice = item.price_label ?? item.price ?? '';
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
  state.activeCategory = category;
  if (category !== 'all') state.activeListingType = 'product';
  updateMarketplaceCategoryHeading();
  $('searchCategory').value = category;
  document.querySelectorAll('[data-category]').forEach((b) => b.classList.toggle('active', b.dataset.category === category));
  document.querySelectorAll('[data-listing-type]').forEach((b) => b.classList.toggle('active', b.dataset.listingType === state.activeListingType));
  void loadProducts();
}

function setListingType(type) {
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

