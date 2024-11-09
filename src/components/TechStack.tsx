import React from 'react';
import { motion } from 'framer-motion';

// Custom SVG icon component
const TechIcon = ({ name }: { name: string }) => (
  <img 
    src={`/icons/${name.toLowerCase()}.${name === 'matlab' ? 'png' : 'svg'}`} 
    alt={`${name} icon`}
    className="w-5 h-5"
  />
);

export function TechStack() {
  const categories = [
    {
      title: 'Core Languages & Tools',
      items: [
        { name: 'Python', description: 'Scientific computing & data analysis', icon: 'python' },
        { name: 'MATLAB', description: 'Engineering & numerical computing', icon: 'matlab' },
        { name: 'R', description: 'Statistical analysis & data visualization', icon: 'r' },
        { name: 'Pandas', description: 'Data manipulation & analysis', icon: 'pandas' },
        { name: 'JupyterLab', description: 'Interactive computing environment', icon: 'jupyter' }
      ]
    },
    {
      title: 'Creative Coding',
      items: [
        { name: 'p5.js', description: 'Creative coding in JavaScript', icon: 'p5js' },
        { name: 'Processing 4.3', description: 'Visual arts & creative coding', icon: 'processing' }
      ]
    },
    {
      title: 'Data Science & ML',
      items: [
        { name: 'PyTorch', description: 'Deep learning framework', icon: 'pytorch' },
        { name: 'Botorch', description: 'Bayesian optimization', icon: 'pytorch' }, // Using PyTorch icon as fallback
        { name: 'JAX', description: 'High-performance ML & computing', icon: 'python' } // Using Python icon as fallback
      ]
    },
    {
      title: 'UI & Visualization',
      items: [
        { name: 'React', description: 'Frontend development', icon: 'react' },
        { name: 'Streamlit', description: 'Data apps', icon: 'streamlit' },
        { name: 'Plotly', description: 'Interactive dashboards', icon: 'plotly' },
        { name: 'Vite', description: 'Frontend build tool', icon: 'vite' }, // Assuming vite.svg exists
        { name: 'TypeScript', description: 'Typed JavaScript', icon: 'typescript' } // Assuming typescript.svg exists
      ]
    },
    {
      title: 'Web & APIs',
      items: [
        { name: 'FastAPI', description: 'Modern Python web APIs', icon: 'fastapi' },
        { name: 'Flask', description: 'Lightweight web framework', icon: 'flask' },
        { name: 'Node.js', description: 'JavaScript runtime', icon: 'nodejs' }
      ]
    },
    {
      title: 'Infrastructure',
      items: [
        { name: 'Docker', description: 'Containerization & deployment', icon: 'docker' }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-serif mb-6">Technical Skills</h2>
      
      <div className="space-y-8">
        {categories.map((category, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">{category.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    <TechIcon name={item.icon} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
