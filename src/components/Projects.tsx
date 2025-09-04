import React from 'react';

const projects = [
  {
    title: 'Philippine WFH Optimizer',
    url: 'https://jovenpaoloangeles.github.io/philippine-wfh-optimizer/',
    icon: (
      <img
        src="/projects/WFHOptimizer.png"
        alt="WFH icon"
        className="w-20 h-20 object-contain bg-white"
      />
    ),
    description:
      'Optimize long weekends by smartly combining Philippine holidays with weekends—get more consecutive days off with fewer leave credits',
    button: 'Try it →',
  },
  {
    title: 'XRD Analyzer',
    url: 'https://jovenpaoloangeles.github.io/xrd-analyzer/',
    icon: (
      <img
        src="/projects/XRDAnalyzer.png"
        alt="XRD Analyzer icon"
        className="w-20 h-20 object-contain bg-white"
      />
    ),
    description:
      'A web-based tool for visualizing and analyzing X-ray diffraction (XRD) data. It allows users to upload .xy or .csv files, plot diffraction patterns, and identify peaks to aid in phase identification and material characterization. Designed for rapid analysis in research and instructional settings.',
    button: 'Try it →',
  },
  {
    title: 'ChunkingExpress',
    url: 'https://huggingface.co/spaces/jovenpaolo/ChunkingExpress',
    icon: (
      <img
        src="/projects/ChunkingExpress.png"
        alt="ChunkingExpress icon"
        className="w-20 h-20 object-contain bg-white"
      />
    ),
    description:
      'An interactive app for document chunking and preview, tailored for Retrieval-Augmented Generation (RAG) pipelines. Users can upload text or PDF documents and configure chunking strategies using sentence transformers, with real-time visualization of the resulting segments.',
    button: 'Try it →',
  },
  {
    title: 'Puzzle-a-Day',
    url: 'https://jovenpaoloangeles.github.io/puzzle-a-day/',
    icon: (
      <img
        src="/projects/PuzzleADay.png"
        alt="Puzzle-a-Day icon"
        className="w-20 h-20 object-contain bg-white"
      />
    ),
    description:
      'A web-based solver for DragonFjord’s A-Puzzle-A-Day, integrating Algorithm X by Donald Knuth to compute all valid tile configurations for each calendar date. The app reports the total number of solutions and presents one example per day, providing both an educational and practical tool for users of the physical puzzle sold through our 3D printing company, PRINT3D.MNL.',
    button: 'Try it →',
  },
];

export const Projects: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-8">Projects</h2>
      <div className="flex flex-col gap-8">
        {projects.map((project) => (
          <div
            key={project.title}
            className="bg-card rounded-xl shadow transition-shadow duration-200 p-6 flex items-center gap-6 hover:shadow-lg cursor-pointer"
          >
            <div className="flex-shrink-0">
              {project.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-xl sm:text-2xl text-foreground leading-snug">
                  {project.title}
                </span>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                {project.description}
              </p>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 rounded bg-primary text-white font-medium shadow hover:text-teal-500 hover:bg-primary/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400"
                tabIndex={0}
              >
                {project.button}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
