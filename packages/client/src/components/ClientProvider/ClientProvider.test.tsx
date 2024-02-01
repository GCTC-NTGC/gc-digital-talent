/**
 * @jest-environment jsdom
 */

import { CombinedError } from "urql";
import isEqual from "lodash/isEqual";

import { exportedForTesting } from "./ClientProvider";

const { extractErrorMessages } = exportedForTesting;

describe("ClientProvider tests", () => {
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
