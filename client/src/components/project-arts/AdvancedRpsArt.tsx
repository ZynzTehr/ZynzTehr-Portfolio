import React from 'react';

const AdvancedRpsArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="advGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          <linearGradient id="advStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <radialGradient id="advBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#151828" />
            <stop offset="60%" stopColor="#080912" />
            <stop offset="100%" stopColor="#020206" />
          </radialGradient>

          <filter id="advGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="advFillClip">
            <rect x="0" y="0" width="640" height="320" className="adv-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes advRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes advDraw {
            0% { stroke-dashoffset: 1400; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes rotateTriangle {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .adv-fill-rect {
            animation: advRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .adv-outline {
            stroke-dasharray: 1400;
            stroke-dashoffset: 1400;
            animation: advDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .tri-spin { transform-origin: 320px 145px; animation: rotateTriangle 30s infinite linear; }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#advBg)" />

        {/* Dynamic Triangular Battle Ring */}
        <g className="tri-spin" opacity="0.2">
          <circle cx="320" cy="145" r="115" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="12 12" />
        </g>

        <g>
          {/* Triangle Connector (Rendered behind the nodes) */}
          <polygon
            points="320,65 410,210 230,210"
            fill="none"
            stroke="url(#advStroke)"
            strokeWidth="3.5"
            filter="url(#advGlow)"
            className="adv-outline"
          />

          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#advFillClip)">
            {/* Center Triangular Nexus */}
            <polygon points="320,65 410,210 230,210" fill="url(#advGrad)" opacity="0.25" />

            {/* Top Node: Scissors (Yellow) */}
            <circle cx="320" cy="65" r="32" fill="#eab308" opacity="0.9" />
            <circle cx="320" cy="65" r="24" fill="#080912" />
            <text x="320" y="65" textAnchor="middle" dominantBaseline="central" fontSize="22">✂️</text>

            {/* Bottom Right Node: Paper (Pink) */}
            <circle cx="410" cy="210" r="32" fill="#ec4899" opacity="0.9" />
            <circle cx="410" cy="210" r="24" fill="#080912" />
            <text x="410" y="210" textAnchor="middle" dominantBaseline="central" fontSize="22">✋</text>

            {/* Bottom Left Node: Rock (Blue) */}
            <circle cx="230" cy="210" r="32" fill="#3b82f6" opacity="0.9" />
            <circle cx="230" cy="210" r="24" fill="#080912" />
            <text x="230" y="210" textAnchor="middle" dominantBaseline="central" fontSize="22">✊</text>
          </g>

          {/* OUTLINE LAYER (Glowing Node Borders on Top) */}
          <g className="adv-outline" filter="url(#advGlow)">
            <circle cx="320" cy="65" r="32" fill="none" stroke="#eab308" strokeWidth="3" />
            <circle cx="410" cy="210" r="32" fill="none" stroke="#ec4899" strokeWidth="3" />
            <circle cx="230" cy="210" r="32" fill="none" stroke="#3b82f6" strokeWidth="3" />
          </g>
        </g>

        {/* Advanced RPS Tag */}
        <g transform="translate(255, 275)">
          <rect width="130" height="28" rx="6" fill="rgba(236, 72, 153, 0.15)" stroke="#ec4899" strokeWidth="1.2" />
          <text x="65" y="14" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="10" fontFamily="monospace" fontWeight="bold">ADVANCED // RPS</text>
        </g>
      </svg>
    </div>
  );
};

export default AdvancedRpsArt;
