#!/usr/bin/env bash
# Mechanical gate for this lab's own conventions.
#
# The suite teaches "compute, do not estimate" and "what can be checked
# mechanically should not rely on discipline". This script is the lab holding
# itself to that. It is also the Definition of Done in
# skills/iterate-design-lab/SKILL.md.
#
# Usage: scripts/check-lab-invariants.sh
# Exit 0 = all invariants hold. Exit 1 = at least one violation.

set -uo pipefail
cd "$(dirname "$0")/.."

exec python3 - "$PWD" <<'PYEOF'
import json, pathlib, re, subprocess, sys

root = pathlib.Path(sys.argv[1])
violations, warnings = [], []
v = lambda check, msg: violations.append(f'[{check}] {msg}')
w = lambda check, msg: warnings.append(f'[{check}] {msg}')

# --- C1: the catalogue is valid and its generated views are fresh ----------------
r = subprocess.run([sys.executable, str(root / 'scripts/build-catalog.py'), '--check'],
                   capture_output=True, text=True)
if r.returncode:
    v('C1', (r.stderr or r.stdout).strip())

# --- C2: every SKILL.md has valid frontmatter and stays readable -------------------
skills = sorted((root / 'skills').glob('*/SKILL.md'))
versions = {}
for f in skills:
    text = f.read_text()
    rel = f.relative_to(root)
    m = re.match(r'^---\n(.*?)\n---\n', text, re.S)
    if not m:
        v('C2', f'{rel}: missing frontmatter fences'); continue
    fm = m.group(1)
    name = re.search(r'^name:\s*(\S+)\s*$', fm, re.M)
    if not name or name.group(1) != f.parent.name:
        v('C2', f'{rel}: frontmatter name must equal the directory name')
    desc = re.search(r'^description:\s*(.+)$', fm, re.M)
    if not desc:
        v('C2', f'{rel}: no description')
    elif len(desc.group(1)) > 1024:
        v('C2', f'{rel}: description is {len(desc.group(1))} chars (limit 1024)')
    ver = re.search(r'^\s+version:\s*(\d+\.\d+\.\d+)\s*$', fm, re.M)
    if not ver:
        v('C2', f'{rel}: no metadata.version')
    else:
        versions[f.parent.name] = ver.group(1)
    if '\t' in fm:
        v('C2', f'{rel}: tab in frontmatter')
    lines = text.count('\n')
    if lines > 500:
        v('C2', f'{rel}: {lines} lines; move detail into a reference file (limit 500)')
    if not (f.parent / 'agents' / 'openai.yaml').exists() and f.parent.name != 'iterate-design-lab':
        v('C2', f'{rel}: missing agents/openai.yaml')

# --- C3: the suite version agrees across SKILL.md, README.md, CHANGELOG.md -------
suite = versions.get('design-studio')
if suite:
    readme = (root / 'README.md').read_text() if (root / 'README.md').exists() else ''
    if f'suite 当前 {suite}' not in readme:
        v('C3', f'README.md does not state the literal "suite 当前 {suite}"')
    changelog = (root / 'CHANGELOG.md').read_text() if (root / 'CHANGELOG.md').exists() else ''
    heads = re.findall(r'^## \[(\d+\.\d+\.\d+)\]', changelog, re.M)
    if not heads:
        v('C3', 'CHANGELOG.md has no version headings')
    elif heads[0] != suite:
        v('C3', f'CHANGELOG.md newest entry is [{heads[0]}] but design-studio is {suite}')

# --- C4: numbered analysis files carry a well-formed metadata blockquote ---------
META = re.compile(r'^> 分析版本：\d+\.\d+ ｜ 最后更新：(\d{4}-\d{2}-\d{2}) ｜ ')
for f in sorted((root / 'analysis').glob('[0-9][0-9]-*.md')):
    lines = f.read_text().split('\n')
    if len(lines) < 3 or not lines[0].startswith('# ') or not META.match(lines[2]):
        v('C4', f'{f.relative_to(root)}: line 1 must be "# 标题" and line 3 '
                f'"> 分析版本：X.Y ｜ 最后更新：YYYY-MM-DD ｜ ..."')
    if '## 对最终 skill 的影响' not in f.read_text():
        v('C4', f'{f.relative_to(root)}: missing "## 对最终 skill 的影响"')

