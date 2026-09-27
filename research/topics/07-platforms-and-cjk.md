# 07 平台规范与中文排版

> 元数据：更新于 2026-09-27 · 依据：apple-hig-liquid-glass、apple-hig-bars、apple-app-icons、material-3-expressive、harmonyos-design、fluent-2、wechat-miniprogram-design-guidelines、clreq-chinese-text-layout、jlreq、chinese-copywriting-guidelines、cjk-font-licensing、wcag-22、accessibility-law、web-baseline-2026 · 复核期限：2026-11-01（GB/T 47523-2026 适老化规范生效、iOS 27.1 正式版；其余摘要 2026-12-26）

一句话：2026 年一张“像那个平台”的稿子，必须画对三样东西——浮在内容上的导航层、按角色指定的系统材质、各平台自己的尺寸与字阶；中文稿子还要过标点、间距、字体授权三关。本篇列出每个目标平台必须画什么、不能再画什么，以及中文排版与字体授权的可执行规则。应用图标（Icon Composer 六种外观、鸿蒙双层图标）的细节归图标主题，本篇只在对照表里点到。

## 当前结论

**平台**

1. **目标平台只改变三样：画框、惯例、约束。** 画框是尺寸、安全区、系统栏；惯例是导航结构、手势、系统组件；约束是字体、图标体系、最小点击区、输入方式。媒介（HTML / CSS / SVG → PNG）、方法与质量标准不变。先定姿态——原生、品牌化原生、自定义——同一产品不混用两套惯用法。依据：本仓库 0.3.0 起的角色边界结论（旧分析 11），经审计列为应保留项（research-knowledge §12）。业内共识。
2. **三大移动平台都把导航改成“浮在内容上的一层”。** iOS 26 起标签栏是悬浮在底部的 Liquid Glass 层，可随滚动最小化；HarmonyOS 6.1 起新增 56 vp 悬浮式胶囊页签；M3 Expressive 新增浮动工具栏，并用 64 dp 的新导航栏取代 80 dp 旧栏。内容延伸到栏下方。画不透明、贴底、全宽的旧式底栏，在 2026 年是错稿，不只是过时。依据：apple-hig-bars #3–4、harmonyos-design #11、material-3-expressive #23、#27。一手资料。
3. **iOS / iPadOS 26–27。** 用 27 SDK 构建时系统忽略 `UIDesignRequiresCompatibility`，不能再退出新设计；iOS 27 里 iPhone 应用在可缩放环境中可自由缩放，排版必须由 size class 驱动。HIG 不再给设备尺寸表，也从未给出标签栏、工具栏的高度——这些只在官方 UI Kit 里（本轮未读），样机数值一律标“近似”。依据：apple-hig-liquid-glass #19–20、#30，apple-hig-bars #11。一手资料。
4. **Android（M3 Expressive）：规范领先于稳定代码。** 依据：material-3-expressive #5、#12、#23–27、#30、#35–38。一手资料。
   - 规范层：抽屉与底部应用栏“不再推荐”，改用展开式导航栏（220–360 dp）与停靠 / 浮动工具栏（64 dp，不与导航栏同时出现）；连接式按钮组取代分段按钮；expressive 动效是多数场景的默认。
   - 代码层：Compose 稳定版 1.4.0 只带 64 dp 导航栏与宽 / 模态导航栏；工具栏、按钮组、分裂按钮、FAB 菜单、加载指示器都在 1.5.0-alpha；1.4.0 的动效方案 API 全是 `internal`，代码默认是 standard，只有 `MaterialExpressiveTheme` 才默认 expressive；Views 需 MDC 1.14.0。
5. **HarmonyOS 6.1+。** 依据：harmonyos-design #11–22。一手资料。
   - 底部页签分平铺式（48 vp，模糊材质）与悬浮式（56 vp 胶囊，沉浸光感）。悬浮式宽度按断点计算：≥ 5 项最宽 360 vp，4 项 328 vp，3 项 248 / 272 vp，2 项 168 / 184 vp，平板整体 ×1.15；不支持滑动内容切换页签。
   - 标题栏 56 vp（大标题 112 vp），渐变模糊层向下延伸 32 vp。
   - 断点同时看窗口宽度（320 / 600 / 840 / 1440 vp）与宽高比（0.8 / 1.2）；栅格 4 / 8 / 12 列，边距 16 / 24 / 32 vp，内容最大宽 2220 vp。
   - 设计指南与 HdsTabs 接口默认值在 2–3 项宽度上不一致（接口公式得 236 / 248、160 / 168 vp）：按指南画，交接时注明组件默认值可能不同。
