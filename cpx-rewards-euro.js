(() => {
  if (window.__RISELOOTER_CPX_EURO_V1__) return;
  window.__RISELOOTER_CPX_EURO_V1__ = true;
  const euro = coins => (Number(coins || 0) / 100).toLocaleString('fr-FR',{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:2});
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let tries=0;
  async function run(){
    const mount=document.getElementById('cpx-riselooter-mount-v9');
    if(!mount){ if(tries++<80) return setTimeout(run,250); return; }
    let box=document.getElementById('cpx-euro-rewards');
    if(!box){
      box=document.createElement('div'); box.id='cpx-euro-rewards';
      box.style.cssText='margin:12px 0 14px';
      const wrap=document.getElementById('cpx-v9-wrap');
      mount.insertBefore(box,wrap||null);
    }
    let client=null; try{client=(typeof sb!=='undefined'&&sb?.auth)?sb:null}catch(_){}
    if(!client){ if(tries++<80) return setTimeout(run,250); return; }
    let session=null; try{session=(await client.auth.getSession()).data.session}catch(_){}
    if(!session?.access_token) return;
    try{
      const r=await fetch('/api/cpx/surveys',{headers:{authorization:'Bearer '+session.access_token},cache:'no-store'});
      if(!r.ok) return;
      const data=await r.json(); const surveys=Array.isArray(data.surveys)?data.surveys:[];
      if(!surveys.length){ box.innerHTML=''; return; }
      box.innerHTML='<div style="font-weight:900;margin:0 0 9px">Récompenses disponibles</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:9px">'+surveys.map(s=>{
        const coins=Number(s.payout||0); const href=String(s.href_new||s.href||'#');
        return '<a href="'+esc(href)+'" target="_blank" rel="noopener" style="display:block;text-decoration:none;color:#fff;border:1px solid #25384a;border-radius:10px;padding:12px;background:#08131c"><div style="font-size:12px;color:#99a4b0">Enquête · '+esc(s.loi||'?')+' min</div><div style="margin-top:7px;color:#57df87;font-size:17px;font-weight:900">+'+coins.toLocaleString('fr-FR',{maximumFractionDigits:2})+' RL Coins</div><div style="margin-top:2px;color:#fff;font-size:13px;font-weight:800">= '+euro(coins)+'</div></a>';
      }).join('')+'</div>';
    }catch(_){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  setInterval(run,120000);
})();
