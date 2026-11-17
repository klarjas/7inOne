// 7inOne production frontend: Supabase Auth + authenticated server API.
const iconPaths={
 bag:'<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',plus:'<path d="M12 5v14M5 12h14"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',chev:'<path d="m7 10 5 5 5-5"/>',x:'<path d="m18 6-12 12M6 6l12 12"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',check:'<path d="m5 12 4 4L19 6"/>',chat:'<path d="M21 11.5a8.5 8.5 0 0 1-9 8.5 9.7 9.7 0 0 1-4-.8L3 21l1.8-4.5A8.2 8.2 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z"/>',tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1"/>',arrow:'<path d="M5 12h14m-7-7 7 7-7 7"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',car:'<path d="m5 17-1 2v2h2v-2h12v2h2v-2l-1-2"/><path d="m4 17 1.5-6h13L20 17M7 11l1.5-4h7L17 11M7 17h.01M17 17h.01"/>',home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1Z"/>',shirt:'<path d="m16 4 5 3-3 4-2-1v10H8V10l-2 1-3-4 5-3 2 2h4z"/>',sofa:'<path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M3 12a2 2 0 0 1 4 0v3h10v-3a2 2 0 0 1 4 0v5H3zM5 17v3m14-3v3"/>',user:'<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',mic:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10a7 7 0 0 0 14 0m-7 7v5m-4 0h8"/>',camera:'<path d="M14 5 12.5 3h-5L6 5H3v14h18V5z"/><circle cx="12" cy="12" r="3.5"/>',image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',star:'<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',store:'<path d="M3 10h18l-1 11H4L3 10Z"/><path d="m3 10 2-7h14l2 7M8 10v3m8-3v3"/>',wallet:'<path d="M4 6h15a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"/><path d="M21 11h-5a2 2 0 0 0 0 4h5"/>',file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',trash:'<path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6m4 4v7m6-7v7"/>',edit:'<path d="m16 4 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z"/>',checkcircle:'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',logout:'<path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',spark:'<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2Z"/>',bookmark:'<path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4z"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',chart:'<path d="M3 3v18h18M8 15l4-4 3 3 6-7"/>',briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18m-11 0v2h4v-2"/>'
};
Object.assign(iconPaths,{calendar:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',refresh:'<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',package:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5"/>',truck:'<path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z"/><circle cx="7.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',play:'<path d="m8 5 11 7-11 7z"/>',pause:'<path d="M8 5h3v14H8zM15 5h3v14h-3z"/>',volume:'<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13"/>',volumeOff:'<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6m0-6-5 6"/>',lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>',external:'<path d="M14 4h6v6m0-6-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>'});
const $=id=>document.getElementById(id);
const ic=(name,size=17,extra='')=>`<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="${extra}">${iconPaths[name]||iconPaths.spark}</svg>`;
document.querySelectorAll('[data-seller-icon]').forEach(node=>{node.innerHTML=ic(node.dataset.sellerIcon,16)});
document.querySelectorAll('[data-nav-icon]').forEach(node=>{
  const name=node.dataset.navIcon;
  node.innerHTML=ic(name, name==='chat'?22:19);
});

if($('addProductIcon'))$('addProductIcon').innerHTML=ic('plus',15);
const CAT={phones:'ទូរស័ព្ទ & អេឡិចត្រូនិក',vehicles:'រថយន្ត & ម៉ូតូ',property:'អចលនទ្រព្យ',fashion:'សម្លៀកបំពាក់',furniture:'គ្រឿងសង្ហារិម'};
const CATICON={all:'grid',phones:'phone',vehicles:'car',property:'home',fashion:'shirt',furniture:'sofa'};
let currentStoreId=null,currentStoreData=null,currentStoreProducts=[],currentStoreCategory='all',currentStoreSearch='';
let productGalleryIndex=0,productLightboxOpen=false,scrollSaveTimer=null,routeSyncGuardKey='',routeSyncGuardTimer=null,routeSyncNavigationId=0;
let sellerProductCache=[],sellerActiveFilter='all',sellerActiveTab='products';
let siteBranding={siteTitle:'7inOne',siteSubtitle:'ផ្សារទិញលក់កម្ពុជា',heroBadge:'ផ្សារអនឡាញសម្រាប់អ្នកទាំងអស់គ្នា',heroTitle:'ទិញលក់ងាយៗ នៅជិតអ្នក',heroSubtitle:'ស្វែងរកទំនិញដែលអ្នកស្រឡាញ់ ឬដាក់លក់របស់ដែលអ្នកមិនប្រើ។ ភ្ជាប់អ្នកទិញ និងអ្នកលក់នៅទូទាំងប្រទេសកម្ពុជា។',siteLogoUrl:'',faviconUrl:'',heroImages:[]},brandingLogoPreviewUrl=null,brandingFaviconPreviewUrl=null,brandingHeroPreviewUrls=[],siteBrandingRefreshTimer=null;
let supabaseClient=null,session=null,sessionRefreshPromise=null,me=null,routeAccessReady=false,supportChatPollTimer=null,adminChatPollTimer=null,activeAdminChatId=null,restoredUserChatArchives={},restoredAdminChatArchives={},pendingPhone=null,products=[],savedIds=new Set(),favoritePending=new Set(),activeCategory='all',searchTerm='',currentProduct=null,currentVendor=null,profileTab='saved',authMode='login',currentOfferProduct=null,selectedProductImages=[],sellerDocPreviewUrl=null,telegramBotUsername='',telegramLoginWidgetMounted=false,telegramProfileWidgetMounted=false,productRealtimeChannel=null,productRealtimeRefreshTimer=null,productRealtimeFallbackTimer=null,productRealtimePendingRefresh=false,sellerChatChannel=null,sellerChatPollTimer=null,sellerInboxPollTimer=null,sellerChatConversationId=null,sellerChatInboxPollTimer=null,sellerChatMode='buyer',sellerChatInbox=[],sellerChatMuted=false,sellerChatLastMessageId=null,sellerChatInboxUnreadSnapshot={},sellerChatInboxInitialized=false,sellerChatInboxUserId=null,sellerChatLoadedMessages=[],sellerChatPendingMedia=[],sellerChatDraftProduct=null;
const DEFAULT_MAINTENANCE_MESSAGE='ប្រព័ន្ធកំពុងធ្វើការអភិវឌ្ឍន៍ និងបន្ថែមមុខងារថ្មីៗ សូមអធ្យាស្រ័យចំពោះការរំខាន!';let maintenanceMode=false,maintenanceMessage=DEFAULT_MAINTENANCE_MESSAGE,faviconUrl='';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>'$'+Number(v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2});
const fmtDate=v=>v?new Date(v).toLocaleDateString('km-KH',{year:'numeric',month:'short',day:'numeric'}):'—';
const verifiedBadge=()=>`<span class="verified">${ic('check',11)} អ្នកលក់បានផ្ទៀងផ្ទាត់</span>`;
function toast(message,type='success'){const area=$('toastArea');area.innerHTML='';const el=document.createElement('div');el.className='toast pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 text-[11px] font-semibold shadow-xl '+(type==='error'?'border-rose-200 bg-rose-50 text-rose-700':type==='warning'?'border-amber-200 bg-amber-50 text-amber-800':'border-slate-800 bg-slate-900 text-white');el.innerHTML=`<span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/10">${ic(type==='error'?'x':'check',15)}</span><span class="flex-1">${esc(message)}</span><button aria-label="បិទ">${ic('x',14)}</button>`;el.querySelector('button').onclick=()=>el.remove();area.appendChild(el);setTimeout(()=>el.remove(),3000)}
function openModal(id){closeDropdowns();$(id).classList.add('open');$(id).setAttribute('aria-hidden','false');if(id!=='sellerChatModal')document.body.classList.add('overflow-hidden');if(id==='sellerChatModal')$('supportChatLauncher')?.classList.remove('hidden')}
function closeModal(id){const el=$(id);if(!el)return;el.classList.remove('open');el.setAttribute('aria-hidden','true');if(!document.querySelector('.modal.open'))document.body.classList.remove('overflow-hidden')}
function closeDropdowns(){document.querySelectorAll('.dropdown').forEach(x=>x.classList.remove('open'))}
function toggleDrop(id){const el=$(id),open=el.classList.contains('open');closeDropdowns();if(!open)el.classList.add('open')}
function showView(name,options={}){
  const allowed=['home','profile','seller','admin','product','store'];
  if(!allowed.includes(name))name='home';
  if(!options.optimistic){
    if(['profile','seller'].includes(name)&&!session){openAuth();return Promise.resolve(false)}
    if(name==='admin'&&!me?.isAdmin){if(options.fromHistory){name='home'}else{toast('មុខងារនេះសម្រាប់ Admin ប៉ុណ្ណោះ។','error');return Promise.resolve(false)}}
    if(name==='seller'&&me?.vendor?.status!=='approved'){if(options.fromHistory){name='home'}else{toast(me?.vendor?.status==='pending'?'ពាក្យអ្នកលក់កំពុងរង់ចាំការអនុម័ត។':'សូមចុះឈ្មោះក្លាយជាអ្នកលក់ជាមុនសិន។','warning');if(!me?.vendor)openSellerModal();return Promise.resolve(false)}}
  }
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  $('view-'+name)?.classList.add('active');document.querySelectorAll('#mobileMarketNav [data-view]').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===name));
  document.documentElement.dataset.initialView=name;
  try{sessionStorage.setItem('ecomstore.activeView',name)}catch(error){console.warn('Could not save active page:',error)}
  const routeHash=name==='product'?(currentProduct?.id?'product/'+encodeURIComponent(currentProduct.id):(options.optimistic?String(window.location.hash||'#product').replace(/^#/,''):'product')):name==='store'?(currentStoreId?'store/'+encodeURIComponent(currentStoreId):(options.optimistic?String(window.location.hash||'#store').replace(/^#/,''):'store')):name;
  try{sessionStorage.setItem('ecomstore.activeView',name);if(name==='product'&&currentProduct?.id)sessionStorage.setItem('ecomstore.currentProductId',String(currentProduct.id));if(name==='store'&&currentStoreId)sessionStorage.setItem('ecomstore.currentStoreId',String(currentStoreId))}catch(error){console.warn('Could not save route state:',error)}
  if(window.location.hash!=='#'+routeHash){try{window.location.hash='#'+routeHash}catch(error){console.warn('Could not update route hash:',error)}}
  closeDropdowns();
  if(!options.preserveScroll)window.scrollTo({top:0,behavior:'smooth'});
  const tasks=[];
  if(!options.deferLoad){
    if(name==='profile')tasks.push(renderProfile());
    if(name==='seller')tasks.push(renderSeller());
    if(name==='admin'){tasks.push(renderAdmin());tasks.push(loadSupportAdminChats())}
    // Detail and storefront views must render their fetched data after activation.
    if(name==='product')tasks.push(Promise.resolve().then(()=>renderProductDetail()));
    if(name==='store')tasks.push(Promise.resolve().then(()=>renderStorefront()));
  }
  return Promise.all(tasks.map(task=>Promise.resolve(task))).then(()=>true);
}
function isAdmin(){return Boolean(me?.isAdmin)}
function applyMaintenanceUI(){const adminPreview=maintenanceMode&&isAdmin(),blocked=maintenanceMode&&!isAdmin();document.body.classList.toggle('maintenance-active',blocked);$('maintenanceOverlay').classList.toggle('hidden',!blocked);$('maintenanceOverlay').setAttribute('aria-hidden',String(!blocked));$('maintenanceOverlayMessage').textContent=maintenanceMessage;$('maintenanceAdminPill').classList.toggle('hidden',!adminPreview);document.body.classList.add('maintenance-ready')}
function applyFavicon(url){
  if(!url)return;
  faviconUrl=url;
  let link=document.querySelector('link[data-site-favicon]');
  if(!link){link=document.createElement('link');link.rel='icon';link.dataset.siteFavicon='true';document.head.appendChild(link)}
  link.href=url;link.removeAttribute('type');
}
function avatarFallbackMarkup(name=''){
  const initial=Array.from(String(name||'').trim())[0]||'7';
  return '<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="emeraldAvatarGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#064E3B"/><stop offset="1" stop-color="#10B981"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="url(#emeraldAvatarGradient)"/><circle cx="50" cy="36" r="17" fill="#D1FAE5"/><path d="M16 94c3-21 16-32 34-32s31 11 34 32" fill="#A7F3D0"/><text x="50" y="91" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#FFFFFF">'+esc(initial)+'</text></svg>';
}
function avatarMarkup(name,url){
  const label=esc(name||'អ្នកលក់');
  if(!url)return '<div class="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-emerald-50">'+avatarFallbackMarkup(name)+'</div>';
  return '<div class="img-scan-wrap shimmer-scan h-11 w-11 shrink-0 overflow-hidden rounded-full bg-emerald-50" data-vendor-avatar="'+label+'"><img src="'+esc(url)+'" alt="'+label+'" class="vendor-avatar-image h-full w-full object-cover" data-vendor-avatar-image></div>';
}
function setAvatar(target,url,name=''){
  if(!target)return;
  const fallback=()=>{target.classList.remove('shimmer-scan');target.classList.add('is-failed');target.innerHTML=avatarFallbackMarkup(name)};
  if(!url){fallback();return}
  target.classList.add('img-scan-wrap','shimmer-scan');target.classList.remove('is-loaded','is-failed');target.innerHTML='<img src="'+esc(url)+'" alt="" class="h-full w-full object-cover">';
  target.querySelector('img')?.addEventListener('error',fallback,{once:true});
}
function syncHomeHeroImagesFromProducts() {
  const configured = Array.isArray(siteBranding.heroImages) && siteBranding.heroImages.some(item => item?.url || item?.image_url || item?.imageUrl);
  if (configured) return;
  const candidates = products.filter(product => product.product_images?.some(image => image.image_url)).slice(0, 3);
  for (let i = 1; i <= 3; i++) {
    const target = $('heroImage' + i);
    const tile = target?.parentElement;
    const placeholder = tile?.querySelector('.hero-placeholder');
    const product = candidates[i - 1];
    const image = product?.product_images?.find(item => item.image_url);
    if (!target || !tile) continue;
    if (!image) {
      target.removeAttribute('src');
      target.classList.add('hidden');
      placeholder?.classList.remove('hidden');
      tile.classList.remove('has-image');
      continue;
    }
    target.alt = 'រូបភាពទំនិញ ' + String(product.title || '');
    target.onerror = () => {
      target.classList.add('hidden');
      placeholder?.classList.remove('hidden');
      tile.classList.remove('has-image');
    };
    target.src = image.image_url;
    target.classList.remove('hidden');
    placeholder?.classList.add('hidden');
    tile.classList.add('has-image');
  }
}
function applySiteBranding(data={}){
  siteBranding={...siteBranding,...data};
  const title=String(siteBranding.siteTitle||'7inOne');
  const subtitle=String(siteBranding.siteSubtitle||'ផ្សារទិញលក់កម្ពុជា');
  const logo=String(siteBranding.siteLogoUrl||'');
  const favicon=String(siteBranding.faviconUrl||'');
  document.title=title+' · '+subtitle;
  if($('siteTitle'))$('siteTitle').textContent=title;
  if($('siteSubtitle'))$('siteSubtitle').textContent=subtitle;
  if($('footerSiteTitle'))$('footerSiteTitle').textContent=title;
  if($('footerSiteSubtitle'))$('footerSiteSubtitle').textContent=subtitle;
  const mark=$('siteLogoMark');
  if(mark){
    if(logo)mark.innerHTML='<img src="'+esc(logo)+'" alt="" class="h-full w-full object-contain bg-white p-1">';
    else mark.innerHTML='<span id="logoIcon">'+ic('bag',22)+'</span>';
    mark.querySelector('img')?.addEventListener('error',()=>{mark.innerHTML='<span id="logoIcon">'+ic('bag',22)+'</span>'},{once:true});
  }
  const footerMark=$('footerLogoMark');
  if(footerMark){
    if(logo)footerMark.innerHTML='<img src="'+esc(logo)+'" alt="" class="h-full w-full object-contain rounded-lg bg-white p-1">';
    else footerMark.textContent='7';
  }
  if(favicon)applyFavicon(favicon);
  const textMap=[['heroBadge','heroBadge'],['heroTitle','heroTitle'],['heroSubtitle','heroSubtitle']];
  for(const [id,key] of textMap)if($(id))$(id).textContent=String(siteBranding[key]||'');
  const images=Array.isArray(siteBranding.heroImages)?siteBranding.heroImages.slice(0,3):[];
  for(let i=1;i<=3;i++){
    const target=$('heroImage'+i),item=images[i-1],url=item?.url||item?.image_url||item?.imageUrl||'';
    if(!target)continue;
    if(url){const scan=target.parentElement;scan?.classList.add('img-scan-wrap','shimmer-scan');scan?.classList.remove('is-loaded','is-failed');scan?.querySelector('.hero-placeholder')?.classList.add('hidden');target.src=url;target.classList.remove('hidden');target.onerror=()=>{scan?.classList.add('is-failed');target.classList.add('hidden');scan?.querySelector('.hero-placeholder')?.classList.remove('hidden')}}
    else{target.removeAttribute('src');target.classList.add('hidden');target.parentElement?.querySelector('.hero-placeholder')?.classList.remove('hidden')}
  }
}
async function refreshSiteBranding(){
  if(document.hidden)return;
  try{
    const response=await fetch('/api/config',{cache:'no-store'});
    if(!response.ok)throw new Error('Branding refresh failed: '+response.status);
    const config=await response.json();
    applySiteBranding(config);
  }catch(error){console.warn('Could not refresh site branding:',error.message)}
}
function brandingPreviewLogo(url){
  const target=$('brandLogoPreview');if(!target)return;
  target.innerHTML=url?'<img src="'+esc(url)+'" alt="" />':'<span>7</span>';
}
function brandingPreviewFavicon(url){
  const target=$('brandFaviconPreview');if(!target)return;
  target.innerHTML=url?'<img src="'+esc(url)+'" alt="" />':'<span>7</span>';
}
function renderBrandingAdmin(){
  if(!isAdmin())return;
  const b=siteBranding;
  $('brandTitleInput').value=b.siteTitle||'7inOne';
  $('brandSubtitleInput').value=b.siteSubtitle||'ផ្សារទិញលក់កម្ពុជា';
  $('heroBadgeInput').value=b.heroBadge||'';
  $('heroTitleInput').value=b.heroTitle||'';
  $('heroSubtitleInput').value=b.heroSubtitle||'';
  $('brandPreviewTitle').textContent=b.siteTitle||'7inOne';
  $('brandPreviewSubtitle').textContent=b.siteSubtitle||'';
  $('brandHeroPreviewBadge').textContent=b.heroBadge||'';
  $('brandHeroPreviewTitle').textContent=b.heroTitle||'';
  $('brandHeroPreviewSubtitle').textContent=b.heroSubtitle||'';
  brandingPreviewLogo(b.siteLogoUrl||'');
  brandingPreviewFavicon(b.faviconUrl||'');
  renderBrandingHeroPreviews();
  $('brandingStatus').textContent=b.siteLogoUrl?'Logo និង Brand បច្ចុប្បន្នបានផ្ទុកពី Database។':'កំពុងប្រើ Brand Logo លំនាំដើម។';
}
function renderBrandingHeroPreviews(){
  const target=$('heroBannerPreviews');if(!target)return;
  const selected=brandingHeroPreviewUrls.length?brandingHeroPreviewUrls:(siteBranding.heroImages||[]).map(x=>x.url||x.image_url||'').filter(Boolean);
  target.innerHTML=Array.from({length:3},(_,i)=>selected[i]
    ?'<img src="'+esc(selected[i])+'" alt="Banner preview '+(i+1)+'">'
    :'<div class="hero-admin-preview-empty">BENTO 0'+(i+1)+'</div>').join('');
}
function updateBrandingTextPreview(){
  $('brandPreviewTitle').textContent=$('brandTitleInput').value.trim()||'7inOne';
  $('brandPreviewSubtitle').textContent=$('brandSubtitleInput').value.trim()||'ផ្សារទិញលក់កម្ពុជា';
  $('brandHeroPreviewBadge').textContent=$('heroBadgeInput').value.trim();
  $('brandHeroPreviewTitle').textContent=$('heroTitleInput').value.trim();
  $('brandHeroPreviewSubtitle').textContent=$('heroSubtitleInput').value.trim();
}
function isVerifiedSeller(){return me?.vendor?.status==='approved'}
function profileName(){return me?.profile?.display_name||session?.user?.user_metadata?.display_name||session?.user?.email?.split('@')[0]||'គណនីអ្នកប្រើប្រាស់'}
function syncHeader(){
  const logged=Boolean(session),verified=isVerifiedSeller(),admin=isAdmin();
  $('supportChatLauncher')?.classList.toggle('hidden',!logged);
  $('navName').textContent=logged?profileName():'ភ្ញៀវ';
  $('menuUserName').textContent=logged?profileName():'សួស្តី!';
  $('menuUserStatus').textContent=admin?'អ្នកគ្រប់គ្រង':verified?'អ្នកលក់បានផ្ទៀងផ្ទាត់':me?.vendor?.status==='pending'?'កំពុងរង់ចាំការផ្ទៀងផ្ទាត់':logged?'អ្នកទិញ':'មិនទាន់ចូលគណនី';
  $('navRole').textContent=admin?'Admin':verified?'Seller':logged?'Buyer':'Guest';
  setAvatar($('navAvatar'),me?.profile?.avatar_url,profileName());
  $('postAdBtn').classList.toggle('hidden',!logged);
  $('mobilePostBtn').classList.toggle('hidden',!logged);
  $('profileMenu').querySelector('[data-action="seller-dashboard"]').classList.toggle('hidden',!verified);
  $('profileMenu').querySelector('[data-action="admin"]').classList.toggle('hidden',!admin);
  const accountAction=$('profileMenu').querySelector('[data-action="login"],[data-action="logout"]');
  if(accountAction){accountAction.textContent=logged?'ចាកចេញ':'ចូលគណនី';accountAction.dataset.action=logged?'logout':'login'}
  $('profileMenu').querySelector('[data-action="profile"]').classList.toggle('hidden',!logged);
  $('profileMenu').querySelector('[data-action="saved"]').classList.toggle('hidden',!logged);
}
async function api(path,options={}){
  const headers=new Headers(options.headers||{});
  if(session?.access_token)headers.set('Authorization','Bearer '+session.access_token);
  if(options.body&&!(options.body instanceof FormData)&&!headers.has('Content-Type'))headers.set('Content-Type','application/json');
  const requestOptions={...options,headers,cache:'no-store'};
  let response=await fetch(path,requestOptions);
  let payload={};
  try{payload=await response.json()}catch{}
  // A saved access token can expire between page load and the first authenticated request.
  // Refresh it once, share concurrent refreshes, then retry the original request once.
  if(response.status===401&&session?.refresh_token&&supabaseClient){
    try{
      if(!sessionRefreshPromise){
        sessionRefreshPromise=supabaseClient.auth.refreshSession()
          .then(({data,error})=>{
            if(error)throw error;
            if(!data.session?.access_token)throw new Error('Session refresh did not return a valid session.');
            session=data.session;
            return session;
          })
          .finally(()=>{sessionRefreshPromise=null});
      }
      const refreshed=await sessionRefreshPromise;
      headers.set('Authorization','Bearer '+refreshed.access_token);
      response=await fetch(path,requestOptions);
      payload={};
      try{payload=await response.json()}catch{}
    }catch(refreshError){
      console.warn('Session refresh after API 401 failed:',refreshError.message);
    }
  }
  if(!response.ok)throw new Error(payload.error||`សំណើមិនជោគជ័យ (${response.status})`);
  return payload;
}
async function loadIdentity(){if(!session){me=null;return}try{const res=await api('/api/me');me=res.data}catch(error){me=null;throw error}}
async function refreshSession(){if(!supabaseClient)return;const {data,error}=await supabaseClient.auth.getSession();if(error)throw error;session=data.session;if(session)await loadIdentity();else me=null;syncHeader();applyMaintenanceUI()}
function requireLogin(){if(session)return true;openAuth();return false}
function openAuth(mode='login'){setAuthMode(mode);openModal('authModal');if(!telegramLoginWidgetMounted)telegramLoginWidgetMounted=mountTelegramWidget('telegramLoginWidget','onTelegramAuth')}
function setAuthMode(mode){$('telegramLoginWidgetWrap')?.classList.toggle('hidden',mode==='verifyPhone');$('telegramRecoveryForm')?.classList.add('hidden');$('authForm')?.classList.remove('hidden');$('forgotPasswordBtn')?.classList.remove('hidden');document.querySelector('#authModal .mb-4.grid')?.classList.remove('hidden');authMode=mode;const register=mode==='register',verify=mode==='verifyPhone';$('authOtp').required=verify;$('authOtpWrap').classList.toggle('hidden',!verify);$('authNameWrap').classList.toggle('hidden',!register);$('authName').required=register;$('authIdentity').readOnly=verify;$('authIdentity').parentElement.classList.remove('hidden');$('authPassword').parentElement.classList.toggle('hidden',verify);document.querySelector('[data-auth-mode="login"]').parentElement.classList.toggle('hidden',verify);$('authTitle').textContent=verify?'ផ្ទៀងផ្ទាត់លេខទូរស័ព្ទ':register?'បង្កើតគណនី 7inOne':'សូមស្វាគមន៍មកកាន់ 7inOne';$('authSubmit').textContent=verify?'ផ្ទៀងផ្ទាត់លេខកូដ':register?'បង្កើតគណនី':'ចូលគណនី';$('authHint').textContent=verify?'សូមបញ្ចូលលេខកូដ SMS ដែលបានផ្ញើទៅលេខទូរស័ព្ទរបស់អ្នក។':'ប្រើលេខទូរស័ព្ទ ឬអ៊ីមែលដែលភ្ជាប់ជាមួយគណនី Supabase របស់អ្នក។';if(!verify)$('authOtp').value='';document.querySelectorAll('[data-auth-mode]').forEach(b=>{const active=b.dataset.authMode===mode;b.classList.toggle('bg-white',active);b.classList.toggle('shadow',active);b.classList.toggle('text-slate-500',!active)})}
async function loadProducts(){const grid=$('productGrid');grid.setAttribute('aria-busy','true');grid.classList.add('hidden');$('emptyHome').classList.add('hidden');$('skeletonGrid').classList.remove('hidden');const params=new URLSearchParams({page:'1',limit:'50'});if(searchTerm)params.set('q',searchTerm);if(activeCategory!=='all')params.set('category',activeCategory);try{const res=await api('/api/products?'+params.toString());products=res.data||[];renderProducts();syncHomeHeroImagesFromProducts();}catch(error){products=[];renderProducts();toast('មិនអាចទាញយកទំនិញបានទេ៖ '+error.message,'error')}finally{$('skeletonGrid').classList.add('hidden');grid.classList.remove('hidden');grid.setAttribute('aria-busy','false')}}
function productImage(p){return p.product_images?.find(x=>x.image_url)?.image_url||''}
function timeAgoKm(dateStr) {
  if (!dateStr) return 'ថ្មីៗ';
  const timestamp = new Date(dateStr).getTime();
  if (!Number.isFinite(timestamp)) return 'ថ្មីៗ';
  const diff = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
  if (diff < 60) return `${diff} នាទីមុន`;
  const hrs = Math.floor(diff / 60);
  if (hrs < 24) return `${hrs} ម៉ោងមុន`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} ថ្ងៃមុន`;
  return `${Math.floor(days / 7)} សប្តាហ៍មុន`;
}
function formatViews(value) {
  const num = Number(value || 0);
  return num >= 1000 ? (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : String(num);
}
const verifiedStoreSvg = `<svg class="vb" width="16" height="16" viewBox="0 0 24 24" role="img" aria-label="ហាងបានផ្ទៀងផ្ទាត់"><g fill="#1D8CD0"><rect x="4.5" y="4.5" width="15" height="15" rx="4"></rect><rect x="4.5" y="4.5" width="15" height="15" rx="4" transform="rotate(45 12 12)"></rect></g><path d="M8.2 12.4l2.6 2.6 5-5.4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
function productCard(p, index) {
  const images = (p.product_images || []).filter(item => item.image_url);
  const image = images[0]?.image_url || '';
  const secondImage = images[1]?.image_url || '';
  const saved = savedIds.has(p.id);
  const vendorName = p.vendors?.store_name || 'ហាងអ្នកលក់';
  const verified = p.vendors?.status === 'approved';
  const description = productDescriptionParts(p).short;
  return `
  <article class="cd" style="animation-delay:${Math.min(index, 12) * 35}ms">
    <div class="ph im">
      <button class="absolute inset-0 z-[1] h-full w-full" type="button" data-action="view" data-id="${esc(p.id)}" aria-label="មើល ${esc(p.title)}"></button>
      ${image
        ? `<span class="img-scan-wrap shimmer-scan cd-image-wrap cd-main-wrap"><img src="${esc(image)}" alt="${esc(p.title)}" loading="lazy" decoding="async" class="cd-main h-full w-full object-cover"></span>${secondImage ? `<span class="img-scan-wrap shimmer-scan cd-image-wrap cd-secondary-wrap"><img src="${esc(secondImage)}" alt="" loading="lazy" decoding="async" class="cd-secondary h-full w-full object-cover"></span>` : ''}`
        : ic('image', 36)}
      <span class="cd-condition">${esc(p.condition || 'ទំនិញ')}</span>
      <span class="cd-image-count">${images.length || 0} រូប</span>
      <button class="hv heart ${saved ? 'saved' : ''}" type="button" data-action="save" data-id="${esc(p.id)}" aria-label="រក្សាទុក" aria-pressed="${saved ? 'true' : 'false'}" aria-busy="false">
        ${ic('heart', 18)}
      </button>
    </div>
    <div class="cb">
      <h3 class="cursor-pointer truncate hover:text-[#064E3B]" data-action="view" data-id="${esc(p.id)}">${esc(p.title)}</h3>
      <p class="pr">${money(p.price)}</p>
      ${description ? `<p class="cd-description">${esc(description)}</p>` : ''}
      <div class="sh">
        <span class="sp" role="img" aria-label="រូប Profile ហាង">${ic('user', 16)}</span>
        <button type="button" class="sn text-left hover:underline" data-action="store" data-vendor-id="${esc(p.vendor_id)}">${esc(vendorName)}</button>
        ${verified ? verifiedStoreSvg : ''}
      </div>
      <p class="mt">
        <span>${esc(p.location || 'ភ្នំពេញ')}</span>
        <span>${timeAgoKm(p.created_at)}</span>
        <span class="vw" title="ចំនួនអ្នកមើល">${ic('eye', 14)}${formatViews(p.view_count)}</span>
      </p>
    </div>
  </article>`;
}
function renderProducts(){const list=products;$('productGrid').innerHTML=list.map(productCard).join('');$('resultCount').textContent=`${list.length} មុខ`;$('listingTitle').textContent=activeCategory==='all'?'ទំនិញដែលគួរឱ្យចាប់អារម្មណ៍':CAT[activeCategory]||'ទំនិញ';$('listingSub').textContent=searchTerm?`លទ្ធផលស្វែងរកសម្រាប់ «${esc(searchTerm)}»`:'ទំនិញពិតពីហាងដែលបានចុះឈ្មោះនៅលើ 7inOne';$('emptyHome').classList.toggle('hidden',list.length>0);$('productGrid').classList.toggle('hidden',list.length===0);$('skeletonGrid').classList.add('hidden')}
function setCategory(category){activeCategory=category;$('searchCategory').value=category;document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('active',b.dataset.category===category));void loadProducts()}
function favoriteSpinner(){
  return '<svg class="animate-spin text-indigo-500" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity=".2"></circle><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path></svg>';
}
function setFavoriteHeart(button,saved,stage='idle'){
  if(!button)return;
  button.classList.toggle('saved',saved);
  button.classList.toggle('text-blue-600',saved);
  button.classList.toggle('fill-blue-600',saved);
  button.classList.toggle('text-slate-500',!saved);
  button.classList.remove('text-emerald-500');
  button.setAttribute('aria-pressed',String(saved));
  button.setAttribute('aria-busy',stage==='loading'||stage==='done'?'true':'false');
  button.setAttribute('aria-label',saved?'ដកចេញពីបញ្ជីដែលបានរក្សាទុក':'រក្សាទុកទំនិញ');
  if(stage==='loading'){
    button.innerHTML=favoriteSpinner();
  }else if(stage==='done'){
    button.innerHTML='<span class="favorite-check-pop text-emerald-500 text-base font-bold leading-none" aria-label="Done">✓</span>';
  }else{
    button.innerHTML=ic('heart',16);
  }
}
function setDetailFavoriteButton(button,saved){
  if(!button)return;
  button.disabled=false;
  if(button.classList.contains('product-save-action')){
    button.innerHTML=ic('heart',18);
    button.title=saved?'ដកចេញពីបញ្ជីដែលបានរក្សាទុក':'រក្សាទុកទំនិញ';
    button.setAttribute('aria-label',button.title);
    button.classList.toggle('is-saved',saved);
  }else{
    button.innerHTML=ic('heart',14,'inline')+' '+(saved?'បានរក្សាទុក':'រក្សាទុក');
    button.classList.toggle('text-blue-600',saved);
    button.classList.toggle('text-indigo-700',!saved);
  }
  button.setAttribute('aria-pressed',String(saved));
}
function saveAction(productId,button=null){
  if(!requireLogin())return;
  const id=String(productId);
  if(favoritePending.has(id))return;
  const saved=savedIds.has(id);
  const isHeart=!!button?.classList.contains('heart');
  favoritePending.add(id);

  // Removing a favorite is intentionally immediate: no spinner or toast.
  if(saved){
    savedIds.delete(id);
    if(isHeart)setFavoriteHeart(button,false);
    else if(button?.dataset.productAction==='save')setDetailFavoriteButton(button,false);
    void api('/api/saved/'+encodeURIComponent(id),{method:'DELETE'}).then(()=>{
      if(button?.hasAttribute('data-remove-saved')){
        const card=button.closest('[data-saved-card]');
        card?.remove();
        const remaining=$('profileTabContent')?.querySelectorAll('[data-saved-card]').length||0;
        $('profileActivityCount').textContent=remaining+' មុខ';
        if(!remaining)$('profileTabContent').innerHTML='<div class="py-10 text-center text-[11px] text-slate-400">អ្នកមិនទាន់រក្សាទុកទំនិញណាមួយទេ។</div>';
      }
    }).catch(error=>{
      savedIds.add(id);
      if(isHeart&&button?.isConnected)setFavoriteHeart(button,true);
      else if(button?.dataset.productAction==='save'&&button.isConnected)setDetailFavoriteButton(button,true);
      console.warn('Could not remove saved product:',error);
    }).finally(()=>favoritePending.delete(id));
    return;
  }

  const startedAt=performance.now();
  let checkTimer=null;
  if(isHeart){
    setFavoriteHeart(button,false,'loading');
    // Step 2 starts at 350ms even if the network request is still pending.
    checkTimer=window.setTimeout(()=>{
      if(button.isConnected&&favoritePending.has(id))setFavoriteHeart(button,false,'done');
    },350);
  }else if(button?.dataset.productAction==='save'){
    button.disabled=true;
    button.innerHTML=favoriteSpinner()+' កំពុងរក្សាទុក';
  }

  void api('/api/saved/'+encodeURIComponent(id),{method:'POST'}).then(()=>{
    savedIds.add(id);
    const remaining=Math.max(0,950-(performance.now()-startedAt));
    window.setTimeout(()=>{
      if(isHeart&&button?.isConnected)setFavoriteHeart(button,true);
      else if(button?.dataset.productAction==='save'&&button.isConnected)setDetailFavoriteButton(button,true);
      favoritePending.delete(id);
    },remaining);
  }).catch(error=>{
    if(checkTimer)window.clearTimeout(checkTimer);
    savedIds.delete(id);
    if(isHeart&&button?.isConnected)setFavoriteHeart(button,false);
    else if(button?.dataset.productAction==='save'&&button.isConnected)setDetailFavoriteButton(button,false);
    favoritePending.delete(id);
    // No toast on favorite actions; keep the failure silent in the UI.
    console.warn('Could not save product:',error);
  });
}
function renderStars(value,size=15){return `<span class="inline-flex items-center gap-0.5 text-amber-500">${[1,2,3,4,5].map(n=>`<span class="${n<=Math.round(Number(value||0))?'':'text-slate-200'}">★</span>`).join('')}</span>`}
function isRouteSyncRequestCurrent(options={}){return options.routeSyncNavigationId==null||options.routeSyncNavigationId===routeSyncNavigationId}
async function openProduct(id,options={}){
 if(!id){toast('មិនមានលេខសម្គាល់ទំនិញទេ។','warning');return false}
 const productId=String(id);
 const isCurrent=()=>isRouteSyncRequestCurrent(options);
 try{
  if(session){try{await loadOrders()}catch(error){console.warn('Could not refresh review eligibility:',error)}}
  if(!isCurrent())return false;
  try{sessionStorage.setItem('ecomstore.currentProductId',productId);sessionStorage.setItem('ecomstore.activeView','product')}catch{}
  $('productDetail').setAttribute('aria-busy','true');
  $('productDetail').innerHTML='<div class="product-detail-skeleton"><div class="skeleton product-detail-skeleton-image"></div><div class="product-detail-skeleton-copy"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div></div>';
  const result=await api('/api/products/'+encodeURIComponent(productId));
  if(!isCurrent())return false;
  const product=result.data;if(!product)throw new Error('មិនមានព័ត៌មានទំនិញនេះទេ។');
  const trust=await api('/api/vendors/'+encodeURIComponent(product.vendor_id)+'/ratings');
  if(!isCurrent())return false;
  currentProduct=product;currentVendor=trust.data;productGalleryIndex=0;
  await showView('product',{preserveScroll:Boolean(options.preserveScroll)});
  if(!isCurrent())return false;
  $('productDetail').removeAttribute('aria-busy');$('productDetail').classList.remove('detail-loaded');requestAnimationFrame(()=> $('productDetail')?.classList.add('detail-loaded'));return true;
 }catch(error){
  if(!isCurrent())return false;
  const target=$('productDetail');if(target){target.removeAttribute('aria-busy');target.innerHTML='<div class="route-load-error"><span>'+ic('alert',24)+'</span><b>មិនអាចទាញយកទំនិញនេះបានទេ</b><p>'+esc(error.message||'សូមព្យាយាមម្ដងទៀត។')+'</p><button type="button" class="brand-gradient" onclick="location.reload()">ព្យាយាមម្ដងទៀត</button></div>'}toast(error.message,'error');return false
 } 
}

function renderProductDetail(){
 const p=currentProduct,v=currentVendor;if(!p||!v)return;
 const descriptions=productDescriptionParts(p),shortDescription=descriptions.short,fullDescription=descriptions.full;
 const images=(p.product_images||[]).filter(i=>i.image_url),activeImage=images[productGalleryIndex]||images[0];
 const canReview=(window.myOrders||[]).filter(o=>o.status==='completed'&&(o.order_items||[]).some(i=>i.vendor_id===p.vendor_id&&i.fulfillment_status==='completed'));
 const related=products.filter(item=>String(item.id)!==String(p.id)&&(item.category===p.category||String(item.vendor_id)===String(p.vendor_id))).slice(0,5);
 const saved=savedIds.has(p.id),stockKnown=p.stock!==undefined&&p.stock!==null,stockLabel=stockKnown?(Number(p.stock)>0?'មានទំនិញ':'អស់ពីស្តុក'):'អាចសាកសួរបាន';
 const gallery=images.length
  ?'<div class="product-gallery-stage img-scan-wrap shimmer-scan"><img class="product-main-image" id="productMainImage" src="'+esc(activeImage.image_url)+'" alt="'+esc(p.title)+'" data-gallery-zoom><span class="product-gallery-condition">'+esc(p.condition||'មិនបានបញ្ជាក់')+'</span><button type="button" class="product-gallery-save" data-product-action="save" aria-label="រក្សាទុកទំនិញ" aria-pressed="'+(saved?'true':'false')+'">'+ic('heart',19)+'</button>'+(images.length>1?'<button type="button" class="product-gallery-arrow prev" data-gallery-step="-1" aria-label="រូបមុន">'+ic('arrow',18)+'</button><button type="button" class="product-gallery-arrow next" data-gallery-step="1" aria-label="រូបបន្ទាប់">'+ic('arrow',18)+'</button>':'')+'<span class="product-gallery-counter">'+(productGalleryIndex+1)+' / '+images.length+'</span></div><div class="product-gallery-thumbs" id="productGalleryThumbs">'+images.map((im,i)=>'<button type="button" class="product-gallery-thumb img-scan-wrap shimmer-scan '+(i===productGalleryIndex?'active':'')+'" data-image="'+i+'" aria-label="រូបទី '+(i+1)+'"><img src="'+esc(im.image_url)+'" alt=""></button>').join('')+'</div>'
  :'<div class="product-gallery-stage product-gallery-empty">'+ic('image',56)+'</div>';
 const reviewItems=(v.reviews||[]).slice(0,5),reviewTotal=Number(v.review_count||reviewItems.length||0),average=Number(v.rating||0);
 const reviewBars=[5,4,3,2,1].map(n=>{const count=reviewItems.filter(r=>Number(r.rating)===n).length;const percent=reviewItems.length?Math.round(count/reviewItems.length*100):0;return '<div class="product-rating-row"><span>'+n+'</span>'+ic('star',13)+'<div class="product-rating-track"><span style="width:'+percent+'%"></span></div><small>'+count+'</small></div>'}).join('');
 const starIcon=(n,score)=>'<span class="product-star '+(n<=Math.round(score)?'is-filled':'')+'">'+ic('star',15)+'</span>';
 const ratingStars=Array.from({length:5},(_,i)=>starIcon(i+1,average)).join('');
 $('productDetail').innerHTML=`<div class="product-detail-page">
  <section class="product-hero-card">
   <div class="product-hero-grid product-detail-layout-top">
    <div class="product-gallery-column product-detail-gallery" aria-label="រូបភាពទំនិញ">${gallery}</div>
    <div class="product-buybox product-detail-info">
     <div class="product-top-meta"><span class="product-category-badge">${esc(CAT[p.category]||p.category||'ទំនិញ')}</span><span class="product-meta-item">${ic('clock',14)} ${fmtDate(p.created_at)}</span><span class="product-meta-item">${ic('eye',14)} ${Number(p.view_count||0).toLocaleString()} Views</span></div>
     <h1 class="product-detail-title">${esc(p.title)}</h1>
     <div class="product-price-card"><div><small>តម្លៃលក់</small><strong>${money(p.price)}</strong></div><div class="product-price-context"><span>${ic('pin',15)} ${esc(p.location||'មិនបានបញ្ជាក់')}</span><span class="product-stock-badge ${stockKnown&&Number(p.stock)<=0?'is-out':''}">${ic(stockKnown&&Number(p.stock)<=0?'x':'checkcircle',14)} ${stockLabel}</span></div></div>
     ${shortDescription?'<div class="product-short-summary"><p>'+esc(shortDescription)+'</p></div>':''}
     <div class="product-action-area product-detail-actions">
      <div class="product-primary-actions"><button type="button" class="product-buy-primary brand-gradient" data-product-action="buy">${ic('bag',18)} ទិញឥឡូវនេះ</button><button type="button" class="product-chat-primary" data-product-action="chat">${ic('chat',18)} ឆាតជាមួយអ្នកលក់</button></div>
      <div class="product-utility-actions"><button type="button" data-product-action="offer">${ic('tag',16)} តថ្លៃទំនិញ</button><button type="button" data-product-action="save" aria-pressed="${saved?'true':'false'}">${ic('heart',16)} ${saved?'បានរក្សាទុក':'រក្សាទុក'}</button></div>
     </div>
     <section class="product-seller-card product-detail-seller">
      <div class="product-seller-heading"><div class="product-seller-avatar">${avatarMarkup(v.store_name,v.profile?.avatar_url)}</div><div class="product-seller-identity"><b>${esc(v.store_name||'ហាងអ្នកលក់')}</b><span class="product-seller-verified">${v.status==='approved'?ic('checkcircle',13)+' អ្នកលក់បានផ្ទៀងផ្ទាត់':'អ្នកលក់'}</span><span class="product-seller-rating">${ratingStars}<strong>${average?average.toFixed(1):'—'}</strong><small>(${reviewTotal})</small></span></div><button type="button" class="product-store-button" data-product-action="store">${ic('store',16)} មើលហាង</button></div>
      <div class="product-seller-metrics"><div><b>${Number(v.active_listings||0)}</b><small>ទំនិញលក់</small></div><div><b>${Number(v.total_views||0).toLocaleString()}</b><small>អ្នកមើល</small></div><div><b>${reviewTotal}</b><small>ការវាយតម្លៃ</small></div></div>
     </section>
    </div>
   </div>
  </section>
  <section class="product-details-grid">
   <article class="product-description-card product-detail-description"><h2>${ic('file',18)} ព័ត៌មានលម្អិតអំពីទំនិញ</h2><p class="product-full-description">${esc(fullDescription||shortDescription||'មិនទាន់មានការពិពណ៌នាលម្អិតទេ។')}</p><div class="product-spec-grid"><div><small>ប្រភេទ</small><b>${esc(CAT[p.category]||p.category||'មិនបានបញ្ជាក់')}</b></div><div><small>ស្ថានភាព</small><b>${esc(p.condition||'មិនបានបញ្ជាក់')}</b></div><div><small>ទីតាំង</small><b>${ic('pin',13)} ${esc(p.location||'មិនបានបញ្ជាក់')}</b></div><div><small>កាលបរិច្ឆេទបង្ហោះ</small><b>${fmtDate(p.created_at)}</b></div></div></article>
   <aside class="product-safety-note product-detail-safety"><h2>${ic('shield',19)} ការណែនាំសុវត្ថិភាពអ្នកទិញ</h2><ul><li>${ic('checkcircle',16)}<span>ពិនិត្យទំនិញដោយផ្ទាល់ មុនពេលទូទាត់ប្រាក់</span></li><li>${ic('checkcircle',16)}<span>ស្នើសុំរូបភាព ឬព័ត៌មានបន្ថែម ប្រសិនបើមិនច្បាស់</span></li><li>${ic('checkcircle',16)}<span>កុំផ្ញើប្រាក់ទៅគណនីដែលមិនអាចផ្ទៀងផ្ទាត់បាន</span></li><li>${ic('checkcircle',16)}<span>ជួបអ្នកលក់នៅទីតាំងសាធារណៈ និងមានសុវត្ថិភាព</span></li><li>${ic('checkcircle',16)}<span>ប្រើប្រព័ន្ធរាយការណ៍ ប្រសិនបើជួបសកម្មភាពគួរឱ្យសង្ស័យ</span></li></ul></aside>
  </section>
  <section class="product-reviews product-reviews-full"><div class="product-section-heading"><div><h2>${ic('star',19)} ការវាយតម្លៃពីអ្នកទិញ</h2><p>មតិយោបល់ពីអតិថិជនដែលបានទិញទំនិញ</p></div><span>${reviewTotal} Reviews</span></div>
   <div class="product-reviews-layout"><div class="product-rating-summary"><strong>${average?average.toFixed(1):'—'}</strong><div class="product-rating-stars">${ratingStars}</div><small>ផ្អែកលើការវាយតម្លៃ ${reviewTotal} នាក់</small><div class="product-rating-bars">${reviewBars}</div></div>
    <div class="product-review-content"><div class="product-review-list">${reviewItems.map(r=>'<article class="product-review"><div class="product-review-heading"><b>'+esc(r.buyer_name||'អ្នកទិញ')+'</b><span>'+Array.from({length:5},(_,i)=>starIcon(i+1,Number(r.rating||0))).join('')+'</span></div><p>'+esc(r.comment||'')+'</p><small>'+fmtDate(r.created_at)+'</small></article>').join('')||'<p class="product-empty-note">មិនទាន់មានការវាយតម្លៃទេ។</p>'}</div>
     ${canReview.length?`<form id="reviewForm" class="product-review-form"><h3>ចែករំលែកបទពិសោធន៍របស់អ្នក</h3><div class="product-review-star-picker" id="reviewStars">${[1,2,3,4,5].map(n=>'<button type="button" data-rating="'+n+'" aria-label="'+n+' ផ្កាយ">'+ic('star',22)+'</button>').join('')}</div><select id="reviewOrder" class="field mb-2">${canReview.map(o=>'<option value="'+esc(o.id)+'">ការបញ្ជាទិញ #'+esc(o.id.slice(0,8))+'</option>').join('')}</select><textarea id="reviewComment" class="field mb-2" maxlength="1200" placeholder="សរសេរមតិរបស់អ្នក..."></textarea><button class="brand-gradient w-full rounded-xl py-3 text-sm font-bold text-white">ផ្ញើការវាយតម្លៃ</button></form>`:'<p class="product-empty-note">ការវាយតម្លៃអាចធ្វើបានក្រោយការបញ្ជាទិញបានបញ្ចប់។</p>'}
    </div>
   </div>
  </section>
  ${related.length?`<section class="product-related-section"><div class="product-section-heading"><div><h2>ទំនិញស្រដៀងគ្នា</h2><p>ស្វែងរកជម្រើសផ្សេងទៀតដែលអាចចាប់អារម្មណ៍</p></div><span>${related.length} មុខ</span></div><div class="product-related-grid">${related.map(productCard).join('')}</div></section>`:''}
  <div class="product-mobile-actions" aria-label="សកម្មភាពទំនិញ"><button type="button" data-product-action="chat">${ic('chat',17)}<span>ឆាត</span></button><button type="button" data-product-action="offer">${ic('tag',17)}<span>តថ្លៃ</span></button><button type="button" class="brand-gradient" data-product-action="buy">${ic('bag',17)}<span>ទិញឥឡូវនេះ</span></button></div>
 </div>`;
 markLoadedImages($('productDetail'));
 $('productDetail').querySelectorAll('[data-vendor-avatar-image]').forEach(image=>image.addEventListener('error',()=>{const box=image.closest('[data-vendor-avatar]');if(box){box.classList.add('is-failed');box.innerHTML=avatarFallbackMarkup(box.dataset.vendorAvatar||'')}},{once:true}));
 const updateGallery=index=>{if(!images.length)return;productGalleryIndex=(index+images.length)%images.length;const image=images[productGalleryIndex],main=$('productMainImage');if(main){main.classList.add('is-switching');const next=new Image();next.onload=()=>{main.src=image.image_url;main.classList.remove('is-switching')};next.onerror=()=>main.classList.remove('is-switching');next.src=image.image_url}$('productGalleryThumbs')?.querySelectorAll('[data-image]').forEach(button=>button.classList.toggle('active',Number(button.dataset.image)===productGalleryIndex));const counter=$('productDetail').querySelector('.product-gallery-counter');if(counter)counter.textContent=(productGalleryIndex+1)+' / '+images.length;if(productLightboxOpen)updateProductLightbox()};
 $('productDetail').querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>updateGallery(Number(button.dataset.image))));
 $('productDetail').querySelectorAll('[data-gallery-step]').forEach(button=>button.addEventListener('click',()=>updateGallery(productGalleryIndex+Number(button.dataset.galleryStep))));
 $('productDetail').querySelector('[data-gallery-zoom]')?.addEventListener('click',openProductLightbox);
 const action=kind=>{if(kind==='store')void openStorefront(v.id);if(kind==='buy')openCheckout(p);if(kind==='save'){const buttons=$('productDetail').querySelectorAll('[data-product-action="save"]');const button=buttons[0];if(button)saveAction(p.id,button);const nowSaved=savedIds.has(p.id);buttons.forEach(node=>{node.setAttribute('aria-pressed',String(nowSaved));node.innerHTML=ic('heart',node.classList.contains('product-gallery-save')?19:16)+(node.classList.contains('product-gallery-save')?'':(nowSaved?' បានរក្សាទុក':' រក្សាទុក'))})}if(kind==='offer'){if(!requireLogin())return;currentOfferProduct=p;$('offerProductName').textContent=p.title+' · '+money(p.price);$('offerAmount').value=p.price;openModal('offerModal')}if(kind==='chat')void startBuyerSellerChat(p.id)};
 $('productDetail').querySelectorAll('[data-product-action]').forEach(button=>button.addEventListener('click',()=>action(button.dataset.productAction)));
 $('productDetail').querySelector('.product-related-grid')?.addEventListener('click',event=>{const save=event.target.closest('[data-action="save"]');if(save){event.preventDefault();event.stopPropagation();saveAction(save.dataset.id,save);return}const view=event.target.closest('[data-action="view"]');if(view){void openProduct(view.dataset.id);return}const store=event.target.closest('[data-action="store"]');if(store)void openStorefront(store.dataset.vendorId)});
 let selectedRating=0;const stars=$('reviewStars');if(stars){const paint=n=>stars.querySelectorAll('button').forEach(button=>{button.classList.toggle('active',Number(button.dataset.rating)<=n);button.classList.toggle('preview',Number(button.dataset.rating)<=n)});stars.addEventListener('mouseover',event=>{const button=event.target.closest('[data-rating]');if(button)paint(Number(button.dataset.rating))});stars.addEventListener('mouseleave',()=>paint(selectedRating));stars.addEventListener('click',event=>{const button=event.target.closest('[data-rating]');if(button){selectedRating=Number(button.dataset.rating);paint(selectedRating)}});$('reviewForm').addEventListener('submit',async event=>{event.preventDefault();if(!requireLogin())return;if(!selectedRating){toast('សូមជ្រើសរើសចំនួនផ្កាយ។','warning');return}try{await api('/api/vendors/'+encodeURIComponent(v.id)+'/reviews',{method:'POST',body:JSON.stringify({rating:selectedRating,comment:$('reviewComment').value,order_id:$('reviewOrder').value})});toast('អរគុណសម្រាប់ការវាយតម្លៃ!');await openProduct(p.id);await loadProducts()}catch(error){toast(error.message,'error')}})}
 $('productDetail').removeAttribute('aria-busy');
}
function updateProductLightbox(){const images=(currentProduct?.product_images||[]).filter(item=>item.image_url),image=images[productGalleryIndex];if(!image)return;$('productLightboxImage').src=image.image_url;$('productLightboxCount').textContent=(productGalleryIndex+1)+' / '+images.length}
function openProductLightbox(){if(!(currentProduct?.product_images||[]).some(item=>item.image_url))return;productLightboxOpen=true;updateProductLightbox();$('productLightbox').classList.add('open');$('productLightbox').setAttribute('aria-hidden','false')}
function closeProductLightbox(){productLightboxOpen=false;$('productLightbox').classList.remove('open');$('productLightbox').setAttribute('aria-hidden','true')}

