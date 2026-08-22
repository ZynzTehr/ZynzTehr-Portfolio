import React from 'react';

const CapstoneArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="capGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7950f2" />
            <stop offset="50%" stopColor="#00ffc8" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <linearGradient id="capStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#7950f2" />
            <stop offset="100%" stopColor="#00ffc8" />
          </linearGradient>

          <radialGradient id="capBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="60%" stopColor="#070919" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <filter id="capGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="capFillClip">
            <rect x="0" y="0" width="640" height="320" className="cap-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes capRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes capDraw {
            0% { stroke-dashoffset: 1400; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes floatMsg {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes cursorBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .cap-fill-rect {
            animation: capRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .cap-outline {
            stroke-dasharray: 1400;
            stroke-dashoffset: 1400;
            animation: capDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .msg-1 { animation: floatMsg 4s infinite ease-in-out 0.2s; }
          .msg-2 { animation: floatMsg 4.5s infinite ease-in-out 1.2s; }
          .cursor-tag { animation: cursorBlink 1s infinite; }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#capBg)" />

        {/* Cyber Matrix Terminal Grid */}
        <g opacity="0.12" stroke="#00ffc8" strokeWidth="1">
          <line x1="80" y1="40" x2="560" y2="40" />
          <line x1="80" y1="120" x2="560" y2="120" />
          <line x1="80" y1="200" x2="560" y2="200" />
          <line x1="80" y1="280" x2="560" y2="280" />
          <line x1="160" y1="40" x2="160" y2="280" />
          <line x1="320" y1="40" x2="320" y2="280" />
          <line x1="480" y1="40" x2="480" y2="280" />
        </g>

        {/* Central Terminal Window & Interactive Word Elements */}
        <g transform="translate(70, 30)">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#capFillClip)">
            {/* Terminal Main Card */}
            <rect x="50" y="20" width="400" height="220" rx="16" fill="url(#capGrad)" opacity="0.85" />
            
            {/* User Profile Avatar Silhouette */}
            <circle cx="120" cy="90" r="32" fill="#070919" opacity="0.9" />
            <path d="M 95,150 C 95,125 145,125 145,150 Z" fill="#070919" opacity="0.9" />

            {/* Chat Bubble 1 */}
            <rect x="180" y="65" width="230" height="42" rx="10" fill="#070919" opacity="0.9" />
            <rect x="200" y="78" width="120" height="6" rx="3" fill="#00ffc8" opacity="0.8" />
            <rect x="200" y="90" width="80" height="6" rx="3" fill="#38bdf8" opacity="0.7" />

            {/* Chat Bubble 2 / Word Game Tag */}
            <rect x="180" y="125" width="200" height="42" rx="10" fill="#070919" opacity="0.9" />
            <rect x="200" y="138" width="140" height="6" rx="3" fill="#7950f2" opacity="0.8" />
            <rect x="200" y="150" width="95" height="6" rx="3" fill="#00ffc8" opacity="0.7" />

            {/* Shopping Cart / Interactive Checkout Tag */}
            <rect x="180" y="185" width="150" height="35" rx="8" fill="#070919" opacity="0.9" />
            <circle cx="210" cy="202" r="6" fill="#00ffc8" />
            <rect x="225" y="198" width="85" height="7" rx="3.5" fill="#ffffff" />
          </g>

          {/* OUTLINE LAYER */}
          <rect
            x="50"
            y="20"
            width="400"
            height="220"
            rx="16"
            fill="none"
            stroke="url(#capStroke)"
            strokeWidth="3"
            filter="url(#capGlow)"
            className="cap-outline"
          />

          {/* Terminal Header Dots */}
          <circle cx="75" cy="40" r="5" fill="#ff5f56" />
          <circle cx="92" cy="40" r="5" fill="#ffbd2e" />
          <circle cx="109" cy="40" r="5" fill="#27c93f" />

          {/* Avatar Outline */}
          <circle cx="120" cy="90" r="32" fill="none" stroke="#00ffc8" strokeWidth="2" />
          <path d="M 95,150 C 95,125 145,125 145,150" fill="none" stroke="#00ffc8" strokeWidth="2" />

          {/* Chat Bubble Outlines */}
          <rect x="180" y="65" width="230" height="42" rx="10" fill="none" stroke="#00ffc8" strokeWidth="1.5" className="msg-1" />
          <rect x="180" y="125" width="200" height="42" rx="10" fill="none" stroke="#7950f2" strokeWidth="1.5" className="msg-2" />
          <rect x="180" y="185" width="150" height="35" rx="8" fill="none" stroke="#00ffc8" strokeWidth="1.5" />

          {/* Floating Mad Libs Tags */}
          <g transform="translate(360, 175)">
            <rect width="80" height="26" rx="13" fill="rgba(0, 255, 200, 0.15)" stroke="#00ffc8" strokeWidth="1.2" />
            <text x="40" y="13" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="10" fontFamily="monospace" fontWeight="bold">&lt;PLAY/&gt;</text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default CapstoneArt;
