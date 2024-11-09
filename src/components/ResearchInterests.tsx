import React from 'react';
import { FlaskConical } from 'lucide-react';

export function ResearchInterests() {
  const interests = [
    'Materials Science & Engineering',
    'Computational Materials Design',
    'Machine Learning in Materials',
    'Nanostructure Synthesis',
  ];

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-primary">Research Interests</h3>
      <ul className="text-sm text-muted-foreground space-y-1">
        {interests.map((interest, index) => (
          <li key={index} className="flex items-center gap-2">
            <FlaskConical className="w-3 h-3 text-primary" />
            {interest}
          </li>
        ))}
      </ul>
    </div>
  );
}