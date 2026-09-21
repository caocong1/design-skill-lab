# Design Skill Lab

这个项目沉淀设计类的学习资料、经过筛选和标记的设计资源目录，以及一套可复用的 agent skill —— 让 Claude Code / Codex 这类编码 agent 能像一位资深设计师那样工作：覆盖 Web 前端、移动与桌面 App、动效、图标、品牌与平面设计。结构沿用姊妹项目 `ai-agent-skill-lab`：原始资料 → 分析 → skill → 可视化索引，外加机械校验。

它支持的用途：

1. **按需求出一套完整设计**：brief → 找参考 → 多个方向供选择 → 设计系统 → 关键页面与状态 → 动效、图标与素材 → 评审 → 交付或落地。
2. **设计一个页面、组件、流程、动效、图标或一张图**。
3. **针对一个网站或产品给灵感**：从目录里选对来源、解构参考、给出可执行的改动建议。
4. **同时做几套方案**：方向在真实的轴上拉开（字体气质、色彩策略、版式语法、密度、形状、层次、图像、动效个性），同内容同保真度并排呈现，附比较与推荐。
5. 以及资深设计师会做、但需求里没写的事：设计评审与验收、保留资产的重设计、竞品拆解、风格 DNA 提取、token 漂移审计、状态矩阵、数据密集界面与数据大屏、AI 产品界面、平台适配、中文排版与字体授权、从代码产出海报 / 社媒图 / 演示文稿、授权台账、趋势雷达、设计决策记录。完整说明见 `analysis/11-distilled-skill-design.md`。

## 目录

- `catalog/resources.jsonl`：**资源目录的单一事实来源**，601 条，每条标记了学科域、分节、类型、标签、"适合查什么"、"怎么直达"、收费与登录、agent 可达性、授权、档位（S/A/B）、活跃度、语言、来源（用户提供 / 调研发现）。
- `catalog/sections.json`：目录的分类法，以及每个分节"资深设计师怎么用这类资源"的一句话。
- `skills/design-studio/`：skill 套件入口（路由、模式、核心规则、共享基础参考、目录的运行时视图、脚本）。
- `skills/<其余 11 个>/`：专注的子 skill，见下表。
- `skills/iterate-design-lab/`：维护本仓库自身的 skill（加资源、加来源、验链、改 skill）。
- `raw/docs/`：一手资料的**转述式结构化摘要**（带来源 URL、抓取日期与"非原文镜像"声明）。
- `raw/research/`：调研简报、候选数据的 schema，以及 2026-09-20 那轮调研留下的候选域名清单。
- `analysis/`：分主题的中文分析与总综合；`analysis/SOURCE_INDEX.md` 登记来源版本与新鲜度审查。
- `docs/index.html`：可筛选的资源目录与仓库导览（数据来自生成的 `docs/catalog.js`）。
- `scripts/build-catalog.py`：从目录生成 skill 的运行时参考文件与文档页数据；`--check` 校验是否过期。
- `scripts/check-links.py`：机械验链，并根据站点的真实响应写入 `agent_access`。
- `scripts/check-lab-invariants.sh`：本仓库约定的机械闸。
- `.planning/`：验链报告与触发式 seed。

## skill 套件

| skill | 做什么 |
| --- | --- |
| `design-studio` | 入口：读懂任务、选模式、路由到最少的子 skill；核心规则与交付物契约 |
| `explore-design-directions` | 写 brief、出 2–4 个真正不同的方向、方案板、比较与推荐、收敛 |
| `find-design-inspiration` | 按粒度选来源、浏览、解构、综合成可执行动作；竞品拆解、风格 DNA、趋势扫描 |
| `design-product-ui` | 产品界面：屏幕、组件、流程与全部状态；平台规范、后台与数据大屏、AI 产品界面 |
| `design-marketing-sites` | 落地页、官网、作品集：信息先于版式、Hero 策略、节奏、响应式重排 |
| `build-design-system` | token 三层、色彩 / 字体 / 间距体系、组件规格、主题与暗色、`DESIGN.md`、token 漂移审计 |
| `design-motion` | 要不要动、怎么动；动效 token、规格表、可重播可慢放的原型；各平台实现 |
| `design-icons` | 选图标家族、按家族规则补图标、自绘图标集、应用图标与 favicon |
| `design-brand-identity` | 一页纸策略、概念方向、SVG 标志与测试、识别系统、品牌规范、重塑 |
| `design-graphics` | 海报、社媒图、OG 图、演示文稿、印刷物、生成式背景；从代码渲染到 PNG / PDF |
| `critique-design` | 带证据与分级的中文评审报告；设计验收；也是套件自身产出的新眼光把关 |
| `implement-design` | 在宿主技术栈里落地：读宿主、映射 token、构建顺序、截图比对、交接文档 |

