import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import next from 'next';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

const app = express();
const port = Number(process.env.PORT || 10000);
const frontendDir = fileURLToPath(new URL('../frontend', import.meta.url));
const nextApp = next({ dev: process.env.NODE_ENV !== 'production', dir: frontendDir });
const nextHandler = nextApp.getRequestHandler();
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && serviceKey ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(',').map(v => v.trim()) : true }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 5 } });
const fail = (res, status, message) => res.status(status).json({ error: message });
const db = res => { if (!supabase) { fail(res, 503, 'Supabase is not configured'); return false; } return true; };
const clean = (value, max = 500) => String(value ?? '').trim().slice(0, max);

async function authenticate(req, res, nextMiddleware) {
  try {
    if (!db(res)) return;
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) return fail(res, 401, 'Authentication required');
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return fail(res, 401, 'Invalid or expired session');
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: data.user.id,
      display_name: data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || 'Customer'
    }, { onConflict: 'id', ignoreDuplicates: true });
    if (profileError) {
      console.error('Profile initialization failed:', profileError.message);
      return fail(res, 500, 'Could not initialize account profile');
    }
    req.user = data.user;
    return nextMiddleware();
  } catch (error) {
    console.error('Authentication error:', error);
    return fail(res, 401, 'Authentication failed');
  }
}
async function vendorFor(userId) {
  return supabase.from('vendors').select('*').eq('user_id', userId).maybeSingle();
}
async function isAdmin(userId) {
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
  return data?.role === 'admin';
}
async function requireAdmin(req, res, nextMiddleware) {
  if (!await isAdmin(req.user.id)) return fail(res, 403, 'Admin only');
  return nextMiddleware();
}
async function requireVendor(req, res, nextMiddleware) {
  const { data: vendor, error } = await vendorFor(req.user.id);
  if (error || !vendor) return fail(res, 403, 'Vendor account not found');
  if (vendor.status !== 'approved') return fail(res, 403, 'Vendor account is not approved');
  req.vendor = vendor;
  return nextMiddleware();
}
async function telegram(method, payload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('Telegram storage is not configured');
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, payload);
  const json = await response.json();
  if (!json.ok) throw new Error(json.description || 'Telegram request failed');
  return json.result;
}
async function uploadToTelegram(file) {
  const channel = process.env.TELEGRAM_CHANNEL_ID;
  if (!channel) throw new Error('Telegram image storage is not configured');
  const form = new FormData();
  form.append('chat_id', channel);
  form.append('photo', new Blob([file.buffer], { type: file.mimetype }), file.originalname || 'product.jpg');
  const result = await telegram('sendPhoto', { method: 'POST', body: form });
  return { messageId: String(result.message_id), fileId: result.photo?.at(-1)?.file_id || null };
}
async function deleteTelegramMessage(messageId) {
  if (!process.env.TELEGRAM_CHANNEL_ID) return;
  try {
    await telegram('deleteMessage', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHANNEL_ID, message_id: Number(messageId) })
    });
  } catch (error) { console.warn('Telegram cleanup failed:', error.message); }
}
function publicMediaUrl(path) {
  if (!path || !supabase) return null;
  return supabase.storage.from('profile-media').getPublicUrl(path).data.publicUrl;
}
function publicProduct(product) {
  return {
    ...product,
    seller_rating: product.seller_rating ?? null,
    seller_review_count: product.seller_review_count ?? 0,
    product_images: (product.product_images || []).map(image => ({
      id: image.id, sort_order: image.sort_order,
      image_url: image.file_id ? `/api/images/${encodeURIComponent(image.file_id)}` : null
    }))
  };
}
async function ratingsFor(vendorIds) {
  const ids = [...new Set((vendorIds || []).filter(Boolean))];
  if (!ids.length) return {};
  const { data } = await supabase.from('seller_reviews').select('vendor_id,rating').in('vendor_id', ids);
  const grouped = {};
  for (const row of data || []) {
    if (!grouped[row.vendor_id]) grouped[row.vendor_id] = { total: 0, count: 0, distribution: [0,0,0,0,0] };
    grouped[row.vendor_id].total += Number(row.rating);
    grouped[row.vendor_id].count += 1;
    grouped[row.vendor_id].distribution[Number(row.rating) - 1] += 1;
  }
  for (const row of Object.values(grouped)) row.average = row.count ? Number((row.total / row.count).toFixed(2)) : null;
  return grouped;
}

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'EcomStore', database: Boolean(supabase) }));
// Only the Supabase anon/publishable key is exposed to the browser. Never return the service-role key.
app.get('/api/config', (_req, res) => res.json({
  supabaseUrl: supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || null,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || null
}));

