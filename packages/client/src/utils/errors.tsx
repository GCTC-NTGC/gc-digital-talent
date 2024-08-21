import { GraphQLError } from "graphql";
import { CombinedError } from "urql";
import { IntlShape } from "react-intl";
import { ReactNode } from "react";

import { getLocale, tryFindMessageDescriptor } from "@gc-digital-talent/i18n";

export const extractErrorMessages = (combinedError: CombinedError) =>
  combinedError.graphQLErrors.flatMap((error) => error.message);

// type guard for non-nullable object
const isNotNullObject = (value: unknown): value is NonNullable<object> => {
  return value !== null && value !== undefined && typeof value === "object";
};

// expected shape of validation extension, returned as type unknown
interface ExtensionWithValidation {
  validation: Array<{ [attributeName: string]: Array<string> }>;
}

// custom type guard for expected validation extension shape
const isExtensionWithValidation = (
  value: unknown,
): value is ExtensionWithValidation => {
  if (isNotNullObject(value) && "validation" in value) {
    const value2 = value as { validation: unknown }; // type narrow for tested property
    return (
      isNotNullObject(value2.validation) &&
      Object.values(value2.validation).every(
        (property) =>
          Array.isArray(property) &&
          property.every(
            (message) =>
              typeof message === "string" || typeof message === "object",
          ),
      )
    );
  }
  return false;
};

// grab the validation extension error messages out of the combined error
export const extractValidationMessageKeys = (
  combinedError: CombinedError,
): string[] => {
  const errorExtensions = combinedError.graphQLErrors.flatMap(
    (error) => error.extensions,
  );
  const validationMessages = errorExtensions
    .filter(isExtensionWithValidation)
    .flatMap((validationExtension) => validationExtension.validation)
    .flatMap((validationObject) => Object.values(validationObject))
    .flat();

  return validationMessages;
};

// Accepts a list of error messages, localizes them, and returns a formatted ReactNode for toasting
export const buildValidationErrorMessageNode = (
  errorMessages: Array<string>,
  intl: IntlShape,
): ReactNode => {
  const locale = getLocale(intl);
  const localizedMessages = errorMessages.map((errorMessage) => {
    if (typeof errorMessage === "object" && locale in errorMessage) {
      return errorMessage[locale];
    }
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

/**
 * Contains auth error
 *
 * Determine if one of the errors we received
 * is related to authentication
 */
export const containsAuthenticationError = (
  combinedError: CombinedError | undefined,
) => {
  return combinedError?.graphQLErrors.some((graphQLError) => {
    return Object.values(graphQLError.extensions).some((extension) => {
      return ["invalid_token", "token_validation"].includes(String(extension));
    });
  });
};

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
