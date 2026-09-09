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
      meta.innerHTML='<strong>'+Number(m.earned_coins||0).toLocaleString('fr-FR')+' RL Coins gagnés</strong> • '+Number(m.completed_steps||0)+' mission'+(Number(m.completed_steps||0)>1?'s':'')+' validée'+(Number(m.completed_steps||0)>1?'s':'');

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

  async function render(){
    removeLegacySurveys();
    ensureStyles();
    ensureNav();
    ensureSection();
    ensureActiveMissionsHomeSection();

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
      const [res,missionsRes] = await Promise.all([
        fetch('/api/offerwallgg/offers', {
          headers: { authorization: 'Bearer ' + session.access_token },
          cache: 'no-store'
        }),
        fetch('/api/offerwallgg/missions', {
          headers: { authorization: 'Bearer ' + session.access_token },
          cache: 'no-store'
        })
      ]);
      const data = await res.json();
      const missionsData = await missionsRes.json().catch(()=>({ok:false,missions:[]}));
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Offerwall unavailable');
      const offers = Array.isArray(data.offers) ? data.offers : [];
      const activeMissions = missionsRes.ok && missionsData?.ok && Array.isArray(missionsData.missions) ? missionsData.missions : [];
      const offersById = new Map(offers.map(o=>[String(o.id),o]));
      if (!offers.length) {
        box.innerHTML = '<div class="ow-frame-wrap" style="min-height:0;padding:24px;text-align:center">Aucun jeu rémunéré disponible pour ton appareil ou ton pays actuellement.</div>';
        return;
      }
      box.innerHTML = '<div id="ow-device-note" style="margin:0 0 10px;color:#99a4b0;font-size:12px"></div><div class="ow-filters"><button class="ow-filter active" data-platform="recommended">Pour cet appareil</button><button class="ow-filter" data-platform="all">Tous</button><button class="ow-filter" data-platform="pc">🖥️ PC</button><button class="ow-filter" data-platform="android">🤖 Android</button><button class="ow-filter" data-platform="ios">🍎 iPhone/iPad</button></div><div class="ow-native-grid"></div>';
      const note=box.querySelector('#ow-device-note');
      note.textContent = 'Offres recommandées pour '+deviceLabel()+' et ta localisation. Les offres d’un autre appareil restent accessibles via les filtres.';
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
        go.addEventListener('click',async()=>{
          await trackMissionStart(session,offer);
          window.location.assign(offer.clickUrl);
        });
        actions.appendChild(go);

        card.append(title,platformBadge,req,reward,ladder,compat,actions);

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

  setTimeout(render, 1000);
  setTimeout(render, 3000);

  try{
    if (typeof sb !== 'undefined' && sb?.auth?.onAuthStateChange){
      sb.auth.onAuthStateChange(() => setTimeout(render, 100));
    }
  }catch(_){}
})();