import React from "react";

// Service-due dial geometry: a 270 degree gauge centred at (548, 140).
const DIAL_CX = 548;
const DIAL_CY = 140;

// Point on the dial for a fraction (0..1) of the 270 degree sweep.
const dialPoint = (fraction: number, radius: number): [number, number] => {
  const theta = ((-135 + 270 * fraction) * Math.PI) / 180;
  return [DIAL_CX + radius * Math.sin(theta), DIAL_CY - radius * Math.cos(theta)];
};

const DIAL_TICKS = Array.from({ length: 21 }, (_, i) => {
  const fraction = i / 20;
  const major = i % 5 === 0;
  const [x1, y1] = dialPoint(fraction, major ? 33 : 36);
  const [x2, y2] = dialPoint(fraction, 40);
  return { x1, y1, x2, y2, major, fraction };
});

// Heartbeat trace: P wave, a tall QRS spike across the trailer, a T wave,
// then a smaller blip through the cab before it feeds the dial.
const ECG_PATH =
  "M 14,158 L 112,158 L 122,150 L 132,158 L 150,158 L 157,168 L 170,96 L 183,184 L 192,158 " +
  "L 210,158 Q 222,142 234,158 L 380,158 L 388,150 L 394,166 L 400,158 L 495,158";

const FleetPulseArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="fleetpulse-bg" cx="55%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="fleetpulse-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <linearGradient id="fleetpulse-body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#13204a" />
            <stop offset="100%" stopColor="#070d22" />
          </linearGradient>

          <linearGradient id="fleetpulse-trailer" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f1a3c" />
            <stop offset="100%" stopColor="#060b1d" />
          </linearGradient>

          <linearGradient id="fleetpulse-glass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#4474ff" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="fleetpulse-ground" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4474ff" stopOpacity="0" />
            <stop offset="45%" stopColor="#4474ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4474ff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="fleetpulse-okArc" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d59ff" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          <radialGradient id="fleetpulse-dialFace" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#111c3e" />
            <stop offset="100%" stopColor="#050916" />
          </radialGradient>

          <linearGradient id="fleetpulse-scanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <mask
            id="fleetpulse-scanMask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="640"
            height="320"
          >
            <rect
              className="fleetpulse-scan"
              x="-200"
              y="0"
              width="200"
              height="320"
              fill="url(#fleetpulse-scanGrad)"
            />
          </mask>

          <filter id="fleetpulse-glow" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="fleetpulse-softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes fleetpulseScan {
            0% { transform: translateX(0px); }
            100% { transform: translateX(900px); }
          }
          @keyframes fleetpulseNeedle {
            0%, 100% { transform: rotate(-14deg); }
            55% { transform: rotate(16deg); }
          }
          @keyframes fleetpulseLamp {
            0%, 100% { opacity: 0.35; }
            50% { opacity: 1; }
          }
          .fleetpulse-scan {
            animation: fleetpulseScan 4.8s linear infinite;
          }
          .fleetpulse-needle {
            transform-origin: ${DIAL_CX}px ${DIAL_CY}px;
            animation: fleetpulseNeedle 9s ease-in-out infinite;
          }
          .fleetpulse-lamp {
            animation: fleetpulseLamp 2.4s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .fleetpulse-scan, .fleetpulse-needle, .fleetpulse-lamp { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#fleetpulse-bg)" />
        <rect width="640" height="320" fill="url(#fleetpulse-grid)" opacity="0.07" />

        {/* Scene sits slightly low so the rig reads centred above the caption */}
        <g transform="translate(0, 8)">
          {/* Road */}
          <ellipse cx="270" cy="234" rx="240" ry="8" fill="#0d59ff" opacity="0.12" />
          <line
            x1="10"
            y1="232"
            x2="630"
            y2="232"
            stroke="url(#fleetpulse-ground)"
            strokeWidth="1.5"
          />
          <g stroke="#4474ff" strokeWidth="2" strokeLinecap="round" opacity="0.25">
            <line x1="40" y1="244" x2="76" y2="244" />
            <line x1="120" y1="244" x2="156" y2="244" />
            <line x1="200" y1="244" x2="236" y2="244" />
            <line x1="280" y1="244" x2="316" y2="244" />
            <line x1="360" y1="244" x2="396" y2="244" />
            <line x1="440" y1="244" x2="476" y2="244" />
          </g>

          {/* ===== Semi truck (Class 8 tractor + box trailer), facing right ===== */}
          <g>
            {/* Trailer underside: rear bumper + landing gear */}
            <g stroke="#4474ff" strokeWidth="2" fill="none" opacity="0.8">
              <path d="M 54,186 L 54,206 L 70,206" strokeLinecap="round" />
              <line x1="262" y1="186" x2="262" y2="214" />
              <rect x="255" y="214" width="14" height="4" rx="1" fill="#4474ff" />
            </g>

            {/* Trailer box */}
            <rect
              x="44"
              y="86"
              width="262"
              height="100"
              rx="4"
              fill="url(#fleetpulse-trailer)"
              stroke="#4474ff"
              strokeWidth="2.5"
            />
            <g stroke="#4474ff" strokeWidth="1" opacity="0.18">
              <line x1="76" y1="90" x2="76" y2="182" />
              <line x1="110" y1="90" x2="110" y2="182" />
              <line x1="144" y1="90" x2="144" y2="182" />
              <line x1="178" y1="90" x2="178" y2="182" />
              <line x1="212" y1="90" x2="212" y2="182" />
              <line x1="246" y1="90" x2="246" y2="182" />
              <line x1="280" y1="90" x2="280" y2="182" />
            </g>
            <line
              x1="48"
              y1="180"
              x2="302"
              y2="180"
              stroke="#4474ff"
              strokeWidth="1"
              opacity="0.35"
            />
            {/* Trailer marker lights */}
            <g fill="#93c5fd" opacity="0.8">
              <circle cx="50" cy="92" r="1.8" />
              <circle cx="300" cy="92" r="1.8" />
            </g>

            {/* Exhaust stack */}
            <rect
              x="309"
              y="62"
              width="6"
              height="96"
              rx="2"
              fill="#0d1a3a"
              stroke="#60a5fa"
              strokeWidth="1.5"
            />
            <rect x="307.5" y="60" width="9" height="5" rx="1.5" fill="#60a5fa" />

            {/* Tractor body: sleeper, cab, long nose hood */}
            <path
              d="M 286,198
                 L 286,190
                 L 318,190
                 L 318,100
                 Q 318,90 328,90
                 L 372,90
                 Q 386,92 394,106
                 L 406,106
                 L 420,142
                 L 458,146
                 Q 468,148 468,160
                 L 470,196
                 L 286,198 Z"
              fill="url(#fleetpulse-body)"
              stroke="#60a5fa"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Side window */}
            <path
              d="M 368,112 L 400,112 L 412,140 L 368,140 Z"
              fill="url(#fleetpulse-glass)"
              stroke="#93c5fd"
              strokeWidth="1.2"
            />
            {/* Door seam + sleeper/cab split */}
            <g stroke="#4474ff" strokeWidth="1.2" opacity="0.6" fill="none">
              <line x1="362" y1="104" x2="362" y2="186" />
              <path d="M 412,140 L 416,186" />
              <line x1="330" y1="104" x2="350" y2="104" />
            </g>
            {/* Grille + headlight */}
            <g stroke="#93c5fd" strokeWidth="1" opacity="0.7">
              <line x1="462" y1="160" x2="463" y2="186" />
              <line x1="465" y1="160" x2="466" y2="186" />
            </g>
            <rect
              x="452"
              y="164"
              width="8"
              height="5"
              rx="1.5"
              fill="#93c5fd"
              filter="url(#fleetpulse-softGlow)"
            />
            {/* Fuel tank */}
            <rect
              x="372"
              y="178"
              width="38"
              height="16"
              rx="7"
              fill="#0d1a3a"
              stroke="#4474ff"
              strokeWidth="1.5"
            />
            {/* Bumper */}
            <rect
              x="462"
              y="190"
              width="14"
              height="10"
              rx="2"
              fill="#0d1a3a"
              stroke="#60a5fa"
              strokeWidth="1.5"
            />

            {/* Wheels (arch cut-outs then tyres) */}
            <g fill="#04070f">
              <circle cx="92" cy="212" r="24" />
              <circle cx="136" cy="212" r="24" />
              <circle cx="300" cy="212" r="24" />
              <circle cx="344" cy="212" r="24" />
              <circle cx="440" cy="212" r="24" />
            </g>
            {[92, 136, 300, 344, 440].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy="212" r="19" fill="#050914" stroke="#4474ff" strokeWidth="3" />
                <circle cx={cx} cy="212" r="8" fill="#0d1a3a" stroke="#93c5fd" strokeWidth="1.5" />
                <circle cx={cx} cy="212" r="2.5" fill="#93c5fd" />
              </g>
            ))}
          </g>

          {/* ===== Heartbeat line running through the rig into the dial ===== */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={ECG_PATH} stroke="#60a5fa" strokeWidth="3.5" filter="url(#fleetpulse-glow)" />
            {/* Travelling bright pulse */}
            <path
              d={ECG_PATH}
              stroke="#eaf2ff"
              strokeWidth="4.5"
              mask="url(#fleetpulse-scanMask)"
              filter="url(#fleetpulse-glow)"
            />
          </g>

          {/* ===== Service-due dial ===== */}
          <g>
            <circle cx={DIAL_CX} cy={DIAL_CY} r="68" fill="#0d59ff" opacity="0.08" />
            <circle
              cx={DIAL_CX}
              cy={DIAL_CY}
              r="60"
              fill="url(#fleetpulse-dialFace)"
              stroke="#4474ff"
              strokeWidth="2.5"
            />
            <circle
              cx={DIAL_CX}
              cy={DIAL_CY}
              r="55"
              fill="none"
              stroke="#4474ff"
              strokeWidth="1"
              opacity="0.3"
            />

            {/* Track + status bands: ok -> due soon (15% left) -> overdue */}
            <path
              d="M 514.06,173.94 A 48 48 0 1 1 581.94,173.94"
              fill="none"
              stroke="#16234a"
              strokeWidth="9"
            />
            <path
              d="M 514.06,173.94 A 48 48 0 1 1 586.83,111.79"
              fill="none"
              stroke="url(#fleetpulse-okArc)"
              strokeWidth="9"
            />
            <path
              d="M 586.83,111.79 A 48 48 0 0 1 595.85,143.77"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="9"
            />
            <path
              d="M 595.85,143.77 A 48 48 0 0 1 581.94,173.94"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="9"
              filter="url(#fleetpulse-softGlow)"
            />

            {/* Ticks */}
            {DIAL_TICKS.map((t) => (
              <line
                key={t.fraction}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={t.fraction > 0.85 ? "#f59e0b" : "#93c5fd"}
                strokeWidth={t.major ? 2 : 1}
                opacity={t.major ? 0.9 : 0.45}
              />
            ))}

            {/* PM-A / PM-B / PM-C tier pips (A is due) */}
            <rect
              className="fleetpulse-lamp"
              x="531"
              y="166"
              width="9"
              height="5"
              rx="2"
              fill="#f59e0b"
            />
            <rect x="543.5" y="166" width="9" height="5" rx="2" fill="#93c5fd" opacity="0.8" />
            <rect x="556" y="166" width="9" height="5" rx="2" fill="#0d59ff" />

            {/* Needle, resting near the due-soon band */}
            <g transform={`rotate(72 ${DIAL_CX} ${DIAL_CY})`}>
              <g className="fleetpulse-needle">
                <path
                  d={`M ${DIAL_CX - 3},${DIAL_CY + 8} L ${DIAL_CX},${DIAL_CY - 44} L ${DIAL_CX + 3},${DIAL_CY + 8} Z`}
                  fill="#eaf2ff"
                  filter="url(#fleetpulse-softGlow)"
                />
              </g>
            </g>
            <circle
              cx={DIAL_CX}
              cy={DIAL_CY}
              r="7"
              fill="#0d1a3a"
              stroke="#60a5fa"
              strokeWidth="2"
            />
            <circle cx={DIAL_CX} cy={DIAL_CY} r="2.5" fill="#93c5fd" />
          </g>
        </g>

        {/* Caption */}
        <g transform="translate(225, 272)">
          <rect
            width="190"
            height="28"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="95"
            y="14"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            FLEET-PULSE // PM A·B·C
          </text>
        </g>
      </svg>
    </div>
  );
};

export default FleetPulseArt;
