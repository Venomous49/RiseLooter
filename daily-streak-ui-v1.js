(()=>{
  if(window.__RL_DAILY_STREAK_UI_V1__) return;
  window.__RL_DAILY_STREAK_UI_V1__=true;

  const rewards=[25,50,100,150,200,200,200];

  function apply(){
    const challenges=document.getElementById('challenges');
    if(challenges) challenges.remove();

    const dayWraps=[...document.querySelectorAll('.days .day-wrap')];
    dayWraps.forEach((wrap,i)=>{
      let reward=wrap.querySelector('.rl-streak-xp');
      if(!reward){
        reward=document.createElement('div');
        reward.className='rl-streak-xp';
        wrap.appendChild(reward);
      }
      reward.textContent=`+${rewards[Math.min(i,rewards.length-1)]} XP`;
    });
  }

  const style=document.createElement('style');
  style.textContent='.rl-streak-xp{margin-top:6px;font-size:11px;font-weight:900;color:#a751ff;white-space:nowrap}';
  document.head.appendChild(style);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();
