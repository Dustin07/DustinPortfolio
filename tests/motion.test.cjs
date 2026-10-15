const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../motion.js'),'utf8');
function fixture(reduce=false,support=true){
 const classes=new Set(),observed=[],removed=[],events={};let callback,disconnected=false;
 const target={classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}};
 const media={matches:reduce,addEventListener:(k,v)=>events[k]=v};
 const window=support?{IntersectionObserver:class{constructor(fn){callback=fn;}observe(t){observed.push(t);}unobserve(t){removed.push(t);}disconnect(){disconnected=true;}}}:{};
 vm.runInNewContext(source,{window,...window,document:{querySelectorAll:()=>[target]},matchMedia:()=>media});
 return {classes,observed,removed,events,media,target,disconnected:()=>disconnected,enter:v=>callback([{target,isIntersecting:v}])};
}
const a=fixture();assert.equal(a.classes.size,0);a.enter(false);assert.equal(a.classes.size,0);a.enter(true);assert.ok(a.classes.has('motion-enter'));assert.equal(a.removed[0],a.target);
a.media.matches=true;a.events.change();assert.equal(a.classes.size,0);assert.equal(a.disconnected(),true);
assert.equal(fixture(true).observed.length,0);assert.equal(fixture(false,false).observed.length,0);
const b=fixture();b.media.matches=true;b.enter(true);assert.equal(b.classes.size,0);
console.log('PASS: visible-only entrances, one-shot observation, reduced-motion changes, and no-observer fallback.');
