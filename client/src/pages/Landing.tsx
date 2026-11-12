import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlyphRain from "../components/canvasui/GlyphRain";
import { AsciiSweep } from "../components/canvasui/AsciiSweep";
import Ripple, { type RippleHandle } from "../components/canvasui/Ripple";
import { ASCII_SWEEP_SPEC, GLYPH_RAIN_SPEC, RIPPLE_SPEC } from "../components/canvasui/spec";
import OrbitParticles from "../components/OrbitParticles";
import BrandMark from "../components/BrandMark";
import PixelButton from "../components/fx/PixelButton";
import { launchCover } from "../lib/routeCover";
import { projects } from "../data/projects";
import { gsap } from "../lib/gsap";
import { DUR, EASE, PROLOGUE } from "../lib/motion";
import { prefersReducedMotion, useReducedMotion } from "../lib/useReducedMotion";
import { loadHome } from "../lib/loadHome";

/**
 * Prologue, act 0: Ignition. AsciiSweep (upgrades.md: page-load text) is the
 * beat engine: it swaps one panel for the next, so every beat change is a real
 * sweep. Its two slots alternate; the hidden slot is refilled with the next
 * beat before each swap. The restored orbit particles circle the headline, and
 * Launch collapses them into the hex-orbit mark that becomes the route cover.
 */

const SEEN_KEY = "zt-prologue-seen";
const LIVE_COUNT = projects.filter((p) => Boolean(p.liveUrl)).length;

interface Beat {
  code: string;
  kicker: string;
  headline: string;
  line: string;
  size: string;
}

const BEATS: Beat[] = [
  {
    code: "01",
    kicker: "Signal",
    headline: "Zynz Tehr",
    line: "Jorge Bucio, full-stack and creative systems engineer",
    size: "clamp(2.9rem, 13vw, 6.4rem)",
  },
  {
    code: "02",
    kicker: "Craft",
    headline: "Built from a blank file",
    line: "Hand-written WebGL shaders, real-time systems and interfaces that answer back",
    size: "clamp(1.6rem, 4.6vw, 3.4rem)",
  },
  {
    code: "03",
    kicker: "Launch",
    headline: `${projects.length} systems in orbit`,
    line: `${LIVE_COUNT} running live. All of them open source.`,
    size: "clamp(1.8rem, 5vw, 3.8rem)",
  },
];

const BeatPanel: React.FC<{ beat: Beat | null }> = ({ beat }) => (
  <div className="beat-panel">
    {beat ? (
      <>
        <p className="beat-panel__headline" style={{ fontSize: beat.size }}>
          {beat.headline}
        </p>
        <p className="beat-panel__line">{beat.line}</p>
      </>
    ) : null}
  </div>
);

