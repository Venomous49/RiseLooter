/* RiseLooter unified auth + durable signup profile + persistent sessions */
(() => {
  if (window.__RISELOOTER_AUTH_V2__) return;
  window.__RISELOOTER_AUTH_V2__ = true;

  const $ = id => document.getElementById(id);
  const KNOWN_KEY = 'riselooter_known_account_v1';
  const inputStyle = 'width:100%;padding:11px 12px;margin:6px 0 11px;border:1px solid #293b4b;border-radius:8px;background:#050a0f;color:#fff;box-sizing:border-box';
  let mode = 'signup';
  let usernameTimer = 0;

  const knownAccount = () => {
    try { return localStorage.getItem(KNOWN_KEY) === '1'; } catch (_) { return false; }
  };
  const markKnown = () => { try { localStorage.setItem(KNOWN_KEY, '1'); } catch (_) {} };

  function validUsername(v){ return /^[A-Za-z0-9_-]{3,20}$/.test(String(v||'').trim()); }
  function validProfile(p){
    return /^\d{4}-\d{2}-\d{2}$/.test(p.birth_date) && ['m','f'].includes(p.gender) && /^[A-Z]{2}$/.test(p.country_code) && p.zip_code.length >= 2;
  }

  function modal(){ return $('authModal'); }
  function box(){ return document.querySelector('#authModal .modal-box'); }

  function hideLegacyAuthUI(){
    const root = box();
    if (!root) return;
    Array.from(root.children).forEach(child => {
      if (child.id === 'riseAuthUnified') return;
      child.dataset.riseAuthLegacyHidden = '1';
      child.style.display = 'none';
    });
  }

  function ensureUnifiedUI(){
    const root = box();
    if (!root) return null;
    hideLegacyAuthUI();
    let wrap = $('riseAuthUnified');
    if (wrap) return wrap;

    wrap = document.createElement('div');
    wrap.id = 'riseAuthUnified';
    wrap.style.cssText = 'display:block;position:relative;padding:4px 0';
    wrap.innerHTML = `
      <button type="button" id="riseAuthClose" aria-label="Fermer" style="position:absolute;right:-4px;top:-8px;border:0;background:transparent;color:#99a4b0;font-size:24px;line-height:1;cursor:pointer">×</button>
      <h2 id="riseAuthTitle" style="margin:0 34px 6px 0">Créer ton compte</h2>
      <div id="riseAuthSubtitle" class="muted" style="font-size:13px;margin-bottom:14px">Crée ton profil RiseLooter une seule fois.</div>

      <label for="riseAuthEmail">E-mail</label>
      <input id="riseAuthEmail" type="email" autocomplete="email" inputmode="email" style="${inputStyle}" placeholder="ton@email.fr">

      <label for="riseAuthPassword">Mot de passe</label>
      <input id="riseAuthPassword" type="password" autocomplete="new-password" style="${inputStyle}" placeholder="Ton mot de passe">

      <div id="riseSignupFields">
        <label for="riseAuthUsername">Pseudo RiseLooter</label>
        <input id="riseAuthUsername" maxlength="20" autocomplete="nickname" style="${inputStyle}" placeholder="3 à 20 caractères">
        <div id="riseUsernameStatus" class="muted" style="font-size:12px;margin:-6px 0 11px">Ce pseudo sera affiché dans le classement.</div>

        <div style="font-weight:900;color:#c978ff;margin:10px 0 4px">Profil sondages</div>
        <div class="muted" style="font-size:12px;margin-bottom:8px">Ces informations servent à personnaliser les sondages proposés.</div>

        <label for="riseAuthBirth">Date de naissance</label>
        <input id="riseAuthBirth" type="date" style="${inputStyle}">

        <label for="riseAuthGender">Sexe pour le ciblage des sondages</label>
        <select id="riseAuthGender" style="${inputStyle}">
          <option value="">Choisir</option><option value="m">Homme</option><option value="f">Femme</option>
        </select>

        <label for="riseAuthCountry">Pays de résidence</label>
        <select id="riseAuthCountry" style="${inputStyle}"><option value="FR">France</option></select>

        <label for="riseAuthZip">Code postal</label>
        <input id="riseAuthZip" maxlength="12" autocomplete="postal-code" inputmode="numeric" style="${inputStyle}" placeholder="Ex. 49330">
      </div>

      <button type="button" id="riseAuthPrimary" class="btn" style="width:100%;margin-top:4px">Créer mon compte</button>
      <button type="button" id="riseAuthSwitch" style="display:block;margin:12px auto 0;border:0;background:transparent;color:#bd7dff;cursor:pointer;font-size:12px;font-weight:800">J’ai déjà un compte sur un autre appareil</button>
      <div id="riseAuthStatus" class="muted" style="font-size:12px;margin-top:10px;min-height:16px;text-align:center"></div>
    `;
    root.appendChild(wrap);

    $('riseAuthClose')?.addEventListener('click', () => modal()?.classList.remove('show'));
    $('riseAuthSwitch')?.addEventListener('click', () => setMode(mode === 'signup' ? 'login' : 'signup'));
    $('riseAuthPrimary')?.addEventListener('click', submitAuth);
    $('riseAuthPassword')?.addEventListener('keydown', e => { if (e.key === 'Enter' && mode === 'login') submitAuth(); });
    $('riseAuthUsername')?.addEventListener('input', checkUsernameDelayed);
    return wrap;
  }

  function setMode(next){
    mode = next === 'login' ? 'login' : 'signup';
    ensureUnifiedUI();
    const signupFields = $('riseSignupFields');
    const title = $('riseAuthTitle');
    const subtitle = $('riseAuthSubtitle');
    const primary = $('riseAuthPrimary');
    const switcher = $('riseAuthSwitch');
    const password = $('riseAuthPassword');
    const status = $('riseAuthStatus');
    if (status) status.textContent = '';

    if (mode === 'login') {
      if (signupFields) signupFields.style.display = 'none';
      if (title) title.textContent = 'Se connecter';
      if (subtitle) subtitle.textContent = 'Entre simplement ton e-mail et ton mot de passe.';
      if (primary) primary.textContent = 'Se connecter';
      if (switcher) switcher.textContent = 'Nouveau sur RiseLooter ? Créer un compte';
      if (password) password.autocomplete = 'current-password';
    } else {
      if (signupFields) signupFields.style.display = 'block';
      if (title) title.textContent = 'Créer ton compte';
      if (subtitle) subtitle.textContent = 'Crée ton profil RiseLooter une seule fois.';
      if (primary) primary.textContent = 'Créer mon compte';
      if (switcher) switcher.textContent = 'J’ai déjà un compte sur un autre appareil';
      if (password) password.autocomplete = 'new-password';
    }
    updateHeaderAuthLabel();
  }

  function updateHeaderAuthLabel(session){
    if (session?.user) return;
    const wanted = knownAccount() || mode === 'login' ? 'Se connecter' : 'Créer un compte';
    document.querySelectorAll('header button, header a, .header-right button, .header-right a').forEach(el => {
      const t = String(el.textContent || '').trim().toLowerCase();
      if (t.includes('créer un compte') || t.includes('creer un compte') || t === 'se connecter' || t === 'connexion') {
        el.textContent = wanted;
        if (!el.dataset.riseAuthModeBound) {
          el.dataset.riseAuthModeBound = '1';
          el.addEventListener('click', () => setMode(knownAccount() ? 'login' : mode));
        }
      }
    });
  }

  function profileValues(){
    return {
      birth_date:String($('riseAuthBirth')?.value||''),
      gender:String($('riseAuthGender')?.value||''),
      country_code:String($('riseAuthCountry')?.value||'FR').trim().toUpperCase(),
      zip_code:String($('riseAuthZip')?.value||'').trim()
    };
  }

  function setStatus(text, color=''){
    const n = $('riseAuthStatus');
    if (!n) return;
    n.textContent = text;
    n.style.color = color;
  }

  function checkUsernameDelayed(){
    clearTimeout(usernameTimer);
    const username = String($('riseAuthUsername')?.value||'').trim();
    const status = $('riseUsernameStatus');
    if (!status) return;
    if (!validUsername(username)) {
      status.textContent = '3 à 20 caractères : lettres, chiffres, _ ou -.';
      status.style.color = '';
      return;
    }
    usernameTimer = setTimeout(async () => {
      try {
        const r = await sb.rpc('username_available',{p_username:username});
        const available = r.error ? null : Boolean(r.data);
        status.textContent = available === true ? '✓ Pseudo disponible.' : available === false ? 'Ce pseudo est déjà utilisé.' : 'Vérification indisponible.';
        status.style.color = available === true ? '#57df87' : available === false ? '#ff6d72' : '';
      } catch (_) {
        status.textContent = 'Vérification indisponible.';
        status.style.color = '';
      }
    },250);
  }

  async function claimMetadataUsername(user){
    const username = String(user?.user_metadata?.username||'').trim();
    if (!username || !validUsername(username)) return;
    try { await sb.rpc('claim_username',{p_username:username}); } catch (_) {}
  }

  async function submitSignup(){
    const email = String($('riseAuthEmail')?.value||'').trim();
    const password = String($('riseAuthPassword')?.value||'');
    const username = String($('riseAuthUsername')?.value||'').trim();
    const profile = profileValues();
    if (!email || !password) return setStatus('Entre ton e-mail et ton mot de passe.', '#ff6d72');
    if (password.length < 6) return setStatus('Le mot de passe doit contenir au moins 6 caractères.', '#ff6d72');
    if (!validUsername(username)) return setStatus('Choisis un pseudo valide de 3 à 20 caractères.', '#ff6d72');
    if (!validProfile(profile)) return setStatus('Complète correctement ton profil sondages.', '#ff6d72');

    setStatus('Création du compte…');
    try {
      const av = await sb.rpc('username_available',{p_username:username});
      if (av.error) throw av.error;
      if (!av.data) return setStatus('Ce pseudo est déjà utilisé.', '#ff6d72');

      const {data,error} = await sb.auth.signUp({
        email,password,
        options:{data:{username,player_name:username,survey_profile:profile}}
      });
      if (error) throw error;
      markKnown();
      if (data?.session?.user) {
        await claimMetadataUsername(data.user);
        modal()?.classList.remove('show');
        if (typeof refreshUser === 'function') await refreshUser(true);
      } else {
        setMode('login');
        setStatus('Compte créé. Vérifie ton e-mail si une confirmation est demandée.', '#57df87');
      }
    } catch (e) {
      setStatus(e?.message || 'Impossible de créer le compte pour le moment.', '#ff6d72');
    }
  }

  async function submitLogin(){
    const email = String($('riseAuthEmail')?.value||'').trim();
    const password = String($('riseAuthPassword')?.value||'');
    if (!email || !password) return setStatus('Entre ton e-mail et ton mot de passe.', '#ff6d72');
    setStatus('Connexion…');
    try {
      const {data,error} = await sb.auth.signInWithPassword({email,password});
      if (error) throw error;
      if (!data?.session?.user) throw new Error('Connexion impossible.');
      markKnown();
      await claimMetadataUsername(data.user);
      modal()?.classList.remove('show');
      setStatus('');
      if (typeof refreshUser === 'function') await refreshUser(true);
    } catch (e) {
      setStatus('E-mail ou mot de passe incorrect.', '#ff6d72');
    }
  }

  async function submitAuth(){
    const btn = $('riseAuthPrimary');
    if (btn) btn.disabled = true;
    try { await (mode === 'login' ? submitLogin() : submitSignup()); }
    finally { if (btn) btn.disabled = false; }
  }

  async function restoreSession(){
    try {
      const {data,error} = await sb.auth.getSession();
      if (error) throw error;
      const session = data?.session || null;
      if (session?.user) {
        markKnown();
        await claimMetadataUsername(session.user);
        modal()?.classList.remove('show');
        updateHeaderAuthLabel(session);
        if (typeof refreshUser === 'function') await refreshUser(false);
        return true;
      }
    } catch (_) {}
    return false;
  }

  async function boot(){
    let tries = 0;
    while ((typeof sb === 'undefined' || !sb?.auth) && tries++ < 80) await new Promise(r=>setTimeout(r,100));
    if (typeof sb === 'undefined' || !sb?.auth) return;

    ensureUnifiedUI();
    const restored = await restoreSession();
    if (!restored) setMode(knownAccount() ? 'login' : 'signup');

    try {
      sb.auth.onAuthStateChange((event,session) => {
        if (session?.user) {
          markKnown();
          setTimeout(()=>claimMetadataUsername(session.user),50);
          modal()?.classList.remove('show');
        } else if (event === 'SIGNED_OUT') {
          setMode('login');
        }
        setTimeout(()=>updateHeaderAuthLabel(session),30);
      });
    } catch (_) {}

    // Re-apply label after the legacy UI finishes its own startup render.
    setTimeout(()=>updateHeaderAuthLabel(),500);
    setTimeout(()=>updateHeaderAuthLabel(),1500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
