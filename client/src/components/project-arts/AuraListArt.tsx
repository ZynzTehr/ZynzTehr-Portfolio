import React from "react";

// AuraList: the offline-first iOS to-do app, glowing in its aura, with the
// privacy policy page this repo publishes standing behind it.

// Task rows on the phone screen. `done` rows show a filled check and a struck line.
const ROWS: { y: number; w: number; done: boolean }[] = [
  { y: 92, w: 52, done: true },
  { y: 118, w: 40, done: true },
  { y: 144, w: 58, done: false },
  { y: 170, w: 34, done: false },
  { y: 196, w: 48, done: false },
];

// Privacy-policy page: three numbered sections, each a heading, a rule and body lines.
const SECTIONS: { y: number; lines: number[] }[] = [
  { y: 96, lines: [96, 88, 60] },
  { y: 140, lines: [92, 96, 74] },
  { y: 184, lines: [90, 56] },
];

const AuraListArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="auralistweb-bg" cx="55%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="auralistweb-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <radialGradient id="auralistweb-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4474ff" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#0d59ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0d59ff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="auralistweb-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a2b5e" />
            <stop offset="100%" stopColor="#070d22" />
          </linearGradient>

          <linearGradient id="auralistweb-screen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0c1634" />
            <stop offset="100%" stopColor="#050a1c" />
          </linearGradient>

          <linearGradient id="auralistweb-rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="50%" stopColor="#4474ff" />
            <stop offset="100%" stopColor="#0d59ff" />
          </linearGradient>

          <linearGradient id="auralistweb-paper" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#13204a" />
            <stop offset="100%" stopColor="#0a1230" />
          </linearGradient>

          <linearGradient id="auralistweb-shield" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4474ff" />
            <stop offset="100%" stopColor="#0d59ff" />
          </linearGradient>

          <radialGradient id="auralistweb-orb" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#eaf2ff" />
            <stop offset="45%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#0d59ff" />
          </radialGradient>

          <filter id="auralistweb-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="auralistweb-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <style>{`
          @keyframes auralistwebBreathe {
            0%, 100% { opacity: 0.75; transform: scale(0.94); }
            50% { opacity: 1; transform: scale(1.06); }
          }
          @keyframes auralistwebRing {
            0% { opacity: 0.55; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.06); }
          }
          @keyframes auralistwebCheck {
            0%, 30% { opacity: 0; transform: scale(0.4); }
            40% { opacity: 1; transform: scale(1.15); }
            46%, 88% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1); }
          }
          @keyframes auralistwebStrike {
            0%, 38% { opacity: 0; transform: scaleX(0); }
            50%, 88% { opacity: 1; transform: scaleX(1); }
            100% { opacity: 0; transform: scaleX(1); }
          }
          .auralistweb-breathe {
            transform-box: fill-box;
            transform-origin: center;
            animation: auralistwebBreathe 6s ease-in-out infinite;
          }
          .auralistweb-ring {
            transform-box: fill-box;
            transform-origin: center;
            animation: auralistwebRing 6s ease-out infinite;
          }
          .auralistweb-ring-b { animation-delay: -3s; }
          .auralistweb-check {
            transform-box: fill-box;
            transform-origin: center;
            animation: auralistwebCheck 7s ease-in-out infinite;
          }
          .auralistweb-strike {
            transform-box: fill-box;
            transform-origin: left center;
            animation: auralistwebStrike 7s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .auralistweb-breathe,
            .auralistweb-ring,
            .auralistweb-check,
            .auralistweb-strike { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#auralistweb-bg)" />
        <rect width="640" height="320" fill="url(#auralistweb-grid)" opacity="0.07" />

        <g transform="translate(-16, 0)">
          {/* ===== Aura around the phone ===== */}
          <ellipse
            className="auralistweb-breathe"
            cx="418"
            cy="137"
            rx="165"
            ry="140"
            fill="url(#auralistweb-aura)"
          />
          <g fill="none" stroke="#60a5fa" strokeWidth="1.5">
            <rect className="auralistweb-ring" x="354" y="20" width="128" height="234" rx="27" />
            <rect
              className="auralistweb-ring auralistweb-ring-b"
              x="354"
              y="20"
              width="128"
              height="234"
              rx="27"
            />
          </g>

          {/* ===== Privacy policy page behind the phone ===== */}
          <g transform="rotate(-8 280 146)">
            <rect
              x="214"
              y="50"
              width="150"
              height="200"
              rx="10"
              fill="#000"
              opacity="0.5"
              filter="url(#auralistweb-shadow)"
            />
            <path
              d="M 220,44 L 340,44 L 362,66 L 362,242 Q 362,248 356,248 L 220,248 Q 214,248 214,242 L 214,50 Q 214,44 220,44 Z"
              fill="url(#auralistweb-paper)"
              stroke="#60a5fa"
              strokeWidth="2"
            />
            {/* dog-ear */}
            <path
              d="M 340,44 L 340,62 Q 340,66 344,66 L 362,66 Z"
              fill="#1d3a7a"
              stroke="#60a5fa"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Title + "last updated" */}
            <rect x="240" y="60" width="84" height="8" rx="4" fill="#93c5fd" />
            <rect x="262" y="74" width="40" height="3.5" rx="1.75" fill="#60a5fa" opacity="0.55" />

            {SECTIONS.map((s) => (
              <g key={s.y}>
                <rect x="228" y={s.y} width="8" height="8" rx="2" fill="#4474ff" />
                <rect
                  x="241"
                  y={s.y + 1}
                  width="62"
                  height="6"
                  rx="3"
                  fill="#93c5fd"
                  opacity="0.85"
                />
                <line
                  x1="228"
                  y1={s.y + 13}
                  x2="348"
                  y2={s.y + 13}
                  stroke="#4474ff"
                  strokeWidth="1"
                  opacity="0.45"
                />
                {s.lines.map((w, i) => (
                  <rect
                    key={i}
                    x="228"
                    y={s.y + 19 + i * 7}
                    width={w * 1.2}
                    height="3"
                    rx="1.5"
                    fill="#60a5fa"
                    opacity="0.4"
                  />
                ))}
              </g>
            ))}
          </g>

          {/* Privacy shield seal on the page corner */}
          <g transform="translate(206 196)">
            <path
              d="M 0,-26 L 22,-17 L 22,2 Q 22,20 0,30 Q -22,20 -22,2 L -22,-17 Z"
              fill="url(#auralistweb-shield)"
              stroke="#93c5fd"
              strokeWidth="2"
              strokeLinejoin="round"
              filter="url(#auralistweb-glow)"
            />
            <path
              d="M -6,-4 L -6,-9 Q -6,-15 0,-15 Q 6,-15 6,-9 L 6,-4"
              fill="none"
              stroke="#eaf2ff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <rect x="-9.5" y="-5" width="19" height="15" rx="3" fill="#eaf2ff" />
            <circle cx="0" cy="1.5" r="2.3" fill="#0d59ff" />
            <rect x="-1" y="2" width="2" height="5" rx="1" fill="#0d59ff" />
          </g>

          {/* ===== iPhone with the AuraList task list ===== */}
          <g>
            <rect
              x="360"
              y="22"
              width="116"
              height="230"
              rx="22"
              fill="url(#auralistweb-body)"
              stroke="url(#auralistweb-rim)"
              strokeWidth="3"
            />
            {/* side buttons */}
            <g fill="#4474ff">
              <rect x="356" y="70" width="3" height="16" rx="1.5" />
              <rect x="356" y="92" width="3" height="24" rx="1.5" />
              <rect x="477" y="84" width="3" height="32" rx="1.5" />
            </g>
            <rect x="366" y="28" width="104" height="218" rx="17" fill="url(#auralistweb-screen)" />
            {/* dynamic island */}
            <rect x="400" y="35" width="36" height="10" rx="5" fill="#020308" />

            {/* header: list title + date, aura orb */}
            <rect x="376" y="58" width="52" height="9" rx="4.5" fill="#eaf2ff" />
            <rect x="376" y="73" width="32" height="4" rx="2" fill="#60a5fa" opacity="0.65" />
            <circle
              cx="454"
              cy="66"
              r="13"
              fill="#4474ff"
              opacity="0.25"
              filter="url(#auralistweb-glow)"
            />
            <circle cx="454" cy="66" r="8" fill="url(#auralistweb-orb)" />

            {/* task rows */}
            {ROWS.map((r, i) => (
              <g key={r.y}>
                <rect
                  x="373"
                  y={r.y}
                  width="90"
                  height="20"
                  rx="6"
                  fill="#4474ff"
                  opacity={i === 2 ? 0.2 : 0.1}
                />
                {r.done ? (
                  <g>
                    <circle cx="384" cy={r.y + 10} r="5.5" fill="#4474ff" />
                    <path
                      d={`M 381.4,${r.y + 10.2} L 383.4,${r.y + 12.2} L 386.8,${r.y + 7.8}`}
                      fill="none"
                      stroke="#eaf2ff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="395"
                      y={r.y + 8}
                      width={r.w}
                      height="4"
                      rx="2"
                      fill="#60a5fa"
                      opacity="0.35"
                    />
                    <line
                      x1="393"
                      y1={r.y + 10}
                      x2={397 + r.w}
                      y2={r.y + 10}
                      stroke="#93c5fd"
                      strokeWidth="1"
                      opacity="0.6"
                    />
                  </g>
                ) : (
                  <g>
                    <circle
                      cx="384"
                      cy={r.y + 10}
                      r="5.5"
                      fill="none"
                      stroke={i === 2 ? "#93c5fd" : "#4474ff"}
                      strokeWidth="1.5"
                    />
                    <rect
                      x="395"
                      y={r.y + 8}
                      width={r.w}
                      height="4"
                      rx="2"
                      fill={i === 2 ? "#eaf2ff" : "#93c5fd"}
                      opacity={i === 2 ? 0.9 : 0.7}
                    />
                  </g>
                )}
              </g>
            ))}

            {/* the row being ticked off right now */}
            <g className="auralistweb-check">
              <circle cx="384" cy="154" r="5.5" fill="#4474ff" filter="url(#auralistweb-glow)" />
              <path
                d="M 381.4,154.2 L 383.4,156.2 L 386.8,151.8"
                fill="none"
                stroke="#eaf2ff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <rect
              className="auralistweb-strike"
              x="393"
              y="153.5"
              width="62"
              height="1.2"
              fill="#eaf2ff"
            />

            {/* add button + home indicator */}
            <circle cx="450" cy="226" r="10" fill="#0d59ff" filter="url(#auralistweb-glow)" />
            <path
              d="M 450,221 L 450,231 M 445,226 L 455,226"
              stroke="#eaf2ff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <rect x="398" y="239" width="40" height="3" rx="1.5" fill="#93c5fd" opacity="0.7" />
          </g>
        </g>

        {/* Caption */}
        <g transform="translate(230, 272)">
          <rect
            width="180"
            height="28"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="90"
            y="14"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            AURALIST // iOS LEGAL
          </text>
        </g>
      </svg>
    </div>
  );
};

export default AuraListArt;
