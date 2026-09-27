---
title: Accessibility (WCAG 2.2, law by market, WCAG 3 and APCA status)
evidence: digest
sources: [wcag-22, accessibility-law, web-baseline-2026, apple-hig-bars, harmonyos-design]
reviewed: 2026-09-27
review_by: 2026-12-26
---

# Accessibility

WCAG 2.2 AA is the design target on every surface and target, whatever the local law names. Legal
floors are equal or lower and change by market; they are dated below. Owners elsewhere: contrast
minima and how to compute them in [color](color.md); target sizes in
[layout-and-spacing](layout-and-spacing.md); motion and reduced motion in
[motion](../disciplines/motion.md) §5; the state matrix, forms and drag alternatives in
[product-ui](../disciplines/product-ui.md); glass in [materials](materials.md).

Contents: the target · success criteria · floating bars and focus · user settings · checks on the
render · CJK large text · WCAG 3 and APCA · law by market · China 适老化 · what the designer delivers.

## The target

- Conforming to 2.2 also conforms to 2.1, except that 2.2 removed 4.1.1 Parsing: a policy bound to
  2.0 or 2.1 may still test it. W3C recommends 2.2 as the target even where obligations name an
  earlier version.
- AAA where it is cheap: Focus Appearance (2.4.13) and the enhanced target size (2.5.5).
- Native apps: EN 301 549 clause 11 applies the WCAG criteria to software (11.2.5.8 applies the
  24 px target criterion to non-web software).

## Success criteria that shape the design

| SC (level) | Requirement | The design must show |
| --- | --- | --- |
| 1.4.1 Use of Color (A) | colour is never the only way to convey information or state | an icon, word, shape or underline beside every colour cue ([color](color.md), Colour vision) |
| 1.4.3, 1.4.6, 1.4.11 Contrast (AA, AAA, AA) | minima and the computation rules in [color](color.md) | every text and UI pair computed in both themes and every state; glass measured on the backdrop |
| 1.4.4 Resize Text (AA) | 200 % without loss | no fixed heights on text containers; rem-based type; fluid type keeps a rem term ([typography](typography.md)) |
| 1.4.10 Reflow (AA) | no two-dimensional scrolling at 320 CSS px wide (vertical content) or 256 px tall (horizontal content); 320 px is 1280 px at 400 % | a 320 px render. Exempt: maps, diagrams, video, games, slides, data tables as a whole, toolbars that must stay in view while editing |
| 1.4.12 Text Spacing (AA) | nothing lost when users set line height 1.5×, paragraph spacing 2×, letter spacing 0.12×, word spacing 0.16× the font size | no clipping or overlap under the override (checks below); CJK conforms with the properties it has |
| 1.4.13 Content on Hover or Focus (AA) | popups are dismissible without moving pointer or focus (Esc), hoverable, and persistent | the tooltip or hover-card spec states all three; the browser `title` tooltip is exempt |
| 1.3.4 Orientation (AA) | not locked to portrait or landscape unless essential | the rotation behaviour of each phone surface |
| 2.4.7 Focus Visible (AA) | a visible keyboard focus indicator | a focus style on every interactive element in every theme |
| 2.4.11 Focus Not Obscured, Minimum (AA) | the focused element is not entirely hidden by author content; 2.4.12 (AAA): no part hidden | `scroll-padding` under every sticky or floating bar (next section) |
| 2.4.13 Focus Appearance (AAA) | indicator area at least a 2 CSS px perimeter of the component (4w + 4h: 90 × 30 gives 480 px²), with 3:1 change of contrast between focused and unfocused pixels | a 2 px outline or outset ring passes; an inset line needs at least 3 px; a two-colour ring on mixed backgrounds and glass |
| 2.5.8, 2.5.5 Target Size (AA, AAA) | [layout-and-spacing](layout-and-spacing.md) | hit areas drawn or annotated |
| 2.5.7 Dragging Movements (AA) | every drag also works with a single pointer without dragging, unless essential | the alternative drawn: tap-to-set on a slider track, move up/down, a "move to" menu ([product-ui](../disciplines/product-ui.md)) |
| 2.5.1 Pointer Gestures, 2.5.4 Motion Actuation (A) | multipoint and path gestures have a single-pointer alternative; shake and tilt have a control and can be turned off | the button equivalent of each gesture |
| 3.3.7 Redundant Entry (A) | information already given in the process is filled in or selectable | pre-filled steps in multi-step flows |
| 3.3.8 Accessible Authentication, Minimum (AA) | no cognitive test (remembering, puzzles) unless there is an alternative, a helper (password managers, paste allowed), object recognition or the user's own content; 3.3.9 (AAA) drops the last two | sign-in that accepts paste and autofill; a CAPTCHA alternative |
| 3.2.6 Consistent Help (A) | help that repeats across pages keeps its relative order | the help entry in one place on every screen |
| 2.2.1 Timing Adjustable (A) | turn off, adjust to at least 10×, or warn with at least 20 s to extend, at least 10 times | the timeout warning and extend action (sessions, codes, holds) |
| 2.2.2, 2.3.1, 2.3.3 | auto-motion, flashes, motion from interaction | [motion](../disciplines/motion.md) §5 |

