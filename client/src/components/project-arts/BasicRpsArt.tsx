import React from 'react';

const BasicRpsArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="basicGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00d8ff" />
            <stop offset="50%" stopColor="#00ffc8" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          <linearGradient id="rockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d8ff" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          <linearGradient id="scissorsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          <radialGradient id="basicBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#121728" />
            <stop offset="60%" stopColor="#070914" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <filter id="basicGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="basicFillClip">
            <rect x="0" y="0" width="640" height="320" className="basic-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes basicRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes basicDraw {
            0% { stroke-dashoffset: 1400; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes floatEmblem1 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          @keyframes floatEmblem2 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(6px); }
          }
          @keyframes floatEmblem3 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          @keyframes energyFlow {
            0% { stroke-dashoffset: 60; }
            100% { stroke-dashoffset: 0; }
          }
          .basic-fill-rect {
            animation: basicRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .basic-outline {
            stroke-dasharray: 1400;
            stroke-dashoffset: 1400;
            animation: basicDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .emblem-rock { animation: floatEmblem1 3.2s infinite ease-in-out; }
          .emblem-paper { animation: floatEmblem2 3.2s infinite ease-in-out 0.5s; }
          .emblem-scissors { animation: floatEmblem3 3.2s infinite ease-in-out 1s; }
          .energy-track { stroke-dasharray: 8 8; animation: energyFlow 2s linear infinite; }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#basicBg)" />

        {/* Cyber Circuit Grid Lines */}
        <g stroke="rgba(0, 216, 255, 0.1)" strokeWidth="1">
          <line x1="60" y1="145" x2="580" y2="145" />
          <line x1="180" y1="40" x2="180" y2="260" />
          <line x1="320" y1="40" x2="320" y2="260" />
          <line x1="460" y1="40" x2="460" y2="260" />
        </g>

        {/* Energy Track Connector Loop */}
        <path
          d="M 180,145 C 240,95 260,95 320,145 C 380,195 400,195 460,145"
          fill="none"
          stroke="rgba(0, 255, 200, 0.35)"
          strokeWidth="2"
          className="energy-track"
        />
        <path
          d="M 460,145 C 380,85 260,85 180,145"
          fill="none"
          stroke="rgba(0, 216, 255, 0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* FILL LAYER (Bottom-to-Top animated unveil) */}
        <g clipPath="url(#basicFillClip)">
          {/* Top Versus / Score HUD */}
          <g transform="translate(250, 28)">
            <rect width="140" height="32" rx="16" fill="#080c18" stroke="rgba(0, 255, 200, 0.4)" strokeWidth="1.5" />
            <text x="70" y="16" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="12" fontFamily="monospace" fontWeight="bold">
              PLAYER VS CPU
            </text>
          </g>

          {/* Node 1: Rock Emblem (Left - 180, 145) */}
          <g className="emblem-rock" transform="translate(0, 0)">
            <circle cx="180" cy="145" r="46" fill="url(#rockGrad)" opacity="0.85" />
            <circle cx="180" cy="145" r="38" fill="#070914" />
            <circle cx="180" cy="145" r="32" fill="rgba(0, 216, 255, 0.12)" />
            <text x="180" y="146" textAnchor="middle" dominantBaseline="central" fontSize="28">
              ✊
            </text>
            <rect x="145" y="200" width="70" height="22" rx="11" fill="rgba(0, 216, 255, 0.15)" stroke="#00d8ff" strokeWidth="1" />
            <text x="180" y="211" textAnchor="middle" dominantBaseline="central" fill="#00d8ff" fontSize="11" fontFamily="monospace" fontWeight="bold">
              ROCK
            </text>
          </g>

          {/* Node 2: Paper Emblem (Center - 320, 145) */}
          <g className="emblem-paper" transform="translate(0, 0)">
            <circle cx="320" cy="145" r="46" fill="url(#paperGrad)" opacity="0.85" />
            <circle cx="320" cy="145" r="38" fill="#070914" />
            <circle cx="320" cy="145" r="32" fill="rgba(0, 255, 200, 0.12)" />
            <text x="320" y="146" textAnchor="middle" dominantBaseline="central" fontSize="28">
              ✋
            </text>
            <rect x="285" y="200" width="70" height="22" rx="11" fill="rgba(0, 255, 200, 0.15)" stroke="#00ffc8" strokeWidth="1" />
            <text x="320" y="211" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="11" fontFamily="monospace" fontWeight="bold">
              PAPER
            </text>
          </g>

          {/* Node 3: Scissors Emblem (Right - 460, 145) */}
          <g className="emblem-scissors" transform="translate(0, 0)">
            <circle cx="460" cy="145" r="46" fill="url(#scissorsGrad)" opacity="0.85" />
            <circle cx="460" cy="145" r="38" fill="#070914" />
            <circle cx="460" cy="145" r="32" fill="rgba(239, 68, 68, 0.12)" />
            <text x="460" y="146" textAnchor="middle" dominantBaseline="central" fontSize="28">
              ✌️
            </text>
            <rect x="420" y="200" width="80" height="22" rx="11" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="1" />
            <text x="460" y="211" textAnchor="middle" dominantBaseline="central" fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">
              SCISSORS
            </text>
          </g>
        </g>

        {/* OUTLINE LAYER (Laser draw-in outline with glow) */}
        <g className="basic-outline" filter="url(#basicGlow)">
          {/* Rock Ring Outline */}
          <circle cx="180" cy="145" r="46" fill="none" stroke="#00d8ff" strokeWidth="3" />

          {/* Paper Ring Outline */}
          <circle cx="320" cy="145" r="46" fill="none" stroke="#00ffc8" strokeWidth="3" />

          {/* Scissors Ring Outline */}
          <circle cx="460" cy="145" r="46" fill="none" stroke="#ef4444" strokeWidth="3" />

          {/* Top Score Ring */}
          <rect x="250" y="28" width="140" height="32" rx="16" fill="none" stroke="#00ffc8" strokeWidth="1.5" />
        </g>

        {/* Bottom Tag */}
        <g transform="translate(240, 275)">
          <rect width="160" height="28" rx="6" fill="rgba(0, 255, 200, 0.12)" stroke="#00ffc8" strokeWidth="1.2" />
          <text x="80" y="14" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="10" fontFamily="monospace" fontWeight="bold">
            VANILLA JS // RPS
          </text>
        </g>
      </svg>
    </div>
  );
};

export default BasicRpsArt;
