# 📈 Project Roadmap & Phase Progress Ledger
### *Project: Srishti Gupta Portfolio Universe*
### *Document Version: 1.0.0 (Phase 1 Approved Architecture)*

---

## Implementation recovery checkpoint — 18 November 2026

The user's implementation mission and resume request supersede the historical no-code gate below. Historical design decisions remain preserved.

- Repository: `C:\Users\gupta\OneDrive\Desktop\projects\srishti-gupta-portfolio`.
- Recovered source is intact; both test files were zero-filled by the shutdown and have been restored.
- Runtime and development dependencies, including Node types, are installed and locked in `package-lock.json`.

| Mission milestone | Verified implementation | Remaining work |
| --- | --- | --- |
| 1 — Foundation | Next.js App Router, TypeScript, Tailwind, Three/Fiber/Drei; local dev server returns HTTP 200 | None for local setup |
| 2 — Atelier | Real procedural geometry; instanced forest, roots and foliage; circular plank floor, partial canopy, braces, warm arched windows, furniture, books, easel, plants, particles and lighting | Further production art polish and real-device profiling |
| 3 — Narrative | Skippable/session-aware five-second intro, camera approach, hinged book, bending page movement, four pages, clickable 3D portal compass, return controls | More detailed physical page artwork and richer cinematic choreography |
| 4 — Content and gallery | All eight requested hub entries; typed verified-content schema; empty exhibitions; camera navigation and frame inspection; easel/bookshelf shortcuts | Real projects/media; specialized reading, motion, honors and gift experiences currently share the gallery foundation |
| 5 — Mascot | Temporary burgundy human-shaped guide, curly hair, jewelry, pleated skirt; idle/wave/walk/run/turn/interact/celebrate/sit blocking poses | Custom likeness, skeletal rig, polished locomotion and cloth/hair animation |
| 6 — Access and performance | Persistent recruiter access, keyboard/touch controls, native modal focus/Escape, command search, reduced motion, quiet SVG/HTML fallback, WebGL error boundary; limited DPR/shadows, instancing, adaptive quality, hidden-tab/modal rendering pause, listener cleanup | Screen-reader audit, physical device and cross-browser testing |
| 7 — Verification | TypeScript, ESLint, 3 state tests, all 8 desktop/mobile browser tests and final production build pass; visual review and 3 final corrected captures complete | Physical-device, assistive-technology, Lighthouse and cross-browser audits; no launch performed |

### Recovered issues fixed

Restored two zero-filled test files; finished missing installations; fixed texture cleanup, camera-to-gallery handoff, hidden book illustrations, grain aliasing, quiet-mode realm selection, favicon 404 and Enter-key default activation. Reformatted source for maintainability. The private reference images were not edited or copied to public output.

### Safe resume instructions

1. Read this checkpoint and `docs/QA_NOTES.md`; inspect `git status` before changing files.
2. Run `npm.cmd ci` if dependencies are missing, then `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd test`, `npm.cmd run build`.
3. Start `npm.cmd run dev`; use `http://127.0.0.1:3000`. In another terminal run `npm.cmd run test:browser`. Edge is installed locally. Screenshots are ignored under `test-results/`.
4. Do not assume previous processes survived. Stop an owned server with Ctrl+C before restarting it. Never run concurrent dependency installers.
5. Add only verified work in `src/data/portfolio.ts`; copy only approved public media into `public/`. Keep raw private mascot photos in ignored `assets/mascot/references/`.
6. Keep the custom mascot/real-content gaps explicit. Do not present MAITRI/OASIS as completed contributions. No push or deployment is authorized.

Production dependencies have zero audit findings. Development tooling currently has 14 findings rooted in an unpatched picomatch advisory; see `docs/QA_NOTES.md`. Hardware 60 FPS, Lighthouse, Safari/iOS/Android and screen-reader compliance have not been established.

### Git handoff

Implementation commit: **`ed366e1` — `feat: build interactive woodland atelier portfolio`**. The subsequent documentation commit records this checkpoint and QA results; use `git log -2 --oneline` for its hash. Source and documentation were committed separately after successful checks. No push or deployment has been performed. Historical planning sections below are retained verbatim except for their historical heading.

