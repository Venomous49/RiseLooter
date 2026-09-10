class RiseLooterHead {
  element(element) {
    element.append('<link rel="stylesheet" href="/creator-hd.css?v=23">', { html: true });
    element.append('<script src="/creator-cache-v23.js?v=stability-v13" defer></script>', { html: true });
    element.append('<script src="/safe-ui-bootstrap.js?v=base-hq-realesrgan-v2" defer></script>', { html: true });
    element.append('<script src="/fixed-stage-home.js?v=stability-v11" defer></script>', { html: true });
    element.append('<script src="/silhouette-stage-locks.js?v=stability-v11" defer></script>', { html: true });
    element.append('<script src="/evolution-test-mode.js?v=stability-v13" defer></script>', { html: true });
    element.append('<script src="/admin-dashboard.js?v=stability-v13" defer></script>', { html: true });
    element.append('<script src="/offerwallgg-stable-v8.js?v=20260910-detailed-v82" defer></script>', { html: true });
    element.append('<script src="/production-recovery-v3.js?v=20260910-rewards-v34" defer></script>', { html: true });
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
    a=ii(a,b,c,d,blocks[i+12]||0,6,1700485571); d=ii(d,a,b,c,blocks[i+3]||0,10,-1894986606); c=ii(c,d,a,b,blocks[i+10]||0,15,-1051523); b=ii(b,c,d,blocks[i+1]||0,21,-2054922799);
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

async function requireUser(request, env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return { ok:false, response:json({ ok:false, error:'authentication unavailable' },503) };
  const auth = request.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return { ok:false, response:json({ ok:false, error:'authentication required' },401) };
  const token = auth.slice(7);
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, authorization: `Bearer ${token}` }
  });
  if (!res.ok) return { ok:false, response:json({ ok:false, error:'invalid session' },401) };
  const user = await res.json();
  if (!user?.id) return { ok:false, response:json({ ok:false, error:'invalid session' },401) };
  return { ok:true, user };
}

async function requireAdmin(request, env) {
  if (!env.ADMIN_USER_ID) return { ok: false, response: json({ ok:false, error:'admin not configured' }, 503) };
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard;
  if (guard.user.id !== env.ADMIN_USER_ID) return { ok:false, response: json({ ok:false, error:'forbidden' }, 403) };
  return guard;
}

async function handleCpxConfig(request, env) {
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;
  const secret = env.CPX_APP_SECURE_HASH || '';
  return json({
    ok: true,
    app_id: 35504,
    ext_user_id: String(guard.user.id),
    secure_hash: secret ? md5Hex(`${guard.user.id}-${secret}`) : '',
    secure_hash_enabled: Boolean(secret)
  });
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
  if (!res.ok) return json({ ok: false, error: 'reward transaction failed' }, 500);

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


async function hmacSha256Hex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(String(secret)), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(String(message)));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2,'0')).join('');
}

function offerwallUserCoinRate(env) {
  const userShare = Number(env.OFFERWALL_USER_SHARE || 0.70);
  const eurPerUsd = Number(env.OFFERWALL_EUR_PER_USD || env.CPX_EUR_PER_USD || 0.92);
  if (!Number.isFinite(userShare) || userShare <= 0 || userShare >= 1) return 64.4;
  if (!Number.isFinite(eurPerUsd) || eurPerUsd <= 0) return userShare * 0.92 * 100;
  return userShare * eurPerUsd * 100;
}

function offerwallExactUserCoins(rawReward, payoutUsd, providerPerUsd, env) {
  let grossUsd = Number(payoutUsd);
  if (!Number.isFinite(grossUsd) || grossUsd < 0) grossUsd = NaN;
  if (!Number.isFinite(grossUsd)) {
    const reward = Number(rawReward);
    const perUsd = Number(providerPerUsd);
    if (Number.isFinite(reward) && reward >= 0 && Number.isFinite(perUsd) && perUsd > 0) {
      grossUsd = reward / perUsd;
    } else {
      grossUsd = 0;
    }
  }
  return Math.max(0, grossUsd * offerwallUserCoinRate(env));
}

