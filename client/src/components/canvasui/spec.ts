/**
 * The owner's configured props for every Canvas UI effect, copied verbatim from
 * the "Current configuration" blocks in upgrades.md (repo root) and from the
 * Ripple configuration the owner supplied. Mount sites spread these objects so
 * there is one place to audit fidelity.
 *
 * Sanctioned deviation (owner decision, 2026-11-11): the two green colors
 * (#4ade80) are tinted to ice #60a5fa so all effects share one palette, and
 * DecryptReveal's black background follows the page navy. Marked TINT below.
 */
import type { AsciiSweepOptions } from "./AsciiSweep";
import type { AsciifyOptions } from "./Asciify";
import type { DecryptRevealOptions } from "./DecryptReveal";
import type { GlyphRainOptions } from "./GlyphRain";
import type { LaserOptions } from "./Laser";
import type { LiquidOptions } from "./Liquid";
import type { ParticleScrollOptions } from "./ParticleScroll";
import type { RippleOptions } from "./Ripple";

const ICE = "#60a5fa";

/** upgrades.md lines 22-47. */
export const ASCII_SWEEP_SPEC = {
  angle: 0,
  duration: 2,
  band: 0.28,
  softness: 0.45,
  turbulence: 0.5,
  trail: 0.75,
  scale: 2,
  spacing: 1,
  tint: 0.75,
  glow: 2,
  aberration: 5,
  flicker: 0.35,
  density: 0.9,
  displace: 14,
  contrast: 1.2,
  brightness: 0,
  invert: 0,
  threshold: 0.1,
  fade: 0.75,
  charset: "ascii",
  blend: "auto",
  color: ICE, // TINT: spec #4ade80
} satisfies AsciiSweepOptions;

/** upgrades.md "Decrypt Reveal" Current configuration. */
export const DECRYPT_REVEAL_SPEC = {
  radius: 400,
  softness: 0.5,
  cell: 10,
  aspect: 0.75,
  colored: 1,
  brightness: 1,
  legibility: 1,
  contrast: 1,
  exposure: 1,
  scramble: 0.1,
  scrambleSpeed: 6,
  edgeWidth: 0.2,
  edgeFlicker: 1,
  edgeGlow: 2,
  edgeTint: 0.75,
  aberration: 10,
  passthrough: 0.15,
  threshold: 0.025,
  smoothing: 0.2,
  color: ICE, // TINT: spec #4ade80
} satisfies DecryptRevealOptions;

/** upgrades.md "Glyph Rain" Current configuration. */
export const GLYPH_RAIN_SPEC = {
  cell: 15,
  speed: 0.2,
  speedVariance: 0.5,
  density: 0.15,
  trail: 0.65,
  glow: 1.75,
  mutate: 0,
  flicker: 0,
  layers: 2,
  dim: 0.5,
  light: 2.8,
  lightRadius: 240,
  lightHeight: 172,
  relief: 0.05,
  stir: 0.7,
  stirRadius: 260,
  settle: 0.9,
  color: [0.2667, 0.4549, 1] as [number, number, number],
  headColor: [0.1686, 0.4157, 1] as [number, number, number],
} satisfies GlyphRainOptions;

/** upgrades.md "Asciify" Current configuration. */
export const ASCIIFY_SPEC = {
  radius: 0.4,
  softness: 1,
  scale: 2,
  spacing: 1,
  backgroundOpacity: 0,
  contrast: 1,
  brightness: 0,
  invert: 0,
  glow: 0.75,
  aberration: 0.75,
  strength: 1,
  baseStrength: 0,
  followSpeed: 3,
  charset: "ascii",
  background: [0, 0, 0] as [number, number, number],
} satisfies AsciifyOptions;

/** upgrades.md "Laser" Current configuration. */
export const LASER_SPEC = {
  speed: 0.3,
  offset: 140,
  thickness: 6,
  core: 1,
  radius: 20,
  glow: 2,
  wave: 10,
  width: 0.55,
  flicker: 0.2,
  reveal: 400,
  heat: 1.5,
  shimmer: 12,
  sparkle: 0.25,
  reactivity: 1,
  color: [0.051, 0.349, 1] as [number, number, number],
} satisfies LaserOptions;

/** upgrades.md "Particle Scroll" Current configuration. */
export const PARTICLE_SCROLL_SPEC = {
  point: 0.68,
  band: 420,
  density: 2,
  size: 1.25,
  spread: 220,
  gravity: 0.35,
  drift: 0.7,
  swirl: 60,
  stagger: 0.7,
  fade: 0.85,
  settle: 1.2,
  smoothing: 0.6,
} satisfies ParticleScrollOptions;

/** upgrades.md "Liquid" playground configuration. */
export const LIQUID_SPEC = {
  force: 1.1,
  radius: 0.15,
  curl: 1.9,
  pressureIterations: 4,
  pressure: 0.1,
  intensity: 7.6,
  distortion: 0.4,
  blend: 5,
  densityDissipation: 0.96,
  velocityDissipation: 1,
  simResolution: 128,
  dyeResolution: 512,
  color: [0.2588, 0.3569, 1] as [number, number, number],
  rainbow: false,
} satisfies LiquidOptions;

/** Ripple configuration supplied by the owner. */
export const RIPPLE_SPEC = {
  amplitude: 0.5,
  speed: 0.65,
  wavelength: 80,
  rings: 2,
  decay: 1,
  refraction: 100,
  dispersion: 0.5,
  shine: 0.5,
  interval: 0,
  trigger: "click",
} satisfies RippleOptions;
