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
      <p class="pr"><span>${money(p.price)}</span></p>
      ${description ? `<p class="cd-description">${esc(description)}</p>` : ''}
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

