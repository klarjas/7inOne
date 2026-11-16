// 7inOne production frontend: Supabase Auth + authenticated server API.
const iconPaths={
 bag:'<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',plus:'<path d="M12 5v14M5 12h14"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',chev:'<path d="m7 10 5 5 5-5"/>',x:'<path d="m18 6-12 12M6 6l12 12"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',check:'<path d="m5 12 4 4L19 6"/>',chat:'<path d="M21 11.5a8.5 8.5 0 0 1-9 8.5 9.7 9.7 0 0 1-4-.8L3 21l1.8-4.5A8.2 8.2 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z"/>',tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1"/>',arrow:'<path d="M5 12h14m-7-7 7 7-7 7"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',car:'<path d="m5 17-1 2v2h2v-2h12v2h2v-2l-1-2"/><path d="m4 17 1.5-6h13L20 17M7 11l1.5-4h7L17 11M7 17h.01M17 17h.01"/>',home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1Z"/>',shirt:'<path d="m16 4 5 3-3 4-2-1v10H8V10l-2 1-3-4 5-3 2 2h4z"/>',sofa:'<path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M3 12a2 2 0 0 1 4 0v3h10v-3a2 2 0 0 1 4 0v5H3zM5 17v3m14-3v3"/>',user:'<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',camera:'<path d="M14 5 12.5 3h-5L6 5H3v14h18V5z"/><circle cx="12" cy="12" r="3.5"/>',image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',star:'<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',store:'<path d="M3 10h18l-1 11H4L3 10Z"/><path d="m3 10 2-7h14l2 7M8 10v3m8-3v3"/>',wallet:'<path d="M4 6h15a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"/><path d="M21 11h-5a2 2 0 0 0 0 4h5"/>',file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',trash:'<path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6m4 4v7m6-7v7"/>',edit:'<path d="m16 4 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z"/>',checkcircle:'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',logout:'<path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',spark:'<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2Z"/>',bookmark:'<path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4z"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',chart:'<path d="M3 3v18h18M8 15l4-4 3 3 6-7"/>',briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18m-11 0v2h4v-2"/>'
};
const $=id=>document.getElementById(id);
const ic=(name,size=17,extra='')=>`<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="${extra}">${iconPaths[name]||iconPaths.spark}</svg>`;
const CAT={phones:'ទូរស័ព្ទ & អេឡិចត្រូនិក',vehicles:'រថយន្ត & ម៉ូតូ',property:'អចលនទ្រព្យ',fashion:'សម្លៀកបំពាក់',furniture:'គ្រឿងសង្ហារិម'};
const CATICON={all:'grid',phones:'phone',vehicles:'car',property:'home',fashion:'shirt',furniture:'sofa'};
let currentStoreId=null,currentStoreData=null,currentStoreProducts=[],currentStoreCategory='all',currentStoreSearch='';
let siteBranding={siteTitle:'7inOne',siteSubtitle:'ផ្សារទិញលក់កម្ពុជា',heroBadge:'ផ្សារអនឡាញសម្រាប់អ្នកទាំងអស់គ្នា',heroTitle:'ទិញលក់ងាយៗ នៅជិតអ្នក',heroSubtitle:'ស្វែងរកទំនិញដែលអ្នកស្រឡាញ់ ឬដាក់លក់របស់ដែលអ្នកមិនប្រើ។ ភ្ជាប់អ្នកទិញ និងអ្នកលក់នៅទូទាំងប្រទេសកម្ពុជា។',siteLogoUrl:'',heroImages:[]},brandingLogoPreviewUrl=null,brandingHeroPreviewUrls=[],siteBrandingRefreshTimer=null;
let supabaseClient=null,session=null,sessionRefreshPromise=null,me=null,routeAccessReady=false,supportChatPollTimer=null,adminChatPollTimer=null,activeAdminChatId=null,restoredUserChatArchives={},restoredAdminChatArchives={},pendingPhone=null,products=[],savedIds=new Set(),favoritePending=new Set(),activeCategory='all',searchTerm='',currentProduct=null,currentVendor=null,profileTab='saved',authMode='login',currentOfferProduct=null,selectedProductImages=[],sellerDocPreviewUrl=null,telegramBotUsername='',telegramLoginWidgetMounted=false,telegramProfileWidgetMounted=false,productRealtimeChannel=null,productRealtimeRefreshTimer=null,productRealtimeFallbackTimer=null,productRealtimePendingRefresh=false,sellerChatChannel=null,sellerChatPollTimer=null,sellerInboxPollTimer=null,sellerChatConversationId=null,sellerChatInboxPollTimer=null,sellerChatMode='buyer',sellerChatInbox=[],sellerChatMuted=false,sellerChatRecorder=null,sellerChatDiscardRecording=false,sellerChatRecordChunks=[],sellerChatRecordStartedAt=0,sellerChatRecordTimer=null,sellerChatLastMessageId=null,sellerChatInboxUnreadSnapshot={},sellerChatInboxInitialized=false,sellerChatInboxUserId=null,sellerChatAudioUrls=new Set();
const DEFAULT_MAINTENANCE_MESSAGE='ប្រព័ន្ធកំពុងធ្វើការអភិវឌ្ឍន៍ និងបន្ថែមមុខងារថ្មីៗ សូមអធ្យាស្រ័យចំពោះការរំខាន!';let maintenanceMode=false,maintenanceMessage=DEFAULT_MAINTENANCE_MESSAGE,faviconUrl='';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>'$'+Number(v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2});
const fmtDate=v=>v?new Date(v).toLocaleDateString('km-KH',{year:'numeric',month:'short',day:'numeric'}):'—';
const verifiedBadge=()=>`<span class="verified">${ic('check',11)} អ្នកលក់បានផ្ទៀងផ្ទាត់</span>`;
function toast(message,type='success'){const area=$('toastArea');area.innerHTML='';const el=document.createElement('div');el.className='toast pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 text-[11px] font-semibold shadow-xl '+(type==='error'?'border-rose-200 bg-rose-50 text-rose-700':type==='warning'?'border-amber-200 bg-amber-50 text-amber-800':'border-slate-800 bg-slate-900 text-white');el.innerHTML=`<span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/10">${ic(type==='error'?'x':'check',15)}</span><span class="flex-1">${esc(message)}</span><button aria-label="បិទ">${ic('x',14)}</button>`;el.querySelector('button').onclick=()=>el.remove();area.appendChild(el);setTimeout(()=>el.remove(),3000)}
function openModal(id){closeDropdowns();$(id).classList.add('open');$(id).setAttribute('aria-hidden','false');document.body.classList.add('overflow-hidden')}
function closeModal(id){const el=$(id);if(!el)return;if(id==='sellerChatModal'&&sellerChatRecorder?.state==='recording'){sellerChatDiscardRecording=true;sellerChatRecorder.stop()}el.classList.remove('open');el.setAttribute('aria-hidden','true');if(!document.querySelector('.modal.open'))document.body.classList.remove('overflow-hidden')}
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
  $('view-'+name)?.classList.add('active');
  document.documentElement.dataset.initialView=name;
  try{sessionStorage.setItem('ecomstore.activeView',name)}catch(error){console.warn('Could not save active page:',error)}
  if(window.location.hash!=='#'+name){try{window.location.hash='#'+name}catch(error){console.warn('Could not update route hash:',error)}}
  closeDropdowns();
  if(!options.preserveScroll)window.scrollTo({top:0,behavior:'smooth'});
  const tasks=[];
  if(!options.deferLoad){
    if(name==='profile')tasks.push(renderProfile());
    if(name==='seller')tasks.push(renderSeller());
    if(name==='admin'){tasks.push(renderAdmin());tasks.push(loadSupportAdminChats())}
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
  return '<div class="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-emerald-50" data-vendor-avatar="'+label+'"><img src="'+esc(url)+'" alt="'+label+'" class="vendor-avatar-image h-full w-full object-cover" data-vendor-avatar-image></div>';
}
function setAvatar(target,url,name=''){
  if(!target)return;
  const fallback=()=>{target.innerHTML=avatarFallbackMarkup(name)};
  if(!url){fallback();return}
  target.innerHTML='<img src="'+esc(url)+'" alt="" class="h-full w-full object-cover">';
  target.querySelector('img')?.addEventListener('error',fallback,{once:true});
}
function applySiteBranding(data={}){
  siteBranding={...siteBranding,...data};
  const title=String(siteBranding.siteTitle||'7inOne');
  const subtitle=String(siteBranding.siteSubtitle||'ផ្សារទិញលក់កម្ពុជា');
  const logo=String(siteBranding.siteLogoUrl||siteBranding.faviconUrl||'');
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
  if(logo)applyFavicon(logo);
  const textMap=[['heroBadge','heroBadge'],['heroTitle','heroTitle'],['heroSubtitle','heroSubtitle']];
  for(const [id,key] of textMap)if($(id))$(id).textContent=String(siteBranding[key]||'');
  const images=Array.isArray(siteBranding.heroImages)?siteBranding.heroImages.slice(0,3):[];
  for(let i=1;i<=3;i++){
    const target=$('heroImage'+i),item=images[i-1],url=item?.url||item?.image_url||item?.imageUrl||'';
    if(!target)continue;
    if(url){target.src=url;target.classList.remove('hidden');target.onerror=()=>{target.classList.add('hidden')}}
    else{target.removeAttribute('src');target.classList.add('hidden')}
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
async function loadProducts(){const grid=$('productGrid');grid.setAttribute('aria-busy','true');grid.classList.add('hidden');$('emptyHome').classList.add('hidden');$('skeletonGrid').classList.remove('hidden');const params=new URLSearchParams({page:'1',limit:'50'});if(searchTerm)params.set('q',searchTerm);if(activeCategory!=='all')params.set('category',activeCategory);try{const res=await api('/api/products?'+params.toString());products=res.data||[];renderProducts();}catch(error){products=[];renderProducts();toast('មិនអាចទាញយកទំនិញបានទេ៖ '+error.message,'error')}finally{$('skeletonGrid').classList.add('hidden');grid.classList.remove('hidden');grid.setAttribute('aria-busy','false')}}
function productImage(p){return p.product_images?.find(x=>x.image_url)?.image_url||''}
function productCard(p,index){const images=(p.product_images||[]).filter(x=>x.image_url),image=images[0]?.image_url||'',second=images[1]?.image_url||'',saved=savedIds.has(p.id),vendorName=p.vendors?.store_name||'ហាងអ្នកលក់',verified=p.vendors?.status==='approved';return `<article class="product-card group overflow-hidden rounded-2xl border border-slate-200 bg-white" style="animation-delay:${Math.min(index,12)*35}ms"><div class="product-card-media relative aspect-[1.18] overflow-hidden bg-slate-100"><button class="absolute inset-0 z-[1] h-full w-full" data-action="view" data-id="${esc(p.id)}" aria-label="មើល ${esc(p.title)}"></button>${image?`<img src="${esc(image)}" alt="${esc(p.title)}" loading="lazy" class="product-img product-img-primary h-full w-full object-cover">${second?`<img src="${esc(second)}" alt="" loading="lazy" class="product-img product-img-secondary h-full w-full object-cover">`:''}`:`<div class="absolute inset-0 grid place-items-center text-slate-400">${ic('image',36)}</div>`}<span class="product-image-count">${images.length||0} រូប</span><span class="absolute left-2.5 top-2.5 z-[2] rounded-md bg-white/95 px-2 py-1 text-[9px] font-semibold text-slate-700">${esc(p.condition||'ទំនិញ')}</span><button type="button" class="heart ${saved?'saved':''} absolute right-2.5 top-2.5 z-[3] grid h-9 w-9 place-items-center rounded-full bg-white/95 text-slate-600 shadow-sm" data-action="save" data-id="${esc(p.id)}" aria-label="${saved?'ដកចេញពីបញ្ជីដែលបានរក្សាទុក':'រក្សាទុកទំនិញ'}" aria-pressed="${saved?'true':'false'}" aria-busy="false">${ic('heart',17)}</button></div><div class="p-3 sm:p-3.5"><button class="block min-h-[24px] w-full truncate text-left text-[12px] font-bold leading-5 text-slate-900 hover:text-slate-600 sm:text-[13px]" data-action="view" data-id="${esc(p.id)}">${esc(p.title)}</button><p class="product-card-description mt-1.5 text-[10px] leading-5 text-slate-500">${esc(p.description||'មិនទាន់មានការពិពណ៌នាបន្ថែម។')}</p><div class="mt-3 flex flex-wrap items-center justify-between gap-2"><b class="text-[17px] font-bold text-red-600">${money(p.price)}</b><span class="flex min-w-0 items-center gap-1 text-[10px] text-slate-500">${ic('pin',12)}<span class="truncate">${esc(p.location||'មិនទាន់កំណត់')}</span></span></div><div class="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3"><span class="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 text-slate-500">${ic('store',14)}</span><button type="button" class="min-w-0 truncate text-left text-[10px] font-semibold text-slate-700 hover:underline" data-action="store" data-vendor-id="${esc(p.vendor_id)}">${esc(vendorName)}</button>${verified?`<span class="verified-mark" title="បានផ្ទៀងផ្ទាត់">${ic('check',11)}</span>`:''}</div></div></article>`}
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
  button.innerHTML=ic('heart',14,'inline')+' '+(saved?'បានរក្សាទុក':'រក្សាទុក');
  button.classList.toggle('text-blue-600',saved);
  button.classList.toggle('text-indigo-700',!saved);
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
async function openProduct(id){try{if(session){try{await loadOrders()}catch(e){console.warn(e)}}const result=await api('/api/products/'+encodeURIComponent(id));currentProduct=result.data;const trust=await api('/api/vendors/'+encodeURIComponent(currentProduct.vendor_id)+'/ratings');currentVendor=trust.data;await showView('product')}catch(e){toast(e.message,'error')}}
function renderProductDetail(){const p=currentProduct,v=currentVendor;if(!p||!v)return;const images=(p.product_images||[]).filter(i=>i.image_url);const canReview=(window.myOrders||[]).filter(o=>o.status==='completed'&&(o.order_items||[]).some(i=>i.vendor_id===p.vendor_id&&i.fulfillment_status==='completed'));$('productDetail').innerHTML=`<div class="grid lg:grid-cols-[minmax(0,1fr)_380px]"><div class="relative min-h-[260px] bg-slate-100 md:min-h-[540px]">${images.length?`<img src="${esc(images[0].image_url)}" class="product-main-image absolute inset-0 h-full w-full object-cover" alt="${esc(p.title)}">`:`<div class="absolute inset-0 grid place-items-center text-slate-300">${ic('image',54)}</div>`}<span class="absolute bottom-4 left-4 rounded-lg bg-white/95 px-3 py-1.5 text-[10px] font-bold text-slate-600">${esc(p.condition||'')}</span>${images.length>1?`<div class="absolute bottom-4 right-4 flex gap-1">${images.map((im,i)=>`<button class="h-12 w-12 overflow-hidden rounded-lg border-2 ${i===0?'border-indigo-500':'border-white'}" data-image="${i}"><img class="h-full w-full object-cover" src="${esc(im.image_url)}"></button>`).join('')}</div>`:''}</div><div class="p-5 sm:p-7"><p class="text-[10px] font-bold text-indigo-600">${esc(CAT[p.category]||p.category)}</p><h2 class="mt-2 pr-8 text-xl font-bold leading-8">${esc(p.title)}</h2><div class="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-400"><span>${ic('pin',12,'inline')} ${esc(p.location||'')}</span><span>${ic('clock',12,'inline')} ${fmtDate(p.created_at)}</span><span>${ic('eye',12,'inline')} ${Number(p.view_count||0).toLocaleString()} views</span></div><p class="mt-5 text-[28px] font-bold text-emerald-600">${money(p.price)}</p><div class="my-5 border-t border-slate-100"></div><p class="text-[12px] font-bold">ព័ត៌មានអំពីទំនិញ</p><p class="mt-2 whitespace-pre-line text-[11px] leading-7 text-slate-500">${esc(p.description||'មិនទាន់មានការពិពណ៌នា។')}</p><div class="product-safety-note my-4 rounded-xl border border-slate-200 bg-slate-50 p-3"><b class="block text-[11px] text-slate-800">គន្លឹះសុវត្ថិភាព</b><p class="mt-1 text-[10px] leading-5 text-slate-600">ពិនិត្យទំនិញ និងព័ត៌មានអ្នកលក់ឱ្យបានច្បាស់ មុនពេលទូទាត់។ ជៀសវាងផ្ញើប្រាក់កក់ទៅគណនីដែលមិនអាចផ្ទៀងផ្ទាត់បាន។</p></div><div class="my-5 rounded-2xl border border-slate-100 bg-slate-50 p-3"><div class="flex items-center gap-3">${avatarMarkup(v.store_name,v.profile?.avatar_url)}<div class="min-w-0 flex-1"><p class="flex flex-wrap items-center gap-2 text-[12px] font-bold">${esc(v.store_name)} ${verifiedBadge()}</p><p class="mt-1 text-[10px] text-slate-500">${renderStars(v.rating)} ${v.rating??'គ្មានការវាយតម្លៃ'} · ${v.review_count} reviews</p></div></div><div class="mt-3 grid grid-cols-3 gap-2 text-center"><div class="rounded-xl bg-white p-2"><b class="block text-sm">${v.active_listings}</b><small class="text-[9px] text-slate-400">ទំនិញលក់</small></div><div class="rounded-xl bg-white p-2"><b class="block text-sm">${v.total_views}</b><small class="text-[9px] text-slate-400">អ្នកមើល</small></div><div class="rounded-xl bg-white p-2"><b class="block text-sm">${v.review_count}</b><small class="text-[9px] text-slate-400">ការវាយតម្លៃ</small></div></div><div class="mt-4 space-y-1.5">${[5,4,3,2,1].map(star=>{const amount=Number(v.distribution?.[star-1]||0),width=v.review_count?amount/Number(v.review_count)*100:0;return `<div class="flex items-center gap-2 text-[9px]"><span class="w-8 shrink-0 text-slate-500">${star} ★</span><div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"><div class="h-full rounded-full bg-amber-400" style="width:${width}%"></div></div><span class="w-5 text-right text-slate-400">${amount}</span></div>`}).join('')}</div></div><div class="grid grid-cols-2 gap-2"><button type="button" class="rounded-xl border border-indigo-200 bg-indigo-50 py-3 text-[11px] font-bold text-indigo-700" data-product-action="save" aria-pressed="${savedIds.has(p.id)?'true':'false'}">${ic('heart',14,'inline')} ${savedIds.has(p.id)?'បានរក្សាទុក':'រក្សាទុក'}</button><button class="brand-gradient rounded-xl py-3 text-[11px] font-bold text-white" data-product-action="offer">${ic('tag',14,'inline')} តថ្លៃជាមួយអ្នកលក់</button></div><button type="button" class="mt-2 w-full rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-[11px] font-bold text-emerald-800" data-product-action="chat">✉ ឆាតផ្ទាល់ជាមួយអ្នកលក់</button><div class="mt-5 border-t border-slate-100 pt-4"><div class="flex items-center justify-between"><h3 class="text-[12px] font-bold">ការវាយតម្លៃអ្នកទិញ</h3><span class="text-[10px] text-slate-400">${v.review_count} Reviews</span></div><div class="mt-3 space-y-3">${(v.reviews||[]).slice(0,4).map(r=>`<div class="rounded-xl bg-slate-50 p-3"><div class="flex items-center justify-between"><b class="text-[10px]">${esc(r.buyer_name)}</b><span class="text-[10px] text-amber-500">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span></div><p class="mt-1 text-[10px] leading-5 text-slate-500">${esc(r.comment||'')}</p><small class="text-[9px] text-slate-400">${fmtDate(r.created_at)}</small></div>`).join('')||'<p class="text-[10px] text-slate-400">មិនទាន់មានការវាយតម្លៃទេ។</p>'}</div>${canReview.length?`<form id="reviewForm" class="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3"><p class="mb-2 text-[11px] font-bold">វាយតម្លៃអ្នកលក់</p><div class="mb-3 flex gap-1" id="reviewStars">${[1,2,3,4,5].map(n=>`<button type="button" data-rating="${n}" class="star text-2xl" aria-label="${n} ផ្កាយ">★</button>`).join('')}</div><select id="reviewOrder" class="field mb-2">${canReview.map(o=>`<option value="${esc(o.id)}">ការបញ្ជាទិញ #${esc(o.id.slice(0,8))}</option>`).join('')}</select><textarea id="reviewComment" class="field mb-2" maxlength="1200" placeholder="សរសេរមតិរបស់អ្នក..."></textarea><button class="brand-gradient w-full rounded-xl py-2.5 text-[11px] font-bold text-white">ផ្ញើការវាយតម្លៃ</button></form>`:`<p class="mt-3 text-[10px] text-slate-400">ការវាយតម្លៃអាចធ្វើបានក្រោយការបញ្ជាទិញបានបញ្ចប់។</p>`}</div></div></div>`;
$('productDetail').querySelectorAll('[data-vendor-avatar-image]').forEach(image=>image.addEventListener('error',()=>{const box=image.closest('[data-vendor-avatar]');if(box)box.innerHTML=avatarFallbackMarkup(box.dataset.vendorAvatar||'')},{once:true}));
let selectedRating=0;const starWrap=$('reviewStars');if(starWrap){const paint=n=>starWrap.querySelectorAll('button').forEach(b=>{b.classList.toggle('active',Number(b.dataset.rating)<=n);b.classList.toggle('preview',Number(b.dataset.rating)<=n)});starWrap.addEventListener('mouseover',e=>{const b=e.target.closest('[data-rating]');if(b)paint(Number(b.dataset.rating))});starWrap.addEventListener('mouseleave',()=>paint(selectedRating));starWrap.addEventListener('click',e=>{const b=e.target.closest('[data-rating]');if(b){selectedRating=Number(b.dataset.rating);paint(selectedRating)}});$('reviewForm').addEventListener('submit',async e=>{e.preventDefault();if(!requireLogin())return;if(!selectedRating){toast('សូមជ្រើសរើសចំនួនផ្កាយ។','warning');return}try{await api(`/api/vendors/${v.id}/reviews`,{method:'POST',body:JSON.stringify({rating:selectedRating,comment:$('reviewComment').value,order_id:$('reviewOrder').value})});toast('អរគុណសម្រាប់ការវាយតម្លៃ!');await openProduct(p.id);await loadProducts()}catch(err){toast(err.message,'error')}})}
$('productDetail').querySelectorAll('[data-image]').forEach(b=>b.addEventListener('click',()=>{$('productDetail').querySelector('.product-main-image')?.setAttribute('src',images[Number(b.dataset.image)].image_url)}));$('productDetail').querySelector('[data-product-action="save"]')?.addEventListener('click',e=>{e.stopPropagation();saveAction(p.id,e.currentTarget)});$('productDetail').querySelector('[data-product-action="offer"]')?.addEventListener('click',()=>{if(!requireLogin())return;currentOfferProduct=p;$('offerProductName').textContent=p.title+' · '+money(p.price);$('offerAmount').value=p.price;openModal('offerModal')});$('productDetail').querySelector('[data-product-action="chat"]')?.addEventListener('click',()=>void startBuyerSellerChat(p.id));const buyButton=document.createElement('button');buyButton.type='button';buyButton.className='mt-2 w-full rounded-xl brand-gradient py-3 text-[11px] font-bold text-white shadow-lg shadow-indigo-100';buyButton.textContent='ទិញឥឡូវនេះ';buyButton.addEventListener('click',()=>openCheckout(p));$('productDetail').querySelector('[data-product-action="offer"]')?.parentElement?.insertAdjacentElement('afterend',buyButton);}

async function openStorefront(vendorId){
  if(!vendorId){toast('មិនមានព័ត៌មានហាងនេះទេ។','warning');return}
  currentStoreId=String(vendorId);currentStoreCategory='all';currentStoreSearch='';
  try{const [result,catalogue]=await Promise.all([api('/api/vendors/'+encodeURIComponent(currentStoreId)+'/ratings'),api('/api/products?page=1&limit=50')]);currentStoreData=result.data||null;currentStoreProducts=(catalogue.data||[]).filter(p=>String(p.vendor_id)===currentStoreId);if(!currentStoreData)throw new Error('មិនមានព័ត៌មានហាងទេ។');await showView('store')}
  catch(error){toast(error.message,'error')}
}
function renderStorefront(){
  const data=currentStoreData;if(!data)return;
  const sellerProducts=currentStoreProducts;
  const query=currentStoreSearch.trim().toLocaleLowerCase();
  const visible=sellerProducts.filter(p=>(currentStoreCategory==='all'||p.category===currentStoreCategory)&&(!query||String(p.title+' '+(p.description||'')).toLocaleLowerCase().includes(query)));
  const profile=data.profile||{};
  $('storefrontContent').innerHTML=`<section class="storefront-profile"><div class="storefront-avatar">${avatarMarkup(data.store_name,profile.avatar_url)}</div><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><h1 class="text-xl font-bold text-slate-900">${esc(data.store_name||'ហាងអ្នកលក់')}</h1>${verifiedBadge()}</div><p class="mt-1 text-[11px] text-slate-500">${esc(profile.province||'កម្ពុជា')} · ${Number(data.active_listings||0)} មុខទំនិញ</p><p class="mt-2 text-[11px] text-slate-600">${esc(data.description||profile.bio||'')}</p><div class="mt-2 flex items-center gap-2 text-[11px] text-slate-600">${renderStars(data.rating)} <b>${data.rating??'—'}</b><span>· ${Number(data.review_count||0)} ការវាយតម្លៃ</span></div></div></section><div class="storefront-tools"><input id="storeSearchInput" type="search" placeholder="ស្វែងរកក្នុងហាងនេះ..." value="${esc(currentStoreSearch)}" class="field min-w-0 flex-1"><div class="flex flex-wrap gap-2" id="storeCategoryFilters">${[['all','ទាំងអស់'],...Object.entries(CAT)].map(([key,label])=>`<button type="button" data-store-category="${key}" class="store-filter ${currentStoreCategory===key?'active':''}">${label}</button>`).join('')}</div></div><div class="mb-4 flex items-center justify-between"><h2 class="font-bold">ទំនិញក្នុងហាង</h2><span class="text-[10px] text-slate-500">${visible.length} មុខ</span></div><div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5" id="storeProductGrid">${visible.map(productCard).join('')}</div>${visible.length?'':'<p class="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-[11px] text-slate-500">មិនមានទំនិញត្រូវនឹងការស្វែងរកទេ។</p>'}`;
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
function savedCard(p){return `<div data-saved-card="${esc(p.id)}" class="flex gap-3 rounded-xl border border-slate-100 bg-white p-2.5">${productImage(p)?`<img class="h-20 w-20 rounded-lg object-cover" src="${esc(productImage(p))}">`:`<div class="grid h-20 w-20 place-items-center rounded-lg bg-slate-100 text-slate-400">${ic('image',22)}</div>`}<div class="min-w-0 flex-1"><b class="block truncate text-[11px]">${esc(p.title)}</b><b class="mt-1 block text-[13px] text-emerald-600">${money(p.price)}</b><p class="mt-1 truncate text-[9px] text-slate-400">${esc(p.location||'')}</p><div class="mt-2 flex gap-2"><button data-open-product="${esc(p.id)}" class="text-[10px] font-bold text-indigo-600">មើលទំនិញ</button><button data-remove-saved="${esc(p.id)}" class="text-[10px] font-bold text-rose-500">ដកចេញ</button></div></div></div>`}
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
function renderProductForm(product=null){if(!isVerifiedSeller()){if(me?.vendor?.status==='pending'){toast('ហាងកំពុងរង់ចាំ Admin អនុម័ត។','warning')}else openSellerModal();return}selectedProductImages=[];$('productForm').reset();$('editProductId').value=product?.id||'';$('productFormTitle').textContent=product?'កែប្រែព័ត៌មានទំនិញ':'បន្ថែមទំនិញថ្មី';$('productImageName').textContent='ជ្រើសរើសរូបភាពផលិតផល (អតិបរមា ៥ រូប)';$('productImageThumb').innerHTML=ic('image',21);$('productImage').value='';if(product){$('productTitle').value=product.title;$('productPrice').value=product.price;$('productCategory').value=product.category;$('productLocation').value=product.location||'ភ្នំពេញ';$('productCondition').value=product.condition||'ប្រើរួចស្អាត';$('productDescription').value=product.description||'';const image=productImage(product);if(image)$('productImageThumb').innerHTML=`<img class="h-full w-full object-cover" src="${esc(image)}">`;$('productImageName').textContent=product.product_images?.length?`${product.product_images.length} រូបដែលបាន Upload រួច`:'មិនទាន់មានរូបភាព'}openModal('productFormModal')}
async function renderSeller(){if(!isVerifiedSeller()){const v=me?.vendor;$('sellerGate').classList.remove('hidden');$('sellerDashboardContent').classList.add('hidden');$('sellerGateText').textContent=v?`ស្ថានភាពហាង៖ ${vendorStatus(v.status)}។ ${v.status==='rejected'?'សូមពិនិត្យមតិ Admin នៅក្នុងគណនីរបស់អ្នក។':'សូមរង់ចាំ Admin ពិនិត្យឯកសាររបស់អ្នក។'}`:'សូមចុះឈ្មោះ និងរង់ចាំ Admin ផ្ទៀងផ្ទាត់ឯកសារមុនពេលបង្ហោះទំនិញ។';$('sellerGateApply').textContent=v?.status==='pending'?'កំពុងរង់ចាំការអនុម័ត':'ចុះឈ្មោះអ្នកលក់';$('sellerGateApply').disabled=v?.status==='pending';return}$('sellerGate').classList.add('hidden');$('sellerDashboardContent').classList.remove('hidden');try{const [stats,productsRes,offers,ordersRes]=await Promise.all([api('/api/vendor/overview'),api('/api/vendor/products'),loadOffers(),api('/api/vendor/orders')]);$('kpiListings').textContent=stats.data.activeListings;$('kpiViews').textContent=Number(stats.data.totalViews).toLocaleString();$('kpiRating').textContent=stats.data.averageRating??'—';$('kpiSales').textContent=stats.data.completedSales;$('sellerProducts').innerHTML=(productsRes.data||[]).map(p=>`<div class="table-row flex flex-col gap-3 rounded-xl border border-slate-100 p-3 sm:flex-row sm:items-center">${productImage(p)?`<img src="${esc(productImage(p))}" class="h-16 w-16 rounded-xl object-cover">`:`<div class="grid h-16 w-16 place-items-center rounded-xl bg-slate-100 text-slate-400">${ic('image',22)}</div>`}<div class="min-w-0 flex-1"><b class="block truncate text-[11px]">${esc(p.title)}</b><p class="mt-1 text-[10px] text-slate-500">${money(p.price)} · ${esc(p.category)} · ${p.stock} stock</p><p class="mt-1 text-[9px] text-slate-400">ស្ថានភាព៖ ${productStatus(p.status)} · ${Number(p.view_count||0)} views</p></div><div class="flex flex-wrap gap-2"><button data-seller-action="edit" data-id="${esc(p.id)}" class="rounded-lg border px-3 py-2 text-[10px] font-bold">កែប្រែ</button>${p.status==='active'?`<button data-seller-action="sold" data-id="${esc(p.id)}" class="rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-700">លក់រួច</button>`:''}<button data-seller-action="delete" data-id="${esc(p.id)}" class="rounded-lg bg-rose-50 px-3 py-2 text-[10px] font-bold text-rose-600">លុប</button></div></div>`).join('')||'<p class="rounded-xl border border-dashed p-6 text-center text-[11px] text-slate-400">មិនទាន់មានទំនិញ។ ចុចបន្ថែមទំនិញដើម្បីចាប់ផ្តើម។</p>';
let offersPanel=$('sellerOffers');if(!offersPanel){offersPanel=document.createElement('div');offersPanel.id='sellerOffers';offersPanel.className='mt-5 rounded-2xl border border-slate-100 bg-white p-5 soft-shadow';$('sellerDashboardContent').appendChild(offersPanel)}const received=offers.filter(o=>o.vendor_id===me.vendor.id);offersPanel.innerHTML=`<h3 class="mb-3 font-bold">សំណើតថ្លៃពីអ្នកទិញ</h3>${received.map(o=>`<div class="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"><div><b class="text-[11px]">${esc(o.products?.title||'ទំនិញ')}</b><p class="mt-1 text-[10px] text-slate-500">${money(o.offer_price)} · ${esc(o.buyer_name||'អ្នកទិញ')} · ${offerStatus(o.status)}</p><p class="mt-1 text-[10px] text-slate-400">${esc(o.message||'')}</p></div>${o.status==='pending'?`<div class="flex gap-2"><button data-offer-action="accepted" data-id="${esc(o.id)}" class="rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-700">ទទួលយក</button><button data-offer-action="rejected" data-id="${esc(o.id)}" class="rounded-lg bg-rose-50 px-3 py-2 text-[10px] font-bold text-rose-600">បដិសេធ</button></div>`:''}</div>`).join('')||'<p class="text-[10px] text-slate-400">មិនទាន់មានសំណើតថ្លៃទេ។</p>'}`

let ordersPanel=$('sellerOrders');
if(!ordersPanel){ordersPanel=document.createElement('div');ordersPanel.id='sellerOrders';ordersPanel.className='mt-5 rounded-2xl border border-slate-100 bg-white p-5 soft-shadow';$('sellerDashboardContent').appendChild(ordersPanel)}
const sellerOrders=ordersRes.data||[];
ordersPanel.innerHTML=`<h3 class="mb-3 font-bold">ការបញ្ជាទិញ និងការដឹកជញ្ជូន</h3>${sellerOrders.map(row=>{const order=row.orders||{};const state=row.fulfillment_status||'pending';const next=state==='pending'?'processing':state==='processing'?'shipped':state==='shipped'?'completed':null;const label=next==='processing'?'ទទួលការបញ្ជាទិញ':next==='shipped'?'សម្គាល់ថាបានដឹកជញ្ជូន':next==='completed'?'បញ្ចប់ការបញ្ជាទិញ':null;return `<div class="mb-2 rounded-xl border border-slate-100 p-3"><div class="flex flex-wrap items-center justify-between gap-2"><b class="text-[11px]">${esc(row.products?.title||'ទំនិញ')} × ${row.quantity}</b><span class="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-600">${productStatus(state)}</span></div><p class="mt-1 text-[10px] text-slate-500">Order #${esc(String(row.order_id||'').slice(0,8))} · ${money(Number(row.unit_price||0)*Number(row.quantity||0))} · ${fmtDate(order.created_at)}</p><p class="mt-1 text-[10px] text-slate-500">${esc(order.customer_name||'អ្នកទិញ')} · ${esc(order.customer_phone||'')}</p>${label?`<button data-order-status="${esc(next)}" data-order-id="${esc(row.order_id)}" class="mt-3 rounded-lg bg-indigo-50 px-3 py-2 text-[10px] font-bold text-indigo-700">${label}</button>`:''}</div>`}).join('')||'<p class="text-[10px] text-slate-400">មិនទាន់មានការបញ្ជាទិញទេ។</p>'}`
await loadSellerChatInbox();

}catch(e){toast('មិនអាចផ្ទុក Dashboard៖ '+e.message,'error')}}
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
      if(target.classList.contains('product-card')){const rx=((.5-y)*5).toFixed(2),ry=((x-.5)*6).toFixed(2);target.style.transform='perspective(950px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-3px)'}
    });
  },{passive:true});
  document.addEventListener('pointerout',event=>{const target=event.target.closest('.product-card,.editorial-glow');if(!target||(event.relatedTarget&&target.contains(event.relatedTarget)))return;target.style.setProperty('--spotlight-opacity','0');if(target.classList.contains('product-card'))target.style.transform=''});
  document.querySelectorAll('.hero-primary-action,#postAdBtn,#mobilePostBtn,#bannerPostBtn').forEach(button=>{
    button.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||magnetFrames.has(button))return;const rect=button.getBoundingClientRect(),dx=event.clientX-(rect.left+rect.width/2),dy=event.clientY-(rect.top+rect.height/2),x=Math.max(-5,Math.min(5,dx*.08)),y=Math.max(-5,Math.min(5,dy*.08));const frame=requestAnimationFrame(()=>{button.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)';magnetFrames.delete(button)});magnetFrames.set(button,frame)} ,{passive:true});
    button.addEventListener('pointerleave',()=>{if(magnetFrames.has(button))cancelAnimationFrame(magnetFrames.get(button));magnetFrames.delete(button);button.style.transform=''});
  });
}
function productFormPayload(){return {title:$('productTitle').value.trim(),price:Number($('productPrice').value),category:$('productCategory').value,location:$('productLocation').value,condition:$('productCondition').value,description:$('productDescription').value.trim(),stock:1}}

