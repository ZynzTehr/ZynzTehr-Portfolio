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
      failsafeRef.current = window.setTimeout(() => {
        if (getCoverState().phase !== "covered") return;
        gsap.to([field, mark], {
          opacity: 0,
          duration: DUR.ui,
          ease: EASE.inOut,
          onComplete: () => setCoverState({ phase: "idle" }),
        });
      }, 1600);
      return () => {
        if (failsafeRef.current) window.clearTimeout(failsafeRef.current);
      };
    }

    if (phase === "docking") {
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
        const dx = target.left + target.width / 2 - (from.left + from.width / 2);
        const dy = target.top + target.height / 2 - (from.top + from.height / 2);
        const s = target.height / from.height;
        tl.to(mark, { x: dx, y: dy, scale: s, duration: DUR.hero, ease: EASE.out }, 0);
        tl.to(mark, { opacity: 0, duration: DUR.micro, ease: "none" }, DUR.hero - DUR.micro);
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
