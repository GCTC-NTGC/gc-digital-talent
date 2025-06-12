/* eslint-disable turbo/no-undeclared-env-vars */
export function generateUniqueTestId(prefix = "pw") {
  // Use some playwright vars to add to the uniqueness for each run (shard, project, retry, etc.
  const workerIndex = process.env.TEST_WORKER_INDEX ?? "0";
  const projectName = process.env.PLAYWRIGHT_TEST_PROJECT_NAME ?? "unknown";
  const repeatEach = process.env.TEST_REPEAT_EACH_INDEX ?? "0";
  const random = Math.floor(Math.random() * 100000);
  // Use ISO string for increased uniqueness across time
  const now = new Date().toISOString().replace(/[-:.TZ]/g, "");
  return `${prefix}-${projectName}-${workerIndex}-${repeatEach}-${now}-${random}`;
}
