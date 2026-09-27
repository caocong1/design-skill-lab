---
title: Embedded hosts (Office / WPS add-ins, side panels, IDE panels, chat-host widgets, generative UI)
evidence: digest
sources: [mcp-apps, openai-apps-sdk-ui, a2ui, fluent-2]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Embedded hosts

A web UI that lives inside another application's window or conversation. The host owns the chrome,
the theme, the user's attention and often the frame size; the guest surface earns its space by being
useful at the host's width and invisible as a frame.

This file owns the guest-surface rules, productivity-host panes, chat-host widgets (MCP Apps and the
ChatGPT plugins UI) and host-rendered generative UI (A2UI). Elsewhere:

- AI UX inside these surfaces (agent runs, approvals, tool-call states, attribution, labelling):
  [ai-experience](../disciplines/ai-experience.md).
- Mapping DESIGN.md roles onto host variables: [system](../process/system.md). Handoff package:
  [handoff](../process/handoff.md). Frames and units: [portable-mockups](../fundamentals/portable-mockups.md).
- Web platform rules and feature support (old WebViews lag): [web](web.md). Windows fonts and Fluent
  on Windows: [desktop](desktop.md).
- Build notes (MCP Apps SDK, Fluent UI React v9): [implement-design stacks](../../../implement-design/references/stacks.md).

## 1. Every guest surface

| Rule | What it means for the design |
| --- | --- |
| Follow the host's appearance | Match its light or dark chrome and its type. No saturated or dark header bar fighting the host UI; the brand shows in accents and content, not in a heavy frame. |
| Narrowest width first | Design the narrowest width the host allows, then widen; never horizontal scroll. |
| Separate origin and storage | The guest usually runs on a different origin from the product's web app, so settings chosen on the web (theme, density, language) do not carry over. Either fix the guest's appearance to the host, or sync through the backend; write down which. |
| One token source | The guest and the web app read one token source, and a test asserts that the guest's values match, so the two do not drift. |
| Host engine and fonts | An embedded Chromium or WebView whose version depends on the host and OS, and the user's OS fonts (on Windows: Microsoft YaHei UI for Simplified Chinese, SimSun in legacy setups). Check type, CJK rendering and every recent CSS feature against that engine. |
| Context-driven content | When the surface reacts to a selection (document text, a cell, a file, a chat turn), design the "nothing selected" state; insert and apply actions say what goes where; long operations never block the host document. |
| Never imitate the host | No fake host chrome, composer, permission prompt or system dialog inside the guest. The host marks the guest's boundary; the guest stays inside it. |
| Verification | The real host often cannot run on the design machine. Render in a harness page at the host's widths and themes, and list the real-host check as unverified. |

## 2. Productivity-host panes

