import path from "path";
import childProcess from "child_process";

import dotenv from "dotenv";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { compression } from "vite-plugin-compression2";
import { defineConfig } from "vite";

import { getRuntimeConfig } from "./src/utils/runtime";

dotenv.config({ path: "./.env", quiet: true });

const getEnvVar = (
  key: string,
  fallback: string | undefined = undefined,
): string | undefined => {
  return process.env[key] ? JSON.stringify(process.env[key]) : fallback;
};

const runtimeConfig = getRuntimeConfig();

const gitCommand = (command: string) => {
  let result;

  try {
    result = childProcess.execSync(`git ${command}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  if (result) {
    result = result.toString().trim();
  }

  return result;
};

const gitVersionPlugin = () => {
  let version: string | undefined;
  let commitHash: string | undefined;
  if (gitCommand("--version")) {
    version = gitCommand("describe --abbrev=0");
    commitHash = gitCommand("rev-parse --short HEAD");
  }

  return {
    name: "git-version",
    config: () => ({
      define: {
        VERSION: version ? JSON.stringify(version) : undefined,
        COMMIT_HASH: commitHash ? JSON.stringify(commitHash) : undefined,
      },
    }),
  };
};

export default defineConfig(({ command }) => ({
  build: {
    cache: {
      enabled: true,
    },
    rollupOptions: {
      onLog(level, log, handler) {
        if (log.code === "SOURCEMAP_ERROR") return;
        handler(level, log);
      },
      output: {
        sourcemapExcludeSources: true,
        sourcemapIgnoreList: (relativeSourcePath) => {
          return relativeSourcePath.includes("node_modules");
        },
        advancedChunks: {
          groups: [
            {
              name: "graphql",
              test: /@gc-digital-talent\/graphql|packages\/graphql/,
              priority: 30,
              minSize: 0,
            },
            {
              name: "framework",
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|@react-router|urql|@urql|wonka)/,
              priority: 20,
              minSize: 10000,
            },
            {
              name: "vendor",
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              minSize: 50000, // Don't even bother splitting unless it's over 50kb
            },
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
    forwardConsole: true,
  },
  html: {
    cspNonce: "**CSP_NONCE**",
  },
  ssr: {
    noExternal: ["@dr.pogodin/react-helmet"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
    tsconfigPaths: true,
  },
  define: {
    IS_DEV_SERVER: command === "serve",
    API_HOST: getEnvVar("API_HOST"),
    API_URI: getEnvVar("VITE_API_URI"),
    API_PROTECTED_URI: getEnvVar("VITE_API_PROTECTED_URI"),
    BUILD_DATE: JSON.stringify(new Date()),
    APP_TITLE: getEnvVar("APP_TITLE"),
    APP_DESCRIPTION: getEnvVar("APP_DESCRIPTION"),
    __RUNTIME_VARS__: JSON.stringify(runtimeConfig),
  },
  plugins: [reactRouter(), tailwindcss(), compression(), gitVersionPlugin()],
}));
