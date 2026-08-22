import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Terminal } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'name' | 'role' | 'tagline'>('name');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Elegant sequenced text transitions
    const t1 = setTimeout(() => setPhase('role'), 2200);
    const t2 = setTimeout(() => setPhase('tagline'), 4400);
    const t3 = setTimeout(() => setShowButton(true), 5200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section
      id="jumpIn"
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
        <div className="d-flex align-items-center gap-2 mb-4 px-3 py-1 glass-card" style={{ borderRadius: '50px', border: '1px solid var(--accent-color)' }}>
          <Terminal size={14} className="text-accent" />
          <span className="small text-accent font-monospace" style={{ letterSpacing: '1px' }}>
            PORTFOLIO // JORGE BUCIO
          </span>
        </div>

        {/* Dynamic Animated Text Area */}
        <div
          className="text-center mb-4"
          style={{ height: '140px', position: 'relative', width: '100%' }}
        >
          {phase === 'name' && (
            <h1
              className="title text-gradient fade-in"
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
                position: 'absolute',
                width: '100%',
                left: 0,
                top: 0,
                letterSpacing: '4px',
              }}
            >
              Jorge Bucio
            </h1>
          )}

          {phase === 'role' && (
            <h1
              className="title text-gradient fade-in"
              style={{
                fontSize: 'clamp(1.8rem, 6vw, 4rem)',
                position: 'absolute',
                width: '100%',
                left: 0,
                top: 0,
                letterSpacing: '2px',
                color: 'var(--accent-color)',
              }}
            >
              Full-Stack & Web3
            </h1>
          )}

          {phase === 'tagline' && (
            <h1
              className="title text-gradient fade-in"
              style={{
                fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                position: 'absolute',
                width: '100%',
                left: 0,
                top: 0,
                letterSpacing: '3px',
              }}
            >
              Explore 3D Work
            </h1>
          )}
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
