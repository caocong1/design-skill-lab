# 04 动效

> 元数据：更新于 2026-09-27 · 依据：material-3-expressive、material-motion-tokens、emil-kowalski-animation、emil-kowalski-skills、web-baseline-2026、wcag-22、apple-hig-liquid-glass、fluent-2、vercel-web-interface-guidelines、impeccable-slop-rules、anthropic-frontend-design-skill、taste-skill、dtcg-2025-10、design-md-spec；另 Apple SwiftUI `Spring` 文档（DocC JSON，本篇 2026-09-27 核对，尚无摘要）· 复核期限：2026-12-26（Compose 的 Expressive API 仍在 1.5.0-alpha 里毕业，易腐）

动效回答三个问题：要不要动、用什么动、怎么证明它动对了。2026 年的变化是：Material 把动效从“缓动曲线 + 时长”换成弹簧物理，并分出 expressive / standard 两套方案；`linear()` 在 2026-06 成为 Web 上广泛可用的特性，弹簧第一次能在纯 CSS 里忠实表达；而 Emil Kowalski 把 Web 动效手艺写成了 agent 能执行的规则和评审契约。本篇给出“弹簧优先”的 token 立场、姿态默认值和减弱动效的设计法。交互规则中的加载时序归 03；token 文件格式归 06。

## 当前结论

1. **先按频率决定要不要动，再谈怎么动。** 一天触发 100 次以上或由键盘触发（快捷键、命令面板、按键导航列表）：不动。一天几十次（悬停、工具里切标签、选中行）：不动，或只做很短的颜色 / 透明度变化。偶尔（对话框、抽屉、toast、路由切换）：用标准 token。很少（引导、首次创建、长任务成功）：才可以放那一个“惊喜”。依据：emil-kowalski-animation #1、#3、#6（Raycast 打开不做动画“而且感觉就是对的”）。一手资料 + 业内共识。
2. **每个动效必须能说出职责。** 合法职责：反馈（按下被接收）、空间连续（从哪来回哪去）、状态指示、解释（这个变成了那个）、避免突兀的跳变；“惊喜”只允许出现在很少的那一档。“好看”不是职责。Vercel 的说法等价：“只为说明因果或刻意的惊喜而动”。依据：emil-kowalski-animation #6，vercel-web-interface-guidelines #7。一手资料。
3. **可打断性决定技术。** 用户可能中途反悔的交互（悬停、开关、拖拽、快速导航）必须能从当前状态转向：CSS transition 会重新定向但丢掉速度，弹簧保留速度，固定 keyframes 两者都做不到。高频触发的元素只用 transition 或弹簧。依据：emil-kowalski-animation #1、#10、#13，material-motion-tokens #3。一手资料。
4. **弹簧是跨平台最稳的 token：一对数字处处同义。** 物理记法（阻尼比 ζ、刚度 k、质量 1；Material、Compose、ArkUI）与感知记法（时长 d、回弹 bounce；SwiftUI、UIKit、Flutter）互换：d = 2π / √k，bounce = 1 − ζ；过阻尼时 bounce 为负。Apple 自己的换算例子：`Spring(duration: 0.5, bounce: 0.3)` = 质量 1、刚度 157.9、阻尼 17.6，即 ζ = 0.7；`Spring(mass: 1, stiffness: 100, damping: 10)` = 时长 0.63 s、回弹 0.5。SwiftUI 预设 `.smooth` / `.snappy` / `.bouncy` 默认时长都是 0.5 s，基础回弹分别为 0 / 0.15 / 0.3。Apple 对时长的定义是“约等于收敛时间，回弹很大时则是振荡周期”。依据：Apple SwiftUI `Spring`、`init(duration:bounce:)`、`snappy(duration:extraBounce:)` 等页面（本篇核对），material-motion-tokens #9。一手资料 + 实测。
5. **Material 有两套弹簧，旧文标错了。** Token 为 `md.sys.motion.spring.{fast|default|slow}.{spatial|effects}`，方案在产品层选定，不写进 token 名。数值（ζ / k）：

   | token | expressive | standard |
   | --- | --- | --- |
   | fast.spatial | 0.6 / 800 | 0.9 / 1400 |
   | default.spatial | 0.8 / 380 | 0.9 / 700 |
   | slow.spatial | 0.8 / 200 | 0.9 / 300 |
   | fast / default / slow .effects | 1.0 / 3800、1600、800 | 同左 |

   空间类（位置、尺寸、旋转、圆角）可过冲，效果类（颜色、透明度）永不过冲；按覆盖面积选速度：小组件 fast、局部屏幕 default、全屏 slow；一个被按下的按钮同时用 fast spatial（形状）和 fast effects（颜色）。Material 建议**大多数产品用 expressive**，工具型产品用 standard。但代码现实相反：Compose 普通 `MaterialTheme` 默认 standard，只有 `MaterialExpressiveTheme` 默认 expressive；稳定版 material3 1.4.0（2025-09-24）的整套 motion scheme API 都是 `internal`，稳定版应用拿不到 expressive，要用 1.5.0-alpha（最新 alpha29，2026-09-23）；Android Views 的六个 `motionSpring*` 属性只有 standard 值，且“尚未接入组件”。Material 还说数值按设备类别（手表 / 手机 / 平板）不同，公开的只有手机值。依据：material-3-expressive #4–12、#35–38，material-motion-tokens #2–11。一手资料。
