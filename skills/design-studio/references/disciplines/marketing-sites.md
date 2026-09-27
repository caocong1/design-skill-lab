---
title: Marketing sites (landing, product, editorial, portfolio, store pages)
evidence: practice
sources: [impeccable, anthropic-frontend-design-skill, taste-skill, vercel-web-interface-guidelines, web-baseline-2026]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Marketing sites

Landing pages, homepages, product and pricing pages, launch and event pages, editorial pages,
portfolios, storefronts. A marketing page is an argument whose shape comes from the content. The fixed
section list (nav, hero, logos, features, testimonials, pricing, FAQ, CTA) is the page every category
ships: keep it as the canon exit ([directions](../process/directions.md)), chosen only when the content
really is a feature set with proof, and start from the ten archetypes below.

Order of decisions: message and proof inventory > content shape > page archetype > first viewport >
sections from the pattern library > art direction (usually from [directions](../process/directions.md)) >
performance and motion budget > re-composition per width.

## Visitor mode and colour rung

Visitor modes are defined in [truth-files](../process/truth-files.md) (section 6) and colour rungs in
[color](../fundamentals/color.md) (Strategy first). On marketing surfaces:

- Landing, product, pricing and launch pages are Persuade; documentation, editorial pages and changelogs are Read; portfolios, galleries and campaigns are Experience. A product tour inside the app is Operate ([product-ui](product-ui.md)).
- Starting rung by archetype (section 2): Persuade pages with an ownable brand colour start at Committed; a quiet developer tool may stay Restrained and win on type, product and proof; launch, event and campaign pages can go Drenched; editorial and documentation-led pages stay Restrained, with colour spent on the content.
- Write the mode in the surface contract and the rung in the direction card before picking any colour.

## 1. Message and proof inventory

Before any layout, write down: who it is for, their problem in their words, the promise, the single
action, the three strongest objections, and the proof inventory. Use the user's copy; when there is none,
draft it in their vocabulary. A page designed around lorem ipsum is designed around nothing.

The proof inventory lists what actually exists: verifiable artefacts (live demo, docs, open-source repo,
public changelog), named customers who agreed to be named, sourced metrics with a date, reviews and
awards with links, press, certifications with a certificate number. The inventory limits the page:
without logos you may use, there is no logo strip.

## 2. Content shape > page archetype

Name the shape of what you have, then pick the archetype. A page may combine two (a product tour with
a pricing tail), but one archetype owns the first viewport. Research the archetype, not the category:
for a catalogue page study good indexes (type foundries, component galleries), not other SaaS
landings ([research](../process/research.md); `python3 "$S/catalog.py" find <keywords> --domain web`, with `S` = `skills/design-studio/scripts`).

| Archetype | Content shape it fits | Spine | Trap |
| --- | --- | --- | --- |
| Long argument / manifesto | one idea to argue; a point of view; few assets | thesis headline > claims in sequence, each with its evidence > what changes for the reader > one action at the end, a small sticky action throughout | claims chopped into icon cards |
| Product tour | a product with a visible, good UI | promise > 3-5 real jobs as chapters, each an annotated screen or loop > proof > next step | floating UI fragments; div-drawn fake screenshots |
| Tool as homepage | the product works without sign-up (converter, generator, calculator, playground) | the working tool is the first viewport > what it does, below > what the paid or full version adds | the tool hidden behind a CTA |
| Single-object showcase | one object (hardware, app, typeface, book, a product detail page) | the object large > detail views > specs sheet > buy or download with price, variants, delivery and trust beside the button | feature cards orbiting a render |
| Catalogue / index | many items of one kind (templates, integrations, fonts, components, resources) | search and filters first > dense grid or list > item pages | a marketing hero pushing the index below the fold |
| Editorial / magazine | ongoing content (stories, research, a blog) | a lead story > sections or issues > typographic hierarchy, image-led | a grid of equal post cards with no lead |
| Documentation-led | technical buyers who evaluate by reading | what it is in one line > quick start with copyable code > API or feature surface > docs search | marketing gloss hiding the code sample |
| Event / launch | a date, a place, a lineup, a moment | date, place and what happens > agenda and people > register; before, during and after states | a page that goes stale the day after |
| Portfolio / case-study index | the work is the proof | work first and large > one line of positioning > case studies as stories (problem, role, process, outcome) > contact | an about-me hero |
| Pricing-led / comparison | visitors who know the category and are choosing (second visit, B2B, commodity) | plans or a usage calculator first > comparison table > objections answered > contact sales | pricing buried under a hero |

## 3. First viewport

