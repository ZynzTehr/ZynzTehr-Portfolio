import React, {
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowUpRight, ExternalLink, Globe, Hash, RotateCcw, Search, X } from "lucide-react";
import { formatProjectDate, projects, type Project } from "../data/projects";
import DevHud from "../components/DevHud";
import ProjectCarousel from "../components/ProjectCarousel";
import ProjectStage from "../components/ProjectStage";
import CardMediaPreview from "../components/CardMediaPreview";
import ScrollWidget from "../components/ScrollWidget";
import SiteNav from "../components/SiteNav";
import BrandMark from "../components/BrandMark";
import MaskHeading from "../components/MaskHeading";
import PixelButton from "../components/fx/PixelButton";
import GlowCaret from "../components/fx/GlowCaret";
import Laser from "../components/canvasui/Laser";
import ParticleScroll from "../components/canvasui/ParticleScroll";
import Ripple from "../components/canvasui/Ripple";
import { LASER_SPEC, PARTICLE_SCROLL_SPEC, RIPPLE_SPEC } from "../components/canvasui/spec";
import { GithubIcon } from "../components/Icon";
import { Flip, gsap, ScrollTrigger } from "../lib/gsap";
import { DUR, EASE } from "../lib/motion";
import { prefersReducedMotion, useReducedMotion } from "../lib/useReducedMotion";
import { actFlowTop, useActStack, useActsAwake } from "../lib/useActStack";
import BlackHole from "../components/BlackHole";

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
  /** The stage control that takes focus if this state mounts a stage. */
  focus: "close" | "prev" | "next";
}

