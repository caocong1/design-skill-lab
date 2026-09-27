# research：证据层

这里存放套件的依据：读过哪些一手资料、从中得出了什么结论、真实运行里看到了什么、还有哪些不知道。skill 里的规范性数字和规则都要能追到这里的某份来源；追不到的，在 reference 的 frontmatter 里标成 `practice`（业内共识）或 `measured`（本仓库实测）。

0.8.0 起，这个目录取代了原来的四样东西：中文分析目录（12 篇分析和来源索引）、原始摘要目录、调研草稿目录，以及 design-studio 里按文件划分证据等级的 source-map。这些旧文件仍在 git 历史里，最后一个包含它们的提交是 `f5c0421`。topics 里提到的"旧分析 NN"指的就是那里的第 NN 篇。

## 目录

| 路径 | 是什么 | 语言 | 谁来写 |
| --- | --- | --- | --- |
| `sources/<id>.md` | 一份一手来源一个文件：带固定头部的转述式摘要 | 英文，可加一段中文导语 | 手写 |
| `topics/NN-<slug>.md` | 9 篇主题综合：当前结论（带来源 id 与日期）· 论证 · 未决问题 · 对 skill 的约束 · 变更记录 | 中文 | 手写 |
| `field/` | 现场证据：实验室自己的实战、宿主项目复盘、评测报告（`evals-<date>.md`） | 中文或英文 | 手写 |
| [log.md](log.md) | 按日期的研究日志：抓了什么、发现了什么、改了什么；只追加 | 中文 | 手写 |
| [backlog.md](backlog.md) | 待办：复核政策、日历与事件触发、待补来源、未决问题 | 中文 | 手写 |
| [INDEX.md](INDEX.md) | 全部来源一览：抓取日期、方法、复核期限（逾期会标出）、取代关系、被哪些 skill 文件引用 | 中文 | **生成**，勿手改 |

阅读顺序建议：先看 `topics/` 里和手头问题相关的那篇，要核对数字时再去 `sources/`，想知道套件在真实任务里表现如何就看 `field/`。

## 怎么加一份来源

1. **定 id。** 小写 kebab-case，简短，一旦被引用就不再改名。新版本整体取代旧版本时，另起一个新 id，并在旧文件头部加 `superseded_by`。已经有人用的 id 可以查 [INDEX.md](INDEX.md)。
2. **抓原文。** 能用静态抓取就用静态抓取。JS 站点用真实浏览器（Playwright，`channel: 'chrome'`）。有结构化接口的优先用接口：Apple HIG 的 DocC JSON（`https://developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json`）、华为设计指南的文档 API（每篇带 `updatedDate`）、W3C TR 页面、GitHub raw。代码仓库固定到某个提交再读。
3. **写 `sources/<id>.md`**，开头必须是这个头部（脚本会校验）：

   ```
   # <标题>
   - id: <id> · url: <主 URL> · fetched: YYYY-MM-DD · method: fetch|browser|json-api|repo@<sha>
   - review_by: YYYY-MM-DD (可选说明) · licence note: paraphrased digest, not a mirror (许可补充)
   - superseded_by: <id> (可选说明)        ← 仅在被取代时
   ```

   - 字段之间用 `·` 分隔。
   - `method` 可以用 ` + ` 组合多种方式，例如 `json-api + fetch`；`repo@` 后面写 7–40 位的提交哈希。
   - `review_by` 必须晚于 `fetched`，且不超过 366 天。易腐来源取 +90 天，耐久来源取 +365 天（见 [backlog.md](backlog.md) §1）。
   - `url` 只写一个主地址，其余读过的页面写在正文开头。

   正文依次是：
   - 可选的 `> 中文导语：` 一段；
   - 一句"读了哪些页面、读到什么深度"（只读了索引页就写明只读了索引页）；
   - `## Key facts`：编号列出，每条给出确切的数字或规则，并注明出处片段（页面小节名或 URL 片段）；
   - `## What it changes for the skills`：受影响的 skill 文件清单，每个文件一句话；
   - `## Not verified / open`：没核实的、自相矛盾的，以及"相对上一版的更正"。
4. **重建索引**：`python3 scripts/build-research-index.py`，然后在 [log.md](log.md) 记一笔。

## skill 怎么引用来源

skill 的 reference 文件在 frontmatter 里声明依据，闸门会检查：

