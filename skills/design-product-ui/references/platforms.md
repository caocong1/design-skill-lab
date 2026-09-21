# Platform Conventions

Users bring habits from their platform; honouring them is cheaper than
teaching new ones. This file gives the durable conventions and flags what is
version-bound (**perishable**; last reviewed 2026-09). **Numbers and component
names change with OS releases: open the official guideline
(`../../design-studio/references/resources/app-ui.md` > Platform guidelines)
before finalising a spec.** Several of those sites are JavaScript apps and
need a browser tool.

## Decide the Posture First

| Posture | Means | When |
| --- | --- | --- |
| Native | platform controls, navigation, typography, gestures | utilities, OS-integrated apps, anything that should feel like part of the device |
| Branded-native | native structure and behaviour, brand colour, type and illustration | most consumer apps |
| Cross-platform custom | one custom system on every platform | content and brand products, games; still obey back behaviour, safe areas, text scaling and accessibility APIs |

Do not mix idioms inside one app: no iOS-style back chevrons on Android
screens that also respond to system back in a different way, no Material FAB
on an otherwise native iOS screen.

## iOS and iPadOS

- **Structure**: tab bar for three to five top-level destinations; push
  navigation with a back control and edge-swipe back; modal sheets (with
  detents) for self-contained tasks; large titles that collapse on scroll.
  iPad adds sidebars, split view and multi-window; do not ship a stretched
  phone layout.
- **Targets and type**: 44 x 44 pt minimum targets. Support Dynamic Type
  (text styles, not fixed sizes); body text is 17 pt by default. Use the
  system font unless the brand requires otherwise.
- **Materials**: current releases use a translucent, layered system material
  (Apple calls it Liquid Glass) for bars and controls. Use the system
  components so the app inherits it; do not imitate it with custom blur, and
  keep content legible beneath it.
- **Safe areas**: respect the top, bottom (home indicator) and side insets;
  never place controls under the home indicator.
- **Gestures**: never block edge-swipe back; swipe actions on rows are
  shortcuts, not the only path; long-press opens context menus.
- **Feedback**: haptics paired with state changes; prefer undo to alerts;
  destructive actions use the destructive role and sit apart.
- **Symbols**: SF Symbols inside Apple-platform apps only.

## Android

- **Structure**: navigation bar (three to five destinations) on compact
  widths, navigation rail on medium, drawer or rail plus list-detail on
  expanded; top app bar; a floating action button only for the screen's single
  primary constructive action.
- **System behaviour**: edge-to-edge with correct insets; predictive back -
  back must always do the obvious thing; support the three-button and gesture
  navigation bars.
- **Targets and type**: 48 x 48 dp targets; sizes in sp so user font scaling
  works; test at 200% font scale.
- **Colour**: Material colour roles; optional dynamic colour from the user's
  wallpaper - decide whether the brand allows it.
- **Adaptive**: window size classes (compact under 600 dp, medium 600-839,
  expanded 840+, with large and extra-large beyond); foldables and tablets are
  a first-class case, including posture and hinge.
- **Motion**: the current system pairs easing curves with a spring scheme
  (`../../design-motion/references/motion-tokens.md`).

## HarmonyOS

- Design for "one design, many devices": phone, foldable, tablet, 2-in-1, car
  and wearable from one adaptive layout. Use the platform's breakpoint system
  (small, medium, large by window width in vp) and its adaptive layout
  capabilities (stretch, equal spacing, proportion, wrap, hide, extend) rather
  than per-device screens. Verify the current breakpoint values in the
  official guideline.
