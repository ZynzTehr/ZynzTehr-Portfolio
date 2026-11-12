import React from "react";

/*
 * School Directory: the TypeScript class hierarchy drawn as clipped ID badges.
 * Person is extended by Student and Staff, Staff by Teacher, Administrator
 * and Custodian, with UML generalisation arrows doubling as lanyards, while
 * the data.txt roster feeds the tree from below.
 */

const CARD_W = 108;
const CARD_H = 54;

type Role = "person" | "student" | "staff" | "teacher" | "admin" | "custodian";

interface Badge {
  role: Role;
  cx: number;
  y: number;
  delay: number;
}

const BADGES: Badge[] = [
  { role: "person", cx: 300, y: 22, delay: 0 },
  { role: "student", cx: 150, y: 112, delay: -1.4 },
  { role: "staff", cx: 450, y: 112, delay: -2.8 },
  { role: "teacher", cx: 330, y: 202, delay: -0.7 },
  { role: "admin", cx: 450, y: 202, delay: -3.5 },
  { role: "custodian", cx: 570, y: 202, delay: -2.1 },
];

// Generalisation groups: children share a bus, one hollow triangle at the parent.
const EXTENDS = [
  { parentCx: 300, parentBottom: 22 + CARD_H, busY: 95, children: [150, 450], childTop: 112 },
  {
    parentCx: 450,
    parentBottom: 112 + CARD_H,
    busY: 185,
    children: [330, 450, 570],
    childTop: 202,
  },
];

// Role glyphs drawn around (0, 0), roughly 18px across.
const roleGlyph = (role: Role) => {
  switch (role) {
    case "person":
      return (
        <>
          <circle cx="0" cy="-3" r="4" />
          <path d="M -7,8 C -7,2 7,2 7,8" />
        </>
      );
    case "student":
      return (
        <>
          <path d="M -9,-2 L 0,-6 L 9,-2 L 0,2 Z" fill="#eaf2ff" />
          <path d="M -5,0 V 4 C -5,7 5,7 5,4 V 0" />
          <path d="M 9,-2 V 4" />
        </>
      );
    case "staff":
      return (
        <>
          <rect x="-8" y="-4" width="16" height="11" rx="2" />
          <path d="M -3,-4 V -7 H 3 V -4 M -8,1 H 8" />
        </>
      );
    case "teacher":
      return (
        <>
          <path d="M 0,-3 C -3,-6 -7,-6 -9,-5 V 6 C -7,5 -3,5 0,7 C 3,5 7,5 9,6 V -5 C 7,-6 3,-6 0,-3 Z" />
          <path d="M 0,-3 V 7" />
        </>
      );
    case "admin":
      return (
        <>
          <circle cx="-4" cy="0" r="4" />
          <path d="M 0,0 H 9 M 6,0 V 3 M 9,0 V 4" />
        </>
      );
    case "custodian":
      return (
        <>
          <path d="M 7,-8 L -1,2" />
          <path d="M -2,0 L 3,5 L -3,10 L -9,4 Z" />
          <path d="M -5,7 L 0,2" />
        </>
      );
  }
};

const badgeCard = (b: Badge) => {
  const root = b.role === "person";
  return (
    <g transform={`translate(${b.cx - CARD_W / 2} ${b.y})`}>
      <rect
        width={CARD_W}
        height={CARD_H}
        rx="8"
        fill="url(#schooldirectory-card)"
        stroke={root ? "#93c5fd" : "#4474ff"}
        strokeWidth={root ? 2.4 : 1.6}
        filter={root ? "url(#schooldirectory-glow)" : undefined}
      />
      {/* Header band with the lanyard slot */}
      <path
        d={`M 0,14 V 8 Q 0,0 8,0 H ${CARD_W - 8} Q ${CARD_W},0 ${CARD_W},8 V 14 Z`}
        fill={root ? "#0d59ff" : "#1d3a8f"}
      />
      <rect x={CARD_W / 2 - 9} y="4" width="18" height="5" rx="2.5" fill="#020308" />

      {/* Photo with the class's role glyph */}
      <circle cx="24" cy="34" r="14" fill="#0b1328" stroke="#60a5fa" strokeWidth="1.6" />
      <g
        transform="translate(24 34)"
        fill="none"
        stroke="#eaf2ff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {roleGlyph(b.role)}
      </g>

      {/* Name, role and a barcode */}
      <rect x="46" y="21" width="52" height="6" rx="3" fill="#dbeafe" opacity="0.85" />
      <rect x="46" y="32" width="34" height="4" rx="2" fill="#60a5fa" opacity="0.7" />
      <g fill="#93c5fd" opacity="0.45">
        {[0, 3, 5, 9, 11, 14, 18, 20, 23, 27, 29, 32].map((dx, i) => (
          <rect key={dx} x={46 + dx * 1.6} y="41" width={i % 3 === 0 ? 2.4 : 1.2} height="6" />
        ))}
      </g>
    </g>
  );
};

const SchoolDirectoryArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="schooldirectory-bg" cx="55%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="schooldirectory-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <radialGradient id="schooldirectory-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4474ff" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#4474ff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="schooldirectory-card" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#13204a" />
            <stop offset="100%" stopColor="#0a1230" />
          </linearGradient>

          <linearGradient id="schooldirectory-page" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#17244f" />
            <stop offset="100%" stopColor="#0b1328" />
          </linearGradient>

          <linearGradient id="schooldirectory-scan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
            <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>

          <clipPath id="schooldirectory-page-clip">
            <path d="M 104,200 H 166 L 184,218 V 256 H 104 Z" />
          </clipPath>

          <filter id="schooldirectory-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes schooldirectorySway {
            0%, 100% { transform: rotate(0deg); }
            30% { transform: rotate(1.6deg); }
            70% { transform: rotate(-1.6deg); }
          }
          @keyframes schooldirectoryPulse {
            0%, 100% { opacity: 0.45; }
            50% { opacity: 1; }
          }
          @keyframes schooldirectoryScan {
            0% { transform: translateY(0px); opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { transform: translateY(44px); opacity: 0; }
          }
          .schooldirectory-badge {
            animation: schooldirectorySway 7s ease-in-out infinite;
          }
          .schooldirectory-extends {
            animation: schooldirectoryPulse 5s ease-in-out infinite;
          }
          .schooldirectory-scan {
            animation: schooldirectoryScan 4s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .schooldirectory-badge,
            .schooldirectory-extends,
            .schooldirectory-scan { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#schooldirectory-bg)" />
        <rect width="640" height="320" fill="url(#schooldirectory-grid)" opacity="0.07" />
        <ellipse cx="380" cy="140" rx="250" ry="140" fill="url(#schooldirectory-aura)" />

        {/* "extends" generalisation arrows: shared bus, hollow head at the parent */}
        {EXTENDS.map((e, i) => {
          const first = e.children[0];
          const last = e.children[e.children.length - 1];
          return (
            <g
              key={e.parentCx}
              className="schooldirectory-extends"
              style={{ animationDelay: `${-i * 2.5}s` }}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              {e.children.map((cx) => (
                <path key={cx} d={`M ${cx},${e.childTop + 6} V ${e.busY}`} />
              ))}
              <path d={`M ${first},${e.busY} H ${last}`} />
              <path d={`M ${e.parentCx},${e.busY} V ${e.parentBottom + 12}`} />
              <path
                d={`M ${e.parentCx},${e.parentBottom + 1} L ${e.parentCx + 8},${e.parentBottom + 12} H ${e.parentCx - 8} Z`}
                fill="#060a18"
                stroke="#93c5fd"
                strokeWidth="2.2"
              />
            </g>
          );
        })}

        {/* data.txt roster feeding the hierarchy */}
        <g>
          <path
            d="M 104,200 H 166 L 184,218 V 256 H 104 Z"
            fill="url(#schooldirectory-page)"
            stroke="#60a5fa"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M 166,200 V 218 H 184"
            fill="#1d3a8f"
            stroke="#60a5fa"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <g fill="#93c5fd" opacity="0.7">
            <rect x="112" y="210" width="44" height="4" rx="2" />
            <rect x="112" y="219" width="36" height="4" rx="2" />
            <rect x="112" y="237" width="58" height="4" rx="2" />
            <rect x="112" y="246" width="48" height="4" rx="2" />
          </g>
          {/* A record row split by its delimiter */}
          <g stroke="#93c5fd" strokeWidth="4" strokeLinecap="round" opacity="0.7">
            <path d="M 114,230 H 130" />
            <path d="M 148,230 H 168" />
            <path d="M 136,234 L 142,226" strokeWidth="2" />
          </g>
          <g clipPath="url(#schooldirectory-page-clip)">
            <rect
              className="schooldirectory-scan"
              x="104"
              y="206"
              width="80"
              height="3"
              fill="url(#schooldirectory-scan)"
            />
          </g>
          {/* Parsed into instances */}
          <path
            d="M 144,198 V 174"
            stroke="#4474ff"
            strokeWidth="1.6"
            strokeDasharray="3 4"
            strokeLinecap="round"
          />
          <path
            d="M 139,178 L 144,171 L 149,178"
            fill="none"
            stroke="#4474ff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Class badges, swinging gently from their lanyard slots */}
        {BADGES.map((b) => (
          <g
            key={b.role}
            className="schooldirectory-badge"
            style={{ transformOrigin: `${b.cx}px ${b.y + 6}px`, animationDelay: `${b.delay}s` }}
          >
            {badgeCard(b)}
          </g>
        ))}

        {/* Caption */}
        <g transform="translate(196, 276)">
          <rect
            width="248"
            height="28"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="124"
            y="14"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            SCHOOL-DIRECTORY // TS EXTENDS
          </text>
        </g>
      </svg>
    </div>
  );
};

export default SchoolDirectoryArt;
