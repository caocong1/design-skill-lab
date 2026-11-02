# HarmonyOS motion: 动效 design guide, ArkUI curves and springs, UX-standard duration floors
- id: harmonyos-motion-curves · url: https://developer.huawei.com/consumer/cn/doc/design-guides/animation-attributes-0000001797117229 · fetched: 2026-11-01 · method: json-api
- review_by: 2027-01-30 (perishable +90d) · licence note: paraphrased digest, not a mirror (Huawei developer documentation; values copied as data)
> 中文导语：鸿蒙的动效一手数值：设计指南给出时长（长距 ≤ 350 ms、短距 ≤ 250 ms、很短 ≤ 150 ms；颜色 100、开关 150、删行 200、图片全屏 350）、标准 / 减速 / 加速三族贝塞尔曲线；ArkUI `Curve` 枚举的 13 条曲线数值（FastOutSlowIn = 0.4, 0, 0.2, 1 等）；物理曲线 `springMotion(response 0.55, dampingFraction 0.825)`、`responsiveSpringMotion(0.15, 0.86, 0.25)`，并"建议优先使用物理曲线"；跟手 → 离手要继承速度。通用应用 UX 体验标准 §2.1.5（2026-10-28 V31）把转场时长下限定为必须项：8.5 英寸以下 ≥ 200 ms、8.5–12 英寸 ≥ 250 ms、12 英寸以上 ≥ 300 ms。本仓库 motion 主题此前"HarmonyOS 的动效曲线与弹簧参数没有摘要"。

Read on 2026-11-01 by the platform verifier (doc API `getDocumentById`): 动效 guide `animation-attributes` (V9, 2026-08-07) with `design-animation-overview`, `design-principles` (2025-06-20), `transition-animation` (2026-08-07), `gesture-animation` (2025-06-20); ArkUI reference `js-apis-curve` (display 2026-09-20) and guides `arkts-curve-overview`, `arkts-spring-curve`, `arkts-animation-smoothing`; 通用应用 UX 体验标准 `ux-guidelines-general` §2.1.5 (V31, 2026-10-28); release notes `overview-allversion` (V52), `overview-2600` (V11), `version-number-26` (V6).

