import { test as setup } from "@playwright/test";
import { authenticateAs } from "./setup-helper";

setup("authenticate as applicant", async ({ page, request }) => {
  const sub = process.env.PLAYWRIGHT_APPLICANT_SUB ?? (() => { throw new Error("PLAYWRIGHT_APPLICANT_SUB env var is not set"); })();
  await authenticateAs("applicant", sub, page, request);
});
