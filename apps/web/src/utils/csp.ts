import { setNonce } from "get-nonce";

/**
 * Placeholder that nginx swaps for the per-request nonce when it serves
 * `index.html`. If it reaches the browser un-substituted (dev server, tests)
 * there is no real nonce to share.
 */
const NONCE_PLACEHOLDER = "**CSP_NONCE**";

const getNonceElement = (): HTMLElement | null => {
  if (typeof document === "undefined") {
    return null;
  }

  return document.querySelector<HTMLElement>("[nonce]");
};

/**
 * Hand the nonce to `react-style-singleton`, which `react-remove-scroll` uses
 * to inject its scroll-lock `<style>` tag when a modal Radix dialog opens.
 * Without it that tag is blocked by `style-src-elem`.
 *
 * The nonce is only injected into `index.html`, never into the hashed JS
 * bundles, so it has to be read back off the document. Browsers blank the
 * `nonce` content attribute once the element is parsed, but the `nonce` IDL
 * property keeps the real value.
 */
export const applyCspNonce = (): void => {
  const nonce = getNonceElement()?.nonce;

  if (nonce && nonce !== NONCE_PLACEHOLDER) {
    setNonce(nonce);
  }
};

export const getDocumentNonce = (): string =>
  getNonceElement()?.getAttribute("nonce") ?? NONCE_PLACEHOLDER;
