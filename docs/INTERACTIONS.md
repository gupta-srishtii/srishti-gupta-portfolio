# ✨ Interaction & Motion Choreography Specifications
### *Project: Srishti Gupta Portfolio Universe*
### *Document Version: 1.0.0 (Phase 1 Approved Architecture)*

---

## 1. Interaction Design Philosophy

Every interactive moment in this portfolio is crafted around the concept of **Tactile Magic with Mechanical Precision**. 
- Magic is never sluggish or disorienting.
- Motion always serves comprehension: orienting the user, providing feedback, or unveiling narrative depth.
- High-velocity recruiter paths retain zero motion delays, ensuring lightning-fast usability.

---

## 2. The 5-Second Skippable Brand Intro Choreography

### 2.1 Timeline & State Progression
```text
0.0s ──── 1.2s ──── 2.5s ──── 3.8s ──── 4.8s ──── 5.0s
 │         │         │         │         │         │
 └─ Void   └─ Spores └─ Brass  └─ SG     └─ Light  └─ Smooth Iris
    Deep      Awaken    Lines     Mono-     Flare     Wipe into
    Forest    & Swirl   Draw      gram                Atelier
    Canvas              Stars     Glows               Landing
```

- **[0.0s – 1.0s] The Awakening:** Screen starts in pure Forest `#0A3323`. Golden bioluminescent spores rise organically from the bottom of the viewport with a gentle sine-wave dispersion.
- **[1.0s – 2.5s] Constellation Drawing:** Fine luminous brass line-vectors trace through the particle cluster using SVG `stroke-dashoffset` animation (cubic-bezier `[0.22, 1, 0.36, 1]`), forming celestial geometry.
- **[2.5s – 3.8s] Monogram Solidification:** The interlocking monogram of **Srishti Gupta** crystallizes in Ancient Ivory `#F7F4D5` surrounded by an Astral Gold `#E6C665` corona.
- **[3.8s – 4.8s] Subtitle & Depth Expansion:** Subtitle *"Multidisciplinary Technologist & Visual Artist"* fades in below the monogram.
- **[4.8s – 5.0s] Portal Iris Wipe:** Camera dollies smoothly forward into the central monogram, expanding into the 3D Atelier Hero scene.

### 2.2 The Skip Controller & Memory Logic
- **Skip Button:** Located at `top: 2rem; right: 2rem; z-index: 9999;`. Styled with an Ancient Ivory parchment outline and a 5-second circular SVG progress border indicating time remaining.
- **Click Behavior:** Immediately aborts timeline, sets `sessionStorage.setItem('srishti_intro_seen', 'true')`, and executes a 0.3s cross-fade directly into the Atelier Hero.
- **Returning Visitors:** On load, `useEffect` checks `sessionStorage.getItem('srishti_intro_seen')`. If `true`, the entire 5-second intro component is unmounted and never rendered.

---

## 3. The Futuristic Human Mascot Choreography

### 3.1 Mascot Identity & Aesthetic Direction
The mascot is an original futuristic human character. The exact visual appearance, attire, facial features, and silhouette will be modeled directly from the visual reference image provided by Srishti. No assumptions regarding goggles, workwear, or specific accessories are locked down prior to receiving this reference.

### 3.2 Mascot Behavioral States (Abstracted Motion Matrix)
| State | Trigger | Animation Loop / Transition | Duration / Ease |
|---|---|---|---|
| **Idle Breathing** | Default state when page loads and cursor is static. | Gentle rhythmic breathing expansion, subtle ambient sway, micro-movements. | 3.2s loop, sine ease in-out. |
| **Cursor Tracking** | User moves pointer across the viewport. | Head and upper torso smoothly rotate up to ±25° along X and Y axes toward pointer coordinates using Three.js spherical lerp (`dampingFactor: 0.05`). | Continuous reactive damping. |
| **Welcoming Wave** | First cursor hover over the hero mascot area. | Mascot smiles, tilts head, and gestures in an energetic yet elegant welcoming motion. | 1.4s one-shot, then returns to Idle. |
| **Pointing to Sketchbook** | User hovers over the "Open Sketchbook" CTA button. | Mascot points or gestures toward the sketchbook codex to guide user focus. | 0.8s transition into point pose. |
| **Work Mode Reaction** | User clicks Recruiter HUD "Work". | Mascot offers an affirmative nod or brief acknowledging wave before the viewport navigates to the projects realm. | 0.6s snap. |

### 3.3 2D Mobile / Low-Spec Fallback
- For devices where 3D is disabled, the mascot is rendered as a multi-layer high-resolution illustrated SVG/WebP character matching Srishti's reference.
- CSS keyframe animations handle subtle breathing and eye blink frames, maintaining personality without GPU overhead.

---

## 4. The Inventor's Sketchbook Unfold Choreography