function offerwallXpForCoins(value) {
  const coins = Math.max(0, Number(value || 0));
  return Math.max(20, Math.ceil(coins * 20));
}

function formatRlCoins(value) {
  const n = Number(value || 0);
  const digits = n < 10 ? 2 : n < 100 ? 1 : 0;
  return n.toLocaleString('fr-FR', { maximumFractionDigits: digits }) + ' RL Coins';
}

async function handleOfferwallGgConfig(request, env) {
  if (!env.OFFERWALL_GG_SECRET) return json({ ok:false, error:'Offerwall.GG not configured' },503);
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;

  const publicKey = '4a24e196199092a1cd5e42280a9cfedb';
  const userId = String(guard.user.id);
  // Offerwall.GG entry signature: sorted appId + userId query parameters.
  const canonical = 'appId=' + publicKey + '&userId=' + userId;
  const signature = await hmacSha256Hex(env.OFFERWALL_GG_SECRET, canonical);
  const wallUrl = 'https://offerwall.gg/wall/' + publicKey
    + '?userId=' + encodeURIComponent(userId)
    + '&signature=' + signature;

  return json({ ok:true, wall_url:wallUrl });
}

async function handleOfferwallGgOffers(request, env) {
  if (!env.OFFERWALL_GG_SECRET) return json({ ok:false, error:'Offerwall.GG not configured' },503);
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;

  const publicKey = '4a24e196199092a1cd5e42280a9cfedb';
  const userId = String(guard.user.id);
  const apiUrl = new URL('https://offerwall.gg/api/v1/offers');
  apiUrl.searchParams.set('appId', publicKey);
  apiUrl.searchParams.set('userId', userId);
  apiUrl.searchParams.set('limit', '50');

  try {
    const endUserIp = (request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '').split(',')[0].trim();
    const endUserAgent = request.headers.get('user-agent') || '';
    const upstreamHeaders = {
      'X-Api-Key': env.OFFERWALL_GG_SECRET,
      'accept':'application/json'
    };
    if (endUserIp) {
      upstreamHeaders['X-Forwarded-For'] = endUserIp;
      upstreamHeaders['X-Real-IP'] = endUserIp;
    }
    if (endUserAgent) upstreamHeaders['User-Agent'] = endUserAgent;

    const upstream = await fetch(apiUrl.toString(), {
      headers: upstreamHeaders,
      cache: 'no-store'
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok || data?.success === false) return json({ ok:false, error:'Offerwall.GG inventory unavailable' },502);
    const offers = Array.isArray(data?.data?.offers) ? data.data.offers : [];
    const providerCurrency = data?.data?.currency || null;
    const providerPerUsd = Number(providerCurrency?.perUsd || 0);
    return json({
      ok:true,
      offers: offers.map(o => {
        const userReward = offerwallExactUserCoins(o.reward, o.payoutUsd, providerPerUsd, env);
        return {
          id:o.id,
          name:o.name || 'Jeu rémunéré',
          requirements:o.requirements || '',
          reward:Number(userReward.toFixed(6)),
          rewardFormatted:formatRlCoins(userReward),
          xpReward:offerwallXpForCoins(userReward),
          rewardIsVariable:Boolean(o.rewardIsVariable),
          clickUrl:o.clickUrl || '',
          platforms: Array.isArray(o.platforms) ? o.platforms
            : Array.isArray(o.devices) ? o.devices
            : Array.isArray(o.deviceTypes) ? o.deviceTypes
            : (o.platform ? [o.platform] : o.os ? [o.os] : []),
          category: o.category || o.type || ''
        };
      }).filter(o => o.clickUrl),
      currency:{ name:'RL Coins', perUsd:offerwallUserCoinRate(env) }
    });
  } catch (_) {
    return json({ ok:false, error:'Offerwall.GG inventory unavailable' },502);
  }
}

async function fetchOfferwallPlacementPerUsd(publicKey, userId, headers) {
  try {
    const u = new URL('https://offerwall.gg/api/v1/offers');
    u.searchParams.set('appId', publicKey);
    u.searchParams.set('userId', userId);
    u.searchParams.set('limit', '1');
    const res = await fetch(u.toString(), { headers, cache:'no-store' });
    const data = await res.json().catch(()=>({}));
    const perUsd = Number(data?.data?.currency?.perUsd || 0);
    return Number.isFinite(perUsd) && perUsd > 0 ? perUsd : 0;
  } catch (_) {
    return 0;
  }
}

async function handleOfferwallGgOfferDetail(request, env, offerId) {
  if (!env.OFFERWALL_GG_SECRET) return json({ ok:false, error:'Offerwall.GG not configured' },503);
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;

  const publicKey = '4a24e196199092a1cd5e42280a9cfedb';
  const userId = String(guard.user.id);
  const apiUrl = new URL('https://offerwall.gg/api/v1/offers/' + encodeURIComponent(offerId));
  apiUrl.searchParams.set('appId', publicKey);
  apiUrl.searchParams.set('userId', userId);

  try {
    const endUserIp = (request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '').split(',')[0].trim();
    const endUserAgent = request.headers.get('user-agent') || '';
    const headers = { 'X-Api-Key': env.OFFERWALL_GG_SECRET, 'accept':'application/json' };
    if (endUserIp) {
      headers['X-Forwarded-For'] = endUserIp;
      headers['X-Real-IP'] = endUserIp;
    }
    if (endUserAgent) headers['User-Agent'] = endUserAgent;

    const upstream = await fetch(apiUrl.toString(), { headers, cache:'no-store' });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok || data?.success === false) return json({ ok:false, error:'Offerwall.GG offer details unavailable' },502);

    const root = data?.data?.offer || data?.data || data?.offer || data;
    const rawGoals = Array.isArray(root?.goals) ? root.goals
      : Array.isArray(root?.goalLadder) ? root.goalLadder
      : Array.isArray(root?.milestones) ? root.milestones
      : Array.isArray(root?.steps) ? root.steps
      : [];

    const detailCurrency = data?.data?.currency || data?.currency || root?.currency || null;
    let providerPerUsd = Number(detailCurrency?.perUsd || 0);
    if (!Number.isFinite(providerPerUsd) || providerPerUsd <= 0) {
      providerPerUsd = await fetchOfferwallPlacementPerUsd(publicKey, userId, headers);
    }
    const goals = rawGoals.map((g, index) => {
      const rawReward = g?.reward ?? g?.currencyAmount ?? g?.amount ?? 0;
      const exactReward = offerwallExactUserCoins(rawReward, g?.payoutUsd ?? g?.payout, providerPerUsd, env);
      return {
        id: g?.id ?? index,
        title: g?.name || g?.title || g?.goal || g?.description || ('Étape ' + (index + 1)),
        description: g?.description || g?.requirements || g?.requirement || '',
        reward: Number(exactReward.toFixed(6)),
        rewardFormatted: formatRlCoins(exactReward),
        xpReward: offerwallXpForCoins(exactReward)
      };
    });

    return json({
      ok:true,
      offer:{
        id: root?.id || offerId,
        name: root?.name || root?.title || 'Jeu rémunéré',
        requirements: root?.requirements || root?.description || '',
        reward: Number(offerwallExactUserCoins(root?.reward ?? 0, root?.payoutUsd ?? root?.payout, providerPerUsd, env).toFixed(6)),
        rewardFormatted: formatRlCoins(offerwallExactUserCoins(root?.reward ?? 0, root?.payoutUsd ?? root?.payout, providerPerUsd, env)),
        xpReward: offerwallXpForCoins(offerwallExactUserCoins(root?.reward ?? 0, root?.payoutUsd ?? root?.payout, providerPerUsd, env)),
        goals
      }
    });
  } catch (_) {
    return json({ ok:false, error:'Offerwall.GG offer details unavailable' },502);
  }
}

