import React from "react";

/*
 * Python Rock Paper Scissors: the terminal game's decision logic. A shell
 * session takes "rock" at the prompt, a wire carries it into a dictionary
 * lookup drawn as a mapping table (rock -> scissors, paper -> rock,
 * scissors -> paper), and the matched row lights the answer the loop prints.
 */

type Kind = "rock" | "paper" | "scissors";

const FG = "#eaf2ff";
const HALO = "#0f1a3c";

const finger = (key: string, x1: number, y1: number, x2: number, y2: number, w: number) => (
  <g key={key}>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={HALO} strokeWidth={w + 3.2} />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={FG} strokeWidth={w} />
  </g>
);

// Hand glyphs in a ~60x60 box centred on 0,0.
const Hand: React.FC<{ kind: Kind }> = ({ kind }) => {
  if (kind === "paper") {
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
  }
  if (kind === "scissors") {
    return (
      <g strokeLinecap="round">
        {finger("m", 3, -2, 13, -28, 7.2)}
        {finger("i", -4, -2, -11, -28, 7.2)}
        <rect x="-13.5" y="-5" width="27" height="27" rx="10" fill={FG} />
        {finger("t", -14, 10, 3, 8, 7.5)}
      </g>
    );
  }
  return (
    <g strokeLinecap="round">
      <rect x="-17" y="-16" width="34" height="34" rx="11" fill={FG} />
      <g stroke={HALO} strokeWidth="2.6">
        <line x1="-8.5" y1="-15" x2="-8.5" y2="-3" />
        <line x1="0" y1="-15" x2="0" y2="-3" />
        <line x1="8.5" y1="-15" x2="8.5" y2="-3" />
      </g>
      {finger("t", -17, 7, 6, 2, 8)}
    </g>
  );
};

// The lookup table, one row per key; "rock" is the row being read.
const ROWS: { key: Kind; value: Kind; y: number }[] = [
  { key: "rock", value: "scissors", y: 140 },
  { key: "paper", value: "rock", y: 179 },
  { key: "scissors", value: "paper", y: 218 },
];

const KEY_X = 372;
const VAL_X = 512;
const CHIP_W = 104;

const PythonRpsArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="pythonrockpaperscissors-bg" cx="35%" cy="45%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern
            id="pythonrockpaperscissors-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <linearGradient id="pythonrockpaperscissors-term" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a1230" />
            <stop offset="100%" stopColor="#04081a" />
          </linearGradient>

          <linearGradient id="pythonrockpaperscissors-bar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a2a5e" />
            <stop offset="100%" stopColor="#111c44" />
          </linearGradient>

          <linearGradient
            id="pythonrockpaperscissors-wire"
            gradientUnits="userSpaceOnUse"
            x1="92"
            y1="0"
            x2="366"
            y2="0"
          >
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0.9" />
          </linearGradient>

          <filter id="pythonrockpaperscissors-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter
            id="pythonrockpaperscissors-halo"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="640"
            height="320"
          >
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        <style>{`
          @keyframes pythonrockpaperscissorsCursor {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
          @keyframes pythonrockpaperscissorsPulse {
            0% { opacity: 0; transform: translateX(0px); }
            12% { opacity: 1; }
            40% { opacity: 1; transform: translateX(84px); }
            48%, 100% { opacity: 0; transform: translateX(84px); }
          }
          @keyframes pythonrockpaperscissorsHit {
            0%, 38% { opacity: 0.7; }
            48%, 80% { opacity: 1; }
            100% { opacity: 0.7; }
          }
          .pythonrockpaperscissors-cursor {
            animation: pythonrockpaperscissorsCursor 1.2s steps(1) infinite;
          }
          .pythonrockpaperscissors-pulse {
            opacity: 0;
            animation: pythonrockpaperscissorsPulse 4s ease-in-out infinite;
          }
          .pythonrockpaperscissors-hit {
            opacity: 0.7;
            animation: pythonrockpaperscissorsHit 4s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .pythonrockpaperscissors-cursor,
            .pythonrockpaperscissors-pulse,
            .pythonrockpaperscissors-hit { animation: none; }
            .pythonrockpaperscissors-hit { opacity: 1; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#pythonrockpaperscissors-bg)" />
        <rect width="640" height="320" fill="url(#pythonrockpaperscissors-grid)" opacity="0.07" />

        {/* ===== Terminal session (scaled 0.92 and dropped below the category pill zone) ===== */}
        <g transform="translate(30 68) scale(0.92) translate(-30 -44)">
          <rect
            x="34"
            y="52"
            width="262"
            height="190"
            rx="12"
            fill="#0d59ff"
            opacity="0.45"
            filter="url(#pythonrockpaperscissors-halo)"
          />
          <g>
            <rect
              x="30"
              y="44"
              width="270"
              height="200"
              rx="10"
              fill="url(#pythonrockpaperscissors-term)"
              stroke="#4474ff"
              strokeWidth="1.6"
            />
            <path
              d="M 30,66 L 30,54 Q 30,44 40,44 L 290,44 Q 300,44 300,54 L 300,66 Z"
              fill="url(#pythonrockpaperscissors-bar)"
            />
            <line x1="30" y1="66" x2="300" y2="66" stroke="#4474ff" strokeWidth="1" opacity="0.6" />
            <circle cx="45" cy="55" r="4" fill="#0d59ff" />
            <circle cx="58" cy="55" r="4" fill="#4474ff" />
            <circle cx="71" cy="55" r="4" fill="#93c5fd" />
            <text
              x="182"
              y="58.5"
              textAnchor="middle"
              fill="#93c5fd"
              fontSize="9"
              fontFamily="'IBM Plex Mono', ui-monospace, monospace"
              opacity="0.8"
            >
              rps.py
            </text>

            <g fontFamily="'IBM Plex Mono', ui-monospace, monospace" fontSize="11.5">
              <text x="44" y="88" fill="#eaf2ff">
                <tspan fill="#60a5fa">$</tspan> python3 rps.py
              </text>
              <text x="44" y="108" fill="#93c5fd">
                Rock, Paper, Scissors!
              </text>
              <text x="44" y="128" fill="#eaf2ff">
                <tspan fill="#60a5fa">{">"}</tspan>{" "}
                <tspan fill="#facc15" fontWeight="bold">
                  rock
                </tspan>
              </text>
              <text x="44" y="148" fill="#93c5fd">
                Computer: scissors
              </text>
              <text x="44" y="168" fill="#eaf2ff" fontWeight="bold">
                You win!
              </text>
              <text x="44" y="188" fill="#60a5fa">
                You: 1 Computer: 0
              </text>
              <text x="44" y="220" fill="#60a5fa">
                {">"}
              </text>
            </g>
            <rect
              className="pythonrockpaperscissors-cursor"
              x="56"
              y="210"
              width="8"
              height="13"
              fill="#eaf2ff"
            />
          </g>
        </g>

        {/* ===== Wire from the prompt into the lookup ===== */}
        <g>
          <path
            d={`M 92,140 L ${KEY_X - 6},140`}
            fill="none"
            stroke="url(#pythonrockpaperscissors-wire)"
            strokeWidth="2"
            strokeDasharray="3 4"
            opacity="0.7"
          />
          <circle
            className="pythonrockpaperscissors-pulse"
            cx="282"
            cy="140"
            r="4.5"
            fill="#facc15"
            filter="url(#pythonrockpaperscissors-glow)"
          />
        </g>

        {/* ===== The dictionary ===== */}
        <g fontFamily="'IBM Plex Mono', ui-monospace, monospace">
          <text x="350" y="110" fontSize="13" fill="#93c5fd" fontWeight="bold">
            BEATS = {"{"}
          </text>
          <text x="350" y="250" fontSize="13" fill="#93c5fd" fontWeight="bold">
            {"}"}
          </text>

          {ROWS.map((row, i) => {
            const active = i === 0;
            return (
              <g key={row.key}>
                {/* key chip */}
                <rect
                  x={KEY_X}
                  y={row.y - 15}
                  width={CHIP_W}
                  height="30"
                  rx="7"
                  fill={HALO}
                  stroke={active ? "#facc15" : "#4474ff"}
                  strokeWidth={active ? 2 : 1.2}
                  strokeOpacity={active ? 1 : 0.6}
                />
                <g transform={`translate(${KEY_X + 16} ${row.y + 1}) scale(0.36)`}>
                  <Hand kind={row.key} />
                </g>
                <text
                  x={KEY_X + 30}
                  y={row.y + 4}
                  fontSize="11"
                  fill={active ? "#facc15" : "#93c5fd"}
                  fontWeight="bold"
                >
                  "{row.key}"
                </text>

                {/* colon + arrow */}
                <g
                  className={active ? "pythonrockpaperscissors-hit" : undefined}
                  opacity={active ? undefined : 0.45}
                >
                  <line
                    x1={KEY_X + CHIP_W + 6}
                    y1={row.y}
                    x2={VAL_X - 10}
                    y2={row.y}
                    stroke={active ? "#eaf2ff" : "#4474ff"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M ${VAL_X - 15},${row.y - 5} L ${VAL_X - 8},${row.y} L ${VAL_X - 15},${row.y + 5}`}
                    fill="none"
                    stroke={active ? "#eaf2ff" : "#4474ff"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>

                {/* value chip */}
                <g className={active ? "pythonrockpaperscissors-hit" : undefined}>
                  <rect
                    x={VAL_X}
                    y={row.y - 15}
                    width={CHIP_W}
                    height="30"
                    rx="7"
                    fill={active ? "#13245a" : HALO}
                    stroke={active ? "#93c5fd" : "#4474ff"}
                    strokeWidth={active ? 2 : 1.2}
                    strokeOpacity={active ? 1 : 0.6}
                    filter={active ? "url(#pythonrockpaperscissors-glow)" : undefined}
                  />
                  <g transform={`translate(${VAL_X + 16} ${row.y + 1}) scale(0.36)`}>
                    <Hand kind={row.value} />
                  </g>
                  <text x={VAL_X + 30} y={row.y + 4} fontSize="11" fill="#eaf2ff" fontWeight="bold">
                    "{row.value}"
                  </text>
                </g>
              </g>
            );
          })}
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
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            PYTHON-RPS // DICT LOOKUP CLI
          </text>
        </g>
      </svg>
    </div>
  );
};

export default PythonRpsArt;
