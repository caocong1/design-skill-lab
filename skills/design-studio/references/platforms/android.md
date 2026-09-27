---
title: Android (Android 16, Material 3 Expressive)
evidence: digest
sources: [material-3-expressive]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Android

Native Android in 2026 means Material 3 Expressive (announced 2025-05-13): an update of M3, not
"M4", and M3 is not deprecated. It changed the structure (no drawer, no bottom app bar, a shorter
navigation bar) and the motion (springs). The Figma spec runs ahead of stable code, so every
Android handoff carries a code-availability note (last section). Posture and the cross-platform
checklist: [README](README.md).

Numbers come from m3.material.io rendered in a browser (the site is a JS app; its Specs pages load
token tables from `https://m3.material.io/_dsm/data/dsdb-m3/<snapshot>/TOKEN_TABLE.<id>.json`) and
the androidx sources, read 2026-09-27. Facts marked † come from developer.android.com behaviour-change
pages for Android 15 and 16, read the same day, and are not yet in the lab digest.

## Changed in the last release

| When | What changed for a designer |
| --- | --- |
| M3 Expressive, 2025-05 | Flexible navigation bar, 64 dp (the 80 dp baseline bar is no longer recommended). Expanded navigation rail replaces the drawer. Docked toolbar replaces the bottom app bar; floating toolbar is new. New: button groups (the connected group replaces the segmented button), split button, FAB menu (replaces the speed dial), medium FAB, loading indicator. Flexible app bars replace medium and large. 35 library shapes with shape morph; three new corner steps. 15 emphasized type styles. Springs replace easing and duration ([motion-tokens](../disciplines/motion-tokens.md)) |
| May 2026 | "Window size classes" renamed "breakpoints"; a layout scaffold of bars, rails and panes |
| Aug 2026 | Line heights adapt to a script's height category (small, medium, large, extra large) |
| Android 15, target 35 † | Apps are edge-to-edge by default: status bar transparent, content draws behind the status and navigation bars unless insets are applied; the three-button bar is 80 % opaque by default |
| Android 16, target 36 † | The edge-to-edge opt-out is disabled. Predictive back system animations (back-to-home, cross-task, cross-activity) are on by default, and `onBackPressed` is no longer called |

## Posture on Android

- **Native**: the M3 Expressive components below, Roboto, Material Symbols, the expressive spring
  scheme for most products and the standard scheme for utilitarian ones
  ([motion](../disciplines/motion.md) sets the posture default).
