#!/usr/bin/env bash
# Unattended self-iteration for the design-skill-lab suite.
#
# Aggregates feedback/inbox and, when there is anything to digest, runs an
# agent in this repo with the evolve mode of iterate-design-lab. The mode's
# tiers decide what the agent may apply on its own (Tier A/B) and what is
# queued into feedback/proposals.md (Tier C). See feedback/README.md.
#
# Usage:
#   scripts/evolve.sh            # aggregate; run the agent if the inbox is non-empty
#   DRY_RUN=1 scripts/evolve.sh  # aggregate only, print the prompt, no agent
#
# Env:
#   AGENT_CLI   agent command; default "claude". "codex" also works.
#   MODEL       optional model flag for the agent.
#
# To make every change a proposal (no direct edits), uncomment the
# PROPOSE_ONLY line below.

set -euo pipefail
cd "$(dirname "$0")/.."
LAB=$PWD
LOG=feedback/evolve.log

AGENT_CLI=${AGENT_CLI:-claude}
# PROPOSE_ONLY=1

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG"; }

python3 scripts/collect-feedback.py >>"$LOG" 2>&1
count=$(find feedback/inbox -name '*.md' | wc -l | tr -d ' ')
if [ "$count" -eq 0 ]; then
  log "inbox empty; nothing to evolve."
  exit 0
fi
log "inbox has $count entr$( [ "$count" -eq 1 ] && echo y || echo ies ); starting agent ($AGENT_CLI)."

PROMPT="你在 $LAB（design-skill-lab 仓库）里工作。用 iterate-design-lab skill 的 evolve 模式处理 feedback/inbox/ 里的 ${count} 条反馈：先跑 scripts/collect-feedback.py 刷新报告，按 SKILL.md 里的 Tier A/B/C 分流，Tier A/B 直接改并升版本、写 CHANGELOG、跑 scripts/check-lab-invariants.sh 直到通过；Tier C 只写进 feedback/proposals.md。处置记录追加到 feedback/log.md，然后 scripts/collect-feedback.py --archive 归档。${PROPOSE_ONLY:+本次为 propose-only：所有改动（含 Tier A/B）都只写提案，不改 skill。}在一个新分支上以一次 commit 收尾，不要 push、不要合并。"

if [ "${DRY_RUN:-0}" = 1 ]; then
  log "DRY_RUN; prompt would be:"; echo "$PROMPT"
  exit 0
fi

set +e
case "$AGENT_CLI" in
  claude)
    claude -p "$PROMPT" \
      --permission-mode acceptEdits \
      ${MODEL:+--model "$MODEL"} \
      >>"$LOG" 2>&1
    ;;
  codex)
    codex exec --full-auto ${MODEL:+-m "$MODEL"} "$PROMPT" >>"$LOG" 2>&1
    ;;
  *)
    log "unknown AGENT_CLI=$AGENT_CLI (expected claude or codex)"; exit 2
    ;;
esac
rc=$?
set -e

log "agent run finished with exit $rc."
exit $rc
