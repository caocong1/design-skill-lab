---
title: Anti-slop (designing past the default)
evidence: digest
sources: [anthropic-frontend-design-skill, anthropic-design-skills, impeccable, impeccable-slop-rules, taste-skill, ui-ux-pro-max, apple-hig-liquid-glass, harmonyos-design]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Anti-slop

Language models regress to the statistical mean of their training data and of their own recent
output. The result is rarely bad design; it is the same design, whatever the subject. That is the
test:

> Would this choice have appeared whatever the product was? If yes, it is a default, not a decision.

A default can still be the right answer, but only after the brief has challenged it. Novelty takes
the same test: an experimental layout on a tax form fails appropriateness as surely as a template
on a fashion label.

Contents: procedure · where defaults hide · dated tells · cures decay · mechanical help · when
convention is right.

## Procedure

For piece-sized and standard work. Deep work runs the full divergence engine in
[directions](../process/directions.md) (rut and opposite, own-world referents, seeded roll); these
steps are its small form.

1. **Ground in the subject.** Name the subject, the audience and the primary job; if the brief does
   not, propose them and confirm. Then write down, before any pixels: five nouns and materials from
   the subject's world; two vernacular artefacts (a ledger, a transit map, a seed packet, a
   dispatch board) and the colours and type they actually use; what competitors all do.
2. **Plan before pixels**: four to six named colours with hex values, the typefaces and their roles,
   the layout concept (one sentence plus an ASCII wireframe with its alignment), the motion
   personality, and the one memorable element. In deep work this is the direction card and the
   surface contract ([templates](../../templates/)).
3. **Interrogate the plan.** Ask the test of every line. Then imagine a similar brief for a
   different client: if you would land on the same plan, revise it and say what changed and why.
4. **Spend boldness in one place.** One memorable element, everything around it quiet and
   disciplined. Then remove one decoration.
