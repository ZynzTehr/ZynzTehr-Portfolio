// Auto-generated index — do not edit manually
import React from "react";
import GeneratedGate4Art from "./GeneratedGate4Art";

interface GeneratedArtProps {
  projectId: string;
  fallback?: React.ReactNode;
}

const generatedArtMap: Record<string, React.FC> = {
  "gate-4": GeneratedGate4Art,
};

const GeneratedArt: React.FC<GeneratedArtProps> = ({ projectId, fallback = null }) => {
  const Component = generatedArtMap[projectId.toLowerCase().trim()];
  return Component ? <Component /> : <>{fallback}</>;
};

export default GeneratedArt;