function readSeen(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage unavailable: the prologue simply replays.
  }
}

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  // Returning visitors and reduced motion start on beat 03 with Launch ready.
  const [settledStart] = useState<boolean>(
    () => typeof window !== "undefined" && (readSeen() || prefersReducedMotion()),
  );

  // Two AsciiSweep slots; each holds a beat index or null (the blank page-load panel).
  const [slots, setSlots] = useState<[number | null, number | null]>(() =>
    settledStart ? [2, null] : [null, 0],
  );
  const [slotIndex, setSlotIndex] = useState<0 | 1>(0);
  const [activeBeat, setActiveBeat] = useState<number>(settledStart ? 2 : 0);
  const [beatRun, setBeatRun] = useState(0);
  const [showCta, setShowCta] = useState<boolean>(settledStart);
  const [launching, setLaunching] = useState(false);
  const [rainBoost, setRainBoost] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<RippleHandle | null>(null);
  const timers = useRef<number[]>([]);
  const slotsRef = useRef(slots);
  const slotIndexRef = useRef(slotIndex);
  const launchingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    slotsRef.current = slots;
    slotIndexRef.current = slotIndex;
  }, [slots, slotIndex]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  /** Put a beat in the hidden slot, give the engine a moment to capture it, then sweep. */
  const swapTo = useCallback(
    (beat: number) => {
      const other = (1 - slotIndexRef.current) as 0 | 1;
      setSlots((prev) => {
        const next: [number | null, number | null] = [prev[0], prev[1]];
        next[other] = beat;
        return next;
      });
      setActiveBeat(beat);
      setBeatRun((n) => n + 1);
      // Launch only appears once beat 03 has landed (onSweepEnd).
      setShowCta(false);
      later(() => setSlotIndex(other), 140);
    },
    [later],
  );

  // Page-load sweep reveals beat 01.
  useEffect(() => {
    if (settledStart || reducedMotion) return;
    later(() => setSlotIndex(1), PROLOGUE.firstDelay * 1000);
    return clearTimers;
  }, [settledStart, reducedMotion, later, clearTimers]);

  // When a sweep lands, hold, then advance. Beat 03 ends the run with the CTA.
  const onSweepEnd = useCallback(
    (to: number) => {
      if (launchingRef.current) return;
      const beat = slotsRef.current[to === 1 ? 1 : 0];
      if (beat === null) return;
      if (beat >= BEATS.length - 1) {
        setShowCta(true);
        markSeen();
        return;
      }
      later(() => swapTo(beat + 1), PROLOGUE.hold * 1000);
    },
    [later, swapTo],
  );

  const jumpTo = (beat: number) => {
    if (launchingRef.current) return;
    // Reduced motion shows the active beat directly (no slots involved).
    if (reducedMotion) {
      if (beat === activeBeat) return;
      clearTimers();
      setActiveBeat(beat);
      setShowCta(true);
      return;
    }
    const shown = slotsRef.current[slotIndexRef.current];
    if (beat === shown) return;
    clearTimers();
    swapTo(beat);
  };

  // The mark locks on: it spins in and settles, then the chrome follows.
  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(markRef.current, {
        opacity: 0,
        scale: 1.8,
        rotate: -40,
        duration: DUR.hero,
        ease: EASE.out,
        delay: 0.1,
      });
      gsap.from(".prologue-chrome", {
        opacity: 0,
        y: 10,
        duration: DUR.reveal,
        ease: EASE.out,
        stagger: 0.08,
        delay: 0.25,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  // The CTA blooms in when beat 03 lands.
  useLayoutEffect(() => {
    if (!showCta || reducedMotion || !ctaRef.current || settledStart) return;
    const tween = gsap.from(ctaRef.current, {
      opacity: 0,
      y: 16,
      scale: 0.94,
      duration: DUR.reveal,
      ease: EASE.out,
      clearProps: "transform,opacity",
    });
    return () => {
      tween.kill();
    };
  }, [showCta, reducedMotion, settledStart]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimers();
    };
  }, [clearTimers]);

  // Fetch the orbit while the prologue plays, once the first paint has settled.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const handle = idle(() => {
      void loadHome();
    });
    return () => {
      if (window.cancelIdleCallback && typeof handle === "number")
        window.cancelIdleCallback(handle);
    };
  }, []);

  const launch = useCallback(
    (from?: { x: number; y: number }) => {
      if (launchingRef.current) return;
      launchingRef.current = true;
      clearTimers();
      markSeen();
      if (reducedMotion) {
        // A short crossfade instead of the cover (motion-free, never a hard cut).
        const fade = sectionRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 180,
          easing: "linear",
          fill: "forwards",
        });
        const go = () => {
          if (mountedRef.current) void navigate("/home");
        };
        if (fade) fade.onfinish = go;
        else go();
        return;
      }
      const origin = from ?? { x: window.innerWidth / 2, y: window.innerHeight * 0.45 };
      rippleRef.current?.splashAtClient(origin.x, origin.y, 1.2);
      setLaunching(true);
      setRainBoost(true);
      // Let the orbit visibly spiral inward before the cover opens over it.
      later(() => {
        void launchCover(origin).then(() => {
          if (mountedRef.current) void navigate("/home");
        });
      }, 340);
    },
    [clearTimers, later, navigate, reducedMotion],
  );

  const ctaCenter = () => {
    const r = ctaRef.current?.getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined;
  };

  const rainOptions = rainBoost
    ? { ...GLYPH_RAIN_SPEC, speed: 1.6, density: 0.4 }
    : GLYPH_RAIN_SPEC;
  const ctaVisible = showCta || reducedMotion;

  return (
    <section ref={sectionRef} id="prologue" className="prologue" aria-labelledby="prologue-title">
      <h1 id="prologue-title" className="sr-only">
        Zynz Tehr: Jorge Bucio, full-stack and creative systems engineer. {projects.length}{" "}
        open-source systems, {LIVE_COUNT} running live.
      </h1>

      {/* No native capture wraps another: Ripple and GlyphRain take their overlay
          paths so AsciiSweep's own native capture (and its band) can show. */}
      <Ripple
        className="prologue-ripple"
        native={false}
        {...RIPPLE_SPEC}
        onReady={(handle) => {
          rippleRef.current = handle;
        }}
      >
        <GlyphRain className="prologue-rain" native={false} {...rainOptions}>
          <div className="prologue-stage">
            <div className="prologue-head-slot" aria-hidden="true" />

            {/* The beats live under the rain: dimmed page, light pools (upgrades.md). */}
            <div className="prologue-beats" aria-hidden="true">
              {reducedMotion ? (
                <BeatPanel beat={BEATS[activeBeat]} />
              ) : (
                <AsciiSweep
                  className="prologue-sweep"
                  {...ASCII_SWEEP_SPEC}
                  background="#03060f"
                  directional={false}
                  index={slotIndex}
                  onSweepEnd={onSweepEnd}
                  alternate={<BeatPanel beat={slots[1] === null ? null : BEATS[slots[1]]} />}
                >
                  <BeatPanel beat={slots[0] === null ? null : BEATS[slots[0]]} />
                </AsciiSweep>
              )}
            </div>
            <div className="prologue-actions-slot" aria-hidden="true" />
          </div>
        </GlyphRain>

        {/* Controls stay crisp above the rain's dim. */}
        <div className="prologue-ui">
          <div className="prologue-head">
            <div ref={markRef} className="prologue-mark" aria-hidden="true">
              <BrandMark size={46} />
            </div>
            <p className="prologue-chrome prologue-kicker">ZYNZTEHR // PROLOGUE</p>
            <div
              className="prologue-chrome prologue-stepper"
              role="group"
              aria-label="Prologue beats"
            >
              {BEATS.map((beat, idx) => {
                const state =
                  activeBeat === idx ? "is-active" : activeBeat > idx ? "is-passed" : "";
                return (
                  <button
                    key={beat.code}
                    type="button"
                    onClick={() => jumpTo(idx)}
                    aria-current={activeBeat === idx ? "step" : undefined}
                    className={`prologue-beat-pill ${state}`}
                  >
                    <span className="prologue-beat-pill__code">{beat.code}</span>
                    <span className="prologue-beat-pill__label">{beat.kicker}</span>
                    <span className="prologue-beat-pill__track" aria-hidden="true">
                      <span
                        key={activeBeat === idx ? `run-${beatRun}` : "idle"}
                        className="prologue-beat-pill__fill"
                        style={
                          {
                            "--beat-dur": `${PROLOGUE.sweep + PROLOGUE.hold}s`,
                          } as React.CSSProperties
                        }
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="prologue-beats-gap" aria-hidden="true" />

          <div className="prologue-actions">
            <div ref={ctaRef} className={`prologue-cta ${ctaVisible ? "is-shown" : ""}`}>
              {ctaVisible ? (
                <PixelButton
                  variant="primary"
                  size="lg"
                  delayActivate={reducedMotion ? 0 : 260}
                  onActivate={() => launch(ctaCenter())}
                >
                  <span>Launch</span>
                </PixelButton>
              ) : null}
            </div>
            <PixelButton
              variant="secondary"
              size="sm"
              className="prologue-chrome"
              onClick={() => launch()}
            >
              Skip intro
            </PixelButton>
          </div>
        </div>
      </Ripple>

      <OrbitParticles collapsing={launching} />
    </section>
  );
};

export default Landing;
