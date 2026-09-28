# 03 界面工艺与现代 Web 平台

> 元数据：更新于 2026-09-28 · 依据：vercel-web-interface-guidelines、web-baseline-2026、wcag-22、laws-of-ux、nng-heuristics、klm-kieras、wai-aria-apg、ui-events-ime、rauno-interaction-details、carbon-notification-tooltip、apple-hig-liquid-glass、apple-hig-bars、harmonyos-design、fluent-2、impeccable、impeccable-slop-rules、chinese-copywriting-guidelines（旧分析 03 已并入）· 复核期限：2026-12-26（另有两个触发点：2026-11-13 `light-dark()` 转为“广泛可用”；web-features 每次发版）

这一篇回答两件事。第一，交互工艺——焦点、目标尺寸、加载、表单、状态这类几百个“有没有想到”的小决定——怎样保证不漏。第二，2024–2026 年进入 Baseline 的 HTML / CSS 原语怎样改变“设计稿该画什么、规格该写什么”。视觉规则（Hobday、排版、色阶、圆角）归 05；token 的 CSS 作用域与 `light-dark()` 组织法归 06；动效归 04。

## 当前结论

1. **工艺主要是“有没有想到”，不是审美；它最适合做评审的机械层和落地后的打磨层，而不是生成时的提示词。** Vercel 把面向 agent 的规则集（`command.md`）分成 16 类：无障碍、焦点、表单、动画、排版、内容、图片、性能、导航与状态、触控、安全区与布局、暗色与主题、区域与国际化、水合安全、悬停与交互态、文案，另附一份反模式清单，输出格式固定为 `file:line - finding`、干净文件写“✓ pass”。它的官方 skill 每次评审都从 `main` 实时拉取这份规则。依据：vercel-web-interface-guidelines #14。一手资料。
2. **带数字、可直接检查的交互规则**（2026-09-27）：
   - 目标尺寸：WCAG 2.5.8（AA）要求指针目标至少 24 × 24 CSS px；不足时，以目标包围盒中心画直径 24 px 的圆，只要不与别的目标或别的小目标的圆相交，也算通过；行内链接、页面别处有等效控件、UA 原生控件、必要或法定呈现可豁免。44 × 44 是 2.5.5（AAA），也是 Apple（44 × 44 pt，visionOS 60 × 60 pt）和 Fluent（iOS / web）的平台下限。依据：wcag-22 #17–18、vercel #2、fluent-2 #13；Apple HIG Buttons 页（本篇 2026-09-27 经 DocC JSON 核对）。一手资料。
   - 移动端输入框字号 ≥ 16 px（否则 iOS Safari 聚焦时缩放），且永不禁止缩放、永不拦截粘贴。依据：vercel #3。一手资料。
   - 加载指示延迟约 150–300 ms 再出现，一旦出现至少停留约 300–500 ms；加载中的按钮保留原文案并加指示；骨架屏与最终布局一致；变更类请求（POST / PATCH / DELETE）目标 < 500 ms；系统反馈 < 400 ms（Doherty 阈值）。依据：vercel #4、#11，laws-of-ux #6。一手资料。
   - 超过 50 项的列表虚拟化（或 `content-visibility: auto`）；自动播放、与内容并排且超过 5 s 的运动必须能暂停 / 停止 / 隐藏（WCAG 2.2.2，A）。依据：vercel #11、wcag-22 #24。一手资料。
