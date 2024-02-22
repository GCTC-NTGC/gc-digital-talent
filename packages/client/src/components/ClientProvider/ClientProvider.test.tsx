/**
 * @jest-environment jsdom
 */

import { CombinedError } from "urql";
import isEqual from "lodash/isEqual";

import { extractErrorMessages } from "../../utils/errors";
import { exportedForTesting } from "./ClientProvider";

const { isTokenKnownToBeExpired } = exportedForTesting;

describe("ClientProvider tests", () => {
  // some API requests do not require auth to succeed
  test("If there is no auth then willAuthError is false", async () => {
    const accessToken = null;
    const result = isTokenKnownToBeExpired(accessToken);
    expect(result).toEqual(false);
  });

  test("If there is an accessToken that has not expired then willAuthError is false", async () => {
    const accessToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjIxNDc0ODM2NDcsImlhdCI6MH0.v5o7sfcTiqB21JrCZ1ytP0gJp4JeTuiEdO8yVBVro7Y"; // expires Jan 18 2038
    const result = isTokenKnownToBeExpired(accessToken);
    expect(result).toEqual(false);
  });

  test("If there is an accessToken that has expired then willAuthError is true", async () => {
    const accessToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjEsImlhdCI6MH0.d5nyMUDCvbvfTmg3ow_cN4YZX4jmfoXAGq3DbCw5LAc"; // expires Dec 31 1969
    const result = isTokenKnownToBeExpired(accessToken);
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
              // eslint-disable-next-line camelcase
              validation_rule_1: [
                "Validation message 1.1",
                "Validation message 1.2",
              ],
              // eslint-disable-next-line camelcase
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

    const validationMessages = extractErrorMessages(testError);

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
