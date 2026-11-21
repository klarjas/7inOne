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
  const cancelSkeleton = scheduleSkeleton(renderProductDetailSkeleton);

  try {
    let item = state.products.find(row => row.listing_type === type && String(row.id) === String(id))
      || state.jobs.find(row => row.listing_type === type && String(row.id) === String(id));
    if (!item) {
      const result = await api('/api/marketplace/listings?limit=100&type=' + encodeURIComponent(type));
      if (!isCurrent()) return false;
      item = (result.data || []).find(row => String(row.id) === String(id));
    }
    cancelSkeleton();
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
    cancelSkeleton();
    if (!isCurrent()) return false;
    toast(error.message || 'មិនអាចបើកព័ត៌មានប្រកាសបានទេ។', 'error');
    void showView('home');
    return false;
  } finally {
    cancelSkeleton();
  }
}

async function openProduct(id, options = {}) {
  if (!id) { toast('មិនមានលេខសម្គាល់ទំនិញទេ។', 'warning'); return false; }
  const productId = String(id);
  const isCurrent = () => options.routeSyncNavigationId == null || options.routeSyncNavigationId === state.routeSyncNavigationId;

  state.currentProduct = { id: productId };
  await showView('product', { preserveScroll: Boolean(options.preserveScroll), deferLoad: true });
  const cancelSkeleton = scheduleSkeleton(renderProductDetailSkeleton);

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
    state.productGalleryIndex = 0;
    state.productGalleryVideoActive = false;

    cancelSkeleton();
    renderProductDetail();
    return true;
  } catch (error) {
    cancelSkeleton();
    if (!isCurrent()) return false;
    toast(error.message, 'error');
    void showView('home');
    return false;
  } finally {
    cancelSkeleton();
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
  const stockKnown = p.stock !== undefined && p.stock !== null;
  const stockLabel = stockKnown ? (Number(p.stock) > 0 ? 'មានទំនិញក្នុងស្តុក' : 'អស់ពីស្តុក') : 'អាចសាកសួរបាន';
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
          <span class="product-meta-item product-detail-id"><span>Product ID</span><code>${esc(displayProductCode(p))}</code><button type="button" data-copy-product-code="${esc(displayProductCode(p))}" aria-label="ចម្លង Product ID" title="ចម្លង Product ID">${ic('clipboard', 12)}</button></span>
        </div>

        <div class="product-heading-block">
          <h1 class="product-detail-title">${esc(p.title)}</h1>
          <div class="product-price-stock-row">
            <strong class="product-facts-price">${money(p.price)}</strong>
            <span class="product-stock-badge ${stockKnown && Number(p.stock) <= 0 ? 'is-out' : ''}">${ic(stockKnown && Number(p.stock) <= 0 ? 'x' : 'checkcircle', 14)} ${stockLabel}</span>
          </div>
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