3. **状态与语义是设计决定，不只是实现。** 筛选、标签页、分页、展开面板写进 URL；返回 / 前进恢复滚动；链接用 `<a>`，不用按钮或 div；乐观更新配回滚或撤销；破坏性操作要确认或给撤销窗口；状态不只靠颜色（WCAG 1.4.1）；纯图标按钮必须有可访问名称；“不要把 schema 端出来”——视觉上可省标签，可访问名称不能省；每个数据视图都要设计空、稀疏、密集、出错四态，并经得起极短与极长的用户内容。依据：vercel #5、#9，wcag-22 #9。一手资料。
4. **表单规则里有三条已经是 WCAG 2.2 条款。** 通用规则：不预先禁用提交（请求开始后才禁用并显示指示、带幂等键）；不拦截按键，先接受再校验；错误写在字段旁，提交后聚焦第一个错误；占位符是示例值而不是标签；`autocomplete`、`type`、`inputmode` 写对；有未保存修改时提醒。已成条款的三条：允许粘贴和密码管理器、不用无替代的谜题式验证（3.3.8，AA）；同一流程里不让用户重复输入已给过的信息（3.3.7，A）；所有拖拽都有单指针、非拖拽的替代（2.5.7，AA：点轨道设滑块值、看板卡片“移动到”菜单、列表上移 / 下移按钮）。依据：vercel #10，wcag-22 #19、#21–22。一手资料。
5. **焦点规则因悬浮栏而重新变得要紧。** 用 `:focus-visible`；吸顶栏、吸底栏、非模态对话框、cookie 横幅不得把获得焦点的元素**完全**遮住（2.4.11，AA；失败模式 F110，充分技术 C43 = `scroll-padding`）。焦点外观 2.4.13（AAA）：指示区面积至少等于组件 2 CSS px 周长，且同一批像素在聚焦前后有 3:1 的变化；紧贴边缘向外的 2 px 描边合格，向内缩进的 2 px 线不合格，至少要 3 px。2025 年起 iOS 26 的悬浮玻璃标签栏、HarmonyOS 的悬浮页签让“底部有常驻浮层”成为常态，所以 `scroll-padding-bottom` = 浮层高度应成为默认。依据：wcag-22 #14–16，vercel #1，apple-hig-bars #3，harmonyos-design #11。一手资料。
6. **Baseline 是设计词汇，不是实现细节。** Baseline“新近可用”= Chrome（桌面 + Android）、Edge、Firefox（桌面 + Android）、Safari（macOS + iOS）全部支持；“广泛可用”= 新近可用满 30 个月；在此之前是“有限可用”。数据以 web-features 3.40.0（2026-09-24 发布）为准。规格里每用到一个原语，就标三档之一：**原生**（Baseline，直接写）/ **原生 + 回退**（写明回退长什么样）/ **增强**（没有它也要好看、好用）。依据：web-baseline-2026 #1–2。一手资料。
7. **可以直接写进规格的原生原语**（年份为 Baseline 新近可用日期）：`popover`（2025-01，自带顶层、轻点关闭、Esc、焦点归还）；invoker commands `command` / `commandfor`（2025-12，按钮声明式打开对话框与弹层）；`<dialog>`、`inert`、`:focus-visible`、`:has()`、尺寸容器查询（广泛可用）；同文档视图过渡与 `view-transition-class`（2025-10）；`@starting-style`（2024-08）；`light-dark()`（2024-05）；相对颜色语法（2024-09）；`color-mix()` 与 OKLab / OKLCH（2025-11-09 起广泛可用）；`@scope`（2026-03）；容器样式查询（2026-05，只对自定义属性）；`field-sizing`（2026-06）；`sibling-index()` / `sibling-count()`（2026-08）；`text-wrap: balance`（2024-05）；`backdrop-filter`（2024-09）；`linear()` 缓动（2026-06-11 起广泛可用）；`prefers-reduced-motion`、`prefers-contrast`、`forced-colors`、`color-scheme`、dvh / svh / lvh（广泛可用）；`text-box` / `text-box-trim` 属性键（2026-08-18）；`text-autospace: normal` 与 `no-autospace`（2025-11-11，Chrome 140 / Firefox 145 / Safari 18.4）。依据：web-baseline-2026 #3–4、#7、#10、#12–19、#21、#23–25；`text-autospace` 为本篇对 web-features 3.40.0 `data.json` 的复查。一手资料 + 实测。
8. **只能当增强、稿子里必须画回退的**：锚点定位在特性层面仍是“有限”，但 325 个兼容键中 323 个已 Baseline，只差 `position-visibility` 的两个值——按“带已测回退可用”对待，锚定元素的动画仍是增强；可定制 `<select>`（`appearance: base-select`，无 Firefox）；跨文档视图过渡（无 Firefox）；滚动驱动动画（无 Firefox，37 个键无一 Baseline）；进出 `display: none` 的退出动画（无 Firefox）与 `overlay`（仅 Chrome）；`interpolate-size` / `calc-size()`（仅 Chrome）；`popover="hint"` 与悬停触发的 interest invokers；`<dialog closedby>`（无 Safari）；`text-wrap: pretty`（无 Firefox）；`corner-shape`（仅 Chrome）；`prefers-reduced-transparency`（仅 Chrome）；`text-autospace` 的显式值（`ideograph-alpha` 等，无 Chrome）与 `text-spacing-trim`（仅 Chromium）。`if()`、`@function`、滚动状态查询不进生产规格。依据：web-baseline-2026 #3、#5–6、#8–11、#20、#22、#26；`text-autospace` 同上。一手资料 + 实测。
9. **这些原语改变的是设计决定。** ① 弹层规格要写明 auto 还是 manual 关闭、Esc 行为、焦点归还位置，以及 `position-try-fallbacks` 的备选位置顺序；悬停触发的 tooltip 仍要 JS，且必须满足 WCAG 1.4.13（可不移开指针就关闭、指针可移上去、持续到用户离开）。② 原生 select 可以“设计”了，但 Firefox 用户看到的是经典控件——稿里画两张。③ 退出动画要能降级为瞬间隐藏。④ 聊天输入框自动增高用 `field-sizing: content`。⑤ 纯 CSS 错开用 `sibling-index()`。⑥ 组件变体可以由容器样式查询切换，不必层层传 class。⑦ 按钮、徽章的光学垂直居中用 `text-box-trim`（边值类型的 Firefox 数据缺失，用前核对）。依据：web-baseline-2026 #27–32，wcag-22 #13。一手资料 + 推论。
10. **`contrast-color()` 不能用来给正文配色。** 它 2026-04 进入 Baseline，但只返回黑或白（平局取白），算法由浏览器决定，规范只说结果“应当仍然”满足大字 AA（3:1），不保证正文 4.5:1。只能当自动回退，正文对比度自己算。依据：web-baseline-2026 #16。一手资料。
11. **Web 上的玻璃必须默认可读。** `backdrop-filter` 已是新近可用，但 `prefers-reduced-transparency` 仅 Chrome 支持，所以不能靠媒体查询让用户“退出”玻璃：先保证实色回退可读，再叠加模糊。Apple 不公布 Liquid Glass 的模糊与不透明度数值，Web 上任何仿制都是需要标注的近似；Apple 明言内容层不用玻璃。Fluent 的做法可以照搬：材质不可用（关闭透明、低端硬件、窗口失活、高对比）时自动回落到实色。依据：web-baseline-2026 #25–26，apple-hig-liquid-glass #1–2，fluent-2 #5。一手资料。
12. **对比度只用 WCAG 2 判定。** Vercel 写“感知对比优先 APCA 而非 WCAG 2”，这是 Vercel 的偏好，我们不采纳为判据：WCAG 3 工作草案（2026-09-10）的文本对比度要求写的是“@@[对比度算法待定]”，全文不提 APCA；APCA 已转为独立的 ARC 标准。APCA Lc 可以并列报告，作感知参考。依据：vercel #12，wcag-22 #25、#29–31。一手资料。
13. **现成检测器覆盖了西文 React 世界，本地规则无人覆盖。** Impeccable 的检测器有 61 条规则（49 条读源码、12 条需渲染），另有 6 条只能靠设计评审；它明说“干净的检测结果是证据，不是证明”。它的质量类规则与 Vercel 反模式大面积重合。但中英混排、全半角标点、小程序胶囊避让、中文最小字号这类规则没有任何现成工具在管——这是我们 `lint.mjs` 值得自己写的部分。依据：impeccable #25、#29，impeccable-slop-rules #12，chinese-copywriting-guidelines #10–11。一手资料 + 推论。
14. **"方便、快捷"可以数出来：交互成本 = 决定 + 寻找 + 指点 + 按键 + 等待。** NN/g 把交互成本定义为用户达成目标要付出的全部脑力与体力，并把它当作比较方案的工具；KLM（Card、Moran、Newell 1980，Kieras 1993 教学版）给出操作时间：按键 0.28 s、指点 1.1 s、点击 0.2 s、手在键鼠间移动 0.4 s、一次例行思考（找、选、回忆、确认）1.2 s。一条任务写成操作串相加，就能比较方向、改版前后、鼠标路径与键盘路径。大头通常是"想一下"（M），所以"少点一次"不如"少找一次"。依据：nng-heuristics #7，klm-kieras #2–4。一手资料（KLM 原论文未读，时间取自 Kieras 的转述）。
15. **键盘和快捷键是设计决定。** APG 的总则：Tab 在组件之间、方向键在组件之内，复合组件只占一个 Tab 位；删除或关闭后焦点要有去处；选中态和焦点态要看得出区别；网络加载的内容不"选中跟随焦点"。快捷键只给高频任务、必须同时有常规路径、不改标准键（复制、撤销、保存、查找……）、避开系统 / 读屏 / 浏览器占用的组合；单字母快捷键必须能关、能改或只在组件聚焦时生效（WCAG 2.1.4，A 级）。依据：wai-aria-apg #1–8，nng-heuristics #9，wcag-22 #32。一手资料。
16. **中文输入法是中文产品的交互地板，此前没有任何工具或规则在管。** 输入法组字期间回车是"选词上屏"，不能触发发送、提交、建标签；边打边搜、校验、字数统计要等上屏后的文字。判断依据是 `isComposing`，但 Safari 10.1–26.6 在"完成组字那一下"的 keydown 上报 false（事件顺序颠倒，WebKit bug 165004），所以要同时判 `keyCode === 229`。`KeyboardEvent.isComposing` 直到 2026-09-14（Safari 27）才进入 Baseline。无头截图无法组字，这类行为只能手测或标"待确认"。依据：ui-events-ime #1–5。一手资料 + 兼容数据。
17. **组件行为要写到"模式名没决定的部分"。** 组合框的补全类型、弹出时机、空查询显示什么；菜单的勾选项、子菜单斜向移动不关闭；toast 只放信息与成功、带操作或报错就不自动消失、说过的话事后找得到；tooltip 只放名称和非必要说明，带链接或按钮就换成 toggletip。依据：wai-aria-apg #9–11，carbon-notification-tooltip #1–7，emil-kowalski-animation #2（首个 tooltip 延迟、相邻即时）。一手资料 + 业内共识（子菜单斜向容差无一手来源）。
18. **"舒心"主要是不打扰和不丢东西。** 手势效果从第一像素跟手、途中可反悔，可逆操作可在手势中触发、破坏性操作只在松手时生效；高频操作不做动画；新到内容不把用户正在操作的行挤走；记住上次的选择、筛选、视图；草稿不丢。依据：rauno-interaction-details #2、#4、#5、#7，nng-heuristics #3–5，motion 的频率门（emil-kowalski-animation #6）。一手资料 + 推论。

