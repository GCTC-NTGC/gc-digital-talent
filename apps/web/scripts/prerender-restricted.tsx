/**
 * Post-build script: prerender the restricted-access static page.
 *
 * Run automatically after `react-router build` via the `build` npm script.
 *
 * What this script does:
 *  1. Reads dist/client/.vite/manifest.json to locate the hashed Tailwind CSS
 *     asset that was emitted by the Vite build.
 *  2. Copies that file to dist/client/restricted.css — a stable, predictable
 *     path that does not change between deployments even when the content hash
 *     changes.  The main app bundle keeps its hashed filename for cache-busting;
 *     this copy is exclusively for the restricted page.
 *  3. Renders RestrictedPage to a static HTML string using
 *     renderToStaticMarkup and writes a full HTML document to
 *     dist/client/restricted.html, referencing /restricted.css.
 */
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import RestrictedPage from "../src/pages/Static/RestrictedPage.tsx";

// ---------------------------------------------------------------------------
// Paths (all relative to apps/web, which is the CWD during `pnpm build`)
// ---------------------------------------------------------------------------

const distClient = resolve("dist/client");
const manifestPath = resolve(distClient, ".vite/manifest.json");

// ---------------------------------------------------------------------------
// 1. Locate the Tailwind CSS asset in the Vite manifest
// ---------------------------------------------------------------------------

type ManifestEntry = {
  file: string;
  src?: string;
  isEntry?: boolean;
};

const manifest: Record<string, ManifestEntry> = JSON.parse(
  readFileSync(manifestPath, "utf-8"),
);

// The entry key is the source path of the CSS file as Vite sees it.
const cssEntryKey = "src/assets/css/tailwind.css";
const cssEntry = manifest[cssEntryKey];

if (!cssEntry) {
  throw new Error(
    `Could not find "${cssEntryKey}" in the Vite manifest. ` +
      `Available keys: ${Object.keys(manifest).join(", ")}`,
  );
}

// e.g. "assets/tailwind-aBcDeFgH.css"
const hashedCssPath = resolve(distClient, cssEntry.file);

// ---------------------------------------------------------------------------
// 2. Copy hashed CSS → stable path
// ---------------------------------------------------------------------------

const stableCssPath = resolve(distClient, "restricted.css");
copyFileSync(hashedCssPath, stableCssPath);

// ---------------------------------------------------------------------------
// 3. Render the page and write restricted.html
// ---------------------------------------------------------------------------

const bodyHtml = renderToStaticMarkup(createElement(RestrictedPage));

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Unauthorized | Non autorisé</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
    />
    <link rel="stylesheet" href="/restricted.css" />
  </head>
  <body>
    ${bodyHtml}
  </body>
</html>
`;

const outputPath = resolve(distClient, "restricted.html");
writeFileSync(outputPath, html, "utf-8");

console.log(`✓ restricted.css  →  ${stableCssPath}`);
console.log(`✓ restricted.html →  ${outputPath}`);
