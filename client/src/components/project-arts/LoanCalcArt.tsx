import React from 'react';

const LoanCalcArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="loanGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#00ffc8" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <linearGradient id="loanStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#00ffc8" />
          </linearGradient>

          <radialGradient id="loanBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#06281e" />
            <stop offset="60%" stopColor="#03140e" />
            <stop offset="100%" stopColor="#010604" />
          </radialGradient>

          <filter id="loanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="loanFillClip">
            <rect x="0" y="0" width="640" height="320" className="loan-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes loanRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes loanDraw {
            0% { stroke-dashoffset: 1400; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          .loan-fill-rect {
            animation: loanRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .loan-outline {
            stroke-dasharray: 1400;
            stroke-dashoffset: 1400;
            animation: loanDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#loanBg)" />

        {/* Financial Analytics Grid Lines */}
        <g stroke="#10b981" strokeWidth="1" opacity="0.15">
          <line x1="80" y1="60" x2="560" y2="60" strokeDasharray="6 6" />
          <line x1="80" y1="120" x2="560" y2="120" strokeDasharray="6 6" />
          <line x1="80" y1="180" x2="560" y2="180" strokeDasharray="6 6" />
          <line x1="80" y1="240" x2="560" y2="240" />
        </g>

        {/* Financial Growth Amortization Chart & Donut Gauge */}
        <g transform="translate(60, 20)">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#loanFillClip)">
            {/* Amortization Growth Area Fill */}
            <path
              d="M 80,220
                 C 140,210 200,180 260,140
                 C 320,100 380,60 450,40
                 L 450,220 Z"
              fill="url(#loanGrad)"
              opacity="0.6"
            />

            {/* Currency Shield in Center */}
            <path
              d="M 260,70
                 C 290,60 310,60 340,70
                 C 340,110 320,140 300,155
                 C 280,140 260,110 260,70 Z"
              fill="#010604"
              opacity="0.9"
            />
            <text x="290" y="122" fill="#00ffc8" fontSize="28" fontFamily="sans-serif" fontWeight="bold">$</text>

            {/* Slider Bars Visual */}
            <rect x="80" y="245" width="160" height="8" rx="4" fill="url(#loanGrad)" />
            <circle cx="160" cy="249" r="8" fill="#ffffff" />

            <rect x="290" y="245" width="160" height="8" rx="4" fill="url(#loanGrad)" />
            <circle cx="390" cy="249" r="8" fill="#ffffff" />
          </g>

          {/* OUTLINE LAYER */}
          <g className="loan-outline" filter="url(#loanGlow)">
            {/* Ascending Growth Line */}
            <path
              d="M 80,220
                 C 140,210 200,180 260,140
                 C 320,100 380,60 450,40"
              fill="none"
              stroke="url(#loanStroke)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Shield Outline */}
            <path
              d="M 260,70
                 C 290,60 310,60 340,70
                 C 340,110 320,140 300,155
                 C 280,140 260,110 260,70 Z"
              fill="none"
              stroke="#00ffc8"
              strokeWidth="2.5"
            />

            {/* Sliders Outline */}
            <rect x="80" y="245" width="160" height="8" rx="4" fill="none" stroke="#10b981" strokeWidth="1.5" />
            <rect x="290" y="245" width="160" height="8" rx="4" fill="none" stroke="#10b981" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default LoanCalcArt;