- Units are vp (layout) and fp (text, scales with the user's setting).
- System typeface HarmonyOS Sans; system icon set HarmonyOS Symbol; layered
  app icons.
- Bottom tabs on phones move to a side navigation on wide windows.
- Atomic services and cards are distinct, lighter surfaces: one task, no deep
  navigation.

## WeChat Mini Programs

(From the official guideline; digest in the lab at
`raw/docs/wechat-miniprogram-design-guidelines.md`.)

- The **capsule button** in the top-right corner is placed by WeChat on every
  page, cannot be customised beyond a light or dark variant, and must be given
  clear space; read its rectangle at runtime rather than hard-coding offsets.
  Custom navigation should look different from it and must not crowd it.
- Secondary pages offer a back control at the top-left. Tab bars hold two to
  five items (four or fewer recommended), one tab bar per page; the native
  bottom tab bar is for the home page.
- The launch screen shows only the brand mark; the rest is WeChat's.
- One loading animation per page. Icon and text toasts vanish after about 1.5
  seconds and suit light success messages; **errors must not be transient
  toasts** - state them clearly and persistently.
- Targets about 7-9 mm physical; layout in rpx (750 rpx = screen width).
- Follow the system font; the common sizes are 22, 17, 15, 14 and 12 pt.
  Design at 375 or 390 px wide.
- Separate sub-guidelines cover large-screen (PC / tablet) adaptation, elderly
  accessibility (the WeChat font-size setting scales the UI) and general
  accessibility.
- Other mini-program hosts (Alipay, Douyin) have their own capsule positions
  and review rules; check each.

## Desktop: macOS and Windows (including Electron and Tauri)

- **Window chrome**: a real title bar or a correctly implemented custom one:
  drag region, platform window controls in the platform's position (left on
  macOS, right on Windows), double-click to zoom or maximise, sensible minimum
  window size, remembered size and position.
- **Structure**: sidebar + content + optional inspector; toolbars for frequent
  commands; a **menu bar** on macOS with standard items and shortcuts; context
  menus on right-click everywhere it makes sense; a command palette for power
  users.
- **Input**: keyboard first - tab order, shortcuts with platform modifiers
  (Cmd vs Ctrl), arrow-key navigation in lists and trees, type-ahead, Escape
  to dismiss, Enter for the default action. Hover states and tooltips with
  shortcut hints. Multi-select with Shift and Cmd/Ctrl.
- **Density**: tighter than touch; 24-32 px controls, 13-14 px text is normal
  on desktop.
- **Native feel in web tech**: system font stack; no text selection on
  chrome (`user-select: none` on toolbars, not on content); default cursor on
  non-link controls; native-style scrollbars and overscroll; respect the
  system accent colour and appearance; no page-like scroll bounce on fixed
  chrome; focus rings that match the platform; instant response with no
  web-style page transitions.
- **Multi-window and state**: documents vs single-window apps; restore state;
  unsaved-changes handling on close.
- **Windows specifics**: title-bar customisation through the system caption
  area, system materials for window backgrounds, snap layouts - a resizable,
  responsive window is mandatory.

## Web Apps

- The browser is the platform: real links, working back and forward, URL as
  state, text selectable, zoom never disabled, native form controls unless
  there is a reason.
- Responsive from 320 px to ultra-wide; hover-dependent content has a touch
  and keyboard path; `:focus-visible` everywhere.
- Inputs at 16 px or more on mobile; correct `type`, `inputmode` and
  `autocomplete`.
- Respect `prefers-color-scheme`, `prefers-reduced-motion`,
  `prefers-contrast`, safe-area insets and dynamic viewport units.
- Progressive web apps add: an install-worthy icon set including maskable, a
  designed offline state, and a standalone-window layout with its own back
  affordance.

## Command-Line and Terminal UI

Human-first output by default with a machine-readable flag; helpful errors
that say what to do next; `--help` that leads with examples; colour as an
enhancement that degrades (respect `NO_COLOR`); progress for anything over a
second; confirm destructive actions or offer `--dry-run`; never require
interactivity in a pipe.

## Cross-Platform Checklist

Back behaviour; safe areas; text scaling; dark mode; targets per platform;
platform share, pickers and permission prompts; keyboard and pointer on
tablets and desktops; right-to-left if shipped; system accessibility
(screen reader labels, reduced motion, high contrast); and the platform's
store or review rules for UI.
