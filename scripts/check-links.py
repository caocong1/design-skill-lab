#!/usr/bin/env python3
"""Observe every catalogue link with curl and append what came back to catalog/observed.jsonl.

Verification costs no model tokens. Each run appends one record per checked id; scripts/build-catalog.py
joins the latest record per id into the views. The hand-curated catalog/resources.jsonl is never written.

  verdict      meaning                                                    agent_access
  static       200 with real content in the HTML                          static
  js           200 but an almost empty shell; needs a real browser        js
  blocked      401/403/429/451, a bot wall or challenge page, a redirect  blocked
               to a login page, or another 4xx/5xx that a browser user
               agent does not get (the site refuses scripts)
  parked       sent to a registrar or parking page (the domain lapsed)    unknown
  soft404      200, but the page says it is not found                     unknown
  dead         404 or 410                                                 unknown
  error        any other 4xx or 5xx, which a browser user agent gets too  unknown
  unreachable  no HTTP answer from this network (DNS, TLS, timeout)       unknown

A wall is detected from the status plus explicit markers (Cloudflare challenge, Vercel Security Checkpoint,
AWS WAF challenge, SiteGround captcha, Anubis, Imperva, DataDome, PerimeterX, Sucuri, Chinese captcha pages),
never from Cloudflare's passive challenge-platform beacon, which ordinary pages carry too. Entry points and API
samples are probed as well (record field `links`); an MCP endpoint (405/406 to a GET) is probed with an MCP
initialize request instead. Requests to one host run one at a time; hosts run in parallel.
curl sends its own user agent: the check measures what a plain fetch gets, not a disguised browser. Only an
`error` answer is fetched a second time with a browser user agent, to tell a refusal of scripts (blocked) from
a broken site (error).

Usage:
  scripts/check-links.py                       # check every row, append to observed.jsonl, print the problems
  scripts/check-links.py --report out.md       # also save the problem report as Markdown
  scripts/check-links.py --ids a,b,c           # check some rows (prints every result)
  scripts/check-links.py --only blocked        # re-check rows whose latest verdict or agent_access is blocked
  scripts/check-links.py --dry-run             # print the results; append nothing

observed.jsonl is the record (dated, one line per id per run); the report is a reading aid. "unreachable" from
this network is not proof that a site is dead: confirm with a web search before removing a row.
"""
import argparse
import collections
import concurrent.futures as cf
import datetime
import html
import json
import pathlib
import re
import subprocess
import tempfile
import time
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent
RESOURCES = ROOT / 'catalog' / 'resources.jsonl'
OBSERVED = ROOT / 'catalog' / 'observed.jsonl'
ACCESS = {'static': 'static', 'js': 'js', 'blocked': 'blocked'}          # every other verdict -> unknown

# Explicit wall markers. Titles are matched case-insensitively; body markers are exact substrings.
WALL_TITLES = ['just a moment', 'attention required', 'one moment, please', 'vercel security checkpoint',
               "making sure you're not a bot", 'access denied', 'pardon our interruption', 'checking your browser',
               'ddos-guard', 'request unsuccessful', 'are you a robot', 'bot verification', 'security check',
               '403 forbidden', '安全验证', '异常访问', '人机验证', '滑动验证', '请完成验证', '访问验证',
               '访问被拒绝', '拒绝访问']
WALL_BODY = {'cf-chl': 'Cloudflare challenge', '_cf_chl_opt': 'Cloudflare challenge',
             'Vercel Security Checkpoint': 'Vercel checkpoint', 'sgcaptcha': 'SiteGround captcha',
             '/.within.website/': 'Anubis', 'Incapsula incident ID': 'Imperva',
             'captcha-delivery.com': 'DataDome', 'px-captcha': 'PerimeterX', 'sucuri_cloudproxy': 'Sucuri',
             'Sucuri WebSite Firewall': 'Sucuri'}
WALL_HEADERS = {'cf-mitigated: challenge': 'Cloudflare challenge', 'x-vercel-mitigated: challenge': 'Vercel checkpoint',
                'x-amzn-waf-action: challenge': 'AWS WAF challenge'}
# These also appear on ordinary pages (captcha widgets on login and contact forms, Imperva's passive script, like
# Cloudflare's challenge-platform beacon): they count only on a near-empty page.
NEAR_EMPTY_MARKERS = {'g-recaptcha': 'reCAPTCHA', 'h-captcha': 'hCaptcha', 'geetest_': 'GeeTest',
                      'TCaptcha': 'Tencent captcha', 'captcha.qq.com': 'Tencent captcha', 'nc_iconfont': 'Aliyun slider',
                      'ddos-guard': 'DDoS-Guard', '_Incapsula_Resource': 'Imperva'}
