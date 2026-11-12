import React, { useEffect, useRef, type ReactNode } from "react";
import { initPixelRippleButton, type PixelRippleOptions } from "./pixelRipple";

/**
 * The Fleet Pulse pixel-ripple surface, re-colored for the Orbital Telemetry
 * palette. A 2D canvas of tiles glows under the pointer, tilts the button
 * toward the cursor and sends a ripple from the press point. It uses no WebGL
 * context, so it can sit on every text button without touching the shader
 * budget.
 */

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg" | "icon";

const PALETTES: Record<Variant, PixelRippleOptions> = {
  primary: {
    pixelSize: 5,
    gap: 1,
    baseColor: "#4474ff",
    hoverGlowColor: "#60a5fa",
    rippleWaveColor: "#93c5fd",
    ripplePeakColor: "#eaf2ff",
    alphaScale: 1,
  },
  secondary: {
    pixelSize: 4,
    gap: 1,
    baseColor: "#4474ff",
    hoverGlowColor: "#60a5fa",
    rippleWaveColor: "#93c5fd",
    ripplePeakColor: "#dbeafe",
    alphaScale: 0.5,
  },
};

/** Close buttons warm to red under the pointer: tiles, glow and ripple. */
const DANGER_PALETTE: PixelRippleOptions = {
  baseColor: "#ff2d2d",
  hoverGlowColor: "#ff5c5c",
  rippleWaveColor: "#ff8a8a",
  ripplePeakColor: "#ffd1d1",
  alphaScale: 1,
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  /**
   * Delay the action so the ripple lands first (ms). The button then acts once
   * and locks, which suits navigation such as the Launch CTA.
   */
  delayActivate?: number;
  /** Called after the delay when delayActivate is set. */
  onActivate?: () => void;
  wrapperClassName?: string;
  /** A dismissive action (close): the surface turns red under a hovering pointer. */
  danger?: boolean;
}

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    as?: "button";
  };

type AnchorProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
    as: "a";
    href: string;
  };

export type PixelButtonProps = ButtonProps | AnchorProps;

export const PixelButton = React.forwardRef<HTMLElement, PixelButtonProps>(
  function PixelButton(props, forwardedRef) {
    const {
      variant = "secondary",
      size = "md",
      children,
      className,
      delayActivate,
      onActivate,
      wrapperClassName,
      danger = false,
      ...rest
    } = props;
    const ref = useRef<HTMLElement | null>(null);
    const handleRef = useRef<ReturnType<typeof initPixelRippleButton> | null>(null);
    const activateRef = useRef(onActivate);

    useEffect(() => {
      activateRef.current = onActivate;
    }, [onActivate]);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const handle = initPixelRippleButton(el as HTMLButtonElement, {
        ...PALETTES[variant],
        actionDelay: delayActivate ?? 0,
        onClick: delayActivate !== undefined ? () => activateRef.current?.() : null,
      });
      handleRef.current = handle;
      return () => {
        handleRef.current = null;
        handle.destroy();
      };
      // The delay is fixed for the button's lifetime; the palette follows below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Variant changes (a category pill turning active) repaint without a remount,
    // so the press ripple that caused the change keeps playing.
    useEffect(() => {
      handleRef.current?.setPalette(PALETTES[variant]);
    }, [variant]);

    // Danger buttons swap to the red palette while hovered (pointers that hover)
    // and back on exit, on the same canvas, so a running ripple keeps playing.
    useEffect(() => {
      const el = ref.current;
      if (!danger || !el) return;
      let hot = false;
      const canHover = window.matchMedia("(hover: hover)");
      const sync = () => {
        const next = canHover.matches && el.matches(":hover");
        if (next === hot) return;
        hot = next;
        handleRef.current?.setPalette(
          hot ? { ...PALETTES[variant], ...DANGER_PALETTE } : PALETTES[variant],
        );
      };
      const events = ["pointerenter", "pointerleave"] as const;
      // Leave fires before :hover clears, so read the state a frame later.
      const onEvent = () => requestAnimationFrame(sync);
      events.forEach((name) => el.addEventListener(name, onEvent));
      return () => {
        events.forEach((name) => el.removeEventListener(name, onEvent));
        handleRef.current?.setPalette(PALETTES[variant]);
      };
    }, [danger, variant]);

    const setRef = (node: HTMLElement | null) => {
      ref.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    const classes = `pixel-btn pixel-btn--${variant} pixel-btn--${size} ${danger ? "pixel-btn--danger" : ""} ${className ?? ""}`;
    const label = <span className="pixel-btn__label">{children}</span>;

    if (rest.as === "a") {
      const { as: _as, ...anchorProps } = rest;
      return (
        <span className={`pixel-ripple-wrapper ${wrapperClassName ?? ""}`}>
          <a ref={setRef} className={classes} {...anchorProps}>
            {label}
          </a>
        </span>
      );
    }

    const { as: _as, type = "button", ...buttonProps } = rest as ButtonProps;
    return (
      <span className={`pixel-ripple-wrapper ${wrapperClassName ?? ""}`}>
        <button ref={setRef} type={type} className={classes} {...buttonProps}>
          {label}
        </button>
      </span>
    );
  },
);

export default PixelButton;
