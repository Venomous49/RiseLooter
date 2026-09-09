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
      #gamesOfferwall .ow-filters{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}
      #gamesOfferwall .ow-filter{border:1px solid #304455;background:#0b1520;color:#cbd5df;border-radius:999px;padding:7px 11px;font-size:12px;font-weight:850;cursor:pointer}
      #gamesOfferwall .ow-filter.active{border-color:#8f4cff;background:#24123b;color:#fff}
      #gamesOfferwall .ow-platform-badge{display:inline-flex;align-items:center;gap:5px;border:1px solid #314657;border-radius:999px;padding:4px 7px;font-size:10px;font-weight:900;color:#b7c4cf;width:max-content}
      #gamesOfferwall .ow-active-wrap{margin:0 0 18px;padding:14px;border:1px solid #5d2f92;border-radius:14px;background:linear-gradient(180deg,#130c1d,#0b1118)}
      #gamesOfferwall .ow-active-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px}
      #gamesOfferwall .ow-active-title{font-size:17px;font-weight:950}
      #gamesOfferwall .ow-active-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}
      #gamesOfferwall .ow-active-card{border:1px solid #314557;border-radius:12px;padding:12px;background:#09121b;display:flex;flex-direction:column;gap:8px}
      #gamesOfferwall .ow-progress{font-size:12px;color:#a8b4bf}
      #gamesOfferwall .ow-progress strong{color:#63e6a3}
      #gamesOfferwall .ow-empty{font-size:12px;color:#94a1ad}
      #offerwallActiveMissions{min-height:100%;display:flex;flex-direction:column}
      #offerwallActiveMissions .ow-home-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}
      #offerwallActiveMissions .ow-home-title{font-size:20px;font-weight:950}
      #offerwallActiveMissions .ow-home-count{font-size:11px;font-weight:900;color:#d7b0ff;border:1px solid #6f3cb4;border-radius:999px;padding:5px 8px;background:#171020}
      #offerwallActiveMissions .ow-home-list{display:flex;flex-direction:column;gap:8px;margin-top:8px;max-height:220px;overflow:auto}
      #offerwallActiveMissions .ow-home-mission{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:10px;border:1px solid #263848;border-radius:10px;background:#071019}
      #offerwallActiveMissions .ow-home-mission-name{font-weight:900;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #offerwallActiveMissions .ow-home-mission-meta{font-size:11px;color:#99a4b0;margin-top:3px}
      #offerwallActiveMissions .ow-home-mission-meta strong{color:#63e6a3}
      #offerwallActiveMissions .ow-home-mission .btn{padding:7px 10px;font-size:11px}
      #offerwallActiveMissions .ow-home-empty{color:#99a4b0;font-size:12px;padding:12px 0}
      #xpHistoryPanel .xp-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px}
      #xpHistoryPanel .xp-title{font-size:19px;font-weight:950}
      #xpHistoryPanel .xp-rule{font-size:11px;color:#bca5d4;border:1px solid #5a3a77;border-radius:999px;padding:5px 8px;background:#120b1a}
      #xpHistoryPanel .xp-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:8px}
      #xpHistoryPanel .xp-item{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:10px 11px;border:1px solid #243646;border-radius:10px;background:#071019}
      #xpHistoryPanel .xp-item-title{font-size:12px;font-weight:900}
      #xpHistoryPanel .xp-item-desc{font-size:10px;color:#94a1ad;margin-top:3px}
      #xpHistoryPanel .xp-item-amount{font-size:14px;font-weight:950;color:#c575ff;white-space:nowrap}
      #xpHistoryPanel .xp-item-amount.negative{color:#ff7b84}
      #xpHistoryPanel .xp-empty{font-size:12px;color:#94a1ad}
      #rlHistoryPanel .rlh-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px}
      #rlHistoryPanel .rlh-title{font-size:19px;font-weight:950}
      #rlHistoryPanel .rlh-sub{font-size:11px;color:#b7c2cc}
      #rlHistoryPanel .rlh-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:8px}
      #rlHistoryPanel .rlh-item{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:10px 11px;border:1px solid #243646;border-radius:10px;background:#071019}
      #rlHistoryPanel .rlh-item-title{font-size:12px;font-weight:900}
      #rlHistoryPanel .rlh-item-desc{font-size:10px;color:#94a1ad;margin-top:3px}
      #rlHistoryPanel .rlh-item-amount{font-size:14px;font-weight:950;color:#63e6a3;white-space:nowrap}
      #rlHistoryPanel .rlh-item-amount.negative{color:#ff7b84}
      #rlHistoryPanel .rlh-empty{font-size:12px;color:#94a1ad}
      .ow-xp-reward{font-size:12px;font-weight:900;color:#c575ff}
      .streak-xp-note{margin-top:6px;color:#c575ff;font-size:12px;font-weight:900}
      @media(max-width:700px){
        #gamesOfferwall.section{padding:12px}
        #gamesOfferwall .ow-title{font-size:18px}
        #gamesOfferwall .ow-native-grid{grid-template-columns:1fr;gap:10px}
        #gamesOfferwall .ow-active-grid{grid-template-columns:1fr}
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

  function currentPlatform(){
    const ua=navigator.userAgent||'';
    if (/iPad|iPhone|iPod/i.test(ua)) return 'ios';
    if (/Android/i.test(ua)) return 'android';
    return 'pc';
  }

  function normalizedPlatforms(offer){
    const values=(Array.isArray(offer?.platforms)?offer.platforms:[]).map(v=>String(v).toLowerCase());
    const text=((offer?.name||'')+' '+(offer?.requirements||'')+' '+(offer?.category||'')).toLowerCase();
    const set=new Set();
    for(const v of values){
      if(/iphone|ipad|ios|apple/.test(v)) set.add('ios');
      if(/android/.test(v)) set.add('android');
      if(/windows|desktop|pc|mac|linux|web/.test(v)) set.add('pc');
    }
    if(!set.size){
      if(/iphone|ipad|\bios\b|app store/.test(text)) set.add('ios');
      if(/android|google play|play store/.test(text)) set.add('android');
      if(/windows|desktop|\bpc\b|macos|steam|browser|web/.test(text)) set.add('pc');
    }
    if(!set.size) set.add(currentPlatform());
    return [...set];
  }

  function platformLabel(platforms){
    const p=new Set(platforms);
    const labels=[];
    if(p.has('pc')) labels.push('🖥️ PC');
    if(p.has('android')) labels.push('🤖 Android');
    if(p.has('ios')) labels.push('🍎 iPhone/iPad');
    return labels.join(' • ');
  }

  async function trackMissionStart(session, offer){
    try{
      await fetch('/api/offerwallgg/missions/start',{
        method:'POST',
        headers:{authorization:'Bearer '+session.access_token,'content-type':'application/json'},
        body:JSON.stringify({
          offer_id:offer.id,
          offer_name:offer.name||'Jeu rémunéré',
          requirements:offer.requirements||'',
          reward_display:offer.rewardFormatted||((offer.reward||0)+' RL Coins'),
          device_label:platformLabel(normalizedPlatforms(offer)),
          click_url:offer.clickUrl||''
        })
      });
    }catch(_){}
  }

  function ensureRlHistorySection(){
    let section=document.getElementById('rlHistoryPanel');
    if(section) return section;

    section=document.createElement('section');
    section.id='rlHistoryPanel';
    section.className='panel section';
    section.innerHTML='<div class="rlh-head"><div class="rlh-title">🪙 Historique RL Coins</div><div class="rlh-sub">Tes gains et éventuelles annulations de récompenses.</div></div><div class="rlh-list"><div class="rlh-empty">Tes prochains gains de RL Coins apparaîtront ici.</div></div>';

    const xp=document.getElementById('xpHistoryPanel');
    if(xp) xp.insertAdjacentElement('afterend',section);
    else document.querySelector('main')?.appendChild(section);
    return section;
  }

  function formatRlHistoryDate(value){
    try{
      return new Date(value).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
    }catch(_){ return ''; }
  }

  async function renderRlHistory(session){
    const section=ensureRlHistorySection();
    const list=section?.querySelector('.rlh-list');
    if(!list) return;
    if(!session?.access_token){
      list.innerHTML='<div class="rlh-empty">Connecte-toi pour consulter ton historique RL Coins.</div>';
      return;
    }
    try{
      const res=await fetch('/api/rl/history',{headers:{authorization:'Bearer '+session.access_token},cache:'no-store'});
      const data=await res.json();
      if(!res.ok || !data?.ok) throw new Error();
      const history=Array.isArray(data.history)?data.history:[];
      if(!history.length){
        list.innerHTML='<div class="rlh-empty">Tes prochains gains de RL Coins apparaîtront ici.</div>';
        return;
      }
      list.innerHTML='';
      history.slice(0,12).forEach(x=>{
        const item=document.createElement('div');
        item.className='rlh-item';
        const left=document.createElement('div');
        const title=document.createElement('div');
        title.className='rlh-item-title';
        title.textContent=x.title||'Gain de RL Coins';
        const desc=document.createElement('div');
        desc.className='rlh-item-desc';
        desc.textContent=(x.description?x.description+' • ':'')+formatRlHistoryDate(x.created_at);
        left.append(title,desc);

        const amount=document.createElement('div');
        const n=Number(x.amount||0);
        amount.className='rlh-item-amount'+(n<0?' negative':'');
        amount.textContent=(n>0?'+':'')+n.toLocaleString('fr-FR',{minimumFractionDigits:Math.abs(n)<1?2:0,maximumFractionDigits:2})+' RL';

        item.append(left,amount);
        list.appendChild(item);
      });
    }catch(_){
      list.innerHTML='<div class="rlh-empty">Historique RL Coins momentanément indisponible.</div>';
    }
  }

  function ensureXpHistorySection(){
    let section=document.getElementById('xpHistoryPanel');
    if(section) return section;

    section=document.createElement('section');
    section.id='xpHistoryPanel';
    section.className='panel section';
    section.innerHTML='<div class="xp-head"><div class="xp-title">✨ Historique XP</div><div class="xp-rule">XP proportionnel : 25 XP / 100 RL Coins • Série : +15 XP/jour</div></div><div class="xp-list"><div class="xp-empty">Tes prochains gains d’XP apparaîtront ici.</div></div>';

    const evolution=document.querySelector('#evolutionGrid')?.closest('section');
    const active=document.getElementById('offerwallActiveMissions');
    const row=active?.parentElement;
    if(row?.parentElement){
      row.insertAdjacentElement('afterend',section);
    }else if(evolution?.parentElement){
      evolution.parentElement.insertBefore(section,evolution);
    }else{
      document.querySelector('main')?.appendChild(section);
    }
    return section;
  }

  function formatXpHistoryDate(value){
    try{
      return new Date(value).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
    }catch(_){ return ''; }
  }

  async function renderXpHistory(session){
    const section=ensureXpHistorySection();
    const list=section?.querySelector('.xp-list');
    if(!list) return;
    if(!session?.access_token){
      list.innerHTML='<div class="xp-empty">Connecte-toi pour consulter ton historique XP.</div>';
      return;
    }
    try{
      const res=await fetch('/api/xp/history',{headers:{authorization:'Bearer '+session.access_token},cache:'no-store'});
      const data=await res.json();
      if(!res.ok || !data?.ok) throw new Error();
      const history=Array.isArray(data.history)?data.history:[];
      if(!history.length){
        list.innerHTML='<div class="xp-empty">Tes prochains gains d’XP apparaîtront ici.</div>';
        return;
      }
      list.innerHTML='';
      history.slice(0,12).forEach(x=>{
        const item=document.createElement('div');
        item.className='xp-item';
        const left=document.createElement('div');
        const title=document.createElement('div');
        title.className='xp-item-title';
        title.textContent=x.title||'Gain d’XP';
        const desc=document.createElement('div');
        desc.className='xp-item-desc';
        desc.textContent=(x.description?x.description+' • ':'')+formatXpHistoryDate(x.created_at);
        left.append(title,desc);
        const amount=document.createElement('div');
        amount.className='xp-item-amount'+(Number(x.amount)<0?' negative':'');
        amount.textContent=(Number(x.amount)>0?'+':'')+Number(x.amount).toLocaleString('fr-FR')+' XP';
        item.append(left,amount);
        list.appendChild(item);
      });
    }catch(_){
      list.innerHTML='<div class="xp-empty">Historique XP momentanément indisponible.</div>';
    }
  }

  function ensureStreakXpNote(){
    const streak=document.querySelector('.streak-center');
    if(!streak || streak.querySelector('.streak-xp-note')) return;
    const note=document.createElement('div');
    note.className='streak-xp-note';
    note.textContent='✨ +15 XP à chaque connexion quotidienne';
    const big=streak.querySelector('.streak-big');
    if(big) big.insertAdjacentElement('afterend',note);
    else streak.appendChild(note);
  }

  function ensureActiveMissionsHomeSection(){
    let section=document.getElementById('offerwallActiveMissions');
    if(section) return section;

    section=document.createElement('section');
    section.id='offerwallActiveMissions';
    section.className='panel section';
    section.innerHTML='<div class="ow-home-head"><div class="ow-home-title">🚀 Missions en cours</div><div class="ow-home-count">0 en cours</div></div><div class="section-subtitle">Retrouve ici les jeux déjà commencés et continue directement tes objectifs.</div><div class="ow-home-list"><div class="ow-home-empty">Aucune mission en cours pour le moment.</div></div>';

    const streak=document.querySelector('.streak-center');
    const row=streak?.parentElement;
    if(row && row.classList.contains('two-cols')){
      row.appendChild(section);
    }else{
      const home=document.getElementById('home');
      home?.insertAdjacentElement('afterend',section);
    }
    return section;
  }

  function renderActiveMissionsHome(session, activeMissions, offersById){
    const section=ensureActiveMissionsHomeSection();
    if(!section) return;
    const list=section.querySelector('.ow-home-list');
    const count=section.querySelector('.ow-home-count');
    count.textContent=(activeMissions?.length||0)+' en cours';

    if(!activeMissions?.length){
      list.innerHTML='<div class="ow-home-empty">Aucune mission en cours pour le moment. Lance un jeu depuis la rubrique Jeux et il apparaîtra ici automatiquement.</div>';
      return;
    }

    list.innerHTML='';
    activeMissions.forEach(m=>{
      const fresh=offersById.get(String(m.offer_id));
      const item=document.createElement('div');
      item.className='ow-home-mission';

      const left=document.createElement('div');
      const name=document.createElement('div');
      name.className='ow-home-mission-name';
      name.textContent=m.offer_name||fresh?.name||'Jeu rémunéré';

      const meta=document.createElement('div');
      meta.className='ow-home-mission-meta';
      meta.innerHTML='<strong>'+Number(m.earned_coins||0).toLocaleString('fr-FR',{minimumFractionDigits:Number(m.earned_coins||0)<1?2:0,maximumFractionDigits:2})+' RL Coins gagnés</strong> • <span style="color:#c575ff;font-weight:900">+'+Number(m.earned_xp||0).toLocaleString('fr-FR')+' XP</span> • '+Number(m.completed_steps||0)+' mission'+(Number(m.completed_steps||0)>1?'s':'')+' validée'+(Number(m.completed_steps||0)>1?'s':'');

      left.append(name,meta);

      const btn=document.createElement('button');
      btn.type='button';
      btn.className='btn';
      btn.textContent='Continuer';
      btn.addEventListener('click',async()=>{
        const target=fresh?.clickUrl;
        if(!target){ alert("Cette offre n'est plus disponible actuellement."); return; }
        await trackMissionStart(session,fresh);
        window.location.assign(target);
      });

      item.append(left,btn);
      list.appendChild(item);
    });
  }

  async function refreshExactRlBalance(session){
    if(!session?.access_token) return;
    try{
      const res=await fetch('/api/offerwallgg/balance',{
        headers:{authorization:'Bearer '+session.access_token},
        cache:'no-store'
      });
      const data=await res.json();
      if(!res.ok || !data?.ok) return;
      const el=document.getElementById('headerCoins');
      if(el){
        const n=Number(data.exact_coins||0);
        el.textContent=n.toLocaleString('fr-FR',{minimumFractionDigits:n<1?2:0,maximumFractionDigits:2});
      }
    }catch(_){}
  }

  async function render(){
    removeLegacySurveys();
    ensureStyles();
    ensureNav();
    ensureSection();
    ensureActiveMissionsHomeSection();
    ensureXpHistorySection();
    ensureRlHistorySection();
    ensureStreakXpNote();

    const box = document.getElementById('offerwallggContent');
    if (!box) return;

    const session = await getSession();
    if(session?.user?.id) {
      refreshExactRlBalance(session);
      renderXpHistory(session);
      renderRlHistory(session);
    }
    if (!session?.user?.id){
      box.innerHTML = '<div class="ow-frame-wrap"><div class="ow-login">Connecte-toi pour accéder aux jeux rémunérés.<br><button class="btn" id="offerwallggLogin">Se connecter</button></div></div>';
      document.getElementById('offerwallggLogin')?.addEventListener('click', () => {
        if (typeof openAuth === 'function') openAuth();
        else document.getElementById('authButton')?.click();
      });
      return;
    }

    try {
      // The games catalogue is the critical request. Secondary widgets such as
      // "Missions en cours" must never be able to blank the whole games section.
      let res = await fetch('/api/offerwallgg/offers', {
        headers: { authorization: 'Bearer ' + session.access_token },
        cache: 'no-store'
      });
      let data = await res.json().catch(()=>({}));

      // One quick retry protects the UI from a transient upstream Offerwall error.
      if (!res.ok || !data?.ok) {
        await new Promise(resolve=>setTimeout(resolve,350));
        res = await fetch('/api/offerwallgg/offers', {
          headers: { authorization: 'Bearer ' + session.access_token },
          cache: 'no-store'
        });
        data = await res.json().catch(()=>({}));
      }

      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Offerwall unavailable');

      const offers = Array.isArray(data.offers) ? data.offers : [];
      let activeMissions = [];
      try{
        const missionsRes = await fetch('/api/offerwallgg/missions', {
          headers: { authorization: 'Bearer ' + session.access_token },
          cache: 'no-store'
        });
        const missionsData = await missionsRes.json().catch(()=>({ok:false,missions:[]}));
        if (missionsRes.ok && missionsData?.ok && Array.isArray(missionsData.missions)) {
          activeMissions = missionsData.missions;
        }
      }catch(_){}

      const offersById = new Map(offers.map(o=>[String(o.id),o]));
      if (!offers.length) {
        box.innerHTML = '<div class="ow-frame-wrap" style="min-height:0;padding:24px;text-align:center">Aucun jeu rémunéré disponible pour ton appareil ou ton pays actuellement.</div>';
        return;
      }
      box.innerHTML = '<div id="ow-device-note" style="margin:0 0 10px;color:#99a4b0;font-size:12px"></div><div class="ow-filters"><button class="ow-filter active" data-platform="recommended">Pour cet appareil</button><button class="ow-filter" data-platform="all">Tous</button><button class="ow-filter" data-platform="pc">🖥️ PC</button><button class="ow-filter" data-platform="android">🤖 Android</button><button class="ow-filter" data-platform="ios">🍎 iPhone/iPad</button></div><div class="ow-native-grid"></div>';
      const note=box.querySelector('#ow-device-note');
      note.textContent = currentPlatform()==='pc' ? 'Mode PC : les offres PC/Web compatibles sont affichées en priorité. Les offres mobiles restent accessibles via leurs filtres.' : 'Mode '+deviceLabel()+' : les offres compatibles avec cet appareil sont affichées en priorité pour réduire les étapes de transfert.';
      renderActiveMissionsHome(session,activeMissions,offersById);
      const grid = box.querySelector('.ow-native-grid');
      let selectedPlatform='recommended';
      const renderPlatformFilter=()=>{
        const current=currentPlatform();
        grid.querySelectorAll('.ow-card').forEach(card=>{
          const platforms=(card.dataset.platforms||'').split(',').filter(Boolean);
          const show=selectedPlatform==='all' || (selectedPlatform==='recommended' ? platforms.includes(current) : platforms.includes(selectedPlatform));
          card.style.display=show?'flex':'none';
        });
      };
      box.querySelectorAll('.ow-filter').forEach(btn=>btn.addEventListener('click',()=>{
        selectedPlatform=btn.dataset.platform;
        box.querySelectorAll('.ow-filter').forEach(x=>x.classList.toggle('active',x===btn));
        renderPlatformFilter();
      }));
      offers.forEach(offer => {
        const card=document.createElement('article');
        card.className='ow-card';

        const platforms=normalizedPlatforms(offer);
        card.dataset.platforms=platforms.join(',');
        const title=document.createElement('div');
        title.className='ow-card-title';
        title.textContent=offer.name || 'Jeu rémunéré';
        const platformBadge=document.createElement('div');
        platformBadge.className='ow-platform-badge';
        platformBadge.textContent=platformLabel(platforms);

        const req=document.createElement('div');
        req.className='ow-card-desc';
        req.textContent=translateMissionFr(offer.requirements || 'Atteins les objectifs indiqués pour gagner des RL Coins.');

        const reward=document.createElement('div');
        reward.className='ow-reward';
        reward.textContent=offer.rewardFormatted || ((offer.reward||0)+' RL Coins');
        const xpReward=document.createElement('div');
        xpReward.className='ow-xp-reward';
        xpReward.textContent='✨ +'+Number(offer.xpReward||1).toLocaleString('fr-FR')+' XP';

        const ladder=document.createElement('div');
        ladder.className='ow-missions';
        ladder.innerHTML='<button type="button" class="ow-missions-toggle"><span>🎯 Missions et récompenses</span><span>Voir les détails ▾</span></button><div class="ow-missions-body"><div style="font-size:12px;color:#99a4b0">Chargement des objectifs…</div></div>';
        const toggle=ladder.querySelector('.ow-missions-toggle');
        let detailsLoaded=false;
        let detailsLoading=false;

        async function loadMissionDetails(){
          if(detailsLoaded || detailsLoading) return;
          detailsLoading=true;
          const body=ladder.querySelector('.ow-missions-body');
          body.innerHTML='<div style="font-size:12px;color:#99a4b0">Chargement des objectifs…</div>';
          try{
            const r=await fetch('/api/offerwallgg/offers/'+encodeURIComponent(offer.id), {
              headers:{authorization:'Bearer '+session.access_token},
              cache:'no-store'
            });
            const data=await r.json().catch(()=>({}));
            const details=data?.offer||{};
            const goals=Array.isArray(details.goals)?details.goals:[];
            if(!r.ok || !goals.length){
              body.innerHTML='<div style="font-size:12px;color:#c8d0d8">'+translateMissionFr(details.requirements||offer.requirements||'Suis les objectifs indiqués après avoir lancé le jeu.')+'</div>';
              detailsLoaded=true;
              return;
            }
            body.innerHTML='';
            const toggleLabel=ladder.querySelector('.ow-missions-toggle span:last-child');
            toggleLabel.textContent=goals.length+' objectif'+(goals.length>1?'s':'')+' ▴';
            goals.forEach((goal,idx)=>{
              const row=document.createElement('div');
              row.className='ow-mission-row';
              const left=document.createElement('div');
              left.style.cssText='font-size:12px;line-height:1.35';
              left.textContent=(idx+1)+'. '+translateMissionFr(goal.title||goal.description||'Objectif');
              const right=document.createElement('div');
              right.style.cssText='font-size:12px;font-weight:900;color:#63e6a3;white-space:nowrap';
              right.innerHTML=(goal.rewardFormatted || (goal.reward!=null ? ('+'+Number(goal.reward).toLocaleString('fr-FR')+' RL Coins') : ''))+'<br><span style="color:#c575ff">+'+Number(goal.xpReward||1).toLocaleString('fr-FR')+' XP</span>';
              row.append(left,right);
              body.appendChild(row);
            });
            detailsLoaded=true;
          }catch(_){
            body.innerHTML='<div style="font-size:12px;color:#c8d0d8">'+translateMissionFr(offer.requirements||'Suis les objectifs indiqués après avoir lancé le jeu.')+'</div>';
          }finally{
            detailsLoading=false;
          }
        }

        toggle.addEventListener('click',async()=>{
          ladder.classList.toggle('open');
          const isOpen=ladder.classList.contains('open');
          const label=toggle.querySelector('span:last-child');
          label.textContent=isOpen?'Masquer ▴':'Voir les détails ▾';
          if(isOpen) await loadMissionDetails();
        });

        const compat=document.createElement('div');
        compat.className='ow-meta';
        compat.textContent=platforms.includes(currentPlatform()) ? '✓ Compatible directement avec '+deviceLabel() : '↗ Prévue pour '+platformLabel(platforms);

        const actions=document.createElement('div');
        actions.className='ow-actions';
        const go=document.createElement('button');
        go.type='button'; go.className='btn'; go.textContent='Commencer';
        go.addEventListener('click',async()=>{
          await trackMissionStart(session,offer);
          window.location.assign(offer.clickUrl);
        });
        actions.appendChild(go);

        card.append(title,platformBadge,req,reward,xpReward,ladder,compat,actions);
        grid.appendChild(card);
      });
      renderPlatformFilter();
    } catch (_) {
      box.innerHTML = '<div class="ow-frame-wrap"><div class="ow-login">Les jeux rémunérés sont momentanément indisponibles. Réessaie dans quelques instants.</div></div>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, {once:true});
  } else {
    render();
  }

  setTimeout(render, 1500);

  try{
    if (typeof sb !== 'undefined' && sb?.auth?.onAuthStateChange){
      sb.auth.onAuthStateChange(() => setTimeout(render, 100));
    }
  }catch(_){}
})();