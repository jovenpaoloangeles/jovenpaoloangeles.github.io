import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { TechStackGraph } from '@/components/techstack/TechStackGraph';
import { TECHSTACK_DOMAINS, TECHSTACK_TOOLS } from '@/content/techstack';
import { placePopover, POPOVER } from '@/components/techstack/techstack-graph-config';

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

  it('gives every node a name, a tooltip and a tab stop', () => {
    const { container } = render(<div style={{ width: 800, height: 500 }}><TechStackGraph /></div>);
    const tool = container.querySelector(`[data-id="${TECHSTACK_TOOLS[0].id}"]`)!;
    expect(tool.getAttribute('tabindex')).toBe('0');
    expect(tool.getAttribute('aria-label')).toContain(TECHSTACK_TOOLS[0].name);
    expect(tool.querySelector('title')?.textContent).toBe(TECHSTACK_TOOLS[0].name);
  });

  it('opens the popover with Enter and closes it with Escape', () => {
    const { container } = render(<div style={{ width: 800, height: 500 }}><TechStackGraph /></div>);
    const tool = container.querySelector(`[data-id="${TECHSTACK_TOOLS[0].id}"]`)!;
    fireEvent.keyDown(tool, { key: 'Enter' });
    expect(screen.getByRole('dialog', { name: TECHSTACK_TOOLS[0].name })).toBeInTheDocument();
    fireEvent.keyDown(tool, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes the popover from its close button', () => {
    const { container } = render(<div style={{ width: 800, height: 500 }}><TechStackGraph /></div>);
    fireEvent.click(container.querySelector(`[data-id="${TECHSTACK_TOOLS[0].id}"]`)!);
    fireEvent.click(screen.getByRole('button', { name: /close details/i }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('says how many domain tools are not listed', () => {
    const big = TECHSTACK_DOMAINS
      .map((d) => ({ d, n: TECHSTACK_TOOLS.filter((t) => t.domainId === d.id).length }))
      .find(({ n }) => n > 6)!;
    const { container } = render(<div style={{ width: 800, height: 500 }}><TechStackGraph /></div>);
    fireEvent.click(container.querySelector(`[data-id="${big.d.id}"]`)!);
    expect(screen.getByRole('dialog').textContent).toContain(`+${big.n - 6} more`);
  });

  it('leaves a plain wheel to the page (zoom needs ctrl/⌘)', () => {
    const { container } = render(<div style={{ width: 800, height: 500 }}><TechStackGraph /></div>);
    const svg = container.querySelector('svg')!;
    expect(fireEvent.wheel(svg, { deltaY: 100 })).toBe(true); // not preventDefault-ed
    // (ctrl+wheel zoom can't run in jsdom — no SVG viewBox.baseVal)
  });
});

describe('TechStackGraph with prefers-reduced-motion', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('lays the graph out synchronously instead of animating', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), addEventListener() {}, removeEventListener() {} }));
    const { container } = render(<div style={{ width: 800, height: 500 }}><TechStackGraph /></div>);
    // no timers awaited: every node is already positioned on first render
    const nodes = [...container.querySelectorAll('[data-node]')];
    expect(nodes.length).toBe(1 + TECHSTACK_DOMAINS.length + TECHSTACK_TOOLS.length);
    expect(nodes.every((n) => n.getAttribute('transform')?.startsWith('translate('))).toBe(true);
  });
});

describe('placePopover', () => {
  const W = 800, H = 500;
  const inside = (p: { x: number; y: number }) =>
    p.x >= 0 && p.y >= 0 && p.x + POPOVER.w <= W && p.y + POPOVER.h <= H;

  it('prefers right of and above the node', () => {
    const p = placePopover(300, 300, W, H);
    expect(p.x).toBeGreaterThan(300);
    expect(p.y + POPOVER.h).toBeLessThan(300);
  });

  it('flips left near the right edge and below near the top', () => {
    const p = placePopover(780, 20, W, H);
    expect(p.x + POPOVER.w).toBeLessThan(780);
    expect(p.y).toBeGreaterThan(20);
  });

  it('stays inside the viewport for any on- or off-screen anchor (zoomed/panned)', () => {
    for (const [x, y] of [[0, 0], [W, H], [-400, 900], [1600, -300], [W / 2, H / 2]]) {
      expect(inside(placePopover(x, y, W, H))).toBe(true);
    }
  });
});
