---
title: Mini-programs (WeChat, Alipay and other hosts)
evidence: digest
sources: [wechat-miniprogram-design-guidelines]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Mini-programs

A mini-program is a guest inside a super-app. The host owns the top-right capsule, the launch page,
pull-to-refresh and the share sheet; the design works around them. WeChat is described here; other
hosts are at the end. Posture and the cross-platform checklist: [README](README.md).

Rules come from WeChat's design guide and its 适老化 (elderly-friendly) guide, read 2026-09-27.
Facts marked † come from WeChat's developer docs read the same day (the `app.json` reference and the
API pages for `wx.getMenuButtonBoundingClientRect`, `wx.getWindowInfo` and `onShareAppMessage`); they
are not yet in the lab digest. Sub-guides for large screens (PC and tablet), accessibility and
物料设计 exist and were not read.

## Changed in the last release

| When | What changed for a designer |
| --- | --- |
| Design guide, current | The design canvas is now two choices: 375 px wide = a fixed layout that scales across devices; 390 px wide = a responsive layout that needs per-size adaptation |
| 适老化 guide, current | Read the user's font setting from `wx.getAppBaseInfo`; `wx.getSystemInfo` "will no longer be maintained". Care mode (关怀模式) scales type, graphics and buttons 1.4 × |

## The capsule keep-out zone

WeChat puts its menu capsule at the top right of **every** page, including web views and plugins. Its
content cannot change; only a light or dark scheme can be chosen.

- Reserve its rectangle before designing any navigation. No button, search field, badge or gesture
  target under it or crowding it; watch for tap conflicts near it.
- Custom navigation must look different from the capsule, never imitate it.
- `navigationStyle: "custom"` removes the native navigation bar and keeps only the capsule †. Then:
  - read the capsule's rectangle at runtime with `wx.getMenuButtonBoundingClientRect()`: `top`,
    `right`, `bottom`, `left`, `width`, `height` in px, origin at the screen's top-left †;
  - read `statusBarHeight` and `safeArea` from `wx.getWindowInfo()` † (some devices return no
    `safeArea`);
  - common practice: centre the custom bar's content row on the capsule, so the bar height is
    `statusBarHeight + height + 2 × (top − statusBarHeight)`, and keep your content left of
    `left` minus a gap.
- In the mockup draw the capsule as a labelled system element with its keep-out rectangle, in both
  schemes if the page changes background. The handoff says "read the rectangle at runtime", never a
  fixed offset.

## Navigation

- Secondary pages offer back at the top left; the iOS edge swipe and the Android back key also
  return.
- A page opened from a share or a card has no page stack behind it. Give it a way home: the native
  `homeButton` on non-home pages †, or a home control in the custom bar.
- Tabs sit at the top or the bottom: at least 2, at most 5, **4 or fewer recommended** to protect the
  tap area. Never more than one tab bar on a page. The native bottom tab bar is for the home page
  only.
- Native `tabBar` limits †: 2-5 items; position `bottom` or `top` (top shows no icons); icons about
  81 × 81 px, at most 40 KB each, no network images; colours in hex only; the top border only
  `black` or `white`. Anything beyond that needs a custom tab bar (`custom: true`), which must then
  be adapted to the user's font setting by hand.

## What WeChat draws

| Surface | Yours | WeChat's |
| --- | --- | --- |
| Launch page | the brand logo only | everything else, including the loading indicator |
| Pull-to-refresh | the content that refreshes | the indicator |
| Capsule, native navigation bar, native tab bar | title, tab icons and labels, colours within the limits above | the controls |
| Toasts, modal dialogs, action sheets, share sheet | the text and options | the component |

## Feedback and errors

- Local loading, where the action happened, is the default. Modal loading covers the page and makes
  people anxious: only for global operations. Long loads offer cancel and a progress bar. Keep a
  loader moving (a static one looks frozen). **Never more than one loading animation on a page.**
- Results: in place for local operations; an icon toast (auto-dismisses after 1.5 s) for a light
  success; a text toast (1.5 s) for a light status or minor warning; a modal dialog for a result the
  user must acknowledge, with next steps; a result page at the end of a flow.
