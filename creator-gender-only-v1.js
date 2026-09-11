/* RiseLooter creator v1 — gender only; legacy skin/hair choices stay internal defaults. */
(()=>{
  'use strict';
  if(window.__RL_CREATOR_GENDER_ONLY_V1__)return;
  window.__RL_CREATOR_GENDER_ONLY_V1__=true;
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
    const genderTitle=document.querySelector('#genderChoices')?.closest('.creator-step')?.querySelector('.creator-step-title');
    if(genderTitle)genderTitle.innerHTML='<b>1.</b> CHOISIS TON PERSONNAGE';
    const save=document.getElementById('saveAvatar');
    if(save)save.innerHTML='VALIDER MON LOOTER &nbsp; →';
    const note=modal.querySelector('.creator-note');
    if(note)note.textContent='Ton apparence évolue automatiquement avec les paliers RiseLooter.';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  [250,800,1800].forEach(t=>setTimeout(apply,t));
})();