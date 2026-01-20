import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { ContactInfo } from './ContactInfo';
import { ResearchInterests } from './ResearchInterests';
import { Education } from './Education';
import { ProfileCarousel } from './ProfileCarousel';
import { TypeAnimation } from 'react-type-animation';

export function Header() {
  const roles = [
    'PhD Candidate',
    'Researcher',
    'Photographer',
    'Creative Coder',
    'AI Engineer'
  ];
  const [currentRole, setCurrentRole] = useState<string>(roles[0]);

  return (
    <div className="bg-card rounded-lg shadow-sm p-6">
      <div className="text-center">
        <ProfileCarousel />
        <h1 className="text-3xl font-serif font-bold text-foreground">Joven Paolo Angeles</h1>
        <TypeAnimation
          sequence={[
            roles[0],
            () => setCurrentRole(roles[0]),
            5000,
            roles[1],
            () => setCurrentRole(roles[1]),
            5000,
            roles[2],
            () => setCurrentRole(roles[2]),
            5000,
            roles[3],
            () => setCurrentRole(roles[3]),
            5000,
            roles[4],
            () => setCurrentRole(roles[4]),
            5000,
          ]}
          wrapper="p"
          speed={50}
          className="text-lg text-muted-foreground mt-1"
          repeat={Infinity}
          aria-hidden="true"
          role="presentation"
        />
        <p className="sr-only" aria-live="polite">
          {currentRole}
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <MapPin className="w-4 h-4 mt-1 text-primary shrink-0" />
          <span className="text-sm text-muted-foreground">Department of Science and Technology - Advanced Science and Technology Institute, Quezon City, Philippines</span>
        </div>
      </div>
      <div className="mt-6 space-y-6">
        <ContactInfo />
        <ResearchInterests />
        <Education />
      </div>
    </div>
  );
}
