# Changelog

本文件记录本仓库各 skill、资源目录、证据层与站点的版本变更。除非另注，`## [X.Y.Z]` 形式的条目指 `design-studio` suite；其他 skill 的条目以 `## <skill 名称> [X.Y.Z]` 标注。

版本号遵循语义化版本（SemVer），作用于 suite 契约（模式、交付物、产出目录结构、reference 路径）：

- MAJOR：契约的破坏性变更（模式名、交付物格式、reference 文件移除或重命名）。
- MINOR：新增 skill、新增能力、新增 reference、新增对指导有实质影响的分析来源。
- PATCH：措辞澄清、资源目录条目的增删改、易腐参考文件的例行复核。

`0.x` 期间契约仍在定型，MINOR 也可能调整契约，但仍会在此写明。从 1.0 起，任何移除都必须先在 `弃用登记` 下登记至少两个 MINOR 版本。

各 skill 的当前版本记录在对应 `SKILL.md` frontmatter 的 `metadata.version`；逐来源的抓取日期与复核期限见 `research/INDEX.md`（0.8.0 之前是 `analysis/SOURCE_INDEX.md`，已随 `analysis/` 删除）。下面旧版本条目里提到的路径保持原样，是当时的路径。

## [0.10.0] - 2026-09-29

消化第三个宿主项目的 6 条反馈：把"给用户看过""任务落到首屏""评审看的是哪一批图"从要求变成交付前能对上证据的关口。新增的都是现有章节里的指引（MINOR）；模式、交付物目录、reference 路径不变，surface contract 模板的 First viewport 多两行提示，评审任务说明模板多一行。

### 为什么

宿主 C（中文个人媒体库 Web，桌面与移动端）在另一台机器上用拷贝安装的套件跑了两次设计会话，事后回顾整理出 6 条，其中 4 条是用户的纠正。对照下来，相关规则大多已经有了（先渲染再展示、lint 通过不代表合适、界面契约有首屏和终点线、截图带构建标记），这一轮出的问题主要是执行时没落到证据上：只用文字描述三个方向就让用户选；方向结构不同、检查通过，用户仍觉得有模板感；brief 写了观看优先，首屏却分不清已看未看；评审看的是还在改动时拍的图。所以这一版不加新机制，只在规则的所有者文件里补上缺的那一句。处置记录见 `feedback/log.md` 2026-09-29 一节。

### 变更（skill）

- `skills/design-studio/SKILL.md` 0.9.0 → **0.10.0**（正文未改）。
- `references/process/directions.md`：
  - §10 新增"先给看再问"：让用户选择的那条消息要带上方案板的路径或 URL，以及每个方向一张 PNG（同样内容、同样尺寸）；文件落盘不算展示，文字描述的名称、配色、布局不算方案板；任何力度下让用户在几种外观里选都按 `options`，先画出来。
  - §10 决策记录写明是谁选的："用户选了 A""用户把 A、B、C 都留作主题""A 是默认启用，用户还没选"是三种不同的记录。
  - §6 content.md 的数据要把界面区分的各种状态混在一起；§8 写明通过缩略图测试只说明方向不同，不说明哪个够好。
- `references/process/render-and-look.md`：
  - §5 新增"冻结评审看到的那一批"：每轮评审的截图放进独立目录，报告回来之前不改构建、不往这个目录重拍；修复后拍进新目录，问题写明出自哪个目录；代码还在变时看的图只算探索，不出问题清单。
  - §9 底线（工具量到的）、独立评审（处置与门槛）、用户（接受、要求修改、还没看）三个结论分开报，互不替代。
- `references/fundamentals/anti-slop.md`：流程新增第 6 步"剥离测试"：渲染结果仍像模板时，把装饰层（眉题、非产品语言的标签、细线与边框、序号、偏移阴影）藏起来，同尺寸再拍一次；内容和主任务读起来一样好或更好，这层就是多余的。以内容消费为主的界面，首屏最大的东西是内容本身。它是诊断手段，不是风格要求。原第 6、7 步顺延为 7、8。
- `references/process/truth-files.md` §6：brief 点名的每个高频任务都写成一条终点线条件，并用混合数据检查；留在 brief 里的目标没有人会去查。
- `templates/surface-contract.md`：First viewport 对集合类界面多问四件事：默认排序、每行显示的字段、每种状态不靠颜色怎么读、哪些低频字段（编号、路径、来源）收在展开里。
- `references/disciplines/product-ui.md`：状态矩阵 Data 行的"典型"写明各种状态混排，新增"全部完成"。
- `references/feedback.md` §1：新增"用户问起时"的路径。用户问采集开没开、或要求做复盘，这是请求不是采集：回答开或关以及原因；采集关着时按 §4 的格式把条目写成一事一文件的草稿（默认 `.design/skill-feedback/`），说明未提交，由实验室的 `scripts/collect-feedback.py --import` 收回。静默自动采集的规则不变，仍然不留回退文件。
- `skills/critique-design/SKILL.md` 0.3.0 → **0.3.1**（正文未改）。
  - `references/heuristics.md`：§4 字号按信息的重要性定，主任务依赖的状态不因为所在区域次要就用说明文字的字号；§6 跨页面同角色控件（主按钮、选择器、搜索框、行内操作）的高度、圆角、字号、密度一致，控件行的高度与基线对齐，列表的操作列不随标题长短移动，触控下限靠命中区域而不是把控件画大；§7 压力样本加"各种状态混排"和"全部完成"；§13 装饰要么表达信息要么去掉。
  - `templates/critic-brief.md`：截图清单下多一行 Capture set（目录、捕获时间、报告回来前冻结）。
- `skills/implement-design/SKILL.md` 0.3.0 → **0.3.1**：§4 对比步骤要求没有对应设计稿的页面对照画过的页面逐个控件比（指向 heuristics §6）。149 行，预算 150。

### 变更（反馈闭环与文档）

- `feedback/`：6 条入库并归档到 `archive/2026-09/`；`log.md` 追加处置；`proposals.md` 新增 P7（`capture.mjs` 的报告里写批次标识，拒绝覆盖上一批）和 P8（拷贝安装、插件安装的反馈怎么回到实验室）。
- `feedback/README.md`：补录一节写明宿主在另一台机器上时的做法（宿主里写草稿，带回来 `--import`；整份汇总先按事件拆开）。
- `README.md`：三个 skill 的版本表此前停在 0.8.5 / 0.2.1，改为当前版本；"已知局限"的宿主反馈改为三个项目；"使用反馈"说明拷贝安装和插件安装时采集是关着的，以及怎么补。

### 没有做的

- 条目建议的"各主题保持操作语义一致"没有对应的事故，`interaction.md` §6 已有"同一动作同一名称同一位置"，没有重复。
- 没有新增 tell，也没有把这次对模板感的反感写成对某种颜色或风格的禁令。
- "播放不等于标记看完"是宿主的产品事实，不进 skill。

### 未验证

- 这些改动还没有在宿主项目或评测里跑过。6 条来自同一个项目的同一天，原始会话和评审记录留在宿主那台机器上，本仓库只见到转述。
- 宿主使用时的套件版本、那一轮的模式与力度、评审给的分数、套件是怎么装到那台机器上的，都还没有核实。

## [0.9.0] - 2026-09-28

交互与易用性：让"方便、快捷、舒心、高效"变成设计时能算、评审时能查的东西。新增一个 reference（MINOR）；模式、交付物目录不变，surface contract 模板多一个块。

### 为什么

盘点后发现套件的交互"地板"（焦点、目标尺寸、加载时序、表单、空状态）已经扎实，缺的是效率与行为：没有量化任务交互成本的方法（评审只写了"数一数步骤"）；组件的键盘模型、快捷键设计没有规则；中文输入法组字完全没人管——"选词回车就把消息发出去""搜索框在搜拼音字母"是中文产品最常见的交互缺陷之一；toast、tooltip、组合框等组件只写到"照 APG 做"，没写模式名之外必须决定的事。宿主复盘和评测里没有这方面的现场证据，所以本版全部依据新读的一手来源（见 `research/log.md` 2026-09-28）。

### 新增（skill）

- `skills/design-studio/references/disciplines/interaction.md`：交互成本、键盘模型、快捷键、输入法、组件行为表、顺手默认值的唯一所有者。
  - §1 任务成本：每个高频任务写成 KLM 操作串（M 思考 1.2 s、P 指点 1.1 s、BB 点击 0.2 s、K 按键 0.28 s、H 换手 0.4 s、W 等待）相加，用来比较方向、改版前后、鼠标与键盘路径；附一个派单的算例（11.3 s → 2.5 s / 2.3 s）。规则："先砍思考和寻找，再砍点击"。
  - §2 键盘模型：Tab 在组件间、方向键在组件内；删除和关闭后焦点的去处；选中与焦点区分；禁用项可聚焦并说明原因。
  - §3 快捷键：只给高频任务、必须有常规路径、不改标准键、避开系统 / 读屏 / 浏览器占用的组合，以及中文输入法切换键；单字母快捷键遵守 WCAG 2.1.4；在菜单、tooltip、命令面板、`?` 面板里可见；命令面板支持拼音与首字母匹配。
  - §4 输入法：组字期间回车只上屏，不发送、不提交；边打边搜、校验、字数统计等上屏后再响应；交付写明 `isComposing || keyCode === 229` 的双重判断（Safari 10.1–26.6 在完成组字的回车上报 false）；无头截图测不了，标"待确认"直到手测。
  - §5 组件行为表：菜单、组合框、页面搜索、tooltip、toggletip、toast、行内编辑、选择与批量、排序拖拽、标签页、滑块、上传、复制按钮，每行写触发、按键、关闭与焦点去处、设计必须决定的事。
  - §6 顺手与舒心：记住上次的选择、好的默认值、利用已知上下文、指针下的东西不乱动、可撤销与草稿不丢、同一动作同一名称同一位置、高频即时、手势跟手且破坏性操作松手才生效。
  - §7 交付物与陷阱。