async function handleRlHistory(request, env) {
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;

  const [offerwallRes, legacyRes] = await Promise.all([
    supabase(env,
      'partner_reward_transactions?provider=eq.offerwallgg&user_id=eq.' + encodeURIComponent(guard.user.id) +
      '&select=transaction_id,offer_id,status,reward_coins_exact,reward_coins,credited,reversed,created_at&order=created_at.desc&limit=100'
    ),
    supabase(env,
      'lootix_transactions?user_id=eq.' + encodeURIComponent(guard.user.id) +
      '&status=eq.confirmed&select=id,amount,source_type,description,created_at&order=created_at.desc&limit=100'
    )
  ]);

  if (!offerwallRes.ok || !legacyRes.ok) return json({ok:false,error:'rl history unavailable'},500);

  const offerwall = await offerwallRes.json();
  const legacy = await legacyRes.json();
  const history = [];

  for (const tx of offerwall) {
    const exact = Number(tx.reward_coins_exact ?? tx.reward_coins ?? 0);
    if (tx.credited && !tx.reversed) {
      history.push({
        id:'ow-'+tx.transaction_id,
        amount:exact,
        source_type:'offerwall_mission',
        title:'Mission de jeu validée',
        description:tx.offer_id ? ('Offre '+tx.offer_id) : 'Offerwall.GG',
        created_at:tx.created_at
      });
    } else if (tx.reversed) {
      history.push({
        id:'ow-rev-'+tx.transaction_id,
        amount:-Math.abs(exact),
        source_type:'offerwall_reversal',
        title:'Récompense annulée',
        description:tx.offer_id ? ('Offre '+tx.offer_id) : 'Offerwall.GG',
        created_at:tx.created_at
      });
    }
  }

  for (const tx of legacy) {
    const amount = Number(tx.amount || 0);
    if (!amount) continue;
    history.push({
      id:'lt-'+tx.id,
      amount,
      source_type:tx.source_type || 'reward',
      title:tx.source_type === 'daily_chest' ? 'Coffre quotidien' : 'Gain de RL Coins',
      description:tx.description || '',
      created_at:tx.created_at
    });
  }

  history.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  return json({ok:true,history:history.slice(0,100)});
}

