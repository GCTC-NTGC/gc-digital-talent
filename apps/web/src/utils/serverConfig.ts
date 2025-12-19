/* eslint-disable no-underscore-dangle */
const CONFIG_KEYS = [
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

type ConfigKey = (typeof CONFIG_KEYS)[number];

type BuildVars = Record<ConfigKey, string | undefined>;
const __BUILD_VARS__: Partial<BuildVars> = {};

function filterUnusable(value: string | undefined): string | undefined {
  return value && !value.startsWith("$") && value.length > 0
    ? value
    : undefined;
}

export const serverConfig = new Map<ConfigKey, string>(
  CONFIG_KEYS.map((key) => {
    const runtimeValue = `$${key}`;
    const buildValue = __BUILD_VARS__[key];
    const value = filterUnusable(runtimeValue) ?? buildValue ?? "";
    return [key, value] as const;
  }),
);
