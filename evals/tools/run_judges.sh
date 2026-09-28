#!/usr/bin/env bash
# Judge runner: one fresh headless session per judge prompt (judging.md section 5), each able to read only its
# own packet folder.
#
#   evals/tools/run_judges.sh <judge_dir> [parallel=6]
#
# <judge_dir> holds one folder per judged set (e.g. 01-ops-console-zh.s1/) with the packet (brief.md, facts.md,
# A/ B/ [C/] [before.png]) and one prompt file per judge: J1.prompt.txt, J2.prompt.txt, J3.prompt.txt. Each reply is
# written next to its prompt as J<n>.reply.txt (verbatim) and J<n>.json (the JSON object extracted from it).
# Existing replies are kept, so the script can be re-run after a failure. Model: $EVAL_MODEL.
set -euo pipefail
MODEL=${EVAL_MODEL:-claude-opus-5-5}
dir=${1:?usage: run_judges.sh <judge_dir> [parallel]}; par=${2:-6}

judge() {  # judge <prompt file>
  local p=$1 d; d=$(dirname "$p")
  local n; n=$(basename "$p" .prompt.txt)
  [ -s "$d/$n.json" ] && return 0
  (cd "$d" && timeout 1200 claude -p --safe-mode --model "$MODEL" --tools Read --add-dir "$d" < "$p" > "$d/$n.reply.txt" 2> "$d/$n.stderr.txt") || true
  python3 - "$d/$n.reply.txt" "$d/$n.json" <<'PY'
import json, re, sys
text = open(sys.argv[1]).read()
start = text.find('{')
for end in range(len(text), start, -1):          # the longest parseable {...} span wins
    if start < 0: break
    if text[end - 1] != '}': continue
    try:
        obj = json.loads(text[start:end]); json.dump(obj, open(sys.argv[2], 'w'), ensure_ascii=False, indent=1); break
    except json.JSONDecodeError:
        continue
else:
    print('no JSON in', sys.argv[1])
PY
  echo "judged $d $n"
}
export -f judge; export MODEL
find "$dir" -name 'J*.prompt.txt' | sort | xargs -P "$par" -I{} bash -c 'judge "$1"' _ {}
missing=$(find "$dir" -name 'J*.prompt.txt' | while read -r p; do [ -s "${p%.prompt.txt}.json" ] || echo "$p"; done)
[ -z "$missing" ] && echo "all judges replied" || { echo "missing replies:"; echo "$missing"; exit 1; }
