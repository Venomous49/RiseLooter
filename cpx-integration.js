/* RiseLooter CPX Research integration — App 35504 */
(() => {
  if (window.__RISELOOTER_CPX_V3__) return;
  window.__RISELOOTER_CPX_V3__ = true;

  const CPX_APP_ID = 35504;
  const CPX_LIB = 'https://cdn.cpx-research.com/assets/js/script_tag_v2.0.js';

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

  function loadLibrary() {
    return new Promise((resolve, reject) => {
      if (window.__CPX_SCRIPT_TAG_LOADED__) return resolve();
      const existing = document.querySelector(`script[src="${CPX_LIB}"]`);
      if (existing) {
        existing.addEventListener('load', () => { window.__CPX_SCRIPT_TAG_LOADED__ = true; resolve(); }, { once:true });
        existing.addEventListener('error', reject, { once:true });
        return;
      }
      const s = document.createElement('script');
      s.src = CPX_LIB;
      s.async = true;
      s.onload = () => { window.__CPX_SCRIPT_TAG_LOADED__ = true; resolve(); };
      s.onerror = reject;
      document.body.appendChild(s);
    });
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

    if (missions.dataset.cpxUser === String(user.id) && document.getElementById('fullscreen')) return;
    missions.dataset.cpxUser = String(user.id);

    const profile = getSurveyProfile(user);
    const complete = Boolean(profile.year && profile.month && profile.day && profile.country && profile.zip);
    missions.innerHTML = `
      <h2>▤ Sondages</h2>
      <div class="section-subtitle">Sondages CPX Research personnalisés selon ton profil.</div>
      <div id="cpx-status" class="muted" style="margin:0 0 12px">Chargement des sondages CPX…</div>
      <div id="fullscreen" style="max-width:950px;margin:auto;min-height:260px"></div>
      <div id="cpx-fallback" style="display:none;margin-top:14px;padding:14px;border:1px solid #263848;border-radius:10px;background:#071019">
        <div style="margin-bottom:10px">Le mur CPX ne s’est pas affiché dans la page.</div>
        <a id="cpx-open-wall" class="btn" target="_blank" rel="noopener">Ouvrir les sondages CPX</a>
      </div>`;

    const serverConfig = await getServerConfig(user);
    const username = user?.user_metadata?.username || user?.user_metadata?.player_name || '';
    const wallUrl = buildWallUrl(user, serverConfig);
    const open = document.getElementById('cpx-open-wall');
    if (open) open.href = wallUrl;

    const status = document.getElementById('cpx-status');
    const fallback = document.getElementById('cpx-fallback');
    let callbackFired = false;

    window.config = {
      general_config: {
        app_id: Number(serverConfig.app_id) || CPX_APP_ID,
        ext_user_id: String(serverConfig.ext_user_id),
        email: user.email || '',
        username: username || '',
        secure_hash: serverConfig.secure_hash || '',
        subid_1: 'riselooter',
        subid_2: 'profiled'
      },
      style_config: {
        text_color: '#ffffff',
        survey_box: {
          topbar_background_color: '#7130d5',
          box_background_color: '#071019',
          rounded_borders: true,
          stars_filled: '#ffb52c'
        }
      },
      script_config: [{ div_id:'fullscreen', theme_style:1, order_by:1, limit_surveys:12 }],
      debug: false,
      useIFrame: true,
      iFramePosition: 1,
      functions: {
        no_surveys_available: () => {
          callbackFired = true;
          if (status) status.textContent = 'Aucun sondage CPX disponible pour ton profil pour le moment.';
          if (fallback) fallback.style.display = 'block';
        },
        count_new_surveys: count => {
          callbackFired = true;
          if (status) status.textContent = Number(count) > 0 ? `${count} sondage(s) CPX disponible(s).` : 'Aucun nouveau sondage CPX disponible pour le moment.';
        },
        get_all_surveys: surveys => {
          callbackFired = true;
          if (status && Array.isArray(surveys)) status.textContent = surveys.length ? `${surveys.length} sondage(s) CPX chargé(s).` : 'Aucun sondage CPX disponible pour ton profil pour le moment.';
        },
        get_transaction: () => {}
      }
    };

    try {
      await loadLibrary();
      if (status) status.textContent = complete
        ? 'Profil de ciblage actif. Recherche des sondages correspondant à ton profil…'
        : 'Profil de ciblage incomplet. CPX peut demander des questions de qualification supplémentaires.';
      setTimeout(() => {
        const full = document.getElementById('fullscreen');
        const hasContent = full && (full.children.length > 0 || full.innerHTML.trim().length > 20);
        if (!callbackFired && !hasContent) {
          if (status) status.textContent = 'Le widget CPX n’a pas répondu. Utilise le bouton ci-dessous pour ouvrir le mur de sondages.';
          if (fallback) fallback.style.display = 'block';
        }
      }, 8000);
    } catch (_) {
      if (status) status.textContent = 'Impossible de charger le widget CPX dans la page.';
      if (fallback) fallback.style.display = 'block';
    }
  }

  function boot() {
    mountCPX();
    document.addEventListener('click', event => {
      const target = event.target.closest('[data-nav="missions"], [data-filter="survey"]');
      if (target && !document.getElementById('fullscreen')) setTimeout(mountCPX, 80);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();
