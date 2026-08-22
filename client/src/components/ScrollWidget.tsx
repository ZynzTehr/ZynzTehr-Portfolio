import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ArrowUp } from 'lucide-react';
import reactSvg from '../assets/react.svg';

interface ScrollWidgetProps {
  onBackToTop: () => void;
  onScrollDown?: () => void;
}

const ScrollWidget: React.FC<ScrollWidgetProps> = ({ onBackToTop, onScrollDown }) => {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const atomImgRef = useRef<HTMLImageElement>(null);

  // Velocity & rotation physics tracking
  const rotationRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
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

      // Scroll threshold for state change
      setIsScrolledDown(currentScrollY > 260);

      // Calculate instantaneous scroll speed (px/ms)
      const scrollSpeed = (scrollDelta / timeDelta) * 16;
      // Add directional momentum: faster scrolling adds faster rotation
      velocityRef.current += scrollSpeed;

      // Clamp velocity to ensure a smooth, comfortable visual range
      velocityRef.current = Math.max(-50, Math.min(50, velocityRef.current));

      lastScrollYRef.current = currentScrollY;
      lastScrollTimeRef.current = now;
    };

    // Physics animation loop (smooth 60-120fps direct GPU transform)
    const updatePhysics = () => {
      // Baseline gentle idle rotation (0.75 deg/frame)
      const baseSpeed = 0.75;

      // Update rotation angle with base speed + scroll momentum
      rotationRef.current += baseSpeed + velocityRef.current;

      // Apply friction damping (0.92 per frame)
      velocityRef.current *= 0.92;
      if (Math.abs(velocityRef.current) < 0.005) {
        velocityRef.current = 0;
      }

      // Directly update transform style without React re-render overhead
      if (atomImgRef.current) {
        atomImgRef.current.style.transform = `rotate(${rotationRef.current % 360}deg)`;
      }

      rafIdRef.current = requestAnimationFrame(updatePhysics);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafIdRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (isScrolledDown) {
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
      className={`cyber-scroll-widget ${isScrolledDown ? 'mode-back-top' : 'mode-scroll-down'}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title={isScrolledDown ? 'Back to Top' : 'Scroll Down'}
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
          {isScrolledDown ? 'BACK TO TOP' : 'SCROLL DOWN'}
        </span>
        <div className="scroll-widget-icon-sub">
          {isScrolledDown ? (
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
