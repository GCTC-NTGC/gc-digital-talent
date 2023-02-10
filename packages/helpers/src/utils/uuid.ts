import { GraphQLError } from "graphql";
import { CombinedError } from "urql";

interface ErrorWithDebugMessage extends Error {
  debugMessage?: string;
}

interface GraphqlErrorWithDebugMessage extends GraphQLError {
  originalError: ErrorWithDebugMessage | undefined;
}

const isUuidError = (combinedError: CombinedError | undefined) => {
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

export default isUuidError;
