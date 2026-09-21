# Colour

A palette is not a colour system until every colour has a **role** and every
text-on-background pair has a **computed** contrast. Use
`../scripts/color_tools.py`; never estimate contrast or hand-pick a twelve-step
scale. Sources and tools: `resources/color.md`.

## Strategy First

Pick the colour stance from the brief before picking hues:

| Stance | Looks like | Suits |
| --- | --- | --- |
| Neutral + one accent | greys carry everything; one hue marks action | product UI, tools, anything used daily |
| Tonal | one hue family across surfaces and accents | calm brands, editorial |
| Duotone | two committed hues | bold brands, posters |
| Multi-hue, vivid | several saturated hues with rules for each | consumer, playful, data-heavy with categories |
| Dark-first | dark surfaces as the native state | developer tools, media, control rooms |

Spend the accent on actions and on the one thing that must be seen. If
everything is accented, nothing is.

## Building the System

1. **Work in a perceptual space.** Define colours in OKLCH: L (lightness,
   0-1), C (chroma, 0 to about 0.37), H (hue, degrees). Equal L steps look
   equal, which HSL cannot promise, and the same L across hues gives the same
   contrast. Out-of-gamut values must be gamut-mapped (the script does this)
   and need an sRGB fallback if targeting old browsers.
2. **Generate scales, do not pick them.**
   `color_tools.py scale "#3b82f6" --name blue` produces an 11-step scale with
   the seed pinned to its nearest step; `--neutral` makes a low-chroma grey
   tinted with the brand hue; `--dark` mirrors lightness for dark surfaces.
3. **Tint the neutrals** slightly toward the brand hue - warm or cool, never
   both. Use near-black and near-white rather than `#000` and `#fff` for large
   areas.
4. **Map steps to roles** (the twelve-step convention generalises to any
   scale):

   | Role | Light-scale position |
   | --- | --- |
   | App background, subtle background | lightest two steps |
   | Component background: normal, hover, pressed / selected | next three |
   | Border: subtle, interactive, strong / focus ring | next three |
   | Solid fill, solid hover | the pure, highest-chroma steps |
   | Text: low-contrast, high-contrast | darkest two |

5. **Name by role**: `bg`, `bg-subtle`, `surface`, `surface-raised`,
   `border-subtle`, `border`, `border-strong`, `text`, `text-muted`,
   `text-faint`, `text-on-accent`, `accent`, `accent-hover`, `accent-subtle`,
   `focus-ring`, and for each status (`success`, `warning`, `danger`, `info`):
   `-subtle`, `-border`, `-solid`, `-text`.
6. **Compute contrast** for every pair that will occur:
   `color_tools.py matrix --fg <text colours> --bg <surface colours>`.
   Record the table in `DESIGN.md`.

## Contrast Requirements

WCAG 2.2 AA is the default bar and the legal reference in most places:

| Content | Minimum ratio |
| --- | --- |
| Body text | 4.5 : 1 |
| Large text (24 px+, or 18.66 px+ bold) | 3 : 1 |
| UI components and meaningful graphics (borders of inputs, icons, focus rings, chart marks) | 3 : 1 against adjacent colours |
| AAA body text | 7 : 1 |

Disabled controls and pure decoration are exempt, but disabled text still has
to be findable. Placeholder text counts as text. APCA (reported by the script
as Lc) models perception better, especially in dark themes, but is draft
guidance: report it alongside the WCAG ratio, do not substitute it. Rough APCA
guide: Lc 75+ body text, 60+ other content text, 45+ large headlines and
non-text essentials.

Never let colour carry meaning alone: pair status colour with an icon, a label
or a shape. Check charts and status sets under colour-vision deficiency.

## Dark Mode

Re-map roles; do not invert.

- Surfaces are near-black with a little hue, not `#000` (unless the brief is
  OLED-first). Higher surfaces are **lighter**; shadows barely read on dark,
  so use lightness steps and borders for elevation.
- Reduce chroma on large coloured areas; saturated colour on dark vibrates.
- Re-pick accent steps so solid fills keep contrast with their labels, and
  text-coloured accents are lighter than in light mode.
- Soften pure-white text; keep body text comfortable rather than maximal.
- Keep the container-to-background lightness difference small (roughly within
  12% for dark, 7% for light) so layers feel related.
- Set `color-scheme` on the root so native controls and scrollbars match.
- Re-run the contrast matrix for the dark mapping.

## Gradients, Transparency, Hue

- Interpolate gradients in `oklch` or `oklab` (`linear-gradient(in oklch, …)`)
  to avoid grey dead zones; add fine noise against banding.
- On a tinted background, tint borders, shadows and text toward the same hue.
- Semi-transparent borders and overlays adapt to what is beneath them; check
  their contrast on every surface they can land on.
- Interaction states move **toward more contrast** than the rest state.

## Data Colour

- Categorical: at most eight to ten hues, each with distinct lightness as well
  as hue; verify under colour-vision deficiency; order by importance, grey out
  the rest and highlight one series.
- Sequential: a single-hue lightness ramp. Diverging: two hues through a
  neutral midpoint. Use research-based schemes
  (`resources/color.md` > ColorBrewer, Viz Palette).
- Status colours are not chart colours: keep red, amber and green for meaning.

## Cultural and Brand Notes

Colour meaning is local: red is celebration and prosperity in Chinese
contexts and rising prices on Chinese market screens (green falls), the
reverse of Western finance UI. Check the convention of the audience. For
brand work specify sRGB hex and OKLCH; CMYK and spot values must be proofed by
a printer.