## 论证

**为什么工艺放在评审层。** 模型在这些地方出错，很少是因为不会，而是因为没人要求：焦点环被吸顶栏盖住、加载指示一闪而过、筛选没进 URL、`10 MB` 中间没用不换行空格。把 16 类规则全塞进生成提示词，只会稀释对结构和层级的注意力；放在评审时逐条过，才抓得住。Vercel 自己的做法印证了这一点：规则是易腐的，所以它的 skill 不内置规则，而是在评审时拉取最新版。我们采用“带日期的快照 + 能联网时重新拉取”。

**24 还是 44。** 两个数字不矛盾，回答的是不同问题。24 px 是 Web 的合规地板（AA），并带有间距例外，适合密集的桌面工具；44 是 AAA，也是 Apple、Fluent 的触控下限，M3 是 48 dp，HarmonyOS 推荐 48、强制 40 vp（平台细节见 05 与 07）。设计默认：触控界面按平台下限做点击区，桌面密集界面至少过 24 px 圆测试；视觉小于目标时扩点击区，不放大图形。旧文写“24 × 24（含间距）”不准确：间距例外是圆测试，不是把间距算进尺寸。

**Vercel 清单的边界。** 它偏 React / Next.js：水合安全、Suspense 这类条目对 SwiftUI、小程序不适用，但 16 个分类本身通用。README 自相矛盾：一处建议用 `maximum-scale=1` 阻止 iOS 输入缩放，另一处和 `command.md` 又把它列为反模式——按 16 px 输入字号规则办，不写这个 meta。最后一节的文案规则（标题用 Title Case、用 `&` 代替 and）Vercel 自己标注为“非通用”，不进我们的规则。

