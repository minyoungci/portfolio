# AI robot hero — 2026-10-15

The user's robot selection supersedes the local particle-sphere hero. The homepage now renders an articulated, real 3D humanoid upper body with a purple AI visualization. Profile facts, portfolio records and archive content remain unchanged. Verification also prompted narrow wrapping fixes for enlarged section titles, carousel dots and the contact heading at 200% text size.

## Reference and provenance

- Composition: the user's NEX Robotics reference on MotionSites. The public preview and search metadata were available; its premium full prompt remained locked. This is an original implementation informed by that composition, not a claim of exact reproduction.
- Model: Unitree G1 from Google DeepMind's MuJoCo Menagerie, pinned to [`62ab00f2bc44f6f20c1c9b7a13f3fb1dd41a4e35`](https://github.com/google-deepmind/mujoco_menagerie/tree/62ab00f2bc44f6f20c1c9b7a13f3fb1dd41a4e35/unitree_g1).
- BSD-3-Clause copyright, conditions and disclaimer are shipped in `public/models/robot/LICENSE.txt`, with a visible `Model credits` link to `credits.txt`. The work is not endorsed by the upstream organizations.
- The upper-body subtree uses 32 meshes after removing the separate logo mesh. Legs, collision meshes and physics parameters are omitted. Added: an artistic gaze pivot, visor, lights and chest circuit detail. Motion does not represent validated G1 control or medical inference.

## Implementation

- `components/RobotExperience.tsx`: accessible HTML theme buttons, context copy and links; scan, greeting, pause, zoom and reset controls; loading/fallback poster.
- `lib/robotScene.ts`: lazy Three.js/GLTF/Meshopt runtime, physical materials, procedural studio lighting, actual joint transforms, gaze damping and three procedural node configurations. No remote runtime model/texture requests.
- Medical AI shows two neural hemispheres; Open source shows a connected lattice; Research shows a helix. Associated copy follows the existing portfolio's scope and makes no new achievement claims.
- Mouse movement controls the head; dragging turns the robot. Touch allows horizontal rotation while preserving vertical page scrolling and pinch zoom. Focused canvas supports left/right arrows, `+`, `-`, and `Home`.
- Reduced motion renders a still scene; deliberate actions select a static pose. Pause, offscreen intersection and hidden tabs stop continuous rendering. WebGL failure shows a locally rendered transparent poster. Context restoration regenerates the studio environment.
- The mobile model is selected for coarse pointers or an initial viewport at most 700px. Pixel ratio is capped at 1.4 for mobile, 1.8 for desktop, with a sustained slow-frame fallback to 1. Resizing reframes the camera without reloading a heavier model.
- All resources, observers and listeners are released on unmount. Model fetch is abortable; a parse finishing after unmount disposes its scene.

## Assets

| Asset | Bytes | Triangles | SHA-256 |
| --- | ---: | ---: | --- |
| robot-desktop.glb | 893632 | 162442 | b9051d78e0d7a7686e3faaf099574e4b22af4c4a1e1ead532e760dc988911ade |
| robot-mobile.glb | 345120 | 56850 | ec10a7c1c3caef103dc30371abd642820dc1acdaac372c93c2cbb4e6acf837f4 |

STL geometry was welded with a 0.00001 tolerance, normals regenerated, and the original joint hierarchy exported to GLB. glTF Transform 4.5.0 simplification used desktop ratio 0.35/error 0.002, mobile ratio 0.12/error 0.005, followed by Meshopt at medium level. Both GLBs passed validator error/warning checks; its informational output notes that the Meshopt extension is not covered by that validator. Real browser decode/render checks cover that path separately.

The poster is an actual render of this scene, encoded as a transparent WebP. Preparation scripts, original-mesh hashes and detailed QA artifacts are retained locally in the `robot-hero-20261015` visualization directory.

## Verification and release

- `npx next typegen`, `npx tsc --noEmit`, `npm run lint`, `npm run build`: passed. Build generated 32 pages. Existing multiple-lockfile workspace warning remains unrelated.
- Final production-build browser checks: **48/48 passed**, with no browser runtime/network errors. The suite verifies actual indexed geometry and matrix changes at the WebGL boundary, mode geometry, gaze, drag, greeting, scan, zoom/reset, keyboard controls, pause/reduced motion, offscreen/hidden suspension, context loss/restoration, GPU buffer disposal on client navigation, fallback and responsive layouts (320/375/768/900/1024/1440px plus 200% text size).
- Separate mobile context verified the 56,850-triangle asset, capped pixel ratio, horizontal touch rotation and uninterrupted vertical scrolling. Headless Edge mobile emulation measured median frame interval 16.7ms and p95 17.2ms, not a physical-device guarantee.
- Dark/light desktop and mobile screenshots, scan/greeting screenshots and `results.json` are saved in `C:/Users/dbssu/.codex/visualizations/2026/10/03/01a1015c-24a8-7671-a448-0c99c845891d/robot-hero-20261015/verified/`. The in-app browser also visibly rendered the robot on port 3111.
- This is a local candidate based on `43de884`. No production push is part of this robot implementation. Preview: `http://127.0.0.1:3111/`.

Physical-phone thermal behavior and sustained device FPS require testing on actual hardware; desktop browser mobile emulation does not establish them.
