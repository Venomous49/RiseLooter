/* RiseLooter production recovery v3.3 — one-shot session/profile + canonical art.
   Device-specific portrait/landscape/tablet/PC overrides intentionally removed.
   No polling, no focus loops, no duplicate renderProfile calls. */
(() => {
  'use strict';
  if (window.__RISELOOTER_PRODUCTION_RECOVERY_V33__) return;
  window.__RISELOOTER_PRODUCTION_RECOVERY_V33__ = true;

  const LEVELS=[1,5,10,15,20,30,40,50];
  const SLUGS=['01-debutant','05-debrouillard','10-chasseur','15-hustler','20-pro','30-elite','40-cyber-looter','50-rise-looter'];
  const $=id=>document.getElementById(id);
  const stageForLevel=level=>{let i=0;LEVELS.forEach((n,x)=>{if(Number(level||1)>=n)i=x;});return i;};
  const profileAsset=(profile,stage)=>`${String(profile?.avatar_gender||'male').toLowerCase()==='female'?'/female-':'/'}${SLUGS[Math.max(0,Math.min(7,stage))]}.webp?v=stable-v8`;

  function installCss(){
    if ($('riselooter-production-recovery-v33-style')) return;
    const css=document.createElement('style');
    css.id='riselooter-production-recovery-v33-style';
    css.textContent=`
      #mainCharacter img.rl-prod-stage,#nextEvolutionShadow img.rl-prod-stage{display:block!important;visibility:visible!important;opacity:1!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:center bottom!important;background:transparent!important;filter:none!important}
      #nextEvolutionShadow{background:#03090d!important;overflow:hidden!important}
    `;
    document.head.appendChild(css);
  }

  function repairArt(profile){
    if(!profile) return;
    const stage=stageForLevel(profile.level);
    const main=$('mainCharacter');
    if(main) main.innerHTML=`<img class="rl-prod-stage" src="${profileAsset(profile,stage)}" alt="Looter actuel" decoding="async">`;
    const next=$('nextEvolutionShadow');
    if(next && stage<7) next.innerHTML=`<img class="rl-prod-stage" src="${profileAsset(profile,stage+1)}" alt="Prochaine évolution" decoding="async">`;
  }

  function syncProfile(profile){
    const amount=Number(profile?.lootix_available ?? profile?.rl_coins ?? 0);
    const xp=Number(profile?.xp||0);
    const streak=Number(profile?.current_streak||0);
    if($('headerCoins')) $('headerCoins').textContent=amount.toLocaleString('fr-FR');
    if($('withdrawAvailable')) $('withdrawAvailable').textContent=amount.toLocaleString('fr-FR')+' RL Coins';
    if($('totalXP')) $('totalXP').textContent=xp.toLocaleString('fr-FR')+' XP';
    if($('streakBig')) $('streakBig').textContent=streak+' jours';
    if($('currentStreak')) $('currentStreak').textContent=streak+' jours';
    if($('authButton')) $('authButton').textContent='Déconnexion';
    document.querySelectorAll('.coin-pill').forEach(el=>{el.style.setProperty('display','flex','important');el.style.setProperty('visibility','visible','important');el.style.setProperty('opacity','1','important');});
    repairArt(profile);
  }

  async function recoverOnce(){
    installCss();
    try{
      if(typeof sb==='undefined'||!sb?.auth) return;
      const session=(await sb.auth.getSession())?.data?.session||null;
      if(!session?.user) return;
      const {data,error}=await sb.from('profiles').select('*').eq('id',session.user.id).single();
      if(error||!data) return;
      try{currentUser=session.user;currentProfile=data;}catch(_){}
      syncProfile(data);
      try{window.riselooterApplyFixedStageArt?.();}catch(_){}
      try{window.riselooterSyncStageSilhouettes?.();}catch(_){}
    }catch(_){}
  }

  function boot(){
    installCss();
    recoverOnce();
    if(!document.querySelector('script[data-riselooter-history-detail]')){
      const s=document.createElement('script');s.src='/history-detail-v2.js?v=stable-v13';s.defer=true;s.dataset.riselooterHistoryDetail='1';document.body.appendChild(s);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
