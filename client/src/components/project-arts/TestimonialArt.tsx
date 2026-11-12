import React from "react";

/*
 * Testimonial layout: a bento grid of social-proof cards. Each card carries an
 * avatar and quote copy, a five-star rating strip anchors the bottom row, and
 * the centre testimonial is lifted off the grid with oversized quotation marks.
 */

// Five-point star centred at (cx, cy).
const starPath = (cx: number, cy: number, r: number): string => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const theta = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(
      `${(cx + radius * Math.cos(theta)).toFixed(2)},${(cy + radius * Math.sin(theta)).toFixed(2)}`,
    );
  }
  return `M ${pts.join(" L ")} Z`;
};

// One opening quotation mark: a ball with a tail curling up and to the right.
const quoteMark = (x: number, y: number, s: number): string =>
  `M ${x - 10 * s},${y} ` +
  `C ${x - 10 * s},${y - 16 * s} ${x - 2 * s},${y - 25 * s} ${x + 10 * s},${y - 29 * s} ` +
  `L ${x + 11.5 * s},${y - 24 * s} ` +
  `C ${x + 3 * s},${y - 20 * s} ${x - 1 * s},${y - 15 * s} ${x - 1 * s},${y - 9.6 * s} ` +
  `A ${10 * s} ${10 * s} 0 1 1 ${x - 10 * s},${y} Z`;

// The pair of marks, the second offset to the right.
const quotePair = (x: number, y: number, s: number): string =>
  `${quoteMark(x, y, s)} ${quoteMark(x + 27 * s, y, s)}`;

type Avatar = { cx: number; cy: number; r: number };

// Avatar disc: gradient face plate with a head-and-shoulders silhouette that stays inside the circle.
const AvatarDisc: React.FC<Avatar & { ring: string }> = ({ cx, cy, r, ring }) => {
  const sx = r * 0.917;
  const sy = cy + r * 0.4;
  const shoulders =
    `M ${cx - sx},${sy} Q ${cx},${cy + r * 0.02} ${cx + sx},${sy} ` +
    `A ${r} ${r} 0 0 1 ${cx - sx},${sy} Z`;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="url(#testimoniallayout-avatar)" />
      <circle cx={cx} cy={cy - r * 0.2} r={r * 0.34} fill="#93c5fd" opacity="0.85" />
      <path d={shoulders} fill="#93c5fd" opacity="0.85" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={ring} strokeWidth="2" />
    </g>
  );
};

// Grey copy lines inside a card.
const CopyLines: React.FC<{ x: number; y: number; widths: number[]; gap?: number }> = ({
  x,
  y,
  widths,
  gap = 11,
}) => (
  <g fill="#4474ff" opacity="0.45">
    {widths.map((w, i) => (
      <rect key={`${x}-${y}-${i}`} x={x} y={y + i * gap} width={w} height="5" rx="2.5" />
    ))}
  </g>
);

const STARS = [0, 1, 2, 3, 4];

const TestimonialArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="testimoniallayout-bg" cx="50%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="testimoniallayout-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <linearGradient id="testimoniallayout-card" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f1a3c" />
            <stop offset="100%" stopColor="#070d22" />
          </linearGradient>

          <linearGradient id="testimoniallayout-hero" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a2b66" />
            <stop offset="60%" stopColor="#111d48" />
            <stop offset="100%" stopColor="#0a1230" />
          </linearGradient>

          <linearGradient id="testimoniallayout-quote" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eaf2ff" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          <linearGradient id="testimoniallayout-avatar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d59ff" />
            <stop offset="100%" stopColor="#13204a" />
          </linearGradient>

          <radialGradient id="testimoniallayout-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d59ff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0d59ff" stopOpacity="0" />
          </radialGradient>

          <filter id="testimoniallayout-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="testimoniallayout-softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes testimoniallayoutFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          @keyframes testimoniallayoutShadow {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(0.92); opacity: 0.6; }
          }
          @keyframes testimoniallayoutStar {
            0%, 100% { opacity: 0.55; transform: scale(0.88); }
            12% { opacity: 1; transform: scale(1.12); }
            30% { opacity: 1; transform: scale(1); }
          }
          .testimoniallayout-lift {
            animation: testimoniallayoutFloat 6s ease-in-out infinite;
          }
          .testimoniallayout-shadow {
            transform-box: fill-box;
            transform-origin: 50% 50%;
            animation: testimoniallayoutShadow 6s ease-in-out infinite;
          }
          .testimoniallayout-star {
            transform-box: fill-box;
            transform-origin: 50% 50%;
            animation: testimoniallayoutStar 5s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .testimoniallayout-lift,
            .testimoniallayout-shadow,
            .testimoniallayout-star { animation: none; }
            .testimoniallayout-star { opacity: 1; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#testimoniallayout-bg)" />
        <rect width="640" height="320" fill="url(#testimoniallayout-grid)" opacity="0.07" />

        {/* ===== Bento grid (the resting cards) =====
            Every card starts at y=66 so the media's category pill (top-left, wider on phones)
            never covers the grid, even at the hero card's float peak. */}
        <g stroke="#4474ff" strokeWidth="1.5">
          {/* Left tall card */}
          <rect
            x="52"
            y="66"
            width="156"
            height="182"
            rx="14"
            fill="url(#testimoniallayout-card)"
          />
          {/* Right top card */}
          <rect
            x="432"
            y="66"
            width="156"
            height="84"
            rx="14"
            fill="url(#testimoniallayout-card)"
          />
          {/* Right bottom card */}
          <rect
            x="432"
            y="160"
            width="156"
            height="88"
            rx="14"
            fill="url(#testimoniallayout-card)"
          />
          {/* Centre slot the hero card lifts out of */}
          <rect
            x="222"
            y="66"
            width="196"
            height="126"
            rx="14"
            fill="#050916"
            strokeDasharray="5 5"
            opacity="0.7"
          />
          {/* Centre bottom rating strip */}
          <rect
            x="222"
            y="204"
            width="196"
            height="44"
            rx="14"
            fill="url(#testimoniallayout-card)"
          />
        </g>

        {/* Left tall card: avatar, name, long quote */}
        <path d={quotePair(78, 144, 0.55)} fill="#60a5fa" opacity="0.6" />
        <AvatarDisc cx={86} cy={100} r={18} ring="#60a5fa" />
        <rect x="112" y="90" width="64" height="7" rx="3.5" fill="#93c5fd" opacity="0.85" />
        <rect x="112" y="103" width="40" height="5" rx="2.5" fill="#60a5fa" opacity="0.55" />
        <CopyLines x={70} y={156} widths={[120, 108, 120, 86, 96]} />
        <g fill="#93c5fd" opacity="0.7">
          {STARS.map((i) => (
            <path key={`ls${i}`} d={starPath(76 + i * 15, 230, 5.5)} />
          ))}
        </g>

        {/* Right top card */}
        <AvatarDisc cx={464} cy={92} r={15} ring="#4474ff" />
        <rect x="488" y="84" width="58" height="7" rx="3.5" fill="#93c5fd" opacity="0.8" />
        <rect x="488" y="96" width="36" height="5" rx="2.5" fill="#60a5fa" opacity="0.5" />
        <CopyLines x={450} y={120} widths={[118, 96]} gap={10} />

        {/* Right bottom card */}
        <path d={quotePair(458, 198, 0.5)} fill="#60a5fa" opacity="0.6" />
        <CopyLines x={450} y={208} widths={[116, 104, 60]} gap={10} />
        <AvatarDisc cx={560} cy={186} r={13} ring="#4474ff" />

        {/* Centre bottom: five-star rating strip */}
        <g fill="#93c5fd" filter="url(#testimoniallayout-softGlow)">
          {STARS.map((i) => (
            <path
              key={`rs${i}`}
              className="testimoniallayout-star"
              d={starPath(250 + i * 22, 226, 7.5)}
              style={{ animationDelay: `${i * 0.35}s` }}
            />
          ))}
        </g>
        <rect x="364" y="218" width="38" height="7" rx="3.5" fill="#93c5fd" opacity="0.8" />
        <rect x="364" y="230" width="26" height="5" rx="2.5" fill="#60a5fa" opacity="0.5" />

        {/* ===== Lifted hero testimonial (top stays at y>=54 at the float peak) ===== */}
        <ellipse
          className="testimoniallayout-shadow"
          cx="320"
          cy="196"
          rx="100"
          ry="9"
          fill="url(#testimoniallayout-shadow)"
        />
        <g className="testimoniallayout-lift">
          <g transform="translate(-10, -8) rotate(-2.5 320 136)">
            <rect
              x="214"
              y="76"
              width="212"
              height="120"
              rx="16"
              fill="url(#testimoniallayout-hero)"
              stroke="#93c5fd"
              strokeWidth="2.5"
              filter="url(#testimoniallayout-glow)"
            />
            {/* Oversized quotation marks */}
            <path
              d={quotePair(248, 122, 1)}
              fill="url(#testimoniallayout-quote)"
              filter="url(#testimoniallayout-softGlow)"
            />
            {/* Quote copy */}
            <g fill="#93c5fd">
              <rect x="314" y="96" width="92" height="7" rx="3.5" opacity="0.8" />
              <rect x="314" y="109" width="74" height="7" rx="3.5" opacity="0.6" />
              <rect x="236" y="138" width="170" height="6" rx="3" opacity="0.6" />
              <rect x="236" y="149" width="140" height="6" rx="3" opacity="0.6" />
            </g>
            {/* Divider + author */}
            <line
              x1="236"
              y1="163"
              x2="406"
              y2="163"
              stroke="#4474ff"
              strokeWidth="1"
              opacity="0.5"
            />
            <AvatarDisc cx={248} cy={179} r={11} ring="#93c5fd" />
            <rect x="268" y="172" width="62" height="7" rx="3.5" fill="#eaf2ff" opacity="0.9" />
            <rect x="268" y="183" width="44" height="5" rx="2.5" fill="#60a5fa" opacity="0.7" />
            {/* Verified tick */}
            <circle cx="396" cy="179" r="8.5" fill="#0d59ff" />
            <path
              d="M 391.8,179 L 394.8,182.2 L 400.3,175.8"
              fill="none"
              stroke="#eaf2ff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
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
            SOCIAL-PROOF // BENTO GRID
          </text>
        </g>
      </svg>
    </div>
  );
};

export default TestimonialArt;
