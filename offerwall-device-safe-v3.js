/* RiseLooter offer guard v4 — additive only: filters incompatible devices + known ineligible offers. */
(()=>{
'use strict';
if(window.__RL_DEVICE_GUARD_V4__)return;window.__RL_DEVICE_GUARD_V4__=true;
const clean=v=>String(v||'').trim().toLowerCase();
/* These offers were verified by users to land on Offerwall.GG "You are not eligible for this offer" pages. Hide them until the provider catalogue makes them eligible again. */
const BLOCKED=new Set(['kes.gg','icebet','varok.gg','rust clash','clash.gg','gamehub']);
function blocked(o){return BLOCKED.has(clean(o?.name))}
function device(){const ua=navigator.userAgent||'';const p=navigator.platform||'';const touch=Number(navigator.maxTouchPoints||0);if(/android/i.test(ua))return'android';if(/iphone|ipad|ipod/i.test(ua)||(p==='MacIntel'&&touch>1))return'ios';return'desktop'}
function tags(o){const a=Array.isArray(o?.platforms)?o.platforms:[];return a.map(clean).filter(Boolean)}
function compatible(o,d){const p=tags(o);if(!p.length)return true;const s=p.join(' ');const hasAndroid=/android|google play|play store/.test(s);const hasIos=/ios|iphone|ipad|app store|apple/.test(s);const hasDesktop=/desktop|windows|pc|macos|mac|linux|web/.test(s);if(d==='android')return hasAndroid||(!hasIos&&!hasDesktop);if(d==='ios')return hasIos||(!hasAndroid&&!hasDesktop);return hasDesktop||(!hasAndroid&&!hasIos)}
async function session(){try{if(typeof sb!=='undefined'&&sb?.auth?.getSession)return(await sb.auth.getSession()).data.session||null}catch(_){}try{if(window.sb?.auth?.getSession)return(await window.sb.auth.getSession()).data.session||null}catch(_){}return null}
async function apply(){const box=document.getElementById('offerwallggContent');if(!box)return;const ses=await session();if(!ses?.access_token)return;try{const r=await fetch('/api/offerwallgg/offers',{headers:{authorization:'Bearer '+ses.access_token},cache:'no-store'});const d=await r.json();if(!r.ok||!d?.ok||!Array.isArray(d.offers))return;const byName=new Map(d.offers.map(o=>[clean(o.name),o]));const dev=device();box.querySelectorAll('.ow8-card').forEach((card,i)=>{const name=clean(card.querySelector('.ow8-title')?.textContent);const offer=byName.get(name)||d.offers[i];if(offer&&(blocked(offer)||!compatible(offer,dev)))card.hidden=true;});}catch(_){/* fail open: never break the games UI */}}
function schedule(){[0,250,900,1800,3200,5000].forEach(ms=>setTimeout(()=>apply(),ms))}
function boot(){schedule();document.addEventListener('click',e=>{if(e.target?.dataset?.ow83==='1')setTimeout(()=>apply(),350)});let tries=0;const hook=()=>{tries++;const fn=window.riselooterLoadOfferwall;if(typeof fn==='function'&&!fn.__deviceGuardV4){const wrapped=async(...a)=>{const r=await fn(...a);await apply();return r};wrapped.__deviceGuardV4=true;window.riselooterLoadOfferwall=wrapped;return}if(tries<8)setTimeout(hook,400)};hook()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();