import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { GithubIcon } from "./Icon";
import BrandMark from "./BrandMark";
import { gsap } from "../lib/gsap";
import { DUR, EASE } from "../lib/motion";
import { actFlowTop, ACT_DORMANT_SHARE, subscribeActs } from "../lib/useActStack";
import { useMediaQuery, useReducedMotion } from "../lib/useReducedMotion";

/**
 * The banner becomes the navbar. At the top of the page the Act I banner
 * (DevHud) is the identity card. Scroll down and a full-width bar grows out
 * of the card's outline (its clip opens from the card's rectangle to the
 * whole top edge) while the card fades away. Scrolling further down tucks the
 * bar away; scrolling up a little brings it back; back at the top it shrinks
 * into the card again.
 *
 * The bar carries links to the acts that are not on screen. As an act slides
 * in, its link leaves the bar and travels, scrubbed to the scroll, to where
 * that act's own heading kicker sits, and lands on it: the link becomes the
 * heading. When the act leaves the screen again, the link returns to the bar.
 * Phones and reduced motion swap the links in place instead of flying them.
 */

const ACTS = [
  { label: "ACT I // ORBIT", short: "I · Orbit" },
  { label: "ACT II // INDEX", short: "II · Index" },
  { label: "ACT III // EVENT HORIZON", short: "III · Horizon" },
];

