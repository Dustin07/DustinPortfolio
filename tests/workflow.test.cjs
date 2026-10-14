const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../workflow.js'),'utf8');
function fixture(reduce=false, observers=true) {
  const classes = new Set(), ambientClasses = new Set(), events={}, mediaEvents={};
  const control={events:{},attrs:{},addEventListener(k,v){this.events[k]=v;},setAttribute(k,v){this.attrs[k]=v;}};
  const steps=Array.from({length:3},()=>({style:{setProperty(){}}}));
  const figure={querySelectorAll:()=>steps,querySelector:()=>({append(){}}),classList:{add:k=>classes.add(k),toggle:(k,v)=>v?classes.add(k):classes.delete(k)}};
  const ambient={classList:{contains:k=>ambientClasses.has(k)}};
  const media={matches:reduce,addEventListener:(k,v)=>mediaEvents[k]=v};
  const document={hidden:false,querySelectorAll:()=>[figure],querySelector:()=>ambient,createElement:()=>control,addEventListener:(k,v)=>events[k]=v};
  let intersection,mutation;
  const window=observers?{IntersectionObserver:class{constructor(fn){intersection=fn;}observe(){}},MutationObserver:class{constructor(fn){mutation=fn;}observe(){}}}:{};
  vm.runInNewContext(source,{document,window,matchMedia:()=>media,...window});
  return {classes,control,media,document,events,mediaEvents,ambientClasses,intersect:v=>intersection([{target:figure,isIntersecting:v}]),mutate:()=>mutation()};
}
let n=0;function test(name,fn){fn();n++;console.log('PASS '+name);}
test('offscreen workflows are paused until visible',()=>{const f=fixture();assert.ok(f.classes.has('workflow-paused'));f.intersect(true);assert.ok(!f.classes.has('workflow-paused'));});
test('local pause survives leaving and returning to viewport',()=>{const f=fixture();f.intersect(true);f.control.events.click();f.intersect(false);f.intersect(true);assert.ok(f.classes.has('workflow-paused'));assert.equal(f.control.textContent,'Play Step Animation');f.control.events.click();assert.ok(!f.classes.has('workflow-paused'));});
test('system reduced motion disables automatic animation',()=>{const f=fixture(true);f.intersect(true);assert.ok(f.classes.has('workflow-still'));assert.equal(f.control.disabled,true);f.media.matches=false;f.mediaEvents.change();assert.ok(!f.classes.has('workflow-still'));});
test('site pause applies immediately and does not erase local pause',()=>{const f=fixture();f.intersect(true);f.control.events.click();f.ambientClasses.add('is-still');f.mutate();assert.ok(f.classes.has('workflow-still'));f.ambientClasses.clear();f.mutate();assert.ok(f.classes.has('workflow-paused'));});
test('hidden tabs pause and restore visible workflows',()=>{const f=fixture();f.intersect(true);f.document.hidden=true;f.events.visibilitychange();assert.ok(f.classes.has('workflow-paused'));f.document.hidden=false;f.events.visibilitychange();assert.ok(!f.classes.has('workflow-paused'));});
test('fallback remains controllable without observers',()=>{const f=fixture(false,false);assert.ok(!f.classes.has('workflow-paused'));f.control.events.click();assert.ok(f.classes.has('workflow-paused'));});
console.log(`${n} workflow animation checks passed.`);
