/* eslint-disable no-underscore-dangle */
// Playwright as of now has no built in functionality to be able to alter time, mock time etc
// Hence using Sinon JS
import { BrowserContext, Page } from "@playwright/test";

class ClockHelper {
  readonly page: Page;

  readonly context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  // Set up fake timers in the browser context (needs to be set up before trying to change the time)
  async setupFakeTimers(startDate: Date = new Date()) {
    // Add Sinon.js to the browser context by injecting the script file
    await this.context.addInitScript({
      path: require.resolve("sinon/pkg/sinon.js"),
    });

    // Inject script content into the browser context to set up fake timers
    await this.context.addInitScript({
      content: `
      window.__clock = sinon.useFakeTimers({
        now: ${startDate.getTime()}, // Start the fake clock at the specified start date
        shouldAdvanceTime: true, // Automatically advance time when setTimeout/setInterval is called
        shouldClearNativeTimers: true, // Clear native timers when fake timers are advanced
        toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'], // Fake these timer functions
      });`,
    });
  }

  // Simulate the passage of time
  async advanceTime(milliseconds: number): Promise<void> {
    await this.page.evaluate((ms) => {
      window.__clock.tick(ms);
    }, milliseconds);
  }

  async jumpTo(date: Date): Promise<void> {
    await this.page.evaluate((d) => {
      const diff = Math.abs(d.valueOf() - new Date().valueOf());
      window.__clock.tick(diff);
    }, date);
  }

  async restore(): Promise<void> {
    await this.page.evaluate(() => {
      window.__clock.restore();
    });
  }
}

export default ClockHelper;
