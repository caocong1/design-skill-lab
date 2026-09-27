"""Static HTML regions of the site pages, printed from the site catalogue (the docs/data/catalog.json object).

Imported by scripts/build-catalog.py, which writes the result with the other generated files (so --check catches a
stale page). The pages read without JavaScript and load no catalogue data on the home page:

  docs/index.html          gen:case (compartments, sections, 常用字盘 picks), gen:case-cap, gen:ledger, gen:stamp
  docs/catalog/index.html  gen:list (every entry by domain and section, inside <noscript>)

Each region sits between <!-- gen:NAME --> and <!-- /gen:NAME -->; everything outside the markers is hand-written
site template. Text that differs by UI language is printed twice, in .in-zh / .in-en spans that site.css shows by
page language, so neither language needs a data script.
"""
import collections
import html
import re

AGENT = (('static', '静态可读', 'Readable (static)'), ('js', '需执行 JS', 'Needs JS'),
         ('blocked', '被拦截', 'Blocked'), ('unknown', '未检测', 'Unchecked'))
STATUS = {'slow': '更新放缓', 'archived': '已归档', 'sunset': '已停运'}


def esc(s):
    return html.escape(str(s if s is not None else ''), quote=True)


def bi(zh, en):
    """one run per UI language; only the page language's run is displayed"""
    return f'<span class="in-zh">{esc(zh)}</span><span class="in-en" lang="en">{esc(en)}</span>'


def other(zh, en):
    """the OTHER language, as a sub-label: en on the zh page, zh on the en page"""
    return f'<span class="in-zh" lang="en">{esc(en)}</span><span class="in-en" lang="zh-CN">{esc(zh)}</span>'


def short_en(en):
    return re.split(r',| and ', str(en or ''))[0]      # "Communities, moodboards and feeds" -> "Communities"


def name_lang(name):
    if re.search(r'[぀-ヿ]', name):
        return ' lang="ja"'
    if re.search(r'[가-힯]', name):
        return ' lang="ko"'
    return '' if re.search(r'[㐀-鿿]', name) else ' lang="en"'


def case_rows(domains):
    """two biggest domains flank 常用字盘 in the second row; the rest fill three outer rows balanced by count
    (largest first into the lightest row), in taxonomy order inside each row"""
    order = {d['id']: i for i, d in enumerate(domains)}
    by_size = sorted(domains, key=lambda d: -d['count'])
    outer, sums = [[], [], []], [0, 0, 0]
    for d in by_size[2:]:
        k = sums.index(min(sums))
        outer[k].append(d)
        sums[k] += d['count']
    for row in outer:
        row.sort(key=lambda d: order[d['id']])
    outer.sort(key=lambda row: order[row[0]['id']])
    return [outer[0], [by_size[1], by_size[0]], outer[1], outer[2]]


def picks(site):
    """one pick per domain: the first active S row, preferring one a plain fetch can read"""
    out = []
    for d in site['domains']:
        s = [r for r in site['resources'] if r['domain'] == d['id'] and r['tier'] == 'S' and r['status'] == 'active']
        r = next((x for x in s if x['agent_access'] == 'static'), s[0] if s else None)
        if r:
            out.append((r, d))
    return out


def render_case(site):
    domains = site['domains']
    top = max(d['count'] for d in domains)
    rank = {d['id']: i + 3 for i, d in enumerate(sorted(domains, key=lambda d: -d['count']))}

    def cell(d, mid):
        secs = ''.join(
            f'<li><a href="catalog/?domain={esc(d["id"])}&amp;section={esc(s["id"])}"><span>{bi(s["zh"], s["en"])}</span>'
            f'<span class="num">{s["count"]}</span></a></li>' for s in d['sections'] if s['count'])
        return (f'<div class="cell{" mid-cell" if mid else ""}" style="--n:{d["count"]};--rank:{rank[d["id"]]};'
                f'--bar:{d["count"] / top * 100:.1f}%"><div class="c-head"><a class="c-name" href="catalog/?domain={esc(d["id"])}">'
                f'<b>{bi(d["zh"], short_en(d["en"]))}</b><small>{other(d["zh"], short_en(d["en"]))}</small></a>'
                f'<span class="c-count num">{d["count"]}</span></div><span class="c-bar" aria-hidden="true"></span>'
                f'<ul class="c-secs">{secs}</ul></div>')

    tray = ('<section class="tray" style="--w:50%" aria-labelledby="tray-h"><div class="tray-top"><h3 id="tray-h">'
            + bi('常用字盘', 'Within reach') + '</h3><p class="tray-cap">'
            + bi('每个域先拿这一件，都是 S 级', 'The first pick in each domain, all tier S') + '</p></div><ol class="picks">'
            + ''.join(f'<li><a href="catalog/?id={esc(r["id"])}#r-{esc(r["id"])}"{name_lang(r["name"])}>{esc(r["name"])}</a>'
                      f'<span>{bi(d["zh"], short_en(d["en"]))}</span></li>' for r, d in picks(site))
            + '</ol></section>')
    rows = []
    for k, row in enumerate(case_rows(domains)):
        cells = [cell(d, k == 1) for d in row]
        if k == 1:
            cells.insert(1, tray)
        rows.append(f'<div class="row{" mid" if k == 1 else ""}">' + ''.join(cells) + '</div>')
    n = len(domains)
    return '\n'.join(rows) + '\n<h3 class="list-h">' + bi(f'{n} 个域，按条目数排', f'{n} domains by size') + '</h3>'


