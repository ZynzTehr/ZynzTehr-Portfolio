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
 * Run `fn` once the acts have settled after a layout change: right after the
 * ScrollTrigger refresh an act resize causes (useActStack refreshes from its
 * ResizeObserver), or two frames on if no act resized. A smooth scroll must
 * start after that refresh, because a refresh puts the scroll position back
 * where it was and so cancels a smooth scroll already under way.
 */
export function afterActsSettle(fn: () => void): () => void {
  let done = false;
  let frame = 0;
  const run = () => {
    if (done) return;
    done = true;
    ScrollTrigger.removeEventListener("refresh", run);
    cancelAnimationFrame(frame);
    fn();
  };
  ScrollTrigger.addEventListener("refresh", run);
  frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(run);
  });
  return () => {
    done = true;
    ScrollTrigger.removeEventListener("refresh", run);
    cancelAnimationFrame(frame);
  };
}

/** Act exits are Web Animations this long, only ever seeked (time = progress x this). */
const EXIT_MS = 1000;

/**
 * Keyframes that follow a GSAP ease, so a linear Web Animation traces the same
 * curve the old tween did (two eases on one element need two animations).
 */
function easedKeyframes(ease: string, frame: (v: number) => Keyframe, steps = 48): Keyframe[] {
  const curve = gsap.parseEase(ease);
  return Array.from({ length: steps + 1 }, (_, i) => ({
    ...frame(curve(i / steps)),
    offset: i / steps,
  }));
}

