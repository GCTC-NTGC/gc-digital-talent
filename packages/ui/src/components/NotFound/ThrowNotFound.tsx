import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { NotFoundError } from "@gc-digital-talent/helpers";

interface ThrowNotFoundProps {
  message?: string;
}

const ThrowNotFound = ({ message }: ThrowNotFoundProps) => {
  const intl = useIntl();
  throw new NotFoundError(
    message ?? intl.formatMessage(commonMessages.notFound),
  );
};

export default ThrowNotFound;
