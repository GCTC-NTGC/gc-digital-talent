import "@testing-library/jest-dom";
import "vitest-axe/extend-expect";
import { vi } from "vitest";
import failOnConsole from "vitest-fail-on-console";

failOnConsole({
  silenceMessage: (errorMessage) =>
    errorMessage.includes("Missing mandatory runtime variable"),
});

// ClipboardEvent
const ClipboardEventMock = vi.fn(() => ({
  getData: vi.fn(),
  setData: vi.fn(),
}));
vi.stubGlobal("ClipboardEvent", ClipboardEventMock);

// DragEvent
const DragEventMock = vi.fn(() => ({
  getData: vi.fn(),
  setData: vi.fn(),
}));
vi.stubGlobal("DragEvent", DragEventMock);

// matchMedia
const matchMediaMock = vi.fn((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Attach to window
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: matchMediaMock,
});

// ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: vi.fn(),
});
