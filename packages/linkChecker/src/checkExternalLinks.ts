#!/usr/bin/env node

/* suppress the turbo warning about undeclared env vars as we decide to use it from .env file */
/* eslint-disable turbo/no-undeclared-env-vars */

import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

import { glob } from "glob";
import dotenv from "dotenv";

dotenv.config({ path: "./.env", quiet: true });

interface LinkStatus {
  file: string;
  url: string;
  status: number | string;
  isLegacyTLS?: boolean;
}

// Use a global variable for currentLinkFile instead of an interface
declare global {
  var currentLinkFile: string | undefined;
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
  timeoutMs = 30000,
): Promise<{ status: number | string; isLegacyTLS: boolean }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    // Use a browser-like User-Agent to avoid being blocked by sites that filter bots.
    // Note: The Chrome version is intentionally generic (120.x) as most sites only check
    // for a valid-looking browser string rather than exact version matching.
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
  };

  try {
    // Try HEAD first (faster, no body download)
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers,
    });

    // If HEAD returns 405 (Method Not Allowed) or 403, try GET as fallback
    // Some servers don't support HEAD or block it specifically
    if (res.status === 405 || res.status === 403) {
      clearTimeout(timeout);
      const getController = new AbortController();
      const getTimeout = setTimeout(() => getController.abort(), timeoutMs);
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

    return { status: res.status, isLegacyTLS: false };
  } catch (err) {
    // decode the error and find out if it's a legacy renegotiation error
    let reason;
    let fullError = "";
    let isLegacyRenegotiation = false;
    if (err instanceof Error) {
      reason = err.message;
      fullError = err.stack ?? err.message;
      // Log all enumerable properties
      const props = Object.getOwnPropertyNames(err).reduce(
        (acc: Record<string, unknown>, key) => {
          acc[key] = (err as unknown as Record<string, unknown>)[key];
          return acc;
        },
        {},
      );
      fullError += "\n" + JSON.stringify(props, null, 2);
      // Check for legacy renegotiation error
      if (
        props.cause &&
        typeof props.cause === "object" &&
        (props.cause as Record<string, unknown>).code ===
          "ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED"
      ) {
        isLegacyRenegotiation = true;
      }
    } else {
      reason = JSON.stringify(err);
      fullError = reason;
    }
    // Only log error during retry phase (indicated by _RETRY_FAILED_LINKS env var)
    if (process.env._RETRY_FAILED_LINKS) {
      await writeErrorLog(`Fetch error for ${url}: ${fullError}`);
    }
    return { status: reason, isLegacyTLS: isLegacyRenegotiation };
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

// Check if a status indicates a successful response (2xx range)
function isSuccessStatus(status: number | string): boolean {
  return typeof status === "number" && status >= 200 && status < 300;
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

async function main() {
  try {
    // If running as a retry for all failed links
    if (process.env._RETRY_FAILED_LINKS) {
      const parsed = JSON.parse(
        process.env._RETRY_FAILED_LINKS ?? "[]",
      ) as unknown;
      const retryLinks: { file: string; url: string; isLegacyTLS?: boolean }[] =
        Array.isArray(parsed)
          ? (parsed as unknown[]).filter(
              (
                item,
              ): item is { file: string; url: string; isLegacyTLS?: boolean } =>
                typeof item === "object" &&
                item !== null &&
                typeof (item as { file?: unknown }).file === "string" &&
                typeof (item as { url?: unknown }).url === "string",
            )
          : [];

      const results: LinkStatus[] = [];
      for (const link of retryLinks) {
        global.currentLinkFile = link.file;
        const { status, isLegacyTLS } = await fetchLink(link.url);
        results.push({ file: link.file, url: link.url, status, isLegacyTLS });
      }
      // Filter for broken links - only report errors that fail on retry
      const brokenLinks = results.filter((r) => !isSuccessStatus(r.status));
      const brokenLinksPath = path.resolve("external-broken-links.json");
      await fs.writeFile(
        brokenLinksPath,
        JSON.stringify(brokenLinks, null, 2),
        "utf-8",
      );
      if (brokenLinks.length > 0) process.exit(1);
      return;
    }

    const files = await getAllFiles();
    const allLinks: { file: string; url: string }[] = [];
    const seenUrls = new Set<string>();
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
    // This can be enhanced with concurrency if the links are too many and slow
    const results: LinkStatus[] = [];
    const failedLinks: { file: string; url: string; isLegacyTLS: boolean }[] =
      [];
    for (const link of allLinks) {
      global.currentLinkFile = link.file;
      const { status, isLegacyTLS } = await fetchLink(link.url);
      // Track all non-success statuses for retry
      if (!isSuccessStatus(status)) {
        failedLinks.push({ file: link.file, url: link.url, isLegacyTLS });
      } else {
        results.push({ file: link.file, url: link.url, status });
      }
    }
    // Retry all failed links once (only in first pass, not during retry)
    if (failedLinks.length > 0 && !process.env._RETRY_FAILED_LINKS) {
      const result = spawnSync(process.execPath, process.argv.slice(1), {
        env: {
          ...process.env,
          _RETRY_FAILED_LINKS: JSON.stringify(failedLinks),
        },
        stdio: "inherit",
      });
      // Exit with the subprocess exit code if it failed
      if (result.status !== 0) {
        process.exit(result.status ?? 1);
      }
    }
    // If we get here with no failed links, all links passed - exit successfully
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
