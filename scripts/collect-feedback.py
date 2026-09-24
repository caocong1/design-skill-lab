#!/usr/bin/env python3
"""Aggregate skill-usage feedback entries into feedback/report.md.

Usage:
  scripts/collect-feedback.py                 refresh feedback/report.md
  scripts/collect-feedback.py --check         validate inbox only; exit 1 on problems
  scripts/collect-feedback.py --archive       move inbox entries to feedback/archive/YYYY-MM/
  scripts/collect-feedback.py --import PATH…  copy entries from host projects
                                              (e.g. .design/skill-feedback/) into the inbox

Entry format: one file per event in feedback/inbox/, a small frontmatter block
(date, skill, project, type, severity) followed by free-text sections.
See feedback/TEMPLATE.md.
"""

import argparse
import datetime
import pathlib
import re
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
INBOX = ROOT / 'feedback' / 'inbox'
ARCHIVE = ROOT / 'feedback' / 'archive'
REPORT = ROOT / 'feedback' / 'report.md'
TEMPLATE = ROOT / 'feedback' / 'TEMPLATE.md'

TYPES = ('correction', 'bug', 'friction', 'missing', 'preference')
SEVERITIES = ('blocker', 'major', 'minor', 'nit')
SEVERITY_WEIGHT = {'blocker': 4, 'major': 3, 'minor': 2, 'nit': 1}
DATE_RE = re.compile(r'^\d{4}-\d{2}-\d{2}$')
NAME_RE = re.compile(r'^\d{4}-\d{2}-\d{2}-.+\.md$')

TYPE_LABEL = {
    'correction': '用户纠正', 'bug': '缺陷', 'friction': '别扭/摩擦',
    'missing': '能力缺口', 'preference': '偏好',
}
SEV_LABEL = {
    'blocker': '阻塞', 'major': '较重', 'minor': '较轻', 'nit': '打磨',
}


def known_skills():
    return sorted(p.parent.name for p in ROOT.glob('skills/*/SKILL.md'))


def parse_entry(path):
    """Return (fields, problems). fields is {} when the file has no header."""
    text = path.read_text(encoding='utf-8')
    problems = []
    m = re.match(r'^---\n(.*?)\n---\n', text, re.S)
    if not m:
        return {}, [f'{path.name}: missing frontmatter block (see feedback/TEMPLATE.md)']
    fields = {}
    for line in m.group(1).splitlines():
        line = line.split('#', 1)[0].rstrip() if '#' in line else line.rstrip()
        if not line.strip():
            continue
        if ':' not in line:
            problems.append(f'{path.name}: unparsable header line: {line!r}')
            continue
        key, _, value = line.partition(':')
        fields[key.strip()] = value.strip()
    fm = m.group(1)
    if '\t' in fm:
        problems.append(f'{path.name}: tab in frontmatter')
    if not NAME_RE.match(path.name):
        problems.append(f'{path.name}: filename should be YYYY-MM-DD-<slug>.md')
    if not DATE_RE.match(fields.get('date', '')):
        problems.append(f'{path.name}: bad or missing date')
    skill = fields.get('skill', '')
    if skill not in known_skills():
        problems.append(f'{path.name}: unknown skill {skill!r}')
    if not fields.get('project'):
        problems.append(f'{path.name}: missing project')
    if fields.get('type', '') not in TYPES:
        problems.append(f'{path.name}: type must be one of {"/".join(TYPES)}')
    if fields.get('severity', '') not in SEVERITIES:
        problems.append(f'{path.name}: severity must be one of {"/".join(SEVERITIES)}')
    body = text[m.end():].strip()
    if len(body) < 10:
        problems.append(f'{path.name}: body is empty - say what happened')
    fields['_file'] = path.name
    fields['_body'] = body
    return fields, problems


def collect():
    """Parse the inbox. Returns (entries, problems)."""
    entries, problems = [], []
    for path in sorted(INBOX.glob('*.md')):
        fields, probs = parse_entry(path)
        problems.extend(probs)
        if fields:
            entries.append(fields)
    return entries, problems


