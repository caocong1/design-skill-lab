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

## 2026-10-11 · 宿主 D（中文桌面应用，egui 原生界面加 Web 端）写回的 3 条，0.14.0

条目由宿主会话直接写进 inbox（日期 2026-10-09）。本仓库没有见到那一轮的原始记录，事实以条目为准；截图和 lint 的一条在本仓库复现了。

| 簇 / 条目 | 分级 | 处置 |
| --- | --- | --- |
| 窄的桌面窗格被当成手机 `narrow-desktop-pane-linted-as-touch` | B | 复现成立：320 宽的帧被模拟成触摸、无悬停、移动端 UA，lint 报 `touch-target` 和 `input-zoom`。lint 本身把它们列为警告，不是底线失败；算进底线的是评审。脚本"小于 600 就是手机"的假设和 `desktop.md`、`embedded-hosts.md`、`layout-and-spacing.md` 对不上。0.14.0：`capture.mjs` 和 `lint.mjs` 加 `--no-touch`，路由表加 `"touch": false`，报告记 `touch`；`render-and-look.md` 第 3 节写明，rubric F4 和 critic brief 同步。默认行为不变，默认截图与 0.13.0 逐字节相同。没有做条目建议的 `--pointer fine`：只有一个取值的选项不如开关直白，而且 `lint.mjs` 已经有 `--touch` |
| 原生界面没有出构建截图的办法 `no-render-path-for-native-ui` | B | 只有一条 minor，但 implement-design 第 4 节第 1 步写的"simulator or goldens"在这个技术栈上两样都没有，指引走不通。0.14.0：`stacks.md` Desktop 一节加离屏渲染加桩的做法，implement-design 第 1 步指过去。条目里的 `run_ui + egui_wgpu::Renderer` 写法没有采用：没有核对过，而且是易腐的 API 细节。写进去的是在 docs.rs 上核对过的 `egui_kittest`（0.36）。implement-design 0.3.4 |
| 另一个设计 skill 抢先触发 `other-design-skill-won-trigger` | A + C | 用户的纠正。请求里的词（样式、统一、好看）描述里一个都没有。0.14.0：描述加"restyles or unifies the look of existing product UI across app and web"和"美化、样式统一"；没有加单独的"样式"（会碰到 t071 的纯 CSS 重构）和"更好看"（t038 是特意留的两可行）。代理方法抽查 54 个回答全部符合预期，但旧描述在代理里本来就赢，所以改动有没有用没有证据。真实宿主里的抽查写成提案 P10 |

没有改 `evals/triggers.jsonl`：它用过之后是冻结的回归集，往里加这次的原话等于对着它调描述。

仍未验证：`--no-touch` 和离屏渲染的写法在宿主里的使用；描述的改动在真实宿主里的效果（P10）。

## 2026-11-02 · 季度研究复核顺带处置的 3 条（0.16.0）

这一轮的主任务是研究复核（`research/log.md` 2026-11-01 一节），只处置了与复核改动直接对应的条目；其余条目（提交时 inbox 里有 30 条，含复核期间宿主新提交的；多来自宿主 zh-architecture-doc-html、zh-static-docs-site、zh-macos-native-app 等）留在 inbox，等下一次 evolve。

| 簇 / 条目 | 分级 | 处置 |
| --- | --- | --- |
| `light-dark()` 的回退写成"不需要" `light-dark-fallback-none-needed`（major） | A | 事实错误，复核 web-features 3.44.0 时一并改：`platforms/web.md` 的能力表、`modern-css.md`、`system.md` §4、`token-formats.md` §2；`templates/tokens.css` 加 `@supports not (color: light-dark(#000, #fff))` 浅色回退块；`color_tools.py matrix` 跳过该块（新旧脚本对模板的输出逐项相同）。在 Chromium 里把函数名改成未知名模拟不支持的引擎：旧模板主按钮透明、白字，新模板完整回落到浅色主题 |
| 画稿没用上压力内容 `draw-the-stress-content`（major） | B | 与 Emil Kowalski `break-ui` 的做法一致（emil-kowalski-skills 第 23 条）。`product-ui.md` 状态矩阵下加一段：最坏情况的数据集放在一个开关后面，每个目标尺寸至少一帧用它画，样稿与构建验收截图用同一份数据 |
| 评审子 agent 写不了报告 `critic-cannot-write` | — | 重复：0.13.0 已把"写入被拒就把整份报告放进回复"写进 `critique-design/templates/critic-brief.md` 的 Return 一节；这次宿主用的是自己临时写的任务说明，没用模板。不改 |