async function handleXpHistory(request, env) {
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;

  const res = await supabase(env,
    'xp_history?user_id=eq.' + encodeURIComponent(guard.user.id) +
    '&select=id,amount,source_type,source_id,title,description,created_at&order=created_at.desc&limit=100'
  );
  if (!res.ok) return json({ok:false,error:'xp history unavailable'},500);

  const history = await res.json();
  return json({
    ok:true,
    daily_streak_xp:15,
    xp_per_100_coins:2000,
    history
  });
}

async function handleOfferwallGgExactBalance(request, env) {
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;

  const [profileRes, accrualRes] = await Promise.all([
    supabase(env, 'profiles?id=eq.' + encodeURIComponent(guard.user.id) + '&select=lootix_available'),
    supabase(env, 'offerwall_reward_accruals?user_id=eq.' + encodeURIComponent(guard.user.id) + '&select=fractional_coins')
  ]);
  if (!profileRes.ok || !accrualRes.ok) return json({ok:false,error:'balance unavailable'},500);

  const profiles = await profileRes.json();
  const accruals = await accrualRes.json();
  const whole = Number(profiles?.[0]?.lootix_available || 0);
  const fractional = Number(accruals?.[0]?.fractional_coins || 0);
  const exact = whole + fractional;

  return json({
    ok:true,
    whole_coins:whole,
    fractional_coins:Number(fractional.toFixed(6)),
    exact_coins:Number(exact.toFixed(6)),
    euro_value:Number((exact/100).toFixed(4))
  });
}

async function handleOfferwallGgMissionStart(request, env) {
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;
  let body = {};
  try { body = await request.json(); } catch (_) { return json({ok:false,error:'invalid json'},400); }
  const offerId = String(body.offer_id || '').trim();
  if (!offerId) return json({ok:false,error:'missing offer id'},400);

  const payload = [{
    user_id: guard.user.id,
    offer_id: offerId,
    offer_name: String(body.offer_name || 'Jeu rémunéré').slice(0,300),
    requirements: String(body.requirements || '').slice(0,2000),
    reward_display: String(body.reward_display || '').slice(0,120),
    device_label: String(body.device_label || '').slice(0,80) || null,
    click_url: String(body.click_url || '').slice(0,4000) || null,
    status: 'active',
    last_opened_at: new Date().toISOString()
  }];

  const res = await supabase(env, 'offerwall_active_missions?on_conflict=user_id,offer_id', {
    method:'POST',
    headers:{'Prefer':'resolution=merge-duplicates,return=representation'},
    body:JSON.stringify(payload)
  });
  if (!res.ok) return json({ok:false,error:'mission tracking unavailable'},500);
  return json({ok:true,mission:(await res.json())[0] || null});
}

