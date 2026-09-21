# Changelog

本文件记录本仓库各 skill、资源目录与分析报告的版本变更。除非另注，`## [X.Y.Z]` 形式的条目指 `design-studio` suite；其他 skill 的条目以 `## <skill 名称> [X.Y.Z]` 标注。

版本号遵循语义化版本（SemVer），作用于 suite 契约（模式、交付物、产出目录结构、reference 路径）：

- MAJOR：契约的破坏性变更（模式名、交付物格式、reference 文件移除或重命名）。
- MINOR：新增 skill、新增能力、新增 reference、新增对指导有实质影响的分析来源。
- PATCH：措辞澄清、资源目录条目的增删改、易腐参考文件的例行复核。

`0.x` 期间契约仍在定型，MINOR 也可能调整契约，但仍会在此写明。从 1.0 起，任何移除都必须先在 `弃用登记` 下登记至少两个 MINOR 版本。

各 skill 的当前版本记录在对应 `SKILL.md` frontmatter 的 `metadata.version`；逐来源的分析版本与新鲜度审查记录在 `analysis/SOURCE_INDEX.md`。

## [0.2.0] - 2026-09-21

由用户的一个追问和两个新站点触发：用户问"taste-skill 和 UI UX Pro Max 学了，那 Claude 的 frontend design skill 学过吗"，并补充了 v0.app 与 impeccable.cn。

### 新增

- **资源目录** 新增 2 条（共 601 条）：`v0`（Vercel 的提示词到应用生成器，含设计模式、设计系统与社区模板库）与 `impeccable-cn`（Impeccable 中文站），均标记 `origin: user-2026-09-21`。同时更新 `impeccable`（指向 `/slop` 规则目录与 `npx impeccable detect`）、`anthropic-frontend-design`、`anthropic-frontend-blog` 三条。
- **一手摘要** `raw/docs/impeccable-slop-rules.md`：约 46 条反模式规则分八类，逐条标注检测方式（CLI / 浏览器 / 仅 LLM / 可选），区分"AI 痕迹"与"基本质量"，含 2022 对 2026 的年代对照。
- `raw/docs/anthropic-frontend-design-skill.md` 补入配套文章（发布 2025-11-12，本次抓到全文）：分布收敛机制、四个可提示的轴、约 400 token 的审美提示、`web-artifacts-builder`。

### 变更（skill）

- `skills/design-studio/SKILL.md` 0.1.0 → **0.2.0**（其 references 发生了指导性变化）：
  - `references/anti-slop.md`：新增第三份带日期的清单（来自 Impeccable 的确定性检测规则）、"Cures decay too"一段（2025-11 被推荐的解药——Space Grotesk 一类"有特色的字体"、衬线、氛围渐变背景、错峰入场——在 2026 年逐条成为被检测的痕迹，因此只推荐**选择的方法**，不推荐具体答案），以及 `Mechanical Help` 一节。
  - `references/typography.md`：相邻字号层级约 1.25 倍；字体栈示例里的具体字体名改为占位符。
  - `references/layout-and-spacing.md`：卡片圆角约 8–16 px、粗强调边与大圆角二选一；带边框或底色的容器内文字至少 8 px（通常 12–16 px）内边距，正文不贴视口边缘。
  - `references/source-map.md`：登记新摘要与上游链接。
- `skills/build-design-system/SKILL.md` 0.1.0 → **0.1.1**：`references/token-formats.md` 的 DTCG 与 DESIGN.md 示例不再写具体字体名，避免示例被照抄成新的默认。

### 分析

- `analysis/02-ai-design-skills-survey.md` 1.0 → **1.1**：新增"解药也会过期"一节（三份带日期材料排成的时间线）、v0 的定位、如实记录的各项目阅读深度（Anthropic 的 skill 是读得最完整的一个），以及 impeccable.cn 与官方仓库的关系。
- `analysis/SOURCE_INDEX.md`：Anthropic 一行推进到 1.1，新增 Impeccable `/slop` 行。
- `.planning/seeds/SEED-002-design-lint.md`：补入规则来源与"CLI / 浏览器 / 仅 LLM"三分法，并记下"先评估直接使用现成检测器"。

