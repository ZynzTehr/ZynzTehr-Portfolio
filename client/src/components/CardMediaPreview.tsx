import React, { useEffect, useRef, useState } from "react";
import { Film } from "lucide-react";
import type { Project } from "../data/projects";
import ProjectArt from "./project-arts/ProjectArt";
import DecryptReveal from "./canvasui/DecryptReveal";

interface CardMediaPreviewProps {
  project: Project;
  isActive: boolean;
  enableShader?: boolean;
  compact?: boolean;
}

const CardMediaPreview: React.FC<CardMediaPreviewProps> = ({
  project,
  isActive,
  enableShader = isActive,
  compact = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canUseShader] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  });
  const [reducedMotion] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive && !reducedMotion) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay suppressed; poster and snapshot remain visible
        });
      }
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive, reducedMotion]);

  const mediaNodes = (
    <div className="relative w-full h-full">
      <img
        src={project.previewImage}
        alt={`${project.name} interface preview`}
        crossOrigin="anonymous"
        loading="lazy"
        decoding="async"
        className="card-snapshot-img"
      />
      {project.videoUrl && isActive && !reducedMotion && (
        <video
          ref={videoRef}
          src={project.videoUrl}
          poster={project.previewImage}
          crossOrigin="anonymous"
          muted
          loop
          playsInline
          preload="metadata"
          className="card-snapshot-video absolute inset-0"
        />
      )}
    </div>
  );

  return (
    <div className={`card-media-surface ${isActive ? "is-revealed" : ""}`}>
      <div className="card-svg-resting">
        <ProjectArt
          projectId={project.id}
          projectName={project.name}
          previewImage={project.previewImage}
          mediaUrl={project.mediaUrl}
        />
      </div>

      <div className="card-snapshot-reveal">
        {isActive && enableShader && canUseShader ? (
          <DecryptReveal
            className="w-full h-full"
            radius={compact ? 115 : 195}
            softness={0.55}
            cell={compact ? 7 : 8}
            color="#60a5fa"
            background="#060b19"
            edgeGlow={1.8}
            edgeTint={0.8}
            aberration={6}
            passthrough={0.42}
            scramble={0.12}
            scrambleSpeed={7}
          >
            {mediaNodes}
          </DecryptReveal>
        ) : (
          mediaNodes
        )}
      </div>

      {project.videoUrl && !compact && (
        <span className="card-video-badge">
          <Film size={10} />
          <span>Motion</span>
        </span>
      )}
    </div>
  );
};

export default CardMediaPreview;
