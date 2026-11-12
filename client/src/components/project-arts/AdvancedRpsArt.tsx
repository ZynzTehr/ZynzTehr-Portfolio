import React from "react";

/*
 * Advanced Rock Paper Scissors: the Frontend Mentor triangle board. Paper,
 * scissors and rock sit in vector rings at the corners of a triangle; chevrons
 * along each edge point from winner to loser and light up in turn, while a
 * persisted score card beside the board ticks from 11 to 12.
 */

type Kind = "paper" | "scissors" | "rock";

// Thick round-capped finger: a halo stroke in the disc colour, then the finger,
// so neighbouring fingers read as separate shapes.
const finger = (key: string, x1: number, y1: number, x2: number, y2: number, w: number) => (
  <g key={key}>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#eaf2ff" strokeWidth={w + 3.2} />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0b1328" strokeWidth={w} />
  </g>
);

// Hand silhouettes drawn in a ~60x60 box centred on 0,0.
const Hand: React.FC<{ kind: Kind }> = ({ kind }) => {
  if (kind === "paper") {
    return (
      <g strokeLinecap="round">
        {finger("p", 10, -1, 17, -18, 6.5)}
        {finger("r", 4, -2, 6.5, -27, 6.8)}
        {finger("m", -3, -2, -3, -29, 7)}
        {finger("i", -10, -1, -13, -25, 6.8)}
        <rect x="-14.5" y="-6" width="29" height="28" rx="10" fill="#0b1328" />
        {finger("t", -12, 12, -25, -1, 7.5)}
      </g>
    );
  }
  if (kind === "scissors") {
    return (
      <g strokeLinecap="round">
        {finger("m", 3, -2, 13, -28, 7.2)}
        {finger("i", -4, -2, -11, -28, 7.2)}
        <rect x="-13.5" y="-5" width="27" height="27" rx="10" fill="#0b1328" />
        <line x1="1" y1="-4" x2="1" y2="5" stroke="#eaf2ff" strokeWidth="2" />
        <line x1="7.5" y1="-4" x2="7.5" y2="4" stroke="#eaf2ff" strokeWidth="2" />
        {finger("t", -14, 10, 3, 8, 7.5)}
      </g>
    );
  }
  return (
    <g strokeLinecap="round">
      <rect x="-17" y="-16" width="34" height="34" rx="11" fill="#0b1328" />
      <g stroke="#eaf2ff" strokeWidth="2.2">
        <line x1="-8.5" y1="-15" x2="-8.5" y2="-3" />
        <line x1="0" y1="-15" x2="0" y2="-3" />
        <line x1="8.5" y1="-15" x2="8.5" y2="-3" />
      </g>
      {finger("t", -17, 7, 6, 2, 8)}
    </g>
  );
};

const NODES: { kind: Kind; x: number; y: number; ring: string }[] = [
  { kind: "paper", x: 214, y: 106, ring: "advancedrockpaperscissors-ringPaper" },
  { kind: "scissors", x: 390, y: 106, ring: "advancedrockpaperscissors-ringScissors" },
  { kind: "rock", x: 302, y: 206, ring: "advancedrockpaperscissors-ringRock" },
];

// Who beats whom: scissors -> paper, paper -> rock, rock -> scissors.
const BEATS: [number, number][] = [
  [1, 0],
  [0, 2],
  [2, 1],
];

const CHEVRONS = BEATS.flatMap(([from, to], edge) => {
  const a = NODES[from];
  const b = NODES[to];
  const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  return [0.4, 0.5, 0.6].map((t, k) => ({
    key: `${edge}-${k}`,
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    angle,
    delay: edge * 2 + k * 0.22,
  }));
});

const AdvancedRpsArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="advancedrockpaperscissors-bg" cx="45%" cy="45%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern
            id="advancedrockpaperscissors-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <radialGradient id="advancedrockpaperscissors-pool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1d3b8a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#1d3b8a" stopOpacity="0" />
          </radialGradient>

          <linearGradient
            id="advancedrockpaperscissors-ringPaper"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#4474ff" />
            <stop offset="100%" stopColor="#0d59ff" />
          </linearGradient>
          <linearGradient
            id="advancedrockpaperscissors-ringScissors"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#eaf2ff" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
          <linearGradient id="advancedrockpaperscissors-ringRock" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          <radialGradient id="advancedrockpaperscissors-disc" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c9dcff" />
          </radialGradient>

          <linearGradient id="advancedrockpaperscissors-card" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#15255a" />
            <stop offset="100%" stopColor="#0a1230" />
          </linearGradient>

          <filter id="advancedrockpaperscissors-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes advancedrockpaperscissorsChevron {
            0%, 100% { opacity: 0.32; }
            6%, 26% { opacity: 1; }
            34% { opacity: 0.32; }
          }
          @keyframes advancedrockpaperscissorsHalo {
            0%, 100% { opacity: 0; transform: scale(0.92); }
            8%, 24% { opacity: 0.85; transform: scale(1.06); }
            34% { opacity: 0; transform: scale(0.92); }
          }
          @keyframes advancedrockpaperscissorsOld {
            0%, 44% { opacity: 1; }
            50%, 94% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes advancedrockpaperscissorsNew {
            0%, 44% { opacity: 0; transform: translateY(8px); }
            50%, 94% { opacity: 1; transform: translateY(0px); }
            100% { opacity: 0; transform: translateY(8px); }
          }
          .advancedrockpaperscissors-chevron {
            opacity: 0.32;
            animation: advancedrockpaperscissorsChevron 6s ease-in-out infinite;
          }
          .advancedrockpaperscissors-halo {
            opacity: 0;
            transform-box: fill-box;
            transform-origin: center;
            animation: advancedrockpaperscissorsHalo 6s ease-in-out infinite;
          }
          .advancedrockpaperscissors-old {
            animation: advancedrockpaperscissorsOld 6s ease-in-out infinite;
          }
          .advancedrockpaperscissors-new {
            opacity: 0;
            animation: advancedrockpaperscissorsNew 6s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .advancedrockpaperscissors-chevron,
            .advancedrockpaperscissors-halo,
            .advancedrockpaperscissors-old,
            .advancedrockpaperscissors-new { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#advancedrockpaperscissors-bg)" />
        <rect width="640" height="320" fill="url(#advancedrockpaperscissors-grid)" opacity="0.07" />
        <ellipse cx="302" cy="146" rx="200" ry="130" fill="url(#advancedrockpaperscissors-pool)" />

        {/* Triangle track */}
        <polygon
          points={NODES.map((n) => `${n.x},${n.y}`).join(" ")}
          fill="none"
          stroke="#081026"
          strokeWidth="16"
          strokeLinejoin="round"
        />
        <polygon
          points={NODES.map((n) => `${n.x},${n.y}`).join(" ")}
          fill="none"
          stroke="#4474ff"
          strokeWidth="1.2"
          strokeLinejoin="round"
          opacity="0.35"
        />

        {/* "Beats" chevrons, winner -> loser, lighting one edge at a time */}
        <g
          fill="none"
          stroke="#93c5fd"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {CHEVRONS.map((c) => (
            <g key={c.key} transform={`translate(${c.x} ${c.y}) rotate(${c.angle})`}>
              <path
                className="advancedrockpaperscissors-chevron"
                d="M -4,-6 L 3,0 L -4,6"
                style={{ animationDelay: `${c.delay}s` }}
                filter="url(#advancedrockpaperscissors-glow)"
              />
            </g>
          ))}
        </g>

        {/* Gesture rings */}
        {NODES.map((n, i) => {
          const winsEdge = BEATS.findIndex(([from]) => from === i);
          return (
            <g key={n.kind} transform={`translate(${n.x} ${n.y}) scale(0.92)`}>
              <circle
                className="advancedrockpaperscissors-halo"
                r="52"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2"
                style={{ animationDelay: `${winsEdge * 2}s` }}
                filter="url(#advancedrockpaperscissors-glow)"
              />
              <circle r="46" fill="#0d59ff" opacity="0.12" />
              <circle cy="4" r="42" fill="#020308" opacity="0.6" />
              <circle r="38" fill="none" stroke={`url(#${n.ring})`} strokeWidth="10" />
              <circle r="33" fill="url(#advancedrockpaperscissors-disc)" />
              <circle r="33" fill="none" stroke="#0b1328" strokeWidth="1" opacity="0.25" />
              <g transform="translate(0 1) scale(0.88)">
                <Hand kind={n.kind} />
              </g>
            </g>
          );
        })}

        {/* Persisted score card */}
        <g transform="translate(484 98)">
          <rect
            x="-6"
            y="-6"
            width="140"
            height="132"
            rx="16"
            fill="none"
            stroke="#4474ff"
            strokeWidth="1.5"
            opacity="0.45"
          />
          <rect
            width="128"
            height="120"
            rx="12"
            fill="url(#advancedrockpaperscissors-card)"
            stroke="#93c5fd"
            strokeWidth="2"
          />
          <text
            x="64"
            y="26"
            textAnchor="middle"
            fill="#93c5fd"
            fontSize="11"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="3"
          >
            SCORE
          </text>
          <g
            fontSize="56"
            fontWeight="bold"
            fontFamily="sans-serif"
            fill="#eaf2ff"
            textAnchor="middle"
          >
            <text className="advancedrockpaperscissors-old" x="64" y="88">
              11
            </text>
            <text className="advancedrockpaperscissors-new" x="64" y="88">
              12
            </text>
          </g>
          {/* localStorage save pips */}
          <g fill="#60a5fa">
            <rect x="44" y="102" width="10" height="4" rx="2" />
            <rect x="59" y="102" width="10" height="4" rx="2" opacity="0.6" />
            <rect x="74" y="102" width="10" height="4" rx="2" opacity="0.3" />
          </g>
        </g>

        {/* Caption */}
        <g transform="translate(200, 272)">
          <rect
            width="240"
            height="28"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="120"
            y="14"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            ADVANCED-RPS // TRIANGLE BOARD
          </text>
        </g>
      </svg>
    </div>
  );
};

export default AdvancedRpsArt;
