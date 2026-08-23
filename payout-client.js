(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  let adminMountPromise=null;

  async function token(){try{return (await sb.auth.getSession())?.data?.session?.access_token||'';}catch(_){return '';}}
  async function api(path,init={}){
    const t=await token();
    const headers=new Headers(init.headers||{});
    if(t) headers.set('authorization',`Bearer ${t}`);
    if(init.body) headers.set('content-type','application/json');
    const res=await fetch(path,{...init,headers,cache:'no-store'});
    let body=null;try{body=await res.json();}catch(_){}
    if(!res.ok) throw Object.assign(new Error(body?.error||`HTTP ${res.status}`),{status:res.status,body});
    return body;
  }

  function statusLabel(s){return ({pending_partner_validation:'En attente de validation',payout_processing:'Paiement en préparation',paypal_pending:'PayPal en cours',paid:'Payé',failed:'Échec PayPal',refunded:'Remboursé'})[s]||s;}
  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  function interceptWithdrawal(){
    const btn=$('withdrawSubmit');if(!btn||btn.dataset.paypalBound==='1')return;
    btn.dataset.paypalBound='1';
    btn.addEventListener('click',async e=>{
      e.preventDefault();e.stopImmediatePropagation();
      const amount=Math.trunc(Number($('withdrawAmount')?.value||0));
      const email=String($('withdrawPaypal')?.value||'').trim();
      if(amount<1000){alert('Le minimum est de 1 000 RL Coins (10 €).');return;}
      if(!email){alert('Entre ton adresse PayPal.');return;}
      btn.disabled=true;
      try{
        await api('/api/withdrawals',{method:'POST',body:JSON.stringify({amount_coins:amount,paypal_email:email})});
        alert(`Demande enregistrée : ${amount.toLocaleString('fr-FR')} RL Coins (${(amount/100).toFixed(2)} €). Elle sera payée via PayPal après validation des commissions partenaires.`);
        $('withdrawModal')?.classList.remove('show');
        try{if(typeof refreshUser==='function')await refreshUser(false);}catch(_){}
        await renderMyWithdrawals();
      }catch(err){alert(`Retrait impossible : ${err.message}`);}finally{btn.disabled=false;}
    },true);
  }

  async function renderMyWithdrawals(){
    const box=$('withdrawalsContent');if(!box)return;
    try{
      const out=await api('/api/withdrawals/mine');
      const seen=new Set();
      const rows=(out.withdrawals||[]).filter(r=>r?.id&&!seen.has(r.id)&&seen.add(r.id));
      if(!rows.length){box.textContent='Aucun retrait pour le moment.';return;}
      box.innerHTML=rows.map(r=>`<div class="withdraw-row"><div><b>${Number(r.amount_coins).toLocaleString('fr-FR')} RL Coins</b><br><small>${Number(r.amount_eur).toFixed(2)} € • ${escapeHtml(r.paypal_email)}</small></div><div style="text-align:right"><b>${escapeHtml(statusLabel(r.status))}</b><br><small>${new Date(r.created_at).toLocaleDateString('fr-FR')}</small></div></div>`).join('');
    }catch(_){}
  }

  function removeDuplicateAdminPanels(){const panels=[...document.querySelectorAll('#rlAdminPayouts')];panels.slice(1).forEach(el=>el.remove());}

  async function mountAdminPayouts(force=false){
    const overlay=$('rlAdminOverlay');
    if(!overlay){adminMountPromise=null;return;}
    removeDuplicateAdminPanels();
    if(adminMountPromise)return adminMountPromise;
    if($('rlAdminPayouts')&&!force)return;

    adminMountPromise=(async()=>{
      try{
        const out=await api('/api/admin/withdrawals');
        if(!$('rlAdminOverlay'))return;
        document.querySelectorAll('#rlAdminPayouts').forEach(el=>el.remove());
        const wrap=document.createElement('div');
        wrap.id='rlAdminPayouts';
        wrap.style.cssText='max-width:1180px;margin:18px auto 0;background:#101521;border:1px solid #292f42;border-radius:16px;padding:16px;color:#fff;overflow:auto';
        const seen=new Set();
        const rows=(out.withdrawals||[]).filter(r=>r?.id&&!seen.has(r.id)&&seen.add(r.id));
        wrap.innerHTML=`<h2 style="margin:0 0 8px">Retraits PayPal</h2><div style="font-size:12px;color:#9da4b8;margin-bottom:12px">Mode PayPal : <b>${escapeHtml(out.paypal_env||'sandbox')}</b> • API : <b>${out.paypal_ready?'configurée':'non configurée'}</b> <button id="paypalHealthBtn" class="btn" style="margin-left:10px;padding:6px 10px">Tester PayPal Live</button> <span id="paypalHealthResult" style="margin-left:8px"></span></div><table style="width:100%;border-collapse:collapse;min-width:920px"><thead><tr><th>Utilisateur</th><th>Montant</th><th>PayPal</th><th>Statut</th><th>Créé</th><th>Action</th></tr></thead><tbody>${rows.map(r=>`<tr data-withdrawal-id="${escapeHtml(r.id)}"><td>${escapeHtml(r.user_id)}</td><td>${Number(r.amount_eur).toFixed(2)} €<br><small>${Number(r.amount_coins).toLocaleString('fr-FR')} RL</small></td><td>${escapeHtml(r.paypal_email)}</td><td>${escapeHtml(statusLabel(r.status))}${r.paypal_batch_status?`<br><small>${escapeHtml(r.paypal_batch_status)}</small>`:''}</td><td>${new Date(r.created_at).toLocaleString('fr-FR')}</td><td>${r.status==='pending_partner_validation'?`<button class="btn" data-pay-id="${escapeHtml(r.id)}">Valider & payer</button>`:'—'}</td></tr>`).join('')||'<tr><td colspan="6">Aucune demande.</td></tr>'}</tbody></table>`;
        wrap.querySelectorAll('th,td').forEach(el=>el.style.padding='9px 8px');
        overlay.querySelector(':scope > div')?.appendChild(wrap);

        const healthBtn=wrap.querySelector('#paypalHealthBtn');
        const healthResult=wrap.querySelector('#paypalHealthResult');
        if(healthBtn) healthBtn.addEventListener('click',async()=>{
          healthBtn.disabled=true;
          if(healthResult) healthResult.textContent='Test en cours…';
          try{
            const h=await api('/api/admin/paypal/health');
            if(healthResult) healthResult.textContent=h.ok&&h.oauth&&h.environment==='live'?'✅ LIVE OAuth OK':'⚠️ Vérification incomplète';
            alert(`PayPal ${String(h.environment||'').toUpperCase()} : OAuth ${h.oauth?'OK':'ÉCHEC'}${h.live_safety_guard?' • garde Live actif':''}`);
          }catch(err){if(healthResult)healthResult.textContent='❌ Échec';alert(`Test PayPal impossible : ${err.message}`);}finally{healthBtn.disabled=false;}
        });

        wrap.querySelectorAll('[data-pay-id]').forEach(btn=>btn.addEventListener('click',async()=>{
          if(!confirm('Confirmer que les commissions partenaires correspondant à ce retrait ont été reçues et envoyer maintenant le paiement PayPal ?'))return;
          btn.disabled=true;
          try{const r=await api(`/api/admin/withdrawals/${btn.dataset.payId}/pay`,{method:'POST'});alert(`Paiement PayPal lancé. Statut : ${r.paypal_status||'envoyé'}`);await mountAdminPayouts(true);}
          catch(err){alert(`Paiement PayPal impossible : ${err.message}`);btn.disabled=false;}
        }));
      }catch(_){} finally {adminMountPromise=null;}
    })();
    return adminMountPromise;
  }

  function boot(){
    interceptWithdrawal();renderMyWithdrawals();
    const obs=new MutationObserver(()=>{interceptWithdrawal();removeDuplicateAdminPanels();if($('rlAdminOverlay')&&!$('rlAdminPayouts'))mountAdminPayouts();});
    obs.observe(document.documentElement,{childList:true,subtree:true});
    setInterval(()=>{renderMyWithdrawals();if($('rlAdminOverlay'))mountAdminPayouts(true);},10000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
