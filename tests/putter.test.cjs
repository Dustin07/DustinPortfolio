const assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const root = path.join(__dirname, '..'), source = fs.readFileSync(path.join(root, 'putter.js'), 'utf8');
function fixture(reduce = false) {
  const el = () => ({ style: {}, attrs: {}, events: {}, setAttribute(k,v){this.attrs[k]=v;}, addEventListener(k,v){this.events[k]=v;} });
  const control=el(), buttons=[el(),el(),el()], refs=[el(),el(),el()], cutter=el(), stock=el();
  const paths=[el(),el(),el()].map(p=>Object.assign(p,{getTotalLength:()=>100,getPointAtLength:n=>({x:n,y:n})}));
  const ambient={classList:{contains:()=>globalPause}}, classes=new Set(); let globalPause=false, callback, intersection, mutations=[], next=0;
  const demo={dataset:{},classList:{add:c=>classes.add(c)},querySelector:s=>({'.putter-toggle':control,'[data-cutter]':cutter,'[data-stock]':stock}[s]),querySelectorAll:s=>({'.putter-stage':buttons,'.putter-reference':refs,'[data-cut-path]':paths}[s])};
  const doc={hidden:false,events:{},documentElement:{classList:{contains:()=>false}},querySelector:s=>s==='.putter-demo'?demo:ambient,addEventListener(k,v){this.events[k]=v;}};
  const media={matches:reduce,addEventListener(k,v){this.change=v;}};
  class IO{constructor(fn){intersection=fn;}observe(){}} class MO{constructor(fn){mutations.push(fn);}observe(){}}
  vm.runInNewContext(source,{document:doc,window:{IntersectionObserver:IO},IntersectionObserver:IO,MutationObserver:MO,matchMedia:()=>media,requestAnimationFrame:fn=>{callback=fn;return ++next;},cancelAnimationFrame:()=>{callback=null;}});
  return {control,buttons,refs,cutter,stock,paths,demo,media,doc,classes,tick:t=>{const fn=callback;callback=null;if(fn)fn(t);},running:()=>!!callback,intersect:v=>intersection([{isIntersecting:v}]),globalPause:v=>{globalPause=v;mutations[0]();}};
}
let count=0; const test=(name,fn)=>{fn();count++;console.log('PASS '+name);};
test('static markup has genuine CAM references and a clear illustration qualifier',()=>{const h=fs.readFileSync(path.join(root,'projects/cnc-putter.html'),'utf8');assert.match(h,/not an NX simulation or exact toolpath playback/);for(const n of ['roughing','surface','hole'])assert.ok(fs.existsSync(path.join(root,'images/putter-'+n+'.png')));assert.match(h,/aria-labelledby="putter-title putter-description"/);});
test('initial frame enhances accessible controls',()=>{const f=fixture();assert.equal(f.control.hidden,false);assert.equal(f.demo.dataset.step,'0');assert.equal(f.buttons[0].attrs['aria-pressed'],'true');assert.ok(f.running());});
test('local pause stops frame work and play restarts it',()=>{const f=fixture();f.control.events.click();assert.equal(f.running(),false);assert.equal(f.control.textContent,'Play Animation');f.control.events.click();assert.ok(f.running());});
test('selecting an operation pauses and reveals its original image',()=>{const f=fixture();f.buttons[2].events.click();assert.equal(f.demo.dataset.step,'2');assert.equal(f.refs[2].hidden,false);assert.equal(f.refs[0].hidden,true);assert.equal(f.running(),false);});
test('reduced motion is static while manual operation selection remains available',()=>{const f=fixture(true);assert.equal(f.running(),false);assert.equal(f.control.disabled,true);assert.equal(f.cutter.style.opacity,'0');f.buttons[1].events.click();assert.equal(f.demo.dataset.step,'1');});
test('tab and viewport visibility stop background work',()=>{const f=fixture();f.doc.hidden=true;f.doc.events.visibilitychange();assert.equal(f.running(),false);f.doc.hidden=false;f.doc.events.visibilitychange();assert.ok(f.running());f.intersect(false);assert.equal(f.running(),false);});
test('global motion pause is respected without overriding a local pause',()=>{const f=fixture();f.globalPause(true);assert.equal(f.running(),false);f.globalPause(false);assert.ok(f.running());f.control.events.click();f.globalPause(true);f.globalPause(false);assert.equal(f.running(),false);});
test('sequence advances through three operations then loops',()=>{const f=fixture();f.tick(0);for(let t=100;t<=4100;t+=100)f.tick(t);assert.equal(f.demo.dataset.step,'1');for(let t=4200;t<=8100;t+=100)f.tick(t);assert.equal(f.demo.dataset.step,'2');for(let t=8200;t<=12100;t+=100)f.tick(t);assert.equal(f.demo.dataset.step,'0');});
console.log(`${count} putter illustration checks passed.`);
