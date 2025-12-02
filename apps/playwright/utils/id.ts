import { randomBytes, randomInt } from "node:crypto";

// Keep CodeQL happy and sanitize our env vars
function sanitize(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* eslint-disable turbo/no-undeclared-env-vars */
export function generateUniqueTestId(prefix = "pw") {
  // Use some playwright vars to add to the uniqueness for each run (shard, project, retry, etc.)
  const workerIndex = sanitize(process.env.TEST_WORKER_INDEX ?? "0");
  const projectName = sanitize(
    process.env.PLAYWRIGHT_TEST_PROJECT_NAME ?? "unknown",
  );
  const repeatEach = sanitize(process.env.TEST_REPEAT_EACH_INDEX ?? "0");
  const random = randomBytes(4).toString("hex");
  // Use ISO string for increased uniqueness across time
  const now = new Date().toISOString().replace(/[-:.TZ]/g, "");
  return `${prefix}-${projectName}-${workerIndex}-${repeatEach}-${now}-${random}`;
}

export function generateUniqueNumber() {
  // Use some playwright vars to add to the uniqueness for each run (shard, project, retry, etc.)
  const workerIndex = sanitize(process.env.TEST_WORKER_INDEX ?? "1");
  const repeatEach = sanitize(process.env.TEST_REPEAT_EACH_INDEX ?? "1");
  const random = randomInt(1, 9999);
  return `${workerIndex}${repeatEach}${random}`;
}

export function fetchIdentificationNumber(url: string, entity: string): string {
  //  This function is primarily used to fetch the ID (UUID) from recently entity such as users, departments, etc.
  const currentURLParts = new URL(url).pathname.split("/");
  const fetchID = currentURLParts[currentURLParts.indexOf(entity) + 1];
  return fetchID;
}

// copied from apps/web/src/hooks/useRequiredParams.ts
export const uuidRegEx =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/;
