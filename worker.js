class RiseLooterHead {
  element(element) {
    element.append('<link rel="stylesheet" href="/creator-hd.css?v=23">', { html: true });
    element.append('<script src="/creator-cache-v23.js?v=27" defer></script>', { html: true });
    element.append('<script src="/safe-ui-bootstrap.js?v=base-hq-realesrgan-v2" defer></script>', { html: true });
    element.append('<script src="/fixed-stage-home.js?v=base-hq-realesrgan-v2" defer></script>', { html: true });
    element.append('<script src="/site-polish-v3.js?v=survey-only-8" defer></script>', { html: true });
    element.append('<script src="/evolution-test-mode.js?v=survey-only-2" defer></script>', { html: true });
    element.append('<script src="/cpx-integration.js?v=cpx-35504-v1" defer></script>', { html: true });
    element.append('<script src="/admin-dashboard.js?v=admin-v1" defer></script>', { html: true });
  }
}

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

function md5Hex(input) {
  const s = unescape(encodeURIComponent(String(input)));
  const add = (x, y) => (((x & 0xffff) + (y & 0xffff)) + ((((x >>> 16) + (y >>> 16)) & 0xffff) << 16)) | 0;
  const rol = (n, c) => (n << c) | (n >>> (32 - c));
  const cmn = (q, a, b, x, sft, t) => add(rol(add(add(a, q), add(x, t)), sft), b);
  const ff = (a,b,c,d,x,sft,t) => cmn((b & c) | ((~b) & d), a,b,x,sft,t);
  const gg = (a,b,c,d,x,sft,t) => cmn((b & d) | (c & (~d)), a,b,x,sft,t);
  const hh = (a,b,c,d,x,sft,t) => cmn(b ^ c ^ d, a,b,x,sft,t);
  const ii = (a,b,c,d,x,sft,t) => cmn(c ^ (b | (~d)), a,b,x,sft,t);
  const blocks = [];
  let i;
  for (i = 0; i < s.length; i++) blocks[i >> 2] = (blocks[i >> 2] || 0) | (s.charCodeAt(i) << ((i % 4) * 8));
  blocks[i >> 2] = (blocks[i >> 2] || 0) | (0x80 << ((i % 4) * 8));
  blocks[(((i + 8) >> 6) + 1) * 16 - 2] = s.length * 8;
  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (i = 0; i < blocks.length; i += 16) {
    const oa=a, ob=b, oc=c, od=d;
    a=ff(a,b,c,d,blocks[i+0]||0,7,-680876936); d=ff(d,a,b,c,blocks[i+1]||0,12,-389564586); c=ff(c,d,a,b,blocks[i+2]||0,17,606105819); b=ff(b,c,d,a,blocks[i+3]||0,22,-1044525330);
    a=ff(a,b,c,d,blocks[i+4]||0,7,-176418897); d=ff(d,a,b,c,blocks[i+5]||0,12,1200080426); c=ff(c,d,a,b,blocks[i+6]||0,17,-1473231341); b=ff(b,c,d,a,blocks[i+7]||0,22,-45705983);
    a=ff(a,b,c,d,blocks[i+8]||0,7,1770035416); d=ff(d,a,b,c,blocks[i+9]||0,12,-1958414417); c=ff(c,d,a,b,blocks[i+10]||0,17,-42063); b=ff(b,c,d,a,blocks[i+11]||0,22,-1990404162);
    a=ff(a,b,c,d,blocks[i+12]||0,7,1804603682); d=ff(d,a,b,c,blocks[i+13]||0,12,-40341101); c=ff(c,d,a,b,blocks[i+14]||0,17,-1502002290); b=ff(b,c,d,a,blocks[i+15]||0,22,1236535329);
    a=gg(a,b,c,d,blocks[i+1]||0,5,-165796510); d=gg(d,a,b,c,blocks[i+6]||0,9,-1069501632); c=gg(c,d,a,b,blocks[i+11]||0,14,643717713); b=gg(b,c,d,a,blocks[i+0]||0,20,-373897302);
    a=gg(a,b,c,d,blocks[i+5]||0,5,-701558691); d=gg(d,a,b,c,blocks[i+10]||0,9,38016083); c=gg(c,d,a,b,blocks[i+15]||0,14,-660478335); b=gg(b,c,d,a,blocks[i+4]||0,20,-405537848);
    a=gg(a,b,c,d,blocks[i+9]||0,5,568446438); d=gg(d,a,b,c,blocks[i+14]||0,9,-1019803690); c=gg(c,d,a,b,blocks[i+3]||0,14,-187363961); b=gg(b,c,d,a,blocks[i+8]||0,20,1163531501);
    a=gg(a,b,c,d,blocks[i+13]||0,5,-1444681467); d=gg(d,a,b,c,blocks[i+2]||0,9,-51403784); c=gg(c,d,a,b,blocks[i+7]||0,14,1735328473); b=gg(b,c,d,a,blocks[i+12]||0,20,-1926607734);
    a=hh(a,b,c,d,blocks[i+5]||0,4,-378558); d=hh(d,a,b,c,blocks[i+8]||0,11,-2022574463); c=hh(c,d,a,b,blocks[i+11]||0,16,1839030562); b=hh(b,c,d,a,blocks[i+14]||0,23,-35309556);
    a=hh(a,b,c,d,blocks[i+1]||0,4,-1530992060); d=hh(d,a,b,c,blocks[i+4]||0,11,1272893353); c=hh(c,d,a,b,blocks[i+7]||0,16,-155497632); b=hh(b,c,d,a,blocks[i+10]||0,23,-1094730640);
    a=hh(a,b,c,d,blocks[i+13]||0,4,681279174); d=hh(d,a,b,c,blocks[i+0]||0,11,-358537222); c=hh(c,d,a,b,blocks[i+3]||0,16,-722521979); b=hh(b,c,d,a,blocks[i+6]||0,23,76029189);
    a=hh(a,b,c,d,blocks[i+9]||0,4,-640364487); d=hh(d,a,b,c,blocks[i+12]||0,11,-421815835); c=hh(c,d,a,b,blocks[i+15]||0,16,530742520); b=hh(b,c,d,a,blocks[i+2]||0,23,-995338651);
    a=ii(a,b,c,d,blocks[i+0]||0,6,-198630844); d=ii(d,a,b,c,blocks[i+7]||0,10,1126891415); c=ii(c,d,a,b,blocks[i+14]||0,15,-1416354905); b=ii(b,c,d,a,blocks[i+5]||0,21,-57434055);
    a=ii(a,b,c,d,blocks[i+12]||0,6,1700485571); d=ii(d,a,b,c,blocks[i+3]||0,10,-1894986606); c=ii(c,d,a,b,blocks[i+10]||0,15,-1051523); b=ii(b,c,d,a,blocks[i+1]||0,21,-2054922799);
    a=ii(a,b,c,d,blocks[i+8]||0,6,1873313359); d=ii(d,a,b,c,blocks[i+15]||0,10,-30611744); c=ii(c,d,a,b,blocks[i+6]||0,15,-1560198380); b=ii(b,c,d,a,blocks[i+13]||0,21,1309151649);
    a=ii(a,b,c,d,blocks[i+4]||0,6,-145523070); d=ii(d,a,b,c,blocks[i+11]||0,10,-1120210379); c=ii(c,d,a,b,blocks[i+2]||0,15,718787259); b=ii(b,c,d,a,blocks[i+9]||0,21,-343485551);
    a=add(a,oa); b=add(b,ob); c=add(c,oc); d=add(d,od);
  }
  const hex = n => [0,8,16,24].map(sh => ((n >>> sh) & 0xff).toString(16).padStart(2,'0')).join('');
  return hex(a)+hex(b)+hex(c)+hex(d);
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

async function requireAdmin(request, env) {
  if (!env.ADMIN_USER_ID) return { ok: false, response: json({ ok:false, error:'admin not configured' }, 503) };
  const auth = request.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return { ok:false, response: json({ ok:false, error:'authentication required' }, 401) };
  const token = auth.slice(7);
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, authorization: `Bearer ${token}` }
  });
  if (!res.ok) return { ok:false, response: json({ ok:false, error:'invalid session' }, 401) };
  const user = await res.json();
  if (!user?.id || user.id !== env.ADMIN_USER_ID) return { ok:false, response: json({ ok:false, error:'forbidden' }, 403) };
  return { ok:true, user };
}

