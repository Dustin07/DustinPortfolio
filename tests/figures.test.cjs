const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname,'../figures.js'),'utf8');

class Element {
  constructor(tag, text='') {this.tag=tag;this.tagName=tag.toUpperCase();this.textContent=text;this.children=[];this.events={};this.attrs={};this.classList={values:new Set(),add(value){this.values.add(value);},remove(value){this.values.delete(value);}};}
  append(...elements){this.children.push(...elements);}
  before(element){this.previous=element;}
  setAttribute(name,value){this.attrs[name]=value;}
  addEventListener(name,fn){this.events[name]=fn;}
  focus(){this.focused=true;}
  showModal(){this.open=true;}
  close(){this.open=false;this.events.close();}
  getBoundingClientRect(){return {left:100,top:100,right:600,bottom:500};}
}
function fixture({count=2,supported=true,linked=false,caption=true,currentSrc=true,vector=false,serializer=true}={}) {
  const body=new Element('body'),root=new Element('html'),created=[];
  const images=Array.from({length:count},(_,index)=>{
    const img=new Element(vector?'svg':'img');img.alt=`Geometry ${index}`;img.src=`https://example.test/image-${index}.jpg`;img.currentSrc=currentSrc?`https://example.test/selected-${index}.jpg`:'';
    if(vector){img.querySelector=()=>new Element('title','Vector Geometry');img.viewBox={baseVal:{width:640,height:320}};img.cloneNode=()=>{const copy=new Element('svg');copy.original=img;return copy;};}
    const label=new Element('figcaption',`Figure ${index}. Source and model scope.`);
    label.querySelector=()=>new Element('strong',`Figure ${index}`);
    const figure=new Element('figure');figure.querySelector=()=>caption?label:null;
    img.closest=selector=>selector==='figure'?figure:linked?new Element('a'):null;
    return img;
  });
  const context={document:{body,documentElement:root,querySelectorAll:()=>images,createElement:tag=>{const el=new Element(tag);created.push(el);return el;}},HTMLDialogElement:supported?Element:undefined,XMLSerializer:serializer?class{serializeToString(copy){return `<svg width="${copy.attrs.width}" height="${copy.attrs.height}"/>`;}}:undefined};
  vm.runInNewContext(source,context);
  const dialog=body.children[0],bar=dialog?.children[0],figure=dialog?.children[1],actions=bar?.children[1],media=figure?.children[0];
  return {images,created,dialog,title:bar?.children[0],size:actions?.children[0],close:actions?.children[1],media,image:media?.children[0],caption:figure?.children[1],root};
}
let total=0;const test=(name,fn)=>{fn();total++;console.log('PASS '+name);};
test('pages without raster figures are unchanged',()=>assert.equal(fixture({count:0}).created.length,0));
test('unsupported browsers retain the original readable figures',()=>{const f=fixture({supported:false});assert.equal(f.created.length,0);assert.equal(f.images[0].previous,undefined);});
test('figure triggers have native button and dialog semantics',()=>{const f=fixture();const b=f.images[0].previous;assert.equal(b.tag,'button');assert.equal(b.type,'button');assert.equal(b.attrs['aria-haspopup'],'dialog');assert.equal(b.attrs['aria-label'],'Enlarge: Geometry 0');});
test('already linked images are not nested inside a button',()=>assert.equal(fixture({linked:true}).images[0].previous,undefined));
test('original images are moved rather than duplicated or rewritten',()=>{const f=fixture();assert.equal(f.images[0].previous.children[0],f.images[0]);assert.equal(f.images[0].src,'https://example.test/image-0.jpg');});
test('opening uses the currently selected source and the source caption',()=>{const f=fixture();f.images[1].previous.events.click();assert.equal(f.dialog.open,true);assert.equal(f.image.src,'https://example.test/selected-1.jpg');assert.equal(f.image.alt,'Geometry 1');assert.equal(f.title.textContent,'Figure 1');assert.equal(f.caption.textContent,'Figure 1. Source and model scope.');});
test('a missing currentSrc falls back to the source URL',()=>{const f=fixture({currentSrc:false});f.images[0].previous.events.click();assert.equal(f.image.src,f.images[0].src);});
test('a missing caption falls back to the image description',()=>{const f=fixture({caption:false});f.images[0].previous.events.click();assert.equal(f.title.textContent,'Project Figure');assert.equal(f.caption.textContent,'Geometry 0');});
test('opening focuses Close and prevents underlying-page scrolling',()=>{const f=fixture();f.images[0].previous.events.click();assert.equal(f.close.focused,true);assert.equal(f.root.classList.values.has('figure-viewer-open'),true);});
test('Tab cycles through viewer controls without overriding Escape',()=>{const f=fixture();let prevented=0;f.dialog.events.keydown({key:'Tab',target:f.close,preventDefault:()=>prevented++});assert.equal(prevented,1);assert.equal(f.size.focused,true);f.dialog.events.keydown({key:'Escape',preventDefault:()=>prevented++});assert.equal(prevented,1);});
test('closing restores focus and page scrolling',()=>{const f=fixture();f.images[1].previous.events.click();f.close.events.click();assert.equal(f.dialog.open,false);assert.equal(f.root.classList.values.has('figure-viewer-open'),false);assert.equal(f.images[1].previous.focused,true);});
test('backdrop dismissal requires pointerdown and click outside',()=>{const f=fixture();f.images[0].previous.events.click();const e={target:f.dialog,clientX:50,clientY:50};f.dialog.events.pointerdown(e);f.dialog.events.click(e);assert.equal(f.dialog.open,false);});
test('dragging from the image to the backdrop keeps the viewer open',()=>{const f=fixture();f.images[0].previous.events.click();f.dialog.events.pointerdown({target:f.image,clientX:200,clientY:200});f.dialog.events.click({target:f.dialog,clientX:50,clientY:50});assert.equal(f.dialog.open,true);});
test('clicking dialog padding does not dismiss the image',()=>{const f=fixture();f.images[0].previous.events.click();const e={target:f.dialog,clientX:110,clientY:110};f.dialog.events.pointerdown(e);f.dialog.events.click(e);assert.equal(f.dialog.open,true);});
test('each subsequent opening updates the single shared viewer',()=>{const f=fixture();f.images[0].previous.events.click();f.close.events.click();f.images[1].previous.events.click();assert.equal(f.image.alt,'Geometry 1');assert.equal(f.created.filter(e=>e.tag==='dialog').length,1);});
test('vector figures use isolated data images and preserve dimensions',()=>{const f=fixture({vector:true});f.images[0].previous.events.click();assert.equal(f.image.alt,'Vector Geometry');assert.ok(f.image.src.startsWith('data:image/svg+xml;charset=utf-8,'));assert.match(decodeURIComponent(f.image.src),/<svg width="640" height="320"/);assert.equal(f.images[0].attrs.width,undefined);});
test('SVG export is optional and unsupported vectors stay readable',()=>{const f=fixture({vector:true,serializer:false});assert.equal(f.images[0].previous,undefined);});
test('actual-size control exposes a keyboard-scrollable detail region',()=>{const f=fixture();f.images[0].previous.events.click();f.size.events.click();assert.equal(f.size.attrs['aria-pressed'],'true');assert.equal(f.media.tabIndex,0);assert.equal(f.dialog.classList.values.has('is-actual-size'),true);assert.equal(f.media.attrs['aria-label'],'Figure Detail');});
test('fit mode removes the extra pan stop and resets its offsets',()=>{const f=fixture();f.images[0].previous.events.click();f.size.events.click();f.media.scrollLeft=100;f.media.scrollTop=50;f.size.events.click();assert.equal(f.media.tabIndex,-1);assert.equal(f.media.scrollLeft,0);assert.equal(f.media.scrollTop,0);assert.equal(f.size.attrs['aria-pressed'],'false');});
test('Tab includes the detail region only in actual-size mode',()=>{const f=fixture();f.images[0].previous.events.click();f.size.events.click();f.dialog.events.keydown({key:'Tab',target:f.close,preventDefault:()=>{}});assert.equal(f.media.focused,true);});
test('Shift-Tab cycles backward through modal controls',()=>{const f=fixture();f.images[0].previous.events.click();f.dialog.events.keydown({key:'Tab',target:f.size,shiftKey:true,preventDefault:()=>{}});assert.equal(f.close.focused,true);});
test('each opening starts fitted rather than inheriting a panned view',()=>{const f=fixture();f.images[0].previous.events.click();f.size.events.click();f.media.scrollLeft=100;f.close.events.click();f.images[1].previous.events.click();assert.equal(f.media.tabIndex,-1);assert.equal(f.media.scrollLeft,0);assert.equal(f.size.attrs['aria-pressed'],'false');});
console.log(`${total} figure viewer checks passed.`);