Final validation: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd test` (3/3), `npm.cmd run test:browser` (8/8) and `npm.cmd run build` all pass. The browser suite checks console errors; final corrected book/portal screenshots were also captured without page errors. Screenshots: `test-results/desktop-studio-final.png`, `desktop-book-final.png`, `desktop-portals-final.png`, plus the desktop/mobile suite images. The owned development server is stopped during handoff; restart using the commands above.

## 1. Historical Executive Status Dashboard

- **Current Status:** **Phase 1 Complete & Formally Approved**
- **Next Phase:** **Phase 2: Figma UI/UX Wireframing & Visual Design** *(STRICTLY NO CODE / NO WEB IMPLEMENTATION)*
- **Repository Branch:** `main` (clean, uncommitted workspace)
- **Zero Fabrication Compliance:** **VERIFIED** (No fabricated projects, dummy metrics, or synthetic claims)

---

## 2. Phase 1 Deliverables Audit

| Milestone Deliverable | Target Path | Status | Verification Summary |
|---|---|---|---|
| **Git Repository Inspection** | Root directory | ✅ Complete | Inspected empty Git repo on branch `main` with no prior commits. |
| **Clean Folder Hierarchy** | `docs/`, `design/`, `assets/` subdirs | ✅ Complete | Created organized folders for mascot, artwork, videos, books, graphics, gifts, audio, icons, documents. |
| **Professional README** | `README.md` | ✅ Complete | Master overview of creative vision, provisional palette, dual-path architecture, directory structure, and roadmap. |
| **Master Technical Blueprint** | `docs/MASTER_PLAN.md` | ✅ Complete | Planned Next.js stack, performance gates, 3D fallbacks, and updated 7-phase roadmap. |
| **Site Architecture & Page Map** | `docs/PAGE_MAP.md` | ✅ Complete | Complete information architecture for all 11 realms, atelier-styled recruiter HUD, and responsive breakpoint specs. |
| **Design System & Figma Inventory**| `docs/DESIGN_SYSTEM.md` | ✅ Complete | Color tokens (provisional), typography scales, Figma screen inventory (Desktop & Mobile), and component library specs. |
| **Interaction & Motion Choreography** | `docs/INTERACTIONS.md` | ✅ Complete | 5s skippable intro timeline, mascot motion matrix (agnostic to attire/goggles), 3D sketchbook unfold, living paintings, and recruiter bypass. |
| **Content Schemas & Ingestion Plan** | `docs/CONTENT_PLAN.md` | ✅ Complete | Zero-invention TypeScript schemas for manual project input, asset dimension specs, and compression rules. |
| **Beginner Technologist Guide** | `docs/LEARNING_GUIDE.md` | ✅ Complete | Gentle, plain-English explanations of WebGL, Three.js, shaders, TypeScript, folder maps, and pitfalls. |
| **Phase Progress & Approval Gate** | `docs/PHASE_PROGRESS.md` | ✅ Complete | Tracking ledger, milestone checklists, and Phase 1 review decisions log. |

---

## 3. Phase 1 User Review Decisions & Approvals Log

The following decisions were established during the Phase 1 Review:

1. **Planned Framework Selection:**
   - **Decision:** **Next.js + TypeScript + Tailwind CSS** approved as the planned engineering framework.
   - **Directive:** **Do not install anything yet.** All code installation and scaffolding is deferred to Phase 3.
2. **Color Palette Status:**
   - **Decision:** The magical forest palette (Forest `#0A3323`, Moss `#839958`, Ivory `#F7F4D5`, Rosy Brown `#D3968C`, Midnight Teal `#105666`) is **provisional**.
   - **Directive:** It will be visually evaluated, stress-tested, and finalized inside Figma during Phase 2.
