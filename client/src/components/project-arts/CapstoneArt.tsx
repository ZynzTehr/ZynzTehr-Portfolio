import React from "react";

/*
 * Capstone "Magical Story Time": a Mad Libs storybook. Lines of story copy
 * carry blank word slots; some are already filled with the player's words,
 * one word flies in from the input form to fill its blank, and a magic wand
 * scatters sparkles over the page.
 */

type Token = { kind: "word" | "blank" | "fill" | "drop"; w: number };
type Line = { y: number; tokens: Token[] };

const w = (width: number): Token => ({ kind: "word", w: width });
const blank = (width: number): Token => ({ kind: "blank", w: width });
const fill = (width: number): Token => ({ kind: "fill", w: width });
const drop = (width: number): Token => ({ kind: "drop", w: width });

const GAP = 7;

// The book sits low enough to clear the card's category pill (top-left of the media).
const BOOK_DY = 14;

const LEFT_PAGE: Line[] = [
  { y: 92, tokens: [w(34), w(22), fill(54), w(20)] },
  { y: 114, tokens: [w(48), w(30), w(26), w(30)] },
  { y: 136, tokens: [w(26), blank(52), w(38), w(16)] },
  { y: 158, tokens: [w(40), w(24), w(50), w(18)] },
  { y: 180, tokens: [fill(48), w(30), w(42)] },
  { y: 202, tokens: [w(30), w(44), w(22)] },
];

const RIGHT_PAGE: Line[] = [
  { y: 92, tokens: [w(28), w(40), w(36), w(26)] },
  { y: 114, tokens: [w(22), drop(50), w(30), w(18)] },
  { y: 136, tokens: [w(44), w(26), w(50)] },
  { y: 158, tokens: [w(30), fill(52), w(22), w(22)] },
  { y: 180, tokens: [w(36), w(28), blank(48)] },
  { y: 202, tokens: [w(40), w(26), w(20)] },
];

// Lay a page's tokens out left to right, returning absolute x positions.
const layout = (lines: Line[], x0: number) =>
  lines.flatMap(({ y, tokens }) => {
    let x = x0;
    return tokens.map((t) => {
      const placed = { ...t, x, y: y + BOOK_DY };
      x += t.w + GAP;
      return placed;
    });
  });

const PLACED = [...layout(LEFT_PAGE, 150), ...layout(RIGHT_PAGE, 344)];
const DROP = PLACED.find((t) => t.kind === "drop") ?? { x: 0, y: 0, w: 0 };

// Word-input form on the right; the first field's word is the one that flies.
const FORM_X = 548;
const FIELD_W = 64;
const FIELDS = [110, 142, 174];
const CHIP_H = 15;
const FLY_DX = FORM_X + 7 - DROP.x;
const FLY_DY = FIELDS[0] - DROP.y;

// Four-point sparkle.
const sparkle = (cx: number, cy: number, r: number): string =>
  `M ${cx},${cy - r} Q ${cx + r * 0.18},${cy - r * 0.18} ${cx + r},${cy} ` +
  `Q ${cx + r * 0.18},${cy + r * 0.18} ${cx},${cy + r} ` +
  `Q ${cx - r * 0.18},${cy + r * 0.18} ${cx - r},${cy} ` +
  `Q ${cx - r * 0.18},${cy - r * 0.18} ${cx},${cy - r} Z`;

// Sparkles: [x, y, radius, delay seconds]
const SPARKLES: Array<[number, number, number, number]> = [
  [68, 126, 6, 0],
  [102, 104, 5, 1.1],
  [44, 160, 4, 3.1],
  [300, 44, 5, 1.7],
  [488, 50, 4, 2.8],
  [602, 62, 4, 2.2],
];

