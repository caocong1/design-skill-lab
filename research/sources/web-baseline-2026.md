# Web platform Baseline status of UI primitives (web-features 3.44.0), as of 2026-11-01
- id: web-baseline-2026 · url: https://cdn.jsdelivr.net/npm/web-features@3.44.0/data.json · fetched: 2026-11-01 · method: json-api
- review_by: 2027-01-30 (perishable +90d) · licence note: paraphrased digest, not a mirror
> 中文导语：设计稿里敢不敢直接用原生 popover、锚点定位、自定义 select、视图过渡、`contrast-color()`？这份表按 web-features 官方数据（Baseline 状态、年份，"新近可用"还是"广泛可用"，各浏览器版本）逐项回答，并说明每项对设计决策的影响。写 web 平台能力表、动效规格或实现映射时以这里为准。

Re-read on 2026-11-01: `web-features` npm **3.44.0** (published 2026-10-22T16:30Z) `data.json`, diffed key by key against 3.40.0 (1231 features vs
1216; 20 keys new or with changed status or dates, none of them cited below), plus the `next` build `3.44.0-dev-20261030172818` for a look ahead;
Interop 2026 README at `web-platform-tests/interop@9ec5533` (2026-04-13), wpt.fyi `interop-data.json` and WebKit's Interop 2026 post (2026-02-12);
Chrome milestone schedule (chromiumdash) and the VersionHistory API; Apple's Safari release-notes JSON (27, 27.1, 27.2); Firefox 159.0 release notes
and Mozilla product-details. Every status, date and version below was re-derived from 3.44.0; what moved is listed under "Correction vs the previous
version" at the end.

First read on 2026-09-27: `web-features` npm **3.40.0** (published 2026-09-24T18:23Z) `data.json`, per feature `status` and `status.by_compat_key`.
Cross-checked with `https://api.webstatus.dev/v1/features/<id>` (anchor-positioning, text-box, customizable-select, sibling-count, field-sizing,
popover: identical). Definitions from `https://web.dev/baseline`. Interop 2026 scope from `web-platform-tests/interop@9282620` (2026/README.md) and
`web-platform-tests/wpt.fyi@e7e9fbd` (webapp/static/interop-data.json). Spec checks: CSS Color 5 ED 2026-09-10 §8 `contrast-color()`; WHATWG HTML
`command` attribute.

## Key facts
Definitions
1. Baseline **newly available** = supported in every core browser: Chrome (desktop + Android), Edge, Firefox (desktop + Android), Safari (macOS + iOS).
   **Widely available** = 30 months after the newly-available date. Before that, a feature has **limited availability** (web.dev/baseline). Latest
   releases in the dataset (3.44.0): Chrome 156 (2026-10-20), Edge 155 (2026-10-08), Firefox 158 (2026-10-13), Safari 27 (2026-09-14). Shipped
   after the dataset's cut: Safari 27.1 (2026-10-23) and 27.2 (2026-10-26, per Apple's release-notes JSON), Firefox 159.0 (2026-10-27); Chrome 157 is
   scheduled for 2026-11-03.
2. The Baseline year is the year of the newly-available ("low") date. "Widely" dates below marked *proj.* are low + 30 months, computed here, not a
   dataset value.

The requested features (id · status · low date → widely · first versions Chrome / Firefox / Safari)
3. **Popover** (`popover`) · **newly, Baseline 2025** · 2025-01-27 → *proj.* 2027-07-27 · Chrome 116 / Firefox 125 / Safari 17 (iOS 18.3).
   `popover="hint"` is limited (Chrome 151, Firefox 153; no Safari). **Interest invokers** (hover/focus-triggered popovers) are Chrome 142 only.
4. **Invoker commands** (`command` + `commandfor` on `<button>`) · **newly, Baseline 2025** · 2025-12-12 → *proj.* 2028-06-12 · Chrome 135 /
   Firefox 144 / Safari 26.2. HTML keywords: `toggle-popover`, `show-popover`, `hide-popover`, `show-modal`, `close`, `request-close`, and custom
   `--name` commands.
