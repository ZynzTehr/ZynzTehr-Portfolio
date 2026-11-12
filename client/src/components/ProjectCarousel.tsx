import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { gsap } from "../lib/gsap";
import { DUR, EASE } from "../lib/motion";
import { prefersReducedMotion } from "../lib/useReducedMotion";
import PixelButton from "./fx/PixelButton";
import MaskHeading from "./MaskHeading";
import { useMediaQuery } from "../lib/useReducedMotion";
import { Play, Pause, ChevronLeft, ChevronRight, Eye, Layers, Orbit, Sparkles } from "lucide-react";
import { categories, type Project } from "../data/projects";
import Earth3D from "./Earth3D";
import CardMediaPreview from "./CardMediaPreview";

interface ProjectCarouselProps {
  projects: Project[];
  onSelectProject: (project: Project, originRect: DOMRect | null) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  /** Hidden behind an open project: stop the orbit and the globe without unmounting. */
  paused?: boolean;
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  projects,
  onSelectProject,
  activeCategory,
  onSelectCategory,
  paused = false,
}) => {
  const canHover = useMediaQuery("(hover: hover)");
  const [isRotating, setIsRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isStepping, setIsStepping] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const stepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const prevCategoryRef = useRef(activeCategory);
  const prevPausedRef = useRef(paused);
  const [inView, setInView] = useState(true);
  // Offscreen or behind an open project: stop the orbit loop and the globe render.
  const idle = paused || !inView;

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "200px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Returning from a project: the orbit settles back in instead of snapping.
  useLayoutEffect(() => {
    const was = prevPausedRef.current;
    prevPausedRef.current = paused;
    if (!was || paused || !wrapperRef.current || prefersReducedMotion()) return;
    const tween = gsap.from(wrapperRef.current, {
      opacity: 0,
      y: 14,
      duration: DUR.reveal,
      ease: EASE.out,
      clearProps: "transform,opacity",
    });
    return () => {
      tween.kill();
    };
  }, [paused]);

  const displayProjects = projects.slice(0, 10);
  const quantity = displayProjects.length || 1;
  const safeMobileIndex = Math.min(activeMobileIndex, Math.max(0, displayProjects.length - 1));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Act I entrance: the globe zooms up, then the tiles deploy into orbit.
  // gsap.from in a layout effect sets the start state before first paint.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".chapter-orbital-header", {
        y: 14,
        opacity: 0,
        duration: DUR.reveal,
        delay: 0.1,
        ease: EASE.out,
        clearProps: "transform,opacity",
      });
      gsap.from(".earth-container", {
        opacity: 0,
        scale: 0.82,
        duration: DUR.hero * 1.3,
        delay: 0.15,
        ease: EASE.out,
        clearProps: "transform,opacity",
      });
      gsap.from(".project-tile-3d", {
        opacity: 0,
        scale: 0.86,
        duration: DUR.reveal,
        stagger: 0.04,
        delay: 0.3,
        ease: EASE.out,
        clearProps: "transform,opacity",
      });
      gsap.from([".category-filter-container", ".carousel-controls"], {
        y: 14,
        opacity: 0,
        duration: DUR.reveal,
        stagger: 0.08,
        delay: 0.45,
        ease: EASE.out,
        clearProps: "transform,opacity",
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  // Re-stage the orbit when the category changes (never on mount).
  useLayoutEffect(() => {
    if (prevCategoryRef.current === activeCategory) return;
    prevCategoryRef.current = activeCategory;
    if (sliderRef.current && window.innerWidth <= 768) {
      sliderRef.current.scrollTo({ left: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".project-tile-3d", {
        opacity: 0.2,
        scale: 0.9,
        duration: DUR.reveal,
        stagger: 0.035,
        ease: EASE.out,
        clearProps: "transform,opacity",
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, [activeCategory]);

  /** A category switch also swings the orbit forward a step, so the change reads as motion. */
  const stepOrbitForCategory = () => {
    if (window.innerWidth <= 768 || prefersReducedMotion()) return;
    setIsStepping(true);
    angleRef.current += 28;
    setRotationAngle(angleRef.current);
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    stepTimeoutRef.current = setTimeout(() => setIsStepping(false), 640);
  };

  useEffect(() => {
    if (isMobile) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastTimestamp = performance.now();

    const orbitLoop = (timestamp: number) => {
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isRotating && !isHovered && !isStepping && !idle) {
        angleRef.current = (angleRef.current + 10.5 * delta) % 360;
        setRotationAngle(angleRef.current);
      }

      animFrameRef.current = requestAnimationFrame(orbitLoop);
    };

    animFrameRef.current = requestAnimationFrame(orbitLoop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      // The step timer is not cleared here: this effect re-runs whenever a step
      // starts, and clearing it would leave the orbit stuck in "stepping".
    };
  }, [isRotating, isHovered, isStepping, isMobile, idle]);

  useEffect(
    () => () => {
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    },
    [],
  );

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
      }, 580);
    },
    [displayProjects.length, quantity],
  );

  /** Turn the orbit the short way until this tile faces the viewer (keyboard focus). */
  const bringToFront = (index: number) => {
    if (isMobile) return;
    const target = -(index * 360) / quantity;
    const delta = ((((target - angleRef.current) % 360) + 540) % 360) - 180;
    if (Math.abs(delta) < 0.5) return;
    angleRef.current += delta;
    setRotationAngle(angleRef.current);
    if (prefersReducedMotion()) return;
    setIsStepping(true);
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    stepTimeoutRef.current = setTimeout(() => setIsStepping(false), 640);
  };

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
    <div ref={wrapperRef} className="project-showcase-wrapper w-full flex flex-col items-center">
      {/* Chapter 01 Narrative Cue */}
      <div className="chapter-orbital-header w-full flex flex-col items-center sm:items-start gap-1.5 mb-1 px-1">
        <p className="chapter-kicker m-0 inline-flex items-center gap-2">
          <Orbit size={14} className="text-accent" aria-hidden="true" />
          ACT I // ORBIT
        </p>
        <MaskHeading className="text-xl md:text-[1.7rem] font-bold leading-tight font-display m-0 text-[var(--text-primary)]">
          The latest systems, in orbit
        </MaskHeading>
        <p className="chapter-orbital-hint m-0 text-xs text-[var(--text-muted)] text-center sm:text-left">
          {canHover
            ? "Hover a system to see it running. Select it for the full view."
            : "Tap a system to open it. Swipe to move through the orbit."}
        </p>
      </div>

      <div className="banner" style={{ "--quantity": quantity } as React.CSSProperties}>
        <Earth3D reverse={true} size={650} paused={idle} />

        <div
          ref={sliderRef}
          className={`slider ${!isRotating ? "paused-rotation" : ""}`}
          onScroll={handleSliderScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={
            isMobile
              ? undefined
              : {
                  transform: `perspective(1100px) rotateX(-10deg) rotateY(${rotationAngle}deg)`,
                  transition: isStepping ? "transform 0.58s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                }
          }
        >
          {displayProjects.map((project, index) => {
            const isCardActive = isMobile ? index === safeMobileIndex : hoveredId === project.id;
            // How squarely this tile faces the viewer (1 front, -1 back). Rear tiles
            // dim and hide their text instead of showing it mirrored.
            const facing = isMobile
              ? 1
              : Math.cos(((rotationAngle + (index * 360) / quantity) * Math.PI) / 180);

            return (
              <div
                key={project.id}
                role="button"
                tabIndex={0}
                aria-label={`${project.name}: open project details`}
                data-project-tile={project.id}
                className={`item ${index === safeMobileIndex ? "active-tile" : ""} ${facing < 0 ? "is-rear" : ""}`}
                style={
                  { "--position": index + 1, "--facing": facing.toFixed(3) } as React.CSSProperties
                }
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
                  bringToFront(index);
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
                      <Eye size={12} className="mr-1" aria-hidden="true" />
                      <span>Open</span>
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
        role="group"
        aria-label="Filter projects by category"
        className="category-filter-container flex justify-center flex-wrap gap-2 mt-6"
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <PixelButton
              key={cat}
              variant={isActive ? "primary" : "secondary"}
              size="sm"
              aria-pressed={isActive}
              className={`category-pill ${isActive ? "is-active" : ""}`}
              onClick={() => {
                if (activeCategory === cat) return;
                setActiveMobileIndex(0);
                stepOrbitForCategory();
                onSelectCategory(cat);
              }}
            >
              {cat === "Recent" && <Layers size={14} aria-hidden="true" />}
              {cat === "3D & Creative UI" && <Sparkles size={14} aria-hidden="true" />}
              <span>{cat}</span>
              {isActive && (
                <span className="category-count-chip font-telemetry">{displayProjects.length}</span>
              )}
            </PixelButton>
          );
        })}
      </div>

      {/* 3D Stage Controls */}
      <div className="carousel-controls flex items-center justify-center gap-4 mt-4 mb-6">
        <button
          type="button"
          className="btn-carousel-ctrl"
          onClick={() => handleRotate("left")}
          title="Previous system"
          aria-label="Previous system"
        >
          <ChevronLeft size={18} />
        </button>

        {!isMobile && (
          <PixelButton
            variant="secondary"
            size="sm"
            onClick={togglePlayPause}

            title={isRotating ? "Pause the orbit" : "Resume the orbit"}
          >
            <span className={`play-morph ${isRotating ? "is-playing" : ""}`} aria-hidden="true">
              <Pause size={16} className="play-morph__pause" />
              <Play size={16} className="play-morph__play" />
            </span>
            <span>{isRotating ? "Pause orbit" : "Resume orbit"}</span>
          </PixelButton>
        )}

        <button
          type="button"
          className="btn-carousel-ctrl"
          onClick={() => handleRotate("right")}
          title="Next system"
          aria-label="Next system"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProjectCarousel;