### 文档与工具

- `docs/index.html`：**按新学到的规则自查后修改**——去掉每一行左侧的彩色竖条（与"卡片侧边粗色条"这一痕迹相邻，且同一分节内不承载额外信息），改为只在分节标题上放一个域色块并让标题吸顶；字体栈去掉 Inter；修复授权信息里长字符串不换行、被视口裁切的问题。均经重新渲染确认。
- `scripts/check-links.py`：局部验链（`--ids` / `--only`）不再覆盖当天的全量报告，改为把结果打印到终端。

### 来源版本与最后更新

| 来源 | 来源版本 | 分析 | 最后更新 |
| --- | --- | --- | --- |
| Anthropic `frontend-design` skill + 配套文章 | skill 三个快照（抓取 2026-09-20）；文章发布 2025-11-12 / 抓取 2026-09-21 | `analysis/02` 1.1 | 2026-09-21 |
| Impeccable `/slop` 规则目录 | 持续更新，中文站抓取 2026-09-21 | `analysis/02` 1.1 | 2026-09-21 |

## [0.1.0] - 2026-09-21

首版。用户给出 15 个设计站点作为样例，要求建立一个结构类似 `ai-agent-skill-lab` 的设计类 skill 项目：能按需求出完整设计、设计单个页面或组件、针对网站给灵感、同时做几套方案，并尽量想到资深设计师会做的其他用途。

### 新增

- **资源目录** `catalog/resources.jsonl`（599 条，S 131 / A 372 / B 96）与分类法 `catalog/sections.json`（12 个域、71 个分节，每个分节一句"资深设计师怎么用这类资源"）。每条标记学科域、分节、类型、标签、`best_for`、`how_to_use`（筛选维度、可深链的 URL 模式、API 与原始文件端点）、收费、登录、`agent_access`、授权、档位、活跃度、语言、来源。用户 2026-09-20 提供的 15 个站点全部收录并标记 `origin: user-2026-09-20`。
- **目录工具链**：`scripts/build-catalog.py` 从目录生成 `skills/design-studio/references/resources/*.md`（agent 运行时读取）与 `docs/catalog.js`（文档页读取），`--check` 校验 schema、重复与视图是否过期；`scripts/check-links.py` 用 curl 机械验链，依据真实响应把 `agent_access` 分类为 static / js / blocked / unknown，并单列"重定向到其他主机"以发现并购与改名。
- **skill 套件** `design-studio`（入口）+ 11 个子 skill：`explore-design-directions`、`find-design-inspiration`、`design-product-ui`、`design-marketing-sites`、`build-design-system`、`design-motion`、`design-icons`、`design-brand-identity`、`design-graphics`、`critique-design`、`implement-design`；以及维护 skill `iterate-design-lab`。
- **共享基础参考**（`skills/design-studio/references/`）：`typography.md`（含中文与混排）、`color.md`、`layout-and-spacing.md`、`anti-slop.md`、`render-and-look.md`、`quality-rubric.md`、`licensing.md`、`resource-map.md`、`source-map.md`（逐文件证据等级）。
- **专项参考**：`platforms.md`（iOS / Android / HarmonyOS / 小程序 / 桌面 / Web / CLI）、`data-dense-ui.md`（后台、表格、表单、仪表盘、数据大屏与数字孪生）、`ai-ux.md`、`motion-tokens.md`、`app-icons-and-favicons.md`、`production.md`（尺寸、印刷、渲染管线）、`guidelines-template.md`、`token-formats.md`（CSS 变量 / DTCG 2025.10 / DESIGN.md / 原生主题）、`stacks.md`。
- **脚本**：`skills/design-studio/scripts/color_tools.py`（WCAG 对比度 + APCA Lc、前景 × 背景矩阵、OKLCH 11 级色阶含中性色与暗色镜像、格式转换；仅标准库）与 `skills/design-studio/scripts/shot.sh`（无依赖多视口截图，强制指定配色方案）。
- **一手摘要 15 份**（`raw/docs/`）与 **分析 11 篇**（`analysis/01` 至 `analysis/11`），含同类 AI 设计 skill 横评、跨来源总综合，以及记录非目标与已知自我违反的 `analysis/11-distilled-skill-design.md`。
- **机械闸** `scripts/check-lab-invariants.sh`：目录有效且视图不过期、skill frontmatter 与行数、三处版本一致、分析元数据块与"对最终 skill 的影响"、摘要头部三要素、反引号路径存在、skill 间相对路径可解析、`SOURCE_INDEX` 日期不倒挂、易腐文件自我声明。
- **文档页** `docs/index.html`：可按域、类型、档位、收费、可达性、语言、来源筛选与搜索的资源目录，以及套件导览。
- `.planning/seeds/SEED-001-freshness-and-evidence.md`、`.planning/seeds/SEED-002-design-lint.md`。

