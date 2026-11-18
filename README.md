# 🌌 Srishti Gupta — Portfolio Universe
### *The Enchanted Atelier & Inventor's Arboretum*

## Working implementation — 18 November 2026

The repository now contains a local Next.js App Router / TypeScript / Tailwind / React Three Fiber application. The original planning documentation below is preserved as historical design context; the later implementation mission authorizes code and dependency installation.

Run with Node.js 22.18 or newer (validated on Node 24):

```powershell
cd C:\Users\gupta\OneDrive\Desktop\projects\srishti-gupta-portfolio
npm.cmd ci
npm.cmd run dev
```

Open **http://127.0.0.1:3000**. Stop the server with Ctrl+C. For a production preview run `npm.cmd run build`, then `npm.cmd start`.

Validation:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
# With the development server running in another terminal:
npm.cmd run test:browser
```

Browser tests use installed Microsoft Edge on Windows; no browser download is needed. Change `channel` in `playwright.config.ts` if using another installed browser. Screenshots are saved in ignored `test-results/`.

The application supports the studio → sketchbook → portals → gallery journey, direct Work/About/Resume/Contact access, keyboard page/frame navigation, Escape to return, Ctrl/⌘ K navigation, reduced motion, and a quiet HTML/SVG edition. The guide is a **temporary procedural character**, pending a custom likeness and rig.

Edit **`src/data/portfolio.ts`** to add verified work and professional details. Empty exhibitions, resume, and contact are intentional. Only place approved public media in `public/`; its README explains URL paths. Never copy the raw `assets/` directory or private mascot references into `public/`.

See **[the recovery and validation checkpoint](docs/PHASE_PROGRESS.md)** for milestone status, limitations, and next steps. No publication is configured or authorized.

---

> **Creative Vision:** An original, cinematic digital cosmos harmonizing an enchanted ancient forest, an inventor's mechanical sketchbook, and a futuristic artist's atelier. Luminous particles drift past holographic brass armillaries, living canvas paintings breathe with subtle parallax, and floating leather-bound folios whisper of code, creativity, and craft.

---

## 🧭 Executive Overview

This repository houses the blueprint, architectural foundations, design systems, and progressive implementation plan for the portfolio of **Srishti Gupta** — multidisciplinary technologist, creative developer, visual artist, and digital craftsperson.

### The Dual-Experience Paradigm
1. **The Cinematic Narrative Path:** A rich, immersive sensory journey featuring a skippable five-second celestial brand intro, an interactive 3D/2.5D Atelier with an animated futuristic human mascot (visual design to be modeled from reference image provided by Srishti), an unfolding physical sketchbook, an interactive creative hub, and nine thematic realms of work and wonder.
2. **The Recruiter Fast-Path (Instant Access HUD):** A dedicated, zero-latency direct navigation system anchored at the top of the viewport, styled to harmonize with the magical atelier aesthetic (frosted teal glass, subtle moss border glow, and crisp ivory runes). Recruiters and hiring managers can immediately bypass narrative sequences to reach **Technical Work**, **Graphic & UI Design**, **About & Background**, **Resume (Interactive & PDF)**, and **Direct Contact** within a single click.

---

## 🎨 Creative Direction & Aesthetic Identity

- **Atmosphere:** An ancient forest reclaimed by futuristic optical technologies, bioluminescent flora, brass astral instruments, glowing parchment, and levitating codices.
- **Tone:** Wonderous, scholarly, sophisticated, artisanal, and technically razor-sharp.
- **Originality Guarantee:** 100% original conceptual world-building. No copyrighted franchise characters, logos, or movie settings are replicated.

### The Color Palette *(Provisional — Pending Visual Figma Review in Phase 2)*
| Swatch | Color Name | Hex Code | Purpose & Application |
|---|---|---|---|
| ![#0A3323](https://via.placeholder.com/15/0A3323/000000?text=+) | **Deep Forest** | `#0A3323` | *Provisional:* Dominant canvas ground, deep shadows, atmospheric depth, base UI containers. |
| ![#839958](https://via.placeholder.com/15/839958/000000?text=+) | **Verdant Moss** | `#839958` | *Provisional:* Secondary foliage tones, interactive accents, progress indicators, natural glow. |
| ![#F7F4D5](https://via.placeholder.com/15/F7F4D5/000000?text=+) | **Ancient Ivory** | `#F7F4D5` | *Provisional:* Primary typography, parchment surfaces, sketchbook leaves, clean legibility. |
| ![#D3968C](https://via.placeholder.com/15/D3968C/000000?text=+) | **Rosy Brown** | `#D3968C` | *Provisional:* Warm artisanal highlights, physical sketchbook leather, subtle warmth, badges. |
| ![#105666](https://via.placeholder.com/15/105666/000000?text=+) | **Midnight Teal** | `#105666` | *Provisional:* Holographic glass panels, atmospheric sky transitions, deep oceanic intellect. |
| *Accents* | **Celestial Gold** | `#E6C665` | *Sparingly used:* Key achievements, active portal glyphs, rare discovery nodes. |
| *Accents* | **Astral Violet** | `#8B5CF6` | *Sparingly used:* Cosmic gifts, deep mysterious energy signatures, magical transitions. |
| *Accents* | **Luminous Cyan** | `#38BDF8` | *Sparingly used:* Futuristic UI data pings, code syntax highlights, terminal prompts. |

> *Note: All colors above are provisional baselines and will be visually reviewed, stress-tested, and finalized in Figma during Phase 2.*

---

## 🗂️ Repository Architecture & Directory Guide

This repository follows a strict separation of concerns, designed to be completely understandable even for a beginner:

```text
srishti-gupta-portfolio/
│
├── README.md                      # This master handbook and repository overview
│
├── docs/                          # Comprehensive technical, architectural, and design plans
│   ├── MASTER_PLAN.md             # Complete technical architecture, engineering strategy & roadmap
│   ├── PAGE_MAP.md                # Information architecture, user flows, and section maps
│   ├── DESIGN_SYSTEM.md           # Tokens, typography, component library, and Figma screen inventory
│   ├── INTERACTIONS.md            # Micro-interactions, animations, 3D mascot & particle specs
│   ├── CONTENT_PLAN.md            # Manual data schemas (projects, art, video, books, achievements)
│   ├── LEARNING_GUIDE.md          # Beginner-friendly guide explaining all concepts, tech, and workflows
│   └── PHASE_PROGRESS.md          # Phase-by-phase delivery status and approval checklists
│
├── design/                        # Design tokens, specifications, and UI wireframe inventories
│   ├── specs/                     # Breakdowns of screen viewports, responsive breakpoints, HUDs
│   └── tokens/                    # Color scales, typography scales, spacing rules, and CSS variables
│
├── assets/                        # Raw, optimized, and source asset folders (organized by domain)
│   ├── mascot/                    # 3D GLTF models, rigs, textures, and 2D sprite fallbacks for human mascot
│   ├── artwork/                   # High-res paintings, digital illustrations, canvas textures
│   ├── videos/                    # Video editing reels, compressed MP4/WebM clips, thumbnail posters
│   ├── books/                     # Book covers, reading list metadata, 3D folios
│   ├── graphics/                  # Figma export assets, UI vector icons, branding marks
│   ├── cosmic-gifts/              # High-definition photography of handmade crafts & 3D object scans
│   ├── audio/                     # Ambient atelier soundscapes, UI clicks, chime effects (optional toggle)
│   ├── icons/                     # SVG custom icons, rune glyphs, system navigation iconography
│   └── documents/                 # Resume PDFs, certifications, whitepapers
│
└── src/ (Future Phase 3+)         # Frontend source code (Components, Pages, Shaders, Hooks, Stores)
    ├── components/                # Reusable UI widgets (Buttons, Modals, Cards, Floating HUD)
    ├── sections/                  # Discrete page sections matching the 11 experiential realms
    ├── scenes3d/                  # Three.js / R3F Canvas scenes, lighting, cameras, particles
    ├── data/                      # Manual JSON/TypeScript data files populated by Srishti
    ├── hooks/                     # Custom React hooks (device capability, scroll progress, audio)
    ├── styles/                    # Global styles, Tailwind configuration, CSS custom properties
    └── utils/                     # Asset preloading, analytics, accessibility helpers
```

---

## 🗺️ The Experience Map (The 11 Experiential Realms)

1. **Brand Intro Sequence:** A five-second skippable celestial constellation animation introducing Srishti Gupta's monogram.
2. **Cinematic Atelier Landing:** A futuristic artist workshop nestled inside an ancient hollow oak, illuminated by floating optical lenses and guided by a friendly animated human mascot (visual character design pending reference image from Srishti).
3. **The Inventor's Sketchbook:** A 3D parchment codex that dynamically unfolds on scroll, presenting philosophy, sketches, and foundational craft.
4. **The Interactive Creative Hub:** The central navigation compass allowing visitors to traverse between creative disciplines.
5. **Technical Projects Realm:** Code showcases, live applications, GitHub repositories, architecture breakdowns, and tech stack tags.
6. **Graphic Design & Figma Realm:** UI/UX case studies, interactive prototype embeds, design tokens, and branding systems.
7. **Video Editing Suite:** Motion graphics showreel, editing timeline breakdowns, and high-definition video showcases.
8. **The Living Painting Gallery:** Digital and traditional canvas works responding to mouse movement with subtle parallax and texture illumination.
9. **The Book Tree (Wisdom Arboretum):** A mystical branching tree where fluttering leaf-folios represent books read, key takeaways, and literary inspirations.
10. **Extracurriculars Realm:** Community leadership, design mentoring, university activities, and creative clubs.
11. **Achievements & Hackathons Realm:** Awards, hackathon victories, honors, and competitive accolades.
12. **Cosmic Handmade Gifts Realm:** Tangible craft, physical creations, artisan keepsakes, and three-dimensional handmade artifacts.
13. **About & Ethos Realm:** The narrative of Srishti Gupta — combining analytical precision with unbridled artistic expression.
14. **Interactive Resume Realm:** Categorized career timeline with verified credentials and single-click ATS PDF download.
15. **The Communication Portal (Contact):** An interactive celestial desk allowing visitors to send messages, book coffee chats, or connect on LinkedIn/GitHub.

---

## 🛠️ Planned Engineering Stack (Approved for Phase 3 — No Installations Yet)

| Layer | Planned Technology | Role & Architecture Rationale |
|---|---|---|
| **Core Framework** | **Next.js (App Router) + TypeScript** | Blazing-fast page transitions, static site generation (SSG) for instant recruiter access, strong type safety. *(Not installed yet — planned for Phase 3)* |
| **Styling Engine** | **Tailwind CSS + CSS Custom Properties** | Rapid utility styling paired with provisional atelier palette tokens and backdrop filters. *(Planned for Phase 3)* |
| **3D Rendering** | **Three.js / React Three Fiber (R3F) & Drei** | Industry-standard WebGL engine with graceful 2.5D fallback for low-spec/mobile devices. *(Planned for Phase 6)* |
| **Animations** | **Framer Motion + GSAP / Lenis** | Smooth 60fps micro-interactions, scroll-driven page turns, and layout transitions. *(Planned for Phase 5)* |
| **Content Management** | **Local Structured TypeScript / JSON** | Zero third-party CMS lock-in; Srishti easily updates real projects by editing simple files. |

> **Beginner Friendly:** For a complete, gentle walkthrough of how each of these technologies works, read our dedicated [`docs/LEARNING_GUIDE.md`](file:///c:/Users/gupta/projects/portfolio/srishti-gupta-portfolio/docs/LEARNING_GUIDE.md).

---

## 🛡️ Content Authenticity & Safety Standard

This project adheres strictly to **Zero Invention**:
- No fictitious projects, dummy work, fake hackathon wins, or invented metrics are placed in the codebase.
- Clean, strongly-typed JSON/TypeScript schemas are provided in [`docs/CONTENT_PLAN.md`](file:///c:/Users/gupta/projects/portfolio/srishti-gupta-portfolio/docs/CONTENT_PLAN.md).
- Srishti manually inputs real work, real photos, real links, and real achievements as they are ready.

---

## 📋 Multi-Phase Roadmap Overview

- [x] **Phase 1: Architecture, Design Systems & Repository Foundations (COMPLETE)**
- [ ] **Phase 2: Figma UI/UX Wireframing & Visual Design (NEXT — No Code/Web Development)**
  - Desktop & Mobile wireframe layouts in Figma
  - Visual review & stress-testing of provisional color palette
  - Character visual design once Srishti provides mascot reference image
  - Interactive prototype flow & recruiter HUD styling
- [ ] **Phase 3: Core Engineering Setup, Base UI & Recruiter Fast-Path (Code scaffolding begins here)**
- [ ] **Phase 4: Content Ingestion & Dynamic Gallery Engine**
- [ ] **Phase 5: 2D Motion, Sketchbook Unfold & Living Canvas Effects**
- [ ] **Phase 6: 3D Atelier & Mascot Integration (Optional / Progressive Enhancement)**
- [ ] **Phase 7: Quality Assurance, Accessibility Audit & Launch**

👉 *Review [`docs/PHASE_PROGRESS.md`](file:///c:/Users/gupta/projects/portfolio/srishti-gupta-portfolio/docs/PHASE_PROGRESS.md) for full phase details.*
