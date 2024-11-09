import React from 'react';
import { Award } from 'lucide-react';

export function Certifications() {
  const certifications = [
    {
      title: 'Civil Service Professional Eligibility Philippines',
      details: 'Certification No. 0029, s. 2016 May 2016'
    },
    {
      title: 'Data Science Specialization (with Distinction) John Hopkins University',
      courses: [
        { name: 'The Data Scientist’s Toolbox', license: 'ZB7NJL28UL73', date: 'Oct 2017' },
        { name: 'R Programming', license: '8JNWC386HTF9', date: 'Oct 2017' },
        { name: 'Getting and Cleaning Data', license: 'VT9A8DXVN87F', date: 'Nov 2017' },
        { name: 'Exploratory Data Analysis', license: '8CEQ3SGVGASV', date: 'Dec 2017' }
      ]
    }
  ];

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-primary">Certifications</h3>
      <div className="space-y-2">
        {certifications.map((cert, index) => (
          <div key={index} className="flex items-start gap-2">
            <Award className="w-4 h-4 mt-1 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">{cert.title}</p>
              {cert.details && <p className="text-sm text-muted-foreground">{cert.details}</p>}
              {cert.courses && (
                <div className="pl-5 space-y-1">
                  {cert.courses.map((course, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div>
                        <p className="text-sm text-foreground">{course.name}</p>
                        <p className="text-sm text-muted-foreground">License no: {course.license} {course.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