**为什么把 Baseline 当设计语言。** 2024–2026 年，平台免费给出了过去要写一堆 JS 才有的东西：顶层渲染、轻点关闭、焦点归还、声明式开关对话框。设计稿若默认“自定义弹层”，实现者就会重造一个丢了无障碍行为的轮子；反过来，稿子若画的是只有 Chrome 能渲染的效果（可定制 select、滚动驱动视差）却不画回退，这张稿子对 Firefox 用户就是在说谎。所以规格里的每个原语都带状态，而可移植 HTML 稿本身在 Baseline 的地方就用原生元素，让稿子的行为和产品一致。

**粒度陷阱：看你实际用的那个值。** web-features 的“特性”层级会被最弱的一个值拖累。锚点定位被 `position-visibility` 的两个值拖成“有限”；`text-autospace` 也一样：web-baseline-2026 #26 把它整体列为有限（Firefox 145、Safari 27），而 chinese-copywriting-guidelines #11 说它 2025-11-11 已是 Baseline。本篇复查 web-features 3.40.0：两者都对——`normal` / `no-autospace` 两个值的兼容键是 Baseline（Chrome 140 / Firefox 145 / Safari 18.4），显式值与 `insert` 不是，特性整体因此“有限”。规则：判断是否可用时，查你写进规格的那个值的兼容键。

