---
title: Desktop apps (Windows 11 Fluent 2, macOS 26-27, Electron and Tauri)
evidence: digest
sources: [fluent-2, apple-hig-liquid-glass, apple-hig-bars]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Desktop

Desktop users work in windows, with a keyboard and a precise pointer, for long sessions. A desktop
design is judged on window behaviour, keyboard reach and density, not on how the first screen looks.

This file owns window chrome, desktop structure and input, the Windows 11 (Fluent 2) and macOS 26-27
specifics, and what changes when a desktop app is built with web tech. Elsewhere:

- Posture (native, branded-native, custom) and the cross-platform checklist: [platforms](README.md).
- Pointer target sizes and density levels: [layout-and-spacing](../fundamentals/layout-and-spacing.md).
  Frame size and units: [portable-mockups](../fundamentals/portable-mockups.md).
- Material roles and their web approximations (Mica, Acrylic, Liquid Glass): [materials](../fundamentals/materials.md).
- Motion values: [motion-tokens](../disciplines/motion-tokens.md) (Apple springs §2, Windows curves §3).
- Icon families (Segoe Fluent Icons, SF Symbols): [icons](../disciplines/icons.md). App icons:
  [app-icons](../disciplines/app-icons.md). CJK font stacks: [cjk-typography](../fundamentals/cjk-typography.md).
- Office and WPS add-ins, IDE panels: [embedded-hosts](embedded-hosts.md). Installed web apps: [web](web.md).
- Build notes (WinUI, AppKit, Electron, Tauri): [implement-design stacks](../../../implement-design/references/stacks.md).

## 1. Every desktop app

| Area | Rule |
| --- | --- |
| Window chrome | A real title bar, or a custom one done completely: a drag region, window controls where the OS puts them (leading on macOS, trailing on Windows), double-click to zoom or maximise, a stated minimum window size, remembered size and position. |
| Resizing | Every window is resizable and re-composes per width (navigation form, panes, toolbar overflow); never a fixed-size web page in a frame. Specify pane resize and collapse rules. |
| Structure | Sidebar + content + optional inspector; a toolbar for frequent commands; context menus on right-click wherever an object is shown; a command palette for power users, in addition to visible commands ([product-ui](../disciplines/product-ui.md)). |
| Keyboard | Keyboard first: logical tab order; shortcuts with the platform modifier (⌘ on macOS, Ctrl on Windows) shown in menus and tooltips; arrow keys in lists, trees and grids; type-ahead; Esc dismisses; Enter runs the default action. Keyboard model, shortcut conflicts and task cost: [interaction](../disciplines/interaction.md). |
| Pointer | Hover states on everything interactive; tooltips with shortcut hints; multi-select with Shift (range) and ⌘/Ctrl (toggle). |
| Text | Desktop body text is smaller than mobile: macOS Body 13 pt (minimum 10), Windows Body 14 epx (minimum 12 Regular, 14 Semibold). Ramps in sections 2 and 3. |
| Windows and state | Decide document-based (many windows) or single-window; restore windows, panes and selection on relaunch; guard unsaved changes on close and quit. |
| Active and inactive | Both OSes dim an inactive window's chrome: draw the inactive state of the title bar and sidebar. |

## 2. Windows 11 (Fluent 2)

Design in effective pixels (epx), on multiples of 4 epx: Windows scales at plateaus from 100 to 400 %,
and 4 × 125 % is still a whole pixel.

### Materials

Roles, the no-stacking rules and "design the solid state first": [materials](../fundamentals/materials.md).
The Windows realisation:

- **Mica** (`base`): once per window, as the base layer; let it show through the title bar by
  extending content into it. Tinted by the wallpaper on the active window, neutral when inactive.
  **Mica Alt** goes under a tabbed title bar, with a commanding layer (menu bar,
  navigation) between base and content. Layers above Mica stay transparent where Mica should show.
- **Acrylic** has two blends. Background acrylic shows the desktop and other windows: flyouts,
  context menus, light-dismiss panes (`transient`). In-app acrylic blurs only the app's own content:
  a pane that opens over content, such as NavigationView in Compact or Minimal. Never on large
  backgrounds.
- **Smoke** (`scrim`) under modal dialogs: translucent black in both themes.
- **Solid** everywhere else; hierarchy comes from colour and elevation.
- Fallback triggers to draw for: transparency off, window inactive, high contrast, Remote Desktop and
  VMs, low-end hardware, builds below 22000 (Mica); Battery Saver and window deactivation (background
  acrylic). Whether Battery Saver also affects Mica is disputed between Microsoft's own pages: promise
  neither. In mockups Mica and Acrylic are annotated materials, never CSS blur.

