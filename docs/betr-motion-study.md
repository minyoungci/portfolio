# Betr / Motto motion study

Reference: https://60fps.design/motion/betr-by-motto
Official case study: https://wearemotto.com/portfolio/betr

Initial local study: 2026-10-10. The refined implementation was deployed to minyoungxi.com in commit `7446d3a` before the 2026-10-15 whole-site redesign.

Observed source is a 15-second square montage: a tall white reel, two upper-right panels, and two lower panels. Frames examined at 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14 seconds. Left reel repeats three bands of words with vertical foreshortening; lower-right ticker exposes a bright centered line and masked neighboring lines. Upper-right scenes include stadium imagery and mobile screens; these brand assets are not replicated.

Portfolio adaptation: research/development words, personal name, AI outlines and code-sharing statements. One rAF clock drives a Canvas word reel, DOM ticker, SVG dashed outline and statement transitions. Reel uses sinusoidal vertical position and cosine vertical scale. Stops offscreen, when the document is hidden, on explicit pause and for reduced motion. Accessible biography and heading remain HTML; decorative repeated text is hidden from assistive technology.

Fidelity limits: original font name, glyph outlines, animation curves and exact per-scene keyframes are unavailable. Existing self-hosted Inter is used. The source reel and ticker are recreated by observation; the vector outlines and scene transitions are adaptations, not frame-identical copies. Stadium, mobile UI, icon and product mockups from Betr are absent. Do not describe this as a perfect replica.

Validation: typegen, TypeScript, ESLint, production build; browser captures at 1440 and 375 pixels; advancing frames, pause/resume, reduced motion and page overflow checks. See external QA directory for evidence.


## 2026-10-15 MCP verification and refinement

Connected using the exact registered stdio command (`npx -y mcp-remote` plus the configured endpoint) through the installed MCP SDK. initialize identified server `motionsites-ai` v0.1.0. tools/list returned search_prompts, list_prompts, get_prompt and get_related_prompts. This verifies the remote bridge independently; this chat does not currently expose these as native tool bindings.

Actual calls: search_prompts("Betr Motto") returned zero matches; the kinetic typography search returned premium results. get_prompt("pulse-3d") returned locked/premium_prompt. list_prompts(access=free, category=Portfolio) succeeded. get_prompt("personal-showcase") returned the full free prompt (free_prompts_remaining=2). It is an unrelated cream editorial portfolio; its font, copy, assets and layout were not used. Its explicit transform easing cubic-bezier(.22,1,.36,1) informed the statement transition only. This service supplies design prompts, not Betr source code or original font/timeline data.

Reference-based refinements: normal-weight reel letters (400 rather than 500), increased maximum type size from 19% to 21% of panel width, three reel bands confined to the inner 76.5% of the tall panel instead of touching its edges. Ticker now advances every 1000ms with a 250ms transition and selectively highlights the centered word; adjacent words stay dim. These are observation-based tuning values, not author-supplied timings. Canvas font/color reads moved out of the frame loop. Corrected animation clock drift from capped frame deltas, and combined viewport/document visibility checks. Disposed effect callbacks cannot repaint a newer effect after font loading.

Original fonts and exact scene keyframes remain unverified. This refinement was subsequently deployed in `7446d3a`; production motion, pause/resume and reduced-motion behavior were checked. The next design iteration is documented in `design-redesign-20261015.md`.
