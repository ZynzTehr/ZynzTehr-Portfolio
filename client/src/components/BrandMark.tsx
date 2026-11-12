import React from "react";

/**
 * The hex-orbit mark: the site's one persistent object, hand-built as vector
 * from the owner's chosen Flow concept (mark-b-1). A flat two-tone sapphire
 * hexagon band, a navy gap, a core split along its diagonal, and an ice orbit
 * ring in front with a satellite. It appears as the prologue lock-on, the
 * route cover, the docked HUD button glyph, the coda sign-off and the favicon
 * (public/assets/favicon.svg mirrors these exact paths).
 *
 * `variant="glyph"` draws only the core and orbit, for use inside the hex
 * button, whose own surface is the band.
 */

/** The HUD hex button polygon (120 x 140 box). */
export const HEX_POINTS = "60,8 110,35 110,95 60,122 10,95 10,35";

function hex(cx: number, cy: number, r: number): string {
  return [-90, -30, 30, 90, 150, 210]
    .map((deg) => {
      const a = (deg * Math.PI) / 180;
      return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
    })
    .join(" ");
}

/** Core hex split along its upper-right to lower-left diagonal. */
function coreHalves(cx: number, cy: number, r: number): [string, string] {
  const p = [-90, -30, 30, 90, 150, 210].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  });
  // p: 0 top, 1 upper-right, 2 lower-right, 3 bottom, 4 lower-left, 5 upper-left
  return [`${p[0]} ${p[1]} ${p[4]} ${p[5]}`, `${p[1]} ${p[2]} ${p[3]} ${p[4]}`];
}

const RING = { cx: 60, cy: 60, rx: 47, ry: 11.5, rotate: -31 };
const SAT_T = 0.13;

function ringPoint(t: number): { x: number; y: number } {
  const a = t * Math.PI * 2;
  const x0 = RING.rx * Math.cos(a);
  const y0 = -RING.ry * Math.sin(a);
  const r = (RING.rotate * Math.PI) / 180;
  return {
    x: RING.cx + x0 * Math.cos(r) - y0 * Math.sin(r),
    y: RING.cy + x0 * Math.sin(r) + y0 * Math.cos(r),
  };
}

interface MarkArtProps {
  variant: "full" | "glyph";
}

/** The raw SVG content in a 120 x 120 box, reused by the hex button. */
export const MarkArt: React.FC<MarkArtProps> = ({ variant }) => {
  const [coreLight, coreDark] = coreHalves(60, 60, variant === "glyph" ? 22 : 20);
  const sat = ringPoint(SAT_T);
  const ringTransform = `rotate(${RING.rotate} ${RING.cx} ${RING.cy})`;
  return (
    <g className="brand-mark-art">
      {variant === "full" ? (
        <g className="brand-mark-hex">
          <polygon points={hex(60, 60, 39)} fill="#1c49d4" />
          <polygon points={hex(60, 60, 35)} fill="#2c62ef" />
          <polygon points={hex(60, 60, 26)} fill="#03060f" />
        </g>
      ) : null}
      <polygon className="brand-mark-core" points={coreLight} fill="#4a80f8" />
      <polygon points={coreDark} fill="#2563eb" />
      {/* Navy halo first, so the ring reads as passing in front of the hex. */}
      <ellipse
        cx={RING.cx}
        cy={RING.cy}
        rx={RING.rx}
        ry={RING.ry}
        transform={ringTransform}
        fill="none"
        stroke="#03060f"
        strokeWidth="7"
      />
      <ellipse
        className="brand-mark-ring"
        cx={RING.cx}
        cy={RING.cy}
        rx={RING.rx}
        ry={RING.ry}
        transform={ringTransform}
        fill="none"
        stroke="#7cc4f5"
        strokeWidth="3.2"
      />
      <circle cx={sat.x} cy={sat.y} r="7.2" fill="#03060f" />
      <circle className="brand-mark-satellite" cx={sat.x} cy={sat.y} r="4.6" fill="#93d2fb" />
    </g>
  );
};

interface BrandMarkProps {
  variant?: "full" | "glyph";
  size?: number;
  className?: string;
  title?: string;
}

const BrandMark: React.FC<BrandMarkProps> = ({ variant = "full", size = 64, className, title }) => (
  <svg
    viewBox="0 0 120 120"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    role={title ? "img" : undefined}
    aria-hidden={title ? undefined : true}
  >
    {title ? <title>{title}</title> : null}
    <MarkArt variant={variant} />
  </svg>
);

export default BrandMark;
