import React from 'react';

interface ProjectMedia {
  alt: string;
  width: number;
  height: number;
  png: string;
  webp?: string;
  avif?: string;
}

interface ProjectMetaItem {
  label: string;
  value: string;
}

interface Project {
  title: string;
  url: string;
  description: string;
  ctaLabel: string;
  media: ProjectMedia;
  meta: ProjectMetaItem[];
}

// Impact values are operator-supplied facts; do not estimate.
const projects: Project[] = [
  {
    title: 'ACABAI-PH',
    url: 'https://acabai.ph/',
    description:
      'Program website for ACABAI-PH, the DOST-ASTI flagship initiative advancing computing, analytics, big data, and artificial intelligence in the Philippines — the national hub behind DOST-NAIRA, iTANONG, DIMER, and nationwide AI capacity building.',
    ctaLabel: 'Visit acabai.ph',
    media: {
      alt: 'ACABAI-PH program launch at the NAICRI formal launch event',
      width: 512,
      height: 512,
      png: '/projects/ACABAI.jpg',
      webp: '/projects/ACABAI.webp',
      avif: '/projects/ACABAI.avif',
    },
    meta: [
      { label: 'Stack', value: 'React · TypeScript · Vite · Tailwind CSS' },
      { label: 'Team', value: 'DOST-ASTI · ACABAI-PH Program' },
      { label: 'Impact', value: '3-year DOST flagship · national program launch' },
    ],
  },
  {
    title: 'DOST-NAIRA',
    url: 'https://acabai.ph/naira',
    description:
      'DOST Nexus for Artificial Intelligence Research and Applications — a shared AI-as-a-Service platform that lets researchers, MSMEs, and government agencies adopt AI without building their own infrastructure.',
    ctaLabel: 'Explore DOST-NAIRA',
    media: {
      alt: 'DIMER logo — model repository at the core of the DOST-NAIRA AI-as-a-Service platform',
      width: 512,
      height: 512,
      png: '/projects/NAIRA.jpg',
      webp: '/projects/NAIRA.webp',
      avif: '/projects/NAIRA.avif',
    },
    meta: [
      { label: 'Stack', value: 'AI-as-a-Service · AI/ML Platform' },
      { label: 'Team', value: 'DOST-ASTI · DOST-NAIRA' },
      { label: 'Impact', value: 'Shared AI compute for researchers, MSMEs, and agencies' },
    ],
  },
  {
    title: 'JuanaKNOW by PROPEL',
    url: 'https://juanaknow.asti.dost.gov.ph/',
    description:
      'Multi-agent AI system for market intelligence and technology assessment under DOST Program PROPEL, helping innovators evaluate novelty, access funding, and navigate commercialization.',
    ctaLabel: 'Ask JuanaKNOW',
    media: {
      alt: 'JuanaKNOW chat interface showing AI-powered technology assessment',
      width: 1368,
      height: 216,
      png: '/projects/JUANAKNOW.png',
    },
    meta: [
      { label: 'Stack', value: 'Agno · Python · PostgreSQL' },
      { label: 'Team', value: 'DOST-ASTI · Program PROPEL' },
      { label: 'Impact', value: 'IP assessment for DOST innovators under Program PROPEL' },
    ],
  },
  {
    title: 'iTANONG',
    url: 'https://asti.dost.gov.ph/projects/itanong/',
    description:
      'Natural Language Interface to Databases that lets users query government data in Filipino, English, or Taglish — a multilingual NLIDB system by DOST-ASTI.',
    ctaLabel: 'Learn about iTANONG',
    media: {
      alt: 'iTANONG natural language database query interface',
      width: 800,
      height: 246,
      png: '/projects/iTANONG.jpg',
    },
    meta: [
      { label: 'Stack', value: 'OpenAI · LangChain · ChromaDB · FastAPI' },
      { label: 'Team', value: 'DOST-ASTI' },
      { label: 'Impact', value: 'Public beta serving government data queries in 3 languages' },
    ],
  },
  {
    title: 'Philippine WFH Optimizer',
    url: 'https://jovenpaoloangeles.github.io/philippine-wfh-optimizer/',
    description:
      'Optimize long weekends by combining official Philippine holidays with leave credits to surface the most efficient multi-day breaks.',
    ctaLabel: 'Plan long weekends',
    media: {
      alt: 'Screenshot of the Philippine WFH Optimizer holiday planner dashboard',
      width: 512,
      height: 512,
      png: '/projects/WFHOptimizer.png',
      webp: '/projects/WFHOptimizer.webp',
    },
    meta: [
      { label: 'Stack', value: 'TypeScript · React · shadcn/ui · Tailwind CSS' },
      { label: 'Impact', value: 'Open tool · no login, runs client-side' },
    ],
  },
  {
    title: 'XRD Analyzer',
    url: 'https://jovenpaoloangeles.github.io/xrd-analyzer/',
    description:
      'Interactive X-ray diffraction analyzer for uploading XY/CSV files, highlighting peaks, and accelerating material characterization workflows.',
    ctaLabel: 'Launch analyzer',
    media: {
      alt: 'XRD Analyzer interface plotting diffraction intensity data',
      width: 373,
      height: 373,
      png: '/projects/XRDAnalyzer.png',
      webp: '/projects/XRDAnalyzer.webp',
      avif: '/projects/XRDAnalyzer.avif',
    },
    meta: [
      { label: 'Stack', value: 'TypeScript · React · Plotly.js · MUI' },
      { label: 'Impact', value: 'Open tool used for materials characterization coursework' },
    ],
  },
  {
    title: 'ChunkingExpress',
    url: 'https://huggingface.co/spaces/jovenpaolo/ChunkingExpress',
    description:
      'Document chunking playground for Retrieval-Augmented Generation pipelines with configurable segment strategies and live previews.',
    ctaLabel: 'Try the RAG tool',
    media: {
      alt: 'ChunkingExpress web app highlighting chunked text segments',
      width: 387,
      height: 387,
      png: '/projects/ChunkingExpress.png',
      webp: '/projects/ChunkingExpress.webp',
      avif: '/projects/ChunkingExpress.avif',
    },
    meta: [
      { label: 'Stack', value: 'Python · Streamlit · LangChain · Hugging Face Transformers' },
      { label: 'Impact', value: 'Public Hugging Face Space for RAG experiments' },
    ],
  },
  {
    title: 'Puzzle-a-Day Solver',
    url: 'https://jovenpaoloangeles.github.io/puzzle-a-day/',
    description:
      'Algorithm X-powered solver that enumerates daily solutions for the DragonFjord A-Puzzle-A-Day board, complete with visual tiling proofs.',
    ctaLabel: "Solve today's puzzle",
    media: {
      alt: 'Puzzle-a-Day solver showing a completed calendar tile arrangement',
      width: 375,
      height: 375,
      png: '/projects/PuzzleADay.png',
      webp: '/projects/PuzzleADay.webp',
      avif: '/projects/PuzzleADay.avif',
    },
    meta: [
      { label: 'Stack', value: 'TypeScript · Python · React · Vite' },
      { label: 'Impact', value: 'Enumerates full daily solution space in-browser' },
    ],
  },
];

