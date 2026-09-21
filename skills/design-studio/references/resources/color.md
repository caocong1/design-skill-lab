<!-- Generated from catalog/resources.jsonl by scripts/build-catalog.py. Do not edit by hand. -->
# Resources: Colour

Palette inspiration, tools that build perceptually even and accessible scales, contrast and colour-vision checks, and the articles that explain why. Compute contrast; never estimate it.

Access reads `cost · agent access · licence`. Agent access: `static` = a plain web fetch can read it; `js` = needs a real browser; `blocked` = bot protection or a login wall, send the user the link instead; `unknown` = could not be reached from the maintainer's network when last checked (not proof that it is down). `login` = content is gated. Tier: `S` first place to look, `A` strong, `B` niche or with a clear weakness.

## Palette inspiration

For mood and starting points. A palette is not a system until roles and contrast are defined.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Coolors](https://coolors.co) | Fast palette generator with locking, contrast check and a large explore section | Lock the brand colour, generate around it; verify contrast separately | freemium · blocked | S |
| [Realtime Colors](https://www.realtimecolors.com) | Preview a palette and font pair on a real page layout, then export tokens | The fastest sanity check of a palette in context | free · static | S |
| [Happy Hues](https://www.happyhues.co) | Curated palettes shown applied to a page, with role labels | Learn role assignment, not just swatches | free · static · slow | A |
| [Huemint](https://huemint.com) | Machine-learned palettes previewed on brand and website mock-ups | Generate on the mock-up closest to the deliverable | free · js | A |
| [Adobe Color](https://color.adobe.com) | Harmony rules, extraction from images, contrast and colour-blind checks | Extract a palette from a reference photograph | free · static | A |
| [Color Hunt](https://colorhunt.co) | Community palettes sorted by popularity and tag | Treat as a trend indicator | free · static | A |
| [A Dictionary of Color Combinations (Sanzo Wada)](https://sanzo-wada.dmbk.io) | Interactive version of Wada's 348 colour combinations from 1930s Japan | Source of unusual, sophisticated combinations | free · js | A |
| [Nippon Colors (ja)](https://nipponcolors.com) | Traditional colours of Japan with names and values | Named traditional hues for East Asian contexts | free · static · archived | A |
| [中国色 (zh)](http://zhongguose.com) | Traditional Chinese colours with names, CMYK and RGB | Named traditional hues for Chinese cultural contexts | free · static · archived | A |
| [Poline](https://meodai.github.io/poline/) | Palette generator drawing lines between anchors in polar colour space | For generative and illustrative palettes | free · static · MIT | B |
| [BrandColors](https://brandcolors.net) | Official brand colour codes | Check a category's colour conventions | free · unknown · slow | B |

## Scale and system builders

Generate scales in a perceptual space; map steps to roles.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [OKLCH Color Picker](https://oklch.com) | Picker and converter for OKLCH with gamut visualisation (sRGB, P3, Rec2020) | See where a colour leaves the sRGB gamut before building a scale | free · static · MIT | S |
| [Radix Colors](https://www.radix-ui.com/colors) | Twelve-step scales where each step has a defined UI purpose, with matched dark and alpha scales | Read Understanding the scale; the step-to-role mapping is reusable with any palette | free · static · MIT | S |
| [Harmonizer](https://harmonizer.evilmartians.com) | Generates consistent, accessible palettes with OKLCH and APCA contrast | Build scales with uniform perceived contrast across hues | free · js | S |
| [Leonardo](https://leonardocolor.io) | Generates colour scales by target contrast ratios, with adaptive themes | Specify contrast targets, get colours; the inverse of picking then checking | free · static · Apache-2.0 | S |
| [Tailwind CSS colors](https://tailwindcss.com/docs/colors) | Widely used 11-step palette defined in OKLCH | Reference for lightness and chroma curves; a safe default, and therefore a common one | free · static · MIT | A |
| [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/) | Generates Material colour roles from a seed using HCT tonal palettes | Export for Compose, Flutter, web | free · js · Apache-2.0 | A |
| [tints.dev](https://www.tints.dev) | Generates an 11-step Tailwind-style scale from one hex with tweakable curves | Quick brand scale; verify with contrast checks | free · static | A |
| [UI Colors](https://uicolors.app) | Tailwind scale generator with UI previews and contrast grid | Alternative to tints.dev | freemium · static | A |
| [Huetone](https://huetone.ardov.me) | Build accessible palettes in LCH with WCAG and APCA read-outs per step | Tune a whole system while watching contrast | free · js · MIT | A |
| [Accessible Palette](https://accessiblepalette.com) | Creates palettes with consistent lightness and contrast across hues | Ensures step 600 of every hue passes the same contrast | free · static | A |
| [Atmos](https://atmos.style) | LCH palette builder with shade curves and contrast checking | A more visual alternative for curve editing | freemium · static · login | A |

## Contrast, colour vision and data palettes

WCAG 2 ratios are the legal baseline; APCA is informative draft guidance.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) | The standard quick WCAG contrast check, with an API | API: https://webaim.org/resources/contrastchecker/?fcolor=<hex>&bcolor=<hex>&api | free · static | S |
| [Who Can Use](https://www.whocanuse.com) | Shows how a colour pair performs across vision types | Use to make contrast findings concrete for stakeholders | free · static | S |
| [ColorBrewer](https://colorbrewer2.org) | Research-based sequential, diverging and qualitative schemes for maps and charts | Tick colour-blind safe and print friendly | free · static · Apache-2.0 | S |
| [APCA Contrast Calculator](https://apcacontrast.com) | Reference calculator for APCA lightness contrast with font-size lookup | APCA is draft guidance, not a legal standard; report WCAG 2 ratios alongside | free · static | A |
| [Contrast Grid](https://contrast-grid.eightshapes.com) | Tests every foreground against every background in a palette | Paste the palette, screenshot the grid into the design system docs | free · unknown | A |
| [Viz Palette](https://projects.susielu.com/viz-palette) | Tests a data palette in real chart types under colour-vision deficiencies | Check categorical palettes before shipping charts | free · js | A |

## Colour guides

The reasoning behind modern UI colour systems and dark mode.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [OKLCH in CSS: why we moved from RGB and HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl) | The case for OKLCH: predictable lightness, easy palette generation, wide gamut | Read before defining colour tokens | free · static | S |
| [Designing accessible color systems](https://stripe.com/blog/accessible-color-systems) | How Stripe built a palette with predictable contrast using a perceptual colour space | The reasoning behind step-number contrast guarantees | free · static · archived | S |
| [Color & Contrast](https://colorandcontrast.com) | Interactive guide to colour science for UI designers | Look up simultaneous contrast and colour-appearance effects | free · js | A |
| [Color in UI Design: a practical framework](https://www.learnui.design/blog/color-in-ui-design-a-practical-framework.html) | Practical method for deriving UI colour variations | Useful mental model for darker and lighter variants | free · static | A |
| [Building your color palette](https://www.refactoringui.com/previews/building-your-color-palette) | Why a UI needs greys, a primary and accents in eight to ten shades each | The baseline for a product palette | free · static | A |
| [How to pick the least wrong colors](https://mattstromawn.com/writing/how-to-pick-the-least-wrong-colors/) | Algorithmic approach to categorical palettes that stay distinct | For charts with many series | free · static | A |
| [Material 2: Dark theme](https://m2.material.io/design/color/dark-theme.html) | The clearest reasoning on dark surfaces, elevation overlays and desaturated accents | Read before deriving a dark mode | free · js · archived | A |
