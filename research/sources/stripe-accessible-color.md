# Designing accessible color systems (Stripe, 2019): perceptual lightness and the "levels apart" contrast contract
- id: stripe-accessible-color · url: https://stripe.com/blog/accessible-color-systems · fetched: 2026-11-01 · method: fetch
- review_by: 2027-11-01 (durable +365d) · licence note: paraphrased digest, not a mirror
> 中文导语：Stripe 2019 年的这篇文章是"按感知明度分级，用级差保证对比度"这套做法的一手出处：在 CIELAB 里重排色阶之后，任意两色只要相差五级就满足小字 4.5:1，相差四级就满足图标和大字 3:1。本仓库 color.md 的"步位即角色、用级差兜底"以此为依据之一（Radix 的 12 级是另一处）。文章没有公布每级的具体比值、色相数和级数。

Read on 2026-11-01: the full post (dated October 15, 2019; Daryl Koopersmith and Wilson Miner, Design). First read by a verifying subagent, then re-fetched for the quotes below.

## Key facts
1. Targets: "a minimum contrast ratio of 4.5 for small text, and 3.0 for large text" (WCAG 2.0).
2. Audit finding: "none of the default text colors we were using for small text (except for black) met the contrast threshold."
3. Darkening one step fixed some colours and broke others at the next shade; the colours that passed were "dark and muddy and it's difficult to tell the hues apart".
4. Model: CIELAB, "designed to be perceptually uniform", because "the way HSL calculates lightness is flawed": different hues "are inherently perceived as different levels of lightness".
5. Tool: an in-house interface plotting the palette in perceptual space; "The shaded areas in the charts represent so-called imaginary colors which aren't actually reproducible or perceivable."
6. **The contract**: "Any two colors are guaranteed to have sufficient contrast for small text if they are at least five levels apart", and "at least four levels apart for icons and large text".
7. Default text and icon colours were re-chosen to pass on white and on the lightest tint of every hue.
8. Component fix: the Badge got coloured backgrounds; "By shifting both the background and the text color up one level" the text kept its contrast on every badge colour.
9. Caveats in the text: contrast is not vibrancy; a "really dark yellow" is impossible; the process is "like threading a needle". No exact ratios per step, no hue count and no shade count are published.

## What it changes for the skills
- skills/design-studio/references/fundamentals/color.md: "Steps to roles" can cite a second primary origin for the level-gap contract; the measured "step 500 dead zone" is the same phenomenon as fact 3.
- skills/design-studio/references/process/system.md: "modes re-map the semantic tier, never invert" rests on the same idea: roles are positions on a perceptual scale.

## Not verified / open
- "Five levels apart" is only meaningful at Stripe's own scale density, which the post does not give. Our `color_tools.py` ramp has 11 steps; the contrast matrix decides, not the rule of thumb.
- Stripe's current palette (2026) was not checked; the post describes the 2019 redesign.
