# Source Index

更新时间：2026-09-23（首版：16 份一手摘要、11 篇分析、601 条资源目录；2026-09-20 的并行调研在产出交付物之前中断，本轮改为主 agent 筛选 + 脚本机械核验）。

本仓库有两类"来源"，分开登记：

- **深度来源**（文章、规范、标准、开源项目）：有 `raw/docs/` 摘要与 `analysis/` 分析，逐来源维护 `来源版本 / 分析版本 / 最后更新`。再分析某来源的新版本时，同步更新该行、对应分析文件第 3 行的元数据块与 `CHANGELOG.md`。`分析版本` 与 skill 版本相互独立。
- **目录资源**（画廊、档案、工具、素材、组件库等）：不逐个做深度分析，统一登记在 `catalog/resources.jsonl`，由 `scripts/check-links.py` 机械核验存活与 agent 可达性，核验记录见下方 `## 新鲜度审查` 与 `.planning/link-checks/`。

**规范类来源必须有独立的版本行**（姊妹仓库 ai-agent-skill-lab 的教训：没有版本行的规范对漂移检测完全不可见）。

## Articles and Guidelines

| 来源 | 快照路径 | 来源版本 | 分析版本 | 最后更新 | 学习重点 |
| --- | --- | --- | --- | --- | --- |
| Anthropic `frontend-design` skill + 配套文章 | `raw/docs/anthropic-frontend-design-skill.md` | skill：2025-12 / 2026-06 / 当前 三个快照，抓取 2026-09-20；文章：发布 2025-11-12 / 抓取 2026-09-21 | 1.1 | 2026-09-21 | 从主题取材、计划→对照 brief 自查→实现的两遍式流程、"生成感"特征清单及其半年一换、大胆只花一处、文案即设计 ｜ 1.1：分布收敛机制、约 400 token 的审美提示、四个可提示的轴、"解药也会过期" |
| Impeccable `/slop` 规则目录 | `raw/docs/impeccable-slop-rules.md` | 持续更新，中文站抓取 2026-09-21（英文站当日不可达） | 1.1 | 2026-09-21 | 约 46 条规则分八类，逐条标注 CLI / 浏览器 / 仅 LLM / 可选；区分 AI 痕迹与基本质量；2022 对 2026 的年代对照；一批可直接复用的数值阈值 |
| Vercel Web Interface Guidelines | `raw/docs/vercel-web-interface-guidelines.md` | 持续更新文档，抓取 2026-09-21 | 1.0 | 2026-09-21 | 交互、动画、布局、内容、表单、性能、设计七类工艺规则与数值；附 AGENTS.md 与审查 skill |
| Emil Kowalski, Great Animations / 7 Practical Animation Tips | `raw/docs/emil-kowalski-animation.md` | 页面未标日期，抓取 2026-09-21 | 1.0 | 2026-09-21 | < 300 ms、ease-out、按下 0.97、不从 scale(0)、origin-aware、高频与键盘操作不做动画、可打断 |
| Material 3 motion tokens（含 M3 Expressive 弹簧） | `raw/docs/material-motion-tokens.md` | material-components-android `docs/theming/Motion.md`，抓取 2026-09-21 | 1.0 | 2026-09-21 | 缓动与时长刻度、空间/效果两类弹簧 × 三档速度、按覆盖面积选速度 |
| Lucide Icon Design Principles | `raw/docs/lucide-icon-design-principles.md` | 持续更新文档，抓取 2026-09-21 | 1.0 | 2026-09-21 | 24 px 画布、1 px 安全区、2 px 描边、圆角 2/1/2.41、2 px 最小间隙、视觉重量与模糊测试、像素网格 |
| Radix Colors, Understanding the scale | `raw/docs/radix-colors-scale.md` | 持续更新文档，抓取 2026-09-21 | 1.0 | 2026-09-21 | 12 级色阶的角色分工；11–12 级文字对比保证 |
| Butterick, Practical Typography（key rules） | `raw/docs/practical-typography-key-rules.md` | 持续修订的 web book，抓取 2026-09-21 | 1.0 | 2026-09-21 | 字号、行距 120–145%、行长 45–90 字符及排印细节 |
| Anthony Hobday, Visual design rules you can safely follow every time | `raw/docs/hobday-visual-design-rules.md` | 未标日期，抓取 2026-09-21 | 1.0 | 2026-09-21 | 27 条可安全遵守的视觉规则，多条带数值 |
| Laws of UX | `raw/docs/laws-of-ux.md` | 持续更新站点，抓取 2026-09-21 | 1.0 | 2026-09-21 | 认知与感知定律的名称与设计含义 |
| Shape of AI | `raw/docs/shape-of-ai.md` | 持续更新模式库（仅索引页），抓取 2026-09-21 | 1.0 | 2026-09-21 | AI 界面模式六族：Wayfinders / Prompt actions / Tuners / Governors / Trust builders / Identifiers |
| sparanoid《中文文案排版指北》 | `raw/docs/chinese-copywriting-guidelines.md` | 长期维护仓库，抓取 2026-09-20 | 1.0 | 2026-09-21 | 中英文、数字、单位的空格约定；全角半角；专有名词 |
| 微信《小程序设计指南》 | `raw/docs/wechat-miniprogram-design-guidelines.md` | 持续更新文档，抓取 2026-09-20 | 1.0 | 2026-09-21 | 四条原则、胶囊、标签栏 2–5、提示 1.5 秒、热区 7–9 mm、字号体系 |