NEAR_EMPTY = 600                # visible characters: below this a page is a shell or a wall, not content
PARKING_HOSTS = ('namecheap.com', 'sedo.com', 'sedoparking.com', 'dan.com', 'afternic.com', 'hugedomains.com',
                 'godaddy.com', 'parkingcrew.net', 'bodis.com', 'above.com', 'uniregistry.com', 'buydomains.com',
                 'undeveloped.com', 'squadhelp.com', 'atom.com', 'domainmarket.com', 'sav.com', 'perfectdomain.com')
PARKED_TEXT = re.compile(r'this domain (name )?(is|may be) for sale|buy this domain|domain is for sale|'
                         r'parked free, courtesy of godaddy|sedoparking|parkingcrew|domain parking|'
                         r'域名(正在)?出售|此域名(正在)?出售', re.I)
LOGIN_PATH = re.compile(r'/(login|log-in|signin|sign-in|sign_in|servicelogin|passport)\b', re.I)
BROWSER_UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) '
              'Chrome/140.0.0.0 Safari/537.36')
MCP_INITIALIZE = json.dumps({'jsonrpc': '2.0', 'id': 1, 'method': 'initialize',
                             'params': {'protocolVersion': '2025-06-18', 'capabilities': {},
                                        'clientInfo': {'name': 'design-skill-lab check-links', 'version': '1'}}})
SOFT_404 = re.compile(r'page not found|not found|error 404|404 error|\b404 -|- 404\b|doesn.t exist|does not exist|'
                      r'no longer (exists|available)|页面不存在|页面未找到|找不到(该)?页面|ページが見つかりません|'
                      r'페이지를 찾을 수 없', re.I)


def host_of(url):
    return (urllib.parse.urlsplit(url).hostname or '').lower().removeprefix('www.')


def fetch(url, ua):
    with tempfile.TemporaryDirectory() as tmp:
        body_file, head_file = pathlib.Path(tmp, 'body'), pathlib.Path(tmp, 'head')
        cmd = ['curl', '-sS', '-L', '--compressed', '-m', '12', '--connect-timeout', '8',
               '-H', 'Accept: text/html,application/xhtml+xml,*/*;q=0.8',
               '-H', 'Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8',
               '-D', str(head_file), '-o', str(body_file), '-w', '%{http_code}\t%{url_effective}', url]
        if ua:
            cmd[1:1] = ['-A', ua]
        proc = subprocess.run(cmd, capture_output=True, text=True)
        code, _, final = proc.stdout.partition('\t')
        body = body_file.read_bytes()[:1_500_000].decode('utf-8', 'replace') if body_file.exists() else ''
        heads = head_file.read_text('latin-1') if head_file.exists() else ''
    last_headers = heads.strip().split('\r\n\r\n')[-1].lower()             # the final response after redirects
    return int(code or 0), final or url, body, last_headers, proc.stderr.strip()


def page_text(body):
    text = re.sub(r'<(script|style|noscript|svg)\b.*?</\1>', ' ', body, flags=re.S | re.I)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', text))).strip()


def title_of(body):
    m = re.search(r'<title[^>]*>(.*?)</title>', body, re.S | re.I)
    return re.sub(r'\s+', ' ', html.unescape(m.group(1))).strip()[:120] if m else ''


def wall_vendor(code, body, headers, title, visible):
    for marker, vendor in WALL_HEADERS.items():
        if marker in headers:
            return vendor
    for marker, vendor in WALL_BODY.items():
        if marker in body:
            return vendor
    low = title.lower()
    for marker in WALL_TITLES:
        if marker in low:
            return f'wall page titled "{title}"'
    if visible < NEAR_EMPTY:
        for marker, vendor in NEAR_EMPTY_MARKERS.items():
            if marker in body:
                return vendor
    if code in (401, 403, 407, 429, 451):
        return f'http {code}'
    return None


