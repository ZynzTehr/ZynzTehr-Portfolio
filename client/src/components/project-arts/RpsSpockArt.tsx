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
              opacity="0.3"
            />

            {/* Node 1: Rock (Top - 320, 50) */}
            <circle cx="320" cy="50" r="28" fill="url(#spockGrad)" opacity="0.9" />
            <circle cx="320" cy="50" r="22" fill="#0a0510" />

            {/* Node 2: Paper (Top-Right - 415, 119) */}
            <circle cx="415" cy="119" r="28" fill="url(#spockGrad)" opacity="0.9" />
            <circle cx="415" cy="119" r="22" fill="#0a0510" />

            {/* Node 3: Scissors (Bottom-Right - 379, 230) */}
            <circle cx="379" cy="230" r="28" fill="url(#spockGrad)" opacity="0.9" />
            <circle cx="379" cy="230" r="22" fill="#0a0510" />

            {/* Node 4: Lizard (Bottom-Left - 261, 230) */}
            <circle cx="261" cy="230" r="28" fill="url(#spockGrad)" opacity="0.9" />
            <circle cx="261" cy="230" r="22" fill="#0a0510" />

            {/* Node 5: Spock (Top-Left - 225, 119) */}
            <circle cx="225" cy="119" r="28" fill="url(#spockGrad)" opacity="0.9" />
            <circle cx="225" cy="119" r="22" fill="#0a0510" />

            {/* Vulcan Spock Salute in Center */}
            <text x="306" y="158" fill="#00ffc8" fontSize="30">🖖</text>
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
