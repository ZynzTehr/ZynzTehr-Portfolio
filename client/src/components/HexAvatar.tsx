import React from 'react';

const HexAvatar: React.FC = () => {
  return (
    <a
      href="https://zynztehr.github.io/ZynzTehr-Profile/"
      target="_blank"
      rel="noopener noreferrer"
      className="hex-avatar-link"
      title="Visit Interactive Profile"
    >
      <svg
        viewBox="0 0 120 140"
        width="56"
        height="64"
        xmlns="http://www.w3.org/2000/svg"
        className="hex-avatar-svg"
      >
        <defs>
          <linearGradient id="hexFill" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#7950f2" />
          </linearGradient>

          <linearGradient id="hexStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffc8" />
            <stop offset="100%" stopColor="#7950f2" />
          </linearGradient>

          <filter id="hexGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Hexagon Fill */}
        <polygon
          points="60,8 110,35 110,95 60,122 10,95 10,35"
          fill="url(#hexFill)"
          opacity="0.85"
        />

        {/* Hexagon Glowing Border */}
        <polygon
          points="60,8 110,35 110,95 60,122 10,95 10,35"
          fill="none"
          stroke="url(#hexStroke)"
          strokeWidth="2.5"
          filter="url(#hexGlow)"
          className="hex-border"
        />

        {/* Avatar Silhouette - Head */}
        <circle cx="60" cy="55" r="18" fill="#060914" opacity="0.9" />

        {/* Avatar Silhouette - Body */}
        <path d="M 37,100 C 37,78 83,78 83,100 Z" fill="#060914" opacity="0.9" />

        {/* Chevron Detail */}
        <path
          d="M 50,52 L 60,62 L 70,52"
          fill="none"
          stroke="#00ffc8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
};

export default HexAvatar;
