import React from "react";

/* Code token rows: [y, [x, width, tone]...]. Tone 0 = dim ice, 1 = sapphire, 2 = violet. */
const CODE_ROWS: ReadonlyArray<
  readonly [number, ReadonlyArray<readonly [number, number, number]>]
> = [
  [
    70,
    [
      [188, 44, 2],
      [238, 30, 1],
      [274, 52, 0],
      [332, 10, 0],
    ],
  ],
  [
    90,
    [
      [204, 40, 0],
      [250, 66, 1],
    ],
  ],
  [
    110,
    [
      [204, 34, 0],
      [244, 58, 1],
      [308, 14, 0],
    ],
  ],
  [
    150,
    [
      [204, 44, 0],
      [254, 72, 1],
    ],
  ],
  [
    170,
    [
      [188, 10, 0],
      [204, 26, 2],
      [236, 40, 0],
    ],
  ],
  [
    190,
    [
      [188, 44, 2],
      [238, 34, 1],
      [278, 46, 0],
      [330, 10, 0],
    ],
  ],
  [
    210,
    [
      [204, 38, 0],
      [248, 92, 1],
      [346, 12, 0],
    ],
  ],
  [
    230,
    [
      [204, 46, 0],
      [256, 104, 1],
    ],
  ],
];

const TONES = ["#93c5fd", "#4474ff", "#a78bfa"];

const VscodeFxArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="vscodefx-bg" cx="50%" cy="45%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <linearGradient id="vscodefx-window" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0c1430" />
            <stop offset="100%" stopColor="#070c1e" />
          </linearGradient>

          <linearGradient id="vscodefx-frame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4474ff" />
            <stop offset="50%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#0d59ff" />
          </linearGradient>

          <linearGradient id="vscodefx-activeline" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d59ff" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#4474ff" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#4474ff" stopOpacity="0.08" />
          </linearGradient>

          <linearGradient id="vscodefx-trail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.85" />
          </linearGradient>

          <radialGradient id="vscodefx-ripplefill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#a78bfa" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>

          <filter id="vscodefx-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="vscodefx-bloom" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="9" />
          </filter>

          <clipPath id="vscodefx-editor-clip">
            <rect x="120" y="28" width="400" height="224" rx="12" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes vscodefxLinePulse {
            0%, 100% { opacity: 0.55; }
            50% { opacity: 1; }
          }
          @keyframes vscodefxGlide {
            0% { transform: translateX(-96px); }
            28% { transform: translateX(0px); }
            100% { transform: translateX(0px); }
          }
          @keyframes vscodefxTrail {
            0% { opacity: 0.9; }
            28% { opacity: 0.9; }
            46% { opacity: 0.3; }
            100% { opacity: 0.3; }
          }
          @keyframes vscodefxRipple {
            0%, 26% { opacity: 0; transform: scale(0.15); }
            32% { opacity: 1; }
            86% { opacity: 0; transform: scale(1); }
            100% { opacity: 0; transform: scale(1); }
          }
          @keyframes vscodefxPress {
            0%, 24% { transform: translate(0px, 0px); }
            30% { transform: translate(1px, 2px); }
            38%, 100% { transform: translate(0px, 0px); }
          }
          .vscodefx-line-pulse {
            animation: vscodefxLinePulse 3.2s ease-in-out infinite;
          }
          .vscodefx-caret {
            animation: vscodefxGlide 6s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          }
          .vscodefx-trail {
            animation: vscodefxTrail 6s ease-out infinite;
          }
          .vscodefx-ripple {
            transform-origin: 392px 130px;
            animation: vscodefxRipple 6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          }
          .vscodefx-ripple-late {
            animation-delay: 0.35s;
          }
          .vscodefx-pointer {
            animation: vscodefxPress 6s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .vscodefx-line-pulse, .vscodefx-caret, .vscodefx-trail,
            .vscodefx-ripple, .vscodefx-pointer { animation: none; }
            .vscodefx-trail { opacity: 0.3; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#vscodefx-bg)" />

        {/* Faint dot grid behind the window */}
        <g fill="#4474ff" opacity="0.12">
          {Array.from({ length: 13 }, (_, i) =>
            Array.from({ length: 6 }, (_, j) => (
              <circle key={`${i}-${j}`} cx={32 + i * 48} cy={30 + j * 48} r="1.2" />
            )),
          )}
        </g>

        {/* Editor window, scaled and lowered so the long category pill clears it */}
        <g transform="translate(320 154) scale(0.8) translate(-320 -140)">
          <rect x="120" y="28" width="400" height="224" rx="12" fill="url(#vscodefx-window)" />

          {/* Active-line neon bloom spilling past the window edges */}
          <rect
            x="70"
            y="118"
            width="500"
            height="24"
            rx="12"
            fill="#0d59ff"
            opacity="0.55"
            filter="url(#vscodefx-bloom)"
            className="vscodefx-line-pulse"
          />

          <g clipPath="url(#vscodefx-editor-clip)">
            {/* Title bar */}
            <rect x="120" y="28" width="400" height="24" fill="#0a1128" />
            <circle cx="136" cy="40" r="3.6" fill="#4474ff" opacity="0.9" />
            <circle cx="148" cy="40" r="3.6" fill="#60a5fa" opacity="0.7" />
            <circle cx="160" cy="40" r="3.6" fill="#93c5fd" opacity="0.5" />
            <rect x="262" y="35" width="116" height="10" rx="5" fill="#16224a" />

            {/* Tab strip divider */}
            <rect x="146" y="52" width="374" height="1" fill="#1a2a5c" />

            {/* Activity bar */}
            <rect x="120" y="52" width="26" height="188" fill="#080e22" />
            <rect
              x="127"
              y="62"
              width="12"
              height="12"
              rx="3"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1.6"
            />
            <circle
              cx="133"
              cy="90"
              r="5"
              fill="none"
              stroke="#4474ff"
              strokeWidth="1.4"
              opacity="0.6"
            />
            <rect
              x="128"
              y="104"
              width="10"
              height="10"
              rx="2"
              fill="none"
              stroke="#4474ff"
              strokeWidth="1.4"
              opacity="0.5"
            />
            <rect x="120" y="60" width="2" height="16" fill="#93c5fd" />

            {/* Gutter line numbers */}
            <g fill="#4474ff" opacity="0.35">
              {[70, 90, 110, 150, 170, 190, 210, 230].map((y) => (
                <rect key={y} x="158" y={y - 2} width="12" height="4" rx="2" />
              ))}
            </g>

            {/* Dim code tokens */}
            {CODE_ROWS.map(([y, tokens]) => (
              <g key={y}>
                {tokens.map(([x, w, tone]) => (
                  <rect
                    key={x}
                    x={x}
                    y={y - 3}
                    width={w}
                    height="6"
                    rx="3"
                    fill={TONES[tone]}
                    opacity={tone === 0 ? 0.28 : 0.42}
                  />
                ))}
              </g>
            ))}

            {/* ACTIVE LINE: neon band */}
            <g className="vscodefx-line-pulse">
              <rect x="146" y="119" width="374" height="22" fill="url(#vscodefx-activeline)" />
              <rect x="146" y="119" width="374" height="1.4" fill="#93c5fd" opacity="0.7" />
              <rect x="146" y="139.6" width="374" height="1.4" fill="#93c5fd" opacity="0.7" />
            </g>
            <rect
              x="146"
              y="119"
              width="3"
              height="22"
              fill="#93c5fd"
              filter="url(#vscodefx-glow)"
            />
            <rect x="157" y="127" width="14" height="6" rx="3" fill="#e0ecff" />

            {/* Active line tokens, glowing */}
            <g filter="url(#vscodefx-glow)">
              <rect x="188" y="126" width="46" height="8" rx="4" fill="#a78bfa" />
              <rect x="240" y="126" width="38" height="8" rx="4" fill="#60a5fa" />
              <rect x="284" y="126" width="62" height="8" rx="4" fill="#93c5fd" />
              <rect x="352" y="126" width="30" height="8" rx="4" fill="#4474ff" />
            </g>

            {/* Status bar */}
            <rect x="120" y="240" width="400" height="12" fill="#0d59ff" opacity="0.85" />
            <rect x="440" y="243.5" width="46" height="5" rx="2.5" fill="#e0ecff" opacity="0.7" />
          </g>

          {/* Window frame */}
          <rect
            x="120"
            y="28"
            width="400"
            height="224"
            rx="12"
            fill="none"
            stroke="url(#vscodefx-frame)"
            strokeWidth="1.8"
            opacity="0.85"
          />

          {/* Material ripple from the click */}
          <circle
            cx="392"
            cy="130"
            r="40"
            fill="url(#vscodefx-ripplefill)"
            className="vscodefx-ripple"
          />
          <circle
            cx="392"
            cy="130"
            r="78"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="2.4"
            className="vscodefx-ripple"
          />
          <circle
            cx="392"
            cy="130"
            r="52"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="1.6"
            className="vscodefx-ripple vscodefx-ripple-late"
          />
          {/* Resting rings so the ripple reads even when frozen */}
          <circle cx="392" cy="130" r="30" fill="url(#vscodefx-ripplefill)" />
          <circle
            cx="392"
            cy="130"
            r="48"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="1.2"
            opacity="0.3"
            strokeDasharray="2 5"
          />
          <circle
            cx="392"
            cy="130"
            r="28"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="2"
            opacity="0.85"
            filter="url(#vscodefx-glow)"
          />

          {/* Smooth cursor: comet trail + caret */}
          <g className="vscodefx-caret">
            <rect
              x="300"
              y="128"
              width="90"
              height="4"
              rx="2"
              fill="url(#vscodefx-trail)"
              className="vscodefx-trail"
            />
            <rect
              x="389"
              y="118"
              width="3.4"
              height="24"
              rx="1.2"
              fill="#e0ecff"
              filter="url(#vscodefx-glow)"
            />
          </g>

          {/* Mouse pointer clicking at the caret */}
          <g className="vscodefx-pointer">
            <path
              d="M 396,134 L 396,160 L 402.5,154 L 407,164.5 L 411.5,162.5 L 407,152.5 L 415.5,152 Z"
              fill="#e0ecff"
              stroke="#020308"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* Caption */}
        <g transform="translate(250, 275)">
          <rect
            width="140"
            height="28"
            rx="6"
            fill="rgba(68, 116, 255, 0.14)"
            stroke="#60a5fa"
            strokeWidth="1.2"
          />
          <text
            x="70"
            y="14"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            VSCODE // FX
          </text>
        </g>
      </svg>
    </div>
  );
};

export default VscodeFxArt;
