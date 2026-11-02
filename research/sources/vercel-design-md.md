# Vercel's design.md: a prose brand skill plus a runtime stylesheet, and how it was evaluated
- id: vercel-design-md · url: https://vercel.com/design.md · fetched: 2026-11-01 · method: fetch
- review_by: 2027-01-30 (perishable +90d: the post says the file is revised from weekly feedback) · licence note: paraphrased digest, not a mirror (no licence stated on the file or the post)
> 中文导语：Vercel 公开的 `vercel.com/design.md` 不是 Google 的 DESIGN.md 格式：front matter 只有 name 和 description，正文全是散文规则，颜色和字号不在文件里，而在渲染时才加载的公开样式表 `vercel-brand.css` 里（"不要把样式表读进上下文"）。配套文章说明了三层分工（判断写进 design.md，可复用的机制写进样式表，能机械检查的写成代码检查）和一套七题、两百多次运行的评测回路，并给出一个小样本的量化结果。它是 DESIGN.md "token 为准、散文为辅"之外的另一种 agent 可读设计文件，对本仓库的真相文件分层有直接参照价值。

Read on 2026-11-01: the file https://vercel.com/design.md and the post https://vercel.com/blog/how-our-agents-build-on-brand-pages-with-design-md (August 31, 2026, John Phamous; contributor Kevin Corbett). First read by a verifying subagent, then both re-fetched for the quotes below.

## Key facts
**The file**
1. Front matter has two keys only: `name: vercel-brand-guidelines` and a `description` ("Design, build, or substantially improve an official Vercel-authored report website", listing report types). No token YAML, no hex, no font sizes: the body is prose plus HTML snippets.
2. Headings in order: "Design report websites like Vercel"; Vercel product and brand context; Download logos; Use this priority order; Integrate with the caller's project; Work in four passes (Frame the reader's job / Choose the composition / Authoritative Vercel visual system / Inspect and revise privately); Reject generated-design reflexes; Use the published CSS API; Accessibility and responsive behavior.
3. The visual system lives in a public stylesheet, `vercel.com/geist/vercel-brand.css`: "Use the public API documented below; do not read the stylesheet implementation into context." "Never inspect the CSS for internal selectors, guess a `vbg-*` class, or extrapolate a name from another primitive." Root class `.vbg-report` on the page root; standalone output wrapped in `.vbg-shell`.
4. Host scoping: the published CSS API applies "Only when the host is stock v0 or a generic Next.js, Tailwind, and shadcn project"; otherwise the file says to integrate with the caller's project.

**The post**
5. Three layers: design.md "supplies guidance that shows agents how to frame the reader's job, structure evidence, and choose a composition"; "A public stylesheet that defines a bounded, documented vocabulary of classes and tokens"; an evaluation loop that "turns repeated human feedback into better guidance and deterministic checks".
6. Where a correction goes: "Judgment changes go into design.md as prose", "reusable mechanics go into the stylesheet", and "anything that we can check mechanically becomes a deterministic check in code".
7. "The stylesheet loads when the page renders in your browser, so none of the code enters the model's context."
8. Consumers: "We load design.md into tools like v0, Codex, and Claude every day"; a Slack design agent loads the current file for website requests.
9. Eval loop: seven frozen prompts; "well over 200 runs" counting full rounds, targeted checks, dry runs and dead ends; weekly feedback triage.
10. Measured result: three desktop scenarios, six pages, Codex with GPT-5.5, with and without the file, first attempt only: "39 of those failures" with design.md versus "91" without ("57% fewer"). Caveats in the post: "The checks can only catch failures we have already seen and written down", "this test says nothing about whether a page is well designed overall", "Six pages is also far too small a sample to make claims about quality or reliability".

## What it changes for the skills
- skills/design-studio/references/process/truth-files.md and process/system.md: a second production pattern for agent-readable design files: prose judgment in the file, mechanics in a stylesheet the model never reads, mechanical rules as checks. Our split (DESIGN.md describes, tokens.css implements, lint.mjs checks) is the same shape; say so and cite it.
- skills/design-studio/references/process/system.md section 8: "Vercel design.md" is not DESIGN.md; a host that says "we have a design.md" may mean either.
- research/topics/02 and 09: an eval loop with frozen prompts and known-failure checks, reported with its sample-size caveat, is the same posture as this lab's evals.

## Not verified / open
- The stylesheet was not read (the file asks agents not to); its token values are therefore not recorded here.
- The "known failures" checklist behind the 39 vs 91 figures is not published; the result cannot be reproduced.
- The file changes often; quotes are from 2026-11-01.
