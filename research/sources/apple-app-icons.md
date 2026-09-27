# Apple App Icons: Icon Composer, layered Liquid Glass icons, six appearances, sizes
- id: apple-app-icons · url: https://developer.apple.com/design/human-interface-guidelines/app-icons · fetched: 2026-09-27 · method: json-api + fetch
- review_by: 2026-12-26 · licence note: paraphrased digest, not a mirror
> 中文导语：从 2025 年起，苹果的 iPhone、iPad、Mac、Watch 应用图标都做成"分层的 Liquid Glass 图标"：设计软件里画平面图层，再到 Icon Composer 里加材质，标注 Default、Dark、Mono 三种，系统据此生成六种外观。画布是 1024 px，Apple Watch 是 1088 px。macOS 图标一律裁成圆角矩形。2026-06 推出 Icon Composer 2 beta，当前 Icon Composer 页面写明需要 macOS Tahoe 26.4 或更高。交付苹果图标前先看这份。

Read (2026-09-27): HIG `app-icons` (DocC JSON); developer docs `/documentation/xcode/creating-your-app-icon-using-icon-composer`,
`/documentation/xcode/configuring-your-app-icon`, `/documentation/technologyoverviews/adopting-liquid-glass#App-icons` (JSON); the Icon Composer page
https://developer.apple.com/icon-composer/ (HTML); https://developer.apple.com/design/whats-new/ and https://developer.apple.com/design/resources/ (HTML);
WWDC25 220 "Say hello to the new look of app icons" and 361 "Create icons with Icon Composer" (transcripts).

