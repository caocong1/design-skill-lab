# Object-Oriented UX (OOUX) and the ORCA process (Sophia V. Prater)
- id: ooux-orca · url: https://medium.com/design-bootcamp/introducing-orca-the-third-diamond-in-your-ux-process-23a1babb0389 · fetched: 2026-09-27 · method: browser
- review_by: 2027-09-27 (durable +365d) · licence note: paraphrased digest, not a mirror
> 中文导语：OOUX 的主张是先定义用户心智里的"对象"（名词），再设计动作和页面。ORCA 是它的操作流程：对象（Objects）、关系（Relationships）、行动召唤（CTAs）、属性（Attributes），分四轮、共 15 步做完，最后才画屏幕。本套件 0.7.0 定下"重设计先画功能地图，不从现有屏幕出发"，当时只凭一次用户纠正，没有方法依据。这份资料给它补上一套公开、可以逐步照做的方法，并说明对象、关系、CTA、属性各自怎样落到导航、卡片、详情页和按钮位置上。

Read (2026-09-27; all authored by Prater unless noted):
- **ORCA article**, Medium, 2022-06-24. Medium returns 403 to automated clients, so it was read from the Wayback snapshot 20241227054656.
- **A List Apart** (browser):
  - "Object-Oriented UX", 2015-10-20 (mirrored at ooux.com/resources/object-oriented-ux)
  - "OOUX: A Foundation for Interaction Design", 2016-04-19
  - "UX for Lizard Brains", 2017-10-10
  - "How to Sell UX Research with Two Simple Questions", 2021-10-21
- **ooux.com** (browser): /masterclass-ooux-certification, /offerings/fourfails ("Designing With ORCA", coming soon), /people/sophiavprater, /what-is-ooux.
- **Other**: "Undercover OOUX" (Medium, Jan 31 [2022], via Wayback 20221024070723); ooux.com/product/4mistakes (Wayback 20211127173945).

## Key facts
Definitions and origin
1. Prater coined "Object-Oriented UX" in 2015 [ooux.com/people/sophiavprater]. The method came out of designing CNN.com's first responsive election night (2012). There, a diagram of reusable objects replaced page-by-page templates. The 2012 diagram itself still carried flyouts, a homepage and persistent navigation. The 3-object version (States, Races, State-Race Results) is her later redraw of "the diagram that I would have created then if I knew what I know now" [ALA 2015].
2. OOUX means designing objects before procedural actions. The objects are real-world things in the user's mental model (products, tutorials, locations). Digital-world actions (search, filter, compare, check out) are decided only after the objects are defined [ALA 2015 §"Mobile first, content first, and objects first"].
3. The four pillars of ORCA [ORCA article §"The Four Pillars"]:
   - **Objects**: real-world things with value to both the business and the user.
   - **Relationships**: how objects connect. These "pave the way for navigation paths."
   - **Calls-to-action**: the affordances of an object, meaning what it "calls" each user role to do. Every action is done to something.
   - **Attributes**: the content elements that give an object its shape, plus the metadata users need to sort and filter lists.
   Prater writes object names in capitals (for example POST, USER on Instagram).
4. In a 2019 talk listing, the C stood for "Capabilities"; the current name is Calls-to-Action [ooux.com/product/4mistakes, Wayback 2021].

Object mapping (2015 steps; still the core artifact)
5. **Extract objects from goals**: highlight the nouns in the brief (10–15 min). Rules [ALA 2015 §Step 1]:
   - Nouns that recur are the important objects.
   - Ignore abstract outcomes ("exposure").
   - Ignore collection nouns: library, calendar, catalog and map are list views of a core object (event, product, location). "The map is a design mechanism, not an object."
   - Infer objects from verbs: "commenting on" implies a COMMENT object.
   - Record object states, for example a challenge that is posted, in progress, closed, or closed with feedback.
6. **Define content**: core content (text, images) goes on yellow notes. Metadata, meaning anything a user might sort or filter on, goes on red notes (pink from 2016 on). Uncertain items get a "?" and are revisited [ALA 2015 §Step 2].
7. **Nest objects**: for each object, ask which other objects nest inside it. This defines the relationships and, implicitly, the contextual navigation [ALA 2015 §Step 3].
8. **Force-rank** every element. The rank is a priority, not a screen position: priority can show as size, colour, or a collapsed panel [ALA 2015 §Step 4].
9. Colour code, stated in 2016 and again in 2021 [ALA 2016 §"CTA Inventory: low-fidelity"; ALA 2021]:

   | Colour | Meaning |
   |---|---|
   | Blue | Objects (and nested objects) |
   | Yellow | Core content |
   | Pink | Metadata |
   | Green | CTAs |

10. Mobile first means forced prioritisation. Start from a single-column list and delay layout. Prater applies this even to desktop-only software [ALA 2015]. She advises getting the one-column version of each screen approved before any desktop layout ("hierarchy diagrams") [Undercover OOUX §6].
11. Contextual navigation: content reaches content. Recipe → chef → ingredient links let users explore "without ever hitting a dead end". Val Jencks, quoted: top navigation "is the fire escape" [ALA 2015 §"OOUX is powerful"].

