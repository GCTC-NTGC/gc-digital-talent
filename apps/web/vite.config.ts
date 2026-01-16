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
  publicDir: "./public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
    rollupOptions: {
      // NOTE: We don't want node_module source maps so ignore warnings about them
      onLog(level, log, handler) {
        if (log.code === "SOURCEMAP_ERROR") return;
        handler(level, log);
      },
      output: {
        sourcemapExcludeSources: true,
        sourcemapIgnoreList: (relativeSourcePath) => {
          return relativeSourcePath.includes("node_modules");
        },
        manualChunks: {
          graphql: ["@gc-digital-talent/graphql"],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  html: {
    cspNonce: "**CSP_NONCE**",
  },
  ssr: {
    noExternal: ["react-helmet-async"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  define: {
    IS_DEV_SERVER: command === "serve",
    API_HOST: getEnvVar("API_HOST"),

    // Vite requires build-time env variables to have the VITE_ prefix
    API_URI: getEnvVar("VITE_API_URI"),
    API_PROTECTED_URI: getEnvVar("VITE_API_PROTECTED_URI"),
    BUILD_DATE: JSON.stringify(new Date()),
    APP_TITLE: getEnvVar("APP_TITLE"),
    APP_DESCRIPTION: getEnvVar("APP_DESCRIPTION"),

    // run-time variables
    __RUNTIME_VARS__: JSON.stringify(runtimeConfig),
  },
  plugins: [
    reactRouter(),
    gitVersionPlugin(),
    tailwindcss(),
    /**
     * NOTE: We are not compressing the index.html
     * so we can use the ngx_http_sub_module to
     * replace values at runtime
     *
     * REF: https://nginx.org/en/docs/http/ngx_http_sub_module.html
     */
    compression({ exclude: /index\.html/i }),
  ],
}));
