import React, { useLayoutEffect, useRef, type ReactNode } from "react";
import { Globe } from "lucide-react";
import { GithubIcon } from "./Icon";
import Liquid from "./canvasui/Liquid";
import { LIQUID_SPEC } from "./canvasui/spec";
import RouteCover from "./RouteCover";
import { gsap } from "../lib/gsap";
import { DUR, EASE } from "../lib/motion";
import { useMediaQuery, useReducedMotion } from "../lib/useReducedMotion";

interface LayoutProps {
  children: ReactNode;
}

const CURRENT_YEAR = new Date().getFullYear();

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const footerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const enableFluidCursor = finePointer && !reducedMotion;

  // The footer settles in as it enters the viewport. gsap.from in a layout
  // effect hides it before first paint, so it never flashes.
  useLayoutEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from(footerEl, {
        opacity: 0,
        y: 12,
        duration: DUR.reveal,
        ease: EASE.out,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: footerEl, start: "top bottom-=8" },
      });
    }, footerEl);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div className="portfolio-app-root min-h-screen flex flex-col justify-between relative">
      {/* Orbital Telemetry Backdrop */}
      <div className="animated-background" aria-hidden="true" />
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* Cursor fluid (upgrades.md: "apply this to the cursor"), drawn over the live page */}
      {enableFluidCursor && (
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[30]">
          <Liquid className="w-full h-full" native={false} {...LIQUID_SPEC}>
            <div className="w-full h-full" />
          </Liquid>
        </div>
      )}

      <RouteCover />

      {/* Main Viewport Container */}
      <main className="max-w-[1320px] mx-auto w-full grow flex flex-col items-center py-6 px-4 md:px-6 relative z-10">
        {children}
      </main>

      {/* Footer HUD */}
      <footer ref={footerRef} className="footer-hud w-full py-4 mt-8 relative z-20">
        <div className="max-w-[1320px] mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-muted)] font-telemetry">
              &copy; {CURRENT_YEAR} Jorge Alberto Bucio // @ZynzTehr
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ZynzTehr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] link-hover text-sm flex items-center gap-1.5"
            >
              <GithubIcon size={14} />
              <span>GitHub</span>
            </a>
            <span className="text-[var(--border-subtle)]">/</span>
            <a
              href="https://jorgebucio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] link-hover text-sm flex items-center gap-1.5"
            >
              <Globe size={14} />
              <span>Profile</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
