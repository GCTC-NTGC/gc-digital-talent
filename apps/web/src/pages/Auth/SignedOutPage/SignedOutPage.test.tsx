import { setInSessionStorage } from "@gc-digital-talent/storage";

import { TALENT_REQUEST_STATE_KEY } from "~/constants/storageKeys";

import { clientLoader } from "./SignedOutPage";

const callClientLoader = (url: string) =>
  clientLoader({
    request: new Request(url),
  } as Parameters<typeof clientLoader>[0]);

describe("SignedOutPage clientLoader", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it("clears the stored talent request state on logout", async () => {
    setInSessionStorage(TALENT_REQUEST_STATE_KEY, {
      applicantFilter: {},
      candidateCount: 5,
    });

    await callClientLoader("https://talent.canada.ca/en/logged-out");

    expect(window.sessionStorage.getItem(TALENT_REQUEST_STATE_KEY)).toBeNull();
  });

  it("does not error when there is no stored talent request state", async () => {
    await callClientLoader("https://talent.canada.ca/en/logged-out");

    expect(window.sessionStorage.getItem(TALENT_REQUEST_STATE_KEY)).toBeNull();
  });

  const callWithFrom = (from: string) =>
    callClientLoader(
      `https://talent.canada.ca/en/logged-out?from=${encodeURIComponent(from)}`,
    );

  it.each([
    ["/en/jobs", "/en/jobs"],
    ["/en/jobs?a=1#b", "/en/jobs?a=1#b"],
    ["https://talent.canada.ca/en/jobs", "/en/jobs"],
  ])("redirects to %s within the app", (from, expected) => {
    let thrown: unknown;
    try {
      callWithFrom(from);
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).headers.get("Location")).toBe(expected);
  });

  it.each([
    "//bad-actor.com",
    "/\\bad-actor.com",
    "/\t/bad-actor.com",
    "https://bad-actor.com/en/jobs",
    "http://talent.canada.ca/en/jobs",
    "https://talent.canada.ca.bad-actor.com/en/jobs",
    "javascript:alert(1)",
  ])("does not redirect to %s", (from) => {
    expect(() => callWithFrom(from)).not.toThrow();
  });
});
