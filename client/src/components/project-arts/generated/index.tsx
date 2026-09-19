// Auto-generated index — do not edit manually
import React from 'react';
import GeneratedVscodeFxArt from './GeneratedVscodeFxArt';
import GeneratedNextChapterWeekOneArt from './GeneratedNextChapterWeekOneArt';

interface GeneratedArtProps {
  projectId: string;
}

const generatedArtMap: Record<string, React.FC> = {
  'vscode-fx': GeneratedVscodeFxArt,
  'next-chapter-week-one': GeneratedNextChapterWeekOneArt,
};

const GeneratedArt: React.FC<GeneratedArtProps> = ({ projectId }) => {
  const Component = generatedArtMap[projectId.toLowerCase().trim()];
  return Component ? <Component /> : null;
};

export default GeneratedArt;
export { generatedArtMap };