6. **Web 上用 `linear()` 采样弹簧，比 Material 自己给的 cubic-bezier 替身更忠实。** `linear()` 自 2026-06-11 起广泛可用。本篇计算（质量 1，从静止出发）：CSS 必须运行到收敛时间 T（与终点误差 < 0.1%）才不会在末尾跳一下，T 约为感知时长 d 的 1.33–1.64 倍：

   | 弹簧 | d | 过冲 | T（0.1%） | Material Web 替身 |
   | --- | --- | --- | --- | --- |
   | standard 空间 fast / default / slow | 168 / 237 / 363 ms | 0.15% | 224 / 317 / 484 ms | 同一条曲线，350 / 500 / 750 ms |
   | expressive 空间 fast / default / slow | 222 / 322 / 444 ms | 9.5% / 1.5% / 1.5% | 359 / 435 / 599 ms | 350 / 500 / 650 ms |
   | 效果类 fast / default / slow | 102 / 157 / 222 ms | 0 | 150 / 231 / 326 ms | 150 / 200 / 300 ms |
   | SwiftUI smooth / snappy / bouncy（d 0.5 s） | 500 ms | 0 / 0.6% / 4.6% | 735 / 697 / 819 ms | — |

   Material 的 cubic-bezier 能复制第一次过冲的幅度（expressive fast 的 `0.42, 1.67, 0.21, 0.90` 峰值 1.092，对应弹簧的 9.5%），但只有一次过冲、没有回摆；standard 的替身时长比弹簧收敛时间长约 1.5 倍，会显得拖。CSS 的代价：被打断时从头开始、不接力速度，所以手势驱动（拖拽释放、带动量的抽屉）仍要 JS 或平台弹簧。依据：web-baseline-2026 #24，material-3-expressive #10；表中 d、过冲、T 与曲线峰值为本篇计算。实测（推导）+ 一手资料。
