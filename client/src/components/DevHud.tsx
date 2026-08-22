import React from 'react';
import { Globe, Code2 } from 'lucide-react';
import { GithubIcon } from './Icon';

interface DevHudProps {
  projectCount: number;
}

const DevHud: React.FC<DevHudProps> = ({ projectCount }) => {
  return (
    <header className="dev-hud w-100 mb-4">
      {/* Top Profile Strip */}
      <div className="glass-card mb-3 p-3 p-md-4 w-100">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          
          {/* Identity & Status */}
          <div className="text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <h1 className="h3 m-0 text-gradient font-orbitron">
                Jorge Bucio
              </h1>
              <span className="badge-status-pulse">
                <span className="status-dot"></span>
                Available
              </span>
            </div>
            <p className="m-0 text-secondary small d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <Code2 size={15} className="text-accent" />
              <span>Full-Stack & Web3 Developer</span>
              <span>•</span>
              <span className="text-accent font-orbitron">{projectCount} Projects</span>
            </p>
          </div>

          {/* Quick External Links */}
          <div className="d-flex gap-2">
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
              href="https://zynz-tehr-profile.vercel.app"
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
