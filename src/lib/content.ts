import type { Activity } from '@/components/types';

export interface ResearchExperience {
  title: string;
  dateRange: string;
  keyAchievements: string;
  techniques: string;
  details: string[];
}

export interface ResearchConference {
  title: string;
  authors: string;
  venue: string;
  location?: string;
  date: string;
  reference?: string;
}

export interface ResearchBook {
  title: string;
  authors: string;
  year: number;
  publisher: string;
  url: string;
  roles: string[];
  description: string;
}

export interface PeerReviewedPublication {
  title: string;
  authors: string;
  journal: string;
  volume: string;
  issue: string;
  pages: string;
  year: number;
  month: string;
  doi: string;
}

export interface SubmittedPublication {
  title: string;
  authors: string;
  journal: string;
  status: string;
}

export interface InPreparationPublication {
  title: string;
  authors: string;
  journal: string;
  status: string;
}

export interface Publications {
  peerReviewed: PeerReviewedPublication[];
  submitted: SubmittedPublication[];
  inPreparation: InPreparationPublication[];
}

export interface CertificationCourse {
  name: string;
  license: string;
  date: string;
}

export interface Certification {
  title: string;
  details?: string;
  courses?: CertificationCourse[];
}

export interface ResearchContent {
  experiences: ResearchExperience[];
  conferences: ResearchConference[];
  books: ResearchBook[];
  publications?: Publications;
  certifications?: Certification[];
}

type ActivityRecord = Omit<Activity, 'timestamp'> & { timestamp: string };

let researchContentPromise: Promise<ResearchContent> | null = null;
let activitiesPromise: Promise<Activity[]> | null = null;

export const loadResearchContent = async (): Promise<ResearchContent> => {
  if (!researchContentPromise) {
    researchContentPromise = import('@/content/research.json').then((module) => module.default as ResearchContent);
  }

  return researchContentPromise;
};

export const loadActivities = async (): Promise<Activity[]> => {
  if (!activitiesPromise) {
    activitiesPromise = import('@/content/activities.json').then((module) => {
      const records = module.default as ActivityRecord[];
      return records.map((record) => ({
        ...record,
        timestamp: new Date(record.timestamp),
      }));
    });
  }

  return activitiesPromise;
};
