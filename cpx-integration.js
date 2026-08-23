/* RiseLooter CPX Research integration — App 35504 */
(() => {
  const CPX_APP_ID = 35504;

  async function getServerConfig(user) {
    let accessToken = '';
    try {
      const sessionResult = await sb.auth.getSession();
      accessToken = sessionResult?.data?.session?.access_token || '';
    } catch (_) {}
    if (!accessToken) return { app_id: CPX_APP_ID, ext_user_id: String(user.id), secure_hash: '' };
    try {
      const response = await fetch('/api/cpx/config', {
        headers: { authorization: `Bearer ${accessToken}` }, cache: 'no-store'
      });
      if (!response.ok) throw new Error('CPX config unavailable');
      const config = await response.json();
      if (!config?.ok || String(config.ext_user_id || '') !== String(user.id)) throw new Error('CPX config user mismatch');
      return {
        app_id: Number(config.app_id) || CPX_APP_ID,
        ext_user_id: String(config.ext_user_id),
        secure_hash: String(config.secure_hash || '')
      };
    } catch (_) {
      return { app_id: CPX_APP_ID, ext_user_id: String(user.id), secure_hash: '' };
    }
  }

  function getSurveyProfile(user) {
    const p = user?.user_metadata?.survey_profile || {};
    const birth = /^\d{4}-\d{2}-\d{2}$/.test(String(p.birth_date || '')) ? String(p.birth_date) : '';
    const [year='',month='',day=''] = birth.split('-');
    const gender = ['m','f'].includes(String(p.gender || '')) ? String(p.gender) : '';
    const country = /^[A-Z]{2}$/.test(String(p.country_code || '').toUpperCase()) ? String(p.country_code).toUpperCase() : '';
    const zip = String(p.zip_code || '').trim().slice(0,12);
    return { year, month, day, gender, country, zip };
  }

  function buildEntryUrl(user, serverConfig) {
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

    const hasBasicTargeting = profile.year && profile.month && profile.day && profile.country && profile.zip;
    if (hasBasicTargeting) {
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

  async function mountCPX() {
    const missions = document.getElementById('missions');
    if (!missions || typeof sb === 'undefined') return;

    let user = null;
    try { user = (await sb.auth.getUser())?.data?.user || null; } catch (_) {}
    if (!user) {
      missions.innerHTML = '<h2>▤ Sondages</h2><div class="section-subtitle">Connecte-toi pour accéder aux sondages rémunérés CPX Research.</div>';
      return;
    }

    const profile = getSurveyProfile(user);
    const complete = Boolean(profile.year && profile.month && profile.day && profile.country && profile.zip);
    missions.innerHTML = `
      <h2>▤ Sondages</h2>
      <div class="section-subtitle">Sondages CPX Research personnalisés selon ton profil.</div>
      <div id="cpx-status" class="muted" style="margin:0 0 12px">${complete ? 'Ton profil de ciblage est actif : les informations fournies à l’inscription sont transmises à CPX pour améliorer la pertinence des sondages.' : 'Profil de ciblage incomplet : CPX pourra te poser davantage de questions de qualification.'}</div>
      <iframe id="cpx-riselooter-frame" title="Sondages CPX Research" style="width:100%;min-height:1500px;border:0;border-radius:10px;background:#08131c" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;

    const serverConfig = await getServerConfig(user);
    const frame = document.getElementById('cpx-riselooter-frame');
    if (frame) frame.src = buildEntryUrl(user, serverConfig);
  }

  function boot() {
    mountCPX();
    document.addEventListener('click', (event) => {
      const target = event.target.closest('[data-nav="missions"], [data-filter="survey"]');
      if (target) setTimeout(mountCPX, 50);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();