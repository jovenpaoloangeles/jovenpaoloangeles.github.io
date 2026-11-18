import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Awards } from '@/components/Awards';

// jsdom has no IntersectionObserver; framer-motion's whileInView needs it.
vi.stubGlobal('IntersectionObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
});

describe('Awards', () => {
  it('renders both section triggers', () => {
    render(<Awards />);
    expect(screen.getByText('Academic Awards')).toBeInTheDocument();
    expect(screen.getByText('Photography Awards')).toBeInTheDocument();
  });

  it('shows academic award content when its section is opened', async () => {
    const user = userEvent.setup();
    render(<Awards />);
    await user.click(screen.getByText('Academic Awards'));
    expect(await screen.findByText('ASTHRDP-NSC PhD Scholar')).toBeInTheDocument();
  });

  it('shows photography award content when its section is opened', async () => {
    const user = userEvent.setup();
    render(<Awards />);
    await user.click(screen.getByText('Photography Awards'));
    expect(await screen.findByText('Siena International Photo Awards 2020')).toBeInTheDocument();
  });

  it('never renders an "undefined" text node', async () => {
    const user = userEvent.setup();
    render(<Awards />);
    await user.click(screen.getByText('Academic Awards'));
    await user.click(screen.getByText('Photography Awards'));
    expect(screen.queryByText(/undefined/i)).toBeNull();
  });
});
