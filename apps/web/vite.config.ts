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
                name: "graphql",
                test: /@gc-digital-talent\/graphql|packages\/graphql/,
                priority: 30,
                minSize: 0,
              },
              {
                name: "framework",
                test: /[\\/]node_modules[\\/](react|react-dom|react-router|@react-router|urql|@urql|wonka)/,
                priority: 20,
              },
              {
                name: "vendor",
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                minSize: 50000,
              },
            ],
          },
        },
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
      compression({ exclude: [/\.(html)$/] }),
    ],

    ssr: {
      noExternal: ["@dr.pogodin/react-helmet"],
    },
    html: {
      cspNonce: "**CSP_NONCE**",
    },
  };
});
