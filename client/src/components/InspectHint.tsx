import React, { useEffect, useState } from "react";
import { Eye, MousePointerClick } from "lucide-react";
import { AsciiSweep } from "./canvasui/AsciiSweep";
import { ASCII_SWEEP_SPEC } from "./canvasui/spec";
import { useMediaQuery, useReducedMotion } from "../lib/useReducedMotion";

/**
 * The orbit tile's call to action. At rest it reads "Inspect"; on hover or
 * keyboard focus the same AsciiSweep the prologue uses at start-up (owner's
 * spec props) sweeps it into "Click for more info". Only the active tile
 * mounts a sweep, so the orbit costs at most one WebGL context for labels.
 * Leaving the tile drops the shader at once and the label settles back.
 */

const HOVER_INTENT_MS = 110;
const SWEEP_DELAY_MS = 90;

const REST = "Inspect";
const ACTIVE = "Click for more info";

const Label: React.FC<{ text: string; active?: boolean }> = ({ text, active }) => (
  <span className="inspect-hint__label">
    {active ? (
      <MousePointerClick size={12} className="mr-1" aria-hidden="true" />
    ) : (
      <Eye size={12} className="mr-1" aria-hidden="true" />
    )}
    <span>{text}</span>
  </span>
);

interface InspectHintProps {
  active: boolean;
}

const InspectHint: React.FC<InspectHintProps> = ({ active }) => {
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const canSweep = finePointer && !reducedMotion;
  const [mounted, setMounted] = useState(false);
  const [slot, setSlot] = useState<0 | 1>(0);

  useEffect(() => {
    if (!active || !canSweep) {
      const frame = requestAnimationFrame(() => {
        setMounted(false);
        setSlot(0);
      });
      return () => cancelAnimationFrame(frame);
    }
    const mountTimer = window.setTimeout(() => setMounted(true), HOVER_INTENT_MS);
    const sweepTimer = window.setTimeout(() => setSlot(1), HOVER_INTENT_MS + SWEEP_DELAY_MS);
    return () => {
      window.clearTimeout(mountTimer);
      window.clearTimeout(sweepTimer);
    };
  }, [active, canSweep]);

  // Touch has no hover, and reduced motion swaps the words without the sweep.
  const staticText = active && !canSweep && finePointer ? ACTIVE : REST;

  return (
    <div className={`tile-inspect-hint ${active ? "is-active" : ""}`} aria-hidden="true">
      {mounted && active && canSweep ? (
        <AsciiSweep
          className="inspect-hint__sweep"
          {...ASCII_SWEEP_SPEC}
          background="#0b1328"
          index={slot}
          alternate={<Label text={ACTIVE} active />}
        >
          <Label text={REST} />
        </AsciiSweep>
      ) : (
        <Label text={staticText} active={staticText === ACTIVE} />
      )}
    </div>
  );
};

export default InspectHint;
