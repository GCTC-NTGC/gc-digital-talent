import { useIntl } from "react-intl";
import { CombinedError } from "urql";
import { FieldError } from "react-hook-form";

import { extractValidationMessageKeys } from "@gc-digital-talent/client";

import {
  ErrorMessages,
  ErrorSeverity,
  ErrorSeverities,
  ErrorMessage as TErrorMessage,
} from "./types";

interface ErrorMessageProps {
  id?: string;
  hasInputErrors?: boolean;
  message: TErrorMessage;
  severity?: ErrorSeverity;
}

const ErrorMessage = ({
  message,
  id,
  hasInputErrors = false,
  severity = "error",
}: ErrorMessageProps) => (
  <div id={id}>
    {message.title && (
      <p
        data-h2-font-weight="base(700)"
        data-h2-margin-bottom="base(x.5)"
        {...(hasInputErrors
          ? {
              "data-h2-color": "base(error.darkest)",
            }
          : {
              "data-h2-color": "base(error) base:dark(error.lightest)",
            })}
        {...(severity === "error"
          ? {
              "data-h2-color": "base(error)",
            }
          : {
              "data-h2-color": "base(warning.darker) base:dark(warning)",
            })}
      >
        {message.title}
      </p>
    )}
    {message.body}
  </div>
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
          "It appears that this work email address isn't linked to a profile. Try searching for another email address or provide the information requested.",
        id: "fDwDJU",
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
    NOT_VERIFIED_GOVERNMENT_EMPLOYEE: {
      title: intl.formatMessage({
        defaultMessage: "This user hasn't verified their employee status",
        id: "zVGK45",
        description: "Label for when an employee was found but not verified",
      }),
      body: intl.formatMessage({
        defaultMessage:
          "We found a user with the email address provided, but they haven’t confirmed their status as an employee. Only verified employees can be nominated at this time. The user can verify their status as an employee by logging into the platform and verifying their work email.",
        id: "Ney+Il",
        description:
          "Description of default message when user was found but not a verified employee",
      }),
    },
  };
};

interface ErrorProps {
  id?: string;
  email?: string;
  inputErrors?: FieldError[];
  error?: CombinedError | string[] | null;
  messages?: Partial<ErrorMessages>;
  severities?: Partial<ErrorSeverities>;
}

const Error = ({
  id,
  email,
  error,
  inputErrors,
  messages,
  severities,
}: ErrorProps) => {
  const defaultMessages = useDefaultMessages(email);
  const errorMessages = { ...defaultMessages, ...messages };
  if (!error && !inputErrors) return null;

  const sharedProps = {
    id,
    hasInputErrors: !!inputErrors,
  };

  if (error) {
    let errorCodes: string[] | undefined;
    if (Array.isArray(error)) {
      errorCodes = error;
    } else {
      errorCodes = extractValidationMessageKeys(error);
    }

    if (errorCodes?.includes("NotGovernmentEmail")) {
      return (
        <ErrorMessage
          {...sharedProps}
          severity={severities?.NOT_GOVERNMENT_EMAIL}
          message={errorMessages.NOT_GOVERNMENT_EMAIL}
        />
      );
    }

    if (errorCodes?.includes("NotVerifiedGovEmployee")) {
      return (
        <ErrorMessage
          {...sharedProps}
          severity={severities?.NOT_VERIFIED_GOVERNMENT_EMPLOYEE}
          message={errorMessages.NOT_VERIFIED_GOVERNMENT_EMPLOYEE}
        />
      );
    }

    if (errorCodes?.includes("NoProfile")) {
      return (
        <ErrorMessage
          {...sharedProps}
          severity={severities?.NO_PROFILE}
          message={{
            title: defaultMessages.NO_PROFILE.title,
            ...errorMessages.NO_PROFILE,
          }}
        />
      );
    }
  }

  if (inputErrors) {
    return (
      <div
        id={id}
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.5)"
        data-h2-color="base(error.darkest)"
      >
        {inputErrors.map((err) => (
          <p key={err.type}>{err.message}</p>
        ))}
      </div>
    );
  }

  return null;
};

export default Error;
