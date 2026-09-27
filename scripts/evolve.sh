#!/usr/bin/env bash
# Unattended feedback digestion for design-skill-lab, in proposals-only mode.
#
# When feedback/inbox/ holds entries, run an agent with the evolve mode of the repo-local maintainer skill
# (.claude/skills/iterate-design-lab) on a fresh branch evolve/<date>. Unattended runs write proposals
# (feedback/proposals.md) and Tier A wording / dead-path fixes only; Tier B and C changes wait for the owner.
# The script, not the agent, creates the branch and commits, so the agent needs no git write access.
#
# Usage:
#   scripts/evolve.sh              run (launchd: scripts/com.design-skill-lab.evolve.plist)
#   scripts/evolve.sh --dry-run    print what would happen (agent, tree state, inbox, branch, command, prompt)
#                                  and change nothing; DRY_RUN=1 does the same
#
# Env:
#   AGENT_BIN         absolute path of the claude CLI (default: command -v claude, then known install places)
#   MODEL             optional --model for the agent
#   EVOLVE_TIMEOUT    seconds before the agent is killed (default 1800)
#   EVOLVE_BUDGET_USD spend cap passed to the agent (default 5)
#
# Exit: 0 done or nothing to do · 2 no agent found · 3 dirty tree · 4 malformed inbox entries · 5 agent failed
# Log: feedback/evolve.log (the only sink) · last result: feedback/evolve.status (both gitignored)

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
LAB=$PWD
LOG=feedback/evolve.log
STATUS=feedback/evolve.status
DRY=${DRY_RUN:-0}
[ "${1:-}" = "--dry-run" ] && DRY=1
TIMEOUT=${EVOLVE_TIMEOUT:-1800}
BUDGET=${EVOLVE_BUDGET_USD:-5}

# one sink: a real run appends everything (ours and the agent's) to the log; a dry run prints to the terminal
[ "$DRY" = 1 ] || exec >>"$LOG" 2>&1
say() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
finish() {   # finish <exit code> <message>
  say "$2"
  [ "$DRY" = 1 ] || echo "$(date '+%Y-%m-%d %H:%M:%S') exit=$1 $2" >"$STATUS"
  exit "$1"
}

# --- the agent, by absolute path (launchd's PATH does not include fnm, ~/.local/bin and the like)
AGENT=${AGENT_BIN:-}
if [ -z "$AGENT" ]; then
  AGENT=$(command -v claude 2>/dev/null || true)
  for c in "$HOME/.local/share/fnm/aliases/default/bin/claude" "$HOME/.local/bin/claude" \
           "$HOME/.claude/local/claude" /opt/homebrew/bin/claude /usr/local/bin/claude; do
    [ -n "$AGENT" ] && break
    [ -x "$c" ] && AGENT=$c
  done
fi
[ -n "$AGENT" ] && [ -x "$AGENT" ] || finish 2 "no claude CLI found; set AGENT_BIN=/absolute/path/to/claude"
PATH="$(dirname "$AGENT"):$PATH"   # a node-based install finds its node next to it

# --- preconditions
[ "$DRY" = 1 ] && say "DRY RUN: nothing will be written, branched, committed or run"
say "agent: $AGENT"
# a dry run reports each stop condition and carries on, so one call shows the whole plan
stop() { if [ "$DRY" = 1 ]; then say "a real run would stop here (exit $1): $2"; else finish "$@"; fi; }
if [ -n "$(git status --porcelain)" ]; then
  stop 3 "working tree is dirty ($(git status --porcelain | wc -l | tr -d ' ') paths); commit or stash first"
fi
if ! python3 scripts/collect-feedback.py --check; then
  stop 4 "malformed inbox entries (listed above); fix them by hand, then re-run"
fi
count=$(find feedback/inbox -name '*.md' | wc -l | tr -d ' ')
[ "$count" -eq 0 ] && stop 0 "inbox empty; nothing to evolve"

