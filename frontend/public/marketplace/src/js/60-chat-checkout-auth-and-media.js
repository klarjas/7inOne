function scrollSellerChatToBottom() {
  const target = $('sellerChatMessages');
  if (!target) return;
  const apply = () => { target.scrollTop = target.scrollHeight; };
  apply();
  requestAnimationFrame(() => { apply(); setTimeout(apply, 60); });
}

function renderSellerChatDraftProduct() {
  const banner = $('sellerChatProductBanner');
  if (!banner) return;
  const p = state.chatDraftProduct;
  if (!p) {
    banner.classList.add('hidden');
    banner.classList.remove('is-closing');
    banner.innerHTML = '';
    return;
  }
  const img = productImage(p);
  banner.classList.remove('hidden', 'is-closing');
  banner.innerHTML = `
    <div class="seller-chat-draft-thumb">${img ? `<img src="${esc(img)}" alt="">` : ic('bag', 20)}</div>
    <div class="seller-chat-draft-meta"><small>សួរអំពីផលិតផលនេះ</small><b>${esc(p.title || 'ផលិតផល')}</b><strong>${money(p.price)}</strong></div>
    <button type="button" class="seller-chat-draft-close" data-dismiss-draft-product aria-label="ដកផលិតផលចេញ">${ic('x', 14)}</button>`;
}

function dismissSellerChatDraftProduct() {
  const banner = $('sellerChatProductBanner');
  if (!banner || banner.classList.contains('hidden')) { state.chatDraftProduct = null; return; }
  banner.classList.add('is-closing');
  setTimeout(() => { state.chatDraftProduct = null; renderSellerChatDraftProduct(); }, 230);
}

