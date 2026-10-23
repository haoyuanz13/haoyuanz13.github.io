#!/usr/bin/env python3
"""Refresh the public Flag Counter snapshot without adding an artificial visit."""
import argparse
import html
import json
from pathlib import Path
import re
import urllib.request
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent.parent
SOURCE = 'https://s01.flagcounter.com/countries/GMWI/'

def text(value):
    return ' '.join(html.unescape(re.sub(r'<[^>]*>', ' ', value)).split())

def parse(source, locations):
    countries, regions, unresolved = [], [], []
    current = None
    rows = re.finditer(r'<tr\b[^>]*>((?:(?!<tr\b).)*?)</tr>', source, re.I | re.S)
    for match in rows:
        row = match[1]
        cells = [text(c) for c in re.findall(r'<td\b[^>]*>(.*?)</td>', row, re.I | re.S)]
        cc = re.search(r'/detail30/([a-z]{2})/GMWI', row, re.I)
        if cc:
            code = cc[1].lower()
            name = re.search(r'<a\b[^>]*href=["\']https://en\.wikipedia\.org/wiki/[^"\']+["\'][^>]*>\s*<u>(.*?)</u>\s*</a>', row, re.I | re.S)
            count = next((int(c.replace(',', '')) for c in cells if re.fullmatch(r'[\d,]+', c)), None)
            if not name or count is None:
                continue
            current = {'name': text(name[1]), 'code': code, 'visitors': count}
            coord = locations['countries'].get(code)
            if coord:
                current.update({k: coord[k] for k in ['longitude', 'latitude']})
            countries.append(current)
            continue
        state = re.search(r'cdn\.boardhost\.com/(states|provinces|canada)/([a-z]{2})\.png', row, re.I)
        if state and current and len(cells) >= 5:
            key = current['code'] + '-' + state[2].lower()
            coord = locations['regions'].get(key)
            if not re.fullmatch(r'[\d,]+', cells[4]):
                continue
            entry = {'name': cells[3], 'country': current['name'], 'country_code': current['code'], 'visitors': int(cells[4].replace(',', '')), 'level': 'state' if current['code'] == 'us' else 'province'}
            if coord:
                entry.update({k: coord[k] for k in ['longitude', 'latitude']})
            regions.append(entry)
    if not countries or any(not c['name'] for c in countries) or len({c['code'] for c in countries}) != len(countries):
        raise ValueError('No valid unique country records; keeping existing snapshot')
    expected = re.search(r'Countries\s+1\s*-\s*\d+\s+of\s+(\d+)', text(source))
    if expected and len(countries) != int(expected[1]):
        raise ValueError('Country table is incomplete; keeping existing snapshot')
    for country in countries:
        children = [r for r in regions if r['country_code'] == country['code']]
        subtotal = sum(r['visitors'] for r in children)
        if subtotal > country['visitors']:
            raise ValueError('Regional sum exceeds country total; source may be changing')
        if children and subtotal < country['visitors']:
            unresolved.append({'country': country['name'], 'visitors': country['visitors'] - subtotal})
    return countries, regions, unresolved

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--html', type=Path, help='Parse a local fixture without fetching the provider')
    args = parser.parse_args()
    if args.html:
        source = args.html.read_text()
    else:
        req = urllib.request.Request(SOURCE, headers={'User-Agent': 'Haoyuan-site-statistics/1.0'})
        with urllib.request.urlopen(req, timeout=30) as response:
            source = response.read().decode('utf-8')
    path = ROOT / 'assets/profile/visitor-data.json'
    old = json.loads(path.read_text())
    countries, regions, unresolved = parse(source, json.loads((ROOT / 'scripts/visitor-locations.json').read_text()))
    new = dict(old, source=SOURCE, data=countries, regional_data=regions, unresolved_regions=unresolved,
               total_visitors=sum(c['visitors'] for c in countries), total_countries=len(countries), schema_version=2)
    def contents(d): return {k:v for k,v in d.items() if k not in ['updated', 'updated_at']}
    if contents(new) == contents(old):
        print('Statistics unchanged; no commit needed.')
        return
    new['updated_at'] = datetime.now(timezone.utc).isoformat(timespec='seconds')
    new['updated'] = new['updated_at'][:10]
    path.write_text(json.dumps(new, ensure_ascii=False, indent=2) + '\n')
    print(f"Updated {new['total_visitors']} visitors, {new['total_countries']} countries/regions, {len(regions)} regional records.")

if __name__ == '__main__':
    main()
