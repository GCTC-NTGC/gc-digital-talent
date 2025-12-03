import fs from "node:fs/promises";
import path from "node:path";

import { glob } from "glob";

interface LinkStatus {
  file: string;
  url: string;
  status: number | string;
}

async function fetchLink(
  url: string,
  timeoutMs = 10000,
): Promise<number | string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    return res.status;
  } catch {
    return "error";
  } finally {
    clearTimeout(timeout);
  }
}

async function getAllFiles(): Promise<string[]> {
  const files = await glob("apps/web/src/**/*.{ts,tsx,js,jsx,html}", {
    absolute: true,
    ignore: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.git/**",
      "**/svg/**",
      "**/Svg/**",
      "**/icon/**",
      "**/icons/**",
      "**/*.stories.*",
    ],
  });

  return files;
}

//  Extract external links
async function extractExternalLinks(filePath: string): Promise<string[]> {
  let content: string;
  try {
    content = await fs.readFile(filePath, "utf-8");
  } catch {
    return [];
  }

  const links: string[] = [];
  const ext = path.extname(filePath).slice(1);

  // HTML links
  if (ext === "html") {
    const regex = /href=['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content))) {
      const url = match[1];
      if (url.startsWith("http") && !url.toLowerCase().includes("sharepoint")) {
        links.push(url);
      }
    }
  } else {
    // JS/TS/TSX/JSX links (in strings)
    const regex = /['"](https?:\/\/[^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content))) {
      const url = match[1];
      if (!url.toLowerCase().includes("sharepoint")) {
        links.push(url);
      }
    }
  }

  return links;
}

async function main() {
  try {
    const files = await getAllFiles();

    const allLinks: { file: string; url: string }[] = [];

    for (const file of files) {
      const links = await extractExternalLinks(file);
      links.forEach((url) => allLinks.push({ file, url }));
    }

    // Save all links so that we can cross verify later
    const allLinksPath = path.resolve("external-links.json");
    await fs.writeFile(
      allLinksPath,
      JSON.stringify(allLinks, null, 2),
      "utf-8",
    );

    // This can be enhanced with concurrency if the links are too many and slow
    const results: LinkStatus[] = [];
    for (const link of allLinks) {
      const status = await fetchLink(link.url);
      results.push({ file: link.file, url: link.url, status });
    }

    // Save broken links
    const brokenLinks = results.filter((r) => r.status !== 200);
    const brokenLinksPath = path.resolve("external-broken-links.json");
    await fs.writeFile(
      brokenLinksPath,
      JSON.stringify(brokenLinks, null, 2),
      "utf-8",
    );

    if (brokenLinks.length > 0) process.exit(1);
  } catch (err) {
    let msg: string;
    const errorLogPath = path.resolve("external-link-errors.log");

    if (err instanceof Error) {
      msg = err.stack ?? err.message;
    } else {
      // stringify any non-Error object
      msg = JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
    }

    // Write the error to file
    await fs.writeFile(errorLogPath, msg, "utf-8");
    process.exit(1);
  }
}

void main();
