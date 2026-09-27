# Material 3 motion tokens: easing/duration curves and the two spring schemes
- id: material-motion-tokens · url: https://m3.material.io/styles/motion/overview/how-it-works · fetched: 2026-09-27 · method: browser
- review_by: 2026-12-26 (perishable +90d) · licence note: paraphrased digest, not a mirror (values copied as data)
> 中文导语：Material 3 的动效正从"缓动曲线 + 时长"迁移到"弹簧物理"。弹簧有两套预设方案：expressive（Material 官方建议大多数场景用，有明显回弹）和 standard（功能型、几乎不回弹）。上一版摘要把 MDC-Android 文档里的数值（0.9/1400 等）误标成"M3 Expressive 弹簧"，那其实是 standard 方案；而 Compose 的 `MaterialTheme` 默认也是 standard，只有 `MaterialExpressiveTheme` 默认 expressive。

Sources read on 2026-09-27:
- m3.material.io "Motion - How it works" (dated May 2025 on page), rendered in headless Chrome (Playwright, channel chrome) - method browser.
- androidx `compose/material3` on branch `androidx-main` (HEAD `23327507f7fc`, 2026-09-27): `MaterialTheme.kt`, `MotionScheme.kt`, `tokens/StandardMotionTokens.kt`, `tokens/ExpressiveMotionTokens.kt` (raw GitHub mirror).
- Stable `androidx.compose.material3:material3-android:1.4.0` sources jar (Google Maven); latest on Maven = `1.5.0-alpha29` (lastUpdated 2026-09-23).
- MDC-Android `docs/theming/Motion.md` (last changed 2025-01-07, `ed6c81b`).

## Key facts
1. **Physics replaces curves** (How it works, intro): "The physics system is replacing the previous system based on easing and duration"; introduced with M3 Expressive.
2. **Two preset schemes** (§ The basics: Motion schemes): **expressive** - "Material's opinionated motion scheme, and should be used for most situations, particularly hero moments and key interactions"; overshoots to add bounce. **standard** - "more functional with minimal bounce, and should be used for utilitarian products"; eases into final values. Custom schemes are allowed; most motion in a product should use one scheme, with per-element swaps for key moments.
3. **Spring = stiffness + damping + initial velocity** (§ How it works: Springs); springs handle gestures, interruption and retargeting.
4. **Tokens** (§ Spring tokens): `md.sys.motion.spring.{fast|default|slow}.{spatial|effects}`; the scheme is chosen at product level and is **not** part of the token name ("call the expressive scheme, then use md.sys.motion.spring.fast.spatial").
5. **Spatial vs effects**: spatial springs animate position, rotation, size and **rounded corners** and overshoot; effects springs animate colour and opacity and never overshoot.
6. **Speeds**: most motion uses default; small elements fast; large/full-screen slow. MDC wording: fast = small components (switches, buttons), default = partial-screen (bottom sheet, nav drawer), slow = full screen. A pressed button uses fast-spatial for shape/size and fast-effects for colour.
7. **Values differ by device class** (§ Spring tokens): the relative order holds but exact values differ for wearable, phone and tablet.
8. **Spring values (damping ratio ζ, stiffness k)** - Compose token files on androidx-main:

| Token | standard | expressive |
| --- | --- | --- |
| fast spatial | 0.9, 1400 | **0.6, 800** |
| default spatial | 0.9, 700 | **0.8, 380** |
| slow spatial | 0.9, 300 | **0.8, 200** |
| fast / default / slow effects | 1.0 / 3800, 1600, 800 | same as standard |

   MDC-Android `Motion.md` lists exactly the **standard** column as its six `?attr/motionSpring*` attributes; it has no expressive values.