套件的三个支点：

- **渲染并查看。** agent 的设计媒介是代码，眼睛是截图；没有渲染并看过的设计只是猜测，没验证的要如实说没验证（`skills/design-studio/references/render-and-look.md`）。
- **能算的不估。** 对比度与色阶由 `skills/design-studio/scripts/color_tools.py` 计算，多视口截图由 `skills/design-studio/scripts/shot.sh` 完成。
- **耐久与易腐分开。** 感知、层级、排版、无障碍、流程写在 `SKILL.md` 与基础参考里；平台规格、库 API、社媒尺寸、"生成感"特征清单放在带日期的参考文件里，登记在 `iterate-design-lab` 的 Perishable Register，定期复核。

## 当前资料集

**资源目录**（601 条；S 131 / A 374 / B 96）按 12 个域组织：`web` 网站、`app-ui` 产品界面、`motion` 动效、`icons` 图标、`assets` 素材、`brand` 品牌、`graphic` 平面、`type` 字体（含中文字体与排版）、`color` 色彩、`code` 开源项目与以代码为媒介的工具、`reading` 文章书籍课程、`general` 社区与聚合。用户提供的站点全部收录并标记来源：2026-09-20 的 15 个（`origin: user-2026-09-20`）与 2026-09-21 补充的 v0、Impeccable 中文站（`origin: user-2026-09-21`）。

**一手摘要与分析**（16 份摘要，11 篇分析）：

- Anthropic `frontend-design` skill 及其配套文章、Impeccable 的反模式规则目录、Vercel Web Interface Guidelines、Emil Kowalski 的动效文章、Material 3 动效 token（含 M3 Expressive 弹簧）、Lucide 图标设计原则、Radix 12 级色阶、Practical Typography、Hobday 的视觉规则、Laws of UX、Shape of AI。
- 规范类：W3C DTCG《Design Tokens Format Module 2025.10》、Google Labs DESIGN.md（alpha）、W3C《中文排版需求》。
- 中文语境：《中文文案排版指北》、微信《小程序设计指南》。
- 同类项目横评：Anthropic skill、taste-skill、UI UX Pro Max、Impeccable、Vercel 准则、DESIGN.md（`analysis/02-ai-design-skills-survey.md`）。

快速阅读路径：`analysis/10-overall-design-synthesis.md` → `skills/design-studio/SKILL.md` → `analysis/02-ai-design-skills-survey.md` → `analysis/11-distilled-skill-design.md`。

## 这个项目不做什么

- **不是用户研究套件**：不组织访谈、问卷与可用性测试。
- **不替代商标检索与法律意见**：skill 会明确提示做专业检索；授权说明是常见模式，不是法律结论。
- **不驱动 Figma 等设计工具**（除非宿主环境提供了桥接）：媒介是代码，产物是 HTML / CSS / SVG / token / 文档。
- **不承诺易腐内容的时效**：平台像素规格、库 API、社媒尺寸、AI 界面模式都标了复核日期，使用前以官方页面为准。
- **不做自动化来源摄取**：判断什么值得收、放在哪、给什么档位，是这个仓库的全部价值。
- **不发布为可安装包**：安装方式就是软链到 skills 目录。
- **不维护多语言平行译本**：分析用中文，skill 用英文。

## 已知局限

写在和能力清单同等醒目的位置（详见 `analysis/11-distilled-skill-design.md`）：