async function openStorefront(vendorId,options={}){
 if(!vendorId){toast('មិនមានព័ត៌មានហាងនេះទេ។','warning');return false}
 const storeId=String(vendorId),isCurrent=()=>isRouteSyncRequestCurrent(options);
 currentStoreCategory='all';currentStoreSearch='';
 const storeTarget=$('storefrontContent');if(storeTarget){storeTarget.setAttribute('aria-busy','true');storeTarget.innerHTML='<div class="storefront-skeleton"><div class="skeleton storefront-skeleton-profile"></div><div class="storefront-skeleton-grid">'+Array.from({length:10},()=>'<div class="storefront-skeleton-card"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>').join('')+'</div></div>'}
 try{
  try{sessionStorage.setItem('ecomstore.currentStoreId',storeId);sessionStorage.setItem('ecomstore.activeView','store')}catch{}
  const [result,catalogue]=await Promise.all([api('/api/vendors/'+encodeURIComponent(storeId)+'/ratings'),api('/api/products?page=1&limit=50')]);
  if(!isCurrent())return false;
  const storeData=result.data||null;if(!storeData)throw new Error('មិនមានព័ត៌មានហាងទេ។');
  currentStoreId=storeId;currentStoreData=storeData;currentStoreProducts=(catalogue.data||[]).filter(p=>String(p.vendor_id)===storeId);
  await showView('store',{preserveScroll:Boolean(options.preserveScroll)});
  return isCurrent();
 }catch(error){if(!isCurrent())return false;const target=$('storefrontContent');if(target){target.removeAttribute('aria-busy');target.innerHTML='<div class="route-load-error"><span>'+ic('alert',24)+'</span><b>មិនអាចបើកហាងនេះបានទេ</b><p>'+esc(error.message||'សូមព្យាយាមម្ដងទៀត។')+'</p><button type="button" class="brand-gradient" onclick="location.reload()">ព្យាយាមម្ដងទៀត</button></div>'}toast(error.message,'error');return false}
}

