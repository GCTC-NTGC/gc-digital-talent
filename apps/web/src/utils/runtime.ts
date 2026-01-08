// eslint-disable-next-line no-underscore-dangle
declare const __RUNTIME_VARS__: Record<string, string>;

const RUNTIME_VARS = [
  "OAUTH_POST_LOGOUT_REDIRECT_EN",
  "OAUTH_POST_LOGOUT_REDIRECT_FR",
  "OAUTH_LOGOUT_URI",
  "FEATURE_WFA",
  "FEATURE_APPLICATION_EMAIL_VERIFICATION",
  "FEATURE_HOLIDAY_MESSAGE",
  "APPLICATIONINSIGHTS_CONNECTION_STRING",
  "LOG_CONSOLE_LEVEL",
  "LOG_APPLICATIONINSIGHTS_LEVEL",
  "NOTIFICATION_POLLING_INTERVAL",
] as const;

export type RuntimeVarKey = (typeof RUNTIME_VARS)[number];

export const getRuntimeConfig = () => {
  const runtimeConfig: Record<string, string | undefined> = {};
  for (const key of RUNTIME_VARS) {
    runtimeConfig[key] = process.env[key];
  }
  return runtimeConfig;
};

export const makeServerConfigJS = () => {
  return `[
    ${RUNTIME_VARS.map((key) => {
      const rawValue =
        typeof __RUNTIME_VARS__ !== "undefined" ? __RUNTIME_VARS__[key] : "";
      const safeValue = typeof rawValue === "string" ? rawValue : "";

      return `["${key}", filterUnusable("$${key}") ?? "${safeValue}"]`;
    }).join(",\n    ")}
  ]`;
};
