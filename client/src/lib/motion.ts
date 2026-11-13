import { gsap } from "./gsap";

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

/**
 * A CSS `linear()` easing that traces a GSAP ease, so a Web Animation moves on
 * exactly the curve the matching GSAP tween would. Cached per ease name.
 */
const cssEaseCache = new Map<string, string>();
export function cssEase(ease: string, steps = 40): string {
  let css = cssEaseCache.get(ease);
  if (!css) {
    const curve = gsap.parseEase(ease);
    const stops = Array.from({ length: steps + 1 }, (_, i) => +curve(i / steps).toFixed(4));
    css = `linear(${stops.join(", ")})`;
    cssEaseCache.set(ease, css);
  }
  return css;
}

interface FromOptions {
  /** Seconds, like the GSAP tween it stands in for. */
  duration: number;
  delay?: number;
  stagger?: number;
  ease?: string;
}

/**
 * The Web Animations form of `gsap.from(targets, from)`: each target starts at
 * `from` (held through its delay) and settles on whatever its styles say.
 *
 * Prefer this to GSAP for reveals on elements with large subtrees. A GSAP
 * tween writes the element's inline style every frame, and in browsers whose
 * ad blocker injects its cosmetic stylesheet (thousands of selectors, some
 * keyed on [style]) every such write restyles the whole subtree. An animation
 * never touches the style attribute. Cancel the returned animations to stop.
 */
export function animateFrom(
  targets: Element | Iterable<Element> | null | undefined,
  from: Keyframe,
  { duration, delay = 0, stagger = 0, ease = EASE.out }: FromOptions,
): Animation[] {
  if (!targets) return [];
  const list = targets instanceof Element ? [targets] : Array.from(targets);
  const easing = cssEase(ease);
  return list.map((el, i) =>
    el.animate([{ ...from, offset: 0 }], {
      duration: duration * 1000,
      delay: (delay + i * stagger) * 1000,
      easing,
      fill: "backwards",
    }),
  );
}
