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
