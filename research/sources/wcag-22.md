# WCAG 2.2: the success criteria that shape visual and interaction design (plus WCAG 3 and APCA status)
- id: wcag-22 · url: https://www.w3.org/TR/WCAG22/ · fetched: 2026-09-27 · method: fetch
- review_by: 2026-12-26 · licence note: paraphrased digest, not a mirror (W3C Document License)
> 中文导语：WCAG 2.2 是现在全球法规和采购标准引用的无障碍基线（EN 301 549 v4.1.1、ISO/IEC 40500:2025 都以它为准）。这份摘要只收画稿和写规格时要用到的条款和阈值：对比度、目标尺寸、焦点、拖拽、重排、文本间距、认证。最后说明 WCAG 3 草案和 APCA 的现状：两者都还不能用来判定合规。

Read on 2026-09-27 (static HTML via curl): WCAG 2.2 Recommendation (`https://www.w3.org/TR/WCAG22/`, dated version
`REC-WCAG22-20241212`); Understanding pages for 1.4.3, 1.4.11, 2.4.11, 2.4.13, 2.5.7, 2.5.8 (`https://www.w3.org/WAI/WCAG22/Understanding/<slug>.html`);
WCAG 3.0 Working Draft (`https://www.w3.org/TR/wcag-3.0/`, dated version `WD-wcag-3.0-20260910`); WAI "WCAG 3 Introduction" (updated
2026-09-25); AGWG schedule wiki `https://github.com/w3c/wcag3/wiki/Schedule` (last edited 2026-09-10); APCA repos
`Myndex/SAPC-APCA@cbd08bf` (README), `Myndex/apca-w3@6c5c066` (LICENSE.md); npm `apca-w3`; `https://readtech.org/ARC/tests/bronze-simple-mode/`.

