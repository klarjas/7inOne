'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '../../lib/supabase';
import { ArrowLeft, Store, Package, ClipboardList, ShieldCheck, Plus, RefreshCw, LogOut, Check, X, Upload, Ban } from 'lucide-react';

type AnyRow = Record<string, any>;
type Tab = 'overview' | 'products' | 'supplier-products' | 'orders' | 'vendors' | 'moderation' | 'shop';
export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('customer');
  const [vendor, setVendor] = useState<AnyRow | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const [data, setData] = useState<AnyRow[]>([]);
  const [overview, setOverview] = useState<AnyRow>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productStatus, setProductStatus] = useState('all');
  const [productCategory, setProductCategory] = useState('all');
  const [productSort, setProductSort] = useState('newest');
  const [productPage, setProductPage] = useState(1);
  const productPageSize = 12;
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [nameHistory, setNameHistory] = useState<Record<string, AnyRow[]>>({});
  const [productForm, setProductForm] = useState({ title:'', description:'', category:'General', price:'', stock:'1' });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const imagePreviews = useMemo(() => selectedImages.map(file => ({ file, url: URL.createObjectURL(file) })), [selectedImages]);
  useEffect(() => () => imagePreviews.forEach(image => URL.revokeObjectURL(image.url)), [imagePreviews]);

  const api = useCallback(async (path: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const response = await fetch(path, { ...options, headers });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Request failed');
    return result.data;
  }, [token]);

  const refresh = useCallback(async () => {
    if (!token) return;
    setBusy(true); setMessage('');
    try {
      const me = await api('/api/me');
      setRole(me.profile?.role || 'customer'); setVendor(me.vendor || null);
      if (me.vendor) { setStoreName(me.vendor.store_name || ''); setStoreDescription(me.vendor.description || ''); }
      if (me.isAdmin) {
        const [stats, vendors, products, orders] = await Promise.all([
          api('/api/admin/overview'), api('/api/admin/vendors'), api('/api/admin/products'), api('/api/admin/orders')
        ]);
        setOverview(stats); 
        if (tab === 'vendors') setData(vendors);
        else if (tab === 'supplier-products') setData(await api('/api/admin/supplier-products'));
        else if (tab === 'moderation' || tab === 'products') setData(products);
        else if (tab === 'orders') setData(orders);
        else setData([]);
      } else if (me.vendor) {
        const [products, orders] = await Promise.all([api('/api/vendor/products'), api('/api/vendor/orders')]);
        if (tab === 'products') setData(products || []);
        else if (tab === 'orders') setData(orders || []);
        else setData([]);
      } else if (tab === 'orders') {
        setData(await api('/api/orders'));
      } else setData([]);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not load dashboard'); }
    finally { setBusy(false); }
  }, [api, token, tab]);

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const session = data.session;
      if (!session) { router.replace('/'); return; }
      setToken(session.access_token); setEmail(session.user.email || '');
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/');
      else { setToken(session.access_token); setEmail(session.user.email || ''); }
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [router]);

  useEffect(() => { void refresh(); }, [refresh]);

  async function applyVendor(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMessage('');
    try { await api('/api/vendors/register', { method:'POST', body: JSON.stringify({ store_name:storeName, description:storeDescription }) }); setMessage('បានដាក់ពាក្យបើកហាងរួចរាល់។ រង់ចាំ Admin អនុម័ត។'); await refresh(); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Application failed'); }
    finally { setBusy(false); }
  }
  async function createProduct(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      const created = await api('/api/products', { method:'POST', body:JSON.stringify({ ...productForm, price:Number(productForm.price), stock:Number(productForm.stock) }) });
      if (selectedImages.length) {
        const form = new FormData(); selectedImages.forEach(file => form.append('images', file));
        await api(`/api/products/${created.id}/images`, { method:'POST', body:form });
      }
      setProductForm({ title:'', description:'', category:'General', price:'', stock:'1' });
      setSelectedImages([]);
      const fileInput = document.getElementById('product-images') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';
      setMessage(role === 'admin' ? 'Admin product created successfully.' : 'ផលិតផលបានបង្កើត។ វានឹងបង្ហាញក្រោយ Admin អនុម័ត។'); await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not create product'); }
    finally { setBusy(false); }
  }
  function addProductImages(files: FileList | null) {
    if (!files) return;
    setSelectedImages(current => [...current, ...Array.from(files).filter(file => file.type.startsWith('image/'))].slice(0, 5));
  }
  async function update(path: string, body: AnyRow) {
    setBusy(true); setMessage('');
    try { await api(path, { method:'PATCH', body:JSON.stringify(body) }); setMessage('បានរក្សាទុកការផ្លាស់ប្ដូរ។'); await refresh(); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Update failed'); }
    finally { setBusy(false); }
  }
  async function removeProduct(id: string) {
    if (!confirm('លុបផលិតផលនេះមែនទេ?')) return;
    setBusy(true); try { await api(`/api/products/${id}`, { method:'DELETE' }); await refresh(); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Delete failed'); } finally { setBusy(false); }
  }
  async function signOut() { await getSupabaseBrowserClient().auth.signOut(); router.replace('/'); }

  const tabs: {id:Tab;label:string;icon:any}[] = [
    {id:'overview',label:'Overview',icon:ClipboardList},{id:'products',label:'Products',icon:Package},{id:'orders',label:'Orders',icon:Store},
    ...(role === 'admin' ? [{id:'supplier-products' as Tab,label:'Supplier Products',icon:ClipboardList},{id:'vendors' as Tab,label:'Vendors',icon:Store},{id:'moderation' as Tab,label:'Moderation',icon:ShieldCheck}] : vendor ? [{id:'shop' as Tab,label:'Shop settings',icon:Store}] : [])
  ];
  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    return data.filter(row => {
      const matchesQuery = !query || [row.title, row.category, row.id, row.vendors?.store_name].some(value => String(value || '').toLowerCase().includes(query));
      const matchesStatus = productStatus === 'all' || row.status === productStatus;
      const matchesCategory = productCategory === 'all' || String(row.category || '').toLowerCase() === productCategory;
      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [data, productSearch, productStatus, productCategory]);
  const sortedProducts = useMemo(() => {
    const rows = [...filteredProducts];
    rows.sort((a, b) => {
      if (productSort === 'title') return String(a.title || '').localeCompare(String(b.title || ''));
      if (productSort === 'price-low') return Number(a.price || 0) - Number(b.price || 0);
      if (productSort === 'price-high') return Number(b.price || 0) - Number(a.price || 0);
      if (productSort === 'stock-low') return Number(a.stock || 0) - Number(b.stock || 0);
      if (productSort === 'stock-high') return Number(b.stock || 0) - Number(a.stock || 0);
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
    return rows;
  }, [filteredProducts, productSort]);
  const productPageCount = Math.max(1, Math.ceil(sortedProducts.length / productPageSize));
  const visibleProducts = sortedProducts.slice((productPage - 1) * productPageSize, productPage * productPageSize);
  return <main className="min-h-screen bg-slate-50 text-slate-900">
    {previewImage && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm transition-opacity duration-300" onClick={()=>setPreviewImage(null)}><button type="button" aria-label="Close image preview" onClick={()=>setPreviewImage(null)} className="absolute right-5 top-5 rounded-full bg-white/15 p-2 text-white"><X size={24}/></button><img src={previewImage} alt="Product image preview" className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl transition-transform duration-300" onClick={e=>e.stopPropagation()}/></div>}
    <header className="sticky top-0 z-20 border-b bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4"><div className="flex items-center gap-3"><Link href="/" className="rounded-xl border p-2"><ArrowLeft size={18}/></Link><div><h1 className="text-xl font-black">EcomStore Dashboard</h1><p className="text-xs text-slate-500">{email} · {role}</p></div></div><div className="flex gap-2"><button onClick={() => void refresh()} className="rounded-xl border p-2"><RefreshCw size={18}/></button><button onClick={() => void signOut()} className="rounded-xl border p-2"><LogOut size={18}/></button></div></div></header>
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 md:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-2xl border bg-white p-3">{tabs.map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => setTab(item.id)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${tab===item.id?'bg-amber-50 text-amber-700':'text-slate-600 hover:bg-slate-50'}`}><Icon size={18}/>{item.label}</button>; })}</aside>
      <section className="min-w-0">
        {message && <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{message}</div>}
        {busy && <p className="mb-3 text-sm text-slate-500">Processing…</p>}
        {tab==='overview' && <><h2 className="mb-5 text-2xl font-black">Overview</h2>{role==='admin' ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[['Vendors',overview.vendors],['Pending vendors',overview.pendingVendors],['Products',overview.products],['Pending products',overview.pendingProducts],['Orders',overview.orders],['Customers',overview.customers],['Revenue',`$${Number(overview.revenue||0).toFixed(2)}`]].map(([label,value])=><div key={String(label)} className="rounded-2xl border bg-white p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-black">{value ?? '—'}</p></div>)}</div> : <div className="rounded-2xl border bg-white p-6"><h3 className="text-lg font-bold">Welcome to your account</h3><p className="mt-2 text-sm text-slate-600">{vendor ? `Store: ${vendor.store_name} · Status: ${vendor.status}` : 'You can shop products or apply to become a seller.'}</p><div className="mt-5 flex flex-wrap gap-3"><button onClick={()=>setTab('orders')} className="rounded-xl bg-slate-900 px-4 py-2 text-white">My orders</button>{vendor && <button onClick={()=>setTab('products')} className="rounded-xl border px-4 py-2">Manage products</button>}</div></div>}</>}
        {tab==='overview' && role!=='admin' && !vendor && <form onSubmit={applyVendor} className="mt-5 max-w-xl rounded-2xl border bg-white p-6"><h3 className="text-lg font-black">Open your store</h3><p className="mb-4 text-sm text-slate-500">Submit your seller application for admin review.</p><input required minLength={2} value={storeName} onChange={e=>setStoreName(e.target.value)} placeholder="Store name" className="mb-3 w-full rounded-xl border px-4 py-3"/><textarea value={storeDescription} onChange={e=>setStoreDescription(e.target.value)} placeholder="Describe your store" className="mb-3 min-h-24 w-full rounded-xl border px-4 py-3"/><button disabled={busy} className="rounded-xl bg-amber-500 px-5 py-3 font-bold text-white">Apply to sell</button></form>}
        {tab==='overview' && vendor?.status==='pending' && <div className="mt-5 rounded-2xl border bg-white p-6"><p className="font-bold">Seller application pending</p><p className="mt-1 text-sm text-slate-500">Admin will review your store before product listing is enabled.</p></div>}
        {tab==='products' && <><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-black">{role==='admin'?'All products':'My products'}</h2></div>
          {(role==='admin' || vendor?.status==='approved') && <form onSubmit={createProduct} className="mb-6 grid gap-3 rounded-2xl border bg-white p-5 md:grid-cols-2"><h3 className="md:col-span-2 text-lg font-bold">{role==='admin'?'Add product as Admin':'Add a product'}</h3><input required minLength={2} placeholder="Product title" value={productForm.title} onChange={e=>setProductForm({...productForm,title:e.target.value})} className="rounded-xl border px-3 py-3"/><input required placeholder="Category" value={productForm.category} onChange={e=>setProductForm({...productForm,category:e.target.value})} className="rounded-xl border px-3 py-3"/><textarea placeholder="Description" value={productForm.description} onChange={e=>setProductForm({...productForm,description:e.target.value})} className="rounded-xl border px-3 py-3 md:col-span-2"/><input required type="number" min="0" step="0.01" placeholder="Price USD" value={productForm.price} onChange={e=>setProductForm({...productForm,price:e.target.value})} className="rounded-xl border px-3 py-3"/><input required type="number" min="0" step="1" placeholder="Stock" value={productForm.stock} onChange={e=>setProductForm({...productForm,stock:e.target.value})} className="rounded-xl border px-3 py-3"/><div className="md:col-span-2 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><div><label className="block text-sm font-extrabold tracking-tight text-slate-900">Product photo album</label><p className="mt-1 text-xs text-slate-500">Upload up to 5 photos · First photo is your cover</p></div><span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold tabular-nums text-amber-800">{selectedImages.length} <span className="font-medium text-amber-600">/ 5</span></span></div><input id="product-images" type="file" accept="image/*" multiple className="hidden" onChange={e=>{addProductImages(e.target.files);e.currentTarget.value='';}}/><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">{imagePreviews.map((image,index)=><div key={`${image.file.name}-${index}`} className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"><button type="button" onClick={()=>setPreviewImage(image.url)} aria-label={`Preview image ${index+1}`} className="h-full w-full overflow-hidden"><img src={image.url} alt={`Product image ${index+1}`} className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"/></button><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 opacity-60 transition-opacity duration-300 group-hover:opacity-100"/><button type="button" aria-label="Remove image" onClick={()=>setSelectedImages(current=>current.filter((_,i)=>i!==index))} className="absolute right-2 top-2 grid h-8 w-8 translate-y-1 place-items-center rounded-full border border-white/30 bg-black/60 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-red-500 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"><X size={15}/></button>{index===0&&<span className="absolute bottom-2 left-2 rounded-full border border-white/30 bg-black/60 px-3 py-1 text-[10px] font-extrabold tracking-wide text-white shadow backdrop-blur-md">★ COVER</span>}<span className="absolute bottom-2 right-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-slate-700 shadow-sm">{index+1}</span></div>)}{selectedImages.length<5&&<button type="button" disabled={selectedImages.length>=5} onClick={()=>document.getElementById('product-images')?.click()} className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white/70 text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 transition-all duration-300 group-hover:rotate-90 group-hover:bg-amber-100"><Upload size={21}/></span><span className="text-xs font-bold">Add photos</span><span className="text-[10px] text-slate-400">Choose images</span></button>}</div><div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2.5 text-xs text-slate-500"><Upload size={14}/><span>Click a photo to preview · Hover to remove · JPG, PNG or WEBP</span></div></div><button disabled={busy} className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-bold text-white md:col-span-2"><Plus size={18}/>Create product</button></form>}
          {role!=='admin' && !vendor && <p className="rounded-xl border bg-white p-5 text-sm text-slate-600">Apply to become a vendor from Overview before adding products.</p>}
          {role==='admin' && <div className="mb-4 rounded-2xl border bg-white p-4"><div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_170px_170px]"><input value={productSearch} onChange={e=>{setProductSearch(e.target.value);setProductPage(1);}} placeholder="Search name, model, shop or ID…" className="w-full rounded-xl border px-4 py-3 text-sm"/><select value={productStatus} onChange={e=>{setProductStatus(e.target.value);setProductPage(1);}} className="rounded-xl border px-3 py-3 text-sm"><option value="all">All statuses</option><option value="active">Active</option><option value="pending">Pending</option><option value="rejected">Rejected</option><option value="archived">Archived</option><option value="sold">Sold</option></select><select value={productCategory} onChange={e=>{setProductCategory(e.target.value);setProductPage(1);}} className="rounded-xl border px-3 py-3 text-sm"><option value="all">All categories</option>{Array.from(new Set(data.map(row=>String(row.category||'').toLowerCase()).filter(Boolean))).sort().map(category=><option key={category} value={category}>{category}</option>)}</select><select value={productSort} onChange={e=>{setProductSort(e.target.value);setProductPage(1);}} className="rounded-xl border px-3 py-3 text-sm"><option value="newest">Newest first</option><option value="title">Name A–Z</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="stock-low">Stock: low to high</option><option value="stock-high">Stock: high to low</option></select></div><div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-slate-500"><span><b className="text-slate-900">{sortedProducts.length}</b> products · Showing {sortedProducts.length ? (productPage-1)*productPageSize+1 : 0}–{Math.min(productPage*productPageSize,sortedProducts.length)}</span><button onClick={()=>{setProductSearch('');setProductStatus('all');setProductCategory('all');setProductSort('newest');setProductPage(1);}} className="rounded-lg border px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50">Reset filters</button></div></div>}
          <div className="overflow-hidden rounded-2xl border bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Shop</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{(role==='admin'?visibleProducts:data).map(row=><tr key={row.id} className="transition-colors hover:bg-slate-50/80"><td className="px-4 py-3"><div className="flex min-w-[250px] items-center gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100">{row.product_images?.[0]?.image_url?<img src={row.product_images[0].image_url} className="h-full w-full object-cover" alt=""/>:<Package size={18} className="text-slate-400"/>}</div><div className="min-w-0"><p className="max-w-[280px] truncate font-semibold text-slate-900" title={row.title}>{row.title}</p><p className="mt-1 text-[10px] text-slate-400">ID: {String(row.id).slice(0,8)}</p></div></div></td><td className="px-4 py-3 text-slate-600">{row.category||'—'}</td><td className="px-4 py-3 font-semibold tabular-nums text-slate-900">$ {Number(row.price||0).toFixed(2)}</td><td className="px-4 py-3 tabular-nums"><span className={Number(row.stock||0)<=0?'font-semibold text-red-600':'text-slate-700'}>{row.stock??0}</span></td><td className="px-4 py-3 text-slate-600">{row.vendors?.store_name||'Admin'}</td><td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${row.status==='active'?'bg-emerald-50 text-emerald-700':row.status==='pending'?'bg-amber-50 text-amber-700':row.status==='rejected'?'bg-red-50 text-red-700':'bg-slate-100 text-slate-600'}`}>{row.status||'unknown'}</span></td><td className="px-4 py-3"><div className="flex justify-end gap-2">{role==='admin'?<><button onClick={()=>void update(`/api/admin/products/${row.id}`,{status:'active'})} disabled={row.status==='active'} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-40">Approve</button><button onClick={()=>void update(`/api/admin/products/${row.id}`,{status:'rejected'})} disabled={row.status==='rejected'} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40">Reject</button></>:<><button onClick={()=>{const stock=prompt('New stock quantity',String(row.stock));if(stock!==null)void update(`/api/products/${row.id}`,{stock:Number(stock)});}} className="rounded-lg border px-3 py-2 text-xs">Edit stock</button><button onClick={()=>void removeProduct(row.id)} className="rounded-lg border px-3 py-2 text-xs text-red-600">Delete</button></>}</div></td></tr>)}</tbody></table></div>{!(role==='admin'?visibleProducts:data).length&&<p className="p-8 text-center text-sm text-slate-500">No products match these filters.</p>}</div>
          {role==='admin'&&productPageCount>1&&<div className="mt-5 flex items-center justify-between rounded-xl border bg-white p-3"><button disabled={productPage===1} onClick={()=>setProductPage(page=>Math.max(1,page-1))} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40">Previous</button><span className="text-sm text-slate-500">Page {productPage} of {productPageCount}</span><button disabled={productPage===productPageCount} onClick={()=>setProductPage(page=>Math.min(productPageCount,page+1))} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40">Next</button></div>}
        </>}
        {tab==='supplier-products' && role==='admin' && <><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-black">Supplier Products</h2><p className="mt-1 text-sm text-slate-500">Admin-only supplier references, source prices and product codes</p></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold">{data.length} linked products</span></div><div className="mb-4"><input value={productSearch} onChange={e=>setProductSearch(e.target.value)} placeholder="Search supplier, product model or supplier code…" className="w-full rounded-xl border bg-white px-4 py-3 text-sm"/></div><div className="overflow-x-auto rounded-2xl border bg-white"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Supplier</th><th className="px-4 py-3">Supplier cost</th><th className="px-4 py-3">Retail price</th><th className="px-4 py-3">Supplier code</th><th className="px-4 py-3">Source</th></tr></thead><tbody className="divide-y">{data.filter(row=>[row.title,row.supplier_source?.supplier_name,row.supplier_source?.supplier_product_code].some(value=>String(value||'').toLowerCase().includes(productSearch.trim().toLowerCase()))).map(row=><tr key={row.id}><td className="px-4 py-3"><div className="flex items-center gap-3"><div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">{row.product_images?.[0]?.image_url?<img src={row.product_images[0].image_url} alt="" className="h-full w-full object-cover"/>:<Package className="m-3 text-slate-400"/>}</div><div><p className="font-semibold text-slate-900">{row.title}</p><p className="text-xs text-slate-500">{row.status} · {row.vendors?.store_name||'No shop'}</p></div></div></td><td className="px-4 py-3">{row.supplier_source?.supplier_name||'—'}</td><td className="px-4 py-3 tabular-nums">{row.supplier_source?.supplier_price==null?'—':`${Number(row.supplier_source.supplier_price).toFixed(2)}`}</td><td className="px-4 py-3 tabular-nums">${Number(row.price).toFixed(2)}</td><td className="px-4 py-3 text-xs">{row.supplier_source?.supplier_product_code||'—'}</td><td className="px-4 py-3">{row.supplier_source?.supplier_url?<a href={row.supplier_source.supplier_url} target="_blank" rel="noreferrer" className="font-semibold text-blue-600 hover:underline">Open source ↗</a>:'—'}</td></tr>)}</tbody></table>{!data.length&&<p className="p-6 text-center text-sm text-slate-500">No supplier-linked products found.</p>}</div></>}
        {tab==='vendors' && role==='admin' && <><h2 className="mb-5 text-2xl font-black">Vendor applications & shop history</h2><div className="space-y-3">{data.map(row=><div key={row.id} className="rounded-2xl border bg-white p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="flex-1"><p className="font-bold">{row.store_name}</p><p className="text-sm text-slate-500">{row.profiles?.display_name} · {row.profiles?.phone||'No phone'}</p><p className="text-xs text-slate-500">{row.description}</p><p className="mt-1 text-xs font-semibold">Status: {row.status}</p></div><div className="flex flex-wrap gap-2"><button onClick={()=>void update(`/api/admin/vendors/${row.id}`,{status:'approved'})} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"><Check size={14} className="inline"/> Approve</button><button onClick={()=>void update(`/api/admin/vendors/${row.id}`,{status:'rejected'})} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700"><X size={14} className="inline"/> Reject</button><button onClick={()=>void update(`/api/admin/vendors/${row.id}`,{status:'blocked'})} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold"><Ban size={14} className="inline"/> Block</button><button onClick={async()=>{try{const history=await api(`/api/admin/vendors/${row.id}/name-history`);setNameHistory(current=>({...current,[row.id]:history||[]}));}catch(error){setMessage(error instanceof Error?error.message:'Could not load shop history');}}} className="rounded-lg border px-3 py-2 text-xs font-semibold">Name history</button></div></div>{nameHistory[row.id]&&<div className="mt-4 rounded-xl bg-slate-50 p-4"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Previous shop names</p>{nameHistory[row.id].length?nameHistory[row.id].map(item=><div key={item.id} className="flex flex-wrap justify-between gap-2 border-b py-2 last:border-0"><span className="text-sm"><b>{item.previous_store_name}</b> → {item.new_store_name}</span><time className="text-xs text-slate-500">{new Date(item.changed_at).toLocaleString()}</time></div>):<p className="text-sm text-slate-500">No name changes recorded.</p>}</div>}</div>)}</div></>}
        {tab==='shop' && vendor && role!=='admin' && <><h2 className="mb-5 text-2xl font-black">Shop settings</h2><form onSubmit={async e=>{e.preventDefault();setBusy(true);setMessage('');try{await api('/api/vendor/profile',{method:'PATCH',body:JSON.stringify({store_name:storeName,description:storeDescription,store_location:vendor.store_location||''})});setMessage('Shop profile updated. Previous names are kept in history.');await refresh();}catch(error){setMessage(error instanceof Error?error.message:'Could not update shop');}finally{setBusy(false);}}} className="max-w-2xl space-y-4 rounded-2xl border bg-white p-5"><label className="block text-sm font-semibold">Shop name<input required minLength={2} maxLength={80} value={storeName} onChange={e=>setStoreName(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3"/></label><label className="block text-sm font-semibold">Shop description<textarea maxLength={1000} value={storeDescription} onChange={e=>setStoreDescription(e.target.value)} className="mt-2 min-h-28 w-full rounded-xl border px-4 py-3"/></label><button disabled={busy} className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">Save shop settings</button><p className="text-xs text-slate-500">Changing your shop name will not erase previous names, orders, or buyer dispute records.</p><button type="button" onClick={async()=>{try{const history=await api('/api/vendor/name-history');setNameHistory(current=>({...current,self:history||[]}));}catch(error){setMessage(error instanceof Error?error.message:'Could not load name history');}}} className="rounded-lg border px-4 py-2 text-sm font-semibold">View previous shop names</button>{nameHistory.self&&<div className="rounded-xl bg-slate-50 p-4">{nameHistory.self.length?nameHistory.self.map(item=><div key={item.id} className="flex flex-wrap justify-between gap-2 border-b py-2 last:border-0"><span className="text-sm"><b>{item.previous_store_name}</b> → {item.new_store_name}</span><time className="text-xs text-slate-500">{new Date(item.changed_at).toLocaleString()}</time></div>):<p className="text-sm text-slate-500">No previous shop names.</p>}</div>}</form></>}
        {tab==='moderation' && role==='admin' && <><h2 className="mb-5 text-2xl font-black">Product moderation</h2><div className="space-y-3">{data.filter(row=>row.status==='pending').map(row=><div key={row.id} className="flex flex-col gap-3 rounded-2xl border bg-white p-5 sm:flex-row sm:items-center"><div className="flex-1"><p className="font-bold">{row.title}</p><p className="text-sm text-slate-500">{row.vendors?.store_name} · ${Number(row.price).toFixed(2)} · Stock {row.stock}</p><p className="text-sm text-slate-500">{row.description}</p></div><div className="flex gap-2"><button onClick={()=>void update(`/api/admin/products/${row.id}`,{status:'active'})} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">Approve</button><button onClick={()=>void update(`/api/admin/products/${row.id}`,{status:'rejected'})} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700">Reject</button></div></div>)}{data.every(row=>row.status!=='pending')&&<p className="rounded-xl border bg-white p-5 text-sm text-slate-500">No products waiting for review.</p>}</div></>}
        {tab==='orders' && <><h2 className="mb-5 text-2xl font-black">{role==='admin'?'All orders':vendor?'Store orders':'My orders'}</h2><div className="space-y-3">{data.map((row,index)=>{const order=row.orders||row;const isVendorItem=Boolean(row.orders);return <div key={row.id||index} className="rounded-2xl border bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-bold">Order #{String(order.id).slice(0,8)}</p><p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleString()}</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">{isVendorItem ? row.fulfillment_status : order.status}</span></div><p className="mt-3 text-sm">Total: <b>${Number(order.total).toFixed(2)}</b> · Payment: {order.payment_method} / {order.payment_status}</p>{order.customer_name&&<p className="mt-1 text-sm text-slate-600">{order.customer_name} · {order.customer_phone}</p>}{order.delivery_address&&<p className="mt-1 text-sm text-slate-600">Delivery: {order.delivery_address}</p>}{isVendorItem&&<p className="mt-1 text-sm text-slate-600">{row.products?.title} × {row.quantity}</p>}{order.order_items?.map((item:AnyRow,i:number)=><p key={i} className="mt-1 text-sm text-slate-600">{item.products?.title||'Item'} × {item.quantity} · ${Number(item.unit_price).toFixed(2)}</p>)}{role==='admin'&&<div className="mt-3 flex flex-wrap gap-2"><button onClick={()=>void update(`/api/admin/orders/${order.id}`,{status:'processing'})} className="rounded-lg border px-3 py-2 text-xs">Processing</button><button onClick={()=>void update(`/api/admin/orders/${order.id}`,{status:'shipped'})} className="rounded-lg border px-3 py-2 text-xs">Shipped</button><button onClick={()=>void update(`/api/admin/orders/${order.id}`,{status:'completed',payment_status:'paid'})} className="rounded-lg border px-3 py-2 text-xs">Complete / Paid</button></div>}{role!=='admin'&&vendor&&<div className="mt-3 flex flex-wrap gap-2"><button onClick={()=>void update(`/api/vendor/orders/${order.id}`,{status:'processing'})} className="rounded-lg border px-3 py-2 text-xs">Accept / Processing</button><button onClick={()=>void update(`/api/vendor/orders/${order.id}`,{status:'shipped'})} className="rounded-lg border px-3 py-2 text-xs">Mark shipped</button></div>}</div>})}{!data.length&&<p className="rounded-xl border bg-white p-5 text-sm text-slate-500">No orders found.</p>}</div></>}
      </section>
    </div>
  </main>;
}
