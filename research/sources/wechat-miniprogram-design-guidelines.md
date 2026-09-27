# WeChat Mini Program design guidelines (微信小程序设计指南) and the elderly-friendly guide (适老化)
- id: wechat-miniprogram-design-guidelines · url: https://developers.weixin.qq.com/miniprogram/design/ · fetched: 2026-09-27 · method: fetch
- review_by: 2026-12-26 (perishable +90d) · licence note: paraphrased digest, not a mirror
> 中文导语：微信官方的小程序设计指南：四条原则（友好礼貌、清晰明确、便捷优雅、统一稳定）、右上角胶囊不可侵占、标签栏 2-5 项、错误不用一闪而过的 toast、字号 22/17/15/14/12 pt、设计稿 375/390 px。本次同时读了《适老化设计指南》：关怀模式下字体和控件放大 1.4 倍、热区外扩 12 pt、最小 40×40 pt，并给出了各档位的具体字号。

Read on 2026-09-27: the main guide (Chinese; English machine translation offered, Chinese prevails) and `/miniprogram/design/elderly.html` (小程序适老化设计指南). Other sub-guides exist and were not read today: `adapt.html` (大屏适配: PC/tablet, dynamic layout, gesture-to-mouse translation), `accessibility.html` (无障碍), `MaterialDesign.html` (物料设计). The page footer reads "Copyright © 2012-2026 Tencent".

## Key facts - main guide
1. **Four principles** (§一-四): *friendly and polite* - every page has one clear focus, remove elements irrelevant to the user's decision, nothing outside the current flow interrupts it; *clear* - tell users where they are, where they can go, how to go back; secondary pages offer back at top-left (iOS edge-swipe and the Android back key also return); *convenient and elegant* - reduce typing (use APIs such as camera card recognition, location; prefer choosing over typing; search history), avoid mis-taps; *unified and stable* - consistent controls and interactions across pages; WeUI is the standard component library.
2. **Mini-program menu (capsule)** (§2.1 小程序菜单): WeChat places its official control at the top-right of **every** page, including embedded web views and plugins; content cannot be customised, only a dark or light scheme chosen; reserve its area and watch for event conflicts and tap reachability near it; custom navigation should look different from it.
3. **Tabs** (§2.1 页面内导航): top or bottom; **at least 2, at most 5**, and **no more than 4** recommended to protect tap area; never more than one tab bar per page; the native bottom tab bar style is **for the home page only** (icons, labels and label colours customisable).
4. **Launch page** (§2.2 启动页加载): apart from the brand logo, everything (including the loading indicator) is provided by WeChat and cannot be changed. Pull-to-refresh is also provided by WeChat.
5. **Loading feedback** (§2.2): custom loaders should be simple; **modal loading** covers the page and causes anxiety - use only for global operations; **local loading** where the action happened is the recommended feedback; long loads offer **cancel** and a **progress bar**; keep the loader animated (a static one looks frozen); **never more than one loading animation on a page**.
6. **Result feedback** (§2.2 结果反馈): local operations get feedback in place; page-level results use an **icon toast** (lightweight success, auto-dismisses after **1.5 s**, **not for errors**), a **text toast** (1.5 s, lightweight status or minor warnings), a **modal dialog** (results the user must acknowledge, with next steps) or a **result page** (end of a flow).
7. **Errors and forms** (§2.3): never leave the user stuck on a page with no way out; in forms state the reason at the top and mark the faulty fields; three error types by priority and timing - inline (原位), banner (公告), modal (模态).
8. **Tap targets** (§3.2): finger precision is far below a mouse; suitable physical size is about **7-9 mm**; avoid tiny or crowded controls; prefer standard component sizes.
9. **Type** (§5.1): follow the system font; common sizes **22, 17, 15, 14, 12 pt**. Colour, list, form, button and icon specs are shown as images (§5.2-5.6).
10. **Design canvas** (§六): **375 px** base width = fixed layout that scales across devices; **390 px** base width = responsive layout that needs per-size adaptation.