| Host | Width | Appearance and system |
| --- | --- | --- |
| Office add-in task pane (Word, Excel, PowerPoint, Outlook) | narrow and user-resizable, roughly 320-480 px (practice; perishable: check the host's docs) | Fluent 2 web tokens (below); follow Office's light or dark theme |
| WPS add-in pane | same range; confirm in the host | mirror WPS's own chrome, not Office's; its engine and fonts differ, so verify in the harness |
| Browser extension side panel | set by the browser and the user; design the narrowest first | follow the browser's light or dark theme; the panel sits beside any website, so it carries no page-like header |
| IDE panel (webview) | a dockable panel, often very narrow or very wide | take colours from the editor theme the host exposes to the webview, never a fixed palette; check a dark, a light and a high-contrast editor theme |

Fluent 2 web in Office and M365 panes (Segoe UI; px size / line height): Caption 2 10 / 14, Caption 1
12 / 16, Body 1 14 / 20, Subtitle 2 16 / 22, Subtitle 1 20 / 26, Title 3 24 / 32; spacing on a 4 px
base. Where the Fluent site and the React v9 code tokens differ, the code is what ships: radius Large
6 px (site 8), Subtitle 1 20 / 28 (site 20 / 26), and a Body 2 16 / 22 that only the code has.

## 3. Chat-host widgets

What a widget is for, who draws it, its hosted states (streaming input, approval pending, cancelled,
teardown, text fallback) and its handoff additions: [ai-experience](../disciplines/ai-experience.md) §3.
This section owns the host rules: frames, sizes, variables, limits.

### MCP Apps (the standard)

MCP Apps (extension `io.modelcontextprotocol/ui`, stable since 2026-01-26) renders a tool's `ui://`
HTML resource in a sandboxed iframe. The community client matrix (read 2026-09-27) lists Claude
(web and desktop), VS Code GitHub Copilot, Microsoft 365 Copilot, ChatGPT, Cursor, Goose, Postman and
others. ChatGPT's UI runs on this bridge; its extra rules are in the next subsection.

| Design input | Rule |
| --- | --- |
| Display modes | `inline` (default, in the conversation flow), `fullscreen`, `pip` (floating). Design each mode you declare, and a sensible layout when the host grants a different mode than requested. In fullscreen drop the container's outer radius. |
| Container size | Each axis is fixed (fill it), flexible (content decides, up to a max) or unbounded. No host publishes default sizes; the spec's `{width: 400, maxHeight: 600}` is only an example. Draw at a narrow and a wide width and write both down as assumptions; the widget reports its height, so avoid internal scroll. |
| Border | `prefersBorder: true` = the host draws a border and background; `false` = none (the widget bleeds); omitted = host default, which varies. Choose, draw that version, and put it in the handoff. |
| Theme | The host may send up to 76 standard CSS variables: `--color-{background,text,border}-{primary,secondary,tertiary,inverse,ghost,info,danger,success,warning,disabled}`, `--color-ring-*` (7 roles), `--font-sans`, `--font-mono`, four weights, text sizes xs-lg, heading sizes xs-3xl, `--border-radius-{xs,sm,md,lg,xl,full}`, `--border-width-regular`, `--shadow-{hairline,sm,md,lg}`. Hosts send any subset, usually as `light-dark()`. Every variable the widget uses needs its own fallback value, and a partial set must not clash. |
| Spacing | Not themed ("layouts break when spacing varies"): spacing stays the widget's own. There is no shared component library. |
| Fonts | Host fonts arrive through the host context; otherwise use the variables' stack. Remote fonts, images and scripts load only from origins the widget declares in its CSP; the default blocks them, and nested frames and downloads are blocked. Design with system or host fonts and inline or declared assets. |
| Host context | `theme`, `locale`, `timeZone`, `platform` (web, desktop, mobile), `deviceCapabilities` (`touch`, `hover`), `safeAreaInsets`. Pad by the safe-area insets; hover-only affordances switch off on touch. Changes (theme toggle, mode change, resize) arrive live: the layout must re-flow, not reload. |
| States | The hosted-state list in [ai-experience](../disciplines/ai-experience.md) §3.2, drawn in each declared display mode. |
| Offscreen | Animation, video and polling pause when the widget scrolls out of view. |

### ChatGPT (plugins UI, formerly "Apps SDK")

On top of MCP Apps. These are review rules, not style advice.

| Mode | Use for | Limits |
| --- | --- | --- |
| Inline card | one action or decision, small structured data, a self-contained widget | at most two actions, at the bottom: one primary, one optional secondary; height grows to fit, up to the mobile display height; no tabs, deep navigation, multiple drill-ins or views; **no nested scrolling**; no duplicate of ChatGPT's inputs (no second composer) |
| Inline carousel | a set of comparable items | 3-8 items, each with an image or visual; a title, metadata of at most two lines (the page says 2 and 3; design for 2), an optional badge, at most one CTA per item; one hierarchy across cards |
| Fullscreen | rich multi-step work: a map with pins, an editing canvas, an interactive diagram, detailed browsing | ChatGPT's composer is always overlaid: keep the key content and actions clear of it and design for it; the host provides close |
| Picture-in-picture | parallel or live activity: a game, a quiz, live collaboration, video | sticks to the top on scroll; reacts to composer input; closes when the session ends; few controls; on mobile it may be presented fullscreen |

- Inline surfaces appear before the model's reply, under the host's app name and icon.
- **Colour**: system colours for text, icons and dividers. The brand accent appears only on primary
  buttons, logos, icons and badges, never overriding backgrounds or text colours. No custom gradients
  or patterns.
- **Type**: the platform system font, **no custom fonts, even in fullscreen**; bold, italic and
  highlight only inside content, never for structure; few sizes (body and body-small).
- **Layout and icons**: system spacing and corner radii; consistent padding, no edge-to-edge text.
  Icons are system icons or custom icons that are monochrome and outlined. **No logo in the widget**:
  the host already shows the app's logo and name above it. Images follow the host's enforced aspect
  ratios (not published).
- **Policy that shapes screens**: no advertisements; no subscription, upgrade or checkout prompts for
  digital goods (a widget may say a feature is not on the user's plan and link to an information
  page); commerce for physical goods, with checkout on the merchant's domain by default; content fit
  for ages 13-17; destructive or write actions need confirmation friction.
- Accessibility: WCAG AA contrast, alt text on every image, layouts that survive text resizing.

Reference values for ChatGPT mockups, from `@openai/apps-sdk-ui` (repo, 2026-05; the host's variables
win): text-md 16 / 24, text-sm 14 / 20, heading-md 20 / 26, heading-sm 18 / 26, heading-xs 16 / 24;
radii 2, 4, 6, 8, 10, 12, 16, 20, 24 px and full; spacing unit 4 px; control heights 22-48 px (md 32,
2xl 44); breakpoints 380, 576, 768, 1024, 1280, 1536 (mobile first); dark mode through `data-theme`.

Handoff additions for a hosted widget (display modes, variables with fallbacks, origins, resource URI
version): [ai-experience](../disciplines/ai-experience.md) §3.4; add the `prefersBorder` choice.

## 4. Host-rendered generative UI (A2UI)

Here the agent sends no HTML: it sends declarative JSON naming components from a catalogue the host
registered, and the host renders them with its own design system. When to choose it over an iframe
widget, and the catalogue spec the designer delivers (variants, composition, copy, validation,
partial and failure states, attribution): [ai-experience](../disciplines/ai-experience.md) §3.1 and §3.3.

Renderer facts that shape the drawing (v0.9.1, current production; v1.0 is a release candidate):

- The optional Basic catalogue has 18 components: Text, Image, Icon, Video, AudioPlayer, Row, Column,
  List, Card, Tabs, Modal, Divider, Button, TextField, CheckBox, ChoicePicker, Slider, DateTimeInput;
  Icon names come from a fixed set of 59 system icons. A catalogue that mirrors your design system
  replaces or extends it.
- Web renderers theme through CSS variables on `:where(:root)` (for example `--a2ui-color-primary`,
  `--a2ui-card-background`, `--a2ui-font-family-title`); dark mode follows `prefers-color-scheme` or the
  classes `a2ui-light` / `a2ui-dark`. Map the tokens there; the Basic components ignore the theme an
  agent sends, and v1.0 removes the agent-side theme.
- A surface renders nothing until its root arrives, then fills in progressively: its first frames are
  placeholders, so draw them in the host's style.

## 5. Verify

- Harness page at the host's widths (pane: its narrowest and widest; widget: the two assumed widths),
  light and dark host themes, and for widgets inline, fullscreen and pip.
- A render with no host variables (the fallback path) and with a partial set.
- Touch emulation with hover off; CJK text in the host's OS fonts.
- List as unverified whatever needs the real host: actual widths, the variables it sends, font
  fallback, caching.
