# Cinematic rebuild checkpoint

This continues the existing portfolio. The latest mission authorizes local implementation, including the new book animation, but prohibits commits, pushes, deployment and deletion of private reference photographs.

## Active implementation

- src/scenes3d/Atelier.tsx: camera journey, visibility handling, lighting, quality adaptation and keyboard walking.
- src/scenes3d/world/Studio.tsx: custom tree architecture, carved desk, layered canopy, moon window, environmental props and the existing guide.
- world/Forest.tsx and world/geometry.ts: curved/fluted trunks, tapered branches, modeled leaves and instanced environmental layers. Gentle quality uses fewer distant trees/leaves and lower-resolution trunks.
- world/Atmosphere.tsx: fireflies, drifting haze, subtle light-shaft approximation and moon.
- world/MagicalBook.tsx: burgundy/gold cover, opening, page textures with real data/empty states, bending paper and page interactions.
- world/BookBloom.tsx: timed floating sketches, art tools, paper bird, particles, trails and miniature invention; objects settle away after the reveal.
- world/Realms.tsx: design gallery, interactive invention studies, greenhouse, book tree, archive and film-room foundations. These are not finished portfolio exhibitions.
- src/data/chapters.ts: six chapters in the requested order.
- src/components/Ambience.tsx: original synthesized 48-second looping ambience, opt-in playback and volume/mute controls. No external audio files or licensing dependencies.
- src/app/cinematic.css: reduced overlays and responsive scene-edge controls. Chapter content is rendered on actual book surfaces; matching HTML supports assistive technology and unsupported WebGL.

The earlier Environment.tsx and legacy sketchbook in Objects.tsx remain available for comparison. The active scene uses world/ and the instanced Books/Plant helpers. Private photos remain under ignored assets/mascot/references/; none are published as textures.

## Constraints and limits

The Figma connector returned its Starter-plan tool limit; the shared public URL was inaccessible. Latest Figma edits were not verified or reproduced. Blender was not found locally. No custom Blender sculpt or final rigged glTF likeness has been produced.

The procedural guide has improved curls, face proportions, blinking, pupil/head tracking, breathing, waving and basic locomotion/pose behavior. It is not a finished likeness or natural skeletal animation. Cloth/skin/hair are stylized procedural approximations.

Real work, resume, verified education/experience, contact details, artwork, videos, reading notes and memories are still absent. No records, achievements or MAITRI/OASIS contributions have been invented. All six realms retain placeholder exhibits; full content-specific experiences, sophisticated collisions and final production art are unfinished.

## Verification and recovery

Run npm.cmd run typecheck, npm.cmd run lint, npm.cmd test, npm.cmd run build; with the existing server at http://127.0.0.1:3000, run npm.cmd run test:browser. Tests verify six chapters and realm return paths, actual camera movement, reveal/page controls, audio gesture requirements, volume/mute, professional access, WebGL fallback and ten-second intro persistence.

Browser screenshots are saved under ignored test-results/. The final review/profile helper, if retained, is temp/profile-cinematic.mjs. Its software-renderer measurements are not hardware-GPU performance guarantees. Do not assume any previous process or check survived an interruption; inspect Git and rerun affected checks.

Initial software-renderer profiling exposed poor performance (about 3.3 FPS desktop, 7.6 FPS mobile). This prompted instancing of books/plants and a real geometric reduction for gentle mode; final measurements and validation are recorded in PHASE_PROGRESS.

Final automated checks pass: TypeScript, lint, four unit tests, eight desktop/mobile browser tests and production build. Hardware-accelerated Edge on the local Intel GPU measured approximately 60 FPS in five-second desktop/mobile-viewport samples. Actual physical mobile devices and other browser engines were not tested. Software-only rendering improved to about 11.6/17.3 FPS with adaptive resolution, so hardware acceleration or quiet mode is appropriate for sustained exploration.

Localhost is intentionally left running. All rebuild files remain unstaged/uncommitted for review. If the intro is bypassed by session memory, use Field guide → Replay the opening. Use the Sound off control to opt into the original ambience.

Returning from a realm restores the selected open page without replaying the opening/reveal. The final eight-case browser regression and production build pass after this refinement. A source-only recovery archive is saved locally at temp/cinematic-rebuild-checkpoint-20261118.zip, excluding reference photos, node_modules, .git and build output.

Final portrait visual QA: widened the foreground forest corridor so the frontal mobile camera has a clear view of the desk and sketchbook. Fresh hardware desktop/mobile captures report no page errors, and the production build passes after this correction. The guide remains close to the portrait left edge; further character/framing polish is unfinished.
