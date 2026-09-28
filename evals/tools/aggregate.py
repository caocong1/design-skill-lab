#!/usr/bin/env python3
"""Aggregate a judged output-eval round (judging.md sections 8 and 9). Standard library only.

  evals/tools/aggregate.py <round dir> [--write] [--tables]

Reads, inside <round dir>:
  mapping.json                       {"sets": {"<brief>.s<k>": {"brief", "sample", "seed", "mapping": {label: "<arm>-s<k>"}}}}
  <brief>/judging/s<k>/J1..J3.json   judge replies, verbatim (judging.md section 7)
  <brief>/<arm>-s<k>/                run.json, facts.json, render/render.json, rationale-check.json
  leaks.json                         optional: {"arms": [{"brief", "arm", "identity_leak", "notes"}]}
Writes results.json (--write) in the shape of evals/results.schema.json and prints the numbers the report needs
(--tables prints them as Markdown). Every number in a report comes from here; nothing is typed by hand.

Rules applied (fixed before the round, judging.md):
  set pair      an arm wins a judged set when at least 2 of its 3 judges prefer it; otherwise a tie
  brief pair    the arm that wins the majority of the brief's samples; otherwise a tie
  claim         "X is better than Y" only if X wins at least 5 of 6 briefs AND its mean overall is >= 0.5 higher
"""
import itertools, json, pathlib, re, sys

DIMS = ['fit', 'hierarchy', 'identity', 'craft', 'typography', 'platform_a11y']
LENS = {'J1': 'product', 'J2': 'visual', 'J3': 'platform'}


def load(p, default=None):
    p = pathlib.Path(p)
    return json.loads(p.read_text()) if p.exists() else default


def base(arm):
    return re.sub(r'-s\d+$', '', arm)


def mean(xs):
    xs = list(xs)
    return sum(xs) / len(xs) if xs else 0.0


def r2(x):
    return round(x + 1e-9, 2)


def means_of(score_sets):
    """score_sets: list of {dim: int}. Returns the meanSet: per-dimension mean over judges, overall = mean of those."""
    m = {d: mean(s[d] for s in score_sets) for d in DIMS}
    m['overall'] = mean(m[d] for d in DIMS)
    return m


def rounded(m):
    return {k: r2(v) for k, v in m.items()}


def cost_of(run):
    if not run:
        return None
    t = run.get('tokens') or {}
    inp = sum(t.get(k) or 0 for k in ('input', 'cache_read', 'cache_creation'))
    sub = run.get('subagents')
    return {'wall_seconds': run.get('wall_seconds'), 'input_tokens': inp or None, 'output_tokens': t.get('output'),
            'usd': run.get('dollars'), 'subagents': sub.get('spawned') if isinstance(sub, dict) else sub}


def facts_of(arm_dir):
    render = {i['html']: i for i in (load(arm_dir / 'render/render.json', {}) or {}).get('items', [])}
    out = []
    for f in load(arm_dir / 'facts.json', []) or []:
        r = render.get(f['file'], {})
        errs = r.get('console_errors')
        row = {'file': f['file'], 'viewport': f['viewport'], 'status': f.get('status', r.get('status', 'ok')),
               'source': 'canonical', 'frames': r.get('frames', []), 'truncated': bool(r.get('truncated')),
               'horizontal_overflow': f.get('horizontal_overflow', r.get('horizontal_overflow')),
               'console_errors': len(errs) if isinstance(errs, list) else errs,
               'contrast_failures': f.get('contrast_failures'), 'lowest_contrast': f.get('lowest_contrast'),
               'lowest_contrast_where': f.get('lowest_contrast_where'), 'targets_under_24': f.get('targets_under_24'),
               'contrast_unmeasured': f.get('contrast_unmeasured'), 'images_missing_alt': f.get('images_missing_alt'),
               'method': f.get('method', 'evals/tools/facts.mjs')}
        if 'targets_under_44' in f:
            row['targets_under_44'] = f['targets_under_44']
        out.append(row)
    return out, render


