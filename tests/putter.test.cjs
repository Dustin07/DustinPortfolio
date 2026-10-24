const assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const root = path.join(__dirname, '..'), source = fs.readFileSync(path.join(root, 'putter.js'), 'utf8');
function fixture(reduce = false) {
  const el = () => ({ style: {}, attrs: {}, events: {}, contains(target){return this===target||(this.children||[]).includes(target);}, setAttribute(k,v){this.attrs[k]=v;}, addEventListener(k,v){this.events[k]=v;} });
  const control=el(), buttons=Array.from({length:6},el), refs=Array.from({length:6},el), cutter=el(), stock=el();
  const fixture=el(), supports=el(), part=el(), ribs=el(), hole=el(), cleanup=el(), preparation=el(), label=el();
  const paths=[el(),el(),el()].map(p=>Object.assign(p,{getTotalLength:()=>100,getPointAtLength:n=>({x:n,y:n})}));
  const ambient={classList:{contains:()=>globalPause}}, classes=new Set(); let globalPause=false, callback, intersection, mutations=[], next=0;
  const demo={dataset:{},classList:{add:c=>classes.add(c)},querySelector:s=>({'.putter-toggle':control,'[data-cutter]':cutter,'[data-stock]':stock,'[data-fixture]':fixture,'[data-supports]':supports,'[data-part]':part,'[data-ribs]':ribs,'[data-hole]':hole,'[data-cleanup]':cleanup,'[data-preparation]':preparation,'[data-stage-label]':label}[s]),querySelectorAll:s=>({'.putter-stage':buttons,'.putter-reference':refs,'[data-cut-path]':paths}[s])};
  const doc={hidden:false,events:{},documentElement:{classList:{contains:()=>false}},querySelector:s=>s==='.putter-demo'?demo:ambient,addEventListener(k,v){this.events[k]=v;}};
  const media={matches:reduce,addEventListener(k,v){this.change=v;}};
  class IO{constructor(fn){intersection=fn;}observe(){}} class MO{constructor(fn){mutations.push(fn);}observe(){}}
  vm.runInNewContext(source,{document:doc,window:{IntersectionObserver:IO},IntersectionObserver:IO,MutationObserver:MO,matchMedia:()=>media,requestAnimationFrame:fn=>{callback=fn;return ++next;},cancelAnimationFrame:()=>{callback=null;}});
  return {control,buttons,refs,cutter,stock,paths,demo,media,doc,classes,supports,part,fixture,hole,label,geometry:[cutter,stock,fixture,supports,part,ribs,hole,cleanup,preparation,...paths],tick:t=>{const fn=callback;callback=null;if(fn)fn(t);},running:()=>!!callback,intersect:v=>intersection([{isIntersecting:v}]),globalPause:v=>{globalPause=v;mutations[0]();}};
}
let count=0; const test=(name,fn)=>{fn();count++;console.log('PASS '+name);};
test('static markup has genuine report references and a clear illustration qualifier',()=>{const h=fs.readFileSync(path.join(root,'projects/cnc-putter.html'),'utf8');assert.match(h,/not an NX simulation or exact toolpath playback/);for(const n of ['back-model','fixture','bottom-ipw','top-ipw'])assert.ok(fs.existsSync(path.join(root,'images/putter-'+n+'.png')));assert.match(h,/aria-labelledby="putter-title putter-description"/);assert.match(h,/planned, not verified production/);});
test('initial frame enhances accessible controls',()=>{const f=fixture();assert.equal(f.control.hidden,false);assert.equal(f.demo.dataset.step,'0');assert.equal(f.buttons[0].attrs['aria-pressed'],'true');assert.ok(f.running());});
test('frame-only movement does not rewrite stage labels, selection, or references',()=>{
  const f=fixture(),writes={label:0,selection:0,references:0,dashes:0};
  const watch=(object,key,counter)=>{let value=object[key];Object.defineProperty(object,key,{get:()=>value,set:next=>{value=next;writes[counter]++;},configurable:true});};
  watch(f.label,'textContent','label');
  f.refs.forEach(reference=>watch(reference,'hidden','references'));
  f.paths.forEach(p=>watch(p.style,'strokeDasharray','dashes'));
  f.buttons.forEach(button=>{const set=button.setAttribute;button.setAttribute=function(key,value){if(key==='aria-pressed')writes.selection++;set.call(this,key,value);};});
  f.tick(0);for(let n=1;n<=60;n++)f.tick(n*1000/60);
  assert.deepEqual(writes,{label:0,selection:0,references:0,dashes:0});
  for(let t=1100;t<=3100;t+=100)f.tick(t);
  assert.deepEqual(writes,{label:1,selection:6,references:6,dashes:0});
  assert.equal(f.label.textContent,'Secure the Workpiece');assert.equal(f.refs[1].hidden,false);assert.equal(f.buttons[1].attrs['aria-pressed'],'true');
});
test('local pause stops frame work and play restarts it',()=>{const f=fixture();f.control.events.click();assert.equal(f.running(),false);assert.equal(f.control.textContent,'Play Animation');f.control.events.click();assert.ok(f.running());});
test('selecting an operation pauses and reveals its original image',()=>{const f=fixture();f.buttons[2].events.click();assert.equal(f.demo.dataset.step,'2');assert.equal(f.refs[2].hidden,false);assert.equal(f.refs[0].hidden,true);assert.equal(f.running(),false);});
test('reduced motion is static while manual operation selection remains available',()=>{const f=fixture(true);assert.equal(f.running(),false);assert.equal(f.control.disabled,true);assert.equal(f.cutter.style.opacity,'0');f.buttons[1].events.click();assert.equal(f.demo.dataset.step,'1');});
test('tab and viewport visibility stop background work',()=>{const f=fixture();f.doc.hidden=true;f.doc.events.visibilitychange();assert.equal(f.running(),false);f.doc.hidden=false;f.doc.events.visibilitychange();assert.ok(f.running());f.intersect(false);assert.equal(f.running(),false);});
test('global motion pause is respected without overriding a local pause',()=>{const f=fixture();f.globalPause(true);assert.equal(f.running(),false);f.globalPause(false);assert.ok(f.running());f.control.events.click();f.globalPause(true);f.globalPause(false);assert.equal(f.running(),false);});
test('page pause disables playback with a useful explanation but preserves operation inspection',()=>{const f=fixture();f.globalPause(true);assert.equal(f.control.disabled,true);assert.match(f.control.title,/footer/);f.buttons[3].events.click();assert.equal(f.demo.dataset.step,'3');assert.equal(f.refs[3].hidden,false);f.globalPause(false);assert.equal(f.control.disabled,false);assert.equal(f.control.textContent,'Play Animation');assert.equal(f.running(),false);});
test('system reduced motion remains authoritative after the page pause is cleared',()=>{const f=fixture(true);f.globalPause(true);f.globalPause(false);assert.equal(f.control.disabled,true);assert.match(f.control.title,/reduced-motion/);});

