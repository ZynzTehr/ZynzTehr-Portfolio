import React from "react";
import GeneratedArt from "./generated";
import MongooseArt from "./MongooseArt";
import CapstoneArt from "./CapstoneArt";
import MinimaxAiArt from "./MinimaxAiArt";
import MatchMakerArt from "./MatchMakerArt";
import SuperQuizArt from "./SuperQuizArt";
import SchoolDirectoryArt from "./SchoolDirectoryArt";
import LoanCalcArt from "./LoanCalcArt";
import AuraListArt from "./AuraListArt";
import TicTacToeArt from "./TicTacToeArt";
import TlmRedesignArt from "./TlmRedesignArt";
import RpsSpockArt from "./RpsSpockArt";
import AdvancedRpsArt from "./AdvancedRpsArt";
import BasicRpsArt from "./BasicRpsArt";
import TestimonialArt from "./TestimonialArt";
import NextChapterArt from "./NextChapterArt";
import PythonRpsArt from "./PythonRpsArt";
import NewAgeChessArt from "./NewAgeChessArt";
import CountdownTimerArt from "./CountdownTimerArt";
import MusicPortArt from "./MusicPortArt";
import AniBeamArt from "./AniBeamArt";
import CampfireArt from "./CampfireArt";
import JobSeanceArt from "./JobSeanceArt";
import FleetPulseArt from "./FleetPulseArt";
import TorqueLineArt from "./TorqueLineArt";
import NextChapterWeekOneArt from "./NextChapterWeekOneArt";
import VscodeFxArt from "./VscodeFxArt";
import ZynzTehrProfileArt from "./ZynzTehrProfileArt";

interface ProjectArtProps {
  projectId: string;
  projectName?: string;
  previewImage?: string;
  mediaUrl?: string;
}

const ProjectArt: React.FC<ProjectArtProps> = ({
  projectId,
  projectName,
  previewImage,
  mediaUrl,
}) => {
  const id = projectId.toLowerCase().trim();

  switch (id) {
    case "musicport":
      return <MusicPortArt />;
    case "anibeam":
      return <AniBeamArt />;
    case "campfire-of-the-damned":
      return <CampfireArt />;
    case "jobseance":
      return <JobSeanceArt />;
    case "fleet-pulse":
      return <FleetPulseArt />;
    case "torque-line":
      return <TorqueLineArt />;
    case "next-chapter-week-one":
      return <NextChapterWeekOneArt />;
    case "vscode-fx":
      return <VscodeFxArt />;
    case "new-age-chess":
    case "newagechess":
      return <NewAgeChessArt />;

    case "countdown-timer":
    case "countdowntimer":
      return <CountdownTimerArt />;

    case "soda-diner":
      return <MongooseArt />;

    case "capstone-project":
      return <CapstoneArt />;

    case "zynztehr-profile":
      return <ZynzTehrProfileArt />;

    case "tic-tac-toe-withai":
    case "tic-tac-toe-with-ai":
      return <MinimaxAiArt />;

    case "match-maker":
      return <MatchMakerArt />;

    case "super-quiz":
      return <SuperQuizArt />;

    case "school-directory":
      return <SchoolDirectoryArt />;

    case "loancalculator":
    case "loan-calculator":
      return <LoanCalcArt />;

    case "auralist-web":
    case "auralist":
      return <AuraListArt />;

    case "tic-tac-toe":
      return <TicTacToeArt />;

    case "tlm-website-redesign":
      return <TlmRedesignArt />;

    case "rock-paper-scissors-spock":
      return <RpsSpockArt />;

    case "advanced-rock-paper-scissors":
      return <AdvancedRpsArt />;

    case "basic-rock-paper-scissors":
      return <BasicRpsArt />;

    case "testimonial-layout":
      return <TestimonialArt />;

    case "nextchapter":
    case "next-chapter":
      return <NextChapterArt />;

    case "python-rock-paper-scissors":
      return <PythonRpsArt />;

    default:
      // Try auto-generated art first, then fall back to image
      return (
        <GeneratedArt
          projectId={id}
          fallback={
            <img
              src={previewImage || mediaUrl}
              alt={projectName}
              className="w-full h-full rounded-xl block object-cover object-top"
              onError={(e) => {
                // No stock-photo stand-in: hide the broken image and let the card's
                // navy surface and the project name carry the tile.
                (e.target as HTMLImageElement).style.visibility = "hidden";
              }}
            />
          }
        />
      );
  }
};

export default ProjectArt;