## Specifications

| 规范 | 快照路径 | 来源版本 | 分析版本 | 最后更新 | 学习重点 |
| --- | --- | --- | --- | --- | --- |
| W3C DTCG Design Tokens Format Module | `raw/docs/dtcg-design-tokens-format.md` | **2025.10**（Final Community Group Report，2025-10-28）/ 抓取 2026-09-21 | 1.0 | 2026-09-21 | 首个稳定版；值为带类型的对象（dimension / duration / color）；`$type` 继承、别名、`$deprecated`、`$extensions` |
| Google Labs DESIGN.md | `raw/docs/design-md-format.md` | spec version **alpha** / 抓取 2026-09-21 | 1.0 | 2026-09-21 | YAML token + Markdown 理由；固定章节顺序；保留未知章节；lint 与 diff CLI |
| W3C《中文排版需求》（clreq） | `raw/docs/clreq-chinese-text-layout.md` | 工作组持续修订文档 / 抓取 2026-09-20 | 1.0 | 2026-09-21 | 行首行尾禁则四级（推荐基本处理）、标点挤压先于禁则、破折号与省略号不可拆、中西文间距 ≤ 1/4 字宽 |

## Research Syntheses

| 来源 | 快照路径 | 来源版本 | 分析版本 | 最后更新 | 学习重点 |
| --- | --- | --- | --- | --- | --- |
| 设计灵感与资源站点版图 | `catalog/resources.jsonl` | 601 条；用户提供 17 条（2026-09-20 的 15 条 + 2026-09-21 的 2 条）+ 调研；验链 2026-09-21 | 1.0 | 2026-09-21 | 按粒度 × 真实度 × 易腐度选源；agent 可达性分布；站点腐烂的实例 |
| AI 设计 skill 横评 | `raw/docs/anthropic-frontend-design-skill.md` 等 | 六个项目 + v0，读数日期 2026-09-20/21 | 1.1 | 2026-09-21 | 四个流派；反套路清单自身易腐，解药同样易腐；`PRODUCT.md` 与确定性检测 |

## Repositories

本轮未做本地检出，结论来自 README 级材料与仓库元数据（读数 2026-09-20）。需要深入分析时 shallow clone 到 `raw/repos/<slug>/`（已被 git 忽略）并在此记录 commit。

