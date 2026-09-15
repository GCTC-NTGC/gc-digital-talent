import type { Page } from "@playwright/test";

type CspReport = (string | Report);

declare global {
  interface Window {
    cspViolations?: CspReport[];
    cspTeardown?: () => void;
  }
}


class CspReporter {
  public readonly page: Page;

  constructor(public readonly p: Page) {
    this.page = p;
  }

  async setup() {
    await this.page.addInitScript(() => {
      window.cspViolations = [];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cspObserver = new ReportingObserver((reports, _) => {
        window.cspViolations = [...(window?.cspViolations ?? []), ...reports];
      }, { types: ["csp-violation"], buffered: true });

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
    return await this.page.evaluate(() => window.cspViolations) ?? [];
  }
}

export default CspReporter;
