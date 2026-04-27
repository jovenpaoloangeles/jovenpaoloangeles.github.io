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

const projects: Project[] = [
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
      { label: 'Stack', value: 'TypeScript · React · D3.js' },
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
      { label: 'Stack', value: 'Python · Gradio · Sentence Transformers' },
    ],
  },
  {
    title: 'Puzzle-a-Day Solver',
    url: 'https://jovenpaoloangeles.github.io/puzzle-a-day/',
    description:
      'Algorithm X-powered solver that enumerates daily solutions for the DragonFjord A-Puzzle-A-Day board, complete with visual tiling proofs.',
    ctaLabel: 'Solve today’s puzzle',
    media: {
      alt: 'Puzzle-a-Day solver showing a completed calendar tile arrangement',
      width: 375,
      height: 375,
      png: '/projects/PuzzleADay.png',
      webp: '/projects/PuzzleADay.webp',
      avif: '/projects/PuzzleADay.avif',
    },
    meta: [
      { label: 'Stack', value: 'TypeScript · React · Algorithm X' },
    ],
  },
];

export const Projects: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-extrabold text-foreground mb-8">Projects</h2>
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
