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
});
