import React from 'react';
import MongooseArt from './MongooseArt';
import CapstoneArt from './CapstoneArt';
import ProfileArt from './ProfileArt';
import MinimaxAiArt from './MinimaxAiArt';
import MatchMakerArt from './MatchMakerArt';
import SuperQuizArt from './SuperQuizArt';
import SchoolDirectoryArt from './SchoolDirectoryArt';
import LoanCalcArt from './LoanCalcArt';
import AuraListArt from './AuraListArt';
import TicTacToeArt from './TicTacToeArt';
import TlmRedesignArt from './TlmRedesignArt';
import RpsSpockArt from './RpsSpockArt';
import AdvancedRpsArt from './AdvancedRpsArt';
import BasicRpsArt from './BasicRpsArt';
import TestimonialArt from './TestimonialArt';
import NextChapterArt from './NextChapterArt';
import PythonRpsArt from './PythonRpsArt';

interface ProjectArtProps {
  projectId: string;
  projectName?: string;
  previewImage?: string;
  mediaUrl?: string;
}

const ProjectArt: React.FC<ProjectArtProps> = ({ projectId, projectName, previewImage, mediaUrl }) => {
  const id = projectId.toLowerCase().trim();

  switch (id) {
    case 'soda-diner':
      return <MongooseArt />;

    case 'capstone-project':
      return <CapstoneArt />;

    case 'zynztehr-profile':
      return <ProfileArt />;

    case 'tic-tac-toe-withai':
    case 'tic-tac-toe-with-ai':
      return <MinimaxAiArt />;

    case 'match-maker':
      return <MatchMakerArt />;

    case 'super-quiz':
      return <SuperQuizArt />;

    case 'school-directory':
      return <SchoolDirectoryArt />;

    case 'loancalculator':
    case 'loan-calculator':
      return <LoanCalcArt />;

    case 'auralist-web':
    case 'auralist':
      return <AuraListArt />;

    case 'tic-tac-toe':
      return <TicTacToeArt />;

    case 'tlm-website-redesign':
      return <TlmRedesignArt />;

    case 'rock-paper-scissors-spock':
      return <RpsSpockArt />;

    case 'advanced-rock-paper-scissors':
      return <AdvancedRpsArt />;

    case 'basic-rock-paper-scissors':
      return <BasicRpsArt />;

    case 'testimonial-layout':
      return <TestimonialArt />;

    case 'nextchapter':
    case 'next-chapter':
      return <NextChapterArt />;

    case 'python-rock-paper-scissors':
      return <PythonRpsArt />;

    default:
      return (
        <img
          src={previewImage || mediaUrl}
          alt={projectName}
          className="w-100 h-100 rounded-3"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80';
          }}
        />
      );
  }
};

export default ProjectArt;
