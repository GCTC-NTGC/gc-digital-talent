import { useIntl } from "react-intl";
import type { CombinedError } from "urql";

import { commonMessages } from "@gc-digital-talent/i18n";

interface ErrorMessageProps {
  error: CombinedError;
}

const ErrorMessage = ({ error }: ErrorMessageProps) => {
  const intl = useIntl();
  return (
    <p aria-live="polite">
      {intl.formatMessage(commonMessages.loadingError)}
      {error.message}
    </p>
  );
};

export default ErrorMessage;
