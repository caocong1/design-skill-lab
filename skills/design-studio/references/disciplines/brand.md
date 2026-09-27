---
title: Brand identity
evidence: practice
sources: [cjk-font-licensing, anthropic-design-skills, openai-apps-sdk-ui, mcp-apps]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Brand identity

A logo is the smallest part of an identity and the hardest to change. Decide what the brand must feel
like before drawing, draw in black first, and judge marks by whether they are appropriate, distinctive
and simple, not by whether they illustrate the product. Artefacts go to `.design/brand/`. Elsewhere:
app icons and favicons [app-icons](app-icons.md); options and the board
[directions](../process/directions.md); colour and type systems [color](../fundamentals/color.md),
[typography](../fundamentals/typography.md), [cjk-typography](../fundamentals/cjk-typography.md);
licences [licensing](../fundamentals/licensing.md).

| Request | Mode, effort | Sections |
| --- | --- | --- |
| a logo or a name lockup | `piece`, standard | 1 (short), 2 (on the sheet, no board), 3, 4, 5, 6 when bilingual |
| a new identity | `full`, deep | all; territories on an options board |
| extend an existing logo into a system | `piece`, standard | 7, 9 |
| brand guidelines | `handoff`, standard | 9 |
| rebrand, 品牌升级 | `redesign`, deep | 10 first, then 1-9 |

## 1. Strategy page

Write `.design/brand/strategy.md` on one page, even for "just a logo": a mark can only be judged
against it.

- **Who, for whom, against whom.** Capture the five closest competitors' marks into one line-up
  image ([research](../process/research.md)); the new mark has to stand apart in it.
- **Positioning**: the one thing to be known for.
- **Personality**: three to five attributes as "X, not Y".
- **Name facts**: length; letters with character (ascenders, repeats, a distinctive initial);
  pronunciation; scripts needed (Latin, Chinese, both); what the name sounds like or means in the
  other languages and dialects of the market.
- **Where it lives**: every touchpoint. The smallest and crudest one sets the simplicity bar: a
  16 px favicon, a 40 px round WeChat avatar, embroidery, a rubber stamp or 印章, a one-colour
  receipt printer.
- **The category rut**: what every competitor's mark does (the same blue, the same geometric sans,
  an abstract swoosh, an initial in a rounded square). Name it so the territories can leave it.

## 2. Territories

Three territories that are different ideas, not three drawings of one idea: the name's letterform; a
metaphor for the benefit; an abstract quality (precision, warmth, motion); a place or cultural
referent. Each is one sentence plus three or four thumbnails from the sheet (§3). At deep effort,
present them with the options protocol and board in [directions](../process/directions.md); at
standard they are the three columns of the sheet, with no board.

## 3. Marks: the thumbnail sheet

| Name and use | Mark |
| --- | --- |
| short, distinctive name | wordmark, perhaps with one signature letter |
| long name, or two scripts | symbol or monogram plus wordmark lockups |
| digital product | a symbol that works alone as app icon and avatar |
| institution, heritage | emblem, only with a simplified small version |

1. **Sketch wide.** Draw 12-20 black sketches across the three territories, at least four each, in
   one page `.design/brand/thumbnails.html`: square cells, one inline SVG per cell on a 100-unit
   viewBox, black on white, no colour, no effects. Vary the construction, not the decoration:
   letter-derived, negative space, geometric construct, cut or fold, monoline or solid, stamp-like.
2. **Draw what you can trust.** Compose from `circle`, `rect`, `polygon` and arcs on whole
   coordinates; cut shapes with `mask` or `clipPath` while sketching and flatten them later. A letter
   comes from real outlines (§5), never from guessed Bézier curves.
3. **Render the sheet twice**: cells at 24 px and at 200 px. Look at both.
4. **Cull with the fast tests.** Out if it disappears at 24 px, needs colour to work, could sit in a
   free icon set or a template's default glyph (circle in a hexagon, abstract swoosh, initial in a
   rounded square), or blurs into the competitor line-up. Keep three to five.
5. **Refine two.** Put each on a construction grid, then correct by eye: round and pointed forms
   overshoot flat ones slightly (about 1-3% of the height), horizontals are a little thinner than
   verticals, joins thin where strokes meet, counters balance, diagonals are adjusted until they look
   straight.
6. **Colour last**, once the form holds in black. Then the test sheet.
7. **Carry one.** Present both refined marks on the test sheet with a recommendation (from the §4
   results and the strategy page), and derive the lockups and the app icon from the recommended
   mark only; the user may swap. After a territories board, both come from the chosen territory.

## 4. Test sheet

