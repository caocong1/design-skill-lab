# 反馈处置日志

只追加，不改写。每轮 evolve 处理完追加一节。

## 2026-09-24 · 从宿主 A（带 Office/WPS 加载项的 Web 业务系统）补录 11 条（交互式，主人在场）

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

## 2026-09-24 · 宿主 B（需要登录的 AI 助手类 Web 应用）3 条 + 主人纠正 1 条（交互式，主人在场）

捕获验证：0.6.1 之后第一个项目，最终回复带 `Skill feedback: 3 entries`，3 条均合规；会话中用户没有设计上的纠正，复盘后只有部署，未发现漏记。0.6.0 的字号下限与"主题是个性不是配色"在该项目被执行。

| 簇 / 条目 | 分级 | 处置 |
| --- | --- | --- |
| 重设计过于保守 `redesign-too-conservative`（主人纠正） | C（主人拍板） | 0.7.0：redesign 改为 功能拆解 -> 脱离旧界面出方向 -> 评审与资产盘点；结构轴；至少两个重构方向、细节修复作共享基线；"整体 UI 优化"默认按 redesign；多主题可结构化但限定变体点。主人决定：优化原有 UI 时完全放开，多主题限定变体点 |
| 主题族 `theme-families-scoping` | C（主人批准） | 0.7.0：build-design-system 新增 Theme Families（三层 token、按属性限定作用域、`var()` 派生 token 的作用域陷阱） |
| 登录应用截图 `authenticated-app-capture` | B | 0.7.0：`render-and-look.md` 工具梯级加"登录应用"做法；脚本仍在提案 P1（已补第二个项目证据） |
| 重拍拍错构建 `after-capture-wrong-build` | B | 0.7.0：截图陷阱加"每张截图带构建标记并先核对" |

## 2026-09-29 · 宿主 C（中文个人媒体库 Web，桌面与移动端）回顾补录 6 条（交互式，主人授权全权处理）

来源：主人贴来的一份回顾性反馈汇总，由另一台机器上的宿主会话整理（事件发生于 2026-09-28，那台机器上套件是拷贝安装，采集关闭）。汇总按事件拆成 6 条入库，正文基本照录；证据索引 E01–E07 留在宿主本机，本仓库没有见到原始记录，所以每条的事实以汇总的转述为准。宿主使用时的确切版本未核实（汇总写的是本机标注 0.9.0）。

| 簇 / 条目 | 分级 | 处置 |
| --- | --- | --- |
| 没看到实图就被要求选方向 `directions-chosen-without-renders` | B | 0.10.0：`directions.md` 第 10 节加"先给看再问"（选择问题带上方案板路径和每个方向的 PNG，落盘不算展示，任何力度下让用户在几种外观里选都按 `options` 先画出来）；决策记录写明是谁选的。条目里"各主题的操作语义保持一致"没有对应的事故，`interaction.md` 第 6 节已有"同一动作同一名称同一位置"，未加 |
| 机械检查通过但有模板感 `template-feel-despite-passing-checks` | B | 0.10.0：`anti-slop.md` 流程加第 6 步"剥离测试"；`heuristics.md` 第 13 节加"装饰要么表达信息要么去掉"；`render-and-look.md` 第 9 节要求底线、独立评审、用户三个结论分开报；`directions.md` 第 8 节写明缩略图测试只证明方向不同。被移除的手法（序号、硬阴影、细线）多数已在 `anti-slop.md` 的 tells 里，没有新增 tell，也没有把这次的反感写成禁令 |
| brief 里的观看优先没落到首屏 `primary-task-not-in-first-viewport` | B | 0.10.0：`truth-files.md` 第 6 节要求 brief 的每个高频任务写成一条终点线条件并用混合数据检查；`surface-contract.md` 的 First viewport 对集合类界面多问默认排序、每行字段、状态不靠颜色怎么读、低频字段收在哪；`product-ui.md` 状态矩阵的 Data 行和 `directions.md` 的 content.md 要求各种状态混在一起，外加"全部完成"；`heuristics.md` 第 7 节同步。规则归属是 product-ui 和界面契约，不是条目点名的 `redesign.md`。"播放不等于标记看完"是宿主的产品事实，不进 skill |
| 控件粗大、对齐和字号 `control-alignment-and-text-scale` | B | 0.10.0：`heuristics.md` 第 6 节加跨页面同角色控件、控件行、操作列的检查，第 4 节加"字号按信息的重要性定"；implement-design 0.3.1 的验证步骤要求没有设计稿的页面对照画过的页面逐个控件比。命中区域与可见形状分开早已写在 `layout-and-spacing.md`，未重复。没核实那一轮是否同一个 agent 既设计又实现 |
| 评审看了还在变的截图 `critique-on-moving-captures` | B + C | 与 `after-capture-wrong-build`（2026-09-24，宿主 B）同根因，算第二次出现。0.10.0：`render-and-look.md` 第 5 节加"冻结评审看到的那一批"，`critic-brief.md` 加 Capture set 一行。脚本输出里加批次标识进提案 P7 |
| 采集关闭且无从得知 `capture-off-not-diagnosable` | B + C | 按规则关闭采集是预期行为，不是漏记。0.10.0：`feedback.md` 第 1 节加"用户问起时"的路径（回答开关与原因；采集关着时写未提交草稿，用 `--import` 收回）；`feedback/README.md` 和 README 写明另一台机器的补录做法。显式配置反馈目标、默认留回退文件、安装自检进提案 P8 |

未验证：这些改动都还没有在宿主项目或评测里跑过。6 条来自同一个项目的同一天；现有记录没有证明用户对最终外观明确满意。
