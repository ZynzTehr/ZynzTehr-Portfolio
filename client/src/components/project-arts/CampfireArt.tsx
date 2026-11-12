import React from "react";

type Pine = { x: number; top: number; w: number };

// Tiered pine silhouette: a spire that steps outward in four boughs and runs off the bottom edge.
const pinePath = ({ x, top, w }: Pine): string => {
  const tiers = 4;
  const step = (320 - top) / (tiers + 0.6);
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 1; i <= tiers; i += 1) {
    const y = top + step * i;
    const half = (w / 2) * (i / tiers);
    const notch = half * 0.5;
    left.push(`L ${x - half},${y} L ${x - notch},${y - step * 0.18}`);
    right.unshift(`L ${x + notch},${y - step * 0.18} L ${x + half},${y}`);
  }
  const base = `L ${x - w / 2},320 L ${x + w / 2},320`;
  return `M ${x},${top} ${left.join(" ")} ${base} ${right.join(" ")} Z`;
};

const BACK_PINES: Pine[] = [
  { x: 18, top: 92, w: 70 },
  { x: 72, top: 120, w: 62 },
  { x: 128, top: 104, w: 66 },
  { x: 180, top: 148, w: 52 },
  { x: 462, top: 146, w: 54 },
  { x: 512, top: 102, w: 68 },
  { x: 566, top: 124, w: 60 },
  { x: 622, top: 88, w: 72 },
];

const FRONT_PINES: Pine[] = [
  { x: 44, top: 140, w: 84 },
  { x: 104, top: 176, w: 66 },
  { x: 150, top: 200, w: 52 },
  { x: 492, top: 198, w: 54 },
  { x: 540, top: 168, w: 70 },
  { x: 600, top: 132, w: 88 },
];

// Embers: [x offset from fire centre, start y, radius, delay seconds]
const EMBERS: Array<[number, number, number, number]> = [
  [-14, 150, 3, 0],
  [10, 140, 2.4, 1.4],
  [-4, 160, 3.2, 2.6],
  [18, 155, 2.2, 3.7],
  [-20, 165, 2.6, 4.9],
  [4, 145, 2.8, 6.1],
];

const CampfireArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="campfireofthedamned-bg" cx="50%" cy="62%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <radialGradient id="campfireofthedamned-warmth" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff8a1f" stopOpacity="0.42" />
            <stop offset="45%" stopColor="#ff8a1f" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ff8a1f" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="campfireofthedamned-moon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="campfireofthedamned-outer" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ff5a14" />
            <stop offset="60%" stopColor="#ff8a1f" />
            <stop offset="100%" stopColor="#ff8a1f" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="campfireofthedamned-mid" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ff9a2e" />
            <stop offset="100%" stopColor="#ffc15a" />
          </linearGradient>

          <linearGradient id="campfireofthedamned-core" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#fff4d6" />
            <stop offset="100%" stopColor="#ffd27a" />
          </linearGradient>

          <linearGradient id="campfireofthedamned-log" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e2a4a" />
            <stop offset="100%" stopColor="#0b1328" />
          </linearGradient>

          <linearGradient id="campfireofthedamned-ridge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f1a36" />
            <stop offset="100%" stopColor="#070c1c" />
          </linearGradient>

          <filter id="campfireofthedamned-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="campfireofthedamned-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="0.7" />
          </filter>
        </defs>

        <style>{`
          @keyframes campfireofthedamnedFlicker {
            0%, 100% { transform: scale(1, 1); }
            25% { transform: scale(0.96, 1.06); }
            50% { transform: scale(1.03, 0.95); }
            75% { transform: scale(0.98, 1.03); }
          }
          @keyframes campfireofthedamnedRise {
            0% { transform: translate(0, 0); opacity: 0; }
            12% { opacity: 1; }
            70% { opacity: 0.7; }
            100% { transform: translate(10px, -120px); opacity: 0; }
          }
          @keyframes campfireofthedamnedBlink {
            0%, 86%, 100% { transform: scaleY(1); opacity: 0.85; }
            90% { transform: scaleY(0.1); opacity: 0.4; }
            94% { transform: scaleY(1); opacity: 0.85; }
          }
          .campfireofthedamned-tongue {
            transform-box: fill-box;
            transform-origin: 50% 100%;
            animation: campfireofthedamnedFlicker 3.2s ease-in-out infinite;
          }
          .campfireofthedamned-tongue-b { animation-duration: 4.1s; animation-delay: -1.3s; }
          .campfireofthedamned-tongue-c { animation-duration: 3.6s; animation-delay: -2.2s; }
          .campfireofthedamned-warmth {
            transform-box: fill-box;
            transform-origin: 50% 50%;
            animation: campfireofthedamnedFlicker 5.4s ease-in-out infinite;
          }
          .campfireofthedamned-ember {
            opacity: 0;
            animation: campfireofthedamnedRise 7.2s ease-out infinite;
          }
          .campfireofthedamned-eyes {
            transform-box: fill-box;
            transform-origin: 50% 50%;
            animation: campfireofthedamnedBlink 9s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .campfireofthedamned-tongue,
            .campfireofthedamned-warmth,
            .campfireofthedamned-ember,
            .campfireofthedamned-eyes { animation: none; }
            .campfireofthedamned-ember { opacity: 0.6; }
          }
        `}</style>

        {/* Night sky */}
        <rect width="640" height="320" fill="url(#campfireofthedamned-bg)" />

        {/* Stars */}
        <g fill="#93c5fd">
          <circle cx="232" cy="38" r="1" opacity="0.6" />
          <circle cx="278" cy="22" r="0.8" opacity="0.4" />
          <circle cx="356" cy="30" r="1.1" opacity="0.55" />
          <circle cx="404" cy="58" r="0.8" opacity="0.4" />
          <circle cx="196" cy="70" r="0.9" opacity="0.45" />
          <circle cx="300" cy="64" r="0.7" opacity="0.35" />
          <circle cx="440" cy="26" r="0.9" opacity="0.5" />
        </g>

        {/* Crescent moon */}
        <circle cx="430" cy="62" r="34" fill="url(#campfireofthedamned-moon)" />
        <path
          d="M 438,44 A 18 18 0 1 0 446,74 A 14 14 0 1 1 438,44 Z"
          fill="#93c5fd"
          opacity="0.9"
        />

        {/* Back tree line */}
        <g fill="url(#campfireofthedamned-ridge)">
          {BACK_PINES.map((p) => (
            <path key={`b${p.x}`} d={pinePath(p)} />
          ))}
        </g>

        {/* Firelight washing the clearing */}
        <ellipse
          cx="320"
          cy="226"
          rx="210"
          ry="120"
          fill="url(#campfireofthedamned-warmth)"
          className="campfireofthedamned-warmth"
        />

        {/* Ground line */}
        <path d="M 150,262 Q 320,240 490,262 L 640,320 L 0,320 Z" fill="#050916" />
        <ellipse cx="320" cy="252" rx="92" ry="9" fill="#ff8a1f" opacity="0.18" />

        {/* Front tree line */}
        <g fill="#03060f">
          {FRONT_PINES.map((p) => (
            <path key={`f${p.x}`} d={pinePath(p)} />
          ))}
        </g>
        {/* Sapphire rim light on the inner edges of the woods */}
        <g fill="none" stroke="#4474ff" strokeWidth="1" opacity="0.35">
          <path d={pinePath(FRONT_PINES[2])} />
          <path d={pinePath(FRONT_PINES[3])} />
        </g>

        {/* Eyes watching from the dark */}
        <g
          className="campfireofthedamned-eyes"
          fill="#60a5fa"
          filter="url(#campfireofthedamned-glow)"
        >
          <ellipse cx="92" cy="236" rx="3.2" ry="1.8" />
          <ellipse cx="104" cy="236" rx="3.2" ry="1.8" />
        </g>
        <g
          className="campfireofthedamned-eyes"
          fill="#60a5fa"
          filter="url(#campfireofthedamned-glow)"
          style={{ animationDelay: "-4.5s" }}
        >
          <ellipse cx="546" cy="222" rx="2.8" ry="1.6" />
          <ellipse cx="557" cy="222" rx="2.8" ry="1.6" />
        </g>

        {/* Campfire */}
        <g transform="translate(320, 246)">
          {/* Flames */}
          <g filter="url(#campfireofthedamned-glow)">
            <path
              className="campfireofthedamned-tongue"
              d="M -46,-6 C -62,-36 -48,-66 -30,-86 C -30,-66 -20,-60 -14,-64 C -18,-96 -4,-124 4,-152 C 14,-124 30,-104 26,-74 C 34,-80 40,-92 40,-104 C 58,-74 62,-34 46,-6 Z"
              fill="url(#campfireofthedamned-outer)"
            />
            <path
              className="campfireofthedamned-tongue campfireofthedamned-tongue-b"
              d="M -32,-6 C -42,-30 -32,-52 -18,-66 C -18,-52 -12,-46 -6,-50 C -8,-74 2,-94 8,-112 C 18,-88 28,-66 22,-44 C 30,-48 32,-56 32,-62 C 42,-42 42,-20 32,-6 Z"
              fill="url(#campfireofthedamned-mid)"
            />
            <path
              className="campfireofthedamned-tongue campfireofthedamned-tongue-c"
              d="M -16,-6 C -24,-22 -16,-38 -4,-52 C -2,-40 4,-36 8,-40 C 10,-30 22,-20 16,-6 Z"
              fill="url(#campfireofthedamned-core)"
            />
          </g>

          {/* Crossed logs, end grain catching sapphire night light */}
          {[
            { rot: -14, edge: "#4474ff" },
            { rot: 14, edge: "#ff8a1f" },
          ].map(({ rot, edge }) => (
            <g key={`log${rot}`} transform={`translate(0, 4) rotate(${rot})`}>
              <rect
                x="-66"
                y="-8"
                width="132"
                height="16"
                rx="8"
                fill="url(#campfireofthedamned-log)"
                stroke="#020308"
                strokeWidth="1"
              />
              <line
                x1="-56"
                y1="-5"
                x2="56"
                y2="-5"
                stroke={edge}
                strokeWidth="1.4"
                strokeOpacity="0.55"
                strokeLinecap="round"
              />
              <g transform={`translate(${rot < 0 ? 62 : -62}, 0)`}>
                <ellipse
                  rx="5"
                  ry="8"
                  fill="#16213f"
                  stroke="#60a5fa"
                  strokeWidth="1"
                  strokeOpacity="0.6"
                />
                <ellipse
                  rx="2.4"
                  ry="4"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="0.8"
                  strokeOpacity="0.45"
                />
              </g>
            </g>
          ))}

          {/* Rising embers */}
          <g fill="#ffc15a" filter="url(#campfireofthedamned-soft)">
            {EMBERS.map(([x, y, r, delay]) => (
              <circle
                key={`e${delay}`}
                className="campfireofthedamned-ember"
                cx={x}
                cy={-y + 40}
                r={r}
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </g>
        </g>

        {/* Caption */}
        <g transform="translate(220, 280)">
          <rect
            width="200"
            height="26"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="100"
            y="13"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            CAMPFIRE // OF THE DAMNED
          </text>
        </g>
      </svg>
    </div>
  );
};

export default CampfireArt;
