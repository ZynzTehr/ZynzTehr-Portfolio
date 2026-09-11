import React from 'react';

const CountdownTimerArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="timerGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>

          <linearGradient id="timerStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          <linearGradient id="cardGradTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e2438" />
            <stop offset="100%" stopColor="#121727" />
          </linearGradient>

          <linearGradient id="cardGradBottom" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0d111d" />
            <stop offset="100%" stopColor="#151b2c" />
          </linearGradient>

          <linearGradient id="flipSheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(251, 191, 36, 0.4)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0.05)" />
          </linearGradient>

          <radialGradient id="timerBg" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#17120a" />
            <stop offset="50%" stopColor="#0a0808" />
            <stop offset="100%" stopColor="#020204" />
          </radialGradient>

          <filter id="timerGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="timerFillClip">
            <rect x="0" y="0" width="640" height="320" className="timer-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes timerRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes timerDraw {
            0% { stroke-dashoffset: 1400; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes colonBlink {
            0%, 100% { opacity: 0.9; transform: scale(1); }
            50% { opacity: 0.2; transform: scale(0.85); }
          }
          @keyframes flipFold {
            0% { transform: perspective(400px) rotateX(0deg); }
            50% { transform: perspective(400px) rotateX(-20deg); }
            100% { transform: perspective(400px) rotateX(0deg); }
          }
          @keyframes gearRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .timer-fill-rect {
            animation: timerRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .timer-outline {
            stroke-dasharray: 1400;
            stroke-dashoffset: 1400;
            animation: timerDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .colon-dot {
            animation: colonBlink 1.2s infinite ease-in-out;
            transform-origin: center;
          }
          .split-flap-animated {
            transform-origin: 460px 145px;
            animation: flipFold 3.5s infinite ease-in-out;
          }
          .gear-ring {
            transform-origin: 320px 150px;
            animation: gearRotate 40s linear infinite;
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#timerBg)" />

        {/* Background Chronometer Dial / Gear Teeth Markers */}
        <g stroke="#f59e0b" strokeWidth="1" opacity="0.15" className="gear-ring">
          <circle cx="320" cy="150" r="145" fill="none" strokeDasharray="3 7" strokeWidth="2" />
          <circle cx="320" cy="150" r="120" fill="none" strokeDasharray="2 4" />
          <line x1="320" y1="5" x2="320" y2="295" strokeDasharray="6 6" />
          <line x1="175" y1="150" x2="465" y2="150" strokeDasharray="6 6" />
        </g>

        {/* Mechanical Split-Flip Cards Group */}
        <g transform="translate(0, 0)">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#timerFillClip)">
            
            {/* CARD 1: DAYS (Left: x=80) */}
            <g transform="translate(80, 75)">
              {/* Top Half */}
              <path d="M 0,10 Q 0,0 10,0 L 110,0 Q 120,0 120,10 L 120,68 L 0,68 Z" fill="url(#cardGradTop)" />
              {/* Bottom Half */}
              <path d="M 0,72 L 120,72 L 120,130 Q 120,140 110,140 L 10,140 Q 0,140 0,130 Z" fill="url(#cardGradBottom)" />
              {/* Center Divider Hinge */}
              <rect x="0" y="68" width="120" height="4" fill="#05070d" />
              <rect x="-4" y="67" width="6" height="6" rx="2" fill="#f59e0b" opacity="0.8" />
              <rect x="118" y="67" width="6" height="6" rx="2" fill="#f59e0b" opacity="0.8" />

              {/* Digits 08 */}
              <text x="60" y="98" fill="url(#timerGrad)" fontSize="68" fontFamily="'JetBrains Mono', monospace" fontWeight="900" textAnchor="middle" letterSpacing="4">
                08
              </text>
              {/* Sub-label */}
              <text x="60" y="160" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="3">
                DAYS
              </text>
            </g>

            {/* COLON 1 */}
            <g transform="translate(216, 120)">
              <circle cx="12" cy="15" r="5" fill="#f59e0b" className="colon-dot" />
              <circle cx="12" cy="45" r="5" fill="#f59e0b" className="colon-dot" />
            </g>

            {/* CARD 2: HOURS (Center: x=250) */}
            <g transform="translate(250, 75)">
              {/* Top Half */}
              <path d="M 0,10 Q 0,0 10,0 L 110,0 Q 120,0 120,10 L 120,68 L 0,68 Z" fill="url(#cardGradTop)" />
              {/* Bottom Half */}
              <path d="M 0,72 L 120,72 L 120,130 Q 120,140 110,140 L 10,140 Q 0,140 0,130 Z" fill="url(#cardGradBottom)" />
              {/* Center Divider Hinge */}
              <rect x="0" y="68" width="120" height="4" fill="#05070d" />
              <rect x="-4" y="67" width="6" height="6" rx="2" fill="#ef4444" opacity="0.8" />
              <rect x="118" y="67" width="6" height="6" rx="2" fill="#ef4444" opacity="0.8" />

              {/* Digits 24 */}
              <text x="60" y="98" fill="url(#timerGrad)" fontSize="68" fontFamily="'JetBrains Mono', monospace" fontWeight="900" textAnchor="middle" letterSpacing="4">
                24
              </text>
              {/* Sub-label */}
              <text x="60" y="160" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="3">
                HOURS
              </text>
            </g>

            {/* COLON 2 */}
            <g transform="translate(386, 120)">
              <circle cx="12" cy="15" r="5" fill="#ef4444" className="colon-dot" />
              <circle cx="12" cy="45" r="5" fill="#ef4444" className="colon-dot" />
            </g>

            {/* CARD 3: SECONDS (Right: x=420) */}
            <g transform="translate(420, 75)">
              {/* Top Half */}
              <path d="M 0,10 Q 0,0 10,0 L 110,0 Q 120,0 120,10 L 120,68 L 0,68 Z" fill="url(#cardGradTop)" />
              {/* Bottom Half */}
              <path d="M 0,72 L 120,72 L 120,130 Q 120,140 110,140 L 10,140 Q 0,140 0,130 Z" fill="url(#cardGradBottom)" />
              
              {/* Center Divider Hinge */}
              <rect x="0" y="68" width="120" height="4" fill="#05070d" />
              <rect x="-4" y="67" width="6" height="6" rx="2" fill="#ec4899" opacity="0.8" />
              <rect x="118" y="67" width="6" height="6" rx="2" fill="#ec4899" opacity="0.8" />

              {/* Digits 59 */}
              <text x="60" y="98" fill="url(#timerGrad)" fontSize="68" fontFamily="'JetBrains Mono', monospace" fontWeight="900" textAnchor="middle" letterSpacing="4">
                59
              </text>

              {/* 3D Falling Flip Flap Sheen Layer */}
              <path
                d="M 2,70 L 118,70 L 114,95 L 6,95 Z"
                fill="url(#flipSheen)"
                className="split-flap-animated"
                opacity="0.75"
              />

              {/* Sub-label */}
              <text x="60" y="160" fill="#ec4899" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="3">
                SECS
              </text>
            </g>

          </g>

          {/* OUTLINE LAYER */}
          <g className="timer-outline" filter="url(#timerGlow)">
            {/* Card 1 Bezel Outline */}
            <rect x="80" y="75" width="120" height="140" rx="10" fill="none" stroke="url(#timerStroke)" strokeWidth="2.5" />
            <line x1="80" y1="145" x2="200" y2="145" stroke="#fbbf24" strokeWidth="2" />

            {/* Card 2 Bezel Outline */}
            <rect x="250" y="75" width="120" height="140" rx="10" fill="none" stroke="url(#timerStroke)" strokeWidth="2.5" />
            <line x1="250" y1="145" x2="370" y2="145" stroke="#ef4444" strokeWidth="2" />

            {/* Card 3 Bezel Outline */}
            <rect x="420" y="75" width="120" height="140" rx="10" fill="none" stroke="url(#timerStroke)" strokeWidth="2.5" />
            <line x1="420" y1="145" x2="540" y2="145" stroke="#ec4899" strokeWidth="2" />
          </g>
        </g>

        {/* Top Left Precision Spec */}
        <g transform="translate(30, 30)">
          <text x="0" y="0" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.9">
            MECHANICAL // 3D SPLIT-FLIP
          </text>
          <text x="0" y="16" fill="#ef4444" fontSize="9" fontFamily="monospace" opacity="0.75">
            PRECISION AUDIO SYNTH // 60 FPS
          </text>
        </g>

        {/* Badge Bottom Center */}
        <g transform="translate(230, 275)">
          <rect width="180" height="28" rx="6" fill="rgba(251, 191, 36, 0.12)" stroke="#fbbf24" strokeWidth="1.2" />
          <text x="90" y="14" textAnchor="middle" dominantBaseline="central" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
            CHRONO // COUNTDOWN TIMER
          </text>
        </g>
      </svg>
    </div>
  );
};

export default CountdownTimerArt;
