import React from "react";
import { GraphQLError, GraphQLErrorExtensions } from "graphql";
import { CombinedError } from "urql";
import { IntlShape } from "react-intl";

import { tryFindMessageDescriptor } from "../messages/apiMessages";

type ValidationExtension = {
  validation: { [key: string]: [string] };
  category: string;
};

// type guard to ensure the error extension looks like our ValidationExtension type
export function isValidationExtension(
  extension: GraphQLErrorExtensions,
): extension is ValidationExtension {
  return (
    (extension as ValidationExtension) !== undefined &&
    extension.category === "validation"
  );
}

// Accepts a CombinedError object and finds the validation error messages
export const extractValidationErrorMessages = (combinedError: CombinedError) =>
  combinedError.graphQLErrors
    .filter((graphQLError) => isValidationExtension(graphQLError.extensions))
    .flatMap((graphQLError) => {
      const validationExtension =
        graphQLError.extensions as ValidationExtension;
      return Object.keys(validationExtension.validation).map(
        // one key per validation rule like "user.sub" or "user.email"
        (key) => validationExtension.validation[key],
      );
    })
    // Each rule has an array for possibly multiple error messages
    .flatMap((messageArrays) => messageArrays);

// Accepts a list of error messages, localizes them, and returns a formatted ReactNode for toasting
export const buildValidationErrorMessageNode = (
  errorMessages: Array<string>,
  intl: IntlShape,
): React.ReactNode => {
  const localizedMessages = errorMessages.map((errorMessage) => {
    const localizedMessageDescriptor = tryFindMessageDescriptor(errorMessage);
    if (localizedMessageDescriptor) {
      return intl.formatMessage(localizedMessageDescriptor);
    }
    return errorMessage;
  });

  // if more than 1, toast a list
  if (localizedMessages.length > 1) {
    return (
      <ul>
        {localizedMessages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    );
  }

  // if just 1, toast by itself
  if (localizedMessages.length === 1) {
    return <span>{localizedMessages[0]}</span>;
  }

  // no messages, no returned node
  return null;
};

interface ErrorWithDebugMessage extends Error {
  debugMessage?: string;
}
interface GraphqlErrorWithDebugMessage extends GraphQLError {
  originalError: ErrorWithDebugMessage | undefined;
}

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
