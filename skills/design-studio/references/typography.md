# Typography

Type is most of the interface. Decide it first; most "looks off" problems are
type problems: too many sizes, weak contrast between levels, lines too long,
leading that ignores size. Sources and tools:
`resources/type.md`. Evidence: `source-map.md`.

## Choosing Typefaces

- One family, or two that are clearly different (a display face with a voice
  and a quiet text face). A third is almost always a mono for code or data.
- Choose for the subject and audience, not by reflex. The reflex choices (the
  same two or three neutral sans-serifs) are excellent fonts and the reason
  generated work looks alike; use them when neutrality is the brief.
- Check before committing: licence for this use, the weights and italics you
  need, language coverage (Latin extended, CJK, Cyrillic), numerals (tabular,
  lining), variable axes, file size, and how it renders at body size on a
  low-density Windows display.
- Pair by contrast with a shared proportion: similar x-height, different
  structure. Two similar sans-serifs is a mistake, not a pairing.
- See it in use before choosing (`resources/type.md` > Type in use).

## Body Text Numbers

| Property | Latin | Chinese (CJK) |
| --- | --- | --- |
| Size | web 16-18 px (long-form 18-21); mobile 16-17; never below 12 for anything | web 15-17 px; mobile 15-17; captions 12-13 |
| Line height | 1.4-1.6 (the classic range is 120-145% of size) | 1.6-1.8; dense UI 1.5 |
| Measure | 45-75 characters, about 66 ideal; up to 90 tolerable | 25-40 characters per line |
| Letter spacing | 0 for body | 0; small text may take 0.02-0.05em |
| Paragraph spacing | 0.5-1 line, or a first-line indent - never both | one line; first-line indent of 2em in literary text |

Set the measure with `max-width` in `ch` (Latin) or `em` (CJK: 1em is one
character), including inside wide containers.

## Scale and Hierarchy

- Six to eight sizes from a ratio: about 1.125-1.2 for dense product UI, 1.25
  for general use, 1.333-1.5 for marketing and editorial. Display sizes may
  leave the scale.
- As size goes up, line height and letter spacing go down (display 1.0-1.2,
  tracking -0.01 to -0.03em). As size goes down, both go up. All-caps and small
  caps take +5-12% tracking and are for less than a line.
- Build hierarchy from size **and** weight **and** colour (three text colours:
  primary, secondary, tertiary). Neighbouring levels must differ clearly -
  at least about 1.25x in size unless weight or colour carries the step: a
  15/16 px distinction is noise.
- Two or three weights. Avoid weights under 400 for body on low-density
  screens. Do not combine bold and italic. Underline means link.
- Define text **styles** (display, title, heading, body, label, caption, code)
  with size, line height, weight, tracking and features together.
- Fluid type: interpolate between a small-viewport and a large-viewport scale
  with `clamp()` rather than jumping at breakpoints
  (`resources/type.md` > Utopia).

## Details That Read as Craft

- `font-variant-numeric: tabular-nums` wherever numbers are compared or
  change in place (tables, timers, prices, counters).
- Real punctuation: curly quotes and apostrophes, en and em dashes, the
  ellipsis character, multiplication sign, non-breaking space between a number
  and its unit and inside names and shortcuts.
- `text-wrap: balance` for headings, `text-wrap: pretty` for body where
  supported; otherwise fix widows in headings by hand.
- Left-align body text. Centre only short, isolated lines. Justify only with
  hyphenation and a generous measure.
- Icons beside text sit on the text's optical centre and carry slightly less
  contrast than the text, because icons look heavier.
- Headings belong to what follows: more space above than below.
- Do not scale text nodes in animations (anti-aliasing shifts); animate a
  wrapper.

## Loading and Performance

- Two families at most on the web; subset; preload the critical file;
  `font-display: swap` or `optional`; self-host (no third-party hot-linking).
- Prevent layout shift: give the fallback font matching metrics
  (`size-adjust`, `ascent-override`; generators in `resources/type.md`).
- A system font stack is a legitimate design choice for product UI: zero
  cost, native feel (`resources/type.md` > Modern Font Stacks).
- Mobile `<input>` text is at least 16 px, or iOS zooms the page on focus.

## System Font Stacks by Voice

When web fonts are off the table - offline tools, strict performance budgets,
or networks where font CDNs are blocked or unreliable (common in mainland
China) - system stacks still give real typographic range. List the most
characterful face first and end with a generic family. Exact faces differ per
OS, so check the rendering on each platform the audience uses.

