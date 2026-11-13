import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { gsap } from "../lib/gsap";
import { animateFrom, DUR, EASE } from "../lib/motion";
import { prefersReducedMotion } from "../lib/useReducedMotion";
import PixelButton from "./fx/PixelButton";
import MaskHeading from "./MaskHeading";
import { useMediaQuery } from "../lib/useReducedMotion";
import { Play, Pause, ChevronLeft, ChevronRight, Layers, Orbit, Sparkles } from "lucide-react";
import { categories, type Project } from "../data/projects";
import Earth3D from "./Earth3D";
import CardMediaPreview from "./CardMediaPreview";
import InspectHint from "./InspectHint";
import PageLoadSweep from "./canvasui/PageLoadSweep";

/**
 * When Tab last moved focus. Focus restored by script after a project closes
 * (Escape counts as a keyboard interaction, so it also matches :focus-visible)
 * must not pause and turn the orbit; only real Tab navigation does.
 */
let lastTabAt = -Infinity;
const TAB_FOCUS_WINDOW_MS = 400;

/** Orbit animation time per degree of turn; the animations are only ever seeked. */
const ORBIT_MS_PER_DEG = 1000;

interface ProjectCarouselProps {
  projects: Project[];
  onSelectProject: (project: Project, originRect: DOMRect | null) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  /** Hidden behind an open project: stop the orbit and the globe without unmounting. */
  paused?: boolean;
  /** Act I fills under a tenth of the screen: hold the orbit and the globe, quietly. */
  dormant?: boolean;
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  projects,
  onSelectProject,
  activeCategory,
  onSelectCategory,
  paused = false,
  dormant = false,
}) => {
  const canHover = useMediaQuery("(hover: hover)");
  const [isRotating, setIsRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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
  // Offscreen, covered by Act II, or behind an open project: stop the orbit
  // loop and the globe render.
  const idle = paused || dormant || !inView;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") lastTabAt = performance.now();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

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
    // A Web Animation, not a GSAP tween: the wrapper holds ~1,700 elements, and
    // a per-frame inline style write on it restyles all of them under an ad
    // blocker's injected stylesheet (see animateFrom).
    const anims = animateFrom(
      wrapperRef.current,
      { opacity: 0, transform: "translateY(14px)" },
      { duration: DUR.reveal },
    );
    return () => anims.forEach((a) => a.cancel());
  }, [paused]);

  const displayProjects = projects.slice(0, 10);
  const quantity = displayProjects.length || 1;

  /**
   * The orbit is drawn by paused Web Animations seeked to angleRef: one turns
   * the ring, and for each tile one dims it as it faces away and one hides its
   * text on the far side (instead of showing it mirrored). Seeking an
   * animation restyles without selector matching. Writing inline styles or
   * custom properties every frame did not: with a large injected stylesheet
   * (a typical ad blocker adds ~14,000 generic selectors) each frame restyled
   * ~1,500 elements of tile art and the page fell to 5 fps.
   */
  const orbitAnimsRef = useRef<Animation[]>([]);
  const turnTweenRef = useRef<gsap.core.Tween | null>(null);
  /** Where a running step is heading, so repeated steps add up exactly. */
  const targetAngleRef = useRef(0);
  const projectKey = displayProjects.map((p) => p.id).join("|");

  const seekOrbit = useCallback(() => {
    const time = (((angleRef.current % 360) + 360) % 360) * ORBIT_MS_PER_DEG;
    for (const animation of orbitAnimsRef.current) animation.currentTime = time;
  }, []);

  /** Turn to `target` degrees: eased like a step, or at once. */
  const turnTo = useCallback(
    (target: number, animate: boolean) => {
      turnTweenRef.current?.kill();
      turnTweenRef.current = null;
      targetAngleRef.current = target;
      if (!animate) {
        angleRef.current = target;
        seekOrbit();
        return;
      }
      turnTweenRef.current = gsap.to(angleRef, {
        current: target,
        duration: 0.58,
        ease: EASE.out,
        onUpdate: seekOrbit,
      });
    },
    [seekOrbit],
  );

  /** The angle a new step starts from: a running step's destination. */
  const baseAngle = useCallback(
    () => (turnTweenRef.current?.isActive() ? targetAngleRef.current : angleRef.current),
    [],
  );

  useLayoutEffect(() => {
    const slider = sliderRef.current;
    if (!slider || isMobile) return;
    const timing: KeyframeAnimationOptions = {
      duration: 360 * ORBIT_MS_PER_DEG,
      iterations: Infinity,
      easing: "linear",
    };
    const animations: Animation[] = [
      slider.animate(
        [
          { transform: "perspective(1100px) rotateX(-10deg) rotateY(0deg)" },
          { transform: "perspective(1100px) rotateX(-10deg) rotateY(360deg)" },
        ],
        timing,
      ),
    ];
    Array.from(slider.children).forEach((item, index) => {
      const card = item.querySelector<HTMLElement>(".project-tile-3d");
      if (!card) return;
      const dim: Keyframe[] = [];
      const show: Keyframe[] = [];
      for (let deg = 0; deg <= 360; deg++) {
        // How squarely this tile faces the viewer at this orbit angle (1 front, -1 back).
        const facing = Math.cos(((deg + (index * 360) / quantity) * Math.PI) / 180);
        dim.push({ offset: deg / 360, opacity: 0.42 + 0.58 * Math.max(facing, 0) });
        // The text fades out over the last few degrees before it turns away.
        show.push({ offset: deg / 360, opacity: Math.min(1, Math.max(0, facing / 0.06)) });
      }
      animations.push(card.animate(dim, timing));
      for (const layer of Array.from(card.children)) {
        animations.push(layer.animate(show, timing));
      }
    });
    animations.forEach((animation) => animation.pause());
    orbitAnimsRef.current = animations;
    seekOrbit();
    return () => {
      animations.forEach((animation) => animation.cancel());
      orbitAnimsRef.current = [];
    };
  }, [isMobile, quantity, projectKey, seekOrbit]);

  useEffect(
    () => () => {
      turnTweenRef.current?.kill();
    },
    [],
  );

  // The engaged tile brightens to full over the orbit's dimming, then eases
  // back to it when released: an animation layered above the dim one (newer
  // animations win), since a CSS transition never sees an animated value.
  useEffect(() => {
    if (!hoveredId || isMobile) return;
    const card = sliderRef.current?.querySelector<HTMLElement>(
      `[data-project-tile="${CSS.escape(hoveredId)}"] .project-tile-3d`,
    );
    if (!card) return;
    const timing = { duration: DUR.ui * 1000, easing: "linear" };
    const lit = card.animate([{ opacity: getComputedStyle(card).opacity }, { opacity: 1 }], {
      ...timing,
      fill: "forwards",
    });
    return () => {
      const from = getComputedStyle(card).opacity;
      lit.cancel();
      if (card.isConnected) card.animate([{ opacity: from, offset: 0 }], timing);
    };
  }, [hoveredId, isMobile]);
  const safeMobileIndex = Math.min(activeMobileIndex, Math.max(0, displayProjects.length - 1));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Act I entrance: the globe zooms up, then the tiles deploy into orbit (the
  // header sweeps in on its own, through PageLoadSweep).
  // Web Animations started in a layout effect hold their start state from the
  // first paint. The tiles fade on .item (the orbit animates .project-tile-3d's
  // opacity) and grow on .project-tile-3d's own scale.
  useLayoutEffect(() => {
    const root = wrapperRef.current;
    if (!root || prefersReducedMotion()) return;
    const all = (selector: string) => root.querySelectorAll(selector);
    const anims = [
      // Added onto the globe's own centring transform (translate(-50%, -50%)),
      // so it grows about its centre rather than drifting in from the side.
      ...animateFrom(
        all(".earth-container"),
        { opacity: 0, transform: "scale(0.82)", composite: "add" },
        { duration: DUR.hero * 1.3, delay: 0.15 },
      ),
      ...animateFrom(
        all(".banner .slider > .item"),
        { opacity: 0 },
        {
          duration: DUR.reveal,
          stagger: 0.04,
          delay: 0.3,
        },
      ),
      ...animateFrom(
        all(".project-tile-3d"),
        { scale: "0.86" },
        {
          duration: DUR.reveal,
          stagger: 0.04,
          delay: 0.3,
        },
      ),
      ...animateFrom(
        all(".category-filter-container, .carousel-controls"),
        { opacity: 0, transform: "translateY(14px)" },
        { duration: DUR.reveal, stagger: 0.08, delay: 0.45 },
      ),
    ];
    return () => anims.forEach((a) => a.cancel());
  }, []);

  // Re-stage the orbit when the category changes (never on mount).
  useLayoutEffect(() => {
    if (prevCategoryRef.current === activeCategory) return;
    prevCategoryRef.current = activeCategory;
    if (sliderRef.current && window.innerWidth <= 768) {
      sliderRef.current.scrollTo({ left: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
    const root = wrapperRef.current;
    if (!root || prefersReducedMotion()) return;
    const anims = [
      ...animateFrom(
        root.querySelectorAll(".banner .slider > .item"),
        { opacity: 0.2 },
        {
          duration: DUR.reveal,
          stagger: 0.035,
        },
      ),
      ...animateFrom(
        root.querySelectorAll(".project-tile-3d"),
        { scale: "0.9" },
        {
          duration: DUR.reveal,
          stagger: 0.035,
        },
      ),
    ];
    return () => anims.forEach((a) => a.cancel());
  }, [activeCategory]);

  /** A category switch also swings the orbit forward a step, so the change reads as motion. */
  const stepOrbitForCategory = () => {
    if (window.innerWidth <= 768 || prefersReducedMotion()) return;
    setIsStepping(true);
    turnTo(baseAngle() + 28, true);
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
        seekOrbit();
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
  }, [isRotating, isHovered, isStepping, isMobile, idle, seekOrbit]);

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
      const from = baseAngle();
      turnTo(direction === "left" ? from - step : from + step, !prefersReducedMotion());

      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = setTimeout(() => {
        setIsStepping(false);
      }, 580);
    },
    [displayProjects.length, quantity, turnTo, baseAngle],
  );

  /** Turn the orbit the short way until this tile faces the viewer (keyboard focus). */
  const bringToFront = (index: number) => {
    if (isMobile) return;
    const target = -(index * 360) / quantity;
    const from = baseAngle();
    const delta = ((((target - from) % 360) + 540) % 360) - 180;
    if (Math.abs(delta) < 0.5) return;
    const reduced = prefersReducedMotion();
    turnTo(from + delta, !reduced);
    if (reduced) return;
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
    // The stage covers the orbit, so this tile never gets its mouseleave or
    // blur. Clear the hover pause now, or the orbit stays stopped on return.
    setIsHovered(false);
    setHoveredId(null);
    const mediaBox = cardElement?.querySelector(".tile-media-wrapper") as HTMLElement | null;
    const rect = (mediaBox ?? cardElement)?.getBoundingClientRect() ?? null;
    onSelectProject(project, rect);
  };

  return (
    <div ref={wrapperRef} className="project-showcase-wrapper w-full flex flex-col items-center">
      {/* Chapter 01 Narrative Cue: sweeps in through ASCII, like the banner. */}
      <PageLoadSweep className="w-full" when="visible" replay transparent background="#03060f">
        <div className="chapter-orbital-header w-full flex flex-col items-center sm:items-start gap-1.5 mb-1 px-1">
          <p className="chapter-kicker m-0 inline-flex items-center gap-2">
            <Orbit size={14} className="text-accent" aria-hidden="true" />
            <span data-act-kicker="0">ACT I // ORBIT</span>
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
      </PageLoadSweep>

      <div className="banner" style={{ "--quantity": quantity } as React.CSSProperties}>
        <Earth3D reverse={true} size={650} paused={idle} />

        <div
          ref={sliderRef}
          className={`slider ${!isRotating ? "paused-rotation" : ""}`}
          onScroll={handleSliderScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          // The orbit's turn is drawn by the animations in orbitAnimsRef.
        >
          {displayProjects.map((project, index) => {
            const isCardActive = isMobile ? index === safeMobileIndex : hoveredId === project.id;
            return (
              <div
                key={project.id}
                role="button"
                tabIndex={0}
                aria-label={`${project.name}: open project details`}
                data-project-tile={project.id}
                className={`item ${index === safeMobileIndex ? "active-tile" : ""} ${!isMobile && hoveredId === project.id ? "is-engaged" : ""}`}
                style={{ "--position": index + 1 } as React.CSSProperties}
                onClick={(e) => handleCardActivate(project, index, e.currentTarget)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardActivate(project, index, e.currentTarget);
                  }
                }}
                // Hover engages on a real pointer move, not on mouseenter: the orbit
                // carries tiles under a still cursor, and that must not stop it.
                onMouseMove={(e) => {
                  if (hoveredId === project.id) return;
                  if (e.movementX === 0 && e.movementY === 0) return;
                  setIsHovered(true);
                  setHoveredId(project.id);
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setHoveredId((prev) => (prev === project.id ? null : prev));
                }}
                onFocus={(e) => {
                  // Only Tab navigation pauses and turns the orbit. Focus returned
                  // to this tile after a project closes must not hold the spin.
                  if (performance.now() - lastTabAt > TAB_FOCUS_WINDOW_MS) return;
                  setIsHovered(true);
                  setHoveredId(project.id);
                  bringToFront(index);
                  // Phones scroll the orbit as a snapping row instead of rotating
                  // it, and the snap can leave a Tab-focused tile half off-screen.
                  if (isMobile) {
                    e.currentTarget.scrollIntoView({
                      inline: "center",
                      block: "nearest",
                      behavior: prefersReducedMotion() ? "auto" : "smooth",
                    });
                  }
                }}
                onBlur={() => {
                  setIsHovered(false);
                  setHoveredId((prev) => (prev === project.id ? null : prev));
                }}
              >
                <div className="carousel-card project-tile-3d">
                  <div className="tile-media-wrapper">
                    <CardMediaPreview
                      project={project}
                      isActive={isCardActive}
                      enableShader={false}
                      compact
                    />
                    <div className="tile-overlay-glow" />
                  </div>

                  <div className="tile-info">
                    <span className="tile-category-tag">{project.category}</span>
                    <h3 className="tile-title truncate">{project.name}</h3>
                    <InspectHint active={isCardActive && !isMobile} />
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
        <PixelButton
          variant="secondary"
          size="icon"
          onClick={() => handleRotate("left")}
          title="Previous system"
          aria-label="Previous system"
        >
          <ChevronLeft
            size={18}
            className="pixel-btn__chevron pixel-btn__chevron--prev"
            aria-hidden="true"
          />
        </PixelButton>

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

        <PixelButton
          variant="secondary"
          size="icon"
          onClick={() => handleRotate("right")}
          title="Next system"
          aria-label="Next system"
        >
          <ChevronRight
            size={18}
            className="pixel-btn__chevron pixel-btn__chevron--next"
            aria-hidden="true"
          />
        </PixelButton>
      </div>
    </div>
  );
};

export default ProjectCarousel;