- **Errors are never toasts.** Never leave the user stuck on a page with no way out. In forms, state
  the reason at the top and mark the faulty fields. Error types by priority: inline, banner, modal.
- Every page has one clear focus; nothing outside the current flow interrupts it. Prefer choosing
  over typing (location, camera card recognition, history). WeUI is the standard component library.

## Share card

- `onShareAppMessage` shows its `imageUrl` at **5:4**, PNG or JPG †. Without one, WeChat uses a
  screenshot of the current page †, which can catch a loading, empty or personal state. Design the
  card as its own graphic: sizes and export in [graphics](../disciplines/graphics.md).

## Canvas, units, type

- Choose the canvas deliberately: 375 px (fixed, scales) or 390 px (responsive, adapted per size).
  rpx and the frame: [portable-mockups](../fundamentals/portable-mockups.md). Specify hairlines in px,
  not rpx (implementation note in [stacks](../../../implement-design/references/stacks.md)).
- Follow the system font. Common sizes 22, 17, 15, 14 and 12 pt, with 17 as body.
- Targets (about 7-9 mm physical, and the 适老化 hit areas): [layout-and-spacing](../fundamentals/layout-and-spacing.md).
  Contrast: [color](../fundamentals/color.md).
- **Checks you run**: `lint.mjs --platform miniprogram` fails targets under the minimum
  ([numbers](../fundamentals/layout-and-spacing.md#targets-and-density)) and warns on bottom bars
  (custom tab bar, bottom toolbar) that sit in the home-indicator inset; clear every warning.

## 适老化 (care mode and large text)

Native bars adapt to the user's WeChat font setting by themselves; your own text and layout follow it
only if the design adapts to it. Render every key screen at standard size and in care mode.

- Read `fontSizeSetting` (px) and `fontSizeScaleFactor` from `wx.getAppBaseInfo`.
- iOS: 7 steps, standard 17 px, factor = setting ÷ 17. On 375-pt screens 16 / 17 / 18 / 19.5 / 21 / 22 /
  **23.8** (care mode); iPad care mode 24.5. Native navigation-bar text caps at 20 px.
- Android: 8 steps, standard 16 px: 16, 16, 16, 18, 18, **22 (care mode, × 1.4)**, 25, 26 px.
- Elements scale with the text factor; spacing between elements and containers stays fixed. Wrapping
  elements left-align; wrapped text keeps its alignment; show text in full where possible.
- Care mode: fonts, graphics and buttons × 1.4; spacing and the navigation bar keep their size.
  Above standard the navigation bar scales × 1.18 with a larger hit area.
- Native navigation and tab bars adapt themselves; **custom ones must be adapted by hand**. Top tabs
  scale labels and underline with spacing fixed; search bars scale text and icons and keep margins;
  content modules keep edge margins and must stay complete.
- WeChat's automatic adaptation tool misses cases: test by hand. Legal context:
  [accessibility](../fundamentals/accessibility.md).

## Other hosts

- Alipay (`my.*` APIs) and Douyin (`tt.*`) share the structure: a host capsule, host-owned launch and
  share surfaces. Their capsule position, safe-area APIs and review rules differ:
  read each host's rectangle at runtime and design to the larger keep-out when one design ships to
  several hosts.
- Alipay's design spec: `python3 "$S/catalog.py" show alipay-miniprogram-design` (`S` = `skills/design-studio/scripts`; a JS site; use
  a browser tool). The lab has no digest for it: mark its numbers unverified until read.
- Cross-host frameworks (uni-app, Taro) and kits (WeUI, Vant Weapp, TDesign):
  [stacks](../../../implement-design/references/stacks.md).

## Traps

- A button, search field or avatar under the capsule; a custom bar that imitates the capsule.
- More than five tabs, two tab bars on a page, the native bottom tab bar on a non-home page.
- An error shown as a 1.5 s toast; two loaders on one page; a modal loader for a local action.
- A shared page with no way home; the default screenshot as the share card.
- A custom navigation or tab bar that ignores the font setting; hard-coded capsule offsets.
