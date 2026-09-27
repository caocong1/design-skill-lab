#!/usr/bin/env python3
"""Validate evals/triggers.jsonl, or score a trigger-eval results file against it.

Usage:
  evals/tools/score_triggers.py --validate                          check the trigger set; exit 1 on problems
  evals/tools/score_triggers.py RESULTS.jsonl --suite 0.8.0         Markdown report against "expect"
  evals/tools/score_triggers.py RESULTS.jsonl --suite 0.7.0         role view against "expect" + exact view against "expect_07"
  evals/tools/score_triggers.py RESULTS.jsonl --suite 0.8.0 --json  the same numbers as JSON
  evals/tools/score_triggers.py ... --triggers PATH                 use another trigger set

RESULTS.jsonl holds one {"id": "t001", "run": 1, "answer": "design-studio"} per line; extra keys are ignored.
The role view is the comparable headline: 0.7.0 answers are mapped to the 0.8.0 skill that now owns their job
(ROLE_07). Rows marked "ambiguous": true are reported with their answers but left out of every metric. Rows marked
"collision": true test a description collision found by the skills audit; they get their own slice and table.
Method and limits: evals/run_triggers.md.
"""

import argparse
import collections
import json
import pathlib
import re
import sys

EVALS = pathlib.Path(__file__).resolve().parent.parent
TRIGGERS = EVALS / 'triggers.jsonl'

SUITE_08 = ('design-studio', 'critique-design', 'implement-design')
SUITE_07 = ('build-design-system', 'critique-design', 'design-brand-identity', 'design-graphics',
            'design-icons', 'design-marketing-sites', 'design-motion', 'design-product-ui', 'design-studio',
            'explore-design-directions', 'find-design-inspiration', 'handoff-design', 'implement-design',
            'iterate-design-lab')
# Which 0.8.0 skill owns each 0.7.0 skill's job (BLUEPRINT §1-2). iterate-design-lab becomes a repo-local
# maintainer skill that hosts do not auto-invoke, so for the three public skills its rows are "none".
ROLE_07 = {
    'design-studio': 'design-studio', 'explore-design-directions': 'design-studio',
    'find-design-inspiration': 'design-studio', 'design-product-ui': 'design-studio',
    'design-marketing-sites': 'design-studio', 'build-design-system': 'design-studio',
    'design-motion': 'design-studio', 'design-icons': 'design-studio', 'design-brand-identity': 'design-studio',
    'design-graphics': 'design-studio', 'handoff-design': 'design-studio',
    'critique-design': 'critique-design', 'implement-design': 'implement-design',
    'iterate-design-lab': 'none', 'none': 'none',
}
LANGS = ('zh', 'en')
KINDS = ('positive', 'near-miss', 'negative')
REQUIRED = ('id', 'prompt', 'lang', 'expect', 'expect_07', 'kind', 'note')
ID_RE = re.compile(r'^[th]\d{3}$')  # t: this set, h: a held-out set (run_triggers.md)
NONE_WORDS = {'', 'none', 'no', 'no skill', 'no-skill', 'null', 'n/a', 'na'}
NONE_RE = re.compile(r'^(none|no skill|no-skill)\b')  # "none of these", "No skill needed"

# Shape targets for the shipped set (checked by --validate only).
MIN_ROWS, MIN_NOT_POSITIVE, ZH_SHARE = 60, 0.40, (0.45, 0.65)
MIN_PER_EXPECT, MIN_PER_EXPECT_07 = 8, 2


def read_jsonl(path):
    """[(line_number, object)], [problems]"""
    items, problems = [], []
    for n, line in enumerate(pathlib.Path(path).read_text(encoding='utf-8').splitlines(), 1):
        if not line.strip():
            continue
        try:
            obj = json.loads(line)
        except ValueError as e:
            problems.append(f'{path}:{n}: not JSON ({e})')
            continue
        if not isinstance(obj, dict):
            problems.append(f'{path}:{n}: not a JSON object')
            continue
        items.append((n, obj))
    return items, problems


