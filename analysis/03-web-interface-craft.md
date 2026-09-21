# Web 界面工艺：Vercel 准则、Hobday 安全规则与 Laws of UX

> 分析版本：1.0 ｜ 最后更新：2026-09-21 ｜ 覆盖来源：Vercel Web Interface Guidelines、Anthony Hobday《Visual design rules you can safely follow every time》、Laws of UX ｜ 版本见 `analysis/SOURCE_INDEX.md`

三个来源分别回答"界面的交互工艺怎么算做对"、"视觉上哪些规则可以无脑遵守"、"这些规则背后的认知原理叫什么"。它们的共同点是**可检查**：几乎每一条都能对着截图或代码判断是否满足。摘要见 `raw/docs/vercel-web-interface-guidelines.md`、`raw/docs/hobday-visual-design-rules.md`、`raw/docs/laws-of-ux.md`。

## 核心观点

- **工艺是几百个小决定的总和**，而这些小决定大多不是审美问题，是"有没有想到"的问题：焦点环是否被吸顶栏遮住、加载指示是否一闪而过、筛选状态是否进了 URL、数字与单位之间是不是不换行空格。模型在这些地方失败不是因为不会，而是因为没人要求。
- **视觉规则里最有用的是带数字的那几条**：阴影模糊约为偏移的两倍；嵌套圆角 = 外圆角 − 间距；容器与背景的亮度差在深色界面约 12% 以内、浅色约 7% 以内；按钮水平内边距约为垂直的两倍；间距从"高对比点"量起而不是从包围盒量起。
- **给判断一个名字，审美就变成了论证。** 说"这里应该只留一个主按钮"是意见；说"希克定律 + Von Restorff 效应"是可以被反驳的论点。Laws of UX 的价值在于词汇，不在于新知识。

## 关键规则与数值

取三个来源里对 agent 最可执行的部分：

- 目标尺寸：视觉小于 24 px 的控件，点击区扩到至少 24 px；移动端至少 44 px。移动端输入框字号至少 16 px（否则 iOS Safari 聚焦时缩放）。
- 加载状态：指示器延迟约 150–300 ms 再出现，一旦出现至少停留约 300–500 ms；变更类请求（POST/PATCH/DELETE）应在 500 ms 内完成。
- 表单：不要预先禁用提交按钮；不要拦截按键；错误放在字段旁，提交后聚焦第一个错误；占位符是示例而不是标签。
- 动画：只动 `transform` / `opacity`；永不 `transition: all`；`transform-origin` 对准"物理起点"；可被用户输入打断；超过 5 秒的自动动效要能暂停。
- 内容：骨架屏与最终布局一致；弯引号、真正的省略号字符、`tabular-nums`；状态不只靠颜色；纯图标按钮必须有 `aria-label`。
- 设计：阴影至少两层（环境光 + 直射光）；嵌套圆角同心；非中性背景上把边框、阴影、文字向同一色相偏；交互态的对比度高于静止态；深色主题设置 `color-scheme: dark`。
- 视觉（Hobday）：近黑近白代替纯黑纯白；中性色带一点主色相（只偏暖或只偏冷）；一切对齐于某物；外边距 ≥ 内边距；正文 ≥ 16 px；行长约 70 字符；最多两种字体；不并排两条硬分割；深色界面不用阴影；一个界面只用一种深度手法；与文字并排的图标要降低对比度。

## 易腐与耐久

- 耐久：焦点、目标尺寸、标签、状态设计、URL 即状态、乐观更新、只在合成层做动画、同心圆角、分层阴影，以及 Hobday 的全部规则（都是感知规律）。
- 易腐：Vercel 清单里点名的库（nuqs、virtua、React Scan）、Safari 的具体变通、"优先 APCA 而非 WCAG 2"的建议——APCA 仍是草案，法律与合规参照仍是 WCAG 2.x；以及 Vercel 自己声明"非通用"的文案偏好（标题大写、用 & 代替 and）。

## 对设计 agent 的启发

- 这类规则最适合做成**评审的检查层**与**落地后的打磨层**，而不是生成时的提示词：先保证结构与层级对，再逐条过工艺。
- 凡是带数字的规则都应进入共享参考，让各子 skill 引用同一处，而不是各写一遍。
- 对比度两个都报：WCAG 比值用于合规，APCA Lc 用于感知参考。

## 注意

- NN/g 的十条可用性启发式本应与 Laws of UX 配套摘要，但 nngroup.com 在抓取当日从维护者网络不可达，因此没有写摘要，也没有凭记忆补写；`critique-design` 中只以名称引用。
- Vercel 清单偏 React/Next.js 语境，个别条目（hydration、Suspense）对其他栈不适用。

## 对最终 skill 的影响

- `skills/critique-design/SKILL.md`：评估顺序第 8–14 层（交互与动效、内容、无障碍、性能即体验、工艺）与"用启发式交叉核对"一句来自本篇；发现项要求带证据与测量值。
- `skills/design-studio/references/layout-and-spacing.md`：分组、对齐、间距从高对比点量起、嵌套圆角、阴影规则、容器亮度差、目标尺寸表。
- `skills/design-studio/references/color.md`：近黑近白、中性色带色相、交互态提高对比、WCAG 与 APCA 并报。
- `skills/design-product-ui/SKILL.md`：表单与反馈规则；`references/data-dense-ui.md` 的表单一节。
- `skills/design-motion/references/motion-tokens.md`：加载指示的延迟与最短停留时间。
- `skills/implement-design/references/stacks.md`：Web 一节的状态选择器、`scrollbar-gutter`、安全区等。
