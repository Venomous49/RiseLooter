(() => {
  if (window.__RISELOOTER_CPX_EURO_V3__) return;
  window.__RISELOOTER_CPX_EURO_V3__ = true;

  const euro = coins => (Number(coins || 0) / 100).toLocaleString('fr-FR', {
    style:'currency', currency:'EUR', minimumFractionDigits:2, maximumFractionDigits:2
  });
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num = v => Number.isFinite(Number(v)) ? Number(v) : 0;
  const validUrl = v => { try { const u = new URL(String(v || '')); return /^https?:$/.test(u.protocol) ? u.toString() : ''; } catch (_) { return ''; } };
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
    const rawConv = s.conversion_rate ?? s.conversion ?? s.cr ?? 0;
    return {
      payout: Math.max(0, num(s.payout)),
      loi: Math.max(1, num(s.loi || s.length_of_interview || s.duration || 15)),
      conv: Math.max(0, Math.min(100, num(rawConv)))
    };
  }

  function rankSurveys(list){
    // Stable, systematic priority: highest success rate first; for equal rates,
    // highest RL Coins payout first; then shortest survey as final tie-breaker.
    return list.map((s,i)=>({s,i,m:metric(s)}))
      .sort((a,b)=>b.m.conv-a.m.conv || b.m.payout-a.m.payout || a.m.loi-b.m.loi || a.i-b.i)
      .slice(0,10);
  }

  function ensureSurveyModal(){
    let modal = document.getElementById('cpx-survey-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'cpx-survey-modal';
    modal.style.cssText = 'display:none;position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.88);padding:18px;box-sizing:border-box';
    modal.innerHTML = '<div style="width:min(1180px,100%);height:calc(100vh - 36px);margin:0 auto;background:#071018;border:1px solid #30465a;border-radius:14px;overflow:hidden;display:flex;flex-direction:column"><div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid #263a4b"><strong>Sondage</strong><button type="button" id="cpx-survey-close" style="border:1px solid #42596e;background:#101923;color:#fff;border-radius:8px;padding:8px 13px;cursor:pointer;font-weight:800">Fermer</button></div><iframe id="cpx-survey-active-frame" title="Sondage" style="flex:1;width:100%;border:0;background:#fff" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>';
    document.body.appendChild(modal);
    const close = () => {
      const frame = document.getElementById('cpx-survey-active-frame');
      if (frame) frame.src = 'about:blank';
      modal.style.display = 'none';
      document.documentElement.style.overflow = '';
    };
    modal.querySelector('#cpx-survey-close').addEventListener('click', close);
    modal.addEventListener('click', e=>{ if(e.target===modal) close(); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape' && modal.style.display==='block') close(); });
    return modal;
  }

  function showSurveyInsideRiseLooter(href){
    const url = validUrl(href);
    if (!url) return false;
    const modal = ensureSurveyModal();
    const frame = document.getElementById('cpx-survey-active-frame');
    frame.src = url;
    modal.style.display = 'block';
    document.documentElement.style.overflow = 'hidden';
    return true;
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
        const href = validUrl(s.href_new) || validUrl(s.href);
        const disabled = !href;
        return '<button type="button" '+(href?'data-cpx-survey="'+esc(href)+'"':'disabled')+' style="text-align:left;display:block;width:100%;border:1px solid #25384a;border-radius:10px;padding:12px;background:#08131c;color:#fff;cursor:'+(disabled?'not-allowed':'pointer')+';opacity:'+(disabled?'.58':'1')+'">'+
          '<div style="font-size:12px;color:#99a4b0">Enquête '+(idx+1)+' · '+esc(m.loi)+' min · réussite '+esc(String(Math.round(m.conv)))+'%</div>'+
          '<div style="margin-top:7px;color:#57df87;font-size:17px;font-weight:900">+'+m.payout.toLocaleString('fr-FR',{maximumFractionDigits:2})+' RL Coins</div>'+
          '<div style="margin-top:2px;color:#fff;font-size:13px;font-weight:800">= '+euro(m.payout)+'</div>'+
          '<div style="margin-top:9px;color:#bd7dff;font-size:12px;font-weight:850">'+(disabled?'Sondage indisponible':'Commencer le sondage →')+'</div>'+
        '</button>';
      }).join('') + '</div>';

      box.querySelectorAll('[data-cpx-survey]').forEach(btn=>{
        btn.addEventListener('click',e=>{
          e.preventDefault();
          e.stopPropagation();
          showSurveyInsideRiseLooter(btn.getAttribute('data-cpx-survey'));
        });
      });

      const wrap = document.getElementById('cpx-v9-wrap');
      if (wrap) wrap.style.display = 'none';
    } catch (_) {
      // Existing CPX SurveyWall remains available as the fallback.
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
  setInterval(run,120000);
})();