6. **微信小程序。** 依据：wechat-miniprogram-design-guidelines #2–6、#10–15。一手资料。
   - 右上角胶囊在每一页（含 web-view 与插件）由微信放置，只能选深浅：先预留再设计，自定义导航要和它长得不一样。
   - 标签栏 2–5 项（建议 ≤ 4），原生底部标签栏只用于首页；启动页除 Logo 外归微信。
   - 一页最多一个加载动画，优先局部加载；toast 约 1.5 秒消失，不能承载错误。
   - 设计稿 375 px 是“固定布局、等比缩放”，390 px 是“响应式、需按尺寸适配”，二者要有意选择。
   - 适老化：读 `wx.getAppBaseInfo` 的字号设置；关怀模式下字体、图形、按钮放大 1.4 倍，间距与导航栏不变。
7. **桌面。** 依据：fluent-2 #1–4、#8–9、#20、#24、#29，apple-hig-liquid-glass #20、#31，apple-hig-bars #18、#23。一手资料。
   - Windows 11：Mica 作窗口基底（带页签的标题栏用 Mica Alt），Acrylic 只用于菜单与弹出层等临时浮层，Smoke 压在对话框下；标题栏 32 px（含搜索框或头像时 48 px）；窗口 8 px 圆角、页内控件 4 px；Windows 字阶 Body 14 / 20 epx，不用 Bold 与斜体；悬停态在 Windows 上“变亮”，与 Fluent Web 相反。
   - macOS 26 / 27：侧边栏为玻璃层并延伸到窗口边缘；工具栏在窗口框内且无边框，每个工具栏项都要在菜单栏里有对应命令；菜单栏 24 pt；窗口底部不放关键控件。
8. **材质按角色指定，不按效果画。** 三家都没有公开模糊参数（苹果唯一的数字规则是清透玻璃下加 35% 暗色层），而且都会在降级时退回实色：苹果在“降低透明度 / 增强对比度”下变磨砂或黑白描边，鸿蒙在低算力设备上退回背景色 + 边框 + 阴影，Windows 在节电、远程桌面、非活动窗口等情形退回实色。所以先设计实色版本并保证可读，再把材质作为带名字的标注层；Web 端 `prefers-reduced-transparency` 只有 Chromium 支持（web-features 3.40.0），不能靠它兜底。依据：apple-hig-liquid-glass #4–7，harmonyos-design #5–7，fluent-2 #5。一手资料。
9. **最小点击区与最小字号各平台不同，不能互换。** 对照表见“论证”。取目标平台与目标市场法规中更严的一个。依据：wcag-22 #17、harmonyos-design #29、wechat-miniprogram-design-guidelines #8、#16、accessibility-law #22、apple-hig-liquid-glass #24、fluent-2 #9、#13。一手资料。

**中文排版与授权**

10. **标点是中文排版的核心难点。** 依据：clreq-chinese-text-layout #1–5。一手资料 + 实测。
    - 禁则默认“基本处理”：点号、结束引号 / 括号 / 书名号、连接号、间隔号、分隔号不在行首；开始引号 / 括号 / 书名号不在行尾。先挤压标点再做禁则，“先挤进，后推出”。
    - 不可拆：破折号（U+2E3A 或两个 U+2014）与省略号（两个 U+2026）各占两字宽；数字与单位、正负号与数字、货币符号与金额。
    - 实测 Chrome 153：默认换行已实现基本禁则（用“推出”而非“挤进”），⸺、——、……、¥100 不被拆开；但 `word-break: break-all` 会把 `12%` 拆成 `1｜2%`，`line-break: anywhere` 会让逗号、句号、右引号上行首。
