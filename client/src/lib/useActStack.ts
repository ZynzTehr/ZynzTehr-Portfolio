import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Where every act stands this frame, from flow positions and the scroll alone
 * (no layout reads per frame). `enter[k]` runs 0 to 1 as act k slides from the
 * viewport bottom to its top (act 0 is always 1). `share[k]` is the fraction
 * of the viewport act k fills: what is left between its top and the top of
 * the act sliding over it.
 */
export interface ActFrame {
  vh: number;
  y: number;
  enter: number[];
  share: number[];
}

type ActListener = (frame: ActFrame) => void;
const actListeners = new Set<ActListener>();
let lastActFrame: ActFrame | null = null;

/** Subscribe to per-frame act positions; called at once with the latest frame. */
export function subscribeActs(listener: ActListener): () => void {
  actListeners.add(listener);
  if (lastActFrame) listener(lastActFrame);
  return () => {
    actListeners.delete(listener);
  };
}

/**
 * An act filling less than this share of the viewport is dormant: its loops
 * pause (globe, orbit, black hole) and the index folds back to its prompt.
 */
export const ACT_DORMANT_SHARE = 0.1;

/** Which acts are awake (share at or above ACT_DORMANT_SHARE). Re-renders only on change. */
export function useActsAwake(count: number): boolean[] {
  const [awake, setAwake] = useState<boolean[]>(() =>
    Array.from({ length: count }, (_, i) => i === 0),
  );
  useEffect(
    () =>
      subscribeActs((frame) => {
        setAwake((prev) => {
          const next = prev.map((_, i) => (frame.share[i] ?? 0) >= ACT_DORMANT_SHARE);
          return next.some((v, i) => v !== prev[i]) ? next : prev;
        });
      }),
    [],
  );
  return awake;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The document position an act occupies in the flow, whether or not it is
 * pinned right now. A pinned (sticky) act reports its stuck rect, so every act
 * is preceded by a zero-height `.act-anchor` that never sticks; the act's own
 * top margin is added back. Falls back to the rect when there is no anchor.
 */
export function actFlowTop(act: HTMLElement): number {
  const anchor = act.previousElementSibling;
  if (anchor instanceof HTMLElement && anchor.classList.contains("act-anchor")) {
    const margin = parseFloat(getComputedStyle(act).marginTop) || 0;
    return anchor.getBoundingClientRect().top + window.scrollY + margin;
  }
  return act.getBoundingClientRect().top + window.scrollY;
}

/** Room kept between a focused control and the viewport edges or a covering act. */
const FOCUS_CLEARANCE = 24;
/**
 * A focus that follows a Tab keypress (with no other key or pointer press in
 * between) is sequential keyboard navigation. Generous, because a busy frame
 * can delay focusin well after the keydown.
 */
const TAB_FOCUS_WINDOW_MS = 1000;

/** Layout offset of `el` inside `act` (offsetTop chain: ignores transforms and sticky offsets). */
function offsetWithin(el: HTMLElement, act: HTMLElement): number {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== act) {
    y += node.offsetTop;
    const parent = node.offsetParent as HTMLElement | null;
    if (!parent || !act.contains(parent)) {
      // The act is the outermost offset parent inside it; reaching outside means
      // the chain skipped it, so measure the rest from the rects instead.
      return el.getBoundingClientRect().top - act.getBoundingClientRect().top;
    }
    node = parent;
  }
  return y;
}