test('a focused CAM reference stays present until keyboard inspection ends',()=>{const f=fixture();f.tick(0);f.tick(100);f.refs[0].events.focusin();assert.equal(f.running(),false);for(let t=200;t<=19000;t+=100)f.tick(t);assert.equal(f.demo.dataset.step,'0');assert.equal(f.refs[0].hidden,false);f.refs[0].events.focusout({relatedTarget:f.buttons[0]});assert.ok(f.running());f.tick(20000);f.tick(20100);assert.equal(f.demo.dataset.step,'0');for(let t=20200;t<=23000;t+=100)f.tick(t);assert.equal(f.demo.dataset.step,'1');});

test('moving focus inside the report references does not restart playback',()=>{const f=fixture();const child={};f.refs[1].children=[child];f.refs[0].events.focusin();f.refs[0].events.focusout({relatedTarget:child});assert.equal(f.running(),false);f.refs[1].events.focusout({relatedTarget:null});assert.ok(f.running());});

test('leaving report focus preserves local, page, and system pauses',()=>{for(const state of ['local','page','system']){const f=fixture(state==='system');f.refs[0].events.focusin();if(state==='local')f.control.events.click();if(state==='page')f.globalPause(true);f.refs[0].events.focusout({relatedTarget:f.control});assert.equal(f.running(),false);if(state==='local')assert.equal(f.control.textContent,'Play Animation');}});
test('sequence advances through all six stages then loops',()=>{const f=fixture();f.tick(0);for(let t=100;t<=18100;t+=100){f.tick(t);if(t%3000===100)assert.equal(f.demo.dataset.step,String(Math.floor(t/3000)%6));}assert.equal(f.demo.dataset.step,'0');});
test('supports stay attached through bottom and top machining',()=>{const f=fixture();for(const i of [2,3]){f.buttons[i].events.click();assert.equal(f.supports.style.opacity,'1');assert.equal(f.fixture.style.opacity,'1');}assert.equal(f.hole.style.opacity,'1');});
test('cleanup and finished stages detach supports without claiming manufactured evidence',()=>{const f=fixture();for(const i of [4,5]){f.buttons[i].events.click();assert.equal(f.supports.style.opacity,'0');assert.equal(f.fixture.style.opacity,'0');assert.equal(f.part.attrs.transform,'translate(18 0)');}assert.equal(f.label.textContent,'Deburr, Polish & Inspect');});
test('stock preparation does not display a finished part or a cutting tool',()=>{const f=fixture();assert.equal(f.stock.style.opacity,'1');assert.equal(f.part.style.opacity,'0');assert.equal(f.cutter.style.opacity,'0');});
test('held machining poses stop geometry writes and still advance on schedule',()=>{const f=fixture();f.tick(0);for(let t=100;t<=2500;t+=100)f.tick(t);let writes=0;for(const element of f.geometry){element.style=new Proxy(element.style,{set(target,key,value){writes++;target[key]=value;return true;}});const set=element.setAttribute;element.setAttribute=function(key,value){writes++;set.call(this,key,value);};}f.demo.dataset=new Proxy(f.demo.dataset,{set(target,key,value){writes++;target[key]=value;return true;}});for(let t=2600;t<=2900;t+=100)f.tick(t);assert.equal(writes,0);f.tick(3000);assert.ok(writes>0);assert.equal(f.demo.dataset.step,'1');assert.equal(f.buttons[1].attrs['aria-pressed'],'true');assert.equal(f.refs[1].hidden,false);});
test('reduced-motion changes refresh a held cutter without resuming a local pause',()=>{const f=fixture();f.buttons[2].events.click();assert.equal(f.cutter.style.opacity,'1');f.media.matches=true;f.media.change();assert.equal(f.cutter.style.opacity,'0');assert.equal(f.running(),false);f.media.matches=false;f.media.change();assert.equal(f.cutter.style.opacity,'1');assert.equal(f.control.disabled,false);assert.equal(f.control.textContent,'Play Animation');assert.equal(f.running(),false);});
console.log(`${count} putter illustration checks passed.`);
