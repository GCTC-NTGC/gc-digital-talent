import type { Page } from "@playwright/test";

type CspReport = string | Report;

declare global {
  interface Window {
    cspViolations?: CspReport[];
    cspTeardown?: () => void;
  }
}

class CspReporter {
  constructor(public readonly page: Page) {}

  async setup() {
    await this.page.addInitScript(() => {
      window.cspViolations = [];

      const cspObserver = new ReportingObserver(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (reports, _) => {
          window.cspViolations = [...(window?.cspViolations ?? []), ...reports];
        },
        { types: ["csp-violation"], buffered: true },
      );

      cspObserver.observe();

      window.cspTeardown = () => {
        cspObserver.disconnect();
        delete window.cspTeardown;
      };
    });
  }

  async teardown() {
    await this.page.evaluate(() => {
      if (typeof window.cspTeardown === "function") {
        window.cspTeardown();
      }
    });
  }

  async getReports() {
    return (await this.page.evaluate(() => window.cspViolations)) ?? [];
  }
}

export default CspReporter;
