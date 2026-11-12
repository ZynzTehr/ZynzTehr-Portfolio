import React from "react";

/*
 * Rock Paper Scissors Lizard Spock: the five-way pentagon arena. Every gesture
 * beats its clockwise neighbour around the rim and the gesture two steps back
 * across the star, so ten directed "beats" edges form a pentagon wrapped around
 * a pentagram. Each gesture's two winning edges light in turn under a faint
 * starfield.
 */

type Kind = "scissors" | "paper" | "rock" | "lizard" | "spock";

const FG = "#0b1328";
const BG = "#eaf2ff";

const finger = (key: string, x1: number, y1: number, x2: number, y2: number, w: number) => (
  <g key={key}>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={BG} strokeWidth={w + 3.2} />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={FG} strokeWidth={w} />
  </g>
);

// Gesture glyphs in a ~60x60 box centred on 0,0.
const Gesture: React.FC<{ kind: Kind }> = ({ kind }) => {
  switch (kind) {
    case "paper":
      return (
        <g strokeLinecap="round">
          {finger("p", 10, -1, 17, -18, 6.5)}
          {finger("r", 4, -2, 6.5, -27, 6.8)}
          {finger("m", -3, -2, -3, -29, 7)}
          {finger("i", -10, -1, -13, -25, 6.8)}
          <rect x="-14.5" y="-6" width="29" height="28" rx="10" fill={FG} />
          {finger("t", -12, 12, -25, -1, 7.5)}
        </g>
      );
    case "scissors":
      return (
        <g strokeLinecap="round">
          {finger("m", 3, -2, 13, -28, 7.2)}
          {finger("i", -4, -2, -11, -28, 7.2)}
          <rect x="-13.5" y="-5" width="27" height="27" rx="10" fill={FG} />
          <line x1="1" y1="-4" x2="1" y2="5" stroke={BG} strokeWidth="2" />
          <line x1="7.5" y1="-4" x2="7.5" y2="4" stroke={BG} strokeWidth="2" />
          {finger("t", -14, 10, 3, 8, 7.5)}
        </g>
      );
    case "rock":
      return (
        <g strokeLinecap="round">
          <rect x="-17" y="-16" width="34" height="34" rx="11" fill={FG} />
          <g stroke={BG} strokeWidth="2.2">
            <line x1="-8.5" y1="-15" x2="-8.5" y2="-3" />
            <line x1="0" y1="-15" x2="0" y2="-3" />
            <line x1="8.5" y1="-15" x2="8.5" y2="-3" />
          </g>
          {finger("t", -17, 7, 6, 2, 8)}
        </g>
      );
    case "spock":
      // Vulcan salute: index + middle together, ring + pinky together, a V between.
      return (
        <g strokeLinecap="round">
          {finger("rp", 8, -2, 16, -24, 12.5)}
          {finger("im", -6.5, -2, -12, -27, 12.5)}
          <line x1="13.5" y1="-14" x2="17" y2="-22" stroke={BG} strokeWidth="1.8" />
          <line x1="-10" y1="-14" x2="-11.5" y2="-24" stroke={BG} strokeWidth="1.8" />
          <rect x="-14.5" y="-6" width="29" height="28" rx="10" fill={FG} />
          {finger("t", -12, 12, -26, 2, 7.5)}
        </g>
      );
    default:
      // Lizard, seen from above, head up and tail curling right.
      return (
        <g fill="none" stroke={FG} strokeLinecap="round" strokeLinejoin="round">
          <path d="M -3,-12 L -13,-15 L -16,-22" strokeWidth="4" />
          <path d="M 3,-11 L 13,-8 L 18,-13" strokeWidth="4" />
          <path d="M -3,9 L -13,11 L -16,18" strokeWidth="4" />
          <path d="M 3,8 L 12,4 L 17,8" strokeWidth="4" />
          <path d="M 0,-14 C 4,-5 -4,4 0,13" strokeWidth="10" />
          <path d="M 0,13 C 2,22 12,27 17,20" strokeWidth="5.5" />
          <path d="M 17,20 C 19,17 19,14 17,12" strokeWidth="3" />
          <ellipse cx="0" cy="-20" rx="6.5" ry="8.5" fill={FG} stroke="none" />
        </g>
      );
  }
};

const CX = 320;
const CY = 146;
const R = 98;
const NODE_R = 27;

// Clockwise from the top, matching the game board.
const ORDER: Kind[] = ["scissors", "paper", "rock", "lizard", "spock"];
const RING_STROKE = ["#eaf2ff", "#4474ff", "#0d59ff", "#60a5fa", "#93c5fd"];

const NODES = ORDER.map((kind, i) => {
  const theta = ((-90 + 72 * i) * Math.PI) / 180;
  return { kind, x: CX + R * Math.cos(theta), y: CY + R * Math.sin(theta) };
});

// i beats i+1 (rim) and i+3 (across the star).
const EDGES = NODES.flatMap((_, i) =>
  [1, 3].map((step) => {
    const a = NODES[i];
    const b = NODES[(i + step) % 5];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    const gap = NODE_R + 9;
    return {
      key: `${i}-${step}`,
      from: i,
      x1: a.x + ux * gap,
      y1: a.y + uy * gap,
      x2: b.x - ux * (gap + 2),
      y2: b.y - uy * (gap + 2),
      angle: (Math.atan2(dy, dx) * 180) / Math.PI,
    };
  }),
);

