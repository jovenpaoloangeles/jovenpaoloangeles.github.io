import { motion } from 'framer-motion';
import { Calendar, Award, Wrench, MapPin, ExternalLink } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { researchExperiences, conferences, books } from './research-data';
import { Card } from './ui/card';

// Research Experience Card Component
const ExperienceCard = ({ experience }: { experience: typeof researchExperiences[0] }) => (
  <Card className="p-4 hover:shadow-lg transition-all duration-200">
    <h3 className="text-lg font-semibold text-foreground">{experience.title}</h3>
    
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4 text-primary" />
        {experience.dateRange}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Award className="w-4 h-4 text-primary" />
        {experience.keyAchievements}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Wrench className="w-4 h-4 text-primary" />
        {experience.techniques}
      </div>
    </div>

    <div className="mt-3 pl-4 border-l-2 border-primary/20">
      <ul className="space-y-1">
        {experience.details.map((detail, idx) => (
          <li key={idx} className="text-sm text-muted-foreground">
            {detail}
          </li>
        ))}
      </ul>
    </div>
  </Card>
);

// Helper function to highlight name in authors string
const highlightName = (authors: string) => {
  const parts = authors.split(/(J\. Angeles)/g);
  return parts.map((part, index) => 
    part === 'J. Angeles' ? <strong key={index}>{part}</strong> : part
  );
};

// Book Card Component
const BookCard = ({ book }: { book: typeof books[0] }) => (
  <Card className="p-4 hover:shadow-lg transition-all duration-200">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{highlightName(book.authors)}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          {book.year}
        </div>
        <p className="text-sm text-muted-foreground">{book.description}</p>
        <div className="flex items-center gap-2">
          {book.roles.map((role, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
      <a
        href={book.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  </Card>
);

// Conference Card Component
const ConferenceCard = ({ conference }: { conference: typeof conferences[0] }) => (
  <Card className="p-4 hover:shadow-lg transition-all duration-200">
    <h3 className="text-lg font-medium text-foreground">{conference.title}</h3>
    <p className="text-sm text-muted-foreground mt-1">{highlightName(conference.authors)}</p>
    <div className="mt-2 space-y-1">
      <p className="text-sm text-muted-foreground">{conference.venue}</p>
      {conference.reference && (
        <p className="text-sm text-muted-foreground">Reference: {conference.reference}</p>
      )}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          {conference.date}
        </div>
        {conference.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            {conference.location}
          </div>
        )}
      </div>
    </div>
  </Card>
);

export function Research() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Accordion type="multiple" className="w-full space-y-4">
        <AccordionItem value="experience">
          <AccordionTrigger className="text-2xl font-serif py-4">
            Research Experience
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {researchExperiences.map((experience, index) => (
                <ExperienceCard key={index} experience={experience} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="books">
          <AccordionTrigger className="text-2xl font-serif py-4">
            Books and Book Chapters
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {books.map((book, index) => (
                <BookCard key={index} book={book} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="conferences">
          <AccordionTrigger className="text-2xl font-serif py-4">
            Conference Presentations
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
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