5. **Anchor positioning** · **limited** at feature level, but 323 of 325 compat keys are Baseline. Core keys (`anchor-name`, `anchor()`,
   `anchor-size()`, `position-area`, `position-try-fallbacks`, `@position-try`, `position-visibility`) newly 2026-01-13 (Chrome 125–129 / Firefox 147 /
   Safari 26–26.2). `position-anchor` is keyed Baseline 2026-09-14 (Chrome 151 / Firefox 151 / Safari 27). Only `position-visibility: anchor-valid |
   anchor-visible` (Safari 27 only) holds the feature back. Anchor-positioned **animations/transitions** are limited (Chrome 125, Safari 26).
   Interop 2026 focus area (carried over from 2025).
6. **Customizable `<select>`** (`appearance: base-select`, `::picker(select)`, `<selectedcontent>`, `::checkmark`, `::picker-icon`) · **limited** ·
   Chrome 133–135 / **no Firefox** / Safari 27. Safari 27.2 (2026-10-26) adds `::field-content` for `<select>` and keeps a large base-appearance
   picker inside the viewport (release notes, issues 187617020 and 186812035); still no Firefox.
7. **View transitions, same-document** · **newly, Baseline 2025** · 2025-10-14 → *proj.* 2028-04-14 · Chrome 111 / Firefox 144 / Safari 18.
   `view-transition-class` newly 2025-10-14. `:active-view-transition` newly 2026-01-13. **Element-scoped** view transitions: Chrome 147 only.
8. **Cross-document view transitions** (`@view-transition`) · **limited** · Chrome 126 / **no Firefox** / Safari 18.2. The `pageswap`/`pagereveal`
   event keys (filed under the `view-transitions` feature) are limited too: no Firefox, and `Window` `pageswap` has no Safari data.
   Interop 2026 includes cross-document view transitions, `:active-view-transition-type()`, `blocking="render"` and `<link rel="expect">`.
9. **Scroll-driven animations** (`animation-timeline`, `scroll()`/`view()`, `animation-range`) · **limited** (0 of 37 keys Baseline) · Chrome 115 /
   **no Firefox in the data** / Safari 26. Interop 2026 focus area. **Firefox 159.0 (2026-10-27) release notes say "Firefox now supports
   scroll-driven animations"**; 3.44.0 and its 2026-10-30 dev build still carry no Firefox entry, so the feature stays limited in the data until BCD
   catches up. Expect newly available in a coming release; until the dataset says so, specs keep treating it as enhancement.
10. **`@starting-style`** · **newly, Baseline 2024** · 2024-08-06 → *proj.* 2027-02-06 · Chrome 117 / Firefox 129 / Safari 17.5.
    `transition-behavior: allow-discrete` · newly 2024-08-06. But **display animation** (animating to and from `display: none` /
    `content-visibility`) is **limited**: Chrome 117 / no Firefox / Safari 18. The `overlay` property (keeps a closing popover/dialog in the top layer
    while it animates out) is Chrome 117 only.
11. **`interpolate-size`** and **`calc-size()`** (animate to `height: auto`) · **limited** · Chrome 129 only.
12. **`text-box` / `text-box-trim` / `text-box-edge`** · feature **limited**, but the property keys (`text-box`, `text-box-trim` with
    `trim-start|end|both`, `text-box-edge: auto`) became Baseline **2026-08-18** (Chrome 133 / Firefox 154 / Safari 18.2). The edge value types (`cap`,
    `ex`, `alphabetic`, `text`) carry no Firefox data, which keeps the feature limited.