## Floating bars and focus

Floating tab bars (iOS 26, HarmonyOS 6.1 floating tabs), sticky headers and footers, bottom sheets,
chat composers and cookie banners are the usual cause of 2.4.11 failures (F110: a sticky bar
completely hides the focused element).

- Set `scroll-padding-top` and `scroll-padding-bottom` to the bar height plus its margin (technique
  C43), and pad the end of the content the same amount ([portable-mockups](portable-mockups.md)).
- A non-modal overlay that can cover the page either takes focus or leaves room for it.
- A focus ring on glass sits on a changing backdrop: measure its 3:1 at rest and scrolled, or use a
  two-colour ring (technique C40).

## User settings: respect them, never override them

EN 301 549 V4.1.1 makes it explicit: a web page must not block the user agent's preference modes
(9.7), and software follows platform settings for colour filters, contrast, text size, pointer
size and text cursor (11.7).

| Setting | Web signal | Design response |
| --- | --- | --- |
| Reduce motion | `prefers-reduced-motion` | the reduced column ([motion](../disciplines/motion.md) §5) |
| Reduce transparency | `prefers-reduced-transparency` (Chromium only) | solid materials; the default must already be legible ([materials](materials.md)) |
| Increase contrast | `prefers-contrast: more` | strong border and text steps ([color](color.md)) |
| Forced colours (Windows contrast themes) | `forced-colors: active` | system colours replace yours; borders carry every boundary and state ([color](color.md)); `forced-color-adjust: none` only where essential |
| Text size | Dynamic Type, font scale, 适老化 steps, browser zoom | layout reflows; platform steps in the [platform file](../platforms/README.md) |
| Theme | `prefers-color-scheme` | both themes designed and measured ([color](color.md)) |

Under forced colours, also check that SVG icons use `currentColor` (background-image icons vanish),
focus and selection stay visible, and no meaning rests on a background colour or image.

## Checks on the render

Expose each check as a state of the mockup so it renders as its own PNG:

- **Reflow**: `node "$S/capture.mjs" <file> --viewports 320x640` (`S` = `skills/design-studio/scripts`) and
  `node "$S/lint.mjs" <file> --viewports 320x640` (lint fails on sideways page scroll).
- **Zoom 200 %** on a 1280 px window equals a 640 px CSS viewport: capture at `640x400`.
- **Text spacing**: a `?check=spacing` state that adds the override, then look for clipping:

  ```css
  * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
  p, li, dd { margin-block-end: 2em !important; }
  ```

- **Reduced motion**: `capture.mjs --reduced-motion`. **Forced colours**: capture.mjs has no switch;
  emulate with Playwright `page.emulateMedia({ forcedColors: 'active' })` or Chrome DevTools >
  Rendering.
