import React from "react";

// A real two-ply minimax search. The AI plays O and is to move on ROOT;
// scores are from the AI's side (+1 win, 0 draw, -1 loss).
// Taking the centre blocks X's diagonal and forks two lines, so it is the only +1.
const ROOT = "XOX..O..X";

type Leaf = { cell: number; score: number };
type Branch = { cell: number; score: number; leaves: Leaf[] };

const TREE: Branch[] = [
  {
    cell: 3,
    score: -1,
    leaves: [
      { cell: 4, score: -1 },
      { cell: 6, score: 1 },
      { cell: 7, score: 1 },
    ],
  },
  {
    cell: 4,
    score: 1,
    leaves: [
      { cell: 3, score: 1 },
      { cell: 6, score: 1 },
      { cell: 7, score: 1 },
    ],
  },
  {
    cell: 6,
    score: -1,
    leaves: [
      { cell: 3, score: 0 },
      { cell: 4, score: -1 },
      { cell: 7, score: 0 },
    ],
  },
  {
    cell: 7,
    score: -1,
    leaves: [
      { cell: 3, score: 1 },
      { cell: 4, score: -1 },
      { cell: 6, score: 1 },
    ],
  },
];
const BEST_BRANCH = 1;
const BEST_LEAF = 0;

// Layout: root on top, four MIN boards, twelve leaves.
const ROOT_SIZE = 70;
const ROOT_X = 320 - ROOT_SIZE / 2;
const ROOT_Y = 14;
const MID_SIZE = 46;
const MID_Y = 110;
const LEAF_SIZE = 30;
const LEAF_GAP = 9;
const LEAF_Y = 190;
const GROUP_W = LEAF_SIZE * 3 + LEAF_GAP * 2;
const GROUP_GAP = 24;
const TREE_LEFT = (640 - (GROUP_W * 4 + GROUP_GAP * 3)) / 2;

const groupLeft = (b: number) => TREE_LEFT + b * (GROUP_W + GROUP_GAP);
const midX = (b: number) => groupLeft(b) + GROUP_W / 2 - MID_SIZE / 2;
const leafX = (b: number, l: number) => groupLeft(b) + l * (LEAF_SIZE + LEAF_GAP);

const place = (board: string, cell: number, mark: string) =>
  board.slice(0, cell) + mark + board.slice(cell + 1);

type BoardProps = {
  x: number;
  y: number;
  size: number;
  cells: string;
  fresh?: number;
  lit?: boolean;
};

// One mini board: panel, grid, X strokes and O rings. `fresh` is the move just made.
const MiniBoard: React.FC<BoardProps> = ({ x, y, size, cells, fresh, lit }) => {
  const c = size / 3;
  const mark = c * 0.27;
  const w = Math.max(1.4, size / 24);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        rx={size / 7}
        fill="url(#tictactoewithai-panel)"
        stroke={lit ? "#eaf2ff" : "#4474ff"}
        strokeWidth={lit ? 2 : 1.2}
        opacity={lit ? 1 : 0.85}
        filter={lit ? "url(#tictactoewithai-softGlow)" : undefined}
      />
      <g stroke="#4474ff" strokeWidth={Math.max(1, w * 0.6)} strokeLinecap="round" opacity="0.7">
        <line x1={x + c} y1={y + c * 0.25} x2={x + c} y2={y + size - c * 0.25} />
        <line x1={x + c * 2} y1={y + c * 0.25} x2={x + c * 2} y2={y + size - c * 0.25} />
        <line x1={x + c * 0.25} y1={y + c} x2={x + size - c * 0.25} y2={y + c} />
        <line x1={x + c * 0.25} y1={y + c * 2} x2={x + size - c * 0.25} y2={y + c * 2} />
      </g>
      {cells.split("").map((m, i) => {
        const cx = x + c * ((i % 3) + 0.5);
        const cy = y + c * (Math.floor(i / 3) + 0.5);
        const isFresh = i === fresh;
        if (m === "X") {
          return (
            <g
              key={i}
              stroke={isFresh ? "#eaf2ff" : "#60a5fa"}
              strokeWidth={w}
              strokeLinecap="round"
            >
              <line x1={cx - mark} y1={cy - mark} x2={cx + mark} y2={cy + mark} />
              <line x1={cx + mark} y1={cy - mark} x2={cx - mark} y2={cy + mark} />
            </g>
          );
        }
        if (m === "O") {
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={mark * 1.05}
              fill="none"
              stroke={isFresh ? "#eaf2ff" : "#93c5fd"}
              strokeWidth={w}
            />
          );
        }
        return null;
      })}
    </g>
  );
};

