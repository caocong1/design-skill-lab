---
title: Truth files, design read and host inspection
evidence: digest
sources: [impeccable, design-md-spec, taste-skill]
reviewed: 2026-09-27
review_by: 2027-09-27
---

# Truth files

Loop steps 1-2 of [SKILL.md](../../SKILL.md): inspect the host, then write what the design must be
true to. Owns: host inspection, which truth file holds what, the design read, the referent and scene
sentences, taste-word translation, surface contracts and visitor modes, the question budget.

Contents: 1 Inspect the host · 2 Which file holds what · 3 Design read · 4 Referent and scene ·
5 Taste words · 6 Surface contracts · 7 Questions · 8 By effort

## 1. Inspect the host

Before any file or question, find what already decides the design, so nothing is forked or re-asked.

| Look for | Typical places | What it decides |
| --- | --- | --- |
| System of record | `DESIGN.md`, `.stitch/DESIGN.md`, `*.tokens.json`, `tailwind.config.*`, `@theme` blocks, `:root` custom properties, antd `ConfigProvider` / MUI `createTheme` / TDesign or Arco theme files | It is the system; update it in place ([system](system.md)) |
| Component library | `package.json`: antd, @arco-design, tdesign-*, element-plus, @mui, @fluentui, vant, `components.json` (shadcn) | What a direction changes cheaply (theme props, tokens) and what costs custom components |
| Fonts | `@font-face`, font files, `next/font`, font CDN links | Keep or replace, and the licence ([licensing](../fundamentals/licensing.md)) |
| Icons and brand | icon package or iconfont, SVG folders, logo files, brand PDFs, app icons | One icon family; brand stays a constraint in every mode, redesign included |
| Targets | breakpoints; Capacitor, Electron, Tauri; `app.json` (mini-program), `module.json5` (HarmonyOS), Xcode or Gradle projects, Office add-in manifest | Frames and the platform files to load ([platforms](../platforms/README.md)) |
| Content | locale files (languages, longest strings), seed data, real copy | Real content for mockups; mixed-script stress cases |
| Conventions | `AGENTS.md`, `CLAUDE.md`, `design/`, `docs/design/`, `.design/`, Storybook | Output location and earlier decisions |
| Structure (redesign) | routes, API schema, data models, permissions | The function map ([redesign](redesign.md)) |

```sh
rg --files -g '!node_modules' | rg -i '(^|/)design\.md$|tokens?\.(json|css)$|tailwind\.config|theme\.(ts|js|json)$|(^|/)app\.json$|module\.json5$|\.woff2?$|logo[^/]*\.svg$'
rg -o --no-filename -g '*.{css,scss,less}' -g '!node_modules' -e '--[a-z0-9-]+:' | sort | uniq -c | sort -rn | head -40
```

Write one line per finding into PRODUCT.md > Constraints, e.g. "System of record: `src/theme.ts`
(antd tokens) + `src/styles/vars.css`". In a redesign, inspect code and assets now; screenshots of
the current UI wait until the directions are sketched ([redesign](redesign.md)).

## 2. Which file holds what

| File | Lifetime | Holds | Never holds |
| --- | --- | --- | --- |
| [PRODUCT.md](../../templates/PRODUCT.md) | changes when the product changes | roles, jobs with frequency, constraints, voice, what never changes silently, evidence, non-goals | visual decisions, this round's asks |
| [brief.md](../../templates/brief.md) | one per round or feature | design read, referent, scene, attributes, content, references, deliverables, assumptions, questions | product facts: link PRODUCT.md |
| [surfaces/&lt;surface&gt;.md](../../templates/surface-contract.md) | one per surface; completed after converge | visitor mode, thesis, own-world, story, first viewport, form + seed, finish line | shipped code; product facts |
| [function-map.md](../../templates/function-map.md) | redesign or a complex product | objects, relationships, actions, attributes, equity, migration | visuals |
| [decisions.md](../../templates/decisions.md) | append-only | decisions, rejected options, seeds, deviations | reasoning nobody will reread |

