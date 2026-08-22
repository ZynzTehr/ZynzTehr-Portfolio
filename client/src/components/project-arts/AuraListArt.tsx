import React from 'react';

const AuraListArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="auraGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#00ffc8" />
          </linearGradient>

          <linearGradient id="auraStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#00ffc8" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <radialGradient id="auraBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#170f2c" />
            <stop offset="60%" stopColor="#0a0614" />
            <stop offset="100%" stopColor="#020108" />
          </radialGradient>

          <filter id="auraGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="auraFillClip">
            <rect x="0" y="0" width="640" height="320" className="aura-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes auraRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes auraDraw {
            0% { stroke-dashoffset: 1400; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes waveRipple {
            0% { transform: scaleY(0.4); }
            50% { transform: scaleY(1.3); }
            100% { transform: scaleY(0.4); }
          }
          .aura-fill-rect {
            animation: auraRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .aura-outline {
            stroke-dasharray: 1400;
            stroke-dashoffset: 1400;
            animation: auraDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .eq-1 { transform-origin: 320px 180px; animation: waveRipple 1.2s infinite ease-in-out 0.1s; }
          .eq-2 { transform-origin: 320px 180px; animation: waveRipple 1.4s infinite ease-in-out 0.3s; }
          .eq-3 { transform-origin: 320px 180px; animation: waveRipple 1.1s infinite ease-in-out 0.5s; }
          .eq-4 { transform-origin: 320px 180px; animation: waveRipple 1.5s infinite ease-in-out 0.2s; }
          .eq-5 { transform-origin: 320px 180px; animation: waveRipple 1.3s infinite ease-in-out 0.4s; }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#auraBg)" />

        {/* Sound Frequency Waves in Background */}
        <g stroke="#8b5cf6" strokeWidth="1.2" opacity="0.2">
          <path d="M 50,160 Q 150,110 250,160 T 450,160 T 590,160" fill="none" />
          <path d="M 50,160 Q 150,210 250,160 T 450,160 T 590,160" fill="none" />
        </g>

        {/* Mobile Device Frame & Audio Waves */}
        <g transform="translate(190, 20)">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#auraFillClip)">
            {/* iOS Device Silhouette */}
            <rect x="60" y="10" width="140" height="260" rx="28" fill="url(#auraGrad)" opacity="0.85" />
            
            {/* Screen Notch & Inner Display */}
            <rect x="70" y="20" width="120" height="240" rx="20" fill="#0a0614" />
            
            {/* Audio Wave Equalizer Bars */}
            <rect x="85" y="150" width="8" height="40" rx="4" fill="url(#auraGrad)" className="eq-1" />
            <rect x="100" y="130" width="8" height="60" rx="4" fill="url(#auraGrad)" className="eq-2" />
            <rect x="115" y="115" width="8" height="75" rx="4" fill="url(#auraGrad)" className="eq-3" />
            <rect x="130" y="135" width="8" height="55" rx="4" fill="url(#auraGrad)" className="eq-4" />
            <rect x="145" y="145" width="8" height="45" rx="4" fill="url(#auraGrad)" className="eq-5" />
            <rect x="160" y="155" width="8" height="35" rx="4" fill="url(#auraGrad)" className="eq-1" />

            {/* Aura Ripple Circles */}
            <circle cx="130" cy="80" r="22" fill="none" stroke="#00ffc8" strokeWidth="2" opacity="0.8" />
            <circle cx="130" cy="80" r="32" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.6" />
          </g>

          {/* OUTLINE LAYER */}
          <g className="aura-outline" filter="url(#auraGlow)">
            {/* Device Outline */}
            <rect x="60" y="10" width="140" height="260" rx="28" fill="none" stroke="url(#auraStroke)" strokeWidth="3" />
            
            {/* Dynamic Island Notch */}
            <rect x="110" y="26" width="40" height="10" rx="5" fill="#00ffc8" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default AuraListArt;
