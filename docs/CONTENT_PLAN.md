# 📝 Content Architecture & Manual Population Schemas
### *Project: Srishti Gupta Portfolio Universe*
### *Document Version: 1.0.0 (Phase 1 Approved Architecture)*

---

## 1. Zero-Fabrication Integrity Policy

This portfolio strictly prohibits dummy, AI-hallucinated, or invented achievements, projects, companies, or hackathon wins. 
- All data models in this project are engineered as strongly-typed schemas.
- If a section or gallery currently has zero entries, the UI displays an elegant, on-theme **"Curating Exhibition / In The Workshop"** card instead of placeholder nonsense.
- Srishti can easily update her portfolio by editing plain, readable TypeScript/JSON data files without touching UI code.

---

## 2. Structured Data Schemas (For Srishti to Populate)

When Phase 2 frontend scaffolding begins, these schemas will reside under `src/data/`. Below are the exact TypeScript schemas and blank template examples for each realm:

### 2.1 Technical Projects Schema (`src/data/technicalProjects.ts`)
```typescript
export interface TechnicalProject {
  id: string;                      // e.g., "neural-canvas"
  title: string;                   // Project Title
  tagline: string;                 // 1-sentence elevator pitch
  category: 'Full-Stack' | 'Frontend/WebGL' | 'AI/ML' | 'Tools & Systems';
  featured: boolean;               // Shows on hero highlight if true
  date: string;                    // e.g., "Oct 2026"
  thumbnail: string;               // Path in /assets/artwork/ or /assets/graphics/
  architectureSummary: string;     // Technical description of how it works
  technologies: string[];          // e.g., ["Next.js", "TypeScript", "Three.js", "FastAPI"]
  githubUrl?: string;              // GitHub repository link
  liveUrl?: string;                // Deployed live application link
  demoVideo?: string;              // Optional short demo video preview
  highlights: string[];            // 2-4 bullet points highlighting engineering wins
}

// EMPTY STARTER ARRAY — Srishti will populate with real projects:
export const technicalProjects: TechnicalProject[] = [];
```

---

### 2.2 Graphic Design & Figma Schema (`src/data/designProjects.ts`)
```typescript
export interface DesignProject {
  id: string;                      // e.g., "lumina-design-system"
  title: string;                   // Design Case Study Title
  category: 'UI/UX Design' | 'Design Systems' | 'Brand Identity' | 'Vector Illustration';
  featured: boolean;
  date: string;
  coverImage: string;              // High-res preview image path
  figmaEmbedUrl?: string;          // Direct Figma interactive prototype embed link
  behanceUrl?: string;             // Optional Behance or Dribbble case link
  problemStatement: string;        // The user experience problem addressed
  designSolution: string;          // The rational design approach taken
  toolsUsed: string[];             // e.g., ["Figma", "Illustrator", "Photoshop"]
  galleryImages: string[];         // Screens and wireframe snapshots
}

export const designProjects: DesignProject[] = [];
```

---

### 2.3 Video Editing Suite Schema (`src/data/videoProjects.ts`)
```typescript
export interface VideoProject {
  id: string;
  title: string;
  category: 'Motion Graphics' | 'Cinematic Edit' | 'Showreel' | 'Short Film / Documentary';
  duration: string;                // e.g., "1:45"
  releaseDate: string;
  videoUrl: string;                // Vimeo, YouTube embed, or self-hosted MP4/WebM
  posterImage: string;             // Thumbnail cover image
  softwareUsed: string[];          // e.g., ["Premiere Pro", "After Effects", "DaVinci Resolve"]
  roleDescription: string;         // e.g., "Lead Editor, Sound Design, Color Grading"
  synopsis: string;                // Story or objective of the video
}

export const videoProjects: VideoProject[] = [];
```

---

### 2.4 Living Painting Gallery Schema (`src/data/paintings.ts`)
```typescript
export interface Painting {
  id: string;
  title: string;
  medium: 'Digital Painting' | 'Oil on Canvas' | 'Acrylic' | 'Mixed Media' | 'Watercolor';
  year: number;
  dimensions?: string;             // e.g., "24 x 36 inches" or "6000 x 4000 px"
  imageHighRes: string;            // High-resolution painting file path
  depthMapImage?: string;          // Optional grayscale depth map for 3D parallax
  conceptStatement: string;        // Artist's conceptual narrative behind the artwork
  featured: boolean;
}

export const paintings: Painting[] = [];
```

---

### 2.5 The Book Tree Reading List Schema (`src/data/books.ts`)
```typescript
export interface BookLeaf {
  id: string;
  title: string;
  author: string;
  genre: 'Philosophy' | 'Technology' | 'Design' | 'Speculative Fiction' | 'Science';
  yearRead: number;
  coverImage: string;              // Book cover image path
  synthesis: string;               // Srishti's personal takeaway and core mental model
  favoritePassage?: string;        // Memorable excerpt or quote
  ratingOrRecommendation: string;  // e.g., "Essential reading for creative technologists"
}

export const bookLeaves: BookLeaf[] = [];
```

