import fs from "node:fs";
import path from "node:path";

import type { APIRequestContext, Page } from "@playwright/test";

import type { AuthTokenResponse } from "~/utils/auth";

export function authFilePath(name: string) {
  return path.join(__dirname, `../../.auth/${name}.json`);
}

export async function authenticateAs(
  name: string,
  sub: string,
  page: Page,
  request: APIRequestContext,
) {
  const secret = process.env.TESTING_ENDPOINT_SECRET;
  const response = await request.get(
    `/refresh?sub=${encodeURIComponent(sub)}`,
    {
      headers: { "X-Testing-Secret": secret ?? "" },
    },
  );

  const body = await response.text();

  if (!response.ok() || body.trimStart().startsWith("<")) {
    throw new Error(
      `Test token endpoint failed (${response.status()}). Is TESTING_TOKEN_ENABLED=true on the App Service?\n${body.slice(0, 300)}`,
    );
  }

  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    id_token: idToken,
  } = JSON.parse(body) as AuthTokenResponse;

  await page.goto("/en");
  await page.evaluate(
    ({ at, rt, it }) => {
      localStorage.setItem("access_token", at ?? "");
      localStorage.setItem("refresh_token", rt ?? "");
      localStorage.setItem("id_token", it ?? "");
    },
    { at: accessToken, rt: refreshToken, it: idToken },
  );

  // Reload so the React app initialises with the tokens already in localStorage,
  // ensuring the saved storageState reflects a fully-authenticated session.
  await page.reload();
  await page.waitForLoadState("load");

  const filePath = authFilePath(name);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  await page.context().storageState({ path: filePath });
}