Copy [brand-test-sheet](../../templates/brand-test-sheet.html) to `.design/brand/test-sheet.html`,
paste each finalist and the competitors, render it, and record pass or fail per test.

| Test | Pass |
| --- | --- |
| Small | recognisable as a 16 px favicon in a browser tab and a 24 px avatar |
| One colour | solid black on white, white on black (reversed), white on the brand colour |
| Knockout | holds over a real photograph or a busy background |
| Crop | survives the round avatar crop and the app-icon masks (safe zones in [app-icons](app-icons.md)) |
| Line-up | distinct beside the five closest competitors at equal height, in greyscale |
| Reproduction | stamp and embroidery: no gap or stroke thinner than about 2% of the mark's width (about 1 mm on a 50 mm mark); still reads with the roughened edge |
| Memory | describable in one sentence that someone could sketch from |
| Longevity | depends on no current effect (gradient-only, glass, 3D gloss) |

**Originality and trademark.** Search for look-alikes: reverse image search, logo archives, and the
trademark registers in the catalogue (`python3 "$S/catalog.py" find --section brand:naming-trademark`, with `S` = `skills/design-studio/scripts`:
中国商标网 for the mainland, WIPO Global Brand Database, USPTO, EUIPO). Then write in the deliverable
that a professional trademark clearance search, per market and per class, is required before
adoption. An agent cannot clear a mark.

## 5. Wordmarks and text as outlines

Wordmarks are drawn, not typed. Start from a typeface with the right voice and a licence that covers
logo use, convert it to outlines, space it pair by pair, change one or two letters for ownership (a
cut terminal, a joined pair, a distinctive counter), and check the rhythm at the smallest size.

**Licence first** (matrix in [cjk-typography](../fundamentals/cjk-typography.md)):

- OFL families (Source Han, Noto CJK, LXGW WenKai, Smiley Sans, most Google Fonts): logo use and
  modified outlines are fine.
- Vendor "免费商用" fonts (HarmonyOS Sans, MiSans, OPPO Sans, vivo Sans, HONOR Sans) name logos among
  the works you may distribute but forbid modifying the font; whether reshaping outlined letters in a
  logo counts is not addressed. For a mark you will modify, prefer an OFL face or drawn letters.
- FounderType 方正 and Hanyi 汉仪: logo use needs a paid licence (per logo, yearly or permanent).
  A "free" face named 迷你… or 经典… is likely a pirated commercial one.

**Never ship a logo as live `<text>`**: the font may be missing, substituted or not licensed for
embedding. Outline it:

```sh
# fontTools in a venv outside the project (Homebrew and distro Pythons refuse a bare pip install);
# uharfbuzz is optional: kerning, ligatures, contextual forms
python3 -m venv ~/.venvs/fonttools && ~/.venvs/fonttools/bin/pip install fonttools uharfbuzz
~/.venvs/fonttools/bin/python "$S/text_to_path.py" fonts/Face.otf "Wordmark" --size 200 \
  --var wght=640 --pairs "Wo:-20,rd:10" -o .design/brand/wordmark.svg
```

The script shapes the text with the font's kerning, writes one `<path data-char>` per glyph with
`fill="currentColor"` and a viewBox tight to the ink, and prints the font's licence field. Space the
wordmark by re-running with `--pairs` (extra space between two characters, in 1/1000 em) until the
rhythm is even, then edit individual letter paths for the signature details. Chinese wordmarks use
the same pipeline with an OFL CJK face, or characters drawn stroke by stroke; ownership comes from
stroke-level changes (a shared terminal, a simplified component) made consistently.

Outlines carry no hinting: check the wordmark at its minimum size and, below a threshold, supply a
small version with opened spacing and thickened thin strokes. SVG hygiene (no transforms, no ids,
no editor metadata) as in [icons](icons.md) §4; the viewBox is tight to the mark with no built-in
margin, and clear space is defined in the guidelines instead.

## 6. Bilingual lockups (CJK and Latin)

A Chinese and a Latin name set side by side at the same font size never match: Han characters fill
most of the em square while Latin capitals fill about 0.7 of it, and dense strokes make Han look
darker. Match them optically, then confirm by rendering.

- **Size by visible height.** Horizontal lockup: scale the Latin until its cap height (x-height for a
  lowercase wordmark) sits in the Han characters' visible band and looks equal in presence; render
  three ratios (for example Latin cap height at 70, 80 and 90% of the Han face) and choose by eye at
  small and large sizes. Stacked lockup: match the two line widths (tracking the shorter line, but
  never tracking Latin lowercase by more than about +10%) or share one left edge.
