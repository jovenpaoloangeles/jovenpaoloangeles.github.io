import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecentActivities } from '@/components/RecentActivities';
import rawActivities from '@/content/activities.json';

// jsdom has no IntersectionObserver; framer-motion's whileInView needs it.
vi.stubGlobal('IntersectionObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
});

describe('RecentActivities', () => {
  it('renders a recent activity title from the JSON', async () => {
    render(<RecentActivities />);
    // component sorts newest-first; the newest entry lands on page 1
    const newest = [...rawActivities].sort(
      (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp),
    )[0];
    expect(await screen.findByText(newest.title)).toBeInTheDocument();
  });

  it('does not show the empty-state message when data loads', async () => {
    render(<RecentActivities />);
    await screen.findByText((_, el) => el?.textContent === 'Recent Activities' && el.tagName === 'H2');
    expect(screen.queryByText(/No activities found/)).toBeNull();
  });
});
