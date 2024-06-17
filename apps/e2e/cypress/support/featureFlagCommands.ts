import * as dotenv from "dotenv";

dotenv.config({ path: "../web/.env" });

const overrideFeatureFlags = (flags: Record<string, boolean | null>) => {
  const env = {
    ...process.env,
    ...flags,
  };

  let map = `const data = new Map();`;
  Object.keys(env).forEach((key) => {
    map = `${map} data.set(${key}, ${env[key]});`;
  });

  return `${map} window.__SERVER_CONFIG__ = data`;
};
