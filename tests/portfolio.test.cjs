const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../portfolio.js'), 'utf8');

class Element {
  constructor(text = '', dataset = {}) { this.textContent = text; this.dataset = dataset; this.attrs = {}; this.events = {}; this.value = ''; this.hidden = false; }
  addEventListener(name, action) { this.events[name] = action; }
  setAttribute(name, value) { this.attrs[name] = value; }
  getAttribute(name) { return this.attrs[name]; }
  removeAttribute(name) { delete this.attrs[name]; }
  focus() { this.focused = true; }
  getClientRects() { return this.hidden ? [] : [{width:100,height:44}]; }
  contains(target) {return this===target || (this.children||[]).some(child=>child.contains(target));}
}
function fixture(url = 'https://example.test/DustinPortfolio/', saved = null, storageBlocked = false, library = null) {
  const cards = library ? library.cards.map(card => new Element(card.text, card.dataset)) : [new Element('Protective Covers CATIA TPU', {category:'Boeing'}), new Element('Rocket Testing FEA', {category:'Academic'}), new Element('Carabiner FEA Ansys', {category:'Academic'}), new Element('Casting Tooling SolidWorks', {category:'PCC'})];
  const buttons = (library?.categories || ['All','Academic','Boeing','PCC']).map(value => new Element(value, {filter:value}));
  if (library) library.cards.forEach((card,index) => {
    if (card.childNodes) cards[index].childNodes=card.childNodes;
    if (card.href) {
      const link=new Element(card.title || card.text);link.setAttribute('href',card.href);
      cards[index].querySelector=selector=>selector==='h3 a'?link:null;
    }
  });
  const elements = {'#project-search':new Element(), '#project-count':new Element(), '#project-empty':new Element(), '#project-empty-message':new Element(), '#project-expand-search':new Element(), '#project-reset':new Element(), '.project-toolbar':new Element(), '.filters':new Element()};
  const timers = new Map(); let timerId = 0; let stored = saved; const events = {};
  elements['#project-library'] = new Element();
  elements['#project-library'].open = false;
  const context = {
    document: {
      querySelector: selector => elements[selector] || null,
      querySelectorAll: selector => selector === '.project-card' ? cards : selector === '.filter' ? buttons : [],
      getElementById: () => null,
    },
    URL, URLSearchParams, location:new URL(url), history:{replaceState:(_, __, next) => { context.location = new URL(next); },pushState:(_, __, next) => {context.location = new URL(next);context.pushes=(context.pushes||0)+1;}},
    sessionStorage:{getItem:() => {if(storageBlocked) throw Error('blocked'); return stored ? JSON.stringify(stored) : null;},setItem:(_,value) => {if(storageBlocked) throw Error('blocked'); stored=JSON.parse(value);}},
    setTimeout: callback => { const id=++timerId;timers.set(id, callback);return id; }, clearTimeout:id => timers.delete(id),
    addEventListener:(name,action) => {events[name]=action;}, requestAnimationFrame:action => action(),
  };
  vm.runInNewContext(source, context);
  return {cards,buttons,elements,context,events,
    click:value => buttons.find(button=>button.dataset.filter===value).events.click(),
    search:value => {elements['#project-search'].value=value;elements['#project-search'].events.input();[...timers.values()].forEach(action=>action());timers.clear();},
    shown:()=>cards.filter(card=>!card.hidden).map(card=>card.textContent),
    stored:()=>stored,
  };
}
let cases=0;
function test(name, action) { action();cases++;console.log('PASS '+name); }
test('default library is complete',()=>{const f=fixture();assert.equal(f.shown().length,4);assert.equal(f.elements['#project-count'].textContent,'4 Projects');assert.equal(f.elements['#project-reset'].hidden,true);});
test('fresh homepage keeps the full library collapsed',()=>assert.equal(fixture().elements['#project-library'].open,false));

