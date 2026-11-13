import type { RippleHandle } from "../components/canvasui/Ripple";

/**
 * The site-wide click ripple (Layout mounts it as a fixed overlay). Any page
 * can splash it from code, for example the prologue's Launch press.
 */
let handle: RippleHandle | null = null;

export function setClickRipple(next: RippleHandle | null) {
  handle = next;
}

/** Splash a ripple at a viewport point. Does nothing under reduced motion. */
export function splashRippleAt(clientX: number, clientY: number, strength = 1) {
  handle?.splashAtClient(clientX, clientY, strength);
}
