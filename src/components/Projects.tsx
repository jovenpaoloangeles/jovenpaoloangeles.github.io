import React from 'react';
import { FlaskConical, GitBranch, Users } from 'lucide-react';

export function Projects() {
  const projects = [
    {
      title: 'DeepProtein',
      status: 'Active',
      collaborators: 12,
      description: 'Deep learning framework for protein structure prediction using transformer architectures.',
      highlights: [
        'State-of-the-art accuracy in structure prediction',
        'Published in Nature Methods',
        'Open-source implementation with over 1000 stars on GitHub',
      ],
    },
    {
      title: 'GenomeNet',
      status: 'Active',
      collaborators: 8,
      description: 'Novel approach to genomic data analysis using graph neural networks.',
      highlights: [
        'Scalable processing of large-scale genomic data',
        'Collaboration with major research institutions',
        'NIH funded project',
      ],
    },
    {
      title: 'BioML Workshop',
      status: 'Ongoing',
      collaborators: 5,
      description: 'Annual workshop on machine learning applications in biology.',
      highlights: [
        'Over 500 participants annually',
        'International speaker series',
        'Hands-on training sessions',
      ],
    },
  ];

  return (
    <section id="projects" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-serif">
            Current Projects
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Ongoing research initiatives and collaborations
          </p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {project.title}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {project.status}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Users className="h-4 w-4 mr-1" />
                {project.collaborators} Collaborators
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="space-y-2">
                {project.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-start">
                    <FlaskConical className="h-4 w-4 text-blue-600 mt-1 mr-2" />
                    <span className="text-sm text-gray-500">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}