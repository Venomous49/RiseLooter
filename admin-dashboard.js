(() => {
  'use strict';

  const fmtUsd = n => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'USD'}).format(Number(n||0));
  const fmtEur = n => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(Number(n||0));
  const fmtInt = n => new Intl.NumberFormat('fr-FR').format(Number(n||0));

  function findAccessToken() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || '';
        if (!key.includes('auth-token')) continue;
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const token = parsed?.access_token || parsed?.currentSession?.access_token || parsed?.session?.access_token;
        if (token) return token;
      }
    } catch (_) {}
    return null;
  }

  async function adminFetch(path) {
    const token = findAccessToken();
    if (!token) throw new Error('not-authenticated');
    const res = await fetch(path, { headers: { authorization: `Bearer ${token}` }, cache: 'no-store' });
    if (!res.ok) throw new Error(res.status === 403 ? 'not-admin' : `admin-${res.status}`);
    return res.json();
  }

  function mountButton() {
    if (document.getElementById('rlAdminButton')) return;
    const btn = document.createElement('button');
    btn.id = 'rlAdminButton';
    btn.type = 'button';
    btn.textContent = 'ADMINISTRATEUR';
    btn.style.cssText = 'display:none;position:fixed;right:18px;bottom:18px;z-index:2147483000;padding:12px 18px;border-radius:12px;border:1px solid rgba(255,255,255,.25);background:linear-gradient(135deg,#6d4aff,#9d67ff);color:#fff;font-weight:900;letter-spacing:.4px;box-shadow:0 10px 30px rgba(0,0,0,.35);cursor:pointer';
    btn.addEventListener('click', openDashboard);
    document.body.appendChild(btn);
    return btn;
  }

  async function probeAdmin() {
    const btn = mountButton();
    try {
      await adminFetch('/api/admin/summary');
      btn.style.display = 'block';
    } catch (_) {
      btn.style.display = 'none';
    }
  }

  async function openDashboard() {
    let data;
    try { data = await adminFetch('/api/admin/summary'); }
    catch (_) { alert('Accès administrateur indisponible.'); return; }

    const old = document.getElementById('rlAdminOverlay');
    if (old) old.remove();
    const overlay = document.createElement('div');
    overlay.id = 'rlAdminOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483640;background:rgba(3,5,14,.96);color:#fff;overflow:auto;font-family:inherit;padding:24px';
    const txRows = (data.recent_transactions||[]).map(t => `<tr><td>${escapeHtml(t.transaction_id)}</td><td>${escapeHtml(t.status)}</td><td>${fmtUsd(t.amount_usd)}</td><td>${fmtUsd(t.user_share_usd)}</td><td>${fmtUsd(t.publisher_share_usd)}</td><td>${fmtInt(t.reward_coins)}</td><td>${t.reversed?'Annulée':(t.credited?'Validée':'En attente')}</td></tr>`).join('');
    overlay.innerHTML = `
      <div style="max-width:1180px;margin:0 auto">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:22px"><div><div style="font-size:13px;color:#a99cff;font-weight:800">RISE LOOTER</div><h1 style="margin:4px 0 0;font-size:30px">Tableau de bord administrateur</h1></div><button id="rlAdminClose" style="background:#1b2030;color:#fff;border:1px solid #3a4054;border-radius:10px;padding:10px 14px;cursor:pointer">Fermer</button></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin-bottom:22px">
          ${card('Marge Rise Looter (30 %)',fmtUsd(data.publisher_balance_usd))}
          ${card('Revenus CPX validés',fmtUsd(data.validated_gross_usd))}
          ${card('Part utilisateurs (70 %)',fmtUsd(data.user_share_usd))}
          ${card('RL Coins détenus',fmtInt(data.user_rl_coins))}
          ${card('Équivalent utilisateurs',fmtEur(data.user_balance_eur))}
          ${card('Utilisateurs',fmtInt(data.users_count))}
        </div>
        <div style="background:#101521;border:1px solid #292f42;border-radius:16px;padding:16px;overflow:auto"><h2 style="margin:0 0 14px;font-size:19px">Dernières transactions CPX</h2><table style="width:100%;border-collapse:collapse;min-width:850px"><thead><tr style="text-align:left;color:#aaa"><th>Transaction</th><th>Statut</th><th>Brut</th><th>Utilisateur</th><th>Rise Looter</th><th>RL Coins</th><th>État</th></tr></thead><tbody>${txRows || '<tr><td colspan="7" style="padding:20px 0;color:#888">Aucune transaction pour le moment.</td></tr>'}</tbody></table></div>
      </div>`;
    overlay.querySelectorAll('td,th').forEach(el=>el.style.padding='10px 8px');
    document.body.appendChild(overlay);
    document.getElementById('rlAdminClose').onclick = () => overlay.remove();
  }

  function card(label,value){return `<div style="background:#101521;border:1px solid #292f42;border-radius:16px;padding:16px"><div style="font-size:12px;color:#9da4b8;font-weight:800;text-transform:uppercase">${label}</div><div style="font-size:27px;font-weight:900;margin-top:8px">${value}</div></div>`}
  function escapeHtml(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', probeAdmin);
  else probeAdmin();
  window.addEventListener('storage', () => setTimeout(probeAdmin, 100));
  setInterval(probeAdmin, 15000);
})();