// Telegram image proxy keeps bot credentials and file paths on the server.
app.get('/api/images/:fileId', async (req, res) => {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) return fail(res, 503, 'Image storage is not configured');
    const fileId = clean(req.params.fileId, 2048);
    if (!fileId) return fail(res, 400, 'Invalid image ID');
    const file = await telegram('getFile', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ file_id: fileId })
    });
    const imageResponse = await fetch(`https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`);
    if (!imageResponse.ok) return fail(res, 502, 'Could not retrieve image');
    res.set('Content-Type', imageResponse.headers.get('content-type') || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    return res.send(Buffer.from(await imageResponse.arrayBuffer()));
  } catch (error) {
    console.error('Image proxy error:', error.message);
    return fail(res, 502, 'Image service unavailable');
  }
});

// Public catalogue.
app.get('/api/categories', async (_req, res) => {
  if (!db(res)) return;
  const { data, error } = await supabase.from('products').select('category').eq('status', 'active');
  if (error) return fail(res, 500, 'Could not load categories');
  res.json({ data: [...new Set((data || []).map(row => row.category).filter(Boolean))].sort() });
});
app.get('/api/products', async (req, res) => {
  if (!db(res)) return;
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 24));
  const q = clean(req.query.q, 100);
  const category = clean(req.query.category, 80);
  let query = supabase.from('products').select('id,title,description,price,stock,category,location,condition,view_count,created_at,vendor_id,product_images(id,file_id,sort_order),vendors!inner(id,store_name,status)', { count: 'exact' })
    .eq('status', 'active').eq('vendors.status', 'approved').order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  if (q) query = query.ilike('title', `%${q.replace(/[%_]/g, '')}%`);
  if (category) query = query.eq('category', category);
  const { data, error, count } = await query;
  if (error) { console.error(error); return fail(res, 500, 'Could not load products'); }
  const trust = await ratingsFor((data || []).map(row => row.vendor_id));
  const enriched = (data || []).map(row => ({ ...row, seller_rating: trust[row.vendor_id]?.average ?? null, seller_review_count: trust[row.vendor_id]?.count ?? 0 }));
  res.json({ data: enriched.map(publicProduct), page, limit, total: count || 0 });
});
app.get('/api/products/:id', async (req, res) => {
  if (!db(res)) return;
  let { data, error } = await supabase.from('products')
    .select('*,product_images(id,file_id,sort_order),vendors!inner(id,store_name,status)')
    .eq('id', req.params.id).eq('status', 'active').eq('vendors.status', 'approved').maybeSingle();
  if (error || !data) return fail(res, 404, 'Product not found');
  const nextViews = Number(data.view_count || 0) + 1;
  await supabase.from('products').update({ view_count: nextViews }).eq('id', data.id);
  data.view_count = nextViews;
  const trust = await ratingsFor([data.vendor_id]);
  data.seller_rating = trust[data.vendor_id]?.average ?? null;
  data.seller_review_count = trust[data.vendor_id]?.count ?? 0;
  res.json({ data: publicProduct(data) });
});