**相对 2026-09-21 旧文（分析 03）改了什么、为什么旧说法错。**
- 旧文说“APCA 仍是草案，法律与合规参照仍是 WCAG 2.x”，后半句对，前半句不准确：APCA 2023 年起就不在任何 WCAG 3 草案里，2026-09-10 的草案对比度算法仍是“待定”，APCA 现在是独立的 ARC。错因是沿用了 Vercel 的表述，没有打开 WCAG 3 草案本身。旧文“两个都报”的做法保留，口径改为“WCAG 2 判定，APCA 参考”。
- 旧文把 24 px 目标尺寸引自 Vercel。一手来源是 WCAG 2.5.8，而且它有圆测试这个例外；旧摘要当时从未读过 WCAG 2.2 原文。
- 旧文只读了 Vercel 的 README，漏掉了 `command.md`（面向 agent 的规则集、反模式、输出格式）和“评审时实时拉取”的机制，也漏了水合安全输入、Windows 暗色模式下原生 select 要显式设色、字体子集、Safari 用 `<picture>` 里的 MP4 代替 GIF 等新增条目。
- 旧文说 NN/g 十条启发式“抓取当日不可达”，那是一次网络偶发，今天可达；名称已收入 laws-of-ux 摘要，正文仍未单独摘要。
- 旧文完全没有 Web 平台能力这一层，技能里对已是 Baseline 的特性还写着“where supported”。错因是把现代 CSS 当成实现细节交给了 implement-design，没意识到它改变设计决定（弹层关闭方式、原生 select、退出动画的降级）。
- 旧文“对最终 skill 的影响”指错过位置：容器与背景亮度差规则在 color.md，不在 layout-and-spacing.md（该规则现归 05）。
- 保留的判断：规则做检查层而非生成提示；带数字的规则集中在一处，各处引用；Vercel 的文案偏好不通用。

