import { PassThrough } from "node:stream";

import type { EntryContext } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";

/**
 * NOTE: Even though we do not do SSR, this is required
 * to compile the root.tsx during buildtime.
 *
 * It should not be necessary except we need to pass
 * nonce to it so that it passes our CSP.
 *
 * Based on default:
 *   https://reactrouter.com/api/framework-conventions/entry.server.tsx#default
 */
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  const nonce = "**CSP_NONCE**";

  return new Promise((resolve, reject) => {
    const { pipe } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} nonce={nonce} />,
      {
        nonce,
        onShellReady() {
          responseHeaders.set("Content-Type", "text/html");

          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error instanceof Error ? error : new Error(String(error)));
        },
      },
    );
  });
}
