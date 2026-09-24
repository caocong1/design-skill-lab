---
name: iterate-design-lab
description: Maintain the design-skill-lab repository - add or correct entries in the curated design resource catalogue, absorb a new authoritative source (article, guideline, book, open-source project, another AI design skill) as a digest plus analysis, refresh a source against its new version, run the link and freshness check, digest usage feedback from feedback/inbox into skill improvements (evolve mode), or apply a skill-only improvement to the design-studio suite. Codifies the catalogue schema, tiering rules, generated views, versioning, CHANGELOG, SOURCE_INDEX metadata, analysis format, commit cadence and the invariants gate. Use only inside this lab repository.
metadata:
  version: 0.2.0
  short-description: Iterate the design skill lab
---

# Iterate Design Lab

Maintenance counterpart of `design-studio`. Use it only inside this lab. For
doing design work in other projects, use `design-studio`.

## Modes

Pick the mode first:

- `add-resource`: the owner supplies sites (or asks for more in an area) to add
  to the catalogue. The most common mode.
- `fix-resource`: a link died, a site moved, a licence or paywall changed.
- `add-source`: a new authoritative source deserves a digest and an analysis
  that changes skill guidance.
- `update-source`: an analysed source has a new version.
- `link-check`: periodic liveness and freshness review of the whole catalogue.
- `skill-only`: improve skill guidance with no source change.
- `evolve`: digest usage feedback from `feedback/inbox/` into skill
  improvements. Runs unattended on a schedule, so its triage tiers decide
  what may be applied without the owner. See `## Evolve: Feedback Digestion`.

## Kickoff

The owner usually gives a short prompt ("add these sites", "找几个动效站").
Do not answer with a list of required inputs. Survey, propose, confirm.

1. Read `catalog/sections.json` (the taxonomy) and grep
   `catalog/resources.jsonl` for the names and hosts involved - duplicates are
   the most common mistake.
2. For `add-source`, read `analysis/SOURCE_INDEX.md` and the
   `## 后续可分析方向` list in `analysis/10-overall-design-synthesis.md`, then
   propose two to four candidates with one-line reasoning and a
   recommendation.
3. Pre-fill everything the owner would otherwise have to decide: domain,
   section, tier, predicted version bump. Ask only for a genuine choice.

## Cost Discipline

Research is done by the main agent plus **mechanical scripts**, not by fanning
out subagents. `scripts/check-links.py` verifies hundreds of URLs in about two
minutes at zero model cost; a web search is for discovery and for confirming
hosts the local network cannot reach. If subagents are ever used: a small
number, a cheaper model, results written to disk early and incrementally. (The
2026-09-20 research run lost all of its work by ignoring this.)

## The Catalogue

`catalog/resources.jsonl` is the single source of truth, one JSON object per
line, grouped by domain. `catalog/sections.json` declares domains, sections
and the guidance shown above each table. Two views are **generated** and must
never be edited by hand:

- `skills/design-studio/references/resources/<domain>.md` (read by agents at
  runtime)
- `docs/catalog.js` (read by `docs/index.html`)

### Entry schema

| Field | Rule |
| --- | --- |
| `id` | unique kebab-case |
| `name`, `url` | canonical home or the most useful deep link; https; no tracking parameters |
| `domain`, `section` | must exist in `sections.json`; one home per resource |
| `kind` | `gallery` `pattern-library` `archive` `feed` `community` `tool` `assets` `library` `design-system` `guideline` `article` `book` `course` `blog` `skill` |
| `tags` | lowercase kebab-case; used by the docs filter |
| `best_for` | one sentence: what a designer looks up there. Specific, no praise words |
| `how_to_use` | optional: the direct route - filters, confirmed deep-link patterns, API endpoints |
| `access` | `free` `freemium` `paid` |
| `login` | `true` when the main content is gated |
| `agent_access` | written by `check-links.py`, never by hand: `static` `js` `blocked` `unknown` |
| `license` | required in practice for fonts, icons, assets and code: the licence reality in a phrase |
| `tier` | `S` first place a senior designer looks for this need; `A` strong and reliable; `B` niche, backup or with a stated weakness. Be stingy with `S` |
| `updated` | `active` `slow` `archived` (no longer updated but still valuable) |
| `lang` | primary language code |
| `origin` | `user-YYYY-MM-DD` for owner-supplied entries, `research-YYYY-MM-DD` otherwise |
| `added` | date the entry entered the catalogue |

No `|` characters in text fields: they break the generated tables.

### Inclusion bar

Include: real, reachable, useful to a working designer, with a describable
best use. Exclude: dead sites, SEO and affiliate farms, AI-content farms, thin
clones, "free fonts" sites without licences. Keep archived-but-valuable
sources and mark them. Owner-supplied entries are always included; if one is
weak, tier it `B` and say why in `best_for`.

