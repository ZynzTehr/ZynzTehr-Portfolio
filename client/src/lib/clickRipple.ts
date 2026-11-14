import type { RippleHandle } from "../components/canvasui/Ripple";

/**
 * The site-wide click ripple (Layout mounts it as a fixed overlay). Any page
 * can splash it from code, for example the prologue's Launch press.
 */
let handle: RippleHandle | null = null;
/** When the last press splashed (Layout's window listener), in ms. */
let lastPressAt = -Infinity;
/** A press splash this recent already answered the click that led here. */
const PRESS_WINDOW_MS = 700;

export function setClickRipple(next: RippleHandle | null) {
  handle = next;
}

/** Splash a ripple at a viewport point. Does nothing under reduced motion. */
export function splashRippleAt(clientX: number, clientY: number, strength = 1) {
  handle?.splashAtClient(clientX, clientY, strength);
}

/** A press anywhere splashes here (Layout's window pointerdown listener). */
export function splashPressAt(clientX: number, clientY: number) {
  lastPressAt = performance.now();
  splashRippleAt(clientX, clientY);
}

/**
 * Splash from code unless a press just splashed: a button that splashes on
 * activation would otherwise ripple twice, once where it was pressed and once
 * from its own origin. Keyboard activation has no press, so it still splashes.
 */
export function splashUnlessPressed(clientX: number, clientY: number, strength = 1) {
  if (performance.now() - lastPressAt < PRESS_WINDOW_MS) return;
  splashRippleAt(clientX, clientY, strength);
}
