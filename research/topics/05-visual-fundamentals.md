# 05 视觉基础（排版·色彩·布局·图标）

> 元数据：更新于 2026-09-27 · 依据：practical-typography-key-rules、hobday-visual-design-rules、radix-colors-scale、lucide-icon-design-principles、laws-of-ux、wcag-22、apple-hig-liquid-glass、apple-hig-bars、material-3-expressive、harmonyos-design、fluent-2、impeccable、impeccable-slop-rules、anthropic-frontend-design-skill、anthropic-design-skills、apple-app-icons、taste-skill、ui-ux-pro-max、web-baseline-2026；另 m3.material.io「Designing icons」页（本篇以无头 Chrome 渲染核对）与 Apple HIG Buttons 页（DocC JSON 核对），均尚无摘要（旧分析 05、06 已并入）· 复核期限：2026-12-26（规则本身耐久，可到 2027-09-27；平台数值与 WCAG 3 / APCA 状态易腐）

排版、色彩、布局、图标是所有学科共用的地基。本篇把每一块里的数分成三类：可以无脑遵守的感知规律（耐久）、随目标平台变化的数值（易腐，按目标取）、会腐坏的“流行名单”（只能作带日期的观察）。中文排版数值与字体授权归 07；色阶的 token 化、主题与模式归 06；材质（玻璃、Mica、沉浸光感）归 07 与 `fundamentals/materials.md`；交互工艺（目标尺寸的交互面、焦点）另见 03。应用图标的交付规格在本篇（07 只在平台对照表里点到）。

## 当前结论

**排版**

1. **正文由四个决定构成：字号、行距、行长、字体。** 拉丁文字基线：网页 15–25 px、行距为字号的 120–145%、平均行长 45–90 字符（含空格）；全大写只用于不到一行的文字，并加 5–12% 字距；首行缩进（字号的 1–4 倍）与段间距（4–10 pt）二选一；两端对齐必须开断词；弯引号、真省略号、真破折号，字偶距始终开启；粗体与斜体少用、不叠用；下划线只给链接。这些数只适用于拉丁文字，中文另见 07。依据：practical-typography-key-rules #1–14。一手资料（耐久）。
2. **界面文字与阅读文字是两套数。** 平台界面正文在 14–17：Apple Body 17 pt（iOS 默认，最小 11 pt）；M3 body-large 16 / 24、body-medium 14 / 20；HarmonyOS Body_L 16、Body_M 14 vp（手机最小 8 vp 强制、12 推荐）；Fluent web Body 1 为 14 / 20 px，Windows 最小 14 px Semibold / 12 px Regular。阅读正文 ≥ 16 px（Hobday；Impeccable“从 16 起步”）。行长：长文 45–90（Butterick）、约 70（Hobday）、65–75（Impeccable）；界面窗格 40–60（M3）、50–60（Windows，不低于 20、不超过 60）。行距：标题约 1.2 倍、正文约 1.5 倍（M3）；Impeccable 的检测器把非标题文字低于 1.3 倍标为过紧。无论取哪套，页面都必须经得起用户把行距设为 1.5 倍、段距 2 倍、字距 0.12 倍、词距 0.16 倍而不丢内容（WCAG 1.4.12，AA）。依据：apple-hig-liquid-glass #24–25，material-3-expressive #18、#21、#26，harmonyos-design #27、#29，fluent-2 #7–9，hobday-visual-design-rules #20–21，impeccable #27，impeccable-slop-rules #8、#12，wcag-22 #11。一手资料。
3. **字距是字体的属性，不是通用公式。** “字越大，字距与行距越小”（Hobday #6）对没有光学尺寸、没有官方字距表的字体成立；有表的字体以表为准：SF Pro 在 13–23 pt 为负、24 pt 起转正（24 pt +0.07、28 pt +0.38、34 pt +0.40 pt）；Segoe UI Variable 的 `opsz` 轴在 8–36 pt 间自动调整。给 iOS 大标题加 `-0.02em` 是错的——旧 mockup kit 就这样做过。通用地板：字距不低于 -0.04em，正文不超过 +0.05em。依据：hobday-visual-design-rules #6，apple-hig-liquid-glass #27，fluent-2 #9，impeccable #24、#27。一手资料。
4. **选字体：最多两种，有理由地选、渲染出来看；“过度使用”名单只作带日期的观察。** 两个家族为上限（Hobday #23；frontend-design 要求两种时须明显不同）。Butterick 的“避开大多数免费字体”写于开源字体普遍平庸的年代，今天应读作“避开人人见过的默认字体”。名单会腐坏而且互相矛盾：Impeccable 检测器列了 15 个过度使用的字体（Inter、Roboto、Open Sans、Lato、Montserrat、Arial、Helvetica、Fraunces、Instrument Sans / Serif、Geist、Mona Sans、Plus Jakarta Sans、Space Grotesk、Recoleta），它的英文 /slop 页只点名 Inter 与 Geist；taste-skill 推荐 Geist、Outfit 作默认；Anthropic 2025-11 的文章把 Space Grotesk 当解药，不到一年它就进了过度使用名单。依据：hobday-visual-design-rules #23，anthropic-frontend-design-skill #4、#16，practical-typography-key-rules #5，impeccable #28，impeccable-slop-rules #6、#14，taste-skill #11。一手资料 + 推论。

