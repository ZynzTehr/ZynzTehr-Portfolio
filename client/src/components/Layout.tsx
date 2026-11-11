import React, { type ReactNode } from "react";
import { Globe } from "lucide-react";
import { GithubIcon } from "./Icon";

interface LayoutProps {
  children: ReactNode;
}

const CURRENT_YEAR = new Date().getFullYear();

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="portfolio-app-root min-h-screen flex flex-col justify-between">
      {/* Animated Deep Space Background */}
      <div className="animated-background"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Main Viewport Container */}
      <main className="max-w-[1320px] mx-auto w-full grow flex flex-col items-center py-6 px-4 md:px-6">
        {children}
      </main>

      {/* Modern High-Tech Glass Footer */}
      <footer className="footer-hud w-full py-4 mt-12">
        <div className="max-w-[1320px] mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400 font-mono">
              &copy; {CURRENT_YEAR} Jorge Alberto Bucio // @ZynzTehr
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ZynzTehr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 link-hover text-sm flex items-center gap-1"
            >
              <GithubIcon size={14} />
              <span>GitHub</span>
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://jorgebucio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 link-hover text-sm flex items-center gap-1"
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
