import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { animateFrom, cssEase, DUR, EASE } from "../lib/motion";
import { afterActsSettle } from "../lib/useActStack";
import PixelButton from "./fx/PixelButton";
import CloseGlyph from "./fx/CloseGlyph";
import { ASCIIFY_SPEC, GLYPH_RAIN_SPEC } from "./canvasui/spec";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GitFork,
  Hash,
  Sparkles,
  Star,
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
  /** Stepping between projects; omitted where a step would move the stage away (the index). */
  onPrev?: () => void;
  onNext?: () => void;
  onSelectTopic?: (topic: string) => void;
  /** Increment to close with the exit motion from outside (for example, re-clicking the card). */
  closeRequest?: number;
  /**
   * The control that takes focus when this stage mounts: the close X on open,
   * or prev / next when a step remounts the stage (an index stage moves to the
   * row of the project it steps to), so repeated Enter keeps stepping.
   */
  initialFocus?: "close" | "prev" | "next";
}

const ProjectStage: React.FC<ProjectStageProps> = ({
  project,
  originRect,
  currentIndex,
  totalCount,
  onClose,
  onPrev,
  onNext,
  onSelectTopic,
  closeRequest = 0,
  initialFocus = "close",
}) => {
  const stageRef = useRef<HTMLElement>(null);
  const mediaFrameRef = useRef<HTMLDivElement>(null);
  const dossierRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLElement>(null);
  const prevBtnRef = useRef<HTMLElement>(null);
  const nextBtnRef = useRef<HTMLElement>(null);
  const prevProjectIdRef = useRef<string | null>(null);
  const initialTornDownRef = useRef<boolean>(false);
  const seenCloseRef = useRef(closeRequest);
  const stepDirectionRef = useRef<1 | -1>(1);
  const isClosingRef = useRef<boolean>(false);

  const [reducedMotion] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  /** Exit motion, then `after` (defaults to onClose). Topic chips pass their own continuation. */
  const requestClose = useCallback(
    (after?: () => void) => {
      const done = after ?? onClose;
      if (isClosingRef.current) return;
      if (reducedMotion || !stageRef.current) {
        done();
        return;
      }
      isClosingRef.current = true;
      // From wherever the stage is (an open still settling included) to gone.
      const exit = stageRef.current.animate(
        [{ opacity: 0, transform: "translateY(-10px) scale(0.98)", offset: 1 }],
        { duration: DUR.ui * 1000, easing: cssEase(EASE.in), fill: "forwards" },
      );
      exit.onfinish = () => {
        isClosingRef.current = false;
        done();
      };
    },
    [onClose, reducedMotion],
  );

  const canStep = Boolean(onPrev && onNext);

  const handleStepPrev = useCallback(() => {
    if (isClosingRef.current || !onPrev) return;
    stepDirectionRef.current = -1;
    onPrev();
  }, [onPrev]);

  const handleStepNext = useCallback(() => {
    if (isClosingRef.current || !onNext) return;
    stepDirectionRef.current = 1;
    onNext();
  }, [onNext]);

  // Keyboard navigation: Escape closes smoothly, Left/Right steps across projects
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Never steal keys from text fields (the archive search sits beside the stage).
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
      } else if (canStep && event.key === "ArrowLeft") {
        event.preventDefault();
        handleStepPrev();
      } else if (canStep && event.key === "ArrowRight") {
        event.preventDefault();
        handleStepNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [requestClose, handleStepPrev, handleStepNext, canStep]);

  // Focus lands on the close X when the stage opens. Stepping keeps focus where
  // it is; if a step remounts the stage, focus returns to the step control.
  useEffect(() => {
    const target =
      initialFocus === "prev" ? prevBtnRef : initialFocus === "next" ? nextBtnRef : closeBtnRef;
    target.current?.focus({ preventScroll: true });
    // Mount only: later steps keep the user's focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smooth viewport alignment when the stage mounts or steps. It waits for the
  // refresh that the stage's height change causes, which would otherwise
  // cancel a smooth scroll already under way.
  useEffect(
    () =>
      afterActsSettle(() => {
        const stageEl = stageRef.current;
        if (!stageEl) return;
        const rect = stageEl.getBoundingClientRect();
        const outOfView = rect.top < 72 || rect.bottom > window.innerHeight + 60;
        if (outOfView) {
          window.scrollTo({
            top: Math.max(0, window.scrollY + rect.top - 96),
            behavior: reducedMotion ? "auto" : "smooth",
          });
        }
      }),
    [project.id, reducedMotion],
  );

  // FLIP growth on initial open + directional choreography when stepping projects
  useLayoutEffect(() => {
    // The open FLIP plays once per mount. Under StrictMode the effect is torn
    // down and re-run for the same project, which must still count as the open.
    const isInitialOpen =
      prevProjectIdRef.current === null ||
      (initialTornDownRef.current && prevProjectIdRef.current === project.id);
    prevProjectIdRef.current = project.id;
    initialTornDownRef.current = false;

    if (reducedMotion) return;
    const mediaEl = mediaFrameRef.current;
    const dossierEl = dossierRef.current;
    const stageEl = stageRef.current;
    if (!mediaEl || !dossierEl || !stageEl) return;

    // Web Animations, not GSAP tweens: these elements carry the media, the
    // notches and the dossier, and a per-frame inline style write on them
    // restyles their subtrees under an ad blocker's injected stylesheet.
    const topLeftNotch = mediaEl.querySelector(".notch-top-left");
    const bottomRightNotch = mediaEl.querySelector(".notch-bottom-right");
    const mediaAsset = mediaEl.querySelector(".notched-media-asset");
    const items = dossierEl.querySelectorAll(".stage-stagger-item");
    const anims: Animation[] = [];

    if (isInitialOpen) {
      anims.push(...animateFrom(stageEl, { opacity: 0.92 }, { duration: DUR.ui }));

      if (originRect && originRect.width > 20 && originRect.height > 20) {
        const dest = mediaEl.getBoundingClientRect();
        const dx = originRect.left + originRect.width / 2 - (dest.left + dest.width / 2);
        const dy = originRect.top + originRect.height / 2 - (dest.top + dest.height / 2);
        const sx = Math.min(1, Math.max(0.28, originRect.width / Math.max(dest.width, 1)));
        const sy = Math.min(1, Math.max(0.28, originRect.height / Math.max(dest.height, 1)));
        const y = Math.max(-260, Math.min(260, dy));
        anims.push(
          ...animateFrom(
            mediaEl,
            { transform: `translate(${dx}px, ${y}px) scale(${sx}, ${sy})`, opacity: 0.72 },
            { duration: DUR.hero },
          ),
        );
      } else {
        anims.push(
          ...animateFrom(
            mediaEl,
            { transform: "translateX(-24px) scale(0.96)", opacity: 0 },
            { duration: DUR.reveal },
          ),
        );
      }

      anims.push(
        ...animateFrom(
          topLeftNotch,
          { transform: "translate(-16px, -16px)", opacity: 0 },
          { duration: DUR.reveal, delay: 0.14 },
        ),
        ...animateFrom(
          bottomRightNotch,
          { transform: "translate(16px, 16px)", opacity: 0 },
          { duration: DUR.reveal, delay: 0.18 },
        ),
        ...animateFrom(
          items,
          { opacity: 0, transform: "translateX(22px)" },
          { duration: DUR.reveal, stagger: 0.055, delay: 0.12 },
        ),
      );
    } else {
      const dir = stepDirectionRef.current;
      anims.push(
        ...animateFrom(
          mediaAsset,
          { opacity: 0.32, transform: `translateX(${dir * 20}px) scale(1.04)` },
          { duration: DUR.ui },
        ),
        ...animateFrom(
          topLeftNotch,
          { transform: "translateX(-10px)", opacity: 0.45 },
          { duration: DUR.ui },
        ),
        ...animateFrom(
          bottomRightNotch,
          { transform: "translateX(10px)", opacity: 0.45 },
          { duration: DUR.ui },
        ),
        ...animateFrom(
          items,
          { opacity: 0, transform: `translateX(${dir * 20}px)` },
          { duration: DUR.ui, stagger: 0.04 },
        ),
      );
    }

    return () => {
      if (isInitialOpen) initialTornDownRef.current = true;
      anims.forEach((a) => a.cancel());
    };
  }, [project.id, originRect, reducedMotion]);

  // An outside close request (re-clicking the open card) still gets the exit motion.
  useEffect(() => {
    // Only react to requests made after this instance mounted; a new stage must
    // never close itself because of an earlier request.
    if (closeRequest === seenCloseRef.current) return;
    seenCloseRef.current = closeRequest;
    requestClose();
  }, [closeRequest, requestClose]);

  const formattedDate = formatProjectDate(project.updatedAt);

  return (
    <article
      ref={stageRef}
      className="project-stage-shell"
      aria-label={`${project.name} project details`}
    >
      {/* upgrades.md: GlyphRain "for when the user gets taken to the project info". The
          stage has no fixed height, so this mount keeps the overlay path. */}
      <GlyphRain className="w-full stage-rain" native={false} {...GLYPH_RAIN_SPEC}>
        <div className="project-stage-grid">
          {/* Left Column: Expanded Media with Diagonal Top-Left & Bottom-Right Notches */}
          <div ref={mediaFrameRef} className="notched-media-frame">
            <Asciify className="notched-media-canvas" {...ASCIIFY_SPEC}>
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

            {/* Bottom-Right Notch: Tech Stack */}
            <div className="media-notch notch-bottom-right">
              <span className="notch-eyebrow text-right">Tech Stack</span>
              <div className="flex flex-wrap justify-end gap-1.5">
                {project.techStack.slice(0, 4).map((tech) => (
                  <span key={tech} className="notch-stack-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Structured Metadata Tags, Description, Relocated Topics, and Controls */}
          <div ref={dossierRef} className="stage-dossier">
            <div className="flex flex-col gap-4">
              {/* Top Stage Navigation Bar: position, step, close. The X is the
                  only way out besides Esc, so it carries the focus on open. */}
              <div className="stage-stagger-item flex items-center justify-between gap-2">
                <span className="font-telemetry text-xs text-[var(--text-muted)] whitespace-nowrap">
                  {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(totalCount).padStart(2, "0")}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  {canStep && (
                    <>
                      <PixelButton
                        ref={prevBtnRef}
                        variant="secondary"
                        size="icon"
                        onClick={handleStepPrev}
                        aria-label="Previous project"
                        title="Previous project"
                      >
                        <ChevronLeft
                          size={18}
                          className="pixel-btn__chevron pixel-btn__chevron--prev"
                          aria-hidden="true"
                        />
                      </PixelButton>
                      <PixelButton
                        ref={nextBtnRef}
                        variant="secondary"
                        size="icon"
                        onClick={handleStepNext}
                        aria-label="Next project"
                        title="Next project"
                      >
                        <ChevronRight
                          size={18}
                          className="pixel-btn__chevron pixel-btn__chevron--next"
                          aria-hidden="true"
                        />
                      </PixelButton>
                    </>
                  )}
                  <PixelButton
                    ref={closeBtnRef}
                    variant="secondary"
                    size="icon"
                    danger
                    onClick={() => requestClose()}
                    aria-label="Close project view"
                    title="Close (Esc)"
                  >
                    <CloseGlyph size={18} />
                  </PixelButton>
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

              {/* Relocated Topics: Interactive Archive Filter Chips */}
              {project.topics.length > 0 && (
                <div className="stage-stagger-item dossier-topics-group">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Hash size={12} className="text-accent" />
                    <span className="dossier-topics-label">Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.topics.slice(0, 6).map((topic) =>
                      onSelectTopic ? (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => requestClose(() => onSelectTopic(topic))}
                          className="dossier-topic-chip is-interactive"
                          title={`Show every project tagged #${topic}`}
                        >
                          #{topic}
                        </button>
                      ) : (
                        <span key={topic} className="dossier-topic-chip">
                          #{topic}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Links and Shader Lens Hint */}
            <div className="stage-stagger-item flex flex-col gap-3 pt-2 border-t border-[var(--border-subtle)]">
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {project.liveUrl && (
                  <PixelButton
                    as="a"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="md"
                  >
                    <span>Open live build</span>
                    <ExternalLink size={16} className="pixel-btn__arrow" aria-hidden="true" />
                  </PixelButton>
                )}
                <PixelButton
                  as="a"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="md"
                >
                  <GithubIcon size={16} />
                  <span>View source</span>
                </PixelButton>
              </div>

              {/* The ASCII read follows a pointer, so touch screens skip the hint. */}
              <div className="hidden md:flex [@media(hover:none)]:hidden items-center gap-1.5 text-xs text-[var(--text-muted)] font-telemetry">
                <Sparkles size={12} className="text-accent shrink-0" />
                <span>Move across the image to read it in ASCII</span>
              </div>
            </div>
          </div>
        </div>
      </GlyphRain>
    </article>
  );
};

export default ProjectStage;