function normalizeOfferwallName(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,' ')
    .trim();
}

async function findMatchingActiveMission(env, userId, offerName) {
  try {
    const res = await supabase(env,
      'offerwall_active_missions?user_id=eq.' + encodeURIComponent(userId) +
      '&status=eq.active&select=offer_id,offer_name,earned_coins_exact,earned_xp,completed_steps,last_opened_at&order=last_opened_at.desc&limit=50'
    );
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows) || !rows.length) return null;

    const target = normalizeOfferwallName(offerName);
    if (target) {
      const exact = rows.find(r => normalizeOfferwallName(r.offer_name) === target);
      if (exact) return exact;
      const partial = rows.find(r => {
        const n = normalizeOfferwallName(r.offer_name);
        return n && (n.includes(target) || target.includes(n));
      });
      if (partial) return partial;
    }

    // Fallback only when the most recently opened mission is recent enough.
    const latest = rows[0];
    const ageMs = latest?.last_opened_at ? Date.now() - new Date(latest.last_opened_at).getTime() : Infinity;
    return ageMs >= 0 && ageMs <= 6 * 60 * 60 * 1000 ? latest : null;
  } catch (_) {
    return null;
  }
}

async function handleOfferwallGgMissions(request, env) {
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;

  const [missionsRes, txRes, completionsRes] = await Promise.all([
    supabase(env,
      'offerwall_active_missions?user_id=eq.' + encodeURIComponent(guard.user.id) +
      '&status=eq.active&select=offer_id,offer_name,requirements,reward_display,device_label,click_url,started_at,last_opened_at,last_reward_at,earned_coins_exact,earned_xp,completed_steps,last_goal_id&order=last_opened_at.desc&limit=50'
    ),
    supabase(env,
      'partner_reward_transactions?provider=eq.offerwallgg&user_id=eq.' + encodeURIComponent(guard.user.id) +
      '&credited=eq.true&reversed=eq.false&select=reward_coins_exact,reward_coins,xp_awarded,created_at&order=created_at.asc&limit=500'
    ),
    supabase(env,
      'offerwall_mission_completions?user_id=eq.' + encodeURIComponent(guard.user.id) +
      '&select=offer_id,offer_name,goal_id,transaction_id,reward_coins_exact,xp_awarded,status,completed_at&order=completed_at.asc&limit=1000'
    )
  ]);
  if (!missionsRes.ok) return json({ok:false,error:'missions unavailable'},500);

  const missions = await missionsRes.json();
  const txs = txRes.ok ? await txRes.json() : [];
  const completions = completionsRes.ok ? await completionsRes.json() : [];
  const completionByOffer = new Map();
  for (const row of completions) {
    const key=String(row.offer_id || '');
    if(!key) continue;
    const list=completionByOffer.get(key) || [];
    list.push(row);
    completionByOffer.set(key,list);
  }

  // Compatibility fallback for conversions made before direct mission-progress
  // tracking existed: attach them to the most recently opened mission within 6h.
  const fallback = new Map();
  for (const tx of txs) {
    const txTime = new Date(tx.created_at).getTime();
    let best = null;
    for (const mission of missions) {
      const opened = new Date(mission.last_opened_at || mission.started_at || 0).getTime();
      if (!Number.isFinite(opened) || opened > txTime) continue;
      const age = txTime - opened;
      if (age > 6 * 60 * 60 * 1000) continue;
      if (!best || opened > best.opened) best = { mission, opened };
    }
    if (!best) continue;
    const key = String(best.mission.offer_id);
    const cur = fallback.get(key) || { coins:0, xp:0, steps:0, last_reward_at:null };
    cur.coins += Number(tx.reward_coins_exact ?? tx.reward_coins ?? 0);
    cur.xp += Number(tx.xp_awarded || 0);
    cur.steps += 1;
    cur.last_reward_at = tx.created_at || cur.last_reward_at;
    fallback.set(key,cur);
  }

  return json({
    ok:true,
    missions:missions.map(m => {
      const directCoins = Number(m.earned_coins_exact || 0);
      const directXp = Number(m.earned_xp || 0);
      const directSteps = Number(m.completed_steps || 0);
      const old = fallback.get(String(m.offer_id)) || {coins:0,xp:0,steps:0,last_reward_at:null};
      const useDirect = directCoins !== 0 || directXp !== 0 || directSteps !== 0;
      return {
        ...m,
        earned_coins:useDirect ? directCoins : old.coins,
        earned_xp:useDirect ? directXp : old.xp,
        completed_steps:useDirect ? directSteps : old.steps,
        last_reward_at:m.last_reward_at || old.last_reward_at || null,
        completed_goal_ids:(completionByOffer.get(String(m.offer_id)) || []).filter(x=>x.status==='credited').map(x=>String(x.goal_id)),
        completion_details:(completionByOffer.get(String(m.offer_id)) || [])
      };
    })
  });
}

