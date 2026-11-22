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
import { registerMyPostsRoutes } from './my-posts.js';
import { randomUUID, randomBytes, randomInt, createHash, createHmac, timingSafeEqual, createCipheriv, createDecipheriv } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

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
app.use('/api', rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false, skip: req => req.path.startsWith('/media/telegram/') }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024, files: 10 } });
const fail = (res, status, message) => res.status(status).json({ error: message });
const db = res => { if (!supabase) { fail(res, 503, 'Supabase is not configured'); return false; } return true; };
const clean = (value, max = 500) => String(value ?? '').trim().slice(0, max);
function normalizeYoutubeVideoUrl(value) {
  const raw = clean(value, 1000);
  if (!raw) return null;
  try {
    const url = new URL(raw), host = url.hostname.toLowerCase().replace(/^www\./, '');
    let id = '';
    if (host === 'youtu.be') id = url.pathname.split('/').filter(Boolean)[0] || '';
    else if (['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host)) id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|live)\/([A-Za-z0-9_-]{11})\/?$/)?.[1] || '';
    else return false;
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? 'https://www.youtube.com/watch?v=' + id : false;
  } catch { return false; }
}

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
function friendlyTelegramUploadError(error) {
  const rawMessage = String(error?.message || error || 'Telegram image upload failed.');
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const message = token ? rawMessage.split(token).join('[redacted]') : rawMessage;

  if (/\b401\b|unauthorized|invalid bot token/i.test(message)) {
    return 'Telegram bot token is invalid. Check TELEGRAM_BOT_TOKEN.';
  }
  if (/chat not found/i.test(message)) {
    return 'Telegram storage channel not found. Check TELEGRAM_STORAGE_CHAT_ID (must look like -100...) and that the bot was added to the channel.';
  }
  if (/\b404\b|not found/i.test(message)) {
    return 'Telegram Bot API returned 404 Not Found. Check TELEGRAM_BOT_TOKEN: use only the token from BotFather (for example 123456:ABC...), without a URL, the word "bot", or extra spaces.';
  }
  if (/\b403\b|not enough rights|forbidden/i.test(message)) {
    return 'The bot must be an Administrator of the channel with permission to post messages.';
  }
  if (/PHOTO_INVALID_DIMENSIONS|invalid photo dimensions|photo.*dimensions|dimensions.*photo|aspect ratio/i.test(message)) {
    return 'Telegram cannot send this image as a photo because its dimensions or aspect ratio are unsupported.';
  }
  return message;
}

async function uploadToTelegram(file, maxBytes = 8 * 1024 * 1024) {
  const invalid = imageUploadError(file, maxBytes);
  if (invalid) throw new Error(invalid);
  assertTelegramStorageConfig();

  const createForm = (fieldName) => {
    const form = new FormData();
    form.append('chat_id', telegramStorageChatId());
    form.append(fieldName, new Blob([file.buffer], { type: file.mimetype }), file.originalname || 'image.jpg');
    return form;
  };

  let result;
  try {
    if (file.size > 10 * 1024 * 1024) {
      result = await telegram('sendDocument', { method: 'POST', body: createForm('document') });
      const document = result.document;
      if (!document?.file_id || !result.message_id) throw new Error('Telegram accepted the image as a document but did not return a file_id/message_id.');
      return { messageId: String(result.message_id), fileId: document.file_id, mimeType: file.mimetype, method: 'sendDocument' };
    }
    result = await telegram('sendPhoto', { method: 'POST', body: createForm('photo') });
  } catch (photoError) {
    console.error('Telegram sendPhoto upload error:', photoError);
    const photoMessage = String(photoError?.message || photoError);
    const invalidDimensions = /PHOTO_INVALID_DIMENSIONS|invalid photo dimensions|photo.*dimensions|dimensions.*photo|aspect ratio/i.test(photoMessage);
    if (!invalidDimensions) throw new Error(friendlyTelegramUploadError(photoError));

    try {
      result = await telegram('sendDocument', { method: 'POST', body: createForm('document') });
    } catch (documentError) {
      console.error('Telegram sendDocument fallback upload error:', documentError);
      throw new Error(friendlyTelegramUploadError(documentError));
    }

    const document = result.document;
    if (!document?.file_id || !result.message_id) {
      throw new Error('Telegram accepted the image as a document but did not return a file_id/message_id.');
    }
    return {
      messageId: String(result.message_id),
      fileId: document.file_id,
      mimeType: file.mimetype,
      method: 'sendDocument'
    };
  }

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
const mediaEncryptionKey = () => createHash('sha256').update(String(serviceKey || process.env.TELEGRAM_BOT_TOKEN || '')).digest();
function encodeMediaToken(fileId) {
  const value = String(fileId || '');
  if (!value) return '';
  const key = mediaEncryptionKey();
  const iv = createHmac('sha256', key).update('7inone-media:' + value).digest().subarray(0, 12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}
function decodeMediaToken(token) {
  const packed = Buffer.from(String(token || ''), 'base64url');
  if (packed.length < 29) throw new Error('Invalid media reference.');
  const key = mediaEncryptionKey();
  const iv = packed.subarray(0, 12), tag = packed.subarray(12, 28), encrypted = packed.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const value = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  const expectedIv = createHmac('sha256', key).update('7inone-media:' + value).digest().subarray(0, 12);
  if (!timingSafeEqual(iv, expectedIv)) throw new Error('Invalid media reference.');
  return value;
}
const mediaProxyUrl = (fileId, mimeType) => fileId ? '/api/media/image/' + encodeURIComponent(encodeMediaToken(fileId)) + (mimeType ? '?mime=' + encodeURIComponent(mimeType) : '') : null;
function normalizeMediaUrl(value) {
  const raw = String(value || '');
  const parts = raw.split('?');
  const pathname = parts.shift();
  const query = parts.length ? '?' + parts.join('?') : '';
  const match = pathname.match(/\/api\/media\/(?:telegram|image)\/([^/]+)$/);
  if (!match) return raw;
  let segment;
  try { segment = decodeURIComponent(match[1]); } catch { return raw; }
  let fileId = segment;
  try { fileId = decodeMediaToken(segment); } catch {}
  return (mediaProxyUrl(fileId) || '') + query;
}
function publicMediaUrl(path) {
  if (!path || !supabase) return null;
  return supabase.storage.from('profile-media').getPublicUrl(path).data.publicUrl;
}
function withoutStorageFields(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return record;
  return Object.fromEntries(Object.entries(record).filter(([key]) => !/(?:file_id|message_id|telegram|storage|document_path)/i.test(key)));
}
function publicVendor(vendor) {
  if (!vendor) return vendor;
  const safeVendor = withoutStorageFields(vendor);
  return { ...safeVendor, store_logo_url: vendor.store_logo_file_id ? mediaProxyUrl(vendor.store_logo_file_id) : normalizeMediaUrl(vendor.store_logo_url), store_cover_url: vendor.store_cover_file_id ? mediaProxyUrl(vendor.store_cover_file_id) : normalizeMediaUrl(vendor.store_cover_url) };
}
function publicProduct(product) {
  return {
    ...product,
    seller_rating: product.seller_rating ?? null,
    seller_review_count: product.seller_review_count ?? 0,
    vendors: Array.isArray(product.vendors) ? product.vendors.map(publicVendor) : publicVendor(product.vendors),
    product_images: (product.product_images || []).map(image => ({
      id: image.id, sort_order: image.sort_order,
      image_url: image.file_id ? mediaProxyUrl(image.file_id) : normalizeMediaUrl(image.image_url)
    })).sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
  };
}
registerSellerChat(app, { supabase, authenticate, requireVendor, upload, telegram, telegramStorageChatId, clean, fail, productPublicMaxAgeMs: PRODUCT_PUBLIC_MAX_AGE_MS, mediaProxyUrl });

async function fetchTelegramWithRetry(url, options, stage, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response;
    try {
      response = await fetch(url, { ...options, signal: AbortSignal.timeout(20_000) });
    } catch (error) {
      const causeCode = clean(error?.cause?.code || error?.name || 'FETCH_FAILED', 80);
      if (attempt === maxAttempts) {
        throw new Error(`Telegram ${stage} network failure after ${maxAttempts} attempts (${causeCode}).`);
      }
      await new Promise(resolve => setTimeout(resolve, 300 * attempt));
      continue;
    }

    if (response.ok) return response;

    const responseText = await response.text().catch(() => '');
    let responseJson = null;
    try { responseJson = JSON.parse(responseText); } catch {}
    const description = clean(responseJson?.description || responseText || response.statusText, 220);

    if (response.status !== 429 && response.status < 500) {
      throw new Error(`Telegram ${stage} rejected the request (HTTP ${response.status}): ${description}`);
    }
    if (attempt === maxAttempts) {
      throw new Error(`Telegram ${stage} failed after ${maxAttempts} attempts: ${description}`);
    }

    const retryAfter = Number(responseJson?.parameters?.retry_after || 0);
    const delay = Math.min(5_000, retryAfter > 0 ? retryAfter * 1000 : 400 * attempt);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error(`Telegram ${stage} failed.`);
}

const TELEGRAM_FILE_PATH_CACHE_TTL_MS = 45 * 60 * 1000;
const TELEGRAM_FILE_PATH_CACHE_MAX = 2000;
const telegramFilePathCache = new Map();

function cacheTelegramFilePath(fileId, filePath) {
  telegramFilePathCache.delete(fileId);
  telegramFilePathCache.set(fileId, { filePath, expiresAt: Date.now() + TELEGRAM_FILE_PATH_CACHE_TTL_MS });
  while (telegramFilePathCache.size > TELEGRAM_FILE_PATH_CACHE_MAX) {
    telegramFilePathCache.delete(telegramFilePathCache.keys().next().value);
  }
}

function cachedTelegramFilePath(fileId) {
  const entry = telegramFilePathCache.get(fileId);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    telegramFilePathCache.delete(fileId);
    return null;
  }
  return entry.filePath;
}

async function lookupTelegramFilePath(fileId) {
  const lookupResponse = await fetchTelegramWithRetry(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ file_id: fileId })
    },
    'getFile'
  );
  const lookup = await lookupResponse.json().catch(() => null);
  if (!lookup?.ok || !lookup.result?.file_path) {
    throw new Error(`Telegram getFile returned an invalid result: ${clean(lookup?.description || 'file_path is missing', 220)}`);
  }
  const filePath = clean(lookup.result.file_path, 1024);
  if (!filePath || filePath.startsWith('/') || filePath.split('/').includes('..')) {
    throw new Error('Telegram getFile returned an invalid file path.');
  }
  cacheTelegramFilePath(fileId, filePath);
  return filePath;
}

function detectSupportedImageMimeType(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return null;
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))) return 'image/png';
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}

async function streamTelegramFile(fileId, res, mimeType = 'application/octet-stream', disposition = 'inline', cacheControl = 'public, max-age=86400, stale-while-revalidate=604800') {
  assertTelegramBotConfig();
  const token = process.env.TELEGRAM_BOT_TOKEN;
  let filePath = cachedTelegramFilePath(fileId);
  const cacheHit = Boolean(filePath);
  if (!filePath) filePath = await lookupTelegramFilePath(fileId);

  let fileResponse;
  try {
    fileResponse = await fetchTelegramWithRetry(
      `https://api.telegram.org/file/bot${token}/${filePath}`,
      { method: 'GET' },
      'file download'
    );
  } catch (error) {
    if (!cacheHit || !/HTTP (?:403|404)/i.test(error.message || '')) throw error;
    telegramFilePathCache.delete(fileId);
    filePath = await lookupTelegramFilePath(fileId);
    fileResponse = await fetchTelegramWithRetry(
      `https://api.telegram.org/file/bot${token}/${filePath}`,
      { method: 'GET' },
      'file download refresh'
    );
  }

  const buffer = Buffer.from(await fileResponse.arrayBuffer());
  // Telegram's file download response may omit or generalize Content-Type.
  // Detect supported image formats from their actual bytes so browsers can
  // safely render uploads even when the upstream header is generic.
  const sniffedImageType = detectSupportedImageMimeType(buffer);
  const upstreamType = clean(fileResponse.headers.get('content-type') || '', 100).split(';')[0].toLowerCase();
  const detectedType = sniffedImageType
    || (mimeType !== 'application/octet-stream' ? mimeType : (upstreamType || mimeType));
  if (sniffedImageType && upstreamType && upstreamType !== sniffedImageType && upstreamType !== 'application/octet-stream') {
    console.warn('Telegram media Content-Type corrected from file signature:', { upstreamType, detectedType: sniffedImageType });
  }
  const etag = '"' + createHash('sha256').update(buffer).digest('base64url') + '"';

  res.set('Content-Type', detectedType);
  res.set('Content-Disposition', disposition);
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Cache-Control', cacheControl);
  res.set('ETag', etag);
  if (reqHeaderMatchesEtag(res.req?.headers?.['if-none-match'], etag)) {
    return res.status(304).end();
  }
  res.set('Content-Length', String(buffer.length));
  return res.send(buffer);
}

