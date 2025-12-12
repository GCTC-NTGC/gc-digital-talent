#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";

interface LinkStatus {
  file: string;
  url: string;
  status: number | string;
}

// Write error to external-link-errors.log
async function writeErrorLog(msg: string, file?: string, append = true) {
  const errorLogPath = path.resolve("external-link-errors.log");
  const entry = file ? `${file}: ${msg}\n` : `${msg}\n`;
  if (append) {
    await fs.appendFile(errorLogPath, entry, "utf-8");
  } else {
    await fs.writeFile(errorLogPath, entry, "utf-8");
  }
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

async function extractExternalLinks(filePath: string): Promise<string[]> {
  const content = await fs.readFile(filePath, "utf-8");
  const links: string[] = [];
  const ext = path.extname(filePath).slice(1);

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
      try {
        const stat = await fs.lstat(file);
        if (!stat.isFile()) continue;
        const links = await extractExternalLinks(file);
        links.forEach((url) => allLinks.push({ file, url }));
      } catch (err) {
        let msg: string;
        if (err instanceof Error) {
          msg = err.stack ?? err.message;
        } else {
          msg = JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
        }
        await writeErrorLog(msg, file);
      }
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
    if (err instanceof Error) {
      msg = err.stack ?? err.message;
    } else {
      msg = JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
    }
    await writeErrorLog(msg, undefined, false);
    process.exit(1);
  }
}

void main();