function renderSellerChatMessages(messages, forceScroll = false) {
  const target = $('sellerChatMessages');
  if (!target) return;
  const wasNearBottom = forceScroll || (target.scrollHeight - target.scrollTop - target.clientHeight < 110);

  target.innerHTML = (messages || []).map((msg) => {
    const own = msg.sender_role === state.chatMode;
    const senderIsShop = msg.sender_role === 'seller';
    const participant = state.chatConversation || {};
    const senderName = senderIsShop
      ? (participant.vendor?.store_name || 'ហាងអ្នកលក់')
      : (participant.buyer?.display_name || 'អ្នកទិញ');
    const senderAvatar = senderIsShop ? participant.vendor?.store_logo_url : participant.buyer?.avatar_url;
    const avatar = senderAvatar
      ? `<img class="seller-chat-message-avatar" src="${esc(senderAvatar)}" alt="${esc(senderName)}">`
      : `<span class="seller-chat-message-avatar seller-chat-message-avatar-fallback">${ic(senderIsShop ? 'store' : 'user', 15)}</span>`;
    let content = '';
    if (msg.message_type === 'product') {
      const prod = msg.product || null;
      const img = prod?.image_url
        ? `<img src="${esc(prod.image_url)}" alt="${esc(prod.title || 'ផលិតផល')}" loading="lazy">`
        : `<span class="seller-chat-product-placeholder">${ic('bag', 24)}</span>`;
      content = `<article class="seller-chat-product-card" ${prod?.id ? `data-chat-product-id="${esc(prod.id)}"` : ''}>${img}<div class="seller-chat-product-info"><small>ផលិតផលដែលបានសួរ</small><b>${esc(prod?.title || msg.body || 'ផលិតផល')}</b>${prod ? `<strong>${money(prod.price)}</strong>` : '<span class="seller-chat-product-unavailable">ព័ត៌មានផលិតផលមិនទាន់មាន</span>'}</div></article>`;
    } else if (msg.message_type === 'image' && (msg.media_url || msg.local_image_url)) {
      const src = msg.local_image_url || msg.media_url;
      content = `<img class="seller-chat-image" src="${esc(src)}" alt="រូបភាពក្នុងសារ" loading="lazy" role="button" tabindex="0" aria-label="មើលរូបភាពធំ">`;
    } else {
      content = `<p>${esc(msg.body || '').replace(/\n/g, '<br>')}</p>`;
    }
    const time = esc(new Date(msg.created_at).toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' }));
    return `<div class="seller-chat-message-row ${own ? 'own' : 'other'}">${own ? '' : avatar}<div class="seller-chat-bubble ${own ? 'own' : 'other'}">${content}<small>${time}</small></div>${own ? avatar : ''}</div>`;
  }).join('') || '<p class="py-8 text-center text-xs text-slate-400">មិនទាន់មានសារទេ។ សូមចាប់ផ្ដើមសន្ទនា។</p>';

  if (wasNearBottom) scrollSellerChatToBottom();
}

function renderSellerChatInbox() {
  const target = $('sellerChatInboxList');
  if (!target) return;
  const total = state.chatInbox.reduce((sum, row) => sum + Number(row.unread_count || 0), 0);
  const badge = $('sellerChatUnreadBadge');
  badge.textContent = total > 99 ? '99+' : String(total);
  badge.classList.toggle('hidden', !total);

  target.innerHTML = state.chatInbox.map((chat) => {
    // Show the other participant: shop identity to buyers, personal identity to shop owners.
    const otherIsShop = String(chat.other_role || '').toLowerCase() === 'seller';
    const displayName = otherIsShop
      ? (chat.vendor?.store_name || 'ហាងអ្នកលក់')
      : (chat.buyer?.display_name || chat.other_name || 'អ្នកប្រើប្រាស់');
    const avatarUrl = otherIsShop ? chat.vendor?.store_logo_url : chat.buyer?.avatar_url;
    const img = avatarUrl
      ? `<img src="${esc(avatarUrl)}" alt="${esc(displayName)}" class="h-11 w-11 shrink-0 rounded-full object-cover">`
      : `<span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400">${ic(otherIsShop ? 'store' : 'user', 20)}</span>`;
    return `<button type="button" data-unified-chat="${esc(chat.id)}" class="seller-chat-inbox-item ${Number(chat.unread_count) > 0 ? 'unread' : ''}">${img}<span class="min-w-0 flex-1"><b class="block truncate">${esc(displayName)}</b><small class="block truncate text-slate-400">${esc(chat.last_message_preview || 'ចុចដើម្បីបើកសន្ទនា')}</small></span>${Number(chat.unread_count) > 0 ? `<span class="rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white">${Number(chat.unread_count)}</span>` : ''}</button>`;
  }).join('') || '<p class="py-8 text-center text-xs text-slate-400">មិនទាន់មានសន្ទនាទេ។</p>';
}

async function loadUnifiedSellerChatInbox() {
  if (!state.session) return;
  try {
    const res = await api('/api/seller-chat/inbox');
    state.chatInbox = res.data || [];
    renderSellerChatInbox();
  } catch (err) {
    console.warn('Chat inbox load failed:', err.message);
  }
}

async function loadSellerChatConversation(scrollToBottom = false) {
  if (!state.chatConversationId || !state.session) return;
  const res = await api('/api/seller-chat/conversations/' + encodeURIComponent(state.chatConversationId));
  const data = res.data || {};
  const conv = data.conversation || {};
  const messages = data.messages || [];

  // current_role identifies the viewer; display the opposite participant's identity.
  state.chatConversation = conv;
  const currentRole = String(conv.current_role || state.chatMode || 'buyer').toLowerCase();
  state.chatMode = currentRole === 'seller' ? 'seller' : 'buyer';
  const otherIsShop = state.chatMode === 'buyer';
  const otherName = otherIsShop
    ? (conv.vendor?.store_name || 'ហាងអ្នកលក់')
    : (conv.buyer?.display_name || 'អ្នកទិញ');
  const otherAvatar = otherIsShop ? conv.vendor?.store_logo_url : conv.buyer?.avatar_url;
  $('sellerChatTitle').textContent = otherName;
  $('sellerChatSubtitle').textContent = '';
  $('sellerChatHeaderTitle').textContent = otherName;
  $('sellerChatHeaderSubtitle').classList.add('hidden');
  $('sellerChatHeaderIdentity').classList.remove('hidden');
  $('sellerChatHeaderDefault').classList.add('hidden');
  $('sellerChatHeaderAvatar').innerHTML = otherAvatar
    ? `<img src="${esc(otherAvatar)}" alt="${esc(otherName)}" class="h-full w-full rounded-full object-cover">`
    : `<span class="grid h-full w-full place-items-center text-slate-400">${ic(otherIsShop ? 'store' : 'user', 18)}</span>`;
  $('sellerChatProductImage').innerHTML = otherAvatar
    ? `<img src="${esc(otherAvatar)}" alt="${esc(otherName)}" class="h-full w-full object-cover">`
    : `<span class="grid h-full w-full place-items-center text-slate-400">${ic(otherIsShop ? 'store' : 'user', 18)}</span>`;

  state.chatLoadedMessages = messages;
  const pending = state.chatPendingMedia.filter((m) => m.conversation_id === state.chatConversationId);
  renderSellerChatMessages([...messages, ...pending], scrollToBottom);

  $('sellerChatInboxPane').classList.add('mobile-hidden');
  $('sellerChatBack').classList.remove('hidden');
  $('sellerChatHeaderBack').classList.remove('hidden');
  $('sellerChatThread').classList.add('mobile-active');
}

async function openSellerChat(conversationId, mode, draftProduct = null) {
  state.chatConversationId = conversationId;
  state.chatDraftProduct = draftProduct || null;
  renderSellerChatDraftProduct();
  if (mode) state.chatMode = mode;

  openModal('sellerChatModal');
  $('sellerChatMessages').innerHTML = '<div class="global-loading" role="status" aria-label="កំពុងផ្ទុកសន្ទនា"><div class="loader" aria-hidden="true"></div><span>កំពុងផ្ទុកសន្ទនា...</span></div>';
  await loadSellerChatConversation(true);
  await loadUnifiedSellerChatInbox();
  scrollSellerChatToBottom();
  setTimeout(() => $('sellerChatInput')?.focus(), 80);
}

async function openSellerChatInbox() {
  if (!requireLogin()) return;
  state.chatConversationId = null;
  state.chatDraftProduct = null;
  renderSellerChatDraftProduct();
  $('sellerChatInboxPane').classList.remove('mobile-hidden');
  $('sellerChatThread').classList.remove('mobile-active');
  $('sellerChatBack').classList.add('hidden');
  $('sellerChatHeaderBack').classList.add('hidden');
  $('sellerChatHeaderIdentity').classList.add('hidden');
  $('sellerChatHeaderDefault').classList.remove('hidden');
  $('sellerChatHeaderSubtitle').classList.remove('hidden');
  $('sellerChatTitle').textContent = 'ជ្រើសរើសសន្ទនា';
  $('sellerChatSubtitle').textContent = 'ព័ត៌មានផលិតផលនឹងបង្ហាញនៅទីនេះ';
  openModal('sellerChatModal');
  await loadUnifiedSellerChatInbox();
}

async function startListingPosterChat(item) {
  if (!requireLogin()) return;
  if (!item?.id || !['job','real_estate'].includes(item.listing_type)) return;
  try {
    const result = await api('/api/seller-chat/listing-conversations', {
      method: 'POST',
      body: JSON.stringify({ listing_type: item.listing_type, listing_id: item.id })
    });
    if (!result.data?.id) throw new Error('មិនអាចបើកសន្ទនាបានទេ។');
    await openSellerChat(result.data.id, 'buyer', null);
  } catch (error) {
    toast(error.message || 'មិនអាចឆាតជាមួយអ្នកផុសបានទេ។', 'error');
  }
}

async function startStoreChat(vendorId) {
  if (!requireLogin()) return;
  const storeId = String(vendorId || '').trim();
  if (!storeId) { toast('មិនមានព័ត៌មានហាងនេះទេ។', 'warning'); return; }
  try {
    await loadUnifiedSellerChatInbox();
    const existing = state.chatInbox.find(conversation => String(conversation.vendor_id || conversation.vendor?.id || '') === storeId);
    if (existing?.id) { await openSellerChat(existing.id, 'buyer', null); return; }
    const result = await api('/api/seller-chat/store-conversations', { method: 'POST', body: JSON.stringify({ vendor_id: storeId }) });
    if (!result.data?.id) throw new Error('មិនអាចបើកសន្ទនាជាមួយហាងបានទេ។');
    await openSellerChat(result.data.id, 'buyer', null);
  } catch (error) { toast(error.message || 'មិនអាចឆាតជាមួយហាងបានទេ។', 'error'); }
}

async function startBuyerSellerChat(productId) {
  if (!requireLogin()) return;
  const targetProduct = (state.currentProduct && String(state.currentProduct.id) === String(productId))
    ? state.currentProduct
    : state.products.find((x) => String(x.id) === String(productId));

  try {
    await loadUnifiedSellerChatInbox();
    let existingId = null;
    if (targetProduct?.vendor_id) {
      const match = state.chatInbox.find((c) => String(c.vendor_id || c.vendor?.id) === String(targetProduct.vendor_id));
      if (match) existingId = match.id;
    }
    if (existingId) {
      await openSellerChat(existingId, 'buyer', targetProduct || null);
      return;
    }
    const res = await api('/api/seller-chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, attach_product: false })
    });
    if (!res.data?.id) throw new Error('មិនអាចបើកសន្ទនាបានទេ។');
    await openSellerChat(res.data.id, 'buyer', targetProduct || null);
  } catch (error) {
    toast(error.message, 'error');
  }
}