// Profile and vendor onboarding.
app.get('/api/me', authenticate, async (req, res) => {
  const [{ data: profile }, { data: vendor }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', req.user.id).maybeSingle(),
    vendorFor(req.user.id)
  ]);
  const normalized = profile ? { ...profile, avatar_url: publicMediaUrl(profile.avatar_path), cover_url: publicMediaUrl(profile.cover_path) } : null;
  const safeVendor = vendor ? Object.fromEntries(Object.entries(vendor).filter(([key]) => key !== 'document_path')) : null;
  res.json({ data: { user: { id: req.user.id, email: req.user.email, phone: req.user.phone || null }, profile: normalized, vendor: safeVendor, isAdmin: profile?.role === 'admin' } });
});
app.patch('/api/me', authenticate, async (req, res) => {
  const patch = {};
  if (req.body.display_name !== undefined) patch.display_name = clean(req.body.display_name, 100);
  if (req.body.phone !== undefined) patch.phone = clean(req.body.phone, 30);
  if (req.body.province !== undefined) patch.province = clean(req.body.province, 80);
  if (req.body.bio !== undefined) patch.bio = clean(req.body.bio, 500);
  if (patch.display_name !== undefined && patch.display_name.length < 2) return fail(res, 400, 'Name must be at least 2 characters');
  if (!Object.keys(patch).length) return fail(res, 400, 'No profile fields supplied');
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', req.user.id).select().single();
  if (error) return fail(res, 400, 'Could not update profile');
  res.json({ data: { ...data, avatar_url: publicMediaUrl(data.avatar_path), cover_url: publicMediaUrl(data.cover_path) } });
});
app.post('/api/me/media', authenticate, upload.single('file'), async (req, res) => {
  const type = clean(req.body.type, 20);
  const file = req.file;
  if (!['avatar','cover'].includes(type)) return fail(res, 400, 'Invalid profile image type');
  if (!file || !['image/jpeg','image/png','image/webp'].includes(file.mimetype)) return fail(res, 400, 'Choose a JPG, PNG or WEBP image');
  const extension = file.mimetype === 'image/png' ? 'png' : file.mimetype === 'image/webp' ? 'webp' : 'jpg';
  const path = `${req.user.id}/${type}-${Date.now()}-${randomUUID()}.${extension}`;
  const { error: storageError } = await supabase.storage.from('profile-media').upload(path, file.buffer, { contentType: file.mimetype, upsert: false });
  if (storageError) return fail(res, 502, 'Could not upload profile image. Run the marketplace migration first.');
  const patch = type === 'avatar' ? { avatar_path: path } : { cover_path: path };
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', req.user.id).select().single();
  if (error) {
    await supabase.storage.from('profile-media').remove([path]);
    return fail(res, 500, 'Could not save profile image');
  }
  res.status(201).json({ data: { ...data, avatar_url: publicMediaUrl(data.avatar_path), cover_url: publicMediaUrl(data.cover_path) } });
});
app.post('/api/vendors/register', authenticate, upload.single('document'), async (req, res) => {
  const store_name = clean(req.body.store_name, 80);
  const description = clean(req.body.description, 1000);
  const contact_phone = clean(req.body.contact_phone, 60);
  const address = clean(req.body.address, 300);
  const file = req.file;
  if (store_name.length < 2 || contact_phone.length < 6 || address.length < 5) return fail(res, 400, 'Complete store name, contact and address');
  if (!file || !['image/jpeg','image/png','image/webp','application/pdf'].includes(file.mimetype)) return fail(res, 400, 'Upload an ID card or business document');
  const { data: existing, error: lookupError } = await vendorFor(req.user.id);
  if (lookupError) return fail(res, 500, 'Could not check existing seller application');
  if (existing && !['rejected'].includes(existing.status)) return fail(res, 409, 'Seller application already exists or is awaiting review');
  const extension = file.mimetype === 'application/pdf' ? 'pdf' : file.mimetype === 'image/png' ? 'png' : file.mimetype === 'image/webp' ? 'webp' : 'jpg';
  const path = `${req.user.id}/${Date.now()}-${randomUUID()}.${extension}`;
  const { error: storageError } = await supabase.storage.from('seller-verification').upload(path, file.buffer, { contentType: file.mimetype, upsert: false });
  if (storageError) return fail(res, 502, 'Could not securely upload document. Run the marketplace migration first.');
  const values = { user_id: req.user.id, store_name, description, contact_phone, address, document_path: path, status: 'pending', reviewed_at: null, review_note: null };
  const result = existing
    ? await supabase.from('vendors').update(values).eq('id', existing.id).select().single()
    : await supabase.from('vendors').insert(values).select().single();
  if (result.error) {
    await supabase.storage.from('seller-verification').remove([path]);
    return fail(res, 400, 'Could not submit seller application');
  }
  // A pending applicant remains a customer. Vendor privileges are granted only after Admin approval.
  res.status(existing ? 200 : 201).json({ data: result.data });
});

