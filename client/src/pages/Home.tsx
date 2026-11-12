import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, Globe, Hash, RotateCcw, Search, X } from "lucide-react";
import { formatProjectDate, projects, type Project } from "../data/projects";
import DevHud from "../components/DevHud";
import ProjectCarousel from "../components/ProjectCarousel";
import ProjectStage from "../components/ProjectStage";
import CardMediaPreview from "../components/CardMediaPreview";
import ScrollWidget from "../components/ScrollWidget";
import BrandMark from "../components/BrandMark";
import PixelButton from "../components/fx/PixelButton";
import Laser from "../components/canvasui/Laser";
import ParticleScroll from "../components/canvasui/ParticleScroll";
import Ripple from "../components/canvasui/Ripple";
import { LASER_SPEC, PARTICLE_SCROLL_SPEC, RIPPLE_SPEC } from "../components/canvasui/spec";
import { GithubIcon } from "../components/Icon";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { DUR, EASE } from "../lib/motion";
import { prefersReducedMotion, useReducedMotion } from "../lib/useReducedMotion";

/**
 * Act I (Orbit), Act II (Index) and Act III (Transmission).
 *
 * Index follows upgrades.md: activating the search reveals the cards; the
 * Laser sits at the bottom of the viewport and the cards print in out of it
 * (a fallback mask hides everything below the beam, so content only exists
 * above the line), and ParticleScroll reassembles them from sand as they
 * cross its configured line.
 */

interface StageState {
  project: Project;
  source: "carousel" | "grid";
  originRect: DOMRect | null;
}

const LIVE_COUNT = projects.filter((p) => Boolean(p.liveUrl)).length;
const SEARCH_DEBOUNCE_MS = 120;

