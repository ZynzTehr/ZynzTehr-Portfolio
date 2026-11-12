import React from "react";

/*
 * Soda Diner: a retro fountain soda float sits on the diner counter and is
 * referenced by a stack of diner documents, each holding its favourite sodas;
 * the glass is one record in the sodas collection, the cards are diners.
 */

// Tulip fountain glass: bowl from the rim down to the stem, then the foot.
const GLASS_PATH =
  "M 116,66 C 118,124 140,172 166,198 L 169,222 C 152,225 140,229 138,236 " +
  "L 222,236 C 220,229 208,225 191,222 L 194,198 C 220,172 242,124 244,66 Z";
const BOWL_PATH = "M 119,66 C 121,122 142,170 167,195 L 193,195 C 218,170 239,122 241,66 Z";

// Whipped foam crown that spills over the rim.
const FOAM_PATH =
  "M 110,70 C 100,62 106,48 120,50 C 120,36 138,32 146,40 C 150,26 172,22 180,34 " +
  "C 188,22 210,26 212,40 C 222,32 240,38 238,50 C 252,48 258,62 248,70 " +
  "C 236,78 124,78 110,70 Z";

const BUBBLES = [
  { cx: 150, cy: 176, r: 3, delay: 0 },
  { cx: 172, cy: 186, r: 2.4, delay: -1.1 },
  { cx: 196, cy: 172, r: 3.4, delay: -2.3 },
  { cx: 210, cy: 150, r: 2.2, delay: -0.6 },
  { cx: 140, cy: 140, r: 2.6, delay: -3.1 },
  { cx: 184, cy: 156, r: 2, delay: -1.8 },
  { cx: 224, cy: 120, r: 2.8, delay: -2.7 },
  { cx: 162, cy: 124, r: 2.2, delay: -3.6 },
];

const CARD_X = 392;
const CARD_W = 214;
const CARD_H = 56;
const CARDS = [
  { y: 40, favourites: [true, false, false] },
  { y: 112, favourites: [false, true, false] },
  { y: 184, favourites: [true, false, true] },
];

const JOIN_X = 318;
// Right wall of the scaled glass at the join height.
const GLASS_EDGE_X = 230;
const JOIN_Y = 136;

// Small tulip glass glyph used for the soda chips on each diner card.
const miniGlass = (x: number, y: number, active: boolean) => (
  <g transform={`translate(${x} ${y})`}>
    <circle
      r="11"
      fill={active ? "#0d59ff" : "#0b1328"}
      stroke={active ? "#93c5fd" : "#4474ff"}
      strokeWidth="1.4"
      opacity={active ? 1 : 0.6}
    />
    <path
      d="M -5,-6 C -5,-1 -3,2 -1,3 L -1,5 L -3,6 L 3,6 L 1,5 L 1,3 C 3,2 5,-1 5,-6 Z"
      fill={active ? "#eaf2ff" : "#4474ff"}
      opacity={active ? 1 : 0.7}
    />
  </g>
);

const MongooseArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="sodadiner-bg" cx="40%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="sodadiner-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <pattern id="sodadiner-checker" width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="12" height="12" fill="#4474ff" />
            <rect x="12" y="12" width="12" height="12" fill="#4474ff" />
          </pattern>

          <pattern
            id="sodadiner-straw"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(35)"
          >
            <rect width="14" height="14" fill="#eaf2ff" />
            <rect width="7" height="14" fill="#f43f5e" />
          </pattern>

          <radialGradient id="sodadiner-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4474ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4474ff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="sodadiner-soda" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="45%" stopColor="#0d59ff" />
            <stop offset="100%" stopColor="#0a2a8a" />
          </linearGradient>

          <linearGradient id="sodadiner-glass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.22" />
            <stop offset="45%" stopColor="#93c5fd" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.16" />
          </linearGradient>

          <linearGradient id="sodadiner-foam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c7dcff" />
          </linearGradient>

          <linearGradient id="sodadiner-card" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#13204a" />
            <stop offset="100%" stopColor="#0a1230" />
          </linearGradient>

          <linearGradient id="sodadiner-counter" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4474ff" stopOpacity="0" />
            <stop offset="50%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#4474ff" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="sodadiner-floor-fade" cx="50%" cy="0%" r="55%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>

          <mask id="sodadiner-floor-mask">
            <rect x="40" y="241" width="280" height="28" fill="url(#sodadiner-floor-fade)" />
          </mask>

          <clipPath id="sodadiner-bowl-clip">
            <path d={BOWL_PATH} />
          </clipPath>

          <filter id="sodadiner-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes sodadinerRise {
            0% { transform: translateY(0px); opacity: 0; }
            15% { opacity: 0.9; }
            85% { opacity: 0.7; }
            100% { transform: translateY(-96px); opacity: 0; }
          }
          @keyframes sodadinerLink {
            0%, 100% { opacity: 0.25; }
            50% { opacity: 1; }
          }
          @keyframes sodadinerFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }
          .sodadiner-bubble {
            animation: sodadinerRise 4.2s ease-in infinite;
          }
          .sodadiner-link {
            animation: sodadinerLink 4s ease-in-out infinite;
          }
          .sodadiner-crown {
            animation: sodadinerFloat 6s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .sodadiner-bubble,
            .sodadiner-link,
            .sodadiner-crown { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#sodadiner-bg)" />
        <rect width="640" height="320" fill="url(#sodadiner-grid)" opacity="0.07" />
        <ellipse cx="182" cy="150" rx="150" ry="120" fill="url(#sodadiner-aura)" />

        {/* Diner counter and checker floor */}
        <rect
          x="40"
          y="241"
          width="280"
          height="28"
          fill="url(#sodadiner-checker)"
          opacity="0.4"
          mask="url(#sodadiner-floor-mask)"
        />
        <line x1="30" y1="240" x2="330" y2="240" stroke="url(#sodadiner-counter)" strokeWidth="2" />
        <ellipse cx="182" cy="241" rx="48" ry="5" fill="#0d59ff" opacity="0.35" />

        {/* Relation links: the soda is referenced by every diner's favourites */}
        <g fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round">
          <path d={`M ${GLASS_EDGE_X},${JOIN_Y} L ${JOIN_X},${JOIN_Y}`} opacity="0.8" />
          {CARDS.map((c, i) => (
            <path
              key={c.y}
              className="sodadiner-link"
              style={{ animationDelay: `${-i * 1.3}s` }}
              d={`M ${JOIN_X},${JOIN_Y} C ${JOIN_X + 40},${JOIN_Y} ${CARD_X - 40},${c.y + CARD_H / 2} ${CARD_X - 6},${c.y + CARD_H / 2}`}
            />
          ))}
        </g>
        <circle cx={GLASS_EDGE_X} cy={JOIN_Y} r="4" fill="#eaf2ff" />
        <circle cx={JOIN_X} cy={JOIN_Y} r="7" fill="#0b1328" stroke="#93c5fd" strokeWidth="2" />
        <circle cx={JOIN_X} cy={JOIN_Y} r="2.6" fill="#93c5fd" />

        {/* Soda float, scaled down to keep clear of the card's category pill */}
        <g transform="translate(34 46) scale(0.82)">
          {/* Straw, behind the glass, leaning away from the top-left corner */}
          <g transform="rotate(20 172 170)">
            <rect x="166" y="-20" width="12" height="198" rx="3" fill="url(#sodadiner-straw)" />
            <rect
              x="166"
              y="-20"
              width="12"
              height="198"
              rx="3"
              fill="none"
              stroke="#eaf2ff"
              strokeWidth="1"
              opacity="0.6"
            />
          </g>

          {/* Soda glass */}
          <g clipPath="url(#sodadiner-bowl-clip)">
            <rect
              x="110"
              y="72"
              width="140"
              height="130"
              fill="url(#sodadiner-soda)"
              opacity="0.92"
            />
            <rect x="110" y="72" width="140" height="5" fill="#93c5fd" opacity="0.7" />
            {BUBBLES.map((b, i) => (
              <circle
                key={i}
                className="sodadiner-bubble"
                style={{ animationDelay: `${b.delay}s` }}
                cx={b.cx}
                cy={b.cy}
                r={b.r}
                fill="none"
                stroke="#eaf2ff"
                strokeWidth="1.2"
              />
            ))}
          </g>
          <path
            d={GLASS_PATH}
            fill="url(#sodadiner-glass)"
            stroke="#93c5fd"
            strokeWidth="2.4"
            strokeLinejoin="round"
            filter="url(#sodadiner-glow)"
          />
          {/* Glass highlight and stem rings */}
          <path
            d="M 128,82 C 130,120 142,152 158,174"
            fill="none"
            stroke="#eaf2ff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.55"
          />
          <g stroke="#93c5fd" strokeWidth="1.6" opacity="0.7">
            <line x1="168" y1="206" x2="192" y2="206" />
            <line x1="168" y1="212" x2="192" y2="212" />
          </g>

          {/* Foam crown and cherry */}
          <g className="sodadiner-crown">
            <path
              d={FOAM_PATH}
              fill="url(#sodadiner-foam)"
              stroke="#93c5fd"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M 132,62 C 150,68 210,68 228,62"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="1.4"
              opacity="0.6"
            />
            <path
              d="M 198,24 C 200,14 208,8 216,6"
              fill="none"
              stroke="#eaf2ff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="196" cy="30" r="10" fill="#f43f5e" stroke="#ffd1d9" strokeWidth="1.4" />
            <circle cx="192" cy="26" r="2.6" fill="#ffe4e9" opacity="0.85" />
          </g>
        </g>

        {/* Diner documents */}
        {CARDS.map((c) => (
          <g key={c.y} transform={`translate(${CARD_X} ${c.y})`}>
            <rect
              width={CARD_W}
              height={CARD_H}
              rx="10"
              fill="url(#sodadiner-card)"
              stroke="#4474ff"
              strokeWidth="1.6"
            />
            {/* Port where the soda reference lands */}
            <circle cx="0" cy={CARD_H / 2} r="5" fill="#0b1328" stroke="#93c5fd" strokeWidth="2" />

            {/* Diner storefront glyph: scalloped awning over a door */}
            <rect x="14" y="10" width="36" height="36" rx="8" fill="#0d59ff" opacity="0.9" />
            <g fill="none" stroke="#eaf2ff" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M 19,20 H 45 V 23 A 3.25,3.25 0 0 1 38.5,23 A 3.25,3.25 0 0 1 32,23 A 3.25,3.25 0 0 1 25.5,23 A 3.25,3.25 0 0 1 19,23 Z" />
              <path d="M 21,27 V 40 H 43 V 27" />
              <rect x="29" y="31" width="6" height="9" />
            </g>

            {/* Name and location */}
            <rect x="62" y="14" width="74" height="8" rx="4" fill="#dbeafe" opacity="0.9" />
            <rect x="62" y="30" width="50" height="6" rx="3" fill="#60a5fa" opacity="0.6" />

            {/* Favourite sodas array */}
            <g>
              {c.favourites.map((on, j) => (
                <React.Fragment key={j}>{miniGlass(152 + j * 22, CARD_H / 2, on)}</React.Fragment>
              ))}
            </g>
          </g>
        ))}

        {/* Caption */}
        <g transform="translate(212, 276)">
          <rect
            width="216"
            height="28"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="108"
            y="14"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            SODA-DINER // MONGOOSE REFS
          </text>
        </g>
      </svg>
    </div>
  );
};

export default MongooseArt;