## 2026-11-16 · inbox 里积压的 37 条（0.19.0）

条目来自六个宿主项目（按形态：zh-architecture-doc-html、zh-static-docs-site、zh-macos-native-app、zh-docs-static-site、zh-desktop-ops-tool、zh-macos-utility，另有一条 new-web-app），2026-10-23 至 11-06 写入。主人说"继续处理"，按 evolve 流程逐条读原文、按根因聚类。脚本缺陷先在本仓库复现再改。

| 簇 / 条目 | 分级 | 处置 |
| --- | --- | --- |
| 动效定格帧截出来是最终帧 `capture-disables-motion-freeze`、`motion-frozen-capture`（major），以及 `webgpu-direction-verify-review` 的同一点 | A | 复现成立：`capture.mjs` 用 `animations: 'disabled'`，暂停在 t = 0.25 s 的动画被快进到终点（800 px，应为 230 px）。加 `--keep-animations`（截图用 `animations: 'allow'`），复测得 230 px；`motion.md` §7 与 `render-and-look.md` §2、§3 指向它，并写明 rAF 驱动的画布两种模式都不会暂停 |
| 路由表的目录 base 解析高了一层 `capture-routes-directory-base` | A | 复现成立：`resolve()` 去掉末尾斜杠。目录 base 现在补上斜杠，夹具里截到的是 `sub/other.html` |
| 强制颜色要手写脚本 `capture-forced-colors-option` | B | `capture.mjs --forced-colors`（文件名加 `-fc`，报告记录），夹具里红块变成系统 Canvas；`render-and-look.md` §2 的 Themes 一行指向它 |
| 320 宽的重排只在评审时才发现 `capture-misses-320-reflow`（major） | B | `render-and-look.md` §2：Read 与 Operate 界面在 Web 默认尺寸外加 320（`--no-touch`），多页站点在评审前扫一遍横向溢出 |
| 方案板的 iframe 在整页截图里是空白 `board-iframes-blank-full-capture`；方案板用截图不用标记 `board-images-not-markup`（nit）；动效方向上方案板 `options-board-motion-directions` | B + C | `render-and-look.md` §3 加离屏 `file://` iframe 的陷阱；`directions.md` §7 允许多帧或以动效为主的方向用截图（加带封面、减弱动效下不自动播放的短片段）并链接实时帧，灰度条用同一批截图。录制脚本与卡片变体写成提案 P12 |
| `lint.mjs`：子元素字重被算到父元素上 `lint-cjk-synthetic-child-span`、跨主题的近似值 `lint-token-drift-across-themes`（nit） | A | 两条都复现成立并修好：用到粗体字面时不再报伪粗体；近似值只在同一主题内比较。新旧脚本在同一夹具上对比：旧版报 `#eeeeee ~ #ebebeb` 和伪粗体，新版只报同主题的 `#cccccc ~ #cbcbcb` |
| `lint.mjs` 漏报表格单元格的省略号 `lint-misses-ellipsis-in-table-cells`；整页截图后触摸布局被换掉 `lint-coarse-pointer-flip` | A（防御） | 本仓库固定的 Playwright 上两条都没能复现（省略号能报出，整页截图前后 `pointer: coarse` 不变），宿主多半用的是 npx 拉来的别的版本。仍加了两道防御：带省略号的盒子比较 `scrollWidth` 与 `clientWidth`；截图前后布局状态变了就不用像素取样、退回计算值并说明 |
| 首屏选择器按视口区分 `lint-above-fold-per-viewport` | B | `--above-fold '1280x800=h1, .map; 390x844=h1'`，与契约模板的写法一致（模板同步）；夹具里 `.late` 只在 390 报出 |
| 方向 `bold-palette-pole-missing`、`direction-isolation-shared-file`、`content-md-too-few-rows`、`converge-without-user` | B | `directions.md` §5：brief 要"酷炫、震撼"时至少一个方向到达配色策略与图像两个轴的远端；§6：每个子 agent 只拿自己那一行坐标，并写明可读的宿主文件；content.md 的行数要填满最大帧的主列表；§10：无人可选时可以由新上下文评审按两两规则挑，记下种子和次选。文件守在 300 行 |
| 收敛时的改动是谁定的 `contract-convergence-owner` | B | 契约模板：收敛及之后的每条改动标 `(user)` 或 `(author)`；评审可以撤回作者的改动，撤回用户的要先问 |
| 状态新鲜度与"源不可达" `freshness-unreachable`（major） | B | `product-ui.md`：探测或同步来的状态写明新鲜度（实时、最后已知加时长、从未）；"源不可达"是单独画的状态，不能画成每一项都红；状态矩阵 Async 一行加入 |
| 原生姿态被推翻 `native-posture-overridden`（major，用户纠正） | B | `platforms/README.md`：姿态写进 brief 并写明谁定的；商业产品或多桌面系统时，外壳的姿态是业务问题，brief 没说就问；"每天用的工具所以遵循惯例"管的是工作面，不自动管外壳。`truth-files.md` 的设计判断加姿态一句 |
| 评审把术语当排版问题 `critique-styles-jargon-instead-of-flagging`（major，用户纠正） | B | `critique-design/references/heuristics.md` §9：brief 指明不写代码的读者时，正文里的路径、命令、字段名、英文状态值是内容问题（成片出现为 P1），解法是换成读者的话，等宽字体、断行规则和术语表都不算解决；附一个数代码样词的便宜检查 |
| 强制颜色下的边框三角 `forced-colours-border-triangles` | B | `heuristics.md` §10：把墨色和纸色 token 映射到 `CanvasText` / `Canvas`，形状本身 `forced-color-adjust: none`；不要逐边改色 |
| `auto-phrase` 对中文无效 `auto-phrase-zh` | A | 说法有误：`cjk-typography.md` 改为 `word-break: auto-phrase` 只对日文生效，并给中文标题的三种做法 |
| 技术图示 `technical-diagram-guidance` | B | `graphics.md` §7 加四条：按渲染后的字号算（≥ 12 px）、一套贯穿所有图的流向词汇和图例、颜色走类名或自定义属性、动画图有静态终态 |
| WebGPU 方向的验证与评审 `webgpu-direction-verify-review` | B | `render-and-look.md` §3 的 Canvas 与 WebGPU 一条扩充：在别人会打开的源上验证（局域网 http 不是安全上下文）、等就绪标志（`--ready`）、退回说明先查 `isSecureContext`、2D 退回要完整、可旋转的相机要能回到构图 |
| 原生 macOS 截图 `native-macos-capture`、`side-by-side-copy-shares-uuid`（均 major）、`native-motion-evidence` | B | `render-and-look.md` §3 加"原生 macOS 窗口"：按窗口 id 截、后台启动并关窗口恢复、跳过小窗口（警告框）、后台窗口渲染为非激活态、颜色检查前转 sRGB；并列副本从源码构建、独立 bundle id 与构建 UUID，不从正式包重签（Apple TN3178、TN3179，宿主引用，本仓库未读原文）；原生采样帧只能说明顺序，减弱动效通过应用自己的动效策略注入 |
| 原生验收 `acceptance-inactive-selection`、`acceptance-misses-upgrade-path`（均 major）、`implement-mode-acceptance-inputs`、`round2-new-states-cap` | B | `critique-design/SKILL.md`：验收除演示数据外要有"升级后首次启动"和"稀疏数据"两种状态；原生桌面每个主题一张激活窗口截图，在选中底色上取样文字；第二轮里第一次截到的状态单独完整过一遍，不占三条回退的名额；implement 模式用验收截图对照表代替交接包（`critic-brief.md` 同步）。正文 149 / 150 行 |
| SwiftUI 的阴影泄漏与 `Table` 陷阱 `swiftui-shadow-leak`、`swiftui-table-pitfalls`（major），以及 `acceptance-misses-upgrade-path` 里的 `fixedSize` | B | `implement-design/references/stacks.md` SwiftUI 一节加 macOS 陷阱一条；文件压到 300 行 |
| 原生构建评审后先改系统文件和构建 `native-redraw-after-critique` | C | 交付契约的变更，写成提案 P13 |
| 局域网分享方案板 `share-board-on-lan` | C | 新脚本，写成提案 P11 |
| 方案项沿用了实验室的预设 `options-use-lab-presets`（major） | — | 已在 0.15.0 处置（`directions.md` §0 宿主事实先于示例、`seed.py` 的来源记录、`evals/options-preset-leak.md` 回归），条目当时没有归档，这次一并归档 |

仍未验证：`--keep-animations`、`--forced-colors`、按视口的 `--above-fold` 和两道 lint 防御在宿主里的使用；两条没复现的 lint 缺陷在宿主自己的 Playwright 版本上是否就此消失；原生 macOS 的做法只来自一个宿主。