- `skills/design-studio/SKILL.md` 0.8.5 → **0.9.0**：description 加"Specifies interaction"与"交互、易用性、快捷键"触发词；路由表 product-ui 一行并入 interaction；`standard` 阅读顺序允许把 interaction 作为第二个 discipline；新算子 **`streamline`**（降任务成本：少决定少步骤、默认值与记忆、操作到对象上、键盘路径；不动外观和任务）。为守住 200 行预算，"Contract changes"一句并入 Feedback 段。
- `templates/surface-contract.md`：新增 **Task cost** 块（Operate 界面的操作串与估算，前后对比，鼠标与键盘路径）；critic 按截图重算。
- `templates/handoff-spec.md`：Behaviour 节列出交互交付物（任务成本、键盘图与快捷键、组件的 APG 模式与待决项、输入法规则）。

### 变更（skill）

- `references/disciplines/product-ui.md`：加载段加响应时间三档（0.1 s 输入本身响应、1 s 保持思路、10 s 注意力离开，过 10 s 给百分比进度和停止）；数值仍只在这里。"Elsewhere"加 interaction。
- `references/disciplines/ai-experience.md`：输入框"Enter 发送"加输入法例外。
- `references/process/system.md`：组件行为除了 APG 模式名和键盘图，还要写模式留空的决定（链接 interaction §5）。
- `references/platforms/desktop.md`：Keyboard 一行链接 interaction。
- `skills/critique-design/SKILL.md` 0.2.1 → **0.3.0**：Power user 视角加"高频任务的成本、键盘路径与快捷键"。
- `skills/critique-design/references/heuristics.md`：§2 由"数步骤"改为按截图写操作串并与 Task cost 块对照，额外查重复输入和"寻找"；§8 加键盘（焦点去处、选中与焦点、快捷键可见、不改标准键、WCAG 2.1.4）、输入法、toast / tooltip 内容、"不在指针下移动"。

### 新增（证据层）

- 6 份来源摘要：`nng-heuristics`、`wai-aria-apg`、`ui-events-ime`、`klm-kieras`、`rauno-interaction-details`、`carbon-notification-tooltip`；`wcag-22` 补第 32 条（2.1.4）。主题 03 加结论 14–18、未决问题和约束；`research/backlog.md` 勾掉 §4 第 2、11 项，登记第 13 项（触屏 KLM、子菜单斜向容差、原生平台输入法等缺口）。

### 站点

- `docs/skills/index.html`：disciplines 列表加 interaction 链接。

### 未验证

- 新规则还没有在宿主项目或评测里跑过。KLM 时间取自 Kieras 1993 的教学版（原论文未读）；子菜单斜向容差、拖拽的键盘拾取、复制按钮的原地反馈、中文输入法切换键冲突标为业内共识（practice）。

## [0.8.5] - 2026-09-28

运行环境升到最新稳定版。suite 契约不变。

### 变更（基础设施）

- `.github/workflows/check.yml`：Node 22 → **26**，Python 3.12 → **3.14**（2026-09-28 的最新稳定线：Node v26.10.0、Python 3.14.7，也是本仓库本机开发用的大版本）。Node 26 目前是 Current 线，2026 年 10 月转为 LTS。
- Playwright 1.59.1 → **1.63.0**（`package.json`、`package-lock.json`）。原因是实测出来的：在 CI 上用四种组合各跑一次浏览器安装，只有“Node 26 + Playwright 1.59.1”失败——浏览器能下完，卡在解压，直到超时；Node 24 配两个版本、Node 26 配 1.63.0 都正常。自带的 Chromium 随之从 147 换成 153。

### 变更（skill）

- `skills/design-studio/SKILL.md` 0.8.4 → **0.8.5**。
- `skills/design-studio/scripts/lib/capture-core.mjs`、`scripts/shot.sh`、`references/process/render-and-look.md`：宿主项目没装 Playwright 时提示的版本改为 1.63.0。

### 变更（评测）

- `evals/README.md`：各臂统一安装的 Playwright 版本改为 1.63.0。渲染用的浏览器变了，之后的轮次与前两轮（Chromium 147）的渲染不再逐像素可比；分数本来也不跨轮比较。

### 验证

- 本机（Node 26.8.2）在 1.63.0 上跑通：9 道闸门、评测工具自测、站点冒烟测试、`lint.mjs`、`capture.mjs`、`evals/render.mjs`、`shoot-catalog.mjs`（单条）。

## [0.8.4] - 2026-09-28

只动基础设施。suite 契约和 skill 正文都没变。

### 变更（基础设施）

- `.github/workflows/check.yml`：四个 action 升到最新大版本 v7（`actions/checkout`、`actions/setup-node`、`actions/setup-python`、`actions/upload-artifact`；版本取自各仓库 2026-09-28 的 releases）。原来的 v4/v5 基于 Node 20，GitHub 每次运行都在强制改用 Node 24 并给出弃用提醒。跨大版本的破坏性变更（运行时换成 Node 24、模块改为 ESM、`setup-node` 的自动缓存、`setup-python` 移除 `pip-install`）都不涉及这个工作流用到的参数。

### 修复（基础设施）

- `scripts/smoke-site.mjs`：对本地静态服务器的请求改用 `node:http`，并且每次都读完响应。原来用全局 `fetch` 时有几处没读响应体（就绪探测、链接状态检查）；Python 的 `http.server` 每次响应后关闭连接，Node 内置 HTTP 客户端（undici）的解析器随之触发内部断言，异常从 socket 事件里抛出，`try/catch` 接不住，整个脚本崩溃。偶发：同一个提交在分支上通过，合并到 `main` 后失败。
- `skills/design-studio/SKILL.md` 0.8.3 → **0.8.4**（版本号随仓库走，正文未改）。

## [0.8.3] - 2026-09-28

合并到 `main` 后第一次在 CI 上跑冒烟测试，Linux 机器上抓到本机一直没暴露的横向溢出。suite 契约不变。

### 修复（站点）

- **lab 的 11 个风格在 390 宽度下会随字体横向溢出**（色卡、宋版、蓝图、卡片柜、展签、控制台、贴纸、素页、后台、字样、线路图）。原因：搜索框是弹性行里的 `<input>`，它的固有宽度等于 20 个“平均字宽”，包着它的弹性子项不能缩到这个宽度以下；回退字体更宽时就把页面撑开。本机系统字体窄，所以一直是绿的。修法：`docs/lab/base.css` 让文本输入框可以收缩，7 个风格里包着输入框的弹性或网格子项加 `min-width: 0`。
- **贴纸风格在字体 CDN 不可达时页面宽 15 px**：副标题的入场动画有一瞬间放大超过 1，手机按那一刻的内容宽度定了布局视口，之后不再缩回。给动画元素的容器加 `overflow-x: clip`。
- 新站的首页、资源目录、套件页不受影响。

### 变更（闸门）

- `scripts/smoke-site.mjs` 新增一道闸门：屏蔽字体 CDN、把输入框固有宽度放大，逐页检查 390 宽度下不横向溢出（新站 3 页加 lab 的 16 个风格）。在旧样式上它报出全部 11 个风格，修复后通过。检查不再取决于跑测试那台机器装了什么字体。

### 变更（skill）

- `skills/design-studio/SKILL.md` 0.8.2 → **0.8.3**（版本号随仓库走，正文未改）。
- `skills/design-studio/references/casebook.md`：记入三条案例——弹性行里的输入框随字体撑宽窄屏、入场动画的瞬时放大撑宽手机布局视口、本机通过而 CI 失败说明检查依赖了机器字体。按案例簿的规矩，单次事故只进案例簿，不升为规则。

## [0.8.2] - 2026-09-28

第二轮盲评的结果，加上这一轮查出的评测工具缺陷。suite 契约不变；skill 只加了一条已有两次证据的规则。

### 新增（评测）

- **第二轮（`evals/runs/2026-09-27-r2/`）**：0.8.1 对不装 skill，一格三个样本，36 份产物分成 18 组盲评。0.8.1 赢了全部 6 份 brief、17 组、49 张评审票（共 54 张），平均总分 4.11 对 3.83（+0.28）。按事先登记的规则（赢至少 5 份**且**均分高至少 0.5），分差不到门槛，结论仍是“没有明确差别”；规则不事后改。花费是不装 skill 的 2.0 倍。唯一输掉的一组（审批流第二个样本）把“整批通过”做成了主按钮，也是唯一没派出评审子代理的一次运行。
- `evals/tools/aggregate.py`：汇总脚本。报告里的每个数字都由它从评审的原始回复算出，不再手算；支持一格多个样本。
- `evals/tools/run_judges.sh`：每位评审一个独立的无头会话，只能读自己的评审包。
- `evals/tools/selftest.mjs` 与 `evals/tools/fixtures/`：测量工具的自测，CI 里运行。
- `evals/results.schema.json`：对照组不再写死为第一轮的三个，一轮可以有两到三个臂。

### 修复（评测）

- `evals/tools/facts.mjs`：文字取样点落在一帧最后一行像素时（y = 899.55，视口高 900），浏览器的命中测试返回空，工具就把文字叠到默认的白底上，把深底浅字报成 1.12:1。现在取样点上移一行；命中测试没碰到文字时记为“未测”，不再猜。用修好的工具重测了两轮全部 54 份产物，只有一条事实有变（第二轮 02 s3，记在套件样本头上的假失败）。受影响的那一组按“流程出错则整组重评”的规则用正确的事实重评：由 2:1 变为 3:0，两次都是套件胜；旧评审存档在 `02-devtool-landing-en/judging/s3/superseded-facts-bug/`，不计入。第一轮结果不受影响。
- `evals/tools/run_round.sh`：运行期间阻止电脑休眠（第二轮有三次运行因休眠断网而重跑）。
- `evals/render.mjs`、`evals/tools/facts.mjs`：没有系统 Chrome 时退回 Playwright 自带的 Chromium。

### 变更（skill）

- `skills/design-studio/SKILL.md` 0.8.1 → **0.8.2**（版本号随仓库走，正文未改）。
- `skills/design-studio/references/disciplines/data-dense-ui.md`：网格或日历的单元格，文字之外最多带两种编码，第三种就去掉一种或给单元格更多空间，文字不为装饰让位；服务单一任务的面板按任务步骤排控件，用户所在的那一步是唯一主操作。证据：第二轮 06 的两个样本（单元格拥挤、面板先收款后签到）。

### 变更（站点）

- 套件页的评测记分板加入第二轮；首页“校样”栏加一条。

### 登记为提案，未成规则

