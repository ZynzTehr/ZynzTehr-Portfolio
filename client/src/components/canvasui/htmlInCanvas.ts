/**
 * Shared HTML-in-canvas feature detection for every Canvas UI effect.
 *
 * This is the detection each component ships with in upgrades.md, moved to one
 * place so all effects agree. Chrome 157+ exposes the API by default; other
 * browsers fall back to each component's DOM/overlay path.
 *
 * `?fx=fallback` in the URL forces every effect onto its fallback path, which
 * keeps native and fallback modes easy to compare during review.
 */

type PaintableCanvas = HTMLCanvasElement & {
  requestPaint?: () => void;
};

type ElementImageContext = CanvasRenderingContext2D & {
  drawElementImage?: (element: Element, x: number, y: number) => unknown;
};

/**
 * Android can expose the API, but renderer crashes were reported on effect
 * pages. A process crash cannot be caught in JavaScript, so Android stays on
 * the fallback until native capture is validated there.
 */
export function isHtmlInCanvasBlocked(): boolean {
  if (typeof navigator === "undefined") return false;
  const platform = (navigator as Navigator & { userAgentData?: { platform?: string } })
    .userAgentData?.platform;
  return platform === "Android" || /Android/i.test(navigator.userAgent);
}

function isFallbackForced(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const search = window.location.search || window.location.hash.split("?")[1] || "";
    return new URLSearchParams(search).get("fx") === "fallback";
  } catch {
    return false;
  }
}

let cached: boolean | null = null;

export function supportsHtmlInCanvas(): boolean {
  if (cached !== null) return cached;
  if (typeof document === "undefined") return false;
  if (isHtmlInCanvasBlocked() || isFallbackForced()) {
    cached = false;
    return cached;
  }
  const probe = document.createElement("canvas") as PaintableCanvas;
  const ctx = probe.getContext("2d") as ElementImageContext | null;
  cached = Boolean(
    ctx && typeof ctx.drawElementImage === "function" && typeof probe.requestPaint === "function",
  );
  return cached;
}

/**
 * Release a WebGL context once its canvas has left the document, instead of
 * waiting for garbage collection. Chrome caps live contexts at about 16, and
 * hover-mounted effects would otherwise pile up. The check is deferred so a
 * re-initialization on the same canvas (React StrictMode, option changes)
 * keeps a usable context.
 */
export function loseWebGLContext(
  gl: WebGLRenderingContext | WebGL2RenderingContext | null | undefined,
): void {
  if (!gl) return;
  const canvas = gl.canvas;
  const lose = () => {
    try {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      // Context already lost or extension unavailable.
    }
  };
  // On a real unmount React has already detached the canvas: release now, so
  // the next page's contexts never overlap this one's.
  if (canvas instanceof HTMLCanvasElement && !canvas.isConnected) {
    lose();
    return;
  }
  window.setTimeout(() => {
    if (canvas instanceof HTMLCanvasElement && canvas.isConnected) return;
    lose();
  }, 0);
}
