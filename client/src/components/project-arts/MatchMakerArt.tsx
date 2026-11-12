import React from "react";

/*
 * Match Maker: two profile cards face each other while their ten survey
 * answers stream inward as score bars and converge on a compatibility dial,
 * the closest total-difference match beating at its heart.
 */

// Ten survey answers (1-5) for each friend; small per-question differences.
const SCORES_A = [5, 3, 4, 2, 5, 1, 4, 3, 5, 2];
const SCORES_B = [4, 3, 5, 2, 4, 2, 4, 3, 5, 1];

const ROW_Y0 = 69;
const ROW_STEP = 15;
const BAR_UNIT = 10;
const LEFT_X = 180;
const RIGHT_X = 460;

const RING_CX = 320;
const RING_CY = 136;
const RING_R = 42;

// Point on the compatibility ring, measured clockwise from 12 o'clock.
const ringPoint = (fraction: number, radius: number): [number, number] => {
  const theta = fraction * 2 * Math.PI;
  return [RING_CX + radius * Math.sin(theta), RING_CY - radius * Math.cos(theta)];
};

const MATCH = 0.9;
const [ARC_X, ARC_Y] = ringPoint(MATCH, RING_R);
const ARC_PATH = `M ${RING_CX},${RING_CY - RING_R} A ${RING_R},${RING_R} 0 1 1 ${ARC_X.toFixed(2)},${ARC_Y.toFixed(2)}`;

const RING_TICKS = Array.from({ length: 20 }, (_, i) => {
  const [x1, y1] = ringPoint(i / 20, RING_R + 9);
  const [x2, y2] = ringPoint(i / 20, RING_R + (i % 5 === 0 ? 15 : 12));
  return { x1, y1, x2, y2, major: i % 5 === 0 };
});

const ROWS = SCORES_A.map((a, i) => {
  const y = ROW_Y0 + i * ROW_STEP;
  const b = SCORES_B[i];
  const leftTip = LEFT_X + a * BAR_UNIT;
  const rightTip = RIGHT_X - b * BAR_UNIT;
  return {
    y,
    a,
    b,
    leftTip,
    rightTip,
    leftCurve: `M ${leftTip + 4},${y} C ${leftTip + 30},${y} ${RING_CX - RING_R - 34},${RING_CY} ${RING_CX - RING_R - 16},${RING_CY}`,
    rightCurve: `M ${rightTip - 4},${y} C ${rightTip - 30},${y} ${RING_CX + RING_R + 34},${RING_CY} ${RING_CX + RING_R + 16},${RING_CY}`,
  };
});

// One profile card; the right-hand friend is the same card mirrored, with a bun.
const profileCard = (withBun: boolean) => (
  <g>
    <rect
      x="34"
      y="46"
      width="132"
      height="182"
      rx="14"
      fill="url(#matchmaker-card)"
      stroke="url(#matchmaker-card-stroke)"
      strokeWidth="2.2"
      filter="url(#matchmaker-glow)"
    />
    <g clipPath="url(#matchmaker-card-clip)">
      <circle cx="96" cy="118" r="62" fill="url(#matchmaker-halo)" />
      {withBun && (
        <circle
          cx="62"
          cy="92"
          r="17"
          fill="url(#matchmaker-person)"
          stroke="#93c5fd"
          strokeWidth="2"
        />
      )}
      {/* Side profile bust facing inward */}
      <path
        d="M 30,236 C 32,206 54,194 82,190 L 86,174
           C 68,164 60,144 62,120 C 64,88 88,68 116,70
           C 140,72 154,90 152,112 L 152,118
           C 156,124 160,130 162,135 C 159,138 155,139 154,140
           C 155,143 155,146 153,148 C 155,151 153,156 149,158
           C 145,165 137,168 128,168 L 122,180
           C 134,192 154,196 166,204 L 170,236 Z"
        fill="url(#matchmaker-person)"
        stroke="#93c5fd"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Ear */}
      <path
        d="M 92,118 C 84,114 80,128 90,134"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
    {/* Name pill on the card edge */}
    <rect
      x="58"
      y="218"
      width="84"
      height="20"
      rx="10"
      fill="#0b1328"
      stroke="#4474ff"
      strokeWidth="1.4"
    />
    <rect x="72" y="226" width="56" height="4" rx="2" fill="#93c5fd" opacity="0.8" />
  </g>
);

const MatchMakerArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="matchmaker-bg" cx="50%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="matchmaker-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <radialGradient id="matchmaker-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4474ff" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#4474ff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="matchmaker-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d59ff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0d59ff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="matchmaker-card" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#13204a" />
            <stop offset="100%" stopColor="#070d22" />
          </linearGradient>

          <linearGradient id="matchmaker-card-stroke" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#4474ff" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="matchmaker-person" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a4596" />
            <stop offset="100%" stopColor="#0f1a3c" />
          </linearGradient>

          <linearGradient id="matchmaker-bar-a" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d59ff" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          <linearGradient id="matchmaker-bar-b" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0d59ff" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          <linearGradient id="matchmaker-arc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eaf2ff" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#0d59ff" />
          </linearGradient>

          <clipPath id="matchmaker-card-clip">
            <rect x="34" y="46" width="132" height="182" rx="14" />
          </clipPath>

          <filter id="matchmaker-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes matchmakerBar {
            0%, 100% { transform: scaleX(1); }
            50% { transform: scaleX(0.82); }
          }
          @keyframes matchmakerFlow {
            0%, 100% { opacity: 0.18; }
            50% { opacity: 0.75; }
          }
          @keyframes matchmakerBeat {
            0%, 40%, 100% { transform: scale(1); }
            15% { transform: scale(1.14); }
            28% { transform: scale(1.04); }
          }
          .matchmaker-bar-a,
          .matchmaker-bar-b {
            transform-box: fill-box;
            animation: matchmakerBar 6s ease-in-out infinite;
          }
          .matchmaker-bar-a { transform-origin: left center; }
          .matchmaker-bar-b { transform-origin: right center; }
          .matchmaker-flow {
            animation: matchmakerFlow 3.6s ease-in-out infinite;
          }
          .matchmaker-heart {
            transform-box: fill-box;
            transform-origin: center;
            animation: matchmakerBeat 3.2s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .matchmaker-bar-a,
            .matchmaker-bar-b,
            .matchmaker-flow,
            .matchmaker-heart { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#matchmaker-bg)" />
        <rect width="640" height="320" fill="url(#matchmaker-grid)" opacity="0.07" />
        {/* Scene sits low so both cards clear the category pill */}
        <g transform="translate(0 18)">
          <ellipse cx={RING_CX} cy={RING_CY} rx="170" ry="120" fill="url(#matchmaker-aura)" />

          {/* Profile cards facing each other */}
          {profileCard(false)}
          <g transform="translate(640 0) scale(-1 1)">{profileCard(true)}</g>

          {/* Survey rails: answer slots for questions 1-10 */}
          <g fill="#4474ff" opacity="0.35">
            {ROWS.map((r) => (
              <React.Fragment key={r.y}>
                <rect
                  x={LEFT_X}
                  y={r.y - 2.5}
                  width={5 * BAR_UNIT}
                  height="5"
                  rx="2.5"
                  opacity="0.4"
                />
                <rect
                  x={RIGHT_X - 5 * BAR_UNIT}
                  y={r.y - 2.5}
                  width={5 * BAR_UNIT}
                  height="5"
                  rx="2.5"
                  opacity="0.4"
                />
              </React.Fragment>
            ))}
          </g>

          {/* Converging links from each answer to the dial */}
          <g fill="none" stroke="#60a5fa" strokeWidth="1.3">
            {ROWS.map((r, i) => (
              <g key={r.y} className="matchmaker-flow" style={{ animationDelay: `${-i * 0.36}s` }}>
                <path d={r.leftCurve} />
                <path d={r.rightCurve} />
              </g>
            ))}
          </g>

          {/* Score bars */}
          {ROWS.map((r, i) => (
            <React.Fragment key={r.y}>
              <rect
                className="matchmaker-bar-a"
                style={{ animationDelay: `${-i * 0.6}s` }}
                x={LEFT_X}
                y={r.y - 3.5}
                width={r.a * BAR_UNIT}
                height="7"
                rx="3.5"
                fill="url(#matchmaker-bar-a)"
              />
              <rect
                className="matchmaker-bar-b"
                style={{ animationDelay: `${-i * 0.6 - 0.3}s` }}
                x={r.rightTip}
                y={r.y - 3.5}
                width={r.b * BAR_UNIT}
                height="7"
                rx="3.5"
                fill="url(#matchmaker-bar-b)"
              />
            </React.Fragment>
          ))}

          {/* Compatibility dial */}
          <circle cx={RING_CX} cy={RING_CY} r={RING_R + 16} fill="#060a18" opacity="0.85" />
          <g stroke="#4474ff" strokeLinecap="round">
            {RING_TICKS.map((t, i) => (
              <line
                key={i}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                strokeWidth={t.major ? 2 : 1.2}
                opacity={t.major ? 0.9 : 0.5}
              />
            ))}
          </g>
          <circle
            cx={RING_CX}
            cy={RING_CY}
            r={RING_R}
            fill="none"
            stroke="#13204a"
            strokeWidth="8"
          />
          <path
            d={ARC_PATH}
            fill="none"
            stroke="url(#matchmaker-arc)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#matchmaker-glow)"
          />
          <circle cx={ARC_X} cy={ARC_Y} r="5" fill="#eaf2ff" />

          {/* Match heart: two halves locking together */}
          <g className="matchmaker-heart">
            <g
              transform={`translate(${RING_CX} ${RING_CY + 2}) scale(1.2) translate(${-RING_CX} ${-RING_CY})`}
            >
              <path
                d={`M ${RING_CX},${RING_CY + 18}
                C ${RING_CX - 30},${RING_CY} ${RING_CX - 22},${RING_CY - 24} ${RING_CX - 9},${RING_CY - 20}
                C ${RING_CX - 4},${RING_CY - 18} ${RING_CX - 1},${RING_CY - 14} ${RING_CX},${RING_CY - 11}
                C ${RING_CX + 1},${RING_CY - 14} ${RING_CX + 4},${RING_CY - 18} ${RING_CX + 9},${RING_CY - 20}
                C ${RING_CX + 22},${RING_CY - 24} ${RING_CX + 30},${RING_CY} ${RING_CX},${RING_CY + 18} Z`}
                fill="#ff7f50"
                stroke="#ffd2c2"
                strokeWidth="1.6"
                strokeLinejoin="round"
                filter="url(#matchmaker-glow)"
              />
              <path
                d={`M ${RING_CX - 13},${RING_CY - 10} C ${RING_CX - 17},${RING_CY - 6} ${RING_CX - 16},${RING_CY} ${RING_CX - 12},${RING_CY + 3}`}
                fill="none"
                stroke="#fff3ec"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.75"
              />
            </g>
          </g>
        </g>

        {/* Caption */}
        <g transform="translate(206, 276)">
          <rect
            width="228"
            height="28"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="114"
            y="14"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            MATCH-MAKER // CLOSEST SCORE
          </text>
        </g>
      </svg>
    </div>
  );
};

export default MatchMakerArt;