test('direct project-library link reveals the library without a stored preference',()=>{const f=fixture('https://example.test/DustinPortfolio/#project-library');assert.equal(f.elements['#project-library'].open,true);assert.equal(f.shown().length,4);});
test('shared category and query links reveal the full library',()=>{
  for(const suffix of ['?category=Boeing#work','?q=Ansys#work']) assert.equal(fixture('https://example.test/DustinPortfolio/'+suffix).elements['#project-library'].open,true);
});
test('returning from a case study reveals even an unfiltered library',()=>assert.equal(fixture('https://example.test/DustinPortfolio/#work',{category:'All',query:''}).elements['#project-library'].open,true));
test('category filtering and URL',()=>{const f=fixture();f.click('Boeing');assert.equal(f.shown().length,1);assert.equal(f.context.location.searchParams.get('category'),'Boeing');assert.equal(f.elements['#project-count'].textContent,'1 Project');});
test('case-insensitive skill search',()=>{const f=fixture();f.search('fEa');assert.equal(f.shown().length,2);assert.equal(f.context.location.searchParams.get('q'),'fEa');});
test('all search terms must match',()=>{const f=fixture();f.search('FEA Ansys');assert.deepEqual(f.shown(),['Carabiner FEA Ansys']);});
test('search combines with category',()=>{const f=fixture();f.click('Boeing');f.search('FEA');assert.equal(f.shown().length,0);assert.equal(f.elements['#project-empty'].hidden,false);});
test('empty search names the query and selected category as text',()=>{const f=fixture();f.click('Boeing');f.search('<missing>');assert.equal(f.elements['#project-empty-message'].textContent,'No matching projects for “<missing>” in Boeing. Try another keyword or clear the filters.');});
test('empty category search offers actual matches elsewhere',()=>{const f=fixture();f.click('Boeing');f.search('FEA');assert.equal(f.elements['#project-expand-search'].hidden,false);assert.equal(f.elements['#project-expand-search'].textContent,'Search All Projects (2 Matches)');});
test('widening search keeps the query and preserves unrelated URL parameters',()=>{const f=fixture('https://example.test/DustinPortfolio/?v=release#work');f.click('Boeing');f.search('FEA');f.elements['#project-expand-search'].events.click();assert.equal(f.shown().length,2);assert.equal(f.elements['#project-search'].value,'FEA');assert.equal(f.elements['#project-search'].focused,true);assert.equal(f.context.location.searchParams.has('category'),false);assert.equal(f.context.location.searchParams.get('q'),'FEA');assert.equal(f.context.location.searchParams.get('v'),'release');assert.equal(f.elements['#project-expand-search'].hidden,true);});
test('search widening is hidden when no other project matches',()=>{const f=fixture();f.click('PCC');f.search('missing');assert.equal(f.elements['#project-expand-search'].hidden,true);f.search('SolidWorks');assert.equal(f.elements['#project-expand-search'].hidden,true);});
test('one alternative match has a singular label',()=>{const f=fixture();f.click('Academic');f.search('TPU');assert.equal(f.elements['#project-expand-search'].textContent,'Search All Projects (1 Match)');});
test('clear restores all and focuses search',()=>{const f=fixture();f.click('PCC');f.search('missing');f.elements['#project-reset'].events.click();assert.equal(f.shown().length,4);assert.equal(f.elements['#project-search'].focused,true);assert.equal(f.context.location.search,'');});
test('Escape clears query but keeps category',()=>{const f=fixture();f.click('Academic');f.search('Ansys');f.elements['#project-search'].events.keydown({key:'Escape'});assert.equal(f.shown().length,2);assert.equal(f.context.location.searchParams.get('category'),'Academic');});
test('shared link restores category and search',()=>{const f=fixture('https://example.test/DustinPortfolio/?category=Academic&q=Ansys#work');assert.deepEqual(f.shown(),['Carabiner FEA Ansys']);});
test('return link restores session view and shareable URL',()=>{const f=fixture('https://example.test/DustinPortfolio/index.html#work',{category:'Boeing',query:'TPU'});assert.equal(f.shown().length,1);assert.equal(f.context.location.searchParams.get('q'),'TPU');});
test('fresh home ignores previous session filter',()=>{const f=fixture('https://example.test/DustinPortfolio/',{category:'PCC',query:'Tooling'});assert.equal(f.shown().length,4);});
test('invalid category is safe',()=>{const f=fixture('https://example.test/DustinPortfolio/?category=unknown#work');assert.equal(f.shown().length,4);});
test('blocked storage does not disable search',()=>{const f=fixture(undefined,null,true);f.search('FEA');assert.equal(f.shown().length,2);});
test('other query parameters are preserved',()=>{const f=fixture('https://example.test/DustinPortfolio/?v=release#work');f.click('PCC');assert.equal(f.context.location.searchParams.get('v'),'release');});
test('long shared queries are bounded',()=>{const f=fixture('https://example.test/DustinPortfolio/?q='+ 'x'.repeat(250));assert.equal(f.elements['#project-search'].value.length,120);});
test('corrupt saved query cannot break the page',()=>{const f=fixture('https://example.test/DustinPortfolio/#work',{category:'Academic',query:123});assert.equal(f.shown().length,2);});
test('array-shaped saved preferences are ignored',()=>{const f=fixture('https://example.test/DustinPortfolio/#work',['Boeing']);assert.equal(f.shown().length,4);});
test('keywords index full engineering terms',()=>{const f=fixture();f.cards[2].dataset.keywords='finite element analysis';vm.runInNewContext(source,f.context);f.search('finite element');assert.deepEqual(f.shown(),['Carabiner FEA Ansys']);});
test('unmatched Unicode queries do not show every card',()=>{const f=fixture();f.search('航空');assert.equal(f.shown().length,0);});
test('punctuation does not prevent keyword matches',()=>{const f=fixture();f.search('FEA/Ansys');assert.deepEqual(f.shown(),['Carabiner FEA Ansys']);});
test('category changes create a browser-history destination',()=>{const f=fixture();f.click('Boeing');assert.equal(f.context.pushes,1);f.click('Boeing');assert.equal(f.context.pushes,1);});
test('Back restores the category and query from the destination URL',()=>{const f=fixture();f.click('Boeing');f.context.location=new URL('https://example.test/DustinPortfolio/?category=Academic&q=Ansys#work');f.events.popstate();assert.deepEqual(f.shown(),['Carabiner FEA Ansys']);assert.equal(f.elements['#project-search'].value,'Ansys');assert.equal(f.buttons.find(button=>button.dataset.filter==='Academic').attrs['aria-pressed'],'true');});
test('Back to an unfiltered URL does not revive a saved filter',()=>{const f=fixture();f.click('Boeing');f.context.location=new URL('https://example.test/DustinPortfolio/#work');f.events.popstate();assert.equal(f.shown().length,4);assert.equal(f.elements['#project-search'].value,'');assert.equal(f.stored().category,'All');});
test('typed searches are saved immediately before navigating away',()=>{const f=fixture();f.elements['#project-search'].value='Ansys';f.elements['#project-search'].events.input();assert.deepEqual(f.shown(),['Carabiner FEA Ansys']);assert.equal(f.stored().query,'Ansys');assert.equal(f.context.location.searchParams.get('q'),'Ansys');});
test('native search-field clear updates the visible projects',()=>{const f=fixture();f.search('Ansys');f.elements['#project-search'].value='';f.elements['#project-search'].events.search();assert.equal(f.shown().length,4);assert.equal(f.context.location.searchParams.has('q'),false);});
test('history-restored queries are bounded and categories validated',()=>{const f=fixture();f.context.location=new URL('https://example.test/DustinPortfolio/?category=unknown&q='+ 'x'.repeat(250));f.events.popstate();assert.equal(f.elements['#project-search'].value.length,120);assert.equal(f.stored().category,'All');});
const languageLibrary={cards:[{text:'Custom machining',dataset:{category:'Academic'}},{text:'C++ controller',dataset:{category:'Academic'}},{text:'C# application',dataset:{category:'Academic'}}],categories:['All','Academic']};
test('C++ is not reduced to the incidental letter C',()=>{const f=fixture(undefined,null,false,languageLibrary);f.search('C++');assert.deepEqual(f.shown(),['C++ controller']);});
test('C# remains a distinct programming-language query',()=>{const f=fixture(undefined,null,false,languageLibrary);f.search('c#');assert.deepEqual(f.shown(),['C# application']);});
test('one-letter queries do not match arbitrary words',()=>{const f=fixture();f.search('c');assert.equal(f.shown().length,0);});
test('adjacent DOM text blocks retain exact skill boundaries',()=>{const f=fixture(undefined,null,false,{categories:['All','Academic'],cards:[{text:'Siemens NX · Ansys · FEAView Project',dataset:{category:'Academic'},childNodes:[{childNodes:[{nodeType:3,textContent:'Siemens NX · Ansys · FEA'}]},{childNodes:[{nodeType:3,textContent:'View Project'}]}]}]});f.search('FEA');assert.equal(f.shown().length,1);f.search('NX');assert.equal(f.shown().length,1);f.search('Ansys');assert.equal(f.shown().length,1);});

