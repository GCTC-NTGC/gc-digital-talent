import { GraphQLErrorExtensions } from "graphql";

// corresponds to the ClientSafeTooManyRequestsException
export interface TooManyRequestsExtension {
  remaining_seconds: number;
}

export function getTooManyRequestsExtension(
  extensions: GraphQLErrorExtensions,
): TooManyRequestsExtension | null {
  if (extensions.too_many_requests) {
    // we have the extension, so cast it
    return extensions.too_many_requests as TooManyRequestsExtension;
  }
  return null;
}
