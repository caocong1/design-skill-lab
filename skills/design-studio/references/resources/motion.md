<!-- Generated from catalog/resources.jsonl by scripts/build-catalog.py. Do not edit by hand. -->
# Resources: Motion

Recordings of motion in shipped products are the best teacher: watch them slowed down and note duration, easing, origin and what does not move. Then tools to author curves and springs, official guidelines, and the few writers worth reading.

Access reads `cost · agent access · licence`. Agent access: `static` = a plain web fetch can read it; `js` = needs a real browser; `blocked` = bot protection or a login wall, send the user the link instead; `unknown` = could not be reached from the maintainer's network when last checked (not proof that it is down). `login` = content is gated. Tier: `S` first place to look, `A` strong, `B` niche or with a clear weakness.

## Motion in shipped products

Start here for any in-product animation.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [60fps.design](https://60fps.design) | Screen recordings of UI animation in top shipped apps, filterable by app and interaction type; the best source for mobile motion | Use /shots/filter/<type> (loading, onboarding, navigation...), /apps/category/<category>, plus the glossary and storyboards; watch at reduced speed | free · static | S |
| [Spotted in Prod](https://spottedinprod.com) | Recordings of exceptional interaction details in shipped products | Browse by app or tag; note duration and easing while watching | free · static | S |
| [Awwwards motion collections](https://www.awwwards.com/awwwards/collections/transitions/) | Curated collections of page transitions, scrolling and micro-interactions on award sites | Sibling collections: animation, scrolling, microinteractions | free · static | A |

## Web motion showcases and asset libraries

Expressive and experimental work, usually with source. Check licences on assets.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Codrops](https://tympanus.net/codrops/) | Experimental web motion with source and tutorials: scroll effects, page transitions, WebGL, typography animation | Use /hub/ to filter demos and tutorials by tag (page-transition, scroll, hover) | free · static · Demos MIT-style, check each | S |
| [Motion examples](https://motion.dev/examples) | Live, copyable examples for the Motion library: gestures, layout animation, scroll, springs | Filter by platform (JS, React, Vue); some examples require Motion+ | freemium · static | S |
| [Made With GSAP](https://madewithgsap.com) | Sites and effects built with GSAP, with breakdowns | Use for scroll-driven storytelling references | freemium · static | A |
| [GSAP showcase](https://gsap.com/showcase/) | Official showcase of GSAP-powered sites | Browse for timeline-heavy work | free · js | A |
| [Rive Marketplace](https://rive.app/marketplace) | Interactive, state-machine-driven animations that can be remixed | Inspect state machines to learn interactive animation structure | freemium · js · Per-file licence | A |
| [LottieFiles](https://lottiefiles.com) | Huge library of Lottie animations plus tooling | Filter to free; check the licence per animation before shipping | freemium · blocked · login · Lottie Simple License for free files; check each | A |
| [Olivier Larose blog](https://blog.olivierlarose.com) | Tutorials that rebuild award-site animations step by step | Find the effect, read the build | free · static | A |
| [nan.fyi](https://www.nan.fyi) | Interactive essays on SVG paths, layout animation and how motion works under the hood | Read before hand-writing path or FLIP animation | free · static | A |

## Easing, spring and animation tools

Author curves and springs by eye, then record the numbers as tokens.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Easing Functions Cheat Sheet](https://easings.net) | Visual reference of the named easing functions with CSS and maths | Look up the curve, copy the cubic-bezier | free · static | S |
| [Easing Wizard](https://easingwizard.com) | Generate and preview bezier, spring, bounce and wiggle easings, exported as CSS including linear() | Tune by eye with the preview, then copy the CSS | free · static | S |
| [Scroll-driven Animations](https://scroll-driven-animations.style) | Demos and visual tools for CSS scroll-driven animations (timeline ranges, view progress) | Use the range visualiser when specifying animation-range | free · static | S |
| [Linear easing generator](https://linear-easing-generator.netlify.app) | Converts a JS easing or SVG path into a CSS linear() function (springs and bounces in pure CSS) | Paste a spring function, copy the linear() output | free · js | A |
| [cubic-bezier.com](https://cubic-bezier.com) | Classic bezier editor with side-by-side comparison | Compare a custom curve against a preset | free · js | A |
| [CSS Spring Easing Generator](https://www.kvin.me/css-springs) | Spring parameters to CSS linear() with duration | Use to match a native spring on the web | free · static | A |
| [View Transitions demos](https://view-transitions.chrome.dev) | Reference demos for same-document and cross-document view transitions | Copy the pattern closest to the navigation being designed | free · static | A |
| [Jitter](https://jitter.video) | Browser-based motion design tool with Lottie, video and GIF export | For marketing motion graphics rather than in-product UI | freemium · static · login | A |
| [Rive](https://rive.app) | Editor and runtimes for interactive vector animation driven by state machines | Use when an animation must react to input across platforms | freemium · static · login | A |
| [Lottie format docs](https://lottiefiles.github.io/lottie-docs/) | Human-readable reference of the Lottie JSON format | Needed when generating or editing Lottie by code | free · static | B |
| [Animista](https://animista.net) | Library of CSS keyframe presets with generated code | Starting point only; retime and re-ease everything | free · static · slow | B |

## Official motion guidance and accessibility

Token tables, principles, and the rules for motion sensitivity.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Material 3 motion](https://m3.material.io/styles/motion/overview) | Motion system with easing and duration tokens, transition patterns and the expressive spring-based motion scheme | JS app: use a browser tool; read easing-and-duration tokens and transitions | free · js | S |
| [WWDC18: Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/) | The foundational talk on gesture-driven, interruptible, redirectable interfaces | Watch before designing any drag, sheet or swipe interaction | free · static · archived | S |
| [WWDC23: Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/) | Explains springs through duration and bounce instead of mass, stiffness and damping | Use its vocabulary when specifying springs for any platform | free · static | S |
| [Material 2: Speed](https://m2.material.io/design/motion/speed.html) | Still the clearest public explanation of how duration and easing should vary with size, distance and platform | Read once; the reasoning outlives the version | free · js · archived | A |
| [Apple HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion) | Apple's principles: purposeful, brief, optional motion; respecting Reduce Motion | Pair with the two WWDC talks below | free · js | A |
| [Carbon motion](https://carbondesignsystem.com/elements/motion/overview/) | Productive versus expressive motion, with curves and a duration scale by distance | A good model for a two-mode motion system | free · static | A |
| [NN/g: Animation duration](https://www.nngroup.com/articles/animation-duration/) | Evidence-based guidance on how long UI animations should last | Cite when pushing back on slow animation | free · static | A |
| [NN/g: Animation purpose](https://www.nngroup.com/articles/animation-purpose-ux/) | When motion helps: feedback, state change, navigation metaphors, signifiers | Use as the justification test for each animation | free · static | A |
| [WCAG: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | The normative basis for letting users disable interaction-triggered motion | Read with 2.2.2 Pause, Stop, Hide | free · blocked | A |
| [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion) | How to implement reduced motion well on the web | Follow the no-motion-first pattern | free · static | A |
| [Designing Safer Web Animation For Motion Sensitivity](https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/) | Which kinds of motion trigger vestibular symptoms and how to design around them | Check parallax, zoom and large-area movement against it | free · static · archived | A |
| [Fluent 2 motion](https://fluent2.microsoft.design/motion) | Microsoft's motion principles and timing guidance | Use for Windows-native feel | free · static | B |
| [Ant Motion (zh)](https://motion.ant.design) | Ant Design's motion language and React motion components | Reference for enterprise motion principles in Chinese | free · js · slow | B |

## Writing and courses on motion craft

A small set that repays reading in full.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Emil Kowalski](https://emilkowal.ski) | The most practical writing on web UI animation craft: easing choice, durations, origin-aware and interruptible animation, when not to animate | Read Great Animations, 7 Practical Animation Tips, Good vs Great Animations, You Don't Need Animations | free · static | S |
| [animations.dev](https://animations.dev) | Emil Kowalski's course on the theory and practice of web animation | Worth it for a team standardising its motion craft | paid · static · login | S |
| [Josh W. Comeau](https://www.joshwcomeau.com) | Interactive explanations of CSS transitions, keyframes, spring physics and linear() | Read the spring physics and CSS transitions posts | free · static | S |
| [Family Values](https://benji.org/family-values) | How the Family wallet team thinks about simplicity, fluidity and delight, with examples | Read for the principle that every element should move from somewhere | free · static | S |
| [Devouring Details](https://devouringdetails.com) | Rauno Freiberg's interactive reference on interaction design craft | For deep study of interaction details | paid · static · login | A |
| [The physics behind spring animations](https://blog.maximeheckel.com/posts/the-physics-behind-spring-animations/) | Clear derivation of mass, stiffness and damping with interactive examples | Read when tuning springs numerically | free · static | A |
| [web.dev: animations guide](https://web.dev/articles/animations-guide) | Which properties animate cheaply and how to keep motion on the compositor | Check the property list before animating anything unusual | free · static | A |
| [UX in Motion Manifesto](https://medium.com/ux-in-motion/creating-usability-with-motion-the-ux-in-motion-manifesto-a87a4584ddc) | Twelve principles of how motion supports usability (easing, offset and delay, parenting, transformation, masking...) | Use its vocabulary to describe choreography | free · blocked · archived | A |

## Native platform motion

API references and example collections for SwiftUI, Compose and Flutter.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [SwiftUI Animation](https://developer.apple.com/documentation/swiftui/animation) | Reference for SwiftUI animations, springs and transitions | Check spring presets (smooth, snappy, bouncy) and their parameters | free · static | A |
| [Open SwiftUI Animations](https://github.com/amosgyamfi/open-swiftui-animations) | Large open collection of SwiftUI animation examples | Find a similar effect and read the source | free · static · MIT | A |
| [Compose: choose an animation API](https://developer.android.com/develop/ui/compose/animation/choose-api) | Decision tree for Jetpack Compose animation APIs | Start here for any Android motion work | free · js | A |
| [Flutter animations](https://docs.flutter.dev/ui/animations) | Implicit versus explicit animation, hero, staggered and physics-based animation in Flutter | Pick implicit widgets first; go explicit only when needed | free · static | A |
| [flutter_animate](https://pub.dev/packages/flutter_animate) | Declarative chained effects for Flutter with sensible timing control | Default choice for UI effects in Flutter | free · static · BSD-3-Clause | A |
