/* RiseLooter detailed histories v2.1: collapsed by default, exact game, RL and XP cross-linked. One-shot only. */
(() => {
  'use strict';
  if (window.__RISELOOTER_HISTORY_DETAIL_V21__) return;
  window.__RISELOOTER_HISTORY_DETAIL_V21__ = true;

  const fmt=(n,max=2)=>Number(n||0).toLocaleString('fr-FR',{minimumFractionDigits:0,maximumFractionDigits:max});
  const date=v=>{try{return new Date(v).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});}catch(_){return ''}};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const offerFromText=s=>{const m=String(s||'').match(/Offre\s+([^•]+)$/i);return m?m[1].trim():'';};
  const txFromRlId=id=>String(id||'').replace(/^ow-rev-/,'').replace(/^ow-/,'');

  function installCss(){
    if(document.getElementById('rl-history-detail-v21-style'))return;
    const st=document.createElement('style');
    st.id='rl-history-detail-v21-style';
    st.textContent=`
      #xpHistoryPanel .xp-list,#rlHistoryPanel .rlh-list{display:none!important;grid-template-columns:1fr!important;gap:8px!important}
      #xpHistoryPanel.rl-history-open .xp-list,#rlHistoryPanel.rl-history-open .rlh-list{display:grid!important}
      .rl-history-toggle{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;margin:8px 0 10px;padding:11px 13px;border:1px solid #33495b;border-radius:11px;background:#0a1520;color:#fff;font:inherit;font-size:12px;font-weight:900;cursor:pointer}
      .rl-history-toggle .chev{color:#c575ff;font-size:18px;transition:transform .18s ease}
      .rl-history-open .rl-history-toggle .chev{transform:rotate(180deg)}
      .rlh-item,.xp-item{align-items:flex-start!important}
      .rl-history-game{font-size:13px;font-weight:950;color:#fff;line-height:1.3}
      .rl-history-desc{font-size:10px;color:#94a1ad;margin-top:3px;line-height:1.35}
      .rl-history-rewards{display:flex;flex-wrap:wrap;gap:7px;margin-top:7px}
      .rl-history-chip{display:inline-flex;align-items:center;padding:4px 7px;border-radius:999px;border:1px solid #2c4254;font-size:11px;font-weight:950;background:#09131c}
      .rl-history-chip.coins{color:#63e6a3}.rl-history-chip.xp{color:#c575ff}
      .rl-history-empty{font-size:12px;color:#94a1ad;padding:4px 0}
      @media(max-width:700px){.rl-history-toggle{padding:12px}.rl-history-game{font-size:12px}.rl-history-rewards{gap:5px}}
    `;
    document.head.appendChild(st);
  }

  function ensureToggle(panel,type){
    if(!panel)return;
    const cls=type==='xp'?'.xp-list':'.rlh-list';
    const list=panel.querySelector(cls); if(!list)return;
    let b=panel.querySelector('.rl-history-toggle');
    if(!b){
      b=document.createElement('button'); b.type='button'; b.className='rl-history-toggle'; b.setAttribute('aria-expanded','false');
      b.innerHTML=`<span>${type==='xp'?'Voir tout l’historique XP':'Voir tout l’historique des RL Coins'}</span><span class="chev">⌄</span>`;
      list.insertAdjacentElement('beforebegin',b);
      b.addEventListener('click',()=>{
        const open=panel.classList.toggle('rl-history-open');
        b.setAttribute('aria-expanded',open?'true':'false');
        b.querySelector('span:first-child').textContent=open
          ?(type==='xp'?'Masquer l’historique XP':'Masquer l’historique des RL Coins')
          :(type==='xp'?'Voir tout l’historique XP':'Voir tout l’historique des RL Coins');
      });
    }
    if(!panel.dataset.historyInit){panel.classList.remove('rl-history-open');panel.dataset.historyInit='1';}
  }

  async function session(){try{return (await sb.auth.getSession()).data.session||null}catch(_){return null}}

  async function missionMap(userId){
    const byNetwork=new Map(),byOffer=new Map();
    try{
      const {data}=await sb.from('offerwall_active_missions').select('offer_id,offer_name,last_network_offer_id,last_goal_id,requirements').eq('user_id',userId).limit(250);
      for(const m of data||[]){
        if(m.last_network_offer_id)byNetwork.set(String(m.last_network_offer_id),m);
        if(m.offer_id)byOffer.set(String(m.offer_id),m);
      }
    }catch(_){}
    return {byNetwork,byOffer};
  }

  function resolveGame(row,maps){
    const offer=row.offer_id||offerFromText(row.description)||'';
    const m=maps.byNetwork.get(String(offer))||maps.byOffer.get(String(offer));
    if(m?.offer_name)return m.offer_name;
    const t=String(row.title||'');
    if(t && !/^(Mission de jeu validée|Gain d[’']XP|Gain de RL Coins|Récompense annulée)$/i.test(t))return t;
    return offer?`Jeu / offre ${offer}`:(row.source_type==='daily_streak'?'Connexion quotidienne':'Récompense RiseLooter');
  }

  function renderRows(xpHistory,rlHistory,maps){
    const xpByTx=new Map();
    for(const x of xpHistory){if(x.source_id)xpByTx.set(String(x.source_id),Number(x.amount||0));}
    const rlByTx=new Map();
    for(const r of rlHistory){const tx=txFromRlId(r.id);if(tx)rlByTx.set(tx,Number(r.amount||0));}

    const xpList=document.querySelector('#xpHistoryPanel .xp-list');
    if(xpList){
      xpList.innerHTML='';
      if(!xpHistory.length)xpList.innerHTML='<div class="rl-history-empty">Tes prochains gains d’XP apparaîtront ici.</div>';
      for(const x of xpHistory){
        const game=resolveGame(x,maps), xp=Number(x.amount||0), rl=rlByTx.get(String(x.source_id||''))||Number(x.rl_amount||0)||0;
        const div=document.createElement('div');div.className='xp-item';
        div.innerHTML=`<div><div class="rl-history-game">${esc(game)}</div><div class="rl-history-desc">${esc(x.description||x.title||'Gain d’XP')} • ${esc(date(x.created_at))}</div><div class="rl-history-rewards"><span class="rl-history-chip xp">✨ ${xp>0?'+':''}${fmt(xp,0)} XP</span><span class="rl-history-chip coins">🪙 ${rl>0?'+':''}${fmt(rl)} RL Coins</span></div></div>`;
        xpList.appendChild(div);
      }
    }

    const rlList=document.querySelector('#rlHistoryPanel .rlh-list');
    if(rlList){
      rlList.innerHTML='';
      if(!rlHistory.length)rlList.innerHTML='<div class="rl-history-empty">Tes prochains gains de RL Coins apparaîtront ici.</div>';
      for(const r of rlHistory){
        const game=resolveGame(r,maps), rl=Number(r.amount||0), tx=txFromRlId(r.id), xp=xpByTx.get(tx)??Number(r.xp_amount||0)??0;
        const div=document.createElement('div');div.className='rlh-item';
        div.innerHTML=`<div><div class="rl-history-game">${esc(game)}</div><div class="rl-history-desc">${esc(r.description||r.title||'Gain de RL Coins')} • ${esc(date(r.created_at))}</div><div class="rl-history-rewards"><span class="rl-history-chip coins">🪙 ${rl>0?'+':''}${fmt(rl)} RL Coins</span><span class="rl-history-chip xp">✨ ${xp>0?'+':''}${fmt(xp,0)} XP</span></div></div>`;
        rlList.appendChild(div);
      }
    }
  }

  let started=false;
  async function refreshOnce(){
    if(started)return; started=true;
    installCss();
    const xpPanel=document.getElementById('xpHistoryPanel'),rlPanel=document.getElementById('rlHistoryPanel');
    ensureToggle(xpPanel,'xp');ensureToggle(rlPanel,'rl');
    const sess=await session();if(!sess?.user?.id)return;
    const headers={authorization:'Bearer '+sess.access_token};
    const [xpRes,rlRes,maps]=await Promise.all([
      fetch('/api/xp/history',{headers,cache:'no-store'}).then(r=>r.json()).catch(()=>({history:[]})),
      fetch('/api/rl/history',{headers,cache:'no-store'}).then(r=>r.json()).catch(()=>({history:[]})),
      missionMap(sess.user.id)
    ]);
    renderRows(Array.isArray(xpRes.history)?xpRes.history:[],Array.isArray(rlRes.history)?rlRes.history:[],maps);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refreshOnce,{once:true});else refreshOnce();
})();
