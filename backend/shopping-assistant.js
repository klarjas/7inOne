const AI_DEFAULT_MODEL = process.env.AI_MODEL || 'Qwen/Qwen2.5-7B-Instruct';
const AI_CHAT_URL = process.env.AI_CHAT_COMPLETIONS_URL || 'https://router.huggingface.co/v1/chat/completions';

function assistantText(value, max = 700) {
  return String(value ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ').trim().slice(0, max);
}
function assistantTerms(value) {
  return assistantText(value, 700).toLocaleLowerCase()
    .split(/[\s,.;:!?/\\|()[\]{}]+/u)
    .map(item => item.trim())
    .filter(item => item.length >= 2)
    .slice(0, 8);
}
function assistantBudget(value) {
  const text = String(value || '');
  const patterns = [
    /(?:\$|usd\s*)(\d{1,7}(?:\.\d{1,2})?)/i,
    /(\d{1,7}(?:\.\d{1,2})?)\s*(?:usd|ដុល្លារ|\$)/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number(match[1]);
  }
  return null;
}
function assistantFallbackMessage(language, count) {
  if (language === 'zh') return count ? '我已根据7inOne当前在售商品整理了以下选项。价格和规格以商品页面为准。' : '目前没有找到符合条件的商品。请尝试更换关键词或预算。';
  if (language === 'en') return count ? 'I found these currently listed products in 7inOne. Please open a product to verify its latest price and specifications.' : 'I could not find a matching product in the current 7inOne catalogue. Try another keyword or budget.';
  return count ? 'ខ្ញុំបានរកឃើញផលិតផលដែលកំពុងមានក្នុង 7inOne ដូចខាងក្រោម។ សូមចុចលើផលិតផល ដើម្បីមើលតម្លៃ និងលក្ខណៈបច្ចេកទេសលម្អិត។' : 'ខ្ញុំមិនទាន់រកឃើញផលិតផលដែលត្រូវនឹងលក្ខខណ្ឌទេ។ សាកល្បងប្ដូរពាក្យស្វែងរក ឬថវិកា។';
}
async function askOpenSourceModel(message, language, products) {
  const token = process.env.HF_TOKEN || process.env.AI_API_KEY;
  if (!token) return null;
  const compactProducts = products.map(product => ({
    id: product.id, title: product.title, description: product.description,
    price: product.display_price, category: product.category,
    specifications: product.specifications, stock: product.stock,
    shop: product.vendors?.store_name, verified_shop: product.vendors?.status === 'approved',
    rating: product.seller_rating
  }));
  const languageRule = language === 'km' ? 'Answer in Khmer.' : language === 'zh' ? 'Answer in Simplified Chinese.' : language === 'en' ? 'Answer in English.' : 'Detect the language of the customer and answer in that same language.';
  const system = [
    'You are the 7inOne Smart Shopping Assistant for customers.',
    languageRule,
    'Use only the supplied product catalogue as factual evidence. Never invent products, prices, specifications, stock, ratings, or shop verification.',
    'Recommend products by matching the customer need first. Prefer verified shops (verified_shop=true) among similarly relevant products, but do not hide a more suitable regular shop.',
    'Explain technical terms simply. If a specification is missing, say it is not listed.',
    'Do not claim a product is available unless stock is greater than zero.',
    'Keep the answer concise and helpful. Product cards are rendered separately from this answer.'
  ].join(' ');
  const response = await fetch(AI_CHAT_URL, {
    method: 'POST',
    headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: AI_DEFAULT_MODEL,
      temperature: 0.2,
      max_tokens: 420,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: 'Customer request: ' + message + '\nCatalogue evidence (JSON): ' + JSON.stringify(compactProducts) }
      ]
    }),
    signal: AbortSignal.timeout(25000)
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error('Open-source AI provider returned HTTP ' + response.status + ': ' + detail.slice(0, 240));
  }
  const payload = await response.json();
  const answer = assistantText(payload?.choices?.[0]?.message?.content, 1600);
  return answer || null;
}