- Read existing truth files first and never re-ask what they settle. When a fact changes, edit the
  file and add a row to decisions.md.
- If the host already has a product doc or PRD, link it from PRODUCT.md instead of copying it.
- Mark guesses as "assumed". A direction built on an unmarked guess is a guess presented as a fact.
- Keep each file about one screen. Quick work can live in chat (section 8).

## 3. The design read

State it before producing anything, at every effort level (in chat for quick work):

> Reading this as <kind of thing> for <audience>: <two or three qualities>; <convention or novelty,
> and why>. Mode: <mode>. Effort: <effort>.

- Name the kind of thing precisely: "an on-call triage console", not "a dashboard".
- Convention or novelty follows frequency and stakes. Daily, high-stakes Operate surfaces lean
  convention; a Persuade or Experience surface seen once has room for novelty. Say which and why.
- Weak: "A modern, clean dashboard for our users."
- Strong: "Reading this as a bid-tracking console for six procurement officers who work in it all day
  on 24-inch monitors: calm, dense, keyboard-first; convention over novelty, because they already
  know the workflow and use it 40 times a day. Mode: redesign. Effort: deep."
- 中文示例："理解为：给连锁奶茶店店长看的每日经营小程序首页，早上开店前在手机上看两分钟：一眼看清昨日营收和今日备料，
  数字优先、不花哨；遵循小程序惯例，因为店长每天只用它两分钟。模式：piece。力度：standard。"

## 4. Referent and scene

Adjectives name a region; a specific reference names a point (DESIGN.md philosophy). "Modern, clean,
premium" steers to the centre of what those words describe, which is the generic answer.

**Referent.** One sentence: "Like <specific thing>: <quality to take>, not <quality to leave>."

1. List things from the audience's world, not from design galleries or the product category:
   objects, places, publications, instruments, signage, rituals.
2. Pick the one whose qualities match the attributes. Test it: would two designers given this
   sentence choose similar type, colour and density? If not, it is still an adjective.
3. A competitor is not a referent. "Like Linear" is the category rut in a sentence.

| Product | Adjectives (a region) | Referent (a point) |
| --- | --- | --- |
| Freight dispatch console | modern, efficient | Like a railway departure board: one line per job, status by position, not its flicker |
| Children's reading app | warm, playful | Like a library picture-book corner: low shelves, covers face out, big labels; not a cartoon mascot |
| Tax filing form | trustworthy, simple | Like a well-set paper tax form: numbered boxes, the instruction beside its field; not bureaucratic grey |
| 茶饮点单小程序 | 年轻、有质感 | Like the handwritten menu board over the counter: few items, big prices, chalk-white on dark; not a menu of photos |

With `options`, a referent the user gave is pinned onto the board; the rest come from the seven
referents in [directions](directions.md). Without options, the brief's referent anchors the design.

**Scene.** One physical sentence: who, where, on what screen, under what light, for how long. It
decides light or dark, density and type size. Light or dark is never a default.

- "Night-shift nurse at a ward station, 24-inch screen in a dimmed room, three-second glances between
  patients" > dark-capable, large status, few words.
- "Commuter on a phone in daylight, one hand, twenty-second sessions" > light, large targets, one column.

## 5. Taste words

Translate every taste word into moves before designing, and write the moves into the brief's
attributes as "X, not Y". If two words conflict (高级 and 年轻), ask which wins on the primary surface.

