import React from "react";

// Profile Hub (jorgebucio.com): the site opens on a monarch resting on a block of
// deckle-edged paper, and every chapter is a sheet in that folio while a thin rail
// across the top tracks the six acts. Here the folio is six stacked sheets, the
// monarch sits on act I, and the act rail fills as each sheet's edge lights in turn.

type Pt = [number, number];

// Top face of the folio in a gentle three-quarter view (back-left, back-right,
// front-right, front-left). The block starts at y=74 so the card's top-left
// category pill never covers it.
const FACE: [Pt, Pt, Pt, Pt] = [
  [188, 116],
  [372, 74],
  [470, 132],
  [286, 174],
];
const SHEETS = 6;
const SHEET_STEP = 8;

// Small deterministic jitter so the front edges read as torn, handmade paper.
const jitter = (n: number) => {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s) - 0.5;
};

const f = (n: number) => n.toFixed(1);

const deckle = (from: Pt, to: Pt, seed: number, amp: number): string => {
  const steps = 14;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  let d = "";
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const j = i === steps ? 0 : jitter(seed * 31 + i) * amp;
    d += ` L${f(from[0] + dx * t + nx * j)} ${f(from[1] + dy * t + ny * j)}`;
  }
  return d;
};

const sheetGeometry = (index: number) => {
  const off = index * SHEET_STEP;
  const [a, b, c, dPt] = FACE.map(([x, y]) => [x, y + off] as Pt);
  const front = `M${f(a[0])} ${f(a[1])}${deckle(a, dPt, index + 1, 2.2)}${deckle(dPt, c, index + 7, 2.2)}`;
  const face = `M${f(b[0])} ${f(b[1])} L${f(a[0])} ${f(a[1])}${deckle(a, dPt, index + 1, 2.2)}${deckle(dPt, c, index + 7, 2.2)} Z`;
  return { face, front };
};

// Drawn bottom (act VI) to top (act I) so each sheet covers the one beneath.
const STACK = Array.from({ length: SHEETS }, (_, i) => SHEETS - 1 - i).map((index) => ({
  index,
  ...sheetGeometry(index),
}));

// The monarch's shadow falls only on the top sheet, never over the stacked edges.
const TOP_FACE = sheetGeometry(0).face;

// Act rail: six ticks, I to VI, filled left to right.
const RAIL_X = 132;
const RAIL_W = 376;
const RAIL_Y = 250;
const NUMERALS = ["I", "II", "III", "IV", "V", "VI"];
const TICKS = NUMERALS.map((label, k) => ({ label, x: RAIL_X + (RAIL_W * k) / (SHEETS - 1) }));

// One cycle of the rail; each act lights when the fill reaches its tick.
const CYCLE = 10;
const FILL_SHARE = 0.85;
const actDelay = (k: number) => (CYCLE * FILL_SHARE * k) / (SHEETS - 1);

// Monarch wings, body at (0, 0) facing up; the left pair is the right pair mirrored.
const FOREWING = "M2 -3 C10 -20 26 -36 44 -40 C54 -42 58 -34 54 -24 C48 -12 34 -4 2 1 Z";
const HINDWING = "M2 1 C18 0 32 4 36 16 C38 28 28 36 18 34 C10 32 4 22 2 6 Z";
const FORE_VEINS = "M4 -2 L46 -34 M6 -1 C20 -12 34 -20 52 -26 M8 0 C24 -6 38 -10 50 -16";
const HIND_VEINS = "M4 3 L30 26 M4 4 C14 10 26 12 34 14 M3 5 C6 16 10 26 18 32";
const SPOTS: Pt[] = [
  [48, -36],
  [53, -30],
  [55, -24],
  [32, 30],
  [24, 33],
  [35, 22],
];

