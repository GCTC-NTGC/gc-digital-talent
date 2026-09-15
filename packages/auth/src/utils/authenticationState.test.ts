/* eslint-disable camelcase */
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ACCESS_TOKEN, ID_TOKEN, REFRESH_TOKEN } from "../const";
import getAuthenticationState from "./authenticationState";

vi.mock("@gc-digital-talent/logger", () => ({
  getLogger: () => ({
    notice: vi.fn(),
    debug: vi.fn(),
  }),
}));

vi.mock("./logout", () => ({
  default: vi.fn(),
  getLogoutVars: () => ({
    logoutUri: "https://example.com/logout",
    postLogoutRedirectUri: "https://example.com/",
  }),
}));

vi.mock("./logoutChannel", () => ({
  getLogoutChannel: () => vi.fn(),
}));

vi.mock("./getTokenRefreshPath", () => ({
  default: () => "/refresh",
}));

describe("refreshTokenSet", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("requests /refresh via POST with the token in a JSON body", async () => {
    localStorage.setItem(REFRESH_TOKEN, "stored-refresh-token");

    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
          expires_in: null,
          id_token: null,
        }),
    } as Response);

    const { refreshTokenSet } = getAuthenticationState({ locale: "en" });
    await refreshTokenSet();

    expect(fetchMock).toHaveBeenCalledWith("/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: "stored-refresh-token" }),
    });
  });

  it("stores the refreshed tokens on success", async () => {
    localStorage.setItem(REFRESH_TOKEN, "stored-refresh-token");

    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
          expires_in: null,
          id_token: "new-id-token",
        }),
    } as Response);

    const { refreshTokenSet } = getAuthenticationState({ locale: "en" });
    await refreshTokenSet();

    expect(localStorage.getItem(ACCESS_TOKEN)).toBe("new-access-token");
    expect(localStorage.getItem(REFRESH_TOKEN)).toBe("new-refresh-token");
    expect(localStorage.getItem(ID_TOKEN)).toBe("new-id-token");
  });

  it("does nothing when there is no stored refresh token", async () => {
    const fetchMock = vi.spyOn(global, "fetch");

    const { refreshTokenSet } = getAuthenticationState({ locale: "en" });
    await refreshTokenSet();

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