| Voice | Latin stack | Chinese companion |
| --- | --- | --- |
| Neutral grotesque | `"Helvetica Neue", "Arial Nova", Arial` | `"PingFang SC", "Microsoft YaHei"` |
| Native UI | `system-ui, -apple-system, "Segoe UI", Roboto` | `"PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei"` |
| Humanist | `Optima, "Avenir Next", Seravek, Candara, "Gill Sans Nova"` | `"PingFang SC", "Hiragino Sans GB"` |
| Industrial / condensed | `"DIN Alternate", Bahnschrift, "Avenir Next Condensed", "Roboto Condensed", "Arial Narrow"` | `"PingFang SC", "Microsoft YaHei"` |
| Old-style serif | `"Iowan Old Style", "Palatino Linotype", Palatino, Georgia` | `"Songti SC", STSong, "Noto Serif CJK SC", SimSun` |
| Transitional serif | `Charter, "Bitstream Charter", "Sitka Text", Cambria` | `"Songti SC", SimSun` |
| Didone display | `Didot, "Bodoni 72", "Bodoni MT"` | `"Songti SC"` (bold) |
| Slab / typewriter | `"American Typewriter", Rockwell, "Courier New"` | `STFangsong, FangSong, "Songti SC"` |
| Monospace | `ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas` | `"Sarasa Mono SC", "PingFang SC"` |
| Rounded | `ui-rounded, "SF Pro Rounded", "Hiragino Maru Gothic ProN", "Arial Rounded MT Bold"` | `"Yuanti SC", YouYuan` |
| Handwritten / brush | avoid relying on it: coverage is inconsistent | `"Kaiti SC", STKaiti, KaiTi` |

A system stack is a choice with a voice, not a fallback - and it costs nothing
to load.

## Chinese and Mixed-Script Text

- **Fonts and licences**: use open-licence faces (Source Han / Noto CJK,
  Alibaba PuHuiTi, HarmonyOS Sans, MiSans, LXGW WenKai, Smiley Sans for
  display) or the system stack. Commercial Chinese foundries enforce
  licences actively; a font "found online" is a legal risk. Check the
  licence directory in `resources/type.md` > Chinese type.
- **Stack order**: Latin face first, then CJK, then generic, so Latin glyphs
  come from the Latin font:
  `"<Latin face>", "PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`.
  On HarmonyOS prefer HarmonyOS Sans; in WeChat mini-programs follow the
  system font.
- **Web fonts**: a full Chinese font is megabytes. Use the system stack, or
  slice the font into unicode-range chunks (cn-font-split) so only used
  ranges load. Subset display faces to the characters in the headline.
- **Weight**: CJK strokes are dense; 400-500 for body, 600 for emphasis.
  Avoid faux bold and avoid italics - Chinese has no italic; emphasise with
  weight, colour or emphasis dots.
- **Line breaking**: apply at least the basic prohibition rules - closing
  punctuation never starts a line, opening punctuation never ends one; dashes
  (⸺ / ——) and ellipses (……) are never split. Browsers do most of this;
  check custom text-measuring or truncation code.
- **Punctuation**: full-width punctuation inside Chinese sentences; half-width
  digits; adjacent full-width marks should be squeezed
  (`text-spacing-trim` where supported, a typesetting library otherwise).
- **CJK-Latin spacing**: the typographic norm is a gap of about a quarter em,
  ideally added by the renderer (`text-autospace` where supported). In source
  copy, pick one convention for the whole product - with spaces (the
  copywriting-guideline convention) or without (common in large Chinese
  consumer products) - and lint for it. Never mix.
- **Alignment**: justified text works better in Chinese than in Latin because
  every character is one em, but mixed-script lines still need care.
- **Truncation**: truncate by characters with an ellipsis; budget widths for
  the longest language shipped, not for Chinese (it is usually the shortest).
- **Numbers and dates**: 2026-09-20 or 2026年9月20日, 24-hour time, 万 / 亿
  units for large numbers, ¥ before the amount, thousands separators as the
  product's locale dictates.

## Verify

Render real content at real sizes. Check the longest heading, the longest
label, a 200% zoom, a Windows low-density screenshot if the audience is on
Windows, and - in every screenshot - that the intended font actually loaded.
