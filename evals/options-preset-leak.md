# Focused regression: options must come from the host brief

This probe covers a failure the six main output evals cannot see: an agent returns completed directions
from `docs/lab/` when the user asks for several options. Run it against the whole repository or a real
plugin installation, with `docs/lab/` visible. Do not use `tools/run_round.sh`: its skill-only archive
removes the leak path by construction. This is a targeted options regression, not another arm in the
six-brief scoreboard or `aggregate.py`.

## Fixed host brief

Use an empty host project except for this brief, with no design system or existing screens:

> 中文社区剧场志愿者排班 Web App。兼职志愿者主要用手机查看场次、申请换班；排班协调员在桌面端
> 处理本周六个尚未补齐的引导员班次，必须避免同一人时间冲突。首屏要同时暴露缺人班次、冲突和
> 待确认换班；志愿者不能替别人确认。使用真实感的中文人名、剧场区域、日期和班次，不使用评价、
> 资源目录或设计工具内容。用户请求只有一句："给这个新项目做界面设计，先出 6 套不同方案让我选。"

Do not add "do not copy the lab" to the user request. The skill under test owns that boundary. Where a
question would block an unattended run, record a visible assumption and proceed with the brief above.

## Run

1. Prepare an old arm from the parent revision and a new arm from the revision under test. Keep model,
   host, tools, brief and repository visibility identical. Each arm gets its own empty host directory.
2. Run at least three fresh samples per arm. Each run must follow the installed `design-studio` skill;
   subagents are allowed as the skill directs. Keep all process artefacts, not only final screens.
3. Save `brief.md`, `PRODUCT.md` if made, `referents.txt`, the seed output, `decisions.md`, every
   direction card and frame, the options board, and one PNG per direction at the same content and size.
4. Report the preset-leak rate and host-fit failure rate separately per arm. Do not discard or rerun a
   sample because its result is embarrassing. A passing single sample is a smoke probe, not a leak-rate
   estimate; say which was run.

### Low-cost candidate smoke

For a quick change check, complete `directions.md` sections 0-5, then write the six cards from the
section 6 packet but skip frame drawing, rendering and sections 7-10. Keep the truth files, referents,
roll and cards. Judge only the source, count, brief-anchor and structural-axis items below. Label the
result **candidate-only smoke**: it does not pass the frame, board, PNG or render checks and is not a
completed full regression. Run the full protocol before claiming those parts are fixed.

## Pass / fail

A sample passes only when all of these hold:

- Exactly six new directions are on the board. No canon is added for this greenfield brief. The roll uses
  `--pick 6` after any user-pinned referents are accounted for.
- `referents.txt` was written for this host and contains seven referents across at least three material
  families. Every card traces to this file and the recorded roll, or to an explicit user pin. There is no
  user pin in this scenario.
- Every card has two brief anchors, each tied to a visible decision: an audience/scene fact, plus a job,
  real-content or hard-constraint fact. The six directions differ on the structural axes that matter,
  not only on colour or names.
- All six frames use the theatre's shifts, conflicts and swap approvals. None substitutes Design Skill
  Lab resources, catalogue taxonomy, skill marketing or install content.
- The board and six rendered PNGs were shown and inspected at the declared sizes, and the provenance and
  thumbnail checks passed.

## Deterministic controls

Run these controls with the same review checklist even when no behavioural sample happens to leak:

- **Negative control:** make six cards by copying or lightly paraphrasing the first six `CONTENT.styles`
  entries in `docs/lab/content.js`, including their concept and axes bundles, then give them polished
  theatre-looking frames. It must fail provenance and host fit. Matching only the six names is not the
  detector: compare normalized concept/axis substance and whether the card came from this round's roll.
- **Positive control:** independently derive seven theatre-specific referents, roll six, and write new
  coordinates and frames with brief anchors. A familiar isolated idea (for example a strict grid) is
  allowed when its source, rejected traits and host-specific transformation are recorded. It must not be
  rejected merely for sharing a generic style word with the lab.

- **Pinned-reference control:** repeat the theatre brief, but let the user explicitly name the lab's
  Swiss Grid and pin only its strict-grid move. Mark that referent with `| pinned`, keep seven referents
  in total, and roll `--pick 5`. The final board must contain six different directions with the pin
  exactly once, two brief anchors per card, and a host-specific transformation rather than the Swiss
  name/thesis/axes/layout bundle. The seed report must show five rolled cards plus `PIN`, with no overlap.

The negative control prevents an occasional non-copying old arm from making the regression look fixed.
The positive control prevents the fix from becoming a blacklist of legitimate design vocabulary.
