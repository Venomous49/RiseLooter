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
    btn.onclick = () => document.getElementById('gamesOfferwall')?.scrollIntoView({behavior:'smooth',block:'start'});
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

  function deviceLabel(){
    const ua=navigator.userAgent||'';
    if (/iPad|iPhone|iPod/i.test(ua)) return 'iPhone / iPad';
    if (/Android/i.test(ua)) return 'Android';
    return 'PC';
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

    try {
      const res = await fetch('/api/offerwallgg/offers', {
        headers: { authorization: 'Bearer ' + session.access_token },
        cache: 'no-store'
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Offerwall unavailable');
      const offers = Array.isArray(data.offers) ? data.offers : [];
      if (!offers.length) {
        box.innerHTML = '<div class="ow-frame-wrap" style="min-height:0;padding:24px;text-align:center">Aucun jeu rémunéré disponible pour ton appareil ou ton pays actuellement.</div>';
        return;
      }
      box.innerHTML = '<div id="ow-device-note" style="margin:0 0 12px;color:#99a4b0;font-size:12px"></div><div class="ow-native-grid"></div>';
      const note=box.querySelector('#ow-device-note');
      note.textContent = 'Offres proposées par Offerwall.GG pour cet appareil ('+deviceLabel()+') et ta localisation.';
      const grid = box.querySelector('.ow-native-grid');
      grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px';
      offers.forEach(offer => {
        const card=document.createElement('article');
        card.className='panel';
        card.style.cssText='padding:16px;display:flex;flex-direction:column;gap:10px;min-height:190px';
        const title=document.createElement('strong');
        title.textContent=offer.name || 'Jeu rémunéré';
        const req=document.createElement('div');
        req.style.cssText='color:#99a4b0;font-size:13px;line-height:1.4;flex:1';
        req.textContent=offer.requirements || 'Atteins les objectifs indiqués pour gagner des RL Coins.';
        const reward=document.createElement('div');
        reward.style.cssText='font-weight:900;color:#63e6a3';
        reward.textContent=offer.rewardFormatted || ((offer.reward||0)+' RL Coins');
        const compat=document.createElement('div');
        compat.style.cssText='font-size:11px;font-weight:800;opacity:.9';
        compat.textContent='✓ Sélectionnée pour '+deviceLabel();
        const go=document.createElement('button');
        go.type='button'; go.className='btn'; go.textContent='Commencer';
        go.addEventListener('click',()=>{ window.location.assign(offer.clickUrl); });
        card.append(title,req,reward,compat,go);
        grid.appendChild(card);
      });
    } catch (_) {
      box.innerHTML = '<div class="ow-frame-wrap"><div class="ow-login">Les jeux rémunérés sont momentanément indisponibles. Réessaie dans quelques instants.</div></div>';
    }
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