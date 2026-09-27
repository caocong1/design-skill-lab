#!/usr/bin/env python3
"""The lab's Definition of Done: named, mechanical checks over the whole repository.

The suite teaches "compute, do not estimate" and "what can be checked mechanically should not rely on
discipline". These gates are the lab holding itself to that. Entry point: scripts/check-lab-invariants.sh.

  G1  catalogue schema valid and generated views fresh      scripts/build-catalog.py --check
  G2  thumbnails: manifest covers every catalogue id, files   docs/assets/thumbs/manifest.json
  G3  research index: source headers, cited ids, INDEX fresh  scripts/build-research-index.py --check
  G4  skills: frontmatter, line budgets, reference            skills/*, .claude/skills/*
      frontmatter, links and backtick paths resolve
  G5  feedback inbox entries valid                            scripts/collect-feedback.py --check
  G6  eval trigger set valid                                  evals/tools/score_triggers.py --validate
  G7  one version everywhere                                  SKILL.md, README, CHANGELOG, .claude-plugin/*
  G8  docs: no hand-typed catalogue counts, no dead links     docs/**/*.html
  G9  no stray files tracked                                  git ls-files

Usage
  scripts/gates.py            run every gate; exit 1 if any fails
  scripts/gates.py G4 G7      run only these gates

Stdlib only, no network. When a gate is wrong, fix the gate in the same change and say so.
"""
import datetime
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
TODAY = datetime.date.today()
SEMVER = re.compile(r'^\d+\.\d+\.\d+$')


def rel(p):
    return p.relative_to(ROOT).as_posix()


def read(p):
    return p.read_text(encoding='utf-8')


def run_tool(*args):
    """Run a lab script; return its failure lines (empty when it exits 0)."""
    r = subprocess.run([sys.executable, *map(str, args)], capture_output=True, text=True, cwd=ROOT)
    if r.returncode == 0:
        return []
    out = [ln for ln in (r.stdout + r.stderr).splitlines() if ln.strip()]
    fails = [ln for ln in out if ln.startswith(('FAIL', 'ERROR', 'error'))]
    return fails or out[-15:] or [f'{args[0]} exited {r.returncode}']


# ---------------------------------------------------------------- frontmatter
def frontmatter(text):
    """Parse the leading --- block. Returns (dict | None, error | None).

    Supports the strict YAML subset this lab writes: `key: scalar`, `key: [a, b]`, and under an empty
    `key:` either indented `sub: scalar` lines (a map) or `- item` lines (a list). Scalars are plain,
    "double" or 'single' quoted; true/false become booleans. Anything else is an error, not a guess:
    a plain scalar containing ': ' or starting with a YAML indicator would not parse the same in YAML."""
    m = re.match(r'^---\n(.*?)\n---\n', text, re.S)
    if not m:
        return None, 'no frontmatter block (--- ... ---) at the top'
    if '\t' in m.group(1):
        return None, 'tab in frontmatter'
    data, parent = {}, None
    for n, line in enumerate(m.group(1).split('\n'), 2):
        if not line.strip() or line.lstrip().startswith('#'):
            continue
        indented = line.startswith((' ', '-'))
        if indented:
            if parent is None:
                return None, f'line {n}: indented line without a parent key'
            item = line.strip()
            if item.startswith('- '):
                if data[parent] == {}:
                    data[parent] = []
                if not isinstance(data[parent], list):
                    return None, f'line {n}: list item under a map'
                value, err = scalar(item[2:])
                if err:
                    return None, f'line {n}: {err}'
                data[parent].append(value)
                continue
            key, sep, raw = item.partition(':')
            if not sep or not isinstance(data[parent], dict):
                return None, f'line {n}: expected "sub: value" under {parent}:'
            if not raw.strip():
                return None, f'line {n}: nesting deeper than one level is not supported here'
            value, err = scalar(raw.strip())
            if err:
                return None, f'line {n}: {err}'
            data[parent][key.strip()] = value
            continue
        key, sep, raw = line.partition(':')
        key, raw = key.strip(), raw.strip()
        if not sep or not re.match(r'^[A-Za-z_][\w-]*$', key):
            return None, f'line {n}: expected "key: value", got {line!r}'
        if key in data:
            return None, f'line {n}: duplicate key {key}'
        if raw == '':
            data[key], parent = {}, key
            continue
        value, err = scalar(raw)
        if err:
            return None, f'line {n} ({key}): {err}'
        data[key], parent = value, None
    return data, None


