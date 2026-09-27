#!/usr/bin/env python3
"""Build research/INDEX.md from the source digests and the skills that cite them.

Inputs
  research/sources/<id>.md     one digest per primary source; its header block is parsed:
                                 # <Title>
                                 - id: <id> · url: <url> · fetched: YYYY-MM-DD · method: <m>[ + <m>...]
                                 - review_by: YYYY-MM-DD [(note)] · licence note: <text>
                                 - superseded_by: <id> [(note)]          (optional)
                               method tokens: fetch | browser | json-api | repo@<sha>
  skills/**/*.md               frontmatter "sources: [id, id]" (or a YAML block list) gives cited-by

Output (generated; never edit by hand)
  research/INDEX.md            every source sorted by id: title, fetched, method, review_by (overdue
                               marked), superseded_by, cited-by

Usage
  scripts/build-research-index.py                   validate, then write research/INDEX.md
  scripts/build-research-index.py --check           exit 1 if a header is malformed, a skill cites an
                                                    unknown id, or INDEX.md is stale
  add --warn-unknown to either form                 report unknown cited ids as warnings, not errors

"Overdue" is judged against today's date, so INDEX.md goes stale the day a review_by passes: --check then
fails until the source is re-reviewed (new fetched + review_by) and the index is rebuilt.
"""
import datetime
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES = ROOT / 'research' / 'sources'
SKILLS = ROOT / 'skills'
INDEX = ROOT / 'research' / 'INDEX.md'

REQUIRED = ('id', 'url', 'fetched', 'method', 'review_by', 'licence note')
METHOD = re.compile(r'^(fetch|browser|json-api|repo@[0-9a-f]{7,40})$')
DATE = re.compile(r'^(\d{4}-\d{2}-\d{2})\b')
MAX_REVIEW_DAYS = 366          # durable sources: +365 days; perishable: +90 days


def parse_date(value):
    m = DATE.match(value or '')
    if not m:
        return None
    try:
        return datetime.date.fromisoformat(m.group(1))
    except ValueError:
        return None


def parse_header(path):
    """Return (record, errors) for one digest. The header is the title line plus the '- ' lines after it."""
    lines = path.read_text().split('\n')
    rel = path.relative_to(ROOT)
    errors = []
    if not lines or not lines[0].startswith('# ') or not lines[0][2:].strip():
        return None, [f'{rel}: line 1 must be "# <Title>"']
    rec = {'title': lines[0][2:].strip(), 'file': path}
    for line in lines[1:]:
        if not line.startswith('- '):
            break
        for part in line[2:].split('·'):
            key, sep, value = part.strip().partition(':')
            if sep:
                rec.setdefault(key.strip(), value.strip())
    for key in REQUIRED:
        if not rec.get(key):
            errors.append(f'{rel}: header has no "{key}:"')
    if rec.get('id') and rec['id'] != path.stem:
        errors.append(f'{rel}: id "{rec["id"]}" must equal the file name "{path.stem}"')
    if rec.get('url') and not re.match(r'^https?://\S+$', rec['url']):
        errors.append(f'{rel}: url must be one http(s) address, got "{rec["url"]}"')
    fetched, review_by = parse_date(rec.get('fetched')), parse_date(rec.get('review_by'))
    if rec.get('fetched') and not fetched:
        errors.append(f'{rel}: fetched must be YYYY-MM-DD, got "{rec["fetched"]}"')
    if rec.get('review_by') and not review_by:
        errors.append(f'{rel}: review_by must start with YYYY-MM-DD, got "{rec["review_by"]}"')
    if fetched and review_by and not 0 < (review_by - fetched).days <= MAX_REVIEW_DAYS:
        errors.append(f'{rel}: review_by {review_by} must fall within {MAX_REVIEW_DAYS} days after fetched {fetched}')
    for token in (t.strip() for t in rec.get('method', '').split('+')):
        if rec.get('method') and not METHOD.match(token):
            errors.append(f'{rel}: method token "{token}" is not fetch | browser | json-api | repo@<sha>')
    rec['fetched_date'], rec['review_date'] = fetched, review_by
    rec['superseded_by'] = (rec.get('superseded_by') or '').split(' ')[0].strip() or None
    return rec, errors


