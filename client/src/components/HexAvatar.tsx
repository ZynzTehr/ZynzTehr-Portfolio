import React from "react";

const HexAvatar: React.FC = () => {
  return (
    <a
      href="https://jorgebucio.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="hex-avatar-link"
      title="Visit Interactive Profile"
      aria-label="Jorge Bucio interactive profile"
    >
      <svg
        viewBox="0 0 120 140"
        width="56"
        height="64"
        xmlns="http://www.w3.org/2000/svg"
        className="hex-avatar-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hexFill" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0d59ff" />
            <stop offset="52%" stopColor="#4474ff" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          <linearGradient id="hexStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#0d59ff" />
          </linearGradient>

          <filter id="hexGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <polygon
          points="60,8 110,35 110,95 60,122 10,95 10,35"
          fill="url(#hexFill)"
          opacity="0.88"
        />

        <polygon
          points="60,8 110,35 110,95 60,122 10,95 10,35"
          fill="none"
          stroke="url(#hexStroke)"
          strokeWidth="2.5"
          filter="url(#hexGlow)"
          className="hex-border"
        />

        <circle cx="60" cy="55" r="18" fill="#060b19" opacity="0.92" />
        <path d="M 37,100 C 37,78 83,78 83,100 Z" fill="#060b19" opacity="0.92" />
        <path
          d="M 50,52 L 60,62 L 70,52"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
};

export default HexAvatar;
