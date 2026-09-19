import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTS_DIR = path.resolve(__dirname, '../src/components/project-arts');
const GENERATED_DIR = path.resolve(ARTS_DIR, 'generated');
const PROJECT_ART_PATH = path.resolve(ARTS_DIR, 'ProjectArt.tsx');
const PROJECTS_JSON_PATH = path.resolve(__dirname, '../src/data/projects.json');

// ─── Language → Color Palette Mapping ───
const LANGUAGE_COLORS = {
  typescript: { primary: '#3178c6', secondary: '#00d4ff', accent: '#61dafb' },
  javascript: { primary: '#f7df1e', secondary: '#ff9800', accent: '#ffb74d' },
  python:     { primary: '#3572A5', secondary: '#4caf50', accent: '#81c784' },
  css:        { primary: '#e91e97', secondary: '#9c27b0', accent: '#ce93d8' },
  html:       { primary: '#e44d26', secondary: '#f06529', accent: '#ff8a65' },
  ejs:        { primary: '#a12b55', secondary: '#bf4080', accent: '#e57399' },
  default:    { primary: '#00ffc8', secondary: '#38bdf8', accent: '#7950f2' },
};

function getColors(language) {
  const key = (language || '').toLowerCase();
  return LANGUAGE_COLORS[key] || LANGUAGE_COLORS.default;
}

// ─── Seeded random for consistent visuals per project ───
function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return function() {
    h = (h * 16807 + 0) % 2147483647;
    return (h & 0x7fffffff) / 0x7fffffff;
  };
}

// ─── Convert project ID to PascalCase component name ───
function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

// ─── Template: Full-Stack (server + database + connections) ───
function templateFullStack(id, name, colors, rand) {
  const uid = id.replace(/[^a-z0-9]/g, '');
  const r1 = Math.floor(rand() * 30) + 10;
  const r2 = Math.floor(rand() * 20) + 5;
  return `import React from 'react';

const Generated${toPascalCase(id)}Art: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg viewBox="0 0 640 320" className="w-100 h-100" style={{ width: '100%', height: '100%', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${uid}Grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="${colors.primary}" />
            <stop offset="100%" stopColor="${colors.secondary}" />
          </linearGradient>
          <radialGradient id="${uid}Bg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>
          <filter id="${uid}Glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <style>{\`
          @keyframes ${uid}Pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
          @keyframes ${uid}Spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .${uid}-pulse { animation: ${uid}Pulse 3s ease-in-out infinite; }
          .${uid}-spin { transform-origin: 320px 160px; animation: ${uid}Spin 20s linear infinite; }
        \`}</style>

        <rect width="640" height="320" fill="url(#${uid}Bg)" />

        {/* Server Rack */}
        <rect x="120" y="80" width="120" height="160" rx="8" fill="none" stroke="${colors.primary}" strokeWidth="2" filter="url(#${uid}Glow)" />
        <rect x="130" y="95" width="100" height="18" rx="3" fill="${colors.primary}" opacity="0.2" />
        <circle cx="215" cy="104" r="4" fill="${colors.accent}" className="${uid}-pulse" />
        <rect x="130" y="120" width="100" height="18" rx="3" fill="${colors.primary}" opacity="0.15" />
        <circle cx="215" cy="129" r="4" fill="${colors.secondary}" className="${uid}-pulse" />
        <rect x="130" y="145" width="100" height="18" rx="3" fill="${colors.primary}" opacity="0.1" />
        <circle cx="215" cy="154" r="4" fill="${colors.primary}" />
        <rect x="130" y="170" width="100" height="18" rx="3" fill="${colors.primary}" opacity="0.08" />

        {/* Database Cylinder */}
        <ellipse cx="480" cy="110" rx="60" ry="${r1}" fill="${colors.primary}" opacity="0.15" stroke="${colors.secondary}" strokeWidth="1.5" />
        <rect x="420" y="110" width="120" height="100" fill="rgba(0,0,0,0.3)" stroke="${colors.secondary}" strokeWidth="1.5" />
        <ellipse cx="480" cy="210" rx="60" ry="${r1}" fill="${colors.primary}" opacity="0.1" stroke="${colors.secondary}" strokeWidth="1.5" />
        <ellipse cx="480" cy="150" rx="60" ry="${r2}" fill="none" stroke="${colors.secondary}" strokeWidth="0.8" opacity="0.4" />

        {/* Connection Lines */}
        <line x1="240" y1="160" x2="420" y2="160" stroke="url(#${uid}Grad)" strokeWidth="2" strokeDasharray="8 4" className="${uid}-pulse" />
        <circle cx="330" cy="160" r="6" fill="${colors.accent}" filter="url(#${uid}Glow)" className="${uid}-pulse" />

        {/* Orbital Ring */}
        <g className="${uid}-spin" opacity="0.2">
          <circle cx="320" cy="160" r="140" fill="none" stroke="${colors.accent}" strokeWidth="1" strokeDasharray="6 8" />
        </g>

        {/* Title */}
        <text x="320" y="290" textAnchor="middle" fill="${colors.accent}" fontSize="13" fontFamily="monospace" opacity="0.7">${name.toUpperCase()}</text>
      </svg>
    </div>
  );
};

export default Generated${toPascalCase(id)}Art;
`;
}

