export function registerSellerChat(app, { supabase, authenticate, requireVendor, upload, telegram, telegramStorageChatId, clean, fail, productPublicMaxAgeMs }) {
  const mediaProxyUrl = (fileId, mimeType) => fileId ? `/api/media/image/${encodeURIComponent(fileId)}${mimeType ? `?mime=${encodeURIComponent(mimeType)}` : ''}` : '';
  const publicMessage = message => {
    if (!message) return message;
    const { telegram_file_id: fileId, telegram_message_id: _messageId, ...safeMessage } = message;
    return { ...safeMessage, media_url: fileId ? mediaProxyUrl(fileId, message.mime_type) : null };
  };
  async function getConversationForUser(id, userId) {
    const { data: conversation, error } = await supabase.from('seller_conversations').select('*').eq('id', id).maybeSingle();
    if (error || !conversation) return { error: 'សន្ទនានេះមិនមានទេ។' };
    const [{ data: vendor }, { data: product }, { data: buyer }] = await Promise.all([
      supabase.from('vendors').select('id,user_id,store_name,store_logo_file_id').eq('id', conversation.vendor_id).maybeSingle(),
      supabase.from('products').select('id,title,price,status,stock').eq('id', conversation.product_id).maybeSingle(),
      supabase.from('profiles').select('id,display_name,avatar_url').eq('id', conversation.buyer_id).maybeSingle()
    ]);
    const { data: vendorProfile } = vendor?.user_id
      ? await supabase.from('profiles').select('id,avatar_url').eq('id', vendor.user_id).maybeSingle()
      : { data: null };
    const role = conversation.buyer_id === userId ? 'buyer' : vendor?.user_id === userId ? 'seller' : null;
    if (!role) return { error: 'អ្នកមិនមានសិទ្ធិចូលសន្ទនានេះទេ។' };
    const { data: images } = await supabase.from('product_images').select('id,sort_order,file_id,image_url')
      .eq('product_id', conversation.product_id).order('sort_order', { ascending: true }).limit(1);
    const image = images?.[0];
    return { conversation: { ...conversation, vendor: vendor ? { id: vendor.id, user_id: vendor.user_id, store_name: vendor.store_name, store_logo_url: vendor.store_logo_file_id ? mediaProxyUrl(vendor.store_logo_file_id) : '', profile: vendorProfile } : null, product: product ? { ...product, image_url: image?.file_id ? mediaProxyUrl(image.file_id) : image?.image_url || '' } : null, buyer, current_role: role } };
  }

  async function listInbox(userId) {
    const { data: vendor } = await supabase.from('vendors').select('id,user_id,store_name,status').eq('user_id', userId).maybeSingle();
    let query = supabase.from('seller_conversations').select('*');
    query = vendor?.status === 'approved'
      ? query.or('buyer_id.eq.' + userId + ',vendor_id.eq.' + vendor.id)
      : query.eq('buyer_id', userId);
    const { data, error } = await query.order('last_message_at', { ascending: false }).limit(100);
    if (error) throw error;
    const rows = data || [];
    const buyerIds = [...new Set(rows.map(row => row.buyer_id))];
    const vendorIds = [...new Set(rows.map(row => row.vendor_id))];
    const productIds = [...new Set(rows.map(row => row.product_id).filter(Boolean))];
    const [buyersResult, vendorsResult, productsResult, imagesResult] = await Promise.all([
      buyerIds.length ? supabase.from('profiles').select('id,display_name,avatar_url').in('id', buyerIds) : Promise.resolve({ data: [] }),
      vendorIds.length ? supabase.from('vendors').select('id,user_id,store_name,store_logo_file_id').in('id', vendorIds) : Promise.resolve({ data: [] }),
      productIds.length ? supabase.from('products').select('id,title,price,status,stock').in('id', productIds) : Promise.resolve({ data: [] }),
      productIds.length ? supabase.from('product_images').select('product_id,sort_order,file_id,image_url').in('product_id', productIds).order('sort_order', { ascending: true }) : Promise.resolve({ data: [] })
    ]);
    const issue = buyersResult.error || vendorsResult.error || productsResult.error || imagesResult.error;
    if (issue) throw issue;
    const vendorUserIds = [...new Set((vendorsResult.data || []).map(row => row.user_id).filter(Boolean))];
    const vendorProfilesResult = vendorUserIds.length
      ? await supabase.from('profiles').select('id,avatar_url').in('id', vendorUserIds)
      : { data: [] };
    if (vendorProfilesResult.error) throw vendorProfilesResult.error;
    const vendorProfiles = new Map((vendorProfilesResult.data || []).map(row => [row.id, row]));
    const buyers = new Map((buyersResult.data || []).map(row => [row.id, row]));
    const vendors = new Map((vendorsResult.data || []).map(row => [row.id, { id: row.id, user_id: row.user_id, store_name: row.store_name, store_logo_url: row.store_logo_file_id ? mediaProxyUrl(row.store_logo_file_id) : '', profile: vendorProfiles.get(row.user_id) || null }]));
    const products = new Map((productsResult.data || []).map(row => [row.id, row]));
    const images = new Map();
    for (const row of imagesResult.data || []) if (!images.has(row.product_id)) images.set(row.product_id, row);
    return rows.map(row => {
      const otherRole = row.buyer_id === userId ? 'seller' : 'buyer';
      const product = products.get(row.product_id) || null;
      const image = images.get(row.product_id);
      return {
        ...row, current_role: row.buyer_id === userId ? 'buyer' : 'seller',
        buyer: buyers.get(row.buyer_id) || null, vendor: vendors.get(row.vendor_id) || null,
        product: product ? { ...product, image_url: image?.file_id ? mediaProxyUrl(image.file_id) : image?.image_url || '' } : null,
        other_role: otherRole,
        unread_count: row.buyer_id === userId ? Number(row.unread_buyer_count || 0) : Number(row.unread_seller_count || 0),
        other_name: row.buyer_id === userId ? (vendors.get(row.vendor_id)?.store_name || 'អ្នកលក់') : (buyers.get(row.buyer_id)?.display_name || 'អ្នកទិញ')
      };
    });
  }

  app.get('/api/seller-chat/inbox', authenticate, async (req, res) => {
    try { res.set('Cache-Control', 'no-store'); return res.json({ data: await listInbox(req.user.id) }); }
    catch (error) { console.error('Seller chat inbox failed:', error.message); return fail(res, 500, 'មិនអាចផ្ទុកប្រអប់សារបានទេ។'); }
  });

  app.get('/api/seller-chat/conversations', authenticate, requireVendor, async (req, res) => {
    try { res.set('Cache-Control', 'no-store'); return res.json({ data: (await listInbox(req.user.id)).filter(row => row.current_role === 'seller') }); }
    catch (error) { console.error('Seller dashboard inbox failed:', error.message); return fail(res, 500, 'មិនអាចផ្ទុកសារអ្នកទិញបានទេ។'); }
  });

  app.get('/api/seller-chat/preferences', authenticate, async (req, res) => {
    const { data, error } = await supabase.from('seller_chat_preferences').select('muted').eq('user_id', req.user.id).maybeSingle();
    if (error) return fail(res, 500, 'មិនអាចផ្ទុកការកំណត់សំឡេងបានទេ។');
    return res.json({ data: { muted: data?.muted === true } });
  });
  app.put('/api/seller-chat/preferences', authenticate, async (req, res) => {
    const muted = req.body?.muted === true;
    const { error } = await supabase.from('seller_chat_preferences').upsert({ user_id: req.user.id, muted, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (error) return fail(res, 500, 'មិនអាចរក្សាទុកការកំណត់សំឡេងបានទេ។');
    return res.json({ data: { muted } });
  });

  app.post('/api/seller-chat/conversations', authenticate, async (req, res) => {
    const productId = clean(req.body.product_id, 80);
    if (!productId) return fail(res, 400, 'សូមជ្រើសរើសទំនិញជាមុនសិន។');
    try {
      const { data: product, error: productError } = await supabase.from('products').select('id,vendor_id,status,stock,title,price').eq('id', productId).gte('renewed_at',new Date(Date.now()-(Number(productPublicMaxAgeMs)||7*24*60*60*1000)).toISOString()).maybeSingle();
      if (productError || !product || product.status !== 'active' || Number(product.stock) < 1) return fail(res, 404, 'ទំនិញនេះមិនអាចឆាតបានទេ។');
      const { data: vendor, error: vendorError } = await supabase.from('vendors').select('id,user_id,status,store_name').eq('id', product.vendor_id).maybeSingle();
      if (vendorError || !vendor || vendor.status !== 'approved') return fail(res, 404, 'រកមិនឃើញហាងអ្នកលក់ទេ។');
      if (vendor.user_id === req.user.id) return fail(res, 400, 'អ្នកមិនអាចឆាតទៅហាងរបស់ខ្លួនឯងបានទេ។');
      let { data: conversation, error } = await supabase.from('seller_conversations').select('id,unread_seller_count').eq('vendor_id', vendor.id).eq('buyer_id', req.user.id).maybeSingle();
      if (error) throw error;
      if (!conversation) {
        const created = await supabase.from('seller_conversations').insert({product_id:product.id,vendor_id:vendor.id,buyer_id:req.user.id,status:'open',last_message_at:new Date().toISOString()}).select('id,unread_seller_count').single();
        if (created.error) {
          if (created.error.code !== '23505') throw created.error;
          const retry = await supabase.from('seller_conversations').select('id,unread_seller_count').eq('vendor_id',vendor.id).eq('buyer_id',req.user.id).single();
          if (retry.error) throw retry.error;
          conversation = retry.data;
        } else conversation = created.data;
      }
      const cardMessage = await supabase.from('seller_messages').insert({
        conversation_id:conversation.id,sender_id:req.user.id,sender_role:'buyer',
        body:'📦 បានសួរអំពីផលិតផល៖ '+product.title,message_type:'product',product_id:product.id
      }).select('id').single();
      if (cardMessage.error) throw cardMessage.error;
      const now=new Date().toISOString();
      const updated=await supabase.from('seller_conversations').update({
        product_id:product.id,status:'open',last_message_at:now,last_message_preview:'📦 '+product.title,
        unread_seller_count:Number(conversation.unread_seller_count||0)+1,updated_at:now
      }).eq('id',conversation.id);
      if(updated.error)throw updated.error;
      return res.status(200).json({data:{id:conversation.id}});
    } catch (error) { console.error('Seller chat conversation create failed:', error.message); return fail(res, 500, 'មិនអាចបើកសន្ទនាជាមួយអ្នកលក់បានទេ។'); }
  });

  app.get('/api/seller-chat/conversations/:id', authenticate, async (req, res) => {
    try {
      const result = await getConversationForUser(req.params.id, req.user.id);
      if (result.error) return fail(res, 404, result.error);
      const conversation = result.conversation;
      const { data: messages, error } = await supabase.from('seller_messages')
        .select('id,conversation_id,sender_id,sender_role,body,message_type,telegram_file_id,mime_type,duration_seconds,product_id,created_at')
        .eq('conversation_id', conversation.id).order('created_at', { ascending: true }).limit(200);
      if (error) throw error;
      const productIds=[...new Set((messages||[]).filter(m=>m.message_type==='product'&&m.product_id).map(m=>m.product_id))];
      let productCards=messages||[];
      if(productIds.length){
        const [productsResult,imagesResult]=await Promise.all([
          supabase.from('products').select('id,title,price,status,stock').in('id',productIds),
          supabase.from('product_images').select('product_id,sort_order,file_id,image_url').in('product_id',productIds).order('sort_order',{ascending:true})
        ]);
        if(productsResult.error||imagesResult.error)throw productsResult.error||imagesResult.error;
        const productMap=new Map((productsResult.data||[]).map(row=>[row.id,row]));
        const imageMap=new Map();
        for(const row of imagesResult.data||[])if(!imageMap.has(row.product_id))imageMap.set(row.product_id,row);
        productCards=(messages||[]).map(message=>{
          if(message.message_type!=='product')return message;
          const product=productMap.get(message.product_id),image=imageMap.get(message.product_id);
          return {...message,product:product?{...product,image_url:image?.image_url||(image?.file_id?'/api/media/telegram/'+encodeURIComponent(image.file_id):'')}:null};
        });
      }
      const unreadField=conversation.current_role==='buyer'?'unread_buyer_count':'unread_seller_count';
      const marked=await supabase.from('seller_conversations').update({[unreadField]:0}).eq('id',conversation.id);
      if(marked.error)throw marked.error;
      res.set('Cache-Control','no-store');
      return res.json({data:{conversation,messages:productCards.map(publicMessage)}});
    } catch (error) { console.error('Seller chat load failed:', error.message); return fail(res, 500, 'មិនអាចផ្ទុកសារបានទេ។'); }
  });

  async function saveMessage(conversation, userId, role, fields, preview) {
    const { data: message, error } = await supabase.from('seller_messages').insert({
      conversation_id: conversation.id, sender_id: userId, sender_role: role, ...fields
    }).select('id,conversation_id,sender_id,sender_role,body,message_type,telegram_file_id,mime_type,duration_seconds,created_at').single();
    if (error) throw error;
    const unreadField = role === 'buyer' ? 'unread_seller_count' : 'unread_buyer_count';
    const updated = await supabase.from('seller_conversations').update({
      last_message_at: message.created_at, last_message_preview: preview.slice(0, 180),
      updated_at: new Date().toISOString(),
      [unreadField]: Number(conversation[unreadField] || 0) + 1
    }).eq('id', conversation.id);
    if (updated.error) throw updated.error;
    return message;
  }

  app.post('/api/seller-chat/conversations/:id/messages', authenticate, async (req, res) => {
    const body = clean(req.body.body, 4000);
    const messageType = clean(req.body.message_type, 20) || 'text';
    try {
      const result = await getConversationForUser(req.params.id, req.user.id);
      if (result.error) return fail(res, 404, result.error);
      const conversation = result.conversation;
      if (conversation.status !== 'open') return fail(res, 409, 'សន្ទនានេះត្រូវបានបិទ។');

      if (messageType === 'product') {
        const productId = clean(req.body.product_id, 80);
        if (!productId) return fail(res, 400, 'មិនមានផលិតផលដែលត្រូវផ្ញើទេ។');
        const { data: product, error } = await supabase.from('products')
          .select('id,title,vendor_id').eq('id', productId).eq('vendor_id', conversation.vendor_id).maybeSingle();
        if (error || !product) return fail(res, 404, 'រកមិនឃើញផលិតផលនេះទេ។');
        const preview = '📦 ' + product.title;
        const message = await saveMessage(conversation, req.user.id, conversation.current_role, {
          body: body || product.title, message_type: 'product', product_id: product.id
        }, preview);
        return res.status(201).json({ data: { message: publicMessage(message) } });
      }

      if (!body) return fail(res, 400, 'សូមសរសេរសារជាមុនសិន។');
      const message = await saveMessage(conversation, req.user.id, conversation.current_role, { body, message_type: 'text' }, body);
      return res.status(201).json({ data: { message } });
    } catch (error) { console.error('Seller chat send failed:', error.message); return fail(res, 500, 'មិនអាចផ្ញើសារបានទេ។'); }
  });

  app.post('/api/seller-chat/conversations/:id/voice', authenticate, upload.single('voice'), async (req, res) => {
    try {
      const result = await getConversationForUser(req.params.id, req.user.id);
      if (result.error) return fail(res, 404, result.error);
      const conversation = result.conversation;
      if (conversation.status !== 'open') return fail(res, 409, 'សន្ទនានេះត្រូវបានបិទ។');
      const file = req.file;
      const allowed = new Set(['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav','audio/x-wav']);
      if (!file || !allowed.has(String(file.mimetype).split(';')[0].toLowerCase()) || !file.buffer?.length) return fail(res, 400, 'ទម្រង់សំឡេងមិនត្រឹមត្រូវទេ។');
      if (file.size > 12 * 1024 * 1024) return fail(res, 413, 'សំឡេងមិនអាចលើស 12MB បានទេ។');
      const requestedDuration = Number(req.body.duration_seconds || 1);
      const duration = Number.isFinite(requestedDuration) ? Math.max(1, Math.min(180, Math.round(requestedDuration))) : 1;
      const mimeType = String(file.mimetype).split(';')[0].toLowerCase();
      const chatId = telegramStorageChatId();
      if (!process.env.TELEGRAM_BOT_TOKEN || !chatId) return fail(res, 503, 'មិនទាន់កំណត់ Telegram Storage សម្រាប់សារសំឡេងទេ។');
      const form = new FormData();
      form.append('chat_id', chatId);
      const ext = file.mimetype.includes('ogg') ? 'ogg' : file.mimetype.includes('mp4') ? 'm4a' : file.mimetype.includes('mpeg') ? 'mp3' : file.mimetype.includes('wav') ? 'wav' : 'webm';
      form.append('document', new Blob([file.buffer], { type: file.mimetype }), '7inone-voice-' + Date.now() + '.' + ext);
      const stored = await telegram('sendDocument', { method: 'POST', body: form });
      const media = stored.document;
      if (!media?.file_id || !stored.message_id) throw new Error('Telegram did not return a voice file_id.');
      const message = await saveMessage(conversation, req.user.id, conversation.current_role, {
        body: '🎤 សារសំឡេង', message_type: 'voice', telegram_file_id: media.file_id,
        telegram_message_id: stored.message_id, mime_type: mimeType, duration_seconds: duration
      }, '🎤 សារសំឡេង · ' + duration + ' វិនាទី');
      return res.status(201).json({ data: { message } });
    } catch (error) { console.error('Seller voice upload failed:', error.message); return fail(res, 502, 'មិនអាចរក្សាទុក ឬផ្ញើសំឡេងទៅ Telegram បានទេ។'); }
  });
  app.post('/api/seller-chat/conversations/:id/image', authenticate, upload.single('image'), async (req, res) => {
    try {
      const result = await getConversationForUser(req.params.id, req.user.id);
      if (result.error) return fail(res, 404, result.error);
      const conversation = result.conversation;
      if (conversation.status !== 'open') return fail(res, 409, 'សន្ទនានេះត្រូវបានបិទ។');
      const file = req.file;
      const mimeType = String(file?.mimetype || '').toLowerCase();
      const signatures = {
        'image/jpeg': file?.buffer?.length >= 3 && file.buffer[0] === 0xff && file.buffer[1] === 0xd8 && file.buffer[2] === 0xff,
        'image/png': file?.buffer?.length >= 8 && file.buffer.subarray(0,8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])),
        'image/webp': file?.buffer?.length >= 12 && file.buffer.toString('ascii',0,4) === 'RIFF' && file.buffer.toString('ascii',8,12) === 'WEBP'
      };
      if (!file || !signatures[mimeType] || !file.buffer?.length) return fail(res, 400, 'សូមផ្ញើរូប JPG, PNG ឬ WEBP ត្រឹមត្រូវ។');
      if (file.size > 8 * 1024 * 1024) return fail(res, 413, 'រូបភាពមិនអាចលើស 8MB បានទេ។');
      const chatId = telegramStorageChatId();
      if (!process.env.TELEGRAM_BOT_TOKEN || !chatId) return fail(res, 503, 'មិនទាន់កំណត់ Telegram Storage សម្រាប់រូបភាពទេ។');
      const form = new FormData();
      form.append('chat_id', chatId);
      form.append('document', new Blob([file.buffer], { type: mimeType }), '7inone-chat-' + Date.now() + (mimeType==='image/png'?'.png':mimeType==='image/webp'?'.webp':'.jpg'));
      const stored = await telegram('sendDocument', { method: 'POST', body: form });
      const media = stored.document;
      if (!media?.file_id || !stored.message_id) throw new Error('Telegram did not return an image file_id.');
      const message = await saveMessage(conversation, req.user.id, conversation.current_role, {
        body: '📷 រូបភាព', message_type: 'image', telegram_file_id: media.file_id, telegram_message_id: stored.message_id, mime_type: mimeType
      }, '📷 រូបភាព');
      return res.status(201).json({ data: { message } });
    } catch (error) { console.error('Seller chat image upload failed:', error.message); return fail(res, 502, 'មិនអាចរក្សាទុក ឬផ្ញើរូបភាពទៅ Telegram បានទេ។'); }
  });

  app.post('/api/seller-chat/conversations/:id/location', authenticate, async (req, res) => {
    try {
      const result = await getConversationForUser(req.params.id, req.user.id);
      if (result.error) return fail(res, 404, result.error);
      const conversation = result.conversation;
      if (conversation.status !== 'open') return fail(res, 409, 'សន្ទនានេះត្រូវបានបិទ។');
      const rawLatitude = req.body?.latitude, rawLongitude = req.body?.longitude;
      if (rawLatitude == null || rawLongitude == null || (typeof rawLatitude === 'string' && !rawLatitude.trim()) || (typeof rawLongitude === 'string' && !rawLongitude.trim())) return fail(res, 400, 'ទីតាំង GPS មិនត្រឹមត្រូវទេ។');
      const latitude = Number(rawLatitude), longitude = Number(rawLongitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude)>90 || Math.abs(longitude)>180) return fail(res, 400, 'ទីតាំង GPS មិនត្រឹមត្រូវទេ។');
      const body = JSON.stringify({ latitude, longitude, accuracy: Number.isFinite(Number(req.body?.accuracy)) ? Math.max(0, Math.min(100000, Number(req.body.accuracy))) : null });
      const message = await saveMessage(conversation, req.user.id, conversation.current_role, { body, message_type: 'location' }, '📍 ទីតាំង Google Maps');
      return res.status(201).json({ data: { message } });
    } catch (error) { console.error('Seller chat location send failed:', error.message); return fail(res, 500, 'មិនអាចផ្ញើទីតាំងបានទេ។'); }
  });

}
