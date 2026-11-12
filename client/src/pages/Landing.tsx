import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Terminal } from "lucide-react";
import gsap from "gsap";
import GlyphRain from "../components/canvasui/GlyphRain";
import PageLoadSweep from "../components/canvasui/PageLoadSweep";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [showButton, setShowButton] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReady) return;
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 650);
    return () => clearTimeout(timer);
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(".char-letter", { yPercent: 115, opacity: 0 });

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.to(".char-p1", {
        yPercent: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.8,
        delay: 0.08,
      });

      tl.to({}, { duration: 1.65 });

      tl.to(".char-p1", {
        yPercent: -115,
        opacity: 0,
        stagger: 0.028,
        duration: 0.6,
        ease: "power3.in",
      });

      tl.to(
        ".char-p2",
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.032,
          duration: 0.8,
          ease: "power3.out",
        },
        "+=0.22",
      );

      tl.to({}, { duration: 1.8 });

      tl.to(".char-p2", {
        yPercent: -115,
        opacity: 0,
        stagger: 0.02,
        duration: 0.6,
        ease: "power3.in",
      });

      tl.to(
        ".char-p3",
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.85,
          ease: "power3.out",
        },
        "+=0.22",
      );

      tl.call(() => {
        setShowButton(true);
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isReady]);

  const renderAnimatedLetters = (
    text: string,
    phraseClass: string,
    colorStyle: React.CSSProperties,
  ) => {
    return text.split(" ").map((word, wordIdx, wordsArr) => (
      <span key={wordIdx} className="word-wrapper inline-block whitespace-nowrap">
        {word.split("").map((char, charIdx) => (
          <span key={charIdx} className="char-mask">
            <span className={`char-letter ${phraseClass}`} style={colorStyle}>
              {char}
            </span>
          </span>
        ))}
        {wordIdx < wordsArr.length - 1 && (
          <span className="char-space inline-block w-[0.3em]">&nbsp;</span>
        )}
      </span>
    ));
  };

  return (
    <section
      id="jumpIn"
      ref={containerRef}
      className="w-screen -mx-4 md:-mx-6 -my-6 min-h-[calc(100vh-4rem)] relative overflow-hidden flex items-center justify-center"
    >
      <GlyphRain
        className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center"
        color={[0.2667, 0.4549, 1]}
        headColor={[0.3765, 0.647, 0.98]}
        density={0.18}
        glow={1.55}
        dim={0.22}
        trail={0.65}
        speed={0.22}
        cell={15}
      >
        <div className="flex flex-col items-center justify-center z-10 text-center w-full max-w-[880px] min-h-[430px] px-6 mx-auto">
          <PageLoadSweep angle={10} duration={1.1} color="#60a5fa" background="#03060f">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 glass-card !rounded-full border border-[var(--border-strong)]">
              <Terminal size={14} className="text-accent" />
              <span className="text-xs md:text-sm text-accent font-telemetry tracking-[0.08em] uppercase">
                PORTFOLIO // JORGE BUCIO
              </span>
            </div>
          </PageLoadSweep>

          {/* Animated Hero Headline Stage */}
          <div
            className="text-center mb-6 h-[150px] relative w-full flex items-center justify-center transition-opacity duration-200"
            style={{ opacity: !isReady ? 0 : 1 }}
          >
            <h1
              className="title font-display font-bold absolute w-full left-0 top-1/2 -translate-y-1/2 m-0 pointer-events-none"
              style={{
                fontSize: "clamp(2.6rem, 7.8vw, 5.6rem)",
                letterSpacing: "-0.03em",
              }}
            >
              {renderAnimatedLetters("Zynz Tehr", "char-p1", {
                color: "#f4f7ff",
                textShadow: "0 0 28px rgba(68, 116, 255, 0.55)",
              })}
            </h1>

            <p
              aria-hidden="true"
              className="title font-display font-bold absolute w-full left-0 top-1/2 -translate-y-1/2 m-0 pointer-events-none"
              style={{
                fontSize: "clamp(1.45rem, 4.8vw, 3.5rem)",
                letterSpacing: "-0.025em",
              }}
            >
              {renderAnimatedLetters("Full-Stack & Creative Systems", "char-p2", {
                color: "#60a5fa",
                textShadow: "0 0 26px rgba(13, 89, 255, 0.65)",
              })}
            </p>

            <p
              aria-hidden="true"
              className="title font-display font-bold absolute w-full left-0 top-1/2 -translate-y-1/2 m-0 pointer-events-none"
              style={{
                fontSize: "clamp(2rem, 6.2vw, 4.6rem)",
                letterSpacing: "-0.028em",
              }}
            >
              {renderAnimatedLetters("Explore Live Work", "char-p3", {
                color: "#f4f7ff",
                textShadow: "0 0 28px rgba(96, 165, 250, 0.55)",
              })}
            </p>
          </div>

          {/* Primary Call to Action */}
          <div className="h-[92px] flex items-center justify-center">
            {showButton && (
              <button
                id="jumpInBtn"
                type="button"
                className="btn-custom inline-flex items-center gap-3 my-4"
                onClick={() => navigate("/home")}
                onMouseMove={(e) => {
                  const btn = e.currentTarget;
                  const rect = btn.getBoundingClientRect();
                  btn.style.setProperty("--x", `${e.clientX - rect.left}px`);
                  btn.style.setProperty("--y", `${e.clientY - rect.top}px`);
                }}
                style={{
                  fontSize: "1.12rem",
                  padding: "1rem 3rem",
                }}
              >
                <span>Enter Portfolio</span>
                <ArrowRight size={19} className="text-accent" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="text-[var(--text-muted)] text-sm mt-3 link-hover bg-transparent border-0 px-3 py-2 min-h-[44px]"
          >
            Skip Intro →
          </button>
        </div>
      </GlyphRain>
    </section>
  );
};

export default Landing;
