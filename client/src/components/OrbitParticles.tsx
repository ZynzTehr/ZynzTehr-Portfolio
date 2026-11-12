import React from "react";

/**
 * The spiraling orbit from the original landing page (client/src/styles/
 * global.scss at e041095): ten blurred rings gravitating around the headline.
 * The path math, 4.5s period and 0.26s stagger are unchanged; the SCSS @for
 * loop became a per-particle --i, and the mint stroke became the sapphire
 * palette. Styles live in global.css under "Orbit particles".
 *
 * `collapsing` pulls every particle into the center for the Launch transition,
 * where the persistent hex-orbit mark forms out of them.
 */

const PARTICLE_COUNT = 10;

interface OrbitParticlesProps {
  collapsing?: boolean;
  className?: string;
}

const OrbitParticles: React.FC<OrbitParticlesProps> = ({ collapsing = false, className }) => (
  <div
    className={`orbit-particles ${collapsing ? "is-collapsing" : ""} ${className ?? ""}`}
    aria-hidden="true"
  >
    {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
      <span key={i} className="particle" style={{ "--i": i + 1 } as React.CSSProperties} />
    ))}
  </div>
);

export default OrbitParticles;
