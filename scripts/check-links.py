#!/usr/bin/env python3
"""Mechanical liveness and agent-access check for catalog/resources.jsonl.

Verification costs no model tokens: every entry is fetched with curl, and
`agent_access` is classified from what actually came back, not from a guess.

  static   content is in the HTML; a plain web fetch can read it
  js       200 but an almost empty shell; needs a real browser
  blocked  bot protection / auth wall answered instead of the site
  dead     the server answered 404/410 or a 5xx that is not a challenge
  unreachable  no HTTP answer from this network (DNS, TLS, timeout): not proof of death

Usage:
  scripts/check-links.py                  # report only
  scripts/check-links.py --write          # also store agent_access in the catalog
  scripts/check-links.py --only dead      # re-check entries currently marked dead
  scripts/check-links.py --ids a,b,c      # re-check specific entries

The report goes to .planning/link-checks/YYYY-MM-DD.md. A host that is
unreachable from this network is not proof that a site is dead: confirm with a
web search before deleting an entry.
"""
import argparse
import concurrent.futures as cf
import datetime
import html
import json
import pathlib
import re
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
CATALOG = ROOT / 'catalog' / 'resources.jsonl'
UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/126.0 Safari/537.36')
CHALLENGE = re.compile(r'just a moment|cf-chl|challenge-platform|captcha|access denied|'
                       r'attention required|verify you are human|enable javascript and cookies',
                       re.I)


def fetch(url):
    with tempfile.NamedTemporaryFile(suffix='.html') as tmp:
        cmd = ['curl', '-sS', '-L', '--compressed', '-m', '30', '--connect-timeout', '12',
               '-A', UA, '-H', 'Accept: text/html,application/xhtml+xml,*/*;q=0.8',
               '-H', 'Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8',
               '-o', tmp.name, '-w', '%{http_code}\t%{url_effective}', url]
        proc = subprocess.run(cmd, capture_output=True, text=True)
        code, _, final = proc.stdout.partition('\t')
        body = pathlib.Path(tmp.name).read_bytes()[:1_500_000].decode('utf-8', 'replace')
    return int(code or 0), final or url, body, proc.stderr.strip()


def classify(code, body):
    text = re.sub(r'<(script|style|noscript|svg)\b.*?</\1>', ' ', body, flags=re.S | re.I)
    text = html.unescape(re.sub(r'<[^>]+>', ' ', text))
    visible = len(re.sub(r'\s+', ' ', text).strip())
    links = len(re.findall(r'<a\s', body, re.I))
    if code in (401, 403, 429) or (code == 503 and CHALLENGE.search(body)):
        return 'blocked', visible, links
    if code == 200 and CHALLENGE.search(body[:6000]) and visible < 1500:
        return 'blocked', visible, links
    if code == 0:
        return 'unreachable', visible, links
    if code in (404, 410) or code >= 500:
        return 'dead', visible, links
    if visible < 600 and links < 8:
        return 'js', visible, links
    return 'static', visible, links


def check(entry):
    code, final, body, err = fetch(entry['url'])
    if code == 0:                       # one retry: transient TLS / DNS hiccups are common
        code, final, body, err = fetch(entry['url'])
    access, visible, links = classify(code, body)
    title = re.search(r'<title[^>]*>(.*?)</title>', body, re.S | re.I)
    return {'id': entry['id'], 'url': entry['url'], 'code': code, 'final': final,
            'access': access, 'visible': visible, 'links': links,
            'title': html.unescape(title.group(1)).strip()[:80] if title else '',
            'err': err[:120]}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--write', action='store_true', help='store agent_access back into the catalog')
    ap.add_argument('--only', help='re-check only entries whose agent_access equals this value')
    ap.add_argument('--ids', help='comma-separated entry ids to check')
    ap.add_argument('--workers', type=int, default=16)
    args = ap.parse_args()

    entries = [json.loads(l) for l in CATALOG.read_text().splitlines() if l.strip()]
    todo = entries
    if args.ids:
        wanted = set(args.ids.split(','))
        todo = [e for e in entries if e['id'] in wanted]
    elif args.only:
        todo = [e for e in entries if e.get('agent_access') == args.only]

    with cf.ThreadPoolExecutor(args.workers) as pool:
        results = list(pool.map(check, todo))

    by_id = {r['id']: r for r in results}
    today = datetime.date.today().isoformat()
    counts = {}
    for r in results:
        counts[r['access']] = counts.get(r['access'], 0) + 1

    lines = [f'# Link check {today}', '',
             f'Checked {len(results)} of {len(entries)} entries: ' +
             ', '.join(f'{k} {v}' for k, v in sorted(counts.items())) + '.', '',
             'A `dead` or `blocked` result from this network is a prompt to confirm by web '
             'search, not proof. Redirects to a different host are listed so moved or '
             'acquired sites get noticed.', '']
    for label in ('dead', 'unreachable', 'blocked', 'js'):
        rows = [r for r in results if r['access'] == label]
        if rows:
            lines += [f'## {label} ({len(rows)})', '', '| id | url | http | note |', '| --- | --- | --- | --- |']
            lines += [f"| {r['id']} | {r['url']} | {r['code']} | {(r['err'] or r['title']).replace('|', '/')} |"
                      for r in rows]
            lines.append('')
    host = lambda u: re.sub(r'^https?://(www\.)?', '', u).split('/')[0].lower()
    moved = [r for r in results if r['code'] and host(r['final']) != host(r['url'])]
    if moved:
        lines += [f'## redirected to another host ({len(moved)})', '', '| id | from | to |', '| --- | --- | --- |']
        lines += [f"| {r['id']} | {r['url']} | {r['final']} |" for r in moved]
        lines.append('')
    out = ROOT / '.planning' / 'link-checks' / f'{today}.md'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text('\n'.join(lines))

    if args.write:
        for e in entries:
            if e['id'] in by_id:
                seen = by_id[e['id']]['access']
                e['agent_access'] = 'unknown' if seen in ('dead', 'unreachable') else seen
        CATALOG.write_text(''.join(json.dumps(e, ensure_ascii=False) + '\n' for e in entries))

    print(f'{len(results)} checked: ' + ', '.join(f'{k}={v}' for k, v in sorted(counts.items())))
    print(f'report: {out.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
