import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { AsciiSweep, type AsciiSweepOptions } from "./AsciiSweep";
import { ASCII_SWEEP_SPEC } from "./spec";
import { prefersReducedMotion } from "../../lib/useReducedMotion";

/**
 * upgrades.md: "implement this for text when pages loads". A one-shot
 * AsciiSweep from a blank panel to the real content, at the owner's configured
 * props. The engine unmounts once its own fade-out has finished (FADE_OUT_S
 * 0.45s plus settle frames), so the sweep is never cut short, and the live DOM
 * takes over.
 */

const FADE_TAIL_MS = 520;

interface PageLoadSweepProps extends Omit<AsciiSweepOptions, "onSweepEnd"> {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Fires when the sweep has landed (or immediately under reduced motion). */
  onComplete?: () => void;
  native?: boolean;
}

export const PageLoadSweep: React.FC<PageLoadSweepProps> = ({
  children,
  delayMs = 90,
  className,
  style,
  onComplete,
  native,
  ...overrides
}) => {
  const options = { ...ASCII_SWEEP_SPEC, ...overrides };
  const duration = options.duration ?? 2;
  const [slotIndex, setSlotIndex] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(() => prefersReducedMotion());
  const onCompleteRef = useRef(onComplete);
  const firedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

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
  }, [completed, delayMs, duration]);

  // One tree: the real children paint from the first frame (they are the LCP
  // and never remount), and the sweep's opaque panels cover them until it lands.
  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <div>{children}</div>
      {!completed ? (
        <AsciiSweep
          {...options}
          native={native}
          index={slotIndex}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          onSweepEnd={() => {
            finish();
            window.setTimeout(() => setCompleted(true), FADE_TAIL_MS);
          }}
          alternate={<div aria-hidden="true">{children}</div>}
        >
          <div className="w-full h-full" />
        </AsciiSweep>
      ) : null}
    </div>
  );
};

export default PageLoadSweep;