function minimizeSellerChatPanel() {
  closeModal('sellerChatModal');
  $('supportChatLauncher')?.classList.remove('hidden');
}

function toggleSellerChatPanel() {
  const modal = $('sellerChatModal');
  if (modal.classList.contains('open')) { minimizeSellerChatPanel(); return; }
  if (state.chatConversationId) { openModal('sellerChatModal'); scrollSellerChatToBottom(); return; }
  void openSellerChatInbox();
}

function syncSellerChatComposer() {
  const input = $('sellerChatInput');
  const send = $('sellerChatSend');
  if (!input || !send) return;
  send.disabled = input.disabled || (!input.value.trim() && !state.chatDraftProduct);
  input.style.height = 'auto';
  input.style.height = Math.min(100, Math.max(40, input.scrollHeight)) + 'px';
}

/* --------------------------------------------------------------------------
   13. Checkout, Telegram & Presence Helpers
   -------------------------------------------------------------------------- */
function openCheckout(p) {
  if (!requireLogin()) return;
  if (!p || Number(p.stock) <= 0) { toast('ទំនិញនេះអស់ស្តុកហើយ។', 'warning'); return; }
  if (!$('checkoutModal')) {
    const wrap = document.createElement('div');
    wrap.id = 'checkoutModal';
    wrap.className = 'modal';
    wrap.innerHTML = `<section class="modal-box app-checkout-box max-w-[520px] p-6">
      <div class="mb-4 flex items-center justify-between"><h2 class="text-lg font-bold">ព័ត៌មានដឹកជញ្ជូន និងទូទាត់</h2><button type="button" class="close-btn" data-close="checkoutModal">${ic('x', 16)}</button></div>
      <form id="checkoutForm" class="space-y-3">
        <input id="checkoutName" required class="field" placeholder="ឈ្មោះអ្នកទទួល">
        <input id="checkoutPhone" required class="field" placeholder="លេខទូរស័ព្ទ">
        <textarea id="checkoutAddress" required class="field min-h-20" placeholder="អាសយដ្ឋានដឹកជញ្ជូន"></textarea>
        <fieldset class="checkout-payment-options">
          <legend>ជ្រើសរើសវិធីទូទាត់</legend>
          <label><input type="radio" name="payment_method" value="cash_on_delivery" checked><span><b>${ic('truck',15)} ទូទាត់ពេលទទួលទំនិញ</b><small>Cash on Delivery</small></span></label>
          <label><input type="radio" name="payment_method" value="bank_transfer"><span><b>${ic('wallet',15)} KHQR / ផ្ទេរប្រាក់តាមធនាគារ</b><small>Bank Transfer · រង់ចាំការផ្ទៀងផ្ទាត់</small></span></label>
        </fieldset>
        <p id="checkoutPaymentNote" class="checkout-payment-note" hidden>ការបញ្ជាទិញនឹងរង់ចាំការផ្ទៀងផ្ទាត់។ ប្រព័ន្ធមិនទាន់មាន QR Code របស់អ្នកលក់ក្នុងព័ត៌មានហាងទេ។ សូមទាក់ទងអ្នកលក់ដើម្បីទទួល KHQR ឬព័ត៌មានគណនីផ្ទេរប្រាក់។</p>
        <div class="flex justify-between pt-2 font-bold"><span>សរុប</span><span id="checkoutTotal"></span></div>
        <button id="checkoutSubmit" class="brand-gradient w-full rounded-full py-3 text-xs font-bold text-white">បញ្ជាក់ការបញ្ជាទិញ</button>
      </form>
    </section>`;
    document.body.appendChild(wrap);
    wrap.querySelector('[data-close]').onclick = () => closeModal('checkoutModal');
    $('checkoutForm').querySelectorAll('[name="payment_method"]').forEach(input => input.addEventListener('change', () => {
      $('checkoutPaymentNote').hidden = input.value !== 'bank_transfer' || !input.checked;
    }));
    $('checkoutForm').onsubmit = async e => {
      e.preventDefault();
      const submit = $('checkoutSubmit');
      const original = submit.innerHTML;
      submit.disabled = true;
      submit.textContent = 'កំពុងបញ្ជាទិញ...';
      try {
        const paymentMethod = new FormData($('checkoutForm')).get('payment_method') || 'cash_on_delivery';
        await api('/api/orders', {
          method: 'POST',
          body: JSON.stringify({
            customer_name: $('checkoutName').value.trim(),
            customer_phone: $('checkoutPhone').value.trim(),
            delivery_address: $('checkoutAddress').value.trim(),
            payment_method: paymentMethod,
            items: [{ product_id: state.currentProduct.id, quantity: 1 }]
          })
        });
        closeModal('checkoutModal');
        toast(paymentMethod === 'bank_transfer' ? 'បានទទួលការបញ្ជាទិញ។ ស្ថានភាពទូទាត់កំពុងរង់ចាំការផ្ទៀងផ្ទាត់។' : 'បានបញ្ជាទិញជោគជ័យ!');
        await Promise.all([loadOrders(), loadProducts()]);
      } catch (err) {
        toast(err.message, 'error');
      } finally {
        submit.disabled = false;
        submit.innerHTML = original;
      }
    };
  }
  $('checkoutTotal').textContent = money(p.price);
  $('checkoutName').value = profileName();
  $('checkoutPhone').value = state.me?.profile?.phone || '';
  $('checkoutForm').querySelector('[name="payment_method"][value="cash_on_delivery"]').checked = true;
  $('checkoutPaymentNote').hidden = true;
  openModal('checkoutModal');
}

