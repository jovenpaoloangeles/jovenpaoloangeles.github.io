import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, Wrench, MapPin, ExternalLink } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from './ui/card';
import {
  loadResearchContent,
  type ResearchBook,
  type ResearchConference,
  type ResearchContent,
  type ResearchExperience,
  type PeerReviewedPublication,
  type SubmittedPublication,
  type InPreparationPublication,
  type Certification,
} from '@/lib/content';

type AsyncState = 'idle' | 'loading' | 'success' | 'error';

// Research Experience Card Component
const ExperienceCard = ({ experience }: { experience: ResearchExperience }) => (
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
  const parts = authors.split(/(J\. P\. D\. Angeles|J\. Angeles)/g);
  return parts.map((part, index) => 
    (part === 'J. P. D. Angeles' || part === 'J. Angeles') ? <strong key={index}>{part}</strong> : part
  );
};

// Peer-Reviewed Publication Card Component
const PeerReviewedCard = ({ publication }: { publication: PeerReviewedPublication }) => (
  <Card className="p-4 hover:shadow-lg transition-all duration-200">
    <h3 className="text-lg font-medium text-foreground">{publication.title}</h3>
    <p className="text-sm text-muted-foreground mt-1">{highlightName(publication.authors)}</p>
    <div className="mt-2 space-y-1">
      <p className="text-sm text-muted-foreground italic">{publication.journal}</p>
      <p className="text-sm text-muted-foreground">
        Vol. {publication.volume}, No. {publication.issue}, p. {publication.pages}, {publication.month} {publication.year}
      </p>
      {publication.doi && (
        <a
          href={publication.doi}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          DOI Link
        </a>
      )}
    </div>
  </Card>
);

// Submitted Publication Card Component
const SubmittedCard = ({ publication }: { publication: SubmittedPublication }) => (
  <Card className="p-4 hover:shadow-lg transition-all duration-200">
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <h3 className="text-lg font-medium text-foreground">{publication.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{highlightName(publication.authors)}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-muted-foreground italic">{publication.journal}</p>
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
            {publication.status}
          </span>
        </div>
      </div>
    </div>
  </Card>
);

// In Preparation Publication Card Component
const InPreparationCard = ({ publication }: { publication: InPreparationPublication }) => (
  <Card className="p-4 hover:shadow-lg transition-all duration-200">
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <h3 className="text-lg font-medium text-foreground">{publication.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{highlightName(publication.authors)}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-muted-foreground italic">{publication.journal}</p>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
            {publication.status}
          </span>
        </div>
      </div>
    </div>
  </Card>
);

// Certification Card Component
const CertificationCard = ({ certification }: { certification: Certification }) => (
  <Card className="p-4 hover:shadow-lg transition-all duration-200">
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <Award className="w-5 h-5 text-primary mt-1 shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-foreground">{certification.title}</h3>
          {certification.details && (
            <p className="text-sm text-muted-foreground mt-1">{certification.details}</p>
          )}
        </div>
      </div>
      {certification.courses && certification.courses.length > 0 && (
        <div className="pl-7 space-y-2">
          {certification.courses.map((course, idx) => (
            <div key={idx} className="border-l-2 border-primary/20 pl-3">
              <p className="text-sm font-medium text-foreground">{course.name}</p>
              <p className="text-xs text-muted-foreground">
                License: {course.license} • {course.date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  </Card>
);

// Book Card Component
const BookCard = ({ book }: { book: ResearchBook }) => (
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
const ConferenceCard = ({ conference }: { conference: ResearchConference }) => (
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
  const [content, setContent] = useState<ResearchContent | null>(null);
  const [status, setStatus] = useState<AsyncState>('idle');

  useEffect(() => {
    let isActive = true;
    setStatus('loading');

    loadResearchContent()
      .then((data) => {
        if (isActive) {
          setContent(data);
          setStatus('success');
        }
      })
      .catch(() => {
        if (isActive) {
          setStatus('error');
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  if (status === 'loading' || status === 'idle') {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Loading research content…</p>
      </Card>
    );
  }

  if (status === 'error' || !content) {
    return (
      <Card className="p-6">
        <p className="text-destructive">Unable to load research content. Please try again later.</p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Accordion type="multiple" defaultValue={['experience']} className="w-full space-y-4">
        <AccordionItem value="experience">
          <AccordionTrigger className="text-2xl font-serif text-foreground py-4">
            Research Experience
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {content.experiences.map((experience, index) => (
                <ExperienceCard key={index} experience={experience} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {content.publications && (
          <AccordionItem value="publications">
            <AccordionTrigger className="text-2xl font-serif text-foreground py-4">
              Publications
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-2">
                {content.publications.peerReviewed.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                      Peer-Reviewed Publications
                    </h3>
                    <div className="space-y-4">
                      {content.publications.peerReviewed.map((publication, index) => (
                        <PeerReviewedCard key={index} publication={publication} />
                      ))}
                    </div>
                  </div>
                )}

                {content.publications.submitted.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                      Submitted Manuscripts
                    </h3>
                    <div className="space-y-4">
                      {content.publications.submitted.map((publication, index) => (
                        <SubmittedCard key={index} publication={publication} />
                      ))}
                    </div>
                  </div>
                )}

                {content.publications.inPreparation.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                      Manuscripts in Preparation
                    </h3>
                    <div className="space-y-4">
                      {content.publications.inPreparation.map((publication, index) => (
                        <InPreparationCard key={index} publication={publication} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="books">
          <AccordionTrigger className="text-2xl font-serif text-foreground py-4">
            Books and Book Chapters
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {content.books.map((book, index) => (
                <BookCard key={index} book={book} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="conferences">
          <AccordionTrigger className="text-2xl font-serif text-foreground py-4">
            Conference Presentations
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {content.conferences.map((conference, index) => (
                <ConferenceCard key={index} conference={conference} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {content.certifications && content.certifications.length > 0 && (
          <AccordionItem value="certifications">
            <AccordionTrigger className="text-2xl font-serif text-foreground py-4">
              Certifications
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {content.certifications.map((certification, index) => (
                  <CertificationCard key={index} certification={certification} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </motion.div>
  );
}
