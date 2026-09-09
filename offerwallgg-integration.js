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
      #gamesOfferwall .ow-frame-wrap{border:1px solid #243646;border-radius:12px;overflow:hidden;background:#050a0f;min-height:0}
      #gamesOfferwall .ow-login{padding:26px;text-align:center;color:#adb6c0}
      #gamesOfferwall .ow-login .btn{margin-top:12px}
      #gamesOfferwall .ow-native-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;align-items:start}
      #gamesOfferwall .ow-card{padding:14px;border:1px solid #2a3c4c;border-radius:14px;background:linear-gradient(180deg,#0a131d,#08111a);display:flex;flex-direction:column;gap:10px;min-height:0;box-shadow:0 10px 24px rgba(0,0,0,.14)}
      #gamesOfferwall .ow-card-title{font-size:16px;font-weight:900;line-height:1.2}
      #gamesOfferwall .ow-card-desc{color:#9eabb7;font-size:12px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      #gamesOfferwall .ow-reward{font-weight:950;color:#63e6a3;font-size:18px}
      #gamesOfferwall .ow-meta{font-size:11px;font-weight:800;opacity:.85}
      #gamesOfferwall .ow-missions{border:1px solid #263848;border-radius:10px;background:#071019;overflow:hidden}
      #gamesOfferwall .ow-missions-toggle{width:100%;padding:10px 11px;border:0;background:#0b1621;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:10px;font-weight:900;cursor:pointer}
      #gamesOfferwall .ow-missions-toggle span:last-child{font-size:11px;color:#aeb8c2}
      #gamesOfferwall .ow-missions-body{display:none;padding:9px 10px 10px;max-height:260px;overflow:auto}
      #gamesOfferwall .ow-missions.open .ow-missions-body{display:block}
      #gamesOfferwall .ow-mission-row{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-top:1px solid #1c2c38}
      #gamesOfferwall .ow-mission-row:first-child{border-top:0}
      #gamesOfferwall .ow-actions{display:flex;gap:8px;align-items:center}
      #gamesOfferwall .ow-actions .btn{flex:1}
      #gamesOfferwall .ow-card:hover{transform:translateY(-2px);transition:transform .15s ease,border-color .15s ease;border-color:#7040b3}
      @media(max-width:700px){
        #gamesOfferwall.section{padding:12px}
        #gamesOfferwall .ow-title{font-size:18px}
        #gamesOfferwall .ow-native-grid{grid-template-columns:1fr;gap:10px}
        #gamesOfferwall .ow-card{padding:12px}
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
      offers.forEach(offer => {
        const card=document.createElement('article');
        card.className='ow-card';

        const title=document.createElement('div');
        title.className='ow-card-title';
        title.textContent=offer.name || 'Jeu rémunéré';

        const req=document.createElement('div');
        req.className='ow-card-desc';
        req.textContent=translateMissionFr(offer.requirements || 'Atteins les objectifs indiqués pour gagner des RL Coins.');

        const reward=document.createElement('div');
        reward.className='ow-reward';
        reward.textContent=offer.rewardFormatted || ((offer.reward||0)+' RL Coins');

        const ladder=document.createElement('div');
        ladder.className='ow-missions';
        ladder.innerHTML='<button type="button" class="ow-missions-toggle"><span>🎯 Missions et récompenses</span><span>Voir les détails ▾</span></button><div class="ow-missions-body"><div style="font-size:12px;color:#99a4b0">Chargement des objectifs…</div></div>';
        const toggle=ladder.querySelector('.ow-missions-toggle');
        toggle.addEventListener('click',()=>{
          ladder.classList.toggle('open');
          const label=toggle.querySelector('span:last-child');
          label.textContent=ladder.classList.contains('open')?'Masquer ▴':'Voir les détails ▾';
        });

        const compat=document.createElement('div');
        compat.className='ow-meta';
        compat.textContent='✓ Sélectionnée pour '+deviceLabel();

        const actions=document.createElement('div');
        actions.className='ow-actions';
        const go=document.createElement('button');
        go.type='button'; go.className='btn'; go.textContent='Commencer';
        go.addEventListener('click',()=>{ window.location.assign(offer.clickUrl); });
        actions.appendChild(go);

        card.append(title,req,reward,ladder,compat,actions);

        fetch('/api/offerwallgg/offers/'+encodeURIComponent(offer.id), {
          headers:{authorization:'Bearer '+session.access_token},
          cache:'no-store'
        }).then(r=>r.json().then(data=>({ok:r.ok,data}))).then(({ok,data})=>{
          const details=data?.offer||{};
          const goals=Array.isArray(details.goals)?details.goals:[];
          if(!ok || !goals.length){
            const body=ladder.querySelector('.ow-missions-body');
            body.innerHTML='<div style="font-size:12px;color:#c8d0d8">'+translateMissionFr(details.requirements||offer.requirements||'Suis les objectifs indiqués après avoir lancé le jeu.')+'</div>';
            return;
          }
          const body=ladder.querySelector('.ow-missions-body');
          body.innerHTML='';
          const toggleLabel=ladder.querySelector('.ow-missions-toggle span:last-child');
          toggleLabel.textContent=goals.length+' objectif'+(goals.length>1?'s':'')+' ▾';
          goals.forEach((goal,idx)=>{
            const row=document.createElement('div');
            row.className='ow-mission-row';
            const left=document.createElement('div');
            left.style.cssText='font-size:12px;line-height:1.35';
            left.textContent=(idx+1)+'. '+translateMissionFr(goal.title||goal.description||'Objectif');
            const right=document.createElement('div');
            right.style.cssText='font-size:12px;font-weight:900;color:#63e6a3;white-space:nowrap';
            right.textContent=goal.rewardFormatted || (goal.reward!=null ? ('+'+Number(goal.reward).toLocaleString('fr-FR')+' RL Coins') : '');
            row.append(left,right);
            body.appendChild(row);
          });
        }).catch(()=>{
          const body=ladder.querySelector('.ow-missions-body');
          body.innerHTML='<div style="font-size:12px;color:#c8d0d8">'+translateMissionFr(offer.requirements||'Suis les objectifs indiqués après avoir lancé le jeu.')+'</div>';
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