// Score chip: +1 solid sapphire, 0 outlined, -1 faint.
const Score: React.FC<{ cx: number; y: number; score: number; lit?: boolean }> = ({
  cx,
  y,
  score,
  lit,
}) => {
  const label = score > 0 ? "+1" : score < 0 ? "−1" : "0";
  const fill = score > 0 ? "#0d59ff" : "#0b1328";
  const stroke = lit ? "#eaf2ff" : score > 0 ? "#4474ff" : score < 0 ? "#1e3a8a" : "#4474ff";
  const text = score > 0 ? "#eaf2ff" : score < 0 ? "#4474ff" : "#93c5fd";
  return (
    <g>
      <rect
        x={cx - 12}
        y={y}
        width="24"
        height="14"
        rx="4"
        fill={fill}
        stroke={stroke}
        strokeWidth={lit ? 1.6 : 1}
        opacity={score < 0 ? 0.8 : 1}
      />
      <text
        x={cx}
        y={y + 7.5}
        textAnchor="middle"
        dominantBaseline="central"
        fill={text}
        fontSize="9"
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontWeight="bold"
      >
        {label}
      </text>
    </g>
  );
};

const MinimaxAiArt: React.FC = () => {
  const rootCx = 320;
  const rootBottom = ROOT_Y + ROOT_SIZE;
  const bestMidCx = midX(BEST_BRANCH) + MID_SIZE / 2;
  const bestLeafCx = leafX(BEST_BRANCH, BEST_LEAF) + LEAF_SIZE / 2;
  // The value bubbles up: leaf -> MIN node -> root.
  const hop1 = { dx: bestMidCx - bestLeafCx, dy: MID_Y + MID_SIZE - LEAF_Y };
  const hop2 = { dx: rootCx - bestLeafCx, dy: rootBottom - LEAF_Y };

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="tictactoewithai-bg" cx="50%" cy="30%" r="85%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="tictactoewithai-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <linearGradient id="tictactoewithai-panel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#111c3e" />
            <stop offset="100%" stopColor="#070d22" />
          </linearGradient>

          <radialGradient id="tictactoewithai-spot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d59ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0d59ff" stopOpacity="0" />
          </radialGradient>

          <filter id="tictactoewithai-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="tictactoewithai-softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes tictactoewithaiBubble {
            0%, 6% { transform: translate(0px, 0px); opacity: 0; }
            12% { transform: translate(0px, 0px); opacity: 1; }
            38% { transform: translate(${hop1.dx}px, ${hop1.dy}px); opacity: 1; }
            46% { transform: translate(${hop1.dx}px, ${MID_Y - LEAF_Y}px); opacity: 1; }
            72% { transform: translate(${hop2.dx}px, ${hop2.dy}px); opacity: 1; }
            80%, 100% { transform: translate(${hop2.dx}px, ${hop2.dy}px); opacity: 0; }
          }
          @keyframes tictactoewithaiMove {
            0%, 70% { opacity: 0.25; }
            80%, 94% { opacity: 1; }
            100% { opacity: 0.25; }
          }
          @keyframes tictactoewithaiPath {
            0%, 100% { opacity: 0.55; }
            50% { opacity: 1; }
          }
          .tictactoewithai-bubble {
            animation: tictactoewithaiBubble 6s ease-in-out infinite;
          }
          .tictactoewithai-move {
            animation: tictactoewithaiMove 6s ease-in-out infinite;
          }
          .tictactoewithai-path {
            animation: tictactoewithaiPath 3s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .tictactoewithai-bubble,
            .tictactoewithai-move,
            .tictactoewithai-path { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#tictactoewithai-bg)" />
        <rect width="640" height="320" fill="url(#tictactoewithai-grid)" opacity="0.07" />
        <ellipse cx="320" cy="60" rx="150" ry="70" fill="url(#tictactoewithai-spot)" />

        {/* Ply labels */}
        <g fontFamily="'JetBrains Mono', ui-monospace, monospace" fontWeight="bold" fontSize="9" letterSpacing="1">
          <path d="M 600,46 L 606,40 L 612,46 Z" fill="#60a5fa" />
          <text x="606" y="60" textAnchor="middle" fill="#60a5fa">
            MAX
          </text>
          <path d="M 600,128 L 606,134 L 612,128 Z" fill="#4474ff" />
          <text x="606" y="148" textAnchor="middle" fill="#4474ff">
            MIN
          </text>
        </g>

        {/* ===== Edges ===== */}
        <g fill="none" strokeLinecap="round">
          {TREE.map((branch, b) => {
            const mcx = midX(b) + MID_SIZE / 2;
            const onPath = b === BEST_BRANCH;
            return (
              <g key={`e${branch.cell}`}>
                {!onPath && (
                  <path
                    d={`M ${rootCx},${rootBottom} C ${rootCx},${rootBottom + 16} ${mcx},${MID_Y - 16} ${mcx},${MID_Y}`}
                    stroke="#4474ff"
                    strokeWidth="1.4"
                    opacity="0.4"
                  />
                )}
                {branch.leaves.map((leaf, l) => {
                  const lcx = leafX(b, l) + LEAF_SIZE / 2;
                  if (onPath && l === BEST_LEAF) return null;
                  return (
                    <path
                      key={leaf.cell}
                      d={`M ${mcx},${MID_Y + MID_SIZE} C ${mcx},${MID_Y + MID_SIZE + 12} ${lcx},${LEAF_Y - 12} ${lcx},${LEAF_Y}`}
                      stroke="#4474ff"
                      strokeWidth="1.2"
                      opacity="0.35"
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Chosen line of play */}
          <g
            className="tictactoewithai-path"
            stroke="#93c5fd"
            strokeWidth="3"
            filter="url(#tictactoewithai-glow)"
          >
            <path
              d={`M ${rootCx},${rootBottom} C ${rootCx},${rootBottom + 16} ${bestMidCx},${MID_Y - 16} ${bestMidCx},${MID_Y}`}
            />
            <path
              d={`M ${bestMidCx},${MID_Y + MID_SIZE} C ${bestMidCx},${MID_Y + MID_SIZE + 12} ${bestLeafCx},${LEAF_Y - 12} ${bestLeafCx},${LEAF_Y}`}
            />
          </g>
        </g>

        {/* ===== Root: AI (O) to move ===== */}
        <MiniBoard x={ROOT_X} y={ROOT_Y} size={ROOT_SIZE} cells={ROOT} lit />
        {/* The move minimax picks: O takes the centre */}
        <circle
          className="tictactoewithai-move"
          cx={rootCx}
          cy={ROOT_Y + ROOT_SIZE / 2}
          r={(ROOT_SIZE / 3) * 0.28}
          fill="none"
          stroke="#eaf2ff"
          strokeWidth="3"
          strokeDasharray="3 3"
          filter="url(#tictactoewithai-softGlow)"
        />
        <Score cx={rootCx + ROOT_SIZE / 2 + 22} y={ROOT_Y + ROOT_SIZE / 2 - 7} score={1} lit />

        {/* ===== MIN layer: X replies ===== */}
        {TREE.map((branch, b) => {
          const board = place(ROOT, branch.cell, "O");
          const x = midX(b);
          const lit = b === BEST_BRANCH;
          return (
            <g key={`m${branch.cell}`} opacity={lit ? 1 : 0.8}>
              <MiniBoard
                x={x}
                y={MID_Y}
                size={MID_SIZE}
                cells={board}
                fresh={branch.cell}
                lit={lit}
              />
              <Score
                cx={x + MID_SIZE + 18}
                y={MID_Y + MID_SIZE / 2 - 7}
                score={branch.score}
                lit={lit}
              />
            </g>
          );
        })}

        {/* ===== Leaves with backed-up scores ===== */}
        {TREE.map((branch, b) => {
          const after = place(ROOT, branch.cell, "O");
          return branch.leaves.map((leaf, l) => {
            const x = leafX(b, l);
            const lit = b === BEST_BRANCH && l === BEST_LEAF;
            return (
              <g key={`l${branch.cell}${leaf.cell}`} opacity={lit ? 1 : 0.75}>
                <MiniBoard
                  x={x}
                  y={LEAF_Y}
                  size={LEAF_SIZE}
                  cells={place(after, leaf.cell, "X")}
                  fresh={leaf.cell}
                  lit={lit}
                />
                <Score
                  cx={x + LEAF_SIZE / 2}
                  y={LEAF_Y + LEAF_SIZE + 6}
                  score={leaf.score}
                  lit={lit}
                />
              </g>
            );
          });
        })}

        {/* Score bubbling up the chosen line */}
        <circle
          className="tictactoewithai-bubble"
          cx={bestLeafCx}
          cy={LEAF_Y}
          r="4.5"
          fill="#eaf2ff"
          opacity="0"
          filter="url(#tictactoewithai-glow)"
        />

        {/* Caption */}
        <g transform="translate(214, 272)">
          <rect
            width="212"
            height="28"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="106"
            y="14"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            TIC-TAC-TOE AI // MINIMAX
          </text>
        </g>
      </svg>
    </div>
  );
};

export default MinimaxAiArt;
