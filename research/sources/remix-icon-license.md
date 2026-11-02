# Remix Icon License v1.0 (January 2026): what changed from Apache-2.0, and what it forbids
- id: remix-icon-license · url: https://github.com/Remix-Design/RemixIcon/blob/master/License · fetched: 2026-11-01 · method: repo@f526a92
- review_by: 2027-11-01 (durable +365d: a versioned licence; later versions are optional per clause 11) · licence note: paraphrased digest, not a mirror; not legal advice
> 中文导语：Remix Icon 自 2026-01 起不再是 Apache-2.0，而是自定义的 Remix Icon License v1.0：可以修改、署名可选，但不得单独售卖图标、不得做竞争性图标库（"即使只做了轻微或表面修改"），**不得把图标用作 logo、商标或品牌标识（包括 App 图标）**，品牌图标只能代表该品牌。npm 包 `remixicon@4.9.1` 的 package.json 仍写 "Apache-2.0"，与包内 License 文件和主分支 package.json 不一致；以 License 文件为准。本仓库目录条目和图标参考按此处理。

Read on 2026-11-01 by the visual verifier: the repository `License` file (commit `f526a92`, 2026-01-25; "Version 1.0 – January 2026") via the GitHub API; the master `package.json`; the npm tarball of `remixicon@4.9.1` (2026-01-29). Library: 3,229 SVGs on master.

## Key facts
1. Clause 2.2: modification is allowed. Clause 2.4: attribution is optional.
2. Clause 3.1: no standalone sale of the icons.
3. Clause 3.2: no competing icon libraries, "even if … modified with only minor or superficial changes".
4. **Clause 3.3: no use "as a logo, trademark, or brand identifier"** (app icons included).
5. Clause 4: brand icons only to represent that brand.
6. Clause 9: compatible with MIT / BSD / Apache projects, but "may be incompatible with … strong copyleft".
7. Clause 11: later versions of the licence are optional.
8. **Inconsistency**: npm `remixicon@4.9.1` `package.json` says `"license": "Apache-2.0"`, while the tarball's `License` file is v1.0 and the master `package.json` says "Remix Icon License v1.0". The licence file governs.

## What it changes for the skills
- skills/design-studio/references/disciplines/icons.md and fundamentals/licensing.md: Remix Icon is usable in product UI, but never as (or inside) a logo, app icon or brand mark, and never resold or repackaged as an icon set.
- catalogue: the `remix-icon` row's licence reads "Remix Icon License v1.0 (2026-01; not Apache-2.0)" with the logo/brand restriction in `caveats`.

## Not verified / open
- Whether icons downloaded before January 2026 under Apache-2.0 keep that licence is not addressed by the text; treat new downloads as v1.0.
- Not legal advice.
