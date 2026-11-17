import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import next from 'next';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { registerSupportChat } from './support-chat.js';
import { registerSellerChat } from './seller-chat.js';
import { randomUUID, randomBytes, randomInt, createHash, createHmac, timingSafeEqual } from 'node:crypto';

const app = express();
const port = Number(process.env.PORT || 10000);
const PRODUCT_RENEWAL_DAY_MS=24*60*60*1000;
const PRODUCT_PUBLIC_MAX_AGE_MS=7*PRODUCT_RENEWAL_DAY_MS;
const PRODUCT_AUTO_DELETE_AGE_MS=14*PRODUCT_RENEWAL_DAY_MS;

const frontendDir = fileURLToPath(new URL('../frontend', import.meta.url));
const nextApp = next({ dev: process.env.NODE_ENV !== 'production', dir: frontendDir });
const nextHandler = nextApp.getRequestHandler();
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && serviceKey ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

app.disable('x-powered-by');
// Render sits behind one trusted reverse proxy; use its forwarded client IP for rate limiting.
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false, crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' } }));
app.use(cors({ origin: process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(',').map(v => v.trim()) : true }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024, files: 8 } });
const fail = (res, status, message) => res.status(status).json({ error: message });
const db = res => { if (!supabase) { fail(res, 503, 'Supabase is not configured'); return false; } return true; };
const clean = (value, max = 500) => String(value ?? '').trim().slice(0, max);
const IMAGE_MIME_TYPES = new Set(['image/jpeg','image/png','image/webp']);
function imageUploadError(file, maxBytes = 8 * 1024 * 1024) {
  if (!file || !IMAGE_MIME_TYPES.has(file.mimetype)) return 'Only JPG, PNG or WEBP image uploads are allowed.';
  if (!Buffer.isBuffer(file.buffer) || !file.buffer.length) return 'The uploaded image is empty.';
  if (file.size > maxBytes) return `Image must be ${Math.floor(maxBytes / (1024 * 1024))}MB or smaller.`;
  const buffer = file.buffer;
  const jpeg = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const png = buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]));
  const webp = buffer.length >= 12 && buffer.toString('ascii',0,4) === 'RIFF' && buffer.toString('ascii',8,12) === 'WEBP';
  if (!(jpeg || png || webp)) return 'The file contents do not match a JPG, PNG or WEBP image.';
  return null;
}

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

