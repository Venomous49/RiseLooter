/* RiseLooter runtime stability v5 — responsive + navigation + authoritative profile + Offerwall recovery. */
(() => {
  'use strict';
  if (window.__RISELOOTER_RUNTIME_STABILITY_V5__) return;
  window.__RISELOOTER_RUNTIME_STABILITY_V5__ = true;

  const $ = id => document.getElementById(id);
  const SECTION_IDS = ['home','challenges','missions','evolution','leaderboard','referral','withdrawals','gamesOfferwall'];
  const version='20260910-v5';

  function installCss(){
    if ($('rl-runtime-v5-style')) return;
    const s=document.createElement('style'); s.id='rl-runtime-v5-style';
    s.textContent=`
      html,body{max-width:100%;overflow-x:hidden}
      img{max-width:100%}
      header{box-sizing:border-box}
      #gamesOfferwall,#offerwallggContent{width:100%;box-sizing:border-box}
      #gamesOfferwall .ow-native-grid{width:100%}
      @media(max-width:1024px){
        header{position:sticky!important;top:0!important;height:auto!important;min-height:0!important;display:flex!important;flex-wrap:wrap!important;align-items:center!important;gap:8px 12px!important;padding:10px 3%!important;overflow:visible!important}
        .logo{flex:1 1 auto!important;min-width:150px!important;margin:0!important;white-space:nowrap!important;font-size:clamp(22px,4vw,27px)!important}
        .header-right{display:flex!important;flex:1 1 100%!important;width:100%!important;align-items:center!important;gap:8px!important;flex-wrap:wrap!important}
        .header-right .coin-pill,.coin-pill{display:flex!important;visibility:visible!important;opacity:1!important;flex:1 1 100%!important;min-width:0!important;justify-content:center!important;margin:0!important;white-space:nowrap!important}
        .header-right #withdrawHeader{flex:1 1 190px!important;min-width:0!important}
        .header-right #authButton{flex:0 1 auto!important;min-width:110px!important}
        nav{display:flex!important;order:20!important;flex:1 1 100%!important;width:100%!important;gap:8px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 0!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:thin!important}
        nav button{flex:0 0 auto!important;padding:10px 8px!important;font-size:11px!important;white-space:nowrap!important}
        .wrapper{width:min(100%,96%)!important}
        .dashboard,.two-cols{grid-template-columns:1fr!important}
        .evolution-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important}
        #gamesOfferwall .ow-native-grid,#gamesOfferwall .ow-active-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      }
      @media(max-width:700px){
        header{padding:9px 14px!important}
        .logo{flex-basis:100%!important}
        .header-right #withdrawHeader{flex:1 1 60%!important}
        .header-right #authButton{flex:1 1 34%!important}
        .section{padding:12px!important}
        .hero{min-height:560px!important}
        .hero-copy{left:16px!important;right:16px!important;max-width:calc(100% - 32px)!important}
        .hero-copy h1{font-size:clamp(30px,9vw,42px)!important;overflow-wrap:anywhere!important}
        .next-evolution{left:12px!important;bottom:115px!important;width:min(290px,calc(100% - 24px))!important}
        .hero-track{left:10px!important;right:10px!important;overflow-x:auto!important;display:flex!important;gap:15px!important;justify-content:flex-start!important;padding-bottom:2px!important}
        .track-node{min-width:50px!important;flex:0 0 50px!important}
        .evolution-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
        #gamesOfferwall .ow-native-grid,#gamesOfferwall .ow-active-grid{grid-template-columns:1fr!important}
        #gamesOfferwall.section{display:block!important;visibility:visible!important;opacity:1!important;overflow:visible!important}
        #offerwallggContent{display:block!important;visibility:visible!important;opacity:1!important;min-height:100px!important}
        .progress-grid{grid-template-columns:1fr!important}
      }
      @media(min-width:701px) and (max-width:1024px) and (orientation:landscape){
        .dashboard{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr)!important}
        #gamesOfferwall .ow-native-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      }
    `;
    document.head.appendChild(s);
  }

  function revealCoreSections(){
    SECTION_IDS.forEach(id=>{
      const el=$(id); if(!el)return;
      el.hidden=false; el.removeAttribute('aria-hidden');
      ['visibility','opacity','height','max-height','min-height','overflow'].forEach(p=>el.style.removeProperty(p));
    });
    const games=$('gamesOfferwall'); if(games){games.style.setProperty('display','block','important');games.style.setProperty('visibility','visible','important');games.style.setProperty('opacity','1','important');}
    const box=$('offerwallggContent'); if(box){box.style.setProperty('display','block','important');box.style.setProperty('visibility','visible','important');}
  }

  function bindNavigation(){
    document.querySelectorAll('[data-nav]').forEach(btn=>{
      if(btn.dataset.rlNavV5==='1')return; btn.dataset.rlNavV5='1';
      btn.addEventListener('click',()=>{
        const target=$(btn.dataset.nav); if(!target)return;
        target.hidden=false; target.scrollIntoView({behavior:'smooth',block:'start'});
        if(btn.dataset.nav==='leaderboard'&&typeof loadLeaderboard==='function') Promise.resolve(loadLeaderboard()).catch(()=>{});
      });
    });
    const nav=document.querySelector('nav');
    if(nav&&!nav.querySelector('[data-rl-games-nav-v5]')){
      const b=document.createElement('button'); b.type='button'; b.textContent='JEUX'; b.dataset.rlGamesNavV5='1';
      b.onclick=()=>{revealCoreSections(); $('gamesOfferwall')?.scrollIntoView({behavior:'smooth',block:'start'});};
      nav.appendChild(b);
    }
  }

  function loggedOutUi(){
    const auth=$('authButton'); if(auth)auth.textContent='Connexion';
    const c=$('headerCoins'); if(c)c.textContent='—';
    const xp=$('totalXP'); if(xp)xp.textContent='Connexion requise';
    const s=$('streakBig'); if(s)s.textContent='Connexion requise';
  }

  async function waitForSupabase(){
    const deadline=Date.now()+10000;
    while(Date.now()<deadline){
      if(typeof sb!=='undefined'&&sb?.auth?.getSession)return true;
      await new Promise(r=>setTimeout(r,100));
    }
    return false;
  }

  async function getSession(){
    if(!(await waitForSupabase()))return null;
    try{return (await sb.auth.getSession())?.data?.session||null}catch(_){return null}
  }

  function syncProfileDom(p){
    const coins=Number(p?.lootix_available||0),xp=Number(p?.xp||0),streak=Number(p?.current_streak||0);
    const c=$('headerCoins'); if(c)c.textContent=coins.toLocaleString('fr-FR');
    const w=$('withdrawAvailable'); if(w)w.textContent=coins.toLocaleString('fr-FR')+' RL Coins';
    const t=$('totalXP'); if(t)t.textContent=xp.toLocaleString('fr-FR')+' XP';
    const sbig=$('streakBig'); if(sbig)sbig.textContent=streak+' jours';
    const cs=$('currentStreak'); if(cs)cs.textContent=streak+' jours';
    const bs=$('bestStreak'); if(bs)bs.textContent=Number(p?.longest_streak||0)+' jours';
  }

  async function loadAuthoritativeProfile(session){
    if(!session?.user?.id)return null;
    try{
      const {data,error}=await sb.from('profiles').select('*').eq('id',session.user.id).single();
      if(error||!data)return null;
      try{currentUser=session.user;currentProfile=data}catch(_){}
      if(typeof renderProfile==='function')renderProfile(data);
      syncProfileDom(data);
      if(typeof renderStreakDays==='function')renderStreakDays(Number(data.current_streak||0));
      const a=$('authButton'); if(a)a.textContent='Déconnexion';
      return data;
    }catch(_){return null}
  }

  function offerwallLooksBroken(){
    const box=$('offerwallggContent');
    if(!box)return true;
    const text=(box.textContent||'').trim();
    return !box.querySelector('.ow-card,.ow-login,.ow-frame-wrap') && text.length<15;
  }

  function hardReloadOfferwall(){
    if(document.querySelector('script[data-rl-offerwall-v5]'))return;
    try{window.__RISELOOTER_OFFERWALL_GG__=false}catch(_){}
    const s=document.createElement('script');s.src='/offerwallgg-integration.js?v='+version;s.defer=true;s.dataset.rlOfferwallV5='1';document.body.appendChild(s);
  }

  async function refreshAll(){
    installCss(); revealCoreSections(); bindNavigation();
    const session=await getSession();
    if(!session?.user){loggedOutUi();hardReloadOfferwall();return;}
    await loadAuthoritativeProfile(session);
    if(typeof loadLeaderboard==='function') Promise.resolve(loadLeaderboard()).catch(()=>{});
    if(typeof loadReferralSummary==='function') Promise.resolve(loadReferralSummary()).catch(()=>{});
    if(typeof loadWithdrawals==='function') Promise.resolve(loadWithdrawals()).catch(()=>{});
    hardReloadOfferwall();
    setTimeout(()=>{if(offerwallLooksBroken()){const old=document.querySelector('script[data-rl-offerwall-v5]');if(old)old.remove();try{window.__RISELOOTER_OFFERWALL_GG__=false}catch(_){};hardReloadOfferwall();}},1200);
  }

  function boot(){
    refreshAll();
    [300,900,1800,3500,6500].forEach(ms=>setTimeout(refreshAll,ms));
    window.addEventListener('pageshow',refreshAll);
    window.addEventListener('focus',refreshAll);
    window.addEventListener('resize',()=>{installCss();revealCoreSections();bindNavigation()},{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(refreshAll,150));
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshAll()});
    try{sb?.auth?.onAuthStateChange?.(()=>setTimeout(refreshAll,80))}catch(_){}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