async function handleOfferwallGgPostback(request, env) {
  if (!env.OFFERWALL_GG_SECRET) return new Response('NOT_CONFIGURED', { status:503 });
  const url = new URL(request.url);
  // Offerwall.GG can deliver callbacks either as GET query parameters or
  // application/x-www-form-urlencoded POST fields. Accept both so changing
  // the placement delivery method cannot silently break rewards.
  const p = new URLSearchParams(url.searchParams);
  if (request.method === 'POST') {
    const ct = (request.headers.get('content-type') || '').toLowerCase();
    if (ct.includes('application/x-www-form-urlencoded')) {
      const form = new URLSearchParams(await request.text());
      for (const [k,v] of form) if (!p.has(k)) p.set(k,v);
    }
  }
  const userId = p.get('user') || p.get('userId') || p.get('user_id') || p.get('subid') || '';
  const txId = p.get('tx') || p.get('transactionId') || p.get('txid') || p.get('trans_id') || '';
  const amountRaw = p.get('amount') || p.get('currencyAmount') || p.get('points') || p.get('reward') || '';
  const statusRaw = String(p.get('status') || 'credited').toLowerCase();
  const signature = String(p.get('sig') || p.get('signature') || p.get('hash') || '').toLowerCase();
  const test = String(p.get('test') || '0') === '1';
  const offerId = p.get('offerId') || p.get('offer_id') || null;
  const offerName = p.get('offerName') || p.get('offer_name') || '';
  const goalId = p.get('goalId') || p.get('goal_id') || '';
  const payoutUsd = Number(p.get('payoutUsd') || p.get('payout_usd') || 0);

  if (!userId || !txId || !amountRaw || !signature || !['credited','reversed'].includes(statusRaw)) {
    return new Response('BAD_REQUEST', { status:400 });
  }
  const amount = Number(amountRaw);
  if (!Number.isFinite(amount)) return new Response('BAD_REQUEST', { status:400 });

  const expected = await hmacSha256Hex(env.OFFERWALL_GG_SECRET, userId + ':' + txId + ':' + amountRaw);
  if (!timingSafeEqual(signature, expected)) return new Response('FORBIDDEN', { status:403 });
  if (test) return new Response('OK', { status:200 });

  // Reward users from the real publisher payout, never from Offerwall.GG's placement
  // currencyAmount. This guarantees RiseLooter keeps its intended 70/30 economics even
  // if the placement exchange-rate field is misconfigured.
  const providerStatus = statusRaw === 'credited' ? '1' : '2';
  const grossUsd = Number.isFinite(payoutUsd) ? Math.abs(payoutUsd) : 0;
  const exactRewardCoins = offerwallExactUserCoins(0, grossUsd, 0, env);

  const payload = {
    p_transaction_id: txId,
    p_user_id: userId,
    p_offer_id: offerId,
    p_status: providerStatus,
    p_amount_usd: grossUsd,
    p_reward_coins_exact: Number(exactRewardCoins.toFixed(6))
  };
  const res = await supabase(env, 'rpc/apply_offerwall_reward_v2', { method:'POST', body:JSON.stringify(payload) });
  if (!res.ok) return new Response('RETRY', { status:500 });

  let rpcData = {};
  try { rpcData = await res.json(); } catch (_) {}
  const xpDelta = Number(rpcData?.user_xp_delta || 0);
  const coinDelta = providerStatus === '1' ? exactRewardCoins : -exactRewardCoins;

  const mission = await findMatchingActiveMission(env, userId, offerName);
  if (mission) {
    const nextCoins = Math.max(0, Number(mission.earned_coins_exact || 0) + coinDelta);
    const nextXp = Math.max(0, Number(mission.earned_xp || 0) + xpDelta);
    const nextSteps = Math.max(0, Number(mission.completed_steps || 0) + (providerStatus === '1' ? 1 : -1));
    await supabase(env,
      'offerwall_active_missions?user_id=eq.' + encodeURIComponent(userId) +
      '&offer_id=eq.' + encodeURIComponent(mission.offer_id),
      {
        method:'PATCH',
        headers:{'Prefer':'return=minimal'},
        body:JSON.stringify({
          earned_coins_exact:Number(nextCoins.toFixed(6)),
          earned_xp:nextXp,
          completed_steps:nextSteps,
          last_network_offer_id:offerId,
          last_goal_id:goalId || null,
          last_reward_at:new Date().toISOString()
        })
      }
    ).catch(()=>{});
  }

  if (mission && goalId) {
    await supabase(env, 'offerwall_mission_completions?on_conflict=user_id,transaction_id', {
      method:'POST',
      headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},
      body:JSON.stringify([{
        user_id:userId,
        offer_id:String(mission.offer_id),
        offer_name:String(offerName || mission.offer_name || 'Jeu rémunéré').slice(0,300),
        goal_id:String(goalId).slice(0,300),
        transaction_id:String(txId).slice(0,500),
        reward_coins_exact:Number(exactRewardCoins.toFixed(6)),
        xp_awarded:Math.max(0,Number(xpDelta||0)),
        status:providerStatus==='1'?'credited':'reversed',
        completed_at:new Date().toISOString(),
        updated_at:new Date().toISOString()
      }])
    }).catch(()=>{});
  }

  return new Response('OK', { status:200 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/cpx/postback') return handleCpxPostback(request, env);
    if (url.pathname === '/api/offerwallgg/postback') return handleOfferwallGgPostback(request, env);
    if (url.pathname === '/api/offerwallgg/config') return handleOfferwallGgConfig(request, env);
    if (url.pathname === '/api/offerwallgg/offers') return handleOfferwallGgOffers(request, env);
    if (url.pathname === '/api/offerwallgg/missions' && request.method === 'GET') return handleOfferwallGgMissions(request, env);
    if (url.pathname === '/api/offerwallgg/balance' && request.method === 'GET') return handleOfferwallGgExactBalance(request, env);
    if (url.pathname === '/api/xp/history' && request.method === 'GET') return handleXpHistory(request, env);
    if (url.pathname === '/api/rl/history' && request.method === 'GET') return handleRlHistory(request, env);
    if (url.pathname === '/api/offerwallgg/missions/start' && request.method === 'POST') return handleOfferwallGgMissionStart(request, env);
    const offerDetailMatch = url.pathname.match(/^\/api\/offerwallgg\/offers\/([^/]+)$/);
    if (offerDetailMatch) return handleOfferwallGgOfferDetail(request, env, offerDetailMatch[1]);
    if (url.pathname === '/api/cpx/config') return handleCpxConfig(request, env);
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
    headers.set('x-riselooter-runtime-hotfixes', 'offerwall-games-no-surveys-v1');
    return new HTMLRewriter().on('head', new RiseLooterHead()).transform(new Response(response.body,{status:response.status,statusText:response.statusText,headers}));
  }
};