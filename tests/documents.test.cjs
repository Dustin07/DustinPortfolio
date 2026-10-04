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
