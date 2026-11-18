# Implementation QA — 18 November 2026

This is the historical first-implementation audit. The active cinematic rebuild has a ten-second intro, six physical chapters, original ambience and new hardware-GPU measurements. Read PHASE_PROGRESS.md and CINEMATIC_REBUILD.md for current results and limits.

## Environment

- Windows, Node 24.19.0, npm 11.17.0.
- Next.js 16.4.6, React 19.3.1, Three.js 0.187.0, Fiber 9.8.2, Drei 10.7.9.
- Playwright runs local Microsoft Edge headlessly with software WebGL, at 1440 × 900 and 390 × 844. Tests run serially to avoid software-renderer contention.
- Development server checked at `http://127.0.0.1:3000` (HTTP 200).

## Visual review

Final verification:

| Check | Result |
| --- | --- |
| TypeScript | Pass |
| ESLint | Pass, no warnings |
| State-transition tests | 3/3 pass |
| Edge browser tests | 8/8 pass across desktop and mobile viewports |
| Production build | Pass; `/`, `/_not-found` and `/icon.svg` prerendered |
| Final geometry review | 3 additional desktop captures, zero page errors |

The final browser regression caught and verified a fix for Enter-key navigation activating a newly focused dialog Close button. After the full suite, final visual review moved the brush pot/palette clear of the sketchbook and adjusted the cover resting angle; corrected screenshots and a fresh lint/type/build verification passed.

Inspected screenshots of the desktop and mobile studio, book approach/open state, wide gallery and frame inspection. The scene renders real geometry; it is not a CSS perspective illustration. Studio details include layered trees, instanced foliage and roots, circular plank flooring, a partial shingled canopy, beams and braces, arched illuminated windows, shelves, books, hanging lights, plants, an easel, desk supplies and a burgundy guide.

Review found and corrected the gallery camera handoff, blank page illustration caused by depth overlap, severe procedural grain aliasing, flat lighting, missing favicon, and ineffective quiet-mode exhibition actions. The mobile book has a readable lower information panel. The gallery has direct numbered frame access and an explicit return action.

The guide remains a visible **procedural blocking model**. Its face, cloth and motion are not a finished likeness or production rig. Empty gallery frames are explicitly identified as placeholders and do not represent Srishti's work.

Screenshots are reproducible through `npm.cmd run test:browser` and stored in ignored `test-results/`: `{desktop,mobile}-{atelier,book,portals,gallery-wide,gallery}.png`.

Final corrected reduced-motion review captures: `desktop-studio-final.png`, `desktop-book-final.png`, `desktop-portals-final.png` in the same directory. These additional review captures are local artifacts, not tracked public assets.

## Performance and compatibility limits

Software WebGL is much slower than a hardware GPU, so these checks do not establish a 60 FPS or Lighthouse score. Shadow maps and pixel ratio are reduced on mobile/software renderers; sustained low frame rates also trigger gentle quality. Rendering pauses behind modal dialogs and in hidden tabs. Reduced motion uses demand rendering and skips the intro.

Real Safari/iOS/Android, assistive technologies, hardware-GPU profiling and Lighthouse have not been tested. The installed Fiber stack emits a Three.js Clock deprecation warning; application console errors are checked separately by browser tests.

## Dependencies and privacy

The production dependency audit reports zero advisories. The full audit reports 14 high-severity development-tool dependency findings, all rooted in the picomatch glob ReDoS advisory GHSA-fc5q-39xc-vjpf and its dependents. The registry's current picomatch release is 4.0.7, which the advisory includes; no unverified override, forced downgrade or force-fix was applied. Recheck the advisory when a patched release is published.

Private mascot references remain at ignored `assets/mascot/references/`. No raw asset tree has been copied into `public/`. No work, credentials, contact details, MAITRI/OASIS contributions or achievements were invented. No push, hosting registration, or deployment was performed.
