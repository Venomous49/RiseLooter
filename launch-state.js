/* RiseLooter launch-state guard: preserve database progress and keep essential UI reachable. */
(() => {
  if (window.__RISELOOTER_LAUNCH_STATE_V1__) return;
  window.__RISELOOTER_LAUNCH_STATE_V1__ = true;

  const byId = id => document.getElementById(id);

  if (!document.querySelector('script[data-riselooter-signup-profile]')) {
    const signupScript = document.createElement('script');
    signupScript.src = '/signup-profile.js?v=auth-v2-20260823';
    signupScript.defer = true;
    signupScript.dataset.riselooterSignupProfile = '1';
    document.head.appendChild(signupScript);
  }

  if (!document.querySelector('script[data-riselooter-economy-polish]')) {
    const economyScript = document.createElement('script');
    economyScript.src = '/ui-economy-polish-v2.js?v=20260910-20xp';
    economyScript.defer = true;
    economyScript.dataset.riselooterEconomyPolish = '1';
    document.head.appendChild(economyScript);
  }

  /* index.html historically hides the wallet under 680 px. Override only that
     mobile rule; do not rewrite the rest of the responsive layout. */
  const mobileStyle = document.createElement('style');
  mobileStyle.id = 'riselooter-essential-mobile-ui';
  mobileStyle.textContent = `
    @media (max-width:680px){
      header .header-right{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:8px!important;width:100%!important;align-items:stretch!important}
      header .header-right .coin-pill{display:inline-flex!important;visibility:visible!important;opacity:1!important;grid-column:1/-1!important;justify-self:stretch!important;justify-content:center!important;align-items:center!important;min-height:40px!important;width:100%!important;box-sizing:border-box!important}
      header .header-right .btn{min-width:0!important}
    }
  `;
  document.head.appendChild(mobileStyle);

  function parseCoins(value){
    const normalized = String(value ?? '').replace(/\u202f/g, '').replace(/\s/g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
    const amount = Number(normalized);
    return Number.isFinite(amount) ? Math.max(0, amount) : 0;
  }

  function formatEurosFromCoins(coins){
    return (Math.round(parseCoins(coins) * 100) / 10000).toLocaleString('fr-FR', {minimumFractionDigits:2,maximumFractionDigits:2}) + ' €';
  }

  function syncHeaderEuroBalance(){
    const coinsNode = byId('headerCoins');
    if (!coinsNode) return;
    const pill = coinsNode.closest('.coin-pill');
    if (!pill) return;

    let balanceLine = byId('headerBalanceLine');
    if (!balanceLine) {
      balanceLine = document.createElement('span');
      balanceLine.id = 'headerBalanceLine';
      balanceLine.style.cssText = 'display:inline-flex;align-items:center;gap:5px;white-space:nowrap';
      const euroExisting = byId('headerEuros');
      Array.from(pill.childNodes).filter(node => node !== euroExisting).forEach(node => balanceLine.appendChild(node));
      pill.insertBefore(balanceLine, euroExisting || null);
    }

    let euroNode = byId('headerEuros');
    if (!euroNode) {
      euroNode = document.createElement('span');
      euroNode.id = 'headerEuros';
      euroNode.style.cssText = 'display:block;margin-left:8px;color:#c9d1d9;font-size:11px;font-weight:800;white-space:nowrap';
      pill.appendChild(euroNode);
    }
    euroNode.textContent = '= ' + formatEurosFromCoins(coinsNode.textContent);
  }

  function watchHeaderBalance(){
    const coinsNode = byId('headerCoins');
    if (!coinsNode) return setTimeout(watchHeaderBalance,250);
    syncHeaderEuroBalance();
    new MutationObserver(syncHeaderEuroBalance).observe(coinsNode,{childList:true,characterData:true,subtree:true});
  }

  /* Never manufacture a level/XP value here. renderProfile/refreshUser receive
     the real profile from Supabase and remain the sole source for progression. */

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
      const response = await fetch('/api/leaderboard',{headers:{authorization:`Bearer ${session.access_token}`},cache:'no-store'});
      if (!response.ok) throw new Error('leaderboard unavailable');
      const payload = await response.json();
      const rows = Array.isArray(payload.rows) ? payload.rows : [];
      const header = `<div class="leader-row header"><div>RANG</div><div>LOOTER</div><div>NIVEAU</div><div>XP</div><div>SÉRIE</div></div>`;
      if (!rows.length) {
        root.innerHTML = header + '<div style="padding:16px 8px;color:#99a4b0">Aucun Looter classé pour le moment.</div>';
        if (byId('myRank')) byId('myRank').textContent = '—';
        return;
      }
      root.innerHTML = header + rows.map(p => `<div class="leader-row"><div class="rank">#${Number(p.rank)}</div><div>${typeof escapeHTML==='function'?escapeHTML(String(p.player_name||'')):String(p.player_name||'')}</div><div>Niv. ${Number(p.level||0)}</div><div>${Number(p.xp||0).toLocaleString('fr-FR')} XP</div><div>🔥 ${Number(p.current_streak||0)} j</div></div>`).join('');
      const mine = rows.find(x => x.user_id === session.user.id);
      if (byId('myRank')) byId('myRank').textContent = mine ? '# ' + mine.rank : '—';
    } catch (_) {
      root.textContent = 'Impossible de charger le classement pour le moment.';
    }
  };

  function ensureRewardedGames(){
    if (byId('gamesOfferwall')) return;
    /* If the production script did not build its section, retry it once with a
       fresh URL. This only runs when the games section is genuinely absent. */
    if (document.querySelector('script[data-riselooter-offerwall-recovery]')) return;
    try { window.__RISELOOTER_OFFERWALL_GG__ = false; } catch (_) {}
    const script = document.createElement('script');
    script.src = '/offerwallgg-integration.js?v=20260910-essential-recovery';
    script.defer = true;
    script.dataset.riselooterOfferwallRecovery = '1';
    document.body.appendChild(script);
  }

  function refreshRealProfile(){
    try { if (typeof refreshUser === 'function') refreshUser(false); } catch (_) {}
    setTimeout(syncHeaderEuroBalance,100);
  }

  watchHeaderBalance();
  setTimeout(refreshRealProfile,350);
  setTimeout(ensureRewardedGames,900);
  setTimeout(ensureRewardedGames,2200);
  window.addEventListener('pageshow',()=>{refreshRealProfile();setTimeout(ensureRewardedGames,300);});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){refreshRealProfile();setTimeout(ensureRewardedGames,300);}});
})();
