// Auto-generated index — do not edit manually
import React from "react";
import GeneratedMusicportArt from "./GeneratedMusicportArt";
import GeneratedVscodeFxArt from "./GeneratedVscodeFxArt";
import GeneratedAnibeamArt from "./GeneratedAnibeamArt";
import GeneratedJobseanceArt from "./GeneratedJobseanceArt";
import GeneratedTorqueLineArt from "./GeneratedTorqueLineArt";
import GeneratedCampfireOfTheDamnedArt from "./GeneratedCampfireOfTheDamnedArt";
import GeneratedFleetPulseArt from "./GeneratedFleetPulseArt";
import GeneratedNextChapterWeekOneArt from "./GeneratedNextChapterWeekOneArt";

interface GeneratedArtProps {
  projectId: string;
  fallback?: React.ReactNode;
}

const generatedArtMap: Record<string, React.FC> = {
  musicport: GeneratedMusicportArt,
  "vscode-fx": GeneratedVscodeFxArt,
  anibeam: GeneratedAnibeamArt,
  jobseance: GeneratedJobseanceArt,
  "torque-line": GeneratedTorqueLineArt,
  "campfire-of-the-damned": GeneratedCampfireOfTheDamnedArt,
  "fleet-pulse": GeneratedFleetPulseArt,
  "next-chapter-week-one": GeneratedNextChapterWeekOneArt,
};

const GeneratedArt: React.FC<GeneratedArtProps> = ({ projectId, fallback = null }) => {
  const Component = generatedArtMap[projectId.toLowerCase().trim()];
  return Component ? <Component /> : <>{fallback}</>;
};

export default GeneratedArt;
