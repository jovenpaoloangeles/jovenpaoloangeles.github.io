import React from 'react';
import { MapPin, Download } from 'lucide-react';
import { ContactInfo } from './ContactInfo';
import { ResearchInterests } from './ResearchInterests';
import { Education } from './Education';
import { ProfileCarousel } from './ProfileCarousel';

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
        <p className="text-lg text-muted-foreground mt-1">Materials Science Researcher</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Quezon City, Philippines</span>
        </div>
        <button
          onClick={handleDownloadCV}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Academic CV
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <ContactInfo />
        <ResearchInterests />
        <Education />
      </div>
    </div>
  );
}