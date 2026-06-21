import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TechIcon } from '@/components/techstack/icon';
import { TECHSTACK_TOOLS } from '@/content/techstack';

describe('TechIcon', () => {
  it('renders an <img> for a local/cdn tool', () => {
    const py = TECHSTACK_TOOLS.find(t => t.id === 'python')!;
    const { container } = render(<TechIcon tool={py} size={20} />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe('/icons/python.svg');
    expect(img!.style.width).toBe('20px');
  });

  it('renders a monogram span for a mono tool (no img)', () => {
    const sp = TECHSTACK_TOOLS.find(t => t.id === 'scipy')!;
    const { container } = render(<TechIcon tool={sp} size={20} />);
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('Sp');
  });
});