## Key facts
1. Change log: 2025-06-09 "Updated guidance to reflect layered icons, consistency across platforms, and best practices for Liquid Glass"; **2026-06-08 "Refined guidance for Liquid Glass"**. HIG What's new lists **"Download Icon Composer 2 beta" on 2026-06-08**. The first Icon Composer came out 2025-06-09, as a beta (WWDC25 361). [app-icons#Change-log; design/whats-new]
2. Layers [app-icons#Layer-design]:
   - iOS, iPadOS, macOS and watchOS icons have a **background layer plus one or more foreground layers**. The system renders them with Liquid Glass (specular highlights, refraction, translucency); the effects scale with icon size and can look different between OS versions.
   - tvOS icons have **2–5 layers** and use parallax.
   - visionOS icons have a background plus 1–2 layers and render as 3D. The asset catalog defaults to 3 layers, which is also the visionOS maximum; tvOS allows up to 5. [configuring-your-app-icon#Configure-the-layers-of-an-image-stack]
3. Workflow for iOS, iPadOS, macOS and watchOS:
   - Draw the foreground layers in any design tool, then import them into **Icon Composer**. It ships with Xcode (Xcode > Open Developer Tool > Icon Composer) or as a separate download.
   - In Icon Composer, set the background, place the layers, adjust effects, annotate **Default, Dark and Mono**, preview across OS versions, then save a **`.icon`** file.
   - In Xcode, set the target's App Icon name to the file name without the extension.
   - The `.icon` file replaces an existing `AppIcon` asset catalog. Xcode generates look-alike images for older OS releases at build time. To keep a different legacy icon on older releases, keep using the asset catalog.
   - tvOS and visionOS still use asset-catalog image stacks (Parallax Previewer / Exporter; `.lsr` and `.xlsr` files). [app-icons#Layer-design; creating-your-app-icon-using-icon-composer]
4. Canvas: **1024×1024 px for iPhone, iPad and Mac; 1088×1088 px for Apple Watch.** The watch canvas "overshoots our rounded rectangle" and uses the same grid, so artwork moves between platforms (WWDC25 220 and 361). Start from the App Icon Template on Apple Design Resources (listed in the iOS and iPadOS section, next to the iOS 27 UI Kit, in Figma, Sketch, and Photoshop/Illustrator). [creating-your-app-icon-using-icon-composer#Prepare-your-artwork-for-export]
5. Specifications table [app-icons#Specifications]:

| Platform | Layout shape → after mask | Size | Style | Appearances |
|---|---|---|---|---|
| iOS, iPadOS, macOS | square → rounded rectangle | 1024×1024 px | layered | default, dark, clear light, clear dark, tinted light, tinted dark |
| tvOS | landscape rectangle → rounded rectangle | 800×480 px | layered (parallax) | n/a |
| visionOS | square → circle | 1024×1024 px | layered (3D) | n/a |
| watchOS | square → circle | 1088×1088 px | layered | n/a |

   The system scales the icon down for smaller placements such as Settings and notifications. Colour spaces: sRGB, Gray Gamma 2.2, and Display P3 (Display P3 everywhere except visionOS).
6. Exporting layers [creating-your-app-icon-using-icon-composer#Prepare-your-artwork-for-export; app-icons#Layer-design]:
   - Prefer **SVG**. Use PNG for mesh gradients, raster art, or SVG features Icon Composer can't read.
   - **Convert text to outlines**, because SVG does not keep fonts.
   - Number the layer names from back to front.
   - Before export, strip blurs, shadows and specular/opacity/translucency settings, and **remove background colours and gradients**; you add those in Icon Composer.
   - Never export the mask. Provide **square, unmasked** layers: pre-masked layers weaken the specular highlight and make edges jagged.
7. Groups and effects in Icon Composer [creating-your-app-icon-using-icon-composer#Organize-layers-into-groups, #Apply-Liquid-Glass-effects-to-groups-and-layers]:
   - Organize layers into **at most four groups**; the groups become the depth layers the system renders.
   - A group's glass mode is **Individual** (each layer separately) or **Combined** (the group as one object).
   - Specular: **Off / Automatic (default) / Inside / Outside**. Groups also have Blur, **Refraction** (strength set on a 2D control), Translucency and Shadow (neutral by default; "chromatic" shadows spill artwork colour onto the background, per WWDC25 361).
   - Colour settings can vary per appearance and composition per platform.
   - **On OS versions earlier than 27, Inside/Outside only turn the specular highlight on, and Refraction has no visible effect.** The canvas toolbar can compare 26 and 27 rendering.
8. Appearances:
   - iOS, iPadOS and macOS offer default, dark, clear and tinted. With light and dark forms of clear and tinted, that makes **six appearances**.
   - The system generates any variant you don't provide.
   - In Icon Composer you annotate Default, Dark and Mono, and the **clear and tinted variants are derived from Mono**. Before 2025 the three annotations were light, dark and tinted.
   - watchOS has no appearance variants. [app-icons#Appearances; creating-your-app-icon-using-icon-composer#Preview-variants-of-your-app-icon; WWDC25 361]
9. Tinted modes, from WWDC25 220: "a dark tint that adds color to the foreground, and a light tint where the color gets directly infused into the glass". For Mono, make at least one element white, usually the most recognisable part; the other colours map to greys (WWDC25 361).
10. Design rules from the HIG [app-icons#Layer-design, #Design, #Visual-effects, #Appearances]:
    - Shapes:
      - Give foreground shapes **clearly defined edges, with no feathering**. Vary layer opacity to add depth.
      - Keep it simple, with few shapes. Filled, overlapping, semi-transparent shapes work best (an outlined ring is shown as incorrect).
      - Avoid very thin lines and sharp corners.
    - Content:
      - Use text only when it is essential (a first-letter mnemonic is acceptable, "Play" or "New" are not).
      - Prefer illustration to photos. Don't copy UI components or screenshots, and never show Apple hardware.
    - Background: a solid colour or a gradient set in Icon Composer. If you import one, it must be full-bleed and opaque.
    - Effects: **let the system add them**. There is no need to bake in specular highlights, drop shadows between layers, bevels, blurs or glows; if you do add custom effects, test them in Icon Composer, Device Hub or on a device so they don't clash with the system's.
    - Appearances:
      - Keep the same core features in every appearance.
      - Base the dark icon on the light one; coloured backgrounds give the most contrast in dark mode.
      - Alternate icons are possible on iOS, iPadOS, tvOS and in compatible apps on visionOS. On iOS and iPadOS each alternate icon needs its own dark, clear and tinted variants, and all alternate and variant icons go through App Review.
11. From WWDC25 220:
    - Use the **System Light / System Dark gradients** instead of pure white or black backgrounds.
    - Soft light-to-dark gradients match the light direction best.
    - Prefer frontal, flatter views over realistic 3D perspective.
    - Use bolder line weights so detail survives at small sizes.
12. Shape and mask [app-icons#Icon-shape]:
    - iOS, iPadOS and macOS icons are square; the system masks them to a rounded rectangle that matches other UI curvature and the device bezel.
    - tvOS icons are rectangles with concentric corners.
    - visionOS and watchOS icons are masked to a circle.
    - Keep main content centred, especially for circular icons.
    - The 2025 grid is "simpler and more evenly spaced" with a **rounder corner radius**, and circular artwork has its own frame in the grid (WWDC25 220).
13. **macOS no longer allows free-form icons.** "The canvas shape now acts as a mask."
    - Existing Mac icons that are roughly rounded rectangles are masked or extended automatically.
    - For an irregular icon, the system removes its drop shadow and **scales the artwork down into the rounded-rectangle canvas** on a system-supplied background. Apple recommends redrawing to use the full canvas (WWDC25 220).
    - Adopting Liquid Glass: "Irregularly shaped icons receive a system-provided background." [adopting-liquid-glass#App-icons]
14. Platform notes: tvOS needs a safe zone, because focus crops foreground layers more than the background. visionOS: no background shape that looks like a hole or dent. watchOS: **no black background**; lighten it so it doesn't merge with the display. [app-icons#Platform-considerations]
15. The Icon Composer page (current text; the page names no version number) [developer.apple.com/icon-composer/]:
    - Refraction is set per layer, "from a subtle edge bend to lens-like distortion".
    - Specular highlights have been redone: inside, outside or automatic (chosen from layer colour), with **"a new, vertical light angle [that] shines from above"**.
    - Imported `.icon` files render with the new, sharper material automatically.
    - Platforms share enclosure shapes and one grid.
    - It exports a flattened icon for marketing use.
    - "Requires macOS Tahoe 26.4 or later."
16. The legacy asset-catalog route still works:
    - For iOS, iPadOS, tvOS and watchOS, a single 1024×1024 image can generate all sizes. Yet the same doc also says "For macOS and tvOS, you need to supply an asset for each size", so it contradicts itself on tvOS.
    - On iOS, appearances are Any, Dark and Tinted: supply the tinted icon as **greyscale** and the dark icon with a **transparent background**.
    - The App Store icon well is iOS 1024 pt, or "App Store – 2x" on macOS. [configuring-your-app-icon]

## What it changes for the skills
- skills/design-studio/references/disciplines/app-icons.md: The Apple section should use facts 2–16. Correct the current text in `skills/design-icons/references/app-icons-and-favicons.md:25`: watchOS is 1088×1088, not 1024; there are six appearances (default, dark, clear light, clear dark, tinted light, tinted dark); the annotations are Default, Dark and Mono; the deliverable is a `.icon` file plus SVG layer sources; at most four groups; no feathering; no masks; the current Icon Composer download needs macOS Tahoe 26.4 or later (see open items).
- skills/design-studio/references/process/handoff.md: Icon handoff = layered SVG/PNG sources named back to front, the `.icon` file, a Default/Dark/Mono annotation note, a flattened 1024 marketing export, and a separate watch canvas check at 1088.
- skills/design-studio/references/disciplines/brand.md: The icon must survive mono, clear and tinted rendering. Test the mark in a white-on-grey mono version early.
- skills/design-studio/references/fundamentals/anti-slop.md: Signs of a pre-2025 icon: baked-in glass or highlights, drop shadows, text labels, photos, feathered edges, a pure white or black background, macOS icons that break the rounded rectangle.
- skills/critique-design/references/heuristics.md: Icon checks: readable at small sizes in mono and tinted; core features the same across appearances; content centred for the circular watch mask.
- skills/design-studio/assets/mockup-kit/kit.json: Icon mask shapes per platform. Don't draw a custom glass effect on icons in mockups; mark them as "system-rendered".

## Not verified / open
- The exact corner-radius and grid geometry of the 2025 rounded rectangle (it is in the templates, which were not opened). Don't invent a superellipse formula.
- Whether Icon Composer 2 is still in beta on 2026-09-27. The page doesn't say "beta" and no general-release date was found. The macOS 26.4 requirement comes from the current Icon Composer page, while the Icon Composer download on the Apple Design Resources page still says "Requires macOS Sequoia or later" (possibly the older version); which build each link serves was not checked.
- The HIG no longer publishes the list of sizes the system generates (Settings, Spotlight, notifications) in pt, and none was found in the primary sources read.
- The tvOS safe-zone size and visionOS layer depth were not checked numerically.
