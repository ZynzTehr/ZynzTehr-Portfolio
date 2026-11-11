import React from "react";

const GeneratedJobseanceArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="jobseanceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3178c6" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>
          <radialGradient id="jobseanceBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>
          <filter id="jobseanceGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes jobseanceBlink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
          @keyframes jobseanceFadeIn { 0% { opacity: 0; } 100% { opacity: 0.6; } }
          .jobseance-cursor { animation: jobseanceBlink 1s step-end infinite; }
          .jobseance-fade { animation: jobseanceFadeIn 2s ease forwards; }
        `}</style>

        <rect width="640" height="320" fill="url(#jobseanceBg)" />

        {/* Browser Frame */}
        <rect
          x="120"
          y="40"
          width="400"
          height="240"
          rx="10"
          fill="none"
          stroke="#3178c6"
          strokeWidth="2"
          filter="url(#jobseanceGlow)"
        />
        <rect x="120" y="40" width="400" height="30" rx="10" fill="#3178c6" opacity="0.15" />
        <circle cx="142" cy="55" r="5" fill="#ff5f57" />
        <circle cx="160" cy="55" r="5" fill="#febc2e" />
        <circle cx="178" cy="55" r="5" fill="#28c840" />
        <rect x="220" y="49" width="180" height="12" rx="6" fill="rgba(255,255,255,0.08)" />

        {/* UI Wireframe Elements */}
        <rect x="140" y="85" width="160" height="14" rx="3" fill="#3178c6" opacity="0.3" />
        <rect x="140" y="108" width="91" height="8" rx="2" fill="#00d4ff" opacity="0.2" />
        <rect x="140" y="125" width="360" height="1" fill="#61dafb" opacity="0.15" />

        {/* Code Lines */}
        <rect
          x="140"
          y="140"
          width="200"
          height="8"
          rx="2"
          fill="#61dafb"
          opacity="0.2"
          className="jobseance-fade"
        />
        <rect
          x="140"
          y="155"
          width="280"
          height="8"
          rx="2"
          fill="#3178c6"
          opacity="0.15"
          className="jobseance-fade"
        />
        <rect
          x="140"
          y="170"
          width="160"
          height="8"
          rx="2"
          fill="#00d4ff"
          opacity="0.2"
          className="jobseance-fade"
        />
        <rect
          x="140"
          y="185"
          width="320"
          height="8"
          rx="2"
          fill="#61dafb"
          opacity="0.12"
          className="jobseance-fade"
        />
        <rect
          x="140"
          y="200"
          width="240"
          height="8"
          rx="2"
          fill="#3178c6"
          opacity="0.18"
          className="jobseance-fade"
        />

        {/* Cursor */}
        <rect x="140" y="218" width="2" height="14" fill="#61dafb" className="jobseance-cursor" />

        {/* Bracket Decorations */}
        <text x="50" y="170" fill="#3178c6" fontSize="48" fontFamily="monospace" opacity="0.15">
          {"<"}
        </text>
        <text x="570" y="170" fill="#00d4ff" fontSize="48" fontFamily="monospace" opacity="0.15">
          {"/>"}
        </text>

        {/* Title */}
        <text
          x="320"
          y="305"
          textAnchor="middle"
          fill="#61dafb"
          fontSize="13"
          fontFamily="monospace"
          opacity="0.7"
        >
          JOB SEANCE
        </text>
      </svg>
    </div>
  );
};

export default GeneratedJobseanceArt;
