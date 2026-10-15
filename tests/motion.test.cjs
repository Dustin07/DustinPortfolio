const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../motion.js'),'utf8');
function fixture(reduce=false,support=true){
 const classes=new Set(),observed=[],removed=[],events={};let callback,mutation,disconnected=false,paused=false;
 const target={classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}};
 const media={matches:reduce,addEventListener:(k,v)=>events[k]=v};
 const window=support?{IntersectionObserver:class{constructor(fn){callback=fn;}observe(t){observed.push(t);}unobserve(t){removed.push(t);}disconnect(){disconnected=true;}},MutationObserver:class{constructor(fn){mutation=fn;}observe(){}}}:{};
 vm.runInNewContext(source,{window,...window,document:{hidden:false,documentElement:{classList:{contains:()=>paused}},querySelectorAll:()=>[target],addEventListener(){}},matchMedia:()=>media});
 return {classes,observed,removed,events,media,target,disconnected:()=>disconnected,pause:v=>{paused=v;mutation();},enter:v=>callback([{target,isIntersecting:v}])};
}
const a=fixture();assert.equal(a.classes.size,0);a.enter(false);assert.equal(a.classes.size,0);a.enter(true);assert.ok(a.classes.has('motion-enter'));assert.equal(a.removed[0],a.target);
a.media.matches=true;a.events.change();assert.equal(a.classes.size,0);assert.equal(a.disconnected(),true);
assert.equal(fixture(true).observed.length,0);assert.equal(fixture(false,false).observed.length,0);
const b=fixture();b.media.matches=true;b.enter(true);assert.equal(b.classes.size,0);
console.log('PASS: visible-only entrances, one-shot observation, reduced-motion changes, and no-observer fallback.');

function gridFixture(){
 const events={},frames=new Map(),animations=[],media={matches:false,addEventListener:(k,fn)=>events['media:'+k]=fn};let next=1,mutation;
 const rootClasses=new Set();
 const cards=[0,1,2].map(i=>({hidden:false,left:i*100,top:0,getBoundingClientRect(){return {left:this.left,top:this.top};},animate(keys,options){const a={keys,options,cancelled:false,cancel(){this.cancelled=true;},finished:new Promise(()=>{})};animations.push(a);return a;}}));
 const doc={hidden:false,documentElement:{classList:{contains:k=>rootClasses.has(k)}},querySelectorAll:s=>s==='.project-card'?cards:[],addEventListener:(k,fn)=>events[k]=fn};
 const win={IntersectionObserver:class{observe(){}disconnect(){}},MutationObserver:class{constructor(fn){mutation=fn;}observe(){}}};
 vm.runInNewContext(source,{document:doc,window:win,...win,matchMedia:()=>media,requestAnimationFrame:fn=>{const id=next++;frames.set(id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id)});
 return {cards,events,frames,animations,doc,media,rootClasses,mutate:()=>mutation(),flush(){const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn());}};
}
const g=gridFixture();g.events['portfolio:before-filter']();g.cards[0].hidden=true;g.cards[1].left=0;g.cards[2].left=100;g.events['portfolio:filtered']();assert.equal(g.animations.length,0);g.flush();assert.equal(g.animations.length,2);assert.equal(g.animations[0].keys[0].transform,'translate(100px,0px)');assert.equal(g.animations[0].options.duration,280);
g.events.focusin();assert.ok(g.animations.every(a=>a.cancelled));
g.events['portfolio:before-filter']();g.events['portfolio:filtered']();g.flush();assert.equal(g.animations.length,2);
g.events['portfolio:before-filter']();g.cards[0].hidden=false;g.events['portfolio:filtered']();g.flush();assert.equal(g.animations.at(-1).keys[0].opacity,.85);
g.rootClasses.add('motion-disabled');g.mutate();assert.ok(g.animations.every(a=>a.cancelled));g.events['portfolio:before-filter']();g.events['portfolio:filtered']();assert.equal(g.frames.size,0);
g.rootClasses.clear();g.events['portfolio:before-filter']();g.cards[2].left=200;g.events['portfolio:filtered']();g.media.matches=true;g.events['media:change']();g.flush();assert.equal(g.frames.size,0);
const hidden=gridFixture();hidden.events['portfolio:before-filter']();hidden.cards[0].left=100;hidden.events['portfolio:filtered']();hidden.doc.hidden=true;hidden.events.visibilitychange();hidden.flush();assert.equal(hidden.animations.length,0);
const noAPI=gridFixture();noAPI.cards.forEach(c=>{c.animate=undefined;});noAPI.events['portfolio:before-filter']();noAPI.cards[1].left=0;noAPI.events['portfolio:filtered']();assert.doesNotThrow(()=>noAPI.flush());
console.log('PASS: filter movement, unchanged cards, rapid cancellation, focus, hidden tabs, reduced motion, page pause, and native fallback.');

const once=fixture();once.enter(true);once.pause(true);assert.equal(once.classes.has('motion-enter'),false);once.pause(false);assert.equal(once.classes.has('motion-enter'),false);const pausedEntry=fixture();pausedEntry.pause(true);pausedEntry.enter(true);assert.equal(pausedEntry.classes.has('motion-enter'),false);console.log('PASS: page pause clears completed entrances and resume does not replay them.');
