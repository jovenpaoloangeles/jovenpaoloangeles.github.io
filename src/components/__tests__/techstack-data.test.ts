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
      expect(['local', 'cdn', 'mono']).toContain(t.icon[0]);
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

  it('toolsByDomain groups tools', () => {
    const groups = toolsByDomain();
    expect(Object.keys(groups)).toHaveLength(6);
    const all = Object.values(groups).flat();
    expect(all).toHaveLength(TECHSTACK_TOOLS.length);
  });

  it('neighborsOf returns self + linked tools', () => {
    const n = neighborsOf('python');
    expect(n.has('python')).toBe(true);
    expect(n.has('pytorch')).toBe(true); // python—pytorch is a tech link
  });

  it('iconSrc resolves local and cdn and mono', () => {
    const py = TECHSTACK_TOOLS.find(t => t.id === 'python')!;
    expect(iconSrc(py)).toBe('/icons/python.svg');
    const np = TECHSTACK_TOOLS.find(t => t.id === 'numpy')!;
    expect(iconSrc(np)).toContain('devicon');
    const sp = TECHSTACK_TOOLS.find(t => t.id === 'scipy')!;
    expect(iconSrc(sp)).toBe(''); // mono has no src
  });

  it('monogram returns 1-2 chars', () => {
    const py = TECHSTACK_TOOLS.find(t => t.id === 'python')!;
    expect(monogram(py).length).toBeLessThanOrEqual(2);
    const sp = TECHSTACK_TOOLS.find(t => t.id === 'scipy')!;
    expect(monogram(sp)).toBe('Sp');
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
});
