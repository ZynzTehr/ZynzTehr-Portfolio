import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Globe, Code2 } from "lucide-react";
import { GithubIcon } from "./Icon";
import HexPixelButton from "./fx/HexPixelButton";
import PixelButton from "./fx/PixelButton";
import PageLoadSweep from "./canvasui/PageLoadSweep";
import { dockCover } from "../lib/routeCover";
import { gsap } from "../lib/gsap";
import { DUR, EASE } from "../lib/motion";
import { prefersReducedMotion } from "../lib/useReducedMotion";

interface DevHudProps {
  projectCount: number;
}

/**
 * Act I opens here. When the visitor arrives through Launch, the route cover's
 * mark flies into the hex button (the dock) and its edge draws in. The identity
 * text gets the page-load AsciiSweep, and the repository counter runs only once
 * that sweep has landed, so it is never counting out of sight.
 */
const DevHud: React.FC<DevHudProps> = ({ projectCount }) => {
  const hudRef = useRef<HTMLElement>(null);
  const hexRef = useRef<HTMLSpanElement>(null);
  const dockedRef = useRef<boolean | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(() =>
    prefersReducedMotion() ? projectCount : 0,
  );

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const hexWrap = hexRef.current?.querySelector(".hex-btn-wrap");
    // Dock once per mount (StrictMode re-runs this effect on the same node).
    if (dockedRef.current === null) {
      dockedRef.current = dockCover(
        () => hexRef.current?.getBoundingClientRect() ?? null,
        () => window.setTimeout(() => hexWrap?.classList.remove("is-docking"), 1000),
      );
      // The edge draws itself in as the mark arrives.
      if (dockedRef.current) hexWrap?.classList.add("is-docking");
    }
    const docked = dockedRef.current;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".dev-hud__panel", {
        y: -18,
        duration: DUR.hero,
        ease: EASE.out,
        clearProps: "transform",
      });
      gsap.from(".hud-nav-pill", {
        y: -10,
        opacity: 0,
        duration: DUR.reveal,
        stagger: 0.08,
        delay: docked ? 0.45 : 0.18,
        ease: EASE.out,
        clearProps: "transform,opacity",
      });
      if (!docked) {
        gsap.from(hexRef.current, {
          scale: 0.6,
          opacity: 0,
          rotate: -30,
          duration: DUR.hero,
          ease: EASE.out,
          clearProps: "transform,opacity",
        });
      }
    }, hudRef);
    return () => ctx.revert();
  }, []);

  const runCounter = useCallback(() => {
    if (prefersReducedMotion()) {
      setDisplayCount(projectCount);
      return;
    }
    const counter = { val: 0 };
    gsap.to(counter, {
      val: projectCount,
      duration: DUR.hero,
      ease: "power2.out",
      onUpdate: () => setDisplayCount(Math.round(counter.val)),
    });
  }, [projectCount]);

  return (
    <header ref={hudRef} className="dev-hud w-full mb-4">
      <div className="dev-hud__panel glass-card mb-2 p-4 md:p-6 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span ref={hexRef} className="inline-flex">
              <HexPixelButton size={66} />
            </span>
            <PageLoadSweep background="#0a1124" onComplete={runCounter}>
              <div className="text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-1">
                  <h1 className="text-2xl md:text-[1.85rem] font-bold leading-tight m-0 text-gradient font-display">
                    Jorge Bucio
                  </h1>
                  <span className="badge-status-pulse">
                    <span className="status-dot" />
                    Available
                  </span>
                </div>
                <p className="m-0 text-[var(--text-secondary)] text-sm flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <Code2
                    size={15}
                    className="text-accent hidden md:inline-block"
                    aria-hidden="true"
                  />
                  <span className="text-balance">Full-stack and creative systems engineer</span>
                  <span className="text-[var(--text-muted)] hidden md:inline" aria-hidden="true">
                    /
                  </span>
                  <span className="text-accent font-telemetry font-medium tabular-nums basis-full md:basis-auto">
                    {displayCount} repositories
                  </span>
                </p>
                <p className="hidden sm:block m-0 mt-1.5 text-xs text-[var(--text-muted)] max-w-[540px]">
                  Interactive web applications, WebGL shaders and production software, each built
                  from a blank file.
                </p>
              </div>
            </PageLoadSweep>
          </div>

          <nav aria-label="Elsewhere" className="flex gap-2.5 shrink-0">
            <PixelButton
              as="a"
              href="https://github.com/ZynzTehr"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
              wrapperClassName="hud-nav-pill"
              title="GitHub profile (opens in a new tab)"
            >
              <GithubIcon size={16} />
              <span className="font-telemetry">@ZynzTehr</span>
            </PixelButton>
            <PixelButton
              as="a"
              href="https://jorgebucio.com/"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
              wrapperClassName="hud-nav-pill"
              title="Interactive profile at jorgebucio.com (opens in a new tab)"
            >
              <Globe size={16} aria-hidden="true" />
              <span>Profile hub</span>
            </PixelButton>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DevHud;
