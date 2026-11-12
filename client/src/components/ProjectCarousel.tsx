import React, { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, ChevronLeft, ChevronRight, Eye, Layers, Sparkles } from "lucide-react";
import { categories, type Project } from "../data/projects";
import Earth3D from "./Earth3D";
import CardMediaPreview from "./CardMediaPreview";

interface ProjectCarouselProps {
  projects: Project[];
  onSelectProject: (project: Project, originRect: DOMRect | null) => void;
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isStepping, setIsStepping] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const stepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);

  const displayProjects = projects.slice(0, 10);
  const quantity = displayProjects.length || 1;
  const safeMobileIndex = Math.min(activeMobileIndex, Math.max(0, displayProjects.length - 1));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastTimestamp = performance.now();

    const orbitLoop = (timestamp: number) => {
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isRotating && !isHovered && !isStepping) {
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
  }, [isRotating, isHovered, isStepping, isMobile]);

  useEffect(() => {
    if (sliderRef.current && window.innerWidth <= 768) {
      sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [activeCategory]);

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

  const handleRotate = useCallback(
    (direction: "left" | "right") => {
      if (sliderRef.current && window.innerWidth <= 768) {
        setActiveMobileIndex((prev) => {
          const clampedPrev = Math.min(prev, Math.max(0, displayProjects.length - 1));
          const nextIndex =
            direction === "left"
              ? Math.max(0, clampedPrev - 1)
              : Math.min(displayProjects.length - 1, clampedPrev + 1);

          const targetItem = sliderRef.current?.children[nextIndex] as HTMLElement | undefined;
          if (targetItem && sliderRef.current) {
            const targetLeft =
              targetItem.offsetLeft - (sliderRef.current.clientWidth - targetItem.clientWidth) / 2;
            sliderRef.current.scrollTo({ left: targetLeft, behavior: "smooth" });
          }
          return nextIndex;
        });
        return;
      }

      setIsRotating(false);
      setIsStepping(true);

      const step = 360 / quantity;
      const targetAngle = direction === "left" ? angleRef.current - step : angleRef.current + step;
      angleRef.current = targetAngle;
      setRotationAngle(targetAngle);

      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = setTimeout(() => {
        setIsStepping(false);
      }, 550);
    },
    [displayProjects.length, quantity],
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

  const handleCardActivate = (project: Project, index: number, cardElement: HTMLElement | null) => {
    if (isDraggingRef.current) return;
    if (window.innerWidth <= 768) {
      setActiveMobileIndex(index);
    }
    const mediaBox = cardElement?.querySelector(".tile-media-wrapper") as HTMLElement | null;
    const rect = (mediaBox ?? cardElement)?.getBoundingClientRect() ?? null;
    onSelectProject(project, rect);
  };

  return (
    <div className="project-showcase-wrapper w-full flex flex-col items-center">
      <div className="banner" style={{ "--quantity": quantity } as React.CSSProperties}>
        <Earth3D reverse={true} size={650} />

        <div
          ref={sliderRef}
          className="slider"
          onScroll={handleSliderScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={
            isMobile
              ? undefined
              : {
                  transform: `perspective(1100px) rotateX(-10deg) rotateY(${rotationAngle}deg)`,
                  transition: isStepping ? "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                }
          }
        >
          {displayProjects.map((project, index) => {
            const isCardActive = isMobile ? index === safeMobileIndex : hoveredId === project.id;

            return (
              <div
                key={project.id}
                role="button"
                tabIndex={0}
                aria-label={`Open ${project.name} showcase`}
                className={`item ${index === safeMobileIndex ? "active-tile" : ""}`}
                style={{ "--position": index + 1 } as React.CSSProperties}
                onClick={(e) => handleCardActivate(project, index, e.currentTarget)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardActivate(project, index, e.currentTarget);
                  }
                }}
                onMouseEnter={() => {
                  setIsHovered(true);
                  setHoveredId(project.id);
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setHoveredId((prev) => (prev === project.id ? null : prev));
                }}
                onFocus={() => {
                  setIsHovered(true);
                  setHoveredId(project.id);
                }}
                onBlur={() => {
                  setIsHovered(false);
                  setHoveredId((prev) => (prev === project.id ? null : prev));
                }}
              >
                <div className="carousel-card project-tile-3d">
                  <div className="tile-media-wrapper">
                    <CardMediaPreview project={project} isActive={isCardActive} compact />
                    <div className="tile-overlay-glow" />
                  </div>

                  <div className="tile-info">
                    <span className="tile-category-tag">{project.category}</span>
                    <h3 className="tile-title truncate">{project.name}</h3>
                    <div className="tile-inspect-hint">
                      <Eye size={12} className="mr-1" />
                      <span>Expand View</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div
        role="tablist"
        aria-label="Filter projects by category"
        className="category-filter-container flex justify-center flex-wrap gap-2 mt-6"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat}
            className={`btn-category-pill ${activeCategory === cat ? "active" : ""}`}
            onClick={() => {
              setActiveMobileIndex(0);
              onSelectCategory(cat);
            }}
          >
            {cat === "Recent" && <Layers size={14} className="mr-1.5" />}
            {cat === "3D & Creative UI" && <Sparkles size={14} className="mr-1.5" />}
            {cat}
          </button>
        ))}
      </div>

      {/* 3D Stage Controls */}
      <div className="carousel-controls flex items-center justify-center gap-4 mt-4 mb-6">
        <button
          type="button"
          className="btn-carousel-ctrl"
          onClick={() => handleRotate("left")}
          title="Rotate Left"
          aria-label="Rotate Left"
        >
          <ChevronLeft size={18} />
        </button>

        {!isMobile && (
          <button
            type="button"
            className="btn-carousel-ctrl btn-play-pause"
            onClick={togglePlayPause}
            title={isRotating ? "Pause Rotation" : "Resume Rotation"}
            aria-label={isRotating ? "Pause Rotation" : "Resume Rotation"}
          >
            {isRotating ? <Pause size={16} /> : <Play size={16} />}
            <span className="ml-1.5 text-sm font-medium">
              {isRotating ? "Pause Orbit" : "Auto Orbit"}
            </span>
          </button>
        )}

        <button
          type="button"
          className="btn-carousel-ctrl"
          onClick={() => handleRotate("right")}
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
