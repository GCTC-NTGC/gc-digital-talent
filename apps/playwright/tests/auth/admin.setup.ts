import { test as setup } from "@playwright/test";
import { loginViaGCKey } from "./setup-helper";

setup("authenticate as admin via GCKey", async ({ page }) => {
  const username = process.env.GCKEY_ADMIN_USERNAME;
  const password = process.env.GCKEY_ADMIN_PASSWORD;
  if (!username || !password)
    throw new Error("GCKEY_ADMIN_USERNAME or GCKEY_ADMIN_PASSWORD is not set");
  await loginViaGCKey("admin", username, password, page);
});
