# 🎨 Design System & Visual Specification
### *Project: Srishti Gupta Portfolio Universe*
### *Document Version: 1.0.0 (Phase 1 Approved Architecture)*

---

## 1. Aesthetic Identity & Moodboard Philosophy

The aesthetic vision synthesizes three distinct worlds into a coherent visual reality:
1. **The Ancient Bioluminescent Forest:** Deep vegetative shadows, soft mossy highlights, damp earth, floating spores, and living wooden textures.
2. **The Inventor's Mechanical Sketchbook:** Hand-drawn technical line art, aged ivory vellum, brass calipers, copper bindings, and tactile paper folds.
3. **The Futuristic Artist's Atelier:** Levitating optical glass lenses, holographic rune displays, subtle neon cyan telemetry, and clean cybernetic interfaces.

---

## 2. Master Color Palette & Design Tokens *(Provisional Baseline)*

> **Status Notice:** This magical forest color palette is **provisional**. It serves as an architectural baseline and will be visually reviewed, contrast-verified against WCAG standards, and finalized inside Figma during **Phase 2 (UI/UX Wireframing & Visual Design)** before any frontend styling code is written.

### 2.1 The Core Five Colors (Provisional)
```css
:root {
  /* Core Foundation Colors */
  --color-forest:        #0A3323; /* Deep ancient forest green: Primary backdrop & shadow depths */
  --color-moss:          #839958; /* Verdant moss green: Natural borders, badges, secondary actions */
  --color-ivory:         #F7F4D5; /* Ancient parchment ivory: Primary typography & clean surfaces */
  --color-rosy-brown:    #D3968C; /* Rosy artisanal brown: Warm highlights, sketchbook leather, tags */
  --color-midnight-teal: #105666; /* Midnight teal: Holographic glass, depth atmospheric transitions */

  /* Semantic UI Tokens */
  --bg-primary:          var(--color-forest);
  --bg-surface:          #0e3e2c;
  --bg-surface-elevated: #154c38;
  --bg-glass:            rgba(16, 86, 102, 0.45);
  --border-subtle:       rgba(131, 153, 88, 0.25);
  --border-focus:        var(--color-moss);
  --text-primary:        var(--color-ivory);
  --text-secondary:      #d9d7ba;
  --text-muted:          #8f967d;
  --text-accent:         var(--color-rosy-brown);

  /* Sparingly Used Cosmic & Tech Accents */
  --accent-gold:         #E6C665; /* Astral Gold: Prestigious awards, active portals, key runes */
  --accent-violet:       #8B5CF6; /* Mystic Violet: Cosmic gifts, deep magical energy pulses */
  --accent-cyan:         #38BDF8; /* Luminous Cyber Blue: Code syntax, terminal cursors, HUD telemetry */
}
```

### 2.2 Color Usage Governance Matrix
- **Forest `#0A3323` (60%):** Foundation base canvas, deep section backdrops, modal scrims, low-light ambient gradient anchors.
- **Ivory `#F7F4D5` (20%):** Headings, body copy, active button text, sketchbook pages, clean high-contrast legibility.
- **Midnight Teal `#105666` (10%):** Frosted glass panels, navigation HUD containers, cards backdrop, atmospheric gradients.
- **Moss `#839958` (5%):** Hover borders, status badges, tree leaf highlights, secondary buttons.
- **Rosy Brown `#D3968C` (3%):** Interactive highlights, category indicators, craft tags, leather stitching accents.
- **Accents (Gold, Violet, Cyan) (2% Max):** Reserved strictly for focal micro-elements (e.g., award ribbons, glowing glyphs, active terminal carets). Never used for large background fills.

---

## 3. Typography Architecture

The typographic hierarchy pairs classical scholarly elegance with modern technical precision.

### 3.1 Recommended Font Pairings
- **Display / Heading Font:** `Cinzel Decorative` or `Cormorant Garamond` (Google Fonts, Open Source)
  - *Usage:* Hero titles, realm headings, monumental quotes, sketchbook titles.
  - *Feel:* Scholarly, mythological, artisanal, and timeless.
- **Body & Editorial Font:** `Plus Jakarta Sans` or `Inter` (Google Fonts, Open Source)
  - *Usage:* Body paragraphs, case study narratives, recruiter summaries, modal text.
  - *Feel:* Crisp, neutral, ultra-legible, humanistic.
