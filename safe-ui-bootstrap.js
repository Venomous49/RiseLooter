(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const VERSION='base-hq-realesrgan-v2';
  const state={gender:'male'};
  const isOpen=()=>document.body.classList.contains('creator-test-active');
  const fixedCharacter=()=>state.gender==='female'?`/female-01-debutant.webp?v=${VERSION}`:`/01-debutant.webp?v=${VERSION}`;
  const syncGender=()=>{const r=$('genderChoices');if(r)r.querySelectorAll('.choice').forEach(b=>b.classList.toggle('selected',b.dataset.value===state.gender));};

  function installTestOnlyStyle(){if(document.getElementById('creator-gender-only-test-style'))return;const steps=document.querySelectorAll('#creatorModal .creator-step');steps.forEach((step,index)=>step.dataset.creatorTestStep=String(index+1));const style=document.createElement('style');style.id='creator-gender-only-test-style';style.textContent=`body.creator-test-active #creatorModal [data-creator-test-step="2"],body.creator-test-active #creatorModal [data-creator-test-step="3"],body.creator-test-active #creatorModal [data-creator-test-step="4"]{display:none!important}`;document.head.appendChild(style);}
  function updatePreview(){const p=$('creatorPreview');if(!p)return;p.innerHTML=`<div class="creator-fixed-preview" style="position:relative;width:100%;height:100%;overflow:hidden"><img src="${fixedCharacter()}" alt="Aperçu Looter" decoding="async" fetchpriority="high"><div class="creator-live-badge" style="z-index:2"><b>NIVEAU 1</b><strong>DÉBUTANT</strong></div></div>`;}
  function reset(){state.gender='male';syncGender();updatePreview();}
  function bindGender(){const r=$('genderChoices');if(!r)return;r.querySelectorAll('.choice').forEach(b=>b.addEventListener('click',e=>{if(!isOpen())return;e.preventDefault();e.stopImmediatePropagation();state.gender=b.dataset.value==='female'?'female':'male';syncGender();updatePreview();},true));}
  function removeProductionTestControl(){const b=$('creatorTestButton');if(b)b.remove();const banner=document.querySelector('.creator-test-banner');if(banner)banner.remove();document.body.classList.remove('creator-test-active');}
  function cleanPseudo(v){return String(v||'').trim();}
  function validPseudo(v){return /^[A-Za-z0-9_-]{3,20}$/.test(cleanPseudo(v));}
  function cleanPostal(v){return String(v||'').trim().replace(/\s+/g,' ').slice(0,12);}
  function validPostal(v){return /^[A-Za-z0-9 -]{2,12}$/.test(cleanPostal(v));}

  function makeLabel(text){const l=document.createElement('label');l.textContent=text;return l;}
  function appendField(root,labelText,field){root.appendChild(makeLabel(labelText));root.appendChild(field);}

  function parseBirthDate(value){
    const raw=String(value||'').trim();
    let m=raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if(!m)return '';
    const d=Number(m[1]),mo=Number(m[2]),y=Number(m[3]);
    const date=new Date(Date.UTC(y,mo-1,d));
    if(date.getUTCFullYear()!==y||date.getUTCMonth()!==mo-1||date.getUTCDate()!==d)return '';
    return `${String(y).padStart(4,'0')}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }

  function installSignupProfileFields(){
    if($('signupExtraFields'))return;
    const password=$('passwordInput');
    if(!password)return;

    // Put every signup-only field AFTER the real password input. This keeps the
    // original E-mail and Mot de passe fields intact and prevents the old ghost field.
    const root=document.createElement('div');
    root.id='signupExtraFields';
    root.style.cssText='margin-top:2px';

    const pseudo=document.createElement('input');
    pseudo.type='text';pseudo.id='usernameInput';pseudo.autocomplete='username';pseudo.maxLength=20;
    pseudo.placeholder='3 à 20 caractères : lettres, chiffres, _ ou -';
    appendField(root,'Pseudo RiseLooter',pseudo);
    const pseudoHelp=document.createElement('div');pseudoHelp.className='muted';pseudoHelp.style.cssText='font-size:11px;margin:-7px 0 12px';pseudoHelp.textContent='Ce pseudo sera affiché publiquement dans le classement RiseLooter.';root.appendChild(pseudoHelp);

    const title=document.createElement('div');title.id='surveyProfileTitle';title.style.cssText='font-weight:900;margin:10px 0 5px;color:#c08aff';title.textContent='Profil sondages';root.appendChild(title);
    const help=document.createElement('div');help.id='surveyProfileHelp';help.className='muted';help.style.cssText='font-size:11px;line-height:1.4;margin:0 0 12px';help.textContent='Ces quelques réponses servent à mieux personnaliser les sondages proposés et à améliorer ton taux de réussite. Elles sont transmises à CPX Research uniquement pour le ciblage des sondages.';root.appendChild(help);

    const dob=document.createElement('input');
    dob.type='text';dob.id='surveyBirthDate';dob.inputMode='numeric';dob.autocomplete='bday';dob.maxLength=10;dob.placeholder='JJ/MM/AAAA';
    appendField(root,'Date de naissance',dob);
    dob.addEventListener('input',()=>{
      const digits=dob.value.replace(/\D/g,'').slice(0,8);
      dob.value=digits.length<=2?digits:digits.length<=4?`${digits.slice(0,2)}/${digits.slice(2)}`:`${digits.slice(0,2)}/${digits.slice(2,4)}/${digits.slice(4)}`;
    });

    const gender=document.createElement('select');gender.id='surveyGender';gender.style.cssText='width:100%;margin:6px 0 13px;padding:11px;border:1px solid #2c3d4c;border-radius:8px;background:#050a0f;color:#fff';gender.innerHTML='<option value="">Choisir…</option><option value="m">Homme</option><option value="f">Femme</option><option value="na">Je préfère ne pas répondre</option>';appendField(root,'Sexe pour le ciblage des sondages',gender);

    const country=document.createElement('select');country.id='surveyCountry';country.style.cssText=gender.style.cssText;country.innerHTML='<option value="FR">France</option><option value="BE">Belgique</option><option value="CH">Suisse</option><option value="CA">Canada</option><option value="LU">Luxembourg</option><option value="DE">Allemagne</option><option value="ES">Espagne</option><option value="IT">Italie</option><option value="GB">Royaume-Uni</option><option value="US">États-Unis</option><option value="OTHER">Autre pays</option>';appendField(root,'Pays de résidence',country);
    const countryOther=document.createElement('input');countryOther.type='text';countryOther.id='surveyCountryOther';countryOther.maxLength=2;countryOther.placeholder='Code pays à 2 lettres (ex. PT)';countryOther.style.display='none';root.appendChild(countryOther);country.addEventListener('change',()=>{countryOther.style.display=country.value==='OTHER'?'block':'none';});

    const postal=document.createElement('input');postal.type='text';postal.id='surveyPostalCode';postal.autocomplete='postal-code';postal.maxLength=12;postal.placeholder='Ex. 75001';appendField(root,'Code postal',postal);

    password.insertAdjacentElement('afterend',root);
  }

  function readSurveyProfile(){
    const birth=parseBirthDate($('surveyBirthDate')?.value||'');
    const gender=$('surveyGender')?.value||'';
    const selected=$('surveyCountry')?.value||'';
    const country=(selected==='OTHER'?String($('surveyCountryOther')?.value||'').trim().toUpperCase():selected).toUpperCase();
    const zip=cleanPostal($('surveyPostalCode')?.value);
    return {birth_date:birth,gender,country_code:country,zip_code:zip};
  }
  function validSurveyProfile(p){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(p.birth_date))return false;
    const d=new Date(p.birth_date+'T00:00:00');const now=new Date();if(Number.isNaN(d.getTime())||d>=now)return false;
    if(!['m','f','na'].includes(p.gender))return false;
    if(!/^[A-Z]{2}$/.test(p.country_code))return false;
    if(!validPostal(p.zip_code))return false;
    return true;
  }

  function patchSignup(){
    if(typeof sb==='undefined'||!sb?.auth?.signUp||sb.auth.signUp.__rlProfilePatched)return;
    const original=sb.auth.signUp.bind(sb.auth);
    const wrapped=async credentials=>{
      const pseudo=cleanPseudo($('usernameInput')?.value),survey=readSurveyProfile();
      if(!validPseudo(pseudo))return {data:{user:null,session:null},error:new Error('Choisis un pseudo valide.')};
      if(!validSurveyProfile(survey))return {data:{user:null,session:null},error:new Error('Complète correctement les informations du profil sondages.')};
      const next={...(credentials||{})};
      next.options={...(next.options||{}),data:{...(next.options?.data||{}),username:pseudo,player_name:pseudo,survey_profile:survey}};
      const result=await original(next);
      if(!result?.error){try{localStorage.setItem('riselooter_account_created','1');}catch(_){}}
      return result;
    };
    wrapped.__rlProfilePatched=true;sb.auth.signUp=wrapped;
  }

  function guardSignupClick(){
    const btn=$('signupAction');if(!btn||btn.dataset.profileGuard==='1')return;btn.dataset.profileGuard='1';
    btn.addEventListener('click',event=>{
      const pseudo=cleanPseudo($('usernameInput')?.value),survey=readSurveyProfile();
      if(validPseudo(pseudo)&&validSurveyProfile(survey))return;
      event.preventDefault();event.stopImmediatePropagation();
      if(!validPseudo(pseudo)){alert('Choisis un pseudo de 3 à 20 caractères avec uniquement des lettres, chiffres, _ ou -.');$('usernameInput')?.focus();return;}
      if(!parseBirthDate($('surveyBirthDate')?.value||'')){alert('Entre une date de naissance valide au format JJ/MM/AAAA.');$('surveyBirthDate')?.focus();return;}
      alert('Complète ton sexe, ton pays et ton code postal pour personnaliser les sondages.');
    },true);
  }

  function syncSignupVisibility(){
    const btn=$('signupAction'),extras=$('signupExtraFields');
    if(!btn)return;
    let created=false;
    try{created=localStorage.getItem('riselooter_account_created')==='1';}catch(_){}
    btn.style.display=created?'none':'';
    if(extras)extras.style.display=created?'none':'';
  }

  async function writePseudo(user,pseudo){
    if(!user?.id||!validPseudo(pseudo))return false;
    try{const authResult=await sb.auth.updateUser({data:{username:pseudo,player_name:pseudo}});if(authResult?.error)return false;}catch(_){return false;}
    try{await sb.from('profiles').update({player_name:pseudo}).eq('id',user.id);}catch(_){}
    return true;
  }
  async function syncPseudoToProfile(){if(typeof sb==='undefined'||!sb?.auth?.getSession)return;try{const result=await sb.auth.getSession();const user=result?.data?.session?.user;const pseudo=cleanPseudo(user?.user_metadata?.username||user?.user_metadata?.player_name);if(!user?.id||!validPseudo(pseudo))return;try{await sb.from('profiles').update({player_name:pseudo}).eq('id',user.id);}catch(_){}}catch(_){}}
  async function ensureLegacyPseudo(){if(typeof sb==='undefined'||!sb?.auth?.getSession||$('rlPseudoOverlay'))return;try{const result=await sb.auth.getSession(),user=result?.data?.session?.user;if(!user?.id)return;try{localStorage.setItem('riselooter_account_created','1');}catch(_){}syncSignupVisibility();const existing=cleanPseudo(user?.user_metadata?.username||user?.user_metadata?.player_name);if(validPseudo(existing)){await syncPseudoToProfile();return;}const overlay=document.createElement('div');overlay.id='rlPseudoOverlay';overlay.style.cssText='position:fixed;inset:0;z-index:2147483600;background:rgba(2,7,11,.96);display:grid;place-items:center;padding:20px';overlay.innerHTML=`<div style="width:min(460px,96%);background:#061019;border:1px solid #294052;border-radius:14px;padding:22px;color:#fff"><h2 style="margin-top:0">Choisis ton pseudo RiseLooter</h2><p style="color:#a9b5bf">Il apparaîtra dans le classement avec ton rang, ton niveau, ton XP et ta série.</p><input id="rlLegacyPseudo" maxlength="20" placeholder="Ton pseudo" style="width:100%;padding:12px;border-radius:8px;border:1px solid #2c3d4c;background:#050a0f;color:#fff;margin:8px 0 12px"><div style="font-size:11px;color:#9aa8b5;margin-bottom:14px">3 à 20 caractères : lettres, chiffres, _ ou -.</div><button id="rlSavePseudo" class="btn" style="width:100%">VALIDER MON PSEUDO</button></div>`;document.body.appendChild(overlay);const input=$('rlLegacyPseudo'),save=$('rlSavePseudo');save.onclick=async()=>{const pseudo=cleanPseudo(input.value);if(!validPseudo(pseudo)){alert('Pseudo invalide.');input.focus();return;}save.disabled=true;const ok=await writePseudo(user,pseudo);save.disabled=false;if(!ok){alert('Impossible d’enregistrer ce pseudo pour le moment. Réessaie.');return;}overlay.remove();try{if(typeof loadLeaderboard==='function')await loadLeaderboard();}catch(_){}};setTimeout(()=>input.focus(),50);}catch(_){}}

  function init(){removeProductionTestControl();installSignupProfileFields();patchSignup();guardSignupClick();bindGender();syncSignupVisibility();setTimeout(()=>{syncPseudoToProfile();ensureLegacyPseudo();},500);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  try{if(typeof sb!=='undefined'&&sb?.auth?.onAuthStateChange)sb.auth.onAuthStateChange((event,session)=>setTimeout(()=>{if(session?.user){try{localStorage.setItem('riselooter_account_created','1');}catch(_){}syncSignupVisibility();}syncPseudoToProfile();ensureLegacyPseudo();},250));}catch(_){}
})();