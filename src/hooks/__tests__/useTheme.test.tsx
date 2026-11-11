import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@/hooks/useTheme';

function stubMatchMedia(dark: boolean) {
  (window as any).matchMedia = vi.fn().mockReturnValue({ matches: dark });
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it('follows prefers-color-scheme when nothing is stored', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    // following the system must NOT persist a choice
    expect(localStorage.getItem('theme')).toBeNull();
  });

  it('a toggle persists the explicit choice', () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('stored choice wins over system preference', () => {
    localStorage.setItem('theme', 'light');
    stubMatchMedia(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