11. **中西文间距是渲染层的事，约定是产品层的事。** 耐久规则只有一条：一个产品一种约定，用 AutoCorrect / pangu 或 lint 机械保证。依据：clreq-chinese-text-layout #6–7、chinese-copywriting-guidelines #1–5、#10–11。一手资料 + 实测。
    - 规范：clreq 给“不多于 1/4 em，行首行尾不加”（调整时可压到 1/8 em）；《中文文案排版指北》要求手打空格（数字与 °、% 之间除外）。
    - 浏览器：`text-autospace: normal | no-autospace` 自 2025-11-11 进入 Baseline，`ideograph-alpha` 等关键字值仍只有 Firefox 与 Safari；`text-spacing-trim`（标点挤压）只有 Chromium。
    - 实测 Chrome 153：初始值是 `no-autospace`，要显式开启；开启后每处插入 1/8 em；已有手打空格处不再叠加。
12. **中文正文数值是业内共识，不是 clreq 条文。** 行高 1.5–1.8、每行 25–40 字、正文字重 400–500 属实践经验。依据：jlreq #3–4、accessibility-law #22、harmonyos-design #27、wechat-miniprogram-design-guidelines #9、#12、material-3-expressive #20。业内共识（数值）/ 一手资料（旁证与平台字阶）。
    - 一手旁证：jlreq（日文行距为半字到一字，约合 `line-height` 1.5–2.0，横排每行约 40 字）；工信部适老化规范（行距 ≥ 1.3 倍，适老版正文 ≥ 18 dp/pt）。
    - 平台给出的中文 UI 字阶：HarmonyOS Body_M 14 vp、Body_L 16 vp、Title_M 24 vp；微信常用 22 / 17 / 15 / 14 / 12 pt，iOS 关怀模式正文 23.8 px；M3 自 2026-08 按文字系统的字高类别自动加大行高。
13. **字体栈与语言标注。** 西文字体在前、中文字体在后，否则西文会落进中文字体自带的西文字形；标对 `lang`（zh-CN / zh-TW / ja 决定思源 / Noto CJK 选哪套地区字形，也影响断行）；不要把日文字体混进简中栈；不合成粗体与斜体，中文强调用字重、颜色或着重号（`text-emphasis` 已广泛可用）。Windows 简中 UI 字体是 Microsoft YaHei UI；鸿蒙系统字体是 HarmonyOS Sans（可变字重 40–900）。依据：fluent-2 #10、harmonyos-design #30–31、clreq-chinese-text-layout #11 与浏览器支持节。业内共识 + 一手资料。
14. **字体授权分三档，“免费商用”不等于“开源”。** 依据：cjk-font-licensing #1–18 与决策矩阵。一手资料（许可证原文；非法律意见）。
    - OFL：思源（保留字体名 “Source”）、Noto CJK（无保留名）、霞鹜文楷、得意黑、更纱黑体、猫啃自制字体。可商用、可自托管、可打包进 App；子集化与转格式属于修改，带保留字体名的家族子集后必须改字体文件内的名字（Noto CJK 不用改；霞鹜文楷对“仅用于网页分发”的子集另有许可）。
    - 厂商“免费商用”：HarmonyOS Sans、MiSans、OPPO Sans、vivo Sans、HONOR Sans、阿里巴巴普惠体。不是开源许可：禁止修改、禁止单独分发，多数要求在软件内声明所用字体，所以不得子集化或转格式；在自己平台上直接用系统字体最安全。
    - 方正、汉仪：默认只授权个人非商用，网页、App 内嵌、商标、包装都要单独购买；方正五款免费字体只免“发布使用”，不含内嵌。
    - 例外提醒：霞鹜新晰黑是 IPA 许可证，不是 OFL。
15. **维权信号有据，但只到厂商声明为止。** 方正 2015、2022、2023 年，汉仪 2018 年公开声明：带“迷你”“经典”等前缀的“免费字体”多是改名盗版。法院判决本轮未读，“维权频繁”只能说有厂商公开声明支持。依据：cjk-font-licensing #19。一手资料（厂商声明）。
16. **日文另有规则，不照搬 clreq。** 半角标点加半字空、和欧间四分空、禁则分四级、ruby 为正文半字号且 7 pt 以下改用括注；CSS `line-break` 没有与 jlreq 默认“strict”级精确对应的关键字。中文产品里出现日文时按 jlreq 处理，并标 `lang="ja"`。依据：jlreq #5–18。一手资料。

