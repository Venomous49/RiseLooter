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

  function translateMissionFr(text){
    let s=String(text||'').trim();
    if(!s) return '';
    const rules=[
      [/^Register\.?$/i,"S'inscrire."],
      [/^Complete your first cashout\.?$/i,"Effectuer ton premier retrait."],
      [/^Make a deposit\s*\(Min\.?,?\s*\$?([0-9.,]+)\)\.?$/i,"Effectuer un dépôt (minimum $1)."],
      [/^Make a deposit\.?$/i,"Effectuer un dépôt."],
      [/^Complete (?:the )?Level\s*([0-9]+)\.?$/i,"Atteindre le niveau $1."],
      [/^Reach Level\s*([0-9]+)\.?$/i,"Atteindre le niveau $1."],
      [/^Complete the Apprentice Rank\.?$/i,"Atteindre le rang Apprenti."],
      [/^Complete the Adept Rank\.?$/i,"Atteindre le rang Adepte."],
      [/^Complete the Scholar Rank\.?$/i,"Atteindre le rang Érudit."],
      [/^Complete the Mage Rank\.?$/i,"Atteindre le rang Mage."],
      [/^Complete the Enchanter Rank\.?$/i,"Atteindre le rang Enchanteur."],
      [/^Claim your Daily Rakeback\.?$/i,"Récupérer ton rakeback quotidien."],
      [/^Claim your Welcome Bonus\.?$/i,"Récupérer ton bonus de bienvenue."],
      [/^Play\s*([0-9, .]+)\s*spins? on Slots?\.?$/i,"Jouer $1 tours aux machines à sous."],
      [/^Install(?: and open)?(?: the)? (?:app|game)\.?$/i,"Installer et ouvrir le jeu."]
    ];
    for(const [re,fr] of rules) if(re.test(s)) return s.replace(re,fr);
    const replacements=[
      [/\bComplete\b/gi,'Terminer'],[/\bReach\b/gi,'Atteindre'],[/\bRegister\b/gi,"S'inscrire"],
      [/\bMake a deposit\b/gi,'Effectuer un dépôt'],[/\bClaim\b/gi,'Récupérer'],[/\bPlay\b/gi,'Jouer'],
      [/\bWin\b/gi,'Gagner'],[/\bPurchase\b/gi,'Acheter'],[/\bInstall\b/gi,'Installer'],[/\bOpen\b/gi,'Ouvrir'],
      [/\bLevel\b/gi,'niveau'],[/\bRank\b/gi,'rang'],[/\bDaily\b/gi,'quotidien'],
      [/\bWelcome Bonus\b/gi,'bonus de bienvenue'],[/\bfirst cashout\b/gi,'premier retrait'],
      [/\bspins?\b/gi,'tours'],[/\bSlots?\b/gi,'machines à sous'],
      [/Complete all steps listed\./gi,'Effectue toutes les étapes indiquées.'],
      [/Earn rewards along the way\./gi,'Gagne des récompenses au fil de ta progression.']
    ];
    for(const [re,fr] of replacements) s=s.replace(re,fr);
    return s;
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
        req.style.cssText='color:#99a4b0;font-size:13px;line-height:1.4';
        req.textContent=translateMissionFr(offer.requirements || 'Atteins les objectifs indiqués pour gagner des RL Coins.');

        const ladder=document.createElement('div');
        ladder.style.cssText='display:flex;flex-direction:column;gap:7px;padding:10px;border:1px solid #263848;border-radius:10px;background:#071019';
        ladder.innerHTML='<div style="font-size:12px;font-weight:900">🎯 Missions et récompenses</div><div style="font-size:12px;color:#99a4b0">Chargement des objectifs…</div>';

        const reward=document.createElement('div');
        reward.style.cssText='font-weight:900;color:#63e6a3';
        reward.textContent=offer.rewardFormatted || ((offer.reward||0)+' RL Coins');

        const compat=document.createElement('div');
        compat.style.cssText='font-size:11px;font-weight:800;opacity:.9';
        compat.textContent='✓ Sélectionnée pour '+deviceLabel();

        const go=document.createElement('button');
        go.type='button'; go.className='btn'; go.textContent='Commencer';
        go.addEventListener('click',()=>{ window.location.assign(offer.clickUrl); });

        card.append(title,req,ladder,reward,compat,go);

        fetch('/api/offerwallgg/offers/'+encodeURIComponent(offer.id), {
          headers:{authorization:'Bearer '+session.access_token},
          cache:'no-store'
        }).then(r=>r.json().then(data=>({ok:r.ok,data}))).then(({ok,data})=>{
          const details=data?.offer||{};
          const goals=Array.isArray(details.goals)?details.goals:[];
          if(!ok || !goals.length){
            ladder.innerHTML='<div style="font-size:12px;font-weight:900">🎯 Mission à effectuer</div><div style="font-size:12px;color:#c8d0d8">'+translateMissionFr(details.requirements||offer.requirements||'Suis les objectifs indiqués après avoir lancé le jeu.')+'</div>';
            return;
          }
          ladder.innerHTML='<div style="font-size:12px;font-weight:900">🎯 Missions et récompenses</div>';
          goals.forEach((goal,idx)=>{
            const row=document.createElement('div');
            row.style.cssText='display:flex;justify-content:space-between;gap:10px;align-items:flex-start;padding-top:7px;border-top:1px solid #1c2c38';
            const left=document.createElement('div');
            left.style.cssText='font-size:12px;line-height:1.35';
            left.textContent=(idx+1)+'. '+translateMissionFr(goal.title||goal.description||'Objectif');
            const right=document.createElement('div');
            right.style.cssText='font-size:12px;font-weight:900;color:#63e6a3;white-space:nowrap';
            right.textContent=goal.rewardFormatted || (goal.reward!=null ? ('+'+Number(goal.reward).toLocaleString('fr-FR')+' RL Coins') : '');
            row.append(left,right);
            ladder.appendChild(row);
          });
        }).catch(()=>{
          ladder.innerHTML='<div style="font-size:12px;font-weight:900">🎯 Mission à effectuer</div><div style="font-size:12px;color:#c8d0d8">'+translateMissionFr(offer.requirements||'Suis les objectifs indiqués après avoir lancé le jeu.')+'</div>';
        });
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