async function handleAdminSummary(request, env) {
  const guard = await requireAdmin(request, env);
  if (!guard.ok) return guard.response;

  const [profilesRes, txRes] = await Promise.all([
    supabase(env, 'profiles?select=id,lootix_available'),
    supabase(env, 'partner_reward_transactions?select=transaction_id,status,amount_usd,user_share_usd,publisher_share_usd,reward_coins,credited,reversed,created_at&order=created_at.desc&limit=500')
  ]);
  if (!profilesRes.ok || !txRes.ok) return json({ ok:false, error:'admin data unavailable' }, 500);
  const profiles = await profilesRes.json();
  const txs = await txRes.json();
  const active = txs.filter(t => t.credited && !t.reversed);
  const validatedGrossUsd = active.reduce((s,t)=>s+Number(t.amount_usd||0),0);
  const publisherBalanceUsd = active.reduce((s,t)=>s+Number(t.publisher_share_usd||0),0);
  const userShareUsd = active.reduce((s,t)=>s+Number(t.user_share_usd||0),0);
  const userRlCoins = profiles.reduce((s,p)=>s+Number(p.lootix_available||0),0);
  return json({
    ok:true,
    users_count: profiles.length,
    validated_gross_usd: Number(validatedGrossUsd.toFixed(6)),
    publisher_balance_usd: Number(publisherBalanceUsd.toFixed(6)),
    user_share_usd: Number(userShareUsd.toFixed(6)),
    user_rl_coins: userRlCoins,
    user_balance_eur: Number((userRlCoins / 100).toFixed(2)),
    recent_transactions: txs.slice(0,50)
  });
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
  if (!['1','2'].includes(status) || !transId || !userId || !suppliedHash || !Number.isFinite(amountUsd) || amountUsd < 0) {
    return json({ ok: false, error: 'missing/invalid parameters' }, 400);
  }

  const expectedHash = md5Hex(`${transId}-${env.CPX_SECURITY_HASH}`);
  if (!timingSafeEqual(suppliedHash, expectedHash)) return json({ ok: false, error: 'invalid hash' }, 403);

  const eurPerUsd = Number(env.CPX_EUR_PER_USD || 0.92);
  if (!Number.isFinite(eurPerUsd) || eurPerUsd <= 0) return json({ ok: false, error: 'invalid exchange-rate configuration' }, 503);

  const userShareUsd = amountUsd * 0.70;
  const publisherShareUsd = amountUsd * 0.30;
  const rewardCoins = Math.max(0, Math.floor(userShareUsd * eurPerUsd * 100));
  const payload = {
    p_provider: 'cpx', p_transaction_id: transId, p_user_id: userId,
    p_offer_id: offerId, p_status: status, p_amount_usd: amountUsd,
    p_reward_coins: rewardCoins
  };

  const res = await supabase(env, 'rpc/apply_partner_reward', { method: 'POST', body: JSON.stringify(payload) });
  const text = await res.text();
  if (!res.ok) return json({ ok: false, error: 'reward transaction failed', detail: text.slice(0, 300) }, 500);

  return json({
    ok: true,
    transaction: transId,
    status,
    gross_amount_usd: amountUsd,
    user_share_usd: Number(userShareUsd.toFixed(6)),
    publisher_share_usd: Number(publisherShareUsd.toFixed(6)),
    reward_coins: rewardCoins
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/cpx/postback') return handleCpxPostback(request, env);
    if (url.pathname === '/api/admin/summary') return handleAdminSummary(request, env);

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;
    const headers = new Headers(response.headers);
    headers.set('cache-control', 'no-store, no-cache, must-revalidate, max-age=0');
    headers.set('pragma', 'no-cache');
    headers.set('expires', '0');
    headers.set('x-riselooter-creator-source', 'canonical-stage-images');
    headers.set('x-riselooter-creator-version', 'base-hq-realesrgan-v2');
    headers.set('x-riselooter-runtime-hotfixes', 'survey-only-restored-v2-cpx-v5-admin');
    return new HTMLRewriter().on('head', new RiseLooterHead()).transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));
  }
};