def scalar(raw):
    if raw.startswith('"'):
        try:
            value, end = json.JSONDecoder().raw_decode(raw)
        except ValueError:
            return None, 'unterminated or invalid "double-quoted" string'
        rest = raw[end:].strip()
        return (value, None) if not rest or rest.startswith('#') else (None, 'text after a quoted string')
    if raw.startswith("'"):
        m = re.match(r"^'((?:[^']|'')*)'\s*(#.*)?$", raw)
        return (m.group(1).replace("''", "'"), None) if m else (None, "invalid 'single-quoted' string")
    if raw.startswith('['):
        if not raw.endswith(']'):
            return None, 'inline list must close with ] on the same line'
        items = [i.strip() for i in raw[1:-1].split(',') if i.strip()]
        out = []
        for i in items:
            value, err = scalar(i)
            if err:
                return None, err
            out.append(value)
        return out, None
    value = re.split(r'\s+#', raw, maxsplit=1)[0].strip()
    if not value:
        return None, None
    if value[0] in '{&*!|>%@`':
        return None, f'plain value starts with the YAML indicator {value[0]!r}; quote it'
    if ': ' in value:
        return None, 'plain value contains ": "; quote it'
    return {'true': True, 'false': False}.get(value, value), None


def as_date(value):
    try:
        return datetime.date.fromisoformat(str(value))
    except ValueError:
        return None


# ---------------------------------------------------------------- G1 G3 G5 G6: delegated validators
def g1_catalogue():
    return run_tool(ROOT / 'scripts/build-catalog.py', '--check'), []


def g3_research():
    return run_tool(ROOT / 'scripts/build-research-index.py', '--check'), []


def g5_feedback():
    return run_tool(ROOT / 'scripts/collect-feedback.py', '--check'), []


def g6_triggers():
    return run_tool(ROOT / 'evals/tools/score_triggers.py', '--validate'), []


# ---------------------------------------------------------------- G2 thumbnails
def catalogue_ids():
    rows = [json.loads(ln) for ln in read(ROOT / 'catalog/resources.jsonl').splitlines() if ln.strip()]
    return [r['id'] for r in rows]


def g2_thumbs():
    fails, warns = [], []
    thumbs = ROOT / 'docs/assets/thumbs'
    manifest = thumbs / 'manifest.json'
    if not manifest.exists():
        return [f'{rel(manifest)} missing: run npm run shoot'], []
    items = json.loads(read(manifest)).get('items', {})
    ids = catalogue_ids()
    for i in ids:
        rec = items.get(i)
        if rec is None:
            fails.append(f'{i}: no manifest record (npm run shoot -- --ids {i})')
            continue
        verdict = (rec.get('qa') or {}).get('verdict')
        if verdict == 'ok':
            if not rec.get('file') or not (thumbs / rec['file']).is_file():
                fails.append(f'{i}: verdict ok but file {rec.get("file")!r} is not in {rel(thumbs)}/')
        elif verdict != 'placeholder':
            fails.append(f'{i}: qa.verdict is {verdict!r}; expected ok or placeholder')
    listed = {rec.get('file') for rec in items.values() if rec.get('file')}
    for f in sorted(thumbs.glob('*.webp')):
        if f.name not in listed:
            fails.append(f'{rel(f)}: file not referenced by the manifest (delete it or re-run the shooter)')
    orphans = sorted(set(items) - set(ids))
    if orphans:
        warns.append(f'{len(orphans)} manifest record(s) for ids not in the catalogue: {", ".join(orphans[:8])}')
    return fails, warns


# ---------------------------------------------------------------- G4 skills
SHIPPED = sorted(p for p in (ROOT / 'skills').iterdir() if (p / 'SKILL.md').is_file())
LOCAL = sorted(p for p in (ROOT / '.claude/skills').glob('*') if (p / 'SKILL.md').is_file())
BUDGET = {'design-studio': 200, 'iterate-design-lab': 200}     # SKILL.md lines; others 150
REF_BUDGET = 300
REMOVED_SKILLS = ('explore-design-directions', 'find-design-inspiration', 'design-product-ui',
                  'design-marketing-sites', 'build-design-system', 'design-motion', 'design-icons',
                  'design-brand-identity', 'design-graphics', 'handoff-design')
