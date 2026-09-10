/* RiseLooter mobile recovery: restore visible balance, rotation, bottom earning access and games. */
(() => {
  if (window.__RISELOOTER_MOBILE_RECOVERY_V1__) return;
  window.__RISELOOTER_MOBILE_RECOVERY_V1__ = true;

  try { if (screen.orientation && typeof screen.orientation.unlock === 'function') screen.orientation.unlock(); } catch (_) {}

  const style = document.createElement('style');
  style.id = 'riselooter-mobile-recovery-v1';
  style.textContent = `
    @media (max-width: 700px){
      header{position:relative!important;display:flex!important;flex-wrap:wrap!important;gap:8px!important;padding:10px 12px!important;min-height:auto!important;height:auto!important;overflow:visible!important}
      .logo{flex:1 1 100%!important;margin:0!important}
      .header-right{display:flex!important;flex-wrap:wrap!important;gap:7px!important;width:100%!important;align-items:center!important;overflow:visible!important}
      .coin-pill{display:inline-flex!important;visibility:visible!important;opacity:1!important;position:relative!important;transform:none!important;clip:auto!important;clip-path:none!important;max-width:none!important;width:auto!important;min-width:112px!important;height:auto!important;padding:8px 9px!important;justify-content:center!important;align-items:center!important;font-size:12px!important;order:-10!important;z-index:90!important}
      .header-right .btn{min-width:0!important;padding:9px 8px!important;font-size:11px!important;white-space:nowrap!important}
      nav{width:100%!important;display:flex!important;overflow-x:auto!important;gap:16px!important;-webkit-overflow-scrolling:touch!important}
      nav button{flex:0 0 auto!important;padding:9px 0!important}
      main{padding-bottom:max(90px,calc(70px + env(safe-area-inset-bottom)))!important}
      #gamesOfferwall{display:block!important;visibility:visible!important;opacity:1!important;height:auto!important;min-height:120px!important;overflow:visible!important}
      #gamesOfferwall #offerwallggContent{display:block!important;visibility:visible!important;min-height:80px!important}
    }
    @media (orientation: landscape) and (max-height: 700px){
      .wrapper{width:min(1500px,98%)!important}
      header{position:relative!important;display:flex!important;flex-wrap:wrap!important;padding:6px 10px!important;gap:8px!important;height:auto!important;overflow:visible!important}
      .logo{flex:0 0 auto!important;font-size:20px!important}
      nav{width:auto!important;flex:1 1 420px!important;gap:14px!important}
      nav button{padding:8px 0!important;font-size:10px!important}
      .header-right{display:flex!important;width:auto!important;flex:0 0 auto!important;gap:6px!important}
      .coin-pill{display:inline-flex!important;visibility:visible!important;opacity:1!important;min-width:112px!important}
      .dashboard{grid-template-columns:1.15fr 1fr!important}
      .two-cols{grid-template-columns:1fr 1fr!important}
      #gamesOfferwall .ow-native-grid{grid-template-columns:repeat(auto-fit,minmax(230px,1fr))!important}
    }
  `;
  document.head.appendChild(style);

  function forceVisible(el){
    if (!el) return;
    el.hidden = false;
    el.removeAttribute('aria-hidden');
    el.style.setProperty('display', el.tagName === 'BUTTON' ? 'inline-flex' : '', 'important');
    el.style.setProperty('visibility','visible','important');
    el.style.setProperty('opacity','1','important');
  }

  function keepMobileUiReachable(){
    document.querySelectorAll('.coin-pill').forEach(forceVisible);
    const games = document.getElementById('gamesOfferwall');
    if (games) {
      games.hidden = false;
      games.removeAttribute('aria-hidden');
    }
    document.querySelectorAll('button,a,[role="button"],nav button').forEach(el => {
      const t = (el.textContent || '').trim().toLowerCase();
      if (t.includes('se rémunérer') || t.includes('se remunerer') || t === 'rémunérer' || t === 'remunerer') forceVisible(el);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', keepMobileUiReachable, {once:true});
  else keepMobileUiReachable();
  window.addEventListener('orientationchange', () => setTimeout(keepMobileUiReachable, 100));
  window.addEventListener('resize', () => setTimeout(keepMobileUiReachable, 60));
  const observer = new MutationObserver(() => keepMobileUiReachable());
  observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','hidden','aria-hidden']});
  setTimeout(keepMobileUiReachable, 800);
  setTimeout(keepMobileUiReachable, 2200);
})();
