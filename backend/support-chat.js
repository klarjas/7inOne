import { gzipSync, gunzipSync } from 'node:zlib';

export function registerSupportChat(app, deps) {
  const { supabase, authenticate, requireAdmin, telegram, telegramStorageChatId, deleteTelegramMessage, clean, fail } = deps;
  const archiveDays = 30;
  let archivePromise = null;

  async function notifyAdmins(name, body) {
    try {
      const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
      if (!admins?.length) return;
      const { data: links } = await supabase.from('telegram_account_links')
        .select('telegram_user_id').in('user_id', admins.map(x => x.id));
      await Promise.allSettled((links || []).map(link => telegram('sendMessage', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          chat_id: String(link.telegram_user_id),
          text: '7inOne · សារថ្មីពី ' + clean(name, 80) + '\n' + clean(body, 220) +
            '\n\nសូមចូល Website → Admin → Live Chat ដើម្បីឆ្លើយតប។'
        })
      })));
    } catch (error) { console.warn('Support chat notification failed:', clean(error.message, 200)); }
  }

  function archiveText(messages) {
    const rows = ['7inOne Support Chat Archive', 'Format: ISO_TIMESTAMP<TAB>ROLE<TAB>MESSAGE', ''];
    for (const m of messages) {
      const body = String(m.body || '').replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/\t/g, '\\t');
      rows.push(new Date(m.created_at).toISOString() + '\t' +
        (m.sender_role === 'admin' ? 'ADMIN' : 'USER') + '\t' + body);
    }
    return rows.join('\n') + '\n';
  }

  function parseArchive(text) {
    return String(text).split(/\r?\n/).filter(line => /^\d{4}-\d\d-\d\dT/.test(line)).map((line, i) => {
      const a = line.indexOf('\t'), b = line.indexOf('\t', a + 1);
      if (a < 0 || b < 0) return null;
      return {
        id: 'archive-' + i, created_at: line.slice(0, a),
        sender_role: line.slice(a + 1, b) === 'ADMIN' ? 'admin' : 'user',
        body: line.slice(b + 1).replace(/\\t/g, '\t').replace(/\\n/g, '\n').replace(/\\\\/g, '\\'),
        archived: true
      };
    }).filter(Boolean);
  }

  async function readArchive(fileId) {
    const file = await telegram('getFile', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ file_id: fileId })
    });
    const response = await fetch('https://api.telegram.org/file/bot' +
      process.env.TELEGRAM_BOT_TOKEN + '/' + file.file_path);
    if (!response.ok) throw new Error('Telegram archive download failed.');
    return gunzipSync(Buffer.from(await response.arrayBuffer())).toString('utf8');
  }

  async function archiveOldMessages() {
    if (!supabase || !process.env.TELEGRAM_BOT_TOKEN || !telegramStorageChatId()) return 0;
    if (archivePromise) return archivePromise;
    archivePromise = (async () => {
      const cutoff = new Date(Date.now() - archiveDays * 86400000).toISOString();
      const { data: candidates, error } = await supabase.from('support_messages')
        .select('conversation_id').lt('created_at', cutoff).order('created_at').limit(5000);
      if (error) throw error;
      const ids = [...new Set((candidates || []).map(x => x.conversation_id))];
      let count = 0;
      for (const conversationId of ids) {
        const result = await supabase.from('support_messages')
          .select('id,sender_role,body,created_at').eq('conversation_id', conversationId)
          .lt('created_at', cutoff).order('created_at').limit(1000);
        if (result.error) throw result.error;
        const messages = result.data || [];
        if (!messages.length) continue;
        const compressed = gzipSync(Buffer.from(archiveText(messages), 'utf8'), { level: 9 });
        if (compressed.length > 15 * 1024 * 1024) continue;
        const fileName = '7inOne-chat-' + conversationId + '-' +
          new Date(messages[0].created_at).toISOString().slice(0, 10) + '.txt.gz';
        const form = new FormData();
        form.append('chat_id', telegramStorageChatId());
        form.append('caption', '7inOne Chat Archive · ' + messages.length + ' messages');
        form.append('document', new Blob([compressed], { type: 'application/gzip' }), fileName);
        const uploaded = await telegram('sendDocument', { method: 'POST', body: form });
        const fileId = uploaded?.document?.file_id, messageId = uploaded?.message_id;
        if (!fileId || !messageId) throw new Error('Telegram did not return archive file_id.');
        const { data: conversation, error: convError } = await supabase.from('support_conversations')
          .select('user_id').eq('id', conversationId).maybeSingle();
        if (convError || !conversation?.user_id) {
          await deleteTelegramMessage(messageId);
          throw convError || new Error('Conversation missing during archive.');
        }
        const saved = await supabase.from('support_chat_archives').insert({
          conversation_id: conversationId, user_id: conversation.user_id,
          telegram_file_id: fileId, telegram_message_id: messageId, file_name: fileName,
          message_count: messages.length, archived_from: messages[0].created_at,
          archived_to: messages[messages.length - 1].created_at, format_version: 1
        }).select('id').single();
        if (saved.error) {
          await deleteTelegramMessage(messageId);
          throw saved.error;
        }
        const removed = await supabase.from('support_messages').delete()
          .in('id', messages.map(x => x.id)).eq('conversation_id', conversationId);
        if (removed.error) {
          await supabase.from('support_chat_archives').delete().eq('id', saved.data.id);
          await deleteTelegramMessage(messageId);
          console.error('Archive cleanup failed; Telegram copy rolled back to avoid duplicate history:', removed.error.message);
          continue;
        }
        count += messages.length;
      }
      if (count) console.log('Archived ' + count + ' support messages older than ' + archiveDays + ' days.');
      return count;
    })().catch(error => {
      console.error('Support chat archive job failed:', clean(error.message, 250));
      return 0;
    }).finally(() => { archivePromise = null; });
    return archivePromise;
  }

  app.get('/api/chat', authenticate, async (req, res) => {
    try {
      let { data: conversation, error } = await supabase.from('support_conversations')
        .select('id,status,last_message_at,last_message_preview,created_at')
        .eq('user_id', req.user.id).eq('status', 'open')
        .order('last_message_at', { ascending: false }).limit(1).maybeSingle();
      if (error) throw error;
      if (!conversation) {
        const created = await supabase.from('support_conversations').insert({ user_id: req.user.id })
          .select('id,status,last_message_at,last_message_preview,created_at').single();
        if (created.error) throw created.error;
        conversation = created.data;
      }
      const [mr, ar] = await Promise.all([
        supabase.from('support_messages').select('id,sender_role,body,created_at')
          .eq('conversation_id', conversation.id).order('created_at').limit(100),
        supabase.from('support_chat_archives').select('id,file_name,message_count,archived_from,archived_to,created_at')
          .eq('conversation_id', conversation.id).order('archived_from', { ascending: false })
      ]);
      if (mr.error || ar.error) throw mr.error || ar.error;
      await supabase.from('support_conversations').update({ unread_user_count: 0 }).eq('id', conversation.id);
      res.json({ data: { conversation, messages: mr.data || [], archives: ar.data || [] } });
    } catch (e) { console.error('Support chat load failed:', e.message); fail(res, 500, 'មិនអាចផ្ទុកប្រវត្តិឆាតបានទេ។'); }
  });

  app.post('/api/chat/messages', authenticate, async (req, res) => {
    const body = clean(req.body.body, 4000);
    if (!body) return fail(res, 400, 'សូមសរសេរសារជាមុនសិន។');
    try {
      let { data: conv, error } = await supabase.from('support_conversations').select('id')
        .eq('user_id', req.user.id).eq('status', 'open')
        .order('last_message_at', { ascending: false }).limit(1).maybeSingle();
      if (error) throw error;
      if (!conv) {
        const created = await supabase.from('support_conversations').insert({ user_id: req.user.id }).select('id').single();
        if (created.error) throw created.error;
        conv = created.data;
      }
      const inserted = await supabase.from('support_messages').insert({
        conversation_id: conv.id, sender_id: req.user.id, sender_role: 'user', body
      }).select('id,sender_role,body,created_at').single();
      if (inserted.error) throw inserted.error;
      await supabase.from('support_conversations').update({
        last_message_at: inserted.data.created_at, last_message_preview: body.slice(0, 180),
        unread_admin_count: 1, updated_at: new Date().toISOString()
      }).eq('id', conv.id);
      const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', req.user.id).maybeSingle();
      void notifyAdmins(profile?.display_name || req.user.email || 'Customer', body);
      res.status(201).json({ data: { conversation_id: conv.id, message: inserted.data } });
    } catch (e) { console.error('Support chat send failed:', e.message); fail(res, 500, 'មិនអាចផ្ញើសារបានទេ។'); }
  });

  app.get('/api/chat/archives/:id', authenticate, async (req, res) => {
    try {
      const { data, error } = await supabase.from('support_chat_archives')
        .select('id,user_id,telegram_file_id,file_name').eq('id', req.params.id).maybeSingle();
      if (error || !data || data.user_id !== req.user.id) return fail(res, 404, 'រកមិនឃើញប្រវត្តិឆាតនេះទេ។');
      const text = await readArchive(data.telegram_file_id);
      res.json({ data: { archive_id: data.id, file_name: data.file_name, messages: parseArchive(text) } });
    } catch (e) { console.error('Chat archive restore failed:', e.message); fail(res, 502, 'មិនអាចទាញប្រវត្តិឆាតពី Telegram បានទេ។'); }
  });

  app.get('/api/admin/chats/:conversationId/archives/:archiveId', authenticate, requireAdmin, async (req, res) => {
    try {
      const { data: archive, error } = await supabase.from('support_chat_archives')
        .select('id,conversation_id,telegram_file_id,file_name')
        .eq('id', req.params.archiveId).eq('conversation_id', req.params.conversationId).maybeSingle();
      if (error || !archive) return fail(res, 404, 'រកមិនឃើញប្រវត្តិឆាតនេះទេ។');
      const text = await readArchive(archive.telegram_file_id);
      res.json({ data: { archive_id: archive.id, file_name: archive.file_name, messages: parseArchive(text) } });
    } catch (e) { console.error('Admin archive restore failed:', e.message); fail(res, 502, 'មិនអាចទាញប្រវត្តិឆាតពី Telegram បានទេ។'); }
  });

  app.get('/api/admin/chats', authenticate, requireAdmin, async (_req, res) => {
    const { data, error } = await supabase.from('support_conversations')
      .select('id,user_id,status,last_message_at,last_message_preview,unread_admin_count,created_at,profiles(display_name,phone)')
      .order('last_message_at', { ascending: false }).limit(100);
    if (error) return fail(res, 500, 'មិនអាចផ្ទុកបញ្ជី Chat បានទេ។');
    res.json({ data: data || [] });
  });

  app.get('/api/admin/chats/:id', authenticate, requireAdmin, async (req, res) => {
    try {
      const { data: conversation, error } = await supabase.from('support_conversations')
        .select('id,user_id,status,last_message_at,last_message_preview,profiles(display_name,phone)')
        .eq('id', req.params.id).maybeSingle();
      if (error || !conversation) return fail(res, 404, 'រកមិនឃើញសន្ទនានេះទេ។');
      const [mr, ar] = await Promise.all([
        supabase.from('support_messages').select('id,sender_role,body,created_at')
          .eq('conversation_id', conversation.id).order('created_at').limit(100),
        supabase.from('support_chat_archives').select('id,file_name,message_count,archived_from,archived_to,created_at')
          .eq('conversation_id', conversation.id).order('archived_from', { ascending: false })
      ]);
      if (mr.error || ar.error) throw mr.error || ar.error;
      await supabase.from('support_conversations').update({ unread_admin_count: 0 }).eq('id', conversation.id);
      res.json({ data: { conversation, messages: mr.data || [], archives: ar.data || [] } });
    } catch (e) { console.error('Admin chat load failed:', e.message); fail(res, 500, 'មិនអាចបើកសន្ទនាបានទេ។'); }
  });

  app.post('/api/admin/chats/:id/messages', authenticate, requireAdmin, async (req, res) => {
    const body = clean(req.body.body, 4000);
    if (!body) return fail(res, 400, 'សូមសរសេរសារជាមុនសិន។');
    try {
      const { data: conv, error } = await supabase.from('support_conversations').select('id')
        .eq('id', req.params.id).maybeSingle();
      if (error || !conv) return fail(res, 404, 'រកមិនឃើញសន្ទនានេះទេ។');
      const inserted = await supabase.from('support_messages').insert({
        conversation_id: conv.id, sender_id: req.user.id, sender_role: 'admin', body
      }).select('id,sender_role,body,created_at').single();
      if (inserted.error) throw inserted.error;
      await supabase.from('support_conversations').update({
        last_message_at: inserted.data.created_at, last_message_preview: body.slice(0, 180),
        unread_user_count: 1, updated_at: new Date().toISOString()
      }).eq('id', conv.id);
      res.status(201).json({ data: { message: inserted.data } });
    } catch (e) { console.error('Admin chat send failed:', e.message); fail(res, 500, 'មិនអាចផ្ញើសារបានទេ។'); }
  });

  app.patch('/api/admin/chats/:id', authenticate, requireAdmin, async (req, res) => {
    const status = clean(req.body.status, 10);
    if (!['open', 'closed'].includes(status)) return fail(res, 400, 'ស្ថានភាព Chat មិនត្រឹមត្រូវ។');
    const { data, error } = await supabase.from('support_conversations')
      .update({ status, updated_at: new Date().toISOString() }).eq('id', req.params.id)
      .select('id,status').maybeSingle();
    if (error || !data) return fail(res, 404, 'មិនអាចកែស្ថានភាពសន្ទនាបានទេ។');
    res.json({ data });
  });

  setTimeout(() => void archiveOldMessages(), 60_000);
  setInterval(() => void archiveOldMessages(), 6 * 60 * 60 * 1000);
}