def check_rows(items):
    """Per-row problems of a trigger set."""
    problems, seen = [], set()
    for n, r in items:
        where = f'line {n} ({r.get("id", "?")})'
        missing = [k for k in REQUIRED if not isinstance(r.get(k), str) or not r[k].strip()]
        if missing:
            problems.append(f'{where}: missing or empty {", ".join(missing)}')
            continue
        if not ID_RE.match(r['id']):
            problems.append(f'{where}: id must look like t001 (or h001 in a held-out set)')
        if r['id'] in seen:
            problems.append(f'{where}: duplicate id')
        seen.add(r['id'])
        if r['lang'] not in LANGS:
            problems.append(f'{where}: lang must be one of {LANGS}')
        if r['kind'] not in KINDS:
            problems.append(f'{where}: kind must be one of {KINDS}')
        if r['expect'] not in SUITE_08 + ('none',):
            problems.append(f'{where}: expect must be a 0.8.0 skill or none')
        if r['expect_07'] not in SUITE_07 + ('none',):
            problems.append(f'{where}: expect_07 must be a 0.7.0 skill or none')
        elif ROLE_07[r['expect_07']] != r['expect']:
            problems.append(f'{where}: expect_07 {r["expect_07"]} maps to {ROLE_07[r["expect_07"]]}, '
                            f'but expect is {r["expect"]}')
        if r['kind'] == 'positive' and r['expect'] == 'none':
            problems.append(f'{where}: a positive row must expect a skill')
        if r['kind'] == 'negative' and r['expect'] != 'none':
            problems.append(f'{where}: a negative row must expect none')
        for flag in ('ambiguous', 'collision'):
            if not isinstance(r.get(flag, False), bool):
                problems.append(f'{where}: {flag} must be true or false')
    return problems


def check_shape(rows):
    """Problems with the set as a whole, plus a one-screen summary. Ambiguous rows do not count."""
    ambiguous = sum(1 for r in rows if r.get('ambiguous'))
    rows = [r for r in rows if not r.get('ambiguous')]
    problems, n = [], len(rows)
    count = collections.Counter
    langs, kinds = count(r['lang'] for r in rows), count(r['kind'] for r in rows)
    expects, expects_07 = count(r['expect'] for r in rows), count(r['expect_07'] for r in rows)
    zh = langs['zh'] / n if n else 0
    not_positive = (kinds['near-miss'] + kinds['negative']) / n if n else 0
    if n < MIN_ROWS:
        problems.append(f'{n} rows; need at least {MIN_ROWS}')
    if not_positive < MIN_NOT_POSITIVE:
        problems.append(f'near-miss + negative is {not_positive:.0%}; need at least {MIN_NOT_POSITIVE:.0%}')
    if not ZH_SHARE[0] <= zh <= ZH_SHARE[1]:
        problems.append(f'zh share is {zh:.0%}; keep it between {ZH_SHARE[0]:.0%} and {ZH_SHARE[1]:.0%}')
    for label in SUITE_08 + ('none',):
        if expects[label] < MIN_PER_EXPECT:
            problems.append(f'expect {label}: {expects[label]} rows; need at least {MIN_PER_EXPECT}')
    for label in SUITE_07:
        if expects_07[label] < MIN_PER_EXPECT_07:
            problems.append(f'expect_07 {label}: {expects_07[label]} rows; need at least {MIN_PER_EXPECT_07}')
    summary = (f'{n} scored rows (+{ambiguous} ambiguous, not scored) · zh {zh:.0%} · '
               f'near-miss+negative {not_positive:.0%}\n'
               f'kind: {dict(kinds)}\nexpect: {dict(expects)}\nexpect_07: {dict(sorted(expects_07.items()))}')
    return problems, summary


def normalise(answer, labels):
    """A label, 'none', or 'foreign:<text>' (a skill outside this suite; scored as none)."""
    text = str(answer if answer is not None else '').strip()
    s = text.splitlines()[0] if text else ''
    s = s.strip().strip('`"\'*.- ').lstrip('/').lower()
    if ':' in s and s.rsplit(':', 1)[1].strip() in labels:  # plugin namespace, e.g. design-skill-lab:design-studio
        s = s.rsplit(':', 1)[1].strip()
    if s in labels:
        return s
    if s.replace(' ', '-') in labels:  # "design studio"
        return s.replace(' ', '-')
    if s in NONE_WORDS or NONE_RE.match(s):
        return 'none'
    found = [label for label in labels if label in s]
    return found[0] if len(found) == 1 else f'foreign:{s}'


