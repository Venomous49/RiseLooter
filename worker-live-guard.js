import payoutWorker from './worker-entry.js';

const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const isLive=env=>String(env.PAYPAL_ENV||'sandbox').toLowerCase()==='live';
const isSandboxEmail=email=>/@(?:personal|business)\.example\.com$/i.test(String(email||'').trim())||/@example\.com$/i.test(String(email||'').trim());

function md5Hex(input){
  const s=unescape(encodeURIComponent(String(input)));
  const add=(x,y)=>(((x&0xffff)+(y&0xffff))+((((x>>>16)+(y>>>16))&0xffff)<<16))|0;
  const rol=(n,c)=>(n<<c)|(n>>>(32-c));
  const cmn=(q,a,b,x,sft,t)=>add(rol(add(add(a,q),add(x,t)),sft),b);
  const ff=(a,b,c,d,x,sft,t)=>cmn((b&c)|((~b)&d),a,b,x,sft,t);
  const gg=(a,b,c,d,x,sft,t)=>cmn((b&d)|(c&(~d)),a,b,x,sft,t);
  const hh=(a,b,c,d,x,sft,t)=>cmn(b^c^d,a,b,x,sft,t);
  const ii=(a,b,c,d,x,sft,t)=>cmn(c^(b|(~d)),a,b,x,sft,t);
  const blocks=[]; let i;
  for(i=0;i<s.length;i++) blocks[i>>2]=(blocks[i>>2]||0)|(s.charCodeAt(i)<<((i%4)*8));
  blocks[i>>2]=(blocks[i>>2]||0)|(0x80<<((i%4)*8));
  blocks[(((i+8)>>6)+1)*16-2]=s.length*8;
  let a=1732584193,b=-271733879,c=-1732584194,d=271733878;
  for(i=0;i<blocks.length;i+=16){
    const oa=a,ob=b,oc=c,od=d;
    a=ff(a,b,c,d,blocks[i+0]||0,7,-680876936);d=ff(d,a,b,c,blocks[i+1]||0,12,-389564586);c=ff(c,d,a,b,blocks[i+2]||0,17,606105819);b=ff(b,c,d,a,blocks[i+3]||0,22,-1044525330);
    a=ff(a,b,c,d,blocks[i+4]||0,7,-176418897);d=ff(d,a,b,c,blocks[i+5]||0,12,1200080426);c=ff(c,d,a,b,blocks[i+6]||0,17,-1473231341);b=ff(b,c,d,a,blocks[i+7]||0,22,-45705983);
    a=ff(a,b,c,d,blocks[i+8]||0,7,1770035416);d=ff(d,a,b,c,blocks[i+9]||0,12,-1958414417);c=ff(c,d,a,b,blocks[i+10]||0,17,-42063);b=ff(b,c,d,a,blocks[i+11]||0,22,-1990404162);
    a=ff(a,b,c,d,blocks[i+12]||0,7,1804603682);d=ff(d,a,b,c,blocks[i+13]||0,12,-40341101);c=ff(c,d,a,b,blocks[i+14]||0,17,-1502002290);b=ff(b,c,d,a,blocks[i+15]||0,22,1236535329);
    a=gg(a,b,c,d,blocks[i+1]||0,5,-165796510);d=gg(d,a,b,c,blocks[i+6]||0,9,-1069501632);c=gg(c,d,a,b,blocks[i+11]||0,14,643717713);b=gg(b,c,d,a,blocks[i+0]||0,20,-373897302);
    a=gg(a,b,c,d,blocks[i+5]||0,5,-701558691);d=gg(d,a,b,c,blocks[i+10]||0,9,38016083);c=gg(c,d,a,b,blocks[i+15]||0,14,-660478335);b=gg(b,c,d,a,blocks[i+4]||0,20,-405537848);
    a=gg(a,b,c,d,blocks[i+9]||0,5,568446438);d=gg(d,a,b,c,blocks[i+14]||0,9,-1019803690);c=gg(c,d,a,b,blocks[i+3]||0,14,-187363961);b=gg(b,c,d,a,blocks[i+8]||0,20,1163531501);
    a=gg(a,b,c,d,blocks[i+13]||0,5,-1444681467);d=gg(d,a,b,c,blocks[i+2]||0,9,-51403784);c=gg(c,d,a,b,blocks[i+7]||0,14,1735328473);b=gg(b,c,d,a,blocks[i+12]||0,20,-1926607734);
    a=hh(a,b,c,d,blocks[i+5]||0,4,-378558);d=hh(d,a,b,c,blocks[i+8]||0,11,-2022574463);c=hh(c,d,a,b,blocks[i+11]||0,16,1839030562);b=hh(b,c,d,a,blocks[i+14]||0,23,-35309556);
    a=hh(a,b,c,d,blocks[i+1]||0,4,-1530992060);d=hh(d,a,b,c,blocks[i+4]||0,11,1272893353);c=hh(c,d,a,b,blocks[i+7]||0,16,-155497632);b=hh(b,c,d,a,blocks[i+10]||0,23,-1094730640);
    a=hh(a,b,c,d,blocks[i+13]||0,4,681279174);d=hh(d,a,b,c,blocks[i+0]||0,11,-358537222);c=hh(c,d,a,b,blocks[i+3]||0,16,-722521979);b=hh(b,c,d,a,blocks[i+6]||0,23,76029189);
    a=hh(a,b,c,d,blocks[i+9]||0,4,-640364487);d=hh(d,a,b,c,blocks[i+12]||0,11,-421815835);c=hh(c,d,a,b,blocks[i+15]||0,16,530742520);b=hh(b,c,d,a,blocks[i+2]||0,23,-995338651);
    a=ii(a,b,c,d,blocks[i+0]||0,6,-198630844);d=ii(d,a,b,c,blocks[i+7]||0,10,1126891415);c=ii(c,d,a,b,blocks[i+14]||0,15,-1416354905);b=ii(b,c,d,a,blocks[i+5]||0,21,-57434055);
    a=ii(a,b,c,d,blocks[i+12]||0,6,1700485571);d=ii(d,a,b,c,blocks[i+3]||0,10,-1894986606);c=ii(c,d,a,b,blocks[i+10]||0,15,-1051523);b=ii(b,c,d,a,blocks[i+1]||0,21,-2054922799);
    a=ii(a,b,c,d,blocks[i+8]||0,6,1873313359);d=ii(d,a,b,c,blocks[i+15]||0,10,-30611744);c=ii(c,d,a,b,blocks[i+6]||0,15,-1560198380);b=ii(b,c,d,a,blocks[i+13]||0,21,1309151649);
    a=ii(a,b,c,d,blocks[i+4]||0,6,-145523070);d=ii(d,a,b,c,blocks[i+11]||0,10,-1120210379);c=ii(c,d,a,b,blocks[i+2]||0,15,718787259);b=ii(b,c,d,a,blocks[i+9]||0,21,-343485551);
    a=add(a,oa);b=add(b,ob);c=add(c,oc);d=add(d,od);
  }
  const hex=n=>[0,8,16,24].map(sh=>((n>>>sh)&0xff).toString(16).padStart(2,'0')).join('');
  return hex(a)+hex(b)+hex(c)+hex(d);
}