5. **Name what the first render fell back on.** "Avoid a generic look" only swaps one default for
   another; naming concrete patterns works (Anthropic's guidance for current Claude models, 2026).
   Compare the first render with the tells below, name the default it landed on (or a new one),
   write it into decisions.md as spent for this project, and do not reuse it in the next pass.
6. **Strip test, when the render still reads as a template.** Hide the decorative layer (eyebrows,
   labels in a language the product is not read in, hairlines and frames, ordinal numbers, offset
   shadows) and capture again at the same size. If the content and the primary task read as well
   or better, that layer was chrome: leave it out. On a surface people come to for its content
   (media, reading, a gallery) the content is the largest thing in the first viewport. This is a
   diagnostic, not a style: whatever carries meaning or the one memorable idea stays.
7. **Hold the floor silently**: responsive, accessible, fast, real content, designed states.
   Distinctive work that fails the floor is worse than plain work that meets it.
8. **The brief's words win.** When the user asks for a familiar look, including any look listed
   below, deliver the best version of it.

## Where defaults hide

| Axis | The reflex | Ask instead |
| --- | --- | --- |
| Typeface | the same neutral sans on everything | what voice does this subject have? choose on a specimen board ([typography](typography.md)) |
| Colour | one fashionable accent on near-white or near-black | which colours belong to this subject's world, and which rung of the strategy ladder ([color](color.md))? |
| Theme | the component library's stock theme (shadcn neutral, Ant Design blue, Element Plus) | which tokens must change so the library stops showing? |
| Layout | centred hero, then rows of equal cards | what is the content's real shape: a list, a comparison, a story, a tool? |
| Shape | one large radius on everything | which shapes carry meaning; where should it be sharp? |
| Depth | the same soft grey shadow under every card | one depth technique, where elevation means something ([materials](materials.md)) |
| Imagery | abstract gradients, blobs, generic 3D | what would a photograph, a diagram or the real product prove? |
| Icons | emoji, or a mix of icon sets | one family matched to the type |
| Motion | fade-and-rise on every section, hover lift on every card | which single moment deserves choreography? |
| Structure | an eyebrow above every heading, 01 / 02 / 03 sections | does this label or number encode anything true? |
| Copy | "Build faster. Scale smarter." | what would only this product say? |
| Data | round numbers, "John Doe", lorem ipsum | realistic domain content with awkward lengths, labelled as sample data |

## Dated tells (perishable)

Tells shift as models and fashions shift. These record what read as generated at the date given;
re-verify before relying on them, and never treat them as bans.

**Observed through 2025**: purple-to-blue gradients on white or dark; glass panels and neon glow;
the same two or three sans-serifs; a centred hero over a mesh gradient with a glowing pill badge;
three equal feature cards with an icon each; emoji as icons; uniform large radii; a grey shadow
under everything; scroll-triggered fade-up on every block. Impeccable's era captions (2026-09) date
"beige backgrounds, editorial labels, decorative motion" to 2025: the start of the cream wave below.

**Observed in 2026:**

| Tell | Observed | Source |
| --- | --- | --- |
| Warm cream ground (near `#F4F1EA`, `#F5F1EA`), high-contrast serif display with italic accents, a terracotta, clay, brass or oxblood accent (near `#D97757`, `#B08947`), espresso text: Claude's own "tasteful" default, and the first palette a warm, bookish or child-facing subject produces | 2025 to 2026-09 | anthropic-frontend-design-skill, anthropic-design-skills, taste-skill, impeccable |
| Defaults Anthropic names for current Claude models: cream or off-white ground, italic accent words in headlines, 01 / 02 / 03 section labels, monospace labels, pill-shaped buttons | 2026-09 | anthropic-design-skills |
| Near-black with one acid-green or vermilion accent and glowing edges | 2026-06 | anthropic-frontend-design-skill |
| Broadsheet: hairline rules, zero radius, dense columns, italic display serif, tracked mono labels | 2026-06 | anthropic-frontend-design-skill, impeccable |
| The shadcn-default look: the stock neutral theme, `--radius: 0.5rem`, identical bordered cards with one soft `rgba(0,0,0,.1)` shadow, lucide icons, gradient washes | 2026-09 | anthropic-design-skills, anthropic-frontend-design-skill |
| Template chrome: a tracked all-caps eyebrow over every heading, middle-dot meta strings, "WORD — fragment" labels, tinted near-black (`#0B0B0B`, `#111`), mono for small data labels, an arrow on every link | 2026-09 | anthropic-frontend-design-skill |
| Bento everywhere: a tile grid as the container for any content, cell sizes that encode nothing, cells padded to fill the grid | 2026-05 | taste-skill |
| Glassmorphism misuse: frosted cards in the content layer, glass on glass, web imitations of Liquid Glass presented as the platform. Glass on the functional layer of iOS 26 or the 沉浸光感 material of HarmonyOS 6.1 is correct ([materials](materials.md)) | 2026-09 | impeccable-slop-rules, apple-hig-liquid-glass |
| Gradient text on headlines; a radial halo or soft spotlight behind content on dark; dark mode with glowing accents | 2026-09 | impeccable-slop-rules |
| Emoji as bullets or icons; a sparkle icon on every AI feature | 2026-09 | impeccable, ui-ux-pro-max |
| Generic 3D blobs, gradient orbs, placeholder illustrations built from circles and blocks, rough hand-drawn SVG mascots, a decorative grid-line background | 2026-09 | impeccable-slop-rules |
| Production-test chrome: a version label in the hero, photo credits as decoration, a locale or weather strip, a scroll cue, decorative status dots, a border on every list row, fake product screenshots built from divs | 2026-05 | taste-skill |
| GPT-style neobrutalism: bold borders, hard offset shadows, sticker badges | 2026-09 | impeccable-slop-rules |
| The hero-metric block (big number, small label, three stats, gradient accent); identical icon-title-text card grids; an icon tile above every heading; a pill badge above the hero headline; one accented word in a headline; cards nested in cards | 2026-09 | impeccable-slop-rules, anthropic-frontend-design-skill |
| Copy: em-dash overuse; "supercharge", "world-class", "enterprise-grade"; forced contrast ("Not a feature. A platform."); an aphorism closing every section | 2026-09 | impeccable-slop-rules |
| Motion: bounce or elastic easing on routine UI, a pulsing status dot, a marquee, images that zoom on hover | 2026-09 | impeccable-slop-rules |
| A dated iOS or macOS mockup: opaque full-width bars, glass in the content layer, every toolbar button tinted, all-caps list section headers | 2026-09 | apple-hig-liquid-glass |

**Overused faces, as dated lists**: Impeccable's engine (2026-09) flags Inter, Roboto, Open Sans,
Lato, Montserrat, Arial, Helvetica, Fraunces, Instrument Sans and Serif, Geist, Mona Sans, Plus
Jakarta Sans, Space Grotesk and Recoleta, and calls Playfair, Cormorant, Lora, Newsreader, Syne, IBM
Plex, DM Sans and Outfit training-data defaults for persuasive pages. Taste-skill (2026-05)
recommends Geist and Outfit. A brand face that fits stays; Operate and Read surfaces are well
served by system stacks.

**Domain defaults**: Chinese big-screen dashboards (deep blue, cyan glow, neon borders, a rotating
globe; [data-dense-ui](../disciplines/data-dense-ui.md)); enterprise admin in the untouched
component-library theme; AI products with sparkles and violet gradients; developer tools in dark
mode with one green accent and mono everywhere.

## Cures decay too

In November 2025 Anthropic's own guidance offered Space Grotesk-style "distinctive" fonts, editorial
serifs, atmospheric gradient backgrounds and a staggered page-load reveal as the way out of the
Inter-and-purple default, and already warned the model was converging on Space Grotesk. By
September 2026 its own skill lists fade-up on every section and cream, serif and terracotta as
tells, and Impeccable's Chinese catalogue names Space Grotesk as overused (its English page now
names only Inter and Geist). Each remedy had a shelf life of months.

