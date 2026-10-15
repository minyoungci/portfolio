# Three.js particle hero — 2026-10-15

## Scope and reference

The homepage hero replaces the five-panel motion board with a procedural Three.js sphere and oversized purple name typography. Profile data, content sections and detail routes are unchanged.

Reference: https://motionsites.ai/?prompt=nex-robotics. The native MotionSites MCP search found NEX Robotics; `get_prompt` returned a premium-access restriction. Its public preview was inspected: large central subject, overlapping display typography and small peripheral labels. This implementation uses that composition as inspiration; it does not use the locked prompt, robot asset or original source code.

## Implementation

- `components/Hero.tsx`: server-rendered profile copy and hero composition.
- `components/ParticleSphere.tsx`: dynamically imports the renderer; provides a deterministic SVG fallback and a keyboard-accessible pause/play button.
- `lib/particleSphere.ts`: Three.js 0.186.1, one `Points` draw and one orbit-line draw. Shader deformation, slow rotation and exponentially damped pointer input. No external models, textures or post-processing.
- Desktop: 7,200 particles, device pixel ratio capped at 1.6. Mobile/coarse pointer: 3,200 particles, ratio capped at 1.35. Sustained slow frames reduce resolution once to 75% of that cap.
- Vertical touch scrolling and pinch zoom remain available. Pointer cancellation and release restore the resting field.
- Rendering stops while paused, offscreen, hidden or under `prefers-reduced-motion`. Theme and size changes render a fresh static frame as needed.
- WebGL initialization failure, chunk loading failure and context loss retain the SVG artwork. Context restoration resumes the renderer. Unmount disposes the GPU resources, observers and event listeners.
- At 900px and below the hero flows as name, sphere, controls and profile copy so text cannot collide with the canvas caption.

## Verification

Passed: Next type generation, TypeScript, ESLint and production build (32 routes). All 40 browser checks passed against the production build on port 3111, with no console or shader errors. Browser checks cover actual WebGL draw calls, shader pointer uniforms, pause/play, reduced motion, offscreen suspension, simulated visibility events, context loss/restoration, touch input, native vertical swipe, theme changes, 320–1440px layouts, text resize, navigation cleanup and no-WebGL/no-JavaScript fallback.

For 99 sampled frame intervals, desktop median/p95 were 16.7/17.0ms; mobile emulation median/p95 were 16.7/17.5ms. These measurements do not establish a performance guarantee on physical phones. Desktop dark/light and mobile dark/light screenshots were inspected. The existing multiple-lockfile workspace-root warning remains unchanged.

Browser evidence is stored outside the checkout in `particle-hero-20261015/local/` under the task visualization directory. Frame measurements are from headless Edge on this computer with mobile emulation, not a physical phone benchmark.

This version is a local implementation candidate; production deployment is a separate action.
