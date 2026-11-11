import React from "react";

const GeneratedNextChapterWeekOneArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="nextchapterweekoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e44d26" />
            <stop offset="100%" stopColor="#f06529" />
          </linearGradient>
          <radialGradient id="nextchapterweekoneBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>
          <filter id="nextchapterweekoneGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes nextchapterweekoneBlink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
          @keyframes nextchapterweekoneFadeIn { 0% { opacity: 0; } 100% { opacity: 0.6; } }
          .nextchapterweekone-cursor { animation: nextchapterweekoneBlink 1s step-end infinite; }
          .nextchapterweekone-fade { animation: nextchapterweekoneFadeIn 2s ease forwards; }
        `}</style>

        <rect width="640" height="320" fill="url(#nextchapterweekoneBg)" />

        {/* Browser Frame */}
        <rect
          x="120"
          y="40"
          width="400"
          height="240"
          rx="10"
          fill="none"
          stroke="#e44d26"
          strokeWidth="2"
          filter="url(#nextchapterweekoneGlow)"
        />
        <rect x="120" y="40" width="400" height="30" rx="10" fill="#e44d26" opacity="0.15" />
        <circle cx="142" cy="55" r="5" fill="#ff5f57" />
        <circle cx="160" cy="55" r="5" fill="#febc2e" />
        <circle cx="178" cy="55" r="5" fill="#28c840" />
        <rect x="220" y="49" width="180" height="12" rx="6" fill="rgba(255,255,255,0.08)" />

        {/* UI Wireframe Elements */}
        <rect x="140" y="85" width="160" height="14" rx="3" fill="#e44d26" opacity="0.3" />
        <rect x="140" y="108" width="84" height="8" rx="2" fill="#f06529" opacity="0.2" />
        <rect x="140" y="125" width="360" height="1" fill="#ff8a65" opacity="0.15" />

        {/* Code Lines */}
        <rect
          x="140"
          y="140"
          width="200"
          height="8"
          rx="2"
          fill="#ff8a65"
          opacity="0.2"
          className="nextchapterweekone-fade"
        />
        <rect
          x="140"
          y="155"
          width="280"
          height="8"
          rx="2"
          fill="#e44d26"
          opacity="0.15"
          className="nextchapterweekone-fade"
        />
        <rect
          x="140"
          y="170"
          width="160"
          height="8"
          rx="2"
          fill="#f06529"
          opacity="0.2"
          className="nextchapterweekone-fade"
        />
        <rect
          x="140"
          y="185"
          width="320"
          height="8"
          rx="2"
          fill="#ff8a65"
          opacity="0.12"
          className="nextchapterweekone-fade"
        />
        <rect
          x="140"
          y="200"
          width="240"
          height="8"
          rx="2"
          fill="#e44d26"
          opacity="0.18"
          className="nextchapterweekone-fade"
        />

        {/* Cursor */}
        <rect
          x="140"
          y="218"
          width="2"
          height="14"
          fill="#ff8a65"
          className="nextchapterweekone-cursor"
        />

        {/* Bracket Decorations */}
        <text x="50" y="170" fill="#e44d26" fontSize="48" fontFamily="monospace" opacity="0.15">
          {"<"}
        </text>
        <text x="570" y="170" fill="#f06529" fontSize="48" fontFamily="monospace" opacity="0.15">
          {"/>"}
        </text>

        {/* Title */}
        <text
          x="320"
          y="305"
          textAnchor="middle"
          fill="#ff8a65"
          fontSize="13"
          fontFamily="monospace"
          opacity="0.7"
        >
          NEXT CHAPTER WEEK ONE
        </text>
      </svg>
    </div>
  );
};

export default GeneratedNextChapterWeekOneArt;