def frontmatter_sources(path):
    """The ids listed under "sources:" in a Markdown file's frontmatter (inline list or block list)."""
    m = re.match(r'^---\n(.*?)\n---\n', path.read_text(), re.S)
    if not m:
        return []
    fm = m.group(1)
    inline = re.search(r'^sources:[ \t]*\[(.*?)\][ \t]*$', fm, re.M)
    if inline:
        return [s.strip().strip('\'"') for s in inline.group(1).split(',') if s.strip()]
    block = re.search(r'^sources:[ \t]*\n((?:[ \t]+-[ \t]*.+\n?)+)', fm, re.M)
    if block:
        return [s.strip().strip('\'"') for s in re.findall(r'-[ \t]*(.+)', block.group(1))]
    return []


def load():
    records, errors = {}, []
    for path in sorted(SOURCES.glob('*.md')):
        rec, errs = parse_header(path)
        errors += errs
        if rec and not errs:
            records[rec['id']] = rec
    for rec in records.values():
        target = rec['superseded_by']
        if target and target not in records:
            errors.append(f'{rec["file"].relative_to(ROOT)}: superseded_by "{target}" is not a source id')
    cited, unknown = {}, {}
    for path in sorted(SKILLS.rglob('*.md')):
        rel = path.relative_to(ROOT)
        for sid in frontmatter_sources(path):
            (cited if sid in records else unknown).setdefault(sid, []).append(rel)
    return records, cited, unknown, errors


def cell(text):
    return text.replace('|', '\\|').replace('\n', ' ')


def render(records, cited, today):
    overdue = [r for r in records.values() if r['review_date'] < today]
    uncited = [sid for sid in records if sid not in cited]
    latest = max((r['fetched_date'] for r in records.values()), default=None)
    out = [
        '# Research index',
        '',
        '> 生成物，勿手改。由 `scripts/build-research-index.py` 从 `research/sources/*.md` 的头部与',
        '> `skills/**/*.md` frontmatter 的 `sources:` 生成。说明见 [README.md](README.md)。',
        '',
        f'{len(records)} 份来源摘要 · 被 skill 引用 {len(records) - len(uncited)} 份 · 未被引用 {len(uncited)} 份 · '
        f'逾期未复核 {len(overdue)} 份 · 最近抓取 {latest or "—"}',
        '',
        '| id | 标题 | 抓取 | 方法 | 复核期限 | 取代关系 | 被引用 |',
        '| --- | --- | --- | --- | --- | --- | --- |',
    ]
    replaces = {}
    for rec in records.values():
        if rec['superseded_by']:
            replaces.setdefault(rec['superseded_by'], []).append(rec['id'])
    for sid in sorted(records):
        rec = records[sid]
        review = rec['review_date'].isoformat()
        if rec['review_date'] < today:
            review = f'**逾期** {review}'
        relation = []
        if rec['superseded_by']:
            relation.append(f'由 {rec["superseded_by"]} 取代')
        if sid in replaces:
            relation.append('取代 ' + ', '.join(sorted(replaces[sid])))
        users = ' · '.join(f'[{p.relative_to("skills")}](../{p})' for p in sorted(set(cited.get(sid, []))))
        out.append(f'| [{sid}](sources/{sid}.md) | {cell(rec["title"])} | {rec["fetched_date"]} | '
                   f'{cell(rec["method"])} | {review} | {"; ".join(relation) or "—"} | {users or "—"} |')
    out.append('')
    return '\n'.join(out)


def main():
    check, warn_unknown = '--check' in sys.argv, '--warn-unknown' in sys.argv
    records, cited, unknown, errors = load()
    notes = [f'skill cites unknown source id "{sid}": ' + ', '.join(str(p) for p in paths)
             for sid, paths in sorted(unknown.items())]
    warnings = notes if warn_unknown else []
    if not warn_unknown:
        errors += notes
    for w in warnings:
        print(f'warning: {w}')
    if errors:
        sys.exit('research index invalid:\n  ' + '\n  '.join(errors))
    text = render(records, cited, datetime.date.today())
    rel = INDEX.relative_to(ROOT)
    if check:
        if not INDEX.exists() or INDEX.read_text() != text:
            sys.exit(f'{rel} is stale (run scripts/build-research-index.py)')
        print(f'OK  {len(records)} source headers valid, {rel} fresh, {len(warnings)} warnings')
        return
    INDEX.write_text(text)
    overdue = sum(r['review_date'] < datetime.date.today() for r in records.values())
    print(f'{rel}: {len(records)} sources, {len(cited)} cited by skills, {overdue} overdue, '
          f'{len(unknown)} unknown ids cited')


if __name__ == '__main__':
    main()
