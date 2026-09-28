# 研究待办

未决的研究问题、复核政策和触发条件。每篇主题各自的未决问题写在该主题的"未决问题"一节，这里只给入口，不重复内容。做完一项，在 [log.md](log.md) 记一笔，再把这里的条目删掉或改掉。

## 1. 复核政策（每份来源、每个 reference）

- **易腐（perishable）：+90 天。** 平台规范、工具与 CLI 版本、同类 skill、法规生效状态、浏览器支持状态、"生成感"特征清单。
- **耐久（durable）：+365 天。** 标准条文（WCAG 2.2 的成功准则、clreq、jlreq）、成熟的方法论（OOUX、change aversion）、不随版本变的经验规则（Hobday、Butterick、Radix 色阶角色）。
- 一份来源里既有耐久内容又有易腐内容时，按易腐算，或者在头部括号里写明哪部分易腐（例如 `dtcg-2025-10`、`fluent-2`）。
- **落在哪里：**
  - `research/sources/<id>.md` 的头部 `review_by`；
  - skill reference 的 frontmatter `reviewed` / `review_by`。
  - `scripts/build-research-index.py` 在 [INDEX.md](INDEX.md) 里把逾期的来源标成"逾期"。过了期限，`--check` 就会失败，直到重新复核并重建索引。reference 的逾期由闸门检查（见仓库的 lab invariants）。
- **复核怎么做：** 重新抓取原文，更新 `fetched` 与 `review_by`；在 Key facts 里改掉变了的数字，并写一行"相对上一版的更正"；在 What it changes for the skills 里列出受影响的文件；在 log.md 记一笔。没抓到原文就不改结论（见 [README.md](README.md) 的诚实规则）。

## 2. 触发条件

### 日历触发

| 时间 | 事件 | 要复核的来源 |
| --- | --- | --- |
| 每年 5 月 | Google I/O | `material-3-expressive`、`material-motion-tokens`、`a2ui` |
| 每年 6 月 | WWDC | `apple-hig-liquid-glass`、`apple-hig-bars`、`apple-app-icons` |
| 每年 6 月 | HDC（华为开发者大会） | `harmonyos-design` |
| 随时 | W3C 发布：WCAG 3 工作草案（下一版计划在 2026-12）、clreq / jlreq 修订、DTCG 社区组报告 | `wcag-22`、`accessibility-law`、`clreq-chinese-text-layout`、`jlreq`、`dtcg-2025-10` |
| 每次发版 | web-features 数据集 | `web-baseline-2026`（`light-dark()` 预计 2026-11-13 转为广泛可用） |
| 2026-11-01 | GB/T 47523-2026《移动互联网应用程序适老化技术规范》生效；正文尚未读到 | `accessibility-law` |
| 2026-12-02 | 欧盟 AI 法案第 50(2) 条过渡期结束 | `ai-labelling-law` |
| 待定 | EN 301 549 V4.1.1 在欧盟官方公报（OJEU）上引用；美国司法部发布 ADA Title II 新规提案；GB/T 37668 修订版发布 | `accessibility-law` |
| 2027-04-26 | 美国 ADA Title II 第一批合规期限（人口 ≥ 5 万的地方政府） | `accessibility-law` |

### 事件触发（沿用 SEED-001，任一满足即执行）

- 距上一次全量验链超过一个季度：跑 `scripts/check-links.py`，新观测写入 `catalog/observed.jsonl`。
- 主流平台发布新的设计语言或大版本（iOS / Android / HarmonyOS / Windows）。
- 模型换代：重看同类 skill 与"生成感"特征清单（`impeccable`、`taste-skill`、`anthropic-design-skills`），并重跑评测。
- DTCG 或 DESIGN.md 发布新版本（`dtcg-2025-10`、`design-md-spec`）。
- 用户反馈某个目录条目失效，或许可证有变化。
- 一个宿主项目的复盘推翻了某个 reference 里的说法：先在 `research/field/` 记下来，再改 reference。