async function telegramDiagnosticCall(method, body) {
  try {
    const result = await telegram(method, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body || {})
    });
    return { ok: true, result };
  } catch (error) {
    return { ok: false, error: clean(error.message, 300) };
  }
}
async function requireVendor(req, res, nextMiddleware) {
  const { data: vendor, error } = await vendorFor(req.user.id);
  if (error || !vendor) return fail(res, 403, 'Vendor account not found');
  if (vendor.status === 'blocked') return fail(res, 403, 'Vendor account is blocked');
  req.vendor = vendor;
  return nextMiddleware();
}
const telegramStorageChatId = () => process.env.TELEGRAM_STORAGE_CHAT_ID || process.env.TELEGRAM_CHANNEL_ID || '';
function assertTelegramBotConfig() {
  if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error('Missing TELEGRAM_BOT_TOKEN environment variable.');
}
function assertTelegramStorageConfig() {
  assertTelegramBotConfig();
  if (!telegramStorageChatId()) throw new Error('Missing TELEGRAM_STORAGE_CHAT_ID environment variable.');
}
async function telegram(method, payload) {
  assertTelegramBotConfig();
  const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, payload);
  let json;
  try { json = await response.json(); } catch { throw new Error('Telegram returned an invalid response.'); }
  if (!response.ok || !json.ok) {
    const description = clean(json?.description || `Telegram HTTP ${response.status}`, 300);
    // Preserve Telegram's actual API error so channel, permission, and token
    // problems can be diagnosed from the application response and Render logs.
    console.error('Telegram API request failed:', {
      method,
      httpStatus: response.status,
      errorCode: json?.error_code || null,
      description
    });
    throw new Error(`Telegram API ${method} failed (${json?.error_code || response.status}): ${description}`);
  }
  return json.result;
}
let telegramBotUsernameCache = { value: null, expiresAt: 0 };
async function getTelegramBotUsername() {
  const configured = clean(process.env.TELEGRAM_BOT_USERNAME, 80).replace(/^@/, '');
  const fallback = /^[A-Za-z0-9_]{5,32}$/.test(configured) ? configured : null;
  if (!process.env.TELEGRAM_BOT_TOKEN) return fallback;
  if (telegramBotUsernameCache.expiresAt > Date.now()) return telegramBotUsernameCache.value || fallback;
  try {
    // Prefer the username actually returned for the configured token. An
    // optional environment override is only a fallback if Telegram is unavailable.
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`,
      { method: 'POST', signal: AbortSignal.timeout(3500) }
    );
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.ok) {
      throw new Error(clean(payload?.description || `Telegram HTTP ${response.status}`, 200));
    }
    const username = clean(payload.result?.username, 80);
    telegramBotUsernameCache = {
      value: /^[A-Za-z0-9_]{5,32}$/.test(username) ? username : fallback,
      expiresAt: Date.now() + 5 * 60 * 1000
    };
    return telegramBotUsernameCache.value;
  } catch (error) {
    console.warn('Could not resolve Telegram bot username:', clean(error.message, 200));
    telegramBotUsernameCache = { value: fallback, expiresAt: Date.now() + 60 * 1000 };
    return fallback;
  }
}
async function uploadToTelegram(file) {
  const invalid = imageUploadError(file);
  if (invalid) throw new Error(invalid);
  assertTelegramStorageConfig();
  const form = new FormData();
  form.append('chat_id', telegramStorageChatId());
  form.append('photo', new Blob([file.buffer], { type: file.mimetype }), file.originalname || 'image.jpg');
  const result = await telegram('sendPhoto', { method: 'POST', body: form });
  const media = result.photo?.at(-1);
  if (!media?.file_id || !result.message_id) throw new Error('Telegram accepted the image but did not return a file_id/message_id.');
  return { messageId: String(result.message_id), fileId: media.file_id, mimeType: file.mimetype, method: 'sendPhoto' };
}
async function deleteTelegramMessage(messageId) {
  if (!messageId || !process.env.TELEGRAM_BOT_TOKEN || !telegramStorageChatId()) return;
  try {
    await telegram('deleteMessage', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: telegramStorageChatId(), message_id: Number(messageId) })
    });
  } catch (error) { console.warn('Telegram cleanup failed:', error.message); }
}

registerSupportChat(app, { supabase, authenticate, requireAdmin, telegram, telegramStorageChatId, deleteTelegramMessage, clean, fail });
registerSellerChat(app, { supabase, authenticate, requireVendor, upload, telegram, telegramStorageChatId, clean, fail, productPublicMaxAgeMs: PRODUCT_PUBLIC_MAX_AGE_MS });
const telegramMediaUrl = fileId => fileId ? `/api/media/telegram/${encodeURIComponent(fileId)}` : null;
function publicMediaUrl(path) {
  if (!path || !supabase) return null;
  return supabase.storage.from('profile-media').getPublicUrl(path).data.publicUrl;
}
function publicVendor(vendor) {
  if (!vendor) return vendor;
  const { store_logo_file_id: logoFileId, ...safeVendor } = vendor;
  return { ...safeVendor, store_logo_url: logoFileId ? telegramMediaUrl(logoFileId) : null };
}
function publicProduct(product) {
  return {
    ...product,
    seller_rating: product.seller_rating ?? null,
    seller_review_count: product.seller_review_count ?? 0,
    vendors: Array.isArray(product.vendors) ? product.vendors.map(publicVendor) : publicVendor(product.vendors),
    product_images: (product.product_images || []).map(image => ({
      id: image.id, sort_order: image.sort_order,
      image_url: image.image_url || telegramMediaUrl(image.file_id)
    }))
  };
}
async function streamTelegramFile(fileId, res, mimeType = 'application/octet-stream', disposition = 'inline', cacheControl = 'public, max-age=86400, stale-while-revalidate=604800') {
  const file = await telegram('getFile', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ file_id: fileId })
  });
  const fileResponse = await fetch(`https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`);
  if (!fileResponse.ok) throw new Error('Telegram file download failed.');
  const detectedType = mimeType !== 'application/octet-stream' ? mimeType : (fileResponse.headers.get('content-type') || mimeType);
  res.set('Content-Type', detectedType);
  res.set('Content-Disposition', disposition);
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Cache-Control', cacheControl);
  return res.send(Buffer.from(await fileResponse.arrayBuffer()));
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

const VENDOR_PRESENCE_TTL_MS = 65_000;
const vendorPresence = new Map();
function pruneVendorPresence() {
  const cutoff = Date.now() - VENDOR_PRESENCE_TTL_MS;
  for (const [presenceKey, lastSeen] of vendorPresence) {
    if (lastSeen < cutoff) vendorPresence.delete(presenceKey);
  }
}
function vendorPresenceTabId(req) {
  const tabId = clean(req.query.tab_id, 80);
  return /^[A-Za-z0-9-]{12,80}$/.test(tabId) ? tabId : null;
}
app.get('/api/vendors/online', (_req, res) => {
  pruneVendorPresence();
  res.set('Cache-Control', 'no-store');
  const vendorIds = [...new Set([...vendorPresence.keys()].map(key => key.split(':', 1)[0]))];
  return res.json({ data: { vendor_ids: vendorIds } });
});
app.post('/api/vendor/presence', authenticate, requireVendor, (req, res) => {
  if (req.vendor.status !== 'approved') return fail(res, 403, 'Only approved vendors can publish online presence');
  const tabId = vendorPresenceTabId(req);
  if (!tabId) return fail(res, 400, 'A valid browser tab ID is required');
  vendorPresence.set(`${req.vendor.id}:${tabId}`, Date.now());
  return res.status(204).end();
});
app.delete('/api/vendor/presence', authenticate, requireVendor, (req, res) => {
  const tabId = vendorPresenceTabId(req);
  if (!tabId) return fail(res, 400, 'A valid browser tab ID is required');
  vendorPresence.delete(`${req.vendor.id}:${tabId}`);
  return res.status(204).end();
});
setInterval(pruneVendorPresence, 20_000).unref?.();

app.get('/health', (_req, res) => res.json({ status: 'ok', service: '7inOne', database: Boolean(supabase) }));

// Admin-only Telegram diagnostics. Never returns bot tokens or webhook secrets.
app.get('/api/admin/telegram/diagnostics', authenticate, requireAdmin, async (_req, res) => {
  res.set('Cache-Control', 'no-store');
  const chatId = telegramStorageChatId();
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET || '';
  const publicUrl = clean(process.env.PUBLIC_APP_URL, 500).replace(/\/$/, '');
  const botConfigured = Boolean(process.env.TELEGRAM_BOT_TOKEN);
  const secretConfigured = /^[A-Za-z0-9_-]{32,256}$/.test(secret);
  const urlConfigured = /^https:\/\//i.test(publicUrl);

  const botCheck = botConfigured
    ? await telegramDiagnosticCall('getMe')
    : { ok: false, error: 'TELEGRAM_BOT_TOKEN is missing.' };
  const bot = botCheck.ok ? {
    ok: true, id: botCheck.result.id,
    username: botCheck.result.username || null,
    first_name: botCheck.result.first_name || null
  } : botCheck;

  const chatCheck = botConfigured && chatId
    ? await telegramDiagnosticCall('getChat', { chat_id: chatId })
    : { ok: false, error: chatId ? 'Bot token is not configured.' : 'TELEGRAM_STORAGE_CHAT_ID / TELEGRAM_CHANNEL_ID is missing.' };
  const chat = chatCheck.ok ? {
    ok: true, id: chatCheck.result.id,
    title: chatCheck.result.title || null,
    type: chatCheck.result.type || null
  } : chatCheck;

  let membership = { ok: false, error: 'Skipped because Bot or Channel is unavailable.' };
  if (botCheck.ok && chatCheck.ok) {
    const memberCheck = await telegramDiagnosticCall('getChatMember', {
      chat_id: chatId, user_id: botCheck.result.id
    });
    membership = memberCheck.ok ? {
      ok: true, status: memberCheck.result.status,
      can_post_messages: memberCheck.result.can_post_messages ?? null
    } : memberCheck;
  }

  const webhookCheck = botConfigured
    ? await telegramDiagnosticCall('getWebhookInfo')
    : { ok: false, error: 'Bot token is not configured.' };
  const expectedWebhook = urlConfigured ? publicUrl + '/api/telegram/webhook' : '';
  const webhook = webhookCheck.ok ? {
    ok: true,
    url_matches: Boolean(expectedWebhook && webhookCheck.result.url === expectedWebhook),
    configured_url: webhookCheck.result.url || '',
    expected_url: expectedWebhook,
    pending_update_count: Number(webhookCheck.result.pending_update_count || 0),
    last_error_message: webhookCheck.result.last_error_message || null,
    last_error_date: webhookCheck.result.last_error_date || null
  } : webhookCheck;

  const widgetBotUsername = await getTelegramBotUsername();
  const telegramWidgetBot = {
    ok: Boolean(widgetBotUsername),
    username: widgetBotUsername,
    error: widgetBotUsername ? null : 'Telegram Bot username is unavailable. Check TELEGRAM_BOT_TOKEN / TELEGRAM_BOT_USERNAME.'
  };
  const database = { ok: Boolean(supabase), error: supabase ? null : 'Supabase service role is not configured.' };
  const tables = {};
  if (supabase) {
    for (const table of ['telegram_account_links', 'telegram_login_tokens', telegramWidgetAuthEventsTable]) {
      const check = await supabase.from(table).select('*', { head: true, count: 'exact' }).limit(1);
      tables[table] = check.error
        ? { ok: false, error: clean(check.error.message, 250) }
        : { ok: true };
    }
    const profileColumns = await supabase.from('profiles')
      .select('telegram_id,telegram_username', { head: true }).limit(1);
    tables.profiles_telegram_columns = profileColumns.error
      ? { ok: false, error: clean(profileColumns.error.message, 250) }
      : { ok: true };
  } else {
    for (const table of ['telegram_account_links', 'telegram_login_tokens', telegramWidgetAuthEventsTable, 'profiles_telegram_columns']) {
      tables[table] = { ok: false, error: database.error };
    }
  }

  const canPost = Boolean(membership.ok &&
    ['administrator', 'creator'].includes(membership.status) &&
    (membership.status === 'creator' || membership.can_post_messages !== false));
  const loginReady = Boolean(bot.ok && secretConfigured && urlConfigured &&
    webhook.ok && webhook.url_matches && !webhook.last_error_message &&
    tables.telegram_account_links?.ok && tables.telegram_login_tokens?.ok);
  const widgetLoginReady = Boolean(bot.ok && telegramWidgetBot.ok &&
    tables.telegram_widget_auth_events?.ok && tables.profiles_telegram_columns?.ok &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY));

  return res.json({
    configured: botConfigured && Boolean(chatId),
    bot, telegram_widget_bot: telegramWidgetBot, chat, membership, can_upload: Boolean(bot.ok && chat.ok && canPost),
    webhook, webhook_secret: { ok: secretConfigured, error: secretConfigured ? null : 'TELEGRAM_WEBHOOK_SECRET must be 32–256 characters (letters, numbers, _ or -).' },
    public_app_url: { ok: urlConfigured, value: publicUrl || null, error: urlConfigured ? null : 'PUBLIC_APP_URL must be your HTTPS website URL.' },
    database, tables, login_ready: loginReady, widget_login_ready: widgetLoginReady
  });
});
// Only the Supabase anon/publishable key is exposed to the browser. Never return the service-role key.
const DEFAULT_MAINTENANCE_MESSAGE = 'ប្រព័ន្ធកំពុងធ្វើការអភិវឌ្ឍន៍ និងបន្ថែមមុខងារថ្មីៗ សូមអធ្យាស្រ័យចំពោះការរំខាន!';
async function getMaintenanceSettings() {
  if (!supabase) return { maintenanceMode: false, maintenanceMessage: DEFAULT_MAINTENANCE_MESSAGE };
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'maintenance_mode').maybeSingle();
  if (error) {
    console.error('Could not read maintenance settings:', error.message);
    return { maintenanceMode: false, maintenanceMessage: DEFAULT_MAINTENANCE_MESSAGE };
  }
  const value = data?.value || {};
  return { maintenanceMode: value.maintenanceMode === true, maintenanceMessage: clean(value.maintenanceMessage, 1000) || DEFAULT_MAINTENANCE_MESSAGE };
}
const DEFAULT_SITE_BRANDING = {
  siteTitle: '7inOne',
  siteSubtitle: 'ផ្សារទិញលក់កម្ពុជា',
  heroBadge: 'ផ្សារអនឡាញសម្រាប់អ្នកទាំងអស់គ្នា',
  heroTitle: 'ទិញលក់ងាយៗ នៅជិតអ្នក',
  heroSubtitle: 'ស្វែងរកទំនិញដែលអ្នកស្រឡាញ់ ឬដាក់លក់របស់ដែលអ្នកមិនប្រើ។ ភ្ជាប់អ្នកទិញ និងអ្នកលក់នៅទូទាំងប្រទេសកម្ពុជា។'
};
async function getSiteBranding(){
  const defaults = { ...DEFAULT_SITE_BRANDING, siteLogoUrl: '', faviconUrl: '', heroImages: [], sidePosters: {} };
  if(!supabase)return defaults;
  const {data,error}=await supabase.from('site_settings').select('value,updated_at').eq('key','site_branding').maybeSingle();
  if(error){console.error('Could not read website branding:',error.message);return defaults}
  const value=data?.value||{};
  const sameLegacyFile=Boolean(value.siteLogoFileId&&value.faviconFileId&&value.siteLogoFileId===value.faviconFileId);
  const logoFileId=clean(value.siteLogoFileId,2048)||(sameLegacyFile?clean(value.faviconFileId,2048):'');
  const faviconFileId=clean(value.faviconFileId,2048)||(sameLegacyFile?clean(value.siteLogoFileId,2048):'');
  const logoVersion=clean(value.siteLogoVersion,80)||clean(value.faviconVersion,80)||data?.updated_at||'1';
  const faviconVersion=clean(value.faviconVersion,80)||clean(value.siteLogoVersion,80)||data?.updated_at||'1';
  const siteLogoUrl=logoFileId?'/api/site/logo?v='+encodeURIComponent(logoVersion):clean(value.siteLogoUrl,2000);
  const faviconUrl=faviconFileId?'/api/site/favicon?v='+encodeURIComponent(faviconVersion):clean(value.faviconUrl,2000);
  const heroImages=(Array.isArray(value.heroImages)?value.heroImages:[]).slice(0,3).map(image=>{
    const fileId=clean(image?.fileId||image?.file_id,2048);
    return {url:fileId?telegramMediaUrl(fileId):clean(image?.url||image?.imageUrl,2000),fileId};
  }).filter(image=>image.url);
  return {siteLogoUrl,faviconUrl,siteTitle:clean(value.siteTitle,80)||DEFAULT_SITE_BRANDING.siteTitle,siteSubtitle:clean(value.siteSubtitle,120)||DEFAULT_SITE_BRANDING.siteSubtitle,heroBadge:clean(value.heroBadge,100)||DEFAULT_SITE_BRANDING.heroBadge,heroTitle:clean(value.heroTitle,160)||DEFAULT_SITE_BRANDING.heroTitle,heroSubtitle:clean(value.heroSubtitle,600)||DEFAULT_SITE_BRANDING.heroSubtitle,heroImages,sidePosters:Object.fromEntries(['top','middle','tall'].map(slot=>{
    const item=value.sidePosters?.[slot];if(!item||typeof item!=='object')return [slot,null];
    const fileId=clean(item.fileId||item.file_id,2048);
    return [slot,{url:fileId?telegramMediaUrl(fileId):clean(item.url,2000),fileId,link:clean(item.link,2000),enabled:item.enabled!==false,alt:clean(item.alt,120)}];
  }).filter(([,item])=>item?.url))};
}
app.get('/api/config', async (_req, res) => {
  const [maintenance,branding,telegramBotUsername] = await Promise.all([
    getMaintenanceSettings(), getSiteBranding(), getTelegramBotUsername()
  ]);
  res.set('Cache-Control', 'no-store');
  res.json({
    supabaseUrl: supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || null,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || null,
    telegramBotUsername,
    ...maintenance,
    ...branding
  });
});
app.patch('/api/admin/settings', authenticate, requireAdmin, async (req, res) => {
  if (typeof req.body.maintenanceMode !== 'boolean') return fail(res, 400, 'maintenanceMode must be a boolean.');
  const settings = { maintenanceMode: req.body.maintenanceMode, maintenanceMessage: clean(req.body.maintenanceMessage, 1000) || DEFAULT_MAINTENANCE_MESSAGE };
  const { error } = await supabase.from('site_settings').upsert({ key: 'maintenance_mode', value: settings, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) { console.error('Could not save maintenance settings:', error.message); return fail(res, 500, 'Could not save system status. Apply the site_settings database migration first.'); }
  res.json({ data: settings });
});
app.get('/api/site/logo', async (_req,res)=>{
  try{if(!supabase)return fail(res,503,'Website logo is unavailable.');const {data,error}=await supabase.from('site_settings').select('value').eq('key','site_branding').maybeSingle();if(error)throw error;const value=data?.value||{};const fileId=clean(value.siteLogoFileId,2048)||(value.siteLogoFileId&&value.siteLogoFileId===value.faviconFileId?clean(value.faviconFileId,2048):'');if(!fileId)return res.status(404).end();return await streamTelegramFile(fileId,res,clean(value.siteLogoMimeType,80)||(value.siteLogoFileId&&value.siteLogoFileId===value.faviconFileId?clean(value.faviconMimeType,80):'')||'image/png','inline','public, max-age=300, stale-while-revalidate=3600')}catch(error){console.error('Website logo proxy failed:',error.message);return fail(res,502,'Could not retrieve website logo from Telegram.')}
});
app.get('/api/site/favicon', async (_req,res)=>{
  try{if(!supabase)return fail(res,503,'Website favicon is unavailable.');const {data,error}=await supabase.from('site_settings').select('value').eq('key','site_branding').maybeSingle();if(error)throw error;const value=data?.value||{};const fileId=clean(value.faviconFileId,2048)||(value.faviconFileId&&value.faviconFileId===value.siteLogoFileId?clean(value.siteLogoFileId,2048):'');if(!fileId)return res.status(404).end();return await streamTelegramFile(fileId,res,clean(value.faviconMimeType,80)||(value.faviconFileId&&value.faviconFileId===value.siteLogoFileId?clean(value.siteLogoMimeType,80):'')||'image/png','inline','public, max-age=300, stale-while-revalidate=3600')}catch(error){console.error('Website favicon proxy failed:',error.message);return fail(res,502,'Could not retrieve website favicon from Telegram.')}
});
app.post('/api/admin/favicon', authenticate, requireAdmin, upload.single('file'), async (req,res)=>{
  let uploaded=null;
  try{
    const file=req.file,invalid=imageUploadError(file,2*1024*1024);
    if(invalid)return fail(res,400,invalid);
    uploaded=await uploadToTelegram(file);
    const {data:prior}=await supabase.from('site_settings').select('value').eq('key','site_branding').maybeSingle();
    const old=prior?.value||{},version=randomUUID();
    const value={...old,faviconUrl:'/api/site/favicon?v='+encodeURIComponent(version),faviconFileId:uploaded.fileId,faviconMessageId:uploaded.messageId,faviconMimeType:file.mimetype,faviconVersion:version};
    const {error:saveError}=await supabase.from('site_settings').upsert({key:'site_branding',value,updated_at:new Date().toISOString()},{onConflict:'key'});
    if(saveError)throw saveError;
    const oldMessageId=clean(old.faviconMessageId,40);
    if(oldMessageId&&oldMessageId!==uploaded.messageId&&oldMessageId!==clean(old.siteLogoMessageId,40))await deleteTelegramMessage(oldMessageId);
    res.set('Cache-Control','no-store');
    return res.status(201).json({data:{...(await getSiteBranding()),storage:'telegram'}});
  }catch(error){
    if(uploaded?.messageId)await deleteTelegramMessage(uploaded.messageId);
    console.error('Website favicon upload failed:',error.message);
    return fail(res,500,'Could not save website favicon. Check Telegram storage and Supabase service role.');
  }
});
app.patch('/api/admin/branding', authenticate, requireAdmin, upload.fields([{name:'logo',maxCount:1},{name:'favicon',maxCount:1},{name:'heroImages',maxCount:3},{name:'posterTop',maxCount:1},{name:'posterMiddle',maxCount:1},{name:'posterTall',maxCount:1}]), async (req,res)=>{
  const files=req.files||{},logo=files.logo?.[0]||null,favicon=files.favicon?.[0]||null,bannerFiles=files.heroImages||[];
  const posterFiles={top:files.posterTop?.[0]||null,middle:files.posterMiddle?.[0]||null,tall:files.posterTall?.[0]||null};
  const logoError=logo?imageUploadError(logo,2*1024*1024):null;if(logoError)return fail(res,400,'Logo: '+logoError);
  const faviconError=favicon?imageUploadError(favicon,2*1024*1024):null;if(faviconError)return fail(res,400,'Favicon: '+faviconError);
  const bannerError=bannerFiles.map(file=>imageUploadError(file,8*1024*1024)).find(Boolean);if(bannerError)return fail(res,400,'Banner: '+bannerError);
  const posterError=Object.values(posterFiles).map(file=>file?imageUploadError(file,5*1024*1024):null).find(Boolean);if(posterError)return fail(res,400,'Poster: '+posterError);
  const clearHeroImages=String(req.body.clearHeroImages||'')==='true',newlyUploaded=[];
  try{
    const {data:priorRow,error:readError}=await supabase.from('site_settings').select('value').eq('key','site_branding').maybeSingle();if(readError)throw readError;
    const prior=priorRow?.value||{},priorLogoId=clean(prior.siteLogoFileId,2048)||(prior.siteLogoFileId&&prior.siteLogoFileId===prior.faviconFileId?clean(prior.faviconFileId,2048):''),priorFaviconId=clean(prior.faviconFileId,2048)||(prior.faviconFileId&&prior.faviconFileId===prior.siteLogoFileId?clean(prior.siteLogoFileId,2048):'');
    const newLogo=logo?await uploadToTelegram(logo):null;if(newLogo)newlyUploaded.push(newLogo);
    const newFavicon=favicon?await uploadToTelegram(favicon):null;if(newFavicon)newlyUploaded.push(newFavicon);
    const newHero=[];for(const file of bannerFiles){const image=await uploadToTelegram(file);newlyUploaded.push(image);newHero.push({fileId:image.fileId,messageId:image.messageId,mimeType:image.mimeType,url:telegramMediaUrl(image.fileId)})}
    const priorPosters=prior.sidePosters&&typeof prior.sidePosters==='object'?prior.sidePosters:{},newSidePosters={};
    for(const slot of ['top','middle','tall']){
      const key=slot[0].toUpperCase()+slot.slice(1),file=posterFiles[slot],old=priorPosters[slot]||{},clear=String(req.body['clearPoster'+key]||'')==='true';
      const image=file?await uploadToTelegram(file):null;if(image)newlyUploaded.push(image);
      const linkValue=Object.prototype.hasOwnProperty.call(req.body,'poster'+key+'Link')?clean(req.body['poster'+key+'Link'],2000):clean(old.link,2000);
      if(linkValue){try{const parsed=new URL(linkValue);if(parsed.protocol!=='https:')throw new Error('HTTPS required')}catch{throw new Error('Poster links must be valid HTTPS URLs')}}
      if(file&&!clear)newSidePosters[slot]={fileId:image.fileId,messageId:image.messageId,mimeType:image.mimeType,link:linkValue,enabled:String(req.body['poster'+key+'Enabled']||'true')==='true',alt:slot==='tall'?'Promotion poster':'Homepage promotion'};
      else if(!clear&&old.fileId)newSidePosters[slot]={...old,link:linkValue,enabled:String(req.body['poster'+key+'Enabled']??(old.enabled!==false))==='true'};
      else if(!clear&&old.url)newSidePosters[slot]={...old,link:linkValue,enabled:String(req.body['poster'+key+'Enabled']??(old.enabled!==false))==='true'};
    }
    const logoVersion=newLogo?randomUUID():clean(prior.siteLogoVersion,80)||clean(prior.faviconVersion,80)||randomUUID();
    const faviconVersion=newFavicon?randomUUID():clean(prior.faviconVersion,80)||clean(prior.siteLogoVersion,80)||randomUUID();
    const logoFileId=newLogo?.fileId||priorLogoId||null,faviconFileId=newFavicon?.fileId||priorFaviconId||null;
    const value={...prior,
      siteLogoUrl:logoFileId?'/api/site/logo?v='+encodeURIComponent(logoVersion):clean(prior.siteLogoUrl,2000),
      siteLogoFileId:logoFileId,siteLogoMessageId:newLogo?.messageId||clean(prior.siteLogoMessageId,40)||(prior.siteLogoFileId&&prior.siteLogoFileId===prior.faviconFileId?clean(prior.faviconMessageId,40):'')||null,siteLogoMimeType:newLogo?.mimeType||clean(prior.siteLogoMimeType,80)||(prior.siteLogoFileId&&prior.siteLogoFileId===prior.faviconFileId?clean(prior.faviconMimeType,80):'')||null,siteLogoVersion:logoVersion,
      faviconUrl:faviconFileId?'/api/site/favicon?v='+encodeURIComponent(faviconVersion):clean(prior.faviconUrl,2000),
      faviconFileId:faviconFileId,faviconMessageId:newFavicon?.messageId||clean(prior.faviconMessageId,40)||(prior.faviconFileId&&prior.faviconFileId===prior.siteLogoFileId?clean(prior.siteLogoMessageId,40):'')||null,faviconMimeType:newFavicon?.mimeType||clean(prior.faviconMimeType,80)||(prior.faviconFileId&&prior.faviconFileId===prior.siteLogoFileId?clean(prior.siteLogoMimeType,80):'')||null,faviconVersion:faviconVersion,
      siteTitle:clean(req.body.siteTitle,80)||DEFAULT_SITE_BRANDING.siteTitle,siteSubtitle:clean(req.body.siteSubtitle,120)||DEFAULT_SITE_BRANDING.siteSubtitle,heroBadge:clean(req.body.heroBadge,100)||DEFAULT_SITE_BRANDING.heroBadge,heroTitle:clean(req.body.heroTitle,160)||DEFAULT_SITE_BRANDING.heroTitle,heroSubtitle:clean(req.body.heroSubtitle,600)||DEFAULT_SITE_BRANDING.heroSubtitle,
      heroImages:newHero.length?newHero:(clearHeroImages?[]:(Array.isArray(prior.heroImages)?prior.heroImages.slice(0,3):[])),sidePosters:newSidePosters};
    const {error:saveError}=await supabase.from('site_settings').upsert({key:'site_branding',value,updated_at:new Date().toISOString()},{onConflict:'key'});if(saveError)throw saveError;
    const retainedIds=new Set([logoFileId,faviconFileId].filter(Boolean)),oldIds=new Set([priorLogoId,priorFaviconId].filter(Boolean));
    for(const oldId of oldIds)if(!retainedIds.has(oldId)){const oldMessage=oldId===priorLogoId?clean(prior.siteLogoMessageId,40):clean(prior.faviconMessageId,40);if(oldMessage)await deleteTelegramMessage(oldMessage)}
    if(newHero.length||clearHeroImages)for(const oldImage of (Array.isArray(prior.heroImages)?prior.heroImages:[])){const oldMessage=clean(oldImage?.messageId,40);if(oldMessage)await deleteTelegramMessage(oldMessage)}
    for(const slot of ['top','middle','tall']){
      const old=priorPosters[slot],next=newSidePosters[slot];
      if(old?.messageId&&old.messageId!==next?.messageId)await deleteTelegramMessage(clean(old.messageId,40));
    }
    res.set('Cache-Control','no-store');return res.status(200).json({data:await getSiteBranding()});
  }catch(error){for(const image of newlyUploaded)await deleteTelegramMessage(image.messageId);console.error('Site branding save failed:',error.message);return fail(res,500,'Could not save Brand & Banner settings. Check Telegram storage and Supabase settings.')}
});
app.use('/api', async (req, res, nextMiddleware) => {
  if (!['POST','PUT','PATCH','DELETE'].includes(req.method) || ['/admin/settings','/admin/favicon','/telegram/webhook'].includes(req.path)) return nextMiddleware();
  try {
    const settings = await getMaintenanceSettings();
    if (!settings.maintenanceMode) return nextMiddleware();
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (token && supabase) {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data.user && await isAdmin(data.user.id)) return nextMiddleware();
    }
    return res.status(503).json({ error: 'ប្រព័ន្ធកំពុងអភិវឌ្ឍន៍។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។', maintenanceMode: true, maintenanceMessage: settings.maintenanceMessage });
  } catch (error) {
    console.error('Maintenance write guard failed:', error.message);
    return fail(res, 503, 'ប្រព័ន្ធកំពុងអភិវឌ្ឍន៍។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។');
  }
});

// Permanent backend media URLs; Telegram file_path is resolved on every request because it expires.
app.get('/api/media/telegram/:fileId', async (req, res) => {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) return fail(res, 503, 'Telegram media is unavailable: TELEGRAM_BOT_TOKEN is not configured.');
    const fileId = clean(req.params.fileId, 2048);
    if (!fileId) return fail(res, 400, 'Invalid Telegram file ID.');
    const requestedMime = clean(req.query.mime, 60).toLowerCase();
    const safeAudioMimes = new Set(['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav','audio/x-wav']);
    const safeImageMimes = new Set(['image/jpeg','image/png','image/webp']);
    const safeMime = safeAudioMimes.has(requestedMime) || safeImageMimes.has(requestedMime) ? requestedMime : 'application/octet-stream';
    return await streamTelegramFile(fileId, res, safeMime);
  } catch (error) {
    console.error('Telegram media proxy error:', error.message);
    return fail(res, 502, error.message || 'Could not retrieve Telegram media.');
  }
});


let productCleanupPromise=null;
async function cleanupExpiredProducts(){
  if(!supabase)return {deleted:0,archived:0};
  if(productCleanupPromise)return productCleanupPromise;
  productCleanupPromise=(async()=>{
    const cutoff=new Date(Date.now()-PRODUCT_AUTO_DELETE_AGE_MS).toISOString();
    const {data:stale,error}=await supabase.from('products').select('id,status,product_images(id,telegram_message_id)').lt('renewed_at',cutoff).neq('status','archived').limit(200);
    if(error){console.error('Product lifecycle cleanup failed:',error.message);return {deleted:0,archived:0,error:error.message}}
    let deleted=0,archived=0;
    for(const product of stale||[]){
      const {count:soldCount,error:countError}=await supabase.from('order_items').select('id',{count:'exact',head:true}).eq('product_id',product.id);
      if(countError){console.warn('Could not verify order history for expired product:',product.id,countError.message);continue}
      if((soldCount||0)>0){
        const {error:archiveError}=await supabase.from('products').update({status:'archived',updated_at:new Date().toISOString()}).eq('id',product.id);
        if(!archiveError)archived++;else console.warn('Could not archive expired product:',product.id,archiveError.message);
        continue;
      }
      const {error:deleteError}=await supabase.from('products').delete().eq('id',product.id);
      if(deleteError){console.warn('Could not delete expired product:',product.id,deleteError.message);continue}
      deleted++;
      for(const image of product.product_images||[])if(image.telegram_message_id)await deleteTelegramMessage(image.telegram_message_id);
    }
    if(deleted||archived)console.log('Product lifecycle cleanup:',{deleted,archived});
    return {deleted,archived};
  })().finally(()=>{productCleanupPromise=null});
  return productCleanupPromise;
}

// Seller Live / Video links.
function normalizeSellerMediaUrl(value) {
 const raw=clean(value,1000);let parsed;try{parsed=new URL(raw)}catch{return null}
 if(parsed.protocol!=='https:')return null;
 const host=parsed.hostname.toLowerCase().replace(/^www\./,'');
 const allowed=['facebook.com','fb.watch','m.facebook.com','youtube.com','youtu.be'];
 return allowed.includes(host)||host.endsWith('.youtube.com')||host.endsWith('.facebook.com')?parsed.toString():null;
}
app.get('/api/vendor/media-link',authenticate,requireVendor,async(req,res)=>{
 const {data,error}=await supabase.from('vendor_media_links').select('id,vendor_id,media_url,media_type,is_active,created_at,updated_at').eq('vendor_id',req.vendor.id).maybeSingle();
 if(error)return fail(res,500,'Could not load shop media link');return res.json({data:data||null});
});
app.post('/api/vendor/media-link',authenticate,requireVendor,async(req,res)=>{
 const mediaUrl=normalizeSellerMediaUrl(req.body?.media_url),mediaType=clean(req.body?.media_type,10);
 if(!mediaUrl)return fail(res,400,'Please provide a valid public Facebook or YouTube HTTPS link.');
 if(!['live','video'].includes(mediaType))return fail(res,400,'Media type must be live or video.');
 const {data,error}=await supabase.from('vendor_media_links').upsert({vendor_id:req.vendor.id,media_url:mediaUrl,media_type:mediaType,is_active:true,updated_at:new Date().toISOString()},{onConflict:'vendor_id'}).select('id,vendor_id,media_url,media_type,is_active,created_at,updated_at').single();
 if(error){console.error('Seller media link save failed:',error.message);return fail(res,500,'Could not save the Live / Video link')}return res.json({data});
});
app.patch('/api/vendor/media-link',authenticate,requireVendor,async(req,res)=>{
 if(typeof req.body?.is_active!=='boolean')return fail(res,400,'is_active must be true or false');
 const {data,error}=await supabase.from('vendor_media_links').update({is_active:req.body.is_active,updated_at:new Date().toISOString()}).eq('vendor_id',req.vendor.id).select('id,vendor_id,media_url,media_type,is_active,created_at,updated_at').maybeSingle();
 if(error)return fail(res,500,'Could not update Live / Video visibility');if(!data)return fail(res,404,'No Live / Video link has been saved');return res.json({data});
});
app.delete('/api/vendor/media-link',authenticate,requireVendor,async(req,res)=>{
 const {error}=await supabase.from('vendor_media_links').delete().eq('vendor_id',req.vendor.id);if(error)return fail(res,500,'Could not remove Live / Video link');return res.json({success:true});
});
app.get('/api/vendor-media',async(_req,res)=>{
 if(!db(res))return;
 const {data,error}=await supabase.from('vendor_media_links').select('id,vendor_id,media_url,media_type,created_at,vendors!inner(id,store_name,store_logo_file_id,status)').eq('is_active',true).in('vendors.status',['approved','pending','rejected']).order('updated_at',{ascending:false}).limit(30);
 if(error)return fail(res,500,'Could not load Live / Video links');
 return res.json({data:(data||[]).map(row=>({id:row.id,vendor_id:row.vendor_id,media_url:row.media_url,media_type:row.media_type,created_at:row.created_at,store_name:row.vendors?.store_name||'ហាងអ្នកលក់',store_logo_url:row.vendors?.store_logo_file_id?telegramMediaUrl(row.vendors.store_logo_file_id):null}))});
});

// Public catalogue.
app.get('/api/categories', async (_req, res) => {
  if (!db(res)) return;
  const { data, error } = await supabase.from('products').select('category').eq('status', 'active').gte('renewed_at',new Date(Date.now()-PRODUCT_PUBLIC_MAX_AGE_MS).toISOString());
  if (error) return fail(res, 500, 'Could not load categories');
  res.json({ data: [...new Set((data || []).map(row => row.category).filter(Boolean))].sort() });
});
app.get('/api/products', async (req, res) => {
  if (!db(res)) return;
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 24));
  const q = clean(req.query.q, 100);
  const category = clean(req.query.category, 80);
  let query = supabase.from('products').select('id,title,description,price,stock,category,location,condition,view_count,created_at,updated_at,renewed_at,vendor_id,product_images(id,file_id,image_url,sort_order),vendors!inner(id,store_name,status,store_logo_file_id)', { count: 'exact' })
    .eq('status', 'active').in('vendors.status', ['approved','pending','rejected']).gt('stock', 0).gte('renewed_at',new Date(Date.now()-PRODUCT_PUBLIC_MAX_AGE_MS).toISOString()).order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  if (q) { const term = q.replace(/[%_,()]/g, '').trim(); if (term) query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%,location.ilike.%${term}%`); }
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
    .select('*,product_images(id,file_id,image_url,sort_order),vendors!inner(id,user_id,store_name,status,store_logo_file_id)')
    .eq('id', req.params.id).eq('status', 'active').in('vendors.status', ['approved','pending','rejected']).gt('stock', 0).gte('renewed_at',new Date(Date.now()-PRODUCT_PUBLIC_MAX_AGE_MS).toISOString()).maybeSingle();
  if (error || !data) return fail(res, 404, 'Product not found');

  // Store owners may inspect their own products without inflating public view counts.
  const accessToken = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  let isStoreOwner = false;
  if (accessToken && data.vendors?.user_id) {
    try {
      const { data: authData } = await supabase.auth.getUser(accessToken);
      isStoreOwner = authData?.user?.id === data.vendors.user_id;
    } catch {
      // Invalid or expired optional sessions must not prevent public product viewing.
    }
  }
  if (!isStoreOwner) {
    const nextViews = Number(data.view_count || 0) + 1;
    await supabase.from('products').update({ view_count: nextViews }).eq('id', data.id);
    data.view_count = nextViews;
  }
  const trust = await ratingsFor([data.vendor_id]);
  data.seller_rating = trust[data.vendor_id]?.average ?? null;
  data.seller_review_count = trust[data.vendor_id]?.count ?? 0;
  res.json({ data: publicProduct(data) });
});