- 标出风险时把安全选项做成主操作（只出现一次）；交付前的说法复核做成脚本（自相矛盾的说法 10 对 5）；第三轮加一个“去掉评审子代理”的对照臂；第三轮开始前重新标定评分量表并重新登记门槛。见 `feedback/proposals.md`。

## [0.8.1] - 2026-09-27

第一轮盲评（`evals/runs/2026-09-27/report.md`）之后的第一次修正。那一轮没有任何结论过了预先登记的门槛：0.8.0 对不装 skill 赢 5 份输 1 份，但平均只高 0.17；落地页 0:3 输给不装 skill，工艺均分 3.7 在三组里最低，每份花费是不装 skill 的 2.2 倍。按套件自己的可证伪条件，要改的是套件。改动都是通用规则，不针对六份 brief。suite 契约不变。

### 变更（skill）

- `skills/design-studio/scripts/lint.mjs`：底线新增四类可机械发现的缺陷——`clipped-text`（被截断或省略号截断的文字）、`label-wrap`（按钮、标签、时间戳意外折行）、`--above-fold "<选择器>"`（首屏必须出现的元素，按视口测量，不在首屏即不通过）、`--platform ios|android|harmonyos|miniprogram` / `--touch`（触控目标低于平台下限即不通过：iOS 与小程序 44，Android 48，HarmonyOS 40（建议 48），数字归 `layout-and-spacing.md` 所有）；另加 `safe-area`（底部栏压在 Home 指示条区域）与 `straight-quotes`（展示文字里的直引号）两个提示。`templates/options-board.html` 的直引号一并改掉。
- `skills/design-studio/SKILL.md` 0.8.0 → **0.8.1**：按实测的阅读成本改写开工阅读清单——`quick` 只读本文件；`standard` 读本文件、一份学科文件和非 Web 目标的平台文件，其余按条件加载，评审细则交给评审子代理；不再列目录或一次 `cat` 多个参考文件。拔高并入唯一一轮修复批次（标准档不再画两个变体，只在深度档保留）；修复批次约八次工具调用、不重读参考；交付前复核笔记里每一条位置、尺寸、颜色说法。实测依据：0.8.0 的额外开销 31% 在开工阅读，59% 在评审之后无上限的修复循环；六次运行里拔高一次都没发生。
- `references/disciplines/marketing-sites.md`：首屏是测出来的，不是说出来的；契约列出每个视口必须在首屏的元素并用 `--above-fold` 检查；移动端保留每个功能项和常驻主操作。`templates/surface-contract.md` 的"首屏"加一行选择器清单。
- `references/process/redesign.md`：因用户已习惯而保留的颜色，必须在屏幕上配文字代码、标签或图例；"状态不只靠颜色"同样适用于类别。
- `references/disciplines/ai-experience.md`：运行在等用户决定时，决定区（做什么、多少、风险、批准/拒绝）是屏幕上的第一样东西，计划上下文放在它下面。
- `references/platforms/{ios,android,mini-programs,harmonyos}.md`：触控下限和底部安全区写成要运行的检查（`lint.mjs --platform <x>`）。
- `references/process/render-and-look.md` §9 与 `process/handoff.md`：交付前把笔记、理由、决策里的每条位置/尺寸/颜色说法对照最终渲染复核，被推翻的旧说法删除，不与更正并列。
- `skills/critique-design` 0.2.0 → **0.2.1**：`references/heuristics.md` 工艺节加排版引号与行内代码两条；`references/rubric.md` 底线 F4 写明触控平台上低于下限即不通过。

### 新增（评测）

- `evals/tools/run_round.sh`：输出评测的无头运行器（每次运行一个独立的 `claude -p --safe-mode` 进程，臂名可带样本后缀 `-s1…`），此前只存在于临时目录。

## [0.8.0] - 2026-09-27

架构反转：14 个 skill 收成 3 个，外加一个只在本仓库里用的维护 skill；整个仓库按"事实来源 → 生成物 → 机械闸门"重建。起因是 2026-09-27 对 0.7.0 做的一次全面审计，结论是"内容好，结构不对"：

- **路由会出错。** 子 skill 的描述互相重叠。implement-design 的描述里写着 UI polish，所以一句"整体 UI 优化"可能落到实现者那条不做重设计的路径上；handoff-design 和 implement-design 都认领"切图、标注"。
- **流程会被跳过。** 核心流程只写在入口 skill 里，子 skill 被直接触发时整段跳过。同一条规则在 3 到 13 个文件里重复。`full` 模式开工前至少要读五层文件。
- **闸门接受平庸。** 质量门槛是评分 ≥2，而 2 分的定义就是"能用但平庸"；流程里没有拔高这一步；找参考会退化成读 HTML 文字。
- **目录的数据结构到顶了。** 中文说明不在事实来源里；S 档占 21.8%，其中 13 条 agent 读不到；约 12 组同一产品被拆成多行。539 张缩略图里约 92 张（17%）是反爬页、空白页、半加载页或被弹窗盖住，另有 62 条没有缩略图。
- **证据层是一天的快照。** 停在 2026-09-21，带着已知错误；平台规范除微信外没有一手摘要。
- **套件从没被评测过**，仓库也没有 CI。

**契约变更**：模式名全部保留；新增产出 `.design/PRODUCT.md`、`.design/surfaces/<surface>.md`、`.design/critique/<date>-<target>/`（评审报告与精选证据截图，入库）；reference 路径全部改变；critique-design 的 `qa` 模式改名为 `acceptance`。迁移见文末"弃用与迁移"。

### 变更（skill）

- `skills/design-studio/SKILL.md` 0.7.0 → **0.8.0**：改写成 200 行以内的运行契约。
  - 模式不变：`full` `piece` `options` `inspire` `critique` `redesign` `handoff` `implement`。
  - 新增投入档位 `quick` / `standard` / `deep`，按范围选，并在设计判读里说明选了哪一档。
  - deep 走 12 步循环：看宿主 → 真相文件 → 采集参考与联系表 → 发散（找出品类的惯性 → 参照 → 带种子的随机抽取 → 每个方向一个隔离的子 agent → 方案板）→ 收敛 → 系统 → 按界面契约画 → 渲染与底线检查 → 在新上下文里独立评审 → 拔高（作为第二轮评审）→ 交付 → 复盘。
  - 验证有上限：一轮批量截图、一批修复、至多一轮确认；评审至多两轮，剩下的如实交代。
  - 迭代用语：`bolder` `quieter` `distill` `harden` `clarify` `typeset` `recompose` `colorize` `delight`。
  - 开工前只读本文件和所选模式的起始文件；学科与平台文件在第 2 步读，其余到用到的那一步再读。
- references 按四类重排。每份都带 `evidence` / `sources` / `reviewed` / `review_by` frontmatter，来源指向 `research/sources/`：
  - `process/`：真相文件、参考研究、方向、重设计（功能地图、结构轴、变更成本反向规则、平等性审计）、系统、token 格式（DTCG 2025.10，含 Resolver）、渲染与查看、交接、生图通道；
  - `disciplines/`：产品界面、数据密集界面（数据可视化只在这一处）、AI 体验、营销站点（按内容形态选页面原型，不再套固定的 SaaS 骨架）、动效与动效 token、图标与应用图标、品牌、平面；
  - `platforms/`：姿态表与跨平台清单，iOS / iPadOS / macOS 26–27（Liquid Glass）、Android 16 / Material 3 Expressive、HarmonyOS 5/6、小程序、桌面（Fluent 2、macOS）、Web（Baseline 能力表）、嵌入宿主（Office/WPS 加载项、浏览器扩展、IDE 面板、MCP Apps / Apps SDK 组件）；
  - `fundamentals/`：排版、中文排版（含 CJK 字体授权矩阵）、色彩、布局与间距、材质、现代 CSS、无障碍（WCAG 2.2 + 欧盟 / 美国 / 中国法规）、反"生成感"、授权、可移植样机；
  - `casebook.md`：单次事故的经验（症状 → 原因 → 检查），不再散落在规则里。
- `templates/` 新增：PRODUCT.md、brief、功能地图、decisions、界面契约、可用的方案板 `options-board.html`、方向卡、DESIGN.md、`tokens.css`、`tokens.resolver.json`、交接规格与 `handoff.json`、验收报告，以及画板、演示文稿、动效演示、图标表、品牌规范与品牌测试表。
- `scripts/`：
  - 新增 `capture.mjs` + `lib/capture-core.mjs`（Playwright；路由表、登录态复用、构建标记、同意弹窗移除；遇到反爬页、空白页、报错页时以非零码退出；出联系表）；
  - 新增 `lint.mjs`（渲染后页面的确定性底线检查）、`seed.py`（发散的种子抽取）、`catalog.py`（资源目录查询）、`text_to_path.py`（字标转路径）；
  - `color_tools.py` 修正并扩展：黄色等高明度种子的色阶、`--dark` 保留种子色、支持颜色名、`cvd` 色觉模拟、`matrix --from tokens.css`；
  - `shot.sh` 修正：`--help`、`--wait` 取值检查、同一页面不同状态的截图不再互相覆盖；拒绝被嵌入的站点在 500 px 以下的尺寸跳过，并以退出码 3 报告，不再静默输出一张"拒绝连接"截图。
- 样机套件 v2（`assets/mockup-kit/`）：当前平台外观，`kit.json` 记录尺寸来源；演示页按目标重新排版，并通过自己的对比度检查。
- `skills/critique-design/SKILL.md` 0.1.6 → **0.2.0**：
  - 两轨评审：先凭新鲜眼光判断，再看机械证据；
  - 严重度 × 证据等级；
  - 评分改为二元底线 + 1–5 天花板，每一级都有锚点；通过门槛为各项 ≥3，适配、层级、辨识度 ≥4；
  - 一份有序启发式清单（`references/heuristics.md`），自检、评审和打分共用；
  - `templates/critic-brief.md` 规定独立评审子 agent 拿到什么：brief、契约、截图清单，不给作者的推理；
  - 模式 `qa` 改名为 `acceptance`，新增 `fresh`（design-studio 第 9 步调用的独立评审）。
