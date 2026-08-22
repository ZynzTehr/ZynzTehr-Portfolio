import React from 'react';

const TlmRedesignArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tlmGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#00ffc8" />
          </linearGradient>

          <linearGradient id="tlmStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#00ffc8" />
          </linearGradient>

          <radialGradient id="tlmBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#1e1018" />
            <stop offset="60%" stopColor="#0b060d" />
            <stop offset="100%" stopColor="#020108" />
          </radialGradient>

          <filter id="tlmGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="tlmFillClip">
            <rect x="0" y="0" width="640" height="320" className="tlm-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes tlmRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes tlmDraw {
            0% { stroke-dashoffset: 1500; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes cursorMove {
            0% { transform: translate(0px, 0px); }
            50% { transform: translate(120px, 80px); }
            100% { transform: translate(0px, 0px); }
          }
          .tlm-fill-rect {
            animation: tlmRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .tlm-outline {
            stroke-dasharray: 1500;
            stroke-dashoffset: 1500;
            animation: tlmDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .cursor-anim { animation: cursorMove 4s infinite ease-in-out; }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#tlmBg)" />

        {/* Golden Ratio Symmetry Lines */}
        <g stroke="#f43f5e" strokeWidth="1" opacity="0.15">
          <line x1="80" y1="50" x2="560" y2="50" />
          <line x1="80" y1="260" x2="560" y2="260" />
          <line x1="200" y1="50" x2="200" y2="260" />
          <line x1="440" y1="50" x2="440" y2="260" />
        </g>

        {/* Browser Wireframe & Layout Symmetry */}
        <g transform="translate(100, 30)">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#tlmFillClip)">
            {/* Main Browser Window */}
            <rect x="20" y="15" width="400" height="210" rx="14" fill="url(#tlmGrad)" opacity="0.85" />
            
            {/* Header Hero Section */}
            <rect x="35" y="45" width="370" height="65" rx="8" fill="#0b060d" opacity="0.9" />
            <rect x="50" y="60" width="130" height="10" rx="5" fill="#00ffc8" />
            <rect x="50" y="78" width="80" height="8" rx="4" fill="#fb923c" />

            {/* Symmetrical Columns */}
            <rect x="35" y="122" width="115" height="90" rx="6" fill="#0b060d" opacity="0.9" />
            <rect x="162" y="122" width="115" height="90" rx="6" fill="#0b060d" opacity="0.9" />
            <rect x="290" y="122" width="115" height="90" rx="6" fill="#0b060d" opacity="0.9" />
          </g>

          {/* OUTLINE LAYER */}
          <g className="tlm-outline" filter="url(#tlmGlow)">
            {/* Browser Outer Shell */}
            <rect x="20" y="15" width="400" height="210" rx="14" fill="none" stroke="url(#tlmStroke)" strokeWidth="3" />
            
            {/* Header Window Dots */}
            <circle cx="40" cy="30" r="4" fill="#f43f5e" />
            <circle cx="54" cy="30" r="4" fill="#fb923c" />
            <circle cx="68" cy="30" r="4" fill="#00ffc8" />

            {/* Column Outlines */}
            <rect x="35" y="122" width="115" height="90" rx="6" fill="none" stroke="#00ffc8" strokeWidth="1.5" />
            <rect x="162" y="122" width="115" height="90" rx="6" fill="none" stroke="#fb923c" strokeWidth="1.5" />
            <rect x="290" y="122" width="115" height="90" rx="6" fill="none" stroke="#00ffc8" strokeWidth="1.5" />
          </g>

          {/* Interactive Custom Resizing Cursor Easter Egg */}
          <g className="cursor-anim" transform="translate(180, 80)">
            <path
              d="M 0,0 L 18,18 L 11,20 L 15,30 L 10,32 L 6,22 L 0,27 Z"
              fill="#00ffc8"
              stroke="#ffffff"
              strokeWidth="1.5"
              filter="url(#tlmGlow)"
            />
          </g>
        </g>

        {/* TLM Redesign Tag */}
        <g transform="translate(255, 275)">
          <rect width="130" height="28" rx="6" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" strokeWidth="1.2" />
          <text x="65" y="14" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="10" fontFamily="monospace" fontWeight="bold">TLM // REDESIGN</text>
        </g>
      </svg>
    </div>
  );
};

export default TlmRedesignArt;