- **lint.mjs** covers text contrast, unnamed controls, target size and missing alt text (warnings;
  `--strict` fails them). It does not check focus visibility, focus order or non-text contrast:
  those stay with the critique and `color_tools.py matrix --from tokens.css`.

## CJK large text

WCAG's "large scale" is 18 pt or 14 pt bold (24 px, 18.67 px bold) "or equivalent size for CJK
fonts", and gives no CJK number; any px value for Chinese is practice. In WCAG work apply the Latin
thresholds to CJK, never a smaller "CJK large". China's app 适老化 spec defines its own boundary
(below); it applies to work claiming that spec.

## WCAG 3 and APCA: status on 2026-09-27

- WCAG 3.0 is a Working Draft (2026-09-10). Its text-contrast requirement reads "meets @@[contrast
  measure to be determined]", with an editor's note that the algorithm is yet to be determined.
  APCA is not named anywhere in the draft, and the draft has no target-size provision. All 106 core
  and 74 supplemental requirements are marked "Developing".
- Timeline: a Candidate Recommendation snapshot is planned for Q4 2027, historically followed by
  about two more years before a final standard; a planned colour-algorithm note was deferred for
  lack of research. WCAG 2 will not be deprecated for several years after WCAG 3 is final.
- APCA is developed outside W3C as the APCA Readability Criterion (ARC). The `apca-w3` package
  (0.1.9, 2022) is under a "Limited W3 License", and the APCA name may be used only by correct,
  current implementations.
- So: WCAG 2.x ratios are the only conformance test. APCA Lc is reported beside them as a
  perceptual signal (thresholds in [color](color.md)), never instead of them and never called
  "WCAG 3".

## Law by market (perishable, as of 2026-09-27)

| Market | Instrument | Covers | Cited standard | Dates |
| --- | --- | --- | --- | --- |
| EU, private sector | European Accessibility Act, Directive (EU) 2019/882 | consumer services: e-commerce, consumer banking, e-books and dedicated software, passenger-transport websites, apps, e-tickets and real-time information, e-communications, AV media; products such as computers, phones, terminals, e-readers | functional requirements (perceivable, operable, understandable, robust); presumption of conformity only from a standard cited in the OJEU. EN 301 549 V4.1.1 (WCAG 2.2) was written for the EAA but is not yet cited; V3.2.1 is used in practice | applies from 2025-06-28; services may keep pre-existing products until 2030-06-28; V4.1.1 national dates: announcement 2026-11-30, publication 2027-05-31, conflicting standards withdrawn 2028-05-31 |
| EU, public sector | Web Accessibility Directive (EU) 2016/2102 | public-sector websites and apps | EN 301 549 V3.2.1 = WCAG 2.1 AA (Decision 2021/1339) | in force |
| US, state and local government | ADA Title II rule | web content and mobile apps | WCAG 2.1 AA | population ≥ 50,000: 2027-04-26; smaller and special districts: 2028-04-26 (interim rule of 2026-04-20; more rulemaking possible) |
| US, federal agencies | Section 508 | federal ICT | WCAG 2.0 A and AA | in force |
| US, private businesses | ADA Title III | - | no DOJ web technical standard in the sources read | - |
| International | ISO/IEC 40500:2025 | - | WCAG 2.2 (October 2023 text) | approved 2025-10-21 |
| China | 无障碍环境建设法 | publicly funded sites, platforms and apps "应当逐步符合" national standards; news, social, shopping, health, finance, education and transport apps encouraged; self-service terminals in banks, hospitals, stations and airports must offer voice, large type and braille | GB/T 37668-2019 (推荐性); a revision adopting WCAG 2.2 non-equivalently (plan 20252537-T-469) is in approval | in force 2023-09-01 |
| China | MIIT 适老化 notice (工信厅信管函〔2021〕67号) | websites and apps applying for the 适老化 badge | its Annex 1 (web) and Annex 2 (apps), plus GB/T 37668-2019 | pass at ≥ 60/100; the badge is valid 2 years, with spot checks |

