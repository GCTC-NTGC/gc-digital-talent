import { ReactNode } from "react";
import { useIntl } from "react-intl";
import { CombinedError } from "urql";

import { extractValidationMessageKeys } from "@gc-digital-talent/client";

interface ErrorTitleProps {
  children: ReactNode;
}

export const ErrorTitle = ({ children }: ErrorTitleProps) => (
  <p
    data-h2-font-weight="base(700)"
    data-h2-margin-bottom="base(x.5)"
    data-h2-color="base(error)"
  >
    {children}
  </p>
);

interface NullResponseErrorProps {
  email?: string;
}

const NullResponseError = ({ email }: NullResponseErrorProps) => {
  const intl = useIntl();
  return (
    <>
      <ErrorTitle>
        {intl.formatMessage(
          {
            defaultMessage: "We couldn't find a matching profile for “{email}”",
            id: "D8FjlJ",
            description: "Error message when an employee could not be found",
          },
          { email },
        )}
      </ErrorTitle>
    </>
  );
};

interface NotGovernmentEmailErrorProps {
  email?: string;
}

export const NotGovernmentEmailError = ({
  email,
}: NotGovernmentEmailErrorProps) => {
  const intl = useIntl();

  return (
    <>
      <ErrorTitle>
        {intl.formatMessage(
          {
            defaultMessage:
              "“{email}” isn’t a valid Government of Canada email address",
            id: "tmFU3R",
            description: "Label for when an employee was found",
          },
          { email },
        )}
      </ErrorTitle>
    </>
  );
};

interface ErrorMessageProps {
  email?: string;
  error?: CombinedError | string[];
  isNullResponse?: boolean;
}

export const ErrorMessage = ({
  email,
  error,
  isNullResponse,
}: ErrorMessageProps) => {
  if (!error && !isNullResponse) return null;
  let errorCodes: string[] | undefined;

  if (isNullResponse) {
    return <NullResponseError />;
  }

  if (error) {
    if (Array.isArray(error)) {
      if (error.includes("isGovEmail")) {
        errorCodes = ["NotGovernmentEmail"];
      }
    } else {
      errorCodes = extractValidationMessageKeys(error);
    }

    if (errorCodes?.includes("NotGovernmentEmail")) {
      return <NotGovernmentEmailError email={email} />;
    }
  }

  return null;
};
