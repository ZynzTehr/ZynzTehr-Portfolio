import React from "react";

// Dial geometry (viewBox units). 0deg points straight up, angles grow clockwise.
const DIAL_X = 360;
const DIAL_Y = 120;

const polar = (radius: number, deg: number): [number, number] => {
  const rad = (deg * Math.PI) / 180;
  return [
    Math.round((DIAL_X + radius * Math.sin(rad)) * 100) / 100,
    Math.round((DIAL_Y - radius * Math.cos(rad)) * 100) / 100,
  ];
};

const arc = (radius: number, from: number, to: number): string => {
  const [x1, y1] = polar(radius, from);
  const [x2, y2] = polar(radius, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${x1},${y1} A ${radius} ${radius} 0 ${large} 1 ${x2},${y2}`;
};

// Scale ticks every 10deg across a 260deg sweep; every third one is a major.
const TICKS = Array.from({ length: 27 }, (_, i) => {
  const deg = -130 + i * 10;
  const major = i % 3 === 0;
  const [x1, y1] = polar(major ? 50 : 54, deg);
  const [x2, y2] = polar(62, deg);
  return { deg, major, x1, y1, x2, y2 };
});

// Inspection timeline: done, done, done, now (under the dial), due soon, scheduled.
const TIMELINE_Y = 240;
const DONE = [120, 200, 280];
const DUE_SOON = 440;
const SCHEDULED = [520];
const MINOR_TICKS = Array.from({ length: 25 }, (_, i) => 80 + i * 20);

const GRIP_RIDGES = Array.from({ length: 9 }, (_, i) => 476 + i * 12);

const TorqueLineArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="torqueline-bg" cx="50%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#050816" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="torqueline-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24,0 L 0,0 0,24" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <linearGradient id="torqueline-steel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#24375f" />
            <stop offset="45%" stopColor="#0f1a33" />
            <stop offset="100%" stopColor="#16244a" />
          </linearGradient>

          <linearGradient id="torqueline-edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="55%" stopColor="#4474ff" />
            <stop offset="100%" stopColor="#0d59ff" />
          </linearGradient>

          <linearGradient id="torqueline-bezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="50%" stopColor="#0d59ff" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          <radialGradient id="torqueline-face" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#0f1a36" />
            <stop offset="100%" stopColor="#03060f" />
          </radialGradient>

          <linearGradient id="torqueline-track" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d59ff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          <radialGradient id="torqueline-pulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="45%" stopColor="#4474ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0d59ff" stopOpacity="0" />
          </radialGradient>

          <filter
            id="torqueline-glow"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="640"
            height="320"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes torqueline-pull {
            0%, 8% { transform: rotate(-122deg); }
            46% { transform: rotate(64deg); }
            50% { transform: rotate(60deg); }
            54%, 70% { transform: rotate(64deg); }
            92%, 100% { transform: rotate(-122deg); }
          }
          @keyframes torqueline-click {
            0%, 42% { opacity: 0.25; }
            50%, 66% { opacity: 1; }
            80%, 100% { opacity: 0.25; }
          }
          @keyframes torqueline-travel {
            0% { transform: translateX(0px); opacity: 0; }
            8% { opacity: 1; }
            88% { opacity: 1; }
            100% { transform: translateX(460px); opacity: 0; }
          }
          @keyframes torqueline-due {
            0%, 100% { opacity: 0.35; transform: scale(0.85); }
            50% { opacity: 1; transform: scale(1.15); }
          }
          .torqueline-needle {
            transform-origin: ${DIAL_X}px ${DIAL_Y}px;
            transform: rotate(64deg);
            animation: torqueline-pull 7s cubic-bezier(0.45, 0, 0.25, 1) infinite;
          }
          .torqueline-zone {
            animation: torqueline-click 7s ease-in-out infinite;
          }
          .torqueline-travel {
            animation: torqueline-travel 9s linear infinite;
          }
          .torqueline-due {
            transform-origin: ${DUE_SOON}px ${TIMELINE_Y}px;
            animation: torqueline-due 3.5s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .torqueline-needle, .torqueline-zone, .torqueline-travel, .torqueline-due {
              animation: none;
            }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#torqueline-bg)" />
        <rect width="640" height="320" fill="url(#torqueline-grid)" opacity="0.07" />

        {/* ---------- Dial-type torque wrench ---------- */}

        {/* Ratchet head with square drive */}
        <g>
          <circle
            cx="86"
            cy={DIAL_Y}
            r="30"
            fill="url(#torqueline-steel)"
            stroke="url(#torqueline-edge)"
            strokeWidth="2.5"
          />
          <circle
            cx="86"
            cy={DIAL_Y}
            r="20"
            fill="none"
            stroke="#4474ff"
            strokeWidth="1.2"
            strokeDasharray="2.5 3"
            opacity="0.7"
          />
          <rect
            x="77"
            y={DIAL_Y - 9}
            width="18"
            height="18"
            rx="2"
            fill="#020308"
            stroke="#93c5fd"
            strokeWidth="2"
          />
        </g>

        {/* Beam: tapers from head to dial housing */}
        <path
          d={`M 112,${DIAL_Y - 9} L 292,${DIAL_Y - 15} L 292,${DIAL_Y + 15} L 112,${DIAL_Y + 9} Z`}
          fill="url(#torqueline-steel)"
          stroke="url(#torqueline-edge)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <line
          x1="118"
          y1={DIAL_Y - 6}
          x2="288"
          y2={DIAL_Y - 11}
          stroke="#93c5fd"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Neck to grip */}
        <path
          d={`M 428,${DIAL_Y - 13} L 468,${DIAL_Y - 15} L 468,${DIAL_Y + 15} L 428,${DIAL_Y + 13} Z`}
          fill="url(#torqueline-steel)"
          stroke="url(#torqueline-edge)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Knurled grip */}
        <rect
          x="462"
          y={DIAL_Y - 19}
          width="138"
          height="38"
          rx="19"
          fill="url(#torqueline-steel)"
          stroke="url(#torqueline-edge)"
          strokeWidth="2.5"
        />
        <g stroke="#4474ff" strokeWidth="2" strokeLinecap="round" opacity="0.6">
          {GRIP_RIDGES.map((x) => (
            <line key={x} x1={x} y1={DIAL_Y - 11} x2={x} y2={DIAL_Y + 11} />
          ))}
        </g>
        <circle cx="586" cy={DIAL_Y} r="4" fill="#020308" stroke="#60a5fa" strokeWidth="1.5" />

        {/* Dial housing */}
        <circle cx={DIAL_X} cy={DIAL_Y} r="80" fill="#050816" />
        <circle
          cx={DIAL_X}
          cy={DIAL_Y}
          r="76"
          fill="url(#torqueline-face)"
          stroke="url(#torqueline-bezel)"
          strokeWidth="7"
          filter="url(#torqueline-glow)"
        />
        <circle
          cx={DIAL_X}
          cy={DIAL_Y}
          r="69"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="0.8"
          opacity="0.35"
        />

        {/* Scale ticks */}
        <g strokeLinecap="round">
          {TICKS.map((t) => (
            <line
              key={t.deg}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.major ? "#93c5fd" : "#4474ff"}
              strokeWidth={t.major ? 2.4 : 1.3}
              opacity={t.major ? 0.95 : 0.7}
            />
          ))}
        </g>

        {/* Spec window (target torque) and over-torque band */}
        <path
          d={arc(44, 52, 76)}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d={arc(44, 52, 76)}
          fill="none"
          stroke="#93c5fd"
          strokeWidth="5"
          strokeLinecap="round"
          className="torqueline-zone"
          filter="url(#torqueline-glow)"
        />
        <path
          d={arc(44, 100, 130)}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Needle (drawn pointing up, rotated by CSS) */}
        <g className="torqueline-needle">
          <path
            d={`M ${DIAL_X - 5},${DIAL_Y + 18} L ${DIAL_X - 1.2},${DIAL_Y - 60} L ${DIAL_X + 1.2},${DIAL_Y - 60} L ${DIAL_X + 5},${DIAL_Y + 18} Z`}
            fill="#93c5fd"
            filter="url(#torqueline-glow)"
          />
        </g>
        <circle cx={DIAL_X} cy={DIAL_Y} r="9" fill="#0d59ff" stroke="#93c5fd" strokeWidth="2" />
        <circle cx={DIAL_X} cy={DIAL_Y} r="3" fill="#020308" />

        {/* ---------- Inspection timeline ---------- */}

        {/* Leader from the dial down to "now" */}
        <line
          x1={DIAL_X}
          y1={DIAL_Y + 86}
          x2={DIAL_X}
          y2={TIMELINE_Y - 10}
          stroke="#60a5fa"
          strokeWidth="1.4"
          strokeDasharray="3 4"
          opacity="0.7"
        />

        <g stroke="#4474ff" strokeWidth="1" opacity="0.35">
          {MINOR_TICKS.map((x) => (
            <line key={x} x1={x} y1={TIMELINE_Y + 6} x2={x} y2={TIMELINE_Y + 11} />
          ))}
        </g>
        <line
          x1="80"
          y1={TIMELINE_Y}
          x2="560"
          y2={TIMELINE_Y}
          stroke="#4474ff"
          strokeWidth="2"
          opacity="0.3"
          strokeLinecap="round"
        />
        <line
          x1="80"
          y1={TIMELINE_Y}
          x2={DIAL_X}
          y2={TIMELINE_Y}
          stroke="url(#torqueline-track)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Travelling service pulse */}
        <g className="torqueline-travel">
          <circle cx="90" cy={TIMELINE_Y} r="9" fill="url(#torqueline-pulse)" />
        </g>

        {/* Completed inspections */}
        {DONE.map((x) => (
          <rect
            key={x}
            x={x - 6}
            y={TIMELINE_Y - 6}
            width="12"
            height="12"
            rx="1.5"
            transform={`rotate(45 ${x} ${TIMELINE_Y})`}
            fill="#4474ff"
            stroke="#93c5fd"
            strokeWidth="1.2"
          />
        ))}

        {/* Now: inspection under the wrench */}
        <circle
          cx={DIAL_X}
          cy={TIMELINE_Y}
          r="11"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <rect
          x={DIAL_X - 7}
          y={TIMELINE_Y - 7}
          width="14"
          height="14"
          rx="1.5"
          transform={`rotate(45 ${DIAL_X} ${TIMELINE_Y})`}
          fill="#93c5fd"
          filter="url(#torqueline-glow)"
        />

        {/* Due soon */}
        <g className="torqueline-due">
          <rect
            x={DUE_SOON - 6}
            y={TIMELINE_Y - 6}
            width="12"
            height="12"
            rx="1.5"
            transform={`rotate(45 ${DUE_SOON} ${TIMELINE_Y})`}
            fill="#020308"
            stroke="#f59e0b"
            strokeWidth="2"
          />
        </g>

        {/* Scheduled */}
        {SCHEDULED.map((x) => (
          <rect
            key={x}
            x={x - 6}
            y={TIMELINE_Y - 6}
            width="12"
            height="12"
            rx="1.5"
            transform={`rotate(45 ${x} ${TIMELINE_Y})`}
            fill="#020308"
            stroke="#4474ff"
            strokeWidth="1.5"
            opacity="0.8"
          />
        ))}

        {/* Caption */}
        <g transform="translate(250, 274)">
          <rect
            width="140"
            height="26"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="70"
            y="13"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="11"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="bold"
            letterSpacing="2"
          >
            TORQUE-LINE
          </text>
        </g>
      </svg>
    </div>
  );
};

export default TorqueLineArt;