## 论证

**每个平台 2026 年必须画什么。** 应用图标一栏的依据是 apple-app-icons #5、#8、#13 与 harmonyos-design #32。

| 目标 | 必画 | 不再画 | 数字的可信度 |
| --- | --- | --- | --- |
| iOS / iPadOS 26–27 | 悬浮玻璃标签栏及其最小化态（当前页签在左下、附件居中、搜索页签在右下）；工具栏按功能分组（一般 ≤ 3 组），唯一的 `.prominent` 主操作在尾部、着色的是背景；返回用图标，不写“返回”字样；大标题滚动收成标准标题；滚动边缘效果代替不透明栏；列表分组标题用标题式大小写；iPad 标签栏在顶部并可转侧边栏；iOS 27 可设一个 prominent 页签、iPhone 可用侧边栏；应用图标按分层 + 六种外观交付 | 贴底 49 px 不透明标签栏；工具栏每个按钮都着色；内容层卡片用玻璃；玻璃叠玻璃；全大写分组标题；旧蓝 #007AFF（现为 #0088FF） | 结构与颜色：一手；栏高、胶囊圆角：UI Kit 未读，近似 |
| Android 16 / M3 Expressive | 64 dp 导航栏（中等窗口横排）；收起 96 dp / 展开 220–360 dp 导航栏；停靠或浮动工具栏 64 dp；灵活应用栏（小 64、中 112、大 120 dp）；按钮 5 档（32 / 40 / 56 / 96 / 136 dp）；FAB 56 / 80 / 96 dp；连接式按钮组；FAB 菜单 2–6 项；色调表面而非玻璃；断点 600 / 840 / 1200 / 1600 dp | 80 dp 导航栏；抽屉；底部应用栏；分段按钮；speed dial；小 FAB | 一手（token 库快照 2026-09-23）；代码可用性见结论 4 |
| HarmonyOS 6.1+ | 平铺 48 vp 或悬浮 56 vp 页签（宽度见结论 5）；标题栏 56 / 112 vp + 32 vp 渐变模糊；按场景选沉浸光感档位；手机边距 16 vp、卡片间距 12 vp；圆角 4 / 8 / 16 / 20 / 32 vp 随层级递增；图标 HarmonyOS Symbol 24 vp；应用图标前景 + 背景两层、1024 px、背景不透明；样机画框 366×809 或 359×789 vp，折叠屏展开 737×805 vp | 只有平铺页签的旧稿；写着“待核对”的断点 | 一手；少数数值只在图片里 |
| 微信小程序 | 胶囊预留区；首页原生标签栏；局部加载；用结果页或模态对话框承载需要确认的结果；关怀模式字阶 | 侵占胶囊；> 5 项页签；用 toast 报错；一页两个加载动画 | 一手；配色、列表、表单规格只在图片里 |
| Windows 11 | Mica 基底 + 内容层填充或卡片；32 / 48 px 标题栏与系统按钮；8 px 窗口 / 4 px 控件圆角；Segoe UI Variable 字阶；窗口断点 640 / 1008 epx | 大面积桌面 Acrylic；Acrylic 叠 Acrylic；Acrylic 上的强调色文字 | 一手；Fluent 站点与 React v9 代码有出入，以代码为准 |
| macOS 26–27 | 延伸到窗口边缘的玻璃侧边栏；无边框工具栏项；菜单栏镜像；macOS 字阶（Body 13 / 16 pt）；Large 控件为胶囊 | 窗口底部放关键控件；不规则外形的应用图标（系统会缩进圆角矩形） | 一手 |

**材质角色对照（先实色、后材质）。**

| 角色 | Apple | HarmonyOS | Windows | M3 |
| --- | --- | --- | --- | --- |
| 浮动控件与导航 | Liquid Glass regular（功能层） | 顶部 ULTRA_THIN + 渐变模糊；底部 THIN + 渐变色 | 标题栏与导航在 Mica 上 | 无玻璃；滚动时填充 `surface-container` |
| 媒体上的控件 | glass clear + 35% 暗层（三条件同时成立） | — | — | — |
| 临时浮层（菜单、弹出层） | 大尺寸玻璃变厚、不随底色翻转 | THICK | 背景 Acrylic | 色调表面 + 阴影层级 |
| 半模态与对话框 | 半屏 sheet 内缩，全屏时更不透明 | ULTRA_THICK | 实色 + Smoke 遮罩 | 表面 + 遮罩 |
| 内容层内的分隔 | 标准材质 ultraThin…thick | REGULAR（卡片） | 层填充 / 卡片 | 色调表面 |