/** Rectangular sapphire mask reveal for headings (the site's heading grammar). */
function useMaskReveal(scope: React.RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>(".mask-reveal").forEach((el) => {
        const text = el.querySelector(".mask-reveal__text");
        const block = el.querySelector(".mask-reveal__block");
        if (!text || !block) return;
        gsap.set(text, { opacity: 0 });
        gsap.set(block, { scaleX: 0, transformOrigin: "left center" });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
        tl.to(block, { scaleX: 1, duration: DUR.ui, ease: EASE.inOut })
          .set(text, { opacity: 1 })
          .set(block, { transformOrigin: "right center" })
          .to(block, { scaleX: 0, duration: DUR.ui, ease: EASE.inOut });
      });
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const MaskHeading: React.FC<{
  as?: "h2" | "h3";
  className?: string;
  children: React.ReactNode;
}> = ({ as: Tag = "h2", className, children }) => (
  <Tag className={className}>
    <span className="mask-reveal">
      <span className="mask-reveal__text">{children}</span>
      <span className="mask-reveal__block" aria-hidden="true" />
    </span>
  </Tag>
);

const Home: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>("Recent");
  const [stage, setStage] = useState<StageState | null>(null);
  const [closeRequest, setCloseRequest] = useState(0);
  const [hoveredGridId, setHoveredGridId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [isGridRevealed, setIsGridRevealed] = useState<boolean>(false);
  const [laserOn, setLaserOn] = useState<boolean>(false);
  const [gridColumns, setGridColumns] = useState<number>(() =>
    typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : 2,
  );

  const homeRef = useRef<HTMLElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const codaRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastOpenedIdRef = useRef<string | null>(null);

  useEffect(() => {
    const syncCols = () => setGridColumns(window.innerWidth >= 1024 ? 3 : 2);
    window.addEventListener("resize", syncCols);
    return () => window.removeEventListener("resize", syncCols);
  }, []);

  // Debounced search: the input stays instant, the index re-filters once typing pauses.
  useEffect(() => {
    const t = window.setTimeout(() => setSearchQuery(searchInput), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  // The orbit follows the category only, so searching the index never empties the orbit.
  const orbitProjects = useMemo(
    () => projects.filter((p) => activeCategory === "Recent" || p.category === activeCategory),
    [activeCategory],
  );

  const indexProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orbitProjects.filter((p) => {
      if (activeTopic && !p.topics.includes(activeTopic)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.language.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q)) ||
        p.topics.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [orbitProjects, searchQuery, activeTopic]);

  const stageList = stage?.source === "carousel" ? orbitProjects.slice(0, 10) : indexProjects;
  const stageProject = stage ? (stageList.find((p) => p.id === stage.project.id) ?? null) : null;
  const stageIndex = stageProject ? stageList.findIndex((p) => p.id === stageProject.id) : 0;

  const focusOrigin = useCallback(() => {
    const id = lastOpenedIdRef.current;
    if (!id) return;
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(
        `[data-project-card="${id}"], [data-project-tile="${id}"]`,
      );
      el?.focus({ preventScroll: true });
    });
  }, []);

  const openStage = useCallback(
    (project: Project, source: StageState["source"], rect: DOMRect | null) => {
      lastOpenedIdRef.current = project.id;
      setStage({ project, source, originRect: rect });
    },
    [],
  );

  const handleCloseStage = useCallback(() => {
    setStage(null);
    focusOrigin();
  }, [focusOrigin]);

  const handleStepStage = useCallback(
    (direction: -1 | 1) => {
      if (!stage || stageList.length === 0) return;
      const idx = stageList.findIndex((p) => p.id === stage.project.id);
      const next = stageList[(idx + direction + stageList.length) % stageList.length];
      lastOpenedIdRef.current = next.id;
      setStage({ project: next, source: stage.source, originRect: null });
    },
    [stage, stageList],
  );

  const revealIndex = useCallback(() => setIsGridRevealed(true), []);

  const handleSelectTopic = useCallback((topic: string) => {
    setActiveTopic(topic);
    setSearchInput("");
    setSearchQuery("");
    setStage(null);
    setIsGridRevealed(true);
    requestAnimationFrame(() => {
      catalogRef.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    });
  }, []);

  const resetFilters = useCallback(() => {
    setSearchInput("");
    setSearchQuery("");
    setActiveTopic(null);
    setActiveCategory("Recent");
  }, []);

  const openIndexFromPrompt = () => {
    setIsGridRevealed(true);
    requestAnimationFrame(() => searchInputRef.current?.focus({ preventScroll: true }));
  };

  // The laser burns only while the index is open and on screen, so the
  // footer and the coda are never hidden behind its mask.
  useEffect(() => {
    if (!isGridRevealed || !catalogRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: catalogRef.current,
      start: "top bottom",
      end: `bottom bottom-=${LASER_SPEC.offset}`,
      onToggle: (self) => setLaserOn(self.isActive),
    });
    const frame = requestAnimationFrame(() => setLaserOn(trigger.isActive));
    return () => {
      cancelAnimationFrame(frame);
      trigger.kill();
    };
  }, [isGridRevealed]);

  useEffect(() => {
    if (isGridRevealed) ScrollTrigger.refresh();
  }, [isGridRevealed, indexProjects.length, stageProject?.id]);

  useMaskReveal(homeRef, []);

  // Act III: the transmission settles in and its numbers count up once.
  useLayoutEffect(() => {
    const coda = codaRef.current;
    if (!coda || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".coda-stagger", {
        opacity: 0,
        y: 28,
        duration: DUR.reveal,
        stagger: 0.08,
        ease: EASE.out,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: coda, start: "top 82%", once: true },
      });
      gsap.from(".coda-mark", {
        opacity: 0,
        scale: 0.4,
        rotate: -50,
        duration: DUR.hero,
        ease: EASE.out,
        scrollTrigger: { trigger: coda, start: "top 82%", once: true },
      });
      coda.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const obj = { v: 0 };
        el.textContent = "0";
        gsap.to(obj, {
          v: target,
          duration: DUR.hero * 1.4,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
          scrollTrigger: { trigger: coda, start: "top 82%", once: true },
        });
      });
    }, coda);
    return () => ctx.revert();
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const inlineStageRowStart = useMemo(() => {
    if (!stageProject || stage?.source !== "grid") return -1;
    return Math.floor(stageIndex / gridColumns) * gridColumns;
  }, [stageIndex, stageProject, gridColumns, stage?.source]);

  const hasActiveFilter =
    Boolean(searchQuery.trim()) || activeCategory !== "Recent" || Boolean(activeTopic);

  const activateCard = (project: Project, target: HTMLElement) => {
    const isSelected = stageProject?.id === project.id && stage?.source === "grid";
    if (isSelected) {
      setCloseRequest((n) => n + 1);
      return;
    }
    const mediaBox = target.querySelector<HTMLElement>(".grid-card-media");
    openStage(project, "grid", (mediaBox ?? target).getBoundingClientRect());
  };

  const renderStage = (source: StageState["source"]) =>
    stageProject && stage?.source === source ? (
      <ProjectStage
        key={source}
        project={stageProject}
        originRect={stage.originRect}
        currentIndex={stageIndex}
        totalCount={stageList.length}
        onClose={handleCloseStage}
        onPrev={() => handleStepStage(-1)}
        onNext={() => handleStepStage(1)}
        onSelectTopic={handleSelectTopic}
        closeRequest={closeRequest}
      />
    ) : null;

  return (
    <section ref={homeRef} className="portfolio-home-container w-full flex flex-col items-center">
      <DevHud projectCount={projects.length} />

      <ScrollWidget onBackToTop={handleBackToTop} />

      {/* Act I: Orbit */}
      <div className="w-full my-2" id="orbit">
        {renderStage("carousel")}
        {/* The orbit stays mounted while a project is open, so Back returns to the
            same orbit position without rebuilding the globe. */}
        <div hidden={Boolean(stageProject && stage?.source === "carousel")}>
          <ProjectCarousel
            projects={orbitProjects}
            paused={Boolean(stageProject && stage?.source === "carousel")}
            onSelectProject={(project, rect) => openStage(project, "carousel", rect)}
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setStage(null);
              setActiveCategory(cat);
            }}
          />
        </div>
      </div>

      {/* Act II: Index */}
      <div
        ref={catalogRef}
        id="index"
        className="portfolio-catalog-section w-full mt-10 pt-6 pb-10 border-t border-[var(--border-subtle)]"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-center md:text-left">
            <p className="chapter-kicker m-0 mb-1.5">ACT II // INDEX</p>
            <MaskHeading className="text-xl md:text-[1.7rem] font-bold leading-tight font-display m-0 text-[var(--text-primary)]">
              Every system, in one index
            </MaskHeading>
            <p className="text-[var(--text-secondary)] text-sm m-0 mt-1.5">
              <span className="tabular-nums">{indexProjects.length}</span> of {projects.length}{" "}
              open-source repositories, {LIVE_COUNT} running live
            </p>
          </div>

          <div className="search-bar-wrapper" onClick={revealIndex}>
            <div className={`floating-search-field ${searchInput ? "has-value" : ""}`}>
              <input
                ref={searchInputRef}
                type="search"
                id="archive-search-input"
                className="floating-search-input"
                value={searchInput}
                onFocus={revealIndex}
                onChange={(e) => {
                  setIsGridRevealed(true);
                  setSearchInput(e.target.value);
                }}
                placeholder=" "
                autoComplete="off"
                aria-controls="index-grid"
              />
              <label htmlFor="archive-search-input" className="floating-search-label">
                Search by name, stack or topic
              </label>
              {searchInput ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchInput("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="search-clear-btn"
                >
                  <X size={14} />
                </button>
              ) : (
                <Search size={15} className="search-icon-hint" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>

        {isGridRevealed && hasActiveFilter && (
          <div
            className="archive-filter-bar mb-5 flex flex-wrap items-center justify-between gap-2"
            role="status"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-telemetry text-[var(--text-secondary)]">
              <span>Showing</span>
              {activeCategory !== "Recent" && (
                <span className="filter-scope-pill">{activeCategory}</span>
              )}
              {activeTopic && (
                <span className="filter-scope-pill">
                  <Hash size={11} aria-hidden="true" />
                  {activeTopic}
                </span>
              )}
              {searchQuery.trim() && (
                <span className="filter-scope-pill">"{searchQuery.trim()}"</span>
              )}
              <span className="text-accent tabular-nums">{indexProjects.length} matched</span>
            </div>
            <PixelButton variant="secondary" size="sm" onClick={resetFilters}>
              <RotateCcw size={12} aria-hidden="true" />
              <span>Clear filters</span>
            </PixelButton>
          </div>
        )}

        {!isGridRevealed ? (
          <div className="archive-open-prompt text-center py-12 my-4 flex flex-col items-center justify-center gap-4">
            <MaskHeading
              as="h3"
              className="text-base md:text-lg font-semibold text-[var(--text-primary)] font-display m-0"
            >
              Open the full index
            </MaskHeading>
            <p className="text-[var(--text-secondary)] text-sm m-0 max-w-[460px] leading-relaxed">
              All {projects.length} systems, searchable by name, stack or topic. They print in out
              of the orbit line.
            </p>
            <PixelButton variant="primary" size="md" onClick={openIndexFromPrompt}>
              <Search size={16} aria-hidden="true" />
              <span>Open the index</span>
            </PixelButton>
          </div>
        ) : indexProjects.length === 0 ? (
          <div className="glass-card p-10 my-4 text-center flex flex-col items-center justify-center gap-3">
            <p className="m-0 font-display text-lg font-semibold text-[var(--text-primary)]">
              Nothing in the index matches{" "}
              {searchQuery.trim() ? `"${searchQuery.trim()}"` : "these filters"}
            </p>
            <p className="m-0 text-sm text-[var(--text-secondary)] max-w-[420px]">
              Clear the search or switch categories to bring every system back.
            </p>
            <PixelButton variant="secondary" size="md" onClick={resetFilters}>
              <RotateCcw size={15} aria-hidden="true" />
              <span>Show all {projects.length}</span>
            </PixelButton>
          </div>
        ) : (
          <ParticleScroll className="w-full" native={false} {...PARTICLE_SCROLL_SPEC}>
            <div
              id="index-grid"
              className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 archive-cards-grid"
            >
              {indexProjects.map((project, index) => {
                const isHovered = hoveredGridId === project.id;
                const isSelected = stageProject?.id === project.id && stage?.source === "grid";
                return (
                  <React.Fragment key={project.id}>
                    {index === inlineStageRowStart && (
                      <div className="col-span-2 lg:col-span-3 my-1">{renderStage("grid")}</div>
                    )}
                    <div className="project-card-col min-w-0">
                      <div
                        role="button"
                        tabIndex={0}
                        data-project-card={project.id}
                        aria-expanded={isSelected}
                        aria-label={`${project.name}: open project details`}
                        className={`project-grid-card h-full ${isSelected ? "is-selected" : ""}`}
                        onMouseEnter={() => setHoveredGridId(project.id)}
                        onMouseLeave={() =>
                          setHoveredGridId((prev) => (prev === project.id ? null : prev))
                        }
                        onFocus={() => setHoveredGridId(project.id)}
                        onBlur={() =>
                          setHoveredGridId((prev) => (prev === project.id ? null : prev))
                        }
                        onClick={(e) => activateCard(project, e.currentTarget)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            activateCard(project, e.currentTarget);
                          }
                        }}
                      >
                        <div className="grid-card-media relative">
                          <CardMediaPreview
                            project={project}
                            isActive={isHovered || isSelected}
                            enableShader={isHovered && !stageProject}
                          />
                          <span className="grid-category-badge">{project.category}</span>
                        </div>

                        <div className="grid-card-body p-3 md:p-6 flex flex-col justify-between grow">
                          <div>
                            <div className="flex justify-between items-start mb-1.5 md:mb-2">
                              <h3 className="text-xs md:text-lg font-bold leading-snug text-[var(--text-primary)] font-display m-0 truncate">
                                {project.name}
                              </h3>
                              <ArrowUpRight
                                size={17}
                                aria-hidden="true"
                                className="card-corner-arrow text-accent shrink-0 ml-2"
                              />
                            </div>
                            <p className="hidden md:line-clamp-3 text-[var(--text-secondary)] text-sm mb-4 leading-relaxed project-card-desc">
                              {project.description}
                            </p>
                          </div>

                          <div>
                            <div className="flex flex-wrap gap-1.5 mb-2.5 md:mb-4">
                              {project.techStack.slice(0, 3).map((tech) => (
                                <span key={tech} className="tech-pill-small">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <div className="card-footer-meta flex justify-between items-center pt-2 border-t border-[var(--border-subtle)] text-[0.65rem] md:text-xs">
                              <span className="text-[var(--text-muted)] font-telemetry">
                                {project.language} · {formatProjectDate(project.updatedAt)}
                              </span>
                              <div className="flex gap-1.5">
                                {project.liveUrl && (
                                  <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="card-icon-link text-accent"
                                    onClick={(e) => e.stopPropagation()}
                                    title="Open live build"
                                    aria-label={`${project.name}: open live build`}
                                  >
                                    <ExternalLink size={15} />
                                  </a>
                                )}
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="card-icon-link text-[var(--text-primary)]"
                                  onClick={(e) => e.stopPropagation()}
                                  title="View source"
                                  aria-label={`${project.name}: view source`}
                                >
                                  <GithubIcon size={15} />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </ParticleScroll>
        )}
      </div>

      {/* Act III: Transmission */}
      <section
        ref={codaRef}
        aria-labelledby="transmission-title"
        className="transmission w-full mt-2 mb-8"
      >
        <Ripple className="transmission__ripple" native={false} {...RIPPLE_SPEC}>
          <div className="transmission__inner glass-card">
            <div className="coda-ambient-beam" aria-hidden="true" />
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
              <div className="max-w-[680px]">
                <div className="coda-stagger flex items-center gap-3 mb-4">
                  <span className="coda-mark" aria-hidden="true">
                    <BrandMark size={44} />
                  </span>
                  <span className="chapter-kicker">ACT III // TRANSMISSION</span>
                </div>
                <h2
                  id="transmission-title"
                  className="coda-stagger font-display font-bold text-2xl md:text-[2.1rem] leading-[1.14] text-[var(--text-primary)] m-0 mb-3"
                >
                  Every system here started from a blank file and shipped.
                </h2>
                <p className="coda-stagger m-0 text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                  Custom GLSL shaders, full-stack TypeScript platforms and interactive 3D, built to
                  hold up when you read the source and to feel unmistakable when you use it.
                </p>
                <div className="coda-stagger grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                  <div className="coda-stat-tile">
                    <span className="coda-stat-tile__value" data-count={projects.length}>
                      {projects.length}
                    </span>
                    <span className="coda-stat-tile__label">Open-source repositories</span>
                  </div>
                  <div className="coda-stat-tile">
                    <span className="coda-stat-tile__value" data-count={LIVE_COUNT}>
                      {LIVE_COUNT}
                    </span>
                    <span className="coda-stat-tile__label">Live deployments</span>
                  </div>
                  <div className="coda-stat-tile">
                    <span className="coda-stat-tile__value coda-stat-tile__value--text">
                      TS · React · WebGL2
                    </span>
                    <span className="coda-stat-tile__label">Core stack</span>
                  </div>
                </div>
              </div>

              <div className="coda-stagger flex flex-wrap items-center gap-3 shrink-0">
                <PixelButton
                  as="a"
                  href="https://jorgebucio.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="md"
                >
                  <Globe size={16} aria-hidden="true" />
                  <span>Open profile hub</span>
                </PixelButton>
                <PixelButton
                  as="a"
                  href="https://github.com/ZynzTehr"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="md"
                >
                  <GithubIcon size={16} />
                  <span>Follow @ZynzTehr</span>
                </PixelButton>
              </div>
            </div>
          </div>
        </Ripple>
      </section>

      {/* upgrades.md: Laser at the bottom of the page while the index is open */}
      {isGridRevealed && (
        <div
          className={`archive-laser ${laserOn && isGridRevealed ? "is-on" : ""}`}
          aria-hidden="true"
        >
          <Laser className="w-full h-full" native={false} {...LASER_SPEC}>
            <div className="w-full h-full" />
          </Laser>
          <div className="archive-laser__mask" style={{ height: LASER_SPEC.offset }} />
        </div>
      )}
    </section>
  );
};

export default Home;
