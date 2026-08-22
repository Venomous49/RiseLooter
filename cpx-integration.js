/* RiseLooter CPX Research integration — App 35504 */
(() => {
  const CPX_APP_ID = 35504;

  function loadLibrary() {
    if (document.querySelector('script[data-riselooter-cpx]')) return;
    const lib = document.createElement('script');
    lib.src = 'https://cdn.cpx-research.com/assets/js/script_tag_v2.0.js';
    lib.async = true;
    lib.dataset.riselooterCpx = '1';
    document.body.appendChild(lib);
  }

  async function mountCPX() {
    const missions = document.getElementById('missions');
    if (!missions || typeof sb === 'undefined') return;

    let user = null;
    try {
      const result = await sb.auth.getUser();
      user = result?.data?.user || null;
    } catch (_) {}

    if (!user) {
      missions.innerHTML = '<h2>▤ Sondages</h2><div class="section-subtitle">Connecte-toi pour accéder aux sondages rémunérés CPX Research.</div>';
      return;
    }

    missions.innerHTML = `
      <h2>▤ Sondages</h2>
      <div class="section-subtitle">Réponds aux sondages disponibles et gagne des récompenses RiseLooter.</div>
      <div id="cpx-status" class="muted" style="margin:0 0 12px">Chargement des sondages disponibles…</div>
      <div id="fullscreen" style="max-width:950px;margin:auto;min-height:260px"></div>`;

    const script1 = {
      div_id: 'fullscreen',
      theme_style: 1,
      order_by: 2,
      limit_surveys: 7
    };

    window.config = {
      general_config: {
        app_id: CPX_APP_ID,
        ext_user_id: String(user.id),
        email: user.email || '',
        username: (user.user_metadata && (user.user_metadata.username || user.user_metadata.full_name)) || '',
        secure_hash: '',
        subid_1: 'riselooter',
        subid_2: ''
      },
      style_config: {
        text_color: '#ffffff',
        survey_box: {
          topbar_background_color: '#8f3fff',
          box_background_color: '#08131c',
          rounded_borders: true,
          stars_filled: '#f5ad20'
        }
      },
      script_config: [script1],
      debug: false,
      useIFrame: true,
      iFramePosition: 1,
      functions: {
        no_surveys_available: () => {
          const el = document.getElementById('cpx-status');
          if (el) el.textContent = 'Aucun sondage disponible pour le moment. Reviens un peu plus tard.';
        }
      }
    };

    loadLibrary();
    const status = document.getElementById('cpx-status');
    if (status) status.textContent = 'Sondages CPX Research';
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