- `skills/implement-design/SKILL.md` 0.2.4 → **0.3.0**：触发收窄为"已有设计 / 交接包 / 样稿，要在某个技术栈里实现"，"UI 优化"、切图标注不再触发它；`references/stacks.md` 更新（Web Baseline 原语，Flutter / SwiftUI / Compose / ArkUI / 小程序映射）。
- `iterate-design-lab` 0.2.1 → **0.3.0**：移到 `.claude/skills/iterate-design-lab/`，只在本仓库里可用，`disable-model-invocation: true`，不随插件安装；按新的目录、证据层、评测和闸门重写各模式。
- 反馈：`references/feedback.md` 保留捕获与收尾复盘，改为静默、不阻塞，只在解析得到本仓库 inbox 时才写；13 份复制的 `## Feedback` 段删掉，三个 SKILL.md 各留两行指针。

### 变更（资源目录）

- `catalog/resources.jsonl` 改为 schema v2：
  - 中文说明 `zh` 迁进事实来源，每条必填；
  - `updated` 改为 `status`，新增 `sunset`（已停运但保留为历史）；
  - 新增 `region`、`also`（第二归属）、`entry_points`、`api`、`caveats`、`name_zh`、`zh_how`；
  - `kind` 换成一套干净的枚举；
  - `agent_access` 移出，改由机器观测提供。
- `catalog/taxonomy.json` 取代 `sections.json`：15 个域、83 个小节（原来 12 个域、71 个小节），新增数据可视化、AI 设计、无障碍三个域，每个域和小节都有中英标题与说明。
- 条目从 601 条到 **812 条**：新增 223 条经过实际访问核验的条目，10 条重复条目并入同一产品的主条目（改为其 `entry_points`），删除 2 条（已停办的 Codrops Collective，停更的 Awesome Design Tools），修订 414 条。S 档从 21.8% 降到 11.3%（92 条），每个域都不超过 15%。
- 机器观测和人工策展分开。`scripts/check-links.py` 只追加 `catalog/observed.jsonl`，不再改写 `resources.jsonl`。它能识别停放域名、软 404 和各家挑战页，不再把 Cloudflare 的被动脚本误判为拦截；请求按主机串行。2026-09-27 全量探测结果：static 628 条、js 121 条、blocked 60 条、unknown 3 条。
- `scripts/build-catalog.py` 把资源、分类、观测和缩略图清单合在一起，生成 `skills/design-studio/references/catalog/`（`catalog.jsonl` 投影 + 各域视图）、`docs/data/`（`catalog.json`、`catalog.js`、`thumbs.js`、`lab-catalog.js`、`llms.txt`）和首页、目录页的静态区块。它校验 S 档配额和 S 档的 agent 可达性。
- 缩略图 v2：
  - `scripts/shoot-catalog.mjs` 与 skill 的 `capture.mjs` 共用 `lib/capture-core.mjs`：就绪等待、同意弹窗移除、多信号反爬检测、浏览器内像素质检（灰度标准差、边缘密度、主色占比）、800×500 WebP 编码；
  - GitHub 仓库用社交卡；截图失败或质检不过时退到 og:image，再退到排字卡；逐条修正写在 `catalog/shot-overrides.json`；每次运行都复检已有文件；
  - 结果记在 `docs/assets/thumbs/manifest.json`：812 条全覆盖，807 张通过质检（756 张截图、38 张 GitHub 社交卡、13 张 og:image），5 条用排字卡；共 20.6 MB，平均每张约 25 KB；
  - 旧的 `docs/assets/shots/*.jpg`（539 张，27.7 MB）全部删除。

### 变更（研究）

- `research/` 取代 `analysis/`、`raw/docs/`、`raw/research/`、`.planning/` 和 design-studio 的 `source-map.md`：
  - `sources/`：40 份一手来源摘要，全部在 2026-09-27 读取。16 份按原 slug 迁入并重读，24 份新增（Apple Liquid Glass 的材质、栏与图标，Material 3 Expressive，HarmonyOS，Fluent 2，WCAG 2.2 与各地无障碍法规，Web Baseline 2026，DTCG 2025.10，DESIGN.md 0.4，Apps SDK，MCP Apps，A2UI，AI 标识法规，同类 skill，OOUX，变更厌恶，jlreq，CJK 字体授权）。新增的每份都由独立 agent 对照原文核对过，更正记在各文件里；
  - `topics/`：9 篇中文主题综合；
  - `field/`：本站自用记录（含审计更正）和匿名化的宿主复盘；
  - 另有 `log.md`、`backlog.md`、`README.md`；`INDEX.md` 由 `scripts/build-research-index.py` 生成。
- 更正旧分析里的已知错误：DTCG Resolver 自 2025-10-28 起是稳定版；APCA 不在 WCAG 3 草案里，WCAG 3 的对比度方法未定；Material 3 的标准方案与 Expressive 是两套弹簧方案。
- 旧文件都在 git 提交 `f5c0421` 里。

### 新增（评测）

- 新增 `evals/`：
  - 6 份固定 brief：中文运维后台、开发者工具落地页、iOS 26 界面、小程序列表、agent 审批流、旧应用重设计；
  - 三组对照：不装 skill、0.7.0、0.8.0；
  - 盲评协议（`judging.md`）、统一渲染（`render.mjs`）与测量工具（`tools/`）、结果格式（`results.schema.json`）；
  - 100 条中英触发测试（`triggers.jsonl`），其中 45 条是近似但不该触发的请求或负例，用代理方法跑（`run_triggers.md`）。
- 首轮输出评测与触发评测（代理）都在 2026-09-27 跑完，结果在 `evals/runs/2026-09-27/`（[报告](evals/runs/2026-09-27/report.md)、`results.json`），汇总在 `research/field/evals-2026-09-27.md`，`/skills/` 页的记分板和首页“校样”栏已更新。
  - **按事先定好的规则，这一轮不能说装了套件就更好。** 0.8.0 对不装 skill 赢 5 份、输 1 份，但平均总分只高 0.17（4.17 对 4.00），不到 0.5 的门槛；输掉的开发者工具落地页是 0:3。0.7.0 对不装 skill 输 4 份（3.94 对 4.00）。0.8.0 对 0.7.0 赢 4 份、输 2 份。
  - 0.8.0 工艺均分 3.7，三组最低；说明与渲染不符的条目最多（7 条）；每份花费约为不装 skill 的 2.2 倍。按套件自己的可证伪条件，要改的是套件，不是评测，改动清单见报告第 8 节。
  - 一格一个样本，评审与设计同为 claude-opus-5-5，评分只用了 3–5 分；这些都让结论偏弱。
  - 触发评测（代理）角色视图准确率 0.8.0 为 100%，0.7.0 为 99%（t041、t042 两条 UI 打磨冲突行被判给实现者）。0.8.0 的描述写在题目之后，只能当上限看。
  - `docs/assets/showcase/showcase.json` 新增可选字段 `triggers`，套件页在记分板下列出触发评测（代理）的结果；格式写在同目录 README。

### 变更（站点）

- `docs/` 重做：
  - 首页：一句话说清是什么、真实产物、插件安装命令、按域排的资源字架；
  - 资源目录工作台：加权搜索（含中文二元组）、分面计数、详情抽屉、键盘操作、URL 状态、无 JS 时的静态列表；
  - 套件页：路线图、三个 skill、产出目录、评测记分板、真实产物、安装与升级。
  - 站点的视觉方向按套件自己的流程选定：方向板 → 盲评 → 独立评审，产物在 `docs/assets/showcase/2026-09-27-site/`。
- 原来的十六种方向页整体移到 `docs/lab/`，数据改由构建生成，缩略图换成新图。旧链接继续可用：`/?style=<id>` 跳到 `/lab/?style=<id>`，`/?q=` 等旧目录链接跳到 `/catalog/`。
- 页面上的目录数字全部由构建写入，不再手写。
- README 头图 `docs/assets/styles.jpg` 换成新站点的截图。

### 变更（基础设施）

- `scripts/check-lab-invariants.sh` 改为 `scripts/gates.py` 的薄入口。只用标准库，不联网，几秒跑完。九道闸门：
  - G1 资源目录与生成物
  - G2 缩略图清单覆盖全部条目
  - G3 来源头部与 INDEX
  - G4 skill frontmatter、行数预算、reference frontmatter、链接与路径；发布的 skill 里不得再出现已删除的 skill 名
  - G5 反馈条目
  - G6 触发测试集
  - G7 版本一致（SKILL.md、README、CHANGELOG、插件清单）
  - G8 `docs/` 不手写目录数字、链接可达
  - G9 不跟踪杂散文件
- `scripts/smoke-site.mjs`（`npm run smoke`）检查：
  - 控制台无报错，axe 无严重问题；
  - 390 宽和 320 宽都没有横向溢出；
  - 图片和链接都可达；
  - 搜索黄金用例、首页体积预算（图片之外 ≤150 KB）；
  - 旧链接跳转，生成区块与数据一致。
- `.github/workflows/check.yml`：每次 push 和 PR 先跑闸门，再用 Playwright 自带的 Chromium 跑站点冒烟测试。
- `package.json` 固定 Playwright 与 axe-core 的版本，只给本仓库的截图和冒烟测试用，skill 脚本不需要它。`node_modules/` 不入库。
- 插件安装：新增 `.claude-plugin/plugin.json` 与 `marketplace.json`，仓库根即插件根，`skills/` 自动发现：

  ```text
  /plugin marketplace add caocong1/design-skill-lab
  /plugin install design-skill-lab@design-skill-lab
  ```

- `scripts/evolve.sh` 修复：按绝对路径找 agent；工作区不干净就拒绝运行；自己建 `evolve/<日期>` 分支并提交；无人值守时只写提案和 Tier A 修正；加了工具白名单和超时；日志只写一处；支持 `--dry-run`。
- `scripts/collect-feedback.py` 校验 `project` 是描述宿主形态的通用标签；报告内容没变时不重写。反馈档案里的宿主项目名已匿名化。

### 弃用与迁移

以下 skill 已删除，内容并入 design-studio。路径相对 `skills/design-studio/`：

