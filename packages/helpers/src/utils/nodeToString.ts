import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { ReactNode } from "react";

/**
 * Convert a ReactNode to a string
 *
 * REF: https://react.dev/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code
 */
function nodeToString(node: ReactNode): string {
  if (typeof node === "string") return node;

  const div = document.createElement("div");
  const root = createRoot(div);
  queueMicrotask(() => {
    /**
     * React cannot flushSync in the middle of a render.
     *
     * REF: https://react.dev/reference/react-dom/flushSync#im-getting-an-error-flushsync-was-called-from-inside-a-lifecycle-method
     */
    flushSync(() => {
      root.render(node);
    });
  });

  return div.innerHTML;
}

export default nodeToString;
