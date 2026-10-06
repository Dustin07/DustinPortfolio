(() => {
  'use strict';
  const demo = document.querySelector('.carabiner-demo');
  if (!demo) return;
  const control = demo.querySelector('.carabiner-toggle');
  const buttons = [...demo.querySelectorAll('.carabiner-stage')];
  const references = [...demo.querySelectorAll('.carabiner-reference')];
  const body = demo.querySelector('[data-carabiner-body]');
  const spine = demo.querySelector('[data-carabiner-spine]');
  const removedTube = demo.querySelector('[data-removed-tube]');
  const removedSpine = demo.querySelector('[data-removed-spine]');
  const label = demo.querySelector('[data-design-label]');
  const metric = name => demo.querySelector(`[data-result="${name}"]`);
  const designs = [
    {name:'Standard',volume:1734.4,stress:349.82,deflection:1.63},
    {name:'Reduced Spine',volume:1627.8,stress:358.76,deflection:1.79},
    {name:'Whole Tube Reduced',volume:1251.5,stress:416.18,deflection:1.94}
  ];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ambient = document.querySelector('.ambient-field');
  let elapsed=0,last=null,frame=null,paused=false,visible=true,current=-1;
  const blocked=()=>paused||reduced.matches||document.hidden||!visible||ambient?.classList.contains('is-paused')||document.documentElement.classList.contains('figure-viewer-open');
  const render=()=>{
    const step=Math.floor(elapsed/4000)%3;
    const progress=Math.min(1,(elapsed%4000)/900);
    const ease=progress*progress*(3-2*progress);
    demo.dataset.step=String(step);
    body.setAttribute('stroke-width',String(step===2?42-10*ease:42));
    spine.setAttribute('stroke-width',String(42-14*ease));
    spine.style.opacity=step===1?'1':'0';
    removedSpine.style.opacity=step===1?String(.65*ease):'0';
    removedTube.style.opacity=step===2?String(.65*ease):'0';
    if(current===step)return;
    current=step;
    const d=designs[step];
    label.textContent=d.name;
    metric('volume').textContent=`${d.volume.toFixed(1)} mm³`;
    metric('stress').textContent=`${d.stress.toFixed(2)} MPa`;
    metric('deflection').textContent=`${d.deflection.toFixed(2)} mm`;
    metric('volume-change').textContent=step?`${((1-d.volume/designs[0].volume)*100).toFixed(1)}% less volume`:'Baseline';
    metric('stress-change').textContent=step?`${((d.stress/designs[0].stress-1)*100).toFixed(1)}% higher peak stress`:'Baseline';
    metric('deflection-change').textContent=step?`${((d.deflection/designs[0].deflection-1)*100).toFixed(1)}% more deflection`:'Baseline';
    buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===step)));
    references.forEach((reference,i)=>{reference.hidden=i!==step;});
  };
  const tick=time=>{
    frame=null;if(blocked()){last=null;return;}
    if(last!==null)elapsed=(elapsed+Math.min(time-last,100))%12000;
    last=time;render();frame=requestAnimationFrame(tick);
  };
  const sync=()=>{
    if(frame!==null)cancelAnimationFrame(frame);frame=null;last=null;
    control.textContent=paused?'Play Animation':'Pause Animation';control.disabled=reduced.matches;
    control.title=reduced.matches?'Animation is disabled by your reduced-motion preference. Select a design to inspect it.':'Select a design to pause and inspect it.';
    if(reduced.matches){elapsed=Math.floor(elapsed/4000)*4000+900;render();}
    if(!blocked())frame=requestAnimationFrame(tick);
  };
  control.hidden=false;
  control.addEventListener('click',()=>{paused=!paused;sync();});
  buttons.forEach((button,i)=>button.addEventListener('click',()=>{paused=true;elapsed=i*4000+900;render();sync();}));
  reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(demo);
  if(ambient)new MutationObserver(sync).observe(ambient,{attributes:true,attributeFilter:['class']});
  new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  demo.classList.add('is-enhanced');render();sync();
})();