function openAuth(mode = 'login') {
  setAuthMode(mode);
  openModal('authModal');
  mountTelegramLoginWidget();
}

function mountTelegramLoginWidget() {
  return mountTelegramWidget('telegramLoginWidget', 'on7inOneTelegramLogin', 'telegramLoginWidgetMounted');
}

function mountTelegramWidget(containerId, callbackName, mountedKey) {
  const container = $(containerId);
  const username = String(state.telegramBotUsername || '').replace(/^@/, '').trim();
  if (!container || !/^[A-Za-z0-9_]{5,32}$/.test(username)) return false;
  if (state[mountedKey]) return true;

  container.replaceChildren();
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://telegram.org/js/telegram-widget.js?22';
  script.dataset.telegramLogin = username;
  script.dataset.size = 'large';
  script.dataset.userpic = 'false';
  script.dataset.onauth = callbackName + '(user)';
  container.appendChild(script);
  state[mountedKey] = true;
  return true;
}

async function completeTelegramLogin(identity) {
  if (state.telegramAuthPending) return;
  state.telegramAuthPending = true;
  try {
    if (!state.supabase) throw new Error('ប្រព័ន្ធ Supabase មិនទាន់ភ្ជាប់ទេ។');
    const response = await fetch('/api/auth/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(identity),
      cache: 'no-store'
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'មិនអាចចូលតាម Telegram បានទេ។');

    const session = payload.data?.session;
    if (!session?.access_token || !session?.refresh_token) {
      throw new Error('Telegram មិនបានផ្ដល់ Session ត្រឹមត្រូវទេ។');
    }

    const { data, error } = await state.supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token
    });
    if (error) throw error;
    state.session = data.session || session;
    await refreshSession();
    if (!state.session) throw new Error('មិនអាចរក្សាទុក Session របស់ Telegram បានទេ។');

    syncHeader();
    closeModal('authModal');
    toast(payload.data?.isNewUser
      ? 'បានបង្កើតគណនី និងចូលតាម Telegram ជោគជ័យ!'
      : 'បានចូលគណនីតាម Telegram ជោគជ័យ!');
    void Promise.all([loadSaved(), loadOrders(), loadUnifiedSellerChatInbox()])
      .catch(error => console.warn('Could not load Telegram account data:', error.message));
  } catch (error) {
    toast(error.message || 'មិនអាចចូលតាម Telegram បានទេ។', 'error');
  } finally {
    state.telegramAuthPending = false;
  }
}

async function completeTelegramLink(identity) {
  if (state.telegramAuthPending) return;
  if (!state.session) {
    toast('សូមចូលគណនី 7inOne ជាមុនសិន។', 'warning');
    return;
  }
  state.telegramAuthPending = true;
  try {
    await api('/api/me/telegram', {
      method: 'POST',
      body: JSON.stringify(identity)
    });
    state.telegramProfileWidgetMounted = false;
    $('telegramProfileWidget')?.replaceChildren();
    await renderTelegramSecurity();
    toast('បានភ្ជាប់ Telegram Login ជាមួយគណនីនេះរួចរាល់។');
  } catch (error) {
    toast(error.message || 'មិនអាចភ្ជាប់ Telegram បានទេ។', 'error');
  } finally {
    state.telegramAuthPending = false;
  }
}

window.on7inOneTelegramLogin = identity => { void completeTelegramLogin(identity); };
window.on7inOneTelegramLink = identity => { void completeTelegramLink(identity); }

function setAuthMode(mode) {
  state.authMode = mode;
  const reg = mode === 'register';
  $('authNameWrap').classList.toggle('hidden', !reg);
  $('authName').required = reg;
  $('authTitle').textContent = reg ? 'បង្កើតគណនី 7inOne' : 'សូមស្វាគមន៍មកកាន់ 7inOne';
  $('authSubmit').textContent = reg ? 'បង្កើតគណនី' : 'ចូលគណនី';
  document.querySelectorAll('[data-auth-mode]').forEach((b) => {
    const active = b.dataset.authMode === mode;
    b.classList.toggle('bg-white', active);
    b.classList.toggle('shadow-sm', active);
  });
}

async function renderTelegramSecurity() {
  if (!state.session) return;
  mountTelegramWidget('telegramProfileWidget', 'on7inOneTelegramLink', 'telegramProfileWidgetMounted');
  try {
    const res = await api('/api/me/telegram');
    const connected = Boolean(res.data?.connected);
    $('telegramAccountStatus').textContent = connected ? 'Telegram Bot Chat បានភ្ជាប់រួចរាល់ ✓' : 'Telegram Bot Chat មិនទាន់ភ្ជាប់';
    $('sendTelegramOtpBtn').disabled = !connected;
    $('changeTelegramPasswordBtn').disabled = !connected;
  } catch {}
}

function createProductGalleryVideoFrame(videoId, title = 'Product video', autoplay = true) {
  const frame = document.createElement('iframe');
  frame.className = 'product-gallery-video-frame';
  frame.dataset.productGalleryVideo = 'true';
  frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId) + '?autoplay=' + (autoplay ? '1' : '0') + '&controls=1&rel=0&playsinline=1';
  frame.title = title || 'Product video';
  frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  return frame;
}
function productGalleryVideoFrameMarkup(videoId, title = 'Product video', autoplay = false) {
  return '<iframe class="product-gallery-video-frame" data-product-gallery-video="true" src="https://www.youtube-nocookie.com/embed/' +
    encodeURIComponent(videoId) + '?autoplay=' + (autoplay ? '1' : '0') +
    '&controls=1&rel=0&playsinline=1" title="' + esc(title || 'Product video') +
    '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
}

function youtubeVideoId(value) {
  try {
    const url = new URL(String(value || '').trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0]?.match(/^[A-Za-z0-9_-]{11}$/)?.[0] || '';
    if (!['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host)) return '';
    const id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|live|shorts)\/([A-Za-z0-9_-]{11})\/?$/)?.[1] || '';
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : '';
  } catch { return ''; }
}
let listingVideoPlayer = null;
let listingVideoProgressTimer = null;
let listingVideoSession = 0;
let listingProductAutoSlideTimer = null;

