import React, { useCallback, useEffect, useRef, useState } from "react";
import { Film } from "lucide-react";
import type { Project } from "../data/projects";
import ProjectArt from "./project-arts/ProjectArt";
import DecryptReveal from "./canvasui/DecryptReveal";
import { DECRYPT_REVEAL_SPEC } from "./canvasui/spec";
import { useMediaQuery, useReducedMotion } from "../lib/useReducedMotion";

/**
 * Object to context in a stable card frame (motion dossier: Lando's helmet
 * cards). At rest the card shows its SVG art, the idea of the project. On
 * hover or focus the live snapshot (and motion clip) decodes in through
 * DecryptReveal at the owner's configured props: the decode radius opens from
 * 0 to the configured 400 so the cipher-to-image decode is visible, and closes
 * again on exit before the shader unmounts. A rapid exit always restores the
 * art; touch and reduced motion swap media without the shader.
 */

interface CardMediaPreviewProps {
  project: Project;
  isActive: boolean;
  enableShader?: boolean;
  compact?: boolean;
}

const OPEN_MS = 640;
const CLOSE_MS = 320;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const CardMediaPreview: React.FC<CardMediaPreviewProps> = ({
  project,
  isActive,
  enableShader = isActive,
  compact = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const canUseShader = finePointer && !reducedMotion;
  const wantShader = isActive && enableShader && canUseShader;

  const [shaderMounted, setShaderMounted] = useState(false);
  const [radius, setRadius] = useState(0);
  const [mediaFailed, setMediaFailed] = useState(false);
  const radiusRef = useRef(0);
  const frameRef = useRef(0);

  // Open or close the decode radius; unmount the shader once closed.
  useEffect(() => {
    cancelAnimationFrame(frameRef.current);
    const from = radiusRef.current;
    const to = wantShader ? DECRYPT_REVEAL_SPEC.radius : 0;
    // A project opening over the card releases the shader at once (WebGL budget);
    // a plain pointer exit gets the visible re-encrypt.
    const duration = wantShader ? OPEN_MS : isActive ? 0 : CLOSE_MS;
    let mountFrame = 0;
    if (wantShader) mountFrame = requestAnimationFrame(() => setShaderMounted(true));
    const start = performance.now();
    const tick = (now: number) => {
      const t = duration <= 0 ? 1 : Math.min(1, (now - start) / duration);
      const r = from + (to - from) * easeOut(t);
      radiusRef.current = r;
      setRadius(r);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
      else if (!wantShader) setShaderMounted(false);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameRef.current);
      cancelAnimationFrame(mountFrame);
    };
    // isActive only matters at the moment wantShader flips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantShader]);

  // The clip can mount twice (plain, then inside DecryptReveal), so play()
  // runs on whichever <video> node is attached. It only renders while active.
  const attachVideo = useCallback((video: HTMLVideoElement | null) => {
    videoRef.current = video;
    if (video) {
      void video.play().catch(() => {
        // Autoplay suppressed; the still stays visible.
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      videoRef.current?.pause();
    };
  }, []);

  const mediaNodes = (
    <div className="relative w-full h-full">
      <img
        src={project.previewImage}
        alt=""
        crossOrigin="anonymous"
        loading="lazy"
        decoding="async"
        className="card-snapshot-img"
        onError={() => setMediaFailed(true)}
      />
      {project.videoUrl && isActive && !reducedMotion && (
        <video
          ref={attachVideo}
          src={project.videoUrl}
          poster={project.previewImage}
          crossOrigin="anonymous"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="card-snapshot-video absolute inset-0"
        />
      )}
    </div>
  );

  // Missing media: the SVG art stays as the card's face instead of a broken image.
  const revealed = isActive && !mediaFailed;

  return (
    <div className={`card-media-surface ${revealed ? "is-revealed" : ""}`}>
      <div className="card-svg-resting">
        <ProjectArt
          projectId={project.id}
          projectName={project.name}
          previewImage={project.previewImage}
          mediaUrl={project.mediaUrl}
        />
      </div>

      <div className="card-snapshot-reveal" aria-hidden={!revealed}>
        {shaderMounted && !mediaFailed ? (
          <DecryptReveal className="w-full h-full" {...DECRYPT_REVEAL_SPEC} radius={radius}>
            {mediaNodes}
          </DecryptReveal>
        ) : (
          mediaNodes
        )}
      </div>

      {project.videoUrl && !compact && (
        <span className="card-video-badge">
          <Film size={10} aria-hidden="true" />
          <span>Motion</span>
        </span>
      )}
    </div>
  );
};

export default CardMediaPreview;