## 未决问题

- 可定制 select、跨文档视图过渡、滚动驱动动画在 Firefox 的时间表：没读任何浏览器路线图。Interop 2026 的入选只说明各家会投入，不预示发布日期。
- `text-box-edge` 的边值类型（`cap`、`alphabetic` 等）没有 Firefox 数据：是缺数据还是真不支持，未核实。
- `position-anchor` 兼容键的 Baseline 日期是 2026-09-14（Chrome 151），而 Chrome 125 就发布了锚点定位；疑为兼容数据修订，未查。
- NN/g 十条启发式、Vercel 仓库里的 `AGENTS.md` 与 vercel.com 发布页未做摘要或比对。
- 我们的截图流程（`capture.mjs` / `shot.sh`）在无头浏览器里截“打开状态的 popover / dialog”是否稳定（顶层渲染、`@starting-style` 的首帧），没有测过；可移植稿改用原生弹层前应先测一次。
- 2026-11-13 `light-dark()` 转为广泛可用后，能力表要改档；下一个 web-features 版本发布后整表重拉比对。
- KLM 没有触屏操作符（点按、滑动、捏合）；套件把一次点按近似为 P，未读触屏 KLM 扩展。
- 子菜单"斜向移动容差"、拖拽的键盘拾取（Space 拿起、方向键移动）目前是业内共识，没有一手来源；Android 输入法的按键事件形态未读。
- IME 规则只读了 Web 规范；UIKit、Android、HarmonyOS、小程序 `input` 的组字模型未读。

## 对 skill 的约束