**色彩**

5. **色阶“位置即角色”是默认语义层。** Radix 把每条色阶固定为 12 级：1–2 背景、3–5 组件常态 / 悬停 / 按下或选中、6–8 边框（弱 / 交互 / 强与焦点环）、9–10 实色及其悬停、11–12 低 / 高对比文字；11、12 级在同阶 2 级背景上保证 APCA Lc 60 / Lc 90——这是 APCA 口径，交付仍要算 WCAG 2 比值；Sky、Mint、Lime、Yellow、Amber 的 9 级配深色文字。token 化与暗色映射见 06。依据：radix-colors-scale #1–7。一手资料。
6. **Hobday 的色彩与深度规则（安全默认，有理由可以打破）。** 近黑近白代替纯黑纯白；中性色带界面主色相，饱和度 < 5%（HSB），且只偏暖或只偏冷；色板各级亮度要拉开，不能只靠色相区分；容器与背景的亮度差深色界面 ≤ 12%、浅色 ≤ 7%（HSB 亮度，作者据约 100 个网站得出，研究未公开）；容器边框要同时与容器和背景形成对比（深色卡片压在更深的页面上时，边框比两者都亮）；越近的层越亮，深浅主题都成立；深色界面默认不用阴影；一个界面只用一种深度手法；阴影模糊约为偏移的 2 倍，越“近”的元素阴影越淡；与文字并排的图标要降低对比。依据：hobday-visual-design-rules #1–3、#7、#9–10、#15–16、#18、#26–28。一手资料（作者声明的经验规则）。
7. **对比度的合规口径（WCAG 2.2）。** 文字 4.5:1，大字 3:1；“大字” = 至少 18 pt 或 14 pt 粗体，即 24 px 或 18.67 px 粗体（W3C 行文写“约 18.5 px”）；阈值不四舍五入，4.499:1 不合格；非文字对比 3:1 对相邻色——输入框的边框若是它唯一的标识就必须达到 3:1，图标、焦点环、图表标记同理；渐变取物体的中心色，多色时测对比最弱处；只指定前景色不指定背景色（或反之）本身就是失败；颜色不能是唯一的信息载体（1.4.1）。中文等 CJK 文字的“大字等效尺寸”WCAG 没有给数字，任何 px 值都只是实践。依据：wcag-22 #3–9。一手资料。
8. **APCA 不是标准，WCAG 3 的对比度算法仍未定。** WCAG 3 工作草案（2026-09-10）的“文本对比度充足”要求写的是“@@[对比度算法待定]”，全文 0 处提到 APCA；APCA 已转为独立的 APCA Readability Criterion（ARC），Bronze 简易模式（页面标 beta）：正文最低 Lc 75、建议 90，其他内容文字 60，> 36 px 的大字 45；npm `apca-w3` 最新 0.1.9（2022-07），许可只授予 W3C / AGWG 用途。结论：WCAG 2 比值判定合规，APCA Lc 并列报告作感知参考，不替代。依据：wcag-22 #25、#28–31。一手资料。
9. **高对比正在变成平台要求的“模式”。** Apple 要求每个自定义颜色都有浅色、深色，以及各自的“增强对比”变体，只做一种外观的 App 也要备齐；M3 每个颜色角色有 standard / medium / high 三档对比；HarmonyOS 的默认系统色保证至少 3:1；Windows 在高对比下所有材质退出、回落到实色。所以设计系统要把高对比当作与深浅并列的一等模式（在 token 里怎么组织见 06）。依据：apple-hig-liquid-glass #13，material-3-expressive #22，harmonyos-design #35，fluent-2 #5。一手资料。
10. **对比度是地板，身份来自方向。** 平台默认色会变：iOS 系统蓝从 `#007AFF` 变为 `#0088FF`（2025 起），HIG 明言不要硬编码。而“合格”不等于“有个性”：UI UX Pro Max 按行业查表，给“AI 聊天平台”输出紫色主色 + 青色点缀 + Inter / Inter，照样能过 4.5:1。依据：apple-hig-liquid-glass #14，ui-ux-pro-max #18。一手资料 + 推论。

