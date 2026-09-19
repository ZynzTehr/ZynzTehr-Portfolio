import React from 'react';

const GeneratedNextChapterWeekOneArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg viewBox="0 0 640 320" className="w-100 h-100" style={{ width: '100%', height: '100%', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ncw1Grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00bfa6" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id="ncw1Stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00bfa6" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <radialGradient id="ncw1Bg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="60%" stopColor="#070919" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>
          <filter id="ncw1Glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes ncw1Sparkle { 0%,100% { opacity: 0.2; } 50% { opacity: 0.8; } }
          @keyframes ncw1SlideUp { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
          @keyframes ncw1PriceBar { 0% { width: 0; } 100% { width: 100%; } }
          .ncw1-sparkle { animation: ncw1Sparkle 2.5s ease-in-out infinite; }
          .ncw1-sparkle2 { animation: ncw1Sparkle 3s ease-in-out 0.8s infinite; }
          .ncw1-slide { animation: ncw1SlideUp 1.5s ease forwards; }
        `}</style>

        <rect width="640" height="320" fill="url(#ncw1Bg)" />

        {/* Building / House Silhouette */}
        <g opacity="0.9">
          {/* Main building */}
          <rect x="200" y="100" width="160" height="140" rx="4" fill="none" stroke="url(#ncw1Stroke)" strokeWidth="2" filter="url(#ncw1Glow)" />
          {/* Roof */}
          <polygon points="190,100 280,50 370,100" fill="none" stroke="url(#ncw1Grad)" strokeWidth="2" filter="url(#ncw1Glow)" />
          {/* Windows */}
          <rect x="218" y="120" width="30" height="28" rx="3" fill="#00bfa6" opacity="0.15" stroke="#00bfa6" strokeWidth="1" />
          <rect x="262" y="120" width="30" height="28" rx="3" fill="#38bdf8" opacity="0.15" stroke="#38bdf8" strokeWidth="1" />
          <rect x="306" y="120" width="30" height="28" rx="3" fill="#818cf8" opacity="0.15" stroke="#818cf8" strokeWidth="1" />
          {/* Door */}
          <rect x="260" y="190" width="40" height="50" rx="4" fill="#00bfa6" opacity="0.1" stroke="#00bfa6" strokeWidth="1.5" />
          <circle cx="292" cy="215" r="3" fill="#00bfa6" opacity="0.6" />
        </g>

        {/* Sparkle / Clean Shine Effects */}
        <g className="ncw1-sparkle">
          <line x1="160" y1="75" x2="160" y2="55" stroke="#00bfa6" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="150" y1="65" x2="170" y2="65" stroke="#00bfa6" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        <g className="ncw1-sparkle2">
          <line x1="380" y1="85" x2="380" y2="70" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="373" y1="77.5" x2="387" y2="77.5" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        <g className="ncw1-sparkle" style={{ animationDelay: '1.2s' }}>
          <line x1="345" y1="110" x2="345" y2="100" stroke="#818cf8" strokeWidth="1" strokeLinecap="round" />
          <line x1="340" y1="105" x2="350" y2="105" stroke="#818cf8" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Price Estimator Panel */}
        <g className="ncw1-slide">
          <rect x="420" y="80" width="170" height="160" rx="10" fill="rgba(0,191,166,0.05)" stroke="#00bfa6" strokeWidth="1.5" />
          <text x="505" y="105" textAnchor="middle" fill="#00bfa6" fontSize="10" fontFamily="monospace" fontWeight="bold">PRICE ESTIMATOR</text>
          <line x1="435" y1="115" x2="575" y2="115" stroke="#00bfa6" strokeWidth="0.5" opacity="0.3" />

          {/* Slider bars */}
          <text x="440" y="137" fill="#38bdf8" fontSize="9" fontFamily="monospace" opacity="0.6">Rooms</text>
          <rect x="440" y="142" width="135" height="4" rx="2" fill="rgba(56,189,248,0.15)" />
          <rect x="440" y="142" width="85" height="4" rx="2" fill="#38bdf8" opacity="0.5" />
          <circle cx="525" cy="144" r="5" fill="#38bdf8" opacity="0.8" />

          <text x="440" y="167" fill="#818cf8" fontSize="9" fontFamily="monospace" opacity="0.6">Frequency</text>
          <rect x="440" y="172" width="135" height="4" rx="2" fill="rgba(129,140,248,0.15)" />
          <rect x="440" y="172" width="105" height="4" rx="2" fill="#818cf8" opacity="0.5" />
          <circle cx="545" cy="174" r="5" fill="#818cf8" opacity="0.8" />

          {/* Price display */}
          <rect x="450" y="195" width="110" height="30" rx="6" fill="rgba(0,191,166,0.1)" stroke="#00bfa6" strokeWidth="1" />
          <text x="505" y="215" textAnchor="middle" fill="#00bfa6" fontSize="16" fontFamily="monospace" fontWeight="bold">$149/mo</text>
        </g>

        {/* Accessibility Badge */}
        <g transform="translate(430, 250)">
          <rect width="68" height="22" rx="11" fill="rgba(56,189,248,0.1)" stroke="#38bdf8" strokeWidth="1" />
          <text x="34" y="15" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">WCAG AA</text>
        </g>

        {/* Floating dots */}
        <circle cx="130" cy="180" r="2" fill="#00bfa6" opacity="0.3" className="ncw1-sparkle" />
        <circle cx="560" cy="60" r="2.5" fill="#818cf8" opacity="0.25" className="ncw1-sparkle2" />
        <circle cx="100" cy="260" r="1.5" fill="#38bdf8" opacity="0.3" />

        {/* Title */}
        <text x="320" y="300" textAnchor="middle" fill="#00bfa6" fontSize="12" fontFamily="monospace" opacity="0.7">REST EASY CLEANING CO.</text>
      </svg>
    </div>
  );
};

export default GeneratedNextChapterWeekOneArt;