LINK = re.compile(r'\[[^\]\n]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)')
TICK = re.compile(r'`([^`\n]+)`')
SKILL_PREFIX = ('references/', 'templates/', 'scripts/', 'assets/', '../')
REPO_PREFIX = ('skills/', 'scripts/', 'catalog/', 'research/', 'feedback/', 'evals/', 'docs/',
               '.claude/', '.claude-plugin/', '.github/')
PLACEHOLDER = ('.design/', '...', '<', '*', '{', '$', 'YYYY')


def is_generated(p):
    return 'references' in p.parts and 'catalog' in p.parts


def skill_md_files():
    for d in SHIPPED + LOCAL:
        yield from (p for p in sorted(d.rglob('*.md')) if 'node_modules' not in p.parts)


def check_skill_meta(d, fails):
    f = d / 'SKILL.md'
    fm, err = frontmatter(read(f))
    if err:
        return fails.append(f'{rel(f)}: {err}')
    desc = fm.get('description')
    if fm.get('name') != d.name:
        fails.append(f'{rel(f)}: name {fm.get("name")!r} must equal the directory name {d.name!r}')
    if not isinstance(desc, str) or not desc:
        fails.append(f'{rel(f)}: no description')
    else:
        if len(desc) > 1024:
            fails.append(f'{rel(f)}: description is {len(desc)} chars (limit 1024)')
        if 'Not for' not in desc:
            fails.append(f'{rel(f)}: description has no "Not for" clause')
    meta = fm.get('metadata') if isinstance(fm.get('metadata'), dict) else {}
    if not SEMVER.match(str(meta.get('version', ''))):
        fails.append(f'{rel(f)}: metadata.version missing or not X.Y.Z')
    if not meta.get('short-description'):
        fails.append(f'{rel(f)}: metadata.short-description missing')
    if d in LOCAL and fm.get('disable-model-invocation') is not True:
        fails.append(f'{rel(f)}: a repo-local maintainer skill needs disable-model-invocation: true')
    if d in SHIPPED and not (d / 'agents/openai.yaml').is_file():
        fails.append(f'{rel(d)}: missing agents/openai.yaml')
    limit = BUDGET.get(d.name, 150)
    lines = read(f).count('\n')
    if lines > limit:
        fails.append(f'{rel(f)}: {lines} lines (budget {limit}); move detail into a reference')


def check_reference(p, sources, fails):
    lines = read(p).count('\n')
    if lines > REF_BUDGET:
        fails.append(f'{rel(p)}: {lines} lines (budget {REF_BUDGET}); split it')
    fm, err = frontmatter(read(p))
    if err:
        return fails.append(f'{rel(p)}: {err}')
    for key in ('title', 'evidence', 'sources', 'reviewed', 'review_by'):
        if key not in fm:
            fails.append(f'{rel(p)}: frontmatter has no {key}')
    if 'evidence' in fm and fm['evidence'] not in ('digest', 'practice', 'measured'):
        fails.append(f'{rel(p)}: evidence {fm["evidence"]!r} is not digest | practice | measured')
    srcs = fm.get('sources', [])
    if not isinstance(srcs, list):
        fails.append(f'{rel(p)}: sources must be a list')
    else:
        for s in srcs:
            if s not in sources:
                fails.append(f'{rel(p)}: source {s!r} has no research/sources/{s}.md')
        if fm.get('evidence') == 'digest' and not srcs:
            fails.append(f'{rel(p)}: evidence digest but no sources')
    for key in ('reviewed', 'review_by'):
        if key in fm and not as_date(fm[key]):
            fails.append(f'{rel(p)}: {key} {fm[key]!r} is not YYYY-MM-DD')
    due = as_date(fm.get('review_by', ''))
    if due and due < TODAY:
        fails.append(f'{rel(p)}: review_by {due} has passed; re-review it against its sources')


def link_targets(text):
    for m in LINK.finditer(text):
        t = m.group(1)
        if re.match(r'^[a-z][a-z0-9+.-]*:', t) or t.startswith('#'):
            continue
        t = t.split('#')[0].split('?')[0]
        if t and not any(s in t for s in PLACEHOLDER):
            yield t


