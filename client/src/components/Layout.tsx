import React, { type ReactNode } from 'react';
import { Globe } from 'lucide-react';
import { GithubIcon } from './Icon';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="portfolio-app-root min-vh-100 d-flex flex-column justify-content-between">
      {/* Animated Deep Space Background */}
      <div className="animated-background"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Main Viewport Container */}
      <main className="container-xl w-100 flex-grow-1 d-flex flex-column align-items-center py-4 px-3 px-md-4">
        {children}
      </main>

      {/* Modern High-Tech Glass Footer */}
      <footer className="footer-hud w-100 py-3 mt-5">
        <div className="container-xl d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 text-center text-sm-start">
          <div className="d-flex align-items-center gap-2">
            <span className="small text-secondary font-monospace">
              &copy; {new Date().getFullYear()} Jorge Alberto Bucio // @ZynzTehr
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <a
              href="https://github.com/ZynzTehr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary link-hover small d-flex align-items-center gap-1"
            >
              <GithubIcon size={14} />
              <span>GitHub</span>
            </a>
            <span className="text-muted">•</span>
            <a
              href="https://zynztehr.github.io/ZynzTehr-Profile/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary link-hover small d-flex align-items-center gap-1"
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
