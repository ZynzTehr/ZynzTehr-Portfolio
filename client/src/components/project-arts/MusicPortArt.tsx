import React from "react";

// Waveform bars that swell toward the map pin, as if the sound is pouring into it.
const WAVE_START_X = 64;
const WAVE_STEP = 10;
const WAVE_MID_Y = 128;
const WAVE_BARS = Array.from({ length: 33 }, (_, i) => {
  const t = Math.min(i, 30) / 30;
  const taper = i <= 30 ? 1 : 1 - (i - 30) * 0.3;
  const envelope = (0.18 + 0.82 * Math.pow(t, 0.85)) * taper;
  const ripple = 0.5 + 0.5 * Math.abs(Math.sin(i * 1.37 + 0.4));
  const half = Math.round(5 + 52 * envelope * ripple);
  return {
    x: WAVE_START_X + i * WAVE_STEP,
    half,
    delay: -Math.round(i * 11) / 100,
  };
});

const MusicPortArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="musicport-bg" cx="62%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <linearGradient id="musicport-wave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d59ff" stopOpacity="0.25" />
            <stop offset="55%" stopColor="#4474ff" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          <linearGradient id="musicport-pin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="45%" stopColor="#4474ff" />
            <stop offset="100%" stopColor="#0d59ff" />
          </linearGradient>

          <linearGradient id="musicport-pick" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="45%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>

          <linearGradient id="musicport-beam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
          </linearGradient>

          <filter id="musicport-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="musicport-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <style>{`
          @keyframes musicport-bar-breathe {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.42); }
          }
          @keyframes musicport-ripple-out {
            0% { transform: scale(0.35); opacity: 0.9; }
            100% { transform: scale(1.7); opacity: 0; }
          }
          @keyframes musicport-spark-travel {
            0% { transform: translateX(0); opacity: 0; }
            12% { opacity: 1; }
            88% { opacity: 1; }
            100% { transform: translateX(300px); opacity: 0; }
          }
          .musicport-bar {
            transform-box: fill-box;
            transform-origin: center;
            animation: musicport-bar-breathe 3.6s ease-in-out infinite;
          }
          .musicport-ripple {
            transform-origin: 448px 252px;
            animation: musicport-ripple-out 4.2s ease-out infinite;
          }
          .musicport-ripple-late {
            animation-delay: -2.1s;
          }
          .musicport-spark {
            animation: musicport-spark-travel 4.8s cubic-bezier(0.45, 0, 0.55, 1) infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .musicport-bar, .musicport-ripple, .musicport-spark { animation: none; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#musicport-bg)" />

        {/* Faint street map behind everything */}
        <g stroke="#4474ff" strokeWidth="1" fill="none" opacity="0.1">
          <path d="M 0,214 C 140,200 260,236 400,222 S 580,196 640,206" />
          <path d="M 0,70 C 120,84 250,52 380,64 S 560,96 640,80" />
          <path d="M 212,0 C 226,90 200,180 236,320" strokeDasharray="5 6" />
          <path d="M 560,0 C 540,110 582,210 556,320" strokeDasharray="5 6" />
          <path d="M 0,150 L 640,150" strokeDasharray="2 8" />
        </g>

        {/* Stage spotlights converging on the pin */}
        <path d="M 372,0 L 392,0 L 470,250 L 418,250 Z" fill="url(#musicport-beam)" />
        <path d="M 520,0 L 540,0 L 478,250 L 426,250 Z" fill="url(#musicport-beam)" />

        {/* Geolocation ripples at the pin tip */}
        <g fill="none" stroke="#60a5fa" strokeWidth="2">
          <ellipse cx="448" cy="252" rx="46" ry="11" className="musicport-ripple" />
          <ellipse
            cx="448"
            cy="252"
            rx="46"
            ry="11"
            className="musicport-ripple musicport-ripple-late"
          />
        </g>
        <ellipse
          cx="448"
          cy="252"
          rx="18"
          ry="4.5"
          fill="#0d59ff"
          opacity="0.55"
          filter="url(#musicport-soft)"
        />

        {/* Audio waveform flowing into the pin */}
        <line
          x1={WAVE_START_X - 10}
          y1={WAVE_MID_Y}
          x2="392"
          y2={WAVE_MID_Y}
          stroke="#4474ff"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <g fill="url(#musicport-wave)">
          {WAVE_BARS.map((bar) => (
            <rect
              key={bar.x}
              x={bar.x}
              y={WAVE_MID_Y - bar.half}
              width="6"
              height={bar.half * 2}
              rx="3"
              className="musicport-bar"
              style={{ animationDelay: `${bar.delay}s` }}
            />
          ))}
        </g>

        {/* Signal spark riding the waveform into the pin */}
        <g className="musicport-spark">
          <circle
            cx={WAVE_START_X}
            cy={WAVE_MID_Y}
            r="9"
            fill="#93c5fd"
            opacity="0.45"
            filter="url(#musicport-soft)"
          />
          <circle cx={WAVE_START_X} cy={WAVE_MID_Y} r="3.5" fill="#e0ecff" />
        </g>

        {/* Map pin with a guitar-pick heart */}
        <g filter="url(#musicport-glow)">
          <path
            d="M 448,250
               C 420,214 386,178 386,128
               A 62 62 0 1 1 510,128
               C 510,178 476,214 448,250 Z"
            fill="url(#musicport-pin)"
            stroke="#93c5fd"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
        <circle cx="448" cy="126" r="42" fill="#050a1a" stroke="#0d59ff" strokeWidth="2" />
        <path
          d="M 448,160
             C 432,147 414,124 416,108
             C 418,96 432,92 448,92
             C 464,92 478,96 480,108
             C 482,124 464,147 448,160 Z"
          fill="url(#musicport-pick)"
        />
        <path
          d="M 430,104 C 436,99 446,98 454,99"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />

        {/* Ticket stub */}
        <g transform="translate(548, 70) rotate(14)">
          <path
            d="M -38,-18 L 38,-18 L 38,-6 A 6 6 0 0 0 38,6 L 38,18 L -38,18 L -38,6 A 6 6 0 0 0 -38,-6 Z"
            fill="rgba(192, 132, 252, 0.12)"
            stroke="#c084fc"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <line
            x1="16"
            y1="-14"
            x2="16"
            y2="14"
            stroke="#c084fc"
            strokeWidth="1.4"
            strokeDasharray="3 3"
          />
          <line
            x1="-28"
            y1="-6"
            x2="6"
            y2="-6"
            stroke="#e9d5ff"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.8"
          />
          <line
            x1="-28"
            y1="4"
            x2="-6"
            y2="4"
            stroke="#c084fc"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          <circle cx="27" cy="0" r="4" fill="#c084fc" opacity="0.8" />
        </g>

        {/* Small loose picks drifting near the waveform */}
        <path
          d="M 120,232 C 113,226 106,217 107,210 C 108,205 114,203 120,203 C 126,203 132,205 133,210 C 134,217 127,226 120,232 Z"
          fill="none"
          stroke="#c084fc"
          strokeWidth="1.8"
          opacity="0.7"
          transform="rotate(-18 120 217)"
        />
        <path
          d="M 300,56 C 295,52 290,46 291,41 C 292,37 296,36 300,36 C 304,36 308,37 309,41 C 310,46 305,52 300,56 Z"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1.8"
          opacity="0.6"
          transform="rotate(22 300 46)"
        />

        {/* Caption */}
        <g transform="translate(240, 278)">
          <rect
            width="160"
            height="26"
            rx="6"
            fill="rgba(68, 116, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="80"
            y="13"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="bold"
            letterSpacing="1.5"
          >
            MUSICPORT // LIVE
          </text>
        </g>
      </svg>
    </div>
  );
};

export default MusicPortArt;