| 旧 skill | 现在在哪 |
| --- | --- |
| `explore-design-directions` | `references/process/directions.md`、`templates/options-board.html`、`templates/direction-card.md`；brief 部分在 `references/process/truth-files.md` |
| `find-design-inspiration` | `references/process/research.md`、`scripts/capture.mjs`、`scripts/catalog.py` |
| `design-product-ui` | `references/disciplines/product-ui.md`、`references/disciplines/data-dense-ui.md`、`references/disciplines/ai-experience.md`；`references/platforms/*`；`references/fundamentals/portable-mockups.md`；`assets/mockup-kit/` |
| `design-marketing-sites` | `references/disciplines/marketing-sites.md` |
| `build-design-system` | `references/process/system.md`、`references/process/token-formats.md`、`templates/DESIGN.md`、`templates/tokens.css`、`templates/tokens.resolver.json` |
| `design-motion` | `references/disciplines/motion.md`、`references/disciplines/motion-tokens.md`、`templates/motion-demo.html` |
| `design-icons` | `references/disciplines/icons.md`、`references/disciplines/app-icons.md`、`templates/icon-sheet.html` |
| `design-brand-identity` | `references/disciplines/brand.md`、`templates/brand-guidelines.md`、`templates/brand-test-sheet.html` |
| `design-graphics` | `references/disciplines/graphics.md`、`templates/artboard.html`、`templates/deck.html` |
| `handoff-design` | `references/process/handoff.md`、`templates/handoff-spec.md`、`templates/handoff.json`、`templates/acceptance-report.md` |
| `iterate-design-lab` | 移到仓库内的 `.claude/skills/iterate-design-lab/`，不随插件安装 |

其他改名：

| 旧 | 新 |
| --- | --- |
| critique-design 模式 `qa` | `acceptance` |
| `design-studio/references/typography.md`、`color.md`、`layout-and-spacing.md`、`anti-slop.md`、`licensing.md`、`portable-mockups.md` | `references/fundamentals/` 下同名文件 |
| `design-studio/references/render-and-look.md` | `references/process/render-and-look.md` |
| `design-studio/references/quality-rubric.md` | `skills/critique-design/references/rubric.md` |
| `design-studio/references/resource-map.md`、`resources/<domain>.md` | `references/catalog/`（生成物）+ `scripts/catalog.py` |
| `design-studio/references/source-map.md` | 各 reference 的 frontmatter + `research/INDEX.md` |
| `catalog/sections.json` | `catalog/taxonomy.json` |
| `docs/catalog-zh.js` | `catalog/resources.jsonl` 的 `zh` 字段 |

按符号链接安装过的：design-studio、critique-design、implement-design 的链接 `git pull` 后仍然有效，不用重链。被删掉的 10 个 skill 和移走的 `iterate-design-lab` 会留下失效链接，用下面的命令清掉。它只删这两个目录里指向不存在目标的符号链接，不碰有效链接和真实目录；其中一个目录不存在时 `find` 会报一行错，可以忽略。想先看清单，去掉 `-delete` 运行一次。

```bash
find ~/.claude/skills ~/.codex/skills -maxdepth 1 -type l ! -exec test -e {} \; -print -delete
```

插件安装的用户不受影响，装上的就是三个新 skill。

旧的站点链接仍然有效：`https://caocong1.github.io/design-skill-lab/?style=<id>` 会跳到实验页 `/lab/?style=<id>`，带 `q`、`domain`、`section`、`tier`、`id` 参数的旧目录链接跳到 `/catalog/`（参数原样保留）。

## [0.7.0] - 2026-09-24

主人纠正：两个宿主项目的整体 UI 优化都只打磨细节、结构不动，多主题只换配色。根因在 skill：方向的差异轴全是视觉轴；redesign 先看旧界面再出方向；"保留有效部分""现有系统是约束"等措辞把 agent 推向保守。本版把 redesign 改为从功能出发重新设计。**契约变更**：redesign 模式的流水线与交付物调整，新增产出 `.design/function-map.md`。

### 变更（skill）

- `skills/design-studio/SKILL.md` 0.6.1 → **0.7.0**：redesign = 功能拆解 -> 脱离旧界面出方向 -> 评审与资产盘点 -> 收敛 -> 系统 -> 迁移；"整体 UI 优化 / 全站优化 / 重新设计"默认按 redesign，细节修复是所有方向的共享基线；基线第一步写明 redesign 质疑页面结构、导航、容器和数据呈现；删去 0.6.0 的"保守重设计可省灵感步骤"；产出目录加 `function-map.md`。
- `skills/explore-design-directions/SKILL.md` 0.2.4 → **0.3.0**：新增 1b 功能拆解；四条结构轴（导航模式、任务容器、数据呈现、流程形态），产品界面至少选两条；redesign 至少两个重构方向，可以是完全不同的页面组织，精修最多一个；对比表首行改为"主要任务的操作成本"；多主题可结构化，但只在声明的变体点上切换，共用一套数据与状态层。
- `skills/build-design-system/SKILL.md` 0.1.4 → **0.2.0**：新增 Theme Families——主题是个性不是色相；全局 -> 族结构 -> 族 x 明暗颜色三层 token，按属性限定作用域；`:root` 上 `var()` 派生的 token 不随嵌套作用域变化。
- `skills/critique-design/SKILL.md` 0.1.5 → **0.1.6**：redesign-brief 也评结构；资产指用户依赖的东西，不是当前布局。
- `skills/design-product-ui/SKILL.md` 0.3.0 → **0.3.1**：redesign 时"先建模"就是功能拆解，且先于研究旧界面。
- `skills/design-studio/references/render-and-look.md`：工具梯级加"登录应用"截图做法（保存登录态，线上后端 + 本地前端）；截图陷阱加"每张截图带构建标记"。

## [0.6.1] - 2026-09-24

修反馈写入路径。suite 契约不变。

### 修复（skill）

- `skills/design-studio/references/feedback.md`：定位本仓库根目录的命令少上跳一级（`SKILL.md` 在根目录下两层），解析到的是 `skills/` 而不是仓库根，写入 `feedback/inbox/` 会失败。改为 `../..`，并加一行 `test -d` 确认 inbox 存在。本地路径使用与符号链接安装两种方式已实测。0.5.0 起就存在；首个宿主项目的 agent 没走到写入这一步，所以当时没暴露。
- `skills/design-studio/SKILL.md` 0.6.0 → **0.6.1**。

## [0.6.0] - 2026-09-24

第一次 evolve：从第一个宿主项目（一个带 Office/WPS 加载项的 Web 业务系统，完整 UI 优化一轮）补录 11 条反馈，应用 8 条，2 条进提案，1 条已在 0.5.1 修复。处置明细见 `feedback/log.md`。suite 契约新增一条澄清：宿主已有设计系统时以它为准。

### 变更（skill）

- `skills/design-studio/SKILL.md` 0.5.1 → **0.6.0**：Output Location 写明宿主已有 `DESIGN.md` / token 文件时原地更新、不另建 `.design/system/`；同一 agent 实现时 handoff 缩减为验收截图清单；保守的重设计可省灵感步骤。
- `skills/design-studio/references/render-and-look.md`：扫运行中应用时的截图陷阱——断言落地 URL 或就绪元素、前后同一环境、记录视口与倍率、尺寸取自 brief。
- `skills/design-product-ui/SKILL.md` 0.2.2 → **0.3.0**：`references/platforms.md` 新增"嵌入宿主的窗格"（Office/WPS 加载项、扩展侧栏、IDE 面板）；`references/data-dense-ui.md` 写明高密度界面字号下限；路由与描述同步。
- `skills/implement-design/SKILL.md` 0.2.3 → **0.2.4**：P0/P1 问题必须重拍证据截图后才算修复；全局控件样式被局部简写属性冲掉的反模式。
- `skills/critique-design/SKILL.md` 0.1.4 → **0.1.5**：独立评审要给截图清单而不是目录通配；已发出的建议不事后改写。
- `skills/build-design-system/SKILL.md` 0.1.3 → **0.1.4**：大量写死颜色时认可两阶段迁移（先机械迁到色阶类，再逐区换语义名），写明色阶重映射主题的局限。
- `skills/explore-design-directions/SKILL.md` 0.2.3 → **0.2.4**：落选方向做成可切换主题时，说明主题保留了什么，否则标为配色变体。

## [0.5.1] - 2026-09-24

修反馈捕获。0.5.0 上线后第一个宿主项目完整跑了一轮 UI 优化，agent 多次读到各 skill 末尾的 `## Feedback` 段，却一条都没记。原因有三：规则只说"遇到就记"，靠 agent 在任务中途自觉；有意偏离指引（并已写进宿主 `decisions.md`）不在触发条件里；完成定义里没有这一项。suite 契约不变。

### 变更（skill）

- `skills/design-studio/references/feedback.md`：新增**收尾复盘**（必做）——三问：被纠正 / 偏离或绕开了指引 / skill 缺失或出错，每个"是"记一条；最终回复以 `Skill feedback: N entries` 或 `none` 结尾。有意偏离按 `missing` / `friction` 记。明确按本地路径使用时同样写回本仓库，且写入本仓库 inbox 是预期行为。
- `skills/design-studio/SKILL.md` 0.5.0 → **0.5.1**：基线流程加第 10 步"复盘再收尾"，Definition of Done 加一条。
- 其余 12 个设计 skill 的 `## Feedback` 段改为"收尾复盘是完成的一部分"，各 PATCH 升一位。
- `skills/iterate-design-lab/SKILL.md` 0.2.0 → **0.2.1**：evolve 模式加第 0 步"补录"——主人指定宿主项目时，从其 `decisions.md`、评审、本轮提交和会话记录提炼条目，先给主人过目。

### 修复（文档）

- `feedback/README.md`：propose-only 开关的名字写错（应为 `PROPOSE_ONLY=1`）；补"补录"用法与收尾复盘说明。

## [0.5.0] - 2026-09-23

新增**使用反馈与自我迭代闭环**：套件在各个项目里被使用时，agent 把遇到的纠正、缺陷、别扭、能力缺口和偏好按统一格式写回本仓库 `feedback/inbox/`；`scripts/collect-feedback.py` 聚合成 `feedback/report.md`；`iterate-design-lab` 新增 `evolve` 模式按 Tier A/B/C 分流消化——措辞与事实修正直接应用，结构性改动进入 `feedback/proposals.md` 等主人确认。`scripts/evolve.sh` 可挂 launchd 每周自动跑一轮。闭环说明见 `feedback/README.md`。

### 新增

