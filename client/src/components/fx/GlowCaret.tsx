import React, { useEffect, useRef, type RefObject } from "react";

/**
 * A glowing caret for a text input. The native caret cannot glow, so the
 * input hides it (caret-color: transparent, in CSS) and this bar stands in:
 * it sits where the native caret would be, measured from the text before the
 * selection start in the input's own font, and follows typing, arrow keys,
 * clicks and horizontal scrolling of long values. It blinks with a soft
 * sapphire glow, holds steady while typing, and disappears while text is
 * selected or the input is not focused. Reduced motion keeps it steady.
 *
 * Render it as a sibling of the input inside a positioned wrapper.
 */
const GlowCaret: React.FC<{ inputRef: RefObject<HTMLInputElement | null> }> = ({ inputRef }) => {
  const caretRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    const caret = caretRef.current;
    if (!input || !caret) return;
    const measureCtx = document.createElement("canvas").getContext("2d");
    let frame = 0;

    const place = () => {
      frame = 0;
      const focused = document.activeElement === input;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? start;
      if (!focused || start !== end || !measureCtx) {
        caret.classList.remove("is-on");
        return;
      }
      const cs = getComputedStyle(input);
      measureCtx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const spacing = parseFloat(cs.letterSpacing) || 0;
      const before = input.value.slice(0, start);
      const textWidth = measureCtx.measureText(before).width + spacing * before.length;
      const padLeft = parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth);
      const padRight = parseFloat(cs.paddingRight) + parseFloat(cs.borderRightWidth);
      const x = Math.min(
        input.offsetLeft + padLeft + textWidth - input.scrollLeft,
        input.offsetLeft + input.offsetWidth - padRight,
      );
      const fontPx = parseFloat(cs.fontSize);
      const height = Math.round(fontPx * 1.3);
      const y = input.offsetTop + (input.offsetHeight - height) / 2;
      caret.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      caret.style.height = `${height}px`;
      caret.classList.add("is-on");
      // Restart the blink so the caret stays lit while typing or moving.
      caret.classList.remove("is-blinking");
      void caret.offsetWidth;
      caret.classList.add("is-blinking");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };

    const inputEvents = ["input", "keydown", "keyup", "click", "focus", "blur", "scroll", "select"];
    inputEvents.forEach((name) => input.addEventListener(name, schedule));
    document.addEventListener("selectionchange", schedule);
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(input);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      inputEvents.forEach((name) => input.removeEventListener(name, schedule));
      document.removeEventListener("selectionchange", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [inputRef]);

  return <span ref={caretRef} className="glow-caret" aria-hidden="true" />;
};

export default GlowCaret;