// Vendor product management.
app.get('/api/vendor/products', authenticate, async (req, res) => {
  const { data: vendor } = await vendorFor(req.user.id);
  if (!vendor) return fail(res, 403, 'Vendor account not found');
  const { data, error } = await supabase.from('products')
    .select('*,product_images(id,file_id,telegram_message_id,sort_order)')
    .eq('vendor_id', vendor.id).order('created_at', { ascending: false });
  if (error) return fail(res, 500, 'Could not load vendor products');
  res.json({ data: (data || []).map(publicProduct), vendor });
});
app.post('/api/products', authenticate, async (req, res) => {
  const title = clean(req.body.title, 160);
  const description = clean(req.body.description, 5000);
  const category = clean(req.body.category || 'General', 80);
  const price = Number(req.body.price);
  const stock = Number(req.body.stock);
  if (title.length < 2 || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) return fail(res, 400, 'Invalid title, price or stock');

  const admin = await isAdmin(req.user.id);
  let vendor = null;
  if (admin) {
    const { data: existingVendor, error: vendorLookupError } = await vendorFor(req.user.id);
    if (vendorLookupError) return fail(res, 500, 'Could not load admin store');
    if (existingVendor) {
      vendor = existingVendor;
      if (vendor.status !== 'approved') {
        const { data: approvedVendor, error } = await supabase.from('vendors')
          .update({ status: 'approved' }).eq('id', vendor.id).select().single();
        if (error) return fail(res, 400, 'Could not enable admin store');
        vendor = approvedVendor;
      }
    } else {
      const { data: createdVendor, error } = await supabase.from('vendors').insert({
        user_id: req.user.id,
        store_name: 'EcomStore Admin',
        description: 'Official products managed by the marketplace administrator.',
        status: 'approved'
      }).select().single();
      if (error) return fail(res, 400, 'Could not create admin store');
      vendor = createdVendor;
    }
  } else {
    const { data: seller, error } = await vendorFor(req.user.id);
    if (error || !seller || seller.status !== 'approved') return fail(res, 403, 'Approved vendor account required');
    vendor = seller;
  }

  const status = admin || process.env.AUTO_APPROVE_PRODUCTS === 'true' ? 'active' : 'pending';
  const location = clean(req.body.location, 100);
  const condition = clean(req.body.condition || 'ប្រើរួចស្អាត', 60);
  const { data, error } = await supabase.from('products')
    .insert({ vendor_id: vendor.id, title, description, category, price, stock, location, condition, status }).select().single();
  if (error) return fail(res, 400, 'Could not create product');
  res.status(201).json({ data });
});
app.patch('/api/products/:id', authenticate, async (req, res) => {
  const { data: vendor } = await vendorFor(req.user.id);
  const admin = await isAdmin(req.user.id);
  const { data: existing } = await supabase.from('products').select('id,vendor_id').eq('id', req.params.id).maybeSingle();
  if (!existing) return fail(res, 404, 'Product not found');
  if (!admin && (!vendor || vendor.id !== existing.vendor_id)) return fail(res, 403, 'Not allowed');
  const patch = {};
  for (const key of ['title','description','category','location','condition']) if (req.body[key] !== undefined) patch[key] = clean(req.body[key], key === 'description' ? 5000 : key === 'title' ? 160 : 100);
  if (req.body.price !== undefined) patch.price = Number(req.body.price);
  if (req.body.stock !== undefined) patch.stock = Number(req.body.stock);
  if (patch.title !== undefined && patch.title.length < 2) return fail(res, 400, 'Invalid title');
  if (patch.price !== undefined && (!Number.isFinite(patch.price) || patch.price < 0)) return fail(res, 400, 'Invalid price');
  if (patch.stock !== undefined && (!Number.isInteger(patch.stock) || patch.stock < 0)) return fail(res, 400, 'Invalid stock');
  if (!Object.keys(patch).length) return fail(res, 400, 'No valid fields supplied');
  if (req.body.status !== undefined) {
    const requestedStatus = clean(req.body.status, 20);
    if (requestedStatus === 'sold') { if (!admin && (!vendor || vendor.id !== existing.vendor_id)) return fail(res, 403, 'Not allowed'); patch.status = 'sold'; patch.sold_at = new Date().toISOString(); }
    else if (requestedStatus === 'active' && admin) patch.status = 'active';
    else if (requestedStatus !== 'sold') return fail(res, 400, 'Only Admin can activate products');
  } else if (!admin) patch.status = process.env.AUTO_APPROVE_PRODUCTS === 'true' ? 'active' : 'pending';
  patch.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('products').update(patch).eq('id', existing.id).select().single();
  if (error) return fail(res, 400, 'Could not update product');
  res.json({ data });
});
app.delete('/api/products/:id', authenticate, async (req, res) => {
  const [{ data: vendor }, admin] = await Promise.all([vendorFor(req.user.id), isAdmin(req.user.id)]);
  const { data: product } = await supabase.from('products').select('id,vendor_id,product_images(id,telegram_message_id)').eq('id', req.params.id).maybeSingle();
  if (!product) return fail(res, 404, 'Product not found');
  if (!admin && (!vendor || product.vendor_id !== vendor.id)) return fail(res, 403, 'Not allowed');
  const { count: soldCount } = await supabase.from('order_items').select('id', { count: 'exact', head: true }).eq('product_id', product.id);
  if ((soldCount || 0) > 0) {
    const { error } = await supabase.from('products').update({ status: 'archived', updated_at: new Date().toISOString() }).eq('id', product.id);
    if (error) return fail(res, 500, 'Could not archive product with order history');
    return res.json({ success: true, archived: true });
  }
  const { error } = await supabase.from('products').delete().eq('id', product.id);
  if (error) return fail(res, 500, 'Could not delete product');
  for (const img of product.product_images || []) await deleteTelegramMessage(img.telegram_message_id);
  res.json({ success: true, archived: false });
});
app.post('/api/products/:id/images', authenticate, upload.array('images', 5), async (req, res) => {
  const admin = await isAdmin(req.user.id);
  const { data: vendor } = await vendorFor(req.user.id);
  if (!admin && (!vendor || vendor.status !== 'approved')) return fail(res, 403, 'Approved vendor account required');
  let productQuery = supabase.from('products').select('id').eq('id', req.params.id);
  if (admin) {
    if (vendor) productQuery = productQuery.eq('vendor_id', vendor.id);
    else return fail(res, 404, 'Admin store not found');
  } else productQuery = productQuery.eq('vendor_id', vendor.id);
  const { data: product } = await productQuery.maybeSingle();
  if (!product) return fail(res, 404, 'Product not found');
  const files = req.files || [];
  if (!files.length || files.some(file => !file.mimetype.startsWith('image/'))) return fail(res, 400, 'Choose image files');
  const { count } = await supabase.from('product_images').select('*', { count: 'exact', head: true }).eq('product_id', product.id);
  if ((count || 0) + files.length > 5) return fail(res, 400, 'Maximum 5 images per product');
  const uploaded = [];
  try {
    for (const file of files) uploaded.push(await uploadToTelegram(file));
    const rows = uploaded.map((item, index) => ({ product_id: product.id, telegram_message_id: item.messageId, file_id: item.fileId, sort_order: (count || 0) + index }));
    const { data, error } = await supabase.from('product_images').insert(rows).select();
    if (error) throw error;
    res.status(201).json({ data: (data || []).map(publicProduct) });
  } catch (error) {
    for (const item of uploaded) await deleteTelegramMessage(item.messageId);
    return fail(res, 502, error.message || 'Image upload failed');
  }
});
app.delete('/api/products/:id/images/:imageId', authenticate, async (req, res) => {
  const admin = await isAdmin(req.user.id);
  const { data: vendor } = await vendorFor(req.user.id);
  if (!admin && (!vendor || vendor.status !== 'approved')) return fail(res, 403, 'Approved vendor account required');
  let productQuery = supabase.from('products').select('id').eq('id', req.params.id);
  if (admin) {
    if (vendor) productQuery = productQuery.eq('vendor_id', vendor.id);
    else return fail(res, 404, 'Admin store not found');
  } else productQuery = productQuery.eq('vendor_id', vendor.id);
  const { data: product } = await productQuery.maybeSingle();
  if (!product) return fail(res, 404, 'Product not found');
  const { data: row } = await supabase.from('product_images').select('*').eq('id', req.params.imageId).eq('product_id', product.id).maybeSingle();
  if (!row) return fail(res, 404, 'Image not found');
  const { error } = await supabase.from('product_images').delete().eq('id', row.id);
  if (error) return fail(res, 500, 'Could not delete image');
  await deleteTelegramMessage(row.telegram_message_id);
  res.json({ success: true });
});


