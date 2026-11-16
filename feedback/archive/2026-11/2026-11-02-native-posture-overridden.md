---
date: 2026-11-02
skill: design-studio
project: zh-desktop-ops-tool
type: correction
severity: major
---

## What happened

Round 1 read a daily Operate tool as "convention over novelty" and settled on a fully native macOS
posture (system sidebar, toolbar, controls). After the build shipped, the owner said the whole UI
"looks native" and that this is a company's commercial product family (macOS and Windows desktop,
web, mobile; free and paid editions; reports; an AI assistant) that should read as a formal product.
A second deep round (shell, home, account layer) was needed.

## Expected / suggestion

references/process/truth-files.md (design read) and references/platforms/README.md (posture) could
make the posture an explicit brief line when the product is commercial or ships on more than one
desktop OS: "native per OS / branded-native / custom shell", with who decided it. A question about
the business frame (single tool vs product family, brand, editions) belongs in the question budget
when the brief does not settle it; "daily tool → convention" applies to the work surfaces, not
automatically to the shell.
