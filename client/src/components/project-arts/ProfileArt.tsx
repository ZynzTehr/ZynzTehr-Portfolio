import React from 'react';

const ProfileArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="profGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#7950f2" />
          </linearGradient>

          <linearGradient id="profStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="100%" stopColor="#7950f2" />
          </linearGradient>

          <radialGradient id="profBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="60%" stopColor="#080b18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <filter id="profGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="profFillClip">
            <rect x="0" y="0" width="640" height="320" className="prof-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes profRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes profDraw {
            0% { stroke-dashoffset: 1500; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes rotateHud {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes counterRotateHud {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
          .prof-fill-rect {
            animation: profRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .prof-outline {
            stroke-dasharray: 1500;
            stroke-dashoffset: 1500;
            animation: profDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .hud-spin {
            transform-origin: 320px 160px;
            animation: rotateHud 25s infinite linear;
          }
          .hud-spin-reverse {
            transform-origin: 320px 160px;
            animation: counterRotateHud 18s infinite linear;
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#profBg)" />

        {/* Orbital HUD Rings */}
        <g className="hud-spin" opacity="0.25">
          <circle cx="320" cy="160" r="130" fill="none" stroke="#00ffc8" strokeWidth="1" strokeDasharray="8 6" />
          <circle cx="320" cy="160" r="145" fill="none" stroke="#7950f2" strokeWidth="1.5" strokeDasharray="30 40 10 40" />
        </g>

        <g className="hud-spin-reverse" opacity="0.3">
          <polygon
            points="320,50 415,105 415,215 320,270 225,215 225,105"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="12 8"
          />
        </g>

        {/* Central Developer Identity Hologram */}
        <g>
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#profFillClip)">
            {/* Core Hexagon Badge */}
            <polygon
              points="320,70 398,115 398,205 320,250 242,205 242,115"
              fill="url(#profGrad)"
              opacity="0.9"
            />
            
            {/* Inner Silhouette */}
            <circle cx="320" cy="140" r="28" fill="#060914" opacity="0.95" />
            <path d="M 285,210 C 285,178 355,178 355,210 Z" fill="#060914" opacity="0.95" />
            <path d="M 305,135 L 320,150 L 335,135" fill="none" stroke="#00ffc8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* OUTLINE LAYER */}
          <polygon
            points="320,70 398,115 398,205 320,250 242,205 242,115"
            fill="none"
            stroke="url(#profStroke)"
            strokeWidth="3.5"
            filter="url(#profGlow)"
            className="prof-outline"
          />

          {/* Core Avatar Outline */}
          <circle cx="320" cy="140" r="28" fill="none" stroke="#00ffc8" strokeWidth="2" />
          <path d="M 285,210 C 285,178 355,178 355,210" fill="none" stroke="#00ffc8" strokeWidth="2" />

          {/* Floating Data Satellites */}
          <g transform="translate(100, 140)">
            <rect width="105" height="34" rx="8" fill="rgba(0, 255, 200, 0.1)" stroke="#00ffc8" strokeWidth="1" />
            <text x="52.5" y="17" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="11" fontFamily="monospace" fontWeight="bold">FULL-STACK</text>
          </g>

          <g transform="translate(435, 140)">
            <rect width="105" height="34" rx="8" fill="rgba(121, 80, 242, 0.15)" stroke="#7950f2" strokeWidth="1" />
            <text x="52.5" y="17" textAnchor="middle" dominantBaseline="central" fill="#a78bfa" fontSize="11" fontFamily="monospace" fontWeight="bold">DEV // HUB</text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default ProfileArt;
