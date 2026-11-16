# 📖 The Creative Technologist's Learning Guide
### *A Friendly, Beginner-Oriented Guide to the Architecture & Technologies*
### *Project: Srishti Gupta Portfolio Universe*

---

Welcome to your portfolio codebase, Srishti! As an artist and engineer, building an ambitious project with 3D elements, living canvas animations, and fluid interactions can sometimes feel overwhelming with jargon. 

This guide was written specifically to explain **every single technology, folder, tool, and file** in plain English. You don't need to be an expert in all of them today; think of this guide as your companion field handbook.

---

## 1. The Big Picture: How Web Portfolios Actually Work

At its simplest, any modern website consists of three layers:
1. **The Skeleton (HTML / JSX):** The actual content — your headings, project descriptions, image tags, and buttons.
2. **The Wardrobe & Atmosphere (CSS / Tailwind):** How everything looks — your forest greens, ivory parchment backgrounds, glowing borders, and layouts.
3. **The Nervous System & Magic (JavaScript / TypeScript / Three.js):** How everything behaves — when a user scrolls, the book opens; when they move their mouse, the mascot looks at them; when they click a project, a blueprint drawer slides open.

---

## 2. Tour of the Folders: Where Does Everything Live?

Here is a simple map of your repository and what lives where:

| Folder | What It Is In Plain English | What You Put Here |
|---|---|---|
| `docs/` | **The Brain & Blueprint Center:** Where all architectural decisions, design tokens, interaction scripts, and guides live. | You read and reference these files whenever you want to know how something is planned or designed. |
| `design/` | **The Art Director's Desk:** Specs for Figma screens, design tokens, typography rules, and color codes. | UI wireframes, exported design tokens, and layout guidelines. |
| `assets/` | **The Physical Vault:** Raw and optimized media files before code uses them. | Real photos, videos, 3D files, and PDFs. |
| `assets/mascot/` | 3D files and visual reference assets for your futuristic human mascot (to be created from your reference image). | `.glb` 3D character models, textures, and reference imagery. |
| `assets/artwork/` | Your personal fine art gallery vault. | Your paintings, digital illustrations, and canvas photos. |
| `assets/videos/` | Motion design and video editing showreels. | Compressed MP4 or WebM video clips and poster images. |
| `assets/books/` | Your personal reading library covers. | Photos of book covers for your Book Tree. |
| `assets/graphics/` | Vector graphics, brand logos, and UI snapshots. | Exported PNG/SVG assets from Figma. |
| `assets/cosmic-gifts/` | Your handmade crafts, keepsakes, and physical art. | Photos of handmade gifts, jewelry, or 3D scans. |
| `assets/audio/` | The soundscape library. | Gentle ambient forest sounds, wooden clicks, or chimes. |
| `assets/icons/` | Custom rune glyphs and UI icons. | Vector SVG icons (e.g., GitHub rune, email feather). |
| `assets/documents/` | Official documents. | Your real ATS-friendly PDF resume and certificates. |
| `src/` *(Phase 3+)* | **The Engine Room (Code):** Where Next.js components, Three.js canvases, and styling will live after Figma design approval. | React code files (`.tsx`), styles, and data lists. |

---

## 3. Demystifying the Technology Stack

### 3.1 What is WebGL and Three.js?
- **WebGL (Web Graphics Library):** An engine built directly into modern web browsers (Chrome, Safari, Edge) that allows your computer's graphics card (GPU) to draw 3D objects at 60 frames per second inside a web page without needing plugins.
- **Three.js:** Writing raw WebGL is notoriously difficult (requiring mathematical matrices and raw shader code). **Three.js** is a friendly JavaScript library that wraps WebGL into human-readable concepts: a `Scene`, a `Camera`, a `Light`, and `Meshes` (3D shapes).
- **React Three Fiber (R3F):** A bridge that lets you write Three.js code as simple React components. Instead of 50 lines of complex setup, you can write `<Canvas><mesh><boxGeometry /></mesh></Canvas>`.

### 3.2 What is a 3D Model (`.glb` / `.gltf`)?
- A `.glb` file is like a "JPEG for 3D objects". It packages the 3D shape (vertices), the surface color (textures), the skeleton (rigging), and the animations (like an idle breathing loop) into a single compact file.
- We will store your future mascot model in `assets/mascot/mascot.glb` once modeled from your reference image.

