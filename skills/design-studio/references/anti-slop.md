# Anti-Slop: Designing Past the Default

Language models regress to the statistical mean of their training data and of
their own recent output. The result is not bad design; it is **the same
design, regardless of subject**. That is the test:

> Would this choice have appeared whatever the product was? If yes, it is a
> default, not a decision.

A default can still be the right answer - but only after it has been
challenged from the brief. And novelty is judged by the same test: an
experimental layout on a tax form is as much a failure of appropriateness as a
template on a fashion brand.

## The Procedure

1. **Ground in the subject.** Distinctive choices come from the subject's
   world: its materials, vernacular, history, competitors, audience habits. A
   freight-logistics console and a children's reading app should share almost
   nothing.
2. **Write the plan before the pixels**: 4-6 named colours, the typefaces and
   their roles, a layout concept (a sentence and a rough wireframe), the
   motion personality, the one memorable element.
3. **Interrogate the plan.** For each line ask the test question above. Also
   imagine a similar brief for a different client: if the plan would be the
   same, revise it and say what changed and why.
4. **Spend boldness in one place.** One memorable element; everything around
   it quiet and disciplined. Then remove one decoration.
5. **Hold the quality floor silently**: responsive, accessible, fast, real
   content, designed states. Distinctive work that fails the floor is worse
   than plain work that meets it.
6. **Follow the brief when it asks for a familiar look.** If the user wants
   the conventional thing, deliver the best version of it.

## Where Defaults Hide

| Axis | The reflex | Ask instead |
| --- | --- | --- |
| Typeface | the same neutral sans on everything | what voice does this subject have? serif, grotesque, mono, humanist, display? |
| Colour | one fashionable accent on near-white or near-black | what colours belong to this subject's world? what stance (see `color.md`)? |
| Layout | centred hero, then rows of equal cards | what is the content's real shape? a list, a comparison, a story, a tool? |
| Shape | one large radius on everything | which shapes carry meaning here; where should it be sharp? |
| Depth | the same soft grey shadow under every card | one depth technique, used where elevation means something |
| Imagery | abstract gradients, blobs, generic 3D | what would a photograph, diagram or real product view prove? |
| Icons | emoji, or a random mix of icon sets | one family matched to the type |
| Motion | fade-and-rise on every section, hover lift on every card | which single moment deserves choreography? |
| Structure | eyebrow label above every heading, numbered 01 / 02 / 03 sections | does this label or number encode anything true? |
| Copy | "Build faster. Scale smarter." | what would only this product say? |
| Data | plausible round numbers, "John Doe", lorem ipsum | realistic domain content with awkward lengths |

## Dated Observations (perishable)

Tells shift as models and fashions shift. These lists record what read as
"generated" at the time; re-verify before relying on them.

**Observed through 2025**: purple-to-blue gradients on white or dark; the same
two or three sans-serifs; centred hero over a mesh gradient with a glowing
pill badge; three equal feature cards with an icon each; glassmorphism
applied everywhere; emoji as icons; uniform large radii; a grey shadow under
everything; scroll-triggered fade-up on every block.

**Observed by mid-2026** (from Anthropic's own front-end skill, see
`source-map.md`): warm cream background with a high-contrast serif and a
terracotta accent; near-black with a single acid-green or vermilion accent;
"broadsheet" layouts with hairline rules and zero radius; the SaaS card kit
(identical rounded cards, one radius, one soft shadow, gradient washes); and
template chrome - tracked-out all-caps eyebrows, meta strings joined by middle
dots, labels built as "WORD - fragment", tinted near-black standing in for
black, monospace for small data labels, an arrow appended to every link.

**Flagged by a deterministic detector in 2026** (Impeccable's rule catalogue,
see `source-map.md`): a thick coloured bar on one side of a card; a thick
accent border on a rounded element; a hairline border stacked with a wide soft
shadow; small cards rounded to 24 px and beyond; an icon in a rounded tile
above every heading; an oversized italic-serif hero headline; a whole sentence
set at display size; the hero "metrics" block (big number, small label, three
supporting stats, a gradient accent); identical icon-title-text card grids;
cards nested in cards; one spacing value everywhere; gradient text; grey text
on coloured backgrounds; coloured glow shadows on dark; bounce or elastic
easing on ordinary UI; images that zoom or rotate on hover; hand-drawn SVG
mascots; and in copy - em-dash overuse, marketing filler ("streamline",
"empower", "supercharge"), and an aphorism closing every section. Its list of
worn-out typefaces names Inter, Geist, Space Grotesk and Instrument Serif.

**Cures decay too.** In November 2025 Anthropic's own guidance recommended
Space Grotesk-style "distinctive" fonts, editorial serifs, atmospheric
gradient backgrounds and a staggered page-load reveal as the way out of the
Inter-and-purple default, and already warned that the model was converging on
Space Grotesk. Within a year each of those remedies appears on a detector's
list. Any specific font, palette or effect recommended as "not generic" has a
shelf life of months. Recommend a **way of choosing**, never a fixed answer.

**Domain-specific defaults**: Chinese big-screen dashboards - deep blue,
cyan glow, neon borders, a rotating globe; enterprise admin - the untouched
component-library theme; AI products - sparkle icons and violet gradients;
developer tools - dark mode with one green accent and mono everything.

Note what the lists show in sequence: the "tasteful" reaction to one wave
became the next default. Avoiding a list is not a design method. The test at
the top of this file is.

## Mechanical Help

Part of this can be checked without judgement. Deterministic detectors exist
for many of the tells above and for plain quality faults (contrast, line
length, tight line-height, tiny body text, skipped heading levels, layout
properties being animated, clipped overlays); see
`resources/code.md` > AI design skills. If the host project already runs one,
read its report before a critique. A clean report means the known tells are
absent - it does not mean the design fits its subject.

## When Convention Is the Right Answer

- Products used daily for work: familiarity is speed. Conventional structure,
  restrained expression, personality in type, colour discipline and copy.
- Regulated, public-sector, medical, financial and accessibility-critical
  contexts: trust and clarity outrank distinctiveness; established systems are
  often expected.
- Inside an existing product or brand: consistency with the system is the
  design.
- Platform-native apps: the platform's conventions are the users' habits.

In these contexts "slop" is not convention - it is carelessness: inconsistent
spacing, undesigned states, default themes nobody chose, placeholder copy.
