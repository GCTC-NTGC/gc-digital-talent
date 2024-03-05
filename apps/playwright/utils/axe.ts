import { TestInfo } from "@playwright/test";
import { AxeResults } from "axe-core";

/**
 * Attach all results to a test
 *
 * Primarily used to debug or see inconclusive items.
 *
 * @param results
 * @param testInfo
 */
export const attachResults = async (
  results: AxeResults,
  testInfo: TestInfo,
) => {
  await testInfo.attach("accessibility-scan-results", {
    body: JSON.stringify(results, null, 2),
    contentType: "application/json",
  });
};