// ─── Template: Frontend (browser + UI wireframe) ───
function templateFrontend(id, name, colors, rand) {
  const uid = id.replace(/[^a-z0-9]/g, '');
  const barW = 40 + Math.floor(rand() * 60);
  return `import React from 'react';

const Generated${toPascalCase(id)}Art: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg viewBox="0 0 640 320" className="w-100 h-100" style={{ width: '100%', height: '100%', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${uid}Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="${colors.primary}" />
            <stop offset="100%" stopColor="${colors.secondary}" />
          </linearGradient>
          <radialGradient id="${uid}Bg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>
          <filter id="${uid}Glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <style>{\`
          @keyframes ${uid}Blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
          @keyframes ${uid}FadeIn { 0% { opacity: 0; } 100% { opacity: 0.6; } }
          .${uid}-cursor { animation: ${uid}Blink 1s step-end infinite; }
          .${uid}-fade { animation: ${uid}FadeIn 2s ease forwards; }
        \`}</style>

        <rect width="640" height="320" fill="url(#${uid}Bg)" />

        {/* Browser Frame */}
        <rect x="120" y="40" width="400" height="240" rx="10" fill="none" stroke="${colors.primary}" strokeWidth="2" filter="url(#${uid}Glow)" />
        <rect x="120" y="40" width="400" height="30" rx="10" fill="${colors.primary}" opacity="0.15" />
        <circle cx="142" cy="55" r="5" fill="#ff5f57" />
        <circle cx="160" cy="55" r="5" fill="#febc2e" />
        <circle cx="178" cy="55" r="5" fill="#28c840" />
        <rect x="220" y="49" width="180" height="12" rx="6" fill="rgba(255,255,255,0.08)" />

        {/* UI Wireframe Elements */}
        <rect x="140" y="85" width="160" height="14" rx="3" fill="${colors.primary}" opacity="0.3" />
        <rect x="140" y="108" width="${barW}" height="8" rx="2" fill="${colors.secondary}" opacity="0.2" />
        <rect x="140" y="125" width="360" height="1" fill="${colors.accent}" opacity="0.15" />

        {/* Code Lines */}
        <rect x="140" y="140" width="200" height="8" rx="2" fill="${colors.accent}" opacity="0.2" className="${uid}-fade" />
        <rect x="140" y="155" width="280" height="8" rx="2" fill="${colors.primary}" opacity="0.15" className="${uid}-fade" />
        <rect x="140" y="170" width="160" height="8" rx="2" fill="${colors.secondary}" opacity="0.2" className="${uid}-fade" />
        <rect x="140" y="185" width="320" height="8" rx="2" fill="${colors.accent}" opacity="0.12" className="${uid}-fade" />
        <rect x="140" y="200" width="240" height="8" rx="2" fill="${colors.primary}" opacity="0.18" className="${uid}-fade" />

        {/* Cursor */}
        <rect x="140" y="218" width="2" height="14" fill="${colors.accent}" className="${uid}-cursor" />

        {/* Bracket Decorations */}
        <text x="50" y="170" fill="${colors.primary}" fontSize="48" fontFamily="monospace" opacity="0.15">{"<"}</text>
        <text x="570" y="170" fill="${colors.secondary}" fontSize="48" fontFamily="monospace" opacity="0.15">{"/>"}</text>

        {/* Title */}
        <text x="320" y="305" textAnchor="middle" fill="${colors.accent}" fontSize="13" fontFamily="monospace" opacity="0.7">${name.toUpperCase()}</text>
      </svg>
    </div>
  );
};

export default Generated${toPascalCase(id)}Art;
`;
}