def ratio(a, b):
    return a / b if b else None


def metrics(samples, classes):
    """samples: [(row, run, expected, got)] with got already in classes."""
    n = len(samples)
    right = [s for s in samples if s[2] == s[3]]
    per_class = {}
    for c in classes:
        support = sum(1 for s in samples if s[2] == c)
        predicted = sum(1 for s in samples if s[3] == c)
        tp = sum(1 for s in samples if s[2] == c and s[3] == c)
        per_class[c] = {'support': support, 'predicted': predicted,
                        'precision': ratio(tp, predicted), 'recall': ratio(tp, support)}
    def acc_by(field, values):
        out = {}
        for v in values:
            group = [s for s in samples if s[0][field] == v]
            out[v] = {'samples': len(group), 'accuracy': ratio(sum(1 for s in group if s[2] == s[3]), len(group))}
        return out
    none_rows = [s for s in samples if s[2] == 'none']
    skill_rows = [s for s in samples if s[2] != 'none']
    by_id, expected_of, rows = collections.defaultdict(list), {}, {}
    for row, run, expected, got in samples:
        by_id[row['id']].append((run, got))
        expected_of[row['id']], rows[row['id']] = expected, row
    majority_right, repeated, unanimous, errors, collisions = 0, 0, 0, [], []
    for rid, answers in sorted(by_id.items()):
        gots = [g for _, g in sorted(answers, key=lambda a: str(a[0]))]
        top, top_n = collections.Counter(gots).most_common(1)[0]
        expected = expected_of[rid]
        majority_ok = top_n * 2 > len(gots) and top == expected
        majority_right += majority_ok
        if rows[rid].get('collision'):
            collisions.append({'id': rid, 'expected': expected, 'answers': gots, 'majority_right': majority_ok,
                               'prompt': rows[rid]['prompt']})
        if len(gots) > 1:  # stability means something only for rows answered more than once
            repeated += 1
            unanimous += len(set(gots)) == 1
        if any(g != expected for g in gots):
            errors.append({'id': rid, 'kind': rows[rid]['kind'], 'expected': expected, 'answers': gots,
                           'prompt': rows[rid]['prompt']})
    return {
        'samples': n, 'rows': len(by_id),
        'accuracy': ratio(len(right), n),
        'majority_accuracy': ratio(majority_right, len(by_id)),
        'unanimous_rows': ratio(unanimous, repeated),
        'false_trigger_rate': ratio(sum(1 for s in none_rows if s[3] != 'none'), len(none_rows)),
        'miss_rate': ratio(sum(1 for s in skill_rows if s[3] == 'none'), len(skill_rows)),
        'wrong_skill_rate': ratio(sum(1 for s in skill_rows if s[3] not in ('none', s[2])), len(skill_rows)),
        'per_class': per_class,
        'by_kind': acc_by('kind', KINDS),
        'by_lang': acc_by('lang', LANGS),
        'by_collision': {name: {'samples': len(g), 'accuracy': ratio(sum(1 for s in g if s[2] == s[3]), len(g))}
                         for name, g in (('collision rows', [s for s in samples if s[0].get('collision')]),
                                         ('other rows', [s for s in samples if not s[0].get('collision')]))},
        'collision_rows': collisions,
        'confusion': {f'{e} -> {g}': k for (e, g), k in sorted(collections.Counter((s[2], s[3]) for s in samples).items())},
        'errors': errors,
    }


