import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { GithubIcon } from "./Icon";
import BrandMark from "./BrandMark";
import { cssEase, DUR, EASE } from "../lib/motion";
import { actFlowTop, ACT_DORMANT_SHARE, subscribeActs } from "../lib/useActStack";
import { useReducedMotion } from "../lib/useReducedMotion";

/**
 * The banner becomes the navbar. At the top of the page the Act I banner
 * (DevHud) is the identity card. Scroll down and a full-width bar grows out
 * of the card's outline (its clip opens from the card's rectangle to the
 * whole top edge) while the card fades away. Scrolling further down tucks the
 * bar away; scrolling up a little brings it back; back at the top it shrinks
 * into the card again.
 *
 * The bar carries links to the acts that are not on screen. As an act slides
 * in, its link fades out of the bar while that act's own heading kicker fades
 * in on the act, scrubbed to the scroll; when the act leaves, the link fades
 * back into the bar.
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

const SiteNav: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [docked, setDocked] = useState(true);
  const [tucked, setTucked] = useState(false);
  const reducedMotion = useReducedMotion();

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

  // The bar grows out of the banner card, or shrinks back into it. Web
  // Animations, not a GSAP timeline: the card holds ~40 elements and a
  // per-frame inline style write restyles them all under an ad blocker's
  // injected stylesheet. Each change starts from what is on screen (a running
  // morph included), so a quick dock/undock reverses smoothly.
  const firstRun = useRef(true);
  const morphRef = useRef<Animation[]>([]);
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
    bg.style.height = `${h}px`; // bg has no children: cheap
    const cardClip = r
      ? `inset(${r.top}px ${vw - r.right}px ${h - r.bottom}px ${r.left}px round 24px)`
      : `inset(0px 0px ${h - barH}px 0px round 0px)`;
    const barClip = `inset(0px 0px ${h - barH}px 0px round 0px)`;
    const opacityOf = (el: Element) => getComputedStyle(el).opacity;
    const barFrom = opacityOf(bar);
    const cardFrom = card ? opacityOf(card) : "1";
    morphRef.current.forEach((a) => a.cancel());
    const ms = (s: number) => (instant ? 0 : s * 1000);
    const easeOut = cssEase(EASE.out);
    const hold = { fill: "both" } as const;
    const next: Animation[] = [];
    if (docked) {
      next.push(
        bar.animate([{ opacity: barFrom }, { opacity: 0 }], { duration: ms(DUR.micro), ...hold }),
        bg.animate([{ clipPath: barClip }, { clipPath: cardClip }], {
          duration: ms(DUR.ui),
          easing: easeOut,
          ...hold,
        }),
        // The bar backdrop disappears once it has shrunk onto the card.
        bg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 0, delay: ms(DUR.ui), ...hold }),
      );
      if (card)
        next.push(
          // Back at once, under the backdrop shrinking onto it, so nothing
          // flashes when the backdrop goes.
          card.animate([{ opacity: cardFrom }, { opacity: 1 }], {
            duration: ms(DUR.micro),
            ...hold,
          }),
        );
    } else {
      next.push(
        bg.animate([{ opacity: 1 }], { duration: 0, fill: "forwards" }),
        bg.animate([{ clipPath: cardClip }, { clipPath: barClip }], {
          duration: ms(DUR.reveal),
          easing: easeOut,
          ...hold,
        }),
        bar.animate([{ opacity: barFrom }, { opacity: 1 }], {
          duration: ms(DUR.ui),
          delay: instant ? 0 : 180,
          ...hold,
        }),
      );
      if (card)
        next.push(
          card.animate([{ opacity: cardFrom }, { opacity: 0 }], {
            duration: ms(DUR.micro),
            ...hold,
          }),
        );
    }
    morphRef.current = next;
  }, [docked, reducedMotion]);
  useEffect(
    () => () => {
      morphRef.current.forEach((a) => a.cancel());
      morphRef.current = [];
    },
    [],
  );

  // The card must not hold focus while the bar stands in for it.
  useEffect(() => {
    const card = document.querySelector<HTMLElement>(".dev-hud__panel");
    if (!card) return;
    card.inert = !docked;
    return () => {
      card.inert = false;
    };
  }, [docked]);

  // A crossfade, in place, scrubbed to the scroll: as an act arrives its link
  // fades out of the bar while the act's own kicker fades in; as it leaves,
  // the reverse. Nothing travels, so nothing lags behind a moving sheet.
  // The opacities are paused animations seeked to the scroll, not inline
  // styles: an inline write restyles the element's subtree in browsers whose
  // ad blocker injects its cosmetic stylesheet, and this runs every frame.
  useEffect(() => {
    const fade = (el: Element, from: number, to: number) => {
      const a = el.animate([{ opacity: from }, { opacity: to }], { duration: 1000, fill: "both" });
      a.pause();
      return a;
    };
    const linkFades = ACTS.map(() => null as Animation | null);
    const kickerFades = ACTS.map(() => null as Animation | null);
    const linkFade = (k: number) => {
      const link = linkRefs.current[k];
      return link ? (linkFades[k] ??= fade(link, 1, 0)) : null;
    };
    const kickerFade = (k: number) => {
      const el = document.querySelector(`[data-act-kicker="${k}"]`);
      return el ? (kickerFades[k] ??= fade(el, 0, 1)) : null;
    };
    const unsubscribe = subscribeActs((frame) => {
      ACTS.forEach((_, k) => {
        const link = linkRefs.current[k];
        if (!link) return;
        const share = frame.share[k] ?? 0;
        const onScreen = share >= ACT_DORMANT_SHARE;
        // 0 while the act is off screen, 1 once it fills the screen. A scroll
        // that rounds a hair short of full still counts as full.
        const raw = clamp01((share - ACT_DORMANT_SHARE) / (1 - ACT_DORMANT_SHARE));
        const phi = raw > 0.99 ? 1 : raw;
        const at = phi * 1000;
        const linkAnim = linkFade(k);
        if (linkAnim && linkAnim.currentTime !== at) linkAnim.currentTime = at;
        link.classList.toggle("is-away", onScreen);
        link.tabIndex = onScreen ? -1 : 0;
        link.setAttribute("aria-hidden", onScreen ? "true" : "false");
        const kickerAnim = kickerFade(k);
        if (kickerAnim && kickerAnim.currentTime !== at) kickerAnim.currentTime = at;
      });
    });
    return () => {
      unsubscribe();
      [...linkFades, ...kickerFades].forEach((a) => a?.cancel());
    };
  }, []);

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
    </div>
  );
};

export default SiteNav;
