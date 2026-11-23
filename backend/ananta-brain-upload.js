import { createHash, timingSafeEqual } from 'node:crypto';

const cleanText = (value, max) => String(value ?? '').replace(/[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]/g, ' ').trim().slice(0, max);

function safeEqual(a, b) {
  const left = createHash('sha256').update(String(a)).digest();
  const right = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(left, right);
}

export function registerAnantaBrainUploadRoutes(app, { supabase }) {
  const route = '/api/admin/ananta/brain/upload';

  app.get('/api/admin/ananta/brain/status', (req, res) => {
    const configured = Boolean(process.env.ANANTA_BRAIN_UPLOAD_KEY);
    return res.status(configured ? 200 : 503).json({
      ok: configured,
      service: 'ANANTA Brain Upload',
      upload_endpoint: route,
      authentication: 'Bearer token',
      approval_required: true,
      message: configured ? 'Brain upload endpoint is ready.' : 'Set ANANTA_BRAIN_UPLOAD_KEY in the backend environment.'
    });
  });

  app.post(route, async (req, res) => {
    try {
      if (!supabase) return res.status(503).json({ error: 'Supabase is not configured.' });
      const expected = process.env.ANANTA_BRAIN_UPLOAD_KEY || '';
      if (expected.length < 32) return res.status(503).json({ error: 'Brain upload is not configured. Set a strong ANANTA_BRAIN_UPLOAD_KEY.' });

      const supplied = String(req.headers.authorization || '').replace(/^Bearer\\s+/i, '');
      if (!supplied || !safeEqual(supplied, expected)) return res.status(401).json({ error: 'Unauthorized.' });

      const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
      const entries = Array.isArray(body.entries) ? body.entries : [body];
      if (!entries.length || entries.length > 25) return res.status(400).json({ error: 'Send between 1 and 25 knowledge entries per request.' });

      const normalized = [];
      for (const [index, item] of entries.entries()) {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return res.status(400).json({ error: `Entry ${index + 1} must be an object.` });
        const title = cleanText(item.title, 180);
        const content = cleanText(item.content, 12000);
        if (title.length < 3 || content.length < 30) return res.status(400).json({ error: `Entry ${index + 1} needs a title and at least 30 characters of content.` });
        const rawKeywords = Array.isArray(item.keywords) ? item.keywords : [];
        const keywords = [...new Set(rawKeywords.map(value => cleanText(value, 60)).filter(Boolean))].slice(0, 20);
        normalized.push({
          title,
          content,
          category: cleanText(item.category || 'general', 80) || 'general',
          entry_type: cleanText(item.entry_type || 'lesson', 40) || 'lesson',
          keywords,
          status: 'pending'
        });
      }

      const { data: space, error: spaceError } = await supabase
        .from('assistant_knowledge_spaces')
        .select('id,is_enabled')
        .eq('space_code', 'primary')
        .maybeSingle();
      if (spaceError) throw spaceError;
      if (!space?.id || !space.is_enabled) return res.status(409).json({ error: 'Primary ANANTA knowledge space is missing or disabled.' });

      const rows = normalized.map(entry => ({ ...entry, space_id: space.id }));
      const { data, error } = await supabase
        .from('assistant_knowledge_entries')
        .insert(rows)
        .select('id,title,status,created_at');
      if (error) throw error;

      return res.status(201).json({
        ok: true,
        inserted: data?.length || 0,
        approval_required: true,
        entries: data || []
      });
    } catch (error) {
      console.error('[ANANTA Brain Upload] failed:', String(error?.message || error).slice(0, 400));
      return res.status(500).json({ error: 'Could not save knowledge to ANANTA brain.' });
    }
  });
}
