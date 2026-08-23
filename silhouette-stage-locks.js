(()=>{
  'use strict';
  const VERSION='silhouette-4k-v1';
  const NAMES=['01-debutant','05-debrouillard','10-chasseur','15-hustler','20-pro','30-elite','40-cyber-looter','50-rise-looter'];
  const gender=()=>String(window.currentProfile?.avatar_gender||'male').toLowerCase()==='female'?'female':'male';
  const silhouette=(g,i)=>`/silhouettes/${g}/${NAMES[i]}.png?v=${VERSION}`;
  const originalStageIndex=src=>NAMES.findIndex(n=>String(src||'').includes(n));
  function apply(root=document){
    const g=gender();
    root.querySelectorAll?.('.evolution-card.locked img.evolution-real, .evolution-card.locked img.stage-art-clean').forEach(img=>{
      let idx=Number(img.dataset.rlStageIndex);
      if(!Number.isInteger(idx)||idx<0||idx>7){idx=originalStageIndex(img.getAttribute('src')||img.currentSrc||'');}
      if(idx<0)return;
      img.dataset.rlStageIndex=String(idx);
      img.dataset.rlSilhouette='1';
      const wanted=silhouette(g,idx);
      if(!(img.getAttribute('src')||'').includes(wanted.split('?')[0])) img.src=wanted;
      img.style.filter='none';
      img.style.opacity='1';
    });
  }
  function restoreUnlocked(root=document){
    root.querySelectorAll?.('.evolution-card:not(.locked) img[data-rl-silhouette="1"]').forEach(img=>{
      const idx=Number(img.dataset.rlStageIndex);
      if(!Number.isInteger(idx)||idx<0||idx>7)return;
      const g=gender();
      img.src=g==='female'?`/female-${NAMES[idx]}.webp`:`/${NAMES[idx]}.webp`;
      delete img.dataset.rlSilhouette;
      img.style.filter='';img.style.opacity='';
    });
  }
  function sync(){restoreUnlocked();apply();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
  let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;sync();})}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','src']});
})();
