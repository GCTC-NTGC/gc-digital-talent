import { getNonce, setNonce } from "get-nonce";

import { applyCspNonce } from "./csp";

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
