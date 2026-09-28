# Measured facts: 01-ops-console-zh

Frames in A/ and B/ are canonical renders made by evals/render.mjs from each label's HTML at the viewports in the brief's render manifest. Full-page items are cut into consecutive viewport-sized frames (<name>-01.png, -02.png, ...; the last frame ends at the page bottom and may overlap the one before). Viewport items give one frame.
Measured with evals/tools/facts.mjs @ f5c0421 (renderer evals/render.mjs @ f5c0421), run the same way on every label. Contrast is WCAG 2.2 AA on the judged area only; targets are counted only where marked up as interactive, so target counts are a lower bound. What the tool reports as not measurable is left unmeasured.

## A

Render: 5 of 5 manifest items rendered, 7 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- list.html (1440x900@1): ok, frames list-01.png, list-02.png, page height 1191 px.
- list-empty.html (1440x900@1): ok, frames list-empty-01.png, page height 900 px.
- list-loading.html (1440x900@1): ok, frames list-loading-01.png, page height 900 px.
- list-error.html (1440x900@1): ok, frames list-error-01.png, page height 900 px.
- detail.html (1440x900@1): ok, frames detail-01.png, detail-02.png, page height 1507 px.

A: 5 of 5 files present.
- list.html (1440x900@1): text below AA: 1 of 331 measured text nodes (1 over images or gradients, measured from pixels), lowest 4.47:1 (needs 4.5) span.avatar "李" #5f6878 on #dbe6fb, 12px. Targets under 24 px that fail the spacing exception: 0 of 74. Images without alt: 0. Horizontal overflow: no.
- list-empty.html (1440x900@1): text below AA: 1 of 77 measured text nodes (1 over images or gradients, measured from pixels), lowest 4.47:1 (needs 4.5) span.avatar "李" #5f6878 on #dbe6fb, 12px. Targets under 24 px that fail the spacing exception: 0 of 27. Images without alt: 0. Horizontal overflow: no.
- list-loading.html (1440x900@1): text below AA: 1 of 61 measured text nodes (1 over images or gradients, measured from pixels), lowest 4.47:1 (needs 4.5) span.avatar "李" #5f6878 on #dbe6fb, 12px. Targets under 24 px that fail the spacing exception: 0 of 36. Images without alt: 0. Horizontal overflow: no.
- list-error.html (1440x900@1): text below AA: 1 of 77 measured text nodes (1 over images or gradients, measured from pixels), lowest 4.47:1 (needs 4.5) span.avatar "李" #5f6878 on #dbe6fb, 12px. Targets under 24 px that fail the spacing exception: 0 of 26. Images without alt: 0. Horizontal overflow: no.
- detail.html (1440x900@1): text below AA: 1 of 182 measured text nodes (2 over images or gradients, measured from pixels), lowest 4.47:1 (needs 4.5) span.avatar "李" #5f6878 on #dbe6fb, 12px. Targets under 24 px that fail the spacing exception: 0 of 26. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.

## B

Render: 5 of 5 manifest items rendered, 8 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- list.html (1440x900@1): ok, frames list-01.png, list-02.png, page height 1162 px.
- list-empty.html (1440x900@1): ok, frames list-empty-01.png, page height 900 px.
- list-loading.html (1440x900@1): ok, frames list-loading-01.png, list-loading-02.png, page height 1050 px.
- list-error.html (1440x900@1): ok, frames list-error-01.png, page height 900 px.
- detail.html (1440x900@1): ok, frames detail-01.png, detail-02.png, page height 1446 px.

B: 5 of 5 files present.
- list.html (1440x900@1): text below AA: 0 of 328 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 74. Images without alt: 0. Horizontal overflow: no.
- list-empty.html (1440x900@1): text below AA: 0 of 77 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 36. Images without alt: 0. Horizontal overflow: no.
- list-loading.html (1440x900@1): text below AA: 0 of 57 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 31. Images without alt: 0. Horizontal overflow: no.
- list-error.html (1440x900@1): text below AA: 0 of 72 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 32. Images without alt: 0. Horizontal overflow: no.
- detail.html (1440x900@1): text below AA: 0 of 177 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 27. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.
