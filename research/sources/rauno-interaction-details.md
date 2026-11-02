# Rauno Freiberg, "Invisible Details of Interaction Design"
- id: rauno-interaction-details · url: https://rauno.me/craft/interaction-design · fetched: 2026-11-01 · method: fetch
- review_by: 2027-11-01 (durable +365d) · licence note: paraphrased digest, not a mirror
> 中文导语：Rauno Freiberg（Vercel 设计工程师）2023 年的长文，拆解"为什么有些交互用起来就是顺"：可打断、手势带惯性、轻量操作在手势中途触发而破坏性操作要等松手、反馈即时跟手、高频操作不做动画、利用屏幕边角（Fitts）。它是"舒心"这件事的细节清单，backlog §4 第 11 项登记的就是这篇。

Read on 2026-09-28: the essay page (July 2023), text only; its embedded videos and interactive demos were not watched.

Re-read 2026-11-01: essay page unchanged ("July 2023"); the heading question under Not verified is resolved there.

## Key facts
1. **Metaphors** (§ Metaphors): borrow physical behaviour people already know (swipe to page, pinch to zoom).
2. **Interruptibility** (§ Metaphors, § Kinetic Physics): a gesture or transition can be reversed or redirected mid-way; the user never waits for an
   animation to finish before acting again.
3. **Momentum** (§ Kinetic Physics): a thrown element keeps the velocity and angle of the gesture (springs, not fixed curves).
4. **Fire during vs after** (§ Swipe Gestures): light, reversible actions may trigger while the gesture is still in progress; destructive or
   committing actions fire only on release, so the user can still back out.
5. **Responsive, not threshold-then-animate** (§ Responsive Gestures): the effect tracks the finger from the first pixel; a threshold only
   decides the final commit.
6. **Spatial consistency** (§ Spatial Consistency): an element enters from and leaves towards where it lives, so motion explains place.
7. **Frequency and novelty** (§ Frequency & Novelty): things used hundreds of times a day (command menu, context menu) appear instantly,
   without fade; motion is kept for rare, novel moments.
8. **Fitts** (§ Fitts's Law): frequent targets large and near; screen edges and corners are effectively infinite targets; radial menus
   keep every option at equal distance.
9. **Implicit input** (§ Implicit Input, confirmed on 2026-11-01 as its own heading, the eleventh of fourteen): use context the system already has (time, location, device state) to skip explicit steps.
10. **Scroll** (§ Scrolling, § Scroll Landmarks): scrolling stays with the window that has focus, not whatever the pointer drifts over; long content can offer
   landmarks to return to a reading position.

## What it changes for the skills
- skills/design-studio/references/disciplines/interaction.md: gesture rules (facts 2, 4, 5), frequency gate for instant UI (fact 7, with
  emil-kowalski-animation #6), Fitts placement of frequent actions (fact 8), implicit input as a convenience default (fact 9).
- skills/design-studio/references/disciplines/motion.md already owns durations and the frequency gate; interaction.md links to it.

## Not verified / open
- The essay is one designer's craft notes with Apple-platform examples, not a study; rules are adopted where they agree with WCAG (2.5.7,
  2.2.2) or with the motion sources.
- Demos and videos were not viewed. Resolved 2026-11-01: the headings in order are Metaphors, Kinetic Physics, Swipe Gestures, Responsive Gestures, Spatial Consistency, Fluid Morphing, Frequency & Novelty, Fidgetability, Scroll Landmarks, Touch Content Visiblity [sic], Implicit Input, Fitts's Law, Scrolling, Closing Thoughts; "Implicit Input" is its own heading. Fluid Morphing, Fidgetability and Touch Content Visibility are not covered by this digest (possible additions, not errors).