def score(rows, results, suite):
    labels = SUITE_08 if suite == '0.8.0' else SUITE_07
    rows_by_id = {r['id']: r for r in rows}
    foreign = collections.Counter()
    exact, role, ambiguous = [], [], collections.defaultdict(list)
    for row, run, answer in results:
        got = normalise(answer, labels)
        if got.startswith('foreign:'):
            foreign[got[len('foreign:'):]] += 1
            got = 'none'
        if row.get('ambiguous'):
            ambiguous[row['id']].append((str(run), got))
        elif suite == '0.8.0':
            role.append((row, run, row['expect'], got))
        else:
            exact.append((row, run, row['expect_07'], got))
            role.append((row, run, row['expect'], ROLE_07[got]))
    views = {'role': metrics(role, SUITE_08 + ('none',))}
    if suite == '0.7.0':
        views['exact'] = metrics(exact, SUITE_07 + ('none',))
        views['exact']['router_fallback'] = sum(
            1 for s in exact if s[3] == 'design-studio' and s[2] not in ('design-studio', 'none'))
    answered = {row['id'] for row, _, _ in results}
    return {
        'suite': suite,
        'rows_total': len(rows), 'rows_answered': len(answered),
        'unanswered': sorted(r['id'] for r in rows if r['id'] not in answered),
        'runs': sorted({str(run) for _, run, _ in results}),
        'foreign_answers': dict(foreign),
        'views': views,
        'ambiguous': [{'id': rid, 'prompt': rows_by_id[rid]['prompt'], 'expect': rows_by_id[rid]['expect'],
                       'answers': [g for _, g in sorted(answers)]}
                      for rid, answers in sorted(ambiguous.items())],
    }


def pct(x):
    return '—' if x is None else f'{x:.1%}'


def render_view(title, v, classes, matrix):
    out = [f'## {title}', '', '| metric | value |', '| --- | --- |']
    for key, label in (('accuracy', 'accuracy (all samples)'), ('majority_accuracy', 'majority-vote accuracy (rows)'),
                       ('unanimous_rows', 'rows with identical answers across runs'),
                       ('false_trigger_rate', 'false-trigger rate (expected none)'),
                       ('miss_rate', 'miss rate (expected a skill, got none)'),
                       ('wrong_skill_rate', 'wrong-skill rate (expected a skill, got another)')):
        out.append(f'| {label} | {pct(v[key])} |')
    if 'router_fallback' in v:
        out.append(f'| router fallback (design-studio answered a child\'s intent) | {v["router_fallback"]} samples |')
    out += ['', f'Samples: {v["samples"]} over {v["rows"]} rows.', '',
            '| class | support | predicted | precision | recall |', '| --- | --- | --- | --- | --- |']
    for c in classes:
        p = v['per_class'][c]
        if p['support'] or p['predicted']:
            out.append(f'| {c} | {p["support"]} | {p["predicted"]} | {pct(p["precision"])} | {pct(p["recall"])} |')
    out += ['', '| slice | samples | accuracy |', '| --- | --- | --- |']
    for field in ('by_kind', 'by_lang', 'by_collision'):
        for key, s in v[field].items():
            if s['samples']:
                out.append(f'| {key} | {s["samples"]} | {pct(s["accuracy"])} |')
    out += ['', 'Confusion (rows = expected, columns = answered):', '']
    if matrix:
        out += ['| expected \\ answered | ' + ' | '.join(classes) + ' |', '| --- |' + ' --- |' * len(classes)]
        for e in classes:
            cells = [str(v['confusion'].get(f'{e} -> {g}', 0)) for g in classes]
            out.append(f'| {e} | ' + ' | '.join(cells) + ' |')
    else:
        off = sorted(((k, n) for k, n in v['confusion'].items() if k.split(' -> ')[0] != k.split(' -> ')[1]),
                     key=lambda kv: -kv[1])
        out += [f'- {k}: {n}' for k, n in off] or ['- (no misroutes)']
    if v['collision_rows']:
        ok = sum(1 for c in v['collision_rows'] if c['majority_right'])
        out += ['', f'Known collision rows: {ok} of {len(v["collision_rows"])} right by majority vote.', '',
                '| id | expected | answers | majority right | prompt |', '| --- | --- | --- | --- | --- |']
        for c in v['collision_rows']:
            prompt = c['prompt'].replace('|', '\\|')
            prompt = prompt if len(prompt) <= 70 else prompt[:69] + '…'
            out.append(f'| {c["id"]} | {c["expected"]} | {", ".join(c["answers"])} | {"yes" if c["majority_right"] else "no"} | {prompt} |')
    out += ['', f'Misrouted rows ({len(v["errors"])}):', '']
    if v['errors']:
        out += ['| id | kind | expected | answers | prompt |', '| --- | --- | --- | --- | --- |']
        for e in v['errors']:
            prompt = e['prompt'].replace('|', '\\|')
            prompt = prompt if len(prompt) <= 70 else prompt[:69] + '…'
            out.append(f'| {e["id"]} | {e["kind"]} | {e["expected"]} | {", ".join(e["answers"])} | {prompt} |')
    else:
        out.append('None.')
    return out


