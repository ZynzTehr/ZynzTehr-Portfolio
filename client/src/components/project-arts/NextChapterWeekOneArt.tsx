import React from "react";

// Rest Easy Cleaning Co. (Next Chapter, week one): the calm, freshly tidied
// living room from the site's hero. Armchair, arched window, steaming mug,
// spray bottle on the shelf, and the sparkles of a just-cleaned floor.
const NextChapterWeekOneArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="nextchapterweekone-bg" cx="58%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060b1a" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <radialGradient id="nextchapterweekone-moon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(96, 165, 250, 0.32)" />
            <stop offset="60%" stopColor="rgba(68, 116, 255, 0.08)" />
            <stop offset="100%" stopColor="rgba(68, 116, 255, 0)" />
          </radialGradient>

          <linearGradient id="nextchapterweekone-glass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1d3a7a" />
            <stop offset="100%" stopColor="#0b1638" />
          </linearGradient>

          <linearGradient id="nextchapterweekone-chair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4474ff" />
            <stop offset="100%" stopColor="#0d59ff" />
          </linearGradient>

          <linearGradient id="nextchapterweekone-arm" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2f63ff" />
            <stop offset="100%" stopColor="#0a3fc0" />
          </linearGradient>

          <linearGradient id="nextchapterweekone-terra" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f08a55" />
            <stop offset="100%" stopColor="#c85a2b" />
          </linearGradient>

          <linearGradient id="nextchapterweekone-gleam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(147, 197, 253, 0)" />
            <stop offset="50%" stopColor="rgba(147, 197, 253, 0.9)" />
            <stop offset="100%" stopColor="rgba(147, 197, 253, 0)" />
          </linearGradient>

          <filter id="nextchapterweekone-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes nextchapterweekoneTwinkle {
            0%, 100% { opacity: 0.25; transform: scale(0.6) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.1) rotate(45deg); }
          }
          @keyframes nextchapterweekoneSteam {
            0% { opacity: 0; transform: translateY(6px); }
            35% { opacity: 0.8; }
            100% { opacity: 0; transform: translateY(-14px); }
          }
          @keyframes nextchapterweekoneGleam {
            0% { opacity: 0; transform: translateX(0px); }
            15% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; transform: translateX(300px); }
          }
          .nextchapterweekone-sparkle {
            transform-box: fill-box;
            transform-origin: center;
            animation: nextchapterweekoneTwinkle 4.5s ease-in-out infinite;
          }
          .nextchapterweekone-sparkle-b { animation-delay: -1.5s; }
          .nextchapterweekone-sparkle-c { animation-delay: -3s; }
          .nextchapterweekone-steam {
            animation: nextchapterweekoneSteam 3.6s ease-out infinite;
          }
          .nextchapterweekone-steam-b { animation-delay: -1.8s; }
          .nextchapterweekone-gleam {
            animation: nextchapterweekoneGleam 7s ease-in-out infinite;
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#nextchapterweekone-bg)" />
        <ellipse cx="420" cy="120" rx="170" ry="130" fill="url(#nextchapterweekone-moon)" />

        {/* Room scene, scaled up slightly for small cards */}
        <g transform="translate(320 146) scale(1.1) translate(-336 -146)">
          {/* Arched window */}
          <g>
            <path
              d="M 360,180 L 360,100 A 60,60 0 0 1 480,100 L 480,180 Z"
              fill="url(#nextchapterweekone-glass)"
            />
            <g stroke="#93c5fd" strokeWidth="3" fill="none" filter="url(#nextchapterweekone-glow)">
              <path d="M 360,180 L 360,100 A 60,60 0 0 1 480,100 L 480,180" />
              <line x1="420" y1="40" x2="420" y2="180" />
              <line x1="360" y1="120" x2="480" y2="120" />
            </g>
            <rect x="350" y="180" width="140" height="7" rx="3" fill="#60a5fa" opacity="0.85" />
          </g>

          {/* Bookshelf with spray bottle */}
          <g>
            <g stroke="#60a5fa" strokeWidth="3.5" strokeLinecap="round" fill="none">
              <line x1="164" y1="112" x2="164" y2="240" />
              <line x1="222" y1="112" x2="222" y2="240" />
              <line x1="160" y1="150" x2="226" y2="150" />
              <line x1="160" y1="194" x2="226" y2="194" />
              <line x1="160" y1="236" x2="226" y2="236" />
            </g>
            {/* books */}
            <rect x="172" y="124" width="9" height="26" rx="1.5" fill="#4474ff" />
            <rect x="183" y="120" width="9" height="30" rx="1.5" fill="#93c5fd" />
            <rect x="194" y="128" width="8" height="22" rx="1.5" fill="#0d59ff" />
            <rect
              x="204"
              y="131"
              width="7"
              height="20"
              rx="1.5"
              fill="#60a5fa"
              transform="rotate(14 207 150)"
            />
            {/* spray bottle */}
            <g>
              <path
                d="M 180,194 L 180,176 Q 180,171 185,171 L 195,171 Q 200,171 200,176 L 200,194 Z"
                fill="url(#nextchapterweekone-terra)"
              />
              <rect x="185" y="164" width="10" height="7" fill="#e07a46" />
              <path d="M 182,164 L 200,164 L 206,158 L 184,157 Z" fill="#93c5fd" />
              <path
                d="M 192,164 L 189,172"
                stroke="#93c5fd"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect x="184" y="179" width="12" height="8" rx="1.5" fill="#fbe3d6" opacity="0.55" />
            </g>
            {/* folded towels */}
            <rect x="172" y="222" width="42" height="7" rx="3.5" fill="#93c5fd" />
            <rect x="175" y="215" width="36" height="7" rx="3.5" fill="#4474ff" />
            <rect x="178" y="208" width="30" height="7" rx="3.5" fill="#93c5fd" opacity="0.8" />
          </g>

          {/* Armchair */}
          <g>
            {/* back legs */}
            <g stroke="#4474ff" strokeWidth="4.5" strokeLinecap="round">
              <line x1="270" y1="214" x2="268" y2="238" />
              <line x1="330" y1="214" x2="332" y2="238" />
            </g>
            {/* back */}
            <path
              d="M 252,196 L 252,124 Q 252,86 300,86 Q 348,86 348,124 L 348,196 Z"
              fill="url(#nextchapterweekone-chair)"
            />
            {/* seat */}
            <rect
              x="250"
              y="184"
              width="100"
              height="30"
              rx="10"
              fill="url(#nextchapterweekone-arm)"
            />
            {/* arms */}
            <rect
              x="234"
              y="150"
              width="28"
              height="64"
              rx="12"
              fill="url(#nextchapterweekone-arm)"
            />
            <rect
              x="338"
              y="150"
              width="28"
              height="64"
              rx="12"
              fill="url(#nextchapterweekone-arm)"
            />
            {/* outline glow */}
            <g
              fill="none"
              stroke="#93c5fd"
              strokeWidth="2.5"
              strokeLinejoin="round"
              filter="url(#nextchapterweekone-glow)"
            >
              <path
                d="M 262,152 L 262,124 Q 262,96 300,96 Q 338,96 338,124 L 338,152"
                opacity="0.55"
              />
              <path d="M 252,150 L 252,124 Q 252,86 300,86 Q 348,86 348,124 L 348,150" />
              <rect x="234" y="150" width="28" height="64" rx="12" />
              <rect x="338" y="150" width="28" height="64" rx="12" />
            </g>
            {/* front legs */}
            <g stroke="#93c5fd" strokeWidth="5" strokeLinecap="round">
              <line x1="246" y1="214" x2="238" y2="240" />
              <line x1="354" y1="214" x2="362" y2="240" />
            </g>
            {/* cushion */}
            <g transform="rotate(-6 300 166)">
              <rect
                x="274"
                y="150"
                width="52"
                height="34"
                rx="11"
                fill="url(#nextchapterweekone-terra)"
              />
              <path
                d="M 288,164 Q 300,173 312,164"
                fill="none"
                stroke="#fbe3d6"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.8"
              />
            </g>
          </g>

          {/* Side table with steaming mug */}
          <g>
            <g stroke="#60a5fa" strokeWidth="3.5" strokeLinecap="round">
              <line x1="412" y1="212" x2="404" y2="240" />
              <line x1="436" y1="212" x2="444" y2="240" />
              <line x1="424" y1="212" x2="424" y2="240" />
            </g>
            <rect x="398" y="206" width="52" height="7" rx="3.5" fill="#93c5fd" />
            <path
              d="M 414,190 L 432,190 L 431,206 L 415,206 Z"
              fill="url(#nextchapterweekone-terra)"
            />
            <path
              d="M 432,194 Q 440,194 440,199 Q 440,204 431,203"
              fill="none"
              stroke="#e07a46"
              strokeWidth="2.5"
            />
            <g fill="none" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round">
              <path
                className="nextchapterweekone-steam"
                d="M 419,184 Q 415,178 419,172 Q 423,166 419,160"
              />
              <path
                className="nextchapterweekone-steam nextchapterweekone-steam-b"
                d="M 427,184 Q 423,178 427,172 Q 431,166 427,160"
              />
            </g>
          </g>

          {/* Potted plant */}
          <g>
            <path d="M 480,198 Q 462,180 468,156 Q 488,174 480,198 Z" fill="#4474ff" />
            <path d="M 486,198 Q 492,170 516,160 Q 512,186 486,198 Z" fill="#60a5fa" />
            <path d="M 483,198 Q 478,168 490,146 Q 498,172 483,198 Z" fill="#93c5fd" />
            <path
              d="M 468,200 L 502,200 L 497,240 L 473,240 Z"
              fill="url(#nextchapterweekone-terra)"
            />
            <rect x="465" y="196" width="40" height="8" rx="3" fill="#e07a46" />
          </g>

          {/* Floor with travelling clean gleam */}
          <line
            x1="140"
            y1="241"
            x2="530"
            y2="241"
            stroke="#4474ff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="160"
            y1="252"
            x2="510"
            y2="252"
            stroke="#4474ff"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.45"
          />
          <rect
            className="nextchapterweekone-gleam"
            x="150"
            y="238"
            width="80"
            height="6"
            rx="3"
            fill="url(#nextchapterweekone-gleam)"
          />

          {/* Sparkles: the just-cleaned shine */}
          <g fill="#ffffff" filter="url(#nextchapterweekone-glow)">
            <path
              className="nextchapterweekone-sparkle"
              d="M 540,214 Q 542,224 552,226 Q 542,228 540,238 Q 538,228 528,226 Q 538,224 540,214 Z"
              fill="#93c5fd"
            />
            <path
              className="nextchapterweekone-sparkle nextchapterweekone-sparkle-b"
              d="M 444,56 Q 445,63 452,64 Q 445,65 444,72 Q 443,65 436,64 Q 443,63 444,56 Z"
            />
            <path
              className="nextchapterweekone-sparkle nextchapterweekone-sparkle-c"
              d="M 232,92 Q 234,101 243,103 Q 234,105 232,114 Q 230,105 221,103 Q 230,101 232,92 Z"
              fill="#93c5fd"
            />
            <path
              className="nextchapterweekone-sparkle nextchapterweekone-sparkle-b"
              d="M 128,200 Q 129,206 135,207 Q 129,208 128,214 Q 127,208 121,207 Q 127,206 128,200 Z"
              fill="#60a5fa"
            />
          </g>
        </g>

        {/* Caption */}
        <g transform="translate(220, 272)">
          <rect
            width="200"
            height="26"
            rx="6"
            fill="rgba(13, 89, 255, 0.14)"
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
            fontFamily="'IBM Plex Mono', monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            NEXT CHAPTER // WEEK ONE
          </text>
        </g>
      </svg>
    </div>
  );
};

export default NextChapterWeekOneArt;
