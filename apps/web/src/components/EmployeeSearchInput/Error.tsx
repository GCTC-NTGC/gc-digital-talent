import { useIntl } from "react-intl";
import { CombinedError } from "urql";

import { extractValidationMessageKeys } from "@gc-digital-talent/client";

import { ErrorMessages, ErrorMessage as TErrorMessage } from "./types";

interface ErrorMessageProps {
  message: TErrorMessage;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <>
    {message.title && (
      <p
        data-h2-font-weight="base(700)"
        data-h2-margin-bottom="base(x.5)"
        data-h2-color="base(error)"
      >
        {message.title}
      </p>
    )}
    {message.body}
  </>
);

const useDefaultMessages = (email: string | undefined): ErrorMessages => {
  const intl = useIntl();
  return {
    NO_PROFILE: {
      title: intl.formatMessage(
        {
          defaultMessage: "We couldn't find a matching profile for “{email}”",
          id: "dOw5u/",
          description:
            "Default error message when an employee could not be found",
        },
        { email },
      ),
      body: intl.formatMessage({
        defaultMessage:
          "It appears that this work email address isn't linked to a profile. Try searching for another email address or provide the information requested. Once you submit your nomination form, we’ll notify them by email.",
        id: "OcN4TN",
        description:
          "Description of default error message when an employee could not be found",
      }),
    },
    NOT_GOVERNMENT_EMAIL: {
      title: intl.formatMessage(
        {
          defaultMessage:
            "“{email}” isn’t a valid Government of Canada email address",
          id: "tmFU3R",
          description: "Label for when an employee was found",
        },
        { email },
      ),
      body: intl.formatMessage({
        defaultMessage:
          "It appears that the email entered isn’t a valid Government of Canada email address. Please double check the email is typed correctly, try a different work email address, or reach out to support if you feel this is an error.",
        id: "iIT3zx",
        description:
          "Description of default message when an email is not a government of Canada email",
      }),
    },
  };
};

interface ErrorProps {
  email?: string;
  error?: CombinedError | string[] | null;
  messages?: Partial<ErrorMessages>;
}

const Error = ({ email, error, messages }: ErrorProps) => {
  const defaultMessages = useDefaultMessages(email);
  const errorMessages = { ...defaultMessages, ...messages };
  if (!error) return null;

  let errorCodes: string[] | undefined;
  if (Array.isArray(error)) {
    errorCodes = error;
  } else {
    errorCodes = extractValidationMessageKeys(error);
  }

  if (errorCodes?.includes("NotGovernmentEmail")) {
    return <ErrorMessage message={errorMessages.NOT_GOVERNMENT_EMAIL} />;
  }

  if (errorCodes?.includes("NoProfile")) {
    return (
      <ErrorMessage
        message={{
          title: defaultMessages.NO_PROFILE.title,
          ...errorMessages.NO_PROFILE,
        }}
      />
    );
  }

  return null;
};

export default Error;
