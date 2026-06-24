import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TechStackList } from '@/components/techstack/TechStackList';
import { TECHSTACK_DOMAINS, TECHSTACK_TOOLS } from '@/content/techstack';

describe('TechStackList', () => {
  it('renders every domain title', () => {
    render(<TechStackList />);
    for (const d of TECHSTACK_DOMAINS) {
      expect(screen.getByText(d.name)).toBeInTheDocument();
    }
  });

  it('renders every tool name at least once', () => {
    render(<TechStackList />);
    for (const t of TECHSTACK_TOOLS) {
      expect(screen.getAllByText(t.name).length).toBeGreaterThan(0);
    }
  });

  it('renders proof tags for domains that have them', () => {
    render(<TechStackList />);
    expect(screen.getAllByText(/Seen in/i).length).toBeGreaterThan(0);
  });

  it('shows a multi-domain tool under each of its domains', () => {
    render(<TechStackList />);
    const py = TECHSTACK_TOOLS.find((t) => t.id === 'python')!;
    // python is primary in d1 and `also` in d2, d4 → appears more than once
    expect(screen.getAllByText(py.name).length).toBeGreaterThanOrEqual(2);
  });
});
