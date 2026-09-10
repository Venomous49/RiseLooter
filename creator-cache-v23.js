(() => {
  'use strict';

  // Stability v12: one-shot creator asset cache normalization only.
  // No global MutationObserver: other runtime scripts also update image src values,
  // and observing/re-writing those mutations can create a render loop on mobile.
  const VERSION = `creator-${Date.now().toString(36)}`;

  const installMobileBalanceFix = () => {
    if (document.getElementById('riselooter-mobile-balance-fix')) return;
    const style = document.createElement('style');
    style.id = 'riselooter-mobile-balance-fix';
    style.textContent = `
      @media (max-width:650px){
        header{min-height:0!important;padding:8px 0!important;gap:7px!important;flex-wrap:wrap!important;align-items:center!important}
        header .logo{font-size:21px!important;line-height:1!important;margin-right:auto!important}
        header .header-right{width:100%!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:6px!important;align-items:center!important}
        header .coin-pill{display:flex!important;visibility:visible!important;grid-column:1 / -1!important;align-items:center!important;justify-content:center!important;min-height:38px!important;width:100%!important;padding:7px 10px!important;margin:0!important;border:1px solid #29394a!important;border-radius:9px!important;background:#03090e!important;color:var(--gold,#ffb52c)!important;font-size:13px!important;font-weight:900!important;white-space:nowrap!important}
        header #withdrawHeader{min-width:0!important;width:100%!important;padding:9px 10px!important;font-size:12px!important;white-space:nowrap!important}
        header #authButton{padding:9px 10px!important;font-size:12px!important;white-space:nowrap!important}
      }
    `;
    document.head.appendChild(style);
  };

  const rewrite = (img) => {
    if (!(img instanceof HTMLImageElement)) return;
    const raw = img.getAttribute('src') || '';
    if (!raw.includes('assets/creator/')) return;
    try {
      const url = new URL(raw, location.href);
      if (url.searchParams.get('v') !== VERSION) {
        url.searchParams.set('v', VERSION);
        img.src = url.toString();
      }
      const fallback = img.dataset.fallback;
      if (fallback && fallback.includes('assets/creator/')) {
        const f = new URL(fallback, location.href);
        if (f.searchParams.get('v') !== VERSION) {
          f.searchParams.set('v', VERSION);
          img.dataset.fallback = f.toString();
        }
      }
    } catch (_) {}
  };

  const scan = (root = document) => root.querySelectorAll?.('img[src*="assets/creator/"]').forEach(rewrite);

  const start = () => {
    installMobileBalanceFix();
    scan();
    window.riselooterRefreshCreatorAssets = () => scan();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
