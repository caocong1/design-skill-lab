---
title: iOS and iPadOS (Liquid Glass, 26-27)
evidence: digest
sources: [apple-hig-liquid-glass, apple-hig-bars]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# iOS and iPadOS

Liquid Glass is the functional layer that floats over the content: tab bars, toolbars and sidebars
are glass, content scrolls beneath them. Draw that layering; do not draw the pre-2025 flat, opaque
bar. macOS is in [desktop](desktop.md); app icons (Icon Composer) are in
[app-icons](../disciplines/app-icons.md); posture and the cross-platform checklist are in
[README](README.md).

Numbers here come from HIG pages read on 2026-09-27. The HIG site is a JS app; each page is also
served as JSON at `https://developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json`
(for example `tab-bars`, `toolbars`, `materials`, `layout`, `typography`). Past `review_by`, re-read
those pages before quoting a number.

## Changed in the last release

| Release | What changed for a designer |
| --- | --- |
| 26 (2025) | Liquid Glass functional layer; tab bar floats and can minimise on scroll, with an accessory slot and a trailing search tab; toolbars grouped, one prominent action; scroll edge effects replace opaque bar backgrounds; larger sheet radius, inset half sheets; taller list rows, title-case section headers; new system colour values (blue `#0088FF`); iPad gets a menu bar |
| 27 (2026) | No opt-out: apps built with the 27 SDKs ignore `UIDesignRequiresCompatibility`. Liquid Glass transparency slider in Settings. iPhone apps fully resizable (iPhone Mirroring on macOS 27, iPhone-only apps on iPad): layout follows size classes, not device or orientation. One prominent tab, visible even when the bar minimises. iPhone apps may opt into the sidebar form. Toolbar items get visibility priorities; the navigation bar can minimise on scroll. `.automatic` scroll edge has its own look (no longer switches soft/hard). iPhone Duo (folding) moves bars to the side on its outer display. Inactive iPad windows dim |
| HIG, 2026-09-09 | The Layout page no longer publishes device-size tables; frames now come from secondary sources |

## The two layers

- **Functional layer = Liquid Glass**: tab bars, toolbars (including the navigation bar), sidebars,
  floating controls. **Content layer**: everything else. Never put glass in the content layer; use
  standard materials there (`ultraThin`, `thin`, `regular`, `thick`). One exception: a transient
  control (slider, toggle) looks like glass only while it is being used.
- System components adopt glass automatically. Put glass on a custom control only when it is one of
  the most important functional elements.
- **No glass on glass.** Anything placed on glass uses fills, transparency and vibrancy, not a second
  glass layer.
- Small glass (navigation bars, tab bars) flips light or dark with the content beneath; large glass
  (menus, sidebars) adapts but does not flip. Bigger glass renders thicker, with deeper shadow.
- At rest (launch, top of a scroll view) content must not intersect glass, and controls must be
  legible in that resting state even if colourful content later scrolls under them.

| Variant | Use | Rule |
| --- | --- | --- |
| Regular | most components; anything with a lot of text (alerts, sidebars, popovers) or at legibility risk | blurs and adjusts luminosity; the default |
| Clear | only over media-rich content (photos, video) | all three must hold: media-rich content beneath, the content layer can take a dimming layer, the content on top is bold and bright. Over bright content add a dark dimming layer at 35 % opacity (skip it if the content is already dark or AVKit controls bring their own) |

Never mix regular and clear in one view.

**Colour on glass** (this file owns the Apple rule; [color](../fundamentals/color.md) links here):

- Symbols and text on small glass (tab bars, toolbars) are monochrome by default.
- Emphasise the single primary action by tinting its **background** (the prominent style), never its
  symbol or text. One tinted control per bar: a toolbar with every button blue is the HIG's own
  "incorrect" example.
- Brand colour goes into the content layer, where it scrolls under the glass and tints it
  dynamically. Over colourful content keep bars monochrome or pick an accent clearly different from
  the content. Accent sparingly: primary actions, unread badges, the selected tab.

