/* RiseLooter runtime stability v4 — authoritative session/profile refresh + visible games/sections. */
(() => {
  'use strict';
  if (window.__RISELOOTER_RUNTIME_STABILITY_V4__) return;
  window.__RISELOOTER_RUNTIME_STABILITY_V4__ = true;

  const $ = id => document.getElementById(id);
  const ACTIVE_SECTIONS = ['home','challenges','missions','evolution','leaderboard','referral','withdrawals','gamesOfferwall'];

  function forceSectionVisibility(){
    for (const id of ACTIVE_SECTIONS){
      const el=$(id); if(!el) continue;
      el.hidden=false; el.removeAttribute('aria-hidden');
      el.style.removeProperty('height'); el.style.removeProperty('max-height');
      el.style.removeProperty('min-height'); el.style.removeProperty('visibility');
      el.style.removeProperty('opacity');
      if(id==='gamesOfferwall'){
        el.style.setProperty('display','block','important');
        el.style.setProperty('visibility','visible','important');
        el.style.setProperty('opacity','1','important');
        const box=$('offerwallggContent');
        if(box){ box.style.setProperty('display','block','important'); box.style.setProperty('visibility','visible','important'); box.style.setProperty('min-height','90px','important'); }
      }
    }
  }

  function showLoggedOutState(){
    const auth=$('authButton'); if(auth) auth.textContent='Connexion';
    const coins=$('headerCoins'); if(coins) coins.textContent='—';
    const total=$('totalXP'); if(total) total.textContent='Connexion requise';
    const streak=$('streakBig'); if(streak) streak.textContent='Connexion requise';
  }

  async function getSession(){
    try{ return (await sb.auth.getSession())?.data?.session || null; }catch(_){ return null; }
  }

  async function authoritativeProfile(session){
    if(!session?.user?.id) return null;
    try{
      const {data,error}=await sb.from('profiles').select('*').eq('id',session.user.id).single();
      if(error||!data) return null;
      try{ currentUser=session.user; currentProfile=data; }catch(_){}
      if(typeof renderProfile==='function') renderProfile(data);
      const auth=$('authButton'); if(auth) auth.textContent='Déconnexion';
      const coins=$('headerCoins'); if(coins) coins.textContent=Number(data.lootix_available||0).toLocaleString('fr-FR');
      const available=$('withdrawAvailable'); if(available) available.textContent=Number(data.lootix_available||0).toLocaleString('fr-FR')+' RL Coins';
      const total=$('totalXP'); if(total) total.textContent=Number(data.xp||0).toLocaleString('fr-FR')+' XP';
      const streak=$('streakBig'); if(streak) streak.textContent=Number(data.current_streak||0)+' jours';
      if(typeof renderStreakDays==='function') renderStreakDays(Number(data.current_streak||0));
      return data;
    }catch(_){ return null; }
  }

  function reloadOfferwall(){
    forceSectionVisibility();
    const old=document.querySelector('script[data-runtime-v4-offerwall]');
    if(old) return;
    try{ window.__RISELOOTER_OFFERWALL_GG__=false; }catch(_){}
    const s=document.createElement('script');
    s.src='/offerwallgg-integration.js?v=20260910-runtime-v4';
    s.defer=true; s.dataset.runtimeV4Offerwall='1';
    document.body.appendChild(s);
  }

  async function sync(){
    forceSectionVisibility();
    const session=await getSession();
    if(!session?.user){ showLoggedOutState(); reloadOfferwall(); return; }
    await authoritativeProfile(session);
    reloadOfferwall();
  }

  function boot(){
    sync();
    [250,700,1500,3000,6000].forEach(ms=>setTimeout(sync,ms));
    window.addEventListener('pageshow',sync);
    window.addEventListener('focus',sync);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync();});
    try{ sb?.auth?.onAuthStateChange?.(()=>setTimeout(sync,50)); }catch(_){}
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