const home = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
function caseNavigationFixture(saved = null, storageBlocked = false, page = 'protective-covers.html') {
  const links = [new Element(), new Element()];
  const content = new Element();
  const next = new Element('Next: Other Project →');
  next.setAttribute('href', 'rocket-structures.html');
  next.setAttribute('aria-label', 'Next Project: Other Project');
  const context = {
    document: {
      querySelector: selector => selector === '.case-content' ? content : selector === '.case-bottom a[aria-label^="Next Project:"]' ? next : null,
      querySelectorAll: selector => selector.startsWith('.back,') ? links : [],
    },
    URLSearchParams,
    location: new URL('https://example.test/DustinPortfolio/projects/' + page),
    sessionStorage: {getItem: () => {
      if (storageBlocked) throw Error('blocked');
      return saved === null ? null : JSON.stringify(saved);
    }},
  };
  vm.runInNewContext(source, context);
  return {links,next};
}
function caseReturnFixture(saved = null, storageBlocked = false) {
  return caseNavigationFixture(saved,storageBlocked).links.map(link => link.attrs.href);
}
test('case return links open the library directly for a fresh visitor', () => {
  assert.deepEqual(caseReturnFixture(), ['../index.html#project-library', '../index.html#project-library']);
});
test('case return links preserve the category and keyword as an explicit URL', () => {
  const destinations = caseReturnFixture({category:'Boeing', query:'  TPU  '});
  for (const destination of destinations) {
    const url = new URL(destination, 'https://example.test/projects/case.html');
    assert.equal(url.hash, '#project-library');
    assert.equal(url.searchParams.get('category'), 'Boeing');
    assert.equal(url.searchParams.get('q'), 'TPU');
  }
});
test('case return links encode punctuation instead of changing URL structure', () => {
  const destination = caseReturnFixture({category:'All', query:'GD&T #? C++'})[0];
  const url = new URL(destination, 'https://example.test/projects/case.html');
  assert.equal(url.searchParams.get('q'), 'GD&T #? C++');
  assert.equal(url.searchParams.has('category'), false);
  assert.equal(url.hash, '#project-library');
});
test('case return links discard unknown categories and bound long queries', () => {
  const destination = caseReturnFixture({category:'unknown', query:'x'.repeat(250)})[0];
  const url = new URL(destination, 'https://example.test/projects/case.html');
  assert.equal(url.searchParams.has('category'), false);
  assert.equal(url.searchParams.get('q').length, 120);
});
test('case return navigation survives blocked or corrupt storage', () => {
  for (const destination of [caseReturnFixture(null, true), caseReturnFixture(['Boeing']), caseReturnFixture({category:123,query:null})]) {
    assert.ok(destination.every(link => link === '../index.html#project-library'));
  }
});
const selectedBoeing = {category:'Boeing',query:'',matches:[
  {href:'projects/protective-covers.html',title:'Protective Covers'},
  {href:'projects/ergonomic-tools.html',title:'Ergonomic Attachments'},
]};
test('Next follows the saved matching project order',()=>{const f=caseNavigationFixture(selectedBoeing);assert.equal(f.next.attrs.href,'ergonomic-tools.html');assert.equal(f.next.attrs['aria-label'],'Next Matching Project: Ergonomic Attachments');assert.equal(f.next.textContent,'Next Result: Ergonomic Attachments →');});
test('the last matching case wraps to the first without a self link',()=>{const f=caseNavigationFixture(selectedBoeing,false,'ergonomic-tools.html');assert.equal(f.next.attrs.href,'protective-covers.html');});
test('keyword-only selections also retain their matching order',()=>{const f=caseNavigationFixture({category:'All',query:'FEA',matches:[{href:'projects/carabiner-fea.html',title:'Carabiner'},{href:'projects/gating-optimization.html',title:'Gating'}]},false,'carabiner-fea.html');assert.equal(f.next.attrs.href,'gating-optimization.html');});
test('single results and unrelated cases retain ordinary project navigation',()=>{for(const saved of [{...selectedBoeing,matches:selectedBoeing.matches.slice(0,1)},{...selectedBoeing,category:'All'},{...selectedBoeing,category:'unknown'}])assert.equal(caseNavigationFixture(saved).next.attrs['aria-label'],'Next Project: Other Project');assert.equal(caseNavigationFixture(selectedBoeing,false,'nasa-manufacturing.html').next.attrs['aria-label'],'Next Project: Other Project');});
test('saved selections reject external and malformed project paths',()=>{for(const href of ['https://example.invalid/steal.html','javascript:alert(1)','../index.html','projects/../index.html','projects/ergonomic-tools.html?q=redirect']){const saved={...selectedBoeing,matches:[selectedBoeing.matches[0],{href,title:'Invalid'}]};assert.equal(caseNavigationFixture(saved).next.attrs['aria-label'],'Next Project: Other Project');}});
test('duplicate saved entries cannot turn Next into the same case',()=>{const f=caseNavigationFixture({...selectedBoeing,matches:[selectedBoeing.matches[0],selectedBoeing.matches[0]]});assert.equal(f.next.attrs['aria-label'],'Next Project: Other Project');});
test('saved labels are bounded and inserted as plain text',()=>{const f=caseNavigationFixture({...selectedBoeing,matches:[selectedBoeing.matches[0],{href:'projects/ergonomic-tools.html',title:'<b>'+ 'x'.repeat(200)+'</b>'}]});assert.equal(f.next.textContent.length,'Next Result: '.length+160+' →'.length);assert.ok(f.next.textContent.startsWith('Next Result: <b>'));assert.equal(f.next.innerHTML,undefined);});
test('selected work features research, production design, and experimental evidence',()=>{
  const featured=home.match(/<div class="featured-grid"[^>]*>([\s\S]*?)<\/div>\s*<details class="project-library"/)[1];
  assert.equal((featured.match(/class="featured-card"/g)||[]).length,3);
  for(const page of ['nasa-manufacturing','protective-covers','rocket-structures']) assert.ok(featured.includes('projects/'+page+'.html'));
  assert.match(home,/<details class="project-library" id="project-library"><summary>Browse All 11 Projects/);
});
test('full degree details appear once, in the timeline',()=>{
  for(const degree of ['B.S. Mechanical Engineering · Aerospace Engineering Option','M.S. Mechanical Engineering · Expected May 2028']) assert.equal(home.split(degree).length-1,1);
  assert.equal(home.includes('hero-aside'),false);
  assert.equal(home.includes('Education & Recognition'),false);
});
const decode = text => text.replace(/&amp;/g,'&').replace(/<[^>]*>/g,' ');
const realLibrary = {
  cards:[...home.matchAll(/<article class="project-card"([^>]*)>([\s\S]*?)<\/article>/g)].map(([,attributes,content])=>{
    const link=content.match(/<h3><a href="([^"]+)">([\s\S]*?)<\/a>/);
    return {text:decode(content),href:link?.[1],title:decode(link?.[2] || ''),dataset:{category:attributes.match(/data-category="([^"]+)"/)[1],keywords:decode(attributes.match(/data-keywords="([^"]*)"/)?.[1] || '')}};
  }),
  categories:[...home.matchAll(/data-filter="([^"]+)"/g)].map(match=>match[1]),
};
test('published library includes every case study',()=>{const f=fixture(undefined,null,false,realLibrary);const cases=fs.readdirSync(path.join(__dirname,'../projects')).filter(file=>file.endsWith('.html'));assert.equal(f.shown().length,cases.length);assert.equal(f.elements['#project-count'].textContent,`${cases.length} Projects`);});
test('NASA category finds the research case',()=>{const f=fixture(undefined,null,false,realLibrary);f.click('NASA');assert.equal(f.shown().length,1);assert.match(f.shown()[0],/In-Space Manufacturing Research/);});
test('the real library saves matching destinations in displayed order',()=>{const f=fixture(undefined,null,false,realLibrary);f.click('Boeing');assert.deepEqual(f.stored().matches.map(item=>item.href),['projects/protective-covers.html','projects/ergonomic-tools.html']);f.search('TPU');assert.deepEqual(f.stored().matches.map(item=>item.href),['projects/protective-covers.html']);});
test('clearing the selection removes its restricted navigation order',()=>{const f=fixture(undefined,null,false,realLibrary);f.click('Boeing');f.elements['#project-reset'].events.click();assert.equal(f.stored().matches,undefined);assert.equal(f.stored().category,'All');});
test('research keywords find the NASA case',()=>{const f=fixture(undefined,null,false,realLibrary);f.search('sensing automation');assert.equal(f.shown().length,1);assert.match(f.shown()[0],/In-Space Manufacturing Research/);});
test('full FEA terms find structural and solidification studies',()=>{const f=fixture(undefined,null,false,realLibrary);f.search('finite element');assert.equal(f.shown().length,2);assert.ok(f.shown().some(text=>/Pocket Carabiner/.test(text)));assert.ok(f.shown().some(text=>/Gating System/.test(text)));});
test('3D printing search finds both Boeing projects',()=>{const f=fixture(undefined,null,false,realLibrary);f.click('Boeing');f.search('3d printing');assert.equal(f.shown().length,2);});
test('CAM does not match camera sensing',()=>{const f=fixture(undefined,null,false,realLibrary);f.search('CAM');assert.equal(f.shown().length,1);assert.match(f.shown()[0],/Custom CNC Golf Putter/);});
test('AI does not match an aircraft tail',()=>{const f=fixture(undefined,null,false,realLibrary);f.search('AI');assert.equal(f.shown().length,1);assert.match(f.shown()[0],/In-Space Manufacturing Research/);});
test('full language-model terms find the research case',()=>{const f=fixture(undefined,null,false,realLibrary);f.search('language model');assert.equal(f.shown().length,1);assert.match(f.shown()[0],/In-Space Manufacturing Research/);});
test('CAD search finds the actual part-modeling and tooling work',()=>{const f=fixture(undefined,null,false,realLibrary);f.search('CAD');assert.equal(f.shown().length,8);assert.ok(f.shown().every(text=>!text.includes('In-Space Manufacturing Research')));});
test('FEA search does not imply completed rocket material analysis',()=>{const f=fixture(undefined,null,false,realLibrary);f.search('FEA');assert.equal(f.shown().length,2);assert.ok(f.shown().every(text=>!text.includes('Rocket Structures')));});
test('GD&T matches its actual metrology case',()=>{const f=fixture(undefined,null,false,realLibrary);f.search('GD&T');assert.equal(f.shown().length,1);assert.match(f.shown()[0],/Legacy Component Reverse Engineering/);});
test('untagged C++ projects are not invented by broad substring matching',()=>{const f=fixture(undefined,null,false,realLibrary);f.search('C++');assert.equal(f.shown().length,0);});

