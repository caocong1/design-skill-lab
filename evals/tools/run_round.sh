#!/usr/bin/env bash
# Output-eval round runner: the headless path of evals/README.md ("Running a round", steps 0-2).
#
#   evals/tools/run_round.sh prepare <eval_tmp> <arm>=<commit|none> [<arm>=<commit|none> ...]
#   evals/tools/run_round.sh run <eval_tmp> [parallel=6]
#
# <eval_tmp> must be outside the repository. An arm named e.g. suite-0.8.1-s2 = <commit> gets the skills/ of
# that commit (iterate-design-lab excluded); <arm>=none is a no-skill arm. Arm names may carry a sample suffix
# (-s1, -s2 ...) so one suite can be sampled several times. Every run is a fresh `claude -p --safe-mode`
# process (CLAUDE.md, user skills, plugins and MCP disabled), 65-minute hard stop, model $EVAL_MODEL.
# Results per run: <eval_tmp>/work/<brief>/<arm>/out/, <arm>.transcript.jsonl, <arm>.run.json.
# Collect, render, measure and judge afterwards per evals/README.md steps 3-6 and judging.md.
set -euo pipefail
REPO=$(cd "$(dirname "$0")/../.." && pwd)
MODEL=${EVAL_MODEL:-claude-opus-5-5}
BRIEFS=$(cd "$REPO/evals/briefs" && ls ./*.md | sed 's|^\./||; s|\.md$||')

prepare() {
  local tmp=$1; shift
  case $tmp in "$REPO"*) echo "eval_tmp must be outside the repo"; exit 2 ;; esac
  mkdir -p "$tmp/work" "$tmp/suites"
  : > "$tmp/arms.txt"
  for spec in "$@"; do
    local arm=${spec%%=*} commit=${spec#*=}
    if [ "$commit" != none ]; then
      mkdir -p "$tmp/suites/$commit"
      [ -d "$tmp/suites/$commit/skills" ] || git -C "$REPO" archive "$commit" skills | tar -x -C "$tmp/suites/$commit" --exclude 'skills/iterate-design-lab'
    fi
    echo "$arm $commit" >> "$tmp/arms.txt"
  done
  local pw; pw=$(node -e "console.log(require('$REPO/package.json').devDependencies.playwright)")
  (cd "$tmp" && [ -d node_modules/playwright ] || { npm init -y >/dev/null && npm install --no-audit --no-fund "playwright@$pw" >/dev/null; })
  for b in $BRIEFS; do while read -r arm commit; do
    local w="$tmp/work/$b/$arm"; mkdir -p "$w/out"
    sed '/^<!-- JUDGE NOTES BELOW/,$d' "$REPO/evals/briefs/$b.md" > "$w/BRIEF.md"
    if grep -q 'JUDGE NOTES' "$w/BRIEF.md"; then echo "judge notes leaked into $b"; exit 1; fi
    for a in "$REPO/evals/briefs/assets/${b%%-*}"-*; do   # brief assets live in assets/<NN>-*
      [ -d "$a" ] && mkdir -p "$w/legacy" && cp "$a"/* "$w/legacy/"
    done
  done < "$tmp/arms.txt"; done
  echo "prepared $(wc -l < "$tmp/arms.txt" | tr -d ' ') arms x $(echo "$BRIEFS" | wc -w | tr -d ' ') briefs in $tmp (playwright $pw)"
}

one() {  # one <eval_tmp> <brief> <arm> <commit|none>
  local tmp=$1 b=$2 arm=$3 commit=$4
  local w="$tmp/work/$b/$arm" skills="" first=""
  [ "$commit" != none ] && skills="$tmp/suites/$commit/skills"
  [ -n "$skills" ] && first="Design skills are installed for this task at $skills; follow them, starting from the SKILL.md whose description fits the task. "
  local prompt="${first}Your working directory is $w. Read $w/BRIEF.md and deliver what it asks. Work only inside $w${skills:+ and $skills}. Nobody will answer questions during this run: where you would ask, decide, and write the assumption in $w/out/NOTES.md. You have 60 minutes."
  local start end code
  start=$(date +%s)
  set +e
  (cd "$w" && timeout 3900 claude -p --safe-mode --model "$MODEL" --permission-mode bypassPermissions \
      ${skills:+--add-dir "$skills"} --output-format stream-json --verbose "$prompt" \
      > "$w/../$arm.transcript.jsonl" 2> "$w/../$arm.stderr.txt")
  code=$?
  set -e
  end=$(date +%s)
  local ended=error; [ $code = 0 ] && ended=completed; [ $code = 124 ] && ended=timeout
  printf '{"brief":"%s","arm":"%s","skills_commit":"%s","model":"%s","start":%s,"end":%s,"wall_seconds":%s,"exit_code":%s,"ended":"%s"}\n' \
    "$b" "$arm" "$commit" "$MODEL" "$start" "$end" "$((end - start))" "$code" "$ended" > "$w/../$arm.run.json"
  echo "done $b $arm exit=$code $((end - start))s"
}
export -f one; export MODEL

run() {
  local tmp=$1 p=${2:-6}
  for b in $BRIEFS; do while read -r arm commit; do
    [ -f "$tmp/work/$b/$arm.run.json" ] || echo "$tmp $b $arm $commit"
  done < "$tmp/arms.txt"; done | $(command -v caffeinate >/dev/null && echo 'caffeinate -i') \
    xargs -P "$p" -L 1 bash -c 'one "$0" "$1" "$2" "$3"'   # caffeinate: a sleeping Mac drops the API connection
}

case ${1:-} in
  prepare) shift; prepare "$@" ;;
  run) shift; run "$@" ;;
  *) sed -n '2,12p' "$0"; exit 2 ;;
esac
