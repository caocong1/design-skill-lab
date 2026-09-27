---
title: Typography (Latin and general)
evidence: digest
sources: [practical-typography-key-rules, hobday-visual-design-rules, impeccable, impeccable-slop-rules, anthropic-frontend-design-skill, taste-skill, apple-hig-liquid-glass, web-baseline-2026, wcag-22, cjk-font-licensing]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Typography

Decide type first. Most "looks off" problems are type problems: too many sizes, weak steps between
levels, long lines, leading that ignores size. This file covers Latin and script-neutral rules.
Chinese, Japanese and Korean text (CJK stacks, line breaking, punctuation, mixed-script spacing, CJK
font licences) is in [cjk-typography](cjk-typography.md).

Contents: choose by looking · pairing · body text · scale and hierarchy · craft details · variable
fonts · loading · system stacks by voice · native targets · verify.

## Choose by looking, not by recall

Agents pick fonts by name recall, and recall is where every generated page converges. Choose on a
rendered specimen board.

1. Shortlist 5-8 candidates across at least three structures (grotesque, humanist, geometric,
   serif, slab, mono, display), drawn from the voice the brief implies, the host's licensed fonts
   and the catalogue: `python3 "$S/catalog.py" find <voice or genre> --domain type` (`S` = `skills/design-studio/scripts`).
   `catalog.py show fonts-in-use` points to faces set in real work.
2. Filter before rendering: licence for this use (web, app, logo, PDF; [licensing](licensing.md)),
   the weights and italics you need, coverage (Latin Extended, Vietnamese, Cyrillic, Greek, and the
   CJK companion if any), numerals (tabular, lining, old-style), variable axes, file size.
3. Render the board with the brief's real copy at the target's real sizes, light and dark if the
   product has both. A face that lacks a weight shows up here as body text set in the wrong or a
   faked weight: that is a finding, not a rendering glitch. For a Windows audience also look at a
   100 %-scale Windows render: thin strokes and weak hinting show there first.
