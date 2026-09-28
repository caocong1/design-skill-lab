# Measured facts: 01-ops-console-zh

Frames in A/ and B/ are canonical renders made by evals/render.mjs from each label's HTML at the viewports in the brief's render manifest. Full-page items are cut into consecutive viewport-sized frames (<name>-01.png, -02.png, ...; the last frame ends at the page bottom and may overlap the one before). Viewport items give one frame.
Measured with evals/tools/facts.mjs @ f5c0421 (renderer evals/render.mjs @ f5c0421), run the same way on every label. Contrast is WCAG 2.2 AA on the judged area only; targets are counted only where marked up as interactive, so target counts are a lower bound. What the tool reports as not measurable is left unmeasured.

## A

Render: 5 of 5 manifest items rendered, 8 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- list.html (1440x900@1): ok, frames list-01.png, list-02.png, page height 1159 px.
- list-empty.html (1440x900@1): ok, frames list-empty-01.png, page height 900 px.
- list-loading.html (1440x900@1): ok, frames list-loading-01.png, list-loading-02.png, page height 986 px.
- list-error.html (1440x900@1): ok, frames list-error-01.png, page height 900 px.
- detail.html (1440x900@1): ok, frames detail-01.png, detail-02.png, page height 1479 px.

A: 5 of 5 files present.
- list.html (1440x900@1): text below AA: 0 of 327 measured text nodes (1 over images or gradients, measured from pixels). Targets under 24 px that fail the spacing exception: 0 of 29. Images without alt: 0. Horizontal overflow: no.
- list-empty.html (1440x900@1): text below AA: 0 of 71 measured text nodes (1 over images or gradients, measured from pixels). Targets under 24 px that fail the spacing exception: 0 of 12. Images without alt: 0. Horizontal overflow: no.
- list-loading.html (1440x900@1): text below AA: 0 of 57 measured text nodes (1 over images or gradients, measured from pixels). Targets under 24 px that fail the spacing exception: 0 of 10. Images without alt: 0. Horizontal overflow: no.
- list-error.html (1440x900@1): text below AA: 0 of 70 measured text nodes (1 over images or gradients, measured from pixels). Targets under 24 px that fail the spacing exception: 0 of 12. Images without alt: 0. Horizontal overflow: no.
- detail.html (1440x900@1): text below AA: 0 of 211 measured text nodes (2 over images or gradients, measured from pixels). Targets under 24 px that fail the spacing exception: 0 of 8. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.

## B

Render: 5 of 5 manifest items rendered, 8 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- list.html (1440x900@1): ok, frames list-01.png, list-02.png, page height 1165 px.
- list-empty.html (1440x900@1): ok, frames list-empty-01.png, page height 900 px.
- list-loading.html (1440x900@1): ok, frames list-loading-01.png, list-loading-02.png, page height 1012 px.
- list-error.html (1440x900@1): ok, frames list-error-01.png, page height 900 px.
- detail.html (1440x900@1): ok, frames detail-01.png, detail-02.png, page height 1417 px.

B: 5 of 5 files present.
- list.html (1440x900@1): text below AA: 0 of 329 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 60. Images without alt: 0. Horizontal overflow: no.
- list-empty.html (1440x900@1): text below AA: 0 of 77 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 38. Images without alt: 0. Horizontal overflow: no.
- list-loading.html (1440x900@1): text below AA: 0 of 58 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 31. Images without alt: 0. Horizontal overflow: no.
- list-error.html (1440x900@1): text below AA: 0 of 65 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 33. Images without alt: 0. Horizontal overflow: no.
- detail.html (1440x900@1): text below AA: 0 of 171 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 29. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.