- `skills/design-studio/references/feedback.md`：反馈捕获协议（何时记、写到哪、条目格式），全部设计 skill 共享。
- `feedback/`：`README.md`（闭环说明）、`TEMPLATE.md`（条目模板）、`inbox/`、`archive/`、`proposals.md`（待确认提案）、`log.md`（处置日志，只追加）。
- `scripts/collect-feedback.py`：校验、聚合、加权排序、生成报告；支持 `--check` / `--archive` / `--import`（从宿主项目收回 `.design/skill-feedback/`）。
- `scripts/evolve.sh` + `scripts/com.design-skill-lab.evolve.plist`：无头自动迭代入口与 launchd 周任务示例。

### 变更（skill）

- 全部 12 个设计 skill 末尾新增 `## Feedback` 段，指向捕获协议；各 PATCH 升一位。
- `skills/iterate-design-lab/SKILL.md` 0.1.2 → **0.2.0**：新增 `evolve` 模式与分级自动应用策略（Tier A 直接改、Tier B 改完标记、Tier C 仅提案）。
- `skills/design-studio/SKILL.md` 0.4.4 → **0.5.0**（suite 版本）。

## [0.4.4] - 2026-09-23

把实验室页面从创建到三轮修改的过程收成 skill 里的规则。过程记在 `analysis/12-dogfooding-the-lab-page.md`（1.2）。suite 契约不变。0.4.3 只修了页面、没有改 suite 版本，所以这一条从 0.4.2 计到 0.4.4。

### 变更（skill）

- `skills/design-studio/references/render-and-look.md`：看图时要核对末行是否被滚动条切掉、切换变体后是否在页顶、画布截图是否其实是空白；截图的文字转述不能代替测量。
- `skills/design-studio/references/typography.md`：托管字体放在系统栈之前，CDN 失败时回到上一版渲染；CJK 只下用到的区段；单字重面关闭 `font-synthesis-weight`。
- `skills/explore-design-directions/SKILL.md` 0.2.0 → **0.2.1**：同一份内容可以换成另一种器具单独挂载；切换方向回到页顶；不要把方向数量写死成十。
- `skills/design-motion/SKILL.md` 0.1.1 → **0.1.2**：沿路径运动用 `offset-path`，第一帧就在线上；换整页视图时重置滚动，并在 View Transitions 的 `finished` 里再钉一次。
- `skills/design-graphics/SKILL.md` 0.1.0 → **0.1.1**：线上的标记对齐名称、线路盖住标记全身、标记画在笔画之上，横向滚动条不切最后一行。
- `skills/implement-design/SKILL.md` 0.2.0 → **0.2.1**：四条稿面正确时仍然会发生的布局陷阱（溢出轴联动、粘性表头的包含块、行透明度淡掉线路、换视图不重置滚动）。
- `skills/critique-design/SKILL.md` 0.1.1 → **0.1.2**：先滚到中段再切换，确认新视图从顶开始；图上的点要和笔画、和标签第一行比较。
- `skills/iterate-design-lab/SKILL.md` 0.1.1 → **0.1.2**：页面修复要等 `main` 的 `/docs` 对应的 Pages 构建变成 `built` 才算完成。

## [0.4.3] - 2026-09-23

页面修复。suite 契约没有变。

### 修复（页面）

- **线路图的车站被线路挡住**：总览里车站改画在全部线路之上，图下方留出横向滚动条的高度，最底下一行不再被滚动条切掉。竖向路线的站标改对齐站名（原先取整行中点，点掉在说明文字中间，看起来在线下面），线路盖住首尾站标的全身。列车改走 CSS `offset-path`，不再在动画开始前堆在图的原点。
- **切换风格时滚动条停在中段**：换方向现在回到页顶。终端、小岛这类锁住页面滚动的方向不会把上一个方向的滚动位置带出来。

## [0.4.2] - 2026-09-22

由线上页面的两个 bug 报告触发，顺带把页面从十个方向扩到十六个，并改用公用在线字体。过程与教训补记在 `analysis/12-dogfooding-the-lab-page.md`（1.1）。

### 修复（页面）

- **贴纸风格的砸入动画"播两遍"**：`st-slam` 关键帧的 100% 一帧没写 `opacity`，浏览器把它插值回等待态 `.st-await` 的 `opacity: 0`——贴纸落地、消失、再被脚本摘掉类名后重新出现，看起来就是重复播放。每一帧现在都写全属性，`animation-fill-mode: both`。同时修掉两处同源的小毛病：关键帧在 `transform` 里旋转、元素又设了 `rotate` 属性，落地角度是两倍再猛地弹回；hover 抖动会顶掉正在进行的砸入并让它从头重播。用 rAF 逐帧记录不透明度定位到根因（先前只数 `animationstart` 次数看不出来：动画确实只播了一次）。
- **贴纸风格的中文字形、粗细、基线不一致**——不是刻意效果。圆体字体栈把日文圆体 `Hiragino Maru Gothic ProN` 放在所有中文字体前面：它接管了大部分汉字（日文字形、单一字重被合成加粗），只把它没有的简体字（设、认、这……）漏给下一款字体。中文圆体（`Yuanti SC` / `YouYuan`）现在紧跟拉丁圆体之后，日文字体移出栈。

### 新增（页面）

- **五个新方向**（`docs/styles/` 下各一对 `.css` + `.js`）：`11 后台 Admin Panel`（导航树、面包屑、KPI、筛选表单、可排序可翻页的数据表、状态标签——按 brief 要求做"熟悉的东西"，并把它做好）；`12 画板 Design Canvas`（深色工具栏、图层面板、点阵画布与标尺、画框标签、选框把手与尺寸标注、属性检查器、CSS `zoom` 缩放）；`13 对话 Agent Chat`（会话列表即风格入口，资源成为回答里的引注 [n]，底部输入框即搜索，首条问候流式打字）；`14 字样 Type Specimen`（十二个域各用一种系统字体气质，`typography.md` 那张"按气质选字体栈"的表变成页面；样字带度量线并轮换字体）；`15 线路图 Metro Map`（SVG 线路图从"目录"枢纽扇出，小节是车站，S 首选是换乘站，SMIL 列车沿线行驶）。
- 外壳支持十个以上方向：数字键仍只绑前十个，`[` `]` 前后切换；此前打印 `num % 10` 的入口（色卡、贴纸、终端）改为超过十时打印完整编号。
- 五个新方向全部经渲染查看（1280 与 390 宽，域视图与搜索态），所有文字/背景对经 `color_tools.py` 计算 ≥ 4.5:1（初稿有五对不达标，已改色）。全部方向（最终十六个）在同一脚本下逐个挂载、进域、搜索、按 `]` 轮换，无脚本错误。
- **公用在线字体**（用户要求以在线字体替代系统字体）：`content.js` 声明字体包，外壳挂载前注入 `<link>`。全部走 jsDelivr 上的 npm 包——中文用中文网字计划的分包字体（猫啃珠圆体、猫啃糖圆体、思源宋体可变、霞鹜文楷、得意黑，只下载页面用到的 unicode 区段），拉丁用 fontsource（Inter、Archivo、Source Sans 3、Roboto Condensed、Barlow Condensed、Nunito、Playfair Display、EB Garamond、Libre Baskerville、Courier Prime、JetBrains Mono、Jost），全部 OFL。字体栈把 CDN 字体放在最前、系统栈留在后面：CDN 不可达时落回此前的渲染，页面不会因此不可用。后台、画板、对话、素页保持原生系统字体（那是它们的观点）。贴纸配 `font-synthesis-weight: none`，单字重的中文圆体不再被合成加粗。
- **第十六个方向：小岛 Cute Island**——WebGPU 从零写的可爱低多边形 3D 小游戏（WGSL、实例化绘制、三段卡通光照、轮廓光、雾、水波与树的摆动、4× MSAA，没有引擎）。十二座彩色小屋是十二个域，玩家是一颗会蹦的圆球，靠近按 E 进屋，目录在游戏 HUD 面板里翻；屋顶的星星数是 S 首选数。标签是每帧投影定位的 HTML；键盘、触屏方向键、点标签传送都能用。没有 WebGPU（或设备丢失）时退化成 2D 小岛地图，内容照样能用。为了让无头浏览器也能"渲染并查看"（它截不到 WebGPU 画布），模块带一个离屏渲染并回读像素的 `snapshot()`，外壳暴露 `DSL.module(id)` 给脚本。它算不算套件的范围：算——套件本来就要做游戏 HUD、3D 素材与沉浸式界面的美术指导、HUD 与动效；引擎代码是实现，这一页恰好自己实现了。

### 变更（skill）

- `skills/design-studio/SKILL.md` 0.4.1 → **0.4.2**（suite 版本；变化在共享 reference）。
- `skills/design-studio/references/typography.md`：圆体一行去掉 `Hiragino Maru Gothic ProN`；新增"日文字体排在中文伴随字体之前"的陷阱说明——按字符回落意味着任何带 CJK 覆盖的日文字体都会接管它有的汉字，只漏出简体独有字。
- `skills/design-motion/SKILL.md` 0.1.0 → **0.1.1**：反模式新增三条——关键帧末帧漏写属性会插值回底层值（入场像播两遍）；`transform` 里旋转与 `rotate` 属性叠加；第二个动画类顶掉正在进行的入场动画。

### 已知未做

- 新方向仍由作者自评；线路图的站名只在悬停时显示，靠下方线路表补足；小岛的 3D 场景只在 Linux 无头 Chrome（lavapipe）上离屏回读看过，真机 GPU 与 Safari 26 未验证；在线字体依赖 jsDelivr 可达。

## [0.4.1] - 2026-09-21

### 修复

- `skills/design-studio/scripts/shot.sh`：未知的 `--选项` 现在直接报错并打印用法。此前它会被当成输出目录，随后的数字参数又覆盖它，结果在当前目录下悄悄建出 `1280/`、`390/` 这样的文件夹——核验线上页面时我自己踩到了。`skills/design-studio/SKILL.md` 0.4.0 → **0.4.1**。

### 发布核验

- GitHub Pages 已从 `main` 分支的 `/docs` 发布；全部 14 个资源返回 200；对线上地址渲染查看了"控制台"（1280 宽，带 `?domain=motion` 深链）与"书目"（390 宽）。
- `LICENSE` 保持纯 MIT 文本后，GitHub 的许可识别从 NOASSERTION 变为 MIT。

