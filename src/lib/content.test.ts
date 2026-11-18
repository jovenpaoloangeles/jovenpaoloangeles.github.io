import { describe, it, expect } from 'vitest';
import { loadActivities, loadResearchContent } from '@/lib/content';

describe('content pipeline', () => {
  it('every activity parses into a valid Activity', async () => {
    const acts = await loadActivities();
    expect(acts.length).toBeGreaterThan(0);
    for (const a of acts) {
      expect(a.title.trim()).toBeTruthy();
      expect(a.content.trim()).toBeTruthy();
      expect(Number.isNaN(a.timestamp.getTime())).toBe(false);
      expect(a.type.length).toBeGreaterThan(0);
      expect(Array.isArray(a.tags)).toBe(true);
    }
  });

  it('activity timestamps are stored UTC (Z-suffixed source)', async () => {
    // reads raw JSON to check the source format, not the parsed Date
    const raw = (await import('@/content/activities.json')).default;
    for (const r of raw) {
      expect(r.timestamp).toMatch(/Z$/);
    }
  });

  it('research content has all sections populated', async () => {
    const rc = await loadResearchContent();
    expect(Array.isArray(rc.experiences)).toBe(true);
    expect(rc.experiences.length).toBeGreaterThan(0);
    expect(Array.isArray(rc.conferences)).toBe(true);
    expect(rc.conferences.length).toBeGreaterThan(0);
    expect(Array.isArray(rc.books)).toBe(true);
    expect(rc.books.length).toBeGreaterThan(0);
    expect(rc.publications).toBeDefined();
    if (rc.publications) {
      expect(Array.isArray(rc.publications.peerReviewed)).toBe(true);
      expect(rc.publications.peerReviewed.length).toBeGreaterThan(0);
      expect(Array.isArray(rc.publications.submitted)).toBe(true);
      expect(Array.isArray(rc.publications.inPreparation)).toBe(true);
    }
    expect(rc.certifications).toBeDefined();
    if (rc.certifications) {
      expect(rc.certifications.length).toBeGreaterThan(0);
    }
  });
});