- `skills/design-studio/references/platforms/web.md`：**能力表的唯一所有者。** 每行：原语 · 状态（新近 / 广泛 / 有限）· Baseline 日期 · 推算的广泛可用日期（标“推算”）· 三档（原生 / 原生 + 回退 / 增强）· 设计后果 · 回退长什么样。表头写数据来源版本（web-features 3.40.0）和复核触发点。已是 Baseline 的特性不再写“where supported”。写明“按值查兼容键”的粒度规则（锚点定位、`text-autospace` 两个例子）。
- `skills/design-studio/references/fundamentals/modern-css.md`：只讲“CSS 作为设计材料能让设计师多规定什么”（颜色派生、容器查询、`@scope`、`text-box-trim`、`field-sizing`、`sibling-index()`），每项只标三档标签并链接 web.md，不重复日期和版本号（一条规则只有一个所有者）。写明 `contrast-color()` 只保证约 3:1。
- `skills/design-studio/references/disciplines/product-ui.md`：默认弹层契约 = 原生 popover / dialog 的行为（auto / manual、Esc、焦点归还、备选位置）；加载时序 150–300 ms / 300–500 ms、变更 < 500 ms、反馈 < 400 ms；URL 即状态；乐观更新 + 撤销；空 / 稀疏 / 密集 / 出错四态；表单规则含 3.3.7、3.3.8；每个拖拽交互给出 2.5.7 的替代；tooltip 满足 1.4.13；可定制 select 只在画出 Firefox 回退时使用。加载时序的数值只写在这里，motion.md 只链接。
- `skills/design-studio/references/disciplines/ai-experience.md`：输入框用 `field-sizing: content`；textarea 中 ⌘ / Ctrl + Enter 提交；流式状态与校验用 polite 的 `aria-live`。
- `skills/design-studio/references/fundamentals/accessibility.md`：2.5.8 按原文写（24 px 盒或 24 px 圆测试 + 四类豁免），44 标为 AAA 与平台下限；`:focus-visible`；2.4.11 配“悬浮栏高度 = `scroll-padding`”的默认；2.4.13 作推荐的 AAA 目标；“WCAG 2 是唯一合规测试，APCA 只并列参考”写在这里，其他文件链接。
- `skills/design-studio/references/fundamentals/materials.md`：玻璃面默认可读、实色回退优先；不依赖 `prefers-reduced-transparency`；Web 上的玻璃是标注过的近似；内容层不用玻璃。
- `skills/design-studio/references/fundamentals/portable-mockups.md` 与 `assets/mockup-kit/`：Baseline 的地方用原生元素（`<dialog>`、`popover`、`<details>`），使稿子行为与产品一致；稿中出现“增强”档原语时，同时渲染无该特性时的样子，或在稿上注明。
- `skills/critique-design/references/heuristics.md`：以 Vercel `command.md` 的 16 类 + 反模式清单作为 Web 机械地板，注明快照版本（vercel-web-interface-guidelines @e3d624b）并在能联网时重新拉取；剔除 Vercel 专属文案规则；发现项用 Before | After | Why 行。
- `skills/design-studio/scripts/lint.mjs`：可确定检测的项——`transition: all`；`outline: none` 而无替代焦点样式；`user-scalable=no` / `maximum-scale=1`；图片缺尺寸；纯图标按钮无可访问名称；输入框无标签；用 div / span 的点击做导航；移动视口下输入框字号 < 16 px；目标 < 24 px 且不过圆测试；320 px 宽下出现横向滚动（1.4.10）；聚焦元素被 fixed / sticky 元素完全遮住（2.4.11）；暗色主题缺 `color-scheme`；原生 select 未显式设置 `background-color` 与 `color`。
- `skills/implement-design/references/stacks.md`：Web 一节按上表映射原语及其状态（popover、invoker commands、dialog、锚点定位 + 回退、`@scope`、`light-dark()`、相对颜色、`contrast-color()` 的限制、`field-sizing`、`text-box`），并收水合安全输入、`Intl.*` 格式化、视频代替 GIF。
- `skills/design-studio/references/disciplines/interaction.md`（0.9.0 新增）：**交互成本、键盘模型、快捷键、输入法、组件行为表、顺手默认值的唯一所有者。** 加载与响应时间的数值仍只写在 product-ui（0.1 / 1 / 10 s 三档随 0.9.0 加入），动效的频率门仍只写在 motion。
- `skills/design-studio/templates/surface-contract.md`：Operate 界面加"Task cost"块；评审按截图重算。

## 变更记录

- 2026-09-27 重写：由旧分析 03 迁入并全文重写。Hobday 视觉规则与 Laws of UX 移到 05；新增 Web 平台能力层（web-features 3.40.0 的 Baseline 状态、三档标注、原语如何改变设计决定、粒度陷阱）、WCAG 2.2 的表单 / 拖拽 / 焦点条款、玻璃的 Web 回退、现成检测器的覆盖边界；更正 APCA“仍是草案”、24 px 规则的出处与写法、Vercel 只读 README 三处；复查并更正 `text-autospace` 的状态粒度；删除“易腐与耐久”“对设计 agent 的启发”等仪式性小节。
- 2026-09-28 补充：新增结论 14–18（交互成本与 KLM、键盘与快捷键、中文输入法、组件行为、顺手默认值），依据新增的 nng-heuristics、klm-kieras、wai-aria-apg、ui-events-ime、rauno-interaction-details、carbon-notification-tooltip 与 wcag-22 #32；对 skill 的约束加 interaction.md 与 surface contract 的 Task cost 块。NN/g 十条启发式此前只在 laws-of-ux 摘要里提到名字，现在有了单独摘要。
