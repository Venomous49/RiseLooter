(() => {
  if (window.__RISELOOTER_OFFERWALL_GG__) return;
  window.__RISELOOTER_OFFERWALL_GG__ = true;


  function removeLegacySurveys(){
    document.querySelectorAll('[data-category="survey"], .filter[data-filter="survey"]').forEach(el => el.remove());
  }

  function ensureStyles(){
    if (document.getElementById('offerwallgg-styles')) return;
    const s = document.createElement('style');
    s.id = 'offerwallgg-styles';
    s.textContent = `
      #gamesOfferwall.section{overflow:hidden}
      #gamesOfferwall .ow-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px}
      #gamesOfferwall .ow-title{margin:0;font-size:20px}
      #gamesOfferwall .ow-sub{color:#99a4b0;margin-top:4px}
      #gamesOfferwall .ow-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid #6f3cb4;border-radius:999px;background:#171020;color:#d7b0ff;font-size:11px;font-weight:900}
      #gamesOfferwall .ow-frame-wrap{border:1px solid #243646;border-radius:12px;overflow:hidden;background:#050a0f;min-height:760px}
      #gamesOfferwall iframe{display:block;width:100%;height:800px;border:0;background:#050a0f}
      #gamesOfferwall .ow-login{padding:26px;text-align:center;color:#adb6c0}
      #gamesOfferwall .ow-login .btn{margin-top:12px}
      @media(max-width:700px){
        #gamesOfferwall.section{padding:12px}
        #gamesOfferwall .ow-title{font-size:18px}
        #gamesOfferwall .ow-frame-wrap{min-height:680px;border-radius:10px}
        #gamesOfferwall iframe{height:720px}
      }
    `;
    document.head.appendChild(s);
  }

  function ensureNav(){
    const nav = document.querySelector('nav');
    if (!nav || nav.querySelector('[data-offerwallgg-nav]')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'JEUX';
    btn.setAttribute('data-offerwallgg-nav','1');
    btn.onclick = async () => {
      const session = await getSession();
      if (!session?.access_token) {
        if (typeof openAuth === 'function') openAuth();
        else document.getElementById('authButton')?.click();
        return;
      }
      try {
        const res = await fetch('/api/offerwallgg/config', {
          headers: { authorization: 'Bearer ' + session.access_token },
          cache: 'no-store'
        });
        const data = await res.json();
        if (!res.ok || !data?.wall_url) throw new Error('Offerwall unavailable');
        window.open(data.wall_url, '_blank', 'noopener');
      } catch (_) {
        alert('Les jeux rémunérés sont momentanément indisponibles.');
      }
    };
    const missionsBtn = nav.querySelector('[data-nav="missions"]');
    if (missionsBtn && missionsBtn.nextSibling) nav.insertBefore(btn, missionsBtn.nextSibling);
    else nav.appendChild(btn);
  }

  function ensureSection(){
    let section = document.getElementById('gamesOfferwall');
    if (section) return section;

    section = document.createElement('section');
    section.id = 'gamesOfferwall';
    section.className = 'section panel';
    section.innerHTML = `
      <div class="ow-head">
        <div>
          <h2 class="ow-title">🎮 Jeux rémunérés</h2>
          <div class="ow-sub">Joue, atteins les objectifs proposés et gagne des RL Coins.</div>
        </div>
        <div class="ow-badge">🔥 Offres du moment</div>
      </div>
      <div id="offerwallggContent"></div>
    `;

    const missions = document.getElementById('missions');
    const evolution = document.getElementById('evolution');
    if (missions?.parentNode) missions.parentNode.insertBefore(section, missions.nextSibling);
    else if (evolution?.parentNode) evolution.parentNode.insertBefore(section, evolution);
    else document.querySelector('main')?.appendChild(section);

    return section;
  }

  async function getSession(){
    try{
      if (typeof sb !== 'undefined' && sb?.auth) {
        return (await sb.auth.getSession()).data.session || null;
      }
    }catch(_){}
    return null;
  }

  async function render(){
    removeLegacySurveys();
    ensureStyles();
    ensureNav();
    ensureSection();

    const box = document.getElementById('offerwallggContent');
    if (!box) return;

    const session = await getSession();
    if (!session?.user?.id){
      box.innerHTML = '<div class="ow-frame-wrap"><div class="ow-login">Connecte-toi pour accéder aux jeux rémunérés.<br><button class="btn" id="offerwallggLogin">Se connecter</button></div></div>';
      document.getElementById('offerwallggLogin')?.addEventListener('click', () => {
        if (typeof openAuth === 'function') openAuth();
        else document.getElementById('authButton')?.click();
      });
      return;
    }

    let wallUrl = '';
    try {
      const res = await fetch('/api/offerwallgg/config', {
        headers: { authorization: 'Bearer ' + session.access_token },
        cache: 'no-store'
      });
      const data = await res.json();
      if (!res.ok || !data?.wall_url) throw new Error(data?.error || 'Offerwall unavailable');
      wallUrl = data.wall_url;
    } catch (_) {
      box.innerHTML = '<div class="ow-frame-wrap"><div class="ow-login">Les jeux rémunérés sont momentanément indisponibles. Réessaie dans quelques instants.</div></div>';
      return;
    }

    box.innerHTML = '<div class="ow-frame-wrap" style="min-height:0;padding:22px;text-align:center"><div style="font-weight:900;font-size:18px;margin-bottom:8px">🎮 Accéder aux jeux rémunérés</div><div style="color:#99a4b0;margin-bottom:14px">Les jeux s\'ouvrent dans une page sécurisée Offerwall.GG liée à ton compte RiseLooter.</div><button type="button" class="btn" id="offerwallggOpenGames">Ouvrir les jeux</button></div>';
    document.getElementById('offerwallggOpenGames')?.addEventListener('click', () => {
      window.open(wallUrl, '_blank', 'noopener');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, {once:true});
  } else {
    render();
  }

  setTimeout(render, 1000);
  setTimeout(render, 3000);

  try{
    if (typeof sb !== 'undefined' && sb?.auth?.onAuthStateChange){
      sb.auth.onAuthStateChange(() => setTimeout(render, 100));
    }
  }catch(_){}
})();