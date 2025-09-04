import { MapPin } from 'lucide-react';
import { ContactInfo } from './ContactInfo';
import { ResearchInterests } from './ResearchInterests';
import { Education } from './Education';
import { ProfileCarousel } from './ProfileCarousel';
import { Certifications } from './Certifications';
import { TypeAnimation } from 'react-type-animation';

export function Header() {
  return (
    <div className="bg-card rounded-lg shadow-sm p-6">
      <div className="text-center">
        <ProfileCarousel />
        <h1 className="text-3xl font-serif font-bold text-foreground">Joven Paolo Angeles</h1>
        <TypeAnimation
          sequence={[
            'PhD Candidate',
            2000,
            'Researcher',
            2000,
            'Photographer',
            2000,
            'Creative Coder',
            2000,
            'AI Engineer',
            2000,
          ]}
          wrapper="p"
          speed={50}
          className="text-lg text-muted-foreground mt-1"
          repeat={Infinity}
        />
        <div className="flex items-center justify-center gap-2 mt-2">
          <MapPin className="w-4 h-4 mt-1 text-primary shrink-0" />
          <span className="text-sm text-muted-foreground">Department of Science and Technology - Advanced Science and Technology Institute, Quezon City, Philippines</span>
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