| Word | Usually means (moves) | Default reading to avoid | Settle with |
| --- | --- | --- | --- |
| 高级感 · premium | restraint: one accent or none, more space, finer text face with a large display-to-text step, quiet slow motion, real photography | black and gold, gradients, glass, cream + italic serif | the premium object the audience owns or admires |
| 科技感 · techy, futuristic | precision: tabular numerals, exact grid, crisp states, data legible at a glance | neon blue on navy, glow, particles, HUD frames | what the audience trusts: a lab instrument, a terminal, a cockpit |
| 简洁 · 干净 · clean | clear hierarchy, alignment, fewer competing elements, one spacing scale | emptiness, unlabelled icons, grey-on-white text | which tasks must stay one click away |
| 大气 · grand, confident | large scale contrast, generous margins, few big elements, strong axis | everything large, stock skyline, red and gold | what the one hero element is |
| 年轻化 · younger, fresh | committed colour, bolder type scale, casual voice, one playful moment | rainbow gradients, emoji icons, meme copy | which age group and the apps it uses daily |
| 专业 · 商务 · professional | consistency, expert density, conventional patterns, precise copy | navy + stock handshake, default blue | whose standard: a bank, a law firm, an engineering tool |
| 有质感 · 精致 · refined | small-scale craft: one radius logic, optical alignment, tuned borders, tabular numerals, CJK punctuation | heavy textures, blur everywhere, shadows on everything | which surface gets the craft budget |
| 温暖 · 亲和 · warm, friendly | warmer neutrals, humanist type, plain-language copy, real people | cream + serif + terracotta, mascots | a referent from the audience's home or street |
| 活泼 · 可爱 · playful | colour and shape play, springy motion at feedback moments, illustration | play on actions repeated all day | where play is allowed: onboarding, empty states, success |
| 国潮 · 中国风 · Chinese style | one named tradition (青花, 宋式, 民国 print, 敦煌), its real colours and materials, a face with that character | red + gold + clouds + brush font everywhere | which tradition and which material |
| 现代 · modern | current platform conventions and type rendering; a date, not a style | Inter + purple gradient + card grid | which release (iOS 26, M3 Expressive) or referent |
| 有设计感 · designed | one memorable idea carried through | decoration everywhere | the surface contract's one memorable idea (Own-world) |
| 极简 · minimal | fewer elements with a strong type hierarchy | hidden navigation, low contrast | what may not be removed |
| 沉稳 · calm, serious | low chroma, stable layout, motion only as feedback | all grey, no hierarchy | the one thing allowed to stand out |

## 6. Surface contracts and visitor modes

Pick the visitor mode per surface, never per product:

| Mode | The visitor | It decides |
| --- | --- | --- |
| Operate | works in it repeatedly | density, convention, restrained colour, motion as feedback only; first viewport = the primary task |
| Persuade | decides whether to act | story order, one claim per viewport, proof, room for committed colour |
| Read | reads to learn | measure, type scale, in-page navigation, little chrome |
| Experience | came for the experience | scale, imagery, motion; the idea may lead convention |

A tool's landing page is still Persuade; a fashion house's documentation is still Read.

Write one [surface contract](../../templates/surface-contract.md) per surface with its own job (a
route family, a screen family, a page), not per state:

- At step 2: visitor mode, thesis, story, first viewport. After converge: own-world (with its one
  memorable idea) and form + seed, taken from the chosen direction card and decisions.md.
- The finish line is 3-6 conditions a critic can check on screenshots. Include the primary task at
  the smallest target and the one memorable idea. "Feels premium" is not checkable; "the queue count
  and the next deadline read at arm's length in the 1280 shot" is.
- The contract never goes into shipped code, comments, bundles or metadata.
- The fresh critic audits the render against every block ([critique-design](../../../critique-design/SKILL.md)).

## 7. Questions

- Infer first from the host, the user's words and any links. Then ask at most three questions, and
  only ones whose answer changes the direction: audience, referent or feeling, a hard constraint.
  Zero is a valid number.
- With each question, say what you will assume without an answer, and proceed on it.
- When the user cannot say what they want, a rendered options board is a better question than a
  questionnaire: show, then ask.
- Ask in the user's language.

## 8. By effort

| Effort | Truth files |
| --- | --- |
| `quick` | the design read in chat; read `.design/` if it exists, write nothing new |
| `standard` | brief.md, plus one surface contract when the piece is a screen or page; read PRODUCT.md if present |
| `deep` | PRODUCT.md, brief.md, one contract per surface; function-map.md in redesign |