### 4.1 Scroll-Driven 3D Mechanical Unfold
- **Scroll Pinning:** As the user scrolls into Section 3, the viewport pins in place for `150vh` of scroll travel.
- **Stage 1 (Scroll 0% – 30%):** The leather-bound sketchbook rises from the lower canvas, rotating from a 45° isometric perspective into a direct front-facing angle. The brass latches click open with a slight mechanical vibration.
- **Stage 2 (Scroll 30% – 80%):** The heavy cover opens outward to the left (CSS `transform-origin: left center; transform: rotateY(-180deg)`). The parchment pages fan open sequentially.
- **Stage 3 (Scroll 80% – 100%):** The two exposed pages lock flat. Ink schematics, architectural drawings, and core discipline tabs sketch themselves onto the ivory page surface.
- **Unpin & Release:** Once the pages are fully unfurled, viewport unpins and allows smooth scrolling to the next realm.

---

## 5. The Living Painting Gallery Parallax & Shimmer

### 5.1 Interactive Parallax (Depth Effect)
Each painting card consists of three layered planes:
1. **Background Layer:** Canvas texture and ambient atmospheric background (moves at 0.02x cursor offset).
2. **Subject Layer:** Main painted figure or focal element (moves at 0.05x cursor offset).
3. **Glaze / Particle Layer:** Surface varnish reflections and floating bioluminescent flecks (moves at 0.08x cursor offset).

### 5.2 Hover Brushstroke Shimmer
- When the visitor hovers over any painting, a subtle, moving linear light gradient (mimicking light reflecting off wet oil paint or glossy varnish) sweeps across the surface at a 45° angle.
- Clicking the painting opens the **Deep Zoom Inspector Modal**, allowing high-resolution inspection of canvas weaves and brush techniques.

---

## 6. The Book Tree (Wisdom Arboretum) Interactions

### 6.1 Arboreal Dynamics
- An ancient branching tree crafted from luminescent wood vectors and subtle 3D limbs.
- The "leaves" of the tree are stylized floating codex leaves and leather-bound miniature folios.
- Wind Simulation: Gentle continuous noise-based wave animation simulates an enchanted breeze rustling the foliage.

### 6.2 Leaf Interaction
- **Hover:** The targeted leaf illuminates with an Astral Gold `#E6C665` rim glow and expands by `15%`, displaying the book's title and author on a floating tooltip.
- **Click:** The leaf detaches and glides toward center screen, unfolding into a detailed reading takeaway modal displaying Srishti's personal synthesis and quotes.
- **Mobile Alternative:** On mobile viewports, the tree simplifies into an interactive vertical accordion or touch carousel organized by literary genre.

---

## 7. Luminous Particle System Specifications

- **Particle Count:**
  - Desktop (Cinematic Mode): 350 particles.
  - Desktop (Balanced Mode): 150 particles.
  - Mobile: 40 particles.
- **Behavior:**
  - Particles drift slowly upwards at `0.2px/frame` with horizontal sine-wave oscillation (`amplitude: 15px`, `frequency: 0.02`).
  - Cursor Repulsion: Particles within a 120px radius of the pointer gently push away by `20px` before floating back to their trajectory.
  - Particle Color Matrix: 70% Ivory `#F7F4D5` (semi-transparent), 20% Moss `#839958`, 10% Astral Gold `#E6C665`.

---

## 8. Recruiter Fast-Path Instant Bypass Interactions

### 8.1 Zero-Friction Navigation & Atelier Aesthetic
Recruiter actions must never wait for narrative animations to complete. The HUD is visually styled to match the magical atelier: frosted midnight teal glass (`rgba(16, 86, 102, 0.7)`), subtle verdant moss borders (`rgba(131, 153, 88, 0.35)`), and high-contrast ancient ivory runes (`#F7F4D5`).
- **Instant Snap Scroll:** Clicking any Recruiter HUD item (`Projects`, `About`, `Resume`, `Contact`) initiates an immediate smooth scroll (duration: max `450ms`, ease: `easeInOutQuart`), instantly skipping any intermediate narrative scroll pins.
- **Keyboard Command Palette (`Cmd / Ctrl + K`):**
  - Instant spotlight search drawer opens.
  - Allows instant typing: `tech`, `figma`, `resume`, `contact`, `download`.
  - Pressing `Enter` executes the jump immediately.

---

## 9. Mobile Touch, Swipe & Gyroscope Adaptations

- **Touch Swipe Gestures:** Carousels support native-feel hardware-accelerated horizontal touch swiping with momentum (`drag="x"` in Framer Motion).
- **Device Orientation (Gyroscope):** On mobile devices supporting the DeviceOrientation API, tilting the phone gently modulates the living painting parallax angle and particle drift direction (opt-in with permission prompt).
- **Haptic Feedback:** On supported mobile browsers (using `navigator.vibrate`), switching tabs in the Recruiter HUD or clicking the "Download Resume" button provides a gentle 10ms haptic tap.
