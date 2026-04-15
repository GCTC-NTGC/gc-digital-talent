#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

import { glob } from "glob";
import dotenv from "dotenv";

dotenv.config({ path: "./.env", quiet: true });

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

// Configuration - keep it simple like the original working version
const TIMEOUT_MS = 30000; // 30 second timeout (original used 30s and worked)
const CONCURRENCY = 20; // Check 20 links in parallel for speed

// HTTP status codes that are acceptable (not broken links)
const ACCEPTABLE_STATUS_CODES = [
  200, 201, 202, 203, 204, 205, 206, // 2xx success
  301, 302, 303, 307, 308, // redirects (should have been followed but sometimes not)
  403, // Forbidden - usually bot blocking, link is likely fine
];

/**
 * Fetch a link using GET (like the original working version).
 * Simple approach: single request, 30s timeout, no retries.
 */
async function fetchLink(url: string): Promise<number | string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        // Use a browser-like User-Agent to avoid being blocked by sites that filter bots.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });
    return res.status;
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        return "timeout";
      }
      return err.message;
    }
    return JSON.stringify(err);
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

function isValidExternalLink(url: string): boolean {
  const whiteListedDomains = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://gcxgce.sharepoint.com",
  ];

  return (
    typeof url === "string" &&
    url.startsWith("http") &&
    !whiteListedDomains.some((domain) =>
      url.toLowerCase().startsWith(domain.toLowerCase()),
    )
  );
}

async function extractExternalLinks(filePath: string): Promise<string[]> {
  const content = await fs.readFile(filePath, "utf-8");
  const links: string[] = [];
  const ext = path.extname(filePath).slice(1);

  // Determine regex based on file extension
  const regex =
    ext === "html" ? /href=['"]([^'"]+)['"]/g : /['"](https?:\/\/[^'"]+)['"]/g;

  let match;
  while ((match = regex.exec(content))) {
    const url = match[1];
    if (isValidExternalLink(url)) {
      links.push(url);
    }
  }

  return links;
}

/**
 * Process items in parallel with a concurrency limit and progress reporting.
 */
async function processInParallel<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrency: number,
  onProgress?: (completed: number, total: number, result: R) => void,
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;
  let completed = 0;

  async function worker(): Promise<void> {
    while (index < items.length) {
      const currentIndex = index++;
      const result = await processor(items[currentIndex]);
      results[currentIndex] = result;
      completed++;
      if (onProgress) {
        onProgress(completed, items.length, result);
      }
    }
  }

  // Start workers up to concurrency limit
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);

  return results;
}

async function main() {
  try {
    const files = await getAllFiles();
    const allLinks: { file: string; url: string }[] = [];
    const seenUrls = new Set<string>();

    // Extract all unique external links from source files
    for (const file of files) {
      try {
        const stat = await fs.lstat(file);
        if (!stat.isFile()) continue;
        const links = await extractExternalLinks(file);
        for (const url of links) {
          if (!seenUrls.has(url)) {
            allLinks.push({ file, url });
            seenUrls.add(url);
          }
        }
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

    // Save all unique links so that we can cross verify later
    const allLinksPath = path.resolve("external-links.json");
    await fs.writeFile(
      allLinksPath,
      JSON.stringify(allLinks, null, 2),
      "utf-8",
    );

    // eslint-disable-next-line no-console
    console.log(`Checking ${allLinks.length} external links (${CONCURRENCY} in parallel)...`);

    const startTime = Date.now();
    let okCount = 0;
    let failCount = 0;
    
    // Check links in parallel for speed
    const statuses = await processInParallel(
      allLinks,
      async (link) => fetchLink(link.url),
      CONCURRENCY,
      (completed, total, status) => {
        // Track counts live
        if (typeof status === "number" && ACCEPTABLE_STATUS_CODES.includes(status)) {
          okCount++;
        } else {
          failCount++;
        }
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        process.stdout.write(`\r[${elapsed}s] ${completed}/${total} checked (${okCount} ok, ${failCount} issues)`);
      },
    );

    // eslint-disable-next-line no-console
    console.log(""); // New line after progress

    const results: LinkStatus[] = [];
    const brokenLinks: LinkStatus[] = [];

    for (let i = 0; i < allLinks.length; i++) {
      const link = allLinks[i];
      const status = statuses[i];
      const linkStatus: LinkStatus = { file: link.file, url: link.url, status };

      // Check if it's an acceptable status
      if (typeof status === "number" && ACCEPTABLE_STATUS_CODES.includes(status)) {
        results.push(linkStatus);
      } else {
        // Broken links: 404, timeouts, network errors, etc.
        brokenLinks.push(linkStatus);
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    // eslint-disable-next-line no-console
    console.log(`\nCompleted in ${elapsed}s: ${results.length} OK, ${brokenLinks.length} broken`);

    // Write broken links report
    if (brokenLinks.length > 0) {
      const brokenLinksPath = path.resolve("external-broken-links.json");
      await fs.writeFile(
        brokenLinksPath,
        JSON.stringify(brokenLinks, null, 2),
        "utf-8",
      );
      // eslint-disable-next-line no-console
      console.log(`${brokenLinks.length} broken links found. See external-broken-links.json for details.`);
      process.exit(1);
    }

    // All links passed
    // eslint-disable-next-line no-console
    console.log(`All ${allLinks.length} external links are valid.`);
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
