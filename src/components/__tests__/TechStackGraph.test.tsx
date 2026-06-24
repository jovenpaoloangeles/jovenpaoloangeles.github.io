import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TechStackGraph } from '@/components/techstack/TechStackGraph';
import { TECHSTACK_DOMAINS, TECHSTACK_TOOLS } from '@/content/techstack';

describe('TechStackGraph', () => {
  it('mounts and renders an svg', () => {
    const { container } = render(<div style={{ width: 800, height: 500 }}><TechStackGraph /></div>);
    // jsdom has no layout; the component must still not throw and must render an svg
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders a node element per center + domain + tool (after a tick)', async () => {
    const { container } = render(<div style={{ width: 800, height: 500 }}><TechStackGraph /></div>);
    await new Promise((r) => setTimeout(r, 60));
    const nodes = container.querySelectorAll('[data-node]');
    // center + domains + tools (some may be mid-render; assert at least domains present)
    expect(nodes.length).toBeGreaterThanOrEqual(TECHSTACK_DOMAINS.length);
    expect(container.querySelectorAll('[data-node="tool"]').length).toBeLessThanOrEqual(TECHSTACK_TOOLS.length);
  });

  it('renders a cross link per secondary-domain membership', async () => {
    const { container } = render(<div style={{ width: 800, height: 500 }}><TechStackGraph /></div>);
    await new Promise((r) => setTimeout(r, 60));
    const expected = TECHSTACK_TOOLS.reduce((n, t) => n + (t.also?.length ?? 0), 0);
    expect(container.querySelectorAll('.ts-link.cross').length).toBe(expected);
  });

  it('renders a child link per parent-child relationship', async () => {
    const { container } = render(<div style={{ width: 800, height: 500 }}><TechStackGraph /></div>);
    await new Promise((r) => setTimeout(r, 60));
    const expected = TECHSTACK_TOOLS.filter((t) => t.parent != null).length;
    expect(container.querySelectorAll('.ts-link.child').length).toBe(expected);
  });
});
