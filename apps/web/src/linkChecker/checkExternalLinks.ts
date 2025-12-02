import fs from "node:fs/promises";
import path from "node:path";

import fetch from "node-fetch";
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
    ignore: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
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
      if (match[1].startsWith("http")) links.push(match[1]);
    }
  } else {
    // JS/TS/TSX/JSX links (in strings)
    const regex = /['"](https?:\/\/[^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content))) {
      links.push(match[1]);
    }
  }

  return links;
}

async function main() {
  console.log("Starting external link check...");

  const files = await getAllFiles();
  console.log(`Found ${files.length} files to scan.`);

  const allLinks: { file: string; url: string }[] = [];

  for (const file of files) {
    const links = await extractExternalLinks(file);
    links.forEach((url) => allLinks.push({ file, url }));
  }

  // Save all links so that we can cross verify later
  const allLinksPath = path.resolve("external-links.json");
  await fs.writeFile(allLinksPath, JSON.stringify(allLinks, null, 2), "utf-8");
  console.log(`Saved all external links to ${allLinksPath}`);

  // This can be enhanced with concurrency if the links are too many and slow
  const results: LinkStatus[] = [];
  for (const link of allLinks) {
    const status = await fetchLink(link.url);
    console.log(`${link.url} -> ${status}`);
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
  console.log(`Saved broken links to ${brokenLinksPath}`);

  if (brokenLinks.length > 0) process.exit(1);
}

void main().catch((err) => {
  console.error("Error checking external links:", err);
  process.exit(1);
});
