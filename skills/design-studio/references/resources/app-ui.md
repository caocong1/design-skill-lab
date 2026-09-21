<!-- Generated from catalog/resources.jsonl by scripts/build-catalog.py. Do not edit by hand. -->
# Resources: Product UI

What actually ships: screens and flows from real products, component references, official platform guidelines, published design systems, data visualisation and AI product patterns. Prefer these over concept shots for anything users will operate daily.

Access reads `cost · agent access · licence`. Agent access: `static` = a plain web fetch can read it; `js` = needs a real browser; `blocked` = bot protection or a login wall, send the user the link instead; `unknown` = could not be reached from the maintainer's network when last checked (not proof that it is down). `login` = content is gated. Tier: `S` first place to look, `A` strong, `B` niche or with a clear weakness.

## Real-product screens and flows

Look up the screen type or flow in several shipped products before designing it. Convention is a feature.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Mobbin](https://mobbin.com) | Largest library of real app screens and flows across iOS, Android and web, searchable by screen type, UI element and flow | Free tier is small and needs sign-in; filter by platform then Screens, UI Elements or Flows (onboarding, checkout, settings) | freemium · static · login | S |
| [Refero](https://refero.design) | Real product screens for web apps and iOS, searchable by page type, pattern and element; strong for SaaS | Search a page type (billing, empty state, table, command palette); partial access without paying | freemium · js · login | S |
| [Page Flows](https://pageflows.com) | Recorded user flows (video plus annotated screenshots) for onboarding, upgrading, cancelling and more | Mostly paywalled; use when the sequence, not a screen, is the question | paid · static · login | A |
| [Nicelydone](https://nicelydone.club) | SaaS web-app screens and flows sorted by component and page | Browse by page (dashboard, settings, onboarding) or by component | freemium · blocked | A |
| [SaaSFrame](https://www.saasframe.io) | SaaS UI by category: dashboards, settings, modals, tables, emails, plus landing pages | Use the category index; part of the library is behind a paid plan | freemium · static | A |
| [UI Notes (zh)](https://uinotes.com) | Screens and flows of Chinese apps; the closest equivalent to Mobbin for the domestic market | Browse by app or by pattern to see what mainland users are used to | freemium · static | A |
| [Really Good UX](https://goodux.appcues.com) | Annotated examples of good product UX moments, strongest on onboarding and activation | Filter by pattern; each example explains why it works | free · static | A |
| [Deceptive Patterns](https://www.deceptive.design) | Taxonomy and hall of shame of manipulative patterns, with legal cases | Check a growth idea against the types list before shipping it | free · static | A |
| [ScreensDesign](https://screensdesign.com) | Mobile app flows as videos with onboarding and paywall focus | Use for subscription-app onboarding and paywall sequences; /store-screenshots/ holds App Store screenshot designs (it absorbed Scrnshts) | freemium · static | B |
| [Paywall Screens](https://www.paywallscreens.com) | Paywall screens from subscription apps | Compare plan layout, trial framing and legal text placement | free · static | B |
| [UserOnboard](https://www.useronboard.com) | Step-by-step onboarding teardowns with commentary | Read one teardown before designing a first-run experience | free · unknown · slow | B |
| [Collect UI](https://collectui.com) | Concept shots grouped by component or screen type; pretty but unshipped - check against real-product libraries | Use only for visual treatment ideas | free · static | B |

## Component references

Anatomy, naming, states and keyboard behaviour of a component across systems.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [The Component Gallery](https://component.gallery) | Every common UI component with its names and implementations across dozens of design systems, linked to their docs and code | Open /components/<name> to compare anatomy, naming and behaviour across systems; /design-systems lists the sources | free · static | S |
| [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/) | Canonical keyboard interaction and ARIA roles for each widget pattern (combobox, menu, tabs, dialog) | Read the pattern page before specifying any custom interactive component | free · blocked | S |
| [Checklist Design](https://www.checklist.design) | Checklists of what a component, page or flow must include | Run the relevant checklist against a design before hand-off | free · js | A |
| [UI Guideline](https://www.uiguideline.com) | Component standards synthesised from many design systems: anatomy, properties, states | Use for naming parts and listing states | free · static | A |
| [Open UI](https://open-ui.org) | W3C community research on component anatomy, naming and behaviour across systems | Use the component matrix when naming parts or states | free · static | A |
| [Inclusive Components](https://inclusive-components.design) | Accessible component patterns explained in depth (toggles, menus, tabs, cards, notifications) | Read the matching article before building the component | free · static · archived | A |
| [UI Playbook](https://uiplaybook.dev) | Documented collection of component best practices | Quick reminder of do and don't per component | free · static · slow | B |

## Platform guidelines and standards

Authoritative and versioned. Check the current page before relying on a remembered number.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) | Filterable list of every WCAG 2.2 success criterion with techniques | Filter to Level A and AA; cite criterion numbers in critiques | free · blocked | S |
| [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) | Authoritative conventions for every Apple platform, including the current Liquid Glass material, layout, typography, navigation and app icons | The site is a JS app: use a browser tool; read the platform page first, then the component pages | free · js | S |
| [Material Design 3](https://m3.material.io) | Google's system including M3 Expressive: colour roles and dynamic colour, type scale, shape, motion, adaptive layout, components | JS app: use a browser tool; Foundations then Styles then Components | free · js | S |
| [HarmonyOS Design (zh)](https://developer.huawei.com/consumer/cn/design/) | Official HarmonyOS guidelines: multi-device adaptive layout, HarmonyOS Sans, icons, motion, colour, plus resource downloads | Read the multi-device (one design, many devices) and layout pages first | free · js | S |
| [WeChat Mini Program Design Guidelines (zh)](https://developers.weixin.qq.com/miniprogram/design/) | Official mini-program rules: navigation and the capsule button, feedback, touch targets, typography and colour | Mandatory before designing any mini-program screen | free · static | S |
| [Apple Design Resources](https://developer.apple.com/design/resources/) | Official UI kits, device bezels, SF Symbols app, Icon Composer and fonts | Download the kit for the target OS version | free · static · Apple licence: for designing apps for Apple platforms | A |
| [Android design guidance](https://developer.android.com/design) | Platform specifics Material does not cover: system bars, edge-to-edge, large screens and foldables, widgets, Wear, TV, XR | Open /design/ui/<surface> | free · js | A |
| [Fluent 2](https://fluent2.microsoft.design) | Microsoft's cross-platform design system: tokens, components, motion, accessibility | Use for Microsoft-ecosystem products | free · static | A |
| [Windows app design](https://learn.microsoft.com/en-us/windows/apps/design/) | Desktop conventions for Windows 11 apps: title bar, navigation view, materials, typography, input | Read before designing an Electron or Tauri app that should feel native on Windows | free · static | A |
| [Alipay Mini Program design (zh)](https://opendocs.alipay.com/mini/design) | Alipay's mini-program design specification and component guidance | Use with the WeChat guideline when shipping to both | free · js | A |
| [Command Line Interface Guidelines](https://clig.dev) | Human-first principles for CLI design: output, errors, help, flags, interactivity | Use when the product surface is a terminal | free · static | A |
| [GNOME HIG](https://developer.gnome.org/hig/) | Clear, compact desktop-application guidelines; good general desktop advice even off Linux | Patterns section | free · static | B |
| [Flutter UI design docs](https://docs.flutter.dev/ui/design) | How Material and Cupertino are expressed in Flutter, adaptive and responsive guidance | Pair with the platform guideline for the target OS | free · static | B |

## Published design systems

Read the pattern and content guidance, not just the components. Pick a system from a comparable domain.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Carbon Design System](https://carbondesignsystem.com) | IBM's system: the best public reference for dense enterprise UI, data tables, data visualisation and AI labelling | Read Patterns, Data visualization and Carbon for AI | free · static · Apache-2.0 | S |
| [GOV.UK Design System](https://design-system.service.gov.uk) | Research-backed patterns for forms, errors and step-by-step services; the gold standard for clarity and accessibility | Read Patterns (ask users for..., check answers, error messages) | free · static · MIT | S |
| [Ant Design (zh)](https://ant.design) | The de facto standard for Chinese enterprise admin products: design values, layout, data entry, data display, feedback, plus the component library | Read /docs/spec/introduce-cn for the design spec; theme through ConfigProvider tokens | free · static · MIT | S |
| [Atlassian Design System](https://atlassian.design) | Well-documented tokens, components and content guidance for complex product suites | Foundations and Content sections | free · static | A |
| [Shopify Polaris](https://shopify.dev/docs/api/polaris) | Shopify's admin UI system, now delivered as web components; still a reference for merchant-admin patterns and content guidance | polaris.shopify.com now redirects here; the legacy React site polaris-react.shopify.com keeps the older content and pattern guidance | free · static | A |
| [GitHub Primer](https://primer.style) | Developer-tool UI: navigation, lists, code-adjacent components, accessibility notes per component | Use for dev-tool products | free · static · MIT | A |
| [Adobe Spectrum](https://spectrum.adobe.com) | System for professional creative tools; strong on density, colour and international typography | See also Spectrum 2 at s2.spectrum.adobe.com | free · js | A |
| [Vercel Geist](https://vercel.com/geist/introduction) | Vercel's minimal system: colours, typography, grid, icons, components | Reference for restrained developer-product UI | free · static | A |
| [AWS Cloudscape](https://cloudscape.design) | Patterns for complex cloud consoles: resource tables, create flows, dashboards, generative-AI patterns | Read Patterns for table views, wizards and GenAI | free · static · Apache-2.0 | A |
| [GitLab Pajamas](https://design.gitlab.com) | Fully open design system with unusually candid usage guidance, including AI-human interaction | Usability and Patterns sections | free · static · MIT | A |
| [U.S. Web Design System](https://designsystem.digital.gov) | Accessible public-sector components, tokens and patterns | Use for trust-first, regulated contexts | free · static | A |
| [Wise Design](https://wise.design) | A modern consumer-fintech system with strong brand expression and content guidelines | Reference for expressive yet usable consumer product UI | free · static | A |
| [Arco Design (zh)](https://arco.design) | ByteDance's enterprise system with design guidelines and a style-customisation platform | Alternative to Ant Design with a lighter visual tone | free · js · MIT | A |
| [Semi Design (zh)](https://semi.design) | Douyin's design system with design-to-code tooling and theme store | Reference for content-platform back offices | free · static · MIT | A |
| [TDesign (zh)](https://tdesign.tencent.com) | Tencent's system spanning web, mobile, mini-program and Flutter with shared design values | Pick when one product must ship across web, mini-program and Flutter | free · js · MIT | A |
| [Design Systems Repo](https://designsystemsrepo.com/design-systems/) | Directory of public design systems with links to their docs, code and tools | Find a system from a comparable industry | free · static | A |
| [Astro UX Design System](https://www.astrouxds.com) | Design system for space-operations consoles: status semantics, dark control-room UI, monitoring patterns | Reference for operations centres, monitoring walls and digital-twin consoles | free · static | B |
| [Siemens Industrial Experience](https://ix.siemens.io) | Open industrial design system for plant and device software | Reference for industrial and IoT applications | free · js · MIT | B |

## Data visualisation, dashboards and big-screen

Choose the chart from the question being asked; study dashboard genres before laying one out.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [FT Visual Vocabulary](https://ft-interactive.github.io/visual-vocabulary/) | Chart chooser organised by the relationship in the data (deviation, correlation, ranking, distribution, change over time, part-to-whole, spatial, flow) | Pick the relationship first, then the chart | free · js | S |
| [From Data to Viz](https://www.data-to-viz.com) | Decision tree from data type to chart, with a caveats section on common mistakes | Read the Caveats page before finalising any chart | free · static | S |
| [Apache ECharts examples](https://echarts.apache.org/examples/en/index.html) | Runnable gallery of every chart type in the library most Chinese dashboards are built with | Open an example, edit the option live, copy the config | free · static · Apache-2.0 | S |
| [Data Viz Project](https://datavizproject.com) | Large catalogue of chart types filterable by function, input and shape | Use to find a less obvious chart form | free · static | A |
| [Dataviz Inspiration](https://www.dataviz-inspiration.com) | Curated real-world data visualisations filterable by chart type | Look at how professionals annotate and label | free · js | A |
| [Dashboard Design Patterns](https://dashboarddesignpatterns.github.io) | Research-based taxonomy of dashboard structures, page layouts, interactions and genres | Use to choose a dashboard genre and layout before drawing | free · static | A |
| [AntV (zh)](https://antv.antgroup.com) | Ant Group's visualisation stack (statistical charts, graphs, maps) with design principles for data graphics | Read the design principles, then the G2, G6 or L7 galleries | free · js · MIT | A |
| [Carbon data visualization](https://carbondesignsystem.com/data-visualization/getting-started/) | Practical rules for enterprise charts: colour palettes, axes, legends, dashboards, accessibility | Use the colour palette and dashboard pages | free · static | A |
| [Material 2 data visualization](https://m2.material.io/design/communication/data-visualization.html) | Still one of the clearest overviews of chart selection, style, behaviour and dashboard layout | Read once as a primer | free · js · archived | A |
| [Chartability](https://chartability.fizz.studio) | Audit heuristics for accessible data visualisation | Run on any chart that carries critical information | free · static | A |
| [Datawrapper blog and academy](https://www.datawrapper.de/blog) | Working knowledge on chart design, especially colour for data | Read the colour series | free · static | A |
| [Information is Beautiful Awards](https://www.informationisbeautifulawards.com) | Award showcase for ambitious visualisation and infographics | Use for editorial-grade data storytelling | free · static | A |
| [Alibaba Cloud DataV (zh)](https://datav.aliyun.com/portal) | The reference product for Chinese big-screen (data wall) dashboards; templates show prevailing conventions | Study layout conventions, then avoid the neon-glow cliche | freemium · js · login | A |
| [Grafana dashboards](https://grafana.com/grafana/dashboards/) | Thousands of real operations dashboards; shows what on-call engineers actually use | Compare with play.grafana.org for live behaviour | free · static | B |
| [EasyV (zh)](https://easyv.cloud) | Big-screen and digital-twin case library | Second source for data-wall layouts | freemium · static · login | B |

## AI product UX

Patterns for chat, copilots and agents. This field moves quickly: date what you take.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Shape of AI](https://www.shapeof.ai) | Pattern library for AI product UX: wayfinders, inputs, tuners, governors, trust indicators, identifiers, with real examples | Pick the pattern family, read examples and the when-to-use notes | free · static | S |
| [People + AI Guidebook](https://pair.withgoogle.com/guidebook) | Google PAIR's research-based guidance: mental models, explainability and trust, feedback and control, errors and graceful failure | Use the chapter worksheets during the brief | free · js | S |
| [Microsoft HAX Toolkit](https://www.microsoft.com/en-us/haxtoolkit/) | Eighteen guidelines for human-AI interaction with a design library of examples and a planning workbook | Use the guidelines as a review checklist for AI features | free · static | A |
| [Aiverse](https://www.aiverse.design) | Library of AI interaction examples from shipped products, organised by pattern | Browse by interaction type to see current conventions | freemium · static | A |
| [Carbon for AI](https://carbondesignsystem.com/guidelines/carbon-for-ai/) | How an enterprise system marks AI-generated content and exposes explainability | Reference for AI labels and explainability popovers | free · static | A |
| [Cloudscape generative AI patterns](https://cloudscape.design/gen-ai/patterns/generative-ai-chat/) | Concrete patterns for generative-AI chat, loading states, output labelling and user-authorised actions | Use when adding an assistant to an enterprise console | free · static | A |
| [Apple HIG: Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai) | Apple's guidance on designing generative-AI features responsibly | Read with the platform's writing and privacy pages | free · js | A |
| [Ant Design X (zh)](https://x.ant.design) | AI-interface component system with a published design paradigm for roles, intention, conversation and hybrid UI | Read the design section before composing a chat UI from the components | free · static · MIT | A |
| [OpenAI Apps SDK design guidelines](https://developers.openai.com/apps-sdk/concepts/design-guidelines) | Rules for UI that lives inside a chat host: inline cards, carousels, fullscreen, tone | Perishable; relevant when building inside an assistant surface | free · static | B |

## Details and out-of-category sources

Game HUDs, fictional interfaces and small delights - for immersive, full-screen and one-memorable-moment problems.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Game UI Database](https://www.gameuidatabase.com) | Tens of thousands of game screens filterable by screen type, controls, style, colour and layout; superb for HUDs, overlays and information-dense full-screen UI | Filter by screen type (HUD, map, inventory, skill tree) for data-wall and immersive ideas | free · blocked | S |
| [Interface In Game](https://interfaceingame.com) | Game interface screenshots and videos by title and element | Use videos for HUD motion behaviour | free · js | A |
| [Design Spells](https://www.designspells.com) | Small delightful details and easter eggs from shipped products, as short videos | Use when a product needs one memorable moment | free · blocked | A |
| [HUDS+GUIS](https://www.hudsandguis.com) | Fantasy UI from film, TV and games | Reference for cinematic control-room aesthetics, with a usability pinch of salt | free · static · slow | B |
| [Sci-fi Interfaces](https://scifiinterfaces.com) | Critical analysis of fictional interfaces: what would and would not work | Read before borrowing an idea from a film UI | free · static · slow | B |
| [Little Big Details](https://littlebigdetails.com) | Archive of thoughtful small UI details | Skim for ideas that cost little to build | free · blocked · archived | B |
