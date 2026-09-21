# SEED-002 确定性设计检测脚本（design lint）

状态：planted（2026-09-21）。来源：`analysis/02-ai-design-skills-survey.md`（Impeccable 的 61 条无 LLM 检测规则）与姊妹仓库"反复出现的反馈要升级为机械约束"的结论。

## 想法

给 `skills/design-studio/scripts/` 增加一个不调用模型的检测脚本，对一个 HTML/CSS 产物或一个代码目录统计：

- 出现的不同颜色、字号、字重、间距、圆角、阴影、z-index、时长与缓动的数量，以及近似重复值的聚类（token 漂移）。
- 文字/背景对的对比度（复用 `color_tools.py`）。
- `transition: all`、对布局属性做动画、缺少 `prefers-reduced-motion` 分支。
- 小于 16 px 的移动端输入框字号、缺少 `alt` / `aria-label` 的图片与纯图标按钮。
- 图标集 SVG 的一致性：`viewBox`、描边宽度、端点样式、是否残留 `fill` 与 `transform`。

## 触发条件

- `critique-design` 或 `build-design-system` 的 `audit` 模式在真实项目里被用过两次以上，且人工清点成为瓶颈。

## 注意

先读 Impeccable 的规则清单再设计，避免重复造轮子；只做能确定判定的规则，审美判断留给评审。