- **Monospace / Technical Font:** `JetBrains Mono` or `Fira Code` (Google Fonts, Open Source)
  - *Usage:* Code snippets, technical project tags, time stamps, HUD coordinates, telemetry.
  - *Feel:* Precise, computational, futuristic inventor aesthetic.

### 3.2 Typographic Scale
| Level | Font Size (Desktop) | Font Size (Mobile) | Line Height | Letter Spacing | Font Family |
|---|---|---|---|---|---|
| **Display XXL** | 64px (`4rem`) | 40px (`2.5rem`) | 1.1 | `-0.02em` | Display Serif |
| **Heading 1** | 44px (`2.75rem`) | 32px (`2.0rem`) | 1.15 | `-0.01em` | Display Serif |
| **Heading 2** | 32px (`2.0rem`) | 24px (`1.5rem`) | 1.25 | `0` | Display Serif |
| **Heading 3** | 24px (`1.5rem`) | 20px (`1.25rem`) | 1.35 | `0.01em` | Display Serif |
| **Body Large** | 18px (`1.125rem`) | 16px (`1.0rem`) | 1.6 | `0` | Body Sans |
| **Body Base** | 16px (`1.0rem`) | 15px (`0.9375rem`) | 1.6 | `0` | Body Sans |
| **Body Small** | 14px (`0.875rem`) | 13px (`0.8125rem`) | 1.5 | `0.01em` | Body Sans |
| **Caption / Code** | 12px (`0.75rem`) | 11px (`0.6875rem`) | 1.4 | `0.05em` | Monospace |

---

## 4. Figma Screen Inventory (Design Architecture)

To prepare for high-fidelity Figma drafting and subsequent component implementation, the following complete screen inventory is cataloged across **Desktop (1440px / 1920px)** and **Mobile (390px / 414px)** viewports:

```text
FIGMA SCREEN INVENTORY (Master Canvas Hierarchy)
├── 01_ONBOARDING_&_LANDING
│   ├── SCR-01A-DT: 5s Intro Sequence (Celestial Constellation) — Desktop (1440px)
│   ├── SCR-01A-MB: 5s Intro Sequence (Celestial Constellation) — Mobile (390px)
│   ├── SCR-01B-DT: Atelier Hero Landing (with Mascot Idle State, modeled from Srishti's Reference) — Desktop (1440px)
│   ├── SCR-01B-MB: Atelier Hero Landing (2.5D Mobile Illustrated Variant) — Mobile (390px)
│   ├── SCR-01C-DT: Atelier Mascot Interaction States (Welcome, Point, Hover, Work Mode)
│   └── SCR-01D-DT: Recruiter HUD (Styled to Match Magical Atelier: Frosted Glass, Moss Glow, Ivory Runes)
│
├── 02_SKETCHBOOK_&_HUB
│   ├── SCR-02A-DT: Sketchbook Closed (Leather Cover & Brass Latches) — Desktop
│   ├── SCR-02B-DT: Sketchbook Unfolded (Philosophy & Architecture Schematics) — Desktop
│   ├── SCR-02B-MB: Sketchbook Mobile Card Deck — Mobile
│   ├── SCR-02C-DT: Interactive Creative Hub (Radial Compass Realm Selector) — Desktop
│   └── SCR-02C-MB: Creative Hub (Vertical Gesture Carousel) — Mobile
│
├── 03_WORK_REALMS
│   ├── SCR-03A-DT: Technical Projects Grid (Filter Active, Hover Cards) — Desktop
│   ├── SCR-03A-MB: Technical Projects Mobile List — Mobile
│   ├── SCR-03B-DT: Technical Project Modal Inspector (Blueprint Drawer) — Desktop
│   ├── SCR-03C-DT: Graphic Design & Figma Showcase (Live Prototype Frame) — Desktop
│   ├── SCR-03C-MB: Graphic Design Mobile Case View — Mobile
│   ├── SCR-03D-DT: Video Editing Suite (Showreel Cinema Player & Timelines) — Desktop
│   └── SCR-03E-DT: Video Lightbox Modal (Cinema Mode)
│
├── 04_ART_&_WISDOM
│   ├── SCR-04A-DT: The Living Painting Gallery (Parallax Canvas Grid) — Desktop
│   ├── SCR-04A-MB: Painting Gallery Touch Carousel — Mobile
│   ├── SCR-04B-DT: Living Painting Deep Zoom Texture Inspector — Desktop
│   ├── SCR-04C-DT: The Book Tree Arboretum (Branching Folios) — Desktop
│   ├── SCR-04C-MB: Book Tree Reading List Accordion — Mobile
│   └── SCR-04D-DT: Book Leaf Takeaway Slip (Modal View)
│
├── 05_HONORS_&_CRAFT
│   ├── SCR-05A-DT: Extracurricular Leadership Timeline — Desktop
│   ├── SCR-05B-DT: Achievements & Hackathons Trophy Case — Desktop
│   ├── SCR-05B-MB: Achievements Mobile Card Stack — Mobile
│   ├── SCR-05C-DT: Cosmic Handmade Gifts Showcase (3D Object Pedestal) — Desktop
│   └── SCR-05C-MB: Cosmic Handmade Gifts Photo Gallery — Mobile
│
└── 06_ABOUT_RESUME_&_CONTACT
    ├── SCR-06A-DT: About Srishti & Philosophy (Organic Frame & Skills Matrix) — Desktop
    ├── SCR-06A-MB: About Srishti Mobile Story — Mobile
    ├── SCR-06B-DT: Interactive Resume Realm (Career Timeline & ATS PDF Bar) — Desktop
    ├── SCR-06B-MB: Resume Mobile View — Mobile
    ├── SCR-06C-DT: Communication Portal (Contact Desk & Social Runes) — Desktop
    └── SCR-06C-MB: Contact Form Mobile View — Mobile
```

