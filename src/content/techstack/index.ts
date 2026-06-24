import { TECHSTACK_DOMAINS, TECHSTACK_TOOLS } from './data';
import type { Domain, Tool } from './data';
import { TECHSTACK_TECH_LINKS } from './links';

export * from './icons';
export * from './data';
export * from './links';

export function domainById(id: string): Domain {
  const d = TECHSTACK_DOMAINS.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown domain id: ${id}`);
  return d;
}

export function toolsByDomain(): Record<string, Tool[]> {
  const groups: Record<string, Tool[]> = {};
  for (const d of TECHSTACK_DOMAINS) groups[d.id] = [];
  for (const t of TECHSTACK_TOOLS) groups[t.domainId].push(t);
  return groups;
}

export function neighborsOf(toolId: string): Set<string> {
  const s = new Set<string>([toolId]);
  for (const [a, b] of TECHSTACK_TECH_LINKS) {
    if (a === toolId) s.add(b);
    if (b === toolId) s.add(a);
  }
  return s;
}
