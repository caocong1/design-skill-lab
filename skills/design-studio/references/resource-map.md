# Resource Map

Route a need to the right catalogue file and section, then read **only that
file**. The catalogue files under `resources/` are generated from the lab's
curated registry; each row says what the source is best for, how to get
straight to the useful page, how an agent can access it, its licence where
that matters, and a tier.

## Using a Catalogue Row

- **Tier**: start with `S`, fall back to `A`; `B` is niche or has a stated
  weakness.
- **Access** reads `cost · agent access · licence`:
  `static` = fetch it directly; `js` = needs a real browser tool; `blocked` =
  bot protection or a login wall, so give the user the link and what to look
  for instead of working around it; `unknown` = unreachable from the
  maintainer's network when last checked, which is **not** proof it is down.
  If a source is unreachable from the current network, choose another source
  in the same section rather than concluding it is dead.
- Choose two to four sources of **different kinds** for any research task
  (see `../../find-design-inspiration/SKILL.md`).
- Trend-driven sources are perishable by nature: date what you take.
- Check the licence before using any asset (`licensing.md`).

## Need -> Where

| Need | File | Section |
| --- | --- | --- |
| Overall look of a marketing site, portfolio, agency site | `resources/web.md` | Curated site galleries; Award sites |
| Landing page structure and section order | `resources/web.md` | Landing pages and SaaS marketing; Conversion and copy |
| One section: hero, nav, pricing, footer, CTA, 404, email | `resources/web.md` | Section and element galleries |
| Dark, brutalist, e-commerce, portfolio, or CJK-layout references | `resources/web.md` | Niche and regional galleries |
| An app screen or a whole flow (onboarding, checkout, settings, paywall) | `resources/app-ui.md` | Real-product screens and flows |
| A component's anatomy, states, keyboard behaviour | `resources/app-ui.md` | Component references |
| iOS, Android, Windows, HarmonyOS, mini-program, CLI conventions; WCAG | `resources/app-ui.md` | Platform guidelines and standards |
| Enterprise / admin patterns, a design system to learn from | `resources/app-ui.md` | Published design systems |
| Chart choice, dashboards, big-screen data walls | `resources/app-ui.md` | Data visualisation, dashboards and big-screen |
| Chat, copilot, agent interfaces | `resources/app-ui.md` | AI product UX |
| HUD, immersive or full-screen UI; one delightful detail | `resources/app-ui.md` | Details and out-of-category sources |
| How real products animate | `resources/motion.md` | Motion in shipped products |
| Easing, springs, scroll-driven and view-transition tooling | `resources/motion.md` | Easing, spring and animation tools |
| Motion tokens, principles, motion accessibility | `resources/motion.md` | Official motion guidance and accessibility |
| An icon family; pulling an SVG by URL | `resources/icons.md` | Icon families; Search, aggregators and APIs |
| Brand or AI-vendor logos | `resources/icons.md` | Brand and vendor logos |
| Rules for drawing icons; app icons and favicons | `resources/icons.md` | Icon design guidance; App icons and favicons |
| Illustration, 3D, photos, video, mock-ups | `resources/assets.md` | by asset type |
| Gradients, grain, patterns, shaders | `resources/assets.md` | Backgrounds, gradients, patterns and shaders |
| Logo references by letter, shape, industry | `resources/brand.md` | Logo archives |
| Identity critique, rebrand examples | `resources/brand.md` | Identity reviews and rebrand coverage |
| What a brand guideline contains | `resources/brand.md` | Brand guideline collections |
| Naming; trademark similarity search | `resources/brand.md` | Naming and trademark search |
| Posters, editorial layout, historical references | `resources/graphic.md` | Posters and typographic work; Design history archives |
| Decks, covers, packaging, social sizes | `resources/graphic.md` | by format |
| A typeface (open or commercial); type seen in use | `resources/type.md` | Open and free font sources; Commercial foundries; Type in use |
| Type scales, fluid type, system stacks, subsetting | `resources/type.md` | Type tools |
| Chinese fonts, licences, typesetting rules and tooling | `resources/type.md` | Chinese type and typesetting |
| A palette mood; traditional colour names | `resources/color.md` | Palette inspiration |
| Building scales; contrast and colour-vision checks; data palettes | `resources/color.md` | Scale and system builders; Contrast |
| Other AI design skills, DESIGN.md, browser and Figma bridges | `resources/code.md` | AI design skills, formats and agent tooling |
| Component libraries by stack; animated kits | `resources/code.md` | Component libraries; Animated kits |
| Animation, 3D, chart libraries | `resources/code.md` | Animation, graphics and chart libraries |
| Token tooling; rendering to PNG / PDF / PPTX; font subsetting | `resources/code.md` | Design tokens; Rendering, export, typesetting and fonts |
| Principles to cite; books; courses; Chinese-language reading | `resources/reading.md` | by topic |
| Moodboards, communities, daily trend feeds | `resources/general.md` | by kind |

## Adding or Correcting a Source

The catalogue is maintained in the lab repository
(`catalog/resources.jsonl`), not in these generated files. Report dead links,
moved sites or licence changes to the maintainer, or use the lab's
`iterate-design-lab` skill.
