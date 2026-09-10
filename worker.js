class RiseLooterHead {
  element(element) {
    element.append('<link rel="stylesheet" href="/creator-hd.css?v=23">', { html: true });
    element.append('<script src="/creator-cache-v23.js?v=stability-v13" defer></script>', { html: true });
    element.append('<script src="/safe-ui-bootstrap.js?v=base-hq-realesrgan-v2" defer></script>', { html: true });
    element.append('<script src="/fixed-stage-home.js?v=stability-v11" defer></script>', { html: true });
    element.append('<script src="/silhouette-stage-locks.js?v=stability-v11" defer></script>', { html: true });
    element.append('<script src="/evolution-test-mode.js?v=stability-v13" defer></script>', { html: true });
    element.append('<script src="/admin-dashboard.js?v=stability-v13" defer></script>', { html: true });
    element.append('<script src="/offerwallgg-stable-v8.js?v=20260910-worker-rewards-v1" defer></script>', { html: true });
    element.append('<script src="/production-recovery-v3.js?v=20260910-worker-rewards-v1" defer></script>', { html: true });
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

const serviceHeaders = env => ({apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,'content-type':'application/json'});

async function requireUser(request, env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return {ok:false,response:json({ok:false,error:'authentication unavailable'},503)};
  const auth=request.headers.get('authorization')||'';
  if(!auth.startsWith('Bearer ')) return {ok:false,response:json({ok:false,error:'authentication required'},401)};
  const res=await fetch(`${env.SUPABASE_URL}/auth/v1/user`,{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:auth}});
  if(!res.ok) return {ok:false,response:json({ok:false,error:'invalid session'},401)};
  const user=await res.json();
  if(!user?.id) return {ok:false,response:json({ok:false,error:'invalid session'},401)};
  return {ok:true,user};
}

async function requireAdmin(request,env){
  if(!env.ADMIN_USER_ID) return {ok:false,response:json({ok:false,error:'admin authentication unavailable'},503)};
  const guard=await requireUser(request,env); if(!guard.ok) return guard;
  if(guard.user.id!==env.ADMIN_USER_ID) return {ok:false,response:json({ok:false,error:'forbidden'},403)};
  return guard;
}

async function handleCpxConfig(request, env) { return json({ok:false,error:'surveys disabled'},410); }
async function handleCpxPostback(request, env) { return new Response('OK',{status:200}); }
async function handleOfferwallGgPostback(request, env) { return new Response('OK',{status:200}); }
async function handleOfferwallGgConfig(request, env) { const guard=await requireUser(request,env); if(!guard.ok)return guard.response; return json({ok:true,user_id:guard.user.id}); }
async function handleOfferwallGgOffers(request, env) { const guard=await requireUser(request,env); if(!guard.ok)return guard.response; return json({ok:true,offers:[]}); }
async function handleOfferwallGgMissions(request, env) { const guard=await requireUser(request,env); if(!guard.ok)return guard.response; return json({ok:true,missions:[]}); }
async function handleOfferwallGgExactBalance(request, env) { const guard=await requireUser(request,env); if(!guard.ok)return guard.response; return json({ok:true,balance:0}); }
async function handleXpHistory(request, env) { const guard=await requireUser(request,env); if(!guard.ok)return guard.response; return json({ok:true,history:[]}); }
async function handleRlHistory(request, env) { const guard=await requireUser(request,env); if(!guard.ok)return guard.response; return json({ok:true,history:[]}); }
async function handleOfferwallGgMissionStart(request, env) { const guard=await requireUser(request,env); if(!guard.ok)return guard.response; return json({ok:true}); }
async function handleOfferwallGgOfferDetail(request, env, id) { const guard=await requireUser(request,env); if(!guard.ok)return guard.response; return json({ok:true,offer:{id}}); }
async function handleAdminSummary(request, env) { const guard=await requireAdmin(request,env); if(!guard.ok)return guard.response; return json({ok:true}); }

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