4. Pick by looking. Write the reason in decisions.md in terms of the brief ("squared terminals echo
   the stencilled crate labels"), not the font's reputation.

```html
<!-- Specimen board: one column per candidate, the brief's real copy, the target's sizes.
     Copy the structure, not the values. Render it and look before choosing. -->
<style>
  body { margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(340px, 100%), 1fr)); }
  section { padding: 24px; border: 1px solid #0002; }
  .meta { font: 12px/1.4 ui-monospace, Menlo, Consolas, monospace; opacity: .7; }
  h1 { font-size: 40px; line-height: 1.1; margin: 12px 0; }
  p { font-size: 16px; line-height: 1.5; max-width: 66ch; }
  .ui { font-size: 14px; }  .num { font-variant-numeric: tabular-nums; }
</style>
<section style="font-family: 'Candidate A', sans-serif">
  <div class="meta">Candidate A · licence · weights used · WOFF2 size</div>
  <h1>{the real headline}</h1>
  <p>{a real paragraph from the brief}</p>
  <p class="ui">{real button labels, a table header, an error message}</p>
  <p class="num">1,234.50 · 0123456789 · 2026-09-27 14:05</p>
</section>
<!-- repeat the section for each candidate -->
```

"Overused" font lists are dated observations, not bans ([anti-slop](anti-slop.md)): in 2026 one
popular skill recommends Geist and Outfit while another flags both. A neutral grotesque or the
system stack is right when neutrality is the brief (daily-use tools, Operate and Read surfaces). It
is wrong only when nobody chose it.

## Pairing by voice

- One family, or two that clearly differ: a display face with a voice and a quiet text face. A
  third is a mono for code or tabular data, nothing else. On the web, two families at most.
- Pair by contrast of construction with a shared proportion: similar x-height and width, different
  structure (a serif display over a grotesque text; a condensed grotesque over a humanist). Two
  similar sans-serifs are a mistake, not a pairing.
- Before adding a family, try size, weight, width and spacing inside the one you have.

## Body text (Latin)

| Property | Default | Range and limits |
| --- | --- | --- |
| Size | 16 px web, 17 pt iOS body | 15-25 px on the web; long-form 18-21; nothing read below 12 px (11 pt/px only for captions a platform allows); mobile inputs at least 16 px or iOS zooms on focus |
| Line height | 1.45-1.5 | body range 1.2-1.45 (Butterick: 120-145 % of the size); screen body sits at the top of it or just above (impeccable starts around 1.5). Under 1.3 on running text is a finding (impeccable flags it); serif takes slightly more than sans |
| Measure | 60-70 characters | 45-75, up to 90 in long-form; set `max-width` in `ch`, also inside wide containers; over 80 is a finding (impeccable flags it) |
| Tracking | 0 | body tracking beyond +0.05em is a finding; small labels may take +0.01-0.02em |
| Paragraphs | 0.5-1 line of space | or a first-line indent of 1-4× the size, never both |

## Scale and hierarchy

- Six to eight sizes from one ratio: 1.125-1.2 for dense product UI, 1.25 general, 1.333-1.5 for
  marketing and editorial. Display sizes may leave the scale; past about 6rem the headline is the
  design and must be treated as such.
- Neighbouring levels differ by at least 1.25× in size unless weight or colour carries the step.
  15 vs 16 px is noise, and three roles inside 1.25× read as one flat level.
- As size goes up, leading and tracking go down: display leading 1.0-1.2, tracking -0.01 to -0.03em,
  floor -0.04em. As size goes down, both go up. All caps and small caps take +5-12 % tracking, stay
  under one line, and switch on case-sensitive forms (`font-feature-settings: "case"`).
- iOS exception: the system tracks SF Pro per size. It is negative from 13 to 23 pt (-0.43 pt at
  17) and positive from 24 pt up (+0.07 at 24, +0.38 at 28, +0.40 at 34). Never add web-style
  negative tracking to an iOS large title; mockups copy the table from the platform file.
- Hierarchy comes from size and weight and colour together. Two or three text colours (text,
  text-muted, a faint role only if it passes contrast); two or three weights; nothing under 400 for
  body on low-density screens (Apple: avoid Ultralight, Thin and Light). Never bold and italic
  together. Underline means link.
- Define text styles (display, title, heading, body, label, caption, code), each with size, line
  height, weight, tracking and features together, as tokens ([system](../process/system.md)).
- Fluid type is for marketing and editorial: interpolate between a small- and a large-viewport
  scale with `clamp()` and always keep a rem term, e.g. `clamp(2rem, 1.2rem + 3vw, 4.5rem)`. A pure
  `vw` size does not grow with browser zoom and fails WCAG resize text. Product UI keeps fixed sizes.

## Craft details

A checklist for the `typeset` operator and for the critic.

- `font-variant-numeric: tabular-nums` wherever numbers are compared or change in place (tables,
  timers, prices, counters); `slashed-zero` in codes and IDs; lining figures in UI, old-style only in
  running text that wants them.
- Real punctuation: curly quotes and apostrophes (straight only for foot and inch marks), en dash for
  ranges, em dash sparingly, the `…` character, `×`, and a non-breaking space between a number and
  its unit and inside names and shortcuts.
- `text-wrap: balance` on headings. `text-wrap: pretty` on body is an enhancement: check the last
  line of key paragraphs by eye. Status of both: [web](../platforms/web.md) §4.
- Left-align body. Centre only short, isolated lines. Justify only with `hyphens: auto`, a correct
  `lang` attribute and a generous measure.
- Icons beside text sit on the text's optical centre and one step lower in contrast, because icons
  look heavier than letters.
- Optical centring in buttons, badges and tags: `text-box: trim-both cap alphabetic` removes the
  half-leading so padding measures from cap height to baseline. Check the render in Firefox (edge
  value status: [web](../platforms/web.md) §4) and keep padding that also works untrimmed, or
  metric margins (Capsize).
- `hanging-punctuation: first` hangs a pull quote's opening mark outside the text edge (Safari only;
  elsewhere a small negative `text-indent`).
- Never scale text nodes in an animation (hinting and anti-aliasing jump); animate a wrapper.
- `font-synthesis: none` when a weight or style is not shipped, so the browser does not fake it.

## Variable fonts

- Use a variable font when you need three or more weights or styles of a family, or an axis statics
  cannot give (optical size, width, grade). For one or two weights, static files are smaller.
- Drive registered axes through the high-level properties: `font-weight` (wght), `font-stretch`
  (wdth), `font-style` (ital, slnt), `font-optical-sizing: auto` (opsz, on by default). Declare the
  ranges in `@font-face` (`font-weight: 100 900;`) or the browser clamps to the default instance.
- Keep `font-variation-settings` for custom axes such as GRAD. Trap: it is a single property, so
  setting it for a hover state resets every axis set elsewhere; route each axis through a custom
  property and compose them in one declaration.
- Grade changes stroke weight without changing width: use it for hover, active and dark-mode
  compensation. Animating `wght` reflows the line unless the face is uniwidth.
