import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a UTC timestamp for display, pinned to UTC. Activity data is
 * month-precision stored as UTC midnight; local-timezone rendering shifts
 * the calendar day for viewers west of UTC.
 */
export function formatUtcDate(timestamp: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(timestamp));
}