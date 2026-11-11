import React from "react";

const GeneratedVscodeFxArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="vscodefxGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3178c6" />
            <stop offset="50%" stopColor="#61dafb" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>
          <radialGradient id="vscodefxBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>
          <filter id="vscodefxGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes vscodefxRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes vscodefxFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          .vscodefx-rotate { transform-origin: 320px 160px; animation: vscodefxRotate 15s linear infinite; }
          .vscodefx-float { animation: vscodefxFloat 4s ease-in-out infinite; }
        `}</style>

        <rect width="640" height="320" fill="url(#vscodefxBg)" />

        {/* Outer Orbit */}
        <g className="vscodefx-rotate" opacity="0.2">
          <circle
            cx="320"
            cy="160"
            r="130"
            fill="none"
            stroke="#61dafb"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <circle
            cx="320"
            cy="160"
            r="120"
            fill="none"
            stroke="#3178c6"
            strokeWidth="0.8"
            strokeDasharray="12 8"
          />
        </g>

        {/* Central Polyhedron */}
        <g className="vscodefx-float">
          <polygon
            points="320,68.01144811697837 399.32056399058786,114.20425102776115 405.1354524999919,209.15297641845092 320,248.14932980954148 245.70705034533594,202.89305448201165 244.54029816185468,116.43332083077789"
            fill="url(#vscodefxGrad)"
            opacity="0.2"
          />
          <polygon
            points="320,68.01144811697837 399.32056399058786,114.20425102776115 405.1354524999919,209.15297641845092 320,248.14932980954148 245.70705034533594,202.89305448201165 244.54029816185468,116.43332083077789"
            fill="none"
            stroke="url(#vscodefxGrad)"
            strokeWidth="2.5"
            filter="url(#vscodefxGlow)"
          />

          {/* Inner Triangulation Lines */}
          <line
            x1="320"
            y1="68.01144811697837"
            x2="320"
            y2="248.14932980954148"
            stroke="#61dafb"
            strokeWidth="0.8"
            opacity="0.3"
          />
          <line
            x1="399.32056399058786"
            y1="114.20425102776115"
            x2="245.70705034533594"
            y2="202.89305448201165"
            stroke="#3178c6"
            strokeWidth="0.8"
            opacity="0.3"
          />
          <line
            x1="405.1354524999919"
            y1="209.15297641845092"
            x2="244.54029816185468"
            y2="116.43332083077789"
            stroke="#00d4ff"
            strokeWidth="0.8"
            opacity="0.3"
          />

          {/* Center Core */}
          <circle
            cx="320"
            cy="160"
            r="12"
            fill="#61dafb"
            opacity="0.4"
            filter="url(#vscodefxGlow)"
          />
          <circle cx="320" cy="160" r="5" fill="#fff" opacity="0.9" />
        </g>

        {/* Floating Particles */}
        <circle cx="200" cy="99" r="3" fill="#61dafb" opacity="0.5" />
        <circle cx="457" cy="113" r="2" fill="#3178c6" opacity="0.6" />
        <circle cx="173" cy="246" r="2.5" fill="#00d4ff" opacity="0.4" />
        <circle cx="486" cy="235" r="3" fill="#61dafb" opacity="0.5" />

        {/* Title */}
        <text
          x="320"
          y="295"
          textAnchor="middle"
          fill="#61dafb"
          fontSize="13"
          fontFamily="monospace"
          opacity="0.7"
        >
          VSCODE FX
        </text>
      </svg>
    </div>
  );
};

export default GeneratedVscodeFxArt;