| 项目 | 上游 | 元数据 | 状态 |
| --- | --- | --- | --- |
| taste-skill | https://github.com/Leonxlnx/taste-skill | MIT，约 8.9 万星 | 读了维护者本机已安装副本的前 140 行与结构 |
| UI UX Pro Max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | MIT，约 12.9 万星；本机副本 commit `b7e3af80f6e331f6fb456667b82b12cade7c9d35` | 读了 README 与目录结构 |
| Impeccable | https://github.com/pbakaus/impeccable | Apache-2.0，约 6.9 万星 | 读了 README |
| design.md | https://github.com/google-labs-code/design.md | Apache-2.0，约 2.8 万星 | 读了 README（精简规范） |
| web-interface-guidelines | https://github.com/vercel-labs/web-interface-guidelines | MIT | 读了 README 全文 |
| DTCG community-group | https://github.com/design-tokens/community-group | — | 读了 `technical-reports/format` 与 `color` 的类型定义 |

## 新鲜度审查

### 2026-09-21（首次全量验链）

- 覆盖：607 个候选 URL，约 100 秒，零模型开销。结果：static 437 / js 105 / blocked 40 / unreachable 19 / dead 6。
- **由重定向发现的变更**：`godly.website` → `recent.design`（Godly 并入 Recent Design，后者已含 websites / og-images / app-store-screenshots / app-icons / tools / skills 分区）；`screenlane.com` 与 `uimovement.com` → `pageflows.com`；`scrnshts.club` → `screensdesign.com/store-screenshots/`；`reallygoodux.io` → `goodux.appcues.com`；`polaris.shopify.com` → `shopify.dev/docs/api/polaris`；`koto.studio` → `koto.com`；`futurefonts.xyz` → `futurefonts.com`；`savee.it` → `savee.com`；`react-spectrum.adobe.com/react-aria/` → `react-aria.adobe.com`；`icons.pqoqubbw.dev` → `lucide-animated.com`。
- **由 404 发现的变更**：Lucide 图标设计指南迁至 `/contribute/icons/design-principles`；Cloudscape GenAI 模式迁至 `/gen-ai/`；Spline 社区迁至 `community.spline.design`；grainy-gradients 演示站下线（改指 CSS-Tricks 原文）。
- **许可证变更**：Remix Icon 自 2026-01 起由 Apache-2.0 改为 Remix Icon License v1.0（可商用，禁止作为图标包转售）。
- 处理：移除 8 条（并入他站、失效或无法核验的 B 档），修正 15 条，最终 599 条。
- 19 个不可达主机为 TLS 握手失败（`SSL_ERROR_SYSCALL`），判断为网络路径问题而非站点死亡，目录中标记 `agent_access: unknown`，未删除。
- 当日第二次全量运行（599 条，约 160 秒）时维护者网络更不稳定，不可达升至 48 个，并暴露出脚本缺陷：失败的抓取被写成 `unknown`，覆盖了上一轮的有效观测。已修复为"抓取失败不算观测，保留上次所见"，并从上一提交恢复了 34 条。最终分布：static 433 / js 112 / blocked 40 / unknown 14。
- 方法约定：①重定向到其他主机 = 并购/改名信号，必须人工看一眼；②不可达 ≠ 已死，用网络搜索确认；③`agent_access` 只由脚本写入，且抓取失败不覆盖既有观测。

## Official Links

运行时可用的权威链接表在 `skills/design-studio/references/source-map.md`；完整资源目录在 `catalog/resources.jsonl`。

## 重点阅读文件

- `analysis/10-overall-design-synthesis.md`（跨来源总综合，快速阅读路径第一站）
- `analysis/02-ai-design-skills-survey.md`（同类项目横评）
- `analysis/11-distilled-skill-design.md`（套件取舍、角色边界、非目标、已知自我违反）
- `analysis/12-dogfooding-the-lab-page.md`（套件第一次用于真实任务的过程记录。1.2：从十个方向到十六个，再加上线路图与切换滚动；整页过程收成测量、器具、滚动、路径运动和字体回落五条规则）
- `skills/design-studio/SKILL.md`（入口与路由）
- `skills/design-studio/references/source-map.md`（逐文件证据等级）
- `catalog/sections.json`（目录的分类法与各分节使用建议）
