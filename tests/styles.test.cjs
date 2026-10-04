// Basic stylesheet sanity checks; these do not replace browser visual review.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const css = fs.readFileSync(path.join(__dirname,'../styles.css'),'utf8');
let total=0; const test=(name,action)=>{action();total++;console.log('PASS '+name);};
test('stylesheet delimiters, strings, and comments are balanced',()=>{
  const stack=[],closing={'}':'{',')':'(',']':'['};let quote='',comment=false;
  for(let i=0;i<css.length;i++){
    const char=css[i],next=css[i+1];
    if(comment){if(char==='*'&&next==='/'){comment=false;i++;}continue;}
    if(quote){if(char==='\\'){i++;continue;}if(char===quote)quote='';continue;}
    if(char==='/'&&next==='*'){comment=true;i++;continue;}
    if(char==='"'||char==="'"){quote=char;continue;}
    if('{(['.includes(char))stack.push(char);
    else if(closing[char])assert.equal(stack.pop(),closing[char],`Unmatched ${char} at ${i}`);
  }
  assert.equal(quote,'');assert.equal(comment,false);assert.equal(stack.length,0);
});
test('declared background animations are actually referenced',()=>{
  const defined=[...css.matchAll(/@keyframes\s+([\w-]+)/g)].map(match=>match[1]);
  const referenced=new Set([...css.matchAll(/animation:\s*([\w-]+)/g)].map(match=>match[1]));
  assert.equal(new Set(defined).size,defined.length);
  for(const name of defined)assert.ok(referenced.has(name),`Unused animation ${name}`);
});
test('hidden project and navigation content cannot leak through layout styling',()=>assert.match(css,/\[hidden\]\s*\{\s*display:\s*none\s*!important/));
test('paused decorative layers stop their CSS animations',()=>assert.match(css,/\.ambient-field\.is-paused\s+\*\s*\{\s*animation-play-state:\s*paused\s*!important/));
console.log(`${total} stylesheet safeguard checks passed.`);
