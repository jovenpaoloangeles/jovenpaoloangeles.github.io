import React from 'react';
import { motion } from 'framer-motion';

// Custom SVG icon component
const TechIcon = ({ name }: { name: string }) => (
  <img 
    src={`/icons/${name.toLowerCase()}.${['matlab', 'jax'].includes(name.toLowerCase()) ? 'png' : 'svg'}`} 
    alt={`${name} icon`}
    className="w-5 h-5"
  />
);

export function TechStack() {
  const categories = [
    {
      title: 'Programming & Scientific Computing',
      description: 'For core algorithm development, numerical analysis, or prototyping.',
      items: [
        { name: 'Python', description: 'Scientific computing & data analysis', icon: 'python' },
        { name: 'MATLAB', description: 'Engineering & numerical computing', icon: 'matlab' },
        { name: 'R', description: 'Statistical analysis & data visualization', icon: 'r' },
        { name: 'JupyterLab', description: 'Interactive computing environment', icon: 'jupyter' },
        { name: 'Pandas', description: 'Data manipulation & analysis', icon: 'pandas' },
      ]
    },
    {
      title: 'Machine Learning & Optimization',
      description: 'For modeling, training, and optimization.',
      items: [
        { name: 'PyTorch', description: 'Deep learning framework', icon: 'pytorch' },
        { name: 'GPyTorch', description: 'Gaussian processes with PyTorch', icon: 'pytorch' }, // fallback icon
        { name: 'Botorch', description: 'Bayesian optimization', icon: 'pytorch' }, // fallback icon
        { name: 'Ax', description: 'Adaptive experimentation platform', icon: 'python' }, // fallback icon
        { name: 'JAX', description: 'High-performance ML & computing', icon: 'jax' },
      ]
    },
    {
      title: 'LLMs & Generative AI Tooling',
      description: 'For Retrieval-Augmented Generation (RAG), LLM APIs, and prompt-driven workflows.',
      items: [
        { name: 'LangChain', description: 'Framework for building LLM-powered applications', icon: 'langchain' },
        { name: 'n8n', description: 'Workflow automation platform', icon: 'n8n' },
        { name: 'OpenAI', description: 'LLM API provider', icon: 'openai' },
        { name: 'Gemini', description: 'Google’s generative AI model', icon: 'gemini' },
        { name: 'Ollama', description: 'Local LLMs & orchestration', icon: 'ollama' },
        { name: 'Openrouter', description: 'Unified API for LLMs', icon: 'openrouter' },
      ]
    },
    {
      title: 'Creative Coding & Visualization',
      description: 'For generative art, simulations, and interactive visualizations.',
      items: [
        { name: 'p5.js', description: 'Creative coding in JavaScript', icon: 'p5js' },
        { name: 'Processing', description: 'Visual arts & creative coding', icon: 'processing' },
        { name: 'Plotly', description: 'Interactive dashboards', icon: 'plotly' },
        { name: 'Streamlit', description: 'Data apps', icon: 'streamlit' },
      ]
    },
    {
      title: 'Web Development & Interface',
      description: 'For frontend/backend and app deployment.',
      items: [
        { name: 'React', description: 'Frontend development', icon: 'react' },
        { name: 'Vite', description: 'Frontend build tool', icon: 'vite' },
        { name: 'TypeScript', description: 'Typed JavaScript', icon: 'typescript' },
        { name: 'FastAPI', description: 'Modern Python web APIs', icon: 'fastapi' },
        { name: 'Flask', description: 'Lightweight web framework', icon: 'flask' },
        { name: 'Node.js', description: 'JavaScript runtime', icon: 'nodejs' },
      ]
    },
    {
      title: 'DevOps & Deployment',
      description: 'Infrastructure tools that support reproducibility, scalability, or deployment.',
      items: [
        { name: 'Docker', description: 'Containerization & deployment', icon: 'docker' },
      ]
    },
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
            <p className="text-sm text-gray-600 mb-2">{category.description}</p>
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