- **Branded-native**: M3 structure and behaviour with the brand's colour roles, type and shape.
- **Expressive tactics** (Material's own list): shape variety, rich contrast between colour roles,
  emphasized type, containment, fluid motion, component flexibility. Combine them into one or two
  "hero moments" per product, not everywhere.

## Navigation

Breakpoint widths and pane counts: [layout-and-spacing](../fundamentals/layout-and-spacing.md).
Components per breakpoint:

| Breakpoint | Primary navigation |
| --- | --- |
| Compact, medium | flexible navigation bar (vertical items in compact, horizontal items in medium), or a modal expanded rail |
| Expanded, large, extra-large | modal or standard expanded rail; it can collapse to the rail or hide |

| Component | Spec |
| --- | --- |
| Flexible navigation bar | 64 dp high; 3-5 destinations; container `surface-container`; active indicator `secondary-container`, 56 × 32 dp (vertical item) or 40 dp high (horizontal item); active label `secondary`; icons 24 dp; label `label-medium`. Draw no shadow (the overview says none) |
| Collapsed rail | 96 dp wide (narrow variant 80 dp); replaces the baseline rail |
| Expanded rail | 220-360 dp wide; top space 44 dp; items 64 dp high (short 56 dp); 3-7 destinations plus an optional FAB. Standard (non-modal) or modal (`surface-container`, corner large 16 dp, elevation level 2). Collapsed and expanded may transition on any device |
| Navigation drawer | no longer recommended (the baseline was 360 dp wide). Never draw a new one; in a redesign move its destinations into the expanded rail and weigh the change for existing users ([redesign](../process/redesign.md)) |

Back always does the obvious thing. Predictive back shows the destination while the gesture is in
progress, so the screen underneath must be a real, rendered state, and custom back handling cannot
rely on `onBackPressed` †. Support gesture and three-button navigation.

## Bars and actions

| Component | Spec |
| --- | --- |
| App bars | small 64 dp (centre-aligned merged into it); medium flexible 112 dp (136 with subtitle); large flexible 120 dp (152 with subtitle); a search app bar. Titles: small `title-large`, medium flexible `headline-medium`, large flexible `display-small`. On scroll the container fills with `surface-container`, no shadow. Flexible bars allow subtitles, centred or wrapping titles, images and a filled trailing icon button |
| Docked toolbar | replaces the bottom app bar; 64 dp; centred items, equal spacing, at least 16 dp outside padding |
| Floating toolbar | horizontal or vertical, may pair with a FAB; 64 dp; fully rounded; elevation level 3; 16 dp from the edge (vertical variant 24 dp) |
| Toolbar colour | standard (`surface-container`) or vibrant (`primary-container`) |
| FAB | 56 dp (corner 16); medium 80 dp (corner 20, new); large 96 dp (corner 28). Small FAB (40 dp) and surface-colour FABs are no longer recommended. Extended FAB: 56 / 80 / 96 dp |
| FAB menu | opens from a FAB with 2-6 related actions; one menu size for every FAB size; close button 56 dp; items use medium-button metrics (56 dp); 16 dp margins; anchored at the FAB's top trailing corner; never from an extended FAB; colour sets primary, secondary, tertiary |
| Buttons | XS / S / M / L / XL = 32 / 40 / 56 / 96 / 136 dp high; icons 20 / 20 / 24 / 32 / 40 dp; round (full) or square (corners 12 / 12 / 16 / 28 / 28); pressed corners morph to 8 / 8 / 12 / 16 / 16; small buttons 16 dp side padding. Icon buttons: the same heights in narrow, default and wide widths |
| Standard button group | padding XS 18, S 12, M-XL 8 dp (keeps 48 dp targets); pressing widens the pressed button by 15 % and squeezes its neighbours |
| Connected button group | replaces the segmented button; 2 dp gaps; inner corners S 8, M 8, L 16, XL 20 dp (XS: the page says 4, the token resolves to 8; build to the token); the selected inner corner becomes 50 % |
| Split button | leading button plus trailing menu button; XS-XL; elevated, filled, tonal or outlined; 2 dp gap; inner corners XS-M 4, L 8, XL 12 dp, outer corners full; when open the menu icon spins and becomes centred and round; colour does not change |
| Loading indicator | for waits under 5 s and pull-to-refresh; replaces most indeterminate circular progress; 48 dp container, 38 dp indicator; contained or not |

- Never show a toolbar and a navigation bar at the same time.
- A FAB is the screen's single primary constructive action; related secondary actions go in a FAB
  menu, not a stack of small FABs.

## Shape, type, colour, icons

- **Corners** (`md.sys.shape.corner.*`): none 0 · extra-small 4 · small 8 · medium 12 · large 16 ·
  large-increased 20 · extra-large 28 · extra-large-increased 32 · extra-extra-large 48 · full.
  Nesting follows the concentric rule in [layout-and-spacing](../fundamentals/layout-and-spacing.md).
- **Library shapes** (35, from Circle and Pill to Cookie and Burst): for mostly visual elements such as
  image crops and avatars, sparingly, never on text-heavy containers. Shape is not semantic. Shape
  morph does not exist on the web.
- **Type**: static Roboto is the default for M3 components; Roboto Flex is not yet in the type scale
  (fallback Roboto Flex → Roboto → Noto Sans). Google Sans is Google's own face: a third-party app
  uses Roboto. Sizes in sp; test at font scale 2.0.

| Baseline style (sp, size / line height) | Large | Medium | Small |
| --- | --- | --- | --- |
| Display | 57 / 64 | 45 / 52 | 36 / 44 |
| Headline | 32 / 40 | 28 / 36 | 24 / 32 |
| Title | 22 / 28 | 16 / 24 (500) | 14 / 20 (500) |
| Body | 16 / 24 | 14 / 20 | 12 / 16 |
| Label (500) | 14 / 20 | 12 / 16 | 11 / 16 |

  Emphasized styles keep the sizes and raise the weight: display, headline and title-large 400 → 500;
  title-medium, title-small and labels 500 → 700; body 400 → 500. Use them for the one or two hero
  moments. Roboto tracking: display-large −0.25, title-medium 0.15, title-small 0.1, body-large 0.5,
  body-medium 0.25, body-small 0.4, label-large 0.1, label-medium and label-small 0.5.
- **Colour**: M3 colour roles, each tokenised at standard, medium and high contrast. Dynamic colour
  (from the wallpaper) is optional and the baseline scheme is static: decide from the brief whether
  the brand allows it, and render both if it does.
- **Materials**: M3 has no glass. Hierarchy comes from tonal surfaces (`surface`, `surface-container`
  and its steps) ([materials](../fundamentals/materials.md)).
- **Icons**: Material Symbols (variable: outlined, rounded, sharp; axes weight, fill, optical size,
  grade). The old `material-icons` package is no longer recommended ([icons](../disciplines/icons.md)).

## Edge-to-edge and system bars

- Draw every screen edge-to-edge: the background runs under the transparent status bar and the
  navigation bar, and content is inset so nothing interactive sits under them †.
- With gesture navigation the bottom bar is only a handle over your content; with three-button
  navigation it is an 80 % opaque bar by default, its colour possibly matching the window background †. Check the bottom
  of every screen in both.
- Opaque bars (the navigation bar, a docked toolbar) stop the content region; a floating toolbar lets
  content run beneath it ([portable-mockups](../fundamentals/portable-mockups.md)).

## What to draw, what the system draws

| Element | Draw | The system draws |
| --- | --- | --- |
| Status bar, gesture handle or three-button bar | labelled placeholders, content running beneath | everything |
| Navigation bar, rail | destinations, icons, labels, the active item, badges | indicator shape and motion |
| App bar, toolbar | title, actions, the scrolled state (tonal fill) | geometry, scroll behaviour |
| Dialogs, pickers, menus, snackbars, keyboard | content, options, order | the component |
| Predictive back | the destination screen as a real state | the gesture animation |
| Motion | which component moves and with which scheme | the springs ([motion-tokens](../disciplines/motion-tokens.md)) |

## Handoff: code availability (as of 2026-09-27)

Put this note in every Android handoff that uses Expressive parts; the API mapping is in
[stacks](../../../implement-design/references/stacks.md).

- Compose material3 stable **1.4.0** (2025-09-24) ships the 64 dp flexible navigation bar and the
  collapsed and expanded rails. It keeps the motion-scheme API and emphasized type internal (only the
  standard scheme is used) and lacks toolbars, button groups, split button, FAB menu, medium FAB,
  flexible app bars, loading indicator and the shape library.
- Those arrive in **1.5.0-alpha** (latest alpha29, 2026-09-23); the shape library and the loading
  indicator are still experimental there.
- Views: MDC-Android **1.14.0** has the Material3Expressive themes; the FAB menu is unavailable for
  Views.
- Web: the Expressive components and shape morph are unavailable; motion uses Material's curve table.
- Template: "Uses M3 Expressive: <components>. Compose needs material3 1.5.0-alpha (stable 1.4.0
  lacks them); Views needs MDC 1.14.0; <any part with no Views or web version>."

## Traps

- A navigation drawer or a bottom app bar in a new design; an 80 dp navigation bar.
- A navigation bar and a toolbar on the same screen; a stack of small FABs; a segmented button.
- An iOS back chevron with a "Back" label, or a floating glass tab capsule, on Android.
- A shadow under a scrolled app bar (it fills with `surface-container` instead).
- Library shapes on text containers; expressive bounce on a utilitarian tool.
- A mockup whose content stops above the status and navigation bars.
- Google Sans in a third-party app; the `material-icons` set.