## 3. 旧种子的去向

### SEED-001 新鲜度审查与证据补齐（2026-09-21 种下）

| 原步骤 | 0.8.0 状态 |
| --- | --- |
| 1. 全量验链，处理失效、重定向、不可达 | 机制已换：`check-links.py` 只写 `catalog/observed.jsonl`，不再提交 Markdown 报告。新一轮全量探测由目录流执行；目前的观测仍是 2026-09-21 迁入的数据 |
| 2. 复核易腐登记表里的每个文件 | 机制已换：易腐登记表由每个 reference 的 `review_by` 和每份来源的 `review_by` 取代，逾期由脚本判断 |
| 3. 补齐平台证据（Apple HIG、Material 3、HarmonyOS） | **0.8.0 已执行**：`apple-hig-liquid-glass`、`apple-hig-bars`、`apple-app-icons`、`material-3-expressive`、`harmonyos-design`、`fluent-2`；平台参考由技能流按这些来源重写 |
| 4. 建立最小验证集（固定 brief，用与不用套件，新上下文按评分表打分） | **0.8.0 已执行设计**：`evals/` 有 6 个固定 brief、触发评测集和盲评规则。**还没跑第一轮**，结果写到 `research/field/evals-<date>.md` |
| 5. 把结论写进旧索引的新鲜度审查一节 | 机制已换：写入 log.md，逐来源状态看 INDEX.md |

### SEED-002 确定性设计检测脚本（design lint，2026-09-21 种下）

| 原想法 | 0.8.0 状态 |
| --- | --- |
| 清点不同的颜色、字号、字重、间距、圆角、阴影、z-index、时长，聚类近似重复值 | **已执行**：`skills/design-studio/scripts/lint.mjs` 的 inventory、`token-drift`、`vocabulary` |
| 文字/背景对比度 | **已执行**：按渲染结果计算，并采样文字下方的背景 |
| `transition: all`、对布局属性做动画、缺少减弱动效分支 | **已执行**（警告级） |
| 移动端输入框字号小于 16 px、缺 `alt` 或名称的图片和纯图标按钮 | **已执行**（`input-zoom`、`img-alt`、`unnamed-control`） |
| 图标集 SVG 一致性（`viewBox`、描边宽度、端点、残留的 `fill` 与 `transform`） | **未做** |
| 先评估直接用 `npx impeccable detect` | 研究已做（`impeccable` 摘要第 25–30 条）：自建只做确定性判定的 `lint.mjs`，规则阈值借自它的检测器；不把它作为依赖（它依赖专有引擎二进制，见主题 02） |
| 触发条件："审计模式用过两次且人工清点成为瓶颈" | 作废：套件没有使用遥测，这个条件永远不会自己满足。改由评测和宿主复盘驱动 |

另外，宿主复盘里还有一项待办：**把写死颜色归入色系的辅助工具**（收集颜色字面量和工具类，转成 OKLCH 聚类，用随明度变化的色度阈值判断是不是中性色；那次事故就是把很浅的带色背景误判成了灰）。它适合做成 `lint.mjs` 的一个子命令，或者 `color_tools.py` 的一个模式。

## 4. 待补的一手来源（建议 id）

按优先级排列。写摘要前先确认能抓到原文。