const sha256 = value => createHash('sha256').update(String(value)).digest('hex');
const telegramLinkTable = 'telegram_account_links';
const telegramLinkTokenTable = 'telegram_link_tokens';
const telegramOtpTable = 'telegram_password_otps';
const telegramWidgetAuthEventsTable = 'telegram_widget_auth_events';

async function issueTelegramPasswordOtp(userId, telegramUserId, purpose = 'security') {
  const code = String(randomInt(100000, 1000000));
  const otpHash = sha256(code);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000).toISOString();
  const { data: issued, error: issueError } = await supabase.rpc('issue_telegram_password_otp', {
    p_user_id: userId,
    p_otp_hash: otpHash,
    p_expires_at: expiresAt,
    p_created_at: now.toISOString()
  });
  if (issueError) throw issueError;

  const { data: currentOtp, error: lookupError } = await supabase.from(telegramOtpTable)
    .select('expires_at,locked_until').eq('user_id', userId).maybeSingle();
  if (lookupError) throw lookupError;
  if (!currentOtp) throw new Error('Could not load the Telegram OTP state.');

  if (issued) {
    try {
      const message = purpose === 'recovery'
        ? `7inOne Account Recovery\nលេខកូដសង្គ្រោះគណនី៖ ${code}\nមានសុពលភាព ៥ នាទី។ កុំចែករំលែកកូដនេះ។`
        : `7inOne Security\nលេខកូដផ្ទៀងផ្ទាត់ Password របស់អ្នក៖ ${code}\nកូដនេះមានសុពលភាព ៥ នាទី។ កុំចែករំលែកកូដនេះជាមួយអ្នកណា។`;
      await sendTelegramMessage(telegramUserId, message);
    } catch (error) {
      await supabase.from(telegramOtpTable).delete().eq('user_id', userId).eq('otp_hash', otpHash);
      throw error;
    }
  }

  const locked = Boolean(currentOtp.locked_until && new Date(currentOtp.locked_until).getTime() > Date.now());
  return { expiresAt: currentOtp.expires_at, alreadyIssued: !issued, locked };
}

