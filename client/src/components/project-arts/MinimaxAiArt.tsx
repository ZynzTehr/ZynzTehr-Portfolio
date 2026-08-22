import React from 'react';

const MinimaxAiArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="aiGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#7950f2" />
          </linearGradient>

          <linearGradient id="aiStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="100%" stopColor="#7950f2" />
          </linearGradient>

          <radialGradient id="aiBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="60%" stopColor="#070a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <filter id="aiGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="aiFillClip">
            <rect x="0" y="0" width="640" height="320" className="ai-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes aiRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes aiDraw {
            0% { stroke-dashoffset: 1400; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes neuralPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
          .ai-fill-rect {
            animation: aiRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .ai-outline {
            stroke-dasharray: 1400;
            stroke-dashoffset: 1400;
            animation: aiDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .neural-node { animation: neuralPulse 3s infinite ease-in-out; }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#aiBg)" />

        {/* Neural Minimax Algorithm Decision Graph in Background */}
        <g stroke="#38bdf8" strokeWidth="1" opacity="0.25" className="neural-node">
          <line x1="120" y1="160" x2="230" y2="90" />
          <line x1="120" y1="160" x2="230" y2="160" />
          <line x1="120" y1="160" x2="230" y2="230" />
          <line x1="520" y1="160" x2="410" y2="90" />
          <line x1="520" y1="160" x2="410" y2="160" />
          <line x1="520" y1="160" x2="410" y2="230" />
          
          <circle cx="120" cy="160" r="7" fill="#00ffc8" />
          <circle cx="230" cy="90" r="5" fill="#38bdf8" />
          <circle cx="230" cy="160" r="5" fill="#7950f2" />
          <circle cx="230" cy="230" r="5" fill="#38bdf8" />
          
          <circle cx="520" cy="160" r="7" fill="#7950f2" />
          <circle cx="410" cy="90" r="5" fill="#38bdf8" />
          <circle cx="410" cy="160" r="5" fill="#00ffc8" />
          <circle cx="410" cy="230" r="5" fill="#38bdf8" />
        </g>

        {/* 3D Isometric Holographic 3x3 Grid */}
        <g transform="translate(180, 20)">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#aiFillClip)">
            {/* Grid Cells Glow */}
            <rect x="20" y="20" width="70" height="70" rx="10" fill="url(#aiGrad)" opacity="0.8" />
            <rect x="105" y="20" width="70" height="70" rx="10" fill="url(#aiGrad)" opacity="0.8" />
            <rect x="190" y="20" width="70" height="70" rx="10" fill="url(#aiGrad)" opacity="0.8" />

            <rect x="20" y="105" width="70" height="70" rx="10" fill="url(#aiGrad)" opacity="0.8" />
            <rect x="105" y="105" width="70" height="70" rx="10" fill="url(#aiGrad)" opacity="0.8" />
            <rect x="190" y="105" width="70" height="70" rx="10" fill="url(#aiGrad)" opacity="0.8" />

            <rect x="20" y="190" width="70" height="70" rx="10" fill="url(#aiGrad)" opacity="0.8" />
            <rect x="105" y="190" width="70" height="70" rx="10" fill="url(#aiGrad)" opacity="0.8" />
            <rect x="190" y="190" width="70" height="70" rx="10" fill="url(#aiGrad)" opacity="0.8" />

            {/* Inner Pieces Fill */}
            {/* X at (0,0) */}
            <path d="M 40,40 L 70,70 M 70,40 L 40,70" stroke="#060914" strokeWidth="8" strokeLinecap="round" />
            {/* O at (1,1) */}
            <circle cx="140" cy="140" r="18" fill="none" stroke="#060914" strokeWidth="7" />
            {/* X at (2,0) */}
            <path d="M 210,40 L 240,70 M 240,40 L 210,70" stroke="#060914" strokeWidth="8" strokeLinecap="round" />
            {/* O at (0,2) */}
            <circle cx="55" cy="225" r="18" fill="none" stroke="#060914" strokeWidth="7" />
            {/* X at (2,2) */}
            <path d="M 210,210 L 240,240 M 240,210 L 210,240" stroke="#060914" strokeWidth="8" strokeLinecap="round" />
          </g>

          {/* OUTLINE LAYER */}
          <g className="ai-outline" filter="url(#aiGlow)">
            {/* Grid separator lines */}
            <line x1="97" y1="15" x2="97" y2="265" stroke="url(#aiStroke)" strokeWidth="3" strokeLinecap="round" />
            <line x1="182" y1="15" x2="182" y2="265" stroke="url(#aiStroke)" strokeWidth="3" strokeLinecap="round" />
            <line x1="15" y1="97" x2="265" y2="97" stroke="url(#aiStroke)" strokeWidth="3" strokeLinecap="round" />
            <line x1="15" y1="182" x2="265" y2="182" stroke="url(#aiStroke)" strokeWidth="3" strokeLinecap="round" />

            {/* Glowing X and O Outlines */}
            <path d="M 40,40 L 70,70 M 70,40 L 40,70" stroke="#00ffc8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="140" cy="140" r="18" fill="none" stroke="#7950f2" strokeWidth="4" />
            <path d="M 210,40 L 240,70 M 240,40 L 210,70" stroke="#00ffc8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="55" cy="225" r="18" fill="none" stroke="#7950f2" strokeWidth="4" />
            <path d="M 210,210 L 240,240 M 240,210 L 210,240" stroke="#00ffc8" strokeWidth="4" strokeLinecap="round" />
          </g>
        </g>

        {/* AI Minimax Telemetry Tags */}
        <g transform="translate(480, 40)">
          <rect width="125" height="30" rx="6" fill="rgba(0, 255, 200, 0.12)" stroke="#00ffc8" strokeWidth="1" />
          <text x="62.5" y="15" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="10" fontFamily="monospace" fontWeight="bold">MINIMAX // AI</text>
        </g>
      </svg>
    </div>
  );
};

export default MinimaxAiArt;
