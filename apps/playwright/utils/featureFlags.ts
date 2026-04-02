import path from "path";

import dotenv from "dotenv";

export type FeatureFlags = Record<`FEATURE_${string}`, boolean | null>;

export function getFeatureFlagConfig(flags: Partial<FeatureFlags>) {
  const { parsed } = dotenv.config({
    path: path.resolve(__dirname, "..", "..", "web", ".env"),
    quiet: true,
  });
  const env: Record<string, unknown> = { ...parsed, ...flags };

  let body = `let data = new Map();`;
  Object.keys(env).forEach((key) => {
    const raw = env[key];
    let value: string | undefined;

    if (
      typeof raw === "string" ||
      typeof raw === "number" ||
      typeof raw === "boolean"
    ) {
      value = String(raw);
    } else if (typeof raw === "object" && raw !== null) {
      value = JSON.stringify(raw);
    } else {
      value = undefined;
    }
    if (typeof value !== "undefined") {
      body = `${body} data.set("${key}", "${value}");`;
    }
  });

  return `${body} window.__SERVER_CONFIG__ = data;`;
}
