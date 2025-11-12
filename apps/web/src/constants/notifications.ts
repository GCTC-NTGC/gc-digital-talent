import { getRuntimeVariable } from "@gc-digital-talent/env";

// NOTE: Value is in mins so multiply by 60 here
const envPollingInterval = getRuntimeVariable("NOTIFICATION_POLLING_INTERVAL");
const NOTIFICATION_POLLING_INTERVAL =
  (envPollingInterval ? parseInt(envPollingInterval) : 1) * 5;

export { NOTIFICATION_POLLING_INTERVAL };