### 来源版本与最后更新

| 来源 | 来源版本 | 分析 | 最后更新 |
| --- | --- | --- | --- |
| Anthropic `frontend-design` skill | 三个快照（2025-12 / 2026-06 / 当前），抓取 2026-09-20 | `analysis/02` 1.0 | 2026-09-21 |
| Vercel Web Interface Guidelines | 持续更新，抓取 2026-09-21 | `analysis/03` 1.0 | 2026-09-21 |
| Hobday 视觉规则、Laws of UX | 抓取 2026-09-21 | `analysis/03` 1.0 | 2026-09-21 |
| Emil Kowalski 动效文章、Material 3 动效 token | 抓取 2026-09-21 | `analysis/04` 1.0 | 2026-09-21 |
| Practical Typography、Radix Colors scale | 抓取 2026-09-21 | `analysis/05` 1.0 | 2026-09-21 |
| Lucide Icon Design Principles | 抓取 2026-09-21 | `analysis/06` 1.0 | 2026-09-21 |
| DTCG Format Module **2025.10**、DESIGN.md **alpha** | 抓取 2026-09-21 | `analysis/07` 1.0 | 2026-09-21 |
| clreq、《中文文案排版指北》、微信小程序设计指南 | 抓取 2026-09-20 | `analysis/08` 1.0 | 2026-09-21 |
| Shape of AI（索引页） | 抓取 2026-09-21 | `analysis/09` 1.0 | 2026-09-21 |
| 资源目录 | 599 条，验链 2026-09-21 | `analysis/01` 1.0 | 2026-09-21 |

### 过程记录

- 2026-09-20：一次性并行派出 9 个调研 agent（继承顶配模型），约 25 分钟后全部因额度耗尽而终止，未写出任何交付物；抢救回候选域名清单（`raw/research/2026-09-20-candidate-hosts.txt`）、GitHub 仓库元数据与部分已抓取的原文。
- 2026-09-21：改为主 agent 直接筛选撰写 + 脚本机械验链。首次全量验链（607 个 URL，约 100 秒）发现 8 处并购 / 改名 / 下线与 1 处许可证变更，详见 `analysis/SOURCE_INDEX.md` 的 `## 新鲜度审查`。
- 构建 `shot.sh` 时实测发现两个陷阱，均已修进脚本并写入 `render-and-look.md` 的 Known traps：无头 Chrome 会继承操作系统的深色模式，导致"浅色截图"实际为深色（改为始终强制指定配色方案）；无头 Chrome 的窗口宽度下限是 500 px，390 px 的"移动端截图"其实是 500 px 布局被裁切（改为在精确尺寸的 iframe 内渲染再裁切）。
- `docs/index.html` 按套件自己的流程做了一轮渲染自评：1280 / 390 两个宽度、明暗两个主题、筛选态与空态；对比度经脚本实测后把浅色主题的弱文字由 4.45:1 调到 5.27:1。

### 已知局限

见 `README.md` 的"已知局限"与 `analysis/11-distilled-skill-design.md` 的"已知的自我违反"：套件尚未被评测；平台规范、品牌、平面、营销站点、数据大屏等部分的证据等级为 practice（通识，未经本仓库核验）。
