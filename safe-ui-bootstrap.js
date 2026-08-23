(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const VERSION='base-hq-realesrgan-v2';
  const state={gender:'male'};
  let verifiedAdmin=false;
  const isOpen=()=>document.body.classList.contains('creator-test-active');

  async function sessionToken(){
    try{
      if(typeof sb==='undefined')return '';
      const result=await sb.auth.getSession();
      return result?.data?.session?.access_token||'';
    }catch(_){return '';}
  }

  async function checkAdmin(){
    const token=await sessionToken();
    if(!token){verifiedAdmin=false;return false;}
    try{
      const res=await fetch('/api/admin/summary',{headers:{authorization:`Bearer ${token}`},cache:'no-store'});
      verifiedAdmin=res.ok;
      return verifiedAdmin;
    }catch(_){verifiedAdmin=false;return false;}
  }

  async function ensureNewAccountBaseline(){
    if(typeof sb==='undefined')return;
    try{
      const userResult=await sb.auth.getUser();
      const user=userResult?.data?.user;
      if(!user?.id)return;

      const existing=await sb.from('profiles').select('id,xp,lootix_available').eq('id',user.id).maybeSingle();
      if(existing?.data){
        const patch={};
        if(existing.data.xp==null)patch.xp=0;
        if(existing.data.lootix_available==null)patch.lootix_available=0;
        if(Object.keys(patch).length)await sb.from('profiles').update(patch).eq('id',user.id);
        return;
      }

      // Only create a missing profile. Never reset an existing user's earned XP or RL Coins.
      await sb.from('profiles').insert({id:user.id,xp:0,lootix_available:0});
    }catch(_){
      // The database auth trigger may create the profile concurrently; defaults in the SQL schema remain authoritative.
    }
  }

  const fixedCharacter=()=>state.gender==='female'
    ? `/female-01-debutant.webp?v=${VERSION}`
    : `/01-debutant.webp?v=${VERSION}`;
  const syncGender=()=>{const r=$('genderChoices');if(r)r.querySelectorAll('.choice').forEach(b=>b.classList.toggle('selected',b.dataset.value===state.gender));};
  function installTestOnlyStyle(){
    if(document.getElementById('creator-gender-only-test-style'))return;
    const steps=document.querySelectorAll('#creatorModal .creator-step');
    steps.forEach((step,index)=>step.dataset.creatorTestStep=String(index+1));
    const style=document.createElement('style');
    style.id='creator-gender-only-test-style';
    style.textContent=`
      body.creator-test-active #creatorModal [data-creator-test-step="2"],
      body.creator-test-active #creatorModal [data-creator-test-step="3"],
      body.creator-test-active #creatorModal [data-creator-test-step="4"]{display:none!important}
      body.creator-test-active #creatorPreview{overflow:hidden!important}
      body.creator-test-active #creatorPreview .creator-fixed-preview{display:flex!important;align-items:center!important;justify-content:center!important}
      body.creator-test-active #creatorPreview .creator-fixed-preview>img{
        width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;
        object-fit:contain!important;object-position:center 56%!important;padding:12px 10px 4px!important;
        box-sizing:border-box!important;filter:none!important;opacity:1!important;transform:translateY(5px)!important;
        animation:none!important;image-rendering:auto!important;backface-visibility:hidden!important;
      }
    `;
    document.head.appendChild(style);
  }
  function updatePreview(){
    const p=$('creatorPreview');if(!p)return;
    p.innerHTML=`<div class="creator-fixed-preview" style="position:relative;width:100%;height:100%;overflow:hidden"><img src="${fixedCharacter()}" alt="Aperçu Looter" decoding="async" fetchpriority="high"><div class="creator-live-badge" style="z-index:2"><b>NIVEAU 1</b><strong>DÉBUTANT</strong></div></div>`;
  }
  function reset(){state.gender='male';syncGender();updatePreview();}
  async function open(e){
    if(e){e.preventDefault();e.stopImmediatePropagation();}
    if(!verifiedAdmin && !(await checkAdmin()))return;
    const m=$('creatorModal');if(!m)return;
    installTestOnlyStyle();document.body.classList.add('creator-test-active');m.classList.add('show');m.style.display='grid';reset();
  }
  function bindGender(){const r=$('genderChoices');if(!r)return;r.querySelectorAll('.choice').forEach(b=>b.addEventListener('click',e=>{if(!isOpen())return;e.preventDefault();e.stopImmediatePropagation();state.gender=b.dataset.value==='female'?'female':'male';syncGender();updatePreview();},true));}
  async function init(){
    installTestOnlyStyle();
    const b=$('creatorTestButton');
    if(b){b.style.display='none';b.addEventListener('click',open,true);}
    bindGender();
    const s=$('saveAvatar');if(s)s.addEventListener('click',e=>{if(!isOpen())return;e.preventDefault();e.stopImmediatePropagation();},true);
    await ensureNewAccountBaseline();
    const admin=await checkAdmin();
    if(b)b.style.display=admin?'':'none';
    if(admin && new URLSearchParams(location.search).get('creatorTest')==='1')open();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.addEventListener('focus',()=>{ensureNewAccountBaseline();checkAdmin().then(ok=>{const b=$('creatorTestButton');if(b)b.style.display=ok?'':'none';});});
})();