import type { GraphQLError } from "graphql";
import type { CombinedError } from "urql";

interface ErrorWithDebugMessage extends Error {
  debugMessage?: string;
}

interface GraphqlErrorWithDebugMessage extends GraphQLError {
  originalError: ErrorWithDebugMessage | undefined;
}

const uuidRegEx =
  /^[\da-fA-F]{8}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{12}$/;

export const isUUID = (str: string): boolean => {
  return !!uuidRegEx.exec(str);
};

export const isUuidError = (combinedError: CombinedError | undefined) => {
  /**
   * Note: For some reason our api returns debugMessage on the
   * Error type rather than cause, so we need to cast it here
   */
  return combinedError?.graphQLErrors?.some(
    (error: GraphqlErrorWithDebugMessage) => {
      return error?.originalError?.debugMessage?.includes("validation.uuid");
    },
  );
};
