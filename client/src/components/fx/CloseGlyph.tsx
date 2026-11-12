import React from "react";

/**
 * The close mark. At rest it is a plain X. When a pointer hovers its (danger)
 * button the strokes spin a quarter turn and draw in tight, a reticle ring
 * traces itself around them and the whole mark turns red: the X becomes an
 * "abort" target. Keyboard focus keeps the standard focus ring. Styles live
 * with the pixel buttons in mission.css (.close-glyph); reduced motion keeps
 * only the color change.
 */
const CloseGlyph: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    className="close-glyph"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle className="close-glyph__ring" cx="12" cy="12" r="10" pathLength={1} />
    <g className="close-glyph__cross">
      <line className="close-glyph__a" x1="6" y1="6" x2="18" y2="18" />
      <line className="close-glyph__b" x1="18" y1="6" x2="6" y2="18" />
    </g>
  </svg>
);

export default CloseGlyph;