```
---
title: iOS / iPadOS / macOS (Liquid Glass)
evidence: digest | practice | measured
sources: [apple-hig-liquid-glass, apple-hig-bars]
reviewed: 2026-09-27
review_by: 2026-12-27
---
```

- `evidence: digest` 表示规则背后有 `research/sources/` 里的摘要；`practice` 表示业内共识，`sources` 可以为空；`measured` 表示本仓库实测过（证据在 `field/` 或 `casebook.md`）。
- `sources` 里的每个 id 都必须对应 `research/sources/<id>.md`。引用未知 id 时，`build-research-index.py --check` 会失败。
- `topics/` 在正文里直接写来源 id（例如"依据：wcag-22"），不另建引用格式。
- 规则只在一个文件里写一次。topics 引用 id，不照抄 sources 里的数字表；skill 引用 id，不照抄 topics 里的论证。

## INDEX.md 怎么生成

```bash
python3 scripts/build-research-index.py                  # 校验，然后写 research/INDEX.md
python3 scripts/build-research-index.py --check          # 头部不合格、引用了未知 id、INDEX.md 过期时退出 1
python3 scripts/build-research-index.py --check --warn-unknown   # 未知 id 只报警告（skill 正在改写时用）
```

- 脚本只用 Python 标准库。它解析每个 `sources/*.md` 的头部（id、标题、url、fetched、method、review_by、superseded_by），再扫描 `skills/**/*.md` frontmatter 里的 `sources:`（行内列表或 YAML 块列表都可以），算出每份来源被哪些文件引用。
- 表格按 id 排序。`review_by` 早于运行当天的来源标"逾期"。所以某个复核期限一过，`--check` 就会报 INDEX.md 过期，直到重新复核并重建。这是有意的：逾期必须有人处理。

## 诚实规则

1. **只摘要真正读到的内容。** 读了几页就写几页，读到什么深度就写什么深度。没抓到的来源不写摘要，也不凭记忆补写，只在 backlog 里登记。二手转述（新闻稿、第三方总结）要标明是二手，不能当作一手事实。
2. **不可达不等于已死。** 抓取失败首先是网络路径的问题（2026-09-21 的第二次验链里，不可达从 19 个跳到 48 个）。要用网络搜索或另一个网络位置确认。抓取失败也不算一次观测，不能覆盖上一次的有效结果。重定向到别的主机，是并购或改名的信号，要人工看一眼。
3. **转述，不做镜像。** 摘要是学习笔记，用自己的话写。原文最多引一个短语。数字、阈值、规则名称作为数据记录。不复制整段文字、整张表或图片。
4. **CC BY-NC-SA 来源。** 源站采用 CC BY-NC-SA 时（例如 `shape-of-ai`），摘要按同一许可提供，不受本仓库 MIT 许可约束，并在头部的 licence note 里写明。仓库根目录的 `NOTICE` 说明了这个范围。其他许可（Apache-2.0、MIT、W3C 文档许可、政府公文）也写进 licence note。法规类摘要要注明"不是法律意见"。
5. **一切都带日期。** 每份来源有 `fetched`，每条易腐结论写明截至哪天。更正不能悄悄覆盖旧内容：在摘要的"相对上一版的更正"和 log.md 里写明旧说法错在哪里、为什么错。
6. **现场证据写明样本量。** `field/` 里的结论要写清楚来自几个项目、几次运行，是否是自评。一次观察不能写成规律。

## raw/repos：上游仓库的固定克隆

同类 skill 与规范仓库需要逐行研读时，shallow clone 到 `raw/repos/<slug>/`。这个目录的内容被 git 忽略，仓库只记录**固定的提交**，不保存代码副本。提交写在对应来源的头部：`method: repo@<sha>`，`url` 尽量也指向该提交下的具体文件。需要时重新克隆：

```bash
git clone --depth 1 <upstream-url> raw/repos/<slug>
git -C raw/repos/<slug> rev-parse HEAD      # 把这个哈希写进 sources/<id>.md 头部的 method: repo@<sha>
# 要看历史上的某个提交：
git -C raw/repos/<slug> fetch --depth 1 origin <sha> && git -C raw/repos/<slug> checkout <sha>
```

0.8.0 的同类摘要（`impeccable`、`taste-skill`、`ui-ux-pro-max`、`anthropic-design-skills`、`emil-kowalski-skills`、`design-md-spec` 等）都固定到了提交；`raw/repos/` 里目前没有保留这些克隆。
