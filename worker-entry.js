import baseWorker from './worker.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

async function requireUser(request, env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return { ok:false, response:json({ok:false,error:'authentication unavailable'},503) };
  const auth=request.headers.get('authorization')||'';
  if(!auth.startsWith('Bearer ')) return {ok:false,response:json({ok:false,error:'authentication required'},401)};
  const token=auth.slice(7);
  const res=await fetch(`${env.SUPABASE_URL}/auth/v1/user`,{headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:`Bearer ${token}`}});
  if(!res.ok) return {ok:false,response:json({ok:false,error:'invalid session'},401)};
  const user=await res.json();
  return user?.id?{ok:true,user}:{ok:false,response:json({ok:false,error:'invalid session'},401)};
}

async function requireAdmin(request,env){
  if(!env.ADMIN_USER_ID) return {ok:false,response:json({ok:false,error:'admin not configured'},503)};
  const guard=await requireUser(request,env); if(!guard.ok) return guard;
  return guard.user.id===env.ADMIN_USER_ID?guard:{ok:false,response:json({ok:false,error:'forbidden'},403)};
}

async function sb(env,path,init={}){
  const headers=new Headers(init.headers||{});
  headers.set('apikey',env.SUPABASE_SERVICE_ROLE_KEY);
  headers.set('authorization',`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`);
  if(init.body) headers.set('content-type','application/json');
  return fetch(`${env.SUPABASE_URL}/rest/v1/${path}`,{...init,headers});
}

function paypalBase(env){
  return String(env.PAYPAL_ENV||'sandbox').toLowerCase()==='live'?'https://api-m.paypal.com':'https://api-m.sandbox.paypal.com';
}

async function paypalToken(env){
  if(!env.PAYPAL_CLIENT_ID||!env.PAYPAL_CLIENT_SECRET) throw new Error('PayPal credentials missing');
  const basic=btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`);
  const res=await fetch(`${paypalBase(env)}/v1/oauth2/token`,{method:'POST',headers:{authorization:`Basic ${basic}`,'content-type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials'});
  if(!res.ok) throw new Error(`PayPal OAuth ${res.status}`);
  return (await res.json()).access_token;
}

async function recordPayPal(env,id,batchId,batchStatus,error=null){
  return sb(env,'rpc/record_paypal_payout',{method:'POST',body:JSON.stringify({p_withdrawal_id:id,p_batch_id:batchId||null,p_batch_status:batchStatus||'DENIED',p_error:error})});
}

async function refundIfFailed(env,id){
  await sb(env,'rpc/refund_failed_paypal_payout',{method:'POST',body:JSON.stringify({p_withdrawal_id:id})});
}

async function createPayPalPayout(env,row){
  const token=await paypalToken(env);
  const body={
    sender_batch_header:{
      sender_batch_id:row.paypal_sender_batch_id,
      recipient_type:'EMAIL',
      email_subject:'Ton retrait RiseLooter',
      email_message:'Ton retrait RiseLooter a été validé et envoyé via PayPal.'
    },
    items:[{
      recipient_type:'EMAIL',
      recipient_wallet:'PAYPAL',
      amount:{value:Number(row.amount_eur).toFixed(2),currency:'EUR'},
      receiver:row.paypal_email,
      sender_item_id:String(row.id),
      note:'Retrait RiseLooter'
    }]
  };
  const res=await fetch(`${paypalBase(env)}/v1/payments/payouts`,{
    method:'POST',
    headers:{authorization:`Bearer ${token}`,'content-type':'application/json','PayPal-Request-Id':row.paypal_sender_batch_id},
    body:JSON.stringify(body)
  });
  const data=await res.json().catch(()=>({}));
  if(!res.ok){
    const duplicate=data?.name==='VALIDATION_ERROR'||data?.name==='DUPLICATE_REQUEST_ID';
    if(duplicate&&data?.links?.[0]?.href){
      return {ok:true,batchId:(String(data.links[0].href).split('/').pop()||null),status:'PENDING',duplicate:true};
    }
    return {ok:false,status:res.status,error:JSON.stringify(data).slice(0,1500)};
  }
  return {ok:true,batchId:data?.batch_header?.payout_batch_id||null,status:data?.batch_header?.batch_status||'PENDING'};
}

async function syncOne(env,row){
  if(!row.paypal_batch_id) return;
  try{
    const token=await paypalToken(env);
    const res=await fetch(`${paypalBase(env)}/v1/payments/payouts/${encodeURIComponent(row.paypal_batch_id)}?fields=batch_header`,{headers:{authorization:`Bearer ${token}`,'content-type':'application/json'}});
    if(!res.ok) return;
    const data=await res.json();
    const status=data?.batch_header?.batch_status||row.paypal_batch_status||'PENDING';
    await recordPayPal(env,row.id,row.paypal_batch_id,status,null);
    if(['DENIED','CANCELED'].includes(status)) await refundIfFailed(env,row.id);
  }catch(_){ }
}

async function handleCreateWithdrawal(request,env){
  const guard=await requireUser(request,env); if(!guard.ok) return guard.response;
  let body={}; try{body=await request.json();}catch(_){return json({ok:false,error:'invalid json'},400)}
  const amount=Math.trunc(Number(body.amount_coins)); const email=String(body.paypal_email||'').trim();
  if(!Number.isFinite(amount)||amount<1000) return json({ok:false,error:'minimum is 1000 RL Coins'},400);
  const auth=request.headers.get('authorization')||'';
  const userToken=auth.slice(7);
  const res=await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/create_paypal_withdrawal`,{
    method:'POST',headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:`Bearer ${userToken}`,'content-type':'application/json'},
    body:JSON.stringify({p_amount_coins:amount,p_paypal_email:email})
  });
  const data=await res.json().catch(()=>null);
  if(!res.ok) return json({ok:false,error:data?.message||'withdrawal creation failed'},400);
  return json({ok:true,withdrawal:data,status:data?.status||'pending_partner_validation'});
}

