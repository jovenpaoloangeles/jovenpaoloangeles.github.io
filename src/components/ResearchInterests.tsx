import React from 'react';
import { Badge } from './ui/Badge';

export function ResearchInterests() {
  const interests = [
    'Materials Science & Engineering',
    'Nanostructure Synthesis',
    'Computational Materials Design',
    'Machine Learning in Materials',
    'Bayesian Optimization',
  ];

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-primary">Research Interests</h3>
      <div className="text-sm text-muted-foreground">
        {interests.map((interest, index) => (
          <span key={index}>
            <Badge>{interest}</Badge>
            {index < interests.length - 1 && ' '}
          </span>
        ))}
      </div>
    </div>
  );
}