7. **默认值跟着目标平台姿态走，这里有一个真实的张力。** 自定义 Web / 跨平台品牌：少弹或不弹——standard 弹簧或 ease-out 曲线；回弹 0.1–0.3 只给带动量的拖拽释放或明确活泼的品牌（Emil）；Impeccable 把“常规 UI 上的弹跳 / 弹性缓动”列为 AI 痕迹。Android 原生：按 Material 用 expressive（工具型用 standard），交接时标注 Compose 版本要求。iOS / iPadOS / macOS：用系统弹簧与系统转场，只为自定义时刻写规格；Liquid Glass 控件自带弹性行为，不要重新规定。Windows：Fluent 曲线，直接进入 `cubic-bezier(0,0,0,1)` 167 / 250 / 333 ms，直接退出 167 ms 且总配淡出，淡入淡出 83 ms 线性。张力在于：Material 建议“大多数情况”用会过冲 9.5% 的 expressive，而 Emil 和 Impeccable 都把回弹当例外。依据：emil-kowalski-animation #10，impeccable-slop-rules #9，material-motion-tokens #2，apple-hig-liquid-glass #7，fluent-2 #25。一手资料（张力的调和见“论证”，属推论）。
8. **不用弹簧时的时长与曲线。** 多数 UI 动画 < 300 ms：按下 100–160 ms，tooltip 与小弹层 125–200 ms，下拉 150–250 ms，模态与抽屉 200–500 ms；退出比进入短约 20%；进入 / 退出用 ease-out，屏上从 A 移到 B 用 ease-in-out，悬停与颜色用 ease，恒速过程（进度、跑马灯、按住确认）用 linear；UI 上不用 ease-in。内置关键字曲线太弱，用自定义曲线：`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`、`--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`、`--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`（Emil @d16ebe6）。Material 旧的缓动（standard `0.2, 0, 0, 1`、emphasized decelerate `0.05, 0.7, 0.1, 1`）与时长刻度（50–1000 ms 四档）现在只是弹簧的回退。依据：emil-kowalski-animation #2、#7–8，material-motion-tokens #13。一手资料。
9. **物理感规则（全部可检查）。** 进入从 `scale(0.9–0.97)` + 透明度 0 开始，永不从 `scale(0)`；按下 `scale(0.97)`（0.95–0.98）；弹层的 `transform-origin` 对准触发器，模态对话框例外、保持居中；toast 从哪条边进就从哪条边出；tooltip 组第一个有延迟，之后的邻居立即出现且无动画；只动 `transform` 与 `opacity`（`clip-path` 是被认可的第四个，`blur()` 保持在 20 px 以下），从不 `transition: all`；悬停动效只在 `@media (hover: hover) and (pointer: fine)` 下生效；错开 30–80 ms，且错开期间不阻塞交互；SVG 变换放在 `<g>` 上并设 `transform-box: fill-box`。依据：emil-kowalski-animation #2–3、#9、#12–15，vercel-web-interface-guidelines #7。一手资料。
10. **减弱动效是一份设计，不是开关。** `prefers-reduced-motion` 的意思是“更少、更轻”，不是“没有”：保留颜色与透明度反馈，去掉位移、缩放、视差；有过冲的弹簧换成无过冲。Apple 的 Reduce Motion 会降低玻璃效果强度并关掉弹性行为；Fluent 要求提供“无动效”设置。WCAG：自动开始、与内容并排、超过 5 s 的运动要能暂停（2.2.2，A）；每秒闪烁不超过 3 次（2.3.1，A）；交互触发的动效可被关闭（2.3.3，AAA，由减弱列满足）。`prefers-reduced-motion` 2022-07 起广泛可用。全局 `*{animation-duration: .01ms !important}` 是实现者给“没人设计过的代码”的兜底，不是设计。依据：emil-kowalski-animation #15，apple-hig-liquid-glass #7，fluent-2 #25，wcag-22 #24，web-baseline-2026 #24。一手资料。
11. **Web 动效技术的状态（2026-09-27）。** 可当原生用：CSS transition、`@starting-style` + `transition-behavior: allow-discrete`（2024-08，进入动画不需 JS）、同文档视图过渡与 `view-transition-class`（2025-10）、`::details-content`（2025-09）、`sibling-index()`（2026-08）、`linear()`（广泛可用）。必须带静态回退：跨文档视图过渡与滚动驱动动画（均无 Firefox）、进出 `display: none` 的退出动画（无 Firefox）与 `overlay`（仅 Chrome）、`interpolate-size` / `calc-size()`（仅 Chrome）、元素级视图过渡（仅 Chrome）、锚定元素的动画。所以退出要设计成能降级为瞬间隐藏；展开到 `height: auto` 的可移植做法仍是 `grid-template-rows: 0fr → 1fr`。依据：web-baseline-2026 #7–11、#21、#24–25、#30。一手资料。
12. **动效在交换格式里没有完整位置。** DTCG 2025.10 有 `duration`、`cubicBezier`、`transition`（三字段必填，但说不出“动哪个属性、从哪到哪”），没有 spring，也没有 `linear()`；弹簧参数放 `$extensions`（反向域名键）或成对的 `number` token。DESIGN.md 没有动效词汇，自定义 `motion:` 块会被警告并在导出时丢弃，动效个性只能写成散文章节。依据：dtcg-2025-10 #18–19，design-md-spec #19（均见 06）。一手资料 + 实测。
13. **agent 看不见动画，所以“看过”必须被制造出来。** 演示要能重播、能慢放到 0.25× / 0.1×、能切减弱动效、能切方案；快速连点检验打断；按时间点冻结抽帧拼成联系表再看；没看就如实说没看。评审沿用 Emil 的契约：发现项写成 Before | After | Why 一张表，“默认标记，批准要挣来”，结论明确写 Block 或 Approve；修正次序是先删、再减、再修缓动、再修原点与物理感、再做可打断、再挪到合成层、再做非对称时序，最后才打磨与补无障碍。依据：emil-kowalski-skills #4–7，emil-kowalski-animation #16。一手资料 + 业内共识。
14. **动效的 AI 痕迹是带日期的，而且解药会腐坏。** 2025-11 Anthropic 的文章把“一次编排好的、错开 `animation-delay` 的首屏入场”当作提升品质的解药；到 2026-09，同一个 frontend-design skill 已把“每个区块淡入上滑、每张卡片都有悬停过渡”列为“读起来像 AI 生成”。Impeccable 2026-09 的动效痕迹：脉动状态点、装饰性闪烁光标、自动跑马灯、常规 UI 上的弹跳缓动、会改变布局的动画、悬停时缩放 / 旋转的图片。taste-skill 的动效 4–7 档直接写 `transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`——既违反“永不 transition: all”，这条 expo-out 曲线也已成为 AI 页面的签名。依据：anthropic-frontend-design-skill #7、#16，impeccable-slop-rules #9，taste-skill #8。一手资料。

