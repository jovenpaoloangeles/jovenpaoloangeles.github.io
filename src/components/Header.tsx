import React from 'react';
import { MapPin, Download } from 'lucide-react';
import { ContactInfo } from './ContactInfo';
import { ResearchInterests } from './ResearchInterests';
import { Education } from './Education';
import { ProfileCarousel } from './ProfileCarousel';
import { Certifications } from './Certifications';

export function Header() {
  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/cv-academic.pdf';
    link.download = 'academic-cv.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm p-6">
      <div className="text-center">
        <ProfileCarousel />
        <h1 className="text-3xl font-serif font-bold text-foreground">Joven Paolo Angeles</h1>
        <p className="text-lg text-muted-foreground mt-1">PhD Candidate and Researcher</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">University of the Philippines, Quezon City, Philippines</span>
        </div>
      </div>
      <div className="mt-6 space-y-6">
        <ContactInfo />
        <ResearchInterests />
        <Education />
        <Certifications />
      </div>
    </div>
  );
}