### `add-resource` workflow

1. Deduplicate by host against the catalogue.
2. Visit the site (fetch, or a browser tool for JavaScript sites) and write
   the entry from what is actually there. Licence claims come from the
   licence page, not from memory.
3. Append the line inside its domain block in `resources.jsonl`. Add a new
   section to `sections.json` only when several entries need it.
4. `scripts/check-links.py --write --ids <new ids>` to record `agent_access`.
5. `scripts/build-catalog.py`, then `scripts/check-lab-invariants.sh`.
6. If a section's guidance or the routing table
   (`skills/design-studio/references/resource-map.md`) no longer describes
   the catalogue, update it.
7. CHANGELOG entry; PATCH bump of the suite when only catalogue entries
   changed.

### `link-check` workflow

1. `scripts/check-links.py --write` (full run). The report lands in
   `.planning/link-checks/YYYY-MM-DD.md`.
2. **dead** (404 / 410 / 5xx): find the new URL or remove the entry.
   **redirected to another host**: usually an acquisition, merger or rename -
   update or merge entries, and say so in `best_for` when users would look for
   the old name. **unreachable**: no HTTP answer from this network is not
   proof of death - confirm with a web search before touching the entry.
3. Re-read a sample of `S` entries: paywalls, quality decline, licence
   changes. Demote or annotate.
4. Re-verify the dated, perishable reference files listed below.
5. Record the review in `analysis/SOURCE_INDEX.md` under `## 新鲜度审查`.

## Evolve: Feedback Digestion

The suite logs its own friction: agents in host projects drop entries into
`feedback/inbox/` per `skills/design-studio/references/feedback.md`. This
mode turns them into skill improvements. It runs interactively when the owner
asks, and unattended from `scripts/evolve.sh` (launchd / cron), so the tiers
below are the authority on what may be applied without the owner.

1. `scripts/collect-feedback.py`. If the inbox is empty, stop. Read
   `feedback/report.md`, then the raw entries - the report is an index, the
   entries are the evidence.
2. **Cluster** entries by root cause, not by skill: one bad shared reference
   surfaces as friction in several skills. An entry that duplicates a
   `feedback/log.md` "won't fix" decision is archived with a pointer to it.
3. **Tier each cluster:**
   - **Tier A - apply directly.** Wording that misled, factual errors, dead or
     wrong paths, contradictions between two files. Bounded edits with clear
     evidence.
   - **Tier B - apply and flag.** New guidance that fits an existing section
     or perishable reference: a platform fact, an anti-pattern, a missing
     state. Apply it, and list every Tier B change prominently in the run
     summary so the owner can veto after the fact.
   - **Tier C - propose only.** New sections, modes, skills or references;
     contract changes (deliverables, output layout); feedback that conflicts
     between entries; single `nit` / `preference` entries with no
     corroboration. Append to `feedback/proposals.md` with the evidence and a
     concrete plan; do not apply. Unattended runs never touch Tier C.
4. **Apply** A/B edits following the existing rules: guidance goes to the
   focused skill that owns the topic, perishable specifics go to dated
   references, `SKILL.md` files stay under the line limit. Bump each touched
   skill's version, write the CHANGELOG entry, run
   `scripts/check-lab-invariants.sh` and fix what it catches.