**布局**

11. **嵌套圆角同心：内圆角 = 外圆角 − 间距。** 三个独立来源一致：Hobday（外 30、间距 20 → 内 10）、M3 的“光学圆度”（48 − 14 = 34 dp）、Apple Liquid Glass 的同心形状（三种形状：固定半径、胶囊 = 高度的一半、同心 = 父半径 − 内边距；手机上靠近屏幕边缘时用胶囊并加大边距）。圆角刻度各平台不同：M3 为 0 / 4 / 8 / 12 / 16 / 20 / 28 / 32 / 48 / full（20、32、48 为 2025-05 新增）；HarmonyOS 常用 4（标签、徽标）/ 8（图片、图标）/ 16（卡片、内容容器）/ 20（按钮、菜单）/ 32（半模态、对话框），规则是“层级越高圆角越大、同级同圆角”；Fluent 默认 4、小于 32 px 的形状用 2、大组件用 8 / 12，Windows 顶层容器 8、页内控件 4，拼接处与贴屏幕边处为 0。依据：hobday-visual-design-rules #24，material-3-expressive #14–15，apple-hig-liquid-glass #22，harmonyos-design #25，fluent-2 #18–20。一手资料（三源一致，高置信）。
12. **间距与重量的通用规则。** 间距从高对比点量起，不从包围盒量起；容器外边距 ≥ 内边距；按钮水平内边距约为垂直的 2 倍；尺寸之间有数学关系（用刻度）；一切都与某物对齐；光学对齐常优于数学对齐；横向网格用 12 栏；按视觉重量排序，重的在前（如两个按钮再三个链接）；简单配复杂，避免复杂叠复杂；不并排两道硬分割（背景变化、容器边、分割线）。平台基准单位：Fluent 4 px（另有 2 / 6 / 10 用于图标对齐）；Windows 取 4 epx 的倍数（缩放档位 125% × 4 = 5，落在整像素）；HarmonyOS 8 vp 网格、小元素可对齐 4 vp，手机卡片间距 12 vp。依据：hobday-visual-design-rules #5、#8、#11–14、#17、#19、#22、#25，fluent-2 #13、#15，harmonyos-design #20、#24。一手资料。
13. **断点跨平台收敛在 600 与 840。** M3（2026-05 改称 breakpoints）：compact < 600、medium 600–839、expanded 840–1199、large 1200–1599、extra-large ≥ 1600 dp；HarmonyOS 宽度断点：XS < 320、SM 320–600、MD 600–840、LG 840–1440、XL ≥ 1440 vp，栅格在 0 / 600 / 840 处切换为 4 / 8 / 12 栏，内容最大宽度 2220 vp；Fluent web 为 320 / 480 / 640 / 1024 / 1366 / 1920 px；Windows 为 640 / 1008 epx；Apple 只用 size class，iOS 27 中 iPhone App 在可调尺寸环境里完全可缩放，HIG 的 Layout 页已不再列设备尺寸表。依据：material-3-expressive #26，harmonyos-design #21–22，fluent-2 #14–15，apple-hig-liquid-glass #19–20。一手资料；“以 600 / 840 作跨平台默认”为推论。
14. **目标尺寸：Web 合规地板 24，触控平台 44–48。** WCAG 2.5.8（AA）24 × 24 CSS px（或 24 px 圆的间距例外），2.5.5（AAA）44 × 44；Apple 按钮点击区至少 44 × 44 pt，visionOS 60 × 60 pt；M3 按钮组的内边距保证 48 dp 目标；HarmonyOS 推荐 48 × 48、强制不小于 40 × 40 vp；Fluent 44（iOS、web）/ 48（Android）。视觉小于目标时扩大点击区，不放大图形。依据：wcag-22 #17–18，Apple HIG Buttons（本篇核对），material-3-expressive #30，harmonyos-design #29，fluent-2 #13。一手资料。
15. **Laws of UX 的价值在词汇：给判断一个名字，审美就变成可反驳的论证。** 常用的：Fitts（目标大小与距离，屏幕边角最好点）、Hick 与选择过载（选项数量；给推荐默认）、Doherty（< 400 ms 反馈）、Jakob（惯例本身是功能）、Von Restorff（只让一个主操作与众不同）、系列位置（关键项放列表两端）、格式塔的接近与共同区域（先用空间分组，再用容器）、工作记忆（约 4–7 块、20–30 s 衰减：让系统替用户记，跨步骤带着上下文）、Tesler（不可消除的复杂度由系统承担）。Miller 定律的页面自己说“不要用神奇数字 7 为不必要的限制辩护”。依据：laws-of-ux #2–19。一手资料（逐页只读了三条，其余为释义）。