// ─── Template: 3D & Creative UI (geometric polyhedron + particles) ───
function templateCreative(id, name, colors, rand) {
  const uid = id.replace(/[^a-z0-9]/g, '');
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const r = 80 + rand() * 20;
    pts.push(`${320 + Math.cos(angle) * r},${160 + Math.sin(angle) * r}`);
  }
  const hexPoints = pts.join(' ');

  return `import React from 'react';

const Generated${toPascalCase(id)}Art: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg viewBox="0 0 640 320" className="w-100 h-100" style={{ width: '100%', height: '100%', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${uid}Grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="${colors.primary}" />
            <stop offset="50%" stopColor="${colors.accent}" />
            <stop offset="100%" stopColor="${colors.secondary}" />
          </linearGradient>
          <radialGradient id="${uid}Bg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>
          <filter id="${uid}Glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <style>{\`
          @keyframes ${uid}Rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes ${uid}Float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          .${uid}-rotate { transform-origin: 320px 160px; animation: ${uid}Rotate 15s linear infinite; }
          .${uid}-float { animation: ${uid}Float 4s ease-in-out infinite; }
        \`}</style>

        <rect width="640" height="320" fill="url(#${uid}Bg)" />

        {/* Outer Orbit */}
        <g className="${uid}-rotate" opacity="0.2">
          <circle cx="320" cy="160" r="130" fill="none" stroke="${colors.accent}" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="320" cy="160" r="120" fill="none" stroke="${colors.primary}" strokeWidth="0.8" strokeDasharray="12 8" />
        </g>

        {/* Central Polyhedron */}
        <g className="${uid}-float">
          <polygon points="${hexPoints}" fill="url(#${uid}Grad)" opacity="0.2" />
          <polygon points="${hexPoints}" fill="none" stroke="url(#${uid}Grad)" strokeWidth="2.5" filter="url(#${uid}Glow)" />

          {/* Inner Triangulation Lines */}
          <line x1="${pts[0].split(',')[0]}" y1="${pts[0].split(',')[1]}" x2="${pts[3].split(',')[0]}" y2="${pts[3].split(',')[1]}" stroke="${colors.accent}" strokeWidth="0.8" opacity="0.3" />
          <line x1="${pts[1].split(',')[0]}" y1="${pts[1].split(',')[1]}" x2="${pts[4].split(',')[0]}" y2="${pts[4].split(',')[1]}" stroke="${colors.primary}" strokeWidth="0.8" opacity="0.3" />
          <line x1="${pts[2].split(',')[0]}" y1="${pts[2].split(',')[1]}" x2="${pts[5].split(',')[0]}" y2="${pts[5].split(',')[1]}" stroke="${colors.secondary}" strokeWidth="0.8" opacity="0.3" />

          {/* Center Core */}
          <circle cx="320" cy="160" r="12" fill="${colors.accent}" opacity="0.4" filter="url(#${uid}Glow)" />
          <circle cx="320" cy="160" r="5" fill="#fff" opacity="0.9" />
        </g>

        {/* Floating Particles */}
        <circle cx="${180 + Math.floor(rand()*40)}" cy="${80 + Math.floor(rand()*30)}" r="3" fill="${colors.accent}" opacity="0.5" />
        <circle cx="${440 + Math.floor(rand()*40)}" cy="${90 + Math.floor(rand()*30)}" r="2" fill="${colors.primary}" opacity="0.6" />
        <circle cx="${150 + Math.floor(rand()*30)}" cy="${220 + Math.floor(rand()*30)}" r="2.5" fill="${colors.secondary}" opacity="0.4" />
        <circle cx="${460 + Math.floor(rand()*40)}" cy="${210 + Math.floor(rand()*30)}" r="3" fill="${colors.accent}" opacity="0.5" />

        {/* Title */}
        <text x="320" y="295" textAnchor="middle" fill="${colors.accent}" fontSize="13" fontFamily="monospace" opacity="0.7">${name.toUpperCase()}</text>
      </svg>
    </div>
  );
};

export default Generated${toPascalCase(id)}Art;
`;
}

