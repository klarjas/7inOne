const SEARCH_ENDPOINT = 'https://html.duckduckgo.com/html/';
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;

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
  const match = String(tag).match(new RegExp('\\b' + name + '\\s*=\\s*(?:"([^"]*)"|\\'([^\\']*)\\'|([^\\s>]+))', 'i'));
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
  for (let index = 0; index < titles.length && results.length < 8; index++) {
    const tag = titles[index];
    const href = attribute(tag, 'href');
    const target = externalResultUrl(href);
    if (!target) continue;
    const title = stripHtml(tag.replace(/^<[\s\S]*?>/, '').replace(/<\/a>\s*$/, ''));
    const snippet = snippets[index] ? stripHtml(snippets[index]) : '';
    if (!title) continue;
    results.push({ title: title.slice(0, 220), snippet: snippet.slice(0, 420), ...target });
  }
  return results;
}

function monitorArmEvidence(results) {
  const pattern = /\bmonitor[\s-]*(?:arm|arms|mount|mounts|stand|stands)\b|\b(?:desk|screen)[\s-]*mount\b|\bvesa[\s-]*(?:arm|mount)\b|\bgas[\s-]*spring[\s-]*arm\b|giá đỡ màn hình|tay đỡ màn hình|tay arm màn hình|giá treo màn hình|tay nâng màn hình/i;
  const matches = results.filter(item => pattern.test(item.title + ' ' + item.snippet));
  const domains = [...new Set(matches.map(item => item.domain))];
  const official = matches.some(item => item.domain === 'hyperwork.vn' || item.domain.endsWith('.hyperwork.vn'));
  return { matches, domains, official };
}

export async function researchExternalProductCategory(product = {}) {
  const title = String(product.title || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 140);
  const code = String(product.supplier_product_code || '').trim().slice(0, 80);
  if (!title) return { status: 'needs_review', confidence: 'low', query: '', sources: [], reason: 'missing_product_title' };

  const query = [title, code, 'product type monitor arm accessories'].filter(Boolean).join(' ');
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
    const arm = monitorArmEvidence(results);
    const sources = arm.matches.slice(0, 5).map(({ title: sourceTitle, url, domain, snippet }) => ({
      title: sourceTitle, url, domain, snippet
    }));
    const confidence = arm.official || arm.domains.length >= 2 ? 'high' : arm.domains.length === 1 ? 'medium' : 'low';
    const confirmed = confidence === 'high';
    const dual = /\bdual\b|\bdouble\b|two[ -]arms?|2[ -]arms?|\bD\b/i.test(title);
    if (arm.matches.length) {
      return {
        status: confirmed ? 'confirmed' : 'needs_review',
        confidence,
        query,
        suggested_category: confirmed ? 'computer_accessories' : null,
        suggested_subcategory: confirmed ? 'monitor_arm' : null,
        suggested_detail_type: confirmed ? (dual ? 'Dual Monitor Arm' : 'Monitor Arm') : null,
        summary: confirmed
          ? (dual ? 'ប្រភពខាងក្រៅបញ្ជាក់ថាជា Dual Monitor Arm' : 'ប្រភពខាងក្រៅបញ្ជាក់ថាជា Monitor Arm')
          : 'រកឃើញប្រភពមួយ ប៉ុន្តែមិនទាន់គ្រប់គ្រាន់សម្រាប់បញ្ជាក់ Category ដោយស្វ័យប្រវត្តិ',
        sources
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
