// 7inOne production frontend: Supabase Auth + authenticated server API.
const iconPaths={
 bag:'<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',plus:'<path d="M12 5v14M5 12h14"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',chev:'<path d="m7 10 5 5 5-5"/>',x:'<path d="m18 6-12 12M6 6l12 12"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',check:'<path d="m5 12 4 4L19 6"/>',chat:'<path d="M21 11.5a8.5 8.5 0 0 1-9 8.5 9.7 9.7 0 0 1-4-.8L3 21l1.8-4.5A8.2 8.2 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z"/>',tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1"/>',arrow:'<path d="M5 12h14m-7-7 7 7-7 7"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',car:'<path d="m5 17-1 2v2h2v-2h12v2h2v-2l-1-2"/><path d="m4 17 1.5-6h13L20 17M7 11l1.5-4h7L17 11M7 17h.01M17 17h.01"/>',home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1Z"/>',shirt:'<path d="m16 4 5 3-3 4-2-1v10H8V10l-2 1-3-4 5-3 2 2h4z"/>',sofa:'<path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M3 12a2 2 0 0 1 4 0v3h10v-3a2 2 0 0 1 4 0v5H3zM5 17v3m14-3v3"/>',user:'<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',camera:'<path d="M14 5 12.5 3h-5L6 5H3v14h18V5z"/><circle cx="12" cy="12" r="3.5"/>',image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',star:'<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',store:'<path d="M3 10h18l-1 11H4L3 10Z"/><path d="m3 10 2-7h14l2 7M8 10v3m8-3v3"/>',wallet:'<path d="M4 6h15a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"/><path d="M21 11h-5a2 2 0 0 0 0 4h5"/>',file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',trash:'<path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6m4 4v7m6-7v7"/>',edit:'<path d="m16 4 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z"/>',checkcircle:'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',logout:'<path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',spark:'<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2Z"/>',bookmark:'<path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4z"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',chart:'<path d="M3 3v18h18M8 15l4-4 3 3 6-7"/>',briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18m-11 0v2h4v-2"/>'
};
const $=id=>document.getElementById(id);
const ic=(name,size=17,extra='')=>`<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="${extra}">${iconPaths[name]||iconPaths.spark}</svg>`;
const CAT={phones:'ទូរស័ព្ទ & អេឡិចត្រូនិក',vehicles:'រថយន្ត & ម៉ូតូ',property:'អចលនទ្រព្យ',fashion:'សម្លៀកបំពាក់',furniture:'គ្រឿងសង្ហារិម'};
const CATICON={all:'grid',phones:'phone',vehicles:'car',property:'home',fashion:'shirt',furniture:'sofa'};
let supabaseClient=null,session=null,sessionRefreshPromise=null,me=null,pendingPhone=null,products=[],savedIds=new Set(),favoritePending=new Set(),activeCategory='all',searchTerm='',currentProduct=null,currentVendor=null,profileTab='saved',authMode='login',currentOfferProduct=null,selectedProductImages=[],sellerDocPreviewUrl=null,telegramBotUsername='',telegramLoginWidgetMounted=false,telegramProfileWidgetMounted=false;
const DEFAULT_MAINTENANCE_MESSAGE='ប្រព័ន្ធកំពុងធ្វើការអភិវឌ្ឍន៍ និងបន្ថែមមុខងារថ្មីៗ សូមអធ្យាស្រ័យចំពោះការរំខាន!';let maintenanceMode=false,maintenanceMessage=DEFAULT_MAINTENANCE_MESSAGE,faviconUrl='';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>'$'+Number(v||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2});
const fmtDate=v=>v?new Date(v).toLocaleDateString('km-KH',{year:'numeric',month:'short',day:'numeric'}):'—';
const verifiedBadge=()=>`<span class="verified">${ic('check',11)} អ្នកលក់បានផ្ទៀងផ្ទាត់</span>`;
function toast(message,type='success'){const area=$('toastArea');area.innerHTML='';const el=document.createElement('div');el.className='toast pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 text-[11px] font-semibold shadow-xl '+(type==='error'?'border-rose-200 bg-rose-50 text-rose-700':type==='warning'?'border-amber-200 bg-amber-50 text-amber-800':'border-slate-800 bg-slate-900 text-white');el.innerHTML=`<span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/10">${ic(type==='error'?'x':'check',15)}</span><span class="flex-1">${esc(message)}</span><button aria-label="បិទ">${ic('x',14)}</button>`;el.querySelector('button').onclick=()=>el.remove();area.appendChild(el);setTimeout(()=>el.remove(),3000)}
function openModal(id){closeDropdowns();$(id).classList.add('open');$(id).setAttribute('aria-hidden','false');document.body.classList.add('overflow-hidden')}
function closeModal(id){const el=$(id);if(!el)return;el.classList.remove('open');el.setAttribute('aria-hidden','true');if(!document.querySelector('.modal.open'))document.body.classList.remove('overflow-hidden')}
function closeDropdowns(){document.querySelectorAll('.dropdown').forEach(x=>x.classList.remove('open'))}
function toggleDrop(id){const el=$(id),open=el.classList.contains('open');closeDropdowns();if(!open)el.classList.add('open')}
function showView(name){const role=me?.isAdmin?'admin':me?.vendor?.status==='approved'?'seller':'buyer';if(['profile','seller'].includes(name)&&!session){openAuth();return}if(name==='admin'&&!me?.isAdmin){toast('មុខងារនេះសម្រាប់ Admin ប៉ុណ្ណោះ។','error');return}if(name==='seller'&&me?.vendor?.status!=='approved'){toast(me?.vendor?.status==='pending'?'ពាក្យអ្នកលក់កំពុងរង់ចាំការអនុម័ត។':'សូមចុះឈ្មោះក្លាយជាអ្នកលក់ជាមុនសិន។','warning');if(!me?.vendor)openSellerModal();return}document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));$('view-'+name)?.classList.add('active');try{sessionStorage.setItem('ecomstore.activeView',name)}catch(error){console.warn('Could not save active page:',error)}closeDropdowns();window.scrollTo({top:0,behavior:'smooth'});if(name==='profile')void renderProfile();if(name==='seller')void renderSeller();if(name==='admin')void renderAdmin();void role}
function isAdmin(){return Boolean(me?.isAdmin)}
function applyMaintenanceUI(){const adminPreview=maintenanceMode&&isAdmin(),blocked=maintenanceMode&&!isAdmin();document.body.classList.toggle('maintenance-active',blocked);$('maintenanceOverlay').classList.toggle('hidden',!blocked);$('maintenanceOverlay').setAttribute('aria-hidden',String(!blocked));$('maintenanceOverlayMessage').textContent=maintenanceMessage;$('maintenanceAdminPill').classList.toggle('hidden',!adminPreview);document.body.classList.add('maintenance-ready')}
function applyFavicon(url){if(!url)return;faviconUrl=url;let link=document.querySelector('link[data-site-favicon]');if(!link){link=document.createElement('link');link.rel='icon';link.dataset.siteFavicon='true';document.head.appendChild(link)}link.href=url;link.removeAttribute('type');if($('faviconPreview'))$('faviconPreview').src=url}
function isVerifiedSeller(){return me?.vendor?.status==='approved'}
function profileName(){return me?.profile?.display_name||session?.user?.user_metadata?.display_name||session?.user?.email?.split('@')[0]||'គណនីអ្នកប្រើប្រាស់'}
function syncHeader(){const logged=Boolean(session),verified=isVerifiedSeller(),admin=isAdmin();$('navName').textContent=logged?profileName():'ភ្ញៀវ';$('menuUserName').textContent=logged?profileName():'សួស្តី!';$('menuUserStatus').textContent=admin?'អ្នកគ្រប់គ្រង':verified?'អ្នកលក់បានផ្ទៀងផ្ទាត់':me?.vendor?.status==='pending'?'កំពុងរង់ចាំការផ្ទៀងផ្ទាត់':logged?'អ្នកទិញ':'មិនទាន់ចូលគណនី';$('navRole').textContent=admin?'Admin':verified?'Seller':logged?'Buyer':'Guest';$('navAvatar').src=me?.profile?.avatar_url||'https://i.pravatar.cc/100?img=12';$('postAdBtn').classList.toggle('hidden',!logged);$('mobilePostBtn').classList.toggle('hidden',!logged);$('profileMenu').querySelector('[data-action="seller-dashboard"]').classList.toggle('hidden',!verified);$('profileMenu').querySelector('[data-action="admin"]').classList.toggle('hidden',!admin);const accountAction=$('profileMenu').querySelector('[data-action="login"],[data-action="logout"]');if(accountAction){accountAction.textContent=logged?'ចាកចេញ':'ចូលគណនី';accountAction.dataset.action=logged?'logout':'login'}$('profileMenu').querySelector('[data-action="profile"]').classList.toggle('hidden',!logged);$('profileMenu').querySelector('[data-action="saved"]').classList.toggle('hidden',!logged);}
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
function setAuthMode(mode){$('telegramSignInBtn')?.classList.toggle('hidden',mode!=='login');$('telegramLoginWidgetWrap')?.classList.toggle('hidden',mode==='verifyPhone');$('telegramRecoveryForm')?.classList.add('hidden');$('authForm')?.classList.remove('hidden');$('forgotPasswordBtn')?.classList.remove('hidden');document.querySelector('#authModal .mb-4.grid')?.classList.remove('hidden');authMode=mode;const register=mode==='register',verify=mode==='verifyPhone';$('authOtp').required=verify;$('authOtpWrap').classList.toggle('hidden',!verify);$('authNameWrap').classList.toggle('hidden',!register);$('authName').required=register;$('authIdentity').readOnly=verify;$('authIdentity').parentElement.classList.remove('hidden');$('authPassword').parentElement.classList.toggle('hidden',verify);document.querySelector('[data-auth-mode="login"]').parentElement.classList.toggle('hidden',verify);$('authTitle').textContent=verify?'ផ្ទៀងផ្ទាត់លេខទូរស័ព្ទ':register?'បង្កើតគណនី 7inOne':'សូមស្វាគមន៍មកកាន់ 7inOne';$('authSubmit').textContent=verify?'ផ្ទៀងផ្ទាត់លេខកូដ':register?'បង្កើតគណនី':'ចូលគណនី';$('authHint').textContent=verify?'សូមបញ្ចូលលេខកូដ SMS ដែលបានផ្ញើទៅលេខទូរស័ព្ទរបស់អ្នក។':'ប្រើលេខទូរស័ព្ទ ឬអ៊ីមែលដែលភ្ជាប់ជាមួយគណនី Supabase របស់អ្នក។';if(!verify)$('authOtp').value='';document.querySelectorAll('[data-auth-mode]').forEach(b=>{const active=b.dataset.authMode===mode;b.classList.toggle('bg-white',active);b.classList.toggle('shadow',active);b.classList.toggle('text-slate-500',!active)})}
async function loadProducts(){const grid=$('productGrid');grid.setAttribute('aria-busy','true');grid.classList.add('hidden');$('emptyHome').classList.add('hidden');$('skeletonGrid').classList.remove('hidden');const params=new URLSearchParams({page:'1',limit:'50'});if(searchTerm)params.set('q',searchTerm);if(activeCategory!=='all')params.set('category',activeCategory);try{const res=await api('/api/products?'+params.toString());products=res.data||[];renderProducts();}catch(error){products=[];renderProducts();toast('មិនអាចទាញយកទំនិញបានទេ៖ '+error.message,'error')}finally{$('skeletonGrid').classList.add('hidden');grid.classList.remove('hidden');grid.setAttribute('aria-busy','false')}}
function productImage(p){return p.product_images?.find(x=>x.image_url)?.image_url||''}
function productCard(p,index){const image=productImage(p),saved=savedIds.has(p.id),rating=p.seller_rating?Number(p.seller_rating).toFixed(1):'—',count=p.seller_review_count||0;return `<article class="product-card group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_18px_rgba(30,41,59,.035)]" style="animation-delay:${Math.min(index,12)*45}ms"><div class="relative aspect-[1.18] overflow-hidden bg-slate-100"><button class="absolute inset-0 z-[1] h-full w-full" data-action="view" data-id="${esc(p.id)}" aria-label="មើល ${esc(p.title)}"></button>${image?`<img src="${esc(image)}" alt="${esc(p.title)}" loading="lazy" class="product-img h-full w-full object-cover">`:`<div class="absolute inset-0 grid place-items-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">${ic('image',36)}</div>`}<span class="absolute left-2.5 top-2.5 z-[2] rounded-lg bg-white/95 px-2.5 py-1 text-[9px] font-bold text-slate-600 shadow-sm">${esc(p.condition||'ទំនិញ')}</span><button type="button" class="heart ${saved?'saved text-rose-500 fill-rose-500':'text-slate-500'} absolute right-2.5 top-2.5 z-[3] grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-sm" data-action="save" data-id="${esc(p.id)}" aria-label="${saved?'ដកចេញពីបញ្ជីដែលបានរក្សាទុក':'រក្សាទុកទំនិញ'}" aria-pressed="${saved?'true':'false'}" aria-busy="false">${ic('heart',16)}</button></div><div class="p-3 sm:p-3.5"><p class="mb-1.5 truncate text-[10px] font-semibold text-indigo-500">${esc(CAT[p.category]||p.category||'ទំនិញ')}</p><button class="block min-h-[40px] w-full text-left text-[12px] font-bold leading-5 text-slate-800 hover:text-indigo-600 sm:text-[13px]" data-action="view" data-id="${esc(p.id)}">${esc(p.title)}</button><div class="mt-2 flex items-center justify-between gap-1"><b class="text-[16px] text-emerald-600">${money(p.price)}</b><span class="truncate rounded-md bg-amber-50 px-1.5 py-1 text-[9px] font-semibold text-amber-600">★ ${rating} (${count})</span></div><div class="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-2.5 text-[10px] text-slate-400">${ic('pin',12)}<span class="truncate">${esc(p.location||'ទីតាំងមិនទាន់កំណត់')}</span><span class="ml-auto shrink-0">${fmtDate(p.created_at)}</span></div><div class="mt-3 flex items-center gap-2"><span class="grid h-6 w-6 place-items-center rounded-full bg-indigo-50 text-indigo-500">${ic('store',13)}</span><span class="max-w-[100px] truncate text-[10px] font-semibold text-slate-600">${esc(p.vendors?.store_name||'ហាងអ្នកលក់')}</span>${p.vendors?.status==='approved'?`<span class="grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white">${ic('check',10)}</span>`:''}<button class="ml-auto text-[10px] font-bold text-indigo-600" data-action="view" data-id="${esc(p.id)}">មើល ${ic('arrow',12,'inline')}</button></div></div></article>`}
function renderProducts(){const list=products;$('productGrid').innerHTML=list.map(productCard).join('');$('resultCount').textContent=`${list.length} មុខ`;$('listingTitle').textContent=activeCategory==='all'?'ទំនិញដែលគួរឱ្យចាប់អារម្មណ៍':CAT[activeCategory]||'ទំនិញ';$('listingSub').textContent=searchTerm?`លទ្ធផលស្វែងរកសម្រាប់ «${esc(searchTerm)}»`:'ទំនិញពិតពីហាងដែលបានចុះឈ្មោះនៅលើ 7inOne';$('emptyHome').classList.toggle('hidden',list.length>0);$('productGrid').classList.toggle('hidden',list.length===0);$('skeletonGrid').classList.add('hidden')}
function setCategory(category){activeCategory=category;$('searchCategory').value=category;document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('active',b.dataset.category===category));void loadProducts()}
function favoriteSpinner(){
  return '<svg class="animate-spin text-indigo-500" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity=".2"></circle><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path></svg>';
}
function setFavoriteHeart(button,saved,stage='idle'){
  if(!button)return;
  button.classList.toggle('saved',saved);
  button.classList.toggle('text-rose-500',saved);
  button.classList.toggle('fill-rose-500',saved);
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
  button.classList.toggle('text-rose-600',saved);
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
async function openProduct(id){try{if(session){try{await loadOrders()}catch(e){console.warn(e)}}const result=await api('/api/products/'+encodeURIComponent(id));currentProduct=result.data;const trust=await api('/api/vendors/'+encodeURIComponent(currentProduct.vendor_id)+'/ratings');currentVendor=trust.data;renderProductDetail();openModal('productModal')}catch(e){toast(e.message,'error')}}
function renderProductDetail(){const p=currentProduct,v=currentVendor;if(!p||!v)return;const images=(p.product_images||[]).filter(i=>i.image_url);const canReview=(window.myOrders||[]).filter(o=>o.status==='completed'&&(o.order_items||[]).some(i=>i.vendor_id===p.vendor_id&&i.fulfillment_status==='completed'));$('productDetail').innerHTML=`<div class="grid md:grid-cols-[1.02fr_.98fr]"><div class="relative min-h-[260px] bg-slate-100 md:min-h-[540px]">${images.length?`<img src="${esc(images[0].image_url)}" class="product-main-image absolute inset-0 h-full w-full object-cover" alt="${esc(p.title)}">`:`<div class="absolute inset-0 grid place-items-center text-slate-300">${ic('image',54)}</div>`}<span class="absolute bottom-4 left-4 rounded-lg bg-white/95 px-3 py-1.5 text-[10px] font-bold text-slate-600">${esc(p.condition||'')}</span>${images.length>1?`<div class="absolute bottom-4 right-4 flex gap-1">${images.map((im,i)=>`<button class="h-12 w-12 overflow-hidden rounded-lg border-2 ${i===0?'border-indigo-500':'border-white'}" data-image="${i}"><img class="h-full w-full object-cover" src="${esc(im.image_url)}"></button>`).join('')}</div>`:''}</div><div class="p-5 sm:p-7"><p class="text-[10px] font-bold text-indigo-600">${esc(CAT[p.category]||p.category)}</p><h2 class="mt-2 pr-8 text-xl font-bold leading-8">${esc(p.title)}</h2><div class="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-400"><span>${ic('pin',12,'inline')} ${esc(p.location||'')}</span><span>${ic('clock',12,'inline')} ${fmtDate(p.created_at)}</span><span>${ic('eye',12,'inline')} ${Number(p.view_count||0).toLocaleString()} views</span></div><p class="mt-5 text-[28px] font-bold text-emerald-600">${money(p.price)}</p><div class="my-5 border-t border-slate-100"></div><p class="text-[12px] font-bold">ព័ត៌មានអំពីទំនិញ</p><p class="mt-2 whitespace-pre-line text-[11px] leading-7 text-slate-500">${esc(p.description||'មិនទាន់មានការពិពណ៌នា។')}</p><div class="my-5 rounded-2xl border border-slate-100 bg-slate-50 p-3"><div class="flex items-center gap-3"><img src="${esc(v.profile?.avatar_url||'https://i.pravatar.cc/100?img=12')}" class="h-11 w-11 rounded-full object-cover" alt=""><div class="min-w-0 flex-1"><p class="flex flex-wrap items-center gap-2 text-[12px] font-bold">${esc(v.store_name)} ${verifiedBadge()}</p><p class="mt-1 text-[10px] text-slate-500">${renderStars(v.rating)} ${v.rating??'គ្មានការវាយតម្លៃ'} · ${v.review_count} reviews</p></div></div><div class="mt-3 grid grid-cols-3 gap-2 text-center"><div class="rounded-xl bg-white p-2"><b class="block text-sm">${v.active_listings}</b><small class="text-[9px] text-slate-400">ទំនិញលក់</small></div><div class="rounded-xl bg-white p-2"><b class="block text-sm">${v.total_views}</b><small class="text-[9px] text-slate-400">អ្នកមើល</small></div><div class="rounded-xl bg-white p-2"><b class="block text-sm">${v.review_count}</b><small class="text-[9px] text-slate-400">ការវាយតម្លៃ</small></div></div><div class="mt-4 space-y-1.5">${[5,4,3,2,1].map(star=>{const amount=Number(v.distribution?.[star-1]||0),width=v.review_count?amount/Number(v.review_count)*100:0;return `<div class="flex items-center gap-2 text-[9px]"><span class="w-8 shrink-0 text-slate-500">${star} ★</span><div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"><div class="h-full rounded-full bg-amber-400" style="width:${width}%"></div></div><span class="w-5 text-right text-slate-400">${amount}</span></div>`}).join('')}</div></div><div class="grid grid-cols-2 gap-2"><button type="button" class="rounded-xl border border-indigo-200 bg-indigo-50 py-3 text-[11px] font-bold text-indigo-700" data-product-action="save" aria-pressed="${savedIds.has(p.id)?'true':'false'}">${ic('heart',14,'inline')} ${savedIds.has(p.id)?'បានរក្សាទុក':'រក្សាទុក'}</button><button class="brand-gradient rounded-xl py-3 text-[11px] font-bold text-white" data-product-action="offer">${ic('tag',14,'inline')} តថ្លៃជាមួយអ្នកលក់</button></div><div class="mt-5 border-t border-slate-100 pt-4"><div class="flex items-center justify-between"><h3 class="text-[12px] font-bold">ការវាយតម្លៃអ្នកទិញ</h3><span class="text-[10px] text-slate-400">${v.review_count} Reviews</span></div><div class="mt-3 space-y-3">${(v.reviews||[]).slice(0,4).map(r=>`<div class="rounded-xl bg-slate-50 p-3"><div class="flex items-center justify-between"><b class="text-[10px]">${esc(r.buyer_name)}</b><span class="text-[10px] text-amber-500">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span></div><p class="mt-1 text-[10px] leading-5 text-slate-500">${esc(r.comment||'')}</p><small class="text-[9px] text-slate-400">${fmtDate(r.created_at)}</small></div>`).join('')||'<p class="text-[10px] text-slate-400">មិនទាន់មានការវាយតម្លៃទេ។</p>'}</div>${canReview.length?`<form id="reviewForm" class="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3"><p class="mb-2 text-[11px] font-bold">វាយតម្លៃអ្នកលក់</p><div class="mb-3 flex gap-1" id="reviewStars">${[1,2,3,4,5].map(n=>`<button type="button" data-rating="${n}" class="star text-2xl" aria-label="${n} ផ្កាយ">★</button>`).join('')}</div><select id="reviewOrder" class="field mb-2">${canReview.map(o=>`<option value="${esc(o.id)}">ការបញ្ជាទិញ #${esc(o.id.slice(0,8))}</option>`).join('')}</select><textarea id="reviewComment" class="field mb-2" maxlength="1200" placeholder="សរសេរមតិរបស់អ្នក..."></textarea><button class="brand-gradient w-full rounded-xl py-2.5 text-[11px] font-bold text-white">ផ្ញើការវាយតម្លៃ</button></form>`:`<p class="mt-3 text-[10px] text-slate-400">ការវាយតម្លៃអាចធ្វើបានក្រោយការបញ្ជាទិញបានបញ្ចប់។</p>`}</div></div></div>`;
let selectedRating=0;const starWrap=$('reviewStars');if(starWrap){const paint=n=>starWrap.querySelectorAll('button').forEach(b=>{b.classList.toggle('active',Number(b.dataset.rating)<=n);b.classList.toggle('preview',Number(b.dataset.rating)<=n)});starWrap.addEventListener('mouseover',e=>{const b=e.target.closest('[data-rating]');if(b)paint(Number(b.dataset.rating))});starWrap.addEventListener('mouseleave',()=>paint(selectedRating));starWrap.addEventListener('click',e=>{const b=e.target.closest('[data-rating]');if(b){selectedRating=Number(b.dataset.rating);paint(selectedRating)}});$('reviewForm').addEventListener('submit',async e=>{e.preventDefault();if(!requireLogin())return;if(!selectedRating){toast('សូមជ្រើសរើសចំនួនផ្កាយ។','warning');return}try{await api(`/api/vendors/${v.id}/reviews`,{method:'POST',body:JSON.stringify({rating:selectedRating,comment:$('reviewComment').value,order_id:$('reviewOrder').value})});toast('អរគុណសម្រាប់ការវាយតម្លៃ!');await openProduct(p.id);await loadProducts()}catch(err){toast(err.message,'error')}})}
$('productDetail').querySelectorAll('[data-image]').forEach(b=>b.addEventListener('click',()=>{$('productDetail').querySelector('.product-main-image')?.setAttribute('src',images[Number(b.dataset.image)].image_url)}));$('productDetail').querySelector('[data-product-action="save"]')?.addEventListener('click',e=>{e.stopPropagation();saveAction(p.id,e.currentTarget)});$('productDetail').querySelector('[data-product-action="offer"]')?.addEventListener('click',()=>{if(!requireLogin())return;currentOfferProduct=p;$('offerProductName').textContent=p.title+' · '+money(p.price);$('offerAmount').value=p.price;closeModal('productModal');openModal('offerModal')});const buyButton=document.createElement('button');buyButton.type='button';buyButton.className='mt-2 w-full rounded-xl brand-gradient py-3 text-[11px] font-bold text-white shadow-lg shadow-indigo-100';buyButton.textContent='ទិញឥឡូវនេះ';buyButton.addEventListener('click',()=>openCheckout(p));$('productDetail').querySelector('[data-product-action="offer"]')?.parentElement?.insertAdjacentElement('afterend',buyButton);}
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
  $('profileAvatar').src=p.avatar_url||'https://i.pravatar.cc/160?img=12';
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
      const order=result.data;closeModal('checkoutModal');closeModal('productModal');toast('បានបញ្ជាទិញជោគជ័យ។ លេខបញ្ជាទិញ #'+String(order.id).slice(0,8));await Promise.all([loadOrders(),loadProducts()]);
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
async function renderAdmin(){if(!isAdmin())return;if($('faviconPreview'))$('faviconPreview').src=faviconUrl||'/favicon.ico';if($('faviconStatus'))$('faviconStatus').textContent=faviconUrl?'បានកំណត់ Logo ផ្ទាល់ខ្លួនរួចរាល់។':'កំពុងប្រើ Logo លំនាំដើម។';$('maintenanceToggle').checked=maintenanceMode;$('maintenanceMessageInput').value=maintenanceMessage;$('maintenanceStatusHint').textContent='ស្ថានភាពបច្ចុប្បន្ន៖ '+(maintenanceMode?'កំពុងអភិវឌ្ឍន៍':'កំពុងដំណើរការ');try{const res=await api('/api/admin/vendors'),vendors=res.data||[];$('adminPendingCount').textContent=vendors.filter(v=>v.status==='pending').length;$('adminApprovedCount').textContent=vendors.filter(v=>v.status==='approved').length;$('adminRejectedCount').textContent=vendors.filter(v=>['rejected','blocked'].includes(v.status)).length;$('adminApplications').innerHTML=vendors.map(v=>`<div class="rounded-2xl border border-slate-100 p-4"><div class="flex flex-wrap items-start justify-between gap-3"><div class="min-w-0 flex-1"><b class="text-[12px]">${esc(v.store_name)}</b><p class="mt-1 text-[10px] text-slate-500">${esc(v.profiles?.display_name||'')} · ${esc(v.contact_phone||v.profiles?.phone||'')} </p><p class="mt-1 text-[10px] text-slate-500">${esc(v.address||'')}</p><p class="mt-1 text-[9px] text-slate-400">${fmtDate(v.created_at)}</p><span class="mt-2 inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${v.status==='approved'?'bg-emerald-50 text-emerald-700':v.status==='pending'?'bg-amber-50 text-amber-700':'bg-rose-50 text-rose-700'}">${vendorStatus(v.status)}</span></div><div class="flex gap-2"><button data-admin-doc="${esc(v.id)}" class="rounded-lg border px-3 py-2 text-[10px] font-bold" ${v.document_url?'':'disabled'}>${ic('file',13,'inline')} មើលឯកសារ</button></div></div>${v.status==='pending'?`<div class="mt-3 flex flex-wrap gap-2"><button data-admin-review="approved" data-id="${esc(v.id)}" class="rounded-lg bg-emerald-500 px-4 py-2 text-[10px] font-bold text-white">អនុម័ត</button><button data-admin-review="rejected" data-id="${esc(v.id)}" class="rounded-lg bg-rose-50 px-4 py-2 text-[10px] font-bold text-rose-600">បដិសេធ</button></div>`:''}${v.review_note?`<p class="mt-2 text-[10px] text-rose-600">ចំណាំ៖ ${esc(v.review_note)}</p>`:''}</div>`).join('')||'<p class="py-8 text-center text-[11px] text-slate-400">មិនទាន់មានពាក្យស្នើសុំអ្នកលក់។</p>';window.adminVendors=vendors}catch(e){toast('មិនអាចផ្ទុក Admin៖ '+e.message,'error')}}
function productFormPayload(){return {title:$('productTitle').value.trim(),price:Number($('productPrice').value),category:$('productCategory').value,location:$('productLocation').value,condition:$('productCondition').value,description:$('productDescription').value.trim(),stock:1}}

// Setup icons and server-authenticated interface.
$('logoIcon').innerHTML=ic('bag',22);$('searchIcon').innerHTML=ic('search',18);$('searchBtn').innerHTML=ic('search',17);$('postIcon').innerHTML=ic('plus',17);$('mobilePostBtn').innerHTML=ic('plus',19);$('bellIcon').innerHTML=ic('bell',18);$('chevronIcon').innerHTML=ic('chev',13);$('menuUserIcon').innerHTML=ic('user',15);$('menuStoreIcon').innerHTML=ic('store',15);$('menuAdminIcon').innerHTML=ic('shield',15);$('menuSaveIcon').innerHTML=ic('heart',15);$('menuLoginIcon').innerHTML=ic('logout',15);$('heroShield').innerHTML=ic('shield',15);$('heroUsers').innerHTML=ic('users',15);$('catAll').innerHTML=ic('grid',15);$('catPhone').innerHTML=ic('phone',15);$('catCar').innerHTML=ic('car',15);$('catHome').innerHTML=ic('home',15);$('catFashion').innerHTML=ic('shirt',15);$('catFurniture').innerHTML=ic('sofa',15);$('emptyIcon').innerHTML=ic('search',25);$('coverCam').innerHTML=ic('camera',14);$('avatarCam').prepend(document.createTextNode(''));$('avatarCam').insertAdjacentHTML('afterbegin',ic('camera',13));$('sellerGateIcon').innerHTML=ic('shield',23);$('kpiListingsIcon').innerHTML=ic('grid',17);$('kpiViewsIcon').innerHTML=ic('eye',17);$('kpiRatingIcon').innerHTML=ic('star',17);$('kpiSalesIcon').innerHTML=ic('wallet',17);$('addProductIcon').innerHTML=ic('plus',14);$('sellerDocThumb').innerHTML=ic('file',23);
$('sellerDocument').addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;$('sellerDocName').textContent=f.name;$('sellerDocThumb').innerHTML=ic(f.type==='application/pdf'?'file':'image',22);$('sellerDocPreview').classList.remove('hidden');if(sellerDocPreviewUrl)URL.revokeObjectURL(sellerDocPreviewUrl);sellerDocPreviewUrl=URL.createObjectURL(f);$('sellerDocPreview').innerHTML=f.type==='application/pdf'?`<iframe src="${sellerDocPreviewUrl}" class="h-44 w-full"></iframe>`:`<img src="${sellerDocPreviewUrl}" class="max-h-48 w-full object-contain">`});
$('productImage').setAttribute('multiple','multiple');$('productImage').setAttribute('accept','image/jpeg,image/png,image/webp');$('productImage').addEventListener('change',e=>{selectedProductImages=Array.from(e.target.files||[]).slice(0,5);$('productImageName').textContent=selectedProductImages.length?`${selectedProductImages.length} រូបបានជ្រើសរើស`:'ជ្រើសរើសរូបភាពផលិតផល';if(selectedProductImages[0]){const url=URL.createObjectURL(selectedProductImages[0]);$('productImageThumb').innerHTML=`<img src="${url}" class="h-full w-full object-cover">`}});
$('searchForm').addEventListener('submit',e=>{e.preventDefault();searchTerm=$('searchInput').value.trim();activeCategory=$('searchCategory').value;document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('active',b.dataset.category===activeCategory));void loadProducts();$('view-home').scrollIntoView({behavior:'smooth'})});$('searchInput').addEventListener('input',e=>{searchTerm=e.target.value.trim();clearTimeout(window.searchWait);window.searchWait=setTimeout(()=>void loadProducts(),350)});$('searchCategory').addEventListener('change',e=>setCategory(e.target.value));$('categoryStrip').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b)setCategory(b.dataset.category)});document.querySelectorAll('[data-tag]').forEach(b=>b.addEventListener('click',()=>{searchTerm=b.dataset.tag;$('searchInput').value=searchTerm;void loadProducts()}));$('sortSelect').addEventListener('change',()=>{const sort=$('sortSelect').value;products.sort((a,b)=>sort==='low'?Number(a.price)-Number(b.price):sort==='high'?Number(b.price)-Number(a.price):new Date(b.created_at)-new Date(a.created_at));renderProducts()});$('clearFilters').addEventListener('click',()=>{searchTerm='';activeCategory='all';$('searchInput').value='';$('searchCategory').value='all';setCategory('all')});
$('productGrid').addEventListener('click',event=>{const heart=event.target.closest('[data-action="save"]');if(heart){event.preventDefault();event.stopPropagation();saveAction(heart.dataset.id,heart);return}const view=event.target.closest('[data-action="view"]');if(view)void openProduct(view.dataset.id)});
$('postAdBtn').addEventListener('click',()=>{if(!requireLogin())return;if(!isVerifiedSeller()){openSellerModal();return}renderProductForm()});$('mobilePostBtn').addEventListener('click',()=>$('postAdBtn').click());$('bannerPostBtn').addEventListener('click',()=>$('postAdBtn').click());$('profileApplyTop').addEventListener('click',()=>{if(me?.vendor) {profileTab='seller';document.querySelector('[data-profile-tab="seller"]').click()} else openSellerModal()});$('sellerGateApply').addEventListener('click',openSellerModal);$('addProductBtn').addEventListener('click',()=>renderProductForm());
$('notificationBtn').addEventListener('click',e=>{e.stopPropagation();toggleDrop('notificationMenu')});$('profileMenuBtn').addEventListener('click',e=>{e.stopPropagation();toggleDrop('profileMenu')});document.addEventListener('click',e=>{if(!e.target.closest('#profileMenu')&&!e.target.closest('#profileMenuBtn')&&!e.target.closest('#notificationMenu')&&!e.target.closest('#notificationBtn'))closeDropdowns()});document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.action;if(a==='profile')showView('profile');if(a==='seller-dashboard')showView('seller');if(a==='admin')showView('admin');if(a==='saved'){showView('profile');profileTab='saved';document.querySelector('[data-profile-tab="saved"]').click()}if(a==='login')openAuth();if(a==='logout')void supabaseClient.auth.signOut().then(()=>toast('បានចាកចេញពីគណនី។'))}));document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
document.querySelectorAll('[data-auth-mode]').forEach(b=>b.addEventListener('click',()=>setAuthMode(b.dataset.authMode)));$('telegramSignInBtn').addEventListener('click',async()=>{const button=$('telegramSignInBtn');button.disabled=true;const popup=window.open('about:blank','_blank');try{const response=await fetch('/api/auth/telegram/login/start',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.error||'មិនអាចចាប់ផ្ដើម Telegram Login បានទេ។');if(popup)popup.location.href=payload.data.url;else window.location.href=payload.data.url;toast('សូមចុច Start ក្នុង Telegram Bot។ បន្ទាប់មកចុចតំណ Login ដែល Bot ផ្ញើមក។','warning')}catch(error){popup?.close();toast(error.message,'error')}finally{button.disabled=false}});
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
async function uploadProfileMedia(file,type){if(!file||!requireLogin())return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){toast('រូបភាពត្រូវជា JPG, PNG ឬ WEBP និងតិចជាង ៥MB។','warning');return}const form=new FormData();form.append('type',type);form.append('file',file);try{await api('/api/me/media',{method:'POST',body:form});await loadIdentity();syncHeader();if(type==='avatar')$('profileAvatar').src=me.profile.avatar_url;else $('view-profile').querySelector('.cover').style.backgroundImage=`linear-gradient(115deg,rgba(49,46,129,.38),rgba(79,70,229,.08)),url("${me.profile.cover_url}")`;toast('បានរក្សាទុករូបភាពទៅកាន់ Storage រួចរាល់។')}catch(e){toast(e.message,'error')}}$('avatarUpload').addEventListener('change',e=>void uploadProfileMedia(e.target.files?.[0],'avatar'));$('coverUpload').addEventListener('change',e=>void uploadProfileMedia(e.target.files?.[0],'cover'));
document.querySelectorAll('[data-profile-tab]').forEach(b=>b.addEventListener('click',()=>{profileTab=b.dataset.profileTab;document.querySelectorAll('[data-profile-tab]').forEach(x=>x.classList.toggle('active',x===b));void renderProfileTab()}));document.querySelectorAll('[data-profile-jump]').forEach(b=>b.addEventListener('click',()=>{const tab=document.querySelector('[data-profile-tab="'+b.dataset.profileJump+'"]');tab?.click();$('profileTabContent').scrollIntoView({behavior:'smooth',block:'nearest'})}));$('profileTabContent').addEventListener('click',e=>{const v=e.target.closest('[data-open-product]'),r=e.target.closest('[data-remove-saved]');if(v)void openProduct(v.dataset.openProduct);if(r)saveAction(r.dataset.removeSaved, r)});
$('sellerApplyForm').addEventListener('submit',async e=>{e.preventDefault();if(!requireLogin())return;const file=$('sellerDocument').files?.[0];if(!file){toast('សូមភ្ជាប់ឯកសារផ្ទៀងផ្ទាត់។','warning');return}if(file.size>5*1024*1024){toast('ឯកសារត្រូវតិចជាង ៥MB។','warning');return}const form=new FormData();form.append('store_name',$('shopName').value.trim());form.append('contact_phone',$('shopContact').value.trim());form.append('address',$('shopAddress').value.trim());form.append('description','ហាងលក់នៅលើ 7inOne');form.append('document',file);const submit=$('sellerApplyForm').querySelector('button[type="submit"]')||$('sellerApplyForm').querySelector('button:last-child');submit.disabled=true;try{await api('/api/vendors/register',{method:'POST',body:form});await loadIdentity();syncHeader();closeModal('sellerModal');profileTab='seller';showView('profile');toast('បានដាក់ពាក្យរួចរាល់។ កំពុងរង់ចាំ Admin ផ្ទៀងផ្ទាត់។')}catch(err){toast(err.message,'error')}finally{submit.disabled=false}});
$('productForm').addEventListener('submit',async e=>{e.preventDefault();if(!isVerifiedSeller()){toast('ហាងមិនទាន់បានផ្ទៀងផ្ទាត់ទេ។','warning');return}const id=$('editProductId').value,payload=productFormPayload(),button=$('productForm').querySelector('button[type="submit"]')||$('productForm').querySelector('button:last-child');button.disabled=true;try{let product;if(id){const r=await api('/api/products/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify(payload)});product=r.data}else{const r=await api('/api/products',{method:'POST',body:JSON.stringify(payload)});product=r.data}if(selectedProductImages.length){const form=new FormData();selectedProductImages.forEach(f=>form.append('images',f));await api(`/api/products/${product.id}/images`,{method:'POST',body:form})}closeModal('productFormModal');selectedProductImages=[];toast(id?'បានបញ្ជូនការកែប្រែទំនិញទៅរក្សាទុក។':'បានបង្កើតទំនិញ។ ទំនិញថ្មីនឹងរង់ចាំ Admin អនុម័ត។');await renderSeller();await loadProducts()}catch(err){toast(err.message,'error')}finally{button.disabled=false}});
$('sellerProducts').addEventListener('click',async e=>{const b=e.target.closest('[data-seller-action]');if(!b)return;const id=b.dataset.id;try{if(b.dataset.sellerAction==='edit'){const data=await api('/api/vendor/products');const p=data.data.find(x=>x.id===id);if(p)renderProductForm(p)}if(b.dataset.sellerAction==='sold'){if(!confirm('សម្គាល់ទំនិញនេះថាលក់រួចមែនទេ?'))return;await api('/api/products/'+id,{method:'PATCH',body:JSON.stringify({status:'sold'})});toast('បានសម្គាល់ថាលក់រួច។')}if(b.dataset.sellerAction==='delete'){if(!confirm('លុបទំនិញនេះមែនទេ?'))return;await api('/api/products/'+id,{method:'DELETE'});toast('បានលុប ឬបិទទំនិញរួចរាល់។')}await renderSeller();await loadProducts()}catch(err){toast(err.message,'error')}});
$('sellerDashboardContent').addEventListener('click',async e=>{const b=e.target.closest('[data-offer-action]');if(!b)return;try{await api('/api/offers/'+b.dataset.id,{method:'PATCH',body:JSON.stringify({status:b.dataset.offerAction})});toast('បានកែប្រែសំណើតថ្លៃ។');await renderSeller()}catch(err){toast(err.message,'error')}});
$('sellerDashboardContent').addEventListener('click',async e=>{const b=e.target.closest('[data-order-status]');if(!b)return;try{await api('/api/vendor/orders/'+encodeURIComponent(b.dataset.orderId),{method:'PATCH',body:JSON.stringify({status:b.dataset.orderStatus})});toast('បានធ្វើបច្ចុប្បន្នភាពការបញ្ជាទិញ។');await renderSeller();await loadOrders()}catch(err){toast(err.message,'error')}});
$('faviconFile').addEventListener('change',event=>{const file=event.target.files?.[0];if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>2*1024*1024){toast('សូមជ្រើសរើស PNG, JPG ឬ WEBP ទំហំមិនលើស 2MB។','warning');event.target.value='';return}const preview=URL.createObjectURL(file);$('faviconPreview').src=preview;$('faviconStatus').textContent='រូបភាពថ្មីត្រូវបានជ្រើសរើស។ ចុចរក្សាទុកដើម្បីអនុវត្ត។'});
$('saveFavicon').addEventListener('click',async()=>{const file=$('faviconFile').files?.[0];if(!file){toast('សូមជ្រើសរើសរូប Logo ជាមុនសិន។','warning');return}const button=$('saveFavicon'),form=new FormData();form.append('file',file);button.disabled=true;button.textContent='កំពុង Upload...';try{const result=await api('/api/admin/favicon',{method:'POST',body:form});faviconUrl=result.data.faviconUrl;applyFavicon(faviconUrl);$('faviconStatus').textContent='បានប្ដូរ Favicon របស់ Website រួចរាល់។';$('faviconFile').value='';toast('បានរក្សាទុក Website Favicon រួចរាល់។')}catch(error){toast(error.message,'error')}finally{button.disabled=false;button.textContent='រក្សាទុក Logo'}});
$('telegramDiagnosticsBtn').addEventListener('click',()=>void runTelegramDiagnostics());$('saveMaintenanceSettings').addEventListener('click',async()=>{const button=$('saveMaintenanceSettings');button.disabled=true;try{const result=await api('/api/admin/settings',{method:'PATCH',body:JSON.stringify({maintenanceMode:$('maintenanceToggle').checked,maintenanceMessage:$('maintenanceMessageInput').value.trim()||DEFAULT_MAINTENANCE_MESSAGE})});maintenanceMode=result.data.maintenanceMode;maintenanceMessage=result.data.maintenanceMessage;$('maintenanceMessageInput').value=maintenanceMessage;$('maintenanceStatusHint').textContent='ស្ថានភាពបច្ចុប្បន្ន៖ '+(maintenanceMode?'កំពុងអភិវឌ្ឍន៍':'កំពុងដំណើរការ');applyMaintenanceUI();toast('បានរក្សាទុកស្ថានភាពប្រព័ន្ធរួចរាល់។')}catch(error){toast(error.message,'error')}finally{button.disabled=false}});
$('maintenanceAdminLogin').addEventListener('click',event=>{event.preventDefault();openAuth('login')});
$('adminApplications').addEventListener('click',async e=>{const doc=e.target.closest('[data-admin-doc]'),review=e.target.closest('[data-admin-review]');if(doc){const vendor=(window.adminVendors||[]).find(v=>v.id===doc.dataset.adminDoc);if(vendor?.document_url){const preview=window.open('about:blank','_blank');try{const response=await fetch(vendor.document_url,{headers:{Authorization:'Bearer '+session.access_token},cache:'no-store'});if(!response.ok)throw new Error((await response.json().catch(()=>({}))).error||'មិនអាចទាញយកឯកសារបានទេ');const fileUrl=URL.createObjectURL(await response.blob());if(preview)preview.location.href=fileUrl;else window.open(fileUrl,'_blank','noopener,noreferrer');setTimeout(()=>URL.revokeObjectURL(fileUrl),60000)}catch(error){preview?.close();toast(error.message,'error')}}else toast('មិនមានឯកសារដែលអាចបើកបាន។','warning')}if(review){const status=review.dataset.adminReview;if(status==='rejected'&&!confirm('បដិសេធពាក្យស្នើសុំនេះមែនទេ?'))return;try{await api('/api/admin/vendors/'+review.dataset.id,{method:'PATCH',body:JSON.stringify({status,review_note:status==='rejected'?'សូមទាក់ទងក្រុមការងារដើម្បីទទួលព័ត៌មានបន្ថែម។':''})});toast(status==='approved'?'បានអនុម័តអ្នកលក់។':'បានបដិសេធពាក្យស្នើសុំ។');await renderAdmin()}catch(err){toast(err.message,'error')}}});
$('offerForm').addEventListener('submit',async e=>{e.preventDefault();if(!requireLogin()||!currentOfferProduct)return;const amount=Number($('offerAmount').value);if(!Number.isFinite(amount)||amount<=0){toast('សូមបញ្ចូលតម្លៃត្រឹមត្រូវ។','warning');return}try{await api('/api/products/'+currentOfferProduct.id+'/offers',{method:'POST',body:JSON.stringify({offer_price:amount,message:$('offerMessage').value.trim()})});closeModal('offerModal');toast('បានផ្ញើសំណើតថ្លៃទៅអ្នកលក់រួចរាល់។');currentOfferProduct=null}catch(err){toast(err.message,'error')}});
$('notificationList').innerHTML='<p class="py-4 text-center text-[10px] text-slate-400">ការជូនដំណឹងថ្មីៗនឹងបង្ហាញនៅទីនេះ។</p>';
document.querySelectorAll('.close-btn').forEach(b=>b.innerHTML=ic('x',16));document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));document.querySelectorAll('.modal').forEach(m=>m.addEventListener('mousedown',e=>{if(e.target===m)closeModal(m.id)}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.modal.open').forEach(m=>closeModal(m.id));closeDropdowns()}});

async function boot(){try{const cfg=await fetch('/api/config',{cache:'no-store'}).then(r=>r.json());maintenanceMode=cfg.maintenanceMode===true;maintenanceMessage=String(cfg.maintenanceMessage||DEFAULT_MAINTENANCE_MESSAGE);faviconUrl=String(cfg.faviconUrl||'');if(faviconUrl)applyFavicon(faviconUrl);if(!cfg.supabaseUrl||!cfg.supabaseAnonKey)throw new Error('Missing Supabase browser configuration');if(!window.supabase?.createClient)throw new Error('Supabase browser library failed to load');supabaseClient=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);telegramBotUsername=String(cfg.telegramBotUsername||'').replace(/^@/,'');if($('authModal')?.classList.contains('open')&&!telegramLoginWidgetMounted)telegramLoginWidgetMounted=mountTelegramWidget('telegramLoginWidget','onTelegramAuth');
      // Subscribe before reading the stored session so INITIAL_SESSION and token events are not missed.
      // Keep this callback synchronous: Supabase auth callbacks must not await Supabase operations.
      supabaseClient.auth.onAuthStateChange((event,newSession)=>{
        session=newSession;
        if(event==='INITIAL_SESSION')return;
        Promise.resolve().then(async()=>{
          try{
            if(session){await loadIdentity();try{await loadSaved();await loadOrders()}catch(e){console.warn(e)}}
            else me=null;
            syncHeader();applyMaintenanceUI();
            if($('view-profile').classList.contains('active')&&!session)showView('home');
          }catch(e){console.warn('Auth state update failed:',e.message);toast(e.message,'error')}
        });
      });
      await refreshSession();
      if(session){try{await loadSaved();await loadOrders()}catch(e){console.warn(e)}}await loadProducts();let savedView='home';try{savedView=sessionStorage.getItem('ecomstore.activeView')||'home'}catch(error){console.warn('Could not read saved page:',error)}if(!['home','profile','seller','admin'].includes(savedView)||(['profile','seller','admin'].includes(savedView)&&!session)||(savedView==='admin'&&!me?.isAdmin)||(savedView==='seller'&&me?.vendor?.status!=='approved')){try{sessionStorage.removeItem('ecomstore.activeView')}catch{}savedView='home'}showView(savedView);document.documentElement.classList.remove('route-restoring');}catch(e){document.documentElement.classList.remove('route-restoring');console.error(e);applyMaintenanceUI();toast('មិនអាចភ្ជាប់ប្រព័ន្ធគណនីបានទេ៖ '+e.message,'error');$('listingSub').textContent='សូមកំណត់ Supabase Auth និង Environment Variables ដើម្បីបើកផ្សារ។';$('skeletonGrid').classList.add('hidden');$('emptyHome').classList.remove('hidden')}}
void boot();
