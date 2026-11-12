import React from "react";

/**
 * Section heading with the site's heading grammar: a rectangular sapphire mask
 * sweeps across, then retracts to reveal the text. The motion is driven by
 * useMaskReveal (pages/Home.tsx) for every .mask-reveal inside its scope.
 */
const MaskHeading: React.FC<{
  as?: "h2" | "h3";
  id?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ as: Tag = "h2", id, className, children }) => (
  <Tag id={id} className={className}>
    <span className="mask-reveal">
      <span className="mask-reveal__text">{children}</span>
      <span className="mask-reveal__block" aria-hidden="true" />
    </span>
  </Tag>
);

export default MaskHeading;
