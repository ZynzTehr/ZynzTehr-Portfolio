import React from "react";
import { Globe, Code2 } from "lucide-react";
import { GithubIcon } from "./Icon";
import HexAvatar from "./HexAvatar";
import PageLoadSweep from "./canvasui/PageLoadSweep";

interface DevHudProps {
  projectCount: number;
}

const DevHud: React.FC<DevHudProps> = ({ projectCount }) => {
  return (
    <header className="dev-hud w-full mb-5">
      <div className="glass-card mb-2 p-4 md:p-6 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <HexAvatar />
            <PageLoadSweep angle={0} duration={0.9} color="#60a5fa" background="#0a1124">
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
                  <Code2 size={15} className="text-accent" />
                  <span>Full-Stack &amp; Creative Systems Engineer</span>
                  <span className="text-[var(--text-muted)]">/</span>
                  <span className="text-accent font-telemetry font-medium">
                    {projectCount} Repositories
                  </span>
                </p>
              </div>
            </PageLoadSweep>
          </div>

          <nav aria-label="External developer links" className="flex gap-2.5">
            <a
              href="https://github.com/ZynzTehr"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hud-action"
              title="GitHub Profile"
            >
              <GithubIcon size={16} />
              <span className="font-telemetry text-xs md:text-sm">@ZynzTehr</span>
            </a>
            <a
              href="https://jorgebucio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hud-action"
              title="Interactive Profile Switcher"
            >
              <Globe size={16} />
              <span>Profile Hub</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DevHud;
