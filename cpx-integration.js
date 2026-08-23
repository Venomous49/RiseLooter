/* RiseLooter CPX Research integration — resilient runtime */
(() => {
  if (window.__RISELOOTER_CPX_V6__) return;
  window.__RISELOOTER_CPX_V6__ = true;

  const CPX_APP_ID = 35504;
  let rendering = false;
  let retryTimer = null;

  function getSb(){
    try {
      if (typeof sb !== 'undefined' && sb?.auth) return sb;
    } catch (_) {}
    return window.sb?.auth ? window.sb : null;
  }

  function ensureShell(){
    const missions = document.getElementById('missions');
    if (!missions) return null;

    let mount = document.getElementById('cpx-riselooter-mount');
    if (mount && mount.closest('#missions')) return mount;

    mount = document.createElement('div');
    mount.id = 'cpx-riselooter-mount';
    mount.style.cssText = 'margin-top:16px;padding:16px 0 0;border-top:1px solid #203141;min-height:220px';
    mount.innerHTML = `
      <div style="font-weight:900;font-size:19px;margin-bottom:6px">Sondages CPX Research</div>
      <div id="cpx-status" class="muted" style="margin-bottom:12px">Initialisation de CPX Research…</div>
      <div id="cpx-profile-box" style="display:none;margin:0 0 14px;padding:14px;border:1px solid #46326b;border-radius:10px;background:#0b1019">
        <div style="font-weight:800;margin-bottom:4px">Complète ton profil sondages</div>
        <div class="muted" style="margin-bottom:10px">Ces informations servent à personnaliser les sondages proposés et à améliorer ton taux de réussite.</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px">
          <input id="cpx-birth" type="date" aria-label="Date de naissance" style="padding:10px;border-radius:8px;border:1px solid #2c3b49;background:#050a0f;color:#fff">
          <select id="cpx-gender" aria-label="Sexe" style="padding:10px;border-radius:8px;border:1px solid #2c3b49;background:#050a0f;color:#fff"><option value="">Sexe</option><option value="m">Homme</option><option value="f">Femme</option></select>
          <input id="cpx-country" value="FR" maxlength="2" placeholder="Pays (FR)" aria-label="Pays" style="padding:10px;border-radius:8px;border:1px solid #2c3b49;background:#050a0f;color:#fff;text-transform:uppercase">
          <input id="cpx-zip" maxlength="12" placeholder="Code postal" aria-label="Code postal" style="padding:10px;border-radius:8px;border:1px solid #2c3b49;background:#050a0f;color:#fff">
        </div>
        <button id="cpx-save-profile" class="btn" style="margin-top:10px">Enregistrer mon profil sondages</button>
      </div>
      <div id="cpx-actions" style="display:none;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <a id="cpx-open-wall" class="btn" target="_blank" rel="noopener">Ouvrir les sondages CPX</a>
      </div>
      <div id="cpx-frame-wrap" style="display:none">
        <iframe id="cpx-riselooter-frame" title="Sondages CPX Research" style="width:100%;height:1500px;border:0;border-radius:10px;background:#08131c" referrerpolicy="strict-origin-when-cross-origin" loading="eager"></iframe>
      </div>`;

    missions.appendChild(mount);
    return mount;
  }

  function getSurveyProfile(user){
    const p = user?.user_metadata?.survey_profile || {};
    const birth = /^\d{4}-\d{2}-\d{2}$/.test(String(p.birth_date || '')) ? String(p.birth_date) : '';
    const [year='',month='',day=''] = birth.split('-');
    const gender = ['m','f'].includes(String(p.gender || '')) ? String(p.gender) : '';
    const country = /^[A-Z]{2}$/.test(String(p.country_code || '').toUpperCase()) ? String(p.country_code).toUpperCase() : '';
    const zip = String(p.zip_code || '').trim().slice(0,12);
    return {birth,year,month,day,gender,country,zip};
  }

  async function getServerConfig(client,user){
    try {
      const session = (await client.auth.getSession())?.data?.session;
      const token = session?.access_token || '';
      if (!token) throw new Error('missing session');
      const response = await fetch('/api/cpx/config', {
        headers: { authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      if (!response.ok) throw new Error(`config ${response.status}`);
      const data = await response.json();
      return {
        app_id: Number(data.app_id) || CPX_APP_ID,
        ext_user_id: String(data.ext_user_id || user.id),
        secure_hash: String(data.secure_hash || '')
      };
    } catch (_) {
      return {app_id:CPX_APP_ID,ext_user_id:String(user.id),secure_hash:''};
    }
  }

  function buildWallUrl(user,cfg){
    const p = getSurveyProfile(user);
    const url = new URL('https://offers.cpx-research.com/index.php');
    url.searchParams.set('app_id', String(cfg.app_id || CPX_APP_ID));
    url.searchParams.set('ext_user_id', String(cfg.ext_user_id || user.id));
    if (cfg.secure_hash) url.searchParams.set('secure_hash', cfg.secure_hash);
    if (user.email) url.searchParams.set('email', user.email);
    const username = user?.user_metadata?.username || user?.user_metadata?.player_name || '';
    if (username) url.searchParams.set('username', username);
    url.searchParams.set('subid_1','riselooter');
    url.searchParams.set('subid_2','profiled');

    if (p.year && p.month && p.day && p.country && p.zip) {
      url.searchParams.set('main_info','true');
      url.searchParams.set('birthday_day', String(Number(p.day)));
      url.searchParams.set('birthday_month', String(Number(p.month)));
      url.searchParams.set('birthday_year', p.year);
      if (p.gender) url.searchParams.set('gender', p.gender);
      url.searchParams.set('user_country_code', p.country);
      url.searchParams.set('zip_code', p.zip);
    }
    return url.toString();
  }

  function scheduleRetry(ms=500){
    clearTimeout(retryTimer);
    retryTimer = setTimeout(() => renderCPX().catch(() => {}), ms);
  }

  async function renderCPX(){
    ensureShell();
    if (rendering) return;

    const mount = document.getElementById('cpx-riselooter-mount');
    if (!mount) {
      scheduleRetry(300);
      return;
    }

    const status = document.getElementById('cpx-status');
    const client = getSb();
    if (!client) {
      if (status) status.textContent = 'Connexion au profil RiseLooter…';
      scheduleRetry(500);
      return;
    }

    rendering = true;
    try {
      let user = null;
      try { user = (await client.auth.getUser())?.data?.user || null; } catch (_) {}

      if (!user) {
        if (status) status.textContent = 'Connecte-toi pour accéder aux sondages rémunérés CPX Research.';
        document.getElementById('cpx-profile-box').style.display = 'none';
        document.getElementById('cpx-actions').style.display = 'none';
        document.getElementById('cpx-frame-wrap').style.display = 'none';
        return;
      }

      const profile = getSurveyProfile(user);
      const complete = Boolean(profile.year && profile.month && profile.day && profile.gender && profile.country && profile.zip);
      const profileBox = document.getElementById('cpx-profile-box');
      profileBox.style.display = complete ? 'none' : 'block';

      if (!complete) {
        document.getElementById('cpx-birth').value = profile.birth || '';
        document.getElementById('cpx-gender').value = profile.gender || '';
        document.getElementById('cpx-country').value = profile.country || 'FR';
        document.getElementById('cpx-zip').value = profile.zip || '';
      }

      const cfg = await getServerConfig(client,user);
      const wallUrl = buildWallUrl(user,cfg);
      const openWall = document.getElementById('cpx-open-wall');
      const frame = document.getElementById('cpx-riselooter-frame');

      openWall.href = wallUrl;
      document.getElementById('cpx-actions').style.display = 'flex';
      frame.src = wallUrl;
      document.getElementById('cpx-frame-wrap').style.display = 'block';
      if (status) status.textContent = complete
        ? 'Profil de ciblage actif — les sondages sont personnalisés selon tes réponses.'
        : 'Ton profil de ciblage est incomplet — complète les informations ci-dessous pour améliorer la pertinence des sondages.';

      const save = document.getElementById('cpx-save-profile');
      if (save && !save.dataset.bound) {
        save.dataset.bound = '1';
        save.addEventListener('click', async () => {
          const birth = String(document.getElementById('cpx-birth')?.value || '');
          const gender = String(document.getElementById('cpx-gender')?.value || '');
          const country = String(document.getElementById('cpx-country')?.value || '').trim().toUpperCase();
          const zip = String(document.getElementById('cpx-zip')?.value || '').trim();

          if (!/^\d{4}-\d{2}-\d{2}$/.test(birth) || !['m','f'].includes(gender) || !/^[A-Z]{2}$/.test(country) || !zip) {
            alert('Complète correctement la date de naissance, le sexe, le pays et le code postal.');
            return;
          }

          save.disabled = true;
          try {
            const metadata = {
              ...(user.user_metadata || {}),
              survey_profile: { birth_date:birth, gender, country_code:country, zip_code:zip }
            };
            const result = await client.auth.updateUser({data:metadata});
            if (result.error) throw result.error;
            alert('Profil sondages enregistré.');
            mount.remove();
            scheduleRetry(100);
          } catch (_) {
            alert('Impossible d’enregistrer le profil sondages pour le moment.');
          } finally {
            save.disabled = false;
          }
        });
      }
    } finally {
      rendering = false;
    }
  }

  function boot(){
    ensureShell();
    renderCPX().catch(() => {});
    scheduleRetry(700);
    scheduleRetry(1800);

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('[data-nav="missions"], [data-filter="survey"]')) scheduleRetry(80);
    });

    const observer = new MutationObserver(() => {
      if (document.getElementById('missions') && !document.getElementById('cpx-riselooter-mount')) {
        ensureShell();
        scheduleRetry(50);
      }
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});

    const authPoll = setInterval(() => {
      const client = getSb();
      if (!client) return;
      clearInterval(authPoll);
      try { client.auth.onAuthStateChange(() => scheduleRetry(80)); } catch (_) {}
      scheduleRetry(0);
    },250);
    setTimeout(() => clearInterval(authPoll),15000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
