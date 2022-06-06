import React from "react";
import { useIntl } from "react-intl";
import type { CombinedError } from "urql";

import { commonMessages } from "../../messages";

interface ErrorMessageProps {
  error: CombinedError;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  const intl = useIntl();
  return (
    <p aria-live="polite">
      {intl.formatMessage(commonMessages.loadingError)}
      {error.message}
    </p>
  );
};

export default ErrorMessage;