export function registerShoppingAssistant(app, { supabase, clean, fail, ratingsFor, publicProduct, productPublicMaxAgeMs }) {
  const limiter = (await import('express-rate-limit')).default;
  app.post('/api/assistant/chat', limiter({ windowMs: 5 * 60 * 1000, limit: 18, standardHeaders: 'draft-8', legacyHeaders: false }), async (req, res) => {
    if (!supabase) return fail(res, 503, 'Shopping assistant is temporarily unavailable.');
    const message = assistantText(req.body?.message, 700);
    if (!message) return fail(res, 400, 'សូមសរសេរអ្វីដែលអ្នកចង់ស្វែងរក។');
    const requestedLanguage = ['auto','km','zh','en'].includes(req.body?.language) ? req.body.language : 'auto';
    const tokens = assistantTerms(message);
    const budget = assistantBudget(message);
    const cutoff = new Date(Date.now() - productPublicMaxAgeMs).toISOString();
    try {
      let query = supabase.from('products')
        .select('id,title,description,price,stock,category,location,condition,created_at,renewed_at,vendor_id,product_images(id,file_id,image_url,sort_order),vendors!inner(id,store_name,status,store_logo_file_id)')
        .eq('status','active').gt('stock',0)
        .in('vendors.status',['approved','pending','rejected'])
        .or('renewed_at.gte.' + cutoff + ',and(renewed_at.is.null,created_at.gte.' + cutoff + ')')
        .order('created_at',{ascending:false}).limit(45);
      const textTokens = tokens.filter(token => /[a-z0-9]/i.test(token));
      if (textTokens.length) {
        const token = textTokens.sort((a,b) => b.length-a.length)[0].replace(/[%_,()]/g,'');
        if (token) query = query.or('title.ilike.%' + token + '%,description.ilike.%' + token + '%,category.ilike.%' + token + '%');
      }
      let { data, error } = await query;
      if (error && /renewed_at/i.test(error.message || '')) {
        let fallback = supabase.from('products')
          .select('id,title,description,price,stock,category,location,condition,created_at,vendor_id,product_images(id,file_id,image_url,sort_order),vendors!inner(id,store_name,status,store_logo_file_id)')
          .eq('status','active').gt('stock',0)
          .in('vendors.status',['approved','pending','rejected'])
          .gte('created_at',cutoff).order('created_at',{ascending:false}).limit(45);
        if (textTokens.length) {
          const token = textTokens.sort((a,b) => b.length-a.length)[0].replace(/[%_,()]/g,'');
          if (token) fallback = fallback.or('title.ilike.%' + token + '%,description.ilike.%' + token + '%,category.ilike.%' + token + '%');
        }
        ({ data, error } = await fallback);
      }
      if (error) throw error;
      const rows = data || [];
      const ids = rows.map(row => row.id).filter(Boolean);
      const [detailsResult, variantsResult] = ids.length ? await Promise.all([
        supabase.from('product_listing_details').select('product_id,specifications,subcategory,detail_type').in('product_id',ids),
        supabase.from('product_variants').select('product_id,price,stock').eq('is_active',true).in('product_id',ids).order('sort_order').order('price')
      ]) : [{data:[]},{data:[]}];
      const details = new Map((detailsResult.data || []).map(row => [String(row.product_id),row]));
      const variants = new Map();
      for (const row of variantsResult.data || []) {
        const key = String(row.product_id);
        if (!variants.has(key)) variants.set(key,[]);
        variants.get(key).push(row);
      }
      const scored = rows.map(row => {
        const detail = details.get(String(row.id));
        const options = variants.get(String(row.id)) || [];
        const inStockOptions = options.filter(item => Number(item.stock) > 0);
        const displayPrice = inStockOptions.length ? Math.min(...inStockOptions.map(item => Number(item.price))) : Number(row.price);
        const specs = detail?.specifications || {};
        const haystack = [row.title,row.description,row.category,detail?.subcategory,detail?.detail_type,JSON.stringify(specs)].join(' ').toLocaleLowerCase();
        const matchScore = tokens.reduce((score,token) => score + (haystack.includes(token) ? Math.min(5,token.length) : 0),0);
        const verifiedBonus = row.vendors?.status === 'approved' ? 1 : 0;
        const budgetPenalty = budget && Number.isFinite(displayPrice) && displayPrice > budget ? Math.min(10,(displayPrice-budget)/Math.max(1,budget)*4) : 0;
        return { ...row, specifications:specs, subcategory:detail?.subcategory || null, detail_type:detail?.detail_type || null, display_price:displayPrice, _rank:matchScore + verifiedBonus - budgetPenalty };
      }).sort((a,b) => b._rank-a._rank).slice(0,8);
      const trust = await ratingsFor(scored.map(row => row.vendor_id));
      const products = scored.map(row => publicProduct({
        ...row,
        seller_rating:trust[row.vendor_id]?.average ?? null,
        seller_review_count:trust[row.vendor_id]?.count ?? 0
      }));
      let detectedLanguage = requestedLanguage;
      if (detectedLanguage === 'auto') {
        detectedLanguage = /[\u4e00-\u9fff]/.test(message) ? 'zh' : /[a-z]/i.test(message) && !/[\u1780-\u17ff]/.test(message) ? 'en' : 'km';
      }
      let answer = null;
      try { answer = await askOpenSourceModel(message, detectedLanguage, products); }
      catch (modelError) { console.warn('7inOne assistant model fallback:', modelError.message); }
      return res.json({
        message: answer || assistantFallbackMessage(detectedLanguage, products.length),
        products, language: detectedLanguage, ai_enabled: Boolean(answer)
      });
    } catch (error) {
      console.error('7inOne shopping assistant failed:', error.message);
      return fail(res, 500, 'មិនអាចស្វែងរកផលិតផលបានទេ។ សូមព្យាយាមម្ដងទៀត។');
    }
  });
}