**Separating bars from content**: no solid or semi-opaque background under a bar. Use a scroll edge
effect, only where a scroll view runs behind floating UI, one per view (one per pane in a split
view, all the same height). Styles `automatic` (prefer it), `soft`, `hard`. Extend full-screen
backgrounds to the screen edge under the bars; next to a sidebar, let an image continue beneath it
with the background extension effect.

**Accessibility settings change the material**: Reduce Transparency makes it frostier; Increase
Contrast makes elements mostly black or white with a contrasting border; Reduce Motion lowers the
effect and turns off the elasticity; the iOS 27 slider changes the tint. Its range and default are
not documented.

**No numbers exist for the glass itself.** Apple publishes no blur radius, tint opacity or refraction
values; the 35 % dimming layer is the only one. Draw glass as the labelled approximation in
[portable-mockups](../fundamentals/portable-mockups.md) (`data-material="glass-regular"`, or
`glass-clear` over a `scrim`, the 35 % dim layer); the role names are owned by
[materials](../fundamentals/materials.md). Never put a blur value in a handoff.

## Tab bar (iPhone)

- **Navigation only, never actions.** An action on the current view belongs in a toolbar.
- Visible in every section; only a modal may cover it. Never disable or hide a tab: an empty section
  explains why it is empty.
- Keep the count low enough that no **More** tab appears (the trailing tab turns into More when space
  runs out). Single-word labels. SF Symbols, preferably filled; compact width puts the icon above
  the label, regular width side by side.
- Badges: red oval, white number or "!", for critical information only.
- It floats above the content at the bottom, on glass, and content shows through. Draw the content
  running beneath it ([portable-mockups](../fundamentals/portable-mockups.md) says how).
- Label colour must not resemble the content background.

