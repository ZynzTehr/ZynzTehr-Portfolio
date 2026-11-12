/**
 * Route cover store: the hex-orbit mark carrying the visitor from the prologue
 * to the orbit. See components/RouteCover.tsx for the states and motion.
 */

export type CoverPhase = "idle" | "covering" | "covered" | "docking";

export interface CoverState {
  phase: CoverPhase;
  origin: { x: number; y: number };
}

let state: CoverState = { phase: "idle", origin: { x: 0, y: 0 } };
const listeners = new Set<() => void>();
/** Callbacks shared between the store and the cover component. */
export const coverRuntime: {
  coveredResolve: (() => void) | null;
  dockTarget: (() => DOMRect | null) | null;
  onDocked: (() => void) | null;
} = { coveredResolve: null, dockTarget: null, onDocked: null };

export function setCoverState(next: Partial<CoverState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export function subscribeCover(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function getCoverState(): CoverState {
  return state;
}

export function getCoverPhase(): CoverPhase {
  return state.phase;
}

/** Start the cover from a viewport point. Resolves once the screen is covered. */
export function launchCover(origin: { x: number; y: number }): Promise<void> {
  if (state.phase !== "idle") return Promise.resolve();
  return new Promise((resolve) => {
    coverRuntime.coveredResolve = resolve;
    setCoverState({ phase: "covering", origin });
  });
}

/**
 * Called by the destination page once its hex button is in the DOM. Returns
 * true when a cover was waiting and the dock animation started.
 */
export function dockCover(getTarget: () => DOMRect | null, done?: () => void): boolean {
  if (state.phase !== "covered" && state.phase !== "covering") return false;
  coverRuntime.dockTarget = getTarget;
  coverRuntime.onDocked = done ?? null;
  if (state.phase === "covered") setCoverState({ phase: "docking" });
  return true;
}