## 论证

**为什么频率比时长重要。** 频率解释了“精致的 400 ms 动画”为什么在高频场景里反而是缺陷：一天看三百次的东西，每次 400 ms 就是两分钟的等待，而且键盘用户期待的是“按下即到”。所以决策顺序是先过频率门槛、再问职责、再选工具，最后才调数值。这是旧文最有价值的判断，保留。

**为什么弹簧优先，以及它不是万能的。** 弹簧有两个曲线没有的性质：被打断时从当前位置和速度继续；一对参数在 Compose、SwiftUI、ArkUI、Motion 里意思相同，交接不会失真。`linear()` 进入广泛可用后，非手势的弹簧在纯 CSS 里也能忠实表达，而曲线的形状只取决于 ζ，一个 ζ 一条 `linear()`，时长只换 T。但 CSS 形式仍然丢速度、会从头重播，所以手势驱动的动效（拖拽释放、跟手抽屉）必须交给平台弹簧或 JS 库；DTCG 也没有 spring 类型，token 文件里只能用扩展字段。

**d 和 T 为什么都要。** Apple 说感知时长“约等于收敛时间”。本篇算出，对 ζ = 1 的 `.smooth`，收敛到 2% 以内要 464 ms，确实接近 d = 500 ms；但 CSS 动画在 T 时刻被强制到终点，若按 2% 截断，400 px 的抽屉末尾会跳 8 px。所以语义层用 d（设计师的语言、平台 API 的参数），CSS 层用 0.1% 的 T，两者都进 token。

**Material expressive 与品牌中性默认怎么调和。** Material 为 Expressive 引用的证据（46 项研究、18,000 多名参与者、关键元素被发现得快 4 倍；material-3-expressive #1）针对的是整套 Expressive 设计——形状、颜色、强调字体、容器、动效一起——而不是“回弹”本身；Material 自己也建议全产品只留“一到两个高光时刻”（同上 #3）。再看数值：9.5% 的大过冲只在 fast spatial（开关、按钮这类小组件）上，default 与 slow 是 ζ 0.8、1.5%。所以结论是按姿态分：Android 原生照 Material 走，因为用户每天在系统里看到的就是它；自定义品牌从 standard 起步，回弹要由品牌性格“挣来”。

