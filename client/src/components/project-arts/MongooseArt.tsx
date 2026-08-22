import React from 'react';

const MongooseArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyberpunk Neon Gradients */}
          <linearGradient id="mongoGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#00ed64" />
            <stop offset="50%" stop-color="#00ffc8" />
            <stop offset="100%" stop-color="#7950f2" />
          </linearGradient>

          <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00ffc8" />
            <stop offset="50%" stop-color="#00ed64" />
            <stop offset="100%" stop-color="#00ffc8" />
          </linearGradient>

          <radialGradient id="bgArtGrad" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="60%" stop-color="#060914" />
            <stop offset="100%" stop-color="#020308" />
          </radialGradient>

          <radialGradient id="bubbleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#00ffc8" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#00ffc8" stop-opacity="0" />
          </radialGradient>

          {/* Glow Filters */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="intenseGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="blur1" />
            <feGaussianBlur stdDeviation="4" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Bottom-to-Top Fill Clip Path Animation */}
          <clipPath id="bottomToTopClip">
            <rect x="0" y="0" width="640" height="320" className="animated-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          /* Animated rising fill rectangle (bottom-to-top) */
          @keyframes riseFromBottom {
            0% {
              y: 320px;
              height: 0px;
            }
            100% {
              y: 0px;
              height: 320px;
            }
          }

          /* Outline stroke drawing animation */
          @keyframes drawStroke {
            0% {
              stroke-dashoffset: 1200;
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
          }

          /* Neon breathing pulse */
          @keyframes pulseGlow {
            0%, 100% {
              filter: drop-shadow(0 0 6px rgba(0, 255, 200, 0.4));
            }
            50% {
              filter: drop-shadow(0 0 16px rgba(0, 237, 100, 0.8));
            }
          }

          /* Floating Soda Diner bubbles */
          @keyframes floatBubble {
            0% {
              transform: translateY(0px) scale(0.8);
              opacity: 0.2;
            }
            50% {
              transform: translateY(-25px) scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: translateY(-50px) scale(0.9);
              opacity: 0;
            }
          }

          .animated-fill-rect {
            animation: riseFromBottom 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }

          .mongoose-outline {
            stroke-dasharray: 1200;
            stroke-dashoffset: 1200;
            animation: drawStroke 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .mongoose-group {
            animation: pulseGlow 3.5s infinite ease-in-out 1.8s;
          }

          .bubble-1 { animation: floatBubble 4s infinite ease-in-out 0.2s; }
          .bubble-2 { animation: floatBubble 5s infinite ease-in-out 1.2s; }
          .bubble-3 { animation: floatBubble 4.5s infinite ease-in-out 2.2s; }
          .bubble-4 { animation: floatBubble 5.5s infinite ease-in-out 0.8s; }
          .bubble-5 { animation: floatBubble 3.8s infinite ease-in-out 1.7s; }
        `}</style>

        {/* 1. Background Grid & Space Vignette */}
        <rect width="640" height="320" fill="url(#bgArtGrad)" />

        {/* Retro-Diner Cyber Perspective Floor */}
        <g opacity="0.12">
          <line x1="0" y1="270" x2="640" y2="270" stroke="#00ffc8" stroke-width="1.5" />
          <line x1="0" y1="290" x2="640" y2="290" stroke="#00ffc8" stroke-width="1.5" />
          <line x1="0" y1="310" x2="640" y2="310" stroke="#00ffc8" stroke-width="1.5" />
          <line x1="320" y1="250" x2="40" y2="320" stroke="#00ffc8" stroke-width="1.5" />
          <line x1="320" y1="250" x2="160" y2="320" stroke="#00ffc8" stroke-width="1.5" />
          <line x1="320" y1="250" x2="280" y2="320" stroke="#00ffc8" stroke-width="1.5" />
          <line x1="320" y1="250" x2="360" y2="320" stroke="#00ffc8" stroke-width="1.5" />
          <line x1="320" y1="250" x2="480" y2="320" stroke="#00ffc8" stroke-width="1.5" />
          <line x1="320" y1="250" x2="600" y2="320" stroke="#00ffc8" stroke-width="1.5" />
        </g>

        {/* Floating Neon Soda Carbonation Bubbles */}
        <g>
          <circle cx="120" cy="220" r="8" fill="url(#bubbleGlow)" className="bubble-1" />
          <circle cx="160" cy="170" r="12" fill="url(#bubbleGlow)" className="bubble-2" />
          <circle cx="480" cy="210" r="10" fill="url(#bubbleGlow)" className="bubble-3" />
          <circle cx="530" cy="150" r="7" fill="url(#bubbleGlow)" className="bubble-4" />
          <circle cx="500" cy="260" r="14" fill="url(#bubbleGlow)" className="bubble-5" />
        </g>

        {/* MongoDB Glowing Leaf Accent in Background */}
        <g transform="translate(320, 155) scale(0.65)" opacity="0.15">
          <path
            d="M0 -140 C50 -90 90 -20 90 60 C90 120 50 160 0 180 C-50 160 -90 120 -90 60 C-90 -20 -50 -90 0 -140 Z"
            fill="#00ed64"
          />
          <path d="M0 -140 L0 180" stroke="#ffffff" stroke-width="6" />
        </g>

        {/* 2. THE MONGOOSE (Vigilant, Sleek Silhouette & Outline) */}
        <g className="mongoose-group" transform="translate(40, -10)">
          
          {/* A. BOTTOM-TO-TOP ANIMATED FILL LAYER */}
          <g clipPath="url(#bottomToTopClip)">
            {/* Main Mongoose Body Fill */}
            <path
              d="M 430,135
                 C 445,130 460,118 472,122
                 C 480,125 488,135 480,142
                 C 468,150 445,158 435,165
                 C 415,182 390,195 360,205
                 C 330,215 300,218 270,216
                 C 255,225 240,245 245,268
                 C 248,276 260,280 270,280
                 L 230,280
                 C 220,280 215,268 218,252
                 C 222,236 230,224 240,214
                 C 215,210 190,200 170,185
                 C 150,170 135,148 128,125
                 C 120,95 125,60 145,35
                 C 155,22 172,16 185,25
                 C 192,31 190,45 182,55
                 C 168,75 162,100 170,126
                 C 178,152 195,172 220,184
                 C 250,198 285,200 320,194
                 C 345,190 370,178 390,165
                 C 405,155 418,142 430,135 Z"
              fill="url(#mongoGrad)"
              opacity="0.9"
            />

            {/* Mongoose Head, Ears, & Jaw Fill */}
            <path
              d="M 430,135
                 C 438,125 442,108 440,95
                 C 439,88 448,82 455,88
                 C 462,94 460,105 455,114
                 C 468,110 485,108 502,118
                 C 515,126 525,138 520,146
                 C 514,154 498,152 485,148
                 C 470,144 455,146 445,152
                 Z"
              fill="url(#mongoGrad)"
              opacity="0.9"
            />

            {/* Forepaws Fill */}
            <path
              d="M 390,190
                 C 395,210 402,240 410,265
                 C 413,275 425,280 435,280
                 L 395,280
                 C 385,280 380,268 378,250
                 C 375,232 372,212 370,195 Z"
              fill="url(#mongoGrad)"
              opacity="0.9"
            />

            {/* Glowing Eye */}
            <circle cx="488" cy="128" r="4.5" fill="#ffffff" />
          </g>

          {/* B. LUMINOUS NEON OUTLINE DRAWING LAYER */}
          <path
            d="M 145,35
               C 155,22 172,16 185,25
               C 192,31 190,45 182,55
               C 168,75 162,100 170,126
               C 178,152 195,172 220,184
               C 250,198 285,200 320,194
               C 345,190 370,178 390,165
               C 405,155 418,142 430,135
               C 438,125 442,108 440,95
               C 439,88 448,82 455,88
               C 462,94 460,105 455,114
               C 468,110 485,108 502,118
               C 515,126 525,138 520,146
               C 514,154 498,152 485,148
               C 468,150 445,158 435,165
               C 415,182 390,195 360,205
               C 330,215 300,218 270,216
               C 255,225 240,245 245,268
               C 248,276 260,280 270,280
               L 230,280
               C 220,280 215,268 218,252
               C 222,236 230,224 240,214
               C 215,210 190,200 170,185
               C 150,170 135,148 128,125
               C 120,95 125,60 145,35 Z"
            fill="none"
            stroke="url(#strokeGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neonGlow)"
            className="mongoose-outline"
          />

          {/* Forepaw Outline */}
          <path
            d="M 385,185
               C 392,208 402,240 410,265
               C 413,275 425,280 435,280
               L 395,280
               C 385,280 380,268 378,250
               C 375,232 372,212 370,195"
            fill="none"
            stroke="url(#strokeGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neonGlow)"
            className="mongoose-outline"
          />

          {/* Sleek Whiskers / Tech Detail Accent */}
          <line x1="500" y1="138" x2="535" y2="134" stroke="#00ffc8" strokeWidth="1.5" opacity="0.8" />
          <line x1="500" y1="142" x2="538" y2="144" stroke="#00ffc8" strokeWidth="1.5" opacity="0.8" />
          <line x1="498" y1="146" x2="530" y2="152" stroke="#00ffc8" strokeWidth="1.5" opacity="0.8" />
        </g>
      </svg>
    </div>
  );
};

export default MongooseArt;