function startListingProductAutoSlide(metaHost) {
  if (listingProductAutoSlideTimer) clearInterval(listingProductAutoSlideTimer);
  listingProductAutoSlideTimer = null;
  const rail = metaHost?.querySelector('.is-similar-products .home-shorts-related-list');
  if (!rail) return;
  const originals = Array.from(rail.children);
  if (originals.length < 2) return;
  const originalWidth = rail.scrollWidth;
  originals.forEach(item => rail.appendChild(item.cloneNode(true)));
  let paused = false;
  rail.addEventListener('mouseenter', () => { paused = true; });
  rail.addEventListener('mouseleave', () => { paused = false; });
  rail.addEventListener('pointerdown', () => { paused = true; });
  rail.addEventListener('pointerup', () => { paused = false; });
  rail.addEventListener('pointercancel', () => { paused = false; });
  listingProductAutoSlideTimer = setInterval(() => {
    if (paused || !rail.isConnected || document.hidden) return;
    rail.scrollLeft += 0.7;
    if (rail.scrollLeft >= originalWidth) rail.scrollLeft -= originalWidth;
  }, 25);
}
let listingVideoApiPromise = null;

function loadYouTubeIframeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (listingVideoApiPromise) return listingVideoApiPromise;
  listingVideoApiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      try { if (typeof previousReady === 'function') previousReady(); } catch {}
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error('YouTube Player API មិនអាចដំណើរការបានទេ។'));
    };
    let script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => reject(new Error('មិនអាចផ្ទុក YouTube Player API បានទេ។'));
      document.head.appendChild(script);
    }
  });
  return listingVideoApiPromise;
}

function stopListingVideoProgress() {
  if (listingVideoProgressTimer) {
    window.clearInterval(listingVideoProgressTimer);
    listingVideoProgressTimer = null;
  }
}

function closeListingVideoPopup() {
  listingVideoSession += 1;
  if (listingProductAutoSlideTimer) clearInterval(listingProductAutoSlideTimer);
  listingProductAutoSlideTimer = null;
  stopListingVideoProgress();
  if (listingVideoPlayer) {
    try { listingVideoPlayer.stopVideo(); } catch {}
    try { listingVideoPlayer.destroy(); } catch {}
    listingVideoPlayer = null;
  }
  const popup = $('homeShortsPopup');
  const stage = $('homeShortsPopupStage');
  if (stage) stage.replaceChildren();
  if (popup?.open) popup.close();
}

