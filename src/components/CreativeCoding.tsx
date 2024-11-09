import React from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';

export function CreativeCoding() {
  const projects = [
    {
      title: 'Generative Art with P5.js',
      description: 'Creating algorithmic artwork using JavaScript and P5.js library.',
    },
    {
      title: 'Interactive Visualizations',
      description: 'Data visualization projects using D3.js and WebGL.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-serif mb-4">Creative Coding</h2>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">{project.title}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}