import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GitFork,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { formatProjectDate, type Project } from "../data/projects";
import { GithubIcon } from "./Icon";
import Asciify from "./canvasui/Asciify";
import GlyphRain from "./canvasui/GlyphRain";

interface ProjectStageProps {
  project: Project;
  originRect?: DOMRect | null;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const ProjectStage: React.FC<ProjectStageProps> = ({
  project,
  originRect,
  currentIndex,
  totalCount,
  onClose,
  onPrev,
  onNext,
}) => {
  const stageRef = useRef<HTMLElement>(null);
  const mediaFrameRef = useRef<HTMLDivElement>(null);
  const dossierRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [reducedMotion] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Keyboard navigation: Escape closes, Left/Right steps across projects
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  // Focus management and smooth viewport alignment when stage mounts
  useEffect(() => {
    closeBtnRef.current?.focus({ preventScroll: true });
    const stageEl = stageRef.current;
    if (!stageEl) return;
    const rect = stageEl.getBoundingClientRect();
    const outOfView = rect.top < 72 || rect.bottom > window.innerHeight + 60;
    if (outOfView) {
      const targetTop = Math.max(0, window.scrollY + rect.top - 96);
      window.scrollTo({
        top: targetTop,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  }, [project.id, reducedMotion]);

  // FLIP-style growth from the clicked card thumbnail to the left notched frame
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const mediaEl = mediaFrameRef.current;
    const dossierEl = dossierRef.current;
    if (!mediaEl || !dossierEl) return;

    const ctx = gsap.context(() => {
      if (originRect && originRect.width > 20 && originRect.height > 20) {
        const dest = mediaEl.getBoundingClientRect();
        const dx = originRect.left + originRect.width / 2 - (dest.left + dest.width / 2);
        const dy = originRect.top + originRect.height / 2 - (dest.top + dest.height / 2);
        const sx = Math.min(1, Math.max(0.28, originRect.width / Math.max(dest.width, 1)));
        const sy = Math.min(1, Math.max(0.28, originRect.height / Math.max(dest.height, 1)));

        gsap.fromTo(
          mediaEl,
          {
            x: dx,
            y: Math.max(-260, Math.min(260, dy)),
            scaleX: sx,
            scaleY: sy,
            opacity: 0.72,
          },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            duration: 0.68,
            ease: "expo.out",
            clearProps: "transform",
          },
        );
      } else {
        gsap.fromTo(
          mediaEl,
          { x: -24, scale: 0.96, opacity: 0 },
          {
            x: 0,
            scale: 1,
            opacity: 1,
            duration: 0.52,
            ease: "power3.out",
            clearProps: "transform",
          },
        );
      }

      const items = dossierEl.querySelectorAll(".stage-stagger-item");
      gsap.fromTo(
        items,
        { opacity: 0, x: 22 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.06,
          delay: 0.12,
          ease: "power3.out",
        },
      );
    }, stageRef);

    return () => ctx.revert();
  }, [project.id, originRect, reducedMotion]);

  const formattedDate = formatProjectDate(project.updatedAt);

  return (
    <article
      ref={stageRef}
      className="project-stage-shell"
      aria-label={`${project.name} project showcase`}
    >
      <GlyphRain
        className="w-full"
        color={[0.2667, 0.4549, 1]}
        headColor={[0.3765, 0.647, 0.98]}
        density={0.11}
        glow={1.1}
        dim={0.15}
        trail={0.48}
        speed={0.16}
        cell={14}
      >
        <div className="project-stage-grid">
          {/* Left Column: Expanded Media with Multi-Side Inverted-Radius Notches */}
          <div ref={mediaFrameRef} className="notched-media-frame">
            <Asciify
              className="notched-media-canvas"
              radius={0.34}
              softness={0.85}
              scale={2}
              spacing={1}
              contrast={1.18}
              glow={0.8}
              aberration={0.65}
              background={[0.0235, 0.0431, 0.098]}
              backgroundOpacity={0.82}
            >
              {project.videoUrl && !reducedMotion ? (
                <video
                  key={project.videoUrl}
                  src={project.videoUrl}
                  poster={project.previewImage}
                  crossOrigin="anonymous"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="notched-media-asset"
                />
              ) : (
                <img
                  key={project.previewImage}
                  src={project.previewImage}
                  alt={`${project.name} application view`}
                  crossOrigin="anonymous"
                  className="notched-media-asset"
                />
              )}
            </Asciify>

            {/* Top-Left Notch: Project Name */}
            <div className="media-notch notch-top-left">
              <span className="notch-eyebrow">Project</span>
              <h2 className="notch-project-title">{project.name}</h2>
            </div>

            {/* Bottom-Left Notch: Tech Stack */}
            <div className="media-notch notch-bottom-left">
              <span className="notch-eyebrow">Tech Stack</span>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 4).map((tech) => (
                  <span key={tech} className="notch-stack-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Right-Side Notch: Topics */}
            <div className="media-notch notch-right-side">
              <span className="notch-eyebrow">Topics</span>
              {project.topics.slice(0, 3).map((topic) => (
                <span key={topic} className="notch-topic-chip">
                  #{topic}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Structured Metadata Tags, Description, and Controls */}
          <div ref={dossierRef} className="stage-dossier">
            <div className="flex flex-col gap-4">
              {/* Top Stage Navigation Bar */}
              <div className="stage-stagger-item flex items-center justify-between gap-2">
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={onClose}
                  className="btn-stage-secondary !py-2 !px-3.5 !min-h-[38px] text-xs whitespace-nowrap"
                >
                  <ArrowLeft size={15} />
                  <span>Back to Cards</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <span className="font-telemetry text-xs text-[var(--text-muted)] mr-1.5">
                    {String(currentIndex + 1).padStart(2, "0")} /{" "}
                    {String(totalCount).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={onPrev}
                    className="btn-stage-icon !min-w-[38px] !min-h-[38px]"
                    aria-label="Previous project"
                    title="Previous project"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    className="btn-stage-icon !min-w-[38px] !min-h-[38px]"
                    aria-label="Next project"
                    title="Next project"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-stage-icon !min-w-[38px] !min-h-[38px]"
                    aria-label="Close project view"
                    title="Close (Esc)"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Primary Metadata Tags: Category, Language, Date */}
              <div className="stage-stagger-item flex flex-wrap items-center gap-2 pt-1">
                <span className="stage-meta-tag tag-category">{project.category}</span>
                <span className="stage-meta-tag">{project.language}</span>
                <span className="stage-meta-tag">{formattedDate}</span>
                {project.stars > 0 && (
                  <span className="stage-meta-tag">
                    <Star size={13} className="text-accent" />
                    {project.stars}
                  </span>
                )}
                {project.forks > 0 && (
                  <span className="stage-meta-tag">
                    <GitFork size={13} className="text-accent" />
                    {project.forks}
                  </span>
                )}
              </div>

              {/* Project Description Underneath Metadata Tags */}
              <p className="stage-stagger-item stage-description">{project.description}</p>
            </div>

            {/* Action Links and Shader Lens Hint */}
            <div className="stage-stagger-item flex flex-col gap-3 pt-2 border-t border-[var(--border-subtle)]">
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-stage-primary"
                  >
                    <span>Launch Live Build</span>
                    <ExternalLink size={16} />
                  </a>
                )}
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-stage-secondary"
                >
                  <GithubIcon size={16} />
                  <span>View Source</span>
                </a>
              </div>

              <div className="hidden md:flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-telemetry">
                <Sparkles size={12} className="text-accent shrink-0" />
                <span>Sweep cursor over media to inspect live ASCII shader lens</span>
              </div>
            </div>
          </div>
        </div>
      </GlyphRain>
    </article>
  );
};

export default ProjectStage;
