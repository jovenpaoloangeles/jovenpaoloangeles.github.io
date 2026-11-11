import { describe, it, expect } from 'vitest';
import { formatUtcDate, cn } from '@/lib/utils';

describe('formatUtcDate', () => {
  it('renders a UTC-midnight timestamp as its UTC calendar date', () => {
    expect(formatUtcDate('2019-11-01T00:00:00.000Z')).toBe('November 1, 2019');
  });

  it('does not shift a day west of UTC', () => {
    expect(formatUtcDate('2024-03-01T00:00:00.000Z')).toBe('March 1, 2024');
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', { b: true })).toBe('a b');
  });
});
