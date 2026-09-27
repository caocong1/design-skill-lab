# Change aversion and redesign: NN/g, Google research, and daily-use tool rollouts
- id: change-aversion · url: https://research.google/pubs/minimizing-change-aversion-for-the-google-drive-launch/ · fetched: 2026-09-27 · method: browser
- review_by: 2027-09-27 (durable +365d) · licence note: paraphrased digest, not a mirror (the GV Library post is CC BY-NC 3.0)
> 中文导语：用户抵触的往往不是"变"本身，而是突然变笨、效率掉下来。NN/g 说明了何时该渐进、何时才该推倒重来；Google 的研究给出了变更抵触的定义、七种反应曲线和一套十步发布框架；Figma UI3 和 Spotify Your Library 是两款天天在用的产品，它们的改版记录给出了可以照抄的节奏：先自愿试用、可以切回旧版、公布下线日期、用护栏指标判断新版是否"不比旧版差"。本套件 0.7.0 要求重设计先质疑结构，这份资料是它的反向约束：结构可以改，但要说清为什么改、谁要付出代价、怎样平稳过渡。

Read (2026-09-27, browser unless noted):
- **Google** (Sedley & Müller):
  - CHI '13 EA case study, pp. 2351–2354, as PDF (static.googleusercontent.com/…/pubs/archive/41221.pdf, pdftotext + page renders).
  - GV Library post "Change aversion: why users hate what you launched (and what to do about it)", 2012-04-24, via Wayback snapshot 20140706004512 of gv.com/lib/…. library.gv.com does not connect from this network, and Medium returns 403.
  - UX Australia talk page (2012-08-31) and its slide deck, exported as text from Google Slides.
- **NN/g**:
  - Nielsen, "Fresh vs. Familiar", 2009-09-20.
  - Loranger, "Radical Redesign or Incremental Change?", 2015-02-08.
  - Nielsen, "Homepage Design Changes", 2012-09-23.
  - Nielsen, "Novice vs. Expert Users", 2000-02-05.
  - Chan, "Mental Models", 2024-01-26, last reviewed 2026-09-01.
  - Kaplan, "3 Complex-App User Types", 2025-06-27.
  - Pernice, "User-Centered Intranet Redesign: 11 Steps", 2020-05-30.
  - Kendrick, "Users Love Change" (April Fools, 2021-04-01).
  - Video summary pages: "Users Hate Change", "Making Design Improvements vs. Upsetting Established Users", "Product Redesigns: Incremental or Overhaul".
- **Figma blog**: 2024-06-26 (Hassan, Miller, Oh), 2024-10-01 (Xie), 2025-03-25 (Bergman).
- **Spotify Research**: publication page and blog (Pettersson et al.), 2023-05-03 and 2023-06-22.
- **UIE**: Spool, "Google's Take on 'Change Aversion' Misses the Point", 2012-07-16.