async function recordTelegramPasswordOtpFailure(userId) {
  const { error } = await supabase.rpc('record_telegram_password_otp_failure', {
    p_user_id: userId
  });
  if (error) throw error;
}

function verifyTelegramWidgetPayload(body) {
  if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error('Telegram Bot is not configured.');
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid Telegram payload.');
  const allowed = new Set(['id','first_name','last_name','username','photo_url','auth_date']);
  const entries = Object.entries(body).filter(([key]) => key !== 'hash');
  if (!entries.length || entries.some(([key,value]) =>
    !allowed.has(key) || !['string','number'].includes(typeof value))) {
    throw new Error('Invalid Telegram authorization fields.');
  }
  const values = Object.fromEntries(entries.map(([key,value]) => [key, String(value)]));
  if (!values.id || !/^\d{1,20}$/.test(values.id) || !values.first_name?.trim() || !values.auth_date) {
    throw new Error('Telegram authorization data is incomplete.');
  }
  const receivedHash = typeof body.hash === 'string' ? body.hash.toLowerCase() : '';
  if (!/^[a-f0-9]{64}$/.test(receivedHash)) throw new Error('Invalid Telegram signature.');
  const dataCheckString = entries
    .sort(([a],[b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([key,value]) => key + '=' + String(value))
    .join('\n');
  const secretKey = createHash('sha256').update(process.env.TELEGRAM_BOT_TOKEN).digest();
  const expectedHash = createHmac('sha256', secretKey).update(dataCheckString, 'utf8').digest();
  const suppliedHash = Buffer.from(receivedHash, 'hex');
  if (suppliedHash.length !== expectedHash.length || !timingSafeEqual(suppliedHash, expectedHash)) {
    throw new Error('Telegram signature verification failed.');
  }

  const telegramIdBig = BigInt(values.id);
  if (telegramIdBig <= 0n || telegramIdBig > 9223372036854775807n) throw new Error('Invalid Telegram user ID.');
  const authDate = Number(values.auth_date);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(authDate) || authDate > now + 60 || now - authDate > 24 * 60 * 60) {
    throw new Error('Telegram authorization has expired. Please try again.');
  }

  let photoUrl = clean(values.photo_url, 2048);
  if (photoUrl) {
    try {
      const parsed = new URL(photoUrl);
      if (parsed.protocol !== 'https:') photoUrl = '';
    } catch { photoUrl = ''; }
  }
  return {
    id: telegramIdBig.toString(),
    firstName: clean(values.first_name, 100),
    lastName: clean(values.last_name, 100),
    username: clean(values.username, 80).replace(/^@/, '') || null,
    photoUrl: photoUrl || null,
    displayName: [clean(values.first_name, 100), clean(values.last_name, 100)].filter(Boolean).join(' ').slice(0, 100),
    authDate,
    signatureHash: receivedHash,
    dataCheckString
  };
}

async function claimTelegramWidgetPayload(identity) {
  const authHash = sha256(identity.id + ':' + identity.authDate + ':' + identity.signatureHash);
  const { error } = await supabase.from(telegramWidgetAuthEventsTable).insert({
    auth_hash: authHash,
    telegram_id: identity.id,
    expires_at: new Date((identity.authDate + 24 * 60 * 60) * 1000).toISOString()
  });
  if (error?.code === '23505') {
    const replay = new Error('Telegram login request has already been used. Please open the Telegram button again.');
    replay.status = 409;
    throw replay;
  }
  if (error) {
    const dbError = {
      code: clean(error.code, 40) || null,
      message: clean(error.message, 500),
      details: clean(error.details, 500) || null,
      hint: clean(error.hint, 300) || null
    };
    console.error('Telegram widget replay protection insert failed:', dbError);

    const missingSchema = ['42P01', 'PGRST205', '42703', 'PGRST204'].includes(dbError.code) ||
      /relation .* does not exist|could not find the table|column .* does not exist|schema cache/i.test(dbError.message);
    const failure = new Error(missingSchema
      ? 'Supabase cannot find the Telegram Login database objects. Confirm the SQL was run in the same Supabase project used by SUPABASE_URL, then reload the API schema cache.'
      : 'Telegram Login reached Supabase, but the database rejected the login verification record. Check the 7inOne Render server logs for “Telegram widget replay protection insert failed”.');
    failure.status = 503;
    throw failure;
  }
  void supabase.from(telegramWidgetAuthEventsTable).delete()
    .lt('expires_at', new Date().toISOString())
    .then(({error: cleanupError}) => {
      if (cleanupError) console.warn('Telegram widget auth cleanup failed:', cleanupError.message);
    });
}

async function findAuthUserByEmail(email) {
  const target = String(email || '').trim().toLowerCase();
  if (!target) return null;
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const found = (data?.users || []).find(user =>
      String(user.email || '').trim().toLowerCase() === target
    );
    if (found) return found;
    if (!data?.users || data.users.length < 1000) break;
  }
  return null;
}

function telegramInternalEmail(telegramId) {
  const digest = createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY)
    .update(String(telegramId)).digest('hex').slice(0, 40);
  return `telegram.${digest}@auth.7inone.invalid`;
}

async function createSupabaseSessionForEmail(email) {
  const { data:magic, error:magicError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email
  });
  if (magicError || !magic?.properties?.hashed_token) {
    throw magicError || new Error('Supabase could not generate a Telegram sign-in token.');
  }
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!anonKey) {
    const configError = new Error('Set NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY) in Render.');
    configError.status = 503;
    throw configError;
  }
  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
  const { data, error } = await authClient.auth.verifyOtp({
    token_hash: magic.properties.hashed_token,
    type: 'email'
  });
  if (error || !data?.session?.access_token || !data?.session?.refresh_token) {
    throw error || new Error('Supabase did not return an authenticated session.');
  }
  return data.session;
}
function telegramWebhookSecret(req) {
  const supplied = req.get('x-telegram-bot-api-secret-token') || '';
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET || '';
  return Boolean(expected && supplied && supplied.length === expected.length &&
    timingSafeEqual(Buffer.from(supplied), Buffer.from(expected)));
}
async function sendTelegramMessage(chatId, text) {
  return telegram('sendMessage', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true })
  });
}
async function ensureTelegramWebhook(req) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET || '';
  if (!/^[A-Za-z0-9_-]{32,256}$/.test(secret)) {
    throw new Error('Set TELEGRAM_WEBHOOK_SECRET in Render to a random value of 32–256 characters.');
  }
  const baseUrl = clean(process.env.PUBLIC_APP_URL || `${req.protocol}://${req.get('host')}`, 500).replace(/\/$/, '');
  if (!/^https:\/\//i.test(baseUrl)) throw new Error('Telegram webhook requires an HTTPS PUBLIC_APP_URL.');
  await telegram('setWebhook', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      url: baseUrl + '/api/telegram/webhook',
      secret_token: secret,
      allowed_updates: ['message'],
      drop_pending_updates: false
    })
  });
}
const telegramOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'សូមរង់ចាំមុនពេលស្នើលេខកូដម្ដងទៀត។' }
});

// Start a one-time Telegram deep-link flow for the signed-in account.
app.post('/api/me/telegram/connect', authenticate, async (req, res) => {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) return fail(res, 503, 'Telegram Bot មិនទាន់កំណត់នៅ Render ទេ។');
    await ensureTelegramWebhook(req);
    const bot = await telegram('getMe', { method: 'POST' });
    if (!bot?.username) throw new Error('Telegram Bot មិនមាន username ទេ។');
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const { error } = await supabase.from(telegramLinkTokenTable).insert({
      token_hash: sha256(token), user_id: req.user.id, account_email: clean(req.user.email, 254).toLowerCase() || null, expires_at: expiresAt
    });
    if (error) {
      console.error('Telegram link token insert failed:', error.message);
      return fail(res, 500, 'មិនអាចបង្កើតតំណភ្ជាប់ Telegram បានទេ។ សូមដំណើរការ SQL Migration ជាមុន។');
    }
    res.set('Cache-Control', 'no-store');
    return res.json({ data: { url: `https://t.me/${bot.username}?start=connect_${token}`, expiresAt } });
  } catch (error) {
    console.error('Telegram connect initiation failed:', error.message);
    return fail(res, 503, error.message || 'មិនអាចភ្ជាប់ Telegram បានទេ។');
  }
});

app.get('/api/me/telegram', authenticate, async (req, res) => {
  const [{ data: botLink, error: botError }, { data: profile, error: profileError }] = await Promise.all([
    supabase.from(telegramLinkTable)
      .select('telegram_user_id,username,first_name,linked_at').eq('user_id', req.user.id).maybeSingle(),
    supabase.from('profiles')
      .select('telegram_id,telegram_username').eq('id', req.user.id).maybeSingle()
  ]);
  if (botError || profileError) {
    console.error('Telegram link status lookup failed:', botError?.message || profileError?.message);
    return fail(res, 500, 'មិនអាចអានស្ថានភាព Telegram បានទេ។ សូមពិនិត្យ SQL Migration។');
  }
  res.set('Cache-Control', 'no-store');
  return res.json({ data: {
    connected: Boolean(botLink), // Bot chat connection used for OTP / notifications.
    username: botLink?.username || profile?.telegram_username || null,
    first_name: botLink?.first_name || null,
    linked_at: botLink?.linked_at || null,
    login_linked: Boolean(profile?.telegram_id),
    telegram_id: profile?.telegram_id ? String(profile.telegram_id) : null,
    telegram_username: profile?.telegram_username || null
  } });
});

const telegramWidgetLinkLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'សូមរង់ចាំមុនពេលភ្ជាប់ Telegram ម្ដងទៀត។' }
});
app.post('/api/me/telegram', authenticate, telegramWidgetLinkLimiter, async (req, res) => {
  let identity;
  try { identity = verifyTelegramWidgetPayload(req.body); }
  catch (error) { return fail(res, 401, 'ទិន្នន័យ Telegram មិនត្រឹមត្រូវ ឬផុតកំណត់។ សូមចុចភ្ជាប់ម្ដងទៀត។'); }

  try {
    await claimTelegramWidgetPayload(identity);
    const [
      { data: currentProfile, error: currentError },
      { data: linkedProfile, error: linkedProfileError },
      { data: botLink, error: botLinkError }
    ] = await Promise.all([
      supabase.from('profiles').select('id,telegram_id,telegram_username,display_name,avatar_url')
        .eq('id', req.user.id).maybeSingle(),
      supabase.from('profiles').select('id').eq('telegram_id', identity.id).maybeSingle(),
      supabase.from(telegramLinkTable).select('user_id').eq('telegram_user_id', identity.id).maybeSingle()
    ]);
    if (currentError || linkedProfileError || botLinkError) {
      console.error('Telegram profile link lookup failed:', currentError?.message || linkedProfileError?.message || botLinkError?.message);
      return fail(res, 503, 'សូម Run supabase/telegram_login_widget.sql និង Telegram Account Security SQL ជាមុន។');
    }
    if (linkedProfile && linkedProfile.id !== req.user.id) {
      return fail(res, 409, 'Telegram នេះបានភ្ជាប់ជាមួយគណនី 7inOne ផ្សេងរួចហើយ។');
    }
    if (botLink && botLink.user_id !== req.user.id) {
      return fail(res, 409, 'Telegram នេះត្រូវបានប្រើជាមួយគណនី 7inOne ផ្សេងរួចហើយ។');
    }
    if (currentProfile?.telegram_id && String(currentProfile.telegram_id) !== identity.id) {
      return fail(res, 409, 'គណនី 7inOne នេះបានភ្ជាប់ Telegram ផ្សេងរួចហើយ។ សូមទាក់ទង Admin ដើម្បីប្ដូរ។');
    }
    const patch = {
      telegram_id: identity.id,
      telegram_username: identity.username || currentProfile?.telegram_username || null
    };
    if (!currentProfile?.display_name) patch.display_name = identity.displayName;
    if (!currentProfile?.avatar_url && identity.photoUrl) patch.avatar_url = identity.photoUrl;
    const { error: saveError } = await supabase.from('profiles')
      .update(patch).eq('id', req.user.id);
    if (saveError) {
      console.error('Telegram profile link save failed:', saveError.message);
      return fail(res, 500, 'មិនអាចរក្សាទុក Telegram ID បានទេ។ សូមពិនិត្យ Database Migration។');
    }
    res.set('Cache-Control', 'no-store');
    return res.json({ data: { linked: true, telegram_id: identity.id, telegram_username: identity.username } });
  } catch (error) {
    console.error('Telegram profile linking failed:', clean(error.message, 250));
    return fail(res, error.status || 500, error.status === 409 ? error.message :
      error.status === 503 ? error.message : 'មិនអាចភ្ជាប់ Telegram ទៅគណនីនេះបានទេ។');
  }
});

// Telegram sends updates here. Only a private chat can complete a pending link.
app.post('/api/telegram/webhook', async (req, res) => {
  if (!telegramWebhookSecret(req)) return fail(res, 401, 'Unauthorized webhook');
  res.sendStatus(200);
  try {
    const message = req.body?.message;
    const chat = message?.chat;
    const textValue = clean(message?.text, 500);
    if (!message || chat?.type !== 'private' || !textValue.startsWith('/start')) return;
    const payload = textValue.split(/\s+/, 2)[1] || '';
    if (payload.startsWith('login_')) {
      const rawLoginToken = payload.slice(6);
      if (!/^[A-Za-z0-9_-]{32,80}$/.test(rawLoginToken)) {
        await sendTelegramMessage(chat.id, 'តំណ Login មិនត្រឹមត្រូវ ឬផុតកំណត់។ សូមត្រឡប់ទៅ 7inOne ហើយសាកល្បងម្ដងទៀត។');
        return;
      }
      const loginHash = sha256(rawLoginToken);
      const { data: loginToken, error: loginTokenError } = await supabase.from('telegram_login_tokens')
        .select('token_hash,expires_at,consumed_at').eq('token_hash', loginHash).maybeSingle();
      if (loginTokenError || !loginToken || loginToken.consumed_at || new Date(loginToken.expires_at).getTime() < Date.now()) {
        await sendTelegramMessage(chat.id, 'តំណ Login នេះបានប្រើរួច ឬផុតកំណត់។ សូមចាប់ផ្ដើមម្ដងទៀតពី 7inOne។');
        return;
      }
      const { data: linkedAccount, error: linkedAccountError } = await supabase.from(telegramLinkTable)
        .select('user_id,account_email').eq('telegram_user_id', chat.id).maybeSingle();
      if (linkedAccountError) throw linkedAccountError;
      if (!linkedAccount?.account_email) {
        await sendTelegramMessage(chat.id, 'Telegram នេះមិនទាន់ភ្ជាប់ជាមួយគណនី 7inOne ទេ។ សូមចូល 7inOne ដោយ Email/Password រួច Connect Telegram ក្នុង Profile ជាមុនសិន។');
        return;
      }
      const { data: consumed, error: consumeError } = await supabase.from('telegram_login_tokens')
        .update({ consumed_at: new Date().toISOString() }).eq('token_hash', loginHash).is('consumed_at', null)
        .gt('expires_at', new Date().toISOString()).select('token_hash').maybeSingle();
      if (consumeError) throw consumeError;
      if (!consumed) {
        await sendTelegramMessage(chat.id, 'តំណ Login នេះត្រូវបានប្រើរួច ឬផុតកំណត់។');
        return;
      }
      const baseUrl = clean(process.env.PUBLIC_APP_URL || '', 500).replace(/\/$/, '');
      if (!/^https:\/\//i.test(baseUrl)) throw new Error('Set PUBLIC_APP_URL to the public HTTPS 7inOne website URL in Render.');
      const { data: magic, error: magicError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: linkedAccount.account_email,
        options: { redirectTo: baseUrl }
      });
      if (magicError || !magic?.properties?.action_link) throw magicError || new Error('Supabase did not generate a sign-in link.');
      await sendTelegramMessage(chat.id,
        '7inOne Login៖ សូមចុចតំណសុវត្ថិភាពខាងក្រោម ដើម្បីចូលគណនីរបស់អ្នក។ តំណនេះប្រើបានតែម្តង និងមានសុពលភាពខ្លី។\n' + magic.properties.action_link);
      return;
    }
    if (!payload.startsWith('connect_')) {
      await sendTelegramMessage(chat.id, 'សូមត្រឡប់ទៅ 7inOne ហើយចុច Connect Telegram ឬ Continue with Telegram ដើម្បីបន្ត។');
      return;
    }
    const rawToken = payload.slice(8);
    if (!/^[A-Za-z0-9_-]{32,80}$/.test(rawToken)) {
      await sendTelegramMessage(chat.id, 'តំណភ្ជាប់មិនត្រឹមត្រូវ ឬផុតកំណត់។ សូមបង្កើតតំណថ្មីពី 7inOne។');
      return;
    }
    const tokenHash = sha256(rawToken);
    const { data: linkToken, error: tokenError } = await supabase.from(telegramLinkTokenTable)
      .select('user_id,account_email,expires_at,consumed_at').eq('token_hash', tokenHash).maybeSingle();
    if (tokenError || !linkToken || linkToken.consumed_at || new Date(linkToken.expires_at).getTime() < Date.now()) {
      await sendTelegramMessage(chat.id, 'តំណភ្ជាប់នេះបានប្រើរួច ឬផុតកំណត់។ សូមបង្កើតតំណថ្មីពី 7inOne។');
      return;
    }
    const [{ data: prior, error: priorError }, { data: profileOwner, error: profileOwnerError }, { data: targetProfile, error: targetProfileError }] = await Promise.all([
      supabase.from(telegramLinkTable).select('user_id')
        .eq('telegram_user_id', chat.id).maybeSingle(),
      supabase.from('profiles').select('id').eq('telegram_id', String(chat.id)).maybeSingle(),
      supabase.from('profiles').select('telegram_id')
        .eq('id', linkToken.user_id).maybeSingle()
    ]);
    if (priorError || profileOwnerError || targetProfileError) {
      throw priorError || profileOwnerError || targetProfileError;
    }
    if ((prior && prior.user_id !== linkToken.user_id) ||
        (profileOwner && profileOwner.id !== linkToken.user_id)) {
      await sendTelegramMessage(chat.id, 'Telegram នេះបានភ្ជាប់ជាមួយគណនី 7inOne ផ្សេងរួចហើយ។');
      return;
    }
    if (targetProfile?.telegram_id && String(targetProfile.telegram_id) !== String(chat.id)) {
      await sendTelegramMessage(chat.id, 'គណនី 7inOne នេះបានភ្ជាប់ Telegram ផ្សេងរួចហើយ។ សូមចូល Profile ដើម្បីពិនិត្យ។');
      return;
    }
    const username = clean(message.from?.username, 80) || null;
    const { error: saveError } = await supabase.from(telegramLinkTable).upsert({
      user_id: linkToken.user_id,
      account_email: linkToken.account_email,
      telegram_user_id: chat.id,
      username,
      first_name: clean(message.from?.first_name, 120) || null,
      linked_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (saveError) {
      console.error('Telegram account link save failed:', saveError.message);
      await sendTelegramMessage(chat.id, 'មិនអាចភ្ជាប់គណនីបានទេ។ Telegram នេះអាចបានភ្ជាប់ជាមួយគណនីផ្សេងរួចហើយ។');
      return;
    }
    const { error: profileSaveError } = await supabase.from('profiles').update({
      telegram_id: String(chat.id),
      telegram_username: username
    }).eq('id', linkToken.user_id);
    if (profileSaveError) {
      console.error('Telegram profile ID sync failed:', profileSaveError.message);
      await sendTelegramMessage(chat.id, 'បានភ្ជាប់ Bot Chat ប៉ុន្តែមិនអាចរក្សាទុក Telegram Login ID បានទេ។ សូមពិនិត្យ Migration។');
      return;
    }
    await supabase.from(telegramLinkTokenTable).update({ consumed_at: new Date().toISOString() })
      .eq('token_hash', tokenHash).is('consumed_at', null);
    await sendTelegramMessage(chat.id, 'បានភ្ជាប់ Telegram ជាមួយគណនី 7inOne រួចរាល់។ អ្នកអាចប្រើ Telegram នេះសម្រាប់ផ្ទៀងផ្ទាត់ការប្ដូរ Password និងទទួលសារសុវត្ថិភាព។');
  } catch (error) {
    console.error('Telegram webhook processing failed:', error.message);
  }
});

const telegramLoginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'សូមរង់ចាំមុនពេលស្នើ Login តាម Telegram ម្ដងទៀត។' }
});

// Start Telegram sign-in. The Telegram identity must already be linked to a 7inOne account.
app.post('/api/auth/telegram/login/start', telegramLoginLimiter, async (req, res) => {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) return fail(res, 503, 'Telegram Bot មិនទាន់កំណត់នៅ Render ទេ។');
    await ensureTelegramWebhook(req);
    const bot = await telegram('getMe', { method: 'POST' });
    if (!bot?.username) throw new Error('Telegram Bot មិនមាន username ទេ។');
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const { error } = await supabase.from('telegram_login_tokens').insert({
      token_hash: sha256(token), expires_at: expiresAt
    });
    if (error) throw error;
    res.set('Cache-Control', 'no-store');
    return res.json({ data: { url: `https://t.me/${bot.username}?start=login_${token}`, expiresAt } });
  } catch (error) {
    console.error('Telegram login initiation failed:', error.message);
    return fail(res, 503, 'មិនអាចចាប់ផ្ដើម Login តាម Telegram បានទេ។ សូមព្យាយាមម្ដងទៀត។');
  }
});

const telegramWidgetLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'សូមរង់ចាំមុនពេលសាកល្បង Login តាម Telegram ម្ដងទៀត។' }
});

