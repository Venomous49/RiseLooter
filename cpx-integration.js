/* RiseLooter CPX Research integration — resilient inline runtime */
(() => {
  if (window.__RISELOOTER_CPX_V8__) return;
  window.__RISELOOTER_CPX_V8__ = true;

  const CPX_APP_ID = 35504;
  let mounting = false;
  let retryTimer = null;

  function getSb(){
    try { if (typeof sb !== 'undefined' && sb?.auth) return sb; } catch (_) {}
    return window.sb?.auth ? window.sb : null;
  }

  function scheduleMount(delay=0){
    clearTimeout(retryTimer);
    retryTimer=setTimeout(()=>mountCPX().catch(()=>{}),delay);
  }

  async function getServerConfig(client,user){
    let accessToken='';
    try { accessToken=(await client.auth.getSession())?.data?.session?.access_token||''; } catch (_) {}
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
    const p=getSurveyProfile(user),u=new URL('https://offers.cpx-research.com/index.php');
    u.searchParams.set('app_id',String(cfg.app_id||CPX_APP_ID));
    u.searchParams.set('ext_user_id',String(cfg.ext_user_id||user.id));
    if(cfg.secure_hash)u.searchParams.set('secure_hash',cfg.secure_hash);
    if(user.email)u.searchParams.set('email',user.email);
    const username=user?.user_metadata?.username||user?.user_metadata?.player_name||'';
    if(username)u.searchParams.set('username',username);
    u.searchParams.set('subid_1','riselooter');u.searchParams.set('subid_2','inline-wall');
    if(p.year&&p.month&&p.day&&p.country&&p.zip){
      u.searchParams.set('main_info','true');u.searchParams.set('birthday_day',String(Number(p.day)));u.searchParams.set('birthday_month',String(Number(p.month)));u.searchParams.set('birthday_year',p.year);
      if(p.gender)u.searchParams.set('gender',p.gender);
      u.searchParams.set('user_country_code',p.country);u.searchParams.set('zip_code',p.zip);
    }
    return u.toString();
  }

  function ensureShell(missions){
    let mount=document.getElementById('cpx-riselooter-mount');
    if(mount&&mount.closest('#missions'))return mount;
    mount=document.createElement('div');mount.id='cpx-riselooter-mount';mount.style.cssText='margin-top:16px;padding-top:16px;border-top:1px solid #203141;min-height:420px';
    mount.innerHTML=`<div style="font-weight:900;font-size:20px;margin-bottom:6px">Sondages CPX Research</div><div id="cpx-status" class="muted" style="margin-bottom:12px">Chargement des sondages personnalisés…</div><div id="cpx-profile-box" style="display:none;margin:0 0 14px;padding:14px;border:1px solid #46326b;border-radius:10px;background:#0b1019"><div style="font-weight:800;margin-bottom:8px">Complète ton profil pour améliorer ton taux de réussite aux sondages.</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px"><input id="cpx-birth" type="date" style="padding:10px;border-radius:8px;border:1px solid #2c3b49;background:#050a0f;color:#fff"><select id="cpx-gender" style="padding:10px;border-radius:8px;border:1px solid #2c3b49;background:#050a0f;color:#fff"><option value="">Sexe</option><option value="m">Homme</option><option value="f">Femme</option></select><input id="cpx-country" value="FR" maxlength="2" placeholder="Pays (FR)" style="padding:10px;border-radius:8px;border:1px solid #2c3b49;background:#050a0f;color:#fff;text-transform:uppercase"><input id="cpx-zip" maxlength="12" placeholder="Code postal" style="padding:10px;border-radius:8px;border:1px solid #2c3b49;background:#050a0f;color:#fff"></div><button id="cpx-save-profile" class="btn" style="margin-top:10px">Enregistrer mon profil sondages</button></div><div id="cpx-inline-title" style="display:none;margin:4px 0 10px;font-weight:800">Choisis directement une enquête ci-dessous :</div><div id="cpx-frame-wrap" style="display:none;overflow:hidden;border:1px solid #25384a;border-radius:12px;background:#08131c"><iframe id="cpx-riselooter-frame" title="Sondages CPX Research" style="display:block;width:100%;height:2000px;border:0;background:#08131c" referrerpolicy="strict-origin-when-cross-origin" loading="eager" allow="camera; microphone"></iframe></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><a id="cpx-open-wall" class="btn dark" target="_blank" rel="noopener" style="display:none;font-size:13px">Ouvrir en plein écran</a></div><div id="cpx-login-note" style="display:none;padding:14px;border:1px solid #263848;border-radius:10px;background:#071019">Connecte-toi pour accéder aux sondages rémunérés CPX Research.</div>`;
    missions.appendChild(mount);return mount;
  }

  async function mountCPX(){
    if(mounting)return;mounting=true;
    try{
      const missions=document.getElementById('missions');
      if(!missions){scheduleMount(300);return;}
      ensureShell(missions);
      const client=getSb(),status=document.getElementById('cpx-status');
      if(!client){if(status)status.textContent='Connexion au profil RiseLooter…';scheduleMount(400);return;}
      const frameWrap=document.getElementById('cpx-frame-wrap'),frame=document.getElementById('cpx-riselooter-frame'),loginNote=document.getElementById('cpx-login-note'),profileBox=document.getElementById('cpx-profile-box'),open=document.getElementById('cpx-open-wall'),inlineTitle=document.getElementById('cpx-inline-title');
      let user=null;try{user=(await client.auth.getUser())?.data?.user||null;}catch(_){}
      if(!user){if(status)status.textContent='Connexion requise.';if(frameWrap)frameWrap.style.display='none';if(profileBox)profileBox.style.display='none';if(loginNote)loginNote.style.display='block';if(open)open.style.display='none';if(inlineTitle)inlineTitle.style.display='none';return;}
      if(loginNote)loginNote.style.display='none';
      const profile=getSurveyProfile(user),complete=Boolean(profile.year&&profile.month&&profile.day&&profile.country&&profile.zip);
      if(profileBox){profileBox.style.display=complete?'none':'block';document.getElementById('cpx-birth').value=profile.birth||'';document.getElementById('cpx-gender').value=profile.gender||'';document.getElementById('cpx-country').value=profile.country||'FR';document.getElementById('cpx-zip').value=profile.zip||'';}
      const cfg=await getServerConfig(client,user),wallUrl=buildWallUrl(user,cfg);
      if(open){open.href=wallUrl;open.style.display='inline-block';}if(frame){if(frame.src!==wallUrl)frame.src=wallUrl;frame.dataset.cpxUser=String(user.id);}if(frameWrap)frameWrap.style.display='block';if(inlineTitle)inlineTitle.style.display='block';
      if(status)status.textContent=complete?'Profil de ciblage actif — les enquêtes CPX sont intégrées directement dans RiseLooter.':'Profil de ciblage incomplet — complète-le ci-dessus pour améliorer la pertinence des sondages.';
      const save=document.getElementById('cpx-save-profile');
      if(save&&!save.dataset.bound){save.dataset.bound='1';save.addEventListener('click',async()=>{const birth=String(document.getElementById('cpx-birth')?.value||''),gender=String(document.getElementById('cpx-gender')?.value||''),country=String(document.getElementById('cpx-country')?.value||'').trim().toUpperCase(),zip=String(document.getElementById('cpx-zip')?.value||'').trim();if(!/^\d{4}-\d{2}-\d{2}$/.test(birth)||!['m','f'].includes(gender)||!^[A-Z]{2}$/.test(country)||!zip){alert('Complète correctement la date de naissance, le sexe, le pays et le code postal.');return;}save.disabled=true;try{const metadata={...(user.user_metadata||{}),survey_profile:{birth_date:birth,gender,country_code:country,zip_code:zip}};const r=await client.auth.updateUser({data:metadata});if(r.error)throw r.error;alert('Profil sondages enregistré.');document.getElementById('cpx-riselooter-mount')?.remove();scheduleMount(100);}catch(e){alert('Impossible d’enregistrer le profil sondages pour le moment.');}finally{save.disabled=false;}});}
    }finally{mounting=false;}
  }

  function boot(){
    scheduleMount(50);setTimeout(()=>scheduleMount(0),700);setTimeout(()=>scheduleMount(0),1800);
    document.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:null;if(t?.closest('[data-nav="missions"], [data-filter="survey"]'))scheduleMount(80);});
    const obs=new MutationObserver(()=>{if(document.getElementById('missions')&&!document.getElementById('cpx-riselooter-mount'))scheduleMount(50);});obs.observe(document.documentElement,{childList:true,subtree:true});
    const authPoll=setInterval(()=>{const client=getSb();if(!client)return;clearInterval(authPoll);try{client.auth.onAuthStateChange(()=>scheduleMount(80));}catch(_){}scheduleMount(0);},250);setTimeout(()=>clearInterval(authPoll),15000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
