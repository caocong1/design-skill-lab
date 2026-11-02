# Design Studio Team（设计工作室团队）— WorkBuddy 专家团

三人协作的设计团队：黛米（设计总监兼首席设计师）、卡西（设计评审师）、伊凡（设计工程师），
内嵌 design-studio、critique-design、implement-design 三个技能。

## 分工

- **黛米 design-team-lead**：主理人兼设计师，运行 design-studio 完成设计本体并调度成员
- **卡西 design-critic**：新鲜视角评审与构建验收，运行 critique-design，产出分级发现与 ship/fix/rebuild 处置
- **伊凡 design-implementer**：按设计稿/交接包在宿主项目实现，运行 implement-design，用截图证明还原度

## 流程

设计解读 → 方向与绘制（主理人）→ 新鲜评审（卡西）→ 修订或实现（主理人修 / 伊凡建）→ 交付汇总。

设计产物写入 `.design/`；契约介质为 HTML/CSS/SVG，一切以渲染结果为准。

来源：[design-skill-lab](https://github.com/caocong1/design-skill-lab)，MIT License。