async function handleMyWithdrawals(request,env){
  const guard=await requireUser(request,env); if(!guard.ok) return guard.response;
  const res=await sb(env,`withdrawal_payouts?user_id=eq.${encodeURIComponent(guard.user.id)}&select=id,amount_coins,amount_eur,paypal_email,status,paypal_batch_status,created_at,paid_at,refunded_at&order=created_at.desc&limit=50`);
  if(!res.ok) return json({ok:false,error:'withdrawals unavailable'},500);
  return json({ok:true,withdrawals:await res.json()});
}

async function handleAdminWithdrawals(request,env){
  const guard=await requireAdmin(request,env); if(!guard.ok) return guard.response;
  const res=await sb(env,'withdrawal_payouts?select=id,user_id,amount_coins,amount_eur,paypal_email,status,paypal_sender_batch_id,paypal_batch_id,paypal_batch_status,paypal_error,created_at,partner_validated_at,paid_at,refunded_at&order=created_at.desc&limit=100');
  if(!res.ok) return json({ok:false,error:'withdrawals unavailable'},500);
  return json({ok:true,paypal_ready:Boolean(env.PAYPAL_CLIENT_ID&&env.PAYPAL_CLIENT_SECRET),paypal_env:env.PAYPAL_ENV||'sandbox',withdrawals:await res.json()});
}

async function handleAdminPay(request,env,id){
  const guard=await requireAdmin(request,env); if(!guard.ok) return guard.response;
  if(!env.PAYPAL_CLIENT_ID||!env.PAYPAL_CLIENT_SECRET) return json({ok:false,error:'PayPal credentials not configured'},503);
  const prep=await sb(env,'rpc/prepare_paypal_payout',{method:'POST',body:JSON.stringify({p_withdrawal_id:id})});
  if(!prep.ok) return json({ok:false,error:'payout preparation failed'},500);
  const row=await prep.json();
  if(!row?.id) return json({ok:false,error:'withdrawal not found'},404);
  if(row.status==='paid') return json({ok:true,already_paid:true,withdrawal:row});
  if(row.paypal_batch_id){await syncOne(env,row);return json({ok:true,already_sent:true,batch_id:row.paypal_batch_id});}
  if(row.status!=='payout_processing') return json({ok:false,error:`withdrawal status is ${row.status}`},409);

  const result=await createPayPalPayout(env,row);
  if(!result.ok){
    await recordPayPal(env,row.id,null,'DENIED',result.error||`HTTP ${result.status}`);
    await refundIfFailed(env,row.id);
    return json({ok:false,error:'PayPal payout rejected; RL Coins refunded',details:result.error},502);
  }
  await recordPayPal(env,row.id,result.batchId,result.status,null);
  if(['DENIED','CANCELED'].includes(result.status)) await refundIfFailed(env,row.id);
  return json({ok:true,batch_id:result.batchId,paypal_status:result.status});
}

async function syncPending(env){
  if(!env.PAYPAL_CLIENT_ID||!env.PAYPAL_CLIENT_SECRET||!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY) return;
  const res=await sb(env,'withdrawal_payouts?status=in.(paypal_pending,payout_processing)&paypal_batch_id=not.is.null&select=id,paypal_batch_id,paypal_batch_status&limit=100');
  if(!res.ok) return;
  const rows=await res.json();
  for(const row of rows) await syncOne(env,row);
}

class PayoutHead {
  element(element){ element.append('<script src="/payout-client.js?v=paypal-payouts-v1" defer></script>',{html:true}); }
}

export default {
  async fetch(request,env,ctx){
    const url=new URL(request.url);
    if(url.pathname==='/api/withdrawals'&&request.method==='POST') return handleCreateWithdrawal(request,env);
    if(url.pathname==='/api/withdrawals/mine'&&request.method==='GET') return handleMyWithdrawals(request,env);
    if(url.pathname==='/api/admin/withdrawals'&&request.method==='GET') return handleAdminWithdrawals(request,env);
    const m=url.pathname.match(/^\/api\/admin\/withdrawals\/([0-9a-f-]+)\/pay$/i);
    if(m&&request.method==='POST') return handleAdminPay(request,env,m[1]);
    const response=await baseWorker.fetch(request,env,ctx);
    const ct=response.headers.get('content-type')||'';
    if(!ct.includes('text/html')) return response;
    return new HTMLRewriter().on('head',new PayoutHead()).transform(response);
  },
  async scheduled(_event,env,_ctx){ await syncPending(env); }
};
