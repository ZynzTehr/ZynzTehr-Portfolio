import React, { useEffect, useRef, useState } from "react";
import { subscribeActs } from "../lib/useActStack";
import { useReducedMotion } from "../lib/useReducedMotion";

/**
 * Act III's black hole: a fixed layer between Act I and Act II that fades in
 * while Act II spirals into it (useActStack "swirl" exit). The loop is the
 * owner's black hole image, recolored to the palette and set in motion with
 * Google Flow (image-to-video), stars falling into it included. A CSS hole
 * stands in if the video fails; reduced motion shows the poster frame.
 *
 * The hole is not at the centre of the frame, so the frame is placed by hand:
 * - landscape: the frame covers the screen as composed (hole on the right),
 *   and Act III's words sit in the dark on the left;
 * - portrait: the frame is scaled so the hole sits mid-screen between the
 *   words and the numbers, its edges fading into the void.
 * Where the hole lands on screen is published as --bh-x / --bh-y-from-bottom
 * on the root, so Act II swirls into the hole itself.
 *
 * Opacity follows Act III's arrival frame by frame. Outside Act III the layer
 * is hidden and the video paused.
 */

const SRC_WEBM = "/media/blackhole/blackhole.webm";
const SRC_MP4 = "/media/blackhole/blackhole.mp4";
const POSTER = "/media/blackhole/blackhole-poster.jpg";

/** The frame and the hole inside it (source pixels). */
const FRAME_W = 1920;
const FRAME_H = 1080;
const HOLE_X = 1470 / FRAME_W;
const HOLE_Y = 470 / FRAME_H;

/** Fully in once Act III is three quarters of the way up the screen. */
const FADE_END = 0.75;
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Frame box and hole position for the current viewport. */
function placeFrame(vw: number, vh: number) {
  const portrait = vw / vh < 1;
  let w: number;
  let hx: number;
  let hy: number;
  if (!portrait) {
    // Cover, as composed.
    w = Math.max(vw, (vh * FRAME_W) / FRAME_H);
    const h = (w * FRAME_H) / FRAME_W;
    hx = (vw - w) / 2 + HOLE_X * w;
    hy = (vh - h) / 2 + HOLE_Y * h;
  } else {
    // Hole mid-screen; the frame wide enough that its far edge nearly leaves the screen.
    w = vw * 1.6;
    hx = vw / 2;
    hy = vh * 0.56;
  }
  const h = (w * FRAME_H) / FRAME_W;
  return { w, h, left: hx - HOLE_X * w, top: hy - HOLE_Y * h, hx, hy, portrait };
}

const BlackHole: React.FC<{ awake: boolean }> = ({ awake }) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);

  // Place the frame and tell the swirl where the hole is.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const root = document.documentElement;
    const place = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const f = placeFrame(vw, vh);
      layer.style.setProperty("--bh-w", `${f.w.toFixed(1)}px`);
      layer.style.setProperty("--bh-h", `${f.h.toFixed(1)}px`);
      layer.style.setProperty("--bh-left", `${f.left.toFixed(1)}px`);
      layer.style.setProperty("--bh-top", `${f.top.toFixed(1)}px`);
      layer.dataset.frame = f.portrait ? "portrait" : "landscape";
      root.style.setProperty("--bh-x", `${f.hx.toFixed(1)}px`);
      root.style.setProperty("--bh-y-from-bottom", `${(vh - f.hy).toFixed(1)}px`);
    };
    place();
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("resize", place);
      root.style.removeProperty("--bh-x");
      root.style.removeProperty("--bh-y-from-bottom");
    };
  }, []);

  useEffect(
    () =>
      subscribeActs((frame) => {
        const layer = layerRef.current;
        if (!layer) return;
        const t = Math.min(1, Math.max(0, (frame.enter[2] ?? 0) / FADE_END));
        const o = smooth(t);
        layer.style.opacity = o.toFixed(3);
        // It grows out of the dark around the hole as Act II falls in.
        layer.style.setProperty("--bh-grow", (1.18 - 0.18 * o).toFixed(4));
        layer.style.visibility = o > 0.002 ? "visible" : "hidden";
      }),
    [],
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (awake && !reducedMotion) {
      void video.play().catch(() => {
        // Autoplay refused: the poster stays.
      });
    } else {
      video.pause();
    }
  }, [awake, reducedMotion, videoFailed]);

  return (
    <div
      ref={layerRef}
      className="blackhole"
      data-awake={awake ? "true" : "false"}
      aria-hidden="true"
      style={{ opacity: 0, visibility: "hidden" }}
    >
      {videoFailed ? (
        // Only when the video cannot play.
        <div className="blackhole__css">
          <span className="blackhole__glow" />
          <span className="blackhole__disk" />
          <span className="blackhole__shadow" />
        </div>
      ) : (
        <video
          ref={videoRef}
          className="blackhole__video"
          poster={POSTER}
          muted
          loop
          playsInline
          preload="none"
          onError={() => setVideoFailed(true)}
        >
          <source src={SRC_WEBM} type="video/webm" />
          <source
            src={SRC_MP4}
            type="video/mp4"
            // The last source failing means no format played.
            onError={() => setVideoFailed(true)}
          />
        </video>
      )}
      <div className="blackhole__scrim" />
    </div>
  );
};

export default BlackHole;