// Telegram Login Widget: validate Telegram's signed payload, resolve the existing
// account (including legacy bot links), or create a customer account and issue a Supabase session.
app.post('/api/auth/telegram', telegramWidgetLoginLimiter, async (req, res) => {
  if (!db(res)) return;
  let identity;
  try { identity = verifyTelegramWidgetPayload(req.body); }
  catch (error) { return fail(res, 401, 'ការផ្ទៀងផ្ទាត់ Telegram មិនត្រឹមត្រូវ ឬផុតកំណត់។ សូមសាកល្បងម្ដងទៀត។'); }

  try {
    await claimTelegramWidgetPayload(identity);
    const [
      { data: profileByTelegram, error: profileError },
      { data: legacyLink, error: legacyError }
    ] = await Promise.all([
      supabase.from('profiles')
        .select('id,telegram_id,telegram_username,display_name,avatar_url')
        .eq('telegram_id', identity.id).maybeSingle(),
      supabase.from(telegramLinkTable)
        .select('user_id,account_email').eq('telegram_user_id', identity.id).maybeSingle()
    ]);
    if (profileError || legacyError) {
      console.error('Telegram account lookup failed:', profileError?.message || legacyError?.message);
      return fail(res, 503, 'សូម Run supabase/telegram_login_widget.sql និង Telegram Account Security SQL ជាមុន។');
    }
    if (profileByTelegram && legacyLink && profileByTelegram.id !== legacyLink.user_id) {
      return fail(res, 409, 'Telegram ID នេះមានការភ្ជាប់គណនីមិនស៊ីគ្នា។ សូមទាក់ទង Admin។');
    }

    let userId = profileByTelegram?.id || legacyLink?.user_id || null;
    let existingProfile = profileByTelegram || null;
    let authUser = null;
    let isNewUser = false;
    let email = '';

    if (userId) {
      if (!existingProfile) {
        const { data: profileById, error: profileByIdError } = await supabase.from('profiles')
          .select('id,telegram_id,telegram_username,display_name,avatar_url')
          .eq('id', userId).maybeSingle();
        if (profileByIdError) throw profileByIdError;
        existingProfile = profileById;
      }
      const { data: authResult, error: authError } = await supabase.auth.admin.getUserById(userId);
      if (authError || !authResult?.user) throw authError || new Error('Existing Supabase account was not found.');
      authUser = authResult.user;
      email = clean(authUser.email || legacyLink?.account_email, 254).toLowerCase();
      if (!email) {
        // Existing phone-only accounts keep their phone and password. Add an
        // opaque, confirmed internal email solely for server-issued magic-link sessions.
        const internalEmail = telegramInternalEmail(identity.id);
        const emailOwner = await findAuthUserByEmail(internalEmail);
        if (emailOwner && emailOwner.id !== userId) {
          const conflict = new Error('Telegram Account មានការប៉ះទង្គិច។ សូមទាក់ទង Admin។');
          conflict.status = 409;
          throw conflict;
        }
        const { data:updatedAuth, error:updateAuthError } = await supabase.auth.admin.updateUserById(userId, {
          email: internalEmail,
          email_confirm: true,
          user_metadata: {
            ...(authUser.user_metadata || {}),
            auth_provider: 'telegram',
            telegram_id: identity.id,
            telegram_username: identity.username,
            display_name: existingProfile?.display_name || identity.displayName,
            avatar_url: existingProfile?.avatar_url || identity.photoUrl || null
          }
        });
        if (updateAuthError || !updatedAuth?.user) {
          console.error('Could not add internal Telegram email to phone-only account:', updateAuthError?.message);
          throw updateAuthError || new Error('Could not prepare Supabase session for phone-only account.');
        }
        authUser = updatedAuth.user;
        email = clean(authUser.email, 254).toLowerCase();
      }
    } else {
      // Use a keyed opaque address instead of embedding a predictable Telegram ID.
      // This address is internal to Supabase Auth and is never shown to the user.
      email = telegramInternalEmail(identity.id);
      const { data:created, error:createError } = await supabase.auth.admin.createUser({
        email,
        password: randomBytes(48).toString('base64url'),
        email_confirm: true,
        user_metadata: {
          auth_provider: 'telegram',
          telegram_id: identity.id,
          telegram_username: identity.username,
          display_name: identity.displayName,
          avatar_url: identity.photoUrl
        }
      });
      if (createError) {
        // Resolve a concurrent/partially-created deterministic Telegram account
        // with the supported paginated Admin listUsers API.
        const existingUser = await findAuthUserByEmail(email);
        const existingTelegramId = String(existingUser?.user_metadata?.telegram_id || '');
        if (!existingUser ||
            existingUser.user_metadata?.auth_provider !== 'telegram' ||
            existingTelegramId !== identity.id) {
          // Never adopt an arbitrary account that happens to occupy this internal email.
          throw createError;
        }
        authUser = existingUser;
      } else {
        authUser = created.user;
        isNewUser = true;
      }
      userId = authUser.id;
    }

    if (!authUser?.email) {
      const accountError = new Error('គណនីនេះមិនមាន Email ដែលអាចប្រើសម្រាប់ Supabase Magic Link បានទេ។');
      accountError.status = 409;
      throw accountError;
    }
    const profilePayload = {
      id: userId,
      display_name: existingProfile?.display_name || identity.displayName,
      avatar_url: existingProfile?.avatar_url || identity.photoUrl || null,
      telegram_id: identity.id,
      telegram_username: identity.username || existingProfile?.telegram_username || null
    };
    if (!existingProfile) profilePayload.role = 'customer';
    const { error:profileSaveError } = await supabase.from('profiles')
      .upsert(profilePayload, { onConflict: 'id' });
    if (profileSaveError) {
      console.error('Telegram profile initialization failed:', profileSaveError.message);
      throw new Error('មិនអាចរក្សាទុក Telegram Profile បានទេ។ សូមពិនិត្យ Migration និង Profiles Table។');
    }

    const supabaseSession = await createSupabaseSessionForEmail(authUser.email);
    res.set('Cache-Control', 'no-store');
    return res.json({
      data: {
        session: {
          access_token: supabaseSession.access_token,
          refresh_token: supabaseSession.refresh_token,
          expires_in: supabaseSession.expires_in,
          token_type: supabaseSession.token_type
        },
        isNewUser,
        telegram: {
          id: identity.id,
          username: identity.username,
          display_name: identity.displayName
        }
      }
    });
  } catch (error) {
    console.error('Telegram Widget sign-in failed:', clean(error.message, 250));
    return fail(res, error.status || 500,
      error.status === 409 || error.status === 503 ? error.message :
      'មិនអាចបញ្ចប់ Login តាម Telegram បានទេ។ សូមពិនិត្យ Bot, Supabase និង SQL Migration។');
  }
});

app.post('/api/me/telegram/password-otp', authenticate, telegramOtpLimiter, async (req, res) => {
  try {
    const { data: link, error: linkError } = await supabase.from(telegramLinkTable)
      .select('telegram_user_id').eq('user_id', req.user.id).maybeSingle();
    if (linkError) throw linkError;
    if (!link) return fail(res, 400, 'សូម Connect Telegram ជាមុនសិន។');
    const issued = await issueTelegramPasswordOtp(req.user.id, link.telegram_user_id);
    return res.json({ data: { sent: !issued.locked, expiresAt: issued.expiresAt } });
  } catch (error) {
    console.error('Telegram password OTP request failed:', error.message);
    return fail(res, 500, 'មិនអាចផ្ញើ OTP បានទេ។ សូមពិនិត្យ Telegram Bot និង Database Migration។');
  }
});


const recoveryOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'សូមរង់ចាំមុនពេលស្នើលេខកូដម្ដងទៀត។' }
});

const adminBootstrapLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'សូមរង់ចាំមុនពេលសាកល្បងម្ដងទៀត។' }
});
app.post('/api/auth/telegram/admin-bootstrap', adminBootstrapLimiter, async (req, res) => {
  const email = clean(req.body.email, 254).toLowerCase();
  const suppliedKey = String(req.body.bootstrapKey || '');
  const expectedKey = process.env.ADMIN_TELEGRAM_BOOTSTRAP_KEY || '';
  const keyMatches = Boolean(expectedKey.length >= 32 && suppliedKey && suppliedKey.length === expectedKey.length &&
    timingSafeEqual(Buffer.from(suppliedKey), Buffer.from(expectedKey)));
  if (!keyMatches) return fail(res, 401, 'Recovery Key មិនត្រឹមត្រូវ។');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(res, 400, 'សូមបញ្ចូល Email Admin ត្រឹមត្រូវ។');
  try {
    await ensureTelegramWebhook(req);
    let targetUser = null;
    for (let page = 1; page <= 10 && !targetUser; page += 1) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) throw error;
      targetUser = (data.users || []).find(user => String(user.email || '').toLowerCase() === email) || null;
      if (!data.users || data.users.length < 1000) break;
    }
    if (!targetUser || !await isAdmin(targetUser.id)) {
      return fail(res, 404, 'មិនអាចផ្ទៀងផ្ទាត់គណនី Admin នេះបានទេ។');
    }
    const bot = await telegram('getMe', { method: 'POST' });
    if (!bot?.username) throw new Error('Telegram Bot មិនមាន username ទេ។');
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const { error: tokenError } = await supabase.from(telegramLinkTokenTable).insert({
      token_hash: sha256(token), user_id: targetUser.id, account_email: email, expires_at: expiresAt
    });
    if (tokenError) throw tokenError;
    return res.set('Cache-Control', 'no-store').json({
      data: { url: `https://t.me/${bot.username}?start=connect_${token}`, expiresAt }
    });
  } catch (error) {
    console.error('Admin Telegram bootstrap failed:', error.message);
    return fail(res, 500, 'មិនអាចបង្កើតតំណភ្ជាប់ Telegram សម្រាប់ Admin បានទេ។');
  }
});

