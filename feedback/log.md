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

## 2026-09-29（续）· 宿主 C 的四个问题得到回复，0.10.1 据此修正

上一节留了四个没核实的问题，由主人转给宿主那台机器；回复依据原始会话、工具调用和评审文件。本仓库仍然没有见到原始记录。

| 问题 | 回复要点 | 处置 |
| --- | --- | --- |
| 那一轮的模式、力度、方案板 | 初次重构声明的是 `redesign` + `implement`、力度 deep；三个方向各由隔离的子 agent 画出，有各自的 frame、卡片和 1440 / 390 截图；**统一的方案板没有组装**；没有声明 `options`。用户被问偏好时还没看到图 | 归因确认为执行偏离：deep 的 redesign 本来就要求方案板。0.10.1 只把 `directions.md` 第 10 节的出处写准（画了、拍了、没组板、用文字问）。"方向稿生成过"不等于"选择前给用户看过" |
| 独立评审的分数 | 初次重构第二轮 Fit / Hierarchy / Identity 为 4 / 4 / 4，处置 `fix`，完整门槛未过（机械验证和状态覆盖有缺口）；报告写入四分钟后用户反馈仍有模板感。Identity 给 4 的理由是三个主题的封面行、编号目录、分段进度在列表和辅页中一直成立。之后 A、C 的审美修订评为 3 / 3 / 3 和 3 / 3 / 2，评的是新截图，不是同一批图的重评 | 这是评分与用户反应不一致的校准证据（`rubric.md` 第 4 节第 10 步），但不是"过了门槛之后被用户否定"。0.10.1：`rubric.md` Identity 一节写明一致性属于 Craft，母题只按它从哪里来计分，主题之间有差异不等于哪一个属于这个产品。只有一次观察，没有动分数表本身 |
| 是否同一个 agent 设计并实现 | 主 agent 负责设计整合和生产界面实现，方向稿和评审由独立子 agent 完成，没有接收完整交接包的独立实现者。方向稿主要覆盖首页和部分详情；被批评的表单、选择器、手动修正控件**在实现前没有设计稿**，是直接在生产 CSS 里边设计边实现的 | `control-alignment-and-text-scale` 的根因从"还原"改判为"设计覆盖不足"，归属是 design-studio 而不是条目写的 implement-design（已归档条目不改）。0.10.1：`handoff.md` 第 1 节要求 implement 模式的验收截图清单覆盖构建涉及的每个界面族，没画过的先画再写生产代码；implement-design 0.3.2 把"缺界面"列入退回设计的情形 |
| 套件是怎么装的 | Windows 上的 Codex Desktop，agent 用 Codex 自带的 skill-installer 从 GitHub 整目录拷贝安装，没有指定 ref | 归因收紧为安装方式丢掉了与实验室根目录的关联，采集规则按预期关闭。写进提案 P8 的更新；README 安装一节注明拷贝安装得到的是副本。Windows 的链接安装写法没有验证过，不写进 README |

未验证：0.10.0 和 0.10.1 的改动都还没有在宿主项目或评测里跑过。

## 2026-09-29（再续）· 主人要求把开着的都处理掉，0.11.0

| 事项 | 处置 |
| --- | --- |
| 提案 P7 截图批次标识 | 做了：`capture.mjs` 的报告带 `capture_id` 和每张图的 `sha256`，`--freeze` 让冻结的目录拒绝再次写入。移到"已处置" |
| 提案 P8 拷贝安装的反馈怎么回来 | 做了自检脚本 `feedback_status.py` 和环境变量 `DESIGN_SKILL_LAB_INBOX`；"默认在宿主项目留草稿"和"提交到 GitHub"不做，原因写在提案里。移到"已处置" |
| 提案 P1、P2 挂在"待办" | 主体在 0.8.0 已经做完，这次移到"已处置"。P1 剩下的语言和时区补上；路由替换不做 |
| 提案 P3–P6 | 没有动。P3 要等第二次观察；P4–P6 要第三轮评测、留出的 brief 和人工评审，不是这一轮能关掉的 |
| Windows 没有验证 | 加了 `scripts/test-feedback-status.py` 和 CI 的 `windows` 任务，分支推上去才会第一次运行；真实宿主里的安装写法仍要在那台机器上试 |

## 2026-09-29（三续）· 0.11.0 在 Windows 上的验证，0.11.1

分支 `evolve/2026-09-29` 按主人的要求推送。CI 三个任务通过，其中 `windows` 任务在 Windows Server 2025 上跑完自测 6 项。随后主人把验证步骤转给宿主 C 那台机器（Windows 11，Codex Desktop），回报五步全部符合预期：升级、拷贝安装自检、环境变量、截图脚本的冻结与摘要。

| 发现 | 处置 |
| --- | --- |
| Codex 的安装器遇到已存在的目录会中止，不覆盖；支持 `--ref` | 写进 README 的 Windows 一节：升级前先把旧目录改名或删除 |
| 没装 Playwright 时按提示改用 npx，第一次失败：命令里用了 PowerShell 的 `$script:` 变量，npx 的包装脚本重新解析命令行时取不到 | 不是脚本的缺陷，换成字面路径即通过。`render-and-look.md` 第 1 节和 README 各加一句 |
| 那台机器的工具策略拦了两次递归删除临时目录 | 宿主自身的策略，与套件无关，未处置 |
| Codex 认不认目录联接装的 skill | 没有试。拷贝安装加环境变量已经能开采集 |