CTAs (2016)
12. CTAs are the entry points to interaction flows. The CTA Inventory lists possible CTAs per object and bridges the object map to interaction design [ALA 2016].
   - Budget about 10–15 minutes per object, so 1–2 hours for 3–5 objects.
   - CTA brainstorming often loops back and adds objects or attributes. Example: "substitute ingredients" became a nested object.
13. High-fidelity CTA Inventory columns: why (the goal it serves), who (role or permission), where (placements), complexity (for estimates), priority (launch, later, or research first), and open questions [ALA 2016].
   - CTAs are conditional on permission, user type and object state. On your own recipe you see edit and delete, and "might not be able to" favourite it; on someone else's recipe you cannot edit or delete, but you can favourite.
14. Test a click-through prototype that only navigates object to object, with its CTAs in place, before designing any flow. "Talk to your users about the button before designing what happens when they click it" [ALA 2016 §Validate actions early].

The ORCA process (2022 article; 4 rounds, 15 steps)
15. **Round 1, Discovery** [ORCA article §"The Four Rounds"]:
   - Noun Foraging.
   - Nested-Object Matrix (NOM): objects × objects, with the relationship written in each cell. Prater calls it "a scalable entity-relationship diagram".
   - CTA Matrix: object × role, with actions in the cells.
   - Object Map: a colour-coded inventory of attributes.
16. **Round 2, Requirements**:
   - Object Guide ("a glossary on steroids").
   - MCSFD for relationships: Mechanics, Cardinality, Sorting, Filtering, Dependencies.
   - Object-oriented user stories grown from the CTA Matrix.
   - Per attribute: conditional logic, possible values, required fields.
   The 2026 course page reframes this round as three C's: Clarity, Capability, Conditions (conditions = variants driven by permissions or logic) [ooux.com/masterclass-ooux-certification].
17. **Round 3, Prioritization**:
   - Downgrade, eliminate, offload or combine objects.
   - A **Nav Flow** that shows contextual navigation.
   - Phase CTAs and place them by user priority.
   - Phase and force-rank attributes into a focused Object Map.
   The process ranks twice: first by business (scope and roadmap), then by user importance [ORCA article; course page].
18. **Round 4, Representation**: sketch **cards, details, lists and landing pages**, link them into a prototype, and test it with four questions:
   - Are these the right, recognisable objects?
   - Do the connections feel natural, or are relationships missing?
   - Are the CTAs relevant, useful and findable?
   - Are attributes missing or extraneous, and can users sort and filter usefully?
   "Then and only then" come user flows and detailed interaction design. The article calls ORCA "a 15-step meat-grinder of a process"; the bullets sum to 15 (4+4+4+3) [ORCA article].
   The ALA 2021 figure names the 15 steps:
   - Object / Relationship / CTA / Attribute Discovery;
   - the same four as Requirements;
   - the same four as Prioritization (the round is subtitled "For users and for the business");
   - "Representation with Cards, Details, and Lists": Sketching, Prototyping, Testing [ALA 2021 figure 1].
19. Where ORCA sits: a "third diamond" (synthesis/structure) between the research and design diamonds of the Double Diamond. It works as a gauntlet: weak research sends you back to research with specific open questions [ORCA article; ALA 2021].
   - The process is scalable, from an 8-week modelling effort down to 2-hour sessions.
   - It applies "to a massive redesign of a complex legacy enterprise system" or to a single feature [course page FAQ].
20. Advanced moves listed for 2026 under "Monkey Wrenches and Power Moves" [course page]:
   - Junction Objects: objects that change in the context of other objects; "developers might call these join tables".
   - Tree Systems (for example MOVIE / SHOWTIME / TICKET).
   - Inheritance (VEHICLE vs CAR/TRUCK/MOTORCYCLE).
   - Content Prototyping in Notion/Airtable ("coming soon").
   Round 4 on the same page adds a **Shapeshifter Matrix** for object variants.
   The certification runs 12 weeks at about 10–12 h/week with 14 assignments [course page]. Prater has run 11 cohorts as of 2026 [ooux.com/people/sophiavprater].

Finding objects and aligning a team (2021; 2022)
21. Noun-foraging sources:
   - The product's marketing site.
   - Competitors' sites.
   - Labels in the existing product.
   - User and stakeholder interview notes.
   - Customer-service logs.
   - Search logs. People search for instances ("UAV", "ESD"), so ask "what is this an instance of?", which led to LABS in the GTRI example [ALA 2021; Undercover OOUX §1–2].
22. **SIP test** for whether a noun is an object:
   - Structure: does it have attributes?
   - Instances: can you name examples?
   - Purpose: does it matter to users and the business?
   Components such as dropdowns and date pickers are packaging, not objects: "your UX system is not your design system" [ALA 2021].