- **这套 skill 还没有被评测过**：没有验证集，没有前后对比，规则的有效性目前是合理推断。
- **证据等级不均**：排版、色彩、动效、token、图标规则有一手摘要支撑；平台规范（Apple HIG、Material 3、HarmonyOS）、品牌、平面、营销站点、数据大屏主要来自通识，未经本仓库核验。逐文件的证据等级见 `skills/design-studio/references/source-map.md`。
- **2026-09-20 的首轮调研失败过一次**：并行派出的调研 agent 在写出交付物前耗尽额度。之后改为"主 agent 筛选 + 脚本验链"，教训写入了维护 skill 的 Cost Discipline。
- **目录档位是单人判断**；国内资源覆盖薄于英文资源；19 个站点在维护者网络下 TLS 不可达，标为 `unknown`。

## 版本与变更

skill 版本记录在各 `SKILL.md` frontmatter 的 `metadata.version`（`design-studio` suite 当前 0.2.0），遵循语义化版本，作用于契约（模式、交付物、产出目录结构、reference 路径）。`0.x` 期间契约仍在定型。每次迭代记录在 `CHANGELOG.md`；逐来源的版本与新鲜度审查在 `analysis/SOURCE_INDEX.md`。

## 使用方式

### 安装

把 skill 目录软链到 agent 的 skills 目录。子 skill 之间用 `../` 相对路径互相引用，所以**要装就装整套**：

```bash
# Claude Code
for d in <repo-path>/skills/*/; do ln -sfn "$d" "$HOME/.claude/skills/$(basename "$d")"; done

# Codex
mkdir -p "$HOME/.codex/skills"
for d in <repo-path>/skills/*/; do ln -sfn "$d" "$HOME/.codex/skills/$(basename "$d")"; done
```

`iterate-design-lab` 只在本仓库内有用，可以不链。

### 使用 `design-studio`

可以点名，也可以直接描述任务让 agent 自动匹配：

```text
请使用 design-studio，根据这份需求给我们的设备运维后台出一套完整设计，先给三个方向让我选。
```

```text
用 design-studio 给这个定价页出三套方案，保留现有品牌色。
```

```text
这是我们的官网 https://example.com ，用 find-design-inspiration 找参考，告诉我首屏和导航可以怎么改。
```

```text
请用 critique-design 走查 src/views/dashboard，输出带证据和优先级的评审报告。
```

```text
用 design-motion 给这个抽屉和列表增删设计动效，要有可以慢放的演示页。
```

```text
用 build-design-system 的 audit 模式清点这个项目里散落的颜色和间距，给出 token 映射表和迁移计划。
```

在宿主项目里，设计产物默认写到 `.design/`（brief、决策记录、方案板、设计系统、页面原型、动效演示、图标、评审报告），生产代码写进项目自己的源码树。

### 脚本

```bash
# 对比度（WCAG 比值 + APCA Lc），低于阈值时退出码为 1
skills/design-studio/scripts/color_tools.py contrast "#6b7280" "#ffffff"
# 全量前景 × 背景对比度表
skills/design-studio/scripts/color_tools.py matrix --fg "#111827,#6b7280" --bg "#ffffff,#f3f4f6"
# 从一个种子色生成感知均匀的 11 级色阶（--neutral 中性灰，--dark 暗色镜像，--format css|json）
skills/design-studio/scripts/color_tools.py scale "#3b82f6" --name blue
# 多视口截图（390 / 768 / 1280 / 1920，2x；--dark 暗色，--full 整页）
skills/design-studio/scripts/shot.sh page.html .design/shots
```

### 使用 `iterate-design-lab`

```text
请使用 iterate-design-lab，把这几个站点加进目录：……
```

```text
请使用 iterate-design-lab 做一次全量验链。
```

```text
请使用 iterate-design-lab，把 Apple HIG 做成摘要和分析，并更新 platforms.md。
```

### 维护检查清单

- 改了 `catalog/` 之后运行 `scripts/build-catalog.py`，生成文件与 JSONL 一起提交。
- 新条目运行 `scripts/check-links.py --write --ids <id>`；`agent_access` 只由脚本写。
- 提交前 `scripts/check-lab-invariants.sh` 必须干净退出。
- `design-studio` 的 `metadata.version`、本 README 与 `CHANGELOG.md` 三处版本一致。
- 新分析文件第 3 行是元数据块，并以 `## 对最终 skill 的影响` 结尾，内容与实际提交一致。
