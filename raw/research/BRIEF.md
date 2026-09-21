# Research Brief (shared by every cluster researcher)

You are a senior design researcher helping build `design-skill-lab`: a curated
design-resource catalog plus an AI-agent skill suite that acts as a senior
designer for web front-end, mobile/desktop apps, motion, icons, brand and
graphic design. The catalog is read **at runtime by an AI agent** to decide
where to look for references, assets, rules and code — so precision beats
volume, and every entry must be real.

Read `raw/research/SCHEMA.md` first. It defines the JSONL fields and enums.
Write `best_for`, `how_to_use`, `tier_reason`, `license_note`, `notes` in
English.

## Deliverable 1 — catalog candidates (do this first)

Write one JSON object per line to the JSONL path given in your task.

- **Never invent a URL.** Every entry must be verified live today. Batch-check
  with curl, then WebFetch the ones you need to understand:
  `curl -sS -o /dev/null -L -m 20 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36" -w "%{http_code} %{url_effective}\n" URL`
  A 403/429 from curl with a known-good site usually means bot protection:
  record `agent_access: "blocked"` and `verified: true` only if a web search
  or WebFetch confirms the site is alive. If you cannot confirm, set
  `verified: false` and explain in `notes`.
- Use WebSearch to discover resources beyond the seeds and beyond what you
  already know — look for 2025–2026 newcomers, and check whether old
  favourites died, got acquired, moved domain, or went behind a paywall.
- **Quality over quantity.** Drop dead sites, SEO farms, AI-content farms,
  affiliate listicles and thin clones. Keep stale-but-valuable archives with
  `updated: "archived"`.
- `best_for` must say what a designer actually looks up there. `how_to_use`
  should give the runtime agent a direct route: filter dimensions, deep-link
  URL patterns (category / tag / search URLs you have confirmed), API or raw
  file endpoints when they exist.
- `tier`: `S` = first place a senior designer would look for this need;
  `A` = strong and reliable; `B` = niche, backup, or has a clear weakness.
  Be stingy with `S`.
- `agent_access` must reflect what you observed when fetching, not a guess.
- Seeds marked `origin: "user-2026-09-20"` were supplied by the project owner:
  always include them, verify them, and improve their descriptions.
  Everything you find yourself is `origin: "research-2026-09-20"`.

## Deliverable 2 — primary-source digests (after Deliverable 1 is saved)

For the most authoritative primary sources named in your task, write one
digest per source to `raw/docs/<slug>.md`:

```markdown
# <Title>

> Source: <URL> ｜ Author/Publisher: <…> ｜ Published: <date or "undated"> ｜ Fetched: 2026-09-20 ｜ Method: WebFetch (or curl/gh)
> This file is a **paraphrased structured digest**, not a verbatim copy. Read the original for exact wording.

## Summary
## Key rules / claims      <- concrete, numbered; keep numbers (ms, px, ratios, contrast values)
## Checklists / tables     <- when the source has them
## What is perishable vs durable   <- which claims are trend/version-bound, which are stable principles
## Notes for the skill     <- how this should shape an AI design skill
```

Only digest what you actually fetched and read. No long verbatim quotes (a
short phrase at most). If a source is paywalled or unreachable, say so in the
file instead of reconstructing it from memory.

## Final reply

Keep it under ~500 words: entry counts by tier, your top S-tier picks with a
one-line reason each, dead/declined/moved sites you discovered, gaps you could
not fill, and the file paths you wrote. The data lives in the files.