const LIVE_COUNT = projects.filter((p) => Boolean(p.liveUrl)).length;
/** Rock-paper-scissors builds in the index (the coda's running joke), counted, never assumed. */
const RPS_COUNT = projects.filter((p) => /rock[\s-]*paper[\s-]*scissors/i.test(p.name)).length;
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

  const isGridRevealedRef = useRef(isGridRevealed);
  /** Act III's on-screen top to hold while Act II folds above it (see the fold below). */
  const holdActThreeRef = useRef<number | null>(null);
  const homeRef = useRef<HTMLElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const indexAnchorRef = useRef<HTMLDivElement>(null);
  const codaRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);

  /** Record card positions just before the index list changes, so it can FLIP. */
  const captureFlip = useCallback(() => {
    if (prefersReducedMotion()) return;
    const cards = document.querySelectorAll("#index-grid .project-card-col");
    if (cards.length) flipStateRef.current = Flip.getState(cards);
  }, []);
  const lastOpenedRef = useRef<{ id: string; source: StageState["source"] } | null>(null);

  useEffect(() => {
    const syncCols = () => setGridColumns(window.innerWidth >= 1024 ? 3 : 2);
    window.addEventListener("resize", syncCols);
    return () => window.removeEventListener("resize", syncCols);
  }, []);

  // Debounced search: the input stays instant, the index re-filters once typing pauses.
  useEffect(() => {
    const t = window.setTimeout(() => {
      captureFlip();
      setSearchQuery(searchInput);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [searchInput, captureFlip]);

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

  // A stage whose project was filtered out is dropped, so it never reappears later.
  useEffect(() => {
    if (!stage || stageProject) return;
    const frame = requestAnimationFrame(() => setStage(null));
    return () => cancelAnimationFrame(frame);
  }, [stage, stageProject]);

  const focusOrigin = useCallback(() => {
    const last = lastOpenedRef.current;
    if (!last) return;
    requestAnimationFrame(() => {
      const id = CSS.escape(last.id);
      const el =
        last.source === "grid"
          ? document.querySelector<HTMLElement>(`#index-grid [data-project-card="${id}"]`)
          : document.querySelector<HTMLElement>(`#orbit [data-project-tile="${id}"]`);
      (el ?? searchInputRef.current)?.focus({ preventScroll: true });
      // Closing an inline index stage collapses the space above the card, which
      // can leave the card off-screen; bring it back so the focus ring shows.
      const card = el?.closest<HTMLElement>(".project-grid-card");
      if (card) {
        const r = card.getBoundingClientRect();
        if (r.top < 0 || r.bottom > window.innerHeight) {
          card.scrollIntoView({
            block: "nearest",
            behavior: prefersReducedMotion() ? "auto" : "smooth",
          });
        }
      }
    });
  }, []);

  const openStage = useCallback(
    (project: Project, source: StageState["source"], rect: DOMRect | null) => {
      lastOpenedRef.current = { id: project.id, source };
      setStage({ project, source, originRect: rect, focus: "close" });
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
      // The grid keeps focus on the card being viewed; the orbit returns focus to
      // the tile that opened the stage, since stepped-to tiles may face away.
      if (stage.source === "grid") lastOpenedRef.current = { id: next.id, source: "grid" };
      setStage({
        project: next,
        source: stage.source,
        originRect: null,
        focus: direction === -1 ? "prev" : "next",
      });
    },
    [stage, stageList],
  );

  // Opening the index makes Act II tall. If it was pinned at the top (the page
  // scrolled past its flow position), it would unstick and jump up, so the
  // layout effect below scrolls back to its flow top in the same frame.
  const holdIndexTopRef = useRef(false);
  const revealIndex = useCallback(() => {
    const act = catalogRef.current;
    if (act && !isGridRevealedRef.current) {
      holdIndexTopRef.current = window.scrollY > actFlowTop(act) + 1;
    }
    setIsGridRevealed(true);
  }, []);

  /** Scroll once the filtered grid has committed and been re-measured; focus when it settles. */
  const scrollToIndexThenFocus = useCallback(() => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        const smooth = !prefersReducedMotion();
        const anchor = indexAnchorRef.current;
        if (anchor) {
          window.scrollTo({
            top: anchor.getBoundingClientRect().top + window.scrollY,
            behavior: smooth ? "smooth" : "auto",
          });
        }
        const focusSearch = () => searchInputRef.current?.focus({ preventScroll: true });
        if (!smooth) {
          focusSearch();
          return;
        }
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          window.removeEventListener("scrollend", finish);
          focusSearch();
        };
        window.addEventListener("scrollend", finish, { once: true });
        window.setTimeout(finish, DUR.hero * 1000 + 400);
      }),
    );
  }, []);

  const handleSelectTopic = useCallback(
    (topic: string) => {
      captureFlip();
      setActiveTopic(topic);
      setSearchInput("");
      setSearchQuery("");
      setStage(null);
      setIsGridRevealed(true);
      scrollToIndexThenFocus();
    },
    [captureFlip, scrollToIndexThenFocus],
  );

  const resetFilters = useCallback(() => {
    captureFlip();
    setSearchInput("");
    setSearchQuery("");
    setActiveTopic(null);
    setActiveCategory("Recent");
  }, [captureFlip]);

  // Filtering glides: surviving cards move from their old place, new ones rise in.
  useLayoutEffect(() => {
    const state = flipStateRef.current;
    flipStateRef.current = null;
    if (!state) return;
    const cards = document.querySelectorAll("#index-grid .project-card-col");
    const tween = Flip.from(state, {
      targets: cards,
      duration: DUR.reveal,
      ease: EASE.out,
      stagger: 0.02,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: DUR.reveal, ease: EASE.out },
        ),
    });
    return () => {
      tween.kill();
    };
  }, [indexProjects]);

  useLayoutEffect(() => {
    isGridRevealedRef.current = isGridRevealed;
    const actThree = codaRef.current;
    const held = holdActThreeRef.current;
    if (!isGridRevealed && held !== null && actThree) {
      holdActThreeRef.current = null;
      window.scrollTo({ top: actFlowTop(actThree) - held, behavior: "instant" });
      ScrollTrigger.refresh();
      return;
    }
    const act = catalogRef.current;
    if (!isGridRevealed || !holdIndexTopRef.current || !act) return;
    holdIndexTopRef.current = false;
    window.scrollTo({ top: actFlowTop(act), behavior: "instant" });
  }, [isGridRevealed]);

  const openIndexFromPrompt = () => {
    revealIndex();
    requestAnimationFrame(() => searchInputRef.current?.focus({ preventScroll: true }));
  };

  // The laser burns only while the index is open and on screen, so the
  // footer and the coda are never hidden behind its mask.
  useEffect(() => {
    const act = catalogRef.current;
    if (!isGridRevealed || !act) return;
    // Measured from the act's flow position, not its rect: Act II may be pinned
    // (sticky) when this is created, and its rect would put the end too late.
    const trigger = ScrollTrigger.create({
      start: () => actFlowTop(act) - window.innerHeight,
      end: () => actFlowTop(act) + act.offsetHeight - window.innerHeight + LASER_SPEC.offset,
      invalidateOnRefresh: true,
      onToggle: (self) => setLaserOn(self.isActive),
    });
    const frame = requestAnimationFrame(() => setLaserOn(trigger.isActive));
    return () => {
      cancelAnimationFrame(frame);
      trigger.kill();
    };
  }, [isGridRevealed]);

  // Keyboard focus and scrollIntoView keep clear of the beam and the sand line.
  useEffect(() => {
    if (!isGridRevealed || !laserOn || prefersReducedMotion()) return;
    const root = document.documentElement;
    root.style.scrollPaddingBottom = `calc((1 - ${PARTICLE_SCROLL_SPEC.point}) * 100vh + 24px)`;
    return () => {
      root.style.scrollPaddingBottom = "";
    };
  }, [isGridRevealed, laserOn]);

  // Opening or folding the index (and filtering, and stages) changes the page
  // height under every later trigger, so re-measure on both edges.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [isGridRevealed, indexProjects.length, stageProject?.id]);

  useMaskReveal(homeRef, []);
  useActStack(homeRef, reducedMotion);
  const actsAwake = useActsAwake(3);

  // Act II folds back to its prompt once it fills under a tenth of the screen:
  // the cards, the sand and the laser go, and nothing keeps running for it.
  // When it folds while above the viewport (Act III has taken over), the page
  // above Act III shrinks, so the scroll is moved by the same amount and
  // Act III stays exactly where it was.
  const actTwoAwake = actsAwake[1];
  const wasActTwoAwakeRef = useRef(actTwoAwake);
  useEffect(() => {
    const was = wasActTwoAwakeRef.current;
    wasActTwoAwakeRef.current = actTwoAwake;
    if (!was || actTwoAwake) return;
    const actThree = codaRef.current;
    if (!isGridRevealedRef.current) return;
    if (actThree) {
      const actThreeTop = actFlowTop(actThree) - window.scrollY;
      holdActThreeRef.current = actThreeTop < window.innerHeight ? actThreeTop : null;
    }
    setStage((current) => (current?.source === "grid" ? null : current));
    setSearchInput("");
    setSearchQuery("");
    setActiveTopic(null);
    setLaserOn(false);
    setIsGridRevealed(false);
  }, [actTwoAwake]);

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
        // The index stage sits inline in the grid, so a step would move it to
        // another row (often off screen); only the orbit's stage steps.
        onPrev={source === "carousel" ? () => handleStepStage(-1) : undefined}
        onNext={source === "carousel" ? () => handleStepStage(1) : undefined}
        onSelectTopic={handleSelectTopic}
        closeRequest={closeRequest}
        initialFocus={stage.focus}
      />
    ) : null;

  return (
    <section ref={homeRef} className="portfolio-home-container w-full flex flex-col items-center">
      <ScrollWidget onBackToTop={handleBackToTop} />
      <SiteNav />

      {/* The three acts are stacked sheets (useActStack): each pins once its
          bottom meets the viewport's, and the next act slides up over it. */}
      {/* Act I: Orbit. Each act follows a zero-height anchor: the anchor stays
          in the flow when its act pins, so it always reports where the act
          really sits on the page (useActStack and the laser measure from it). */}
      <div className="act-anchor" aria-hidden="true" />
      <div className="act act--1" data-exit="sink">
        <div className="act__shade" aria-hidden="true" />
        <div className="act__inner">
          <DevHud projectCount={projects.length} />

          <div className="w-full my-2" id="orbit">
            {renderStage("carousel")}
            {/* The orbit stays mounted while a project is open, so Back returns to the
            same orbit position without rebuilding the globe. */}
            <div hidden={Boolean(stageProject && stage?.source === "carousel")}>
              <ProjectCarousel
                projects={orbitProjects}
                paused={Boolean(stageProject && stage?.source === "carousel")}
                dormant={!actsAwake[0]}
                onSelectProject={(project, rect) => openStage(project, "carousel", rect)}
                activeCategory={activeCategory}
                onSelectCategory={(cat) => {
                  captureFlip();
                  startTransition(() => {
                    setStage(null);
                    setActiveCategory(cat);
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Act II: Index. The anchor marks where the act sits in the flow, which a
          pinned sheet no longer reports, so jumps to the index land exactly. */}
      <div ref={indexAnchorRef} className="act-anchor" aria-hidden="true" />
      <div
        ref={catalogRef}
        id="index"
        className="act act--2 portfolio-catalog-section"
        data-exit="swirl"
        // Keyboard focus keeps controls above the sand line while it is in use (useActStack).
        data-focus-clearance={
          isGridRevealed && !reducedMotion ? String(1 - PARTICLE_SCROLL_SPEC.point) : undefined
        }
      >
        <div className="act__sheet" aria-hidden="true" />
        <div className="act__inner">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="text-center md:text-left">
              <p className="chapter-kicker m-0 mb-1.5">
                <span data-act-kicker="1">ACT II // INDEX</span>
              </p>
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
                  aria-controls="index-results"
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
                <GlowCaret inputRef={searchInputRef} />
              </div>
            </div>
          </div>

          {/* Always present while the index is open, so filtering never shifts the grid. */}
          {isGridRevealed && (
            <div
              className="archive-filter-bar mb-5 flex flex-wrap items-center justify-between gap-2"
              role="status"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-telemetry text-[var(--text-secondary)]">
                <span>{hasActiveFilter ? "Showing" : `Showing all ${projects.length}`}</span>
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
                {hasActiveFilter && (
                  <span className="text-accent tabular-nums">{indexProjects.length} matched</span>
                )}
              </div>
              <PixelButton
                variant="secondary"
                size="sm"
                onClick={resetFilters}
                wrapperClassName={hasActiveFilter ? "" : "invisible"}
                tabIndex={hasActiveFilter ? undefined : -1}
                aria-hidden={hasActiveFilter ? undefined : true}
              >
                <RotateCcw size={12} aria-hidden="true" />
                <span>Clear filters</span>
              </PixelButton>
            </div>
          )}

          <div id="index-results">
            {!isGridRevealed ? (
              <div className="archive-open-prompt text-center py-12 my-4 flex flex-col items-center justify-center gap-4">
                <MaskHeading
                  as="h3"
                  className="text-base md:text-lg font-semibold text-[var(--text-primary)] font-display m-0"
                >
                  Open the full index
                </MaskHeading>
                <p className="text-[var(--text-secondary)] text-sm m-0 max-w-[460px] leading-relaxed">
                  All {projects.length} systems, searchable by name, stack or topic. They print in
                  along the orbit line.
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
                        <div className="project-card-col min-w-0" data-flip-id={project.id}>
                          {/* A non-interactive card with one full-card button; the live
                          and source links sit above it, so nothing is nested. */}
                          <article
                            className={`project-grid-card h-full ${isSelected ? "is-selected" : ""}`}
                            onClick={(e) => {
                              // Pointer clicks anywhere on the card (media included) open it; the
                              // full-card button serves the keyboard, and links act as links.
                              const t = e.target as HTMLElement;
                              if (t.closest("a, button")) return;
                              activateCard(project, e.currentTarget);
                            }}
                            onMouseEnter={() => setHoveredGridId(project.id)}
                            onMouseLeave={() =>
                              setHoveredGridId((prev) => (prev === project.id ? null : prev))
                            }
                            onFocus={() => setHoveredGridId(project.id)}
                            onBlur={() =>
                              setHoveredGridId((prev) => (prev === project.id ? null : prev))
                            }
                          >
                            <button
                              type="button"
                              className="card-hit"
                              data-project-card={project.id}
                              aria-expanded={isSelected}
                              aria-label={`${project.name}: open project details`}
                              onClick={(e) => {
                                const card =
                                  e.currentTarget.closest<HTMLElement>(".project-grid-card");
                                if (card) activateCard(project, card);
                              }}
                            />
                            <div className="grid-card-media relative">
                              <CardMediaPreview
                                project={project}
                                isActive={isHovered || isSelected}
                                enableShader={isHovered && !stageProject}
                                rest="glyph"
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
                          </article>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </ParticleScroll>
            )}
          </div>
        </div>
      </div>

      {/* Act III: Event horizon. Act II spirals into the black hole as this act
          arrives (useActStack "swirl" exit); the act itself is transparent, so
          its words sit over the hole. */}
      <BlackHole awake={actsAwake[2]} />
      <div className="act-anchor" aria-hidden="true" />
      <section
        ref={codaRef}
        aria-labelledby="transmission-title"
        className="act act--3 transmission"
      >
        <div className="act__inner transmission__inner">
          <Ripple className="transmission__ripple" native={false} {...RIPPLE_SPEC}>
            <div className="transmission__layout">
              <header className="transmission__head">
                <div className="coda-stagger flex items-center justify-center gap-3 mb-4">
                  <span className="coda-mark" aria-hidden="true">
                    <BrandMark size={40} />
                  </span>
                  <span className="chapter-kicker" data-act-kicker="2">
                    ACT III // EVENT HORIZON
                  </span>
                </div>
                <h2
                  id="transmission-title"
                  className="coda-stagger font-display font-bold text-[1.7rem] md:text-[2.4rem] leading-[1.12] text-[var(--text-primary)] m-0 mb-3"
                >
                  Ideas that get this close don&rsquo;t escape. They ship.
                </h2>
                <p className="coda-stagger m-0 text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                  {projects.length} repositories pulled in from a blank file: shaders that bend
                  light, full-stack platforms that carry real weight
                  {RPS_COUNT > 1
                    ? `, and ${RPS_COUNT} rock-paper-scissors engines that had no business being this well engineered.`
                    : "."}
                </p>
              </header>

              {/* The hole shows through here. */}
              <div className="transmission__horizon" aria-hidden="true" />

              <div className="transmission__foot">
                <div className="coda-stagger grid grid-cols-3 gap-2.5 md:gap-3">
                  <div className="coda-stat-tile">
                    <span className="coda-stat-tile__value" data-count={projects.length}>
                      {projects.length}
                    </span>
                    <span className="coda-stat-tile__label">Repositories pulled in</span>
                  </div>
                  <div className="coda-stat-tile">
                    <span className="coda-stat-tile__value" data-count={LIVE_COUNT}>
                      {LIVE_COUNT}
                    </span>
                    <span className="coda-stat-tile__label">Still transmitting, live</span>
                  </div>
                  <div className="coda-stat-tile">
                    <span className="coda-stat-tile__value coda-stat-tile__value--text">
                      TS · React · WebGL2
                    </span>
                    <span className="coda-stat-tile__label">Source of the gravity</span>
                  </div>
                </div>

                <div className="coda-stagger flex flex-wrap items-center justify-center gap-3">
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
        </div>
      </section>

      {/* upgrades.md: Laser at the bottom of the page while the index is open */}
      {/* Mounted only while it burns: the index is open and on screen. */}
      {isGridRevealed && laserOn && (
        <div className="archive-laser is-on" aria-hidden="true">
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
