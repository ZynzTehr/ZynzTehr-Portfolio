import React from "react";

/*
 * JobSeance: a ouija planchette hovers over a job posting whose lower edge
 * fades into a ghost's hem, its lens settling on a red flag while a risk
 * gauge beside it swings toward "high".
 */
const JobSeanceArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="jobseance-bg" cx="45%" cy="45%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <radialGradient id="jobseance-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4474ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#4474ff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="jobseance-card-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#17244f" />
            <stop offset="65%" stopColor="#0f1a3a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0b1328" stopOpacity="0.35" />
          </linearGradient>

          <linearGradient id="jobseance-card-stroke" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4474ff" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="jobseance-planchette" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#243a7a" />
            <stop offset="55%" stopColor="#132254" />
            <stop offset="100%" stopColor="#0a1230" />
          </linearGradient>

          <radialGradient id="jobseance-lens" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#93c5fd" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="jobseance-needle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          <filter id="jobseance-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter
            id="jobseance-blur-wide"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="640"
            height="320"
          >
            <feGaussianBlur stdDeviation="6" />
          </filter>

          <filter id="jobseance-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        <style>{`
          @keyframes jobseanceHover {
            0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
            30% { transform: translate(-7px, -6px) rotate(-3deg); }
            65% { transform: translate(6px, -3px) rotate(2deg); }
          }
          @keyframes jobseanceShadow {
            0%, 100% { opacity: 0.55; transform: translate(0px, 0px) scale(1); }
            30% { opacity: 0.32; transform: translate(-4px, 0px) scale(0.9); }
            65% { opacity: 0.42; transform: translate(4px, 0px) scale(0.95); }
          }
          @keyframes jobseanceNeedle {
            0%, 100% { transform: rotate(0deg); }
            35% { transform: rotate(-26deg); }
            50% { transform: rotate(-20deg); }
            75% { transform: rotate(3deg); }
          }
          @keyframes jobseanceTwinkle {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.6; }
          }
          .jobseance-planchette {
            transform-origin: 262px 180px;
            animation: jobseanceHover 8s ease-in-out infinite;
          }
          .jobseance-shadow {
            transform-origin: 276px 236px;
            animation: jobseanceShadow 8s ease-in-out infinite;
          }
          .jobseance-needle {
            transform-origin: 494px 200px;
            animation: jobseanceNeedle 6s ease-in-out infinite;
          }
          .jobseance-star {
            animation: jobseanceTwinkle 4s ease-in-out infinite;
          }
          .jobseance-star-b { animation-delay: -1.3s; }
          .jobseance-star-c { animation-delay: -2.6s; }
          @media (prefers-reduced-motion: reduce) {
            .jobseance-planchette,
            .jobseance-shadow,
            .jobseance-needle,
            .jobseance-star { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#jobseance-bg)" />
        <ellipse cx="250" cy="160" rx="210" ry="140" fill="url(#jobseance-aura)" />

        {/* Ouija board hints: letter arc, sun and moon */}
        <g fill="#93c5fd">
          {Array.from({ length: 23 }, (_, i) => {
            const a = Math.PI * (1.12 + (0.76 * i) / 22);
            const cx = 320 + 330 * Math.cos(a);
            const cy = 372 + 330 * Math.sin(a);
            const cls =
              i % 3 === 0
                ? "jobseance-star"
                : i % 3 === 1
                  ? "jobseance-star jobseance-star-b"
                  : "jobseance-star jobseance-star-c";
            return i % 2 === 0 ? (
              <circle key={i} cx={cx} cy={cy} r="2.2" className={cls} />
            ) : (
              <rect
                key={i}
                x={cx - 1}
                y={cy - 5}
                width="2"
                height="10"
                rx="1"
                className={cls}
                transform={`rotate(${(a * 180) / Math.PI + 90} ${cx} ${cy})`}
              />
            );
          })}
        </g>
        <g stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.3">
          <circle cx="44" cy="42" r="10" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (Math.PI * i) / 4;
            return (
              <line
                key={i}
                x1={44 + 15 * Math.cos(a)}
                y1={42 + 15 * Math.sin(a)}
                x2={44 + 21 * Math.cos(a)}
                y2={42 + 21 * Math.sin(a)}
                strokeLinecap="round"
              />
            );
          })}
          <path d="M 604,28 A 16,16 0 1 0 610,56 A 12,12 0 1 1 604,28 Z" />
        </g>

        {/* Job posting card with a ghostly hem */}
        <g transform="rotate(-4 210 150)">
          <path
            d="M 102,56 H 318 Q 330,56 330,68 V 228
               A 20,20 0 0 1 290,228 A 20,20 0 0 1 250,228
               A 20,20 0 0 1 210,228 A 20,20 0 0 1 170,228
               A 20,20 0 0 1 130,228 A 20,20 0 0 1 90,228
               V 68 Q 90,56 102,56 Z"
            fill="url(#jobseance-card-fill)"
            stroke="url(#jobseance-card-stroke)"
            strokeWidth="2.5"
            filter="url(#jobseance-glow)"
          />

          {/* Company logo with briefcase */}
          <rect x="108" y="74" width="38" height="38" rx="9" fill="#0d59ff" />
          <g stroke="#dbeafe" strokeWidth="2.2" fill="none" strokeLinejoin="round">
            <rect x="116" y="87" width="22" height="16" rx="3" />
            <path d="M 122,87 V 83 Q 122,81 124,81 H 130 Q 132,81 132,83 V 87" />
            <line x1="116" y1="94" x2="138" y2="94" />
          </g>

          {/* Title and company */}
          <rect x="158" y="78" width="132" height="11" rx="5.5" fill="#dbeafe" opacity="0.9" />
          <rect x="158" y="97" width="84" height="8" rx="4" fill="#60a5fa" opacity="0.7" />

          <line
            x1="108"
            y1="126"
            x2="312"
            y2="126"
            stroke="#4474ff"
            strokeWidth="1.2"
            opacity="0.5"
          />

          {/* Body copy */}
          <g fill="#93c5fd" opacity="0.4">
            <rect x="108" y="140" width="190" height="7" rx="3.5" />
            <rect x="108" y="156" width="164" height="7" rx="3.5" />
            <rect x="108" y="188" width="176" height="7" rx="3.5" />
          </g>
          {/* The red flag line */}
          <rect x="108" y="172" width="172" height="7" rx="3.5" fill="#fb7185" opacity="0.85" />

          {/* Apply button */}
          <rect x="108" y="206" width="66" height="16" rx="8" fill="#0d59ff" opacity="0.85" />
          <rect x="122" y="212" width="38" height="4" rx="2" fill="#dbeafe" opacity="0.8" />
        </g>

        {/* Hover shadow beneath the planchette */}
        <ellipse
          cx="276"
          cy="236"
          rx="52"
          ry="11"
          fill="#000"
          filter="url(#jobseance-soft)"
          className="jobseance-shadow"
        />

        {/* Planchette */}
        <g className="jobseance-planchette">
          <g transform="translate(262 180) rotate(-22)">
            <path
              d="M 0,-74 C 24,-50 62,-14 60,22 C 58,50 32,62 15,52
                 C 8,47 3,42 0,38 C -3,42 -8,47 -15,52
                 C -32,62 -58,50 -60,22 C -62,-14 -24,-50 0,-74 Z
                 M 0,-26 A 21,21 0 1 0 0,16 A 21,21 0 1 0 0,-26 Z"
              fill="url(#jobseance-planchette)"
              fillRule="evenodd"
              stroke="#93c5fd"
              strokeWidth="2.5"
              strokeLinejoin="round"
              filter="url(#jobseance-glow)"
            />
            {/* Inlaid trim */}
            <path
              d="M 0,-60 C 18,-40 48,-12 47,18 C 46,36 32,44 20,40"
              fill="none"
              stroke="#4474ff"
              strokeWidth="1.4"
              opacity="0.7"
              strokeLinecap="round"
            />
            <path
              d="M 0,-60 C -18,-40 -48,-12 -47,18 C -46,36 -32,44 -20,40"
              fill="none"
              stroke="#4474ff"
              strokeWidth="1.4"
              opacity="0.7"
              strokeLinecap="round"
            />
            {/* Lens */}
            <circle cx="0" cy="-5" r="21" fill="url(#jobseance-lens)" />
            <circle cx="0" cy="-5" r="21" fill="none" stroke="#dbeafe" strokeWidth="3" />
            <path
              d="M -12,-15 A 15,15 0 0 1 2,-19"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Felt feet */}
            <circle cx="-38" cy="34" r="3" fill="#60a5fa" />
            <circle cx="38" cy="34" r="3" fill="#60a5fa" />
            <circle cx="0" cy="-56" r="3" fill="#60a5fa" />
          </g>
        </g>

        {/* Risk gauge */}
        <g>
          <circle cx="494" cy="200" r="100" fill="url(#jobseance-aura)" />
          <path
            d="M 561.2,156.7 A 80,80 0 0 1 574,200"
            fill="none"
            stroke="#fb7185"
            strokeWidth="22"
            opacity="0.45"
            filter="url(#jobseance-blur-wide)"
          />
          <g fill="none" strokeWidth="15">
            <path d="M 414,200 A 80,80 0 0 1 426.8,156.7" stroke="#93c5fd" />
            <path d="M 429.9,152.1 A 80,80 0 0 1 466.1,125" stroke="#60a5fa" />
            <path d="M 471.4,123.3 A 80,80 0 0 1 516.6,123.3" stroke="#4474ff" />
            <path d="M 521.9,125 A 80,80 0 0 1 558.1,152.1" stroke="#0d59ff" />
            <path d="M 561.2,156.7 A 80,80 0 0 1 574,200" stroke="#fb7185" />
          </g>
          <path
            d="M 436,200 A 58,58 0 0 1 552,200"
            fill="none"
            stroke="#4474ff"
            strokeWidth="1.2"
            strokeDasharray="2 6"
            opacity="0.6"
          />
          <line
            x1="400"
            y1="209"
            x2="588"
            y2="209"
            stroke="#4474ff"
            strokeWidth="1.2"
            opacity="0.45"
          />

          {/* Ghost glyph in the dial face */}
          <g transform="translate(494 166)">
            <path
              d="M -12,9 V -2 A 12,12 0 0 1 12,-2 V 9 L 8,5.5 L 4,9 L 0,5.5 L -4,9 L -8,5.5 Z"
              fill="#dbeafe"
              opacity="0.85"
            />
            <circle cx="-4.5" cy="-2" r="2" fill="#0b1328" />
            <circle cx="4.5" cy="-2" r="2" fill="#0b1328" />
          </g>

          {/* Needle, resting in the high-risk band */}
          <g className="jobseance-needle">
            <g transform="rotate(-18 494 200)">
              <path
                d="M 494,194.5 L 564,200 L 494,205.5 Z"
                fill="url(#jobseance-needle)"
                filter="url(#jobseance-glow)"
              />
            </g>
          </g>
          <circle cx="494" cy="200" r="9" fill="#0b1328" stroke="#93c5fd" strokeWidth="2.5" />
          <circle cx="494" cy="200" r="3" fill="#fb7185" />
        </g>

        {/* Caption */}
        <g transform="translate(260 276)">
          <rect
            width="120"
            height="26"
            rx="6"
            fill="rgba(68, 116, 255, 0.14)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="60"
            y="13"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="bold"
            letterSpacing="2"
          >
            JOBSEANCE
          </text>
        </g>
      </svg>
    </div>
  );
};

export default JobSeanceArt;
