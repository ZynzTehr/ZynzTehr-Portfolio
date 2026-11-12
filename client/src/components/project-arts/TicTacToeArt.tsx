import React from "react";

// Board geometry: a 3x3 grid centred at (320, 136).
const CELL = 66;
const BOARD_X = 320 - CELL * 1.5;
const BOARD_Y = 136 - CELL * 1.5;
const cellCenter = (col: number, row: number): [number, number] => [
  BOARD_X + CELL * (col + 0.5),
  BOARD_Y + CELL * (row + 0.5),
];

// Mid-game position: X has just completed the diagonal, O holds two cells.
const X_CELLS: Array<[number, number]> = [
  [0, 0],
  [1, 1],
  [2, 2],
];
const O_CELLS: Array<[number, number]> = [
  [2, 0],
  [0, 1],
];

// Win strike runs corner to corner along the X diagonal.
const [STRIKE_X1, STRIKE_Y1] = cellCenter(0, 0);
const [STRIKE_X2, STRIKE_Y2] = cellCenter(2, 2);
const STRIKE_PAD = 22;
const STRIKE_LEN = Math.hypot(STRIKE_X2 - STRIKE_X1, STRIKE_Y2 - STRIKE_Y1) + STRIKE_PAD * 2;

const XMark: React.FC<{ cx: number; cy: number; r: number; width: number }> = ({
  cx,
  cy,
  r,
  width,
}) => (
  <g strokeLinecap="round" strokeWidth={width}>
    <line x1={cx - r} y1={cy - r} x2={cx + r} y2={cy + r} />
    <line x1={cx + r} y1={cy - r} x2={cx - r} y2={cy + r} />
  </g>
);

// Score pips under a player card: filled = rounds won.
const Pips: React.FC<{ cx: number; y: number; won: number; color: string }> = ({
  cx,
  y,
  won,
  color,
}) => (
  <g>
    {[0, 1, 2].map((i) => (
      <circle
        key={i}
        cx={cx - 14 + i * 14}
        cy={y}
        r="4"
        fill={i < won ? color : "none"}
        stroke={color}
        strokeWidth="1.5"
        opacity={i < won ? 1 : 0.4}
      />
    ))}
  </g>
);

const TicTacToeArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="tictactoe-bg" cx="50%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="tictactoe-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <radialGradient id="tictactoe-boardGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d59ff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0d59ff" stopOpacity="0" />
          </radialGradient>

          <linearGradient
            id="tictactoe-gridLine"
            gradientUnits="userSpaceOnUse"
            x1="221"
            y1="37"
            x2="419"
            y2="235"
          >
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#0d59ff" />
          </linearGradient>

          <linearGradient id="tictactoe-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4474ff" />
            <stop offset="100%" stopColor="#0d59ff" />
          </linearGradient>

          <linearGradient id="tictactoe-card" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#111c3e" />
            <stop offset="100%" stopColor="#070d22" />
          </linearGradient>

          <linearGradient id="tictactoe-strike" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          <filter id="tictactoe-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="tictactoe-softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes tictactoeStrike {
            0%, 8% { transform: scaleX(0); opacity: 1; }
            30% { transform: scaleX(1); opacity: 1; }
            86% { transform: scaleX(1); opacity: 1; }
            96%, 100% { transform: scaleX(1); opacity: 0; }
          }
          @keyframes tictactoeWinPulse {
            0%, 26% { opacity: 0; }
            38% { opacity: 0.9; }
            80% { opacity: 0.5; }
            96%, 100% { opacity: 0; }
          }
          @keyframes tictactoeCrown {
            0%, 26% { opacity: 0.3; }
            38%, 86% { opacity: 1; }
            96%, 100% { opacity: 0.3; }
          }
          @keyframes tictactoeHalo {
            0%, 100% { opacity: 0.35; }
            50% { opacity: 0.85; }
          }
          .tictactoe-strike {
            transform-box: fill-box;
            transform-origin: left center;
            animation: tictactoeStrike 7s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          }
          .tictactoe-winCells {
            animation: tictactoeWinPulse 7s ease-in-out infinite;
          }
          .tictactoe-crown {
            animation: tictactoeCrown 7s ease-in-out infinite;
          }
          .tictactoe-halo {
            animation: tictactoeHalo 2.6s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .tictactoe-strike,
            .tictactoe-winCells,
            .tictactoe-crown,
            .tictactoe-halo { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#tictactoe-bg)" />
        <rect width="640" height="320" fill="url(#tictactoe-grid)" opacity="0.07" />
        <circle cx="320" cy="136" r="170" fill="url(#tictactoe-boardGlow)" />

        {/* ===== Player X card (winner) ===== */}
        <g>
          <rect
            className="tictactoe-halo"
            x="60"
            y="66"
            width="112"
            height="132"
            rx="18"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="6"
            opacity="0.5"
            filter="url(#tictactoe-glow)"
          />
          <rect
            x="64"
            y="70"
            width="104"
            height="124"
            rx="15"
            fill="url(#tictactoe-card)"
            stroke="#93c5fd"
            strokeWidth="2.5"
          />
          <g stroke="#eaf2ff" filter="url(#tictactoe-softGlow)">
            <XMark cx={116} cy={120} r={22} width={9} />
          </g>
          <line x1="84" y1="160" x2="148" y2="160" stroke="#4474ff" strokeWidth="1" opacity="0.5" />
          <Pips cx={116} y={176} won={2} color="#93c5fd" />

          {/* Winner crown, lit once the strike lands */}
          <g className="tictactoe-crown">
            <path
              d="M 105,216 L 103,207 L 110,211 L 116,205 L 122,211 L 129,207 L 127,216 Z"
              fill="#eaf2ff"
              stroke="#eaf2ff"
              strokeWidth="2"
              strokeLinejoin="round"
              filter="url(#tictactoe-softGlow)"
            />
          </g>
        </g>

        {/* ===== Player O card (waiting) ===== */}
        <g opacity="0.6">
          <rect
            x="472"
            y="70"
            width="104"
            height="124"
            rx="15"
            fill="url(#tictactoe-card)"
            stroke="#4474ff"
            strokeWidth="1.5"
          />
          <circle cx="524" cy="120" r="22" fill="none" stroke="#4474ff" strokeWidth="9" />
          <line
            x1="492"
            y1="160"
            x2="556"
            y2="160"
            stroke="#4474ff"
            strokeWidth="1"
            opacity="0.5"
          />
          <Pips cx={524} y={176} won={1} color="#4474ff" />
        </g>

        {/* ===== Board ===== */}
        <g>
          {/* Winning cells light up once the strike lands */}
          <g className="tictactoe-winCells" fill="#0d59ff" opacity="0">
            {X_CELLS.map(([c, r]) => (
              <rect
                key={`w${c}${r}`}
                x={BOARD_X + CELL * c + 7}
                y={BOARD_Y + CELL * r + 7}
                width={CELL - 14}
                height={CELL - 14}
                rx="10"
                opacity="0.28"
              />
            ))}
          </g>

          {/* Grid lines */}
          <g
            stroke="url(#tictactoe-gridLine)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#tictactoe-softGlow)"
          >
            <line
              x1={BOARD_X + CELL}
              y1={BOARD_Y + 4}
              x2={BOARD_X + CELL}
              y2={BOARD_Y + CELL * 3 - 4}
            />
            <line
              x1={BOARD_X + CELL * 2}
              y1={BOARD_Y + 4}
              x2={BOARD_X + CELL * 2}
              y2={BOARD_Y + CELL * 3 - 4}
            />
            <line
              x1={BOARD_X + 4}
              y1={BOARD_Y + CELL}
              x2={BOARD_X + CELL * 3 - 4}
              y2={BOARD_Y + CELL}
            />
            <line
              x1={BOARD_X + 4}
              y1={BOARD_Y + CELL * 2}
              x2={BOARD_X + CELL * 3 - 4}
              y2={BOARD_Y + CELL * 2}
            />
          </g>

          {/* O pieces */}
          {O_CELLS.map(([c, r]) => {
            const [cx, cy] = cellCenter(c, r);
            return (
              <circle
                key={`o${c}${r}`}
                cx={cx}
                cy={cy}
                r="19"
                fill="none"
                stroke="url(#tictactoe-ring)"
                strokeWidth="8"
              />
            );
          })}

          {/* X pieces */}
          <g stroke="#eaf2ff" filter="url(#tictactoe-softGlow)">
            {X_CELLS.map(([c, r]) => {
              const [cx, cy] = cellCenter(c, r);
              return <XMark key={`x${c}${r}`} cx={cx} cy={cy} r={17} width={8} />;
            })}
          </g>

          {/* Win strike, drawn corner to corner */}
          <g
            transform={`translate(${STRIKE_X1} ${STRIKE_Y1}) rotate(45) translate(${-STRIKE_PAD} 0)`}
          >
            <rect
              className="tictactoe-strike"
              x="0"
              y="-5"
              width={STRIKE_LEN}
              height="10"
              rx="5"
              fill="url(#tictactoe-strike)"
              filter="url(#tictactoe-glow)"
            />
          </g>
        </g>

        {/* Caption */}
        <g transform="translate(212, 272)">
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
            TIC-TAC-TOE // X WINS · 2P
          </text>
        </g>
      </svg>
    </div>
  );
};

export default TicTacToeArt;