/**
 * The acts as a stack of sheets. Every `.act` directly inside `root` is
 * position: sticky (mission.css) with its top set to `min(0, viewport - act)`,
 * so a tall act scrolls through in full and pins only once its bottom edge
 * meets the bottom of the viewport. The next act then slides up over it.
 *
 * How the covered act leaves is set by its `data-exit`:
 * - "sink" (default): it scales back a touch, a shade darkens it and it fades
 *   out, while the incoming act's `.act__sheet` (its opaque panel) fades away,
 *   so the incoming act settles onto the same page backdrop the covered act
 *   had.
 * - "swirl": it spins and shrinks into the centre of the viewport and fades,
 *   as if pulled through an event horizon (the black hole of Act III).
 * All of it is scrubbed to the incoming act's flow position. Reduced motion
 * keeps the stacking and the fades, without scale or spin.
 *
 * It also publishes an ActFrame every scrolled frame (subscribeActs) and marks
 * acts below ACT_DORMANT_SHARE with `data-dormant`, so CSS animations pause.
 *
 * Scroll positions are measured from each act's flow position (actFlowTop),
 * never from a rect that might be pinned. Tab focus inside an act that the
 * next one slides over is scrolled by flow geometry (see onFocusIn), since the
 * browser's own focus scroll cannot see the sheet on top.
 */
