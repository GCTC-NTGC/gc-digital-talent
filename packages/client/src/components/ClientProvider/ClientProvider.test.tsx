/**
 * @jest-environment jsdom
 */

import { CombinedError } from "urql";
import isEqual from "lodash/isEqual";
import { exportedForTesting } from "./ClientProvider";

const { willAuthError, extractValidationErrorMessages } = exportedForTesting;

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

  test("finds validation errors", async () => {
    // an error object for testing on
    // sorry, very ugly - would be nice to use stubs but I haven't figured that out
    const testError: CombinedError = {
      name: "Test Error",
      message: "Test Message",
      graphQLErrors: [
        {
          extensions: {
            validation: {
              validation_rule_1: [
                "Validation message 1.1",
                "Validation message 1.2",
              ],
              validation_rule_2: [
                "Validation message 2.1",
                "Validation message 2.2",
              ],
            },
            category: "validation",
          },
          locations: undefined,
          path: undefined,
          nodes: undefined,
          source: undefined,
          positions: undefined,
          originalError: undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          toJSON: (): any => "test",
          [Symbol.toStringTag]: "test",
          name: "Test Error",
          message: "Test Message",
        },
      ],
    };

    const validationMessages = extractValidationErrorMessages(testError);

    expect(
      isEqual(validationMessages, [
        "Validation message 1.1",
        "Validation message 1.2",
        "Validation message 2.1",
        "Validation message 2.2",
      ]),
    );
  });
});
