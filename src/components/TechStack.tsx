import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Calculator,
  Brain,
  Database,
  Palette,
  Beaker,
  Layout,
  Server,
  Container,
  Cpu,
  Binary,
  LineChart
} from 'lucide-react';

export function TechStack() {
  const categories = [
    {
      title: 'Core Languages & Tools',
      items: [
        { name: 'Python', description: 'Scientific computing & data analysis', icon: Code2 },
        { name: 'MATLAB', description: 'Engineering & numerical computing', icon: Calculator },
        { name: 'R', description: 'Statistical analysis & data visualization', icon: LineChart },
        { name: 'Pandas', description: 'Data manipulation & analysis', icon: Database },
        { name: 'JupyterLab', description: 'Interactive computing environment', icon: Binary }
      ]
    },
    {
      title: 'Creative Coding',
      items: [
        { name: 'p5.js', description: 'Creative coding in JavaScript', icon: Palette },
        { name: 'Processing 4.3', description: 'Visual arts & creative coding', icon: Palette }
      ]
    },
    {
      title: 'Data Science & ML',
      items: [
        { name: 'PyTorch', description: 'Deep learning framework', icon: Brain },
        { name: 'Botorch', description: 'Bayesian optimization', icon: Brain },
        { name: 'JAX', description: 'High-performance ML & computing', icon: Cpu }
      ]
    },
    {
      title: 'UI & Visualization',
      items: [
        { name: 'ShadCN', description: 'Modern UI components', icon: Layout },
        { name: 'React', description: 'Frontend development', icon: Layout },
        { name: 'Gradio', description: 'ML model interfaces', icon: Layout },
        { name: 'Streamlit', description: 'Data apps', icon: Layout },
        { name: 'Plotly Dash', description: 'Interactive dashboards', icon: Layout }
      ]
    },
    {
      title: 'Web & APIs',
      items: [
        { name: 'FastAPI', description: 'Modern Python web APIs', icon: Server },
        { name: 'Flask', description: 'Lightweight web framework', icon: Beaker },
        { name: 'Node.js', description: 'JavaScript runtime', icon: Server }
      ]
    },
    {
      title: 'Infrastructure',
      items: [
        { name: 'Docker', description: 'Containerization & deployment', icon: Container }
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
              {category.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}