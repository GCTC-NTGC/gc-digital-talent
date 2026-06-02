import type { GraphQLErrorExtensions } from "graphql";

// corresponds to the ClientSafeTooManyRequestsException
const tooManyRequestsKey = "too_many_requests";
interface TooManyRequestsExtension {
  remaining_seconds: number;
}

export function getTooManyRequestsExtension(
  extensions: GraphQLErrorExtensions,
): TooManyRequestsExtension | null {
  if (extensions[tooManyRequestsKey]) {
    // we have the extension, so cast it
    return extensions[tooManyRequestsKey] as TooManyRequestsExtension;
  }
  return null;
}

// corresponds to the ValidationException
const validationKey = "validation";
type ValidationExtension = Record<string, string[]>;

export function getValidationExtension(
  extensions: GraphQLErrorExtensions,
): ValidationExtension | null {
  if (extensions[validationKey]) {
    // we have the extension, so cast it
    return extensions[validationKey] as ValidationExtension;
  }
  return null;
}
