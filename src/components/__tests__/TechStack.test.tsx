import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TechStack } from '@/components/TechStack';

describe('TechStack orchestrator', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to the graph view', () => {
    render(<TechStack />);
    expect(screen.getByRole('img', { name: /tech stack knowledge graph/i })).toBeInTheDocument();
  });

  it('switches to the list view when the List toggle is clicked', () => {
    render(<TechStack />);
    const listButton = screen.getByRole('button', { name: /list view/i });
    fireEvent.click(listButton);
    expect(listButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /graph view/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('persists the chosen view to localStorage', () => {
    render(<TechStack />);
    fireEvent.click(screen.getByRole('button', { name: /list view/i }));
    expect(localStorage.getItem('techstack-view')).toBe('list');
  });

  it('honors a previously persisted list view', () => {
    localStorage.setItem('techstack-view', 'list');
    render(<TechStack />);
    expect(screen.getByRole('button', { name: /list view/i })).toHaveAttribute('aria-pressed', 'true');
  });
});
