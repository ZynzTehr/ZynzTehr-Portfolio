import React, { useEffect, useId, useRef } from "react";
import { initPixelRippleButton } from "./pixelRipple";
import { HEX_POINTS, MarkArt } from "../BrandMark";

/**
 * The HUD hex button: the docked form of the hex-orbit mark. The Fleet Pulse
 * pixel surface is clipped to the hexagon, the glow stroke draws itself in when
 * the button docks, and the orbit glyph sits on top. It links to the
 * interactive profile at jorgebucio.com.
 */

interface HexPixelButtonProps {
  href?: string;
  size?: number;
  className?: string;
}

const HexPixelButton: React.FC<HexPixelButtonProps> = ({
  href = "https://jorgebucio.com/",
  size = 64,
  className,
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = initPixelRippleButton(el as unknown as HTMLButtonElement, {
      shape: "hex",
      pixelSize: 3,
      gap: 1,
      baseColor: "#4474ff",
      hoverGlowColor: "#93c5fd",
      rippleWaveColor: "#bfdbfe",
      ripplePeakColor: "#eaf2ff",
      alphaScale: 1.15,
      actionDelay: 0,
    });
    return () => handle.destroy();
  }, []);

  const width = Math.round((size * 120) / 140);

  return (
    <span className={`pixel-ripple-wrapper hex-btn-wrap ${className ?? ""}`}>
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hex-btn"
        style={{ width, height: size }}
        title="Open the interactive profile at jorgebucio.com"
        aria-label="Jorge Bucio, interactive profile (opens jorgebucio.com in a new tab)"
      >
        <svg viewBox="0 0 120 140" className="hex-btn__base" aria-hidden="true">
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#07163f" />
              <stop offset="100%" stopColor="#123a9c" />
            </linearGradient>
          </defs>
          <polygon points={HEX_POINTS} fill={`url(#${id}-fill)`} />
        </svg>
        <svg viewBox="0 0 120 140" className="hex-btn__top" aria-hidden="true">
          <defs>
            <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#0d59ff" />
            </linearGradient>
          </defs>
          <polygon
            className="hex-btn__edge"
            points={HEX_POINTS}
            fill="none"
            stroke={`url(#${id}-edge)`}
            strokeWidth="5"
            strokeLinejoin="round"
            pathLength={1}
          />
          <g transform="translate(12 22) scale(0.8)">
            <g className="hex-btn__glyph">
              <MarkArt variant="glyph" />
            </g>
          </g>
        </svg>
      </a>
    </span>
  );
};

export default HexPixelButton;
