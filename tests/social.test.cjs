const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const imageURL='https://dustin07.github.io/DustinPortfolio/images/portfolio-social.jpg';
const image=fs.readFileSync(path.join(root,'images/portfolio-social.jpg'));
let total=0;const test=(name,fn)=>{fn();total++;console.log('PASS '+name);};
test('share image has a valid JPEG header and the declared dimensions',()=>{
  assert.equal(image.subarray(0,2).toString('hex'),'ffd8');
  let offset=2,dimensions=null;
  while(offset+9<image.length){
    assert.equal(image[offset],0xff);
    const marker=image[offset+1],length=image.readUInt16BE(offset+2);
    if([0xc0,0xc1,0xc2].includes(marker)){dimensions={height:image.readUInt16BE(offset+5),width:image.readUInt16BE(offset+7)};break;}
    offset+=length+2;
  }
  assert.deepEqual(dimensions,{width:1200,height:630});
});
test('share image stays small enough for a lightweight static site',()=>assert.ok(image.length<250000));
const pages=['index.html',...fs.readdirSync(path.join(root,'projects')).filter(f=>f.endsWith('.html')).map(f=>'projects/'+f)];
for(const file of pages)test(`${file} has a complete branded link preview`,()=>{
  const html=fs.readFileSync(path.join(root,file),'utf8');
  const metas=new Map([...html.matchAll(/<meta (?:property|name)="([^"]+)" content="([^"]*)">/g)].map(([,key,value])=>[key,value]));
  assert.equal(metas.get('og:image'),imageURL);
  assert.equal(metas.get('og:image:type'),'image/jpeg');
  assert.equal(metas.get('og:image:width'),'1200');assert.equal(metas.get('og:image:height'),'630');
  assert.ok(metas.get('og:image:alt').includes('Dustin Leung'));
  assert.equal(metas.get('twitter:card'),'summary_large_image');assert.equal(metas.get('twitter:image'),imageURL);
  assert.equal(metas.get('twitter:image:alt'),metas.get('og:image:alt'));
  assert.equal(metas.get('og:title'),html.match(/<title>([^<]+)<\/title>/)[1]);
  assert.equal(metas.get('og:url'),html.match(/rel="canonical" href="([^"]+)"/)[1]);
  assert.ok(metas.get('og:description'));
});
console.log(`${total} link-preview checks passed.`);
