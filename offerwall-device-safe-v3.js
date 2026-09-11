/* RiseLooter offer guard v5 — strict device eligibility, additive and fail-safe. */
(()=>{
'use strict';
if(window.__RL_DEVICE_GUARD_V5__)return;window.__RL_DEVICE_GUARD_V5__=true;
const clean=v=>String(v||'').trim().toLowerCase();
const BLOCKED=new Set(['kes.gg','icebet','varok.gg','rust clash','clash.gg','gamehub']);
function blocked(o){return BLOCKED.has(clean(o?.name))}
function device(){const ua=navigator.userAgent||'';const p=navigator.platform||'';const touch=Number(navigator.maxTouchPoints||0);if(/android/i.test(ua))return'android';if(/iphone|ipad|ipod/i.test(ua)||(p==='MacIntel'&&touch>1))return'ios';return'desktop'}
function tags(o){const a=Array.isArray(o?.platforms)?o.platforms:[];return a.map(clean).filter(Boolean)}
function compatibility(o,d){const p=tags(o);if(!p.length)return false;const s=p.join(' ');const android=/android|google play|play store/.test(s);const ios=/\bios\b|iphone|ipad|app store|apple/.test(s);const desktop=/desktop|windows|\bpc\b|macos|\bmac\b|linux|\bweb\b|browser/.test(s);if(d==='android')return android;if(d==='ios')return ios;return desktop}
async function session(){try{if(typeof sb!=='undefined'&&sb?.auth?.getSession)return(await sb.auth.getSession()).data.session||null}catch(_){}try{if(window.sb?.auth?.getSession)return(await window.sb.auth.getSession()).data.session||null}catch(_){}return null}
async function offers(){const ses=await session();if(!ses?.access_token)return null;try{const r=await fetch('/api/offerwallgg/offers',{headers:{authorization:'Bearer '+ses.access_token},cache:'no-store'});const d=await r.json();return r.ok&&d?.ok&&Array.isArray(d.offers)?d.offers:null}catch(_){return null}}
function applyList(list){if(!Array.isArray(list))return;const box=document.getElementById('offerwallggContent');if(!box)return;const byName=new Map(list.map(o=>[clean(o.name),o])),dev=device();box.querySelectorAll('.ow8-card').forEach((card,i)=>{const name=clean(card.querySelector('.ow8-title')?.textContent),offer=byName.get(name)||list[i],ok=!!offer&&!blocked(offer)&&compatibility(offer,dev);card.hidden=!ok;card.dataset.rlDeviceEligible=ok?'1':'0';});}
async function apply(){const list=await offers();if(list)applyList(list)}
/* Last-line protection: even during a render race, an unverified/incompatible card cannot launch. */
document.addEventListener('click',e=>{const card=e.target?.closest?.('#offerwallggContent .ow8-card');if(!card)return;if(card.dataset.rlDeviceEligible!=='1'){e.preventDefault();e.stopImmediatePropagation();apply();}},true);
function schedule(){[0,150,450,900,1800,3200,5000].forEach(ms=>setTimeout(apply,ms))}
function boot(){schedule();document.addEventListener('click',e=>{if(e.target?.dataset?.ow83==='1')setTimeout(apply,150)});let tries=0;const hook=()=>{tries++;const fn=window.riselooterLoadOfferwall;if(typeof fn==='function'&&!fn.__deviceGuardV5){const wrapped=async(...a)=>{const r=await fn(...a);await apply();return r};wrapped.__deviceGuardV5=true;window.riselooterLoadOfferwall=wrapped;return}if(tries<8)setTimeout(hook,400)};hook()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();