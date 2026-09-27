#!/usr/bin/env python3
"""Print the name and description of every model-invocable skill in one or more skills directories.

A host model decides whether to load a skill from its name and description only, so this list is
exactly what the trigger-eval proxy shows the classifier (see evals/run_triggers.md).

Usage:
  evals/tools/descriptions.py skills/                    one "- name: description" line per skill
  evals/tools/descriptions.py DIR [DIR ...]              several directories, e.g. the suite plus distractors
  evals/tools/descriptions.py DIR --shuffle 2            the order for run 2 of 3 (see run_order)
  evals/tools/descriptions.py DIR --json                 [{"name", "description", "path"}, ...]
  evals/tools/descriptions.py DIR --include-disabled     also list skills with disable-model-invocation: true

The frontmatter reader is tolerant, not a YAML parser: it reads top-level scalar keys (plain, quoted,
multi-line plain, and | or > block scalars) and skips nested mappings such as metadata.
Warnings go to stderr; stdout carries only the list.
"""

import argparse
import json
import pathlib
import random
import re
import sys

HOST_LISTING_LIMIT = 1536  # Claude Code caps description + when_to_use in the skill listing
RUNS = 3  # the trigger eval asks every row once per run, in 3 runs per arm
KEY_RE = re.compile(r'^([A-Za-z0-9_-]+)\s*:(.*)$')
NESTED_KEY_RE = re.compile(r'^\s+[A-Za-z0-9_-]+\s*:(\s|$)')


def warn(msg):
    print(f'descriptions.py: {msg}', file=sys.stderr)


def frontmatter_lines(text):
    """Lines between the opening and closing '---' fences, or None."""
    lines = text.lstrip('﻿').splitlines()
    i = 0
    while i < len(lines) and not lines[i].strip():
        i += 1
    if i == len(lines) or lines[i].strip() != '---':
        return None
    for j in range(i + 1, len(lines)):
        if lines[j].strip() in ('---', '...'):
            return lines[i + 1:j]
    return None


def strip_comment(value):
    """Drop a trailing ' #comment' from an unquoted scalar, as YAML does."""
    m = re.search(r'\s#', value)
    return value[:m.start()] if m else value


def scalar(head, body):
    """Interpret one top-level value: head is the text after 'key:', body its indented continuation lines."""
    head = head.strip()
    if head[:1] in ('|', '>'):
        indents = [len(l) - len(l.lstrip()) for l in body if l.strip()]
        cut = min(indents) if indents else 0
        lines = [l[cut:] if l.strip() else '' for l in body]
        if head[0] == '|':
            return '\n'.join(lines).strip()
        paragraphs = '\n'.join(lines).split('\n\n')
        return '\n'.join(' '.join(p.split()) for p in paragraphs).strip()
    if not head and body and NESTED_KEY_RE.match(body[0]):
        return None  # a nested mapping (e.g. metadata): not a scalar
    text = ' '.join([head] + [l.strip() for l in body if l.strip()]).strip()
    quote = text[:1]
    if quote in ('"', "'"):
        end = text.rfind(quote)
        inner = text[1:end] if end > 0 else text[1:]
        if quote == "'":
            return inner.replace("''", "'")
        try:
            return json.loads(f'"{inner}"')
        except ValueError:
            return inner
    return ' '.join(strip_comment(l.strip()) for l in [head] + body if l.strip()).strip()


def parse_frontmatter(lines):
    """Top-level keys -> scalar string (None for nested mappings)."""
    blocks, key = {}, None
    for line in lines:
        if line[:1] in (' ', '\t') or not line.strip():
            if key:
                blocks[key][1].append(line)
            continue
        if line.lstrip().startswith('#'):
            continue
        m = KEY_RE.match(line)
        if m:
            key = m.group(1)
            blocks[key] = (m.group(2), [])
        else:
            key = None
    return {k: scalar(head, body) for k, (head, body) in blocks.items()}


def is_true(value):
    return isinstance(value, str) and value.strip().lower() in ('true', 'yes', 'on')


def skill_files(directory):
    d = pathlib.Path(directory)
    if not d.is_dir():
        warn(f'{d}: not a directory')
        return []
    if (d / 'SKILL.md').is_file():
        return [d / 'SKILL.md']
    return sorted(d.glob('*/SKILL.md'))


def load(directories, include_disabled):
    items = []
    for directory in directories:
        for path in skill_files(directory):
            lines = frontmatter_lines(path.read_text(encoding='utf-8', errors='replace'))
            if lines is None:
                warn(f'{path}: no frontmatter; skipped')
                continue
            fm = parse_frontmatter(lines)
            name = fm.get('name') or path.parent.name
            description = ' '.join((fm.get('description') or '').split())
            if not description:
                warn(f'{path}: no description; skipped (hosts do not list it)')
                continue
            if fm.get('when_to_use'):
                description = f"{description} {' '.join(fm['when_to_use'].split())}"
            if is_true(fm.get('disable-model-invocation')) and not include_disabled:
                warn(f'{name}: disable-model-invocation is true; not listed')
                continue
            if len(description) > HOST_LISTING_LIMIT:
                warn(f'{name}: {len(description)} chars; hosts may truncate beyond {HOST_LISTING_LIMIT}')
            items.append({'name': name, 'description': description, 'path': str(path)})
    return items


def run_order(items, run):
    """The listing order for run 1..RUNS: one fixed shuffle, rotated by a third of the list per run.

    Each skill starts a different third of the list in each run; with 3 skills, each skill takes every
    position exactly once. (Seeding a fresh shuffle per run does not do this: seeds 1, 2 and 3 give the
    same order for 3 items.) Runs beyond RUNS repeat the cycle.
    """
    items = sorted(items, key=lambda i: i['name'])
    random.Random(0).shuffle(items)
    k = ((run - 1) % RUNS) * len(items) // RUNS
    return items[k:] + items[:k]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('dirs', nargs='+', help='skills directories (each holds <skill>/SKILL.md)')
    ap.add_argument('--json', action='store_true', help='print a JSON list instead of lines')
    ap.add_argument('--shuffle', type=int, metavar='RUN', help='print the listing order for this run number (1-3)')
    ap.add_argument('--include-disabled', action='store_true', help='also list skills hosts do not auto-invoke')
    args = ap.parse_args()

    items = load(args.dirs, args.include_disabled)
    names = [i['name'] for i in items]
    for name in sorted({n for n in names if names.count(n) > 1}):
        warn(f'{name}: listed more than once')
    if args.shuffle is not None:
        items = run_order(items, args.shuffle)
    if args.json:
        print(json.dumps(items, ensure_ascii=False, indent=2))
    else:
        for i in items:
            print(f"- {i['name']}: {i['description']}")
    return 0 if items else 1


if __name__ == '__main__':
    sys.exit(main())
