import path from "path";
import { defineConfig } from "vite";
import dotenv from "dotenv";

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { compression } from "vite-plugin-compression2";

import { gitVersionPlugin } from "./src/utils/gitVersionPlugin";
import { getRuntimeConfig } from "./src/utils/runtime";

dotenv.config({ path: "./.env", quiet: true });

const getEnvVar = (
  key: string,
  fallback: string | undefined = undefined,
): string | undefined => {
  return process.env[key] ? JSON.stringify(process.env[key]) : fallback;
};

const runtimeConfig = getRuntimeConfig();

export default defineConfig(({ command }) => {
  return {
    resolve: {
      alias: { "~": path.resolve(__dirname, "src") },
      tsconfigPaths: true,
    },

    // Development Server
    server: {
      port: 3000,
      forwardConsole: true,
      // Allow connections from Docker container network
      host: true,
      // Allow requests from nginx proxy in Docker dev environment
      allowedHosts: ["web", "localhost"],
      // Watch files for changes in Docker environment
      watch: {
        usePolling: process.env.NODE_ENV === "development",
      },
      // Increase HMR timeout to batch multiple file changes together
      // This prevents multiple refreshes when GraphQL codegen writes several files
      hmr: {
        timeout: 500,
      },
    },

    build: {
      outDir: "dist",
      sourcemap: true,
      rolldownOptions: {
        onLog(level, log, handler) {
          if (log.code === "SOURCEMAP_ERROR") return;
          handler(level, log);
        },
        output: {
          codeSplitting: {
            groups: [
              {
                name: "telemetry",
                test: /[\\/]node_modules[\\/](@microsoft|applicationinsights)/,
                priority: 100,
              },
              {
                name: "graphql",
                test: /packages\/graphql\/src\/gql\/graphql\.ts/,
                priority: 90,
              },
            ],
          },
        },
      },
    },

    define: {
      // IS_DEV_SERVER is true when running Vite dev server directly (without nginx proxy)
      // In Docker dev environment with nginx, we set DOCKER_DEV=true to disable this
      IS_DEV_SERVER: command === "serve" && process.env.DOCKER_DEV !== "true",
      API_HOST: getEnvVar("API_HOST"),

      // Vite requires build-time env variables to have the VITE_ prefix
      API_URI: getEnvVar("VITE_API_URI"),
      API_PROTECTED_URI: getEnvVar("VITE_API_PROTECTED_URI"),
      BUILD_DATE: JSON.stringify(new Date()),
      APP_TITLE: getEnvVar("APP_TITLE"),
      APP_DESCRIPTION: getEnvVar("APP_DESCRIPTION"),
      REVERB_APP_KEY: getEnvVar("VITE_REVERB_APP_KEY"),

      // run-time variables
      __RUNTIME_VARS__: JSON.stringify(runtimeConfig),
    },

    plugins: [
      reactRouter(),
      gitVersionPlugin(),
      tailwindcss(),
      compression({ exclude: [/\.(html)$/] }),
    ],

    ssr: {
      noExternal: ["@dr.pogodin/react-helmet"],
    },
    ...(command === "build" && {
      html: {
        cspNonce: "**CSP_NONCE**",
      },
    }),
  };
});
