import React from 'react';

const NextChapterArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ncGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>

          <linearGradient id="ncStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#00ffc8" />
          </linearGradient>

          <radialGradient id="ncBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#0b172a" />
            <stop offset="60%" stopColor="#050a14" />
            <stop offset="100%" stopColor="#010307" />
          </radialGradient>

          <filter id="ncGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="ncFillClip">
            <rect x="0" y="0" width="640" height="320" className="nc-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes ncRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes ncDraw {
            0% { stroke-dashoffset: 1500; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes beamUp {
            0%, 100% { opacity: 0.3; transform: scaleY(0.9); }
            50% { opacity: 0.8; transform: scaleY(1.1); }
          }
          .nc-fill-rect {
            animation: ncRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .nc-outline {
            stroke-dasharray: 1500;
            stroke-dashoffset: 1500;
            animation: ncDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .light-beam { transform-origin: 320px 240px; animation: beamUp 3s infinite ease-in-out; }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#ncBg)" />

        {/* Upward Futuristic Light Beams */}
        <g className="light-beam" opacity="0.4">
          <polygon points="320,240 220,20 420,20" fill="url(#ncGrad)" opacity="0.15" />
          <line x1="320" y1="240" x2="260" y2="20" stroke="#00ffc8" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="320" y1="240" x2="380" y2="20" stroke="#00ffc8" strokeWidth="1" strokeDasharray="6 6" />
        </g>

        {/* Luminous Open Book / Portal to the Next Chapter */}
        <g transform="translate(140, 30)">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#ncFillClip)">
            {/* Open Book Left Wing */}
            <path
              d="M 180,210
                 C 120,200 60,195 20,200
                 L 20,70
                 C 60,65 120,70 180,85 Z"
              fill="url(#ncGrad)"
              opacity="0.85"
            />

            {/* Open Book Right Wing */}
            <path
              d="M 180,210
                 C 240,200 300,195 340,200
                 L 340,70
                 C 300,65 240,70 180,85 Z"
              fill="url(#ncGrad)"
              opacity="0.85"
            />

            {/* Page Circuit Lines Inside Left */}
            <line x1="45" y1="105" x2="155" y2="115" stroke="#050a14" strokeWidth="5" strokeLinecap="round" />
            <line x1="45" y1="135" x2="155" y2="145" stroke="#050a14" strokeWidth="5" strokeLinecap="round" />
            <line x1="45" y1="165" x2="125" y2="175" stroke="#050a14" strokeWidth="5" strokeLinecap="round" />

            {/* Page Circuit Lines Inside Right */}
            <line x1="205" y1="115" x2="315" y2="105" stroke="#050a14" strokeWidth="5" strokeLinecap="round" />
            <line x1="205" y1="145" x2="315" y2="135" stroke="#050a14" strokeWidth="5" strokeLinecap="round" />
            <line x1="205" y1="175" x2="285" y2="165" stroke="#050a14" strokeWidth="5" strokeLinecap="round" />

            {/* Radiant Chapter Sun Core */}
            <circle cx="180" cy="65" r="24" fill="#00ffc8" opacity="0.9" />
          </g>

          {/* OUTLINE LAYER */}
          <g className="nc-outline" filter="url(#ncGlow)">
            {/* Book Spine & Outer Wings Outline */}
            <path
              d="M 20,70
                 C 60,65 120,70 180,85
                 C 240,70 300,65 340,70
                 L 340,200
                 C 300,195 240,200 180,210
                 C 120,200 60,195 20,200 Z"
              fill="none"
              stroke="url(#ncStroke)"
              strokeWidth="3.5"
            />
            <line x1="180" y1="85" x2="180" y2="210" stroke="#00ffc8" strokeWidth="3" />
            
            {/* Sun Core Outline */}
            <circle cx="180" cy="65" r="24" fill="none" stroke="#ffffff" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default NextChapterArt;
