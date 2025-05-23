import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { About } from './components/About';
import { Research } from './components/Research';
import { TechStack } from './components/TechStack';
import { CreativeCoding } from './components/CreativeCoding';
import { Projects } from './components/Projects';
import { Photography } from './components/Photography';
import { Awards } from './components/Awards';
import { RecentActivities } from './components/RecentActivities';

// Define tab interface for better type safety
interface Tab {
  value: string;
  label: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('about');

  // Define tabs with their values and labels
  const tabs: Tab[] = [
    { value: 'about', label: 'About' },
    { value: 'recent-activities', label: 'Recent Activities' },
    { value: 'research', label: 'Research' },
    { value: 'tech-stack', label: 'Tech Stack' },
    { value: 'projects', label: 'Projects' },
    { value: 'creative-coding', label: 'Creative Coding' },
    { value: 'photography', label: 'Photography' },
    { value: 'awards', label: 'Awards' }
  ];

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <About />;
      case 'research':
        return <Research />;
      case 'tech-stack':
        return <TechStack />;
      case 'projects':
        return <Projects />;
      case 'creative-coding':
        return <CreativeCoding />;
      case 'photography':
        return <Photography />;
      case 'awards':
        return <Awards />;
      case 'recent-activities':
        return <RecentActivities />;
      default:
        return <About />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-12 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 lg:grid-cols-3"
        >
          <Header />
          <div className="space-y-6 lg:col-span-2">
            <div className="bg-card rounded-lg shadow-sm">
              <div className="border-b border-border">
                <div className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                        activeTab === tab.value
                          ? 'border-b-2 border-primary text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:border-muted'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6">{renderContent()}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
