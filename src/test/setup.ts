import '@testing-library/jest-dom';

// ── localStorage mock ─────────────────────────────────────────────────────────
// vitest 4.x + jsdom does not expose a .clear() method on its built-in storage;
// replace it with a full in-memory implementation.
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// ── scrollIntoView polyfill ───────────────────────────────────────────────────
// jsdom does not implement scrollIntoView; add a no-op so React refs that call
// it (e.g. auto-scroll to bottom of chat) don't throw.
window.HTMLElement.prototype.scrollIntoView = function () {};