// Marketplace user data: wishlist, seller trust, offers and seller performance.
app.get('/api/saved', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('saved_products')
    .select('id,created_at,products!inner(id,title,description,price,stock,category,location,condition,view_count,vendor_id,product_images(id,file_id,sort_order),vendors!inner(id,store_name,status))')
    .eq('user_id', req.user.id).eq('products.status', 'active').eq('products.vendors.status', 'approved')
    .order('created_at', { ascending: false });
  if (error) return fail(res, 500, 'Could not load saved products');
  const trust = await ratingsFor((data || []).map(row => row.products?.vendor_id));
  res.json({ data: (data || []).map(row => {
    const product = row.products;
    return { ...row, products: publicProduct({ ...product, seller_rating: trust[product.vendor_id]?.average ?? null, seller_review_count: trust[product.vendor_id]?.count ?? 0 }) };
  }) });
});
app.post('/api/saved/:productId', authenticate, async (req, res) => {
  const { data: product } = await supabase.from('products').select('id').eq('id', req.params.productId).eq('status', 'active').maybeSingle();
  if (!product) return fail(res, 404, 'Product not available');
  const { error } = await supabase.from('saved_products').upsert({ user_id: req.user.id, product_id: product.id }, { onConflict: 'user_id,product_id', ignoreDuplicates: true });
  if (error) return fail(res, 400, 'Could not save product');
  res.status(201).json({ success: true });
});
app.delete('/api/saved/:productId', authenticate, async (req, res) => {
  const { error } = await supabase.from('saved_products').delete().eq('user_id', req.user.id).eq('product_id', req.params.productId);
  if (error) return fail(res, 400, 'Could not remove saved product');
  res.json({ success: true });
});

