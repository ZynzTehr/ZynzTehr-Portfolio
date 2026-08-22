import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Eye, Layers, Sparkles } from 'lucide-react';
import { categories, type Project } from '../data/projects';
import Earth3D from './Earth3D';
import MatrixRain from './MatrixRain';
import ProjectArt from './project-arts/ProjectArt';

interface ProjectCarouselProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  projects,
  onSelectProject,
  activeCategory,
  onSelectCategory,
}) => {
  const [isRotating, setIsRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isStepping, setIsStepping] = useState(false);

  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const stepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);

  const displayProjects = projects.slice(0, 10); // Optimal quantity for the 3D cylinder
  const quantity = displayProjects.length || 1;

  // Continuous 60fps auto-orbit loop (active on larger screens)
  useEffect(() => {
    let lastTimestamp = performance.now();

    const orbitLoop = (timestamp: number) => {
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isRotating && !isHovered && !isStepping) {
        // Full 360 rotation in 32 seconds = 11.25 deg/sec
        angleRef.current = (angleRef.current + 11.25 * delta) % 360;
        setRotationAngle(angleRef.current);
      }

      animFrameRef.current = requestAnimationFrame(orbitLoop);
    };

    animFrameRef.current = requestAnimationFrame(orbitLoop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (stepTimeoutRef.current) {
        clearTimeout(stepTimeoutRef.current);
      }
    };
  }, [isRotating, isHovered, isStepping]);

  // Reset horizontal slider scroll position and active index when category changes on mobile
  useEffect(() => {
    setActiveMobileIndex(0);
    if (sliderRef.current && window.innerWidth <= 768) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activeCategory]);

  // Track active item when user swipes horizontally on mobile
  const handleSliderScroll = () => {
    if (!sliderRef.current || window.innerWidth > 768) return;
    const container = sliderRef.current;
    const center = container.scrollLeft + container.clientWidth / 2;
    let closestIdx = 0;
    let minDiff = Infinity;
    Array.from(container.children).forEach((child, idx) => {
      const childEl = child as HTMLElement;
      const childCenter = childEl.offsetLeft + childEl.offsetWidth / 2;
      const diff = Math.abs(center - childCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    setActiveMobileIndex(closestIdx);
  };

  // Handle manual rotation stepping (or horizontal scroll on mobile)
  const handleRotate = useCallback(
    (direction: 'left' | 'right') => {
      if (sliderRef.current && window.innerWidth <= 768) {
        setActiveMobileIndex((prev) => {
          const nextIndex =
            direction === 'left'
              ? Math.max(0, prev - 1)
              : Math.min(displayProjects.length - 1, prev + 1);

          const targetItem = sliderRef.current?.children[nextIndex] as HTMLElement;
          if (targetItem && sliderRef.current) {
            const targetLeft =
              targetItem.offsetLeft - (sliderRef.current.clientWidth - targetItem.clientWidth) / 2;
            sliderRef.current.scrollTo({ left: targetLeft, behavior: 'smooth' });
          }
          return nextIndex;
        });
        return;
      }

      setIsRotating(false);
      setIsStepping(true);

      const step = 360 / quantity;
      const targetAngle = direction === 'left' ? angleRef.current - step : angleRef.current + step;
      angleRef.current = targetAngle;
      setRotationAngle(targetAngle);

      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = setTimeout(() => {
        setIsStepping(false);
      }, 550);
    },
    [displayProjects.length, quantity]
  );

  const togglePlayPause = () => {
    setIsStepping(false);
    setIsRotating((prev) => !prev);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      isDraggingRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current || e.touches.length === 0) return;
    const deltaX = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
    if (deltaX > 8 || deltaY > 8) {
      isDraggingRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      isDraggingRef.current = false;
      touchStartPos.current = null;
    }, 60);
  };

  const handleCardClick = (project: Project, index: number) => {
    if (isDraggingRef.current) return;
    if (window.innerWidth <= 768) {
      setActiveMobileIndex(index);
    }
    onSelectProject(project);
  };

  return (
    <div className="project-showcase-wrapper w-100 d-flex flex-column align-items-center">
      
      {/* 3D Carousel Section */}
      <div
        className="banner"
        style={{ '--quantity': quantity } as React.CSSProperties}
      >
        {/* Three.js 3D Earth in the Center */}
        <Earth3D reverse={true} size={650} />

        {/* 3D Cylinder Slider / Mobile Horizontal Snap Slider */}
        <div
          ref={sliderRef}
          className="slider"
          onScroll={handleSliderScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `perspective(1100px) rotateX(-10deg) rotateY(${rotationAngle}deg)`,
            transition: isStepping ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          }}
        >
          {displayProjects.map((project, index) => (
            <div
              key={project.id}
              className={`item ${index === activeMobileIndex ? 'active-tile' : ''}`}
              style={{ '--position': index + 1 } as React.CSSProperties}
              onClick={() => handleCardClick(project, index)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="carousel-card project-tile-3d">
                
                {/* Media Container: Default Matrix Code Rain with Hover SVG Cross-fade */}
                <div className="tile-media-wrapper">
                  <div className="tile-default-media">
                    <MatrixRain
                      color="#00ff41"
                      fontSize={11}
                      speed={30}
                    />
                  </div>
                  <div className="tile-hover-art">
                    <ProjectArt projectId={project.id} projectName={project.name} />
                  </div>
                  <div className="tile-overlay-glow"></div>
                </div>

                {/* Info Bar */}
                <div className="tile-info">
                  <span className="tile-category-tag">{project.category}</span>
                  <h3 className="tile-title text-truncate">{project.name}</h3>
                  <div className="tile-inspect-hint">
                    <Eye size={12} className="me-1" />
                    <span>Inspect</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter Pills Directly Above Carousel Stage Controls */}
      <div className="category-filter-container d-flex justify-content-center flex-wrap gap-2 mt-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn-category-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat)}
          >
            {cat === 'All' && <Layers size={14} className="me-1" />}
            {cat === '3D & Creative UI' && <Sparkles size={14} className="me-1" />}
            {cat}
          </button>
        ))}
      </div>

      {/* 3D Stage Controls */}
      <div className="carousel-controls d-flex align-items-center justify-content-center gap-3 mt-3 mb-4">
        <button
          className="btn-carousel-ctrl"
          onClick={() => handleRotate('left')}
          title="Rotate Left"
          aria-label="Rotate Left"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          className="btn-carousel-ctrl btn-play-pause"
          onClick={togglePlayPause}
          title={isRotating ? 'Pause Rotation' : 'Resume Rotation'}
          aria-label={isRotating ? 'Pause Rotation' : 'Resume Rotation'}
        >
          {isRotating ? <Pause size={16} /> : <Play size={16} />}
          <span className="ms-1 small">{isRotating ? 'Pause Orbit' : 'Auto Orbit'}</span>
        </button>

        <button
          className="btn-carousel-ctrl"
          onClick={() => handleRotate('right')}
          title="Rotate Right"
          aria-label="Rotate Right"
        >
          <ChevronRight size={18} />
        </button>
      </div>

    </div>
  );
};

export default ProjectCarousel;
