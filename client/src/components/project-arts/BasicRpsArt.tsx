import React from "react";

/*
 * Basic Rock Paper Scissors: the original hand-styled version that uses real
 * objects instead of hands. A stone pile, a stack of ruled paper and a pair of
 * scissors wait as selection tiles (a soft hover lift moves across them), the
 * computer's monitor shuffles through the same three objects, and a wins / ties
 * / losses tally sits underneath.
 */

type Obj = "rock" | "paper" | "scissors";

// Each object is drawn in a ~80x80 box centred on 0,0.
const Thing: React.FC<{ kind: Obj }> = ({ kind }) => {
  if (kind === "rock") {
    return (
      <g strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M -32,18 L -31,4 L -22,-6 L -8,-10 L 0,-22 L 16,-21 L 27,-8 L 31,10 L 26,18 Z"
          fill="url(#basicrockpaperscissors-stone)"
          stroke="#93c5fd"
          strokeWidth="2.6"
        />
        <path
          d="M 0,-22 L 4,-6 L -8,-10 M 4,-6 L 27,-8 M 4,-6 L 10,12"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1.6"
          opacity="0.7"
        />
        <path d="M 3,-19 L 15,-18" stroke="#eaf2ff" strokeWidth="2" opacity="0.55" fill="none" />
        <path
          d="M -34,26 L -32,14 L -22,9 L -12,12 L -9,22 L -14,28 Z"
          fill="url(#basicrockpaperscissors-stone)"
          stroke="#93c5fd"
          strokeWidth="2.4"
        />
        <path
          d="M 6,27 L 6,16 L 16,10 L 28,13 L 32,23 L 26,29 Z"
          fill="url(#basicrockpaperscissors-stone)"
          stroke="#93c5fd"
          strokeWidth="2.4"
        />
        <path
          d="M -8,29 L -6,21 L 2,19 L 6,26 L 2,30 Z"
          fill="#1a2b62"
          stroke="#93c5fd"
          strokeWidth="2"
        />
      </g>
    );
  }
  if (kind === "paper") {
    return (
      <g strokeLinejoin="round">
        <rect
          x="-20"
          y="-28"
          width="42"
          height="54"
          rx="2"
          fill="#162a66"
          stroke="#4474ff"
          strokeWidth="2"
          transform="rotate(-10)"
        />
        <path
          d="M -22,-28 L 12,-28 L 22,-18 L 22,28 L -22,28 Z"
          fill="#eaf2ff"
          stroke="#93c5fd"
          strokeWidth="2"
          transform="rotate(6)"
        />
        <g transform="rotate(6)">
          <path d="M 12,-28 L 12,-18 L 22,-18" fill="#b7cdfa" stroke="#93c5fd" strokeWidth="1.6" />
          <g stroke="#4474ff" strokeWidth="1.4" opacity="0.75">
            <line x1="-17" y1="-16" x2="17" y2="-16" />
            <line x1="-17" y1="-8" x2="17" y2="-8" />
            <line x1="-17" y1="0" x2="17" y2="0" />
            <line x1="-17" y1="8" x2="17" y2="8" />
            <line x1="-17" y1="16" x2="17" y2="16" />
          </g>
          <line
            x1="-11"
            y1="-26"
            x2="-11"
            y2="26"
            stroke="#0d59ff"
            strokeWidth="1.4"
            opacity="0.6"
          />
        </g>
      </g>
    );
  }
  return (
    <g transform="rotate(22)" strokeLinejoin="round" strokeLinecap="round">
      {/* blades */}
      <path
        d="M 2,9 L -17,-37 Q -15,-41 -12,-38 L 11,3 Z"
        fill="#dbe8ff"
        stroke="#93c5fd"
        strokeWidth="1.8"
      />
      <path
        d="M -2,9 L 17,-37 Q 15,-41 12,-38 L -11,3 Z"
        fill="#b7cdfa"
        stroke="#93c5fd"
        strokeWidth="1.8"
      />
      {/* ring handles */}
      <ellipse cx="-12" cy="21" rx="8.5" ry="10.5" fill="none" stroke="#0d59ff" strokeWidth="6" />
      <ellipse cx="12" cy="21" rx="8.5" ry="10.5" fill="none" stroke="#4474ff" strokeWidth="6" />
      <circle cx="0" cy="-4" r="2.8" fill="#0b1328" stroke="#93c5fd" strokeWidth="1.4" />
    </g>
  );
};