Web 与跨端自绘产品不应在内容层模仿平台玻璃：平台玻璃是功能层的系统材质，Web 上的“毛玻璃卡片”只是装饰，必须有可读的实色回退。

**点击区与最小字号对照。**
- WCAG 2.5.8（AA）：24×24 CSS px，或以 24 px 圆检验间距。
- HarmonyOS：推荐 48×48 vp、强制 ≥ 40×40 vp；手机文字推荐 ≥ 12 vp、强制 ≥ 8 vp。
- 微信：物理尺寸约 7–9 mm；适老化在图标外扩 12 pt 热区，≥ 44 pt 的元素不必外扩，特殊小元素至少 40×40 pt。
- 工信部 App 适老化：适老版主要组件 ≥ 60×60 dp/pt、其他页面 ≥ 44×44；主要功能的最大字号 ≥ 30 dp/pt。
- Fluent 引述：iOS 与 Web 44×44、Android 48×48。
- 最小字号：iOS 默认 / 最小 17 / 11 pt，macOS 13 / 10 pt；Windows 最小 14 px Semibold / 12 px Regular。
- 它们量的不是同一种东西（CSS px、vp、pt、毫米），不能互相换算后取平均。

**张力与取舍。**
- 苹果的品牌色规则是“强调色只给主操作与状态，品牌表达移进内容层”（2026-09-09 更新），ChatGPT 宿主也不许品牌字体和渐变。两处指向同一件事：平台控件层越来越不归品牌所有，品牌要在内容里表达。
- M3 规范说 expressive 是默认，代码默认却是 standard，稳定版缺多数新组件。画了按钮组、FAB 菜单的安卓稿，交接时必须注明“Compose 需 material3 1.5.0-alpha，Views 需 MDC 1.14.0”。
- 鸿蒙指南与接口默认值、Fluent 设计站与 React v9 代码（圆角 Large 8 vs 6 px，Subtitle 1 行高 26 vs 28）都有出入。原则：画稿以设计指南为目标，嵌入式与 Web 实现以代码为准，出入写进交接。
- 中西文间距：手打空格在原生 App 与小程序文案里仍是唯一可控的办法；Web 上可交给 `text-autospace`，但 Chromium 默认关闭、关键字值不跨浏览器。所以“空格是渲染层的事”是方向，“一个产品一种约定”才是今天可执行的规则。手打的 U+0020 在苹方 16 px 下约 1/3 em，比 clreq 的 1/4 em 默认值宽，但在其允许的 1/2 em 上限之内。
- `word-break: break-all` 常被当作中文页面的“防溢出”通用写法，它会拆开数字与单位；长串 URL 或代码的溢出应改用 `overflow-wrap: anywhere`（只在溢出时断行；本轮未逐项实测）。

