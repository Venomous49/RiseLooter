/* RiseLooter durable signup profile — username + CPX targeting */
(() => {
  if (window.__RISELOOTER_SIGNUP_PROFILE_V1__) return;
  window.__RISELOOTER_SIGNUP_PROFILE_V1__ = true;

  const $ = id => document.getElementById(id);
  const style = 'width:100%;padding:10px 12px;margin:6px 0 10px;border:1px solid #293b4b;border-radius:8px;background:#050a0f;color:#fff';

  function validUsername(v){ return /^[A-Za-z0-9_-]{3,20}$/.test(String(v||'').trim()); }
  function profileValues(){
    return {
      birth_date:String($('signupBirth')?.value||''),
      gender:String($('signupSurveyGender')?.value||''),
      country_code:String($('signupCountry')?.value||'FR').trim().toUpperCase(),
      zip_code:String($('signupZip')?.value||'').trim()
    };
  }
  function validProfile(p){
    return /^\d{4}-\d{2}-\d{2}$/.test(p.birth_date) && ['m','f'].includes(p.gender) && /^[A-Z]{2}$/.test(p.country_code) && p.zip_code.length>=2;
  }

  function installFields(){
    const box=document.querySelector('#authModal .modal-box');
    const login=$('loginAction');
    if(!box||!login||$('signupUsername')) return;
    const wrap=document.createElement('div');
    wrap.id='signupExtraProfile';
    wrap.innerHTML=`
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid #203141">
        <label for="signupUsername">Pseudo RiseLooter</label>
        <input id="signupUsername" maxlength="20" autocomplete="nickname" placeholder="3 à 20 caractères" style="${style}">
        <div id="signupUsernameStatus" class="muted" style="font-size:12px;margin:-5px 0 10px">Ce pseudo sera affiché publiquement dans le classement.</div>
        <div style="font-weight:900;color:#c978ff;margin:8px 0 4px">Profil sondages</div>
        <div class="muted" style="font-size:12px;margin-bottom:8px">Ces quelques réponses servent à personnaliser les sondages proposés et à améliorer ton taux de réussite.</div>
        <label for="signupBirth">Date de naissance</label>
        <input id="signupBirth" type="date" style="${style}">
        <label for="signupSurveyGender">Sexe pour le ciblage des sondages</label>
        <select id="signupSurveyGender" style="${style}"><option value="">Choisir</option><option value="m">Homme</option><option value="f">Femme</option></select>
        <label for="signupCountry">Pays de résidence</label>
        <select id="signupCountry" style="${style}"><option value="FR">France</option></select>
        <label for="signupZip">Code postal</label>
        <input id="signupZip" maxlength="12" autocomplete="postal-code" placeholder="Ex. 49330" style="${style}">
      </div>`;
    box.insertBefore(wrap,login);

    let timer=0;
    $('signupUsername').addEventListener('input',()=>{
      clearTimeout(timer);
      const username=$('signupUsername').value.trim();
      const status=$('signupUsernameStatus');
      if(!validUsername(username)){status.textContent='3 à 20 caractères : lettres, chiffres, _ ou -.';status.style.color='';return;}
      timer=setTimeout(async()=>{
        try{
          const r=await sb.rpc('username_available',{p_username:username});
          const available=r.error?null:Boolean(r.data);
          status.textContent=available===true?'✓ Pseudo disponible.':available===false?'Ce pseudo est déjà utilisé.':'Vérification indisponible.';
          status.style.color=available===true?'#57df87':available===false?'#ff6d72':'';
        }catch(_){status.textContent='Vérification indisponible.';status.style.color='';}
      },250);
    });
  }

  async function claimMetadataUsername(user){
    const username=String(user?.user_metadata?.username||'').trim();
    if(!username||!validUsername(username)) return;
    try{ await sb.rpc('claim_username',{p_username:username}); }catch(_){}
  }

  async function enhancedSignup(){
    const email=String($('emailInput')?.value||'').trim();
    const password=String($('passwordInput')?.value||'');
    const username=String($('signupUsername')?.value||'').trim();
    const profile=profileValues();
    if(!email||!password){alert('Entre ton e-mail et ton mot de passe.');return;}
    if(!validUsername(username)){alert('Choisis un pseudo de 3 à 20 caractères avec lettres, chiffres, _ ou -.');return;}
    if(!validProfile(profile)){alert('Complète correctement ta date de naissance, ton sexe, ton pays et ton code postal.');return;}
    try{
      const av=await sb.rpc('username_available',{p_username:username});
      if(av.error) throw av.error;
      if(!av.data){alert('Ce pseudo est déjà utilisé. Choisis-en un autre.');return;}
      const {data,error}=await sb.auth.signUp({
        email,password,
        options:{data:{username,player_name:username,survey_profile:profile}}
      });
      if(error) throw error;
      if(data?.session){
        await claimMetadataUsername(data.user);
        document.getElementById('authModal')?.classList.remove('show');
        if(typeof refreshUser==='function') await refreshUser(true);
      }else{
        alert('Compte créé. Vérifie ton e-mail pour confirmer ton inscription.');
      }
    }catch(e){alert(e?.message||'Impossible de créer le compte pour le moment.');}
  }

  async function boot(){
    installFields();
    const signup=$('signupAction');
    if(signup) signup.onclick=enhancedSignup;
    try{
      const {data}=await sb.auth.getUser();
      if(data?.user) await claimMetadataUsername(data.user);
      sb.auth.onAuthStateChange((_event,session)=>{if(session?.user)setTimeout(()=>claimMetadataUsername(session.user),50);});
    }catch(_){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
