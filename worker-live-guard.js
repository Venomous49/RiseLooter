import payoutWorker from './worker-entry.js';

const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const isLive=env=>String(env.PAYPAL_ENV||'sandbox').toLowerCase()==='live';
const isSandboxEmail=email=>/@(?:personal|business)\.example\.com$/i.test(String(email||'').trim())||/@example\.com$/i.test(String(email||'').trim());

async function requireAdmin(request,env){
  if(!env.ADMIN_USER_ID||!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) return {ok:false,response:json({ok:false,error:'admin authentication unavailable'},503)};
  const auth=request.headers.get('authorization')||'';
  if(!auth.startsWith('Bearer ')) return {ok:false,response:json({ok:false,error:'authentication required'},401)};
  const res=await fetch(`${env.SUPABASE_URL}/auth/v1/user`,{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:auth}});
  if(!res.ok) return {ok:false,response:json({ok:false,error:'invalid session'},401)};
  const user=await res.json();
  if(user?.id!==env.ADMIN_USER_ID) return {ok:false,response:json({ok:false,error:'forbidden'},403)};
  return {ok:true,user};
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

export default {
  async fetch(request,env,ctx){
    const url=new URL(request.url);
    if(url.pathname==='/api/admin/paypal/health'&&request.method==='GET') return paypalHealth(request,env);

    if(isLive(env)&&url.pathname==='/api/withdrawals'&&request.method==='POST'){
      let body={};
      try{body=await request.clone().json();}catch(_){return json({ok:false,error:'invalid json'},400)}
      if(isSandboxEmail(body?.paypal_email)) return json({ok:false,error:'Sandbox PayPal addresses are forbidden in Live mode'},400);
    }
    return payoutWorker.fetch(request,env,ctx);
  },
  async scheduled(event,env,ctx){
    if(typeof payoutWorker.scheduled==='function') return payoutWorker.scheduled(event,env,ctx);
  }
};