function reqHeaderMatchesEtag(header, etag) {
  if (!header) return false;
  return String(header).split(',').some(value => value.trim() === '*' || value.trim() === etag);
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

const SITE_PRESENCE_TTL_MS = 70_000;
const sitePresence = new Map();
function pruneSitePresence() {
  const cutoff = Date.now() - SITE_PRESENCE_TTL_MS;
  for (const [visitorId, lastSeen] of sitePresence) {
    if (lastSeen < cutoff) sitePresence.delete(visitorId);
  }
}
function sitePresenceVisitorId(value) {
  const visitorId = clean(value, 80);
  return /^[A-Za-z0-9-]{16,80}$/.test(visitorId) ? visitorId : null;
}
app.get('/api/site/online', (_req, res) => {
  pruneSitePresence();
  res.set('Cache-Control', 'no-store');
  return res.json({ data: { count: sitePresence.size } });
});
app.post('/api/site/presence', (req, res) => {
  const visitorId = sitePresenceVisitorId(req.body?.visitor_id);
  if (!visitorId) return fail(res, 400, 'A valid visitor ID is required');
  if (req.body?.leave === true) sitePresence.delete(visitorId);
  else sitePresence.set(visitorId, Date.now());
  pruneSitePresence();
  res.set('Cache-Control', 'no-store');
  return res.json({ data: { count: sitePresence.size } });
});
setInterval(pruneSitePresence, 20_000).unref?.();

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
async function getSiteBranding({ includeStorage = false } = {}){
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
    return {url:fileId?mediaProxyUrl(fileId):normalizeMediaUrl(clean(image?.url||image?.imageUrl,2000)),...(includeStorage?{fileId}: {})};
  }).filter(image=>image.url);
  return {siteLogoUrl,faviconUrl,siteTitle:clean(value.siteTitle,80)||DEFAULT_SITE_BRANDING.siteTitle,siteSubtitle:clean(value.siteSubtitle,120)||DEFAULT_SITE_BRANDING.siteSubtitle,heroBadge:clean(value.heroBadge,100)||DEFAULT_SITE_BRANDING.heroBadge,heroTitle:clean(value.heroTitle,160)||DEFAULT_SITE_BRANDING.heroTitle,heroSubtitle:clean(value.heroSubtitle,600)||DEFAULT_SITE_BRANDING.heroSubtitle,heroImages,sidePosters:Object.fromEntries(['top','middle','tall'].map(slot=>{
    const item=value.sidePosters?.[slot];if(!item||typeof item!=='object')return [slot,null];
    const fileId=clean(item.fileId||item.file_id,2048);
    return [slot,{url:fileId?mediaProxyUrl(fileId):normalizeMediaUrl(clean(item.url,2000)),...(includeStorage?{fileId}: {}),link:clean(item.link,2000),enabled:item.enabled!==false,alt:clean(item.alt,120)}];
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
  try{if(!supabase)return fail(res,503,'Website logo is unavailable.');const {data,error}=await supabase.from('site_settings').select('value').eq('key','site_branding').maybeSingle();if(error)throw error;const value=data?.value||{};const fileId=clean(value.siteLogoFileId,2048)||(value.siteLogoFileId&&value.siteLogoFileId===value.faviconFileId?clean(value.faviconFileId,2048):'');if(!fileId)return res.status(404).end();return await streamTelegramFile(fileId,res,clean(value.siteLogoMimeType,80)||(value.siteLogoFileId&&value.siteLogoFileId===value.faviconFileId?clean(value.faviconMimeType,80):'')||'image/png','inline','public, max-age=300, stale-while-revalidate=3600')}catch(error){console.error('Website logo proxy failed:',error.message);return fail(res,502,'Could not load website logo.')}
});
app.get('/api/site/favicon', async (_req,res)=>{
  try{if(!supabase)return fail(res,503,'Website favicon is unavailable.');const {data,error}=await supabase.from('site_settings').select('value').eq('key','site_branding').maybeSingle();if(error)throw error;const value=data?.value||{};const fileId=clean(value.faviconFileId,2048)||(value.faviconFileId&&value.faviconFileId===value.siteLogoFileId?clean(value.siteLogoFileId,2048):'');if(!fileId)return res.status(404).end();return await streamTelegramFile(fileId,res,clean(value.faviconMimeType,80)||(value.faviconFileId&&value.faviconFileId===value.siteLogoFileId?clean(value.siteLogoMimeType,80):'')||'image/png','inline','public, max-age=300, stale-while-revalidate=3600')}catch(error){console.error('Website favicon proxy failed:',error.message);return fail(res,502,'Could not load website favicon.')}
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
    return res.status(201).json({data:{...(await getSiteBranding({includeStorage:true})),storage:'telegram'}});
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
    const newHero=[];for(const file of bannerFiles){const image=await uploadToTelegram(file);newlyUploaded.push(image);newHero.push({fileId:image.fileId,messageId:image.messageId,mimeType:image.mimeType,url:mediaProxyUrl(image.fileId)})}
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
    res.set('Cache-Control','no-store');return res.status(200).json({data:await getSiteBranding({includeStorage:true})});
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

// Image traffic is isolated from the normal API budget so catalogue grids do not consume the API quota.
const telegramMediaRateLimit = rateLimit({ windowMs: 60_000, limit: 600, standardHeaders: 'draft-8', legacyHeaders: false });
// Permanent backend media URLs; Telegram file paths are cached briefly and refreshed when stale.
// Cambodia official village-level location dataset stored as a Telegram document.
const CAMBODIA_GEO_SETTING_KEY = 'cambodia_geo_locations';
let cambodiaGeoRowsCache = null;
let cambodiaGeoLoadPromise = null;
function extractCambodiaGeoRowsServer(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  for (const key of ['data','records','results','items','rows','content']) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      const nested = extractCambodiaGeoRowsServer(value);
      if (nested.length) return nested;
    }
  }
  return [];
}
function parseCambodiaCsv(text) {
  const input = String(text || '').replace(/^\uFEFF/, '');
  const records = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (quoted) {
      if (char === '"' && input[i + 1] === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"' && field.length === 0) {
      quoted = true;
    } else if (char === ',') {
      row.push(field); field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[i + 1] === '\n') i += 1;
      row.push(field); field = '';
      if (row.some(value => String(value).trim() !== '')) records.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    if (row.some(value => String(value).trim() !== '')) records.push(row);
  }
  if (!records.length) return [];
  const headers = records.shift().map(value => String(value).trim());
  return records.map(values => Object.fromEntries(headers.map((header, index) => [header, String(values[index] ?? '').trim()])));
}
function normalizeCambodiaGeoRow(row) {
  return {
    province_code: String(row.province_code || '').trim(),
    province_kh: String(row.province_kh || '').trim(),
    province_en: String(row.province_en || '').trim(),
    district_code: String(row.district_code || '').trim(),
    district_kh: String(row.district_kh || '').trim(),
    district_en: String(row.district_en || '').trim(),
    commune_code: String(row.commune_code || '').trim(),
    commune_kh: String(row.commune_kh || '').trim(),
    commune_en: String(row.commune_en || '').trim(),
    village_code: String(row.village_code || '').trim(),
    village_kh: String(row.village_kh || '').trim(),
    village_en: String(row.village_en || '').trim()
  };
}
function findCambodiaCsvDownloadUrl(payload) {
  const visited = new Set();
  const visit = value => {
    if (!value || typeof value !== 'object' || visited.has(value)) return null;
    visited.add(value);
    if (Array.isArray(value)) {
      for (const item of value) { const found = visit(item); if (found) return found; }
      return null;
    }
    const name = String(value.name || value.file_name || value.filename || '').toLowerCase();
    const format = String(value.format || value.file_format || '').toLowerCase();
    const candidate = value.url || value.download_url || value.file_url;
    if (candidate && (name.includes('cambodiageographicallist2025') || format === 'csv' || /\.csv(?:\?|$)/i.test(String(candidate)))) {
      try { return new URL(String(candidate), 'https://data.mef.gov.kh').toString(); } catch {}
    }
    for (const child of Object.values(value)) { const found = visit(child); if (found) return found; }
    return null;
  };
  return visit(payload);
}
async function fetchCambodiaCsv(url, label) {
  const response = await fetch(url, { headers: { Accept: 'text/csv,application/octet-stream;q=0.9,*/*;q=0.8' }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(label + ' returned HTTP ' + response.status);
  const text = await response.text();
  if (!text || !/province_code/.test(text.slice(0, 500))) throw new Error(label + ' returned an invalid CSV file.');
  return parseCambodiaCsv(text);
}
async function fetchCambodiaGeoFromOfficialDownload() {
  const metadataUrl = 'https://data.mef.gov.kh/api/v1/public-datasets/pd_68e370856a965e00074a5e7b/file';
  const response = await fetch(metadataUrl, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('DataEF file metadata returned HTTP ' + response.status);
  const metadata = await response.json();
  const downloadUrl = findCambodiaCsvDownloadUrl(metadata);
  if (!downloadUrl) throw new Error('DataEF did not provide a Cambodia CSV download URL.');
  const rows = await fetchCambodiaCsv(downloadUrl, 'DataEF CSV download');
  const normalized = rows.map(normalizeCambodiaGeoRow)
    .filter(row => row.province_code && row.district_code && row.commune_code && row.village_code && row.village_kh);
  if (!normalized.length) throw new Error('DataEF CSV has no valid village records.');
  return normalized;
}
async function fetchCambodiaGeoFromCsvMirror() {
  // CSV mirror contains the four 2025 administrative tables sourced from DataEF.
  // Used only when DataEF's download endpoint is rate-limited or unavailable.
  const base = 'https://raw.githubusercontent.com/bsthen/CambodiaGeoAPI/main/data/';
  const files = await Promise.all([
    fetchCambodiaCsv(base + 'CambodiaProvinceList2025.csv', 'Province CSV'),
    fetchCambodiaCsv(base + 'CambodiaDistrictList2025.csv', 'District CSV'),
    fetchCambodiaCsv(base + 'CambodiaCommuneList2025.csv', 'Commune CSV'),
    fetchCambodiaCsv(base + 'CambodiaVillagesList2025.csv', 'Village CSV')
  ]);
  const [provinces, districts, communes, villages] = files;
  const provinceByCode = new Map(provinces.map(row => [row.province_code, row]));
  const districtByCode = new Map(districts.map(row => [row.district_code, row]));
  const communeByCode = new Map(communes.map(row => [row.commune_code, row]));
  const normalized = villages.map(village => {
    const province = provinceByCode.get(village.province_code) || {};
    const district = districtByCode.get(village.district_code) || {};
    const commune = communeByCode.get(village.commune_code) || {};
    return normalizeCambodiaGeoRow({
      province_code: village.province_code, province_kh: province.province_kh, province_en: province.province_en,
      district_code: village.district_code, district_kh: district.district_kh, district_en: district.district_en,
      commune_code: village.commune_code, commune_kh: commune.commune_kh, commune_en: commune.commune_en,
      village_code: village.village_code, village_kh: village.village_kh, village_en: village.village_en
    });
  }).filter(row => row.province_code && row.district_code && row.commune_code && row.village_code && row.village_kh);
  if (!normalized.length || normalized.length !== villages.length) {
    throw new Error('CSV mirror is incomplete: could not match every village to its province, district and commune.');
  }
  return normalized;
}
async function fetchOfficialCambodiaGeoRows() {
  try {
    const rows = await fetchCambodiaGeoFromOfficialDownload();
    console.log('Cambodia location CSV downloaded from DataEF:', rows.length, 'village rows');
    return rows;
  } catch (error) {
    console.warn('DataEF CSV download unavailable; using DataEF-sourced CSV mirror:', clean(error.message, 240));
    const rows = await fetchCambodiaGeoFromCsvMirror();
    console.log('Cambodia location CSV mirror loaded:', rows.length, 'village rows');
    return rows;
  }
}
async function downloadTelegramDocumentBuffer(fileId) {
  const filePath = await lookupTelegramFilePath(fileId);
  const response = await fetchTelegramWithRetry(
    `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`,
    { method: 'GET' },
    'location document download'
  );
  return Buffer.from(await response.arrayBuffer());
}
function validateCambodiaGeoRows(rows) {
  if (!Array.isArray(rows) || !rows.length) throw new Error('Cambodia location dataset is empty.');
  const provinces = new Map();
  for (const row of rows) {
    const code = String(row?.province_code || '').trim();
    if (code) provinces.set(code, String(row?.province_kh || '').trim());
  }
  const phnomPenh = provinces.get('12');
  if (!phnomPenh || !phnomPenh.includes('ភ្នំពេញ')) {
    throw new Error('Cambodia location dataset is missing Phnom Penh (province code 12).');
  }
  if (provinces.size < 25) {
    throw new Error('Cambodia location dataset is incomplete: expected 25 provinces, found ' + provinces.size + '.');
  }
  return rows;
}
async function getCambodiaGeoRows() {
  if (Array.isArray(cambodiaGeoRowsCache)) return cambodiaGeoRowsCache;
  if (!cambodiaGeoLoadPromise) cambodiaGeoLoadPromise = (async () => {
    if (!supabase) throw new Error('Database is unavailable.');
    const { data: saved, error: readError } = await supabase.from('site_settings')
      .select('value').eq('key', CAMBODIA_GEO_SETTING_KEY).maybeSingle();
    if (readError) throw readError;
    if (saved?.value?.fileId) {
      try {
        const buffer = await downloadTelegramDocumentBuffer(clean(saved.value.fileId, 2048));
        const rows = JSON.parse(buffer.toString('utf8'));
        validateCambodiaGeoRows(rows);
        cambodiaGeoRowsCache = rows;
        return rows;
      } catch (error) {
        console.warn('Stored Cambodia location file could not be read; rebuilding:', error.message);
      }
    }
    assertTelegramStorageConfig();
    const rows = validateCambodiaGeoRows(await fetchOfficialCambodiaGeoRows());
    const buffer = Buffer.from(JSON.stringify(rows), 'utf8');
    const form = new FormData();
    form.append('chat_id', telegramStorageChatId());
    form.append('document', new Blob([buffer], { type: 'application/json' }), 'CambodiaGeographicalList2025.json');
    const sent = await telegram('sendDocument', { method: 'POST', body: form });
    const fileId = sent.document?.file_id;
    const messageId = sent.message_id;
    if (!fileId || !messageId) throw new Error('Telegram did not return the location document reference.');
    const value = {
      fileId, messageId: String(messageId), fileName: 'CambodiaGeographicalList2025.json',
      source: 'DataEF / MLMUPC Cambodia Geographical List 2025',
      rowCount: rows.length, updatedAt: new Date().toISOString()
    };
    const { error: saveError } = await supabase.from('site_settings').upsert({
      key: CAMBODIA_GEO_SETTING_KEY, value, updated_at: value.updatedAt
    }, { onConflict: 'key' });
    if (saveError) {
      await deleteTelegramMessage(String(messageId));
      throw saveError;
    }
    cambodiaGeoRowsCache = rows;
    return rows;
  })().catch(error => { cambodiaGeoLoadPromise = null; throw error; });
  return cambodiaGeoLoadPromise;
}
app.get('/api/locations/cambodia', async (_req, res) => {
  try {
    const rows = await getCambodiaGeoRows();
    res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return res.json({ data: rows, source: 'DataEF / MLMUPC Cambodia Geographical List 2025' });
  } catch (error) {
    console.error('Cambodia location data load failed:', error.message);
    return fail(res, 503, 'មិនអាចទាញយកបញ្ជីទីតាំងពី Telegram បានទេ។ សូមព្យាយាមម្ដងទៀត។');
  }
});

app.get(['/api/media/image/:mediaId', '/api/media/telegram/:fileId'], telegramMediaRateLimit, async (req, res) => {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) return fail(res, 503, 'Image service is temporarily unavailable. Please try again later.');
    const fileId = clean(req.params.fileId ? req.params.fileId : decodeMediaToken(req.params.mediaId), 2048);
    if (!fileId) return fail(res, 400, 'Invalid image reference.');
    const requestedMime = clean(req.query.mime, 60).toLowerCase();
    const safeAudioMimes = new Set(['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav','audio/x-wav']);
    const safeImageMimes = new Set(['image/jpeg','image/png','image/webp']);
    const safeMime = safeAudioMimes.has(requestedMime) || safeImageMimes.has(requestedMime) ? requestedMime : 'application/octet-stream';
    return await streamTelegramFile(fileId, res, safeMime);
  } catch (error) {
    console.error('Telegram media proxy error:', error.message);
    return fail(res, 502, 'Could not load this image. Please try again.');
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

// Seller Live / YouTube Shorts links. Only verified sellers can publish.
function youtubeShortsId(value) {
  try {
    const url = new URL(String(value || '').trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (!['youtube.com','m.youtube.com'].includes(host)) return '';
    return url.pathname.match(/^\/shorts\/([A-Za-z0-9_-]{11})\/?$/)?.[1] || '';
  } catch { return ''; }
}
function normalizeYoutubeShortsUrl(value) {
  const id = youtubeShortsId(value);
  return id ? 'https://www.youtube.com/shorts/' + id : null;
}
function normalizeSellerMediaUrl(value) {
 const raw=clean(value,1000);let parsed;try{parsed=new URL(raw)}catch{return null}
 if(parsed.protocol!=='https:')return null;
 const host=parsed.hostname.toLowerCase().replace(/^www\./,'');
 const allowed=['facebook.com','fb.watch','m.facebook.com','youtube.com','youtu.be'];
 return allowed.includes(host)||host.endsWith('.youtube.com')||host.endsWith('.facebook.com')?parsed.toString():null;
}
function validateSellerMedia(mediaUrl,mediaType){
 if(!mediaUrl)return 'Please provide a valid public Facebook or YouTube HTTPS link.';
 if(!['live','video'].includes(mediaType))return 'Media type must be live or video.';
 if(mediaType==='video'&&!youtubeShortsId(mediaUrl))return 'សូមបញ្ចូលតែ Link YouTube Shorts ត្រឹមត្រូវប៉ុណ្ណោះ។';
 return null;
}
app.get('/api/vendor/media-links',authenticate,requireVendor,async(req,res)=>{
 if(req.vendor.status!=='approved')return fail(res,403,'Only verified sellers can manage Shorts / Live links');
 const {data,error}=await supabase.from('vendor_media_links').select('id,vendor_id,media_url,media_type,caption,is_active,created_at,updated_at').eq('vendor_id',req.vendor.id).order('created_at',{ascending:false}).limit(200);
 if(error)return fail(res,500,'Could not load shop media links');return res.json({data:data||[]});
});
app.post('/api/vendor/media-links',authenticate,requireVendor,async(req,res)=>{
 if(req.vendor.status!=='approved')return fail(res,403,'Only verified sellers can publish Shorts / Live links');
 const mediaType=clean(req.body?.media_type,10);
 if(!['live','video'].includes(mediaType))return fail(res,400,'Media type must be live or video.');
 try {
  let data,error;
  if(mediaType==='video'){
   const mediaUrl=normalizeYoutubeShortsUrl(req.body?.media_url);
   if(!mediaUrl)return fail(res,400,'សូមបញ្ចូល Link YouTube Shorts ត្រឹមត្រូវ (youtube.com/shorts/...)។');
   const productIds=[...new Set((Array.isArray(req.body?.product_ids)?req.body.product_ids:[]).map(id=>clean(id,64)).filter(Boolean))];
   if(productIds.length>2)return fail(res,400,'Shorts អាចភ្ជាប់ផលិតផលបានត្រឹម 2 មុខប៉ុណ្ណោះ។');
   if(productIds.length){const {data:validProducts,error:productError}=await supabase.from('products').select('id').eq('vendor_id',req.vendor.id).eq('status','active').gt('stock',0).in('id',productIds);if(productError||!validProducts||validProducts.length!==productIds.length)return fail(res,400,'ផលិតផលដែលបានជ្រើសមិនត្រឹមត្រូវ ឬមិនមែនជាផលិតផលក្នុងហាងរបស់អ្នកទេ។');}
   const result=await supabase.rpc('create_vendor_youtube_short',{p_vendor_id:req.vendor.id,p_media_url:mediaUrl,p_caption:clean(req.body?.caption,160)});
   data=Array.isArray(result.data)?result.data[0]:result.data;error=result.error;
   if(error){
    if(/daily shorts limit/i.test(error.message||''))return fail(res,429,'អ្នកបានបង្ហោះ Shorts គ្រប់ 5 ក្នុងថ្ងៃនេះហើយ។ សូមសាកល្បងថ្ងៃស្អែក។');
    throw error;
   }
   if(!data)throw new Error('Shorts record was not returned by the database.');
   if(productIds.length){const links=productIds.map(product_id=>({media_link_id:data.id,product_id,vendor_id:req.vendor.id}));const {error:linkError}=await supabase.from('vendor_media_products').insert(links);if(linkError){await supabase.from('vendor_media_links').delete().eq('id',data.id).eq('vendor_id',req.vendor.id);throw linkError;}}
  } else {
   const mediaUrl=normalizeSellerMediaUrl(req.body?.media_url);
   const invalid=validateSellerMedia(mediaUrl,mediaType);if(invalid)return fail(res,400,invalid);
   const result=await supabase.from('vendor_media_links').insert({vendor_id:req.vendor.id,media_url:mediaUrl,media_type:mediaType,is_active:true}).select('id,vendor_id,media_url,media_type,is_active,created_at,updated_at').single();
   data=result.data;error=result.error;if(error)throw error;
  }
  return res.status(201).json({data});
 } catch(error){
  console.error('Seller media post save failed:',error.message);
  return fail(res,500,'មិនអាចរក្សាទុក Link បានទេ។ សូមព្យាយាមម្ដងទៀត។');
 }
});
app.patch('/api/vendor/media-links/:id',authenticate,requireVendor,async(req,res)=>{
 if(req.vendor.status!=='approved')return fail(res,403,'Only verified sellers can manage Shorts / Live links');
 const {data:current,error:loadError}=await supabase.from('vendor_media_links').select('id,media_url,media_type').eq('id',req.params.id).eq('vendor_id',req.vendor.id).maybeSingle();
 if(loadError)return fail(res,500,'Could not load Shorts / Live link');if(!current)return fail(res,404,'Shorts / Live link not found');
 const patch={updated_at:new Date().toISOString()};
 if(typeof req.body?.caption==='string'&&current.media_type==='video')patch.caption=clean(req.body.caption,160);
 if(typeof req.body?.is_active==='boolean')patch.is_active=req.body.is_active;
 const legacyTelegram=String(current.media_url||'').startsWith('tgvideo:');
 if(legacyTelegram&&(req.body?.media_url!==undefined||req.body?.media_type!==undefined))return fail(res,409,'Telegram Shorts ចាស់មិនអាចកែបានទេ។ សូមលុបវា ហើយបង្ហោះ YouTube Shorts ថ្មី។');
 if(req.body?.media_url!==undefined){
  const nextType=clean(req.body?.media_type??current.media_type,10);
  const mediaUrl=nextType==='video'?normalizeYoutubeShortsUrl(req.body.media_url):normalizeSellerMediaUrl(req.body.media_url);
  if(!mediaUrl)return fail(res,400,nextType==='video'?'សូមបញ្ចូល Link YouTube Shorts ត្រឹមត្រូវ។':'Please provide a valid public Live link.');
  patch.media_url=mediaUrl;
 }
 if(req.body?.media_type!==undefined){const mediaType=clean(req.body.media_type,10);if(!['live','video'].includes(mediaType))return fail(res,400,'Media type must be live or video.');patch.media_type=mediaType;}
 if(Object.keys(patch).length===1)return fail(res,400,'No valid media changes provided');
 if(!legacyTelegram){const invalid=validateSellerMedia(patch.media_url??current.media_url,patch.media_type??current.media_type);if(invalid)return fail(res,400,invalid);}
 const {data,error}=await supabase.from('vendor_media_links').update(patch).eq('id',req.params.id).eq('vendor_id',req.vendor.id).select('id,vendor_id,media_url,media_type,is_active,created_at,updated_at').maybeSingle();
 if(error)return fail(res,500,'Could not update Live / Shorts link');if(!data)return fail(res,404,'Shorts / Live link not found');return res.json({data});
});
app.delete('/api/vendor/media-links/:id',authenticate,requireVendor,async(req,res)=>{
 if(req.vendor.status!=='approved')return fail(res,403,'Only verified sellers can manage Shorts / Live links');
 const {data,error}=await supabase.from('vendor_media_links').delete().eq('id',req.params.id).eq('vendor_id',req.vendor.id).select('id').maybeSingle();
 if(error)return fail(res,500,'Could not remove Live / Shorts link');if(!data)return fail(res,404,'Shorts / Live link not found');return res.json({success:true});
});
app.get('/api/vendor-media',async(req,res)=>{
 if(!db(res))return;
 const cutoff=new Date(Date.now()-24*60*60*1000).toISOString();
 const offset=Math.max(0,Math.min(10000,Number.parseInt(req.query.offset,10)||0));
 const vendorId=clean(req.query.vendor_id,64);
 let query=supabase.from('vendor_media_links').select('id,vendor_id,media_url,media_type,caption,created_at,vendors!inner(id,store_name,store_location,store_logo_file_id,status)').eq('is_active',true).eq('media_type','video').gte('created_at',cutoff).eq('vendors.status','approved').order('created_at',{ascending:false}).range(offset,offset+59);
 if(vendorId)query=query.eq('vendor_id',vendorId);
 const {data,error}=await query;
 if(error)return fail(res,500,'Could not load YouTube Shorts');
 return res.json({data:(data||[]).filter(row=>youtubeShortsId(row.media_url)).map(row=>({id:row.id,vendor_id:row.vendor_id,media_url:row.media_url,media_type:row.media_type,caption:row.caption||'',created_at:row.created_at,store_name:row.vendors?.store_name||'ហាងអ្នកលក់',store_location:row.vendors?.store_location||'',store_logo_url:mediaProxyUrl(row.vendors?.store_logo_file_id)}))});
});
app.get('/api/vendor-media/:id/products',async(req,res)=>{
 if(!db(res))return;
 const {data:media,error:mediaError}=await supabase.from('vendor_media_links').select('id,vendor_id,media_type,is_active,vendors!inner(status)').eq('id',req.params.id).eq('media_type','video').eq('is_active',true).eq('vendors.status','approved').maybeSingle();
 if(mediaError||!media)return fail(res,404,'Short video not found');
 const {data:links,error}=await supabase.from('vendor_media_products').select('product_id,sort_order,products!inner(id,product_code,title,price,stock,status,view_count,vendor_id,product_images(id,file_id,image_url,sort_order),vendors!inner(id,store_name,status))').eq('media_link_id',media.id).order('sort_order',{ascending:true});
 if(error)return fail(res,500,'Could not load Shorts products');
 const products=(links||[]).map(row=>row.products).filter(p=>p&&p.vendor_id===media.vendor_id&&p.status==='active'&&Number(p.stock)>0&&p.vendors?.status==='approved');
 const ids=products.map(p=>p.id);let sold={};
 if(ids.length){const {data:orders}=await supabase.from('order_items').select('product_id,quantity,fulfillment_status').in('product_id',ids).eq('fulfillment_status','completed');for(const item of orders||[])sold[item.product_id]=(sold[item.product_id]||0)+Number(item.quantity||1)}
 return res.json({data:products.map(p=>publicProduct({...p,sold_count:sold[p.id]||0}))});
});
app.get('/api/vendor-media/:id/shop-products',async(req,res)=>{
 if(!db(res))return;
 const {data:media,error:mediaError}=await supabase.from('vendor_media_links').select('id,vendor_id,media_type,is_active,vendors!inner(status)').eq('id',req.params.id).eq('media_type','video').eq('is_active',true).eq('vendors.status','approved').maybeSingle();
 if(mediaError||!media)return fail(res,404,'Short video not found');
 const {data:products,error}=await supabase.from('products').select('id,product_code,title,price,stock,status,view_count,vendor_id,product_images(id,file_id,image_url,sort_order),vendors!inner(id,store_name,status)').eq('vendor_id',media.vendor_id).eq('status','active').gt('stock',0).eq('vendors.status','approved').order('view_count',{ascending:false}).limit(200);
 if(error)return fail(res,500,'Could not load shop products');
 const ids=(products||[]).map(p=>p.id);let sold={};
 if(ids.length){const {data:orders,error:orderError}=await supabase.from('order_items').select('product_id,quantity,fulfillment_status').in('product_id',ids).eq('fulfillment_status','completed');if(orderError)return fail(res,500,'Could not rank shop products');for(const item of orders||[])sold[item.product_id]=(sold[item.product_id]||0)+Number(item.quantity||1)}
 const ranked=(products||[]).map(p=>({...p,sold_count:sold[p.id]||0})).sort((a,b)=>b.sold_count-a.sold_count||Number(b.view_count||0)-Number(a.view_count||0));
 return res.json({data:ranked.map(publicProduct)});
});
app.post('/api/vendor-media/:id/products',authenticate,requireVendor,async(req,res)=>{
 if(req.vendor.status!=='approved')return fail(res,403,'Only verified sellers can attach products to Shorts');
 const productId=clean(req.body?.product_id,64);
 const {data:media,error:mediaError}=await supabase.from('vendor_media_links').select('id,vendor_id,media_type').eq('id',req.params.id).eq('vendor_id',req.vendor.id).eq('media_type','video').maybeSingle();
 if(mediaError||!media)return fail(res,404,'Short video not found in your shop');
 const {data:product,error:productError}=await supabase.from('products').select('id,vendor_id,status,stock').eq('id',productId).eq('vendor_id',req.vendor.id).maybeSingle();
 if(productError||!product||product.status!=='active'||Number(product.stock)<=0)return fail(res,404,'Active product not found in your shop');
 const {count,error:countError}=await supabase.from('vendor_media_products').select('id',{count:'exact',head:true}).eq('media_link_id',media.id);
 if(countError)return fail(res,500,'Could not check linked products');
 const {data:existing}=await supabase.from('vendor_media_products').select('product_id').eq('media_link_id',media.id);
 if(!(existing||[]).some(row=>String(row.product_id)===String(product.id))&&(count||0)>=2)return fail(res,409,'Shorts អាចភ្ជាប់ផលិតផលបានត្រឹម 2 មុខប៉ុណ្ណោះ។');
 const {data,error}=await supabase.from('vendor_media_products').upsert({media_link_id:media.id,product_id:product.id,vendor_id:req.vendor.id},{onConflict:'media_link_id,product_id'}).select('product_id').single();
 if(error)return fail(res,500,'Could not attach product to Shorts');
 return res.status(201).json({data});
});
app.delete('/api/vendor-media/:id/products/:productId',authenticate,requireVendor,async(req,res)=>{
 if(req.vendor.status!=='approved')return fail(res,403,'Only verified sellers can manage Shorts products');
 const {data:media}=await supabase.from('vendor_media_links').select('id,vendor_id').eq('id',req.params.id).eq('vendor_id',req.vendor.id).maybeSingle();
 if(!media)return fail(res,404,'Short video not found in your shop');
 const {error}=await supabase.from('vendor_media_products').delete().eq('media_link_id',media.id).eq('product_id',req.params.productId).eq('vendor_id',req.vendor.id);
 if(error)return fail(res,500,'Could not remove product from Shorts');
 return res.json({success:true});
});
let vendorShortCleanupPromise=null;
async function cleanupExpiredVendorShorts(){
 if(!supabase||vendorShortCleanupPromise)return vendorShortCleanupPromise;
 vendorShortCleanupPromise=(async()=>{
  const cutoff=new Date(Date.now()-24*60*60*1000).toISOString();
  const {data,error}=await supabase.from('vendor_media_links').delete().eq('media_type','video').like('media_url','https://www.youtube.com/shorts/%').lt('created_at',cutoff).select('id');
  if(error){console.warn('Expired YouTube Shorts cleanup failed:',error.message);return 0;}
  const count=data?.length||0;if(count)console.log('Expired YouTube Shorts removed:',count);return count;
 })().finally(()=>{vendorShortCleanupPromise=null});
 return vendorShortCleanupPromise;
}

// Community photo posts, likes and comments.
app.get('/api/social/posts', async (req, res) => {
  if (!db(res)) return;
  const { data, error } = await supabase.from('social_posts')
    .select('id,user_id,caption,image_file_id,created_at,profiles!social_posts_user_id_fkey(display_name,avatar_url,avatar_file_id,avatar_path),social_post_likes(user_id),social_post_comments(id)')
    .order('created_at', { ascending: false }).limit(20);
  if (error) { console.error('Social feed load failed:', error.message); return fail(res, 500, 'Could not load community posts.'); }
  let viewerId = null;
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (token) { try { const { data: auth } = await supabase.auth.getUser(token); viewerId = auth?.user?.id || null; } catch {} }
  return res.json({ data: (data || []).map(post => ({
    id: post.id, user_id: post.user_id, caption: post.caption,
    image_url: mediaProxyUrl(post.image_file_id), created_at: post.created_at,
    profile: { display_name: post.profiles?.display_name || 'អ្នកប្រើប្រាស់',
      avatar_url: normalizeMediaUrl(post.profiles?.avatar_url) || mediaProxyUrl(post.profiles?.avatar_file_id) || publicMediaUrl(post.profiles?.avatar_path) },
    like_count: post.social_post_likes?.length || 0,
    comment_count: post.social_post_comments?.length || 0,
    liked_by_me: Boolean(viewerId && post.social_post_likes?.some(like => like.user_id === viewerId))
  })) });
});
app.post('/api/social/posts', authenticate, upload.single('image'), async (req, res) => {
  let uploaded = null;
  try {
    const caption = clean(req.body?.caption, 500), file = req.file;
    const invalid = imageUploadError(file, 8 * 1024 * 1024);
    if (invalid) return fail(res, 400, invalid);
    uploaded = await uploadToTelegram(file);
    const { data, error } = await supabase.from('social_posts')
      .insert({ user_id: req.user.id, caption, image_file_id: uploaded.fileId, image_message_id: uploaded.messageId })
      .select('id,user_id,caption,image_file_id,created_at').single();
    if (error) throw error;
    return res.status(201).json({ data: { id: data.id, user_id: data.user_id, caption: data.caption, created_at: data.created_at, image_url: mediaProxyUrl(data.image_file_id) } });
  } catch (error) {
    if (uploaded?.messageId) await deleteTelegramMessage(uploaded.messageId);
    console.error('Social post publish failed:', error.message);
    return fail(res, 500, 'Could not publish your photo. Please try again.');
  }
});
// Photo Stories are public for viewing and expire 24 hours after publishing.
app.get('/api/social/stories', async (req, res) => {
  if (!db(res)) return;
  const { data, error } = await supabase.from('social_stories')
    .select('id,user_id,image_file_id,created_at,expires_at,profiles!social_stories_user_id_fkey(display_name,avatar_url,avatar_file_id,avatar_path)')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false }).limit(60);
  if (error) { console.error('Social Stories load failed:', error.message); return fail(res, 500, 'Could not load Stories.'); }
  return res.json({ data: (data || []).map(story => ({
    id: story.id, user_id: story.user_id, image_url: mediaProxyUrl(story.image_file_id),
    created_at: story.created_at, expires_at: story.expires_at,
    profile: { display_name: story.profiles?.display_name || 'អ្នកប្រើប្រាស់',
      avatar_url: normalizeMediaUrl(story.profiles?.avatar_url) || mediaProxyUrl(story.profiles?.avatar_file_id) || publicMediaUrl(story.profiles?.avatar_path) }
  })) });
});
app.post('/api/social/stories', authenticate, upload.single('image'), async (req, res) => {
  let uploaded = null;
  try {
    const invalid = imageUploadError(req.file, 8 * 1024 * 1024);
    if (invalid) return fail(res, 400, invalid);
    uploaded = await uploadToTelegram(req.file);
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
    const { data, error } = await supabase.from('social_stories')
      .insert({ user_id: req.user.id, image_file_id: uploaded.fileId, image_message_id: uploaded.messageId, created_at: createdAt.toISOString(), expires_at: expiresAt.toISOString() })
      .select('id,user_id,image_file_id,created_at,expires_at').single();
    if (error) throw error;
    return res.status(201).json({ data: { id: data.id, user_id: data.user_id, created_at: data.created_at, expires_at: data.expires_at, image_url: mediaProxyUrl(data.image_file_id) } });
  } catch (error) {
    if (uploaded?.messageId) await deleteTelegramMessage(uploaded.messageId);
    console.error('Social Story publish failed:', error.message);
    return fail(res, 500, 'Could not publish your Story. Please try again.');
  }
});

app.post('/api/social/posts/:id/like', authenticate, async (req, res) => {
  const postId = clean(req.params.id, 36);
  const { data: existing, error: lookupError } = await supabase.from('social_post_likes')
    .select('user_id').eq('post_id', postId).eq('user_id', req.user.id).maybeSingle();
  if (lookupError) return fail(res, 500, 'Could not update like.');
  if (existing) {
    const { error } = await supabase.from('social_post_likes').delete().eq('post_id', postId).eq('user_id', req.user.id);
    if (error) return fail(res, 500, 'Could not remove like.');
  } else {
    const { error } = await supabase.from('social_post_likes').insert({ post_id: postId, user_id: req.user.id });
    if (error) return fail(res, 500, 'Could not add like.');
  }
  const { count, error } = await supabase.from('social_post_likes').select('user_id', { count: 'exact', head: true }).eq('post_id', postId);
  if (error) return fail(res, 500, 'Could not count likes.');
  return res.json({ liked: !existing, like_count: count || 0 });
});
app.get('/api/social/posts/:id/comments', async (req, res) => {
  if (!db(res)) return;
  const { data, error } = await supabase.from('social_post_comments')
    .select('id,body,created_at,profiles!social_post_comments_user_id_fkey(display_name)')
    .eq('post_id', clean(req.params.id, 36)).order('created_at', { ascending: true }).limit(100);
  if (error) return fail(res, 500, 'Could not load comments.');
  return res.json({ data: (data || []).map(item => ({ id: item.id, body: item.body, created_at: item.created_at, display_name: item.profiles?.display_name || 'អ្នកប្រើប្រាស់' })) });
});
app.post('/api/social/posts/:id/comments', authenticate, async (req, res) => {
  const body = clean(req.body?.body, 500);
  if (!body) return fail(res, 400, 'Comment cannot be empty.');
  const { data, error } = await supabase.from('social_post_comments')
    .insert({ post_id: clean(req.params.id, 36), user_id: req.user.id, body })
    .select('id,body,created_at').single();
  if (error) return fail(res, 500, 'Could not save comment.');
  return res.status(201).json({ data });
});


// Public catalogue.
app.get('/api/categories', async (_req, res) => {
  if (!db(res)) return;
  const cutoff = new Date(Date.now() - PRODUCT_PUBLIC_MAX_AGE_MS).toISOString();
  let { data, error } = await supabase.from('products').select('category')
    .eq('status', 'active')
    .or(`renewed_at.gte.${cutoff},and(renewed_at.is.null,created_at.gte.${cutoff})`);

  const missingRenewalColumn = error && (
    error.code === '42703'
    || /renewed_at.*(does not exist|schema cache)|column .*renewed_at/i.test(error.message || '')
  );
  if (missingRenewalColumn) {
    ({ data, error } = await supabase.from('products').select('category')
      .eq('status', 'active').gte('created_at', cutoff));
  }
  if (error) return fail(res, 500, 'Could not load categories');
  res.json({ data: [...new Set((data || []).map(row => row.category).filter(Boolean))].sort() });
});
app.get('/api/vendors/:id/categories', async (req, res) => {
  if (!db(res)) return;
  const vendorId = clean(req.params.id, 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(vendorId)) return fail(res, 400, 'Invalid vendor ID.');
  const cutoff = new Date(Date.now() - PRODUCT_PUBLIC_MAX_AGE_MS).toISOString();
  const loadProducts = legacy => {
    let query = supabase.from('products').select('id,category')
      .eq('vendor_id', vendorId).eq('status', 'active').gt('stock', 0);
    query = legacy ? query.gte('created_at', cutoff) : query.or(`renewed_at.gte.${cutoff},and(renewed_at.is.null,created_at.gte.${cutoff})`);
    return query;
  };
  let { data: products, error } = await loadProducts(false);
  const missingRenewalColumn = error && (error.code === '42703' || /renewed_at.*(does not exist|schema cache)|column .*renewed_at/i.test(error.message || ''));
  if (missingRenewalColumn) ({ data: products, error } = await loadProducts(true));
  if (error) return fail(res, 500, 'Could not load shop categories.');
  const ids = (products || []).map(row => row.id).filter(Boolean);
  let details = [];
  if (ids.length) {
    const result = await supabase.from('product_listing_details').select('product_id,subcategory').in('product_id', ids);
    if (result.error) return fail(res, 500, 'Could not load shop subcategories.');
    details = result.data || [];
  }
  const subcategoryByProduct = new Map(details.map(row => [String(row.product_id), String(row.subcategory || '').trim()]));
  const groups = new Map();
  for (const product of products || []) {
    const category = String(product.category || '').trim();
    if (!category) continue;
    if (!groups.has(category)) groups.set(category, new Set());
    const subcategory = subcategoryByProduct.get(String(product.id));
    if (subcategory) groups.get(category).add(subcategory);
  }
  const data = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([category, subcategories]) => ({
    category, subcategories: [...subcategories].sort((a, b) => a.localeCompare(b))
  }));
  res.set('Cache-Control', 'no-store');
  return res.json({ data });
});
// Unified home feed: merge independent listing tables without changing product APIs.
app.get('/api/marketplace/listings', async (req, res) => {
  if (!db(res)) return;
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 30));
  const q = clean(req.query.q, 100).replace(/[%_,()]/g, '').trim();
  const type = clean(req.query.type || 'all', 20).toLowerCase();
  const category = clean(req.query.category, 80);
  const propertyType = clean(req.query.property_type || 'all', 30).toLowerCase();
  const allowedPropertyTypes = ['all','house_sale','house_rent','condo_sale','apartment_rent','land','land_rent','commercial_sale','commercial_rent','room_rent','properties_wanted','agent_services','others_properties'];
  const cutoff = new Date(Date.now() - PRODUCT_PUBLIC_MAX_AGE_MS).toISOString();
  if (!['all','product','job','real_estate'].includes(type)) return fail(res, 400, 'Invalid listing type.');
  if ((type === 'all' || type === 'real_estate') && !allowedPropertyTypes.includes(propertyType)) return fail(res, 400, 'Invalid property type.');

  try {
    const tasks = [];
    if (type === 'all' || type === 'product') {
      const productFields = 'id,title,description,price,stock,category,location,condition,view_count,created_at,updated_at,renewed_at,youtube_video_url,vendor_id,product_images(id,file_id,image_url,sort_order),vendors!inner(id,user_id,store_name,status,store_logo_file_id)';
      const legacyFields = 'id,title,description,price,stock,category,location,condition,view_count,created_at,updated_at,youtube_video_url,vendor_id,product_images(id,file_id,image_url,sort_order),vendors!inner(id,user_id,store_name,status,store_logo_file_id)';
      const runProducts = (legacy = false) => {
        let query = supabase.from('products').select(legacy ? legacyFields : productFields)
          .eq('status', 'active').in('vendors.status', ['approved','pending','rejected']).gt('stock', 0)
          .order('created_at', { ascending: false }).limit(limit);
        const filters = [legacy ? `created_at.gte.${cutoff}` : `or(renewed_at.gte.${cutoff},and(renewed_at.is.null,created_at.gte.${cutoff}))`];
        if (q) filters.push(`or(title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%)`);
        query = query.or(`and(${filters.join(',')})`);
        if (category) query = query.eq('category', category);
        return query;
      };
      tasks.push((async () => {
        let result = await runProducts(false);
        if (result.error && (/renewed_at/i.test(result.error.message || '') || result.error.code === '42703')) result = await runProducts(true);
        if (result.error) throw result.error;
        return (result.data || []).map(row => {
          const product = publicProduct(row);
          const firstImage = product.product_images?.[0]?.image_url || null;
          return { ...product, listing_type: 'product', image_url: firstImage, price_label: row.price, listing_subtitle: row.vendors?.store_name || 'ហាងអ្នកលក់' };
        });
      })());
    }
    if (type === 'all' || type === 'job') tasks.push((async () => {
      const fields = 'id,user_id,title,company_name,description,short_description,category,subcategory,detail_type,specifications,location,vacancies,salary_min,salary_max,salary_period,employment_type,work_schedule,experience,education,skills,languages,benefits,youtube_video_url,image_file_id,image_mime_type,image_gallery,status,expires_at,created_at';
      const legacyFields = 'id,user_id,title,company_name,description,short_description,category,subcategory,location,vacancies,salary_min,salary_max,salary_period,employment_type,work_schedule,experience,education,skills,languages,benefits,youtube_video_url,image_file_id,image_mime_type,status,expires_at,created_at';
      const runJobs = async (legacy = false) => {
        let query = supabase.from('jobs').select(legacy ? legacyFields : fields)
          .eq('status','active').order('created_at',{ascending:false}).limit(limit);
        const filters=[`or(expires_at.is.null,expires_at.gt.${new Date().toISOString()})`];
        if(q) filters.push(`or(title.ilike.%${q}%,company_name.ilike.%${q}%,location.ilike.%${q}%)`);
        query=query.or(`and(${filters.join(',')})`);
        if(category) query=query.eq('category',category);
        return query;
      };
      let result = await runJobs(false);
      if (result.error && (result.error.code === '42703' || /detail_type|specifications/i.test(result.error.message || ''))) result = await runJobs(true);
      if(result.error && ['42P01','PGRST205'].includes(result.error.code)) return [];
      if(result.error) throw result.error;
      return (result.data||[]).map(row=>({...row,detail_type:row.detail_type||'',specifications:row.specifications||{},listing_type:'job',image_url:row.image_file_id?mediaProxyUrl(row.image_file_id,row.image_mime_type):null,image_urls:(Array.isArray(row.image_gallery)&&row.image_gallery.length?row.image_gallery.map(item=>mediaProxyUrl(item.file_id,item.mime_type)):row.image_file_id?[mediaProxyUrl(row.image_file_id,row.image_mime_type)]:[]),price_label:[row.salary_min,row.salary_max].filter(v=>v!=null).join(' - ')||'ចរចា',listing_subtitle:row.company_name||'និយោជក'}));
    })());
    if (type === 'all' || type === 'real_estate') {
      if (type === 'all' || propertyType === 'all' || propertyType === 'house_rent' || propertyType === 'room_rent') tasks.push((async () => {
        let query = supabase.from('rentals').select('id,user_id,title,description,short_description,category,property_type,location,address,rent_amount,rent_period,bedrooms,bathrooms,area_sqm,furnished,youtube_video_url,image_file_id,image_mime_type,status,expires_at,created_at')
          .eq('status','active').order('created_at',{ascending:false}).limit(limit);
        const filters=[`or(expires_at.is.null,expires_at.gt.${new Date().toISOString()})`];
        if(q) filters.push(`or(title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%)`);
        query=query.or(`and(${filters.join(',')})`);
        if(propertyType==='house_rent') query=query.eq('property_type','house');
        if(propertyType==='room_rent') query=query.eq('property_type','room');
        const {data,error}=await query;
        if(error && ['42P01','PGRST205'].includes(error.code)) return [];
        if(error) throw error;
        return (data||[]).map(row=>({...row,listing_type:'real_estate',real_estate_type:row.property_type==='room'?'room_rent':'house_rent',image_url:row.image_file_id?mediaProxyUrl(row.image_file_id,row.image_mime_type):null,price_label:row.rent_amount,listing_subtitle:row.property_type==='room'?'បន្ទប់ជួល':'ផ្ទះជួល'}));
      })());
      if (type === 'all' || propertyType === 'all' || propertyType === 'land') tasks.push((async () => {
        let query = supabase.from('land_listings').select('id,user_id,title,description,short_description,category,location,address,price,area_sqm,land_type,title_deed,road_access,youtube_video_url,image_file_id,image_mime_type,status,expires_at,created_at')
          .eq('status','active').order('created_at',{ascending:false}).limit(limit);
        const filters=[`or(expires_at.is.null,expires_at.gt.${new Date().toISOString()})`];
        if(q) filters.push(`or(title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%)`);
        query=query.or(`and(${filters.join(',')})`);
        const {data,error}=await query;
        if(error && ['42P01','PGRST205'].includes(error.code)) return [];
        if(error) throw error;
        return (data||[]).map(row=>({...row,listing_type:'real_estate',real_estate_type:'land',image_url:row.image_file_id?mediaProxyUrl(row.image_file_id,row.image_mime_type):null,price_label:row.price,listing_subtitle:'ដីលក់'}));
      })());
      // House-sale records are stored separately from rental and land records.
      if (type === 'all' || propertyType === 'all' || propertyType === 'house_sale') tasks.push((async () => {
        let query = supabase.from('house_sale_listings').select('id,user_id,title,description,short_description,category,property_type,location,address,price,bedrooms,bathrooms,area_sqm,furnished,title_deed,youtube_video_url,image_file_id,image_mime_type,status,expires_at,created_at')
          .eq('status','active').order('created_at',{ascending:false}).limit(limit);
        const filters=[`or(expires_at.is.null,expires_at.gt.${new Date().toISOString()})`];
        if(q) filters.push(`or(title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%)`);
        query=query.or(`and(${filters.join(',')})`);
        const {data,error}=await query;
        if(error && ['42P01','PGRST205'].includes(error.code)) return [];
        if(error) throw error;
        return (data||[]).map(row=>({...row,listing_type:'real_estate',real_estate_type:'house_sale',image_url:row.image_file_id?mediaProxyUrl(row.image_file_id,row.image_mime_type):null,price_label:row.price,listing_subtitle:'ផ្ទះលក់'}));
      })());
    }
    // New detailed property listings use their own table; legacy house/rental/land tables remain untouched.
    if (type === 'all' || type === 'real_estate') tasks.push((async () => {
      let query = supabase.from('property_listings').select('id,user_id,title,description,short_description,category,subcategory,detail_type,location,address,price,price_period,area_sqm,bedrooms,bathrooms,specifications,youtube_video_url,image_file_id,image_mime_type,image_gallery,status,expires_at,created_at')
          .eq('status','active').order('created_at',{ascending:false}).limit(limit);
        const filters=[`or(expires_at.is.null,expires_at.gt.${new Date().toISOString()})`];
        if(q) filters.push(`or(title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%)`);
        query=query.or(`and(${filters.join(',')})`);
      if (propertyType !== 'all') query = query.eq('category', propertyType);
      const { data, error } = await query;
      if (error && ['42P01','PGRST205'].includes(error.code)) return [];
      if (error) throw error;
      return (data || []).map(row => ({ ...row, listing_type:'real_estate', real_estate_type:row.category, image_url:row.image_file_id?mediaProxyUrl(row.image_file_id,row.image_mime_type):null, image_urls:(Array.isArray(row.image_gallery)&&row.image_gallery.length?row.image_gallery.map(item=>mediaProxyUrl(item.file_id,item.mime_type)):row.image_file_id?[mediaProxyUrl(row.image_file_id,row.image_mime_type)]:[]), price_label:row.price, listing_subtitle:row.subcategory || row.detail_type || 'អចលនទ្រព្យ' }));
    })());
    const groups=await Promise.all(tasks);
    let data=groups.flat().sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0)).slice(0,limit);
    const posterIds=[...new Set(data.map(row => row.listing_type === 'product' ? row.vendors?.user_id : row.user_id).filter(Boolean))];
    const postersResult=posterIds.length
      ? await supabase.from('profiles').select('id,display_name,avatar_url,avatar_file_id,avatar_path').in('id',posterIds)
      : {data:[],error:null};
    if(postersResult.error)throw postersResult.error;
    const posters=new Map((postersResult.data||[]).map(profile=>[profile.id,{
      user_id:profile.id,
      display_name:profile.display_name || 'អ្នកប្រើប្រាស់',
      avatar_url:profile.avatar_url ? normalizeMediaUrl(profile.avatar_url) : (profile.avatar_file_id ? mediaProxyUrl(profile.avatar_file_id) : publicMediaUrl(profile.avatar_path))
    }]));
    data=data.map(row=>{
      const ownerId=row.listing_type==='product'?row.vendors?.user_id:row.user_id;
      const poster=posters.get(ownerId)||null;
      if(row.listing_type==='product'&&row.vendors){
        const {user_id:_ownerId,...vendor}=row.vendors;
        return {...row,vendors:vendor,poster};
      }
      return {...row,poster};
    });
    res.set('Cache-Control','no-store');
    return res.json({data,total:data.length,limit,type});
  } catch(error) {
    console.error('Unified marketplace feed failed:',error.message);
    return fail(res,500,'Could not load marketplace listings');
  }
});

