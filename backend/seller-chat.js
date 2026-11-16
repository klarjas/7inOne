export function registerSellerChat(app, { supabase, authenticate, requireVendor, clean, fail }) {
  async function getConversationForUser(id, userId) {
    const { data: conversation, error } = await supabase.from('seller_conversations').select('*').eq('id', id).maybeSingle();
    if (error || !conversation) return { error: 'សន្ទនានេះមិនមានទេ។' };
    const [{ data: vendor }, { data: product }, { data: buyer }] = await Promise.all([
      supabase.from('vendors').select('id,user_id,store_name').eq('id', conversation.vendor_id).maybeSingle(),
      supabase.from('products').select('id,title').eq('id', conversation.product_id).maybeSingle(),
      supabase.from('profiles').select('id,display_name').eq('id', conversation.buyer_id).maybeSingle()
    ]);
    const role = conversation.buyer_id === userId ? 'buyer' : vendor?.user_id === userId ? 'seller' : null;
    if (!role) return { error: 'អ្នកមិនមានសិទ្ធិចូលសន្ទនានេះទេ។' };
    return { conversation: { ...conversation, vendor, product, buyer, current_role: role } };
  }

  async function listConversations(vendorId) {
    const { data, error } = await supabase.from('seller_conversations').select('*')
      .eq('vendor_id', vendorId).order('last_message_at', { ascending: false }).limit(100);
    if (error) throw error;
    const rows = data || [];
    const buyerIds = [...new Set(rows.map(row => row.buyer_id))];
    const productIds = [...new Set(rows.map(row => row.product_id))];
    const [buyersResult, productsResult] = await Promise.all([
      buyerIds.length ? supabase.from('profiles').select('id,display_name').in('id', buyerIds) : Promise.resolve({ data: [] }),
      productIds.length ? supabase.from('products').select('id,title').in('id', productIds) : Promise.resolve({ data: [] })
    ]);
    if (buyersResult.error || productsResult.error) throw buyersResult.error || productsResult.error;
    const buyers = new Map((buyersResult.data || []).map(row => [row.id, row]));
    const products = new Map((productsResult.data || []).map(row => [row.id, row]));
    return rows.map(row => ({ ...row, buyer: buyers.get(row.buyer_id) || null, product: products.get(row.product_id) || null }));
  }

  app.get('/api/seller-chat/conversations', authenticate, requireVendor, async (req, res) => {
    try {
      res.set('Cache-Control', 'no-store');
      return res.json({ data: await listConversations(req.vendor.id) });
    } catch (error) {
      console.error('Seller chat inbox failed:', error.message);
      return fail(res, 500, 'មិនអាចផ្ទុកសារអ្នកទិញបានទេ។');
    }
  });

  app.post('/api/seller-chat/conversations', authenticate, async (req, res) => {
    const productId = clean(req.body.product_id, 80);
    if (!productId) return fail(res, 400, 'សូមជ្រើសរើសទំនិញជាមុនសិន។');
    try {
      const { data: product, error: productError } = await supabase.from('products')
        .select('id,vendor_id,status,stock').eq('id', productId).maybeSingle();
      if (productError || !product || product.status !== 'active' || Number(product.stock) < 1) return fail(res, 404, 'ទំនិញនេះមិនអាចឆាតបានទេ។');
      const { data: vendor, error: vendorError } = await supabase.from('vendors')
        .select('id,user_id,status').eq('id', product.vendor_id).maybeSingle();
      if (vendorError || !vendor || vendor.status !== 'approved') return fail(res, 404, 'រកមិនឃើញហាងអ្នកលក់ទេ។');
      if (vendor.user_id === req.user.id) return fail(res, 400, 'អ្នកមិនអាចឆាតទៅហាងរបស់ខ្លួនឯងបានទេ.');

      let { data: conversation, error } = await supabase.from('seller_conversations')
        .select('id').eq('product_id', product.id).eq('buyer_id', req.user.id).maybeSingle();
      if (error) throw error;
      if (!conversation) {
        const created = await supabase.from('seller_conversations').insert({
          product_id: product.id, vendor_id: vendor.id, buyer_id: req.user.id,
          status: 'open', last_message_at: new Date().toISOString()
        }).select('id').single();
        if (created.error) {
          if (created.error.code !== '23505') throw created.error;
          const retry = await supabase.from('seller_conversations').select('id')
            .eq('product_id', product.id).eq('buyer_id', req.user.id).single();
          if (retry.error) throw retry.error;
          conversation = retry.data;
        } else conversation = created.data;
      } else {
        const reopened = await supabase.from('seller_conversations').update({
          status: 'open', updated_at: new Date().toISOString()
        }).eq('id', conversation.id);
        if (reopened.error) throw reopened.error;
      }
      return res.status(200).json({ data: { id: conversation.id } });
    } catch (error) {
      console.error('Seller chat conversation create failed:', error.message);
      return fail(res, 500, 'មិនអាចបើកសន្ទនាជាមួយអ្នកលក់បានទេ។');
    }
  });

  app.get('/api/seller-chat/conversations/:id', authenticate, async (req, res) => {
    try {
      const result = await getConversationForUser(req.params.id, req.user.id);
      if (result.error) return fail(res, 404, result.error);
      const conversation = result.conversation;
      const { data: messages, error } = await supabase.from('seller_messages')
        .select('id,conversation_id,sender_id,sender_role,body,created_at')
        .eq('conversation_id', conversation.id).order('created_at', { ascending: true }).limit(200);
      if (error) throw error;
      const unreadField = conversation.current_role === 'buyer' ? 'unread_buyer_count' : 'unread_seller_count';
      const marked = await supabase.from('seller_conversations').update({ [unreadField]: 0 }).eq('id', conversation.id);
      if (marked.error) throw marked.error;
      res.set('Cache-Control', 'no-store');
      return res.json({ data: { conversation, messages: messages || [] } });
    } catch (error) {
      console.error('Seller chat load failed:', error.message);
      return fail(res, 500, 'មិនអាចផ្ទុកសារបានទេ។');
    }
  });

  app.post('/api/seller-chat/conversations/:id/messages', authenticate, async (req, res) => {
    const body = clean(req.body.body, 4000);
    if (!body) return fail(res, 400, 'សូមសរសេរសារជាមុនសិន។');
    try {
      const result = await getConversationForUser(req.params.id, req.user.id);
      if (result.error) return fail(res, 404, result.error);
      const conversation = result.conversation;
      if (conversation.status !== 'open') return fail(res, 409, 'សន្ទនានេះត្រូវបានបិទ។');
      const senderRole = conversation.current_role;
      const { data: message, error } = await supabase.from('seller_messages').insert({
        conversation_id: conversation.id, sender_id: req.user.id, sender_role: senderRole, body
      }).select('id,conversation_id,sender_id,sender_role,body,created_at').single();
      if (error) throw error;
      const unreadField = senderRole === 'buyer' ? 'unread_seller_count' : 'unread_buyer_count';
      const updated = await supabase.from('seller_conversations').update({
        last_message_at: message.created_at, last_message_preview: body.slice(0, 180),
        updated_at: new Date().toISOString(),
        [unreadField]: Number(conversation[unreadField] || 0) + 1
      }).eq('id', conversation.id);
      if (updated.error) throw updated.error;
      return res.status(201).json({ data: { message } });
    } catch (error) {
      console.error('Seller chat send failed:', error.message);
      return fail(res, 500, 'មិនអាចផ្ញើសារបានទេ។');
    }
  });
}
