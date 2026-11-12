import React, { useEffect, useRef } from "react";

/**
 * A card's resting cipher: its snapshot rendered as living glyphs on a 2D
 * canvas. Every cell holds a printable character tinted by the image beneath
 * it (leaning toward sapphire) and lit by its brightness, so the picture
 * shows through as color while the characters keep scrambling: about a tenth
 * of them change six times a second. That matches the DecryptReveal cipher
 * the card decodes through on hover (cell 10 px, aspect 0.75, colored glyphs
 * over the full printable set, scramble 0.1 at 6/s).
 *
 * It costs no WebGL context, so every card in the index can wear one. It only
 * redraws the cells that change, only while the card is on screen and the
 * tab is visible; reduced motion draws one still frame.
 */

const CELL_H = 10;
const CELL_W = 7.5;
/** The printable set the decode shader scrambles through. */
const CHARS = Array.from({ length: 94 }, (_, i) => String.fromCharCode(33 + i)).join("");
/** Sapphire the glyph colors lean toward. */
const TINT = [96, 165, 250];
const TINT_MIX = 0.35;
const TICK_MS = 1000 / 6;
const SCRAMBLE_SHARE = 0.1;

interface GlyphFieldProps {
  src: string;
  className?: string;
  /** Hold still (the card is decoding, or the act is asleep). */
  paused?: boolean;
}

const GlyphField: React.FC<GlyphFieldProps> = ({ src, className, paused = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let rows = 0;
    let colors: string[] = [];
    let image: HTMLImageElement | null = null;
    let visible = false;
    let timer = 0;
    let disposed = false;

    const randomChar = () => CHARS[(Math.random() * CHARS.length) | 0];

    const drawCell = (i: number, ch: string) => {
      const x = (i % cols) * CELL_W;
      const y = Math.floor(i / cols) * CELL_H;
      ctx.fillStyle = "#050914";
      ctx.fillRect(x, y, CELL_W, CELL_H);
      ctx.fillStyle = colors[i];
      ctx.fillText(ch, x + CELL_W / 2, y + CELL_H / 2);
    };

    const layout = () => {
      if (!image) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL_W);
      rows = Math.ceil(h / CELL_H);
      // Sample the snapshot as the card shows it (cover, top-aligned).
      const sample = document.createElement("canvas");
      sample.width = cols;
      sample.height = rows;
      const sctx = sample.getContext("2d", { willReadFrequently: true });
      if (!sctx) return;
      const scale = Math.max(cols / image.naturalWidth, rows / image.naturalHeight);
      const dw = image.naturalWidth * scale;
      const dh = image.naturalHeight * scale;
      sctx.drawImage(image, (cols - dw) / 2, 0, dw, dh);
      let data: Uint8ClampedArray;
      try {
        data = sctx.getImageData(0, 0, cols, rows).data;
      } catch {
        return; // A snapshot without CORS cannot be read; the plain image shows instead.
      }
      colors = Array.from({ length: cols * rows }, () => "");
      for (let i = 0; i < cols * rows; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        // Image color leaning to sapphire; dark cells stay faintly lit so the
        // cipher reads across the whole card.
        const mix = (c: number, t: number) => Math.round(c * (1 - TINT_MIX) + t * TINT_MIX);
        const alpha = 0.22 + 0.78 * Math.pow(l, 0.75);
        colors[i] =
          `rgba(${mix(r, TINT[0])},${mix(g, TINT[1])},${mix(b, TINT[2])},${alpha.toFixed(3)})`;
      }
      ctx.font = `600 ${CELL_H}px "IBM Plex Mono", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < cols * rows; i++) drawCell(i, randomChar());
      canvas.dataset.ready = "true";
    };

    const tick = () => {
      timer = 0;
      if (disposed) return;
      if (visible && !pausedRef.current && !document.hidden && cols) {
        const n = cols * rows;
        const changes = Math.max(1, Math.round(n * SCRAMBLE_SHARE));
        for (let c = 0; c < changes; c++) {
          drawCell((Math.random() * n) | 0, randomChar());
        }
      }
      if (!reduced) timer = window.setTimeout(tick, TICK_MS);
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => {
      if (disposed) return;
      image = img;
      layout();
      tick();
    };
    img.src = src;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => layout());
    ro.observe(canvas);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      io.disconnect();
      ro.disconnect();
    };
  }, [src]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default GlyphField;
