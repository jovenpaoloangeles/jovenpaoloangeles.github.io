import { useEffect, useState } from 'react';
import { Network, List } from 'lucide-react';
import { TechStackList } from './techstack/TechStackList';
import { TechStackGraph } from './techstack/TechStackGraph';
import { cn } from '@/lib/utils';

type View = 'graph' | 'list';
const KEY = 'techstack-view';

function readView(): View {
  if (typeof window === 'undefined') return 'graph';
  return localStorage.getItem(KEY) === 'list' ? 'list' : 'graph';
}

export function TechStack() {
  const [view, setView] = useState<View>(readView);

  useEffect(() => {
    localStorage.setItem(KEY, view);
  }, [view]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-foreground">Technical Skills</h2>
        <div role="group" aria-label="Tech stack view" className="inline-flex rounded-md border border-border bg-card p-0.5">
          <button
            type="button"
            aria-label="Graph view"
            aria-pressed={view === 'graph'}
            onClick={() => setView('graph')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[calc(var(--radius)-2px)] px-2.5 py-1.5 text-xs font-medium transition-colors',
              view === 'graph' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Network className="h-3.5 w-3.5" /> Graph
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={view === 'list'}
            onClick={() => setView('list')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[calc(var(--radius)-2px)] px-2.5 py-1.5 text-xs font-medium transition-colors',
              view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <List className="h-3.5 w-3.5" /> List
          </button>
        </div>
      </div>

      {view === 'graph' ? <TechStackGraph /> : <TechStackList />}
    </div>
  );
}
