import React from "react";

// The Last Mile website redesign: a cluttered "before" page beside the
// rebuilt, symmetric "after" page, measured out with alignment guides and the
// site's resize-cursor easter egg. Abstract wireframe only, no branding.

// After-page geometry, mirrored about CX.
const CX = 462;
const CARD_W = 96;
const CARD_H = 54;
const CARD_XS = [356, 472];
const CARD_YS = [104, 170];

// Before-page clutter: uneven image blocks and ragged text lines.
const BEFORE_IMAGES = [
  { x: 92, y: 120, w: 52, h: 34 },
  { x: 156, y: 112, w: 64, h: 26 },
  { x: 104, y: 166, w: 38, h: 40 },
  { x: 160, y: 150, w: 48, h: 44 },
];
const BEFORE_LINES = [
  { x: 48, y: 102, w: 110 },
  { x: 60, y: 110, w: 70 },
  { x: 148, y: 200, w: 60 },
  { x: 154, y: 208, w: 38 },
];

const TlmRedesignArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="tlmwebsiteredesign-bg" cx="60%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern
            id="tlmwebsiteredesign-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <linearGradient id="tlmwebsiteredesign-page" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#111c42" />
            <stop offset="100%" stopColor="#070d22" />
          </linearGradient>

          <linearGradient id="tlmwebsiteredesign-img" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d3a7a" />
            <stop offset="100%" stopColor="#0d1a3a" />
          </linearGradient>

          <radialGradient id="tlmwebsiteredesign-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d59ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0d59ff" stopOpacity="0" />
          </radialGradient>

          <filter id="tlmwebsiteredesign-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes tlmwebsiteredesignGuide {
            0%, 100% { opacity: 0.45; }
            50% { opacity: 1; }
          }
          @keyframes tlmwebsiteredesignChevron {
            0%, 100% { opacity: 0.2; transform: translateX(-3px); }
            40% { opacity: 1; transform: translateX(3px); }
          }
          @keyframes tlmwebsiteredesignResize {
            0%, 100% { transform: translate(0px, 0px); }
            50% { transform: translate(5px, 5px); }
          }
          @keyframes tlmwebsiteredesignSelect {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.06); }
          }
          .tlmwebsiteredesign-guide {
            animation: tlmwebsiteredesignGuide 4s ease-in-out infinite;
          }
          .tlmwebsiteredesign-chevron {
            animation: tlmwebsiteredesignChevron 2.4s ease-in-out infinite;
          }
          .tlmwebsiteredesign-chevron-b { animation-delay: 0.3s; }
          .tlmwebsiteredesign-chevron-c { animation-delay: 0.6s; }
          .tlmwebsiteredesign-cursor {
            animation: tlmwebsiteredesignResize 5s ease-in-out infinite;
          }
          .tlmwebsiteredesign-select {
            transform-origin: 472px 104px;
            animation: tlmwebsiteredesignSelect 5s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .tlmwebsiteredesign-guide,
            .tlmwebsiteredesign-chevron,
            .tlmwebsiteredesign-cursor,
            .tlmwebsiteredesign-select { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#tlmwebsiteredesign-bg)" />
        <rect width="640" height="320" fill="url(#tlmwebsiteredesign-grid)" opacity="0.07" />
        <ellipse cx={CX} cy="140" rx="200" ry="130" fill="url(#tlmwebsiteredesign-halo)" />

        {/* ===== BEFORE: cluttered, misaligned page ===== */}
        <g transform="rotate(-4 134 150)" opacity="0.7">
          <rect
            x="34"
            y="74"
            width="200"
            height="152"
            rx="8"
            fill="url(#tlmwebsiteredesign-page)"
            stroke="#4474ff"
            strokeWidth="1.5"
          />
          <line x1="34" y1="88" x2="234" y2="88" stroke="#4474ff" strokeWidth="1" opacity="0.6" />
          <g fill="#4474ff">
            <circle cx="43" cy="81" r="2" />
            <circle cx="50" cy="81" r="2" />
            <circle cx="57" cy="81" r="2" />
          </g>
          {/* lopsided nav */}
          <g fill="#60a5fa" opacity="0.7">
            <rect x="120" y="93" width="14" height="4" rx="2" />
            <rect x="140" y="93" width="26" height="4" rx="2" />
            <rect x="190" y="93" width="10" height="4" rx="2" />
            <rect x="206" y="94" width="20" height="4" rx="2" />
          </g>
          {/* oversized off-centre title */}
          <rect x="44" y="96" width="62" height="3" rx="1.5" fill="#93c5fd" opacity="0.5" />
          {BEFORE_LINES.map((l) => (
            <rect
              key={`${l.x}-${l.y}`}
              x={l.x}
              y={l.y}
              width={l.w}
              height="3"
              rx="1.5"
              fill="#60a5fa"
              opacity="0.5"
            />
          ))}
          {/* sideways stacked word column */}
          <g fill="#93c5fd" opacity="0.75">
            <rect x="52" y="122" width="6" height="22" rx="2" />
            <rect x="52" y="148" width="6" height="12" rx="2" />
            <rect x="64" y="132" width="6" height="34" rx="2" />
            <rect x="64" y="170" width="6" height="18" rx="2" />
          </g>
          {BEFORE_IMAGES.map((b, i) => (
            <g key={b.x}>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx="3"
                fill="url(#tlmwebsiteredesign-img)"
                stroke="#4474ff"
                strokeWidth="1"
                transform={`rotate(${[2, -3, 4, -2][i]} ${b.x + b.w / 2} ${b.y + b.h / 2})`}
              />
            </g>
          ))}
          {/* buttons scattered at odd offsets */}
          <g fill="#4474ff" opacity="0.8">
            <rect x="96" y="210" width="18" height="6" rx="3" />
            <rect x="200" y="120" width="16" height="6" rx="3" />
          </g>
        </g>

        {/* ===== Transition chevrons ===== */}
        <g
          fill="none"
          stroke="#60a5fa"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path className="tlmwebsiteredesign-chevron" d="M 260,138 L 270,148 L 260,158" />
          <path
            className="tlmwebsiteredesign-chevron tlmwebsiteredesign-chevron-b"
            d="M 276,138 L 286,148 L 276,158"
          />
          <path
            className="tlmwebsiteredesign-chevron tlmwebsiteredesign-chevron-c"
            d="M 292,138 L 302,148 L 292,158"
            stroke="#93c5fd"
          />
        </g>

        {/* ===== AFTER: symmetric, readable page ===== */}
        <g>
          <rect
            x="322"
            y="24"
            width="280"
            height="228"
            rx="10"
            fill="url(#tlmwebsiteredesign-page)"
            stroke="#4474ff"
            strokeWidth="2.5"
            filter="url(#tlmwebsiteredesign-glow)"
          />
          {/* browser chrome */}
          <line x1="322" y1="42" x2="602" y2="42" stroke="#4474ff" strokeWidth="1.2" />
          <g fill="#60a5fa">
            <circle cx="334" cy="33" r="2.6" />
            <circle cx="343" cy="33" r="2.6" />
            <circle cx="352" cy="33" r="2.6" />
          </g>
          <rect
            x="412"
            y="29"
            width="100"
            height="8"
            rx="4"
            fill="#0d1a3a"
            stroke="#4474ff"
            strokeWidth="0.8"
          />

          {/* evenly spaced nav, centred */}
          <g fill="#93c5fd">
            {[395, 431, 467, 503].map((x, i) => (
              <rect
                key={x}
                x={x}
                y="50"
                width="26"
                height="5"
                rx="2.5"
                opacity={i === 1 ? 1 : 0.6}
              />
            ))}
          </g>
          <rect x="431" y="58" width="26" height="1.5" fill="#60a5fa" />

          {/* centred hero title + subtitle */}
          <rect x="387" y="66" width="150" height="10" rx="5" fill="#eaf2ff" />
          <rect x="367" y="82" width="190" height="4" rx="2" fill="#93c5fd" opacity="0.6" />
          <rect x="397" y="90" width="130" height="4" rx="2" fill="#93c5fd" opacity="0.6" />

          {/* 2 x 2 card grid */}
          {CARD_YS.map((y) =>
            CARD_XS.map((x) => (
              <g key={`${x}-${y}`}>
                <rect
                  x={x}
                  y={y}
                  width={CARD_W}
                  height={CARD_H}
                  rx="5"
                  fill="#13204a"
                  stroke="#4474ff"
                  strokeWidth="1.4"
                />
                <rect
                  x={x + 6}
                  y={y + 6}
                  width={CARD_W - 12}
                  height="30"
                  rx="3"
                  fill="url(#tlmwebsiteredesign-img)"
                />
                <circle cx={x + 22} cy={y + 15} r="4" fill="#60a5fa" opacity="0.7" />
                <path
                  d={`M ${x + 6},${y + 36} L ${x + 34},${y + 20} L ${x + 52},${y + 30} L ${x + 66},${y + 22} L ${x + 90},${y + 36} Z`}
                  fill="#4474ff"
                  opacity="0.55"
                />
                <rect
                  x={x + CARD_W / 2 - 13}
                  y={y + 42}
                  width="26"
                  height="7"
                  rx="3.5"
                  fill="#60a5fa"
                />
              </g>
            )),
          )}

          {/* footer */}
          <rect x="323" y="232" width="278" height="1" fill="#4474ff" opacity="0.6" />
          <g fill="#60a5fa" opacity="0.7">
            <circle cx={CX - 14} cy="242" r="2.5" />
            <circle cx={CX} cy="242" r="2.5" />
            <circle cx={CX + 14} cy="242" r="2.5" />
          </g>
        </g>

        {/* ===== Alignment guides ===== */}
        <g className="tlmwebsiteredesign-guide">
          {/* axis of symmetry */}
          <line
            x1={CX}
            y1="10"
            x2={CX}
            y2="258"
            stroke="#DAA520"
            strokeWidth="1.4"
            strokeDasharray="5 4"
          />
          <path d={`M ${CX},6 L ${CX + 4},10 L ${CX},14 L ${CX - 4},10 Z`} fill="#DAA520" />
          <path d={`M ${CX},254 L ${CX + 4},258 L ${CX},262 L ${CX - 4},258 Z`} fill="#DAA520" />
        </g>
        {/* grid edges + row baselines */}
        <g stroke="#93c5fd" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.55">
          <line x1="356" y1="18" x2="356" y2="258" />
          <line x1="568" y1="18" x2="568" y2="258" />
          <line x1="312" y1="104" x2="612" y2="104" />
          <line x1="312" y1="224" x2="612" y2="224" />
        </g>
        {/* equal-spacing markers: left margin, gutter, right margin */}
        <g stroke="#DAA520" strokeWidth="1.2" fill="none">
          <path d="M 324,197 L 354,197 M 324,193 L 324,201 M 354,193 L 354,201" />
          <path d="M 570,197 L 600,197 M 570,193 L 570,201 M 600,193 L 600,201" />
          <path d="M 453,131 L 471,131 M 453,127 L 453,135 M 471,127 L 471,135" />
        </g>

        {/* Selected card with the resize-cursor easter egg */}
        <g className="tlmwebsiteredesign-select">
          <rect
            x="472"
            y="104"
            width={CARD_W}
            height={CARD_H}
            rx="5"
            fill="none"
            stroke="#eaf2ff"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
          <g fill="#eaf2ff">
            <rect x="469" y="101" width="6" height="6" />
            <rect x="565" y="101" width="6" height="6" />
            <rect x="469" y="155" width="6" height="6" />
            <rect x="565" y="155" width="6" height="6" />
          </g>
        </g>
        <g className="tlmwebsiteredesign-cursor">
          <g transform="translate(574 164) rotate(-45)">
            <path
              d="M 0,-13 L 6,-6 L 2,-6 L 2,6 L 6,6 L 0,13 L -6,6 L -2,6 L -2,-6 L -6,-6 Z"
              fill="#eaf2ff"
              stroke="#020308"
              strokeWidth="1.4"
              strokeLinejoin="round"
              filter="url(#tlmwebsiteredesign-glow)"
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
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            TLM REDESIGN // SYMMETRY
          </text>
        </g>
      </svg>
    </div>
  );
};

export default TlmRedesignArt;