def rationale_of(arm_dir):
    rc = load(arm_dir / 'rationale-check.json')
    if not rc:
        return None
    norm = lambda v: {'not checkable': 'not-checkable', 'not_checkable': 'not-checkable'}.get(v, v)
    claims = [{'claim': c['claim'], 'verdict': norm(c['verdict']), 'evidence': c.get('evidence', '')}
              for c in rc.get('claims', [])]
    out = {'source': sorted({c.get('source', 'NOTES.md') for c in rc.get('claims', [])}) or ['NOTES.md'],
           'claims': claims,
           'verified': sum(c['verdict'] == 'verified' for c in claims),
           'contradicted': sum(c['verdict'] == 'contradicted' for c in claims),
           'not_checkable': sum(c['verdict'] == 'not-checkable' for c in claims)}
    fn = rc.get('functions')
    if isinstance(fn, list):
        st = lambda f: f.get('status', '').replace('_', ' ')
        missing = [f['function'] for f in fn if st(f) == 'missing']
        out['functions'] = {'on_screen': sum(st(f) == 'on screen' for f in fn),
                            'accounted_for': sum(st(f) == 'accounted for' for f in fn),
                            'missing': len(missing), 'missing_list': missing}
    return out


def sign_flip_p(diffs):
    """Two-sided exact sign-flip test on paired differences (one per brief)."""
    obs = abs(sum(diffs))
    hits = sum(abs(sum(d * s for d, s in zip(diffs, signs))) >= obs - 1e-12
               for signs in itertools.product((1, -1), repeat=len(diffs)))
    return hits / 2 ** len(diffs)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if len(args) != 1:
        sys.exit(__doc__)
    rnd = pathlib.Path(args[0])
    mapping = load(rnd / 'mapping.json')
    leaks = {(a['brief'], a['arm']): a for a in (load(rnd / 'leaks.json', {}) or {}).get('arms', [])}
    sets = mapping['sets']
    arm_ids = sorted({base(a) for s in sets.values() for a in s['mapping'].values()})

    briefs, problems = [], []
    for key in sorted(sets):
        s = sets[key]
        brief, k = s['brief'], int(str(s['sample']).lstrip('s'))
        jdir = rnd / brief / 'judging' / f's{k}'
        replies = {j: load(jdir / f'{j}.json') for j in LENS}
        for j, rep in replies.items():
            if not rep:
                problems.append(f'{key}: no reply from {j}')
        replies = {j: rep for j, rep in replies.items() if rep}
        arms, prefs = {}, []
        for label, arm in sorted(s['mapping'].items()):
            d = rnd / brief / arm
            facts, render = facts_of(d)
            present = [i for i in render.values() if i.get('status') == 'ok']
            scores = {}
            for j, rep in replies.items():
                sc = rep['scores'].get(label)
                if not sc or any(dim not in sc for dim in DIMS):
                    problems.append(f'{key}: {j} has no full score set for {label}')
                    continue
                scores[j] = {**{dim: sc[dim] for dim in DIMS}, 'evidence': sc.get('evidence', [])}
            m = means_of(list(scores.values()))
            spread = [dim for dim in DIMS if scores and
                      max(x[dim] for x in scores.values()) - min(x[dim] for x in scores.values()) >= 3]
            run = load(d / 'run.json', {})
            leak = leaks.get((brief, arm), {})
            arms[base(arm)] = {
                'label': label,
                'status': 'ok' if render and len(present) == len(render) else ('partial' if present else 'empty'),
                'deliverables': {'expected': len(render), 'present': len(present),
                                 'missing': [h for h, i in render.items() if i.get('status') != 'ok']},
                'cost': cost_of(run), 'facts': facts, 'scores': scores, 'means': rounded(m),
                'disagreement': spread, 'rationale_check': rationale_of(d),
                'identity_leak': bool(leak.get('identity_leak')),
                'notes': leak.get('notes', '') if isinstance(leak.get('notes'), str) else '',
                '_means': m, '_reruns': run.get('reruns') or [],
            }
        for j, rep in replies.items():
            for p in rep.get('pairs', []):
                left, right = base(s['mapping'][p['left']]), base(s['mapping'][p['right']])
                prefer = {'left': left, 'right': right}.get(p['prefer'], 'tie')
                prefs.append({'judge': j, 'left': left, 'right': right, 'prefer': prefer, 'reason': p.get('reason', '')})
        pairs = []
        for x, y in itertools.combinations(arm_ids, 2):
            votes = {x: 0, y: 0, 'tie': 0}
            for p in prefs:
                if {p['left'], p['right']} == {x, y}:
                    votes[p['prefer']] += 1
            pairs.append({'arms': [x, y], 'votes': votes,
                          'winner': x if votes[x] >= 2 else y if votes[y] >= 2 else None})
        winners = [a for a in arm_ids if all(p['winner'] == a for p in pairs if a in p['arms'])]
        entry = {'brief': brief, 'sample': k, 'mapping': {l: base(a) for l, a in s['mapping'].items()},
                 'mapping_seed': s['seed'],
                 'judges': [{'id': j, 'lens': LENS[j], 'model': mapping.get('judge_model', 'claude-opus-5-5')} for j in LENS],
                 'arms': arms, 'preferences': prefs, 'pairs': pairs,
                 'winner': winners[0] if winners else None, 'winner_reason': 'condorcet' if winners else 'ties',
                 'reruns': [{'arm': a, 'reason': '; '.join(f"attempt {r.get('attempt')}: {r.get('cause')}" for r in v['_reruns'])}
                            for a, v in arms.items() if v['_reruns']]}
        ref = {j: rep['scores']['R'] for j, rep in replies.items() if 'R' in rep.get('scores', {})}
        if ref:
            ref = {j: {**{dim: sc[dim] for dim in DIMS}, 'evidence': sc.get('evidence', [])} for j, sc in ref.items()}
            entry['reference'] = {'scores': ref, 'means': rounded(means_of(list(ref.values())))}
        briefs.append(entry)

    # ---- across samples and briefs -------------------------------------------------------------------------
    names = sorted({b['brief'] for b in briefs})
    per_brief = {n: [b for b in briefs if b['brief'] == n] for n in names}
    brief_means = {a: {n: {k: mean(b['arms'][a]['_means'][k] for b in per_brief[n]) for k in DIMS + ['overall']}
                       for n in names} for a in arm_ids}
    arm_means = {a: {k: mean(brief_means[a][n][k] for n in names) for k in DIMS + ['overall']} for a in arm_ids}
    summary_pairs, claims, extra = [], [], []
    brief_winner = {}
    for y, x in itertools.combinations(arm_ids, 2):     # x = the later id (the suite), y = the earlier (no-skill)
        w = l = t = sw = sl = st = 0
        votes = {x: 0, y: 0, 'tie': 0}
        rows = []
        for n in names:
            res = [next(p for p in b['pairs'] if set(p['arms']) == {x, y}) for b in per_brief[n]]
            xs, ys = sum(p['winner'] == x for p in res), sum(p['winner'] == y for p in res)
            for p in res:
                for k2, v in p['votes'].items():
                    votes[k2] += v
            sw, sl, st = sw + xs, sl + ys, st + len(res) - xs - ys
            major = len(res) / 2
            bw = x if xs > major else y if ys > major else None
            brief_winner.setdefault(n, {})[(x, y)] = bw
            w, l, t = w + (bw == x), l + (bw == y), t + (bw is None)
            ov = lambda a: [b['arms'][a]['_means']['overall'] for b in per_brief[n]]
            rows.append({'brief': n, 'samples': f'{xs}-{ys}-{len(res) - xs - ys}', 'winner': bw,
                         x: ov(x), y: ov(y)})
        diff = arm_means[x]['overall'] - arm_means[y]['overall']
        diffs = [brief_means[x][n]['overall'] - brief_means[y][n]['overall'] for n in names]
        summary_pairs.append({'arms': [x, y], 'wins': w, 'losses': l, 'ties': t})
        better = w >= 5 and diff >= 0.5
        worse = l >= 5 and diff <= -0.5
        verdict = (f'{x} is better than {y}' if better else f'{y} is better than {x}' if worse
                   else f'No clear difference between {x} and {y}')
        why = [] if better or worse else [r for r, c in (
            ('neither arm won at least 5 of 6 briefs', max(w, l) < 5),
            ('the mean overall differs by less than 0.5', abs(diff) < 0.5)) if c]
        claims.append(f"{verdict}{' (' + ' and '.join(why) + ')' if why else ''}. {x} vs {y}: {x} won {w} of "
                      f"{len(names)} briefs, lost {l}, tied {t}; mean overall {arm_means[x]['overall']:.2f} vs "
                      f"{arm_means[y]['overall']:.2f} (difference {diff:+.2f}).")
        extra.append({'pair': [x, y], 'briefs': f'{w}-{l}-{t}', 'samples': f'{sw}-{sl}-{st}',
                      'judge_votes': votes, 'mean_diff': r2(diff), 'brief_diffs': [r2(d) for d in diffs],
                      'sign_flip_p': round(sign_flip_p(diffs), 3), 'rows': rows})
    summary_arms = {}
    for a in arm_ids:
        costs = [b['arms'][a]['cost'] for b in briefs if b['arms'][a]['cost']]
        tot = lambda k: sum(c.get(k) or 0 for c in costs)
        wins = sum(all(bw == a for bw in brief_winner[n].values()) for n in names)
        summary_arms[a] = {'means': rounded(arm_means[a]), 'brief_wins': wins,
                           'cost': {'wall_seconds': tot('wall_seconds'), 'input_tokens': tot('input_tokens'),
                                    'output_tokens': tot('output_tokens'), 'usd': round(tot('usd'), 4),
                                    'subagents': tot('subagents')}}
    for b in briefs:
        for v in b['arms'].values():
            v.pop('_means'), v.pop('_reruns')

    prev = load(rnd / 'results.json', {}) or {}
    results = {'round': prev.get('round') or mapping.get('round_meta') or {}, 'arms': prev.get('arms') or [],
               'briefs': briefs, 'summary': {'pairs': summary_pairs, 'arms': summary_arms, 'claims': claims}}
    if '--write' in sys.argv:
        (rnd / 'results.json').write_text(json.dumps(results, ensure_ascii=False, indent=1) + '\n')

    # ---- printout ----------------------------------------------------------------------------------------
    runs = len(briefs)
    print(f'{runs} judged sets, {len(names)} briefs, arms: {", ".join(arm_ids)}')
    for p in problems:
        print('PROBLEM', p)
    for c in claims:
        print('CLAIM', c)
    for e in extra:
        x, y = e['pair']
        print(f"\n{x} vs {y}: briefs {e['briefs']}, judged sets {e['samples']}, judge votes "
              f"{e['judge_votes'][x]}-{e['judge_votes'][y]}-{e['judge_votes']['tie']}, mean diff {e['mean_diff']:+.2f}, "
              f"sign-flip p over briefs {e['sign_flip_p']}")
        print(f"| Brief | Sets won ({x} - {y} - tie) | Brief result | {x} overall (samples) | {y} overall (samples) |")
        print('|---|---|---|---|---|')
        for r in e['rows']:
            f = lambda xs: f"{mean(xs):.2f} ({', '.join(f'{v:.2f}' for v in xs)})"
            print(f"| {r['brief']} | {r['samples']} | {r['winner'] or 'tie'} | {f(r[x])} | {f(r[y])} |")
    print('\n| Arm | ' + ' | '.join(DIMS) + ' | overall | brief wins | $ per run | min per run | contradicted claims |')
    print('|---|' + '---|' * (len(DIMS) + 5))
    for a in arm_ids:
        m, c = summary_arms[a]['means'], summary_arms[a]['cost']
        n = sum(1 for b in briefs if b['arms'][a]['cost'])
        contra = sum((b['arms'][a]['rationale_check'] or {}).get('contradicted', 0) for b in briefs)
        print(f"| {a} | " + ' | '.join(f'{m[d]:.2f}' for d in DIMS) + f" | {m['overall']:.2f} | "
              f"{summary_arms[a]['brief_wins']} | {c['usd'] / n:.2f} | {c['wall_seconds'] / n / 60:.1f} | {contra} |")
    hist = {}
    for b in briefs:
        for v in b['arms'].values():
            for sc in v['scores'].values():
                for d in DIMS:
                    hist[sc[d]] = hist.get(sc[d], 0) + 1
    print('\nscore histogram:', dict(sorted(hist.items())))
    floor = {a: {'contrast_failures': 0, 'targets_under_24': 0, 'targets_under_44': 0, 'overflow': 0} for a in arm_ids}
    for b in briefs:
        for a, v in b['arms'].items():
            for f in v['facts']:
                floor[a]['contrast_failures'] += f.get('contrast_failures') or 0
                floor[a]['targets_under_24'] += f.get('targets_under_24') or 0
                floor[a]['targets_under_44'] += f.get('targets_under_44') or 0
                floor[a]['overflow'] += bool(f.get('horizontal_overflow'))
    print('measured facts, summed over all files:', floor)
    sys.exit(1 if problems else 0)


if __name__ == '__main__':
    main()
