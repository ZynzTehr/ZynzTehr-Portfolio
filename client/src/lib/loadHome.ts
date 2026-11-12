let homePromise: Promise<typeof import("../pages/Home")> | null = null;

/** Shared, memoized import of the Home chunk (used by the route and the prologue prefetch). */
export function loadHome(): Promise<typeof import("../pages/Home")> {
  homePromise ??= import("../pages/Home");
  return homePromise;
}
