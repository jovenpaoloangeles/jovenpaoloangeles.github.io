import '@testing-library/jest-dom';

// ── localStorage mock ─────────────────────────────────────────────────────────
// jsdom's storage shim is inconsistent across vitest versions; replace it with
// a full in-memory implementation so tests can rely on .clear().
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

// ── ResizeObserver stub ─────────────────────────────────────────────────────
// jsdom does not implement ResizeObserver; provide a stub so components that
// use it (e.g. TechStackGraph) mount without throwing in tests.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as unknown as { ResizeObserver: typeof ResizeObserverStub }).ResizeObserver = ResizeObserverStub;
