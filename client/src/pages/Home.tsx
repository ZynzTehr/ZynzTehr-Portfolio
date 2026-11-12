import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatProjectDate, projects, type Project } from "../data/projects";
import DevHud from "../components/DevHud";
import ProjectCarousel from "../components/ProjectCarousel";
import ProjectStage from "../components/ProjectStage";
import CardMediaPreview from "../components/CardMediaPreview";
import ScrollWidget from "../components/ScrollWidget";
import Laser from "../components/canvasui/Laser";
import ParticleScroll from "../components/canvasui/ParticleScroll";
import { ExternalLink, Terminal, ArrowUpRight, Search } from "lucide-react";
import { GithubIcon } from "../components/Icon";

gsap.registerPlugin(ScrollTrigger);

interface SelectedStageState {
  project: Project;
  source: "carousel" | "grid";
  originRect: DOMRect | null;
}

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Recent");
  const [selectedStage, setSelectedStage] = useState<SelectedStageState | null>(null);
  const [hoveredGridId, setHoveredGridId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isGridRevealed, setIsGridRevealed] = useState<boolean>(false);
  const [gridColumns, setGridColumns] = useState<number>(() =>
    typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : 2,
  );

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const archiveTitleRef = useRef<HTMLDivElement>(null);
  const archiveSearchRef = useRef<HTMLDivElement>(null);
  const archivePromptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncCols = () => setGridColumns(window.innerWidth >= 1024 ? 3 : 2);
    window.addEventListener("resize", syncCols);
    return () => window.removeEventListener("resize", syncCols);
  }, []);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesCategory = activeCategory === "Recent" || p.category === activeCategory;
      if (!q) return matchesCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.language.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q)) ||
        p.topics.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Keep selected stage synchronized when filters change
  const activeStageProject = useMemo(() => {
    if (!selectedStage) return null;
    const exists = filteredProjects.find((p) => p.id === selectedStage.project.id);
    return exists ?? null;
  }, [filteredProjects, selectedStage]);

  const activeStageIndex = useMemo(() => {
    if (!activeStageProject) return 0;
    return Math.max(
      0,
      filteredProjects.findIndex((p) => p.id === activeStageProject.id),
    );
  }, [activeStageProject, filteredProjects]);

  const handleCloseStage = useCallback(() => {
    setSelectedStage(null);
  }, []);

  const handleStepStage = useCallback(
    (direction: -1 | 1) => {
      if (!selectedStage || filteredProjects.length === 0) return;
      const idx = filteredProjects.findIndex((p) => p.id === selectedStage.project.id);
      const nextIdx = (idx + direction + filteredProjects.length) % filteredProjects.length;
      setSelectedStage({
        project: filteredProjects[nextIdx],
        source: selectedStage.source,
        originRect: null,
      });
    },
    [filteredProjects, selectedStage],
  );

  // Archive Header Entrance Choreography
  useEffect(() => {
    const section = document.querySelector(".portfolio-catalog-section");
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (archiveTitleRef.current) {
      archiveTitleRef.current.style.opacity = "0";
      archiveTitleRef.current.style.transform = "translateX(-60px)";
    }
    if (archiveSearchRef.current) {
      archiveSearchRef.current.style.opacity = "0";
      archiveSearchRef.current.style.transform = "translateX(60px)";
    }
    if (archivePromptRef.current) {
      archivePromptRef.current.style.opacity = "0";
      archivePromptRef.current.style.transform = "translateY(36px)";
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect();
            if (archiveTitleRef.current) {
              gsap.to(archiveTitleRef.current, {
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
              });
            }
            if (archiveSearchRef.current) {
              gsap.to(archiveSearchRef.current, {
                x: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.12,
                ease: "power3.out",
              });
            }
            if (archivePromptRef.current) {
              gsap.to(archivePromptRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.72,
                delay: 0.25,
                ease: "power3.out",
              });
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // GSAP Card Reveal Choreography on Search Bar Unlock
  useEffect(() => {
    if (!isGridRevealed || !gridContainerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    ScrollTrigger.getAll().forEach((st) => st.kill());

    const ctx = gsap.context(() => {
      const cardElements =
        gridContainerRef.current?.querySelectorAll<HTMLElement>(".project-card-col");
      if (!cardElements || cardElements.length === 0) return;

      const cardsArray = Array.from(cardElements);
      const firstBatch = cardsArray.slice(0, gridColumns);
      const remaining = cardsArray.slice(gridColumns);

      if (remaining.length > 0) {
        gsap.set(remaining, { opacity: 0, y: 44, scale: 0.96 });
      }

      gsap.fromTo(
        firstBatch,
        { opacity: 0, y: 44, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
        },
      );

      if (remaining.length > 0) {
        ScrollTrigger.batch(remaining, {
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              stagger: 0.1,
              ease: "power3.out",
              overwrite: "auto",
            });
          },
          start: "top 92%",
          once: true,
        });
      }

      ScrollTrigger.refresh();
    }, gridContainerRef);

    return () => ctx.revert();
  }, [isGridRevealed, filteredProjects, gridColumns]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedStage(null);

    if (isGridRevealed && gridContainerRef.current) {
      const cardElements =
        gridContainerRef.current.querySelectorAll<HTMLElement>(".project-card-col");

      if (cardElements && cardElements.length > 0) {
        gsap.to(cardElements, {
          opacity: 0,
          y: 32,
          scale: 0.96,
          duration: 0.3,
          stagger: { each: 0.025, from: "end" },
          ease: "power2.in",
          onComplete: () => {
            setIsGridRevealed(false);
            setSearchQuery("");
          },
        });
      } else {
        setIsGridRevealed(false);
        setSearchQuery("");
      }
    }
  };

  const handleScrollDown = () => {
    window.scrollTo({ top: 480, behavior: "smooth" });
  };

  const unlockArchive = () => {
    setIsGridRevealed(true);
    document.getElementById("archive-search-input")?.focus();
  };

  // Compute the row start index where the inline split-stage inserts in the archive grid
  const inlineGridStageRowStart = useMemo(() => {
    if (!activeStageProject || selectedStage?.source !== "grid") return -1;
    return Math.floor(activeStageIndex / gridColumns) * gridColumns;
  }, [activeStageIndex, activeStageProject, gridColumns, selectedStage?.source]);

  return (
    <section className="portfolio-home-container w-full flex flex-col items-center">
      <DevHud projectCount={projects.length} />

      <ScrollWidget onBackToTop={handleBackToTop} onScrollDown={handleScrollDown} />

      {/* Top Showcase Slot: Inline Split-Stage when opened from Carousel, otherwise 3D Orbit */}
      <div className="w-full my-2">
        {activeStageProject && selectedStage?.source === "carousel" ? (
          <div className="mb-8">
            <ProjectStage
              project={activeStageProject}
              originRect={selectedStage.originRect}
              currentIndex={activeStageIndex}
              totalCount={filteredProjects.length}
              onClose={handleCloseStage}
              onPrev={() => handleStepStage(-1)}
              onNext={() => handleStepStage(1)}
            />
          </div>
        ) : (
          <ProjectCarousel
            projects={filteredProjects}
            onSelectProject={(project, originRect) =>
              setSelectedStage({ project, source: "carousel", originRect })
            }
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setSelectedStage(null);
              setActiveCategory(cat);
            }}
          />
        )}
      </div>

      {/* Repository Archive Section */}
      <div className="portfolio-catalog-section w-full mt-10 pt-6 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div ref={archiveTitleRef}>
            <h2 className="text-xl md:text-2xl font-bold leading-tight text-gradient font-display m-0 flex items-center gap-2">
              <Terminal size={20} className="text-accent" />
              Repository Archive
            </h2>
            <p className="text-[var(--text-secondary)] text-sm m-0 mt-1">
              Browse {filteredProjects.length} open-source repositories and live deployments
            </p>
          </div>

          <div
            ref={archiveSearchRef}
            className="search-bar-wrapper"
            onClick={() => setIsGridRevealed(true)}
          >
            <div className={`floating-search-field ${searchQuery ? "has-value" : ""}`}>
              <input
                type="text"
                id="archive-search-input"
                className="floating-search-input"
                value={searchQuery}
                onFocus={() => setIsGridRevealed(true)}
                onClick={() => setIsGridRevealed(true)}
                onChange={(e) => {
                  setIsGridRevealed(true);
                  setSearchQuery(e.target.value);
                }}
                placeholder=" "
                autoComplete="off"
              />
              <label htmlFor="archive-search-input" className="floating-search-label">
                Search projects, stack, or topics...
              </label>
              <Search size={15} className="search-icon-hint" />
            </div>
          </div>
        </div>

        {!isGridRevealed ? (
          <div
            ref={archivePromptRef}
            role="button"
            tabIndex={0}
            className="archive-locked-prompt text-center py-12 my-4 flex flex-col items-center justify-center"
            onClick={unlockArchive}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                unlockArchive();
              }
            }}
          >
            <div className="pulse-search-badge mb-4">
              <Search size={22} className="text-accent" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-[var(--text-primary)] font-display mb-2">
              Click Search Bar to Unlock Repository Archive
            </h3>
            <p className="text-[var(--text-secondary)] text-sm m-0 max-w-[440px] leading-relaxed">
              Focus the search input above to ignite the laser horizon and materialize all{" "}
              {projects.length} repositories.
            </p>
          </div>
        ) : (
          <ParticleScroll
            className="w-full"
            point={0.76}
            band={340}
            density={3}
            size={1.35}
            spread={175}
            gravity={0.32}
            drift={0.65}
            swirl={46}
            stagger={0.65}
            fade={0.85}
            settle={1.05}
            smoothing={0.5}
          >
            <div
              ref={gridContainerRef}
              className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 archive-cards-grid"
            >
              {filteredProjects.map((project, index) => {
                const isCardHovered = hoveredGridId === project.id;
                const isCardSelected =
                  activeStageProject?.id === project.id && selectedStage?.source === "grid";

                return (
                  <React.Fragment key={project.id}>
                    {index === inlineGridStageRowStart && activeStageProject && (
                      <div className="col-span-2 lg:col-span-3 my-1">
                        <ProjectStage
                          project={activeStageProject}
                          originRect={selectedStage?.originRect}
                          currentIndex={activeStageIndex}
                          totalCount={filteredProjects.length}
                          onClose={handleCloseStage}
                          onPrev={() => handleStepStage(-1)}
                          onNext={() => handleStepStage(1)}
                        />
                      </div>
                    )}

                    <div className="project-card-col min-w-0">
                      <div
                        role="button"
                        tabIndex={0}
                        aria-expanded={isCardSelected}
                        className={`project-grid-card h-full ${isCardSelected ? "is-selected" : ""}`}
                        onMouseEnter={() => setHoveredGridId(project.id)}
                        onMouseLeave={() =>
                          setHoveredGridId((prev) => (prev === project.id ? null : prev))
                        }
                        onFocus={() => setHoveredGridId(project.id)}
                        onBlur={() =>
                          setHoveredGridId((prev) => (prev === project.id ? null : prev))
                        }
                        onClick={(e) => {
                          if (isCardSelected) {
                            handleCloseStage();
                            return;
                          }
                          const mediaBox = e.currentTarget.querySelector(
                            ".grid-card-media",
                          ) as HTMLElement | null;
                          const rect =
                            (mediaBox ?? e.currentTarget).getBoundingClientRect() ?? null;
                          setSelectedStage({ project, source: "grid", originRect: rect });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (isCardSelected) {
                              handleCloseStage();
                              return;
                            }
                            const mediaBox = e.currentTarget.querySelector(
                              ".grid-card-media",
                            ) as HTMLElement | null;
                            const rect =
                              (mediaBox ?? e.currentTarget).getBoundingClientRect() ?? null;
                            setSelectedStage({ project, source: "grid", originRect: rect });
                          }
                        }}
                      >
                        <div className="grid-card-media relative">
                          <CardMediaPreview
                            project={project}
                            isActive={isCardHovered || isCardSelected}
                            enableShader={isCardHovered && !activeStageProject}
                          />
                          <span className="grid-category-badge">{project.category}</span>
                        </div>

                        <div className="grid-card-body p-3 md:p-6 flex flex-col justify-between grow">
                          <div>
                            <div className="flex justify-between items-start mb-1.5 md:mb-2">
                              <h3 className="text-xs md:text-lg font-bold leading-snug text-[var(--text-primary)] font-display m-0 truncate">
                                {project.name}
                              </h3>
                              <ArrowUpRight size={17} className="text-accent shrink-0 ml-2" />
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
                                    className="text-accent link-hover p-1.5"
                                    onClick={(e) => e.stopPropagation()}
                                    title="Live Demo"
                                    aria-label={`${project.name} live demo`}
                                  >
                                    <ExternalLink size={15} />
                                  </a>
                                )}
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[var(--text-primary)] link-hover p-1.5"
                                  onClick={(e) => e.stopPropagation()}
                                  title="GitHub Source"
                                  aria-label={`${project.name} source code`}
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

      {/* Viewport-Bottom Cobalt Laser Horizon Active While Archive Cards Are Unlocked */}
      {isGridRevealed && (
        <div className="archive-laser-horizon" aria-hidden="true">
          <Laser
            className="w-full h-full"
            offset={30}
            wave={8}
            width={0.92}
            thickness={3}
            core={1.45}
            radius={48}
            glow={1.65}
            color={[0.051, 0.349, 1]}
            speed={1.05}
            flicker={0.28}
            reactivity={0.85}
            reveal={120}
            heat={0.35}
            shimmer={4}
            sparkle={0.55}
          >
            <div className="max-w-[1320px] mx-auto w-full h-full px-4 md:px-6" />
          </Laser>
        </div>
      )}
    </section>
  );
};

export default Home;
