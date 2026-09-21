# AI 设计 skill 横评

> 分析版本：1.0 ｜ 最后更新：2026-09-21 ｜ 覆盖来源：Anthropic `frontend-design` skill、taste-skill、UI UX Pro Max、Impeccable、Vercel Web Interface Guidelines、Google Labs DESIGN.md ｜ 版本见 `analysis/SOURCE_INDEX.md`

在动手写自己的设计 skill 之前，先看别人是怎么做的。这一篇横向比较六个公开项目：其中两个（taste-skill、UI UX Pro Max）在维护者本机已安装，直接读了本地文件；Anthropic 的 skill 取了三个时间点的快照（2025-12、2026-06、当前）；Impeccable、Vercel 准则、DESIGN.md 读了仓库 README。摘要见 `raw/docs/anthropic-frontend-design-skill.md`、`raw/docs/vercel-web-interface-guidelines.md`、`raw/docs/design-md-format.md`。

## 核心观点

- **所有项目都在解同一个问题：模型回归均值。** 每家的开场白几乎一样——"模型在同一批 SaaS 模板上训练，于是每个项目都长一个样"。分歧在于解法。
- **解法分四个流派**：① *人设与原则*（Anthropic：把模型设定成"客户已经否决过模板方案的设计总监"，给原则和流程，不给数值）；② *旋钮与预检*（taste-skill：先做 design read，再用三个 1–10 的旋钮控制变化度/动效强度/密度，最后跑预检清单）；③ *知识库检索*（UI UX Pro Max：CSV 数据库 + BM25 检索，按产品类型返回风格、配色、字体搭配与反模式）；④ *命令词汇表 + 确定性检测*（Impeccable：24 个命令如 `shape`/`critique`/`polish`/`distill`/`bolder`/`quieter`，外加 61 条不需要 LLM 的检测规则）。
- **"反套路清单"本身会变成下一个套路。** Anthropic 的 skill 在 2025-12 版反对的是通用字体与紫色渐变；到 2026 年中，它列出的"生成感"特征已经变成：暖米色底 + 高对比衬线 + 赤陶色点缀、近黑底 + 荧光绿点缀、报纸式细线零圆角版式、SaaS 卡片套件、以及模板装饰（全大写眉标、中点分隔的元信息、"词 — 片段"式标签、给小数据标签用等宽字体、链接后加箭头）。也就是说，上一轮"有品位的反应"成了这一轮的默认。**靠清单回避不是设计方法**；真正耐久的判据是 Anthropic 新版里那句话的意思：这个选择是否"无论主题是什么都会出现"。
- **最被低估的两个工程化做法**：Impeccable 把"持久的产品事实"（受众、目的、约束、语气）写进 `PRODUCT.md`，与易变的视觉方向分开；并把一部分审美检查做成**不调用模型的确定性规则**。这与本仓库姊妹项目（agent skill lab）"反复出现的反馈要从散文升级为机械约束"的结论同源。
- **DESIGN.md 是值得对齐的格式，而不是要不要的问题。** Google Labs 把"给 agent 读的设计系统描述"做成了开放规范（YAML front matter 放 token，Markdown 正文放理由，固定章节顺序，带 lint 与 diff CLI）。仓库 2.8 万星、衍生的 awesome-design-md 11.7 万星，说明这个格式已经有生态。但它目前是 alpha，没有模式（暗色）、动效、状态矩阵的词汇。

## 关键规则与数值