1. `apple-hig-generative-ai`：Apple HIG 的 Generative AI 页（AI 体验、输出侧规则）。
2. ~~`nng-heuristics`~~：2026-09-28 已完成（见 log）。仍缺 NN/g 付费报告与键盘快捷键专题。
3. 嵌入宿主窗格：Office 加载项设计指南（learn.microsoft.com）、Chrome 侧边栏、VS Code UX 指南（webview 与面板）。`embedded-hosts` 目前只有一次宿主会话的经验。
4. 长时 agent 与 AI 交互：Google PAIR Guidebook、Microsoft HAX Toolkit、Ant Design X、Carbon for AI、Vercel AI Elements。
5. `apple-swiftui-spring`（也可以并入 `apple-hig-liquid-glass`）：Apple 的弹簧参数和"Designing Fluid Interfaces"。另外还缺 HarmonyOS 的动效曲线页。
6. 色彩：Evil Martians 的 OKLCH 文章（09-21 已抓到，一直没写摘要）、Stripe《Designing accessible color systems》。
7. 中文排版：clreq 的版心、行距章节；Ant Design / TDesign 的字阶与间距。中文正文的数值目前仍是业内共识，没有一手依据。
8. 图标：Android 自适应图标安全区、PWA maskable、favicon 最小集合。
9. 托管设计系统的存储格式：Claude Design、v0、Lovable、Figma Make 是否读 DESIGN.md，以及怎么读。
10. 数据可视化：FT Visual Vocabulary、Datawrapper Academy、AntV 设计原则、Chartability。`data-dense-ui` 目前基本是经验。
11. Refactoring UI 公开文章（Rauno Freiberg 一篇 2026-09-28 已完成：`rauno-interaction-details`）。
12. 参考库 MCP：Mobbin MCP、Refero MCP。目前只核实到搜索结果层面。
13. 交互补缺（0.9.0 登记）：触屏 KLM 扩展；子菜单斜向容差（Amazon menu-aim 一类）与拖拽键盘拾取的一手来源；原生平台的输入法组字模型（UIKit `markedTextRange`、Android `InputConnection`、HarmonyOS、小程序 `input`）；APG 的列表框、网格、标签页、树等模式页。

## 5. 未决的研究问题

- **套件到底有没有让设计变好？** 要等评测第一轮，而且输了也要写出来。按主题 09 的可证伪条件 F1–F9 逐条判定。
- **0.7.0 / 0.8.0 的重设计原则在真实项目里是否成立**：从功能地图出发的结构性方向，加上变更成本反向规则。评测 brief 06 只是替身，需要一次真实的宿主重设计。
- **反馈改动的效果**：`field/2026-09-host-retros.md` 里只有两条"已观察生效"，而且各只有一次观察。下一个宿主项目要回填验证状态。
- **同一模型家族的新鲜评审能有多独立**，没测过（主题 09）。
- **各模型家族"已经用掉"的字体与配色**，应该由多样本评测测出来，而不是手写清单（主题 02、05）。
- **中国大陆可用性**：只有一个探测位置。要不要从境外 CI 再探测一次，用两边的差异表示可用性（主题 01）。
- **S 档理由**：S 档判断没有写理由，要不要加 `why` 字段；"通过 MCP 可达"要不要成为 `agent_access` 的一个值（主题 01）。
- 各主题的其余未决问题：
  - [01 资源版图](topics/01-resource-landscape.md) · [02 AI 设计 skill 生态](topics/02-ai-design-skill-ecosystem.md) · [03 界面工艺与 Web 平台](topics/03-interface-craft-and-web-platform.md)
  - [04 动效](topics/04-motion.md) · [05 视觉基础](topics/05-visual-fundamentals.md) · [06 设计系统与 token](topics/06-design-systems-and-tokens.md)
  - [07 平台与中文排版](topics/07-platforms-and-cjk.md) · [08 AI 产品体验](topics/08-ai-experience.md) · [09 方法论](topics/09-method.md)

## 6. 工具与流程

- **`fetch-source` 工具**：按站点写适配器（HIG JSON、华为文档 API、无头 Chromium、GitHub raw、W3C TR），保存快照哈希，用来发现原文漂移。现在每次都是手工抓。
- **同类 skill 的固定克隆**：约定见 [README.md](README.md) 的 `raw/repos`。0.8.0 的同类摘要都固定到了提交，但克隆本身没有保留在本地。
- **2026-09-20 的候选域名清单**：保存在 git 历史里（`git show f5c0421:raw/research/2026-09-20-candidate-hosts.txt`），可以作为目录复查的候选来源。目录流 2026-09-27 已另外核验了一批候选条目。
