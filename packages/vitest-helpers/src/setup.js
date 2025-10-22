import "@testing-library/jest-dom";
import * as matchers from "vitest-axe/matchers";
import { expect, vi } from "vitest";

expect.extend(matchers);

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
const matchMediaMock = vi.fn((query) => ({
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