export const Projects: React.FC = () => {
  return (
    <div>
      <h2 className="font-display tracking-tight leading-[1.05] text-[length:var(--step-h2)] text-foreground mb-8">Projects</h2>
      <div className="flex flex-col gap-8">
        {projects.map((project) => {
          const headingId = `project-${project.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
          return (
          <a
            key={project.title}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-card rounded-xl shadow transition-shadow duration-200 p-6 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary hover:shadow-lg"
              aria-labelledby={headingId}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex-shrink-0">
                <picture>
                  {project.media.avif && (
                    <source type="image/avif" srcSet={project.media.avif} />
                  )}
                  {project.media.webp && (
                    <source type="image/webp" srcSet={project.media.webp} />
                  )}
                  <img
                    src={project.media.png}
                    alt={project.media.alt}
                    width={project.media.width}
                    height={project.media.height}
                    loading="lazy"
                    decoding="async"
                    className="w-24 h-24 object-contain rounded-md bg-card shadow-sm"
                    onError={(event) => {
                      const img = event.currentTarget;
                      if (img.dataset.fallbackApplied === 'true') {
                        return;
                      }
                      img.dataset.fallbackApplied = 'true';
                      img.src = project.media.png;
                      img.srcset = '';
                    }}
                  />
                </picture>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 id={headingId} className="font-bold text-xl sm:text-2xl text-foreground leading-snug">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <dl className="flex flex-wrap gap-x-4 gap-y-1">
                  {project.meta.map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-1 text-xs">
                      <dt className="font-medium text-foreground">{label}:</dt>
                      <dd className="text-muted-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>

                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {project.ctaLabel}
                  <span aria-hidden>→</span>
                </span>
              </div>
            </div>
          </a>
          );
        })}
      </div>
    </div>
  );
};
