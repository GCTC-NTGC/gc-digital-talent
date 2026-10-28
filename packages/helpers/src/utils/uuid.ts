import type { CombinedError } from "urql";

interface ErrorWithDebugMessage {
  debugMessage: string;
}

const hasDebugMessage = (cause: unknown): cause is ErrorWithDebugMessage =>
  typeof cause === "object" &&
  cause !== null &&
  "debugMessage" in cause &&
  typeof cause.debugMessage === "string";

const isUuidError = (combinedError: CombinedError | undefined) => {
  /**
   * Note: For some reason our api returns debugMessage on the
   * Error type rather than cause, so we need to cast it here
   */
  return combinedError?.graphQLErrors?.some(
    (error) =>
      hasDebugMessage(error.cause) &&
      error.cause.debugMessage.includes("validation.uuid"),
  );
};

export default isUuidError;