13. **`light-dark()`** · **newly, Baseline 2024** · 2024-05-13 → *proj.* **2026-11-13** · Chrome 123 / Firefox 120 / Safari 17.5. `light-dark()` with
    **image** values · newly **2026-09-14** (Chrome 150 / Firefox 150 / Safari 27). Still `baseline: low` in 3.44.0 and in the 2026-10-30 dev build;
    2026-11-13 is arithmetic, not a dataset value. **Field note (host incident, feedback entry 2026-10-27 `light-dark-fallback-none-needed`):** an
    engine without `light-dark()` drops every declaration that uses it, and a custom property holding it makes every colour that reads the property
    invalid at computed-value time, so a token file written only with `light-dark()` loses its primary button in in-app browsers and on iOS before
    17.5. "Newly available" is not "no fallback needed".
14. **Relative color syntax** (`oklch(from var(--c) …)`) · **newly, Baseline 2024** · 2024-09-16 → *proj.* 2027-03-16 · Chrome 125 / Firefox 128 /
    Safari 18.
15. **`color-mix()`** · **widely available** · low 2023-05-09, high **2025-11-09** · Chrome 111 / Firefox 113 / Safari 16.2. Mixing **three or more**
    colours is limited (Firefox 150, Safari 27; no Chrome). **OKLab/OKLCH** is also widely available (high 2025-11-09).
16. **`contrast-color()`** · **newly, Baseline 2026** · 2026-04-10 → *proj.* 2028-10-10 · Chrome 147 / Firefox 146 / Safari 26. Spec (CSS Color 5 §8)
    says it resolves to **white or black only** (white on a tie). The algorithm is **UA-defined**, and the output only "should still meet" WCAG 1.4.3
    **AA for large text (3:1)**, so 4.5:1 for body text is not guaranteed. Interop 2026 focus area.
17. **`@scope`** · **newly, Baseline 2026** · 2026-03-24 → *proj.* 2028-09-24 · Chrome 143 / Firefox 146 / Safari 26.4.
18. **`field-sizing`** (`content` / `fixed`) · **newly, Baseline 2026** · 2026-06-16 → *proj.* 2028-12-16 · Chrome 123 / Firefox 152 / Safari 26.2.
19. **Container style queries** (`@container style(--x: y)`, custom properties only) · **newly, Baseline 2026** · 2026-05-19 → *proj.* 2028-11-19 ·
    Chrome 111 / Firefox 151 / Safari 18. Interop 2026 focus area.
20. **Container scroll-state queries** (`scroll-state(stuck | snapped | scrollable)`) · **limited** · Chrome 133 only.
21. **`sibling-index()` / `sibling-count()`** · **newly, Baseline 2026** · 2026-08-18 → *proj.* 2029-02-18 · Chrome 138 / Firefox 154 / Safari 26.2.
22. **CSS `if()`** · **limited** · Chrome 137 only. **`@function`** · limited · Chrome 139 only.
23. **`@property`** (registered custom properties, incl. `CSS.registerProperty`) · **newly, Baseline 2024** · 2024-07-09 → *proj.* 2027-01-09 ·
    Chrome 85 / Firefox 128 / Safari 16.4.

Adjacent primitives designers ask about (same dataset)
24. Widely available: `<dialog>`, `:focus-visible`, `inert`, `:has()` (high 2026-06-19), size container queries, CSS nesting (2026-06-11),
    `linear()` easing (2026-06-11), `prefers-reduced-motion`, `prefers-contrast`, `forced-colors`, `color-scheme`, small/large/dynamic viewport
    units, scroll snap, `lh` unit.
25. Newly available: `::details-content` (2025-09-16), exclusive `<details name>` (2024-09-03), `text-wrap: balance` (2024-05-13), `backdrop-filter`
    (2024-09-16), `scrollbar-gutter` (2024-12-11), `font-size-adjust` (2024-07-25), `rcap` unit (2026-01-13).
