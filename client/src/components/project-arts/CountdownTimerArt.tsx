import React from "react";

// Split-flap tile geometry (local units, scaled per unit group).
const TILE_W = 56;
const TILE_H = 92;
const HINGE = TILE_H / 2;
const TILE_GAP = 6;
const GROUP_W = TILE_W * 2 + TILE_GAP;
const GROUP_GAP = 22;
const CENTER_Y = 132;

// Stroke-drawn flap digits in a 36 x 56 box.
const DIGITS: Record<string, string> = {
  "0": "M18 4 C8 4 4 13 4 28 C4 43 8 52 18 52 C28 52 32 43 32 28 C32 13 28 4 18 4 Z",
  "1": "M10 13 L21 4 L21 52",
  "2": "M5 15 C5 8 11 4 18 4 C26 4 31 9 31 16 C31 24 25 30 5 52 L32 52",
  "3": "M5 9 C8 6 12 4 18 4 C26 4 31 9 31 15 C31 22 25 26 15 26 C26 26 32 31 32 39 C32 47 26 52 18 52 C12 52 7 50 4 46",
  "4": "M25 52 L25 4 L4 37 L33 37",
  "5": "M30 4 L9 4 L6 25 C10 22 13 21 18 21 C27 21 32 28 32 36 C32 46 26 52 17 52 C11 52 7 50 4 46",
  "6": "M29 7 C26 5 22 4 18 4 C9 4 4 14 4 30 C4 44 9 52 18 52 C27 52 32 46 32 37 C32 28 27 22 18 22 C11 22 6 26 4 32",
  "7": "M4 4 L32 4 L14 52",
  "8": "M18 26 C10 26 6 21 6 15 C6 8 11 4 18 4 C25 4 30 8 30 15 C30 21 26 26 18 26 C9 26 4 31 4 39 C4 47 10 52 18 52 C26 52 32 47 32 39 C32 31 27 26 18 26 Z",
  "9": "M7 49 C10 51 14 52 18 52 C27 52 32 42 32 26 C32 12 27 4 18 4 C9 4 4 10 4 19 C4 28 9 34 18 34 C25 34 30 30 32 24",
};

// Years, months, days, hours, minutes, seconds: receding into the distance
// with the seconds pair nearest the viewer. The last digit is mid-flip 7 -> 6.
const UNITS = ["01", "04", "12", "08", "35", "27"];
const SCALES = [0.42, 0.52, 0.63, 0.75, 0.87, 1];

const TOTAL_W = SCALES.reduce(
  (sum, s, i) => sum + GROUP_W * s + (i < SCALES.length - 1 ? GROUP_GAP * s : 0),
  0,
);
const GROUPS = SCALES.reduce<{ x: number; s: number; digits: string }[]>((acc, s, i) => {
  const prev = acc[i - 1];
  const x = prev ? prev.x + (GROUP_W + GROUP_GAP) * prev.s : (640 - TOTAL_W) / 2;
  acc.push({ x, s, digits: UNITS[i] });
  return acc;
}, []);

const TOP_HALF = `M0 ${HINGE} L0 7 Q0 0 7 0 L${TILE_W - 7} 0 Q${TILE_W} 0 ${TILE_W} 7 L${TILE_W} ${HINGE} Z`;
const BOTTOM_HALF = `M0 ${HINGE} L${TILE_W} ${HINGE} L${TILE_W} ${TILE_H - 7} Q${TILE_W} ${TILE_H} ${TILE_W - 7} ${TILE_H} L7 ${TILE_H} Q0 ${TILE_H} 0 ${TILE_H - 7} Z`;

