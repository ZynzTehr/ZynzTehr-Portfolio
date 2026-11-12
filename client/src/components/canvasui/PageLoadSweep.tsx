import React, { useEffect, useState, type ReactNode } from "react";
import { AsciiSweep, type AsciiSweepOptions } from "./AsciiSweep";

interface PageLoadSweepProps extends Omit<AsciiSweepOptions, "onSweepEnd"> {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const PageLoadSweep: React.FC<PageLoadSweepProps> = ({
  children,
  delayMs = 90,
  className,
  style,
  duration = 1.25,
  color = "#60a5fa",
  background = "#0a1124",
  glow = 1.85,
  band = 0.3,
  scale = 2,
  ...rest
}) => {
  const [slotIndex, setSlotIndex] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (completed) return;
    const sweepTimer = window.setTimeout(() => {
      setSlotIndex(1);
    }, delayMs);
    const cleanupTimer = window.setTimeout(
      () => {
        setCompleted(true);
      },
      delayMs + duration * 1000 + 550,
    );
    return () => {
      window.clearTimeout(sweepTimer);
      window.clearTimeout(cleanupTimer);
    };
  }, [completed, delayMs, duration]);

  if (completed) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <div aria-hidden="true" style={{ visibility: "hidden", pointerEvents: "none" }}>
        {children}
      </div>
      <AsciiSweep
        index={slotIndex}
        duration={duration}
        color={color}
        background={background}
        glow={glow}
        band={band}
        scale={scale}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        onSweepEnd={() => setCompleted(true)}
        alternate={children}
        {...rest}
      >
        <div className="w-full h-full" />
      </AsciiSweep>
    </div>
  );
};

export default PageLoadSweep;
