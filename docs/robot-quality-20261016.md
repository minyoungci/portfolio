# Robot quality refinement — 2026-10-16

The user requested a higher-quality robot. This local candidate starts from `2e2e425`, in the `portfolio-site-info-structure-216a05` worktree. It changes the robot's geometry, materials and lighting while retaining the homepage layout, copy, content and existing interaction controls.

## Appearance

- Replaced the overlaid ellipsoid face and original head mesh with a continuous sculpted helmet, tapered jaw and curved dark visor. Added optical lenses, metallic visor lips, temple actuators and small vents/fasteners.
- Separated satin ceramic armor, titanium joints, graphite recesses, low-gloss finger grips and clear-coated sensor glass. Replaced the flat chest circle with an inset layered bezel, lens and illuminated core.
- Replaced the generic room reflections with three studio softboxes. Added directional self-shadows (2048px desktop / 1024px mobile) and retained restrained purple rim light.
- Kept the original joint hierarchy and artistic head pivot. Existing gaze, drag, greeting, scan and mode transitions use the same controller. New mesh resources and the shadow target are disposed on unmount.
- `lib/robotAppearance.ts` contains the appearance construction; `lib/robotScene.ts` owns loading, rendering and interaction lifecycle. Small repeated vent/fastener meshes are merged by material.

## Model preparation

The base model and BSD-3-Clause license remain pinned to the source in [the original implementation](robot-hero-20261015.md). The new helmet is an original artistic addition; it is not a claim about the physical G1 robot.

1. Start from the previously generated `g1-upper-body.raw.glb` (same source and joint transforms).
2. glTF Transform 4.5.0 simplify: desktop ratio 0.55 / error 0.001; mobile ratio 0.18 / error 0.003.
3. Offline Blender 4.5.10: remove the original head mesh but retain `head_gaze`; weld with 0.000001 tolerance; mark edges sharp above 35 degrees; generate face-area-and-angle weighted normals. Apply 0.00018m bevels above 40 degrees to non-hand meshes, using two segments for desktop and one for mobile. Hand meshes retain the simplified original geometry.
4. Export glTF with normals, joint extras and Y-up coordinates, then Meshopt-compress at medium level. Verify joint names, axes, transforms and head pivot against the prior GLB.

| Asset | Bytes | Base triangles | SHA-256 |
| --- | ---: | ---: | --- |
| robot-desktop.glb | 2310224 | 332362 | 14c4ea12e2ebcad3c45c66347bb620b96405394fd5db940e169d3545a806dad1 |
| robot-mobile.glb | 915268 | 108448 | eb51babb50b0829b9930be10a25245833bd81d7ad5a8cf76a9f5134e7aa69aa2 |

Both assets contain 31 source meshes. Procedural helmet, chest and hologram geometry is additional. Removing the replaced head avoids shipping invisible geometry. The transparent fallback poster is regenerated from the actual final scene.

Preparation scripts, intermediates and browser evidence are saved locally under `C:/Users/dbssu/.codex/visualizations/2026/10/03/01a1015c-24a8-7671-a448-0c99c845891d/robot-quality-20261016/`.

## Verification

- Type generation, TypeScript, ESLint and production build passed. Build generated 32 pages; the pre-existing multiple-lockfile workspace warning remains.
- Both GLBs pass glTF validator error/warning checks. Informational messages describe the intentionally empty runtime head pivot and the validator's unsupported Meshopt extension; browser decode/render checks cover the compressed geometry.
- Final production-build browser suite: **48/48 passed**, no runtime/network errors. Actual WebGL draw/matrix probes verify the new helmet, torso and articulated wrist; checks also cover gaze, drag, zoom/reset, keyboard controls, three theme geometries, greeting, scan, pause/reduced motion, offscreen/hidden suspension, context loss/restoration, GPU disposal and the refreshed fallback poster.
- Responsive checks pass at 320/375/768/900/1024/1440px and 200% text size. Desktop/mobile dark and light screenshots are in `verified/`; mobile touch rotation, vertical page scroll and menu navigation passed.
- Edge headless mobile emulation: median frame interval **16.7ms**, p95 **17.5ms**. Mobile loads only the 915,268-byte asset and retains the 1.4 pixel-ratio cap. These are desktop-emulation measurements, not physical-phone results.
- The app's existing connection-error tab could not be refreshed automatically because browser policy blocked access to its error-page URL. The independent local production-browser checks and screenshots above succeeded; the user can reload the preview tab manually.

## Release boundary

Local preview: `http://127.0.0.1:3111/`. This change has not been pushed or deployed to minyoungxi.com. Physical-phone thermal behavior and sustained FPS are not established by browser mobile emulation.
