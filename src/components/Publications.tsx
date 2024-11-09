import React from 'react';
import { BookOpen, Users, Link } from 'lucide-react';

export function Publications() {
  const publications = [
    {
      title: 'Machine Learning Approaches in Computational Biology: A Systematic Review',
      journal: 'Nature Computational Science',
      year: 2023,
      authors: 'Smith J., Johnson R., Williams K.',
      doi: '10.1038/s41567-023-0123-4',
      citations: 45,
    },
    {
      title: 'Deep Learning for Protein Structure Prediction',
      journal: 'Cell Systems',
      year: 2022,
      authors: 'Smith J., Davis M., Miller P.',
      doi: '10.1016/j.cell.2022.05.012',
      citations: 89,
    },
    {
      title: 'Advances in Genomic Data Analysis',
      journal: 'Genome Research',
      year: 2022,
      authors: 'Smith J., Brown A., Wilson T.',
      doi: '10.1101/gr.275842.121',
      citations: 32,
    },
  ];

  return (
    <section id="publications" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-serif">
            Publications
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Recent research publications in computational biology and bioinformatics
          </p>
        </div>
        <div className="mt-12 space-y-8">
          {publications.map((pub, index) => (
            <div
              key={index}
              className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {pub.title}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {pub.journal} ({pub.year})
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {pub.authors}
                </div>
                <div className="flex items-center">
                  <Link className="h-4 w-4 mr-1" />
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    className="text-blue-600 hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pub.doi}
                  </a>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Citations: {pub.citations}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}