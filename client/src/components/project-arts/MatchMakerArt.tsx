import React from 'react';

const MatchMakerArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="matchGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#7950f2" />
            <stop offset="100%" stopColor="#00ffc8" />
          </linearGradient>

          <linearGradient id="matchStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#00ffc8" />
            <stop offset="100%" stopColor="#7950f2" />
          </linearGradient>

          <radialGradient id="matchBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#1e1026" />
            <stop offset="60%" stopColor="#090614" />
            <stop offset="100%" stopColor="#020108" />
          </radialGradient>

          <filter id="matchGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="matchFillClip">
            <rect x="0" y="0" width="640" height="320" className="match-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes matchRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes matchDraw {
            0% { stroke-dashoffset: 1400; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes pulseHeart {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
          @keyframes sonarWave {
            0% { r: 40px; opacity: 0.8; }
            100% { r: 160px; opacity: 0; }
          }
          .match-fill-rect {
            animation: matchRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .match-outline {
            stroke-dasharray: 1400;
            stroke-dashoffset: 1400;
            animation: matchDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .sonar-1 { animation: sonarWave 3s infinite ease-out; }
          .sonar-2 { animation: sonarWave 3s infinite ease-out 1.5s; }
          .heartbeat { transform-origin: 320px 150px; animation: pulseHeart 2s infinite ease-in-out; }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#matchBg)" />

        {/* Sonar Compatibility Rings */}
        <g fill="none" stroke="#ec4899" strokeWidth="1.5">
          <circle cx="320" cy="150" r="40" className="sonar-1" />
          <circle cx="320" cy="150" r="40" className="sonar-2" />
        </g>

        {/* Dual Interconnecting Heart Constellation */}
        <g className="heartbeat">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#matchFillClip)">
            {/* Left Node Profile Card */}
            <circle cx="190" cy="150" r="55" fill="url(#matchGrad)" opacity="0.85" />
            <circle cx="190" cy="135" r="18" fill="#090614" />
            <path d="M 165,180 C 165,160 215,160 215,180 Z" fill="#090614" />

            {/* Right Node Profile Card */}
            <circle cx="450" cy="150" r="55" fill="url(#matchGrad)" opacity="0.85" />
            <circle cx="450" cy="135" r="18" fill="#090614" />
            <path d="M 425,180 C 425,160 475,160 475,180 Z" fill="#090614" />

            {/* Central Holographic Heart Core */}
            <path
              d="M 320,130
                 C 320,110 290,95 270,115
                 C 250,135 270,170 320,200
                 C 370,170 390,135 370,115
                 C 350,95 320,110 320,130 Z"
              fill="url(#matchGrad)"
              opacity="0.9"
            />
          </g>

          {/* OUTLINE LAYER */}
          <g className="match-outline" filter="url(#matchGlow)">
            {/* Connection Bridge Heartbeat Waveform */}
            <path
              d="M 190,150 L 250,150 L 265,130 L 280,170 L 295,140 L 310,160 L 325,150 L 375,150 L 450,150"
              fill="none"
              stroke="url(#matchStroke)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Left Node Outline */}
            <circle cx="190" cy="150" r="55" fill="none" stroke="#00ffc8" strokeWidth="3" />
            
            {/* Right Node Outline */}
            <circle cx="450" cy="150" r="55" fill="none" stroke="#ec4899" strokeWidth="3" />

            {/* Central Heart Outline */}
            <path
              d="M 320,130
                 C 320,110 290,95 270,115
                 C 250,135 270,170 320,200
                 C 370,170 390,135 370,115
                 C 350,95 320,110 320,130 Z"
              fill="none"
              stroke="url(#matchStroke)"
              strokeWidth="3"
            />
          </g>
        </g>

        {/* Compatibility Match Tag */}
        <g transform="translate(255, 240)">
          <rect width="130" height="30" rx="15" fill="rgba(236, 72, 153, 0.15)" stroke="#ec4899" strokeWidth="1.2" />
          <text x="65" y="15" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="11" fontFamily="monospace" fontWeight="bold">98% // MATCH</text>
        </g>
      </svg>
    </div>
  );
};

export default MatchMakerArt;
