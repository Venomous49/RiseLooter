/* RiseLooter launch-state guard: zero-progress display + canonical username leaderboard. */
(() => {
  if (window.__RISELOOTER_LAUNCH_STATE_V1__) return;
  window.__RISELOOTER_LAUNCH_STATE_V1__ = true;

  const byId = id => document.getElementById(id);

  // Keep account creation/profile logic independent from the large legacy index.html.
  if (!document.querySelector('script[data-riselooter-signup-profile]')) {
    const signupScript = document.createElement('script');
    signupScript.src = '/signup-profile.js?v=signup-cpx-profile-v1-20260823';
    signupScript.defer = true;
    signupScript.dataset.riselooterSignupProfile = '1';
    document.head.appendChild(signupScript);
  }

  // Exact RiseLooter display conversion: 100 RL Coins = 1.00 EUR.
  function parseCoins(value){
    const normalized = String(value ?? '')
      .replace(/\u202f/g, '')
      .replace(/\s/g, '')
      .replace(',', '.')
      .replace(/[^0-9.-]/g, '');
    const amount = Number(normalized);
    return Number.isFinite(amount) ? Math.max(0, amount) : 0;
  }

  function formatEurosFromCoins(coins){
    return (Math.round(parseCoins(coins) * 100) / 10000).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' €';
  }

  function syncHeaderEuroBalance(){
    const coinsNode = byId('headerCoins');
    if (!coinsNode) return;
    const pill = coinsNode.closest('.coin-pill');
    if (!pill) return;

    pill.style.display = pill.style.display || 'inline-flex';
    pill.style.flexDirection = 'column';
    pill.style.alignItems = 'center';
    pill.style.lineHeight = '1.15';
    pill.style.whiteSpace = 'nowrap';

    // Force the original coin icon + amount + RL Coins label onto one visual line.
    let balanceLine = byId('headerBalanceLine');
    if (!balanceLine) {
      balanceLine = document.createElement('span');
      balanceLine.id = 'headerBalanceLine';
      balanceLine.style.cssText = 'display:inline-flex;align-items:center;gap:5px;white-space:nowrap';
      const euroExisting = byId('headerEuros');
      const nodes = Array.from(pill.childNodes).filter(node => node !== euroExisting);
      nodes.forEach(node => balanceLine.appendChild(node));
      pill.insertBefore(balanceLine, euroExisting || null);
    }

    // Keep the exact EUR value on the second line.
    let euroNode = byId('headerEuros');
    if (!euroNode) {
      euroNode = document.createElement('span');
      euroNode.id = 'headerEuros';
      euroNode.style.cssText = 'display:block;margin-top:3px;color:#c9d1d9;font-size:11px;font-weight:800;white-space:nowrap';
      pill.appendChild(euroNode);
    }
    euroNode.textContent = '= ' + formatEurosFromCoins(coinsNode.textContent);
  }

  function watchHeaderBalance(){
    const coinsNode = byId('headerCoins');
    if (!coinsNode) {
      setTimeout(watchHeaderBalance, 250);
      return;
    }
    syncHeaderEuroBalance();
    const observer = new MutationObserver(syncHeaderEuroBalance);
    observer.observe(coinsNode, { childList:true, characterData:true, subtree:true });
  }

  function applyZeroProgressDisplay(profile){
    if (Number(profile?.xp || 0) > 0) return;
    if (byId('levelBadge')) byId('levelBadge').textContent = 'NIVEAU 0';
    if (byId('currentLevel')) byId('currentLevel').textContent = '0';
    if (byId('totalXP')) byId('totalXP').textContent = '0 XP';
    if (byId('currentStreak')) byId('currentStreak').textContent = '0 jours';
    if (byId('bestStreak')) byId('bestStreak').textContent = '0 jours';
    if (byId('streakBig')) byId('streakBig').textContent = '0 jours';
    if (typeof renderStreakDays === 'function') renderStreakDays(0);
    if (typeof renderTrack === 'function') renderTrack(0);
  }

  if (typeof window.renderProfile === 'function') {
    const baseRenderProfile = window.renderProfile;
    window.renderProfile = function(profile){
      const safeProfile = profile && typeof profile === 'object' ? { ...profile } : profile;
      if (safeProfile && Number(safeProfile.xp || 0) <= 0) {
        safeProfile.level = 0;
        safeProfile.current_streak = 0;
        safeProfile.longest_streak = 0;
      }
      baseRenderProfile(safeProfile);
      applyZeroProgressDisplay(safeProfile);
      syncHeaderEuroBalance();
    };
  }

  window.loadLeaderboard = async function(){
    const root = byId('leaderboardContent');
    if (!root) return;

    let session = null;
    try { session = (await sb.auth.getSession())?.data?.session || null; } catch (_) {}
    if (!session?.user) {
      root.textContent = 'Connecte-toi pour consulter le classement.';
      return;
    }

    try {
      const response = await fetch('/api/leaderboard', {
        headers: { authorization: `Bearer ${session.access_token}` },
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('leaderboard unavailable');
      const payload = await response.json();
      const rows = Array.isArray(payload.rows) ? payload.rows : [];

      const header = `
        <div class="leader-row header">
          <div>RANG</div><div>LOOTER</div><div>NIVEAU</div><div>XP</div><div>SÉRIE</div>
        </div>`;

      if (!rows.length) {
        root.innerHTML = header + '<div style="padding:16px 8px;color:#99a4b0">Aucun Looter classé pour le moment. Le classement commencera dès qu’un utilisateur gagnera de l’XP.</div>';
        if (byId('myRank')) byId('myRank').textContent = '—';
        return;
      }

      root.innerHTML = header + rows.map(p => `
        <div class="leader-row">
          <div class="rank">#${Number(p.rank)}</div>
          <div>${typeof escapeHTML === 'function' ? escapeHTML(String(p.player_name || '')) : String(p.player_name || '')}</div>
          <div>Niv. ${Number(p.level || 0)}</div>
          <div>${Number(p.xp || 0).toLocaleString('fr-FR')} XP</div>
          <div>🔥 ${Number(p.current_streak || 0)} j</div>
        </div>`).join('');

      const mine = rows.find(x => x.user_id === session.user.id);
      if (byId('myRank')) byId('myRank').textContent = mine ? '# ' + mine.rank : '—';
    } catch (_) {
      root.textContent = 'Impossible de charger le classement pour le moment.';
    }
  };

  watchHeaderBalance();

  // Re-render once after the legacy bootstrap so the zero-progress state wins deterministically.
  setTimeout(() => {
    try { if (typeof refreshUser === 'function') refreshUser(false); } catch (_) {}
    syncHeaderEuroBalance();
  }, 700);
})();
