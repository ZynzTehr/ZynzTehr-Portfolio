import React from 'react';

const RpsSpockArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="spockGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#00ffc8" />
          </linearGradient>

          <linearGradient id="spockStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>

          <radialGradient id="spockBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#170d24" />
            <stop offset="60%" stopColor="#0a0510" />
            <stop offset="100%" stopColor="#020108" />
          </radialGradient>

          <filter id="spockGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="spockFillClip">
            <rect x="0" y="0" width="640" height="320" className="spock-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes spockRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes spockDraw {
            0% { stroke-dashoffset: 1600; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes pulsePentagon {
            0%, 100% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(2deg) scale(1.02); }
          }
          .spock-fill-rect {
            animation: spockRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .spock-outline {
            stroke-dasharray: 1600;
            stroke-dashoffset: 1600;
            animation: spockDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .pentagon-group { transform-origin: 320px 145px; animation: pulsePentagon 6s infinite ease-in-out; }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#spockBg)" />

        {/* 5-Point Sacred Pentagon Orbital Network */}
        <g className="pentagon-group">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#spockFillClip)">
            {/* Center Pentagon Hub */}
            <polygon
              points="320,50 415,119 379,230 261,230 225,119"
              fill="url(#spockGrad)"
              opacity="0.2"
            />

            {/* Node 1: Rock (Top - 320, 50) */}
            <g>
              <circle cx="320" cy="50" r="28" fill="url(#spockGrad)" opacity="0.9" />
              <circle cx="320" cy="50" r="22" fill="#0a0510" />
              {/* Faceted Rock Glyph */}
              <polygon points="320,38 330,44 333,52 328,60 320,63 312,60 307,52 310,44" fill="#00d8ff" opacity="0.85" />
              <polygon points="320,38 320,50 330,44" fill="rgba(255,255,255,0.4)" />
              <polygon points="330,44 320,50 333,52" fill="rgba(0,140,255,0.5)" />
              <polygon points="333,52 320,50 328,60" fill="rgba(0,50,150,0.7)" />
              <polygon points="328,60 320,50 320,63" fill="rgba(0,20,100,0.9)" />
              <polygon points="320,63 320,50 312,60" fill="rgba(0,50,150,0.7)" />
              <polygon points="312,60 320,50 307,52" fill="rgba(0,140,255,0.5)" />
              <polygon points="307,52 320,50 310,44" fill="rgba(0,200,255,0.4)" />
              <polygon points="310,44 320,50 320,38" fill="rgba(255,255,255,0.4)" />
              <circle cx="320" cy="50" r="2" fill="#ffffff" />
            </g>

            {/* Node 2: Paper (Top-Right - 415, 119) */}
            <g>
              <circle cx="415" cy="119" r="28" fill="url(#spockGrad)" opacity="0.9" />
              <circle cx="415" cy="119" r="22" fill="#0a0510" />
              {/* Holographic Circuit Sheet Glyph */}
              <path d="M 406,108 A 2 2 0 0 1 408,106 L 420,106 L 425,111 L 425,130 A 2 2 0 0 1 423,132 L 408,132 A 2 2 0 0 1 406,130 Z" fill="#00ffc8" opacity="0.85" />
              <polygon points="420,106 420,111 425,111" fill="#ffffff" />
              <line x1="410" y1="115" x2="419" y2="115" stroke="#0a0510" strokeWidth="1.2" />
              <line x1="410" y1="120" x2="421" y2="120" stroke="#0a0510" strokeWidth="1.2" />
              <line x1="410" y1="125" x2="418" y2="125" stroke="#0a0510" strokeWidth="1.2" />
            </g>

            {/* Node 3: Scissors (Bottom-Right - 379, 230) */}
            <g>
              <circle cx="379" cy="230" r="28" fill="url(#spockGrad)" opacity="0.9" />
              <circle cx="379" cy="230" r="22" fill="#0a0510" />
              {/* Crossed Shears Glyph */}
              <path d="M 371,219 L 378,228 L 382,234 L 386,240 A 3 3 0 1 1 382,244 L 377,236 L 375,228 L 373,221 Z" fill="#ef4444" opacity="0.9" />
              <path d="M 387,219 L 380,228 L 376,234 L 372,240 A 3 3 0 1 0 376,244 L 381,236 L 383,228 L 385,221 Z" fill="#ef4444" opacity="0.9" />
              <circle cx="379" cy="230" r="2.5" fill="#ffffff" />
            </g>

            {/* Node 4: Lizard (Bottom-Left - 261, 230) */}
            <g>
              <circle cx="261" cy="230" r="28" fill="url(#spockGrad)" opacity="0.9" />
              <circle cx="261" cy="230" r="22" fill="#0a0510" />
              {/* Cyber Lizard Head Glyph */}
              <path
                d="M 252,234 L 268,223 L 273,227 L 271,235 L 263,238 L 253,237 Z"
                fill="#10b981"
                opacity="0.9"
              />
              <circle cx="266" cy="226" r="1.5" fill="#ffffff" />
              <line x1="258" y1="235" x2="265" y2="231" stroke="#0a0510" strokeWidth="1.2" />
            </g>

            {/* Node 5: Spock (Top-Left - 225, 119) */}
            <g>
              <circle cx="225" cy="119" r="28" fill="url(#spockGrad)" opacity="0.9" />
              <circle cx="225" cy="119" r="22" fill="#0a0510" />
              {/* Mini Vulcan Salute Glyph */}
              <path d="M 221,114 L 222,106 A 1.5 1.5 0 0 1 225,106 L 226,114 Z" fill="#c084fc" />
              <path d="M 228,114 L 229,106 A 1.5 1.5 0 0 1 232,106 L 233,114 Z" fill="#c084fc" />
              <path d="M 220,114 L 223,124 L 231,124 L 234,114 Z" fill="#c084fc" />
              <path d="M 220,117 L 216,114 L 220,114 Z" fill="#c084fc" />
              <circle cx="227" cy="119" r="1.5" fill="#ffffff" />
            </g>

            {/* Custom Centerpiece: Full Vulcan Spock Hand Salute Vector in Center */}
            <g transform="translate(303, 120)" id="center-vulcan-salute">
              {/* Cyber Gauntlet Palm */}
              <path
                d="M 6,28 L 9,44 A 4 4 0 0 0 13,47 L 21,47 A 4 4 0 0 0 25,44 L 28,28 Z"
                fill="url(#spockGrad)"
                opacity="0.85"
              />
              {/* Articulated Thumb (Left) */}
              <path d="M 6,28 L -3,22 A 2.5 2.5 0 0 1 0,18 L 8,24 Z" fill="url(#spockGrad)" opacity="0.9" />
              {/* Finger Group 1 (Index & Middle) */}
              <path d="M 8,24 L 10,4 A 2.5 2.5 0 0 1 15,4 L 16,24 Z" fill="url(#spockGrad)" opacity="0.95" />
              {/* Finger Group 2 (Ring & Pinky) with iconic V-split */}
              <path d="M 18,24 L 19,4 A 2.5 2.5 0 0 1 24,4 L 26,24 Z" fill="url(#spockGrad)" opacity="0.95" />
              {/* Starfleet Delta Chevron in Center of Palm */}
              <path d="M 17,32 L 12,43 L 17,40 L 22,43 Z" fill="#ffffff" />
              {/* Finger Joint Neon Highlights */}
              <line x1="10" y1="12" x2="15" y2="12" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
              <line x1="19" y1="12" x2="24" y2="12" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
            </g>
          </g>

          {/* OUTLINE LAYER */}
          <g className="spock-outline" filter="url(#spockGlow)">
            {/* Pentagon Perimeter Lines */}
            <polygon
              points="320,50 415,119 379,230 261,230 225,119"
              fill="none"
              stroke="url(#spockStroke)"
              strokeWidth="2.5"
            />

            {/* Inner Star Connector Lines */}
            <polygon
              points="320,50 379,230 225,119 415,119 261,230"
              fill="none"
              stroke="url(#spockStroke)"
              strokeWidth="1.5"
              opacity="0.6"
            />

            {/* Node Rings */}
            <circle cx="320" cy="50" r="28" fill="none" stroke="#ec4899" strokeWidth="2.5" />
            <circle cx="415" cy="119" r="28" fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
            <circle cx="379" cy="230" r="28" fill="none" stroke="#00ffc8" strokeWidth="2.5" />
            <circle cx="261" cy="230" r="28" fill="none" stroke="#ec4899" strokeWidth="2.5" />
            <circle cx="225" cy="119" r="28" fill="none" stroke="#00ffc8" strokeWidth="2.5" />
          </g>
        </g>

        {/* 5-Way Game Tag */}
        <g transform="translate(255, 275)">
          <rect width="130" height="28" rx="6" fill="rgba(139, 92, 246, 0.15)" stroke="#8b5cf6" strokeWidth="1.2" />
          <text x="65" y="14" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="10" fontFamily="monospace" fontWeight="bold">5-WAY // RPS</text>
        </g>
      </svg>
    </div>
  );
};

export default RpsSpockArt;
