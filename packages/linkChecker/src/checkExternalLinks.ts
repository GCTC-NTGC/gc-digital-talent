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

// Configuration - optimized for speed while still catching real broken links
const MAX_RETRIES = 2; // Quick retry for transient failures
const INITIAL_RETRY_DELAY_MS = 500; // Short delay between retries
const TIMEOUT_MS = 15000; // 15 second timeout (faster)
const CONCURRENCY = 30; // Higher concurrency for speed

// Only these codes indicate a TRULY broken link
const BROKEN_STATUS_CODES = [
  404, // Not Found - link is broken
  410, // Gone - link permanently removed
];

// Helper to delay execution
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Make a single fetch request with timeout.
 */
async function singleFetch(url: string): Promise<number | string> {
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

/**
 * Fetch a link with retry for network errors only.
 * HTTP status codes are NOT retried - we accept the first response.
 */
async function fetchLink(url: string): Promise<number | string> {
  let lastResult: number | string = "Unknown error";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const result = await singleFetch(url);

    // If we got an HTTP status code, return it immediately (no retry)
    if (typeof result === "number") {
      return result;
    }

    // Network error - check if we should retry
    const isRetryable =
      result === "timeout" ||
      result.includes("ECONNRESET") ||
      result.includes("ETIMEDOUT") ||
      result.includes("ENOTFOUND") ||
      result.includes("socket hang up");

    lastResult = result;

    // If it's not retryable, return immediately
    if (!isRetryable) {
      return result;
    }

    // If we have more retries, wait briefly
    if (attempt < MAX_RETRIES) {
      await delay(INITIAL_RETRY_DELAY_MS);
    }
  }

  // All retries exhausted - return last result
  return lastResult;
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
    let brokenCount = 0;
    
    // Helper to check if a link is truly broken (only 404/410)
    const isBroken = (status: number | string): boolean => {
      return typeof status === "number" && BROKEN_STATUS_CODES.includes(status);
    };
    
    // Check links in parallel for speed
    const statuses = await processInParallel(
      allLinks,
      async (link) => fetchLink(link.url),
      CONCURRENCY,
      (completed, total, status) => {
        // Track counts live
        if (isBroken(status)) brokenCount++;
        else okCount++;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        process.stdout.write(`\r[${elapsed}s] ${completed}/${total} (${okCount} ok, ${brokenCount} broken)`);
      },
    );

    // eslint-disable-next-line no-console
    console.log(""); // New line after progress

    const brokenLinks: LinkStatus[] = [];

    for (let i = 0; i < allLinks.length; i++) {
      const link = allLinks[i];
      const status = statuses[i];
      
      // Only 404/410 are considered truly broken
      if (isBroken(status)) {
        brokenLinks.push({ file: link.file, url: link.url, status });
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    // eslint-disable-next-line no-console
    console.log(`\nCompleted in ${elapsed}s: ${allLinks.length - brokenLinks.length} OK, ${brokenLinks.length} broken`);

    // Write broken links report (fails the build)
    if (brokenLinks.length > 0) {
      const brokenLinksPath = path.resolve("external-broken-links.json");
      await fs.writeFile(
        brokenLinksPath,
        JSON.stringify(brokenLinks, null, 2),
        "utf-8",
      );
      // eslint-disable-next-line no-console
      console.log(`${brokenLinks.length} broken links found (404/410). See external-broken-links.json for details.`);
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