export function useActStack(rootRef: RefObject<HTMLElement | null>, reducedMotion: boolean) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const acts = Array.from(root.querySelectorAll<HTMLElement>(":scope > .act"));
    if (acts.length === 0) return;

    // Flow tops change only with layout (resize, an act growing), never with scroll.
    let flowTops = acts.map(actFlowTop);
    let frameReq = 0;
    const publish = () => {
      frameReq = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const enter = flowTops.map((top, k) => (k === 0 ? 1 : clamp01(1 - (top - y) / vh)));
      const share = enter.map((e, k) => clamp01(e - (enter[k + 1] ?? 0)));
      lastActFrame = { vh, y, enter, share };
      acts.forEach((act, k) => {
        const dormant = share[k] < ACT_DORMANT_SHARE;
        if ((act.dataset.dormant === "true") !== dormant) act.dataset.dormant = String(dormant);
        // A swirling act spins only its on-screen window (mission.css clips it),
        // so a tall open index never sweeps thousands of pixels across the hole.
        if (act.dataset.exit === "swirl") {
          const swirling = (enter[k + 1] ?? 0) > 0;
          if ((act.dataset.swirling === "true") !== swirling)
            act.dataset.swirling = String(swirling);
        }
      });
      actListeners.forEach((listener) => listener(lastActFrame!));
    };
    const schedule = () => {
      if (!frameReq) frameReq = requestAnimationFrame(publish);
    };

    const syncTops = () => {
      const vh = window.innerHeight;
      acts.forEach((act) => {
        act.style.setProperty("--act-top", `${Math.min(0, vh - act.offsetHeight)}px`);
      });
      flowTops = acts.map(actFlowTop);
      schedule();
    };
    syncTops();
    window.addEventListener("scroll", schedule, { passive: true });
    // Acts change height as the index opens, filters, or a project stage opens.
    const observer = new ResizeObserver(syncTops);
    acts.forEach((act) => observer.observe(act));
    window.addEventListener("resize", syncTops);

    // Keyboard focus inside an act that another act slides over. The browser's
    // own focus scroll assumes the control moves with the page, but a pinned
    // act stops moving, so it overshoots and the next act ends up covering the
    // control. For Tab navigation, work out from flow positions the scroll range
    // where the control is fully in view and uncovered, and clamp to it in the
    // next frame (an instant scroll, which also cancels the browser's smooth one).
    let lastTabAt = -Infinity;
    let focusFrame = 0;
    const onKeyDown = (event: KeyboardEvent) => {
      lastTabAt = event.key === "Tab" ? performance.now() : -Infinity;
    };
    const onPointerDown = () => {
      lastTabAt = -Infinity;
    };
    const onFocusIn = (event: FocusEvent) => {
      if (performance.now() - lastTabAt > TAB_FOCUS_WINDOW_MS) return;
      lastTabAt = -Infinity;
      const el = event.target;
      if (!(el instanceof HTMLElement)) return;
      const i = acts.findIndex((act) => act !== el && act.contains(el));
      const act = acts[i];
      const incoming = acts[i + 1];
      if (!act || !incoming) return;
      const startY = window.scrollY;
      cancelAnimationFrame(focusFrame);
      // Measured a frame later: focusing the search field opens the index first.
      focusFrame = requestAnimationFrame(() => {
        if (!el.isConnected || document.activeElement !== el) return;
        const vh = window.innerHeight;
        const top = actFlowTop(act) + offsetWithin(el, act);
        const bottom = top + el.offsetHeight;
        // The index asks for room above its sand line while the laser is in use.
        const sandFraction = parseFloat(act.dataset.focusClearance ?? "");
        let clearBottom = Number.isFinite(sandFraction)
          ? sandFraction * vh + FOCUS_CLEARANCE
          : FOCUS_CLEARANCE;
        // On narrow screens the fixed scroll widget rides at the bottom edge.
        const widget = document.querySelector<HTMLElement>(".scroll-widget");
        const widgetTop = widget?.getBoundingClientRect().top ?? vh;
        if (widgetTop > vh / 2) clearBottom = Math.max(clearBottom, vh - widgetTop + 12);
        // Past pinY the act stops moving and the next one covers it, so stay at or
        // before it. At pinY the index is fully printed and clear of the beam.
        const pinY = actFlowTop(incoming) - vh;
        const maxY = Math.min(top - FOCUS_CLEARANCE, pinY);
        const minY = Math.min(bottom + clearBottom - vh, pinY);
        const target = minY > maxY ? maxY : Math.min(Math.max(startY, minY), maxY);
        window.scrollTo({ top: Math.max(0, target), behavior: "instant" });
      });
    };
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    root.addEventListener("focusin", onFocusIn);

    const ctx = gsap.context(() => {
      acts.slice(0, -1).forEach((act, i) => {
        const incoming = acts[i + 1];
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            // From the incoming act's top meeting the viewport bottom to it
            // reaching the viewport top, measured in the flow.
            start: () => actFlowTop(incoming) - window.innerHeight,
            end: () => actFlowTop(incoming),
            invalidateOnRefresh: true,
            scrub: reducedMotion ? true : 0.35,
          },
        });
        if (act.dataset.exit === "swirl") {
          // Pulled into the black hole: it shrinks early (about half size a
          // quarter of the way in), then the spin quickens as it falls in.
          if (!reducedMotion) {
            tl.fromTo(act, { scale: 1 }, { scale: 0.02, ease: "power2.out", duration: 1 }, 0);
            tl.fromTo(act, { rotate: 0 }, { rotate: 540, ease: "power3.in", duration: 1 }, 0);
          }
          tl.fromTo(act, { opacity: 1 }, { opacity: 0, duration: 0.4 }, 0.55);
        } else {
          const shade = act.querySelector<HTMLElement>(":scope > .act__shade");
          if (!reducedMotion) {
            tl.fromTo(act, { scale: 1 }, { scale: 0.94, duration: 1 }, 0);
            if (shade) tl.fromTo(shade, { opacity: 0 }, { opacity: 0.7, duration: 1 }, 0);
          }
          // Gone by the time the incoming act is nine tenths in (dormant there).
          tl.fromTo(act, { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0.6);
        }
        // The incoming panel dissolves into the page backdrop as it lands.
        const sheet = incoming.querySelector<HTMLElement>(":scope > .act__sheet");
        if (sheet) tl.fromTo(sheet, { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0.7);
      });
    }, root);

    // The page reaches its full height only once the acts mount; re-measure every
    // trigger (the footer's reveal in Layout included) against the real layout.
    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshFrame);
      cancelAnimationFrame(focusFrame);
      cancelAnimationFrame(frameReq);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
      observer.disconnect();
      window.removeEventListener("resize", syncTops);
      root.removeEventListener("focusin", onFocusIn);
      ctx.revert();
      acts.forEach((act) => {
        act.style.removeProperty("--act-top");
        delete act.dataset.dormant;
        delete act.dataset.swirling;
      });
    };
  }, [rootRef, reducedMotion]);
}