---

## 5. UI Component Library Specifications

### 5.1 Primary Navigation HUD (`<RecruiterHUD />`)
- **Structure:** Floating frosted pill positioned at `top: 1.5rem; inset-x: 0; margin: auto; max-width: 1100px;`.
- **Styling:** `background: rgba(16, 86, 102, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(131, 153, 88, 0.35); border-radius: 9999px; box-shadow: 0 10px 30px rgba(10, 51, 35, 0.5);`.
- **States:** Default (semi-transparent), Scrolled (condensed with gold bottom glow), Mobile (compact burger + sticky bottom Work pill).

### 5.2 Runic Card Containers (`<RunicCard />`)
- **Structure:** Base wrapper for projects, artworks, and achievements.
- **Styling:** `background: #0e3e2c; border: 1px solid rgba(131, 153, 88, 0.25); border-radius: 1rem; padding: 1.5rem;`.
- **Hover Micro-interaction:** Lifts `-6px` on Y-axis with a subtle golden glow border (`border-color: #E6C665`) and inner luminous shadow.

### 5.3 Action Buttons (`<MagicalButton />`)
- **Variant 1 (Primary / Golden Rune):**
  - Background: Linear gradient from `#839958` to `#105666`.
  - Border: 1px solid `#E6C665`.
  - Text: `#F7F4D5`, font-weight 600, uppercase tracked letter-spacing.
  - Hover: Subtle particle flare on cursor hover.
- **Variant 2 (Secondary / Parchment Outline):**
  - Background: Transparent.
  - Border: 1px solid `#D3968C`.
  - Text: `#F7F4D5`.
  - Hover: Background fills with `rgba(211, 150, 140, 0.15)`.
- **Variant 3 (Recruiter Direct Action):**
  - Crisp, distraction-free button with instant download or jump icon.

### 5.4 Modal & Lightbox Drawers (`<AtelierModal />`)
- **Overlay:** `rgba(10, 51, 35, 0.85)` with `backdrop-filter: blur(12px)`.
- **Content Card:** Ancient Ivory `#F7F4D5` texture or Midnight Teal `#105666` glass with brass ornamental border corners.
- **Dismissal:** Accessible via `Esc` key, background click, or explicit top-right brass `[✕ Close]` icon.

---

## 6. Audio-Visual Design Harmony

- **Particle Effects:** Subtle bioluminescent spores drift across the screen, rendered at low opacity (`0.4` to `0.7`) with gentle sine-wave bobbing so they never obscure text.
- **Frosted Glass Depth:** Glassmorphic elements utilize `backdrop-filter: blur()` combined with fine noise textures (2% SVG grain) to give a tactile, etched-lens feel rather than a generic plastic blur.
- **Soundscape Design:**
  - Ambient Atelier Drone: Optional gentle forest wind, distant wind chimes, and faint quill-on-paper sound.
  - Interactive Clicks: Discrete, warm wooden clicks for tab switches; light bell chime for portal activations.
  - Always user-controlled and muted by default.
