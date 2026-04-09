import { copyFileSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const distClient = resolve("dist/client");
const staticPagesDir = resolve("src/pages/Static");

type ManifestEntry = { file: string };
const manifest: Record<string, ManifestEntry> = JSON.parse(
  readFileSync(resolve(distClient, ".vite/manifest.json"), "utf-8"),
);

const cssEntryKey = "src/assets/css/tailwind.css";
const cssEntry = manifest[cssEntryKey];
if (!cssEntry) {
  throw new Error(`CSS entry "${cssEntryKey}" not found in Vite manifest`);
}

// Vite emits the CSS with a content-hashed filename; copy it once to a stable
// path so that all prerendered pages can reference a predictable URL.
copyFileSync(resolve(distClient, cssEntry.file), resolve(distClient, "static.css"));

function toSlug(filename: string): string {
  const name = basename(filename, ".tsx").replace(/Page$/, "");
  return name.replace(/([A-Z])/g, (_, char, offset) =>
    offset > 0 ? `-${char.toLowerCase()}` : char.toLowerCase(),
  );
}

const pageFiles = readdirSync(staticPagesDir).filter((f) => f.endsWith(".tsx"));

for (const file of pageFiles) {
  const mod = await import(pathToFileURL(resolve(staticPagesDir, file)).href);

  if (typeof mod.title !== "string") {
    throw new Error(`${file} must export a "title" string`);
  }

  const slug = toSlug(file);
  const body = renderToStaticMarkup(createElement(mod.default));

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${mod.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" />
    <link rel="stylesheet" href="/static.css" />
  </head>
  <body>
    ${body}
  </body>
</html>
`;

  writeFileSync(resolve(distClient, `${slug}.html`), html, "utf-8");
  console.log(`✓ ${slug}.html`);
}
