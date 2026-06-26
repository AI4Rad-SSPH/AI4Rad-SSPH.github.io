#!/usr/bin/env python3
"""
migrate-pubs.py — one-off migration: extract papers from data/members/*.json
into individual data/publications/<id>.json files with merged author_ids.

Run once. Then manually fix type/year/doi/topic, then run build-pubs.py.
Does NOT modify member files — that's a separate manual step.
"""
import json, glob, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "publications"
OUT.mkdir(parents=True, exist_ok=True)


def slug(title):
    t = re.sub(r'[^a-z0-9 ]', '', title.lower())
    words = [w for w in t.split() if w not in ('a','an','the','of','for','and','to','on','in','with','based','from')]
    words = words[:4]
    return '-'.join(words) or 'paper'


def parse_year(venue):
    m = re.search(r'(20\d{2}|19\d{2})', venue or '')
    return int(m.group(1)) if m else None


def guess_type(group_label, venue):
    gl = (group_label or '').lower()
    v = (venue or '').lower()
    if 'conference' in gl or 'meeting' in gl or v in ('iclr','neurips','cvpr','miccai','isbi','eccv','iccv'):
        return 'conference'
    if 'preprint' in gl or 'arxiv' in v:
        return 'preprint'
    if 'journal' in gl or 'annals' in v or 'radiology' in v or 'communications' in v:
        return 'journal'
    return 'journal'


merged = {}  # slug -> paper dict
order = []

for f in sorted(glob.glob(str(ROOT / 'data' / 'members' / '*.json'))):
    if '_template' in f:
        continue
    m = json.load(open(f))
    mid = m['id']
    for g in m.get('publications', []):
        glabel = g.get('group_en', '')
        for p in g.get('items', []):
            title = p.get('title', '').strip()
            if not title:
                continue
            key = slug(title)
            if key not in merged:
                merged[key] = {
                    'id': key,
                    'title': title,
                    'authors_text': p.get('authors', ''),
                    'author_ids': [],
                    'type': guess_type(glabel, p.get('venue', '')),
                    'year': parse_year(p.get('venue', '')),
                    'venue': p.get('venue', '').strip(),
                    'tags': p.get('tags', []),
                    'doi': '',
                    'links': {},
                    'topic': [],
                    'featured': bool(p.get('featured', False)),
                }
                # carry over url -> links / doi-ish
                if p.get('url'):
                    merged[key]['links']['pdf'] = p['url']
                if p.get('img'):
                    merged[key]['cover'] = p['img']
                if p.get('cites') is not None:
                    merged[key]['_cites'] = p['cites']
                # existing structured links
                for lk in p.get('links', []) or []:
                    label = lk.get('label', '').lower()
                    url = lk.get('url', '')
                    if label == 'doi':
                        merged[key]['doi'] = url.split('doi.org/')[-1] if 'doi.org/' in url else url
                        merged[key]['links']['doi'] = url
                    else:
                        merged[key]['links'][label] = url
                order.append(key)
            # merge author_ids
            if mid not in merged[key]['author_ids']:
                merged[key]['author_ids'].append(mid)
            # keep richest version of fields
            if not merged[key]['authors_text'] and p.get('authors'):
                merged[key]['authors_text'] = p['authors']
            if not merged[key]['year']:
                merged[key]['year'] = parse_year(p.get('venue', ''))

n = 0
for key in order:
    p = merged[key]
    if (OUT / f'{key}.json').exists():
        continue
    out = {k: v for k, v in p.items() if not k.startswith('_')}
    (OUT / f'{key}.json').write_text(
        json.dumps(out, ensure_ascii=False, indent=2),
        encoding='utf-8',
    )
    n += 1

print(f'Wrote {n} publication files (out of {len(merged)} unique papers)')
print('Next: manually review type/year/doi/topic, then run build-pubs.py')
