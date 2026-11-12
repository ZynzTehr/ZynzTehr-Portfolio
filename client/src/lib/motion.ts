/**
 * Motion tokens. Every GSAP tween and CSS transition on the site uses these so
 * the whole journey keeps one pace: deliberate enough to read the detail, never
 * slow enough to stand between a visitor and the work. CSS mirrors live in
 * src/styles/index.css as --dur-* and --ease-*.
 */
export const DUR = {
  /** Hover acknowledgements, icon swaps. */
  micro: 0.18,
  /** Control state changes, small reveals. */
  ui: 0.32,
  /** Section and card reveals. */
  reveal: 0.64,
  /** Hero moves: the dock, the stage FLIP, the route cover. */
  hero: 0.9,
} as const;

export const EASE = {
  /** Fast out of the gate, long settle: cubic-bezier(0.16, 1, 0.3, 1). */
  out: "expo.out",
  /** Symmetric moves between two settled states. */
  inOut: "power3.inOut",
  /** Exits that accelerate away. */
  in: "power3.in",
} as const;

export const STAGGER = 0.04;

/** Prologue pacing: the AsciiSweep duration comes from upgrades.md (2s). */
export const PROLOGUE = {
  sweep: 2,
  hold: 1.6,
  firstDelay: 0.09,
} as const;
