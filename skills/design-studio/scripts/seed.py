#!/usr/bin/env python3
"""Roll which referents reach the options board and which one leads.

  seed.py --brief .design/brief.md --round 1 [--seed N] [--pick 3] [--skip 2] REFERENTS

REFERENTS is a text file with one referent per line, in the order they came to mind:
    <referent> | <material family> | <quality to take>
Blank lines and lines starting with # are ignored; list markers ("1.", "-") are stripped.

The roll is deterministic: sha256 of the brief text, the round and the seed. The same inputs
always give the same board, so the result can be recorded in decisions.md and re-checked.
The lead is never one of the first --skip lines (first ideas are the most probable ones);
the other picks come from every remaining line. Board order: lead first (A), then the rest.

Prints a short report; the last line is the same result as JSON.
Procedure: references/process/directions.md. Python 3 stdlib only.
"""
import argparse
import hashlib
import json
import re
import sys
from collections import Counter
from pathlib import Path

LETTERS = "ABCDEFGHIJ"


def fail(message):
    print(f"seed.py: {message}", file=sys.stderr)
    sys.exit(2)


def read_referents(path):
    lines = []
    for number, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        text = raw.strip()
        if not text or text.startswith("#"):
            continue
        lines.append((number, re.sub(r"^(\d+[.)]|[-*])\s+", "", text)))
    return lines


def unit(key, label):
    """A number in [0, 1) derived from the key and a label; stable across Python versions."""
    digest = hashlib.sha256(f"{key}:{label}".encode()).digest()
    return int.from_bytes(digest[:4], "big") / 2**32


def roll(brief_text, round_no, seed, count, pick, skip):
    material = f"{brief_text}\nround={round_no}\nseed={seed}"
    key = hashlib.sha256(material.encode()).hexdigest()[:8]
    lead = skip + int(unit(key, "lead") * (count - skip))
    rest = [i for i in range(count) if i != lead]
    board = [lead]
    for n in range(1, pick):
        board.append(rest.pop(int(unit(key, f"pick{n}") * len(rest))))
    return key, board


def family_warnings(referents):
    fields = [text.split("|") for _, text in referents]
    if not all(len(f) >= 2 for f in fields):
        return ["add a material family to every line (<referent> | <family> | <quality>)"]
    families = Counter(f[1].strip().lower() for f in fields)
    warnings = []
    if len(families) < 3:
        warnings.append(f"only {len(families)} material families; the procedure asks for at least 3")
    crowded = [name for name, n in families.items() if n > 3]
    if crowded:
        warnings.append(f"more than 3 referents in {', '.join(crowded)}; dig further")
    return warnings


def main():
    parser = argparse.ArgumentParser(
        description="Deterministic divergence roll: which referents reach the options board, and which leads.",
        epilog="Example: seed.py --brief .design/brief.md --round 1 --pick 3 .design/directions/1/referents.txt")
    parser.add_argument("referents", type=Path, help="one referent per line, in the order they came to mind")
    parser.add_argument("--brief", type=Path, required=True, help="the round's brief (its text enters the hash)")
    parser.add_argument("--round", type=int, required=True, help="round number, 1 or more")
    parser.add_argument("--seed", type=int, default=0, help="user seed for a different roll of the same brief (default 0)")
    parser.add_argument("--pick", type=int, default=3, help="referents that reach the board, lead included (default 3)")
    parser.add_argument("--skip", type=int, default=2, help="the lead never comes from the first N lines (default 2)")
    args = parser.parse_args()

    for path in (args.brief, args.referents):
        if not path.is_file():
            fail(f"not a file: {path}")
    if args.round < 1:
        fail("--round must be 1 or more")
    if not 1 <= args.pick <= len(LETTERS):
        fail(f"--pick must be between 1 and {len(LETTERS)}")
    if args.skip < 0:
        fail("--skip must be 0 or more")

    referents = read_referents(args.referents)
    count = len(referents)
    if count < args.pick:
        fail(f"{count} referents for --pick {args.pick}; list more")
    if count <= args.skip:
        fail(f"the lead comes after the first {args.skip} lines, but there are only {count}; list more or lower --skip")

    brief_text = args.brief.read_text(encoding="utf-8").replace("\r\n", "\n").strip()
    key, board = roll(brief_text, args.round, args.seed, count, args.pick, args.skip)

    warnings = family_warnings(referents)
    if count < 7:
        warnings.insert(0, f"{count} referents; the procedure asks for 7")
    for warning in warnings:
        print(f"seed.py: warning: {warning}", file=sys.stderr)

    slots = []
    for slot, index in zip(LETTERS, board):
        number, text = referents[index]
        slots.append({"slot": slot, "role": "lead" if index == board[0] else "rolled",
                      "position": index + 1, "file_line": number, "referent": text})

    print(f"seed key {key}  (brief {args.brief}, round {args.round}, seed {args.seed})")
    print(f"{count} referents; the lead is drawn from positions {args.skip + 1}-{count}\n")
    for s in slots:
        print(f"  {s['slot']}  {s['role']:<6}  #{s['position']}  {s['referent']}")
    summary = " ".join(f"{s['slot']}=#{s['position']}" for s in slots)
    print(f"\ndecisions.md Seed column: seed.py {key} r{args.round} s{args.seed}: {summary}")
    print(json.dumps({"key": key, "brief": str(args.brief), "round": args.round, "seed": args.seed,
                      "pick": args.pick, "skip": args.skip, "count": count, "board": slots},
                     ensure_ascii=False))


if __name__ == "__main__":
    main()
