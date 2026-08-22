import React from 'react';

const SchoolDirectoryArt: React.FC = () => {
  return (
    <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-100 h-100"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="schoolGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3178c6" />
            <stop offset="50%" stopColor="#00ffc8" />
            <stop offset="100%" stopColor="#7950f2" />
          </linearGradient>

          <linearGradient id="schoolStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3178c6" />
            <stop offset="50%" stopColor="#00ffc8" />
            <stop offset="100%" stopColor="#3178c6" />
          </linearGradient>

          <radialGradient id="schoolBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#0d1b2a" />
            <stop offset="60%" stopColor="#060d16" />
            <stop offset="100%" stopColor="#020408" />
          </radialGradient>

          <filter id="schoolGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="schoolFillClip">
            <rect x="0" y="0" width="640" height="320" className="school-fill-rect" />
          </clipPath>
        </defs>

        <style>{`
          @keyframes schoolRise {
            0% { y: 320px; height: 0px; }
            100% { y: 0px; height: 320px; }
          }
          @keyframes schoolDraw {
            0% { stroke-dashoffset: 1500; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          .school-fill-rect {
            animation: schoolRise 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            y: 320px;
            height: 0px;
          }
          .school-outline {
            stroke-dasharray: 1500;
            stroke-dashoffset: 1500;
            animation: schoolDraw 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#schoolBg)" />

        {/* TypeScript / OOP Blueprint Grid Lines */}
        <g stroke="#3178c6" strokeWidth="1" opacity="0.2">
          <line x1="60" y1="40" x2="580" y2="40" />
          <line x1="60" y1="160" x2="580" y2="160" />
          <line x1="60" y1="280" x2="580" y2="280" />
        </g>

        {/* OOP Inheritance Tree Hierarchy Graph */}
        <g transform="translate(60, 20)">
          
          {/* FILL LAYER (Bottom-to-Top) */}
          <g clipPath="url(#schoolFillClip)">
            {/* Root Node: Person Class */}
            <rect x="200" y="20" width="120" height="45" rx="10" fill="url(#schoolGrad)" opacity="0.9" />
            <text x="260" y="42.5" textAnchor="middle" dominantBaseline="central" fill="#060d16" fontSize="13" fontFamily="monospace" fontWeight="bold">class Person</text>

            {/* Child Node 1: Student */}
            <rect x="10" y="140" width="105" height="42" rx="8" fill="url(#schoolGrad)" opacity="0.85" />
            <text x="62.5" y="161" textAnchor="middle" dominantBaseline="central" fill="#060d16" fontSize="12" fontFamily="monospace" fontWeight="bold">Student</text>

            {/* Child Node 2: Teacher */}
            <rect x="140" y="140" width="105" height="42" rx="8" fill="url(#schoolGrad)" opacity="0.85" />
            <text x="192.5" y="161" textAnchor="middle" dominantBaseline="central" fill="#060d16" fontSize="12" fontFamily="monospace" fontWeight="bold">Teacher</text>

            {/* Child Node 3: Admin */}
            <rect x="270" y="140" width="105" height="42" rx="8" fill="url(#schoolGrad)" opacity="0.85" />
            <text x="322.5" y="161" textAnchor="middle" dominantBaseline="central" fill="#060d16" fontSize="12" fontFamily="monospace" fontWeight="bold">Admin</text>

            {/* Child Node 4: Custodian */}
            <rect x="400" y="140" width="115" height="42" rx="8" fill="url(#schoolGrad)" opacity="0.85" />
            <text x="457.5" y="161" textAnchor="middle" dominantBaseline="central" fill="#060d16" fontSize="12" fontFamily="monospace" fontWeight="bold">Custodian</text>

            {/* Academy Mortarboard Icon on top */}
            <path d="M 260,2 L 210,18 L 260,32 L 310,18 Z" fill="#00ffc8" opacity="0.7" />
          </g>

          {/* OUTLINE LAYER */}
          <g className="school-outline" filter="url(#schoolGlow)">
            {/* Inheritance Connector Lines */}
            <path
              d="M 260,65 L 260,105 L 62,105 L 62,140
                 M 260,105 L 192,105 L 192,140
                 M 260,105 L 322,105 L 322,140
                 M 260,105 L 457,105 L 457,140"
              fill="none"
              stroke="url(#schoolStroke)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Node Outlines */}
            <rect x="200" y="20" width="120" height="45" rx="10" fill="none" stroke="#00ffc8" strokeWidth="2.5" />
            <rect x="10" y="140" width="105" height="42" rx="8" fill="none" stroke="#3178c6" strokeWidth="2" />
            <rect x="140" y="140" width="105" height="42" rx="8" fill="none" stroke="#3178c6" strokeWidth="2" />
            <rect x="270" y="140" width="105" height="42" rx="8" fill="none" stroke="#3178c6" strokeWidth="2" />
            <rect x="400" y="140" width="115" height="42" rx="8" fill="none" stroke="#3178c6" strokeWidth="2" />
          </g>
        </g>

        {/* TypeScript OOP Architecture Tag */}
        <g transform="translate(255, 255)">
          <rect width="130" height="30" rx="6" fill="rgba(49, 120, 198, 0.15)" stroke="#3178c6" strokeWidth="1.2" />
          <text x="65" y="15" textAnchor="middle" dominantBaseline="central" fill="#00ffc8" fontSize="10" fontFamily="monospace" fontWeight="bold">TYPESCRIPT // OOP</text>
        </g>
      </svg>
    </div>
  );
};

export default SchoolDirectoryArt;
