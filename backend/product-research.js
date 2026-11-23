const SEARCH_ENDPOINT = 'https://html.duckduckgo.com/html/';
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
const OFFICIAL_PRODUCT_DOMAINS = new Set([
  'hyperwork.vn', 'asus.com', 'logitech.com', 'dell.com', 'hp.com',
  'acer.com', 'lenovo.com', 'samsung.com', 'apple.com', 'razer.com',
  'msi.com', 'kingston.com', 'tp-link.com', 'microsoft.com'
]);

const CATEGORY_RULES = [
  { key: 'monitor_arm', category: 'computer_accessories', subcategory: 'monitor_arm', detail_type: 'Monitor Arm', pattern: /\bmonitor[\s-]*(?:arm|arms|mount|mounts|stand|stands)\b|\b(?:desk|screen)[\s-]*mount\b|\bvesa[\s-]*(?:arm|mount)\b|\bgas[\s-]*spring[\s-]*arm\b|giá đỡ màn hình|tay đỡ màn hình|tay arm màn hình|giá treo màn hình|tay nâng màn hình/i },
  { key: 'computer_bag', category: 'computer_accessories', subcategory: 'bag', detail_type: 'Computer Bag', pattern: /\b(?:laptop|notebook|computer)[\s-]*bags?\b/i },
  { key: 'keyboard', category: 'computer_accessories', subcategory: 'keyboard', detail_type: 'Keyboard', pattern: /\b(?:mechanical|wireless|gaming)?\s*keyboard\b|\bkeypad\b/i },
  { key: 'mouse', category: 'computer_accessories', subcategory: 'mouse', detail_type: 'Mouse', pattern: /\b(?:computer|wireless|gaming)?\s*mouse\b|\btrackball\b/i },
  { key: 'charger', category: 'computer_accessories', subcategory: 'charger', detail_type: 'Charger', pattern: /\b(?:laptop|notebook|usb[- ]?c|power)?\s*chargers?\b|\bpower adapters?\b/i },
  { key: 'cable_adapter', category: 'computer_accessories', subcategory: 'cable_adapter', detail_type: 'Cable / Adapter', pattern: /\b(?:usb[- ]?hub|docking station|dongle|displayport cable|hdmi cable|usb cable|adapter)\b/i },
  { key: 'laptop', category: 'computers', subcategory: 'laptop', detail_type: 'Laptop', pattern: /\b(?:laptop|notebook|ultrabook|chromebook|macbook)\b/i },
  { key: 'desktop', category: 'computers', subcategory: 'desktop', detail_type: 'Desktop', pattern: /\b(?:desktop pc|desktop computer|mini pc|mini computer|pc tower|workstation)\b/i },
  { key: 'tablet', category: 'computers', subcategory: 'tablet', detail_type: 'Tablet', pattern: /\b(?:tablet|ipad|android tab)\b/i },
  { key: 'monitor', category: 'computers', subcategory: 'monitor', detail_type: 'Monitor', pattern: /\b(?:gaming|computer|lcd|led|oled|curved|ultrawide)\s+monitor\b|\bmonitor display\b|\bdisplay panel\b/i },
  { key: 'mobile_accessories', category: 'mobile_accessories', subcategory: 'phone_accessories', detail_type: 'Mobile Accessories', pattern: /\b(?:phone case|mobile case|screen protector|phone holder|phone mount)\b/i },
  { key: 'mobile', category: 'mobile', subcategory: 'smartphone', detail_type: 'Smartphone', pattern: /\b(?:smartphone|mobile phone|iphone|android phone)\b/i },
  { key: 'audio', category: 'audio', subcategory: 'audio_devices', detail_type: 'Audio Device', pattern: /\b(?:headphones?|headsets?|earbuds?|speakers?|microphones?|soundbar)\b/i },
  { key: 'networking', category: 'networking', subcategory: 'network_devices', detail_type: 'Networking Device', pattern: /\b(?:router|mesh wi-?fi|wireless access point|network switch|ethernet adapter|wifi adapter)\b/i },
  { key: 'storage', category: 'storage', subcategory: 'storage_drive', detail_type: 'Storage Device', pattern: /\b(?:solid state drive|ssd|hard disk drive|hdd|portable ssd|usb flash drive|memory card)\b/i },
  { key: 'components', category: 'components', subcategory: 'pc_components', detail_type: 'Computer Component', pattern: /\b(?:motherboard|graphics card|video card|desktop memory|ddr[345]\s+ram|power supply unit|cpu processor|computer case)\b/i },
  { key: 'printer', category: 'other', subcategory: 'printer', detail_type: 'Printer', pattern: /\b(?:laser printer|inkjet printer|all-in-one printer|multifunction printer|document scanner)\b/i }
];

function decodeHtml(value = '') {
  return String(value)
    .replace(/&amp;/gi, '&').replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'").replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, ' ')
    .replace(/&#(\d+);/g, (_match, number) => {
      const code = Number(number);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
    });
}

