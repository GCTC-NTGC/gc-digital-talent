import * as dotenv from "dotenv";
import * as path from "path";

export type FeatureFlags = Record<string, boolean | null>;

export function getFeatureFlagConfig(flags: Partial<FeatureFlags>) {
  const { parsed } = dotenv.config({
    path: path.resolve(__dirname, "..", "..", "web", ".env"),
  });
  const env = { ...parsed, ...flags };

  let body = `const data = new Map();`;
  Object.keys(env).forEach((key) => {
    const value = env[key];
    if (value) {
      body = `${body} data.set("${key}", "${value}");`;
    }
  });

  return `${body} window.__SERVER_CONFIG__ = data`;
}