## Key facts - elderly-friendly guide (适老化, elderly.html)
11. **Read the user's font setting** (§二): `fontSizeSetting` (px) and `fontSizeScaleFactor` from **`wx.getAppBaseInfo`** (recommended; `wx.getSystemInfo` "will no longer be maintained").
12. **iOS steps** (§2.1): 7 steps (−1, standard, +1…+5); standard = **17 px**; scale factor = setting ÷ 17. On 375-pt screens: 16 / 17 / 18 / 19.5 / 21 / 22 / **23.8** (care mode, "关怀模式"); on 414-pt screens care mode is +4 = 23.8; iPad care mode is +2 = 24.5. Native nav bar text caps at 20 px (16 / 17 / 18.5 / 20 / 20 / 20 / 20).
13. **Android steps** (§2.1): 8 steps; standard 16 px; factors ×1, ×1, ×1, ×1.12, ×1.125, **×1.4 (care mode)**, ×1.55, ×1.65 → setting 16, 16, 16, 18, 18, 22, 25, 26 px; adapt to `fontSizeSetting` (device-independent-pixel changes do not yet apply to mini programs).
14. **Adaptive rules** (§3.1): elements scale with the text factor; spacing between elements and containers stays **fixed**; wrapping elements left-align by default; wrapped text keeps its original alignment; show text in full where possible.
15. **Care-mode sizing** (§3.2): fonts, graphics and buttons scale **1.4×**; spacing and nav bar keep fixed size; contrast **≥ 4.5:1** (≥ 3:1 for text > 18 dp/pt), may be strengthened.
16. **Hit areas** (§3.3): add a **12 pt** hit area around icons, icon+text links and images; icon and text leading to the same result share one continuous hit area; elements ≥ **44 pt** with clear bounds need no extension; hit area never exceeds its container (whole-container targets use the container); keep **≥ 2A** visual spacing between interactive elements and split the gap evenly; special small elements may extend beyond their container to reach **40 × 40 pt**.
17. **Components** (§3.4): nav bar unscaled at standard, **×1.18** above standard with larger hit area (native nav bar auto-adapts, custom ones must be adapted); bottom tab bar divides width evenly and scales icons/labels (native adapts, custom must be adapted); top tabs scale labels and underline, keep spacing fixed; search bar scales text/graphics, keeps margins; content modules keep edge margins and scale elements, content must remain complete.
18. **Tooling** (§四): an automatic 适老化 adaptation tool exists but does not cover all cases; test and adapt manually afterwards.

## What it changes for the skills
- skills/design-studio/references/platforms/mini-programs.md: reserve the capsule area before designing navigation; tab bar 2-5 (≤ 4 advised), native bottom tabs only on home; errors never as 1.5-s toasts; one loader per page, local loading preferred; 7-9 mm targets; type centred on 17 pt body with 22/15/14/12; choose 375 (fixed, scaled) vs 390 (responsive) deliberately.
- skills/design-studio/references/platforms/mini-programs.md and fundamentals/accessibility.md: add the 适老化 numbers - read `wx.getAppBaseInfo`; care mode 1.4× for type/graphics/buttons with fixed spacing; nav bar ×1.18; 12-pt hit extension, 44-pt no-extension threshold, 40 × 40 pt floor; 4.5:1 / 3:1 contrast; custom nav and tab bars must be adapted by hand.
- skills/design-studio/references/fundamentals/cjk-typography.md: WeChat's font-step tables are a concrete CJK UI type scale for large-text testing (17 → 23.8 px iOS care mode; 16 → 22 px Android).
- skills/critique-design/references/heuristics.md: capsule overlap, >5 tabs, transient error toasts, two loaders on one page and custom nav bars that ignore the font setting are review findings.

## Not verified / open
- The colour palette, list, form, button and icon specs (§5.2-5.6) are images and were not read.
- The large-screen, accessibility and 物料设计 sub-guides were not read today.
- The 2026-09-20 digest said the design canvas is "375 px or 390 px"; the page now distinguishes them (375 = fixed/scaled, 390 = responsive), which is recorded above.
