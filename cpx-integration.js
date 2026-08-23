/* RiseLooter CPX Research integration — App 35504 */
(() => {
  if (window.__RISELOOTER_CPX_V5__) return;
  window.__RISELOOTER_CPX_V5__ = true;

  const CPX_APP_ID = 35504;
  let mounting = false;

  async function getServerConfig(user) {
    let accessToken='';
    try { accessToken=(await sb.auth.getSession())?.data?.session?.access_token||''; } catch (_) {}
    if (!accessToken) return {app_id:CPX_APP_ID,ext_user_id:String(user.id),secure_hash:''};
    try {
      const r=await fetch('/api/cpx/config',{headers:{authorization:`Bearer ${accessToken}`},cache:'no-store'});
      if(!r.ok) throw new Error();
      const c=await r.json();
      return {app_id:Number(c.app_id)||CPX_APP_ID,ext_user_id:String(c.ext_user_id||user.id),secure_hash:String(c.secure_hash||'')};
    } catch (_) { return {app_id:CPX_APP_ID,ext_user_id:String(user.id),secure_hash:''}; }
  }

  function getSurveyProfile(user){
    const p=user?.user_metadata?.survey_profile||{};
    const birth=/^\d{4}-\d{2}-\d{2}$/.test(String(p.birth_date||''))?String(p.birth_date):'';
    const [year='',month='',day='']=birth.split('-');
    const gender=['m','f'].includes(String(p.gender||''))?String(p.gender):'';
    const country=/^[A-Z]{2}$/.test(String(p.country_code||'').toUpperCase())?String(p.country_code).toUpperCase():'';
    const zip=String(p.zip_code||'').trim().slice(0,12);
    return {birth,year,month,day,gender,country,zip};
  }

  function buildWallUrl(user,cfg){
    const p=getSurveyProfile(user);
    const u=new URL('https://offers.cpx-research.com/index.php');
    u.searchParams.set('app_id',String(cfg.app_id||CPX_APP_ID));
    u.searchParams.set('ext_user_id',String(cfg.ext_user_id));
    if(cfg.secure_hash)u.searchParams.set('secure_hash',cfg.secure_hash);
    if(user.email)u.searchParams.set('email',user.email);
    const username=user?.user_metadata?.username||user?.user_metadata?.player_name||'';
    if(username)u.searchParams.set('username',username);
    u.searchParams.set('subid_1','riselooter');u.searchParams.set('subid_2','profiled');
    if(p.year&&p.month&&p.day&&p.country&&p.zip){
      u.searchParams.set('main_info','true');
      u.searchParams.set('birthday_day',String(Number(p.day)));
      u.searchParams.set('birthday_month',String(Number(p.month)));
      u.searchParams.set('birthday_year',p.year);
      if(p.gender)u.searchParams.set('gender',p.gender);
      u.searchParams.set('user_country_code',p.country);
      u.searchParams.set('zip_code',p.zip);
    }
    return u.toString();
  }

  function ensureShell(missions){
    let mount=document.getElementById('cpx-riselooter-mount');
    if(mount&&mount.closest('#missions'))return mount;
    mount=document.createElement('div');
    mount.id='cpx-riselooter-mount';
    mount.style.cssText='margin-top:16px;padding-top:16px;border-top:1px solid #203141;min-height:320px';
    mount.innerHTML=`
      <div style="font-weight:900;font-size:18px;margin-bottom:6px">Sondages CPX Research</div>
      <div id="cpx-status" class="muted" style="margin-bottom:12px">Chargement des sondages personnalisés…</div>
      <div id="cpx-profile-box" style="display:none;margin:0 0 14px;padding:14px;border:1px solid #46326b;border-radius:10px;background:#0b1019">
        <div style="font-weight:800;margin-bottom:8px">Complète ton profil pour améliorer ton taux de réussite aux sondages.</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px">
          <input id="cpx-birth" type="date" style="padding:10px;border-radius:8px;border:1px solid #2c3b49;background:#050a0f;color:#fff">
          <select id="cpx-gender" style="padding:10px;border-radius:8px;border:1px solid #2c3b49;background:#050a0f;color:#fff"><option value="">Sexe</option><option value="m">Homme</option><option value="f">Femme</option></select>
          <input id="cpx-country" value="FR" maxlength="2" placeholder="Pays (FR)" style="padding:10px;border-radius:8px;border:1px solid #2c3b49;background:#050a0f;color:#fff;text-transform:uppercase">
          <input id="cpx-zip" maxlength="12" placeholder="Code postal" style="padding:10px;border-radius:8px;border:1px solid #2c3b49;background:#050a0f;color:#fff">
        </div>
        <button id="cpx-save-profile" class="btn" style="margin-top:10px">Enregistrer mon profil sondages</button>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px"><a id="cpx-open-wall" class="btn" target="_blank" rel="noopener">Ouvrir les sondages CPX</a></div>
      <div id="cpx-frame-wrap" style="display:none"><iframe id="cpx-riselooter-frame" title="Sondages CPX Research" style="width:100%;height:1700px;border:0;border-radius:10px;background:#08131c" referrerpolicy="strict-origin-when-cross-origin" loading="eager"></iframe></div>
      <div id="cpx-login-note" style="display:none;padding:14px;border:1px solid #263848;border-radius:10px;background:#071019">Connecte-toi pour accéder aux sondages rémunérés CPX Research.</div>`;
    missions.appendChild(mount);return mount;
  }

  async function mountCPX(){
    if(mounting)return;mounting=true;
    try{
      const missions=document.getElementById('missions');if(!missions||typeof sb==='undefined')return;
      ensureShell(missions);
      const status=document.getElementById('cpx-status'),frameWrap=document.getElementById('cpx-frame-wrap'),frame=document.getElementById('cpx-riselooter-frame'),loginNote=document.getElementById('cpx-login-note'),profileBox=document.getElementById('cpx-profile-box'),open=document.getElementById('cpx-open-wall');
      let user=null;try{user=(await sb.auth.getUser())?.data?.user||null;}catch(_){}
      if(!user){if(status)status.textContent='Connexion requise.';if(frameWrap)frameWrap.style.display='none';if(profileBox)profileBox.style.display='none';if(loginNote)loginNote.style.display='block';if(open)open.style.display='none';return;}
      if(loginNote)loginNote.style.display='none';if(open)open.style.display='inline-block';
      const profile=getSurveyProfile(user),complete=Boolean(profile.year&&profile.month&&profile.day&&profile.country&&profile.zip);
      if(profileBox){profileBox.style.display=complete?'none':'block';document.getElementById('cpx-birth').value=profile.birth||'';document.getElementById('cpx-gender').value=profile.gender||'';document.getElementById('cpx-country').value=profile.country||'FR';document.getElementById('cpx-zip').value=profile.zip||'';}
      const cfg=await getServerConfig(user),wallUrl=buildWallUrl(user,cfg);if(open)open.href=wallUrl;
      if(frame){frame.src=wallUrl;frame.dataset.cpxUser=String(user.id);}
      if(frameWrap)frameWrap.style.display='block';
      if(status)status.textContent=complete?'Profil de ciblage actif — CPX personnalise les sondages selon tes réponses.':'Profil de ciblage incomplet — complète-le ci-dessous pour améliorer la pertinence des sondages.';
      const save=document.getElementById('cpx-save-profile');
      if(save&&!save.dataset.bound){save.dataset.bound='1';save.addEventListener('click',async()=>{
        const birth=String(document.getElementById('cpx-birth')?.value||''),gender=String(document.getElementById('cpx-gender')?.value||''),country=String(document.getElementById('cpx-country')?.value||'').trim().toUpperCase(),zip=String(document.getElementById('cpx-zip')?.value||'').trim();
        if(!/^\d{4}-\d{2}-\d{2}$/.test(birth)||!['m','f'].includes(gender)||!^[A-Z]{2}$/.test(country)||!zip){alert('Complète correctement la date de naissance, le sexe, le pays et le code postal.');return;}
        save.disabled=true;
        try{const metadata={...(user.user_metadata||{}),survey_profile:{birth_date:birth,gender,country_code:country,zip_code:zip}};const r=await sb.auth.updateUser({data:metadata});if(r.error)throw r.error;alert('Profil sondages enregistré.');document.getElementById('cpx-riselooter-mount')?.remove();setTimeout(()=>mountCPX(),100);}catch(e){alert('Impossible d’enregistrer le profil sondages pour le moment.');}finally{save.disabled=false;}
      });}
    }finally{mounting=false;}
  }

  function scheduleMount(delay=0){setTimeout(()=>mountCPX().catch(()=>{}),delay);}
  function boot(){scheduleMount(250);scheduleMount(1200);document.addEventListener('click',e=>{if(e.target.closest('[data-nav="missions"], [data-filter="survey"]'))scheduleMount(120);});try{sb.auth.onAuthStateChange(()=>scheduleMount(120));}catch(_){}const obs=new MutationObserver(()=>{const m=document.getElementById('missions');if(m&&!document.getElementById('cpx-riselooter-mount'))scheduleMount(80);});obs.observe(document.documentElement,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
