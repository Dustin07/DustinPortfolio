"""Check content-hash asset versions; --write performs only the mechanical URL refresh."""
from pathlib import Path
import argparse
import hashlib
import re
from html import escape, unescape
from urllib.parse import parse_qsl, urlencode

root = Path(__file__).resolve().parents[1]
assets = ['styles.css', 'ambient.js', 'portfolio.js', 'figures.js']
pattern = re.compile(r'((?:href|src)=")((?:\.\./|/DustinPortfolio/|https://dustin07\.github\.io/DustinPortfolio/)?(styles\.css|ambient\.js|portfolio\.js|figures\.js))(\?[^"\s]*)?(\")')

def versioned_html(text, hashes):
    def replace(match):
        params = parse_qsl(unescape((match[4] or '')[1:]), keep_blank_values=True)
        params = [('v', hashes[match[3]])] + [(key, value) for key, value in params if key != 'v']
        query = escape(urlencode(params), quote=False)
        return f'{match[1]}{match[2]}?{query}{match[5]}'
    return pattern.sub(replace, text)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true', help='Refresh stylesheet/script query versions in portfolio HTML only.')
    args = parser.parse_args()
    hashes = {name: hashlib.sha256((root / name).read_bytes()).hexdigest()[:12] for name in assets}
    changed = []
    count = 0
    for path in sorted(root.rglob('*.html')):
        if path.relative_to(root).parts[0] == 'tests':
            continue
        original = path.read_text(encoding='utf-8')
        count += len(pattern.findall(original))
        updated = versioned_html(original, hashes)
        if original != updated:
            changed.append(path.relative_to(root).as_posix())
            if args.write:
                path.write_text(updated, encoding='utf-8', newline='')
    if changed and not args.write:
        print('FAIL: stale asset versions in ' + ', '.join(changed))
        print('Run python tools/version_assets.py --write after stylesheet or script changes.')
        raise SystemExit(1)
    print(f'{"Refreshed" if args.write else "Verified"} {count} content-hash asset references; {len(changed)} pages {"updated" if args.write else "stale"}.')

if __name__ == '__main__':
    main()
