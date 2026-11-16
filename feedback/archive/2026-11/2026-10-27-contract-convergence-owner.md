---
date: 2026-10-27
skill: design-studio
project: zh-static-docs-site
type: friction
severity: minor
---

## What happened

A surface contract said a block was "moved into the first viewport at convergence" without saying who decided it. The fresh critic cannot read decisions.md, so it assumed the user had decided it and made the elevate choice conditional on user confirmation. In fact it was the author's own convergence fix.

## Expected / suggestion

In `templates/surface-contract.md` (and the convergence step in `references/process/directions.md`), tag every convergence change in the contract with who made it, e.g. `(user)` or `(author)`, so a critic knows whether undoing it needs the user.
