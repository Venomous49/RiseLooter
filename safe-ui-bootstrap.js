(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const VERSION='base-hq-realesrgan-v2';
  const state={gender:'male'};
  const isOpen=()=>document.body.classList.contains('creator-test-active');
  const fixedCharacter=()=>state.gender==='female'
    ? `/female-01-debutant.webp?v=${VERSION}`
    : `/01-debutant.webp?v=${VERSION}`;
  const syncGender=()=>{const r=$('genderChoices');if(r)r.querySelectorAll('.choice').forEach(b=>b.classList.toggle('selected',b.dataset.value===state.gender));};

  function installTestOnlyStyle(){
    if(document.getElementById('creator-gender-only-test-style'))return;
    const steps=document.querySelectorAll('#creatorModal .creator-step');
    steps.forEach((step,index)=>step.dataset.creatorTestStep=String(index+1));
    const style=document.createElement('style');
    style.id='creator-gender-only-test-style';
    style.textContent=`
      body.creator-test-active #creatorModal [data-creator-test-step="2"],
      body.creator-test-active #creatorModal [data-creator-test-step="3"],
      body.creator-test-active #creatorModal [data-creator-test-step="4"]{display:none!important}
      body.creator-test-active #creatorPreview{overflow:hidden!important}
      body.creator-test-active #creatorPreview .creator-fixed-preview{display:flex!important;align-items:center!important;justify-content:center!important}
      body.creator-test-active #creatorPreview .creator-fixed-preview>img{
        width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;
        object-fit:contain!important;object-position:center 56%!important;padding:12px 10px 4px!important;
        box-sizing:border-box!important;filter:none!important;opacity:1!important;transform:translateY(5px)!important;
        animation:none!important;image-rendering:auto!important;backface-visibility:hidden!important;
      }
    `;
    document.head.appendChild(style);
  }

  function updatePreview(){
    const p=$('creatorPreview');if(!p)return;
    p.innerHTML=`<div class="creator-fixed-preview" style="position:relative;width:100%;height:100%;overflow:hidden"><img src="${fixedCharacter()}" alt="Aperçu Looter" decoding="async" fetchpriority="high"><div class="creator-live-badge" style="z-index:2"><b>NIVEAU 1</b><strong>DÉBUTANT</strong></div></div>`;
  }
  function reset(){state.gender='male';syncGender();updatePreview();}
  function open(e){if(e){e.preventDefault();e.stopImmediatePropagation();}const m=$('creatorModal');if(!m)return;installTestOnlyStyle();document.body.classList.add('creator-test-active');m.classList.add('show');m.style.display='grid';reset();}
  function bindGender(){const r=$('genderChoices');if(!r)return;r.querySelectorAll('.choice').forEach(b=>b.addEventListener('click',e=>{if(!isOpen())return;e.preventDefault();e.stopImmediatePropagation();state.gender=b.dataset.value==='female'?'female':'male';syncGender();updatePreview();},true));}

  function removeProductionTestControl(){
    const b=$('creatorTestButton');
    if(b)b.remove();
    const banner=document.querySelector('.creator-test-banner');
    if(banner)banner.remove();
    document.body.classList.remove('creator-test-active');
  }

  function cleanPseudo(value){return String(value||'').trim();}
  function validPseudo(value){return /^[A-Za-z0-9_-]{3,20}$/.test(cleanPseudo(value));}

  function installPseudoField(){
    if($('usernameInput'))return;
    const password=$('passwordInput');
    if(!password)return;
    const label=document.createElement('label');
    label.id='usernameLabel';
    label.textContent='Pseudo RiseLooter';
    const input=document.createElement('input');
    input.type='text';
    input.id='usernameInput';
    input.autocomplete='username';
    input.maxLength=20;
    input.placeholder='3 à 20 caractères : lettres, chiffres, _ ou -';
    password.parentNode.insertBefore(label,password);
    password.parentNode.insertBefore(input,password);
    const note=document.createElement('div');
    note.id='usernameHelp';
    note.className='muted';
    note.style.cssText='font-size:11px;margin:-7px 0 12px';
    note.textContent='Ce pseudo sera affiché publiquement dans le classement RiseLooter.';
    password.parentNode.insertBefore(note,password);
  }

  function patchSignup(){
    if(typeof sb==='undefined'||!sb?.auth?.signUp||sb.auth.signUp.__rlPseudoPatched)return;
    const original=sb.auth.signUp.bind(sb.auth);
    const wrapped=async credentials=>{
      const pseudo=cleanPseudo($('usernameInput')?.value);
      if(!validPseudo(pseudo)){
        return {data:{user:null,session:null},error:new Error('Choisis un pseudo de 3 à 20 caractères avec uniquement lettres, chiffres, _ ou -.')} ;
      }
      const next={...(credentials||{})};
      next.options={...(next.options||{}),data:{...(next.options?.data||{}),username:pseudo,player_name:pseudo}};
      return original(next);
    };
    wrapped.__rlPseudoPatched=true;
    sb.auth.signUp=wrapped;
  }

  function guardSignupClick(){
    const btn=$('signupAction');
    if(!btn||btn.dataset.pseudoGuard==='1')return;
    btn.dataset.pseudoGuard='1';
    btn.addEventListener('click',event=>{
      const pseudo=cleanPseudo($('usernameInput')?.value);
      if(validPseudo(pseudo))return;
      event.preventDefault();
      event.stopImmediatePropagation();
      alert('Choisis un pseudo de 3 à 20 caractères avec uniquement des lettres, chiffres, _ ou -.');
      $('usernameInput')?.focus();
    },true);
  }

  async function writePseudo(user,pseudo){
    if(!user?.id||!validPseudo(pseudo))return false;
    try{
      await sb.auth.updateUser({data:{username:pseudo,player_name:pseudo}});
    }catch(_){ }
    try{
      const result=await sb.from('profiles').update({player_name:pseudo}).eq('id',user.id);
      return !result?.error;
    }catch(_){return false;}
  }

  async function syncPseudoToProfile(){
    if(typeof sb==='undefined'||!sb?.auth?.getSession)return;
    try{
      const result=await sb.auth.getSession();
      const user=result?.data?.session?.user;
      const pseudo=cleanPseudo(user?.user_metadata?.username||user?.user_metadata?.player_name);
      if(!user?.id||!validPseudo(pseudo))return;
      const current=await sb.from('profiles').select('player_name').eq('id',user.id).maybeSingle();
      if(current?.data?.player_name===pseudo)return;
      await sb.from('profiles').update({player_name:pseudo}).eq('id',user.id);
    }catch(_){ }
  }

  async function ensureLegacyPseudo(){
    if(typeof sb==='undefined'||!sb?.auth?.getSession||$('rlPseudoOverlay'))return;
    try{
      const result=await sb.auth.getSession();
      const user=result?.data?.session?.user;
      if(!user?.id)return;
      const existing=cleanPseudo(user?.user_metadata?.username||user?.user_metadata?.player_name);
      if(validPseudo(existing)){await syncPseudoToProfile();return;}
      const overlay=document.createElement('div');
      overlay.id='rlPseudoOverlay';
      overlay.style.cssText='position:fixed;inset:0;z-index:2147483600;background:rgba(2,7,11,.96);display:grid;place-items:center;padding:20px';
      overlay.innerHTML=`<div style="width:min(460px,96%);background:#061019;border:1px solid #294052;border-radius:14px;padding:22px;color:#fff"><h2 style="margin-top:0">Choisis ton pseudo RiseLooter</h2><p style="color:#a9b5bf">Il apparaîtra dans le classement avec ton rang, ton niveau, ton XP et ta série.</p><input id="rlLegacyPseudo" maxlength="20" placeholder="Ton pseudo" style="width:100%;padding:12px;border-radius:8px;border:1px solid #2c3d4c;background:#050a0f;color:#fff;margin:8px 0 12px"><div style="font-size:11px;color:#9aa8b5;margin-bottom:14px">3 à 20 caractères : lettres, chiffres, _ ou -.</div><button id="rlSavePseudo" class="btn" style="width:100%">VALIDER MON PSEUDO</button></div>`;
      document.body.appendChild(overlay);
      const input=$('rlLegacyPseudo');
      const save=$('rlSavePseudo');
      save.onclick=async()=>{
        const pseudo=cleanPseudo(input.value);
        if(!validPseudo(pseudo)){alert('Pseudo invalide. Utilise 3 à 20 caractères : lettres, chiffres, _ ou -.');input.focus();return;}
        save.disabled=true;
        const ok=await writePseudo(user,pseudo);
        save.disabled=false;
        if(!ok){alert('Impossible d’enregistrer ce pseudo pour le moment. Réessaie.');return;}
        overlay.remove();
        try{ if(typeof loadLeaderboard==='function') await loadLeaderboard(); }catch(_){ }
      };
      setTimeout(()=>input.focus(),50);
    }catch(_){ }
  }

  function init(){
    removeProductionTestControl();
    installPseudoField();
    patchSignup();
    guardSignupClick();
    bindGender();
    const s=$('saveAvatar');if(s)s.addEventListener('click',e=>{if(!isOpen())return;e.preventDefault();e.stopImmediatePropagation();},true);
    setTimeout(()=>{syncPseudoToProfile();ensureLegacyPseudo();},500);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  try{
    if(typeof sb!=='undefined'&&sb?.auth?.onAuthStateChange){
      sb.auth.onAuthStateChange(()=>setTimeout(()=>{syncPseudoToProfile();ensureLegacyPseudo();},250));
    }
  }catch(_){ }
})();