app.get('/api/vendors/:id/ratings', async (req, res) => {
  if (!db(res)) return;
  const { data: vendor, error } = await supabase.from('vendors')
    .select('id,user_id,store_name,description,status,created_at,profiles(display_name,province,bio,avatar_path)')
    .eq('id', req.params.id).eq('status', 'approved').maybeSingle();
  if (error || !vendor) return fail(res, 404, 'Seller not found');
  const [{ data: reviews, error: reviewError }, { data: products }] = await Promise.all([
    supabase.from('seller_reviews').select('id,buyer_id,order_id,rating,comment,created_at').eq('vendor_id', vendor.id).order('created_at', { ascending: false }).limit(30),
    supabase.from('products').select('id,status,view_count').eq('vendor_id', vendor.id)
  ]);
  if (reviewError) return fail(res, 500, 'Could not load seller reviews');
  const trust = await ratingsFor([vendor.id]);
  const buyerIds = [...new Set((reviews || []).map(row => row.buyer_id))];
  let buyerNames = {};
  if (buyerIds.length) {
    const { data: buyers } = await supabase.from('profiles').select('id,display_name').in('id', buyerIds);
    buyerNames = Object.fromEntries((buyers || []).map(row => [row.id, row.display_name]));
  }
  const profile = vendor.profiles || {};
  res.json({ data: {
    id: vendor.id, store_name: vendor.store_name, description: vendor.description, created_at: vendor.created_at,
    profile: { display_name: profile.display_name, province: profile.province, bio: profile.bio, avatar_url: publicMediaUrl(profile.avatar_path) },
    rating: trust[vendor.id]?.average ?? null, review_count: trust[vendor.id]?.count ?? 0,
    distribution: trust[vendor.id]?.distribution ?? [0,0,0,0,0],
    active_listings: (products || []).filter(row => row.status === 'active').length,
    total_views: (products || []).reduce((sum,row) => sum + Number(row.view_count || 0), 0),
    reviews: (reviews || []).map(row => ({ ...row, buyer_name: buyerNames[row.buyer_id] || 'អ្នកទិញ' }))
  } });
});
app.post('/api/vendors/:id/reviews', authenticate, async (req, res) => {
  const rating = Number(req.body.rating);
  const orderId = clean(req.body.order_id, 60);
  const comment = clean(req.body.comment, 1200);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !orderId) return fail(res, 400, 'Choose a rating from 1 to 5 and an eligible completed order');
  const { data: vendor } = await supabase.from('vendors').select('id,status').eq('id', req.params.id).eq('status', 'approved').maybeSingle();
  if (!vendor) return fail(res, 404, 'Seller not found');
  const { data: order } = await supabase.from('orders').select('id,status').eq('id', orderId).eq('customer_id', req.user.id).eq('status', 'completed').maybeSingle();
  if (!order) return fail(res, 403, 'Only buyers with completed orders can review a seller');
  const { data: item } = await supabase.from('order_items').select('id').eq('order_id', orderId).eq('vendor_id', vendor.id).eq('fulfillment_status', 'completed').limit(1).maybeSingle();
  if (!item) return fail(res, 403, 'This completed order does not belong to this seller');
  const { data, error } = await supabase.from('seller_reviews').insert({ vendor_id: vendor.id, buyer_id: req.user.id, order_id: orderId, rating, comment }).select().single();
  if (error) return fail(res, error.code === '23505' ? 409 : 400, error.code === '23505' ? 'You have already reviewed this seller for this order' : 'Could not submit seller review');
  res.status(201).json({ data });
});

app.get('/api/offers', authenticate, async (req, res) => {
  const [{ data: vendor }, admin] = await Promise.all([vendorFor(req.user.id), isAdmin(req.user.id)]);
  let query = supabase.from('offers').select('*,products(id,title,price,product_images(id,file_id,sort_order)),vendors(store_name)')
    .order('created_at', { ascending: false }).limit(100);
  if (admin) {
    // Admin can review all offer records.
  } else if (vendor?.status === 'approved') {
    query = query.or(`buyer_id.eq.${req.user.id},vendor_id.eq.${vendor.id}`);
  } else {
    query = query.eq('buyer_id', req.user.id);
  }
  const { data, error } = await query;
  if (error) return fail(res, 500, 'Could not load offers');
  const buyerIds = [...new Set((data || []).map(row => row.buyer_id))];
  let buyerNames = {};
  if (buyerIds.length) {
    const { data: buyers } = await supabase.from('profiles').select('id,display_name').in('id', buyerIds);
    buyerNames = Object.fromEntries((buyers || []).map(row => [row.id, row.display_name]));
  }
  res.json({ data: (data || []).map(row => ({ ...row, buyer_name: buyerNames[row.buyer_id] || 'អ្នកទិញ', products: row.products ? publicProduct(row.products) : null })) });
});
app.post('/api/products/:id/offers', authenticate, async (req, res) => {
  const offer_price = Number(req.body.offer_price);
  const message = clean(req.body.message, 1200);
  if (!Number.isFinite(offer_price) || offer_price <= 0) return fail(res, 400, 'Enter a valid offer price');
  const { data: product } = await supabase.from('products')
    .select('id,vendor_id,status,price,vendors!inner(status,user_id)')
    .eq('id', req.params.id).eq('status', 'active').eq('vendors.status', 'approved').maybeSingle();
  if (!product) return fail(res, 404, 'Product not available');
  if (product.vendors.user_id === req.user.id) return fail(res, 400, 'You cannot make an offer on your own product');
  const { data, error } = await supabase.from('offers').insert({
    product_id: product.id, vendor_id: product.vendor_id, buyer_id: req.user.id, offer_price, message
  }).select().single();
  if (error) return fail(res, 400, 'Could not submit offer');
  res.status(201).json({ data });
});
app.patch('/api/offers/:id', authenticate, async (req, res) => {
  const status = clean(req.body.status, 20);
  if (!['accepted','rejected'].includes(status)) return fail(res, 400, 'Invalid offer status');
  const { data: vendor } = await vendorFor(req.user.id);
  if (!vendor || vendor.status !== 'approved') return fail(res, 403, 'Approved seller account required');
  const { data: offer } = await supabase.from('offers').select('id,vendor_id,status').eq('id', req.params.id).maybeSingle();
  if (!offer || offer.vendor_id !== vendor.id) return fail(res, 404, 'Offer not found for your store');
  if (offer.status !== 'pending') return fail(res, 409, 'This offer has already been handled');
  const { data, error } = await supabase.from('offers').update({ status, updated_at: new Date().toISOString() }).eq('id', offer.id).select().single();
  if (error) return fail(res, 400, 'Could not update offer');
  res.json({ data });
});

