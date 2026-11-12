interface FallbackRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface FallbackPaintState {
  style: CSSStyleDeclaration;
  visible: boolean;
  opacity: number;
  clip: FallbackRect;
  childrenClip: FallbackRect;
}

function intersectFallbackRects(first: FallbackRect, second: FallbackRect): FallbackRect {
  return {
    left: Math.max(first.left, second.left),
    top: Math.max(first.top, second.top),
    right: Math.min(first.right, second.right),
    bottom: Math.min(first.bottom, second.bottom),
  };
}

export function paintFallbackSnapshot(
  content: HTMLElement,
  canvas: HTMLCanvasElement,
  dpr: number,
) {
  const rootRect = content.getBoundingClientRect();
  const width = Math.max(1, Math.round(rootRect.width * dpr));
  const height = Math.max(1, Math.round(rootRect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas is unavailable");
  ctx.resetTransform();
  ctx.clearRect(0, 0, width, height);
  ctx.scale(dpr, dpr);

  const rootClip: FallbackRect = {
    left: rootRect.left,
    top: rootRect.top,
    right: rootRect.right,
    bottom: rootRect.bottom,
  };
  const states = new WeakMap<Element, FallbackPaintState>();

  function resolveState(element: Element): FallbackPaintState {
    const cached = states.get(element);
    if (cached) return cached;

    const parent = element.parentElement;
    const parentState = parent && content.contains(parent) ? resolveState(parent) : null;
    const style = getComputedStyle(element);
    const ownOpacity = Number.parseFloat(style.opacity);
    const opacity = (parentState?.opacity ?? 1) * (Number.isFinite(ownOpacity) ? ownOpacity : 1);
    const visible =
      (parentState?.visible ?? true) &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.visibility !== "collapse" &&
      opacity > 0;
    const clip = parentState?.childrenClip ?? rootClip;
    const rect = element.getBoundingClientRect();
    const childrenClip = { ...clip };
    if (style.overflowX !== "visible") {
      childrenClip.left = Math.max(childrenClip.left, rect.left);
      childrenClip.right = Math.min(childrenClip.right, rect.right);
    }
    if (style.overflowY !== "visible") {
      childrenClip.top = Math.max(childrenClip.top, rect.top);
      childrenClip.bottom = Math.min(childrenClip.bottom, rect.bottom);
    }

    const state = { style, visible, opacity, clip, childrenClip };
    states.set(element, state);
    return state;
  }

  const walker = document.createTreeWalker(content, NodeFilter.SHOW_ELEMENT);
  let current: Node | null = walker.currentNode;
  while (current) {
    if (current instanceof SVGElement && !(current instanceof SVGSVGElement)) {
      current = walker.nextNode();
      continue;
    }
    const element = current as HTMLElement;
    const rect = element.getBoundingClientRect();
    const state = resolveState(element);
    const visibleRect = intersectFallbackRects(rect, state.clip);
    if (
      state.visible &&
      visibleRect.right > visibleRect.left &&
      visibleRect.bottom > visibleRect.top
    ) {
      const { style } = state;
      ctx.save();
      ctx.beginPath();
      ctx.rect(
        state.clip.left - rootRect.left,
        state.clip.top - rootRect.top,
        state.clip.right - state.clip.left,
        state.clip.bottom - state.clip.top,
      );
      ctx.clip();
      ctx.globalAlpha = state.opacity;
      const x = rect.left - rootRect.left;
      const y = rect.top - rootRect.top;

      if (
        style.backgroundColor &&
        style.backgroundColor !== "transparent" &&
        style.backgroundColor !== "rgba(0, 0, 0, 0)"
      ) {
        ctx.fillStyle = style.backgroundColor;
        ctx.fillRect(x, y, rect.width, rect.height);
      }

      if (current instanceof SVGSVGElement) {
        paintFallbackSvg(ctx, current, rect, rootRect);
      } else {
        paintFallbackMedia(ctx, element, style, rect, rootRect);
        paintFallbackText(ctx, element, style, rootRect);
        paintFallbackBorders(ctx, style, rect, rootRect);
      }
      ctx.restore();
    }
    current = walker.nextNode();
  }
  ctx.globalAlpha = 1;
}

function paintFallbackSvg(
  ctx: CanvasRenderingContext2D,
  svg: SVGSVGElement,
  rect: DOMRect,
  rootRect: DOMRect,
) {
  if (rect.width <= 0 || rect.height <= 0) return;
  const vb = svg.viewBox?.baseVal;
  const vbW = vb && vb.width > 0 ? vb.width : rect.width;
  const vbH = vb && vb.height > 0 ? vb.height : rect.height;
  const vbX = vb ? vb.x : 0;
  const vbY = vb ? vb.y : 0;

  ctx.save();
  ctx.translate(rect.left - rootRect.left, rect.top - rootRect.top);
  ctx.scale(rect.width / vbW, rect.height / vbH);
  ctx.translate(-vbX, -vbY);

  const shapes = svg.querySelectorAll("rect, circle, ellipse, polygon, path, line");
  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    // Definitions, masks and patterns are never rendered directly.
    if (shape.closest("defs, clipPath, mask, pattern, symbol, marker")) continue;
    const computed = getComputedStyle(shape);
    if (computed.display === "none" || computed.visibility === "hidden") continue;
    const fill = shape.getAttribute("fill") || computed.fill;
    const stroke = shape.getAttribute("stroke") || computed.stroke;
    const strokeW = Number.parseFloat(
      shape.getAttribute("stroke-width") || computed.strokeWidth || "1",
    );
    const op = Number.parseFloat(shape.getAttribute("opacity") || computed.opacity || "1");
    ctx.save();
    ctx.globalAlpha *= Number.isFinite(op) ? op : 1;

    let path2d: Path2D | null = null;
    const tag = shape.tagName.toLowerCase();
    if (tag === "path") {
      const d = shape.getAttribute("d");
      if (d) path2d = new Path2D(d);
    } else if (tag === "rect") {
      const rx = Number.parseFloat(shape.getAttribute("x") || "0");
      const ry = Number.parseFloat(shape.getAttribute("y") || "0");
      const rw = Number.parseFloat(shape.getAttribute("width") || String(vbW));
      const rh = Number.parseFloat(shape.getAttribute("height") || String(vbH));
      path2d = new Path2D();
      path2d.rect(rx, ry, rw, rh);
    } else if (tag === "circle") {
      const cx = Number.parseFloat(shape.getAttribute("cx") || "0");
      const cy = Number.parseFloat(shape.getAttribute("cy") || "0");
      const r = Number.parseFloat(shape.getAttribute("r") || "0");
      if (r > 0) {
        path2d = new Path2D();
        path2d.arc(cx, cy, r, 0, Math.PI * 2);
      }
    } else if (tag === "polygon") {
      const pts = (shape.getAttribute("points") || "")
        .trim()
        .split(/[\s,]+/)
        .map(Number);
      if (pts.length >= 4) {
        path2d = new Path2D();
        path2d.moveTo(pts[0], pts[1]);
        for (let p = 2; p + 1 < pts.length; p += 2) {
          path2d.lineTo(pts[p], pts[p + 1]);
        }
        path2d.closePath();
      }
    } else if (tag === "line") {
      const x1 = Number.parseFloat(shape.getAttribute("x1") || "0");
      const y1 = Number.parseFloat(shape.getAttribute("y1") || "0");
      const x2 = Number.parseFloat(shape.getAttribute("x2") || "0");
      const y2 = Number.parseFloat(shape.getAttribute("y2") || "0");
      path2d = new Path2D();
      path2d.moveTo(x1, y1);
      path2d.lineTo(x2, y2);
    }

    if (path2d) {
      if (fill && fill !== "none") {
        ctx.fillStyle = fill.startsWith("url(") ? resolvePaintServer(svg, fill, ctx) : fill;
        ctx.fill(path2d);
      }
      if (stroke && stroke !== "none" && strokeW > 0) {
        ctx.strokeStyle = stroke.startsWith("url(") ? resolvePaintServer(svg, stroke, ctx) : stroke;
        ctx.lineWidth = strokeW;
        ctx.stroke(path2d);
      }
    }
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Approximate a url(#gradient) paint with the average of its stops (alpha
 * included), so gradient fills keep their real tone instead of a flat accent.
 */
function resolvePaintServer(
  svg: SVGSVGElement,
  value: string,
  ctx: CanvasRenderingContext2D,
): string {
  const id = /url\(\s*["']?#([^"')\s]+)/.exec(value)?.[1];
  const server = id
    ? (svg.querySelector(`[id="${id}"]`) ?? svg.ownerDocument.getElementById(id))
    : null;
  const stops = server ? Array.from(server.querySelectorAll("stop")) : [];
  if (!stops.length) return "rgba(0,0,0,0)";
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  for (const stop of stops) {
    const cs = getComputedStyle(stop);
    ctx.fillStyle = "#000";
    ctx.fillStyle = cs.stopColor || stop.getAttribute("stop-color") || "#000";
    const hex = String(ctx.fillStyle);
    const m = /^#([0-9a-f]{6})$/i.exec(hex);
    const rgba = /rgba?\(([^)]+)\)/.exec(hex);
    let cr = 0;
    let cg = 0;
    let cb = 0;
    let ca = 1;
    if (m) {
      const n = Number.parseInt(m[1], 16);
      cr = (n >> 16) & 255;
      cg = (n >> 8) & 255;
      cb = n & 255;
    } else if (rgba) {
      const parts = rgba[1].split(",").map((v) => Number.parseFloat(v));
      [cr, cg, cb] = parts;
      ca = parts[3] ?? 1;
    }
    const so = Number.parseFloat(cs.stopOpacity || stop.getAttribute("stop-opacity") || "1");
    ca *= Number.isFinite(so) ? so : 1;
    r += cr;
    g += cg;
    b += cb;
    a += ca;
  }
  const n = stops.length;
  return `rgba(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)},${(a / n).toFixed(3)})`;
}

function paintFallbackMedia(
  ctx: CanvasRenderingContext2D,
  element: HTMLElement,
  style: CSSStyleDeclaration,
  rect: DOMRect,
  rootRect: DOMRect,
) {
  const drawable =
    element instanceof HTMLImageElement
      ? element.complete && element.naturalWidth > 0
        ? element
        : null
      : element instanceof HTMLCanvasElement
        ? element
        : element instanceof HTMLVideoElement && element.readyState >= 2
          ? element
          : null;
  if (!drawable) return;
  if (!isFallbackMediaOriginClean(drawable)) return;

  const sourceWidth =
    drawable instanceof HTMLImageElement
      ? drawable.naturalWidth
      : drawable instanceof HTMLVideoElement
        ? drawable.videoWidth
        : drawable.width;
  const sourceHeight =
    drawable instanceof HTMLImageElement
      ? drawable.naturalHeight
      : drawable instanceof HTMLVideoElement
        ? drawable.videoHeight
        : drawable.height;
  if (!(sourceWidth > 0 && sourceHeight > 0)) return;

  let sourceX = 0;
  let sourceY = 0;
  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;
  let targetX = rect.left - rootRect.left;
  let targetY = rect.top - rootRect.top;
  let targetWidth = rect.width;
  let targetHeight = rect.height;
  const [positionX, positionY] = resolveObjectPosition(style.objectPosition);
  if (style.objectFit === "cover") {
    const scale = Math.max(rect.width / sourceWidth, rect.height / sourceHeight);
    cropWidth = rect.width / scale;
    cropHeight = rect.height / scale;
    sourceX = (sourceWidth - cropWidth) * positionX;
    sourceY = (sourceHeight - cropHeight) * positionY;
  } else if (style.objectFit === "contain" || style.objectFit === "scale-down") {
    const containScale = Math.min(
      rect.width / sourceWidth,
      rect.height / sourceHeight,
      style.objectFit === "scale-down" ? 1 : Number.POSITIVE_INFINITY,
    );
    targetWidth = sourceWidth * containScale;
    targetHeight = sourceHeight * containScale;
    targetX += (rect.width - targetWidth) * positionX;
    targetY += (rect.height - targetHeight) * positionY;
  }

  try {
    ctx.drawImage(
      drawable,
      sourceX,
      sourceY,
      cropWidth,
      cropHeight,
      targetX,
      targetY,
      targetWidth,
      targetHeight,
    );
  } catch {
    // Ignore transient decode errors
  }
}

function isFallbackMediaOriginClean(
  drawable: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
): boolean {
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  if (!ctx) return false;
  try {
    ctx.drawImage(drawable, 0, 0, 1, 1);
    ctx.getImageData(0, 0, 1, 1);
    return true;
  } catch {
    return false;
  }
}

function resolveObjectPosition(position: string): [number, number] {
  const [x = "50%", y = "50%"] = position.split(/\s+/);
  return [resolvePositionValue(x, "left", "right"), resolvePositionValue(y, "top", "bottom")];
}

function resolvePositionValue(value: string, start: string, end: string): number {
  if (value === start) return 0;
  if (value === end) return 1;
  if (value === "center") return 0.5;
  if (value.endsWith("%")) {
    return Math.min(1, Math.max(0, Number.parseFloat(value) / 100));
  }
  return 0.5;
}

function paintFallbackText(
  ctx: CanvasRenderingContext2D,
  element: HTMLElement,
  style: CSSStyleDeclaration,
  rootRect: DOMRect,
) {
  const textNodes = Array.from(element.childNodes).filter(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
  );
  if (textNodes.length === 0) return;

  ctx.fillStyle = style.color;
  ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  ctx.textBaseline = "alphabetic";
  if ("letterSpacing" in ctx) {
    ctx.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
  }
  const textAlign: CanvasTextAlign =
    style.textAlign === "center" ||
    style.textAlign === "right" ||
    style.textAlign === "start" ||
    style.textAlign === "end"
      ? style.textAlign
      : "left";
  const direction: CanvasDirection = style.direction === "rtl" ? "rtl" : "ltr";
  ctx.textAlign = textAlign;
  ctx.direction = direction;

  const whiteSpace = style.whiteSpace;
  const preservesNewlines =
    whiteSpace === "pre" ||
    whiteSpace === "pre-wrap" ||
    whiteSpace === "pre-line" ||
    whiteSpace === "break-spaces";
  const preservesSpaces = preservesNewlines && whiteSpace !== "pre-line";

  const anchor =
    textAlign === "center"
      ? 0.5
      : textAlign === "right" ||
          (textAlign === "end" && direction === "ltr") ||
          (textAlign === "start" && direction === "rtl")
        ? 1
        : 0;

  function transform(text: string): string {
    if (style.textTransform === "uppercase") return text.toUpperCase();
    if (style.textTransform === "lowercase") return text.toLowerCase();
    return text;
  }

  function drawAcrossRects(text: string, rects: DOMRect[]) {
    const visible = rects.filter(
      (rect) =>
        rect.right > rootRect.left &&
        rect.left < rootRect.right &&
        rect.bottom > rootRect.top &&
        rect.top < rootRect.bottom,
    );
    if (visible.length === 0) return;
    const totalWidth = visible.reduce((sum, rect) => sum + rect.width, 0);
    let offset = 0;
    for (let index = 0; index < visible.length; index++) {
      const rect = visible[index];
      const remaining = text.length - offset;
      if (remaining <= 0) break;
      const count =
        index === visible.length - 1
          ? remaining
          : Math.min(remaining, Math.max(1, Math.round((text.length * rect.width) / totalWidth)));
      const slice = text.slice(offset, offset + count);
      offset += count;
      const line = preservesSpaces ? slice : slice.trim();
      if (!line.trim()) continue;
      const x = rect.left - rootRect.left + rect.width * anchor;
      const metrics = ctx.measureText(line);
      const ascent = metrics.fontBoundingBoxAscent ?? 0;
      const descent = metrics.fontBoundingBoxDescent ?? 0;
      const y =
        ascent > 0
          ? rect.top - rootRect.top + (rect.height - ascent - descent) / 2 + ascent
          : rect.bottom - rootRect.top - rect.height * 0.2;
      ctx.fillText(line, x, y, Math.max(rect.width, 1));
    }
  }

  for (const node of textNodes) {
    const raw = node.textContent ?? "";
    const range = document.createRange();

    if (preservesNewlines) {
      let position = 0;
      for (const part of raw.split("\n")) {
        const start = position;
        position += part.length + 1;
        if (!part.trim()) continue;
        range.setStart(node, start);
        range.setEnd(node, start + part.length);
        const text = transform(preservesSpaces ? part : part.replace(/\s+/g, " ").trim());
        drawAcrossRects(text, Array.from(range.getClientRects()));
      }
      continue;
    }

    const text = transform(raw.replace(/\s+/g, " ").trim());
    if (!text) continue;
    range.selectNodeContents(node);
    drawAcrossRects(text, Array.from(range.getClientRects()));
  }
}

function paintFallbackBorders(
  ctx: CanvasRenderingContext2D,
  style: CSSStyleDeclaration,
  rect: DOMRect,
  rootRect: DOMRect,
) {
  const x = rect.left - rootRect.left;
  const y = rect.top - rootRect.top;
  const top = Number.parseFloat(style.borderTopWidth);
  const right = Number.parseFloat(style.borderRightWidth);
  const bottom = Number.parseFloat(style.borderBottomWidth);
  const left = Number.parseFloat(style.borderLeftWidth);
  if (top > 0) {
    ctx.fillStyle = style.borderTopColor;
    ctx.fillRect(x, y, rect.width, top);
  }
  if (right > 0) {
    ctx.fillStyle = style.borderRightColor;
    ctx.fillRect(x + rect.width - right, y, right, rect.height);
  }
  if (bottom > 0) {
    ctx.fillStyle = style.borderBottomColor;
    ctx.fillRect(x, y + rect.height - bottom, rect.width, bottom);
  }
  if (left > 0) {
    ctx.fillStyle = style.borderLeftColor;
    ctx.fillRect(x, y, left, rect.height);
  }
}