// ─── Template: Web3 & Blockchain (chain links + hexagonal nodes) ───
function templateWeb3(id, name, colors, rand) {
  const uid = id.replace(/[^a-z0-9]/g, '');
  return `import React from 'react';

const Generated${toPascalCase(id)}Art: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg viewBox="0 0 640 320" className="w-100 h-100" style={{ width: '100%', height: '100%', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${uid}Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="${colors.primary}" />
            <stop offset="100%" stopColor="${colors.accent}" />
          </linearGradient>
          <radialGradient id="${uid}Bg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>
          <filter id="${uid}Glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <style>{\`
          @keyframes ${uid}ChainPulse { 0%,100% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -40; } }
          @keyframes ${uid}NodeGlow { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
          .${uid}-chain { animation: ${uid}ChainPulse 2s linear infinite; }
          .${uid}-node { animation: ${uid}NodeGlow 2.5s ease-in-out infinite; }
        \`}</style>

        <rect width="640" height="320" fill="url(#${uid}Bg)" />

        {/* Chain Links */}
        <line x1="100" y1="160" x2="240" y2="160" stroke="${colors.primary}" strokeWidth="2" strokeDasharray="12 8" className="${uid}-chain" />
        <line x1="280" y1="160" x2="360" y2="160" stroke="${colors.accent}" strokeWidth="2" strokeDasharray="12 8" className="${uid}-chain" />
        <line x1="400" y1="160" x2="540" y2="160" stroke="${colors.secondary}" strokeWidth="2" strokeDasharray="12 8" className="${uid}-chain" />

        {/* Hex Nodes */}
        <polygon points="260,130 285,140 285,165 260,175 235,165 235,140" fill="${colors.primary}" opacity="0.2" stroke="${colors.primary}" strokeWidth="2" filter="url(#${uid}Glow)" className="${uid}-node" />
        <polygon points="380,130 405,140 405,165 380,175 355,165 355,140" fill="${colors.accent}" opacity="0.2" stroke="${colors.accent}" strokeWidth="2" filter="url(#${uid}Glow)" className="${uid}-node" />

        {/* Center Block */}
        <rect x="290" y="120" width="60" height="60" rx="6" fill="none" stroke="url(#${uid}Grad)" strokeWidth="2.5" filter="url(#${uid}Glow)" />
        <text x="320" y="156" textAnchor="middle" fill="${colors.accent}" fontSize="22" fontFamily="monospace" fontWeight="bold">B</text>

        {/* Endpoint Nodes */}
        <circle cx="100" cy="160" r="8" fill="${colors.primary}" opacity="0.5" />
        <circle cx="540" cy="160" r="8" fill="${colors.secondary}" opacity="0.5" />

        {/* Title */}
        <text x="320" y="295" textAnchor="middle" fill="${colors.accent}" fontSize="13" fontFamily="monospace" opacity="0.7">${name.toUpperCase()}</text>
      </svg>
    </div>
  );
};

export default Generated${toPascalCase(id)}Art;
`;
}