5. **Record and archive.** Append one section to `feedback/log.md` per run:
   date, entries processed, per-cluster action (fixed in X.Y.Z / proposed /
     won't fix + reason). Then `scripts/collect-feedback.py --archive`.
6. One commit for the whole digestion (`skill: evolve from N feedback
   entries`), on a branch when running unattended.

Discipline: act only on logged evidence - never invent problems to fix. When
evidence is thin (one `minor` entry), prefer `feedback/proposals.md` over a
guess. A correction entry from the owner outweighs any inference.

## Perishable Register

These files carry dates because their content expires. Review them on every
`link-check` and whenever a platform or model generation changes:

- `skills/design-studio/references/anti-slop.md` - dated lists of tells
- `skills/design-product-ui/references/platforms.md` - OS conventions
- `skills/design-product-ui/references/ai-ux.md` - AI interface patterns
- `skills/design-icons/references/app-icons-and-favicons.md` - icon packaging
- `skills/design-graphics/references/production.md` - platform image sizes
- `skills/build-design-system/references/token-formats.md` - DTCG and DESIGN.md
- `skills/design-motion/references/motion-tokens.md` - platform code snippets
- `skills/implement-design/references/stacks.md` - framework theming APIs
- `skills/design-studio/references/render-and-look.md` - tool ladder
- `skills/design-studio/references/portable-mockups.md` - frame sizes and the
  toolkit mapping table
- `skills/design-product-ui/assets/mockup-kit/kit.css` - device frames, bar
  heights, the mini-program capsule metrics

Durable content (perception, hierarchy, typography fundamentals,
accessibility, process) lives in the `SKILL.md` files and the fundamentals
references and should change rarely.

## Sources: Digest and Analysis

1. **Acquire**. Article or guideline: fetch and write a paraphrased,
   structured digest to `raw/docs/<slug>.md` with the header block (source
   URL, author or publisher, publish date, fetch date, method, and the
   not-verbatim note). Only digest what was actually fetched; if a source is
   unreachable, say so rather than reconstructing it from memory. Repository:
   shallow clone into `raw/repos/<slug>/` (git-ignored) and record the commit
   in `SOURCE_INDEX.md`.
2. **Analyse** in `analysis/NN-<slug>.md` (Chinese): `# 标题`, then on line 3
   the metadata blockquote
   `> 分析版本：X.Y ｜ 最后更新：YYYY-MM-DD ｜ 来源：…（发布 …，抓取 …）｜ 快照：raw/docs/<file>`
   or for multi-source files
   `> 分析版本：X.Y ｜ 最后更新：YYYY-MM-DD ｜ 覆盖来源：… ｜ 版本见 \`analysis/SOURCE_INDEX.md\``.
   Sections: `## 核心观点`, `## 关键规则与数值`, `## 易腐与耐久`,
   `## 对设计 agent 的启发`, `## 注意`, and a closing
   `## 对最终 skill 的影响` listing the exact edits - which must match what is
   committed.
3. **Index** in `analysis/SOURCE_INDEX.md`: bump `更新时间`, add the row, add
   the reading block.
4. **Synthesise**: update `analysis/10-overall-design-synthesis.md` when
   cross-source consensus changes.
5. **Edit the skills**: additive by default; put guidance in the focused skill
   that owns the topic; cite the analysis in
   `skills/design-studio/references/source-map.md`.
6. **Docs**: `docs/index.html` reads versions and counts from generated data;
   touch it only for structural changes. Update `README.md` when the source
   list, skill list or usage changes. The public page is GitHub Pages from
   `main`'s `/docs`. A page fix is not done until that branch contains it and
   the Pages build for that commit is `built`.

## Versioning

SemVer on the `design-studio` contract (modes, deliverables, output layout,
reference paths). MAJOR removes or renames; MINOR adds a skill, guidance or an
analysed source; PATCH is wording and catalogue entries. While at `0.x`,
MINOR may reshape the contract, and the CHANGELOG still calls it out. Every
skill carries its own `metadata.version`; child skills bump only when their
own content changes. Nothing is removed without appearing under `弃用登记` in
`CHANGELOG.md` for two MINOR releases first (from 1.0 onward).

Judge the bump **at commit time**: one closed loop, one version.

## Commit Discipline

One commit per logical step; stage only that step's files; never `git add -A`.

1. `chore(skill): bump design-studio to X.Y.Z`
2. `docs: add CHANGELOG entry for X.Y.Z`
3. `catalog: <what changed>` - JSONL, sections, and the regenerated views
   together
4. `raw: add <Source> digest`
5. `analysis: add <Source> analysis (NN)` / `analysis: update SOURCE_INDEX`
6. `skill(<name>): <guidance change>`
7. `docs: …`

Branch from `main` for anything beyond a catalogue patch; open a draft PR when
a remote exists; do not merge or push without the owner's say-so.

## Definition of Done

- `scripts/check-lab-invariants.sh` exits clean. It checks: the catalogue
  schema and duplicates, generated views are fresh, skill frontmatter,
  version agreement across `SKILL.md` / `README.md` / `CHANGELOG.md`, analysis
  metadata blockquotes, lab-owned paths referenced in backticks exist,
  digests carry the header block, `SOURCE_INDEX` date is not older than its
  newest row. Fix violations; if the check itself is wrong, fix the check in
  the same change and say so.
- New entries were visited, not remembered; licences read at the source.
- `best_for` is specific; tiers are defensible; no entry has two homes.
- The analysis' `对最终 skill 的影响` matches the diff.
- `git status` is clean; only intended files were staged.

## Lab-Specific Anti-Patterns

- Editing a generated view, or committing the JSONL without rebuilding.
- Adding a site from memory without visiting it; guessing a licence.
- Treating an unreachable host as dead.
- Tier inflation: if everything is `S`, the tier means nothing.
- Copying source text into `raw/docs/`; digests are paraphrased.
- Putting perishable specifics (pixel specs, library APIs, trend lists) into
  a `SKILL.md` instead of a dated reference file.
- Growing a `SKILL.md` past what an agent needs to decide and act; move detail
  to a reference and link it.
- Fanning out expensive subagents for bulk verification that a script can do.
