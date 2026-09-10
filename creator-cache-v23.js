(() => {
  'use strict';

  // Use one cache-busting token per page load. The old fixed value (fullbody23)
  // meant every rebuilt hairstyle kept the exact same URL, so the browser/CDN
  // could continue serving an older WebP even after GitHub rebuilt and deployed
  // a different file at that path.
  const VERSION = `creator-${Date.now().toString(36)}`;

  const installMobileBalanceFix = () => {
    if (document.getElementById('riselooter-mobile-balance-fix')) return;
    const style = document.createElement('style');
    style.id = 'riselooter-mobile-balance-fix';
    style.textContent = `
      @media (max-width:650px){
        header{
          min-height:0!important;
          padding:8px 0!important;
          gap:7px!important;
          flex-wrap:wrap!important;
          align-items:center!important;
        }
        header .logo{
          font-size:21px!important;
          line-height:1!important;
          margin-right:auto!important;
        }
        header .header-right{
          width:100%!important;
          display:grid!important;
          grid-template-columns:minmax(0,1fr) auto!important;
          gap:6px!important;
          align-items:center!important;
        }
        header .coin-pill{
          display:flex!important;
          visibility:visible!important;
          grid-column:1 / -1!important;
          align-items:center!important;
          justify-content:center!important;
          min-height:38px!important;
          width:100%!important;
          padding:7px 10px!important;
          margin:0!important;
          border:1px solid #29394a!important;
          border-radius:9px!important;
          background:#03090e!important;
          color:var(--gold,#ffb52c)!important;
          font-size:13px!important;
          font-weight:900!important;
          white-space:nowrap!important;
        }
        header #withdrawHeader{
          min-width:0!important;
          width:100%!important;
          padding:9px 10px!important;
          font-size:12px!important;
          white-space:nowrap!important;
        }
        header #authButton{
          padding:9px 10px!important;
          font-size:12px!important;
          white-space:nowrap!important;
        }
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
        const nextSrc = url.toString();
        if (img.src !== nextSrc) img.src = nextSrc;
      }

      const fallback = img.dataset.fallback;
      if (fallback && fallback.includes('assets/creator/')) {
        const f = new URL(fallback, location.href);
        if (f.searchParams.get('v') !== VERSION) {
          f.searchParams.set('v', VERSION);
          const nextFallback = f.toString();
          if (img.dataset.fallback !== nextFallback) img.dataset.fallback = nextFallback;
        }
      }
    } catch (_) {}
  };

  const scan = (root = document) => {
    root.querySelectorAll?.('img[src*="assets/creator/"]').forEach(rewrite);
  };

  const start = () => {
    installMobileBalanceFix();
    scan();
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.target instanceof HTMLImageElement) {
          rewrite(m.target);
          continue;
        }
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node instanceof HTMLImageElement) rewrite(node);
          scan(node);
        }
      }
    });
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['src','data-fallback']
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