// Setup icons and server-authenticated interface.
$('logoIcon').innerHTML=ic('bag',22);$('searchIcon').innerHTML=ic('search',18);setupEditorialInteractions();$('searchBtn').innerHTML=ic('search',17);$('postIcon').innerHTML=ic('plus',17);$('mobilePostBtn').innerHTML=ic('plus',19);$('bellIcon').innerHTML=ic('bell',18);$('chevronIcon').innerHTML=ic('chev',13);$('menuUserIcon').innerHTML=ic('user',15);$('menuStoreIcon').innerHTML=ic('store',15);$('menuAdminIcon').innerHTML=ic('shield',15);$('menuSaveIcon').innerHTML=ic('heart',15);$('menuLoginIcon').innerHTML=ic('logout',15);$('heroShield').innerHTML=ic('shield',15);$('heroUsers').innerHTML=ic('users',15);$('catAll').innerHTML=ic('grid',15);$('catPhone').innerHTML=ic('phone',15);$('catCar').innerHTML=ic('car',15);$('catHome').innerHTML=ic('home',15);$('catFashion').innerHTML=ic('shirt',15);$('catFurniture').innerHTML=ic('sofa',15);$('emptyIcon').innerHTML=ic('search',25);$('coverCam').innerHTML=ic('camera',14);$('avatarCam').prepend(document.createTextNode(''));$('avatarCam').insertAdjacentHTML('afterbegin',ic('camera',13));$('sellerGateIcon').innerHTML=ic('shield',23);$('kpiListingsIcon').innerHTML=ic('grid',17);$('kpiViewsIcon').innerHTML=ic('eye',17);$('kpiRatingIcon').innerHTML=ic('star',17);$('kpiSalesIcon').innerHTML=ic('wallet',17);$('addProductIcon').innerHTML=ic('plus',14);$('sellerDocThumb').innerHTML=ic('file',23);
$('sellerDocument').addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>8*1024*1024){toast('សូមជ្រើសរើស JPG, PNG ឬ WEBP ទំហំមិនលើស 8MB។','warning');e.target.value='';return}$('sellerDocName').textContent=f.name;$('sellerDocThumb').innerHTML=ic('image',22);$('sellerDocPreview').classList.remove('hidden');if(sellerDocPreviewUrl)URL.revokeObjectURL(sellerDocPreviewUrl);sellerDocPreviewUrl=URL.createObjectURL(f);$('sellerDocPreview').innerHTML='<img src="'+sellerDocPreviewUrl+'" class="max-h-48 w-full object-contain" alt="Preview">'});
$('productImage').setAttribute('multiple','multiple');$('productImage').setAttribute('accept','image/jpeg,image/png,image/webp');$('productImage').addEventListener('change',e=>{const files=Array.from(e.target.files||[]);if(files.length>5||files.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)){toast('សូមជ្រើសរើសរូប JPG, PNG ឬ WEBP មិនលើស 8MB ក្នុងមួយរូប និងអតិបរមា ៥ រូប។','warning');e.target.value='';selectedProductImages=[];$('productImageName').textContent='ជ្រើសរើសរូបភាពផលិតផល';$('productImageThumb').innerHTML=ic('image',21);return}selectedProductImages=files;$('productImageName').textContent=selectedProductImages.length?`${selectedProductImages.length} រូបបានជ្រើសរើស`:'ជ្រើសរើសរូបភាពផលិតផល';if(selectedProductImages[0]){const url=URL.createObjectURL(selectedProductImages[0]);$('productImageThumb').innerHTML=`<img src="${url}" class="h-full w-full object-cover">`}});
$('searchForm').addEventListener('submit',e=>{e.preventDefault();searchTerm=$('searchInput').value.trim();activeCategory=$('searchCategory').value;document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('active',b.dataset.category===activeCategory));void loadProducts();$('view-home').scrollIntoView({behavior:'smooth'})});$('searchInput').addEventListener('input',e=>{searchTerm=e.target.value.trim();clearTimeout(window.searchWait);window.searchWait=setTimeout(()=>void loadProducts(),350)});$('searchCategory').addEventListener('change',e=>setCategory(e.target.value));$('categoryStrip').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b)setCategory(b.dataset.category)});document.querySelectorAll('[data-tag]').forEach(b=>b.addEventListener('click',()=>{searchTerm=b.dataset.tag;$('searchInput').value=searchTerm;void loadProducts()}));$('sortSelect').addEventListener('change',()=>{const sort=$('sortSelect').value;products.sort((a,b)=>sort==='low'?Number(a.price)-Number(b.price):sort==='high'?Number(b.price)-Number(a.price):new Date(b.created_at)-new Date(a.created_at));renderProducts()});$('clearFilters').addEventListener('click',()=>{searchTerm='';activeCategory='all';$('searchInput').value='';$('searchCategory').value='all';setCategory('all')});
$('productGrid').addEventListener('click',event=>{const heart=event.target.closest('[data-action="save"]');if(heart){event.preventDefault();event.stopPropagation();saveAction(heart.dataset.id,heart);return}const store=event.target.closest('[data-action="store"]');if(store){event.preventDefault();event.stopPropagation();void openStorefront(store.dataset.vendorId);return}const view=event.target.closest('[data-action="view"]');if(view)void openProduct(view.dataset.id)});
$('mobileMarketPost')?.addEventListener('click',()=>{if(!requireLogin())return;renderProductForm()});
$('mobileMarketNav')?.addEventListener('click',event=>{const button=event.target.closest('[data-action="mobile-search"]');if(button){$('searchInput').focus();window.scrollTo({top:0,behavior:'smooth'})}});
$('postAdBtn').addEventListener('click',()=>{if(!requireLogin())return;if(!isVerifiedSeller()){openSellerModal();return}renderProductForm()});$('mobilePostBtn').addEventListener('click',()=>$('postAdBtn').click());$('heroPostBtn').addEventListener('click',()=>$('postAdBtn').click());$('profileApplyTop').addEventListener('click',()=>{if(me?.vendor) {profileTab='seller';document.querySelector('[data-profile-tab="seller"]').click()} else openSellerModal()});$('sellerGateApply').addEventListener('click',openSellerModal);$('addProductBtn').addEventListener('click',()=>renderProductForm());
$('notificationBtn').addEventListener('click',e=>{e.stopPropagation();toggleDrop('notificationMenu')});$('profileMenuBtn').addEventListener('click',e=>{e.stopPropagation();toggleDrop('profileMenu')});document.addEventListener('click',e=>{if(!e.target.closest('#profileMenu')&&!e.target.closest('#profileMenuBtn')&&!e.target.closest('#notificationMenu')&&!e.target.closest('#notificationBtn'))closeDropdowns()});document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.action;if(a==='profile')showView('profile');if(a==='seller-dashboard')showView('seller');if(a==='admin')showView('admin');if(a==='saved'){showView('profile');profileTab='saved';document.querySelector('[data-profile-tab="saved"]').click()}if(a==='login')openAuth();if(a==='logout')void (async()=>{try{const {error}=await supabaseClient.auth.signOut();if(error)throw error;session=null;me=null;savedIds.clear();pendingPhone=null;telegramLoginWidgetMounted=false;if($('telegramLoginWidget'))$('telegramLoginWidget').innerHTML='';$('authForm')?.reset();syncHeader();applyMaintenanceUI();showView('home');openAuth('login');toast('បាន Logout និងសម្អាត Session គណនីចាស់រួចរាល់។ សូម Login តាម Telegram ម្តងទៀត។','success')}catch(error){toast('មិនអាច Logout បានទេ៖ '+error.message,'error')}})()}));document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
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
$('productForm').addEventListener('submit',async e=>{e.preventDefault();if(!isVerifiedSeller()){toast('ហាងមិនទាន់បានផ្ទៀងផ្ទាត់ទេ។','warning');return}const id=$('editProductId').value,payload=productFormPayload(),button=$('productForm').querySelector('button[type="submit"]')||$('productForm').querySelector('button:last-child');button.disabled=true;try{let product;if(id){const r=await api('/api/products/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify(payload)});product=r.data}else{const r=await api('/api/products',{method:'POST',body:JSON.stringify(payload)});product=r.data}if(selectedProductImages.length){const form=new FormData();selectedProductImages.forEach(f=>form.append('images',f));await api(`/api/products/${product.id}/images`,{method:'POST',body:form})}closeModal('productFormModal');selectedProductImages=[];toast(id?'បានរក្សាទុកការកែប្រែទំនិញរួចរាល់។':'បានបង្ហោះទំនិញជោគជ័យ! ទំនិញនឹងបង្ហាញលើ Marketplace ភ្លាមៗ។');await renderSeller();await loadProducts()}catch(err){toast(err.message,'error')}finally{button.disabled=false}});
$('sellerProducts').addEventListener('click',async e=>{const b=e.target.closest('[data-seller-action]');if(!b)return;const id=b.dataset.id;try{if(b.dataset.sellerAction==='edit'){const data=await api('/api/vendor/products');const p=data.data.find(x=>x.id===id);if(p)renderProductForm(p)}if(b.dataset.sellerAction==='sold'){if(!confirm('សម្គាល់ទំនិញនេះថាលក់រួចមែនទេ?'))return;await api('/api/products/'+id,{method:'PATCH',body:JSON.stringify({status:'sold'})});toast('បានសម្គាល់ថាលក់រួច។')}if(b.dataset.sellerAction==='delete'){if(!confirm('លុបទំនិញនេះមែនទេ?'))return;await api('/api/products/'+id,{method:'DELETE'});toast('បានលុប ឬបិទទំនិញរួចរាល់។')}await renderSeller();await loadProducts()}catch(err){toast(err.message,'error')}});
$('sellerDashboardContent').addEventListener('click',async e=>{const b=e.target.closest('[data-offer-action]');if(!b)return;try{await api('/api/offers/'+b.dataset.id,{method:'PATCH',body:JSON.stringify({status:b.dataset.offerAction})});toast('បានកែប្រែសំណើតថ្លៃ។');await renderSeller()}catch(err){toast(err.message,'error')}});
$('sellerDashboardContent').addEventListener('click',async e=>{const b=e.target.closest('[data-order-status]');if(!b)return;try{await api('/api/vendor/orders/'+encodeURIComponent(b.dataset.orderId),{method:'PATCH',body:JSON.stringify({status:b.dataset.orderStatus})});toast('បានធ្វើបច្ចុប្បន្នភាពការបញ្ជាទិញ។');await renderSeller();await loadOrders()}catch(err){toast(err.message,'error')}});
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
  const button=$('saveBrandingBtn'),logo=$('brandingLogoUpload').files?.[0],heroFiles=Array.from($('brandingHeroUpload').files||[]);
  if(logo&&(!['image/jpeg','image/png','image/webp'].includes(logo.type)||logo.size>2*1024*1024)){toast('Logo ត្រូវជា JPG, PNG ឬ WEBP និងមិនលើស 2MB។','warning');return}
  if(heroFiles.length>3||heroFiles.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)){toast('Banner អាច Upload JPG, PNG ឬ WEBP ចំនួនមិនលើស ៣ រូប និង 8MB ក្នុងមួយរូប។','warning');return}
  const form=new FormData();
  form.append('siteTitle',$('brandTitleInput').value.trim());
  form.append('siteSubtitle',$('brandSubtitleInput').value.trim());
  form.append('heroBadge',$('heroBadgeInput').value.trim());
  form.append('heroTitle',$('heroTitleInput').value.trim());
  form.append('heroSubtitle',$('heroSubtitleInput').value.trim());
  form.append('clearHeroImages',$('clearHeroImages').checked?'true':'false');
  if(logo)form.append('logo',logo);
  heroFiles.forEach(file=>form.append('heroImages',file));
  button.disabled=true;button.textContent='កំពុងរក្សាទុក...';
  try{
    const result=await api('/api/admin/branding',{method:'PATCH',body:form});
    applySiteBranding(result.data||{});
    $('brandingStatus').textContent='បានរក្សាទុក Brand & Banner ទៅ Database រួចរាល់។';
    $('brandingLogoUpload').value='';$('brandingHeroUpload').value='';$('clearHeroImages').checked=false;
    if(brandingLogoPreviewUrl){URL.revokeObjectURL(brandingLogoPreviewUrl);brandingLogoPreviewUrl=null}
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
function renderSellerChatMessages(messages){
  const target=$('sellerChatMessages');if(!target)return;
  const wasNearBottom=target.scrollHeight-target.scrollTop-target.clientHeight<90;
  target.innerHTML=(messages||[]).map(message=>{
    const own=message.sender_role===sellerChatMode,number=message.sender_role==='buyer'?'1':'2',role=message.sender_role==='buyer'?'អ្នកទិញ':'អ្នកលក់';
    let content='';
    if(message.message_type==='product'){
      const product=message.product||null;
      const image=product?.image_url?'<img src="'+esc(product.image_url)+'" alt="" loading="lazy">':'<span class="seller-chat-product-placeholder">📦</span>';
      content='<article class="seller-chat-product-card">'+image+'<div class="seller-chat-product-info"><small>ផលិតផលដែលបានសួរ</small><b>'+esc(product?.title||message.body||'ផលិតផល')+'</b>'+(product?'<strong>'+money(product.price)+'</strong>':'<span class="seller-chat-product-unavailable">ផលិតផលនេះមិនមានលក់ទៀតទេ</span>')+'</div></article>';
    }else if(message.message_type==='voice'&&message.telegram_file_id){
      content='<div class="seller-chat-voice"><span>🎙 សារសំឡេង · '+Number(message.duration_seconds||0)+' វិនាទី</span><audio controls preload="none" src="/api/media/telegram/'+encodeURIComponent(message.telegram_file_id)+'?mime='+encodeURIComponent(message.mime_type||'audio/webm')+'"></audio></div>';
    }else content='<p>'+esc(message.body).replace(/\n/g,'<br>')+'</p>';
    return '<div class="flex '+(own?'justify-end':'justify-start')+'"><div class="seller-chat-bubble '+(own?'own':'other')+'"><div class="mb-1 text-[8px] font-bold opacity-75">'+number+' · '+role+'</div>'+content+'<small>'+esc(supportChatTime(message.created_at))+'</small></div></div>';
  }).join('')||'<p class="py-8 text-center text-xs text-slate-400">មិនទាន់មានសារទេ។ សូមចាប់ផ្ដើមសន្ទនា។</p>';
  if(wasNearBottom)target.scrollTop=target.scrollHeight;
}
function renderSellerChatInbox(){
  const target=$('sellerChatInboxList');if(!target)return;
  const total=sellerChatInbox.reduce((sum,row)=>sum+Number(row.unread_count||0),0),badge=$('sellerChatUnreadBadge');
  badge.textContent=total>99?'99+':String(total);badge.classList.toggle('hidden',!total);
  target.innerHTML=sellerChatInbox.map(chat=>{
    const image='<span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-lg text-emerald-700">🏪</span>';
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
  try{const result=await api('/api/seller-chat/preferences');sellerChatMuted=result.data?.muted===true;const button=$('sellerChatMute');button.textContent=sellerChatMuted?'🔕 បើកសំឡេង':'🔔 បិទសំឡេង';button.setAttribute('aria-pressed',String(sellerChatMuted))}
  catch(error){console.warn('Chat preference load failed:',error.message)}
}
async function loadSellerChatConversation(scrollToBottom=false){
  if(!sellerChatConversationId||!session)return;
  const result=await api('/api/seller-chat/conversations/'+encodeURIComponent(sellerChatConversationId));
  const data=result.data||{},conversation=data.conversation||{},messages=data.messages||[];
  sellerChatMode=conversation.current_role==='seller'?'seller':'buyer';
  $('sellerChatTitle').textContent=sellerChatMode==='seller'?(conversation.buyer?.display_name||'អ្នកទិញ'):(conversation.vendor?.store_name||'អ្នកលក់');
  $('sellerChatSubtitle').textContent='សន្ទនាតាមហាង · ផលិតផលត្រូវបានភ្ជាប់ក្នុងសារ';
  const image=$('sellerChatProductImage');image.innerHTML='<span class="grid h-full w-full place-items-center text-lg text-emerald-700">🏪</span>';
  const newest=messages.at(-1);
  if(newest)sellerChatLastMessageId=newest.id;
  renderSellerChatMessages(messages);if(scrollToBottom)$('sellerChatMessages').scrollTop=$('sellerChatMessages').scrollHeight;
  $('sellerChatForm').classList.toggle('opacity-50',conversation.status!=='open');
  $('sellerChatInput').disabled=conversation.status!=='open';$('sellerChatRecord').disabled=conversation.status!=='open';
  $('sellerChatInboxPane').classList.add('mobile-hidden');$('sellerChatBack').classList.remove('hidden');$('sellerChatThread').classList.add('mobile-active');
}
function subscribeSellerChat(conversationId){
  if(sellerChatChannel&&supabaseClient){void supabaseClient.removeChannel(sellerChatChannel);sellerChatChannel=null}
  if(supabaseClient)sellerChatChannel=supabaseClient.channel('7inone-seller-chat-'+conversationId).on('postgres_changes',{event:'INSERT',schema:'public',table:'seller_messages',filter:'conversation_id=eq.'+conversationId},()=>{void loadSellerChatConversation().catch(error=>console.warn('Seller chat realtime refresh failed:',error.message));void loadUnifiedSellerChatInbox()}).subscribe(status=>{if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')console.warn('Seller chat realtime unavailable; polling fallback remains active.')});
  if(!sellerChatPollTimer)sellerChatPollTimer=setInterval(()=>{if(sellerChatConversationId&&$('sellerChatModal').classList.contains('open')){void loadSellerChatConversation().catch(()=>{});void loadUnifiedSellerChatInbox()}},5000);
}
async function openSellerChat(conversationId,mode){
  sellerChatConversationId=conversationId;sellerChatLastMessageId=null;
  openModal('sellerChatModal');$('sellerChatMessages').innerHTML='<p class="py-8 text-center text-xs text-slate-400">កំពុងផ្ទុកសន្ទនា…</p>';
  await Promise.all([loadUnifiedSellerChatInbox(),loadSellerChatPreferences()]);
  try{await loadSellerChatConversation(true);await loadUnifiedSellerChatInbox();subscribeSellerChat(conversationId);renderSellerChatInbox()}
  catch(error){toast(error.message,'error')}
}
async function openSellerChatInbox(){
  if(!requireLogin())return;
  sellerChatConversationId=null;sellerChatLastMessageId=null;$('sellerChatInboxPane').classList.remove('mobile-hidden');$('sellerChatThread').classList.remove('mobile-active');$('sellerChatBack').classList.add('hidden');
  openModal('sellerChatModal');
  $('sellerChatTitle').textContent='ជ្រើសរើសសន្ទនា';$('sellerChatSubtitle').textContent='សន្ទនាអំពីផលិតផល';$('sellerChatProductImage').textContent='📦';
  $('sellerChatMessages').innerHTML='<p class="py-8 text-center text-xs text-slate-400">ជ្រើសរើសសន្ទនាមួយ ដើម្បីចាប់ផ្ដើម។</p>';
  $('sellerChatForm').classList.add('opacity-50');$('sellerChatInput').disabled=true;$('sellerChatRecord').disabled=true;
  await Promise.all([loadUnifiedSellerChatInbox(),loadSellerChatPreferences()]);
}
async function startBuyerSellerChat(productId){
  if(!requireLogin())return;
  try{const result=await api('/api/seller-chat/conversations',{method:'POST',body:JSON.stringify({product_id:productId})});const id=result.data?.id;if(!id)throw new Error('មិនអាចបើកសន្ទនាបានទេ។');await showView('product');await openSellerChat(id,'buyer')}
  catch(error){toast(error.message,'error')}
}
async function startSellerVoiceRecording(){
  if(!sellerChatConversationId||!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast('Browser នេះមិនគាំទ្រការថតសំឡេងទេ។','error');return}
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    const mime=['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/mp4'].find(type=>MediaRecorder.isTypeSupported?.(type));
    sellerChatRecorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);sellerChatRecordChunks=[];sellerChatRecordStartedAt=Date.now();
    sellerChatRecorder.ondataavailable=event=>{if(event.data?.size)sellerChatRecordChunks.push(event.data)};
    sellerChatRecorder.onstop=async()=>{
      clearTimeout(sellerChatRecordTimer);sellerChatRecordTimer=null;
      stream.getTracks().forEach(track=>track.stop());$('sellerChatRecordingStatus').classList.add('hidden');$('sellerChatRecord').textContent='🎙';
      if(sellerChatDiscardRecording){sellerChatDiscardRecording=false;sellerChatRecorder=null;sellerChatRecordChunks=[];return}
      const duration=Math.max(1,Math.min(180,Math.round((Date.now()-sellerChatRecordStartedAt)/1000)));
      const blob=new Blob(sellerChatRecordChunks,{type:sellerChatRecorder.mimeType||'audio/webm'});
      sellerChatRecorder=null;sellerChatRecordChunks=[];
      if(!blob.size)return;
      if(blob.size>12*1024*1024){toast('សំឡេងធំពេក។ សូមថតខ្លីជាងនេះ។','warning');return}
      const form=new FormData();form.append('voice',blob,'voice.'+(blob.type.includes('ogg')?'ogg':blob.type.includes('mp4')?'m4a':'webm'));form.append('duration_seconds',String(duration));
      const button=$('sellerChatRecord');button.disabled=true;
      try{await api('/api/seller-chat/conversations/'+encodeURIComponent(sellerChatConversationId)+'/voice',{method:'POST',body:form});await loadSellerChatConversation(true);await loadUnifiedSellerChatInbox()}
      catch(error){toast(error.message,'error')}finally{button.disabled=false}
    };
    sellerChatRecorder.start(250);$('sellerChatRecordingStatus').classList.remove('hidden');$('sellerChatRecord').textContent='■';
    clearTimeout(sellerChatRecordTimer);sellerChatRecordTimer=setTimeout(()=>{if(sellerChatRecorder?.state==='recording')sellerChatRecorder.stop()},180000);
  }catch(error){toast(error.name==='NotAllowedError'?'សូមអនុញ្ញាតឱ្យប្រើ Microphone ជាមុនសិន។':error.message,'error')}
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
  let requestedView=document.documentElement.dataset.initialView||'home';
  if(!['home','profile','seller','admin'].includes(requestedView))requestedView='home';
  // Optimistically activate the requested route before any network/auth work.
  void showView(requestedView,{optimistic:true,deferLoad:true,preserveScroll:true});
  try{
    const cfg=await fetch('/api/config',{cache:'no-store'}).then(r=>r.json());
    maintenanceMode=cfg.maintenanceMode===true;
    maintenanceMessage=String(cfg.maintenanceMessage||DEFAULT_MAINTENANCE_MESSAGE);
    faviconUrl=String(cfg.siteLogoUrl||cfg.faviconUrl||'');
    applySiteBranding(cfg);
    if(faviconUrl)applyFavicon(faviconUrl);
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
    const hashRoute=String(window.location.hash||'').replace(/^#/,'');
    if(['home','profile','seller','admin'].includes(hashRoute))requestedView=hashRoute;
    const routeAllowed=requestedView==='home' ||
      (requestedView==='profile'&&Boolean(session)) ||
      (requestedView==='seller'&&Boolean(session)&&me?.vendor?.status==='approved') ||
      (requestedView==='admin'&&Boolean(session)&&Boolean(me?.isAdmin));
    if(!routeAllowed)requestedView='home';
    routeAccessReady=true;
    let savedScrollY=0;
    try{savedScrollY=Math.max(0,Number(sessionStorage.getItem('ecomstore.scrollY')||0))}catch{}
    const pageTask=showView(requestedView,{preserveScroll:true});
    const dataTasks=[pageTask,loadProducts()];
    if(session)dataTasks.push(Promise.all([loadSaved(),loadOrders(),loadUnifiedSellerChatInbox(),loadSellerChatPreferences()]).catch(e=>console.warn(e)));
    await Promise.all(dataTasks);
    if(!sellerInboxPollTimer)sellerInboxPollTimer=setInterval(()=>{if(!document.hidden&&$('view-seller')?.classList.contains('active')&&isVerifiedSeller())void loadSellerChatInbox()},7000);
    if(!sellerChatInboxPollTimer)sellerChatInboxPollTimer=setInterval(()=>{if(!document.hidden&&session)void loadUnifiedSellerChatInbox()},12000);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(productRealtimePendingRefresh&&$('view-home')?.classList.contains('active')){productRealtimePendingRefresh=false;void loadProducts()}if($('view-seller')?.classList.contains('active'))void loadSellerChatInbox()}});
    document.documentElement.classList.remove('route-restoring');
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(0,savedScrollY)));
  }catch(e){
    routeAccessReady=true;
    console.error(e);
    showView('home',{preserveScroll:true});
    document.documentElement.classList.remove('route-restoring');
    applyMaintenanceUI();
    toast('មិនអាចភ្ជាប់ប្រព័ន្ធគណនីបានទេ៖ '+e.message,'error');
    $('listingSub').textContent='សូមកំណត់ Supabase Auth និង Environment Variables ដើម្បីបើកផ្សារ។';
    $('skeletonGrid').classList.add('hidden');
    $('emptyHome').classList.remove('hidden');
  }
}

$('sellerChatClose').addEventListener('click',()=>{if(sellerChatRecorder?.state==='recording'){sellerChatDiscardRecording=true;sellerChatRecorder.stop()}closeModal('sellerChatModal');sellerChatConversationId=null;if(sellerChatChannel&&supabaseClient){void supabaseClient.removeChannel(sellerChatChannel);sellerChatChannel=null}});
$('sellerChatForm').addEventListener('submit',async event=>{event.preventDefault();const input=$('sellerChatInput'),body=input.value.trim();if(!body||!sellerChatConversationId)return;const button=$('sellerChatForm').querySelector('button[type="submit"]');button.disabled=true;try{await api('/api/seller-chat/conversations/'+encodeURIComponent(sellerChatConversationId)+'/messages',{method:'POST',body:JSON.stringify({body})});input.value='';await loadSellerChatConversation(true);await loadUnifiedSellerChatInbox()}catch(error){toast(error.message,'error')}finally{button.disabled=false}});
$('sellerDashboardContent').addEventListener('click',event=>{const button=event.target.closest('[data-seller-chat]');if(button)void openSellerChat(button.dataset.sellerChat,'seller')});

$('supportChatLauncher').addEventListener('click',()=>void openSellerChatInbox());
$('sellerChatInboxRefresh').addEventListener('click',()=>void loadUnifiedSellerChatInbox());
$('sellerChatInboxList').addEventListener('click',event=>{const button=event.target.closest('[data-unified-chat]');if(button)void openSellerChat(button.dataset.unifiedChat)});
$('sellerChatBack').addEventListener('click',()=>{$('sellerChatInboxPane').classList.remove('mobile-hidden');$('sellerChatThread').classList.remove('mobile-active');sellerChatConversationId=null;$('sellerChatTitle').textContent='ជ្រើសរើសសន្ទនា';$('sellerChatSubtitle').textContent='សន្ទនាអំពីផលិតផល';$('sellerChatMessages').innerHTML='<p class="py-8 text-center text-xs text-slate-400">ជ្រើសរើសសន្ទនាមួយ ដើម្បីចាប់ផ្ដើម។</p>';$('sellerChatForm').classList.add('opacity-50');$('sellerChatInput').disabled=true;$('sellerChatRecord').disabled=true});
$('sellerChatMute').addEventListener('click',async()=>{const button=$('sellerChatMute');button.disabled=true;try{const result=await api('/api/seller-chat/preferences',{method:'PUT',body:JSON.stringify({muted:!sellerChatMuted})});sellerChatMuted=result.data.muted;await loadSellerChatPreferences()}catch(error){toast(error.message,'error')}finally{button.disabled=false}});
$('sellerChatRecord').addEventListener('click',()=>{if(sellerChatRecorder?.state==='recording')sellerChatRecorder.stop();else void startSellerVoiceRecording()});
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
  const route=String(window.location.hash||'').replace(/^#/,'');
  const name=['home','profile','seller','admin'].includes(route)?route:'home';
  const active=document.querySelector('.view.active')?.id?.replace('view-','');
  if(active===name)return;
  if(!routeAccessReady){void showView(name,{optimistic:true,deferLoad:true,preserveScroll:true});return}
  void showView(name,{fromHistory:true,preserveScroll:true});
}
window.addEventListener('hashchange',syncRouteFromHistory);
window.addEventListener('popstate',syncRouteFromHistory);

// Delegated image-error fallback also covers vendor cards rendered after page load.
document.addEventListener('error',event=>{
  const image=event.target.closest?.('[data-vendor-avatar-image]');
  if(!image)return;
  const parent=image.parentElement;
  if(parent)parent.innerHTML=avatarFallbackMarkup(parent.dataset.vendorAvatar||'អ្នកលក់');
},true);

// Deliberately no magnetic or 3D tilt effects in the minimalist marketplace UI.
void boot();
