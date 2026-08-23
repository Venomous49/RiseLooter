/* RiseLooter CPX Research integration — App 35504 */
(() => {
  if (window.__RISELOOTER_CPX_V4__) return;
  window.__RISELOOTER_CPX_V4__ = true;

  const CPX_APP_ID = 35504;
  let mounting = false;

  async function getServerConfig(user) {
    let accessToken = '';
    try {
      const sessionResult = await sb.auth.getSession();
      accessToken = sessionResult?.data?.session?.access_token || '';
    } catch (_) {}
    if (!accessToken) return { app_id: CPX_APP_ID, ext_user_id: String(user.id), secure_hash: '' };
    try {
      const response = await fetch('/api/cpx/config', {
        headers: { authorization: `Bearer ${accessToken}` },
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('CPX config unavailable');
      const config = await response.json();
      return {
        app_id: Number(config.app_id) || CPX_APP_ID,
        ext_user_id: String(config.ext_user_id || user.id),
        secure_hash: String(config.secure_hash || '')
      };
    } catch (_) {
      return { app_id: CPX_APP_ID, ext_user_id: String(user.id), secure_hash: '' };
    }
  }

  function getSurveyProfile(user) {
    const p = user?.user_metadata?.survey_profile || {};
    const birth = /^\d{4}-\d{2}-\d{2}$/.test(String(p.birth_date || '')) ? String(p.birth_date) : '';
    const [year='', month='', day=''] = birth.split('-');
    const gender = ['m','f'].includes(String(p.gender || '')) ? String(p.gender) : '';
    const country = /^[A-Z]{2}$/.test(String(p.country_code || '').toUpperCase()) ? String(p.country_code).toUpperCase() : '';
    const zip = String(p.zip_code || '').trim().slice(0, 12);
    return { year, month, day, gender, country, zip };
  }

  function buildWallUrl(user, serverConfig) {
    const profile = getSurveyProfile(user);
    const url = new URL('https://offers.cpx-research.com/index.php');
    url.searchParams.set('app_id', String(serverConfig.app_id || CPX_APP_ID));
    url.searchParams.set('ext_user_id', String(serverConfig.ext_user_id));
    if (serverConfig.secure_hash) url.searchParams.set('secure_hash', serverConfig.secure_hash);
    if (user.email) url.searchParams.set('email', user.email);
    const username = user?.user_metadata?.username || user?.user_metadata?.player_name || '';
    if (username) url.searchParams.set('username', username);
    url.searchParams.set('subid_1', 'riselooter');
    url.searchParams.set('subid_2', 'profiled');

    if (profile.year && profile.month && profile.day && profile.country && profile.zip) {
      url.searchParams.set('main_info', 'true');
      url.searchParams.set('birthday_day', String(Number(profile.day)));
      url.searchParams.set('birthday_month', String(Number(profile.month)));
      url.searchParams.set('birthday_year', profile.year);
      if (profile.gender) url.searchParams.set('gender', profile.gender);
      url.searchParams.set('user_country_code', profile.country);
      url.searchParams.set('zip_code', profile.zip);
    }
    return url.toString();
  }

  function ensureShell(missions) {
    let mount = document.getElementById('cpx-riselooter-mount');
    if (mount && mount.closest('#missions')) return mount;

    mount = document.createElement('div');
    mount.id = 'cpx-riselooter-mount';
    mount.style.cssText = 'margin-top:16px;padding-top:16px;border-top:1px solid #203141;min-height:320px';
    mount.innerHTML = `
      <div style="font-weight:900;font-size:18px;margin-bottom:6px">Sondages CPX Research</div>
      <div id="cpx-status" class="muted" style="margin-bottom:12px">Chargement des sondages personnalisés…</div>
      <div id="cpx-frame-wrap" style="display:none">
        <iframe id="cpx-riselooter-frame" title="Sondages CPX Research" style="width:100%;height:1700px;border:0;border-radius:10px;background:#08131c" referrerpolicy="strict-origin-when-cross-origin" loading="eager"></iframe>
      </div>
      <div id="cpx-login-note" style="display:none;padding:14px;border:1px solid #263848;border-radius:10px;background:#071019">Connecte-toi pour accéder aux sondages rémunérés CPX Research.</div>`;
    missions.appendChild(mount);
    return mount;
  }

  async function mountCPX() {
    if (mounting) return;
    mounting = true;
    try {
      const missions = document.getElementById('missions');
      if (!missions || typeof sb === 'undefined') return;

      ensureShell(missions);
      const status = document.getElementById('cpx-status');
      const frameWrap = document.getElementById('cpx-frame-wrap');
      const frame = document.getElementById('cpx-riselooter-frame');
      const loginNote = document.getElementById('cpx-login-note');

      let user = null;
      try { user = (await sb.auth.getUser())?.data?.user || null; } catch (_) {}
      if (!user) {
        if (status) status.textContent = 'Connexion requise.';
        if (frameWrap) frameWrap.style.display = 'none';
        if (loginNote) loginNote.style.display = 'block';
        return;
      }

      if (loginNote) loginNote.style.display = 'none';
      if (status) status.textContent = 'Recherche des sondages correspondant à ton profil…';

      const serverConfig = await getServerConfig(user);
      const wallUrl = buildWallUrl(user, serverConfig);
      const currentUser = String(user.id);

      if (frame && frame.dataset.cpxUser !== currentUser) {
        frame.dataset.cpxUser = currentUser;
        frame.src = wallUrl;
      }
      if (frameWrap) frameWrap.style.display = 'block';

      const profile = getSurveyProfile(user);
      const complete = Boolean(profile.year && profile.month && profile.day && profile.country && profile.zip);
      if (status) {
        status.textContent = complete
          ? 'Profil de ciblage actif — CPX personnalise les sondages selon tes réponses.'
          : 'Profil de ciblage incomplet — CPX peut poser des questions de qualification supplémentaires.';
      }
    } finally {
      mounting = false;
    }
  }

  function scheduleMount(delay = 0) {
    setTimeout(() => mountCPX().catch(() => {}), delay);
  }

  function boot() {
    scheduleMount(250);
    scheduleMount(1200);

    document.addEventListener('click', event => {
      const target = event.target.closest('[data-nav="missions"], [data-filter="survey"]');
      if (target) scheduleMount(120);
    });

    try {
      sb.auth.onAuthStateChange(() => scheduleMount(120));
    } catch (_) {}

    const observer = new MutationObserver(() => {
      const missions = document.getElementById('missions');
      if (missions && !document.getElementById('cpx-riselooter-mount')) scheduleMount(80);
    });
    observer.observe(document.documentElement, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();