// Independent job and real-estate publishing APIs. Product routes and Telegram product-upload flow are not modified.
const JOB_CATEGORIES = new Set(['it','office','sales','transport','hospitality','construction','education','healthcare','factory','agriculture','services','other']);
const PROPERTY_CATEGORIES = new Set(['house_sale','house_rent','condo_sale','apartment_rent','land','land_rent','commercial_sale','commercial_rent','room_rent','properties_wanted','agent_services','others_properties']);
const listingText = (value, max = 5000) => clean(value, max);
const listingObject = value => { if (value && typeof value === 'object' && !Array.isArray(value)) return value; if (typeof value === 'string') { try { const parsed = JSON.parse(value); return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}; } catch {} } return {}; };
const listingArray = value => { if (Array.isArray(value)) return value; if (typeof value === 'string') { try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : []; } catch {} } return []; };
registerMyPostsRoutes(app, { supabase, authenticate, mediaProxyUrl, deleteTelegramMessage, vendorFor, upload, uploadToTelegram, imageUploadError });
app.post('/api/jobs', authenticate, upload.fields([{name:'images',maxCount:10},{name:'image',maxCount:1}]), async (req, res) => {
  if (!db(res)) return;
  const body=req.body||{};
  const title=listingText(body.title,160);
  const category=listingText(body.category,40).toLowerCase();
  const youtubeVideoUrl=normalizeYoutubeVideoUrl(body.youtube_video_url);
  if(youtubeVideoUrl===false)return fail(res,400,'YouTube Video Link មិនត្រឹមត្រូវទេ។');
  const salaryMin=body.salary_min===''||body.salary_min==null?null:Number(body.salary_min);
  const salaryMax=body.salary_max===''||body.salary_max==null?null:Number(body.salary_max);
  const vacancies=Number(body.vacancies||1);
  if(title.length<2||!/^[a-z0-9_]{2,40}$/.test(category))return fail(res,400,'សូមបំពេញចំណងជើង និងប្រភេទការងារត្រឹមត្រូវ។');
  if(!Number.isInteger(vacancies)||vacancies<1||(salaryMin!=null&&(!Number.isFinite(salaryMin)||salaryMin<0))||(salaryMax!=null&&(!Number.isFinite(salaryMax)||salaryMax<0))||(salaryMin!=null&&salaryMax!=null&&salaryMax<salaryMin))return fail(res,400,'ព័ត៌មានប្រាក់ខែ ឬចំនួនបុគ្គលិកមិនត្រឹមត្រូវ។');
  const images=[...(req.files?.images||[]),...(req.files?.image||[])].slice(0,10);
  for(const image of images){const problem=imageUploadError(image,8*1024*1024);if(problem)return fail(res,400,problem);}
  const uploaded=[];
  try{
    for(const image of images)uploaded.push(await uploadToTelegram(image));
    const primary=uploaded[0]||null;
    const row={
      user_id:req.user.id,title,company_name:listingText(body.company_name,160),description:listingText(body.description,5000),
      short_description:listingText(body.short_description,300),category,subcategory:listingText(body.subcategory,100),
      detail_type:listingText(body.detail_type,120),location:listingText(body.location,120),
      province_code:listingText(body.province_code,2),district_code:listingText(body.district_code,4),
      commune_code:listingText(body.commune_code,6),village_code:listingText(body.village_code,8),vacancies,
      salary_min:salaryMin,salary_max:salaryMax,salary_period:['hourly','daily','monthly','negotiable'].includes(body.salary_period)?body.salary_period:'monthly',
      employment_type:listingText(body.employment_type,40)||'full_time',work_schedule:listingText(body.work_schedule,120),
      days_off:listingText(body.days_off,120),experience:listingText(body.experience,120),education:listingText(body.education,120),
      skills:listingArray(body.skills).map(v=>listingText(v,80)).filter(Boolean).slice(0,30),
      languages:listingArray(body.languages).map(v=>listingText(v,60)).filter(Boolean).slice(0,20),
      benefits:listingArray(body.benefits).map(v=>listingText(v,120)).filter(Boolean).slice(0,30),
      specifications:listingObject(body.specifications),youtube_video_url:youtubeVideoUrl,
      image_file_id:primary?.fileId||null,image_message_id:primary?.messageId||null,image_mime_type:primary?.mimeType||null,
      image_gallery:uploaded.map(item=>({file_id:item.fileId,message_id:item.messageId,mime_type:item.mimeType})),status:'active',expires_at:new Date(Date.now()+7*86400000).toISOString()
    };
    const {data,error}=await supabase.from('jobs').insert(row).select().single();
    if(error)throw error;
    return res.status(201).json({data:{...data,image_url:primary?mediaProxyUrl(primary.fileId,primary.mimeType):null,image_urls:uploaded.map(item=>mediaProxyUrl(item.fileId,item.mimeType))}});
  }catch(error){
    for(const item of uploaded)if(item?.messageId)await deleteTelegramMessage(item.messageId);
    console.error('Job listing create failed:',error.message);
    return fail(res,400,'មិនអាចបង្កើតប្រកាសការងារបានទេ។ សូមពិនិត្យ Database migration និងព័ត៌មានដែលបានបំពេញ។');
  }
});
app.post('/api/real-estate', authenticate, upload.fields([{name:'images',maxCount:10},{name:'image',maxCount:1}]), async (req, res) => {
  if(!db(res))return;
  const body=req.body||{};
  const title=listingText(body.title,160);
  const category=listingText(body.category,40).toLowerCase();
  const youtubeVideoUrl=normalizeYoutubeVideoUrl(body.youtube_video_url);
  if(youtubeVideoUrl===false)return fail(res,400,'YouTube Video Link មិនត្រឹមត្រូវទេ។');
  const price=body.price===''||body.price==null?null:Number(body.price);
  const area=body.area_sqm===''||body.area_sqm==null?null:Number(body.area_sqm);
  if(title.length<2||!/^[a-z0-9_]{2,40}$/.test(category))return fail(res,400,'សូមបំពេញចំណងជើង និងប្រភេទអចលនទ្រព្យត្រឹមត្រូវ។');
  if(price!=null&&(!Number.isFinite(price)||price<0))return fail(res,400,'តម្លៃមិនត្រឹមត្រូវ។');
  if(area!=null&&(!Number.isFinite(area)||area<0))return fail(res,400,'ទំហំផ្ទៃដីមិនត្រឹមត្រូវ។');
  if(['house_sale','house_rent','condo_sale','apartment_rent','land','land_rent','commercial_sale','commercial_rent','room_rent'].includes(category)&&price==null)return fail(res,400,'សូមបញ្ចូលតម្លៃលក់ ឬជួល។');
  const images=[...(req.files?.images||[]),...(req.files?.image||[])].slice(0,10);
  for(const image of images){const problem=imageUploadError(image,8*1024*1024);if(problem)return fail(res,400,problem);}
  const uploaded=[];
  try{
    for(const image of images)uploaded.push(await uploadToTelegram(image));
    const primary=uploaded[0]||null;
    const row={
      user_id:req.user.id,title,description:listingText(body.description,5000),short_description:listingText(body.short_description,300),
      category,subcategory:listingText(body.subcategory,120),detail_type:listingText(body.detail_type,120),
      location:listingText(body.location,120),address:listingText(body.address,300),
      province_code:listingText(body.province_code,2),district_code:listingText(body.district_code,4),
      commune_code:listingText(body.commune_code,6),village_code:listingText(body.village_code,8),price,
      price_period:['daily','monthly','yearly','total','negotiable'].includes(body.price_period)?body.price_period:'total',
      area_sqm:area,bedrooms:body.bedrooms===''||body.bedrooms==null?null:Math.max(0,Number(body.bedrooms)),
      bathrooms:body.bathrooms===''||body.bathrooms==null?null:Math.max(0,Number(body.bathrooms)),
      specifications:listingObject(body.specifications),youtube_video_url:youtubeVideoUrl,
      image_file_id:primary?.fileId||null,image_message_id:primary?.messageId||null,image_mime_type:primary?.mimeType||null,
      image_gallery:uploaded.map(item=>({file_id:item.fileId,message_id:item.messageId,mime_type:item.mimeType})),status:'active',expires_at:new Date(Date.now()+7*86400000).toISOString()
    };
    const {data,error}=await supabase.from('property_listings').insert(row).select().single();
    if(error)throw error;
    return res.status(201).json({data:{...data,image_url:primary?mediaProxyUrl(primary.fileId,primary.mimeType):null,image_urls:uploaded.map(item=>mediaProxyUrl(item.fileId,item.mimeType))}});
  }catch(error){
    for(const item of uploaded)if(item?.messageId)await deleteTelegramMessage(item.messageId);
    console.error('Real-estate listing create failed:',error.message);
    return fail(res,400,'មិនអាចបង្ហោះអចលនទ្រព្យបានទេ។ សូមពិនិត្យ Database migration និងព័ត៌មានដែលបានបំពេញ។');
  }
});

// Store hierarchical product taxonomy outside the legacy product record and image workflow.
app.put('/api/products/:id/listing-details', authenticate, async (req, res) => {
  if (!db(res)) return;
  const { data: vendor } = await vendorFor(req.user.id);
  const admin = await isAdmin(req.user.id);
  let productQuery = supabase.from('products').select('id,vendor_id').eq('id', req.params.id);
  if (!admin) {
    if (!vendor || vendor.status === 'blocked') return fail(res,403,'Active seller account required');
    productQuery = productQuery.eq('vendor_id',vendor.id);
  }
  const { data: product, error: productError } = await productQuery.maybeSingle();
  if (productError) return fail(res,500,'Could not verify product ownership');
  if (!product) return fail(res,404,'Product not found');
  const category = listingText(req.body?.category,80);
  const subcategory = listingText(req.body?.subcategory,100);
  const detailType = listingText(req.body?.detail_type,120);
  const specifications = listingObject(req.body?.specifications);
  const { data, error } = await supabase.from('product_listing_details').upsert({
    product_id:product.id,category,subcategory,detail_type:detailType,specifications,
    province_code:listingText(req.body?.province_code,2),district_code:listingText(req.body?.district_code,4),
    commune_code:listingText(req.body?.commune_code,6),village_code:listingText(req.body?.village_code,8),
    updated_at:new Date().toISOString()
  },{onConflict:'product_id'}).select().single();
  if (error) return fail(res,400,'Could not save product category details');
  return res.json({data});
});

