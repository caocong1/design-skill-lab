<!-- Generated from catalog/resources.jsonl by scripts/build-catalog.py. Do not edit by hand. -->
# Resources: Reading

The articles, books, courses and guidelines whose ideas shape this suite. Prefer primary, durable sources; name the principle when justifying a decision.

Access reads `cost · agent access · licence`. Agent access: `static` = a plain web fetch can read it; `js` = needs a real browser; `blocked` = bot protection or a login wall, send the user the link instead; `unknown` = could not be reached from the maintainer's network when last checked (not proof that it is down). `login` = content is gated. Tier: `S` first place to look, `A` strong, `B` niche or with a clear weakness.

## Interface craft and design engineering

The details that make interfaces feel right, and robust CSS thinking.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Rauno Freiberg: Web Interface Guidelines](https://interfaces.rauno.me) | Non-obvious details that make web interfaces feel right: interactivity, typography, motion, touch, accessibility | Use as a polish checklist after the structure is sound | free · static | S |
| [Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design) | Essay on the reasoning behind great interactions: metaphors, kinetic physics, responsiveness, frequency and novelty | Read before designing any gesture | free · static | S |
| [Design Engineering at Vercel](https://vercel.com/blog/design-engineering-at-vercel) | What design engineers do and the standards they hold | Shared vocabulary for design-minded engineers | free · static | A |
| [How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui) | A disciplined product redesign: reduce, align, rebuild the theme system in LCH | Model for a redesign that keeps equity | free · static | A |
| [Atomic Design](https://atomicdesign.bradfrost.com) | Brad Frost's free web book on building interface systems | Read chapter 2 for the mental model | free · static · archived | A |
| [Every Layout](https://every-layout.dev) | Algorithmic CSS layout primitives that adapt without breakpoints | The rudiments are free; they change how responsive layout is specified | freemium · static | A |
| [Ahmad Shadeed](https://ishadeed.com) | Deep, visual CSS articles on layout, defensive CSS and RTL | Look up the component you are about to build | free · static | A |
| [Defensive CSS](https://defensivecss.dev) | Patterns that keep layouts from breaking with real content | Checklist for long text, missing images, overflow | free · static | A |
| [Maggie Appleton](https://maggieappleton.com) | Illustrated essays on language-model interfaces and tools for thought | Perspective for AI product concepts | free · static | A |

## Designing with and for AI

Why models produce generic design and what changes that; design in AI-era products.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills) | Anthropic on why models converge on generic design and how targeted prompting and skills counter it | Foundational for anyone writing design guidance for agents | free · static | S |
| [Prompting for frontend aesthetics](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb) | Cookbook showing which prompt levers change front-end aesthetics (typography, themes, motion, backgrounds) | Evidence for which instructions actually move output | free · static | A |
| [Design for the AI age](https://linear.app/now/design-for-the-ai-age) | Linear's view on designing software where AI agents are users and collaborators | Framing for AI-product briefs | free · static | A |
| [AI and design systems](https://bradfrost.com/blog/post/ai-and-design-systems/) | How design systems become the constraint layer for AI-generated UI | Argument for investing in tokens before generation | free · static | A |

## Visual design fundamentals

Hierarchy, spacing, perception. Start with the first three.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [7 Practical Tips for Cheating at Design](https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886) | The most effective short article on making developer-built UI look designed | Apply all seven before anything fancier | free · blocked · archived | S |
| [Refactoring UI](https://www.refactoringui.com) | Tactical UI design book for developers by the Tailwind authors | The single best purchase for an engineer who designs | paid · static | S |
| [Visual design rules you can safely follow every time](https://anthonyhobday.com/sideprojects/saferules/) | A plain list of visual design rules with brief explanations | Use as a lint list for a finished screen | free · static | S |
| [Laws of UX](https://lawsofux.com) | The perception and cognition principles designers cite (Fitts, Hick, Jakob, Miller, proximity, peak-end...) with sources | Name the law when justifying a decision | free · static | S |
| [7 Rules for Creating Gorgeous UI](https://www.learnui.design/blog/7-rules-for-creating-gorgeous-ui-part-1.html) | Erik Kennedy's rules: light comes from the sky, black and white first, double your whitespace | Good mental checklist | free · static · archived | A |
| [Gestalt principles](https://ixdf.org/literature/topics/gestalt-principles) | Overview of the grouping principles behind layout decisions | Reference when explaining grouping choices | free · static | A |
| [Dieter Rams: ten principles for good design](https://www.vitsoe.com/us/about/good-design) | The ten principles, from the source | A yardstick for restraint | free · static · archived | A |
| [The Web's Grain](https://frankchimero.com/blog/2015/the-webs-grain/) | Frank Chimero on designing with the nature of the web instead of against it | Read when a layout fights the medium | free · static · archived | A |
| [Magic Ink](https://worrydream.com/MagicInk/) | Bret Victor's argument that most software is information design, not interaction design | Reframe dashboards and tools as graphics to be read | free · static · archived | A |

## Research-backed UX guidance

Evidence to cite instead of opinion.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [NN/g: 10 usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) | The standard heuristic-evaluation framework | Tag critique findings with the heuristic violated | free · static | S |
| [Nielsen Norman Group articles](https://www.nngroup.com/articles/) | Decades of research-based UX guidance | Search before asserting a usability claim | free · static | S |
| [Baymard Institute](https://baymard.com/blog) | Large-scale e-commerce and form usability research; articles free, full database paid | Check before designing checkout, search, filters or forms | freemium · static | S |
| [NN/g: response time limits](https://www.nngroup.com/articles/response-times-3-important-limits/) | The 0.1 s, 1 s and 10 s limits that govern feedback design | Cite for loading-state decisions | free · static · archived | A |
| [Growth.Design case studies](https://growth.design/case-studies) | Product UX teardowns told as comics, tied to psychology principles | Read a teardown of a comparable flow | free · static | A |
| [LukeW](https://www.lukew.com/ff/) | Luke Wroblewski's notes on forms, mobile and input design with data | Search for form-design evidence | free · static | A |
| [GOV.UK design principles](https://www.gov.uk/guidance/government-design-principles) | Ten principles for user-centred services | Start with user needs; do the hard work to make it simple | free · static | A |
| [Microsoft Inclusive Design](https://inclusive.microsoft.design) | Toolkit framing disability as permanent, temporary and situational | Use the persona spectrum in briefs | free · static | A |
| [A11Y Project checklist](https://www.a11yproject.com/checklist/) | Plain-language WCAG checklist | Run before hand-off | free · static | A |
| [UX Myths](https://uxmyths.com) | Common UX misconceptions with research that refutes them | Settle arguments such as the three-click rule | free · blocked · archived | B |

## Process, critique and presenting work

Briefs, critique formats, and explaining decisions to stakeholders.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [NN/g: Design critiques](https://www.nngroup.com/articles/design-critiques/) | How to run and participate in useful critiques | Structure for critique sessions | free · static | A |
| [Design critiques at Figma](https://www.figma.com/blog/design-critiques-at-figma/) | Several critique formats and when each works | Pick a format for the feedback needed | free · static | A |
| [13 ways designers screw up client presentations](https://medium.com/@monteiro/13-ways-designers-screw-up-client-presentations-51aaee11e28c) | Mike Monteiro on presenting design work with authority | Read before presenting options | free · blocked · archived | A |
| [Articulating Design Decisions](https://tomgreever.com/book) | Tom Greever's book on explaining and defending design decisions | The method behind rationale sections | paid · unknown | A |
| [Shape Up](https://basecamp.com/shapeup) | Basecamp's free book: shaping work, breadboarding and fat-marker sketches | Use breadboards to settle flow before visuals | free · static · archived | A |
| [The Dribbblisation of Design](https://www.intercom.com/blog/the-dribbblisation-of-design/) | The classic critique of surface-first design and the four layers of product design | Antidote to styling before understanding | free · static · archived | A |
| [9 rules for running a productive design critique](https://library.gv.com/9-rules-for-running-a-productive-design-critique-1d7ee6fb1ca9) | Concise critique ground rules from GV | Share before a critique | free · unknown · archived | B |

## Books

The canon. Paid unless noted.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Don't Make Me Think](https://sensible.com/dont-make-me-think/) | Steve Krug's short classic on web usability | First usability book to read | paid · static | S |
| [The Design of Everyday Things](https://www.basicbooks.com/titles/don-norman/the-design-of-everyday-things/9780465050659/) | Don Norman on affordances, signifiers, mapping and feedback | The vocabulary of interaction design | paid · static | S |
| [Grid Systems in Graphic Design](https://www.niggli.ch/en/grid-systems-in-graphic-design.html) | Mueller-Brockmann's definitive manual on grids | Reference for poster, editorial and deck layout | paid · js | S |
| [The Elements of Typographic Style](https://en.wikipedia.org/wiki/The_Elements_of_Typographic_Style) | Bringhurst's typographer's bible | Depth behind every typography rule | paid · static | S |
| [The Visual Display of Quantitative Information](https://www.edwardtufte.com/book/the-visual-display-of-quantitative-information/) | Tufte on data-ink, chartjunk and graphical integrity | Principles for any chart or dashboard | paid · static | S |
| [Interaction of Color](https://yalebooks.yale.edu/book/9780300179354/interaction-of-color/) | Albers on how colours change each other | Why a colour looks wrong in context | paid · static | A |
| [Storytelling with Data](https://www.storytellingwithdata.com/books) | Practical business chart design and narrative | For decks and dashboards aimed at managers | paid · static | A |
| [Designing Interface Animation](https://rosenfeldmedia.com/books/designing-interface-animation/) | Val Head's book on purposeful UI animation | Depth on motion in design systems | paid · blocked | A |
| [Microcopy: The Complete Guide](https://www.microcopybook.com) | Kinneret Yifrah's guide to interface words | Reference for error, empty-state and button copy | paid · static | A |
| [Form Design Patterns](https://www.smashingmagazine.com/printed-books/form-design-patterns/) | Adam Silver's inclusive form patterns | Before designing any complex form | paid · static | A |

## Courses

Worth their price for building real skill.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [Smart Interface Design Patterns](https://smart-interface-design-patterns.com) | Vitaly Friedman's video course and checklists on complex UI patterns | Tables, filters, navigation, forms at depth | paid · static · login | A |
| [Learn UI Design](https://www.learnui.design) | Erik Kennedy's comprehensive visual UI course | For engineers building real visual skill | paid · static · login | A |
| [Shift Nudge](https://shiftnudge.com) | Matt D. Smith's interface design course | Alternative with strong typography and layout modules | paid · js · login | A |
| [CSS for JavaScript Developers](https://css-for-js.dev) | Josh Comeau's course that builds a real mental model of CSS | When layout bugs block design fidelity | paid · static · login | A |
| [web.dev: Learn Responsive Design](https://web.dev/learn/design) | Free course on modern responsive design techniques | Container queries, fluid type, theming | free · static | A |
| [Google UX Design Certificate](https://www.coursera.org/professional-certificates/google-ux-design) | Structured introduction to the UX process | Process fundamentals for newcomers | paid · static · login | B |

## Chinese-language reading

Domestic case studies and team blogs for Chinese-market context.

| Resource | Best for | How to use | Access | Tier |
| --- | --- | --- | --- | --- |
| [优设网 (zh)](https://www.uisdc.com) | The largest Chinese design learning site: tutorials, trend reports, tool news | Search a topic in Chinese; quality varies by author | free · static | A |
| [腾讯 ISUX (zh)](https://isux.tencent.com) | Tencent's social UX team writes up real product and brand design cases | Case studies of mass-market Chinese products | free · static | A |
| [腾讯 CDC (zh)](https://cdc.tencent.com) | Tencent's customer research and design centre | User-research and enterprise-product perspective | free · js · slow | A |
| [阿里巴巴设计 (zh)](https://www.alibabadesign.com) | Alibaba design teams' public work and writing | Commerce and enterprise design at scale | free · js | A |
| [Ant Design 语雀专栏 (zh)](https://www.yuque.com/ant-design) | Long-form writing from the Ant Design team on enterprise product design | Depth behind Ant Design's patterns | free · js · slow | A |
| [少数派 (zh)](https://sspai.com) | Chinese publication on apps, tools and digital craft | App reviews reveal what Chinese power users value | free · static | B |
| [UXRen (zh)](https://www.uxren.cn) | Chinese UX community with translations of international articles | Find Chinese translations of canonical articles | free · static · slow | B |
