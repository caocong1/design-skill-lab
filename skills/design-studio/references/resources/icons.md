<!-- Generated from catalog/resources.jsonl by scripts/build-catalog.py. Do not edit by hand. -->
# Resources: Icons

Pick one family per product and record its licence. Raw-SVG endpoints are listed so an agent can pull an icon without installing a package.

Access reads `cost · agent access · licence`. Agent access: `static` = a plain web fetch can read it; `js` = needs a real browser; `blocked` = bot protection or a login wall, send the user the link instead; `unknown` = could not be reached from the maintainer's network when last checked (not proof that it is down). `login` = content is gated. Tier: `S` first place to look, `A` strong, `B` niche or with a clear weakness.

## Icon families

Choose by style fit, coverage, weights, platform packages, licence and maintenance.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Lucide](https://lucide.dev) | Clean 24 px, 2 px-stroke community icon family (successor to Feather) with packages for every framework and a published design guide | Raw SVG: cdn.jsdelivr.net/npm/lucide-static@latest/icons/<name>.svg; default choice for neutral product UI | free · static · ISC | S |
| [Phosphor Icons](https://phosphoricons.com) | Flexible family in six weights (thin to bold, fill, duotone); friendly geometry, wide coverage | Raw SVG: cdn.jsdelivr.net/npm/@phosphor-icons/core@latest/assets/<weight>/<name>.svg; pick one weight per product | free · unknown · MIT | S |
| [Tabler Icons](https://tabler.io/icons) | 6000+ icons on a 24 px grid with adjustable stroke; the widest free coverage | Raw SVG: cdn.jsdelivr.net/npm/@tabler/icons@latest/icons/outline/<name>.svg | free · static · MIT | S |
| [Material Symbols](https://fonts.google.com/icons) | Google's variable icon font in outlined, rounded and sharp styles with FILL, wght, GRAD and opsz axes | Tune the axes to match text weight; SVGs via @material-symbols/svg-400 | free · js · Apache-2.0 | S |
| [SF Symbols](https://developer.apple.com/sf-symbols/) | Apple's symbol system aligned with San Francisco: weights, scales, rendering modes, animation | Use natively in Apple apps; never ship them on the web or Android | free · js · Apple licence: only for apps on Apple platforms; not for web, other platforms or logos | S |
| [Heroicons](https://heroicons.com) | Small, well-drawn set in four sizes and styles from the Tailwind team | Raw SVG: cdn.jsdelivr.net/npm/heroicons@latest/24/outline/<name>.svg | free · static · MIT | A |
| [Remix Icon](https://remixicon.com) | Neutral line and fill pairs with broad coverage; widely used in Chinese products | Check which licence version the installed package carries | free · js · Remix Icon License v1.0 since January 2026 (free commercial use, no resale as an icon pack); earlier releases were Apache-2.0 | A |
| [Iconoir](https://iconoir.com) | 1600+ stroke icons with a slightly softer character than Lucide | Packages for React, Vue, Flutter and SwiftUI | free · static · MIT | A |
| [IconPark (zh)](https://iconpark.oceanengine.com) | ByteDance's 2600+ icons whose stroke, theme (outline, filled, two-tone, multi-colour) and joins are props | Configure theme and stroke once for the whole product | free · js · Apache-2.0 | A |
| [MingCute](https://www.mingcute.com) | 3000+ carefully balanced line and fill pairs with a rounded, friendly feel | SVG, React, font and Figma distributions | free · blocked · Apache-2.0 | A |
| [Fluent System Icons](https://github.com/microsoft/fluentui-system-icons) | Microsoft's icon family in regular and filled at many sizes | Use for Microsoft-ecosystem or Windows-native products | free · static · MIT | A |
| [Carbon icons](https://carbondesignsystem.com/elements/icons/library/) | Precise enterprise icons and pictograms designed at 16, 20, 24 and 32 px | Use with Carbon-like dense UI | free · static · Apache-2.0 | A |
| [Bootstrap Icons](https://icons.getbootstrap.com) | 2000+ general-purpose icons, SVG and font | Safe choice for conventional web apps | free · static · MIT | A |
| [Hugeicons](https://hugeicons.com) | Very large set in many styles; the free tier is one stroke-rounded style | Check that the needed style is in the free tier | freemium · static · Free set is usable commercially; Pro styles are paid | A |
| [Streamline](https://www.streamlinehq.com) | Huge multi-style icon and illustration library with coherent families | Pick one family; read the attribution requirement for free sets | freemium · static · login · Free sets need a link-back; paid removes it | A |
| [lucide-animated](https://lucide-animated.com) | Lucide icons animated with Motion as copy-paste React components | Use for a few key moments, not every icon | free · js · MIT | A |
| [Untitled UI Icons](https://www.untitledui.com/free-icons) | Tidy 24 px stroke set designed alongside a popular UI kit | Line style only in the free tier | freemium · static · Free line set for commercial use; other styles paid | B |
| [Radix Icons](https://www.radix-ui.com/icons) | Crisp 15 px icons for compact interfaces | Use when 16 px sets feel heavy in dense UI | free · static · MIT · slow | B |
| [Pixelarticons](https://pixelarticons.com) | Pixel-grid icons for retro or playful directions | Keep at integer multiples of the base grid | freemium · static · MIT for the free set | B |
| [Health Icons](https://healthicons.org) | Public-domain medical and health icons | Domain coverage general sets lack | free · static · CC0 | B |
| [Game-icons.net](https://game-icons.net) | 4000+ game and fantasy glyphs | Attribution is mandatory | free · static · CC BY 3.0 (attribution required) | B |
| [Lordicon](https://lordicon.com) | Large animated icon library (Lottie) with interactive triggers | Check attribution for the free tier | freemium · static · login · Free tier needs attribution | B |

## Search, aggregators and APIs

For finding a concept across sets. Do not mix the results in one interface.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Iconify](https://iconify.design) | One API and tooling layer over 150+ open icon sets | SVG: https://api.iconify.design/<prefix>/<name>.svg; search: https://api.iconify.design/search?query=<q>; browse sets at icon-sets.iconify.design | free · static · Each set keeps its own licence (shown per set) | S |
| [Icones](https://icones.js.org) | Fast browser for all Iconify sets with copy-as (SVG, JSX, Vue, data URL) | Search across sets, then stick to one family | free · js | A |
| [SVG Repo](https://www.svgrepo.com) | 500k+ SVG vectors and icon collections | Filter by licence; prefer whole collections over single icons | free · blocked · Licence varies per collection; read each | A |
| [The Noun Project](https://thenounproject.com) | The widest range of pictograms for unusual concepts | Use for concept exploration; styles vary too much to mix in one UI | freemium · static · login · Free with attribution (CC BY); paid removes it | A |

## Brand and vendor logos

Trademarks remain with their owners; follow each brand's usage rules.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Simple Icons](https://simpleicons.org) | 3000+ single-colour brand icons with official hex colours | CDN: https://cdn.simpleicons.org/<slug>/<hex>; respect each brand's guidelines | free · blocked · CC0 for the SVGs; trademarks still apply | S |
| [Lobe Icons](https://lobehub.com/icons) | SVG and React logos of AI models and providers | The quick route to correct AI vendor marks | free · static · MIT for the code; marks belong to their owners | A |
| [SVGL](https://svgl.app) | Full-colour brand SVG logos with light and dark variants and an API | API: https://api.svgl.app?search=<name> | free · static · MIT for the project; marks belong to their owners | A |

## Icon design guidance

Read one before drawing a custom icon or writing the rules for a set.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Lucide icon design guide](https://lucide.dev/contribute/icons/design-principles) | Concrete, numeric rules for a 24 px stroke icon family: canvas, padding, stroke, radii, spacing, optical balance | The best template for writing the rules of a custom set | free · static | S |
| [Material: designing icons](https://m3.material.io/styles/icons/designing-icons) | Keyline shapes, grid, stroke and corner rules, optical sizes and the variable axes | Use the keyline shapes to equalise visual weight | free · js | S |
| [Apple HIG: App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons) | Current rules for layered app icons, appearances (default, dark, clear, tinted) and platform shapes | Verify sizes and layer rules here before exporting; they change with OS releases | free · js | S |
| [Apple HIG: SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols) | Rendering modes, variable colour, weights and scales, custom symbol guidance | Read before drawing a custom symbol for Apple platforms | free · js | A |

## App icons and favicons

Galleries for the idiom, tools for the packaging. Platform specs are perishable.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [RealFaviconGenerator](https://realfavicongenerator.net) | Generates and checks a complete, current favicon package | Run the checker on the deployed site | free · static | S |
| [How to Favicon](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs) | The minimal modern favicon set and the exact HTML, kept up to date by its authors | Follow it instead of generating dozens of legacy files | free · js | S |
| [iOS Icon Gallery](https://www.iosicongallery.com) | Curated app icons for iOS, macOS and watchOS | Study silhouettes and palettes in the target category | free · static | A |
| [macOSicons](https://macosicons.com) | Huge community gallery of macOS-style app icons | Reference for the macOS icon idiom | free · static · Community-made; personal use | A |
| [Apple Icon Composer](https://developer.apple.com/icon-composer/) | Apple's tool for building layered, material-aware app icons from SVG or PNG layers | Supply flat layers; let the system render the material | free · static | A |
| [Icon Kitchen](https://icon.kitchen) | Generates adaptive Android icons and iOS, web and macOS icon sets from one artwork | Preview mask shapes and the monochrome layer before export | free · js | A |
| [Maskable.app](https://maskable.app) | Preview and edit PWA maskable icons against every mask shape | Check the safe zone before shipping the manifest | free · static | A |

## SVG tooling

Optimise, edit paths numerically, convert, trace.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [SVGOMG](https://jakearchibald.github.io/svgomg/) | Visual front end for SVGO with a live diff | Keep viewBox; lower precision until the shape changes, then step back | free · static | S |
| [SVGO](https://svgo.dev) | The SVG optimiser behind most pipelines | Configure to keep viewBox and to avoid merging stroked paths | free · static · MIT | A |
| [SVG Path Editor](https://yqnn.github.io/svg-path-editor/) | Edit path commands numerically with a live preview: round, scale, translate, convert to relative | Use to snap hand-written paths to the grid | free · js | A |
| [SVG Viewer](https://www.svgviewer.dev) | View, optimise and convert SVG to JSX, React Native, data URI and PNG | Quick check of code-written SVG | free · static | A |
| [VTracer](https://www.visioncortex.org/vtracer/) | Raster-to-vector tracer that handles colour images | Trace a sketch, then redraw cleanly; never ship the raw trace | free · static · MIT | A |
| [Boxy SVG](https://boxy-svg.com) | Browser-based SVG editor that writes clean markup | For manual touch-ups of generated SVG | freemium · blocked | B |
