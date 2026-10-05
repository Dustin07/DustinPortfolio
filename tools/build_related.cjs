// Curated connections use only existing project-library content.
// --write performs the mechanical refresh; default mode is read-only.
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const pairs={
  'nasa-manufacturing':['rocket-structures','gating-optimization'],
  'protective-covers':['ergonomic-tools','die-design'],
  'rocket-structures':['carabiner-fea','nasa-manufacturing'],
  'legacy-reverse-engineering':['gating-optimization','die-design'],
  'ergonomic-tools':['protective-covers','cnc-putter'],
  'carabiner-fea':['rocket-structures','aircraft-aerodynamics'],
  'cnc-putter':['die-design','protective-covers'],
  'rocket-propulsion':['aircraft-aerodynamics','rocket-structures'],
  'aircraft-aerodynamics':['rocket-propulsion','carabiner-fea'],
  'gating-optimization':['legacy-reverse-engineering','die-design'],
  'die-design':['gating-optimization','cnc-putter'],
};
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const library=new Map([...home.matchAll(/<article class="project-card"[^>]*>([\s\S]*?)<\/article>/g)].map(([,card])=>{
  const [,file,title]=card.match(/<h3><a href="projects\/([^"]+)\.html">([\s\S]*?)<\/a><\/h3>/);
  return [file,{title,summary:card.match(/<p>([\s\S]*?)<\/p>/)[1],category:card.match(/<div class="card-top"><span>([\s\S]*?)<\/span>/)[1]}];
}));
const plain=text=>text.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"');
const attribute=text=>plain(text).replace(/&/g,'&amp;').replace(/"/g,'&quot;');
function relatedHTML(name){
  return '<nav class="related-projects" aria-labelledby="related-projects-heading"><h2 id="related-projects-heading">Related Engineering Work</h2><div class="related-grid">'+pairs[name].map(key=>{
    const project=library.get(key);
    if(!project)throw Error(`Missing library entry: ${key}`);
    return `<a class="related-card" href="${key}.html" aria-label="Read Case Study: ${attribute(project.title)}"><span class="related-category">${project.category}</span><h3>${project.title}</h3><p>${project.summary}</p><span class="related-action">Read Case Study <span aria-hidden="true">→</span></span></a>`;
  }).join('')+'</div></nav>';
}
function refreshed(name,html){
  const nav=relatedHTML(name);
  const updated=html.includes('<nav class="related-projects"')?
    html.replace(/<nav class="related-projects"[\s\S]*?<\/nav>/,nav):
    html.replace('<div class="case-bottom">',nav+'<div class="case-bottom">');
  const title=plain(library.get(name).title);
  const subject=encodeURIComponent('Engineering Portfolio — '+title);
  return updated.replace(/<a href="(?:\.\.\/index\.html#contact|mailto:dustinleung07@gmail\.com\?subject=[^"]*)"(?: aria-label="[^"]*")?>Discuss This Work<\/a>/,
    `<a href="mailto:dustinleung07@gmail.com?subject=${subject}" aria-label="Email Dustin About ${attribute(library.get(name).title)}">Discuss This Work</a>`);
}
function main(){
  const write=process.argv.includes('--write'),changed=[];
  for(const name of Object.keys(pairs)){
    const file=path.join(root,'projects',name+'.html'),original=fs.readFileSync(file,'utf8'),next=refreshed(name,original);
    if(next!==original){changed.push(name);if(write)fs.writeFileSync(file,next,'utf8');}
  }
  if(changed.length&&!write){console.error('FAIL: refresh related work with node tools/build_related.cjs --write: '+changed.join(', '));process.exitCode=1;return;}
  console.log(`${write?'Refreshed':'Verified'} 22 related-work links and 11 project email contexts; ${changed.length} pages ${write?'updated':'stale'}.`);
}
module.exports={pairs,library,relatedHTML,refreshed};
if(require.main===module)main();
