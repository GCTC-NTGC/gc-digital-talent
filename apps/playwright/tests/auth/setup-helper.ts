import { APIRequestContext, Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

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
    `/testing/token?sub=${sub}&secret=${secret}`,
  );

  if (!response.ok()) {
    throw new Error(
      `Test token endpoint failed (${response.status()}): ${await response.text()}`,
    );
  }

  const { access_token, refresh_token, id_token } = await response.json();

  await page.goto("/en");
  await page.evaluate(
    ({ at, rt, it }) => {
      localStorage.setItem("access_token", at);
      localStorage.setItem("refresh_token", rt);
      localStorage.setItem("id_token", it);
    },
    { at: access_token, rt: refresh_token, it: id_token },
  );

  const filePath = authFilePath(name);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  await page.context().storageState({ path: filePath });
}
