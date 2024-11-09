import React from 'react';
import { Award, Star, Trophy } from 'lucide-react';

export function Achievements() {
  const achievements = [
    {
      category: 'Awards',
      icon: Trophy,
      items: [
        {
          title: 'NSF CAREER Award',
          year: '2023',
          description: 'For outstanding research in computational biology',
        },
        {
          title: 'Young Investigator Award',
          year: '2022',
          description: 'American Society for Computational Biology',
        },
      ],
    },
    {
      category: 'Grants',
      icon: Award,
      items: [
        {
          title: 'NIH R01 Grant',
          year: '2023-2028',
          description: 'Machine learning approaches in protein structure prediction',
        },
        {
          title: 'Stanford Bio-X Grant',
          year: '2022-2024',
          description: 'Interdisciplinary research in computational genomics',
        },
      ],
    },
    {
      category: 'Recognition',
      icon: Star,
      items: [
        {
          title: 'Faculty Excellence in Teaching',
          year: '2023',
          description: 'Stanford School of Engineering',
        },
        {
          title: 'Rising Star in AI',
          year: '2022',
          description: 'MIT Technology Review',
        },
      ],
    },
  ];

  return (
    <section id="achievements" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-serif">
            Academic Achievements
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Recognition for excellence in research and teaching
          </p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {achievements.map((category) => (
            <div key={category.category} className="space-y-8">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <category.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  {category.category}
                </h3>
              </div>
              <div className="space-y-4">
                {category.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-blue-600">{item.year}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      {item.description}
                    </p>
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