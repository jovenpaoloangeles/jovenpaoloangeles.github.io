import { useEffect, useRef, useState } from 'react';
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

const DEFAULT_TAB = 'about';

const TABS: Tab[] = [
  { value: 'about', label: 'About' },
  { value: 'recent-activities', label: 'Recent Activities' },
  { value: 'research', label: 'Research' },
  { value: 'tech-stack', label: 'Tech Stack' },
  { value: 'projects', label: 'Projects' },
  { value: 'creative-coding', label: 'Creative Coding' },
  { value: 'photography', label: 'Photography' },
  { value: 'awards', label: 'Awards' }
];

const TAB_VALUES = TABS.map((tab) => tab.value);

const getTabFromHash = (): string => {
  if (typeof window === 'undefined') {
    return DEFAULT_TAB;
  }

  const hash = window.location.hash.replace('#', '');
  return TAB_VALUES.includes(hash) ? hash : DEFAULT_TAB;
};

function App() {
  const [activeTab, setActiveTab] = useState<string>(() => getTabFromHash());
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const handleHashChange = () => {
      const nextTab = getTabFromHash();
      setActiveTab((current) => (current === nextTab ? current : nextTab));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const nextHash = `#${activeTab}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash);
    }
  }, [activeTab]);

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TABS.findIndex((tab) => tab.value === activeTab);
    if (currentIndex === -1) {
      return;
    }

    let nextIndex = currentIndex;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % TABS.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = TABS.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextTab = TABS[nextIndex];
    setActiveTab(nextTab.value);
    tabRefs.current[nextTab.value]?.focus();
  };

  const handleTabClick = (value: string) => {
    setActiveTab(value);
    tabRefs.current[value]?.focus();
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
                <div
                  className="flex overflow-x-auto"
                  role="tablist"
                  aria-label="Main sections"
                  onKeyDown={handleKeyDown}
                >
                  {TABS.map((tab) => (
                    <button
                      key={tab.value}
                      ref={(node) => {
                        tabRefs.current[tab.value] = node;
                      }}
                      id={`tab-${tab.value}`}
                      role="tab"
                      aria-selected={activeTab === tab.value}
                      aria-controls={`panel-${tab.value}`}
                      tabIndex={activeTab === tab.value ? 0 : -1}
                      onClick={() => handleTabClick(tab.value)}
                      className={`px-4 py-2 text-sm font-medium whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
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
              {TABS.map((tab) => (
                <div
                  key={tab.value}
                  id={`panel-${tab.value}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${tab.value}`}
                  tabIndex={activeTab === tab.value ? 0 : -1}
                  hidden={activeTab !== tab.value}
                  className="p-6"
                >
                  {activeTab === tab.value ? renderContent() : null}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
