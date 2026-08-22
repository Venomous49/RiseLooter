class RiseLooterHead {
  element(element) {
    element.append('<link rel="stylesheet" href="/creator-hd.css?v=23">', { html: true });
    element.append('<script src="/creator-cache-v23.js?v=27" defer></script>', { html: true });
    element.append('<script src="/safe-ui-bootstrap.js?v=base-hq-realesrgan-v2" defer></script>', { html: true });
    element.append('<script src="/fixed-stage-home.js?v=base-hq-realesrgan-v2" defer></script>', { html: true });
    element.append('<script src="/site-polish-v3.js?v=survey-only-8" defer></script>', { html: true });
    element.append('<script src="/evolution-test-mode.js?v=survey-only-2" defer></script>', { html: true });
    element.append('<script src="/cpx-integration.js?v=cpx-35504-v1" defer></script>', { html: true });
  }
}

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

async function md5Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('MD5', bytes);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function supabase(env, path, init = {}) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Supabase server secrets missing');
  const headers = new Headers(init.headers || {});
  headers.set('apikey', env.SUPABASE_SERVICE_ROLE_KEY);
  headers.set('authorization', `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`);
  if (init.body) headers.set('content-type', 'application/json');
  return fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, { ...init, headers });
}

async function handleCpxPostback(request, env) {
  if (!env.CPX_SECURITY_HASH) return json({ ok: false, error: 'CPX secret not configured' }, 503);
  const url = new URL(request.url);
  const p = url.searchParams;
  const status = p.get('status');
  const transId = p.get('trans_id');
  const userId = p.get('user_id');
  const amountUsd = Number(p.get('amount_usd') || 0);
  const offerId = p.get('offer_id') || null;
  const suppliedHash = (p.get('hash') || '').toLowerCase();
  if (!status || !transId || !userId || !suppliedHash || !Number.isFinite(amountUsd)) {
    return json({ ok: false, error: 'missing/invalid parameters' }, 400);
  }

  // CPX dashboard documents postback validation as md5(trans_id-yourappsecurehash).
  const expectedHash = await md5Hex(`${transId}-${env.CPX_SECURITY_HASH}`);
  if (!timingSafeEqual(suppliedHash, expectedHash)) return json({ ok: false, error: 'invalid hash' }, 403);

  // 70% of CPX publisher revenue is allocated to the user. 100 RL Coins = 1 EUR.
  // Store cents/coins as an integer to avoid floating point balance drift.
  const eurPerUsd = Number(env.CPX_EUR_PER_USD || 0.92);
  const rewardCoins = Math.max(0, Math.floor(amountUsd * eurPerUsd * 0.70 * 100));
  const payload = {
    p_provider: 'cpx',
    p_transaction_id: transId,
    p_user_id: userId,
    p_offer_id: offerId,
    p_status: status,
    p_amount_usd: amountUsd,
    p_reward_coins: rewardCoins
  };

  // Atomic DB function is the source of truth: UNIQUE(provider,transaction_id),
  // credit status=1 once; status=2 reverses that same transaction once.
  const res = await supabase(env, 'rpc/apply_partner_reward', { method: 'POST', body: JSON.stringify(payload) });
  const text = await res.text();
  if (!res.ok) return json({ ok: false, error: 'reward transaction failed', detail: text.slice(0, 300) }, 500);
  return json({ ok: true, transaction: transId, status, reward_coins: rewardCoins });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/cpx/postback') return handleCpxPostback(request, env);

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;
    const headers = new Headers(response.headers);
    headers.set('cache-control', 'no-store, no-cache, must-revalidate, max-age=0');
    headers.set('pragma', 'no-cache');
    headers.set('expires', '0');
    headers.set('x-riselooter-creator-source', 'canonical-stage-images');
    headers.set('x-riselooter-creator-version', 'base-hq-realesrgan-v2');
    headers.set('x-riselooter-runtime-hotfixes', 'survey-only-restored-v2-cpx-v1');
    return new HTMLRewriter().on('head', new RiseLooterHead()).transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));
  }
};