function navigationFixture() {
  const nav = new Element(), navigation = new Element(), header = new Element(), toc = new Element(), heading = new Element('Inside This Project'), bottom = new Element();
  const links = ['overview','results','files'].map(name=>Object.assign(new Element(name),{hash:'#'+name,closest:()=>true}));
  const sections = Object.fromEntries(links.map((link,index)=>[link.hash.slice(1),Object.assign(new Element(),{getBoundingClientRect:()=>({top:[200,800,1800][index]-context.scrollY})})]));
  let printed=0;
  const classes = () => ({values:new Set(),add(value){this.values.add(value);}});
  for(const element of [nav,toc,bottom]) {element.classList=classes();element.children=[];element.append=function(value){this.children.push(value);};element.insertBefore=function(value){this.children.push(value);};}
  nav.querySelector=selector=>selector==='.navlinks'?navigation:null;
  header.querySelector=selector=>selector==='.nav'?nav:null;
  header.getBoundingClientRect=()=>({height:72,bottom:80});
  toc.querySelector=selector=>selector==='strong'?heading:null;
  toc.querySelectorAll=()=>links;
  const navLink=new Element('Projects');navigation.children=[navLink];
  navigation.querySelector=selector=>selector==='a'?navLink:null;
  nav.contains=target=>target===nav||navigation.contains(target)||nav.children.some(child=>child.contains(target));
  const properties={};const events={},documentEvents={};
  const context={
    document:{querySelector:selector=>({'.topbar':header,'.case-toc':toc,'.case-bottom':bottom}[selector]||null),querySelectorAll:selector=>selector==='a[href^="#"]'?links:[],getElementById:id=>sections[id],addEventListener:(name,fn)=>{(documentEvents[name]||=[]).push(fn);},createElement:()=>{const element=new Element();element.children=[];element.append=function(child){this.children.push(child);};return element;},documentElement:{scrollHeight:2000,style:{setProperty:(name,value)=>{properties[name]=value;}}}},
    window:{print:()=>{printed++;}},innerWidth:390,innerHeight:600,scrollY:0,
    addEventListener:(name,action)=>{events[name]=action;},requestAnimationFrame:action=>action(),
  };
  vm.runInNewContext(source,context);
  return {nav,navigation,navLink,header,toc,bottom,links,sections,context,properties,events,menu:nav.children[0],toggle:toc.children[0],tocLinks:toc.children[1],printed:()=>printed,pointer:target=>(documentEvents.pointerdown||[]).forEach(fn=>fn({target}))};
}
test('phone menu has associated controls and starts collapsed',()=>{const f=navigationFixture();assert.equal(f.menu.getAttribute('aria-controls'),'primary-links');assert.equal(f.menu.getAttribute('aria-expanded'),'false');assert.equal(f.properties['--nav-clearance'],'104px');});
test('a contents link hidden by a compact breakpoint returns focus to its toggle',()=>{const f=navigationFixture();f.links[1].hidden=true;f.toc.events.focusout({target:f.links[1],relatedTarget:null});assert.equal(f.toggle.focused,true);});
test('a main-menu toggle hidden by a wide breakpoint moves focus to visible navigation',()=>{const f=navigationFixture();f.menu.hidden=true;f.nav.events.focusout({target:f.menu,relatedTarget:null});assert.equal(f.navLink.focused,true);});
test('a contents toggle hidden by a wide breakpoint moves focus into the visible contents',()=>{const f=navigationFixture();f.toggle.hidden=true;f.tocLinks.querySelector=()=>f.links[0];f.toc.events.focusout({target:f.toggle,relatedTarget:null});assert.equal(f.links[0].focused,true);});
test('responsive focus recovery does not override an ordinary destination',()=>{const f=navigationFixture();f.links[1].hidden=true;f.toc.events.focusout({target:f.links[1],relatedTarget:f.sections.results});assert.equal(f.toggle.focused,undefined);});
test('blurring a rendered control does not force focus back into navigation',()=>{const f=navigationFixture();f.toc.events.focusout({target:f.links[1],relatedTarget:null});assert.equal(f.toggle.focused,undefined);});
test('keyboard focus leaving the main menu collapses it without stealing focus',()=>{const f=navigationFixture();f.menu.events.click();f.nav.events.focusout({target:f.navLink,relatedTarget:f.sections.results});assert.equal(f.menu.getAttribute('aria-expanded'),'false');assert.equal(f.menu.focused,undefined);});
test('keyboard focus leaving project contents collapses the disclosure',()=>{const f=navigationFixture();f.toggle.events.click();f.toc.events.focusout({target:f.links[2],relatedTarget:f.sections.results});assert.equal(f.toggle.getAttribute('aria-expanded'),'false');assert.equal(f.toggle.focused,undefined);});
test('moving focus within a disclosure keeps its links available',()=>{const f=navigationFixture();f.menu.events.click();f.nav.events.focusout({target:f.menu,relatedTarget:f.navLink});assert.equal(f.menu.getAttribute('aria-expanded'),'true');f.toggle.events.click();f.toc.events.focusout({target:f.links[0],relatedTarget:f.links[1]});assert.equal(f.toggle.getAttribute('aria-expanded'),'true');});
test('phone menu toggles and Escape restores focus',()=>{const f=navigationFixture();f.menu.events.click();assert.equal(f.menu.getAttribute('aria-expanded'),'true');f.nav.events.keydown({key:'Escape'});assert.equal(f.menu.getAttribute('aria-expanded'),'false');assert.equal(f.menu.focused,true);});
test('navigation selection closes the menu',()=>{const f=navigationFixture();f.menu.events.click();f.navigation.events.click({target:f.links[0]});assert.equal(f.menu.getAttribute('aria-expanded'),'false');});
test('outside taps dismiss the phone menu without leaving focus hidden',()=>{const f=navigationFixture();f.menu.events.click();f.context.document.activeElement=f.navLink;f.pointer(new Element('outside'));assert.equal(f.menu.getAttribute('aria-expanded'),'false');assert.equal(f.menu.focused,true);});
test('pointer interaction inside the phone menu does not dismiss it',()=>{const f=navigationFixture();f.menu.events.click();f.pointer(f.navLink);assert.equal(f.menu.getAttribute('aria-expanded'),'true');});
test('outside taps dismiss compact project contents and restore hidden link focus',()=>{const f=navigationFixture();f.toggle.events.click();f.context.document.activeElement=f.links[1];f.pointer(new Element('outside'));assert.equal(f.toggle.getAttribute('aria-expanded'),'false');assert.equal(f.toggle.focused,true);});
test('wide-screen contents are not collapsed by outside interaction',()=>{const f=navigationFixture();f.context.innerWidth=1280;f.toggle.events.click();f.pointer(new Element('outside'));assert.equal(f.toggle.getAttribute('aria-expanded'),'true');});
test('project contents toggle and Escape restore focus',()=>{const f=navigationFixture();f.toggle.events.click();assert.equal(f.toggle.getAttribute('aria-expanded'),'true');f.toc.events.keydown({key:'Escape'});assert.equal(f.toggle.getAttribute('aria-expanded'),'false');assert.equal(f.toggle.focused,true);});
test('project section selection collapses phone contents',()=>{const f=navigationFixture();f.toggle.events.click();f.tocLinks.events.click({target:f.links[1]});assert.equal(f.toggle.getAttribute('aria-expanded'),'false');});
test('section navigation focuses the destination',()=>{const f=navigationFixture();f.links[1].events.click({});assert.equal(f.sections.results.tabIndex,-1);assert.equal(f.sections.results.focused,true);});
test('modified clicks retain normal browser behavior',()=>{const f=navigationFixture();f.links[1].events.click({ctrlKey:true});assert.equal(f.sections.results.focused,undefined);});
test('active section follows scroll position',()=>{const f=navigationFixture();f.context.scrollY=1000;f.events.scroll();assert.equal(f.links[1].getAttribute('aria-current'),'location');assert.equal(f.links[0].getAttribute('aria-current'),undefined);});
test('compact contents track a heading visible below the sticky bar',()=>{const f=navigationFixture();f.context.scrollY=640;f.events.scroll();assert.equal(f.links[1].getAttribute('aria-current'),'location');f.context.innerWidth=1280;f.events.resize();assert.equal(f.links[0].getAttribute('aria-current'),'location');});
test('last section is active at page bottom',()=>{const f=navigationFixture();f.context.scrollY=1400;f.events.scroll();assert.equal(f.links[2].getAttribute('aria-current'),'location');});
test('print control invokes the browser print workflow',()=>{const f=navigationFixture();f.bottom.children[0].events.click();assert.equal(f.printed(),1);});

