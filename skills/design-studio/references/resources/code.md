<!-- Generated from catalog/resources.jsonl by scripts/build-catalog.py. Do not edit by hand. -->
# Resources: Code and open-source projects

The agent's design medium is code. These are the projects to know: other AI design skills and bridges, component libraries and primitives by stack, animation and graphics libraries, token tooling, and the pipeline that turns HTML, SVG and markup into images, PDFs and slides. Verify APIs against the installed version.

Access reads `cost · agent access · licence`. Agent access: `static` = a plain web fetch can read it; `js` = needs a real browser; `blocked` = bot protection or a login wall, send the user the link instead; `unknown` = could not be reached from the maintainer's network when last checked (not proof that it is down). `login` = content is gated. Tier: `S` first place to look, `A` strong, `B` niche or with a clear weakness.

## AI design skills, formats and agent tooling

Prior art for this suite, the DESIGN.md format, and the tools that give an agent eyes and access to design files.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Anthropic frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Anthropic's own short skill for distinctive front-end aesthetics: commit to a bold direction, avoid generic AI looks, mind typography, colour, motion, composition | Read it as the minimal baseline any design skill must beat; companion blog post at claude.com/blog/improving-frontend-design-through-skills | free · static · See repository licence | S |
| [DESIGN.md specification](https://stitch.withgoogle.com/docs/design-md/specification) | Google Labs' open format for describing a design system to AI agents in one Markdown file | Emit DESIGN.md in this shape so other agents and Stitch can consume it | free · js · Apache-2.0 (github.com/google-labs-code/design.md) | S |
| [Impeccable](https://impeccable.style) | One design skill with 24 commands (shape, critique, audit, polish, distill, bolder, quieter, harden, animate...), a PRODUCT.md that records durable product truth, live in-browser variant iteration, and 61 deterministic detector rules that flag AI-design tells without an LLM | Study the command vocabulary and the no-LLM detector rules; both ideas transfer to any design workflow | free · static · Apache-2.0 (github.com/pbakaus/impeccable) | S |
| [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines) | Concise, opinionated rules for interactions, animation, layout, content, forms, performance and design, shipped with an agent-readable file | Use AGENTS.md from the repo as a review checklist for web UI | free · static · MIT (github.com/vercel-labs/web-interface-guidelines) | S |
| [Chrome DevTools MCP](https://developer.chrome.com/docs/devtools/agents) | Gives an agent a real Chrome: screenshots, DOM, computed styles, performance traces | The eyes for the render-and-look loop | free · static · Apache-2.0 | S |
| [awesome-design-md](https://getdesign.md) | Collection of DESIGN.md files describing the visual systems of well-known products | Use as style-DNA study material, never as a licence to clone a brand | free · static · MIT (github.com/VoltAgent/awesome-design-md); brands belong to their owners | A |
| [taste-skill](https://tasteskill.dev) | Popular anti-slop front-end skill: brief inference, three dials (variance, motion, density), real design systems, pre-flight check | Borrow the design-read and dial ideas; scope is landing pages and portfolios only | free · static · MIT (github.com/Leonxlnx/taste-skill) | A |
| [UI UX Pro Max](https://www.uupm.cc) | Searchable CSV knowledge base of styles, palettes, font pairings and UX rules with a design-system generator | Useful as a lookup table; its recommendations are generic without a real brief | free · static · MIT (github.com/nextlevelbuilder/ui-ux-pro-max-skill) | A |
| [Stitch skills](https://github.com/google-labs-code/stitch-skills) | Agent skills for Google Stitch: prompt enhancement, DESIGN.md synthesis, screen generation through MCP | Use when a Stitch MCP server is available for fast visual variants | free · static · Apache-2.0 | A |
| [Figma MCP server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Dev-Mode-MCP-Server) | Official bridge exposing Figma frames, variables and components to coding agents | Use when the source of truth is a Figma file | paid · static · login | A |
| [Framelink Figma MCP](https://www.framelink.ai) | Community MCP server that gives agents simplified Figma layout data | Alternative when the official server is unavailable | free · static · MIT (github.com/GLips/Figma-Context-MCP) | A |
| [shadcn/ui registry and MCP](https://ui.shadcn.com/docs/mcp) | Lets agents browse and install components from shadcn-compatible registries | Install real components instead of hallucinating them | free · static · MIT | A |
| [tweakcn](https://tweakcn.com) | Visual theme editor for shadcn/ui with exportable CSS variables | The quickest way to move a shadcn project off its default look | free · js · Apache-2.0 | A |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | Browser automation for agents through Playwright | Alternative eyes; good for multi-viewport captures | free · static · Apache-2.0 | A |
| [UI Skills](https://www.ui-skills.com) | Opinionated constraint lists for agents building interfaces | Compare its constraints with your own rules | free · static · MIT (github.com/ibelick/ui-skills) | B |
| [interface-design](https://interface-design.dev) | Skill focused on keeping design decisions consistent across sessions for dashboards and apps | Idea worth borrowing: persist decisions in a system file | free · static · MIT (github.com/Dammyjay93/interface-design) | B |
| [Superdesign](https://superdesign.dev) | Open-source design agent that lives in the IDE and generates UI variants side by side | Reference for the parallel-variants workflow | free · js · See repository (github.com/superdesigndev/superdesign) · slow | B |
| [21st.dev Magic MCP](https://21st.dev/mcp) | MCP that generates UI components from a community library | Treat output as a draft to be restyled with the project's tokens | freemium · static · login · ISC (github.com/21st-dev/magic-mcp) | B |

## Component libraries and headless primitives

Use the host project's library. When choosing, prefer accessible primitives and a real theme API.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [shadcn/ui](https://ui.shadcn.com) | Copy-in React components on accessible primitives; the code lives in your repo | Never ship the default theme; retheme through CSS variables | free · static · MIT | S |
| [Ant Design (React) (zh)](https://ant.design/components/overview) | The enterprise React library behind most Chinese admin systems; themable through design tokens | Theme with ConfigProvider tokens and algorithms, not CSS overrides | free · static · MIT | S |
| [Radix Primitives](https://www.radix-ui.com/primitives) | Unstyled accessible primitives for React | Behaviour layer under a custom design | free · static · MIT | A |
| [Base UI](https://base-ui.com) | Unstyled component library from the Radix, Floating UI and MUI authors; now stable | Modern default for headless React components | free · static · MIT | A |
| [React Aria](https://react-aria.adobe.com) | Adobe's headless components with the deepest accessibility and internationalisation work | Choose when a11y and i18n requirements are strict | free · static · Apache-2.0 | A |
| [Ark UI](https://ark-ui.com) | Headless components for several frameworks built on state machines | One behaviour layer across React, Vue and Solid | free · static · MIT | A |
| [Reka UI](https://reka-ui.com) | The Radix equivalent for Vue | Headless base for custom Vue design systems | free · static · MIT | A |
| [shadcn-vue](https://www.shadcn-vue.com) | Vue port of shadcn/ui | Copy-in components for Vue and Nuxt | free · static · MIT | A |
| [Nuxt UI](https://ui.nuxt.com) | Full component library for Vue and Nuxt with a token-based theme | Fast start for Nuxt apps | free · static · MIT | A |
| [Mantine](https://mantine.dev) | Large, well-documented React component and hooks library | Pragmatic choice for internal tools | free · static · MIT | A |
| [Ant Design Vue (zh)](https://antdv.com) | Vue implementation of Ant Design | For Vue admin systems | free · js · MIT | A |
| [Element Plus (zh)](https://element-plus.org) | The most common Vue 3 admin component library in China | Theme through CSS variables and SCSS variables | free · static · MIT | A |
| [Naive UI (zh)](https://www.naiveui.com) | Vue 3 library with a strong TypeScript theme-override system | Cleaner default look than most admin kits | free · blocked · MIT | A |
| [Vant (zh)](https://vant.pro/vant/) | Lightweight mobile Vue components with a WeChat mini-program edition | Default for mobile H5 in the Chinese ecosystem | free · js · MIT | A |
| [TDesign components (zh)](https://tdesign.tencent.com/vue-next/overview) | One design language across Vue, React, mini-program, mobile and Flutter | Pick when web, mini-program and Flutter must match | free · js · MIT | A |
| [Forui](https://forui.dev) | Minimalist, platform-agnostic Flutter widget library | A way out of stock Material look in Flutter | free · static · See repository licence | A |
| [Tremor](https://tremor.so) | React components for dashboards and charts | Quick analytical UI; restyle the defaults | free · static · Apache-2.0 · slow | A |
| [Vercel AI Elements](https://elements.ai-sdk.dev) | Components for AI interfaces: conversation, message, reasoning, sources, tool calls, prompt input | Start chat UI from these rather than from scratch | free · static · See repository licence | A |
| [HeroUI](https://www.heroui.com) | Polished React components on Tailwind and React Aria | Attractive defaults; customise to avoid the recognisable look | free · static · Apache-2.0 | B |
| [shadcn_flutter](https://sunarya-thito.github.io/shadcn_flutter/) | shadcn-style component set for Flutter | Alternative Flutter look | free · js · BSD-3-Clause | B |
| [React Native Reusables](https://reactnativereusables.com) | shadcn/ui approach for React Native | Shared look between web and native | free · js · MIT | B |
| [prompt-kit](https://www.prompt-kit.com) | shadcn-style building blocks for AI apps | Alternative to AI Elements | free · static · MIT · slow | B |

## Animated and marketing component kits

Technique references. A page assembled from these looks like every other; use one signature moment and restyle it.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Magic UI](https://magicui.design) | Animated marketing components (marquees, beams, bento, text effects) for shadcn projects | Use one or two with intent; a page made of these looks like every other | freemium · static · MIT for the open set | A |
| [React Bits](https://reactbits.dev) | Large set of animated text, backgrounds and interactive components | Good for a single signature moment | free · js · See repository licence | A |
| [Motion Primitives](https://motion-primitives.com) | Tasteful, restrained animated primitives built on Motion | Closer to product UI needs than the flashier kits | free · static · MIT | A |
| [Aceternity UI](https://ui.aceternity.com) | Eye-catching effect components; instantly recognisable as a template | Use as a technique reference, restyle heavily | freemium · static | B |
| [Animate UI](https://animate-ui.com) | Animated versions of common components | Reference for state-transition polish | free · js · See repository licence · slow | B |
| [Inspira UI](https://inspira-ui.com) | Animated components for Vue and Nuxt, inspired by the React kits | The Vue route to those effects | free · js · MIT | B |

## Animation, graphics and chart libraries

Match the tool to the job; check licences for commercial use.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Motion](https://motion.dev) | The standard animation library for the web (formerly Framer Motion): springs, gestures, layout and scroll animation | Import from motion/react in React; check the installed major version | free · static · MIT | S |
| [GSAP](https://gsap.com) | Timeline-based animation platform with ScrollTrigger, SplitText, MorphSVG | Best for sequenced, scroll-driven storytelling | free · js · GSAP standard no-charge licence (free including former Club plugins); not OSI open source | S |
| [three.js](https://threejs.org) | The WebGL 3D library | With react-three-fiber and drei in React projects | free · static · MIT | S |
| [Apache ECharts](https://echarts.apache.org) | Full-featured charting library dominant in Chinese dashboards and big-screen projects | Define a theme object once; avoid per-chart styling | free · static · Apache-2.0 | S |
| [Anime.js](https://animejs.com) | Lightweight animation engine with timelines, staggering and SVG support (v4 rewrite) | Dependency-light alternative to GSAP | free · static · MIT | A |
| [lottie-web and dotLottie](https://lottiefiles.com/dotlottie) | Players for After Effects-authored vector animation | Prefer the dotLottie player for size and features | free · blocked · MIT | A |
| [Rive runtimes](https://rive.app/docs/runtimes/getting-started) | Runtimes to play interactive Rive files on every platform | One animation asset across web, Flutter and native | free · static · MIT | A |
| [AutoAnimate](https://auto-animate.formkit.com) | One-line automatic transitions for list and layout changes | Cheap polish for admin UIs | free · static · MIT | A |
| [react-three-fiber](https://r3f.docs.pmnd.rs) | React renderer for three.js with the drei helper library | Declarative 3D scenes and digital-twin views | free · js · MIT | A |
| [D3](https://d3js.org) | Low-level toolkit for bespoke data visualisation | Use Observable Plot for standard charts, D3 for custom ones | free · static · ISC | A |
| [Remotion](https://www.remotion.dev) | Programmatic video in React: motion graphics and product videos from code | Check the company licence threshold before commercial use | freemium · static · Remotion licence: free for individuals and small teams, paid company licence above a threshold | A |
| [p5.js](https://p5js.org) | Creative-coding library for generative visuals | Generative posters and backgrounds | free · static · LGPL-2.1 | A |
| [Lenis](https://lenis.dev) | Smooth-scroll library used on many award sites | Use cautiously: scroll hijacking has accessibility costs | free · static · MIT | B |
| [Theatre.js](https://www.theatrejs.com) | Visual sequencer for choreographing code-driven animation | For cinematic hero sequences | free · static · Apache-2.0 · slow | B |
| [Motion Canvas](https://motioncanvas.io) | Code-driven animation for explainer videos | Open alternative for diagrammatic animation | free · static · MIT · slow | B |

## Design tokens and colour tooling

One token source, built to every platform.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Design Tokens Format (DTCG)](https://www.designtokens.org) | The W3C community group's specification for interoperable design-token files | Follow the current stable version for tokens.json | free · static | S |
| [Style Dictionary](https://styledictionary.com) | Transforms token files into CSS, iOS, Android, Flutter and more | The default token build tool; supports DTCG syntax | free · static · Apache-2.0 | S |
| [Terrazzo](https://terrazzo.app) | DTCG-native token toolchain with linting and plugins | Lighter alternative to Style Dictionary | free · static · MIT | A |
| [Tokens Studio](https://tokens.studio) | Figma plugin to author tokens and sync them to Git | Bridge when designers live in Figma | freemium · static · login · MIT for the plugin | A |
| [Open Props](https://open-props.style) | Expertly tuned CSS custom properties: sizes, easings, shadows, gradients, colours | Borrow its easing and shadow scales | free · static · MIT | A |
| [Material Color Utilities](https://github.com/material-foundation/material-color-utilities) | HCT colour space, tonal palettes and dynamic schemes in TS, Dart, Java, Swift | Generate Material schemes in build scripts | free · static · Apache-2.0 | A |
| [Culori](https://culorijs.org) | Comprehensive colour library with OKLCH, interpolation and gamut mapping | Use in token build scripts | free · static · MIT | A |
| [Color.js](https://colorjs.io) | Colour science library by CSS Color spec editors | Reference implementation behaviour for CSS colour spaces | free · static · MIT | A |

## Rendering, export, typesetting and fonts

How code-made graphics become PNG, SVG, PDF and PPTX, and how fonts are subset.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Satori](https://og-playground.vercel.app) | Converts HTML and CSS (a flexbox subset) to SVG; the engine behind generated OG images | Pair with resvg to rasterise; fonts must be supplied as files | free · js · MPL-2.0 | S |
| [Playwright](https://playwright.dev) | Browser automation with full-page screenshots, PDF output and screenshot assertions | toHaveScreenshot() is the mechanical gate for visual regressions | free · static · Apache-2.0 | S |
| [resvg](https://github.com/linebender/resvg) | Accurate SVG rasteriser with JS bindings (resvg-js) | Deterministic SVG to PNG in scripts | free · static · Apache-2.0 or MIT | A |
| [sharp](https://sharp.pixelplumbing.com) | High-performance image resizing, format conversion and compositing in Node | Produce responsive image sets and AVIF or WebP | free · static · Apache-2.0 | A |
| [Typst](https://typst.app) | Modern markup-based typesetting system that compiles to PDF quickly | Strong choice for reports, one-pagers and print pieces made from code | free · static · Apache-2.0 | A |
| [Paged.js](https://pagedjs.org) | Polyfill for CSS Paged Media: page size, margins, running headers, bleed and crop marks in the browser | HTML to print-ready PDF through a browser | free · static · MIT | A |
| [Vivliostyle](https://vivliostyle.org) | CSS typesetting engine with strong CJK and vertical-text support | For Chinese and Japanese books and documents from HTML | free · static · AGPL-3.0 | A |
| [Slidev](https://sli.dev) | Markdown and Vue slides for developers with themes and PDF export | Decks from code with live components | free · static · MIT | A |
| [reveal.js](https://revealjs.com) | The HTML presentation framework | Full layout control for designed decks | free · static · MIT | A |
| [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) | Generates editable PowerPoint files from JavaScript | When the recipient must edit in PowerPoint or Keynote | free · static · MIT · slow | A |
| [cn-font-split (zh)](https://github.com/KonghaYao/cn-font-split) | Slices CJK fonts into unicode-range chunks so browsers load only what a page uses | Makes a Chinese brand font viable on the web | free · static · Apache-2.0 | A |
| [fontTools](https://github.com/fonttools/fonttools) | Python library and pyftsubset for inspecting and subsetting fonts | Subset to the characters actually used | free · static · MIT | A |
| [Takumi](https://takumi.kane.tw) | Rust image-rendering engine for JSX layouts, a faster Satori alternative | For high-volume image generation | free · static · MIT or Apache-2.0 | B |
| [snapDOM](https://snapdom.dev) | Fast in-browser DOM-to-image capture | For client-side export features | free · static · MIT | B |
| [WeasyPrint](https://weasyprint.org) | HTML and CSS to PDF in Python with paged-media support | Server-side document rendering | free · static · BSD-3-Clause | B |
| [Marp](https://marp.app) | Markdown to slides with PDF and PPTX export | Fast, plain decks | free · static · MIT | B |
| [opentype.js](https://opentype.js.org) | Parse fonts and convert text to SVG paths in JavaScript | Outline a wordmark in code | free · static · MIT | B |

## Open design tools

Scriptable or open tools that complement a code-first workflow.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Penpot](https://penpot.app) | Open-source design tool built on SVG and CSS concepts, with tokens and an MCP server | Self-hostable design source of truth | free · static · MPL-2.0 | A |
| [Excalidraw](https://excalidraw.com) | Hand-drawn style whiteboard for flows and wireframes | Low-fidelity thinking before pixels | free · js · MIT | A |
| [tldraw](https://www.tldraw.com) | Infinite canvas and SDK | For building canvas-style tools | freemium · js · tldraw licence (SDK requires a licence for commercial use) | A |
| [Inkscape](https://inkscape.org) | Mature open-source SVG editor with a command line for batch export | CLI export of SVG to PNG or PDF | free · blocked · GPL | A |
| [Blender](https://www.blender.org) | Open-source 3D suite, scriptable in Python | Scripted renders of product or icon scenes | free · static · GPL | A |
| [Graphite](https://graphite.art) | Open-source procedural vector and raster editor in the browser | Emerging alternative for vector work | free · static · Apache-2.0 | B |

## Lists worth mining

Breadth for discovery. Judge quality yourself.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [awesome-design-systems](https://github.com/alexpate/awesome-design-systems) | Table of public design systems with links to components, voice and source | Find a system in a comparable domain | free · static · Unlicense · slow | A |
| [design-resources-for-developers](https://github.com/bradtraversy/design-resources-for-developers) | Very large categorised list of design resources for developers | Breadth; verify quality yourself | free · static · MIT · slow | A |
| [Awesome Design Tools](https://github.com/goabstract/Awesome-Design-Tools) | Categorised design-tool list; no longer updated | Historical map of tool categories | free · static · MIT · archived | B |
| [awesome-web-animation](https://awesome-web-animation.netlify.app) | Libraries, tools and articles on web animation | Find a specialised animation library | free · js · CC0 | B |
| [awesome-creative-coding](https://github.com/terkelg/awesome-creative-coding) | Resources for generative art and creative coding | Starting point for generative graphics | free · static · slow | B |
| [awesome-shadcn/ui](https://awesomeshadcn.dev) | Index of shadcn-compatible component registries and themes | Find a registry before building a component | free · static · MIT | B |
| [awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | Directory of agent skills across vendors, including design skills | Track new design skills to analyse | free · static · MIT | B |
