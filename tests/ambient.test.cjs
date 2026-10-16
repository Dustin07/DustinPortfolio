const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname,'../ambient.js'),'utf8');
function fixture({reduced=false,saved=false,storageBlocked=false,footer=true}={}) {
 const classes=new Set(),pageClasses=new Set(),attrs={},events={},mediaEvents={};
 const field={setAttribute:(k,v)=>attrs[k]=v,classList:{toggle:(k,v)=>v?classes.add(k):classes.delete(k)}};
 const control={attrs:{},events:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,v){this.events[k]=v;}};
 const media={matches:reduced,addEventListener:(k,v)=>mediaEvents[k]=v};
 const document={hidden:false,documentElement:{classList:{toggle:(k,v)=>v?pageClasses.add(k):pageClasses.delete(k)}},body:{prepend(){}},querySelector:()=>footer?{append(){}}:null,createElement:k=>k==='button'?control:field,addEventListener:(k,v)=>events[k]=v};
 let stored=saved?'true':null;
 const context={document,matchMedia:()=>media,sessionStorage:{getItem(){if(storageBlocked)throw Error('blocked');return stored;},setItem(k,v){if(storageBlocked)throw Error('blocked');stored=v;}}};
 vm.runInNewContext(source,context);
 return {classes,pageClasses,attrs,control,media,document,events,mediaEvents,field,stored:()=>stored};
}
let total=0;function test(name,fn){fn();total++;console.log('PASS '+name);}
test('static background is hidden from assistive technology and contains no animated artwork',()=>{const f=fixture();assert.equal(f.attrs['aria-hidden'],'true');assert.equal(f.field.className,'ambient-field');assert.equal(f.field.innerHTML,undefined);});
test('motion control pauses and resumes page interactions',()=>{const f=fixture();assert.equal(f.pageClasses.has('motion-disabled'),false);f.control.events.click();assert.ok(f.classes.has('is-still'));assert.ok(f.pageClasses.has('motion-disabled'));assert.equal(f.control.attrs['aria-pressed'],'true');assert.equal(f.stored(),'true');f.control.events.click();assert.equal(f.classes.has('is-still'),false);assert.equal(f.pageClasses.has('motion-disabled'),false);});
test('pause preference survives navigation in the tab',()=>{const f=fixture({saved:true});assert.ok(f.classes.has('is-paused'));assert.equal(f.control.attrs['aria-pressed'],'true');});
test('system reduced motion takes priority over the control',()=>{const f=fixture({reduced:true});assert.equal(f.control.disabled,true);assert.ok(f.classes.has('is-still'));assert.ok(f.pageClasses.has('motion-disabled'));f.media.matches=false;f.mediaEvents.change();assert.equal(f.control.disabled,false);assert.equal(f.pageClasses.has('motion-disabled'),false);});
test('system preference changes preserve an existing manual pause',()=>{const f=fixture({saved:true});f.media.matches=true;f.mediaEvents.change();f.media.matches=false;f.mediaEvents.change();assert.ok(f.classes.has('is-still'));});
test('hidden tabs pause work without replacing the visitor preference',()=>{const f=fixture();f.document.hidden=true;f.events.visibilitychange();assert.ok(f.classes.has('is-paused'));assert.equal(f.pageClasses.has('motion-disabled'),false);f.document.hidden=false;f.events.visibilitychange();assert.equal(f.classes.has('is-paused'),false);});
test('blocked storage leaves the control usable',()=>{const f=fixture({storageBlocked:true});f.control.events.click();assert.ok(f.classes.has('is-still'));});
test('pages without a footer still honor system preferences',()=>{const f=fixture({footer:false,reduced:true});assert.ok(f.pageClasses.has('motion-disabled'));});
console.log(total+' site motion preference checks passed.');