app.post('/api/auth/telegram/recovery/request', recoveryOtpLimiter, async (req, res) => {
  const email = clean(req.body.email, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(res, 400, 'សូមបញ្ចូល Email ត្រឹមត្រូវ។');
  try {
    const { data: link, error } = await supabase.from(telegramLinkTable)
      .select('user_id,telegram_user_id').eq('account_email', email).maybeSingle();
    if (error) throw error;
    if (link) await issueTelegramPasswordOtp(link.user_id, link.telegram_user_id, 'recovery');
    return res.json({ data: { accepted: true }, message: 'ប្រសិនបើគណនីនេះបានភ្ជាប់ Telegram រួច លេខកូដនឹងត្រូវបានផ្ញើទៅ Telegram នោះ។' });
  } catch (error) {
    console.error('Telegram recovery OTP request failed:', error.message);
    return fail(res, 500, 'មិនអាចស្នើសុំសង្គ្រោះគណនីបានទេ។ សូមព្យាយាមម្ដងទៀត។');
  }
});
app.post('/api/auth/telegram/recovery/confirm', recoveryOtpLimiter, async (req, res) => {
  const email = clean(req.body.email, 254).toLowerCase();
  const code = clean(req.body.code, 6);
  const password = String(req.body.password || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(res, 400, 'Email មិនត្រឹមត្រូវ។');
  if (!/^\d{6}$/.test(code)) return fail(res, 400, 'សូមបញ្ចូល OTP ៦ ខ្ទង់។');
  if (password.length < 8 || password.length > 72) return fail(res, 400, 'Password ថ្មីត្រូវមាន ៨–៧២ តួអក្សរ។');
  try {
    const { data: link, error: linkError } = await supabase.from(telegramLinkTable)
      .select('user_id,telegram_user_id').eq('account_email', email).maybeSingle();
    if (linkError) throw linkError;
    if (!link) return fail(res, 400, 'OTP មិនត្រឹមត្រូវ ឬផុតកំណត់។');
    const { data: otp, error: otpError } = await supabase.from(telegramOtpTable)
      .select('otp_hash,expires_at,attempts,locked_until').eq('user_id', link.user_id).maybeSingle();
    if (otpError) throw otpError;
    if (!otp || new Date(otp.expires_at).getTime() < Date.now() ||
      Number(otp.attempts) >= 5 ||
      (otp.locked_until && new Date(otp.locked_until).getTime() > Date.now())) {
      return fail(res, 400, 'OTP មិនត្រឹមត្រូវ ឬផុតកំណត់។');
    }
    if (sha256(code) !== otp.otp_hash) {
      await recordTelegramPasswordOtpFailure(link.user_id);
      return fail(res, 400, 'OTP មិនត្រឹមត្រូវ។');
    }
    const { error: updateError } = await supabase.auth.admin.updateUserById(link.user_id, { password });
    if (updateError) throw updateError;
    await supabase.from(telegramOtpTable).delete().eq('user_id', link.user_id);
    try {
      await sendTelegramMessage(link.telegram_user_id,
        '7inOne Security៖ Password គណនីរបស់អ្នកត្រូវបានសង្គ្រោះ និងកំណត់ថ្មីជោគជ័យ។ ប្រសិនបើមិនមែនជាអ្នក សូមទាក់ទងក្រុមការងារ 7inOne។');
    } catch (notifyError) {
      console.warn('Account recovered but Telegram notification failed:', notifyError.message);
    }
    return res.json({ data: { recovered: true } });
  } catch (error) {
    console.error('Telegram account recovery failed:', error.message);
    return fail(res, 500, 'មិនអាចសង្គ្រោះគណនីបានទេ។ សូមព្យាយាមម្ដងទៀត។');
  }
});

app.post('/api/me/telegram/change-password', authenticate, telegramOtpLimiter, async (req, res) => {
  try {
    const code = clean(req.body.code, 6);
    const password = String(req.body.password || '');
    if (!/^\d{6}$/.test(code)) return fail(res, 400, 'សូមបញ្ចូល OTP ៦ ខ្ទង់។');
    if (password.length < 8 || password.length > 72) return fail(res, 400, 'Password ថ្មីត្រូវមាន ៨–៧២ តួអក្សរ។');
    const { data: otp, error: otpError } = await supabase.from(telegramOtpTable)
      .select('otp_hash,expires_at,attempts,locked_until').eq('user_id', req.user.id).maybeSingle();
    if (otpError) throw otpError;
    if (!otp || new Date(otp.expires_at).getTime() < Date.now() ||
      Number(otp.attempts) >= 5 ||
      (otp.locked_until && new Date(otp.locked_until).getTime() > Date.now())) {
      return fail(res, 400, 'OTP ផុតកំណត់ ឬមិនត្រឹមត្រូវ។ សូមស្នើកូដថ្មី។');
    }
    if (sha256(code) !== otp.otp_hash) {
      await recordTelegramPasswordOtpFailure(req.user.id);
      return fail(res, 400, 'OTP មិនត្រឹមត្រូវ។');
    }
    const { error: updateError } = await supabase.auth.admin.updateUserById(req.user.id, { password });
    if (updateError) throw updateError;
    await supabase.from(telegramOtpTable).delete().eq('user_id', req.user.id);
    const { data: link } = await supabase.from(telegramLinkTable)
      .select('telegram_user_id').eq('user_id', req.user.id).maybeSingle();
    if (link) {
      try {
        await sendTelegramMessage(link.telegram_user_id,
          '7inOne Security៖ Password របស់អ្នកត្រូវបានប្ដូរជោគជ័យ។ ប្រសិនបើមិនមែនជាអ្នកធ្វើសកម្មភាពនេះ សូមទាក់ទងក្រុមការងារ 7inOne ភ្លាមៗ។');
      } catch (notifyError) {
        console.warn('Password changed but Telegram notification failed:', notifyError.message);
      }
    }
    return res.json({ data: { changed: true } });
  } catch (error) {
    console.error('Telegram password change failed:', error.message);
    return fail(res, 500, 'មិនអាចប្ដូរ Password បានទេ។ សូមព្យាយាមម្ដងទៀត។');
  }
});

// Profile and vendor onboarding.
app.get('/api/me', authenticate, async (req, res) => {
  const [{ data: profile }, { data: vendor }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', req.user.id).maybeSingle(),
    vendorFor(req.user.id)
  ]);
  const normalized = profile ? { ...profile, avatar_url: profile.avatar_url || telegramMediaUrl(profile.avatar_file_id) || publicMediaUrl(profile.avatar_path), cover_url: profile.cover_url || telegramMediaUrl(profile.cover_file_id) || publicMediaUrl(profile.cover_path) } : null;
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
  res.json({ data: { ...data, avatar_url: data.avatar_url || telegramMediaUrl(data.avatar_file_id) || publicMediaUrl(data.avatar_path), cover_url: data.cover_url || telegramMediaUrl(data.cover_file_id) || publicMediaUrl(data.cover_path) } });
});
app.post('/api/me/media', authenticate, upload.single('file'), async (req, res) => {
  try {
    const type = clean(req.body.type, 20);
    const file = req.file;
    if (!['avatar','cover'].includes(type)) return fail(res, 400, 'Invalid profile image type.');
    const invalidImage = imageUploadError(file); if (invalidImage) return fail(res, 400, invalidImage);
    const { data: prior } = await supabase.from('profiles')
      .select('avatar_file_id,avatar_message_id,cover_file_id,cover_message_id,avatar_path,cover_path')
      .eq('id', req.user.id).maybeSingle();
    const uploaded = await uploadToTelegram(file);
    const url = telegramMediaUrl(uploaded.fileId);
    const patch = type === 'avatar'
      ? { avatar_file_id: uploaded.fileId, avatar_message_id: uploaded.messageId, avatar_url: url, avatar_path: null }
      : { cover_file_id: uploaded.fileId, cover_message_id: uploaded.messageId, cover_url: url, cover_path: null };
    const { data, error } = await supabase.from('profiles').update(patch).eq('id', req.user.id).select().single();
    if (error) {
      await deleteTelegramMessage(uploaded.messageId);
      console.error('Profile Telegram media DB update failed:', error.message);
      return fail(res, 500, 'Image uploaded to Telegram but could not be saved to the profile database. Apply the Telegram media migration.');
    }
    const oldMessageId = type === 'avatar' ? prior?.avatar_message_id : prior?.cover_message_id;
    if (oldMessageId && oldMessageId !== uploaded.messageId) await deleteTelegramMessage(oldMessageId);
    const normalized = {
      ...data,
      avatar_url: data.avatar_url || telegramMediaUrl(data.avatar_file_id) || publicMediaUrl(data.avatar_path),
      cover_url: data.cover_url || telegramMediaUrl(data.cover_file_id) || publicMediaUrl(data.cover_path)
    };
    return res.status(201).json({ data: normalized });
  } catch (error) {
    console.error('Profile media upload failed:', error.message);
    return fail(res, 502, error.message || 'Could not upload profile image.');
  }
});

app.post('/api/vendors/register', authenticate, upload.single('document'), async (req, res) => {
  let uploaded = null;
  try {
    const store_name = clean(req.body.store_name, 80), description = clean(req.body.description, 1000);
    const contact_phone = clean(req.body.contact_phone, 60), address = clean(req.body.address, 300), file = req.file;
    if (store_name.length < 2 || contact_phone.length < 6 || address.length < 5) return fail(res, 400, 'Complete store name, contact and address.');
    const invalidImage = file ? imageUploadError(file) : null;
    if (invalidImage) return fail(res, 400, invalidImage);
    const { data: existing, error: lookupError } = await vendorFor(req.user.id);
    if (lookupError) return fail(res, 500, 'Could not check existing seller account.');
    if (existing?.status === 'blocked') return fail(res, 403, 'This seller account is blocked.');
    if (existing?.status === 'approved') return fail(res, 409, 'This store is already verified.');
    if (existing?.status === 'pending' && existing.document_file_id) return fail(res, 409, 'Verification document is already awaiting review.');
    if (existing && !file) return fail(res, 400, 'Upload a verification document to request verification.');
    if (file) uploaded = await uploadToTelegram(file);
    const values = { user_id: req.user.id, store_name, description, contact_phone, address, status: 'pending', reviewed_at: null, review_note: null };
    if (uploaded) Object.assign(values, { document_path: null, document_file_id: uploaded.fileId, document_message_id: uploaded.messageId, document_mime_type: uploaded.mimeType, document_url: telegramMediaUrl(uploaded.fileId) });
    const result = existing ? await supabase.from('vendors').update(values).eq('id', existing.id).select().single() : await supabase.from('vendors').insert(values).select().single();
    if (result.error) {
      if (uploaded?.messageId) await deleteTelegramMessage(uploaded.messageId);
      console.error('Seller registration save failed:', result.error.message);
      return fail(res, 500, 'Could not save seller registration.');
    }
    if (uploaded && existing?.document_message_id && existing.document_message_id !== uploaded.messageId) await deleteTelegramMessage(existing.document_message_id);
    const { document_file_id, document_message_id, ...safeVendor } = result.data;
    return res.status(existing ? 200 : 201).json({ data: { ...safeVendor, document_url: document_file_id ? telegramMediaUrl(document_file_id) : null } });
  } catch (error) {
    if (uploaded?.messageId) await deleteTelegramMessage(uploaded.messageId);
    console.error('Seller registration failed:', error.message);
    return fail(res, 502, error.message || 'Could not register seller.');
  }
});
app.patch('/api/vendor/profile', authenticate, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), async (req, res) => {
  const { data: vendor, error: vendorError } = await vendorFor(req.user.id);
  if (vendorError || !vendor) return fail(res, 404, 'Seller account not found.');
  if (vendor.status === 'blocked') return fail(res, 403, 'Seller account is blocked.');
  const store_name = clean(req.body.store_name, 80), store_location = clean(req.body.store_location, 160), description = clean(req.body.description, 1000);
  if (store_name.length < 2) return fail(res, 400, 'Store name must contain at least 2 characters.');
  const logo = req.files?.logo?.[0], cover = req.files?.cover?.[0];
  for (const file of [logo, cover].filter(Boolean)) { const invalid = imageUploadError(file); if (invalid) return fail(res, 400, invalid); }
  const uploaded = [];
  try {
    const logoMedia = logo ? await uploadToTelegram(logo) : null; if (logoMedia) uploaded.push(logoMedia);
    const coverMedia = cover ? await uploadToTelegram(cover) : null; if (coverMedia) uploaded.push(coverMedia);
    const patch = { store_name, store_location, description };
    if (logoMedia) Object.assign(patch, { store_logo_file_id: logoMedia.fileId, store_logo_message_id: logoMedia.messageId });
    if (coverMedia) Object.assign(patch, { store_cover_file_id: coverMedia.fileId, store_cover_message_id: coverMedia.messageId });
    const { data, error } = await supabase.from('vendors').update(patch).eq('id', vendor.id).select().single();
    if (error) throw error;
    if (logoMedia && vendor.store_logo_message_id) await deleteTelegramMessage(vendor.store_logo_message_id);
    if (coverMedia && vendor.store_cover_message_id) await deleteTelegramMessage(vendor.store_cover_message_id);
    return res.json({ data: { ...data, store_logo_url: data.store_logo_file_id ? telegramMediaUrl(data.store_logo_file_id) : null, store_cover_url: data.store_cover_file_id ? telegramMediaUrl(data.store_cover_file_id) : null } });
  } catch (error) {
    for (const item of uploaded) await deleteTelegramMessage(item.messageId);
    console.error('Seller shop profile update failed:', error.message);
    return fail(res, 500, 'Could not save shop profile.');
  }
});

// Vendor product management.
app.get('/api/vendor/products', authenticate, async (req, res) => {
  const { data: vendor } = await vendorFor(req.user.id);
  if (!vendor || vendor.status === 'blocked') return fail(res, 403, 'Active seller account required');
  const { data, error } = await supabase.from('products')
    .select('*,renewed_at,product_images(id,file_id,image_url,telegram_message_id,sort_order)')
    .eq('vendor_id', vendor.id).order('created_at', { ascending: false });
  if (error) return fail(res, 500, 'Could not load vendor products');
  res.json({ data: (data || []).map(publicProduct), vendor: { ...vendor, store_logo_url: vendor.store_logo_file_id ? telegramMediaUrl(vendor.store_logo_file_id) : null, store_cover_url: vendor.store_cover_file_id ? telegramMediaUrl(vendor.store_cover_file_id) : null } });
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
        store_name: '7inOne Admin',
        description: 'Official products managed by the marketplace administrator.',
        status: 'approved'
      }).select().single();
      if (error) return fail(res, 400, 'Could not create admin store');
      vendor = createdVendor;
    }
  } else {
    const { data: seller, error } = await vendorFor(req.user.id);
    if (error || !seller || seller.status === 'blocked') return fail(res, 403, 'Active seller account required');
    vendor = seller;
  }

  const status = 'active'; // Active sellers may publish, whether verified or not.
  const location = clean(req.body.location, 100);
  const condition = clean(req.body.condition || 'ប្រើរួចស្អាត', 60);
  const { data, error } = await supabase.from('products')
    .insert({ vendor_id: vendor.id, title, description, category, price, stock, location, condition, status, renewed_at:new Date().toISOString() }).select().single();
  if (error) return fail(res, 400, 'Could not create product');
  res.status(201).json({ data });
});
app.patch('/api/products/:id', authenticate, async (req, res) => {
  const { data: vendor } = await vendorFor(req.user.id);
  const admin = await isAdmin(req.user.id);
  const { data: existing } = await supabase.from('products').select('id,vendor_id,status,renewed_at,updated_at,created_at').eq('id', req.params.id).maybeSingle();
  if (!existing) return fail(res, 404, 'Product not found');
  if (!admin && (!vendor || vendor.status === 'blocked' || vendor.id !== existing.vendor_id)) return fail(res, 403, 'Active store ownership required');
  const patch = {};
  const isRenewal=req.body.renew===true;
  if(isRenewal){const renewedAt=Date.parse(existing.renewed_at||existing.updated_at||existing.created_at||'');const age=Number.isFinite(renewedAt)?Date.now()-renewedAt:0;if(existing.status!=='active'||age>PRODUCT_AUTO_DELETE_AGE_MS)return fail(res,410,'This product is no longer eligible for renewal.');patch.renewed_at=new Date().toISOString();patch.status='active';}
  for (const key of ['title','description','category','location','condition']) if (req.body[key] !== undefined) patch[key] = clean(req.body[key], key === 'description' ? 5000 : key === 'title' ? 160 : 100);
  if (req.body.price !== undefined) patch.price = Number(req.body.price);
  if (req.body.stock !== undefined) patch.stock = Number(req.body.stock);
  if (patch.title !== undefined && patch.title.length < 2) return fail(res, 400, 'Invalid title');
  if (patch.price !== undefined && (!Number.isFinite(patch.price) || patch.price < 0)) return fail(res, 400, 'Invalid price');
  if (patch.stock !== undefined && (!Number.isInteger(patch.stock) || patch.stock < 0)) return fail(res, 400, 'Invalid stock');
  if (!Object.keys(patch).length && req.body.status === undefined) return fail(res, 400, 'No valid fields supplied');
  if (req.body.status !== undefined) {
    const requestedStatus = clean(req.body.status, 20);
    if (requestedStatus === 'sold') { if (!admin && (!vendor || vendor.id !== existing.vendor_id)) return fail(res, 403, 'Not allowed'); patch.status = 'sold'; patch.sold_at = new Date().toISOString(); }
    else if (requestedStatus === 'active' && admin) patch.status = 'active';
    else if (requestedStatus !== 'sold') return fail(res, 400, 'Only Admin can activate products');
  }
  // Keep the existing listing state when a seller edits details; sellers cannot reactivate hidden listings.
  patch.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('products').update(patch).eq('id', existing.id).select().single();
  if (error) return fail(res, 400, 'Could not update product');
  res.json({ data });
});
app.delete('/api/products/:id', authenticate, async (req, res) => {
  const [{ data: vendor }, admin] = await Promise.all([vendorFor(req.user.id), isAdmin(req.user.id)]);
  const { data: product } = await supabase.from('products').select('id,vendor_id,product_images(id,telegram_message_id)').eq('id', req.params.id).maybeSingle();
  if (!product) return fail(res, 404, 'Product not found');
  if (!admin && (!vendor || vendor.status === 'blocked' || product.vendor_id !== vendor.id)) return fail(res, 403, 'Active store ownership required');
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
  if (!admin && (!vendor || vendor.status === 'blocked')) return fail(res, 403, 'Active vendor account required');
  let productQuery = supabase.from('products').select('id').eq('id', req.params.id);
  if (admin) {
    if (vendor) productQuery = productQuery.eq('vendor_id', vendor.id);
    else return fail(res, 404, 'Admin store not found');
  } else productQuery = productQuery.eq('vendor_id', vendor.id);
  const { data: product } = await productQuery.maybeSingle();
  if (!product) return fail(res, 404, 'Product not found');
  const files = req.files || [];
  if (!files.length || files.some(file => imageUploadError(file))) {
    return fail(res, 400, 'Choose valid JPG, PNG or WEBP product images only (maximum 8MB per image).');
  }
  const { count } = await supabase.from('product_images').select('*', { count: 'exact', head: true }).eq('product_id', product.id);
  if ((count || 0) + files.length > 5) return fail(res, 400, 'Maximum 5 images per product.');
  const uploaded = [];
  try {
    for (const file of files) uploaded.push(await uploadToTelegram(file));
    const rows = uploaded.map((item, index) => ({
      product_id: product.id, telegram_message_id: item.messageId, file_id: item.fileId,
      image_url: telegramMediaUrl(item.fileId), sort_order: (count || 0) + index
    }));
    const { data, error } = await supabase.from('product_images').insert(rows).select('id,product_id,file_id,telegram_message_id,image_url,sort_order');
    if (error) throw new Error('Telegram uploads succeeded, but product image records could not be saved. Apply the Telegram media migration. ' + error.message);
    return res.status(201).json({ data: (data || []).map(image => ({
      ...image, image_url: image.image_url || telegramMediaUrl(image.file_id)
    })) });
  } catch (error) {
    for (const item of uploaded) await deleteTelegramMessage(item.messageId);
    console.error('Product image upload failed:', error.message);
    return fail(res, 502, error.message || 'Product image upload failed.');
  }
});

