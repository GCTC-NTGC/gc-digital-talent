import React from "react";
import { GraphQLError } from "graphql";
import { CombinedError } from "urql";
import { IntlShape } from "react-intl";

import { tryFindMessageDescriptor } from "@gc-digital-talent/i18n";

export const extractErrorMessages = (combinedError: CombinedError) =>
  combinedError.graphQLErrors.flatMap((error) => error.message);

// grab the validation error enums to map them to messages, guarding against possible missing fields
export const extractValidationMessageKeys = (
  combinedError: CombinedError,
): string[] | null => {
  const { extensions } = combinedError.graphQLErrors[0];
  if (extensions && extensions.validation) {
    const validationObject = extensions.validation as object;
    const arrayOfValuesFlattened = Object.values(
      validationObject,
    ).flat() as string[];
    if (arrayOfValuesFlattened && arrayOfValuesFlattened.length > 0) {
      return arrayOfValuesFlattened;
    }
  }
  return null;
};

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