- In the first viewport at 1280 x 720 and 390 x 844: what it is, for whom, and what to do next.
- Measured, not asserted: the surface contract lists the must-be-above-the-fold elements per viewport as selectors, and `lint.mjs <page> --viewports <size> --above-fold "<selectors>"` passes at each size before the critic runs.
- On mobile, every feature item survives the re-composition and the primary action stays persistent (a sticky bar or header), unless the brief says otherwise.
- The headline is the largest text and says something only this product could say. Heuristic, not a gate: at most two lines at desktop, support copy under about 20 words.
- One primary action, plus at most one quiet secondary, visible without scrolling at both widths.
- The hero's form comes from the subject: the most characteristic thing in its world, in the form that fits it (headline, image, live demo, interaction).
- A mocked product UI is a realistic interface with plausible, labelled data in the product's own system, never grey boxes or div fragments; a real screenshot is better.
- A partly visible next section beats a "scroll" cue.

Choose the hero by the best truthful asset:

| Best truthful asset | First viewport |
| --- | --- |
| A good real product UI | the product at a legible crop, framed with intent, or a short loop |
| A tool that works without sign-up | the tool itself, working |
| A physical product or people | photography with one consistent treatment |
| A strong idea, no imagery | a typographic hero: scale, contrast, a distinctive face |
| A technical or abstract product | a diagram or data visual that explains, not a decorative blob |
| One outstanding customer result, real and consented | the result: name, number, face |
| An event | date, place and what happens, before anything else |

The hero slot attracts the most dated tells (the mesh-gradient hero with a pill badge, the hero-metric
block): check the first viewport against [anti-slop](../fundamentals/anti-slop.md) and keep a tell only
when the brief gives a reason.

## 4. Section pattern library

Each section has a job; pick the pattern for the job. Instead of the default, try the alternative when
the condition holds; otherwise keep the default or cut the section.

| Instead of | Try | When |
| --- | --- | --- |
| a logo cloud under the hero | one named customer story with a number and a face; or a text line naming three customers | you have one strong, consented case; logos without permission are fabrication |
| three equal feature cards with icons | one annotated product screenshot with 3-5 callouts | the features are visible in the UI |
| a feature grid | a comparison table against the real alternative, including the spreadsheet or doing nothing | buyers are switching from something |
| a "1-2-3 how it works" row | a real input > output transcript; a live embed; a 20-second loop | the process is the product |
| a testimonial carousel | two or three quotes set large, with full name, role, company, photo and a link to the source | quotes are real and consented |
| a stats band (10x, 99.9 %, 500+) | one number in a sentence with its denominator, date and source; or a before/after chart | the number is audited |
| image-text zigzags | a sticky visual with text steps scrolling past (static fallback); a long essay with margin notes | the argument is sequential |
| an FAQ of softballs | real objections in the customer's words, answered with specifics; or answers placed next to the claim they qualify | objections are known from sales or support |
| a final banner repeating the hero | the next step for the reader's stage: bookable demo slots, a copyable install command, a download that detects the OS | the action has a concrete form |
| three pricing cards with "most popular" | a usage calculator; a single price with what is included; a comparison table with toggles | pricing is usage-based, simple, or plan differences matter |
| a changelog hidden in the footer | recent changelog entries on the page | shipping cadence is a selling point (developer tools) |
| unstated limits | a "what it does not do" list | the audience is expert or sceptical |
| a wall of integration logos | a searchable integrations index | there are many integrations |
| a team photo grid | principles, a founder letter, how the team works | the company's point of view is the difference |
| a newsletter pop-up | an inline sign-up at the end of the content, saying what arrives and how often | the content earns a return |
| fade-up on every section | one orchestrated moment tied to the thesis; everything else static | always |
| a dark mesh gradient background | a material from the subject's world: paper, a spec-sheet grid, photography, the product's own UI | always |

Section rhythm (this file owns it; the spacing scale is in [layout-and-spacing](../fundamentals/layout-and-spacing.md)):

- Give the page beats by alternating density, alignment and ground: full-bleed > contained, centred > split, dense grid > one large statement.
- Section padding from the scale: roughly 96-160 px on desktop, 56-96 px on phones. Vary it with the beat instead of one value everywhere.
- Heuristics, not gates: across eight sections use at least four layout families; no more than two zigzags in a row; never three consecutive centred heading-plus-three-cards sections; an eyebrow label only where it encodes something.
- Keep text at a readable measure inside wide sections ([typography](../fundamentals/typography.md)).

## 5. Proof without fabrication

The rule is in [SKILL.md](../../SKILL.md) (Real content); this is how to work within it. Ratings,
download counts, press quotes and compliance badges count as proof too.