---

### 2.6 Extracurricular Leadership Schema (`src/data/extracurriculars.ts`)
```typescript
export interface Extracurricular {
  id: string;
  role: string;                    // e.g., "President", "Lead Organizer", "Mentor"
  organization: string;            // Club, university, or community group
  timeframe: string;               // e.g., "2024 - Present"
  location: string;
  keyInitiatives: string[];        // Specific events organized, workshops led
  impactMetrics?: string;          // e.g., "Mentored 120+ student designers"
  logoOrBadge?: string;
}

export const extracurriculars: Extracurricular[] = [];
```

---

### 2.7 Achievements & Hackathons Schema (`src/data/achievements.ts`)
```typescript
export interface Achievement {
  id: string;
  title: string;                   // Award title or hackathon position
  competitionOrEvent: string;      // e.g., "Global Hackathon 2026", "Dean's List"
  issuingBody: string;             // Organization or institution
  year: number;
  badgeOrCertificateUrl?: string;  // Verification link or PDF certificate
  teamSize?: number;
  projectSubmitted?: string;       // Name of project built at the hackathon
  briefDescription: string;        // Official description of what was honored
}

export const achievements: Achievement[] = [];
```

---

### 2.8 Cosmic Handmade Gifts Schema (`src/data/cosmicGifts.ts`)
```typescript
export interface CosmicGift {
  id: string;
  title: string;                   // Name of craft artifact
  craftType: 'Sculpture' | 'Jewelry & Keepsake' | 'Paper Craft & Origami' | 'Physical Computing';
  creationYear: number;
  materials: string[];             // e.g., ["Polymer Clay", "Brass Wire", "Resin", "Gold Leaf"]
  photographs: string[];           // Array of multi-angle high-res photos
  model3dGlb?: string;             // Optional 3D photogrammetry scan
  storyOrOccasion: string;         // The creative intent behind the gift
}

export const cosmicGifts: CosmicGift[] = [];
```

---

### 2.9 Profile, Resume & Contact Schema (`src/data/profile.ts`)
```typescript
export interface ProfileData {
  name: string;
  title: string;
  shortBio: string;
  extendedPhilosophy: string;
  location: string;
  avatarImage: string;
  contactEmail: string;
  resumePdfPath: string;           // Direct link to downloadable ATS PDF
  socialLinks: {
    github: string;
    linkedin: string;
    figma?: string;
    behance?: string;
    twitter?: string;
    instagram?: string;
  };
  skillsMatrix: {
    category: string;
    skills: string[];
  }[];
  experience: {
    company: string;
    role: string;
    period: string;
    description: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    period: string;
    honors?: string;
  }[];
}

export const profileData: ProfileData = {
  name: "Srishti Gupta",
  title: "Multidisciplinary Technologist, UI/UX Architect & Visual Artist",
  shortBio: "Bridging the analytical logic of computer engineering with the emotional depth of fine art and interactive design.",
  extendedPhilosophy: "",
  location: "",
  avatarImage: "/assets/artwork/srishti-portrait.webp",
  contactEmail: "",
  resumePdfPath: "/assets/documents/Srishti_Gupta_Resume.pdf",
  socialLinks: {
    github: "",
    linkedin: "",
    figma: "",
    behance: "",
    twitter: "",
    instagram: ""
  },
  skillsMatrix: [],
  experience: [],
  education: []
};
```

---

## 3. Asset Standards & Formatting Specifications

To ensure optimal performance and visual fidelity, assets should conform to these standards:

| Asset Type | Target Directory | File Format | Max Dimensions | Target Size | Recommended Compression Tool |
|---|---|---|---|---|---|
| **Paintings / Art** | `assets/artwork/` | `.webp` or `.avif` | `3840 x 2160` (4K) | `< 800 KB` | Squoosh.app / Sharp CLI |
| **Project Previews** | `assets/graphics/` | `.webp` | `1920 x 1080` (1080p) | `< 300 KB` | Squoosh.app |
| **Video Reels** | `assets/videos/` | `.webm` & `.mp4` (H.265/AV1) | `1920 x 1080` | `< 6 MB` (or YouTube/Vimeo) | Handbrake / ffmpeg |
| **3D Mascot Model** | `assets/mascot/` | `.glb` (Draco compressed) | N/A | `< 2.5 MB` | gltf-transform / Blender |
| **Book Covers** | `assets/books/` | `.webp` | `800 x 1200` | `< 120 KB` | Squoosh.app |
| **Handmade Crafts** | `assets/cosmic-gifts/` | `.webp` | `2048 x 2048` | `< 400 KB` | Squoosh.app |
| **Sound Clips** | `assets/audio/` | `.mp3` & `.ogg` | N/A | `< 400 KB` | Audacity (64kbps mono) |
| **Resume Document** | `assets/documents/` | `.pdf` (ATS-compatible text) | A4 / Letter | `< 2 MB` | Clean PDF exporter |
