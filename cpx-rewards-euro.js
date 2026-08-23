(() => {
  if (window.__RISELOOTER_CPX_EURO_V2__) return;
  window.__RISELOOTER_CPX_EURO_V2__ = true;

  const euro = coins => (Number(coins || 0) / 100).toLocaleString('fr-FR', {
    style:'currency', currency:'EUR', minimumFractionDigits:2, maximumFractionDigits:2
  });
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num = v => Number.isFinite(Number(v)) ? Number(v) : 0;
  let tries = 0;

  function polishSurveySection(){
    const missions = document.getElementById('missions');
    if (!missions) return;
    const h2 = missions.querySelector(':scope > h2');
    if (h2) h2.textContent = '▤ Sondages';
    const subtitle = missions.querySelector(':scope > .section-subtitle');
    if (subtitle) subtitle.textContent = 'Les sondages les plus adaptés à ton profil sont proposés en priorité.';
    const filters = missions.querySelector(':scope > .filters');
    if (filters) filters.style.display = 'none';
    const legacyGrid = document.getElementById('missionGrid');
    if (legacyGrid) legacyGrid.style.display = 'none';

    let style = document.getElementById('riselooter-targeted-ui-fix');
    if (!style) {
      style = document.createElement('style');
      style.id = 'riselooter-targeted-ui-fix';
      style.textContent = '.next-evolution{width:205px!important;padding:11px!important}.next-evolution .shadow-character{height:128px!important;margin:7px auto!important}';
      document.head.appendChild(style);
    }
  }

  function metric(s){
    return {
      payout: Math.max(0, num(s.payout)),
      loi: Math.max(1, num(s.loi || s.length_of_interview || s.duration || 15)),
      conv: Math.max(0, num(s.conversion_rate || s.conversion || s.cr || s.rating || s.quality_score || 0))
    };
  }

  function rankSurveys(list){
    const rows = list.map((s,i)=>({s,i,m:metric(s)}));
    const maxPayout = Math.max(1, ...rows.map(x=>x.m.payout));
    const maxConv = Math.max(1, ...rows.map(x=>x.m.conv));
    rows.forEach(x=>{
      const payoutScore = x.m.payout / maxPayout;
      const convScore = x.m.conv > 0 ? x.m.conv / maxConv : 0.5;
      const timeScore = 1 / Math.max(1, Math.sqrt(x.m.loi));
      x.score = convScore * 0.50 + payoutScore * 0.38 + timeScore * 0.12;
    });
    return rows.sort((a,b)=>b.score-a.score || b.m.payout-a.m.payout || a.m.loi-b.m.loi).slice(0,10);
  }

  function showSurveyInsideRiseLooter(href){
    const frame = document.getElementById('cpx-v9-frame');
    const wrap = document.getElementById('cpx-v9-wrap');
    if (!frame || !wrap) {
      window.location.href = href;
      return;
    }
    frame.src = href;
    wrap.dataset.userOpenedSurvey = '1';
    wrap.style.display = 'block';
    wrap.style.marginTop = '14px';
    wrap.scrollIntoView({behavior:'smooth', block:'start'});
  }

  async function run(){
    polishSurveySection();
    const mount = document.getElementById('cpx-riselooter-mount-v9');
    if (!mount) { if (tries++ < 80) return setTimeout(run,250); return; }

    const mountTitle = mount.querySelector('div[style*="font-weight:900"][style*="font-size:20px"]');
    if (mountTitle) mountTitle.style.display = 'none';
    const open = document.getElementById('cpx-v9-open');
    if (open) open.style.display = 'none';

    let box = document.getElementById('cpx-euro-rewards');
    if (!box) {
      box = document.createElement('div');
      box.id = 'cpx-euro-rewards';
      box.style.cssText = 'margin:12px 0 14px';
      const wrap = document.getElementById('cpx-v9-wrap');
      mount.insertBefore(box, wrap || null);
    }

    let client = null;
    try { client = (typeof sb !== 'undefined' && sb?.auth) ? sb : null; } catch (_) {}
    if (!client) { if (tries++ < 80) return setTimeout(run,250); return; }

    let session = null;
    try { session = (await client.auth.getSession()).data.session; } catch (_) {}
    if (!session?.access_token) return;

    try {
      const r = await fetch('/api/cpx/surveys', {
        headers:{authorization:'Bearer '+session.access_token}, cache:'no-store'
      });
      if (!r.ok) return;
      const data = await r.json();
      const surveys = Array.isArray(data.surveys) ? data.surveys : [];
      if (!surveys.length) { box.innerHTML = ''; return; }

      const ranked = rankSurveys(surveys);
      box.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">' + ranked.map((x,idx)=>{
        const s = x.s, m = x.m;
        const href = String(s.href_new || s.href || '#');
        const quality = m.conv > 0 ? '<span style="color:#9fb0bd"> · réussite '+esc(String(Math.round(m.conv)))+'%</span>' : '';
        return '<button type="button" data-cpx-survey="'+esc(href)+'" style="text-align:left;display:block;width:100%;border:1px solid #25384a;border-radius:10px;padding:12px;background:#08131c;color:#fff;cursor:pointer">'+
          '<div style="font-size:12px;color:#99a4b0">Enquête '+(idx+1)+' · '+esc(m.loi)+' min'+quality+'</div>'+
          '<div style="margin-top:7px;color:#57df87;font-size:17px;font-weight:900">+'+m.payout.toLocaleString('fr-FR',{maximumFractionDigits:2})+' RL Coins</div>'+
          '<div style="margin-top:2px;color:#fff;font-size:13px;font-weight:800">= '+euro(m.payout)+'</div>'+
          '<div style="margin-top:9px;color:#bd7dff;font-size:12px;font-weight:850">Commencer le sondage →</div>'+
        '</button>';
      }).join('') + '</div>';

      box.querySelectorAll('[data-cpx-survey]').forEach(btn=>{
        btn.addEventListener('click',()=>showSurveyInsideRiseLooter(btn.getAttribute('data-cpx-survey')));
      });

      const wrap = document.getElementById('cpx-v9-wrap');
      if (wrap && !wrap.dataset.userOpenedSurvey) wrap.style.display = 'none';
    } catch (_) {
      // Existing CPX SurveyWall remains available as the fallback.
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
  setInterval(run,120000);
})();
