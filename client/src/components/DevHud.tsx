import React from "react";
import { Globe, Code2 } from "lucide-react";
import { GithubIcon } from "./Icon";
import HexAvatar from "./HexAvatar";

interface DevHudProps {
  projectCount: number;
}

const DevHud: React.FC<DevHudProps> = ({ projectCount }) => {
  return (
    <header className="dev-hud w-full mb-6">
      {/* Top Profile Strip */}
      <div className="glass-card mb-4 p-4 md:p-6 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Identity & Status */}
          <div className="flex items-center gap-4">
            <HexAvatar />
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-2xl md:text-[1.75rem] font-semibold leading-tight m-0 text-gradient font-orbitron">
                  Jorge Bucio
                </h1>
                <span className="badge-status-pulse">
                  <span className="status-dot"></span>
                  Available
                </span>
              </div>
              <p className="m-0 text-slate-400 text-sm flex items-center justify-center md:justify-start gap-2">
                <Code2 size={15} className="text-accent" />
                <span>Full-Stack & Web3 Developer</span>
                <span>•</span>
                <span className="text-accent font-orbitron">{projectCount} Projects</span>
              </p>
            </div>
          </div>

          {/* Quick External Links */}
          <div className="flex gap-2">
            <a
              href="https://github.com/ZynzTehr"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hud-action"
              title="GitHub Profile"
            >
              <GithubIcon size={16} />
              <span>@ZynzTehr</span>
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default DevHud;
