(() => {
  'use strict';
  const VERSION='approved-reference-v1';
  const SIL_VERSION='gender-silhouette-v1';
  const NAMES=['01-debutant','05-debrouillard','10-chasseur','15-hustler','20-pro','30-elite','40-cyber-looter','50-rise-looter'];
  const LEVELS=[1,5,10,15,20,30,40,50];
  const MALE_STAGE_ASSETS=NAMES.map(n=>`/${n}.webp?v=${VERSION}`);
  const FEMALE_STAGE_ASSETS=NAMES.map(n=>`/female-${n}.webp?v=${VERSION}`);
  const normalizedGender=value=>String(value||'male').toLowerCase()==='female'?'female':'male';
  const profileGender=profile=>normalizedGender(profile?.avatar_gender||window.currentProfile?.avatar_gender||'male');
  const assetsFor=profile=>profileGender(profile)==='female'?FEMALE_STAGE_ASSETS:MALE_STAGE_ASSETS;
  const fixedAssetPath=(profile,stage)=>assetsFor(profile)[Math.max(0,Math.min(Number(stage)||0,7))];
  const silhouetteFor=(gender,stage)=>`/silhouettes/${normalizedGender(gender)}/${NAMES[Math.max(0,Math.min(Number(stage)||0,7))]}.png?v=${SIL_VERSION}`;
  const legacySilhouette=stage=>`/silhouettes/${NAMES[Math.max(0,Math.min(Number(stage)||0,7))]}.png`;

  // The site no longer depends on old skin/hair folders for stage artwork.
  window.assetPath=fixedAssetPath;
  window.silhouettePath=stage=>silhouetteFor(profileGender(window.currentProfile),stage);

  const style=document.createElement('style');
  style.id='fixed-stage-home-art-style';
  style.textContent=`
    #home .hero #mainCharacter{display:block!important;visibility:visible!important;opacity:1!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;overflow:hidden!important;z-index:1!important}
    #home .hero #mainCharacter .character-scene-clean{display:block!important;visibility:visible!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;overflow:hidden!important}
    #home .hero #mainCharacter .scene-clean-image.stage-art-clean{display:block!important;visibility:visible!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;object-position:68% 54%!important;opacity:1!important;padding:6px 8px 4px!important;box-sizing:border-box!important;transform:none!important;filter:none!important;animation:none!important;image-rendering:auto!important}
    .evolution-real.stage-art-clean{display:block!important;visibility:visible!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;object-position:center 54%!important;opacity:1!important;padding:3px!important;box-sizing:border-box!important;transform:none!important;filter:none!important;animation:none!important;image-rendering:auto!important}
    .evolution-card.locked .evolution-real.stage-art-clean{filter:brightness(0)!important;opacity:.86!important}
    .evolution-card.locked .evolution-character,.shadow-character{background:#fff!important}
    .evolution-silhouette,.next-silhouette{object-fit:contain!important;object-position:center bottom!important;background:#fff!important;filter:none!important;opacity:1!important}
    #creatorPreview .creator-real-preview.rl-canonical-preview{object-fit:contain!important;object-position:center bottom!important;background:#03090d!important;padding:4px!important;box-sizing:border-box!important}
  `;
  document.head.appendChild(style);

  function stageFromLevel(level){
    let stage=0;
    LEVELS.forEach((n,i)=>{if(Number(level||1)>=n)stage=i;});
    return stage;
  }

  function mark(root=document){
    root.querySelectorAll?.('img').forEach(img=>{
      const src=img.getAttribute('src')||img.currentSrc||'';
      if([...MALE_STAGE_ASSETS,...FEMALE_STAGE_ASSETS].some(a=>src.includes(a.split('?')[0]))){
        img.classList.add('stage-art-clean');
        img.decoding='async';
      }
    });
  }

  function repairHome(){
    const holder=document.getElementById('mainCharacter');
    if(!holder)return;
    const profile=window.currentProfile||null;
    const stage=stageFromLevel(profile?.level||1);
    const wanted=fixedAssetPath(profile,stage);
    let img=holder.querySelector('img.scene-clean-image');
    if(!img){
      holder.innerHTML=`<div class="character-scene-clean"><img class="scene-clean-image stage-art-clean" src="${wanted}" alt="Looter" decoding="async"></div>`;
      return;
    }
    const current=img.getAttribute('src')||'';
    if(!current.includes(wanted.split('?')[0]))img.src=wanted;
    img.style.display='block';
    img.classList.add('stage-art-clean');
    holder.querySelectorAll('.character-missing').forEach(el=>el.style.display='none');
  }

  function repairSilhouettes(){
    const gender=profileGender(window.currentProfile);
    document.querySelectorAll('.evolution-card').forEach((card,i)=>{
      if(!card.classList.contains('locked'))return;
      const img=card.querySelector('img.evolution-silhouette, img.evolution-real, img.stage-art-clean');
      if(!img)return;
      const wanted=silhouetteFor(gender,i);
      if(!(img.getAttribute('src')||'').includes(wanted.split('?')[0]))img.src=wanted;
      img.classList.add('evolution-silhouette');
      img.dataset.rlSilhouetteStage=String(i);
      img.onerror=()=>{
        const fallback=legacySilhouette(i);
        if((img.getAttribute('src')||'').includes(fallback))return;
        img.onerror=null;
        img.src=fallback;
      };
    });
    const next=document.querySelector('#nextEvolutionShadow img.next-silhouette');
    if(next){
      const currentStage=stageFromLevel(window.currentProfile?.level||1);
      const nextStage=Math.min(7,currentStage+1);
      const wanted=silhouetteFor(gender,nextStage);
      if(!(next.getAttribute('src')||'').includes(wanted.split('?')[0]))next.src=wanted;
      next.onerror=()=>{
        const fallback=legacySilhouette(nextStage);
        if((next.getAttribute('src')||'').includes(fallback))return;
        next.onerror=null;
        next.src=fallback;
      };
    }
  }

  function selectedCreatorGender(){
    const selected=document.querySelector('#genderChoices .choice.selected');
    return normalizedGender(selected?.dataset?.value||'male');
  }

  function repairCreatorPreview(){
    const preview=document.getElementById('creatorPreview');
    if(!preview)return;
    const img=preview.querySelector('img.creator-real-preview');
    if(!img)return;
    const gender=selectedCreatorGender();
    const wanted=gender==='female'?FEMALE_STAGE_ASSETS[0]:MALE_STAGE_ASSETS[0];
    if(!(img.getAttribute('src')||'').includes(wanted.split('?')[0]))img.src=wanted;
    img.classList.add('rl-canonical-preview');
    img.dataset.fallback=wanted;
    img.dataset.triedFallback='0';
    img.style.display='block';
    const missing=preview.querySelector('.creator-asset-missing');
    if(missing)missing.style.display='none';
    const save=document.getElementById('saveAvatar');
    if(save)save.disabled=false;
  }

  function apply(){mark();repairHome();repairSilhouettes();repairCreatorPreview();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  let queued=false;
  new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','style','class']});
})();