- **Match the grey.** Take the Latin one weight heavier than the Han, or the Han one lighter, and
  compare with blur until the two lines read as the same darkness.
- **Match the construction.** 黑体 with a grotesque sans, 宋体/明朝 with a serif of similar contrast
  (the Song triangle beside wedge serifs), 楷体 with a humanist or calligraphic face, 圆体 with a
  rounded sans. Match terminals and stroke contrast, not just the category label.
- **Align optically.** Horizontal: centre the Latin cap band on the Han face, not on the em box;
  a shared baseline usually makes the Latin look low. Stacked: centre or left-align as the symbol's
  axis dictates.
- **One clear-space unit** taken from something both scripts share (the symbol's stroke, or a
  fraction of the Han height), and a fixed gap between the scripts.
- **Minimum size is set by the Chinese**: complex characters close up first (traditional characters
  sooner). State a minimum per lockup; below it, use the symbol or one script.
- Deliver the combinations the market needs (Chinese first, Latin first, horizontal, stacked), each
  with its minimum size. Text setting in running copy: [cjk-typography](../fundamentals/cjk-typography.md).

## 7. The system

- **Lockups**: horizontal, stacked, symbol only, wordmark only; each in full colour, one colour and
  reversed. Clear space as a unit from the mark (often a letter height). Minimum sizes per lockup,
  in px and mm.
- **Colour**: one or two colours with character, neutrals tinted toward them, functional colours.
  Hex and OKLCH for screens; CMYK and spot values marked "to proof with the printer". Contrast for
  every text use is computed ([color](../fundamentals/color.md)); UI ramps come from the system step
  ([system](../process/system.md)).
- **Type**: a primary family with its fallback stack, an optional secondary, the CJK companion,
  each with licence and source.
- **Graphic language**: the device derived from the mark (a shape, a grid, a cut, a line quality),
  with rules for using and not overusing it; patterns; illustration and photography direction; the
  icon family ([icons](icons.md)).
- **Motion**: the logo animation with its still fallback, and the product's motion personality
  ([motion](motion.md)). Sound only if the brand has sonic cues.
- **Voice**: a few principles, each with "we say / we do not say" examples.
- **Hosted surfaces**: inside chat hosts the host shows the app's logo and name. In Apps SDK widgets
  there is no logo in the widget, no custom font, and brand colour only on primary buttons and
  badges; MCP Apps hosts pass their own theme variables. The brand's presence there is colour
  accents and voice ([embedded-hosts](../platforms/embedded-hosts.md)).
- **Applications**, rendered, never described: app icon on a home screen, site header, social avatar
  and banner, OG image, slide, business card, one product screen; merchandise or signage if relevant.

## 8. Generative and flexible identities

A mark that is a function of data, time, place or a seed is where code is stronger than a designer's
hand tools.

- **Fixed core, variable part.** Write down what never changes (silhouette, a letter, a grid) and the
  parameters that vary, as quantities with ranges (count, scale, angle, probability).
- **Seeded and reproducible**: the same seed always gives the same mark. Record the seed of every
  published instance.
- **Test the range, not one output**: render 24-48 seeds including the parameter extremes on one sheet,
  run the tests of §4, and narrow the ranges until every output passes.
- **Ship two things**: a generator (one HTML page with a seed field and parameter controls that
  exports SVG) and a fixed canonical version for the favicon, app icon, legal documents and
  embroidery.

## 9. Guidelines

Write them from [brand-guidelines](../../templates/brand-guidelines.md): a one-page quick start
first, every rule checkable, every asset downloadable. Rules without files are decoration.

## 10. Rebrand

The general change-cost and equity method is in [redesign](../process/redesign.md). For a brand:

1. **Equity audit**: what do people actually recognise? A colour, a shape, a letterform, the name, a
   sound. Evidence over opinion: recognition with parts hidden, usage data, surveys.
2. **Diagnose**: what is failing (small-size legibility, dated styling, inconsistency, a changed
   strategy)? Without a strategic reason it is a redraw, not a rebrand.
3. **Decide the distance**: refresh (tidy, everything recognisable), evolution (keep one or two
   equity assets, change the rest), revolution (new strategy, new identity). Show before and after
   with the reasons.
4. **Plan the rollout**: asset inventory, priority touchpoints, transition period, communication.
   Identity changes are product changes.

Anti-patterns: a literal picture of the product as the logo (a cloud for cloud software); marks that
need a gradient or fail in one colour; a stock-icon symbol beside a default-font name; hairlines that
vanish at favicon size; the category's cliché; typing the name and calling it a wordmark; logos
floating in space instead of in applications; forty pages of guidelines with no downloadable assets.
