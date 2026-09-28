# Measured facts: 02-devtool-landing-en

Frames in A/ and B/ are canonical renders made by evals/render.mjs from each label's HTML at the viewports in the brief's render manifest. Full-page items are cut into consecutive viewport-sized frames (<name>-01.png, -02.png, ...; the last frame ends at the page bottom and may overlap the one before). Viewport items give one frame.
Measured with evals/tools/facts.mjs @ f5c0421 (renderer evals/render.mjs @ f5c0421), run the same way on every label. Contrast is WCAG 2.2 AA on the judged area only; targets are counted only where marked up as interactive, so target counts are a lower bound. What the tool reports as not measurable is left unmeasured.

## A

Render: 2 of 2 manifest items rendered, 17 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- index.html (1440x900@1): ok, frames desktop-01.png, desktop-02.png, desktop-03.png, desktop-04.png, desktop-05.png, desktop-06.png, desktop-07.png, page height 5917 px.
- index.html (390x844@2): ok, frames mobile-01.png, mobile-02.png, mobile-03.png, mobile-04.png, mobile-05.png, mobile-06.png, mobile-07.png, mobile-08.png, mobile-09.png, mobile-10.png, page height 7973 px.

A: 2 of 2 files present.
- index.html (1440x900@1): text below AA: 0 of 296 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 28. Images without alt: 0. Horizontal overflow: no.
- index.html (390x844@2): text below AA: 0 of 268 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 20. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.

## B

Render: 2 of 2 manifest items rendered, 17 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- index.html (1440x900@1): ok, frames desktop-01.png, desktop-02.png, desktop-03.png, desktop-04.png, desktop-05.png, desktop-06.png, desktop-07.png, page height 5884 px.
- index.html (390x844@2): ok, frames mobile-01.png, mobile-02.png, mobile-03.png, mobile-04.png, mobile-05.png, mobile-06.png, mobile-07.png, mobile-08.png, mobile-09.png, mobile-10.png, page height 8017 px.

B: 2 of 2 files present.
- index.html (1440x900@1): text below AA: 1 of 239 measured text nodes, lowest 1.12:1 (needs 4.5) code "npm install @driftless/client" #f4f2ea on #ffffff, 15px. Targets under 24 px that fail the spacing exception: 0 of 33. Images without alt: 0. Horizontal overflow: no.
- index.html (390x844@2): text below AA: 0 of 220 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 27. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.