23. Object Definition Workshop question sequence [ALA 2021]:
   1. What is this thing? Everyone writes a private definition first.
   2. What do users call it?
   3. Are these the same thing or different?
   4. How do they relate?
   5. Is it in scope? Participants sort the objects from most to least important, in small breakout groups or individually, and everyone reveals their order at once.
   6. Draw the relationships with "has a" / "has many" verbs.
   Keep an open-questions parking lot. Rate each question by the risk of guessing wrong, then ask for 6–8 user interviews.

How objects map to screens and navigation
24. The prioritisation outline on the course page [ooux.com/offerings/fourfails]:
   - Object prioritisation is "your first hint at navigation".
   - Relationship prioritisation designs the Nav Flow.
   - CTA prioritisation is "button placement": actions attach to the object they act on.
   - Attribute prioritisation ("Sketching with Sticky Notes") sorts and ranks attributes to organise each object's content.
   The same page pairs each failure below with a design move: distinct object design (masked), connected objects that flow (isolated), CTA placement (broken), intentional shapeshifting (arbitrary variants).
25. The four object failures, which Prater calls "the Four Horsemen of the Internet Apocalypse" [ooux.com/product/4mistakes, Wayback 2021]. Sources: ooux.com/offerings/fourfails; ALA 2017 covers the first three.
   - **Shapeshifting**: the same object takes different forms in different contexts. Examples are the Google Docs vs Drive file tile, whose menus share only Remove and Rename, and a meetup shown three ways. Fix: one canonical module for all contexts, and vary it only deliberately. Varying may be worth it for power-user tools.
   - **Masked objects**: different object types share one package, so users cannot predict what lies "behind the door". Examples are the Amazon home tiles and App Store thumbnails. Fix: distinct modules for distinct objects. Gestalt grouping makes same-shaped items read as the same kind of thing.
   - **Broken objects**: one object's data and actions are scattered across tabs, menus and settings. Example: on Winc, the delivery date was in Order History but rating lived only in Ratings. Fix: keep the object whole wherever it appears.
   - **Isolated objects**: objects that do not connect to related objects. Fix: navigation that follows how people move between objects. Only the course-page summary was read for this one.
26. Visual design can undo object work. Tell the visual designer why cards differ (different objects) and why attributes are ordered as they are, or they may assume those choices were arbitrary [Undercover OOUX §7].
   - The same article shows how long the structure lasted. As of Jan 2022, the GTRI IA was "still identical" to her 2017 design and had "served them well over the last five years", while the visuals had decayed.

## What it changes for the skills
- skills/design-studio/references/process/redesign.md:
  - The function map runs ORCA Discovery in miniature: Objects → Relationships → CTAs → Attributes, which replaces or extends the current "objects / actions / flows" trio.
  - Flows are drawn only after the object set is validated.
  - Nouns are foraged from routes, API, data model, docs, UI labels and search/support logs, not from screenshots, which matches 0.7.0.
  - Apply the SIP test. Treat collection nouns (calendar, map, catalog, library) as views, not objects.
  - Record object states, and record cardinality ("has many").
  - Derive the structural axes from the ranked map:
    - top objects → navigation candidates
    - relationships → contextual links and nested lists on detail views
    - CTAs placed on their object, conditioned by role and state
    - attribute rank → card and detail order
    - metadata → sort and filter controls
- skills/design-studio/templates/function-map.md: give it these tables:
  - Objects: name, definition, SIP, example instances, volume, states.
  - NOM: object × object with cardinality.
  - CTA matrix: role × object → CTA, condition, priority.
  - Attributes: core or metadata, sortable/filterable, rank.
  - Open questions, each with a risk-if-wrong rating.
  Use the four representation primitives: card, detail, list, landing.
- skills/design-studio/references/disciplines/product-ui.md: add object-consistency rules:
  - One canonical card per object across contexts.
  - Distinct packaging per object type.
  - An object's data and actions stay together.
  - Every object is reachable from its related objects (no dead ends).
  - Top navigation is the fallback, not the only path.
- skills/critique-design/references/heuristics.md: add the four object failures (shapeshifting, masked, broken, isolated) as named checks with the fixes above.
- skills/design-studio/references/process/directions.md: product-UI directions that restructure should state which object ranking and which relationships they are built on. Visual-only variation stays insufficient, as already required.

## Not verified / open
- Nothing Prater authored and freely available defining "isolated objects" in full was found. That definition comes only from the course-page summary.
- No independent or peer-reviewed evaluation of OOUX outcomes was found. The CNN (2012/2016) and GTRI (2017) results are the author's own case reports.
- It was not verified whether the "ORCA Handbook" (waitlist in 2022) has been published.
- The NN/g UX Podcast episode with Prater (listed at ooux.com/resources/nng-whatisooux) was not listened to.
- Ecosystem note: an MIT agent skill that runs ORCA sessions exists, github.com/s1dd4rth/ooux-skill @317b318 (2026-06-20, 3 stars). It is not first-party and was not reviewed.