**图标**

16. **先选家族、不混用；家族按语气选，不按默认选。** 大多数产品需要的不是新图标，而是选对一个家族。要警惕：Lucide 是 shadcn 栈与 Anthropic `web-artifacts-builder` 的默认图标库，所以也是 AI 生成页面的常见面孔；taste-skill 甚至直接劝退 Lucide；Impeccable 把 emoji 或字符当图标列入拒绝清单。依据：anthropic-design-skills #14，taste-skill #10，impeccable #24。一手资料 + 推论。
17. **自绘描边图标以 Lucide 规格为模板（must / should 分级）。** 24 × 24 画布，描边距边缘 ≥ 1 px；2 px 居中描边、圆接、开放路径圆头；90° 角圆角 2 px（元素宽或高 ≥ 8 px）或 1 px（更小），成直角相交的斜线约 2.41 px（1 + √2），多于两线相交处保持尖角；不同元素之间、形状内部的空隙 ≥ 2 px（能塞进一个 2 px 的圆）；优先圆弧与二次曲线、控制点尽量少；坐标与圆心落在整像素；变体复用基础图标的几何。两个 agent 能真实执行的测试：把新图标与家族里的圆、方并排**模糊**后比较明暗；在目标尺寸下模糊，发黑的地方就是细节过密。依据：lucide-icon-design-principles #1–11。一手资料。
18. **各家族的参数不同，混用一眼可见。** Material Symbols：标准 24 dp，另有 20 / 40 / 48 dp 光学尺寸；内容限于 20 × 20 的活动区，四周 2 dp 内边距；关键线形状为方 18、圆 20、竖矩形 16 × 20、横矩形 20 × 16；描边 2 dp = 字重 400（可变 100–700）；**方头**端点；外角 2 dp，outlined 风格内角为直角。HarmonyOS Symbol：24 vp，活动区 22 vp，描边 1.5 vp（复杂图形 1.3），外角 3 / 内角 1.5 vp，斜线 45° 自左上到右下，图标尺寸等于字号。Segoe Fluent Icons：1 epx 单线，清晰尺寸 16 / 20 / 24 / 32 / 40 / 48 / 64。Fluent System Icons：Regular 用于导航、Filled 用于选中与小面积强调，12 px 图标只作信息、不可交互，按对象命名（“Shield，不是 security”）。SF Symbols：标签栏优先用填充款，工具栏里不加外框。Material 的方头与 Lucide 的圆头恰好相反，这就是“不混用”的直观理由。依据：m3.material.io「Designing icons」（本篇核对），material-3-expressive #40，harmonyos-design #34，fluent-2 #26–27，apple-hig-bars #1、#14。一手资料。
19. **图标与文字并排时，图标服从文字。** 图标看起来比同色文字重，要降低对比（透明度或更浅 / 更深的颜色）；尺寸跟随字号（HarmonyOS Symbol 明言图标尺寸等于字号）；纯图标按钮必须有可访问名称（03）。依据：hobday-visual-design-rules #28，harmonyos-design #34。一手资料。
20. **应用图标已从“一张 PNG”变成“分层源文件 + 系统渲染”。** 共同原则：交方形、不带遮罩的分层源文件，不把高光、阴影、玻璃、模糊烘焙进去，让系统渲染；主体居中、远离角落；在最小尺寸和单色 / 着色外观下检查。Apple（iOS / iPadOS / macOS / watchOS）：背景层 + 一个或多个前景层，在 Icon Composer 里设材质并标注 Default、Dark、Mono 三种，系统由此生成六种外观（default、dark、clear light / dark、tinted light / dark），交付 `.icon` 文件；画布 1024 × 1024 px，Apple Watch 1088 × 1088 px；图层优先 SVG、文字转曲，前景形状边缘清晰、不羽化，最多四个分组；macOS 不再允许异形图标，异形会被缩进系统提供的圆角矩形底板；当前 Icon Composer 页写明需要 macOS Tahoe 26.4 或更高。HarmonyOS：前景 + 背景两层，1024 × 1024 px 方形 PNG、不带圆角，背景层不得有透明像素（否则上架检查失败）；光从上方来，只用一个渐变方向，加“光感勾边”。Windows：48 × 48 网格，外角 2 px、内角 1 px，最多两个隐喻，渐变要克制（默认 120°），图标至少一半面积在浅深两种主题上都达到 3:1。依据：apple-app-icons #2–8、#10、#12–13、#15，harmonyos-design #32–33，fluent-2 #28。一手资料。

