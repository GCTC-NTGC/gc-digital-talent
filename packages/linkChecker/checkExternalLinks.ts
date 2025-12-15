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
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
      }
    });
    return res.status;
  } catch (err) {
    let reason = "error";
    let fullError = "";
    let isLegacyRenegotiation = false;
    if (err instanceof Error) {
      reason = err.message;
      fullError = err.stack || err.message;
      // Log all enumerable properties
      const props = Object.getOwnPropertyNames(err).reduce((acc: Record<string, unknown>, key) => {
        acc[key] = (err as any)[key];
        return acc;
      }, {});
      fullError += "\n" + JSON.stringify(props, null, 2);
      // Check for legacy renegotiation error
      if (props.cause && typeof props.cause === "object" && (props.cause as any).code === "ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED") {
        isLegacyRenegotiation = true;
      }
    } else if (typeof err === "string") {
      reason = err;
      fullError = err;
    } else {
      reason = JSON.stringify(err);
      fullError = reason;
    }
    if (isLegacyRenegotiation && !process.env._RETRIED_LEGACY_TLS) {
      // Retry with NODE_OPTIONS=--tls-legacy-renegotiation, only for this link
      const { spawnSync } = await import('node:child_process');
      spawnSync(process.execPath, process.argv.slice(1), {
        env: {
          ...process.env,
          NODE_OPTIONS: '--tls-legacy-renegotiation',
          _RETRIED_LEGACY_TLS: '1',
          _RETRY_LINK_URL: url,
          _RETRY_LINK_FILE: (globalThis as any)._currentLinkFile || ''
        },
        stdio: 'inherit',
      });
      return 'retried-with-legacy-tls';
    }
    await writeErrorLog(`Fetch error for ${url}: ${fullError}`);
    return reason;
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
    // If running as a retry for a batch of legacy TLS links
    if (process.env._RETRIED_LEGACY_TLS && process.env._RETRY_LEGACY_LINKS) {
      const retryLinks: { file: string; url: string }[] = JSON.parse(process.env._RETRY_LEGACY_LINKS);
      const results: LinkStatus[] = [];
      for (const link of retryLinks) {
        (globalThis as any)._currentLinkFile = link.file;
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
      (globalThis as any)._currentLinkFile = link.file;
      const status = await fetchLink(link.url);
      // some old gov links may need legacy TLS renegotiation
      if (status === 'retried-with-legacy-tls' || status === 'ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED') {
        legacyLinks.push({ file: link.file, url: link.url });
      } else {
        results.push({ file: link.file, url: link.url, status });
      }
    }
    // re-try all legacy links in a single batch with NODE_OPTIONS=--tls-legacy-renegotiation
    if (legacyLinks.length > 0 && !process.env._RETRIED_LEGACY_TLS) {
      const { spawnSync } = await import('node:child_process');
      spawnSync(process.execPath, process.argv.slice(1), {
        env: {
          ...process.env,
          NODE_OPTIONS: '--tls-legacy-renegotiation',
          _RETRIED_LEGACY_TLS: '1',
          _RETRY_LEGACY_LINKS: JSON.stringify(legacyLinks)
        },
        stdio: 'inherit',
      });
    }
    // Save broken links (from first pass only; second pass will overwrite if needed)
    const brokenLinks = results.filter((r) => r.status !== 200);
    const brokenLinksPath = path.resolve("external-broken-links.json");
    await fs.writeFile(
      brokenLinksPath,
      JSON.stringify(brokenLinks, null, 2),
      "utf-8",
    );
    if (brokenLinks.length > 0 || legacyLinks.length > 0) process.exit(1);
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
