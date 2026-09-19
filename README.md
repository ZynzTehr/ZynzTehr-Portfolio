<p align="center">
  <img src="./client/src/assets/header.svg" alt="Jorge Bucio — 3D Interactive Developer Portfolio" width="800" />
</p>

<p align="center">
  Cyberpunk glassmorphism · Three.js Earth · Auto-synced from GitHub · 20+ live projects
</p>

<p align="center">
  <a href="https://zynztehr.github.io/ZynzTehr-Portfolio/">
    <img src="https://img.shields.io/badge/Live_Demo-Explore_Portfolio-00ffc8?style=for-the-badge&logo=githubpages&logoColor=black" alt="Live Demo" />
  </a>
  <a href="https://github.com/ZynzTehr">
    <img src="https://img.shields.io/badge/GitHub-@ZynzTehr-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=VSCodeFX.vscode-fx">
    <img src="https://img.shields.io/badge/VS_Code_FX-Extension-7b2ff7?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="VS Code FX" />
  </a>
</p>

---

## What You Get

> **A cinematic developer portfolio** that auto-discovers your GitHub repos, generates themed SVG art, and presents everything in a 3D orbiting showcase — all running on React 19 + Three.js with zero backend.

<table>
<tr>
<td width="50%">

### 3D Earth Globe
High-res procedural planet with night city lights, atmospheric Fresnel glow, and mouse-parallax interaction

### Orbiting Cylinder Carousel
3D perspective carousel with Matrix Digital Rain → bespoke SVG artwork cross-fade on hover

### Click-to-Reveal Archive
Locked archive that initializes on search focus with GSAP stagger + ScrollTrigger batch animations

### 20 Bespoke SVG Artworks
18 hand-crafted + 2 auto-generated vector artworks — one for every project

### Automated SVG Art Generator
Template-based procedural generator that analyzes repo descriptions to create themed artwork for new projects

</td>
<td width="50%">

### Auto GitHub Sync
Node.js + GitHub Actions pipeline that discovers new repos, generates art, and deploys — weekly cron or on push

### Floating Notched Search
Cybernetic outlined input with animated floating label that breaks the top border line on focus

### DevHud + Hex Avatar
Persistent top bar with hexagonal profile badge, live project count, and status indicators

### Project Inspector Modals
Full-detail modals with SVG art, architecture descriptions, tech tags, and direct links

### Mobile-First Responsive
Horizontal snap-scroll carousel on mobile, touch swipe, and compact archive grid

</td>
</tr>
</table>

---

## Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/GSAP_3-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP 3" />
  <img src="https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions" />
  <img src="https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white" alt="GitHub Pages" />
</p>

---

## Architecture

```
ZynzTehr-Portfolio/
├── .github/workflows/
│   └── deploy.yml              # CI/CD: sync → generate art → build → deploy
├── client/
│   ├── scripts/
│   │   ├── sync-repos.js       # Auto-fetch repos from GitHub API
│   │   └── generate-art.js     # Procedural SVG art generator
│   ├── src/
│   │   ├── components/
│   │   │   ├── Earth3D.tsx     # Three.js globe with textures + shaders
│   │   │   ├── ProjectCarousel.tsx  # 3D orbiting cylinder showcase
│   │   │   ├── DevHud.tsx      # Top HUD bar with hex avatar
│   │   │   ├── HexAvatar.tsx   # Hexagonal profile badge
│   │   │   ├── ScrollWidget.tsx # Physics-driven scroll indicator
│   │   │   ├── ProjectModal.tsx # Full project detail modals
│   │   │   ├── MatrixRain.tsx  # Matrix digital rain canvas
│   │   │   └── project-arts/   # 18 hand-crafted + auto-generated SVGs
│   │   ├── data/
│   │   │   ├── projects.json   # Source of truth (auto-synced)
│   │   │   └── projects.ts     # Category mapping, sorting, types
│   │   ├── pages/
│   │   │   ├── Landing.tsx     # Cinematic intro with letter animation
│   │   │   └── Home.tsx        # Main portfolio page
│   │   └── styles/
│   │       ├── global.css      # Full design system (glassmorphism, animations)
│   │       ├── global.scss     # Particle orbit animations
│   │       └── Modal.css       # Project inspector styles
│   └── package.json
└── README.md
```

---

## Automation Pipeline

```mermaid
graph LR
    A[Push to main<br/>or Weekly Cron] --> B[sync-repos.js]
    B -->|Fetches GitHub API| C[projects.json updated]
    C --> D[generate-art.js]
    D -->|Analyzes descriptions<br/>Picks template + colors| E[SVG components created]
    E --> F[Vite Build]
    F --> G[Deploy to GitHub Pages]
    
    style A fill:#7b2ff7,stroke:#7b2ff7,color:#fff
    style G fill:#00ffc8,stroke:#00ffc8,color:#000
```

**Existing hand-crafted SVGs are never overwritten.** The generator only creates art for new projects that don't have one yet.

---

## Getting Started

```bash
# Clone
git clone https://github.com/ZynzTehr/ZynzTehr-Portfolio.git
cd ZynzTehr-Portfolio/client

# Install
npm install

# Dev server
npm run dev
```

Visit `http://localhost:5173/ZynzTehr-Portfolio/` in your browser.

### Production Build

```bash
npm run build
# Output: client/dist/
```

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `--accent-color` | `#00ffc8` | Primary neon cyan — CTAs, highlights, glow |
| `--purple-glow` | `#7950f2` | Electric violet — secondary accents |
| `--correct` | `#00ff88` | Emerald — success states |
| `--glass-bg` | `rgba(15,15,30,0.85)` | Card backgrounds |
| `--glass-blur` | `blur(14px)` | Glassmorphism backdrop |
| Font: Display | `Orbitron` | Headings, HUD elements |
| Font: Body | `Outfit` | Body text, descriptions |
| Font: Code | `JetBrains Mono` | Tech tags, monospace |

---

## Author

<table>
<tr>
<td>

**Jorge Alberto Bucio** · Full-Stack & Web3 Developer

- [GitHub @ZynzTehr](https://github.com/ZynzTehr)
- [Live Portfolio](https://zynztehr.github.io/ZynzTehr-Portfolio/)
- [VS Code FX Extension](https://marketplace.visualstudio.com/items?itemName=VSCodeFX.vscode-fx)

</td>
</tr>
</table>

---

<p align="center">
  <i>Designed and engineered with 💜 & ⚡ by Jorge Bucio</i>
</p>