3. **Mascot Conception & Reference Image:**
   - **Decision:** Mascot is **not finalized or designed yet**. Srishti will provide a visual reference image.
   - **Directive:** All assumptions regarding goggles, artisan workwear, or specific accessories have been removed. Motion choreography remains abstract and ready for any character design.
4. **Recruiter Navigation Styling:**
   - **Decision:** **Approved.** Direct access to Work, About, Resume, and Contact is approved and will be styled to match the magical atelier aesthetic (frosted teal glass, moss borders, ivory typography).
5. **Phase 2 Scope Definition:**
   - **Decision:** **Phase 2 is dedicated to Figma UI/UX Wireframing & Visual Design**, NOT engineering or website development.
   - **Directive:** No code, no package installs, no commits, and no pushes.

---

## 4. Multi-Phase Roadmap Ahead

```mermaid
gantt
    title Srishti Gupta Portfolio Universe Implementation
    dateFormat  YYYY-MM-DD
    section Phase 1
    Architecture & Master Blueprint    :done, p1, 2026-11-16, 1d
    section Phase 2
    Figma Wireframing & Visual Design  :active, p2, 2026-11-17, 4d
    section Phase 3
    Next.js Scaffolding & Recruiter HUD:p3, after p2, 3d
    section Phase 4
    Content Engine & Gallery Grids    :p4, after p3, 4d
    section Phase 5
    2D Motion, Sketchbook & Canvas    :p5, after p4, 4d
    section Phase 6
    3D Atelier & Mascot (Progressive) :p6, after p5, 5d
    section Phase 7
    Audit, Polish, Audio & Launch     :p7, after p6, 3d
```

### Detailed Breakdown of Phases:
- **Phase 1: Foundations, Design System & Master Blueprint (COMPLETE)**
- **Phase 2: Figma UI/UX Wireframing & Visual Design (NEXT — No Code / No Web Dev)**
  - Draft low-fidelity and high-fidelity wireframes across Desktop (1440px) and Mobile (390px) matching the Figma Screen Inventory.
  - Visually review, contrast-test, and finalize the provisional magical forest color palette.
  - Character visual design in Figma once Srishti provides the mascot reference image.
  - Atelier-styled Recruiter HUD design and micro-interaction visual states.
- **Phase 3: Core Engineering Setup, Base UI & Recruiter Fast-Path (Code Scaffolding)**
  - Initialize project with Next.js (App Router) + TypeScript + Tailwind CSS.
  - Implement base UI components, typography tokens, and the atelier-styled Recruiter HUD.
  - Build responsive container layout and accessible ATS resume viewer.
- **Phase 4: Content Ingestion & Dynamic Gallery Engine**
  - Implement strongly-typed data files in `src/data/` for Srishti to populate.
  - Build responsive grids for Technical Projects, Graphic Design (with Figma embeds), Video Editing, Extracurriculars, Achievements, and Cosmic Handmade Gifts.
  - Implement empty-state "Curating Exhibition" fallbacks.
- **Phase 5: 2D Motion, Sketchbook Unfold & Living Canvas Effects**
  - Integrate Framer Motion page choreography and GSAP scroll-triggered 3D sketchbook opening.
  - Implement mouse-responsive parallax shader effects for the Living Painting Gallery.
  - Add optional ambient audio player with sound wave toggle.
- **Phase 6: 3D Atelier & Mascot Integration (Optional / Progressive Enhancement)**
  - Integrate Three.js / React Three Fiber canvas.
  - Load and render the 3D human mascot (modeled from Srishti's reference image).
  - Implement 3D Book Tree arboretum and floating spore particle field.
  - Wire up `detect-gpu` device capability gate for automatic 2.5D fallback.
- **Phase 7: Quality Assurance, Accessibility Audit & Production Launch**
  - Run Lighthouse performance, accessibility, SEO, and best-practice audits (aiming for 90+ across all).
  - Test keyboard tab navigation, screen reader ARIA landmarks, and `prefers-reduced-motion` compliance.
  - Test across Chrome, Safari, Firefox, iOS, and Android.
  - Assist with deployment to personal domain (e.g., via Vercel, Netlify, or GitHub Pages).