- EAA details that change scope: service microenterprises (under 10 persons and at most EUR 2
  million turnover or balance sheet) are exempt; a disproportionate-burden claim must be documented
  and kept 5 years; pre-recorded media and office files published before 2025-06-28, third-party
  content the operator does not control and unmaintained archives are excluded.
- EN 301 549 V4.1.1 also sets a best-practice floor for the smallest text (x-height at least 8 CSS
  px) and, for kiosks closed to text enlargement, a mode with x-height at least 16 CSS px.
- Newer Chinese standards whose content was not read (do not quote numbers from them): GB/T
  45395-2025 mini-program accessibility; GB/T 46070-2025 mobile terminals (in force 2026-03-01);
  GB/T 47523-2026 app 适老化 (in force 2026-11-01); GB/T 45445-2025 e-commerce 适老化; GB/T
  47797-2026 government-service 适老化 (in force 2026-11-01).
- Not covered by the sources: UK, Canada, Japan (JIS X 8341-3), Korea, US state laws.
- Record the target markets and sectors in PRODUCT.md, derive the legal floor from this table, and
  state the conformance target (standard, version, level, market) in the handoff.

## China 适老化: the MIIT numbers

Apps (Annex 2):

- Type: sans-serif; size follows the system or an in-app setting; main functions and screens reach
  a largest size of at least 30 dp/pt; in the elder-mode UI (长辈版) main text is at least 18 dp/pt.
- Line spacing at least 1.3×; paragraph spacing at least 1.3× the line spacing.
- Contrast at WCAG's minima; text larger than 18 dp/pt counts as large (3:1).
- Targets: see the 适老化 row in [layout-and-spacing](layout-and-spacing.md#targets-and-density).
- Gestures give feedback; none needs three or more fingers.
- Pop-ups close only from the top-left, top-right or bottom-centre, with a hit area of at least
  44 × 44.
- Entry: a prominent switch on the home screen or a first-launch prompt, plus 长辈版 in Settings;
  in-app search finds 长辈版 and the aliases 亲情版, 关爱版, 关怀版.
- Puzzle and image CAPTCHAs have a text or voice alternative.
- No ads, ad plug-ins or random ad pop-ups in elder mode; no induced download or payment buttons
  anywhere in the app.

Websites (Annex 1): mobile web offers at least one font size of 18 dp/pt or more; desktop sites
offer page zoom and a large-text mode independent of OS and browser, full keyboard operation and an
extra-large cursor; visual CAPTCHAs (drag ones included) need 2× magnification and a voice
alternative; codes that expire in 3 minutes or less announce the limit by voice and extend to at
least 2×; legal and financial submissions are reversible within 10 minutes (flash sales excepted);
the layout is flat (no shadows, perspective or textures) or a separate simplified large-block
version exists; elder pages carry no ads or induced buttons.

## What the designer delivers

A still shows none of this, so annotate it: in the handoff spec
([handoff-spec](../../templates/handoff-spec.md)) and as numbered badges on an annotation state of
each screen (`?annotate=a11y`).

| Annotation | Specify |
| --- | --- |
| Headings | the level of every heading, one top-level heading per page or screen |
| Regions | header, navigation, main, complementary, footer; on native, the screen title and groups |
| Focus order | the order when it differs from the visual order; where focus lands on open and returns on close |
| Names | the spoken name of every icon-only control, image button and field: verb and object, not the icon's name |
| Images and charts | alt text for meaningful images, "decorative" for the rest; a text summary or table for each chart |
| States | expanded, selected, pressed, busy, invalid, disabled with its reason |
| Announcements | toasts, async results and errors: polite or assertive |
| Alternatives | the button for each gesture and drag; the CAPTCHA alternative |
| Resize behaviour | what wraps, truncates or scrolls at 200 % and at 320 px |
| Conformance | standard, version, level and market |
