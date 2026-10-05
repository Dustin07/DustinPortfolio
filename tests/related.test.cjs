const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pairs,library,relatedHTML,refreshed}=require('../tools/build_related.cjs');
const root=path.join(__dirname,'..');
let total=0;const test=(name,fn)=>{fn();total++;console.log('PASS '+name);};
test('every library case has a curated related-work pair',()=>assert.deepEqual(Object.keys(pairs).sort(),[...library.keys()].sort()));
for(const [name,targets] of Object.entries(pairs))test(`${name} has current, distinct links and an encoded email context`,()=>{
  assert.equal(targets.length,2);assert.equal(new Set(targets).size,2);assert.ok(!targets.includes(name));
  const html=fs.readFileSync(path.join(root,'projects',name+'.html'),'utf8');
  assert.equal(html,refreshed(name,html));
  const expected=relatedHTML(name);assert.ok(html.includes(expected));
  assert.equal((expected.match(/class="related-card"/g)||[]).length,2);
  for(const target of targets){assert.ok(library.has(target));assert.ok(fs.existsSync(path.join(root,'projects',target+'.html')));assert.ok(expected.includes(library.get(target).summary));}
  const mail=html.match(/href="(mailto:dustinleung07@gmail\.com\?subject=[^"]+)" aria-label="Email Dustin About/);
  assert.ok(mail);const subject=new URL(mail[1]).searchParams.get('subject');
  assert.equal(subject,'Engineering Portfolio — '+library.get(name).title.replace(/&amp;/g,'&'));
  assert.equal((html.match(/id="related-projects-heading"/g)||[]).length,1);
});
test('mechanical refresh preserves case-study body and originals',()=>{
  const original='<article><p>Keep my source facts.</p><div class="case-bottom"><a href="../index.html#contact">Discuss This Work</a></div></article>';
  const next=refreshed('nasa-manufacturing',original);
  assert.ok(next.includes('<p>Keep my source facts.</p>'));assert.equal(next,refreshed('nasa-manufacturing',next));
});
console.log(`${total} related-work and project-email checks passed.`);
