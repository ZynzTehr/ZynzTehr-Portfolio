import React, { useEffect, useRef, useState } from "react";
import { subscribeActs } from "../lib/useActStack";
import { useReducedMotion } from "../lib/useReducedMotion";

/**
 * Act III's black hole: a fixed layer between Act I and Act II that fades in
 * while Act II spirals into its centre (useActStack "swirl" exit). It is the
 * Flow-generated loop in /media/blackhole/, over a pure CSS hole that stands
 * in until the video is ready, if it fails to load, and under reduced motion
 * (the poster frame, no loop).
 *
 * Its opacity follows Act III's arrival frame by frame. Outside Act III the
 * layer is hidden and the video paused, so it costs nothing while you read
 * the other acts.
 */

const SRC_WEBM = "/media/blackhole/blackhole.webm";
const SRC_MP4 = "/media/blackhole/blackhole.mp4";
const POSTER = "/media/blackhole/blackhole-poster.jpg";

/** Fully in once Act III is three quarters of the way up the screen. */
const FADE_END = 0.75;
const smooth = (t: number) => t * t * (3 - 2 * t);

const BlackHole: React.FC<{ awake: boolean }> = ({ awake }) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(
    () =>
      subscribeActs((frame) => {
        const layer = layerRef.current;
        if (!layer) return;
        const t = Math.min(1, Math.max(0, (frame.enter[2] ?? 0) / FADE_END));
        const o = smooth(t);
        layer.style.opacity = o.toFixed(3);
        // It grows out of the dark as Act II falls in.
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
        // Autoplay refused: the poster and the CSS hole stay.
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
      <div className="blackhole__stage">
        {videoFailed ? (
          // Only when the video cannot play: it covers this completely otherwise.
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
            <source src={SRC_WEBM} type="video/webm" onError={() => undefined} />
            <source
              src={SRC_MP4}
              type="video/mp4"
              // The last source failing means no format played.
              onError={() => setVideoFailed(true)}
            />
          </video>
        )}
      </div>
      <div className="blackhole__scrim" />
    </div>
  );
};

export default BlackHole;