function renderStorefront(){
  const data=currentStoreData;if(!data)return;
  const sellerProducts=currentStoreProducts;
  const query=currentStoreSearch.trim().toLocaleLowerCase();
  const visible=sellerProducts.filter(p=>(currentStoreCategory==='all'||p.category===currentStoreCategory)&&(!query||String(p.title+' '+(p.description||'')).toLocaleLowerCase().includes(query)));
  const profile=data.profile||{};
  $('storefrontContent').innerHTML=`<section class="storefront-profile"><div class="storefront-avatar">${avatarMarkup(data.store_name,profile.avatar_url)}</div><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><h1 class="text-xl font-bold text-slate-900">${esc(data.store_name||'ហាងអ្នកលក់')}</h1>${verifiedBadge()}</div><p class="mt-1 text-[11px] text-slate-500">${esc(profile.province||'កម្ពុជា')} · ${Number(data.active_listings||0)} មុខទំនិញ</p><p class="mt-2 text-[11px] text-slate-600">${esc(data.description||profile.bio||'')}</p><div class="mt-2 flex items-center gap-2 text-[11px] text-slate-600">${renderStars(data.rating)} <b>${data.rating??'—'}</b><span>· ${Number(data.review_count||0)} ការវាយតម្លៃ</span></div></div></section><div class="storefront-tools"><input id="storeSearchInput" type="search" placeholder="ស្វែងរកក្នុងហាងនេះ..." value="${esc(currentStoreSearch)}" class="field min-w-0 flex-1"><div class="flex flex-wrap gap-2" id="storeCategoryFilters">${[['all','ទាំងអស់'],...Object.entries(CAT)].map(([key,label])=>`<button type="button" data-store-category="${key}" class="store-filter ${currentStoreCategory===key?'active':''}">${label}</button>`).join('')}</div></div><div class="mb-4 flex items-center justify-between"><h2 class="font-bold">ទំនិញក្នុងហាង</h2><span class="text-[10px] text-slate-500">${visible.length} មុខ</span></div><div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5" id="storeProductGrid">${visible.map(productCard).join('')}</div>${visible.length?'':'<p class="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-[11px] text-slate-500">មិនមានទំនិញត្រូវនឹងការស្វែងរកទេ។</p>'}`;
  $('storefrontContent').removeAttribute('aria-busy');markLoadedImages($('storefrontContent'));
  $('storeSearchInput').addEventListener('input',event=>{currentStoreSearch=event.target.value;const cursor=event.target.selectionStart;renderStorefront();const next=$('storeSearchInput');next.focus();next.setSelectionRange(cursor,cursor)});
  $('storeCategoryFilters').addEventListener('click',event=>{const button=event.target.closest('[data-store-category]');if(button){currentStoreCategory=button.dataset.storeCategory;renderStorefront()}});
  $('storeProductGrid')?.addEventListener('click',event=>{const heart=event.target.closest('[data-action="save"]');if(heart){event.preventDefault();event.stopPropagation();saveAction(heart.dataset.id,heart);return}const view=event.target.closest('[data-action="view"]');if(view)void openProduct(view.dataset.id)});
}

async function loadSaved(){const r=await api('/api/saved');savedIds=new Set((r.data||[]).map(x=>x.products?.id).filter(Boolean));return r.data||[]}
async function loadOrders(){const r=await api('/api/orders');window.myOrders=r.data||[];return window.myOrders}
async function loadOffers(){const r=await api('/api/offers');return r.data||[]}
async function renderProfile(){
  if(!requireLogin())return;
  await refreshSession();
  await renderTelegramSecurity();
  const p=me.profile||{};
  $('profileName').value=p.display_name||'';
  $('profilePhone').value=p.phone||session.user.phone||'';
  $('profileLocation').value=p.province||'ភ្នំពេញ';
  $('profileBio').value=p.bio||'';
  setAvatar($('profileAvatar'),p.avatar_url,profileName());
  $('profileHeadingName').textContent=profileName();
  const accountEmail=String(session.user.email||'');
  const isInternalTelegramEmail=accountEmail.endsWith('@auth.7inone.invalid');
  $('profileHeadingMeta').textContent=session.user.phone ||
    (!isInternalTelegramEmail&&accountEmail) ||
    (p.telegram_username?'@'+p.telegram_username:'គណនី Telegram') ||
    'សមាជិក 7inOne';
  const roleBadges=[];
  if(me.isAdmin) roleBadges.push('<span class="account-role-chip bg-violet-50 text-violet-700">'+ic('shield',12)+' អ្នកគ្រប់គ្រង</span>');
  if(isVerifiedSeller()) roleBadges.push('<span class="account-role-chip bg-emerald-50 text-emerald-700">'+ic('checkcircle',12)+' អ្នកលក់បានផ្ទៀងផ្ទាត់</span>');
  else if(me.vendor?.status==='pending') roleBadges.push('<span class="account-role-chip bg-amber-50 text-amber-700">'+ic('clock',12)+' អ្នកលក់កំពុងរង់ចាំ</span>');
  else if(me.vendor?.status==='rejected') roleBadges.push('<span class="account-role-chip bg-rose-50 text-rose-700">'+ic('x',12)+' ពាក្យអ្នកលក់ត្រូវបានបដិសេធ</span>');
  if(!me.isAdmin && !me.vendor) roleBadges.push('<span class="account-role-chip bg-indigo-50 text-indigo-700">'+ic('user',12)+' សមាជិក / អ្នកទិញ</span>');
  $('profileSellerBadge').innerHTML=roleBadges.join('');
  const cover=$('view-profile').querySelector('.cover');
  cover.style.backgroundImage=p.cover_url? `linear-gradient(115deg,rgba(15,23,42,.42),rgba(79,70,229,.12)),url("${p.cover_url}")`:'';
  $('profileApplyTop').textContent=me.vendor?'មើលស្ថានភាពហាង':'បើកហាងលក់នៅ 7inOne';
  await renderProfileTab();
}

