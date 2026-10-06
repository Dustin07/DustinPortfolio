// Internal consistency checks for displayed study data, not physical validation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const text = value => value.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').trim();
const rows = html => [...html.matchAll(/<tbody>([\s\S]*?)<\/tbody>/g)].flatMap(([,body])=>[...body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(([,row])=>[...row.matchAll(/<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/g)].map(([,cell])=>text(cell))));
const near = (actual, expected, tolerance) => assert.ok(Math.abs(actual-expected)<=tolerance, `${actual} differs from ${expected}`);
let total=0; const test=(name,action)=>{action();total++;console.log('PASS '+name);};
const home=read('index.html');
const cards=[...home.matchAll(/<article class="project-card"[^>]*>([\s\S]*?)<\/article>/g)].map(([,card])=>({html:card,target:card.match(/<h3><a href="([^"]+)"/)[1]}));
test('every case appears exactly once in the library',()=>{
  const cases=fs.readdirSync(path.join(root,'projects')).filter(file=>file.endsWith('.html')).map(file=>'projects/'+file).sort();
  assert.deepEqual(cards.map(card=>card.target).sort(),cases);
});
test('project numbers are sequential',()=>cards.forEach((card,index)=>assert.equal(card.html.match(/class="number">(\d+)/)[1],String(index+1).padStart(2,'0'))));

test('every case offers a valid, specifically labeled project highlight shortcut',()=>{
  const targets={'nasa-manufacturing':['engineering-decisions','Engineering Decisions'],'protective-covers':['section-4','View Outcome'],'rocket-structures':['section-5','View Results'],'legacy-reverse-engineering':['section-3','View Impact'],'ergonomic-tools':['section-4','View Outcome'],'carabiner-fea':['section-4','View Results'],'cnc-putter':['section-4','View Machining Plan'],'rocket-propulsion':['section-8','View Key Results'],'aircraft-aerodynamics':['section-2','View My Contribution'],'gating-optimization':['section-3','View Deliverables'],'die-design':['section-3','View Deliverables']};
  assert.equal(Object.keys(targets).length,cards.length);
  for(const [name,[id,label]] of Object.entries(targets)){
    const html=read('projects/'+name+'.html');
    const nav=html.match(/<nav class="case-shortcuts"[^>]*>([\s\S]*?)<\/nav>/)[1];
    assert.ok(nav.includes(`<a href="#${id}">${label}`));assert.ok(html.includes(`id="${id}"`));
    assert.equal((html.match(/class="case-shortcuts"/g)||[]).length,1);
  }
});

test('project-file shortcuts appear only when the page hosts project files',()=>cards.forEach(card=>{
  const html=read(card.target),nav=html.match(/<nav class="case-shortcuts"[^>]*>([\s\S]*?)<\/nav>/)[1];
  assert.equal(nav.includes('href="#project-files-heading"'),html.includes('id="project-files-heading"'));
}));
test('next-project links follow the library and include NASA',()=>cards.forEach((card,index)=>{
  const html=read(card.target);
  const next=html.match(/<a href="([^"]+)" aria-label="Next Project:/);
  assert.ok(next,`${card.target} has no next-project destination`);
  assert.equal(path.posix.join('projects',next[1]),cards[(index+1)%cards.length].target);
}));
test('carabiner trade-off percentages match its displayed table',()=>{
  const [base,spine]=rows(read('projects/carabiner-fea.html')).map(row=>row.slice(1).map(Number));
  near((base[2]-spine[2])/base[2]*100,6.1,.05);
  near((spine[1]-base[1])/base[1]*100,2.6,.05);
  near((spine[0]-base[0])/base[0]*100,9.8,.05);
});
test('stress penalty uses stress increase per removed volume',()=>{
  const [base,spine,tube]=rows(read('projects/carabiner-fea.html')).map(row=>row.slice(1).map(Number));
  near((spine[1]-base[1])/(base[2]-spine[2]),.084,.0005);
  near((tube[1]-base[1])/(base[2]-tube[2]),.137,.0005);
  assert.match(read('projects/carabiner-fea.html'),/Stress Penalty per Removed Volume \(MPa\/mm³\)/);
});
test('carabiner trade-off bars match rounded baseline-relative table changes',()=>{
  const html=read('projects/carabiner-fea.html');
  const plot=html.match(/<figure class="engineering-figure tradeoff-plot">([\s\S]*?)<\/figure>/)[1];
  const [base,...variants]=rows(html).map(row=>row.slice(1).map(Number));
  const widths=series=>[...plot.matchAll(new RegExp(`<rect data-series="${series}"[^>]*width="([\\d.]+)"`,'g'))].map(([,width])=>Number(width));
  assert.equal(widths('volume').length,2);assert.equal(widths('stress').length,2);
  variants.forEach((row,index)=>{
    const removed=(base[2]-row[2])/base[2]*100,added=(row[1]-base[1])/base[1]*100;
    assert.equal(widths('volume')[index],Number(removed.toFixed(1))*10);
    assert.equal(widths('stress')[index],Number(added.toFixed(1))*10);
  });
  assert.match(plot,/same zero-based 0 to 30 percent scale/);
  assert.match(plot,/360 N load, not measured capacity or a tested load rating/);
});
test('wing reference area and mean chord match displayed geometry',()=>{
  const data=Object.fromEntries(rows(read('projects/aircraft-aerodynamics.html')).slice(0,7));
  const rootChord=parseFloat(data['Root Chord (Co)']),tip=parseFloat(data['Tip Chord (Ct)']),span=parseFloat(data.Wingspan),taper=tip/rootChord;
  near((rootChord+tip)*span/2,parseFloat(data['Reference Planform Area']),.01);
  near(2*rootChord/3*(1+taper+taper*taper)/(1+taper),parseFloat(data['Mean Aerodynamic Chord'].replace('≈','')),.005);
});
test('rocket testing chart agrees with the case-study results',()=>{
  const report=rows(read('projects/rocket-structures.html'));
  const card=cards.find(card=>card.target==='projects/rocket-structures.html').html;
  for(const [hours,,strength] of report){assert.match(card,new RegExp(`<span>${strength.replace('.','\\.')}</span>`));assert.match(card,new RegExp(`<small>${hours}h</small>`));}
});
test('rocket strength plot uses the displayed data on a zero-based scale',()=>{
  const html=read('projects/rocket-structures.html');
  const plot=html.match(/<figure class="engineering-figure results-plot">([\s\S]*?)<\/figure>/)[1];
  const strength=rows(html).map(row=>Number(row[2]));
  const points=[...plot.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)"/g)].map(([,x,y])=>({x:Number(x),y:Number(y)}));
  assert.equal(points.length,strength.length);
  points.forEach((point,index)=>near(point.y,230-strength[index]*3,.001));
  assert.match(plot,/Zero-based strength axis from 0 to 60 MPa/);
  assert.match(plot,/no uncertainty bars or fitted trend/);
});
test('condition-level means are rounded and scoped, not specimen statistics',()=>{
  const html=read('projects/rocket-structures.html'),data=rows(html);
  const mean=index=>data.reduce((sum,row)=>sum+Number(row[index]),0)/data.length;
  near(mean(2),45.9,.05);near(mean(3),1629,.5);
  assert.match(html,/averages of the condition-level values, not pooled specimen statistics/);
});
test('putter operation estimates total approximately twenty minutes',()=>{
  const html=read('projects/cnc-putter.html');
  const times=[...html.matchAll(/— (\d+) min (\d+) sec/g)].map(([,min,sec])=>Number(min)*60+Number(sec));
  const short=[...html.matchAll(/— (\d+) sec/g)].map(([,sec])=>Number(sec));
  assert.equal(times.length+short.length,6);near([...times,...short].reduce((a,b)=>a+b,0)/60,20,.2);
});
test('putter reference geometry is credited',()=>assert.match(read('projects/cnc-putter.html'),/using a GrabCAD reference model/));
test('rocket baseline comparison is descriptive and arithmetically correct',()=>{
  const html=read('projects/rocket-structures.html'),data=rows(html);
  near(Number(data[0][2])-Number(data[4][2]),6.38,.0001);
  near((Number(data[0][2])-Number(data[4][2]))/Number(data[0][2])*100,13.1,.05);
  assert.match(html,/6.38 MPa \(13.1%\)/);
  assert.match(html,/not a significance test/);
});
test('rocket method connects schematic loading to the reported setup without claiming playback',()=>{
  const html=read('projects/rocket-structures.html');
  assert.match(html,/50 mm gauge length and 115 mm grip separation/);
  assert.match(html,/not to scale/);
  assert.match(html,/0 hours = unannealed baseline/);
  assert.match(html,/does not provide the count, scatter/);
  assert.match(html,/These specimen tests are not a flight qualification/);
});
test('every library card uses one labeled preview panel',()=>cards.forEach(card=>{
  assert.equal((card.html.match(/class="card-preview"/g)||[]).length,1);
  assert.match(card.html,/<div class="preview-label">[^<]+<\/div>/);
}));
test('shorter case studies retain their key evidence boundaries',()=>{
  assert.match(read('projects/aircraft-aerodynamics.html'),/I owned the wing and horizontal-tail geometric reconstruction/);
  assert.match(read('projects/carabiner-fea.html'),/initial loading condition different from the final comparison/);
  assert.match(read('projects/rocket-structures.html'),/not pooled specimen statistics/);
  assert.match(read('projects/rocket-propulsion.html'),/neglects drag and gravity losses/);
  assert.match(read('projects/gating-optimization.html'),/Customer approval was pending at handoff/);
  assert.match(read('projects/cnc-putter.html'),/not measured shop-floor cycle times/);
});
console.log(`${total} engineering data and navigation checks passed.`);
