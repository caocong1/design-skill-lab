# UI Events: IME composition, isComposing and keyCode 229 (with browser support data)
- id: ui-events-ime · url: https://www.w3.org/TR/uievents/ · fetched: 2026-11-01 · method: fetch + json-api
- review_by: 2027-01-30 (perishable +90d: browser support; the event model is durable) · licence note: paraphrased digest, not a mirror (W3C Document License; BCD is CC0)
> 中文导语：中文、日文、韩文用户打字要经过输入法"组字"：拼音字母先在候选框里，回车或空格才上屏。网页如果在这期间把回车当"发送"、把拼音字母当搜索词，用户就会遇到"选词就把消息发出去了""搜索框里搜 zhong"这类问题。这份摘要把规范里的组字事件、`isComposing` 和 keyCode 229，以及 Safari 长期存在的事件顺序缺陷记下来，给设计交付写"输入法安全"的要求用。2026-11-01 更正：Safari 的事件顺序修复在 2026-06 被 WebKit 回滚，`isComposing` 的 Baseline 在 web-features 3.41.0 起被撤回，所以 `isComposing || keyCode === 229` 的双重判断对所有 Safari 版本都必须保留，不是只到 26.6。

Read on 2026-09-28: the UI Events Working Draft (21 February 2026) sections on composition events (§3.6), `KeyboardEvent.isComposing`
(§3.5.1.1), `InputEvent.isComposing` (§3.4.1.1) and the legacy `keyCode` algorithm; MDN `KeyboardEvent/isComposing` (last modified
2025-04-03); support data from `@mdn/browser-compat-data` 8.1.3 (2026-09-24) and `web-features` 3.40.0.

Re-read on 2026-11-01: `/TR/uievents/` is still the WD of 21 February 2026 (repo `8c1b809`, no commits since); web-features 3.40.0 against 3.41.0–3.44.0 for `api.KeyboardEvent.isComposing`; BCD 8.1.7 (2026-10-22) and BCD PR #30766 (merged 2026-10-07); WebKit bugs 165004, 311717, 317127 and 324380; `Source/WTF/Scripts/Preferences/UnifiedWebPreferences.yaml` on WebKit main. Facts 4 and 5 are corrected below.

## Key facts
1. **A composition session** (§3.6.2) is one `compositionstart`, one or more `compositionupdate`, one `compositionend`. Keyboard and input
   events can fire inside it (§3.6.5, §3.6.6).
2. **`isComposing`** is true on a `keydown`/`keyup` that occurs after `compositionstart` and before `compositionend` (§3.5.1.1), and on
   `beforeinput`/`input` while an IME is active (§3.4.1.1).
3. **keyCode 229** (legacy `keyCode` algorithm): if an IME is processing the key input and the event is `keydown`, `keyCode` returns 229.
4. **Support, corrected 2026-11-01.** web-features 3.40.0 (2026-09-24) listed `api.KeyboardEvent.isComposing` as Baseline newly available on
   2026-09-14 (Chrome 56, Edge 79, Firefox 31, Safari and iOS Safari 27). **web-features 3.41.0 (2026-10-08) and every release through 3.44.0
   withdraw it: `baseline: false`, no Safari entry** (same for `api.InputEvent.isComposing`). BCD 8.1.7 (2026-10-22) marks Safari
   `version_added "10.1"` with `partial_implementation: true` and the note that keydown/input "dispatch after the compositionend event"
   (bugs 165004 and 317127); iOS mirrors it (10.3); `InputEvent.isComposing` Safari 16.4 partial. The change is BCD PR #30766 "Mark Safari 27
   `isComposing` support as partial" (merged 2026-10-07): "WebKit reverted the IME key event ordering fix and disabled
   InputMethodUsesCorrectKeyEventOrder by default again." Composition events themselves remain Baseline widely available (since 2018).
5. **Safari order defect, every shipping version (as of 2026-11-01).** For the keystroke that *completes* a composition (the Enter or Space
   that commits the candidate), `keydown` and `input` fire **after** `compositionend`, so `isComposing` reads `false` on that Enter. A handler
   that checks only `isComposing` sends a chat message, submits a form or creates a tag when a Chinese or Japanese user merely confirms a
   candidate. History: WebKit bug 165004 is "RESOLVED DUPLICATE" of 311717 "Fix a regression and turn on correct composition event ordering by
   default" (fixed 2026-04-08, PR #62264 = `310826@main`; cherry-picked to `safari-7624-branch` 2026-04-30); bug 317127 "Disable
   InputMethodUsesCorrectKeyEventOrder" (2026-06-15, PR #67186): "We've been getting too many regression reports. Disabling this behavior
   everywhere."; bug 324380 (NEW, 2026-09-16) reproduces the wrong order on macOS 26/27 Safari and Safari web apps. On WebKit main the
   preference is `status: unstable, condition: PLATFORM(MAC), defaultValue: false`. **No shipping Safari has the corrected order by default.**
   The previous version of this digest said "Safari 27 removed the note"; that was true of two weeks of BCD data and is wrong now. On those
   events `keyCode` is still 229 (fact 3), which is why guards check both.
6. **EditContext** (the API for custom text editors with IME) is Chromium-only (web-features: not Baseline).

## What it changes for the skills
- skills/design-studio/references/disciplines/interaction.md: owns the IME rules: Enter during composition commits the candidate and never
  triggers send, submit or create; search-as-you-type, filtering, validation and character counts wait for `compositionend`; single-key
  shortcuts ignore composition; the handoff names the guard (`isComposing || keyCode === 229`) and a real-IME test. State the guard for
  every Safari version (not "10.1–26.6"), and do not describe `isComposing` as Baseline.
- skills/design-studio/references/disciplines/ai-experience.md: the composer's "Enter sends" row carries the IME exception.
- skills/implement-design/references/stacks.md is not changed here: the build detail is the guard in fact 5, stated once in interaction.md.

## Not verified / open
- Android IMEs often send `keydown` with key `Unidentified` / keyCode 229 for every key; no source for per-IME behaviour was read.
- Correction vs the previous version (2026-11-01): facts 4 and 5 rewritten (the fix was reverted; Baseline withdrawn). The replacement WebKit
  tracking bug for re-enabling the correct order is not yet linked from 311717 or 317127; which Safari point release carried the 2026-04-30
  branch cherry-pick, and whether any shipped with the flag on, could not be determined from the bug pages.
- Native platforms (UIKit `markedTextRange`, Android `InputConnection`, HarmonyOS, mini-program `input` `bindconfirm`) have their own composition
  models; none were read.
