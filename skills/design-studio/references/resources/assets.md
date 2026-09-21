<!-- Generated from catalog/resources.jsonl by scripts/build-catalog.py. Do not edit by hand. -->
# Resources: Visual assets

Illustrations, 3D, photography, mock-ups, and code-native backgrounds. Licence mistakes are the main risk in this domain: the Access column states the licence reality for each source.

Access reads `cost · agent access · licence`. Agent access: `static` = a plain web fetch can read it; `js` = needs a real browser; `blocked` = bot protection or a login wall, send the user the link instead; `unknown` = could not be reached from the maintainer's network when last checked (not proof that it is down). `login` = content is gated. Tier: `S` first place to look, `A` strong, `B` niche or with a clear weakness.

## Illustrations

One style per product. Widely used free sets are instantly recognisable; restyle or use sparingly.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [unDraw](https://undraw.co) | Open-source flat illustrations recolourable to a brand hue | Set the brand colour on site before download; overused, so restyle or use sparingly | free · static · unDraw licence: free commercial use without attribution; no redistribution as a pack | S |
| [Open Peeps](https://www.openpeeps.com) | Mix-and-match hand-drawn people library | Compose characters from parts | free · static · CC0 | A |
| [Blush](https://blush.design) | Customisable illustration collections from many artists | Keep to one collection for consistency | freemium · static · login · Free tier with limits; paid for SVG and full access | A |
| [Open Doodles](https://www.opendoodles.com) | Loose sketchy illustration set with a colour generator | For informal, friendly tone | free · static · CC0 · archived | B |
| [Storyset](https://storyset.com) | Customisable and animatable illustration concepts | Attribution is mandatory on the free tier | freemium · static · Free requires attribution | B |
| [Absurd Design](https://absurd.design) | Surreal ink illustrations that stand out from flat-vector sameness | Use for brands that want an odd, human voice | freemium · static · Free set with attribution; membership for more | B |

## 3D

Models, materials and scenes. Check the runtime cost before embedding.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Poly Haven](https://polyhaven.com) | Public-domain HDRIs, PBR textures and models of high quality | API available; the default for lighting and materials | free · static · CC0 | S |
| [3dicons](https://3dicons.co) | Open-source 3D icons rendered in several angles and colours | PNG and Blender sources | free · static · CC0 | A |
| [Spline Community](https://community.spline.design) | Remixable interactive 3D scenes for the web | Inspect performance cost before embedding in a hero | freemium · static · login · Per-file, remix permissions vary | A |
| [ambientCG](https://ambientcg.com) | Public-domain PBR materials | Second source for textures | free · static · CC0 | A |

## Photography and video

Treat images consistently. Never use unlicensed images found online.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Unsplash](https://unsplash.com) | High-quality free photography | Avoid the most-used images; treat photos consistently | freemium · blocked · Unsplash licence: free commercial use, no resale of unaltered photos; Unsplash+ is paid | S |
| [Pexels](https://www.pexels.com) | Free photos and stock video with an API | Good for short background video | free · blocked · Pexels licence: free commercial use | A |
| [Coverr](https://coverr.co) | Stock video made for website backgrounds | Compress and provide a poster frame | freemium · static · Free licence for most clips | A |
| [Mixkit](https://mixkit.co) | Free video clips, music and UI sound effects | Source for subtle interface sounds | free · static · Mixkit licence per asset type | A |
| [Lummi](https://www.lummi.ai) | AI-generated stock imagery with consistent styles | Disclose synthetic imagery where it matters; check for artefacts | freemium · static · Free use; AI-generated | B |
| [Visual China Group (zh)](https://www.vcg.com) | Mainland China's dominant paid stock library | Never use unlicensed images found online in China-facing work; enforcement is active | paid · blocked · login · Rights-managed; known for strict enforcement | B |

## Mock-ups and screenshot tools

Clean frames usually present UI better than staged scenes.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Shots](https://shots.so) | Fast browser tool for device and browser mock-ups with good defaults | Drop a screenshot, pick a frame, export | freemium · static | S |
| [Pika](https://pika.style) | Screenshot beautifier and social-image templates | Quick product shots for marketing pages | freemium · static | A |
| [Mockuuups Studio](https://mockuuups.studio) | Thousands of photographic device scenes | Use sparingly; clean frames usually present UI better | freemium · static · login | A |
| [LS Graphics](https://www.ls.graphics) | High-end device and print mock-ups | For brand presentations | freemium · static · Per product; some free | A |
| [Rotato](https://rotato.app) | 3D device mock-up animator for product videos | For launch videos and store previews | paid · static | A |
| [MockUPhone](https://mockuphone.com) | Free flat device frames | Plain frames without scenery | free · static | B |

## Backgrounds, gradients, patterns and shaders

Often better recreated in code for control. Interpolate gradients perceptually and add grain against banding.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Haikei](https://haikei.app) | Generators for blobs, waves, layered peaks, blurry gradients, exported as SVG or PNG | Export SVG and tune the path in code | free · static · Generated assets are free to use | S |
| [fffuel](https://www.fffuel.co) | Collection of SVG generators: noise, grain, organic shapes, patterns, gradients | nnnoise and gggrain for texture; ooorganize for grids | free · static | S |
| [Paper Shaders](https://shaders.paper.design) | Zero-dependency shader components (mesh gradient, grain, dithering, warp) for React and vanilla JS | The cleanest way to ship a live shader background | free · static · Apache-2.0 | S |
| [Grainient](https://grainient.supply) | Grainy gradient backgrounds, animated gradients and shader tools | Use as art direction reference, then recreate in code for control | freemium · static · Per pack; free and paid | A |
| [Hero Patterns](https://heropatterns.com) | Repeatable SVG background patterns with colour controls | Keep opacity low; credit as required | free · static · CC BY 4.0 · archived | A |
| [Pattern Monster](https://pattern.monster) | Customisable SVG pattern generator | Export as CSS background or SVG | free · static | A |
| [ShaderGradient](https://shadergradient.co) | Moving 3D gradient customiser with React, Figma and Framer outputs | Export a still as the reduced-motion fallback | free · js · MIT | A |
| [Unicorn Studio](https://unicorn.studio) | No-code WebGL scene builder for hero effects | Check the runtime weight and pause off-screen | freemium · js · login | A |
| [Shadertoy](https://www.shadertoy.com) | Community of GLSL shaders; unmatched for learning techniques | Learn from it; do not copy a shader into commercial work without checking its licence | free · blocked · Default licence is CC BY-NC-SA unless the author states otherwise | A |
| [Grainy Gradients (CSS-Tricks)](https://css-tricks.com/grainy-gradients/) | The SVG-noise-plus-gradient technique for grain in pure CSS, explained step by step | Copy the feTurbulence filter; tune baseFrequency and contrast | free · blocked | A |
| [gradient.style](https://gradient.style) | Modern CSS gradient builder with colour-space interpolation and wide gamut | Interpolate in oklch or oklab to avoid grey dead zones | free · static | A |
| [Josh Comeau gradient generator](https://www.joshwcomeau.com/gradient-generator/) | Generates lush multi-stop gradients via perceptual colour modes | For browsers without in-oklch interpolation | free · static | A |
| [uiGradients](https://uigradients.com) | Named two- and three-stop gradients | Dated aesthetic; use as a quick starting point only | free · js · MIT · archived | B |
