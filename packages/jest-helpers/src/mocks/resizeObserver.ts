/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
class ResizeObserverMock {
  observe() {
    // Pass
  }

  unobserve() {
    // Pass
  }

  disconnect() {
    // Pass
  }
}

(globalThis as any).ResizeObserver = ResizeObserverMock;