### Title bar, shape, elevation

- **Title bar**: 32 px high; 48 px when it holds a centred search box or a person picture. Background
  Mica, blending with the window. Window icon 16 × 16 at 16 px from the edge; title in the Caption
  style 16 px after the icon or back button. Caption buttons (minimise, maximise/restore, close) stay
  at the trailing edge, also when tabs occupy the title bar. Inactive: title-bar elements turn
  semi-transparent.
- **Radii**: 8 px on top-level containers (windows, flyouts, dialogs, teaching tips); 4 px on in-page
  controls (button, checkbox, combo box, text box, list item backplates), on bar shapes (progress bar,
  scroll bar, slider) and on tooltips; 0 px where straight edges meet and when a window is snapped or
  maximised.
- **Elevation**: Windows outlines objects with a 1 px stroke instead of a key shadow. Elevation values:
  window and dialog 128, flyout 32, tooltip 16, card 8, control 2 (1 when pressed), layer 1.
  The app has two layers: a base layer (menus, commands, navigation) and a content layer. In both
  themes, darker means less important and lighter means more important.
- **Interaction states**: on Windows controls get *lighter* as the user interacts (hover is lighter
  than rest), the reverse of Fluent web, which darkens. Focus changes the stroke (thicker), not the fill.
  The system accent colour is generated for contrast in both modes: design with it, not against it.

### Structure and layout

- **Silhouettes**: pick one of the four Windows app shapes: top navigation (Photos), menu bar
  (Notepad), left navigation (Settings), tab view (Terminal). Content margins vary; Microsoft's
  examples use 56 epx for media and settings content and 12 epx for editors.
- **Navigation**: left navigation is NavigationView. As the window narrows, re-compose it from an open
  pane to a compact icon rail to a minimal menu button; when the collapsed pane opens over content,
  it uses in-app acrylic.
- **Window classes** (epx): small ≤ 640, medium 641-1007, large ≥ 1008. TVs count as small.
- **Spacing** (4 epx ramp; 2, 6 and 10 exist to align icon padding): 8 between buttons, between a
  button and its flyout, and between a control and its header; 12 between a control and its label and
  between content areas; 16 from a surface edge to text; indent controls inside an expander by 48.
  Multi-line list items: Body + Caption with 32 epx icons. Section headers: Body Strong.

### Type

Segoe UI Variable, with an automatic optical-size axis. Windows ramp (size / line height, epx):

| Style | Size | Weight |
| --- | --- | --- |
| Caption | 12 / 16 | Regular |
| Body | 14 / 20 | Regular |
| Body Strong | 14 / 20 | Semibold |
| Body Large | 18 / 24 | Regular (Learn also lists an 18 / 24 Semibold) |
| Subtitle | 20 / 28 | Semibold |
| Title | 28 / 36 | Semibold |
| Large Title | 40 / 52 | Semibold |
| Display | 68 / 92 | Semibold |

- No Bold and no italic in the ramp: use Semibold. Regular for most text, Semibold for titles.
- Sentence case everywhere; left-aligned; ellipsis for truncation; 50-60 characters per line.
- Other scripts: Microsoft YaHei UI (Simplified Chinese), Microsoft JhengHei UI (Traditional Chinese),
  Yu Gothic UI (Japanese), Malgun Gothic (Korean); SimSun only in legacy environments. Selawik is the
  open, metric-compatible stand-in for Segoe UI when drawing off Windows.
- Fluent **web** (Office add-ins, M365) uses a different ramp and code tokens: [embedded-hosts](embedded-hosts.md).

### Motion

Prefer the built-in page transitions, connected animation and animated icons over custom motion; the
curves and durations are in [motion-tokens](../disciplines/motion-tokens.md) §3. Windows' "Animation
effects" off means the reduced variant ([motion](../disciplines/motion.md) §5).

## 3. macOS 26-27 (Liquid Glass)

The Liquid Glass rules the Mac shares with iOS and iPadOS are owned by [ios](ios.md): the functional
and content layers, regular vs clear, no glass on glass, colour on glass (monochrome bar symbols, one
tinted primary action), scroll edge effects instead of bar fills, toolbar groups, accessibility
settings and the absence of published glass values. Apps built with the macOS 27 SDK can no longer opt
out. What differs on the Mac:

