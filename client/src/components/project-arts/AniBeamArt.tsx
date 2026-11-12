import React from "react";

/** Points of a five-pointed star centred on (cx, cy). */
const starPoints = (cx: number, cy: number, outer: number, inner: number): string =>
  Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

/** A four-pointed anime sparkle centred on (0, 0). */
const sparklePath = (s: number): string =>
  `M 0,${-s} Q 0,0 ${s},0 Q 0,0 0,${s} Q 0,0 ${-s},0 Q 0,0 0,${-s} Z`;

/** Card size in the fan, drawn with its bottom centre at (0, 0). */
const CARD_W = 100;
const CARD_H = 140;

interface FanCardProps {
  angle: number;
  children: React.ReactNode;
}

/** One anime frame card in the hand, rotated around a pivot below the stage. */
const FanCard: React.FC<FanCardProps> = ({ angle, children }) => (
  <g transform={`rotate(${angle} 320 450)`}>
    <g transform="translate(320, 254)">
      {/* Offset print shadow, like the cards on AniBeam's landing */}
      <rect
        x={-CARD_W / 2 + 6}
        y={-CARD_H + 6}
        width={CARD_W}
        height={CARD_H}
        rx="7"
        fill="#0d59ff"
        opacity="0.55"
      />
      <rect
        x={-CARD_W / 2}
        y={-CARD_H}
        width={CARD_W}
        height={CARD_H}
        rx="7"
        fill="#060a18"
        stroke="#dbeafe"
        strokeWidth="2.5"
      />
      {children}
    </g>
  </g>
);

const AniBeamArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="anibeam-bg" cx="50%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#050916" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <linearGradient id="anibeam-panel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#13235a" />
            <stop offset="100%" stopColor="#0b1328" />
          </linearGradient>

          <linearGradient id="anibeam-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0d59ff" />
            <stop offset="100%" stopColor="#0b1328" />
          </linearGradient>

          <radialGradient id="anibeam-iris" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="60%" stopColor="#4474ff" />
            <stop offset="100%" stopColor="#0d59ff" />
          </radialGradient>

          <linearGradient id="anibeam-card-back" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1b2a5e" />
            <stop offset="55%" stopColor="#0b1328" />
            <stop offset="100%" stopColor="#16204a" />
          </linearGradient>

          <linearGradient id="anibeam-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="45%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          <radialGradient id="anibeam-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#4474ff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0d59ff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="anibeam-sheen-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <filter id="anibeam-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="anibeam-pull-clip">
            <rect x="-56" y="-162" width="112" height="162" rx="8" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes anibeamFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-9px); }
          }
          @keyframes anibeamHalo {
            0%, 100% { opacity: 0.7; transform: scale(0.94); }
            50% { opacity: 1; transform: scale(1.06); }
          }
          @keyframes anibeamSheen {
            0%, 45% { transform: translateX(-150px); }
            85%, 100% { transform: translateX(150px); }
          }
          @keyframes anibeamTwinkle {
            0%, 100% { opacity: 0.15; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1); }
          }
          .anibeam-float {
            animation: anibeamFloat 5s ease-in-out infinite;
          }
          .anibeam-halo {
            transform-origin: 320px 128px;
            animation: anibeamHalo 5s ease-in-out infinite;
          }
          .anibeam-sheen {
            animation: anibeamSheen 6s ease-in-out infinite;
          }
          .anibeam-twinkle {
            transform-box: fill-box;
            transform-origin: center;
            animation: anibeamTwinkle 3.2s ease-in-out infinite;
          }
          .anibeam-twinkle-b { animation-delay: -1.1s; }
          .anibeam-twinkle-c { animation-delay: -2.2s; }
          @media (prefers-reduced-motion: reduce) {
            .anibeam-float, .anibeam-halo, .anibeam-sheen, .anibeam-twinkle { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#anibeam-bg)" />

        {/* Manga focus burst behind the pull */}
        <g opacity="0.12" fill="#4474ff">
          {Array.from({ length: 18 }, (_, i) => (
            <polygon
              key={i}
              points="320,128 312,-260 328,-260"
              transform={`rotate(${i * 20} 320 128)`}
            />
          ))}
        </g>
        <circle cx="320" cy="128" r="150" fill="url(#anibeam-halo)" className="anibeam-halo" />

        {/* The hand: four anime frame cards fanned out */}
        {/* Far left: a night city under a crescent moon */}
        <FanCard angle={-30}>
          <rect x="-43" y="-133" width="86" height="88" rx="2" fill="url(#anibeam-sky)" />
          <circle cx="-14" cy="-108" r="14" fill="#93c5fd" />
          <circle cx="-7" cy="-113" r="12" fill="#0b3bb0" />
          <path
            d="M -43,-45 V -62 H -32 V -72 H -20 V -58 H -10 V -80 H 2 V -64 H 12 V -70 H 24 V -56 H 34 V -66 H 43 V -45 Z"
            fill="#060a18"
          />
          <polygon points="-43,-39 43,-39 43,-7 -43,-7" fill="url(#anibeam-panel)" />
          <g stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round" opacity="0.8">
            <line x1="-36" y1="-30" x2="20" y2="-30" />
            <line x1="-28" y1="-23" x2="36" y2="-23" />
            <line x1="-36" y1="-16" x2="8" y2="-16" />
          </g>
        </FanCard>

        {/* Far right: a mountain at dawn */}
        <FanCard angle={30}>
          <rect x="-43" y="-133" width="86" height="126" rx="2" fill="url(#anibeam-panel)" />
          <circle cx="0" cy="-88" r="24" fill="#4474ff" opacity="0.9" />
          <g stroke="#0b1328" strokeWidth="3">
            <line x1="-26" y1="-82" x2="26" y2="-82" />
            <line x1="-24" y1="-74" x2="24" y2="-74" />
          </g>
          <polygon
            points="-43,-30 -6,-80 6,-80 43,-30"
            fill="#0d1e4f"
            stroke="#93c5fd"
            strokeWidth="1.5"
          />
          <polygon points="-11,-73 -6,-80 6,-80 11,-73 4,-68 0,-73 -5,-68" fill="#dbeafe" />
          <g fill="none" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round">
            <path d="M -38,-20 q 8,-6 16,0 t 16,0 t 16,0 t 16,0 t 16,0" />
            <path d="M -38,-12 q 8,-6 16,0 t 16,0 t 16,0 t 16,0 t 16,0" opacity="0.55" />
          </g>
        </FanCard>

        {/* Inner left: the big anime eye, a reaction close-up */}
        <FanCard angle={-15}>
          <polygon points="-43,-133 43,-133 43,-80 -43,-70" fill="url(#anibeam-panel)" />
          <g transform="translate(-7, 0)">
            <path
              d="M -33,-96 Q -6,-126 31,-108"
              fill="none"
              stroke="#dbeafe"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <ellipse cx="0" cy="-99" rx="12" ry="15" fill="url(#anibeam-iris)" />
            <ellipse cx="0" cy="-97" rx="5" ry="7" fill="#060a18" />
            <circle cx="-5" cy="-106" r="4" fill="#ffffff" />
            <circle cx="5" cy="-92" r="1.8" fill="#ffffff" />
            <path d="M -20,-82 Q 4,-78 22,-88" fill="none" stroke="#93c5fd" strokeWidth="1.6" />
          </g>
          <polygon points="-43,-64 -2,-68 -8,-7 -43,-7" fill="url(#anibeam-panel)" />
          <g stroke="#60a5fa" strokeWidth="1.4" opacity="0.75">
            <line x1="-40" y1="-56" x2="-10" y2="-30" />
            <line x1="-40" y1="-44" x2="-14" y2="-22" />
            <line x1="-40" y1="-32" x2="-18" y2="-14" />
          </g>
          <polygon points="4,-68 43,-74 43,-7 -2,-7" fill="url(#anibeam-panel)" />
          <path d={sparklePath(10)} transform="translate(21, -38)" fill="#93c5fd" />
        </FanCard>

        {/* Inner right: an action frame, speed lines and a sword slash */}
        <FanCard angle={15}>
          <rect x="-43" y="-133" width="86" height="126" rx="2" fill="url(#anibeam-panel)" />
          <g stroke="#4474ff" strokeWidth="1.4" opacity="0.8">
            {Array.from({ length: 12 }, (_, i) => (
              <line
                key={i}
                x1="0"
                y1="-118"
                x2="0"
                y2="-96"
                transform={`rotate(${i * 30} 0 -70)`}
              />
            ))}
          </g>
          <path
            d="M -36,-28 Q -10,-58 34,-118"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            d="M -36,-28 Q -10,-58 34,-118"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="0" cy="-70" r="5" fill="#dbeafe" />
        </FanCard>

        {/* The pull: a glowing gacha card drawn up out of the hand */}
        <g className="anibeam-float">
          <g transform="translate(320, 232)">
            <rect x="-50" y="-156" width="112" height="162" rx="8" fill="#f59e0b" opacity="0.5" />
            <g filter="url(#anibeam-glow)">
              <rect
                x="-56"
                y="-162"
                width="112"
                height="162"
                rx="8"
                fill="url(#anibeam-card-back)"
                stroke="url(#anibeam-gold)"
                strokeWidth="3.5"
              />
            </g>
            <rect
              x="-47"
              y="-153"
              width="94"
              height="144"
              rx="5"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1"
              opacity="0.6"
            />
            {/* Emblem */}
            <circle
              cx="0"
              cy="-92"
              r="33"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.5"
              opacity="0.55"
            />
            <circle
              cx="0"
              cy="-92"
              r="25"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="1"
              strokeDasharray="3 4"
              opacity="0.7"
            />
            <path
              d={sparklePath(30)}
              transform="translate(0, -92)"
              fill="url(#anibeam-gold)"
              filter="url(#anibeam-glow)"
            />
            {/* Rarity */}
            <g fill="#fbbf24">
              <polygon points={starPoints(-18, -36, 7, 3)} />
              <polygon points={starPoints(0, -36, 7, 3)} />
              <polygon points={starPoints(18, -36, 7, 3)} />
            </g>
            {/* Holo sheen sweeping the card */}
            <g clipPath="url(#anibeam-pull-clip)">
              <polygon
                points="-30,-170 10,-170 -20,10 -60,10"
                fill="url(#anibeam-sheen-fill)"
                className="anibeam-sheen"
              />
            </g>
          </g>
        </g>

        {/* Sparkles around the pull (the class sits on the inner path, so CSS transforms never replace the placement) */}
        {(
          [
            [236, 62, 9, "#fbbf24", ""],
            [410, 92, 7, "#93c5fd", " anibeam-twinkle-b"],
            [398, 38, 6, "#fde68a", " anibeam-twinkle-c"],
            [222, 132, 5, "#60a5fa", " anibeam-twinkle-b"],
          ] as const
        ).map(([x, y, s, fill, delay]) => (
          <g key={`${x}-${y}`} transform={`translate(${x}, ${y})`}>
            <path d={sparklePath(s)} fill={fill} className={`anibeam-twinkle${delay}`} />
          </g>
        ))}

        {/* Caption */}
        <g transform="translate(320, 298)">
          <rect
            x="-56"
            y="-12"
            width="112"
            height="24"
            rx="12"
            fill="#060a18"
            stroke="#4474ff"
            strokeOpacity="0.6"
          />
          <text
            x="0"
            y="1"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="11"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="bold"
            letterSpacing="3"
          >
            ANIBEAM
          </text>
        </g>
      </svg>
    </div>
  );
};

export default AniBeamArt;