function openListingVideoPopup(url, title = 'វីដេអូ', meta = {}) {
  const videoId = youtubeVideoId(url);
  const popup = $('homeShortsPopup');
  const stage = $('homeShortsPopupStage');
  if (!videoId || !popup || !stage) {
    toast('YouTube Video Link មិនត្រឹមត្រូវទេ។', 'error');
    return;
  }

  closeListingVideoPopup();
  const session = listingVideoSession;
  const isProductGalleryPopup = meta.source === 'product-gallery';
  popup.classList.toggle('is-product-gallery-popup', isProductGalleryPopup);
  $('homeShortsPopupTitle').textContent = title || 'វីដេអូប្រកាស';
  const metaHost = $('homeShortsPopupMeta');
  if (metaHost) {
    const shopName = meta.storeName || 'ហាងអ្នកលក់';
    const shopAvatar = meta.storeAvatar || '';
    const currentId = String(meta.listingId || '');
    const vendorId = String(meta.vendorId || '');
    const category = String(meta.category || '');
    const renderShopMeta = () =>
      '<div class="home-shorts-shop-meta">' +
        (shopAvatar ? '<img src="' + esc(shopAvatar) + '" alt="' + esc(shopName) + '">' : '<span class="home-shorts-shop-fallback">' + esc(Array.from(shopName)[0] || 'S') + '</span>') +
        '<span class="home-shorts-shop-name">' + esc(shopName) + '</span>' +
        (meta.storeVerified ? verifiedStoreBadge(vendorId) : '') +
      '</div>';
    const renderCurrentProduct = () => {
      const image = meta.productImage || '';
      const price = meta.productPrice != null && meta.productPrice !== '' ? money(meta.productPrice) : '';
      return '<button type="button" class="home-shorts-current-product" data-related-product-id="' + esc(currentId) + '">' +
        (image ? '<img src="' + esc(image) + '" alt="" loading="lazy">' : '<span class="home-shorts-related-placeholder">' + ic('image',16) + '</span>') +
        '<span class="home-shorts-current-product-info"><strong>' + esc(meta.productTitle || title || 'ផលិតផល') + '</strong>' +
        (price ? '<span>' + esc(price) + '</span>' : '') + '</span></button>';
    };
    const renderProductSection = (sectionTitle, products, isSimilar = false) => {
      if (!products.length && !isSimilar) return '';
      const rows = products.map(product => {
        const productImage = (Array.isArray(product.product_images) ? product.product_images.slice().sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)).find(image => image?.image_url)?.image_url : '') ||
          (Array.isArray(product.images) ? product.images.map(image => typeof image === 'string' ? image : (image?.image_url || image?.url || '')).find(Boolean) : '') ||
          (Array.isArray(product.image_urls) ? product.image_urls.find(Boolean) : '') ||
          product.primary_image_url || product.image_url || product.cover_url || product.thumbnail_url || product.photo_url || '';
        const productPrice = product.price_label != null ? money(product.price_label) :
          product.price != null ? money(product.price) : '';
        return '<div class="home-shorts-related-row">' +
          '<button type="button" class="home-shorts-related-open" data-related-product-id="' + esc(product.id) + '">' +
            (productImage ? '<img src="' + esc(productImage) + '" alt="" loading="lazy">' : '<span class="home-shorts-related-placeholder">' + ic('image',16) + '</span>') +
            '<span class="home-shorts-related-title">' + esc(product.title || 'ផលិតផល') + '</span>' +
            (productPrice ? '<strong>' + esc(productPrice) + '</strong>' : '') +
          '</button>' +
        '</div>';
      }).join('');
      const content = rows || '<div class="home-shorts-related-empty">មិនទាន់មានផលិតផលស្រដៀងទេ</div>';
      return '<section class="home-shorts-product-section' + (isSimilar ? ' is-similar-products' : '') + '">' +
        (isSimilar
          ? '<div class="home-shorts-related-heading"><h4>' + esc(sectionTitle) + '</h4><div class="home-shorts-related-controls">' +
              '<button type="button" class="home-shorts-gallery-close" aria-label="បិទវីដេអូ">×</button>' +
            '</div></div>'
          : '<h4>' + esc(sectionTitle) + '</h4>') +
        '<div class="home-shorts-related-list">' + content + '</div></section>';
    };
    const renderContext = (shopProducts = [], similarProducts = []) => isProductGalleryPopup
      ? '<div class="home-shorts-popup-context">' + renderShopMeta() + renderCurrentProduct() +
        renderProductSection('ផលិតផលស្រដៀង', similarProducts, true) + '</div>'
      : renderShopMeta() + renderProductSection('ផលិតផលរបស់ហាង', shopProducts) + renderProductSection('ផលិតផលស្រដៀង', similarProducts);
    metaHost.innerHTML = renderContext();
    metaHost.hidden = false;
    {
      const loadRelatedProducts = async () => {
        const requests = [];
        if (vendorId) {
          const params = new URLSearchParams({ vendor_id: vendorId, limit: '50' });
          requests.push(api('/api/products?' + params.toString()).then(result => ({
            type: 'shop', products: Array.isArray(result.data) ? result.data : []
          })));
        }
        {
          const params = new URLSearchParams({ limit: '100' });
          if (category) params.set('category', category);
          requests.push(api('/api/products?' + params.toString()).then(result => ({
            type: 'similar', products: Array.isArray(result.data) ? result.data : []
          })));
        }
        const results = await Promise.allSettled(requests);
        if (session !== listingVideoSession || !metaHost.isConnected) return;
        let shopProducts = [], similarProducts = [];
        results.forEach(result => {
          if (result.status !== 'fulfilled') {
            console.warn('Could not load popup related products:', result.reason);
            return;
          }
          if (result.value.type === 'shop') {
            shopProducts = result.value.products.filter(product => product && String(product.id) !== currentId &&
              String(product.vendor_id || '') === vendorId).slice(0, 4);
          } else {
            similarProducts = result.value.products.filter(product => product && String(product.id) !== currentId &&
              (!category || String(product.category || '') === category)).slice(0, 12);
          }
        });
        metaHost.innerHTML = renderContext(shopProducts, similarProducts);
        if (isProductGalleryPopup) startListingProductAutoSlide(metaHost);
      };
      void loadRelatedProducts().catch(error => console.warn('Could not load popup related products:', error));
    }
    metaHost.onclick = event => {
      if (event.target.closest('.home-shorts-gallery-close')) {
        event.preventDefault();
        closeListingVideoPopup();
        return;
      }
      const scrollButton = event.target.closest('[data-related-scroll]');
      if (scrollButton) {
        event.preventDefault();
        const rail = metaHost.querySelector('.is-similar-products .home-shorts-related-list');
        if (rail) rail.scrollBy({ left: (scrollButton.dataset.relatedScroll === 'right' ? 1 : -1) * Math.max(160, rail.clientWidth * 0.75), behavior: 'smooth' });
        return;
      }
      const productButton = event.target.closest('[data-related-product-id]');
      if (productButton) {
        event.preventDefault();
        const productId = productButton.dataset.relatedProductId;
        closeListingVideoPopup();
        void openProduct(productId);
      }
    };
  }

  const playerShell = document.createElement('div');
  playerShell.className = 'custom-youtube-player';
  playerShell.innerHTML =
    '<div class="custom-youtube-screen">' +
      '<div class="custom-youtube-frame" id="customYoutubeFrame"></div>' +
      '<button type="button" class="custom-youtube-center-play" data-video-action="toggle" aria-label="ចាក់វីដេអូ"><span data-video-play-icon></span></button>' +
      '<div class="custom-youtube-loading">កំពុងផ្ទុកវីដេអូ...</div>' +
      '<div class="custom-youtube-controls">' +
      '<div class="custom-youtube-progress-row"><span class="custom-youtube-current">0:00</span><input class="custom-youtube-seek" data-video-seek type="range" min="0" max="1000" value="0" step="1" aria-label="ទីតាំងវីដេអូ"><span class="custom-youtube-duration">0:00</span></div>' +
      '<div class="custom-youtube-control-row">' +
        '<button type="button" data-video-action="toggle" aria-label="ចាក់ / ផ្អាក"><span data-video-play-icon>▶</span></button>' +
        '<button type="button" data-video-action="back" aria-label="ថយក្រោយ 10 វិនាទី">−10</button>' +
        '<button type="button" data-video-action="forward" aria-label="ទៅមុខ 10 វិនាទី">+10</button>' +
        '<button type="button" data-video-action="captions" aria-label="បើក/បិទ Caption" aria-pressed="false" title="បើក/បិទ Caption">CC</button>' +
        '<button type="button" data-video-action="mute" aria-label="បិទសំឡេង"><span data-video-volume-icon>🔊</span></button>' +
        '<input class="custom-youtube-volume" data-video-volume type="range" min="0" max="100" value="85" aria-label="កម្រិតសំឡេង">' +
        '<span class="custom-youtube-spacer"></span>' +
        '<button type="button" data-video-action="settings" aria-label="ការកំណត់">⚙</button>' +
        '<button type="button" data-video-action="fullscreen" aria-label="ពេញអេក្រង់">⛶</button>' +
      '</div>' +
      '<div class="custom-youtube-settings" hidden><label>ល្បឿនចាក់<select data-video-speed aria-label="ល្បឿនចាក់"><option value="0.5">0.5×</option><option value="0.75">0.75×</option><option value="1" selected>ធម្មតា 1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="1.75">1.75×</option><option value="2">2×</option></select></label></div>' +
      '</div>' +
    '</div>' +
    '';

  stage.replaceChildren(playerShell);

  // Drag the floating popup directly from the video surface with the left mouse button.
  // Keep custom controls interactive while making the YouTube iframe click-through.
  const videoScreen = playerShell.querySelector('.custom-youtube-screen');
  if (videoScreen && !videoScreen.dataset.popupDragBound) {
    videoScreen.dataset.popupDragBound = '1';
    let videoDrag = null;
    videoScreen.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('.custom-youtube-controls, button, input, select, a')) return;
      const rect = popup.getBoundingClientRect();
      videoDrag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: rect.left, top: rect.top };
      try { videoScreen.setPointerCapture(event.pointerId); } catch {}
      popup.style.position = 'fixed';
      popup.style.margin = '0';
      popup.style.transform = 'none';
      popup.style.left = rect.left + 'px';
      popup.style.top = rect.top + 'px';
      event.preventDefault();
    });
    videoScreen.addEventListener('pointermove', event => {
      if (!videoDrag || event.pointerId !== videoDrag.pointerId) return;
      const left = Math.max(8, Math.min(window.innerWidth - popup.offsetWidth - 8, videoDrag.left + event.clientX - videoDrag.startX));
      const top = Math.max(8, Math.min(window.innerHeight - popup.offsetHeight - 8, videoDrag.top + event.clientY - videoDrag.startY));
      popup.style.left = left + 'px';
      popup.style.top = top + 'px';
    });
    const stopVideoDrag = event => {
      if (videoDrag && event.pointerId === videoDrag.pointerId) videoDrag = null;
    };
    videoScreen.addEventListener('pointerup', stopVideoDrag);
    videoScreen.addEventListener('pointercancel', stopVideoDrag);
  }
  // Non-modal floating player: keep the marketplace interactive behind it.
  if (!popup.open) popup.show();

  const frameHost = playerShell.querySelector('#customYoutubeFrame');
  const seek = playerShell.querySelector('[data-video-seek]');
  const volume = playerShell.querySelector('[data-video-volume]');
  const settings = playerShell.querySelector('.custom-youtube-settings');
  const loading = playerShell.querySelector('.custom-youtube-loading');

  const formatTime = seconds => {
    const value = Math.max(0, Math.floor(Number(seconds) || 0));
    return Math.floor(value / 60) + ':' + String(value % 60).padStart(2, '0');
  };
  const setPlayingUi = playing => {
    const playSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13l10-6.5-10-6.5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
    const pauseSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8.5 5.5v13M15.5 5.5v13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    playerShell.querySelectorAll('[data-video-play-icon]').forEach(node => {
      node.innerHTML = playing ? pauseSvg : playSvg;
    });
    const centerPlay = playerShell.querySelector('.custom-youtube-center-play');
    if (centerPlay) {
      centerPlay.classList.toggle('is-playing', playing);
      centerPlay.setAttribute('aria-label', playing ? 'ផ្អាកវីដេអូ' : 'ចាក់វីដេអូ');
    }
  };
  const updateProgress = () => {
    if (!listingVideoPlayer || session !== listingVideoSession) return;
    try {
      const duration = listingVideoPlayer.getDuration() || 0;
      const current = listingVideoPlayer.getCurrentTime() || 0;
      seek.value = duration ? String(Math.round(current / duration * 1000)) : '0';
      playerShell.querySelector('.custom-youtube-current').textContent = formatTime(current);
      playerShell.querySelector('.custom-youtube-duration').textContent = formatTime(duration);
    } catch {}
  };

  let captionsEnabled = false;
  const captionsButton = playerShell.querySelector('[data-video-action="captions"]');
  playerShell.addEventListener('click', event => {
    const button = event.target.closest('[data-video-action]');
    if (!button || !listingVideoPlayer) return;
    const action = button.dataset.videoAction;
    try {
      if (action === 'toggle') {
        if (listingVideoPlayer.getPlayerState() === 1) listingVideoPlayer.pauseVideo();
        else listingVideoPlayer.playVideo();
      } else if (action === 'back') {
        listingVideoPlayer.seekTo(Math.max(0, listingVideoPlayer.getCurrentTime() - 10), true);
      } else if (action === 'forward') {
        listingVideoPlayer.seekTo(Math.min(listingVideoPlayer.getDuration() || Infinity, listingVideoPlayer.getCurrentTime() + 10), true);
      } else if (action === 'captions') {
        captionsEnabled = !captionsEnabled;
        if (captionsEnabled) listingVideoPlayer.loadModule('captions');
        else listingVideoPlayer.unloadModule('captions');
        captionsButton?.setAttribute('aria-pressed', String(captionsEnabled));
        captionsButton?.classList.toggle('is-active', captionsEnabled);
      } else if (action === 'mute') {
        if (listingVideoPlayer.isMuted()) listingVideoPlayer.unMute();
        else listingVideoPlayer.mute();
        playerShell.querySelector('[data-video-volume-icon]').textContent = listingVideoPlayer.isMuted() ? '🔇' : '🔊';
      } else if (action === 'settings') {
        settings.hidden = !settings.hidden;
      } else if (action === 'fullscreen') {
        if (document.fullscreenElement) document.exitFullscreen?.();
        else playerShell.requestFullscreen?.();
      }
    } catch {}
  });

  let seekCommitFrame = 0;
  const commitSeek = () => {
    if (!listingVideoPlayer || session !== listingVideoSession) return;
    const duration = listingVideoPlayer.getDuration() || 0;
    if (!duration) return;
    const targetTime = Math.max(0, Math.min(duration, Number(seek.value) / 1000 * duration));
    playerShell.querySelector('.custom-youtube-current').textContent = formatTime(targetTime);
    try { listingVideoPlayer.seekTo(targetTime, true); } catch {}
  };
  seek.addEventListener('input', () => {
    if (!listingVideoPlayer) return;
    const duration = listingVideoPlayer.getDuration() || 0;
    if (!duration) return;
    const targetTime = Math.max(0, Math.min(duration, Number(seek.value) / 1000 * duration));
    playerShell.querySelector('.custom-youtube-current').textContent = formatTime(targetTime);
    if (seekCommitFrame) cancelAnimationFrame(seekCommitFrame);
    seekCommitFrame = requestAnimationFrame(commitSeek);
  });
  seek.addEventListener('change', commitSeek);
  seek.addEventListener('pointerup', commitSeek);
  seek.addEventListener('keyup', event => { if (event.key.startsWith('Arrow') || event.key === 'Home' || event.key === 'End') commitSeek(); });
  volume.addEventListener('input', () => {
    if (!listingVideoPlayer) return;
    const level = Number(volume.value);
    listingVideoPlayer.setVolume(level);
    if (level > 0 && listingVideoPlayer.isMuted()) listingVideoPlayer.unMute();
    playerShell.querySelector('[data-video-volume-icon]').textContent = level === 0 ? '🔇' : '🔊';
  });
  playerShell.querySelector('[data-video-speed]').addEventListener('change', event => {
    try { listingVideoPlayer?.setPlaybackRate(Number(event.target.value)); } catch {}
  });

  loadYouTubeIframeApi().then(YT => {
    if (session !== listingVideoSession || !frameHost.isConnected) return;
    listingVideoPlayer = new YT.Player(frameHost, {
      width: '100%',
      height: '100%',
      videoId,
      playerVars: { autoplay: 1, cc_load_policy: 0, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, playsinline: 1, rel: 0, enablejsapi: 1, origin: window.location.origin },
      events: {
        onReady: event => {
          if (session !== listingVideoSession) {
            try { event.target.destroy(); } catch {}
            return;
          }
          loading.hidden = true;
          // Start with captions disabled; viewers can enable them with the CC control.
          captionsEnabled = false;
          captionsButton?.setAttribute('aria-pressed', 'false');
          captionsButton?.classList.remove('is-active');
          try { event.target.unloadModule('captions'); } catch {}
          try { event.target.setOption('captions', 'track', {}); } catch {}
          event.target.setVolume(Number(volume.value));
          event.target.playVideo();
          stopListingVideoProgress();
          listingVideoProgressTimer = window.setInterval(updateProgress, 250);
        },
        onStateChange: event => {
          if (session !== listingVideoSession) return;
          setPlayingUi(event.data === YT.PlayerState.PLAYING);
          if (!captionsEnabled) {
            try { listingVideoPlayer?.unloadModule('captions'); } catch {}
            try { listingVideoPlayer?.setOption('captions', 'track', {}); } catch {}
          }
          if (event.data === YT.PlayerState.ENDED) {
            updateProgress();
            stopListingVideoProgress();
          } else if (event.data === YT.PlayerState.PLAYING && !listingVideoProgressTimer) {
            listingVideoProgressTimer = window.setInterval(updateProgress, 250);
          }
        },
        onError: () => {
          if (session !== listingVideoSession) return;
          loading.textContent = 'មិនអាចចាក់វីដេអូនេះបានទេ។ សូមពិនិត្យ Link YouTube។';
          loading.hidden = false;
        }
      }
    });
  }).catch(error => {
    if (session !== listingVideoSession) return;
    loading.textContent = error.message || 'មិនអាចផ្ទុក YouTube Player បានទេ។';
    loading.hidden = false;
  });
}
function listingVideoButton(item) {
  if (!item?.youtube_video_url || !youtubeVideoId(item.youtube_video_url)) return '';
  const store = item.vendors || item.vendor || {};
  const poster = item.poster || {};
  const image = (Array.isArray(item.image_urls) ? item.image_urls[0] : '') || item.image_url || item.cover_url || '';
  const price = item.price_label == null ? '' : money(item.price_label);
  const meta = {
    storeName: store.store_name || item.store_name || 'ហាងអ្នកលក់',
    storeAvatar: store.store_logo_url || store.logo_url || '',
    listingId: item.id || '',
    vendorId: item.vendor_id || store.id || '',
    category: item.category || ''
  };
  return '<button type="button" class="listing-video-open" data-listing-video="' + esc(item.youtube_video_url) + '" data-listing-video-title="' + esc(item.title || 'វីដេអូប្រកាស') + '" data-video-store-name="' + esc(meta.storeName) + '" data-video-store-avatar="' + esc(meta.storeAvatar) + '" data-video-listing-id="' + esc(meta.listingId) + '" data-video-vendor-id="' + esc(meta.vendorId) + '" data-video-category="' + esc(meta.category) + '">' + ic('play',17) + '<span>មើលវីដេអូ YouTube</span></button>';
}

