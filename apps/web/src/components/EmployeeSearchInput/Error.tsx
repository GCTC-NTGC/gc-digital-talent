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

interface ErrorMessageProps {
  email?: string;
  error?: CombinedError;
}

export const ErrorMessage = ({ email, error }: ErrorMessageProps) => {
  const intl = useIntl();

  if (!error) return null;

  const errorCodes = extractValidationMessageKeys(error);

  if (errorCodes?.includes("NotGovernmentEmail")) {
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
  }

  return null;
};
