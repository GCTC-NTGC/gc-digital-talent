import { test as setup } from "@playwright/test";
import { authenticateAs } from "./setup-helper";

setup("authenticate as admin", async ({ page, request }) => {
  const sub = process.env.PLAYWRIGHT_ADMIN_SUB ?? (() => { throw new Error("PLAYWRIGHT_ADMIN_SUB env var is not set"); })();
  await authenticateAs("admin", sub, page, request);
});
