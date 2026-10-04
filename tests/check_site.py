from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parents[1]
errors = []
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(); self.path=path; self.refs=[]; self.ids=set(); self.h1=0; self.images=0; self.tables=0; self.captions=0; self.canonical=None
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a:
            if a['id'] in self.ids: errors.append(f'{self.path.name}: duplicate id {a["id"]}')
            self.ids.add(a['id'])
        if tag=='h1': self.h1+=1
        if tag=='table': self.tables+=1
        if tag=='caption': self.captions+=1
        if tag=='th' and a.get('scope') not in ['row','col']: errors.append(f'{self.path.name}: unscoped table header')
        if tag=='a' and a.get('target')=='_blank' and not ('noreferrer' in a.get('rel','') or 'noopener' in a.get('rel','')): errors.append(f'{self.path.name}: unsafe new-tab link')
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href')
        if tag in ['a','link','script','img']:
            url=a.get('href') or a.get('src')
            if url: self.refs.append(url)
        if tag=='img':
            self.images+=1
            if not a.get('alt'): errors.append(f'{self.path.name}: missing image description')
            if not a.get('width') or not a.get('height'): errors.append(f'{self.path.name}: missing image dimensions')

pages={}
for path in root.rglob('*.html'):
    page=Page(path); page.feed(path.read_text(encoding='utf-8')); pages[path.resolve()]=page
    if page.h1!=1: errors.append(f'{path.name}: expected one h1, got {page.h1}')
    text=path.read_text(encoding='utf-8')
    if 'projects' in path.parts and 'case-brief' not in text: errors.append(f'{path.name}: missing project brief')
    if 'Mpa' in text or '· Mechanical engineering' in text: errors.append(f'{path.name}: capitalization regression')
    if '<h2 id="section-8">Project Paper</h2>' in text: errors.append(f'{path.name}: empty section')
    if page.tables != page.captions: errors.append(f'{path.name}: table without an accessible caption')
    if path.name!='404.html':
        expected='https://dustin07.github.io/DustinPortfolio/' + (path.relative_to(root).as_posix() if path.name!='index.html' else '')
        if page.canonical!=expected: errors.append(f'{path.name}: incorrect canonical address')
for path,page in pages.items():
    for url in page.refs:
        u=urlsplit(url)
        if u.scheme or u.netloc: continue
        target=(path.parent / unquote(u.path)).resolve() if u.path else path
        if not target.is_file(): errors.append(f'{path.name}: missing target {url}')
        elif u.fragment and target in pages and u.fragment not in pages[target].ids: errors.append(f'{path.name}: missing fragment {url}')
sitemap=ET.parse(root/'sitemap.xml')
urls={element.text for element in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
expected_urls={page.canonical for path,page in pages.items() if path.name!='404.html'}
if urls!=expected_urls: errors.append('Sitemap does not match canonical site pages')
home=(root/'index.html').read_text(encoding='utf-8')
library=Page(root/'index.html'); library.feed(home)
project_targets={urlsplit(url).path for url in library.refs if url.startswith('projects/')}
expected_projects={path.relative_to(root).as_posix() for path in root.joinpath('projects').glob('*.html')}
if project_targets!=expected_projects: errors.append('Project library does not link every case study')
if home.count('class="project-card"')!=len(expected_projects): errors.append('Project library card count does not match case studies')
schema=home.split('<script type="application/ld+json">')[1].split('</script>')[0]
if json.loads(schema).get('name')!='Dustin Leung': errors.append('Invalid portfolio structured data')
print(f'Checked {len(pages)} pages, {sum(len(p.refs) for p in pages.values())} references, {sum(p.images for p in pages.values())} images, and sitemap/metadata.')
if errors:
    print('\n'.join(errors)); raise SystemExit(1)
print('PASS: local links, fragments, image descriptions, headings, and project summaries.')
