import path from "path";
import childProcess from "child_process";

import dotenv from "dotenv";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

import { defineConfig } from "vite";

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
  let version;
  let commitHash;
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

export default defineConfig({
  publicDir: "./public",
  build: {
    outDir: "./dist",
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
    API_URI: JSON.stringify(process.env.API_URI),
    API_PROTECTED_URI: JSON.stringify(process.env.API_PROTECTED_URI),
    BUILD_DATE: JSON.stringify(new Date()),
    API_SUPPORT_ENDPOINT: process.env.API_SUPPORT_ENDPOINT
      ? JSON.stringify(process.env.API_SUPPORT_ENDPOINT)
      : `"/api/support/tickets"`,
    TALENTSEARCH_SUPPORT_EMAIL: process.env.TALENTSEARCH_SUPPORT_EMAIL
      ? JSON.stringify(process.env.TALENTSEARCH_SUPPORT_EMAIL)
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
});