/** Past this scroll the banner turns into the bar. */
const DOCK_Y = 24;
/** Scrolled down this far beyond where the bar appeared, it tucks away. */
const TUCK_AFTER = 140;
/** Upward scroll that brings it back. */
const REVEAL_UP = 10;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const SiteNav: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const flightRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [docked, setDocked] = useState(true);
  const [tucked, setTucked] = useState(false);
  const reducedMotion = useReducedMotion();
  const wide = useMediaQuery("(min-width: 641px)");
  const fly = wide && !reducedMotion;

  // Docked or bar, and the tuck: from the scroll direction.
  useEffect(() => {
    let lastY = window.scrollY;
    let down = 0;
    let up = 0;
    let barSince = 0;
    let isDocked = true;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (y < DOCK_Y) {
        isDocked = true;
        setDocked(true);
        setTucked(false);
        down = up = 0;
        return;
      }
      if (isDocked) {
        isDocked = false;
        barSince = y;
        setDocked(false);
      }
      if (dy > 0) {
        down += dy;
        up = 0;
        if (down > 48 && y > barSince + TUCK_AFTER) setTucked(true);
      } else if (dy < 0) {
        up -= dy;
        down = 0;
        if (up > REVEAL_UP) setTucked(false);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // The bar grows out of the banner card, or shrinks back into it.
  const firstRun = useRef(true);
  useLayoutEffect(() => {
    const bg = bgRef.current;
    const bar = barRef.current;
    const card = document.querySelector<HTMLElement>(".dev-hud__panel");
    if (!bg || !bar) return;
    const instant = firstRun.current || reducedMotion;
    firstRun.current = false;
    const vw = document.documentElement.clientWidth;
    const barH = bar.offsetHeight;
    const r = card?.getBoundingClientRect();
    const h = Math.max(barH, r ? r.bottom : barH);
    bg.style.height = `${h}px`;
    const cardClip = r
      ? `inset(${r.top}px ${vw - r.right}px ${h - r.bottom}px ${r.left}px round 24px)`
      : `inset(0px 0px ${h - barH}px 0px round 0px)`;
    const barClip = `inset(0px 0px ${h - barH}px 0px round 0px)`;
    const tl = gsap.timeline();
    if (docked) {
      tl.to(bar, { opacity: 0, duration: instant ? 0 : DUR.micro, ease: "none" }, 0);
      tl.fromTo(
        bg,
        { clipPath: barClip },
        { clipPath: cardClip, duration: instant ? 0 : DUR.ui, ease: EASE.out },
        0,
      );
      tl.set(bg, { opacity: 0 });
      if (card) tl.to(card, { opacity: 1, duration: instant ? 0 : DUR.micro }, ">-0.05");
    } else {
      tl.set(bg, { opacity: 1 }, 0);
      tl.fromTo(
        bg,
        { clipPath: cardClip },
        { clipPath: barClip, duration: instant ? 0 : DUR.reveal, ease: EASE.out },
        0,
      );
      if (card) tl.to(card, { opacity: 0, duration: instant ? 0 : DUR.micro }, 0);
      tl.fromTo(
        bar,
        { opacity: 0 },
        { opacity: 1, duration: instant ? 0 : DUR.ui, ease: "none" },
        instant ? 0 : 0.18,
      );
    }
    return () => {
      tl.kill();
    };
  }, [docked, reducedMotion]);

  // The card must not hold focus while the bar stands in for it.
  useEffect(() => {
    const card = document.querySelector<HTMLElement>(".dev-hud__panel");
    if (!card) return;
    card.inert = !docked;
    return () => {
      card.inert = false;
      card.style.opacity = "";
    };
  }, [docked]);

  // Links off screen sit in the bar; an arriving act's link flies to its kicker.
  useEffect(() => {
    const kickers = ACTS.map(() => null as HTMLElement | null);
    const kicker = (k: number) =>
      (kickers[k] ??= document.querySelector<HTMLElement>(`[data-act-kicker="${k}"]`));
    // Flights run only while an act is arriving (gaining screen share). A
    // leaving act simply hands its link back to the bar once it is off screen.
    // NaN until the first frame, so a jump (reload, link) never starts a flight.
    const lastShare = ACTS.map(() => NaN);
    const flying = ACTS.map(() => false);
    const unsubscribe = subscribeActs((frame) => {
      ACTS.forEach((_, k) => {
        const link = linkRefs.current[k];
        const flight = flightRefs.current[k];
        const target = kicker(k);
        if (!link) return;
        const share = frame.share[k] ?? 0;
        const onScreen = share >= ACT_DORMANT_SHARE;
        // How far the link has travelled toward the heading.
        // A scroll that rounds a hair short of full still counts as landed.
        const rawPhi = clamp01((share - ACT_DORMANT_SHARE) / (1 - ACT_DORMANT_SHARE));
        const phi = rawPhi > 0.99 ? 1 : rawPhi;
        const rising = share > lastShare[k] + 1e-4 || (share === lastShare[k] && flying[k]);
        lastShare[k] = share;
        const to = target?.getBoundingClientRect();
        // Only into a heading that is on screen and upright: not in an act that
        // is mid-swirl or shrunk away.
        // Judged from the scroll, not the act's transform (GSAP scrubs that a beat
        // behind): an act being swirled away by the next one is no landing spot.
        const swirling =
          target?.closest<HTMLElement>(".act")?.dataset.exit === "swirl" &&
          (frame.enter[k + 1] ?? 0) > 0.02;
        const landable = !!to && to.bottom > 0 && to.top < frame.vh && !swirling;
        const inFlight = fly && onScreen && rising && phi > 0 && phi < 1 && landable && !!flight;
        flying[k] = inFlight;

        link.classList.toggle("is-away", onScreen);
        link.tabIndex = onScreen ? -1 : 0;
        link.setAttribute("aria-hidden", onScreen ? "true" : "false");

        if (target) target.style.opacity = inFlight ? "0" : "";
        if (!flight) return;
        if (!inFlight || !target || !to) {
          flight.style.visibility = "hidden";
          return;
        }
        const from = (link.querySelector(".site-nav__act-long") ?? link).getBoundingClientRect();
        const t = easeInOut(phi);
        const x = from.left + (to.left - from.left) * t;
        const y = from.top + (to.top - from.top) * t;
        // Text width, not box height: the kickers and the links share a font but
        // not a line box, and width also carries any sink scale on the target.
        const scale = 1 + (to.width / Math.max(1, from.width) - 1) * t;
        flight.style.visibility = "visible";
        flight.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      });
    });
    return () => {
      unsubscribe();
      kickers.forEach((el) => {
        if (el) el.style.opacity = "";
      });
    };
  }, [fly]);

  const goToAct = (k: number) => {
    const act = document.querySelector<HTMLElement>(`.act--${k + 1}`);
    const top = k === 0 || !act ? 0 : actFlowTop(act);
    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <div
      ref={rootRef}
      className={`site-nav ${docked ? "is-docked" : "is-bar"} ${tucked && !docked ? "is-tucked" : ""}`}
      // A keyboard user reaching the tucked bar brings it back.
      onFocus={() => setTucked(false)}
    >
      <div className="site-nav__chrome" inert={docked} aria-hidden={docked ? true : undefined}>
        <div ref={bgRef} className="site-nav__bg" />
        <nav ref={barRef} className="site-nav__bar" aria-label="Site">
          <button
            type="button"
            className="site-nav__brand"
            onClick={() => goToAct(0)}
            aria-label="Jorge Bucio: back to the top"
          >
            <BrandMark size={26} />
            <span className="font-display">Jorge Bucio</span>
          </button>
          <div className="site-nav__acts">
            {ACTS.map((act, k) => (
              <button
                key={act.label}
                ref={(el) => {
                  linkRefs.current[k] = el;
                }}
                type="button"
                className="site-nav__act chapter-kicker"
                onClick={() => goToAct(k)}
              >
                <span className="site-nav__act-long">{act.label}</span>
                <span className="site-nav__act-short">{act.short}</span>
              </button>
            ))}
          </div>
          <div className="site-nav__ext">
            <a
              href="https://github.com/ZynzTehr"
              target="_blank"
              rel="noopener noreferrer"
              className="site-nav__ext-link"
              title="GitHub profile (opens in a new tab)"
            >
              <GithubIcon size={15} />
              <span className="font-telemetry">@ZynzTehr</span>
            </a>
            <a
              href="https://jorgebucio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="site-nav__ext-link"
              title="Interactive profile at jorgebucio.com (opens in a new tab)"
            >
              <Globe size={15} aria-hidden="true" />
              <span>Profile hub</span>
            </a>
          </div>
        </nav>
      </div>
      <div className="site-nav__flights" aria-hidden="true">
        {ACTS.map((act, k) => (
          <span
            key={act.label}
            ref={(el) => {
              flightRefs.current[k] = el;
            }}
            className="site-nav__flight chapter-kicker"
          >
            {act.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SiteNav;
