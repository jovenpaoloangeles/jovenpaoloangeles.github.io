import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, Wrench, MapPin } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { researchExperiences, conferences } from './research-data';

// Research Experience Card Component
const ExperienceCard = ({ experience }: { experience: typeof researchExperiences[0] }) => (
  <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
    <h3 className="text-lg font-semibold text-gray-900">{experience.title}</h3>
    
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar className="w-4 h-4 text-black" />
        {experience.dateRange}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Award className="w-4 h-4 text-black" />
        {experience.keyAchievements}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Wrench className="w-4 h-4 text-black" />
        {experience.techniques}
      </div>
    </div>

    <div className="mt-3 pl-4 border-l-2 border-blue-100">
      <ul className="space-y-1">
        {experience.details.map((detail, idx) => (
          <li key={idx} className="text-sm text-gray-600">
            {detail}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// Conference Card Component
const ConferenceCard = ({ conference }: { conference: typeof conferences[0] }) => (
  <div className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
    <h3 className="text-lg font-medium text-gray-900">{conference.title}</h3>
    <p className="text-sm text-gray-600 mt-1">{conference.authors}</p>
    <div className="mt-2 space-y-1">
      <p className="text-sm text-gray-600">{conference.venue}</p>
      {conference.reference && (
        <p className="text-sm text-gray-600">Reference: {conference.reference}</p>
      )}
      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-1" />
          {conference.date}
        </span>
        {conference.location && (
          <span className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            {conference.location}
          </span>
        )}
      </div>
    </div>
  </div>
);

export function Research() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Accordion type="single" collapsible>
        {/* Research Experience Section */}
        <AccordionItem value="research-experience">
          <AccordionTrigger>
            <h2 className="text-2xl font-serif mb-6">Research Experience</h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              {researchExperiences.map((experience, index) => (
                <ExperienceCard key={index} experience={experience} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Conference Proceedings Section */}
        <AccordionItem value="conference-proceedings">
          <AccordionTrigger>
            <h2 className="text-2xl font-serif mb-6">Conference Proceedings and Presentations</h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              {conferences.map((conference, index) => (
                <ConferenceCard key={index} conference={conference} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