**相对 2026-09-21 旧文（分析 08 及当时的 platforms.md）改了什么、为什么旧说法错。**
- 旧文称 HIG、Material、HarmonyOS 的一手资料“因站点是 JS 应用或网络不可达”而缺失。**这个理由不成立**：HIG 每页都有带变更日志的 DocC JSON，华为文档有公开的文档接口（每页带 `updatedDate`），Material 可在无头 Chromium 中渲染。后果是当时的平台参考只有一句“用系统组件，别模仿玻璃”，样机套件还在画 iOS 26 之前的 49 px 贴底标签栏，却标着“2026-09 复核”。
- 旧文把普惠体、HarmonyOS Sans、MiSans 称作“开放许可字体”，紧接着推荐用 cn-font-split 切片。**这是错的且有法律风险**：三者都是禁止修改的厂商许可，切片就是修改。错因是把“免费商用”当成了“开源”，没有读许可证原文。
- 旧文的中文正文数值（1.6–1.8、25–40 字）被标为“有摘要支撑”，实际 clreq 摘要只覆盖禁则、挤压、间距与行间标点。现降级为业内共识，并补上 jlreq 与适老化规范两条一手旁证。
- 旧文预言“随着 `text-autospace` 普及，手工空格的必要性会下降”——方向对，但当时没有日期。现在知道：属性本身已 Baseline，Chromium 初始值却是 `no-autospace`。jlreq 摘要与审计报告曾把它写成“仅 Firefox 与 Safari”，那是按特性整体状态读的；按属性值读，clreq 摘要是对的，本文以属性值为准。
- 旧文“国内大厂消费级界面多数不加空格”“方正、汉仪维权频繁”两条没有样本或出处。前者移入未决问题；后者现有厂商公开声明支持，但没有判决书。
- 小程序设计稿宽度从“375 或 390 px”细化为“375 = 固定等比缩放，390 = 响应式”。
- 旧文仍然正确、予以保留的：标点是核心难点；间距约定统一并用 lint 保证；胶囊不可侵占；错误不用瞬时提示；字体授权必须有据可查；红涨绿跌是本地色彩语义（业内共识）。“国内大屏深蓝发光套路”不属本篇，移交数据密集界面的主题。

## 未决问题

- iOS 标签栏、工具栏、胶囊的几何尺寸（高度、底部内缩、最小化尺寸）只在 iOS 27 UI Kit 里，本轮未读；iPhone Duo 的点尺寸与竖向栏宽度未知；iOS 27 透明度滑杆的范围与默认值未见一手资料；`ToolbarVerticalCompressionBehavior` 仍在 27.1 beta。
- M3 按设备类别变化的弹簧值未公开；连接式按钮组 XS 内圆角页面写 4 dp、token 解析为 8 dp。
- HarmonyOS：断点图、五级材质示意、九种图标配色方向、排版正误示例只在图片里；接口版本“26.0.0”对应哪一版 HarmonyOS 未见一手说明；`background_primary` 深色值疑似文档笔误。
- 微信大屏适配、无障碍、物料三份子指南未读；配色、列表、表单、按钮规格为图片。
- GB/T 47523-2026《移动互联网应用程序适老化技术规范》2026-11-01 生效，GB/T 45395-2025 小程序无障碍、GB/T 46070-2025 均未读到正文。
- 在网站上提供**未修改**的厂商字体文件，算“随软件分发”还是“单独分发”，许可证文本都没有说清；OPPO 明文禁止“提供其他下载渠道”，倾向于否。
- 国内产品界面文案是否普遍不加中西文空格，需要系统抽样。
- clreq 的版心、行距章节未摘要，中文正文数值仍缺中文一手依据；Ant Design、TDesign 的字阶与间距未摘要。
- Windows 节电模式是否影响 Mica，两页微软文档互相矛盾；Fluent 的 Copilot 交接模式页本轮未复读。
- `text-autospace` 在 Firefox、Safari 中的实际渲染与叠加行为未测（本机只有 Chromium）；`overflow-wrap: anywhere` 对中文标点的影响未测。

## 对 skill 的约束