## 论证

**三类数，三种对待。** 感知规律（Butterick 的正文三数、Hobday、Lucide、WCAG 2 的条款）来自几百年的阅读经验或稳定的感知事实，可以直接写成规则和检查项；平台数值（字阶、圆角刻度、断点、目标尺寸）每年随 WWDC、Google I/O、HDC 变化，必须带来源和日期、按目标平台取；流行名单（过度使用的字体、AI 配色）一年就会翻转，写成禁令只会制造下一轮默认。旧文把“易腐与耐久”做成每篇的固定小节，形式对了，但没有把第三类单独拎出来。

**为什么要分界面与阅读两套数。** 界面文字被扫视，阅读文字被连续读。M3 与 Windows 给界面窗格 40–60 字符，而 Butterick 给长文 45–90，两者都对，只是对象不同。混用的后果很具体：把阅读的 16 px / 1.5 倍套到数据密集的表格上会损失一半信息密度，把界面的 14 px 套到文章页上会伤眼。规格里每个文本样式都要标明它属于哪一类。

**字距的张力。** 通用规则“大字收紧”与 Apple 的表（34 pt +0.40 pt）表面冲突。原因是 SF Pro 这类字体已按光学尺寸自带紧凑的字距，官方表是在字体自身度量上的修正；在这类字体上再套 Web 式的负字距就会挤坏。Segoe UI Variable 用 `opsz` 轴自动完成同样的事。所以规则的顺序是：家族有官方表就用表，没有表才用通用规则。

