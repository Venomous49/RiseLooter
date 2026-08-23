(() => {
  if (window.__RISELOOTER_CPX_INLINE_V9__) return;
  window.__RISELOOTER_CPX_INLINE_V9__ = true;

  const APP_ID = 35504;
  let retry = 0;

  function getClient(){
    try { if (typeof sb !== 'undefined' && sb && sb.auth) return sb; } catch (_) {}
    return null;
  }

  function ensureMount(){
    const missions = document.getElementById('missions');
    if (!missions) return null;
    let mount = document.getElementById('cpx-riselooter-mount-v9');
    if (mount) return mount;
    mount = document.createElement('div');
    mount.id = 'cpx-riselooter-mount-v9';
    mount.style.cssText = 'margin-top:16px;padding-top:16px;border-top:1px solid #203141';
    mount.innerHTML = '<div style="font-weight:900;font-size:20px;margin-bottom:6px">Sondages CPX Research</div><div id="cpx-v9-status" class="muted" style="margin-bottom:12px">Chargement des sondages…</div><div id="cpx-v9-wrap" style="display:none;overflow:hidden;border:1px solid #25384a;border-radius:12px;background:#08131c"><iframe id="cpx-v9-frame" title="Sondages CPX Research" style="display:block;width:100%;height:2000px;border:0;background:#08131c" loading="eager" referrerpolicy="strict-origin-when-cross-origin"></iframe></div><div style="margin-top:10px"><a id="cpx-v9-open" class="btn dark" target="_blank" rel="noopener" style="display:none;font-size:13px">Ouvrir en plein écran</a></div>';
    missions.appendChild(mount);
    return mount;
  }

  async function run(){
    const mount = ensureMount();
    if (!mount) { if (retry++ < 60) setTimeout(run,250); return; }
    const status = document.getElementById('cpx-v9-status');
    const client = getClient();
    if (!client) { status.textContent = 'Connexion au profil RiseLooter…'; if (retry++ < 60) setTimeout(run,250); return; }

    let session = null;
    try { session = (await client.auth.getSession()).data.session; } catch (_) {}
    if (!session || !session.user) { status.textContent = 'Connecte-toi pour accéder aux sondages CPX.'; return; }

    const user = session.user;
    let cfg = {app_id:APP_ID,ext_user_id:String(user.id),secure_hash:''};
    try {
      const r = await fetch('/api/cpx/config',{headers:{authorization:'Bearer '+session.access_token},cache:'no-store'});
      if (r.ok) cfg = Object.assign(cfg, await r.json());
    } catch (_) {}

    const p = (user.user_metadata && user.user_metadata.survey_profile) || {};
    const u = new URL('https://offers.cpx-research.com/index.php');
    u.searchParams.set('app_id', String(cfg.app_id || APP_ID));
    u.searchParams.set('ext_user_id', String(cfg.ext_user_id || user.id));
    if (cfg.secure_hash) u.searchParams.set('secure_hash', String(cfg.secure_hash));
    if (user.email) u.searchParams.set('email', user.email);
    u.searchParams.set('subid_1','riselooter');
    u.searchParams.set('subid_2','inline-v9');

    const birth = String(p.birth_date || '');
    const m = birth.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      u.searchParams.set('main_info','true');
      u.searchParams.set('birthday_year',m[1]);
      u.searchParams.set('birthday_month',String(Number(m[2])));
      u.searchParams.set('birthday_day',String(Number(m[3])));
    }
    if (p.gender === 'm' || p.gender === 'f') u.searchParams.set('gender',p.gender);
    if (p.country_code) u.searchParams.set('user_country_code',String(p.country_code).toUpperCase());
    if (p.zip_code) u.searchParams.set('zip_code',String(p.zip_code));

    const url = u.toString();
    const frame = document.getElementById('cpx-v9-frame');
    const wrap = document.getElementById('cpx-v9-wrap');
    const open = document.getElementById('cpx-v9-open');
    frame.src = url;
    wrap.style.display = 'block';
    open.href = url;
    open.style.display = 'inline-block';
    status.textContent = 'Choisis une enquête directement ci-dessous.';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();
})();
