# Portfolio design update — 2026-10-15

## Scope and references

Public pages of minyoungxi.com, implemented in the production worktree on `codex/add-tossbot-portfolio`. Canonical data, route slugs, section order, authentication and publishing APIs are unchanged.

Applied skills: `better-ui`, `better-layout`, `better-typography`, `better-accessibility`. The previously installed 60fps skills target SwiftUI; they were not used as web implementation instructions.

Actual motionsites MCP calls through the registered `mcp-remote` bridge:
- `search_prompts`: `portfolio typography minimal`, `dark purple portfolio`.
- `get_prompt`: `max-reed-portfolio`, returned unlocked full prompt. [Reference](https://motionsites.ai/?prompt=max-reed-portfolio).

The reference informed the expressive type scale, split layout, rounded surfaces and glass controls. Its sample identity, testimonials, metrics and media were not used. The existing Betr-inspired canvas/SVG identity remains an adaptation, with the fidelity limits in `betr-motion-study.md`.

## Current design

- A shared 1280px container; 20–48px side padding. Two-column introduction/motion board above 900px; stacked below it.
- Inter and Noto Sans KR remain self-hosted. Large name, restrained English labels, comfortable Korean body text. Open-source development is visible in the hero and About.
- Section titles align to the common leading edge with data-derived collection counts. Projects, Piece and papers retain 640px coverflow cards and 84vw mobile sizing. Two Post cards share one desktop row.
- Purple type covers replace generic gradient placeholders. Award details and existing metrics occupy separate columns; About separates biography and timeline; Contact uses a large purple surface.
- Project titles precede their covers; detail media expands to 912px while body text remains capped at 680px. Scientific paper titles use a smaller, more readable scale than the hero.
- Mobile navigation exposes all sections in an expandable panel; Escape closes it. Touch controls are at least 44px tall. A skip link targets the content.
- Album motion has explicit pause/play controls. Interaction pauses autoplay. Video previews pause offscreen, when hidden, on explicit pause, or for reduced motion. Pointer velocity uses the event timestamp.
- Piece lightbox uses a body portal, inert background, focus trapping/restoration and a mobile scroll container with a reachable close button.
- Publication counts distinguish 8 published papers (6 first/co-first author), 1 preprint and 1 award. The JSON records are unchanged.

## Verification

Required commands: `npx next typegen`, `npx tsc --noEmit`, `npm run lint`, `npm run build`. The existing multiple-lockfile workspace-root warning remains; compilation and type checks succeed.

Browser evidence is stored outside the repository in `portfolio-redesign-20261015` under the task visualization directory. Checks cover all 17 public detail routes at 1440px and 375px, home at 320px/375px/1440px, light/dark appearance, 200% text-size reflow, hero pause/resume/reduced motion, carousel controls, and Piece keyboard focus behavior. Deployment verification is recorded in the task response after the production URL is checked.