function stripHtml(value = '') {
  return decodeHtml(String(value).replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ').trim();
}

function attribute(tag, name) {
  const match = String(tag).match(new RegExp("\\b" + name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i"));
  return decodeHtml(match?.[1] ?? match?.[2] ?? match?.[3] ?? '');
}

function externalResultUrl(raw) {
  try {
    let url = new URL(decodeHtml(raw), SEARCH_ENDPOINT);
    const redirected = url.searchParams.get('uddg');
    if (redirected) url = new URL(redirected);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (!host || host === 'duckduckgo.com' || host.endsWith('.duckduckgo.com') ||
        host === 'cccomputerkh.com') return null;
    url.hash = '';
    return { url: url.href, domain: host };
  } catch {
    return null;
  }
}

function extractSearchResults(html) {
  const anchors = [...String(html).matchAll(/<a\b[^>]*>[^]*?<\/a>/gi)].map(match => match[0]);
  const titles = anchors.filter(tag => /class=["'][^"']*\bresult__a\b/i.test(tag));
  const snippets = anchors.filter(tag => /class=["'][^"']*\bresult__snippet\b/i.test(tag));
  const results = [];
  for (let index = 0; index < titles.length && results.length < 10; index++) {
    const tag = titles[index];
    const target = externalResultUrl(attribute(tag, 'href'));
    if (!target) continue;
    const title = stripHtml(tag.replace(/^<[\s\S]*?>/, '').replace(/<\/a>\s*$/, ''));
    const snippet = snippets[index] ? stripHtml(snippets[index]) : '';
    if (!title) continue;
    results.push({ title: title.slice(0, 220), snippet: snippet.slice(0, 420), ...target });
  }
  return results;
}

function classifyExternalResults(results, productTitle) {
  const candidates = [];
  for (const rule of CATEGORY_RULES) {
    const matches = results.filter(item => rule.pattern.test(item.title + ' ' + item.snippet));
    if (!matches.length) continue;
    const domains = [...new Set(matches.map(item => item.domain))];
    const official = matches.some(item => [...OFFICIAL_PRODUCT_DOMAINS].some(domain =>
      item.domain === domain || item.domain.endsWith('.' + domain)
    ));
    const titleMatches = matches.filter(item => rule.pattern.test(item.title)).length;
    const confidence = official || domains.length >= 2 ? 'high' : 'medium';
    const score = domains.length * 3 + titleMatches * 2 + (official ? 5 : 0);
    candidates.push({ rule, matches, domains, official, confidence, score });
  }
  candidates.sort((a, b) => b.score - a.score);
  if (!candidates.length) return null;
  const winner = candidates[0];
  const runnerUp = candidates[1];
  if (runnerUp && runnerUp.confidence === 'high' && winner.score - runnerUp.score < 3) {
    return {
      status: 'needs_review', confidence: 'low',
      summary: 'ប្រភពខាងក្រៅបង្ហាញប្រភេទផលិតផលខុសគ្នា ត្រូវឱ្យ Admin ពិនិត្យ',
      sources: [...winner.matches, ...runnerUp.matches].slice(0, 6)
    };
  }
  const dual = /\bdual\b|\bdouble\b|two[ -]arms?|2[ -]arms?|\bD\b/i.test(productTitle);
  const detailType = winner.rule.key === 'monitor_arm' && dual ? 'Dual Monitor Arm' : winner.rule.detail_type;
  return {
    status: winner.confidence === 'high' ? 'confirmed' : 'needs_review',
    confidence: winner.confidence,
    suggested_category: winner.confidence === 'high' ? winner.rule.category : null,
    suggested_subcategory: winner.confidence === 'high' ? winner.rule.subcategory : null,
    suggested_detail_type: winner.confidence === 'high' ? detailType : null,
    summary: winner.confidence === 'high'
      ? 'ប្រភពខាងក្រៅបានផ្ទៀងផ្ទាត់៖ ' + detailType
      : 'រកឃើញប្រភពមួយ ប៉ុន្តែមិនទាន់គ្រប់គ្រាន់សម្រាប់បញ្ជាក់ Category ដោយស្វ័យប្រវត្តិ',
    sources: winner.matches.slice(0, 5)
  };
}

export async function researchExternalProductCategory(product = {}) {
  const title = String(product.title || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 140);
  const code = String(product.supplier_product_code || '').trim().slice(0, 80);
  if (!title) return { status: 'needs_review', confidence: 'low', query: '', sources: [], reason: 'missing_product_title' };

  const query = [title, code, 'product category model specifications'].filter(Boolean).join(' ');
  const searchUrl = SEARCH_ENDPOINT + '?q=' + encodeURIComponent(query);
  try {
    const response = await fetch(searchUrl, {
      redirect: 'error',
      signal: AbortSignal.timeout(10000),
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; 7inOneProductResearch/1.0)',
        accept: 'text/html,application/xhtml+xml'
      }
    });
    if (!response.ok) throw new Error('Search provider HTTP ' + response.status);
    const declared = Number(response.headers.get('content-length') || 0);
    if (declared > MAX_RESPONSE_BYTES) throw new Error('Search response too large');
    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length || buffer.length > MAX_RESPONSE_BYTES) throw new Error('Search response empty or too large');
    const results = extractSearchResults(buffer.toString('utf8'));
    const classified = classifyExternalResults(results, title);
    if (classified) {
      return {
        ...classified,
        query,
        sources: (classified.sources || []).map(({ title: sourceTitle, url, domain, snippet }) => ({
          title: sourceTitle, url, domain, snippet
        }))
      };
    }
    return {
      status: 'needs_review', confidence: 'low', query, sources: [],
      summary: 'មិនទាន់រកឃើញភស្តុតាងខាងក្រៅគ្រប់គ្រាន់សម្រាប់កំណត់ប្រភេទផលិតផល'
    };
  } catch (error) {
    return {
      status: 'needs_review', confidence: 'low', query, sources: [],
      summary: 'External search មិនអាចដំណើរការបាន៖ ' + String(error?.message || 'unknown error').slice(0, 140)
    };
  }
}
