import React, { useState, useMemo, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "../data/projects";
import DevHud from "../components/DevHud";
import ProjectCarousel from "../components/ProjectCarousel";
import ProjectModal from "../components/ProjectModal";
import MatrixRain from "../components/MatrixRain";
import ProjectArt from "../components/project-arts/ProjectArt";
import ScrollWidget from "../components/ScrollWidget";
import { ExternalLink, Terminal, ArrowUpRight, Search } from "lucide-react";
import { GithubIcon } from "../components/Icon";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Recent");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isGridRevealed, setIsGridRevealed] = useState<boolean>(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const archiveTitleRef = useRef<HTMLDivElement>(null);
  const archiveSearchRef = useRef<HTMLDivElement>(null);
  const archivePromptRef = useRef<HTMLDivElement>(null);

  // Filter projects by active category and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = activeCategory === "Recent" || p.category === activeCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Archive Section Scroll-Triggered Entrance Animations
  useEffect(() => {
    const section = document.querySelector(".portfolio-catalog-section");
    if (!section) return;

    // Immediately hide the elements before paint
    if (archiveTitleRef.current) {
      archiveTitleRef.current.style.opacity = "0";
      archiveTitleRef.current.style.transform = "translateX(-80px)";
    }
    if (archiveSearchRef.current) {
      archiveSearchRef.current.style.opacity = "0";
      archiveSearchRef.current.style.transform = "translateX(80px)";
    }
    if (archivePromptRef.current) {
      archivePromptRef.current.style.opacity = "0";
      archivePromptRef.current.style.transform = "translateY(50px)";
    }

    // Use IntersectionObserver for reliable viewport detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect();

            // Title: slide in from left
            if (archiveTitleRef.current) {
              gsap.to(archiveTitleRef.current, {
                x: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power3.out",
              });
            }

            // Search bar: slide in from right (staggered)
            if (archiveSearchRef.current) {
              gsap.to(archiveSearchRef.current, {
                x: 0,
                opacity: 1,
                duration: 0.9,
                delay: 0.15,
                ease: "power3.out",
              });
            }

            // Locked prompt: fade up from bottom (staggered)
            if (archivePromptRef.current) {
              gsap.to(archivePromptRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.35,
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

  // GSAP Stagger Animation Effect on Click-to-Reveal
  useEffect(() => {
    if (!isGridRevealed || !gridContainerRef.current) return;

    // Clean up stale ScrollTriggers
    ScrollTrigger.getAll().forEach((st) => st.kill());

    const ctx = gsap.context(() => {
      const cardElements =
        gridContainerRef.current?.querySelectorAll<HTMLElement>(".project-card-col");
      if (!cardElements || cardElements.length === 0) return;

      const cardsArray = Array.from(cardElements);
      const firstThree = cardsArray.slice(0, 3);
      const remaining = cardsArray.slice(3);

      // Set initial hidden transform on all remaining cards off-screen
      if (remaining.length > 0) {
        gsap.set(remaining, { opacity: 0, y: 60, scale: 0.94 });
      }

      // Stagger animate the first three cards immediately into place
      gsap.fromTo(
        firstThree,
        { opacity: 0, y: 60, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
        },
      );

      // Stagger remaining cards seamlessly as they scroll into viewport
      if (remaining.length > 0) {
        ScrollTrigger.batch(remaining, {
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: 0.15,
              ease: "power3.out",
              overwrite: "auto",
            });
          },
          start: "top 90%",
          once: true,
        });
      }

      ScrollTrigger.refresh();
    }, gridContainerRef);

    return () => ctx.revert();
  }, [isGridRevealed, filteredProjects]);

  // Handle Back to Top with Reverse Card Stagger Exit Animation
  const handleBackToTop = () => {
    // Smoothly scroll window to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (isGridRevealed && gridContainerRef.current) {
      const cardElements =
        gridContainerRef.current.querySelectorAll<HTMLElement>(".project-card-col");

      if (cardElements && cardElements.length > 0) {
        // Stagger away in reverse order (bottom to top / end to start)
        gsap.to(cardElements, {
          opacity: 0,
          y: 40,
          scale: 0.94,
          duration: 0.35,
          stagger: {
            each: 0.03,
            from: "end",
          },
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
    window.scrollTo({
      top: 480,
      behavior: "smooth",
    });
  };

  const unlockArchive = () => {
    setIsGridRevealed(true);
    document.getElementById("archive-search-input")?.focus();
  };

  return (
    <section className="portfolio-home-container w-full flex flex-col items-center">
      {/* Top Profile HUD */}
      <DevHud projectCount={projects.length} />

      {/* Interactive Scroll Down & Back to Top Widget with React SVG */}
      <ScrollWidget onBackToTop={handleBackToTop} onScrollDown={handleScrollDown} />

      {/* 3D Orbiting Earth & Interactive Carousel Showcase */}
      <div className="w-full my-2">
        <ProjectCarousel
          projects={filteredProjects}
          onSelectProject={setSelectedProject}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </div>

      {/* Complete Project Grid Showcase */}
      <div className="portfolio-catalog-section w-full mt-12 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div ref={archiveTitleRef}>
            <h2 className="text-xl md:text-2xl font-semibold leading-tight text-gradient font-orbitron m-0 flex items-center gap-2">
              <Terminal size={20} className="text-accent" />
              Repository Archive
            </h2>
            <p className="text-gradient text-sm m-0 mt-1 opacity-80">
              Explore {filteredProjects.length} open-source repositories & live builds
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
                Search projects or tags...
              </label>
              <Search size={15} className="search-icon-hint" />
            </div>
          </div>
        </div>

        {/* Conditional Archive Cards View */}
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
            <h3 className="text-base font-semibold text-white font-orbitron mb-2">
              Click Searchbar to Unlock Repository Archive
            </h3>
            <p className="text-slate-400 text-sm m-0 max-w-[420px] leading-relaxed">
              Select the searchbar above to initialize the matrix archive and reveal all{" "}
              {projects.length} repositories.
            </p>
          </div>
        ) : (
          <div
            ref={gridContainerRef}
            className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-6 archive-cards-grid"
          >
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-card-col min-w-0">
                <div
                  role="button"
                  tabIndex={0}
                  className="project-grid-card h-full"
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                >
                  {/* Media Thumbnail with Default Matrix Digital Rain & Hover SVG Transition */}
                  <div className="grid-card-media relative">
                    <div className="grid-card-default-media">
                      <MatrixRain color="#00ff41" fontSize={11} speed={30} />
                    </div>
                    <div className="grid-card-hover-art">
                      <ProjectArt projectId={project.id} projectName={project.name} />
                    </div>
                    <span className="grid-category-badge">{project.category}</span>
                  </div>

                  {/* Card Body */}
                  <div className="grid-card-body p-2.5 md:p-6 flex flex-col justify-between grow">
                    <div>
                      <div className="flex justify-between items-start mb-1.5 md:mb-2">
                        <h3 className="text-xs md:text-xl font-semibold leading-snug text-white font-orbitron m-0 truncate">
                          {project.name}
                        </h3>
                        <ArrowUpRight size={18} className="text-accent shrink-0 ml-2" />
                      </div>

                      <p className="hidden md:line-clamp-3 text-slate-400 text-sm mb-4 leading-relaxed project-card-desc">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Tags */}
                    <div>
                      <div className="flex flex-wrap gap-1 mb-2 md:mb-4">
                        {project.topics.slice(0, 3).map((topic, idx) => (
                          <span key={idx} className="tech-pill-small">
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Quick Direct Links */}
                      <div className="card-footer-meta flex justify-between items-center pt-1.5 md:pt-2 border-t border-white/15 text-[0.62rem] md:text-sm">
                        <span className="text-gradient font-mono opacity-80">
                          {project.language}
                        </span>
                        <div className="flex gap-2">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent link-hover p-1"
                              onClick={(e) => e.stopPropagation()}
                              title="Live Demo"
                              aria-label={`${project.name} live demo`}
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white link-hover p-1"
                            onClick={(e) => e.stopPropagation()}
                            title="GitHub Source"
                            aria-label={`${project.name} source code`}
                          >
                            <GithubIcon size={16} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Inspector Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default Home;
