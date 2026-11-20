// Universal owner-scoped management for every user-published 7inOne post.
// Product image upload endpoints and storage lifecycle remain unchanged.
export function registerMyPostsRoutes(app, {
  supabase, authenticate, mediaProxyUrl, deleteTelegramMessage, vendorFor
}) {
  const fail = (res, status, message) => res.status(status).json({ error: message });
  const nowIso = () => new Date().toISOString();
  const text = (value, max = 5000) => String(value ?? '').trim().slice(0, max);
  const missingTable = error => ['42P01', 'PGRST205'].includes(error?.code);\n  const normalizeYoutubeVideoUrl = value => { const raw=String(value??'').trim(); if(!raw)return null; try { const url=new URL(raw); const host=url.hostname.toLowerCase().replace(/^www\\./,''); let id=''; if(host==='youtu.be')id=url.pathname.split('/').filter(Boolean)[0]||''; else if(['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host))id=url.searchParams.get('v')||url.pathname.match(/^\\/(?:embed|live)\\/([A-Za-z0-9_-]{11})\\/?$/)?.[1]||''; else return false; return /^[A-Za-z0-9_-]{11}$/.test(id)?'https://www.youtube.com/watch?v='+id:false; } catch{return false;} };

  const sources = [
    { type:'job', label:'ការងារ', table:'jobs', fields:'id,user_id,title,description,category,location,company_name,salary_min,salary_max,youtube_video_url,status,expires_at,created_at,updated_at,image_file_id,image_message_id,image_mime_type,image_gallery' },
    { type:'property', label:'អចលនទ្រព្យ', table:'property_listings', fields:'id,user_id,title,description,category,location,price,youtube_video_url,status,expires_at,created_at,updated_at,image_file_id,image_message_id,image_mime_type,image_gallery' },
    { type:'rental', label:'ផ្ទះ/បន្ទប់ជួល', table:'rentals', fields:'id,user_id,title,description,category,location,rent_amount,youtube_video_url,status,expires_at,created_at,updated_at,image_file_id,image_message_id,image_mime_type' },
    { type:'land', label:'ដី', table:'land_listings', fields:'id,user_id,title,description,category,location,price,status,expires_at,created_at,updated_at,image_file_id,image_message_id,image_mime_type' },
    { type:'house_sale', label:'ផ្ទះលក់', table:'house_sale_listings', fields:'id,user_id,title,description,category,location,price,status,expires_at,created_at,updated_at,image_file_id,image_message_id,image_mime_type' },
    { type:'social_post', label:'Community Post', table:'social_posts', fields:'id,user_id,caption,image_file_id,image_message_id,created_at' },
    { type:'story', label:'Story', table:'social_stories', fields:'id,user_id,image_file_id,image_message_id,created_at,expires_at' }
  ];

  function galleryMessages(row) {
    const gallery = Array.isArray(row?.image_gallery) ? row.image_gallery : [];
    return [...new Set([
      row?.image_message_id,
      ...gallery.map(item => item?.message_id)
    ].filter(Boolean).map(String))];
  }

  function normalized(row, type, label) {
    const created = row.created_at || null;
    let status = row.status || 'active';
    let renewable = false;
    if (type === 'product') {
      const stamp = Date.parse(row.renewed_at || row.created_at || '');
      const age = Number.isFinite(stamp) ? Date.now() - stamp : 0;
      if (status === 'active' && age > 7 * 86400000) status = 'expired';
      renewable = row.status === 'active' && age <= 14 * 86400000;
      const first = row.product_images?.[0];
      return {
        ...row, type, type_label:label, status,
        image_url:first?.file_id ? mediaProxyUrl(first.file_id) : (first?.image_url || null),
        renewable, editable:true
      };
    }
    if (type === 'story') {
      status = Date.parse(row.expires_at || '') <= Date.now() ? 'expired' : 'active';
      renewable = true;
    } else if (type === 'social_post') {
      status = 'active';
      renewable = false;
    } else if (row.expires_at && Date.parse(row.expires_at) <= Date.now() && status === 'active') {
      status = 'expired';
      renewable = true;
    } else {
      renewable = ['active','archived'].includes(status);
    }
    const gallery = Array.isArray(row.image_gallery) ? row.image_gallery : [];
    return {
      ...row, type, type_label:label, status, renewable,
      editable: type !== 'story',
      image_url: row.image_file_id ? mediaProxyUrl(row.image_file_id, row.image_mime_type) :
        (gallery[0]?.file_id ? mediaProxyUrl(gallery[0].file_id, gallery[0].mime_type) : null)
    };
  }

  app.get('/api/my-posts', authenticate, async (req, res) => {
    try {
      const results = [];
      const { data: vendor } = await vendorFor(req.user.id);
      if (vendor) {
        const { data, error } = await supabase.from('products')
          .select('id,vendor_id,title,description,price,stock,category,location,condition,youtube_video_url,status,created_at,updated_at,renewed_at,product_images(id,file_id,image_url,telegram_message_id,sort_order)')
          .eq('vendor_id', vendor.id).order('created_at', { ascending:false });
        if (error) throw error;
        results.push(...(data || []).map(row => normalized(row, 'product', 'ផលិតផល')));
      }
      const reads = await Promise.all(sources.map(source =>
        supabase.from(source.table).select(source.fields).eq('user_id', req.user.id).order('created_at', { ascending:false }).limit(1000)
      ));
      for (let index = 0; index < sources.length; index++) {
        const source = sources[index], result = reads[index];
        if (result.error) {
          if (missingTable(result.error)) continue;
          throw result.error;
        }
        results.push(...(result.data || []).map(row => normalized(row, source.type, source.label)));
      }
      results.sort((a,b) => Date.parse(b.created_at || 0) - Date.parse(a.created_at || 0));
      res.set('Cache-Control','no-store');
      return res.json({ data:results, total:results.length });
    } catch (error) {
      console.error('Universal My Posts load failed:', error.message);
      return fail(res, 500, 'មិនអាចផ្ទុកប្រកាសរបស់អ្នកបានទេ។');
    }
  });

  app.patch('/api/my-posts/:type/:id', authenticate, async (req, res) => {
    const type = text(req.params.type, 30);
    const id = text(req.params.id, 80);
    const action = text(req.body?.action, 20);
    const now = new Date();
    try {
      if (type === 'product') {
        const { data: vendor } = await vendorFor(req.user.id);
        if (!vendor || vendor.status === 'blocked') return fail(res, 403, 'Active store ownership required');
        const { data: row, error } = await supabase.from('products')
          .select('id,vendor_id,title,description,price,stock,category,location,condition,status,created_at,renewed_at,updated_at,product_images(id,telegram_message_id)')
          .eq('id',id).eq('vendor_id',vendor.id).maybeSingle();
        if (error) throw error;
        if (!row) return fail(res,404,'រកមិនឃើញប្រកាសនេះទេ។');
        if (action === 'renew') {
          const stamp = Date.parse(row.renewed_at || row.updated_at || row.created_at || '');
          if (row.status !== 'active' || (Number.isFinite(stamp) && Date.now() - stamp > 14 * 86400000)) return fail(res,410,'ប្រកាសនេះផុតរយៈពេល Renew ហើយ។');
          const { error:updateError } = await supabase.from('products').update({ renewed_at:nowIso(), status:'active', updated_at:nowIso() }).eq('id',id);
          if (updateError) throw updateError;
        } else if (action === 'expire') {
          if (row.status !== 'active') return fail(res,409,'ប្រកាសនេះមិនស្ថិតក្នុងស្ថានភាពអាចបញ្ចប់បានទេ។');
          const { error:updateError } = await supabase.from('products').update({ renewed_at:new Date(now.getTime() - 8 * 86400000).toISOString(), updated_at:nowIso() }).eq('id',id);
          if (updateError) throw updateError;
        } else if (action === 'edit') {
          const patch = {};
          if (req.body.title !== undefined) patch.title = text(req.body.title,160);
          if (req.body.description !== undefined) patch.description = text(req.body.description,5000);
          if (req.body.category !== undefined) patch.category = text(req.body.category,80);
          if (req.body.location !== undefined) patch.location = text(req.body.location,100);\n          if (req.body.youtube_video_url !== undefined) { const videoUrl = normalizeYoutubeVideoUrl(req.body.youtube_video_url); if (videoUrl === false) return fail(res,400,'YouTube Video Link មិនត្រឹមត្រូវទេ។'); patch.youtube_video_url = videoUrl; }
          if (req.body.price !== undefined) patch.price = Number(req.body.price);
          if (req.body.stock !== undefined) patch.stock = Number(req.body.stock);
          if (patch.title !== undefined && patch.title.length < 2) return fail(res,400,'ចំណងជើងត្រូវមានយ៉ាងតិច ២ តួអក្សរ។');
          if (patch.price !== undefined && (!Number.isFinite(patch.price) || patch.price < 0)) return fail(res,400,'តម្លៃមិនត្រឹមត្រូវ។');
          if (patch.stock !== undefined && (!Number.isInteger(patch.stock) || patch.stock < 0)) return fail(res,400,'ស្តុកមិនត្រឹមត្រូវ។');
          if (!Object.keys(patch).length) return fail(res,400,'មិនមានព័ត៌មានត្រូវកែទេ។');
          patch.updated_at = nowIso();
          const { error:updateError } = await supabase.from('products').update(patch).eq('id',id).eq('vendor_id',vendor.id);
          if (updateError) throw updateError;
        } else return fail(res,400,'សកម្មភាពមិនត្រឹមត្រូវ។');
        return res.json({ success:true });
      }

      if (type === 'social_post') {
        const { data: row, error } = await supabase.from('social_posts').select('id,image_message_id').eq('id',id).eq('user_id',req.user.id).maybeSingle();
        if (error) throw error;
        if (!row) return fail(res,404,'រកមិនឃើញប្រកាសនេះទេ។');
        if (action !== 'edit') return fail(res,400,'សកម្មភាពមិនត្រឹមត្រូវ។');
        const { error:updateError } = await supabase.from('social_posts').update({ caption:text(req.body.caption,500) }).eq('id',id).eq('user_id',req.user.id);
        if (updateError) throw updateError;
        return res.json({ success:true });
      }

      if (type === 'story') {
        const { data: row, error } = await supabase.from('social_stories').select('id').eq('id',id).eq('user_id',req.user.id).maybeSingle();
        if (error) throw error;
        if (!row) return fail(res,404,'រកមិនឃើញ Story នេះទេ។');
        if (action === 'renew') {
          const { error:updateError } = await supabase.from('social_stories').update({ expires_at:new Date(now.getTime()+86400000).toISOString() }).eq('id',id).eq('user_id',req.user.id);
          if (updateError) throw updateError;
        } else if (action === 'expire') {
          const { error:updateError } = await supabase.from('social_stories').update({ expires_at:nowIso() }).eq('id',id).eq('user_id',req.user.id);
          if (updateError) throw updateError;
        } else return fail(res,400,'សកម្មភាពមិនត្រឹមត្រូវ។');
        return res.json({ success:true });
      }

      const source = sources.find(item => item.type === type && !['social_post','story'].includes(item.type));
      if (!source) return fail(res,400,'ប្រភេទប្រកាសមិនត្រឹមត្រូវ។');
      const { data: row, error } = await supabase.from(source.table).select('*').eq('id',id).eq('user_id',req.user.id).maybeSingle();
      if (error) throw error;
      if (!row) return fail(res,404,'រកមិនឃើញប្រកាសនេះទេ។');
      if (action === 'renew') {
        if (['sold','rented','closed'].includes(row.status)) return fail(res,409,'ប្រកាសដែលបានបិទ/លក់រួច មិនអាច Renew បានទេ។');
        const { error:updateError } = await supabase.from(source.table).update({ status:'active', expires_at:new Date(now.getTime()+7*86400000).toISOString(), updated_at:nowIso() }).eq('id',id).eq('user_id',req.user.id);
        if (updateError) throw updateError;
      } else if (action === 'expire') {
        if (['sold','rented','closed'].includes(row.status)) return fail(res,409,'ប្រកាសនេះបានបិទរួចហើយ។');
        const { error:updateError } = await supabase.from(source.table).update({ status:'archived', expires_at:nowIso(), updated_at:nowIso() }).eq('id',id).eq('user_id',req.user.id);
        if (updateError) throw updateError;
      } else if (action === 'edit') {
        const patch = {};
        if (req.body.title !== undefined) patch.title = text(req.body.title,160);
        if (req.body.description !== undefined) patch.description = text(req.body.description,5000);
        if (req.body.location !== undefined) patch.location = text(req.body.location,300);\n        if (req.body.youtube_video_url !== undefined) { const videoUrl = normalizeYoutubeVideoUrl(req.body.youtube_video_url); if (videoUrl === false) return fail(res,400,'YouTube Video Link មិនត្រឹមត្រូវទេ។'); patch.youtube_video_url = videoUrl; }
        if (req.body.category !== undefined) patch.category = text(req.body.category,80);
        if (type === 'job') {
          for (const key of ['salary_min','salary_max']) if (req.body[key] !== undefined) patch[key] = req.body[key] === '' || req.body[key] == null ? null : Number(req.body[key]);
          if (patch.salary_min != null && (!Number.isFinite(patch.salary_min) || patch.salary_min < 0)) return fail(res,400,'ប្រាក់ខែមិនត្រឹមត្រូវ។');
          if (patch.salary_max != null && (!Number.isFinite(patch.salary_max) || patch.salary_max < 0)) return fail(res,400,'ប្រាក់ខែមិនត្រឹមត្រូវ។');
          if (patch.salary_min != null && patch.salary_max != null && patch.salary_max < patch.salary_min) return fail(res,400,'ប្រាក់ខែអតិបរមាត្រូវធំជាងប្រាក់ខែអប្បបរមា។');
        } else if (type === 'property') {
          if (req.body.price !== undefined) patch.price = req.body.price === '' ? null : Number(req.body.price);
        } else if (type === 'rental') {
          if (req.body.price !== undefined) patch.rent_amount = Number(req.body.price);
        } else if (['land','house_sale'].includes(type)) {
          if (req.body.price !== undefined) patch.price = Number(req.body.price);
        }
        if (patch.title !== undefined && patch.title.length < 2) return fail(res,400,'ចំណងជើងត្រូវមានយ៉ាងតិច ២ តួអក្សរ។');
        for (const key of ['price','rent_amount']) if (patch[key] !== undefined && patch[key] !== null && (!Number.isFinite(patch[key]) || patch[key] < 0)) return fail(res,400,'តម្លៃមិនត្រឹមត្រូវ។');
        if (!Object.keys(patch).length) return fail(res,400,'មិនមានព័ត៌មានត្រូវកែទេ។');
        patch.updated_at = nowIso();
        const { error:updateError } = await supabase.from(source.table).update(patch).eq('id',id).eq('user_id',req.user.id);
        if (updateError) throw updateError;
      } else return fail(res,400,'សកម្មភាពមិនត្រឹមត្រូវ។');
      return res.json({ success:true });
    } catch (error) {
      console.error('Universal My Posts update failed:', type, error.message);
      return fail(res,500,'មិនអាចធ្វើបច្ចុប្បន្នភាពប្រកាសបានទេ។');
    }
  });

  app.delete('/api/my-posts/:type/:id', authenticate, async (req, res) => {
    const type = text(req.params.type,30), id = text(req.params.id,80);
    try {
      if (type === 'product') {
        const { data: vendor } = await vendorFor(req.user.id);
        if (!vendor || vendor.status === 'blocked') return fail(res,403,'Active store ownership required');
        const { data: product, error } = await supabase.from('products')
          .select('id,vendor_id,product_images(id,telegram_message_id)')
          .eq('id',id).eq('vendor_id',vendor.id).maybeSingle();
        if (error) throw error;
        if (!product) return fail(res,404,'រកមិនឃើញប្រកាសនេះទេ។');
        const { count, error:countError } = await supabase.from('order_items').select('id',{count:'exact',head:true}).eq('product_id',id);
        if (countError) throw countError;
        if ((count || 0) > 0) {
          const { error:updateError } = await supabase.from('products').update({ status:'archived',updated_at:nowIso() }).eq('id',id);
          if (updateError) throw updateError;
          return res.json({ success:true, archived:true });
        }
        const { error:deleteError } = await supabase.from('products').delete().eq('id',id).eq('vendor_id',vendor.id);
        if (deleteError) throw deleteError;
        for (const image of product.product_images || []) if (image.telegram_message_id) await deleteTelegramMessage(image.telegram_message_id);
        return res.json({ success:true });
      }

      const source = sources.find(item => item.type === type);
      if (!source) return fail(res,400,'ប្រភេទប្រកាសមិនត្រឹមត្រូវ។');
      const { data: row, error } = await supabase.from(source.table).select('*').eq('id',id).eq('user_id',req.user.id).maybeSingle();
      if (error) throw error;
      if (!row) return fail(res,404,'រកមិនឃើញប្រកាសនេះទេ។');
      const { error:deleteError } = await supabase.from(source.table).delete().eq('id',id).eq('user_id',req.user.id);
      if (deleteError) throw deleteError;
      for (const messageId of galleryMessages(row)) await deleteTelegramMessage(messageId);
      return res.json({ success:true });
    } catch (error) {
      console.error('Universal My Posts delete failed:', type, error.message);
      return fail(res,500,'មិនអាចលុបប្រកាសបានទេ។');
    }
  });
}