**两处旧矛盾的收口。** 旧技能一处说“菜单立即出现”，另一处给菜单 fast / base 的 ease-out 进入，规格示例又写 fast。收口为：“菜单在出现的那一帧就可用，透明度与缩放 150 ms 内完成，从不延迟输入”。错开也曾看似矛盾：Emil 推荐 30–80 ms 的错开，frontend-design 把“每个区块淡入上滑”列为 AI 痕迹。两者并不冲突：前者是偶尔出现的视图里一组兄弟元素的入场、且不阻塞交互，后者是滚动时处处触发的装饰。

**相对 2026-09-21 旧文（分析 04）改了什么、为什么旧说法错。**
- 旧文把 0.9 / 1400、0.9 / 700、0.9 / 300 称为“Material 的新弹簧方案（M3 Expressive）”。**这是错的**：那是 standard 方案；expressive 是 0.6 / 800、0.8 / 380、0.8 / 200。错因：当时只读了 MDC-Android 的 Motion 文档，它只列 standard 且不区分方案，没有打开 Compose 的 token 源码。后果：技能说“Material 的方案”却给了工具型方案，也无法表达“本产品用 expressive”。
- 旧文没有说 Material 推荐哪套（expressive）、Compose 默认哪套（standard）、稳定版能不能用（不能，要 1.5.0-alpha）。
- 旧文把“用时长与回弹描述 Apple 弹簧”标为“通识，未核验”。现已按 SwiftUI 文档核对：换算关系、预设的默认时长与基础回弹都成立。
- 旧文引 Emil 的“模态 / 抽屉 200–300 ms”来自旧文章节选；他 2026 年发布的 skill 写的是 200–500 ms。
- 旧技能对已是 Baseline 的特性写“where supported”；现在逐项标状态。
- 旧文保留的判断：动效是功能层；频率决定强度；可打断性决定技术；空间 / 效果二分；按覆盖面积选速度；退出快于进入；原型必须自带重播、慢放与减弱开关。

## 未决问题

- Material 按设备类别（手表 / 平板）的弹簧值没有公开数字；Material 也没说减弱动效时 expressive 应回退到什么。
- HarmonyOS 的动效曲线与弹簧参数没有摘要；harmonyos-design 只记了 HarmonyOS Symbol 的动效策略，且页面自相矛盾（列出 9 种，又说“7 种动态效果”）。技能里 `curves.springMotion(response, dampingFraction)` 与 (d, ζ) 的对应没有一手来源。
- 技能里 Motion（JS）“visualDuration 内部按 1.2 缩放、默认回弹不为 0”和 Flutter `SpringDescription.withDurationAndBounce` 的说法没有 source 摘要；Android“移除动画”= animator duration scale 0 属通识。
- Apple HIG 的 Motion 页与 WWDC“Designing Fluid Interfaces”没有摘要；emil-kowalski-skills 里的阻尼 / 响应表是 Emil 对 WWDC 的转述，不是 Apple 发布的 token。
- 冻结抽帧（通过 `document.getAnimations()` 设 `currentTime`）对 CSS 与 WAAPI 有效，对 JS 驱动的弹簧库无效；对 `linear()` 弹簧的抽帧是否与设备上的观感一致，没有做过对照。
- 建议补 source 摘要：`apple-swiftui-spring`（或并入 apple-hig-liquid-glass），以及 HarmonyOS 动效页。

## 对 skill 的约束