- Placeholder protocol: missing proof is a visibly labelled slot that cannot pass for final (dashed outline, mono label: `[客户 logo：待授权]`, `[Replace: metric + source]`), and every slot is listed in the handoff.
- Sample data in product screenshots is plausible and labelled "示例数据" or "sample" wherever it could be read as a real result.
- Proof, strongest first: a verifiable public artefact > a named customer with a number > a linked third-party review or award > a sourced aggregate stat > a logo wall > an unnamed quote. Use the strongest you have; cut a section rather than fill it.
- Mainland China: the Advertising Law forbids superlatives such as 最佳, 第一 and 国家级 in advertising copy; rewrite them as specific, checkable claims.

## 6. Art direction

- One strong idea carries the page: a typographic voice, a colour stance, an imagery strategy or a motion signature. Five decorations do not add up to one idea.
- One illustration style, one photo treatment, one icon family, one radius logic across the page.
- On a Restrained or Committed page, the accent marks the actions; a second accent competing for them breaks the path.
- Display type carries the personality; body type stays quiet. Faces over-represented in generated pages are a dated list in [anti-slop](../fundamentals/anti-slop.md): choose with a reason, not from it.
- CSS a marketing page can spend as material when the idea calls for it: balanced headline wrapping, variable-font axes as an identity device, a wide-gamut accent behind a gamut query, page-to-page transitions on a small site, section components that adapt to their container. Support and fallbacks: [modern-css](../fundamentals/modern-css.md).

## 7. Performance and motion budget

| Item | Budget |
| --- | --- |
| Core Web Vitals (mobile, p75) | LCP under 2.5 s, INP under 200 ms, CLS under 0.1 |
| First view | readable without JavaScript; HTML, CSS and JS for the first view around 150 KB gzip before images |
| Hero media | explicit width and height; preload only the above-the-fold image; video as muted, looping, inline autoplay with a poster frame instead of a GIF; a still under reduced motion |
| Fonts | at most two families, subset, critical faces preloaded, `font-display: swap` or `optional`, a metric-matched fallback so nothing shifts. Chinese: the system stack or a sliced OFL face ([cjk-typography](../fundamentals/cjk-typography.md)) |
| Motion | one orchestrated moment tied to the thesis; entrance motion only in the first viewport or where it explains |

- Motion a marketing page earns: the product's value is change over time (before and after), the product is spatial, or the brand owns a motion signature. Otherwise stay static.
- Technique, support status, reduced-motion variants and the auto-motion and flash limits: [motion](motion.md). A scroll-linked effect is an enhancement, so the static page must already tell the story.
- The page semantics are part of the design: one `h1`, ordered headings, real links and buttons, alt text, and an Open Graph image designed with the page ([graphics](graphics.md)).

## 8. Re-compose per width

At 390, 768, 1280 and 1920 decide: what the hero visual becomes (crop, portrait re-crop, stack, replace),
how multi-column sections reorder (message first, decoration last), how the nav collapses, how pricing
and comparison tables become cards or a swipeable set, and what replaces hover-only content on touch.
A desktop composition stacked for mobile, with the image pushed below the fold, is not re-composition.
Rendering: [render-and-look](../process/render-and-look.md).

## 9. Mainland China distribution

- The WeChat in-app browser is often the main mobile viewport: check the page at 390 there, with no hover dependence and room for the browser's own bars.
- Design the WeChat share card (title, description, square thumbnail) and have it set through the JS-SDK; left to WeChat, the card is usually a bare title with the URL and a generic or arbitrary thumbnail.
- On desktop the primary action is often a QR code (to a mini-program, an official account or a download), because the visitor continues on the phone; design it as a first-class CTA with a caption.
- Google Fonts and other foreign CDNs are unreliable: self-host or use the system stack.
- The footer carries the ICP filing number linked to the MIIT filing site, and the public-security filing number where applicable.

## 10. Deliverable

`.design/screens/<page>.html`: a self-contained responsive prototype on the system tokens, rendered at
the four widths (light and dark if offered). Ship with it:

- the message outline and the proof inventory;
- the archetype chosen and why, with the runner-up;
- the section map: each section's job and pattern;
- the placeholder list, and the asset and licence list;
- the performance and motion budget, with anything that exceeds it;
- screenshots at 390, 768, 1280 and 1920.

## Traps

General tells (generic headlines, icon cards, decorative numbering) are in [anti-slop](../fundamentals/anti-slop.md).
Specific to marketing pages:

- The statistical-mean page: centred hero on a dark gradient, pill badge, three feature cards, logo cloud, testimonial carousel, pricing trio, FAQ, CTA banner, each section present because the template had it.
- The archetype chosen by habit: a catalogue with a SaaS hero, documentation behind marketing gloss, a portfolio that opens on the designer instead of the work.
- Two competing primary CTAs; a nav with ten links; a section kept after the proof inventory showed nothing to put in it.
