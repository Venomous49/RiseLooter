/* RiseLooter launch-state guard: zero-progress display + canonical username leaderboard. */
(() => {
  if (window.__RISELOOTER_LAUNCH_STATE_V1__) return;
  window.__RISELOOTER_LAUNCH_STATE_V1__ = true;

  const byId = id => document.getElementById(id);

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

  // Re-render once after the legacy bootstrap so the zero-progress state wins deterministically.
  setTimeout(() => {
    try { if (typeof refreshUser === 'function') refreshUser(false); } catch (_) {}
  }, 700);
})();
