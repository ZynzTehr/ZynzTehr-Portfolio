import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ArrowUp } from 'lucide-react';
import reactSvg from '../assets/react.svg';

interface ScrollWidgetProps {
  onBackToTop: () => void;
  onScrollDown?: () => void;
}

const ScrollWidget: React.FC<ScrollWidgetProps> = ({ onBackToTop, onScrollDown }) => {
  const [scrollState, setScrollState] = useState<'top' | 'scrolling' | 'bottom'>('top');
  const widgetRef = useRef<HTMLElement>(null);
  const atomImgRef = useRef<HTMLImageElement>(null);

  // Velocity, progress & rotation physics tracking
  const rotationRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const progressRef = useRef<number>(0);
  const currentYRef = useRef<number>(180);
  const targetYRef = useRef<number>(180);
  const lastScrollYRef = useRef<number>(0);
  const lastScrollTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    lastScrollTimeRef.current = performance.now();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const now = performance.now();
      const timeDelta = Math.max(1, now - lastScrollTimeRef.current);
      const scrollDelta = currentScrollY - lastScrollYRef.current;

      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = Math.max(1, docHeight - winHeight);
      const progress = Math.min(1, Math.max(0, currentScrollY / maxScroll));
      progressRef.current = progress;

      // Determine state based on scroll progress & bottom proximity
      const isBottom = progress >= 0.88 || (winHeight + currentScrollY >= docHeight - 80);
      const isTop = progress <= 0.05 && currentScrollY < 120;

      if (isBottom) {
        setScrollState('bottom');
      } else if (isTop) {
        setScrollState('top');
      } else {
        setScrollState('scrolling');
      }

      // Calculate instantaneous scroll speed (px/ms)
      const scrollSpeed = (scrollDelta / timeDelta) * 16;
      velocityRef.current += scrollSpeed;
      velocityRef.current = Math.max(-50, Math.min(50, velocityRef.current));

      lastScrollYRef.current = currentScrollY;
      lastScrollTimeRef.current = now;
    };

    // Initial position & state check
    handleScroll();

    // Physics animation loop (smooth 60-120fps direct GPU transform)
    const updatePhysics = () => {
      const isMobile = window.innerWidth <= 768;
      const baseSpeed = 0.75;
      rotationRef.current += baseSpeed + velocityRef.current;

      // Apply friction damping
      velocityRef.current *= 0.92;
      if (Math.abs(velocityRef.current) < 0.005) {
        velocityRef.current = 0;
      }

      if (atomImgRef.current) {
        atomImgRef.current.style.transform = `rotate(${rotationRef.current % 360}deg)`;
      }

      // Calculate vertical screen travel from top to bottom
      const winHeight = window.innerHeight;
      const hudEl = document.querySelector('.dev-hud') as HTMLElement | null;
      let startTopOffset = isMobile ? 220 : 160;
      if (hudEl) {
        startTopOffset = hudEl.offsetTop + hudEl.offsetHeight + 10;
      }
      
      const bottomMargin = isMobile ? 65 : 75;
      startTopOffset = Math.min(startTopOffset, winHeight - bottomMargin - 40);
      const travelRange = Math.max(0, (winHeight - bottomMargin) - startTopOffset);
      targetYRef.current = startTopOffset + progressRef.current * travelRange;

      // Smooth vertical lerp interpolation
      currentYRef.current += (targetYRef.current - currentYRef.current) * 0.18;

      if (widgetRef.current) {
        widgetRef.current.style.transform = `translate3d(0, ${currentYRef.current}px, 0)`;
      }

      rafIdRef.current = requestAnimationFrame(updatePhysics);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    rafIdRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (scrollState === 'bottom' || scrollState === 'scrolling') {
      onBackToTop();
    } else {
      if (onScrollDown) {
        onScrollDown();
      } else {
        window.scrollTo({ top: 480, behavior: 'smooth' });
      }
    }
  };

  return (
    <aside
      ref={widgetRef}
      className={`cyber-scroll-widget state-${scrollState}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title={scrollState === 'bottom' || scrollState === 'scrolling' ? 'Back to Top' : 'Scroll Down'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="scroll-widget-atom-wrap">
        <img
          ref={atomImgRef}
          src={reactSvg}
          alt="React Atom"
          className="scroll-widget-react-svg"
        />
        <div className="atom-core-glow" />
      </div>

      <div className="scroll-widget-label-group">
        <span className="scroll-widget-text font-orbitron">
          {scrollState === 'bottom' ? 'BACK TO TOP' : 'SCROLL DOWN'}
        </span>
        <div className="scroll-widget-icon-sub">
          {scrollState === 'bottom' ? (
            <ArrowUp size={13} className="widget-arrow-icon text-accent" />
          ) : (
            <ChevronDown size={13} className="widget-arrow-icon text-accent bounce-subtle" />
          )}
        </div>
      </div>
    </aside>
  );
};

export default ScrollWidget;
