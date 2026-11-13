const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname,'../contact.js'),'utf8');
class Element {
  constructor() { this.hidden=true;this.events={};this.attrs={};this.textContent=''; }
  addEventListener(name,action) {this.events[name]=action;}
  getAttribute(name) {return this.attrs[name];}
  setAttribute(name,value) {this.attrs[name]=value;}
  removeAttribute(name) {delete this.attrs[name];}
  focus() {this.focused=true;}
  select() {this.selected=true;}
}
function fixture(options={}) {
  const elements=Object.fromEntries(['.contact-primary[href^="mailto:"]','#copy-email','#email-copy-status','#email-copy-fallback','#email-copy-value'].map(key=>[key,new Element()]));
  elements['.contact-primary[href^="mailto:"]'].attrs.href=options.href??'mailto:dustinleung07@gmail.com';
  if(options.missing)delete elements[options.missing];
  const writes=[];
  const navigator=options.unavailable?{}:{clipboard:{writeText:value=>{writes.push(value);return options.writeText?options.writeText(value):Promise.resolve();}}};
  vm.runInNewContext(source,{document:{querySelector:key=>elements[key]||null},navigator});
  return {elements,writes,button:elements['#copy-email'],status:elements['#email-copy-status'],field:elements['#email-copy-value'],fallback:elements['#email-copy-fallback'],click:()=>elements['#copy-email'].events.click()};
}
let total=0;
async function test(name,action){await action();total++;console.log('PASS '+name);}
(async()=>{
  await test('homepage connects progressive copying with a labeled manual field and live feedback',()=>{const home=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');const tag=id=>home.match(new RegExp('<[^>]+\\bid="'+id+'"[^>]*>'))?.[0]||'';assert.match(tag('copy-email'),/\bhidden\b/);assert.match(tag('copy-email'),/type="button"/);assert.match(tag('email-copy-status'),/role="status"/);assert.match(tag('email-copy-status'),/aria-live="polite"/);assert.match(tag('email-copy-value'),/\breadonly\b/);assert.match(home,/<label for="email-copy-value">/);assert.match(home,/src="contact\.js\?v=/);assert.match(home,/href="contact\.css\?v=/);});
  await test('copy is revealed only after its complete contact markup is available',()=>{const f=fixture();assert.equal(f.button.hidden,false);assert.equal(f.field.value,'dustinleung07@gmail.com');const partial=fixture({missing:'#email-copy-status'});assert.equal(partial.button.hidden,true);assert.equal(partial.button.events.click,undefined);});
  await test('successful copy writes the address and reports success without moving focus',async()=>{const f=fixture();await f.click();assert.deepEqual(f.writes,['dustinleung07@gmail.com']);assert.equal(f.status.textContent,'Email copied.');assert.equal(f.fallback.hidden,true);assert.equal(f.field.focused,undefined);assert.equal(f.button.disabled,undefined);assert.equal(f.button.attrs['aria-busy'],undefined);});
  await test('mailto subject data is excluded and encoded addresses are decoded',async()=>{const f=fixture({href:'mailto:dustin%2Bleung@example.com?subject=Hello'});await f.click();assert.deepEqual(f.writes,['dustin+leung@example.com']);});
  await test('a denied clipboard request exposes and selects an accessible manual fallback',async()=>{const f=fixture({writeText:()=>Promise.reject(Error('denied'))});await f.click();assert.equal(f.fallback.hidden,false);assert.equal(f.field.focused,true);assert.equal(f.field.selected,true);assert.match(f.status.textContent,/Copy command/);assert.doesNotMatch(f.status.textContent,/copied/);assert.equal(f.button.attrs['aria-busy'],undefined);});
  await test('browsers without clipboard support retain manual copying',async()=>{const f=fixture({unavailable:true});await f.click();assert.equal(f.writes.length,0);assert.equal(f.fallback.hidden,false);assert.equal(f.field.selected,true);});
  await test('rapid activation cannot issue overlapping requests or disable the focused button',async()=>{let finish;const pending=new Promise(resolve=>finish=resolve);const f=fixture({writeText:()=>pending});const first=f.click();const second=f.click();assert.equal(f.writes.length,1);assert.equal(f.button.attrs['aria-busy'],'true');assert.equal(f.button.disabled,undefined);finish();await Promise.all([first,second]);assert.equal(f.status.textContent,'Email copied.');await f.click();assert.equal(f.writes.length,2);});
  await test('a later successful request clears an earlier manual fallback',async()=>{let fail=true;const f=fixture({writeText:()=>fail?Promise.reject(Error('denied')):Promise.resolve()});await f.click();assert.equal(f.fallback.hidden,false);fail=false;await f.click();assert.equal(f.fallback.hidden,true);assert.equal(f.status.textContent,'Email copied.');});
  await test('empty and malformed addresses leave the original contact link as the fallback',()=>{for(const href of ['mailto:','mailto:%zz']){const f=fixture({href});assert.equal(f.button.hidden,true);assert.equal(f.button.events.click,undefined);}});
  console.log(`${total} contact-copy checks passed.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
