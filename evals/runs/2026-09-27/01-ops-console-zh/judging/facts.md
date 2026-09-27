# Measured facts: 01-ops-console-zh

Frames in A/, B/ and C/ are canonical renders made by evals/render.mjs from each label's HTML at the viewports in the brief's render manifest. Full-page items are cut into consecutive viewport-sized frames (<name>-01.png, -02.png, ...; the last frame ends at the page bottom and may overlap the one before). Viewport items give one frame.
Measured with evals/tools/facts.mjs @ f5c0421 (renderer evals/render.mjs @ f5c0421), run the same way on every label. Contrast is WCAG 2.2 AA on the judged area only; targets are counted only where marked up as interactive, so target counts are a lower bound. What the tool reports as not measurable is left unmeasured.

## A

Render: 5 of 5 manifest items rendered, 8 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- list.html (1440x900@1): ok, frames list-01.png, list-02.png, page height 1157 px.
- list-empty.html (1440x900@1): ok, frames list-empty-01.png, page height 900 px.
- list-loading.html (1440x900@1): ok, frames list-loading-01.png, list-loading-02.png, page height 1102 px.
- list-error.html (1440x900@1): ok, frames list-error-01.png, page height 900 px.
- detail.html (1440x900@1): ok, frames detail-01.png, detail-02.png, page height 1448 px.

A: 5 of 5 files present.
- list.html (1440x900@1): text below AA: 0 of 346 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 49. Images without alt: 0. Horizontal overflow: no.
- list-empty.html (1440x900@1): text below AA: 0 of 79 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 24. Images without alt: 0. Horizontal overflow: no.
- list-loading.html (1440x900@1): text below AA: 0 of 58 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 21. Images without alt: 0. Horizontal overflow: no.
- list-error.html (1440x900@1): text below AA: 0 of 69 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 23. Images without alt: 0. Horizontal overflow: no.
- detail.html (1440x900@1): text below AA: 0 of 206 measured text nodes (9 over images or gradients, measured from pixels). Targets under 24 px that fail the spacing exception: 0 of 28. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.

## B

Render: 5 of 5 manifest items rendered, 8 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- list.html (1440x900@1): ok, frames list-01.png, list-02.png, page height 1187 px.
- list-empty.html (1440x900@1): ok, frames list-empty-01.png, page height 900 px.
- list-loading.html (1440x900@1): ok, frames list-loading-01.png, list-loading-02.png, page height 1020 px.
- list-error.html (1440x900@1): ok, frames list-error-01.png, page height 900 px.
- detail.html (1440x900@1): ok, frames detail-01.png, detail-02.png, page height 1714 px.

B: 5 of 5 files present.
- list.html (1440x900@1): text below AA: 2 of 280 measured text nodes, lowest 2.75:1 (needs 4.5) span.sep "/" #8a979a on #f3f5f6, 13px. Targets under 24 px that fail the spacing exception: 0 of 76. Images without alt: 0. Horizontal overflow: no.
- list-empty.html (1440x900@1): text below AA: 1 of 73 measured text nodes, lowest 2.75:1 (needs 4.5) span.sep "/" #8a979a on #f3f5f6, 13px. Targets under 24 px that fail the spacing exception: 0 of 37. Images without alt: 0. Horizontal overflow: no.
- list-loading.html (1440x900@1): text below AA: 1 of 56 measured text nodes, lowest 2.75:1 (needs 4.5) span.sep "/" #8a979a on #f3f5f6, 13px. Targets under 24 px that fail the spacing exception: 0 of 32. Images without alt: 0. Horizontal overflow: no.
- list-error.html (1440x900@1): text below AA: 1 of 69 measured text nodes, lowest 2.75:1 (needs 4.5) span.sep "/" #8a979a on #f3f5f6, 13px. Targets under 24 px that fail the spacing exception: 0 of 33. Images without alt: 0. Horizontal overflow: no.
- detail.html (1440x900@1): text below AA: 4 of 210 measured text nodes (1 over images or gradients, measured from pixels), lowest 2.75:1 (needs 4.5) span.sep "/" #8a979a on #f3f5f6, 13px. Targets under 24 px that fail the spacing exception: 0 of 27. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.

## C

Render: 5 of 5 manifest items rendered, 8 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- list.html (1440x900@1): ok, frames list-01.png, list-02.png, page height 1203 px.
- list-empty.html (1440x900@1): ok, frames list-empty-01.png, page height 900 px.
- list-loading.html (1440x900@1): ok, frames list-loading-01.png, list-loading-02.png, page height 1155 px.
- list-error.html (1440x900@1): ok, frames list-error-01.png, page height 900 px.
- detail.html (1440x900@1): ok, frames detail-01.png, detail-02.png, page height 1633 px.

C: 5 of 5 files present.
- list.html (1440x900@1): text below AA: 0 of 313 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 58. Images without alt: 0. Horizontal overflow: no.
- list-empty.html (1440x900@1): text below AA: 0 of 79 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 24. Images without alt: 0. Horizontal overflow: no.
- list-loading.html (1440x900@1): text below AA: 0 of 59 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 22. Images without alt: 0. Horizontal overflow: no.
- list-error.html (1440x900@1): text below AA: 0 of 75 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 23. Images without alt: 0. Horizontal overflow: no.
- detail.html (1440x900@1): text below AA: 0 of 171 measured text nodes (1 over images or gradients, measured from pixels). Targets under 24 px that fail the spacing exception: 0 of 25. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.