**Hobday 的数怎么用。** 这些是一位设计师的经验规则，作者开篇就说“有好理由就可以打破”；12% / 7% 的亮度差来自他看过的约 100 个网站，研究没有公开，而且 HSB 亮度（RGB 三通道最大值）并不感知均匀。所以它们适合做评审的启发式和 lint 的“警告”级，不适合做“不合格”级；实现时按作者定义用 HSB 计算，并在报告里标明是启发式。

**对比度为什么只是地板。** WCAG 2 比值决定能不能上线，但通过它的方案可能正是品类的平均值（UUPM 的例子）。身份要由方向决定（anti-slop 与 directions 负责），色彩文件只保证“算过”。色彩算术是模型最不可靠、脚本最可靠的地方，所以每一对文字 / 背景都用 `color_tools.py` 计算，而不是估计——这一条沿用旧文。

**三源一致的圆角规则与收敛的断点。** 同心圆角被 Hobday、M3、Apple 三个互不引用的来源以同一公式写出，这是本篇置信度最高的布局结论。断点也出现了收敛：M3 与 HarmonyOS 都在 600 与 840 处切换，HarmonyOS 的栅格栏数也在这两处变化。对跨平台自定义产品，600 / 840 是有依据的默认；组件本身用容器查询（已是广泛可用）响应所在容器，而不是视口。

**图标：模板与家族是两件事。** Lucide 的规格是目前最适合 agent 的“画图标规则”——几乎每条都带数字、都能对着坐标检查；但“选用 Lucide 这个家族”是另一回事，它恰好是 AI 生成栈的默认。所以技能用 Lucide 的规格作为写项目图标规范的模板，家族则按产品语气在 Phosphor、Material Symbols、Fluent System Icons、平台符号之间选。应用图标是另一类交付：三大平台都已转向“分层源文件 + 系统渲染材质”，过去“交一张画好高光的 1024 PNG”的做法在 Apple 与 HarmonyOS 上都会被系统覆盖或被上架检查拒绝。Material 关键线过去被标为“未核验的通识”，本篇已在 M3 页面上核对到原文，数值与技能一致；同页还给出方头端点，与 Lucide 的圆头相反。

**相对 2026-09-21 旧文（分析 05、06）改了什么、为什么旧说法错。**
- 旧摘要说 Hobday 有 27 条，实为 28 条（“只偏暖或只偏冷”被并进了前一条），并漏掉 < 5% 的 HSB 饱和度、“亮度差按 HSB 计、来自约 100 个网站”和“越近阴影越淡”。错因是只做了要点压缩，没有逐条对照原页。
- 旧摘要把 Butterick 的 26 条压成 15 条，并把“三页以上的文档，一个感叹号足矣”写成“长文档”。
- 旧文说 Radix 11、12 级“保证可读对比（以 APCA 为目标）”，没写出具体保证是 Lc 60 / Lc 90、在同阶 2 级上，也漏了五个配深色字的色相。
- 旧文按 13 条原则总结 Lucide；现为 14 条（新增“复用已有形状”），另有一页 must / should 分级的正式规格。
- 旧文（分析 06）声称 design-icons 已含“预览页工作流与模糊测试”——当时技能里根本没有“blur”一词，这是假的；Lucide 的精确圆角规则也在传递中被稀释成“外角一个半径、内角更小”。现在 `disciplines/icons.md` 已收回完整规则与模糊测试。
- 旧文把 Material 关键线（圆 20、方 18、矩形 16 × 20 / 20 × 16）标为“未核验的通识”，技能里却作为事实出现。现已在 m3.material.io 核对，数值成立，来源补上。
- 旧文把中文正文“行高 1.6–1.8、行长 25–40 字”写得像有摘要支撑，实际 clreq 摘要里没有这些数；该内容移到 07，未找到一手来源前标为实践。
- 旧文没有 WCAG 的精确口径：大字是 24 px / 18.67 px 粗体、阈值不四舍五入、CJK 等效尺寸未定义。
- 保留的判断：正文四要素优先；“避开免费字体”按年代重读；“级即角色”让暗色与换肤成为重新映射；色彩算术交给脚本；先选家族再画；图标预览要在多尺寸、明暗两种背景下与邻居并排渲染。

