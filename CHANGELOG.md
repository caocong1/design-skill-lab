# Changelog

本文件记录本仓库各 skill、资源目录与分析报告的版本变更。除非另注，`## [X.Y.Z]` 形式的条目指 `design-studio` suite；其他 skill 的条目以 `## <skill 名称> [X.Y.Z]` 标注。

版本号遵循语义化版本（SemVer），作用于 suite 契约（模式、交付物、产出目录结构、reference 路径）：

- MAJOR：契约的破坏性变更（模式名、交付物格式、reference 文件移除或重命名）。
- MINOR：新增 skill、新增能力、新增 reference、新增对指导有实质影响的分析来源。
- PATCH：措辞澄清、资源目录条目的增删改、易腐参考文件的例行复核。

`0.x` 期间契约仍在定型，MINOR 也可能调整契约，但仍会在此写明。从 1.0 起，任何移除都必须先在 `弃用登记` 下登记至少两个 MINOR 版本。

各 skill 的当前版本记录在对应 `SKILL.md` frontmatter 的 `metadata.version`；逐来源的分析版本与新鲜度审查记录在 `analysis/SOURCE_INDEX.md`。

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
