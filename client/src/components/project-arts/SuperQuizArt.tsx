import React from 'react';

const SuperQuizArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="quizGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#00ffc8" />
          </linearGradient>

          <linearGradient id="quizStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#00ffc8" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          <radialGradient id="quizBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#1c130b" />
            <stop offset="60%" stopColor="#0a0812" />
            <stop offset="100%" stopColor="#020108" />
          </radialGradient>

          <filter id="quizGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="quizFillClip">
            <rect x="0" y="0" width="640" height="320" className="quiz-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes quizRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes quizDraw {
            0% { stroke-dashoffset: 1400; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes floatSymbol {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }
          .quiz-fill-rect {
            animation: quizRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .quiz-outline {
            stroke-dasharray: 1400;
            stroke-dashoffset: 1400;
            animation: quizDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .sym-1 { animation: floatSymbol 4s infinite ease-in-out; }
          .sym-2 { animation: floatSymbol 4.5s infinite ease-in-out 1s; }
          .sym-3 { animation: floatSymbol 3.5s infinite ease-in-out 2s; }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#quizBg)" />

        {/* Floating Category Symbols */}
        <g className="sym-1" opacity="0.75">
          <circle cx="120" cy="85" r="28" fill="rgba(245, 158, 11, 0.12)" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="120" y="85" textAnchor="middle" dominantBaseline="central" fill="#f59e0b" fontSize="22" fontFamily="monospace" fontWeight="bold">∑</text>
        </g>

        <g className="sym-2" opacity="0.75">
          <circle cx="520" cy="85" r="28" fill="rgba(0, 255, 200, 0.12)" stroke="#00ffc8" strokeWidth="1.5" />
          <text x="520" y="85" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="18" fontFamily="monospace" fontWeight="bold">&lt;/&gt;</text>
        </g>

        <g className="sym-3" opacity="0.75">
          <circle cx="130" cy="225" r="26" fill="rgba(239, 68, 68, 0.12)" stroke="#ef4444" strokeWidth="1.5" />
          <text x="130" y="225" textAnchor="middle" dominantBaseline="central" fill="#ef4444" fontSize="20" fontFamily="monospace" fontWeight="bold">π</text>
        </g>

        <g className="sym-2" opacity="0.75">
          <circle cx="510" cy="225" r="26" fill="rgba(168, 85, 247, 0.12)" stroke="#a855f7" strokeWidth="1.5" />
          <text x="510" y="225" textAnchor="middle" dominantBaseline="central" fill="#c084fc" fontSize="18" fontFamily="monospace" fontWeight="bold">√x</text>
        </g>

        {/* Central Luminous Question Core */}
        <g transform="translate(220, 25)">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#quizFillClip)">
            {/* Hexagon Shield Core */}
            <polygon
              points="100,20 180,65 180,155 100,200 20,155 20,65"
              fill="url(#quizGrad)"
              opacity="0.9"
            />
            
            {/* Question Mark Cutout Silhouette */}
            <text
              x="100"
              y="110"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#0a0812"
              fontSize="92"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
            >
              ?
            </text>
          </g>

          {/* OUTLINE LAYER */}
          <polygon
            points="100,20 180,65 180,155 100,200 20,155 20,65"
            fill="none"
            stroke="url(#quizStroke)"
            strokeWidth="3.5"
            filter="url(#quizGlow)"
            className="quiz-outline"
          />

          {/* Glowing Question Mark Outline */}
          <text
            x="100"
            y="110"
            textAnchor="middle"
            dominantBaseline="central"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            fontSize="92"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            filter="url(#quizGlow)"
          >
            ?
          </text>
        </g>

        {/* Trivia HUD Score Badge */}
        <g transform="translate(260, 255)">
          <rect width="120" height="30" rx="8" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1.2" />
          <text x="60" y="15" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="11" fontFamily="monospace" fontWeight="bold">ANIME.JS // GRID</text>
        </g>
      </svg>
    </div>
  );
};

export default SuperQuizArt;