- `skills/design-studio/references/disciplines/motion.md`（决策的唯一所有者）必须写明：频率门槛表放第一步；职责清单；可打断性；按姿态的默认值表（自定义 Web 少弹或不弹；Android 原生 expressive / standard 并注明 Compose 限制；iOS 系统弹簧、不重写系统转场与玻璃动效；Windows Fluent；HarmonyOS 系统动效）；规格每一行必须有“减弱”列，含“不动”的行；WCAG 2.2.2 / 2.3.1 / 2.3.3；Web 技术表的状态取自 web-baseline-2026，不写“where supported”；演示与抽帧流程（0.25× / 0.1×、重播、减弱开关、方案切换、联系表），以及“没看就声明未验证”。加载时序只链接 product-ui，不重复。
- `skills/design-studio/references/disciplines/motion-tokens.md`（数值的唯一所有者）：四种记法与换算（含过阻尼）；M3 两列明确标 standard / expressive，并写“Material 推荐 expressive、Compose 默认 standard、稳定版 1.4.0 不可切换”；d 与 T 的区别及收敛容差（0.1%）；每个 ζ 一条 `linear()`；SwiftUI 预设（0.5 s；0 / 0.15 / 0.3）引 Apple 文档；Material 的 cubic-bezier 表作回退，并注明 standard 替身时长长于弹簧收敛；Emil 的时长与曲线标“@d16ebe6”；Fluent 表；DTCG `$extensions` 形状。任何不在摘要里的数值（Motion 的 1.2 系数、ArkUI 映射、Flutter）要么补来源，要么标 practice。
- `skills/design-studio/templates/tokens.css`：动效 token 按 spatial / effects × fast / default / slow 命名，方案用一个属性切换（如 `[data-motion-scheme]`）；附一段减弱动效的覆盖块，把空间类换成透明度或效果类。
- `skills/design-studio/templates/motion-demo.html`：速度控制通过 `document.getAnimations()` 设 `playbackRate`；`?moment=&t=` 冻结到指定时刻；减弱开关；方案切换。
- `skills/design-studio/references/platforms/android.md` 与 `references/process/handoff.md`：交接中出现 expressive 方案时标注“需要 material3 1.5.0-alpha 与 `MaterialExpressiveTheme`；Views 的 MDC 弹簧尚未接入组件”。
- `skills/design-studio/references/platforms/ios.md`：系统转场与玻璃动效不重新规定；写明 Reduce Motion 对玻璃的影响。
- `skills/critique-design/references/heuristics.md`：Emil 的 14 条“一眼可判”触发项作为动效机械地板（数值由 motion-tokens 所有，这里只引用）；Before | After | Why 行；修正次序。
- `skills/design-studio/scripts/lint.mjs`：`transition: all`；keyframes 或 `@starting-style` 里的 `scale(0)`；进入 / 退出用 `ease-in`；对 `width` / `height` / `top` / `left` / `margin` / `padding` 做动画；悬停规则不在 hover / pointer 媒体查询内；存在动画却没有 `prefers-reduced-motion` 分支；无限循环的装饰动画；UI 过渡超过 500 ms（警告）。
- `skills/design-studio/references/fundamentals/anti-slop.md`：结论 14 的动效痕迹按日期与来源列出，并以“解药会腐坏”为例证；不写成绝对禁令。
- `skills/design-studio/references/process/system.md`：DESIGN.md 中动效个性用一句散文（如“冷静精确：短减速、不回弹、不循环”）写在追加章节，不写自定义 YAML。
- `skills/implement-design/references/stacks.md`：Web 工具阶梯（transition → `@starting-style` → keyframes → WAAPI → 弹簧库）；Compose 从 `MaterialTheme.motionScheme` 取规格；SwiftUI `spring(duration:bounce:)`；各平台的减弱动效开关。

## 变更记录

- 2026-09-27 重写：由旧分析 04 迁入并全文重写。更正“0.9 系弹簧 = M3 Expressive”的错误，补上 expressive 数值、Material 的推荐与 Compose 的代码现实；按 SwiftUI 文档核验弹簧换算与预设；新增 `linear()` 采样的 d / T 计算及与 Material Web 替身的对照、按姿态的默认值与其张力、减弱动效的设计法、Web 技术的 Baseline 状态、token 格式的空缺、agent 评审契约、带日期的动效痕迹；删除“易腐与耐久”“注意”等仪式性小节。
