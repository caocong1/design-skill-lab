# 设计 token 规范与 DESIGN.md：两种给机器读的设计描述

> 分析版本：1.0 ｜ 最后更新：2026-09-21 ｜ 覆盖来源：W3C DTCG《Design Tokens Format Module 2025.10》、Google Labs DESIGN.md 规范（alpha）｜ 版本见 `analysis/SOURCE_INDEX.md`

两个规范解决的是相邻但不同的问题：DTCG 让**工具之间**交换 token；DESIGN.md 让**agent**理解一套视觉系统。前者追求无歧义，后者追求"带理由"。摘要见 `raw/docs/dtcg-design-tokens-format.md`、`raw/docs/design-md-format.md`。

## 核心观点

- **DTCG 终于有了稳定版。** 2025-10-28 发布的 2025.10 是第一个 Final Community Group Report。最大的形态变化是：值从字符串变成**带类型的对象**——尺寸是 `{ "value": 16, "unit": "px" }`（单位只允许 px 与 rem，为 0 也必须带单位），时长是 `{ "value": 200, "unit": "ms" }`，颜色是带 `colorSpace` 与 `components` 的对象（支持 srgb、display-p3、oklch 等，可附 `hex` 回退）。没有可解析类型的 token 无效，工具不得猜。
- **但生态不会一夜迁移。** 大量现存流水线仍在读旧草案语法（`"16px"`、`"#ff00ff"`）。这与姊妹项目在 MCP 规范修订上看到的现象一致：规范换代时，"匹配宿主已安装的版本"比"用最新语法"更重要。
- **DESIGN.md 的关键设计是"token 为准，散文解释为何"。** YAML front matter 放精确值，正文按固定顺序（Overview、Colors、Typography、Layout、Elevation & Depth、Shapes、Components、Do's and Don'ts）解释用法；消费方必须保留未知章节；附带的 CLI 能 lint 结构、解析引用、计算组件配色的 WCAG 对比度，还能 diff 两版检测回归。
- **两者互补而不是二选一。** token 文件是实现的事实来源；DESIGN.md 是给下一个 agent 的说明书。

## 关键规则与数值

- DTCG 类型：`color`、`dimension`、`fontFamily`、`fontWeight`（1–1000 或具名别名）、`duration`、`cubicBezier`、`number`；复合类型 `strokeStyle`、`border`、`transition`、`shadow`、`gradient`、`typography`。
- 属性：`$value`（必需）、`$type`（可由组继承）、`$description`、`$extensions`（按厂商键存放私有数据）、`$deprecated`（`true` 或说明字符串）。别名 `{group.token}`，因此名称里不能出现花括号与点。
- `px` 在 Android 对应 dp、在 iOS 对应 pt；1 rem 在 Android 对应 16 sp。
- DESIGN.md front matter：`version`（当前 "alpha"）、`name`、`description`、`omitted`、`colors`、`typography`、`rounded`、`spacing`、`components`；组件属性限于 `backgroundColor`、`textColor`、`typography`、`rounded`、`padding`、`size`、`height`、`width`；状态用相关命名的独立条目表达（`button-primary-hover`）。

## 易腐与耐久

- 耐久：带类型的 token、别名、组与继承、显式弃用标记；"值 + 理由"同文件；对设计描述做 lint 与 diff。
- 易腐：DTCG 的主题/解析器模块仍在演进；DESIGN.md 处于 alpha，尚无模式（暗色）、动效、状态矩阵的词汇，CLI 包名与命令也可能变。

## 对设计 agent 的启发

- 默认产物分层：Web 项目只需要 `tokens.css`（CSS 变量）；有第二个消费平台时再出 DTCG JSON；`DESIGN.md` 始终写，因为它服务的是"下一个接手的 agent"。
- DESIGN.md 表达不了的内容（模式、动效、状态规则、对比度表、非目标）放在标准章节之后的追加章节里——规范要求消费方保留未知章节，这正好是安全的扩展点。
- "显式弃用再移除"同样适用于设计系统：token 改名或删除是破坏性变更。

## 注意

- 颜色模块只读了类型定义与示例，未通读全部受支持色彩空间的分量范围。
- DESIGN.md 只读了仓库 README 的精简规范，未读 `docs/spec.md` 全文。

## 对最终 skill 的影响

- `skills/build-design-system/references/token-formats.md`：四种格式（CSS 变量、DTCG 2025.10、DESIGN.md、原生主题对象）的示例与取舍，明确"匹配宿主工具链版本"。
- `skills/build-design-system/SKILL.md`：Deliverables（`tokens.css` / `tokens.json` / `DESIGN.md` / `preview.html`）、Versioning 一节。
- `skills/design-studio/SKILL.md`：Output Location 中 `system/DESIGN.md` 的定位为"agent-readable design system"。