### 3.3 What are Shaders and Parallax?
- **Shader:** A tiny mathematical program that runs directly on your computer's graphics processor to calculate color and light for millions of pixels simultaneously.
- **Living Painting Parallax:** We use a lightweight shader or layered CSS technique to move the background of your painting slightly slower than the foreground when your mouse moves. This tricks the human eye into perceiving three-dimensional depth on a flat canvas!

### 3.4 What are Framer Motion and GSAP?
- **Framer Motion:** A React animation library that uses physics (springs, friction, velocity) instead of rigid time delays. It makes buttons bounce naturally and page transitions feel tactile and organic.
- **GSAP (GreenSock) & ScrollTrigger:** The gold standard for scroll-linked animations. When the user scrolls, GSAP can tie the scroll distance directly to the angle of a page turning in your 3D sketchbook.

### 3.5 What is TypeScript?
- Regular JavaScript allows mistakes like misnaming a property (e.g. typing `project.titel` instead of `project.title`), which crashes your site silently.
- **TypeScript** checks your code before you run it. If you define a schema that says every project must have a `title` and a `githubUrl`, TypeScript will gently highlight any errors in your code editor before you ever publish.

---

## 4. How You Will Populate Your Real Content

You never need to touch complex 3D or animation code just to add a new project or painting! 

When engineering begins in Phase 3 (following Phase 2 Figma design sign-off), we set up simple data files inside `src/data/`:
1. **To add a Technical Project:** Open `src/data/technicalProjects.ts`. Copy the blank template, paste it into the array, and type in your project's title, technologies, and GitHub link.
2. **To add a Painting:** Save your painting file into `assets/artwork/my-painting.webp`. Then open `src/data/paintings.ts`, add the title, medium, and the file path `"/assets/artwork/my-painting.webp"`.
3. **To update your Resume:** Save your updated PDF into `assets/documents/Srishti_Gupta_Resume.pdf`. The download button will immediately deliver the new file.

---

## 5. Connecting Figma to Code: The Handoff Flow

When you design screens in Figma, here is how they turn into code:
1. **Design Tokens First:** Colors and typography are set up first. When you pick `#0A3323` for Forest in Figma, that matches `--color-forest` in our CSS.
2. **Exporting Vector Icons:** Icons from Figma should be exported as clean `.svg` files and placed in `assets/icons/`.
3. **Exporting Images:** Heavy illustrations or mockups should be exported as `@2x` PNG or WebP files and compressed before adding them to `assets/`.
4. **Figma Prototypes:** If you have an interactive Figma prototype you want people to play with directly on the site, you can grab the Figma embed link and paste it into `src/data/designProjects.ts`. The website will embed an interactive viewport automatically!

---

## 6. Common Beginner Pitfalls & How We Prevent Them

| Common Trap | Why It Causes Problems | How Our Architecture Prevents It |
|---|---|---|
| **Giant 50MB 3D Models** | Makes the website load painfully slow on phones and mobile data. | We enforce a `< 2.5 MB` Draco-compressed `.glb` limit and provide a 2.5D fallback for low-power devices. |
| **Recruiters Trapped in Long Animations** | Recruiters spend an average of 30 seconds on a portfolio. If they are forced to wait through an unskippable 15-second intro, they leave. | We include an instant **Skip Intro** button and a permanent **Recruiter HUD** that jumps to Work, Resume, and Contact with a single click. |
| **Uncompressed 4K Images** | 10 high-resolution paintings can freeze a browser tab. | All artwork is converted to modern WebP/AVIF formats and lazy-loaded (meaning images only load when scrolled into view). |
| **Unreadable Text on Dark Backgrounds** | Fancy fonts or low-contrast colors cause eye strain and fail accessibility guidelines. | We use Ancient Ivory `#F7F4D5` on Deep Forest `#0A3323`, achieving an ultra-crisp contrast ratio > `10:1` (exceeding WCAG AAA standards). |
| **Inventing Placeholder Work** | Putting fake projects or "Lorem Ipsum" looks amateurish to real employers. | We have a strict zero-invention rule. Sections without projects show an honest, poetic "Curating Exhibition" message until you add your real work. |

---

## 7. Need Help or Have Questions?

As we advance through each phase together, you can always ask questions about any concept. This project is both a stunning showcase of your talent and an empowering learning journey into modern creative engineering!
