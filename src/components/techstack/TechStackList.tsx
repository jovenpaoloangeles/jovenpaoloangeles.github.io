import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { TECHSTACK_DOMAINS, TECHSTACK_TOOLS, type Tool, type ToolLevel } from '@/content/techstack';
import { TechIcon } from './icon';
import { cn } from '@/lib/utils';

function ToolCard({ tool, tier, parentName }: { tool: Tool; tier: 'sig' | 'sup'; parentName?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-md p-3 transition-colors',
        tier === 'sig'
          ? 'bg-card border border-border hover:-translate-y-0.5 hover:border-muted-foreground/30'
          : 'bg-muted/60 hover:bg-card hover:border-border border border-transparent'
      )}
    >
      <span className="mt-0.5 shrink-0">
        <TechIcon tool={tool} size={tier === 'sig' ? 24 : 20} />
      </span>
      <div className="min-w-0">
        <span className="inline-flex items-center gap-1.5">
          <span className={cn('font-semibold text-foreground', tier === 'sig' ? 'text-[0.95rem]' : 'text-sm font-medium')}>
            {tool.name}
          </span>
          {tool.isNew && (
            <span className="rounded-sm bg-primary px-1 py-px text-[0.6rem] font-bold uppercase tracking-wider text-primary-foreground">
              new
            </span>
          )}
        </span>
        {parentName && (
          <p className="mt-0 text-[0.6rem] text-muted-foreground">↳ {parentName}</p>
        )}
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{tool.role}</p>
      </div>
    </div>
  );
}

export function TechStackList() {
  const toolById = new Map(TECHSTACK_TOOLS.map((t) => [t.id, t]));
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TECHSTACK_DOMAINS.map((d) => [d.id, true]))
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-4">
      <p className="max-w-prose text-sm text-muted-foreground">
        Six domains, three depths of use — full cards for daily drivers, named entries for working knowledge,
        chips for the rest. Every domain is a genuine part of how I work.
      </p>

      {TECHSTACK_DOMAINS.map((d) => {
        const tools = TECHSTACK_TOOLS.filter((t) => t.domainId === d.id || t.also?.includes(d.id));
        const group = (lv: ToolLevel) => tools.filter((t) => t.level === lv);
        const isOpen = open[d.id];
        return (
          <section key={d.id} className="rounded-lg border border-border bg-card/50">
            <button
              type="button"
              onClick={() => setOpen((prev) => ({ ...prev, [d.id]: !prev[d.id] }))}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold leading-tight text-foreground">{d.name}</h3>
                <p className="text-sm text-muted-foreground">{d.role}</p>
              </div>
              <ChevronDown
                className={cn('shrink-0 h-4 w-4 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 px-4 pb-4">
                    {group('sig').length > 0 && (
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {group('sig').map((t) => (
                          <ToolCard
                            key={t.id}
                            tool={t}
                            tier="sig"
                            parentName={t.parent ? toolById.get(t.parent)?.name : undefined}
                          />
                        ))}
                      </div>
                    )}
                    {group('sup').length > 0 && (
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {group('sup').map((t) => (
                          <ToolCard
                            key={t.id}
                            tool={t}
                            tier="sup"
                            parentName={t.parent ? toolById.get(t.parent)?.name : undefined}
                          />
                        ))}
                      </div>
                    )}
                    {group('chip').length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs italic text-muted-foreground">also</span>
                        {group('chip').map((t) => (
                          <span
                            key={t.id}
                            className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-2 py-1 text-xs text-muted-foreground"
                          >
                            <TechIcon tool={t} size={14} />
                            {t.name}
                            {t.isNew && (
                              <span className="rounded-sm bg-primary px-1 text-[0.55rem] font-bold uppercase text-primary-foreground">new</span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}

                    {d.proof && d.proof.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-border pt-3">
                        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Seen in</span>
                        {d.proof.map((p) => (
                          <span key={p} className="rounded border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                            ↗ {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        );
      })}
    </motion.div>
  );
}