const ZynzTehrProfileArt: React.FC = () => {
  const wing = (shadow: boolean) => (
    <g className="zynztehrprofile-wing">
      <path
        d={FOREWING}
        fill={shadow ? "#01030a" : "url(#zynztehrprofile-monarch)"}
        stroke={shadow ? "none" : "#05081a"}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d={HINDWING}
        fill={shadow ? "#01030a" : "url(#zynztehrprofile-monarch)"}
        stroke={shadow ? "none" : "#05081a"}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {!shadow && (
        <>
          <path
            d={`${FORE_VEINS} ${HIND_VEINS}`}
            fill="none"
            stroke="#05081a"
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.85"
          />
          <g fill="#eaf2ff">
            {SPOTS.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" />
            ))}
          </g>
        </>
      )}
    </g>
  );

  const monarch = (shadow: boolean) => (
    <g>
      {wing(shadow)}
      <g transform="scale(-1 1)">{wing(shadow)}</g>
      <path
        d="M0 -12 C3 -10 3 14 0 22 C-3 14 -3 -10 0 -12 Z"
        fill={shadow ? "#01030a" : "#05081a"}
        stroke={shadow ? "none" : "#1e2b55"}
        strokeWidth="1"
      />
      {!shadow && (
        <path
          d="M-1 -11 C-4 -20 -8 -26 -12 -30 M1 -11 C4 -20 8 -26 12 -30"
          fill="none"
          stroke="#05081a"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      )}
    </g>
  );

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="zynztehrprofile-bg" cx="56%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="zynztehrprofile-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <radialGradient id="zynztehrprofile-bloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d59ff" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#0d59ff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0d59ff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="zynztehrprofile-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a2a5c" />
            <stop offset="55%" stopColor="#13204a" />
            <stop offset="100%" stopColor="#0b1530" />
          </linearGradient>

          <linearGradient id="zynztehrprofile-under" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f1a3c" />
            <stop offset="100%" stopColor="#070d22" />
          </linearGradient>

          <linearGradient id="zynztehrprofile-monarch" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>

          <linearGradient id="zynztehrprofile-rail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d59ff" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          <filter id="zynztehrprofile-glow" x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="zynztehrprofile-topclip">
            <path d={TOP_FACE} />
          </clipPath>

          <filter id="zynztehrprofile-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        <style>{`
          @keyframes zynztehrprofileFlap {
            0%, 58%, 100% { transform: scaleX(1); }
            66% { transform: scaleX(0.42); }
            74% { transform: scaleX(1); }
            82% { transform: scaleX(0.5); }
            90% { transform: scaleX(1); }
          }
          @keyframes zynztehrprofileAct {
            0% { opacity: 0; }
            3%, 12% { opacity: 1; }
            16%, 100% { opacity: 0; }
          }
          @keyframes zynztehrprofileFill {
            0% { transform: scaleX(0); opacity: 1; }
            ${FILL_SHARE * 100}% { transform: scaleX(1); opacity: 1; }
            94% { transform: scaleX(1); opacity: 1; }
            100% { transform: scaleX(1); opacity: 0; }
          }
          @keyframes zynztehrprofileHead {
            0% { transform: translateX(0px); opacity: 1; }
            ${FILL_SHARE * 100}% { transform: translateX(${RAIL_W}px); opacity: 1; }
            94% { transform: translateX(${RAIL_W}px); opacity: 1; }
            100% { transform: translateX(${RAIL_W}px); opacity: 0; }
          }
          .zynztehrprofile-wing {
            transform-box: fill-box;
            transform-origin: left center;
            animation: zynztehrprofileFlap 5.5s ease-in-out infinite;
          }
          .zynztehrprofile-act {
            opacity: 0;
            animation: zynztehrprofileAct ${CYCLE}s ease-in-out infinite;
          }
          .zynztehrprofile-fill {
            transform-box: fill-box;
            transform-origin: left center;
            animation: zynztehrprofileFill ${CYCLE}s linear infinite;
          }
          .zynztehrprofile-head {
            animation: zynztehrprofileHead ${CYCLE}s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .zynztehrprofile-wing, .zynztehrprofile-act,
            .zynztehrprofile-fill, .zynztehrprofile-head { animation: none; }
            .zynztehrprofile-act-0 { opacity: 1; }
            .zynztehrprofile-head { opacity: 0; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#zynztehrprofile-bg)" />
        <rect width="640" height="320" fill="url(#zynztehrprofile-grid)" opacity="0.07" />

        {/* Shader-style bloom under the folio */}
        <ellipse cx="330" cy="168" rx="230" ry="96" fill="url(#zynztehrprofile-bloom)" />
        <ellipse
          cx="336"
          cy="222"
          rx="170"
          ry="16"
          fill="#000"
          opacity="0.55"
          filter="url(#zynztehrprofile-soft)"
        />

        {/* ===== The folio: six deckle-edged sheets, act I on top ===== */}
        {STACK.map(({ index, face, front }) => (
          <g key={index}>
            <path
              d={face}
              fill={index === 0 ? "url(#zynztehrprofile-top)" : "url(#zynztehrprofile-under)"}
              stroke="#4474ff"
              strokeWidth={index === 0 ? 2 : 1.2}
              strokeLinejoin="round"
              opacity={index === 0 ? 1 : 1 - index * 0.06}
            />
            {/* This act's edge lights as the rail reaches its tick */}
            <path
              className={`zynztehrprofile-act zynztehrprofile-act-${index}`}
              style={{ animationDelay: `${actDelay(index)}s` }}
              d={front}
              fill="none"
              stroke="#93c5fd"
              strokeWidth="2.4"
              strokeLinejoin="round"
              filter="url(#zynztehrprofile-glow)"
            />
          </g>
        ))}

        {/* Faint ruling on the top sheet, the chapter page */}
        <g stroke="#4474ff" strokeWidth="1" opacity="0.18" strokeLinecap="round">
          <line x1="232" y1="122" x2="356" y2="94" />
          <line x1="244" y1="130" x2="368" y2="102" />
        </g>

        {/* ===== Monarch resting on act I, with its long afternoon shadow ===== */}
        <g clipPath="url(#zynztehrprofile-topclip)">
          <g transform="translate(342 140) rotate(-18) skewX(-14) scale(0.74 0.56)" opacity="0.4">
            {monarch(true)}
          </g>
        </g>
        <g transform="translate(326 124) rotate(-18) skewX(-14) scale(0.86 0.7)">
          {monarch(false)}
        </g>

        {/* ===== Act rail: I to VI ===== */}
        <g>
          <line
            x1={RAIL_X}
            y1={RAIL_Y}
            x2={RAIL_X + RAIL_W}
            y2={RAIL_Y}
            stroke="#16234a"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <rect
            className="zynztehrprofile-fill"
            x={RAIL_X}
            y={RAIL_Y - 2}
            width={RAIL_W}
            height="4"
            rx="2"
            fill="url(#zynztehrprofile-rail)"
            filter="url(#zynztehrprofile-glow)"
          />
          {TICKS.map(({ label, x }) => (
            <g key={label}>
              <circle cx={x} cy={RAIL_Y} r="4" fill="#060a18" stroke="#60a5fa" strokeWidth="1.5" />
              <text
                x={x}
                y={RAIL_Y - 12}
                textAnchor="middle"
                fill="#60a5fa"
                fontSize="9"
                fontFamily="'IBM Plex Mono', ui-monospace, monospace"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                {label}
              </text>
            </g>
          ))}
          <g className="zynztehrprofile-head">
            <circle
              cx={RAIL_X}
              cy={RAIL_Y}
              r="4.5"
              fill="#eaf2ff"
              filter="url(#zynztehrprofile-glow)"
            />
          </g>
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
            PROFILE HUB // SIX ACTS
          </text>
        </g>
      </svg>
    </div>
  );
};

export default ZynzTehrProfileArt;