app.delete('/api/products/:id/images/:imageId', authenticate, async (req, res) => {
  const admin = await isAdmin(req.user.id);
  const { data: vendor } = await vendorFor(req.user.id);
  if (!admin && (!vendor || vendor.status === 'blocked')) return fail(res, 403, 'Active vendor account required');
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
    .select('id,created_at,products!inner(id,title,description,price,stock,category,location,condition,view_count,vendor_id,renewed_at,product_images(id,file_id,image_url,sort_order),vendors!inner(id,store_name,status,store_logo_file_id))')
    .eq('user_id', req.user.id).eq('products.status', 'active').in('products.vendors.status', ['approved','pending','rejected']).gt('products.stock', 0)
    .gte('products.renewed_at', new Date(Date.now() - PRODUCT_PUBLIC_MAX_AGE_MS).toISOString())
    .order('created_at', { ascending: false });
  if (error) return fail(res, 500, 'Could not load saved products');
  const trust = await ratingsFor((data || []).map(row => row.products?.vendor_id));
  res.json({ data: (data || []).map(row => {
    const product = row.products;
    return { ...row, products: publicProduct({ ...product, seller_rating: trust[product.vendor_id]?.average ?? null, seller_review_count: trust[product.vendor_id]?.count ?? 0 }) };
  }) });
});
app.post('/api/saved/:productId', authenticate, async (req, res) => {
  const savedProductCutoff = new Date(Date.now() - PRODUCT_PUBLIC_MAX_AGE_MS).toISOString();
  const { data: product, error: productError } = await supabase.from('products').select('id,renewed_at,vendors!inner(status)').eq('id', req.params.productId).eq('status', 'active').in('vendors.status', ['approved','pending','rejected']).gte('renewed_at', savedProductCutoff).maybeSingle();
  if (productError) return fail(res, 500, 'Could not verify product availability');
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
    .select('id,user_id,store_name,description,status,address,store_location,store_logo_file_id,store_cover_file_id,created_at,profiles(display_name,province,bio,avatar_path)')
    .eq('id', req.params.id).in('status', ['approved','pending','rejected']).maybeSingle();
  if (error || !vendor) return fail(res, 404, 'Seller not found');
  const [{ data: reviews, error: reviewError }, { data: products }] = await Promise.all([
    supabase.from('seller_reviews').select('id,buyer_id,order_id,rating,comment,created_at').eq('vendor_id', vendor.id).order('created_at', { ascending: false }).limit(30),
    supabase.from('products').select('id,status,view_count,renewed_at').eq('vendor_id', vendor.id)
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
    status: vendor.status, verified: vendor.status === 'approved', store_location: vendor.store_location || vendor.address || null,
    store_logo_url: vendor.store_logo_file_id ? telegramMediaUrl(vendor.store_logo_file_id) : null,
    store_cover_url: vendor.store_cover_file_id ? telegramMediaUrl(vendor.store_cover_file_id) : null,
    profile: { display_name: profile.display_name, province: profile.province, bio: profile.bio, avatar_url: publicMediaUrl(profile.avatar_path) },
    rating: trust[vendor.id]?.average ?? null, review_count: trust[vendor.id]?.count ?? 0,
    distribution: trust[vendor.id]?.distribution ?? [0,0,0,0,0],
    active_listings: (products || []).filter(row => row.status === 'active' && row.renewed_at && new Date(row.renewed_at).getTime() >= Date.now() - PRODUCT_PUBLIC_MAX_AGE_MS).length,
    total_views: (products || []).reduce((sum,row) => sum + Number(row.view_count || 0), 0),
    reviews: (reviews || []).map(row => ({ ...row, buyer_name: buyerNames[row.buyer_id] || 'អ្នកទិញ' }))
  } });
});
app.post('/api/vendors/:id/reviews', authenticate, async (req, res) => {
  const rating = Number(req.body.rating);
  const orderId = clean(req.body.order_id, 60);
  const comment = clean(req.body.comment, 1200);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !orderId) return fail(res, 400, 'Choose a rating from 1 to 5 and an eligible completed order');
  const { data: vendor } = await supabase.from('vendors').select('id,status').eq('id', req.params.id).in('status', ['approved','pending','rejected']).maybeSingle();
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
  let query = supabase.from('offers').select('*,products(id,title,price,product_images(id,file_id,image_url,sort_order)),vendors(store_name)')
    .order('created_at', { ascending: false }).limit(100);
  if (admin) {
    // Admin can review all offer records.
  } else if (vendor && vendor.status !== 'blocked') {
    query = query.or(`buyer_id.eq.${req.user.id},vendor_id.eq.${vendor.id}`);
  } else {
    query = query.eq('buyer_id', req.user.id);
  }
  const { data, error } = await query;
  if (error) return fail(res, 500, 'Could not load offers');
  const buyerIds = [...new Set((data || []).map(row => row.buyer_id))];
  let buyerProfiles = {};
  if (buyerIds.length) {
    const { data: buyers } = await supabase.from('profiles').select('id,display_name,phone').in('id', buyerIds);
    buyerProfiles = Object.fromEntries((buyers || []).map(row => [row.id, row]));
  }
  res.json({ data: (data || []).map(row => ({ ...row, buyer_name: buyerProfiles[row.buyer_id]?.display_name || 'អ្នកទិញ', buyer_phone: buyerProfiles[row.buyer_id]?.phone || null, products: row.products ? publicProduct(row.products) : null })) });
});
app.post('/api/products/:id/offers', authenticate, async (req, res) => {
  const offer_price = Number(req.body.offer_price);
  const message = clean(req.body.message, 1200);
  if (!Number.isFinite(offer_price) || offer_price <= 0) return fail(res, 400, 'Enter a valid offer price');
  const { data: product } = await supabase.from('products')
    .select('id,vendor_id,status,price,vendors!inner(status,user_id)')
    .eq('id', req.params.id).eq('status', 'active').in('vendors.status', ['approved','pending','rejected']).gt('stock', 0).gte('renewed_at',new Date(Date.now()-PRODUCT_PUBLIC_MAX_AGE_MS).toISOString()).maybeSingle();
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
  if (!vendor || vendor.status === 'blocked') return fail(res, 403, 'Active seller account required');
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
  if (!vendor || vendor.status === 'blocked') return fail(res, 403, 'Active seller account required');
  const { data: items, error } = await supabase.from('order_items')
    .select('id,order_id,product_id,quantity,unit_price,fulfillment_status,products(title),orders(id,status,total,customer_name,customer_phone,delivery_address,delivery_note,payment_method,payment_status,created_at)')
    .eq('vendor_id', vendor.id).order('created_at', { ascending: false, referencedTable: 'orders' });
  if (error) return fail(res, 500, 'Could not load vendor orders');
  res.json({ data: items || [], vendor });
});
app.patch('/api/vendor/orders/:orderId', authenticate, async (req, res) => {
  const { data: vendor } = await vendorFor(req.user.id);
  if (!vendor || vendor.status === 'blocked') return fail(res, 403, 'Active vendor required');
  const status = clean(req.body.status, 30);
  if (!['processing','shipped','completed','cancelled'].includes(status)) return fail(res, 400, 'Invalid order status');
  const { data: items } = await supabase.from('order_items').select('id').eq('order_id', req.params.orderId).eq('vendor_id', vendor.id);
  if (!items?.length) return fail(res, 404, 'Order not found for this store');
  const { data: aggregate, error: fulfillmentError } = await supabase.rpc('update_vendor_order_fulfillment', {
    p_order_id: req.params.orderId,
    p_vendor_id: vendor.id,
    p_status: status
  });
  if (fulfillmentError) return fail(res, 400, fulfillmentError.message || 'Could not update fulfilment');
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
  const { data, error } = await supabase.from('vendors')
    .select('*,profiles(display_name,phone,province)').order('created_at', { ascending: false });
  if (error) return fail(res, 500, 'Could not load vendors');
  const enriched = (data || []).map(vendor => {
    const { document_path, document_file_id, document_message_id, ...safeVendor } = vendor;
    return { ...safeVendor, document_url: vendor.document_file_id ? `/api/admin/vendors/${encodeURIComponent(vendor.id)}/document` : vendor.document_url || null };
  });
  res.json({ data: enriched });
});
app.get('/api/admin/vendors/:id/document', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data: vendor, error } = await supabase.from('vendors')
      .select('document_file_id,document_mime_type').eq('id', req.params.id).maybeSingle();
    if (error || !vendor?.document_file_id) return fail(res, 404, 'Seller verification document not found.');
    return await streamTelegramFile(vendor.document_file_id, res, vendor.document_mime_type || 'application/octet-stream',
      'inline', 'private, no-store');
  } catch (error) {
    console.error('Seller document proxy failed:', error.message);
    return fail(res, 502, error.message || 'Could not retrieve seller verification document.');
  }
});

app.patch('/api/admin/vendors/:id', authenticate, requireAdmin, async (req, res) => {
  const status = clean(req.body.status, 20);
  if (!['approved','rejected','blocked','pending'].includes(status)) return fail(res, 400, 'Invalid vendor status');
  const { data: currentVendor, error: currentVendorError } = await supabase.from('vendors').select('id,user_id,document_file_id').eq('id', req.params.id).maybeSingle();
  if (currentVendorError || !currentVendor) return fail(res, 404, 'Seller not found');
  if (status === 'approved' && !currentVendor.document_file_id) return fail(res, 400, 'A verification document is required before approving verification.');
  const { data, error } = await supabase.from('vendors').update({ status, reviewed_at: new Date().toISOString(), review_note: clean(req.body.review_note, 500) || null }).eq('id', req.params.id).select().single();
  if (error) return fail(res, 400, 'Could not update vendor');
  if (status === 'approved') {
    await supabase.from('profiles').update({ role: 'vendor' })
      .eq('id', data.user_id).neq('role', 'admin');
  }
  if (status === 'blocked') {
    const { data: targetProfile } = await supabase.from('profiles').select('role').eq('id', data.user_id).maybeSingle();
    if (targetProfile?.role === 'vendor') await supabase.from('profiles').update({ role: 'customer' }).eq('id', data.user_id);
  }
  res.json({ data });
});
app.get('/api/admin/products', authenticate, requireAdmin, async (_req, res) => {
  const { data, error } = await supabase.from('products').select('*,vendors(store_name,status),product_images(id,file_id,image_url,sort_order)').order('created_at', { ascending: false });
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
  if (status === 'cancelled') {
    const { error: cancelError } = await supabase.rpc('admin_cancel_marketplace_order', {
      p_order_id: req.params.id,
      p_payment_status: payment_status ?? null
    });
    if (cancelError) return fail(res, 400, cancelError.message || 'Could not cancel order');
  } else {
    const patch = { status, updated_at: new Date().toISOString() };
    if (payment_status !== undefined) patch.payment_status = payment_status;
    const { error: updateError } = await supabase.from('orders').update(patch).eq('id', req.params.id);
    if (updateError) return fail(res, 400, 'Could not update order');
  }
  const { data, error } = await supabase.from('orders').select('*').eq('id', req.params.id).single();
  if (error) return fail(res, 400, 'Could not load updated order');
  res.json({ data });
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) return fail(res, 400, error.message);
  console.error('7inOne request error:', error);
  return fail(res, 500, 'Internal server error');
});

await nextApp.prepare();
app.use((req, res) => nextHandler(req, res));
app.listen(port, () => console.log(`7inOne full-stack service listening on ${port}`));
const productLifecycleTimer=setInterval(()=>{void cleanupExpiredProducts()},60*60*1000);
productLifecycleTimer.unref?.();
void cleanupExpiredProducts();
