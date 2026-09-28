# Measured facts: 06-redesign-legacy

Frames in A/ and B/ are canonical renders made by evals/render.mjs from each label's HTML at the viewports in the brief's render manifest. Full-page items are cut into consecutive viewport-sized frames (<name>-01.png, -02.png, ...; the last frame ends at the page bottom and may overlap the one before). Viewport items give one frame.
Measured with evals/tools/facts.mjs @ f5c0421 (renderer evals/render.mjs @ f5c0421), run the same way on every label. Contrast is WCAG 2.2 AA on the judged area only; targets are counted only where marked up as interactive, so target counts are a lower bound. What the tool reports as not measurable is left unmeasured.

## A

Render: 1 of 1 manifest items rendered, 1 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- schedule.html (1280x800@1): ok, frames schedule.png, page height 800 px.

A: 1 of 1 files present.
- schedule.html (1280x800@1): text below AA: 0 of 309 measured text nodes (12 over images or gradients, measured from pixels). Targets under 24 px that fail the spacing exception: 0 of 52. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.

## B

Render: 1 of 1 manifest items rendered, 1 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- schedule.html (1280x800@1): ok, frames schedule.png, page height 800 px.

B: 1 of 1 files present.
- schedule.html (1280x800@1): text below AA: 0 of 336 measured text nodes (2 over images or gradients, measured from pixels). Targets under 24 px that fail the spacing exception: 0 of 47. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.