## [0.4.0] - 2026-09-21

套件**第一次用在真实任务上**：给本仓库自己做页面。用户的要求是配好 LICENSE、写清楚 README、完善 Pages，并用套件自己的方法设计一个可切换至少九种风格的页面。过程、看图抓到的问题、套件缺了什么，记录在 `analysis/12-dogfooding-the-lab-page.md`。

### 新增

- **`LICENSE`**：MIT。理由：仓库的主体是要被复制进别人 skill 目录里使用的 Markdown 指令与几个小脚本，MIT 最短、最被广泛理解、与几乎所有项目兼容；没有需要 Apache-2.0 专利条款保护的东西；用 CC 系列许可会让附带的脚本处于尴尬位置。另附 `NOTICE` 写明范围与第三方材料（`LICENSE` 保持纯 MIT 文本，否则 GitHub 识别不出许可类型，会显示 NOASSERTION）：只覆盖原创内容；目录里的站点名称与商标归各自所有者；`raw/docs/` 下的摘要是学习笔记而非原文再分发，其中 `raw/docs/shape-of-ai.md` 的原文为 CC BY-NC-SA，已在摘要头部写明。
- **在线页面（十种设计方向）**：`docs/index.html` + `docs/app.js` + `docs/base.css` + `docs/styles/` 下九个风格文件。同一份内容、同一套 DOM，十个方向（色卡、瑞士、书目、终端、蓝图、卡片柜、展签、控制台、贴纸、素页）在字体气质、色彩策略、版式语法、密度、形状、层次六条轴上拉开，而不是换配色；每个方向在页眉带一张说明卡（概念、各轴取值、会在哪里失败）。风格在首次绘制前应用，保存在地址栏与 localStorage，数字键 1–0 切换，切换使用 View Transitions 并尊重"减少动态效果"。**只用系统字体**，离线与字体 CDN 不可用的网络下都能正常显示。十种风格全部经渲染查看，所有文字/背景对经 `color_tools.py` 计算均 ≥ 4.5:1。
- `docs/.nojekyll` 与 `docs/assets/styles.jpg`（十种风格的缩略图拼版，README 使用）；GitHub Pages 从 `main` 分支的 `/docs` 目录发布。
- `analysis/12-dogfooding-the-lab-page.md`（1.0）。

### 变更（skill）

- `skills/design-studio/SKILL.md` 0.3.0 → **0.4.0**（suite 版本；入口 skill 正文未变，变化在共享 reference）。
- `skills/explore-design-directions/SKILL.md` 0.1.0 → **0.2.0**：方案板新增"页面即方案板"（交付物本身是页面时，同一 DOM + 实时切换器，各方向在自己的作用域里重写 token 并重排布局；需要不同标记的方向其实是在要不同的内容）；新增**缩略图测试**（缩到约 600 px 并排看，分不清的两个就是同一个方向）；方向卡必须写"会在哪里失败"。
- `skills/design-studio/references/typography.md`：新增 `System Font Stacks by Voice`——十一种字体气质的系统字体栈与中文搭配；系统字体栈是一个有气质的选择，不是降级。
- `skills/design-studio/references/render-and-look.md`：Known traps 增加"半透明的固定浮层会把底下的控件透成幽灵按钮"。
- `skills/design-studio/references/source-map.md`：登记 `analysis/12-dogfooding-the-lab-page.md`；`typography.md` 的证据等级注明系统字体栈只在 macOS 上渲染查看过。

### 文档

- `README.md` 重写：英文摘要、在线页面链接与十种风格拼版图、30 秒安装、角色边界、skill 表、目录字段、仓库结构、脚本、非目标、已知局限、许可说明、维护清单。

### 已知未做

- 十种风格的自评由作者本人完成，没有独立的新眼光评审；字体只在 macOS 上看过，Windows / Android / Linux 下的回落字形未验证。
- 没有可用性验证：哪种风格真的更好找东西，没有数据。

## [0.3.0] - 2026-09-21

一次**方向修正**，由用户的两句话触发。第一句是质问：你的核心是设计，像 UI/UX 屏幕设计师那样出设计图，为什么会被前端技术局限——这些按理说是 coding agent 的事。第二句是补充：HTML / CSS 本来就是很多前端共通的语法，设计出 Web 形态的界面，agent 有能力把它转成对应的前端页面；更准确的语言特性指导只是锦上添花。

根因记录在 `analysis/11-distilled-skill-design.md`（1.1）：我把画图的媒介当成了设计的目标平台，把设计师的活滑成了实现者的活，并继承了同类项目"设计 = 生成前端代码"的框架。当时正在做的 Flutter golden test 脚手架已作废，未进入仓库。

### 新增

- **`skills/handoff-design/SKILL.md`**（0.1.0）：设计 → 开发的交接契约。交付验收图（按目标的逻辑尺寸、每个屏幕 × 状态 × 目标 × 主题一张）、可移植的 HTML/CSS 样稿、token、带全部状态的规格、切图清单、动效规格、平台注意事项与验收标准；之后**只凭截图**验收实现，并把偏差分为实现缺陷、规格缺口、平台差异三类。它刻意不包含任何目标技术栈的写法。
- **`skills/design-studio/references/portable-mockups.md`**：HTML/CSS 作为各目标通用的设计语言。哪些随目标变、哪些不变；**按目标的逻辑尺寸作画，单位一一对应**（1 CSS px = 1 pt = 1 dp = 1 vp = 1 个 Flutter 逻辑像素；375 宽小程序里 = 2 rpx）；可移植子集（flex 布局、一切取值 token 化、组件与状态在标记里具名、固定栏放在滚动区之外、哪些 CSS 写法会让实现者只能猜）；样稿概念到 Flutter / SwiftUI / Compose / ArkUI / 小程序的映射表；需要如实说明的保真度边界。
- **样机套件** `skills/design-product-ui/assets/mockup-kit/kit.css` 与示例 `skills/design-product-ui/assets/mockup-kit/demo.html`：iOS、Android（Material 3）、HarmonyOS、微信小程序（含胶囊与避让区标注）的设备框与系统栏结构，macOS / Windows 桌面窗口，固定画布等比缩放的数据大屏。边框画在盒子之外，屏幕保持精确的逻辑尺寸。示例用同一套 token 把一个"设备巡检"设计分别排进五个目标，经渲染查看；过程中抓到并修掉两个真实问题（中文状态标签因 `<i>` 被渲染成伪斜体；`font` 简写里用 `inherit` 作字体族导致整条声明失效）。

### 变更（skill）

- `skills/design-studio/SKILL.md` 0.2.0 → **0.3.0**：新增 `## Role and Medium`（套件是设计师；媒介永远是 HTML/CSS/SVG；目标平台只改变画框、惯例与约束；技术栈知识是优化项）；路由表加入 `handoff-design` 与 `portable-mockups.md`，`implement-design` 标注为"给实现者"；新增 `handoff` 模式，`full` 流水线以交接包收尾，`implement` 先交接再实现；核心规则改为"媒介是标记语言，眼睛是截图，目标可以是任何平台"，并新增"设计与实现是两份工作，不要滑进实现者的构建与测试问题"；产出目录加入 `handoff/<feature>/`。
- `skills/design-product-ui/SKILL.md` 0.1.0 → **0.2.0**：工作流第 0 步"点名目标"（平台与逻辑尺寸；用什么技术栈实现与作画无关）；产出改为"画在目标画框里、用可移植子集写、按目标 / 主题 / 状态出 PNG，多目标并排"；反模式加入"把非 Web 目标当成够不着"与"把重画的系统栏当自绘组件交出去"。
- `skills/implement-design/SKILL.md` 0.1.0 → **0.2.0**：重新定位为**实现者指南**；原"交接文档"一节移交给 `handoff-design`，换成"把样稿翻译到非 Web 技术栈"的五步；截图由实现者自己想办法产出。`references/stacks.md` 开头注明这些内容不是设计的前提。
- `skills/critique-design/SKILL.md` 0.1.0 → **0.1.1**：`qa` 模式接受任意来源的实现截图（浏览器、模拟器、真机、golden test、用户贴图），偏差三分类。
- `skills/design-studio/references/render-and-look.md`：拆成"看设计稿"（任何目标都只需要浏览器）与"验收实现"（只需要截图，怎么来是实现者的事）；设计用的工具阶梯里去掉了原生技术栈。
- `skills/design-product-ui/references/platforms.md`：说明这些惯例塑造的是**图**，平台怎么写代码不构成设计的限制。
- `skills/iterate-design-lab/SKILL.md` 0.1.0 → **0.1.1**：Perishable Register 加入 `portable-mockups.md` 与样机套件（画框尺寸与栏高会随设备和系统变化）。

### 文档与工具

- `README.md`：开头写明"套件的角色是设计师，不是前端工程师"；skill 表加入 `handoff-design`；非目标加入"不负责在目标技术栈里实现与测试"；加了一个 Flutter 目标的使用示例。
- `docs/index.html`：套件导览加入 `handoff-design` 与角色说明。
- `scripts/check-lab-invariants.sh`：skill 内的 `assets/` 路径与 `.css` / `.html` 引用也纳入存在性检查。
- `analysis/11-distilled-skill-design.md` 1.0 → **1.1**：补记第 6 条自我违反与"角色边界"一节。

### 已知局限

样机框里的系统栏是结构示意而不是官方 UI kit；HarmonyOS 的画框与栏高为近似值（已在文件内标注），小程序胶囊为 iOS 上的典型值（运行时应读取真实矩形）。Windows 窗口样式未单独渲染查看。

## [0.2.0] - 2026-09-21

由用户的一个追问和两个新站点触发：用户问"taste-skill 和 UI UX Pro Max 学了，那 Claude 的 frontend design skill 学过吗"，并补充了 v0.app 与 impeccable.cn。

### 新增

