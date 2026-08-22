import React from 'react';

const BasicRpsArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="basicGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          <linearGradient id="basicStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <radialGradient id="basicBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#141824" />
            <stop offset="60%" stopColor="#070912" />
            <stop offset="100%" stopColor="#020206" />
          </radialGradient>

          <filter id="basicGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="basicFillClip">
            <rect x="0" y="0" width="640" height="320" className="basic-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes basicRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes basicDraw {
            0% { stroke-dashoffset: 1400; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes clashFist {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(18px); }
          }
          @keyframes clashFistRight {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(-18px); }
          }
          .basic-fill-rect {
            animation: basicRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .basic-outline {
            stroke-dasharray: 1400;
            stroke-dashoffset: 1400;
            animation: basicDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .hand-left { animation: clashFist 1.8s infinite ease-in-out; }
          .hand-right { animation: clashFistRight 1.8s infinite ease-in-out; }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#basicBg)" />

        {/* Clash Burst Sparks */}
        <g stroke="#00ffc8" strokeWidth="1.5" opacity="0.3">
          <line x1="320" y1="140" x2="320" y2="70" />
          <line x1="320" y1="140" x2="320" y2="210" />
          <line x1="320" y1="140" x2="250" y2="140" />
          <line x1="320" y1="140" x2="390" y2="140" />
        </g>

        {/* Dual Hands Clashing */}
        <g transform="translate(100, 20)">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#basicFillClip)">
            {/* Player Hand Left (Fist) */}
            <g className="hand-left">
              <rect x="50" y="95" width="130" height="85" rx="20" fill="url(#basicGrad)" opacity="0.85" />
              <circle cx="170" cy="115" r="16" fill="#070912" />
              <circle cx="170" cy="140" r="16" fill="#070912" />
              <circle cx="170" cy="165" r="16" fill="#070912" />
            </g>

            {/* AI Hand Right (Open Palm / Scissors) */}
            <g className="hand-right">
              <rect x="260" y="95" width="130" height="85" rx="20" fill="url(#basicGrad)" opacity="0.85" />
              <rect x="235" y="105" width="40" height="15" rx="7" fill="#070912" />
              <rect x="235" y="130" width="40" height="15" rx="7" fill="#070912" />
              <rect x="235" y="155" width="40" height="15" rx="7" fill="#070912" />
            </g>

            {/* Score Pill in Center */}
            <rect x="185" y="30" width="70" height="32" rx="16" fill="#070912" />
            <text x="198" y="52" fill="#00ffc8" fontSize="14" fontFamily="monospace" fontWeight="bold">1 : 0</text>
          </g>

          {/* OUTLINE LAYER */}
          <g className="basic-outline" filter="url(#basicGlow)">
            {/* Left Hand Outline */}
            <g className="hand-left">
              <rect x="50" y="95" width="130" height="85" rx="20" fill="none" stroke="#00ffc8" strokeWidth="3" />
            </g>

            {/* Right Hand Outline */}
            <g className="hand-right">
              <rect x="260" y="95" width="130" height="85" rx="20" fill="none" stroke="#ef4444" strokeWidth="3" />
            </g>

            {/* Score Outline */}
            <rect x="185" y="30" width="70" height="32" rx="16" fill="none" stroke="#38bdf8" strokeWidth="2" />
          </g>
        </g>

        {/* Vanilla JS RPS Tag */}
        <g transform="translate(255, 275)">
          <rect width="130" height="28" rx="6" fill="rgba(0, 255, 200, 0.15)" stroke="#00ffc8" strokeWidth="1.2" />
          <text x="65" y="14" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="10" fontFamily="monospace" fontWeight="bold">VANILLA JS // RPS</text>
        </g>
      </svg>
    </div>
  );
};

export default BasicRpsArt;
