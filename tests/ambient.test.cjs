const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname,'../ambient.js'),'utf8');
function fixture(reduced=false) {
  const values={},attributes={},events={},mediaEvents={},classes=new Set(),frames=[];
  const field={style:{setProperty:(name,value)=>{values[name]=value;}},setAttribute:(name,value)=>{attributes[name]=value;},classList:{toggle:(name,on)=>{if(on)classes.add(name);else classes.delete(name);}}};
  const media={matches:reduced,addEventListener:(name,action)=>{mediaEvents[name]=action;}};
  const document={hidden:false,documentElement:{scrollHeight:2000},createElement:()=>field,body:{prepend:()=>{}},addEventListener:(name,action)=>{events[name]=action;}};
  const context={document,innerHeight:1000,scrollY:0,matchMedia:()=>media,requestAnimationFrame:action=>frames.push(action),addEventListener:(name,action)=>{events[name]=action;}};
  vm.runInNewContext(source,context);
  return {field,values,attributes,events,media,mediaEvents,classes,frames,context,flush:()=>{frames.splice(0).forEach(action=>action());}};
}
let total=0;function test(name,action){action();total++;console.log('PASS '+name);}
test('background is hidden from assistive technology',()=>{const f=fixture();assert.equal(f.attributes['aria-hidden'],'true');assert.equal(f.field.className,'ambient-field');});
test('scroll updates are frame-throttled',()=>{const f=fixture();f.context.scrollY=500;f.events.scroll();f.events.scroll();assert.equal(f.frames.length,1);f.flush();assert.equal(f.values['--flow-y'],'-27.5px');});
test('motion stays within bounded displacement',()=>{const f=fixture();for(const scroll of [-100,0,250,500,750,1000,100000]){f.context.scrollY=scroll;f.events.scroll();f.flush();assert.ok(Math.abs(parseFloat(f.values['--flow-x']))<=24);assert.ok(parseFloat(f.values['--flow-y'])>=-55);assert.ok(parseFloat(f.values['--flow-y'])<=0);}});
test('reduced motion removes scroll-linked movement',()=>{const f=fixture(true);f.context.scrollY=900;f.events.scroll();assert.equal(f.frames.length,0);assert.equal(parseFloat(f.values['--flow-x']),0);assert.equal(parseFloat(f.values['--flow-y']),0);});
test('motion preference changes apply immediately',()=>{const f=fixture();f.context.scrollY=500;f.events.scroll();f.flush();f.media.matches=true;f.mediaEvents.change();assert.equal(parseFloat(f.values['--flow-y']),0);});
test('hidden tabs pause animation and skip scroll work',()=>{const f=fixture();f.context.document.hidden=true;f.events.visibilitychange();assert.equal(f.classes.has('is-paused'),true);f.events.scroll();assert.equal(f.frames.length,0);});
test('visible tab resumes at its current position',()=>{const f=fixture();f.context.document.hidden=true;f.events.visibilitychange();f.context.scrollY=600;f.context.document.hidden=false;f.events.visibilitychange();assert.equal(f.classes.has('is-paused'),false);assert.equal(f.values['--flow-y'],'-33px');});
test('short pages do not produce invalid geometry values',()=>{const f=fixture();f.context.document.documentElement.scrollHeight=500;f.events.resize();f.flush();assert.equal(parseFloat(f.values['--flow-y']),0);});
test('decorative paths are smooth and non-crossing',()=>{
  const f=fixture();
  const paths=[...f.field.innerHTML.matchAll(/<path class="([^"]*)" d="([^"]+)"/g)].map(match=>({className:match[1],command:match[2],numbers:match[2].match(/-?\d+(?:\.\d+)?/g).map(Number)}));
  assert.equal(paths.length,12);assert.equal(paths.filter(p=>p.className==='flow-orange').length,1);assert.equal(paths.filter(p=>p.className==='flow-maize').length,1);
  paths.forEach(p=>{assert.equal(p.numbers.length,12);assert.match(p.command,/^M .* C .* S /);});
  const curve=(points,t)=>points.reduce((sum,p,i)=>sum+([1,3,3,1][i]*(1-t)**(3-i)*t**i)*p[1],0);
  for(let step=0;step<=100;step++){
    const t=step/100;const first=[],second=[];
    for(const p of paths){const n=p.numbers;const a=[[n[0],n[1]],[n[2],n[3]],[n[4],n[5]],[n[6],n[7]]];const reflected=[2*n[6]-n[4],2*n[7]-n[5]];const b=[a[3],reflected,[n[8],n[9]],[n[10],n[11]]];first.push(curve(a,t));second.push(curve(b,t));}
    for(let index=1;index<paths.length;index++){assert.ok(first[index]>first[index-1]);assert.ok(second[index]>second[index-1]);}
  }
});
console.log(`${total} ambient motion and geometry tests passed.`);