def render(summary, results_path):
    s = summary
    out = [f'# Trigger eval — suite {s["suite"]}', '',
           f'- results: `{results_path}`',
           f'- rows answered: {s["rows_answered"]}/{s["rows_total"]}; runs: {", ".join(s["runs"])}',
           f'- unanswered rows: {", ".join(s["unanswered"]) or "none"}',
           f'- answers naming a skill outside the suite (scored as none): '
           f'{", ".join(f"{k} ×{n}" for k, n in s["foreign_answers"].items()) or "none"}',
           '- proxy method, not host triggering: see evals/run_triggers.md', '']
    out += render_view('Role view (comparable across suites)', s['views']['role'], SUITE_08 + ('none',), True)
    if 'exact' in s['views']:
        out += [''] + render_view('Exact 0.7.0 skill (expect_07)', s['views']['exact'], SUITE_07 + ('none',), False)
    if s['ambiguous']:
        out += ['', '## Ambiguous rows (reported, not scored)', '',
                'Answers in the role view\'s labels for 0.8.0, in the 14 names for 0.7.0.', '',
                '| id | label if forced | answers | prompt |', '| --- | --- | --- | --- |']
        for a in s['ambiguous']:
            prompt = a['prompt'].replace('|', '\\|')
            out.append(f'| {a["id"]} | {a["expect"]} | {", ".join(a["answers"])} | {prompt} |')
    return '\n'.join(out) + '\n'


def load_results(path, rows_by_id):
    items, problems = read_jsonl(path)
    results, seen = [], set()
    for n, r in items:
        rid, run = r.get('id'), r.get('run')
        if rid not in rows_by_id:
            problems.append(f'{path}:{n}: unknown id {rid!r}')
        elif run is None or 'answer' not in r:
            problems.append(f'{path}:{n}: needs "run" and "answer"')
        elif (rid, str(run)) in seen:
            problems.append(f'{path}:{n}: duplicate result for {rid} run {run}')
        else:
            seen.add((rid, str(run)))
            results.append((rows_by_id[rid], run, r['answer']))
    return results, problems


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('results', nargs='?', help='results JSONL: {"id","run","answer"} per line')
    ap.add_argument('--suite', choices=('0.8.0', '0.7.0'), help='which skill set produced the answers')
    ap.add_argument('--validate', action='store_true', help='check the trigger set and exit')
    ap.add_argument('--json', action='store_true', help='print the summary as JSON')
    ap.add_argument('--triggers', default=str(TRIGGERS), help='trigger set (default: evals/triggers.jsonl)')
    args = ap.parse_args()
    if not args.validate and not (args.results and args.suite):
        ap.error('give RESULTS.jsonl with --suite, or --validate')

    items, problems = read_jsonl(args.triggers)
    problems += check_rows(items)
    rows = [r for _, r in items]
    if args.validate:
        if not problems:
            shape_problems, summary = check_shape(rows)
            problems += shape_problems
            print(summary)
        for p in problems:
            print(f'FAIL {p}', file=sys.stderr)
        print('OK trigger set valid' if not problems else f'{len(problems)} problem(s)')
        return 1 if problems else 0
    if problems:
        for p in problems:
            print(f'FAIL {p}', file=sys.stderr)
        return 1

    results, problems = load_results(args.results, {r['id']: r for r in rows})
    if problems:
        for p in problems:
            print(f'FAIL {p}', file=sys.stderr)
        return 1
    if not results:
        print(f'FAIL {args.results}: no results', file=sys.stderr)
        return 1
    summary = score(rows, results, args.suite)
    if args.json:
        print(json.dumps(summary, ensure_ascii=False, indent=2))
    else:
        sys.stdout.write(render(summary, args.results))
    return 0


if __name__ == '__main__':
    sys.exit(main())