const WordChip: React.FC<{ x: number; y: number; width: number; bright?: boolean }> = ({
  x,
  y,
  width,
  bright = false,
}) => (
  <g>
    <rect
      x={x}
      y={y - CHIP_H / 2}
      width={width}
      height={CHIP_H}
      rx="4"
      fill="rgba(245, 158, 11, 0.18)"
      stroke="#f59e0b"
      strokeWidth={bright ? 2 : 1.5}
    />
    <rect x={x + 7} y={y - 2.5} width={width - 14} height="5" rx="2.5" fill="#fcd34d" />
  </g>
);

const CapstoneArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="capstoneproject-bg" cx="50%" cy="45%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="capstoneproject-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <linearGradient id="capstoneproject-pageL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#111d44" />
            <stop offset="85%" stopColor="#0d1736" />
            <stop offset="100%" stopColor="#070d22" />
          </linearGradient>

          <linearGradient id="capstoneproject-pageR" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#111d44" />
            <stop offset="85%" stopColor="#0d1736" />
            <stop offset="100%" stopColor="#070d22" />
          </linearGradient>

          <radialGradient id="capstoneproject-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4474ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4474ff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="capstoneproject-wand" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#13204a" />
            <stop offset="100%" stopColor="#4474ff" />
          </linearGradient>

          <filter id="capstoneproject-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="capstoneproject-softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes capstoneprojectFly {
            0% { transform: translate(${FLY_DX}px, ${FLY_DY}px); opacity: 0; }
            8%, 22% { transform: translate(${FLY_DX}px, ${FLY_DY}px); opacity: 1; }
            50%, 86% { transform: translate(0px, 0px); opacity: 1; }
            96%, 100% { transform: translate(0px, 0px); opacity: 0; }
          }
          @keyframes capstoneprojectField {
            0%, 22% { opacity: 0; }
            30%, 92% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes capstoneprojectTwinkle {
            0%, 100% { transform: scale(0.4) rotate(0deg); opacity: 0.2; }
            40% { transform: scale(1.15) rotate(45deg); opacity: 1; }
            70% { transform: scale(0.8) rotate(60deg); opacity: 0.6; }
          }
          .capstoneproject-fly {
            animation: capstoneprojectFly 8s cubic-bezier(0.45, 0, 0.25, 1) infinite;
          }
          .capstoneproject-field {
            animation: capstoneprojectField 8s linear infinite;
          }
          .capstoneproject-spark {
            transform-box: fill-box;
            transform-origin: 50% 50%;
            animation: capstoneprojectTwinkle 4.5s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .capstoneproject-fly,
            .capstoneproject-field,
            .capstoneproject-spark { animation: none; }
            .capstoneproject-field { opacity: 0; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#capstoneproject-bg)" />
        <rect width="640" height="320" fill="url(#capstoneproject-grid)" opacity="0.07" />
        <ellipse cx="320" cy="160" rx="250" ry="120" fill="url(#capstoneproject-aura)" />

        {/* ===== Open storybook ===== */}
        <g transform={`translate(0, ${BOOK_DY})`}>
          {/* Cover */}
          <path
            d="M 320,246 C 270,230 190,230 116,240 L 116,52 C 190,42 270,44 320,60 C 370,44 450,42 524,52 L 524,240 C 450,230 370,230 320,246 Z"
            fill="#060b1d"
            stroke="#0d59ff"
            strokeWidth="2.5"
          />
          {/* Page edges (stacked leaves) */}
          <g fill="none" stroke="#4474ff" strokeWidth="1" opacity="0.45">
            <path d="M 124,234 C 196,224 272,224 320,240 C 368,224 444,224 516,234" />
            <path d="M 127,230 C 198,220 274,220 320,236 C 366,220 442,220 513,230" />
          </g>
          {/* Pages */}
          <path
            d="M 320,232 C 274,216 200,214 130,224 L 130,58 C 200,48 274,50 320,66 Z"
            fill="url(#capstoneproject-pageL)"
            stroke="#60a5fa"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M 320,232 C 366,216 440,214 510,224 L 510,58 C 440,48 366,50 320,66 Z"
            fill="url(#capstoneproject-pageR)"
            stroke="#60a5fa"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Spine */}
          <line
            x1="320"
            y1="66"
            x2="320"
            y2="232"
            stroke="#93c5fd"
            strokeWidth="1.5"
            opacity="0.6"
          />
        </g>

        {/* Story copy, blanks and filled words */}
        {PLACED.map((t) => {
          const key = `${t.x}-${t.y}`;
          if (t.kind === "word") {
            return (
              <rect
                key={key}
                x={t.x}
                y={t.y - 2.5}
                width={t.w}
                height="5"
                rx="2.5"
                fill="#60a5fa"
                opacity="0.5"
              />
            );
          }
          if (t.kind === "fill") {
            return (
              <g key={key} filter="url(#capstoneproject-softGlow)">
                <WordChip x={t.x} y={t.y} width={t.w} />
              </g>
            );
          }
          // Blank slots (the drop target is a blank until its word lands).
          return (
            <g key={key}>
              <rect
                x={t.x}
                y={t.y - CHIP_H / 2}
                width={t.w}
                height={CHIP_H}
                rx="4"
                fill="#050916"
                stroke="#93c5fd"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity="0.8"
              />
              <line
                x1={t.x + 4}
                y1={t.y + 4}
                x2={t.x + t.w - 4}
                y2={t.y + 4}
                stroke="#93c5fd"
                strokeWidth="1.5"
                opacity="0.6"
              />
            </g>
          );
        })}

        {/* ===== Word form: the player's words waiting to be dropped in ===== */}
        <rect
          x={FORM_X - 8}
          y={FIELDS[0] - 26}
          width={FIELD_W + 16}
          height={FIELDS[2] - FIELDS[0] + 50}
          rx="10"
          fill="#0a1230"
          stroke="#4474ff"
          strokeWidth="1.5"
        />
        <rect
          x={FORM_X}
          y={FIELDS[0] - 19}
          width="34"
          height="4"
          rx="2"
          fill="#93c5fd"
          opacity="0.6"
        />
        {FIELDS.map((fy) => (
          <rect
            key={`f${fy}`}
            x={FORM_X}
            y={fy - 11}
            width={FIELD_W}
            height="22"
            rx="5"
            fill="#050916"
            stroke="#4474ff"
            strokeWidth="1"
            opacity="0.9"
          />
        ))}
        <WordChip x={FORM_X + 7} y={FIELDS[1]} width={42} />
        <WordChip x={FORM_X + 7} y={FIELDS[2]} width={48} />
        {/* First field refills after its word leaves */}
        <g className="capstoneproject-field">
          <WordChip x={FORM_X + 7} y={FIELDS[0]} width={DROP.w} />
        </g>

        {/* The flying word, drawn at its blank and animated in from the form */}
        <g className="capstoneproject-fly" filter="url(#capstoneproject-glow)">
          <WordChip x={DROP.x} y={DROP.y} width={DROP.w} bright />
        </g>

        {/* ===== Magic wand ===== */}
        <g>
          <line
            x1="34"
            y1="238"
            x2="88"
            y2="162"
            stroke="url(#capstoneproject-wand)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <line
            x1="34"
            y1="238"
            x2="45"
            y2="222"
            stroke="#93c5fd"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path d={sparkle(92, 156, 13)} fill="#eaf2ff" filter="url(#capstoneproject-glow)" />
        </g>
        <g fill="#93c5fd" filter="url(#capstoneproject-softGlow)">
          {SPARKLES.map(([x, y, r, delay]) => (
            <path
              key={`sp${x}`}
              className="capstoneproject-spark"
              d={sparkle(x, y, r)}
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </g>

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
            CAPSTONE // MAD LIBS
          </text>
        </g>
      </svg>
    </div>
  );
};

export default CapstoneArt;