## 未决问题

- CJK 文字的“大字等效尺寸”：WCAG 2.2 与 Understanding 文档都没有数字，也没找到中国标准的对应条款（GB/T 37668 见 accessibility-law，未专门核对这一点）。
- Hobday 亮度差规则基于 HSB：换成 OKLCH L 或 WCAG 相对亮度后阈值应是多少，没测过。
- 未做摘要：Evil Martians 的 OKLCH 文章（已欠两轮）、Refactoring UI、Butterick 摘要页以外的章节（行长、标题、表格）、Laws of UX 除三条外的逐条页面、NN/g 十条启发式。
- 本篇核对的 M3「Designing icons」与 Apple HIG Buttons 两页应并入 material-3-expressive 与 apple-hig-bars（或 apple-hig-liquid-glass）摘要，以便 reference 的 `sources` 能指向它们。
- Fluent 设计站与代码不一致（圆角 Large 站点 8 / 代码 6，Subtitle 1 行高 26 / 28）；M3 连接式按钮组 XS 内圆角页面写 4、token 解析为 8。均未定论，实现时以代码 / token 为准。
- HarmonyOS 的 9 个推荐图标色彩方向与排版规范的具体数值只在图片里，没有读出。
- Android 自适应图标（108 / 72 / 66 dp 安全区）、Android 16 的系统自动主题图标、PWA maskable 与 favicon 最小集合都没有一手摘要；技能里的这些数值目前只有旧技能与审计报告的转述。Apple 2025 圆角矩形的精确几何只在模板里，不要自己发明超椭圆公式。
- “过度使用”的字体与配色能否由我们自己的评测测出来（按模型家族统计输出的字体与色板，作为“已用掉的默认”），交给 evals 流。
- ARC 页面标 beta，可能无预告变化。

## 对 skill 的约束

