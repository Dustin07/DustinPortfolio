// Protect the original published PDFs against accidental replacement/corruption.
// A deliberate, user-approved revision requires updating the relevant baseline.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const documents = path.join(__dirname,'../documents');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname,'document-manifest.json'),'utf8'));
const actual = fs.readdirSync(documents).filter(file=>file.endsWith('.pdf')).sort();
assert.deepEqual(manifest.map(entry=>entry.file).sort(),actual);
console.log('PASS integrity baseline includes every published PDF');
for(const entry of manifest){
  const buffer = fs.readFileSync(path.join(documents,entry.file));
  assert.equal(buffer.subarray(0,5).toString(),'\u0025PDF-',`${entry.file} is not a PDF`);
  assert.equal(buffer.length,entry.bytes,`${entry.file} length changed`);
  assert.equal(crypto.createHash('sha256').update(buffer).digest('hex'),entry.sha256,`${entry.file} contents changed`);
  console.log('PASS original document unchanged: '+entry.file);
}
console.log(`${manifest.length+1} document integrity checks passed.`);

// Transfer-size cues must describe the linked source file, including when a
// deliberately approved document replacement changes its size in the future.
let labelledLinks = 0;
for (const page of fs.readdirSync(path.join(__dirname, '../projects')).filter(file => file.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(__dirname, '../projects', page), 'utf8');
  for (const match of html.matchAll(/<a\b[^>]*href="\.\.\/documents\/([^"/]+\.pdf)"([^>]*)>([\s\S]*?)<\/a>/g)) {
    const [, file, attributes, content] = match;
    const cue = content.match(/class="file-meta">PDF · ([\d.]+) (KB|MB)/);
    assert.ok(cue, `${page}: ${file} needs a visible format and size cue`);
    const [, amount, unit] = cue;
    const multiplier = unit === 'MB' ? 1_000_000 : 1_000;
    const precision = amount.includes('.') ? amount.split('.')[1].length : 0;
    const tolerance = multiplier / (2 * 10 ** precision);
    const bytes = fs.statSync(path.join(documents, file)).size;
    assert.ok(Math.abs(Number(amount) * multiplier - bytes) <= tolerance, `${page}: ${file} size cue does not match its source`);
    assert.ok(attributes.includes(`${amount} ${unit}`), `${page}: size missing from document link's accessible label`);
    labelledLinks++;
  }
}
assert.ok(labelledLinks > 0, 'expected labelled case-study document links');
console.log(`${labelledLinks} visible and accessible document-size cues match their source files.`);