// ─── Template: General / Web Application (terminal + circuit) ───
function templateGeneral(id, name, colors, rand) {
  const uid = id.replace(/[^a-z0-9]/g, '');
  return `import React from 'react';

const Generated${toPascalCase(id)}Art: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg viewBox="0 0 640 320" className="w-100 h-100" style={{ width: '100%', height: '100%', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${uid}Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="${colors.primary}" />
            <stop offset="100%" stopColor="${colors.secondary}" />
          </linearGradient>
          <radialGradient id="${uid}Bg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>
          <filter id="${uid}Glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <style>{\`
          @keyframes ${uid}Blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
          @keyframes ${uid}Trace { 0% { stroke-dashoffset: 200; } 100% { stroke-dashoffset: 0; } }
          .${uid}-cursor { animation: ${uid}Blink 1s step-end infinite; }
          .${uid}-trace { stroke-dasharray: 200; animation: ${uid}Trace 3s ease forwards; }
        \`}</style>

        <rect width="640" height="320" fill="url(#${uid}Bg)" />

        {/* Terminal Window */}
        <rect x="140" y="50" width="360" height="200" rx="10" fill="none" stroke="${colors.primary}" strokeWidth="2" filter="url(#${uid}Glow)" />
        <rect x="140" y="50" width="360" height="28" rx="10" fill="${colors.primary}" opacity="0.12" />
        <circle cx="160" cy="64" r="4" fill="#ff5f57" />
        <circle cx="176" cy="64" r="4" fill="#febc2e" />
        <circle cx="192" cy="64" r="4" fill="#28c840" />

        {/* Terminal Lines */}
        <text x="160" y="102" fill="${colors.accent}" fontSize="12" fontFamily="monospace" opacity="0.8">$ npm run build</text>
        <text x="160" y="122" fill="${colors.secondary}" fontSize="11" fontFamily="monospace" opacity="0.5">✓ compiled successfully</text>
        <text x="160" y="142" fill="${colors.primary}" fontSize="11" fontFamily="monospace" opacity="0.4">✓ ${name.toLowerCase()} ready</text>
        <text x="160" y="165" fill="${colors.accent}" fontSize="12" fontFamily="monospace" opacity="0.7">$</text>
        <rect x="172" y="155" width="2" height="13" fill="${colors.accent}" className="${uid}-cursor" />

        {/* Circuit Traces */}
        <path d="M 60,280 L 120,280 L 140,260" fill="none" stroke="${colors.primary}" strokeWidth="1.5" opacity="0.25" className="${uid}-trace" />
        <path d="M 580,280 L 520,280 L 500,260" fill="none" stroke="${colors.secondary}" strokeWidth="1.5" opacity="0.25" className="${uid}-trace" />
        <circle cx="60" cy="280" r="4" fill="${colors.primary}" opacity="0.4" />
        <circle cx="580" cy="280" r="4" fill="${colors.secondary}" opacity="0.4" />

        {/* Decorative Dots */}
        <circle cx="${80 + Math.floor(rand()*30)}" cy="${60 + Math.floor(rand()*40)}" r="2" fill="${colors.accent}" opacity="0.3" />
        <circle cx="${530 + Math.floor(rand()*30)}" cy="${70 + Math.floor(rand()*40)}" r="2.5" fill="${colors.primary}" opacity="0.3" />

        {/* Title */}
        <text x="320" y="305" textAnchor="middle" fill="${colors.accent}" fontSize="13" fontFamily="monospace" opacity="0.7">${name.toUpperCase()}</text>
      </svg>
    </div>
  );
};

export default Generated${toPascalCase(id)}Art;
`;
}

// ─── Smart Template Router (category + description analysis) ───
function getTemplate(category, description) {
  const cat = (category || '').toLowerCase();
  const desc = (description || '').toLowerCase();

  // First: check description keywords for more accurate matching
  const fullStackSignals = ['server', 'database', 'mongodb', 'express', 'node.js', 'api', 'crud', 'backend', 'rest', 'full-stack', 'fullstack', 'sql', 'postgres'];
  const frontendSignals = ['responsive', 'layout', 'css', 'html', 'flexbox', 'grid', 'ui', 'typography', 'bootstrap', 'tailwind', 'accessible', 'wcag', 'landing page', 'website', 'redesign', 'cleaning', 'business'];
  const creativeSignals = ['3d', 'three.js', 'animation', 'canvas', 'webgl', 'particle', 'game', 'chess', 'timer', 'countdown', 'quiz', 'interactive'];
  const web3Signals = ['web3', 'blockchain', 'smart contract', 'motoko', 'icp', 'ethereum', 'solidity', 'token', 'nft', 'dapp'];

  const matchCount = (signals) => signals.filter(s => desc.includes(s)).length;

  const scores = {
    fullStack: matchCount(fullStackSignals),
    frontend: matchCount(frontendSignals),
    creative: matchCount(creativeSignals),
    web3: matchCount(web3Signals),
  };

  // Pick template with highest description match
  const maxScore = Math.max(scores.fullStack, scores.frontend, scores.creative, scores.web3);
  
  if (maxScore > 0) {
    if (scores.web3 === maxScore) return templateWeb3;
    if (scores.creative === maxScore) return templateCreative;
    if (scores.fullStack === maxScore) return templateFullStack;
    if (scores.frontend === maxScore) return templateFrontend;
  }

  // Fallback: use category
  if (cat.includes('full-stack')) return templateFullStack;
  if (cat.includes('frontend')) return templateFrontend;
  if (cat.includes('3d') || cat.includes('creative')) return templateCreative;
  if (cat.includes('web3') || cat.includes('blockchain')) return templateWeb3;
  return templateGeneral;
}