async function syncVendorPresence() {
  const nextId = state.session && !document.hidden && state.me?.vendor?.status === 'approved' ? String(state.me.vendor.id || '') : '';
  if (nextId) {
    try { await fetch('/api/vendor/presence?tab_id=' + encodeURIComponent(state.vendorPresenceTabId), { method: 'POST', headers: { Authorization: 'Bearer ' + state.session.access_token } }); } catch {}
  }
}

/* --------------------------------------------------------------------------
   14. Event Bindings & Bootstrapping
   -------------------------------------------------------------------------- */
function initIcons() {
  $('logoIcon').innerHTML = ic('bag', 20);
  $('searchIcon').innerHTML = ic('search', 17);
  $('searchBtn').innerHTML = ic('search', 16);
  $('postIcon').innerHTML = ic('plus', 16);
  $('mobilePostBtn').innerHTML = ic('plus', 18);
  $('bellIcon').innerHTML = ic('bell', 18);
  $('chevronIcon').innerHTML = ic('chev', 13);
  $('menuUserIcon').innerHTML = ic('user', 15);
  $('menuStoreIcon').innerHTML = ic('store', 15);
  $('menuAdminIcon').innerHTML = ic('shield', 15);
  $('menuSaveIcon').innerHTML = ic('bookmark', 15);
  $('menuLoginIcon').innerHTML = ic('logout', 15);
  if ($('heroShield')) $('heroShield').innerHTML = ic('shield', 15);
  if ($('heroUsers')) $('heroUsers').innerHTML = ic('users', 15);
  $('catAll').innerHTML = ic('grid', 22);
  $('catPhone').innerHTML = ic('phone', 22);
  $('catCar').innerHTML = ic('car', 22);
  $('catHome').innerHTML = ic('home', 22);
  $('catFashion').innerHTML = ic('shirt', 22);
  $('catFurniture').innerHTML = ic('sofa', 22);
  $('emptyIcon').innerHTML = ic('search', 24);
  $('coverCam').innerHTML = ic('camera', 14);
  $('avatarCam').insertAdjacentHTML('afterbegin', ic('camera', 13));
  $('sellerGateIcon').innerHTML = ic('shield', 22);
  $('kpiListingsIcon').innerHTML = ic('grid', 17);
  $('kpiViewsIcon').innerHTML = ic('eye', 17);
  $('kpiRatingIcon').innerHTML = ic('star', 17);
  $('kpiSalesIcon').innerHTML = ic('wallet', 17);
  $('addProductIcon').innerHTML = ic('plus', 15);
  $('sellerDocThumb').innerHTML = ic('file', 22);
  $('year').textContent = new Date().getFullYear();

  document.querySelectorAll('[data-icon]').forEach((node) => { node.innerHTML = ic(node.dataset.icon, Number(node.dataset.iconSize) || 18); });
  document.querySelectorAll('[data-seller-icon]').forEach((node) => { node.innerHTML = ic(node.dataset.sellerIcon, 16); });
  document.querySelectorAll('[data-nav-icon]').forEach((node) => { node.innerHTML = ic(node.dataset.navIcon, node.dataset.navIcon === 'chat' ? 22 : 19); });
  document.querySelectorAll('.close-btn').forEach((b) => { b.innerHTML = ic('x', 16); });
}