// The clip sits on a wrapper so it is evaluated in tile space (hinge at y = HINGE),
// not in the digit's translated space; both halves then meet exactly on the split line.
const Digit: React.FC<{ d: string; half?: "top" | "bottom" }> = ({ d, half }) => (
  <g clipPath={half ? `url(#countdowntimer-clip-${half})` : undefined}>
    <path
      d={DIGITS[d]}
      transform="translate(10 18)"
      fill="none"
      stroke="url(#countdowntimer-ink)"
      strokeWidth="6.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

const TileShell: React.FC = () => (
  <g>
    <rect x="2" y="5" width={TILE_W} height={TILE_H} rx="7" fill="#01030a" opacity="0.7" />
    <path d={TOP_HALF} fill="url(#countdowntimer-top)" />
    <path d={BOTTOM_HALF} fill="url(#countdowntimer-bottom)" />
  </g>
);

const TileChrome: React.FC = () => (
  <g>
    <rect
      x="0.5"
      y="0.5"
      width={TILE_W - 1}
      height={TILE_H - 1}
      rx="7"
      fill="none"
      stroke="#4474ff"
      strokeWidth="1.3"
      opacity="0.75"
    />
    <line x1="1" y1={HINGE} x2={TILE_W - 1} y2={HINGE} stroke="#020308" strokeWidth="2.4" />
    <line
      x1="1"
      y1={HINGE + 1.6}
      x2={TILE_W - 1}
      y2={HINGE + 1.6}
      stroke="#4474ff"
      strokeWidth="0.8"
      opacity="0.45"
    />
  </g>
);

const StaticTile: React.FC<{ d: string; x: number }> = ({ d, x }) => (
  <g transform={`translate(${x} 0)`}>
    <TileShell />
    <Digit d={d} />
    <TileChrome />
  </g>
);

const CountdownTimerArt: React.FC = () => {
  const near = GROUPS[GROUPS.length - 1];
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="countdowntimer-bg" cx="62%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="countdowntimer-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <linearGradient id="countdowntimer-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b2d63" />
            <stop offset="100%" stopColor="#101c42" />
          </linearGradient>

          <linearGradient id="countdowntimer-bottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c1634" />
            <stop offset="100%" stopColor="#070d22" />
          </linearGradient>

          <linearGradient id="countdowntimer-ink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eaf2ff" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          <radialGradient id="countdowntimer-halo">
            <stop offset="0%" stopColor="#0d59ff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#0d59ff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="countdowntimer-floor" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4474ff" stopOpacity="0" />
            <stop offset="70%" stopColor="#4474ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4474ff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="countdowntimer-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <mask
            id="countdowntimer-reflect"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="640"
            height="320"
          >
            <rect
              x="0"
              y={CENTER_Y + TILE_H / 2 + 4}
              width="640"
              height="48"
              fill="url(#countdowntimer-fade)"
            />
          </mask>

          <clipPath id="countdowntimer-clip-top">
            <rect x="-4" y="-4" width={TILE_W + 8} height={HINGE + 4} />
          </clipPath>
          <clipPath id="countdowntimer-clip-bottom">
            <rect x="-4" y={HINGE} width={TILE_W + 8} height={HINGE + 4} />
          </clipPath>

          <filter id="countdowntimer-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes countdowntimerFoldTop {
            0% { transform: scale(1, 1); }
            26%, 100% { transform: scale(1, 0); }
          }
          @keyframes countdowntimerFoldBottom {
            0%, 26% { transform: scale(1, 0); }
            42%, 100% { transform: scale(1, 1); }
          }
          @keyframes countdowntimerShadeTop {
            0% { opacity: 0; }
            26%, 100% { opacity: 0.55; }
          }
          @keyframes countdowntimerShadeBottom {
            0%, 26% { opacity: 0.7; }
            42%, 100% { opacity: 0; }
          }
          @keyframes countdowntimerShadeUnder {
            0% { opacity: 0.35; }
            26%, 100% { opacity: 0; }
          }
          @keyframes countdowntimerEdge {
            0% { opacity: 0; }
            12% { opacity: 1; }
            26%, 100% { opacity: 0; }
          }
          @keyframes countdowntimerReset {
            0% { opacity: 1; }
            5%, 93% { opacity: 0; }
            99%, 100% { opacity: 1; }
          }
          @keyframes countdowntimerTick {
            0%, 100% { opacity: 0.35; }
            50% { opacity: 1; }
          }
          .countdowntimer-flap-top {
            transform-origin: ${TILE_W / 2}px ${HINGE}px;
            transform: scale(1, 0);
            animation: countdowntimerFoldTop 5s cubic-bezier(0.55, 0, 0.9, 0.6) -0.7s infinite;
          }
          .countdowntimer-flap-bottom {
            transform-origin: ${TILE_W / 2}px ${HINGE}px;
            transform: scale(1, 1);
            animation: countdowntimerFoldBottom 5s cubic-bezier(0.2, 0.7, 0.3, 1) -0.7s infinite;
          }
          .countdowntimer-shade-top {
            opacity: 0.55;
            animation: countdowntimerShadeTop 5s linear -0.7s infinite;
          }
          .countdowntimer-shade-bottom {
            opacity: 0;
            animation: countdowntimerShadeBottom 5s linear -0.7s infinite;
          }
          .countdowntimer-shade-under {
            opacity: 0;
            animation: countdowntimerShadeUnder 5s linear -0.7s infinite;
          }
          .countdowntimer-edge {
            opacity: 0;
            animation: countdowntimerEdge 5s linear -0.7s infinite;
          }
          .countdowntimer-reset {
            opacity: 0;
            animation: countdowntimerReset 5s ease-in-out -0.7s infinite;
          }
          .countdowntimer-tick {
            animation: countdowntimerTick 1s steps(2, jump-none) infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .countdowntimer-flap-top, .countdowntimer-flap-bottom,
            .countdowntimer-shade-top, .countdowntimer-shade-bottom,
            .countdowntimer-shade-under, .countdowntimer-edge, .countdowntimer-reset,
            .countdowntimer-tick { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#countdowntimer-bg)" />
        <rect width="640" height="320" fill="url(#countdowntimer-grid)" opacity="0.07" />
        <ellipse cx="430" cy={CENTER_Y} rx="250" ry="80" fill="url(#countdowntimer-halo)" />

        {/* Floor line the row stands on */}
        <line
          x1="20"
          y1={CENTER_Y + TILE_H / 2 + 8}
          x2="620"
          y2={CENTER_Y + TILE_H / 2 + 8}
          stroke="url(#countdowntimer-floor)"
          strokeWidth="1.2"
          opacity="0.6"
        />

        {/* Static unit groups, years (far) -> minutes */}
        {GROUPS.map((g, i) => {
          const isNear = i === GROUPS.length - 1;
          const y = CENTER_Y - (TILE_H / 2) * g.s;
          const depth = 0.45 + 0.55 * (i / (GROUPS.length - 1));
          const colonX = g.x + (GROUP_W + GROUP_GAP / 2) * g.s;
          return (
            <g key={i}>
              <g transform={`translate(${g.x} ${y}) scale(${g.s})`} opacity={depth}>
                <StaticTile d={g.digits[0]} x={0} />
                {!isNear && <StaticTile d={g.digits[1]} x={TILE_W + TILE_GAP} />}
              </g>
              {/* Faint reflection */}
              <rect
                mask="url(#countdowntimer-reflect)"
                x={g.x}
                y={CENTER_Y + (TILE_H / 2) * g.s + 10}
                width={GROUP_W * g.s}
                height={TILE_H * g.s}
                rx={7 * g.s}
                fill="#1b2d63"
                opacity={depth}
              />
              {/* Unit pip under each group */}
              <rect
                x={g.x + (GROUP_W / 2 - 14) * g.s}
                y={CENTER_Y + (TILE_H / 2) * g.s + 14}
                width={28 * g.s}
                height={4 * g.s}
                rx={2 * g.s}
                fill={isNear ? "#60a5fa" : "#4474ff"}
                opacity={isNear ? 1 : 0.25 + 0.4 * depth}
              />
              {/* Colon separators */}
              {i < GROUPS.length - 1 && (
                <g
                  fill="#60a5fa"
                  opacity={0.3 + 0.5 * depth}
                  className={i === GROUPS.length - 2 ? "countdowntimer-tick" : undefined}
                >
                  <circle cx={colonX} cy={CENTER_Y - 12 * g.s} r={3.2 * g.s} />
                  <circle cx={colonX} cy={CENTER_Y + 12 * g.s} r={3.2 * g.s} />
                </g>
              )}
            </g>
          );
        })}

        {/* Seconds ones digit: the flap mid-fold, 7 dropping to 6 */}
        <g transform={`translate(${near.x + TILE_W + TILE_GAP} ${CENTER_Y - TILE_H / 2})`}>
          <ellipse cx={TILE_W / 2} cy={HINGE} rx="60" ry="64" fill="url(#countdowntimer-halo)" />
          <TileShell />
          {/* Behind the falling flap: new top half (6), old bottom half (7) */}
          <Digit d="6" half="top" />
          <Digit d="7" half="bottom" />
          <path className="countdowntimer-shade-under" d={TOP_HALF} fill="#020308" />

          {/* Lower flap that lands once the fold passes vertical */}
          <g className="countdowntimer-flap-bottom">
            <path d={BOTTOM_HALF} fill="url(#countdowntimer-bottom)" />
            <Digit d="6" half="bottom" />
            <path className="countdowntimer-shade-bottom" d={BOTTOM_HALF} fill="#020308" />
          </g>

          <TileChrome />

          {/* Upper flap folding forward over the hinge */}
          <g className="countdowntimer-flap-top">
            <path d={TOP_HALF} fill="url(#countdowntimer-top)" />
            <Digit d="7" half="top" />
            <path className="countdowntimer-shade-top" d={TOP_HALF} fill="#020308" />
            <line
              className="countdowntimer-edge"
              x1="6"
              y1="0.8"
              x2={TILE_W - 6}
              y2="0.8"
              stroke="#eaf2ff"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#countdowntimer-glow)"
            />
          </g>

          {/* Blank-tile dip that hides the loop's reset from 26 back to 27 */}
          <g className="countdowntimer-reset">
            <TileShell />
            <TileChrome />
          </g>
        </g>

        {/* Caption */}
        <g transform="translate(215, 272)">
          <rect
            width="210"
            height="28"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="105"
            y="14"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            COUNTDOWN-TIMER // 3D FLIP
          </text>
        </g>
      </svg>
    </div>
  );
};

export default CountdownTimerArt;