// ─── Read existing hand-crafted art IDs from ProjectArt.tsx ───
function getExistingArtIds() {
  const content = fs.readFileSync(PROJECT_ART_PATH, 'utf8');
  const caseRegex = /case\s+'([^']+)'/g;
  const ids = new Set();
  let match;
  while ((match = caseRegex.exec(content)) !== null) {
    ids.add(match[1]);
  }
  return ids;
}

// ─── Main Generator ───
function generateArt() {
  console.log('🎨 Starting SVG art generation...');

  // Ensure generated directory exists
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }

  // Load projects
  const projects = JSON.parse(fs.readFileSync(PROJECTS_JSON_PATH, 'utf8'));
  
  // Get IDs that already have hand-crafted art
  const existingIds = getExistingArtIds();
  console.log(`   Found ${existingIds.size} hand-crafted art entries (protected).`);

  // Also check what generated files already exist (to avoid re-generating)
  const existingGenerated = new Set(
    fs.readdirSync(GENERATED_DIR)
      .filter(f => f.endsWith('.tsx'))
      .map(f => f.replace(/^Generated/, '').replace(/Art\.tsx$/, ''))
  );

  let generated = 0;
  const generatedMap = {};

  for (const project of projects) {
    const id = project.id;
    
    // Skip if hand-crafted art exists
    if (existingIds.has(id)) {
      continue;
    }

    const pascalName = toPascalCase(id);
    const fileName = `Generated${pascalName}Art.tsx`;
    const filePath = path.join(GENERATED_DIR, fileName);

    // Get template and colors
    const colors = getColors(project.language);
    const rand = seededRandom(id);
    const templateFn = getTemplate(project.category, project.description);
    const title = project.name || toPascalCase(id);

    // Generate component
    const componentCode = templateFn(id, title, colors, rand);
    fs.writeFileSync(filePath, componentCode);

    generatedMap[id] = {
      componentName: `Generated${pascalName}Art`,
      fileName: fileName,
    };

    generated++;
    console.log(`   ✅ Generated: ${fileName}`);
  }

  // Write index file for generated art
  const indexLines = ['// Auto-generated index — do not edit manually'];
  const importLines = [];
  const exportMap = {};

  for (const [id, info] of Object.entries(generatedMap)) {
    importLines.push(`import ${info.componentName} from './${info.fileName.replace('.tsx', '')}';`);
    exportMap[id] = info.componentName;
  }

  // Also include previously generated files
  for (const project of projects) {
    const id = project.id;
    if (existingIds.has(id) || generatedMap[id]) continue;
    
    const pascalName = toPascalCase(id);
    const fileName = `Generated${pascalName}Art.tsx`;
    if (fs.existsSync(path.join(GENERATED_DIR, fileName))) {
      const compName = `Generated${pascalName}Art`;
      importLines.push(`import ${compName} from './${fileName.replace('.tsx', '')}';`);
      exportMap[id] = compName;
    }
  }

  const indexContent = `${indexLines.join('\n')}
import React from 'react';
${importLines.join('\n')}

interface GeneratedArtProps {
  projectId: string;
}

const generatedArtMap: Record<string, React.FC> = {
${Object.entries(exportMap).map(([id, comp]) => `  '${id}': ${comp},`).join('\n')}
};

const GeneratedArt: React.FC<GeneratedArtProps> = ({ projectId }) => {
  const Component = generatedArtMap[projectId.toLowerCase().trim()];
  return Component ? <Component /> : null;
};

export default GeneratedArt;
export { generatedArtMap };
`;

  fs.writeFileSync(path.join(GENERATED_DIR, 'index.tsx'), indexContent);

  console.log(`\n🎨 Art generation complete: ${generated} new, ${existingIds.size} protected.`);
}

generateArt();
