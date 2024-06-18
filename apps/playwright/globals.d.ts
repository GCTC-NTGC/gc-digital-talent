import * as sinon from "sinon";

export {};

// We need to add a global declaration for the custom matchers we created in custom-playwright.ts.
// This prevents TS compile errors when using the custom matchers in the test files.
declare global {
  interface Window {
    __clock: sinon.SinonFakeTimers;
  }

  namespace PlaywrightTest {
    interface Matchers<R> {
      toHavePercentageInRange(min: number, max: number): R;
      toBeInRange(min: number, max: number): R;
    }
  }
}
