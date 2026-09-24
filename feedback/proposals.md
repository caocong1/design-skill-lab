# 待人工确认的结构性改动提案

evolve 模式把 Tier C 改动追加到这里，每条带证据条目链接与建议方案。确认后由人或 agent 实施，实施完把条目移到下方"已处置"。

## 待办

### P1 登录后逐路由截图的做法或脚本（2026-09-24 提出）

- **证据**：`feedback/archive/2026-09/2026-09-24-authenticated-route-sweep.md`（bidops-app）。agent 为约 40 条需登录的路由手写了登录辅助、路由表和截图脚本；`skills/design-studio/scripts/shot.sh` 只接受单个 URL 或文件。
- **方案**：在 `skills/design-studio/scripts/` 加一个扫路由脚本（或先在 `render-and-look.md` 写成做法）：登录一次、路由表带 ID、语言/时区/视口/倍率参数、对共享服务器只读、断言落地 URL 或就绪元素、输出每条路由一张 PNG 加清单。与 0.6.0 加进 `render-and-look.md` 的截图陷阱配套。
- **为什么没直接做**：新增脚本属于 Tier C；目前只有一个项目的证据，等第二个需要登录的宿主项目再定接口。

### P2 评审证据提交哪些（2026-09-24 提出）

- **证据**：`feedback/archive/2026-09/2026-09-24-commit-curated-evidence.md`（bidops-app）。`.design/shots/` 整个被忽略，提交进仓库的评审报告引用的截图不在仓库里。
- **方案**：在 design-studio 的 Output Location 写明：每个问题的裁图或关键前后对比放 `.design/critique/<date>-<target>/`，随报告提交；批量扫图放 `.design/shots/` 并忽略。
- **为什么没直接做**：改动产出目录约定（契约），且只有一条 nit 级证据。

## 已处置

（空）