def classify(url, code, final, body, headers, err):
    """Return (verdict, note) for one fetched URL."""
    if code == 0:
        return 'unreachable', err[:160]
    title, text = title_of(body), page_text(body)
    visible, links = len(text), len(re.findall(r'<a\s', body, re.I))
    start, end = host_of(url), host_of(final)
    if end != start and any(end == h or end.endswith('.' + h) for h in PARKING_HOSTS):
        return 'parked', f'redirected to {end}'
    if PARKED_TEXT.search(title) or (visible < 3000 and PARKED_TEXT.search(text[:3000])):
        return 'parked', f'parking page: "{title}"'
    vendor = wall_vendor(code, body, headers, title, visible)
    if vendor:
        return 'blocked', vendor
    if LOGIN_PATH.search(urllib.parse.urlsplit(final).path) and not LOGIN_PATH.search(urllib.parse.urlsplit(url).path):
        return 'blocked', f'redirected to a login page ({final[:100]})'
    if code in (404, 410):
        return 'dead', f'http {code}'
    if code >= 400:
        return 'error', f'http {code}'
    if SOFT_404.search(title):
        return 'soft404', f'title says "{title}"'
    content_type = re.search(r'^content-type:\s*([^;\r\n]+)', headers, re.M)
    if content_type and 'html' not in content_type.group(1):
        return 'static', content_type.group(1).strip()       # SVG, JSON, images: a 2xx is the whole answer
    hints = []
    if end != start:
        hints.append(f'moved to {end}')
    elif urllib.parse.urlsplit(url).path.strip('/') and not urllib.parse.urlsplit(final).path.strip('/'):
        hints.append('deep link now lands on the homepage (possible soft 404)')
    if visible < NEAR_EMPTY and links < 8:
        return 'js', '; '.join(hints + [f'{visible} chars of text'])
    return 'static', '; '.join(hints)


def mcp_answers(url):
    """True when url is a Streamable HTTP MCP server: it answers an initialize request with its serverInfo."""
    proc = subprocess.run(['curl', '-sS', '-m', '12', '-X', 'POST', '-H', 'Content-Type: application/json',
                           '-H', 'Accept: application/json, text/event-stream', '-d', MCP_INITIALIZE, url],
                          capture_output=True, text=True)
    return '"serverInfo"' in proc.stdout


def probe(url, ua):
    code, final, body, headers, err = fetch(url, ua)
    if code == 0:                                   # one retry: transient DNS / TLS failures are common
        code, final, body, headers, err = fetch(url, ua)
    verdict, note = classify(url, code, final, body, headers, err)
    if verdict == 'error' and code in (405, 406) and mcp_answers(url):
        verdict, note = 'static', f'MCP server: http {code} to a GET, answers an initialize request'
    elif verdict == 'error' and not ua:
        browser_code = fetch(url, BROWSER_UA)[0]
        if 200 <= browser_code < 400:
            verdict, note = 'blocked', f'http {code} to a plain fetch, {browser_code} to a browser user agent'
    if verdict == 'unreachable' and url.startswith('https://'):
        # A lapsed domain often keeps only an http redirect to its registrar's parking page.
        plain = 'http://' + url[len('https://'):]
        p_code, p_final, p_body, p_headers, p_err = fetch(plain, ua)
        p_verdict, p_note = classify(plain, p_code, p_final, p_body, p_headers, p_err)
        if p_verdict == 'parked':
            return {'http': p_code, 'final_url': p_final, 'verdict': 'parked', 'title': title_of(p_body),
                    'note': f'https unreachable; http {p_note}'}
        if p_code:
            note += f'; over http: {p_verdict} (http {p_code}) {p_final}'
    return {'http': code or None, 'final_url': final if code else None, 'verdict': verdict,
            'title': title_of(body), 'note': note}


def jobs_for(row):
    jobs = [(row['id'], 'url', row['url'])]
    jobs += [(row['id'], ep['label'], ep['url']) for ep in row.get('entry_points', [])]
    if row.get('api'):
        jobs.append((row['id'], 'api sample', row['api']['sample']))
    return jobs


def run_host(queue, ua, delay):
    """All requests to one host, one at a time."""
    out = []
    for n, (rid, label, url) in enumerate(queue):
        if n:
            time.sleep(delay)
        out.append((rid, label, url, probe(url, ua)))
    return out


def latest_observed():
    latest = {}
    if OBSERVED.exists():
        for line in OBSERVED.read_text().splitlines():
            if line.strip():
                record = json.loads(line)
                latest[record['id']] = record
    return latest


def records(todo, results, today):
    by_row = collections.defaultdict(dict)
    for rid, label, url, result in results:
        by_row[rid][(label, url)] = result
    out = []
    for row in todo:
        main = by_row[row['id']][('url', row['url'])]
        record = {'id': row['id'], 'checked_at': today, 'http': main['http'], 'final_url': main['final_url'],
                  'agent_access': ACCESS.get(main['verdict'], 'unknown'), 'verdict': main['verdict']}
        if main['title']:
            record['title'] = main['title']
        if main['note']:
            record['note'] = main['note']
        links = [{'label': label, 'url': url, 'http': r['http'], 'verdict': r['verdict']}
                 for (label, url), r in by_row[row['id']].items() if label != 'url']
        if links:
            record['links'] = links
        out.append(record)
    return out