- `skills/design-studio/references/platforms/README.md`：姿态表（原生 / 品牌化原生 / 自定义）与“不混用惯用法”；“目标平台只改画框、惯例、约束”；跨平台清单（导航放哪、搜索放哪、动作不进标签栏、材质按角色）；DTCG `px` 对应 Android dp / iOS pt、`rem` 对应 16 sp；在中国上架的 App 列出适老化与 AI 标识的上架检查（后者见 08 篇）。
- `platforms/ios.md`：结论 2–3 与“必画 / 不再画”表的 iOS 行；27 SDK 不能退出、iPhone 可缩放、size class 排版；所有栏高标“近似，出自 UI Kit”；颜色用 2025 起的系统色值。
- `platforms/android.md`：Expressive 结构（64 dp 栏、展开导航栏替代抽屉、工具栏替代底部应用栏且不与导航栏共存、按钮组、FAB 菜单）；断点用新名称 breakpoints；代码可用性与交接标注（1.5.0-alpha / MDC 1.14.0）。
- `platforms/harmonyos.md`：删除所有“待核对”措辞，换成结论 5 的数字；保留指南与接口宽度冲突的说明；沉浸光感三档强度、五级厚度与场景映射，设备档位独立于厚度。
- `platforms/mini-programs.md`：结论 6 全部；375 / 390 的选择；适老化数字；列出 GB/T 45395-2025 小程序无障碍国标（正文未读，只列名）。
- `platforms/desktop.md`：Windows 与 macOS 两节按结论 7；WinUI 命名（不再叫 WinUI 3）。
- `skills/design-studio/references/fundamentals/materials.md`：材质角色对照表；“先实色、后材质”；三家均无模糊参数，Web 上的玻璃渲染是带标注的近似；清透玻璃三条件与 35% 暗层；无障碍设置下的材质变化。
- `fundamentals/cjk-typography.md`：禁则基本级、先挤后禁、不可拆清单；`break-all` 与 `line-break: anywhere` 的实测副作用；间距约定三选一（渲染层 / 手打 / 不加）并机械检查，Chromium 需显式 `text-autospace: normal`；正文数值标为“实践”；平台中文字阶（HarmonyOS、微信、工信部适老化）；字体栈顺序与 `lang`；授权三档矩阵（可否商用、子集、自托管、打包、义务）；日文小节只列 jlreq 要点，不复述 clreq。
- `fundamentals/licensing.md`：字体许可拆成使用、修改、再分发、内嵌四项；“免费商用 ≠ 开源”；“未授予即保留”；“迷你 / 经典”前缀是红旗；厂商字体的“软件内声明”是交接项。
- `fundamentals/accessibility.md`：点击区与最小字号对照（注明单位不可互换）；中国适老化规范数字；浮动栏不得完全遮住焦点元素（WCAG 2.4.11，用等于栏高的 `scroll-padding`）。
- `fundamentals/modern-css.md`：中日文相关属性的支持表（`text-autospace` 按属性值分行、`text-spacing-trim`、`hanging-punctuation`、`word-break: auto-phrase`、`text-emphasis`、`prefers-reduced-transparency`），带 web-features 版本与日期。
- `skills/design-studio/assets/mockup-kit/kit.json` + `kit.css` + `demo.html`：每个数值带 source id；未从一手资料取得的（iOS 栏高等）标 `approx`；删除 49 px 贴底标签栏与 80 dp M3 导航栏；材质画成带名字的标注层（`glass.regular`、`ULTRA_THIN`、`mica`），不用 `backdrop-filter` 冒充规范。
- `skills/design-studio/scripts/lint.mjs`：可在渲染页上机械检查的中文项——行首禁用标点、被拆开的 ⸺ / …… / 数字与单位、中西文之间的全角空格、重复标点、中文句中的半角标点。
- `skills/critique-design/references/heuristics.md`：平台项——胶囊遮挡、> 5 项页签、toast 报错、标签栏里放动作、一栏多个 prominent、“返回”文字、玻璃在内容层；授权项——中文 Web 字体先查许可，子集化的厂商字体与无授权证明的方正 / 汉仪字体列为问题。
- `skills/design-studio/references/process/handoff.md`：字体行写明字体、许可证、交付方式（系统字体 / 原样打包 / 子集 Web 字体）与需要的声明文本；安卓 Expressive 组件的代码版本标注；指南与组件默认值的出入。
- `skills/implement-design/references/stacks.md`：SwiftUI / UIKit / AppKit 的 Liquid Glass 与栏 API，Compose Expressive API（含实验状态），ArkUI 沉浸光感与 HdsTabs，WinUI 材质；Web 端 `lang` 与中日文属性作为渐进增强。

## 变更记录

- 2026-09-27 重写：由旧分析 08 迁入并全文重写，吸收审计报告 research-knowledge §1–4、§9。新增 iOS 26–27、M3 Expressive、HarmonyOS 6.1、Windows 11 / Fluent 2、macOS 26–27 的一手事实与“必画 / 不再画”表、材质角色对照、点击区对照、jlreq、中文字体授权三档；更正“开放许可字体”与“平台资料不可抓取”两处错误；把中文正文数值降为业内共识；补充 Chrome 153 的禁则与 `text-autospace` 实测；删除仪式性小节。