async function requireUser(request,env){
  if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) return {ok:false,response:json({ok:false,error:'authentication unavailable'},503)};
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

async function cpxConfig(request,env){
  const guard=await requireUser(request,env); if(!guard.ok) return guard.response;
  const secret=String(env.CPX_APP_SECURE_HASH||env.CPX_SECURITY_HASH||'');
  return json({
    ok:true,
    app_id:35504,
    ext_user_id:String(guard.user.id),
    secure_hash:secret?md5Hex(`${guard.user.id}-${secret}`):'',
    secure_hash_enabled:Boolean(secret)
  });
}

async function paypalHealth(request,env){
  const guard=await requireAdmin(request,env); if(!guard.ok) return guard.response;
  if(!env.PAYPAL_CLIENT_ID||!env.PAYPAL_CLIENT_SECRET) return json({ok:false,error:'PayPal credentials missing',environment:env.PAYPAL_ENV||'sandbox'},503);
  const base=isLive(env)?'https://api-m.paypal.com':'https://api-m.sandbox.paypal.com';
  const basic=btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`);
  try{
    const res=await fetch(`${base}/v1/oauth2/token`,{method:'POST',headers:{authorization:`Basic ${basic}`,'content-type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials'});
    const data=await res.json().catch(()=>({}));
    if(!res.ok) return json({ok:false,environment:env.PAYPAL_ENV||'sandbox',oauth:false,http_status:res.status,error:data?.error||'paypal oauth failed'},502);
    return json({ok:true,environment:env.PAYPAL_ENV||'sandbox',oauth:true,token_type:data?.token_type||'Bearer',scope_present:Boolean(data?.scope),live_safety_guard:isLive(env)});
  }catch(_){return json({ok:false,environment:env.PAYPAL_ENV||'sandbox',oauth:false,error:'paypal unreachable'},502)}
}

class FreshCpxHead{
  element(element){
    element.append('<script src="/cpx-integration.js?v=cpx-35504-v5-20260823" defer onerror="setTimeout(function(){var s=document.createElement(\'script\');s.src=\'/cpx-integration.js?v=cpx-35504-v5-fallback-20260823\';document.head.appendChild(s)},300)"></script>',{html:true});
  }
}

export default {
  async fetch(request,env,ctx){
    const url=new URL(request.url);
    if(url.pathname==='/api/cpx/config'&&request.method==='GET') return cpxConfig(request,env);
    if(url.pathname==='/api/admin/paypal/health'&&request.method==='GET') return paypalHealth(request,env);

    if(isLive(env)&&url.pathname==='/api/withdrawals'&&request.method==='POST'){
      let body={};
      try{body=await request.clone().json();}catch(_){return json({ok:false,error:'invalid json'},400)}
      if(isSandboxEmail(body?.paypal_email)) return json({ok:false,error:'Sandbox PayPal addresses are forbidden in Live mode'},400);
    }

    const response=await payoutWorker.fetch(request,env,ctx);
    const ct=response.headers.get('content-type')||'';
    if(!ct.includes('text/html')) return response;
    return new HTMLRewriter().on('head',new FreshCpxHead()).transform(response);
  },
  async scheduled(event,env,ctx){
    if(typeof payoutWorker.scheduled==='function') return payoutWorker.scheduled(event,env,ctx);
  }
};