- `skills/design-studio/references/fundamentals/typography.md`：拉丁正文基线表注明“仅拉丁文字”并引 practical-typography-key-rules；文本样式分“界面 / 阅读”两列取值；字距规则写成“家族有官方表先用表，否则通用规则”，以 SF Pro 为例；家族 ≤ 2；“过度使用”名单不写在这里，只链接 anti-slop；选字体必须渲染候选样张来看；写明 WCAG 1.4.12 的四个间距值是“必须经得起”而非“必须采用”。各平台字阶由 `platforms/*.md` 所有，本文件只链接。
- `skills/design-studio/references/fundamentals/cjk-typography.md`：中文数值的唯一所有者（见 07）；无一手来源的数标 practice；写明 CJK 大字等效尺寸在 WCAG 中未定义。
- `skills/design-studio/references/fundamentals/color.md`：对比度数值与计算方法的所有者——4.5 / 3 / 3:1 非文字、24 px 与 18.67 px 粗体、不四舍五入、渐变取中心色、前景背景必须成对指定；APCA 并列报告并引 ARC 阈值；Radix 12 级作为默认语义层；Hobday 的色彩规则标“安全默认、可有理由打破”；高对比作为一等模式；平台系统色不硬编码。合规口径与法规由 `accessibility.md` 所有，这里只链接。
- `skills/design-studio/references/fundamentals/layout-and-spacing.md`：同心圆角公式并列三个来源与 Apple 的三种形状类型；间距从高对比点量、外 ≥ 内、按钮 2:1；各平台基准单位；600 / 840 作跨平台默认断点并链接各平台表；组件用容器查询；目标尺寸列平台下限并链接 accessibility 的 WCAG 条款。
- `skills/design-studio/references/fundamentals/accessibility.md`：承接 03 的约束，并补 1.4.12 文本间距、1.4.10 重排（320 CSS px）和“CJK 大字等效尺寸未定义”。
- `skills/design-studio/references/disciplines/icons.md`：家族按语气选、不混用，写明 Lucide 是 AI 生成栈的默认；Lucide 规格作为项目图标规范模板（含 must / should）；两个模糊测试列为必须步骤；家族参数表中 Material 关键线注明来源（m3.material.io，2026-09-27），并标出方头与圆头的差异；图标与文字并排降低对比、尺寸随字号。
- `skills/design-studio/references/disciplines/app-icons.md`：应用图标规格的唯一所有者：共同原则放最前；Apple 一节按结论 20（`.icon` + SVG 分层源、Default / Dark / Mono → 六种外观、watch 1088、最多四组、不羽化、macOS 异形被收进底板、Icon Composer 版本要求）；HarmonyOS 双层 1024 PNG、背景无透明像素；Windows 48 网格与 3:1；更正旧文件的“watchOS 1024”与“四种外观”。Android 自适应图标与 favicon 的数值在补上来源前标 practice。
- `skills/critique-design/references/heuristics.md` 与 `references/rubric.md`：Hobday 的数值规则（容器边框、阴影 2 倍、亮度差、按钮内边距、同心圆角）作评审启发式；Butterick 的机械项（直引号、假省略号、双连字符、全大写字距不足、两端对齐无断词）进机械地板；发现项引用 Laws of UX 的名字作论据；图标项：描边混用、空隙 < 2 px、比邻居明显更重。
- `skills/design-studio/scripts/color_tools.py`：比值不四舍五入，输出小数位足以避免“4.50:1”与“不合格”并列；APCA 的 docstring 改为“独立的 ARC，不在 WCAG 3 草案中”；矩阵支持高对比模式；提供 `cvd` 模拟。
- `skills/design-studio/scripts/lint.mjs`：字体家族数 > 2；相邻字阶比 < 1.25（层级扁平）；正文行长超过约 80 字符；非标题文字行高 < 1.3；正文字距 > 0.05em 或 < -0.04em；阴影模糊 / 偏移比、嵌套圆角与内边距、容器与背景亮度差、按钮内边距比（均为警告级）；内联 SVG 描边宽度混用；页面中不同圆角值过多。
- `skills/design-studio/references/fundamentals/anti-slop.md`：字体与配色的“过度使用”名单只放这里，每条带日期与来源，以 Space Grotesk 为“解药会腐坏”的例证。

## 变更记录

- 2026-09-27 重写：由旧分析 05 与 06 迁入，并吸收原分析 03 中的 Hobday 与 Laws of UX 部分，全文重写。更正 Hobday 条数与数值、Butterick 条数与感叹号规则、Radix 的具体保证、Lucide 条数与新规格、“技能已含模糊测试”的假陈述、中文数值的来源过度声明；核对并补上 Material 图标关键线与 Apple 44 pt 点击区的一手来源；接下 07 移交的应用图标规格（Apple 分层与六种外观、HarmonyOS 双层、Windows 网格）；新增界面 / 阅读两套数、字距是字体属性、WCAG 与 APCA 的精确口径、高对比模式、三源一致的同心圆角、跨平台断点收敛、各图标家族参数对照；删除“易腐与耐久”“对设计 agent 的启发”等仪式性小节。
