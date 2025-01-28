import path from "path";
import childProcess from "child_process";

import dotenv from "dotenv";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";
import { compression } from "vite-plugin-compression2";
import { Plugin, defineConfig } from "vite";
import { hydrogen_watch } from "@hydrogen-css/hydrogen";

dotenv.config({ path: "./.env" });

const appUrl = "https://talent.canada.ca";

const meta = {
  type: "website",
  title:
    process.env.APP_TITLE ?? "GC Digital Talent | Talents numériques du GC",
  description:
    process.env.APP_DESCRIPTION ??
    "Recruitment platform for digital jobs in the Government of Canada. Plateforme de recrutement pour les emplois numériques au gouvernement du Canada.",
  url: appUrl,
  domain: process.env.APP_DOMAIN ?? "talent.canada.ca",
  image: `${appUrl}/images/digital-talent/banner.jpg`,
};

const getEnvVar = (key: string, fallback = `""`): string => {
  return process.env[key] ? JSON.stringify(process.env[key]) : fallback;
};

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

const hydrogenPlugin = (): Plugin => ({
  name: "hydrogen-vite-plugin:serve",
  apply: "serve",
  buildStart() {
    hydrogen_watch();
  },
});

export default defineConfig(({ command }) => ({
  publicDir: "./public",
  build: {
    outDir: "./dist",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          appInsights: [
            "@microsoft/applicationinsights-react-js",
            "@microsoft/applicationinsights-web",
          ],
          motion: ["motion"],
          graphql: ["@gc-digital-talent/graphql"],
          react: ["react", "react-dom"],
          router: ["react-router", "react-router"],
          tiptap: [
            "@tiptap/react",
            "@tiptap/starter-kit",
            "@tiptap/extension-link",
            "@tiptap/extension-character-count",
          ],
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
  resolve: {
    extensions: [".ts", ".tsx", ".json", ".js"],
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

    // run-time variables
    OAUTH_POST_LOGOUT_REDIRECT_EN: getEnvVar("OAUTH_POST_LOGOUT_REDIRECT_EN"),
    OAUTH_POST_LOGOUT_REDIRECT_FR: getEnvVar("OAUTH_POST_LOGOUT_REDIRECT_FR"),
    OAUTH_LOGOUT_URI: getEnvVar("OAUTH_LOGOUT_URI"),
    APPLICATIONINSIGHTS_CONNECTION_STRING: getEnvVar(
      "APPLICATIONINSIGHTS_CONNECTION_STRING",
    ),
    LOG_CONSOLE_LEVEL: getEnvVar("LOG_CONSOLE_LEVEL"),
    LOG_APPLICATIONINSIGHTS_LEVEL: getEnvVar("LOG_APPLICATIONINSIGHTS_LEVEL"),
  },
  plugins: [
    react({
      include: "**/*.{tsx}",
    }),
    gitVersionPlugin(),
    hydrogenPlugin(),
    createHtmlPlugin({
      entry: "src/main.tsx",
      inject: {
        data: {
          title: "GC Digital Talent",
          description: meta.description,
          noScript: `<noscript>
            It looks like JavaScript is disabled in your browser settings or unsupported by the browser itself. JavaScript is required to view this
            application.<br />Il semblerait que la fonction JavaScript soit désactivée
            ou non prise en charge dans votre navigateur comme tel. Il est nécessaire
            d’avoir JavaScript pour consulter cette application.</noscript>`,
        },
        tags: [
          {
            injectTo: "head",
            tag: "meta",
            attrs: {
              property: "og:url",
              content: meta.url,
              "data-rh": "true",
            },
          },
          {
            injectTo: "head",
            tag: "meta",
            attrs: {
              property: "og:type",
              content: meta.type,
              "data-rh": "true",
            },
          },
          {
            injectTo: "head",
            tag: "meta",
            attrs: {
              property: "og:title",
              content: meta.title,
              "data-rh": "true",
            },
          },
          {
            injectTo: "head",
            tag: "meta",
            attrs: {
              property: "og:description",
              content: meta.description,
              "data-rh": "true",
            },
          },
          {
            injectTo: "head",
            tag: "meta",
            attrs: {
              property: "og:image",
              content: meta.image,
              "data-rh": "true",
            },
          },
          {
            injectTo: "head",
            tag: "meta",
            attrs: {
              property: "twitter:url",
              content: meta.url,
              "data-rh": "true",
            },
          },
          {
            injectTo: "head",
            tag: "meta",
            attrs: {
              property: "twitter:title",
              content: meta.title,
              "data-rh": "true",
            },
          },
          {
            injectTo: "head",
            tag: "meta",
            attrs: {
              property: "twitter:image",
              content: meta.image,
              "data-rh": "true",
            },
          },
        ],
      },
    }),
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
