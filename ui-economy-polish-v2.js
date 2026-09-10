(() => {
  if (window.__RISELOOTER_UI_ECONOMY_POLISH_V2__) return;
  window.__RISELOOTER_UI_ECONOMY_POLISH_V2__ = true;

  const XP_PER_100_RL = 2000;
  const MIN_MISSION_XP = 20;

  function parseRl(text){
    const m = String(text || '').replace(/\u202f/g,' ').match(/([0-9]+(?:[\s.,][0-9]+)*)\s*RL/i);
    if (!m) return null;
    const raw = m[1].replace(/\s/g,'').replace(',','.');
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }

  function xpForRl(rl){
    if (!Number.isFinite(rl) || rl < 0) return MIN_MISSION_XP;
    return Math.max(MIN_MISSION_XP, Math.ceil(rl * XP_PER_100_RL / 100));
  }

  function syncMissionXp(){
    document.querySelectorAll('#gamesOfferwall .ow-card').forEach(card => {
      const reward = card.querySelector('.ow-reward');
      const xp = card.querySelector('.ow-xp-reward');
      const rl = parseRl(reward?.textContent);
      if (xp && rl !== null) xp.textContent = '✨ +' + xpForRl(rl).toLocaleString('fr-FR') + ' XP';
    });

    document.querySelectorAll('#gamesOfferwall .ow-mission-row').forEach(row => {
      const right = row.lastElementChild;
      if (!right) return;
      const rl = parseRl(right.textContent);
      if (rl === null) return;
      let span = right.querySelector('[data-xp-proportional]');
      if (!span) {
        span = document.createElement('span');
        span.dataset.xpProportional = '1';
        span.style.color = '#c575ff';
        right.append(document.createElement('br'), span);
      }
      span.textContent = '+' + xpForRl(rl).toLocaleString('fr-FR') + ' XP';
      right.querySelectorAll('span:not([data-xp-proportional])').forEach(el => {
        if (/XP/i.test(el.textContent || '')) el.style.display = 'none';
      });
    });
  }

  function makeHistoryCollapsible(panelId, listSelector, label){
    const panel = document.getElementById(panelId);
    if (!panel || panel.dataset.collapsibleReady === '1') return;
    const list = panel.querySelector(listSelector);
    if (!list) return;

    panel.dataset.collapsibleReady = '1';
    list.style.display = 'none';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn dark';
    button.style.cssText = 'margin-top:4px;padding:9px 13px;font-size:12px';
    button.textContent = 'Voir ' + label;
    button.setAttribute('aria-expanded','false');

    button.addEventListener('click', () => {
      const open = list.style.display !== 'none';
      list.style.display = open ? 'none' : 'grid';
      button.textContent = open ? 'Voir ' + label : 'Masquer ' + label;
      button.setAttribute('aria-expanded', open ? 'false' : 'true');
    });

    const head = panel.firstElementChild;
    if (head) head.insertAdjacentElement('afterend', button);
    else panel.prepend(button);
  }

  function syncXpRule(){
    const rule = document.querySelector('#xpHistoryPanel .xp-rule');
    if (rule) rule.textContent = 'XP proportionnel : 2 000 XP / 100 RL Coins (20 XP / RL Coin) • minimum 20 XP par mission • série : +15 XP/jour';
  }

  function apply(){
    syncMissionXp();
    syncXpRule();
    makeHistoryCollapsible('xpHistoryPanel','.xp-list','l’historique XP');
    makeHistoryCollapsible('rlHistoryPanel','.rlh-list','l’historique RL Coins');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, {once:true});
  else apply();

  const observer = new MutationObserver(() => apply());
  observer.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(apply,800);
  setTimeout(apply,2200);
  // 2026-09-10: deployment trigger after installing detailed history v2.
})();
