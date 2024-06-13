import path from "path";
import childProcess from "child_process";

import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";
import { defineConfig, loadEnv } from "vite";

const appUrl = "https://talent.canada.ca";

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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const meta = {
    type: "website",
    title: env.APP_TITLE ?? "GC Digital Talent | Talents numériques du GC",
    description:
      env.APP_DESCRIPTION ??
      "Recruitment platform for digital jobs in the Government of Canada. Plateforme de recrutement pour les emplois numériques au gouvernement du Canada.",
    url: appUrl,
    domain: env.APP_DOMAIN ?? "talent.canada.ca",
    image: `${appUrl}/images/digital-talent/banner.jpg`,
  };

  return {
    publicDir: "./public",
    build: {
      outDir: "./dist",
      rollupOptions: {
        output: {
          manualChunks: {
            appInsights: [
              "@microsoft/applicationinsights-react-js",
              "@microsoft/applicationinsights-web",
            ],
            react: ["react", "react-dom"],
            router: ["react-router", "react-router-dom"],
          },
        },
      },
    },
    server: {
      port: 3000,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".json", ".js"],
      alias: {
        "~": path.resolve(__dirname, "src"),
      },
    },
    assetsInclude: ["**/*.docx", "**/*.pdf", "**/*.pptx"],
    define: {
      API_HOST: JSON.stringify(env.API_HOST),
      API_URI: JSON.stringify(env.API_URI),
      API_PROTECTED_URI: JSON.stringify(env.API_PROTECTED_URI),
      BUILD_DATE: JSON.stringify(new Date()),
      API_SUPPORT_ENDPOINT: env.API_SUPPORT_ENDPOINT
        ? JSON.stringify(env.API_SUPPORT_ENDPOINT)
        : `"/api/support/tickets"`,
      TALENTSEARCH_SUPPORT_EMAIL: env.TALENTSEARCH_SUPPORT_EMAIL
        ? JSON.stringify(env.TALENTSEARCH_SUPPORT_EMAIL)
        : `"support-soutien@talent.canada.ca"`,
    },
    plugins: [
      react({
        include: "**/*.{tsx}",
      }),
      gitVersionPlugin(),
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
    ],
  };
});
