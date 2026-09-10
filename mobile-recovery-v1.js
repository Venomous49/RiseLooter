/* RiseLooter mobile recovery: restore visible balance, landscape-friendly layout and games access. */
(() => {
  if (window.__RISELOOTER_MOBILE_RECOVERY_V1__) return;
  window.__RISELOOTER_MOBILE_RECOVERY_V1__ = true;

  const style = document.createElement('style');
  style.id = 'riselooter-mobile-recovery-v1';
  style.textContent = `
    @media (max-width: 700px){
      header{position:relative!important;display:flex!important;flex-wrap:wrap!important;gap:10px!important;padding:12px 14px!important;min-height:auto!important}
      .logo{flex:1 1 100%!important;margin:0!important}
      .header-right{display:grid!important;grid-template-columns:minmax(118px,.72fr) minmax(170px,1.45fr) minmax(112px,.8fr)!important;gap:8px!important;width:100%!important;align-items:stretch!important}
      .coin-pill{display:inline-flex!important;visibility:visible!important;opacity:1!important;min-width:0!important;padding:8px 7px!important;justify-content:center!important;align-items:center!important;font-size:12px!important;order:0!important}
      .header-right .btn{min-width:0!important;padding:10px 8px!important;font-size:12px!important;white-space:nowrap!important}
      nav{width:100%!important;overflow-x:auto!important;gap:18px!important;-webkit-overflow-scrolling:touch!important}
      nav button{flex:0 0 auto!important;padding:10px 0!important}
      #gamesOfferwall{display:block!important;visibility:visible!important;opacity:1!important;height:auto!important;min-height:120px!important;overflow:visible!important}
      #gamesOfferwall #offerwallggContent{display:block!important;visibility:visible!important;min-height:80px!important}
    }
    @media (orientation: landscape) and (max-height: 700px){
      .wrapper{width:min(1500px,98%)!important}
      header{position:relative!important;flex-wrap:nowrap!important;padding:6px 10px!important;gap:12px!important}
      .logo{flex:0 0 auto!important;font-size:20px!important}
      nav{width:auto!important;flex:1 1 auto!important;gap:14px!important}
      nav button{padding:10px 0!important;font-size:10px!important}
      .header-right{display:flex!important;width:auto!important;flex:0 0 auto!important;gap:6px!important}
      .coin-pill{display:inline-flex!important;visibility:visible!important;min-width:112px!important}
      .dashboard{grid-template-columns:1.15fr 1fr!important}
      .two-cols{grid-template-columns:1fr 1fr!important}
      #gamesOfferwall .ow-native-grid{grid-template-columns:repeat(auto-fit,minmax(230px,1fr))!important}
    }
  `;
  document.head.appendChild(style);

  function keepGamesReachable(){
    const games = document.getElementById('gamesOfferwall');
    if (games) {
      games.hidden = false;
      games.removeAttribute('aria-hidden');
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', keepGamesReachable, {once:true});
  else keepGamesReachable();
  setTimeout(keepGamesReachable, 800);
  setTimeout(keepGamesReachable, 2200);
})();