function mountTelegramWidget(targetId,callbackName){
  const target=$(targetId);
  if(!target)return;
  target.innerHTML='';
  if(!telegramBotUsername){
    target.innerHTML='<span class="text-center text-[9px] text-rose-600">Telegram Bot មិនទាន់អាចកំណត់បាន។ សូមពិនិត្យ TELEGRAM_BOT_TOKEN ឬ TELEGRAM_BOT_USERNAME នៅ Render។</span>';
    return false;
  }
  const script=document.createElement('script');
  script.async=true;
  script.src='https://telegram.org/js/telegram-widget.js?22';
  script.setAttribute('data-telegram-login',telegramBotUsername);
  script.setAttribute('data-size','large');
  script.setAttribute('data-userpic','false');
  script.setAttribute('data-radius','10');
  script.setAttribute('data-onauth','window.'+callbackName+'(user)');
  target.appendChild(script);
  return true;
}
async function completeTelegramLogin(telegramUser){
  if(!supabaseClient)throw new Error('Supabase Auth មិនទាន់រួចរាល់ទេ។');
  const response=await fetch('/api/auth/telegram',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(telegramUser),
    cache:'no-store'
  });
  const payload=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(payload.error||'មិនអាច Login តាម Telegram បានទេ។');
  const tokens=payload.data?.session;
  if(!tokens?.access_token||!tokens?.refresh_token)throw new Error('Supabase មិនបានផ្ញើ Session ត្រឡប់មកវិញទេ។');
  const {data,error}=await supabaseClient.auth.setSession({
    access_token:tokens.access_token,
    refresh_token:tokens.refresh_token
  });
  if(error)throw error;
  session=data.session;
  await loadIdentity();
  try{await Promise.all([loadSaved(),loadOrders()])}catch(error){console.warn('Telegram login: optional account data could not be refreshed:',error)}
  syncHeader();
  applyMaintenanceUI();
  closeModal('authModal');
  const destination=me?.isAdmin?'admin':isVerifiedSeller()?'seller':me?.vendor?'profile':'home';
  showView(destination);
  toast(payload.data?.isNewUser?'បានបង្កើតគណនី និង Login តាម Telegram ជោគជ័យ។':'បាន Login តាម Telegram ជោគជ័យ។','success');
}
async function completeTelegramLink(telegramUser){
  if(!session)throw new Error('សូម Login គណនី 7inOne ជាមុនសិន។');
  const result=await api('/api/me/telegram',{method:'POST',body:JSON.stringify(telegramUser)});
  await loadIdentity();
  await renderTelegramSecurity();
  toast('បានភ្ជាប់ Telegram ID ទៅគណនី 7inOne រួចរាល់។','success');
  return result;
}
window.onTelegramAuth=function(telegramUser){
  void completeTelegramLogin(telegramUser).catch(error=>toast(error.message,'error'));
};
window.onTelegramLink=function(telegramUser){
  void completeTelegramLink(telegramUser).catch(error=>toast(error.message,'error'));
};
async function renderTelegramSecurity(){
  if(!session)return;
  try{
    const result=await api('/api/me/telegram');
    const botConnected=Boolean(result.data?.connected);
    const loginLinked=Boolean(result.data?.login_linked);
    if(!loginLinked&&!telegramProfileWidgetMounted)telegramProfileWidgetMounted=mountTelegramWidget('telegramProfileWidget','onTelegramLink');
    $('telegramLoginLinkStatus').textContent=loginLinked?'Telegram Login បានភ្ជាប់រួចរាល់ ✓':'Telegram Login មិនទាន់ភ្ជាប់';
    $('telegramLoginLinkHint').textContent=loginLinked
      ? (result.data.telegram_username?'@'+result.data.telegram_username+' អាចប្រើសម្រាប់ Login បាន។':'Telegram ID របស់អ្នកអាចប្រើសម្រាប់ Login បាន។')
      : 'ភ្ជាប់ Telegram ID ដើម្បីអាច Login ដោយ Telegram នៅពេលក្រោយ។';
    $('telegramProfileWidgetWrap').classList.toggle('hidden',loginLinked);
    $('telegramAccountStatus').textContent=botConnected?'Telegram Bot Chat បានភ្ជាប់រួចរាល់ ✓':'Telegram Bot Chat មិនទាន់ភ្ជាប់';
    $('telegramAccountHint').textContent=botConnected
      ? (result.data.username?'@'+result.data.username+' អាចទទួល OTP និងសារសុវត្ថិភាព។':'Bot Chat របស់អ្នកអាចទទួល OTP និងសារសុវត្ថិភាព។')
      : 'ភ្ជាប់ Bot Chat ដើម្បីទទួល OTP និងសារសុវត្ថិភាព។';
    $('connectTelegramBtn').classList.toggle('hidden',botConnected);
    $('refreshTelegramStatusBtn').classList.remove('hidden');
    $('sendTelegramOtpBtn').disabled=!botConnected;
    $('changeTelegramPasswordBtn').disabled=!botConnected;
  }catch(error){
    $('telegramLoginLinkStatus').textContent='មិនអាចអានស្ថានភាព Telegram Login';
    $('telegramLoginLinkHint').textContent=error.message;
    $('telegramAccountStatus').textContent='មិនអាចអានស្ថានភាព Telegram Bot';
    $('telegramAccountHint').textContent=error.message;
    $('sendTelegramOtpBtn').disabled=true;
    $('changeTelegramPasswordBtn').disabled=true;
  }
}
async function renderProfileTab(){
  if(!session)return;
  try{
    if(profileTab==='saved'){
      const saved=await loadSaved();
      $('profileActivityCount').textContent=`${saved.length} មុខ`;
      $('profileTabContent').innerHTML=saved.length
        ? `<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">${saved.map(row=>savedCard(row.products)).join('')}</div>`
        : '<div class="py-10 text-center text-[11px] text-slate-400">អ្នកមិនទាន់រក្សាទុកទំនិញណាមួយទេ។</div>';
    }else if(profileTab==='history'){
      const [orders,offers]=await Promise.all([loadOrders(),loadOffers()]);
      $('profileActivityCount').textContent=`${orders.length} ការបញ្ជាទិញ · ${offers.length} សំណើ`;
      const orderHtml=orders.map(o=>`<div class="rounded-xl border border-slate-100 p-3"><div class="flex justify-between gap-2"><b class="text-[11px]">Order #${esc(o.id.slice(0,8))}</b><span class="text-[10px] text-indigo-600">${esc(o.status)}</span></div><p class="mt-1 text-[10px] text-slate-500">${fmtDate(o.created_at)} · ${money(o.total)}</p>${(o.order_items||[]).map(i=>`<p class="mt-1 text-[10px] text-slate-500">${esc(i.products?.title||'ទំនិញ')} × ${i.quantity}</p>`).join('')}</div>`).join('');
      const offerHtml=offers.map(o=>`<div class="rounded-xl border border-slate-100 p-3"><div class="flex justify-between gap-2"><b class="text-[11px]">${esc(o.products?.title||'ទំនិញ')}</b><span class="text-[10px] font-bold ${o.status==='accepted'?'text-emerald-600':o.status==='rejected'?'text-rose-500':'text-amber-600'}">${offerStatus(o.status)}</span></div><p class="mt-1 text-[10px] text-slate-500">ស្នើ ${money(o.offer_price)} · ${fmtDate(o.created_at)}</p></div>`).join('');
      $('profileTabContent').innerHTML=`<div class="space-y-3"><h4 class="text-[11px] font-bold">ប្រវត្តិការបញ្ជាទិញ</h4>${orderHtml||'<p class="text-[10px] text-slate-400">មិនទាន់មានការបញ្ជាទិញ។</p>'}<h4 class="pt-2 text-[11px] font-bold">ប្រវត្តិសំណើតថ្លៃ</h4>${offerHtml||'<p class="text-[10px] text-slate-400">មិនទាន់មានសំណើតម្លៃ។</p>'}</div>`;
    }else{
      const v=me.vendor;
      $('profileActivityCount').textContent=v?`ស្ថានភាព៖ ${vendorStatus(v.status)}`:'មិនទាន់មានហាង';
      const statusCard=v
        ? `<div class="rounded-2xl border border-slate-100 p-4"><div class="flex items-center justify-between gap-2"><b class="text-[12px]">${esc(v.store_name)}</b><span class="rounded-full px-3 py-1 text-[10px] font-bold ${v.status==='approved'?'bg-emerald-50 text-emerald-700':v.status==='pending'?'bg-amber-50 text-amber-700':'bg-rose-50 text-rose-700'}">${vendorStatus(v.status)}</span></div><p class="mt-2 text-[10px] leading-5 text-slate-500">${esc(v.description||'')}<br>${esc(v.contact_phone||'')} · ${esc(v.address||'')}</p>${v.review_note?`<p class="mt-3 rounded-xl bg-rose-50 p-3 text-[10px] text-rose-700">ចំណាំ Admin៖ ${esc(v.review_note)}</p>`:''}</div>`
        : `<div class="rounded-2xl bg-indigo-50 p-4"><b class="text-[12px]">ចុះឈ្មោះក្លាយជាអ្នកលក់</b><p class="mt-1 text-[10px] leading-5 text-slate-500">ដាក់ព័ត៌មានហាង និងឯកសារផ្ទៀងផ្ទាត់ដើម្បីបើកហាងលក់ទំនិញ។</p><button id="applySellerFromTab" class="mt-3 rounded-xl brand-gradient px-4 py-2.5 text-[10px] font-bold text-white">ចុះឈ្មោះអ្នកលក់</button></div>`;
      $('profileTabContent').innerHTML=statusCard;
      $('applySellerFromTab')?.addEventListener('click',openSellerModal);
    }
  }catch(e){$('profileTabContent').innerHTML=`<p class="text-[11px] text-rose-600">${esc(e.message)}</p>`}
}
function savedCard(p){return `<div data-saved-card="${esc(p.id)}" class="flex gap-3 rounded-xl border border-slate-100 bg-white p-2.5">${productImage(p)?`<span class="img-scan-wrap shimmer-scan h-20 w-20 shrink-0 rounded-lg"><img class="h-full w-full object-cover" src="${esc(productImage(p))}"></span>`:`<div class="grid h-20 w-20 place-items-center rounded-lg bg-slate-100 text-slate-400">${ic('image',22)}</div>`}<div class="min-w-0 flex-1"><b class="block truncate text-[11px]">${esc(p.title)}</b><b class="mt-1 block text-[13px] text-emerald-600">${money(p.price)}</b><p class="mt-1 truncate text-[9px] text-slate-400">${esc(p.location||'')}</p><div class="mt-2 flex gap-2"><button data-open-product="${esc(p.id)}" class="text-[10px] font-bold text-indigo-600">មើលទំនិញ</button><button data-remove-saved="${esc(p.id)}" class="text-[10px] font-bold text-rose-500">ដកចេញ</button></div></div></div>`}
function vendorStatus(s){return ({pending:'កំពុងរង់ចាំការផ្ទៀងផ្ទាត់',approved:'បានផ្ទៀងផ្ទាត់',rejected:'បានបដិសេធ',blocked:'បានបិទ'})[s]||s}
function offerStatus(s){return ({pending:'កំពុងរង់ចាំ',accepted:'បានទទួលយក',rejected:'បានបដិសេធ',withdrawn:'បានដកចេញ'})[s]||s}
function ensureCheckoutModal(){
  if($('checkoutModal'))return;
  const wrap=document.createElement('div');wrap.id='checkoutModal';wrap.className='modal';wrap.setAttribute('aria-hidden','true');
  wrap.innerHTML=`<section class="modal-box w-full max-w-[560px] rounded-3xl bg-white p-5 shadow-2xl sm:p-7"><div class="mb-5 flex items-start justify-between"><div><p class="text-[10px] font-bold text-indigo-600">ការបញ្ជាទិញពិត</p><h2 class="mt-1 text-xl font-bold">ព័ត៌មានដឹកជញ្ជូន និងទូទាត់</h2><p id="checkoutProductName" class="mt-1 text-[11px] text-slate-400"></p></div><button type="button" data-close="checkoutModal" class="grid h-9 w-9 place-items-center rounded-full bg-slate-100">${ic('x',17)}</button></div><form id="checkoutForm" class="space-y-3"><label class="block"><span class="mb-1 block text-[11px] font-bold">ឈ្មោះអ្នកទទួល</span><input id="checkoutName" required minlength="2" maxlength="100" class="field text-[12px]" placeholder="ឈ្មោះពេញ"></label><label class="block"><span class="mb-1 block text-[11px] font-bold">លេខទូរស័ព្ទ</span><input id="checkoutPhone" required minlength="6" maxlength="30" class="field text-[12px]" placeholder="ឧ. 012 345 678"></label><label class="block"><span class="mb-1 block text-[11px] font-bold">អាសយដ្ឋានដឹកជញ្ជូន</span><textarea id="checkoutAddress" required minlength="5" maxlength="1000" class="field min-h-20 text-[12px]" placeholder="ផ្ទះ លេខផ្លូវ សង្កាត់ ខណ្ឌ ខេត្ត/រាជធានី"></textarea></label><label class="block"><span class="mb-1 block text-[11px] font-bold">ចំណាំ (មិនចាំបាច់)</span><textarea id="checkoutNote" maxlength="500" class="field min-h-16 text-[12px]" placeholder="ព័ត៌មានបន្ថែមសម្រាប់អ្នកដឹកជញ្ជូន"></textarea></label><fieldset class="space-y-2"><legend class="mb-2 text-[11px] font-bold">វិធីទូទាត់</legend><label class="flex items-center gap-2 rounded-xl border p-3 text-[11px]"><input type="radio" name="paymentMethod" value="cash_on_delivery" checked> បង់ប្រាក់ពេលទទួលទំនិញ</label><label class="flex items-center gap-2 rounded-xl border p-3 text-[11px]"><input type="radio" name="paymentMethod" value="bank_transfer"> ផ្ទេរប្រាក់ធនាគារ (Admin ត្រូវផ្ទៀងផ្ទាត់)</label></fieldset><div class="flex items-center justify-between border-t pt-4"><span class="text-[11px] text-slate-500">សរុបតម្លៃទំនិញ</span><b id="checkoutTotal" class="text-xl text-emerald-600"></b></div><button id="checkoutSubmit" class="brand-gradient w-full rounded-xl py-3 text-[12px] font-bold text-white">បញ្ជាក់ការបញ្ជាទិញ</button><p class="text-center text-[9px] text-slate-400">ការបញ្ជាទិញ និងចំនួនស្តុកនឹងត្រូវបានរក្សាទុកនៅ Database។</p></form></section>`;
  document.body.appendChild(wrap);
  wrap.addEventListener('mousedown',e=>{if(e.target===wrap)closeModal('checkoutModal')});
  wrap.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal('checkoutModal')));
  $('checkoutForm').addEventListener('submit',async e=>{
    e.preventDefault();if(!requireLogin()||!currentProduct)return;
    const button=$('checkoutSubmit');button.disabled=true;button.textContent='កំពុងបញ្ជាទិញ...';
    try{
      const payment=document.querySelector('input[name="paymentMethod"]:checked')?.value||'cash_on_delivery';
      const result=await api('/api/orders',{method:'POST',body:JSON.stringify({customer_name:$('checkoutName').value.trim(),customer_phone:$('checkoutPhone').value.trim(),delivery_address:$('checkoutAddress').value.trim(),delivery_note:$('checkoutNote').value.trim(),payment_method:payment,items:[{product_id:currentProduct.id,quantity:1}]})});
      const order=result.data;closeModal('checkoutModal');toast('បានបញ្ជាទិញជោគជ័យ។ លេខបញ្ជាទិញ #'+String(order.id).slice(0,8));await Promise.all([loadOrders(),loadProducts()]);
    }catch(err){toast(err.message,'error')}
    finally{button.disabled=false;button.textContent='បញ្ជាក់ការបញ្ជាទិញ'}
  });
}
function openCheckout(p){if(!requireLogin())return;if(!p||Number(p.stock)<=0){toast('ទំនិញនេះអស់ស្តុកហើយ។','warning');return}ensureCheckoutModal();$('checkoutProductName').textContent=p.title;$('checkoutTotal').textContent=money(p.price);$('checkoutName').value=me?.profile?.display_name||session?.user?.user_metadata?.display_name||'';$('checkoutPhone').value=me?.profile?.phone||session?.user?.phone||'';$('checkoutAddress').value='';$('checkoutNote').value='';openModal('checkoutModal')}
function openSellerModal(){if(!requireLogin())return;if(me?.vendor&&me.vendor.status!=='rejected'){toast(me.vendor.status==='approved'?'ហាងរបស់អ្នកបានផ្ទៀងផ្ទាត់រួចហើយ។':'ពាក្យរបស់អ្នកកំពុងរង់ចាំការផ្ទៀងផ្ទាត់។','warning');return}$('sellerApplyForm').reset();$('sellerDocName').textContent='ចុចដើម្បី Upload ឯកសារ';$('sellerDocThumb').innerHTML=ic('file',23);$('sellerDocPreview').classList.add('hidden');openModal('sellerModal')}
function renderProductForm(product=null){if(!isVerifiedSeller()){if(me?.vendor?.status==='pending'){toast('ហាងកំពុងរង់ចាំ Admin អនុម័ត។','warning')}else openSellerModal();return}selectedProductImages=[];$('productForm').reset();$('editProductId').value=product?.id||'';$('productFormTitle').textContent=product?'កែប្រែព័ត៌មានទំនិញ':'បន្ថែមទំនិញថ្មី';$('productImageName').textContent='ជ្រើសរើសរូបភាពផលិតផល (អតិបរមា ៥ រូប)';$('productImageThumb').classList.remove('img-scan-wrap','shimmer-scan','is-loaded','is-failed');$('productImageThumb').innerHTML=ic('image',21);$('productImage').value='';if(product){$('productTitle').value=product.title;$('productPrice').value=product.price;$('productCategory').value=product.category;$('productLocation').value=product.location||'ភ្នំពេញ';$('productCondition').value=product.condition||'ប្រើរួចស្អាត';const descriptions=productDescriptionParts(product);$('productShortDesc').value=descriptions.short;$('productDescription').value=descriptions.full;const image=productImage(product);if(image){$('productImageThumb').classList.add('img-scan-wrap','shimmer-scan');$('productImageThumb').innerHTML=`<img class="h-full w-full object-cover" src="${esc(image)}">`;markLoadedImages($('productImageThumb'));}$('productImageName').textContent=product.product_images?.length?`${product.product_images.length} រូបដែលបាន Upload រួច`:'មិនទាន់មានរូបភាព'}updateShortDescriptionCounter();openModal('productFormModal')}
function sellerProductAge(product){
 const time=Date.parse(product.renewed_at||product.updated_at||product.created_at||'');
 return Number.isFinite(time)?Math.max(0,Date.now()-time):0;
}
function sellerProductLifecycle(product){
 const age=sellerProductAge(product),week=7*86400000,fortnight=14*86400000;
 return {age,active:age<week,expired:age>=week&&age<=fortnight,daysLeft:Math.max(0,Math.ceil((week-age)/86400000)),graceDays:Math.max(0,Math.ceil((fortnight-age)/86400000)),autoDelete:age>fortnight};
}
function sellerStatusBadge(product,life){
 if(product.status==='sold')return '<span class="seller-status-badge is-sold">'+ic('checkcircle',12)+' លក់រួច</span>';
 if(product.status!=='active')return '<span class="seller-status-badge is-muted">'+ic('clock',12)+' '+esc(productStatus(product.status))+'</span>';
 if(life.expired)return '<span class="seller-status-badge is-expired">'+ic('clock',12)+' ផុតកំណត់</span>';
 return '<span class="seller-status-badge is-active">'+ic('checkcircle',12)+' កំពុងលក់</span>';
}
function sellerProductRow(product){
 const life=sellerProductLifecycle(product),canRenew=product.status==='active',image=productImage(product);
 const validity=product.status==='active'?(life.expired
  ?'<span class="seller-expiry-warning">'+ic('clock',12)+' ផុតកំណត់ ១ សប្ដាហ៍ · នឹងលុបស្វ័យប្រវត្តិក្នុង '+life.graceDays+' ថ្ងៃទៀត បើមិន Renew</span>'
  :'<span class="seller-validity">'+ic('clock',12)+' សុពលភាព៖ សល់ '+life.daysLeft+' ថ្ងៃ</span>')
  :'<span class="seller-validity is-muted">—</span>';
 const renewLabel=life.expired?'Renew Post':'បន្តសុពលភាព';
 const imageMarkup=image?'<span class="img-scan-wrap shimmer-scan"><img src="'+esc(image)+'" alt="" loading="lazy" onload="this.closest(\'.img-scan-wrap\')?.classList.add(\'is-loaded\')" onerror="this.closest(\'.img-scan-wrap\')?.classList.add(\'is-failed\')"></span>':ic('image',22);
 return '<article class="seller-product-row" data-product-id="'+esc(product.id)+'" data-product-status="'+esc(product.status)+'" data-renew-state="'+(life.expired?'expired':life.autoDelete?'delete':life.active?'active':'other')+'">'+
  '<div class="seller-product-main"><div class="seller-product-thumb">'+imageMarkup+'</div><div class="seller-product-copy"><b>'+esc(product.title||'ទំនិញ')+'</b><small>'+esc(product.category||'ទូទៅ')+' · '+esc(product.condition||'មិនបានបញ្ជាក់')+'</small></div></div>'+
  '<div class="seller-product-price">'+money(product.price)+'</div>'+
  '<div class="seller-product-metrics"><span>'+ic('package',13)+' '+Number(product.stock||0)+' ស្តុក</span><span>'+ic('eye',13)+' '+Number(product.view_count||0).toLocaleString()+' Views</span></div>'+
  '<div class="seller-product-validity">'+sellerStatusBadge(product,life)+validity+'</div>'+
  '<div class="seller-product-actions">'+(canRenew?'<button type="button" data-seller-action="renew" data-id="'+esc(product.id)+'" class="seller-action-button is-renew">'+ic('refresh',13)+' '+renewLabel+'</button>':'')+
  '<button type="button" data-seller-action="edit" data-id="'+esc(product.id)+'" class="seller-action-button">'+ic('edit',13)+' កែប្រែ</button>'+
  (product.status==='active'?'<button type="button" data-seller-action="sold" data-id="'+esc(product.id)+'" class="seller-action-button is-complete">'+ic('check',13)+' លក់រួច</button>':'')+
  '<button type="button" data-seller-action="delete" data-id="'+esc(product.id)+'" class="seller-action-button is-delete">'+ic('trash',13)+' លុប</button></div></article>';
}
function renderSellerProductList(){
 const target=$('sellerProducts');if(!target)return;
 const term=String($('sellerProductSearch')?.value||'').trim().toLocaleLowerCase();
 const filtered=sellerProductCache.filter(product=>{
  const life=sellerProductLifecycle(product),matchesTerm=!term||String(product.title||'').toLocaleLowerCase().includes(term);
  const matchesFilter=sellerActiveFilter==='all'||(sellerActiveFilter==='active'&&product.status==='active'&&!life.expired)||(sellerActiveFilter==='renew'&&product.status==='active'&&life.expired)||(sellerActiveFilter==='sold'&&product.status==='sold');
  return !life.autoDelete&&matchesTerm&&matchesFilter;
 });
 target.innerHTML=filtered.map(sellerProductRow).join('')||'<div class="seller-empty-state">'+ic('package',24)+'<b>មិនមានទំនិញក្នុងបញ្ជីនេះទេ</b><span>សូមប្តូរតម្រង ឬបន្ថែមទំនិញថ្មី។</span></div>';
}
function setSellerTab(name){
 sellerActiveTab=name;
 document.querySelectorAll('[data-seller-tab]').forEach(button=>{const active=button.dataset.sellerTab===name;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active))});
 document.querySelectorAll('[data-seller-panel]').forEach(panel=>{const active=panel.dataset.sellerPanel===name;panel.classList.toggle('is-active',active);panel.hidden=!active});
}
async function renderSeller(){
 if(!isVerifiedSeller()){
  const v=me?.vendor;$('sellerGate').classList.remove('hidden');$('sellerDashboardContent').classList.add('hidden');
  $('sellerGateText').textContent=v?('ស្ថានភាពហាង៖ '+vendorStatus(v.status)+'។ '+(v.status==='rejected'?'សូមពិនិត្យមតិ Admin នៅក្នុងគណនីរបស់អ្នក។':'សូមរង់ចាំ Admin ពិនិត្យឯកសាររបស់អ្នក។')):'សូមចុះឈ្មោះ និងរង់ចាំ Admin ផ្ទៀងផ្ទាត់ឯកសារមុនពេលបង្ហោះទំនិញ។';
  $('sellerGateApply').textContent=v?.status==='pending'?'កំពុងរង់ចាំការអនុម័ត':'ចុះឈ្មោះអ្នកលក់';$('sellerGateApply').disabled=v?.status==='pending';return;
 }
 $('sellerGate').classList.add('hidden');$('sellerDashboardContent').classList.remove('hidden');
 try{
  const results=await Promise.all([api('/api/vendor/overview'),api('/api/vendor/products'),loadOffers(),api('/api/vendor/orders')]);
  const stats=results[0],productsRes=results[1],offers=results[2],ordersRes=results[3];
  $('kpiListings').textContent=stats.data.activeListings;$('kpiViews').textContent=Number(stats.data.totalViews).toLocaleString();$('kpiRating').textContent=stats.data.averageRating??'—';$('kpiSales').textContent=stats.data.completedSales;
  const allProducts=productsRes.data||[],stale=allProducts.filter(p=>sellerProductLifecycle(p).autoDelete);
  sellerProductCache=allProducts.filter(p=>!sellerProductLifecycle(p).autoDelete);
  if(stale.length){
   const removed=await Promise.allSettled(stale.map(p=>api('/api/products/'+encodeURIComponent(p.id),{method:'DELETE'})));
   const removedIds=new Set(stale.filter((p,i)=>removed[i].status==='fulfilled').map(p=>p.id));
   sellerProductCache=sellerProductCache.filter(p=>!removedIds.has(p.id));
  }
  $('kpiListings').textContent=String(sellerProductCache.filter(p=>p.status==='active'&&!sellerProductLifecycle(p).expired).length);
  $('sellerProductsCount').textContent=String(sellerProductCache.length);
  const received=(offers||[]).filter(o=>o.vendor_id===me.vendor.id),sellerOrders=ordersRes.data||[];
  $('sellerOffersCount').textContent=String(received.length);$('sellerOrdersCount').textContent=String(sellerOrders.length);
  renderSellerProductList();
  $('sellerOffers').innerHTML=received.map(o=>{
   const statusClass=o.status==='accepted'?'is-active':o.status==='rejected'?'is-muted':'is-pending';
   const actions=o.status==='pending'?'<button type="button" data-offer-action="accepted" data-id="'+esc(o.id)+'" class="seller-action-button is-complete">'+ic('check',13)+' ទទួលយក</button><button type="button" data-offer-action="rejected" data-id="'+esc(o.id)+'" class="seller-action-button is-delete">'+ic('x',13)+' បដិសេធ</button>':'';
   return '<article class="seller-transaction-row"><div class="seller-transaction-main"><b>'+esc(o.products?.title||'ទំនិញ')+'</b><small>'+esc(o.message||'សំណើតថ្លៃ')+'</small></div><div class="seller-transaction-contact"><span>'+ic('user',14)+' '+esc(o.buyer_name||'អ្នកទិញ')+'</span><small>'+ic('phone',12)+' '+esc(o.buyer_phone||'មិនមានលេខទូរស័ព្ទ')+'</small><small>'+ic('calendar',12)+' '+fmtDate(o.created_at)+'</small></div><div class="seller-transaction-price">'+money(o.offer_price)+'<span class="seller-status-badge '+statusClass+'">'+ic(o.status==='accepted'?'checkcircle':'clock',12)+' '+offerStatus(o.status)+'</span></div><div class="seller-transaction-actions">'+actions+'</div></article>';
  }).join('')||'<div class="seller-empty-state">'+ic('tag',24)+'<b>មិនទាន់មានសំណើតថ្លៃទេ</b></div>';
  $('sellerOrders').innerHTML=sellerOrders.map(row=>{
   const order=row.orders||{},state=row.fulfillment_status||'pending';
   let actions='';
   if(state==='pending')actions='<button type="button" data-order-status="processing" data-order-id="'+esc(row.order_id)+'" class="seller-action-button is-complete">'+ic('check',13)+' ទទួលយក</button><button type="button" data-order-status="cancelled" data-order-id="'+esc(row.order_id)+'" class="seller-action-button is-delete">'+ic('x',13)+' បដិសេធ</button>';
   else if(state==='processing')actions='<button type="button" data-order-status="shipped" data-order-id="'+esc(row.order_id)+'" class="seller-action-button is-renew">'+ic('truck',13)+' ដឹកជញ្ជូន</button>';
   else if(state==='shipped')actions='<button type="button" data-order-status="completed" data-order-id="'+esc(row.order_id)+'" class="seller-action-button is-complete">'+ic('check',13)+' បញ្ចប់</button>';
   const statusClass=state==='completed'?'is-active':state==='cancelled'?'is-muted':'is-pending';
   return '<article class="seller-transaction-row"><div class="seller-transaction-main"><b>'+esc(row.products?.title||'ទំនិញ')+' × '+Number(row.quantity||1)+'</b><small>Order #'+esc(String(row.order_id||'').slice(0,8))+'</small></div><div class="seller-transaction-contact"><span>'+ic('user',14)+' '+esc(order.customer_name||'អ្នកទិញ')+'</span><small>'+ic('phone',12)+' '+esc(order.customer_phone||'មិនមានលេខទូរស័ព្ទ')+'</small><small>'+ic('calendar',12)+' '+fmtDate(order.created_at)+'</small></div><div class="seller-transaction-price">'+money(Number(row.unit_price||0)*Number(row.quantity||0))+'<span class="seller-status-badge '+statusClass+'">'+ic(state==='completed'?'checkcircle':'clock',12)+' '+productStatus(state)+'</span></div><div class="seller-transaction-actions">'+actions+'</div></article>';
  }).join('')||'<div class="seller-empty-state">'+ic('file',24)+'<b>មិនទាន់មានការបញ្ជាទិញទេ</b></div>';
  setSellerTab(sellerActiveTab);await loadUnifiedSellerChatInbox();
 }catch(e){toast('មិនអាចផ្ទុក Dashboard៖ '+e.message,'error')}
}
function productStatus(s){return ({active:'កំពុងលក់',pending:'រង់ចាំ Admin',rejected:'បានបដិសេធ',sold:'លក់រួច',archived:'បានបិទ'})[s]||s}
function diagnosticStatus(ok){return ok?'<span class="font-bold text-emerald-700">ជោគជ័យ</span>':'<span class="font-bold text-rose-600">មានបញ្ហា</span>'}
function renderTelegramDiagnostics(data){
  const row=(label,item,detail='')=>'<div class="flex flex-col gap-1 border-b border-slate-100 py-2 last:border-0 sm:flex-row sm:items-start sm:justify-between"><span class="font-semibold text-slate-700">'+label+'</span><span class="text-left sm:text-right">'+diagnosticStatus(Boolean(item?.ok))+(detail?'<span class="mt-1 block break-words text-[10px] text-slate-500">'+esc(detail)+'</span>':'')+(item?.error?'<span class="mt-1 block break-words text-[10px] text-rose-600">'+esc(item.error)+'</span>':'')+'</span></div>';
  const botDetail=data.bot?.ok?((data.bot.first_name||'Bot')+' · @'+(data.bot.username||'—')+' · ID '+data.bot.id):'';
  const widgetBotDetail=data.telegram_widget_bot?.username?'@'+data.telegram_widget_bot.username:'';
  const chatDetail=data.chat?.ok?((data.chat.title||'Channel')+' · '+(data.chat.type||'')+' · ID '+data.chat.id):'';
  const memberDetail=data.membership?.ok?('សិទ្ធិ៖ '+data.membership.status+(data.membership.can_post_messages===null?'':' · អាច Post៖ '+(data.membership.can_post_messages?'បាទ/ចាស':'ទេ'))):'';
  const webhookOk=Boolean(data.webhook?.ok&&data.webhook.url_matches&&!data.webhook.last_error_message);
  const webhookDetail=data.webhook?.ok?('URL៖ '+(data.webhook.configured_url||'មិនទាន់កំណត់')+' · Pending៖ '+Number(data.webhook.pending_update_count||0)+(data.webhook.last_error_message?' · Telegram Error៖ '+data.webhook.last_error_message:'')):'';
  const tableDetail=(key)=>data.tables?.[key]||{ok:false,error:'មិនអាចពិនិត្យ Database បាន។'};
  const upload='<div class="mt-3 rounded-lg '+(data.can_upload?'bg-emerald-50 text-emerald-800':'bg-rose-50 text-rose-700')+' p-3 text-[11px] font-bold">'+(data.can_upload?'អាច Upload ទៅ Channel បាន':'មិនទាន់អាច Upload ទៅ Channel បាន')+'</div>';
  const login='<div class="mt-3 rounded-lg '+(data.login_ready?'bg-emerald-50 text-emerald-800':'bg-amber-50 text-amber-800')+' p-3 text-[11px] font-bold">'+(data.login_ready?'Bot Deep-link Login ចាស់៖ ត្រៀមរួចរាល់':'Bot Deep-link Login ចាស់៖ មិនទាន់ត្រៀមរួច — ពិនិត្យ Webhook និង Bot Security')+'</div>';
  $('telegramDiagnosticsResult').innerHTML='<div class="mb-2 flex items-center justify-between"><b class="text-slate-800">លទ្ធផលត្រួតពិនិត្យ Telegram</b><span class="text-[9px] text-slate-400">'+(data.configured?'Bot/Channel បានកំណត់':'ខ្វះ Configuration')+'</span></div>'+
    row('Telegram Bot API (getMe)',data.bot,botDetail)+
    row('Telegram Login Widget Bot Username',data.telegram_widget_bot,widgetBotDetail)+
    row('Telegram Channel (getChat)',data.chat,chatDetail)+
    row('Bot Admin / Post Permission',data.membership,memberDetail)+
    row('Webhook URL / getWebhookInfo',{ok:webhookOk,error:data.webhook?.error||(data.webhook?.ok&&!data.webhook.url_matches?'Webhook URL មិនត្រូវនឹង PUBLIC_APP_URL។':null)},webhookDetail)+
    row('TELEGRAM_WEBHOOK_SECRET',data.webhook_secret)+
    row('PUBLIC_APP_URL (HTTPS)',data.public_app_url,data.public_app_url?.value||'')+
    row('Supabase Service Role Connection',data.database)+
    row('Database: telegram_account_links (Bot Chat)',tableDetail('telegram_account_links'))+
    row('Database: telegram_login_tokens (Bot Login)',tableDetail('telegram_login_tokens'))+
    row('Database: profiles.telegram_id / telegram_username',tableDetail('profiles_telegram_columns'))+
    row('Database: Telegram Widget replay protection',tableDetail('telegram_widget_auth_events'))+
    (data.chat_id?'<p class="mt-2 break-all text-[10px] text-slate-500">Channel ID៖ '+esc(data.chat_id)+'</p>':'')+
    '<div class="mt-3 rounded-lg '+(data.widget_login_ready?'bg-emerald-50 text-emerald-800':'bg-amber-50 text-amber-800')+' p-3 text-[11px] font-bold">'+
    (data.widget_login_ready?'Telegram Login Widget៖ ត្រៀមរួចរាល់':'Telegram Login Widget៖ មិនទាន់ត្រៀមរួច — ពិនិត្យ Telegram Bot Token, Supabase Anon Key និង SQL Migration')+'</div>'+
    upload+login;
}
async function runTelegramDiagnostics(){
  if(!isAdmin()){toast('មុខងារនេះសម្រាប់ Admin ប៉ុណ្ណោះ។','error');return}
  const button=$('telegramDiagnosticsBtn'),result=$('telegramDiagnosticsResult');
  button.disabled=true;button.textContent='កំពុងពិនិត្យ...';result.textContent='កំពុងទាក់ទង Telegram Bot API...';
  try{const data=await api('/api/admin/telegram/diagnostics');renderTelegramDiagnostics(data)}
  catch(error){result.innerHTML='<p class="font-bold text-rose-600">មិនអាចបញ្ចប់ការត្រួតពិនិត្យបានទេ</p><p class="mt-1 break-words text-[10px] text-rose-600">'+esc(error.message)+'</p><p class="mt-2 text-[10px] text-slate-500">សូមពិនិត្យថាអ្នកបាន Login ជា Admin ហើយសាកល្បងម្ដងទៀត។</p>'}
  finally{button.disabled=false;button.textContent='ពិនិត្យ Telegram'}
}
async function renderAdmin(){if(!isAdmin())return;renderBrandingAdmin();$('maintenanceToggle').checked=maintenanceMode;$('maintenanceMessageInput').value=maintenanceMessage;$('maintenanceStatusHint').textContent='ស្ថានភាពបច្ចុប្បន្ន៖ '+(maintenanceMode?'កំពុងអភិវឌ្ឍន៍':'កំពុងដំណើរការ');try{const res=await api('/api/admin/vendors'),vendors=res.data||[];$('adminPendingCount').textContent=vendors.filter(v=>v.status==='pending').length;$('adminApprovedCount').textContent=vendors.filter(v=>v.status==='approved').length;$('adminRejectedCount').textContent=vendors.filter(v=>['rejected','blocked'].includes(v.status)).length;$('adminApplications').innerHTML=vendors.map(v=>`<div class="rounded-2xl border border-slate-100 p-4"><div class="flex flex-wrap items-start justify-between gap-3"><div class="min-w-0 flex-1"><b class="text-[12px]">${esc(v.store_name)}</b><p class="mt-1 text-[10px] text-slate-500">${esc(v.profiles?.display_name||'')} · ${esc(v.contact_phone||v.profiles?.phone||'')} </p><p class="mt-1 text-[10px] text-slate-500">${esc(v.address||'')}</p><p class="mt-1 text-[9px] text-slate-400">${fmtDate(v.created_at)}</p><span class="mt-2 inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${v.status==='approved'?'bg-emerald-50 text-emerald-700':v.status==='pending'?'bg-amber-50 text-amber-700':'bg-rose-50 text-rose-700'}">${vendorStatus(v.status)}</span></div><div class="flex gap-2"><button data-admin-doc="${esc(v.id)}" class="rounded-lg border px-3 py-2 text-[10px] font-bold" ${v.document_url?'':'disabled'}>${ic('file',13,'inline')} មើលឯកសារ</button></div></div>${v.status==='pending'?`<div class="mt-3 flex flex-wrap gap-2"><button data-admin-review="approved" data-id="${esc(v.id)}" class="rounded-lg bg-emerald-500 px-4 py-2 text-[10px] font-bold text-white">អនុម័ត</button><button data-admin-review="rejected" data-id="${esc(v.id)}" class="rounded-lg bg-rose-50 px-4 py-2 text-[10px] font-bold text-rose-600">បដិសេធ</button></div>`:''}${v.review_note?`<p class="mt-2 text-[10px] text-rose-600">ចំណាំ៖ ${esc(v.review_note)}</p>`:''}</div>`).join('')||'<p class="py-8 text-center text-[11px] text-slate-400">មិនទាន់មានពាក្យស្នើសុំអ្នកលក់។</p>';window.adminVendors=vendors}catch(e){toast('មិនអាចផ្ទុក Admin៖ '+e.message,'error')}}
function setupEditorialInteractions(){
  const desktop=window.matchMedia('(hover: hover) and (pointer: fine)').matches&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!desktop)return;
  const queued=new WeakSet(),latest=new WeakMap(),magnetFrames=new WeakMap();
  document.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch')return;
    const target=event.target.closest('.product-card,.editorial-glow');if(!target)return;
    latest.set(target,{x:event.clientX,y:event.clientY});if(queued.has(target))return;queued.add(target);
    requestAnimationFrame(()=>{
      queued.delete(target);const point=latest.get(target);if(!point||!target.isConnected)return;
      const rect=target.getBoundingClientRect();if(!rect.width||!rect.height)return;
      const x=(point.x-rect.left)/rect.width,y=(point.y-rect.top)/rect.height;
      target.style.setProperty('--mouse-x',(x*100).toFixed(1)+'%');target.style.setProperty('--mouse-y',(y*100).toFixed(1)+'%');target.style.setProperty('--spotlight-opacity','1');
      /* 3D tilt disabled for clean card UX */
    });
  },{passive:true});
  document.addEventListener('pointerout',event=>{const target=event.target.closest('.product-card,.editorial-glow');if(!target||(event.relatedTarget&&target.contains(event.relatedTarget)))return;target.style.setProperty('--spotlight-opacity','0');if(target.classList.contains('product-card'))target.style.transform=''});
  document.querySelectorAll('.hero-primary-action,#postAdBtn,#mobilePostBtn,#bannerPostBtn').forEach(button=>{
    button.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||magnetFrames.has(button))return;const rect=button.getBoundingClientRect(),dx=event.clientX-(rect.left+rect.width/2),dy=event.clientY-(rect.top+rect.height/2),x=Math.max(-5,Math.min(5,dx*.08)),y=Math.max(-5,Math.min(5,dy*.08));const frame=requestAnimationFrame(()=>{button.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)';magnetFrames.delete(button)});magnetFrames.set(button,frame)} ,{passive:true});
    button.addEventListener('pointerleave',()=>{if(magnetFrames.has(button))cancelAnimationFrame(magnetFrames.get(button));magnetFrames.delete(button);button.style.transform=''});
  });
}
const PRODUCT_DESCRIPTION_SEPARATOR='\n<!--7INONE:MORE-->\n';
function productDescriptionParts(product={}){
 const raw=String(product.description||''),separator=PRODUCT_DESCRIPTION_SEPARATOR;
 if(raw.includes(separator)){const index=raw.indexOf(separator);return {short:String(product.short_description||raw.slice(0,index)).trim(),full:raw.slice(index+separator.length).trim()}}
 const legacyMarker='\n<!--MORE-->\n';
 if(raw.includes(legacyMarker)){const index=raw.indexOf(legacyMarker);return {short:String(product.short_description||raw.slice(0,index)).trim(),full:raw.slice(index+legacyMarker.length).trim()}}
 const legacyShort=String(product.short_description||raw.split(/\r?\n/).slice(0,3).join('\n')).trim();
 return {short:Array.from(legacyShort).slice(0,140).join(''),full:raw};
}
function encodeProductDescription(shortDescription,fullDescription){
 const shortText=String(shortDescription||'').trim().slice(0,140);
 const fullText=String(fullDescription||'').trim().slice(0,2000);
 return shortText+PRODUCT_DESCRIPTION_SEPARATOR+fullText;
}
function clampShortDescription(value){
 const lines=String(value||'').replace(/\r/g,'').split('\n').slice(0,3);
 return Array.from(lines.join('\n')).slice(0,140).join('');
}
function updateShortDescriptionCounter(){
 const field=$('productShortDesc'),counter=$('productShortDescCount');if(!field||!counter)return;
 field.value=clampShortDescription(field.value);
 const lineCount=Math.max(1,field.value.split('\n').length);
 counter.textContent=field.value.length+'/140 · '+lineCount+'/3 ជួរ';
}
function markLoadedImages(root=document){
 root.querySelectorAll?.('.img-scan-wrap img').forEach(image=>{if(image.complete&&image.naturalWidth>0)image.closest('.img-scan-wrap')?.classList.add('is-loaded')});
}
function productFormPayload(){const shortDescription=clampShortDescription($('productShortDesc')?.value||'').trim(),fullDescription=String($('productDescription').value||'').trim().slice(0,2000);return {title:$('productTitle').value.trim(),price:Number($('productPrice').value),category:$('productCategory').value,location:$('productLocation').value,condition:$('productCondition').value,short_description:shortDescription,description:encodeProductDescription(shortDescription,fullDescription),stock:1}}

