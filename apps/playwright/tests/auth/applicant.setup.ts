import { test as setup, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

export const applicantAuthFile = path.join(
  __dirname,
  "../../.auth/applicant.json",
);

setup("authenticate as applicant via test token", async ({ page, request }) => {
  const secret = process.env.TESTING_ENDPOINT_SECRET;
  const response = await request.get(`/testing/token?role=applicant&secret=${secret}`);

  expect(
    response.ok(),
    `Test token endpoint failed (${response.status()}): ${await response.text()}`,
  ).toBeTruthy();

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

  fs.mkdirSync(path.dirname(applicantAuthFile), { recursive: true });
  await page.context().storageState({ path: applicantAuthFile });
});
