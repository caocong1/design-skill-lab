# Measured facts: 05-agent-approvals

Frames in A/, B/ and C/ are canonical renders made by evals/render.mjs from each label's HTML at the viewports in the brief's render manifest. Full-page items are cut into consecutive viewport-sized frames (<name>-01.png, -02.png, ...; the last frame ends at the page bottom and may overlap the one before). Viewport items give one frame.
Measured with evals/tools/facts.mjs @ f5c0421 (renderer evals/render.mjs @ f5c0421), run the same way on every label. Contrast is WCAG 2.2 AA on the judged area only; targets are counted only where marked up as interactive, so target counts are a lower bound. What the tool reports as not measurable is left unmeasured.

## A

Render: 4 of 4 manifest items rendered, 8 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- run-progress.html (1440x900@1): ok, frames run-progress-01.png, run-progress-02.png, page height 1147 px.
- run-approval.html (1440x900@1): ok, frames run-approval-01.png, run-approval-02.png, page height 1403 px.
- run-error.html (1440x900@1): ok, frames run-error-01.png, run-error-02.png, page height 1399 px.
- run-result.html (1440x900@1): ok, frames run-result-01.png, run-result-02.png, page height 1619 px.

A: 4 of 4 files present.
- run-progress.html (1440x900@1): text below AA: 0 of 123 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 11. Images without alt: 0. Horizontal overflow: no.
- run-approval.html (1440x900@1): text below AA: 0 of 134 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 14. Images without alt: 0. Horizontal overflow: no.
- run-error.html (1440x900@1): text below AA: 0 of 111 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 12. Images without alt: 0. Horizontal overflow: no.
- run-result.html (1440x900@1): text below AA: 0 of 172 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 22. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.

## B

Render: 4 of 4 manifest items rendered, 9 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- run-progress.html (1440x900@1): ok, frames run-progress-01.png, run-progress-02.png, page height 1107 px.
- run-approval.html (1440x900@1): ok, frames run-approval-01.png, run-approval-02.png, run-approval-03.png, page height 2175 px.
- run-error.html (1440x900@1): ok, frames run-error-01.png, run-error-02.png, page height 1213 px.
- run-result.html (1440x900@1): ok, frames run-result-01.png, run-result-02.png, page height 1697 px.

B: 4 of 4 files present.
- run-progress.html (1440x900@1): text below AA: 0 of 116 measured text nodes (6 over images or gradients, measured from pixels). Targets under 24 px that fail the spacing exception: 0 of 9. Images without alt: 0. Horizontal overflow: no.
- run-approval.html (1440x900@1): text below AA: 0 of 192 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 13. Images without alt: 0. Horizontal overflow: no.
- run-error.html (1440x900@1): text below AA: 0 of 96 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 11. Images without alt: 0. Horizontal overflow: no.
- run-result.html (1440x900@1): text below AA: 0 of 142 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 22. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.

## C

Render: 4 of 4 manifest items rendered, 10 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- run-progress.html (1440x900@1): ok, frames run-progress-01.png, run-progress-02.png, page height 1395 px.
- run-approval.html (1440x900@1): ok, frames run-approval-01.png, run-approval-02.png, run-approval-03.png, page height 1892 px.
- run-error.html (1440x900@1): ok, frames run-error-01.png, run-error-02.png, page height 1467 px.
- run-result.html (1440x900@1): ok, frames run-result-01.png, run-result-02.png, run-result-03.png, page height 1899 px.

C: 4 of 4 files present.
- run-progress.html (1440x900@1): text below AA: 0 of 122 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 9. Images without alt: 0. Horizontal overflow: no.
- run-approval.html (1440x900@1): text below AA: 0 of 170 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 13. Images without alt: 0. Horizontal overflow: no.
- run-error.html (1440x900@1): text below AA: 0 of 117 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 11. Images without alt: 0. Horizontal overflow: no.
- run-result.html (1440x900@1): text below AA: 0 of 153 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 18. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.
