import React from 'react';

const TicTacToeArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tttGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>

          <linearGradient id="tttStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#00ffc8" />
          </linearGradient>

          <radialGradient id="tttBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="60%" stopColor="#070918" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <filter id="tttGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="tttFillClip">
            <rect x="0" y="0" width="640" height="320" className="ttt-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes tttRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes tttDraw {
            0% { stroke-dashoffset: 1400; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes winFlash {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          .ttt-fill-rect {
            animation: tttRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .ttt-outline {
            stroke-dasharray: 1400;
            stroke-dashoffset: 1400;
            animation: tttDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .win-strike { animation: winFlash 1.5s infinite ease-in-out; }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#tttBg)" />

        {/* Arcade Grid Elements */}
        <g transform="translate(195, 25)">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#tttFillClip)">
            {/* 3x3 Tile Blocks */}
            <rect x="15" y="15" width="65" height="65" rx="8" fill="url(#tttGrad)" opacity="0.8" />
            <rect x="92" y="15" width="65" height="65" rx="8" fill="url(#tttGrad)" opacity="0.8" />
            <rect x="170" y="15" width="65" height="65" rx="8" fill="url(#tttGrad)" opacity="0.8" />

            <rect x="15" y="92" width="65" height="65" rx="8" fill="url(#tttGrad)" opacity="0.8" />
            <rect x="92" y="92" width="65" height="65" rx="8" fill="url(#tttGrad)" opacity="0.8" />
            <rect x="170" y="92" width="65" height="65" rx="8" fill="url(#tttGrad)" opacity="0.8" />

            <rect x="15" y="170" width="65" height="65" rx="8" fill="url(#tttGrad)" opacity="0.8" />
            <rect x="92" y="170" width="65" height="65" rx="8" fill="url(#tttGrad)" opacity="0.8" />
            <rect x="170" y="170" width="65" height="65" rx="8" fill="url(#tttGrad)" opacity="0.8" />

            {/* Inner Pieces */}
            <path d="M 33,33 L 62,62 M 62,33 L 33,62" stroke="#070918" strokeWidth="8" strokeLinecap="round" />
            <circle cx="124" cy="47" r="18" fill="none" stroke="#070918" strokeWidth="7" />
            <path d="M 188,110 L 217,139 M 217,110 L 188,139" stroke="#070918" strokeWidth="8" strokeLinecap="round" />
            <circle cx="47" cy="124" r="18" fill="none" stroke="#070918" strokeWidth="7" />
            <path d="M 33,188 L 62,217 M 62,188 L 33,217" stroke="#070918" strokeWidth="8" strokeLinecap="round" />
            <circle cx="124" cy="202" r="18" fill="none" stroke="#070918" strokeWidth="7" />
          </g>

          {/* OUTLINE LAYER */}
          <g className="ttt-outline" filter="url(#tttGlow)">
            {/* Grid Dividers */}
            <line x1="85" y1="10" x2="85" y2="240" stroke="url(#tttStroke)" strokeWidth="3" strokeLinecap="round" />
            <line x1="162" y1="10" x2="162" y2="240" stroke="url(#tttStroke)" strokeWidth="3" strokeLinecap="round" />
            <line x1="10" y1="85" x2="240" y2="85" stroke="url(#tttStroke)" strokeWidth="3" strokeLinecap="round" />
            <line x1="10" y1="162" x2="240" y2="162" stroke="url(#tttStroke)" strokeWidth="3" strokeLinecap="round" />

            {/* Glowing Outlines */}
            <path d="M 33,33 L 62,62 M 62,33 L 33,62" stroke="#00ffc8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="124" cy="47" r="18" fill="none" stroke="#ec4899" strokeWidth="4" />
            <path d="M 188,110 L 217,139 M 217,110 L 188,139" stroke="#00ffc8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="47" cy="124" r="18" fill="none" stroke="#ec4899" strokeWidth="4" />
            <path d="M 33,188 L 62,217 M 62,188 L 33,217" stroke="#00ffc8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="124" cy="202" r="18" fill="none" stroke="#ec4899" strokeWidth="4" />

            {/* Diagonal Win Strike */}
            <line x1="20" y1="20" x2="230" y2="230" stroke="#00ffc8" strokeWidth="4" strokeLinecap="round" className="win-strike" />
          </g>
        </g>

        {/* React Arcade Tag */}
        <g transform="translate(255, 275)">
          <rect width="130" height="28" rx="6" fill="rgba(0, 255, 200, 0.15)" stroke="#00ffc8" strokeWidth="1.2" />
          <text x="65" y="14" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="10" fontFamily="monospace" fontWeight="bold">REACT // ARCADE</text>
        </g>
      </svg>
    </div>
  );
};

export default TicTacToeArt;