// Setup icons and server-authenticated interface.
$('logoIcon').innerHTML=ic('bag',22);$('searchIcon').innerHTML=ic('search',18);setupEditorialInteractions();$('searchBtn').innerHTML=ic('search',17);$('postIcon').innerHTML=ic('plus',17);$('mobilePostBtn').innerHTML=ic('plus',19);$('bellIcon').innerHTML=ic('bell',18);$('chevronIcon').innerHTML=ic('chev',13);$('menuUserIcon').innerHTML=ic('user',15);$('menuStoreIcon').innerHTML=ic('store',15);$('menuAdminIcon').innerHTML=ic('shield',15);$('menuSaveIcon').innerHTML=ic('heart',15);$('menuLoginIcon').innerHTML=ic('logout',15);$('heroShield').innerHTML=ic('shield',15);$('heroUsers').innerHTML=ic('users',15);$('catAll').innerHTML=ic('grid',15);$('catPhone').innerHTML=ic('phone',15);$('catCar').innerHTML=ic('car',15);$('catHome').innerHTML=ic('home',15);$('catFashion').innerHTML=ic('shirt',15);$('catFurniture').innerHTML=ic('sofa',15);$('emptyIcon').innerHTML=ic('search',25);$('coverCam').innerHTML=ic('camera',14);$('avatarCam').prepend(document.createTextNode(''));$('avatarCam').insertAdjacentHTML('afterbegin',ic('camera',13));$('sellerGateIcon').innerHTML=ic('shield',23);$('kpiListingsIcon').innerHTML=ic('grid',17);$('kpiViewsIcon').innerHTML=ic('eye',17);$('kpiRatingIcon').innerHTML=ic('star',17);$('kpiSalesIcon').innerHTML=ic('wallet',17);$('addProductIcon').innerHTML=ic('plus',14);$('sellerDocThumb').innerHTML=ic('file',23);
$('sellerDocument').addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>8*1024*1024){toast('សូមជ្រើសរើស JPG, PNG ឬ WEBP ទំហំមិនលើស 8MB។','warning');e.target.value='';return}$('sellerDocName').textContent=f.name;$('sellerDocThumb').innerHTML=ic('image',22);$('sellerDocPreview').classList.remove('hidden');if(sellerDocPreviewUrl)URL.revokeObjectURL(sellerDocPreviewUrl);sellerDocPreviewUrl=URL.createObjectURL(f);$('sellerDocPreview').innerHTML='<img src="'+sellerDocPreviewUrl+'" class="max-h-48 w-full object-contain" alt="Preview">'});
$('productImage').setAttribute('multiple','multiple');$('productImage').setAttribute('accept','image/jpeg,image/png,image/webp');$('productImage').addEventListener('change',e=>{const files=Array.from(e.target.files||[]);if(files.length>5||files.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)){toast('សូមជ្រើសរើសរូប JPG, PNG ឬ WEBP មិនលើស 8MB ក្នុងមួយរូប និងអតិបរមា ៥ រូប។','warning');e.target.value='';selectedProductImages=[];$('productImageName').textContent='ជ្រើសរើសរូបភាពផលិតផល';$('productImageThumb').innerHTML=ic('image',21);return}selectedProductImages=files;$('productImageName').textContent=selectedProductImages.length?`${selectedProductImages.length} រូបបានជ្រើសរើស`:'ជ្រើសរើសរូបភាពផលិតផល';if(selectedProductImages[0]){const url=URL.createObjectURL(selectedProductImages[0]);$('productImageThumb').innerHTML=`<img src="${url}" class="h-full w-full object-cover">`}});
$('searchForm').addEventListener('submit',e=>{e.preventDefault();searchTerm=$('searchInput').value.trim();activeCategory=$('searchCategory').value;document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('active',b.dataset.category===activeCategory));void loadProducts();$('view-home').scrollIntoView({behavior:'smooth'})});$('searchInput').addEventListener('input',e=>{searchTerm=e.target.value.trim();clearTimeout(window.searchWait);window.searchWait=setTimeout(()=>void loadProducts(),350)});$('searchCategory').addEventListener('change',e=>setCategory(e.target.value));$('categoryStrip').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b)setCategory(b.dataset.category)});document.querySelectorAll('[data-tag]').forEach(b=>b.addEventListener('click',()=>{searchTerm=b.dataset.tag;$('searchInput').value=searchTerm;void loadProducts()}));$('sortSelect').addEventListener('change',()=>{const sort=$('sortSelect').value;products.sort((a,b)=>sort==='low'?Number(a.price)-Number(b.price):sort==='high'?Number(b.price)-Number(a.price):new Date(b.created_at)-new Date(a.created_at));renderProducts()});$('clearFilters').addEventListener('click',()=>{searchTerm='';activeCategory='all';$('searchInput').value='';$('searchCategory').value='all';setCategory('all')});
$('productGrid').addEventListener('click',event=>{const heart=event.target.closest('[data-action="save"]');if(heart){event.preventDefault();event.stopPropagation();saveAction(heart.dataset.id,heart);return}const store=event.target.closest('[data-action="store"]');if(store){event.preventDefault();event.stopPropagation();void openStorefront(store.dataset.vendorId);return}const view=event.target.closest('[data-action="view"]');if(view)void openProduct(view.dataset.id)});
$('mobileMarketPost')?.addEventListener('click',()=>$('postAdBtn').click());
$('mobileMarketNav')?.addEventListener('click',event=>{const button=event.target.closest('[data-action="mobile-search"]');if(button){$('searchInput').focus();window.scrollTo({top:0,behavior:'smooth'})}});
$('postAdBtn').addEventListener('click',()=>{if(!requireLogin())return;if(!isVerifiedSeller()){openSellerModal();return}renderProductForm()});$('mobilePostBtn').addEventListener('click',()=>$('postAdBtn').click());$('heroPostBtn').addEventListener('click',()=>$('postAdBtn').click());$('profileApplyTop').addEventListener('click',()=>{if(me?.vendor) {profileTab='seller';document.querySelector('[data-profile-tab="seller"]').click()} else openSellerModal()});$('sellerGateApply').addEventListener('click',openSellerModal);$('addProductBtn').addEventListener('click',()=>renderProductForm());
$('notificationBtn').addEventListener('click',e=>{e.stopPropagation();toggleDrop('notificationMenu')});$('profileMenuBtn').addEventListener('click',e=>{e.stopPropagation();toggleDrop('profileMenu')});document.addEventListener('click',e=>{if(!e.target.closest('#profileMenu')&&!e.target.closest('#profileMenuBtn')&&!e.target.closest('#notificationMenu')&&!e.target.closest('#notificationBtn'))closeDropdowns()});document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.action;if(a==='profile')showView('profile');if(a==='seller-dashboard')showView('seller');if(a==='admin')showView('admin');if(a==='saved'){showView('profile');profileTab='saved';document.querySelector('[data-profile-tab="saved"]').click()}if(a==='open-chat')void openSellerChatInbox();if(a==='login')openAuth();if(a==='logout')void (async()=>{try{const {error}=await supabaseClient.auth.signOut();if(error)throw error;session=null;me=null;savedIds.clear();pendingPhone=null;telegramLoginWidgetMounted=false;if($('telegramLoginWidget'))$('telegramLoginWidget').innerHTML='';$('authForm')?.reset();syncHeader();applyMaintenanceUI();showView('home');openAuth('login');toast('បាន Logout និងសម្អាត Session គណនីចាស់រួចរាល់។ សូម Login តាម Telegram ម្តងទៀត។','success')}catch(error){toast('មិនអាច Logout បានទេ៖ '+error.message,'error')}})()}));document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
document.querySelectorAll('[data-auth-mode]').forEach(b=>b.addEventListener('click',()=>setAuthMode(b.dataset.authMode)));
$('authForm').addEventListener('submit',async e=>{e.preventDefault();if(!supabaseClient){toast('មិនអាចភ្ជាប់ Supabase បានទេ។ សូមពិនិត្យ Environment Variables។','error');return}const identity=$('authIdentity').value.trim(),password=$('authPassword').value,name=$('authName').value.trim(),isEmail=identity.includes('@');$('authSubmit').disabled=true;try{if(authMode==='verifyPhone'){if(!pendingPhone)throw new Error('សូមចាប់ផ្តើមចុះឈ្មោះតាមលេខទូរស័ព្ទម្តងទៀត។');const verified=await supabaseClient.auth.verifyOtp({phone:pendingPhone,token:$('authOtp').value.trim(),type:'sms'});if(verified.error)throw verified.error;session=verified.data.session;await loadIdentity();syncHeader();pendingPhone=null;setAuthMode('login');closeModal('authModal');toast('បានផ្ទៀងផ្ទាត់លេខទូរស័ព្ទ និងបើកគណនីរួចរាល់។');return}let result;if(authMode==='register'){if(name.length<2)throw new Error('សូមបញ្ចូលឈ្មោះពេញ។');const credentials={password,options:{data:{display_name:name}}};result=isEmail?await supabaseClient.auth.signUp({...credentials,email:identity}):await supabaseClient.auth.signUp({...credentials,phone:identity});}else{const credentials={password};result=isEmail?await supabaseClient.auth.signInWithPassword({...credentials,email:identity}):await supabaseClient.auth.signInWithPassword({...credentials,phone:identity})}if(result.error)throw result.error;if(authMode==='register'&&!result.data.session){if(!isEmail){pendingPhone=identity;setAuthMode('verifyPhone');toast('បានផ្ញើលេខកូដ SMS ទៅ '+identity+'។ សូមបញ្ចូលលេខកូដដើម្បីបញ្ជាក់គណនី។','warning');return}closeModal('authModal');toast('បានចុះឈ្មោះ។ សូមចុចតំណបញ្ជាក់ក្នុងអ៊ីមែលរបស់អ្នក។','warning');return}session=result.data.session;await loadIdentity();syncHeader();closeModal('authModal');toast(authMode==='register'?'បានបង្កើតគណនីរួចរាល់។':'បានចូលគណនីរួចរាល់។');}catch(err){toast(err.message,'error')}finally{$('authSubmit').disabled=false}});