- **资源目录** 新增 2 条（共 601 条）：`v0`（Vercel 的提示词到应用生成器，含设计模式、设计系统与社区模板库）与 `impeccable-cn`（Impeccable 中文站），均标记 `origin: user-2026-09-21`。同时更新 `impeccable`（指向 `/slop` 规则目录与 `npx impeccable detect`）、`anthropic-frontend-design`、`anthropic-frontend-blog` 三条。
- **一手摘要** `raw/docs/impeccable-slop-rules.md`：约 46 条反模式规则分八类，逐条标注检测方式（CLI / 浏览器 / 仅 LLM / 可选），区分"AI 痕迹"与"基本质量"，含 2022 对 2026 的年代对照。
- `raw/docs/anthropic-frontend-design-skill.md` 补入配套文章（发布 2025-11-12，本次抓到全文）：分布收敛机制、四个可提示的轴、约 400 token 的审美提示、`web-artifacts-builder`。

### 变更（skill）

- `skills/design-studio/SKILL.md` 0.1.0 → **0.2.0**（其 references 发生了指导性变化）：
  - `references/anti-slop.md`：新增第三份带日期的清单（来自 Impeccable 的确定性检测规则）、"Cures decay too"一段（2025-11 被推荐的解药——Space Grotesk 一类"有特色的字体"、衬线、氛围渐变背景、错峰入场——在 2026 年逐条成为被检测的痕迹，因此只推荐**选择的方法**，不推荐具体答案），以及 `Mechanical Help` 一节。
  - `references/typography.md`：相邻字号层级约 1.25 倍；字体栈示例里的具体字体名改为占位符。
  - `references/layout-and-spacing.md`：卡片圆角约 8–16 px、粗强调边与大圆角二选一；带边框或底色的容器内文字至少 8 px（通常 12–16 px）内边距，正文不贴视口边缘。
  - `references/source-map.md`：登记新摘要与上游链接。
- `skills/build-design-system/SKILL.md` 0.1.0 → **0.1.1**：`references/token-formats.md` 的 DTCG 与 DESIGN.md 示例不再写具体字体名，避免示例被照抄成新的默认。

### 分析

- `analysis/02-ai-design-skills-survey.md` 1.0 → **1.1**：新增"解药也会过期"一节（三份带日期材料排成的时间线）、v0 的定位、如实记录的各项目阅读深度（Anthropic 的 skill 是读得最完整的一个），以及 impeccable.cn 与官方仓库的关系。
- `analysis/SOURCE_INDEX.md`：Anthropic 一行推进到 1.1，新增 Impeccable `/slop` 行。
- `.planning/seeds/SEED-002-design-lint.md`：补入规则来源与"CLI / 浏览器 / 仅 LLM"三分法，并记下"先评估直接使用现成检测器"。

### 文档与工具

- `docs/index.html`：**按新学到的规则自查后修改**——去掉每一行左侧的彩色竖条（与"卡片侧边粗色条"这一痕迹相邻，且同一分节内不承载额外信息），改为只在分节标题上放一个域色块并让标题吸顶；字体栈去掉 Inter；修复授权信息里长字符串不换行、被视口裁切的问题。均经重新渲染确认。
- `scripts/check-links.py`：局部验链（`--ids` / `--only`）不再覆盖当天的全量报告，改为把结果打印到终端。

### 来源版本与最后更新

| 来源 | 来源版本 | 分析 | 最后更新 |
| --- | --- | --- | --- |
| Anthropic `frontend-design` skill + 配套文章 | skill 三个快照（抓取 2026-09-20）；文章发布 2025-11-12 / 抓取 2026-09-21 | `analysis/02` 1.1 | 2026-09-21 |
| Impeccable `/slop` 规则目录 | 持续更新，中文站抓取 2026-09-21 | `analysis/02` 1.1 | 2026-09-21 |

## [0.1.0] - 2026-09-21

首版。用户给出 15 个设计站点作为样例，要求建立一个结构类似 `ai-agent-skill-lab` 的设计类 skill 项目：能按需求出完整设计、设计单个页面或组件、针对网站给灵感、同时做几套方案，并尽量想到资深设计师会做的其他用途。

### 新增

- **资源目录** `catalog/resources.jsonl`（599 条，S 131 / A 372 / B 96）与分类法 `catalog/sections.json`（12 个域、71 个分节，每个分节一句"资深设计师怎么用这类资源"）。每条标记学科域、分节、类型、标签、`best_for`、`how_to_use`（筛选维度、可深链的 URL 模式、API 与原始文件端点）、收费、登录、`agent_access`、授权、档位、活跃度、语言、来源。用户 2026-09-20 提供的 15 个站点全部收录并标记 `origin: user-2026-09-20`。
- **目录工具链**：`scripts/build-catalog.py` 从目录生成 `skills/design-studio/references/resources/*.md`（agent 运行时读取）与 `docs/catalog.js`（文档页读取），`--check` 校验 schema、重复与视图是否过期；`scripts/check-links.py` 用 curl 机械验链，依据真实响应把 `agent_access` 分类为 static / js / blocked / unknown，并单列"重定向到其他主机"以发现并购与改名。
- **skill 套件** `design-studio`（入口）+ 11 个子 skill：`explore-design-directions`、`find-design-inspiration`、`design-product-ui`、`design-marketing-sites`、`build-design-system`、`design-motion`、`design-icons`、`design-brand-identity`、`design-graphics`、`critique-design`、`implement-design`；以及维护 skill `iterate-design-lab`。
- **共享基础参考**（`skills/design-studio/references/`）：`typography.md`（含中文与混排）、`color.md`、`layout-and-spacing.md`、`anti-slop.md`、`render-and-look.md`、`quality-rubric.md`、`licensing.md`、`resource-map.md`、`source-map.md`（逐文件证据等级）。
- **专项参考**：`platforms.md`（iOS / Android / HarmonyOS / 小程序 / 桌面 / Web / CLI）、`data-dense-ui.md`（后台、表格、表单、仪表盘、数据大屏与数字孪生）、`ai-ux.md`、`motion-tokens.md`、`app-icons-and-favicons.md`、`production.md`（尺寸、印刷、渲染管线）、`guidelines-template.md`、`token-formats.md`（CSS 变量 / DTCG 2025.10 / DESIGN.md / 原生主题）、`stacks.md`。
- **脚本**：`skills/design-studio/scripts/color_tools.py`（WCAG 对比度 + APCA Lc、前景 × 背景矩阵、OKLCH 11 级色阶含中性色与暗色镜像、格式转换；仅标准库）与 `skills/design-studio/scripts/shot.sh`（无依赖多视口截图，强制指定配色方案）。
- **一手摘要 15 份**（`raw/docs/`）与 **分析 11 篇**（`analysis/01` 至 `analysis/11`），含同类 AI 设计 skill 横评、跨来源总综合，以及记录非目标与已知自我违反的 `analysis/11-distilled-skill-design.md`。
- **机械闸** `scripts/check-lab-invariants.sh`：目录有效且视图不过期、skill frontmatter 与行数、三处版本一致、分析元数据块与"对最终 skill 的影响"、摘要头部三要素、反引号路径存在、skill 间相对路径可解析、`SOURCE_INDEX` 日期不倒挂、易腐文件自我声明。
- **文档页** `docs/index.html`：可按域、类型、档位、收费、可达性、语言、来源筛选与搜索的资源目录，以及套件导览。
- `.planning/seeds/SEED-001-freshness-and-evidence.md`、`.planning/seeds/SEED-002-design-lint.md`。

### 来源版本与最后更新

| 来源 | 来源版本 | 分析 | 最后更新 |
| --- | --- | --- | --- |
| Anthropic `frontend-design` skill | 三个快照（2025-12 / 2026-06 / 当前），抓取 2026-09-20 | `analysis/02` 1.0 | 2026-09-21 |
| Vercel Web Interface Guidelines | 持续更新，抓取 2026-09-21 | `analysis/03` 1.0 | 2026-09-21 |
| Hobday 视觉规则、Laws of UX | 抓取 2026-09-21 | `analysis/03` 1.0 | 2026-09-21 |
| Emil Kowalski 动效文章、Material 3 动效 token | 抓取 2026-09-21 | `analysis/04` 1.0 | 2026-09-21 |
| Practical Typography、Radix Colors scale | 抓取 2026-09-21 | `analysis/05` 1.0 | 2026-09-21 |
| Lucide Icon Design Principles | 抓取 2026-09-21 | `analysis/06` 1.0 | 2026-09-21 |
| DTCG Format Module **2025.10**、DESIGN.md **alpha** | 抓取 2026-09-21 | `analysis/07` 1.0 | 2026-09-21 |
| clreq、《中文文案排版指北》、微信小程序设计指南 | 抓取 2026-09-20 | `analysis/08` 1.0 | 2026-09-21 |
| Shape of AI（索引页） | 抓取 2026-09-21 | `analysis/09` 1.0 | 2026-09-21 |
| 资源目录 | 599 条，验链 2026-09-21 | `analysis/01` 1.0 | 2026-09-21 |

### 过程记录

- 2026-09-20：一次性并行派出 9 个调研 agent（继承顶配模型），约 25 分钟后全部因额度耗尽而终止，未写出任何交付物；抢救回候选域名清单（`raw/research/2026-09-20-candidate-hosts.txt`）、GitHub 仓库元数据与部分已抓取的原文。
- 2026-09-21：改为主 agent 直接筛选撰写 + 脚本机械验链。首次全量验链（607 个 URL，约 100 秒）发现 8 处并购 / 改名 / 下线与 1 处许可证变更，详见 `analysis/SOURCE_INDEX.md` 的 `## 新鲜度审查`。
- 构建 `shot.sh` 时实测发现两个陷阱，均已修进脚本并写入 `render-and-look.md` 的 Known traps：无头 Chrome 会继承操作系统的深色模式，导致"浅色截图"实际为深色（改为始终强制指定配色方案）；无头 Chrome 的窗口宽度下限是 500 px，390 px 的"移动端截图"其实是 500 px 布局被裁切（改为在精确尺寸的 iframe 内渲染再裁切）。
- `docs/index.html` 按套件自己的流程做了一轮渲染自评：1280 / 390 两个宽度、明暗两个主题、筛选态与空态；对比度经脚本实测后把浅色主题的弱文字由 4.45:1 调到 5.27:1。

### 已知局限

见 `README.md` 的"已知局限"与 `analysis/11-distilled-skill-design.md` 的"已知的自我违反"：套件尚未被评测；平台规范、品牌、平面、营销站点、数据大屏等部分的证据等级为 practice（通识，未经本仓库核验）。
