import React from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Trophy, Camera } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function Awards() {
  const awards = {
    academic: [
      {
        title: 'ASTHRDP-NSC PhD Scholar',
        organization: 'Department of Science and Technology',
        period: 'January 2024 - Present',
        description: 'Full-tuition scholarship with stipend for graduate studies'
      },
      {
        title: 'ASTHRDP-NSC MS Scholar',
        organization: 'Department of Science and Technology',
        period: 'August 2018 - July 2020',
        description: 'Full-tuition scholarship with stipend for graduate studies'
      },
      {
        title: 'University Scholar',
        organization: 'University of the Philippines',
        description: 'For attaining a semester GWA of at least 1.45',
        periods: [
          'First & Second Semester, AY 2018-2019',
          'First Semester, AY 2019-2020',
          'Second Semester, AY 2021-2022'
        ]
      },
      {
        title: 'College Scholar',
        organization: 'University of the Philippines',
        description: 'For attaining a semester GWA of at least 1.75',
        periods: [
          'First Semester, AY 2011-2012',
          'Second Semester, AY 2012-2013',
          'First Semester, AY 2014-2015'
        ]
      }
    ],
    photography: {
      international: [
        {
          title: 'Siena International Photo Awards 2020',
          achievement: 'Shortlisted'
        },
        {
          title: 'Sony World Photography Awards 2019',
          achievement: 'Entries of the Week (Oct-Nov 2019)'
        },
        {
          title: 'International Photography Awards 2019',
          achievements: [
            '"Bad Weather Ahead" - Honorable Mention, Fine Art-Landscape',
            '"The Mansion" - 3rd Place, Special Effects',
            '"Tree of Life" - 3rd Place, Architecture-Interior'
          ]
        },
        {
          title: 'International Photography Awards 2018',
          achievements: [
            '"Icarus" - 1st Place & Category Winner, Sports-Extreme Sports',
            '"The Most Beautiful" - 3rd Place, Night Photography',
            '"Swan Lake" - 1st Place, Nature-Seasons',
            '"A Roof In Hong Kong" - 2nd Place, Architecture'
          ]
        }
      ],
      exhibitions: [
        {
          title: 'Singapore International Photography Festival 2018',
          details: 'Depth of Feel Exhibit | Festival Village at DECK, Singapore | Oct 5-30, 2018'
        },
        {
          title: 'Works of Fire Exhibit',
          details: 'Porta Vaga, Baguio, Philippines | Jan 2017'
        },
        {
          title: 'World of Art Photography Exhibit',
          details: 'Nayong Pilipino, Manila | Dec 2016'
        }
      ]
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-serif mb-6">Awards & Recognition</h2>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="academic" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Academic Awards</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {awards.academic.map((award, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">{award.title}</h4>
                      <p className="text-sm text-gray-600">{award.organization}</p>
                      {award.period && (
                        <p className="text-sm text-blue-600">{award.period}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">{award.description}</p>
                      {award.periods && (
                        <ul className="mt-2 space-y-1">
                          {award.periods.map((period, i) => (
                            <li key={i} className="text-sm text-gray-500">• {period}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="photography" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Photography Awards</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">International Awards</h3>
                {awards.photography.international.map((award, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">{award.title}</h4>
                    {award.achievement && (
                      <p className="text-sm text-gray-600 mt-1">{award.achievement}</p>
                    )}
                    {award.achievements && (
                      <ul className="mt-2 space-y-1">
                        {award.achievements.map((achievement, i) => (
                          <li key={i} className="text-sm text-gray-600">• {achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Exhibitions</h3>
                {awards.photography.exhibitions.map((exhibition, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">{exhibition.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{exhibition.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}