$('bootstrapAdminTelegramBtn').addEventListener('click',async()=>{const button=$('bootstrapAdminTelegramBtn');button.disabled=true;try{const response=await fetch('/api/auth/telegram/admin-bootstrap',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:$('recoveryEmail').value.trim(),bootstrapKey:$('adminBootstrapKey').value})});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.error||'មិនអាចបង្កើតតំណភ្ជាប់បានទេ។');$('adminTelegramStartLink').href=payload.data.url;$('adminTelegramStartLink').classList.remove('hidden');toast('បានបង្កើតតំណភ្ជាប់ Admin។ សូមបើក Telegram ហើយចុច Start។')}catch(error){toast(error.message,'error')}finally{button.disabled=false}});
$('forgotPasswordBtn').addEventListener('click',()=>{$('authForm').classList.add('hidden');$('telegramRecoveryForm').classList.remove('hidden');$('forgotPasswordBtn').classList.add('hidden');$('authTitle').textContent='សង្គ្រោះ Password តាម Telegram';document.querySelector('#authModal .mb-4.grid')?.classList.add('hidden')});
$('backToLoginBtn').addEventListener('click',()=>{$('telegramRecoveryForm').classList.add('hidden');$('authForm').classList.remove('hidden');$('forgotPasswordBtn').classList.remove('hidden');document.querySelector('#authModal .mb-4.grid')?.classList.remove('hidden');setAuthMode('login')});
$('requestRecoveryOtpBtn').addEventListener('click',async()=>{const button=$('requestRecoveryOtpBtn');button.disabled=true;try{const result=await fetch('/api/auth/telegram/recovery/request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:$('recoveryEmail').value.trim()})});const payload=await result.json().catch(()=>({}));if(!result.ok)throw new Error(payload.error||'មិនអាចស្នើ OTP បានទេ។');toast(payload.message||'សូមពិនិត្យ Telegram របស់អ្នក។','success');$('recoveryOtp').focus()}catch(error){toast(error.message,'error')}finally{button.disabled=false}});
$('telegramRecoveryForm').addEventListener('submit',async e=>{e.preventDefault();const button=$('confirmRecoveryBtn');button.disabled=true;try{const result=await fetch('/api/auth/telegram/recovery/confirm',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:$('recoveryEmail').value.trim(),code:$('recoveryOtp').value.trim(),password:$('recoveryNewPassword').value})});const payload=await result.json().catch(()=>({}));if(!result.ok)throw new Error(payload.error||'មិនអាចសង្គ្រោះគណនីបានទេ។');$('telegramRecoveryForm').reset();toast('បានសង្គ្រោះ Password ជោគជ័យ។ សូមចូលគណនីដោយ Password ថ្មី។');$('backToLoginBtn').click()}catch(error){toast(error.message,'error')}finally{button.disabled=false}});
$('profileForm').addEventListener('submit',async e=>{e.preventDefault();if(!requireLogin())return;try{await api('/api/me',{method:'PATCH',body:JSON.stringify({display_name:$('profileName').value.trim(),phone:$('profilePhone').value.trim(),province:$('profileLocation').value,bio:$('profileBio').value.trim()})});await loadIdentity();syncHeader();toast('បានរក្សាទុកព័ត៌មានគណនីរបស់អ្នក។')}catch(err){toast(err.message,'error')}});
$('connectTelegramBtn').addEventListener('click',async()=>{const button=$('connectTelegramBtn');button.disabled=true;try{const result=await api('/api/me/telegram/connect',{method:'POST',body:'{}'});$('telegramConnectLink').href=result.data.url;$('telegramConnectLink').classList.remove('hidden');$('telegramConnectLink').textContent='បើក Telegram Bot ដើម្បីចុច Start (ផុតកំណត់ ១០ នាទី)';toast('បានបង្កើតតំណភ្ជាប់។ សូមបើក Telegram ហើយចុច Start។','success')}catch(error){toast(error.message,'error')}finally{button.disabled=false}});
$('refreshTelegramStatusBtn').addEventListener('click',()=>void renderTelegramSecurity());
$('sendTelegramOtpBtn').addEventListener('click',async()=>{const button=$('sendTelegramOtpBtn');button.disabled=true;try{await api('/api/me/telegram/password-otp',{method:'POST',body:'{}'});toast('បានផ្ញើ OTP ទៅ Telegram របស់អ្នក។');$('telegramPasswordOtp').focus()}catch(error){toast(error.message,'error')}finally{button.disabled=false}});
$('telegramPasswordForm').addEventListener('submit',async e=>{e.preventDefault();const button=$('changeTelegramPasswordBtn');button.disabled=true;try{await api('/api/me/telegram/change-password',{method:'POST',body:JSON.stringify({code:$('telegramPasswordOtp').value.trim(),password:$('telegramNewPassword').value})});$('telegramPasswordOtp').value='';$('telegramNewPassword').value='';toast('បានប្ដូរ Password ជោគជ័យ។ Bot បានផ្ញើសារជូនដំណឹងទៅ Telegram របស់អ្នក។')}catch(error){toast(error.message,'error')}finally{button.disabled=false}});
async function uploadProfileMedia(file,type){if(!file||!requireLogin())return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024){toast('រូបភាពត្រូវជា JPG, PNG ឬ WEBP និងមិនលើស 8MB។','warning');return}const form=new FormData();form.append('type',type);form.append('file',file);try{const saved=await api('/api/me/media',{method:'POST',body:form});await loadIdentity();syncHeader();if(type==='avatar'){setAvatar($('profileAvatar'),me.profile?.avatar_url||saved.data?.avatar_url,profileName())}else{const cover=$('view-profile').querySelector('.cover');const coverUrl=me.profile?.cover_url||saved.data?.cover_url||'';cover.style.backgroundImage=coverUrl?`linear-gradient(115deg,rgba(15,23,42,.42),rgba(15,23,42,.12)),url("${coverUrl}")`:''}toast('បានរក្សាទុករូបភាពទៅកាន់ Profile ជោគជ័យ។','success')}catch(e){toast(e.message,'error')}}$('avatarUpload').addEventListener('change',e=>void uploadProfileMedia(e.target.files?.[0],'avatar'));$('coverUpload').addEventListener('change',e=>void uploadProfileMedia(e.target.files?.[0],'cover'));
document.querySelectorAll('[data-profile-tab]').forEach(b=>b.addEventListener('click',()=>{profileTab=b.dataset.profileTab;document.querySelectorAll('[data-profile-tab]').forEach(x=>x.classList.toggle('active',x===b));void renderProfileTab()}));document.querySelectorAll('[data-profile-jump]').forEach(b=>b.addEventListener('click',()=>{const tab=document.querySelector('[data-profile-tab="'+b.dataset.profileJump+'"]');tab?.click();$('profileTabContent').scrollIntoView({behavior:'smooth',block:'nearest'})}));$('profileTabContent').addEventListener('click',e=>{const v=e.target.closest('[data-open-product]'),r=e.target.closest('[data-remove-saved]');if(v)void openProduct(v.dataset.openProduct);if(r)saveAction(r.dataset.removeSaved, r)});
$('sellerApplyForm').addEventListener('submit',async e=>{e.preventDefault();if(!requireLogin())return;const file=$('sellerDocument').files?.[0];if(!file){toast('សូមភ្ជាប់ឯកសារផ្ទៀងផ្ទាត់។','warning');return}if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024){toast('រូបភាពត្រូវជា JPG, PNG ឬ WEBP និងមិនលើស 8MB។','warning');return}const form=new FormData();form.append('store_name',$('shopName').value.trim());form.append('contact_phone',$('shopContact').value.trim());form.append('address',$('shopAddress').value.trim());form.append('description','ហាងលក់នៅលើ 7inOne');form.append('document',file);const submit=$('sellerApplyForm').querySelector('button[type="submit"]')||$('sellerApplyForm').querySelector('button:last-child');submit.disabled=true;try{await api('/api/vendors/register',{method:'POST',body:form});await loadIdentity();syncHeader();closeModal('sellerModal');profileTab='seller';showView('profile');toast('បានដាក់ពាក្យរួចរាល់។ កំពុងរង់ចាំ Admin ផ្ទៀងផ្ទាត់។')}catch(err){toast(err.message,'error')}finally{submit.disabled=false}});
$('productShortDesc')?.addEventListener('input',updateShortDescriptionCounter);
$('productShortDesc')?.addEventListener('paste',()=>requestAnimationFrame(updateShortDescriptionCounter));
updateShortDescriptionCounter();
$('productForm').addEventListener('submit',async e=>{e.preventDefault();if(!isVerifiedSeller()){toast('ហាងមិនទាន់បានផ្ទៀងផ្ទាត់ទេ។','warning');return}const id=$('editProductId').value,payload=productFormPayload(),button=$('productForm').querySelector('button[type="submit"]')||$('productForm').querySelector('button:last-child');button.disabled=true;try{let product;if(id){const r=await api('/api/products/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify(payload)});product=r.data}else{const r=await api('/api/products',{method:'POST',body:JSON.stringify(payload)});product=r.data}if(selectedProductImages.length){const form=new FormData();selectedProductImages.forEach(f=>form.append('images',f));await api(`/api/products/${product.id}/images`,{method:'POST',body:form})}closeModal('productFormModal');selectedProductImages=[];toast(id?'បានរក្សាទុកការកែប្រែទំនិញរួចរាល់។':'បានបង្ហោះទំនិញជោគជ័យ! ទំនិញនឹងបង្ហាញលើ Marketplace ភ្លាមៗ។');await renderSeller();await loadProducts()}catch(err){toast(err.message,'error')}finally{button.disabled=false}});
$('sellerProducts').addEventListener('click',async e=>{const b=e.target.closest('[data-seller-action]');if(!b)return;const id=b.dataset.id;try{b.disabled=true;if(b.dataset.sellerAction==='edit'){const p=sellerProductCache.find(x=>String(x.id)===String(id));if(p)renderProductForm(p)}if(b.dataset.sellerAction==='renew'){await api('/api/products/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({renew:true})});toast('បានបន្តសុពលភាពទំនិញ ៧ ថ្ងៃទៀត។','success')}if(b.dataset.sellerAction==='sold'){if(!confirm('សម្គាល់ទំនិញនេះថាលក់រួចមែនទេ?'))return;await api('/api/products/'+id,{method:'PATCH',body:JSON.stringify({status:'sold'})});toast('បានសម្គាល់ថាលក់រួច។')}if(b.dataset.sellerAction==='delete'){if(!confirm('លុបទំនិញនេះមែនទេ?'))return;await api('/api/products/'+id,{method:'DELETE'});toast('បានលុប ឬបិទទំនិញរួចរាល់។')}await renderSeller();await loadProducts()}catch(err){toast(err.message,'error')}finally{b.disabled=false}});
$('sellerDashboardContent').addEventListener('click',e=>{const tab=e.target.closest('[data-seller-tab]');if(tab){setSellerTab(tab.dataset.sellerTab);return}const filter=e.target.closest('[data-seller-filter]');if(filter){sellerActiveFilter=filter.dataset.sellerFilter;document.querySelectorAll('[data-seller-filter]').forEach(x=>x.classList.toggle('is-active',x===filter));renderSellerProductList()}});
$('sellerProductSearch').addEventListener('input',renderSellerProductList);
$('sellerDashboardContent').addEventListener('click',async e=>{const b=e.target.closest('[data-offer-action]');if(!b)return;try{await api('/api/offers/'+b.dataset.id,{method:'PATCH',body:JSON.stringify({status:b.dataset.offerAction})});toast('បានកែប្រែសំណើតថ្លៃ។');await renderSeller()}catch(err){toast(err.message,'error')}});
$('sellerDashboardContent').addEventListener('click',async e=>{const b=e.target.closest('[data-order-status]');if(!b)return;try{await api('/api/vendor/orders/'+encodeURIComponent(b.dataset.orderId),{method:'PATCH',body:JSON.stringify({status:b.dataset.orderStatus})});toast('បានធ្វើបច្ចុប្បន្នភាពការបញ្ជាទិញ។');await renderSeller();await loadOrders()}catch(err){toast(err.message,'error')}});
$('brandingFaviconUpload').addEventListener('change',event=>{
  const file=event.target.files?.[0];if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>2*1024*1024){toast('Favicon ត្រូវជា JPG, PNG ឬ WEBP និងមិនលើស 2MB។','warning');event.target.value='';return}
  if(brandingFaviconPreviewUrl)URL.revokeObjectURL(brandingFaviconPreviewUrl);
  brandingFaviconPreviewUrl=URL.createObjectURL(file);brandingPreviewFavicon(brandingFaviconPreviewUrl);
});
$('brandingLogoUpload').addEventListener('change',event=>{
  const file=event.target.files?.[0];if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>2*1024*1024){toast('Logo ត្រូវជា JPG, PNG ឬ WEBP និងមិនលើស 2MB។','warning');event.target.value='';return}
  if(brandingLogoPreviewUrl)URL.revokeObjectURL(brandingLogoPreviewUrl);
  brandingLogoPreviewUrl=URL.createObjectURL(file);brandingPreviewLogo(brandingLogoPreviewUrl);
});
$('brandingHeroUpload').addEventListener('change',event=>{
  const files=Array.from(event.target.files||[]);
  if(files.length>3||files.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)){
    toast('Banner អាច Upload JPG, PNG ឬ WEBP ចំនួនមិនលើស ៣ រូប និង 8MB ក្នុងមួយរូប។','warning');event.target.value='';return
  }
  brandingHeroPreviewUrls.forEach(url=>URL.revokeObjectURL(url));
  brandingHeroPreviewUrls=files.map(file=>URL.createObjectURL(file));renderBrandingHeroPreviews();
});
['brandTitleInput','brandSubtitleInput','heroBadgeInput','heroTitleInput','heroSubtitleInput'].forEach(id=>$(id).addEventListener('input',updateBrandingTextPreview));
$('saveBrandingBtn').addEventListener('click',async()=>{
  if(!isAdmin()){toast('មុខងារនេះសម្រាប់ Admin ប៉ុណ្ណោះ។','error');return}
  const button=$('saveBrandingBtn'),logo=$('brandingLogoUpload').files?.[0],favicon=$('brandingFaviconUpload').files?.[0],heroFiles=Array.from($('brandingHeroUpload').files||[]);
  if(logo&&(!['image/jpeg','image/png','image/webp'].includes(logo.type)||logo.size>2*1024*1024)){toast('Logo ត្រូវជា JPG, PNG ឬ WEBP និងមិនលើស 2MB។','warning');return}
  if(favicon&&(!['image/jpeg','image/png','image/webp'].includes(favicon.type)||favicon.size>2*1024*1024)){toast('Favicon ត្រូវជា JPG, PNG ឬ WEBP និងមិនលើស 2MB។','warning');return}
  if(heroFiles.length>3||heroFiles.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)){toast('Banner អាច Upload JPG, PNG ឬ WEBP ចំនួនមិនលើស ៣ រូប និង 8MB ក្នុងមួយរូប។','warning');return}
  const form=new FormData();
  form.append('siteTitle',$('brandTitleInput').value.trim());
  form.append('siteSubtitle',$('brandSubtitleInput').value.trim());
  form.append('heroBadge',$('heroBadgeInput').value.trim());
  form.append('heroTitle',$('heroTitleInput').value.trim());
  form.append('heroSubtitle',$('heroSubtitleInput').value.trim());
  form.append('clearHeroImages',$('clearHeroImages').checked?'true':'false');
  if(logo)form.append('logo',logo);
  if(favicon)form.append('favicon',favicon);
  heroFiles.forEach(file=>form.append('heroImages',file));
  button.disabled=true;button.textContent='កំពុងរក្សាទុក...';
  try{
    const result=await api('/api/admin/branding',{method:'PATCH',body:form});
    applySiteBranding(result.data||{});
    $('brandingStatus').textContent='បានរក្សាទុក Brand & Banner ទៅ Database រួចរាល់។';
    $('brandingLogoUpload').value='';$('brandingFaviconUpload').value='';$('brandingHeroUpload').value='';$('clearHeroImages').checked=false;
    if(brandingLogoPreviewUrl){URL.revokeObjectURL(brandingLogoPreviewUrl);brandingLogoPreviewUrl=null}
    if(brandingFaviconPreviewUrl){URL.revokeObjectURL(brandingFaviconPreviewUrl);brandingFaviconPreviewUrl=null}
    brandingHeroPreviewUrls.forEach(url=>URL.revokeObjectURL(url));brandingHeroPreviewUrls=[];
    renderBrandingAdmin();toast('បានរក្សាទុក Brand & Hero Banner ជោគជ័យ។','success');
  }catch(error){toast(error.message,'error')}
  finally{button.disabled=false;button.textContent='រក្សាទុកការកំណត់ Brand & Banner'}
});
$('telegramDiagnosticsBtn').addEventListener('click',()=>void runTelegramDiagnostics());$('saveMaintenanceSettings').addEventListener('click',async()=>{const button=$('saveMaintenanceSettings');button.disabled=true;try{const result=await api('/api/admin/settings',{method:'PATCH',body:JSON.stringify({maintenanceMode:$('maintenanceToggle').checked,maintenanceMessage:$('maintenanceMessageInput').value.trim()||DEFAULT_MAINTENANCE_MESSAGE})});maintenanceMode=result.data.maintenanceMode;maintenanceMessage=result.data.maintenanceMessage;$('maintenanceMessageInput').value=maintenanceMessage;$('maintenanceStatusHint').textContent='ស្ថានភាពបច្ចុប្បន្ន៖ '+(maintenanceMode?'កំពុងអភិវឌ្ឍន៍':'កំពុងដំណើរការ');applyMaintenanceUI();toast('បានរក្សាទុកស្ថានភាពប្រព័ន្ធរួចរាល់។')}catch(error){toast(error.message,'error')}finally{button.disabled=false}});
$('maintenanceAdminLogin').addEventListener('click',event=>{event.preventDefault();openAuth('login')});
$('adminApplications').addEventListener('click',async e=>{const doc=e.target.closest('[data-admin-doc]'),review=e.target.closest('[data-admin-review]');if(doc){const vendor=(window.adminVendors||[]).find(v=>v.id===doc.dataset.adminDoc);if(vendor?.document_url){const preview=window.open('about:blank','_blank');try{const response=await fetch(vendor.document_url,{headers:{Authorization:'Bearer '+session.access_token},cache:'no-store'});if(!response.ok)throw new Error((await response.json().catch(()=>({}))).error||'មិនអាចទាញយកឯកសារបានទេ');const fileUrl=URL.createObjectURL(await response.blob());if(preview)preview.location.href=fileUrl;else window.open(fileUrl,'_blank','noopener,noreferrer');setTimeout(()=>URL.revokeObjectURL(fileUrl),60000)}catch(error){preview?.close();toast(error.message,'error')}}else toast('មិនមានឯកសារដែលអាចបើកបាន។','warning')}if(review){const status=review.dataset.adminReview;if(status==='rejected'&&!confirm('បដិសេធពាក្យស្នើសុំនេះមែនទេ?'))return;try{await api('/api/admin/vendors/'+review.dataset.id,{method:'PATCH',body:JSON.stringify({status,review_note:status==='rejected'?'សូមទាក់ទងក្រុមការងារដើម្បីទទួលព័ត៌មានបន្ថែម។':''})});toast(status==='approved'?'បានអនុម័តអ្នកលក់។':'បានបដិសេធពាក្យស្នើសុំ។');await renderAdmin()}catch(err){toast(err.message,'error')}}});
$('offerForm').addEventListener('submit',async e=>{e.preventDefault();if(!requireLogin()||!currentOfferProduct)return;const amount=Number($('offerAmount').value);if(!Number.isFinite(amount)||amount<=0){toast('សូមបញ្ចូលតម្លៃត្រឹមត្រូវ។','warning');return}try{await api('/api/products/'+currentOfferProduct.id+'/offers',{method:'POST',body:JSON.stringify({offer_price:amount,message:$('offerMessage').value.trim()})});closeModal('offerModal');toast('បានផ្ញើសំណើតថ្លៃទៅអ្នកលក់រួចរាល់។');currentOfferProduct=null}catch(err){toast(err.message,'error')}});
$('notificationList').innerHTML='<p class="py-4 text-center text-[10px] text-slate-400">ការជូនដំណឹងថ្មីៗនឹងបង្ហាញនៅទីនេះ។</p>';
document.querySelectorAll('.close-btn').forEach(b=>b.innerHTML=ic('x',16));document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));document.querySelectorAll('.modal').forEach(m=>m.addEventListener('mousedown',e=>{if(e.target===m)closeModal(m.id)}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.modal.open').forEach(m=>closeModal(m.id));closeDropdowns()}});


function supportChatTime(value){return value?new Date(value).toLocaleString('km-KH',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):''}
function supportChatRenderMessages(targetId,messages){
  const target=$(targetId);if(!target)return;
  if(!messages?.length){target.innerHTML='<p class="py-8 text-center text-xs text-slate-400">មិនទាន់មានសារ។ សូមចាប់ផ្តើមសន្ទនា។</p>';return}
  target.innerHTML=messages.map(m=>'<div class="support-chat-bubble '+(m.sender_role==='admin'?'admin':'user')+'"><div>'+esc(m.body).replace(/\n/g,'<br>')+'</div><time class="support-chat-time">'+esc(supportChatTime(m.created_at))+(m.archived?' · Archive':'')+'</time></div>').join('');
  target.scrollTop=target.scrollHeight;
}
function supportChatRenderArchives(targetId,archives,isAdminView){
  const target=$(targetId);if(!target)return;
  if(!archives?.length){target.innerHTML='';return}
  target.innerHTML=archives.map(a=>'<button type="button" class="support-chat-archive" data-chat-archive="'+esc(a.id)+'" data-chat-admin="'+(isAdminView?'1':'0')+'"><span>📦 '+esc(a.file_name)+' · '+esc(a.message_count)+' សារ</span><span>មើល</span></button>').join('');
}
function playSellerChatNotification(){
  if(sellerChatMuted)return;
  try{const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;const ctx=new AudioContext(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=880;gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.12,ctx.currentTime+.015);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.22);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.23);osc.onended=()=>void ctx.close()}catch(error){console.debug('Chat sound unavailable:',error.message)}
}
function showSellerChatLauncher(){ $('supportChatLauncher')?.classList.remove('hidden'); }
function scrollSellerChatToBottom(smooth=false){
  const target=$('sellerChatMessages');if(!target)return;
  const apply=()=>{target.scrollTop=target.scrollHeight};
  apply();
  requestAnimationFrame(()=>{apply();setTimeout(apply,60)});
}
function renderSellerChatDraftProduct(){
  const banner=$('sellerChatProductBanner');if(!banner)return;
  const p=sellerChatDraftProduct;
  if(!p){
    banner.classList.add('hidden');
    banner.classList.remove('is-closing');
    banner.innerHTML='';
    return;
  }
  const img=productImage(p);
  banner.classList.remove('hidden','is-closing');
  banner.innerHTML=
    '<div class="seller-chat-draft-thumb">'+(img?'<img src="'+esc(img)+'" alt="">':ic('bag',20))+'</div>'+
    '<div class="seller-chat-draft-meta"><small>សួរអំពីផលិតផលនេះ</small><b>'+esc(p.title||'ផលិតផល')+'</b><strong>'+money(p.price)+'</strong></div>'+
    '<button type="button" class="seller-chat-draft-close" data-dismiss-draft-product aria-label="ដកផលិតផលចេញ" title="ដកផលិតផលចេញ">'+ic('x',15)+'</button>';
}
function dismissSellerChatDraftProduct(){
  const banner=$('sellerChatProductBanner');
  if(!banner||banner.classList.contains('hidden')){sellerChatDraftProduct=null;return}
  banner.classList.add('is-closing');
  setTimeout(()=>{sellerChatDraftProduct=null;renderSellerChatDraftProduct()},230);
}
function minimizeSellerChatPanel(){
  const modal=$('sellerChatModal');if(!modal)return;
  modal.classList.remove('open');modal.setAttribute('aria-hidden','true');
  showSellerChatLauncher();
  if(!document.querySelector('.modal.open'))document.body.classList.remove('overflow-hidden');
}
function toggleSellerChatPanel(){
  const modal=$('sellerChatModal');
  if(modal.classList.contains('open')){minimizeSellerChatPanel();return}
  if(sellerChatConversationId){
    modal.classList.add('open');modal.setAttribute('aria-hidden','false');showSellerChatLauncher();
    scrollSellerChatToBottom();
    return;
  }
  void openSellerChatInbox();
}
function openChatProduct(productId){
  if(!productId)return;
  minimizeSellerChatPanel();
  sellerChatConversationId=null;
  if(sellerChatChannel&&supabaseClient){void supabaseClient.removeChannel(sellerChatChannel);sellerChatChannel=null}
  void openProduct(productId);
}
function renderSellerChatMessages(messages,forceScroll=false){
  const target=$('sellerChatMessages');if(!target)return;
  const wasNearBottom=forceScroll||(target.scrollHeight-target.scrollTop-target.clientHeight<110);
  target.innerHTML=(messages||[]).map(message=>{
    const own=message.sender_role===sellerChatMode;
    let content='';
    if(message.message_type==='product'){
      const product=message.product||null;
      const image=product?.image_url?'<img src="'+esc(product.image_url)+'" alt="" loading="lazy">':'<span class="seller-chat-product-placeholder">'+ic('bag',25)+'</span>';
      content='<article class="seller-chat-product-card '+(product?.id?'seller-chat-product-link':'')+'"'+(product?.id?' role="button" tabindex="0" data-chat-product-id="'+esc(product.id)+'" aria-label="មើលផលិតផល '+esc(product.title||'')+'"':'')+'>'+image+'<div class="seller-chat-product-info"><small>ផលិតផលដែលបានសួរ</small><b>'+esc(product?.title||message.body||'ផលិតផល')+'</b>'+(product?'<strong>'+money(product.price)+'</strong>':'<span class="seller-chat-product-unavailable">ផលិតផលនេះមិនមានលក់ទៀតទេ</span>')+'</div></article>';
    }else if(message.message_type==='image'&&(message.telegram_file_id||message.local_image_url)){
      const imageSrc=message.local_image_url||('/api/media/telegram/'+encodeURIComponent(message.telegram_file_id)+'?mime='+encodeURIComponent(message.mime_type||'image/jpeg'));
      content='<a class="seller-chat-image-link" href="'+esc(imageSrc)+'" target="_blank" rel="noopener noreferrer"><img class="seller-chat-image" src="'+esc(imageSrc)+'" alt="រូបភាពក្នុងសារ" loading="lazy"></a>'+(message.upload_state==='pending'?'<span class="seller-chat-voice-status">កំពុងផ្ញើរូបភាព…</span>':'');
    }else{
      content='<p>'+esc(message.body||'').replace(/\n/g,'<br>')+'</p>';
    }
    return '<div class="flex '+(own?'justify-end':'justify-start')+'"><div class="seller-chat-bubble '+(own?'own':'other')+'">'+content+'<small>'+esc(supportChatTime(message.created_at))+'</small></div></div>';
  }).join('')||'<p class="py-8 text-center text-xs text-slate-400">មិនទាន់មានសារទេ។ សូមចាប់ផ្ដើមសន្ទនា។</p>';
  if(wasNearBottom)scrollSellerChatToBottom();
}
function renderSellerChatInbox(){
  const target=$('sellerChatInboxList');if(!target)return;
  const total=sellerChatInbox.reduce((sum,row)=>sum+Number(row.unread_count||0),0),badge=$('sellerChatUnreadBadge');
  badge.textContent=total>99?'99+':String(total);badge.classList.toggle('hidden',!total);
  target.innerHTML=sellerChatInbox.map(chat=>{
    const avatarUrl=chat.other_role==='seller'?chat.vendor?.profile?.avatar_url:chat.buyer?.avatar_url;
    const image=avatarUrl?'<img src="'+esc(avatarUrl)+'" alt="" class="h-11 w-11 shrink-0 rounded-full object-cover">':'<span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400">'+ic('user',20)+'</span>';
    return '<button type="button" data-unified-chat="'+esc(chat.id)+'" class="seller-chat-inbox-item '+(Number(chat.unread_count)>0?'unread ':'')+(sellerChatConversationId===chat.id?'active':'')+'">'+image+'<span class="flex min-w-0 flex-1 flex-col text-left"><b class="truncate text-[10px]">'+esc(chat.other_name||'អ្នកប្រើប្រាស់')+'</b><span class="mt-1 truncate text-[9px] text-slate-500">'+esc(chat.product?.title?'ផលិតផលចុងក្រោយ៖ '+chat.product.title:'សន្ទនាតាមហាង')+'</span><small class="mt-1 truncate text-[8px] text-slate-400">'+esc(chat.last_message_preview||'ចុចដើម្បីបើកសន្ទនា')+'</small></span>'+(Number(chat.unread_count)>0?'<span class="rounded-full bg-emerald-600 px-2 py-1 text-[9px] font-bold text-white">'+Number(chat.unread_count)+'</span>':'')+'</button>';
  }).join('')||'<p class="rounded-xl border border-dashed p-5 text-center text-[10px] text-slate-400">មិនទាន់មានសន្ទនាទេ។ ចូលទៅកាន់ផលិតផល ហើយចុចឆាតជាមួយអ្នកលក់។</p>';
}
async function loadUnifiedSellerChatInbox(){
  if(!session)return;
  if(sellerChatInboxUserId!==session.user.id){sellerChatInboxUserId=session.user.id;sellerChatInboxUnreadSnapshot={};sellerChatInboxInitialized=false}
  try{const result=await api('/api/seller-chat/inbox');sellerChatInbox=result.data||[];const next={};let incoming=false;for(const row of sellerChatInbox){next[row.id]=Number(row.unread_count||0);if(sellerChatInboxInitialized&&next[row.id]>Number(sellerChatInboxUnreadSnapshot[row.id]||0))incoming=true}if(incoming)playSellerChatNotification();sellerChatInboxUnreadSnapshot=next;sellerChatInboxInitialized=true;renderSellerChatInbox()}
  catch(error){console.warn('Unified seller chat inbox failed:',error.message)}
}
async function loadSellerChatPreferences(){
  if(!session)return;
  try{const result=await api('/api/seller-chat/preferences');sellerChatMuted=result.data?.muted===true;const button=$('sellerChatMute');button.innerHTML=(sellerChatMuted?ic('volumeOff',15):ic('volume',15))+' '+(sellerChatMuted?'បើកសំឡេង':'បិទសំឡេង');button.setAttribute('aria-label',sellerChatMuted?'បើកសំឡេង':'បិទសំឡេង');button.setAttribute('title',sellerChatMuted?'បើកសំឡេង':'បិទសំឡេង');button.setAttribute('aria-pressed',String(sellerChatMuted))}
  catch(error){console.warn('Chat preference load failed:',error.message)}
}
async function loadSellerChatConversation(scrollToBottom=false){
  if(!sellerChatConversationId||!session)return;
  const result=await api('/api/seller-chat/conversations/'+encodeURIComponent(sellerChatConversationId));
  const data=result.data||{},conversation=data.conversation||{},messages=data.messages||[];
  sellerChatMode=conversation.current_role==='seller'?'seller':'buyer';
  $('sellerChatTitle').textContent=sellerChatMode==='seller'?(conversation.buyer?.display_name||'អ្នកទិញ'):(conversation.vendor?.store_name||'អ្នកលក់');
  $('sellerChatSubtitle').textContent='សន្ទនាតាមហាង · ឆាតផ្ទាល់';
  const image=$('sellerChatProductImage');
  const otherAvatar=sellerChatMode==='seller'?conversation.buyer?.avatar_url:conversation.vendor?.profile?.avatar_url;
  const otherName=sellerChatMode==='seller'?(conversation.buyer?.display_name||'អ្នកទិញ'):(conversation.vendor?.store_name||'អ្នកលក់');
  image.innerHTML=otherAvatar?'<img src="'+esc(otherAvatar)+'" alt="" class="h-full w-full rounded-full object-cover">':'<span class="grid h-full w-full place-items-center rounded-full bg-slate-100 text-slate-400">'+ic('user',20)+'</span>';
  image.classList.remove('rounded-lg');image.classList.add('rounded-full');image.setAttribute('aria-label',otherName);
  const newest=messages.at(-1);
  if(newest)sellerChatLastMessageId=newest.id;
  sellerChatLoadedMessages=messages;
  const pendingMedia=sellerChatPendingMedia.filter(message=>message.conversation_id===sellerChatConversationId);
  renderSellerChatMessages([...messages,...pendingMedia],scrollToBottom);
  if(scrollToBottom)scrollSellerChatToBottom();
  const isClosed=conversation.status!=='open';
  $('sellerChatForm').classList.toggle('opacity-50',isClosed);
  $('sellerChatInput').disabled=isClosed;
  $('sellerChatChooseImage').disabled=isClosed;
  syncSellerChatComposer();
  $('sellerChatInboxPane').classList.add('mobile-hidden');$('sellerChatBack').classList.remove('hidden');$('sellerChatThread').classList.add('mobile-active');
}
function subscribeSellerChat(conversationId){
  if(sellerChatChannel&&supabaseClient){void supabaseClient.removeChannel(sellerChatChannel);sellerChatChannel=null}
  if(supabaseClient)sellerChatChannel=supabaseClient.channel('7inone-seller-chat-'+conversationId).on('postgres_changes',{event:'INSERT',schema:'public',table:'seller_messages',filter:'conversation_id=eq.'+conversationId},()=>{void loadSellerChatConversation(true).catch(error=>console.warn('Seller chat realtime refresh failed:',error.message));void loadUnifiedSellerChatInbox()}).subscribe(status=>{if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')console.warn('Seller chat realtime unavailable; polling fallback remains active.')});
  if(!sellerChatPollTimer)sellerChatPollTimer=setInterval(()=>{if(sellerChatConversationId&&$('sellerChatModal').classList.contains('open')){void loadSellerChatConversation(false).catch(()=>{});void loadUnifiedSellerChatInbox()}},5000);
}
async function openSellerChat(conversationId,mode,draftProduct=null){
  sellerChatConversationId=conversationId;sellerChatLastMessageId=null;sellerChatLoadedMessages=[];
  sellerChatDraftProduct=draftProduct||null;
  renderSellerChatDraftProduct();
  if(mode)sellerChatMode=mode;
  openModal('sellerChatModal');showSellerChatLauncher();$('sellerChatMessages').innerHTML='<p class="py-8 text-center text-xs text-slate-400">កំពុងផ្ទុកសន្ទនា…</p>';
  await Promise.all([loadUnifiedSellerChatInbox(),loadSellerChatPreferences()]);
  try{
    await loadSellerChatConversation(true);
    await loadUnifiedSellerChatInbox();
    subscribeSellerChat(conversationId);
    renderSellerChatInbox();
    scrollSellerChatToBottom();
    setTimeout(()=>$('sellerChatInput')?.focus(),80);
  }catch(error){toast(error.message,'error')}
}
async function openSellerChatInbox(){
  if(!requireLogin())return;
  sellerChatConversationId=null;sellerChatLastMessageId=null;sellerChatDraftProduct=null;renderSellerChatDraftProduct();
  $('sellerChatInboxPane').classList.remove('mobile-hidden');$('sellerChatThread').classList.remove('mobile-active');$('sellerChatBack').classList.add('hidden');
  openModal('sellerChatModal');showSellerChatLauncher();
  $('sellerChatTitle').textContent='ជ្រើសរើសសន្ទនា';$('sellerChatSubtitle').textContent='សន្ទនាអំពីផលិតផល';$('sellerChatProductImage').innerHTML='<span class="grid h-full w-full place-items-center text-slate-400">'+ic('chat',19)+'</span>';
  $('sellerChatMessages').innerHTML='<p class="py-8 text-center text-xs text-slate-400">ជ្រើសរើសសន្ទនាមួយ ដើម្បីចាប់ផ្ដើម។</p>';
  $('sellerChatForm').classList.add('opacity-50');$('sellerChatInput').disabled=true;$('sellerChatChooseImage').disabled=true;$('sellerChatSend').disabled=true;
  await Promise.all([loadUnifiedSellerChatInbox(),loadSellerChatPreferences()]);
}
async function startBuyerSellerChat(productId){
  if(!requireLogin())return;
  const targetProduct=(currentProduct&&String(currentProduct.id)===String(productId))?currentProduct:products.find(x=>String(x.id)===String(productId));
  try{
    await loadUnifiedSellerChatInbox();
    let existingId=null;
    if(targetProduct?.vendor_id){
      const match=sellerChatInbox.find(c=>String(c.vendor_id||c.vendor?.id)===String(targetProduct.vendor_id));
      if(match)existingId=match.id;
    }
    if(existingId){
      await openSellerChat(existingId,'buyer',targetProduct||null);
      return;
    }
    const result=await api('/api/seller-chat/conversations',{method:'POST',body:JSON.stringify({product_id:productId,attach_product:false})});
    const id=result.data?.id;if(!id)throw new Error('មិនអាចបើកសន្ទនាបានទេ។');
    await openSellerChat(id,'buyer',targetProduct||null);
  }catch(error){toast(error.message,'error')}
}
function syncSellerChatComposer(){
  const input=$('sellerChatInput'),send=$('sellerChatSend');
  if(!input||!send)return;
  send.disabled=input.disabled||(!input.value.trim()&&!sellerChatDraftProduct);
  input.style.height='auto';
  input.style.height=Math.min(110,Math.max(42,input.scrollHeight))+'px';
}

function startMarketplaceRealtime(){
  if(!supabaseClient||productRealtimeChannel)return;
  const queueRefresh=()=>{if(document.hidden){productRealtimePendingRefresh=true;return}clearTimeout(productRealtimeRefreshTimer);productRealtimeRefreshTimer=setTimeout(()=>{if(!document.hidden&&$('view-home')?.classList.contains('active'))void loadProducts()},250)};
  productRealtimeChannel=supabaseClient.channel('7inone-marketplace-products').on('postgres_changes',{event:'*',schema:'public',table:'products'},queueRefresh).on('postgres_changes',{event:'*',schema:'public',table:'product_images'},queueRefresh).subscribe(status=>{
    if(status==='SUBSCRIBED'){if(productRealtimeFallbackTimer){clearInterval(productRealtimeFallbackTimer);productRealtimeFallbackTimer=null}}
    else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED'){if(!productRealtimeFallbackTimer)productRealtimeFallbackTimer=setInterval(()=>{if(!document.hidden&&$('view-home')?.classList.contains('active'))void loadProducts()},8000)}
  });
}

async function loadSupportUserChat(){
  if(!session)return;
  const result=await api('/api/chat');
  const data=result.data||{};
  const restored=Object.values(restoredUserChatArchives).flat();
  supportChatRenderMessages('supportChatMessages',[...restored,...(data.messages||[])]);
  supportChatRenderArchives('supportChatArchives',data.archives||[],false);
}
async function loadSupportAdminChats(){
  if(!isAdmin())return;
  try{
    const result=await api('/api/admin/chats');
    const chats=result.data||[];
    $('adminChatList').innerHTML=chats.map(chat=>'<button type="button" class="admin-chat-item '+(chat.id===activeAdminChatId?'active ':'')+(Number(chat.unread_admin_count)>0?'unread':'')+'" data-admin-chat="'+esc(chat.id)+'"><span class="flex items-center justify-between gap-2"><b class="truncate text-[11px]">'+esc(chat.profiles?.display_name||'អតិថិជន')+'</b>'+(Number(chat.unread_admin_count)>0?'<span class="rounded-full bg-sky-100 px-2 py-0.5 text-[9px] font-bold text-sky-700">'+esc(chat.unread_admin_count)+'</span>':'')+'</span><span class="mt-1 block truncate text-[9px] text-slate-500">'+esc(chat.last_message_preview||'មិនទាន់មានសារ')+'</span><span class="mt-1 block text-[8px] text-slate-400">'+esc(supportChatTime(chat.last_message_at))+'</span></button>').join('')||'<p class="p-4 text-center text-xs text-slate-400">មិនទាន់មានសន្ទនា។</p>';
    if(activeAdminChatId&&!chats.some(x=>x.id===activeAdminChatId))activeAdminChatId=null;
    if(!activeAdminChatId&&chats.length)activeAdminChatId=chats[0].id;
    if(activeAdminChatId)await loadSupportAdminChat();
  }catch(error){console.warn('Admin chat list failed:',error.message);$('adminChatList').innerHTML='<p class="p-4 text-center text-xs text-rose-500">មិនអាចផ្ទុកបញ្ជី Chat បានទេ។</p>'}
}
async function loadSupportAdminChat(){
  if(!isAdmin()||!activeAdminChatId)return;
  try{
    const result=await api('/api/admin/chats/'+encodeURIComponent(activeAdminChatId));
    const data=result.data||{},conv=data.conversation||{};
    $('adminChatTitle').textContent=conv.profiles?.display_name||'អតិថិជន';
    $('adminChatStatus').textContent=conv.status==='closed'?'បានបិទសន្ទនា':'កំពុងសន្ទនា';
    const restored=Object.values(restoredAdminChatArchives).flat();
    supportChatRenderMessages('adminChatMessages',[...restored,...(data.messages||[])]);
    supportChatRenderArchives('adminChatArchives',data.archives||[],true);
  }catch(error){console.warn('Admin chat detail failed:',error.message)}
}
async function restoreSupportChatArchive(archiveId,isAdminView){
  try{
    const path=isAdminView?'/api/admin/chats/'+encodeURIComponent(activeAdminChatId)+'/archives/'+encodeURIComponent(archiveId):'/api/chat/archives/'+encodeURIComponent(archiveId);
    const result=await api(path),messages=result.data?.messages||[];
    if(isAdminView){restoredAdminChatArchives[archiveId]=messages;const current=await api('/api/admin/chats/'+encodeURIComponent(activeAdminChatId));supportChatRenderMessages('adminChatMessages',[...Object.values(restoredAdminChatArchives).flat(),...(current.data?.messages||[])]);}
    else{restoredUserChatArchives[archiveId]=messages;const current=await api('/api/chat');supportChatRenderMessages('supportChatMessages',[...Object.values(restoredUserChatArchives).flat(),...(current.data?.messages||[])]);}
    toast('បានទាញប្រវត្តិឆាតចាស់មកបង្ហាញរួចរាល់។','success');
  }catch(error){toast(error.message,'error')}
}

async function boot(){
  const bootHash=String(window.location.hash||'').replace(/^#/,'');
  const bootParts=bootHash.split('/');
  const bootRoute=bootParts[0]||'';
  let requestedView=['home','profile','seller','admin','product','store'].includes(bootRoute)?bootRoute:(document.documentElement.dataset.initialView||'home');
  let requestedProductId=document.documentElement.dataset.initialProductId||'',requestedStoreId=document.documentElement.dataset.initialStoreId||'';
  try{
    if(!requestedProductId)requestedProductId=sessionStorage.getItem('ecomstore.currentProductId')||'';
    if(!requestedStoreId)requestedStoreId=sessionStorage.getItem('ecomstore.currentStoreId')||'';
    if(!requestedProductId)requestedProductId=bootRoute==='product'?decodeURIComponent(bootParts.slice(1).join('/')):'';
    if(!requestedStoreId)requestedStoreId=bootRoute==='store'?decodeURIComponent(bootParts.slice(1).join('/')):'';
  }catch(error){console.warn('Could not restore saved route:',error)}
  if(bootRoute==='product'&&bootParts.length>1){try{requestedProductId=decodeURIComponent(bootParts.slice(1).join('/'))||requestedProductId}catch{}}
  if(bootRoute==='store'&&bootParts.length>1){try{requestedStoreId=decodeURIComponent(bootParts.slice(1).join('/'))||requestedStoreId}catch{}}
  if(!['home','profile','seller','admin','product','store'].includes(requestedView))requestedView='home';
  // Paint the matching skeleton before config/auth/API work starts.
  if(requestedView==='product'&&$('productDetail')){$('productDetail').setAttribute('aria-busy','true');$('productDetail').innerHTML='<div class="product-detail-skeleton"><div class="skeleton product-detail-skeleton-image"></div><div class="product-detail-skeleton-copy"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div></div>'}
  else if(requestedView==='store'&&$('storefrontContent')){$('storefrontContent').setAttribute('aria-busy','true');$('storefrontContent').innerHTML='<div class="storefront-skeleton"><div class="skeleton storefront-skeleton-profile"></div><div class="storefront-skeleton-grid">'+Array.from({length:10},()=>'<div class="storefront-skeleton-card"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>').join('')+'</div></div>'}
  else if(requestedView==='home'){$('skeletonGrid')?.classList.remove('hidden');$('productGrid')?.classList.add('hidden')}
  // Optimistically activate the requested route before any network/auth work.
  void showView(requestedView,{optimistic:true,deferLoad:true,preserveScroll:true});
  try{
    const cfg=await fetch('/api/config',{cache:'no-store'}).then(r=>r.json());
    maintenanceMode=cfg.maintenanceMode===true;
    maintenanceMessage=String(cfg.maintenanceMessage||DEFAULT_MAINTENANCE_MESSAGE);
    faviconUrl=String(cfg.faviconUrl||'');
    applySiteBranding(cfg);
    if(!siteBrandingRefreshTimer){siteBrandingRefreshTimer=setInterval(()=>void refreshSiteBranding(),60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)void refreshSiteBranding()})}
    if(!cfg.supabaseUrl||!cfg.supabaseAnonKey)throw new Error('Missing Supabase browser configuration');
    if(!window.supabase?.createClient)throw new Error('Supabase browser library failed to load');
    supabaseClient=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
    startMarketplaceRealtime();
    telegramBotUsername=String(cfg.telegramBotUsername||'').replace(/^@/,'');
    if($('authModal')?.classList.contains('open')&&!telegramLoginWidgetMounted)telegramLoginWidgetMounted=mountTelegramWidget('telegramLoginWidget','onTelegramAuth');
    // Subscribe before reading the stored session so INITIAL_SESSION and token events are not missed.
    supabaseClient.auth.onAuthStateChange((event,newSession)=>{
      session=newSession;
      if(event==='INITIAL_SESSION')return;
      Promise.resolve().then(async()=>{
        try{
          if(session){await loadIdentity();try{await loadSaved();await loadOrders()}catch(e){console.warn(e)}}
          else me=null;
          syncHeader();applyMaintenanceUI();
          const current=document.querySelector('.view.active')?.id?.replace('view-','')||'home';
          if((['profile','seller'].includes(current)&&!session)||(current==='admin'&&!me?.isAdmin)||(current==='seller'&&me?.vendor?.status!=='approved'))showView('home',{preserveScroll:true});
        }catch(e){console.warn('Auth state update failed:',e.message);toast(e.message,'error')}
      });
    });
    await refreshSession();
    // Confirm the requested route only after the server has returned the user's role.
    const rawHash=String(window.location.hash||'').replace(/^#/,'');
    const routeParts=rawHash.split('/'),hashRoute=routeParts[0]||'';
    if(hashRoute==='product')requestedProductId=decodeURIComponent(routeParts.slice(1).join('/'))||requestedProductId;else if(hashRoute==='store')requestedStoreId=decodeURIComponent(routeParts.slice(1).join('/'))||requestedStoreId;else if(['home','profile','seller','admin'].includes(hashRoute))requestedView=hashRoute;
    if(hashRoute==='product'||hashRoute==='store')requestedView=hashRoute;
    const routeAllowed=requestedView==='home'||(requestedView==='profile'&&Boolean(session))||(requestedView==='seller'&&Boolean(session)&&me?.vendor?.status==='approved')||(requestedView==='admin'&&Boolean(session)&&Boolean(me?.isAdmin))||(requestedView==='product'&&Boolean(requestedProductId))||(requestedView==='store'&&Boolean(requestedStoreId));
    if(!routeAllowed)requestedView='home';routeAccessReady=true;
    let savedScrollY=0;try{savedScrollY=Math.max(0,Number(sessionStorage.getItem('ecomstore.scrollY')||0))}catch{}
    const pageNavigationId=routeSyncNavigationId;
    const pageTask=requestedView==='product'?openProduct(requestedProductId,{preserveScroll:true,routeSyncNavigationId:pageNavigationId}):requestedView==='store'?openStorefront(requestedStoreId,{preserveScroll:true,routeSyncNavigationId:pageNavigationId}):showView(requestedView,{preserveScroll:true});
    const dataTasks=[pageTask,loadProducts()];if(session)dataTasks.push(Promise.all([loadSaved(),loadOrders(),loadUnifiedSellerChatInbox(),loadSellerChatPreferences()]).catch(e=>console.warn(e)));
    await Promise.all(dataTasks);if(requestedView==='product'&&currentProduct)renderProductDetail();
    if(!sellerInboxPollTimer)sellerInboxPollTimer=setInterval(()=>{if(!document.hidden&&$('view-seller')?.classList.contains('active')&&isVerifiedSeller())void loadUnifiedSellerChatInbox()},7000);
    if(!sellerChatInboxPollTimer)sellerChatInboxPollTimer=setInterval(()=>{if(!document.hidden&&session)void loadUnifiedSellerChatInbox()},12000);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(productRealtimePendingRefresh&&$('view-home')?.classList.contains('active')){productRealtimePendingRefresh=false;void loadProducts()}if($('view-seller')?.classList.contains('active'))void loadUnifiedSellerChatInbox()}});
    document.documentElement.classList.remove('route-restoring');
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(0,savedScrollY)));
  }catch(e){
    routeAccessReady=true;
    console.error(e);
    const keepDetailRoute=['product','store'].includes(requestedView);
    if(!keepDetailRoute)showView('home',{preserveScroll:true});
    else{
      document.querySelectorAll('.view').forEach(view=>view.classList.remove('active'));
      $('view-'+requestedView)?.classList.add('active');
      const target=requestedView==='product'?$('productDetail'):$('storefrontContent');
      if(target){target.removeAttribute('aria-busy');target.innerHTML='<div class="route-load-error"><span>'+ic('alert',24)+'</span><b>មិនអាចទាញយកព័ត៌មានបានទេ</b><p>'+esc(e.message||'សូមព្យាយាមម្ដងទៀត។')+'</p><button type="button" class="brand-gradient" onclick="location.reload()">ព្យាយាមម្ដងទៀត</button></div>'}
    }
    document.documentElement.classList.remove('route-restoring');
    applyMaintenanceUI();
    toast('មិនអាចភ្ជាប់ប្រព័ន្ធគណនីបានទេ៖ '+e.message,'error');
    $('listingSub').textContent='សូមកំណត់ Supabase Auth និង Environment Variables ដើម្បីបើកផ្សារ។';
    $('skeletonGrid').classList.add('hidden');
    if(!keepDetailRoute)$('emptyHome').classList.remove('hidden');
  }
}

$('sellerChatMessages').addEventListener('click',event=>{const card=event.target.closest('[data-chat-product-id]');if(card)openChatProduct(card.dataset.chatProductId)});
$('sellerChatMessages').addEventListener('keydown',event=>{if(event.key!=='Enter'&&event.key!==' ')return;const card=event.target.closest('[data-chat-product-id]');if(card){event.preventDefault();openChatProduct(card.dataset.chatProductId)}});
$('sellerChatProductBanner')?.addEventListener('click',event=>{if(event.target.closest('[data-dismiss-draft-product]')){dismissSellerChatDraftProduct();syncSellerChatComposer()}});
$('sellerChatClose').addEventListener('click',minimizeSellerChatPanel);
$('sellerChatForm').addEventListener('submit',async event=>{
  event.preventDefault();
  const input=$('sellerChatInput'),body=input.value.trim();
  if((!body&&!sellerChatDraftProduct)||!sellerChatConversationId)return;
  const button=$('sellerChatSend');button.disabled=true;
  const draftToAttach=sellerChatDraftProduct;
  try{
    if(draftToAttach){
      await api('/api/seller-chat/conversations/'+encodeURIComponent(sellerChatConversationId)+'/messages',{method:'POST',body:JSON.stringify({product_id:draftToAttach.id,message_type:'product',body:draftToAttach.title||''})}).catch(()=>null);
      sellerChatDraftProduct=null;
      renderSellerChatDraftProduct();
    }
    if(body){
      await api('/api/seller-chat/conversations/'+encodeURIComponent(sellerChatConversationId)+'/messages',{method:'POST',body:JSON.stringify({body})});
    }
    input.value='';
    syncSellerChatComposer();
    await loadSellerChatConversation(true);
    await loadUnifiedSellerChatInbox();
    scrollSellerChatToBottom();
  }catch(error){toast(error.message,'error')}
  finally{button.disabled=false;syncSellerChatComposer()}
});
$('sellerChatInput').addEventListener('keydown',event=>{
  if(event.key==='Enter'&&!event.shiftKey){
    event.preventDefault();
    $('sellerChatForm').requestSubmit();
  }
});
$('sellerDashboardContent').addEventListener('click',event=>{const button=event.target.closest('[data-seller-chat]');if(button)void openSellerChat(button.dataset.sellerChat,'seller')});

$('supportChatLauncher').addEventListener('click',toggleSellerChatPanel);
$('sellerChatInboxRefresh').addEventListener('click',()=>void loadUnifiedSellerChatInbox());
$('sellerChatInboxList').addEventListener('click',event=>{const button=event.target.closest('[data-unified-chat]');if(button)void openSellerChat(button.dataset.unifiedChat)});
$('sellerChatBack').addEventListener('click',()=>{
  $('sellerChatInboxPane').classList.remove('mobile-hidden');
  $('sellerChatThread').classList.remove('mobile-active');
  sellerChatConversationId=null;sellerChatDraftProduct=null;renderSellerChatDraftProduct();
  $('sellerChatTitle').textContent='ជ្រើសរើសសន្ទនា';$('sellerChatSubtitle').textContent='សន្ទនាអំពីផលិតផល';
  $('sellerChatMessages').innerHTML='<p class="py-8 text-center text-xs text-slate-400">ជ្រើសរើសសន្ទនាមួយ ដើម្បីចាប់ផ្ដើម។</p>';
  $('sellerChatForm').classList.add('opacity-50');$('sellerChatInput').disabled=true;$('sellerChatChooseImage').disabled=true;$('sellerChatSend').disabled=true;
});
$('sellerChatMute').addEventListener('click',async()=>{const button=$('sellerChatMute');button.disabled=true;try{const result=await api('/api/seller-chat/preferences',{method:'PUT',body:JSON.stringify({muted:!sellerChatMuted})});sellerChatMuted=result.data.muted;await loadSellerChatPreferences()}catch(error){toast(error.message,'error')}finally{button.disabled=false}});
$('sellerChatChooseImage').addEventListener('click',()=>{if(sellerChatConversationId&&!$('sellerChatChooseImage').disabled)$('sellerChatImageInput').click()});
$('sellerChatImageInput').addEventListener('change',async event=>{
  const file=event.target.files?.[0];event.target.value='';if(!file||!sellerChatConversationId)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024){toast('សូមជ្រើសរើសរូប JPG, PNG ឬ WEBP ទំហំមិនលើស 8MB។','warning');return}
  const conversationId=sellerChatConversationId,localUrl=URL.createObjectURL(file);
  const draftToAttach=sellerChatDraftProduct;
  const pending={id:'local-image-'+Date.now(),conversation_id:conversationId,sender_id:session.user.id,sender_role:sellerChatMode,message_type:'image',local_image_url:localUrl,mime_type:file.type,created_at:new Date().toISOString(),upload_state:'pending'};
  sellerChatPendingMedia.push(pending);
  renderSellerChatMessages([...sellerChatLoadedMessages,...sellerChatPendingMedia.filter(x=>x.conversation_id===conversationId)],true);
  const form=new FormData();form.append('image',file,file.name||'chat-image');
  const button=$('sellerChatChooseImage');button.disabled=true;
  try{
    if(draftToAttach){
      await api('/api/seller-chat/conversations/'+encodeURIComponent(conversationId)+'/messages',{method:'POST',body:JSON.stringify({product_id:draftToAttach.id,message_type:'product',body:draftToAttach.title||''})}).catch(()=>null);
      sellerChatDraftProduct=null;renderSellerChatDraftProduct();
    }
    await api('/api/seller-chat/conversations/'+encodeURIComponent(conversationId)+'/image',{method:'POST',body:form});
  }catch(error){toast(error.message,'error')}
  finally{
    sellerChatPendingMedia=sellerChatPendingMedia.filter(x=>x.id!==pending.id);
    URL.revokeObjectURL(localUrl);
    if(sellerChatConversationId===conversationId){
      await loadSellerChatConversation(true).catch(()=>{});
      await loadUnifiedSellerChatInbox().catch(()=>{});
      scrollSellerChatToBottom();
    }
    button.disabled=false;
  }
});
$('sellerChatInput').addEventListener('input',syncSellerChatComposer);
syncSellerChatComposer();
$('supportChatClose').addEventListener('click',()=>$('supportChatPanel').classList.add('hidden'));
$('supportChatForm').addEventListener('submit',async event=>{
  event.preventDefault();const input=$('supportChatInput'),body=input.value.trim();if(!body)return;
  const button=$('supportChatForm').querySelector('button[type="submit"]');button.disabled=true;
  try{await api('/api/chat/messages',{method:'POST',body:JSON.stringify({body})});input.value='';await loadSupportUserChat();}
  catch(error){toast(error.message,'error')}finally{button.disabled=false}
});
$('supportChatArchives').addEventListener('click',event=>{const button=event.target.closest('[data-chat-archive]');if(button)void restoreSupportChatArchive(button.dataset.chatArchive,false)});
$('adminChatList').addEventListener('click',event=>{
  const button=event.target.closest('[data-admin-chat]');if(!button)return;
  activeAdminChatId=button.dataset.adminChat;restoredAdminChatArchives={};void loadSupportAdminChats();
});
$('refreshAdminChats').addEventListener('click',()=>void loadSupportAdminChats());
$('adminChatForm').addEventListener('submit',async event=>{
  event.preventDefault();if(!activeAdminChatId)return;
  const input=$('adminChatInput'),body=input.value.trim();if(!body)return;
  const button=$('adminChatForm').querySelector('button[type="submit"]');button.disabled=true;
  try{await api('/api/admin/chats/'+encodeURIComponent(activeAdminChatId)+'/messages',{method:'POST',body:JSON.stringify({body})});input.value='';await loadSupportAdminChat();await loadSupportAdminChats();}
  catch(error){toast(error.message,'error')}finally{button.disabled=false}
});
$('adminChatArchives').addEventListener('click',event=>{const button=event.target.closest('[data-chat-archive]');if(button)void restoreSupportChatArchive(button.dataset.chatArchive,true)});
if(!adminChatPollTimer)adminChatPollTimer=setInterval(()=>{if(isAdmin()&&$('view-admin').classList.contains('active'))void loadSupportAdminChats()},5000);