## Key facts
Definition and mechanism
1. **Definitions**: the GV post defines change aversion as "the negative short-term reaction to changes in a product or service". The CHI paper describes it as discomfort and anxiety when something familiar is replaced by something unfamiliar.
   - It is not the reaction to a first-time product. If a product is hard to learn, that is a design flaw, not aversion [CHI '13 p.2352].
   - The paper grounds it in four sources: habit (James 1890), mere exposure (Zajonc 1968), loss aversion (Kahneman & Tversky 1979), and functional and psychological barriers to innovation (Ram & Sheth 1989) [CHI '13 pp.2352–2353].
2. **Risk ladder of change types**, lowest to highest risk [UX Australia 2012 slides "Types of Change", labelled "Low Risk" to "High Risk"]:

   | Risk | Change type | Examples |
   |---|---|---|
   | Lowest | Infrastructure | speed, reliability |
   | | Functionality | new features, updates to features |
   | | Business | branding and positioning, pricing model |
   | Highest | User interface | visual redesigns, reorganisation of the information |

   The earlier GV post lists only three categories and does not rank them: infrastructure (speed, reliability, scalability), functional, and interface. It has no business row. It calls interface changes (visual, interaction, information re-architecture) "the real hornet's nest".
3. **Seven reaction patterns** after a launch [CHI '13 Fig. 1; same list in the 2012 slides]:
   - Delight: fully sustained / partially sustained / neutral resolution.
   - Aversion: positive resolution / neutral resolution / partial recovery / no recovery.
   Two further dimensions: intensity (slight to severe) and duration (quick new steady state vs attenuated).
   - The GV post's own chart, recovered as a Wayback image, uses six differently labelled patterns: Aversion → Neutral / Delight / Partial negative / Negative, and Attraction → Delight / Partial delight.
   - If the change is a real improvement, satisfaction should at least return to its pre-launch level, or rise.
   - Settling lower means the product got worse; the GV post cites Netflix's "ill-fated split of streaming and DVD services" (2011; the post gives no year). "Change aversion isn't an excuse for worsening user experience" [GV post §patterns].
4. **Counterpoint** [UIE 2012]: Spool argues users hate a badly designed experience of change, not change itself.
   - Daily users of a mastered tool suddenly "become stupid", and most blame themselves.
   - He quotes a manager's target: users notice nothing the day after launch. His remedy is future-friendly design that leaves room for what comes next.
   - NN/g 2025 says the same about long-term "Legacy" users: they fear losing productivity, not change itself [Kaplan 2025 §The Legacy].
   - Spool characterises Sedley's post as "rip off the bandage". The post's actual text recommends warnings, toggles and feedback loops, so that characterisation does not match what the post says.

When to change incrementally vs restructure (NN/g)
5. **Designer exposure vs user exposure** [Nielsen 2009]:
   - The design team's exposure to its own UI runs into thousands of hours.
   - People usually spend no more than 2–3 min on a website. Even daily visitors reach only about 30 exposure hours in 2 years, and loyal customers usually spend under 5 h a year on a site.
   - Frequent users (intranets, applications) rely on skilled, automated performance, so they too prefer familiar designs.
   - Default rule: "get it right, and then change slowly".
6. **Radical redesign is justified in two cases** [Nielsen 2009]:
   (a) almost no current users, with a real expectation of a much larger audience;
   (b) the UI has evolved incrementally until it has "lost any sense of a unified conceptual structure". The example is Office 2007, which replaced a UI architecture that was 17 years old by 2000.
   Wanting a "fresh" design is not a reason.
7. **Overhaul triggers** [Loranger 2015 §"Sometimes a Major Overhaul Is Best"]:
   - incremental gains are exhausted;
   - the technology blocks critical journeys;
   - the architecture is "a tangled mess" after years of patching;
   - conversion is very low site-wide;
   - benchmarking shows the site is far inferior to competitors.
   Otherwise, apply "the least amount of change necessary". Redesigns often skip content, structure and interaction design, which "are often the source of the problems". Before switching, a 1–2 day usability study of the existing design is recommended.
8. **Pace of change** [Nielsen 2012]: 19 years of yearly homepage screenshots show change stabilising. In recent years the average homepage differs by about 40% from the year before (early years were full redesigns), which amounts to a complete redesign about every 3 years.
   - Example: Aetna removed its Chinese and Spanish links in 2012, probably because analytics showed little use. Nielsen argues they were little used because they sat in a non-standard spot (bottom right, below the fold); they belonged at the upper right.
9. **Mental-model inertia** [Chan 2024]: innovate only when the new way is clearly better than the old, well-known one. When users look in the wrong place, move the thing to where they look. Otherwise, teach the model with clearer labels.
   **Expert performance** [Nielsen 2000]: shortcuts can be hidden from novices. "Training-wheels" interfaces give newcomers a simpler version. Tests must follow users over time as they build expertise.

Managing a launch (Google)
10. **The GV post's six principles** [GV post §"How to avoid (or mitigate)"]:
    1. Warn users before major changes.
    2. Explain the nature and value of the changes.
    3. Let users toggle between old and new: "play in the new sandbox before removing the old one".
    4. Provide transition instructions and support.
    5. Offer a dedicated feedback channel.
    6. Report back what you are fixing.
    Before launch, Google used usability studies, dogfooding and partial launches, for example **1% of users** with a control group. After launch it tracked satisfaction continuously with small-sample surveys.
11. **The CHI '13 ten-action framework**, applied to Google Docs List → Google Drive (from May 2012):
    1. Plan the launch stages.
    2. Assess user impact before launch.
    3. Prime users.
    4. Explain the benefits.
    5. Give transition guidance and support.
    6. Let users switch between the new and old UI.
    7. Monitor and manage the change over time.
    8. Let users send feedback directly.
    9. Address their issues quickly.
    10. Tell users what you improved.
    - Satisfaction was measured with a **7-point item** ("Extremely dissatisfied" … "Extremely satisfied") on random samples through every launch stage.
    - The slides show both "Letting Users Switch Back" and "Letting Users Switch Forward".
    - The paper claims a launch "with no aversion" (abstract, p.2351) and perceptions "significantly more positive" than earlier launches that did not use the framework (p.2354), but reports no figures.

Daily-use tools in practice
12. **Figma UI3 timeline**:
    - **2024-06-26**: announced at Config; "slowly rolling out".
    - **2024-10-10**: available to all users. Users could opt out while UI3 was in beta: "If you get UI3 on a Wednesday, but have a work deadline for Friday, you can still go back".
    - **2025-03-25**: announcement that UI2 would be retired.
    - **2025-04-30**: UI2 retired. That is about 10 months from launch to retirement, and 36 days after the retirement post.
    The staged rollout was also used to gather feedback and build tutorials before the old UI went away [Figma 2024-10-01, 2025-03-25].
13. **Figma's reversals** where beta data contradicted the design [Figma 2024-06-26, 2024-10-01]:
    - Floating panels became fixed again, still resizable, because they cramped the canvas and "slowed people down" for people who spend many hours a day in Figma.
    - X/Y position stays above W/H because the inversion "disrupted muscle memory too much".
    - A condensed Auto Layout alignment grid was reverted to its original layout with new styling.
    - Clip content went back to a checkbox after a dropdown cost an extra click.
    - Keyboard shortcuts and the quick-actions shortcut were kept ("all your favorites still work").
    - Optional property labels were added as switchable training wheels, with a "Navigating UI3" what-moved help article [Figma 2025-03-25].
    - Before retiring UI2, Figma also reverted "tidy up" to an experience "more similar to UI2" [Figma 2025-03-25].
    - The team's question for reading criticism: is it "just a natural reaction to change, or is there something long-lasting here?"
14. **Spotify Your Library** (launched 2021; CHI 2023) [Spotify Research blog 2023-06-22]:
    - **Early research**: an ethnographic study of 18 US users at home. Users see the Library as "their space". Prototypes were personalised so participants saw their own collections.
    - **Opt-in beta**: a small percentage of users, with text and rating feedback, run before any A/B test.
    - **A/B tests in stages**: a small test, then a large one. Guardrail metrics (listening time, retention) were held within **non-inferiority margins**. Success metrics measured content retrieval.
    - **Diary study**: 1 week, check-ins every other day, so the team would not react to first impressions.
    - A small but vocal group was upset by the sorting changes, so the sort options were reconsidered.
    - The redesign then launched to everyone at once to avoid split experiences. Negative sentiment was "substantially lower" than after the previous Library update.
    - The team says this heavy process is not worth it for low-risk or small changes.
15. **NN/g recommendations for "Legacy" users of complex apps**, meaning long-term users who never became efficient [Kaplan 2025]:
    - avoid sudden large UI changes;
    - announce changes early;
    - keep legacy views or workflows available during a transition;
    - offer low-risk beta environments;
    - involve these users in testing and in rollout feedback.
    The intranet guidance also says to announce a redesign early "since people are change averse" [Pernice 2020 §7, repeated in §11]. Note that "Users Love Change" is an April Fools hoax (2021-04-01) and must not be cited as evidence.

## What it changes for the skills
- skills/design-studio/references/process/redesign.md: add the change-cost counter-rule.
  1. Record usage frequency per role. Skilled daily use makes change costly; occasional visits make it cheap.
  2. A restructuring direction must name its trigger from facts 6–7: lost conceptual structure, tangled architecture, blocking technology, exhausted incremental gains, very low conversion, inferior benchmark, or almost no current users. "Looks old", "fresh" and boredom are not triggers.
  3. Rank risk by the ladder in fact 2. Reorganising information and UI carries the highest risk.
  4. Add an equity audit that lists what must not change silently in a daily-use tool:
     - keyboard shortcuts and command-palette entry;
     - the order and position of high-frequency controls;
     - labels and positions of top CTAs and navigation;
     - sort and filter options and defaults;
     - users' own content and how they have organised it.
     This extends taste-skill §11.F (URLs, nav labels, form fields, wordmark, legal copy).
  5. Include a migration plan built from the 10 actions in fact 11: opt-in beta → toggle back → dated retirement → retire; a what-moved map; optional labels; help ready before the new UI becomes the default; a feedback channel with "you said, we did".
- skills/design-studio/templates/function-map.md: add fields for frequency or skilled-performance per role, the redesign trigger, and an equity inventory (shortcuts, learned locations, sort defaults, user-organised content).
- skills/design-studio/references/process/directions.md: a redesign options board keeps one evolution direction. Every restructuring direction carries a change-cost line saying what moves, for whom, and with what transition aid. The 0.7.0 rule of at least 2 restructuring directions stands, but each must pass the trigger check.
- skills/design-studio/references/process/handoff.md: the handoff spec for a redesign gets a rollout section:
  - phases, and whether there is an opt-out toggle;
  - retirement date;
  - a what-moved table;
  - transitional aids;
  - satisfaction tracking (7-point, sampled over time) plus guardrail metrics with non-inferiority margins.
- skills/critique-design/references/heuristics.md: add a redesign check: does a daily user lose a learned path without a replacement or a signpost? Critiques should separate aversion (expected dip and recovery) from regression (settles below baseline).
- skills/design-studio/references/process/truth-files.md: PRODUCT.md records the size of the user base and usage frequency. These decide whether a radical change is affordable (fact 6a).

## Not verified / open
- The Google CHI '13 case study reports no satisfaction numbers or statistics, only claims. Its reference list swaps [3] and [4] against the text.
- The GV post's pattern chart was recovered (fact 3). Its second chart, a fictional "Acme Iron Bird Seed" example, was not viewed. Sedley's follow-up reply was on Google+, which is gone.
- The full text of the Spotify CHI 2023 paper (ACM DL returns 403) was not read. Figures such as the NIM values and beta size come only from the blog, which does not publish them.
- The NN/g videos ("Users Hate Change", "Making Design Improvements…", "Incremental or Overhaul", whose summary mentions "3 cases") were read as summary pages only; no transcripts.
- Figma published no opt-out or satisfaction figures. The date UI3 became the default is not stated. The 2024-10-01 post still speaks of "when UI3 becomes the default" as a future step, so it was probably later than 2024-10-10.
- Correction to the brief: no 2011 Google change-aversion publication was found. The earliest Google primary source located is the GV post dated **2012-04-24**, followed by the UX Australia talk (2012-08-31) and CHI '13.
- No controlled study was found that isolates the effect of any single mitigation. CHI '13 itself names this as future work.
