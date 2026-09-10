/* RiseLooter production recovery v3 — session/profile, mobile balance, canonical art, rewarded games. */
(() => {
  'use strict';
  if (window.__RISELOOTER_PRODUCTION_RECOVERY_V3__) return;
  window.__RISELOOTER_PRODUCTION_RECOVERY_V3__ = true;

  const LEVELS=[1,5,10,15,20,30,40,50];
  const SLUGS=['01-debutant','05-debrouillard','10-chasseur','15-hustler','20-pro','30-elite','40-cyber-looter','50-rise-looter'];
  const $=id=>document.getElementById(id);
  const profileAsset=(profile,stage)=>`${String(profile?.avatar_gender||'male').toLowerCase()==='female'?'/female-':'/'}${SLUGS[Math.max(0,Math.min(7,stage))]}.webp?v=prod-recovery-20260910`;
  const stageForLevel=level=>{let i=0;LEVELS.forEach((n,x)=>{if(Number(level||1)>=n)i=x;});return i;};

  const css=document.createElement('style');
  css.id='riselooter-production-recovery-v3-style';
  css.textContent=`
    @media(max-width:700px){
      header{height:auto!important;min-height:0!important;overflow:visible!important;display:flex!important;flex-wrap:wrap!important;gap:8px!important;padding:10px 14px!important}
      .logo{flex:1 1 100%!important}
      .header-right{display:flex!important;visibility:visible!important;width:100%!important;flex-wrap:wrap!important;gap:8px!important;align-items:center!important}
      .header-right .coin-pill,.coin-pill{display:flex!important;visibility:visible!important;opacity:1!important;position:relative!important;transform:none!important;clip:auto!important;clip-path:none!important;width:100%!important;box-sizing:border-box!important;justify-content:center!important;order:-20!important;margin:0!important}
      .header-right #withdrawHeader{flex:1 1 62%!important}
      .header-right #authButton{flex:0 1 auto!important}
      nav{display:flex!important;width:100%!important;overflow-x:auto!important;-webkit-overflow-scrolling:touch!important}
      #gamesOfferwall{display:block!important;visibility:visible!important;opacity:1!important;height:auto!important;min-height:140px!important}
      #offerwallggContent{display:block!important;visibility:visible!important;opacity:1!important;min-height:80px!important}
    }
    #mainCharacter img.rl-prod-stage,#nextEvolutionShadow img.rl-prod-stage{display:block!important;visibility:visible!important;opacity:1!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:center bottom!important;background:transparent!important;filter:none!important}
    #nextEvolutionShadow{background:#03090d!important;overflow:hidden!important}
  `;
  document.head.appendChild(css);

  function repairArt(profile){
    if(!profile) return;
    const stage=stageForLevel(profile.level);
    const main=$('mainCharacter');
    if(main){
      const src=profileAsset(profile,stage);
      main.innerHTML=`<img class="rl-prod-stage" src="${src}" alt="Looter actuel" decoding="async">`;
    }
    const next=$('nextEvolutionShadow');
    if(next && stage<7){
      const src=profileAsset(profile,stage+1);
      next.innerHTML=`<img class="rl-prod-stage" src="${src}" alt="Prochaine évolution" decoding="async">`;
    }
  }

  function syncBalance(profile){
    const amount=Number(profile?.lootix_available ?? profile?.rl_coins ?? 0);
    const coins=$('headerCoins');
    if(coins) coins.textContent=amount.toLocaleString('fr-FR');
    const withdraw=$('withdrawAvailable');
    if(withdraw) withdraw.textContent=amount.toLocaleString('fr-FR')+' RL Coins';
    document.querySelectorAll('.coin-pill').forEach(el=>{
      el.style.setProperty('display','flex','important');
      el.style.setProperty('visibility','visible','important');
      el.style.setProperty('opacity','1','important');
    });
  }

  async function restoreProfile(){
    if(typeof sb==='undefined' || !sb?.auth) return null;
    let session=null;
    try{ session=(await sb.auth.getSession())?.data?.session||null; }catch(_){}
    if(!session?.user) return null;
    try{
      const {data,error}=await sb.from('profiles').select('*').eq('id',session.user.id).single();
      if(error||!data) return null;
      try{ currentUser=session.user; currentProfile=data; }catch(_){}
      const auth=$('authButton'); if(auth) auth.textContent='Déconnexion';
      if(typeof renderProfile==='function') renderProfile(data);
      syncBalance(data);
      repairArt(data);
      return data;
    }catch(_){ return null; }
  }

  function ensureGamesVisible(){
    let section=$('gamesOfferwall');
    if(section){
      section.hidden=false;
      section.removeAttribute('aria-hidden');
      section.style.setProperty('display','block','important');
      section.style.setProperty('visibility','visible','important');
    }
    // Reload the current Offerwall integration under a fresh URL so mobile browsers cannot reuse an old cached v=1 file.
    if(!document.querySelector('script[data-riselooter-offerwall-recovery]')){
      try{ window.__RISELOOTER_OFFERWALL_GG__=false; }catch(_){}
      const s=document.createElement('script');
      s.src='/offerwallgg-integration.js?v=prod-recovery-20260910-3';
      s.defer=true;
      s.dataset.riselooterOfferwallRecovery='1';
      document.body.appendChild(s);
    }
  }

  async function recover(){
    const profile=await restoreProfile();
    if(profile){ syncBalance(profile); repairArt(profile); }
    ensureGamesVisible();
  }

  function boot(){
    recover();
    setTimeout(recover,350);
    setTimeout(recover,1200);
    setTimeout(recover,3000);
    window.addEventListener('pageshow',recover);
    window.addEventListener('focus',recover);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)recover();});
    try{ sb?.auth?.onAuthStateChange?.(()=>setTimeout(recover,0)); }catch(_){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
