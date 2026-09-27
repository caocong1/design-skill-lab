---
title: Licensing
evidence: practice
sources: [cjk-font-licensing, ai-labelling-law]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Licensing

Every third-party asset in a design has a licence, and the designer is the one who knows where it
came from. Record it; never assume it. This file gives common patterns, not legal advice, and
licences change: read the current licence text at the source before anything ships. Fabricated
proof and cloning are covered by the core rules in [SKILL.md](../../SKILL.md); this file covers what
a licence allows.

## Rules

1. Record source, licence, version and date for every font, icon set, illustration, photo, 3D asset,
   sound, generated image and code library. The list travels with the deliverable and the handoff.
2. Prefer permissive, attribution-free licences for product work.
3. "Free" on a download site is not a licence. "Free for personal use" means not for a product,
   client work or a company site. "免费商用" (free for commercial use) is not "open source": rights
   the licence does not grant are reserved.
4. Trial, test and "free to try" fonts are for mock-ups only. Remove them before handover.
5. Another brand's logo shown as a "customer" or "integration" needs the owner's permission and
   follows their brand guidelines.
6. When unsure, say so and offer a clearly licensed alternative.

## Quick reference

| Licence | May ship in a commercial product? | Watch for |
| --- | --- | --- |
| SIL OFL (fonts) | Yes: apps, documents, self-hosted web fonts, logos | cannot sell the font alone; a subset is a modified version, so a family with a Reserved Font Name must be renamed inside the file (a plain WOFF2 re-wrap with intact data and metadata is not a modification) |
| Apache-2.0, MIT, ISC, BSD (code, icons) | Yes | keep the licence notice with redistributed source |
| CC0, public domain | Yes, no attribution | trademarks and personality rights may still apply |
| CC BY | Yes, with attribution | the attribution must be visible and correct |
| CC BY-SA | Yes, but derivatives carry the same licence | usually unsuitable for proprietary assets |
| CC BY-NC, BY-NC-SA | No | the common default on shader, art and pattern communities |
| Custom "free" licences (unDraw, Unsplash, Fontshare, icon-set licences) | Usually yes | no redistribution or resale as a collection; read the specific terms |
| Freemium asset sites | The free tier often requires a link-back | attribution duties; the paid tier removes them |
| Vendor "free commercial" fonts | Usually yes, unmodified | often no modification and no separate redistribution; a required in-app credit |
| Commercial fonts | Only with the right licence type | desktop, web (page views), app (per title), server, ePub and logo uses are often separate licences |
| GPL, AGPL tools | Using the tool is fine | linking or distributing it inside a product has copyleft consequences |
| "No-charge" proprietary (some animation libraries) | Yes, under their terms | not open source; terms can exclude competing tools |

## Fonts

A font licence answers four separate questions; check each for the delivery you plan:

| Question | Typical trap |
| --- | --- |
| Use: may this product use it at all (commercial, client, logo)? | a desktop licence covers print and images, not the web or an app |
| Modify: may it be subset, converted, or have glyphs added? | subsetting a no-modification font for the web breaches it |
| Redistribute: may the file leave your machine (self-hosting, bundling)? | a subscription library usually forbids self-hosting and does not transfer to the client |
| Embed: may it be embedded in an app, a PDF or a game? | app embedding is often a separate, per-title licence |

- Logos: most licences allow outlined type in a logo; a few foundries require an extended licence.
  Check before building an identity on a face.
- A required credit ("uses X font" in the About screen) is a handoff item, not an afterthought.
- System fonts are licensed for use on their platform, not for redistribution or for use elsewhere
  (San Francisco, Segoe UI, PingFang). Draw with them in mockups; never ship their files.
- Chinese, Japanese and Korean fonts (OFL families, vendor "free" fonts, FounderType and Hanyi
  enforcement), with a matrix of what may be subset or self-hosted:
  [cjk-typography](cjk-typography.md).

## Icons and symbols

- Platform symbol sets (SF Symbols, the Segoe icon fonts) are for apps on that platform only: not
  on the web, not on other platforms, not in a logo. An open sibling set (Material Symbols, Fluent
  UI System Icons) has its own licence; check which one you are using.
- Brand icon collections are convenient, but each mark stays a trademark with its own usage rules.
- Aggregators mix licences per collection; check each set you take from.
- Some popular open icon sets changed licence between versions; check the licence of the installed
  version.

## Images

- Stock licences rarely cover resale of the unmodified image, use in logos or trademarks, or
  sensitive contexts with identifiable people.
- In mainland China, rights-managed stock agencies pursue unlicensed use vigorously. Never use an
  image found by search.
- Screenshots of other products are for private analysis: never inside a deliverable or on a public
  page.

## AI-generated assets

- Record model, prompt (or a prompt file), date, generator and the plan's terms for every generated
  raster, in the asset list and, where the pipeline allows, in the file's metadata. The procedure
  is in [image-generation](../process/image-generation.md).
- Commercial use depends on the generator's terms and plan; check them. Do not promise a client
  exclusive rights in generated output: it may not be protectable as their own work.
- Inspect every output for artefacts, accidental likenesses of real people, trademarks, recognisable
  characters and signature styles of living artists. Never present a generated image as a
  photograph, a real product view or a real person.
- Labelling is law, not courtesy, in the EU (AI Act Art. 50) and China (labelling measures and
  GB 45438-2025): a visible label plus machine-readable marking. What to label, where, and from
  when: [image-generation](../process/image-generation.md) (Labelling law); disclosure inside AI
  products: [ai-experience](../disciplines/ai-experience.md).

## Logos and trademarks

An agent cannot clear a mark. Register and image-similarity searches catch obvious conflicts
(`python3 "$S/catalog.py" find trademark`, with `S` = `skills/design-studio/scripts`, lists the official databases, including 中国商标网 and
WIPO's image search). Tell the user that a professional clearance search is required before
adoption, in every jurisdiction where the brand will operate.
