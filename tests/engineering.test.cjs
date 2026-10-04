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
test('putter operation estimates total approximately twenty minutes',()=>{
  const html=read('projects/cnc-putter.html');
  const times=[...html.matchAll(/— (\d+) min (\d+) sec/g)].map(([,min,sec])=>Number(min)*60+Number(sec));
  const short=[...html.matchAll(/— (\d+) sec/g)].map(([,sec])=>Number(sec));
  assert.equal(times.length+short.length,6);near([...times,...short].reduce((a,b)=>a+b,0)/60,20,.2);
});
test('putter reference geometry is credited',()=>assert.match(read('projects/cnc-putter.html'),/starting putter geometry came from a GrabCAD reference model/));
console.log(`${total} engineering data and navigation checks passed.`);