def write_report(entries):
    today = datetime.date.today().isoformat()
    lines = [
        '# 反馈聚合报告',
        '',
        f'> 生成物，勿手改。`scripts/collect-feedback.py` 生成于 {today}；'
        f'inbox 共 {len(entries)} 条。处理流程见 `feedback/README.md`。',
        '',
    ]
    if not entries:
        lines += ['inbox 为空，没有待处理的反馈。', '']
    by_skill = {}
    for e in entries:
        by_skill.setdefault(e['skill'], []).append(e)
    # overview table
    lines += ['## 总览', '',
              '| skill | 条数 | 加权分 | 阻塞/较重 | 主要类型 |',
              '| --- | --- | --- | --- | --- |']
    rows = []
    for skill, items in by_skill.items():
        score = sum(SEVERITY_WEIGHT[i['severity']] for i in items)
        heavy = sum(1 for i in items if i['severity'] in ('blocker', 'major'))
        types = {}
        for i in items:
            types[i['type']] = types.get(i['type'], 0) + 1
        top = '、'.join(TYPE_LABEL[t] for t, _ in
                        sorted(types.items(), key=lambda kv: -kv[1])[:2])
        rows.append((score, skill, len(items), heavy, top))
    for score, skill, n, heavy, top in sorted(rows, reverse=True):
        lines.append(f'| {skill} | {n} | {score} | {heavy} | {top} |')
    lines.append('')
    # per-skill detail, highest weight first
    for score, skill, items in sorted(
            ((sum(SEVERITY_WEIGHT[i['severity']] for i in v), k, v)
             for k, v in by_skill.items()), reverse=True):
        lines += [f'## {skill}（{len(items)} 条，加权 {score}）', '']
        items = sorted(items, key=lambda i: (-SEVERITY_WEIGHT[i['severity']],
                                             i['date']), )
        for i in items:
            content = [re.sub(r'^#+\s*', '', ln).strip()
                       for ln in i['_body'].splitlines() if ln.strip()]
            content = [ln for ln in content
                       if ln.lower() not in ('what happened',
                                             'expected / suggestion')]
            first = content[0] if content else ''
            if len(first) > 80:
                first = first[:80] + '…'
            lines.append(f"- **{i['date']}** `{i['_file']}` "
                         f"{SEV_LABEL[i['severity']]} / {TYPE_LABEL[i['type']]} "
                         f"（{i['project']}）：{first}")
        lines.append('')
    lines += ['---', '',
              '逐条全文在 `feedback/inbox/`。处理完用 '
              '`scripts/collect-feedback.py --archive` 归档，'
              '并在 `feedback/log.md` 追加处置记录。', '']
    REPORT.write_text('\n'.join(lines), encoding='utf-8')


def import_entries(paths):
    copied = 0
    for raw in paths:
        src = pathlib.Path(raw).expanduser()
        files = [src] if src.is_file() else sorted(src.glob('*.md'))
        if not files:
            print(f'WARN  no .md files under {src}')
        for f in files:
            dest = INBOX / f.name
            n = 2
            while dest.exists():
                dest = INBOX / f'{f.stem}-{n}{f.suffix}'
                n += 1
            shutil.copy2(f, dest)
            copied += 1
            print(f'imported {f} -> {dest.relative_to(ROOT)}')
    print(f'{copied} file(s) imported.')


def archive_entries(entries):
    if not entries:
        print('inbox is empty, nothing to archive.')
        return
    month = datetime.date.today().strftime('%Y-%m')
    dest_dir = ARCHIVE / month
    dest_dir.mkdir(parents=True, exist_ok=True)
    for e in entries:
        shutil.move(str(INBOX / e['_file']), str(dest_dir / e['_file']))
    print(f'{len(entries)} file(s) archived to feedback/archive/{month}/.')


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--check', action='store_true',
                    help='validate inbox entries only; exit 1 on problems')
    ap.add_argument('--archive', action='store_true',
                    help='move all inbox entries into feedback/archive/YYYY-MM/')
    ap.add_argument('--import', dest='imports', nargs='+', metavar='PATH',
                    help='import entry files (or directories of them) into the inbox')
    args = ap.parse_args()

    if args.imports:
        import_entries(args.imports)
        return 0

    entries, problems = collect()
    for p in problems:
        print(f'FAIL  {p}')
    if args.check:
        if problems:
            print(f'\n{len(problems)} feedback problem(s).')
            return 1
        print(f'OK  {len(entries)} inbox entr{"y" if len(entries) == 1 else "ies"} valid.')
        return 0
    write_report(entries)
    print(f'report written: {REPORT.relative_to(ROOT)} '
          f'({len(entries)} entries, {len(problems)} problem(s))')
    if args.archive:
        archive_entries(entries)
        write_report([])  # inbox is empty now; leave no stale report
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
