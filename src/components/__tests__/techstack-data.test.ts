import { describe, it, expect } from 'vitest';
import {
  TECHSTACK_DOMAINS, TECHSTACK_TOOLS, TECHSTACK_TECH_LINKS, TECHSTACK_CENTER,
  domainById, toolsByDomain, neighborsOf, iconSrc, monogram,
} from '@/content/techstack';

describe('techstack data', () => {
  it('has 6 domains with unique ids and nums', () => {
    expect(TECHSTACK_DOMAINS).toHaveLength(6);
    const ids = new Set(TECHSTACK_DOMAINS.map(d => d.id));
    expect(ids.size).toBe(6);
  });

  it('every tool references an existing domain', () => {
    const ids = new Set(TECHSTACK_DOMAINS.map(d => d.id));
    for (const t of TECHSTACK_TOOLS) {
      expect(ids.has(t.domainId)).toBe(true);
    }
  });

  it('every tool has a valid level and well-formed icon spec', () => {
    for (const t of TECHSTACK_TOOLS) {
      expect(['sig', 'sup', 'chip']).toContain(t.level);
      expect(Array.isArray(t.icon)).toBe(true);
      expect(['local', 'cdn', 'lobe', 'mono']).toContain(t.icon[0]);
    }
  });

  it('every tech link references two existing tool ids', () => {
    const ids = new Set(TECHSTACK_TOOLS.map(t => t.id));
    for (const [a, b] of TECHSTACK_TECH_LINKS) {
      expect(ids.has(a)).toBe(true);
      expect(ids.has(b)).toBe(true);
      expect(a).not.toBe(b);
    }
  });

  it('domainById returns the domain', () => {
    expect(domainById('d1').name).toBeTruthy();
  });

  it('toolsByDomain groups tools including secondary domains', () => {
    const groups = toolsByDomain();
    expect(Object.keys(groups)).toHaveLength(6);
    // every tool appears under at least its primary domain
    for (const t of TECHSTACK_TOOLS) {
      expect(groups[t.domainId].some((x) => x.id === t.id)).toBe(true);
    }
    // a multi-domain tool also appears under each secondary domain
    for (const d of ['d1', 'd2', 'd4']) {
      expect(groups[d].some((x) => x.id === 'python')).toBe(true);
    }
  });

  it('neighborsOf returns self + linked tools', () => {
    const n = neighborsOf('python');
    expect(n.has('python')).toBe(true);
    expect(n.has('pytorch')).toBe(true); // python—pytorch is a tech link
  });

  it('iconSrc resolves local, cdn, lobe, and mono', () => {
    const py = TECHSTACK_TOOLS.find(t => t.id === 'python')!;
    expect(iconSrc(py)).toBe('/icons/python.svg');
    const np = TECHSTACK_TOOLS.find(t => t.id === 'numpy')!;
    expect(iconSrc(np)).toContain('devicon');
    const cl = TECHSTACK_TOOLS.find(t => t.id === 'claude')!;
    expect(iconSrc(cl)).toContain('lobehub');
    expect(iconSrc(cl)).toContain('claude-color.svg');
    const gp = TECHSTACK_TOOLS.find(t => t.id === 'gpytorch')!;
    expect(iconSrc(gp)).toBe(''); // mono has no src
  });

  it('monogram returns 1-2 chars', () => {
    const py = TECHSTACK_TOOLS.find(t => t.id === 'python')!;
    expect(monogram(py).length).toBeLessThanOrEqual(2);
    const gp = TECHSTACK_TOOLS.find(t => t.id === 'gpytorch')!;
    expect(monogram(gp)).toBe('GP');
  });

  it('exposes the center identity', () => {
    expect(TECHSTACK_CENTER.name).toBeTruthy();
    expect(TECHSTACK_CENTER.photo).toContain('profile-photo');
  });

  it('every tool `also` entry is a known domain and not its own primary domain', () => {
    const ids = new Set(TECHSTACK_DOMAINS.map((d) => d.id));
    for (const t of TECHSTACK_TOOLS) {
      for (const a of t.also ?? []) {
        expect(ids.has(a)).toBe(true);
        expect(a).not.toBe(t.domainId);
      }
    }
  });

  it('exposes starter multi-domain memberships', () => {
    const py = TECHSTACK_TOOLS.find((t) => t.id === 'python')!;
    expect(py.also).toEqual(['d2', 'd4']);
  });

  it('every tool `parent` is a real tool in the same domain, not a child, not self', () => {
    const byId = new Map(TECHSTACK_TOOLS.map((t) => [t.id, t]));
    for (const t of TECHSTACK_TOOLS) {
      if (!t.parent) continue;
      const p = byId.get(t.parent);
      expect(p).toBeDefined();
      expect(p!.domainId).toBe(t.domainId);
      expect(p!.parent).toBeUndefined();
      expect(t.parent).not.toBe(t.id);
    }
  });

  it('exposes starter parent-child memberships', () => {
    const pgvector = TECHSTACK_TOOLS.find((t) => t.id === 'pgvector')!;
    expect(pgvector.parent).toBe('postgresql');
    const openlit = TECHSTACK_TOOLS.find((t) => t.id === 'openlit')!;
    expect(openlit.parent).toBe('opentelemetry');
  });
});