- **Content-layer materials**: macOS names its standard materials by purpose (`NSVisualEffectView`)
  and blends them behind the window or within it. Choose by role, never for the colour they seem to give.
- **Content runs beneath the chrome** to the window edge: under the sidebar and toolbar, with the
  background extension effect for an image beside a sidebar or inspector. Where text or table headers
  pin under the toolbar, the hard scroll edge (more opaque, sharp line) is the usual macOS choice.
- **Sidebar**: at most two levels (deeper data goes in a split view with a content list). People can
  hide it; it is not hidden by default; auto-hide it as the window narrows. Row height, text and glyph
  size follow the user's sidebar-size setting (small, medium, large): check the large setting too.
  Icons follow the user's accent colour; a fixed colour only when it carries meaning. No
  critical items at the bottom.
- **macOS 27**: sidebars reach the window edges; the selected sidebar item is semibold; bordered
  toolbar items over the sidebar become glass; glass controls may bounce on click (controls only).
- **Toolbar**: lives in the window frame; items have no bezel. The single `.prominent` action shows
  as a prominent text button, not a checkmark. The centre group is customisable and collapses into the
  system overflow menu first; never add your own overflow menu.
- **Menu bar**: 24 pt tall. Every toolbar command also exists as a menu-bar command, with its
  shortcut. In the 27 releases menus show icons on only a minimal set of key items by default.
- **Controls**: Mini, Small and Medium stay rounded rectangles; Large becomes a capsule; there is a new
  X-Large size. Nested shapes are concentric with the window corner
  ([layout-and-spacing](../fundamentals/layout-and-spacing.md)).
- **Layout**: no controls along the bottom edge of a window.
- **Glass values**: none are published; every glass value in a mockup is a labelled approximation
  ([materials](../fundamentals/materials.md)).

### Type

SF Pro. macOS has no Dynamic Type; default 13 pt, minimum 10 pt; avoid Ultralight, Thin and Light.
Text styles (size / line height, pt):

| Style | Size | Note |
| --- | --- | --- |
| Large Title | 26 / 32 | |
| Title 1 | 22 / 26 | |
| Title 2 | 17 / 22 | |
| Title 3 | 15 / 20 | |
| Headline | 13 / 16 | Bold; emphasised Heavy |
| Body | 13 / 16 | |
| Callout | 12 / 15 | |
| Subheadline | 11 / 14 | |
| Footnote | 10 / 13 | |
| Caption 1 | 10 / 13 | emphasised Medium |
| Caption 2 | 10 / 13 | Medium |

## 4. Web tech in a desktop shell (Electron, Tauri)

The web layer does not inherit native feel; design it in.

- System font stack and the OS appearance and accent colour; focus rings that match the platform.
- No text selection on chrome (`user-select: none` on toolbars and sidebars, never on content); the
  default cursor on non-link controls; native-style scrollbars; no scroll bounce on fixed chrome.
- Instant response: no web-style page transitions between views; state changes, not navigations.
- **Custom title bar**: leave room for the traffic lights (leading, macOS) or the caption buttons
  (trailing, Windows); mark the drag region and keep controls inside it clickable; draw the
  full-screen and maximised states. On Windows follow the 32 / 48 px title-bar rule above.
- **One design, two OS skins** when both ship: shared content, per-OS chrome (control placement, menu
  bar on macOS vs an in-window menu or none on Windows, ⌘ vs Ctrl in every shortcut hint, radii and
  materials per section 2 or 3). Draw both frames.
- **Materials**: the web layer cannot draw Mica or Liquid Glass. Where the shell exposes the OS window
  material, leave those regions transparent over it; otherwise use the material's solid fallback
  colour, never a CSS blur that pretends to be Mica.
- Render at 100 % and 125 % scaling for a Windows audience: 1 px lines and small text break first.

## 5. Verify

- Both OS frames if both ship; active and inactive windows; light, dark and, on Windows, a contrast
  theme (materials drop out, forced colours apply per [color](../fundamentals/color.md)).
- The minimum window size and each Windows window class; the solid fallback of every material role.
- Keyboard walk-through of the primary flow, shortcuts visible in menus and tooltips.
- Terminal UI, if the product has one: human-first output with a machine-readable flag, errors that
  say what to do next, `--help` that leads with examples, colour that degrades (`NO_COLOR`), progress
  for slow work, `--dry-run` or a confirmation before destructive actions, never interactive in a pipe.
