(()=>{
'use strict';
if(window.__RISELOOTER_STRUCTURAL_REWARDS_V1__)return;
window.__RISELOOTER_STRUCTURAL_REWARDS_V1__=true;
const $=id=>document.getElementById(id);
function install(){
  const style=document.createElement('style');
  style.id='structuralRewardsStyle';
  style.textContent=`
    @media(max-width:650px){
      .header-right .coin-pill{display:flex!important;align-items:center!important;white-space:nowrap!important;padding:8px 10px!important;font-size:12px!important}
      header{gap:8px!important;flex-wrap:wrap!important;padding:7px 0!important}
      .logo{font-size:22px!important}
      .header-right{margin-left:auto!important;display:flex!important;flex-wrap:wrap!important;justify-content:flex-end!important}
    }
    #gamesOfferwall{display:block!important;visibility:visible!important;opacity:1!important}
  `;
  document.head.appendChild(style);

  const pill=document.querySelector('.header-right .coin-pill');
  if(pill){
    pill.style.setProperty('display','flex','important');
    pill.style.setProperty('visibility','visible','important');
  }

  let games=$('gamesOfferwall');
  if(!games){
    games=document.createElement('section');
    games.id='gamesOfferwall';
    games.className='panel section';
    games.innerHTML='<h2>🎮 Jeux rémunérés</h2><div class="section-subtitle">Joue, atteins les objectifs proposés et gagne des RL Coins.</div><div id="offerwallGamesStatus" class="muted">Chargement des jeux…</div><div id="offerwallGamesGrid" class="mission-grid"></div>';
    const missions=$('missions');
    if(missions) missions.parentNode.insertBefore(games,missions);
    else document.querySelector('main')?.appendChild(games);
  }

  // The detailed Offerwall module owns the data and mission UI. This call is
  // deliberately one-shot: no polling, observers, focus or visibility loops.
  setTimeout(()=>{try{window.riselooterLoadOfferwall?.()}catch(_){}},0);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
else install();
})();