## Key facts
1. **Durations** (guide): "如长距离保持在350ms内，短距离保持在250ms内，较短的动画保持在150ms内完成动作"; examples colour-only 100 ms, rotation 300 ms, switch 150 ms, delete row 200 ms, open image full-screen 350 ms; "1帧=16.67毫秒".
2. **Bezier families** (guide): 标准曲线 `cubic-bezier(0.40,0.00,0.20,1.00)` (also `(0.20,0.00,0.10,1.00)`, `(0.33,0.00,0.67,1.00)`); 减速曲线 `(0.00,0.00,0.40,1.00)` (also `(0.00,0.00,0.20,1.00)`, `(0.00,0.00,0.00,1.00)`); 加速曲线 for exits (no numbers printed on the guide page).
3. **ArkUI `Curve` enum**: Linear 0; Ease `(0.25, 0.1, 0.25, 1.0)`; EaseIn `(0.42, 0.0, 1.0, 1.0)`; EaseOut `(0.0, 0.0, 0.58, 1.0)`; EaseInOut `(0.42, 0.0, 0.58, 1.0)`; FastOutSlowIn 标准曲线 `(0.4, 0.0, 0.2, 1.0)`; LinearOutSlowIn 减速曲线 `(0.0, 0.0, 0.2, 1.0)`; FastOutLinearIn 加速曲线 `(0.4, 0.0, 1.0, 1.0)`; ExtremeDeceleration 极缓曲线 `(0.0, 0.0, 0.0, 1.0)`; Sharp 锐利曲线 `(0.33, 0.0, 0.67, 1.0)`; Rhythm 节奏曲线 `(0.7, 0.0, 0.2, 1.0)`; Smooth 平滑曲线 `(0.4, 0.0, 0.4, 1.0)`; Friction 阻尼曲线 `(0.2, 0.0, 0.2, 1.0)`.
4. **Springs**: `springMotion(response = 0.55, dampingFraction = 0.825, overlapDuration = 0)`; `responsiveSpringMotion(0.15, 0.86, 0.25)` ("如果使用跟手动画，推荐使用默认参数"); `interpolatingSpring(velocity, mass, stiffness, damping)` and `springCurve` have no defaults; for the three physics curves "duration参数不生效"; dampingFraction 0 undamped / 0–1 under-damped / 1 critical / > 1 over-damped. (The two defaults equal SwiftUI's legacy `spring(response:dampingFraction:)` and `interactiveSpring` defaults: `apple-motion-springs` fact 4.)
5. **Guide mapping** (as printed, typo included): "interpolatingSpring：Stiffness:128，Damping:12 ，Msss:1，Velocity:0 / springMotion：Response:0.555，DampingFraction:0.53" — consistent with 2π/√128 ≈ 0.555 and 12/(2√128) ≈ 0.53.
6. **Preference**: "建议开发者优先使用物理曲线"; traditional curves "作为辅助用于极少数必要场景"; `springCurve` "不建议开发者使用"; springs are named for "列表上下滚动、桌面左右翻页、手势上滑退出应用等".
7. **Hand-off**: release velocity must be inherited ("离手阶段的属性变化初始速度应与离手前一刻的属性改变速度保持一致"); the pattern is `responsiveSpringMotion` while dragging → `springMotion` after release; tap feedback starts on touch-down ("按下接触过程平均时长100~130ms").
8. **UX standard §2.1.5** (V31, 2026-10-28): 2.1.5.2.1 动效无缺失 (必须); 2.1.5.2.2 转场时长下限 (必须): "8.5英寸以下的设备上不应短于200 ms，在8.5至12英寸的设备上不应短于250ms，在12英寸以上的设备上不应短于300ms"; upper/lower-level transitions "采用左右位移… 曲线优先使用弹簧曲线" (强烈推荐); launch page "不建议超过3 s", blank launch "不建议超过300 ms"; follow-finger scroll (必须), edge bounce (强烈推荐), fling deceleration (必须); long-press 500 ms (400–650) and double-tap 70–400 ms (必须; §2.1.3.2).
9. Micro-motion: multi-oscillation springs only on small elements. **No reduce-motion rule** was found on any page read.
10. **API versions** (release notes): 26.0.0 · DevEco Studio 26.0.0 Release · `2026/08/28`; 6.1.1(24) `2026/05/26`; 6.1.0(23) `2026/04/20`; 6.0.2(22) `2026/01/21`; 6.0.1(21) `2025/11/20`; 6.0.0(20) `2025/09/25`; 26.0.0 Beta1 `2026/06/12`, Beta2 `2026/07/28`, Release `2026/08/29` (one-day mismatch with the table, as printed); SemVer X.Y.Z from 26.0.0; "ArkWeb的Chromium内核从132升级为144版本".

## What it changes for the skills
- skills/design-studio/references/platforms/harmonyos.md: a motion row with the duration ladder, the three bezier families and the physics-first rule; the 必须-level transition floors (200 / 250 / 300 ms by screen size) become a check for HarmonyOS targets; drag → release uses `responsiveSpringMotion` → `springMotion`.
- skills/design-studio/references/disciplines/motion-tokens.md: the HarmonyOS column of the spring table gets `springMotion(response, dampingFraction)` with (d, ζ) semantics and the 0.55 / 0.825 defaults (the earlier text had "no first-hand source").
- skills/implement-design/references/stacks.md (ArkUI): name the curve enum values and the hand-off pattern; note that `duration` is ignored for physics curves.
- research/topics/04-motion.md: the open item "HarmonyOS 的动效曲线与弹簧参数没有摘要" is closed.

## Not verified / open
- The 加速曲线 bezier values are not printed on the guide page (only in images).
- No reduce-motion guidance was found; whether HarmonyOS exposes a system reduce-motion setting to apps is not covered here.
- The relationship between the guide's `springMotion` defaults and SwiftUI's is an observation, not a vendor statement.
