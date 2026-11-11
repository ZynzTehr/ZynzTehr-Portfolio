import React, { useEffect } from "react";
import { ExternalLink, X, Calendar, Star, GitFork, Sparkles, Tag } from "lucide-react";
import { GithubIcon } from "./Icon";
import ProjectArt from "./project-arts/ProjectArt";
import type { Project } from "../data/projects";
import "../styles/Modal.css";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="modal-content project-inspector-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-accent" />
            <h2
              id="project-modal-title"
              className="modal-title m-0 text-gradient font-orbitron text-[1.4rem] font-semibold leading-tight"
            >
              {project.name}
            </h2>
          </div>
          <button className="btn-close-modal" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body p-4 md:p-6">
          {/* Media Preview Container */}
          <div className="project-modal-media mb-6 relative overflow-hidden rounded-xl w-full h-[220px] md:h-[320px] flex items-center justify-center">
            <ProjectArt
              projectId={project.id}
              projectName={project.name}
              previewImage={project.previewImage}
              mediaUrl={project.mediaUrl}
              key={`${project.id}-${isOpen}`}
            />
          </div>

          {/* Badges & Meta Info */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge-neon category-badge">
              <Tag size={14} className="mr-1" />
              {project.category}
            </span>
            <span className="badge-neon language-badge">{project.language}</span>
            {project.stars > 0 && (
              <span className="badge-meta">
                <Star size={14} className="text-amber-400 mr-1" />
                {project.stars}
              </span>
            )}
            {project.forks > 0 && (
              <span className="badge-meta">
                <GitFork size={14} className="mr-1" />
                {project.forks}
              </span>
            )}
            {project.updatedAt && (
              <span className="badge-meta">
                <Calendar size={14} className="mr-1" />
                {new Date(project.updatedAt).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="project-modal-description mb-6 leading-relaxed text-[var(--font-secondary)]">
            {project.description}
          </p>

          {/* Topics / Tech Stack Tags */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gradient mb-2 opacity-80">
              Tech Stack & Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.topics.map((topic, i) => (
                <span key={i} className="tech-pill">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer / Action Links */}
        <div className="modal-footer flex flex-col-reverse md:flex-row justify-between items-center gap-3 p-5 pb-9 md:p-4 md:px-6 border-t border-white/10">
          <button
            className="btn-custom btn-modal-close w-full md:w-auto py-2 px-6 text-[0.9rem]"
            onClick={onClose}
          >
            Close
          </button>

          <div className="flex flex-col md:flex-row w-full md:w-auto gap-2.5 md:gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-custom btn-live-demo w-full md:w-auto inline-flex items-center justify-center gap-2 py-2 px-6 text-[0.9rem] no-underline"
              >
                <ExternalLink size={16} />
                View Site
              </a>
            )}

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-custom btn-github w-full md:w-auto inline-flex items-center justify-center gap-2 py-2 px-6 text-[0.9rem] no-underline"
            >
              <GithubIcon size={16} />
              View Source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
