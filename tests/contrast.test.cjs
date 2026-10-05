// Representative solid-surface palette safeguards, not a full accessibility
// certification or a pixel-level test of every translucent/gradient state.
// Threshold reference: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const css=fs.readFileSync(path.join(__dirname,'../styles.css'),'utf8');
const variables=Object.fromEntries([...css.match(/:root\s*\{([^}]+)\}/)[1].matchAll(/--([\w-]+):\s*(#[\da-f]+)/gi)].map(([,name,value])=>[name,value]));
const colorOf=selector=>{
  const escaped=selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const blocks=[...css.matchAll(new RegExp(escaped+'\\s*\\{([^}]+)\\}','g'))];
  for(const [,block] of blocks){const match=block.match(/(?:^|;)\s*color:\s*(#[\da-f]+)/i);if(match)return match[1];}
  throw Error(`No explicit solid text color for ${selector}`);
};
function luminance(hex){
  const raw=hex.slice(1),full=raw.length===3?[...raw].map(c=>c+c).join(''):raw;
  const rgb=[0,2,4].map(i=>parseInt(full.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
  return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
}
function ratio(a,b){const pair=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (pair[0]+.05)/(pair[1]+.05);}
let total=0;const test=(name,fn)=>{fn();total++;console.log('PASS '+name);};
for(const [name,foreground,background,minimum] of [
  ['body copy',variables.ink,'#fff',4.5],
  ['navy links on fallback surface',variables.blue,'#f7fafc',4.5],
  ['muted labels on white',variables.muted,'#fff',4.5],
  ['white selected-filter text',variables.white,variables.blue,4.5],
  ['maize contact links',variables.maize,variables.blue,4.5],
  ['white Oregon State panel text',variables.white,'#111',4.5],
  ['case-study body copy',colorOf('.case-content p'),'#fff',4.5],
  ['figure captions',colorOf('.engineering-figure figcaption'),'#f8fafc',4.5],
  ['viewer captions',colorOf('.figure-viewer figcaption'),'#f7fafc',4.5],
  ['timeline category labels',colorOf('.timeline-type'),'#fff',4.5],
  ['search placeholder',colorOf('.search-field input::placeholder'),'#fff',4.5],
  ['orange focus indicator',variables.orange,'#fff',3],
])test(`${name} retains its contrast threshold`,()=>assert.ok(ratio(foreground,background)>=minimum,`${name}: ${ratio(foreground,background).toFixed(3)} is below ${minimum}`));
test('figure focus outline is inset so the clipped figure does not hide it',()=>assert.match(css,/\.figure-zoom:focus-visible\s*\{outline-offset:-4px\}/));
console.log(`${total} representative contrast and focus safeguards passed.`);
