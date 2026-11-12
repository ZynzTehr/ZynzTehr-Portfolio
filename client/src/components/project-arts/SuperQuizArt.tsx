import React from "react";

// Question card footprint; the tile grid ripples outward from its centre.
const CARD = { x: 222, y: 66, w: 196, h: 184 };
const ORIGIN = { x: CARD.x + CARD.w / 2, y: CARD.y + CARD.h / 2 };
const STEP = 22;
const BAND = 30;

// Category tiles (coding, math, science, ideas) sitting in the grid.
const CATEGORIES = [
  { x: 132, y: 98, icon: "M-6 -5 L-10 0 L-6 5 M6 -5 L10 0 L6 5 M2.5 -7.5 L-2.5 7.5" },
  { x: 506, y: 98, icon: "M6 -7 L-6 -7 L1 0 L-6 7 L6 7" },
  { x: 110, y: 188, icon: "M-4 -8 L4 -8 M-2.5 -8 L-2.5 -2 L-8 7 L8 7 L2.5 -2 L2.5 -8 M-5 3 L5 3" },
  {
    x: 528,
    y: 188,
    icon: "M-3.5 4 C-8 1 -8 -8 0 -8 C8 -8 8 1 3.5 4 L3.5 7 L-3.5 7 Z M-2 10 L2 10",
  },
];

const nearCategory = (x: number, y: number) =>
  CATEGORIES.some((c) => Math.abs(c.x - x) < 26 && Math.abs(c.y - y) < 26);

type Tile = { x: number; y: number; size: number; fill: string };

// Grid tiles grouped into distance bands so each band can ripple as one.
const BANDS: Tile[][] = [];
for (let j = 0; j < 12; j += 1) {
  for (let i = 0; i < 29; i += 1) {
    const x = 12 + STEP * i;
    const y = 12 + STEP * j;
    const insideCard =
      x > CARD.x - 12 && x < CARD.x + CARD.w + 12 && y > CARD.y - 12 && y < CARD.y + CARD.h + 12;
    if (insideCard || nearCategory(x, y)) continue;
    const dist = Math.hypot((x - ORIGIN.x) * 0.85, y - ORIGIN.y);
    const band = Math.floor(dist / BAND);
    // Frozen wave: tiles swell on every other ring and shrink toward the edges.
    const wave = 0.5 + 0.5 * Math.cos(((dist - 20) / 28) * Math.PI);
    const size = Math.max(2.5, (3 + 8 * wave) * (1 - dist / 640));
    const fill =
      (i * 7 + j * 13) % 17 === 0 || wave > 0.85 ? "#93c5fd" : wave > 0.45 ? "#4474ff" : "#0d59ff";
    (BANDS[band] ??= []).push({ x, y, size, fill });
  }
}

const OPTIONS = [
  { bar: 100, selected: false },
  { bar: 78, selected: false },
  { bar: 92, selected: true },
  { bar: 88, selected: false },
];
const OPTION_Y0 = CARD.y + 64;
const OPTION_H = 23;
const OPTION_GAP = 5;

const SuperQuizArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="superquiz-bg" cx="50%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="superquiz-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <radialGradient id="superquiz-halo">
            <stop offset="0%" stopColor="#0d59ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0d59ff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="superquiz-card" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#13204a" />
            <stop offset="100%" stopColor="#070d22" />
          </linearGradient>

          <linearGradient id="superquiz-pick" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0d59ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#4474ff" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="superquiz-progress" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0d59ff" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          <filter id="superquiz-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes superquizRipple {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            18% { transform: scale(1.035); opacity: 1; }
            40% { transform: scale(1); opacity: 0.3; }
          }
          @keyframes superquizPick {
            0%, 100% { opacity: 0.55; }
            50% { opacity: 1; }
          }
          .superquiz-band {
            transform-origin: ${ORIGIN.x}px ${ORIGIN.y}px;
            opacity: 0.6;
            animation: superquizRipple 4.8s cubic-bezier(0.33, 0, 0.3, 1) infinite;
          }
          .superquiz-pick {
            animation: superquizPick 2.4s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .superquiz-band, .superquiz-pick { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#superquiz-bg)" />
        <rect width="640" height="320" fill="url(#superquiz-grid)" opacity="0.07" />

        {/* Rippling tile grid (Anime.js stagger-from-centre feel) */}
        {BANDS.map((tiles, band) => (
          <g
            key={band}
            className="superquiz-band"
            style={{ animationDelay: `${(band * 0.16).toFixed(2)}s` }}
            opacity={Math.max(0.35, 1 - band * 0.06)}
          >
            {tiles.map((t) => (
              <rect
                key={`${t.x}-${t.y}`}
                x={t.x - t.size / 2}
                y={t.y - t.size / 2}
                width={t.size}
                height={t.size}
                rx={Math.min(2.5, t.size / 3)}
                fill={t.fill}
              />
            ))}
          </g>
        ))}

        {/* Category tiles */}
        {CATEGORIES.map((c) => (
          <g key={`${c.x}-${c.y}`} transform={`translate(${c.x} ${c.y})`}>
            <rect
              x="-17"
              y="-17"
              width="34"
              height="34"
              rx="8"
              fill="#0b1532"
              stroke="#4474ff"
              strokeWidth="1.3"
            />
            <path
              d={c.icon}
              fill="none"
              stroke="#93c5fd"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}

        {/* ===== Question card ===== */}
        <ellipse cx={ORIGIN.x} cy={ORIGIN.y} rx="190" ry="140" fill="url(#superquiz-halo)" />
        <rect
          x={CARD.x + 3}
          y={CARD.y + 6}
          width={CARD.w}
          height={CARD.h}
          rx="14"
          fill="#01030a"
          opacity="0.7"
        />
        <rect
          x={CARD.x}
          y={CARD.y}
          width={CARD.w}
          height={CARD.h}
          rx="14"
          fill="url(#superquiz-card)"
          stroke="#4474ff"
          strokeWidth="1.6"
        />

        {/* Question badge + prompt lines */}
        <circle
          cx={CARD.x + 30}
          cy={CARD.y + 26}
          r="15"
          fill="#0d59ff"
          filter="url(#superquiz-glow)"
        />
        <path
          d={`M${CARD.x + 25} ${CARD.y + 21.5} C${CARD.x + 25} ${CARD.y + 15} ${CARD.x + 35} ${CARD.y + 15} ${CARD.x + 35} ${CARD.y + 21.5} C${CARD.x + 35} ${CARD.y + 25.5} ${CARD.x + 30} ${CARD.y + 26} ${CARD.x + 30} ${CARD.y + 30}`}
          fill="none"
          stroke="#eaf2ff"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx={CARD.x + 30} cy={CARD.y + 35} r="1.7" fill="#eaf2ff" />
        <rect
          x={CARD.x + 56}
          y={CARD.y + 16}
          width="122"
          height="7"
          rx="3.5"
          fill="#93c5fd"
          opacity="0.85"
        />
        <rect
          x={CARD.x + 56}
          y={CARD.y + 30}
          width="82"
          height="7"
          rx="3.5"
          fill="#93c5fd"
          opacity="0.5"
        />

        {/* Progress: question 3 of 10 */}
        <g>
          {Array.from({ length: 10 }, (_, i) => (
            <rect
              key={i}
              x={CARD.x + 18 + i * 16.2}
              y={CARD.y + 50}
              width="12"
              height="4"
              rx="2"
              fill={i < 3 ? "url(#superquiz-progress)" : "#16234a"}
            />
          ))}
        </g>

        {/* Answer options */}
        {OPTIONS.map((o, i) => {
          const y = OPTION_Y0 + i * (OPTION_H + OPTION_GAP);
          const cy = y + OPTION_H / 2;
          return (
            <g key={i}>
              <rect
                x={CARD.x + 16}
                y={y}
                width={CARD.w - 32}
                height={OPTION_H}
                rx="8"
                fill={o.selected ? "url(#superquiz-pick)" : "#0a1330"}
                stroke={o.selected ? "#93c5fd" : "#4474ff"}
                strokeWidth={o.selected ? 1.6 : 1}
                strokeOpacity={o.selected ? 1 : 0.55}
              />
              <circle
                cx={CARD.x + 32}
                cy={cy}
                r="5.5"
                fill={o.selected ? "#eaf2ff" : "none"}
                stroke={o.selected ? "#eaf2ff" : "#4474ff"}
                strokeWidth="1.5"
              />
              {o.selected && <circle cx={CARD.x + 32} cy={cy} r="2.4" fill="#0d59ff" />}
              <rect
                x={CARD.x + 46}
                y={cy - 2.5}
                width={o.bar}
                height="5"
                rx="2.5"
                fill={o.selected ? "#eaf2ff" : "#60a5fa"}
                opacity={o.selected ? 0.95 : 0.45}
              />
              {o.selected && (
                <g className="superquiz-pick">
                  <circle
                    cx={CARD.x + CARD.w - 32}
                    cy={cy}
                    r="8"
                    fill="#0d59ff"
                    stroke="#eaf2ff"
                    strokeWidth="1.4"
                    filter="url(#superquiz-glow)"
                  />
                  <path
                    d={`M${CARD.x + CARD.w - 36} ${cy} L${CARD.x + CARD.w - 33} ${cy + 3} L${CARD.x + CARD.w - 28} ${cy - 3}`}
                    fill="none"
                    stroke="#eaf2ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )}
            </g>
          );
        })}

        {/* Caption */}
        <g transform="translate(205, 272)">
          <rect
            width="230"
            height="28"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="115"
            y="14"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            SUPER-QUIZ // ANIME.JS GRID
          </text>
        </g>
      </svg>
    </div>
  );
};

export default SuperQuizArt;
