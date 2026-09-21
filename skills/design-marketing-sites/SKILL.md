---
name: design-marketing-sites
description: Design landing pages, product and SaaS marketing sites, portfolios, editorial pages and storefront pages that persuade and do not look templated. Covers page narrative, hero strategy, section rhythm, conversion structure, art direction, scroll choreography, responsive behaviour and performance as design. Use for a landing page, homepage, product page, pricing page, portfolio, launch page, or any single section such as hero, navbar, pricing, testimonials, footer. 落地页、官网、首页、Hero 首屏、导航栏、定价页、作品集。
metadata:
  version: 0.1.0
  short-description: Persuasive, non-templated web pages
---

# Design Marketing Sites

A marketing page is an argument with a rhythm. Decide the argument first, then
the art direction that makes it memorable, then the sections.

Shared fundamentals: `../design-studio/references/typography.md`,
`../design-studio/references/color.md`,
`../design-studio/references/layout-and-spacing.md`,
`../design-studio/references/anti-slop.md`. References for any section:
`../design-studio/references/resources/web.md`.

## Workflow

1. **Message before layout.** Write down: who it is for, the problem, the
   promise, the proof, the single action. If the user has copy, use it; if
   not, draft it in their vocabulary. A page designed around lorem ipsum is
   designed around nothing.
2. **Choose the art direction** with
   `../explore-design-directions/SKILL.md` when it is not already fixed by an
   existing brand. One strong idea (a typographic voice, a colour stance, an
   imagery strategy, a motion signature) beats five decorations.
3. **Outline the narrative**, then assign each section a job and a layout
   pattern. Vary the patterns.
4. **Design the hero last-but-first**: it is decided by the message and the
   best asset available, and it sets the system for everything below it.
5. **Build the system** (tokens, type scale, section spacing, component set)
   and compose the page from it.
6. **Choreograph** scroll and load motion sparingly
   (`../design-motion/SKILL.md`).
7. **Make it responsive by re-composition**, not shrinking.
8. **Render at 390, 768, 1280 and 1920 wide**, light and dark if offered;
   critique; fix.

## Narrative Skeleton

Adapt, do not fill in. Each section answers the question the previous one
raised.

| Section | Job | Notes |
| --- | --- | --- |
| Nav | Orientation + the one action | 4-6 links; CTA at the trailing edge; decide sticky behaviour and mobile menu |
| Hero | What it is, for whom, why care, what to do | headline of roughly 5-10 words; one or two lines of support; one primary CTA (+ one quiet secondary); show the product or the outcome |
| Proof strip | Borrowed trust | real customer logos, ratings, numbers - or omit |
| Problem -> outcome | Make the pain and the after-state concrete | benefits as outcomes, features as evidence |
| How it works | Reduce perceived effort | three to four steps, or an interactive demo |
| Deep proof | Make it believable | named testimonials with role and face, case numbers, before / after |
| Differentiation | Why this, not the alternative | comparison, principles, what it deliberately does not do |
| Pricing | Remove the last unknown | 2-4 plans, one recommended, annual / monthly, what is included, FAQ nearby |
| FAQ | Handle objections | the real objections, in the customer's words |
| Final CTA | Ask again with the promise restated | same label as the hero CTA |
| Footer | Sitemap, legal, trust | for mainland-China hosting include the ICP filing number and link |

Portfolio: work first, large; one line of positioning; case studies as stories
(problem, role, process, outcome); easy contact. Editorial: measure, rhythm,
typographic hierarchy, generous images; the chrome disappears. Storefront
pages: product imagery quality, price and variant clarity, trust and delivery
information near the buy button; consult research-backed e-commerce guidance
in the catalogue before inventing.

## Hero Strategy

Choose by the best truthful asset:

| Asset available | Hero |
| --- | --- |
| A good-looking real product UI | product shot or short loop, framed and cropped with intent |
| A physical product or people | photography with one consistent treatment |
| A strong idea but no imagery | typographic hero: scale, contrast, a distinctive face |
| An interactive product | a live, try-it-now demo in the hero |
| A technical or abstract product | a diagram or data visual that explains, not a decorative blob |

Rules: the headline is the largest thing and says something specific. One
primary CTA. The visual proves the claim. Nothing important sits below an
ambiguous fold: test at 1280 x 720 and 390 x 844. If the product UI must be
mocked, design it as a realistic interface with plausible data, never as grey
boxes.

## Rhythm and Composition

- Alternate section density, alignment and background so the page has beats:
  full-bleed -> contained; centred -> split; dense grid -> one big statement.
- Never stack three consecutive centred sections of heading + three cards.
- Section padding on a scale (desktop roughly 96-160 px, mobile 56-96 px);
  tighter between a heading and its content than between sections.
- Constrain text to a readable measure even inside wide containers.
- One illustration style, one photo treatment, one icon family, one radius
  logic across the page.
- Spend the accent colour on the actions. If everything is accented, nothing
  is.
- Display type carries the personality; body type stays quiet and legible.

## Trust and Honesty

Proof must be real. When the user has not supplied it, insert clearly labelled
placeholders (`[Customer logo]`, `[Replace: metric]`) and list them in the
hand-over. Never invent testimonials, names, client logos, star ratings,
download counts, press quotes or compliance badges.

## Performance and Semantics Are Design

- Budget the hero: optimised, correctly sized media; poster frames for video;
  no layout shift when fonts and images arrive (reserve space, match fallback
  font metrics).
- Web fonts: two families at most, subset, preloaded, `font-display: swap` or
  `optional`. For Chinese pages prefer the system CJK stack, or subset /
  slice the web font - a full CJK font is megabytes.
- One `h1`; ordered headings; real links and buttons; alt text; an Open Graph
  image designed with the page (`../design-graphics/SKILL.md`).
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.
- Targets worth designing toward: LCP under 2.5 s, CLS under 0.1, INP under
  200 ms.

## Responsive Re-Composition

At each width decide: what the hero visual becomes (crop, stack, hide), how
multi-column sections reorder (the message first, the decoration last), how
the nav collapses, how tables (pricing, comparison) become cards or a
swipeable set, and whether hover-dependent content has a touch equivalent.

## Output

`.design/screens/<page>.html` as a self-contained, responsive prototype built
on `system/tokens.css`, or production code through
`../implement-design/SKILL.md`. Ship with: the message outline, the section
map with each section's job, asset and licence list, placeholder list,
responsive notes, and screenshots at the four widths.

## Anti-Patterns

- Centred hero over a dark mesh gradient with a glowing pill badge, followed
  by three equal feature cards and a logo cloud: the statistical mean of AI
  output.
- Headline that could belong to any company ("Build faster. Scale smarter.").
- Feature lists with an emoji or a generic icon per card.
- Scroll-triggered fade-up on every element; parallax that fights reading.
- Two competing primary CTAs; nav with ten links.
- Fake product UI, fake logos, fake numbers.
- A desktop composition simply stacked for mobile with the image pushed below
  the fold.
