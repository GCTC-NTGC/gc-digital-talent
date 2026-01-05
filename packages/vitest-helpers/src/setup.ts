import "@testing-library/jest-dom";
import "vitest-axe/extend-expect";
import { vi } from "vitest";
import failOnConsole from "vitest-fail-on-console";

failOnConsole({
  silenceMessage: (errorMessage: string) =>
    errorMessage.includes("Missing mandatory runtime variable"),
});

class ClipboardEventMock {
  getData = vi.fn();
  setData = vi.fn();
}
vi.stubGlobal("ClipboardEvent", ClipboardEventMock);

class DragEventMock {
  getData = vi.fn();
  setData = vi.fn();
}
vi.stubGlobal("DragEvent", DragEventMock);

// matchMedia
const matchMediaMock = vi.fn().mockImplementation(
  (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
);

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: matchMediaMock,
});

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: vi.fn(),
});
