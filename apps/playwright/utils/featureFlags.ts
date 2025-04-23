import path from "path";

import dotenv from "dotenv";

export type FeatureFlags = Record<`FEATURE_${string}`, boolean | null>;

export function getFeatureFlagConfig(flags: Partial<FeatureFlags>) {
  const { parsed } = dotenv.config({
    path: path.resolve(__dirname, "..", "..", "web", ".env"),
  });
  const env = { ...parsed, ...flags };

  let body = `let data = new Map();`;
  Object.keys(env).forEach((key) => {
    const value = env[key] ? String(env[key]) : undefined;
    if (typeof value !== "undefined") {
      body = `${body} data.set("${key}", "${value}");`;
    }
  });

  return `${body} window.__SERVER_CONFIG__ = data;`;
}
