import { getNonce, setNonce } from "get-nonce";

import { applyCspNonce } from "./csp";

/**
 * Limitation: jsdom has no CSP, so it never blanks the `nonce` content
 * attribute the way a real browser does. Reading the attribute instead of the
 * `nonce` property would therefore still pass here while silently breaking in
 * production. That swap can only be caught in a browser served the CSP header
 * — see the manual steps in the pull request.
 */

const addElementWithNonce = (nonce: string) => {
  const script = document.createElement("script");
  script.setAttribute("nonce", nonce);
  document.head.append(script);
};

describe("applyCspNonce", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    setNonce(""); // falsy, so `getNonce` falls back to reporting no nonce
  });

  it("shares the document nonce with get-nonce consumers", () => {
    addElementWithNonce("abc123");
    applyCspNonce();

    expect(getNonce()).toBe("abc123");
  });

  it("ignores the un-substituted placeholder", () => {
    addElementWithNonce("**CSP_NONCE**");
    applyCspNonce();

    expect(getNonce()).toBeUndefined();
  });
});
