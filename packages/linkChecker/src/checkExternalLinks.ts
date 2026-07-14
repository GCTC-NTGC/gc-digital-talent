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
}

const DEFAULT_TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;
const RETRY_BACKOFF_MS = 750;
const RETRYABLE_HTTP_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);
// These hosts block automated requests with 403 by design — treat 403 as alive
const KNOWN_AUTH_REQUIRED_HOSTS = new Set([
  "connexion.canada.ca",
  "login.canada.ca",
]);

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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorCode(err: unknown): string | undefined {
  if (!err || typeof err !== "object") return undefined;
  const maybeCode = (err as Record<string, unknown>).code;
  return typeof maybeCode === "string" ? maybeCode : undefined;
}

function shouldRetryFromError(err: unknown): boolean {
  const retryableErrorCodes = new Set([
    "ECONNRESET",
    "ECONNREFUSED",
    "ETIMEDOUT",
    "ENOTFOUND",
    "EAI_AGAIN",
    "UND_ERR_CONNECT_TIMEOUT",
    "UND_ERR_HEADERS_TIMEOUT",
    "UND_ERR_BODY_TIMEOUT",
    "UND_ERR_SOCKET",
  ]);

  const code = getErrorCode(err);
  if (code && retryableErrorCodes.has(code)) {
    return true;
  }

  if (err instanceof Error) {
    const message = err.message.toLowerCase();
    return (
      message.includes("fetch failed") ||
      message.includes("networkerror") ||
      message.includes("socket") ||
      message.includes("timed out") ||
      message.includes("timeout")
    );
  }

  return false;
}

function isKnownAuthRequiredHost(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return KNOWN_AUTH_REQUIRED_HOSTS.has(parsedUrl.hostname.toLowerCase());
  } catch {
    return false;
  }
}

async function fetchLinkWithBrowserHeaders(
  url: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<number | string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-CA,en;q=0.9,fr-CA;q=0.8,fr;q=0.7",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Referer: "https://www.canada.ca/",
      },
    });
    return res.status;
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return JSON.stringify(err);
  } finally {
    clearTimeout(timeout);
  }
}

function isBrokenStatus(status: number | string, url: string): boolean {
  if (status === 403 && isKnownAuthRequiredHost(url)) return false;
  return status !== 200;
}

async function fetchLink(
  url: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<number | string> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          // Use a generic User-Agent string to avoid frequent updates
          "User-Agent":
            "Mozilla/5.0 (compatible; LinkChecker/1.0; +https://github.com/GCTC-NTGC/gc-digital-talent)",
        },
      });

      if (
        RETRYABLE_HTTP_STATUSES.has(res.status) &&
        attempt < MAX_RETRIES
      ) {
        await sleep(RETRY_BACKOFF_MS * (attempt + 1));
        continue;
      }

      if ((res.status === 403 || res.status === 404) && isKnownAuthRequiredHost(url)) {
        return fetchLinkWithBrowserHeaders(url, timeoutMs);
      }

      return res.status;
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

      if (isLegacyRenegotiation && !process.env._RETRIED_LEGACY_TLS) {
        // retry with legacy TLS renegotiation enabled, using .env for all vars
        const currentLinkFile = global.currentLinkFile ?? "";
        spawnSync(process.execPath, process.argv.slice(1), {
          env: {
            ...process.env,
            NODE_OPTIONS: "--tls-legacy-renegotiation",
            _RETRIED_LEGACY_TLS: "1",
            _RETRY_LINK_URL: url,
            _RETRY_LINK_FILE: currentLinkFile,
          },
          stdio: "inherit",
        });
        return "retried-with-legacy-tls";
      }

      if (shouldRetryFromError(err) && attempt < MAX_RETRIES) {
        await sleep(RETRY_BACKOFF_MS * (attempt + 1));
        continue;
      }

      await writeErrorLog(`Fetch error for ${url}: ${fullError}`);
      return reason;
    } finally {
      clearTimeout(timeout);
    }
  }

  return "Unknown retry error";
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
    "http://localhost",
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
    // If running as a retry for a batch of legacy TLS links
    if (process.env._RETRIED_LEGACY_TLS && process.env._RETRY_LEGACY_LINKS) {
      const parsed = JSON.parse(
        process.env._RETRY_LEGACY_LINKS ?? "[]",
      ) as unknown;
      const retryLinks: { file: string; url: string }[] = Array.isArray(parsed)
        ? (parsed as unknown[]).filter(
            (item): item is { file: string; url: string } =>
              typeof item === "object" &&
              item !== null &&
              typeof (item as { file?: unknown }).file === "string" &&
              typeof (item as { url?: unknown }).url === "string",
          )
        : [];
      const results: LinkStatus[] = [];
      for (const link of retryLinks) {
        global.currentLinkFile = link.file;
        const status = await fetchLink(link.url);
        results.push({ file: link.file, url: link.url, status });
      }
      // Save broken links
      const brokenLinks = results.filter((r) => isBrokenStatus(r.status, r.url));
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
    const legacyLinks: { file: string; url: string }[] = [];
    for (const link of allLinks) {
      global.currentLinkFile = link.file;
      const status = await fetchLink(link.url);
      // some old gov links  need legacy TLS renegotiation
      if (
        status === "retried-with-legacy-tls" ||
        status === "ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED"
      ) {
        legacyLinks.push({ file: link.file, url: link.url });
      } else {
        results.push({ file: link.file, url: link.url, status });
      }
    }
    // re-try all legacy links in a single batch with NODE_OPTIONS=--tls-legacy-renegotiation
    if (legacyLinks.length > 0 && !process.env._RETRIED_LEGACY_TLS) {
      spawnSync(process.execPath, process.argv.slice(1), {
        env: {
          ...process.env,
          NODE_OPTIONS: "--tls-legacy-renegotiation",
          _RETRIED_LEGACY_TLS: "1",
          _RETRY_LEGACY_LINKS: JSON.stringify(legacyLinks),
        },
        stdio: "inherit",
      });
    }
    // create broken links file only if any broken link exist
    const brokenLinks = results.filter((r) => isBrokenStatus(r.status, r.url));
    if (brokenLinks.length > 0) {
      const brokenLinksPath = path.resolve("external-broken-links.json");
      await fs.writeFile(
        brokenLinksPath,
        JSON.stringify(brokenLinks, null, 2),
        "utf-8",
      );
      process.exit(1);
    }
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
