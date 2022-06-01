/**
 * @jest-environment jsdom
 */

import { exportedForTesting } from "./ClientProvider";

const { willAuthError } = exportedForTesting;

describe("LanguageRedirectContainer tests", () => {
  // some API requests do not require auth to succeed
  test("If there is no auth then willAuthError is false", async () => {
    const authState = null;
    const result = willAuthError({ authState });
    expect(result).toEqual(false);
  });

  // some API requests do not require auth to succeed
  test("If there is auth but no accessToken then willAuthError is false", async () => {
    const authState = { accessToken: null, refreshToken: null, idToken: null };
    const result = willAuthError({ authState });
    expect(result).toEqual(false);
  });

  test("If there is an accessToken that has not expired then willAuthError is false", async () => {
    const result = willAuthError({
      authState: {
        accessToken:
          "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjIxNDc0ODM2NDcsImlhdCI6MH0.v5o7sfcTiqB21JrCZ1ytP0gJp4JeTuiEdO8yVBVro7Y", // expires Jan 18 2038
        refreshToken: null,
        idToken: null,
      },
    });
    expect(result).toEqual(false);
  });

  test("If there is an accessToken that has expired then willAuthError is true", async () => {
    const result = willAuthError({
      authState: {
        accessToken:
          "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjEsImlhdCI6MH0.d5nyMUDCvbvfTmg3ow_cN4YZX4jmfoXAGq3DbCw5LAc", // expires Dec 31 1969
        refreshToken: null,
        idToken: null,
      },
    });
    expect(result).toEqual(true);
  });
});