function syncRouteFromHistory(){
 const eventKey=String(window.location.hash||'')+'|'+JSON.stringify(window.history.state||{});
 if(routeSyncGuardKey===eventKey)return;
 routeSyncGuardKey=eventKey;
 const navigationId=++routeSyncNavigationId;
 if(routeSyncGuardTimer)window.clearTimeout(routeSyncGuardTimer);
 routeSyncGuardTimer=window.setTimeout(()=>{if(routeSyncGuardKey===eventKey)routeSyncGuardKey=''},0);
 const raw=String(window.location.hash||'').replace(/^#/,'');const parts=raw.split('/'),name=parts[0]||'home';
 const productId=name==='product'?(decodeURIComponent(parts.slice(1).join('/'))||(()=>{try{return sessionStorage.getItem('ecomstore.currentProductId')||''}catch{return ''}})()):'';
 const storeId=name==='store'?(decodeURIComponent(parts.slice(1).join('/'))||(()=>{try{return sessionStorage.getItem('ecomstore.currentStoreId')||''}catch{return ''}})()):'';
 const route=['home','profile','seller','admin','product','store'].includes(name)?name:'home',active=document.querySelector('.view.active')?.id?.replace('view-','');
 if(!routeAccessReady){void showView(route,{optimistic:true,deferLoad:true,preserveScroll:true});return}
 if(route==='product'&&productId&&(active!=='product'||String(currentProduct?.id)!==String(productId))){void openProduct(productId,{preserveScroll:true,routeSyncNavigationId:navigationId});return}
 if(route==='store'&&storeId&&(active!=='store'||String(currentStoreId)!==String(storeId))){void openStorefront(storeId,{preserveScroll:true,routeSyncNavigationId:navigationId});return}
 if(active===route)return;void showView(route,{fromHistory:true,preserveScroll:true});
}

window.addEventListener('hashchange',syncRouteFromHistory);
window.addEventListener('popstate',syncRouteFromHistory);
window.addEventListener('scroll',()=>{if(scrollSaveTimer)window.clearTimeout(scrollSaveTimer);scrollSaveTimer=window.setTimeout(()=>{try{sessionStorage.setItem('ecomstore.scrollY',String(window.scrollY))}catch{}},140)},{passive:true});
window.addEventListener('pagehide',()=>{try{sessionStorage.setItem('ecomstore.scrollY',String(window.scrollY))}catch{}});
$('productLightboxClose')?.addEventListener('click',closeProductLightbox);$('productLightbox')?.addEventListener('click',event=>{if(event.target.id==='productLightbox')closeProductLightbox()});
$('productLightboxPrev')?.addEventListener('click',()=>{const count=(currentProduct?.product_images||[]).filter(item=>item.image_url).length;if(count){productGalleryIndex=(productGalleryIndex-1+count)%count;updateProductLightbox();const img=$('productMainImage');if(img)img.src=$('productLightboxImage').src;$('productDetail').querySelectorAll('[data-image]').forEach(button=>button.classList.toggle('active',Number(button.dataset.image)===productGalleryIndex));const counter=$('productDetail').querySelector('.product-gallery-counter');if(counter)counter.textContent=(productGalleryIndex+1)+' / '+count}});
$('productLightboxNext')?.addEventListener('click',()=>{const count=(currentProduct?.product_images||[]).filter(item=>item.image_url).length;if(count){productGalleryIndex=(productGalleryIndex+1)%count;updateProductLightbox();const img=$('productMainImage');if(img)img.src=$('productLightboxImage').src;$('productDetail').querySelectorAll('[data-image]').forEach(button=>button.classList.toggle('active',Number(button.dataset.image)===productGalleryIndex));const counter=$('productDetail').querySelector('.product-gallery-counter');if(counter)counter.textContent=(productGalleryIndex+1)+' / '+count}});
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&productLightboxOpen)closeProductLightbox();if(productLightboxOpen&&event.key==='ArrowLeft')$('productLightboxPrev')?.click();if(productLightboxOpen&&event.key==='ArrowRight')$('productLightboxNext')?.click()});

// Delegated image lifecycle: fade images in after load and stop shimmer on failures.
document.addEventListener('load',event=>{
  const image=event.target;
  if(!(image instanceof HTMLImageElement))return;
  const wrapper=image.closest('.img-scan-wrap');
  if(wrapper)wrapper.classList.add('is-loaded');
},true);
document.addEventListener('error',event=>{
  const image=event.target;
  if(!(image instanceof HTMLImageElement))return;
  const wrapper=image.closest('.img-scan-wrap');
  if(wrapper){wrapper.classList.add('is-failed');if(image.hasAttribute('data-vendor-avatar-image'))wrapper.innerHTML=avatarFallbackMarkup(wrapper.dataset.vendorAvatar||'អ្នកលក់');else if(image.closest('.hero-image-tile'))image.classList.add('hidden');else{image.remove();if(!wrapper.querySelector('svg'))wrapper.insertAdjacentHTML('beforeend',ic('image',24))}}
},true);

// Deliberately no magnetic or 3D tilt effects in the minimalist marketplace UI.
void boot();