So recommend a way of choosing, never a set: a font list, a palette or an effect offered as "not
generic" becomes the next default. The tasteful reaction to one wave became the next wave; avoiding
a list is not a design method, the test at the top is. Do not import absolute bans either: a total
em-dash ban breaks correct range typography and Chinese punctuation (——).

## Mechanical help

Part of this can be checked without judgement. Run a detector on the rendered page at step 8
(render + floor) and before any critique.

- `node "$S/lint.mjs" --help` (`S` = `skills/design-studio/scripts`) first. It checks the floor on a rendered page: counts of distinct
  colours, font sizes, radii and shadows; computed text contrast; overflow at 390 px; tap targets;
  missing alt text and labels; `transition: all`; reduced-motion handling.
- Optional: `npx impeccable detect <dir|file|url> --json` (Impeccable, Apache-2.0; 61 rules: 32 AI
  tells and 29 quality faults). Exit 0 = clean, 2 = findings, 1 = a target could not be scanned.
  Waive a finding inline with a reason: `impeccable-disable <rule>: <reason>`. Never install its
  editor hooks in a host project without the user's consent: they can download and run its engine
  outside tool approval.
- If the host already runs a detector, read its report before critiquing.

A clean report means the known mechanical tells and floor faults are absent at the sizes, themes
and states you captured. It does not mean the design fits its subject, that the hierarchy works,
that the one memorable idea exists, that the content is real, or that the result is distinct from
the category. Six patterns (hero metric, identical card grids, glass everywhere, extreme radius,
rough SVG, a single font for everything) need judgement, not a rule. A finding is a reason to look,
not a verdict: when the brief justifies it (numbers on a real sequence), keep it and write why.
Critique runs its fresh judgement before it reads detector output
([critique-design](../../../critique-design/SKILL.md)).

## When convention is the right answer

- Products used daily for work: familiarity is speed. Conventional structure, restrained
  expression, personality in type, colour discipline and copy.
- Regulated, public-sector, medical, financial and accessibility-critical contexts: trust and
  clarity outrank distinctiveness, and established systems are often expected.
- Inside an existing product or brand: consistency with the system is the design.
- Platform-native apps: the platform's conventions are the users' habits (Liquid Glass bars on iOS
  26 are convention there, not decoration).
- The user picks the category standard from an options board: that is a decision, not a default.
- In a redesign the board still shows structural directions; change cost decides the
  recommendation ([redesign](../process/redesign.md) §7), not the board.

In these contexts "slop" is not convention; it is carelessness: inconsistent spacing, undesigned
states, default themes nobody chose, placeholder copy.
