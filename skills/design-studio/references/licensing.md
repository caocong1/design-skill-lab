# Licensing

Every third-party asset in a design has a licence, and the designer is the one
who knows where it came from. Record it; do not assume. This file states
common patterns, not legal advice, and licences change: **read the current
licence text at the source before shipping.**

## Rules

1. Record source, licence and date for every font, icon set, illustration,
   photo, 3D asset, sound and code library used. Put the list in the
   deliverable.
2. Prefer permissive, attribution-free licences for product work.
3. "Free" on a download site is not a licence. "Free for personal use" means
   **not** for a product, client work or a company site.
4. Trial, test and "free to try" fonts are for mock-ups only and must never
   ship. Remove them before hand-over.
5. Never present anything fabricated as real: customer logos, testimonials,
   press quotes, badges, metrics, awards. Use labelled placeholders.
6. Reference, do not copy. Never reuse another brand's logo, illustrations,
   photography, copy or distinctive trade dress. Brand logos shown as
   "customers" or "integrations" need the owner's permission and must follow
   their guidelines.
7. AI-generated imagery: disclose where it matters, check for artefacts and
   accidental likenesses, and check the generator's terms for commercial use.
8. When unsure, say so and offer a clearly licensed alternative.

## Quick Reference

| Licence | May ship in a commercial product? | Watch for |
| --- | --- | --- |
| SIL OFL (fonts) | Yes; embedding, logos and modification are fine | cannot sell the font itself; reserved font names on modified versions |
| Apache-2.0, MIT, ISC, BSD (code, icons) | Yes | keep the licence notice with redistributed source |
| CC0 / public domain | Yes, no attribution | trademarks and personality rights may still apply |
| CC BY | Yes, **with attribution** | attribution must be visible and correct |
| CC BY-SA | Yes, but derivatives carry the same licence | usually unsuitable for proprietary assets |
| CC BY-NC / NC-SA | **No** | common default on shader and art communities |
| Custom "free" licences (unDraw, Unsplash, Fontshare ITF FFL, icon-set licences) | Usually yes | no redistribution or resale as a collection; read the specific terms |
| Freemium asset sites | Free tier often requires a link-back | attribution duties; paid tier removes them |
| Commercial fonts | Only with the right licence **type** | desktop, web (page-views), app (per title), server and logo uses are often separate licences |
| GPL / AGPL tools | Using the tool is fine | linking or distributing it inside a product has copyleft consequences |
| "No-charge" proprietary (some animation libraries) | Yes under their terms | not open source; terms can exclude competing tools |

## Fonts, Specifically

- Web embedding usually needs a **web** licence; bundling in an app needs an
  **app** licence. A desktop licence covers neither.
- Subscription libraries typically forbid self-hosting and do not transfer to
  clients: the client needs their own subscription.
- Logos: most desktop licences allow outlined type in a logo; a few foundries
  require an extended licence. Check before building an identity on a face.
- **Chinese fonts**: commercial foundries (FounderType, Hanyi and others)
  actively enforce licences against companies, including for images and
  packaging. Use open-licence or vendor-provided free-commercial faces, keep
  the download source as evidence, and verify in a licence directory
  (`resources/type.md` > Chinese type).
- System fonts are licensed for use on their platform, not for redistribution
  or for use on other platforms (San Francisco, Segoe UI, PingFang).

## Icons and Symbols

- Platform symbol sets are for apps on that platform only. Do not ship them on
  the web, on other platforms, or in a logo.
- Brand icon collections are convenient, but the marks remain trademarks with
  their own usage rules.
- Large aggregator sites mix licences per collection; check each.
- Some popular open icon sets have changed licence between versions; check the
  licence of the **installed** version.

## Images

- Stock licences rarely cover resale of the unmodified image, use in logos or
  trademarks, or sensitive contexts with identifiable people.
- In mainland China, rights-managed stock agencies pursue unlicensed use
  vigorously. Never use an image found by search.
- Screenshots of other products are for private analysis; do not ship them
  inside a deliverable or a public page.

## Logos and Trademarks

An agent cannot clear a mark. Image-similarity and register searches
(`resources/brand.md` > Naming and trademark search) catch obvious conflicts;
tell the user that a professional clearance search is required before
adoption, in every jurisdiction where the brand will operate.
