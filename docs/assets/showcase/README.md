# showcase：站点上的真实产物与评测结果

这一轮起分成两处，各管一件事：

- **带日期的产物**（brief、方案板、决定、评审报告、交接包）直接写在页面的 HTML 里：首页「校样」栏（`docs/index.html`）和 `/skills/` 的「真实产物」行（`docs/skills/index.html`），英文在各页脚本的字符串表里。文件本身放在本目录下按日期分的文件夹（例如 `2026-09-27-site/`），页面用相对链接指过去，GitHub Pages 原样提供。没有的产物就不留位置，不写“待补”。
- **评测分数板**由 `showcase.json` 的 `runs` 提供，`/skills/` 读它；没有或为空时，页面只显示 `docs/skills/index.html` 里写死的状态行（`ev_state`，发布一轮时同步改它）。触发评测（代理）的结果放在 `triggers`，页面在分数板下面单独列一张小表。

规矩只有三条：

1. **只放真实产物**，每条都标日期。示意图、占位图、没跑过的评测，一律不进来。
2. **输了也写**。评测结果照 `evals/runs/<date>/results.json` 原样搬，胜负、空组、没有明确胜者都保留；发布一轮时，也在首页「校样」栏加一条指向 `report.md` 的产物。
3. **路径**：`showcase.json` 里不带协议的路径都相对于 `docs/`（例如 `assets/showcase/…`），页面会自己补 `../`。

## 顶层

```json
{ "updated": "2026-09-27", "note": "…", "runs": [ … ], "triggers": [ … ] }
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `updated` | 是 | 最后一次改这个文件的日期 |
| `note` | 否 | 给维护者看的备注，页面不显示 |
| `runs` | 否 | 评测分数板，一行 = 一轮里的一个 brief；没有或为空数组时，`/skills/` 只显示状态行 |
| `triggers` | 否 | 触发评测（代理），一行 = 一轮里的一个套件版本；见下文 `triggers[]` |

## `runs[]`：评测分数板

一行对应一轮评测（`date`）里的一个 brief。页面按 `date` 分组，最新一轮展开，更早的折叠；所有汇总（每组胜了几个 brief、各维度平均分、没有明确胜者的个数）都由页面从这些行算出来，这里不写汇总数。

```json
{
  "date": "2026-10-01",
  "brief": "01-ops-console-zh",
  "title_zh": "设备运维工单",
  "title_en": "Ops tickets console",
  "arms": {
    "no-skill":    { "status": "ok",    "means": { "fit": 3.0, "hierarchy": 3.0, "identity": 2.3, "craft": 3.0, "typography": 3.0, "platform_a11y": 3.3, "overall": 2.9 } },
    "suite-0.7.0": { "status": "ok",    "means": { "fit": 3.3, "hierarchy": 3.7, "identity": 3.0, "craft": 3.3, "typography": 3.0, "platform_a11y": 3.7, "overall": 3.3 } },
    "suite-0.8.0": { "status": "empty", "means": { "fit": 0, "hierarchy": 0, "identity": 0, "craft": 0, "typography": 0, "platform_a11y": 0, "overall": 0 } }
  },
  "winner": "suite-0.7.0",
  "winner_reason": "condorcet",
  "shots": {
    "no-skill":    { "src": "assets/showcase/2026-10-01-evals/01-ops-console-zh/no-skill.webp", "w": 960, "h": 600, "alt_zh": "…", "alt_en": "…" },
    "suite-0.7.0": { "src": "…", "w": 960, "h": 600, "alt_zh": "…", "alt_en": "…" },
    "suite-0.8.0": { "src": "…", "w": 960, "h": 600, "alt_zh": "…", "alt_en": "…" }
  },
  "report": "https://github.com/caocong1/design-skill-lab/blob/main/evals/runs/2026-10-01/report.md",
  "note_zh": "0.8.0 这一组超时，按规则记 0 分。",
  "note_en": "The 0.8.0 arm timed out and scores 0 by rule."
}
```

（上面的数字只是示意格式，不是结果。）

| 字段 | 必填 | 说明 |
|---|---|---|
| `date` | 是 | 这一轮的日期，即 `results.json` 的 `round.date` |
| `brief` | 是 | brief id，和 `evals/briefs/<brief>.md` 同名；页面用它链到 brief 原文 |
| `title_zh` / `title_en` | 否 | 分数板上显示的短标题；没有就显示 `brief` |
| `arms` | 是 | 键是对照组 id：`no-skill`、`suite-0.7.0`、`suite-0.8.0`（与 `evals/results.schema.json` 的 `armId` 一致；出现别的 id 也会显示，排在后面）。值取 `results.json` 里该 brief 该组的 `status` 和 `means` |
| `arms.<id>.status` | 否 | `ok` · `partial` · `empty`；`empty` 在分数板上显示为“空” |
| `arms.<id>.means` | 是 | `fit` `hierarchy` `identity` `craft` `typography` `platform_a11y` `overall`，1–5 的平均分；空组按评测规则是 0，照写 |
| `winner` | 是 | 胜出组 id，没有明确胜者时为 `null` |
| `winner_reason` | 否 | `condorcet` · `cycle` · `ties` · `all-empty`；`winner` 为 `null` 时页面显示原因 |
| `shots` | 否 | 每组的首屏截图（统一渲染的 PNG 转 WebP，每张不超过 150 KB，放在本目录的 `<date>-evals/<brief>/<arm>.webp`），`{src, w, h, alt_zh, alt_en}`；`w`、`h` 是 WebP 的实际像素 |
| `report` | 否 | 这一轮的 `report.md`；同一轮各行写同一个链接即可 |
| `note_zh` / `note_en` | 否 | 这个 brief 的备注：重跑、超时、身份泄露等 |

### 从 `results.json` 生成

`results.json` 的 `briefs[]` 每一项生成一行：`date` ← `round.date`，`brief` ← `brief`，`arms.<id>` ← `arms.<id>` 的 `status` 与 `means`，`winner` 与 `winner_reason` 原样照抄。只搬这些字段，不重新计算、不挑选，也不删掉输掉的 brief。

## `triggers[]`：触发评测（代理）

2026-09-27 起新增的可选字段。一行对应一轮里一个套件版本的触发评测结果，数字照 `evals/runs/<date>/triggers-<suite>.md` 的“角色视图”一节原样搬。页面只显示最新一轮，并固定附一句代理方法的说明（只看描述、强制选择，会高估触发率；描述写在题目之后的版本只能当上限）。

```json
{ "date": "2026-09-27", "suite": "0.8.0", "method": "proxy", "accuracy": 1.0, "majority_accuracy": 1.0,
  "rows": 99, "samples": 297, "misrouted": [], "report": "https://github.com/caocong1/design-skill-lab/blob/main/evals/runs/2026-09-27/triggers-0.8.0.md" }
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `date` | 是 | 这一轮的日期 |
| `suite` | 是 | 套件版本，例如 `0.8.0`；页面显示为“套件 0.8.0” |
| `method` | 否 | 目前只有 `proxy`（`evals/run_triggers.md`） |
| `accuracy` | 否 | 角色视图、全部样本的准确率，0–1 |
| `majority_accuracy` | 否 | 按行多数票的准确率，0–1 |
| `rows` / `samples` | 否 | 计分的行数和样本数（不含只报告、不计分的歧义行） |
| `misrouted` | 否 | 报告里“Misrouted rows”一节列出的行 id（任一轮答错即列入），没有则为空数组 |
| `report` | 否 | 这一轮该版本的 `triggers-<suite>.md` |

