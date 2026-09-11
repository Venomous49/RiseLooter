/* RiseLooter creator v2 — gender only + durable avatar_gender persistence. */
(()=>{
  'use strict';
  if(window.__RL_CREATOR_GENDER_ONLY_V2__)return;
  window.__RL_CREATOR_GENDER_ONLY_V2__=true;
  const norm=v=>String(v||'').toLowerCase()==='female'?'female':'male';
  let selectedGender='male';

  function selected(){
    const choice=document.querySelector('#genderChoices .choice.selected');
    return norm(choice?.dataset?.value||selectedGender);
  }

  async function persistGender(){
    try{
      if(typeof sb==='undefined'||!sb?.auth?.getSession||!sb?.from)return false;
      const session=(await sb.auth.getSession())?.data?.session;
      if(!session?.user?.id)return false;
      const gender=selected();
      const {error}=await sb.from('profiles').update({avatar_gender:gender}).eq('id',session.user.id);
      if(error)return false;
      try{if(typeof currentProfile==='object'&&currentProfile)currentProfile.avatar_gender=gender}catch(_){}
      try{window.riselooterApplyFixedStageArt?.()}catch(_){}
      return true;
    }catch(_){return false;}
  }

  function bind(){
    const choices=document.getElementById('genderChoices');
    if(choices&&choices.dataset.rlGenderPersist!=='1'){
      choices.dataset.rlGenderPersist='1';
      choices.querySelectorAll('.choice').forEach(choice=>choice.addEventListener('click',()=>{
        selectedGender=norm(choice.dataset.value);
        choices.querySelectorAll('.choice').forEach(c=>c.classList.toggle('selected',c===choice));
        setTimeout(()=>{try{window.riselooterApplyFixedStageArt?.()}catch(_){}},0);
      }));
    }
    const save=document.getElementById('saveAvatar');
    if(save&&save.dataset.rlGenderPersist!=='1'){
      save.dataset.rlGenderPersist='1';
      save.addEventListener('click',()=>{
        /* Existing creator save remains authoritative for every other field. We only persist avatar_gender afterwards. */
        setTimeout(persistGender,350);
        setTimeout(persistGender,1200);
      });
    }
  }

  function apply(){
    const modal=document.getElementById('creatorModal');
    if(!modal)return;
    const skin=document.getElementById('skinChoices');
    const hairColor=document.getElementById('hairColorChoices');
    const hairStyle=document.getElementById('hairStyleChoices');
    [skin,hairColor,hairStyle].forEach(root=>{const step=root?.closest('.creator-step');if(step)step.style.display='none';});
    const title=modal.querySelector('.creator-heading');
    if(title)title.innerHTML='CHOISIS TON <em>LOOTER</em>';
    const lead=modal.querySelector('.creator-lead');
    if(lead)lead.textContent='Choisis simplement ton personnage de départ. Il évoluera automatiquement avec ton niveau.';
    const genderTitle=choicesTitle();
    if(genderTitle)genderTitle.innerHTML='<b>1.</b> CHOISIS TON PERSONNAGE';
    const save=document.getElementById('saveAvatar');
    if(save)save.innerHTML='VALIDER MON LOOTER &nbsp; →';
    const note=modal.querySelector('.creator-note');
    if(note)note.textContent='Ton apparence évolue automatiquement avec les paliers RiseLooter.';
    const active=document.querySelector('#genderChoices .choice.selected');
    if(active)selectedGender=norm(active.dataset.value);
    bind();
  }
  function choicesTitle(){return document.querySelector('#genderChoices')?.closest('.creator-step')?.querySelector('.creator-step-title')||null;}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  [250,800,1800].forEach(t=>setTimeout(apply,t));
})();