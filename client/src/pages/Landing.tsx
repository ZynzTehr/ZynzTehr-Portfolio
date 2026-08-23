import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Terminal } from 'lucide-react';
import gsap from 'gsap';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initialize all character groups below their masks
      gsap.set('.char-letter', { yPercent: 115, opacity: 0 });

      const tl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      });

      // 1. Initial entrance: "Zynz Tehr" letters slide up into place
      tl.to('.char-p1', {
        yPercent: 0,
        opacity: 1,
        stagger: 0.055,
        duration: 0.85,
        delay: 0.35,
      });

      // Reading pause (1.8s)
      tl.to({}, { duration: 1.8 });

      // 2. Transition 1: "Zynz Tehr" slides UP out of screen
      tl.to('.char-p1', {
        yPercent: -115,
        opacity: 0,
        stagger: 0.03,
        duration: 0.65,
        ease: 'power3.in',
      });

      // 0.25s separation gap, then "Full-Stack & Web3 Developer" slides in
      tl.to(
        '.char-p2',
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.038,
          duration: 0.85,
          ease: 'power3.out',
        },
        '+=0.25'
      );

      // Reading pause (2.0s)
      tl.to({}, { duration: 2.0 });

      // 3. Transition 2: "Full-Stack & Web3 Developer" slides UP out of screen
      tl.to('.char-p2', {
        yPercent: -115,
        opacity: 0,
        stagger: 0.022,
        duration: 0.65,
        ease: 'power3.in',
      });

      // 0.25s separation gap, then "Explore My World" slides in
      tl.to(
        '.char-p3',
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.055,
          duration: 0.9,
          ease: 'power3.out',
        },
        '+=0.25'
      );

      // Final stop: Reveal CTA button smoothly
      tl.call(() => {
        setShowButton(true);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Helper to split text into words and masked animated letters with solid styling
  const renderAnimatedLetters = (text: string, phraseClass: string, colorStyle: React.CSSProperties) => {
    return text.split(' ').map((word, wordIdx, wordsArr) => (
      <span
        key={wordIdx}
        className="word-wrapper"
        style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
      >
        {word.split('').map((char, charIdx) => (
          <span
            key={charIdx}
            className="char-mask"
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'bottom',
              lineHeight: 1.15,
            }}
          >
            <span
              className={`char-letter ${phraseClass}`}
              style={{
                display: 'inline-block',
                willChange: 'transform, opacity',
                ...colorStyle,
              }}
            >
              {char}
            </span>
          </span>
        ))}
        {wordIdx < wordsArr.length - 1 && (
          <span className="char-space" style={{ display: 'inline-block', width: '0.3em' }}>
            &nbsp;
          </span>
        )}
      </span>
    ));
  };

  return (
    <section
      id="jumpIn"
      ref={containerRef}
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
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
      <div
        className="d-flex flex-column align-items-center justify-content-center z-1 text-center"
        style={{ width: '100%', maxWidth: '850px', height: '420px', padding: '0 1.5rem' }}
      >
        {/* Terminal Header Tag */}
        <div
          className="d-flex align-items-center gap-2 mb-4 px-3 py-1 glass-card"
          style={{ borderRadius: '50px', border: '1px solid var(--accent-color)' }}
        >
          <Terminal size={14} className="text-accent" />
          <span className="small text-accent font-monospace" style={{ letterSpacing: '1px' }}>
            PORTFOLIO // ZYNZ TEHR
          </span>
        </div>

        {/* Dynamic Animated Text Area */}
        <div
          className="text-center mb-4"
          style={{
            height: '140px',
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Phrase 1: Zynz Tehr */}
          <h1
            className="title font-orbitron"
            style={{
              fontSize: 'clamp(2.4rem, 7.5vw, 5.5rem)',
              position: 'absolute',
              width: '100%',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              letterSpacing: '4px',
              margin: 0,
              pointerEvents: 'none',
            }}
          >
            {renderAnimatedLetters('Zynz Tehr', 'char-p1', {
              color: '#ffffff',
              textShadow: '0 0 20px rgba(0, 216, 255, 0.45)',
            })}
          </h1>

          {/* Phrase 2: Full-Stack & Web3 Developer */}
          <h1
            className="title font-orbitron"
            style={{
              fontSize: 'clamp(1.4rem, 4.8vw, 3.6rem)',
              position: 'absolute',
              width: '100%',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              letterSpacing: '2px',
              margin: 0,
              pointerEvents: 'none',
            }}
          >
            {renderAnimatedLetters('Full-Stack & Web3 Developer', 'char-p2', {
              color: '#00ffc8',
              textShadow: '0 0 22px rgba(0, 255, 200, 0.65)',
            })}
          </h1>

          {/* Phrase 3: Explore My World */}
          <h1
            className="title font-orbitron"
            style={{
              fontSize: 'clamp(1.9rem, 6vw, 4.5rem)',
              position: 'absolute',
              width: '100%',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              letterSpacing: '3px',
              margin: 0,
              pointerEvents: 'none',
            }}
          >
            {renderAnimatedLetters('Explore My World', 'char-p3', {
              color: '#ffffff',
              textShadow: '0 0 25px rgba(0, 216, 255, 0.55)',
            })}
          </h1>
        </div>

        {/* Call to Action Button Container */}
        <div
          style={{
            height: '90px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showButton && (
            <button
              id="jumpInBtn"
              className="btn-custom fade-in d-inline-flex align-items-center gap-3 my-3"
              onClick={() => navigate('/home')}
              onMouseMove={(e) => {
                const btn = e.currentTarget;
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                btn.style.setProperty('--x', `${x}px`);
                btn.style.setProperty('--y', `${y}px`);
              }}
              style={
                {
                  fontSize: '1.25rem',
                  padding: '1.1rem 3.5rem',
                } as React.CSSProperties
              }
            >
              <span>Enter Portfolio</span>
              <ArrowRight size={20} className="text-accent" />
            </button>
          )}
        </div>

        {/* Quick Skip Link */}
        <button
          onClick={() => navigate('/home')}
          className="btn text-secondary small mt-3 link-hover"
          style={{ opacity: 0.6, fontSize: '0.85rem' }}
        >
          Skip Intro →
        </button>
      </div>
    </section>
  );
};

export default Landing;
