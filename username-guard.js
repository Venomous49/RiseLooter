(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const clean = v => String(v || '').trim();
  const valid = v => /^[A-Za-z0-9_-]{3,20}$/.test(clean(v));

  function patchExistingAccountSignup(){
    if(typeof sb==='undefined'||!sb?.auth?.signUp||sb.auth.signUp.__rlExistingAccountPatched)return;
    const original=sb.auth.signUp.bind(sb.auth);
    const wrapped=async credentials=>{
      const result=await original(credentials);
      const identities=result?.data?.user?.identities;
      if(!result?.error && Array.isArray(identities) && identities.length===0){
        return {
          data:{user:null,session:null},
          error:new Error('Un compte existe déjà avec cette adresse e-mail. Utilise « Se connecter » avec ton mot de passe.')
        };
      }
      return result;
    };
    wrapped.__rlExistingAccountPatched=true;
    sb.auth.signUp=wrapped;
  }

  async function available(username) {
    try {
      const { data, error } = await sb.rpc('username_available', { p_username: clean(username) });
      if (error) return { ok:false, unavailable:false, setup:true };
      return { ok:true, unavailable:data !== true, setup:false };
    } catch (_) {
      return { ok:false, unavailable:false, setup:true };
    }
  }

  async function claim(username) {
    try {
      const { data, error } = await sb.rpc('claim_username', { p_username: clean(username) });
      if (error) return { ok:false, error:'setup' };
      if (!data?.ok) return { ok:false, error:data?.error || 'failed' };
      const auth = await sb.auth.updateUser({ data:{ username:clean(username), player_name:clean(username) } });
      if (auth?.error) return { ok:false, error:'auth' };
      return { ok:true };
    } catch (_) {
      return { ok:false, error:'setup' };
    }
  }

  function installAvailabilityHint() {
    const input = $('usernameInput');
    if (!input || $('usernameAvailability')) return;
    const hint = document.createElement('div');
    hint.id = 'usernameAvailability';
    hint.style.cssText = 'font-size:11px;margin:-7px 0 12px;min-height:14px';
    input.insertAdjacentElement('afterend', hint);
    let seq = 0;
    input.addEventListener('input', () => {
      const mine = ++seq;
      const value = clean(input.value);
      if (!valid(value)) { hint.textContent=''; return; }
      hint.textContent = 'Vérification du pseudo…';
      setTimeout(async () => {
        if (mine !== seq) return;
        const r = await available(value);
        if (mine !== seq) return;
        if (r.setup) { hint.textContent=''; return; }
        hint.textContent = r.unavailable ? '❌ Ce pseudo est déjà pris.' : '✓ Pseudo disponible.';
        hint.style.color = r.unavailable ? '#ff6d72' : '#57df87';
      }, 250);
    });
  }

  function protectSignup() {
    const btn = $('signupAction');
    if (!btn || btn.dataset.uniqueUsernameGuard === '1') return;
    btn.dataset.uniqueUsernameGuard = '1';
    btn.addEventListener('click', async event => {
      if (btn.dataset.uniqueUsernameGuard === 'pass') {
        btn.dataset.uniqueUsernameGuard = '1';
        return;
      }
      const username = clean($('usernameInput')?.value);
      if (!valid(username)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      btn.disabled = true;
      const check = await available(username);
      btn.disabled = false;
      if (check.setup) {
        alert('La vérification d’unicité du pseudo est momentanément indisponible. Réessaie dans un instant.');
        return;
      }
      if (check.unavailable) {
        alert('Ce pseudo est déjà utilisé par un autre Looter. Choisis-en un autre.');
        $('usernameInput')?.focus();
        return;
      }
      btn.dataset.uniqueUsernameGuard = 'pass';
      btn.click();
    }, true);
  }

  function protectLegacyClaim() {
    document.addEventListener('click', async event => {
      const btn = event.target.closest('#rlSavePseudo');
      if (!btn) return;
      const input = $('rlLegacyPseudo');
      const username = clean(input?.value);
      if (!valid(username)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      btn.disabled = true;
      const result = await claim(username);
      btn.disabled = false;
      if (!result.ok) {
        if (result.error === 'username_taken') {
          alert('Ce pseudo est déjà utilisé par un autre Looter. Choisis-en un autre.');
          input?.focus();
        } else {
          alert('Impossible de vérifier/réserver ce pseudo pour le moment. Réessaie dans un instant.');
        }
        return;
      }
      $('rlPseudoOverlay')?.remove();
      try { if (typeof loadLeaderboard === 'function') await loadLeaderboard(); } catch (_) {}
    }, true);
  }

  function boot() {
    patchExistingAccountSignup();
    installAvailabilityHint();
    protectSignup();
    protectLegacyClaim();
    const observer = new MutationObserver(() => installAvailabilityHint());
    observer.observe(document.documentElement, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();