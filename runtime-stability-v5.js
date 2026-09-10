/* RiseLooter runtime stability v5.1 — RETIRED from production in stable-v6.
   This file remains as a harmless static fallback only and is no longer referenced by index.html.
   Important: no polling, no repeated profile reloads, no Offerwall reinjection. */
(() => {
  'use strict';
  if (window.__RISELOOTER_RUNTIME_STABILITY_V51__) return;
  window.__RISELOOTER_RUNTIME_STABILITY_V51__ = true;

  const style = document.createElement('style');
  style.id = 'rl-runtime-v51-style';
  style.textContent = `
    html,body{max-width:100%;overflow-x:hidden}
    img{max-width:100%}
    #gamesOfferwall,#offerwallggContent{width:100%;box-sizing:border-box}
    @media(max-width:1024px){
      header{height:auto!important;min-height:0!important;display:flex!important;flex-wrap:wrap!important;align-items:center!important;gap:8px 12px!important;padding:10px 3%!important;overflow:visible!important}
      .logo{flex:1 1 auto!important;min-width:150px!important;margin:0!important;white-space:nowrap!important;font-size:clamp(22px,4vw,27px)!important}
      .header-right{display:flex!important;flex:1 1 100%!important;width:100%!important;align-items:center!important;gap:8px!important;flex-wrap:wrap!important}
      .header-right .coin-pill,.coin-pill{display:flex!important;visibility:visible!important;opacity:1!important;flex:1 1 100%!important;min-width:0!important;justify-content:center!important;margin:0!important;white-space:nowrap!important}
      nav{display:flex!important;order:20!important;flex:1 1 100%!important;width:100%!important;gap:8px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 0!important;-webkit-overflow-scrolling:touch!important}
      nav button{flex:0 0 auto!important;padding:10px 8px!important;font-size:11px!important;white-space:nowrap!important}
      .wrapper{width:min(100%,96%)!important}
      .dashboard,.two-cols{grid-template-columns:1fr!important}
      .evolution-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}
      #gamesOfferwall .ow-native-grid,#gamesOfferwall .ow-active-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    }
    @media(max-width:700px){
      header{padding:9px 14px!important}
      .logo{flex-basis:100%!important}
      .section{padding:12px!important}
      .evolution-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      #gamesOfferwall .ow-native-grid,#gamesOfferwall .ow-active-grid{grid-template-columns:1fr!important}
      .progress-grid{grid-template-columns:1fr!important}
    }
    @media(min-width:701px) and (max-width:1024px) and (orientation:landscape){
      .dashboard{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr)!important}
    }
  `;
  document.head.appendChild(style);
})();
