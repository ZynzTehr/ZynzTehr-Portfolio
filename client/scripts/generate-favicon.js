import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#12142a"/>
      <stop offset="60%" stop-color="#090a14"/>
      <stop offset="100%" stop-color="#04040a"/>
    </radialGradient>

    <!-- Neon Cyan to Violet Gradient -->
    <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00ffc8"/>
      <stop offset="50%" stop-color="#00d9ff"/>
      <stop offset="100%" stop-color="#7950f2"/>
    </linearGradient>

    <!-- Globe Sphere Gradient -->
    <radialGradient id="globeGrad" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#00ffc8" stop-opacity="0.95"/>
      <stop offset="35%" stop-color="#00a896" stop-opacity="0.8"/>
      <stop offset="70%" stop-color="#023e8a" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#011627" stop-opacity="1"/>
    </radialGradient>

    <!-- Star Glint Gradient -->
    <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#00ffc8"/>
      <stop offset="100%" stop-color="#00ffc8" stop-opacity="0"/>
    </radialGradient>

    <!-- Glow Filters -->
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Base Rounded Container with Neon Border (padded to avoid filter clipping) -->
  <rect x="28" y="28" width="456" height="456" rx="100" fill="url(#bgGrad)" stroke="url(#neonGrad)" stroke-width="8" />
  
  <!-- Subtle Grid Accent -->
  <circle cx="256" cy="256" r="170" fill="none" stroke="rgba(0, 255, 200, 0.08)" stroke-width="2" stroke-dasharray="6 6"/>

  <!-- Glowing Planetary Orbit Ring (Tilted Oval) -->
  <g transform="rotate(-28 256 256)">
    <!-- Back of Orbit Ring -->
    <ellipse cx="256" cy="256" rx="195" ry="64" fill="none" stroke="url(#neonGrad)" stroke-width="6" opacity="0.4" stroke-dasharray="16 8"/>
    
    <!-- Central 3D Globe -->
    <circle cx="256" cy="256" r="115" fill="url(#globeGrad)" filter="url(#softGlow)"/>

    <!-- Globe Grid Lines (Equator & Meridians) -->
    <ellipse cx="256" cy="218" rx="95" ry="30" fill="none" stroke="rgba(255, 255, 255, 0.45)" stroke-width="3"/>
    <ellipse cx="256" cy="256" rx="115" ry="36" fill="none" stroke="rgba(255, 255, 255, 0.65)" stroke-width="3.5"/>
    <ellipse cx="256" cy="294" rx="95" ry="30" fill="none" stroke="rgba(255, 255, 255, 0.45)" stroke-width="3"/>
    <ellipse cx="256" cy="256" rx="44" ry="115" fill="none" stroke="rgba(255, 255, 255, 0.55)" stroke-width="3"/>

    <!-- Cybernetic "Z" Core Emblem Overlay -->
    <path d="M 205 192 L 307 192 L 225 320 L 307 320" 
          fill="none" 
          stroke="#ffffff" 
          stroke-width="20" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          filter="url(#glow)"/>

    <path d="M 205 192 L 307 192 L 225 320 L 307 320" 
          fill="none" 
          stroke="#00ffc8" 
          stroke-width="12" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>

    <!-- Front of Orbit Ring (Foreground) -->
    <path d="M 61 256 A 195 64 0 0 0 451 256" fill="none" stroke="url(#neonGrad)" stroke-width="8" filter="url(#glow)"/>
    <path d="M 61 256 A 195 64 0 0 0 451 256" fill="none" stroke="#ffffff" stroke-width="3"/>
  </g>

  <!-- Sparkling 8-Point Star Flare on Orbit (Top Right) -->
  <g transform="translate(390, 135)">
    <circle cx="0" cy="0" r="30" fill="url(#starGlow)"/>
    
    <!-- Primary Vertical / Horizontal Cross -->
    <path d="M 0 -38 Q 0 0 5 0 Q 0 0 0 38 Q 0 0 -5 0 Q 0 0 0 -38" fill="#ffffff" filter="url(#glow)"/>
    <path d="M -38 0 Q 0 0 0 5 Q 0 0 38 0 Q 0 0 0 -5 Q 0 0 -38 0" fill="#ffffff" filter="url(#glow)"/>
    
    <!-- Diagonal Glints -->
    <g transform="rotate(45)">
      <path d="M 0 -20 Q 0 0 2.5 0 Q 0 0 0 20 Q 0 0 -2.5 0 Q 0 0 0 -20" fill="#00ffc8"/>
      <path d="M -20 0 Q 0 0 0 2.5 Q 0 0 20 0 Q 0 0 0 -2.5 Q 0 0 -20 0" fill="#00ffc8"/>
    </g>
    
    <!-- Star Center -->
    <circle cx="0" cy="0" r="4.5" fill="#ffffff"/>
  </g>
</svg>`;

async function generateFavicons() {
  const publicDir = path.resolve(__dirname, '../public');
  const assetsDir = path.resolve(publicDir, 'assets');

  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // 1. Write the modern vector SVG favicon
  fs.writeFileSync(path.resolve(assetsDir, 'favicon.svg'), svgIcon.trim());
  console.log('✅ Generated favicon.svg in public/assets/');

  // 2. Launch Puppeteer to render crisp high-DPI PNGs
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  </style>
</head>
<body>
  ${svgIcon}
</body>
</html>`;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const sizes = [
    { name: 'favicon.png', dir: assetsDir, width: 192, height: 192, scale: 2 },
    { name: 'apple-touch-icon.png', dir: assetsDir, width: 180, height: 180, scale: 2 },
  ];

  for (const s of sizes) {
    await page.setViewport({ width: s.width, height: s.height, deviceScaleFactor: s.scale || 2 });
    const targetPath = path.resolve(s.dir, s.name);
    await page.screenshot({
      path: targetPath,
      omitBackground: true,
    });
    console.log(`✅ Generated ${s.name} (${s.width}x${s.height}) at ${targetPath}`);
  }

  await browser.close();
  console.log('🎉 3 essential favicon assets generated in public/assets/!');
}

generateFavicons().catch(err => {
  console.error('❌ Failed to generate favicons:', err);
  process.exit(1);
});
