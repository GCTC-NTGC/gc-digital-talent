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

// Configuration for retries
const MAX_RETRIES = 2; // Retry twice for transient failures
const RETRY_DELAY_MS = 500; // 500ms delay between retries
const TIMEOUT_MS = 30000; // 30 second timeout per request
const CONCURRENCY = 10; // Check 10 links in parallel for speed

// HTTP status codes that indicate HEAD is not supported (should fall back to GET)
const HEAD_NOT_SUPPORTED_CODES = [405, 403, 501]; // Method Not Allowed, Forbidden, Not Implemented

// HTTP status codes that are worth retrying (server errors and rate limiting)
const RETRYABLE_STATUS_CODES = [
  429, // Too Many Requests
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
];

// Helper to delay execution
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch a link with automatic retry logic.
 * Retries up to MAX_RETRIES times with a short delay between attempts.
 */
async function fetchLink(url: string): Promise<number | string> {
  const headers = {
    // Use a browser-like User-Agent to avoid being blocked by sites that filter bots.
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
  };

  let lastError = "Unknown error";
  let lastStatus: number | undefined;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      // Try HEAD first (faster, no body download)
      let res = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: controller.signal,
        headers,
      });

      // If HEAD returns a code indicating it's not supported, try GET as fallback
      if (HEAD_NOT_SUPPORTED_CODES.includes(res.status)) {
        clearTimeout(timeout);
        const getController = new AbortController();
        const getTimeout = setTimeout(() => getController.abort(), TIMEOUT_MS);
        try {
          res = await fetch(url, {
            method: "GET",
            redirect: "follow",
            signal: getController.signal,
            headers,
          });
        } finally {
          clearTimeout(getTimeout);
        }
      }

      clearTimeout(timeout);
      lastStatus = res.status;

      // Success - return the status code
      if (res.status >= 200 && res.status < 300) {
        return res.status;
      }

      // Only retry for server errors and rate limiting, not client errors (4xx except 408/429)
      if (
        RETRYABLE_STATUS_CODES.includes(res.status) &&
        attempt < MAX_RETRIES
      ) {
        await delay(RETRY_DELAY_MS);
        continue;
      }

      // Non-retryable error or final attempt, return the status code
      return res.status;
    } catch (err) {
      clearTimeout(timeout);

      if (err instanceof Error) {
        lastError = err.message;
        // Don't retry on timeout errors - they're unlikely to succeed on retry
        if (err.name === "AbortError" || lastError.includes("aborted")) {
          return lastError;
        }
      } else {
        lastError = JSON.stringify(err);
      }

      // Retry on other network errors (connection reset, DNS failure, etc.)
      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY_MS);
        continue;
      }

      // All retries exhausted, return the error message
      return lastError;
    }
  }

  // This should not be reached, but return last known status/error as fallback
  return lastStatus ?? lastError;
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
 * Process items in parallel with a concurrency limit.
 */
async function processInParallel<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrency: number,
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;

  async function worker(): Promise<void> {
    while (index < items.length) {
      const currentIndex = index++;
      results[currentIndex] = await processor(items[currentIndex]);
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
    console.log(`Checking ${allLinks.length} external links...`);

    // Check links in parallel for speed
    const statuses = await processInParallel(
      allLinks,
      async (link) => fetchLink(link.url),
      CONCURRENCY,
    );

    const results: LinkStatus[] = [];
    const brokenLinks: LinkStatus[] = [];

    for (let i = 0; i < allLinks.length; i++) {
      const link = allLinks[i];
      const status = statuses[i];
      const linkStatus: LinkStatus = { file: link.file, url: link.url, status };

      // Check if it's a success status (2xx range)
      if (typeof status === "number" && status >= 200 && status < 300) {
        results.push(linkStatus);
      } else {
        brokenLinks.push(linkStatus);
      }
    }

    // Write broken links report
    if (brokenLinks.length > 0) {
      const brokenLinksPath = path.resolve("external-broken-links.json");
      await fs.writeFile(
        brokenLinksPath,
        JSON.stringify(brokenLinks, null, 2),
        "utf-8",
      );
      // eslint-disable-next-line no-console
      console.log(`Found ${brokenLinks.length} broken links. See external-broken-links.json for details.`);
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