const STARS = [
  [40, 40, 1.4],
  [92, 96, 1],
  [58, 168, 1.6],
  [130, 34, 1.1],
  [150, 210, 1.2],
  [28, 236, 1],
  [110, 250, 1.4],
  [178, 128, 1],
  [520, 46, 1.4],
  [584, 92, 1],
  [612, 30, 1.2],
  [470, 112, 1.1],
  [560, 176, 1.6],
  [604, 228, 1.1],
  [500, 232, 1],
  [454, 30, 1],
] as const;

const RpsSpockArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="rockpaperscissorsspock-bg" cx="50%" cy="44%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern
            id="rockpaperscissorsspock-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <radialGradient id="rockpaperscissorsspock-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1d3b8a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1d3b8a" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="rockpaperscissorsspock-disc" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c9dcff" />
          </radialGradient>

          <filter id="rockpaperscissorsspock-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes rockpaperscissorsspockEdge {
            0%, 100% { opacity: 0; }
            4%, 17% { opacity: 1; }
            22% { opacity: 0; }
          }
          @keyframes rockpaperscissorsspockHalo {
            0%, 100% { opacity: 0; transform: scale(0.9); }
            4%, 17% { opacity: 0.9; transform: scale(1.08); }
            22% { opacity: 0; transform: scale(0.9); }
          }
          @keyframes rockpaperscissorsspockTwinkle {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.8; }
          }
          .rockpaperscissorsspock-edge {
            opacity: 0;
            animation: rockpaperscissorsspockEdge 10s ease-in-out infinite;
          }
          .rockpaperscissorsspock-halo {
            opacity: 0;
            transform-box: fill-box;
            transform-origin: center;
            animation: rockpaperscissorsspockHalo 10s ease-in-out infinite;
          }
          .rockpaperscissorsspock-star {
            opacity: 0.15;
            animation: rockpaperscissorsspockTwinkle 4s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .rockpaperscissorsspock-edge,
            .rockpaperscissorsspock-halo,
            .rockpaperscissorsspock-star { animation: none; }
            .rockpaperscissorsspock-edge.rockpaperscissorsspock-still { opacity: 1; }
            .rockpaperscissorsspock-halo.rockpaperscissorsspock-still { opacity: 0.9; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#rockpaperscissorsspock-bg)" />
        <rect width="640" height="320" fill="url(#rockpaperscissorsspock-grid)" opacity="0.06" />
        <g fill="#93c5fd">
          {STARS.map(([x, y, r], i) => (
            <circle
              key={`${x}-${y}`}
              className="rockpaperscissorsspock-star"
              cx={x}
              cy={y}
              r={r}
              style={{ animationDelay: `${(i * 0.7) % 4}s` }}
            />
          ))}
        </g>
        <circle cx={CX} cy={CY} r="150" fill="url(#rockpaperscissorsspock-core)" />

        {/* Pentagon track (as on the board) */}
        <polygon
          points={NODES.map((n) => `${n.x},${n.y}`).join(" ")}
          fill="none"
          stroke="#081026"
          strokeWidth="14"
          strokeLinejoin="round"
        />

        {/* All ten "beats" edges, dim */}
        <g stroke="#4474ff" strokeWidth="2" strokeLinecap="round" opacity="0.45">
          {EDGES.map((e) => (
            <line key={e.key} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
          ))}
        </g>

        {/* Lit edges: one gesture's two victories at a time */}
        <g filter="url(#rockpaperscissorsspock-glow)">
          {EDGES.map((e) => (
            <g
              key={e.key}
              className={`rockpaperscissorsspock-edge${e.from === 0 ? " rockpaperscissorsspock-still" : ""}`}
              style={{ animationDelay: `${e.from * 2}s` }}
            >
              <line
                x1={e.x1}
                y1={e.y1}
                x2={e.x2}
                y2={e.y2}
                stroke="#eaf2ff"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M -9,-6 L 1,0 L -9,6 Z"
                fill="#eaf2ff"
                transform={`translate(${e.x2} ${e.y2}) rotate(${e.angle})`}
              />
            </g>
          ))}
        </g>

        {/* Gesture rings */}
        {NODES.map((n, i) => (
          <g key={n.kind} transform={`translate(${n.x} ${n.y})`}>
            <circle
              className={`rockpaperscissorsspock-halo${i === 0 ? " rockpaperscissorsspock-still" : ""}`}
              r={NODE_R + 11}
              fill="none"
              stroke="#93c5fd"
              strokeWidth="2"
              style={{ animationDelay: `${i * 2}s` }}
              filter="url(#rockpaperscissorsspock-glow)"
            />
            <circle cy="3" r={NODE_R + 5} fill="#020308" opacity="0.6" />
            <circle r={NODE_R} fill="none" stroke={RING_STROKE[i]} strokeWidth="7" />
            <circle r={NODE_R - 3.5} fill="url(#rockpaperscissorsspock-disc)" />
            <g transform="translate(0 1) scale(0.62)">
              <Gesture kind={n.kind} />
            </g>
          </g>
        ))}

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
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            RPS-SPOCK // 5-WAY PENTAGON
          </text>
        </g>
      </svg>
    </div>
  );
};

export default RpsSpockArt;
