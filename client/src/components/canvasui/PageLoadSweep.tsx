import React, {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AsciiSweep, type AsciiSweepOptions } from "./AsciiSweep";
import { ASCII_SWEEP_SPEC } from "./spec";
import { prefersReducedMotion } from "../../lib/useReducedMotion";
import { subscribeActs } from "../../lib/useActStack";

/**
 * upgrades.md: "implement this for text when pages loads". A one-shot
 * AsciiSweep from a blank panel to the real content, at the owner's configured
 * props. The engine unmounts once its own fade-out has finished (FADE_OUT_S
 * 0.45s plus settle frames), so the sweep is never cut short, and the live DOM
 * takes over.
 *
 * `when="visible"` holds the sweep until the block scrolls into view (the act
 * text sections), and mounts the engine only then, so a block far down the
 * page costs no WebGL context until it is reached. Until it has swept in, the
 * real text is invisible but stays in the accessibility tree.
 *
 * `replay` (with "visible") plays it again every time the block comes back
 * into view. The acts are sticky sheets, so a block can stay inside the
 * viewport while the next act covers it: a block counts as gone once it is
 * fully out of the viewport or its act is nine tenths covered (by then the
 * act has faded out), and it plays again once a third of it is in view and
 * its act is no more than half covered.
 *
 * `transparent` keeps the sweep's panels see-through (AsciiSweep), for text
 * that sits on a gradient or a video rather than a flat panel.
 */

const FADE_TAIL_MS = 520;
/** Room past the block for the text glow (its widest layer blurs 18px). */
const GLOW_BLEED_PX = 24;

/**
 * The sweep draws a copy of the content. Drop ids (headings are referenced by
 * aria-labelledby) and act kicker markers (SiteNav looks the kicker up) from
 * the copy, so nothing on the page resolves to it.
 */
function stripIdentity(node: ReactNode): ReactNode {
  return Children.map(node, (child) => {
    if (!isValidElement<Record<string, unknown>>(child)) return child;
    const props: Record<string, unknown> = {};
    if ("id" in child.props) props.id = undefined;
    if ("data-act-kicker" in child.props) props["data-act-kicker"] = undefined;
    if (child.props.children !== undefined)
      props.children = stripIdentity(child.props.children as ReactNode);
    return cloneElement(child, props);
  });
}

interface PageLoadSweepProps extends Omit<AsciiSweepOptions, "onSweepEnd"> {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Fires when the sweep has landed (or immediately under reduced motion). */
  onComplete?: () => void;
  native?: boolean;
  /** "load" sweeps once mounted; "visible" once the block scrolls into view. */
  when?: "load" | "visible";
  /** With "visible": sweep again every time the block comes back into view. */
  replay?: boolean;
}

export const PageLoadSweep: React.FC<PageLoadSweepProps> = ({
  children,
  delayMs = 90,
  className,
  style,
  onComplete,
  native,
  when = "load",
  replay = false,
  ...overrides
}) => {
  const options = { ...ASCII_SWEEP_SPEC, ...overrides };
  const duration = options.duration ?? 2;
  const rootRef = useRef<HTMLDivElement>(null);
  const [slotIndex, setSlotIndex] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(() => prefersReducedMotion());
  const [armed, setArmed] = useState<boolean>(when === "load");
  const onCompleteRef = useRef(onComplete);
  const firedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // "visible": arm once a third of the block is on screen (and, with replay,
  // reset once it has gone; see the header comment).
  const playingRef = useRef(armed);
  useEffect(() => {
    playingRef.current = armed;
  }, [armed]);
  useEffect(() => {
    if (when !== "visible" || prefersReducedMotion()) return;
    if (!replay && (armed || completed)) return;
    const el = rootRef.current;
    if (!el) return;
    const act = el.closest<HTMLElement>(".act");
    const acts = act?.parentElement
      ? Array.from(act.parentElement.querySelectorAll<HTMLElement>(":scope > .act"))
      : [];
    const actIndex = act ? acts.indexOf(act) : -1;
    let ratio = 0;
    let covered = 0;
    const evaluate = () => {
      const playing = playingRef.current;
      if (!playing && ratio >= 0.35 && covered < 0.5) {
        playingRef.current = true;
        setArmed(true);
      } else if (playing && replay && (ratio === 0 || covered >= 0.9)) {
        playingRef.current = false;
        firedRef.current = false;
        setArmed(false);
        setCompleted(false);
        setSlotIndex(0);
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
        evaluate();
      },
      { threshold: [0, 0.35] },
    );
    io.observe(el);
    const unsubscribe =
      actIndex >= 0
        ? subscribeActs((frame) => {
            const next = frame.enter[actIndex + 1] ?? 0;
            if (next === covered) return;
            covered = next;
            evaluate();
          })
        : () => {};
    return () => {
      io.disconnect();
      unsubscribe();
    };
    // armed/completed only gate the one-shot case; the replay loop runs on refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [when, replay, replay ? null : armed, replay ? null : completed]);

  const finish = () => {
    if (!firedRef.current) {
      firedRef.current = true;
      onCompleteRef.current?.();
    }
  };

  useEffect(() => {
    if (completed) {
      finish();
      return;
    }
    if (!armed) return;
    const sweepTimer = window.setTimeout(() => setSlotIndex(1), delayMs);
    // Safety net: if WebGL2 is unavailable the engine never reports an end.
    const cleanupTimer = window.setTimeout(
      () => {
        finish();
        setCompleted(true);
      },
      delayMs + duration * 1000 + FADE_TAIL_MS + 400,
    );
    return () => {
      window.clearTimeout(sweepTimer);
      window.clearTimeout(cleanupTimer);
    };
    // finish only reads refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed, completed, delayMs, duration]);

  // One tree: the real children are always laid out (they are the LCP and
  // never remount). Opaque panels cover them until the sweep lands; with
  // see-through panels, and before a "visible" sweep is armed, they are
  // invisible instead.
  const hideReal = !completed && (options.transparent || !armed);
  // The sweep draws its copy into a canvas, which crops anything painted past
  // its edges, such as the text glow. See-through panels get a canvas that
  // bleeds past the block on every side, with the copy padded by the same
  // amount so it still lines up with the real text. An opaque panel keeps
  // the block's exact box, or its background would cover the neighbours.
  const bleed = options.transparent ? GLOW_BLEED_PX : 0;
  return (
    <div
      ref={rootRef}
      className={className}
      data-ascii-reveal=""
      style={{ position: "relative", ...style }}
    >
      <div style={hideReal ? { opacity: 0 } : undefined}>{children}</div>
      {armed && !completed ? (
        <AsciiSweep
          {...options}
          native={native}
          index={slotIndex}
          style={{ position: "absolute", inset: -bleed }}
          onSweepEnd={() => {
            finish();
            window.setTimeout(() => setCompleted(true), FADE_TAIL_MS);
          }}
          alternate={
            <div aria-hidden="true" style={bleed ? { padding: bleed } : undefined}>
              {stripIdentity(children)}
            </div>
          }
        >
          <div className="w-full h-full" />
        </AsciiSweep>
      ) : null}
    </div>
  );
};

export default PageLoadSweep;
