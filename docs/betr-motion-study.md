# Betr / Motto motion study

Reference: https://60fps.design/motion/betr-by-motto
Official case study: https://wearemotto.com/portfolio/betr

Local implementation only, 2026-10-10. No production deployment yet.

Observed source is a 15-second square montage: a tall white reel, two upper-right panels, and two lower panels. Frames examined at 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14 seconds. Left reel repeats three bands of words with vertical foreshortening; lower-right ticker exposes a bright centered line and masked neighboring lines. Upper-right scenes include stadium imagery and mobile screens; these brand assets are not replicated.

Portfolio adaptation: research/development words, personal name, AI outlines and code-sharing statements. One rAF clock drives a Canvas word reel, DOM ticker, SVG dashed outline and statement transitions. Reel uses sinusoidal vertical position and cosine vertical scale. Stops offscreen, when the document is hidden, on explicit pause and for reduced motion. Accessible biography and heading remain HTML; decorative repeated text is hidden from assistive technology.

Fidelity limits: original font name, glyph outlines, animation curves and exact per-scene keyframes are unavailable. Existing self-hosted Inter is used. The source reel and ticker are recreated by observation; the vector outlines and scene transitions are adaptations, not frame-identical copies. Stadium, mobile UI, icon and product mockups from Betr are absent. Do not describe this as a perfect replica.

Validation: typegen, TypeScript, ESLint, production build; browser captures at 1440 and 375 pixels; advancing frames, pause/resume, reduced motion and page overflow checks. See external QA directory for evidence.
