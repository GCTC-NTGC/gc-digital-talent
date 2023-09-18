/* eslint-disable import/prefer-default-export */
import { CombinedError } from "urql";

/**
 * Contains user deleted error
 *
 * Determine if one of the errors we received
 * is related to the user being deleted
 */
export const containsUserDeletedError = (
  combinedError: CombinedError | undefined,
) => {
  return combinedError?.graphQLErrors.some((graphQLError) => {
    return Object.values(graphQLError.extensions).some((extension) => {
      return typeof extension === "string" && extension === "user_deleted";
    });
  });
};
