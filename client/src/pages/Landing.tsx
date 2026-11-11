import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Terminal } from "lucide-react";
import gsap from "gsap";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mount timer to flip isReady to true
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Run GSAP letter animations once isReady is active
  useEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      // Initialize all character groups below their masks
      gsap.set(".char-letter", { yPercent: 115, opacity: 0 });

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // 1. Initial entrance: "Zynz Tehr" letters slide up into place
      tl.to(".char-p1", {
        yPercent: 0,
        opacity: 1,
        stagger: 0.055,
        duration: 0.85,
        delay: 0.1,
      });

      // Reading pause (1.8s)
      tl.to({}, { duration: 1.8 });

      // 2. Transition 1: "Zynz Tehr" slides UP out of screen
      tl.to(".char-p1", {
        yPercent: -115,
        opacity: 0,
        stagger: 0.03,
        duration: 0.65,
        ease: "power3.in",
      });

      // 0.25s separation gap, then "Full-Stack & Web3 Developer" slides in
      tl.to(
        ".char-p2",
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.038,
          duration: 0.85,
          ease: "power3.out",
        },
        "+=0.25",
      );

      // Reading pause (2.0s)
      tl.to({}, { duration: 2.0 });

      // 3. Transition 2: "Full-Stack & Web3 Developer" slides UP out of screen
      tl.to(".char-p2", {
        yPercent: -115,
        opacity: 0,
        stagger: 0.022,
        duration: 0.65,
        ease: "power3.in",
      });

      // 0.25s separation gap, then "Explore My World" slides in
      tl.to(
        ".char-p3",
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.055,
          duration: 0.9,
          ease: "power3.out",
        },
        "+=0.25",
      );

      // Final stop: Reveal CTA button smoothly
      tl.call(() => {
        setShowButton(true);
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isReady]);

  // Helper to split text into words and masked animated letters with solid styling
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
      className="flex flex-col items-center justify-center w-screen h-screen relative overflow-hidden"
    >
      {/* Dynamic Background Particles */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      {/* Hero Content Container */}
      <div className="flex flex-col items-center justify-center z-10 text-center w-full max-w-[850px] h-[420px] px-6">
        {/* Terminal Header Tag */}
        <div className="flex items-center gap-2 mb-6 px-4 py-1 glass-card rounded-full border border-[var(--accent-color)]">
          <Terminal size={14} className="text-accent" />
          <span className="text-sm text-accent font-mono tracking-[1px]">
            PORTFOLIO // JORGE BUCIO
          </span>
        </div>

        {/* Dynamic Animated Text Area */}
        <div
          className="text-center mb-6 h-[140px] relative w-full flex items-center justify-center transition-opacity duration-200"
          style={{ opacity: !isReady ? 0 : 1 }}
        >
          {/* Phrase 1: Zynz Tehr */}
          <h1
            className="title font-orbitron font-bold absolute w-full left-0 top-1/2 -translate-y-1/2 m-0 pointer-events-none"
            style={{
              fontSize: "clamp(2.4rem, 7.5vw, 5.5rem)",
              letterSpacing: "4px",
              opacity: !isReady ? 0 : 1,
            }}
          >
            {renderAnimatedLetters("Zynz Tehr", "char-p1", {
              color: "#ffffff",
              textShadow: "0 0 20px rgba(0, 216, 255, 0.45)",
            })}
          </h1>

          {/* Phrase 2: Full-Stack & Web3 Developer */}
          <h1
            className="title font-orbitron font-bold absolute w-full left-0 top-1/2 -translate-y-1/2 m-0 pointer-events-none"
            style={{
              fontSize: "clamp(1.4rem, 4.8vw, 3.6rem)",
              letterSpacing: "2px",
              opacity: !isReady ? 0 : 1,
            }}
          >
            {renderAnimatedLetters("Full-Stack & Web3 Developer", "char-p2", {
              color: "#00ffc8",
              textShadow: "0 0 22px rgba(0, 255, 200, 0.65)",
            })}
          </h1>

          {/* Phrase 3: Explore My World */}
          <h1
            className="title font-orbitron font-bold absolute w-full left-0 top-1/2 -translate-y-1/2 m-0 pointer-events-none"
            style={{
              fontSize: "clamp(1.9rem, 6vw, 4.5rem)",
              letterSpacing: "3px",
              opacity: !isReady ? 0 : 1,
            }}
          >
            {renderAnimatedLetters("Explore My World", "char-p3", {
              color: "#ffffff",
              textShadow: "0 0 25px rgba(0, 216, 255, 0.55)",
            })}
          </h1>
        </div>

        {/* Call to Action Button Container */}
        <div className="h-[90px] flex items-center justify-center">
          {showButton && (
            <button
              id="jumpInBtn"
              className="btn-custom fade-in inline-flex items-center gap-4 my-4"
              onClick={() => navigate("/home")}
              onMouseMove={(e) => {
                const btn = e.currentTarget;
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                btn.style.setProperty("--x", `${x}px`);
                btn.style.setProperty("--y", `${y}px`);
              }}
              style={{
                fontSize: "1.25rem",
                padding: "1.1rem 3.5rem",
              }}
            >
              <span>Enter Portfolio</span>
              <ArrowRight size={20} className="text-accent" />
            </button>
          )}
        </div>

        {/* Quick Skip Link */}
        <button
          onClick={() => navigate("/home")}
          className="text-slate-400 text-sm mt-4 link-hover bg-transparent border-0 opacity-60 hover:opacity-100"
        >
          Skip Intro →
        </button>
      </div>
    </section>
  );
};

export default Landing;
