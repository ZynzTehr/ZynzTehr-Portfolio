import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "../lib/useReducedMotion";

interface ScrollWidgetProps {
  onBackToTop: () => void;
}

/**
 * The React atom with its chevron (no label, per the owner). It rides down the
 * right edge as the page scrolls, spins with scroll velocity, and a ring around
 * the atom fills with progress. At the top the chevron points down and takes
 * the visitor to the index; anywhere else it turns to point up and returns to
 * the top. The animation loop sleeps whenever the widget has settled.
 */

const RING_R = 21;
const RING_C = 2 * Math.PI * RING_R;

const ReactAtom: React.FC = () => (
  <svg viewBox="-11.5 -10.23 23 20.46" className="scroll-widget-atom" aria-hidden="true">
    <circle r="2.05" fill="#93c5fd" />
    <g stroke="#60a5fa" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const ScrollWidget: React.FC<ScrollWidgetProps> = ({ onBackToTop }) => {
  const reducedMotion = useReducedMotion();
  const [atTop, setAtTop] = useState(true);
  const widgetRef = useRef<HTMLButtonElement>(null);
  const atomRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const widget = widgetRef.current;
    if (!widget) return;

    let rotation = 0;
    let velocity = 0;
    let progress = 0;
    let currentY = -1;
    let targetY = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;
    let running = false;
    let startTop = 160;
    let bottomMargin = 75;

    const measure = () => {
      const hud = document.querySelector<HTMLElement>(".dev-hud");
      const mobile = window.innerWidth <= 768;
      bottomMargin = mobile ? 84 : 78;
      startTop = hud
        ? hud.getBoundingClientRect().bottom + window.scrollY + 12
        : mobile
          ? 220
          : 160;
      startTop = Math.min(startTop, window.innerHeight - bottomMargin - 40);
      // Phones: no travel. It rests in the thumb zone and never crosses content.
      if (mobile) startTop = window.innerHeight - bottomMargin;
    };

    const frame = () => {
      raf = 0;
      if (!reducedMotion) rotation += 0.6 + velocity;
      velocity *= 0.92;
      if (Math.abs(velocity) < 0.01) velocity = 0;

      const travel = Math.max(0, window.innerHeight - bottomMargin - startTop);
      targetY = startTop + progress * travel;
      currentY = currentY < 0 || reducedMotion ? targetY : currentY + (targetY - currentY) * 0.18;
      if (Math.abs(targetY - currentY) < 0.3) currentY = targetY;

      widget.style.transform = `translate3d(0, ${currentY.toFixed(1)}px, 0)`;
      if (atomRef.current)
        atomRef.current.style.transform = `rotate(${(rotation % 360).toFixed(1)}deg)`;

      // Keep spinning gently while visible; settle the loop only under reduced motion.
      const settled = currentY === targetY && velocity === 0;
      if (!settled || !reducedMotion) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const now = performance.now();
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress = Math.min(1, Math.max(0, y / max));
      velocity = Math.max(
        -40,
        Math.min(40, velocity + ((y - lastY) / Math.max(1, now - lastT)) * 16),
      );
      lastY = y;
      lastT = now;
      setAtTop(y < 120);
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(RING_C * (1 - progress));
      wake();
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    // Pause entirely when the tab is hidden.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        running = false;
      } else wake();
    };

    measure();
    const first = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(measure);
    const hud = document.querySelector(".dev-hud");
    if (hud) ro.observe(hud);

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
    };
  }, [reducedMotion]);

  const handleClick = () => {
    if (!atTop) {
      onBackToTop();
      return;
    }
    document
      .getElementById("index")
      ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  const label = atTop ? "Scroll to the index" : "Back to top";

  return (
    <button
      ref={widgetRef}
      type="button"
      className={`scroll-widget ${atTop ? "is-top" : "is-away"}`}
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      <span className="scroll-widget__dial" aria-hidden="true">
        <svg className="scroll-widget__ring" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r={RING_R} className="scroll-widget__ring-track" />
          <circle
            ref={ringRef}
            cx="24"
            cy="24"
            r={RING_R}
            className="scroll-widget__ring-fill"
            style={{ strokeDasharray: RING_C, strokeDashoffset: RING_C }}
          />
        </svg>
        <span ref={atomRef} className="scroll-widget__atom">
          <ReactAtom />
        </span>
      </span>
      <span className="scroll-widget__chevron" aria-hidden="true">
        <ChevronDown size={16} />
      </span>
    </button>
  );
};

export default ScrollWidget;