# --- C5: every digest says where it came from and that it is not verbatim --------
for f in sorted((root / 'raw/docs').glob('*.md')):
    head = '\n'.join(f.read_text().split('\n')[:8])
    if not re.search(r'https?://', head):
        v('C5', f'{f.relative_to(root)}: no source URL in the header')
    if not re.search(r'(Fetched|抓取)[:：]\s*\d{4}-\d{2}-\d{2}', head):
        v('C5', f'{f.relative_to(root)}: no fetch date in the header')
    if 'paraphrased structured digest' not in head and '转述式结构化摘要' not in head:
        v('C5', f'{f.relative_to(root)}: missing the not-verbatim note')

def skill_bases(f):
    """Directories a bare `scripts/x` or `references/x` inside a skill may resolve against."""
    if root / 'skills' not in f.parents:
        return ()
    skill_dir = next(p for p in [f.parent, *f.parents] if (p / 'SKILL.md').exists())
    return (f.parent, skill_dir, skill_dir / 'references')

# --- C6: lab-owned paths mentioned in backticks exist ------------------------------
OWNED = ('analysis/', 'skills/', 'raw/docs/', 'raw/research/', 'scripts/', 'catalog/',
         '.planning/', 'docs/index.html', 'docs/catalog.js')
PATH = re.compile(r'`([A-Za-z0-9_./*-]+\.(?:md|html|sh|py|json|jsonl|js|css|yaml))`')
scan = [root / 'README.md', root / 'CHANGELOG.md']
for sub in ('analysis', 'skills', '.planning', 'raw/docs'):
    scan += sorted((root / sub).rglob('*.md'))
for f in scan:
    if not f.exists():
        continue
    for hit in sorted(set(PATH.findall(f.read_text()))):
        if '*' in hit or '<' in hit or 'YYYY' in hit or not hit.startswith(OWNED):
            continue
        if not any((base / hit).exists() for base in (root, *skill_bases(f))):
            v('C6', f'{f.relative_to(root)}: references missing path `{hit}`')

# --- C7: relative links between skill files resolve --------------------------------
REL = re.compile(r'`((?:\.\./)+[A-Za-z0-9_./-]+\.(?:md|py|sh))`')
for f in sorted((root / 'skills').rglob('*.md')):
    for hit in sorted(set(REL.findall(f.read_text()))):
        if not (f.parent / hit).resolve().exists():
            v('C7', f'{f.relative_to(root)}: relative path `{hit}` does not resolve')
# bare references inside a skill (e.g. `references/platforms.md`, `scripts/shot.sh`)
LOCAL = re.compile(r'`((?:references|scripts|resources)/[A-Za-z0-9_./-]+\.(?:md|py|sh))`')
for f in sorted((root / 'skills').rglob('*.md')):
    for hit in sorted(set(LOCAL.findall(f.read_text()))):
        if not any((base / hit).exists() for base in (*skill_bases(f), root)):
            v('C7', f'{f.relative_to(root)}: `{hit}` resolves neither in this skill nor in the lab')

# --- C8: SOURCE_INDEX 更新时间 is not older than the newest 最后更新 it records ----
si = (root / 'analysis/SOURCE_INDEX.md').read_text()
m = re.search(r'更新时间：(\d{4}-\d{2}-\d{2})', si)
dates = re.findall(r'\| (\d{4}-\d{2}-\d{2}) \|', si)
if not m:
    v('C8', 'analysis/SOURCE_INDEX.md: no 更新时间 found')
elif dates and max(dates) > m.group(1):
    v('C8', f'SOURCE_INDEX 更新时间 {m.group(1)} is older than its newest 最后更新 {max(dates)}')

# --- C9: perishable reference files declare themselves -----------------------------
register = (root / 'skills/iterate-design-lab/SKILL.md').read_text()
register = register.split('## Perishable Register', 1)[-1].split('\n## ', 1)[0]
for hit in re.findall(r'^- `(skills/[^`]+\.md)`', register, re.M):
    p = root / hit
    if not p.exists():
        v('C9', f'Perishable Register lists missing file `{hit}`')
    elif not re.search(r'perishable|Perishable|dated', p.read_text()):
        w('C9', f'{hit} is in the Perishable Register but never says it is perishable')

# --- C10: link-check freshness (warning only) ---------------------------------------
reports = sorted((root / '.planning/link-checks').glob('*.md'))
if not reports:
    w('C10', 'no link-check report yet: run scripts/check-links.py --write')

for line in warnings:
    print(f'WARN  {line}')
for line in violations:
    print(f'FAIL  {line}')
if violations:
    print(f'\n{len(violations)} invariant violation(s).')
    sys.exit(1)
print(f'OK  all invariants hold ({len(warnings)} warning(s)); '
      f'{len(skills)} skills, suite {suite}.')
PYEOF
