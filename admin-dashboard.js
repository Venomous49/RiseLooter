(() => {
  'use strict';

  const OWNER_USER_ID = '51731c06-5dc8-4955-895d-f22343be526d';
  const fmtUsd = n => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'USD'}).format(Number(n||0));
  const fmtEur = n => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(Number(n||0));
  const fmtInt = n => new Intl.NumberFormat('fr-FR').format(Number(n||0));

  async function activeAuth() {
    try {
      if (typeof sb === 'undefined' || !sb?.auth) return { user:null, token:'' };
      const [userResult, sessionResult] = await Promise.all([sb.auth.getUser(), sb.auth.getSession()]);
      return { user:userResult?.data?.user || sessionResult?.data?.session?.user || null, token:sessionResult?.data?.session?.access_token || '' };
    } catch (_) { return { user:null, token:'' }; }
  }

  async function adminFetch(path) {
    const auth = await activeAuth();
    if (!auth.token) throw Object.assign(new Error('not-authenticated'), { code:'not-authenticated', user:auth.user });
    const res = await fetch(path, { headers:{authorization:`Bearer ${auth.token}`}, cache:'no-store' });
    let body=null; try{body=await res.json();}catch(_){}
    if(!res.ok){
      let code=`admin-${res.status}`;
      const serverError=String(body?.error||'');
      if(res.status===403) code='not-admin';
      else if(res.status===503 && serverError==='admin not configured') code='admin-not-configured';
      else if(res.status===503 && serverError==='authentication unavailable') code='auth-server-unavailable';
      throw Object.assign(new Error(code),{code,status:res.status,body,user:auth.user});
    }
    return body;
  }

  function mountButton(){
    const existing=document.getElementById('rlAdminButton'); if(existing)return existing;
    const btn=document.createElement('button'); btn.id='rlAdminButton'; btn.type='button'; btn.textContent='ADMINISTRATEUR';
    btn.style.cssText='display:none;position:fixed;right:18px;bottom:18px;z-index:2147483000;padding:12px 18px;border-radius:12px;border:1px solid rgba(255,255,255,.25);background:linear-gradient(135deg,#6d4aff,#9d67ff);color:#fff;font-weight:900;letter-spacing:.4px;box-shadow:0 10px 30px rgba(0,0,0,.35);cursor:pointer';
    btn.addEventListener('click',openDashboard); document.body.appendChild(btn); return btn;
  }

  async function probeAdmin(){
    const btn=mountButton(); const auth=await activeAuth(); const isOwner=String(auth.user?.id||'').toLowerCase()===OWNER_USER_ID;
    btn.style.display=isOwner?'block':'none'; btn.dataset.userId=auth.user?.id||''; if(!isOwner)return;
    try{await adminFetch('/api/admin/summary'); btn.textContent='ADMINISTRATEUR'; btn.title='Accès administrateur vérifié';}
    catch(err){btn.textContent='ADMINISTRATEUR ⚠'; btn.title=err?.code||'Contrôle administrateur à diagnostiquer';}
  }

  async function openDashboard(){
    let data;
    try{data=await adminFetch('/api/admin/summary');}
    catch(err){
      const auth=await activeAuth(); const uid=auth.user?.id||'aucun';
      if(err?.code==='admin-not-configured') alert(`Ton compte est bien détecté (${uid}), mais ADMIN_USER_ID n'est pas configuré dans le Worker.`);
      else if(err?.code==='auth-server-unavailable') alert(`Ton compte est bien détecté (${uid}), mais la connexion serveur à Supabase n'est pas disponible dans le Worker. Vérifie SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.`);
      else if(err?.code==='not-admin') alert(`Ton compte est bien détecté (${uid}), mais le ADMIN_USER_ID du Worker ne correspond pas à cet UUID.`);
      else if(err?.code==='not-authenticated') alert('Ta session Supabase active n\'a pas été retrouvée. Reconnecte-toi puis réessaie.');
      else alert(`Accès administrateur indisponible (${err?.body?.error || err?.status || err?.code || 'erreur inconnue'}).`);
      return;
    }

    document.getElementById('rlAdminOverlay')?.remove();
    const overlay=document.createElement('div'); overlay.id='rlAdminOverlay'; overlay.style.cssText='position:fixed;inset:0;z-index:2147483640;background:rgba(3,5,14,.96);color:#fff;overflow:auto;font-family:inherit;padding:24px';
    const txRows=(data.recent_transactions||[]).map(t=>`<tr><td>${escapeHtml(t.transaction_id)}</td><td>${escapeHtml(t.status)}</td><td>${fmtUsd(t.amount_usd)}</td><td>${fmtUsd(t.user_share_usd)}</td><td>${fmtUsd(t.publisher_share_usd)}</td><td>${fmtInt(t.reward_coins)}</td><td>${t.reversed?'Annulée':(t.credited?'Validée':'En attente')}</td></tr>`).join('');
    overlay.innerHTML=`<div style="max-width:1180px;margin:0 auto"><div style="display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:22px"><div><div style="font-size:13px;color:#a99cff;font-weight:800">RISE LOOTER</div><h1 style="margin:4px 0 0;font-size:30px">Tableau de bord administrateur</h1></div><button id="rlAdminClose" style="background:#1b2030;color:#fff;border:1px solid #3a4054;border-radius:10px;padding:10px 14px;cursor:pointer">Fermer</button></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin-bottom:22px">${card('Marge Rise Looter (30 %)',fmtUsd(data.publisher_balance_usd))}${card('Revenus CPX validés',fmtUsd(data.validated_gross_usd))}${card('Part utilisateurs (70 %)',fmtUsd(data.user_share_usd))}${card('RL Coins détenus',fmtInt(data.user_rl_coins))}${card('Équivalent utilisateurs',fmtEur(data.user_balance_eur))}${card('Utilisateurs',fmtInt(data.users_count))}</div><div style="background:#101521;border:1px solid #292f42;border-radius:16px;padding:16px;overflow:auto"><h2 style="margin:0 0 14px;font-size:19px">Dernières transactions CPX</h2><table style="width:100%;border-collapse:collapse;min-width:850px"><thead><tr style="text-align:left;color:#aaa"><th>Transaction</th><th>Statut</th><th>Brut</th><th>Utilisateur</th><th>Rise Looter</th><th>RL Coins</th><th>État</th></tr></thead><tbody>${txRows||'<tr><td colspan="7" style="padding:20px 0;color:#888">Aucune transaction pour le moment.</td></tr>'}</tbody></table></div></div>`;
    overlay.querySelectorAll('td,th').forEach(el=>el.style.padding='10px 8px'); document.body.appendChild(overlay); document.getElementById('rlAdminClose').onclick=()=>overlay.remove();
  }

  function card(label,value){return `<div style="background:#101521;border:1px solid #292f42;border-radius:16px;padding:16px"><div style="font-size:12px;color:#9da4b8;font-weight:800;text-transform:uppercase">${label}</div><div style="font-size:27px;font-weight:900;margin-top:8px">${value}</div></div>`}
  function escapeHtml(v){return String(v??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]))}

  const boot=()=>{setTimeout(probeAdmin,150);setTimeout(probeAdmin,800);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  try{if(typeof sb!=='undefined'&&sb?.auth?.onAuthStateChange)sb.auth.onAuthStateChange(()=>setTimeout(probeAdmin,50));}catch(_){}
  window.addEventListener('storage',()=>setTimeout(probeAdmin,100)); window.addEventListener('focus',()=>setTimeout(probeAdmin,100)); document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(probeAdmin,100);}); setInterval(probeAdmin,5000);
})();