## Key facts
Status and versions
1. WCAG 2.2 is a W3C Recommendation, first published 2023-10-05 and republished with errata on 2024-12-12. Sites that conform to 2.2 also conform
   to 2.1 (#new-features-in-wcag-2-2), with one caveat: 2.2 removed 4.1.1 Parsing (marked "obsolete and removed", #parsing), so authors bound by
   policy to 2.0 or 2.1 "may need to continue to test and report 4.1.1" (#comparison-with-wcag-2-1). AGWG recommends adopting 2.2 as the target
   even where obligations name an earlier version.
2. Nine criteria are new in 2.2 (#new-features-in-wcag-2-2): 2.4.11 Focus Not Obscured (Minimum) **AA**, 2.4.12 Focus Not Obscured (Enhanced) AAA,
   2.4.13 Focus Appearance **AAA**, 2.5.7 Dragging Movements **AA**, 2.5.8 Target Size (Minimum) **AA**, 3.2.6 Consistent Help **A**,
   3.3.7 Redundant Entry **A**, 3.3.8 Accessible Authentication (Minimum) **AA**, 3.3.9 Accessible Authentication (Enhanced) AAA.

Contrast
3. **1.4.3 Contrast (Minimum), AA**: text and images of text at least **4.5:1**; large-scale text **3:1**. No requirement for text in inactive
   (disabled) components, pure decoration, invisible text, incidental text inside a picture, or logotypes (#contrast-minimum).
4. **1.4.6 Contrast (Enhanced), AAA**: **7:1**, large-scale text **4.5:1**, same exceptions (#contrast-enhanced).
5. "Large scale" = at least **18 pt, or 14 pt bold**, "or font size that would yield equivalent size for CJK fonts" (#dfn-large-scale). No CJK number
   is given; note 5 of the definition only says the CJK equivalents are that language's minimum large-print size and the next larger standard
   large-print size. Understanding 1.4.3: 1 pt = 1.333 CSS px, so 14 pt and 18 pt are "approximately 18.5px and 24px" (the exact conversion is
   14 x 4/3 = 18.67 px).
6. Thresholds are not rounded: Understanding 1.4.3 says a computed **4.499:1 does not meet 4.5:1**.
7. Contrast ratio = (L1 + 0.05) / (L2 + 0.05), range 1–21. The sRGB linearisation threshold is **0.04045** (the older 0.03928 was corrected in
   May 2021 and "has no practical effect") (#dfn-contrast-ratio, #dfn-relative-luminance). Specifying a text colour without a background colour, or the
   reverse, is itself a failure (note 4 of the contrast-ratio definition).
8. **1.4.11 Non-text Contrast, AA**: **3:1 against adjacent colour(s)** for the visual information needed to identify UI components and their
   states, and for the parts of graphics needed to understand the content. Exempt: inactive components; controls whose look is set by the user agent
   and not modified by the author; graphics whose particular presentation is essential (#non-text-contrast). Understanding 1.4.11: a control does
   not need a visible boundary if its text or icon already shows it is there, but if a border is the only thing marking an input, that border must
   reach 3:1 (the example is `#767676` on white). For gradients, take the central colour of the object; the testing principles add: with several
   colours, test the least-contrasting area and ask whether the object is still understandable without it. Each pie slice has to be
   distinguishable unless the values are also given in a conforming way.
9. **1.4.1 Use of Color, A**: colour is never the only way to convey information, indicate an action, prompt a response or distinguish an element.

Layout, zoom, text
10. **1.4.10 Reflow, AA**: no two-dimensional scrolling and no loss of content at a width of **320 CSS px** (vertical-scrolling content) or a height
    of **256 CSS px** (horizontal-scrolling content). 320 px = 1280 px viewport at **400 % zoom**. Exceptions: content that needs a 2-D layout (maps,
    diagrams, video, games, slides, data tables as a whole, toolbars that must stay in view while editing) (#reflow).
11. **1.4.12 Text Spacing, AA**: no loss of content or function when the user sets **line height 1.5x** the font size, **paragraph spacing 2x**,
    **letter spacing 0.12x**, **word spacing 0.16x**. Authors do not have to use these values, only survive them. Scripts that lack one of these
    properties conform using only the properties that exist (#text-spacing), which matters for CJK letter and word spacing.
12. **1.4.4 Resize Text, AA**: text resizes to **200 %** without assistive technology and without loss (#resize-text). **1.3.4 Orientation, AA**:
    do not lock to portrait or landscape unless essential.
13. **1.4.13 Content on Hover or Focus, AA**: tooltips, sub-menus and other hover/focus popups must be **dismissible** without moving the pointer
    or focus (e.g. Esc; not required if the content reports an input error or covers nothing), **hoverable** (the pointer can move onto them without
    them closing), and **persistent** until the trigger is removed, the user dismisses them, or they are no longer valid. User-agent-controlled
    content (the `title` tooltip) is exempt (#content-on-hover-or-focus).

Focus
14. **2.4.7 Focus Visible, AA**: a visible keyboard focus indicator exists.
15. **2.4.11 Focus Not Obscured (Minimum), AA**: a focused component is **not entirely hidden** by author content. Understanding: sticky headers,
    sticky footers, non-modal dialogs and cookie banners are the typical causes; failure F110 is a sticky bar completely hiding the focused
    element; sufficient technique C43 is CSS `scroll-padding`. **2.4.12 (AAA)**: no part of the component is hidden.
16. **2.4.13 Focus Appearance, AAA**: the indicator area is **at least that of a 2 CSS px perimeter** of the unfocused component and has **3:1 change
    of contrast** between the same pixels focused and unfocused. Exempt when the author does not modify the user-agent indicator or its background
    (#focus-appearance). Understanding: perimeter area of a w x h rectangle = 4w + 4h (90 x 30 px -> 480 px²); a 2 px outline, outset ring or
    border passes, a 2 px line inset from the edge fails and needs to be at least 3 px; "change of contrast" is measured between states, unlike 1.4.11 which
    measures adjacent colours; technique C40 is a two-colour indicator for mixed backgrounds.

Pointer and input
17. **2.5.8 Target Size (Minimum), AA**: pointer targets at least **24 x 24 CSS px**, except: **Spacing** (an undersized target passes if a
    **24 px-diameter circle** centred on its bounding box does not intersect another target or another undersized target's circle), **Equivalent**
    control elsewhere on the page, **Inline** (in a sentence or constrained by line height), **User-agent** controls not modified by the author,
    **Essential or legally required** presentation. Sliders, gradient colour pickers and text-editing areas count as one target (#target-size-minimum).
    In practice: two undersized neighbours need centres at least 24 px apart, and each centre at least 12 px from any other target's edge.
18. **2.5.5 Target Size (Enhanced), AAA**: **44 x 44 CSS px**, with the Equivalent, Inline, User-agent and Essential exceptions but no Spacing exception.
19. **2.5.7 Dragging Movements, AA**: everything done by dragging can also be done with a **single pointer without dragging**, unless dragging is
    essential or the function is set by the user agent and not modified by the author (#dragging-movements). Understanding examples: tap a slider track to set the value; map pan buttons; move-up/move-down controls on a
    sortable list; a "move to" menu on a kanban card.
20. **2.5.1 Pointer Gestures, A**: multipoint or path-based gestures have a single-pointer, non-path alternative. **2.5.4 Motion Actuation, A**:
    shake or tilt features also have a UI control and can be switched off.

Forms and authentication
21. **3.3.7 Redundant Entry, A**: information previously entered by or provided to the user that is needed again in the same process is
    auto-populated or selectable, except when re-entry is
    essential, needed for security, or the old value is no longer valid (#redundant-entry).
22. **3.3.8 Accessible Authentication (Minimum), AA**: no cognitive function test (remembering a password, solving a puzzle) at any step unless there
    is an alternative method, a mechanism that helps (password-manager support, **copy and paste allowed**), or the test is **object recognition** or
    **identifying content the user provided** (#accessible-authentication-minimum). **3.3.9 (AAA)** drops the object and personal-content exceptions.
23. **3.2.6 Consistent Help, A**: when help (human contact details, a contact mechanism, self-help, a chatbot) repeats across pages, it keeps the
    same relative order (#consistent-help).

Motion and timing
24. **2.2.2 Pause, Stop, Hide, A**: moving, blinking or scrolling content that starts automatically, lasts **more than 5 s** and runs beside other
    content needs pause, stop or hide. **2.3.1, A**: nothing flashes **more than 3 times per second** above the flash thresholds. **2.3.3 Animation
    from Interactions, AAA**: motion triggered by interaction can be disabled unless essential. **2.2.1 Timing Adjustable, A**: turn off, adjust (to
    at least 10x the default), or extend (warn, at least **20 s** to respond, extendable at least 10 times); 20-hour exception.

WCAG 3 (not usable for conformance)
25. WCAG 3.0 is a **Working Draft dated 2026-09-10**. Its "Text contrast sufficient (minimum)" core requirement reads "meets @@[contrast measure to be
    determined]", and an editor's note says **"The contrast algorithm used in WCAG 3 is yet to be determined"**, assumed to include a size/weight
    factor (#text-contrast-sufficient-minimum). APCA is not named anywhere in the draft (0 matches for "APCA").
26. Other placeholders in the same draft: text style, block-of-text spacing and graphical-object contrast all read "@@[values to be determined]" or
    "minimum contrast ratio test" with no number. The focus guideline splits into "Focus indicator contrast sufficient" (core) and "Focus indicator
    size sufficient" (supplemental), with no numbers. The WD contains no target-size provision at all (0 matches for "target size"). By its
    requirement-type labels the draft has **106 core requirements, 74 supplemental requirements and 35 assertions**, all marked "Developing".
27. Conformance model in the draft (#conformance): conformance = all core requirements met. Proposed reporting tiers: 1 avoid physical harm,
    2 foundational access, 3 conformance, 4 Bronze, 5 Silver, 6 Gold (the tier sizes are "TBD"). A scoring alternative is also still open.
28. Timeline: the WAI intro (updated 2026-09-25, #timeline) says WCAG 3 is "not expected to be a completed W3C standard for a few more years", WCAG 2
    "will not be deprecated for several years after WCAG 3 is finalized", and "the best way to prepare… is to meet WCAG 2.2 success criteria now".
    The AGWG schedule wiki plans a December 2026 WD and a **Candidate Recommendation Snapshot in Q4 2027**, and says historically another ~2 years
    follow before final publication. The Q3 2026 row says a possible colour-algorithm note was deferred: "Research is not sufficient to do this at
    this time".

APCA
29. APCA (Accessible Perceptual Contrast Algorithm, Myndex) is now developed outside W3C: the README points design guidance to the independent
    **APCA Readability Criterion (ARC)** at readtech.org (Inclusive Reading Technologies, a California nonprofit). The Silver-era W3C whitepaper link
    is kept "for historical reasons".
30. ARC Bronze Simple Mode thresholds (page marked beta): body text minimum **Lc 75**, preferred **Lc 90**; other content text minimum **Lc 60**; large
    fluent text **> 36 px** minimum **Lc 45**, maximum **Lc 90** (large only). Spot text (placeholder, disabled, copyright bugs), logos and incidental
    text are not covered; there is no minimum font size in Bronze.
31. Code and licence: npm `apca-w3` latest **0.1.9 (2022-07-04)**, licence "Limited W3 License". The LICENSE licenses the code to W3C/AGWG for WCAG
    use only. Using the APCA name is allowed only for implementations that are correct and current. The reference algorithm is **0.0.98G-4g** with an
    output clamp at approximately **±Lc 10**. Non-compliant implementations (wrong polarity or wrong constants) are declared "in breech of license".

Added 2026-09-28 (Understanding 2.1.4 read, `https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html`)
32. **2.1.4 Character Key Shortcuts, A**: a shortcut made only of printable characters (letters, digits, punctuation, symbols, including
    Shift combinations such as Shift+/) must be possible to turn off, or to remap to include a non-printable key (Ctrl, Alt), or be active
    only while its component has focus. Rationale: speech-input users trigger single-letter shortcuts by talking; users with tremor hit keys
    by accident.

## What it changes for the skills
- skills/design-studio/references/fundamentals/accessibility.md: carry facts 3–24 as the design floor (AA), with 2.4.13 and 2.5.5 as recommended
  AAA targets. Replace any "APCA is part of WCAG 3 / draft guidance" wording with facts 25, 29–31: WCAG 3 contrast is TBD, APCA is an independent
  criterion (ARC). WCAG 2.x ratios stay the only conformance test.
- skills/design-studio/references/fundamentals/color.md: large text = 24 px, or 18.67 px bold (W3C prose says "approximately 18.5px"); no rounding
  (4.499 fails); 3:1 for input borders, icons, focus rings and chart marks; test gradients at the object's centre colour. The current
  `color.md:59` line "legal reference in most places" belongs to accessibility-law, not here. Keep the APCA rule of thumb (Lc 75 / 60 / 45) but
  source it to ARC Bronze and add Lc 90 preferred for body text.
- skills/design-studio/scripts/color_tools.py: fix the `apca_lc` docstring (it says "APCA is part of a WCAG 3 draft"). `verdict()` already
  compares unrounded ratios; print enough decimals (or floor) so "4.50:1" never appears next to a fail. The Lc 10 clamp matches the licence.
- skills/design-studio/references/fundamentals/layout-and-spacing.md and disciplines/product-ui.md: state 2.5.8 precisely (24 px box or the 24 px
  circle test), not "24 x 24 including spacing". Add 2.5.7 alternatives for every drag interaction (sortable lists, kanban, sliders, maps), 3.3.7
  for multi-step forms, 3.3.8 for sign-in (allow paste and password managers; no puzzle CAPTCHA without an alternative), and 1.4.13 for tooltips.
- skills/design-studio/references/platforms/README.md, platforms/ios.md, platforms/harmonyos.md and assets/mockup-kit: floating tab bars, glass
  toolbars and sticky footers must not fully cover the focused element (2.4.11): scroll-padding equal to the bar height. Glass surfaces need 4.5:1
  text measured on the rendered backdrop.
- skills/design-studio/references/disciplines/interaction.md: 2.1.4 (fact 32) for single-key shortcuts (J/K triage, `/` to search, `?` for help).
- skills/design-studio/references/disciplines/motion.md: 2.2.2 (5 s auto-motion needs pause), 2.3.1 (3 flashes per second), 2.3.3 (AAA, honour
  reduced motion).
- skills/critique-design/references/rubric.md + heuristics.md: make 1.4.3, 1.4.11, 1.4.10 (320 px), 1.4.12, 2.4.11, 2.5.7, 2.5.8, 3.3.7 and 3.3.8
  explicit binary FLOOR checks. Score focus appearance against 2.4.13 in the CEILING.
- skills/design-studio/scripts/lint.mjs: computed text contrast with no rounding, target boxes below 24 px that fail the 24 px circle test,
  horizontal overflow at 320 px width (reflow), and whether the focused element stays visible under sticky or fixed elements.

## Not verified / open
- Review trigger (perishable, +90d): the next WCAG 3 WD (planned December 2026) and any change in APCA/ARC status. The 2.2 criterion text is durable.
- The CJK "equivalent size" for large-scale text has no number in WCAG 2.2 or its Understanding doc. Any px value for Chinese text is practice.
- WCAG2ICT (applying 2.2 to native apps) was not read for this digest. For non-web software see EN 301 549 clause 11 in `accessibility-law`.
- The ARC page is labelled beta and can change without notice. The ARC Silver and Gold font lookup tables were not read.
- The WCAG 3 Editor's Draft (exploratory items, possibly including target size) was not read; only the published WD was.
- Fact-check 2026-09-27 (independent re-read of the TR, Understanding pages, WD markup, wiki, APCA repos and ARC page): corrected the WCAG 3
  provision counts (earlier text said 111 core / 80 supplemental, a raw text count that included prose), the 2.2-vs-2.0/2.1 conformance wording
  (4.1.1 caveat), "about 3 px" to "at least 3 px" (2.4.13 inset indicator), and added the missing exceptions to 1.4.11, 1.4.13 and 2.5.7.
  The AGWG wiki "last edited 2026-09-10" is UTC; the commit time is 2026-09-09 20:55 -04:00.