- Hand over axis values per text style (`wght 460, opsz auto`), not only named weights: 460 exists
  only in the variable file.

## Loading (web)

- Self-host WOFF2; no third-party hot-linking (privacy, and font CDNs are blocked or slow on some
  networks, mainland China among them). Subset to the scripts and glyphs used. Under the OFL a
  subset is a modified version, so a family with a Reserved Font Name needs a new name inside the
  file; a plain WOFF2 re-wrap with unchanged data and metadata is not ([licensing](licensing.md)).
- Preload only the one or two files the first viewport needs:
  `<link rel="preload" href="/fonts/text.woff2" as="font" type="font/woff2" crossorigin>`. Without
  `crossorigin` the file downloads twice, even from the same origin.
- `font-display: swap` for brand text faces with a metric-matched fallback; `optional` where a
  layout shift costs more than the brand face (dashboards, repeat visits); never `block` for body.
- Match the fallback's metrics so the swap does not move the layout:

  ```css
  @font-face {
    font-family: "Brand Fallback"; src: local("Arial");
    size-adjust: 104%; ascent-override: 92%; descent-override: 24%; line-gap-override: 0%;
  }
  body { font-family: "Brand", "Brand Fallback", sans-serif; }
  ```

  The numbers are placeholders: compute them for your pair (`catalog.py show
  fallback-font-generator`, Capsize, or the framework's font loader). `font-size-adjust`
  matches x-height across a mixed fallback chain.
- A system stack costs nothing and is a legitimate design choice for product UI (next section).
  When a hosted face is added, put it first and keep the stack behind it, so an unreachable CDN
  renders the previous design instead of browser defaults.

## System font stacks by voice

When web fonts are off the table (offline tools, strict performance budgets, blocked CDNs), system
stacks still give real range. List the most characterful face first and end with a generic family.
Faces differ per OS, so render on each platform the audience uses. The CJK companion for each voice
is in [cjk-typography](cjk-typography.md).

| Voice | Latin stack |
| --- | --- |
| Neutral grotesque | `"Helvetica Neue", "Arial Nova", Arial, sans-serif` |
| Native UI | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` |
| Humanist | `Optima, "Avenir Next", Seravek, Candara, "Gill Sans Nova", sans-serif` |
| Industrial / condensed | `"DIN Alternate", Bahnschrift, "Avenir Next Condensed", "Roboto Condensed", "Arial Narrow", sans-serif` |
| Old-style serif | `"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif` |
| Transitional serif | `Charter, "Bitstream Charter", "Sitka Text", Cambria, serif` |
| Didone display | `Didot, "Bodoni 72", "Bodoni MT", serif` |
| Slab / typewriter | `"American Typewriter", Rockwell, "Courier New", serif` |
| Monospace | `ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace` |
| Rounded | `ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", sans-serif` |
| Handwritten | avoid relying on one: coverage across systems is inconsistent |

Two traps, measured in Chromium on macOS on 2026-09-27:

- `ui-monospace`, `ui-rounded`, `ui-serif` and `ui-sans-serif` work in Safari only, and "SF Mono"
  and "SF Pro Rounded" are not reachable by name. Chromium skips all of them, so the next named
  face decides: the mono stack renders Menlo, the rounded stack Arial Rounded MT Bold.
- "DIN Alternate" and "Arial Rounded MT Bold" ship in Bold only, so body text at 400 renders bold.
  Use the industrial and rounded stacks for headings and figures; set body in a stack with real
  weights.

## Native targets

On iOS, Android, HarmonyOS, Windows and mini-programs, start from the platform's text styles and the
user's text-size setting (Dynamic Type, font scale, 适老化 steps) instead of a parallel scale; the
numbers are in the target's [platform file](../platforms/README.md). A brand face usually takes a
few display roles while running UI text stays the system face, unless the brand licenses and ships
an app font. Mockups render with the fonts of the machine that draws them:
[portable-mockups](portable-mockups.md).

## Verify

Render real content at real sizes, then check:

- the longest heading and label, a nine-digit number, a name that does not fit;
- 200 % zoom and the WCAG text-spacing override without clipping ([accessibility](accessibility.md));
- a Windows 100 % render when the audience is on Windows;
- in every screenshot, that the intended face actually loaded. Run
  `[...document.fonts].map(f => f.family + ' ' + f.status)` and expect `loaded` for every web face.
  Do not use `document.fonts.check()`: it returns `true` for a family that was never declared
  (measured in Chromium, 2026-09-27). System and local faces are not in that list; confirm them in
  the browser's rendered-fonts panel. A fallback that looks close is still a failure to report.
