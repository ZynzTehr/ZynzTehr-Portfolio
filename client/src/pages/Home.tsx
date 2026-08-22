import React, { useState, useMemo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, type Project } from '../data/projects';
import DevHud from '../components/DevHud';
import ProjectCarousel from '../components/ProjectCarousel';
import ProjectModal from '../components/ProjectModal';
import MatrixRain from '../components/MatrixRain';
import ProjectArt from '../components/project-arts/ProjectArt';
import ScrollWidget from '../components/ScrollWidget';
import { ExternalLink, Terminal, ArrowUpRight, Search } from 'lucide-react';
import { GithubIcon } from '../components/Icon';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGridRevealed, setIsGridRevealed] = useState<boolean>(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Filter projects by active category and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // GSAP Stagger Animation Effect on Click-to-Reveal
  useEffect(() => {
    if (!isGridRevealed || !gridContainerRef.current) return;

    // Clean up stale ScrollTriggers
    ScrollTrigger.getAll().forEach((st) => st.kill());

    const ctx = gsap.context(() => {
      const cardElements = gridContainerRef.current?.querySelectorAll<HTMLElement>('.project-card-col');
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
          ease: 'power3.out',
        }
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
              ease: 'power3.out',
              overwrite: 'auto',
            });
          },
          start: 'top 90%',
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
      behavior: 'smooth',
    });

    if (isGridRevealed && gridContainerRef.current) {
      const cardElements = gridContainerRef.current.querySelectorAll<HTMLElement>('.project-card-col');
      
      if (cardElements && cardElements.length > 0) {
        // Stagger away in reverse order (bottom to top / end to start)
        gsap.to(cardElements, {
          opacity: 0,
          y: 40,
          scale: 0.94,
          duration: 0.35,
          stagger: {
            each: 0.03,
            from: 'end',
          },
          ease: 'power2.in',
          onComplete: () => {
            setIsGridRevealed(false);
            setSearchQuery('');
          },
        });
      } else {
        setIsGridRevealed(false);
        setSearchQuery('');
      }
    }
  };

  const handleScrollDown = () => {
    window.scrollTo({
      top: 480,
      behavior: 'smooth',
    });
  };

  return (
    <section className="portfolio-home-container w-100 d-flex flex-column align-items-center">
      
      {/* Top Profile HUD */}
      <DevHud projectCount={projects.length} />

      {/* 3D Orbiting Earth & Interactive Carousel Showcase */}
      <div className="w-100 my-2">
        <ProjectCarousel
          projects={filteredProjects}
          onSelectProject={setSelectedProject}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </div>

      {/* Complete Project Grid Showcase */}
      <div className="portfolio-catalog-section w-100 mt-5 pt-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h2 className="h4 text-gradient font-orbitron m-0 d-flex align-items-center gap-2">
              <Terminal size={20} className="text-accent" />
              Repository Archive
            </h2>
            <p className="text-gradient small m-0 mt-1" style={{ opacity: 0.8 }}>
              Explore {filteredProjects.length} open-source repositories & live builds
            </p>
          </div>

          <div className="search-bar-wrapper" onClick={() => setIsGridRevealed(true)}>
            <div className={`floating-search-field ${searchQuery ? 'has-value' : ''}`}>
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
            className="archive-locked-prompt text-center py-5 my-3 d-flex flex-column align-items-center justify-content-center"
            onClick={() => {
              setIsGridRevealed(true);
              document.getElementById('archive-search-input')?.focus();
            }}
          >
            <div className="pulse-search-badge mb-3">
              <Search size={22} className="text-accent" />
            </div>
            <h3 className="h6 text-white font-orbitron mb-2">
              Click Searchbar to Unlock Repository Archive
            </h3>
            <p className="text-secondary small m-0" style={{ maxWidth: '420px', lineHeight: '1.6' }}>
              Select the searchbar above to initialize the matrix archive and reveal all {projects.length} repositories.
            </p>
          </div>
        ) : (
          <div ref={gridContainerRef} className="row g-3 g-md-4 archive-cards-grid">
            {filteredProjects.map((project) => (
              <div key={project.id} className="col-6 col-md-6 col-lg-4 project-card-col">
                <div
                  className="project-grid-card h-100"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Media Thumbnail with Default Matrix Digital Rain & Hover SVG Transition */}
                  <div className="grid-card-media position-relative">
                    <div className="grid-card-default-media">
                      <MatrixRain color="#00ff41" fontSize={11} speed={30} />
                    </div>
                    <div className="grid-card-hover-art">
                      <ProjectArt projectId={project.id} projectName={project.name} />
                    </div>
                    <span className="grid-category-badge">{project.category}</span>
                  </div>

                  {/* Card Body */}
                  <div className="grid-card-body p-3 p-md-4 d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h3 className="h5 text-white font-orbitron m-0 text-truncate">
                          {project.name}
                        </h3>
                        <ArrowUpRight size={18} className="text-accent flex-shrink-0 ms-2" />
                      </div>

                      <p
                        className="text-secondary small mb-3"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: '1.6',
                        }}
                      >
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Tags */}
                    <div>
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {project.topics.slice(0, 3).map((topic, idx) => (
                          <span key={idx} className="tech-pill-small">
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Quick Direct Links */}
                      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                        <span className="text-gradient font-monospace" style={{ opacity: 0.8 }}>{project.language}</span>
                        <div className="d-flex gap-2">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent link-hover p-1"
                              onClick={(e) => e.stopPropagation()}
                              title="Live Demo"
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

      {/* Floating Interactive Scroll Down & Back to Top Widget with React SVG */}
      <ScrollWidget onBackToTop={handleBackToTop} onScrollDown={handleScrollDown} />

    </section>
  );
};

export default Home;
