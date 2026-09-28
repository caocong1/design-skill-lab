# Measured facts: 04-miniprogram-list-zh

Frames in A/ and B/ are canonical renders made by evals/render.mjs from each label's HTML at the viewports in the brief's render manifest. Full-page items are cut into consecutive viewport-sized frames (<name>-01.png, -02.png, ...; the last frame ends at the page bottom and may overlap the one before). Viewport items give one frame.
Measured with evals/tools/facts.mjs @ f5c0421 (renderer evals/render.mjs @ f5c0421), run the same way on every label, with --touch 44 (also counts every target under 44 x 44 CSS px). Contrast is WCAG 2.2 AA on the judged area only; targets are counted only where marked up as interactive, so target counts are a lower bound. What the tool reports as not measurable is left unmeasured.

## A

Render: 3 of 3 manifest items rendered, 3 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- list.html (375x812@2): ok, frames list.png, page height 812 px.
- filter.html (375x812@2): ok, frames filter.png, page height 812 px.
- empty.html (375x812@2): ok, frames empty.png, page height 812 px.

A: 3 of 3 files present.
- list.html (375x812@2): text below AA: 0 of 62 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 22; under 44 px: 0. Images without alt: 0. Horizontal overflow: no.
- filter.html (375x812@2): text below AA: 0 of 54 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 41; under 44 px: 0. Images without alt: 0. Horizontal overflow: no.
- empty.html (375x812@2): text below AA: 0 of 35 measured text nodes. Targets under 24 px that fail the spacing exception: 0 of 26; under 44 px: 0. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.

## B

Render: 3 of 3 manifest items rendered, 3 frames, 0 console errors, no page truncated at 10 screens, no horizontal overflow.
- list.html (375x812@2): ok, frames list.png, page height 812 px.
- filter.html (375x812@2): ok, frames filter.png, page height 812 px.
- empty.html (375x812@2): ok, frames empty.png, page height 812 px.

B: 3 of 3 files present.
- list.html (375x812@2): text below AA: 2 of 65 measured text nodes, lowest 2.64:1 (needs 4.5) span.dot "·" #9aa0a6 on #ffffff, 16px. Targets under 24 px that fail the spacing exception: 0 of 0; under 44 px: 0. Images without alt: 0. Horizontal overflow: no.
- filter.html (375x812@2): text below AA: 2 of 50 measured text nodes, lowest 2.64:1 (needs 4.5) span.dot "·" #9aa0a6 on #ffffff, 16px. Targets under 24 px that fail the spacing exception: 0 of 0; under 44 px: 0. Images without alt: 0. Horizontal overflow: no.
- empty.html (375x812@2): text below AA: 2 of 45 measured text nodes, lowest 2.64:1 (needs 4.5) span.dot "·" #9aa0a6 on #ffffff, 16px. Targets under 24 px that fail the spacing exception: 0 of 0; under 44 px: 0. Images without alt: 0. Horizontal overflow: no.
Method: evals/tools/facts.mjs; targets are counted only where marked up as interactive, so they are a lower bound.