def tick_paths(text):
    for m in TICK.finditer(text):
        tok = (m.group(1).strip().split() or [''])[0]
        tok = re.sub(r':\d+(-\d+)?$', '', tok.split('#')[0].rstrip('.,;:)'))
        if tok and not any(s in tok for s in PLACEHOLDER):
            lab = 'lab' in text[max(0, m.start() - 14):m.start()].lower()   # "the lab's `scripts/x`"
            yield tok, lab


def check_paths(p, skill_root, fails):
    """Markdown links resolve from the file. Backtick paths: in a shipped skill, skill-local paths
    (references/, templates/, scripts/, assets/, ../) resolve in the skill, and `skills/...` or "the lab's"
    paths in the repo; other folders there belong to the host project. In repo-local files (README, the
    maintainer skill) repo paths resolve against the repo root."""
    text = read(p)
    for t in link_targets(text):
        if not (p.parent / t).exists():
            fails.append(f'{rel(p)}: link ({t}) does not resolve')
    if skill_root is None:
        return
    shipped = ROOT / 'skills' in skill_root.parents
    for tok, lab in tick_paths(text):
        local = tok.startswith(SKILL_PREFIX)
        if shipped:     # other folders named in a shipped skill (docs/, src/ ...) are the host project's
            if not (local or tok.startswith('skills/')):
                continue
            bases = [p.parent, skill_root] + ([ROOT] if lab or tok.startswith('skills/') else [])
        else:
            if not (local or tok.startswith(REPO_PREFIX)):
                continue
            bases = [p.parent, skill_root, ROOT]
        if not any((b / tok).exists() for b in bases):
            fails.append(f'{rel(p)}: `{tok}` resolves neither in the skill nor (as a lab path) in the repo')


def g4_skills():
    fails = []
    sources = {p.stem for p in (ROOT / 'research/sources').glob('*.md')}
    for d in SHIPPED + LOCAL:
        check_skill_meta(d, fails)
    for p in skill_md_files():
        root = next(d for d in SHIPPED + LOCAL if d in p.parents)
        if p.relative_to(root).parts[0] == 'references' and not is_generated(p):
            check_reference(p, sources, fails)
        if not is_generated(p):
            check_paths(p, root, fails)
    removed = re.compile(r'(?<![\w-])(' + '|'.join(REMOVED_SKILLS) + r')(?![\w-])')
    for d in SHIPPED:
        for p in sorted(d.rglob('*')):
            if p.is_file() and p.suffix in ('.md', '.html', '.json', '.yaml', '.css', '.py', '.mjs', '.sh') \
                    and not is_generated(p):
                for n, line in enumerate(read(p).splitlines(), 1):
                    hit = removed.search(line)
                    if hit:
                        fails.append(f'{rel(p)}:{n}: names the removed skill {hit.group(1)}')
    docs = [ROOT / 'README.md', ROOT / 'feedback/README.md', ROOT / 'evals/README.md',
            *sorted((ROOT / 'research').rglob('*.md'))]
    for p in docs:
        if p.exists():
            check_paths(p, ROOT if p.name == 'README.md' and p.parent == ROOT else None, fails)
    return fails, []


# ---------------------------------------------------------------- G7 versions
def g7_versions():
    fails = []
    fm, _ = frontmatter(read(ROOT / 'skills/design-studio/SKILL.md'))
    suite = ((fm or {}).get('metadata') or {}).get('version')
    if not suite:
        return ['skills/design-studio/SKILL.md: no metadata.version'], []
    readme = read(ROOT / 'README.md')
    if f'suite 当前 {suite}' not in readme:
        fails.append(f'README.md must state the literal "suite 当前 {suite}" (design-studio metadata.version)')
    heads = re.findall(r'^## \[(\d+\.\d+\.\d+)\]', read(ROOT / 'CHANGELOG.md'), re.M)
    if not heads or heads[0] != suite:
        fails.append(f'CHANGELOG.md newest entry is [{heads[0] if heads else "none"}]; design-studio is {suite}')
    for name, path in (('plugin.json', ('version',)), ('marketplace.json', ('plugins', 0, 'version'))):
        f = ROOT / '.claude-plugin' / name
        if not f.exists():
            fails.append(f'.claude-plugin/{name} missing')
            continue
        try:
            value = json.loads(read(f))
            for k in path:
                value = value[k]
        except (ValueError, KeyError, IndexError, TypeError) as e:
            fails.append(f'.claude-plugin/{name}: cannot read {".".join(map(str, path))} ({e})')
            continue
        if value != suite:
            fails.append(f'.claude-plugin/{name}: version {value} != design-studio {suite}')
    return fails, []


