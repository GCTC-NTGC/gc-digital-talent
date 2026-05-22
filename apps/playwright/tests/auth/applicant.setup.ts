import { test as setup } from "@playwright/test";
import { loginViaGCKey } from "./setup-helper";

setup("authenticate as applicant via GCKey", async ({ page }) => {
  const username = process.env.GCKEY_APPLICANT_USERNAME;
  const password = process.env.GCKEY_APPLICANT_PASSWORD;
  if (!username || !password)
    throw new Error(
      "GCKEY_APPLICANT_USERNAME or GCKEY_APPLICANT_PASSWORD is not set",
    );
  await loginViaGCKey("applicant", username, password, page);
});