app.get('/api/vendor/overview', authenticate, requireVendor, async (req, res) => {
  const [products, orders, reviews] = await Promise.all([
    supabase.from('products').select('id,status,view_count').eq('vendor_id', req.vendor.id),
    supabase.from('order_items').select('id,quantity,fulfillment_status').eq('vendor_id', req.vendor.id),
    supabase.from('seller_reviews').select('rating').eq('vendor_id', req.vendor.id)
  ]);
  const productRows = products.data || [], orderRows = orders.data || [], reviewRows = reviews.data || [];
  res.json({ data: {
    activeListings: productRows.filter(row => row.status === 'active').length,
    totalViews: productRows.reduce((sum,row) => sum + Number(row.view_count || 0), 0),
    averageRating: reviewRows.length ? Number((reviewRows.reduce((sum,row) => sum + row.rating, 0) / reviewRows.length).toFixed(2)) : null,
    reviewCount: reviewRows.length,
    completedSales: orderRows.filter(row => row.fulfillment_status === 'completed').reduce((sum,row) => sum + Number(row.quantity || 0), 0)
  } });
});

// Checkout uses one atomic Postgres function; never trust prices sent by the browser.
app.post('/api/orders', authenticate, async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items.map(item => ({
    product_id: clean(item.product_id, 60), quantity: Number(item.quantity)
  })) : [];
  if (!items.length || items.length > 50 || items.some(item => !item.product_id || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99)) return fail(res, 400, 'Invalid cart items');
  const args = {
    p_customer_id: req.user.id,
    p_customer_name: clean(req.body.customer_name, 100),
    p_customer_phone: clean(req.body.customer_phone, 30),
    p_delivery_address: clean(req.body.delivery_address, 1000),
    p_delivery_note: clean(req.body.delivery_note, 500),
    p_payment_method: clean(req.body.payment_method, 30),
    p_items: items
  };
  const { data: orderId, error } = await supabase.rpc('place_marketplace_order', args);
  if (error) {
    console.error('Checkout rejected:', error.message);
    return fail(res, 400, error.message.replace(/^.*?: /, '').slice(0, 220));
  }
  const { data: order } = await supabase.from('orders').select('*,order_items(*,products(title))').eq('id', orderId).single();
  res.status(201).json({ data: order });
});
app.get('/api/orders', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('orders')
    .select('*,order_items(id,quantity,unit_price,fulfillment_status,vendor_id,products(id,title),vendors(store_name))')
    .eq('customer_id', req.user.id).order('created_at', { ascending: false });
  if (error) return fail(res, 500, 'Could not load orders');
  res.json({ data: data || [] });
});

// Vendor order queue; vendor can only change fulfilment status for their own orders.
app.get('/api/vendor/orders', authenticate, async (req, res) => {
  const { data: vendor } = await vendorFor(req.user.id);
  if (!vendor) return fail(res, 403, 'Vendor account not found');
  const { data: items, error } = await supabase.from('order_items')
    .select('id,order_id,product_id,quantity,unit_price,fulfillment_status,products(title),orders(id,status,total,customer_name,customer_phone,delivery_address,delivery_note,payment_method,payment_status,created_at)')
    .eq('vendor_id', vendor.id).order('created_at', { ascending: false, referencedTable: 'orders' });
  if (error) return fail(res, 500, 'Could not load vendor orders');
  res.json({ data: items || [], vendor });
});
app.patch('/api/vendor/orders/:orderId', authenticate, async (req, res) => {
  const { data: vendor } = await vendorFor(req.user.id);
  if (!vendor || vendor.status !== 'approved') return fail(res, 403, 'Approved vendor required');
  const status = clean(req.body.status, 30);
  if (!['processing','shipped','completed','cancelled'].includes(status)) return fail(res, 400, 'Invalid order status');
  const { data: items } = await supabase.from('order_items').select('id').eq('order_id', req.params.orderId).eq('vendor_id', vendor.id);
  if (!items?.length) return fail(res, 404, 'Order not found for this store');
  const { error: itemError } = await supabase.from('order_items').update({ fulfillment_status: status }).eq('order_id', req.params.orderId).eq('vendor_id', vendor.id);
  if (itemError) return fail(res, 400, 'Could not update fulfilment');
  const { data: allItems } = await supabase.from('order_items').select('fulfillment_status').eq('order_id', req.params.orderId);
  const states = (allItems || []).map(item => item.fulfillment_status);
  const aggregate = states.length && states.every(value => value === 'completed') ? 'completed'
    : states.some(value => value === 'shipped') ? 'shipped'
    : states.some(value => value === 'processing') ? 'processing'
    : states.length && states.every(value => value === 'cancelled') ? 'cancelled' : 'pending';
  await supabase.from('orders').update({ status: aggregate, updated_at: new Date().toISOString() }).eq('id', req.params.orderId);
  res.json({ success: true, fulfillment_status: status, order_status: aggregate });
});