9. **Derived equivalents** (computed here, mass 1: perceived duration = 2π/√k, bounce = 1 − ζ as in SwiftUI `spring(duration:bounce:)`, peak overshoot = e^(−ζπ/√(1−ζ²))): expressive fast spatial 222 ms / bounce 0.4 / 9.5 % overshoot; expressive default 322 ms / 0.2 / 1.5 %; expressive slow 444 ms / 0.2 / 1.5 %; standard fast 168 ms / 0.1 / 0.15 %; standard default 237 ms / 0.1 / 0.15 %; standard slow 363 ms / 0.1 / 0.15 %; effects fast/default/slow 102 / 157 / 222 ms, no overshoot.
10. **Which scheme Compose uses by default** (code): on androidx-main (1.5.0-alpha), `MaterialTheme(...)` defaults to `MotionScheme.standard()` (`MaterialTheme.kt`: `motionScheme: MotionScheme = standard()`), while `MaterialExpressiveTheme(...)` defaults to `MotionScheme.expressive()` when no outer expressive theme exists. In stable **1.4.0**, `MotionScheme.standard()/expressive()` and `MaterialExpressiveTheme` are `internal`, and the motion-scheme composition local defaults to `standard()` - so a stable-Compose app gets standard springs, and expressive motion needs the 1.5 alpha line.
11. **Implementation status** (How it works, status table and § Application > Components): Jetpack Compose "Available" - 21 Material components use physics by default; Android Views (MDC-Android) "Available. Not added to components" (support "coming soon"); Flutter "Unavailable"; Web "Compatible with Compose springs. See specs".
12. **Customisation levels** (§ Advanced customizations, Compose): level 1 use a preset scheme; level 2 build a custom `MotionScheme` returning different `AnimationSpec`s; level 3 swap the scheme per element by overriding the CompositionLocal.
13. **Legacy curve tokens** (MDC-Android `Motion.md` § Curves): standard `cubic-bezier(0.2, 0, 0, 1)`; standard decelerate `(0, 0, 0, 1)`; standard accelerate `(0.3, 0, 1, 1)`; emphasized = path `M 0,0 C 0.05,0 0.133333,0.06 0.166666,0.4 C 0.208333,0.82 0.25,1 1,1`; emphasized decelerate `(0.05, 0.7, 0.1, 1)`; emphasized accelerate `(0.3, 0, 0.8, 0.15)`; linear `(0, 0, 1, 1)`. Durations: short 50/100/150/200, medium 250/300/350/400, long 450/500/550/600, extra long 700/800/900/1000 ms; "duration should increase as the area/traversal of an animation increases".
14. **Transition patterns** (MDC-Android): container transform, shared axis, fade through, fade.

## What it changes for the skills
- skills/design-studio/references/disciplines/motion-tokens.md: label 0.9/1400, 0.9/700, 0.9/300 as the **standard** scheme; add the expressive column; add the derived duration/bounce table (fact 9) so springs map to SwiftUI `duration/bounce` and CSS `linear()` samples; note device-class variation; keep speed-by-coverage and the spatial/effects split as durable rules.
- skills/design-studio/references/platforms/android.md: under a Native Android posture, Material guidance says use **expressive** for most products (standard for utilitarian ones); state that Compose's plain `MaterialTheme` gives standard springs and expressive requires `MaterialExpressiveTheme` on material3 1.5.0-alpha - flag this in handoff.
- skills/design-studio/references/disciplines/motion.md: the lab's brand-neutral web default ("little or no bounce") stays for web and custom postures; under Android-native posture the platform default wins; physics is replacing curve tokens, so curves are legacy for new Android work.
- skills/implement-design/references/stacks.md: Compose - read `MaterialTheme.motionScheme` specs instead of hand-written `spring(...)`; Views - `MotionUtils.resolveThemeSpringForce` with the six `motionSpring*` attributes (standard values).

## Not verified / open
- Per-device-class token values (wearable, tablet) were not found as numbers; only the phone values in the Compose token files are listed.
- The m3.material.io "specs" pages for converting springs to web were not read.
- Correction vs the 2026-09-21 digest: it titled the MDC table "M3 Expressive springs"; those values are the standard scheme. It also did not say which scheme is Material's recommended default (expressive) or which one Compose applies by default (standard, unless `MaterialExpressiveTheme`).
