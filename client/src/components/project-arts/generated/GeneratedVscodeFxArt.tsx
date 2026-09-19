import React from 'react';

const GeneratedVscodeFxArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg viewBox="0 0 640 320" className="w-100 h-100" style={{ width: '100%', height: '100%', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="vfxGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7b2ff7" />
            <stop offset="50%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#00ffc8" />
          </linearGradient>
          <linearGradient id="vfxLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7b2ff7" stopOpacity="0" />
            <stop offset="50%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#7b2ff7" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="vfxBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#1a1035" />
            <stop offset="60%" stopColor="#0d0a1a" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>
          <filter id="vfxGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="vfxSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes vfxCursorSlide { 
            0% { transform: translateX(0); } 
            30% { transform: translateX(120px); }
            60% { transform: translateX(120px); }
            100% { transform: translateX(0); }
          }
          @keyframes vfxGlowPulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
          @keyframes vfxRipple { 
            0% { r: 0; opacity: 0.6; } 
            100% { r: 30; opacity: 0; } 
          }
          @keyframes vfxNeonFlicker {
            0%,100% { filter: drop-shadow(0 0 4px #00d4ff); }
            50% { filter: drop-shadow(0 0 10px #00d4ff) drop-shadow(0 0 20px #7b2ff7); }
          }
          @keyframes vfxTabSlide {
            0% { transform: translateY(-8px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .vfx-cursor { animation: vfxCursorSlide 4s ease-in-out infinite; }
          .vfx-glow { animation: vfxGlowPulse 3s ease-in-out infinite; }
          .vfx-ripple { animation: vfxRipple 1.5s ease-out infinite; }
          .vfx-neon { animation: vfxNeonFlicker 2.5s ease-in-out infinite; }
          .vfx-tab { animation: vfxTabSlide 0.8s ease forwards; }
        `}</style>

        <rect width="640" height="320" fill="url(#vfxBg)" />

        {/* VS Code Editor Frame */}
        <rect x="100" y="35" width="440" height="250" rx="10" fill="rgba(30,20,50,0.8)" stroke="#7b2ff7" strokeWidth="1.5" opacity="0.9" />
        
        {/* Title Bar */}
        <rect x="100" y="35" width="440" height="26" rx="10" fill="rgba(123,47,247,0.12)" />
        <circle cx="118" cy="48" r="4" fill="#ff5f57" />
        <circle cx="134" cy="48" r="4" fill="#febc2e" />
        <circle cx="150" cy="48" r="4" fill="#28c840" />
        <text x="320" y="52" textAnchor="middle" fill="#00d4ff" fontSize="9" fontFamily="monospace" opacity="0.6">VS Code FX</text>

        {/* Tab Bar with Animation */}
        <g className="vfx-tab">
          <rect x="100" y="61" width="90" height="24" fill="rgba(0,212,255,0.1)" stroke="#00d4ff" strokeWidth="0.8" />
          <text x="145" y="77" textAnchor="middle" fill="#00d4ff" fontSize="9" fontFamily="monospace">main.tsx</text>
        </g>
        <rect x="190" y="61" width="80" height="24" fill="rgba(123,47,247,0.06)" />
        <text x="230" y="77" textAnchor="middle" fill="#7b2ff7" fontSize="9" fontFamily="monospace" opacity="0.5">styles.css</text>

        {/* Sidebar */}
        <rect x="100" y="85" width="36" height="200" fill="rgba(123,47,247,0.06)" />
        <rect x="108" y="95" width="20" height="3" rx="1" fill="#7b2ff7" opacity="0.4" />
        <rect x="108" y="105" width="20" height="3" rx="1" fill="#00d4ff" opacity="0.3" />
        <rect x="108" y="115" width="20" height="3" rx="1" fill="#7b2ff7" opacity="0.2" />
        <rect x="108" y="125" width="20" height="3" rx="1" fill="#00d4ff" opacity="0.15" />

        {/* Code Lines */}
        <rect x="148" y="95" width="140" height="8" rx="2" fill="#7b2ff7" opacity="0.15" />
        <rect x="148" y="110" width="200" height="8" rx="2" fill="#00d4ff" opacity="0.1" />
        
        {/* Active Line with NEON GLOW - the key feature */}
        <rect x="136" y="124" width="404" height="20" rx="0" fill="rgba(0,212,255,0.06)" />
        <rect x="136" y="124" width="2" height="20" fill="#00d4ff" filter="url(#vfxGlow)" className="vfx-neon" />
        <rect x="148" y="128" width="260" height="8" rx="2" fill="#00ffc8" opacity="0.25" />
        {/* Glow line effect */}
        <rect x="136" y="143" width="404" height="1" fill="url(#vfxLineGrad)" opacity="0.3" className="vfx-glow" />

        <rect x="148" y="150" width="180" height="8" rx="2" fill="#7b2ff7" opacity="0.12" />
        <rect x="148" y="165" width="300" height="8" rx="2" fill="#00d4ff" opacity="0.08" />
        <rect x="148" y="180" width="120" height="8" rx="2" fill="#7b2ff7" opacity="0.1" />
        <rect x="148" y="195" width="240" height="8" rx="2" fill="#00ffc8" opacity="0.08" />

        {/* Smooth Cursor */}
        <g className="vfx-cursor">
          <rect x="148" y="126" width="2" height="16" fill="#00d4ff" filter="url(#vfxGlow)" />
          <rect x="146" y="126" width="6" height="16" fill="#00d4ff" opacity="0.15" filter="url(#vfxSoftGlow)" />
        </g>

        {/* Ripple Effect */}
        <circle cx="480" cy="48" r="0" fill="none" stroke="#00d4ff" strokeWidth="1.5" className="vfx-ripple" opacity="0" />

        {/* Syntax Token Glows - scattered neon highlights */}
        <circle cx="220" cy="132" r="3" fill="#00ffc8" opacity="0.3" filter="url(#vfxSoftGlow)" className="vfx-glow" />
        <circle cx="340" cy="132" r="2.5" fill="#7b2ff7" opacity="0.3" filter="url(#vfxSoftGlow)" className="vfx-glow" />

        {/* Feature Labels */}
        <g transform="translate(555, 100)">
          <rect x="-5" y="-10" width="75" height="18" rx="9" fill="rgba(0,212,255,0.08)" stroke="#00d4ff" strokeWidth="0.8" />
          <text x="33" y="3" textAnchor="middle" fill="#00d4ff" fontSize="8" fontFamily="monospace">NEON GLOW</text>
        </g>
        <g transform="translate(555, 135)">
          <rect x="-5" y="-10" width="75" height="18" rx="9" fill="rgba(123,47,247,0.08)" stroke="#7b2ff7" strokeWidth="0.8" />
          <text x="33" y="3" textAnchor="middle" fill="#7b2ff7" fontSize="8" fontFamily="monospace">RIPPLE FX</text>
        </g>
        <g transform="translate(555, 170)">
          <rect x="-5" y="-10" width="75" height="18" rx="9" fill="rgba(0,255,200,0.08)" stroke="#00ffc8" strokeWidth="0.8" />
          <text x="33" y="3" textAnchor="middle" fill="#00ffc8" fontSize="8" fontFamily="monospace">CURSOR FX</text>
        </g>

        {/* Ambient particles */}
        <circle cx="80" cy="80" r="1.5" fill="#00d4ff" opacity="0.3" className="vfx-glow" />
        <circle cx="570" cy="250" r="2" fill="#7b2ff7" opacity="0.25" className="vfx-glow" />
        <circle cx="90" cy="260" r="1.5" fill="#00ffc8" opacity="0.2" className="vfx-glow" />

        {/* Title */}
        <text x="320" y="305" textAnchor="middle" fill="url(#vfxGrad)" fontSize="14" fontFamily="monospace" fontWeight="bold" filter="url(#vfxGlow)">VS CODE FX</text>
      </svg>
    </div>
  );
};

export default GeneratedVscodeFxArt;