## 2026-09-29（四续）· 0.10.x 的试跑和它写回的 5 条反馈，0.12.0

试跑由实验室自己发起：三个 skill 整目录拷贝到临时目录，一个不知道考察点的 agent 照用户原话给中文个人媒体库设计首页、出三个方向。它照做了"先给看再问"、混排状态的样例数据、界面契约的四项提示、混合数据的终点线、决策记录写明谁选的、采集自检；冻结批次、剥离测试、implement 模式的界面覆盖、Identity 计分说明没有走到。逐条核对见 CHANGELOG 0.12.0。只有一次运行，不是评测。

采集关着，它按 0.11.0 的规则把 5 条写成草稿，用 `--import` 收进来：

| 簇 / 条目 | 分级 | 处置 |
| --- | --- | --- |
| 整页截图过高时下半截重复页面顶部，仍报 ok `tall-full-page-capture-wraps` | A | 复现成立（9000 px、DPR 2，从 8192 px 折回）。0.12.0：`capture.mjs` 判为 `too-tall`；`render-and-look.md` 第 3、4 节写明 |
| 只问采集状态也写了草稿 `capture-state-answer-ambiguous` | A | 0.11.0 的一句话把两种请求并在一起，是措辞问题。0.12.0：拆成两条 |
| 同一目录拍两次，报告被覆盖 `capture-report-overwritten` | B | 三个方向子 agent 和方案板组装都撞上。原因是一份样稿的两帧尺寸不同，只能分两次拍。0.12.0：路由表里每条路由可以有自己的视口和主题，`base` 可以是本地文件；`render-and-look.md` 第 2 节写明一次运行一份报告。没有做"往已有报告里追加"：一份报告对应一次运行，批次标识才有意义 |
| 一个方向两帧没有约定 `two-frames-per-direction` | B | brief 写了两个目标就一定会遇到。0.12.0：`portable-mockups.md` 定下 `data-frame` 和 `?frame=`；`directions.md` 的任务包同步；方案板模板支持一个方向多帧 |
| 出板之前要不要评审 `critique-before-board-unspecified` | B | 0.12.0：`directions.md` 第 10 节写明这一轮怎样算完成，评审等选定方向之后 |

## 2026-09-29（五续）· 宿主 C 又一轮重设计写回的 5 条，0.13.0

条目来自宿主 C（中文个人媒体库 Web）又一轮 redesign + implement，由主人收进 inbox。本仓库没有见到那一轮的原始记录，事实以条目为准；lint 的一条在本仓库复现了。

| 簇 / 条目 | 分级 | 处置 |
| --- | --- | --- |
| 固定底栏下的文字被报对比度失败 `lint-contrast-under-fixed-tabbar` | A | 复现成立：整页截图里 fixed 层停在第一屏，栏下的行采样到栏的背景。0.13.0：`lint.mjs` 不采样被 fixed / sticky 层盖住的行，整段被盖住时用计算值并注明依据；三份仓库页面新旧输出相同 |
| 截图改动了被拍应用的数据 `captures-mutate-app-state` | B | 一条，但是 major，而且它掩盖过一个数据丢失缺陷。0.13.0：`render-and-look.md` 第 4 节加"加载页面也会写数据"：一次性数据集、每轮重置、对比前后接口输出，变化要么报缺陷、要么写明副作用 |
| 主题族的结构规则漏进嵌套预览 `family-preview-structural-css-leaks` | A | `system.md` 第 5 节的说法只对 token 成立，是事实错误。0.13.0 改正并给出 `@scope ... to ([data-family])`、iframe、静态示意三种做法；在 Chrome 154 上验证过 |
| 评审子 agent 写不了报告文件 `critic-cannot-write-report` | A | 模板要求的写入在这个宿主里走不通。0.13.0：`critic-brief.md` 的 Return 加回退：整份报告放回复末尾的代码块，作者原样保存。critique-design 0.3.4 |
| implement 模式下在构建里设计的界面算不算画过 `undrawn-surfaces-in-design-implement` | C → 实施 | 要放宽 0.10.1 按宿主 C 上一轮证据加的规则，只有一条 minor，先写成提案 P9。主人同意后在 0.13.0 实施：`handoff.md` 第 1 节加有四个前提的例外（契约先行、逐控件比、fresh 评审、过门槛），implement-design 0.3.3 同步 |

主人随后要求把没验证的都处理掉：
- lint 的遮挡判断原来认不出 `pointer-events: none` 的固定层，已修，复现页面验证。
- 截图副作用加了脚本支持：`capture.mjs` 报告的 `writes` 列出页面发出的写请求，离开页面时的 beacon 也在内（只有浏览器级拦截看得到）。本地模拟应用上计数与服务器一致。
- 评审报告的回退写法用无头会话实跑了一次，结果见 CHANGELOG 0.13.0 的"验证"。

仍未验证：P9 的例外，以及宿主真实应用里的数据集重置和前后对比。