| 项目 | 机制 | 覆盖范围 | 值得借的 | 明显短板 |
| --- | --- | --- | --- | --- |
| Anthropic frontend-design | 单文件、人设 + 原则 + 两遍式流程（先计划再对照 brief 自查再写码） | 网页前端 | "从主题的世界里取材"；计划阶段用 4–6 个具名颜色 + ASCII 线框；"大胆只花在一处"；文案即设计；截图自评 | 无多方案、无设计系统、无状态矩阵、无平台规范、无参考检索 |
| taste-skill | 1200 行单文件；design read → 三旋钮 → 设计系统映射表 → 预检 | 落地页、作品集、重设计（明确不含后台与多步产品界面） | 一句话 design read；"该用官方设计系统时就装官方包"的诚实规则；重设计先审计 | 单文件过大，token 成本高；强绑 React/Tailwind/Motion；数值默认（变化度 8）本身就是一种风格 |
| UI UX Pro Max | CSV 库（风格 67、推理规则 161、配色、字体搭配、图表…）+ Python 检索 + 设计系统生成器 | 多平台、多技术栈 | 把"查表"与"推理"分开；按行业给反模式 | 输出是按行业查表的均值答案——正是它想避免的东西；配色与字体以十六进制和 Google Fonts 为主，无对比度计算 |
| Impeccable | 1 个 skill + 24 命令 + `PRODUCT.md` + 浏览器内实时变体 + 61 条确定性检测规则 | 前端界面 | 命令词汇表让"迭代方向"可说出口（更大胆/更克制/提纯/加固）；产品事实与视觉方向分离；无 LLM 的检测器 | 面向前端；命令多，学习成本不低 |
| Vercel Web Interface Guidelines | 规则清单 + `AGENTS.md` + 审查 skill | Web 界面工艺 | 目前最好的工艺检查表（见 `analysis/03-web-interface-craft.md`） | 只管工艺，不管方向与审美 |
| DESIGN.md | 文件格式 + lint/diff CLI | 设计系统描述 | token 为准、散文解释为何；未知章节必须保留；对比度随 lint 计算 | alpha；无模式/动效/状态词汇 |

## 易腐与耐久

- 耐久：先读 brief 再设计；计划先于像素；对照"是否与主题无关"自查；渲染后用截图自评；产品事实与视觉方向分开保存；能机械检查的就别靠自觉。
- 易腐：任何一份"AI 味特征清单"；各项目绑定的技术栈与库版本；星数与热度（taste-skill 8.8 万、UUPM 12.9 万、Impeccable 6.9 万，均为 2026-09-20 的读数）。

## 对设计 agent 的启发

- 现有项目几乎都只覆盖**网页前端的视觉生成**。没有一个同时覆盖：多方案发散与收敛、参考检索与解构、设计系统、动效、图标、品牌、平面、评审、落地验收，以及中文排版与国内平台。这就是本套件的位置。
- 不做单文件巨型 skill：入口路由 + 专注子 skill + 按需加载的参考，才能把每次任务的上下文控制住。
- 不做"按行业查表出方案"：查表给的是均值。目录应该指向**活的参考**，让 agent 去看、去解构。
- 反套路要教**判据**并给清单标日期，而不是维护一份黑名单。

## 注意

- 本篇对 Impeccable、DESIGN.md、Vercel 准则只读了 README 级材料；对 taste-skill 读了前 140 行与目录结构；结论是结构性的，不是逐条审计。
- 星数不等于质量，只说明"设计 skill"是 2026 年的热门品类。

## 对最终 skill 的影响

- `skills/design-studio/SKILL.md`：采用"入口路由 + 子 skill + 共享参考"的结构；核心规则写入"每个默认都要能从 brief 得到辩护，新奇同理"。
- `skills/design-studio/references/anti-slop.md`：以"这个选择是否与主题无关"为总判据；两代特征清单均标注日期并声明易腐；补充国内语境的默认（大屏深蓝发光、未改主题的组件库）。
- `skills/explore-design-directions/SKILL.md`：一句话 design read；方向以"命名 + 一句概念"固定下来供后续决策检验。
- `skills/build-design-system/references/token-formats.md`：`DESIGN.md` 对齐 Google Labs 格式，并用追加章节承载其尚不能表达的模式、动效、状态、对比度表与非目标。
- `skills/design-studio/references/quality-rubric.md` 与 `skills/critique-design/SKILL.md`：自评不可信，评审应由只看 brief 与截图的新上下文完成。
- `.planning/seeds/SEED-002-design-lint.md`：登记"确定性设计检测脚本"作为后续方向（受 Impeccable 启发）。
