import React from 'react';

const TestimonialArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="testGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7950f2" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#00ffc8" />
          </linearGradient>

          <linearGradient id="testStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#7950f2" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          <radialGradient id="testBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#190e28" />
            <stop offset="60%" stopColor="#0a0512" />
            <stop offset="100%" stopColor="#020108" />
          </radialGradient>

          <filter id="testGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="testFillClip">
            <rect x="0" y="0" width="640" height="320" className="test-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes testRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes testDraw {
            0% { stroke-dashoffset: 1400; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes floatCard {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          .test-fill-rect {
            animation: testRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .test-outline {
            stroke-dasharray: 1400;
            stroke-dashoffset: 1400;
            animation: testDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .card-float { animation: floatCard 4s infinite ease-in-out; }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#testBg)" />

        {/* Grid lines */}
        <g stroke="#7950f2" strokeWidth="1" opacity="0.15">
          <line x1="80" y1="50" x2="560" y2="50" />
          <line x1="80" y1="260" x2="560" y2="260" />
        </g>

        {/* Testimonial Card Constellation */}
        <g transform="translate(100, 30)">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#testFillClip)">
            {/* Primary Large Card Left */}
            <rect x="20" y="20" width="220" height="190" rx="16" fill="url(#testGrad)" opacity="0.85" />
            
            {/* Avatar & Lines inside Left Card */}
            <circle cx="55" cy="55" r="18" fill="#0a0512" />
            <rect x="85" y="45" width="80" height="8" rx="4" fill="#00ffc8" />
            <rect x="85" y="58" width="50" height="6" rx="3" fill="#a855f7" />
            <rect x="40" y="90" width="180" height="6" rx="3" fill="#0a0512" opacity="0.8" />
            <rect x="40" y="105" width="150" height="6" rx="3" fill="#0a0512" opacity="0.8" />
            <rect x="40" y="120" width="170" height="6" rx="3" fill="#0a0512" opacity="0.8" />
            <text x="40" y="180" fill="#facc15" fontSize="18">★★★★★</text>

            {/* Secondary Card Right (Floating) */}
            <g className="card-float">
              <rect x="260" y="45" width="170" height="140" rx="14" fill="url(#testGrad)" opacity="0.7" />
              <circle cx="290" cy="75" r="16" fill="#0a0512" />
              <rect x="315" y="68" width="60" height="7" rx="3.5" fill="#00ffc8" />
              <rect x="280" y="105" width="130" height="6" rx="3" fill="#0a0512" />
              <rect x="280" y="120" width="100" height="6" rx="3" fill="#0a0512" />
              <text x="280" y="160" fill="#facc15" fontSize="14">★★★★★</text>
            </g>
          </g>

          {/* OUTLINE LAYER */}
          <g className="test-outline" filter="url(#testGlow)">
            {/* Primary Card Outline */}
            <rect x="20" y="20" width="220" height="190" rx="16" fill="none" stroke="url(#testStroke)" strokeWidth="3" />
            <circle cx="55" cy="55" r="18" fill="none" stroke="#00ffc8" strokeWidth="2" />

            {/* Secondary Card Outline */}
            <g className="card-float">
              <rect x="260" y="45" width="170" height="140" rx="14" fill="none" stroke="#7950f2" strokeWidth="2.5" />
              <circle cx="290" cy="75" r="16" fill="none" stroke="#a855f7" strokeWidth="2" />
            </g>
          </g>
        </g>

        {/* Testimonial Tag */}
        <g transform="translate(250, 275)">
          <rect width="140" height="28" rx="6" fill="rgba(124, 58, 237, 0.15)" stroke="#7c3aed" strokeWidth="1.2" />
          <text x="70" y="14" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="10" fontFamily="monospace" fontWeight="bold">CSS GRID // SOCIAL</text>
        </g>
      </svg>
    </div>
  );
};

export default TestimonialArt;