26. Limited: `<dialog closedby>` (Chrome 134, Firefox 141; no Safari; Interop 2026), `text-wrap: pretty` (Chrome 117, Safari 26), `hidden="until-found"`
    (Chrome 102, Firefox 148), `prefers-reduced-transparency` (Chrome 119 only), `corner-shape` (Chrome 139 only), `::scroll-marker` and
    `::scroll-button` (Chrome 135 only), grid lanes / masonry (no shipping engine in the data: the `grid-lanes` key's Safari 26.4 entry present in
    3.40.0 was removed by 3.44.0, and `masonry` redirects to it), `reading-flow` (Chrome 137 only), `text-spacing-trim` (Chrome 123
    only), `text-autospace` as a feature (Firefox 145, Safari 27), `accent-color` (no Chrome Android in the data). `text-autospace` by key:
    `normal` and `no-autospace` are newly available, Baseline 2025-11-11 (Chrome 140 / Firefox 145 / Safari 18.4); `auto`, `ideograph-alpha` and
    `ideograph-numeric` are Firefox 145 and Safari 18.4 only; `insert` is Firefox 145 and Safari 27 only.
26a. New keys between 3.40.0 and 3.44.0 that touch UI, all limited: `scroll-triggered-animations`, `system-color-accentcolor`, `scroll-axis-lock`,
    `column-wrap`, `text-decoration-skip-spaces`, `wheel-events-momentum`; newly available 2026-09-14: `revert-rule`, `animations-css-animation-accessors`.
    Turned widely available in the same window (none are UI primitives): `abortsignal-timeout` (2026-10-18), `align-content-block`, `intl-segmenter`,
    `transform-box` (2026-10-16). Interop 2026 as of README `9ec5533`: 20 focus areas (five carried over from 2025: anchor positioning, CSS zoom,
    Navigation API, view transitions, WebRTC) and 4 investigations (accessibility testing, JPEG XL, mobile testing, WebVTT).

Design consequences
27. Menus, toggletips, pickers and non-modal panels can be specified as **native popovers**: top layer, light dismiss (`auto`), Esc, focus return.
    Specs should state auto vs manual dismissal. Buttons open dialogs and popovers declaratively (invoker commands). Hover-triggered tooltips still
    need JS (interest invokers are Chrome-only) and must satisfy WCAG 1.4.13.
28. Tooltips and menus can declare **fallback positions** (`position-try-fallbacks`) in the spec. Treat anchor positioning as usable with a tested
    fallback, not as universally complete; animating anchored elements is enhancement.
29. The native select can be **designed** (rich options, icons) only as progressive enhancement: Firefox gets the classic control, so the mock must
    also show that fallback.
30. Same-document state and shared-element transitions are standard web motion. **MPA page transitions, scroll-driven effects and `height: auto`
    animation are enhancements** with a static fallback. Entry animations via `@starting-style` work everywhere; **exit animations out of
    `display: none` (no Firefox) and top-layer exit via `overlay` (Chrome only) are not interoperable**, so design exits that degrade to an instant
    hide.
31. Tokens: relative colour for hover/pressed/subtle derivatives, `color-mix()` and OKLCH are safe for new work. `light-dark()` pairs need a
    plain-value fallback (light values first, dark values under `@media (prefers-color-scheme: dark)`) until the feature is widely available, and
    longer when the audience includes in-app browsers or iOS before 17.5 (fact 13).
    `contrast-color()` is an automatic black-or-white fallback only; verify 4.5:1 for body text yourself. Registered `@property` makes gradients and
    custom properties animatable.
32. `field-sizing: content` gives auto-growing chat composers and textareas natively. `sibling-index()` gives CSS-only staggers. `@scope` and
    container style queries let components switch variants without class plumbing. `text-box-trim` enables optical centring in buttons and badges
    (Baseline for the properties; check the edge value used). Keep `if()`, `@function` and scroll-state queries out of production specs.

