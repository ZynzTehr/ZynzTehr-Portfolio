<div align="center">

# <img src="./client/src/assets/react.svg" width="20" height="20" valign="middle" alt="React" /> Jorge Bucio | 3D Interactive Portfolio <img src="./client/src/assets/react.svg" width="20" height="20" valign="middle" alt="React" />

<p align="center">
  <b>A state-of-the-art, 3D cybernetic developer portfolio showcasing Full-Stack, Web3, Creative UI, and Software Architecture engineering.</b>
</p>

<p align="center">
  <a href="https://zynztehr.github.io/ZynzTehr-Portfolio/">
    <img src="https://img.shields.io/badge/Live_Demo-Explore_3D_Portfolio-00ffc8?style=for-the-badge&logo=githubpages&logoColor=black" alt="Live Portfolio" />
  </a>
  <a href="https://github.com/ZynzTehr">
    <img src="https://img.shields.io/badge/GitHub-@ZynzTehr-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile" />
  </a>
  <a href="https://zynz-tehr-profile.vercel.app">
    <img src="https://img.shields.io/badge/Profile_Hub-Interactive_Themes-7950f2?style=for-the-badge&logo=vercel&logoColor=white" alt="Profile Hub" />
  </a>
</p>

---

</div>

## Key Features

- **Central Three.js Atmospheric 3D Earth:** High-performance procedural globe with high-resolution planetary textures, night city lights illumination, atmospheric Fresnel shader glow, and mouse-parallax interaction.
- **3D Orbiting Cylinder Carousel:** 3D perspective cylinder revolving carousel showcasing looping Matrix Digital Rain with instant smooth cross-fade to bespoke project vector SVG artwork on hover.
- **Click-to-Reveal Repository Archive:** Interactive locked archive section that initializes when clicking the search bar, with GSAP stagger animations for the first three cards and dynamic viewport `ScrollTrigger.batch` transitions for remaining modules.
- **17 Bespoke Handcrafted SVG Project Artworks:** Tailored vector architectural diagrams, interactive UI mockups, and schematic badges for every repository.
- **Scroll-Velocity Responsive React Widget:** Physics-driven floating scroll widget utilizing `react.svg` that dynamically accelerates its rotational spin based on scroll speed and triggers a reverse card stagger upon clicking **Back to Top**.
- **Floating Notched Search Bar:** Cybernetic outlined input with animated floating label that dynamically breaks the top border line on focus/typing.
- **Automated GitHub Repo Sync:** Integrated Node.js engine and GitHub Actions workflow (`sync-repos.js`) that automatically queries GitHub's API at build time to discover and generate cards for newly published repositories.
- **Project Inspector Modals:** In-depth project modals featuring bespoke SVG art, technical architecture descriptions, topic tags, and direct links to live demos and GitHub repositories.
- **Cyberpunk Glassmorphism Aesthetics:** Neon cyan (`#00ffc8`), electric violet (`#7950f2`), and emerald (`#00ff88`) glowing accents paired with `Orbitron`, `Space Grotesk`, and `Outfit` typography.
- **100% Static & Serverless:** Zero backend overhead, optimized for ultra-fast, permanent hosting on **GitHub Pages**.

---

## Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/GSAP_3-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP 3" />
  <img src="https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Anime.js-232121?style=for-the-badge&logo=anime.js&logoColor=white" alt="Anime.js" />
  <img src="https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions" />
</p>

---

## Getting Started (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/ZynzTehr/ZynzTehr-Portfolio.git
cd ZynzTehr-Portfolio/client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Sync Repositories & Start Dev Server
```bash
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## Building for Production

To run the automated GitHub repository sync and compile the optimized production bundle:

```bash
cd client
npm run build
```

The compiled static assets will be output to `client/dist/`.

---

## Automated Deployment to GitHub Pages

This project includes a continuous deployment workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Whenever you push to the `main` branch (or on a weekly automated cron trigger), GitHub Actions will:
1. Execute `client/scripts/sync-repos.js` to fetch and format all newly published repositories.
2. Build the optimized Vite production bundle.
3. Deploy the static application directly to **GitHub Pages** at:
   **`https://[your-username].github.io/[repository-name]/`**

---

## 👤 Author

**Jorge Alberto Bucio**
- **GitHub:** [@ZynzTehr](https://github.com/ZynzTehr)
- **Profile Hub:** [ZynzTehr Profile](https://zynz-tehr-profile.vercel.app)
- **Live Portfolio:** [3D Interactive Showcase](https://zynztehr.github.io/ZynzTehr-Portfolio/)

---

<p align="center">
  <i>Designed and developed with 💜 & ⚡ by Jorge Bucio.</i>
</p>
