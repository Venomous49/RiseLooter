/* RiseLooter Offerwall device filter v2 — preserve stable cards/missions, never rebuild Offerwall UI. */
(()=>{
'use strict';
if(window.__RL_OW_DEVICE_FILTER_V2__)return;window.__RL_OW_DEVICE_FILTER_V2__=true;
function dev(){const u=navigator.userAgent||'';if(/iPad|iPhone|iPod/i.test(u))return'ios';if(/Android/i.test(u))return'android';return'desktop'}
function txt(v){return String(v||'').toLowerCase()}
function cardCompatible(card,d){const h=txt(card.textContent);const ios=/iphone|ipad|\bios\b|app store/.test(h),and=/android|google play|play store/.test(h),pc=/windows|\bpc\b|desktop|macos|\bmac\b/.test(h);if(d==='ios'&&and&&!ios)return false;if(d==='android'&&ios&&!and)return false;if(d==='desktop'&&(ios||and)&&!pc)return false;return true}
function apply(){const box=document.getElementById('offerwallggContent');if(!box)return;const d=dev();box.querySelectorAll('.ow8-card').forEach(c=>{c.hidden=!cardCompatible(c,d)});const m=document.getElementById('offerwallActiveMissions');if(m)m.hidden=false;}
function boot(){[900,1800,3200].forEach(ms=>setTimeout(apply,ms));document.querySelector('[data-ow83]')?.addEventListener('click',()=>setTimeout(apply,600));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();