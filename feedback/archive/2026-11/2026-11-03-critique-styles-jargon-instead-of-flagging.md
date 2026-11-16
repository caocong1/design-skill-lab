---
date: 2026-11-03
skill: critique-design
project: zh-docs-static-site
type: missing
severity: major
---

## What happened

The site explains AI skills (prompt files) to Chinese practising lawyers who do not code; the brief said so. Two fresh-context critique rounds (2026-11-01, 2026-11-02) saw file paths, slash commands, `snake_case` field names, English status values and internal case numbers in the body text and treated them as typesetting: finding D5 asked for monospace identifiers, break rules after `/ _ - : .` and a glossary of English markers, and the fix shipped that way. The owner's first look at the live site rejected it: 「这是给律师看的，里面的各种变量/方法/条件等等，都要转换成给律师能看到的语句，不用解释的到很细节，某些内部逻辑可以写一些总结话语。」 All content had to be rewritten: a plain-language lint flagged 3,903 strings across 38 data files.

## Expected / suggestion

When the brief names a non-technical audience, check the register of the words as well as their typesetting. Any identifier, field name, status value, file name or developer term in reader-facing text should be a content finding (P1 when systemic) whose fix is translating it into the reader's own terms, not styling it; say explicitly that a glossary does not fix it. A cheap mechanical check helps: count code-like tokens per page (paths, `a_b`, `camelCase`, `/cmd:x`, lowercase English words) against an allowlist of abbreviations the audience already knows. The First-timer persona already lists "jargon"; tie it to the brief's audience.
