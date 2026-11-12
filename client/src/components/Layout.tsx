import React, { useState, type ReactNode } from "react";
import { Globe } from "lucide-react";
import { GithubIcon } from "./Icon";
import Liquid from "./canvasui/Liquid";

interface LayoutProps {
  children: ReactNode;
}

const CURRENT_YEAR = new Date().getFullYear();

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [enableFluidCursor] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  });

  return (
    <div className="portfolio-app-root min-h-screen flex flex-col justify-between relative">
      {/* Orbital Telemetry Backdrop */}
      <div className="animated-background" aria-hidden="true" />
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* Viewport-Bounded Navier-Stokes Fluid Cursor Layer */}
      {enableFluidCursor && (
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[2] opacity-75">
          <Liquid
            className="w-full h-full"
            color={[0.2588, 0.3569, 1]}
            intensity={0.72}
            blend={2.6}
            radius={0.15}
            densityDissipation={0.948}
            velocityDissipation={0.975}
            curl={1.9}
          >
            <div className="w-full h-full" />
          </Liquid>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="max-w-[1320px] mx-auto w-full grow flex flex-col items-center py-6 px-4 md:px-6 relative z-10">
        {children}
      </main>

      {/* Footer HUD */}
      <footer className="footer-hud w-full py-4 mt-12 relative z-20">
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