| Option | Behaviour | Draw |
| --- | --- | --- |
| Minimise on scroll | scrolling down collapses the bar to the current tab at the leading bottom corner; the accessory moves inline in the centre; search stays in the trailing corner; a tab tap or scrolling to the top expands it | both states: at rest and scrolled |
| Accessory | a slot above the bar for a persistent feature (Music's MiniPlayer) | only persistent features; a checkout button stays with the content it supports |
| Search tab | a separate tab at the trailing end (search role) | standard tab: opens a search landing page with the field at the top (discovery). Button appearance: focuses the field and raises the keyboard at once, transient, returns to the previous tab |
| Prominent tab (27) | one tab gets a prominent treatment and stays visible when the bar minimises; a search tab gets it by default if no tab is marked | a separated trailing tab, labelled "prominent tab"; its exact look beyond "enhanced emphasis" is not documented |

**Where search goes**: a tab (app-wide or discovery search); a bottom toolbar, as a field or as a
button that animates into a field above the keyboard ("place search at the bottom if there's
room"); a button in the top toolbar; or an inline field above the list it filters, optionally pinned
to the top toolbar on scroll.

## Toolbars and the navigation bar

The separate "Navigation bars" page is gone: a navigation bar is a toolbar at the top. It holds a
title, navigation controls (back, forward, search) and actions.

- **Title**: never the app name; under 15 characters. A large title shrinks to a standard title on
  scroll and returns at the top.
- **Back and Close**: the standard symbols with no text label. A capsule reading "‹ Back" is the
  HIG's "incorrect" example.
- **Symbols over text**, except actions symbols show badly (Edit). System symbols without borders:
  no outlined circles, the group already is the container.
- **One prominent action** (Done, Submit): tinted, trailing, one per toolbar; on iOS usually a blue
  checkmark.

| Group | Holds | Behaviour |
| --- | --- | --- |
| Leading | back, sidebar toggle, title, document menu | not customisable |
| Centre | common controls | customisable on iPad; first to collapse into the system overflow menu |
| Trailing | important items, inspector toggle, optional search, the More menu, the primary action | always visible |

- Aim for at most three groups. Group by function and frequency; navigation and critical actions
  (Done, Close, Save) get their own groups.
- Items sharing one background are all symbols or all text; keep a text action apart from symbol
  actions with fixed space, or it reads as one button.
- Standard items have corner radii concentric with the bar; custom items match.
- Give every non-text item a title as well as an accessibility label: overflow menus and iPhone
  Duo's vertical bars show the title. Never add your own overflow menu; the system adds it.

Standard symbols (use these names in `data-icon`): Done `checkmark` · Cancel/Close `xmark` · More
`ellipsis` · Share `square.and.arrow.up` · Compose `square.and.pencil` · Add `plus` · Search
`magnifyingglass` · Filter `line.3.horizontal.decrease` · Delete `trash` · Undo
`arrow.uturn.backward` · Redo `arrow.uturn.forward`.

## Push, sheets, lists

- Hierarchy pushes with a back control and edge-swipe back. Never block the edge swipe; swipe actions
  on rows are shortcuts, never the only path; long-press opens a context menu.
- Self-contained tasks go in a sheet with detents (a partial height for a quick task, full height
  when the task needs the screen). Sheets have a larger corner radius; half sheets are inset from the
  display edge and become more opaque at full height. Action sheets originate from the control that
  opened them.
- Lists, tables and forms have taller rows and more padding than before 2025, and section headers in
  title case, not all caps. Do not reuse pre-2025 row heights.
- Alerts and onboarding set system type bolder and left-aligned (WWDC25 talk, not the HIG page).
- Destructive actions use the destructive role and sit apart; prefer undo to a confirmation alert;
  pair state changes with haptics.

## iPad and resizable iPhone

- The iPad tab bar sits near the top, either fixed or with a button that turns it into a sidebar
  (sidebar-adaptable); you choose which form opens. A toolbar and the tab bar can share the top row.
  Customisable tab lists default to five or fewer. "Consider a tab bar first."
- Sidebars float in the glass layer; content runs beneath them (horizontal scroll or background
  extension). At most two levels; deeper data takes a split view with a content list. People may
  hide the sidebar; do not hide it by default. Sidebar icons use the accent colour.
- Base layout on size classes, keep functionality the same when the class changes, and let a larger
  space switch the tab bar to a sidebar. In iOS 27 an iPhone app can opt into the sidebar form, shown
  when there is room. Never ship a stretched phone layout.

**iPhone Duo** (new HIG page 2026-09-09): on the outer display the toolbars, tab bar, navigation
controls, status bar and Dynamic Island move to the side. The inner display keeps them on the side
in landscape and uses normal horizontal bars in portrait; in Split View each app puts its controls
on its outer edge (same side in right-to-left). Along the vertical bar: primary navigation (Back,
Close) at the top, then prominent actions; overflow runs bottom to top. Reserved regions: the outer
camera (always), the inner camera (while active), the fold (partly open). Prefer an even number of
grid columns. Point sizes and the vertical bar width are not published; only App Store screenshot
sizes are (outer 1398 × 2034 px, inner 2007 × 2853 px).

## Frame, safe areas, type, colour

- **Frame**: [portable-mockups](../fundamentals/portable-mockups.md) owns frame sizes (the default
  phone is 402 × 874 pt, iPhone 17 and 17 Pro, from secondary sources because the HIG no longer lists
  devices). Check a narrow phone and a resized window too.
- **Safe areas**: backgrounds run under the status bar, the home indicator and floating bars; content
  and controls are inset by the safe area; nothing interactive under the home indicator. Near the
  screen edge a capsule with extra margin sits better than a concentric shape (shape types:
  [layout-and-spacing](../fundamentals/layout-and-spacing.md)). Targets: same file.
- **Checks you run**: `lint.mjs --platform ios` fails targets under the minimum
  ([numbers](../fundamentals/layout-and-spacing.md#targets-and-density)) and warns on bottom bars
  (floating tab bar, toolbar) that sit in the home-indicator inset; clear every warning.
- **Type**: SF Pro, Dynamic Type text styles, never fixed sizes. Default 17 pt, minimum 11 pt. Avoid
  Ultralight, Thin and Light.

| Style (Large, default) | Size / leading pt | Weight → emphasized |
| --- | --- | --- |
| Large Title | 34 / 41 | Regular → Bold |
| Title 1 / Title 2 | 28 / 34, 22 / 28 | Regular → Bold |
| Title 3 | 20 / 25 | Regular → Semibold |
| Headline | 17 / 22 | Semibold → Semibold |
| Body | 17 / 22 | Regular → Semibold |
| Callout / Subhead | 16 / 21, 15 / 20 | Regular → Semibold |
| Footnote / Caption 1 / Caption 2 | 13 / 18, 12 / 16, 11 / 13 | Regular → Semibold |

  Range: Body is 14 / 19 at xSmall and 53 / 62 at AX5 (Large Title 60 / 70). Render at least one AX
  size of every text-heavy screen.
- **Tracking** (apply in mockups; the running app does it itself), pt: 11 +0.06 · 12 0 · 13 −0.08 ·
  15 −0.23 · 16 −0.31 · 17 −0.43 · 20 −0.45 · 22 −0.26 · 24 +0.07 · 28 +0.38 · 34 +0.40. Positive from
  24 pt up: never tighten a large title web-style.
- **Colour**: reference semantic roles (label, secondaryLabel, tertiaryLabel, quaternaryLabel; system
  and grouped backgrounds, each primary / secondary / tertiary; separator, link). Avoid quaternary
  label on thin and ultraThin materials. Every custom colour needs light, dark and increased-contrast
  variants, and an app that ships one appearance still supplies light and dark for glass
  adaptivity. System colours from 2025 for mockups (default light, dark, increased-contrast light,
  increased-contrast dark); code references the role, never the hex:

```text
Red    #FF383C #FF4245 #E9152D #FF6165   Blue   #0088FF #0091FF #1E6EF4 #5CB8FF
Orange #FF8D28 #FF9230 #C55300 #FFA056   Indigo #6155F5 #6D7CFF #564ADE #A7AAFF
Yellow #FFCC00 #FFD600 #A16A00 #FEDF43   Purple #CB30E0 #DB34F2 #B02FC2 #EA8DFF
Green  #34C759 #30D158 #008932 #4AD968   Pink   #FF2D55 #FF375F #E7124D #FF8AC4
Mint   #00C8B3 #00DAC3 #008575 #54DFCB   Brown  #AC7F5E #B78A66 #956D51 #DBA679
Teal   #00C3D0 #00D2E0 #008198 #3BDDEC   Gray   #8E8E93 #8E8E93 #6C6C70 #AEAEB2
Cyan   #00C0E8 #3CD3FE #007EAE #6DD9FF   Gray6  #F2F2F7 #1C1C1E #EBEBF0 #242426
```

## What to draw, what the system draws

| Element | Draw in the mockup | The system draws (handoff: "system component") |
| --- | --- | --- |
| Status bar, Dynamic Island, home indicator | a labelled placeholder in position | everything |
| Tab bar | tabs (symbol name, label), selected tab, badges, accessory content, the minimised state if used, content passing beneath | material, geometry, minimise animation |
| Toolbar / navigation bar | title, groups, which item is prominent, symbol names, the large-title and scrolled states | capsules, spacing, collapse, overflow |
| Sheet | content, detents, what shows behind | radius, inset, grabber, dimming |
| Alert, action sheet, menu, context menu, picker, switch, keyboard | content, options, order, destructive role | the control |
| Scroll edge effect | where it applies, labelled | the effect |
| Content layer | all of it: this is the design | nothing |

Bar heights, insets and capsule radii live in Apple's Figma and Sketch kits, which the lab has not
read: any such value in the mockup kit is an approximation and never goes into a handoff. API names
for each row: [stacks](../../../implement-design/references/stacks.md).

## Traps

- A flush, opaque, full-width tab bar with a hairline top border (the iOS 18 bar).
- Actions in the tab bar; a More tab; a hidden or disabled tab; a checkout button in the accessory.
- A "‹ Back" text capsule; outlined-circle toolbar symbols; every toolbar button tinted; a text item
  and symbol items sharing one capsule.
- Glass cards in the content layer, glass on glass, a web blur presented as the platform material.
- Negative tracking on a 34 pt title; all-caps list section headers; `#007AFF` as the system blue.
- Layout keyed to device or orientation: iOS 27 resizes iPhone apps.
- More dated-mockup tells: [anti-slop](../fundamentals/anti-slop.md).