// Admin operations.
app.get('/api/admin/overview', authenticate, requireAdmin, async (_req, res) => {
  const [vendors, products, orders, customers] = await Promise.all([
    supabase.from('vendors').select('id,status', { count: 'exact' }),
    supabase.from('products').select('id,status', { count: 'exact' }),
    supabase.from('orders').select('id,status,total', { count: 'exact' }),
    supabase.from('profiles').select('id', { count: 'exact' }).eq('role','customer')
  ]);
  res.json({ data: {
    vendors: vendors.count || 0, pendingVendors: (vendors.data || []).filter(x => x.status === 'pending').length,
    products: products.count || 0, pendingProducts: (products.data || []).filter(x => x.status === 'pending').length,
    orders: orders.count || 0, customers: customers.count || 0,
    revenue: (orders.data || []).filter(x => ['paid','processing','shipped','completed'].includes(x.status)).reduce((s,x) => s + Number(x.total || 0), 0)
  } });
});
app.get('/api/admin/vendors', authenticate, requireAdmin, async (_req, res) => {
  const { data, error } = await supabase.from('vendors').select('*,profiles(display_name,phone,province)').order('created_at', { ascending: false });
  if (error) return fail(res, 500, 'Could not load vendors');
  const enriched = await Promise.all((data || []).map(async vendor => {
    let document_url = null;
    if (vendor.document_path) {
      const signed = await supabase.storage.from('seller-verification').createSignedUrl(vendor.document_path, 600);
      document_url = signed.data?.signedUrl || null;
    }
    const { document_path, ...safeVendor } = vendor;
    return { ...safeVendor, document_url };
  }));
  res.json({ data: enriched });
});
app.patch('/api/admin/vendors/:id', authenticate, requireAdmin, async (req, res) => {
  const status = clean(req.body.status, 20);
  if (!['approved','rejected','blocked','pending'].includes(status)) return fail(res, 400, 'Invalid vendor status');
  const { data, error } = await supabase.from('vendors').update({ status, reviewed_at: new Date().toISOString(), review_note: clean(req.body.review_note, 500) || null }).eq('id', req.params.id).select().single();
  if (error) return fail(res, 400, 'Could not update vendor');
  if (status === 'approved') await supabase.from('profiles').update({ role: 'vendor' }).eq('id', data.user_id);
  if (status === 'rejected' || status === 'blocked') {
    const { data: targetProfile } = await supabase.from('profiles').select('role').eq('id', data.user_id).maybeSingle();
    if (targetProfile?.role === 'vendor') await supabase.from('profiles').update({ role: 'customer' }).eq('id', data.user_id);
  }
  res.json({ data });
});
app.get('/api/admin/products', authenticate, requireAdmin, async (_req, res) => {
  const { data, error } = await supabase.from('products').select('*,vendors(store_name,status),product_images(id,file_id,sort_order)').order('created_at', { ascending: false });
  if (error) return fail(res, 500, 'Could not load products');
  res.json({ data: (data || []).map(publicProduct) });
});
app.patch('/api/admin/products/:id', authenticate, requireAdmin, async (req, res) => {
  const status = clean(req.body.status, 20);
  if (!['active','pending','rejected','archived','sold'].includes(status)) return fail(res, 400, 'Invalid product status');
  const { data, error } = await supabase.from('products').update({ status, updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single();
  if (error) return fail(res, 400, 'Could not update product');
  res.json({ data });
});
app.get('/api/admin/orders', authenticate, requireAdmin, async (_req, res) => {
  const { data, error } = await supabase.from('orders')
    .select('*,profiles(display_name),order_items(quantity,unit_price,products(title),vendors(store_name))')
    .order('created_at', { ascending: false }).limit(200);
  if (error) return fail(res, 500, 'Could not load orders');
  res.json({ data: data || [] });
});
app.patch('/api/admin/orders/:id', authenticate, requireAdmin, async (req, res) => {
  const status = clean(req.body.status, 20);
  const payment_status = req.body.payment_status === undefined ? undefined : clean(req.body.payment_status, 30);
  if (!['pending','paid','processing','shipped','completed','cancelled'].includes(status)) return fail(res, 400, 'Invalid order status');
  if (payment_status !== undefined && !['unpaid','pending_verification','paid','refunded'].includes(payment_status)) return fail(res, 400, 'Invalid payment status');
  const patch = { status, updated_at: new Date().toISOString() };
  if (payment_status !== undefined) patch.payment_status = payment_status;
  const { data, error } = await supabase.from('orders').update(patch).eq('id', req.params.id).select().single();
  if (error) return fail(res, 400, 'Could not update order');
  res.json({ data });
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) return fail(res, 400, error.message);
  console.error('EcomStore request error:', error);
  return fail(res, 500, 'Internal server error');
});

await nextApp.prepare();
app.use((req, res) => nextHandler(req, res));
app.listen(port, () => console.log(`EcomStore full-stack service listening on ${port}`));
