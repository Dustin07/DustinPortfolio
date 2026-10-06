const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const path=require('node:path'),root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'tensile.js'),'utf8');
function fixture(reduced=false,observer=true){
  const classes=new Set(),attrs={},events={},docEvents={},mediaEvents={};
  const control={hidden:true,setAttribute:(k,v)=>attrs[k]=v,addEventListener:(k,v)=>events[k]=v};
  const demo={querySelector:()=>control,classList:{add:k=>classes.add(k),toggle:(k,v)=>v?classes.add(k):classes.delete(k)}};
  const media={matches:reduced,addEventListener:(k,v)=>mediaEvents[k]=v};
  const document={hidden:false,querySelector:()=>demo,addEventListener:(k,v)=>docEvents[k]=v};
  let observed;
  const window=observer?{IntersectionObserver:class{constructor(fn){observed=fn;}observe(){}}}:{};
  vm.runInNewContext(source,{document,window,matchMedia:()=>media,IntersectionObserver:window.IntersectionObserver});
  return {classes,attrs,events,docEvents,mediaEvents,document,media,control,intersect:value=>observed([{isIntersecting:value}])};
}
let total=0;const test=(name,fn)=>{fn();total++;console.log('PASS '+name);};
test('controls enhance a static fallback',()=>{const f=fixture();assert.equal(f.control.hidden,false);assert.ok(f.classes.has('is-enhanced'));assert.equal(f.attrs['aria-pressed'],'false');});
test('local pause and resume preserve the loop state',()=>{const f=fixture();f.events.click();assert.ok(f.classes.has('is-paused'));assert.equal(f.control.textContent,'Play Animation');f.events.click();assert.equal(f.classes.has('is-paused'),false);});
test('system reduced motion disables animation controls',()=>{const f=fixture(true);assert.ok(f.classes.has('is-still'));assert.ok(f.classes.has('is-paused'));assert.equal(f.control.disabled,true);});
test('motion preference changes apply immediately',()=>{const f=fixture();f.media.matches=true;f.mediaEvents.change();assert.ok(f.classes.has('is-still'));f.media.matches=false;f.mediaEvents.change();assert.equal(f.classes.has('is-still'),false);});
test('hidden tabs and offscreen figures pause work',()=>{const f=fixture();f.document.hidden=true;f.docEvents.visibilitychange();assert.ok(f.classes.has('is-paused'));f.document.hidden=false;f.docEvents.visibilitychange();assert.equal(f.classes.has('is-paused'),false);f.intersect(false);assert.ok(f.classes.has('is-paused'));f.intersect(true);assert.equal(f.classes.has('is-paused'),false);});
test('visibility changes cannot override a visitor pause',()=>{const f=fixture();f.events.click();f.intersect(false);f.intersect(true);assert.ok(f.classes.has('is-paused'));});
test('older observer support still allows pausing',()=>{const f=fixture(false,false);f.events.click();assert.ok(f.classes.has('is-paused'));});
test('loop is schematic, accessible, and isolated from the static figure viewer',()=>{const html=fs.readFileSync(path.join(root,'projects/rocket-structures.html'),'utf8');assert.match(html,/<figure class="tensile-demo"/);assert.match(html,/aria-labelledby="tensile-title tensile-description"/);assert.match(html,/not recorded footage/);assert.match(html,/class="tensile-toggle"[^>]* hidden/);});
test('CSS honors global pause, reduced motion, and print',()=>{const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');assert.match(css,/\.ambient-field\.is-paused ~ main \.tensile-motion/);assert.match(css,/@media\(prefers-reduced-motion:reduce\)\{\.tensile-demo \.tensile-motion\{animation:none!important/);assert.match(css,/@media print\{\.tensile-demo \.tensile-motion\{animation:none!important/);assert.match(css,/animation-duration:8s/);});
console.log(`${total} tensile animation checks passed.`);
