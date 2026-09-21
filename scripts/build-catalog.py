#!/usr/bin/env python3
"""Build the catalogue views from the single source of truth.

  catalog/resources.jsonl + catalog/sections.json
      -> skills/design-studio/references/resources/<domain>.md   (read by agents at runtime)
      -> docs/catalog.js                                         (read by docs/index.html)

The views are generated so they cannot drift from the catalogue. Never edit
them by hand: change the JSONL, run this script, commit both.

Usage:
  scripts/build-catalog.py            # write the views
  scripts/build-catalog.py --check    # exit 1 if the views on disk are stale or the catalogue is invalid
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CATALOG = ROOT / 'catalog' / 'resources.jsonl'
SECTIONS = ROOT / 'catalog' / 'sections.json'
REF_DIR = ROOT / 'skills' / 'design-studio' / 'references' / 'resources'
DOCS_JS = ROOT / 'docs' / 'catalog.js'

KINDS = {'gallery', 'pattern-library', 'archive', 'feed', 'community', 'tool', 'assets', 'library',
         'design-system', 'guideline', 'article', 'book', 'course', 'blog', 'skill'}
REQUIRED = ('id', 'name', 'url', 'domain', 'section', 'kind', 'tags', 'best_for', 'access', 'login',
            'agent_access', 'tier', 'updated', 'lang', 'origin', 'added')
ENUMS = {'access': {'free', 'freemium', 'paid'},
         'agent_access': {'static', 'js', 'blocked', 'unknown'},
         'tier': {'S', 'A', 'B'},
         'updated': {'active', 'slow', 'archived'}}
HEADER = ('<!-- Generated from catalog/resources.jsonl by scripts/build-catalog.py. '
          'Do not edit by hand. -->')
LEGEND = ('Access reads `cost · agent access · licence`. Agent access: `static` = a plain web fetch can '
          'read it; `js` = needs a real browser; `blocked` = bot protection or a login wall, send the '
          'user the link instead; `unknown` = could not be reached from the maintainer\'s network when '
          'last checked (not proof that it is down). `login` = content is gated. '
          'Tier: `S` first place to look, `A` strong, `B` niche or with a clear weakness.')


def load():
    entries = [json.loads(l) for l in CATALOG.read_text().splitlines() if l.strip()]
    sections = json.loads(SECTIONS.read_text())
    return entries, sections


def validate(entries, sections):
    errors, ids, urls = [], set(), {}
    norm = lambda u: re.sub(r'^https?://(www\.)?', '', u).rstrip('/').lower()
    for n, e in enumerate(entries, 1):
        where = f"line {n} ({e.get('id', '?')})"
        for key in REQUIRED:
            if key not in e:
                errors.append(f'{where}: missing {key}')
        for key, allowed in ENUMS.items():
            if e.get(key) not in allowed:
                errors.append(f'{where}: {key}={e.get(key)!r} not in {sorted(allowed)}')
        if e.get('kind') not in KINDS:
            errors.append(f"{where}: kind={e.get('kind')!r}")
        if not re.fullmatch(r'[a-z0-9][a-z0-9-]*', e.get('id', '')):
            errors.append(f'{where}: id must be kebab-case')
        if e.get('id') in ids:
            errors.append(f'{where}: duplicate id')
        ids.add(e.get('id'))
        key = norm(e.get('url', ''))
        if key in urls:
            errors.append(f'{where}: duplicate url (also {urls[key]})')
        urls[key] = e.get('id')
        domain = sections.get(e.get('domain'))
        if not domain:
            errors.append(f"{where}: unknown domain {e.get('domain')!r}")
        elif e.get('section') not in {s[0] for s in domain['sections']}:
            errors.append(f"{where}: section {e.get('section')!r} not declared for {e['domain']}")
        for field in ('name', 'best_for', 'how_to_use', 'license'):
            if '|' in e.get(field, ''):
                errors.append(f'{where}: "|" in {field} would break the table')
    return errors


def cell(text):
    return text.replace('\n', ' ').strip()


def render_domain(domain, meta, entries):
    rank = {'S': 0, 'A': 1, 'B': 2}
    out = [HEADER, f"# Resources: {meta['title']}", '', meta['intro'], '', LEGEND, '']
    for sid, title, guidance in meta['sections']:
        rows = [e for e in entries if e['domain'] == domain and e['section'] == sid]
        if not rows:
            continue
        rows.sort(key=lambda e: rank[e['tier']])          # stable: authored order inside a tier
        out += [f'## {title}', '', guidance, '',
                '| Resource | Best for | How to use | Access | Tier |', '| --- | --- | --- | --- | --- |']
        for e in rows:
            name = e['name'] + (f" ({e['lang']})" if e['lang'] != 'en' else '')
            access = [e['access'], e['agent_access']]
            if e['login']:
                access.append('login')
            if e.get('license'):
                access.append(e['license'])
            if e['updated'] != 'active':
                access.append(e['updated'])
            out.append(f"| [{cell(name)}]({e['url']}) | {cell(e['best_for'])} | "
                       f"{cell(e.get('how_to_use', ''))} | {' · '.join(access)} | {e['tier']} |")
        out.append('')
    return '\n'.join(out)


def build():
    entries, sections = load()
    errors = validate(entries, sections)
    if errors:
        sys.exit('catalogue invalid:\n  ' + '\n  '.join(errors))
    files = {REF_DIR / f'{d}.md': render_domain(d, meta, entries) for d, meta in sections.items()}
    payload = {'domains': {d: {'title': m['title'], 'intro': m['intro'],
                               'sections': [{'id': s[0], 'title': s[1], 'note': s[2]} for s in m['sections']]}
                           for d, m in sections.items()},
               'resources': entries}
    files[DOCS_JS] = ('// Generated by scripts/build-catalog.py. Do not edit by hand.\n'
                      'window.CATALOG = ' + json.dumps(payload, ensure_ascii=False, separators=(',', ':')) + ';\n')
    return files, entries


def main():
    files, entries = build()
    if '--check' in sys.argv:
        stale = [str(p.relative_to(ROOT)) for p, text in files.items()
                 if not p.exists() or p.read_text() != text]
        if stale:
            sys.exit('stale generated views (run scripts/build-catalog.py):\n  ' + '\n  '.join(stale))
        print(f'OK  catalogue valid, {len(entries)} entries, {len(files)} views fresh')
        return
    for path, text in files.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
    tiers = {t: sum(e['tier'] == t for e in entries) for t in 'SAB'}
    print(f'{len(entries)} entries ({tiers}) -> {len(files)} views')


if __name__ == '__main__':
    main()
