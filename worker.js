class RiseLooterHead {
  element(element) {
    element.append('<link rel="stylesheet" href="/creator-hd.css?v=23">', { html: true });
    element.append('<script src="/creator-cache-v23.js?v=stability-v13" defer></script>', { html: true });
    element.append('<script src="/safe-ui-bootstrap.js?v=base-hq-realesrgan-v2" defer></script>', { html: true });
    element.append('<script src="/fixed-stage-home.js?v=20260911-fullbody-v2" defer></script>', { html: true });
    element.append('<script src="/silhouette-stage-locks.js?v=stability-v11" defer></script>', { html: true });
    element.append('<script src="/evolution-test-mode.js?v=stability-v13" defer></script>', { html: true });
    element.append('<script src="/admin-dashboard.js?v=stability-v13" defer></script>', { html: true });
    element.append('<script src="/offerwallgg-stable-v8.js?v=20260911-session-v83" defer></script>', { html: true });
    element.append('<script src="/production-recovery-v3.js?v=20260910-rewards-v34" defer></script>', { html: true });
    element.append('<script src="/offerwall-ui-enhancements-v1.js?v=20260911-v1" defer></script>', { html: true });
    element.append('<script src="/ui-cleanup-v1.js?v=20260911-v1" defer></script>', { html: true });
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
  if (!env.CPX_APP_ID) return json({ ok:false, error:'CPX not configured' },503);
  return json({ ok:true, app_id:env.CPX_APP_ID, user_id:guard.user.id });
}

async function handleCpxPostback(request, env) {
  if (!env.CPX_SECURE_HASH) return json({ ok:false, error:'CPX secret missing' },503);
  const url = new URL(request.url);
  const transId = url.searchParams.get('trans_id') || url.searchParams.get('transid') || '';
  const userId = url.searchParams.get('user_id') || url.searchParams.get('ext_user_id') || '';
  const amountUsd = Number(url.searchParams.get('amount_usd') || url.searchParams.get('amount') || 0);
  const hash = url.searchParams.get('hash') || '';
  if (!transId || !userId || !Number.isFinite(amountUsd) || amountUsd <= 0 || !hash) return json({ ok:false, error:'invalid params' },400);
  const expected = md5Hex(`${transId}-${env.CPX_SECURE_HASH}`);
  if (!timingSafeEqual(expected.toLowerCase(), hash.toLowerCase())) return json({ ok:false, error:'bad signature' },403);
  const grossRl = Math.floor(amountUsd * 100);
  const userRl = Math.floor(grossRl * 0.70);
  const xp = userRl * 20;
  const payload = { provider:'cpx', provider_tx_id:transId, user_id:userId, gross_amount_usd:amountUsd, gross_rl:grossRl, user_rl:userRl, platform_rl:grossRl-userRl, xp, raw:Object.fromEntries(url.searchParams) };
  const insert = await supabase(env,'provider_transactions?on_conflict=provider,provider_tx_id',{ method:'POST', headers:{Prefer:'resolution=ignore-duplicates,return=representation'}, body:JSON.stringify(payload) });
  if (!insert.ok) return json({ ok:false, error:'db transaction failed' },500);
  const rows = await insert.json();
  if (!rows?.length) return json({ ok:true, duplicate:true });
  const credit = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/credit_offer_reward`,{ method:'POST', headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,'content-type':'application/json'}, body:JSON.stringify({p_user_id:userId,p_provider:'cpx',p_external_id:transId,p_gross_lootix:grossRl,p_reward_lootix:userRl,p_xp:xp}) });
  if (!credit.ok) return json({ ok:false, error:'credit failed' },500);
  return json({ ok:true, reward_rl:userRl, xp });
}

function offerwallSecret(env) {
  return env.OFFERWALLGG_POSTBACK_SECRET || env.OFFERWALLGG_SECRET || '';
}

function offerwallApiKey(env) {
  return env.OFFERWALLGG_API_KEY || env.OFFERWALLGG_SECRET || '';
}

function offerwallAppId(env) {
  return env.OFFERWALLGG_APP_ID || env.OFFERWALLGG_PUBLIC_KEY || '';
}

async function handleOfferwallGGConfig(request, env) {
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;
  const appId = offerwallAppId(env);
  if (!appId) return json({ ok:false, error:'OfferwallGG app id missing' },503);
  return json({ ok:true, app_id:appId, user_id:guard.user.id });
}

async function handleOfferwallGGOffers(request, env) {
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;
  const apiKey = offerwallApiKey(env);
  const appId = offerwallAppId(env);
  if (!apiKey || !appId) return json({ ok:false, error:'OfferwallGG credentials missing' },503);
  const url = new URL(request.url);
  const country = (url.searchParams.get('country') || 'FR').toUpperCase();
  const platform = (url.searchParams.get('platform') || 'all').toLowerCase();
  const device = (url.searchParams.get('device') || 'all').toLowerCase();
  const qs = new URLSearchParams({ appId, userId:guard.user.id, country, platform, device });
  const upstream = await fetch(`https://api.offerwall.gg/v1/offers?${qs.toString()}`,{headers:{accept:'application/json','x-api-key':apiKey}});
  const text = await upstream.text();
  if (!upstream.ok) return new Response(text,{status:upstream.status,headers:{'content-type':upstream.headers.get('content-type')||'application/json','cache-control':'no-store'}});
  return new Response(text,{status:200,headers:{'content-type':upstream.headers.get('content-type')||'application/json','cache-control':'no-store'}});
}

async function handleOfferwallGGPostback(request, env) {
  const url = new URL(request.url);
  const p = url.searchParams;
  const userId = p.get('user') || p.get('userId') || p.get('subId') || p.get('sub_id') || '';
  const amount = Number(p.get('amount') || p.get('payout') || 0);
  const currencyAmount = Number(p.get('currencyAmount') || p.get('currency_amount') || 0);
  const transactionId = p.get('transactionId') || p.get('transaction_id') || p.get('transaction') || p.get('txid') || '';
  const status = String(p.get('status') || '1').toLowerCase();
  const signature = p.get('signature') || p.get('hash') || '';
  const goalId = p.get('goalId') || p.get('goal_id') || '';
  const offerId = p.get('offerId') || p.get('offer_id') || '';
  const secret = offerwallSecret(env);
  if (!userId || !transactionId || !signature || !secret) return json({ok:false,error:'invalid params'},400);
  const signed = `${userId}${amount}${currencyAmount}${transactionId}${status}${goalId}${offerId}${secret}`;
  const expected = md5Hex(signed);
  if (!timingSafeEqual(expected.toLowerCase(), signature.toLowerCase())) return json({ok:false,error:'bad signature'},403);
  const normalized = ['1','approved','completed','complete','success','paid'].includes(status) ? 'approved' : ['2','rejected','chargeback','reversed','cancelled','canceled'].includes(status) ? 'reversed' : 'pending';
  const grossRl = Math.max(0,Math.floor(currencyAmount || amount || 0));
  const userRl = Math.floor(grossRl * 0.70);
  const xp = userRl * 20;
  const payload = {provider:'offerwallgg',provider_tx_id:transactionId,user_id:userId,gross_amount_usd:Number(amount||0),gross_rl:grossRl,user_rl:userRl,platform_rl:grossRl-userRl,xp,raw:Object.fromEntries(p)};
  const insert = await supabase(env,'provider_transactions?on_conflict=provider,provider_tx_id',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=representation'},body:JSON.stringify(payload)});
  if (!insert.ok) return json({ok:false,error:'db transaction failed'},500);
  const rows = await insert.json();
  if (!rows?.length) return json({ok:true,duplicate:true});
  if (normalized !== 'approved') return json({ok:true,status:normalized});
  const credit = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/credit_offer_reward`,{method:'POST',headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,'content-type':'application/json'},body:JSON.stringify({p_user_id:userId,p_provider:'offerwallgg',p_external_id:transactionId,p_gross_lootix:grossRl,p_reward_lootix:userRl,p_xp:xp})});
  if (!credit.ok) return json({ok:false,error:'credit failed'},500);
  return json({ok:true,reward_rl:userRl,xp});
}

async function handleOfferwallGGOfferDetail(request, env, offerId) {
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;
  const apiKey = offerwallApiKey(env);
  const appId = offerwallAppId(env);
  if (!apiKey || !appId) return json({ok:false,error:'OfferwallGG credentials missing'},503);
  const upstream = await fetch(`https://api.offerwall.gg/v1/offers/${encodeURIComponent(offerId)}?appId=${encodeURIComponent(appId)}&userId=${encodeURIComponent(guard.user.id)}`,{headers:{accept:'application/json','x-api-key':apiKey}});
  const text = await upstream.text();
  return new Response(text,{status:upstream.status,headers:{'content-type':upstream.headers.get('content-type')||'application/json','cache-control':'no-store'}});
}

async function handleOfferwallGGMissionStart(request, env) {
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;
  const body = await request.json().catch(()=>({}));
  const offerId = String(body.offer_id || body.offerId || '').trim();
  if (!offerId) return json({ok:false,error:'offer_id required'},400);
  const detailRes = await handleOfferwallGGOfferDetail(request, env, offerId);
  if (!detailRes.ok) return detailRes;
  const detail = await detailRes.json().catch(()=>null);
  const offer = detail?.offer || detail?.data || detail;
  const title = String(offer?.name || offer?.title || `Offer ${offerId}`);
  const provider = String(offer?.network || offer?.provider || 'offerwallgg');
  const upsert = await supabase(env,'offerwall_active_missions?on_conflict=user_id,offer_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify({user_id:guard.user.id,offer_id:offerId,provider,title,status:'active',started_at:new Date().toISOString(),updated_at:new Date().toISOString()})});
  if (!upsert.ok) return json({ok:false,error:'mission start save failed'},500);
  return json({ok:true,mission:(await upsert.json())?.[0]||null});
}

async function handleOfferwallGGMissions(request, env) {
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;
  const missionsRes = await supabase(env,`offerwall_active_missions?user_id=eq.${guard.user.id}&status=eq.active&select=*&order=started_at.desc`);
  if (!missionsRes.ok) return json({ok:false,error:'mission load failed'},500);
  const missions = await missionsRes.json();
  const out=[];
  for (const mission of missions) {
    const detailRes = await handleOfferwallGGOfferDetail(request, env, mission.offer_id);
    const detail = detailRes.ok ? await detailRes.json().catch(()=>null) : null;
    const offer = detail?.offer || detail?.data || detail || {};
    const goals = Array.isArray(offer.goals) ? offer.goals : Array.isArray(offer.events) ? offer.events : [];
    const completionRes = await supabase(env,`offerwall_mission_completions?user_id=eq.${guard.user.id}&offer_id=eq.${encodeURIComponent(mission.offer_id)}&select=goal_id,status,reward_rl,xp,completed_at`);
    const completions = completionRes.ok ? await completionRes.json() : [];
    const done = new Map(completions.map(c=>[String(c.goal_id),c]));
    const normalizedGoals = goals.map((g,i)=>{const id=String(g.id||g.goalId||g.eventId||i);const c=done.get(id);return{id,title:String(g.name||g.title||g.description||`Objectif ${i+1}`),reward:Number(g.currencyAmount||g.reward||g.payout||0),status:c?.status||'pending',completed_at:c?.completed_at||null};});
    out.push({...mission,goals:normalizedGoals});
  }
  return json({ok:true,missions:out});
}

async function handleOfferwallGGBalance(request, env) {
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;
  const tx = await supabase(env,`provider_transactions?user_id=eq.${guard.user.id}&provider=eq.offerwallgg&select=user_rl,xp,created_at`);
  if (!tx.ok) return json({ok:false,error:'balance load failed'},500);
  const rows = await tx.json();
  return json({ok:true,earned_rl:rows.reduce((s,r)=>s+Number(r.user_rl||0),0),earned_xp:rows.reduce((s,r)=>s+Number(r.xp||0),0),transactions:rows.length});
}

async function handleXpHistory(request, env) {
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;
  const hist = await supabase(env,`xp_history?user_id=eq.${guard.user.id}&select=amount,source,created_at&order=created_at.desc&limit=200`);
  if (!hist.ok) return json({ok:false,error:'xp history unavailable'},500);
  return json({ok:true,history:await hist.json()});
}

async function handleRlHistory(request, env) {
  const guard = await requireUser(request, env);
  if (!guard.ok) return guard.response;
  const hist = await supabase(env,`rl_history?user_id=eq.${guard.user.id}&select=amount,source,created_at&order=created_at.desc&limit=200`);
  if (!hist.ok) return json({ok:false,error:'rl history unavailable'},500);
  return json({ok:true,history:await hist.json()});
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/cpx/postback') return handleCpxPostback(request, env);
    if (url.pathname === '/api/offerwallgg/postback') return handleOfferwallGGPostback(request, env);
    if (url.pathname === '/api/offerwallgg/config') return handleOfferwallGGConfig(request, env);
    if (url.pathname === '/api/offerwallgg/offers') return handleOfferwallGGOffers(request, env);
    if (url.pathname === '/api/offerwallgg/missions' && request.method === 'GET') return handleOfferwallGGMissions(request, env);
    if (url.pathname === '/api/offerwallgg/balance' && request.method === 'GET') return handleOfferwallGGBalance(request, env);
    if (url.pathname === '/api/xp/history' && request.method === 'GET') return handleXpHistory(request, env);
    if (url.pathname === '/api/rl/history' && request.method === 'GET') return handleRlHistory(request, env);
    if (url.pathname === '/api/offerwallgg/missions/start' && request.method === 'POST') return handleOfferwallGGMissionStart(request, env);
    const detailMatch = url.pathname.match(/^\/api\/offerwallgg\/offers\/([^/]+)$/);
    if (detailMatch && request.method === 'GET') return handleOfferwallGGOfferDetail(request, env, decodeURIComponent(detailMatch[1]));
    if (url.pathname === '/api/cpx/config') return handleCpxConfig(request, env);
    if (url.pathname === '/api/admin/summary') return handleAdminSummary(request, env);
    const response = await env.ASSETS.fetch(request);
    if (!response || response.status >= 400) return response;
    const ct = response.headers.get('content-type') || '';
    if (!ct.includes('text/html')) return response;
    return new HTMLRewriter().on('head', new RiseLooterHead()).transform(response);
  }
};
