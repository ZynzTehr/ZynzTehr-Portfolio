import React, { useEffect } from 'react';
import { ExternalLink, X, Calendar, Star, GitFork, Sparkles, Tag } from 'lucide-react';
import { GithubIcon } from './Icon';
import ProjectArt from './project-arts/ProjectArt';
import type { Project } from '../data/projects';
import '../styles/Modal.css';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content project-inspector-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <Sparkles size={20} className="text-accent" />
            <h2 className="modal-title m-0 text-gradient" style={{ fontSize: '1.4rem' }}>
              {project.name}
            </h2>
          </div>
          <button className="btn-close-modal" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body p-4">
          
          {/* Media Preview Container */}
          <div
            className="project-modal-media mb-4 position-relative overflow-hidden rounded-3"
            style={{
              border: '1px solid var(--glass-border)',
              background: '#070714',
              width: '100%',
              height: '320px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ProjectArt
              projectId={project.id}
              projectName={project.name}
              previewImage={project.previewImage}
              mediaUrl={project.mediaUrl}
              key={`${project.id}-${isOpen}`}
            />
          </div>

          {/* Badges & Meta Info */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge-neon category-badge">
              <Tag size={14} className="me-1" />
              {project.category}
            </span>
            <span className="badge-neon language-badge">
              {project.language}
            </span>
            {project.stars > 0 && (
              <span className="badge-meta">
                <Star size={14} className="text-warning me-1" />
                {project.stars}
              </span>
            )}
            {project.forks > 0 && (
              <span className="badge-meta">
                <GitFork size={14} className="me-1" />
                {project.forks}
              </span>
            )}
            {project.updatedAt && (
              <span className="badge-meta">
                <Calendar size={14} className="me-1" />
                {new Date(project.updatedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="project-modal-description mb-4" style={{ lineHeight: '1.7', color: 'var(--font-secondary)' }}>
            {project.description}
          </p>

          {/* Topics / Tech Stack Tags */}
          <div className="mb-4">
            <h4 className="small text-uppercase text-gradient mb-2" style={{ letterSpacing: '1px', opacity: 0.8 }}>
              Tech Stack & Topics
            </h4>
            <div className="d-flex flex-wrap gap-2">
              {project.topics.map((topic, i) => (
                <span key={i} className="tech-pill">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer / Action Links */}
        <div className="modal-footer d-flex justify-content-between align-items-center p-3">
          <button className="btn-custom btn-modal-close py-2 px-4" onClick={onClose} style={{ fontSize: '0.9rem' }}>
            Close
          </button>

          <div className="d-flex gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-custom btn-live-demo d-inline-flex align-items-center gap-2 py-2 px-4"
                style={{ fontSize: '0.9rem', textDecoration: 'none' }}
              >
                <ExternalLink size={16} />
                View Site
              </a>
            )}

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-custom btn-github d-inline-flex align-items-center gap-2 py-2 px-4"
              style={{ fontSize: '0.9rem', textDecoration: 'none' }}
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
