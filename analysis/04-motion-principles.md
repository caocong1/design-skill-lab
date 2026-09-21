# 动效原则：Emil Kowalski 与 Material 动效 token

> 分析版本：1.0 ｜ 最后更新：2026-09-21 ｜ 覆盖来源：Emil Kowalski《Great Animations》《7 Practical Animation Tips》、Material 3 动效 token（含 M3 Expressive 弹簧方案）｜ 版本见 `analysis/SOURCE_INDEX.md`

一个来源给"手感"，一个来源给"体系"。Emil 的两篇短文是目前把 Web 动效工艺讲得最可执行的文字；Material 的 token 表则示范了一个产品如何把动效变成可复用的变量。摘要见 `raw/docs/emil-kowalski-animation.md`、`raw/docs/material-motion-tokens.md`。

## 核心观点

- **动效是功能层，不是装饰层。** 它的工作是：确认输入被收到、解释"这个变成了那个"、说明东西从哪来回哪去、把注意力引到唯一变化处、让等待显得更短。装饰是最后也是最小的理由。
- **频率决定强度。** 一天被触发几百次的交互、以及一切键盘触发的动作，动画应当极短或没有。这条比任何时长数值都重要，因为它解释了为什么"精致的 400 ms 动画"在高频场景里反而是缺陷。
- **可打断性决定技术选型。** 用户可能中途改变主意的地方（拖拽、悬停、快速切换），动画必须能从当前状态平滑转向——弹簧或 CSS transition 可以，固定关键帧不行。
- **Material 的新弹簧方案按"动了多大面积"选速度，按"动的是什么"分两类。** 空间类（位置、尺寸、形状）用略欠阻尼的弹簧（阻尼比 0.9），允许一点过冲；效果类（颜色、透明度）用临界阻尼（1），绝不过冲。一个按下的按钮同时用两根弹簧。这个拆分与平台无关，可以直接搬到 Web。

## 关键规则与数值

- 多数 UI 动画 < 300 ms；示例：下拉选择 180 ms 好于 400 ms。
- 按下反馈：`:active { transform: scale(0.97) }`。
- 不从 `scale(0)` 进入；从 0.9 以上（示例 0.93）配合透明度。
- 进入与退出都用 ease-out（起步快，读作"响应快"）；避免对用户在等的东西用 ease-in；自定义曲线优于关键字曲线。
- 弹层 `transform-origin` 对准触发器，而不是默认中心。
- 工具提示：第一个有延迟，同组后续的立即出现。
- 实在不顺时，过渡期间加 `filter: blur(2px)` 作为最后手段。
- 只动 `transform` 与 `opacity`；优先 CSS / WAAPI。
- Material 缓动：standard `0.2, 0, 0, 1`；standard decelerate `0, 0, 0, 1`；standard accelerate `0.3, 0, 1, 1`；emphasized decelerate `0.05, 0.7, 0.1, 1`；emphasized accelerate `0.3, 0, 0.8, 0.15`。
- Material 时长刻度：short 50/100/150/200，medium 250/300/350/400，long 450/500/550/600，extra long 700/800/900/1000 ms。
- Material 弹簧（阻尼比, 刚度）：空间类 fast 0.9/1400、default 0.9/700、slow 0.9/300；效果类 fast 1/3800、default 1/1600、slow 1/800。fast 用于开关与按钮等小组件，default 用于抽屉、底部面板等部分覆盖屏幕的元素，slow 用于全屏转场。

## 易腐与耐久

- 耐久：频率原则、可打断性、退出快于进入、进入减速退出加速、按覆盖面积选速度、空间与效果分开、尊重 reduced motion。全部是感知层面的结论。
- 易腐：库名（文中的 Framer Motion 现以 Motion 发布）、组件库暴露的 CSS 变量名、Material 的具体数值与属性名、各平台动画 API。

## 对设计 agent 的启发

- 先问"要不要动"，再问"怎么动"：给每个状态变化标注它的职责，标不出来的就不动。
- 动效要像颜色一样 token 化：少量时长、少量缓动、三根弹簧，加一句"个性描述"。
- agent 很难"看"动画，所以原型必须自带重播、慢放与 reduced-motion 开关，并能通过快速连点测试打断行为；看不了就如实说看不了。

## 注意

- Apple 关于流体界面与弹簧的两场 WWDC 演讲、HIG 的 Motion 页面在目录中收录，但开发者站点是 JS 应用，抓取当日未能取得正文，因此未做摘要；`design-motion` 中关于"用时长与回弹描述弹簧"的表述来自对这些公开演讲的通识，未经本轮核验。
- 两篇文章页面未标注发布日期。

## 对最终 skill 的影响

- `skills/design-motion/SKILL.md`："Decide Whether to Animate"四问（职责、频率、可打断、性能）、Core Rules 的数值与 origin-aware、工具提示与加载规则、反模式清单。
- `skills/design-motion/references/motion-tokens.md`：时长与缓动 token 表、弹簧三档及 Material 参数对照、模式表（按下 0.97、弹层 0.95–0.97、交错 20–50 ms）、各平台代码片段。
- `skills/build-design-system/SKILL.md`：Foundations 第 6 项把动效纳入 token。
