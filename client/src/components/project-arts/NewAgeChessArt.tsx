import React from 'react';

const NewAgeChessArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="chessGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>

          <linearGradient id="chessStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#00f5ff" />
          </linearGradient>

          <linearGradient id="chessGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          <radialGradient id="chessBg" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#0b1126" />
            <stop offset="55%" stopColor="#050816" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <radialGradient id="radarScanGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0, 245, 255, 0.25)" />
            <stop offset="70%" stopColor="rgba(0, 245, 255, 0.05)" />
            <stop offset="100%" stopColor="rgba(0, 245, 255, 0)" />
          </radialGradient>

          <filter id="chessGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="chessFillClip">
            <rect x="0" y="0" width="640" height="320" className="chess-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes chessRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes chessDraw {
            0% { stroke-dashoffset: 1400; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes radarSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulseThreat {
            0%, 100% { opacity: 0.3; transform: scale(0.98); }
            50% { opacity: 0.85; transform: scale(1.02); }
          }
          @keyframes knightGleam {
            0%, 100% { filter: drop-shadow(0 0 6px rgba(0, 245, 255, 0.4)); }
            50% { filter: drop-shadow(0 0 16px rgba(217, 70, 239, 0.8)); }
          }
          .chess-fill-rect {
            animation: chessRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .chess-outline {
            stroke-dasharray: 1400;
            stroke-dashoffset: 1400;
            animation: chessDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .radar-sweeper {
            transform-origin: 320px 160px;
            animation: radarSpin 7s linear infinite;
          }
          .threat-pulse {
            transform-origin: 320px 160px;
            animation: pulseThreat 2.5s infinite ease-in-out;
          }
          .knight-gleam {
            animation: knightGleam 3s infinite ease-in-out;
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#chessBg)" />

        {/* Radar Tactical Circles & Crosshairs */}
        <g stroke="#00f5ff" strokeWidth="0.8" opacity="0.2">
          <circle cx="320" cy="160" r="130" fill="none" strokeDasharray="4 6" />
          <circle cx="320" cy="160" r="95" fill="none" />
          <circle cx="320" cy="160" r="50" fill="none" strokeDasharray="3 3" />
          <line x1="170" y1="160" x2="470" y2="160" strokeDasharray="4 4" />
          <line x1="320" y1="20" x2="320" y2="300" strokeDasharray="4 4" />
        </g>

        {/* Tactical Radar Sweep Cone */}
        <g className="radar-sweeper">
          <path
            d="M 320,160 L 440,100 A 130 130 0 0 1 450,160 Z"
            fill="url(#radarScanGrad)"
          />
        </g>

        {/* Isometric Cyber Chessboard & Knight Composition */}
        <g transform="translate(320, 160)">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#chessFillClip)">
            {/* Isometric Chess Grid Base Plate */}
            {/* Row 1 (Top) */}
            <path d="M 0,-85 L 35,-68 L 0,-50 L -35,-68 Z" fill="url(#chessGrad)" opacity="0.2" />
            <path d="M 35,-68 L 70,-50 L 35,-33 L 0,-50 Z" fill="url(#chessGrad)" opacity="0.6" />
            <path d="M -35,-68 L 0,-50 L -35,-33 L -70,-50 Z" fill="url(#chessGrad)" opacity="0.6" />
            <path d="M 70,-50 L 105,-33 L 70,-15 L 35,-33 Z" fill="url(#chessGrad)" opacity="0.2" />
            <path d="M -70,-50 L -35,-33 L -70,-15 L -105,-33 Z" fill="url(#chessGrad)" opacity="0.2" />

            {/* Row 2 */}
            <path d="M 0,-50 L 35,-33 L 0,-15 L -35,-33 Z" fill="url(#chessGrad)" opacity="0.75" />
            <path d="M 35,-33 L 70,-15 L 35,3 L 0,-15 Z" fill="url(#chessGrad)" opacity="0.2" />
            <path d="M -35,-33 L 0,-15 L -35,3 L -70,-15 Z" fill="url(#chessGrad)" opacity="0.2" />
            <path d="M 70,-15 L 105,3 L 70,20 L 35,3 Z" fill="url(#chessGrad)" opacity="0.75" />
            <path d="M -70,-15 L -35,3 L -70,20 L -105,3 Z" fill="url(#chessGrad)" opacity="0.75" />

            {/* Row 3 (Center Row) */}
            <path d="M 0,-15 L 35,3 L 0,20 L -35,3 Z" fill="url(#chessGrad)" opacity="0.3" />
            <path d="M 35,3 L 70,20 L 35,38 L 0,20 Z" fill="url(#chessGrad)" opacity="0.8" />
            <path d="M -35,3 L 0,20 L -35,38 L -70,20 Z" fill="url(#chessGrad)" opacity="0.8" />
            <path d="M 70,20 L 105,38 L 70,55 L 35,38 Z" fill="url(#chessGrad)" opacity="0.3" />
            <path d="M -70,20 L -35,38 L -70,55 L -105,38 Z" fill="url(#chessGrad)" opacity="0.3" />

            {/* Row 4 (Front Row) */}
            <path d="M 0,20 L 35,38 L 0,55 L -35,38 Z" fill="url(#chessGrad)" opacity="0.7" />
            <path d="M 35,38 L 70,55 L 35,73 L 0,55 Z" fill="url(#chessGrad)" opacity="0.25" />
            <path d="M -35,38 L 0,55 L -35,73 L -70,55 Z" fill="url(#chessGrad)" opacity="0.25" />

            {/* Threat Area Glow Polygon */}
            <polygon
              points="0,-15 70,-15 35,38 -35,3"
              fill="rgba(217, 70, 239, 0.25)"
              className="threat-pulse"
            />

            {/* Cyber Knight Piece Silhouette & Facets */}
            <g transform="translate(0, -25)" className="knight-gleam">
              {/* Base Pedestal */}
              <path d="M -30,45 L 30,45 L 20,35 L -20,35 Z" fill="#040817" stroke="#00f5ff" strokeWidth="1.5" />
              <path d="M -22,35 L 22,35 L 18,22 L -18,22 Z" fill="url(#chessGrad)" opacity="0.8" />
              
              {/* Knight Torso & Mane Silhouette */}
              <path
                d="M -18,22
                   C -22,10 -25,-10 -15,-30
                   C -10,-40 -2,-48 8,-54
                   C 14,-46 16,-38 14,-32
                   C 26,-36 28,-22 18,-14
                   C 22,-8 20,4 12,12
                   C 16,16 18,19 18,22
                   Z"
                fill="#050a1f"
              />

              {/* Knight Facet Highlights */}
              <path
                d="M -15,-30 L 4,-34 L 14,-32 L 8,-20 L -6,-15 Z"
                fill="url(#chessGrad)"
                opacity="0.9"
              />
              <path
                d="M 8,-20 L 18,-14 L 12,12 L -2,8 Z"
                fill="url(#chessGrad)"
                opacity="0.65"
              />
              <circle cx="2" cy="-36" r="3" fill="#00f5ff" />

              {/* Holographic Crown / Neural Nodes floating above */}
              <polygon points="0,-68 4,-60 8,-68 0,-62 -8,-68 -4,-60" fill="url(#chessGold)" />
              <circle cx="0" cy="-72" r="2.5" fill="#fbbf24" />
            </g>
          </g>

          {/* OUTLINE LAYER */}
          <g className="chess-outline" filter="url(#chessGlow)">
            {/* Major Perimeter Lines */}
            <polygon
              points="0,-85 105,-33 70,55 0,90 -70,55 -105,-33"
              fill="none"
              stroke="url(#chessStroke)"
              strokeWidth="2.5"
            />
            {/* Main Center Coordinate Cross */}
            <line x1="0" y1="-85" x2="0" y2="90" stroke="#00f5ff" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="-105" y1="-33" x2="105" y2="38" stroke="#00f5ff" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Glowing Knight Contour */}
            <path
              d="M -18,-3
                 C -22,-15 -25,-35 -15,-55
                 C -10,-65 -2,-73 8,-79
                 C 14,-71 16,-63 14,-57
                 C 26,-61 28,-47 18,-39
                 C 22,-33 20,-21 12,-13
                 C 16,-9 18,-6 18,-3"
              fill="none"
              stroke="#00f5ff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Top Left AI Telemetry */}
        <g transform="translate(30, 30)">
          <text x="0" y="0" fill="#00f5ff" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.9">
            RADAR // THREAT MATRIX
          </text>
          <text x="0" y="16" fill="#a855f7" fontSize="9" fontFamily="monospace" opacity="0.75">
            ENGINE: STOCKFISH 17 [2450 ELO]
          </text>
        </g>

        {/* Badge Bottom Center */}
        <g transform="translate(235, 275)">
          <rect width="170" height="28" rx="6" fill="rgba(0, 245, 255, 0.12)" stroke="#00f5ff" strokeWidth="1.2" />
          <text x="85" y="14" textAnchor="middle" dominantBaseline="central" fill="#00f5ff" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
            NEURAL // CHESS ARENA
          </text>
        </g>
      </svg>
    </div>
  );
};

export default NewAgeChessArt;
