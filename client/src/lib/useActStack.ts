import { useLayoutEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "./gsap";

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
 * While an act is being covered it sinks back: the sheet scales down a touch
 * and its shade darkens, both scrubbed to the scroll position of the act
 * coming over it. Reduced motion keeps the stacking (it is plain scrolling)
 * and drops the scale and shade.
 *
 * Scroll positions are measured from each act's flow position (actFlowTop),
 * never from a rect that might be pinned. Keyboard focus that lands inside an
 * act the next one is covering scrolls back until the control is uncovered,
 * since the browser's own focus scrolling cannot see the sheet on top.
 */
export function useActStack(rootRef: RefObject<HTMLElement | null>, reducedMotion: boolean) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const acts = Array.from(root.querySelectorAll<HTMLElement>(":scope > .act"));
    if (acts.length === 0) return;

    const syncTops = () => {
      const vh = window.innerHeight;
      acts.forEach((act) => {
        act.style.setProperty("--act-top", `${Math.min(0, vh - act.offsetHeight)}px`);
      });
    };
    syncTops();
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

    const ctx = reducedMotion
      ? null
      : gsap.context(() => {
          acts.slice(0, -1).forEach((act, i) => {
            const incoming = acts[i + 1];
            const shade = act.querySelector<HTMLElement>(":scope > .act__shade");
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                // From the incoming act's top meeting the viewport bottom to it
                // reaching the viewport top, measured in the flow.
                start: () => actFlowTop(incoming) - window.innerHeight,
                end: () => actFlowTop(incoming),
                invalidateOnRefresh: true,
                scrub: 0.35,
              },
            });
            tl.fromTo(act, { scale: 1 }, { scale: 0.94 }, 0);
            if (shade) tl.fromTo(shade, { opacity: 0 }, { opacity: 0.7 }, 0);
          });
        }, root);

    // The page reaches its full height only once the acts mount; re-measure every
    // trigger (the footer's reveal in Layout included) against the real layout.
    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshFrame);
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
      observer.disconnect();
      window.removeEventListener("resize", syncTops);
      root.removeEventListener("focusin", onFocusIn);
      ctx?.revert();
      acts.forEach((act) => act.style.removeProperty("--act-top"));
    };
  }, [rootRef, reducedMotion]);
}
