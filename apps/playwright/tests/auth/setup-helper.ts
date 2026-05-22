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
  const baseUrl = process.env.BASE_URL ?? "http://localhost:8000";
  const url = `/testing/token?sub=${sub}&secret=${secret ? "[SET]" : "[MISSING]"}`;

  console.log(`[auth] BASE_URL: ${baseUrl}`);
  console.log(`[auth] sub: ${sub ? "[SET]" : "[MISSING]"}`);
  console.log(`[auth] TESTING_ENDPOINT_SECRET: ${secret ? "[SET]" : "[MISSING]"}`);
  console.log(`[auth] Requesting: ${baseUrl}${url}`);

  const response = await request.get(
    `/testing/token?sub=${sub}&secret=${secret}`,
  );

  const body = await response.text();

  console.log(`[auth] Response status: ${response.status()}`);
  console.log(`[auth] Response headers: ${JSON.stringify(response.headers())}`);
  console.log(`[auth] Response body (first 500): ${body.slice(0, 500)}`);

  if (!response.ok() || body.trimStart().startsWith("<")) {
    throw new Error(
      `Test token endpoint failed (${response.status()}). Is TESTING_TOKEN_ENABLED=true on the App Service?\n${body.slice(0, 300)}`,
    );
  }

  const { access_token, refresh_token, id_token } = JSON.parse(body);

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