app.get('/api/products', async (req, res) => {
  if (!db(res)) return;
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 24));
  const q = clean(req.query.q, 100);
  const category = clean(req.query.category, 80);
  const vendorId = clean(req.query.vendor_id, 36);
  if (req.query.vendor_id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(vendorId)) {
    return fail(res, 400, 'Invalid vendor ID.');
  }
  const cutoff = new Date(Date.now() - PRODUCT_PUBLIC_MAX_AGE_MS).toISOString();

  const runProductsQuery = async (legacyRenewal = false) => {
    const fields = legacyRenewal
      ? 'id,title,description,price,stock,category,location,condition,view_count,created_at,updated_at,vendor_id,product_images(id,file_id,image_url,sort_order),vendors!inner(id,store_name,status,store_logo_file_id)'
      : 'id,title,description,price,stock,category,location,condition,view_count,created_at,updated_at,renewed_at,vendor_id,product_images(id,file_id,image_url,sort_order),vendors!inner(id,store_name,status,store_logo_file_id)';
    const includeOutOfStock = Boolean(vendorId) && req.query.include_out_of_stock === 'true';
    let query = supabase.from('products').select(fields, { count: 'exact' })
      .eq('status', 'active')
      .in('vendors.status', ['approved','pending','rejected']);
    if (!includeOutOfStock) query = query.gt('stock', 0);
    if (vendorId) query = query.eq('vendor_id', vendorId);

    // Combine age and text filters into one PostgREST logic expression.
    // This avoids duplicate OR query parameters, which can be ambiguous.
    const filters = [legacyRenewal
      ? `created_at.gte.${cutoff}`
      : `or(renewed_at.gte.${cutoff},and(renewed_at.is.null,created_at.gte.${cutoff}))`];
    if (q) {
      const term = q.replace(/[%_,()]/g, '').trim();
      if (term) filters.push(`or(title.ilike.%${term}%,description.ilike.%${term}%,location.ilike.%${term}%)`);
    }
    query = query.or(`and(${filters.join(',')})`)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
    if (category) query = query.eq('category', category);
    return query;
  };

  let { data, error, count } = await runProductsQuery(false);
  const missingRenewalColumn = error && (
    error.code === '42703'
    || /renewed_at.*(does not exist|schema cache)|column .*renewed_at/i.test(error.message || '')
  );

  // Older Supabase databases may not yet have the renewal migration, or may still
  // contain recently-created rows with a NULL renewed_at. Use created_at as a safe
  // seven-day fallback so public listings do not disappear while the schema catches up.
  if (missingRenewalColumn || (!error && !(data || []).length)) {
    const fallback = await runProductsQuery(true);
    if (!fallback.error && (fallback.data || []).length) {
      ({ data, error, count } = fallback);
      data = data.map(row => ({ ...row, renewed_at: row.created_at }));
    } else if (missingRenewalColumn) {
      ({ data, error, count } = fallback);
    }
  }

  if (error) {
    console.error('Could not load marketplace products:', error);
    return fail(res, 500, 'Could not load products');
  }

  // Attach category specifications and the lowest active variant price to public product cards.
  const productIds = (data || []).map(row => row.id).filter(Boolean);
  const [listingDetailsResult, variantsResult] = productIds.length ? await Promise.all([
    supabase.from('product_listing_details').select('product_id,specifications,subcategory,detail_type').in('product_id', productIds),
    supabase.from('product_variants').select('product_id,price,stock').eq('is_active', true).in('product_id', productIds).order('sort_order').order('price')
  ]) : [{ data: [] }, { data: [] }];
  const specificationsByProduct = new Map((listingDetailsResult.data || []).map(row => [String(row.product_id), row]));
  const variantsByProduct = new Map();
  for (const variant of variantsResult.data || []) {
    const key = String(variant.product_id);
    if (!variantsByProduct.has(key)) variantsByProduct.set(key, []);
    variantsByProduct.get(key).push(variant);
  }
  data = (data || []).map(row => {
    const details = specificationsByProduct.get(String(row.id));
    const variants = variantsByProduct.get(String(row.id)) || [];
    return {
      ...row,
      specifications: details?.specifications || {},
      subcategory: details?.subcategory || null,
      detail_type: details?.detail_type || null,
      display_price: variants.some(item => Number(item.stock) > 0) ? Math.min(...variants.filter(item => Number(item.stock) > 0).map(item => Number(item.price))) : row.price
    };
  });

  const trust = await ratingsFor((data || []).map(row => row.vendor_id));
  const enriched = (data || []).map(row => ({
    ...row,
    seller_rating: trust[row.vendor_id]?.average ?? null,
    seller_review_count: trust[row.vendor_id]?.count ?? 0
  }));
  res.set('Cache-Control', 'no-store');
  res.json({ data: enriched.map(publicProduct), page, limit, total: count || 0 });
});
app.get('/api/products/:id', async (req, res) => {
  if (!db(res)) return;
  const cutoff = new Date(Date.now() - PRODUCT_PUBLIC_MAX_AGE_MS).toISOString();
  const productFields = '*,product_images(id,file_id,image_url,sort_order),vendors!inner(id,user_id,store_name,status,store_logo_file_id)';
  let { data, error } = await supabase.from('products').select(productFields)
    .eq('id', req.params.id).eq('status', 'active').in('vendors.status', ['approved','pending','rejected'])
    .or(`renewed_at.gte.${cutoff},and(renewed_at.is.null,created_at.gte.${cutoff})`)
    .maybeSingle();

  const missingRenewalColumn = error && (
    error.code === '42703'
    || /renewed_at.*(does not exist|schema cache)|column .*renewed_at/i.test(error.message || '')
  );
  if (missingRenewalColumn) {
    ({ data, error } = await supabase.from('products').select(productFields)
      .eq('id', req.params.id).eq('status', 'active')
      .in('vendors.status', ['approved','pending','rejected'])
      .gte('created_at', cutoff).maybeSingle());
  }
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
  const { data: listingDetails } = await supabase.from('product_listing_details')
    .select('category,subcategory,detail_type,specifications,province_code,district_code,commune_code,village_code')
    .eq('product_id', data.id).maybeSingle();
  if (listingDetails) {
    data.specifications = listingDetails.specifications || {};
    data.listing_details = listingDetails;
  }
  const { data: activeVariants, error: variantsError } = await supabase
    .from('product_variants')
    .select('id,sku,option_name,option_value,price,stock,sort_order')
    .eq('product_id', data.id).eq('is_active', true)
    .order('sort_order', { ascending: true }).order('price', { ascending: true });
  if (variantsError) {
    console.error('Could not load product variants:', variantsError.message);
    return fail(res, 500, 'Could not load product variants');
  }
  data.variants = activeVariants || [];
  const trust = await ratingsFor([data.vendor_id]);
  data.seller_rating = trust[data.vendor_id]?.average ?? null;
  data.seller_review_count = trust[data.vendor_id]?.count ?? 0;
  const ownerId = data.vendors?.user_id;
  if (ownerId) {
    const { data: profile } = await supabase.from('profiles').select('id,display_name,avatar_url,avatar_file_id,avatar_path').eq('id', ownerId).maybeSingle();
    data.poster = profile ? {
      user_id: profile.id,
      display_name: profile.display_name || 'អ្នកប្រើប្រាស់',
      avatar_url: profile.avatar_url ? normalizeMediaUrl(profile.avatar_url) : (profile.avatar_file_id ? mediaProxyUrl(profile.avatar_file_id) : publicMediaUrl(profile.avatar_path))
    } : null;
  }
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
  const normalized = profile ? { ...withoutStorageFields(profile), avatar_url: normalizeMediaUrl(profile.avatar_url) || mediaProxyUrl(profile.avatar_file_id) || publicMediaUrl(profile.avatar_path), cover_url: normalizeMediaUrl(profile.cover_url) || mediaProxyUrl(profile.cover_file_id) || publicMediaUrl(profile.cover_path) } : null;
  const safeVendor = vendor ? publicVendor(vendor) : null;
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
  res.json({ data: { ...withoutStorageFields(data), avatar_url: normalizeMediaUrl(data.avatar_url) || mediaProxyUrl(data.avatar_file_id) || publicMediaUrl(data.avatar_path), cover_url: normalizeMediaUrl(data.cover_url) || mediaProxyUrl(data.cover_file_id) || publicMediaUrl(data.cover_path) } });
});
app.patch('/api/me/default-location', authenticate, async (req, res) => {
  const value = req.body?.default_location;
  let defaultLocation = null;
  if (value !== null) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return fail(res, 400, 'Invalid default location.');
    }
    const province_code = clean(value.province_code, 8);
    const district_code = clean(value.district_code, 8);
    const commune_code = clean(value.commune_code, 8);
    const village_code = clean(value.village_code, 8);
    const location = clean(value.location, 500);
    if (!/^\d{2}$/.test(province_code) || !/^\d{4}$/.test(district_code) ||
        !/^\d{6}$/.test(commune_code) || !/^\d{8}$/.test(village_code) || !location) {
      return fail(res, 400, 'សូមជ្រើសរើសទីតាំងត្រឹមត្រូវដល់កម្រិតភូមិ។');
    }
    defaultLocation = { province_code, district_code, commune_code, village_code, location };
  }
  const { data, error } = await supabase.from('profiles')
    .update({ default_location: defaultLocation })
    .eq('id', req.user.id)
    .select('default_location')
    .single();
  if (error) {
    console.error('Default location save failed:', error.message);
    return fail(res, 500, 'មិនអាចរក្សាទុកទីតាំងលំនាំដើមបានទេ។ សូមពិនិត្យ SQL Migration។');
  }
  return res.json({ data: { default_location: data.default_location } });
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
    const url = mediaProxyUrl(uploaded.fileId);
    const patch = type === 'avatar'
      ? { avatar_file_id: uploaded.fileId, avatar_message_id: uploaded.messageId, avatar_url: url, avatar_path: null }
      : { cover_file_id: uploaded.fileId, cover_message_id: uploaded.messageId, cover_url: url, cover_path: null };
    const { data, error } = await supabase.from('profiles').update(patch).eq('id', req.user.id).select().single();
    if (error) {
      await deleteTelegramMessage(uploaded.messageId);
      console.error('Profile Telegram media DB update failed:', error.message);
      return fail(res, 500, 'Image was uploaded but could not be saved to your profile. Please try again.');
    }
    const oldMessageId = type === 'avatar' ? prior?.avatar_message_id : prior?.cover_message_id;
    if (oldMessageId && oldMessageId !== uploaded.messageId) await deleteTelegramMessage(oldMessageId);
    const normalized = {
      ...withoutStorageFields(data),
      avatar_url: normalizeMediaUrl(data.avatar_url) || mediaProxyUrl(data.avatar_file_id) || publicMediaUrl(data.avatar_path),
      cover_url: normalizeMediaUrl(data.cover_url) || mediaProxyUrl(data.cover_file_id) || publicMediaUrl(data.cover_path)
    };
    return res.status(201).json({ data: normalized });
  } catch (error) {
    console.error('Profile media upload failed:', error.message);
    return fail(res, 502, 'Could not upload profile image. Please try again.');
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
    if (uploaded) Object.assign(values, { document_path: null, document_file_id: uploaded.fileId, document_message_id: uploaded.messageId, document_mime_type: uploaded.mimeType, document_url: mediaProxyUrl(uploaded.fileId) });
    const result = existing ? await supabase.from('vendors').update(values).eq('id', existing.id).select().single() : await supabase.from('vendors').insert(values).select().single();
    if (result.error) {
      if (uploaded?.messageId) await deleteTelegramMessage(uploaded.messageId);
      console.error('Seller registration save failed:', result.error.message);
      return fail(res, 500, 'Could not save seller registration.');
    }
    if (uploaded && existing?.document_message_id && existing.document_message_id !== uploaded.messageId) await deleteTelegramMessage(existing.document_message_id);
    const safeVendor = publicVendor(result.data);
    const documentUrl = result.data.document_file_id ? mediaProxyUrl(result.data.document_file_id) : null;
    return res.status(existing ? 200 : 201).json({ data: { ...safeVendor, document_url: documentUrl } });
  } catch (error) {
    if (uploaded?.messageId) await deleteTelegramMessage(uploaded.messageId);
    console.error('Seller registration failed:', error.message);
    return fail(res, 502, 'Could not submit seller registration. Please try again.');
  }
});
app.get('/api/vendor/name-history', authenticate, requireVendor, async (req, res) => {
  const { data, error } = await supabase.from('vendor_shop_name_history')
    .select('id,previous_store_name,new_store_name,changed_at')
    .eq('vendor_id', req.vendor.id).order('changed_at', { ascending: false }).limit(100);
  if (error) return fail(res, 500, 'Could not load shop name history.');
  return res.json({ data: data || [] });
});
app.get('/api/admin/vendors/:id/name-history', authenticate, requireAdmin, async (req, res) => {
  const { data: vendor, error: vendorError } = await supabase.from('vendors')
    .select('id,store_name').eq('id', req.params.id).maybeSingle();
  if (vendorError || !vendor) return fail(res, 404, 'Store not found.');
  const { data, error } = await supabase.from('vendor_shop_name_history')
    .select('id,previous_store_name,new_store_name,changed_at')
    .eq('vendor_id', vendor.id).order('changed_at', { ascending: false }).limit(100);
  if (error) return fail(res, 500, 'Could not load shop name history.');
  return res.json({ data: data || [], current_store_name: vendor.store_name });
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
    return res.json({ data: publicVendor(data) });
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
  res.json({ data: (data || []).map(publicProduct), vendor: publicVendor(vendor) });
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
  const youtubeVideoUrl = normalizeYoutubeVideoUrl(req.body.youtube_video_url);
  if (youtubeVideoUrl === false) return fail(res, 400, 'YouTube Video Link មិនត្រឹមត្រូវទេ។');
  const { data, error } = await supabase.from('products')
    .insert({ vendor_id: vendor.id, title, description, category, price, stock, location, condition, youtube_video_url:youtubeVideoUrl, status, renewed_at:new Date().toISOString() }).select().single();
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
  if (req.body.youtube_video_url !== undefined) { const videoUrl = normalizeYoutubeVideoUrl(req.body.youtube_video_url); if (videoUrl === false) return fail(res, 400, 'YouTube Video Link មិនត្រឹមត្រូវទេ។'); patch.youtube_video_url = videoUrl; }
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
app.post('/api/products/:id/images', authenticate, upload.array('images', 10), async (req, res) => {
  const admin = await isAdmin(req.user.id);
  const { data: vendor } = await vendorFor(req.user.id);
  if (!admin && (!vendor || vendor.status === 'blocked')) return fail(res, 403, 'Active vendor account required');
  let productQuery = supabase.from('products').select('id').eq('id', req.params.id);
  // Admins may manage official-store products without owning a separate vendor account.
  // Non-admin sellers remain strictly scoped to their own vendor ID.
  if (!admin) productQuery = productQuery.eq('vendor_id', vendor.id);
  const { data: product } = await productQuery.maybeSingle();
  if (!product) return fail(res, 404, 'Product not found');
  const files = req.files || [];
  if (!files.length || files.some(file => imageUploadError(file, 20 * 1024 * 1024))) {
    return fail(res, 400, 'Choose valid JPG, PNG or WEBP product images only (maximum 20MB per image).');
  }
  const { count } = await supabase.from('product_images').select('*', { count: 'exact', head: true }).eq('product_id', product.id);
  if ((count || 0) + files.length > 10) return fail(res, 400, 'Maximum 10 images per product.');
  const uploaded = [];
  try {
    for (const file of files) uploaded.push(await uploadToTelegram(file, 20 * 1024 * 1024));
    const rows = uploaded.map((item, index) => ({
      product_id: product.id, telegram_message_id: item.messageId, file_id: item.fileId,
      image_url: mediaProxyUrl(item.fileId), sort_order: (count || 0) + index
    }));
    const { data, error } = await supabase.from('product_images').insert(rows).select('id,product_id,file_id,telegram_message_id,image_url,sort_order');
    if (error) throw new Error('Image uploads succeeded, but the product image records could not be saved. Please contact support.');
    if ((count || 0) + files.length === 1) {
      void discoverProductGalleryCandidates(product.id).then(result => {
        console.info('Smart Product Gallery first-image discovery:', { productId: product.id, candidates: result.found || 0, skipped: Boolean(result.skipped) });
      }).catch(error => console.warn('Smart Product Gallery first-image discovery failed:', product.id, clean(error.message, 180)));
    }
    return res.status(201).json({ data: (data || []).map(image => ({
      id: image.id, product_id: image.product_id, sort_order: image.sort_order,
      image_url: image.file_id ? mediaProxyUrl(image.file_id) : normalizeMediaUrl(image.image_url)
    })) });
  } catch (error) {
    for (const item of uploaded) await deleteTelegramMessage(item.messageId);
    console.error('Product image upload failed:', error.message);
    return fail(res, 502, 'Product image upload failed. Please try again.');
  }
});

app.patch('/api/products/:id/images/order', authenticate, async (req, res) => {
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
  const imageIds = Array.isArray(req.body?.image_ids) ? req.body.image_ids.map(id => clean(id, 80)) : [];
  if (imageIds.length > 10 || new Set(imageIds).size !== imageIds.length || imageIds.some(id => !id)) return fail(res, 400, 'Invalid product image order.');
  const { data: rows, error: lookupError } = await supabase.from('product_images').select('id').eq('product_id', product.id);
  if (lookupError) return fail(res, 500, 'Could not verify product images.');
  const ownedIds = new Set((rows || []).map(row => String(row.id)));
  if (imageIds.length !== ownedIds.size || imageIds.some(id => !ownedIds.has(String(id)))) return fail(res, 400, 'Image order must include every current product image.');
  for (let index = 0; index < imageIds.length; index++) {
    const { error } = await supabase.from('product_images').update({ sort_order: index }).eq('id', imageIds[index]).eq('product_id', product.id);
    if (error) return fail(res, 500, 'Could not save product image order.');
  }
  return res.json({ success: true, main_image_id: imageIds[0] || null });
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


const allowedSavedListingTypes = new Set(['product','job','real_estate']);
async function verifyPublicListing(type, id) {
  const table = type === 'product' ? 'products' : type === 'job' ? 'jobs' : 'property_listings';
  let query = supabase.from(table).select('id').eq('id', id).eq('status','active');
  const {data,error}=await query.maybeSingle();
  if(error) throw error;
  return data;
}
app.post('/api/listing-saves', authenticate, async (req,res) => {
  const type=clean(req.body?.listing_type,20);
  const id=clean(req.body?.id,80);
  if(!allowedSavedListingTypes.has(type)||!id) return fail(res,400,'ប្រភេទប្រកាសមិនត្រឹមត្រូវ។');
  try {
    const listing=await verifyPublicListing(type,id);
    if(!listing) return fail(res,404,'រកមិនឃើញប្រកាសនេះទេ។');
    const {error}=await supabase.from('saved_listings').upsert({user_id:req.user.id,listing_type:type,listing_id:String(id)},{onConflict:'user_id,listing_type,listing_id'});
    if(error) throw error;
    return res.status(201).json({data:{saved:true}});
  } catch(error) {
    console.error('Listing save failed:',error.message);
    return fail(res,500,'មិនអាចរក្សាទុកប្រកាសបានទេ។ សូមពិនិត្យ Migration។');
  }
});
app.delete('/api/listing-saves/:type/:id', authenticate, async (req,res) => {
  const type=clean(req.params.type,20), id=clean(req.params.id,80);
  if(!allowedSavedListingTypes.has(type)||!id) return fail(res,400,'ប្រភេទប្រកាសមិនត្រឹមត្រូវ។');
  const {error}=await supabase.from('saved_listings').delete().eq('user_id',req.user.id).eq('listing_type',type).eq('listing_id',id);
  if(error) return fail(res,500,'មិនអាចដកប្រកាសចេញពី Saved បានទេ។');
  return res.json({data:{saved:false}});
});
app.post('/api/listing-reports', authenticate, async (req,res) => {
  const type=clean(req.body?.listing_type,20), id=clean(req.body?.id,80), reason=clean(req.body?.reason,1000);
  if(!allowedSavedListingTypes.has(type)||!id||reason.length<3) return fail(res,400,'សូមបញ្ចូលមូលហេតុរាយការណ៍។');
  try {
    const listing=await verifyPublicListing(type,id);
    if(!listing) return fail(res,404,'រកមិនឃើញប្រកាសនេះទេ។');
    const {error}=await supabase.from('listing_reports').insert({reporter_id:req.user.id,listing_type:type,listing_id:String(id),reason});
    if(error) {
      if(error.code==='23505') return fail(res,409,'អ្នកបានរាយការណ៍ប្រកាសនេះរួចហើយ។');
      throw error;
    }
    return res.status(201).json({data:{reported:true}});
  } catch(error) {
    console.error('Listing report failed:',error.message);
    return fail(res,500,'មិនអាចផ្ញើរបាយការណ៍បានទេ។ សូមពិនិត្យ Migration។');
  }
});

app.get('/api/vendors/:id/ratings', async (req, res) => {
  if (!db(res)) return;
  const { data: vendor, error } = await supabase.from('vendors')
    .select('id,public_shop_id,user_id,store_name,description,status,address,store_location,store_logo_file_id,store_cover_file_id,created_at,profiles(display_name,province,bio,avatar_path)')
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
  res.set('Cache-Control', 'no-store');
  res.json({ data: {
    id: vendor.id, public_shop_id: vendor.public_shop_id, store_name: vendor.store_name, description: vendor.description, created_at: vendor.created_at,
    status: vendor.status, verified: vendor.status === 'approved', store_location: vendor.store_location || vendor.address || null,
    store_logo_url: vendor.store_logo_file_id ? mediaProxyUrl(vendor.store_logo_file_id) : null,
    store_cover_url: vendor.store_cover_file_id ? mediaProxyUrl(vendor.store_cover_file_id) : null,
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
    product_id: clean(item.product_id, 60),
    variant_id: item.variant_id ? clean(item.variant_id, 60) : null,
    quantity: Number(item.quantity)
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
    return { ...publicVendor(safeVendor), document_url: vendor.document_file_id ? `/api/admin/vendors/${encodeURIComponent(vendor.id)}/document` : vendor.document_url || null };
  });
  res.json({ data: enriched });
});
app.patch('/api/admin/vendors/:id/profile', authenticate, requireAdmin, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), async (req, res) => {
  const { data: vendor, error: vendorError } = await supabase.from('vendors')
    .select('id,store_name,description,store_location,address,status,store_logo_file_id,store_logo_message_id,store_cover_file_id,store_cover_message_id,public_shop_id,shop_code')
    .eq('id', req.params.id).maybeSingle();
  if (vendorError || !vendor) return fail(res, 404, 'Store not found.');
  const store_name = clean(req.body.store_name, 80);
  const store_location = clean(req.body.store_location, 160);
  const description = clean(req.body.description, 1000);
  if (store_name.length < 2) return fail(res, 400, 'Store name must contain at least 2 characters.');
  const logo = req.files?.logo?.[0], cover = req.files?.cover?.[0];
  for (const file of [logo, cover].filter(Boolean)) {
    const invalid = imageUploadError(file);
    if (invalid) return fail(res, 400, invalid);
  }
  const uploaded = [];
  try {
    const logoMedia = logo ? await uploadToTelegram(logo) : null;
    if (logoMedia) uploaded.push(logoMedia);
    const coverMedia = cover ? await uploadToTelegram(cover) : null;
    if (coverMedia) uploaded.push(coverMedia);
    const patch = { store_name, store_location, address: store_location, description };
    if (logoMedia) Object.assign(patch, { store_logo_file_id: logoMedia.fileId, store_logo_message_id: logoMedia.messageId });
    if (coverMedia) Object.assign(patch, { store_cover_file_id: coverMedia.fileId, store_cover_message_id: coverMedia.messageId });
    const { data, error } = await supabase.from('vendors').update(patch).eq('id', vendor.id).select().single();
    if (error) throw error;
    if (logoMedia && vendor.store_logo_message_id) await deleteTelegramMessage(vendor.store_logo_message_id);
    if (coverMedia && vendor.store_cover_message_id) await deleteTelegramMessage(vendor.store_cover_message_id);
    res.set('Cache-Control', 'no-store');
    return res.json({ data: publicVendor(data) });
  } catch (error) {
    for (const item of uploaded) await deleteTelegramMessage(item.messageId);
    console.error('Admin shop profile update failed:', error.message);
    return fail(res, 500, 'Could not save shop profile.');
  }
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


// Smart Product Gallery: discover exact-model image candidates for Admin review.
// Approved images are copied into Telegram through the existing upload pipeline.
function galleryIsPrivateAddress(address) {
  const value = String(address || '').toLowerCase();
  if (isIP(value) === 4) {
    const parts = value.split('.').map(Number), a = parts[0], b = parts[1];
    return a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
  }
  if (isIP(value) === 6) {
    return value === '::' || value === '::1' || value.startsWith('fc') ||
      value.startsWith('fd') || value.startsWith('fe8') || value.startsWith('fe9') ||
      value.startsWith('fea') || value.startsWith('feb') || value.startsWith('ff') ||
      value.startsWith('::ffff:');
  }
  return true;
}
async function gallerySafeRemoteUrl(raw) {
  try {
    const url = new URL(raw), host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || !host || isIP(host) || host === 'localhost' ||
        host.endsWith('.localhost') || host.endsWith('.local') || url.username || url.password) return null;
    const addresses = await lookup(host, { all: true, verbatim: true });
    if (!addresses.length || addresses.some(item => galleryIsPrivateAddress(item.address))) return null;
    return url;
  } catch { return null; }
}
function galleryDecodeHtml(value) {
  return String(value || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_m, n) => String.fromCodePoint(Number(n) || 0));
}
function galleryHtmlAttr(html, attr) {
  const key = String(attr).replace(/[^a-z0-9:-]/gi, '');
  const re = new RegExp("<meta[^>]+(?:property|name)=[\"']" + key + "[\"'][^>]+content=[\"']([^\"']+)[\"']", 'i');
  const first = html.match(re);
  if (first) return galleryDecodeHtml(first[1]);
  const reversed = new RegExp("<meta[^>]+content=[\"']([^\"']+)[\"'][^>]+(?:property|name)=[\"']" + key + "[\"']", 'i');
  return galleryDecodeHtml(html.match(reversed)?.[1] || '');
}
function galleryJsonLdImages(html) {
  const found = [];
  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1]);
      const visit = value => {
        if (!value || typeof value !== 'object') return;
        if (Array.isArray(value)) return value.forEach(visit);
        if (value.image) for (const image of (Array.isArray(value.image) ? value.image : [value.image])) {
          const url = typeof image === 'string' ? image : image?.url || image?.contentUrl;
          if (url) found.push(url);
        }
        if (value['@graph']) visit(value['@graph']);
      };
      visit(parsed);
    } catch {}
  }
  return found;
}
function galleryIdentity(product, supplierCode, variants) {
  const tokens = String(product.title || '').toLowerCase().match(/[a-z0-9][a-z0-9._+-]{1,}/g) || [];
  const generic = new Set(['laptop','desktop','computer','notebook','monitor','phone','smartphone','wireless','gaming','original','official','product','series','brand','new']);
  const brandToken = tokens[0] || '';
  const modelTokens = [...new Set([brandToken, ...tokens.filter(token => /\d/.test(token) || token.length >= 5)])]
    .filter(token => token.length >= 2 && !generic.has(token)).slice(0, 8);
  const code = String(supplierCode || '').trim().toLowerCase();
  const skuTokens = (variants || []).map(row => String(row.sku || '').trim().toLowerCase()).filter(Boolean);
  return { title: String(product.title || ''), code, modelTokens, skuTokens };
}
function galleryScorePage(text, identity) {
  const haystack = ' ' + String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ') + ' ';
  const normalize = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
  const code = normalize(identity.code);
  const exactCode = Boolean(code && haystack.includes(' ' + code + ' '));
  const matchedModels = identity.modelTokens.filter(token => haystack.includes(' ' + normalize(token) + ' '));
  const matchedSkus = identity.skuTokens.filter(token => haystack.includes(' ' + normalize(token) + ' '));
  const numericModelMatch = matchedModels.some(token => /\d/.test(token));
  const modelPass = identity.modelTokens.length > 0 && numericModelMatch &&
    matchedModels.length >= Math.min(2, identity.modelTokens.length);
  const codePass = exactCode || matchedSkus.length > 0;
  const verificationLevel = codePass && modelPass ? 'code_verified' : modelPass ? 'model_review_required' : 'unverified';
  return {
    score: Math.min(100, (codePass ? 75 : 0) + Math.min(25, matchedModels.length * 12)),
    exact_product_code: exactCode,
    matched_model_tokens: matchedModels,
    matched_skus: matchedSkus,
    numeric_model_match: numericModelMatch,
    verification_level: verificationLevel,
    verified_identity: Boolean(modelPass)
  };
}
async function galleryFetchPage(rawUrl) {
  let url = await gallerySafeRemoteUrl(rawUrl);
  if (!url) throw new Error('Unsafe source URL.');
  for (let attempt = 0; attempt <= 3; attempt++) {
    const response = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'Mozilla/5.0 (compatible; 7inOneGallery/1.0)', accept: 'text/html,application/xhtml+xml' }, signal: AbortSignal.timeout(12000) });
    if ([301,302,303,307,308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location || attempt === 3) throw new Error('Too many redirects.');
      url = await gallerySafeRemoteUrl(new URL(location, url).href);
      if (!url) throw new Error('Unsafe redirected URL.');
      continue;
    }
    if (!response.ok) throw new Error('Source page HTTP ' + response.status);
    const type = String(response.headers.get('content-type') || '').toLowerCase();
    if (!type.includes('text/html') && !type.includes('application/xhtml+xml')) throw new Error('Source is not an HTML page.');
    const length = Number(response.headers.get('content-length') || 0);
    if (length > 2 * 1024 * 1024) throw new Error('Source page too large.');
    const html = await response.text();
    if (Buffer.byteLength(html) > 2 * 1024 * 1024) throw new Error('Source page too large.');
    return { html, finalUrl: url.href };
  }
  throw new Error('Could not fetch source page.');
}
function galleryImageDimensions(buffer, mimeType) {
  try {
    if (mimeType === 'image/png' && buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }
    if (mimeType === 'image/webp' && buffer.length >= 30 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
      const kind = buffer.toString('ascii', 12, 16);
      if (kind === 'VP8X') return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
      if (kind === 'VP8 ' && buffer.length >= 30) return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
      if (kind === 'VP8L' && buffer[20] === 0x2f) return { width: 1 + buffer[21] + ((buffer[22] & 0x3f) << 8), height: 1 + (buffer[22] >> 6) + (buffer[23] << 2) + ((buffer[24] & 0x0f) << 10) };
    }
    if (mimeType === 'image/jpeg' && buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset + 9 < buffer.length) {
        if (buffer[offset] !== 0xff) { offset++; continue; }
        const marker = buffer[offset + 1], size = buffer.readUInt16BE(offset + 2);
        if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
          return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
        }
        if (size < 2) break;
        offset += size + 2;
      }
    }
  } catch {}
  return null;
}
async function galleryFetchImage(rawUrl) {
  let url = await gallerySafeRemoteUrl(rawUrl);
  if (!url) throw new Error('Unsafe image URL.');
  for (let attempt = 0; attempt <= 3; attempt++) {
    const response = await fetch(url, { redirect: 'manual', headers: { 'user-agent': '7inOne-ProductGallery/1.0', accept: 'image/jpeg,image/png,image/webp' }, signal: AbortSignal.timeout(15000) });
    if ([301,302,303,307,308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location || attempt === 3) throw new Error('Too many image redirects.');
      url = await gallerySafeRemoteUrl(new URL(location, url).href);
      if (!url) throw new Error('Unsafe redirected image URL.');
      continue;
    }
    if (!response.ok) throw new Error('Image source HTTP ' + response.status);
    const mimeType = String(response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!['image/jpeg','image/png','image/webp'].includes(mimeType)) throw new Error('Only JPG, PNG or WEBP are accepted.');
    const length = Number(response.headers.get('content-length') || 0);
    if (length > 20 * 1024 * 1024) throw new Error('Image is larger than 20MB.');
    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length || buffer.length > 20 * 1024 * 1024) throw new Error('Image size is invalid.');
    const signatureOk = mimeType === 'image/jpeg' ? buffer[0] === 0xff && buffer[1] === 0xd8
      : mimeType === 'image/png' ? buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
      : buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
    if (!signatureOk) throw new Error('Image file signature does not match its content type.');
    const dimensions = galleryImageDimensions(buffer, mimeType);
    if (!dimensions || dimensions.width < 600 || dimensions.height < 400) throw new Error('Image resolution is too small or could not be verified (minimum 600 × 400).');
    return { buffer, mimeType, dimensions };
  }
  throw new Error('Could not download image.');
}
function galleryPageImageUrls(html) {
  const urls = [
    galleryHtmlAttr(html, 'og:image'),
    galleryHtmlAttr(html, 'twitter:image'),
    ...galleryJsonLdImages(html)
  ].filter(Boolean);
  for (const match of String(html || '').matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const width = Number(tag.match(/\bwidth=["']?(\d+)/i)?.[1] || 0);
    const height = Number(tag.match(/\bheight=["']?(\d+)/i)?.[1] || 0);
    if ((width && width < 300) || (height && height < 200)) continue;
    for (const attrMatch of tag.matchAll(/\b(?:src|data-src|data-original|data-lazy-src)=["']([^"']+)["']/gi)) {
      if (attrMatch[1]) urls.push(galleryDecodeHtml(attrMatch[1]));
    }
    const srcset = tag.match(/\bsrcset=["']([^"']+)["']/i)?.[1] || '';
    for (const entry of srcset.split(',')) {
      const value = entry.trim().split(/\s+/)[0];
      if (value) urls.push(galleryDecodeHtml(value));
    }
  }
  return [...new Set(urls)];
}

async function discoverProductGalleryCandidates(productId) {
  const { data: product, error: productError } = await supabase.from('products')
    .select('id,title,description,category').eq('id', productId).maybeSingle();
  if (productError || !product) throw new Error('Product not found.');
  const [{ data: source }, { data: variants }] = await Promise.all([
    supabase.from('product_supplier_sources').select('supplier_product_code').eq('product_id', product.id).maybeSingle(),
    supabase.from('product_variants').select('sku').eq('product_id', product.id).eq('is_active', true)
  ]);
  const identity = galleryIdentity(product, source?.supplier_product_code, variants || []);
  if (!identity.modelTokens.length && !identity.code && !identity.skuTokens.length) {
    return { data: [], found: 0, skipped: true, reason: 'missing_product_model_or_code' };
  }

  // Search several query patterns so discovery is not limited to one exact phrase.
  // The search engine indexes a broad range of public websites; it cannot guarantee every site on the internet.
  const modelQuery = identity.modelTokens.join(' ');
  const queries = [...new Set([
    [identity.title, identity.code].filter(Boolean).join(' ') + ' product images',
    [identity.title, ...identity.skuTokens].filter(Boolean).join(' ') + ' official product',
    '"' + identity.title + '" specifications images',
    [modelQuery, identity.code].filter(Boolean).join(' ') + ' product gallery'
  ].map(value => value.trim()).filter(Boolean))];

  const links = [];
  const seenLinks = new Set();
  for (const query of queries) {
    try {
      const response = await fetch('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query), {
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; 7inOneGallery/1.0)', accept: 'text/html' },
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) continue;
      const searchHtml = await response.text();
      for (const match of searchHtml.matchAll(/<a[^>]+class=["'][^"']*result__a[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
        try {
          const wrapped = new URL(galleryDecodeHtml(match[1]), 'https://duckduckgo.com');
          const safe = await gallerySafeRemoteUrl(wrapped.searchParams.get('uddg') || wrapped.href);
          if (!safe || seenLinks.has(safe.href)) continue;
          seenLinks.add(safe.href);
          links.push({
            url: safe.href,
            title: galleryDecodeHtml(match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).slice(0, 240)
          });
        } catch {}
        if (links.length >= 48) break;
      }
    } catch (error) {
      console.warn('Gallery search query skipped:', clean(error.message, 120));
    }
    if (links.length >= 48) break;
  }

  const candidates = [];
  const seenImages = new Set();
  let inspectedPages = 0;
  for (const link of links) {
    if (inspectedPages >= 30 || candidates.length >= 20) break;
    inspectedPages++;
    try {
      const page = await galleryFetchPage(link.url);
      const pageTitle = galleryHtmlAttr(page.html, 'og:title') || galleryHtmlAttr(page.html, 'twitter:title') || link.title;
      const pageDescription = galleryHtmlAttr(page.html, 'og:description') || galleryHtmlAttr(page.html, 'description');
      const match = galleryScorePage([pageTitle, pageDescription, page.html.slice(0, 160000)].join(' '), identity);
      if (!match.verified_identity) continue;
      const rawImages = galleryPageImageUrls(page.html);
      for (const rawImage of rawImages) {
        let imageUrl = null;
        try { imageUrl = (await gallerySafeRemoteUrl(new URL(rawImage, page.finalUrl).href))?.href; } catch {}
        if (!imageUrl || seenImages.has(imageUrl)) continue;
        seenImages.add(imageUrl);
        const sourceDomain = new URL(page.finalUrl).hostname.toLowerCase().replace(/^www\./, '');
        candidates.push({
          product_id: product.id,
          image_url: imageUrl,
          source_url: page.finalUrl,
          source_title: pageTitle,
          match_score: match.score,
          match_evidence: {
            ...match,
            source_domain: sourceDomain,
            source_title: pageTitle,
            source_page_url: page.finalUrl,
            supplier_product_code: identity.code || null,
            expected_skus: identity.skuTokens,
            review_note: match.verification_level === 'model_review_required'
              ? 'Model evidence found, but product code/SKU was not verified. Admin must inspect manually.'
              : 'Product code/SKU and model evidence found. Admin approval is still required.'
          }
        });
        if (candidates.length >= 20) break;
      }
    } catch (error) {
      console.warn('Gallery source skipped:', link.url, clean(error.message, 120));
    }
  }
  if (!candidates.length) return {
    data: [], found: 0, searched_queries: queries.length, inspected_pages: inspectedPages,
    message: 'No sufficiently matched product images were found across the searched public websites.'
  };
  const { data, error } = await supabase.from('product_gallery_candidates')
    .upsert(candidates, { onConflict: 'product_id,image_url', ignoreDuplicates: true })
    .select('id,product_id,image_url,source_url,source_title,match_score,match_evidence,status,created_at');
  if (error) throw new Error('Could not save candidates. Apply the Smart Product Gallery migration first.');
  return {
    data: data || [],
    found: candidates.length,
    searched_queries: queries.length,
    inspected_pages: inspectedPages,
    message: 'Searched multiple public-web query patterns. Candidates remain private and await Admin review; model-only matches are clearly flagged for extra checking.'
  };
}
app.post('/api/admin/products/:id/gallery-search', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await discoverProductGalleryCandidates(req.params.id);
    return res.json(result);
  } catch (error) {
    return fail(res, 502, 'External image search failed: ' + clean(error.message, 160));
  }
});
app.get('/api/admin/gallery-products', authenticate, requireAdmin, async (req, res) => {
  const term = clean(req.query.q, 100);
  if (term.length < 2) return res.json({ data: [] });
  const { data, error } = await supabase.from('products')
    .select('id,title,category,product_images(id)')
    .ilike('title', '%' + term.replace(/[,%_]/g, ' ') + '%')
    .order('created_at', { ascending: false }).limit(30);
  if (error) return fail(res, 500, 'Could not search products for Smart Gallery.');
  return res.json({ data: (data || []).map(item => ({
    id: item.id, title: item.title, category: item.category,
    image_count: (item.product_images || []).length
  })) });
});
app.get('/api/admin/product-gallery-candidates', authenticate, requireAdmin, async (req, res) => {
  const status = clean(req.query.status || 'pending', 20);
  if (!['pending','approved','rejected','failed','all'].includes(status)) return fail(res, 400, 'Invalid candidate status.');
  let query = supabase.from('product_gallery_candidates').select('id,product_id,image_url,source_url,source_title,match_score,match_evidence,status,created_at,products(title)').order('created_at', { ascending: false }).limit(200);
  if (status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  if (error) return fail(res, 500, 'Could not load gallery candidates. Apply the Smart Product Gallery migration first.');
  return res.json({ data: data || [] });
});
app.post('/api/admin/product-gallery-candidates/:id/approve', authenticate, requireAdmin, async (req, res) => {
  const { data: candidate, error } = await supabase.from('product_gallery_candidates').select('*').eq('id', req.params.id).eq('status', 'pending').maybeSingle();
  if (error || !candidate) return fail(res, 404, 'Pending image candidate not found.');
  const { count, error: countError } = await supabase.from('product_images').select('id', { count: 'exact', head: true }).eq('product_id', candidate.product_id);
  if (countError) return fail(res, 500, 'Could not check product image count.');
  if ((count || 0) >= 10) return fail(res, 409, 'Maximum 10 product images reached.');
  let uploaded = null;
  try {
    const remote = await galleryFetchImage(candidate.image_url);
    const extension = remote.mimeType === 'image/png' ? 'png' : remote.mimeType === 'image/webp' ? 'webp' : 'jpg';
    const file = { buffer: remote.buffer, mimetype: remote.mimeType, size: remote.buffer.length, originalname: 'gallery-' + candidate.id + '.' + extension };
    const invalid = imageUploadError(file, 20 * 1024 * 1024);
    if (invalid) return fail(res, 400, invalid);
    uploaded = await uploadToTelegram(file, 20 * 1024 * 1024);
    const { data: lastImage } = await supabase.from('product_images').select('sort_order').eq('product_id', candidate.product_id).order('sort_order', { ascending: false }).limit(1).maybeSingle();
    const { data: image, error: imageError } = await supabase.from('product_images').insert({
      product_id: candidate.product_id, telegram_message_id: uploaded.messageId, file_id: uploaded.fileId,
      image_url: mediaProxyUrl(uploaded.fileId), sort_order: Number(lastImage?.sort_order ?? -1) + 1
    }).select('id,product_id,file_id,telegram_message_id,image_url,sort_order').single();
    if (imageError) throw new Error('Telegram upload succeeded but gallery record could not be saved.');
    const { error: reviewError } = await supabase.from('product_gallery_candidates').update({
      status: 'approved', telegram_message_id: uploaded.messageId, telegram_file_id: uploaded.fileId,
      reviewed_by: req.user.id, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }).eq('id', candidate.id).eq('status', 'pending');
    if (reviewError) {
      await supabase.from('product_images').delete().eq('id', image.id);
      throw new Error('Could not finalize candidate approval.');
    }
    return res.json({ data: { ...image, image_url: mediaProxyUrl(image.file_id) }, status: 'approved' });
  } catch (error) {
    if (uploaded?.messageId) await deleteTelegramMessage(uploaded.messageId);
    console.error('Smart Product Gallery approval failed:', error.message);
    await supabase.from('product_gallery_candidates').update({ status: 'failed', reviewed_by: req.user.id, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', candidate.id).eq('status', 'pending');
    return fail(res, 502, 'Could not add image to Telegram gallery: ' + clean(error.message, 160));
  }
});
app.patch('/api/admin/product-gallery-candidates/:id', authenticate, requireAdmin, async (req, res) => {
  if (clean(req.body.status, 20) !== 'rejected') return fail(res, 400, 'Only rejection is supported.');
  const { data, error } = await supabase.from('product_gallery_candidates').update({
    status: 'rejected', reviewed_by: req.user.id, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }).eq('id', req.params.id).eq('status', 'pending').select().maybeSingle();
  if (error) return fail(res, 500, 'Could not reject candidate.');
  if (!data) return fail(res, 404, 'Pending candidate not found.');
  return res.json({ data });
});

app.get('/api/admin/supplier-update-reviews', authenticate, requireAdmin, async (req, res) => {
  const status = clean(req.query.status || 'pending', 20);
  if (!['pending','approved','rejected','applied','failed','all'].includes(status)) return fail(res, 400, 'Invalid review status.');
  let query = supabase.from('supplier_update_reviews').select('*').order('created_at', { ascending: false }).limit(300);
  if (status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  if (error) return fail(res, 500, 'Could not load supplier update reviews.');
  res.json({ data: data || [] });
});
app.patch('/api/admin/supplier-update-reviews/:id', authenticate, requireAdmin, async (req, res) => {
  const decision = clean(req.body.status, 20);
  if (!['approved','rejected'].includes(decision)) return fail(res, 400, 'Review status must be approved or rejected.');
  const { data: review, error: reviewError } = await supabase.from('supplier_update_reviews')
    .select('*').eq('id', clean(req.params.id, 64)).eq('status', 'pending').maybeSingle();
  if (reviewError) return fail(res, 500, 'Could not load supplier review.');
  if (!review) return fail(res, 404, 'Pending supplier review not found.');
  const now = new Date().toISOString();
  if (decision === 'rejected') {
    const { data, error } = await supabase.from('supplier_update_reviews').update({
      status: 'rejected', reviewed_by: req.user.id, reviewed_at: now, updated_at: now
    }).eq('id', review.id).select().single();
    if (error) return fail(res, 500, 'Could not reject supplier update.');
    return res.json({ data });
  }
  const value = typeof review.new_value === 'number' ? review.new_value : Number(review.new_value);
  if (!Number.isFinite(value) || value < 0) return fail(res, 400, 'The proposed supplier value is invalid.');
  if (Date.now() - new Date(review.created_at).getTime() > 48 * 60 * 60 * 1000) return fail(res, 409, 'This supplier review is older than 48 hours. Run a fresh scan before approving it.');
  if (review.variant_id) {
    const currentField = review.field_name === 'price' ? 'price' : review.field_name === 'stock' ? 'stock' : '';
    if (!currentField) return fail(res, 400, 'Unsupported supplier update field.');
    const { data: currentVariant, error: currentVariantError } = await supabase.from('product_variants')
      .select('id,price,stock').eq('id', review.variant_id).eq('product_id', review.product_id).maybeSingle();
    if (currentVariantError || !currentVariant) return fail(res, 404, 'The linked product variant no longer exists.');
    if (Number(currentVariant[currentField]) !== Number(review.old_value)) return fail(res, 409, 'The product value changed after this review was created. Run a fresh scan before approving.');
    const patch = review.field_name === 'price' ? { price: value } : review.field_name === 'stock' ? { stock: Math.floor(value) } : null;
    if (!patch || (review.field_name === 'stock' && !Number.isInteger(value))) return fail(res, 400, 'Unsupported supplier update field.');
    const { data: variant, error: variantError } = await supabase.from('product_variants')
      .update({ ...patch, updated_at: now }).eq('id', review.variant_id).eq('product_id', review.product_id)
      .select('id,product_id,price,stock').maybeSingle();
    if (variantError || !variant) return fail(res, 500, 'Could not apply the supplier update to this variant.');
    const { data: variants } = await supabase.from('product_variants')
      .select('price,stock,is_active').eq('product_id', review.product_id);
    const active = (variants || []).filter(item => item.is_active);
    if (active.length) await supabase.from('products').update({
      price: Math.min(...active.map(item => Number(item.price)).filter(Number.isFinite)),
      stock: active.some(item => Number(item.stock) > 0) ? 1 : 0,
      updated_at: now
    }).eq('id', review.product_id);
    if (review.field_name === 'price' && Number.isFinite(Number(review.verification?.supplier_price))) {
      await supabase.from('product_supplier_variant_sources').update({
        supplier_price: Number(review.verification.supplier_price),
        supplier_url: review.supplier_url, updated_at: now
      }).eq('variant_id', review.variant_id);
    }
  } else {
    const patch = review.field_name === 'price' ? { price: value } : review.field_name === 'stock' && Number.isInteger(value) ? { stock: value } : null;
    if (!patch) return fail(res, 400, 'Unsupported supplier update field.');
    const { error } = await supabase.from('products').update({ ...patch, updated_at: now }).eq('id', review.product_id);
    if (error) return fail(res, 500, 'Could not apply the supplier update.');
  }
  const { data, error } = await supabase.from('supplier_update_reviews').update({
    status: 'applied', reviewed_by: req.user.id, reviewed_at: now, applied_at: now, updated_at: now
  }).eq('id', review.id).select().single();
  if (error) return fail(res, 500, 'Update applied but review history could not be finalized.');
  res.json({ data });
});
app.post('/api/admin/supplier-auto-sync/run', authenticate, requireAdmin, async (_req, res) => {
  try {
    const result = await runCcComputerAutoSync();
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Manual CC COMPUTER auto-sync failed:', error.message);
    fail(res, 502, 'Supplier auto-sync failed: ' + clean(error.message, 180));
  }
});

// Admin-only supplier product workspace. Supplier metadata never enters publicProduct responses.
app.get('/api/admin/supplier-products', authenticate, requireAdmin, async (_req, res) => {
  const { data: products, error } = await supabase.from('products')
    .select('*,vendors(store_name,status),product_images(id,file_id,image_url,sort_order),product_variants(*)')
    .order('created_at', { ascending: false });
  if (error) return fail(res, 500, 'Could not load supplier products');
  const ids = (products || []).map(product => product.id);
  let sources = [];
  let details = [];
  if (ids.length) {
    const [sourceResult, detailResult] = await Promise.all([
      supabase.from('product_supplier_sources').select('*').in('product_id', ids),
      supabase.from('product_listing_details').select('*').in('product_id', ids)
    ]);
    if (sourceResult.error) return fail(res, 500, 'Could not load supplier metadata');
    if (detailResult.error) return fail(res, 500, 'Could not load product specifications');
    sources = sourceResult.data || [];
    details = detailResult.data || [];
  }
  const variantIds = (products || []).flatMap(product => (product.product_variants || []).map(variant => variant.id));
  let variantSources = [];
  if (variantIds.length) {
    const { data, error: variantSourceError } = await supabase.from('product_supplier_variant_sources')
      .select('*').in('variant_id', variantIds);
    if (variantSourceError) return fail(res, 500, 'Could not load supplier variant metadata');
    variantSources = data || [];
  }
  const sourceById = new Map(sources.map(row => [row.product_id, row]));
  const detailById = new Map(details.map(row => [row.product_id, row]));
  const variantSourceById = new Map(variantSources.map(row => [row.variant_id, row]));
  res.json({ data: (products || []).filter(product => sourceById.has(product.id)).map(product => ({
    ...publicProduct(product),
    supplier_source: sourceById.get(product.id),
    listing_details: detailById.get(product.id) || null,
    product_variants: (product.product_variants || []).map(variant => ({
      ...variant, supplier_source: variantSourceById.get(variant.id) || null
    }))
  })) });
});


function decodeSupplierHtml(value) {
  return String(value || '').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&nbsp;/gi, ' ');
}
function supplierImageCandidates(card, baseUrl) {
  const found = [];
  const tags = card.match(/<img\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const attrs = {};
    for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
      attrs[match[1].toLowerCase()] = decodeSupplierHtml(match[2] ?? match[3] ?? match[4] ?? '');
    }
    const raw = attrs['data-src'] || attrs['data-lazy-src'] || attrs['data-original'] || attrs.src || attrs['data-srcset'] || attrs.srcset || '';
    const selected = raw.includes(',') ? raw.split(',').map(part => part.trim().split(/\s+/)[0]).filter(Boolean).at(-1) : raw;
    if (!selected || /^(data:|blob:)/i.test(selected)) continue;
    try {
      const url = new URL(selected, baseUrl);
      if (url.protocol !== 'https:' || !['cccomputerkh.com','www.cccomputerkh.com','cdn.shopify.com'].includes(url.hostname.toLowerCase())) continue;
      if (!/\.(?:jpe?g|png|webp)(?:[?#]|$)/i.test(url.pathname + url.search)) continue;
      found.push(url.href);
    } catch {}
  }
  return [...new Set(found)];
}
async function fetchSupplierBytes(url, { html = false } = {}) {
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(html ? 15000 : 12000), headers: { 'user-agent': '7inOne-AURORA-SupplierSync/1.0', accept: html ? 'text/html,application/xhtml+xml' : 'image/avif,image/webp,image/png,image/jpeg' } });
  if (!response.ok) throw new Error('Supplier returned HTTP ' + response.status);
  const finalUrl = new URL(response.url);
  if (finalUrl.protocol !== 'https:' || !['cccomputerkh.com','www.cccomputerkh.com','cdn.shopify.com'].includes(finalUrl.hostname.toLowerCase())) throw new Error('Supplier redirected to an untrusted host.');
  const declared = Number(response.headers.get('content-length') || 0);
  const max = html ? 5 * 1024 * 1024 : 8 * 1024 * 1024;
  if (declared > max) throw new Error('Supplier file exceeds the allowed size.');
  const buffer = Buffer.from(await response.arrayBuffer());
  if (!buffer.length || buffer.length > max) throw new Error('Supplier file is empty or too large.');
  return { buffer, contentType: String(response.headers.get('content-type') || '').split(';')[0].toLowerCase() };
}

function supplierPlainText(html) {
  return decodeSupplierHtml(String(html || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<(?:br|\/p|\/li|\/h[1-6]|\/div|\/tr)\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' '))
    .replace(/[ \t]+/g, ' ').replace(/\n\s*/g, '\n').trim();
}
function detectCcSupplierAvailability(cardHtml, plainText) {
  const evidence = (String(plainText || '') + ' ' + String(cardHtml || '')).toLowerCase();
  // Explicit supplier out-of-stock labels always take precedence.
  if (/\b(?:out[\s_-]*of[\s_-]*stock|sold[\s_-]*out|unavailable|not[\s_-]*available|no[\s_-]*stock|stock[\s_-]*unavailable|outofstock|soldout)\b|អស់ស្តុក|គ្មានស្តុក/i.test(evidence)) {
    return 'out_of_stock';
  }
  // A product present in the live supplier catalog with a verified code, price and image
  // is treated as available unless CC COMPUTER explicitly marks it unavailable.
  return 'available';
}
function extractCcSupplierProducts(html, baseUrl) {
  const blocks = [];
  const stack = [];
  const tagPattern = /<(div|li|article)\b[^>]*>|<\/(div|li|article)\s*>/gi;
  for (const match of html.matchAll(tagPattern)) {
    if (match[2]) {
      const tag = match[2].toLowerCase();
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === tag) {
          const opened = stack.splice(i, 1)[0];
          blocks.push({ start: opened.start, end: match.index + match[0].length, html: html.slice(opened.start, match.index + match[0].length) });
          break;
        }
      }
    } else {
      stack.push({ tag: match[1].toLowerCase(), start: match.index });
    }
  }
  const codes = [...html.matchAll(/(?:Code|Product\s*Code)\s*:\s*([A-Z0-9][A-Z0-9_-]{4,})/gi)];
  const results = [];
  const seen = new Set();
  for (const found of codes) {
    const code = String(found[1] || '').toUpperCase();
    if (seen.has(code)) continue;
    seen.add(code);
    const containing = blocks.filter(block => block.start <= found.index && block.end >= found.index && block.html.length <= 40000)
      .sort((a, b) => a.html.length - b.html.length);
    const detailCard = containing.find(block => /\$\s*[\d,]+(?:\.\d{1,2})?/.test(block.html))?.html
      || html.slice(Math.max(0, found.index - 3500), Math.min(html.length, found.index + 1200));
    const imageCard = containing.find(block => /<img\b/i.test(block.html))?.html || detailCard;
    const card = detailCard;
    const text = supplierPlainText(card);
    const parentText = imageCard === card ? text : supplierPlainText(imageCard);
    const priceMatches = [...card.matchAll(/\$\s*([\d,]+(?:\.\d{1,2})?)/g)];
    const supplierPrice = priceMatches.length ? Number(priceMatches[priceMatches.length - 1][1].replace(/,/g, '')) : NaN;
    const headings = [...card.matchAll(/<(?:h1|h2|h3|h4)\b[^>]*>([\s\S]*?)<\/(?:h1|h2|h3|h4)>/gi)]
      .map(item => supplierPlainText(item[1])).filter(Boolean);
    const parentHeadings = imageCard === card ? [] : [...imageCard.matchAll(/<(?:h1|h2|h3|h4)\b[^>]*>([\s\S]*?)<\/(?:h1|h2|h3|h4)>/gi)]
      .map(item => supplierPlainText(item[1])).filter(Boolean);
    const title = headings.find(value => /asus|vivobook|expertbook|zenbook|tuf|rog|msi|acer|lenovo|dell|hp|macbook/i.test(value))
      || parentHeadings.find(value => /asus|vivobook|expertbook|zenbook|tuf|rog|msi|acer|lenovo|dell|hp|macbook/i.test(value))
      || text.split('\n').map(line => line.trim()).find(line => /asus|vivobook|expertbook|zenbook|tuf|rog|msi|acer|lenovo|dell|hp|macbook/i.test(line) && line.length > 5 && line.length < 180)
      || parentText.split('\n').map(line => line.trim()).find(line => /asus|vivobook|expertbook|zenbook|tuf|rog|msi|acer|lenovo|dell|hp|macbook/i.test(line) && line.length > 5 && line.length < 180)
      || headings.find(value => value.length > 4 && value.length < 180 && !/^(?:home|shop|products|category|categories|cart|checkout)$/i.test(value))
      || parentHeadings.find(value => value.length > 4 && value.length < 180 && !/^(?:home|shop|products|category|categories|cart|checkout)$/i.test(value))
      || ''; 
    const specs = text.split('\n').map(line => line.trim()).filter(line => line && !/^(?:Code|Product\s*Code)\s*:/i.test(line) && !/^\$/.test(line) && !/^Free\s*:/i.test(line) && !/^[-_]{3,}$/.test(line));
    const imageUrls = supplierImageCandidates(card, baseUrl).slice(0, 5);
    if (!imageUrls.length) imageUrls.push(...supplierImageCandidates(imageCard, baseUrl).slice(0, 5));
    const searchable = (title + ' ' + text).toLowerCase();
    const identitySearch = (title + ' ' + specs.slice(0, 5).join(' ')).toLowerCase();
    const titleSearch = title.toLowerCase();
    const hasLaptopSpecs = /\b(?:cpu|processor)\s*:/i.test(text) && /\bram\s*:/i.test(text) && /\b(?:display|\d{1,2}(?:\.\d)?[- ]?inch|screen)\b/i.test(text)
      || /\b(?:intel(?:®)?\s+core|amd\s+ryzen)\b/i.test(text) && /\bram\s*:/i.test(text) && /\b\d{1,2}(?:\.\d)?[- ]?inch\b/i.test(text);
    const pickSpec = pattern => specs.find(line => pattern.test(line)) || '';
    const colorLine = pickSpec(/(?:color|colour|ពណ៌)\s*:/i) || specs.find(line => /\b(gentle grey|cool silver|quiet blue|black|white|silver|grey|gray|blue|red|green)\b/i.test(line)) || '';
    const weightLine = pickSpec(/(?:weight|ទម្ងន់)\s*:/i) || specs.find(line => /\b\d+(?:\.\d+)?\s?kg\b/i.test(line)) || '';
    const batteryLine = pickSpec(/(?:battery|ថ្ម)\s*:/i) || specs.find(line => /battery|\b\d+\s?(?:wh|whr|mah|mwh)\b|\d[- ]cell/i.test(line)) || '';
    const color = colorLine.replace(/^(?:color|colour|ពណ៌)\s*:/i, '').trim();
    const weight = weightLine.replace(/^(?:weight|ទម្ងន់)\s*:/i, '').trim();
    const battery = batteryLine.replace(/^(?:battery|ថ្ម)\s*:/i, '').trim();
    let category = 'computers';
    let subcategory = 'other';
    let detailType = 'Computer';
    // Classify the actual product before accessory words in bundle/freebie text.
    if (/\b(laptop bag|notebook bag|computer bag)\b/i.test(titleSearch)) { category = 'computer_accessories'; subcategory = 'bag'; detailType = 'Computer Bag'; }
    else if (/\b(keyboard)\b/i.test(titleSearch)) { category = 'computer_accessories'; subcategory = 'keyboard'; detailType = 'Keyboard'; }
    else if (/\b(mouse|mice)\b/i.test(titleSearch)) { category = 'computer_accessories'; subcategory = 'mouse'; detailType = 'Mouse'; }
    else if (/\b(charger|power adapter|ac adapter)\b/i.test(titleSearch)) { category = 'computer_accessories'; subcategory = 'charger'; detailType = 'Charger'; }
    else if (/\b(cable|usb hub|adapter|dongle)\b/i.test(titleSearch)) { category = 'computer_accessories'; subcategory = 'cable_adapter'; detailType = 'Cable / Adapter'; }
    else if (/\b(laptop|notebook|vivobook|expertbook|zenbook|macbook|thinkpad|rog|strix)\b/i.test(identitySearch) || hasLaptopSpecs) { subcategory = 'laptop'; detailType = 'Laptop'; }
    else if (/\b(all[- ]in[- ]one|aio)\b/i.test(identitySearch)) { subcategory = 'all_in_one'; detailType = 'All-in-One'; }
    else if (/\b(desktop|tower|mini pc|mini computer)\b/i.test(identitySearch)) { subcategory = 'desktop'; detailType = 'Desktop'; }
    else if (/\b(monitor|display screen)\b/i.test(identitySearch)) { subcategory = 'monitor'; detailType = 'Monitor'; }
    let productUrl = baseUrl;
    const links = [...card.matchAll(/<a\b[^>]*href\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi)];
    if (!links.length && imageCard !== card) links.push(...imageCard.matchAll(/<a\b[^>]*href\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi));
    for (const link of links) {
      try {
        const candidate = new URL(decodeSupplierHtml(link[1] || link[2] || link[3] || ''), baseUrl);
        if (candidate.protocol === 'https:' && ['cccomputerkh.com','www.cccomputerkh.com'].includes(candidate.hostname.toLowerCase()) && candidate.pathname !== '/') { productUrl = candidate.href; break; }
      } catch {}
    }
    results.push({
      supplier_product_code: code,
      title: clean(title, 160),
      supplier_price: supplierPrice,
      availability: detectCcSupplierAvailability(card, text),
      selling_price: Number.isFinite(supplierPrice) ? Math.round((supplierPrice + 5) * 100) / 100 : null,
      description: clean(specs.join('\n'), 5000),
      category,
      subcategory,
      detail_type: detailType,
      specifications: {
        cpu_model: specs.find(line => /^-?\s*(?:CPU|Processor)\s*:/i.test(line))?.replace(/^-?\s*(?:CPU|Processor)\s*:/i, '').trim()
          || specs.find(line => /\b(?:Intel(?:®)?\s+Core|AMD\s+Ryzen)\b/i.test(line)) || '',
        ram_type_capacity: (specs.find(line => /^-?\s*RAM\s*:/i.test(line))?.replace(/^-?\s*RAM\s*:/i, '').split(/\s*=\s*/)[0] || '').trim(),
        storage_type_capacity: specs.find(line => /^-?\s*(?:Storage|SSD|HDD)\s*:/i.test(line))?.replace(/^-?\s*(?:Storage|SSD|HDD)\s*:/i, '').trim() || '',
        screen_size: specs.find(line => /display|inch|screen/i.test(line)) || '',
        gpu_model_vram: specs.find(line => /^-?\s*(?:GPU|VGA(?:\s*\d+)?)\s*:/i.test(line))?.replace(/^-?\s*(?:GPU|VGA(?:\s*\d+)?)\s*:/i, '').trim() || '',
        operating_system: specs.find(line => /^-?\s*(?:OS|Operating System)\s*:/i.test(line))?.replace(/^-?\s*(?:OS|Operating System)\s*:/i, '').trim() || '',
        color,
        weight,
        battery,
        full_specs: specs
      },
      supplier_url: productUrl,
      image_urls: imageUrls,
      verified: Boolean(title && Number.isFinite(supplierPrice) && supplierPrice > 0 && imageUrls.length)
    });
  }
  return results;
}
function normalizeSupplierIdentity(value) {
  return String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '');
}
function supplierModelKey(product) {
  return normalizeSupplierIdentity(product?.title || '');
}
function supplierCoreValue(product, key) {
  return String(product?.specifications?.[key] || product?.listing_details?.specifications?.[key] || '').trim();
}
function supplierProductsCompatible(left, right) {
  for (const key of ['cpu_model','gpu_model_vram','screen_size']) {
    const a = normalizeSupplierIdentity(supplierCoreValue(left, key));
    const b = normalizeSupplierIdentity(supplierCoreValue(right, key));
    if (a && b && a !== b) return false;
  }
  return true;
}
function supplierVariantConfigKey(product) {
  const specs = product?.specifications || product?.attributes || product?.listing_details?.specifications || {};
  const ram = normalizeSupplierIdentity(specs.ram_type_capacity || '');
  const storage = normalizeSupplierIdentity(specs.storage_type_capacity || '');
  if (ram || storage) return ram + '|' + storage;
  return normalizeSupplierIdentity(product?.option_value || product?.configuration_label || product?.sku || product?.supplier_product_code || '');
}
function uniqueSupplierConfigurations(variants) {
  const seen = new Set();
  return (variants || []).filter(variant => {
    const key = supplierVariantConfigKey(variant);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function supplierVariantLabel(product) {
  const specs = product?.specifications || {};
  const parts = [specs.ram_type_capacity, specs.storage_type_capacity].filter(Boolean);
  return parts.length ? parts.join(' · ') : (product?.supplier_product_code || 'ជម្រើស');
}
function groupCcSupplierProducts(products) {
  const groups = [];
  for (const product of products || []) {
    const key = supplierModelKey(product) || normalizeSupplierIdentity(product.supplier_product_code);
    let group = groups.find(item => item.model_key === key && supplierProductsCompatible(item.variants[0], product));
    if (!group) {
      group = { ...product, model_key: key, variants: [] };
      groups.push(group);
    }
    group.variants.push(product);
  }
  return groups.map(group => {
    const variants = group.variants.slice().sort((a, b) => String(a.supplier_product_code).localeCompare(String(b.supplier_product_code), undefined, { numeric: true }));
    const prices = variants.map(item => Number(item.selling_price)).filter(Number.isFinite);
    return {
      ...group, variants, variant_count: variants.length,
      supplier_product_code: variants[0]?.supplier_product_code || group.supplier_product_code,
      supplier_price: variants[0]?.supplier_price ?? group.supplier_price,
      selling_price: prices.length ? Math.min(...prices) : group.selling_price,
      image_urls: [...new Set(variants.flatMap(item => item.image_urls || []))].slice(0, 5),
      verified: variants.length > 0 && variants.every(item => item.verified),
      availability: variants.some(item => item.availability !== 'out_of_stock') ? 'available' : 'out_of_stock'
    };
  });
}
async function getAuroraSupplierImportIndex(vendorId) {
  const { data: products, error: productError } = await supabase.from('products')
    .select('id,title,price,stock').eq('vendor_id', vendorId);
  if (productError) throw productError;
  const ids = (products || []).map(item => item.id);
  if (!ids.length) return { products: [], knownCodes: new Set(), variantsByProduct: new Map(), sourcesByProduct: new Map(), detailsByProduct: new Map() };
  const [sourceResult, detailResult, variantResult] = await Promise.all([
    supabase.from('product_supplier_sources').select('product_id,supplier_product_code,supplier_url,supplier_price').eq('supplier_name', 'CC COMPUTER').in('product_id', ids),
    supabase.from('product_listing_details').select('product_id,specifications,category,subcategory,detail_type').in('product_id', ids),
    supabase.from('product_variants').select('id,product_id,sku,option_value,attributes,price,stock,is_active').in('product_id', ids)
  ]);
  if (sourceResult.error || detailResult.error || variantResult.error) throw sourceResult.error || detailResult.error || variantResult.error;
  const variants = variantResult.data || [];
  const variantIds = variants.map(item => item.id);
  let variantSources = [];
  if (variantIds.length) {
    const result = await supabase.from('product_supplier_variant_sources')
      .select('variant_id,supplier_product_code,supplier_url,supplier_price').in('variant_id', variantIds);
    if (result.error) throw result.error;
    variantSources = result.data || [];
  }
  const sourcesByProduct = new Map((sourceResult.data || []).map(item => [String(item.product_id), item]));
  const detailsByProduct = new Map((detailResult.data || []).map(item => [String(item.product_id), item]));
  const variantsByProduct = new Map();
  for (const variant of variants) {
    const key = String(variant.product_id);
    if (!variantsByProduct.has(key)) variantsByProduct.set(key, []);
    variantsByProduct.get(key).push(variant);
  }
  const knownCodes = new Set();
  for (const source of sourceResult.data || []) {
    const code = String(source.supplier_product_code || '').trim().toUpperCase();
    if (code) knownCodes.add(code);
  }
  for (const source of variantSources) {
    const code = String(source.supplier_product_code || '').trim().toUpperCase();
    if (code) knownCodes.add(code);
  }
  const variantSourceById = new Map(variantSources.map(item => [String(item.variant_id), item]));
  return {
    products: (products || []).map(product => ({
      ...product, listing_details: detailsByProduct.get(String(product.id)) || null,
      supplier_source: sourcesByProduct.get(String(product.id)) || null,
      variants: (variantsByProduct.get(String(product.id)) || []).map(variant => ({
        ...variant, supplier_source: variantSourceById.get(String(variant.id)) || null
      }))
    })),
    knownCodes, variantsByProduct, sourcesByProduct, detailsByProduct
  };
}

function supplierCrawlUrl(raw, baseUrl, { preserveHash = false } = {}) {
  try {
    const url = new URL(decodeSupplierHtml(raw || ''), baseUrl);
    if (url.protocol !== 'https:' || !['cccomputerkh.com','www.cccomputerkh.com'].includes(url.hostname.toLowerCase())) return null;
    if (/\.(?:pdf|zip|rar|7z|docx?|xlsx?|pptx?|jpe?g|png|gif|webp|svg|mp4|mp3|css|js|xml)(?:$|[?#])/i.test(url.pathname)) return null;
    if (/\/(?:cart|checkout|my-account|account|login|register|wishlist|compare|wp-admin|wp-json)(?:\/|$)/i.test(url.pathname)) return null;
    for (const key of [...url.searchParams.keys()]) if (/^(?:utm_.+|fbclid|gclid|session|sid|add-to-cart|remove_item|coupon)$/i.test(key)) url.searchParams.delete(key);
    if ([...url.searchParams.keys()].length > 5) return null;
    if (!preserveHash) url.hash = '';
    url.hostname = url.hostname.toLowerCase();
    url.pathname = url.pathname.replace(/\/{2,}/g, '/');
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/$/, '');
    return url.href;
  } catch { return null; }
}
function supplierPageLinks(html, pageUrl) {
  const links = new Set();
  for (const match of String(html || '').matchAll(/<a\b[^>]*href\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi)) {
    const candidate = supplierCrawlUrl(match[1] || match[2] || match[3] || '', pageUrl);
    if (candidate) links.add(candidate);
  }
  return [...links];
}
function mergeSupplierProductRecords(records) {
  const byCode = new Map();
  for (const item of records) {
    const code = String(item.supplier_product_code || '').trim().toUpperCase();
    if (!code) continue;
    const previous = byCode.get(code);
    if (!previous) { byCode.set(code, item); continue; }
    const score = value => (value.title ? 2 : 0) + (value.image_urls?.length ? 2 : 0)
      + Object.values(value.specifications || {}).filter(v => Array.isArray(v) ? v.length : Boolean(v)).length
      + (value.description?.length || 0) / 1000;
    const best = score(item) > score(previous) ? item : previous;
    const other = best === item ? previous : item;
    byCode.set(code, {
      ...other, ...best,
      image_urls: [...new Set([...(best.image_urls || []), ...(other.image_urls || [])])].slice(0, 5),
      specifications: { ...(other.specifications || {}), ...(best.specifications || {}) },
      availability: best.availability === 'out_of_stock' || other.availability === 'out_of_stock' ? 'out_of_stock' : 'available',
      verified: Boolean(best.verified || other.verified)
    });
  }
  return [...byCode.values()];
}

const CC_BRAND_MATCHERS = {
  msi: /\b(?:msi|crosshair|vector|raider|katana|cyborg|stealth|titan|prestige|modern)\b/i,
  dell: /\b(?:dell|latitude|inspiron|xps|precision|alienware|vostro|g-series)\b/i,
  lenovo: /\b(?:lenovo|thinkpad|thinkbook|legion|ideapad|yoga)\b/i
};
function ccBrandMatches(product, brandKey) {
  const matcher = CC_BRAND_MATCHERS[String(brandKey || '').toLowerCase()];
  return Boolean(matcher && matcher.test(String(product?.title || '')));
}
function ccIdentityCheck(scanned, localProduct, localDetails, variant) {
  const scannedModel = supplierModelKey(scanned);
  const localModel = supplierModelKey(localProduct);
  if (!scannedModel || !localModel || scannedModel !== localModel) {
    return { ok: false, reason: 'model_mismatch', scanned_model: scannedModel, local_model: localModel };
  }
  const localSpecs = localDetails?.specifications || {};
  const variantSpecs = variant?.attributes || {};
  const keys = ['cpu_model','gpu_model_vram','screen_size','ram_type_capacity','storage_type_capacity'];
  let comparable = 0;
  for (const key of keys) {
    const supplierValue = normalizeSupplierIdentity(scanned?.specifications?.[key] || '');
    const localValue = normalizeSupplierIdentity(localSpecs[key] || variantSpecs[key] || '');
    if (!supplierValue || !localValue) continue;
    comparable++;
    if (supplierValue !== localValue) return { ok: false, reason: 'specification_mismatch', key, supplier_value: supplierValue, local_value: localValue };
  }
  if (!comparable) return { ok: false, reason: 'no_comparable_identifying_specs' };
  return { ok: true, comparable_specs: comparable };
}
let ccSupplierSyncPromise = null;
async function runCcComputerAutoSync() {
  if (!supabase) return { skipped: true, reason: 'supabase_not_configured' };
  if (ccSupplierSyncPromise) return ccSupplierSyncPromise;
  ccSupplierSyncPromise = (async () => {
    const startedAt = new Date().toISOString();
    const { data: configuredScanSources, error: sourceConfigError } = await supabase.from('supplier_scan_sources')
      .select('*').eq('supplier_name', 'CC COMPUTER').eq('is_active', true).order('brand_key');
    if (sourceConfigError) throw sourceConfigError;
    // Active Admin-configured URLs are valid scan entry points, including
    // brand-section anchors such as /index.html#msi. Never silently discard
    // a configured source because of its path or fragment.
    const scanSources = configuredScanSources || [];
    if (!scanSources.length) {
      return {
        skipped: true,
        reason: configuredScanSources?.length ? 'awaiting_verified_supplier_urls' : 'no_active_scan_sources',
        blocked_placeholder_count: (configuredScanSources || []).length - scanSources.length
      };
    }

    const { data: vendor, error: vendorError } = await supabase.from('vendors')
      .select('id').ilike('store_name', 'AURORA Computer').maybeSingle();
    if (vendorError || !vendor) throw vendorError || new Error('AURORA Computer shop was not found.');

    const { data: sourceRows, error: sourceRowsError } = await supabase.from('product_supplier_variant_sources')
      .select('variant_id,supplier_product_code,supplier_url,supplier_price,last_seen_at,missing_since,last_scan_status')
      .order('updated_at', { ascending: true });
    if (sourceRowsError) throw sourceRowsError;
    const allSources = sourceRows || [];
    const variantIds = allSources.map(row => row.variant_id);
    if (!variantIds.length) return { scanned: 0, updated: 0, review: 0, missing: 0 };

    const { data: variants, error: variantsError } = await supabase.from('product_variants')
      .select('id,product_id,sku,price,stock,is_active,attributes,option_value')
      .in('id', variantIds);
    if (variantsError) throw variantsError;
    const variantById = new Map((variants || []).map(row => [String(row.id), row]));
    const productIds = [...new Set((variants || []).map(row => row.product_id))];
    if (!productIds.length) return { scanned: 0, updated: 0, review: 0, missing: 0 };
    const [{ data: products, error: productsError }, { data: details, error: detailsError }] = await Promise.all([
      supabase.from('products').select('id,title,price,stock,status,vendor_id').eq('vendor_id', vendor.id).in('id', productIds),
      supabase.from('product_listing_details').select('product_id,specifications').in('product_id', productIds)
    ]);
    if (productsError || detailsError) throw productsError || detailsError;
    const productById = new Map((products || []).map(row => [String(row.id), row]));
    const detailsById = new Map((details || []).map(row => [String(row.product_id), row]));
    const tracked = allSources.filter(source => { try { return new URL(source.supplier_url || 'https://cccomputerkh.com/').hostname.toLowerCase().replace(/^www\./, '') === 'cccomputerkh.com'; } catch { return false; } }).map(source => {
      const variant = variantById.get(String(source.variant_id));
      const product = variant ? productById.get(String(variant.product_id)) : null;
      return { source, variant, product, details: product ? detailsById.get(String(product.id)) : null };
    }).filter(row => row.variant && row.product && String(row.source.supplier_product_code || '').trim());

    const catalogCache = new Map();
    const results = { scanned: 0, updated: 0, review: 0, missing: 0, archived: 0, errors: [] };
    for (const config of scanSources) {
      const parsed = new URL(config.source_url);
      const canonicalUrl = parsed.href;
      let catalog = catalogCache.get(canonicalUrl);
      if (!catalog) {
        try {
          catalog = await loadCcSupplierCatalog(config.source_url);
          catalogCache.set(canonicalUrl, catalog);
        } catch (error) {
          results.errors.push({ brand: config.brand_key, error: clean(error.message, 180) });
          await supabase.from('supplier_scan_sources').update({
            last_scan_at: new Date().toISOString(), last_scan_status: 'failed',
            last_scan_error: clean(error.message, 1000), updated_at: new Date().toISOString()
          }).eq('id', config.id);
          continue;
        }
      }
      const brandProducts = (catalog.products || []).filter(item => ccBrandMatches(item, config.brand_key));
      const byCode = new Map(brandProducts.map(item => [String(item.supplier_product_code || '').trim().toUpperCase(), item]));
      const completeScan = !catalog.scan?.failed_pages && !catalog.scan?.page_limit_reached && !catalog.scan?.time_limit_reached;
      results.scanned += brandProducts.length;
      if (!brandProducts.length) {
        const noProductsAt = new Date().toISOString();
        await supabase.from('supplier_scan_sources').update({
          last_scan_at: noProductsAt, last_scan_status: 'no_products_detected',
          last_scan_product_count: 0, last_scan_error: 'No products matched this brand. Missing-product timers were not changed.',
          updated_at: noProductsAt
        }).eq('id', config.id);
        continue;
      }

      // Three independent reads are required before any supplier price/stock change:
      // 1) the full catalog crawl above, 2) a fresh page read, and 3) another fresh page read.
      // Do not reuse cached HTML between verification passes.
      let secondRecords = null;
      let thirdRecords = null;
      try {
        const { buffer } = await fetchSupplierBytes(canonicalUrl, { html: true });
        secondRecords = mergeSupplierProductRecords(extractCcSupplierProducts(buffer.toString('utf8'), canonicalUrl));
      } catch (error) {
        results.errors.push({ brand: config.brand_key, second_read_error: clean(error.message, 180) });
      }
      try {
        const { buffer } = await fetchSupplierBytes(canonicalUrl, { html: true });
        thirdRecords = mergeSupplierProductRecords(extractCcSupplierProducts(buffer.toString('utf8'), canonicalUrl));
      } catch (error) {
        results.errors.push({ brand: config.brand_key, third_read_error: clean(error.message, 180) });
      }
      const secondByCode = new Map((secondRecords || []).filter(item => ccBrandMatches(item, config.brand_key))
        .map(item => [String(item.supplier_product_code || '').trim().toUpperCase(), item]));
      const thirdByCode = new Map((thirdRecords || []).filter(item => ccBrandMatches(item, config.brand_key))
        .map(item => [String(item.supplier_product_code || '').trim().toUpperCase(), item]));
      const brandTracked = tracked.filter(row => ccBrandMatches(row.product, config.brand_key));
      const now = new Date().toISOString();

      for (const row of brandTracked) {
        const code = String(row.source.supplier_product_code || '').trim().toUpperCase();
        const first = byCode.get(code);
        if (!first) {
          if (!completeScan) continue;
          const missingSince = row.source.missing_since || now;
          await supabase.from('product_supplier_variant_sources').update({
            missing_since: missingSince, last_scan_at: now, last_scan_status: 'missing',
            updated_at: now
          }).eq('variant_id', row.variant.id);
          results.missing++;
          if (Date.now() - new Date(missingSince).getTime() >= 14 * 24 * 60 * 60 * 1000) {
            const { error: deactivateError } = await supabase.from('product_variants')
              .update({ is_active: false, stock: 0, updated_at: now }).eq('id', row.variant.id);
            if (deactivateError) { results.errors.push({ code, error: deactivateError.message }); continue; }
            const { data: remaining, error: remainingError } = await supabase.from('product_variants')
              .select('id,is_active').eq('product_id', row.product.id);
            if (remainingError) { results.errors.push({ code, error: remainingError.message }); continue; }
            if (!(remaining || []).some(item => item.is_active)) {
              await supabase.from('products').update({ status: 'archived', stock: 0, updated_at: now })
                .eq('id', row.product.id).in('status', ['active','pending']);
            }
            await supabase.from('product_supplier_variant_sources').update({
              last_scan_status: 'missing_14d', updated_at: now
            }).eq('variant_id', row.variant.id);
            results.archived++;
          }
          continue;
        }

        const firstCodeExact = String(first.supplier_product_code || '').trim().toUpperCase() === code;
        const identity = ccIdentityCheck(first, row.product, row.details, row.variant);
        const second = secondByCode.get(code);
        const third = thirdByCode.get(code);
        const secondCodeExact = Boolean(second && String(second.supplier_product_code || '').trim().toUpperCase() === code);
        const thirdCodeExact = Boolean(third && String(third.supplier_product_code || '').trim().toUpperCase() === code);
        const secondIdentity = second ? ccIdentityCheck(second, row.product, row.details, row.variant) : { ok: false, reason: 'second_read_missing' };
        const thirdIdentity = third ? ccIdentityCheck(third, row.product, row.details, row.variant) : { ok: false, reason: 'third_read_missing' };
        const sameSnapshot = (left, right) => Boolean(left && right
          && Number(left.supplier_price) === Number(right.supplier_price)
          && left.availability === right.availability
          && supplierModelKey(left) === supplierModelKey(right));
        const firstSecondMatch = sameSnapshot(first, second);
        const firstThirdMatch = sameSnapshot(first, third);
        const secondThirdMatch = sameSnapshot(second, third);
        const allThreeSnapshotsMatch = firstSecondMatch && firstThirdMatch && secondThirdMatch;
        const verification = {
          exact_product_code: firstCodeExact,
          model_and_specs: identity,
          second_read: {
            exact_product_code: secondCodeExact, identity: secondIdentity,
            same_price_and_stock_as_first: firstSecondMatch
          },
          third_read: {
            exact_product_code: thirdCodeExact, identity: thirdIdentity,
            same_price_and_stock_as_first: firstThirdMatch
          },
          all_three_reads_match: allThreeSnapshotsMatch,
          supplier_price: Number(first.supplier_price), supplier_availability: first.availability,
          checked_at: now
        };
        const allPassed = Boolean(
          first.verified && second?.verified && third?.verified &&
          firstCodeExact && identity.ok &&
          secondCodeExact && secondIdentity.ok &&
          thirdCodeExact && thirdIdentity.ok &&
          allThreeSnapshotsMatch
        );
        if (!allPassed) {
          const changes = [];
          const newSellingPrice = Number.isFinite(Number(first.supplier_price)) ? Math.round((Number(first.supplier_price) + 5) * 100) / 100 : null;
          const newStock = first.availability === 'out_of_stock' ? 0 : 1;
          if (newSellingPrice !== null && Number(row.variant.price) !== newSellingPrice) changes.push({ field_name: 'price', old_value: row.variant.price, new_value: newSellingPrice });
          if (Number(row.variant.stock) !== newStock) changes.push({ field_name: 'stock', old_value: row.variant.stock, new_value: newStock });
          for (const change of changes) {
            const { data: pendingReview, error: pendingReviewError } = await supabase.from('supplier_update_reviews')
              .select('id').eq('status', 'pending').eq('variant_id', row.variant.id)
              .eq('field_name', change.field_name).limit(1);
            if (pendingReviewError) { results.errors.push({ code, review_lookup_error: pendingReviewError.message }); continue; }
            if (pendingReview?.length) continue;
            const { error } = await supabase.from('supplier_update_reviews').insert({
              supplier_name: 'CC COMPUTER', product_id: row.product.id, variant_id: row.variant.id,
              supplier_product_code: code, supplier_url: config.source_url,
              field_name: change.field_name, old_value: change.old_value, new_value: change.new_value,
              verification, status: 'pending'
            });
            if (error) results.errors.push({ code, review_error: error.message });
            else results.review++;
          }
          await supabase.from('product_supplier_variant_sources').update({
            last_scan_at: now, last_scan_status: 'needs_review', updated_at: now
          }).eq('variant_id', row.variant.id);
          continue;
        }

        const supplierPrice = Number(first.supplier_price);
        const sellingPrice = Math.round((supplierPrice + 5) * 100) / 100;
        const stock = first.availability === 'out_of_stock' ? 0 : 1;
        const changes = [];
        if (Number(row.variant.price) !== sellingPrice) changes.push({ field_name: 'price', old_value: row.variant.price, new_value: sellingPrice });
        if (Number(row.variant.stock) !== stock) changes.push({ field_name: 'stock', old_value: row.variant.stock, new_value: stock });
        if (changes.length) {
          const { error: updateError } = await supabase.from('product_variants').update({
            price: sellingPrice, stock, updated_at: now
          }).eq('id', row.variant.id);
          if (updateError) { results.errors.push({ code, update_error: updateError.message }); continue; }
          results.updated++;
          for (const change of changes) {
            const { error } = await supabase.from('supplier_update_reviews').insert({
              supplier_name: 'CC COMPUTER', product_id: row.product.id, variant_id: row.variant.id,
              supplier_product_code: code, supplier_url: config.source_url,
              field_name: change.field_name, old_value: change.old_value, new_value: change.new_value,
              verification, status: 'applied', applied_at: now
            });
            if (error) results.errors.push({ code, audit_error: error.message });
          }
          const { data: activeVariants } = await supabase.from('product_variants')
            .select('price,stock,is_active').eq('product_id', row.product.id);
          const visibleVariants = (activeVariants || []).filter(item => item.is_active);
          if (visibleVariants.length) {
            await supabase.from('products').update({
              price: Math.min(...visibleVariants.map(item => Number(item.price)).filter(Number.isFinite)),
              stock: visibleVariants.some(item => Number(item.stock) > 0) ? 1 : 0,
              updated_at: now
            }).eq('id', row.product.id);
          }
        }
        await supabase.from('product_supplier_variant_sources').update({
          supplier_price: supplierPrice, supplier_url: config.source_url,
          last_seen_at: now, missing_since: null, last_scan_at: now,
          last_scan_status: 'present', updated_at: now
        }).eq('variant_id', row.variant.id);
      }

      await supabase.from('supplier_scan_sources').update({
        last_scan_at: now,
        last_scan_status: completeScan ? 'success' : 'partial',
        last_scan_product_count: brandProducts.length,
        last_scan_error: catalog.scan?.failed_pages ? JSON.stringify(catalog.scan.warnings || []) : '',
        updated_at: now
      }).eq('id', config.id);
    }
    console.log('CC COMPUTER supplier auto-sync completed:', { startedAt, ...results });
    return results;
  })().catch(error => {
    console.error('CC COMPUTER supplier auto-sync failed:', error.message);
    throw error;
  }).finally(() => { ccSupplierSyncPromise = null; });
  return ccSupplierSyncPromise;
}

async function loadCcSupplierCatalog(url) {
  let parsed;
  try { parsed = new URL(url); } catch { throw new Error('Invalid supplier URL.'); }
  if (parsed.protocol !== 'https:' || !['cccomputerkh.com','www.cccomputerkh.com'].includes(parsed.hostname.toLowerCase())) throw new Error('Only the verified CC COMPUTER website is allowed.');
  parsed.hash = '';
  // Preserve the Admin-provided fragment on the seed URL. The fetch request
  // still reads the page document; the fragment remains part of the source
  // context and is not treated as a reason to block or replace the URL.
  const startUrl = supplierCrawlUrl(parsed.href, parsed.href, { preserveHash: true });
  if (!startUrl) throw new Error('The supplied URL is not a valid CC COMPUTER page.');
  const pending = [startUrl];
  const queued = new Set(pending);
  const visited = new Set();
  const records = [];
  const errors = [];
  const MAX_PAGES = 250;
  const MAX_DURATION_MS = 105000;
  const startedAt = Date.now();
  while (pending.length && visited.size < MAX_PAGES && Date.now() - startedAt < MAX_DURATION_MS) {
    const batch = pending.splice(0, 4).filter(page => !visited.has(page));
    if (!batch.length) continue;
    for (const page of batch) visited.add(page);
    const results = await Promise.all(batch.map(async page => {
      try {
        const { buffer, contentType } = await fetchSupplierBytes(page, { html: true });
        if (contentType && !/(?:text\/html|application\/xhtml\+xml)/i.test(contentType)) return { page, html: '', error: 'non_html' };
        return { page, html: buffer.toString('utf8') };
      } catch (error) { return { page, html: '', error: clean(error.message, 120) }; }
    }));
    for (const result of results) {
      if (result.error) {
        errors.push({ url: result.page, reason: result.error });
        if (result.page === startUrl && !records.length) throw new Error('Could not load the supplied supplier page: ' + result.error);
        continue;
      }
      records.push(...extractCcSupplierProducts(result.html, result.page));
      for (const link of supplierPageLinks(result.html, result.page)) {
        if (!queued.has(link) && !visited.has(link) && queued.size < 1500) {
          queued.add(link);
          pending.push(link);
        }
      }
    }
  }
  const products = mergeSupplierProductRecords(records);
  if (!visited.size) throw new Error('No supplier pages could be scanned.');
  return {
    url: startUrl, products,
    scan: {
      pages_scanned: visited.size, pages_discovered: queued.size, pages_remaining: pending.length,
      page_limit_reached: visited.size >= MAX_PAGES && pending.length > 0,
      time_limit_reached: Date.now() - startedAt >= MAX_DURATION_MS && pending.length > 0,
      failed_pages: errors.length, warnings: errors.slice(0, 12)
    }
  };
}

app.post('/api/admin/supplier-import/scan', authenticate, requireAdmin, async (req, res) => {
  if (!supabase) return fail(res, 503, 'Supabase is not configured.');
  try {
    const { url, products: scannedProducts, scan } = await loadCcSupplierCatalog(clean(req.body.url, 1000));
    const groupedProducts = groupCcSupplierProducts(scannedProducts);
    const requestedOffset = Math.max(0, Number.parseInt(req.body.offset, 10) || 0);
    const isSingleProductUrl = groupedProducts.length <= 1;
    const batchSize = isSingleProductUrl ? 1 : 10;
    const batch = groupedProducts.slice(requestedOffset, requestedOffset + batchSize);
    const { data: vendor, error: vendorError } = await supabase.from('vendors').select('id').ilike('store_name', 'AURORA Computer').maybeSingle();
    if (vendorError || !vendor) return fail(res, 404, 'AURORA Computer shop was not found.');
    const index = await getAuroraSupplierImportIndex(vendor.id);
    const data = batch.map(group => {
      const titleKey = supplierModelKey(group);
      const titleMatches = index.products.filter(item => supplierModelKey(item) === titleKey);
      const existingProduct = titleMatches.find(item => supplierProductsCompatible(group, item)) || null;
      const conflictingTitle = titleMatches.length > 0 && !existingProduct;
      const existingConfigKeys = new Set();
      const parentCode = String(existingProduct?.supplier_source?.supplier_product_code || '').trim().toUpperCase();
      const parentVariantRepresented = Boolean(existingProduct && parentCode && (existingProduct.variants || []).some(variant =>
        String(variant.sku || '').trim().toUpperCase() === parentCode
        || String(variant.supplier_source?.supplier_product_code || '').trim().toUpperCase() === parentCode
      ));
      const parentVariantMissing = Boolean(existingProduct && parentCode && !parentVariantRepresented);
      if (existingProduct) {
        const details = existingProduct.listing_details?.specifications || {};
        if (parentCode && !parentVariantMissing) existingConfigKeys.add(supplierVariantConfigKey({ specifications: details, supplier_product_code: parentCode }));
        for (const variant of existingProduct.variants || []) existingConfigKeys.add(supplierVariantConfigKey(variant));
      }
      const uniqueGroupVariants = uniqueSupplierConfigurations(group.variants);
      const newVariants = uniqueGroupVariants.filter(variant => {
        const variantCode = String(variant.supplier_product_code || '').trim().toUpperCase();
        const migratingParentVariant = parentVariantMissing && variantCode === parentCode;
        if (!variantCode || (index.knownCodes.has(variantCode) && !migratingParentVariant)) return false;
        return !existingConfigKeys.has(supplierVariantConfigKey(variant));
      });
      const codeConflicts = group.variants.some(variant => {
        const variantCode = String(variant.supplier_product_code || '').trim().toUpperCase();
        return variantCode && index.knownCodes.has(variantCode) && !existingProduct;
      });
      const status = conflictingTitle || codeConflicts ? 'needs_review' : !newVariants.length ? 'duplicate' : existingProduct ? 'update_existing' : group.verified ? 'ready' : 'needs_review';
      const seenGroupConfigurations = new Set();
      return {
        ...group, duplicate: status === 'duplicate', status,
        existing_product_id: existingProduct?.id || null,
        new_variant_count: newVariants.length,
        variants: group.variants.map(variant => {
          const configKey = supplierVariantConfigKey(variant);
          const duplicateConfiguration = seenGroupConfigurations.has(configKey);
          seenGroupConfigurations.add(configKey);
          return {
            ...variant,
            duplicate_configuration: duplicateConfiguration,
            already_imported: duplicateConfiguration
              || (index.knownCodes.has(String(variant.supplier_product_code || '').trim().toUpperCase())
                && !(parentVariantMissing && String(variant.supplier_product_code || '').trim().toUpperCase() === parentCode))
              || existingConfigKeys.has(configKey)
          };
        })
      };
    });
    res.json({
      data,
      scan,
      pagination: { offset: requestedOffset, limit: batchSize, total: groupedProducts.length, next_offset: requestedOffset + data.length, has_more: !isSingleProductUrl && requestedOffset + data.length < groupedProducts.length, single_product: isSingleProductUrl },
      summary: {
        total: groupedProducts.length, batch: data.length,
        ready: data.filter(item => item.status === 'ready').length,
        update_existing: data.filter(item => item.status === 'update_existing').length,
        duplicate: data.filter(item => item.status === 'duplicate').length,
        needs_review: data.filter(item => item.status === 'needs_review').length
      }
    });
  } catch (error) {
    console.error('CC COMPUTER supplier scan failed:', error.message);
    return fail(res, 502, 'Could not scan supplier catalog: ' + clean(error.message, 180));
  }
});
app.post('/api/admin/supplier-import/import', authenticate, requireAdmin, async (req, res) => {
  if (!supabase) return fail(res, 503, 'Supabase is not configured.');
  const code = clean(req.body.supplier_product_code, 120).toUpperCase();
  const catalogUrl = clean(req.body.catalog_url, 1000);
  const expectedPrice = Number(req.body.expected_supplier_price);
  const uploaded = [];
  const createdVariantIds = [];
  let createdProductId = null;
  let createdParentSource = false;
  let createdParentSourceProductId = null;
  let createdImageRows = false;
  let createdImageProductId = null;
  let existingProductSnapshot = null;
  try {
    if (!code || !Number.isFinite(expectedPrice) || expectedPrice <= 0) return fail(res, 400, 'Missing verified product code or supplier price.');
    const { url, products } = await loadCcSupplierCatalog(catalogUrl);
    const group = groupCcSupplierProducts(products).find(item => item.variants.some(variant => variant.supplier_product_code === code));
    const selectedVariant = group?.variants.find(variant => variant.supplier_product_code === code);
    if (!group || !selectedVariant || !group.verified || selectedVariant.supplier_price !== expectedPrice) {
      return fail(res, 409, 'Supplier details changed or could not be verified. Scan the catalog again.');
    }
    const { data: vendor, error: vendorError } = await supabase.from('vendors').select('id').ilike('store_name', 'AURORA Computer').maybeSingle();
    if (vendorError || !vendor) return fail(res, 404, 'AURORA Computer shop was not found.');
    const index = await getAuroraSupplierImportIndex(vendor.id);
    const titleKey = supplierModelKey(group);
    const titleMatches = index.products.filter(item => supplierModelKey(item) === titleKey);
    const existingProduct = titleMatches.find(item => supplierProductsCompatible(group, item)) || null;
    if (existingProduct) existingProductSnapshot = {
      id: existingProduct.id,
      price: existingProduct.price,
      listing_details: existingProduct.listing_details,
      supplier_source: existingProduct.supplier_source
    };
    if (titleMatches.length && !existingProduct) return fail(res, 409, 'A similar product title exists with different core specifications. Admin review is required.');
    const existingConfigKeys = new Set();
    const existingParentCode = String(existingProduct?.supplier_source?.supplier_product_code || '').trim().toUpperCase();
    const parentVariantRepresented = Boolean(existingProduct && existingParentCode && (existingProduct.variants || []).some(variant =>
      String(variant.sku || '').trim().toUpperCase() === existingParentCode
      || String(variant.supplier_source?.supplier_product_code || '').trim().toUpperCase() === existingParentCode
    ));
    const parentVariantMissing = Boolean(existingProduct && existingParentCode && !parentVariantRepresented);
    if (existingProduct) {
      const details = existingProduct.listing_details?.specifications || {};
      if (existingParentCode && !parentVariantMissing) existingConfigKeys.add(supplierVariantConfigKey({ specifications: details, supplier_product_code: existingParentCode }));
      for (const variant of existingProduct.variants || []) existingConfigKeys.add(supplierVariantConfigKey(variant));
    }
    const variantsToAdd = uniqueSupplierConfigurations(group.variants).filter(variant => {
      const variantCode = String(variant.supplier_product_code || '').trim().toUpperCase();
      const migratingParentVariant = parentVariantMissing && variantCode === existingParentCode;
      if (!variantCode || (index.knownCodes.has(variantCode) && !migratingParentVariant)) return false;
      return !existingConfigKeys.has(supplierVariantConfigKey(variant));
    });
    const codeConflict = group.variants.some(variant => {
      const variantCode = String(variant.supplier_product_code || '').trim().toUpperCase();
      return variantCode && index.knownCodes.has(variantCode) && !existingProduct;
    });
    if (codeConflict) return fail(res, 409, 'One or more supplier product codes are already linked to another product.');
    if (!variantsToAdd.length) {
      if (existingProduct) {
        const parentAvailability = group.variants.some(item => item.availability !== 'out_of_stock') ? 1 : 0;
        const { error: parentStockError } = await supabase.from('products')
          .update({ stock: parentAvailability, updated_at: new Date().toISOString() }).eq('id', existingProduct.id);
        if (parentStockError) throw parentStockError;
        for (const variant of group.variants) {
          const supplierCode = String(variant.supplier_product_code || '').trim().toUpperCase();
          const existingVariant = (existingProduct.variants || []).find(item =>
            String(item.sku || '').trim().toUpperCase() === supplierCode
            || String(item.supplier_source?.supplier_product_code || '').trim().toUpperCase() === supplierCode
          );
          if (existingVariant) {
            const { error: variantStockError } = await supabase.from('product_variants')
              .update({ stock: variant.availability === 'out_of_stock' ? 0 : 1, updated_at: new Date().toISOString() })
              .eq('id', existingVariant.id);
            if (variantStockError) throw variantStockError;
          }
        }
        return res.json({ success: true, data: {
          id: existingProduct.id, title: group.title, existing_product: true,
          created_variants: 0, total_variants: (existingProduct.variants || []).length,
          availability_updated: true, availability: parentAvailability ? 'available' : 'out_of_stock'
        } });
      }
      return fail(res, 409, 'All configurations for this product have already been imported.');
    }
    const productId = existingProduct?.id || null;
    let targetProductId = productId;
    if (!targetProductId) {
      const allPrices = group.variants.map(item => Number(item.selling_price)).filter(Number.isFinite);
      if (!allPrices.length) return fail(res, 409, 'No valid variant price was found.');
      const { data: created, error: createError } = await supabase.from('products').insert({
        vendor_id: vendor.id, title: group.title, description: group.description,
        category: group.category || 'other', price: Math.min(...allPrices),
        stock: group.variants.some(item => item.availability !== 'out_of_stock') ? 1 : 0,
        location: 'Cambodia', condition: 'ថ្មី', status: 'active', renewed_at: new Date().toISOString()
      }).select().single();
      if (createError) throw createError;
      targetProductId = created.id;
      createdProductId = targetProductId;
      const ramValues = new Set(group.variants.map(item => normalizeSupplierIdentity(item.specifications?.ram_type_capacity)).filter(Boolean));
      const storageValues = new Set(group.variants.map(item => normalizeSupplierIdentity(item.specifications?.storage_type_capacity)).filter(Boolean));
      const commonSpecs = { ...(group.specifications || {}) };
      if (ramValues.size > 1) delete commonSpecs.ram_type_capacity;
      if (storageValues.size > 1) delete commonSpecs.storage_type_capacity;
      const { error: detailsError } = await supabase.from('product_listing_details').upsert({
        product_id: targetProductId, category: group.category || 'other', subcategory: group.subcategory || 'other',
        detail_type: group.detail_type || 'Other', specifications: commonSpecs, updated_at: new Date().toISOString()
      }, { onConflict: 'product_id' });
      if (detailsError) throw detailsError;
    }
    if (existingProduct) {
      const ramValues = new Set(group.variants.map(item => normalizeSupplierIdentity(item.specifications?.ram_type_capacity)).filter(Boolean));
      const storageValues = new Set(group.variants.map(item => normalizeSupplierIdentity(item.specifications?.storage_type_capacity)).filter(Boolean));
      const commonSpecs = { ...(existingProduct.listing_details?.specifications || {}), ...(group.specifications || {}) };
      if (ramValues.size > 1) delete commonSpecs.ram_type_capacity;
      if (storageValues.size > 1) delete commonSpecs.storage_type_capacity;
      const { error: detailsError } = await supabase.from('product_listing_details').upsert({
        product_id: targetProductId, category: group.category || 'other', subcategory: group.subcategory || 'other',
        detail_type: group.detail_type || 'Other', specifications: commonSpecs, updated_at: new Date().toISOString()
      }, { onConflict: 'product_id' });
      if (detailsError) throw detailsError;
    }
    if (!existingProduct?.supplier_source) {
      const primary = group.variants[0];
      const { error: sourceError } = await supabase.from('product_supplier_sources').insert({
        product_id: targetProductId, supplier_name: 'CC COMPUTER', supplier_url: primary.supplier_url || url,
        supplier_price: primary.supplier_price, supplier_product_code: primary.supplier_product_code,
        notes: 'One supplier model with configuration variants. Variant-level codes and prices are stored separately. Retail price = supplier price + $5.'
      });
      if (sourceError) throw sourceError;
      createdParentSource = true;
      createdParentSourceProductId = targetProductId;
    }
    if (existingProduct?.supplier_source && existingParentCode) {
      const parentVariant = group.variants.find(item => String(item.supplier_product_code || '').trim().toUpperCase() === existingParentCode);
      if (parentVariant) {
        const { error: parentSourceUpdateError } = await supabase.from('product_supplier_sources').update({
          supplier_url: parentVariant.supplier_url || url,
          supplier_price: parentVariant.supplier_price,
          updated_at: new Date().toISOString()
        }).eq('product_id', targetProductId);
        if (parentSourceUpdateError) throw parentSourceUpdateError;
      }
    }
    for (const variant of variantsToAdd) {
      const optionValue = supplierVariantLabel(variant);
      const attributes = {
        ram_type_capacity: variant.specifications?.ram_type_capacity || '',
        storage_type_capacity: variant.specifications?.storage_type_capacity || '',
        configuration_label: optionValue
      };
      const { data: createdVariant, error: variantError } = await supabase.from('product_variants').insert({
        product_id: targetProductId, sku: variant.supplier_product_code,
        option_name: 'RAM / Storage', option_value: optionValue,
        price: variant.selling_price,
        stock: variant.availability === 'out_of_stock' ? 0 : 1,
        attributes, is_active: true,
        sort_order: group.variants.indexOf(variant), updated_at: new Date().toISOString()
      }).select().single();
      if (variantError) throw variantError;
      createdVariantIds.push(createdVariant.id);
      const { error: variantSourceError } = await supabase.from('product_supplier_variant_sources').insert({
        variant_id: createdVariant.id, supplier_price: variant.supplier_price,
        supplier_product_code: variant.supplier_product_code,
        supplier_url: variant.supplier_url || url, updated_at: new Date().toISOString()
      });
      if (variantSourceError) throw variantSourceError;
    }
    const currentPrices = (existingProduct?.variants || []).map(item => Number(item.price)).filter(Number.isFinite);
    const allPrices = currentPrices.concat(group.variants.map(item => Number(item.selling_price)).filter(Number.isFinite));
    if (allPrices.length) {
      const { error: priceError } = await supabase.from('products').update({ price: Math.min(...allPrices), updated_at: new Date().toISOString() }).eq('id', targetProductId);
      if (priceError) throw priceError;
    }
    const { data: existingImages, error: existingImagesError } = await supabase.from('product_images').select('id').eq('product_id', targetProductId).limit(1);
    if (existingImagesError) throw existingImagesError;
    if (!(existingImages || []).length) {
      const imageUrls = group.image_urls?.length ? group.image_urls : selectedVariant.image_urls || [];
      for (const [imageIndex, imageUrl] of imageUrls.slice(0, 5).entries()) {
        const { buffer, contentType } = await fetchSupplierBytes(imageUrl);
        const extByMime = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
        if (!extByMime[contentType]) continue;
        const file = { buffer, mimetype: contentType, originalname: code.replace(/[^a-z0-9_-]/gi, '_') + '-' + (imageIndex + 1) + '.' + extByMime[contentType], size: buffer.length };
        const invalid = imageUploadError(file, 8 * 1024 * 1024);
        if (invalid) continue;
        uploaded.push(await uploadToTelegram(file, 8 * 1024 * 1024));
      }
      if (!uploaded.length) throw new Error('No valid product images could be uploaded to Telegram.');
      const imageRows = uploaded.map((media, imageIndex) => ({
        product_id: targetProductId, telegram_message_id: media.messageId, file_id: media.fileId,
        image_url: mediaProxyUrl(media.fileId), sort_order: imageIndex
      }));
      const { error: imageError } = await supabase.from('product_images').insert(imageRows);
      if (imageError) throw imageError;
      createdImageRows = true;
      createdImageProductId = targetProductId;
    }
    // Parent availability reflects whether at least one supplier configuration is available.
    const parentAvailability = group.variants.some(item => item.availability !== 'out_of_stock') ? 1 : 0;
    const { error: availabilityError } = await supabase.from('products')
      .update({ stock: parentAvailability, updated_at: new Date().toISOString() })
      .eq('id', targetProductId);
    if (availabilityError) throw availabilityError;
    // Refresh stock state for already-imported variants from the current supplier page.
    for (const variant of group.variants) {
      const supplierCode = String(variant.supplier_product_code || '').trim().toUpperCase();
      const existingVariant = (existingProduct?.variants || []).find(item =>
        String(item.sku || '').trim().toUpperCase() === supplierCode
        || String(item.supplier_source?.supplier_product_code || '').trim().toUpperCase() === supplierCode
      );
      if (existingVariant) {
        const { error: variantAvailabilityError } = await supabase.from('product_variants')
          .update({ stock: variant.availability === 'out_of_stock' ? 0 : 1, updated_at: new Date().toISOString() })
          .eq('id', existingVariant.id);
        if (variantAvailabilityError) throw variantAvailabilityError;
      }
    }
    res.status(201).json({
      success: true,
      data: {
        id: targetProductId, title: group.title, existing_product: Boolean(existingProduct),
        created_variants: createdVariantIds.length,
        total_variants: (existingProduct?.variants?.length || 0) + createdVariantIds.length,
        supplier_codes: variantsToAdd.map(item => item.supplier_product_code),
        selling_price_from: Math.min(...group.variants.map(item => Number(item.selling_price)).filter(Number.isFinite)),
        images_uploaded: uploaded.length
      }
    });
  } catch (error) {
    for (const media of uploaded) await deleteTelegramMessage(media.messageId);
    if (createdImageRows && createdImageProductId) await supabase.from('product_images').delete().eq('product_id', createdImageProductId);
    if (createdVariantIds.length) {
      await supabase.from('product_supplier_variant_sources').delete().in('variant_id', createdVariantIds);
      await supabase.from('product_variants').delete().in('id', createdVariantIds);
    }
    if (createdProductId) {
      await supabase.from('product_listing_details').delete().eq('product_id', createdProductId);
      await supabase.from('product_supplier_sources').delete().eq('product_id', createdProductId);
      await supabase.from('products').delete().eq('id', createdProductId);
    } else if (existingProductSnapshot) {
      await supabase.from('products').update({ price: existingProductSnapshot.price, updated_at: new Date().toISOString() }).eq('id', existingProductSnapshot.id);
      if (existingProductSnapshot.listing_details) {
        await supabase.from('product_listing_details').upsert(existingProductSnapshot.listing_details, { onConflict: 'product_id' });
      } else {
        await supabase.from('product_listing_details').delete().eq('product_id', existingProductSnapshot.id);
      }
      if (existingProductSnapshot.supplier_source && !createdParentSource) {
        const source = existingProductSnapshot.supplier_source;
        await supabase.from('product_supplier_sources').update({
          supplier_name: source.supplier_name, supplier_url: source.supplier_url,
          supplier_price: source.supplier_price, supplier_product_code: source.supplier_product_code,
          notes: source.notes, updated_at: source.updated_at
        }).eq('product_id', existingProductSnapshot.id);
      } else if (createdParentSource && createdParentSourceProductId) {
        await supabase.from('product_supplier_sources').delete().eq('product_id', createdParentSourceProductId);
      }
    } else if (createdParentSource && createdParentSourceProductId) {
      await supabase.from('product_supplier_sources').delete().eq('product_id', createdParentSourceProductId);
    }
    console.error('CC COMPUTER supplier import failed:', error.message);
    return fail(res, 502, 'Supplier import failed: ' + clean(error.message, 180));
  }
});

app.post('/api/admin/supplier-products/:id/sync-images', authenticate, requireAdmin, async (req, res) => {
  if (!supabase) return fail(res, 503, 'Supabase is not configured.');
  const productId = clean(req.params.id, 64);
  const uploaded = [];
  try {
    const { data: product, error: productError } = await supabase.from('products')
      .select('id,vendor_id,vendors!inner(store_name)').eq('id', productId).maybeSingle();
    if (productError || !product) return fail(res, 404, 'Product not found.');
    if (String(product.vendors?.store_name || '').trim().toLowerCase() !== 'aurora computer') return fail(res, 403, 'Supplier image sync is limited to AURORA products.');
    const { data: source, error: sourceError } = await supabase.from('product_supplier_sources')
      .select('supplier_name,supplier_url,supplier_product_code').eq('product_id', productId).maybeSingle();
    if (sourceError || !source) return fail(res, 404, 'Supplier information not found.');
    if (String(source.supplier_name || '').trim().toLowerCase() !== 'cc computer') return fail(res, 400, 'This supplier is not supported yet.');
    const sku = clean(source.supplier_product_code, 120);
    if (!sku) return fail(res, 400, 'Supplier product code is required.');
    let supplierUrl;
    try { supplierUrl = new URL(source.supplier_url || 'https://www.cccomputerkh.com/'); } catch { return fail(res, 400, 'Invalid supplier URL.'); }
    if (supplierUrl.protocol !== 'https:' || !['cccomputerkh.com','www.cccomputerkh.com'].includes(supplierUrl.hostname.toLowerCase())) return fail(res, 400, 'Only the verified CC COMPUTER website is allowed.');
    supplierUrl.hash = '';
    const { count: existingCount, error: countError } = await supabase.from('product_images')
      .select('id', { count: 'exact', head: true }).eq('product_id', productId);
    if (countError) throw countError;
    if ((existingCount || 0) > 0) return fail(res, 409, 'This product already has images. Remove them first if you want to sync again.');
    const { buffer: pageBuffer } = await fetchSupplierBytes(supplierUrl.href, { html: true });
    const html = pageBuffer.toString('utf8');
    const escapedSku = sku.replace(/[.*+?^()|[\]\\$]/g, '\\$&');
    const cardPattern = /<li\b[^>]*class\s*=\s*["'][^"']*(?:product|item)[^"']*["'][^>]*>[\s\S]*?<\/li>/gi;
    const cards = html.match(cardPattern) || [];
    const matchingCard = cards.find(card => new RegExp(escapedSku, 'i').test(card));
    if (!matchingCard) return fail(res, 422, 'Could not locate this product code in a supplier product card. No images were uploaded.');
    const imageUrls = supplierImageCandidates(matchingCard, supplierUrl.href).slice(0, 5);
    if (!imageUrls.length) return fail(res, 422, 'The matching supplier product was found, but it has no supported image URL.');
    if (imageUrls.length > 10) return fail(res, 400, 'Product image limit is 10.');
    for (const [index, imageUrl] of imageUrls.entries()) {
      const { buffer, contentType } = await fetchSupplierBytes(imageUrl);
      const extByMime = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
      if (!extByMime[contentType]) throw new Error('Supplier image has an unsupported content type.');
      const file = { buffer, mimetype: contentType, originalname: sku.replace(/[^a-z0-9_-]/gi, '_') + '-' + (index + 1) + '.' + extByMime[contentType], size: buffer.length };
      const invalid = imageUploadError(file, 8 * 1024 * 1024);
      if (invalid) throw new Error(invalid);
      uploaded.push(await uploadToTelegram(file, 8 * 1024 * 1024));
    }
    const { count: currentCount, error: currentError } = await supabase.from('product_images').select('id', { count: 'exact', head: true }).eq('product_id', productId);
    if (currentError) throw currentError;
    if ((currentCount || 0) + uploaded.length > 10) throw new Error('Product image limit is 10.');
    const rows = uploaded.map((media, index) => ({
      product_id: productId, telegram_message_id: media.messageId, file_id: media.fileId,
      image_url: mediaProxyUrl(media.fileId), sort_order: (currentCount || 0) + index
    }));
    const { data, error } = await supabase.from('product_images').insert(rows)
      .select('id,product_id,file_id,telegram_message_id,image_url,sort_order');
    if (error) throw error;
    return res.status(201).json({ success: true, count: data.length, data: data.map(image => ({
      id: image.id, product_id: image.product_id, sort_order: image.sort_order,
      image_url: image.file_id ? mediaProxyUrl(image.file_id) : normalizeMediaUrl(image.image_url)
    })) });
  } catch (error) {
    for (const media of uploaded) await deleteTelegramMessage(media.messageId);
    console.error('AURORA supplier image sync failed:', error.message);
    return fail(res, 502, 'Supplier image sync failed: ' + clean(error.message, 220));
  }
});

app.put('/api/admin/supplier-products/:id/source', authenticate, requireAdmin, async (req, res) => {
  const productId = clean(req.params.id, 64);
  const supplierName = clean(req.body.supplier_name, 120);
  const supplierUrl = clean(req.body.supplier_url, 1000);
  const supplierCode = clean(req.body.supplier_product_code, 120);
  const supplierPrice = Number(req.body.supplier_price);
  if (!Number.isFinite(supplierPrice) || supplierPrice < 0) return fail(res, 400, 'Invalid supplier price');
  if (supplierUrl && !/^https?:\/\//i.test(supplierUrl)) return fail(res, 400, 'Supplier URL must be http or https');
  const { data: product, error: productError } = await supabase.from('products').select('id').eq('id', productId).maybeSingle();
  if (productError) return fail(res, 500, 'Could not verify product');
  if (!product) return fail(res, 404, 'Product not found');
  const payload = {
    product_id: productId, supplier_name: supplierName, supplier_url: supplierUrl,
    supplier_price: supplierPrice, supplier_product_code: supplierCode,
    notes: clean(req.body.notes, 2000), updated_at: new Date().toISOString()
  };
  const { data, error } = await supabase.from('product_supplier_sources')
    .upsert(payload, { onConflict: 'product_id' }).select().single();
  if (error) return fail(res, 400, 'Could not save supplier metadata');
  res.json({ data });
});

app.put('/api/admin/supplier-products/:id/details', authenticate, requireAdmin, async (req, res) => {
  const productId = clean(req.params.id, 64);
  const { data: product, error: productError } = await supabase.from('products').select('id').eq('id', productId).maybeSingle();
  if (productError) return fail(res, 500, 'Could not verify product');
  if (!product) return fail(res, 404, 'Product not found');
  const payload = {
    product_id: productId,
    category: clean(req.body.category, 80),
    subcategory: clean(req.body.subcategory, 80),
    detail_type: clean(req.body.detail_type, 80),
    specifications: req.body.specifications && typeof req.body.specifications === 'object' && !Array.isArray(req.body.specifications) ? req.body.specifications : {},
    updated_at: new Date().toISOString()
  };
  const { data, error } = await supabase.from('product_listing_details')
    .upsert(payload, { onConflict: 'product_id' }).select().single();
  if (error) return fail(res, 400, 'Could not save product specifications');
  res.json({ data });
});

app.post('/api/admin/supplier-products/:id/variants', authenticate, requireAdmin, async (req, res) => {
  const productId = clean(req.params.id, 64);
  const optionValue = clean(req.body.option_value, 160);
  const sku = clean(req.body.sku, 120);
  const price = Number(req.body.price);
  const stock = Number(req.body.stock ?? 0);
  if (!optionValue || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) return fail(res, 400, 'Invalid variant details');
  const { data: product, error: productError } = await supabase.from('products').select('id').eq('id', productId).maybeSingle();
  if (productError) return fail(res, 500, 'Could not verify product');
  if (!product) return fail(res, 404, 'Product not found');
  const payload = {
    product_id: productId, sku, option_name: clean(req.body.option_name || 'Storage', 80),
    option_value: optionValue, price, stock,
    attributes: req.body.attributes && typeof req.body.attributes === 'object' && !Array.isArray(req.body.attributes) ? req.body.attributes : {},
    is_active: req.body.is_active !== false, sort_order: Number.isInteger(Number(req.body.sort_order)) ? Number(req.body.sort_order) : 0,
    updated_at: new Date().toISOString()
  };
  const { data, error } = await supabase.from('product_variants').insert(payload).select().single();
  if (error) return fail(res, 400, 'Could not create product variant');
  res.status(201).json({ data });
});

app.patch('/api/admin/supplier-products/:id/variants/:variantId', authenticate, requireAdmin, async (req, res) => {
  const patch = {};
  for (const key of ['sku','option_name','option_value']) if (req.body[key] !== undefined) patch[key] = clean(req.body[key], key === 'option_value' ? 160 : 120);
  if (req.body.price !== undefined) patch.price = Number(req.body.price);
  if (req.body.stock !== undefined) patch.stock = Number(req.body.stock);
  if (req.body.is_active !== undefined) patch.is_active = Boolean(req.body.is_active);
  if (req.body.sort_order !== undefined) patch.sort_order = Number(req.body.sort_order);
  if (req.body.attributes !== undefined && req.body.attributes && typeof req.body.attributes === 'object' && !Array.isArray(req.body.attributes)) patch.attributes = req.body.attributes;
  if (patch.price !== undefined && (!Number.isFinite(patch.price) || patch.price < 0)) return fail(res, 400, 'Invalid variant price');
  if (patch.stock !== undefined && (!Number.isInteger(patch.stock) || patch.stock < 0)) return fail(res, 400, 'Invalid variant stock');
  if (patch.option_value !== undefined && !patch.option_value.trim()) return fail(res, 400, 'Variant option is required');
  if (!Object.keys(patch).length) return fail(res, 400, 'No valid variant fields supplied');
  patch.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('product_variants').update(patch)
    .eq('id', clean(req.params.variantId, 64)).eq('product_id', clean(req.params.id, 64)).select().maybeSingle();
  if (error) return fail(res, 400, 'Could not update product variant');
  if (!data) return fail(res, 404, 'Variant not found');
  res.json({ data });
});

app.put('/api/admin/supplier-products/:id/variants/:variantId/source', authenticate, requireAdmin, async (req, res) => {
  const productId = clean(req.params.id, 64);
  const variantId = clean(req.params.variantId, 64);
  const supplierPrice = Number(req.body.supplier_price);
  const supplierCode = clean(req.body.supplier_product_code, 120);
  const supplierUrl = clean(req.body.supplier_url, 1000);
  if (!Number.isFinite(supplierPrice) || supplierPrice < 0) return fail(res, 400, 'Invalid supplier price');
  if (supplierUrl && !/^https?:\/\//i.test(supplierUrl)) return fail(res, 400, 'Supplier URL must be http or https');
  const { data: variant, error: variantError } = await supabase.from('product_variants')
    .select('id').eq('id', variantId).eq('product_id', productId).maybeSingle();
  if (variantError) return fail(res, 500, 'Could not verify product variant');
  if (!variant) return fail(res, 404, 'Variant not found');
  const { data, error } = await supabase.from('product_supplier_variant_sources').upsert({
    variant_id: variantId, supplier_price: supplierPrice,
    supplier_product_code: supplierCode, supplier_url: supplierUrl,
    updated_at: new Date().toISOString()
  }, { onConflict: 'variant_id' }).select().single();
  if (error) return fail(res, 400, 'Could not save supplier variant metadata');
  res.json({ data });
});

app.delete('/api/admin/supplier-products/:id/variants/:variantId', authenticate, requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('product_variants').delete()
    .eq('id', clean(req.params.variantId, 64)).eq('product_id', clean(req.params.id, 64)).select('id').maybeSingle();
  if (error) return fail(res, 400, 'Could not delete product variant');
  if (!data) return fail(res, 404, 'Variant not found');
  res.json({ success: true });
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

// Return JSON for unknown API paths instead of Next.js HTML 404 pages. This
// makes missing or stale upload endpoints visible to the marketplace client.
app.use('/api', (req, res) => fail(res, 404, `API route not found: ${req.method} ${req.path}`));

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) return fail(res, 400, error.message);
  console.error('7inOne request error:', error);
  return fail(res, 500, 'Internal server error');
});

await nextApp.prepare();
app.use((req, res) => nextHandler(req, res));
const server = app.listen(port, '0.0.0.0', () => console.log(`7inOne full-stack service listening on 0.0.0.0:${port}`));
server.on('error', error => console.error('7inOne HTTP server failed to bind:', error));
async function cleanupExpiredSocialStories() {
  if (!supabase) return;
  try {
    const { data: expired, error } = await supabase.from('social_stories')
      .select('id,image_message_id').lte('expires_at', new Date().toISOString()).limit(100);
    if (error) throw error;
    if (!expired?.length) return;
    for (const story of expired) await deleteTelegramMessage(story.image_message_id);
    const ids = expired.map(story => story.id);
    const { error: deleteError } = await supabase.from('social_stories').delete().in('id', ids);
    if (deleteError) throw deleteError;
  } catch (error) { console.warn('Expired Stories cleanup failed:', error.message); }
}
const socialStoryCleanupTimer = setInterval(() => { void cleanupExpiredSocialStories(); }, 15 * 60 * 1000);
socialStoryCleanupTimer.unref?.();
void cleanupExpiredSocialStories();

const productLifecycleTimer=setInterval(()=>{void cleanupExpiredProducts()},60*60*1000);
const vendorShortCleanupTimer=setInterval(()=>{void cleanupExpiredVendorShorts()},5*60*1000);
vendorShortCleanupTimer.unref?.();
void cleanupExpiredVendorShorts();
productLifecycleTimer.unref?.();
void cleanupExpiredProducts();

const ccSupplierAutoSyncTimer = setInterval(() => {
  void runCcComputerAutoSync().catch(error => console.warn('Scheduled CC COMPUTER auto-sync failed:', error.message));
}, 12 * 60 * 60 * 1000);
ccSupplierAutoSyncTimer.unref?.();
void runCcComputerAutoSync().catch(error => console.warn('Startup CC COMPUTER auto-sync failed:', error.message));
