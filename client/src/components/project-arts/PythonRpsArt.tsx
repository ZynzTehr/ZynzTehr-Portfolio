import React from 'react';

const PythonRpsArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pyGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3776ab" />
            <stop offset="50%" stopColor="#ffd43b" />
            <stop offset="100%" stopColor="#00ffc8" />
          </linearGradient>

          <linearGradient id="pyStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd43b" />
            <stop offset="50%" stopColor="#3776ab" />
            <stop offset="100%" stopColor="#00ffc8" />
          </linearGradient>

          <radialGradient id="pyBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#101d2d" />
            <stop offset="60%" stopColor="#080e17" />
            <stop offset="100%" stopColor="#020306" />
          </radialGradient>

          <filter id="pyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="pyFillClip">
            <rect x="0" y="0" width="640" height="320" className="py-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes pyRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes pyDraw {
            0% { stroke-dashoffset: 1500; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          .py-fill-rect {
            animation: pyRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .py-outline {
            stroke-dasharray: 1500;
            stroke-dashoffset: 1500;
            animation: pyDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#pyBg)" />

        {/* Python Binary Matrix Terminal */}
        <g opacity="0.12" stroke="#3776ab" strokeWidth="1">
          <line x1="60" y1="50" x2="580" y2="50" />
          <line x1="60" y1="160" x2="580" y2="160" />
          <line x1="60" y1="270" x2="580" y2="270" />
        </g>

        {/* Python Serpent & CLI Terminal */}
        <g transform="translate(140, 20)">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#pyFillClip)">
            {/* Terminal Window Card */}
            <rect x="20" y="20" width="320" height="210" rx="14" fill="#080e17" opacity="0.95" />

            {/* Python Serpent Upper (Yellow) */}
            <path
              d="M 120,40
                 C 90,40 70,60 70,90
                 L 70,110
                 L 140,110
                 L 140,130
                 L 40,130
                 C 20,130 0,110 0,80
                 L 0,60
                 C 0,30 20,10 50,10
                 L 110,10
                 C 140,10 160,30 160,60
                 L 160,70
                 L 120,70
                 L 120,40 Z"
              fill="#ffd43b"
              transform="translate(100, 30)"
              opacity="0.9"
            />
            <circle cx="150" cy="55" r="4" fill="#080e17" />

            {/* Python Serpent Lower (Blue) */}
            <path
              d="M 40,120
                 C 70,120 90,100 90,70
                 L 90,50
                 L 20,50
                 L 20,30
                 L 120,30
                 C 140,30 160,50 160,80
                 L 160,100
                 C 160,130 140,150 110,150
                 L 50,150
                 C 20,150 0,130 0,100
                 L 0,90
                 L 40,90
                 L 40,120 Z"
              fill="#3776ab"
              transform="translate(100, 30)"
              opacity="0.9"
            />
            <circle cx="210" cy="155" r="4" fill="#080e17" />

            {/* CLI Prompt >> */}
            <text x="40" y="205" fill="#00ffc8" fontSize="16" fontFamily="monospace" fontWeight="bold">&gt;&gt;&gt; def play_rps():</text>
          </g>

          {/* OUTLINE LAYER */}
          <g className="py-outline" filter="url(#pyGlow)">
            {/* Terminal Outline */}
            <rect x="20" y="20" width="320" height="210" rx="14" fill="none" stroke="url(#pyStroke)" strokeWidth="3" />
            
            {/* Terminal Header Dots */}
            <circle cx="42" cy="38" r="4" fill="#ff5f56" />
            <circle cx="56" cy="38" r="4" fill="#ffd43b" />
            <circle cx="70" cy="38" r="4" fill="#27c93f" />

            {/* Glowing Python Serpents Outline */}
            <g transform="translate(100, 30)">
              <path
                d="M 120,40 C 90,40 70,60 70,90 L 70,110 L 140,110 L 140,130 L 40,130 C 20,130 0,110 0,80 L 0,60 C 0,30 20,10 50,10 L 110,10 C 140,10 160,30 160,60 L 160,70 L 120,70 L 120,40 Z"
                fill="none"
                stroke="#ffd43b"
                strokeWidth="2"
              />
              <path
                d="M 40,120 C 70,120 90,100 90,70 L 90,50 L 20,50 L 20,30 L 120,30 C 140,30 160,50 160,80 L 160,100 C 160,130 140,150 110,150 L 50,150 C 20,150 0,130 0,100 L 0,90 L 40,90 L 40,120 Z"
                fill="none"
                stroke="#3776ab"
                strokeWidth="2"
              />
            </g>
          </g>
        </g>

        {/* Python CLI Game Tag */}
        <g transform="translate(250, 275)">
          <rect width="140" height="28" rx="6" fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth="1.2" />
          <text x="70" y="14" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="10" fontFamily="monospace" fontWeight="bold">PYTHON // CLI GAME</text>
        </g>
      </svg>
    </div>
  );
};

export default PythonRpsArt;
