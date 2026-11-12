import React from "react";

// NextChapter (bootcamp application site): an open book whose next page lifts
// off the spine and becomes the site's frosted-glass card, complete with the
// glowing button and the comment feed it built in vanilla JS.

// Orbs that sit behind the glass. Drawn soft outside the card and heavily
// blurred inside it, which is what sells the frosted look.
const ORBS: { cx: number; cy: number; r: number; fill: string }[] = [
  { cx: 432, cy: 66, r: 44, fill: "#a78bfa" },
  { cx: 552, cy: 196, r: 40, fill: "#0d59ff" },
  { cx: 372, cy: 200, r: 22, fill: "#60a5fa" },
];

// Text lines on the left page, bowed to follow the paper.
const LEFT_LINES = [0, 1, 2, 3, 4, 5].map((i) => {
  const y = 186 + i * 10;
  return `M 108,${y} C 138,${y - 7} 172,${y - 5} 198,${y + 4}`;
});

// Glints that drift from the lifted page up into the card.
const MOTES = [
  { x: 352, y: 78, d: "0s" },
  { x: 344, y: 120, d: "-1.6s" },
  { x: 356, y: 156, d: "-3.2s" },
];

const NextChapterArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="nextchapter-bg" cx="60%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="nextchapter-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <linearGradient id="nextchapter-cover" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1d3a7a" />
            <stop offset="100%" stopColor="#0b1638" />
          </linearGradient>

          <linearGradient id="nextchapter-paperL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#c7dcff" />
          </linearGradient>

          <linearGradient id="nextchapter-paperR" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c7dcff" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          {/* Lifted page: paper at the spine, turning to glass at its tip */}
          <linearGradient id="nextchapter-turn" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#eaf2ff" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#93c5fd" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.22" />
          </linearGradient>

          <linearGradient id="nextchapter-turnEdge" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#eaf2ff" />
            <stop offset="100%" stopColor="#eaf2ff" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="nextchapter-rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eaf2ff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#eaf2ff" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id="nextchapter-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eaf2ff" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#eaf2ff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#eaf2ff" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="nextchapter-button" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d59ff" />
            <stop offset="100%" stopColor="#4474ff" />
          </linearGradient>

          <radialGradient id="nextchapter-hotspot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eaf2ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#eaf2ff" stopOpacity="0" />
          </radialGradient>

          <clipPath id="nextchapter-cardClip">
            <rect x="372" y="40" width="186" height="172" rx="16" />
          </clipPath>

          <clipPath id="nextchapter-buttonClip">
            <rect x="392" y="116" width="146" height="22" rx="11" />
          </clipPath>

          <filter id="nextchapter-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" />
          </filter>

          <filter id="nextchapter-frost" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="16" />
          </filter>

          <filter id="nextchapter-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes nextchapterFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          @keyframes nextchapterTurn {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-2deg); }
          }
          @keyframes nextchapterMote {
            0% { opacity: 0; transform: translate(0px, 0px) scale(0.6); }
            25% { opacity: 1; }
            100% { opacity: 0; transform: translate(30px, -22px) scale(1); }
          }
          @keyframes nextchapterHotspot {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(96px); }
          }
          .nextchapter-card {
            animation: nextchapterFloat 8s ease-in-out infinite;
          }
          .nextchapter-turn {
            transform-origin: 210px 252px;
            animation: nextchapterTurn 8s ease-in-out infinite;
          }
          .nextchapter-mote {
            transform-box: fill-box;
            transform-origin: center;
            animation: nextchapterMote 4.8s ease-out infinite;
          }
          .nextchapter-hotspot {
            animation: nextchapterHotspot 5s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .nextchapter-card,
            .nextchapter-turn,
            .nextchapter-mote,
            .nextchapter-hotspot { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#nextchapter-bg)" />
        <rect width="640" height="320" fill="url(#nextchapter-grid)" opacity="0.07" />

        {/* Soft orbs behind the glass */}
        <g filter="url(#nextchapter-soft)">
          {ORBS.map((o) => (
            <circle key={o.cx} cx={o.cx} cy={o.cy} r={o.r} fill={o.fill} opacity="0.75" />
          ))}
        </g>

        {/* ===== Open book ===== */}
        <g>
          <ellipse cx="210" cy="262" rx="140" ry="9" fill="#0d59ff" opacity="0.18" />
          {/* cover */}
          <path
            d="M 210,190 C 160,176 116,176 80,184 L 72,256 C 120,248 170,250 210,262 C 250,250 300,248 348,256 L 340,184 C 304,176 260,176 210,190 Z"
            fill="url(#nextchapter-cover)"
            stroke="#4474ff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* page-stack edges */}
          <g fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.6">
            <path d="M 94,247 C 136,240 176,242 210,256 C 244,242 284,240 326,247" />
            <path d="M 90,251 C 134,244 176,246 210,259 C 244,246 286,244 330,251" />
          </g>
          {/* left page */}
          <path
            d="M 210,178 C 180,166 140,164 100,172 L 92,244 C 135,236 178,238 210,252 Z"
            fill="url(#nextchapter-paperL)"
          />
          <g fill="none" stroke="#1d3a7a" strokeWidth="2.2" strokeLinecap="round" opacity="0.55">
            {LEFT_LINES.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          {/* right page (the one underneath) */}
          <path
            d="M 210,178 C 240,166 280,164 320,172 L 328,244 C 285,236 242,238 210,252 Z"
            fill="url(#nextchapter-paperR)"
          />
          <g fill="none" stroke="#1d3a7a" strokeWidth="2.2" strokeLinecap="round" opacity="0.4">
            <path d="M 222,214 C 248,205 282,203 312,208" />
            <path d="M 222,224 C 248,215 282,213 314,218" />
            <path d="M 222,234 C 248,225 270,224 290,227" />
          </g>
          {/* spine shadow */}
          <path d="M 210,178 L 210,252" stroke="#0d1a3a" strokeWidth="2.5" opacity="0.6" />

          {/* the next page, lifting off the spine and turning to glass */}
          <g className="nextchapter-turn">
            <path
              d="M 210,178 C 248,132 310,82 388,52 C 389,92 391,132 392,172 C 330,190 262,214 210,252 Z"
              fill="url(#nextchapter-turn)"
            />
            <path
              d="M 210,178 C 248,132 310,82 388,52"
              fill="none"
              stroke="url(#nextchapter-turnEdge)"
              strokeWidth="1.6"
            />
            {/* curl highlight */}
            <path
              d="M 388,52 C 389,92 391,132 392,172"
              fill="none"
              stroke="#eaf2ff"
              strokeWidth="2"
              opacity="0.6"
              filter="url(#nextchapter-glow)"
            />
          </g>
        </g>

        {/* Glints carrying the page into the card */}
        {MOTES.map((m) => (
          <path
            key={m.x}
            className="nextchapter-mote"
            style={{ animationDelay: m.d }}
            d={`M ${m.x},${m.y - 5} L ${m.x + 2},${m.y - 2} L ${m.x + 5},${m.y} L ${m.x + 2},${m.y + 2} L ${m.x},${m.y + 5} L ${m.x - 2},${m.y + 2} L ${m.x - 5},${m.y} L ${m.x - 2},${m.y - 2} Z`}
            fill="#eaf2ff"
          />
        ))}

        {/* ===== Frosted-glass UI card ===== */}
        <g className="nextchapter-card">
          {/* frost: the orbs again, heavily blurred, only inside the card */}
          <g clipPath="url(#nextchapter-cardClip)">
            <rect x="372" y="40" width="186" height="172" fill="#0b1328" opacity="0.55" />
            <g filter="url(#nextchapter-frost)">
              {ORBS.map((o) => (
                <circle key={o.cx} cx={o.cx} cy={o.cy} r={o.r * 1.2} fill={o.fill} opacity="0.9" />
              ))}
            </g>
            <rect x="372" y="40" width="186" height="172" fill="url(#nextchapter-sheen)" />
          </g>
          <rect
            x="372"
            y="40"
            width="186"
            height="172"
            rx="16"
            fill="none"
            stroke="url(#nextchapter-rim)"
            strokeWidth="1.6"
          />
          <path
            d="M 388,41 L 470,41"
            stroke="#eaf2ff"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* header: title and subline */}
          <rect x="392" y="60" width="96" height="10" rx="5" fill="#eaf2ff" />
          <rect x="392" y="77" width="132" height="4" rx="2" fill="#eaf2ff" opacity="0.5" />
          <rect x="392" y="86" width="104" height="4" rx="2" fill="#eaf2ff" opacity="0.5" />
          <rect x="392" y="98" width="20" height="2" rx="1" fill="#a78bfa" />

          {/* glowing button with the cursor-tracking hotspot */}
          <rect
            x="392"
            y="116"
            width="146"
            height="22"
            rx="11"
            fill="url(#nextchapter-button)"
            filter="url(#nextchapter-glow)"
          />
          <g clipPath="url(#nextchapter-buttonClip)">
            <circle
              className="nextchapter-hotspot"
              cx="416"
              cy="127"
              r="26"
              fill="url(#nextchapter-hotspot)"
            />
          </g>
          <rect x="445" y="125" width="40" height="4" rx="2" fill="#eaf2ff" />

          {/* comment feed */}
          {[152, 180].map((y, i) => (
            <g key={y}>
              <rect
                x="392"
                y={y}
                width="146"
                height="22"
                rx="8"
                fill="#eaf2ff"
                opacity="0.08"
                stroke="#eaf2ff"
                strokeOpacity="0.18"
              />
              <circle cx="404" cy={y + 11} r="6" fill={i === 0 ? "#a78bfa" : "#60a5fa"} />
              <rect
                x="416"
                y={y + 6}
                width={i === 0 ? 50 : 38}
                height="3.5"
                rx="1.75"
                fill="#eaf2ff"
                opacity="0.85"
              />
              <rect
                x="416"
                y={y + 13}
                width={i === 0 ? 108 : 90}
                height="3"
                rx="1.5"
                fill="#eaf2ff"
                opacity="0.4"
              />
            </g>
          ))}
        </g>

        {/* Caption */}
        <g transform="translate(220, 272)">
          <rect
            width="200"
            height="28"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="100"
            y="14"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            NEXTCHAPTER // GLASS UI
          </text>
        </g>
      </svg>
    </div>
  );
};

export default NextChapterArt;