def report(recs, total, today):
    counts = collections.Counter(r['verdict'] for r in recs)
    lines = [f'# Link check {today}', '',
             f'Checked {len(recs)} of {total} rows: ' + ', '.join(f'{k} {v}' for k, v in sorted(counts.items())) + '.',
             '', 'A `dead`, `parked` or `unreachable` result from this network is a prompt to confirm by web search, '
             'not proof. Observations are in catalog/observed.jsonl.', '']
    for verdict in ('dead', 'parked', 'soft404', 'error', 'unreachable', 'blocked', 'js'):
        rows = [r for r in recs if r['verdict'] == verdict]
        if rows:
            lines += [f'## {verdict} ({len(rows)})', '', '| id | http | note |', '| --- | --- | --- |']
            lines += [f"| {r['id']} | {r['http']} | {r.get('note', r.get('title', '')).replace('|', '/')} |" for r in rows]
            lines.append('')
    bad_links = [(r['id'], l) for r in recs for l in r.get('links', []) if l['verdict'] not in ('static', 'js')]
    if bad_links:
        lines += [f'## entry points and API samples that failed ({len(bad_links)})', '',
                  '| id | link | http | verdict |', '| --- | --- | --- | --- |']
        lines += [f"| {rid} | {l['url']} | {l['http']} | {l['verdict']} |" for rid, l in bad_links]
        lines.append('')
    hinted = [r for r in recs if r['verdict'] in ('static', 'js')
              and ('moved to' in r.get('note', '') or 'homepage' in r.get('note', ''))]
    if hinted:
        lines += [f'## moved or decayed ({len(hinted)})', '', '| id | final url | note |', '| --- | --- | --- |']
        lines += [f"| {r['id']} | {r['final_url']} | {r['note']} |" for r in hinted]
        lines.append('')
    return '\n'.join(lines)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--ids', help='comma-separated row ids to check')
    ap.add_argument('--only', help='re-check rows whose latest verdict or agent_access equals this value')
    ap.add_argument('--workers', type=int, default=12, help='hosts checked in parallel (default 12)')
    ap.add_argument('--delay', type=float, default=1.0, help='seconds between requests to the same host')
    ap.add_argument('--ua', help='send this user agent instead of curl\'s own (for comparison runs only)')
    ap.add_argument('--dry-run', action='store_true', help='print results without appending to observed.jsonl')
    ap.add_argument('--report', type=pathlib.Path, help='also write the problem report (Markdown) to this file')
    ap.add_argument('--write', action='store_true',
                    help='accepted for older instructions; appending to observed.jsonl is the default')
    args = ap.parse_args()

    rows = [json.loads(l) for l in RESOURCES.read_text().splitlines() if l.strip()]
    todo = rows
    if args.ids:
        wanted = set(args.ids.split(','))
        todo = [r for r in rows if r['id'] in wanted]
    elif args.only:
        latest = latest_observed()
        todo = [r for r in rows if args.only in (latest.get(r['id'], {}).get('verdict'),
                                                   latest.get(r['id'], {}).get('agent_access'))]

    queues = collections.defaultdict(list)
    for row in todo:
        for job in jobs_for(row):
            queues[host_of(job[2])].append(job)
    with cf.ThreadPoolExecutor(args.workers) as pool:
        results = [item for chunk in pool.map(lambda q: run_host(q, args.ua, args.delay), queues.values())
                   for item in chunk]

    today = datetime.date.today().isoformat()
    recs = records(todo, results, today)
    counts = collections.Counter(r['verdict'] for r in recs)
    print(f'{len(recs)} checked: ' + ', '.join(f'{k}={v}' for k, v in sorted(counts.items())))
    text = report(recs, len(rows), today)
    if args.dry_run or len(recs) < 40:
        for r in recs:
            extra = ''.join(f"\n    {l['label']}: {l['verdict']} (http {l['http']}) {l['url']}" for l in r.get('links', []))
            print(f"  {r['id']}: {r['verdict']} (http {r['http']}) {r.get('note', '')}".rstrip() + extra)
    else:
        print(text)
    if args.report:
        args.report.write_text(text)
        print(f'report: {args.report}')
    if args.dry_run:
        return
    existing = OBSERVED.read_text() if OBSERVED.exists() else ''
    with OBSERVED.open('a') as fh:
        if existing and not existing.endswith('\n'):
            fh.write('\n')
        fh.writelines(json.dumps(r, ensure_ascii=False) + '\n' for r in recs)
    print(f'appended {len(recs)} records to {OBSERVED.relative_to(ROOT)}; run scripts/build-catalog.py to refresh the views')


if __name__ == '__main__':
    main()
