import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FullscreenViewer } from '../FullscreenViewer';

const images = ['/a.webp', '/b.webp', '/c.webp'];

describe('FullscreenViewer', () => {
  it('renders nothing when closed and ignores keys', () => {
    const onChange = vi.fn();
    render(<FullscreenViewer state={null} onChange={onChange} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('wraps navigation and closes on Escape', () => {
    const onChange = vi.fn();
    render(<FullscreenViewer state={{ images, index: 0 }} onChange={onChange} />);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith({ images, index: 2 });
    fireEvent.click(screen.getByRole('button', { name: /next image/i }));
    expect(onChange).toHaveBeenLastCalledWith({ images, index: 1 });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onChange).toHaveBeenLastCalledWith(null);
  });
});
