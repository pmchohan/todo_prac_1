import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";

if (!window.localStorage) {
  const memoryStorage = new Map();
  Object.defineProperty(window, "localStorage", {
    value: {
      clear: () => memoryStorage.clear(),
      getItem: (key) => memoryStorage.get(key) || null,
      removeItem: (key) => memoryStorage.delete(key),
      setItem: (key, value) => memoryStorage.set(key, String(value)),
    },
    configurable: true,
  });
}

beforeEach(() => {
  window.localStorage.clear();
  document.cookie = "";
});
