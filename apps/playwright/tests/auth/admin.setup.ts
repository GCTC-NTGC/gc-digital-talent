import { test as setup } from "@playwright/test";

import { authenticateAs } from "./setup-helper";

setup("authenticate as admin", { tag: "@regression" }, async ({ page, request }) => {
  const sub = process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ?? (() => { throw new Error("PLAYWRIGHT_COMMUNITY_ADMIN_SUB env var is not set"); })();
  await authenticateAs("admin", sub, page, request);
});