base=$(git rev-parse --abbrev-ref HEAD)
branch="evolve/$(date +%F)"; n=2
while git rev-parse --verify --quiet "refs/heads/$branch" >/dev/null; do branch="evolve/$(date +%F)-$n"; n=$((n + 1)); done

PROMPT="你在 ${LAB}（design-skill-lab 仓库）里无人值守地工作，当前在分支 ${branch} 上。用 .claude/skills/iterate-design-lab/SKILL.md 的 evolve 模式处理 feedback/inbox/ 里的 ${count} 条反馈：
1. 跑 scripts/collect-feedback.py，读 feedback/report.md 和每条原始条目，按根因聚类，按 Tier A/B/C 分级。
2. 这是 proposals-only 运行：只写提案和 Tier A 修正。Tier A（误导的措辞、事实错误、失效路径）可以直接改 skills/ 下的文件；Tier B 和 Tier C 一律不改 skill，写进 feedback/proposals.md（证据条目链接 + 具体方案）。不要升版本号、不要改 CHANGELOG.md，主人合并时再定版本。
3. 在 feedback/log.md 追加一节：日期、处理条数、每簇的分级与处置（已修 / 已提案 / 不修及原因）；宿主只按形态描述，不写产品名。
4. 跑 scripts/collect-feedback.py --archive 归档，再跑 scripts/check-lab-invariants.sh，修掉你的改动引起的失败。
不要执行 git 写操作（脚本会在你结束后提交），不要 push，不要访问网络。最后用三五行中文总结：多少条、哪些 Tier A 已改、哪些进了提案。"

CMD=("$AGENT" -p "$PROMPT"
  --permission-mode dontAsk
  --allowedTools "Read" "Glob" "Grep" "Edit(skills/**)" "Edit(feedback/**)" "Write(feedback/**)"
    "Bash(scripts/collect-feedback.py)" "Bash(scripts/collect-feedback.py *)"
    "Bash(python3 scripts/collect-feedback.py)" "Bash(python3 scripts/collect-feedback.py *)"
    "Bash(scripts/check-lab-invariants.sh)" "Bash(scripts/check-lab-invariants.sh *)"
    "Bash(git status)" "Bash(git status *)" "Bash(git diff)" "Bash(git diff *)" "Bash(git log *)"
  --max-budget-usd "$BUDGET"
  ${MODEL:+--model "$MODEL"})

if [ "$DRY" = 1 ]; then
  say "inbox: $count entr$([ "$count" -eq 1 ] && echo y || echo ies); would branch $base -> $branch"
  say "would run (killed after ${TIMEOUT}s):"; printf '  %q\n' "${CMD[@]}"
  say "then: gates, git add -A, commit 'evolve: proposals from $count feedback entries' on $branch, switch back to $base"
  exit 0
fi

# --- run
git switch -c "$branch" || finish 5 "could not create branch $branch"
say "inbox has $count entries; running the agent on $branch (timeout ${TIMEOUT}s)"
perl -e 'alarm shift; exec @ARGV or die "exec: $!"' "$TIMEOUT" "${CMD[@]}" </dev/null
rc=$?
[ "$rc" -eq 142 ] && say "agent killed after ${TIMEOUT}s"

msg="evolve: proposals from $count feedback entries"
if [ -n "$(git status --porcelain)" ]; then
  if scripts/check-lab-invariants.sh; then gates=pass; else gates=FAIL; msg="$msg (gates failing: review)"; fi
  git add -A && git commit -q -m "$msg" && say "committed on $branch (gates $gates)"
else
  gates=n/a; say "the agent changed nothing"
fi
git switch -q "$base"
[ "$rc" -eq 0 ] || finish 5 "agent exited $rc; partial work (if any) is on $branch"
finish 0 "done: $branch ready for review (gates $gates); merge it yourself, nothing was pushed"