const TILES: { kind: Obj; x: number }[] = [
  { kind: "rock", x: 98 },
  { kind: "paper", x: 202 },
  { kind: "scissors", x: 306 },
];

const TALLY: { label: string; count: number; fill: string }[] = [
  { label: "W", count: 3, fill: "#60a5fa" },
  { label: "T", count: 2, fill: "#93c5fd" },
  { label: "L", count: 1, fill: "#4474ff" },
];

const BasicRpsArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="basicrockpaperscissors-bg" cx="40%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern
            id="basicrockpaperscissors-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <radialGradient id="basicrockpaperscissors-pool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d59ff" stopOpacity="0.16" />
            <stop offset="60%" stopColor="#0d59ff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#0d59ff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="basicrockpaperscissors-tile" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14245a" />
            <stop offset="100%" stopColor="#080f26" />
          </linearGradient>

          <linearGradient id="basicrockpaperscissors-stone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a4594" />
            <stop offset="100%" stopColor="#0f1a3c" />
          </linearGradient>

          <linearGradient id="basicrockpaperscissors-screen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f1d48" />
            <stop offset="100%" stopColor="#060b1d" />
          </linearGradient>

          <filter id="basicrockpaperscissors-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes basicrockpaperscissorsLift {
            0%, 100% { transform: translateY(0px); }
            6%, 27% { transform: translateY(-8px); }
            33% { transform: translateY(0px); }
          }
          @keyframes basicrockpaperscissorsPick {
            0%, 100% { opacity: 0; }
            6%, 27% { opacity: 1; }
            33% { opacity: 0; }
          }
          @keyframes basicrockpaperscissorsShuffle {
            0% { opacity: 0; transform: scale(0.85); }
            3%, 36% { opacity: 1; transform: scale(1); }
            40%, 100% { opacity: 0; transform: scale(0.85); }
          }
          @keyframes basicrockpaperscissorsDots {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
          }
          .basicrockpaperscissors-lift {
            animation: basicrockpaperscissorsLift 6s ease-in-out infinite;
          }
          .basicrockpaperscissors-pick {
            opacity: 0;
            animation: basicrockpaperscissorsPick 6s ease-in-out infinite;
          }
          .basicrockpaperscissors-shuffle {
            opacity: 0;
            transform-box: fill-box;
            transform-origin: center;
            animation: basicrockpaperscissorsShuffle 6s ease-in-out infinite;
          }
          .basicrockpaperscissors-dot {
            animation: basicrockpaperscissorsDots 1.8s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .basicrockpaperscissors-lift,
            .basicrockpaperscissors-pick,
            .basicrockpaperscissors-shuffle,
            .basicrockpaperscissors-dot { animation: none; }
            .basicrockpaperscissors-shuffle-first { opacity: 1; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#basicrockpaperscissors-bg)" />
        <rect width="640" height="320" fill="url(#basicrockpaperscissors-grid)" opacity="0.07" />
        <ellipse cx="202" cy="134" rx="200" ry="104" fill="url(#basicrockpaperscissors-pool)" />

        {/* ===== Player's selection tiles: real objects ===== */}
        {TILES.map((t, i) => (
          <g
            key={t.kind}
            className="basicrockpaperscissors-lift"
            style={{ animationDelay: `${i * 2}s` }}
          >
            <g transform={`translate(${t.x} 128)`}>
              <rect
                className="basicrockpaperscissors-pick"
                x="-46"
                y="-52"
                width="92"
                height="104"
                rx="16"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2.5"
                style={{ animationDelay: `${i * 2}s` }}
                filter="url(#basicrockpaperscissors-glow)"
              />
              <rect
                x="-42"
                y="-48"
                width="84"
                height="96"
                rx="13"
                fill="url(#basicrockpaperscissors-tile)"
                stroke="#4474ff"
                strokeWidth="1.4"
                strokeOpacity="0.6"
              />
              <Thing kind={t.kind} />
            </g>
          </g>
        ))}

        {/* Tally: wins / ties / losses */}
        <g transform="translate(110 220)">
          {TALLY.map((row, i) => (
            <g key={row.label} transform={`translate(${i * 66} 0)`}>
              <text
                x="0"
                y="4"
                fill="#93c5fd"
                fontSize="11"
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
                fontWeight="bold"
              >
                {row.label}
              </text>
              {Array.from({ length: 3 }, (_, k) => (
                <circle
                  key={k}
                  cx={16 + k * 11}
                  cy="0"
                  r="3.6"
                  fill={k < row.count ? row.fill : "none"}
                  stroke={row.fill}
                  strokeWidth="1.4"
                  opacity={k < row.count ? 1 : 0.4}
                />
              ))}
            </g>
          ))}
        </g>

        {/* VS divider: two chevrons facing off */}
        <g
          transform="translate(0 8)"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 372,106 L 384,120 L 372,134" />
          <path d="M 406,106 L 394,120 L 406,134" />
          <line
            x1="389"
            y1="62"
            x2="389"
            y2="92"
            stroke="#4474ff"
            strokeWidth="1.4"
            opacity="0.5"
          />
          <line
            x1="389"
            y1="148"
            x2="389"
            y2="178"
            stroke="#4474ff"
            strokeWidth="1.4"
            opacity="0.5"
          />
        </g>

        {/* ===== The computer chooses... ===== */}
        <g transform="translate(0 8)">
          <rect x="420" y="56" width="160" height="118" rx="12" fill="#0d59ff" opacity="0.08" />
          <rect
            x="428"
            y="62"
            width="144"
            height="104"
            rx="10"
            fill="url(#basicrockpaperscissors-screen)"
            stroke="#93c5fd"
            strokeWidth="2.5"
          />
          <rect
            x="436"
            y="70"
            width="128"
            height="88"
            rx="6"
            fill="none"
            stroke="#4474ff"
            strokeWidth="1"
            opacity="0.4"
          />
          {TILES.map((t, i) => (
            <g key={t.kind} transform={`translate(500 114) scale(0.82)`}>
              <g
                className={`basicrockpaperscissors-shuffle${i === 1 ? " basicrockpaperscissors-shuffle-first" : ""}`}
                style={{ animationDelay: `${(i * 2 + 2) % 6}s` }}
              >
                <Thing kind={t.kind} />
              </g>
            </g>
          ))}
          <path
            d="M 490,166 L 510,166 L 514,184 L 486,184 Z"
            fill="#0f1a3c"
            stroke="#4474ff"
            strokeWidth="1.6"
          />
          <rect
            x="466"
            y="184"
            width="68"
            height="7"
            rx="3.5"
            fill="#13204a"
            stroke="#4474ff"
            strokeWidth="1.6"
          />
          {/* thinking dots */}
          <g fill="#93c5fd">
            {[0, 1, 2].map((k) => (
              <circle
                key={k}
                className="basicrockpaperscissors-dot"
                cx={488 + k * 12}
                cy="208"
                r="3"
                style={{ animationDelay: `${k * 0.3}s` }}
              />
            ))}
          </g>
        </g>

        {/* Caption */}
        <g transform="translate(210, 272)">
          <rect
            width="220"
            height="28"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="110"
            y="14"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            BASIC-RPS // YOU VS CPU
          </text>
        </g>
      </svg>
    </div>
  );
};

export default BasicRpsArt;
