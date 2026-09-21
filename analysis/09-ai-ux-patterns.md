# AI 产品界面模式：Shape of AI

> 分析版本：1.0 ｜ 最后更新：2026-09-21 ｜ 来源：Shape of AI（持续更新的模式库，抓取 2026-09-21）｜ 快照：raw/docs/shape-of-ai.md

维护者在做多个 AI 助手类产品（网页端助手、桌面端、法律领域 agent），AI 产品界面是高频需求。Shape of AI 是目前结构最清楚的公开模式库；本篇只读了它的索引页（模式名称与一句话定义），没有逐个阅读模式详情页。

## 核心观点

- **模式会过期，模式背后的问题不会。** 这个库把几十个模式归为六族，而六族对应六个稳定的用户问题：我怎么开始（Wayfinders）、我能让它做什么（Prompt actions）、我怎么调（Tuners）、我怎么保持控制（Governors）、我凭什么信它（Trust builders）、哪个是 AI（Identifiers）。设计 AI 界面时按这六个问题逐一过一遍，比背模式名有用。
- **"Governors"是最长的一族，也是 agent 类产品最要紧的一族**：行动计划（执行前先给步骤）、分支、引用、控制（中途暂停或停止并调整）、成本预估、草稿模式、记忆管理、引用来源管理、示例回复（复杂请求先确认意图）、共享视野、思维流（推理、工具调用与决策可审计）、变体、验证（行动前确认）。这与姊妹项目在 agent 工程上的结论一致：能做的事越多，边界与可见性越重要。
- **聊天不是默认答案。** 库里"Inline action""Auto-fill""Inpainting""Restructure"等模式都在说明：当任务已经有归属的界面时，把 AI 做成内容上的动作，比让用户用散文描述同一件事好。

## 关键规则与数值

本来源不含数值规则；`ai-ux.md` 中的时序数字（约 100 ms 内给出活动反馈等）来自通用反馈时限，不来自本来源。六族及其代表模式见摘要文件。站点内容以 CC BY-NC-SA 授权分享。

## 易腐与耐久

- 耐久：六个问题；"有副作用的动作要在人的控制之下"；"让 AI 可被识别"；"标注生成内容"。
- 易腐：具体模式、哪些产品是范例、AI 的视觉识别惯例（闪光图标、紫色渐变已是该品类的默认，见 `analysis/02-ai-design-skills-survey.md`）。这个领域按季度变化，取用时要带日期。

## 对设计 agent 的启发

- 先选"承载面"（内容上的行内动作 / 侧边副驾 / 完整会话 / agent 运行视图 / 环境式自动），再谈模式。
- 审批界面要用用户的语言展示"将发生什么"（diff、预览、收件人、金额），而不是只给原始工具调用；超时或审批方不可用应当等同于未批准。
- 流式输出要稳定布局、不逐字动画、只在用户位于底部时跟随滚动；无障碍上用 polite live region 分块播报。
- 原型里的示例对话要用真实领域内容，并包含一条不完美的回答和一个错误状态。

## 注意

- Google PAIR Guidebook、Microsoft HAX Toolkit 已收入目录但未做摘要。
- 仅读索引页，Tuners / Governors / Trust builders / Identifiers 的模式名与定义来自原文，使用指导未读。

## 对最终 skill 的影响

- `skills/design-product-ui/references/ai-ux.md`：Decide the Surface First 表、The Six Questions、Conversation Mechanics、Approvals for Agent Actions、Accessibility、Honesty Rules。
- `skills/design-product-ui/SKILL.md`：description 与按需加载列表中加入 AI product UI。
- `skills/design-studio/references/resources/app-ui.md`（生成）：AI product UX 分节。