# ---------------------------------------------------------------- G8 docs
GEN = re.compile(r'<!-- gen:([\w-]+) -->.*?<!-- /gen:\1 -->', re.S)
ATTR = re.compile(r'\b(?:href|src)="([^"]+)"')
REPO_URL = re.compile(r'^https://github\.com/caocong1/design-skill-lab/(?:blob|tree)/main/([^?#]+)')


def page_text(html):
    html = re.sub(r'<(script|style)\b.*?</\1>', ' ', html, flags=re.S | re.I)
    html = re.sub(r'<!--.*?-->', ' ', html, flags=re.S)
    return re.sub(r'<[^>]+>', ' ', html)


def g8_docs():
    fails = []
    data = json.loads(read(ROOT / 'docs/data/catalog.json'))
    counts = {len(data['resources']): 'catalogue entries', 601: 'the 0.7.0 catalogue size'}
    for p in sorted((ROOT / 'docs').rglob('*.html')):
        html = read(p)
        text = page_text(GEN.sub(' ', html))
        for n, what in counts.items():
            if re.search(rf'(?<![\d.,]){n}(?![\d.,])', text):
                fails.append(f'{rel(p)}: hand-typed {n} ({what}) outside a <!-- gen:* --> region; '
                             f'print it from data (scripts/site_pages.py) or drop it')
        for target in ATTR.findall(html):
            m = REPO_URL.match(target)
            if m:
                if not (ROOT / m.group(1)).exists():
                    fails.append(f'{rel(p)}: link to {m.group(1)} which is not in the repository')
                continue
            if re.match(r'^([a-z][a-z0-9+.-]*:|//|#|\?)', target):
                continue
            path = target.split('#')[0].split('?')[0]
            dest = (p.parent / path) if not path.startswith('/') else (ROOT / 'docs' / path.lstrip('/'))
            if path and not (dest / 'index.html' if path.endswith('/') else dest).exists():
                fails.append(f'{rel(p)}: {target} does not resolve')
    return fails, []


# ---------------------------------------------------------------- G9 stray files
STRAY = re.compile(r'(^|/)(\.DS_Store|__pycache__/|node_modules/|\.design/)|\.pyc$|\.shot\.png$')


def g9_stray():
    r = subprocess.run(['git', 'ls-files', '-z'], capture_output=True, text=True, cwd=ROOT)
    if r.returncode:
        return [], ['not a git checkout; stray-file check skipped']
    hits = [f for f in r.stdout.split('\0') if f and STRAY.search(f) and (ROOT / f).exists()]
    return [f'{f}: tracked but should not be (git rm --cached it; .gitignore covers it)' for f in hits], []


GATES = [
    ('G1', 'catalogue schema valid, generated views fresh', g1_catalogue),
    ('G2', 'thumbnail manifest covers every catalogue id', g2_thumbs),
    ('G3', 'research sources and INDEX.md fresh', g3_research),
    ('G4', 'skills: frontmatter, budgets, references, paths', g4_skills),
    ('G5', 'feedback inbox entries valid', g5_feedback),
    ('G6', 'eval trigger set valid', g6_triggers),
    ('G7', 'one version in SKILL.md, README, CHANGELOG, plugin', g7_versions),
    ('G8', 'docs: counts from data, links resolve', g8_docs),
    ('G9', 'no stray files tracked', g9_stray),
]


def main(argv):
    wanted = {a.upper() for a in argv}
    unknown = wanted - {g for g, _, _ in GATES}
    if unknown:
        print(f'unknown gate(s): {", ".join(sorted(unknown))}; known: {" ".join(g for g, _, _ in GATES)}')
        return 2
    failed = 0
    for gid, title, fn in GATES:
        if wanted and gid not in wanted:
            continue
        try:
            fails, warns = fn()
        except Exception as e:                      # a crashing gate is a failing gate, with its reason
            fails, warns = [f'gate crashed: {type(e).__name__}: {e}'], []
        print(f'{"FAIL" if fails else "PASS"}  {gid}  {title}')
        for line in fails:
            print(f'        - {line}')
        for line in warns:
            print(f'        warn: {line}')
        failed += bool(fails)
    print(f'\n{failed} gate(s) failed.' if failed else '\nOK  all gates pass.')
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