## What it changes for the skills
- skills/design-studio/references/platforms/web.md: a capability table with the status, Baseline year and widely date of facts 3–23. Mark every
  primitive as native / native-with-fallback / enhancement, per fact 27–32.
- skills/design-studio/references/fundamentals/modern-css.md: same statuses, framed as design material. `light-dark()` becomes widely available on
  2026-11-13 at the earliest, so recheck then; until then the fallback column must say "plain values first, dark overrides under
  `prefers-color-scheme`", never "none needed" (fact 13).
- skills/design-studio/references/disciplines/motion.md + motion-tokens.md: same-document VT and `@starting-style` Baseline. Cross-document VT,
  scroll-driven animations, `interpolate-size`, display/overlay exit animation and element-scoped VT are not. Stop saying "where supported" for
  Baseline features.
- skills/design-studio/references/fundamentals/color.md: relative colour, `color-mix()`, OKLCH, `light-dark()` usable. `contrast-color()` guarantees
  only about 3:1 per spec.
- skills/design-studio/references/disciplines/product-ui.md and disciplines/ai-experience.md: native popover/dialog behaviour (light dismiss, Esc,
  focus return) as the default overlay contract; `field-sizing` composer; customizable select only with the Firefox fallback drawn.
- skills/design-studio/references/fundamentals/materials.md: `backdrop-filter` is newly Baseline, but `prefers-reduced-transparency` is Chrome-only.
  Glass needs a legible default, not a media-query opt-out.
- skills/design-studio/references/fundamentals/typography.md + cjk-typography.md: `text-wrap: balance` Baseline, `pretty` not. `text-box-trim`
  properties Baseline 2026-08-18. CJK `text-spacing-trim` is Chrome-only; `text-autospace: normal` / `no-autospace` are Baseline 2025-11-11,
  its other values are not (fact 26).
- skills/implement-design/references/stacks.md: the web section maps to these primitives with their status (popover, invoker commands, dialog,
  anchor positioning, `@scope`, `light-dark()`, relative colour, `contrast-color()`, `field-sizing`, `text-box`).
- skills/design-studio/scripts (future `check-knowledge`): re-pull `data.json` and diff these ids on each review.

## Not verified / open
- Correction vs the previous version (2026-11-01 re-read, 3.40.0 → 3.44.0): no cited feature changed status or dates; browser rows in fact 1
  updated; fact 26 "grid lanes (Safari 26.4 only)" no longer holds (the entry was removed; nothing ships); fact 9 records Firefox 159's
  scroll-driven animations ahead of the dataset; fact 31 no longer calls `light-dark()` "safe for new work" (host incident, fact 13); fact 26a added.
- Review trigger (perishable, +90d): each web-features release, in particular the first after 2026-11-13 (`light-dark()` high) and the first carrying
  Firefox 159 data (scroll-driven animations); the Interop 2026 end-of-year results.
- Why `position-anchor` shows a 2026-09-14 Baseline date with Chrome 151 (Chrome shipped anchor positioning in 125) was not investigated. It is
  probably a BCD data revision. The feature-level status is what this digest reports.
- The Firefox gap for `text-edge` value types may be missing BCD data rather than missing support. Check before telling designers to avoid
  `text-box-edge: cap alphabetic`.
- Projected "widely" dates are arithmetic (low + 30 months). The dataset has no `baseline_high_date` for any newly-available feature above.
- Fact-check 2026-09-27: every status, low/high date, first version and compat-key count above was re-derived from web-features 3.40.0
  `data.json` (plus webstatus.dev for 8 ids, the Interop 2026 README at 9282620, CSS Color 5 ED 2026-09-10 §8 and WHATWG HTML `command`); all
  matched. Only wording was tightened (fact 8 event keys, fact 30 `overlay` is Chrome-only, not merely "no Firefox").
- Interop 2026 membership predicts effort, not ship dates. No browser roadmap was read for Firefox customizable select, cross-document VT or
  scroll-driven animations.