def render_case_cap(site):
    n, d = len(site['resources']), len(site['domains'])
    return bi(f'共 {n} 条，分 {d} 个域', f'{n} entries in {d} domains')


def render_ledger(site):
    """accession dates from the rows' `added`, plus what the build date established"""
    c, n, nd = site['counts'], len(site['resources']), len(site['domains'])
    by_date = collections.defaultdict(list)
    for date, k in collections.Counter(r['added'] for r in site['resources']).items():
        by_date[date].append((bi('入藏', 'Accessioned'), bi(f'{k} 条', f'{k} entries')))
    thumbs = sum(1 for r in site['resources'] if r['thumb'])
    reach = ''.join(
        f'<li><a href="catalog/?reach={a}"><span class="ag" data-a="{a}">{bi(zh, en)}</span> '
        f'<b class="num">{c["reach"].get(a, 0)}</b></a></li>' for a, zh, en in AGENT)
    by_date[site['generated']] += [
        (bi('目录生成', 'Catalogue built'),
         bi(f'{n} 条、{nd} 个域、{c["sections"]} 个小节', f'{n} entries, {nd} domains, {c["sections"]} sections')),
        (bi('截图', 'Screenshots'),
         bi(f'{thumbs} 张通过质检；其余 {n - thumbs} 条用排字卡', f'{thumbs} passed QA; the other {n - thumbs} get a set card')),
        (bi('agent 核验', 'Agent check'), f'<ul class="reach">{reach}</ul>')]
    return '\n'.join(
        f'<li><time datetime="{esc(date)}">{esc(date)}</time><dl>'
        + ''.join(f'<dt>{k}</dt><dd>{v}</dd>' for k, v in by_date[date]) + '</dl></li>'
        for date in sorted(by_date, reverse=True))


def render_stamp(site):
    g = esc(site['generated'])
    return bi(f'目录数据生成于 {g}', f'Catalogue data generated {g}')


def render_list(site):
    """the no-script catalogue: every entry, by domain and section, name linked to the site; zh page only"""
    out = []
    for d in site['domains']:
        out.append(f'<section class="sl-dom" aria-labelledby="sl-{esc(d["id"])}"><h2 id="sl-{esc(d["id"])}">{esc(d["zh"])} '
                   f'<small lang="en">{esc(d["en"])}</small> <span class="num">{d["count"]}</span></h2>')
        for s in d['sections']:
            members = [r for r in site['resources'] if r['domain'] == d['id'] and r['section'] == s['id']]
            if not members:
                continue
            out.append(f'<h3>{esc(s["zh"])} <small lang="en">{esc(s["en"])}</small></h3><ol>')
            for r in members:
                st = f' <em>{STATUS[r["status"]]}</em>' if r['status'] in STATUS else ''
                out.append(f'<li id="r-{esc(r["id"])}"><a href="{esc(r["url"])}"{name_lang(r["name"])}>{esc(r["name"])}</a>'
                           f'{" <b>S</b>" if r["tier"] == "S" else ""}{st} {esc(r["zh"])} '
                           f'<small lang="en">{esc(r["host"])}</small></li>')
            out.append('</ol>')
        out.append('</section>')
    return '\n'.join(out)


def fill(path, regions):
    """the page's text with each <!-- gen:NAME --> ... <!-- /gen:NAME --> region replaced"""
    page = path.read_text(encoding='utf-8')
    for name, body in regions.items():
        pat = re.compile(r'(<!-- gen:%s -->)(.*?)(<!-- /gen:%s -->)' % (re.escape(name), re.escape(name)), re.S)
        if len(pat.findall(page)) != 1:
            raise SystemExit(f'{path}: expected exactly one <!-- gen:{name} --> region')
        page = pat.sub(lambda m: m.group(1) + '\n' + body + '\n' + m.group(3), page)
    return page


def site_pages(site, docs):
    """{path: new text} for the two pages; docs = the docs/ folder"""
    home, cat = docs / 'index.html', docs / 'catalog' / 'index.html'
    return {
        home: fill(home, {'case': render_case(site), 'case-cap': render_case_cap(site),
                          'ledger': render_ledger(site), 'stamp': render_stamp(site)}),
        cat: fill(cat, {'list': render_list(site)}),
    }
