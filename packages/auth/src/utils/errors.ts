import { CombinedError } from "urql";

/**
 * Contains auth error
 *
 * Determine if one of the errors we received
 * is related to the user being deleted
 */
export const containsUserDeletedError = (
  combinedError: CombinedError | undefined,
) => {
  return combinedError?.graphQLErrors.some((graphQLError) => {
    return Object.values(graphQLError.extensions).some((extension) => {
      return ["user_deleted"].includes(String(extension));
    });
  });
};
