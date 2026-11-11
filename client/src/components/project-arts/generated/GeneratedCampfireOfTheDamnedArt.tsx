import React from "react";

const GeneratedCampfireOfTheDamnedArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="campfireofthedamnedGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3178c6" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>
          <radialGradient id="campfireofthedamnedBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>
          <filter id="campfireofthedamnedGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes campfireofthedamnedPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
          @keyframes campfireofthedamnedSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .campfireofthedamned-pulse { animation: campfireofthedamnedPulse 3s ease-in-out infinite; }
          .campfireofthedamned-spin { transform-origin: 320px 160px; animation: campfireofthedamnedSpin 20s linear infinite; }
        `}</style>

        <rect width="640" height="320" fill="url(#campfireofthedamnedBg)" />

        {/* Server Rack */}
        <rect
          x="120"
          y="80"
          width="120"
          height="160"
          rx="8"
          fill="none"
          stroke="#3178c6"
          strokeWidth="2"
          filter="url(#campfireofthedamnedGlow)"
        />
        <rect x="130" y="95" width="100" height="18" rx="3" fill="#3178c6" opacity="0.2" />
        <circle cx="215" cy="104" r="4" fill="#61dafb" className="campfireofthedamned-pulse" />
        <rect x="130" y="120" width="100" height="18" rx="3" fill="#3178c6" opacity="0.15" />
        <circle cx="215" cy="129" r="4" fill="#00d4ff" className="campfireofthedamned-pulse" />
        <rect x="130" y="145" width="100" height="18" rx="3" fill="#3178c6" opacity="0.1" />
        <circle cx="215" cy="154" r="4" fill="#3178c6" />
        <rect x="130" y="170" width="100" height="18" rx="3" fill="#3178c6" opacity="0.08" />

        {/* Database Cylinder */}
        <ellipse
          cx="480"
          cy="110"
          rx="60"
          ry="31"
          fill="#3178c6"
          opacity="0.15"
          stroke="#00d4ff"
          strokeWidth="1.5"
        />
        <rect
          x="420"
          y="110"
          width="120"
          height="100"
          fill="rgba(0,0,0,0.3)"
          stroke="#00d4ff"
          strokeWidth="1.5"
        />
        <ellipse
          cx="480"
          cy="210"
          rx="60"
          ry="31"
          fill="#3178c6"
          opacity="0.1"
          stroke="#00d4ff"
          strokeWidth="1.5"
        />
        <ellipse
          cx="480"
          cy="150"
          rx="60"
          ry="7"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="0.8"
          opacity="0.4"
        />

        {/* Connection Lines */}
        <line
          x1="240"
          y1="160"
          x2="420"
          y2="160"
          stroke="url(#campfireofthedamnedGrad)"
          strokeWidth="2"
          strokeDasharray="8 4"
          className="campfireofthedamned-pulse"
        />
        <circle
          cx="330"
          cy="160"
          r="6"
          fill="#61dafb"
          filter="url(#campfireofthedamnedGlow)"
          className="campfireofthedamned-pulse"
        />

        {/* Orbital Ring */}
        <g className="campfireofthedamned-spin" opacity="0.2">
          <circle
            cx="320"
            cy="160"
            r="140"
            fill="none"
            stroke="#61dafb"
            strokeWidth="1"
            strokeDasharray="6 8"
          />
        </g>

        {/* Title */}
        <text
          x="320"
          y="290"
          textAnchor="middle"
          fill="#61dafb"
          fontSize="13"
          fontFamily="monospace"
          opacity="0.7"
        >
          CAMPFIRE OF THE DAMNED
        </text>
      </svg>
    </div>
  );
};

export default GeneratedCampfireOfTheDamnedArt;
