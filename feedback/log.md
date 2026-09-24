# 反馈处置日志

只追加，不改写。每轮 evolve 处理完追加一节。

## 2026-09-24 · 从 bidops-app 补录 11 条（交互式，主人在场）

来源：宿主会话记录、`.design/decisions.md`、评审报告、本轮提交。会话里 agent 一条都没记，本轮由 evolve 第 0 步补录。

| 簇 / 条目 | 分级 | 处置 |
| --- | --- | --- |
| 收尾没复盘 `close-out-retro-missing` | — | 已在 0.5.1 修复（收尾三问复盘 + `Skill feedback:` 行 + DoD） |
| 截图证据陷阱 `screenshot-evidence-traps` | B | 0.6.0：`render-and-look.md` 加截图陷阱四条 |
| 未验证就标已修 `verify-before-marking-fixed` | B | 0.6.0：implement-design 验证步骤 + 反模式（简写属性冲掉全局控件样式） |
| 事后改写建议 / 高密度最小字号 `min-text-size-dense-cjk` | B | 0.6.0：critique-design Conduct 一条；`data-dense-ui.md` 字号下限 |
| 旧代码颜色迁移 `legacy-color-migration` | B | 0.6.0：build-design-system 漂移审计认可两阶段迁移并写明局限；"归色系辅助脚本"未做，等更多证据 |
| 评审任务说明 `critic-brief-manifest` | B | 0.6.0：critique-design self-check 要求给评审清单 |
| 嵌入宿主窗格 `embedded-host-panes` | C（主人批准） | 0.6.0：`platforms.md` 新增一节，design-product-ui 路由与描述同步 |
| 宿主已有系统为准 `existing-system-of-record` | C（主人批准） | 0.6.0：design-studio Output Location 写明 |
| 落选方向做成主题 `runner-up-directions-as-themes` | C（主人批准） | 0.6.0：explore-design-directions Converge 一条 |
| 登录后逐路由截图 `authenticated-route-sweep` | C | 提案 P1，等第二个项目的证据 |
| 评审证据入库 `commit-curated-evidence` | C | 提案 P2 |

## 2026-09-24 · ai-assistant-web 3 条 + 主人纠正 1 条（交互式，主人在场）

捕获验证：0.6.1 之后第一个项目，最终回复带 `Skill feedback: 3 entries`，3 条均合规；会话中用户没有设计上的纠正，复盘后只有部署，未发现漏记。0.6.0 的字号下限与"主题是个性不是配色"在该项目被执行。

| 簇 / 条目 | 分级 | 处置 |
| --- | --- | --- |
| 重设计过于保守 `redesign-too-conservative`（主人纠正） | C（主人拍板） | 0.7.0：redesign 改为 功能拆解 -> 脱离旧界面出方向 -> 评审与资产盘点；结构轴；至少两个重构方向、细节修复作共享基线；"整体 UI 优化"默认按 redesign；多主题可结构化但限定变体点。主人决定：优化原有 UI 时完全放开，多主题限定变体点 |
| 主题族 `theme-families-scoping` | C（主人批准） | 0.7.0：build-design-system 新增 Theme Families（三层 token、按属性限定作用域、`var()` 派生 token 的作用域陷阱） |
| 登录应用截图 `authenticated-app-capture` | B | 0.7.0：`render-and-look.md` 工具梯级加"登录应用"做法；脚本仍在提案 P1（已补第二个项目证据） |
| 重拍拍错构建 `after-capture-wrong-build` | B | 0.7.0：截图陷阱加"每张截图带构建标记并先核对" |
