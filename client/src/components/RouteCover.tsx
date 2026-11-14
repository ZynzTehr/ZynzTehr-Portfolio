import React, { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import BrandMark from "./BrandMark";
import { DUR, EASE } from "../lib/motion";
import { coverRuntime, getCoverState, setCoverState, subscribeCover } from "../lib/routeCover";

/**
 * The route cover: the hex-orbit mark carrying the visitor from the prologue to
 * the orbit. States: idle -> covering (a sapphire field opens from the launch
 * point while the mark scales in) -> covered (the route changes underneath) ->
 * docking (the mark flies into the HUD hex button and the field dissolves) ->
 * idle. A failsafe clears the cover if no page asks to dock it, so a failed or
 * interrupted navigation never strands the visitor behind it.
 */

/** The hex button draws its logo at 0.8 of its width (HexPixelButton). */
const GLYPH_SCALE = 0.8;
/** When the flying mark starts to dissolve, and how long it takes (s). */
const DOCK_FADE_AT_S = 0.05;
const DOCK_FADE_S = 0.25;

const RouteCover: React.FC = () => {
  const snapshot = useSyncExternalStore(subscribeCover, getCoverState, getCoverState);
  const fieldRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const failsafeRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const field = fieldRef.current;
    const mark = markRef.current;
    if (!field || !mark) return;
    const { phase, origin } = snapshot;

    if (phase === "covering") {
      const at = `${origin.x}px ${origin.y}px`;
      gsap.set(field, { opacity: 1, clipPath: `circle(0% at ${at})` });
      gsap.set(mark, { opacity: 0, scale: 0.35, rotate: -30, x: 0, y: 0 });
      const tl = gsap.timeline({
        onComplete: () => {
          setCoverState({ phase: coverRuntime.dockTarget ? "docking" : "covered" });
          coverRuntime.coveredResolve?.();
          coverRuntime.coveredResolve = null;
        },
      });
      tl.to(
        field,
        { clipPath: `circle(150% at ${at})`, duration: DUR.reveal, ease: EASE.inOut },
        0,
      );
      tl.to(mark, { opacity: 1, scale: 1, rotate: 0, duration: DUR.reveal, ease: EASE.out }, 0.12);
      return () => {
        tl.kill();
      };
    }

    if (phase === "covered") {
      let fade: gsap.core.Tween | null = null;
      failsafeRef.current = window.setTimeout(() => {
        if (getCoverState().phase !== "covered") return;
        fade = gsap.to([field, mark], {
          opacity: 0,
          duration: DUR.ui,
          ease: EASE.inOut,
          // A dock that arrives during the fade wins; only a still-covered state resets.
          onComplete: () => {
            if (getCoverState().phase === "covered") setCoverState({ phase: "idle" });
          },
        });
      }, 1600);
      return () => {
        if (failsafeRef.current) window.clearTimeout(failsafeRef.current);
        fade?.kill();
      };
    }

    if (phase === "docking") {
      // A late dock may arrive mid-failsafe fade: start from a fully visible mark.
      gsap.set(mark, { opacity: 1 });
      const target = coverRuntime.dockTarget?.() ?? null;
      const from = mark.getBoundingClientRect();
      const tl = gsap.timeline({
        onComplete: () => {
          setCoverState({ phase: "idle" });
          coverRuntime.dockTarget = null;
          const cb = coverRuntime.onDocked;
          coverRuntime.onDocked = null;
          cb?.();
        },
      });
      if (target && from.width > 0) {
        // The hex button is still settling (the HUD panel slides in), so the
        // flight re-reads it every frame. It aims at the button's own logo,
        // which is centred and drawn at GLYPH_SCALE of the button's width.
        const fromX = from.left + from.width / 2;
        const fromY = from.top + from.height / 2;
        const flight = { p: 0 };
        tl.to(
          flight,
          {
            p: 1,
            duration: DUR.hero,
            ease: EASE.out,
            onUpdate: () => {
              const t = coverRuntime.dockTarget?.() ?? target;
              const s = (t.width * GLYPH_SCALE) / from.width;
              gsap.set(mark, {
                x: (t.left + t.width / 2 - fromX) * flight.p,
                y: (t.top + t.height / 2 - fromY) * flight.p,
                scale: 1 + (s - 1) * flight.p,
              });
            },
          },
          0,
        );
        // The mark dissolves on the way in, gone before it reaches the
        // banner, while the button's own logo fades up in its place
        // (.hex-btn-wrap.is-docking in mission.css). Two logos never overlap.
        tl.to(mark, { opacity: 0, duration: DOCK_FADE_S, ease: "power1.in" }, DOCK_FADE_AT_S);
      } else {
        tl.to(mark, { opacity: 0, scale: 0.8, duration: DUR.ui, ease: EASE.in }, 0);
      }
      tl.to(field, { opacity: 0, duration: DUR.reveal, ease: EASE.inOut }, 0.08);
      return () => {
        tl.kill();
      };
    }

    if (phase === "idle") {
      gsap.set([field, mark], { clearProps: "all" });
    }
    return undefined;
  }, [snapshot]);

  useEffect(
    () => () => {
      if (failsafeRef.current) window.clearTimeout(failsafeRef.current);
    },
    [],
  );

  const active = snapshot.phase !== "idle";
  return (
    <div className={`route-cover ${active ? "is-active" : ""}`} aria-hidden="true">
      <div ref={fieldRef} className="route-cover__field" />
      <div className="route-cover__center">
        <div ref={markRef} className="route-cover__mark">
          <BrandMark size={132} />
        </div>
      </div>
    </div>
  );
};

export default RouteCover;
