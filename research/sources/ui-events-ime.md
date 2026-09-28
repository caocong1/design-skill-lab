# UI Events: IME composition, isComposing and keyCode 229 (with browser support data)
- id: ui-events-ime · url: https://www.w3.org/TR/uievents/ · fetched: 2026-09-28 · method: fetch + json-api
- review_by: 2026-12-27 (perishable +90d: browser support; the event model is durable) · licence note: paraphrased digest, not a mirror (W3C Document License; BCD is CC0)
> 中文导语：中文、日文、韩文用户打字要经过输入法"组字"：拼音字母先在候选框里，回车或空格才上屏。网页如果在这期间把回车当"发送"、把拼音字母当搜索词，用户就会遇到"选词就把消息发出去了""搜索框里搜 zhong"这类问题。这份摘要把规范里的组字事件、`isComposing` 和 keyCode 229，以及 Safari 长期存在的事件顺序缺陷记下来，给设计交付写"输入法安全"的要求用。

Read on 2026-09-28: the UI Events Working Draft (21 February 2026) sections on composition events (§3.6), `KeyboardEvent.isComposing`
(§3.5.1.1), `InputEvent.isComposing` (§3.4.1.1) and the legacy `keyCode` algorithm; MDN `KeyboardEvent/isComposing` (last modified
2025-04-03); support data from `@mdn/browser-compat-data` 8.1.3 (2026-09-24) and `web-features` 3.40.0.

## Key facts
1. **A composition session** (§3.6.2) is one `compositionstart`, one or more `compositionupdate`, one `compositionend`. Keyboard and input
   events can fire inside it (§3.6.5, §3.6.6).
2. **`isComposing`** is true on a `keydown`/`keyup` that occurs after `compositionstart` and before `compositionend` (§3.5.1.1), and on
   `beforeinput`/`input` while an IME is active (§3.4.1.1).
3. **keyCode 229** (legacy `keyCode` algorithm): if an IME is processing the key input and the event is `keydown`, `keyCode` returns 229.
4. **Support** (web-features 3.40.0): `api.KeyboardEvent.isComposing` became Baseline newly available on **2026-09-14** (Chrome 56, Edge 79,
   Firefox 31, Safari and iOS Safari **27**); `api.InputEvent.isComposing` the same date. Composition events themselves are Baseline widely
   available (since 2018).
5. **Safari 10.1-26.6 order defect** (BCD note, WebKit bug 165004): for the keystroke that *completes* a composition (the Enter or Space
   that commits the candidate), `keydown` and `input` fire **after** `compositionend`, so `isComposing` reads `false` on that Enter. A handler
   that checks only `isComposing` sends a chat message, submits a form or creates a tag when a Chinese or Japanese user merely confirms a
   candidate. Safari 27 removed the note. On those events `keyCode` is still 229 (fact 3), which is why guards check both.
6. **EditContext** (the API for custom text editors with IME) is Chromium-only (web-features: not Baseline).

## What it changes for the skills
- skills/design-studio/references/disciplines/interaction.md: owns the IME rules: Enter during composition commits the candidate and never
  triggers send, submit or create; search-as-you-type, filtering, validation and character counts wait for `compositionend`; single-key
  shortcuts ignore composition; the handoff names the guard (`isComposing || keyCode === 229`) and a real-IME test.
- skills/design-studio/references/disciplines/ai-experience.md: the composer's "Enter sends" row carries the IME exception.
- skills/implement-design/references/stacks.md is not changed here: the build detail is the guard in fact 5, stated once in interaction.md.

## Not verified / open
- Android IMEs often send `keydown` with key `Unidentified` / keyCode 229 for every key; no source for per-IME behaviour was read.
- Whether Safari 27 fixed the order on every OS input method (Pinyin, Zhuyin, Japanese Kana, Korean) was not tested; the BCD note removal is
  the only evidence. Safari 26 and older remain in use for years, so the double guard stays.
- Native platforms (UIKit `markedTextRange`, Android `InputConnection`, HarmonyOS, mini-program `input` `bindconfirm`) have their own composition
  models; none were read.