function tableFixture({width=700,content=700,resizeObserver=true,description=null}={}) {
  const wrap=Object.assign(new Element(),{clientWidth:width,scrollWidth:content,tabIndex:0});
  const table=new Element(),events={},observed=[];let hint,update;
  wrap.querySelector=selector=>selector==='table'?table:null;
  wrap.before=value=>{hint=value;};
  wrap.setAttribute('role','region');wrap.setAttribute('aria-label','Engineering Results');
  if(description)wrap.setAttribute('aria-describedby',description);
  class ResizeObserver {constructor(fn){update=fn;}observe(target){observed.push(target);}}
  const context={document:{querySelector:()=>null,querySelectorAll:selector=>selector==='.table-wrap'?[wrap]:[],createElement:()=>new Element()},window:resizeObserver?{ResizeObserver}:{},ResizeObserver,addEventListener:(name,fn)=>{events[name]=fn;}};
  vm.runInNewContext(source,context);
  return {wrap,table,observed,hint:()=>hint,resize:(width,content)=>{wrap.clientWidth=width;wrap.scrollWidth=content;(update||events.resize)();}};
}
test('fully visible tables do not add a noninteractive keyboard stop',()=>{const f=tableFixture();assert.equal(f.wrap.tabIndex,-1);assert.equal(f.hint().hidden,true);assert.equal(f.wrap.getAttribute('role'),'region');assert.equal(f.wrap.getAttribute('aria-label'),'Engineering Results');});
test('overflowing tables retain keyboard panning and its description',()=>{const f=tableFixture({width:320,content:700});assert.equal(f.wrap.tabIndex,0);assert.equal(f.hint().hidden,false);assert.equal(f.wrap.getAttribute('aria-describedby'),'table-scroll-hint-1');assert.deepEqual(f.observed,[f.wrap,f.table]);});
test('table keyboard access follows layout changes without moving focus',()=>{const f=tableFixture();f.wrap.focus();f.resize(320,700);assert.equal(f.wrap.tabIndex,0);assert.equal(f.wrap.focused,true);f.resize(700,700);assert.equal(f.wrap.tabIndex,-1);assert.equal(f.wrap.focused,true);assert.equal(f.wrap.getAttribute('aria-describedby'),undefined);});
test('table resize fallback preserves existing descriptions in both layouts',()=>{const f=tableFixture({resizeObserver:false,description:'source-note'});assert.equal(f.wrap.getAttribute('aria-describedby'),'source-note');f.resize(320,700);assert.equal(f.wrap.tabIndex,0);assert.equal(f.wrap.getAttribute('aria-describedby'),'source-note table-scroll-hint-1');f.resize(700,700);assert.equal(f.wrap.tabIndex,-1);assert.equal(f.wrap.getAttribute('aria-describedby'),'source-note');});
console.log(`${cases} portfolio regression tests passed.`);