/** Opacity that holds at `from` until `start`, then runs linearly to `to` by `end`. */
function fadeKeyframes(from: number, to: number, start: number, end: number): Keyframe[] {
  return [
    { opacity: from, offset: 0 },
    { opacity: from, offset: start },
    { opacity: to, offset: end },
    { opacity: to, offset: 1 },
  ];
}

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
 * acts below ACT_DORMANT_SHARE with `data-dormant`, pausing their CSS loops.
 *
 * Nothing here writes inline styles per frame. An inline style write restyles
 * the written element's whole subtree in browsers whose ad blocker injects its
 * cosmetic stylesheet (thousands of selectors, some keyed on [style]); on an
 * act that is ~1,800 elements, 30-70 ms a write. So the exits are paused Web
 * Animations seeked to the scrubbed progress, --act-top is held by an
 * animation, and dormancy pauses the CSS loops through the animations API.
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
    // CSS loops held while each act is dormant. Plain Web Animations (the
    // orbit, the exits) are left alone: they are paused and seeked by design.
    const heldLoops: CSSAnimation[][] = acts.map(() => []);
    // Only a loop CSS still owns is resumed. One whose rule stopped matching
    // while it was held (a blurred caret, reduced motion turned on) is
    // cancelled by CSS ('idle'); playing it would revive it as a script loop.
    const resumeHeld = (a: CSSAnimation) => {
      if (
        a.playState === "paused" &&
        a.effect instanceof KeyframeEffect &&
        a.effect.target?.isConnected
      )
        a.play();
    };
    const setDormant = (k: number, dormant: boolean) => {
      const act = acts[k];
      act.dataset.dormant = String(dormant);
      if (dormant) {
        heldLoops[k] = act.getAnimations({ subtree: true }).filter(
          (a): a is CSSAnimation =>
            a instanceof CSSAnimation &&
            a.playState === "running" &&
            // An engaged tile's border beam follows CSS play-state (hover,
            // paused orbit), which an API pause/play would cut it loose from.
            !(a.effect instanceof KeyframeEffect && a.effect.target?.matches(".project-tile-3d")),
        );
        heldLoops[k].forEach((a) => a.pause());
      } else {
        heldLoops[k].forEach(resumeHeld);
        heldLoops[k] = [];
      }
    };
    const publish = () => {
      frameReq = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const enter = flowTops.map((top, k) => (k === 0 ? 1 : clamp01(1 - (top - y) / vh)));
      const share = enter.map((e, k) => clamp01(e - (enter[k + 1] ?? 0)));
      lastActFrame = { vh, y, enter, share };
      acts.forEach((act, k) => {
        const dormant = share[k] < ACT_DORMANT_SHARE;
        if ((act.dataset.dormant === "true") !== dormant) setDormant(k, dormant);
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

    // --act-top (registered, non-inheriting) is held by an animation per act,
    // updated only when it changes: all reads first, then the writes.
    const topHolds = acts.map((act) =>
      act.animate([{ "--act-top": "0px" }], { duration: 0, fill: "forwards" }),
    );
    const topValues = acts.map(() => "");
    // An act that changes height (the index opening, filtering, a project
    // stage) moves every trigger below it, so ScrollTrigger re-measures then,
    // and only then: a refresh is the costliest thing on the page.
    let heights = acts.map((act) => act.offsetHeight);
    const syncTops = () => {
      const vh = window.innerHeight;
      const next = acts.map((act) => act.offsetHeight);
      const resized = next.some((h, k) => h !== heights[k]);
      heights = next;
      next.forEach((h, k) => {
        const top = `${Math.min(0, vh - h)}px`;
        if (top === topValues[k]) return;
        topValues[k] = top;
        (topHolds[k].effect as KeyframeEffect).setKeyframes([{ "--act-top": top }]);
      });
      flowTops = acts.map(actFlowTop);
      if (resized) ScrollTrigger.refresh();
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

    const exitAnims: Animation[] = [];
    const ctx = gsap.context(() => {
      acts.slice(0, -1).forEach((act, i) => {
        const incoming = acts[i + 1];
        const timing: KeyframeAnimationOptions = {
          duration: EXIT_MS,
          fill: "both",
          easing: "linear",
        };
        const anims: Animation[] = [];
        if (act.dataset.exit === "swirl") {
          // Pulled into the black hole: it shrinks early (about half size a
          // quarter of the way in), then the spin quickens as it falls in.
          if (!reducedMotion) {
            anims.push(
              act.animate(
                easedKeyframes("power2.out", (v) => ({ scale: String(1 - 0.98 * v) })),
                timing,
              ),
              act.animate(
                easedKeyframes("power3.in", (v) => ({ rotate: `${540 * v}deg` })),
                timing,
              ),
            );
          }
          anims.push(act.animate(fadeKeyframes(1, 0, 0.55, 0.95), timing));
        } else {
          const shade = act.querySelector<HTMLElement>(":scope > .act__shade");
          if (!reducedMotion) {
            anims.push(act.animate([{ scale: "1" }, { scale: "0.94" }], timing));
            if (shade) anims.push(shade.animate([{ opacity: 0 }, { opacity: 0.7 }], timing));
          }
          // Gone by the time the incoming act is nine tenths in (dormant there).
          anims.push(act.animate(fadeKeyframes(1, 0, 0.6, 0.9), timing));
        }
        // The incoming panel dissolves into the page backdrop as it lands.
        const sheet = incoming.querySelector<HTMLElement>(":scope > .act__sheet");
        if (sheet) anims.push(sheet.animate(fadeKeyframes(1, 0, 0.7, 1), timing));
        anims.forEach((a) => a.pause());
        exitAnims.push(...anims);

        // The scroll drives a plain number; the animations follow it.
        const exit = { progress: 0 };
        const seek = () => {
          const time = exit.progress * EXIT_MS;
          for (const a of anims) a.currentTime = time;
        };
        seek();
        gsap.to(exit, {
          progress: 1,
          ease: "none",
          onUpdate: seek,
          scrollTrigger: {
            // From the incoming act's top meeting the viewport bottom to it
            // reaching the viewport top, measured in the flow.
            start: () => actFlowTop(incoming) - window.innerHeight,
            end: () => actFlowTop(incoming),
            // start/end are re-read on every refresh anyway, and the tween only
            // moves a number from 0 to 1, so there is nothing to re-record.
            invalidateOnRefresh: false,
            scrub: reducedMotion ? true : 0.35,
            // A refresh can move the trigger under a still page (a filter
            // shrinks Act II right after a jump); with no scroll the scrub
            // never catches up, so jump the exit to where the page now is.
            onRefresh: (self) => {
              self.animation?.progress(self.progress);
            },
          },
        });
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
      exitAnims.forEach((a) => a.cancel());
      topHolds.forEach((a) => a.cancel());
      acts.forEach((act, k) => {
        heldLoops[k].forEach(resumeHeld);
        delete act.dataset.dormant;
        delete act.dataset.swirling;
      });
    };
  }, [rootRef, reducedMotion]);
}
