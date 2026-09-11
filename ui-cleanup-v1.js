/* RiseLooter UI cleanup v1 — remove only the obsolete legacy Missions RiseLooter block. */
(()=>{
  'use strict';
  function apply(){
    const legacy=document.getElementById('missions');
    if(legacy) legacy.remove();
    document.querySelectorAll('[data-nav="missions"]').forEach(el=>el.remove());
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
})();
