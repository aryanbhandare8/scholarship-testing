import React from 'react';
import { MultiStepAIMatch } from '../components/MultiStepAIMatch';
import { Scholarship } from '../types';

interface AIMatchPageProps {
  onSelectScholarship: (scholarship: Scholarship) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const AIMatchPage: React.FC<AIMatchPageProps> = ({
  onSelectScholarship,
  savedIds,
  onToggleSave,
}) => {
  return (
    <div className="py-6">
      <MultiStepAIMatch
        onSelectScholarship={onSelectScholarship}
        savedIds={savedIds}
        onToggleSave={onToggleSave}
      />
    </div>
  );
};
