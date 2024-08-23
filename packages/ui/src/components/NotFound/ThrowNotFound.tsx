import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

interface ThrowNotFoundProps {
  message?: string;
}

const ThrowNotFound = ({ message }: ThrowNotFoundProps) => {
  const intl = useIntl();

  // NOTE: Used by react-router as a 404 error
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw new Response("", {
    status: 404,
    statusText: message || intl.formatMessage(commonMessages.notFound),
  });
};

export default ThrowNotFound;
