import React from 'react';
import { GraduationCap, School } from 'lucide-react';

export function Education() {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-primary">Education</h3>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <School className="w-4 h-4 mt-1 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Ph.D. in Materials Science and Engineering</p>
            <p className="text-sm text-muted-foreground">University of the Philippines</p>
            <p className="text-sm text-muted-foreground">August 2021 to Present</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <GraduationCap className="w-4 h-4 mt-1 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">M.Sc. in Materials Science and Engineering</p>
            <p className="text-sm text-muted-foreground">University of the Philippines</p>
            <p className="text-sm text-muted-foreground">August 2018 to July 2020</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <GraduationCap className="w-4 h-4 mt-1 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">B.Sc. in Physics</p>
            <p className="text-sm text-muted-foreground">University of the Philippines</p>
            <p className="text-sm text-muted-foreground">June 2011 to June 2015</p>
          </div>
        </div>
      </div>
    </div>
  );
}